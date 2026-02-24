import { array, object, objectIdValidation, optional } from "@deps";
import { selectStruct } from "../../../mod.ts";

export const removePlaceRelationsValidator = () => {
	return object({
		set: object({
			_id: objectIdValidation,
			tags: optional(array(objectIdValidation)),
			gallery: optional(array(objectIdValidation)),
		}),
		get: selectStruct("place", 1),
	});
};
