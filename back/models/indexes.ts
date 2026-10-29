/**
 * Secondary indexes.
 *
 * Lesan's `newModel({ createIndex })` accepts a **single** index spec per model,
 * so every additional index lives here and is applied once at boot.
 *
 * These cover the fields that `*.gets` and `*.count` actually filter on
 * (`status`, `antiquity`, relation ids, `slug`, `name`). Without them every
 * request degrades into a full collection scan.
 */

type IndexSpec = {
	key: Record<string, unknown>;
	name: string;
	unique?: boolean;
	partialFilterExpression?: Record<string, unknown>;
};

interface IndexableCollection {
	// Kept permissive so this module does not need a direct mongodb type import
	// while still accepting the real `Collection` at the call site.
	createIndexes(indexes: readonly unknown[]): Promise<unknown>;
	indexes(): Promise<readonly { name?: string; key?: unknown }[]>;
	dropIndex(name: string): Promise<unknown>;
}

export interface IndexableDb {
	collection(name: string): IndexableCollection;
}

const INDEXES: Record<string, IndexSpec[]> = {
	place: [
		// A standalone unique index is the only way to actually enforce slug
		// uniqueness: a `unique` flag on a compound index only forbids exact
		// duplicates of the whole key.
		{
			name: "slug_unique",
			key: { slug: 1 },
			unique: true,
			partialFilterExpression: { slug: { $exists: true } },
		},
		{ name: "center_2dsphere", key: { center: "2dsphere" } },
		{ name: "area_2dsphere", key: { area: "2dsphere" } },
		{ name: "status_antiquity", key: { status: 1, antiquity: -1 } },
		{ name: "province_id", key: { "province._id": 1 } },
		{ name: "city_id", key: { "city._id": 1 } },
		{ name: "category_id", key: { "category._id": 1 } },
		{ name: "tags_id", key: { "tags._id": 1 } },
	],
	city: [
		{ name: "area_2dsphere", key: { area: "2dsphere" } },
		{ name: "center_2dsphere", key: { center: "2dsphere" } },
		{ name: "province_id", key: { "province._id": 1 } },
		{ name: "name_1", key: { name: 1 } },
	],
	province: [
		{ name: "area_2dsphere", key: { area: "2dsphere" } },
		{ name: "center_2dsphere", key: { center: "2dsphere" } },
		{ name: "name_1", key: { name: 1 } },
	],
	comment: [
		{ name: "place_status", key: { "place._id": 1, status: 1 } },
		{ name: "user_id", key: { "user._id": 1 } },
	],
	event: [
		{ name: "status_1", key: { status: 1 } },
		{ name: "places_id", key: { "places._id": 1 } },
		{ name: "tags_id", key: { "tags._id": 1 } },
	],
	virtual_tour: [{ name: "place_id", key: { "place._id": 1 } }],
};

/**
 * Indexes left behind by the `center_location` bug. They index a field the
 * schemas never define, so they are pure write overhead. Each is dropped only
 * after its replacements exist.
 */
const LEGACY_INDEXES: {
	collection: string;
	name: string;
	replacedBy: string[];
}[] = [
	{
		collection: "place",
		name: "center_2dsphere_area_2dsphere_slug_1",
		replacedBy: ["center_2dsphere", "area_2dsphere"],
	},
	{
		collection: "city",
		name: "area_2dsphere_center_location_2dsphere",
		replacedBy: ["area_2dsphere", "center_2dsphere"],
	},
	{
		collection: "province",
		name: "area_2dsphere_center_location_2dsphere",
		replacedBy: ["area_2dsphere", "center_2dsphere"],
	},
];

export const ensureIndexes = async (db: IndexableDb) => {
	for (const [collectionName, specs] of Object.entries(INDEXES)) {
		const collection = db.collection(collectionName);

		for (const spec of specs) {
			try {
				await collection.createIndexes([spec]);
			} catch (error) {
				// A unique index can fail on pre-existing duplicates. Report it
				// instead of crashing the server on boot.
				console.warn(
					`[indexes] could not create ${collectionName}.${spec.name}: ${
						(error as Error).message
					}`,
				);
			}
		}
	}

	for (const legacy of LEGACY_INDEXES) {
		const collection = db.collection(legacy.collection);

		try {
			const existing = await collection.indexes();
			const names = new Set(
				existing
					.map((index) => index.name)
					.filter((name): name is string => typeof name === "string"),
			);

			if (!names.has(legacy.name)) continue;

			const replacementsReady = legacy.replacedBy.every((name) =>
				names.has(name)
			);
			if (!replacementsReady) continue;

			await collection.dropIndex(legacy.name);
			console.info(
				`[indexes] dropped legacy index ${legacy.collection}.${legacy.name}`,
			);
		} catch (error) {
			console.warn(
				`[indexes] could not drop ${legacy.collection}.${legacy.name}: ${
					(error as Error).message
				}`,
			);
		}
	}
};
