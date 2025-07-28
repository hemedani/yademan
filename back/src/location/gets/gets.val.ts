import { number, object, optional, string } from "@deps";
import { selectStruct } from "../../../mod.ts"; // Assuming this path is correct
import { geoJSONStruct } from "@model";

export const getsValidator = () => {
	return object({
		set: object({
			// --- Pagination ---
			page: number(),
			limit: number(),

			name: optional(string()),

			// --- Location & Context (filtering by name) ---
			province: optional(string()),
			city: optional(string()),
			cityZone: optional(string()), // Was: city_zone

			// ---  GeoJSON ---
			polygon: optional(geoJSONStruct("Polygon")), // Was: location
		}),
		get: selectStruct("location", 2), // This defines the structure of the returned accident objects
	});
};
