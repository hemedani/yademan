import {
	array,
	enums,
	number,
	object,
	objectIdValidation,
	optional,
	string,
} from "@deps";
import { place_status_enum } from "../../../models/place.ts";
import { selectStruct } from "../../../mod.ts"; // Assuming this path is correct
import { geoJSONStruct } from "@model";

export const getsValidator = () => {
	return object({
		set: object({
			// --- Pagination ---
			page: number(),
			limit: number(),

			// --- Basic Filters ---
			name: optional(string()),
			slug: optional(string()),
			status: optional(place_status_enum),

			// --- Location & Context (filtering by name) ---
			province: optional(string()),
			city: optional(string()),
			cityZone: optional(string()), // Was: city_zone

			// --- Relations ---
			registrarId: optional(objectIdValidation),
			categoryIds: optional(array(objectIdValidation)),
			tagIds: optional(array(objectIdValidation)),

			// --- GeoJSON ---
			polygon: optional(geoJSONStruct("Polygon")), // For $geoIntersects with center
			area: optional(geoJSONStruct("Polygon")), // For $geoIntersects with area

			// --- Near Point (for proximity search) ---
			near: optional(geoJSONStruct("Point")),
			maxDistance: optional(number()), // in meters
			minDistance: optional(number()), // in meters
		}),
		get: object({
			data: selectStruct("place", 2),
			metadata: object({
				total: optional(enums([0, 1])),
				page: optional(enums([0, 1])),
				limit: optional(enums([0, 1])),
				pageCount: optional(enums([0, 1])),
			}),
		}), // This defines the structure of the returned place objects
	});
};
