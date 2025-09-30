import { type ActFn, type Document, ObjectId, type string } from "@deps";
import { virtual_tour } from "../../../mod.ts";

export const countFn: ActFn = async (body) => {
	const {
		set: { name, placeId },
		get,
	} = body.details;

	const filters: Document = {};

	name &&
		(filters["name"] = {
			$regex: new RegExp(name, "i"),
		});

	placeId &&
		(filters["place._id"] = new ObjectId(placeId as string));

	const foundedItemsLength = await virtual_tour.countDocument({
		filter: filters,
	});

	return { qty: foundedItemsLength };
};
