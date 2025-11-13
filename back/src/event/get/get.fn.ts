import { type ActFn } from "@deps";
import { event } from "../../../mod.ts";

export const getFn: ActFn = async (body) => {
	const {
		set: { _id },
		get,
	} = body.details;

	return await event.findOne({
		filters: { _id },
		projection: get,
	});
};
