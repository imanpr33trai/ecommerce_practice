# syntax=docker/dockerfile:1.4

# ================================
# Stage 1: Dependency Pruning
# ================================
FROM node:25-alpine AS pruner

RUN apk add --no-cache libc6-compat

# Install Turbo globally
RUN npm install --global turbo

WORKDIR /app

# Copy entire monorepo to enable turbo pruning
COPY . .

# Prune the monorepo to only web app dependencies
# This creates a minimal workspace in /app/out
RUN turbo prune web --docker

# ================================
# Stage 2: Install Dependencies
# ================================
FROM oven/bun:alpine AS installer

RUN apk add --no-cache \
    libc6-compat \
    openssl \
    python3 \
    make \
    g++

WORKDIR /app

# Copy pruned lock file and package.json files
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/bun.lock* ./bun.lock

# Install dependencies (including devDependencies for build)
RUN bun install --frozen-lockfile


# Copy source code
COPY --from=pruner /app/out/full/ .

# Copy turbo configuration and root tsconfig
COPY --from=pruner /app/turbo.json ./turbo.json
# Copy root tsconfig from original source (before pruning)
COPY tsconfig.json ./tsconfig.json

# ================================
# Stage 3: Generate Prisma Client
# ================================
# Generate Prisma client WITHOUT connecting to database
# This must happen before the build
RUN cd packages/db && bunx prisma generate

# ================================
# Stage 4: Build Application
# ================================
FROM installer AS builder

WORKDIR /app

# Build the web app using Turborepo
# This will output to apps/web/.next/standalone
RUN bunx turbo run build --filter=web...

# ================================
# Stage 5: Production Runner
# ================================
FROM node:25-alpine AS runner

# Install openssl for Prisma runtime
RUN apk add --no-cache \
    openssl \
    libc6-compat \
    dumb-init

WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy standalone Next.js output
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

# Copy Prisma schema and generated client
COPY --from=builder --chown=nextjs:nodejs /app/packages/db/prisma ./packages/db/prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma

USER nextjs

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the Next.js server
CMD ["node", "apps/web/server.js"]
