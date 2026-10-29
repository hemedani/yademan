# Naghshe Backend — Deno + Lesan

## Overview

The backend is a Deno service built on **Lesan `0.2.4`** (JSR), a MongoDB ODM/ORM
with schema validation, relation management, generated type declarations, and a
built-in API playground. It exposes one service, `main`, containing the actions
for users, geography, places, events, comments, tags, categories, files, and
virtual tours.

| Item | Value |
|---|---|
| Runtime | Deno 2.x (needs network access to JSR on first run) |
| Framework | Lesan `^0.2.4` from `jsr:@hemedani/lesan` in `deps.ts` |
| Database | MongoDB, database `yademan` |
| HTTP port | **`1405` hardcoded in `mod.ts`** |
| Auth | JWT HS512; request header `token`; cookie on the frontend |
| File storage | `back/uploads/{images,videos,docs}` served at `/uploads` |
| Type generation | Enabled (`typeGeneration: true`) |
| Playground | Enabled (`playground: true`) |

This project was originally described as a traffic-accident system. The current
domain is Iranian cultural/natural **places**. `Models.md` is stale.

## Entry Point and Boot Sequence

`mod.ts`:

1. Reads `MONGO_URI` (default `mongodb://127.0.0.1:27017/`).
2. Connects with `MongoClient` and selects `client.db("yademan")`.
3. Creates the Lesan app with `lesan()` and attaches the database.
4. Instantiates every model (`file`, `user`, `province`, `city`, `place`,
   `comment`, `tag`, `category`, `virtual_tour`, `event`).
5. Calls `functionsSetup()` from `src/mod.ts`.
6. Starts the server on port `1405`, with type generation, playground,
   `/uploads` static serving, and a CORS allowlist.

Model instances are exported from `mod.ts` and imported throughout the codebase.
Follow that pattern instead of calling `coreApp.odm` ad hoc unless you are
working inside model definitions.

## Directory Layout

```
back/
├── mod.ts                  # bootstrap, DB, model instances, server
├── deno.json               # tasks + import aliases + fmt config
├── deps.ts                 # Lesan (JSR), djwt, local ensureDir shim
├── models/
│   ├── <model>.ts          # pure schema + relations + index + factory
│   ├── excludes.ts         # centralized projection excludes
│   ├── mod.ts              # model barrel
│   └── utils/              # geoJSONStruct, pureLocation, sharedRelations
├── src/
│   ├── mod.ts              # registers every model's setup function
│   └── <model>/
│       ├── mod.ts          # imports/registers all acts for the model
│       └── <act>/
│           ├── mod.ts      # setAct, preAct, validator, fn
│           ├── <act>.val.ts
│           └── <act>.fn.ts
├── utils/                  # auth, context, errors, dates, action generator
├── declarations/           # generated Lesan types (do not hand-edit)
├── assets/                 # Iran GeoJSON used by province.seed
├── uploads/                # runtime files (gitignored)
└── test/                   # bootstrap + E2E/seed suites (see test/README.md)
```

## Models

Every model file exports:

- a `*_pure` object (plain fields, no relations),
- a `*_relations` object (single/multiple relations, reverse relations),
- a factory (`users()`, `places()`, …) passed to `coreApp.odm.newModel`.

### Common Building Blocks

- `createUpdateAt` adds optional, defaulted `createdAt` / `updatedAt`.
- `geoJSONStruct("Point" | "MultiPolygon" | ...)` builds GeoJSON validation
  objects.
- `pure_location` = `name`, `english_name`, `area` (MultiPolygon), `center`
  (Point), timestamps.
- `shared_relation_pure` = `name`, `description`, `color?`, `icon?`, timestamps.
- `excludes.ts` centralizes fields that should not leak through relations
  (`password`, geometry, timestamps, etc.).
- Relation reverse sides have limits and usually sort by `_id` descending.

### Model Reference

| Model | Pure fields | Relations | Notes |
|---|---|---|---|
| `user` | `first_name`, `last_name`, `father_name?`, `gender` (`Male`/`Female`), `birth_date?`, `summary?`, `address?`, `level` (default `Ordinary`), `email` (unique), `password`, `is_verified`, timestamps | `avatar?`, `national_card?` → `file`; `province?`, `city?` → location; `favArticles?` → `place` (reverse `favByUsers`); reverse `registered_places`, comments, events, uploaded assets | Passwords are bcrypt-hashed by actions; `password` is excluded globally. Levels: `Ghost`, `Manager`, `Editor`, `Ordinary`. |
| `file` | `name`, `mimType`, `size`, `alt_text?`, timestamps | `uploader` → `user`; reverse `uploadedAssets` | Field is spelled `mimType`. Upload action writes the real file under `uploads/`. |
| `province` | `pure_location` | `registrar?` → `user`; reverse `cities`, `capital`, `places`, `users` | Intended 2dsphere index on `area` + `center_location` (see gotchas). |
| `city` | `pure_location` | `registrar?`, `province?`; reverse `cities`, `capital`, `places`, `users` | `add` takes `provinceId` + `isCapital`; `isCapital` sets province reverse `capital`. |
| `category` | `shared_relation_pure` | `registrar?` → `user`; reverse `places` | Required relation on every place. |
| `tag` | `shared_relation_pure` | `registrar?` → `user`; reverse `places`, `events` | Shared by places and events. |
| `place` | `name`, `antiquity`, `description`, `slug?`, `center` (Point), `area` (MultiPolygon), `address?`, `contact{phone,email,website,social[]}?`, `hoursOfOperation?`, `meta?`, `status` (`draft`/`active`/`archived`), timestamps | `registrar?`, `province?`, `city?`, `category` (required), `tags?`, `thumbnail?`, `gallery?`; reverse `comments`, `virtual_tours`, `events` | Indexes: 2dsphere `center` + `area`; unique partial `slug`. `antiquity` is a **construction year**, not an age. |
| `comment` | `text`, `rating?`, `status` (default `pending`), `is_anonymous` (default `false`), timestamps | `user` (required), `place` (required); reverse comments | Public reads; add/update/remove guarded. |
| `virtual_tour` | `name`, `description?`, `hotspots?[]` (`pitch`, `yaw`, `description?`, `target?`), `status` (`draft`/`active`/`archived`), timestamps | `place` (required), `panorama?` → `file`, `registrar?`; reverse on place | Hotspots are embedded, not a separate collection. |
| `event` | `name`, `description?`, `startTime`, `endTime`, `color?`, `icon?`, `capacity?`, `status` (`draft`/`published`/`archived`/`cancelled`), `isPublic?`, `ticketPrice?`, `registrationRequired?`, `maxAttendees?`, `eventUrl?`, `registrationUrl?`, timestamps | `registrar?`, `places?`, `organizer?`, `attendees?` → `user`, `tags?`, `thumbnail?`, `gallery?`; reverse `registered_events`, `organized_events`, `attended_events`, `events` | Date strings are coerced to `Date`. Index on `startTime` + `endTime`. |

### GeoJSON Discipline

- Coordinate order is **`[longitude, latitude]`**.
- `area` is a GeoJSON `MultiPolygon`; `center` is a `Point`.
- Place `gets` accepts:
  - `polygon` → `$geoIntersects` against `center`;
  - `area` → `$geoIntersects` against `area` (validator currently expects a
    Polygon geometry);
  - `near` + `minDistance` / `maxDistance` → `$geoNear`.
- City/province seeds and place records use GeoJSON data from GADM assets.
- `province.seed` reads
  `assets/geojson/irn_admin1_simplified_converted.json` and
  `irn_admin2_simplified_converted.json`, then creates provinces followed by
  cities. It requires a Manager token and both files to exist.

## Request Lifecycle

A call arrives as:

```ts
{
  service: "main",
  model: "place",
  act: "gets",
  details: {
    set: { page: 1, limit: 50, /* validated filters */ },
    get: { data: { _id: 1, name: 1, category: { name: 1 } }, metadata: { total: 1 } },
  },
}
```

Pipeline:

```
setAct → preAct guards → validator (set/get) → action fn → MongoDB
```

- `setTokens` verifies the `token` header and puts the JWT payload in context.
- `setUser` loads the user's pure projection and replaces context `user`.
- `grantAccess({ levels })` throws unless the user's level is listed; **`Ghost`
  always passes**.
- The validator defines allowed input (`set`) and projection depth (`get`) with
  `selectStruct(model, depth)`.

### Authentication Details

- `login` accepts `email` + `password` (min 8 chars) and returns
  `{ token, user }`.
- Token payload: `{ _id, email, level, exp }`, HS512, 90 days.
- Signing key: `TOKEN_KEY` (falls back to a development secret).
- The frontend stores the token in a cookie named `token`.
- `tempUser` creates a `Ghost` user only when the database has no users;
  otherwise it fails. Use it for bootstrap.
- `registerUser` always creates `Ordinary` / `is_verified: false`.
- `addUser` is the Manager path and may set a level. `checkGhostUser` is intended
  to stop non-Ghosts from creating a `Ghost`, but it inspects `set.levels` while
  the validator uses `set.level`; as written, the guard does not trigger.

## Actions and Access

`src/<model>/<act>/mod.ts` registers each action. Levels below are the exact
`levels` arrays; empty means no level guard.

| Model | Action | Guard |
|---|---|---|
| `user` | `login`, `registerUser`, `tempUser` | public |
| | `getMe`, `toggleFavArticle` | authenticated (`setTokens` + `setUser`) |
| | `addUser`, `updateUser`, `removeUser`, `countUsers`, `dashboardStatistic` | `Manager` |
| | `updateUserRelations` | `Ghost`, `Manager` |
| | `getUsers` | `Manager`, `Editor` |
| | `getUser` | `Manager`, `Examiner` (legacy, `Examiner` is not a real level) |
| `file` | `uploadFile`, `getFiles` | authenticated |
| `province`, `city`, `category`, `tag` | `add`, `update`, `remove`, `count` | `Manager` |
| | `get`, `gets` | public |
| | `province.seed` | `Manager` |
| `place` | `add`, `update`, `remove`, `count` | `Manager` |
| | `updatePlaceRelations`, `removePlaceRelations` | `Ghost`, `Manager` |
| | `get`, `gets` | public |
| `comment` | `add` | `Ordinary`, `Editor`, `Manager` |
| | `update`, `remove` | `Ordinary`, `Editor`, `Manager` (ownership enforced in the action; `status` changes are moderator-only) |
| | `get`, `gets`, `count` | public |
| `event` | `add`, `update`, `updateRelations` | `Manager`, `Editor` |
| | `remove` | `Manager` |
| | `get`, `gets`, `count` | public |
| `virtual_tour` | `add`, `update`, `remove`, `count` | `Manager` |
| | `get`, `gets` | public |

### Response Shapes

- `place.gets` and `event.gets` return `{ data, metadata }` where metadata is
  `{ total, page, limit, pageCount }`.
- `count` shapes vary: most return `{ qty }`; `place.count` and `comment.count`
  return `{ filtered, total }`; `event.count` returns a number.
- Most other `gets` actions return a plain array.
- `get` returns one document (or null).
- `add` / `update` return the inserted/updated document projected by `get`.
- Errors throw via `throwError(message)`; Lesan wraps them in
  `{ success: false, body: { message } }`.

## Action Anatomy

```ts
// src/place/gets/mod.ts
import { getsFn } from "./gets.fn.ts";
import { getsValidator } from "./gets.val.ts";
import { coreApp } from "../../../mod.ts";

export const getsSetup = () =>
  coreApp.acts.setAct({
    schema: "place",
    actName: "gets",
    fn: getsFn,
    validator: getsValidator(),
  });
```

```ts
// src/place/gets/gets.val.ts
export const getsValidator = () =>
  object({
    set: object({
      page: number(),
      limit: number(),
      name: optional(string()),
    }),
    get: selectStruct("place", 2),
  });
```

```ts
// src/place/gets/gets.fn.ts
export const getsFn: ActFn = async (body) => {
  const { set, get } = body.details;
  return await place
    .aggregation({ pipeline, projection: get })
    .toArray();
};
```

Rules:

- `validationRunType: "create"` is required for insert actions and relation
  mutations that create embedded relations.
- Validators must expose **application-level filters** (e.g. `startTimeAfter`),
  never raw MongoDB operators (`$gte`, `$regex`) from the client.
- `selectStruct(model, depth)` controls allowed projection shape. If the UI needs
  a nested relation, the projection must request it within that depth.
- Pure updates and relation updates are separate actions (`update` vs
  `updateRelations` / `updatePlaceRelations`).
- Use `TInsertRelations<typeof model_relations>` when building relation payloads.
- Be careful with `replace: true` in `addRelation`: it replaces all relations
  carried by the object, not only one key.
- Use `ObjectId` for relation/filter ids; convert string ids explicitly.
- `getUsers` currently matches on `levels` (plural), while the model field is
  `level`; treat this as a known bug until corrected.

## Files and Uploads

- `file.uploadFile` expects multipart `FormData` in `set.formData`, plus
  `type: "image" | "video" | "doc"`.
- The action writes to:
  - `uploads/images`
  - `uploads/videos`
  - `uploads/docs`
- Filenames are `ObjectId + original extension`.
- Static serving is configured in `mod.ts` with `staticPath: ["/uploads"]`.
- The frontend reads files through `getImageUrl()` / `/api/image-proxy`, not by
  hardcoding the backend host.
- `uploads/` is gitignored; uploads are runtime data.

## Environment and Commands

| Variable | Used by | Notes |
|---|---|---|
| `MONGO_URI` | `mod.ts` | Default `mongodb://127.0.0.1:27017/`; DB name fixed to `yademan`. |
| `TOKEN_KEY` | `utils/setToken.ts` | JWT signing secret; fallback is development-only. |
| `ENV` | Docker/task | `development` enables watch mode; does not alter logic. |
| `APP_PORT` | Docker only | Ignored by the running server (hardcoded 1405). |
| `REDIS_URI` | none | Redis is provisioned but unused. |

```bash
cd back
deno task bc-dev          # watch mode, port 1405
deno fmt                  # format with repo settings (tabs, width 80)
deno fmt --check
deno check mod.ts
```

The first run downloads Lesan and the JSR dependencies. There is no `deno test`
suite; the coverage lives in `test/` as Lesan playground suites.

## Testing

`test/` holds two JSON suites that run either in the playground (`/playground` →
E2E tab) or headlessly via `deno task test:e2e`. See
[`test/README.md`](test/README.md) for the full workflow.

```bash
deno task test:bootstrap   # once per database: account + placeholder media
deno task test:e2e         # 143 steps, every act, self-cleaning
deno task test:seed        # demo data for the VPS
deno task test:build       # regenerate the JSON from build-suites.ts
```

`E2E.json` runs in a fixed order — `auth → fixtures → authz → iso → reads →
writes → role → neg → guards → cleanup` — because later blocks substitute the
ids captured by earlier ones. Three blocks are worth knowing about:

- **`iso`** — two independent `Ordinary` accounts. The same request must succeed
  for its owner and be rejected for the other one, which is how ownership checks
  in `comment.update` / `comment.remove` are verified.
- **`role`** — the `Editor` tier: allowed on comments, events and user reads,
  denied on the taxonomy, the geography and `event.remove`.
- **`neg`** — rules that are neither authorization nor schema (duplicate slug on
  update, delete-while-referenced, relation to a missing document). These are
  what catch a field that a validator accepts and an action forgets to write.

`E2E.json` and `seed-presentation.json` are **generated** — edit
`test/build-suites.ts`, then run `deno task test:build`. Never hand-edit the
JSON: `bodyHeaders` is a stringified envelope and is trivial to corrupt.

Run `test:e2e` after touching a validator, an action, or a model. It is the only
thing that catches shape drift between the generated `declarations/selectInp.ts`
and the validators.

## Lesan 0.2.x notes

The upgrade from the pinned `v0.1.26` GitHub tarball to `jsr:@hemedani/lesan@^0.2.4`
kept the ODM surface (`find`, `findOne`, `insertOne`, `insertMany`,
`addRelation`, `removeRelation`, `findOneAndUpdate`, `aggregation`,
`countDocument`) unchanged. Three things to know:

- **`ensureDir` is no longer exported.** 0.2.x moved filesystem access behind a
  platform adapter. `deps.ts` re-exports a two-line `Deno.mkdir` shim used by
  `file.uploadFile`.
- **`expectedFailure` exists in the playground E2E runner.** A step may declare
  `expectedFailure: { message }`; the runner then requires `success: false` and
  a body message containing `message`. This is what lets the suites assert
  guards and validation instead of only happy paths.
- **`preValidation` and `preAct` are both real hooks, and the order matters.**
  `getUsers`, `countUsers` and `dashboardStatistic` use `preValidation`; every
  other protected act uses `preAct`, which runs *after* the validator. So for a
  `preAct` act the schema is checked before `grantAccess`: a denial test with a
  malformed body fails on the schema and never reaches the authorization check.
  All `role-*` / `iso-*` denial steps therefore send schema-valid payloads.

## Adding or Changing an Action

1. Create `src/<model>/<act>/`.
2. Add `<act>.val.ts` with `set` and `get` (`selectStruct`).
3. Add `<act>.fn.ts` returning the projected result.
4. Add `mod.ts` with `setAct({ schema, actName, fn, validator, preAct?,
   validationRunType? })`.
5. Register the setup in `src/<model>/mod.ts`.
6. If the act belongs to a new model, add the model to `models/mod.ts`,
   instantiate it in `mod.ts`, and call its setup in `src/mod.ts`.
7. Run `deno check mod.ts` and `deno fmt --check`.

## Conventions

- Keep pure fields and relations separate.
- Never update relation fields inside a pure update function.
- Keep the model barrel (`@model`) and utility barrel (`@lib`) imports intact.
- Reuse `createUpdateAt`; set `updatedAt: new Date()` on updates.
- Add new shared excludes to `models/excludes.ts`.
- Use `geoJSONStruct` for any new geographic field.
- Keep action names lower camel case (`getMe`, `updatePlaceRelations`).
- Format with tabs, 80-column lines, semicolons (`deno fmt` config).
- Do not hand-edit `declarations/selectInp.ts`; it is generated at runtime.
- Remove debug logs before finishing.

## Known Gotchas

1. **Port is hardcoded to 1405**; `APP_PORT` is ignored by `runServer`.
2. **Database is `yademan`**, not `naghshe`.
3. **`antiquity` is a construction year** (Solar Hijri), despite comments saying
   "age in years". `place.gets` converts the requested minimum age into a
   maximum construction year.
4. **Count response shapes are not uniform.** Check each action: `{ qty }` is
   common, place/comment return `{ filtered, total }`, and event returns a raw
   number.
5. **`$geoNear` needs an explicit `key`.** `place` has two 2dsphere indexes
   (`center` and `area`), so MongoDB refuses to guess. `place.gets` passes
   `key: "center"`; keep that if you add another geo index.
6. **`get.metadata` is optional on `place.gets` / `event.gets`.** When it is
   omitted the `$count` aggregation is skipped entirely — request it only if the
   caller actually reads `total`/`pageCount`.
7. **Pagination is clamped** to `MAX_PAGE_SIZE` (200) by `clampPagination` in
   `utils/pagination.ts`. The validators still accept any number, so the clamp
   in the action is the real limit.
8. **Only one index per model via Lesan.** Extra indexes live in
   `models/indexes.ts` and are applied by `ensureIndexes(db)` in `mod.ts`. The
   bootstrap also drops the legacy `center_location` indexes. Add new filterable
   fields there, not in `newModel({ createIndex })`.
9. **`TOKEN_KEY` is mandatory in production.** `utils/setToken.ts` throws at
   boot when `ENV=production` and the variable is missing. The development
   fallback logs a warning.

### Fixed — do not reintroduce

These were real bugs; the fixes are load-bearing:

- `center_location` on city/province: the field does not exist. Use `center`,
  and `MultiPolygon` for `area`.
- Legacy level names (`User`, `Admin`, `Examiner`) in guards: not in
  `user_level_array`, so they never matched. Use `Ordinary` / `Editor` /
  `Manager`. Comment update/remove enforce ownership in the action and reserve
  `status` changes for moderators.
- `getUsers` filtering `levels` (schema field is `level`).
- `countUsers` filtering `levels` (same mistake, same fix).
- `dashboardStatistic` validator declaring `locaions` instead of `places`, so
  the place count could never be requested.
- `place.gets` assuming `province` / `city` are ObjectIds. A name crashed with a
  raw driver error while `place.count` treated the same value as a name. Both
  now accept either (24-char hex → id, otherwise case-insensitive name).
- `addUser` passing `_ids: [id]` for the **single** `province`/`city` relations.
  The lookup filtered `{_id: [id]}`, matched nothing, and failed with
  "can not find this relation". Single relations take one ObjectId.
- `province.seed` inserting a duplicate copy of all 31 provinces and 429 cities
  on every run. It now skips rows that already exist (matched on
  `english_name`, and on `english_name` + `province._id` for cities).
- `event.count` filtering `relations.places._id` (the path is `places._id`).
- `file.getFiles` filtering `type` (the field is `mimType`; match a MIME prefix).
- `addUser` requiring `mobile`/`national_number` and omitting
  `email`/`password`; it now hashes the password.
- `province.count` counting the `city` collection.
- `checkGhostUser` reading `set.levels` instead of `set.level`.
- `toggleFavArticle` / `event.updateRelations(attendees)` referencing relations
  the models did not define; `favArticles`/`favByUsers` and
  `attendees`/`attended_events` now exist.
- Unescaped user input in `new RegExp(...)`: use `containsRegex` from `@lib`,
  which escapes metacharacters and prevents `SyntaxError` / ReDoS.
- `place.update` accepting `slug` in its validator and then never writing it:
  renames answered `success: true` and changed nothing. `slug` is the key
  `place.gets` looks up by, so the place could only be re-slugged by deleting
  and recreating it. `neg-02-place-update-duplicate-slug` is the regression
  test — with the field dropped it passes as a success and the suite fails.

## Related Documentation

- [Root overview](../AGENTS.md)
- [Frontend guide](../front/AGENTS.md)
- `back/QWEN-back.md` — older notes, partially stale
- Lesan docs: <https://miaadteam.github.io/lesan/>
