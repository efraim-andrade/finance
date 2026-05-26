# Finance

A full-stack personal finance management web application. Built as a postgraduate final project (TCC) for Rocketseat.

## Features

- **Authentication** -- sign up, log in, profile management, password reset via token, account deletion
- **Transactions** -- create, list, edit, and delete income and expense entries with category, amount, and date
- **Categories** -- create custom categories with name, description, color, and icon
- **Dashboard** -- summary cards (total income, total expense, balance), category breakdown, and recent transactions
- **Period filtering** -- filter transactions by month and year

## Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| React 19 | UI library |
| TanStack Start | Full-stack React framework (Vite + Nitro) |
| TanStack Router | File-based type-safe routing |
| Apollo Client 4 | GraphQL data fetching |
| Tailwind CSS 4 | Utility-first styling |
| shadcn/ui + Radix | Accessible component primitives |
| Class Variance Authority | Component variant management |
| react-hook-form + zod | Form handling and validation |
| Motion | Animations |
| Sonner | Toast notifications |
| Vitest + Testing Library | Unit and component testing |
| Biome | Linting and formatting |

### Backend

| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Apollo Server 4 | GraphQL API server |
| Prisma 6 | ORM and database toolkit |
| SQLite | Database |
| JWT + bcryptjs | Authentication and password hashing |
| DataLoader | N+1 query batching |
| Biome | Linting and formatting |

## Architecture

The project is a **pnpm monorepo** with two packages:

```
finance/
├── frontend/             # TanStack Start SPA (port 3000)
│   ├── src/
│   │   ├── components/   # UI components (auth, dashboard, transactions, categories, shadcn/ui)
│   │   ├── hooks/        # useAuth, useTransactions, useCategories, useDashboard, useTheme
│   │   ├── lib/          # Apollo Client, formatters, utils
│   │   ├── routes/       # __root, _public (login/signup/password reset), app (dashboard/transactions/categories/profile)
│   │   └── services/     # GraphQL mutations and queries (users, transactions, categories)
├── backend/              # GraphQL API (port 4000)
│   ├── src/
│   │   ├── index.ts      # Apollo Server setup, JWT auth context
│   │   ├── schema/       # GraphQL type definitions (User, Transaction, Category, Auth, CRUD)
│   │   ├── resolvers/    # Query and Mutation resolvers
│   │   ├── services/     # Business logic (user, transaction, category)
│   │   ├── loaders/      # DataLoader instances for query batching
│   │   └── lib/          # Prisma client
│   └── prisma/
│       └── schema.prisma # Database schema
├── package.json          # Workspace root scripts
└── pnpm-workspace.yaml   # Monorepo package definition
```

### Database Schema

- **User** -- id, name, email, passwordHash, resetToken, resetTokenExpiresAt; has many Transactions and Categories
- **Transaction** -- id, description, amount (Float), type (INCOME | EXPENSE), category (string), date, isExample; belongs to User
- **Category** -- id, name, description, color, icon, required userId

### Route Structure

| Path | Description | Access |
|---|---|---|
| `/` | Login | Public |
| `/login` | Login | Public |
| `/criar-conta` | Sign up | Public |
| `/recuperar-senha` | Forgot password | Public |
| `/recuperar-senha/$token` | Reset password | Public |
| `/app` | Dashboard | Authenticated |
| `/app/transacoes` | Transactions | Authenticated |
| `/app/categorias` | Categories | Authenticated |
| `/app/profile` | Profile settings | Authenticated |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 22+
- [pnpm](https://pnpm.io/) 9+

### Installation

```bash
git clone <repository-url>
cd finance
pnpm install
```

### Environment Variables

Create `.env` files in both `frontend/` and `backend/` directories.

**Backend** (`backend/.env`):

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
PORT=4000
```

**Frontend** (`frontend/.env`):

```env
VITE_BACKEND_URL="http://localhost:4000/graphql"
```

### Database Setup

```bash
cd backend
pnpm db:migrate   # Run Prisma migrations
pnpm db:seed      # (Optional) Seed user categories for existing users
```

### Running the Application

```bash
# Start both frontend and backend
pnpm dev

# Or start individually
pnpm dev:backend    # GraphQL API at http://localhost:4000
pnpm dev:frontend   # Web app at http://localhost:3000
```

## Available Scripts

### Root

| Command | Description |
|---|---|
| `pnpm dev` | Start frontend and backend concurrently |
| `pnpm dev:frontend` | Start frontend only |
| `pnpm dev:backend` | Start backend only |
| `pnpm build` | Build frontend for production |
| `pnpm test` | Run frontend unit tests |
| `pnpm typecheck` | Frontend TypeScript check |
| `pnpm lint` | Lint frontend with Biome |
| `pnpm format` | Format frontend with Biome |
| `pnpm check` | Run Biome check (format + lint) on frontend |
| `pnpm build:backend` | Build backend for production |
| `pnpm start:backend` | Start backend in production mode |
| `pnpm typecheck:backend` | Backend TypeScript check |
| `pnpm lint:backend` | Lint backend with Biome |
| `pnpm format:backend` | Format backend with Biome |
| `pnpm check:backend` | Run Biome check (format + lint) on backend |

### Backend Only

| Command | Description |
|---|---|
| `pnpm db:generate` | Generate Prisma client |
| `pnpm db:migrate` | Run database migrations |
| `pnpm db:migrate:deploy` | Run migrations in production |
| `pnpm db:studio` | Open Prisma Studio |
| `pnpm db:seed` | Seed the database |

## Academic Context

This project is a **Trabalho de Conclusao de Curso (TCC)** -- a final project for a postgraduate program at [Rocketseat](https://www.rocketseat.com.br/). It demonstrates full-stack development skills including:

- GraphQL API design with Apollo Server
- Authentication and authorization with JWT
- Database modeling with Prisma ORM
- Modern React patterns with TanStack Start and TanStack Router
- Component architecture with shadcn/ui and Tailwind CSS
- Form validation with react-hook-form and zod
- Unit and component testing
- Monorepo management with pnpm workspaces
