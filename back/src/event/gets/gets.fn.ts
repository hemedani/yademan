import { type ActFn, Document, ObjectId } from "@deps";
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
	if (name) matchConditions.name = { $regex: new RegExp(name, "i") };
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
			matchConditions.startTime.$lte = new Date(startTimeBefore as string);
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
		if (sort.hasOwnProperty('startTime')) {
			sortObj = { startTime: sort.startTime };
		} else if (sort.hasOwnProperty('_id')) {
			sortObj = { _id: sort._id };
		}
	}

	pipeline.push({ $sort: sortObj });

	// Always add pagination
	pipeline.push({ $skip: (page - 1) * limit });
	pipeline.push({ $limit: limit });

	// Add a count of total results
	const countPipeline: { [key: string]: any }[] = [...pipeline];

	// Remove pagination from count pipeline
	countPipeline.pop(); // Remove $limit
	countPipeline.pop(); // Remove $skip

	// Add $count stage to get total documents
	countPipeline.push({ $count: "total" });

	// Execute both pipelines in parallel for efficiency
	const [results, countResult] = await Promise.all([
		event.aggregation({
			pipeline,
			projection: get.data,
		}).toArray(),
		event.aggregation({
			pipeline: countPipeline,
		}).toArray(),
	]);

	// Get total count (default to 0 if no results)
	const total = countResult.length > 0 ? countResult[0].total : 0;

	// Return results with metadata
	return {
		data: results,
		metadata: {
			total,
			page,
			limit,
			pageCount: Math.ceil(total / limit),
		},
	};
};
