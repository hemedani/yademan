import { type ActFn, ObjectId, TInsertRelations } from "@deps";
import { comment, coreApp } from "../../../mod.ts";
import type { MyContext } from "@lib";
import { comment_relations } from "../../../models/comment.ts";

export const addFn: ActFn = async (body) => {
	const { set, get } = body.details;
	const { user }: MyContext = coreApp.contextFns
		.getContextModel() as MyContext;

	const { place, ...rest } = set;

	const relations: TInsertRelations<typeof comment_relations> = {
		user: {
			_ids: user._id,
			relatedRelations: {
				comments: true,
			},
		},

		place: {
			_ids: new ObjectId(place as string),
			relatedRelations: {
				comments: true,
			},
		},
	};

	return await comment.insertOne({
		doc: rest,
		relations,
		projection: get,
	});
};
