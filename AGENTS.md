# AGENTS.md

## Caveman Mode (always on)

Terse like caveman. Technical substance exact. Only fluff die.
Drop: articles, filler (just/really/basically), pleasantries, hedging.
Fragments OK. Short synonyms. Code unchanged.
Pattern: [thing] [action] [reason]. [next step].
ACTIVE EVERY RESPONSE. No revert after many turns. No filler drift.
Code/commits/PRs: normal. Off: "stop caveman" / "normal mode".

## Project Overview

**Finance** — a personal finance web application.
Monorepo (pnpm workspace) with separate frontend and backend packages.

```
finance/
├── frontend/      # TanStack Start SPA (React 19, Apollo Client)
│   ├── src/       # source code
│   ├── e2e/       # Playwright tests
│   └── AGENTS.md  # frontend-specific conventions & rules
├── backend/       # GraphQL service (placeholder)
└── pnpm-workspace.yaml
```

## Commands

| Command | Description |
|---|---|
| `pnpm dev` | Start frontend dev server (port 3000) |
| `pnpm build` | Production build |
| `pnpm preview` | Preview production build |
| `pnpm test` | Run unit tests (Vitest) |
| `pnpm test:e2e` | Run E2E tests (Playwright) |
| `pnpm typecheck` | TypeScript type check |
| `pnpm format` | Format code with Biome |
| `pnpm lint` | Lint with Biome |
| `pnpm check` | Biome check (format + lint) |

All commands proxy via `pnpm --filter <package> <cmd>`.

## Per-package Conventions

- **`frontend/AGENTS.md`** — React/TanStack Start conventions, component patterns, styling, testing, routing
- **`backend/`** — not yet created

## Git Conventions

- Commits are lowercase, descriptive, in English (no conventional commit prefixes).
- Branch strategy: single `main` branch.
- `.githooks/pre-commit` runs `pnpm lint && pnpm typecheck && pnpm test:changed && pnpm test:e2e`.

## Environment Variables

```
VITE_BACKEND_URL=http://localhost:4000/graphql
```

- `.env` files live inside each workspace package.
- Workspace-wide envs go in root (none yet).

## Important

1. **pnpm only** — lockfile checked in. Don't use npm or yarn.
2. **No `.env` in git** — use `.env.example` as template.
3. **`.githooks/`** at root — `core.hooksPath` set via `prepare` script.

### Formatting & Style

| Rule | Value | Notes |
|---|---|---|
| Quotes | **Double quotes** (`"`) | Enforced by Biome formatter |
| Indent | **Tabs** | Enforced by Biome formatter |
| Trailing commas | **Always** | Add comma to last items in multiline objects/arrays/params |
| Semicolons | **Always** | Enforced by Biome formatter |
| Bracket spacing | **True** | `{ key: value }` not `{key: value}` |
| JSX quotes | **Double quotes** | `className="foo"` not `className='foo'` |
| Console | **No `console.log` in production code** | Warn-level; remove before shipping |

## Git Conventions

- Commits are lowercase, descriptive, in English (no conventional commit prefixes).
- Branch strategy: single `main` branch.
- Follow existing style: describe what was done.
- gitflow

## Clean Code Conventions

- **Single Responsibility:** Each function, component, and module should do one thing and do it well.
- **Descriptive Naming:** Use meaningful names that reveal intent. Avoid abbreviations, single-letter variables (except in loops), and cryptic names.
- **Small Functions:** Keep functions short and focused. If a function does more than one thing, extract parts into separate functions.
- **DRY (Don't Repeat Yourself):** Extract repeated logic into reusable functions, hooks, or utilities.
- **Pure Functions:** Prefer pure functions without side effects. Isolate side effects (API calls, DOM manipulations) into dedicated functions/hooks.
- **Early Returns:** Use guard clauses and early returns to reduce nesting and improve readability.
- **Magic Numbers/Strings:** Extract magic values into named constants or enums.
- **Comments:** Code should be self-documenting. Use comments only for complex business logic or explaining *why*, not *what*.
- **Error Handling:** Handle errors explicitly. Don't swallow exceptions. Return meaningful error messages.
- **Immutability:** Prefer immutable data patterns. Don't mutate props or state directly.
- **Composition over Inheritance:** Build complex UIs by composing smaller, reusable components.
