import { enums, object, optional } from "@deps";

export const seedValidator = () => {
	return object({
		set: object({}),
		get: object({
			provincesCreated: optional(enums([0, 1])),
			citiesCreated: optional(enums([0, 1])),
		}),
	});
};
