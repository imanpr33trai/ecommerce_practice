# Ecommerce Practice Website - Improvement Roadmap

This roadmap is based on the current project structure in `apps/web`, `apps/server`, and `packages/api`.

## What You Already Have

- Core customer flows: landing, product list/detail, search, wishlist, cart, checkout, auth, account, about.
- Backend APIs for product, cart, order, review, wishlist, address, and profile.
- Good foundation with Next.js App Router, TanStack Query, Hono, Prisma, Better Auth, and monorepo setup.

## Priority 0 (Do Next)

### 1. Add missing trust/legal pages

- Create pages:
  - `/contact`
  - `/faq`
  - `/shipping`
  - `/returns`
  - `/privacy-policy`
  - `/terms`
- Reason: footer currently has placeholder links (`#`) for important policy pages.

### 2. Complete missing account and order flows

- Add `/account/payment` page (it exists in sidebar but no rendered section).
- Add `/account/orders/[id]` page for real order details (items, address, status timeline, payment state).
- Wire "Track Order" and "View Details" buttons to real routes.

### 3. Finish checkout production readiness

- Replace hardcoded values in checkout (`state: "NY"`, `country: "US"`).
- Add clear validation for shipping/payment fields (use Zod schema).
- Add `/checkout/success` and `/checkout/failure` pages with order summary.
- Integrate test payment provider flow (Stripe test mode) or mark checkout clearly as mock.

### 4. Add error/loading boundaries per Next.js best practices

- Add route-level `loading.tsx` and `error.tsx` where needed.
- Add `global-error.tsx` for app-level failure fallback.
- Keep user-friendly retry states for cart/product/account failures.

## Priority 1 (High Value UX + SEO)

### 5. SEO and discoverability

- Add page-level metadata for all major pages (title, description, OG).
- Add `sitemap.ts` and `robots.ts`.
- Add structured data:
  - `Organization` (site-wide)
  - `Product` + `Review` on product detail pages.

### 6. Product and listing improvements

- Add pagination/infinite scrolling on product list and search results.
- Add sort/filter persistence in URL for shareable filtered views.
- Add "related products" and "frequently bought together" on product detail.
- Add stock urgency badges ("Only 2 left"), delivery estimates.

### 7. Cart and checkout UX

- Promo codes and coupon support.
- Shipping method selection and tax/shipping breakdown by region.
- "Save for later" and "Move to wishlist" actions from cart.
- Guest cart mode with merge-on-login.

### 8. Accessibility pass

- Replace placeholder-only form fields with proper labels/help text.
- Remove broad a11y ignores and address keyboard interactions for clickable non-button elements.
- Ensure modal focus trapping, escape close, and correct `aria-*` attributes.

## Priority 2 (Scale, Reliability, Product Depth)

### 9. Admin and catalog operations

- Add admin pages for product CRUD, inventory, categories, and order status updates.
- Add media management for product images and alt text.

### 10. Observability and quality

- Add unit/integration tests for:
  - cart quantity update/remove
  - checkout order creation
  - review create/delete
- Add e2e smoke tests for full purchase flow.
- Add error monitoring (Sentry) and analytics events (view product, add to cart, checkout start, order placed).

### 11. Performance upgrades

- Audit client-heavy pages and move more data work to Server Components where possible.
- Optimize large image surfaces and set proper `sizes` for responsive loading.
- Add bundle analysis in CI and fail on regressions.

## Quick Wins (1-2 Days)

- Replace all footer `#` links with real pages.
- Add order details page and connect account order buttons.
- Add metadata to landing/product/search pages.
- Remove `console.log` debugging from UI components and hooks.
- Add empty states + retry buttons for account sections that depend on API calls.

## Suggested Build Order

1. Trust/legal pages + footer wiring.
2. Order details + account payment section.
3. Checkout success/failure and validation hardening.
4. SEO technical files (`sitemap.ts`, `robots.ts`, metadata).
5. Accessibility and testing pass.

