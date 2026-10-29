import { grantAccess, setTokens, setUser } from "@lib";
import { removeFn } from "./remove.fn.ts";
import { removeValidator } from "./remove.val.ts";
import { coreApp } from "../../../mod.ts";

export const removeSetup = () =>
	coreApp.acts.setAct({
		schema: "comment",
		actName: "remove",
		fn: removeFn,
		preAct: [
			setTokens,
			setUser,
			grantAccess({
				// Ownership is enforced in the action; moderators may remove any.
				levels: ["Ordinary", "Editor", "Manager"],
			}),
		],
		validator: removeValidator(),
	});
