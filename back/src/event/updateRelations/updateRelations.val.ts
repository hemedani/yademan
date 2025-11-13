import { array, boolean, object, objectIdValidation, optional } from "@deps";
import { selectStruct } from "../../../mod.ts";

export const updateRelationsValidator = () => {
	return object({
		set: object({
			_id: objectIdValidation,
			placeIds: optional(array(objectIdValidation)), // Optional array of place IDs for the event
			organizer: optional(objectIdValidation), // Optional organizer ID
			attendees: optional(array(objectIdValidation)), // Optional array of attendee IDs
			tags: optional(array(objectIdValidation)), // Optional array of tag IDs
			thumbnail: optional(objectIdValidation), // Optional thumbnail file ID
			gallery: optional(array(objectIdValidation)), // Optional array of gallery file IDs
			replace: optional(boolean()), // Whether to replace existing relations (defaults to false)
		}),
		get: selectStruct("event", 1),
	});
};
