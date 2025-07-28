import { coreApp } from "../mod.ts";
import {
	objectIdValidation,
	optional,
	type RelationDataType,
	type RelationSortOrderType,
	string,
} from "@deps";
import { geoJSONStruct } from "@model";
import { createUpdateAt } from "../utils/createUpdateAt.ts";

export const location_pure = {
	_id: optional(objectIdValidation),
	name: string(),
	description: string(),
	center: geoJSONStruct("Point"), // GeoJSON point representing the location
	area: geoJSONStruct("MultiPolygon"), // GeoJSON point representing the location

	...createUpdateAt,
};

export const location_relations = {
	registrer: {
		schemaName: "user",
		type: "single" as RelationDataType,
		optional: true,
		relatedRelations: {
			registered_locations: {
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
			locations: {
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
			locations: {
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
			locations: {
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
		type: "single" as RelationDataType,
		optional: true,
		relatedRelations: {
			locations: {
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
			locations: {
				type: "multiple" as RelationDataType,
				limit: 50,
				sort: {
					field: "_id",
					order: "desc" as RelationSortOrderType,
				},
			},
		},
	},
};

export const locations = () =>
	coreApp.odm.newModel("location", location_pure, location_relations, {
		createIndex: {
			indexSpec: {
				center: "2dsphere",
				area: "2dsphere",
			},
		},
	});
