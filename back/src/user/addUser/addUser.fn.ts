import { type ActFn, ObjectId, type TInsertRelations } from "@deps";
import { hash } from "@da/bcrypt";
import { user } from "../../../mod.ts";
import { throwError } from "@lib";
import type { user_relations } from "@model";

export const addUserFn: ActFn = async (body) => {
	const { set, get } = body.details;

	const { nationalCard, avatar, provinceId, cityId, password, ...rest } = set;

	// Passwords must never be stored in clear text.
	const hashedPassword = await hash(password as string);

	const relations: TInsertRelations<typeof user_relations> = {};

	nationalCard &&
		(relations.national_card = {
			_ids: new ObjectId(nationalCard as string),
		});

	avatar &&
		(relations.avatar = {
			_ids: new ObjectId(avatar as string),
		});

	provinceId &&
		(relations.province = {
			// `province` is a *single* relation, so `_ids` must be one ObjectId.
			// Passing an array made the lookup filter `{_id: [id]}`, which never
			// matched and failed with "can not find this relation : province".
			_ids: new ObjectId(provinceId as string),
			relatedRelations: {
				users: true,
			},
		});

	cityId &&
		(relations.city = {
			_ids: new ObjectId(cityId as string),
			relatedRelations: {
				users: true,
			},
		});

	const addedUser = await user.insertOne({
		doc: {
			...rest,
			password: hashedPassword,
		},
		relations,
		projection: get,
	});

	return addedUser;
};
