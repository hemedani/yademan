import { type ActFn, Document, ObjectId } from "@deps";
import { containsRegex } from "@lib";
import { event } from "../../../mod.ts";

export const getsFn: ActFn = async (body) => {
	const {
		set, // Contains all our filter parameters
		get, // For projection
	} = body.details;

	const {
		// Pagination
		page,
		limit,

		// Basic filters
		name,
		status,
		isPublic,

		// Relations
		registrarId,
		organizerId,
		placeIds,
		tagIds,

		// Time filters
		startTimeAfter,
		startTimeBefore,
		endTimeAfter,
		endTimeBefore,

		// Sort
		sort,
	} = set;

	const pipeline: { [key: string]: any }[] = [];
	const matchConditions: { [key: string]: any } = {};

	// --- Basic Filters ---
	if (name) matchConditions.name = { $regex: containsRegex(name) };
	if (status) matchConditions.status = status;
	if (typeof isPublic === "boolean") matchConditions.isPublic = isPublic;

	// --- Relations ---
	if (registrarId) {
		matchConditions["registrar._id"] = new ObjectId(registrarId as string);
	}

	if (organizerId) {
		matchConditions["organizer._id"] = new ObjectId(organizerId as string);
	}

	// Handle arrays of IDs for places and tags
	if (placeIds && placeIds.length > 0) {
		matchConditions["places._id"] = {
			$in: placeIds.map((pi: string) => new ObjectId(pi)),
		};
	}

	if (tagIds && tagIds.length > 0) {
		matchConditions["tags._id"] = {
			$in: tagIds.map((ti: string) => new ObjectId(ti)),
		};
	}

	// --- Time Filters ---
	if (startTimeAfter || startTimeBefore) {
		matchConditions.startTime = {};
		if (startTimeAfter) {
			matchConditions.startTime.$gte = new Date(startTimeAfter as string);
		}
		if (startTimeBefore) {
			matchConditions.startTime.$lte = new Date(
				startTimeBefore as string,
			);
		}
	}

	if (endTimeAfter || endTimeBefore) {
		matchConditions.endTime = {};
		if (endTimeAfter) {
			matchConditions.endTime.$gte = new Date(endTimeAfter as string);
		}
		if (endTimeBefore) {
			matchConditions.endTime.$lte = new Date(endTimeBefore as string);
		}
	}

	// Add the $match stage to the pipeline if there are any conditions
	if (Object.keys(matchConditions).length > 0) {
		pipeline.push({ $match: matchConditions });
	}

	// --- Pagination and Sorting ---
	// Apply sorting based on the sort parameter
	let sortObj: { [key: string]: number } = { _id: -1 }; // Default sort by most recent

	if (sort && typeof sort === "object") {
		// Check if startTime sort is requested
		if (sort.hasOwnProperty("startTime")) {
			sortObj = { startTime: sort.startTime };
		} else if (sort.hasOwnProperty("_id")) {
			sortObj = { _id: sort._id };
		}
	}

	pipeline.push({ $sort: sortObj });

	// Clamp client-supplied pagination to keep a single request bounded.
	const safeLimit = Math.min(Math.max(1, Math.floor(limit)), 200);
	const safePage = Math.max(1, Math.floor(page));

	// Always add pagination
	pipeline.push({ $skip: (safePage - 1) * safeLimit });
	pipeline.push({ $limit: safeLimit });

	// The count only runs when the caller asked for `metadata`.
	const wantsMetadata = Boolean(get.metadata);

	// Add a count of total results
	const countPipeline: { [key: string]: any }[] = [...pipeline];

	// Remove pagination from count pipeline
	countPipeline.pop(); // Remove $limit
	countPipeline.pop(); // Remove $skip

	// Add $count stage to get total documents
	countPipeline.push({ $count: "total" });

	const [results, countResult] = await Promise.all([
		event.aggregation({
			pipeline,
			projection: get.data,
		}).toArray(),
		wantsMetadata
			? event.aggregation({ pipeline: countPipeline }).toArray()
			: Promise.resolve([] as { total: number }[]),
	]);

	if (!wantsMetadata) {
		return { data: results };
	}

	// Get total count (default to 0 if no results)
	const total = countResult.length > 0 ? countResult[0].total : 0;

	// Return results with metadata
	return {
		data: results,
		metadata: {
			total,
			page: safePage,
			limit: safeLimit,
			pageCount: Math.ceil(total / safeLimit),
		},
	};
};
