import type { ActFn } from "@deps";
import { location } from "../../../mod.ts"; // Assuming 'accident' is your MongoDB model/collection utility

export const getsFn: ActFn = async (body) => {
	const {
		set, // Contains all our filter parameters
		get, // For projection
	} = body.details;

	const {
		// Pagination
		page,
		limit,

		name,

		province,
		city,
		cityZone,

		polygon,
	} = set;

	const pipeline: any[] = [];
	const matchConditions: any = {};

	// --- Location & Context (exact match on embedded object's 'name' field) ---
	if (province) matchConditions["province.name"] = province;
	if (city) matchConditions["city.name"] = city;
	if (cityZone) matchConditions["city_zone.name"] = cityZone;

	// --- GeoJSON Location Filter ---
	if (polygon) {
		matchConditions.location = {
			$geoIntersects: {
				$geometry: polygon,
			},
		};
	}

	if (name) {
		matchConditions.name = { $regex: new RegExp(name, "i") };
	}

	// Add the $match stage to the pipeline if there are any conditions
	if (Object.keys(matchConditions).length > 0) {
		pipeline.push({ $match: matchConditions });
	}

	// --- Pagination and Sorting ---
	pipeline.push({ $sort: { _id: -1 } }); // Default sort, can be made dynamic
	pipeline.push({ $skip: (page - 1) * limit });
	pipeline.push({ $limit: limit });

	return await location
		.aggregation({
			pipeline,
			projection: get,
		})
		.toArray();
};
