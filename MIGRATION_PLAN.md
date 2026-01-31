# Migration Plan: Turborepo + Bun → pnpm Workspaces + Node.js

## Overview
This document outlines the comprehensive migration strategy for moving from a Turborepo + Bun setup to pnpm workspaces + Node.js runtime for optimal Vercel deployment.

## Migration Phases

### Phase 1: Preparation & Backup
1. **Backup Current State**
   ```bash
   git checkout -b backup/turbo-bun-state
   git add .
   git commit -m "Backup: Current Turborepo + Bun state"
   ```

2. **Document Current Functionality**
   - List all existing scripts and their purposes
   - Document development workflow
   - Test current deployment process

### Phase 2: Package Manager Migration (Bun → pnpm)

#### 2.1 Install pnpm and Initialize Workspace
```bash
# Install pnpm globally
npm install -g pnpm@9.15.4

# Backup current lockfile
cp bun.lockb bun.lockb.backup 2>/dev/null || true

# Install dependencies with pnpm
pnpm install
```

#### 2.2 Update Package.json Files
**Root Package.json Changes:**
- Replace `"packageManager": "bun@1.3.3"` with `"packageManager": "pnpm@9.15.4"`
- Update engines from Bun to Node.js + pnpm
- Replace turbo commands with pnpm workspace commands
- Add `concurrently` for parallel development servers

**App Package.json Changes:**
- Remove Bun-specific flags (`--bun`, `--env-file`)
- Update scripts to use Node.js runtime
- Add clean scripts for better cache management

### Phase 3: Build System Migration (Turborepo → pnpm)

#### 3.1 Remove Turborepo Configuration
```bash
# Remove turbo configuration (if exists)
rm -f turbo.json
```

#### 3.2 Replace Turbo Commands with pnpm Equivalents

| Turbo Command | pnpm Equivalent |
|---------------|-----------------|
| `turbo run build` | `pnpm -r run build` |
| `turbo run --filter=web build` | `pnpm --filter web run build` |
| `turbo run --affected build` | `pnpm --filter="...main" run build` |
| `turbo lint` | `pnpm -r run lint` |
| `turbo type-check` | `pnpm -r run type-check` |

#### 3.3 Workspace Script Optimization
```bash
# Parallel builds for packages
pnpm -r --parallel run build

# Sequential builds for apps (respect dependencies)
pnpm --filter web run build
pnpm --filter server run build

# Development with hot reload
pnpm -r --parallel run dev
```

### Phase 4: Runtime Migration (Bun → Node.js)

#### 4.1 Update Development Scripts
**Before (Bun):**
```json
"dev": "bun --env-file=../../.env.development --bun next dev -p 3001"
```

**After (Node.js):**
```json
"dev": "NODE_ENV=development next dev -p 3001"
```

#### 4.2 Update Production Scripts
**Before (Bun):**
```json
"build": "bun --env-file=../../.env.production --bun next build",
"start": "bun --bun next start -p 3001"
```

**After (Node.js):**
```json
"build": "NODE_ENV=production next build",
"start": "NODE_ENV=production next start -p 3001"
```

#### 4.3 Server Runtime Updates
**Before (Bun):**
```json
"dev": "bun --env-file=../../.env.development run --hot src/index.ts",
"start": "bun dist/index.js"
```

**After (Node.js):**
```json
"dev": "NODE_ENV=development node --watch src/index.ts",
"start": "NODE_ENV=production node dist/index.js"
```

### Phase 5: Vercel Deployment Optimization

#### 5.1 Update Vercel Configuration
- Change install commands from `bun install` to `pnpm install`
- Update build commands to use pnpm scripts
- Ensure Node.js runtime is specified (nodejs20.x)

#### 5.2 Environment Variable Management
- Remove Bun-specific environment variables
- Update Node.js environment handling
- Ensure proper `.env` file loading

#### 5.3 Build Optimization
- Enable pnpm's strict dependency checking
- Optimize bundle sizes for serverless deployment
- Configure proper caching strategies

## Migration Checklist

### Pre-Migration Checklist
- [ ] Backup current codebase
- [ ] Document current build processes
- [ ] Test current deployment pipeline
- [ ] Review all custom scripts
- [ ] Identify Bun-specific features

### Migration Checklist
- [ ] Install pnpm globally
- [ ] Update root package.json
- [ ] Create pnpm-workspace.yaml
- [ ] Update all app package.json files
- [ ] Update all package package.json files
- [ ] Replace turbo commands with pnpm equivalents
- [ ] Update development scripts for Node.js
- [ ] Update Vercel configurations
- [ ] Update deployment scripts
- [ ] Create new GitHub Actions workflow
- [ ] Test local development
- [ ] Test build processes
- [ ] Test deployment

### Post-Migration Checklist
- [ ] Verify all scripts work correctly
- [ ] Test development workflow
- [ ] Verify deployment process
- [ ] Check build times and performance
- [ ] Update documentation
- [ ] Clean up old configurations
- [ ] Update team on new processes

## Benefits of Migration

### Performance Benefits
- **Faster dependency resolution**: pnpm's efficient algorithm
- **Reduced disk usage**: Shared dependency storage
- **Better caching**: pnpm's local cache optimization
- **Improved CI performance**: Smaller lockfile, faster installs

### Vercel Benefits
- **Native Node.js support**: Better serverless performance
- **Smaller deployment packages**: No Bun runtime overhead
- **Better debugging**: Full Node.js debugging capabilities
- **Improved cold start times**: Optimized for serverless

### Development Benefits
- **Standard tooling**: Wider ecosystem compatibility
- **Better TypeScript support**: Native Node.js TypeScript execution
- **Improved debugging**: Better VS Code integration
- **Community support**: Larger pnpm and Node.js communities

## Potential Issues & Solutions

### Issue 1: Bun-specific APIs
**Problem**: Code using Bun-specific APIs
**Solution**: Replace with Node.js equivalents or polyfills

### Issue 2: Environment Variable Loading
**Problem**: Different environment variable handling
**Solution**: Use dotenv package and explicit NODE_ENV

### Issue 3: Build Performance
**Problem**: Slower builds without Bun
**Solution**: Optimize TypeScript configuration and use SWC

### Issue 4: Dependency Resolution
**Problem**: Different dependency handling
**Solution**: Review and adjust peer dependencies

## Rollback Plan

If migration fails, rollback steps:
1. Restore from backup branch
2. Reinstall Bun
3. Restore original package.json files
4. Restore Turborepo configuration
5. Re-enable Bun-specific scripts

## Migration Timeline

**Estimated Duration**: 2-3 days

**Phase 1**: 0.5 day (Preparation & Backup)
**Phase 2**: 0.5 day (Package Manager Migration)
**Phase 3**: 0.5 day (Build System Migration)
**Phase 4**: 0.5 day (Runtime Migration)
**Phase 5**: 0.5 day (Vercel Optimization & Testing)
**Phase 6**: 0.5 day (Documentation & Cleanup)

## Success Criteria

1. All existing scripts work with pnpm
2. Development workflow is fully functional
3. Build times are equal or better
4. Vercel deployment works correctly
5. No functionality regression
6. Team is trained on new workflow
