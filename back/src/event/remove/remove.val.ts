import { object, objectIdValidation } from "@deps";
import { selectStruct } from "../../../mod.ts";

export const removeValidator = () => {
	return object({
		set: object({
			_id: objectIdValidation,
		}),
		get: selectStruct("event", 1),
	});
};
