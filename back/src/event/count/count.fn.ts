import { type ActFn, Document, ObjectId } from "@deps";
import { containsRegex } from "@lib";
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
		filter.name = { $regex: containsRegex(name) }; // Case-insensitive search
	}

	if (status) {
		filter.status = status;
	}

	// Events store their places as an embedded array on the document, so the
	// path is `places._id` (not `relations.places._id`).
	if (placeIds && placeIds.length > 0) {
		filter["places._id"] = {
			$in: placeIds.map((pi: string) => new ObjectId(pi)),
		};
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
