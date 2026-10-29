import { type ActFn, ObjectId } from "@deps";
import { comment, coreApp } from "../../../mod.ts";
import { type MyContext, throwError } from "@lib";

// Levels that may remove any comment.
const PRIVILEGED_LEVELS = ["Manager", "Editor", "Ghost"];

export const removeFn: ActFn = async (body) => {
	const {
		set: { _id, hardCascade },
	} = body.details;

	const context = coreApp.contextFns.getContextModel() as MyContext;
	const isPrivileged = PRIVILEGED_LEVELS.includes(context.user.level ?? "");

	// Registered users may delete their own comment, but nobody else's.
	if (!isPrivileged) {
		const existing = await comment.findOne({
			filters: { _id: new ObjectId(_id as string) },
			projection: { user: { _id: 1 } },
		}) as { user?: { _id?: unknown } } | null;

		if (!existing) {
			throwError("comment not found");
		} else if (String(existing.user?._id) !== String(context.user._id)) {
			throwError("You cant do this");
		}
	}

	return await comment.deleteOne({
		filter: { _id: new ObjectId(_id as string) },
		hardCascade: hardCascade || false,
	});
};
