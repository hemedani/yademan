import {
	boolean,
	number,
	object,
	objectIdValidation,
	optional,
	string,
} from "@deps";
import { selectStruct } from "../../../mod.ts";
import { comment_status_enum } from "@model";

export const updateValidator = () => {
	return object({
		set: object({
			_id: objectIdValidation,
			text: optional(string()),
			rating: optional(number()),
			status: optional(comment_status_enum),
			is_anonymous: optional(boolean()),
		}),
		get: selectStruct("comment", 1),
	});
};
