import { object, objectIdValidation } from "@deps";
import { selectStruct } from "../../../mod.ts";
import { comment_pure } from "@model";

export const addValidator = () => {
	return object({
		set: object({
			...comment_pure,
			place: objectIdValidation,
		}),
		get: selectStruct("comment", 1),
	});
};
