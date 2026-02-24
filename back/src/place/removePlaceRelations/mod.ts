import { grantAccess, setTokens, setUser } from "@lib";
import { coreApp } from "../../../mod.ts";
import { removePlaceRelationsFn } from "./removePlaceRelations.fn.ts";
import { removePlaceRelationsValidator } from "./removePlaceRelations.val.ts";

export const removePlaceRelationsSetup = () =>
	coreApp.acts.setAct({
		schema: "place",
		fn: removePlaceRelationsFn,
		actName: "removePlaceRelations",
		preAct: [
			setTokens,
			setUser,
			grantAccess({
				levels: ["Ghost", "Manager"],
			}),
		],
		validator: removePlaceRelationsValidator(),
		validationRunType: "create",
	});
