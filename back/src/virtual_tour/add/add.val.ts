import { object, objectIdValidation } from "@deps";
import { selectStruct } from "../../../mod.ts";
import { virtual_tour_pure } from "@model";

export const addValidator = () => {
	return object({
		set: object({
			...virtual_tour_pure,
			placeId: objectIdValidation,
			panoramaId: objectIdValidation,
		}),
		get: selectStruct("virtual_tour", 1),
	});
};
