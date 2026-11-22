# AGENTS.md

# SemsWeb — School Evaluation System

School evaluation management system (teachers + facilities feedback). Roles: **student** (takes evaluations), **qa** (manages forms/categories/questions/sessions), **admin** (manages user roles). Frontend: React 19 + TypeScript + Vite, TanStack Router/Query, Zustand, Tailwind 4, shadcn-style UI (`components.json`, style `base-vega`). No backend in this repo; API base URL is configured client-side. Sibling layout: lives at `Mark Projects/Sems/SemsWeb` next to `SemsApi` (../SemsApi) — two independent git repos under one parent folder, no root repo; local API runs at `https://localhost:7278`.

## Session start — read docs first

Before proceeding with any task (after reading this file), check the `docs/` folder first. List its contents and read the files relevant to the current task — e.g. `DESIGN_SYSTEM.md` for any UI/styling work — before writing code, modifying files, or making architectural decisions. Do not assume `docs/` contents from a previous session; re-list and re-read them each time, since they are gitignored and local-only.

## Session end — save notes to the vault

When a session produces anything worth remembering — a decision, a fix, a module built, a bug root-caused, state changes (branch, commits, open questions) — write it to the Obsidian vault **before ending the session**. The vault (`OBSIDIAN_VAULT_PATH`, real root `Sems/` one level down) is the cross-session memory; don't rely on chat history surviving.

- **Where things go:** `Projects/semsweb.md` (Recent Activity + Last overview), `Logs/YYYY-MM-DD - semsweb.md` (per-session narrative), `Daily/YYYY-MM-DD.md` (cross-project day summary), `Projects/semsweb/Architecture/` (durable architecture + ADRs), `log.md` (one-line entry). Read the relevant note first, then append via targeted patch; keep frontmatter (`ai-first: true`) and wikilinks intact.
- **What counts as "important":** decisions made, root causes, architectural constraints learned, workflow gotchas, verification results (e.g. build gate), and open/pending items. Skip trivia.
- **Then summarize** what was saved so the user sees the trail.

## Dev environment

```bash
npm install
npm run dev      # Vite dev server; HTTPS via @vitejs/plugin-basic-ssl, MSW mocking enabled
npm run build    # tsc -b && vite build  (type-checks first)
npm run lint     # eslint . (flat config: typescript-eslint + react-hooks + react-refresh)
npm run preview  # serve production bundle
```

No test runner, test directory, or `npm test` script — verify changes with `npm run lint` + `npm run build`.

Required env vars (in `.env`, gitignored): `VITE_API_URL` (API base URL), `VITE_GOOGLE_CLIENT_ID`, `VITE_GOOGLE_REDIRECT_URI`.

Path alias `@/` → `src/` (tsconfig + vite resolve alias). New routes are picked up by the TanStack Router Vite plugin; `src/routeTree.gen.ts` is generated — never hand-edit it.

## Architecture & conventions

- **Layer separation (enforced):** `src/routes/` holds file-based routes only (thin composition + guards); domain logic lives in `src/features/`, grouped by role: `qa/`, `student/`, `admin/` for role-scoped domains plus top-level `auth/` and `profile/` for cross-role ones. Every feature has the same shape — `components/`, `hooks/`, `services/*Service.ts`, `types.ts`, `index.ts` barrel (+ `stores/`, `constants.ts`, `guards.ts` when needed); reusable infrastructure in `src/shared/` (`api/`, `lib/`, `hooks/`, `layout/`, `config/`, `types/`, `components/`); shadcn primitives in `src/components/ui/`. There is no `src/app/` layer (removed Nov 2026): bootstrap (`QueryClient`, `setUnauthorizedHandler`) lives in `src/main.tsx`. Dependency direction is a DAG: `routes → features → shared → components/ui`. Shared code must not import features/routes; features must not import routes. Import features through their barrel (`@/features/qa/categories`, never an internal path); role folders are isolated from each other. ESLint's `no-restricted-imports` overrides enforce the boundaries, with one documented exception: `src/shared/layout/AuthenticatedLayout.tsx` composes auth + profile.
- **Role folders group features by audience; features inside them name domains.** Current tree: `qa/{categories,forms,sessions,reports}`, `student/evaluations`, `admin/{users,evaluation-types,facility}`; `auth` and `profile` stay top-level because all three roles use them. Same-role dependencies are allowed (`qa/reports → qa/sessions`); cross-role imports are blocked by ESLint — if two roles need the same logic, move it to `shared/`. Declared cross-feature dependencies: `profile → auth` (session read model), `student/evaluations → auth` (current user), `shared/layout/AuthenticatedLayout → auth, profile`.
- **Data fetching:** server state via TanStack Query; client state via Zustand colocated with its feature (`src/features/auth/stores/auth.store.ts`). Axios only inside feature service files — hooks call services, never Axios directly. Mutations invalidate via the `queryKeys` factory pattern (see `features/student/evaluations/hooks/useEvaluations.ts`). Service API prefix is inconsistent (`/admin/users` vs `/api/evaluation/...` vs `/api/auth/...`) — check the backend contract before adding endpoints.
- **Auth:** HttpOnly cookies (`ACCESS_TOKEN` + `REFRESH_TOKEN`), never in JS/localStorage; `useAuthStore` holds only the user profile. `src/shared/api/client.ts` is auth-agnostic: it uses `withCredentials: true`, refreshes via `POST /api/auth/refresh`, and calls an injected `setUnauthorizedHandler()` registered in `src/main.tsx`. Guards live in `src/features/auth/guards.ts` (`requireAuth`, `requireRole(...roles)`, `redirectIfAuthenticated`); home paths in `src/shared/lib/home.ts` (admin→`/admin`, qa→`/qa`, student→`/student`). `toUserRole()` in `authService.ts` normalizes role casing — always go through it. Shared user types (`UserRole`, `UserResponse`, `StudentProfile`) live in `src/shared/types/user.ts`.
- **UI:** primitives in `src/components/ui/` use `@base-ui/react` + `class-variance-authority` (`cva`) + `cn` from `src/shared/lib/utils.ts`. Icons: `lucide-react`, `@tabler/icons-react`. Check `.claude/skills/` before implementing: `/api-doc` for APIs/routes, `/new-component` for UI components (CVA/cn/forwardRef), plus `senior-frontend`/`senior-architect` workflows and `speckit-*` for spec-driven work.
- **Nav:** role nav arrays in `src/shared/config/navigation/` (`admin.nav.ts`, `qa.nav.ts`, `student.nav.ts`, `NavItem`/`NavigationItem` types); `src/features/auth/hooks/useRoleNavigation.ts` picks by role from the auth store. `AppLayout`/`AppSidebar` are presentational and receive nav items + footer as props; `src/shared/layout/AuthenticatedLayout.tsx` composes them, and `SidebarAccountMenu` lives in `features/profile/components/`.
- Commits use conventional-style messages (`feat(qa):`, `fix(auth):`, `style(css):`).

## Pitfalls

- In dev (`import.meta.env.DEV`), `restoreSession()` returns a hardcoded mock user — real auth is bypassed locally. `MOCK_DEV_USER.role` in `src/features/auth/guards.ts` controls the active role (currently `qa`).
- `src/features/auth/stores/auth.store.ts` imports `UserResponse` from `@/shared/types/user` — keep feature-local code importing the store relatively (`./stores/auth.store`) to avoid barrel cycles; other layers import `useAuthStore` from `@/features/auth`.
- QA module is partially built: `qa` has `route.tsx`, `categories.tsx`, `forms.tsx`, `forms.index/create/$formId`, `sessions.tsx`, and `reports.tsx` + `reports.facility.tsx`; the feature code lives in `features/qa/{categories,forms,sessions,reports}/` (components/hooks/services). Questions now live inside the form editor (form categories + form questions). QA work builds on `specs/001-school-evaluation-system/` (spec, plan, tasks - gitignored, local only).
- `.env`, `docs/`, `specs/`, `.specify/`, `.claude/` are gitignored — local-only content; don't assume it's committed or available on other machines.
- `npm run dev` serves HTTPS (basic-ssl) — accept the self-signed cert on first visit; the MSW worker lives in `public/` (`workerDirectory` in package.json `msw` field).
