import type { ActFn } from "@deps";
import {
	category,
	city,
	city_zone,
	place,
	province,
	tag,
	user,
} from "../../../mod.ts";

export const dashboardStatisticFn: ActFn = async () => {
	const categories = await category.countDocument({});
	const cities = await city.countDocument({});
	const city_zones = await city_zone.countDocument({});
	const places = await place.countDocument({}); // Added await
	const provinces = await province.countDocument({});
	const tags = await tag.countDocument({});
	const users = await user.countDocument({});

	return {
		categories,
		cities,
		city_zones,
		places,
		provinces,
		tags,
		users,
	};
};
