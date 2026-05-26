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
│   ├── schema.prisma       # Data model (User, Category, Transaction)
│   ├── dev.db              # SQLite database (gitignored)
│   └── migrations/         # Migration history
│       └── 20260522224341_init/
│           └── migration.sql
└── src/
    ├── app/
    │   ├── context.ts      # GraphQL context creation
    │   └── server.ts       # Apollo Server initialization
    ├── index.ts            # Entry point — imports and starts server
    ├── lib/
    │   └── prisma.ts       # Prisma Client singleton
    ├── loaders/
    │   └── index.ts        # DataLoader definitions
    ├── modules/
    │   ├── auth/           # Authentication module
    │   │   ├── auth.resolver.ts
    │   │   ├── auth.service.ts
    │   │   ├── auth.tokens.ts
    │   │   └── auth.types.ts
    │   ├── categories/     # Category management
    │   │   ├── category.resolver.ts
    │   │   ├── category.service.ts
    │   │   └── category.types.ts
    │   ├── shared/         # Shared utilities
    │   │   └── authorization.ts
    │   ├── transactions/   # Transaction management
    │   │   ├── transaction.resolver.ts
    │   │   ├── transaction.service.ts
    │   │   └── transaction.types.ts
    │   ├── users/          # User management
    │   │   ├── user.resolver.ts
    │   │   ├── user.resolver.ts.backup
    │   │   ├── user.seed.ts
    │   │   ├── user.service.ts
    │   │   └── user.types.ts
    │   └── index.ts        # Barrel export for modules
    ├── resolvers/
    │   └── index.ts        # Legacy resolvers (to be refactored)
    ├── schema/
    │   └── typeDefs.ts     # GraphQL SDL
    └── types/
        └── index.ts        # GraphQLContext type
```

## 4. Architecture Layers

```
Request
  │
  ▼
Apollo Server (port 4000) ── src/app/server.ts
  │
  ├── Schema ────────────── src/schema/typeDefs.ts  (SDL strings)
  │
  ├── Resolvers ─────────── src/modules/*/*.resolver.ts
  │     │
  │     ├── Query.*  ────── delegates to services/*
  │     ├── Mutation.* ──── delegates to services/*
  │     ├── User.* ──────── Transaction.user resolves via DataLoader
  │     └── Transaction.* ─ User.transactions resolves via service
  │
  ├── Services ──────────── src/modules/*/*.service.ts
  │     │
  │     ├── Auth Service ───── Auth credential validation & JWT handling
  │     │
  │     ├── User Service ───── Prisma CRUD on users table
  │     │
  │     ├── Category Service ─ Prisma CRUD on categories table
  │     │
  │     └── Transaction Service ─ Prisma CRUD on transactions table
  │
  ├── Loaders ───────────── src/loaders/index.ts
  │     │
  │     └── DataLoader ──── batchUsers(): batched user fetches
  │
  ├── Context ───────────── src/app/context.ts
  │     │
  │     └── GraphQLContext ─── Provides loaders & services to resolvers
  │
  └── Prisma Client ─────── src/lib/prisma.ts
          │
          └── SQLite ──────── prisma/dev.db
```

### 4.1 Entry Point (`src/index.ts`)

Application entry point that imports and starts the server.

```ts
import { startServer } from './app/server';

startServer().catch(console.error);
```

### 4.2 Server Initialization (`src/app/server.ts`)

Configures and starts the Apollo Server with proper context.

```ts
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from '../schema/typeDefs';
import { resolvers } from '../resolvers';
import { createLoaders } from '../loaders';
import { PrismaService } from '../modules/shared/prisma.service';

export const startServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async () => ({
      loaders: createLoaders(), // fresh DataLoader per request
      prisma: new PrismaService(),
    }),
  });

  console.log(`🚀 Server ready at ${url}`);
  return { url };
};
```

Key detail: **`createLoaders()` called per request**. This ensures DataLoader cache is scoped to a single GraphQL request — no stale data leaked across requests.

### 4.2 Schema (`src/schema/typeDefs.ts`)

Pure SDL via `gql` tag. Custom `DateTime` scalar. Two input types, two mutation operations, four query operations. No directives, no interfaces, no unions.

Notable choices:
- `Transaction.type` is a **string-backed enum** (`"INCOME" | "EXPENSE"`) — Prisma maps it as `String`, not an enum in SQLite.
- `transactions(userId: ID)` is optional filter — all transactions if omitted.
- No `updateTransaction` or `deleteMutation` mutations yet.

### 4.3 Resolvers (`src/modules/*/*.resolver.ts`)

Resolvers are now organized by feature module. Each module contains its own resolver file that handles queries, mutations, and type resolvers for that domain.

**Query resolvers** — thin wrappers around service functions:
- `users()` → `userService.listUsers()`
- `user(id)` → `userService.getUserById(id)`
- `transactions` → `transactionService.listTransactions(userId)`
- `transaction(id)` → `transactionService.getTransactionById(id)`

**Mutation resolvers** — same pattern:
- `createUser(input)` → `userService.createUser(input)`
- `createTransaction(input)` → `transactionService.createTransaction(input)`

**Type resolvers** — resolve relations between entities:
- `User.transactions` → `transactionService.listTransactions(parent.id)`
- `Transaction.user` → `ctx.loaders.user.load(parent.userId)` ← DataLoader

The `Transaction.user` resolver is where DataLoader fires — batched across the entire result set instead of N individual queries.

### 4.4 Services (`src/modules/*/*.service.ts`)

Services contain the business logic and Prisma queries for each module. Each service handles CRUD operations for its respective entity.

**Auth Service (`src/modules/auth/auth.service.ts`):**
| Function | Description |
|---|---|
| `registerUser(input)` | Registers new user with bcrypt-hashed password, seeds workspace |
| `loginUser(email, password)` | Authenticates user with password verification, returns JWT |
| `requestPasswordReset(email)` | Initiates password reset flow with rate limiting |
| `resetPassword(token, password)` | Completes password reset with new bcrypt-hashed password |

**User Service (`src/modules/users/user.service.ts`):**
| Function | Prisma Query | Includes |
|---|---|---|
| `listUsers()` | `findMany()` | - |
| `getUserById(id)` | `findUnique({ where: { id } })` | - |
| `getUserByEmail(email)` | `findUnique({ where: { email } })` | - |
| `updateUser(id, input, userId)` | `update({ where: { id }, data: input })` with auth check | - |
| `deleteUser(id, userId)` | Deletes user, transactions, and categories | - |

**Category Service (`src/modules/categories/category.service.ts`):**
| Function | Prisma Query | Includes |
|---|---|---|
| `listCategories(userId?)` | `findMany({ where: { OR: [{ userId: null }, { userId }] }, orderBy })` | - |
| `getCategoryById(id, userId?)` | `findFirst({ where: { id, OR: [{ userId: null }, { userId }] })` | - |
| `createCategory(input, userId)` | `create({ data })` with authenticated userId | - |
| `updateCategory(id, input, userId)` | `update({ where: { id }, data })` with auth and ownership checks | - |
| `deleteCategory(id, userId)` | `delete({ where: { id } })` with auth and ownership checks | - |

**Transaction Service (`src/modules/transactions/transaction.service.ts`):**
| Function | Prisma Query | Includes |
|---|---|---|
| `listTransactions(filters)` | `findMany({ where, orderBy: { date: 'desc' } })` with optional userId/month/year filters | - |
| `getTransactionById(id, userId?)` | `findUnique({ where: { id } })` or `findFirst({ where: { id, userId } })` | - |
| `createTransaction(input, userId)` | `create({ data })` with authenticated userId and date conversion | - |
| `updateTransaction(id, input, userId)` | `update({ where: { id }, data })` with auth check and conditional field updates | - |
| `deleteTransaction(id, userId)` | `delete({ where: { id } })` with auth check | - |
| `listTransactionPeriods(userId?)` | Returns unique month/year combinations with limit | - |
| `deleteExampleTransactions(userId?)` | Deletes transactions where isExample=true with auth check | - |
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

Standard `globalThis` pattern for Prisma Client singleton to prevent multiple instances during hot-reload.

```ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

export const prisma: PrismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "warn", "error"] : ["warn", "error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
```

Used throughout the application via `@/lib/prisma.js` alias.

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
User ──1:N──→ Category
```

### User (`users` table)

| Column | Type | Constraints |
|---|---|---|
| `id` | TEXT (UUID) | PK, `@default(uuid())` |
| `name` | TEXT | NOT NULL |
| `email` | TEXT | NOT NULL, **UNIQUE** |
| `password_hash` | TEXT | NOT NULL — hashed with bcrypt |
| `reset_token` | TEXT? | nullable |
| `reset_token_expires_at` | DATETIME? | nullable |
| `created_at` | DATETIME | `@default(now())` |
| `updated_at` | DATETIME | `@updatedAt` |

### Category (`categories` table)

| Column | Type | Constraints |
|---|---|---|
| `id` | TEXT (UUID) | PK, `@default(uuid())` |
| `name` | TEXT | NOT NULL |
| `description` | TEXT | NOT NULL, default "" |
| `color` | TEXT | NOT NULL |
| `icon` | TEXT | NOT NULL |
| `user_id` | TEXT | FK → `users.id` (can be null for global categories) |
| `created_at` | DATETIME | `@default(now())` |
| `updated_at` | DATETIME | `@updatedAt` |

### Transaction (`transactions` table)

| Column | Type | Constraints |
|---|---|---|
| `id` | TEXT (UUID) | PK, `@default(uuid())` |
| `description` | TEXT | NOT NULL |
| `amount` | REAL | NOT NULL |
| `type` | TEXT | NOT NULL — `"INCOME"` or `"EXPENSE"` (Prisma enum) |
| `category` | TEXT | NOT NULL — category name (denormalized) |
| `date` | DATETIME | NOT NULL |
| `user_id` | TEXT | FK → `users.id`, NOT NULL |
| `is_example` | BOOLEAN | NOT NULL, default false |
| `created_at` | DATETIME | `@default(now())` |
| `updated_at` | DATETIME | `@updatedAt` |

### Indexes

- `users.email` — unique
- `categories.user_id` — B-tree (filter by user)
- `transactions.user_id` — B-tree (filter by user)
- `transactions.date` — B-tree (sort/range queries)

### Foreign Keys

- `transactions.user_id → users.id` — **ON DELETE RESTRICT**, **ON UPDATE CASCADE**
- `categories.user_id → users.id` — **ON DELETE SET NULL**, **ON UPDATE CASCADE**

Note: 
- Transaction.category stores the category name as a string (denormalized) for performance, not as a foreign key
- Global categories have user_id = null and are available to all users
- User-specific categories have user_id pointing to the owning user
- Cannot delete a user who has transactions. Categories are set to null when user is deleted (SET NULL).

## 6. API Design

### Queries (read operations)

| Operation | Arguments | Returns | Notes |
|---|---|---|---|
| `users` | — | `[User!]!` | All users with transactions |
| `user(id)` | `id: ID!` | `User` (nullable) | Single user, null if not found |
| `categories` | — | `[Category!]!` | All categories (global + user-specific) |
| `category(id)` | `id: ID!` | `Category` (nullable) | Single category, null if not found |
| `transactions` | `userId: ID` (optional), `month: String`, `year: String` | `[Transaction!]!` | All transactions or filtered by user/month/year |
| `transaction(id)` | `id: ID!` | `Transaction` (nullable) | Single transaction, null if not found |
| `transactionPeriods` | — | `[TransactionPeriod!]!` | List of months with transactions |

### Mutations (write operations)

| Operation | Input Type | Returns | Side Effects |
|---|---|---|---|
| `createUser` | `CreateUserInput!` | `AuthPayload!` | Inserts row in `users`, returns auth token |
| `login` | `LoginInput!` | `AuthPayload!` | Authenticates user, returns auth token |
| `createTransaction` | `CreateTransactionInput!` | `Transaction!` | Inserts row in `transactions` |
| `updateTransaction` | `UpdateTransactionInput!` | `Transaction!` | Updates row in `transactions` |
| `deleteTransaction` | `ID!` | `ID!` | Deletes row from `transactions` |
| `createCategory` | `CreateCategoryInput!` | `Category!` | Inserts row in `categories` |
| `updateCategory` | `UpdateCategoryInput!` | `Category!` | Updates row in `categories` |
| `deleteCategory` | `ID!` | `ID!` | Deletes row from `categories` |
| `deleteExampleTransactions` | — | `Int!` | Deletes example transactions, returns count |
| `requestPasswordReset` | `RequestPasswordResetInput!` | `MessagePayload!` | Initiates password reset flow |
| `resetPassword` | `ResetPasswordInput!` | `MessagePayload!` | Completes password reset |
| `updateUser` | `UpdateUserInput!` | `User!` | Updates user profile |
| `deleteUser` | `ID!` | `ID!` | Deletes user and associated data |

### Input Types

```graphql
input CreateUserInput {
  name: String!
  email: String!
  password: String!        # ⚠️ stored as plaintext (will be hashed)
}

input LoginInput {
  email: String!
  password: String!
}

input CreateTransactionInput {
  description: String!
  amount: Float!
  type: TransactionType!   # INCOME | EXPENSE
  category: String!        # category name (denormalized)
  date: DateTime!
  isExample: Boolean
  userId: ID!              # owning user ID
}

input UpdateTransactionInput {
  description?: String
  amount?: Float
  type?: TransactionType
  category?: String        # category name (denormalized)
  date?: DateTime
  isExample?: Boolean
}

input UpdateUserInput {
  name?: String
}

input CreateCategoryInput {
  name: String!
  description?: String
  color: String!
  icon: String!
  userId?: ID              # null for global categories
}

input UpdateCategoryInput {
  id: ID!
  name?: String
  description?: String
  color?: String
  icon?: String
}

input RequestPasswordResetInput {
  email: String!
}

input ResetPasswordInput {
  token: String!
  password: String!
}
```

### Missing Operations

All CRUD operations are implemented. No pagination (`skip`/`take`). No sorting arguments beyond hardcoded `date: "desc"` in list queries.

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
| **No rate limiting** | Abuse potential | Apollo plugin or reverse proxy |
| **No refresh token mechanism** | Users must re-login frequently | Implement refresh token rotation |

### Data Integrity

| Gap | Impact | Fix |
|---|---|---|
| No input validation beyond GraphQL types | Negative amounts, empty names pass | Zod/Yup schema on service layer |
| No transactions database seeding | Fresh DB lacks sample data for UI development | Seed example transactions on first user creation |
| Category name denormalization | Potential inconsistency if category name changes | Consider adding categoryId FK to transactions |
| No soft deletes | Accidental data loss | Add deletedAt timestamps for recovery |

### Code Quality

| Gap | Impact | Fix |
|---|---|---|
| Manual TS types (`graphql.ts`) | Drift risk when SDL changes | `graphql-codegen` |
| No tests | Regressions invisible | Vitest + Apollo integration tests |
| No error handling middleware | Uncaught Prisma errors = 500 | Apollo formatError or service try/catch |
| No logging beyond Prisma queries | Debugging hard | Pino or structured logging |
| Services duplicate auth checks | Repeated requireAuthenticatedUserId calls | Centralize auth in resolver context or middleware |

### Architecture

| Gap | Impact | Fix |
|---|---|---|
| Prisma includes always eager | Overfetching when client doesn't need relations | Info-based selection or field resolvers |
| Services import Prisma directly | Can't test in isolation | Repository pattern or DI |
| No migration seeding | Fresh DB is empty | `prisma seed` script |
| DataLoader only for user | Missing loaders for categories | Add category DataLoader for transaction.category resolution | |
