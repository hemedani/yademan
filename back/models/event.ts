import { coreApp } from "../mod.ts";
import {
	boolean,
	coerce,
	date,
	enums,
	optional,
	type RelationDataType,
	type RelationSortOrderType,
	string,
} from "@deps";
import { createUpdateAt } from "@lib";
import {
	file_excludes,
	shared_relation_excludes,
	user_excludes,
} from "./excludes.ts";

export const event_status_enum = enums([
	"draft",
	"published",
	"archived",
	"cancelled",
]);

export const event_pure = {
	name: string(),
	description: optional(string()),
	startTime: coerce(date(), string(), (value) => new Date(value)),
	endTime: coerce(date(), string(), (value) => new Date(value)),
	color: optional(string()), // E.g., "#FF5733" for calendar coloring
	icon: optional(string()), // E.g., "event-icon.svg" or an icon name like "calendar"
	capacity: optional(string()), // For events with limited capacity
	status: event_status_enum,
	isPublic: optional(boolean()), // Whether the event is visible to the public
	ticketPrice: optional(string()), // For paid events
	registrationRequired: optional(boolean()), // Whether registration is required
	maxAttendees: optional(string()), // Maximum number of attendees
	eventUrl: optional(string()), // External event URL
	registrationUrl: optional(string()), // Registration URL
	...createUpdateAt,
};

export const event_excludes: (keyof typeof event_pure)[] = [
	"createdAt",
	"updatedAt",
	"registrationUrl",
];

export const event_relations = {
	registrar: {
		schemaName: "user",
		type: "single" as RelationDataType,
		optional: true,
		excludes: user_excludes,
		relatedRelations: {
			registered_events: {
				type: "multiple" as RelationDataType,
				excludes: event_excludes,
				limit: 50,
				sort: {
					field: "_id",
					order: "desc" as RelationSortOrderType,
				},
			},
		},
	},
	places: {
		schemaName: "place",
		type: "multiple" as RelationDataType,
		optional: true,
		relatedRelations: {
			events: {
				type: "multiple" as RelationDataType,
				excludes: event_excludes,
				limit: 50,
				sort: {
					field: "_id",
					order: "desc" as RelationSortOrderType,
				},
			},
		},
	},
	organizer: {
		schemaName: "user",
		type: "single" as RelationDataType,
		optional: true,
		excludes: user_excludes,
		relatedRelations: {
			organized_events: {
				type: "multiple" as RelationDataType,
				excludes: event_excludes,
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
		excludes: shared_relation_excludes,
		relatedRelations: {
			events: {
				type: "multiple" as RelationDataType,
				excludes: event_excludes,
				limit: 50,
				sort: {
					field: "_id",
					order: "desc" as RelationSortOrderType,
				},
			},
		},
	},
	thumbnail: {
		schemaName: "file",
		type: "single" as RelationDataType,
		optional: true,
		excludes: file_excludes,
		relatedRelations: {},
	},
	gallery: {
		schemaName: "file",
		type: "multiple" as RelationDataType,
		optional: true,
		excludes: file_excludes,
		relatedRelations: {},
	},
};

export const events = () =>
	coreApp.odm.newModel("event", event_pure, event_relations, {
		createIndex: {
			indexSpec: {
				startTime: 1,
				endTime: 1,
			},
			options: {},
		},
	});
