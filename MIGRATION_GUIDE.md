# Migration Guide: Turborepo + Bun → pnpm Workspaces + Node.js

## Table of Contents
1. [Migration Overview](#migration-overview)
2. [Prerequisites](#prerequisites)
3. [Step-by-Step Migration](#step-by-step-migration)
4. [Configuration Changes](#configuration-changes)
5. [Commands Reference](#commands-reference)
6. [Vercel Deployment Optimization](#vercel-deployment-optimization)
7. [CI/CD Pipeline Updates](#cicd-pipeline-updates)
8. [Troubleshooting](#troubleshooting)
9. [Verification Steps](#verification-steps)
10. [Rollback Plan](#rollback-plan)

---

## Migration Overview

### Why Migrate?
- **Vercel Optimization**: Native pnpm support with better caching and dependency resolution
- **Build Performance**: Improved parallel builds and dependency hoisting
- **Ecosystem Compatibility**: Better integration with Node.js ecosystem tools
- **Deployment Stability**: Consistent runtime environment across development and production

### What's Changing?
- **Package Manager**: Bun → pnpm
- **Build System**: Turborepo → pnpm workspaces
- **Runtime**: Bun runtime → Node.js runtime
- **Dependency Management**: bun.lockb → pnpm-lock.yaml
- **Build Orchestration**: turbo.json → pnpm workspace scripts

### Key Benefits
- ✅ Faster installation with pnpm's efficient store
- ✅ Better dependency deduplication
- ✅ Native Vercel support with optimized caching
- ✅ Improved monorepo management
- ✅ Reduced bundle sizes through better tree-shaking

---

## Prerequisites

### System Requirements
- Node.js >= 22.0.0 (matching current engines)
- pnpm >= 8.0.0 (latest stable recommended)
- Git repository with current Turborepo + Bun setup

### Backup Current Setup
```bash
# Create backup branch
git checkout -b backup/turbo-bun-setup
git add .
git commit -m "backup: Turborepo + Bun setup before migration"

# Tag for easy reference
git tag backup-turbo-bun-$(date +%Y%m%d-%H%M%S)
```

### Install pnpm Globally
```bash
# Install pnpm
npm install -g pnpm

# Verify installation
pnpm --version
```

---

## Step-by-Step Migration

### 1. Remove Bun Artifacts
```bash
# Remove Bun lock files and dependencies
rm -f bun.lockb
rm -rf node_modules
find . -name "node_modules" -type d -exec rm -rf {} +
find . -name ".next" -type d -exec rm -rf {} +
find . -name "dist" -type d -exec rm -rf {} +
find . -name ".turbo" -type d -exec rm -rf {} +

# Remove Bun-specific configurations
rm -f bunfig.toml
```

### 2. Update Root package.json
```bash
# Update package.json with pnpm configuration
```

**Key changes:**
- Remove `"packageManager": "bun@1.3.3"`
- Add `"packageManager": "pnpm@9.0.0"` (or latest)
- Update engines to remove Bun requirement
- Replace turbo scripts with pnpm workspace equivalents

### 3. Create pnpm-workspace.yaml
```yaml
packages:
  - 'apps/*'
  - 'packages/*'

# Optimizations for monorepo
catalogs:
  # Shared dependencies catalog for version alignment
  react18:
    react: '^18.2.0'
    'react-dom': '^18.2.0'
    '@types/react': '^18.2.0'
    '@types/react-dom': '^18.2.0'
  
  react19:
    react: '^19.2.3'
    'react-dom': '^19.2.3'
    '@types/react': '^19.2.2'
    '@types/react-dom': '^19.2.2'

  typescript:
    typescript: '^5.8.2'
    '@types/node': '^20.11.17'

# Link shared packages to reduce duplication
link-workspace-packages: true
prefer-workspace-packages: true

# Store node_modules in root to reduce duplication
node-linker: isolated
```

### 4. Update Application package.json Files

#### For Next.js Web App (`apps/web/package.json`):
```json
{
  "scripts": {
    "dev": "next dev -p 3001",
    "build": "next build",
    "start": "next start -p 3001",
    "type-check": "tsc --noEmit",
    "lint": "biome check .",
    "lint:fix": "biome check --write ."
  }
}
```

#### For Server App (`apps/server/package.json`):
```json
{
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc -p tsconfig.build.json && tsc-alias -p tsconfig.build.json",
    "build:watch": "tsc -p tsconfig.build.json --watch",
    "build:tsc": "tsc -p tsconfig.build.json",
    "start": "node dist/index.js"
  },
  "devDependencies": {
    "tsx": "^4.7.0"
  }
}
```

### 5. Update Vercel Configuration

#### Web App (`apps/web/vercel.json`):
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "cd ../../ && pnpm run build:web",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "installCommand": "cd ../../ && pnpm install --frozen-lockfile",
  "functions": {
    "apps/web/pages/api/**/*.ts": {
      "runtime": "nodejs20.x"
    }
  }
}
```

#### Server App (`apps/server/vercel.json`):
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "cd ../../ && pnpm run build:server",
  "outputDirectory": "dist",
  "installCommand": "cd ../../ && pnpm install --frozen-lockfile",
  "functions": {
    "src/index.ts": {
      "runtime": "nodejs20.x"
    }
  }
}
```

### 6. Install Dependencies
```bash
# Install all dependencies with pnpm
pnpm install

# This will:
# 1. Create pnpm-lock.yaml
# 2. Install dependencies in .pnpm-store
# 3. Link workspace packages
```

---

## Configuration Changes

### Before vs After Comparison

#### Root package.json Changes:
```diff
{
-  "packageManager": "bun@1.3.3",
+  "packageManager": "pnpm@9.0.0",
  "engines": {
    "node": ">=22.0.0",
-   "bun": ">=1.1.0"
  },
  "scripts": {
-   "build": "turbo run build",
+   "build": "pnpm -r --parallel build",
-   "dev": "turbo dev",
+   "dev": "pnpm -r --parallel dev",
-   "lint": "turbo lint",
+   "lint": "pnpm -r lint",
-   "type-check": "turbo type-check",
+   "type-check": "pnpm -r type-check",
-   "db:generate": "turbo -F @ecomerceNextjs/db db:generate",
+   "db:generate": "pnpm --filter @ecomerceNextjs/db db:generate"
  }
}
```

#### Build System Migration:
```diff
- turbo.json (removed)
+ pnpm-workspace.yaml (added)
+ .npmrc (optional, for pnpm configuration)
```

#### Runtime Migration:
```diff
# Development commands
- bun --env-file=../../.env.development --bun next dev -p 3001
+ NODE_ENV=development next dev -p 3001

# Build commands
- bun --env-file=../../.env.production --bun next build
+ NODE_ENV=production next build

# Server startup
- bun dist/index.js
+ node dist/index.js
```

---

## Commands Reference

### Root Level Commands
```bash
# Installation
pnpm install                    # Install all dependencies
pnpm add <package>             # Add dependency to root
pnpm add <package> -F <filter> # Add to specific workspace package

# Development
pnpm dev                       # Start all apps in development
pnpm dev:web                   # Start only web app
pnpm dev:server                # Start only server

# Building
pnpm build                     # Build all packages
pnpm build:web                 # Build only web app
pnpm build:server              # Build only server

# Linting & Type Checking
pnpm lint                      # Lint all packages
pnpm type-check               # Type check all packages
pnpm check                    # Run lint and type-check

# Database Operations
pnpm db:generate              # Generate database client
pnpm db:migrate               # Run migrations
pnpm db:push                  # Push schema changes
pnpm db:studio                # Open database studio

# Package Management
pnpm -r <command>             # Run command in all packages
pnpm --filter <name> <cmd>    # Run command in specific package
pnpm --filter "..." <cmd>     # Run command in packages matching pattern
```

### Workspace Package Commands
```bash
# In apps/web
pnpm dev                      # Next.js dev server
pnpm build                    # Production build
pnpm start                    # Start production server
pnpm type-check              # TypeScript check
pnpm lint                    # Biome linting

# In apps/server
pnpm dev                     # Development with tsx watch
pnpm build                   # TypeScript compilation
pnpm start                   # Production Node.js server
```

---

## Vercel Deployment Optimization

### Build Optimization Strategies

#### 1. Dependency Caching
```json
{
  "installCommand": "cd ../../ && pnpm install --frozen-lockfile",
  "buildCommand": "cd ../../ && pnpm run build:web"
}
```

#### 2. Parallel Builds
```bash
# In root package.json
{
  "scripts": {
    "build:web": "pnpm --filter web build",
    "build:server": "pnpm --filter server build",
    "build:all": "pnpm -r build"
  }
}
```

#### 3. Environment Variables
```bash
# .env.production (at root)
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

#### 4. Vercel-Specific Optimizations
```json
{
  "framework": "nextjs",
  "outputDirectory": ".next",
  "installCommand": "cd ../../ && pnpm install --frozen-lockfile",
  "buildCommand": "cd ../../ && pnpm run build:web",
  "functions": {
    "apps/web/pages/api/**/*.ts": {
      "runtime": "nodejs20.x",
      "memory": 1024,
      "maxDuration": 10
    }
  }
}
```

---

## CI/CD Pipeline Updates

### GitHub Actions Example
```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup pnpm
        uses: pnpm/action-setup@v3
        with:
          version: 9.0.0
          
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'pnpm'
          
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
        
      - name: Run type checking
        run: pnpm type-check
        
      - name: Run linting
        run: pnpm lint
        
      - name: Build applications
        run: pnpm build
        
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: apps/web
```

---

## Troubleshooting

### Common Issues and Solutions

#### 1. Module Resolution Errors
```bash
# Issue: Cannot find workspace packages
# Solution: Check pnpm-workspace.yaml configuration
pnpm list --depth=0  # Verify package linking

# Fix workspace package imports
pnpm add @ecomerceNextjs/ui --filter=web
```

#### 2. Build Failures
```bash
# Issue: TypeScript compilation errors
# Solution: Check tsconfig.json paths configuration
pnpm --filter web exec tsc --noEmit --listFiles

# Clean and rebuild
pnpm clean:build
pnpm install
pnpm build
```

#### 3. Dependency Conflicts
```bash
# Issue: Version conflicts between packages
# Solution: Use pnpm catalog for version alignment
pnpm why react  # Check why specific versions are installed

# Update conflicting packages
pnpm update react react-dom --filter "*"
```

#### 4. Vercel Deployment Issues
```bash
# Issue: Build timeout on Vercel
# Solution: Optimize build process
# 1. Reduce build complexity
# 2. Use --frozen-lockfile for consistent installs
# 3. Optimize Next.js configuration

# Debug Vercel builds
vercel logs --limit 50
```

#### 5. Environment Variable Issues
```bash
# Issue: Missing environment variables
# Solution: Ensure proper .env file setup
# Create .env.development and .env.production at root

# Verify environment variables
pnpm --filter web exec next dev --debug
```

---

## Verification Steps

### 1. Local Development Verification
```bash
# 1. Install dependencies
pnpm install

# 2. Start development servers
pnpm dev

# 3. Verify applications load
# - Web app: http://localhost:3001
# - Server: http://localhost:3000 (if configured)

# 4. Test package linking
pnpm --filter web exec ls node_modules/@ecomerceNextjs/
```

### 2. Build Verification
```bash
# 1. Clean all builds
pnpm clean:build

# 2. Build all packages
pnpm build

# 3. Verify build outputs
ls -la apps/web/.next
ls -la apps/server/dist

# 4. Test production builds
pnpm start:web &
pnpm start:server &
```

### 3. Type Checking Verification
```bash
# 1. Run type checking
pnpm type-check

# 2. Check for TypeScript errors
pnpm --filter web exec tsc --noEmit
pnpm --filter server exec tsc --noEmit
```

### 4. Linting Verification
```bash
# 1. Run linting
pnpm lint

# 2. Fix linting issues
pnpm lint:fix

# 3. Verify code quality
pnpm check
```

### 5. Vercel Deployment Verification
```bash
# 1. Deploy preview
vercel --debug

# 2. Check deployment logs
vercel logs

# 3. Test production URLs
curl https://your-app.vercel.app/api/health
```

### 6. Performance Verification
```bash
# 1. Compare build times
time pnpm build
# Previous: time turbo run build

# 2. Check bundle sizes
pnpm --filter web exec next build --debug

# 3. Analyze dependency tree
pnpm why react
pnpm list --depth=1
```

---

## Rollback Plan

### Quick Rollback (if migration fails)
```bash
# 1. Restore from backup branch
git checkout backup/turbo-bun-setup

# 2. Restore Bun lock file (if needed)
git checkout HEAD -- bun.lockb

# 3. Reinstall with Bun
bun install

# 4. Verify everything works
bun run dev
```

### Complete Rollback Procedure
```bash
# 1. Stash current changes
git stash

# 2. Switch to backup
git checkout backup/turbo-bun-setup

# 3. Remove pnpm artifacts
rm -f pnpm-lock.yaml
rm -rf node_modules
rm -rf .pnpm-store

# 4. Restore Bun environment
bun install

# 5. Test rollback
bun run build
bun run dev
```

### Rollback Verification Checklist
- [ ] Bun dev server starts correctly
- [ ] Turbo commands work as expected
- [ ] All packages build successfully
- [ ] Type checking passes
- [ ] Linting passes
- [ ] Vercel deployment (if needed) works

### Post-Rollback Cleanup
```bash
# Remove pnpm global installation (optional)
npm uninstall -g pnpm

# Clean up any remaining pnpm files
find . -name "pnpm-lock.yaml" -delete
find . -name ".pnpm-store" -type d -exec rm -rf {} +
```

---

## Migration Timeline

### Estimated Time: 2-4 hours

- **Preparation**: 15-30 minutes
- **File updates**: 30-60 minutes
- **Dependency migration**: 30-60 minutes
- **Testing and verification**: 60-90 minutes
- **Deployment testing**: 30-45 minutes

### Critical Path Items
1. ⚠️ Root package.json updates
2. ⚠️ Workspace package.json updates
3. ⚠️ Vercel configuration changes
4. ⚠️ Dependency resolution and linking
5. ✅ Build system migration
6. ✅ Runtime compatibility

---

## Support and Resources

### Documentation Links
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Vercel pnpm Support](https://vercel.com/docs/concepts/monorepos/pnpm)
- [Next.js with pnpm](https://nextjs.org/docs/app/building-your-application/deploying#using-pnpm)

### Common Commands Cheat Sheet
```bash
# Quick reference for daily usage
pnpm i               # Install
pnpm dev             # Start dev
pnpm build           # Build
pnpm lint            # Lint
pnpm test            # Test
pnpm -r <cmd>        # Run in all packages
pnpm --filter <pkg>  # Run in specific package
```

### Migration Checklist
- [ ] Backup current setup
- [ ] Install pnpm globally
- [ ] Remove Bun artifacts
- [ ] Update root package.json
- [ ] Create/update pnpm-workspace.yaml
- [ ] Update all workspace package.json files
- [ ] Update Vercel configurations
- [ ] Install dependencies with pnpm
- [ ] Test all build commands
- [ ] Verify development workflow
- [ ] Test Vercel deployment
- [ ] Update CI/CD pipelines
- [ ] Document changes for team

---

*This migration guide provides a comprehensive approach to transitioning from Turborepo + Bun to pnpm workspaces + Node.js. Follow the steps sequentially and verify each stage before proceeding to the next.*