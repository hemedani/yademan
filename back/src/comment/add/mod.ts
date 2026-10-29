import { grantAccess, setTokens, setUser } from "@lib";
import { coreApp } from "../../../mod.ts";
import { addFn } from "./add.fn.ts";
import { addValidator } from "./add.val.ts";

export const addSetup = () =>
	coreApp.acts.setAct({
		schema: "comment",
		fn: addFn,
		actName: "add",
		preAct: [
			setTokens,
			setUser,
			grantAccess({
				// `Ordinary` is the real level for a registered user; the legacy
				// "User" name is not in `user_level_array` and never matched.
				levels: ["Ordinary", "Editor", "Manager"],
			}),
		],
		validator: addValidator(),
		validationRunType: "create",
	});
