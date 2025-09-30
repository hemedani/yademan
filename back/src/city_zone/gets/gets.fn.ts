import { type ActFn, ObjectId } from "@deps";
import { city_zone } from "../../../mod.ts";

export const getsFn: ActFn = async (body) => {
	const {
		set: { page, limit, name, provinceId, cityId },
		get,
	} = body.details;

	const pipeline = [];

	name &&
		pipeline.push({
			$match: {
				name: { $regex: new RegExp(name, "i") },
			},
		});

	provinceId &&
		pipeline.push({
			$match: {
				"province._id": new ObjectId(provinceId as string),
			},
		});

	cityId &&
		pipeline.push({
			$match: {
				"city._id": new ObjectId(cityId as string),
			},
		});

	pipeline.push({ $sort: { _id: -1 } });
	pipeline.push({ $skip: (page - 1) * limit });
	pipeline.push({ $limit: limit });

	return await city_zone
		.aggregation({
			pipeline,
			projection: get,
		})
		.toArray();
};
