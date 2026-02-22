# Hybrid JIT/AOT Development Guide

## Overview

This monorepo uses a **hybrid compilation strategy** to balance development speed with production optimization:

- **AOT (Ahead-of-Time)**: Prebuild stable packages once
- **JIT (Just-in-Time)**: Watch actively developed packages

## Package Strategy

| Package                  | Type       | Strategy | Reason                                 |
| ------------------------ | ---------- | -------- | -------------------------------------- |
| `@ecomerceNextjs/env`    | Library    | **AOT**  | Rarely changes                         |
| `@ecomerceNextjs/db`     | Library    | **AOT**  | Stable, only changes on schema updates |
| `@ecomerceNextjs/auth`   | Library    | **AOT**  | Stable, Better Auth is stable          |
| `@ecomerceNextjs/config` | Config     | **N/A**  | Configuration only                     |
| `@ecomerceNextjs/api`    | Library    | **JIT**  | Actively developed                     |
| `@workspace/ui`          | UI Library | **JIT**  | Next.js handles this                   |
| `server`                 | App        | **JIT**  | Actively developed                     |
| `web`                    | App        | **JIT**  | Next.js has own watcher                |

## Quick Start

### Standard Development (Recommended)

```bash
# Start development with hybrid strategy
pnpm dev
```

This will:

1. **Prebuild** stable packages (env, db, auth) - ~5 seconds
2. **Watch** active packages (api, server, web) - instant reload
3. Use **10 concurrent processes** for optimal performance

### Full Watch Mode (All Packages)

```bash
# Watch ALL packages (resource intensive)
pnpm dev:full
```

Use this only when:

- Modifying multiple packages simultaneously
- Debugging package build issues
- Testing package exports

### Package-Specific Development

```bash
# Watch only server
pnpm dev:server

# Watch only web (Next.js)
pnpm dev:web

# Watch only API package
pnpm dev:api
```

## Performance Comparison

| Mode                  | Startup Time | Memory | CPU      | Use Case          |
| --------------------- | ------------ | ------ | -------- | ----------------- |
| **Hybrid (pnpm dev)** | ~5s          | ~500MB | Low      | Daily development |
| **Full Watch**        | ~15s         | ~1.5GB | High     | Package debugging |
| **Server Only**       | ~3s          | ~300MB | Very Low | Backend-only work |

## Workflow

### 1. First Time Setup

```bash
# Install dependencies
pnpm install

# Build all packages once
pnpm build:packages

# Start database
pnpm db:start

# Run migrations
pnpm db:migrate

# Start development
pnpm dev
```

### 2. Daily Development

```bash
# Start database (if not running)
pnpm db:start

# Start development server
pnpm dev
```

That's it! The script handles:

- ✅ Prebuilding stable packages
- ✅ Watching active packages
- ✅ Hot reload on changes
- ✅ Type checking in background

### 3. When Modifying Stable Packages

If you modify `env`, `db`, or `auth`:

```bash
# Option 1: Rebuild specific package
pnpm --filter @ecomerceNextjs/db build

# Option 2: Rebuild all stable packages
pnpm build:packages

# Option 3: Restart dev (will auto-rebuild)
# Press Ctrl+C, then run:
pnpm dev
```

### 4. Production Build

```bash
# Clean and build everything
pnpm build

# This runs prebuild automatically
```

## Architecture

### File Flow

```
Source Code (src/)
    ↓
Development Mode
    ↓
┌──────────────────────────────────────┐
│  Stable Packages (AOT - Prebuilt)    │
│  ├── env/dist/                       │
│  ├── db/dist/                        │
│  └── auth/dist/                      │
├──────────────────────────────────────┤
│  Active Packages (JIT - Watched)     │
│  ├── api/dist/ ← watcher             │
│  ├── server/dist/ ← watcher          │
│  └── web/.next/ ← Next.js watcher    │
└──────────────────────────────────────┘
    ↓
Runtime (tsx/Next.js)
    ↓
Browser/Client
```

### Import Resolution

```typescript
// In development (after pnpm dev):
import { prisma } from "@ecomerceNextjs/db";
// Resolves to: packages/db/dist/index.js (prebuilt)

// In development (watched):
import { api } from "@ecomerceNextjs/api";
// Resolves to: packages/api/dist/index.js (rebuilt on change)

// In production:
// All packages use dist/ from build step
```

## Optimization Tips

### 1. Reduce Rebuild Frequency

tsup configs ignore test files:

```typescript
// packages/api/tsup.config.ts
export default defineConfig({
  ignoreWatch: ["**/*.test.ts", "**/*.spec.ts", "dist/**"],
});
```

### 2. Use Inline Sourcemaps in Dev

Faster than separate files:

```typescript
sourcemap: options.watch ? "inline" : true,
```

### 3. External Dependencies

Don't bundle large deps:

```typescript
external: ["hono", "better-auth", "zod"],
```

### 4. Disable Splitting

Faster builds, slightly larger output:

```typescript
splitting: false, // Default in all configs
```

## Troubleshooting

### Issue: Changes Not Reflecting

```bash
# 1. Check if dist/ exists
ls packages/db/dist/

# 2. Force rebuild
pnpm --filter @ecomerceNextjs/db clean
pnpm --filter @ecomerceNextjs/db build

# 3. Restart dev
pnpm dev
```

### Issue: High CPU Usage

```bash
# Use hybrid mode instead of full
pnpm dev  # Instead of pnpm dev:full

# Or watch only what you need
pnpm dev:server  # Only server
pnpm dev:web     # Only web
```

### Issue: Type Errors in Stable Packages

```bash
# Rebuild with type checking
pnpm --filter @ecomerceNextjs/db build
pnpm --filter @ecomerceNextjs/db type-check
```

### Issue: Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3002 pnpm dev:server
```

## Commands Reference

| Command               | Description               | Use Case          |
| --------------------- | ------------------------- | ----------------- |
| `pnpm dev`            | Hybrid mode (recommended) | Daily development |
| `pnpm dev:full`       | Watch all packages        | Package debugging |
| `pnpm dev:server`     | Watch server only         | Backend work      |
| `pnpm dev:web`        | Watch web only            | Frontend work     |
| `pnpm dev:api`        | Watch api only            | API work          |
| `pnpm build:packages` | Build all libraries       | Before production |
| `pnpm build`          | Full production build     | Deployment        |
| `pnpm clean`          | Remove all dist/          | Reset state       |

## Best Practices

1. **Use `pnpm dev` for daily work** - It's optimized for speed
2. **Commit dist/ files** - They're part of the package exports
3. **Run type-check before commit** - `pnpm check`
4. **Rebuild stable packages after changes** - Or restart `pnpm dev`
5. **Use package-specific dev when possible** - Less resource usage

## Migration from Old Workflow

### Before (All JIT)

```bash
# Old way - watched everything
pnpm dev
# → 6 watchers, high CPU, slow startup
```

### After (Hybrid)

```bash
# New way - prebuild + watch
pnpm dev
# → 3 watchers, low CPU, fast startup
```

No code changes needed! The hybrid strategy works with your existing imports.
