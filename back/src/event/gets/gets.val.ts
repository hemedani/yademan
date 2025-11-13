import {
	array,
	boolean,
	number,
	object,
	objectIdValidation,
	optional,
	string,
} from "@deps";
import { selectStruct } from "../../../mod.ts";

export const getsValidator = () => {
	return object({
		set: object({
			page: optional(number()),
			limit: optional(number()),
			skip: optional(number()),
			// Application-level filtering parameters
			ids: optional(array(objectIdValidation)), // To match events by multiple IDs
			name: optional(string()),
			status: optional(string()),
			placeIds: optional(array(objectIdValidation)), // To match events at specific places
			startTimeAfter: optional(string()), // ISO date string for events starting after this time
			startTimeBefore: optional(string()), // ISO date string for events starting before this time
			endTimeAfter: optional(string()), // ISO date string for events ending after this time
			endTimeBefore: optional(string()), // ISO date string for events ending before this time
			isPublic: optional(boolean()),
		}),
		get: selectStruct("event", 1),
	});
};
