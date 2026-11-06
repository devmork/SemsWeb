# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies
npm install

# Start dev server (Vite with HTTPS via @vitejs/plugin-basic-ssl)
npm run dev

# Type-check + production build
npm run build

# Lint (ESLint flat config: typescript-eslint + react-hooks + react-refresh)
npm run lint

# Build + serve production bundle locally
npm run preview

# TypeScript / Vite config files are type-checked by tsc at build time (npm run build runs tsc -b && vite build)
```

There is no test runner, no test directory, and no `npm test` script in this repository.

## Project Overview

SemsWeb is a school evaluation management system that collects structured feedback on teachers and facilities. Three roles: **student** (takes evaluations), **qa** (manages forms/categories/questions/sessions), **admin** (manages user roles).

## Architecture

TypeScript frontend: React 19 + TanStack Router + TanStack Query + Zustand + Tailwind CSS (via @tailwindcss/vite plugin) + Vite.

### Layer Separation (enforced)

```
src/
├── routes/             # TanStack Router file-based routes, route guards
├── features/           # Domain logic per feature (components, hooks, service, types)
├── components/ui/      # Shared UI primitives (base-ui, CVA, cn)
├── shared/             # Cross-cutting layout + hooks (AppLayout, sidebar, useRoleNavigation)
├── config/navigation/  # Role-based nav definitions (admin.nav.ts, qa.nav.ts, student.nav.ts)
├── lib/                # API client, auth guards, utils (cn)
├── stores/             # Zustand stores
├── types/domain.ts     # Central domain types (UserRole, UserResponse, StudentProfile)
├── mocks/              # MSW handlers for dev
└── hooks/              # Shared React hooks (useIsMobile)
```

**Rule:** Feature files import from shared/lib/shared/stores/types. Never import across sibling features. Shared code never imports from features.

### Auth Pattern

- Tokens are **HttpOnly cookies** (ACCESS_TOKEN + REFRESH_TOKEN) — never stored in JS/localStorage. The Zustand `useAuthStore` holds only the user profile, never tokens.
- `api` (Axios instance in `src/lib/api.ts`) uses `withCredentials: true`. A response interceptor auto-retries 401s by calling `POST /api/auth/refresh` (cookie rotation) — the retry needs no header changes because the new cookie is already set.
- `src/lib/guards.ts` provides route guards:
  - `requireAuth()` — redirects to `/login` if no user
  - `requireRole(...roles)` — redirects to `/forbidden` if role not allowed
  - `redirectIfAuthenticated()` — redirects authenticated users to their home path
- In dev (`import.meta.env.DEV`), `restoreSession()` returns a hardcoded mock user — real auth is bypassed locally. `MOCK_DEV_USER.role = "student"` by default.
- Environment variable: `VITE_API_URL` — base URL for the Axios instance.

### Data Fetching Pattern

- **Server state**: TanStack Query (`useQuery`, `useMutation`)
- **Client state**: Zustand stores
- **Service layer**: Axios calls isolated in `feature/service/*Service.ts` — feature hooks call services, never Axios directly
- **Mutation invalidation**: After mutations, hooks invalidate query keys (`queryKeys` factory pattern, see `useEvaluations.ts`)

### Role-Based Navigation

Navigation is defined per role in `src/config/navigation/`:

- `admin.nav.ts` — admin nav items
- `qa.nav.ts` — QA nav items
- `student.nav.ts` — student nav items
- `NavItem` type: `{ label: string, href: string, icon: LucideIcon }`

`useRoleNavigation` hook reads the user's role from the auth store and returns the matching nav array. Home paths are defined in `src/lib/home.ts`: admin → `/admin`, qa → `/qa`, student → `/student`.

### Component Conventions

- UI primitives use `@base-ui/react` + `class-variance-authority` (`cva`) + `cn` from `src/lib/utils.ts`
- Icons: `lucide-react` and `@tabler/icons-react`
- Path alias `@/` maps to `src/` (configured in tsconfig + vite)

### Known Issues / Gotchas

- **`AuthUser` vs `UserResponse` type mismatch**: `src/stores/auth.store.ts` imports `AuthUser` from `@/types/domain`, but `domain.ts` defines `UserResponse` (no `AuthUser` export). The codebase has seen commits that removed/restored `AuthUser` in attempts to fix admin bypass. Verify the import before editing the auth store.
- **Admin API path inconsistency**: `useUsers.ts` calls `/admin/users` while `evaluationService.ts` calls `/api/evaluation/...`. The auth service uses `/api/auth/...`. There is no single API prefix convention enforced — check the backend contract before adding new endpoints.
- **Role casing**: `toUserRole()` in `authService.ts` normalizes role strings to lowercase. The backend may return different casing — always normalize through this function.
- **QA module is largely unbuilt**: The `qa` route currently only has a layout route (`route.tsx`) with no child pages. The "management" subfolder of `evaluation-session` is empty. QA features (categories, questions, form templates, sessions) need to be created from scratch.

## Skills

**Always check for relevant skills before executing any command or generating code.** Before starting work, check if a skill exists in `.claude/skills/` that matches the task:

- `/api-doc` — use when documenting APIs, routes, or service endpoints
- `/new-component` — use when creating new UI components (CVA, cn, forwardRef patterns enforced)

If a skill matches the task, invoke it via the Skill tool and follow its instructions. Do not proceed with ad-hoc implementation when a skill covers the workflow.

For sub-agents (code review, UI review), dispatch via the Agent tool:

- `code-reviewer` — for reviewing changes for correctness, conventions, layer separation
- `ui-reviewer` — for checking accessibility, contrast, focus, design-system consistency
