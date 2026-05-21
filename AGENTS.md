# AGENTS.md

## Caveman Mode (always on)

Terse like caveman. Technical substance exact. Only fluff die.
Drop: articles, filler (just/really/basically), pleasantries, hedging.
Fragments OK. Short synonyms. Code unchanged.
Pattern: [thing] [action] [reason]. [next step].
ACTIVE EVERY RESPONSE. No revert after many turns. No filler drift.
Code/commits/PRs: normal. Off: "stop caveman" / "normal mode".

## Project Overview

**Finance** — a personal finance web application built with TanStack Start (early stage scaffold). Currently has authentication (login/logout via React Context + localStorage) and a placeholder Dashboard. The backend will be a separate GraphQL service consumed via Apollo Client.

## Commands

| Command | Description |
|---|---|
| `pnpm dev` | Start dev server (port 3000) |
| `pnpm build` | Production build (Nitro server output in `dist/`) |
| `pnpm preview` | Preview production build |
| `pnpm test` | Run tests once (`vitest run`) |
| `pnpm check` | Biome check (format + lint) |
| `pnpm format` | Format code with Biome |
| `pnpm lint` | Lint with Biome |

There is **no typecheck script** in `package.json`. To check types, run:
```bash
npx tsc --noEmit
```

## Tech Stack

- **Framework:** TanStack Start (file-based routing) with Vite + Nitro server adapter
- **Router:** TanStack Router (latest — file-based, type-safe, SSG preload)
- **UI:** React 19.2+, Tailwind CSS 4, shadcn/ui (Radix primitives), Lucide React
- **Data Fetching:** Apollo Client 4 (GraphQL) — configured but not yet connected to components
- **Styling Variants:** Class Variance Authority (CVA)
- **Class Merging:** `cn()` utility (`clsx` + `tailwind-merge`) from `#/lib/utils`
- **Linting/Formatting:** Biome 2.4.5 (no ESLint, no Prettier) — tabs, double quotes
- **Testing:** Vitest 4 + Testing Library (jsdom)
- **Fonts:** Inter (sans), JetBrains Mono (mono) — loaded via Tailwind CSS 4 theme
- **Package Manager:** pnpm

## Directory Structure

```
src/
├── router.tsx             # TanStack Router factory (getRouter)
├── routeTree.gen.ts       # Auto-generated route tree (do not edit)
├── styles.css             # Tailwind 4 + design tokens + shadcn vars
├── components/
│   ├── login/             # Login form (email, password)
│   ├── dashboard/         # Dashboard placeholder (header + welcome)
│   └── ui/                # shadcn/ui primitives (Button, Field, Input, Select, etc.)
│       └── *.test.tsx     # Component tests co-located with UI primitives
├── hooks/
│   └── useAuth.tsx        # Auth context + localStorage persistence
├── lib/
│   ├── apollo.ts          # Apollo Client setup (GraphQL)
│   └── utils.ts           # cn() utility (clsx + tailwind-merge)
└── routes/
    ├── __root.tsx         # Root route (HTML shell, meta, AuthProvider, devtools)
    └── index.tsx          # Home route (auth gating: Dashboard | Login)
```

## Code Conventions

### Component Patterns

- **One component per directory:** Each component lives in its own folder with an `index.tsx` file. Import directly from the folder path (no barrel/index files).
  ```typescript
  import { Login } from "#/components/login";
  import { Button } from "#/components/ui/button";
  ```
- **No barrel exports:** Each directory exports its component directly. No re-export files.
- **Props typing:** Use inline `type` declarations (not `interface`). Prefix unused params with `_`.
  ```typescript
  type InputProps = React.ComponentProps<"input"> & {
    label?: string;
    helper?: string;
    type?: FieldType;
  };
  ```
- **shadcn/ui components:** Base components in `src/components/ui/` use CVA for variants, have `data-slot` attributes, use `React.forwardRef`, and export both the component and variant definitions.
- **`use client` NOT needed:** TanStack Start doesn't use RSC. All components are client-side by default.

### React & TypeScript Rules

- **No unused variables:** TypeScript `noUnusedLocals` and `noUnusedParameters` enforced at error level.
- **No React import needed:** JSX transform is automatic (React 19+).
- **No explicit return types required:** Functions can infer their return types.
- **Strict mode enabled:** `strict: true` in tsconfig.json.
- **Rules of Hooks:** Followed strictly — only call hooks at top level, only from React functions.
- **Exhaustive dependencies:** `useEffect`/`useCallback`/`useMemo` must list all dependencies.

### Naming

| Category | Convention | Example |
|---|---|---|
| Components | PascalCase | `Login`, `Dashboard`, `Button` |
| Hooks | camelCase, `use` prefix | `useAuth` |
| Types | PascalCase | `InputProps`, `FieldType` |
| Enums | PascalCase, `Enum` suffix preferred | `FieldType` |
| Files/folders | kebab-case | `label-button.tsx`, `select-field.tsx` |
| Route files | TanStack conventions | `__root.tsx`, `index.tsx` |

### Imports

Two import aliases available — **prefer `#/`** (shorter, standard TanStack convention):

```typescript
// Group 1: external packages
import { createContext, useCallback, useContext, useState } from "react";
import { Lock, Mail, User } from "lucide-react";

// Group 2: internal (#/ alias preferred)
import { cn } from "#/lib/utils";
import { Field } from "#/components/ui/field";
import { useAuth } from "#/hooks/useAuth";

// Group 3: relative imports (sibling, parent)
import appCss from "../styles.css?url";
import { Field, FieldType } from "./field";
```

- Biome `organizeImports` sorts and groups imports automatically.
- Both `#/*` and `@/*` resolve to `./src/*`. Use `#/` for new code.

### Styling

- **Tailwind CSS 4** with `@theme inline` blocks in `src/styles.css`
- **Design tokens** from Figma "Financy (Community)" — defined as CSS custom properties in the Tailwind theme
  - **Brand:** `brand-dark` (#124b2b), `brand-base` (#1f6f43)
  - **Semantic colors:** Blue, Green, Orange, Pink, Purple, Red, Yellow (each with dark/base/light)
  - **Typography scale:** `display-xl`, `display-lg`, `heading-lg`, `heading-md`, `body-lg`, `body-md`, `caption-sm`
  - **Feedback:** `danger` (#ef4444), `success` (#19ad70)
- **shadcn design tokens** in `:root` (neutral palette, primary mapped to brand-base)
- **CVA** used for component variants (e.g., `Button` has `variant` and `size`)
- Always use the `cn()` utility for combining classes — never raw `clsx` or `twMerge`

### State Management

| State | Mechanism |
|---|---|
| Auth | React Context + `localStorage` via `useAuth` hook |
| Forms | Local `useState` per input field |
| Server data | Apollo Client (GraphQL) — configured, not yet used |
| URL state | TanStack Router (file-based, type-safe) |

### Data Fetching

- **Apollo Client** (`src/lib/apollo.ts`): Configured with `InMemoryCache`, connects to `VITE_BACKEND_URL` env var.
- **No server functions yet:** TanStack Start's `createServerFn` is available but not used.
- **No loaders yet:** TanStack Router loaders available but not used.

### Auth

- **Fake auth:** `useAuth().login(email, password)` ignores credentials — sets `isAuthenticated = true` immediately.
- **Persistence:** `localStorage` key `"finance:auth"` stores `"true"`/`"false"`.
- **SSR safety:** `loadAuth()` returns `false` on server, reads `localStorage` on client.
- **Route gating:** `src/routes/index.tsx` renders `Dashboard` or `Login` based on `isAuthenticated`.
- **No middleware/server auth yet.** This is scaffolding ready for real auth integration.

## Environment Variables

Single env var — prefix with `VITE_` (Vite convention for client-exposed vars):

```bash
VITE_BACKEND_URL=http://localhost:4000/graphql
```

- `.env.example` exists — copy to `.env` for local development.
- Used in `src/lib/apollo.ts` via `import.meta.env.VITE_BACKEND_URL`.

## Testing

**Framework:** Vitest 4 + Testing Library (jsdom)

### Test File Location
- UI component tests co-located: `src/components/ui/field.test.tsx`
- Run: `pnpm test` (vitest run)

### Config (`vitest.config.ts`)
- Environment: `jsdom`
- Globals: `true`
- Setup: `vitest.setup.ts` (imports `@testing-library/jest-dom/vitest`)
- Aliases: `#` and `@` → `./src`

### Testing Conventions

| Rule | Severity | Description |
|---|---|---|
| Use `it()` not `test()` | Error | `consistent-test-it` with `fn: 'it'` |
| Top-level `describe` required | Error | All tests wrapped in `describe` block |
| Valid test titles | Error | No empty or duplicate titles |
| No disabled tests | Warn | `.skip` only temporary |
| No duplicate hooks | Error | Unique `beforeEach`/`afterEach` per describe |
| Padding around blocks | Error | Blank lines before/after `describe`, `it`, `beforeEach` |

### Testing Library Best Practices

| Rule | Severity | Description |
|---|---|---|
| Prefer `findBy` queries | Error | Use `findBy*` over `waitFor(() => getBy*())` |
| No unnecessary `act()` | Error | RTL handles updates internally |
| No awaiting sync events | Error | Only `userEvent` promises should be awaited |
| Prefer screen queries | Warn | Use `screen.getBy*` over `container.getBy*` |
| Prefer `userEvent` | Warn | Use `@testing-library/user-event` over `fireEvent` |
| Await async queries | Warn | Always `await` for `findBy*` and `waitFor*` |
| No debug utilities | Warn | Remove `.debug()`, `logRoles()` before commit |

## Linting & Formatting

- **Biome only** — no ESLint, no Prettier.
- Run `pnpm check` before committing.
- Run `pnpm format` to auto-format, `pnpm lint` to check.

### Biome Config (`biome.json`)
- **Indent:** Tabs
- **Quotes:** Double quotes (JS)
- **Organize imports:** On (automatic sorting)
- **Linter:** Recommended rules
- **Excluded files:** `src/routeTree.gen.ts`, `src/styles.css`

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

### JSX Props

Sort by line length ascending (shortest first):

```tsx
<Input
  type={FieldType.email}
  label="Email"
  placeholder="you@example.com"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

### Union Types & Enums

Sort by line length ascending:
```typescript
enum FieldType {
  email = "email",
  password = "password",
  text = "text",
  user = "user",
}
```

## Routing

**File-based routing** via TanStack Router. Routes live under `src/routes/`.

### Conventions

| File | Route | Purpose |
|---|---|---|
| `__root.tsx` | (root shell) | HTML document, meta, providers, devtools |
| `index.tsx` | `/` | Home page |
| `about.tsx` | `/about` | About page |
| `_layout.tsx` | (layout) | Layout wrapper (prefix with `_`) |

- Adding a new file automatically registers the route (via `routeTree.gen.ts`).
- Use `Link` from `@tanstack/react-router` for client-side navigation:
  ```tsx
  import { Link } from "@tanstack/react-router";
  <Link to="/about">About</Link>
  ```
- Server functions available via `createServerFn` from `@tanstack/react-start`.
- API routes available via `createFileRoute` with `server.handlers`.

## Git Conventions

- Commits are lowercase, descriptive, in English (no conventional commit prefixes).
- Branch strategy: single `main` branch.
- Follow existing style: describe what was done.

## Design System

**Source:** Figma file "Financy (Community)" — extracted tokens live in:
- `src/styles.css` — CSS custom properties + Tailwind 4 theme
- `SKILL.md` — TypeUI skill for agentic design-system workflows
- `DESIGN.md` — Raw Figma extraction (color tokens, typography, spacing)

### Design Rules (from SKILL.md)
- Use extracted color tokens before introducing one-off values
- Define all interaction states: default, hover, focus-visible, active, disabled, loading
- Do not remove focus-visible indicators or keyboard support
- Target WCAG 2.2 AA accessibility

## Key Patterns

### Auth Gating
The home route (`index.tsx`) checks `useAuth().isAuthenticated` and renders either `Dashboard` or `Login`. Add route guards for new protected routes — use the auth context.

### GraphQL Integration (planned)
Apollo Client is configured in `src/lib/apollo.ts`. To add queries:
1. Define mutation/query in the relevant component/hook
2. Use Apollo's `useQuery`/`useMutation` hooks
3. The backend URL is from `import.meta.env.VITE_BACKEND_URL`

### TanStack Start Server Functions
Use `createServerFn` for server-side logic:
```typescript
import { createServerFn } from "@tanstack/react-start";

const getData = createServerFn({ method: "GET" }).handler(async () => {
  // server-side code
  return data;
});
```

## Build & Deployment

- **Build:** `pnpm build` → produces `dist/server/index.mjs` (self-contained Nitro server)
- **Deploy:** `node dist/server/index.mjs` — works on any Node-compatible host (Render, Fly.io, VPS)
- **Production preview:** `pnpm preview` (runs `vite preview`)
- For host-specific presets (Vercel, Netlify, Cloudflare), see https://v3.nitro.build/deploy

## Important Gotchas

1. **Fake auth:** `login()` ignores email/password. Backend integration needed for real auth.
2. **No real data:** Apollo Client is configured but no GraphQL queries/mutations exist yet.
3. **No database:** No ORM, schema, or migrations. Backend is a separate service.
4. **`routeTree.gen.ts` is auto-generated:** Never edit manually. Regenerated on dev server start.
5. **`src/styles.css` excluded from Biome:** Design token file has long CSS blocks that shouldn't be linted.
6. **DevTools visible in all environments:** TanStack DevTools and Router DevTools are rendered unconditionally in `__root.tsx` — no production guard.
7. **TypeScript 6 + Vite 8:** This is a bleeding-edge stack. Some type definitions may be unstable.
8. **Nitro nightly:** The `nitro` dependency is `npm:nitro-nightly@latest` — may change between installs.
9. **No error boundaries:** Add `ErrorBoundary` components for production resilience.
10. **No loading states:** No `Suspense` boundaries or loading skeletons exist yet.
11. **pnpm only:** `pnpm-lock.yaml` is checked in. Don't use npm or yarn.
12. **No `.env` in git:** `.env` is gitignored. Use `.env.example` as template.
