# Backend test suites

Two [Lesan playground](http://localhost:1405/playground) E2E suites, plus the
small scripts that build and run them.

| File                     | Purpose                                                                                                                        |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| `E2E.json`               | Exercises every backend action, both the happy paths and the guards that must reject. Self-cleaning, so it can run repeatedly. |
| `seed-presentation.json` | Fills a database with realistic Iranian heritage data for client demos.                                                        |
| `bootstrap.ts`           | One-time preparation: creates the account both suites log in with, and registers placeholder media under fixed ids.            |
| `build-suites.ts`        | **Source of truth** for the two JSON files. Edit this, then regenerate.                                                        |
| `run-e2e.ts`             | Headless runner with the same semantics as the playground.                                                                     |

The JSON files are build artifacts — `bodyHeaders` has to be a _stringified_
JSON envelope, which nobody should hand-edit.

## Quick start (local)

```bash
cd back

deno task test:bootstrap      # once per database
deno task bc-dev              # backend on :1405 (separate terminal)
deno task test:e2e            # 143 steps + multipart upload check
```

Expected output ends with:

```
test/E2E.json: 143/143 passed in 2.9s
```

## Running through the playground

The suites use Lesan's own runner format, so they also work in the browser:

1. Open `http://<host>:1405/playground`.
2. Switch to the **E2E** tab.
3. Use _upload json_ to load `E2E.json` or `seed-presentation.json`.
4. Press run.

`expectedFailure: { message }` marks a step that must return `success: false`
with a message containing `message` — the runner shows these with an
_expected failure_ badge instead of a red cross.

## What `E2E.json` covers

The suite runs in strict order, because later blocks read what earlier ones
captured:

`auth → fixtures → authz → iso → reads → writes → role → neg → guards → cleanup`

- **auth** — wrong password, unknown email, invalid JWT, missing token, and a
  successful login that captures the token every later step reuses.
- **fixtures** — province → city → category → tag → place → comment → virtual
  tour → event, with real relations, media and a duplicate slug that must hit
  the unique index.
- **authz** — an `Ordinary` user and an anonymous caller both rejected on
  `province.add`; a manager blocked from minting a `Ghost` account.
- **iso** — two independent `Ordinary` accounts, A and B. A comments on a place
  and may edit and delete its own comment; B is rejected on both
  (`"You cant do this"`). Neither may reach `getUsers`, `getUser`,
  `updateUser`, `updateUserRelations`, `removeUser`, `place.update`,
  `place.remove` or `event.add`. Anonymous reads stay public. This is the
  row-level-security matrix: the same request has to succeed for its owner and
  fail for the other account.
- **reads** — `get` / `gets` / `count` for every model, including the place
  filters (name, slug, status, antiquity, province/city by name _and_ id,
  `near` + `maxDistance`, `polygon`, `area`, category/tag ids) and a regex
  injection probe (`name: "("`).
- **writes** — every `update`, both relation actions, and the two
  `toggleFavArticle` directions.
- **role** — the `Editor` account is the interesting middle tier: it may
  moderate comments, create events and list users, but is rejected on `place`,
  `category`, `tag`, `city`, `province`, `virtual_tour`, `user.addUser` and
  `event.remove`. Every denial sends a schema-valid body, so it can only pass on
  the authorization check.
- **neg** — business rules that are neither authorization nor schema: renaming a
  place onto a taken slug (`E11000`), deleting a place an event still lists,
  commenting on a nonexistent place, adding a user with a taken email, deleting
  a nonexistent place. These are the assertions that catch a silently dropped
  field.
- **guards** — deletion refused while another collection still references the
  record.
- **cleanup** — removes everything it created, children first.

Two things the JSON format cannot express:

- `file.uploadFile` needs `multipart/form-data`, so it is covered by
  `run-e2e.ts --with-upload` instead (both the accepted upload and the rejected
  extension).
- `province.seed` is not part of the suite because it mutates the geography that
  other steps look up. It is idempotent, and `seed-presentation.json` runs it.

## What `seed-presentation.json` does

1. Logs in and seeds the 31 provinces / 429 counties from the GADM files in
   `assets/geojson/` (idempotent — existing rows are reused).
2. Adds 6 categories and 8 tags in Persian.
3. Adds 12 real heritage sites (Persepolis, Naqsh-e Jahan, Bam, Golestan, …)
   with correct coordinates, descriptions, opening hours, media and taxonomy.
4. Adds 5 events, 3 virtual tours, 5 comments and a second staff account
   (`editor@naghshe.dev` / `EditorDemo123!`). The comments are created with
   `status: "approved"`: `comment.add` defaults to `pending`, and the place page
   only renders approved ones, so a demo seeded with defaults shows no reviews.

Run it **once**. The geography step is idempotent, but the content steps are
additive: a second run fails on the unique place slugs and the staff email.
To start over, drop the demo records:

```bash
mongosh "mongodb://127.0.0.1:27017/yademan" --eval '
  db.event.deleteMany({ name: { $in: ["جشن نوروزگاه تخت جمشید", "شب‌های فرهنگی میدان نقش جهان"] } });
  db.place.deleteMany({ slug: { $in: [
    "persepolis","naqsh-e-jahan","nasir-ol-molk","golestan-palace","fin-garden",
    "jameh-mosque-yazd","si-o-se-pol","bam-citadel","gonbad-e-qabus",
    "taq-e-bostan","bu-ali-sina-tomb","tabriz-historical-bazaar" ] } });
  db.user.deleteOne({ email: "editor@naghshe.dev" });
'
```

## Running it on the VPS

The backend container runs with `WORKDIR /app` and copies `assets/`, so
`province.seed` can find the GeoJSON files. `uploads/` is a bind mount.

```bash
# 1. Create the account the suites log in with (idempotent).
docker compose exec backend deno run -A test/bootstrap.ts

# 2. Load the demo data.
docker compose exec backend deno run -A test/run-e2e.ts \
  --file test/seed-presentation.json --base http://127.0.0.1:1405/

# 3. Verify the backend, whenever you deploy.
docker compose exec backend deno run -A test/run-e2e.ts \
  --file test/E2E.json --with-upload --base http://127.0.0.1:1405/
```

Pass `--email`, `--password` and `--level` to `bootstrap.ts` to use different
credentials, then update `LOGIN_EMAIL` / `LOGIN_PASSWORD` in `build-suites.ts`
and regenerate. `bootstrap.ts` honours `E2E_EMAIL`, `E2E_PASSWORD`, `E2E_LEVEL`,
`MONGO_URI` and `MONGO_DB` as well.

## Changing the suites

```bash
# edit test/build-suites.ts, then
deno task test:build
```

`build-suites.ts` keeps the payloads readable and validates them at build time
through `deno check`, which is why the JSON is generated rather than written by
hand.

## Notes and gotchas

- **Ordering of validation and authorization.** Only `user.countUsers`,
  `user.dashboardStatistic` and `user.getUsers` use `preValidation`; every other
  protected act uses `preAct`, which runs _after_ the validator. A denial test
  on a `preAct` act therefore needs a schema-valid body, otherwise it fails with
  a `Expected … but received: undefined` schema error and never reaches
  `grantAccess`. All `role-*` and `iso-*` denials are written that way on
  purpose.
- `event.count` and `event.remove` have no usable `get` in their validators —
  `event.count` must omit `get` entirely and `event.remove` must send `get: {}`.
  Any projection key is rejected with _"Expected a value of type `never`"_.
- `place.gets` requires `get: { data: {…} }` (an optional sibling `metadata`
  adds the `$count` aggregation). Sending a bare projection is a validation
  error, not an empty page.
- `remove` returns `true`, not `{ success: true }`.
- `place.get` and `comment.get` return arrays; `event.get` returns a single
  object.
- `emailPattern` in `models/user.ts` only accepts a 2–4 character TLD, so test
  addresses end in `.dev`, not `.local`.
- Deleting a record that is still referenced fails by design; the cleanup steps
  therefore run children-first, and users are removed before the province/city
  they point at.
- `neg-02-place-update-duplicate-slug` is a regression test: `place.update` used
  to accept `slug` in its validator and drop it before the write, answering
  `success: true` while changing nothing. If that ever comes back, this step
  passes as a success and the suite fails there.
