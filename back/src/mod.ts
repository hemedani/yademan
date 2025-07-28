import { fileSetup } from "./file/mod.ts";
import { userSetup } from "./user/mod.ts";
import { citySetup } from "./city/mod.ts";
import { provinceSetup } from "./province/mod.ts";
import { cityZoneSetup } from "./city_zone/mod.ts";
import { tagSetup } from "./tag/mod.ts";
import { categorySetup } from "./category/mod.ts";
import { locationSetup } from "./location/mod.ts";

export const functionsSetup = () => {
	citySetup();
	cityZoneSetup();
	fileSetup();
	provinceSetup();
	userSetup();
	locationSetup();
	tagSetup();
	categorySetup();
};
