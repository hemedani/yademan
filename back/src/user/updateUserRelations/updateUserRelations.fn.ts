import { type ActFn, ObjectId, type TInsertRelations } from "@deps";
import type { user_relations } from "@model";
import { user } from "../../../mod.ts";

export const updateUserRelationsFn: ActFn = async (body) => {
	const {
		set: { _id, avatar, national_card },
		get,
	} = body.details;

	const relations: TInsertRelations<typeof user_relations> = {};

	avatar &&
		(relations.avatar = {
			_ids: new ObjectId(avatar as string),
			relatedRelations: {},
		});

	national_card &&
		(relations.national_card = {
			_ids: new ObjectId(national_card as string),
			relatedRelations: {},
		});

	return await user.addRelation({
		filters: { _id: new ObjectId(_id) },
		relations,
		projection: get,
		replace: true,
	});
};
