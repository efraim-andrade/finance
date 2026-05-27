# Backend Architecture & Stack

## 1. Overview

Personal finance app backend. Serves GraphQL API for tracking income/expense transactions per user. Monorepo package (`backend/`) — frontend at `frontend/`.

Six responsibilities:
- User management (register, login, profile update, delete)
- Authentication & authorization (JWT, password reset, guarded resolvers)
- Transaction CRUD (income & expense records)
- Category CRUD (user-scoped categories)
- Input validation (Zod schemas + class-validator decorators)
- N+1 query prevention (DataLoader)

## 2. Tech Stack

| Tool | Version | Why |
|---|---|---|
| **Node.js** | 22+ (ESM) | `"type": "module"` — native ESM, no transpile step for dev |
| **Apollo Server 4** | ^4.13.0 | Express integration via `expressMiddleware` — CORS, JSON body parsing |
| **Express** | ^4.22.2 | HTTP middleware layer — cors, json body, auth middleware |
| **GraphQL** | ^16.11 | Schema-first API — strict contract between frontend/backend |
| **TypeGraphQL** | 2.0.0-rc.3 | Decorator-based schema generation — `@Resolver`, `@ObjectType`, `@InputType` |
| **class-validator** | ^0.15.1 | Input validation decorators — `@IsEmail`, `@MinLength`, `@IsPositive` |
| **Prisma 6** | ^6.6.0 | Type-safe ORM — auto-generated client from schema, migration tooling |
| **SQLite** | (Prisma) | Zero-dependency DB — dev-only, file-based, no server process |
| **DataLoader** | ^2.2.3 | Batch + cache for user fetches — prevents N+1 in resolvers |
| **TypeScript** | ^5.8.3 | Strict mode — `noUnusedLocals`, `noUncheckedSideEffectImports`, `verbatimModuleSyntax`, decorators enabled |
| **tsx** | ^4.19.4 | TypeScript execution — `tsx watch` for hot-reload dev server |
| **Zod** | ^3.25.76 | Runtime validation in service layer — doubles down on input safety |
| **bcryptjs** | ^3.0.3 | Password hashing — `hash(salt=10)` for register, `compare` for login |
| **jsonwebtoken** | ^9.0.3 | JWT signing + verification — access tokens (7d), reset tokens (1h) |
| **reflect-metadata** | ^0.2.2 | Required by TypeGraphQL for decorator metadata reflection |
| **Biome** | ^2.4.5 | Lint + format — fast, no plugins, single binary |
| **Vitest** | ^4.1.5 | Test runner — schema contract tests verify operation names + auth guards |

**Not used:** REST, graphql-tag, codegen.

## 3. Project Structure

```
backend/
├── .env                    # DATABASE_URL, JWT_SECRET, NODE_ENV
├── .env.example            # Template for env vars
├── biome.json              # 2-space indent, double quotes, semicolons, decorator support
├── package.json            # ESM, scripts, dependencies
├── tsconfig.json           # NodeNext, @/ alias, experimentalDecorators
├── prisma/
│   ├── schema.prisma       # Data model (User, Category, Transaction)
│   ├── dev.db              # SQLite database (gitignored)
│   ├── seed.ts             # Database seeding script
│   └── migrations/         # Migration history
│       └── 20260522224341_init/
│           └── migration.sql
└── src/
    ├── index.ts            # Entry point — imports and starts server
    ├── app/
    │   ├── context.ts      # GraphQL context creation (JWT parsing, loaders)
    │   └── server.ts       # Apollo Server + Express initialization
    ├── lib/
    │   ├── env.ts          # Zod-validated environment variables
    │   ├── prisma.ts       # Prisma Client singleton
    │   └── validation.ts   # Zod schemas for service-layer validation
    ├── loaders/
    │   └── index.ts        # DataLoader definitions (user batch)
    ├── modules/
    │   ├── auth/           # Authentication module
    │   │   ├── auth.resolver.ts
    │   │   ├── auth.service.ts
    │   │   ├── auth.tokens.ts
    │   │   ├── auth.tokens.test.ts
    │   │   └── auth.types.ts
    │   ├── categories/     # Category management
    │   │   ├── category.resolver.ts
    │   │   ├── category.service.ts
    │   │   └── category.types.ts
    │   ├── shared/         # Shared utilities
    │   │   ├── authorization.ts
    │   │   ├── errors.ts
    │   │   └── middlewares/
    │   │       ├── authentication.ts
    │   │       └── error-handler.ts
    │   ├── transactions/   # Transaction management
    │   │   ├── transaction.resolver.ts
    │   │   ├── transaction.service.ts
    │   │   └── transaction.types.ts
    │   ├── users/          # User management
    │   │   ├── user.resolver.ts
    │   │   ├── user.seed.ts
    │   │   ├── user.service.ts
    │   │   └── user.types.ts
    │   └── index.ts        # Barrel export for modules
    ├── schema/
    │   ├── models.ts       # TypeGraphQL @ObjectType models
    │   └── schema.contract.test.ts  # Introspection-based schema tests
    └── types/
        └── index.ts        # GraphQLContext type
```

## 4. Architecture Layers

```
Request
  │
  ▼
Express (port 4000) ─────────────── src/app/server.ts
  │  cors, express.json()
  │  context: buildContext(auth header)
  ▼
Apollo Server ────────────────────── schema via buildSchema()
  │
  ├── TypeGraphQL Schema ────────── src/schema/models.ts  (@ObjectType classes)
  │     │                              + typeDefs auto-generated from decorators
  │     └── Global Middleware ────── errorHandlerMiddleware()
  │
  ├── Resolvers ─────────────────── src/modules/*/*.resolver.ts  (@Resolver classes)
  │     │
  │     ├── @Authenticated() ────── authentication middleware decorator
  │     ├── @Query ──────────────── delegates to services
  │     ├── @Mutation ───────────── delegates to services
  │     └── @FieldResolver ──────── resolves relations (Transaction.user via DataLoader)
  │
  ├── Services ──────────────────── src/modules/*/*.service.ts
  │     │
  │     ├── Auth Service ────────── register, login, password reset (bcrypt + JWT)
  │     ├── User Service ────────── Prisma CRUD on users (self-only, auth-gated)
  │     ├── Category Service ────── Prisma CRUD on categories (user-scoped)
  │     └── Transaction Service ─── Prisma CRUD on transactions (user-scoped)
  │
  ├── Validation ────────────────── src/lib/validation.ts
  │     │                              + class-validator on InputType decorators
  │     └── Zod schemas ────────── createUserSchema, createTransactionSchema, etc.
  │
  ├── Errors ────────────────────── src/modules/shared/errors.ts
  │     │
  │     └── badUserInput / forbidden / notFound / internalServerError / unauthenticated
  │
  ├── Loaders ───────────────────── src/loaders/index.ts
  │     │
  │     └── DataLoader ──────────── batchUsers(): batched user fetches
  │
  ├── Context ───────────────────── src/app/context.ts
  │     │
  │     └── GraphQLContext ──────── userId (from JWT), authenticatedUserId (from middleware),
  │                                  loaders
  │
  └── Prisma Client ─────────────── src/lib/prisma.ts
          │
          └── SQLite ──────────────── prisma/dev.db
```

### 4.1 Entry Point (`src/index.ts`)

Top-level await — starts the server immediately.

```ts
import { startGraphQLServer } from "@/app/server.js";

const { url } = await startGraphQLServer();

console.log(`🚀  GraphQL server ready at: ${url}`);
```

### 4.2 Server Initialization (`src/app/server.ts`)

Uses Express + Apollo Server 4 with `expressMiddleware`. Schema is built via TypeGraphQL's `buildSchema()` which scans resolver classes and auto-generates SDL from decorators. Global middleware (`errorHandlerMiddleware`) wraps every resolver.

```ts
import "reflect-metadata";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import express from "express";
import { GraphQLISODateTime, buildSchema } from "type-graphql";

import { buildContext } from "@/app/context.js";
import { env } from "@/lib/env.js";
import { AuthResolver } from "@/modules/auth/auth.resolver.js";
import { CategoryResolver } from "@/modules/categories/category.resolver.js";
import { errorHandlerMiddleware } from "@/modules/shared/middlewares/error-handler.js";
import { TransactionResolver } from "@/modules/transactions/transaction.resolver.js";
import { UserResolver } from "@/modules/users/user.resolver.js";

const DEFAULT_PORT = env.PORT;
const ALLOWED_ORIGIN_PATTERN = /^https?:\/\/localhost(?::\d+)?$/;
const IS_DEV = env.NODE_ENV !== "production";

export function createGraphQLSchema() {
  return buildSchema({
    resolvers: [AuthResolver, UserResolver, CategoryResolver, TransactionResolver],
    globalMiddlewares: [errorHandlerMiddleware],
    scalarsMap: [{ type: Date, scalar: GraphQLISODateTime }],
    validate: true,
  });
}

export async function startGraphQLServer(port = DEFAULT_PORT) {
  const schema = await createGraphQLSchema();

  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    cache: "bounded",
  });

  await server.start();

  const app = express();

  app.use(
    "/graphql",
    cors<cors.CorsRequest>({
      origin: IS_DEV
        ? (requestOrigin, callback) => {
            callback(null, !!requestOrigin && ALLOWED_ORIGIN_PATTERN.test(requestOrigin));
          }
        : false,
      credentials: true,
    }),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => buildContext(req.headers.authorization),
    }),
  );

  return new Promise<{ url: string }>((resolve) => {
    app.listen(port, () => {
      resolve({ url: `http://localhost:${port}/graphql` });
    });
  });
}
```

Key details:
- **`buildSchema()` called once at startup** — generates SDL from decorators, caches schema.
- **`errorHandlerMiddleware` runs as global middleware** — catches all resolver errors, maps Prisma codes to user-facing errors, wraps unknowns as `INTERNAL_SERVER_ERROR`.
- **`validate: true`** — enables `class-validator` validation on `@InputType` arguments automatically.
- **`reflect-metadata` imported first** — required for decorator metadata reflection.

### 4.3 Context (`src/app/context.ts`)

Parses JWT from `Authorization: Bearer <token>` header. Creates fresh DataLoader per request. Sets `userId` when valid token present.

```ts
export async function buildContext(authorizationHeader?: string) {
  const token = authorizationHeader?.startsWith("Bearer ")
    ? authorizationHeader.slice(7)
    : null;

  let userId: string | undefined;

  if (token) {
    try {
      const payload = verifyAccessToken(token);
      userId = payload.userId;
    } catch {
      throw unauthenticated("Sessão inválida ou expirada. Faça login novamente.");
    }
  }

  return {
    loaders: createLoaders(),
    userId,
  };
}
```

### 4.4 TypeGraphQL Models (`src/schema/models.ts`)

Decorated classes replace raw SDL strings. `@ObjectType` decorators define the GraphQL object types. `TransactionType` enum is registered from the Prisma-generated enum.

```ts
import { TransactionType } from "@prisma/client";
import { Field, Float, ID, ObjectType, registerEnumType } from "type-graphql";

registerEnumType(TransactionType, { name: "TransactionType" });

@ObjectType("User")
export class UserModel {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  name!: string;

  @Field(() => String)
  email!: string;

  @Field(() => [TransactionModel])
  transactions!: TransactionModel[];

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;
}
// ... TransactionModel, CategoryModel, TransactionPeriodModel follow same pattern
```

Models exposed: `User`, `Transaction`, `Category`, `TransactionPeriod`.

### 4.5 Resolvers (`src/modules/*/*.resolver.ts`)

Each module exports a `@Resolver` class with decorated methods. Resolvers follow these patterns:

- **`@Authenticated()` decorator** on every query/mutation/fieldResolver that requires login — checks `context.userId`, sets `context.authenticatedUserId`.
- **`@Query` / `@Mutation`** — thin wrappers that delegate to service functions.
- **`@FieldResolver`** — resolves relations between entities (e.g., `Transaction.user` and `User.transactions`).
- **`@Arg`** — typed arguments with auto-validation via `class-validator`.
- **`@Ctx`** — typed context injection.
- **`@Root`** — parent object access for field resolvers.

**Auth Resolver** (`auth.resolver.ts`) — public mutations only (no `@Authenticated()`):
- `createUser(input)` → `authService.registerUser(input)`
- `login(input)` → `authService.loginUser(input.email, input.password)`
- `requestPasswordReset(input)` → `authService.requestPasswordReset(input.email)`
- `resetPassword(input)` → `authService.resetPassword(input.token, input.password)`

**User Resolver** (`user.resolver.ts`) — all operations require authentication:
- `me()` → `userService.getUserById(authenticatedUserId)` — self-profile
- `user(id)` → `userService.getUserById(id, authenticatedUserId)` — only if same user
- `updateUser(id, input)` → `userService.updateUser(id, input, authenticatedUserId)`
- `deleteUser(id)` → `userService.deleteUser(id, authenticatedUserId)`
- `User.transactions` (FieldResolver) → `transactionService.listTransactions({ userId })` with same-user check

**Category Resolver** (`category.resolver.ts`) — all require authentication:
- `categories()` → `categoryService.listCategories(userId)`
- `category(id)` → `categoryService.getCategoryById(id, userId)`
- `createCategory(input)` → `categoryService.createCategory(input, userId)`
- `updateCategory(id, input)` → `categoryService.updateCategory(id, input, userId)`
- `deleteCategory(id)` → `categoryService.deleteCategory(id, userId)`

**Transaction Resolver** (`transaction.resolver.ts`) — all require authentication:
- `transactions(month?, year?)` → `transactionService.listTransactions({ userId, month, year })`
- `transaction(id)` → `transactionService.getTransactionById(id, userId)`
- `transactionPeriods()` → `transactionService.listTransactionPeriods(userId)`
- `createTransaction(input)` → `transactionService.createTransaction(input, userId)`
- `updateTransaction(id, input)` → `transactionService.updateTransaction(id, input, userId)`
- `deleteTransaction(id)` → `transactionService.deleteTransaction(id, userId)`
- `deleteExampleTransactions()` → `transactionService.deleteExampleTransactions(userId)`
- `Transaction.user` (FieldResolver) → `ctx.loaders.user.load(parent.userId)` ← DataLoader, with same-user check

### 4.6 Authentication Middleware (`src/modules/shared/middlewares/authentication.ts`)

Method-level guard decorator. Can be applied to any resolver method:

```ts
export const authenticationMiddleware: MiddlewareFn<GraphQLContext> = async (
  { context },
  next,
) => {
  if (!context.userId) {
    throw unauthenticated();
  }

  context.authenticatedUserId = context.userId;

  return next();
};

export const Authenticated = () =>
  createMethodMiddlewareDecorator<GraphQLContext>(authenticationMiddleware);
```

Usage: `@Authenticated()` on resolver methods. Sets `context.authenticatedUserId` for downstream use.

### 4.7 Error Handler Middleware (`src/modules/shared/middlewares/error-handler.ts`)

Global middleware registered in `buildSchema()`. Catches all resolver errors:

- **GraphQLError with public code** → re-thrown as-is (safe for client)
- **ArgumentValidationError** (class-validator) → `BAD_USER_INPUT`
- **Prisma P2002** (unique constraint) → `BAD_USER_INPUT` ("Registro duplicado")
- **Prisma P2025** (not found) → `NOT_FOUND`
- **Unknown errors** → logged to stderr, wrapped as `INTERNAL_SERVER_ERROR`

```ts
export const errorHandlerMiddleware: MiddlewareFn<GraphQLContext> = async (
  _action,
  next,
) => {
  try {
    return await next();
  } catch (error) {
    if (error instanceof GraphQLError) {
      const code = error.extensions.code;
      if (typeof code === "string" && publicGraphQLErrorCodes.has(code)) {
        throw error;
      }
      logUnknownError(error);
      throw internalServerError();
    }
    // ... Prisma error mapping
  }
};
```

### 4.8 Error Types (`src/modules/shared/errors.ts`)

Five typed error factories, each producing a `GraphQLError` with consistent `extensions.code`:

| Factory | Code | Usage |
|---|---|---|
| `badUserInput(msg)` | `BAD_USER_INPUT` | Validation failures, duplicate records |
| `forbidden(msg?)` | `FORBIDDEN` | Cross-user access attempts |
| `notFound(msg)` | `NOT_FOUND` | Missing entities |
| `internalServerError(msg?)` | `INTERNAL_SERVER_ERROR` | Uncaught/unexpected errors |
| `unauthenticated(msg?)` | `UNAUTHENTICATED` | Missing or invalid auth |

### 4.9 Input Validation (`src/lib/validation.ts`)

Dual validation strategy:

1. **`class-validator` decorators** on TypeGraphQL `@InputType` classes — auto-validation via `validate: true` in `buildSchema()`. Catches type-level issues at the GraphQL layer.

2. **Zod schemas** in service layer via `validateOrThrow(schema, input)` — domain-level validation with Portuguese error messages. Catches business logic violations.

Schemas defined:
- `createUserSchema` — name (1-100), email (valid), password (8-128)
- `loginSchema` — email (valid), password (8+)
- `updateUserSchema` — name (optional, 1-100)
- `createCategorySchema` — name (1-24), description (max 200), color, icon
- `updateCategorySchema` — partial of create
- `createTransactionSchema` — description (1-200), amount (positive), type (INCOME/EXPENSE), category, date
- `updateTransactionSchema` — partial of create

### 4.10 Services (`src/modules/*/*.service.ts`)

Services contain business logic and Prisma queries. Each service:

- Receives `authenticatedUserId` from resolver (set by `@Authenticated()` middleware)
- Calls `assertAuthenticatedUserId()` + `assertSameUser()` for auth checks
- Validates input via Zod schemas before DB operations
- Returns typed results directly (Prisma models map to TypeGraphQL models by field name)

**Auth Service (`src/modules/auth/auth.service.ts`):**

| Function | Description |
|---|---|
| `registerUser(input)` | Zod-validates, normalizes email, bcrypt-hashes password, seeds workspace in transaction |
| `loginUser(email, password)` | Zod-validates, bcrypt-compare, returns JWT (7d) |
| `requestPasswordReset(email)` | Rate-limited (2min), stores reset token + expiry in DB |
| `resetPassword(token, password)` | Verifies token purpose + DB match, updates hash, clears token |

Key detail: `registerUser` runs in a `$transaction` — user creation + workspace seeding (categories + example transactions) are atomic.

**User Service (`src/modules/users/user.service.ts`):**

| Function | Auth Check | Description |
|---|---|---|
| `getUserById(id, authUserId)` | `assertSameUser(id, authUserId)` | Fetch own user |
| `updateUser(id, input, authUserId)` | `assertSameUser(id, authUserId)` | Update own profile |
| `deleteUser(id, authUserId)` | `assertSameUser(id, authUserId)` | Deletes user + transactions + categories in transaction |

**Category Service (`src/modules/categories/category.service.ts`):**

| Function | Auth Check | Description |
|---|---|---|
| `listCategories(authUserId)` | `assertAuthenticatedUserId` | All user's categories, ordered by newest |
| `getCategoryById(id, authUserId)` | Ownership by userId filter | Single category |
| `createCategory(input, authUserId)` | `assertAuthenticatedUserId` | Create with userId |
| `updateCategory(id, input, authUserId)` | Ownership check via find + userId match | Partial update |
| `deleteCategory(id, authUserId)` | Ownership check via find + userId match | Delete by id |

**Transaction Service (`src/modules/transactions/transaction.service.ts`):**

| Function | Auth Check | Description |
|---|---|---|
| `listTransactions({ userId, month?, year? })` | `assertAuthenticatedUserId` | Filtered by period, ordered by date desc |
| `getTransactionById(id, authUserId)` | Ownership by userId filter | Single transaction |
| `createTransaction(input, authUserId)` | `assertAuthenticatedUserId` | Creates with userId + date parsing |
| `updateTransaction(id, input, authUserId)` | Ownership + existence check | Conditional field updates |
| `deleteTransaction(id, authUserId)` | Ownership + existence check | Delete by id |
| `listTransactionPeriods(authUserId)` | `assertAuthenticatedUserId` | Unique month/year pairs from user's transactions |
| `deleteExampleTransactions(authUserId)` | `assertAuthenticatedUserId` | Deletes where isExample=true |

### 4.11 DataLoader (`src/loaders/index.ts`)

Single loader — `user`. Batch function preserves input order, returns `null` for missing IDs:

```ts
export function createLoaders() {
  return {
    user: new DataLoader(batchUsers),
  };
}

function batchUsers(ids: readonly string[]) {
  return prisma.user
    .findMany({ where: { id: { in: [...ids] } } })
    .then((users) => {
      const map = new Map(users.map((u) => [u.id, u]));
      return ids.map((id) => map.get(id) ?? null);
    });
}
```

Critical behavior:
- **Per-request instance** — `createLoaders()` called in `buildContext()`.
- **Preserves input order** — map lookup against ordered `ids` array.
- **Returns `null` for missing IDs** — DataLoader expects a value per key.

### 4.12 Env Configuration (`src/lib/env.ts`)

Zod-validated environment variables:

```ts
const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(1),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
});
```

Validated at startup — exits with error message if any variable is missing/invalid.

### 4.13 Prisma Client Singleton (`src/lib/prisma.ts`)

Standard `globalThis` pattern for Prisma Client singleton to prevent multiple instances during hot-reload.

```ts
const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

export const prisma: PrismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "warn", "error"]
        : ["warn", "error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
```

### 4.14 TypeScript Types (`src/types/index.ts`)

```ts
export type GraphQLContext = {
  authenticatedUserId?: string;
  loaders: Loaders;
  userId?: string;
};
```

- `userId` — set by context builder from JWT token (may be undefined for unauthenticated requests)
- `authenticatedUserId` — set by `@Authenticated()` middleware (guaranteed string when resolver runs)

### 4.15 Schema Contract Tests (`src/schema/schema.contract.test.ts`)

Vitest tests that verify:
- **Operation name stability** — introspection-based check that query/mutation names match expected list.
- **Auth guard enforcement** — each protected operation returns `UNAUTHENTICATED` when called without a token.
- **Middleware behavior** — `authenticationMiddleware` sets `context.authenticatedUserId`.

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
| `user_id` | TEXT | FK → `users.id`, **NOT NULL** |
| `created_at` | DATETIME | `@default(now())` |
| `updated_at` | DATETIME | `@updatedAt` |

Note: No more global categories. All categories belong to a user.

### Transaction (`transactions` table)

| Column | Type | Constraints |
|---|---|---|
| `id` | TEXT (UUID) | PK, `@default(uuid())` |
| `description` | TEXT | NOT NULL |
| `amount` | REAL | NOT NULL |
| `type` | TransactionType (enum) | NOT NULL — `INCOME` or `EXPENSE` |
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
- `categories.user_id → users.id` — **ON DELETE RESTRICT**, **ON UPDATE CASCADE**

Note:
- Transaction.category stores the category name as a string (denormalized) for performance, not as a foreign key.
- All categories are user-scoped (no global categories).
- Cannot delete a user who has transactions. Categories cascade restrict too (deletion done manually in transaction via service).

## 6. API Design

### Schema Generation

The GraphQL schema is auto-generated by TypeGraphQL from decorator metadata. No hand-written SDL. The `buildSchema()` function in `src/app/server.ts` scans the resolver classes and produces the full schema.

### Queries (read operations)

| Operation | Arguments | Returns | Auth |
|---|---|---|---|
| `me` | — | `User` (nullable) | `@Authenticated()` |
| `user` | `id: ID!` | `User` (nullable) | `@Authenticated()` — same-user check |
| `categories` | — | `[Category!]!` | `@Authenticated()` |
| `category` | `id: ID!` | `Category` (nullable) | `@Authenticated()` |
| `transactions` | `month: String`, `year: String` (optional) | `[Transaction!]!` | `@Authenticated()` |
| `transaction` | `id: ID!` | `Transaction` (nullable) | `@Authenticated()` |
| `transactionPeriods` | — | `[TransactionPeriod!]!` | `@Authenticated()` |

Note: No public `users` list query — only `me` for self-profile and `user` for own user.

### Mutations (write operations)

| Operation | Input Type | Returns | Auth |
|---|---|---|---|
| `createUser` | `CreateUserInput!` | `AuthPayload!` | Public |
| `login` | `LoginInput!` | `AuthPayload!` | Public |
| `requestPasswordReset` | `RequestPasswordResetInput!` | `MessagePayload!` | Public |
| `resetPassword` | `ResetPasswordInput!` | `MessagePayload!` | Public |
| `createTransaction` | `CreateTransactionInput!` | `Transaction!` | `@Authenticated()` |
| `updateTransaction` | `UpdateTransactionInput!` | `Transaction!` | `@Authenticated()` |
| `deleteTransaction` | `ID!` | `ID!` | `@Authenticated()` |
| `createCategory` | `CreateCategoryInput!` | `Category!` | `@Authenticated()` |
| `updateCategory` | `UpdateCategoryInput!` | `Category!` | `@Authenticated()` |
| `deleteCategory` | `ID!` | `ID!` | `@Authenticated()` |
| `deleteExampleTransactions` | — | `Int!` | `@Authenticated()` |
| `updateUser` | `UpdateUserInput!` | `User!` | `@Authenticated()` |
| `deleteUser` | `ID!` | `ID!` | `@Authenticated()` |

### Input Types

Defined as TypeGraphQL `@InputType` classes with `class-validator` decorators:

```
CreateUserInput { name!, email!, password! }
LoginInput { email!, password! }
RequestPasswordResetInput { email! }
ResetPasswordInput { token!, password! }
UpdateUserInput { name? }

CreateTransactionInput { description!, amount!, type!, category!, date! }
UpdateTransactionInput { description?, amount?, type?, category?, date? }

CreateCategoryInput { name!, description?, color!, icon! }
UpdateCategoryInput { name?, description?, color?, icon? }
```

### Missing Operations

All CRUD operations implemented. No pagination (`skip`/`take`). No sorting arguments beyond hardcoded `date: "desc"`.

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

- No field-level selection — Prisma fetches full rows even when client requests subset.
- `listTransactions` fetches all matching rows (no pagination).
- `listTransactionPeriods` fetches up to 1200 rows client-side to deduplicate.

### DataLoader Cache

Per-request, in-memory. Automatically deduplicates. If same user appears in multiple parent results, only one DB query fires.

## 8. Configuration & Dev Workflow

### Environment

```
DATABASE_URL="file:./dev.db"
JWT_SECRET="change-me-to-a-random-secret"
```

`JWT_SECRET` is now required. `.env` file at `backend/`. `.env.example` checked in. `.env` gitignored.

### Scripts

| Command | Action |
|---|---|
| `npm run dev` | `tsx watch src/index.ts` — hot reload on file changes |
| `npm run build` | `tsc && tsc-alias` — compile to `dist/` with path aliases |
| `npm run start` | `node dist/index.js` — production |
| `npm run test` | `vitest run` — run schema contract tests |
| `npm run typecheck` | `tsc --noEmit` — verify types |
| `npm run format` | `biome format --write` |
| `npm run lint` | `biome lint` |
| `npm run check` | `biome check` — format + lint combined |
| `npm run db:generate` | `prisma generate` — after schema changes |
| `npm run db:migrate` | `prisma migrate dev` — create + apply migration |
| `npm run db:migrate:deploy` | `prisma migrate deploy` — apply in production |
| `npm run db:seed` | `tsx prisma/seed.ts` — seed database |
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
- `.js` extensions in all imports (`@/schema/models.js`)
- Path alias `@/` → `./src/*`
- `experimentalDecorators: true` + `emitDecoratorMetadata: true` — TypeGraphQL requirement
- Strict mode, `noUnusedLocals`, `noUncheckedSideEffectImports`, `verbatimModuleSyntax`
- Output to `dist/`, sourcemaps enabled

### Biome Config

- 2-space indent, 100 char line width
- Double quotes, trailing commas, semicolons
- `unsafeParameterDecoratorsEnabled: true` — TypeScript decorator support
- Scoped to `src/**/*.ts`, `prisma/**/*.prisma`

## 9. Known Gaps & Future Improvements

### Security (Critical)

| Gap | Impact | Fix |
|---|---|---|
| **No rate limiting** | Abuse potential | Apollo plugin or express-rate-limit |
| **No refresh token mechanism** | Users must re-login frequently | Implement refresh token rotation |

### Data Integrity

| Gap | Impact | Fix |
|---|---|---|
| No transactions database seeding | Fresh DB lacks sample data | Seed on first user creation (partially done) |
| Category name denormalization | Potential inconsistency if category name changes | Consider adding categoryId FK to transactions |
| No soft deletes | Accidental data loss | Add deletedAt timestamps for recovery |

### Code Quality

| Gap | Impact | Fix |
|---|---|---|
| No integration tests | Regressions invisible | Vitest + Apollo integration tests (unit tests started for tokens) |
| Services duplicate auth checks | Repeated `assertAuthenticatedUserId` calls | Centralize in resolver with `@Authenticated()` (partially done) |
| Service-layer Zod schemas overlap with class-validator | Dual maintenance | Consolidate into one validation layer |

### Architecture

| Gap | Impact | Fix |
|---|---|---|
| No pagination on list queries | Client fetches all data | Add `skip`/`take` arguments |
| Prisma always fetches full rows | Overfetching | Info-based selection or field-level DataLoader |
| No migration seeding script | Fresh DB is empty | `prisma seed` script (exists but unused for dev) |
| DataLoader only for user | Missing loaders for categories | Add category DataLoader if category resolution becomes a bottleneck |
