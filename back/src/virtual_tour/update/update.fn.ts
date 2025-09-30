import { type ActFn, type Infer, object, ObjectId } from "@deps";
import { virtual_tour } from "../../../mod.ts";
import { virtual_tour_pure } from "@model";

export const updateFn: ActFn = async (body) => {
	const {
		set: { _id, name, description, hotspots, status },
		get,
	} = body.details;

	const pureStruct = object(virtual_tour_pure);
	const updateObj: Partial<Infer<typeof pureStruct>> = {
		updatedAt: new Date(),
	};

	name && (updateObj.name = name);
	description && (updateObj.description = description);
	hotspots && (updateObj.hotspots = hotspots);
	status && (updateObj.status = status);

	return await virtual_tour.findOneAndUpdate({
		filter: { _id: new ObjectId(_id as string) },
		update: {
			$set: updateObj,
		},
		projection: get,
	});
};
