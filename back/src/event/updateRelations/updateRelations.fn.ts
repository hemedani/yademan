import { type ActFn, ObjectId, type TInsertRelations } from "@deps";
import { coreApp, event } from "../../../mod.ts";
import { event_relations } from "../../../models/event.ts";
import type { MyContext } from "@lib";

export const updateRelationsFn: ActFn = async (body) => {
	const { set, get } = body.details;
	const { user }: MyContext = coreApp.contextFns
		.getContextModel() as MyContext;

	const {
		_id,
		placeIds,
		organizer,
		attendees,
		tags,
		thumbnail,
		gallery,
		replace = false, // default to false for safety
	} = set;

	const relations: TInsertRelations<typeof event_relations> = {};

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

	return await event.addRelation({
		filters: { _id: new ObjectId(_id) },
		relations,
		projection: get,
		replace, // The replace option applies globally to all relations
	});
};
