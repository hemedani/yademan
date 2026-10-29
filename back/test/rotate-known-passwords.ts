/**
 * One-off ops utility: rotate the passwords of accounts whose credentials are
 * published in this repository, so they cannot be used against a public host.
 *
 *   deno run -A --env-file=/home/syd/work/yademan.env \
 *     test/rotate-known-passwords.ts e2e@naghshe.dev editor@naghshe.dev
 *
 * Passwords are **generated here**, never passed in: a secret in argv is
 * visible in `ps` and lands in shell history.
 *
 * Only the `password` field is touched — names, levels and relations stay as
 * they are, so demo records keep their owner.
 */
// Same client as `bootstrap.ts`: Lesan re-exports a configured driver, and the
// bare `@db/mongo` class does not accept a URI in its constructor.
import { MongoClient } from "../deps.ts";
import { hash } from "@da/bcrypt";

const MONGO_URI = Deno.env.get("MONGO_URI") ?? "mongodb://127.0.0.1:27017/";
const DB_NAME = "yademan";

/** 20 chars from an unambiguous alphabet, ~118 bits. */
const ALPHABET =
	"abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#%^&*";
const generatePassword = (): string => {
	const bytes = crypto.getRandomValues(new Uint8Array(20));
	return Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
};

const emails = Deno.args.filter((arg) => arg.includes("@"));
if (emails.length === 0) {
	console.error("usage: rotate-known-passwords.ts <email> [email...]");
	Deno.exit(1);
}

const client = new MongoClient(MONGO_URI);
await client.connect();
const db = client.db(DB_NAME);

const rotated: [string, string][] = [];

for (const email of emails) {
	const password = generatePassword();
	const passwordHash = await hash(password);

	const result = await db.collection("user").updateOne(
		{ email },
		{ $set: { password: passwordHash, updatedAt: new Date() } },
	);

	if (result.matchedCount === 0) {
		console.error(`[rotate] ${email}: no such account — skipped`);
		Deno.exitCode = 1;
		continue;
	}
	rotated.push([email, password]);
}

client.close();

if (rotated.length > 0) {
	console.log(
		"\nNew credentials (store them now, they are not recoverable):\n",
	);
	for (const [email, password] of rotated) {
		console.log(`  ${email.padEnd(28)} ${password}`);
	}
	console.log();
}
