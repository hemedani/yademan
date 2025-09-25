import { coreApp } from "../mod.ts";
import {
	boolean,
	defaulted,
	enums,
	number,
	optional,
	type RelationDataType,
	RelationSortOrderType,
	string,
} from "@deps";
import { createUpdateAt } from "@lib";

export const comment_status_enum = enums(["pending", "approved", "rejected"]);

export const comment_pure = {
	text: string(),
	rating: optional(number()), // 1-5 stars
	status: defaulted(comment_status_enum, "pending"),
	is_anonymous: defaulted(boolean(), false),
	...createUpdateAt,
};

export const comment_relations = {
	user: {
		schemaName: "user",
		type: "single" as RelationDataType,
		optional: false, // Comments require a user
		relatedRelations: {
			comments: {
				type: "multiple" as RelationDataType,
				limit: 50,
				sort: {
					field: "_id",
					order: "desc" as RelationSortOrderType,
				},
			},
		},
	},
	place: {
		schemaName: "place",
		type: "single" as RelationDataType,
		optional: false,
		relatedRelations: {
			comments: {
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

export const comments = () =>
	coreApp.odm.newModel("comment", comment_pure, comment_relations);
