import { array, object, objectIdValidation, optional } from "@deps";
import { selectStruct } from "../../../mod.ts";
import { location_pure } from "@model";

export const addValidator = () => {
	return object({
		set: object({
			...location_pure,
			province: objectIdValidation,
			city: objectIdValidation,
			city_zone: objectIdValidation,
			category: objectIdValidation,
			tags: optional(array(objectIdValidation)),
		}),
		get: selectStruct("location", 1),
	});
};
