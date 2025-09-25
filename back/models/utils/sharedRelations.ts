import { optional, RelationDataType, string } from "@deps";
import { createUpdateAt } from "../../utils/createUpdateAt.ts";

export const shared_relation_pure = {
	name: string(),
	description: string(),

	// --- NEW FIELDS ---
	color: optional(string()), // E.g., "#FF5733"
	icon: optional(string()), // E.g., "museum-icon.svg" or a name like "museum"

	...createUpdateAt,
};

export const createSharedRelations = () => ({
	registrar: {
		schemaName: "user",
		type: "single" as RelationDataType,
		optional: true,
		relatedRelations: {},
	},
});
