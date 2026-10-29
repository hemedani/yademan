import { jwt } from "@deps";
import { coreApp } from "../mod.ts";
import { throwError } from "./throwError.ts";

const secretKey = Deno.env.get("TOKEN_KEY");
const isProduction = Deno.env.get("ENV") === "production";

// Signing with a hard-coded fallback would let anyone mint a `Ghost` token and
// bypass every `grantAccess` check. Refuse to boot rather than degrade silently.
if (!secretKey && isProduction) {
	throw new Error(
		"TOKEN_KEY is not set. Refusing to start in production with a default " +
			"JWT signing secret.",
	);
}

if (!secretKey) {
	console.warn(
		"[auth] TOKEN_KEY is not set; using an insecure development-only secret.",
	);
}

const encoder = new TextEncoder();
const keyBuf = encoder.encode(secretKey || "development-only-insecure-secret");
export const jwtTokenKey = await crypto.subtle.importKey(
	"raw",
	keyBuf,
	{ name: "HMAC", hash: "SHA-512" },
	true,
	["sign", "verify"],
);

export const setTokens = async () => {
	const { Headers } = coreApp.contextFns.getContextModel();
	const token = Headers.get("token");

	const verifingToken = async () => {
		const verifyToke = await jwt.verify(token as string, jwtTokenKey);
		coreApp.contextFns.setContext({ user: verifyToke });
	};

	token ? await verifingToken() : throwError(
		"you should send your id with token key in req header",
	);
};
