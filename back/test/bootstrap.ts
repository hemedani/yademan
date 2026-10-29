/**
 * Prepares a database so the JSON suites in this folder can run.
 *
 * The playground E2E runner can only send `application/json` requests, so it
 * cannot call `file.uploadFile` (which needs multipart) and it has no way to
 * mint a first account (`user.tempUser` only works on an empty collection).
 * This script fills that gap exactly once:
 *
 *   1. upserts the account both suites log in with,
 *   2. writes a small pool of placeholder media to `uploads/` and registers the
 *      matching `file` documents under fixed ObjectIds.
 *
 * The fixed ids let the JSON suites reference media without an upload step, so
 * `virtual_tour.add`, `place.add` thumbnails/galleries and `event.add` media
 * can all be covered.
 *
 * Usage (from the `back/` directory):
 *   deno run -A test/bootstrap.ts
 *   deno run -A test/bootstrap.ts --email me@example.com --password 'S3cret!!' --level Ghost
 *
 * Environment: MONGO_URI, MONGO_DB, E2E_EMAIL, E2E_PASSWORD, E2E_LEVEL.
 */

import { MongoClient, ObjectId } from "../deps.ts";
import { hash } from "@da/bcrypt";

const args = Deno.args;
const flag = (name: string): string | undefined => {
	const idx = args.indexOf(`--${name}`);
	return idx === -1 ? undefined : args[idx + 1];
};

const MONGO_URI = Deno.env.get("MONGO_URI") ?? "mongodb://127.0.0.1:27017/";
const DB_NAME = Deno.env.get("MONGO_DB") ?? "yademan";

const EMAIL = flag("email") ?? Deno.env.get("E2E_EMAIL") ??
	// `emailPattern` in models/user.ts only accepts a 2-4 character TLD, so
	// `.local` (5 chars) would be rejected by `user.login` and `user.addUser`.
	"e2e@naghshe.dev";
const PASSWORD = flag("password") ?? Deno.env.get("E2E_PASSWORD") ??
	"E2ePassword123!";
const LEVEL = flag("level") ?? Deno.env.get("E2E_LEVEL") ?? "Manager";

/**
 * `Ghost` bypasses every `grantAccess` check, which makes the suites brittle if
 * the account ever leaks. `Manager` is enough for every act we exercise.
 */
const VALID_LEVELS = ["Ghost", "Manager", "Editor", "Ordinary"];
if (!VALID_LEVELS.includes(LEVEL)) {
	throw new Error(
		`--level must be one of ${VALID_LEVELS.join(", ")} (got "${LEVEL}")`,
	);
}

if (PASSWORD.length < 8) {
	// `user.login` validates `password` with size(string(), 8, 100).
	throw new Error("password must be at least 8 characters");
}

/** Deterministic media ids: `00000000000000000000a1NN`. */
export const mediaId = (index: number): string =>
	`00000000000000000000a1${String(index).padStart(2, "0")}`;

/**
 * Enough placeholders for the presentation seed (12 places × thumbnail + 2
 * gallery images) plus a few spare for the E2E suite.
 */
export const MEDIA_COUNT = 40;

const PALETTE = [
	["#0f766e", "#14b8a6"],
	["#7c2d12", "#ea580c"],
	["#1e3a8a", "#3b82f6"],
	["#4c1d95", "#8b5cf6"],
	["#831843", "#ec4899"],
	["#14532d", "#22c55e"],
	["#78350f", "#f59e0b"],
	["#134e4a", "#2dd4bf"],
	["#1e293b", "#64748b"],
	["#7f1d1d", "#ef4444"],
	["#365314", "#84cc16"],
	["#312e81", "#6366f1"],
];

/**
 * A self-contained placeholder image. SVG keeps the repository free of binary
 * fixtures while still rendering as a real picture through `/api/image-proxy`.
 */
const placeholderSvg = (index: number): string => {
	const [from, to] = PALETTE[index % PALETTE.length];
	const n = String(index + 1).padStart(2, "0");
	return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${from}"/>
      <stop offset="100%" stop-color="${to}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="800" fill="url(#g)"/>
  <circle cx="960" cy="170" r="130" fill="#ffffff" opacity="0.14"/>
  <circle cx="200" cy="660" r="220" fill="#ffffff" opacity="0.08"/>
  <text x="72" y="720" font-family="Georgia, serif" font-size="132" fill="#ffffff" opacity="0.92">Naghshe</text>
  <text x="76" y="770" font-family="system-ui, sans-serif" font-size="34" fill="#ffffff" opacity="0.7">placeholder image ${n}</text>
</svg>`;
};

const client = new MongoClient(MONGO_URI);
await client.connect();
const db = client.db(DB_NAME);

// ---------------------------------------------------------------------------
// 1. Account
// ---------------------------------------------------------------------------

const passwordHash = await hash(PASSWORD);

const existing = await db.collection("user").findOne({ email: EMAIL });

const userDoc = {
	first_name: "E2E",
	last_name: "Runner",
	father_name: "Automation",
	gender: "Male",
	birth_date: null,
	summary: "Account used by the automated backend suites.",
	address: "N/A",
	level: LEVEL,
	email: EMAIL,
	password: passwordHash,
	is_verified: true,
	updatedAt: new Date(),
};

let userId: ObjectId;
if (existing) {
	// Always reset the password/level so a stale account cannot lock the suites
	// out after a manual edit.
	await db.collection("user").updateOne({ _id: existing._id }, {
		$set: userDoc,
	});
	userId = existing._id as ObjectId;
	console.log(`[bootstrap] updated account ${EMAIL} (level ${LEVEL})`);
} else {
	const inserted = await db.collection("user").insertOne({
		...userDoc,
		createdAt: new Date(),
	});
	userId = inserted.insertedId;
	console.log(`[bootstrap] created account ${EMAIL} (level ${LEVEL})`);
}

// ---------------------------------------------------------------------------
// 2. Placeholder media
// ---------------------------------------------------------------------------

const uploader = {
	_id: userId,
	first_name: userDoc.first_name,
	last_name: userDoc.last_name,
	gender: userDoc.gender,
	email: userDoc.email,
	level: LEVEL,
	is_verified: true,
};

const files = db.collection("file");

for (let index = 0; index < MEDIA_COUNT; index++) {
	const id = new ObjectId(mediaId(index));
	const name = `placeholder-${String(index + 1).padStart(2, "0")}.svg`;
	const svg = placeholderSvg(index);

	await Deno.mkdir("uploads/images", { recursive: true });
	await Deno.writeTextFile(`uploads/images/${name}`, svg);

	await files.updateOne({ _id: id }, {
		$set: {
			name,
			mimType: "image/svg+xml",
			size: svg.length,
			alt_text: `Naghshe placeholder image ${index + 1}`,
			uploader,
			updatedAt: new Date(),
		},
		$setOnInsert: { _id: id, createdAt: new Date() },
	}, { upsert: true });
}

console.log(
	`[bootstrap] ensured ${MEDIA_COUNT} media files (ids ${mediaId(0)}…${
		mediaId(MEDIA_COUNT - 1)
	})`,
);
console.log("");
console.log("Both suites log in with:");
console.log(`  email    ${EMAIL}`);
console.log(`  password ${PASSWORD}`);
console.log("");

await client.close();
