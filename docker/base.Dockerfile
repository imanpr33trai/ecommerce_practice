# Base image with Bun for building
FROM oven/bun:alpine AS base

# Install dependencies needed for Prisma and native modules
RUN apk add --no-cache \
    openssl \
    libc6-compat

WORKDIR /app

# Enable Corepack for proper package manager detection
RUN corepack enable

# Copy root package files
COPY package.json bun.lock* ./

# Turbo will use this as the base for pruning
FROM base AS turbo-base
RUN bun install --global turbo

# This base stage will be referenced by individual app Dockerfiles
FROM base AS builder-base
# Copy the entire monorepo for turbo to analyze
COPY . .
