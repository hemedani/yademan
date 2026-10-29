/**
 * Headless equivalent of the Lesan playground E2E runner.
 *
 * The playground (`/playground` → E2E tab) is the primary way to run the JSON
 * suites, but it is a browser UI: it cannot run in CI and it prints results
 * rather than failing a build. This script implements the same request
 * semantics — capture substitution, `expectedFailure` matching, `repeat` — so
 * the suites can be verified from a terminal.
 *
 * Usage (from the `back/` directory, with the backend running):
 *   deno run -A test/run-e2e.ts
 *   deno run -A test/run-e2e.ts --file test/seed-presentation.json
 *   deno run -A test/run-e2e.ts --base http://127.0.0.1:1405/ --verbose
 *
 * The playground can only send `application/json`, so `file.uploadFile` is not
 * covered by the JSON suites. Pass `--with-upload` to exercise it as an extra
 * multipart check using the token captured from the suite.
 */

type Capture = { key: string; value: string };

type E2eForm = {
	id: string;
	bodyHeaders: string;
	repeat: number;
	captures: Capture[];
	expectedFailure?: { message: string };
};

const args = Deno.args;
const hasFlag = (name: string) => args.includes(`--${name}`);
const flagValue = (name: string): string | undefined => {
	const idx = args.indexOf(`--${name}`);
	return idx === -1 ? undefined : args[idx + 1];
};

const FILE = flagValue("file") ?? "test/E2E.json";
const BASE = (flagValue("base") ?? "http://localhost:1405/").replace(
	/\/*$/,
	"/",
);
const VERBOSE = hasFlag("verbose");
const WITH_UPLOAD = hasFlag("with-upload");

const raw = await Deno.readTextFile(FILE);
const forms = JSON.parse(raw) as E2eForm[];

if (!Array.isArray(forms) || forms.length === 0) {
	throw new Error(`${FILE} does not contain a non-empty array`);
}

/** `"[body][token]"` → `["body", "token"]`, mirroring the playground parser. */
const parseCapturePath = (value: string): (string | number)[] => {
	const parts = value.split("[");
	const path: (string | number)[] = [];
	for (const part of parts) {
		const cut = part.slice(0, part.indexOf("]"));
		path.push(/^-?\d+$/.test(cut) ? Number(cut) : cut);
	}
	path.shift();
	return path;
};

const captures = new Map<string, unknown>();

/**
 * Replaces every `{name}` placeholder with the value captured earlier.
 * Numbers that arrive as strings (because they were interpolated into a string)
 * are coerced back, exactly like the playground does.
 */
const substitute = (value: unknown): unknown => {
	if (Array.isArray(value)) return value.map(substitute);

	if (value && typeof value === "object") {
		const out: Record<string, unknown> = {};
		for (const [key, nested] of Object.entries(value)) {
			out[key] = substitute(nested);
		}
		return out;
	}

	if (typeof value !== "string" || !value.includes("{")) return value;

	let result = value;
	for (const [key, captured] of captures) {
		const placeholder = `{${key}}`;
		if (!result.includes(placeholder)) continue;

		const text = captured === undefined || captured === null
			? ""
			: String(captured);
		result = result.replaceAll(placeholder, text);
	}

	return /^-?\d+$/.test(result) ? Number(result) : result;
};

const isExpectedFailureMet = (
	expected: { message: string } | undefined,
	response: Record<string, unknown>,
): boolean => {
	if (!expected) return false;
	if (response.success !== false) return false;

	const wanted = expected.message?.trim();
	if (!wanted) return true;

	const actual = (response.body as Record<string, unknown> | undefined)
		?.message;
	return typeof actual === "string" && actual.includes(wanted);
};

type Row = { id: string; ok: boolean; detail: string; ms: number };
const rows: Row[] = [];

for (const form of forms) {
	let lastResponse: Record<string, unknown> = {};
	let ms = 0;
	let ok = true;
	let detail = "";

	const repeats = Math.max(1, form.repeat ?? 1);

	for (let run = 0; run < repeats; run++) {
		const parsed = substitute(JSON.parse(form.bodyHeaders)) as {
			headers?: Record<string, string>;
			body: unknown;
		};

		const started = performance.now();
		const response = await fetch(`${BASE}lesan`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				...parsed.headers,
			},
			body: JSON.stringify(parsed.body),
		});
		lastResponse = await response.json();
		ms = Math.round(performance.now() - started);

		const passed = form.expectedFailure
			? isExpectedFailureMet(form.expectedFailure, lastResponse)
			: lastResponse.success === true;

		if (!passed) {
			ok = false;
			const body = lastResponse.body as
				| Record<string, unknown>
				| undefined;
			const message = typeof body?.message === "string"
				? body.message
				: JSON.stringify(lastResponse.body)?.slice(0, 200);
			detail = form.expectedFailure
				? `expected failure "${form.expectedFailure.message}" but got success=${lastResponse.success} ${
					message ? `(${message})` : ""
				}`
				: `request failed: ${message}`;
			break;
		}

		if (form.expectedFailure) detail = "expected failure matched";
	}

	for (const capture of form.captures ?? []) {
		if (!capture.key || !capture.value) continue;

		let value: unknown = lastResponse;
		for (const step of parseCapturePath(capture.value)) {
			value = (value as Record<string, unknown> | undefined)?.[
				String(step)
			];
		}

		captures.set(capture.key, value);

		if (value === undefined) {
			ok = false;
			// Append instead of overwrite so a request failure stays visible.
			detail = `${
				detail ? `${detail}; ` : ""
			}capture "${capture.key}" resolved to undefined (${capture.value})`;
		}
	}

	rows.push({ id: form.id, ok, detail, ms });

	if (VERBOSE || !ok) {
		console.log(
			`${ok ? "PASS" : "FAIL"}  ${form.id.padEnd(42)} ${ms}ms${
				detail ? `  — ${detail}` : ""
			}`,
		);
	}
}

// ---------------------------------------------------------------------------
// Optional multipart check: `file.uploadFile` cannot be expressed as JSON.
// ---------------------------------------------------------------------------

let uploadOk: boolean | undefined;

if (WITH_UPLOAD) {
	const token = captures.get("token");

	if (typeof token !== "string" || !token) {
		uploadOk = false;
		console.log(
			"FAIL  file.uploadFile                             — no token captured; run E2E.json first",
		);
	} else {
		const png = Uint8Array.from(
			atob(
				"iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
			),
			(char) => char.charCodeAt(0),
		);

		const formData = new FormData();
		formData.set(
			"file",
			new File([png], "e2e-upload.png", {
				type: "image/png",
			}),
		);
		// Lesan reads the JSON envelope from the `lesan-body` part and appends
		// the whole `FormData` to `details.set.formData`.
		formData.set(
			"lesan-body",
			JSON.stringify({
				service: "main",
				model: "file",
				act: "uploadFile",
				details: {
					set: { type: "image" },
					get: { _id: 1, name: 1, mimType: 1, size: 1 },
				},
			}),
		);

		const response = await fetch(`${BASE}lesan`, {
			method: "POST",
			headers: { token },
			body: formData,
		});
		const payload = await response.json();
		uploadOk = payload.success === true;
		console.log(
			`${
				uploadOk
					? "PASS"
					: "FAIL"
			}  file.uploadFile                            ${
				uploadOk
					? `— stored as ${payload.body?.name}`
					: `— ${JSON.stringify(payload.body)}`
			}`,
		);

		// The multipart rejection paths must keep working too.
		const rejected = new FormData();
		rejected.set(
			"file",
			new File(["not an image"], "evil.svg", { type: "image/svg+xml" }),
		);
		rejected.set(
			"lesan-body",
			JSON.stringify({
				service: "main",
				model: "file",
				act: "uploadFile",
				details: { set: { type: "image" }, get: { _id: 1 } },
			}),
		);
		const rejectResponse = await fetch(`${BASE}lesan`, {
			method: "POST",
			headers: { token },
			body: rejected,
		});
		const rejectPayload = await rejectResponse.json();
		const rejectOk = rejectPayload.success === false &&
			String(rejectPayload.body?.message ?? "").includes(
				"unsupported file extension",
			);
		console.log(
			`${
				rejectOk
					? "PASS"
					: "FAIL"
			}  file.uploadFile-rejects-bad-extension   ${
				rejectOk
					? "— rejected as expected"
					: `— ${JSON.stringify(rejectPayload.body)}`
			}`,
		);

		uploadOk = uploadOk && rejectOk;
	}
}

// ---------------------------------------------------------------------------

const failed = rows.filter((row) => !row.ok);
const passed = rows.length - failed.length;
const totalMs = rows.reduce((sum, row) => sum + row.ms, 0);

console.log("");
console.log(
	`${FILE}: ${passed}/${rows.length} passed in ${
		(totalMs / 1000).toFixed(1)
	}s`,
);

if (captures.size > 0) {
	console.log(`captured: ${[...captures.keys()].join(", ")}`);
}

if (failed.length > 0) {
	console.log("");
	console.log("failed steps:");
	for (const row of failed) {
		console.log(`  - ${row.id}: ${row.detail}`);
	}
}

const exitCode = failed.length === 0 && uploadOk !== false ? 0 : 1;
Deno.exit(exitCode);
