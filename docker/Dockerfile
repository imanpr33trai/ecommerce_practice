# syntax=docker/dockerfile:1.4

ARG APP_NAME=web
ARG NODE_VERSION=22-alpine

# ================================

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

# Builder
# ================================
FROM base AS builder
ARG APP_NAME

# ================================
# Production Dependencies
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

ENV NODE_ENV=production
