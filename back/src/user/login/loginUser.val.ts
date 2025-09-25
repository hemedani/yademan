import { enums, object, optional, size, string } from "@deps";
import { selectStruct } from "../../../mod.ts";
import { emailPattern } from "../../../models/user.ts";

export const loginUserValidator = () => {
	return object({
		set: object({
			email: emailPattern,
			password: size(string(), 8, 100),
		}),
		get: optional(
			object({
				token: optional(enums([0, 1])),
				user: selectStruct("user", 1),
			}),
		),
	});
};
