# Backend Architecture & Stack

## 1. Overview

Personal finance app backend. Serves GraphQL API for tracking income/expense transactions per user. Monorepo package (`backend/`) — frontend at `frontend/`.

Four responsibilities:
- User management (create, list, fetch)
- Transaction CRUD (income & expense records)
- Data validation (GraphQL schema level)
- N+1 query prevention (DataLoader)

## 2. Tech Stack

| Tool | Version | Why |
|---|---|---|
| **Node.js** | 22+ (ESM) | `"type": "module"` — native ESM, no transpile step for dev |
| **Apollo Server 4** | ^4.11.3 | Standalone mode — zero-config HTTP GraphQL server, no Express needed |
| **GraphQL** | ^16.11 | Schema-first API — strict contract between frontend/backend |
| **graphql-tag** | ^2.12.6 | `gql` template literal — SDL syntax highlighting, no build step |
| **Prisma 6** | ^6.6.0 | Type-safe ORM — auto-generated client from schema, migration tooling |
| **SQLite** | (Prisma) | Zero-dependency DB — dev-only, file-based, no server process |
| **DataLoader** | ^2.2.3 | Batch + cache for user fetches — prevents N+1 in resolvers |
| **TypeScript** | ^5.8.3 | Strict mode — `noUnusedLocals`, `noUncheckedSideEffectImports`, `verbatimModuleSyntax` |
| **tsx** | ^4.19.4 | TypeScript execution — `tsx watch` for hot-reload dev server |
| **Biome** | ^2.4.5 | Lint + format — fast, no plugins, single binary |

**Not used:** Express, REST, auth middleware, testing framework, codegen.

## 3. Project Structure

```
backend/
├── .env                    # DATABASE_URL (file:./dev.db)
├── .env.example            # Template for env vars
├── biome.json              # 2-space indent, double quotes, semicolons
├── package.json            # ESM, scripts, dependencies
├── tsconfig.json           # NodeNext, @/ alias → ./src/*
├── prisma/
│   ├── schema.prisma       # Data model (User, Transaction)
│   ├── dev.db              # SQLite database (gitignored)
│   └── migrations/         # Migration history
│       └── 20260522224341_init/
│           └── migration.sql
└── src/
    ├── index.ts            # Entry point — Apollo server boot
    ├── lib/
    │   └── prisma.ts       # Prisma Client singleton
    ├── loaders/
    │   └── index.ts        # DataLoader definitions
    ├── resolvers/
    │   └── index.ts        # Query/Mutation/Type resolvers
    ├── schema/
    │   └── typeDefs.ts     # GraphQL SDL
    ├── services/
    │   ├── user.ts         # User business logic
    │   └── transaction.ts  # Transaction business logic
    └── types/
        ├── graphql.ts      # Manual TS types (mirrors SDL)
        └── index.ts        # GraphQLContext type
```

## 4. Architecture Layers

```
Request
  │
  ▼
Apollo Server (port 4000) ── src/index.ts
  │
  ├── Schema ────────────── src/schema/typeDefs.ts  (SDL strings)
  │
  ├── Resolvers ─────────── src/resolvers/index.ts
  │     │
  │     ├── Query.*  ────── delegates to services/*
  │     ├── Mutation.* ──── delegates to services/*
  │     ├── User.* ──────── Transaction.user resolves via DataLoader
  │     └── Transaction.* ─ User.transactions resolves via service
  │
  ├── Services ──────────── src/services/*
  │     │
  │     ├── user.ts ─────── Prisma CRUD on users table
  │     └── transaction.ts  Prisma CRUD on transactions table
  │
  ├── Loaders ───────────── src/loaders/index.ts
  │     │
  │     └── DataLoader ──── batchUsers(): batched user fetches
  │
  └── Prisma Client ─────── src/lib/prisma.ts
        │
        └── SQLite ──────── prisma/dev.db
```

### 4.1 Entry Point (`src/index.ts`)

Trivial bootstrap, 20 lines.

```ts
const server = new ApolloServer({ typeDefs, resolvers });

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async () => ({
    loaders: createLoaders(), // fresh DataLoader per request
  }),
});
```

Key detail: **`createLoaders()` called per request**. This ensures DataLoader cache is scoped to a single GraphQL request — no stale data leaked across requests.

### 4.2 Schema (`src/schema/typeDefs.ts`)

Pure SDL via `gql` tag. Custom `DateTime` scalar. Two input types, two mutation operations, four query operations. No directives, no interfaces, no unions.

Notable choices:
- `Transaction.type` is a **string-backed enum** (`"INCOME" | "EXPENSE"`) — Prisma maps it as `String`, not an enum in SQLite.
- `transactions(userId: ID)` is optional filter — all transactions if omitted.
- No `updateTransaction` or `deleteMutation` mutations yet.

### 4.3 Resolvers (`src/resolvers/index.ts`)

Three resolver categories:

**Query resolvers** — thin wrappers around service functions:
```
users()        → userService.listUsers()
user(id)       → userService.getUserById(id)
transactions   → transactionService.listTransactions(userId)
transaction(id) → transactionService.getTransactionById(id)
```

**Mutation resolvers** — same pattern:
```
createUser(input)        → userService.createUser(input)
createTransaction(input) → transactionService.createTransaction(input)
```

**Type resolvers** — resolve relations between entities:
```
User.transactions → transactionService.listTransactions(parent.id)
Transaction.user  → ctx.loaders.user.load(parent.userId)  ← DataLoader
```

The `Transaction.user` resolver is where DataLoader fires — batched across the entire result set instead of N individual queries.

### 4.4 Services (`src/services/`)

Pure Prisma queries. No authentication, no validation, no error handling.

**`user.ts`:**
| Function | Prisma Query | Includes |
|---|---|---|
| `listUsers()` | `findMany()` | `transactions` |
| `getUserById(id)` | `findUnique({ where: { id } })` | `transactions` |
| `createUser(input)` | `create({ data })` | `transactions` |
| | ⚠️ `passwordHash: input.password` — plaintext, see Gaps | |

**`transaction.ts`:**
| Function | Prisma Query | Includes |
|---|---|---|
| `listTransactions(userId?)` | `findMany({ where, orderBy })` | `user` |
| `getTransactionById(id)` | `findUnique({ where: { id } })` | `user` |
| `createTransaction(input)` | `create({ data })` | `user` |
| | `date` cast to `new Date(input.date)` | |

### 4.5 DataLoader (`src/loaders/index.ts`)

Single loader — `user`. Batch function:

```ts
function batchUsers(ids: readonly string[]) {
  return prisma.user
    .findMany({ where: { id: { in: [...ids] } } })
    .then(users => {
      const map = new Map(users.map(u => [u.id, u]));
      return ids.map(id => map.get(id) ?? null); // preserve order
    });
}
```

Critical behavior:
- **Preserves input order** — map lookup against ordered `ids` array guarantees 1:1 result order matching GraphQL field expectations.
- **Returns `null` for missing IDs** — DataLoader expects a value per key, even if null.
- **Per-request instance** — `createLoaders()` called in Apollo `context` factory.

### 4.6 Prisma Client Singleton (`src/lib/prisma.ts`)

Standard `globalThis` pattern:

```ts
const globalForPrisma = globalThis as typeof globalThis & { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === "development"
    ? ["query", "warn", "error"]
    : ["warn", "error"],
});

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
```

Prevents multiple client instances during hot-reload (`tsx watch`). Query logging only in development.

### 4.7 TypeScript Types (`src/types/`)

**`graphql.ts`** — manual types mirroring SDL. Two input types, one enum-like type alias. TODO: replace with `graphql-codegen`.

**`index.ts`** — single export:
```ts
export type GraphQLContext = {
  loaders: Loaders;
};
```

Used in `Transaction.user` resolver signature for typed `ctx` access.

## 5. Data Model

### Entity Relationship

```
User ──1:N──→ Transaction
```

### User (`users` table)

| Column | Type | Constraints |
|---|---|---|
| `id` | TEXT (UUID) | PK, `@default(uuid())` |
| `name` | TEXT | NOT NULL |
| `email` | TEXT | NOT NULL, **UNIQUE** |
| `password_hash` | TEXT | NOT NULL — plaintext (⚠️) |
| `created_at` | DATETIME | `@default(now())` |
| `updated_at` | DATETIME | `@updatedAt` |

### Transaction (`transactions` table)

| Column | Type | Constraints |
|---|---|---|
| `id` | TEXT (UUID) | PK, `@default(uuid())` |
| `description` | TEXT | NOT NULL |
| `amount` | REAL | NOT NULL |
| `type` | TEXT | NOT NULL — `"INCOME"` or `"EXPENSE"` |
| `category` | TEXT | NOT NULL |
| `date` | DATETIME | NOT NULL |
| `user_id` | TEXT | FK → `users.id`, NOT NULL |
| `created_at` | DATETIME | `@default(now())` |
| `updated_at` | DATETIME | `@updatedAt` |

### Indexes

- `users.email` — unique
- `transactions.user_id` — B-tree (filter by user)
- `transactions.date` — B-tree (sort/range queries)

### Foreign Key

`transactions.user_id → users.id` — **ON DELETE RESTRICT**, **ON UPDATE CASCADE**.

Cannot delete a user who has transactions. Explicit constraint — no cascade deletes.

## 6. API Design

### Queries (read operations)

| Operation | Arguments | Returns | Notes |
|---|---|---|---|
| `users` | — | `[User!]!` | All users with transactions |
| `user(id)` | `id: ID!` | `User` (nullable) | Single user, null if not found |
| `transactions` | `userId: ID` (optional) | `[Transaction!]!` | All or filtered by user |
| `transaction(id)` | `id: ID!` | `Transaction` (nullable) | Single, null if not found |

### Mutations (write operations)

| Operation | Input Type | Returns | Side Effects |
|---|---|---|---|
| `createUser` | `CreateUserInput!` | `User!` | Inserts row in `users` |
| `createTransaction` | `CreateTransactionInput!` | `Transaction!` | Inserts row in `transactions` |

### Input Types

```graphql
input CreateUserInput {
  name: String!
  email: String!
  password: String!        # ⚠️ stored as plaintext
}

input CreateTransactionInput {
  description: String!
  amount: Float!
  type: TransactionType!   # INCOME | EXPENSE
  category: String!
  date: DateTime!
  userId: ID!
}
```

### Missing Operations

No `updateUser`, `updateTransaction`, `deleteUser`, `deleteTransaction`. No pagination (`skip`/`take`). No sorting arguments (hardcoded `date: "desc"`).

## 7. Performance

### N+1 Prevention

Without DataLoader, fetching N transactions triggers N user queries:
```
Transaction[0].user  →  SELECT * FROM users WHERE id = '...'
Transaction[1].user  →  SELECT * FROM users WHERE id = '...'
...
```

With DataLoader, all N `user` resolutions batch into one query:
```
Transaction[0].user  ─┐
Transaction[1].user  ─┼──→ batchUsers(['id1', 'id2', ...])
Transaction[2].user  ─┘    → WHERE id IN (...)
```

### Query Patterns — Known Inefficiencies

- `users` query always `include: { transactions: true }` — even if client doesn't request them. Overfetch.
- `transactions` query always `include: { user: true }` — same problem.
- No field-level selection — Apollo resolves requested fields, but Prisma fetches full rows.

### DataLoader Cache

Per-request, in-memory. Automatically deduplicates. If same user appears in multiple parent results, only one DB query fires.

## 8. Configuration & Dev Workflow

### Environment

Single variable:
```
DATABASE_URL="file:./dev.db"
```

`.env` file at `backend/`. `.env.example` checked in. `.env` gitignored.

### Scripts

| Command | Action |
|---|---|
| `npm run dev` | `tsx watch src/index.ts` — hot reload on file changes |
| `npm run build` | `tsc` — compile to `dist/` |
| `npm run start` | `node dist/index.js` — production |
| `npm run typecheck` | `tsc --noEmit` — verify types |
| `npm run format` | `biome format --write` |
| `npm run lint` | `biome lint` |
| `npm run check` | `biome check` — format + lint combined |
| `npm run db:generate` | `prisma generate` — after schema changes |
| `npm run db:migrate` | `prisma migrate dev` — create + apply migration |
| `npm run db:migrate:deploy` | `prisma migrate deploy` — apply in production |
| `npm run db:studio` | `prisma studio` — browser-based DB GUI |

### Quick Start

```bash
cd backend
cp .env.example .env
npm install
npm run db:migrate      # creates dev.db + tables
npm run db:generate     # generates Prisma client
npm run dev             # starts on http://localhost:4000/graphql
```

### TypeScript Config

- `module: NodeNext` + `moduleResolution: NodeNext` — ESM-compatible output
- `.js` extensions in all imports (`@/schema/typeDefs.js`)
- Path alias `@/` → `./src/*`
- Strict mode, `noUnusedLocals`, `verbatimModuleSyntax`
- Output to `dist/`, sourcemaps enabled

### Biome Config

- 2-space indent, 100 char line width
- Double quotes, trailing commas, semicolons
- `organizeImports` on assist
- Scoped to `src/**/*.ts`, `prisma/**/*.prisma`

## 9. Known Gaps & Future Improvements

### Security (Critical)

| Gap | Impact | Fix |
|---|---|---|
| **Password stored as plaintext** | Full account compromise if DB leaked | `bcrypt.hash()` in `createUser` service |
| **No authentication** | Anyone can query/mutate all data | JWT or session auth + context validation |
| **No authorization** | No user isolation — one user can see all transactions | GraphQL context checks `userId` from token |
| **No rate limiting** | Abuse potential | Apollo plugin or reverse proxy |

### Data Integrity

| Gap | Impact | Fix |
|---|---|---|
| No input validation beyond GraphQL types | Negative amounts, empty names pass | Zod/Yup schema on service layer |
| `Transaction.type` is unvalidated string | Any string accepted (not just INCOME/EXPENSE) | Prisma enum or service-level check |
| No `deleteUser` mutation | Orphans can't be cleaned up | Cascade-delete or soft-delete |
| No pagination | Large datasets crash server | Add `skip`/`take`/`cursor` to list queries |

### Code Quality

| Gap | Impact | Fix |
|---|---|---|
| Manual TS types (`graphql.ts`) | Drift risk when SDL changes | `graphql-codegen` |
| No tests | Regressions invisible | Vitest + Apollo integration tests |
| No error handling middleware | Uncaught Prisma errors = 500 | Apollo formatError or service try/catch |
| No logging beyond Prisma queries | Debugging hard | Pino or structured logging |

### Architecture

| Gap | Impact | Fix |
|---|---|---|
| Prisma includes always eager | Overfetching when client doesn't need relations | Info-based selection or field resolvers |
| Services import Prisma directly | Can't test in isolation | Repository pattern or DI |
| No migration seeding | Fresh DB is empty | `prisma seed` script |
| Single file for all resolvers | Will grow unmanageable | Split per domain (`user.resolver.ts`) |
