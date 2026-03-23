# 🎪 Festival Planner

A full-stack music festival discovery and scheduling portal. Browse festivals, explore stage lineups, favorite artists, build a personal set-time plan, and get real-time conflict detection when sets overlap.

---

## Tech Stack

### Frontend (`apps/web`)

| Technology            | Version | Purpose                                               |
| --------------------- | ------- | ----------------------------------------------------- |
| React                 | ^19     | UI framework                                          |
| TypeScript            | ^5      | Static typing                                         |
| Vite                  | ^6      | Build tooling & dev server                            |
| React Router v7       | ^7      | Client-side routing + protected routes                |
| TailwindCSS           | v4      | Utility-first styling                                 |
| shadcn/ui             | latest  | Accessible UI component library (Radix UI primitives) |
| Framer Motion         | ^11     | Page transitions & UI animations                      |
| Lucide React          | ^0.400  | Icon system                                           |
| Sonner                | ^1      | Toast notifications                                   |
| Zustand               | ^5      | Client state (theme, favorites, plan)                 |
| TanStack Query        | ^5      | Server state, data fetching & caching                 |
| React Hook Form       | ^7      | Form state management                                 |
| Zod                   | ^3      | Schema validation (forms + API)                       |
| date-fns              | ^3      | Date formatting & conflict detection                  |
| clsx + tailwind-merge | latest  | Conditional classname utility                         |
| TanStack Table        | ^8      | Admin data tables (CRUD views)                        |

### Backend (`apps/api`)

| Technology  | Version | Purpose                                    |
| ----------- | ------- | ------------------------------------------ |
| Hono        | ^4      | API server (edge-native, TypeScript-first) |
| Neon        | latest  | Serverless PostgreSQL database             |
| Drizzle ORM | ^0.30   | Type-safe query builder + migrations       |
| Better Auth | ^1      | Authentication (email/password, sessions)  |
| Cloudinary  | ^2      | Festival & artist image hosting            |
| Zod         | ^3      | Request/response validation                |

### Shared (`packages/shared`)

| Technology       | Purpose                                                  |
| ---------------- | -------------------------------------------------------- |
| Zod schemas      | Shared validation between frontend & backend             |
| TypeScript types | Shared entity types (Festival, Stage, Artist, Set, etc.) |

### Monorepo

| Tool                          | Purpose                     |
| ----------------------------- | --------------------------- |
| pnpm workspaces               | Monorepo package management |
| TypeScript project references | Cross-package type safety   |

---

## Project Structure

```
festival-planner/
├── apps/
│   ├── web/                              # Vite + React frontend
│   │   ├── src/
│   │   │   ├── assets/
│   │   │   ├── components/
│   │   │   │   ├── ui/                   # shadcn/ui primitives (auto-generated)
│   │   │   │   ├── layout/
│   │   │   │   │   ├── Header.tsx
│   │   │   │   │   ├── Footer.tsx
│   │   │   │   │   └── ThemeToggle.tsx
│   │   │   │   ├── festivals/
│   │   │   │   │   ├── FestivalCard.tsx
│   │   │   │   │   ├── FestivalGrid.tsx
│   │   │   │   │   └── FestivalHero.tsx
│   │   │   │   ├── schedule/
│   │   │   │   │   ├── DaySelector.tsx
│   │   │   │   │   ├── StageTabs.tsx
│   │   │   │   │   ├── SetCard.tsx
│   │   │   │   │   └── ConflictBadge.tsx
│   │   │   │   └── plan/
│   │   │   │       ├── PlanSidebar.tsx   # Desktop right sidebar
│   │   │   │       ├── PlanDrawer.tsx    # Mobile bottom drawer
│   │   │   │       ├── PlanItem.tsx
│   │   │   │       └── ConflictAlert.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useFestivals.ts       # TanStack Query hooks
│   │   │   │   ├── useFestivalDetail.ts
│   │   │   │   ├── useFavorites.ts
│   │   │   │   ├── useFestivalPlan.ts
│   │   │   │   └── useConflicts.ts
│   │   │   ├── lib/
│   │   │   │   ├── api.ts                # Fetch wrapper + base URL
│   │   │   │   ├── auth-client.ts        # Better Auth client instance
│   │   │   │   ├── queryClient.ts        # TanStack Query client config
│   │   │   │   └── utils.ts              # clsx + twMerge helper (cn())
│   │   │   ├── pages/
│   │   │   │   ├── LandingPage.tsx
│   │   │   │   ├── FestivalDetailPage.tsx
│   │   │   │   ├── LoginPage.tsx
│   │   │   │   ├── RegisterPage.tsx
│   │   │   │   └── admin/
│   │   │   │       ├── AdminLayout.tsx
│   │   │   │       ├── FestivalsAdminPage.tsx
│   │   │   │       ├── FestivalFormPage.tsx
│   │   │   │       ├── ArtistsAdminPage.tsx
│   │   │   │       ├── ArtistFormPage.tsx
│   │   │   │       └── ScheduleAdminPage.tsx
│   │   │   ├── routes/
│   │   │   │   ├── index.tsx             # Router config
│   │   │   │   └── ProtectedRoute.tsx    # Auth + role guard
│   │   │   ├── store/
│   │   │   │   ├── themeStore.ts         # Dark/light mode (persisted)
│   │   │   │   ├── favoritesStore.ts     # Starred artists
│   │   │   │   └── planStore.ts          # Plan items + conflict detection
│   │   │   ├── types/                    # Re-exports from shared package
│   │   │   ├── App.tsx
│   │   │   └── main.tsx
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   ├── tailwind.config.ts
│   │   ├── components.json               # shadcn/ui config
│   │   └── tsconfig.json
│   │
│   └── api/                              # Hono API server
│       ├── src/
│       │   ├── db/
│       │   │   ├── schema.ts             # Drizzle table definitions
│       │   │   ├── client.ts             # Neon + Drizzle client
│       │   │   └── migrations/
│       │   ├── routes/
│       │   │   ├── auth.ts               # Better Auth handler
│       │   │   ├── festivals.ts          # GET /festivals, GET /festivals/:slug
│       │   │   ├── stages.ts             # CRUD /festivals/:id/stages
│       │   │   ├── artists.ts            # CRUD /artists
│       │   │   ├── sets.ts               # CRUD /festivals/:id/sets
│       │   │   ├── favorites.ts          # POST/DELETE /me/favorites
│       │   │   └── plans.ts              # GET/POST/DELETE /me/plans
│       │   ├── middleware/
│       │   │   ├── auth.ts               # Session validation middleware
│       │   │   └── adminOnly.ts          # Role check middleware
│       │   └── index.ts                  # Hono app entry
│       ├── drizzle.config.ts
│       └── tsconfig.json
│
├── packages/
│   └── shared/
│       └── src/
│           ├── schemas/
│           │   ├── festival.schema.ts
│           │   ├── artist.schema.ts
│           │   └── set.schema.ts
│           └── types/
│               └── index.ts
│
├── package.json                          # pnpm workspace root
├── pnpm-workspace.yaml
└── tsconfig.base.json
```

---

## Database Schema

```
festivals        stages           artists
─────────        ──────           ───────
id               id               id
slug             festival_id      name
name             name             image_url
description      order            genre
short_desc                        bio
start_date       sets
end_date         ────
location         id
image_url        festival_id
hero_image_url   stage_id
created_at       artist_id
                 start_time
                 end_time
                 day

user_favorites   user_plan_items
──────────────   ───────────────
user_id          id
artist_id        user_id
                 festival_id
                 set_id
                 added_at
```

---

## Routes

### Public

| Route       | Component      | Notes                      |
| ----------- | -------------- | -------------------------- |
| `/login`    | `LoginPage`    | Better Auth email/password |
| `/register` | `RegisterPage` | New account creation       |

### Protected (authenticated users)

| Route             | Component            | Notes                                        |
| ----------------- | -------------------- | -------------------------------------------- |
| `/`               | `LandingPage`        | Festival grid, filterable by year            |
| `/festival/:slug` | `FestivalDetailPage` | Hero, stage tabs, day selector, plan sidebar |

### Admin (role: `admin`)

| Route                           | Component            | Notes                           |
| ------------------------------- | -------------------- | ------------------------------- |
| `/admin`                        | `AdminLayout`        | Redirects to `/admin/festivals` |
| `/admin/festivals`              | `FestivalsAdminPage` | TanStack Table, all festivals   |
| `/admin/festivals/new`          | `FestivalFormPage`   | Create festival                 |
| `/admin/festivals/:id/edit`     | `FestivalFormPage`   | Edit festival                   |
| `/admin/festivals/:id/schedule` | `ScheduleAdminPage`  | Manage stages + sets            |
| `/admin/artists`                | `ArtistsAdminPage`   | All artists table               |
| `/admin/artists/new`            | `ArtistFormPage`     | Create artist                   |
| `/admin/artists/:id/edit`       | `ArtistFormPage`     | Edit artist                     |

---

## API Endpoints

### Festivals

```
GET    /api/festivals                    List all (filterable: ?year=2026)
GET    /api/festivals/:slug              Festival + stages + sets
POST   /api/festivals                    Create (admin)
PUT    /api/festivals/:id                Update (admin)
DELETE /api/festivals/:id                Delete (admin)
```

### Stages

```
GET    /api/festivals/:id/stages         List stages for festival
POST   /api/festivals/:id/stages         Create stage (admin)
PUT    /api/stages/:id                   Update stage (admin)
DELETE /api/stages/:id                   Delete stage (admin)
```

### Artists

```
GET    /api/artists                      List all artists
GET    /api/artists/:id                  Single artist
POST   /api/artists                      Create (admin)
PUT    /api/artists/:id                  Update (admin)
DELETE /api/artists/:id                  Delete (admin)
```

### Sets

```
GET    /api/festivals/:id/sets           All sets for a festival
POST   /api/festivals/:id/sets           Create set (admin)
PUT    /api/sets/:id                     Update set (admin)
DELETE /api/sets/:id                     Delete set (admin)
```

### User (authenticated)

```
GET    /api/me/favorites                 User's favorited artists
POST   /api/me/favorites                 Add favorite { artistId }
DELETE /api/me/favorites/:artistId       Remove favorite

GET    /api/me/plans/:festivalId         User's plan for a festival
POST   /api/me/plans                     Add set to plan { festivalId, setId }
DELETE /api/me/plans/:setId              Remove set from plan
```

### Auth

```
POST   /api/auth/sign-in                 Email + password login
POST   /api/auth/sign-up                 Register new user
POST   /api/auth/sign-out                End session
GET    /api/auth/session                 Current session
```

---

## Key Features

### Conflict Detection

Two sets conflict when they are on different stages, on the same day, and their time windows overlap. Detection runs client-side in `useConflicts.ts` using `date-fns` interval comparison. Conflicts are surfaced:

- On the set card (red border + warning badge)
- In the plan sidebar (conflict banner + per-item overlap indicator)
- Via Sonner toast on add ("⚠ Conflict detected")

### Year Filtering

The landing page derives available years from `festival.start_date` values in the database. A year selector pill group appears automatically when festivals span multiple years. No hardcoded year values anywhere in the codebase.

### Theme

Dark/light mode is class-based (`.dark` on `<html>`) using your `theme.css` token system. Persisted to `localStorage` via Zustand middleware. Defaults to dark mode.

### Plan Sidebar

- **Desktop (≥1024px):** Fixed right sidebar, 340px wide, pushes main content
- **Mobile (<1024px):** Bottom sheet drawer with `border-radius: 16px 16px 0 0`
- Plan state is per-user and synced to the database when authenticated

---

## Getting Started

See [INSTALL.md](./INSTALL.md) for the full scaffolding and install sequence.

---

## Environment Variables

### `apps/web/.env.local`

```env
VITE_API_URL=http://localhost:3001
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

### `apps/api/.env`

```env
DATABASE_URL=postgresql://...          # Neon connection string
BETTER_AUTH_SECRET=your_secret_here
BETTER_AUTH_URL=http://localhost:3001
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## Development Phases

| Phase       | Scope                                                | Status     |
| ----------- | ---------------------------------------------------- | ---------- |
| **Phase 1** | Scaffold, theme, routing, Zustand stores             | 🔲 Up next |
| **Phase 2** | Neon DB, Drizzle schema, Hono API, Better Auth       | 🔲 Pending |
| **Phase 3** | LandingPage, FestivalDetailPage, schedule UI         | 🔲 Pending |
| **Phase 4** | Favorites, plan sidebar, conflict detection          | 🔲 Pending |
| **Phase 5** | Admin CRUD (festivals, stages, artists, sets)        | 🔲 Pending |
| **Phase 6** | Framer Motion transitions, mobile polish, a11y audit | 🔲 Pending |

---

## Design System

- **Font pairing:** Bebas Neue (headings, stage names, set times) + DM Sans (body, UI)
- **Brand accent:** `#f59e0b` amber — extends the shadcn/ui base theme as `--brand` / `bg-brand` / `text-brand`
- **Component library:** shadcn/ui (Radix UI primitives + your `theme.css` tokens)
- **Icon system:** Lucide React throughout
- **Radius base:** `0.625rem` (`--radius`) with sm/md/lg/xl scale
