import type { ActFn, Document } from "@deps";
import { containsRegex } from "@lib";
import { category } from "../../../mod.ts";

export const countFn: ActFn = async (body) => {
	const {
		set: { name },
		get,
	} = body.details;

	const filters: Document = {};

	name &&
		(filters["name"] = {
			$regex: containsRegex(name),
		});

	const foundedItemsLength = await category.countDocument({
		filter: filters,
	});

	return { qty: foundedItemsLength };
};
