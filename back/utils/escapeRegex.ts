/**
 * Escapes RegExp metacharacters so that user-supplied search text is matched
 * literally.
 *
 * Without this, a value such as `(` or `[` throws a `SyntaxError` while the
 * query is being built (surfacing as a 500), and patterns like `(a+)+$` open a
 * ReDoS vector against the database.
 */
export const escapeRegex = (value: string): string =>
	value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Builds a case-insensitive "contains" matcher for user search input.
 * The input is trimmed and escaped, so it can never be interpreted as a
 * regular expression.
 */
export const containsRegex = (value: string): RegExp =>
	new RegExp(escapeRegex(value.trim()), "i");
