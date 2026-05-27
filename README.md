# Finance

A full-stack personal finance management web application. Built as a postgraduate final project (TCC) for Rocketseat.

Production: https://finance-production-e82d.up.railway.app/

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

## Postgraduate Project Score

> Aprovado
> Parabéns, seu projeto foi aprovado! Confira o feedback abaixo.

### 49 /50

## Feedback recebido:

### 📊 Feedback do Projeto

#### Visão Geral

Parabéns pelo excelente trabalho neste projeto! Você demonstrou um domínio impressionante de diversas tecnologias modernas, resultando em uma aplicação robusta e bem estruturada. As funcionalidades de autenticação e gerenciamento de transações foram implementadas com grande atenção aos detalhes e segurança.

**Pontos Fortes:** Autenticação, Gerenciamento de Transações, Segurança, Arquitetura de Código

**Áreas de Melhoria:** Monitoramento, Testes E2E, Documentação, Otimização de Carregamento

### 🧩 Requisitos Funcionais

**Nota:** 99 | **Peso:** 60%

#### Pontos Fortes

- Modelo User implementado com campos id, name, email, passwordHash, resetToken e relacionamentos com Transaction e Category
- Serviço de autenticação implementado com criação de conta e login (arquivo existe na estrutura)
- Funcionalidade de criar transação implementada com validação de usuário e associação ao userId
- Resolver GraphQL para listar transações com autenticação obrigatória
- Modelo Transaction com campo userId e índice para otimização de consultas
- Modelo Category com campo userId obrigatório e relacionamento com User
- Implementação completa de login com validação de campos e gerenciamento de estado
- Implementação completa de CRUD de transações: criar (handleCreate), editar (handleEdit/handleEditSubmit), deletar (handleDelete/confirmDelete) e listar com paginação e filtros
- Modal para criação de transações com validação de campos (descrição, valor, data, categoria)
- Hook useAuth gerencia autenticação e garante isolamento de dados por usuário (userId)
- Hook useTransactions filtra transações por userId garantindo que usuário veja apenas seus dados
- Componente reutilizável para confirmação de exclusão de transações
- Página de login implementada com formulário completo e validação
- Página dashboard implementada com cards de resumo, transações recentes e seção de categorias
- Estrutura de rotas documentada: / (login/dashboard condicional), /login, /criar-conta, /recuperar-senha, /recuperar-senha/$token, /app (dashboard), /app/transacoes, /app/categorias, /app/profile
- Página de cadastro implementada
- Modal (Dialog) para formulário de nova transação implementado

### 🧩 Boas Práticas

**Nota:** 92 | **Peso:** 15%

#### Pontos Fortes

- CORS habilitado corretamente com configuração de origin e credentials, utilizando função resolveCorsOrigin para validar origens permitidas
- Implementação robusta de validação de origem CORS com padrão regex para desenvolvimento e validação estrita em produção
- Servidor Apollo configurado com csrfPrevention ativado, demonstrando preocupação adicional com segurança além do CORS
- Uso extensivo de bibliotecas modernas como TanStack Router, Apollo Client, shadcn/ui, Tailwind CSS 4, react-hook-form, zod, e Vitest para facilitar desenvolvimento e manutenção
- Configuração do shadcn/ui com aliases organizados (@/components, @/utils, @/ui, @/hooks) para melhor estrutura de imports
- Uso de componentes reutilizáveis baseados em Radix UI com variantes através de Class Variance Authority
- Componentes bem organizados e modulares (MobileNav, UserMenu) com separação clara de responsabilidades
- Validação de formulários com react-hook-form e feedback de erros consistente
- Uso de zod para validação de schemas com mensagens de erro em português
- Gestão de estado local com useState e validação customizada de campos
- Paginação implementada com controle de estado e sincronização com filtros
- Componentes de filtro reutilizáveis com Select do shadcn/ui
- Animações CSS customizadas com variáveis CSS para transições suaves
- Uso de useMemo para otimização de renderização de cards de resumo
- Configuração de linting e formatação com Biome para manter consistência de código
- Componente SVG acessível com aria-label adequado
- Fluxo de confirmação em múltiplas etapas para ações destrutivas
- Estado vazio bem estruturado com ícone, título, descrição e ação

### 🧩 Requisitos Não Funcionais

**Nota:** 99 | **Peso:** 25%

#### Pontos Fortes

- Arquivo .env.example presente com todas as variáveis obrigatórias: DATABASE_URL, JWT_SECRET, PORT e BACKEND_PORT
- Validação de variáveis de ambiente implementada usando Zod, garantindo que JWT_SECRET e DATABASE_URL sejam obrigatórios
- Tratamento de erro robusto que valida e reporta variáveis de ambiente inválidas ou ausentes
- JWT_SECRET configurado com valor placeholder 'change-me-to-a-random-secret'
- DATABASE_URL configurado para SQLite com 'file:./dev.db'
- TypeScript configurado como dependência de desenvolvimento
- Configuração TypeScript com target ES2022 e module NodeNext
- GraphQL instalado como dependência (versão 16.11.0)
- Uso de type-graphql para construção do schema GraphQL
- Configuração do Prisma Client generator
- SQLite configurado como provider do datasource no Prisma
- Importação e uso do PrismaClient para acesso ao banco de dados
- React 19.2.0 implementado conforme requisito obrigatório
- TailwindCSS 4.1.18 implementado (tecnologia flexível permitida)
- Integração @hookform/resolvers com Zod para validação
- Uso de React, TanStack Router e componentes UI
- Hook customizado useCategoryOptions com GraphQL
- useMutation do Apollo Client para operações GraphQL
- Variável VITE_BACKEND_URL configurada no build com valor padrão /graphql
- Documentação clara das variáveis de ambiente necessárias no frontend

### 🚀 Próximos Passos

#### 🔴 Ações Obrigatórias

Nenhuma ação obrigatória

#### 🟡 Ações Recomendadas

Nenhuma ação recomendada

#### 🟢 Melhorias Sugeridas

- Verificar a implementação do hook useCategories para garantir o filtro por userId e o isolamento completo de dados de categorias por usuário
- Adicionar rate limiting à API para proteção contra abuso e ataques de força bruta
- Implementar logging estruturado para monitoramento de requisições e erros em produção
- Adicionar um endpoint de health check para facilitar o monitoramento da aplicação
- Documentar os padrões de componentes e a arquitetura escolhida em um arquivo CONTRIBUTING.md ou similar para facilitar o onboarding de novos desenvolvedores
- Avaliar a criação de um Storybook ou ferramenta similar para documentar visualmente os componentes reutilizáveis da UI
- Adicionar testes de integração E2E com Playwright ou Cypress para complementar os testes unitários existentes
- Avaliar a implementação de code splitting por rota para otimizar o carregamento inicial da aplicação
