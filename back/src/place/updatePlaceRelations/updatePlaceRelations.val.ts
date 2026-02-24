import { array, object, objectIdValidation, optional } from "@deps";
import { selectStruct } from "../../../mod.ts";

export const updatePlaceRelationsValidator = () => {
	return object({
		set: object({
			_id: objectIdValidation,
			province: optional(objectIdValidation),
			city: optional(objectIdValidation),
			category: optional(objectIdValidation),
			tags: optional(array(objectIdValidation)),
			thumbnail: optional(objectIdValidation),
			gallery: optional(array(objectIdValidation)),
		}),
		get: selectStruct("place", 1),
	});
};
