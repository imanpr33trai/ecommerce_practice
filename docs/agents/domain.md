# Domain Docs: Multi-Context Layout

This repository uses a **multi-context** domain documentation layout suited for monorepos.

## Structure

```
GLOSSARY-MAP.md          # Root index: maps each context to its GLOSSARY.md
docs/adr/                # Global ADRs (cross-cutting concerns)
apps/
  web/
    GLOSSARY.md          # Web app domain terms
    docs/adr/            # Web-specific ADRs
  server/
    GLOSSARY.md          # Server/API domain terms
    docs/adr/            # Server-specific ADRs
packages/
  api/
    GLOSSARY.md          # API package domain terms
    docs/adr/            # API-specific ADRs
  auth/
    GLOSSARY.md          # Auth package domain terms
    docs/adr/            # Auth-specific ADRs
  db/
    GLOSSARY.md          # Database package domain terms
    docs/adr/            # DB-specific ADRs
  env/
    GLOSSARY.md          # Env config domain terms
    docs/adr/            # Env-specific ADRs
  ui/
    GLOSSARY.md          # UI component domain terms
    docs/adr/            # UI-specific ADRs
```

## Consumer Rules

### For AI Agents

1. **Read `GLOSSARY-MAP.md` first** to discover all contexts
2. **Read the relevant `GLOSSARY.md`** for the context you're working in
3. **Check both global `docs/adr/` and context `docs/adr/`** for relevant ADRs
4. **Never assume terms are shared** — each context owns its definitions

### For Humans

- Add new terms to the **context-specific** `GLOSSARY.md`
- Write ADRs in the **context-specific** `docs/adr/` unless they affect multiple contexts
- Update `GLOSSARY-MAP.md` when adding new contexts

## GLOSSARY-MAP.md Template

```markdown
# Glossary Map

This file indexes all domain contexts in the monorepo.

## Contexts

| Context | Glossary | ADRs | Description |
|---------|----------|------|-------------|
| Web App | `apps/web/GLOSSARY.md` | `apps/web/docs/adr/` | Next.js frontend |
| Server | `apps/server/GLOSSARY.md` | `apps/server/docs/adr/` | Hono API server |
| API Package | `packages/api/GLOSSARY.md` | `packages/api/docs/adr/` | API routers & queries |
| Auth Package | `packages/auth/GLOSSARY.md` | `packages/auth/docs/adr/` | Better Auth integration |
| DB Package | `packages/db/GLOSSARY.md` | `packages/db/docs/adr/` | Prisma & PostgreSQL |
| Env Package | `packages/env/GLOSSARY.md` | `packages/env/docs/adr/` | Environment validation |
| UI Package | `packages/ui/GLOSSARY.md` | `packages/ui/docs/adr/` | Shared React components |

## Global ADRs

Cross-cutting decisions: [`docs/adr/`](../docs/adr/)
```

## Creating New Contexts

When adding a new package/app:
1. Create `GLOSSARY.md` in its root
2. Create `docs/adr/` directory
3. Add a row to `GLOSSARY-MAP.md`