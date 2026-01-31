# Migration Summary: Turborepo + Bun → pnpm Workspaces + Node.js

## Quick Migration Overview

This migration transforms your monorepo from Bun + Turborepo to pnpm + Node.js for optimal Vercel deployment. Here's what needs to be done:

## Files That Need Updates

### 1. Root Level Files
- ✅ `package.json` → `package.json.new`
- ✅ `pnpm-workspace.yaml` → **NEW**
- ❌ `turbo.json` → **DELETE** (if exists)
- ❌ `bun.lockb` → **DELETE**
- ✅ `.github/workflows/vercel-deploy-pnpm.yml` → **NEW**

### 2. App Level Files
#### Web App (`apps/web/`)
- ✅ `package.json` → `apps/web/package.json.new`
- ✅ `vercel.json` → `apps/web/vercel.json.new`

#### Server App (`apps/server/`)
- ✅ `package.json` → `apps/server/package.json.new`
- ✅ `vercel.json` → **NEW** (`apps/server/vercel.json`)

### 3. Scripts
- ✅ `scripts/deploy.sh` → `scripts/deploy-pnpm.sh`

### 4. Package Files (`packages/*/`)
- ⚠️ All package.json files need review for Bun dependencies

## Key Changes Summary

### Package Manager Changes
| From (Bun) | To (pnpm) |
|------------|-----------|
| `bun install` | `pnpm install` |
| `bun run` | `pnpm run` |
| `bun.lockb` | `pnpm-lock.yaml` |

### Build System Changes
| From (Turborepo) | To (pnpm) |
|------------------|-----------|
| `turbo run build` | `pnpm -r run build` |
| `turbo run --filter=web build` | `pnpm --filter web run build` |
| `turbo run --affected build` | `pnpm --filter="...main" run build` |

### Runtime Changes
| From (Bun) | To (Node.js) |
|------------|-------------|
| `bun --bun next dev` | `NODE_ENV=development next dev` |
| `bun --env-file=... next build` | `NODE_ENV=production next build` |
| `bun dist/index.js` | `node dist/index.js` |

## Migration Commands

### Quick Start
```bash
# 1. Backup and install pnpm
git checkout -b migration/pnpm-nodejs
npm install -g pnpm@9.15.4

# 2. Update root configuration
cp package.json.new package.json
git add pnpm-workspace.yaml package.json.new
git commit -m "Update root for pnpm"

# 3. Update applications
cp apps/web/package.json.new apps/web/package.json
cp apps/server/package.json.new apps/server/package.json
cp apps/web/vercel.json.new apps/web/vercel.json
git add apps/web/package.json apps/web/vercel.json
git add apps/server/package.json apps/server/vercel.json
git commit -m "Update apps for pnpm and Node.js"

# 4. Install dependencies
rm -rf node_modules apps/*/node_modules packages/*/node_modules
pnpm install

# 5. Test builds
pnpm run build
pnpm run type-check
pnpm run lint

# 6. Test development
pnpm run dev
```

### Production Deployment
```bash
# Update deployment script
cp scripts/deploy-pnpm.sh scripts/deploy.sh
chmod +x scripts/deploy.sh

# Test preview deployment
pnpm run deploy:preview

# Deploy to production (when ready)
pnpm run deploy:all
```

## Benefits You'll Gain

### Performance Improvements
- **Faster dependency installation**: pnpm's efficient algorithm
- **Reduced disk usage**: Shared dependencies across workspace
- **Better caching**: Improved local and CI caching
- **Smaller deployments**: No Bun runtime overhead

### Vercel Optimization
- **Native Node.js support**: Better serverless performance
- **Faster cold starts**: Optimized for Vercel's infrastructure
- **Better debugging**: Full Node.js debugging capabilities
- **Improved monitoring**: Native integration with Vercel Analytics

### Developer Experience
- **Standard tooling**: Better IDE and VS Code support
- **Larger ecosystem**: More compatible packages
- **Better TypeScript**: Native Node.js TypeScript execution
- **Improved debugging**: Better integration with dev tools

## Migration Risks & Mitigations

### Risk 1: Runtime Incompatibility
**Mitigation**: Test all APIs and database connections thoroughly
**Commands**: `pnpm run dev:server` and `pnpm run build:server`

### Risk 2: Build Performance
**Mitigation**: Optimize TypeScript and enable incremental compilation
**Commands**: Monitor build times with `time pnpm run build`

### Risk 3: Deployment Failures
**Mitigation**: Use preview deployments first, verify health endpoints
**Commands**: `pnpm run deploy:preview` then `curl /health`

## Rollback Plan
If anything goes wrong:
```bash
git checkout main
git checkout -b rollback-to-bun
git checkout backup/turbo-bun-state -- .
npm install -g bun@1.3.3
bun install
bun run deploy:preview
```

## Success Criteria
Your migration is successful when:
✅ All `pnpm run` commands work
✅ Development servers start correctly
✅ All builds complete without errors
✅ Preview deployments work
✅ Health endpoints respond correctly
✅ No functionality regression

## Post-Migration Cleanup
```bash
# Remove old configuration
rm -f turbo.json bun.lockb
rm -f package.json.new apps/web/package.json.new apps/server/package.json.new
rm -f apps/web/vercel.json.new
git add -A
git commit -m "Finalize pnpm migration"
```

## Support Resources
- **pnpm Documentation**: https://pnpm.io/
- **Vercel Node.js Guide**: https://vercel.com/guides/nodejs
- **Next.js with pnpm**: https://nextjs.org/docs/app/building-your-application/configuring/package-json-manager

---

**Migration Timeline Estimate**: 2-3 days
**Risk Level**: Low (well-established migration path)
**Rollback Time**: <30 minutes if needed
