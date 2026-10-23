# Spec: packages/api Pilot Refactor

## Problem Statement

The `packages/api` package currently has tight coupling to Prisma (direct imports in query files), Zod schemas scattered across router `.type.ts` files, inconsistent error handling (try/catch in some routes, bare throws in others), and no shared type definitions. This makes the code hard to unit test, types drift between client/server, and changes to the database layer ripple through the entire API.

## Solution

Refactor `packages/api` to:
1. **Extract shared Zod schemas** into a new `packages/types` package (single source of truth for runtime validation + static types)
2. **Introduce repository interfaces** with dependency injection — API routers depend on service interfaces, not Prisma directly
3. **Unify error handling** with an `AppError` class, error codes, and a global error middleware that maps to proper HTTP responses
4. **Establish clean seams** between layers: Router → Service → Repository → Prisma

The pilot proves the pattern for the rest of the backend.

## User Stories

1. As a **backend developer**, I want all Zod schemas in one package (`packages/types`), so that client and server share the exact same validation logic and TypeScript types without duplication.

2. As a **backend developer**, I want to unit test router handlers without a database, so that I can run fast tests in CI and catch regressions locally.

3. As a **backend developer**, I want a consistent error response format across all endpoints, so that the frontend can handle errors uniformly without special-casing each route.

4. As a **backend developer**, I want to swap the database implementation (e.g., for testing or migration) without touching router code, so that the API layer is decoupled from persistence.

5. As a **frontend developer**, I want to import TypeScript types from `packages/types` that exactly match the API contracts, so that I get end-to-end type safety without manual synchronization.

6. As a **backend developer**, I want clear architectural boundaries (Router / Service / Repository), so that new features follow a consistent pattern and the codebase scales.

7. As a **backend developer**, I want Hono RPC type inference (`AppType`) to continue working unchanged, so that the web client gets full end-to-end types without migration.

8. As a **backend developer**, I want auth context (`user`, `session`) to be injected via the DI container, so that middleware and handlers stay testable.

9. As a **backend developer**, I want validation errors from Zod to return structured, typed error responses, so that the frontend can render field-level errors.

10. As a **backend developer**, I want business logic errors (not found, unauthorized, conflict) to use typed error codes, so that the frontend can handle each case programmatically.

## Implementation Decisions

### 1. New Package: `packages/types`

- **Purpose**: Single source of truth for all shared Zod schemas and inferred TypeScript types
- **Exports**: Zod schemas for every domain entity (User, Product, Cart, Order, Review, Address, Wishlist), input DTOs, filter/query params, and response shapes
- **Consumers**: `packages/api`, `apps/web`, `apps/server` (any package needing shared types)
- **No dependencies** on other workspace packages (leaf package)
- **Build**: Outputs both ESM and types via `tsup` or `tsc`

### 2. Repository Interfaces (in `packages/api/src/repositories`)

Each domain gets a repository interface defining the contract:

```typescript
// Example: UserRepository interface
export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByIdWithStats(id: string): Promise<UserWithStats | null>;
  updateProfile(id: string, data: UpdateProfileInput): Promise<User>;
}
```

- Interfaces live in `packages/api/src/repositories/` (or `packages/types` if shared)
- Prisma implementation in `packages/api/src/repositories/prisma/`
- Injected via a simple DI container (no framework, just a context object)

### 3. Service Layer (in `packages/api/src/services`)

- Contains business logic, orchestrates repositories
- Routers call services, not repositories directly
- Services are pure TypeScript classes/functions, no Hono dependency

### 4. Router Layer (existing `packages/api/src/routers`)

- Thin: validate input → call service → return response
- Use `zValidator` with schemas from `packages/types`
- No Prisma imports, no business logic

### 5. Dependency Injection Container

- Simple context-based DI (leveraging Hono's `c.get`/`c.set`)
- Created in `apps/server/src/index.ts` (composition root)
- Provides: repositories, services, auth context
- Test overrides via `c.set(key, mockImplementation)`

### 6. Error Handling

**`AppError` class** (in `packages/types` or `packages/api/src/errors`):

```typescript
export class AppError extends Error {
  constructor(
    public readonly code: ErrorCode,
    public readonly message: string,
    public readonly statusCode: number = 400,
    public readonly details?: Record<string, unknown>
  ) { ... }
}

export enum ErrorCode {
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  CONFLICT = 'CONFLICT',
  INTERNAL = 'INTERNAL',
}
```

**Global error middleware** replaces current `errorHandler`:
- Maps `AppError` → HTTP status + JSON shape
- Maps `ZodError` → 400 with `z.treeifyError`
- Logs unexpected errors, returns 500 with generic message

### 7. Hono Context Enhancement

`HonoEnv` extended with DI container:

```typescript
export type HonoEnv = {
  Variables: {
    user: Session["user"];
    session: Session["session"];
    container: DIContainer; // repositories, services
  };
};
```

### 8. Migration Strategy (Pilot)

- **Phase 1**: Create `packages/types` with all schemas from `packages/api` routers
- **Phase 2**: Add repository interfaces + Prisma implementations
- **Phase 3**: Add service layer for one domain (e.g., User)
- **Phase 4**: Refactor User router to use service + DI
- **Phase 5**: Add unified error handling + middleware
- **Phase 6**: Repeat for remaining domains (Product, Cart, Order, etc.)
- **Phase 7**: Update `apps/web` to import types from `packages/types`

## Testing Decisions

- **Unit tests**: Router handlers tested with mocked services (via DI override in test context)
- **Integration tests**: Service layer tested with real Prisma (test DB or transaction rollback)
- **Contract tests**: Zod schemas tested for correct validation (valid/invalid inputs)
- **E2E tests**: Existing Playwright tests for web client should pass unchanged
- **Test pattern**: Follow existing test conventions in repo (Vitest/Jest + Supertest or Hono test client)
- **No implementation detail testing**: Test external behavior (HTTP in/out), not internal method calls

## Out of Scope

- Refactoring `packages/auth`, `packages/db`, `packages/env` (future phases)
- Changing the database schema or Prisma models
- Migrating to tRPC or different RPC framework (keep Hono RPC)
- Frontend refactoring beyond importing types from `packages/types`
- Adding new features (pure refactor)
- Event-driven architecture or message queues
- Caching layer (Redis, etc.)

## Further Notes

- The `AppType` export from `packages/api/src/index.ts` must remain compatible — Hono RPC client in `apps/web` depends on it
- `packages/types` should be versioned independently or use workspace `*`
- Consider adding `packages/types` to the pnpm catalog for version alignment
- The DI container should be minimal — no external DI library needed
- Repository interfaces should be generic enough to support future implementations (e.g., Drizzle, in-memory for tests)
- All existing API contracts (endpoints, request/response shapes) must remain identical — this is a refactor, not a redesign