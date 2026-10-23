# Spec: apps/web Full Refactor (Feature-by-Feature)

## Problem Statement

The `apps/web` Next.js 16 application has grown organically with tight coupling between Server and Client Components, inconsistent data fetching patterns, type drift between client/server, and components that are hard to unit test. The codebase mixes data fetching, business logic, and UI in ways that make it difficult to maintain and test.

## Solution

Refactor `apps/web` feature-by-feature using tracer-bullet vertical slices. Each feature slice cuts through all layers: types → data fetching → components → page. Establish clear architectural boundaries:

1. **RSC-first architecture**: Server Components by default, Client Components only for interactivity
2. **Clear data layer**: TanStack Query hooks for all data fetching, Server Components for initial loads
3. **Type safety**: End-to-end types inferred from Hono RPC `AppType`
4. **State management**: Context for auth/cart/wishlist, URL-driven for filters/search
5. **Testability**: Vitest + React Testing Library + MSW for component tests
6. **Feature-by-feature delivery**: Each feature works end-to-end before moving to next

## User Stories

1. As a **developer**, I want clear separation between Server and Client Components, so that I can reason about where code runs and avoid hydration mismatches.

2. As a **developer**, I want end-to-end type safety from API to UI, so that API changes are caught at compile time.

3. As a **developer**, I want to unit test components in isolation with mocked data, so that I can catch regressions locally without a backend.

4. As a **developer**, I want consistent data fetching patterns across all features, so that new features follow established conventions.

5. As a **developer**, I want minimal client-side state with URL-driven filters, so that state is shareable and server-renderable.

6. As a **user**, I want fast initial page loads with proper streaming, so that the experience feels instant.

7. As a **developer**, I want to add new features by following a clear feature template, so that the codebase stays consistent.

8. As a **developer**, I want to run tests locally and in CI without a backend, so that feedback loops are fast.

## Implementation Decisions

### 1. Architecture: RSC-First with Clear Boundaries

```
apps/web/src/
├── app/                          # Next.js App Router
│   ├── (layout)/                 # Layout groups
│   │   ├── (landing)/            # Public pages (SSR/ISR)
│   │   ├── (auth)/               # Auth pages
│   │   └── (dashboard)/          # Protected pages
│   ├── features/                 # Feature-based page routes
│   │   ├── products/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── account/
│   │   └── wishlist/
│   └── api/                      # Route handlers (minimal)
├── components/
│   ├── ui/                       # shadcn/ui primitives (unchanged)
│   ├── shared/                   # Shared Client Components (Button, Card, etc.)
│   ├── providers/                # Context providers (Auth, Cart, Wishlist)
│   └── features/                 # Feature-specific components
│       ├── products/
│       ├── cart/
│       └── ...
├── hooks/
│   ├── queries/                  # TanStack Query hooks (typed)
│   ├── mutations/                # TanStack Mutation hooks (typed)
│   └── client/                   # Client-only hooks (useDebounce, etc.)
├── lib/
│   ├── hono-client.ts            # Hono RPC client (typed from AppType)
│   ├── auth-client.ts            # Better Auth client
│   ├── utils.ts                  # Utilities
│   └── validations/              # Zod schemas (if needed locally)
├── types/
│   └── app.d.ts                  # App-specific type extensions
└── test/
    ├── setup.ts                  # Vitest setup + MSW handlers
    ├── utils.tsx                 # Test utilities (render with providers)
    └── mocks/                    # MSW handlers
```

### 2. Data Layer: TanStack Query + RSC

**Server Components (Pages/Layouts):**
- Fetch initial data directly via Hono client
- Pass data as props to Client Components
- Use `unstable_cache` or `next/cache` for static data

**Client Components:**
- Use TanStack Query hooks for all subsequent data fetching
- Mutations use TanStack Mutation hooks with optimistic updates
- Query keys follow convention: `['feature', 'action', params]`

**Hono Client:**
- Single client in `lib/hono-client.ts` typed from `AppType`
- All API calls go through typed client

### 3. Type Safety: Hono RPC Inference

- Import `AppType` from `@ecommerceNextjs/api`
- Create typed client: `hc<AppType>(env.NEXT_PUBLIC_API_URL)`
- All API responses fully typed end-to-end
- No manual type definitions for API contracts

### 4. State Management

| State | Solution |
|-------|----------|
| Auth (user, session) | React Context + Better Auth client |
| Cart | React Context (synced with server via mutations) |
| Wishlist | React Context (synced with server via mutations) |
| UI (modals, sidebars) | Local `useState` / `useReducer` |
| Filters/Search | URL `searchParams` (shareable, SSR-friendly) |
| Theme | next-themes (unchanged) |

### 5. Testing Strategy

- **Vitest** + **React Testing Library** for unit/integration tests
- **MSW** (Mock Service Worker) for API mocking
- **Test utilities** in `test/utils.tsx`: `renderWithProviders()`
- **MSW handlers** in `test/mocks/` mirroring API contracts
- Test file colocation: `Component.test.tsx` next to component

### 6. Feature Template (Tracer Bullet)

Each feature follows this structure:
```
features/[feature]/
├── components/           # Feature components
│   ├── [Feature]List.tsx
│   ├── [Feature]Card.tsx
│   └── [Feature]Form.tsx
├── hooks/
│   ├── use[Feature]Query.ts      # Query hooks
│   └── use[Feature]Mutation.ts   # Mutation hooks
├── queries/
│   └── [feature].query.ts        # Server-side query functions
├── types/
│   └── [feature].types.ts        # Feature-specific types (extends AppType)
├── [feature].page.tsx            # Server Component page
├── [feature].client.tsx          # Client Component wrapper
└── tests/
    ├── [Feature]List.test.tsx
    └── [Feature]Card.test.tsx
```

## Testing Decisions

- **Unit tests**: Components with mocked TanStack Query + MSW
- **Integration tests**: Feature flows (add to cart → checkout)
- **E2E tests**: Critical paths (auth → browse → cart → checkout)
- **Mocking**: MSW handlers generated from Hono OpenAPI spec
- **Test data**: Factory functions for consistent test data

## Out of Scope

- Changing the backend API (already refactored)
- Changing the design system (Tailwind + shadcn/ui stays)
- Adding new features (pure refactor)
- Changing authentication provider (Better Auth stays)
- Moving to Server Actions (RSC + TanStack Query pattern)
- Micro-frontends or module federation

## Further Notes

- The backend refactor created `@ecommerceNextjs/api` with clean `AppType` — leverage this fully
- Existing pre-existing type errors in web app should be fixed as part of feature refactors
- Each feature slice must be demoable: build passes, types pass, tests pass
- Start with lowest-risk feature (e.g., Product Listing) to establish patterns
- Document patterns in `docs/web-architecture.md` as they emerge