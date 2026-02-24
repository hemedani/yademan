import { type ActFn, ObjectId } from "@deps";
import { place } from "../../../mod.ts";

export const removePlaceRelationsFn: ActFn = async (body) => {
	const {
		set: { _id, tags, gallery },
		get,
	} = body.details;

	const relations: {
		tags?: {
			_ids: ObjectId[];
			relatedRelations: {
				places: boolean;
			};
		};
		gallery?: {
			_ids: ObjectId[];
			relatedRelations: Record<string, never>;
		};
	} = {};

	tags &&
		(relations.tags = {
			_ids: (tags as string[]).map((tag) => new ObjectId(tag)),
			relatedRelations: {
				places: true,
			},
		});

	gallery &&
		(relations.gallery = {
			_ids: (gallery as string[]).map((img) => new ObjectId(img)),
			relatedRelations: {},
		});

	return await place.removeRelation({
		filters: { _id: new ObjectId(_id as string) },
		relations,
		projection: get,
	});
};
