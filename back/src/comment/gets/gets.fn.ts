import type { ActFn } from "@deps";
import { comment } from "../../../mod.ts";

export const getsFn: ActFn = async (body) => {
	const {
		set, // Contains all our filter parameters
		get, // For projection
	} = body.details;

	const {
		// Pagination
		page,
		limit,

		text,
		status,
		rating,
		is_anonymous,

		place,
		user,
	} = set;

	const pipeline: any[] = [];
	const matchConditions: any = {};

	// --- Text search ---
	if (text) {
		matchConditions.text = { $regex: new RegExp(text, "i") };
	}

	// --- Status filter ---
	if (status) {
		matchConditions.status = status;
	}

	// --- Rating filter ---
	if (rating) {
		matchConditions.rating = rating;
	}

	// --- Anonymous filter ---
	if (is_anonymous !== undefined) {
		matchConditions.is_anonymous = is_anonymous;
	}

	// --- Place filter ---
	if (place) {
		matchConditions["place.name"] = { $regex: new RegExp(place, "i") };
	}

	// --- User filter ---
	if (user) {
		matchConditions["user.name"] = { $regex: new RegExp(user, "i") };
	}

	// Add the $match stage to the pipeline if there are any conditions
	if (Object.keys(matchConditions).length > 0) {
		pipeline.push({ $match: matchConditions });
	}

	// --- Pagination and Sorting ---
	pipeline.push({ $sort: { _id: -1 } }); // Default sort by newest first
	pipeline.push({ $skip: (page - 1) * limit });
	pipeline.push({ $limit: limit });

	return await comment
		.aggregation({
			pipeline,
			projection: get,
		})
		.toArray();
};
