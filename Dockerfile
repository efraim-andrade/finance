FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN apk add --no-cache openssl && corepack enable
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY frontend/package.json ./frontend/package.json
COPY backend/package.json ./backend/package.json
COPY backend/prisma/schema.prisma ./backend/prisma/schema.prisma
RUN pnpm install --frozen-lockfile --ignore-scripts

FROM base AS dev
COPY --from=deps /app ./
COPY . .
RUN pnpm --filter backend db:generate
EXPOSE 3000 4001
CMD ["pnpm", "dev"]

FROM base AS build
COPY --from=deps /app ./
COPY . .
ARG VITE_BACKEND_URL=/graphql
ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}
RUN pnpm --filter backend db:generate
RUN pnpm --filter backend build
RUN pnpm --filter frontend build

FROM node:22-alpine AS production
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN apk add --no-cache openssl && corepack enable
WORKDIR /app

COPY package.json pnpm-workspace.yaml ./
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/frontend/node_modules ./frontend/node_modules
COPY --from=deps /app/backend/node_modules ./backend/node_modules
COPY --from=build /app/frontend/package.json ./frontend/package.json
COPY --from=build /app/frontend/.output ./frontend/.output
COPY --from=build /app/backend/package.json ./backend/package.json
COPY --from=build /app/backend/dist ./backend/dist
COPY --from=build /app/backend/prisma ./backend/prisma
COPY --from=build /app/docker ./docker
RUN mkdir -p /app/backend/data && pnpm --filter backend db:generate

ENV DATABASE_URL="file:/app/backend/data/prod.db"
ENV BACKEND_PORT=4001
ENV NODE_ENV=production

EXPOSE 3000 4000

CMD ["node", "docker/start-production.mjs"]
