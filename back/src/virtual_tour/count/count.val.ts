import { enums, object, objectIdValidation, optional, string } from "@deps";

export const countValidator = () => {
	return object({
		set: object({
			name: optional(string()),
			placeId: optional(objectIdValidation),
		}),
		get: object({ qty: optional(enums([0, 1])) }),
	});
};
