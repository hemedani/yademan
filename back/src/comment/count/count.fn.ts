import type { ActFn, Document } from "@deps";
import { comment } from "../../../mod.ts";

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
		filters.text = { $regex: new RegExp(text, "i") };
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
	if (place) {
		filters["place.name"] = { $regex: new RegExp(place, "i") };
	}

	// --- User filter ---
	if (user) {
		filters["user.name"] = { $regex: new RegExp(user, "i") };
	}

	const foundedItemsLength = await comment.countDocument({
		filter: filters,
	});

	const totalItems = await comment.countDocument({
		filter: {},
	});

	return { filtered: foundedItemsLength, total: totalItems };
};
