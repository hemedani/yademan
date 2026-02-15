import {
	array,
	boolean,
	enums,
	number,
	object,
	objectIdValidation,
	optional,
	string,
} from "@deps";
import { event_status_enum } from "../../../models/event.ts";
import { selectStruct } from "../../../mod.ts";

export const getsValidator = () => {
	return object({
		set: object({
			// --- Pagination ---
			page: number(),
			limit: number(),

			// --- Basic Filters ---
			name: optional(string()),
			status: optional(event_status_enum),
			isPublic: optional(boolean()),

			// --- Relations ---
			registrarId: optional(objectIdValidation),
			organizerId: optional(objectIdValidation),
			placeIds: optional(array(objectIdValidation)),
			tagIds: optional(array(objectIdValidation)),

			// --- Time Filters ---
			startTimeAfter: optional(string()), // ISO date string for events starting after this time
			startTimeBefore: optional(string()), // ISO date string for events starting before this time
			endTimeAfter: optional(string()), // ISO date string for events ending after this time
			endTimeBefore: optional(string()), // ISO date string for events ending before this time

			// --- Sort ---
			sort: optional(
				object({
					_id: optional(enums([-1, 1])),
					startTime: optional(enums([-1, 1])),
				})
			),
		}),
		get: object({
			data: selectStruct("event", 2),
			metadata: object({
				total: optional(enums([0, 1])),
				page: optional(enums([0, 1])),
				limit: optional(enums([0, 1])),
				pageCount: optional(enums([0, 1])),
			}),
		}), // This defines the structure of the returned event objects
	});
};
