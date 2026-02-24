import { type ActFn, ObjectId, type TInsertRelations } from "@deps";
import { place } from "../../../mod.ts";
import type { place_relations } from "@model";

export const updatePlaceRelationsFn: ActFn = async (body) => {
	const {
		set: {
			_id,
			province,
			city,
			category,
			tags,
			thumbnail,
			gallery,
		},
		get,
	} = body.details;

	const relations: TInsertRelations<typeof place_relations> = {};

	province &&
		(relations.province = {
			_ids: new ObjectId(province as string),
			relatedRelations: {
				places: true,
			},
		});

	city &&
		(relations.city = {
			_ids: new ObjectId(city as string),
			relatedRelations: {
				places: true,
			},
		});

	category &&
		(relations.category = {
			_ids: new ObjectId(category as string),
			relatedRelations: {
				places: true,
			},
		});

	tags &&
		(relations.tags = {
			_ids: (tags as string[]).map((tag) => new ObjectId(tag)),
			relatedRelations: {
				places: true,
			},
		});

	thumbnail &&
		(relations.thumbnail = {
			_ids: new ObjectId(thumbnail as string),
			relatedRelations: {},
		});

	gallery &&
		(relations.gallery = {
			_ids: (gallery as string[]).map((img) => new ObjectId(img)),
			relatedRelations: {},
		});

	return await place.addRelation({
		filters: { _id: new ObjectId(_id as string) },
		relations,
		projection: get,
		replace: true,
	});
};
