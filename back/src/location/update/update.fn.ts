import { type ActFn, type Infer, object, ObjectId } from "@deps";
import { location } from "../../../mod.ts";
import { location_pure } from "@model";

export const updateFn: ActFn = async (body) => {
	const {
		set: {
			_id,
			name,
			description,
			center,
			area,
		},
		get,
	} = body.details;

	const pureStruct = object(location_pure);
	const updateObj: Partial<Infer<typeof pureStruct>> = {
		updatedAt: new Date(),
	};

	name && (updateObj.name = name);
	description && (updateObj.description = description);
	center && (updateObj.center = center);
	area && (updateObj.area = area);

	return await location.findOneAndUpdate({
		filter: { _id: new ObjectId(_id as string) },
		update: {
			$set: updateObj,
		},
		projection: get,
	});
};
