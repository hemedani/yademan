import { object, objectIdValidation, optional, string } from "@deps";
import { selectStruct } from "../../../mod.ts";
import { geoJSONStruct } from "@model";

export const updateValidator = () => {
	return object({
		set: object({
			_id: objectIdValidation,
			name: optional(string()),
			description: optional(string()),
			center: optional(geoJSONStruct("Point")), // GeoJSON point representing the location
			area: optional(geoJSONStruct("MultiPolygon")), // GeoJSON point representing the location
		}),
		get: selectStruct("location", 1),
	});
};
