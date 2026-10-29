import {
	boolean,
	coerce,
	date,
	defaulted,
	object,
	objectIdValidation,
	optional,
	string,
} from "@deps";
import { selectStruct } from "../../../mod.ts";
import { emailPattern, user_genders, user_level_emums } from "@model";

export const addUserValidator = () => {
	return object({
		set: object({
			first_name: string(),
			last_name: string(),
			// `email` and `password` are required by the user schema and were
			// missing here, so this action could never create a valid document.
			email: emailPattern,
			password: string(),
			father_name: optional(string()),
			gender: user_genders,
			birth_date: optional(
				coerce(date(), string(), (value) => new Date(value)),
			),
			summary: optional(string()),
			address: optional(string()),

			level: optional(user_level_emums),
			is_verified: defaulted(boolean(), false),
			nationalCard: optional(objectIdValidation),
			avatar: optional(objectIdValidation),
			provinceId: optional(objectIdValidation),
			cityId: optional(objectIdValidation),
		}),
		get: selectStruct("user", 1),
	});
};
