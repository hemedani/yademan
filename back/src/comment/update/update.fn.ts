import { type ActFn, type Infer, object, ObjectId } from "@deps";
import { comment, coreApp } from "../../../mod.ts";
import { type MyContext, throwError } from "@lib";
import { comment_pure } from "@model";

// Levels that may edit any comment and change its moderation status.
const PRIVILEGED_LEVELS = ["Manager", "Editor", "Ghost"];

export const updateFn: ActFn = async (body) => {
	const {
		set: {
			_id,
			text,
			rating,
			status,
			is_anonymous,
		},
		get,
	} = body.details;

	const context = coreApp.contextFns.getContextModel() as MyContext;
	const isPrivileged = PRIVILEGED_LEVELS.includes(context.user.level ?? "");

	// Registered users may edit their own comment, but nobody else's.
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

	const pureStruct = object(comment_pure);
	const updateObj: Partial<Infer<typeof pureStruct>> = {
		updatedAt: new Date(),
	};

	text && (updateObj.text = text);
	rating && (updateObj.rating = rating);
	// Moderation status is reserved for moderators; otherwise a user could
	// approve their own pending comment.
	isPrivileged && status && (updateObj.status = status);
	is_anonymous !== undefined && (updateObj.is_anonymous = is_anonymous);

	return await comment.findOneAndUpdate({
		filter: { _id: new ObjectId(_id as string) },
		update: {
			$set: updateObj,
		},
		projection: get,
	});
};
