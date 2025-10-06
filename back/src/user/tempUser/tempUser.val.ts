import { object } from "@deps";
import { selectStruct } from "../../../mod.ts";
import { user_pure } from "@model";

export const tempUserValidator = () => {
	const { level, is_verified, ...rest } = user_pure;
	return object({
		set: object({ ...rest }),
		get: selectStruct("user", 1),
	});
};
