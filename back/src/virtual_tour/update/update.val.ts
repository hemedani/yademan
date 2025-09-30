import {
	array,
	number,
	object,
	objectIdValidation,
	optional,
	string,
} from "@deps";
import { selectStruct } from "../../../mod.ts";
import { virtual_tour_status_enum } from "@model";

export const updateValidator = () => {
	return object({
		set: object({
			_id: objectIdValidation,
			name: optional(string()),
			description: optional(string()),
			hotspots: optional(array(object({
				pitch: number(),
				yaw: number(),
				description: optional(string()),
				target: optional(string()), // e.g., ID of another panorama or URL
			}))),
			status: optional(virtual_tour_status_enum),
		}),
		get: selectStruct("virtual_tour", 1),
	});
};
