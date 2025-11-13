import { type ActFn, Document } from "@deps";
import { event } from "../../../mod.ts";

export const countFn: ActFn = async (body) => {
	const {
		set: {
			name,
			status,
			placeIds,
			startTimeAfter,
			startTimeBefore,
			endTimeAfter,
			endTimeBefore,
			isPublic,
		},
	} = body.details;

	// Build the MongoDB filter from application-level parameters
	const filter: Document = {};

	if (name) {
		filter.name = { $regex: name, $options: "i" }; // Case-insensitive search
	}

	if (status) {
		filter.status = status;
	}

	if (placeIds && placeIds.length > 0) {
		filter["relations.places._id"] = { $in: placeIds };
	}

	if (startTimeAfter || startTimeBefore) {
		filter.startTime = {};
		if (startTimeAfter) {
			filter.startTime.$gte = new Date(startTimeAfter);
		}
		if (startTimeBefore) {
			filter.startTime.$lte = new Date(startTimeBefore);
		}
	}

	if (endTimeAfter || endTimeBefore) {
		filter.endTime = {};
		if (endTimeAfter) {
			filter.endTime.$gte = new Date(endTimeAfter);
		}
		if (endTimeBefore) {
			filter.endTime.$lte = new Date(endTimeBefore);
		}
	}

	if (typeof isPublic === "boolean") {
		filter.isPublic = isPublic;
	}

	return await event.countDocument({
		filter,
	});
};
