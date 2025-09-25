import { boolean, enums, number, object, optional, string } from "@deps";

export const countValidator = () => {
	return object({
		set: object({
			// --- Comment content filters ---
			text: optional(string()),
			status: optional(string()),
			rating: optional(number()),
			is_anonymous: optional(boolean()),

			// --- Related entity filters ---
			place: optional(string()),
			user: optional(string()),
		}),
		get: object({
			total: optional(enums([0, 1])),
			filtered: optional(enums([0, 1])),
		}),
	});
};
