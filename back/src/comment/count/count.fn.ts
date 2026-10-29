import { type ActFn, Document, ObjectId } from "@deps";
import { containsRegex } from "@lib";
import { comment } from "../../../mod.ts";

// `place` may be supplied either as an id (what the UI sends) or as a name.
const looksLikeObjectId = (value: string) => /^[0-9a-fA-F]{24}$/.test(value);

export const countFn: ActFn = async (body) => {
	const {
		set: {
			text,
			status,
			rating,
			is_anonymous,
			place,
			user,
		},
		get,
	} = body.details;

	const filters: Document = {};

	// --- Text search ---
	if (text) {
		filters.text = { $regex: containsRegex(text) };
	}

	// --- Status filter ---
	if (status) {
		filters.status = status;
	}

	// --- Rating filter ---
	if (rating) {
		filters.rating = rating;
	}

	// --- Anonymous filter ---
	if (is_anonymous !== undefined) {
		filters.is_anonymous = is_anonymous;
	}

	// --- Place filter ---
	// Must match `comment.gets`, which filters by `place._id`.
	if (place) {
		if (looksLikeObjectId(place)) {
			filters["place._id"] = new ObjectId(place);
		} else {
			filters["place.name"] = { $regex: containsRegex(place) };
		}
	}

	// --- User filter ---
	if (user) {
		if (looksLikeObjectId(user)) {
			filters["user._id"] = new ObjectId(user);
		} else {
			filters["user.name"] = { $regex: containsRegex(user) };
		}
	}

	const foundedItemsLength = await comment.countDocument({
		filter: filters,
	});

	const totalItems = await comment.countDocument({
		filter: {},
	});

	return { filtered: foundedItemsLength, total: totalItems };
};
