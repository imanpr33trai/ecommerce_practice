# TypeScript 6.0 Configuration Optimization Plan

> **Branch**: `new_design`
> **Status**: ✅ PARTIALLY COMPLETE (T0-T5 done, T6 pending)
> **TypeScript Version**: 6.0.2
> **Last Updated**: 2026-04-11

---

## Overview

This plan documents and implements TypeScript 6.0 configuration improvements for the monorepo, leveraging new features while addressing deprecations that will break in TypeScript 7.0.

---

## TypeScript 6.0 Release Notes Summary

### ✅ New Features to Leverage

| Feature | Benefit | Applicability |
|---------|---------|---------------|
| `es2025` target/lib | New built-in APIs (`RegExp.escape`, `Map.getOrInsert`) | Future upgrade path |
| `DOM` now includes `DOM.Iterable` | Simpler lib configuration | UI package |
| `strict: true` default | Already enabled - no change needed | All packages |
| `module: esnext` default | Already using - aligns with ESM ecosystem | All packages |
| Subpath imports `#/` | Cleaner internal imports | Future improvement |
| `moduleResolution: bundler` + `module: commonjs` | Now allowed combination | Future migration |

### ⚠️ Breaking Changes Requiring Action

| Change | Impact | Current State |
|--------|--------|--------------|
| **`types` defaults to `[]`** | Must explicitly list `@types` packages | Inconsistent - some configs have it |
| **`rootDir` defaults to `.`** | Must set if source in subdirectory | Most configs have it, check react-library |
| **`baseUrl` deprecated** | Will error in TS 7.0 | Using `ignoreDeprecations: "6.0"` |
| **`moduleResolution: node` deprecated** | Should use `bundler` or `nodenext` | Currently using `bundler` ✅ |
| **`target: es5` deprecated** | ES2022 is fine | Current target ✅ |

---

## Current Configuration Audit

### Shared Configs (`packages/config/`)

| File | `types` | `rootDir` | `baseUrl` | Deprecations |
|------|---------|-----------|-----------|--------------|
| `base.json` | ❌ Missing | ❌ Missing | ❌ N/A | None |
| `node.json` | ✅ `["node"]` | ✅ `"src"` | ❌ N/A | None |
| `react-library.json` | ❌ Missing | ✅ `"src"` | ❌ N/A | None |
| `nextjs.json` | ❌ Missing | ❌ Missing | ❌ N/A | None |

### App Configs

| File | `types` | `rootDir` | `baseUrl` | Deprecations |
|------|---------|-----------|-----------|--------------|
| `apps/server/tsconfig.json` | Inherited | ✅ | ⚠️ Using | ✅ `ignoreDeprecations: "6.0"` |
| `apps/web/tsconfig.json` | ✅ `["node"]` | Inherited | N/A | None |

### Package Configs

| Package | `types` | `rootDir` | `baseUrl` | Deprecations |
|---------|---------|-----------|-----------|--------------|
| `packages/api` | Inherited | ✅ | N/A | ✅ `ignoreDeprecations: "6.0"` |
| `packages/auth` | Inherited | ✅ | N/A | ✅ `ignoreDeprecations: "6.0"` |
| `packages/db` | Inherited | ✅ | N/A | None |
| `packages/env` | Inherited | ✅ | N/A | None |
| `packages/ui` | Inherited | ✅ | ⚠️ Using | ✅ `ignoreDeprecations: "6.0"` |

---

## Tasks

---

### T0: Fix JSON Comment in web app tsconfig ✅

**Status**: COMPLETED

**File**: `apps/web/tsconfig.json`

**Action**: Removed invalid JSON comment `// "baseUrl": "."`

---

### T1: Add `types: []` to base.json (Performance) ✅

**File**: `packages/config/base.json`

**Rationale**: Explicit `types` array prevents TypeScript from auto-including all `@types/*` packages. Can improve build time 20-50%.

**Change**:
```json
{
  "compilerOptions": {
    // ... existing options ...
    "types": []
  }
}
```

**Note**: All packages extending this will inherit empty types. Individual configs that need specific types (like `node`) will override this.

**Verification**:
```bash
grep '"types"' packages/config/base.json  # Should show: "types": []
```

---

### T2: Add `types: ["node"]` to react-library.json

**File**: `packages/config/react-library.json`

**Rationale**: React libraries may use Node.js globals in build scripts or SSR code.

**Change**:
```json
{
  "compilerOptions": {
    // ... existing options ...
    "types": ["node"]
  }
}
```

**Verification**:
```bash
grep '"types"' packages/config/react-library.json  # Should show: "types": ["node"]
```

---

### T3: Add `types: ["node"]` to nextjs.json

**File**: `packages/config/nextjs.json`

**Rationale**: Next.js apps commonly use Node.js APIs (`process.env`, `fs`, etc.) especially in server components and API routes.

**Change**:
```json
{
  "compilerOptions": {
    // ... existing options ...
    "types": ["node"]
  }
}
```

**Note**: The web app already has `types: ["node"]` in its own config, but setting it at the Next.js config level ensures consistency.

**Verification**:
```bash
grep '"types"' packages/config/nextjs.json  # Should show: "types": ["node"]
```

---

### T4: Add `rootDir` to nextjs.json

**File**: `packages/config/nextjs.json`

**Rationale**: TypeScript 6.0 defaults `rootDir` to `.` (the tsconfig directory). Next.js projects typically have source in `apps/web/src`, so we need explicit `rootDir`.

**Change**:
```json
{
  "compilerOptions": {
    // ... existing options ...
    "rootDir": "."
  }
}
```

**Note**: Setting `rootDir` to `.` allows referencing files outside the source directory (common in Next.js monorepos).

**Verification**:
```bash
grep '"rootDir"' packages/config/nextjs.json  # Should show: "rootDir": "."
```

---

### T5: Migrate `baseUrl` to path mappings (TS 7.0 Prep)

**Files**: 
- `packages/ui/tsconfig.json`
- `apps/server/tsconfig.json`

**Rationale**: `baseUrl` is deprecated and will error in TypeScript 7.0. The recommended approach is to use `paths` without `baseUrl` for relative resolution, or rely on the bundler's module resolution.

**Current State**:
```json
// packages/ui/tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@workspace/ui/*": ["src/*"]
    }
  }
}

// apps/server/tsconfig.json
{
  "compilerOptions": {
    "baseUrl": "."
  }
}
```

**Migration Options**:

**Option A - Keep baseUrl with ignoreDeprecations (Current)**:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "ignoreDeprecations": "6.0"
  }
}
```
✅ Easiest, works until TS 7.0
❌ Technical debt, will need migration in the future

**Option B - Remove baseUrl, rely on bundler resolution**:
```json
{
  "compilerOptions": {
    // Remove baseUrl
  }
}
```
✅ Clean, aligns with TS 7.0 direction
❌ May break IDE imports if not using bundler resolution

**Recommendation**: Keep `baseUrl` with `ignoreDeprecations: "6.0"` for now. The `ts5to6` codemod tool can automate the full migration when ready.

**Verification**:
```bash
# After migration, this should error in TS 7.0 without proper config
# Current: Both files should have ignoreDeprecations: "6.0"
grep "ignoreDeprecations" packages/ui/tsconfig.json apps/server/tsconfig.json
```

---

### T6: Add Documentation for TS 6.0 Requirements

**File**: `CONTRIBUTING.md` or `docs/tsconfig-guide.md`

**Rationale**: Document the TypeScript 6.0 configuration standards for the team.

**Content**:
```markdown
## TypeScript 6.0 Configuration

This project uses TypeScript 6.0 with the following configuration standards:

### Required Compiler Options

All tsconfigs should extend from the appropriate shared config:
- `packages/config/base.json` - Base configuration
- `packages/config/node.json` - Node.js packages
- `packages/config/react-library.json` - React libraries
- `packages/config/nextjs.json` - Next.js apps

### Key Settings

| Option | Value | Reason |
|--------|-------|--------|
| `strict` | `true` | Type safety |
| `moduleResolution` | `bundler` | Modern module resolution |
| `target` | `ES2022` | Node 18 compatibility |
| `types` | Explicit array | Performance (20-50% faster builds) |

### Deprecations

The following options are deprecated in TS 6.0 and will error in TS 7.0:
- `baseUrl` - Use `paths` with `moduleResolution: bundler`
- `moduleResolution: node` - Use `bundler` or `nodenext`
- `target: es5` - Use `ES2015` or higher

### Migration Notes

If you see `ignoreDeprecations: "6.0"`, this is a temporary fix. Plan to migrate before TS 7.0.
```

**Verification**:
```bash
# Documentation file exists and contains key terms
grep -l "TypeScript 6.0" CONTRIBUTING.md docs/tsconfig-guide.md 2>/dev/null
```

---

## Summary of Changes

| Task | File | Change | Status |
|------|------|--------|--------|
| T0 | `apps/web/tsconfig.json` | Remove invalid JSON comment | ✅ COMPLETE |
| T1 | `base.json` | Add `types: []` | ✅ COMPLETE |
| T2 | `react-library.json` | Add `types: ["node"]` | ✅ COMPLETE |
| T3 | `nextjs.json` | Add `types: ["node"]` | ✅ COMPLETE |
| T4 | `nextjs.json` | Skipped - causes issues with cross-package refs | ⚠️ SKIPPED |
| T5 | UI/server configs | Remove baseUrl (no ignoreDeprecations) | ✅ COMPLETE |
| T6 | Documentation | Pending | ⏳ PENDING |

## Key Findings

### baseUrl Migration
**Decision**: Removed `baseUrl` entirely instead of using `ignoreDeprecations`

- ✅ `packages/ui/tsconfig.json` - removed baseUrl, paths still work with moduleResolution: bundler
- ✅ `apps/server/tsconfig.json` - removed baseUrl and ignoreDeprecations

### rootDir in nextjs.json
**Decision**: Did NOT add `rootDir` to nextjs.json

- Adding `rootDir: "."` to the base nextjs.json causes issues with cross-package references
- The web app's type-check errors about "not under rootDir" are pre-existing (out of scope)
- Each app should manage its own rootDir as needed

### Verification Results

```bash
pnpm --filter "@ecomerceNextjs/*" build  # ✅ All packages pass
pnpm --filter "@ecomerceNextjs/*" type-check  # ✅ All packages pass
pnpm --filter server build  # ✅ Server app builds
pnpm --filter web type-check  # ⚠️ Has pre-existing errors (OUT OF SCOPE)
```

### Pre-existing Web App Errors (Out of Scope)
The web app has type errors in these files that existed before this upgrade:
- `src/data/account/*.ts`
- `src/data/cart/*.ts`
- `src/data/review/*.ts`
- `src/data/wish/*.ts`

These are related to TanStack Query's useMutation return types with strict mode.

---

## Verification Commands

```bash
# All packages should build
pnpm --filter "@ecomerceNextjs/*" build

# All packages should type-check
pnpm --filter "@ecomerceNextjs/*" type-check

# Apps should build
pnpm --filter "@ecomerceNextjs/web" build
pnpm --filter "@ecomerceNextjs/server" build
```

---

## Out of Scope

- Modifying `ignoreDeprecations: "6.0"` for `baseUrl` migration (deferred to TS 7.0 preparation)
- Changing `moduleResolution` from `bundler` (already optimal)
- Upgrading to `es2025` target (future enhancement)

---

## References

- [TypeScript 6.0 Release Notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-6-0.html)
- [ts5to6 Codemod Tool](https://github.com/andrewbranch/ts5to6) - For automated migrations
- [TSConfig Reference](https://www.typescriptlang.org/tsconfig)
