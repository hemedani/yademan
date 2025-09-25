import type { ActFn, Document } from "@deps";
import { place } from "../../../mod.ts";

export const countFn: ActFn = async (body) => {
	const {
		set: {
			name,
			// Location & Context (filtering by name of embedded object)
			province,
			city,
			cityZone,

			polygon,
		},
		get,
	} = body.details;

	const filters: Document = {};
	if (name) filters.name = { $regex: new RegExp(name, "i") };

	// --- Location & Context (exact match on embedded object's 'name' field) ---
	if (province) filters["province.name"] = province;
	if (city) filters["city.name"] = city;
	if (cityZone) filters["city_zone.name"] = cityZone;

	// --- GeoJSON Location Filter ---
	if (polygon) {
		filters.center = {
			$geoIntersects: {
				$geometry: polygon,
			},
		};
	}

	const foundedItemsLength = await place.countDocument({
		filter: filters,
	});

	const totalItems = await place.countDocument({
		filter: {},
	});

	return { filtered: foundedItemsLength, total: totalItems };
};
