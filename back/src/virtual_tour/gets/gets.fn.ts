import { type ActFn, ObjectId } from "@deps";
import { clampPagination, containsRegex } from "@lib";
import { virtual_tour } from "../../../mod.ts";

export const getsFn: ActFn = async (body) => {
	const {
		set: { page, limit, name, placeId },
		get,
	} = body.details;

	const pipeline = [];

	name &&
		pipeline.push({
			$match: {
				name: { $regex: containsRegex(name) },
			},
		});

	placeId &&
		pipeline.push({
			$match: {
				"place._id": new ObjectId(placeId as string),
			},
		});

	pipeline.push({ $sort: { _id: -1 } });
	const { page: safePage, limit: safeLimit } = clampPagination(page, limit);
	pipeline.push({ $skip: (safePage - 1) * safeLimit });
	pipeline.push({ $limit: safeLimit });

	return await virtual_tour
		.aggregation({
			pipeline,
			projection: get,
		})
		.toArray();
};
