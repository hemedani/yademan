import { coreApp } from "../mod.ts";
import {
	array,
	enums,
	number,
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

// Enum for place status: Defines the possible states of a place record (e.g., draft for unpublished, active for live, archived for historical/inactive).
// This helps in managing lifecycle of place entries in the database.
export const place_status_enum = enums(["draft", "active", "archived"]);

// Pure schema definition: This object defines the core fields of the 'place' model without relations.
// Each field uses Lesan validators (e.g., string(), number()) for type safety and validation.
// This structure is used by Lesan to generate MongoDB schemas.
export const place_pure = {
	// Optional MongoDB ObjectId for the document's unique identifier. Automatically generated if not provided.
	_id: optional(objectIdValidation),

	// Required name of the place (e.g., "Eiffel Tower"). Must be a string.
	name: string(),

	// Antiquity field: Represents the age or historical antiquity of the monument in years (as a number).
	// For example, 2000 for a 2000-year-old structure. This was chosen as a single-word equivalent to "قدمت".
	antiquity: number(),

	// Description: A textual description of the place, its history, significance, etc. Required string.
	description: string(),

	// Optional slug: A URL-friendly identifier (e.g., "eiffel-tower-paris") for SEO and routing purposes.
	slug: optional(string()),

	// Center: GeoJSON Point representing the central geographic location (latitude/longitude) of the place.
	// Used for mapping and proximity searches. Defined using geoJSONStruct for MongoDB geospatial indexing.
	center: geoJSONStruct("Point"), // GeoJSON point representing the location

	// Area: GeoJSON MultiPolygon defining the boundary or area covered by the place (e.g., for parks or large sites).
	// Supports complex shapes for accurate geospatial queries.
	area: geoJSONStruct("MultiPolygon"), // GeoJSON point representing the location

	// --- NEW FIELDS ---
	// For the details page [cite: 96]  // Note: This comment seems to reference an external citation; keep as-is if from design docs.

	// Optional address: Full street address or location details (e.g., "Champ de Mars, 5 Avenue Anatole France, 75007 Paris").
	address: optional(string()),

	// Optional contact info: An object containing ways to contact the place (phone, email, etc.).
	// This allows structured storage of multiple contact methods.
	contact: optional(object({
		// Optional phone number (e.g., "+33 892 70 12 39").
		phone: optional(string()),
		// Optional email address (e.g., "info@eiffeltower.com").
		email: optional(string()),
		// Optional website URL (e.g., "https://www.toureiffel.paris").
		website: optional(string()),
		// Optional array of social media handles or URLs (e.g., ["twitter.com/eiffeltower", "instagram.com/eiffeltower"]).
		social: optional(array(string())), // e.g., ["twitter.com/handle"]
	})),

	// For hours of operation [cite: 96]
	// Optional hoursOfOperation: A string describing opening hours (e.g., "Monday-Friday: 9AM-5PM").
	// Could be expanded to a structured object (e.g., with days and times) in future iterations for better querying.
	hoursOfOperation: optional(string()), // Simple string for now, can be a structured object later

	// For the photo gallery [cite: 96]
	// This will be a relation, see below  // Relation to 'file' model for images; defined in place_relations.

	// Optional meta: A flexible key-value store for custom or additional data not fitting other fields.
	// Keys are strings, values can be any type (unknown). Useful for extensibility without schema changes.
	meta: optional(record(string(), unknown())),

	// Status: Enum value indicating the place's state (draft/active/archived). Helps in filtering active places.
	status: place_status_enum,

	// Timestamps: Automatically adds createdAt and updatedAt fields for tracking record creation and modifications.
	// This is a utility from createUpdateAt, likely defining Date fields with defaults.
	...createUpdateAt,
};

// Relations definition: This object defines relationships between 'place' and other models.
// Lesan uses this to handle joins, population, and reverse references efficiently in MongoDB queries.
// Each relation specifies type (single/multiple), optional status, and reverse mappings.
export const place_relations = {
	// Registrar: Links to a single 'user' who registered the place (optional).
	// Reverse: The user has a list of registered_places (up to 50, sorted by _id descending).
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

	// Province: Links to a single 'province' (optional). Represents administrative division.
	// Reverse: Province has a list of places.
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

	// City: Links to a single 'city' (optional).
	// Reverse: City has a list of places.
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

	// City Zone: Links to a single 'city_zone' (optional), for finer location granularity.
	// Reverse: City zone has a list of places.
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

	// Category: Required link to a single 'category' (e.g., "Historical Monument").
	// Reverse: Category has a list of places.
	category: {
		schemaName: "category",
		type: "single" as RelationDataType,
		optional: false,
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

	// Tags: Optional multiple links to 'tag' models (e.g., ["ancient", "cultural"]).
	// Reverse: Each tag has a list of places.
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

	// Thumbnail: Optional single link to a 'file' for the main image.
	// No reverse relation defined (one-way reference).
	thumbnail: { // A single main image for the place
		schemaName: "file",
		type: "single" as RelationDataType,
		optional: true,
		relatedRelations: {},
	},

	// Gallery: Optional multiple links to 'file' for photo gallery images.
	// No reverse relation; allows attaching multiple images to a place.
	gallery: { // An array of images for the details page gallery
		schemaName: "file",
		type: "multiple" as RelationDataType,
		optional: true,
		relatedRelations: {},
	},
};

// Model factory function: Creates and registers the 'place' model with Lesan ODM.
// Parameters: Model name, pure schema, relations, and optional config (e.g., indexes).
// Indexes: Geospatial on center/area for location queries, unique on slug (partial for existing slugs only).
export const places = () =>
	coreApp.odm.newModel("place", place_pure, place_relations, {
		createIndex: {
			indexSpec: {
				center: "2dsphere", // Enables geospatial queries on point locations.
				area: "2dsphere", // Enables geospatial queries on polygon areas.
				slug: 1, // Standard index on slug for fast lookups.
			},
			options: {
				unique: true, // Ensures unique slugs where they exist.
				partialFilterExpression: { slug: { $exists: true } }, // Only applies uniqueness to documents with a slug.
			},
		},
	});
