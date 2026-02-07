import { enums, object, optional, string } from "@deps";
import { geoJSONStruct } from "@model";

export const countValidator = () => {
	return object({
		set: object({
			name: optional(string()),
			// --- Location & Context (filtering by name) ---
			province: optional(string()),
			city: optional(string()),

			// ---  GeoJSON ---
			polygon: optional(geoJSONStruct("Polygon")), // Was: location
		}),
		get: object({
			total: optional(enums([0, 1])),
			filtered: optional(enums([0, 1])),
		}),
	});
};
