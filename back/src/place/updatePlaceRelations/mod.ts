import { grantAccess, setTokens, setUser } from "@lib";
import { coreApp } from "../../../mod.ts";
import { updatePlaceRelationsFn } from "./updatePlaceRelations.fn.ts";
import { updatePlaceRelationsValidator } from "./updatePlaceRelations.val.ts";

export const updatePlaceRelationsSetup = () =>
	coreApp.acts.setAct({
		schema: "place",
		fn: updatePlaceRelationsFn,
		actName: "updatePlaceRelations",
		preAct: [
			setTokens,
			setUser,
			grantAccess({
				levels: ["Ghost", "Manager"],
			}),
		],
		validator: updatePlaceRelationsValidator(),
		validationRunType: "create",
	});
