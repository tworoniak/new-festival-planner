# 🎪 SetList — Festival Planner

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
| Zustand               | ^5      | Client state (theme)                                  |
| TanStack Query        | ^5      | Server state, data fetching & caching                 |
| React Hook Form       | ^7      | Form state management                                 |
| Zod                   | ^3      | Schema validation (forms + API)                       |
| date-fns              | ^3      | Date formatting & conflict detection                  |
| clsx + tailwind-merge | latest  | Conditional classname utility                         |

### Backend (`apps/api`)

| Technology  | Version | Purpose                                    |
| ----------- | ------- | ------------------------------------------ |
| Hono        | ^4      | API server (edge-native, TypeScript-first) |
| Neon        | latest  | Serverless PostgreSQL database             |
| Drizzle ORM | ^0.30   | Type-safe query builder + migrations       |
| Better Auth | ^1      | Authentication (email/password, sessions)  |
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
│   │   │   ├── components/
│   │   │   │   ├── layout/
│   │   │   │   │   └── ThemeToggle.tsx
│   │   │   │   └── plan/
│   │   │   │       └── PlanSidebar.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useFestivals.ts
│   │   │   │   ├── useFestival.ts
│   │   │   │   ├── useFavorites.ts
│   │   │   │   ├── usePlan.ts
│   │   │   │   ├── useAdminFestivals.ts
│   │   │   │   ├── useAdminArtists.ts
│   │   │   │   └── useAdminSchedule.ts
│   │   │   ├── lib/
│   │   │   │   ├── auth-client.ts
│   │   │   │   ├── queryClient.ts
│   │   │   │   └── utils.ts
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
│   │   │   │   ├── index.tsx
│   │   │   │   └── ProtectedRoute.tsx
│   │   │   ├── store/
│   │   │   │   └── themeStore.ts
│   │   │   ├── styles/
│   │   │   │   └── theme.css
│   │   │   ├── App.tsx
│   │   │   └── main.tsx
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   ├── components.json
│   │   └── tsconfig.json
│   │
│   └── api/                              # Hono API server
│       ├── src/
│       │   ├── db/
│       │   │   ├── schema.ts
│       │   │   ├── client.ts
│       │   │   ├── seed.ts
│       │   │   └── migrations/
│       │   ├── routes/
│       │   │   ├── auth.ts
│       │   │   ├── festivals.ts
│       │   │   ├── stages.ts
│       │   │   ├── artists.ts
│       │   │   ├── sets.ts
│       │   │   ├── favorites.ts
│       │   │   └── plans.ts
│       │   ├── middleware/
│       │   │   ├── auth.ts
│       │   │   └── adminOnly.ts
│       │   └── index.ts
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
├── package.json
├── pnpm-workspace.yaml
└── tsconfig.base.json
```

---

## Database Schema

```
festivals        stages           artists
─────────        ──────           ───────
id (uuid)        id (uuid)        id (uuid)
slug             festival_id      name
name             name             image_url
description      order            genre
short_desc                        bio
start_date       sets             created_at
end_date         ────
location         id (uuid)        users (Better Auth)
image_url        festival_id      ──────────────────
hero_image_url   stage_id         id
created_at       artist_id        name
                 start_time       email
                 end_time         email_verified
                 day              role
                                  image
user_favorites   user_plan_items  created_at
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
| `/admin/festivals`              | `FestivalsAdminPage` | All festivals table             |
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
GET    /api/festivals              List all (filterable: ?year=2026)
GET    /api/festivals/:slug        Festival + stages + sets
POST   /api/festivals              Create (admin)
PUT    /api/festivals/:id          Update (admin)
DELETE /api/festivals/:id          Delete (admin)
```

### Stages

```
GET    /api/stages?festivalId=     List stages for festival
POST   /api/stages                 Create stage (admin)
PUT    /api/stages/:id             Update stage (admin)
DELETE /api/stages/:id             Delete stage (admin)
```

### Artists

```
GET    /api/artists                List all artists
GET    /api/artists/:id            Single artist
POST   /api/artists                Create (admin)
PUT    /api/artists/:id            Update (admin)
DELETE /api/artists/:id            Delete (admin)
```

### Sets

```
GET    /api/sets?festivalId=       All sets for a festival
POST   /api/sets                   Create set (admin)
PUT    /api/sets/:id               Update set (admin)
DELETE /api/sets/:id               Delete set (admin)
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
POST   /api/auth/sign-up           Register new user
POST   /api/auth/sign-in/email     Email + password login
POST   /api/auth/sign-out          End session
GET    /api/auth/get-session       Current session
```

---

## Key Features

### Conflict Detection

Two sets conflict when they are on different stages, on the same day, and their time windows overlap. Detection runs client-side using `date-fns` interval comparison. Conflicts are surfaced on the set card (red border + warning badge), in the plan sidebar (conflict banner + per-item overlap indicator), and via Sonner toast on add.

### Year Filtering

The landing page derives available years from `festival.start_date` values in the database. A year selector pill group appears automatically when festivals span multiple years. No hardcoded year values anywhere in the codebase.

### Theme

Dark/light mode is class-based (`.dark` on `<html>`) using a shadcn/ui-compatible CSS variable token system. Persisted to `localStorage` via Zustand. Defaults to dark mode. Amber brand accent (`#f59e0b`) extends the base theme as a custom `--brand` token mapped to Tailwind utilities.

### Plan Sidebar

- **Desktop (≥1024px):** Fixed right sidebar, 320px wide
- **Mobile (<1024px):** Bottom sheet drawer with rounded top corners + backdrop
- Plan state is per-user and persisted to the database via `user_plan_items`

### Auth Pages

Full-bleed festival crowd hero image with frosted glass form card overlay. Animated gradient wordmark. Browser autofill styled to match the glassmorphism aesthetic.

### Admin Panel

Role-gated to `admin` users. Left sidebar navigation. Festivals and artists management with inline delete confirmation. Schedule page with split stages/sets layout, day tab selector, and inline create forms for both stages and sets.

---

## Getting Started

### Prerequisites

```bash
node --version   # 20+ required
pnpm --version   # 9+ required
```

### Install

```bash
git clone https://github.com/tworoniak/setlist
cd festival-planner
pnpm install
```

### Environment variables

Create `apps/api/.env`:

```env
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=your_secret_here
BETTER_AUTH_URL=http://localhost:3001
WEB_URL=http://localhost:3000
```

Create `apps/web/src/.env.local`:

```env
VITE_API_URL=http://localhost:3001
```

### Database

```bash
cd apps/api
pnpm db:migrate
pnpm db:seed      # optional — loads 3 sample festivals
```

### Dev

```bash
# From monorepo root
pnpm dev          # starts web (:3000) and api (:3001) in parallel
```

### Admin access

After registering, open Drizzle Studio and set your user's `role` to `admin`:

```bash
cd apps/api
pnpm db:studio
```

---

## Development Phases

| Phase       | Scope                                                    | Status      |
| ----------- | -------------------------------------------------------- | ----------- |
| **Phase 1** | Scaffold, theme, routing, Zustand stores                 | ✅ Complete |
| **Phase 2** | Neon DB, Drizzle schema, Hono API, Better Auth           | ✅ Complete |
| **Phase 3** | LandingPage, FestivalDetailPage, plan sidebar, dark mode | ✅ Complete |
| **Phase 4** | Persist favorites + plan to database per user            | ✅ Complete |
| **Phase 5** | Admin CRUD — festivals, stages, artists, sets            | ✅ Complete |
| **Phase 6** | Framer Motion transitions, mobile polish, a11y audit     | 🔲 Pending  |

---

## Design System

- **Font pairing:** Bebas Neue (display) + DM Sans (body/UI)
- **Brand accent:** `#f59e0b` amber — `--brand` / `bg-brand` / `text-brand` Tailwind utilities
- **Animated gradient:** CSS keyframe utility class `animated-gradient-text` used on the SetList wordmark
- **Component library:** shadcn/ui (Radix UI primitives)
- **Icon system:** Lucide React throughout
- **Radius base:** `0.625rem` with sm/md/lg/xl scale
- **Auth pages:** Glassmorphism card (`bg-white/10 backdrop-blur-md`) over full-bleed hero
