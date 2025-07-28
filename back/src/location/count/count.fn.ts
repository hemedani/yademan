import type { ActFn, Document } from "@deps";
import { location } from "../../../mod.ts";

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
		filters.location = {
			$geoIntersects: {
				$geometry: polygon,
			},
		};
	}

	const foundedItemsLength = await location.countDocument({
		filter: filters,
	});

	const totalItems = await location.countDocument({
		filter: {},
	});

	return { filtered: foundedItemsLength, total: totalItems };
};
