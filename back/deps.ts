// Lesan ODM + HTTP framework.
// Pinned to the JSR release so `deno.lock` records an integrity hash.
export * from "jsr:@hemedani/lesan@^0.2.4";

export * as jwt from "https://deno.land/x/djwt@v2.8/mod.ts";

/**
 * Lesan <=0.1.x re-exported `ensureDir` from std/fs. 0.2.x dropped it in favour
 * of a platform adapter that is not part of the public surface, so keep a tiny
 * local equivalent instead of pulling in all of `@std/fs`.
 */
export const ensureDir = (path: string): Promise<void> =>
	Deno.mkdir(path, { recursive: true }).then(() => {});
