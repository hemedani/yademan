import { type ActFn, type Document, ObjectId, type string } from "@deps";
import { containsRegex } from "@lib";
import { virtual_tour } from "../../../mod.ts";

export const countFn: ActFn = async (body) => {
	const {
		set: { name, placeId },
		get,
	} = body.details;

	const filters: Document = {};

	name &&
		(filters["name"] = {
			$regex: containsRegex(name),
		});

	placeId &&
		(filters["place._id"] = new ObjectId(placeId as string));

	const foundedItemsLength = await virtual_tour.countDocument({
		filter: filters,
	});

	return { qty: foundedItemsLength };
};
