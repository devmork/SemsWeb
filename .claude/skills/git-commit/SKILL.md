---
name: git-commit
description: Generate commit messages following Conventional Commits spec. Use when the user asks to commit, write a commit message, create a PR, or when preparing to run git commit. Triggers on "commit", "commit message", "write a PR description", "stage these changes", "conventional commits", "commit convention", "changelog". Always derives type/scope/subject from git diff — never invents context not present in the changes.
allowed-tools: Bash, Read
metadata:
  version: 1.0
---

# Git Commit — Conventional Commits Message Generator

Generate a single, spec-compliant commit message from the actual staged/unstaged diff. The message must describe *these* changes, not a guess of intent.

## Workflow

### 1. Gather change context

Run these (in parallel where possible):

```bash
git status --short
git diff --cached --stat
git diff --stat
git diff --cached          # full staged diff if reasonably sized
git log --oneline -10      # recent style / ticket conventions
```

Choose the diff source:
- If files are staged (`git diff --cached` non-empty), use staged diff only.
- Otherwise use unstaged diff (`git diff`) plus untracked files listed in `git status --short`.

Do not edit, stage, or commit files. Read-only inspection only — the user runs `git commit` themselves.

### 2. Infer type, scope, and subject from the diff

**Type** — pick the one that best matches what changed:

| Type | When |
|------|------|
| `feat` | New feature or user-visible functionality |
| `fix` | Bug fix, incorrect behavior corrected |
| `docs` | Only markdown / documentation / comments |
| `style` | Formatting, whitespace, lint — no behavior change |
| `refactor` | Code restructuring with no behavior change |
| `perf` | Performance improvement, no behavior change |
| `test` | Adding/changing tests only |
| `chore` | Build tooling, deps, gitignore, CI config, misc maintenance |
| `build` | Build system or external dependency changes |
| `ci` | CI/CD configuration, pipeline, GitHub Actions |
| `revert` | Reverts a previous commit |

When uncertain between `feat`/`refactor`/`chore`, prefer the type that matches the *observable* change. A new file that adds UI = `feat`. Renaming/moving = `refactor`. Adding `.gitignore` entry = `chore`.

**Scope** — derive from the touched paths. Use the narrowest meaningful name:

- `src/features/auth/**` → `auth`
- `src/features/evaluation-session/taking/**` → `evaluation-session` or `taking`
- `src/features/evaluation-session/management/**` → `evaluation-session` or `management`
- `src/features/user-management/**` → `user-management`
- `src/features/academic-profile/**` → `academic-profile`
- `src/config/navigation/*` → `navigation`
- `src/routes/**` → `routes` (or the role: `admin`, `qa`, `student`)
- `src/lib/**` → `lib` (or the module: `guards`, `api`, `auth`)
- `src/stores/**` → `auth-store` or `stores`
- `src/mocks/**` → `mocks`
- `src/components/ui/**` → `ui`
- `.claude/**`, `CLAUDE.md` → `claude` or `docs`
- `.github/**` → `ci`
- `package.json`, lockfiles → `deps` or `chore`

Omit scope if the change spans multiple unrelated areas or is a global concern (e.g. `chore: update dependencies`). Never force a scope that doesn't fit.

**Ticket prefix (optional)** — if recent `git log` shows a pattern like `EA-99`, `GH-123`, or branch name contains one (e.g. `EA-99-category-management`), include it as a prefix before the type:

```
EA-99 feat(qa): add category management page
```

Check branch: `git branch --show-current`. Use it if it looks like `TICKET-###-slug`. If no ticket pattern exists in history, skip it.

**Subject** — imperative mood ("add", "fix", "remove", "update"), lowercase after the type/scope, max ~72 chars, no trailing period. Describe *what* the diff does, not *why* (why goes in body).

Good: `feat(auth): add google sign-in button`
Bad: `feat: stuff`, `fix: fixed bug`, `update: changes`

### 3. Body — explain why, not what

Add a body only when the *reason* for the change isn't obvious from the subject or diff. Keep it to 1–3 short lines, imperative or present tense, wrapped at ~72 chars.

```text
feat(qa): add category management under evaluation-session

Surface categories CRUD to QA so forms can reference
them without backend schema changes.
```

Skip body for trivial changes (typo, formatting, one-line fix).

### 4. Footers

Add footers when applicable (blank line after body, one footer per line):

- **Breaking changes**: append `!` to type/scope (`feat(api)!: ...`) and add `BREAKING CHANGE: <description>` in footers.
- **Refs**: `Refs: EA-99`, `Closes: #123`, `Reviewed-by: Name`.
- **Co-authors**: only if the diff or history shows a co-author.

Omit footers entirely if none apply.

### 5. Output format

Always output **one** primary message in a fenced block ready to paste:

```markdown
```text
type(scope): subject line

Optional body explaining why.

BREAKING CHANGE: only if applicable
Refs: TICKET only if applicable
```
```

Then, if the change is ambiguous (multiple types/scopes plausible) or large, offer 1–2 alternatives with a one-line note on when each fits. Keep the primary clearly marked.

Never run `git commit`. Never stage files. The skill only produces the message text.

## Edge cases

- **No diff**: say so clearly, ask what to commit.
- **Generated files mixed in** (`routeTree.gen.ts`, lockfiles): note them as excluded from scope reasoning, but include them in the commit if already staged.
- **Mixed concerns** (feat + fix in one diff): pick the dominant type; suggest splitting into two commits if the diff clearly contains two independent changes.
- **Rename/move only**: use `refactor` unless behavior also changed.

## Examples

**Example 1 — new feature**
Input diff: new `src/features/evaluation-session/management/` files + `qa/categories.tsx` route, branch `EA-99-category-management`
Output:
```text
EA-99 feat(qa): add category management page

Expose categories CRUD under evaluation-session
so QA can manage form categories.
```

**Example 2 — bug fix**
Input diff: `src/stores/auth.store.ts` fixes `AuthUser` import
Output:
```text
fix(auth): restore AuthUser type import in store

domain.ts exports UserResponse, not AuthUser,
so the store import was breaking type-check.
```

**Example 3 — chore**
Input diff: `.gitignore` adds `.claude/` and `CLAUDE.md`
Output:
```text
chore: gitignore local claude config and CLAUDE.md
```

**Example 4 — breaking change**
Input diff: `evaluationService` endpoint changes from `/evaluation/...` to `/api/evaluation/...`
Output:
```text
feat(api)!: migrate evaluation endpoints to /api prefix

BREAKING CHANGE: clients calling /evaluation/* must
update to /api/evaluation/*; MSW handlers updated.
```
