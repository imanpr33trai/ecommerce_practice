# TypeScript Upgrade & Config Fixes - Work Plan

> **Branch**: `new_design`
> **Status**: ✅ Ready to execute
> **Scope**: Package upgrades only. Pre-existing web app type errors excluded.
> **Last Updated**: 2026-04-11

---

## Overview

**Goal**: Upgrade TypeScript to latest stable version (6.0.x) and fix tsconfig inconsistencies.

| Area | Current | Target |
|------|---------|--------|
| TypeScript Version | 5.9.3 | 6.0.x |
| Config Consistency | Mixed (14 configs) | Standardized |
| Strict Mode | Partial | Consistent |
| Build Integration | Inconsistent | Turbo-ready |

---

## Discovery Summary

### Current TypeScript Setup
- **Version**: 5.9.3
- **Total tsconfig files**: 14
- **Config inheritance**: `packages/config/` with `base.json`, `node.json`, `react-library.json`, `nextjs.json`
- **Issues found**:
  1. Naming inconsistency: `@ecommerce/config` vs `@ecomerceNextjs/config`
  2. Library target mismatch: `ESNext` vs `ES2022`
  3. `composite` flag inconsistent across packages
  4. Root extends legacy `tsconfig.base.json` instead of `base.json`

### TypeScript 6.0 Changes
- **Strict mode now enabled by default**
- **Target defaults to ES2025**
- Deprecations that will break in 7.0
- Recommended for monorepos as bridge to TS7

---

## Tasks

---

### T1: Upgrade TypeScript to 6.0.x

**File Changes**:
- EDIT: Root `package.json` (update typescript version)

**Steps**:
1. Update `typescript` in root `package.json` devDependencies to `^6.0.0`
2. Run `pnpm install` to update lockfile
3. Run `pnpm check` to identify breaking changes

**Verification**:
```bash
grep '"typescript": "^6' package.json  # Should exist
pnpm install  # Should succeed
pnpm check  # May have type errors to fix in subsequent tasks
```

---

### T2: Fix Root tsconfig Extends

**File Changes**:
- EDIT: `tsconfig.json` (root)

**Current** (inconsistent with workspace):
```json
"extends": "@ecommerce/config/tsconfig.base.json"
```

**Change to**:
```json
"extends": "@ecomerceNextjs/config/base.json"
```

**Note**: Match the workspace pattern used by other packages.

**Verification**:
```bash
grep "extends" tsconfig.json | grep "base.json"  # Should reference @ecomerceNextjs/config/base.json
```

---

### T3: Align Library Targets

**File Changes**:
- EDIT: `packages/config/base.json`

**Issue**: `tsconfig.base.json` has `lib: ["ESNext"]` but `base.json` has `lib: ["ES2022"]`

**Change to** (in `packages/config/base.json`):
```json
"lib": ["ES2022", "DOM", "DOM.Iterable"]
```

**Note**: Keep ES2022 for Node 18 compatibility. ESNext is too aggressive.

**Verification**:
```bash
grep -A2 '"lib"' packages/config/base.json  # Should show ES2022
```

---

### T4: Add composite: true to All Buildable Packages

**File Changes**:
- EDIT: `packages/api/tsconfig.json`
- EDIT: `packages/db/tsconfig.json`

**Changes**:
Add to each package's tsconfig:
```json
{
  "compilerOptions": {
    "composite": true,
    "declaration": true,
    "declarationMap": true,
    "incremental": true
  }
}
```

**Packages needing update**:
- `packages/api/tsconfig.json` (currently composite: false)
- `packages/db/tsconfig.json` (currently composite: false)

**Note**: Keep `packages/env/tsconfig.json` with `composite: false` (env is config-only, not built).

**Verification**:
```bash
grep '"composite": true' packages/*/tsconfig.json | wc -l  # Should be 5 (api, auth, db, ui, server)
```

---

### T5: Run TypeScript Check on Packages

**Scope**: Fix type errors introduced by TS 6.0 strict mode in **packages only**.

**Approach**: 
1. Run `pnpm --filter @ecomerceNextjs/api check`
2. Run `pnpm --filter @ecomerceNextjs/auth check`
3. Run `pnpm --filter @ecomerceNextjs/db check`
4. Run `pnpm --filter @ecomerceNextjs/env check`
5. Run `pnpm --filter @ecomerceNextjs/ui check`

**Note**: Web app type errors are OUT OF SCOPE (tracked separately).

**Verification**:
```bash
pnpm --filter @ecomerceNextjs/api check  # Should pass
pnpm --filter @ecomerceNextjs/auth check  # Should pass
pnpm --filter @ecomerceNextjs/db check   # Should pass
pnpm --filter @ecomerceNextjs/env check   # Should pass
pnpm --filter @ecomerceNextjs/ui check   # Should pass
```

---

### T6: Update Documentation

**File Changes**:
- EDIT: README or CONTRIBUTING.md (optional)

**Add note about TypeScript version requirement**:
```markdown
## Requirements

- Node.js 18+
- pnpm 8+
- TypeScript 6.0+ (managed via pnpm workspaces)
```

---

## Commit Strategy

| Task | Commit Message |
|------|---------------|
| T1 | `feat(deps): upgrade TypeScript to 6.0.x` |
| T2 | `fix(config): align root tsconfig extends` |
| T3 | `fix(config): align library targets to ES2022` |
| T4 | `feat(build): enable composite mode for packages` |
| T5 | `fix(types): address TS 6.0 strict mode errors` |
| T6 | `docs: update version requirements` |

---

## Guardrails

- ❌ No business logic changes
- ❌ No new dependencies (except TypeScript upgrade)
- ❌ No breaking changes to runtime behavior
- ❌ Do not modify source files to bypass type errors

---

## Success Criteria

```bash
pnpm install                    # PASS
pnpm --filter "@ecomerceNextjs/*" build  # PASS (all packages)
pnpm --filter "@ecomerceNextjs/*" check   # PASS (packages only, web excluded)
```

---

## Out of Scope

Pre-existing web app type errors (tracked separately):
- `apps/web/src/data/cart/use-cart-update-quantity.ts:23`
- `apps/web/src/data/account/use-update-profile.ts:26`
- `apps/web/src/data/account/use-delete-address.ts:19`
