import {
	grantAccess,
	type MyContext,
	setTokens,
	setUser,
	throwError,
} from "@lib";
import { coreApp } from "../../../mod.ts";
import { addUserFn } from "./addUser.fn.ts";
import { addUserValidator } from "./addUser.val.ts";

export const checkGhostUser = () => {
	const { user, body }: MyContext = coreApp.contextFns
		.getContextModel() as MyContext;

	if (user.level === "Ghost") {
		return;
	}

	// The validator field is `level` (singular). Reading `levels` meant this
	// guard never fired and any Manager could create a Ghost account.
	const set = body?.details.set as
		| { level?: string; levels?: string }
		| undefined;
	const requestedLevel = set?.level ?? set?.levels;

	if (requestedLevel !== "Ghost") {
		return;
	}

	throwError("Sorry can not add this level");
};

export const addUserSetup = () =>
	coreApp.acts.setAct({
		schema: "user",
		actName: "addUser",
		validationRunType: "create",
		preAct: [
			setTokens,
			setUser,
			grantAccess({
				levels: ["Manager"],
			}),
			checkGhostUser,
		],
		validator: addUserValidator(),
		fn: addUserFn,
	});
