import { type ActFn, ObjectId } from "@deps";
import { event } from "../../../mod.ts";

export const removeFn: ActFn = async (body) => {
	const {
		set: { _id },
	} = body.details;

	return await event.deleteOne({
		filter: {
			_id: new ObjectId(_id as string),
		},
	});
};
