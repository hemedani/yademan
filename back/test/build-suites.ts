/**
 * Builds the two Lesan playground suites in this folder:
 *
 *   E2E.json                – exercises every backend action (happy path and
 *                             the guards that must reject), and cleans up the
 *                             records it creates so it can run repeatedly.
 *   seed-presentation.json  – fills a fresh database with realistic Iranian
 *                             heritage data so the project can be demoed.
 *
 * Both files are **build artifacts**: edit the readable definitions here and
 * run
 *
 *   deno run -A test/build-suites.ts
 *
 * Lesan's E2E runner expects `bodyHeaders` to be a *stringified* JSON object
 * holding `{ headers, body }`, which is far too error-prone to hand-write.
 *
 * Loading a suite: open `/playground` → E2E tab → “upload json” → pick the file
 * → run. `expectedFailure: { message }` marks a request that must come back
 * with `success: false` and a message containing `message`.
 */

const LOGIN_EMAIL = "e2e@naghshe.dev";
const LOGIN_PASSWORD = "E2ePassword123!";

/** Matches `mediaId()` in `bootstrap.ts`. */
const MEDIA = (index: number): string =>
	`00000000000000000000a1${String(index).padStart(2, "0")}`;

/**
 * Which captured token a case authenticates with.
 *
 * `ordinary` and `ordinaryB` are two *different* Ordinary accounts, which is
 * what makes the cross-user isolation block meaningful: the same request has to
 * succeed for its owner and fail for the other account.
 */
type Token =
	| "manager"
	| "editor"
	| "ordinary"
	| "ordinaryB"
	| "none"
	| "invalid";

type Case = {
	id: string;
	model: string;
	act: string;
	details: Record<string, unknown>;
	token?: Token;
	captures?: { key: string; value: string }[];
	repeat?: number;
	expectedFailure?: { message: string };
};

const tokenHeader = (token: Token | undefined): string => {
	switch (token) {
		case "editor":
			return "{editorToken}";
		case "ordinary":
			return "{ordinaryToken}";
		case "ordinaryB":
			return "{ordinaryBToken}";
		case "none":
			return "";
		case "invalid":
			return "not.a.jwt";
		default:
			return "{token}";
	}
};

const toForm = (testCase: Case) => {
	const form: Record<string, unknown> = {
		id: testCase.id,
		bodyHeaders: JSON.stringify(
			{
				headers: {
					"Content-Type": "application/json",
					token: tokenHeader(testCase.token),
				},
				body: {
					service: "main",
					model: testCase.model,
					act: testCase.act,
					details: testCase.details,
				},
			},
			null,
			2,
		),
		repeat: testCase.repeat ?? 1,
		captures: testCase.captures ?? [],
	};

	if (testCase.expectedFailure) {
		form.expectedFailure = testCase.expectedFailure;
	}

	return form;
};

// ---------------------------------------------------------------------------
// Geometry helpers
// ---------------------------------------------------------------------------

/** A closed ring around `[lng, lat]` (±`size` degrees). */
const ring = (lng: number, lat: number, size = 0.1): number[][] => [
	[lng - size, lat - size],
	[lng + size, lat - size],
	[lng + size, lat + size],
	[lng - size, lat + size],
	[lng - size, lat - size],
];

const multiPolygon = (lng: number, lat: number, size = 0.1) => ({
	type: "MultiPolygon",
	coordinates: [[ring(lng, lat, size)]],
});

const polygon = (lng: number, lat: number, size = 0.1) => ({
	type: "Polygon",
	coordinates: [ring(lng, lat, size)],
});

const point = (lng: number, lat: number) => ({
	type: "Point",
	coordinates: [lng, lat],
});

// ---------------------------------------------------------------------------
// E2E.json — full backend coverage
// ---------------------------------------------------------------------------

/**
 * Fixture coordinates, deliberately away from any real Iranian boundary so the
 * geo assertions cannot pick up seeded data.
 */
const FIXTURE_LNG = 54.05;
const FIXTURE_LAT = 36.05;

const e2e: Case[] = [
	// -- Authentication ------------------------------------------------------
	{
		id: "auth-01-login-wrong-password",
		token: "none",
		model: "user",
		act: "login",
		details: {
			set: { email: LOGIN_EMAIL, password: "DefinitelyWrong123" },
			get: { user: { _id: 1 } },
		},
		expectedFailure: { message: "Your password is incorrect" },
	},
	{
		id: "auth-02-login-unknown-email",
		token: "none",
		model: "user",
		act: "login",
		details: {
			set: {
				email: "nobody@naghshe.dev",
				password: "DefinitelyWrong123",
			},
			get: { user: { _id: 1 } },
		},
		expectedFailure: { message: "This user does not exist at all" },
	},
	{
		id: "auth-03-login-ok",
		token: "none",
		model: "user",
		act: "login",
		details: {
			set: { email: LOGIN_EMAIL, password: LOGIN_PASSWORD },
			get: { user: { _id: 1, email: 1, level: 1 } },
		},
		captures: [{ key: "token", value: "[body][token]" }],
	},
	{
		id: "auth-04-getMe-without-token",
		token: "none",
		model: "user",
		act: "getMe",
		details: { set: {}, get: { _id: 1 } },
		expectedFailure: {
			message: "you should send your id with token key in req header",
		},
	},
	{
		id: "auth-05-getMe-invalid-token",
		token: "invalid",
		model: "user",
		act: "getMe",
		details: { set: {}, get: { _id: 1 } },
		expectedFailure: { message: "The serialization of the jwt is invalid" },
	},
	{
		id: "auth-06-getMe-ok",
		model: "user",
		act: "getMe",
		details: {
			set: {},
			get: { _id: 1, first_name: 1, email: 1, level: 1 },
		},
	},

	// -- Fixtures: geography, taxonomy, place --------------------------------
	{
		id: "fixture-01-province-add",
		model: "province",
		act: "add",
		details: {
			set: {
				name: "استان آزمون خودکار",
				english_name: "E2E Automated Province",
				area: multiPolygon(FIXTURE_LNG, FIXTURE_LAT, 0.2),
				center: point(FIXTURE_LNG, FIXTURE_LAT),
			},
			get: { _id: 1, name: 1 },
		},
		captures: [{ key: "provinceId", value: "[body][_id]" }],
	},
	{
		id: "fixture-02-city-add",
		model: "city",
		act: "add",
		details: {
			set: {
				name: "شهرستان آزمون خودکار",
				english_name: "E2E Automated County",
				area: multiPolygon(FIXTURE_LNG, FIXTURE_LAT, 0.1),
				center: point(FIXTURE_LNG, FIXTURE_LAT),
				provinceId: "{provinceId}",
				isCapital: true,
			},
			get: { _id: 1, name: 1 },
		},
		captures: [{ key: "cityId", value: "[body][_id]" }],
	},
	{
		id: "fixture-03-category-add",
		model: "category",
		act: "add",
		details: {
			set: {
				name: "دسته آزمون خودکار",
				description: "دسته‌ای که تست خودکار ایجاد می‌کند",
				color: "#0f766e",
				icon: "landmark",
			},
			get: { _id: 1, name: 1 },
		},
		captures: [{ key: "categoryId", value: "[body][_id]" }],
	},
	{
		id: "fixture-04-tag-add",
		model: "tag",
		act: "add",
		details: {
			set: {
				name: "برچسب آزمون خودکار",
				description: "برچسبی که تست خودکار ایجاد می‌کند",
				color: "#7c2d12",
				icon: "tag",
			},
			get: { _id: 1, name: 1 },
		},
		captures: [{ key: "tagId", value: "[body][_id]" }],
	},
	{
		id: "fixture-05-place-add",
		model: "place",
		act: "add",
		details: {
			set: {
				name: "بنای آزمون خودکار",
				antiquity: 1200,
				description:
					"بنای ساختگی که فقط برای تست خودکار بک‌اند ساخته می‌شود.",
				// The slug embeds the freshly created province id, so every run
				// gets a unique value even if an earlier run failed midway.
				slug: "e2e-place-{provinceId}",
				center: point(FIXTURE_LNG, FIXTURE_LAT),
				area: multiPolygon(FIXTURE_LNG, FIXTURE_LAT, 0.02),
				address: "نشانی ساختگی برای تست خودکار",
				hoursOfOperation: "۹:۰۰ تا ۱۷:۰۰",
				contact: {
					phone: "02100000000",
					website: "https://example.invalid/e2e",
					social: ["instagram.com/example"],
				},
				meta: { source: "e2e" },
				status: "active",
				province: "{provinceId}",
				city: "{cityId}",
				category: "{categoryId}",
				tags: ["{tagId}"],
				thumbnail: MEDIA(0),
				gallery: [MEDIA(1), MEDIA(2)],
			},
			get: { _id: 1, name: 1, slug: 1 },
		},
		captures: [{ key: "placeId", value: "[body][_id]" }],
	},
	{
		id: "fixture-06-place-add-duplicate-slug",
		model: "place",
		act: "add",
		details: {
			set: {
				name: "بنای تکراری",
				antiquity: 100,
				description: "این رکورد باید به‌خاطر اسلاگ تکراری رد شود.",
				slug: "e2e-place-{provinceId}",
				center: point(FIXTURE_LNG, FIXTURE_LAT),
				area: multiPolygon(FIXTURE_LNG, FIXTURE_LAT, 0.02),
				status: "draft",
				province: "{provinceId}",
				city: "{cityId}",
				category: "{categoryId}",
			},
			get: { _id: 1 },
		},
		// Proves the standalone `slug_unique` partial index is actually
		// enforced (a `unique` flag on a compound index would not be).
		expectedFailure: { message: "E11000 duplicate key error" },
	},
	{
		id: "fixture-07-comment-add",
		model: "comment",
		act: "add",
		details: {
			set: {
				text: "نظر آزمون خودکار درباره این بنا.",
				rating: 5,
				place: "{placeId}",
			},
			get: { _id: 1, text: 1, status: 1 },
		},
		captures: [{ key: "commentId", value: "[body][_id]" }],
	},
	{
		id: "fixture-08-virtual-tour-add",
		model: "virtual_tour",
		act: "add",
		details: {
			set: {
				name: "تور مجازی آزمون خودکار",
				description: "تور مجازی ساختگی برای تست.",
				status: "active",
				hotspots: [
					{ pitch: 10, yaw: 20, description: "نقطه اول" },
					{ pitch: -5, yaw: 140, description: "نقطه دوم" },
				],
				placeId: "{placeId}",
				panoramaId: MEDIA(3),
			},
			get: { _id: 1, name: 1, status: 1 },
		},
		captures: [{ key: "tourId", value: "[body][_id]" }],
	},
	{
		id: "fixture-09-event-add",
		model: "event",
		act: "add",
		details: {
			set: {
				name: "رویداد آزمون خودکار",
				description: "رویداد ساختگی برای تست.",
				startTime: "2027-05-01T09:00:00.000Z",
				endTime: "2027-05-03T18:00:00.000Z",
				status: "published",
				isPublic: true,
				ticketPrice: "0",
				registrationRequired: false,
				placeIds: ["{placeId}"],
				tags: ["{tagId}"],
				thumbnail: MEDIA(4),
				gallery: [MEDIA(5)],
			},
			get: { _id: 1, name: 1, status: 1 },
		},
		captures: [{ key: "eventId", value: "[body][_id]" }],
	},

	// -- Authorization -------------------------------------------------------
	{
		id: "authz-01-register-ordinary-user",
		token: "none",
		model: "user",
		act: "registerUser",
		details: {
			set: {
				first_name: "کاربر",
				last_name: "عادی",
				email: "e2e-{provinceId}@naghshe.dev",
				password: "OrdinaryPass123!",
				gender: "Female",
			},
			get: { _id: 1, email: 1, level: 1 },
		},
		captures: [{ key: "ordinaryUserId", value: "[body][_id]" }],
	},
	{
		id: "authz-02-login-ordinary-user",
		token: "none",
		model: "user",
		act: "login",
		details: {
			set: {
				email: "e2e-{provinceId}@naghshe.dev",
				password: "OrdinaryPass123!",
			},
			get: { user: { _id: 1, level: 1 } },
		},
		captures: [{ key: "ordinaryToken", value: "[body][token]" }],
	},
	{
		id: "authz-03-province-add-as-ordinary",
		token: "ordinary",
		model: "province",
		act: "add",
		details: {
			set: {
				name: "استان غیرمجاز",
				english_name: "Unauthorized Province",
				area: multiPolygon(FIXTURE_LNG, FIXTURE_LAT, 0.2),
				center: point(FIXTURE_LNG, FIXTURE_LAT),
			},
			get: { _id: 1 },
		},
		expectedFailure: { message: "You cant do this" },
	},
	{
		id: "authz-04-province-add-anonymous",
		token: "none",
		model: "province",
		act: "add",
		details: {
			set: {
				name: "استان ناشناس",
				english_name: "Anonymous Province",
				area: multiPolygon(FIXTURE_LNG, FIXTURE_LAT, 0.2),
				center: point(FIXTURE_LNG, FIXTURE_LAT),
			},
			get: { _id: 1 },
		},
		expectedFailure: {
			message: "you should send your id with token key in req header",
		},
	},

	// -- Cross-user isolation -----------------------------------------------
	//
	// Two independent Ordinary accounts, A (`ordinaryToken`) and B
	// (`ordinaryBToken`). The same request has to succeed for the owner and be
	// rejected for the other account — the equivalent of a row-level-security
	// matrix, and the part of the surface that regresses most quietly.
	//
	// `comment.update` / `comment.remove` are the only acts with per-owner
	// checks; everything else below is the admin-only boundary.
	{
		id: "iso-01-register-user-b",
		token: "none",
		model: "user",
		act: "registerUser",
		details: {
			set: {
				first_name: "کاربر",
				last_name: "دوم",
				email: "e2e-b-{provinceId}@naghshe.dev",
				password: "SecondPass123!",
				gender: "Male",
			},
			get: { _id: 1, level: 1 },
		},
		captures: [{ key: "ordinaryBUserId", value: "[body][_id]" }],
	},
	{
		id: "iso-02-login-user-b",
		token: "none",
		model: "user",
		act: "login",
		details: {
			set: {
				email: "e2e-b-{provinceId}@naghshe.dev",
				password: "SecondPass123!",
			},
			get: { user: { _id: 1, level: 1 } },
		},
		captures: [{ key: "ordinaryBToken", value: "[body][token]" }],
	},
	{
		id: "iso-03-a-adds-comment",
		token: "ordinary",
		model: "comment",
		act: "add",
		details: {
			set: {
				text: "نظر کاربر الف که فقط خودش باید بتواند ویرایشش کند.",
				rating: 4,
				place: "{placeId}",
			},
			get: { _id: 1, text: 1 },
		},
		captures: [{ key: "commentAId", value: "[body][_id]" }],
	},
	{
		id: "iso-04-a-updates-own-comment",
		token: "ordinary",
		model: "comment",
		act: "update",
		details: {
			set: {
				_id: "{commentAId}",
				text: "متن ویرایش‌شده توسط خود کاربر الف.",
			},
			get: { _id: 1, text: 1 },
		},
	},
	{
		id: "iso-05-b-updates-a-comment",
		token: "ordinaryB",
		model: "comment",
		act: "update",
		details: {
			set: {
				_id: "{commentAId}",
				text: "تلاش کاربر ب برای ویرایش نظر الف.",
			},
			get: { _id: 1, text: 1 },
		},
		expectedFailure: { message: "You cant do this" },
	},
	{
		id: "iso-06-b-removes-a-comment",
		token: "ordinaryB",
		model: "comment",
		act: "remove",
		details: { set: { _id: "{commentAId}" }, get: { success: 1 } },
		expectedFailure: { message: "You cant do this" },
	},
	{
		id: "iso-07-a-removes-own-comment",
		token: "ordinary",
		model: "comment",
		act: "remove",
		details: { set: { _id: "{commentAId}" }, get: { success: 1 } },
	},
	// Ordinary accounts must not reach the admin-only acts. Payloads are fully
	// valid on purpose: every one of these acts runs its validator *before*
	// `grantAccess`, so a malformed body would fail with a schema error and
	// never exercise the authorization check.
	{
		id: "iso-08-ordinary-getUsers",
		token: "ordinary",
		model: "user",
		act: "getUsers",
		details: { set: { page: 1, limit: 5 }, get: { _id: 1 } },
		expectedFailure: { message: "You cant do this" },
	},
	{
		id: "iso-09-ordinary-getUser-other",
		token: "ordinary",
		model: "user",
		act: "getUser",
		details: {
			set: { _id: "{ordinaryBUserId}" },
			get: { _id: 1, email: 1 },
		},
		expectedFailure: { message: "You cant do this" },
	},
	{
		id: "iso-10-ordinary-updateUser-other",
		token: "ordinary",
		model: "user",
		act: "updateUser",
		details: {
			set: { _id: "{ordinaryBUserId}", first_name: "هک‌شده" },
			get: { _id: 1 },
		},
		expectedFailure: { message: "You cant do this" },
	},
	{
		id: "iso-11-ordinary-updateUserRelations-other",
		token: "ordinary",
		model: "user",
		act: "updateUserRelations",
		details: {
			set: { _id: "{ordinaryBUserId}", avatar: MEDIA(10) },
			get: { _id: 1 },
		},
		expectedFailure: { message: "You cant do this" },
	},
	{
		id: "iso-12-ordinary-removeUser-other",
		token: "ordinary",
		model: "user",
		act: "removeUser",
		details: { set: { _id: "{ordinaryBUserId}" }, get: { success: 1 } },
		expectedFailure: { message: "You cant do this" },
	},
	{
		id: "iso-13-ordinary-place-update",
		token: "ordinary",
		model: "place",
		act: "update",
		details: {
			set: { _id: "{placeId}", name: "نام هک‌شده" },
			get: { _id: 1 },
		},
		expectedFailure: { message: "You cant do this" },
	},
	{
		id: "iso-14-ordinary-place-remove",
		token: "ordinary",
		model: "place",
		act: "remove",
		details: { set: { _id: "{placeId}" }, get: { success: 1 } },
		expectedFailure: { message: "You cant do this" },
	},
	{
		id: "iso-15-ordinary-event-add",
		token: "ordinary",
		model: "event",
		act: "add",
		details: {
			set: {
				name: "رویداد غیرمجاز",
				description: "کاربر عادی نباید بتواند رویداد بسازد.",
				startTime: "2027-06-01T09:00:00.000Z",
				endTime: "2027-06-02T18:00:00.000Z",
				status: "draft",
				isPublic: false,
				placeIds: ["{placeId}"],
			},
			get: { _id: 1 },
		},
		expectedFailure: { message: "You cant do this" },
	},
	// Reads stay public: the whole site is browsable without a session.
	{
		id: "iso-16-anonymous-place-gets",
		token: "none",
		model: "place",
		act: "gets",
		details: {
			set: { page: 1, limit: 5 },
			get: { data: { _id: 1, name: 1, slug: 1 } },
		},
	},
	{
		id: "iso-17-anonymous-comment-gets",
		token: "none",
		model: "comment",
		act: "gets",
		details: {
			set: { page: 1, limit: 5, place: "{placeId}" },
			get: { _id: 1, text: 1 },
		},
	},

	// -- Reads: place --------------------------------------------------------
	{
		id: "place-01-get",
		model: "place",
		act: "get",
		details: {
			set: { _id: "{placeId}" },
			get: { _id: 1, name: 1, status: 1, antiquity: 1 },
		},
	},
	{
		id: "place-02-get-invalid-id",
		model: "place",
		act: "get",
		details: { set: { _id: "not-an-object-id" }, get: { _id: 1 } },
		expectedFailure: { message: "input must be a 24 character hex string" },
	},
	{
		id: "place-03-gets-with-metadata",
		model: "place",
		act: "gets",
		details: {
			set: { page: 1, limit: 5, name: "آزمون خودکار" },
			get: {
				data: { _id: 1, name: 1, slug: 1 },
				metadata: { total: 1, page: 1, limit: 1, pageCount: 1 },
			},
		},
	},
	{
		id: "place-04-gets-without-metadata",
		model: "place",
		act: "gets",
		details: {
			set: { page: 1, limit: 2 },
			get: { data: { _id: 1, name: 1 } },
		},
		// Exercises the runner's `repeat` path as well as the metadata-free
		// projection (which skips the extra `$count` aggregation).
		repeat: 2,
	},
	{
		id: "place-05-gets-regex-injection",
		model: "place",
		act: "gets",
		details: {
			set: { page: 1, limit: 5, name: "(" },
			get: { data: { _id: 1, name: 1 } },
		},
		// User input used to be interpolated into `new RegExp` unescaped, which
		// made this a 500 and a ReDoS vector. It must now be a clean empty page.
	},
	{
		id: "place-06-gets-by-slug",
		model: "place",
		act: "gets",
		details: {
			set: { page: 1, limit: 5, slug: "e2e-place-{provinceId}" },
			get: { data: { _id: 1, name: 1, slug: 1 } },
		},
	},
	{
		id: "place-07-gets-by-province-name",
		model: "place",
		act: "gets",
		details: {
			set: { page: 1, limit: 5, province: "استان آزمون خودکار" },
			get: { data: { _id: 1, name: 1 } },
		},
	},
	{
		id: "place-08-gets-by-province-id",
		model: "place",
		act: "gets",
		details: {
			set: { page: 1, limit: 5, province: "{provinceId}" },
			get: { data: { _id: 1, name: 1 } },
		},
	},
	{
		id: "place-09-gets-near",
		model: "place",
		act: "gets",
		details: {
			set: {
				page: 1,
				limit: 5,
				near: point(FIXTURE_LNG, FIXTURE_LAT),
				maxDistance: 5000,
			},
			get: { data: { _id: 1, name: 1 } },
		},
	},
	{
		id: "place-10-gets-polygon",
		model: "place",
		act: "gets",
		details: {
			set: {
				page: 1,
				limit: 5,
				polygon: polygon(FIXTURE_LNG, FIXTURE_LAT, 0.2),
			},
			get: { data: { _id: 1, name: 1 } },
		},
	},
	{
		id: "place-11-gets-area",
		model: "place",
		act: "gets",
		details: {
			set: {
				page: 1,
				limit: 5,
				area: polygon(FIXTURE_LNG, FIXTURE_LAT, 0.2),
			},
			get: { data: { _id: 1, name: 1 } },
		},
	},
	{
		id: "place-12-gets-antiquity-and-status",
		model: "place",
		act: "gets",
		details: {
			set: { page: 1, limit: 5, antiquity: 200, status: "active" },
			get: { data: { _id: 1, name: 1, antiquity: 1, status: 1 } },
		},
	},
	{
		id: "place-13-gets-by-category-and-tag",
		model: "place",
		act: "gets",
		details: {
			set: {
				page: 1,
				limit: 5,
				categoryIds: ["{categoryId}"],
				tagIds: ["{tagId}"],
			},
			get: { data: { _id: 1, name: 1 } },
		},
	},
	{
		id: "place-14-count",
		model: "place",
		act: "count",
		details: { set: {}, get: { total: 1, filtered: 1 } },
	},
	{
		id: "place-15-count-filtered",
		model: "place",
		act: "count",
		details: {
			set: {
				name: "آزمون خودکار",
				province: "استان آزمون خودکار",
				polygon: polygon(FIXTURE_LNG, FIXTURE_LAT, 0.2),
			},
			get: { total: 1, filtered: 1 },
		},
	},

	// -- Reads: city / province / category / tag -----------------------------
	{
		id: "city-01-get",
		model: "city",
		act: "get",
		details: { set: { _id: "{cityId}" }, get: { _id: 1, name: 1 } },
	},
	{
		id: "city-02-gets",
		model: "city",
		act: "gets",
		details: {
			set: { page: 1, limit: 5, name: "آزمون خودکار" },
			get: { _id: 1, name: 1 },
		},
	},
	{
		id: "city-03-gets-by-province",
		model: "city",
		act: "gets",
		details: {
			set: { page: 1, limit: 5, provinceId: "{provinceId}" },
			get: { _id: 1, name: 1, province: { _id: 1 } },
		},
	},
	{
		id: "city-04-count",
		model: "city",
		act: "count",
		details: { set: {}, get: { qty: 1 } },
	},
	{
		id: "province-01-get",
		model: "province",
		act: "get",
		details: { set: { _id: "{provinceId}" }, get: { _id: 1, name: 1 } },
	},
	{
		id: "province-02-gets",
		model: "province",
		act: "gets",
		details: {
			set: { page: 1, limit: 5, name: "آزمون خودکار" },
			get: { _id: 1, name: 1 },
		},
	},
	{
		id: "province-03-count",
		model: "province",
		act: "count",
		details: { set: {}, get: { qty: 1 } },
	},
	{
		id: "category-01-get",
		model: "category",
		act: "get",
		details: { set: { _id: "{categoryId}" }, get: { _id: 1, name: 1 } },
	},
	{
		id: "category-02-gets",
		model: "category",
		act: "gets",
		details: {
			set: { page: 1, limit: 5, name: "آزمون خودکار" },
			get: { _id: 1, name: 1 },
		},
	},
	{
		id: "category-03-count",
		model: "category",
		act: "count",
		details: { set: {}, get: { qty: 1 } },
	},
	{
		id: "tag-01-get",
		model: "tag",
		act: "get",
		details: { set: { _id: "{tagId}" }, get: { _id: 1, name: 1 } },
	},
	{
		id: "tag-02-gets",
		model: "tag",
		act: "gets",
		details: {
			set: { page: 1, limit: 5, name: "آزمون خودکار" },
			get: { _id: 1, name: 1 },
		},
	},
	{
		id: "tag-03-count",
		model: "tag",
		act: "count",
		details: { set: {}, get: { qty: 1 } },
	},

	// -- Reads: comment / virtual_tour / event -------------------------------
	{
		id: "comment-01-get",
		model: "comment",
		act: "get",
		details: { set: { _id: "{commentId}" }, get: { _id: 1, text: 1 } },
	},
	{
		id: "comment-02-gets-by-place",
		model: "comment",
		act: "gets",
		details: {
			set: { page: 1, limit: 5, place: "{placeId}" },
			get: { _id: 1, text: 1, status: 1, rating: 1 },
		},
	},
	{
		id: "comment-03-count",
		model: "comment",
		act: "count",
		details: { set: {}, get: { total: 1, filtered: 1 } },
	},
	{
		id: "comment-04-count-filtered",
		model: "comment",
		act: "count",
		details: {
			set: { place: "{placeId}", status: "pending" },
			get: { total: 1, filtered: 1 },
		},
	},
	{
		id: "virtual-tour-01-get",
		model: "virtual_tour",
		act: "get",
		details: { set: { _id: "{tourId}" }, get: { _id: 1, name: 1 } },
	},
	{
		id: "virtual-tour-02-gets-by-place",
		model: "virtual_tour",
		act: "gets",
		details: {
			set: { page: 1, limit: 5, placeId: "{placeId}" },
			get: { _id: 1, name: 1, status: 1 },
		},
	},
	{
		id: "virtual-tour-03-count",
		model: "virtual_tour",
		act: "count",
		details: { set: {}, get: { qty: 1 } },
	},
	{
		id: "event-01-get",
		model: "event",
		act: "get",
		details: { set: { _id: "{eventId}" }, get: { _id: 1, name: 1 } },
	},
	{
		id: "event-02-gets",
		model: "event",
		act: "gets",
		details: {
			set: { page: 1, limit: 5, name: "آزمون خودکار" },
			get: {
				data: { _id: 1, name: 1, status: 1 },
				metadata: { total: 1 },
			},
		},
	},
	{
		id: "event-03-gets-by-place",
		model: "event",
		act: "gets",
		details: {
			set: { page: 1, limit: 5, placeIds: ["{placeId}"] },
			get: { data: { _id: 1, name: 1 } },
		},
	},
	{
		id: "event-04-gets-time-window",
		model: "event",
		act: "gets",
		details: {
			set: {
				page: 1,
				limit: 5,
				startTimeAfter: "2027-01-01T00:00:00.000Z",
				endTimeBefore: "2027-12-31T00:00:00.000Z",
				isPublic: true,
				sort: { startTime: 1 },
			},
			get: { data: { _id: 1, name: 1, startTime: 1 } },
		},
	},
	{
		id: "event-05-count",
		model: "event",
		act: "count",
		// `event.count` has no `get` in its validator; sending one fails.
		details: { set: { placeIds: ["{placeId}"] } },
	},

	// -- Reads: file / user --------------------------------------------------
	{
		id: "file-01-getFiles",
		model: "file",
		act: "getFiles",
		details: {
			set: { page: 1, limit: 5 },
			get: { _id: 1, name: 1, mimType: 1 },
		},
	},
	{
		id: "file-02-getFiles-images",
		model: "file",
		act: "getFiles",
		details: {
			set: { page: 1, limit: 5, type: "image" },
			get: { _id: 1, name: 1, mimType: 1 },
		},
	},
	{
		id: "file-03-getFiles-videos",
		model: "file",
		act: "getFiles",
		details: {
			set: { page: 1, limit: 5, type: "video" },
			get: { _id: 1, name: 1, mimType: 1 },
		},
	},
	{
		id: "file-04-getFiles-docs",
		model: "file",
		act: "getFiles",
		details: {
			set: { page: 1, limit: 5, type: "doc" },
			get: { _id: 1, name: 1, mimType: 1 },
		},
	},
	{
		id: "user-01-getUsers",
		model: "user",
		act: "getUsers",
		details: {
			set: { page: 1, limit: 5 },
			get: { _id: 1, email: 1, level: 1 },
		},
	},
	{
		id: "user-02-getUsers-by-level",
		model: "user",
		act: "getUsers",
		details: {
			set: { page: 1, limit: 5, levels: "Editor" },
			get: { _id: 1, email: 1, level: 1 },
		},
	},
	{
		id: "user-03-countUsers",
		model: "user",
		act: "countUsers",
		details: { set: {}, get: { qty: 1 } },
	},
	{
		id: "user-04-countUsers-by-level",
		model: "user",
		act: "countUsers",
		// Filtering by `levels` used to read a non-existent `levels` field and
		// always returned 0.
		details: { set: { levels: "Manager" }, get: { qty: 1 } },
	},
	{
		id: "user-05-dashboardStatistic",
		model: "user",
		act: "dashboardStatistic",
		details: {
			set: {},
			get: {
				users: 1,
				provinces: 1,
				cities: 1,
				places: 1,
				categories: 1,
				tags: 1,
			},
		},
	},
	{
		id: "user-06-tempUser-blocked",
		token: "none",
		model: "user",
		act: "tempUser",
		details: {
			set: {
				first_name: "موقت",
				last_name: "کاربر",
				email: "e2e-temp@naghshe.dev",
				password: "TempPass123!",
				gender: "Male",
			},
			get: { _id: 1 },
		},
		// `tempUser` is the empty-database bootstrap; it must refuse as soon as
		// any user exists.
		expectedFailure: { message: "Can not do this Action" },
	},

	// -- Updates -------------------------------------------------------------
	{
		id: "place-16-update",
		model: "place",
		act: "update",
		details: {
			set: {
				_id: "{placeId}",
				name: "بنای آزمون خودکار (ویرایش‌شده)",
				antiquity: 1300,
				status: "draft",
				contact: { phone: "02111111111" },
			},
			get: { _id: 1, name: 1, status: 1, antiquity: 1 },
		},
	},
	{
		id: "place-17-update-relations",
		model: "place",
		act: "updatePlaceRelations",
		details: {
			set: {
				_id: "{placeId}",
				tags: ["{tagId}"],
				gallery: [MEDIA(6), MEDIA(7)],
			},
			get: { _id: 1, tags: { _id: 1 }, gallery: { _id: 1 } },
		},
	},
	{
		id: "place-18-remove-relations",
		model: "place",
		act: "removePlaceRelations",
		details: {
			set: { _id: "{placeId}", gallery: [MEDIA(7)] },
			get: { _id: 1, gallery: { _id: 1 } },
		},
	},
	{
		id: "city-05-update",
		model: "city",
		act: "update",
		details: {
			set: {
				_id: "{cityId}",
				name: "شهرستان آزمون خودکار (ویرایش‌شده)",
				center: point(FIXTURE_LNG, FIXTURE_LAT),
			},
			get: { _id: 1, name: 1 },
		},
	},
	{
		id: "province-04-update",
		model: "province",
		act: "update",
		details: {
			set: {
				_id: "{provinceId}",
				name: "استان آزمون خودکار (ویرایش‌شده)",
			},
			get: { _id: 1, name: 1 },
		},
	},
	{
		id: "category-04-update",
		model: "category",
		act: "update",
		details: {
			set: {
				_id: "{categoryId}",
				name: "دسته آزمون خودکار (ویرایش‌شده)",
				description: "توضیح ویرایش‌شده",
			},
			get: { _id: 1, name: 1 },
		},
	},
	{
		id: "tag-04-update",
		model: "tag",
		act: "update",
		details: {
			set: {
				_id: "{tagId}",
				name: "برچسب آزمون خودکار (ویرایش‌شده)",
				color: "#0f766e",
			},
			get: { _id: 1, name: 1 },
		},
	},
	{
		id: "comment-05-update",
		model: "comment",
		act: "update",
		details: {
			set: {
				_id: "{commentId}",
				text: "متن ویرایش‌شده توسط تست خودکار.",
				rating: 4,
				status: "approved",
			},
			get: { _id: 1, text: 1, rating: 1, status: 1 },
		},
	},
	{
		id: "virtual-tour-04-update",
		model: "virtual_tour",
		act: "update",
		details: {
			set: {
				_id: "{tourId}",
				name: "تور مجازی آزمون خودکار (ویرایش‌شده)",
				status: "draft",
				hotspots: [{
					pitch: 0,
					yaw: 90,
					description: "نقطه ویرایش‌شده",
				}],
			},
			get: { _id: 1, name: 1, status: 1 },
		},
	},
	{
		id: "event-06-update",
		model: "event",
		act: "update",
		details: {
			set: {
				_id: "{eventId}",
				name: "رویداد آزمون خودکار (ویرایش‌شده)",
				description: "توضیح ویرایش‌شده",
				startTime: "2027-06-01T09:00:00.000Z",
				endTime: "2027-06-02T18:00:00.000Z",
				status: "published",
			},
			get: { _id: 1, name: 1 },
		},
	},
	{
		id: "event-07-update-relations",
		model: "event",
		act: "updateRelations",
		details: {
			set: {
				_id: "{eventId}",
				tags: ["{tagId}"],
				attendees: ["{ordinaryUserId}"],
				gallery: [MEDIA(8)],
				replace: false,
			},
			get: { _id: 1, name: 1 },
		},
	},
	{
		id: "user-07-addUser",
		model: "user",
		act: "addUser",
		details: {
			set: {
				first_name: "ادیتور",
				last_name: "آزمون",
				email: "e2e-editor-{provinceId}@naghshe.dev",
				password: "EditorPass123!",
				gender: "Male",
				level: "Editor",
				provinceId: "{provinceId}",
				cityId: "{cityId}",
			},
			get: { _id: 1, email: 1, level: 1 },
		},
		captures: [{ key: "targetUserId", value: "[body][_id]" }],
	},
	{
		id: "user-08-addUser-ghost-blocked",
		model: "user",
		act: "addUser",
		details: {
			set: {
				first_name: "روح",
				last_name: "غیرمجاز",
				email: "e2e-ghost-{provinceId}@naghshe.dev",
				password: "GhostPass123!",
				gender: "Male",
				level: "Ghost",
			},
			get: { _id: 1 },
		},
		// `checkGhostUser` must stop a non-Ghost manager from minting a Ghost.
		expectedFailure: { message: "Sorry can not add this level" },
	},
	{
		id: "user-09-getUser",
		model: "user",
		act: "getUser",
		details: {
			set: { _id: "{targetUserId}" },
			get: { _id: 1, email: 1, level: 1 },
		},
	},
	{
		id: "user-10-updateUser",
		model: "user",
		act: "updateUser",
		details: {
			set: {
				_id: "{targetUserId}",
				first_name: "ادیتور ویرایش‌شده",
				summary: "خلاصه ویرایش‌شده توسط تست خودکار.",
			},
			get: { _id: 1, first_name: 1 },
		},
	},
	{
		id: "user-11-updateUserRelations",
		model: "user",
		act: "updateUserRelations",
		details: {
			set: { _id: "{targetUserId}", avatar: MEDIA(9) },
			get: { _id: 1, avatar: { _id: 1, name: 1 } },
		},
	},
	{
		id: "user-12-toggleFavArticle-add",
		model: "user",
		act: "toggleFavArticle",
		details: {
			set: { articleId: "{placeId}" },
			get: { _id: 1, favArticles: { _id: 1 } },
		},
	},
	{
		id: "user-13-toggleFavArticle-remove",
		model: "user",
		act: "toggleFavArticle",
		details: {
			set: { articleId: "{placeId}" },
			get: { _id: 1, favArticles: { _id: 1 } },
		},
	},

	// -- Role matrix: Editor ------------------------------------------------
	//
	// The Editor account created by `user-07-addUser` sits between Ordinary and
	// Manager: it may moderate comments and run the event lifecycle, but it may
	// not touch the taxonomy, the geography or other users. Every denial below
	// sends a schema-valid body so the assertion can only pass on `grantAccess`.
	{
		id: "role-01-login-editor",
		token: "none",
		model: "user",
		act: "login",
		details: {
			set: {
				email: "e2e-editor-{provinceId}@naghshe.dev",
				password: "EditorPass123!",
			},
			get: { user: { _id: 1, level: 1 } },
		},
		captures: [{ key: "editorToken", value: "[body][token]" }],
	},
	{
		id: "role-02-editor-getUsers",
		token: "editor",
		model: "user",
		act: "getUsers",
		details: { set: { page: 1, limit: 5 }, get: { _id: 1, level: 1 } },
	},
	{
		id: "role-03-editor-getUser",
		token: "editor",
		model: "user",
		act: "getUser",
		details: {
			set: { _id: "{targetUserId}" },
			get: { _id: 1, email: 1, level: 1 },
		},
	},
	{
		id: "role-04-editor-moderates-comment",
		token: "editor",
		model: "comment",
		act: "update",
		details: {
			// Editors are privileged in `comment.update`, so they may change the
			// moderation status of a comment they do not own.
			set: { _id: "{commentId}", status: "approved" },
			get: { _id: 1, status: 1 },
		},
	},
	{
		id: "role-05-editor-event-add",
		token: "editor",
		model: "event",
		act: "add",
		details: {
			set: {
				name: "رویداد ساخته‌شده توسط ادیتور",
				description: "ادیتور اجازه ساخت رویداد دارد.",
				startTime: "2027-07-01T09:00:00.000Z",
				endTime: "2027-07-02T18:00:00.000Z",
				status: "draft",
				isPublic: false,
				placeIds: ["{placeId}"],
			},
			get: { _id: 1, name: 1 },
		},
		captures: [{ key: "editorEventId", value: "[body][_id]" }],
	},
	{
		id: "role-06-editor-event-remove-denied",
		token: "editor",
		model: "event",
		act: "remove",
		// Asymmetry worth pinning: Editor may create and update events but not
		// delete them.
		details: { set: { _id: "{editorEventId}" }, get: {} },
		expectedFailure: { message: "You cant do this" },
	},
	{
		id: "role-07-editor-place-add-denied",
		token: "editor",
		model: "place",
		act: "add",
		details: {
			set: {
				name: "بنای غیرمجاز",
				antiquity: 10,
				description: "ادیتور نباید بتواند بنا بسازد.",
				center: point(FIXTURE_LNG, FIXTURE_LAT),
				area: multiPolygon(FIXTURE_LNG, FIXTURE_LAT, 0.02),
				status: "draft",
				province: "{provinceId}",
				city: "{cityId}",
				category: "{categoryId}",
			},
			get: { _id: 1 },
		},
		expectedFailure: { message: "You cant do this" },
	},
	{
		id: "role-08-editor-place-update-denied",
		token: "editor",
		model: "place",
		act: "update",
		details: {
			set: { _id: "{placeId}", name: "نام تغییر‌یافته" },
			get: { _id: 1 },
		},
		expectedFailure: { message: "You cant do this" },
	},
	{
		id: "role-09-editor-place-updateRelations-denied",
		token: "editor",
		model: "place",
		act: "updatePlaceRelations",
		details: {
			set: { _id: "{placeId}", tags: ["{tagId}"] },
			get: { _id: 1 },
		},
		expectedFailure: { message: "You cant do this" },
	},
	{
		id: "role-10-editor-category-add-denied",
		token: "editor",
		model: "category",
		act: "add",
		details: {
			set: {
				name: "دسته غیرمجاز",
				description: "ادیتور نباید دسته بسازد.",
				color: "#000000",
				icon: "tag",
			},
			get: { _id: 1 },
		},
		expectedFailure: { message: "You cant do this" },
	},
	{
		id: "role-11-editor-tag-add-denied",
		token: "editor",
		model: "tag",
		act: "add",
		details: {
			set: {
				name: "برچسب غیرمجاز",
				description: "ادیتور نباید برچسب بسازد.",
				color: "#000000",
				icon: "tag",
			},
			get: { _id: 1 },
		},
		expectedFailure: { message: "You cant do this" },
	},
	{
		id: "role-12-editor-city-add-denied",
		token: "editor",
		model: "city",
		act: "add",
		details: {
			set: {
				name: "شهر غیرمجاز",
				english_name: "Unauthorized City",
				area: multiPolygon(FIXTURE_LNG, FIXTURE_LAT, 0.1),
				center: point(FIXTURE_LNG, FIXTURE_LAT),
				provinceId: "{provinceId}",
				isCapital: false,
			},
			get: { _id: 1 },
		},
		expectedFailure: { message: "You cant do this" },
	},
	{
		id: "role-13-editor-province-add-denied",
		token: "editor",
		model: "province",
		act: "add",
		details: {
			set: {
				name: "استان غیرمجاز ادیتور",
				english_name: "Unauthorized Editor Province",
				area: multiPolygon(FIXTURE_LNG, FIXTURE_LAT, 0.2),
				center: point(FIXTURE_LNG, FIXTURE_LAT),
			},
			get: { _id: 1 },
		},
		expectedFailure: { message: "You cant do this" },
	},
	{
		id: "role-14-editor-virtual-tour-add-denied",
		token: "editor",
		model: "virtual_tour",
		act: "add",
		details: {
			set: {
				name: "تور غیرمجاز",
				description: "ادیتور نباید تور مجازی بسازد.",
				status: "active",
				hotspots: [{ pitch: 0, yaw: 0 }],
				placeId: "{placeId}",
				panoramaId: MEDIA(11),
			},
			get: { _id: 1 },
		},
		expectedFailure: { message: "You cant do this" },
	},
	{
		id: "role-15-editor-user-addUser-denied",
		token: "editor",
		model: "user",
		act: "addUser",
		details: {
			set: {
				first_name: "کاربر",
				last_name: "ساخته‌شده توسط ادیتور",
				email: "e2e-editor-made-{provinceId}@naghshe.dev",
				password: "MadePass123!",
				gender: "Male",
				level: "Ordinary",
			},
			get: { _id: 1 },
		},
		expectedFailure: { message: "You cant do this" },
	},

	// -- Business-rule negatives --------------------------------------------
	//
	// Not authorization and not schema validation: these are the cases where the
	// request is well-formed and permitted but the *data* forbids it. They are
	// the assertions that catch a silently-dropped field or a missing guard.
	{
		id: "neg-01-place-add-second",
		model: "place",
		act: "add",
		details: {
			set: {
				name: "بنای دوم آزمون",
				antiquity: 50,
				description: "بنای کمکی برای آزمون اسلاگ تکراری.",
				slug: "e2e-place-b-{provinceId}",
				center: point(FIXTURE_LNG, FIXTURE_LAT),
				area: multiPolygon(FIXTURE_LNG, FIXTURE_LAT, 0.02),
				status: "draft",
				province: "{provinceId}",
				city: "{cityId}",
				category: "{categoryId}",
			},
			get: { _id: 1, slug: 1 },
		},
		captures: [{ key: "placeBId", value: "[body][_id]" }],
	},
	{
		id: "neg-02-place-update-duplicate-slug",
		model: "place",
		act: "update",
		// `place.update` used to accept `slug` in its validator and then drop it
		// before the write, answering `success: true` while changing nothing.
		// Renaming onto an existing slug must therefore fail with the duplicate
		// key error; if the field is dropped again this step silently passes as
		// a success and the suite fails here.
		details: {
			set: { _id: "{placeBId}", slug: "e2e-place-{provinceId}" },
			get: { _id: 1, slug: 1 },
		},
		expectedFailure: { message: "E11000 duplicate key error" },
	},
	{
		id: "neg-03-place-update-slug",
		model: "place",
		act: "update",
		// The same field with a free value has to be accepted.
		details: {
			set: { _id: "{placeBId}", slug: "e2e-place-b2-{provinceId}" },
			get: { _id: 1, slug: 1 },
		},
	},
	{
		id: "neg-04-place-remove-referenced-by-event",
		model: "place",
		act: "remove",
		// `event` still lists this place, so the referential guard must refuse.
		details: { set: { _id: "{placeId}" }, get: { success: 1 } },
		expectedFailure: { message: "please clear below relations status" },
	},
	{
		id: "neg-05-comment-add-nonexistent-place",
		model: "comment",
		act: "add",
		details: {
			set: {
				text: "نظری روی بنایی که وجود ندارد.",
				rating: 3,
				place: "000000000000000000000000",
			},
			get: { _id: 1 },
		},
		expectedFailure: { message: "can not find this relation" },
	},
	{
		id: "neg-06-addUser-duplicate-email",
		model: "user",
		act: "addUser",
		// Proves the unique index on `user.email` is enforced for `addUser` and
		// not just for `registerUser`.
		details: {
			set: {
				first_name: "کاربر",
				last_name: "تکراری",
				email: LOGIN_EMAIL,
				password: "DuplicatePass123!",
				gender: "Male",
				level: "Ordinary",
			},
			get: { _id: 1 },
		},
		expectedFailure: { message: "E11000 duplicate key error" },
	},
	{
		id: "neg-07-place-remove-nonexistent",
		model: "place",
		act: "remove",
		details: {
			set: { _id: "000000000000000000000000" },
			get: { success: 1 },
		},
		expectedFailure: { message: "can not find this documents" },
	},

	// -- Deletion guards -----------------------------------------------------
	{
		id: "guard-01-remove-province-with-children",
		model: "province",
		act: "remove",
		details: { set: { _id: "{provinceId}" }, get: { success: 1 } },
		expectedFailure: { message: "please clear below relations status" },
	},
	{
		id: "guard-02-remove-city-with-places",
		model: "city",
		act: "remove",
		details: { set: { _id: "{cityId}" }, get: { success: 1 } },
		expectedFailure: { message: "please clear below relations status" },
	},
	{
		id: "guard-03-remove-category-in-use",
		model: "category",
		act: "remove",
		details: { set: { _id: "{categoryId}" }, get: { success: 1 } },
		expectedFailure: { message: "please clear below relations status" },
	},
	{
		id: "guard-04-remove-tag-in-use",
		model: "tag",
		act: "remove",
		details: { set: { _id: "{tagId}" }, get: { success: 1 } },
		expectedFailure: { message: "please clear below relations status" },
	},

	// -- Cleanup (children first) -------------------------------------------
	//
	// Order matters: `remove` refuses to delete a record while another
	// collection still references it. Users hold `province`/`city` references,
	// so they have to go before the geography they point at.
	{
		id: "cleanup-01-editor-event-remove",
		model: "event",
		act: "remove",
		details: { set: { _id: "{editorEventId}" }, get: {} },
	},
	{
		id: "cleanup-02-event-remove",
		model: "event",
		act: "remove",
		// `event.remove` declares `get: selectStruct("event", 1)`, which resolves
		// to an empty struct: any projection key is rejected, so send `{}`.
		details: { set: { _id: "{eventId}" }, get: {} },
	},
	{
		id: "cleanup-03-virtual-tour-remove",
		model: "virtual_tour",
		act: "remove",
		details: { set: { _id: "{tourId}" }, get: { success: 1 } },
	},
	{
		id: "cleanup-04-comment-remove",
		model: "comment",
		act: "remove",
		details: { set: { _id: "{commentId}" }, get: { success: 1 } },
	},
	{
		id: "cleanup-05-place-b-remove",
		model: "place",
		act: "remove",
		details: { set: { _id: "{placeBId}" }, get: { success: 1 } },
	},
	{
		id: "cleanup-06-place-remove",
		model: "place",
		act: "remove",
		details: { set: { _id: "{placeId}" }, get: { success: 1 } },
	},
	{
		id: "cleanup-07-remove-editor-user",
		model: "user",
		act: "removeUser",
		details: { set: { _id: "{targetUserId}" }, get: { success: 1 } },
	},
	{
		id: "cleanup-08-remove-ordinary-user-b",
		model: "user",
		act: "removeUser",
		details: { set: { _id: "{ordinaryBUserId}" }, get: { success: 1 } },
	},
	{
		id: "cleanup-09-remove-ordinary-user",
		model: "user",
		act: "removeUser",
		details: { set: { _id: "{ordinaryUserId}" }, get: { success: 1 } },
	},
	{
		id: "cleanup-10-city-remove",
		model: "city",
		act: "remove",
		details: { set: { _id: "{cityId}" }, get: { success: 1 } },
	},
	{
		id: "cleanup-11-province-remove",
		model: "province",
		act: "remove",
		details: { set: { _id: "{provinceId}" }, get: { success: 1 } },
	},
	{
		id: "cleanup-12-category-remove",
		model: "category",
		act: "remove",
		details: { set: { _id: "{categoryId}" }, get: { success: 1 } },
	},
	{
		id: "cleanup-13-tag-remove",
		model: "tag",
		act: "remove",
		details: { set: { _id: "{tagId}" }, get: { success: 1 } },
	},
];

// ---------------------------------------------------------------------------
// seed-presentation.json — demo data for the VPS
// ---------------------------------------------------------------------------

type PlaceSpec = {
	key: string;
	name: string;
	slug: string;
	city: string;
	lng: number;
	lat: number;
	antiquity: number;
	category: string;
	tags: string[];
	description: string;
	address: string;
	hours: string;
	phone?: string;
	website?: string;
	media: number;
};

/** City lookups needed by the places below (GADM `adm2` names). */
const CITIES: { key: string; name: string }[] = [
	{ key: "marvdasht", name: "مرودشت" },
	{ key: "isfahan", name: "اصفهان" },
	{ key: "shiraz", name: "شیراز" },
	{ key: "tehran", name: "تهران" },
	{ key: "kashan", name: "کاشان" },
	{ key: "yazd", name: "یزد" },
	{ key: "bam", name: "بم" },
	{ key: "gorgan", name: "گرگان" },
	{ key: "kermanshah", name: "کرمانشاه" },
	{ key: "hamedan", name: "همدان" },
	{ key: "tabriz", name: "تبریز" },
];

const CATEGORIES: {
	key: string;
	name: string;
	description: string;
	color: string;
	icon: string;
}[] = [
	{
		key: "historic",
		name: "آثار تاریخی",
		description: "بناها و محوطه‌های تاریخی ثبت‌شده در سراسر ایران",
		color: "#7c2d12",
		icon: "landmark",
	},
	{
		key: "museum",
		name: "موزه",
		description: "موزه‌ها و گنجینه‌های فرهنگی و باستان‌شناسی",
		color: "#1e3a8a",
		icon: "museum",
	},
	{
		key: "religious",
		name: "مکان مذهبی",
		description: "مساجد، زیارتگاه‌ها و بناهای آیینی",
		color: "#14532d",
		icon: "mosque",
	},
	{
		key: "garden",
		name: "باغ ایرانی",
		description: "باغ‌های تاریخی ثبت‌شده در فهرست میراث جهانی",
		color: "#365314",
		icon: "tree",
	},
	{
		key: "structure",
		name: "پل و سازه",
		description: "پل‌ها، سدها و سازه‌های مهندسی تاریخی",
		color: "#134e4a",
		icon: "bridge",
	},
	{
		key: "bazaar",
		name: "بازار و کاروانسرا",
		description: "بازارهای سنتی و کاروانسراهای جاده ابریشم",
		color: "#78350f",
		icon: "bazaar",
	},
];

const TAGS: {
	key: string;
	name: string;
	description: string;
	color: string;
	icon: string;
}[] = [
	{
		key: "unesco",
		name: "میراث جهانی یونسکو",
		description: "آثاری که در فهرست میراث جهانی ثبت شده‌اند",
		color: "#7c2d12",
		icon: "globe",
	},
	{
		key: "achaemenid",
		name: "دوره هخامنشی",
		description: "آثار به‌جامانده از شاهنشاهی هخامنشی",
		color: "#1e3a8a",
		icon: "column",
	},
	{
		key: "sasanian",
		name: "دوره ساسانی",
		description: "آثار به‌جامانده از دوره ساسانی",
		color: "#4c1d95",
		icon: "relief",
	},
	{
		key: "safavid",
		name: "دوره صفوی",
		description: "آثار شاخص دوره صفوی",
		color: "#0f766e",
		icon: "dome",
	},
	{
		key: "qajar",
		name: "دوره قاجار",
		description: "بناهای دوره قاجار با تزئینات شاخص",
		color: "#831843",
		icon: "tile",
	},
	{
		key: "islamic",
		name: "معماری اسلامی",
		description: "شاهکارهای معماری و کاشی‌کاری اسلامی",
		color: "#14532d",
		icon: "star",
	},
	{
		key: "family",
		name: "گردشگری خانوادگی",
		description: "مناسب بازدید خانوادگی و سفر کوتاه",
		color: "#365314",
		icon: "family",
	},
	{
		key: "photo",
		name: "عکاسی و طبیعت‌گردی",
		description: "نقاط شاخص برای عکاسی و پیاده‌روی",
		color: "#134e4a",
		icon: "camera",
	},
];

const PLACES: PlaceSpec[] = [
	{
		key: "persepolis",
		name: "تخت جمشید",
		slug: "persepolis",
		city: "marvdasht",
		lng: 52.8916,
		lat: 29.9354,
		antiquity: 2500,
		category: "historic",
		tags: ["unesco", "achaemenid", "photo"],
		description:
			"تخت جمشید یا پارسه، پایتخت تشریفاتی شاهنشاهی هخامنشی، در دامنه کوه رحمت در نزدیکی مرودشت فارس قرار دارد. کتیبه‌های میخی، نقش‌برجسته‌های ملل تابع و پلکان‌های سنگی آن از شاخص‌ترین نمونه‌های هنر و معماری ایران باستان هستند.",
		address: "فارس، مرودشت، محوطه تاریخی تخت جمشید",
		hours: "۸:۰۰ تا ۱۷:۰۰ در نیمه نخست سال",
		phone: "07143331081",
		website: "https://persepolis.ir",
		media: 0,
	},
	{
		key: "naqsh-e-jahan",
		name: "میدان نقش جهان",
		slug: "naqsh-e-jahan",
		city: "isfahan",
		lng: 51.6776,
		lat: 32.6575,
		antiquity: 420,
		category: "historic",
		tags: ["unesco", "safavid", "photo"],
		description:
			"میدان نقش جهان، قلب شهر صفوی اصفهان، با مسجد شاه، مسجد شیخ لطف‌الله، کاخ عالی‌قاپو و سردر قیصریه احاطه شده است. این میدان یکی از بزرگ‌ترین میدان‌های تاریخی جهان و نمونه‌ای کامل از شهرسازی دوره صفوی است.",
		address: "اصفهان، میدان نقش جهان",
		hours: "همه‌روزه، شبانه‌روزی باز است",
		phone: "03132200000",
		website: "https://isfahan.ir",
		media: 1,
	},
	{
		key: "nasir-ol-molk",
		name: "مسجد نصیرالملک",
		slug: "nasir-ol-molk",
		city: "shiraz",
		lng: 52.5486,
		lat: 29.6089,
		antiquity: 140,
		category: "religious",
		tags: ["qajar", "islamic", "photo"],
		description:
			"مسجد نصیرالملک شیراز به «مسجد صورتی» شهرت دارد. نور خورشید از شیشه‌های رنگی پنجره‌های ارسی، قالیچه‌ای از رنگ روی سنگ فرش و دیوارها می‌گستراند و آن را به یکی از محبوب‌ترین سوژه‌های عکاسی ایران تبدیل کرده است.",
		address: "شیراز، خیابان لطفعلی‌خان زند، کوچه نصیرالملک",
		hours: "۸:۰۰ تا ۱۲:۰۰ و ۱۵:۰۰ تا ۱۸:۰۰",
		phone: "07132331578",
		media: 2,
	},
	{
		key: "golestan",
		name: "کاخ گلستان",
		slug: "golestan-palace",
		city: "tehran",
		lng: 51.4198,
		lat: 35.6799,
		antiquity: 220,
		category: "museum",
		tags: ["unesco", "qajar", "family"],
		description:
			"مجموعه کاخ گلستان، ارگ سلطنتی تهران از دوره زندیه تا پهلوی، شامل تالار آینه، تالار سلام، شمس‌العماره و ایوان تخت مرمر است. موزه‌های آن گنجینه‌ای از نقاشی، خوشنویسی و هنرهای تزئینی قاجار را نگه می‌دارند.",
		address: "تهران، خیابان پانزده خرداد، میدان ارگ",
		hours: "۹:۰۰ تا ۱۷:۰۰ (به‌جز دوشنبه‌ها)",
		phone: "02133113335",
		website: "https://golestanpalace.ir",
		media: 3,
	},
	{
		key: "fin-garden",
		name: "باغ فین کاشان",
		slug: "fin-garden",
		city: "kashan",
		lng: 51.4443,
		lat: 33.9785,
		antiquity: 500,
		category: "garden",
		tags: ["unesco", "safavid", "family"],
		description:
			"باغ فین کاشان نمونه کامل «باغ ایرانی» است؛ نظام دقیق آب، فواره‌های بدون پمپ و محورهای دید، آن را به الگویی برای باغ‌سازی ایرانی بدل کرده است. حمام فین نیز محل قتل امیرکبیر در سال ۱۲۳۰ خورشیدی بوده است.",
		address: "اصفهان، کاشان، انتهای خیابان امیرکبیر",
		hours: "۹:۰۰ تا ۱۸:۰۰",
		phone: "03155400035",
		media: 4,
	},
	{
		key: "jameh-yazd",
		name: "مسجد جامع یزد",
		slug: "jameh-mosque-yazd",
		city: "yazd",
		lng: 54.3683,
		lat: 31.8976,
		antiquity: 800,
		category: "religious",
		tags: ["islamic", "photo"],
		description:
			"مسجد جامع یزد با سردر بلند کاشی‌کاری‌شده و مناره‌های دوگانه، یکی از شاخص‌ترین بناهای مذهبی ایران است. گنبدخانه آن از دوره ایلخانی و کاشی‌کاری سردر از دوره تیموری و صفوی است.",
		address: "یزد، خیابان امام خمینی، محله فهادان",
		hours: "۸:۰۰ تا ۲۰:۰۰",
		media: 5,
	},
	{
		key: "si-o-se-pol",
		name: "سی‌وسه پل",
		slug: "si-o-se-pol",
		city: "isfahan",
		lng: 51.6675,
		lat: 32.6447,
		antiquity: 380,
		category: "structure",
		tags: ["safavid", "photo", "family"],
		description:
			"سی‌وسه پل یا پل الله‌وردی‌خان، با ۳۳ دهانه، زاینده‌رود را به دو نیمه اصفهان پیوند می‌دهد. این پل در دوره صفوی هم برای گذر و هم به‌عنوان بند و محل برگزاری آیین‌های آبی به کار می‌رفت.",
		address: "اصفهان، خیابان چهارباغ پایین، سی‌وسه پل",
		hours: "همه‌روزه، شبانه‌روزی باز است",
		media: 6,
	},
	{
		key: "bam-citadel",
		name: "ارگ بم",
		slug: "bam-citadel",
		city: "bam",
		lng: 58.3669,
		lat: 29.1166,
		antiquity: 2000,
		category: "historic",
		tags: ["unesco", "photo"],
		description:
			"ارگ بم بزرگ‌ترین بنای خشتی جهان است و پیش از زلزله سال ۱۳۸۲ یکی از مهم‌ترین مراکز راه ابریشم بود. مرمت آن پس از زلزله یکی از بزرگ‌ترین پروژه‌های مرمت میراث فرهنگی جهان به شمار می‌رود.",
		address: "کرمان، بم، بلوار شهید رجایی، محوطه ارگ تاریخی بم",
		hours: "۸:۰۰ تا ۱۸:۰۰",
		media: 7,
	},
	{
		key: "gonbad-qabus",
		name: "گنبد قابوس",
		slug: "gonbad-e-qabus",
		city: "gorgan",
		lng: 55.1689,
		lat: 37.2583,
		antiquity: 1000,
		category: "historic",
		tags: ["unesco"],
		description:
			"برج آرامگاهی قابوس بن وشمگیر، بلندترین برج آجری جهان با ۵۳ متر ارتفاع، در سال ۱۰۰۶ میلادی ساخته شد. کتیبه کوفی آن و هندسه دقیق بنا از شاهکارهای معماری دوره زیاری است.",
		address: "گلستان، گنبد کاووس، خیابان آیت‌الله خامنه‌ای",
		hours: "۸:۰۰ تا ۱۷:۰۰",
		media: 8,
	},
	{
		key: "taq-e-bostan",
		name: "طاق بستان",
		slug: "taq-e-bostan",
		city: "kermanshah",
		lng: 47.1319,
		lat: 34.3878,
		antiquity: 1400,
		category: "historic",
		tags: ["sasanian", "photo"],
		description:
			"طاق بستان مجموعه‌ای از نقش‌برجسته‌های دوره ساسانی است؛ صحنه تاج‌ستانی اردشیر دوم، شکار سلطنتی و نقش خسرو پرویز از مهم‌ترین سنگ‌نگاره‌های ایران به شمار می‌روند.",
		address: "کرمانشاه، بلوار طاق بستان، محوطه تاریخی طاق بستان",
		hours: "۸:۰۰ تا ۱۹:۰۰",
		media: 9,
	},
	{
		key: "bu-ali-sina",
		name: "آرامگاه بوعلی‌سینا",
		slug: "bu-ali-sina-tomb",
		city: "hamedan",
		lng: 48.5146,
		lat: 34.7986,
		antiquity: 70,
		category: "museum",
		tags: ["qajar", "family"],
		description:
			"آرامگاه شیخ‌الرئیس ابوعلی‌سینا در میدان بوعلی همدان، با طراحی هوشنگ سیحون به شکل برجی از ترکیب معماری سنتی و مدرن، نماد شهر همدان است. در کنار آن موزه‌ای با نسخ خطی و ابزار علمی نگهداری می‌شود.",
		address: "همدان، میدان بوعلی‌سینا",
		hours: "۹:۰۰ تا ۱۸:۰۰",
		media: 10,
	},
	{
		key: "tabriz-bazaar",
		name: "بازار تاریخی تبریز",
		slug: "tabriz-historical-bazaar",
		city: "tabriz",
		lng: 46.2919,
		lat: 38.08,
		antiquity: 600,
		category: "bazaar",
		tags: ["unesco", "safavid", "family"],
		description:
			"بازار تاریخی تبریز بزرگ‌ترین بازار سرپوشیده آجری جهان و یکی از ایستگاه‌های اصلی جاده ابریشم است. تیمچه‌ها، سراها و راسته‌های آن هنوز به فعالیت تجاری خود ادامه می‌دهند.",
		address: "آذربایجان شرقی، تبریز، خیابان جمهوری اسلامی، بازار تاریخی",
		hours: "۹:۰۰ تا ۲۰:۰۰ (جمعه‌ها تعطیل)",
		media: 11,
	},
];

const seed: Case[] = [
	// Captures are per-run, so the seed has to authenticate itself.
	{
		id: "seed-00-login",
		token: "none",
		model: "user",
		act: "login",
		details: {
			set: { email: LOGIN_EMAIL, password: LOGIN_PASSWORD },
			get: { user: { _id: 1, email: 1, level: 1 } },
		},
		captures: [{ key: "token", value: "[body][token]" }],
	},
	// Geography is idempotent, so this is safe to run on an already-seeded DB.
	{
		id: "seed-01-geography",
		model: "province",
		act: "seed",
		details: {
			set: {},
			get: { provincesCreated: 1, citiesCreated: 1 },
		},
	},
	...CITIES.map<Case>(({ key, name }) => ({
		id: `seed-02-lookup-${key}`,
		model: "city",
		act: "gets",
		details: {
			set: { page: 1, limit: 1, name },
			get: { _id: 1, name: 1, province: { _id: 1, name: 1 } },
		},
		captures: [
			{ key: `${key}City`, value: "[body][0][_id]" },
			{ key: `${key}Province`, value: "[body][0][province][_id]" },
		],
	})),
	...CATEGORIES.map<Case>((category) => ({
		id: `seed-03-category-${category.key}`,
		model: "category",
		act: "add",
		details: {
			set: {
				name: category.name,
				description: category.description,
				color: category.color,
				icon: category.icon,
			},
			get: { _id: 1, name: 1 },
		},
		captures: [
			{ key: `${category.key}Category`, value: "[body][_id]" },
		],
	})),
	...TAGS.map<Case>((tag) => ({
		id: `seed-04-tag-${tag.key}`,
		model: "tag",
		act: "add",
		details: {
			set: {
				name: tag.name,
				description: tag.description,
				color: tag.color,
				icon: tag.icon,
			},
			get: { _id: 1, name: 1 },
		},
		captures: [{ key: `${tag.key}Tag`, value: "[body][_id]" }],
	})),
	...PLACES.map<Case>((place) => ({
		id: `seed-05-place-${place.key}`,
		model: "place",
		act: "add",
		details: {
			set: {
				name: place.name,
				antiquity: place.antiquity,
				description: place.description,
				slug: place.slug,
				center: point(place.lng, place.lat),
				area: multiPolygon(place.lng, place.lat, 0.004),
				address: place.address,
				hoursOfOperation: place.hours,
				contact: {
					...(place.phone ? { phone: place.phone } : {}),
					...(place.website ? { website: place.website } : {}),
					social: [],
				},
				meta: { gallerySource: "naghshe-seed" },
				status: "active",
				province: `{${place.city}Province}`,
				city: `{${place.city}City}`,
				category: `{${place.category}Category}`,
				tags: place.tags.map((tag) => `{${tag}Tag}`),
				thumbnail: MEDIA(place.media),
				gallery: [
					MEDIA(place.media + 12),
					MEDIA(place.media + 24),
				],
			},
			get: { _id: 1, name: 1, slug: 1 },
		},
		captures: [{ key: `${place.key}Place`, value: "[body][_id]" }],
	})),
	// Demo events.
	{
		id: "seed-06-event-nowruz",
		model: "event",
		act: "add",
		details: {
			set: {
				name: "جشن نوروزگاه تخت جمشید",
				description:
					"آیین استقبال از نوروز با اجرای موسیقی سنتی، نمایش آیین‌های نوروزی و تور راهنمای محوطه.",
				startTime: "2027-03-20T08:00:00.000Z",
				endTime: "2027-03-22T18:00:00.000Z",
				color: "#7c2d12",
				icon: "celebration",
				capacity: "500",
				status: "published",
				isPublic: true,
				ticketPrice: "0",
				registrationRequired: true,
				maxAttendees: "500",
				placeIds: ["{persepolisPlace}"],
				tags: ["{unescoTag}", "{familyTag}"],
				thumbnail: MEDIA(12),
				gallery: [MEDIA(13)],
			},
			get: { _id: 1, name: 1 },
		},
		captures: [{ key: "nowruzEvent", value: "[body][_id]" }],
	},
	{
		id: "seed-07-event-naqsh-e-jahan-nights",
		model: "event",
		act: "add",
		details: {
			set: {
				name: "شب‌های فرهنگی میدان نقش جهان",
				description:
					"برنامه شبانه شامل نورپردازی میدان، اجرای نقالی و نمایشگاه صنایع دستی اصفهان.",
				startTime: "2027-04-10T16:00:00.000Z",
				endTime: "2027-04-12T22:00:00.000Z",
				color: "#0f766e",
				icon: "night",
				status: "published",
				isPublic: true,
				placeIds: ["{naqsh-e-jahanPlace}"],
				tags: ["{safavidTag}", "{photoTag}"],
				thumbnail: MEDIA(14),
			},
			get: { _id: 1, name: 1 },
		},
	},
	{
		id: "seed-08-event-photo-exhibition",
		model: "event",
		act: "add",
		details: {
			set: {
				name: "نمایشگاه عکاسی «میراث ایران»",
				description:
					"گزیده‌ای از عکس‌های تاریخی محوطه‌های ثبت‌شده ایران در گالری کاخ گلستان.",
				startTime: "2027-05-05T09:00:00.000Z",
				endTime: "2027-05-25T18:00:00.000Z",
				color: "#1e3a8a",
				icon: "camera",
				status: "published",
				isPublic: true,
				placeIds: ["{golestanPlace}"],
				tags: ["{qajarTag}", "{photoTag}"],
				thumbnail: MEDIA(15),
			},
			get: { _id: 1, name: 1 },
		},
	},
	{
		id: "seed-09-event-architecture-workshop",
		model: "event",
		act: "add",
		details: {
			set: {
				name: "کارگاه آشنایی با معماری اسلامی",
				description:
					"کارگاه دو روزه درباره هندسه گنبد، کاشی‌کاری و سیر تحول مساجد جامع ایران.",
				startTime: "2027-06-15T08:30:00.000Z",
				endTime: "2027-06-16T16:30:00.000Z",
				color: "#14532d",
				icon: "workshop",
				capacity: "40",
				status: "published",
				isPublic: true,
				ticketPrice: "350000",
				registrationRequired: true,
				maxAttendees: "40",
				placeIds: ["{jameh-yazdPlace}"],
				tags: ["{islamicTag}"],
				thumbnail: MEDIA(16),
			},
			get: { _id: 1, name: 1 },
		},
	},
	{
		id: "seed-10-event-garden-night-tour",
		model: "event",
		act: "add",
		details: {
			set: {
				name: "تور شبانه باغ فین",
				description:
					"بازدید شبانه از باغ با روایت تاریخچه باغ و حمام فین همراه با پذیرایی.",
				startTime: "2027-07-01T18:30:00.000Z",
				endTime: "2027-07-01T21:00:00.000Z",
				color: "#365314",
				icon: "tour",
				status: "published",
				isPublic: true,
				ticketPrice: "150000",
				registrationRequired: true,
				placeIds: ["{fin-gardenPlace}"],
				tags: ["{familyTag}", "{safavidTag}"],
				thumbnail: MEDIA(17),
			},
			get: { _id: 1, name: 1 },
		},
	},
	// Demo virtual tours.
	{
		id: "seed-11-virtual-tour-persepolis",
		model: "virtual_tour",
		act: "add",
		details: {
			set: {
				name: "تور مجازی تخت جمشید",
				description:
					"بازدید ۳۶۰ درجه از پلکان آپادانا و دروازه ملل با نقاط تعاملی.",
				status: "active",
				hotspots: [
					{ pitch: 5, yaw: 30, description: "دروازه ملل" },
					{ pitch: -10, yaw: 120, description: "پلکان آپادانا" },
					{ pitch: 12, yaw: 240, description: "کاخ تچر" },
				],
				placeId: "{persepolisPlace}",
				panoramaId: MEDIA(18),
			},
			get: { _id: 1, name: 1 },
		},
	},
	{
		id: "seed-12-virtual-tour-naqsh-e-jahan",
		model: "virtual_tour",
		act: "add",
		details: {
			set: {
				name: "تور مجازی میدان نقش جهان",
				description:
					"نمای ۳۶۰ درجه از میدان با نقاط تعاملی روی مسجد شاه و عالی‌قاپو.",
				status: "active",
				hotspots: [
					{ pitch: 0, yaw: 45, description: "مسجد شاه" },
					{ pitch: 8, yaw: 180, description: "عالی‌قاپو" },
				],
				placeId: "{naqsh-e-jahanPlace}",
				panoramaId: MEDIA(19),
			},
			get: { _id: 1, name: 1 },
		},
	},
	{
		id: "seed-13-virtual-tour-bam",
		model: "virtual_tour",
		act: "add",
		details: {
			set: {
				name: "تور مجازی ارگ بم",
				description: "بازدید مجازی از حاکم‌نشین و بازار ارگ پس از مرمت.",
				status: "active",
				hotspots: [
					{ pitch: 0, yaw: 0, description: "حاکم‌نشین" },
					{ pitch: -6, yaw: 200, description: "بازار ارگ" },
				],
				placeId: "{bam-citadelPlace}",
				panoramaId: MEDIA(20),
			},
			get: { _id: 1, name: 1 },
		},
	},
	// Demo comments (authored by the logged-in manager account).
	{
		id: "seed-14-comment-persepolis",
		model: "comment",
		act: "add",
		details: {
			set: {
				text:
					"بازدید از تخت جمشید با راهنمای محلی تجربه‌ای بی‌نظیر بود؛ ساعت‌های پایانی روز برای عکاسی بهترین نور را دارد.",
				rating: 5,
				// Seeded comments are published so the place page has reviews.
				status: "approved",
				place: "{persepolisPlace}",
			},
			get: { _id: 1 },
		},
	},
	{
		id: "seed-15-comment-naqsh-e-jahan",
		model: "comment",
		act: "add",
		details: {
			set: {
				text:
					"میدان در شب نورپردازی بسیار زیبایی دارد. پیشنهاد می‌کنم بازدید عالی‌قاپو را هم در برنامه بگذارید.",
				rating: 5,
				// Seeded comments are published so the place page has reviews.
				status: "approved",
				place: "{naqsh-e-jahanPlace}",
			},
			get: { _id: 1 },
		},
	},
	{
		id: "seed-16-comment-nasir-ol-molk",
		model: "comment",
		act: "add",
		details: {
			set: {
				text:
					"برای دیدن نور رنگی پنجره‌ها صبح زود بروید؛ حدود ساعت ۸ تا ۹ بهترین زمان است.",
				rating: 4,
				// Seeded comments are published so the place page has reviews.
				status: "approved",
				place: "{nasir-ol-molkPlace}",
			},
			get: { _id: 1 },
		},
	},
	{
		id: "seed-17-comment-golestan",
		model: "comment",
		act: "add",
		details: {
			set: {
				text:
					"تالار آینه و ایوان تخت مرمر حتماً دیده شود. بلیط مجموعه برای هر بخش جداگانه است.",
				rating: 4,
				// Seeded comments are published so the place page has reviews.
				status: "approved",
				place: "{golestanPlace}",
			},
			get: { _id: 1 },
		},
	},
	{
		id: "seed-18-comment-bam",
		model: "comment",
		act: "add",
		details: {
			set: {
				text:
					"دیدن تلاش مرمت‌گران در ارگ بم تحسین‌برانگیز است. سایه‌بان و آب آشامیدنی در محوطه موجود است.",
				rating: 5,
				// Seeded comments are published so the place page has reviews.
				status: "approved",
				place: "{bam-citadelPlace}",
			},
			get: { _id: 1 },
		},
	},
	// A second staff account so the admin panel does not look empty.
	{
		id: "seed-19-staff-editor",
		model: "user",
		act: "addUser",
		details: {
			set: {
				first_name: "سارا",
				last_name: "محمدی",
				father_name: "حسن",
				gender: "Female",
				email: "editor@naghshe.dev",
				password: "EditorDemo123!",
				summary: "کارشناس محتوا و ثبت آثار تاریخی",
				address: "تهران",
				level: "Editor",
				is_verified: true,
				provinceId: "{tehranProvince}",
				cityId: "{tehranCity}",
			},
			get: { _id: 1, email: 1, level: 1 },
		},
	},
];

// ---------------------------------------------------------------------------

const write = async (name: string, cases: Case[]) => {
	const payload = cases.map(toForm);
	// Tab indentation matches the repository's `deno fmt` config, so the
	// generated files pass `deno fmt --check` without being reformatted.
	await Deno.writeTextFile(
		new URL(name, import.meta.url),
		`${JSON.stringify(payload, null, "\t")}\n`,
	);
	console.log(
		`wrote ${name}: ${payload.length} steps, ${
			payload.filter((form) => "expectedFailure" in form).length
		} expected failures`,
	);
};

await write("./E2E.json", e2e);
await write("./seed-presentation.json", seed);
