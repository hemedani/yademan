import { addSetup } from "./add/mod.ts";
import { getSetup } from "./get/mod.ts";
import { getsSetup } from "./gets/mod.ts";
import { updateSetup } from "./update/mod.ts";
import { removeSetup } from "./remove/mod.ts";
import { countSetup } from "./count/mod.ts";
import { updatePlaceRelationsSetup } from "./updatePlaceRelations/mod.ts";
import { removePlaceRelationsSetup } from "./removePlaceRelations/mod.ts";

export const placeSetup = () => {
	addSetup();
	updateSetup();
	updatePlaceRelationsSetup();
	removePlaceRelationsSetup();
	getSetup();
	getsSetup();
	removeSetup();
	countSetup();
};
