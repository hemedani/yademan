# Naghshe Frontend — Next.js Application

## Overview

Naghshe is a Next.js App Router frontend for Iran's cultural/natural heritage
places. It combines a full-screen MapLibre map, place discovery and filtering,
event pages, 360° virtual tours, comments, user accounts, and a Persian admin
panel for editors and managers.

The UI is Persian-first and RTL, with English available through `next-intl`.
The visual language is a black/neon dark theme (pink, purple, green, lime).

## Core Features

- Interactive map of places with markers, clustering, drawing, and pathfinding.
- Filters for province/city, category, tag, antiquity, and geographic area.
- Place detail pages, galleries, comments, and related events.
- 360° virtual tours with Photo Sphere Viewer hotspots.
- Event listing and detail pages.
- Registration/login/profile with JWT auth.
- Admin CRUD for places, categories, cities, provinces, tags, events, comments,
  users, gallery, and virtual tours.
- PWA support (disabled during development).

## Architecture

| Layer | Technology |
|---|---|
| Framework | Next.js `15.3.8` App Router, React 19 |
| Language | TypeScript strict (`tsconfig.json`) |
| Styling | Tailwind CSS v4 + custom CSS; dark neon theme |
| Fonts | Vazirmatn (local, `public/fonts` / `src/assets`) |
| i18n | `next-intl` v4; `fa` default, `en` |
| Client state | Zustand (`src/stores/mapStore.ts`), React Context (`AuthContext`, `MapComparisonContext`) |
| Forms | React Hook Form + Zod |
| Maps | MapLibre GL (`InteractiveMap`), Leaflet / leaflet-draw (admin) |
| Virtual tours | `@photo-sphere-viewer/core` + markers plugin |
| Dates | `react-multi-date-picker`, `react-date-object`, `date-fns-jalali` |
| UI primitives | Headless UI, Heroicons, Framer Motion, React Hot Toast |
| API | Server Actions for CRUD; legacy admin/upload paths still use `AppApi`/proxy |
| PWA | `next-pwa` |
| Package manager | **pnpm only** |

## Domain Concepts

| Concept | Description |
|---|---|
| Place | Heritage location. Has GeoJSON `center`/`area`, a required category, optional province/city/tags, thumbnail/gallery, comments, events, and virtual tours. |
| Category | Required top-level classification for places. |
| Tag | Free-form labels shared by places and events. |
| Province / City | Administrative geography. Each has a boundary (`area`) and center point. A city can be a province `capital`. |
| Event | Public or private event with start/end time, optional places, organizer, tags, and gallery. |
| Virtual tour | 360° panorama linked to a place, with embedded hotspots. |
| Comment | Moderated user review with optional rating. |
| User | Account with level `Ghost`, `Manager`, `Editor`, or `Ordinary`. |
| File | Uploaded image/video/document metadata. |

## Routes

### Public localized routes (`src/app/[locale]/…`)

| Route | Purpose |
|---|---|
| `/[locale]` (`fa` default) | Map home and discovery |
| `/[locale]/location/[id]` | Place details |
| `/[locale]/events` | Events list |
| `/[locale]/events/[_id]` | Event details |
| `/[locale]/virtual-tour/[id]` | 360° tour |
| `/[locale]/about` | About |
| `/[locale]/contact` | Contact |
| `/[locale]/login` | Login |
| `/[locale]/register`, `/[locale]/signup` | Registration |
| `/[locale]/profile`, `/[locale]/user` | Profile/user area |
| `/[locale]/menu` | Menu page |

`src/app/page.tsx` redirects `/` → `/fa`. `src/app/layout.tsx` is a pass-through;
`src/app/[locale]/layout.tsx` owns `<html>`, `<body>`, `dir`, providers, and the
toaster. Do not add a second `<html>`/`<body>`.

### Admin routes (`src/app/admin/…`, not localized)

`dashboard`, `places`, `categories`, `city`, `province`, `tags`, `events`,
`comments`, `users`, `gallery`, `virtual-tours`, `reports`, `settings`.

The admin layout is a client component. It redirects non-admin users to
`/login` and renders Persian UI. This guard is **UX only**; backend guards are
authoritative.

## Authentication and Roles

- Backend levels: `Ghost`, `Manager`, `Editor`, `Ordinary`.
- The frontend `UserLevel` type also includes legacy `"Normal"`; do not rely on
  it. The backend returns `"Ordinary"` for normal users.
- Admin access is allowed for `Manager`, `Editor`, and `Ghost` (see
  `src/components/organisms/AdminSidebar.tsx` and `src/app/admin/layout.tsx`).
- `Ghost` should be included in every privileged check because the backend
  always lets it pass.
- Login is implemented in `src/app/actions/auth/login.ts`. It calls backend
  `user.login` with `email` + `password`, then writes three client-readable
  cookies:
  - `token` — JWT;
  - `user` — `JSON.stringify({ level })`;
  - `national_number` — currently stores the user's email.
- `token` is `httpOnly: false` because client code reads it via `js-cookie`.
- `AuthContext` hydrates from the `token` cookie and calls `getMe()`. The level
  always comes from that response — **never** from the `user` cookie, which is
  client-writable and would let anyone render the admin UI. A `network` failure
  keeps the token (so the session survives a backend blip); only `no_token` /
  `unauthorized` clears it.
- Logout clears the cookies; `logoutAndRedirect` redirects to `/login`.

Do not reuse `src/app/actions/login.ts`: it sends `national_number` + `code`,
which the current backend `login` does not accept.

## API Communication

All backend access goes through Server Actions in `src/app/actions/**`.

```
Server Component / Client Component
        │
        ▼
src/app/actions/<model>/<act>.ts        ("use server")
        │
        ▼
AppApi().send(
  { service: "main", model, act, details: { set, get } },
  { token },
)
        │
        ├── server-side → `${LESAN_URL}/lesan`
        └── browser-side → `/api/proxy` → `${LESAN_URL}/lesan`
```

`src/services/api.ts` (`AppApi`):

- Server-side: uses `process.env.LESAN_URL` + `/lesan` (fallback
  `http://localhost:1405`).
- Client-side: posts to `/api/proxy`.
- Token: passed explicitly by server actions from `cookies()`, or read from
  `js-cookie` on the client.
- Sends the token in a header named `token` (no `Bearer` prefix).

`src/app/api/proxy/route.ts` forwards JSON and multipart bodies, forwards the
token/cookie headers, has a 55s upstream timeout, and forces dynamic rendering.
`src/app/api/image-proxy/route.ts` fetches backend `/uploads/**` and caches for
one hour. It only accepts paths matching `^uploads/[A-Za-z0-9._\-\/]+$`, refuses
anything that is not served as `image/*`, and answers with a sandboxed CSP so a
directly-opened SVG cannot run script on our origin.

### Server Action Pattern

```ts
"use server";

import { cookies } from "next/headers";
import { AppApi } from "@/services/api";
import { ReqType } from "@/types/declarations/selectInp";

export const gets = async ({
  set,
  get,
}: ReqType["main"]["place"]["gets"]) => {
  const token = (await cookies()).get("token");

  return await AppApi().send(
    {
      service: "main",
      model: "place",
      act: "gets",
      details: {
        set: { ...set, page: set.page ?? 1, limit: set.limit ?? 50 },
        get,
      },
    },
    { token: token?.value },
  );
};
```

Rules:

- Start files with `"use server"`.
- `cookies()` is async in Next 15 — always `await`.
- Default `page` and `limit` for collection actions (`gets`, `getUsers`,
  `getFiles`, …).
- Use the actual action name from the backend. For places the relation actions
  are `updatePlaceRelations` / `removePlaceRelations`, even though the local
  files are named `updateRelations.ts` / `removeRelations.ts`.
- Some `get` wrappers accept `(_id, get)`, others accept `({ set, get })`.
  Check the action file before calling it.
- Do not add a direct `fetch` to Lesan from a component.

### Response Shapes

Backend envelope:

```ts
{ success: boolean, body: unknown }
```

Common body shapes:

| Action | `body` |
|---|---|
| `place.gets`, `event.gets` | `{ data: T[], metadata: { total, page, limit, pageCount } }` |
| `city.gets`, `province.gets`, `tag.gets`, `category.gets`, `virtual_tour.gets`, `comment.gets`, `getUsers`, `getFiles` | array |
| `count` | varies: most `{ qty }`; `place.count`/`comment.count` `{ filtered, total }`; `event.count` a number |
| `countUsers` | `{ qty }` |
| `get`, mutations | object |
| `user.getMe` wrapper | `{ success, user?, error? }` (flattened, not the raw envelope) |

Always handle `success: false` and `body.message`.

### Action Catalog

`src/app/actions/`

| Folder | Actions |
|---|---|
| `auth` | `loginAction`, `logoutAction`, `logoutAndRedirect`, `registerAction` |
| `category` | `add`, `count`, `get`, `gets`, `remove`, `update` |
| `city` | `add`, `count`, `get`, `gets`, `getAllCities`, `remove`, `update` |
| `province` | `add`, `count`, `get`, `gets`, `remove`, `update` |
| `tag` | `add`, `count`, `get`, `gets`, `remove`, `update` |
| `place` | `add`, `count`, `get`, `gets`, `remove`, `update`, `updateRelations` (backend `updatePlaceRelations`), `removeRelations` (backend `removePlaceRelations`) |
| `comment` | `add`, `count`, `get`, `gets`, `remove`, `update` |
| `event` | `add`, `count`, `get`, `gets`, `remove`, `update` |
| `virtual_tour` | `add`, `count`, `get`, `gets`, `remove`, `update` |
| `user` | `createUser`, `countUsers`, `dashboardStatistic`, `getMe`, `getUser`, `getUsers`, `removeUser`, `updateUser`, `updateRelationUser`, `userFavoritArticle` |
| root | `getGeoJSON.ts` (local assets/geodata), legacy `login.ts` (do not use) |

## Type System

Use generated declarations:

```ts
import { ReqType } from "@/types/declarations/selectInp";
```

- `ReqType["main"][model][act]["set" | "get"]` is the source of truth for action
  inputs and projections.
- Generated schema types (`placeSchema`, `eventSchema`, `userSchema`, …) should
  be preferred over hand-written API interfaces.
- `get` projections must match what the backend `selectStruct` depth allows.
  Request only the fields the UI uses; request nested relations explicitly.
- `getUsers` returns an array (no metadata), unlike `place.gets` /
  `event.gets`.
- Update the declarations by running the backend with type generation, not by
  editing `selectInp.ts` manually.

## Design System

Dark neon theme, Persian-first, RTL.

Core tokens (`src/app/dark-theme.css` and `tailwind.config.ts`):

| Token | Value |
|---|---|
| `--dark-bg` | `#000000` |
| `--darker-bg` | `#0a0a0a` |
| `--dark-card` | `#121212` |
| `--dark-surface` | `#1e1e1e` |
| `--dark-border` | `#333333` |
| `--neon-pink` | `#ff007a` |
| `--neon-green` | `#00ff85` |
| `--neon-purple` | `#a020f0` |
| `--neon-lime` | `#bfff00` |

- `src/app/globals.css` imports Tailwind v4, Leaflet, Photo Sphere Viewer, and
  `dark-theme.css`.
- Use existing glow classes (`.glow-pink`, `.glow-green`, `.glow-purple`,
  `.glow-lime`) and `.btn-neon-*` where appropriate.
- Reuse atomic components before creating new ones:
  - inputs: `src/components/atoms/MyInput.tsx`, `Input.tsx`, `Select.tsx`,
    `AsyncSelectBox.tsx`, `MyAsyncMultiSelect.tsx`;
  - dates: `DateInput.tsx` / `MyDateInput.tsx` (`react-multi-date-picker`);
  - uploads: `src/components/molecules/UploadFile.tsx` (exports the
    `UploadImage` component);
  - page feedback: `Loader.tsx`, `LoadingSpinner.tsx`, `Modal.tsx`,
    `ConfirmationDialog.tsx`, `Pagination.tsx`, `SearchBox.tsx`;
  - buttons: `NeonButton.tsx`, `ui/Button.tsx`.
- Older notes mention `SelectBox`; use `AsyncSelectBox`/`Select`. Uploads live
  in `UploadFile.tsx`, which exports `UploadImage` — both names appear in code.
- Mobile-first responsive layouts; avoid physical `left`/`right` where logical
  RTL spacing is needed.
- Use `react-hot-toast` for user feedback and Framer Motion sparingly for
  transitions.

## Forms

- Use React Hook Form; use Zod with `@hookform/resolvers` where validation is
  non-trivial.
- Use `DateInput` / `MyDateInput` for all Persian/Gregorian date inputs.
- For dependent selects (province → city), watch the parent value, reset the
  child when it changes, and give the child a `key` tied to the parent.
- For multi-selects and async selects, set values with `setValue`.
- Type array defaults explicitly (`[] as string[]`) and optional numbers as
  `number | undefined`.
- Follow the structure of `src/components/template/FormCreateUser.tsx`,
  `FormCreatePlace.tsx`, and `FormCreateCity.tsx` for admin forms.

## Maps and Geography

- Main map: `src/components/map/InteractiveMap.tsx` (MapLibre GL), with
  `MapView.tsx`, marker/popup/sidebar components, and `src/stores/mapStore.ts`.
- The map uses OpenFreeMap dark/liberty styles and falls back to OpenStreetMap
  raster tiles on style/network failure.
- Admin drawing uses Leaflet + leaflet-draw in the create/update city/province
  forms.
- GeoJSON coordinate order is `[longitude, latitude]`. Convert carefully when
  Leaflet expects `[lat, lng]`.
- `mapStore` holds center, zoom, bounds, filters, selected place, drawing state,
  and pathfinding state. `src/utils/pathfinding.ts` implements route helpers.
- Place filters include `name`, `slug`, `status`, `province`, `city`,
  `categoryIds`, `tagIds`, `area`, `near`, `maxDistance`, `minDistance`,
  `antiquity`.
- `antiquity` is a construction year in the backend; the UI slider presents it
  as an age and the backend converts it.

## Images and Files

- Use `getImageUrl(path)` from `src/utils/imageUrl.ts`:
  - client → `/api/image-proxy?path=…`;
  - server → `${LESAN_URL}/${path}`.
- `getImageUploadUrl(filename, "images" | "docs")` builds upload paths.
- `next.config.ts` allows backend `/uploads/**` images from `localhost:1405` and
  `185.204.170.27:1405`.
- Uploads are a legacy client-side exception: `UploadImage` posts multipart data
  to `/api/proxy` for the backend `file.uploadFile` action. The proxy preserves
  multipart bodies. Prefer a server action if you add a new upload flow.

## Internationalization

- `i18n/routing.ts` defines locales `["fa", "en"]`, default `fa`, and exports
  `Link`, `redirect`, `usePathname`, `useRouter`.
- `i18n/request.ts` loads messages from `messages/fa.json` and
  `messages/en.json` (project root, not `src/`).
- `middleware.ts` adds/redirects locales and explicitly excludes `admin`,
  `_next`, `_vercel`, and files with extensions.
- Public pages use `useTranslations` / `getTranslations`. Navigation is mixed:
  some components use `i18n/routing` (`TopBar`, `LanguageSwitcher`,
  `UserDropdown`), many pages use plain `next/navigation` plus `params.locale`.
  Prefer `i18n/routing` for new localized links.
- Admin is Persian-only and bypasses locale routing.
- Layout sets `dir="rtl"` for `fa` and `ltr` for `en`.

## PWA and Next Configuration

- `next-pwa` writes the service worker to `public/`; `register: true`,
  `skipWaiting: true`, disabled when `NODE_ENV=development`.
- `public/sw.js` is generated. Do not hand-edit it.
- Server Action body limit is `550mb`; API routes are configured for large
  uploads.
- `next.config.ts` wraps the app with `next-intl` and `next-pwa`.

## Environment and Commands

`front/.env.local`:

```bash
LESAN_URL=http://localhost:1405
NEXT_PUBLIC_LESAN_URL=http://localhost:1405
```

- `LESAN_URL` is used server-side and by the proxy/image proxy.
- `NEXT_PUBLIC_LESAN_URL` is currently **not used** by `AppApi`; client requests
  go through `/api/proxy`.
- `APP_PORT` is used by `pnpm start` (`next start -p ${APP_PORT:-3000}`).

```bash
cd front
pnpm install
pnpm dev            # http://localhost:3000, Turbopack
pnpm type-check     # tsc --noEmit
pnpm lint
pnpm build
pnpm build:strict   # type-check + lint + build
```

**Do not** start the dev server or run builds automatically. The user normally
runs the project and reports errors. Provide commands when asked; run them only
when explicitly requested.

## Code Conventions

- Use `pnpm`; do not switch to npm/yarn.
- Keep TypeScript strict and avoid new `any` unless unavoidable at an API
  boundary.
- Clean up `console.log`, unused imports, and dead code before finishing.
- Use Server Actions for every new backend call; never call the mock
  `AuthAPI`/`locations` APIs or add direct Lesan fetches. Some older admin pages
  still call `AppApi` directly (`admin/events`, `admin/comments`,
  `ProvinceUpdateModal`); do not copy that pattern.
- Keep public and admin UI separate: public is localized/RTL-aware, admin is
  Persian-only with `next/navigation`.
- Prefer server components; add `"use client"` only when state, effects, or
  browser APIs are needed.
- Reuse existing components and theme classes; do not introduce a second design
  system.
- Keep forms typed end-to-end with `ReqType`/generated schema types.
- Do not log tokens or user secrets.

## Known Gotchas

1. **`token` is client-readable** (`httpOnly: false`) because `js-cookie` reads
   it. Do not store sensitive data in it.
2. **Two login actions exist.** Use `src/app/actions/auth/login.ts`
   (`email`/`password`). `src/app/actions/login.ts` is a stale OTP/national-code
   action and does not match the backend.
3. **Mock APIs remain** in `src/lib/api/auth.ts` and `src/lib/api/locations.ts`,
   plus `src/app/api/auth` and `src/app/api/locations`. They are not connected
   to Lesan. Do not extend or use them for real features.
4. **Admin routes are not localized** and the admin guard is client-side only.
5. **`getMe` flattens the envelope** to `{ success, user?, error?, reason? }`;
   other actions return `{ success, body }`. `reason` is
   `"no_token" | "unauthorized" | "network"` — only clear the session for the
   first two.
6. **`place.gets`/`event.gets` return `{ data, metadata? }`**, while most other
   collections return a bare array. `metadata` is optional: omit it and the
   backend skips its `$count` aggregation.
7. **Map viewport filter is `polygon`, not `area`.** `polygon` is tested against
   the indexed `center`; `area` tests the place boundary and is far slower.
8. **`virtual_tour` uses an underscore** in action/model names, but routes use
   `virtual-tour`.
9. **`NEXT_PUBLIC_LESAN_URL` is unused** by the current API service.
10. **The map style in `mapStore` contains a placeholder MapTiler key**, but
    `InteractiveMap` uses OpenFreeMap directly; do not assume the store style is
    active.
11. **`public/sw.js` is generated** by `next-pwa`; edits are overwritten.
12. **Direct `AppApi` calls still exist in admin pages** and some pass
    `LESAN_URL` into client components. New code must use `src/app/actions`.
    A few admin fallback URLs are stale (e.g. `admin/virtual-tours` falls back to
    `http://localhost:1382`).

## Related Documentation

- [Root overview](../AGENTS.md)
- [Backend guide](../back/AGENTS.md)
- `front/QWEN.md` — older notes, partially stale (component/route names may
  differ)
- `src/types/declarations/selectInp.ts` — generated API types
- `src/app/[locale]/events/README.md` — event-specific notes
