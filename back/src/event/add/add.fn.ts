import { type ActFn, ObjectId, type TInsertRelations } from "@deps";
import { coreApp, event } from "../../../mod.ts";
import type { MyContext } from "@lib";
import { event_relations } from "../../../models/event.ts";

export const addFn: ActFn = async (body) => {
	const { set, get } = body.details;
	const { user }: MyContext = coreApp.contextFns
		.getContextModel() as MyContext;

	const {
		placeIds,
		organizer,
		attendees,
		tags,
		thumbnail,
		gallery,
		...rest
	} = set;

	const relations: TInsertRelations<typeof event_relations> = {
		registrar: {
			_ids: user._id,
			relatedRelations: {
				registered_events: true,
			},
		},
	};

	// Handle optional relations if provided
	placeIds && placeIds.length > 0 &&
		(relations.places = {
			_ids: placeIds.map((id: string) => new ObjectId(id)),
			relatedRelations: { events: true },
		});

	organizer &&
		(relations.organizer = {
			_ids: new ObjectId(organizer as string),
			relatedRelations: { organized_events: true },
		});

	attendees && attendees.length > 0 &&
		(relations.attendees = {
			_ids: attendees.map((id: string) => new ObjectId(id)),
			relatedRelations: { attended_events: true },
		});

	tags && tags.length > 0 &&
		(relations.tags = {
			_ids: tags.map((id: string) => new ObjectId(id)),
			relatedRelations: { events: true },
		});

	thumbnail &&
		(relations.thumbnail = {
			_ids: new ObjectId(thumbnail as string),
		});

	gallery && gallery.length > 0 &&
		(relations.gallery = {
			_ids: gallery.map((id: string) => new ObjectId(id)),
		});

	return await event.insertOne({
		doc: rest,
		relations,
		projection: get,
	});
};
