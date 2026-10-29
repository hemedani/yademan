import type { ActFn } from "@deps";
import { clampPagination } from "@lib";
import { user } from "../../../mod.ts";

export const getUsersFn: ActFn = async (body) => {
	const {
		set: { levels, page, limit },
		get,
	} = body.details;

	const pipeline = [];

	// The public filter is called `levels`, but the schema field is `level`
	// (singular). Filtering on `levels` matched nothing and returned every user.
	levels && pipeline.push({ $match: { level: levels } });

	pipeline.push({ $sort: { _id: -1 } });
	const { page: safePage, limit: safeLimit } = clampPagination(page, limit);
	pipeline.push({ $skip: (safePage - 1) * safeLimit });
	pipeline.push({ $limit: safeLimit });

	return await user
		.aggregation({
			pipeline,
			projection: get,
		})
		.toArray();
};
