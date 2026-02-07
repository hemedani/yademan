import { array, object, objectIdValidation, optional } from "@deps";
import { selectStruct } from "../../../mod.ts";
import { place_pure } from "@model";

export const addValidator = () => {
	return object({
		set: object({
			...place_pure,
			province: objectIdValidation,
			city: objectIdValidation,
			category: objectIdValidation,
			tags: optional(array(objectIdValidation)),
			gallery: optional(array(objectIdValidation)),
			thumbnail: optional(objectIdValidation),
		}),
		get: selectStruct("place", 1),
	});
};
