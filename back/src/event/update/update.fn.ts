import { type ActFn, ObjectId } from "@deps";
import { coreApp, event } from "../../../mod.ts";
import type { MyContext } from "@lib";

export const updateFn: ActFn = async (body) => {
	const { set, get } = body.details;
	const { user }: MyContext = coreApp.contextFns
		.getContextModel() as MyContext;

	const { _id, ...rest } = set; // Remove relation fields like placeIds

	return await event.findOneAndUpdate({
		filter: { _id: new ObjectId(_id as string) },
		update: { $set: rest },
		projection: get,
	});
};
