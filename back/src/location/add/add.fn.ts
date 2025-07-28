import { type ActFn, ObjectId, TInsertRelations } from "@deps";
import { coreApp, location } from "../../../mod.ts";
import type { MyContext } from "@lib";
import { location_relations } from "../../../models/location.ts";

export const addFn: ActFn = async (body) => {
	const { set, get } = body.details;
	const { user }: MyContext = coreApp.contextFns
		.getContextModel() as MyContext;

	const { province, city, city_zone, category, tags, ...rest } = set;

	const relations: TInsertRelations<typeof location_relations> = {
		registrer: {
			_ids: user._id,
			relatedRelations: {
				registered_locations: true,
			},
		},

		province: {
			_ids: new ObjectId(province as string),
			relatedRelations: {
				locations: true,
			},
		},

		city: {
			_ids: new ObjectId(city as string),
			relatedRelations: {
				locations: true,
			},
		},

		city_zone: {
			_ids: new ObjectId(city_zone as string),
			relatedRelations: {
				locations: true,
			},
		},

		category: {
			_ids: new ObjectId(category as string),
			relatedRelations: {
				locations: true,
			},
		},
	};

	tags && tags.length > 0 &&
		(relations.tags = {
			_ids: tags.map((t: string) => new ObjectId(t)),
			relatedRelations: { locations: true },
		});

	return await location.insertOne({
		doc: rest,
		relations,
		projection: get,
	});
};
