import { type ActFn, ObjectId } from "@deps";
import { place } from "../../../mod.ts"; // Assuming 'accident' is your MongoDB model/collection utility

// Helper function to convert Gregorian year to Solar Hijri year
// The Solar Hijri calendar is about 621-622 years behind the Gregorian calendar
const gregorianToSolarHijri = (gregorianYear: number): number => {
	// The approximate difference between Gregorian and Solar Hijri calendars
	// This is a simplified conversion - for more precision, a dedicated library would be needed
	return gregorianYear - 621;
};

// Get current Solar Hijri year
const getCurrentSolarHijriYear = (): number => {
	const currentYear = new Date().getFullYear();
	return gregorianToSolarHijri(currentYear);
};

export const getsFn: ActFn = async (body) => {
	const {
		set, // Contains all our filter parameters
		get, // For projection
	} = body.details;

	const {
		// Pagination
		page,
		limit,

		// Basic filters
		name,
		slug,
		status,

		// Location context
		province,
		city,

		// Relations
		registrarId,
		categoryIds,
		tagIds,

		// GeoJSON
		polygon,
		area,
		near,
		maxDistance,
		minDistance,

		// Antiquity filter
		antiquity,
	} = set;

	const pipeline: { [key: string]: any }[] = [];
	const matchConditions: { [key: string]: any } = {};

	// --- Basic Filters ---
	if (name) matchConditions.name = { $regex: new RegExp(name, "i") };
	if (slug) matchConditions.slug = slug;
	if (status) matchConditions.status = status;

	// --- Location & Context ---
	// For related collections, we need to use their IDs
	if (province) {
		matchConditions["province._id"] = new ObjectId(province as string);
	}
	if (city) matchConditions["city._id"] = new ObjectId(city as string);

	// --- Relations ---
	if (registrarId) {
		matchConditions["registrar._id"] = new ObjectId(registrarId as string);
	}

	// Handle arrays of IDs for categories and tags
	if (categoryIds && categoryIds.length > 0) {
		matchConditions["category._id"] = {
			$in: categoryIds.map((ci: string) => new ObjectId(ci)),
		};
	}

	if (tagIds && tagIds.length > 0) {
		matchConditions["tags._id"] = {
			$in: tagIds.map((ti: string) => new ObjectId(ti)),
		};
	}

	// --- GeoJSON Filters ---
	// $geoIntersects with polygon
	if (polygon) {
		matchConditions.center = {
			$geoIntersects: {
				$geometry: polygon,
			},
		};
	}

	// $geoIntersects with area
	if (area) {
		matchConditions.area = {
			$geoIntersects: {
				$geometry: area,
			},
		};
	}

	// --- Antiquity Filter ---
	// The antiquity parameter represents the minimum age (in years) that a building should have
	// We need to find buildings whose construction year (in the antiquity field) is older than
	// (current year - requested age), meaning the construction year should be <= (current year - requested age)
	if (antiquity !== undefined) {
		const currentSolarYear = getCurrentSolarHijriYear();

		// Calculate the maximum construction year that still satisfies the age requirement
		// For example, if current year is 1445 and user wants buildings at least 50 years old,
		// then the building should be constructed in year (1445 - 50) = 1395 or earlier
		const maxConstructionYearForRequestedAge = currentSolarYear - antiquity;

		// Filter places where the construction year (antiquity field) is at or before the calculated year
		// Since earlier years are represented by smaller numbers, we use $lte
		matchConditions.antiquity = {
			$lte: maxConstructionYearForRequestedAge,
		};
	}

	// $geoNear for proximity search (using near point)
	if (near) {
		// Need to handle $geoNear as a separate pipeline stage since it must be the first stage
		const geoNearStage: { [key: string]: any } = {
			$geoNear: {
				near: near,
				distanceField: "distance", // This will add a 'distance' field to the results
				spherical: true,
			},
		};

		// Add optional max and min distance if provided (in meters)
		if (maxDistance) {
			geoNearStage.$geoNear.maxDistance = maxDistance;
		}
		if (minDistance) {
			geoNearStage.$geoNear.minDistance = minDistance;
		}

		// Add the $geoNear stage as the first in the pipeline
		pipeline.push(geoNearStage);
	}

	// Add the $match stage to the pipeline if there are any conditions
	if (Object.keys(matchConditions).length > 0) {
		// If we already have $geoNear, we need to add $match after it
		pipeline.push({ $match: matchConditions });
	}

	// --- Pagination and Sorting ---
	// Only add sorting if $geoNear is not used (it already sorts by distance)
	if (!near) {
		pipeline.push({ $sort: { _id: -1 } }); // Default sort by most recent
	}

	// Always add pagination
	pipeline.push({ $skip: (page - 1) * limit });
	pipeline.push({ $limit: limit });

	// Add a count of total results
	const countPipeline: { [key: string]: any }[] = [...pipeline];

	// Remove pagination from count pipeline
	countPipeline.pop(); // Remove $limit
	countPipeline.pop(); // Remove $skip

	// Add $count stage to get total documents
	countPipeline.push({ $count: "total" });

	// Execute both pipelines in parallel for efficiency
	const [results, countResult] = await Promise.all([
		place.aggregation({
			pipeline,
			projection: get.data,
		}).toArray(),
		place.aggregation({
			pipeline: countPipeline,
		}).toArray(),
	]);

	// Get total count (default to 0 if no results)
	const total = countResult.length > 0 ? countResult[0].total : 0;

	// Return results with metadata
	return {
		data: results,
		metadata: {
			total,
			page,
			limit,
			pageCount: Math.ceil(total / limit),
		},
	};
};
