import { coreApp } from "../mod.ts";
import {
	array,
	enums,
	object,
	objectIdValidation,
	optional,
	record,
	type RelationDataType,
	type RelationSortOrderType,
	string,
	unknown,
} from "@deps";
import { geoJSONStruct } from "@model";
import { createUpdateAt } from "../utils/createUpdateAt.ts";

export const place_status_enum = enums(["draft", "active", "archived"]);

export const place_pure = {
	_id: optional(objectIdValidation),
	name: string(),
	description: string(),
	slug: optional(string()),
	center: geoJSONStruct("Point"), // GeoJSON point representing the location
	area: geoJSONStruct("MultiPolygon"), // GeoJSON point representing the location

	// --- NEW FIELDS ---
	// For the details page [cite: 96]
	address: optional(string()),
	contact: optional(object({
		phone: optional(string()),
		email: optional(string()),
		website: optional(string()),
		social: optional(array(string())), // e.g., ["twitter.com/handle"]
	})),

	// For hours of operation [cite: 96]
	hoursOfOperation: optional(string()), // Simple string for now, can be a structured object later

	// For the photo gallery [cite: 96]
	// This will be a relation, see below

	// For custom data that might come up
	meta: optional(record(string(), unknown())),

	status: place_status_enum,

	...createUpdateAt,
};

export const place_relations = {
	registrar: {
		schemaName: "user",
		type: "single" as RelationDataType,
		optional: true,
		relatedRelations: {
			registered_places: {
				type: "multiple" as RelationDataType,
				limit: 50,
				sort: {
					field: "_id",
					order: "desc" as RelationSortOrderType,
				},
			},
		},
	},
	province: {
		schemaName: "province",
		type: "single" as RelationDataType,
		optional: true,
		relatedRelations: {
			places: {
				type: "multiple" as RelationDataType,
				limit: 50,
				sort: {
					field: "_id",
					order: "desc" as RelationSortOrderType,
				},
			},
		},
	},
	city: {
		schemaName: "city",
		type: "single" as RelationDataType,
		optional: true,
		relatedRelations: {
			places: {
				type: "multiple" as RelationDataType,
				limit: 50,
				sort: {
					field: "_id",
					order: "desc" as RelationSortOrderType,
				},
			},
		},
	},
	city_zone: {
		schemaName: "city_zone",
		type: "single" as RelationDataType,
		optional: true,
		relatedRelations: {
			places: {
				type: "multiple" as RelationDataType,
				limit: 50,
				sort: {
					field: "_id",
					order: "desc" as RelationSortOrderType,
				},
			},
		},
	},
	category: {
		schemaName: "category",
		type: "multiple" as RelationDataType,
		optional: true,
		relatedRelations: {
			places: {
				type: "multiple" as RelationDataType,
				limit: 50,
				sort: {
					field: "_id",
					order: "desc" as RelationSortOrderType,
				},
			},
		},
	},
	tags: {
		schemaName: "tag",
		type: "multiple" as RelationDataType,
		optional: true,
		relatedRelations: {
			places: {
				type: "multiple" as RelationDataType,
				limit: 50,
				sort: {
					field: "_id",
					order: "desc" as RelationSortOrderType,
				},
			},
		},
	},

	thumbnail: { // A single main image for the place
		schemaName: "file",
		type: "single" as RelationDataType,
		optional: true,
		relatedRelations: {},
	},
	gallery: { // An array of images for the details page gallery
		schemaName: "file",
		type: "multiple" as RelationDataType,
		optional: true,
		relatedRelations: {},
	},
};

export const places = () =>
	coreApp.odm.newModel("place", place_pure, place_relations, {
		createIndex: {
			indexSpec: {
				center: "2dsphere",
				area: "2dsphere",
				slug: 1,
			},
			options: {
				unique: true,
				partialFilterExpression: { slug: { $exists: true } },
			},
		},
	});
