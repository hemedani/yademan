import {
	array,
	number,
	object,
	objectIdValidation,
	optional,
	record,
	string,
	unknown,
} from "@deps";
import { selectStruct } from "../../../mod.ts";
import { geoJSONStruct, place_status_enum } from "@model";

export const updateValidator = () => {
	return object({
		set: object({
			_id: objectIdValidation,
			name: optional(string()),

			// Antiquity field: Represents the age or historical antiquity of the monument in years (as a number).
			// For example, 2000 for a 2000-year-old structure. This was chosen as a single-word equivalent to "قدمت".
			antiquity: optional(number()),

			description: optional(string()),
			// For the details page [cite: 96]
			slug: optional(string()),

			center: optional(geoJSONStruct("Point")), // GeoJSON point representing the location
			area: optional(geoJSONStruct("MultiPolygon")), // GeoJSON point representing the location

			address: optional(string()),
			// Optional contact info: An object containing ways to contact the place (phone, email, etc.).
			// This allows structured storage of multiple contact methods.
			contact: optional(object({
				// Optional phone number (e.g., "+33 892 70 12 39").
				phone: optional(string()),
				// Optional email address (e.g., "info@eiffeltower.com").
				email: optional(string()),
				// Optional website URL (e.g., "https://www.toureiffel.paris").
				website: optional(string()),
				// Optional array of social media handles or URLs (e.g., ["twitter.com/eiffeltower", "instagram.com/eiffeltower"]).
				social: optional(array(string())), // e.g., ["twitter.com/handle"]
			})),

			// For hours of operation [cite: 96]
			hoursOfOperation: optional(string()), // Simple string for now, can be a structured object later

			// For the photo gallery [cite: 96]
			// This will be a relation, see below

			// For custom data that might come up
			meta: optional(record(string(), unknown())),
			status: optional(place_status_enum),
		}),
		get: selectStruct("place", 1),
	});
};
