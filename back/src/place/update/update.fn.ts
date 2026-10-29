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
			slug,
			address,
			contact,
			hoursOfOperation,
			meta,
			center,
			area,
			status,
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
	// `slug` is accepted by the validator and is the key `place.gets` looks up
	// by slug, so dropping it here silently made renames a no-op that still
	// answered `success: true`.
	slug && (updateObj.slug = slug);
	address && (updateObj.address = address);
	contact && (updateObj.contact = contact);
	hoursOfOperation && (updateObj.hoursOfOperation = hoursOfOperation);
	meta && (updateObj.meta = meta);
	center && (updateObj.center = center);
	area && (updateObj.area = area);
	status && (updateObj.status = status);

	return await place.findOneAndUpdate({
		filter: { _id: new ObjectId(_id as string) },
		update: {
			$set: updateObj,
		},
		projection: get,
	});
};
