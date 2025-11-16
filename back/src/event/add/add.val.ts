import { array, object, objectIdValidation, optional } from "@deps";
import { selectStruct } from "../../../mod.ts";
import { event_pure } from "@model";

export const addValidator = () => {
	return object({
		set: object({
			...event_pure,
			placeIds: optional(array(objectIdValidation)), // Optional array of place IDs for the event
			organizer: optional(objectIdValidation), // Optional organizer ID
			tags: optional(array(objectIdValidation)), // Optional array of tag IDs
			thumbnail: optional(objectIdValidation), // Optional thumbnail file ID
			gallery: optional(array(objectIdValidation)), // Optional array of gallery file IDs
		}),
		get: selectStruct("event", 1),
	});
};
