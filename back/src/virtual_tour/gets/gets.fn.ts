import { type ActFn, ObjectId } from "@deps";
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
				name: { $regex: new RegExp(name, "i") },
			},
		});

	placeId &&
		pipeline.push({
			$match: {
				"place._id": new ObjectId(placeId as string),
			},
		});

	pipeline.push({ $sort: { _id: -1 } });
	pipeline.push({ $skip: (page - 1) * limit });
	pipeline.push({ $limit: limit });

	return await virtual_tour
		.aggregation({
			pipeline,
			projection: get,
		})
		.toArray();
};
