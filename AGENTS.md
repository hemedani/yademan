# Naghshe — Full-Stack Geographic Heritage Platform

## Project Overview

Naghshe (`نقشه گنجینه‌های ایران` — "Map of Iran's Treasures") is a full-stack
platform for discovering, exploring, and managing Iran's historical, cultural,
and natural places.

Public visitors can:

- Browse an interactive map of places across Iran.
- Filter by province, city, category, tag, antiquity, and geographic area.
- Open place details, image galleries, comments, and events.
- Explore 360° virtual tours.
- Register, log in, and manage their profile.

Editors and Managers use the admin panel to manage places, categories, cities,
provinces, tags, events, comments, users, the gallery, and virtual tours.

> **Documentation warning:** `back/Models.md` and parts of the `QWEN*.md` files
> describe an older traffic-accident system. They are historical and partially
> stale. Treat this file, `back/AGENTS.md`, `front/AGENTS.md`, and the actual
> source code as authoritative.

Sub-documents:

- [Backend guide](back/AGENTS.md)
- [Frontend guide](front/AGENTS.md)

## Architecture

| Layer | Technology |
|---|---|
| Backend | Deno + Lesan `0.2.4` (MongoDB ODM/ORM, JSR) |
| Frontend | Next.js `15.3.8` (App Router), React 19, TypeScript strict |
| Styling | Tailwind CSS v4, custom neon dark theme, Vazirmatn font, RTL |
| Database | MongoDB, database name `yademan` |
| Auth | JWT (HS512) via `djwt`; token header named `token` (no `Bearer`) |
| Maps | MapLibre GL + Leaflet / leaflet-draw |
| Virtual tours | Photo Sphere Viewer + markers plugin |
| i18n | `next-intl` v4 — Persian (`fa`, default) and English (`en`) |
| Client state | Zustand (`mapStore`) + React Context (`AuthContext`) |
| Forms | React Hook Form + Zod |
| PWA | `next-pwa` (disabled in development) |
| Files | Local uploads in `back/uploads`, served at `/uploads` |
| Containers | Docker + Docker Compose |

Redis is listed in `.env.backend` and the development Compose file, but no
current application code uses it.

## Domain Model

The core hierarchy is geographic and place-centric:

```
Province 1 ── N City 1 ── N Place
                              │
                              ├── required Category
                              ├── optional Province / City
                              ├── optional Tags
                              ├── optional Thumbnail / Gallery (File)
                              ├── optional Events
                              ├── Comments
                              └── Virtual Tours
```

| Model | Purpose |
|---|---|
| `user` | Accounts and roles. Levels: `Ghost`, `Manager`, `Editor`, `Ordinary`. |
| `province` | Province boundary (`area`, MultiPolygon) and center (`center`, Point). |
| `city` | City boundary/center plus its province; one city may be the province `capital`. |
| `place` | Main heritage location. Name, description, construction year (`antiquity`), address/contact/hours, status, GeoJSON center/area, category, tags, gallery. |
| `category` | Required top-level classification for places. Shared shape with tags. |
| `tag` | Free-form labels shared by places and events. |
| `comment` | Moderated rating/text on a place. Status: `pending`, `approved`, `rejected`. |
| `virtual_tour` | 360° panorama for a place, with hotspots. |
| `event` | Public/private event, optionally attached to multiple places. |
| `file` | Uploaded image/video/document metadata. |

All geographic values are GeoJSON. Coordinates are `[longitude, latitude]`,
never `[lat, lng]`. Place `area`/`center` are indexed with MongoDB `2dsphere`.
Province/city models intend the same, but their indexes currently reference the
legacy `center_location` field (see Gotchas).

## Request Flow

```
Browser / Server Component
        │
        ▼
src/app/actions/<model>/<act>.ts   ("use server")
        │
        ▼
AppApi().send({ service: "main", model, act, details: { set, get } })
        │
        ├── server-side → ${LESAN_URL}/lesan
        └── browser-side → /api/proxy → ${LESAN_URL}/lesan
        │
        ▼
Lesan preAct chain → validator → action function → MongoDB
        │
        ▼
{ success: boolean, body: <result> }
```

- Every backend call has the shape
  `{ service: "main", model, act, details: { set, get } }`.
- `set` contains validated input/filters; `get` is the projection tree, including
  nested relations.
- Authentication is a JWT stored in the `token` cookie and forwarded as the
  `token` header (no `Bearer` prefix).
- Errors are returned as `{ success: false, body: { message } }`.
- `place.gets` and `event.gets` return `body = { data, metadata }`. Most other
  `gets` actions return an array. `count` shapes vary: most return `{ qty }`,
  place/comment return `{ filtered, total }`, and event returns a number.

## Repository Layout

```
naghshe/
├── AGENTS.md
├── QWEN.md                    # older project notes (partially stale)
├── docker-compose.yml         # production
├── docker-compose.dev.yml     # development (needs verification, see Gotchas)
├── .env.backend
├── .env.frontend
├── back/                      # Deno + Lesan API
│   ├── mod.ts                 # entry point, models, server bootstrap
│   ├── models/                # pure schemas, relations, indexes
│   ├── src/<model>/<act>/     # action modules: mod.ts + *.fn.ts + *.val.ts
│   ├── src/mod.ts             # registers all action setups
│   ├── utils/                 # auth, context, errors, date helpers
│   ├── declarations/          # generated backend type declarations
│   ├── assets/                # Iran boundary GeoJSON (seed source)
│   └── uploads/               # runtime files (gitignored)
└── front/                     # Next.js App Router
    ├── src/app/[locale]/      # public localized site
    ├── src/app/admin/         # admin panel (not localized)
    ├── src/app/actions/       # server actions per model/act
    ├── src/app/api/           # proxy, image proxy, auth/location stubs
    ├── src/components/        # atoms → molecules → organisms → templates
    ├── src/context/           # AuthContext, MapComparisonContext
    ├── src/stores/            # Zustand map store
    ├── src/types/declarations # generated ReqType / schema types
    ├── i18n/                  # next-intl routing + request config
    └── messages/              # fa.json, en.json
```

## Building and Running

Manual development is the most reliable workflow.

### Backend

```bash
cd back
deno task bc-dev            # ENV=development, watch mode
```

- Serves at `http://localhost:1405`.
- Lesan playground and generated declarations are enabled.
- Requires MongoDB at `MONGO_URI` (default
  `mongodb://127.0.0.1:27017/`, database `yademan`).
- `deno task bc-dev` is defined in `back/deno.json`.

### Frontend

```bash
cd front
pnpm install
pnpm dev                    # Next.js + Turbopack, http://localhost:3000
```

Set `LESAN_URL=http://localhost:1405` in `front/.env.local`.

### Production

```bash
docker compose up --build
```

Intended ports: frontend `3005`, backend `1405`, MongoDB internal `27017`.
See the port caveats in **Known Inconsistencies** before deploying.

### Verification

| Target | Command |
|---|---|
| Frontend types | `cd front && pnpm type-check` |
| Frontend lint | `cd front && pnpm lint` |
| Frontend strict build | `cd front && pnpm build:strict` |
| Backend format check | `cd back && deno fmt --check` |
| Backend type check | `cd back && deno check mod.ts` |
| Backend behaviour | `cd back && deno task test:e2e` (needs a running server) |

`deno task test:e2e` is the only check that exercises the API itself: 143 steps
covering every action — happy paths, the guards that must reject, a two-account
ownership/isolation matrix and the role boundaries for `Ordinary`, `Editor` and
`Manager`. It is self-cleaning, so it can run against a live database. Run
`deno task test:bootstrap` once first. Details in
[`back/test/README.md`](back/test/README.md).

Do **not** start dev servers or production builds automatically. Run them only
when explicitly requested.

## Environment Configuration

| File | Purpose |
|---|---|
| `.env.backend` | `APP_PORT`, `ENV`, `MONGO_URI`, `REDIS_URI` |
| `.env.frontend` | `APP_PORT`, `NODE_ENV`, `LESAN_URL` |
| `front/.env.local` | local `LESAN_URL` and `NEXT_PUBLIC_LESAN_URL` |
| `back` process env | `TOKEN_KEY` (JWT signing secret), `APP_PORT`, `CORS_ORIGINS` |

Notes:

- `back/mod.ts` reads `APP_PORT` (default `1405`) and appends `CORS_ORIGINS`
  (comma-separated) to its built-in browser-origin list, so a host change does
  not need a code edit.
- `utils/setToken.ts` **refuses to boot** with `ENV=production` and no
  `TOKEN_KEY`.
- Client-side API calls go through `/api/proxy`, so `NEXT_PUBLIC_LESAN_URL` is
  not used by `AppApi` in the current implementation.
- Do not commit secrets, uploads, or generated assets listed in `.gitignore`.

## Deployment (VPS)

Production runs on `94.184.45.192` under PM2, alongside an unrelated `paper`
app. The process list lives in `/home/syd/work/ecosystem.config.js`.

| Item | Value |
|---|---|
| Backend | `yademan-BC`, port `1405`, `cwd back/` |
| Frontend | `yademan-FR`, port `3001`, `cwd front/` |
| Backend env | `/home/syd/work/yademan.env` (chmod 600) |
| Frontend env | `front/.env.production` (gitignored) |

Redeploy after a push:

```bash
cd ~/work/yademan && git pull --ff-only
cd front && npm run build          # must run before reloading yademan-FR
cd ~/work && pm2 reload ecosystem.config.js --update-env && pm2 save
```

Gotchas:

- **`COOKIE_SECURE`.** The host has no TLS terminator, so `.env.production` and
  the PM2 env set `COOKIE_SECURE=false`. A `Secure` cookie over plain HTTP is
  dropped by the browser, and login then looks successful while every later
  request is anonymous. Flip it to `true` once HTTPS is in front.
- **`LESAN_URL` stays on loopback** (`http://127.0.0.1:1405`). Server actions and
  `/api/proxy` run on the box, so API traffic never leaves it. Only
  `NEXT_PUBLIC_LESAN_URL` needs the public address.
- **`npm run build` is mandatory** before reloading the frontend; `next start`
  serves whatever is in `.next/`, and `front/.next` is not in git.
- **PM2 startup is not installed.** `systemctl is-enabled pm2-syd` returns
  `not-found`, so a reboot loses every app (including `paper`). Run the command
  printed by `pm2 startup` as root once.
- **Accounts with published passwords must be rotated** on any public host.
  `back/test/rotate-known-passwords.ts` regenerates them in place.

## Access Control

| Level | Intended role |
|---|---|
| `Ghost` | Bootstrap/super user; bypasses every `grantAccess` level check. |
| `Manager` | Full content and user administration. |
| `Editor` | Event and some content management; limited admin access. |
| `Ordinary` | Normal registered user. |

- Backend guards are authoritative (`grantAccess` in each action's `preAct`).
- The admin UI allows `Manager`, `Editor`, and `Ghost`; this is UX only.
- The admin layout redirect is client-side. Do not rely on it for security.
- `Ghost` always passes level checks in `grantAccess`, even if not listed.

## Cross-Cutting Conventions

- **Server Actions only:** new backend communication goes through
  `front/src/app/actions/**`. Do not add direct `fetch` calls to the Lesan API
  from components, and do not use the mock APIs in `front/src/lib/api`. A few
  older admin pages and the `UploadImage` widget still call `AppApi`/the proxy
  directly; do not copy that pattern for new code.
- **Use generated types:** prefer `ReqType` and generated schema types from
  `front/src/types/declarations/selectInp.ts` over hand-written API interfaces.
- **Do not copy the reference project:** this repository is a heritage/location
  platform, not the process/warehouse domain of `lesanSatek`.
- **Keep the split clean:** pure fields vs relations in backend models, and
  separate pure updates from relation updates.
- **GeoJSON discipline:** `[lng, lat]`; MultiPolygon nesting for `area`; Point
  for `center`; use the geo structures in `back/models/utils/geoJSONStruct.ts`.
- **Projection discipline:** only request fields/relations in `get` that the UI
  consumes; nested relation requests must match the generated types.
- **UI discipline:** Persian-first, RTL, dark neon theme. Reuse existing atomic
  components before creating new ones.
- **No unnecessary logs:** remove `console.log` and unused code before finishing.
- **Security:** never log tokens or secrets. The current `token` cookie is
  client-readable (`httpOnly: false`), so avoid adding sensitive data to it.

## Known Inconsistencies / Gotchas

These are verified in the current code; do not "silently fix" them unless the
task calls for it.

1. **Backend port is hardcoded.** `back/mod.ts` calls `runServer({ port: 1405 })`
   and ignores `APP_PORT`.
2. **Database name is `yademan`,** not `naghshe` (`client.db("yademan")`).
3. **City/province geometry uses `center`.** The models define `center`, and the
   `update` actions/validators now read and write `center` with a `MultiPolygon`
   `area`. (They previously used a non-existent `center_location` field and
   rejected `MultiPolygon`, so geometry updates silently failed.)
4. **Place `antiquity` is a construction year** in the Solar Hijri calendar, not
   an age. `place.gets` treats the `antiquity` filter as "minimum age" and
   converts it to a maximum construction year.
5. **Guards use real level names.** `comment.add/update/remove` accept
   `Ordinary`, `Editor`, `Manager` (comment update/remove additionally enforce
   ownership in the action), and `getUser` accepts `Manager`, `Editor`. `Ghost`
   always bypasses. Do not reintroduce the legacy `User`/`Admin`/`Examiner`
   names — they are not in `user_level_array` and never match.
6. **Legacy login action:** `front/src/app/actions/login.ts` expects
   `national_number` + `code`, but the backend `login` expects `email` +
   `password`. Use `front/src/app/actions/auth/login.ts`.
7. **Mock APIs remain:** `front/src/lib/api/auth.ts` and `locations.ts` contain
   mock data and are not connected to the backend. Do not extend them.
8. **`TOKEN_KEY` is required in production.** `back/utils/setToken.ts` throws at
   boot when `ENV=production` and `TOKEN_KEY` is unset. Docker Compose requires
   it via `${TOKEN_KEY:?...}`. Never reintroduce a hard-coded fallback secret —
   it would let anyone mint a `Ghost` token.
9. **Admin routes are not localized.** `admin/` bypasses the locale middleware
   and uses Persian-only plain `next/navigation`.
10. **No automated tests are configured** for either package.

### Indexes

Lesan's `newModel({ createIndex })` accepts only **one** index spec per model.
All additional indexes (slug uniqueness, `area`, `status`/`antiquity`, relation
ids, `name`) are declared in `back/models/indexes.ts` and applied by
`ensureIndexes(db)` at boot, which also drops the legacy
`center_location`-based indexes. When you add a filterable field, add its index
there.

## Git Workflow

When the user says **`git commit`**:

- Review the working tree (`git status`, `git diff`) and group changes into
  logical atomic commits.
- Use Conventional Commits with a Gitmoji prefix, imperative present tense,
  concise subject (about 50 chars), and a body when useful.
- Recommended types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`,
  `style`, `perf`.
- Stage specific files; never commit secrets, uploads, or unrelated changes.
- Create new commits only. Do not amend, rebase, squash, or force-push unless
  explicitly asked.
- Execute the commit commands directly once the grouping is clear.

## Documentation Map

| Document | Status |
|---|---|
| `AGENTS.md` (this file) | Current full-stack overview |
| `back/AGENTS.md` | Current backend deep dive |
| `front/AGENTS.md` | Current frontend deep dive |
| `back/Models.md` | Historical traffic-accident model list — stale |
| `QWEN*.md` | Older notes — useful context, partially stale |
| `front/src/types/declarations/selectInp.ts` | Generated API types — authoritative |
| `back/declarations/selectInp.ts` | Generated backend declarations |
