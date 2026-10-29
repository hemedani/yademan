import type { ActFn, Document } from "@deps";
import { user } from "../../../mod.ts";

export const countUsersFn: ActFn = async (body) => {
	const {
		set: { levels },
		get,
	} = body.details;

	const filter: Document = {};
	// The public filter is called `levels`, but the schema field is `level`
	// (singular). Filtering on `levels` matched nothing and always returned 0.
	levels && (filter["level"] = levels);

	const qty = await user.countDocument({
		filter,
	});

	return { qty };
};
