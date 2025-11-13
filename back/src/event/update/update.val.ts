import { object, objectIdValidation } from "@deps";
import { selectStruct } from "../../../mod.ts";
import { event_pure } from "@model";

export const updateValidator = () => {
	return object({
		set: object({
			...event_pure,
			_id: objectIdValidation, // ID of the event to update
		}),
		get: selectStruct("event", 1),
	});
};
