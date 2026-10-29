# Naghshe Backend — Deno + Lesan

## Overview

The backend is a Deno service built on **Lesan `v0.1.26`**, a MongoDB ODM/ORM
with schema validation, relation management, generated type declarations, and a
built-in API playground. It exposes one service, `main`, containing the actions
for users, geography, places, events, comments, tags, categories, files, and
virtual tours.

| Item | Value |
|---|---|
| Runtime | Deno (requires network access to JSR/GitHub on first run) |
| Framework | Lesan `v0.1.26` from `deps.ts` |
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
├── deps.ts                 # Lesan, djwt, common exports
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
└── test/                   # Hurl/E2E JSON scenarios
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
| `user` | `first_name`, `last_name`, `father_name?`, `gender` (`Male`/`Female`), `birth_date?`, `summary?`, `address?`, `level` (default `Ordinary`), `email` (unique), `password`, `is_verified`, timestamps | `avatar?`, `national_card?` → `file`; `province?`, `city?` → location; reverse `registered_places`, comments, events, uploaded assets | Passwords are bcrypt-hashed by actions; `password` is excluded globally. Levels: `Ghost`, `Manager`, `Editor`, `Ordinary`. |
| `file` | `name`, `mimType`, `size`, `alt_text?`, timestamps | `uploader` → `user`; reverse `uploadedAssets` | Field is spelled `mimType`. Upload action writes the real file under `uploads/`. |
| `province` | `pure_location` | `registrar?` → `user`; reverse `cities`, `capital`, `places`, `users` | Intended 2dsphere index on `area` + `center_location` (see gotchas). |
| `city` | `pure_location` | `registrar?`, `province?`; reverse `cities`, `capital`, `places`, `users` | `add` takes `provinceId` + `isCapital`; `isCapital` sets province reverse `capital`. |
| `category` | `shared_relation_pure` | `registrar?` → `user`; reverse `places` | Required relation on every place. |
| `tag` | `shared_relation_pure` | `registrar?` → `user`; reverse `places`, `events` | Shared by places and events. |
| `place` | `name`, `antiquity`, `description`, `slug?`, `center` (Point), `area` (MultiPolygon), `address?`, `contact{phone,email,website,social[]}?`, `hoursOfOperation?`, `meta?`, `status` (`draft`/`active`/`archived`), timestamps | `registrar?`, `province?`, `city?`, `category` (required), `tags?`, `thumbnail?`, `gallery?`; reverse `comments`, `virtual_tours`, `events` | Indexes: 2dsphere `center` + `area`; unique partial `slug`. `antiquity` is a **construction year**, not an age. |
| `comment` | `text`, `rating?`, `status` (default `pending`), `is_anonymous` (default `false`), timestamps | `user` (required), `place` (required); reverse comments | Public reads; add/update/remove guarded. |
| `virtual_tour` | `name`, `description?`, `hotspots?[]` (`pitch`, `yaw`, `description?`, `target?`), `status` (`draft`/`active`/`archived`), timestamps | `place` (required), `panorama?` → `file`, `registrar?`; reverse on place | Hotspots are embedded, not a separate collection. |
| `event` | `name`, `description?`, `startTime`, `endTime`, `color?`, `icon?`, `capacity?`, `status` (`draft`/`published`/`archived`/`cancelled`), `isPublic?`, `ticketPrice?`, `registrationRequired?`, `maxAttendees?`, `eventUrl?`, `registrationUrl?`, timestamps | `registrar?`, `places?`, `organizer?`, `tags?`, `thumbnail?`, `gallery?`; reverse `registered_events`, `organized_events`, `events` | Date strings are coerced to `Date`. Index on `startTime` + `endTime`. |

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
| `comment` | `add` | `Admin`, `Manager`, `User` (see gotchas) |
| | `update`, `remove` | `Admin`, `Manager` |
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

The first run downloads Lesan from GitHub and JSR dependencies. There is no
configured `deno test` suite; `test/` contains Hurl scenarios.

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
3. **`center_location` drift:** `province`/`city` models define `center`, but
   their `update` actions and 2dsphere indexes use `center_location`. Center
   updates and center indexes therefore do not match the schema.
4. **`antiquity` is a construction year** (Solar Hijri), despite comments saying
   "age in years". `place.gets` converts the requested minimum age into a
   maximum construction year.
5. **Legacy level names are used in guards.** `comment.add` lists `"User"`,
   comment update/remove list `"Admin"`, and `getUser` lists `"Examiner"`.
   None of these exist in `user_level_array`; only a real listed level passes
   (or `Ghost`, which bypasses). In practice comment mutations require
   `Manager`/`Ghost`.
6. **`getUsers` filters `levels`**, but the schema field is `level`.
7. **`event.updateRelations` accepts `attendees` and writes an `attendees`
   relation**, but the event model has no such relation. Do not rely on it until
   the model is updated.
8. **`file.getFiles` filters on `type`**, while the file model stores `mimType`.
9. **`addUser` validator requires `mobile` and `national_number`**, but
   `user_pure` no longer defines either field.
10. **`province.count` counts the `city` collection**, not `province`. This is a
    copy/paste bug; do not rely on it.
11. **Count response shapes are not uniform.** Check each action: `{ qty }` is
    common, place/comment return `{ filtered, total }`, and event returns a raw
    number.
12. **`checkGhostUser` reads `set.levels`**, but `addUser` validates `level`.
    The Ghost-creation guard therefore does not fire.
13. **`toggleFavArticle` uses `favArticles` / `favByUsers`**, but the user model
    defines neither relation. It will fail until the model is extended.

## Related Documentation

- [Root overview](../AGENTS.md)
- [Frontend guide](../front/AGENTS.md)
- `back/QWEN-back.md` — older notes, partially stale
- Lesan docs: <https://miaadteam.github.io/lesan/>
