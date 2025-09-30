import { number, object, objectIdValidation, optional, string } from "@deps";
import { selectStruct } from "../../../mod.ts";

export const getsValidator = () => {
	return object({
		set: object({
			page: number(),
			limit: number(),
			name: optional(string()),
			placeId: optional(objectIdValidation),
		}),
		get: selectStruct("virtual_tour", 2),
	});
};
