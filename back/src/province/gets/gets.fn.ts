import type { ActFn } from "@deps";
import { clampPagination, containsRegex } from "@lib";
import { province } from "../../../mod.ts";

export const getsFn: ActFn = async (body) => {
	const {
		set: { page, limit, name },
		get,
	} = body.details;

	const pipeline = [];

	name &&
		pipeline.push({
			$match: {
				name: { $regex: containsRegex(name) },
			},
		});

	pipeline.push({ $sort: { _id: -1 } });
	const { page: safePage, limit: safeLimit } = clampPagination(page, limit);
	pipeline.push({ $skip: (safePage - 1) * safeLimit });
	pipeline.push({ $limit: safeLimit });

	return await province
		.aggregation({
			pipeline,
			projection: get,
		})
		.toArray();
};
