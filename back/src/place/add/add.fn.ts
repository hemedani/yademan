import { type ActFn, ObjectId, TInsertRelations } from "@deps";
import { coreApp, place } from "../../../mod.ts";
import type { MyContext } from "@lib";
import { place_relations } from "../../../models/place.ts";

export const addFn: ActFn = async (body) => {
	const { set, get } = body.details;
	const { user }: MyContext = coreApp.contextFns
		.getContextModel() as MyContext;

	const {
		province,
		city,
		city_zone,
		category,
		tags,
		gallery,
		thumbnail,
		...rest
	} = set;

	const relations: TInsertRelations<typeof place_relations> = {
		registrar: {
			_ids: user._id,
			relatedRelations: {
				registered_places: true,
			},
		},

		province: {
			_ids: new ObjectId(province as string),
			relatedRelations: {
				places: true,
			},
		},

		city: {
			_ids: new ObjectId(city as string),
			relatedRelations: {
				places: true,
			},
		},

		city_zone: {
			_ids: new ObjectId(city_zone as string),
			relatedRelations: {
				places: true,
			},
		},

		category: {
			_ids: new ObjectId(category as string),
			relatedRelations: {
				places: true,
			},
		},
	};

	tags && tags.length > 0 &&
		(relations.tags = {
			_ids: tags.map((t: string) => new ObjectId(t)),
			relatedRelations: { places: true },
		});

	gallery && gallery.length > 0 &&
		(relations.gallery = {
			_ids: gallery.map((t: string) => new ObjectId(t)),
			relatedRelations: { places: true },
		});

	thumbnail && thumbnail.length > 0 &&
		(relations.thumbnail = {
			_ids: new ObjectId(thumbnail as string),
			relatedRelations: { places: true },
		});

	return await place.insertOne({
		doc: rest,
		relations,
		projection: get,
	});
};
