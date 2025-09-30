import { type ActFn, ObjectId } from "@deps";
import { coreApp, virtual_tour } from "../../../mod.ts";
import type { MyContext } from "@lib";

export const addFn: ActFn = async (body) => {
	const { set, get } = body.details;
	const { user }: MyContext = coreApp.contextFns
		.getContextModel() as MyContext;

	const { placeId, panoramaId, ...rest } = set;

	return await virtual_tour.insertOne({
		doc: rest,
		relations: {
			registrar: {
				_ids: user._id,
			},
			panorama: {
				_ids: new ObjectId(panoramaId as string),
			},
			place: {
				_ids: new ObjectId(placeId as string),
				relatedRelations: {
					virtual_tours: true,
				},
			},
		},
		projection: get,
	});
};
