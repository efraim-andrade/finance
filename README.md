![Finance Logo](./frontend/public/Logo.svg)

# Finance

A full-stack personal finance management web application. Built as a postgraduate final project (TCC) for Rocketseat.

> **Postgraduate Project Score:** 49 /50
> **Status:** Approved
> [📌 View full feedback](#-postgraduate-project-score)

Production: https://finance-production-e82d.up.railway.app/

## 📚 Index

- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Getting Started](#-getting-started)
- [📜 Available Scripts](#-available-scripts)
- [🎓 Academic Context](#-academic-context)
- [🏆 Postgraduate Project Score](#-postgraduate-project-score)
- [📝 Feedback Received](#-feedback-received)

## ✨ Features

- **Authentication** -- sign up, log in, profile management, password reset via token, account deletion
- **Transactions** -- create, list, edit, and delete income and expense entries with category, amount, and date
- **Categories** -- create custom categories with name, description, color, and icon
- **Dashboard** -- summary cards (total income, total expense, balance), category breakdown, and recent transactions
- **Period filtering** -- filter transactions by month and year

## 🛠️ Tech Stack

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

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 22+
- [pnpm](https://pnpm.io/) 9+
- [Docker](https://docs.docker.com/get-docker/) with Compose plugin, for containerized development

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

### Running With Docker

Create a local secret first:

```bash
export JWT_SECRET="$(openssl rand -hex 32)"
```

```bash
pnpm docker:up
```

- Frontend: http://localhost:3000
- Backend GraphQL: http://localhost:4000/graphql
- SQLite data: persisted in the `backend-data` Docker volume

Stop containers:

```bash
pnpm docker:down
```

For production images, pass the public GraphQL URL at build time because Vite embeds `VITE_BACKEND_URL` into the client bundle:

```bash
docker build \
  --build-arg VITE_BACKEND_URL=/graphql \
  -t finance .
```

Production runtime requires these environment variables:

```bash
DATABASE_URL="file:/app/backend/data/prod.db"
JWT_SECRET="$(openssl rand -hex 32)"
FRONTEND_ORIGIN="https://your-frontend-domain.example"
PORT="4000"
BACKEND_PORT="4001"
```

The production image defaults `DATABASE_URL` to `file:/app/backend/data/prod.db` for SQLite deploys and `BACKEND_PORT` to `4001`. `PORT` is reserved for the frontend server because most deploy platforms route public traffic to it. The frontend exposes `/graphql` as a same-origin proxy to the internal backend port. Mount persistent storage at `/app/backend/data`; otherwise data is lost when the container is replaced. The production container runs Prisma migrations before starting the backend and frontend processes.

## 📜 Available Scripts

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

## 🎓 Academic Context

This project is a **Trabalho de Conclusao de Curso (TCC)** -- a final project for a postgraduate program at [Rocketseat](https://www.rocketseat.com.br/). It demonstrates full-stack development skills including:

- GraphQL API design with Apollo Server
- Authentication and authorization with JWT
- Database modeling with Prisma ORM
- Modern React patterns with TanStack Start and TanStack Router
- Component architecture with shadcn/ui and Tailwind CSS
- Form validation with react-hook-form and zod
- Unit and component testing
- Monorepo management with pnpm workspaces

## 🏆 Postgraduate Project Score

### Score: 49 /50

## 📝 Feedback Received

### 📊 Project Feedback

#### Overview

Congratulations on the excellent work on this project! You demonstrated an impressive command of several modern technologies, resulting in a robust and well-structured application. The authentication and transaction management features were implemented with great attention to detail and security.

**Strengths:** Authentication, Transaction Management, Security, Code Architecture

**Areas for Improvement:** Monitoring, E2E Tests, Documentation, Loading Optimization

### 🧩 Functional Requirements

**Score:** 99 | **Weight:** 60%

#### Strengths

- User model implemented with id, name, email, passwordHash, resetToken fields and relationships with Transaction and Category
- Authentication service implemented with account creation and login (file exists in the structure)
- Transaction creation functionality implemented with user validation and association to userId
- GraphQL resolver for listing transactions with required authentication
- Transaction model with userId field and index for query optimization
- Category model with required userId field and relationship with User
- Complete login implementation with field validation and state management
- Complete transaction CRUD implementation: create (handleCreate), edit (handleEdit/handleEditSubmit), delete (handleDelete/confirmDelete), and list with pagination and filters
- Modal for transaction creation with field validation (description, amount, date, category)
- useAuth hook manages authentication and ensures data isolation per user (userId)
- useTransactions hook filters transactions by userId, ensuring the user only sees their own data
- Reusable component for transaction deletion confirmation
- Login page implemented with complete form and validation
- Dashboard page implemented with summary cards, recent transactions, and categories section
- Documented route structure: / (conditional login/dashboard), /login, /criar-conta, /recuperar-senha, /recuperar-senha/$token, /app (dashboard), /app/transacoes, /app/categorias, /app/profile
- Registration page implemented
- Modal (Dialog) for new transaction form implemented

### 🧩 Best Practices

**Score:** 92 | **Weight:** 15%

#### Strengths

- CORS correctly enabled with origin and credentials configuration, using the resolveCorsOrigin function to validate allowed origins
- Robust CORS origin validation implementation with a regex pattern for development and strict validation in production
- Apollo Server configured with csrfPrevention enabled, showing additional security concern beyond CORS
- Extensive use of modern libraries such as TanStack Router, Apollo Client, shadcn/ui, Tailwind CSS 4, react-hook-form, zod, and Vitest to facilitate development and maintenance
- shadcn/ui configuration with organized aliases (@/components, @/utils, @/ui, @/hooks) for better import structure
- Use of reusable components based on Radix UI with variants via Class Variance Authority
- Well-organized and modular components (MobileNav, UserMenu) with clear separation of responsibilities
- Form validation with react-hook-form and consistent error feedback
- Use of zod for schema validation with error messages in Portuguese
- Local state management with useState and custom field validation
- Pagination implemented with state control and synchronization with filters
- Reusable filter components with shadcn/ui Select
- Custom CSS animations with CSS variables for smooth transitions
- Use of useMemo to optimize summary card rendering
- Linting and formatting configuration with Biome to maintain code consistency
- Accessible SVG component with appropriate aria-label
- Multi-step confirmation flow for destructive actions
- Well-structured empty state with icon, title, description, and action

### 🧩 Non-Functional Requirements

**Score:** 99 | **Weight:** 25%

#### Strengths

- .env.example file present with all required variables: DATABASE_URL, JWT_SECRET, PORT, and BACKEND_PORT
- Environment variable validation implemented using Zod, ensuring JWT_SECRET and DATABASE_URL are required
- Robust error handling that validates and reports invalid or missing environment variables
- JWT_SECRET configured with placeholder value 'change-me-to-a-random-secret'
- DATABASE_URL configured for SQLite with 'file:./dev.db'
- TypeScript configured as a development dependency
- TypeScript configuration with target ES2022 and module NodeNext
- GraphQL installed as a dependency (version 16.11.0)
- Use of type-graphql for GraphQL schema construction
- Prisma Client generator configuration
- SQLite configured as the datasource provider in Prisma
- Import and use of PrismaClient for database access
- React 19.2.0 implemented as required
- TailwindCSS 4.1.18 implemented (flexible technology allowed)
- Integration of @hookform/resolvers with Zod for validation
- Use of React, TanStack Router, and UI components
- Custom useCategoryOptions hook with GraphQL
- Apollo Client useMutation for GraphQL operations
- VITE_BACKEND_URL variable configured in the build with default value /graphql
- Clear documentation of required environment variables in the frontend

### 🚀 Next Steps

#### 🔴 Required Actions

No required actions

#### 🟡 Recommended Actions

No recommended actions

#### 🟢 Suggested Improvements

- Verify the implementation of the useCategories hook to ensure filtering by userId and complete isolation of category data per user
- Add rate limiting to the API for protection against abuse and brute-force attacks
- Implement structured logging to monitor requests and errors in production
- Add a health check endpoint to make application monitoring easier
- Document the component patterns and chosen architecture in a CONTRIBUTING.md file or similar to make onboarding new developers easier
- Evaluate creating a Storybook or similar tool to visually document reusable UI components
- Add E2E integration tests with Playwright or Cypress to complement the existing unit tests
- Evaluate implementing route-based code splitting to optimize the application's initial load
