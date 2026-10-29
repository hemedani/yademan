import { type ActFn, ObjectId } from "@deps";
import { clampPagination, containsRegex } from "@lib";
import { city } from "../../../mod.ts";

export const getsFn: ActFn = async (body) => {
	const {
		set: { page, limit, name, provinceId },
		get,
	} = body.details;

	const pipeline = [];

	name &&
		pipeline.push({
			$match: {
				name: { $regex: containsRegex(name) },
			},
		});

	provinceId &&
		pipeline.push({
			$match: {
				"province._id": new ObjectId(provinceId as string),
			},
		});

	pipeline.push({ $sort: { _id: -1 } });
	const { page: safePage, limit: safeLimit } = clampPagination(page, limit);
	pipeline.push({ $skip: (safePage - 1) * safeLimit });
	pipeline.push({ $limit: safeLimit });

	return await city
		.aggregation({
			pipeline,
			projection: get,
		})
		.toArray();
};
