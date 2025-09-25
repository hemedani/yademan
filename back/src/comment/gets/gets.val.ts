import { boolean, number, object, optional, string } from "@deps";
import { selectStruct } from "../../../mod.ts";

export const getsValidator = () => {
	return object({
		set: object({
			// --- Pagination ---
			page: number(),
			limit: number(),

			// --- Comment content filters ---
			text: optional(string()),
			status: optional(string()),
			rating: optional(number()),
			is_anonymous: optional(boolean()),

			// --- Related entity filters ---
			place: optional(string()),
			user: optional(string()),
		}),
		get: selectStruct("comment", 2),
	});
};
