import { fileSetup } from "./file/mod.ts";
import { userSetup } from "./user/mod.ts";
import { citySetup } from "./city/mod.ts";
import { provinceSetup } from "./province/mod.ts";
import { cityZoneSetup } from "./city_zone/mod.ts";
import { tagSetup } from "./tag/mod.ts";
import { categorySetup } from "./category/mod.ts";
import { placeSetup } from "./place/mod.ts";
import { commentSetup } from "./comment/mod.ts";
import { virtualTourSetup } from "./virtual_tour/mod.ts";
import { eventSetup } from "./event/mod.ts";

export const functionsSetup = () => {
	citySetup();
	cityZoneSetup();
	fileSetup();
	provinceSetup();
	userSetup();
	placeSetup();
	commentSetup();
	tagSetup();
	categorySetup();
	virtualTourSetup();
	eventSetup();
};
