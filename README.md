# Finance

Personal finance web application.

## Structure

```
finance/                  # monorepo root
├── frontend/             # TanStack Start SPA (React 19)
│   ├── src/              # frontend source code
│   ├── public/           # static assets
│   ├── e2e/              # Playwright E2E tests
│   ├── package.json
│   ├── vite.config.ts
│   └── ...
├── backend/              # backend service (placeholder)
├── package.json          # workspace root scripts
├── pnpm-workspace.yaml
└── pnpm-lock.yaml
```

## Commands

| Command | Description |
|---|---|
| `pnpm dev` | Start frontend dev server (port 3000) |
| `pnpm build` | Production build |
| `pnpm test` | Run unit tests (Vitest) |
| `pnpm test:e2e` | Run E2E tests (Playwright) |
| `pnpm typecheck` | TypeScript type check |
| `pnpm lint` | Biome lint |
| `pnpm format` | Biome format |
| `pnpm check` | Biome check (lint + format) |

All commands proxy to the `frontend` workspace automatically.

## Stack

- **Framework:** TanStack Start (Vite + Nitro)
- **UI:** React 19, Tailwind CSS 4, shadcn/ui
- **Data:** Apollo Client (GraphQL)
- **Testing:** Vitest + Testing Library, Playwright
- **Linting:** Biome
