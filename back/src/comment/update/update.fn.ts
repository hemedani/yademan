import { type ActFn, type Infer, object, ObjectId } from "@deps";
import { comment } from "../../../mod.ts";
import { comment_pure } from "@model";

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

	const pureStruct = object(comment_pure);
	const updateObj: Partial<Infer<typeof pureStruct>> = {
		updatedAt: new Date(),
	};

	text && (updateObj.text = text);
	rating && (updateObj.rating = rating);
	status && (updateObj.status = status);
	is_anonymous !== undefined && (updateObj.is_anonymous = is_anonymous);

	return await comment.findOneAndUpdate({
		filter: { _id: new ObjectId(_id as string) },
		update: {
			$set: updateObj,
		},
		projection: get,
	});
};
