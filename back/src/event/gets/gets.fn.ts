import { type ActFn, Document } from "@deps";
import { event } from "../../../mod.ts";

export const getsFn: ActFn = async (body) => {
	const {
		set: {
			page = 1,
			limit = 50,
			skip,
			// Application-level filtering parameters
			ids,
			name,
			status,
			placeIds,
			startTimeAfter,
			startTimeBefore,
			endTimeAfter,
			endTimeBefore,
			isPublic,
		},
		get,
	} = body.details;

	const calculatedSkip = skip || limit * (page - 1);

	// Build the MongoDB filter from application-level parameters
	const filters: Document = {};

	if (ids && ids.length > 0) {
		filters._id = { $in: ids };
	}

	if (name) {
		filters.name = { $regex: name, $options: "i" }; // Case-insensitive search
	}

	if (status) {
		filters.status = status;
	}

	if (placeIds && placeIds.length > 0) {
		filters["relations.places._id"] = { $in: placeIds };
	}

	if (startTimeAfter || startTimeBefore) {
		filters.startTime = {};
		if (startTimeAfter) {
			filters.startTime.$gte = new Date(startTimeAfter);
		}
		if (startTimeBefore) {
			filters.startTime.$lte = new Date(startTimeBefore);
		}
	}

	if (endTimeAfter || endTimeBefore) {
		filters.endTime = {};
		if (endTimeAfter) {
			filters.endTime.$gte = new Date(endTimeAfter);
		}
		if (endTimeBefore) {
			filters.endTime.$lte = new Date(endTimeBefore);
		}
	}

	if (typeof isPublic === "boolean") {
		filters.isPublic = isPublic;
	}

	return await event
		.find({
			filters,
			projection: get,
		})
		.skip(calculatedSkip)
		.limit(limit)
		.toArray();
};
