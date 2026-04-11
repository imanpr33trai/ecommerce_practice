# Code Review Fixes - Learnings

## 2026-04-10 - Biome to oxlint Migration

### What was removed:
- Deleted `packages/config/biome/` directory (contained core/, next/, react/ biome.jsonc configs)
- Note: No `biome.jsonc` at project root level existed
- Removed `@biomejs/biome` from root `package.json` devDependencies

### How scripts were updated:
Updated lint scripts in 7 package.json files from `biome check .` to `oxlint`:
- `packages/ui/package.json`
- `packages/env/package.json`
- `packages/auth/package.json`
- `packages/api/package.json`
- `packages/db/package.json`
- `apps/web/package.json` (also added `lint:fix` script)
- `apps/server/package.json` (also added `lint:fix` script)

### Pre-existing lint issues discovered:
The codebase has pre-existing oxlint errors from oxlint's stricter rules:
- eslint(func-style): Expects function expressions, not declarations
- eslint-plugin-react(jsx-props-no-spreading): Prop spreading forbidden
- eslint(sort-imports): Import sorting issues
- eslint(no-magic-numbers): Hardcoded numbers in code
- Various other eslint-plugin-unicorn rules

### Notes:
- oxlint and oxfmt were already installed in the project
- The task was to REMOVE Biome and set up oxlint (not fix all lint errors)
- `pnpm install` completes successfully
- The lint tool runs but shows pre-existing issues (not new issues from migration)