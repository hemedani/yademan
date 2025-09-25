import { coreApp } from "../mod.ts";
import {
	boolean,
	coerce,
	date,
	defaulted,
	enums,
	number,
	optional,
	pattern,
	refine,
	type RelationDataType,
	string,
	union,
} from "@deps";
import { createUpdateAt, isValidNationalNumber } from "@lib";

export const user_level_array = ["Ghost", "Manager", "Editor", "Ordinary"];
export const user_level_emums = enums(user_level_array);

export const mobile_pattern = pattern(
	string(),
	/(\+98|0|98|0098)?([ ]|-|[()]){0,2}9[0-9]([ ]|-|[()]){0,2}(?:[0-9]([ ]|-|[()]){0,2}){8}/,
);

export const is_valid_national_number_struct = refine(
	union([string(), number()]),
	"national_number",
	(value: string | number) => {
		const normalized = String(value).trim();
		return isValidNationalNumber(normalized);
	},
);

export const emailPattern = pattern(
	string(),
	/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
);

// export const is_valid_national_number_struct = define<string>(
// 	"NationalNumber",
// 	(value) => {
// 		if (
// 			typeof value !== "string" && typeof value !== "number"
// 		) return false;
// 		const str = String(value).trim();
// 		return isValidNationalNumber(str);
// 	},
// );

export const user_genders = enums(["Male", "Female"]);

export const user_pure = {
	first_name: string(),
	last_name: string(),
	father_name: optional(string()), // Made optional
	// mobile: mobile_pattern,
	gender: user_genders,
	birth_date: optional(coerce(date(), string(), (value) => new Date(value))),
	summary: optional(string()),

	// شماره ملی
	// national_number: is_valid_national_number_struct,
	address: optional(string()),

	level: defaulted(user_level_emums, "Ordinary"),

	email: emailPattern,
	password: string(),
	is_verified: defaulted(boolean(), false),
	...createUpdateAt,
};

export const user_relations = {
	avatar: {
		schemaName: "file",
		type: "single" as RelationDataType,
		optional: true,
		relatedRelations: {},
	},
	national_card: {
		schemaName: "file",
		type: "single" as RelationDataType,
		optional: true,
		relatedRelations: {},
	},
};

export const users = () =>
	coreApp.odm.newModel("user", user_pure, user_relations, {
		createIndex: {
			indexSpec: { "email": 1 },
			options: { unique: true },
		},
		excludes: ["password"],
	});
