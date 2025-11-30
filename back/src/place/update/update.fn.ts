import { type ActFn, type Infer, object, ObjectId } from "@deps";
import { place } from "../../../mod.ts";
import { place_pure } from "@model";

export const updateFn: ActFn = async (body) => {
	const {
		set: {
			_id,
			name,
			antiquity,
			description,
			address,
			contact,
			hoursOfOperation,
			meta,
			center,
			area,
		},
		get,
	} = body.details;

	const pureStruct = object(place_pure);
	const updateObj: Partial<Infer<typeof pureStruct>> = {
		updatedAt: new Date(),
	};

	name && (updateObj.name = name);
	antiquity && (updateObj.antiquity = antiquity);
	description && (updateObj.description = description);
	address && (updateObj.address = address);
	contact && (updateObj.contact = contact);
	hoursOfOperation && (updateObj.hoursOfOperation = hoursOfOperation);
	meta && (updateObj.meta = meta);
	center && (updateObj.center = center);
	area && (updateObj.area = area);

	return await place.findOneAndUpdate({
		filter: { _id: new ObjectId(_id as string) },
		update: {
			$set: updateObj,
		},
		projection: get,
	});
};
