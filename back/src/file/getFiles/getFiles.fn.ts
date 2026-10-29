import type { ActFn } from "@deps";
import { clampPagination } from "@lib";
import { file } from "../../../mod.ts";

// The model stores the real MIME type in `mimType` (not `type`), so filter on
// that field and match the category prefix rather than one exact MIME string.
const MIME_PREFIXES: Record<string, RegExp> = {
	image: /^image\//,
	video: /^video\//,
	doc: /^(application|text)\//,
};

export const getFilesFn: ActFn = async (body) => {
	const {
		set: { page, limit, name, type },
		get,
	} = body.details;

	const pipeline = [];

	name && pipeline.push({ $match: { name } });
	type && pipeline.push({ $match: { mimType: MIME_PREFIXES[type] } });

	pipeline.push({ $sort: { _id: -1 } });
	const { page: safePage, limit: safeLimit } = clampPagination(page, limit);
	pipeline.push({ $skip: (safePage - 1) * safeLimit });
	pipeline.push({ $limit: safeLimit });

	return await file
		.aggregation({
			pipeline,
			projection: get,
		})
		.toArray();
};
