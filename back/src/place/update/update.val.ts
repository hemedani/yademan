import {
	object,
	objectIdValidation,
	optional,
	record,
	string,
	unknown,
} from "@deps";
import { selectStruct } from "../../../mod.ts";
import { geoJSONStruct } from "@model";

export const updateValidator = () => {
	return object({
		set: object({
			_id: objectIdValidation,
			name: optional(string()),
			description: optional(string()),
			// For the details page [cite: 96]
			address: optional(string()),
			contact: optional(object({
				phone: optional(string()),
				website: optional(string()),
			})),

			// For hours of operation [cite: 96]
			hoursOfOperation: optional(string()), // Simple string for now, can be a structured object later

			// For the photo gallery [cite: 96]
			// This will be a relation, see below

			// For custom data that might come up
			meta: optional(record(string(), unknown())),
			center: optional(geoJSONStruct("Point")), // GeoJSON point representing the location
			area: optional(geoJSONStruct("MultiPolygon")), // GeoJSON point representing the location
		}),
		get: selectStruct("place", 1),
	});
};
