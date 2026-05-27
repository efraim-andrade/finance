FROM node:22-alpine AS base
RUN npm install -g pnpm@10
WORKDIR /app

# ── Dependencies ──────────────────────────────────────────────
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY frontend/package.json ./frontend/package.json
COPY backend/package.json ./backend/package.json
RUN pnpm install --frozen-lockfile

# ── Build frontend ────────────────────────────────────────────
FROM base AS build-frontend
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/frontend/node_modules ./frontend/node_modules
COPY frontend/ ./frontend/
# Inline prod env for the build so VITE_BACKEND_URL is baked in
ARG VITE_BACKEND_URL=http://localhost:4000/graphql
ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}
RUN pnpm --filter frontend build

# ── Build backend ─────────────────────────────────────────────
FROM base AS build-backend
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/backend/node_modules ./backend/node_modules
COPY backend/ ./backend/
RUN pnpm --filter backend build

# ── Production image ──────────────────────────────────────────
FROM node:22-alpine AS production
RUN npm install -g pnpm@10
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/backend/node_modules ./backend/node_modules
COPY --from=deps /app/frontend/node_modules ./frontend/node_modules
COPY --from=build-backend /app/backend/dist ./backend/dist
COPY --from=build-frontend /app/frontend/dist ./frontend/dist
COPY --from=build-frontend /app/frontend/package.json ./frontend/package.json
COPY --from=build-backend /app/backend/package.json ./backend/package.json
COPY package.json pnpm-workspace.yaml ./

ARG VITE_BACKEND_URL=http://localhost:4000/graphql
ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}

EXPOSE 3000 4000

CMD ["sh", "-c", "pnpm --filter backend start & pnpm --filter frontend preview"]
