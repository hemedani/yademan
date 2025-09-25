import { type ActFn } from "@deps";
import { category, coreApp } from "../../../mod.ts";
import type { MyContext } from "@lib";

export const addFn: ActFn = async (body) => {
	const { set, get } = body.details;
	const { user }: MyContext = coreApp.contextFns
		.getContextModel() as MyContext;

	const { ...rest } = set;

	return await category.insertOne({
		doc: rest,
		relations: {
			registrar: {
				_ids: user._id,
			},
		},
		projection: get,
	});
};
