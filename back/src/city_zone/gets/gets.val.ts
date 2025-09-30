import { number, object, objectIdValidation, optional, string } from "@deps";
import { selectStruct } from "../../../mod.ts";

export const getsValidator = () => {
	return object({
		set: object({
			page: number(),
			limit: number(),
			name: optional(string()),
			provinceId: optional(objectIdValidation),
			cityId: optional(objectIdValidation),
		}),
		get: selectStruct("city_zone", 2),
	});
};
