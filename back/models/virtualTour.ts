import { coreApp } from "../mod.ts";
import {
	array,
	enums,
	number,
	object,
	optional,
	type RelationDataType,
	RelationSortOrderType,
	string,
} from "@deps";
import { createUpdateAt } from "@lib";

export const virtual_tour_status_enum = enums(["draft", "active", "archived"]);

export const virtual_tour_pure = {
	name: string(),
	description: optional(string()),
	hotspots: optional(array(object({
		pitch: number(),
		yaw: number(),
		description: optional(string()),
		target: optional(string()), // e.g., ID of another panorama or URL
	}))),
	status: virtual_tour_status_enum,
	...createUpdateAt,
};

export const virtual_tour_relations = {
	/**
	 * The Place this virtual tour belongs to.
	 */
	place: {
		schemaName: "place",
		type: "single" as RelationDataType,
		optional: false, // A tour must be associated with a place.
		relatedRelations: {
			virtual_tours: {
				type: "multiple" as RelationDataType,
				limit: 50,
				sort: {
					field: "_id",
					order: "desc" as RelationSortOrderType,
				},
			},
		},
	},

	/**
	 * The 360-degree panoramic images that make up this virtual tour.
	 */
	panorama: {
		schemaName: "file",
		type: "single" as RelationDataType,
		optional: true,
		relatedRelations: {},
	},

	/**
	 * The user who registered this virtual tour.
	 */
	registrar: {
		schemaName: "user",
		type: "single" as RelationDataType,
		optional: true,
		relatedRelations: {},
	},
};

export const virtualTours = () =>
	coreApp.odm.newModel(
		"virtual_tour",
		virtual_tour_pure,
		virtual_tour_relations,
	);
