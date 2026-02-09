# syntax=docker/dockerfile:1.4

ARG APP_NAME=web
ARG NODE_VERSION=22-alpine

# ================================
# Base Image
# ================================
FROM oven/bun:1.3.9-alpine AS base
RUN apk add --no-cache libc6-compat openssl && \
    rm -rf /var/cache/apk/*
WORKDIR /app

# ================================
# Pruner
# ================================
FROM node:${NODE_VERSION} AS pruner
ARG APP_NAME
RUN apk add --no-cache libc6-compat && \
    rm -rf /var/cache/apk/*
RUN npm install --global turbo@latest
WORKDIR /app
COPY . .
RUN turbo prune ${APP_NAME} --docker

# ================================
# Installer
# ================================
FROM base AS installer
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/bun.lock ./
COPY --from=pruner /app/turbo.json ./turbo.json
RUN bun install --ignore-scripts && \
    bun pm cache rm

# ================================
# Builder
# ================================
FROM base AS builder
ARG APP_NAME
ENV NODE_ENV=production
COPY --from=pruner /app/out/full/ .
COPY --from=pruner /app/out/bun.lock ./
COPY --from=pruner /app/turbo.json ./turbo.json

# Install deps and generate Prisma client
RUN rm -f packages/db/prisma.config.ts && \
    bun install && \
    cd packages/db && bunx prisma generate --schema prisma/schema/schema.prisma && \
    cd /app && \
    bunx turbo run build --filter=${APP_NAME}... && \
    find . -name "*.tsbuildinfo" -delete

# ================================
# Production Dependencies
# ================================
FROM base AS deps-production
COPY --from=installer /app/node_modules ./node_modules
RUN bun prune --production && \
    bun pm cache rm

# ================================
# Runner for "web" app
# ================================
FROM node:${NODE_VERSION} AS runner-web
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 --shell /bin/bash nextjs && \
    mkdir -p /app/logs && \
    chown -R nextjs:nodejs /app

USER nextjs

COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public
COPY --from=builder --chown=nextjs:nodejs /app/packages/db/prisma ./packages/db/prisma
COPY --from=deps-production --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["node", "apps/web/server.js"]

# ================================
# Runner for "server" app
# ================================
FROM oven/bun:1.3.9-alpine AS runner-server
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

RUN addgroup --system --gid 1001 bun && \
    adduser --system --uid 1001 --shell /bin/bash bun && \
    mkdir -p /app/logs && \
    chown -R bun:bun /app

USER bun

COPY --from=builder --chown=bun:bun /app/apps/server/dist ./dist
COPY --from=deps-production --chown=bun:bun /app/node_modules ./node_modules
COPY --from=builder --chown=bun:bun /app/packages/db/prisma ./packages/db/prisma
COPY --from=deps-production --chown=bun:bun /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD bun -e "await fetch('http://localhost:3001/health').then(r => process.exit(r.ok ? 0 : 1))"

CMD ["bun", "dist/index.js"]
