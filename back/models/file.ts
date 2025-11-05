import {
	number,
	optional,
	type RelationDataType,
	type RelationSortOrderType,
	string,
} from "@deps";
import { coreApp } from "../mod.ts";
import { createUpdateAt } from "@lib";

export const pure_file = {
	name: string(),
	mimType: string(),
	size: number(),
	alt_text: optional(string()),
	...createUpdateAt,
};

export const file_relations = {
	uploader: {
		schemaName: "user",
		optional: false,
		type: "single" as RelationDataType,
		excludes: ["summary", "createdAt", "updatedAt"],
		relatedRelations: {
			uploadedAssets: {
				type: "multiple" as RelationDataType,
				limit: 50,
				excludes: ["alt_text", "createdAt", "updatedAt"],
				sort: {
					field: "_id",
					order: "desc" as RelationSortOrderType,
				},
			},
		},
	},
};

export const files = () =>
	coreApp.odm.newModel("file", pure_file, file_relations);
