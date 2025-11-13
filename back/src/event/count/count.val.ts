import {
	array,
	boolean,
	object,
	objectIdValidation,
	optional,
	string,
} from "@deps";

export const countValidator = () => {
	return object({
		set: object({
			name: optional(string()),
			status: optional(string()),
			placeIds: optional(array(objectIdValidation)), // To count events at specific places
			startTimeAfter: optional(string()), // ISO date string for events starting after this time
			startTimeBefore: optional(string()), // ISO date string for events starting before this time
			endTimeAfter: optional(string()), // ISO date string for events ending after this time
			endTimeBefore: optional(string()), // ISO date string for events ending before this time
			isPublic: optional(boolean()),
		}),
	});
};
