# CraveMap MVP

CraveMap is a dish-first, multi-city food discovery MVP built with Next.js App Router.

## Current implementation status

This repository already includes a **solid scaffold**, but it is **not fully complete** against the full premium master prompt yet.

### Implemented today
- App Router pages for:
  - home (`/`)
  - city (`/[city]`)
  - category (`/[city]/[category]`)
  - restaurant (`/[city]/restaurant/[restaurantSlug]`)
  - admin shell (`/admin`)
  - onboarding (`/onboarding`)
- API routes:
  - onboarding submission endpoint
  - Razorpay architecture stubs (`create-order`, `verify`, `webhook`) with payment feature flag behavior
- SEO primitives:
  - `robots.ts`
  - `sitemap.ts`
- SQL migration starter for core entities.

### Still required to fully match your master prompt
- Mapbox-powered interactive map page + markers + clustering + filter UX.
- Full Supabase integration (auth, role checks, storage uploads, admin protections).
- Framer Motion cinematic animations.
- ShadCN component system integration.
- Expanded production-grade UI polish (glassmorphism layers, richer sections, microinteractions).
- Complete secure upload + rate limiting + hardened RBAC middleware.
- More complete seed data and richer city/category editorial content.
- Full test and quality gates (typecheck, lint strictness, e2e).

## Why you currently do not see maps

Map UI is not yet wired to Mapbox in the current scaffold, and there is no populated token in local env by default.

## Accounts you should create (or prepare)

To run the full product architecture end-to-end, create these accounts:

1. **Supabase**
   - Create a project.
   - Get `Project URL` and `anon public key` for client use.
   - Get `service role key` for server-side secure operations.

2. **Mapbox**
   - Create an account and access token.
   - Create a token scoped for web map rendering.

3. **Razorpay** (for later activation)
   - Create account and generate test mode key pair.
   - Configure webhook endpoint + webhook secret.

4. **Vercel**
   - Connect this Git repository.
   - Configure production env vars.

## Environment setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create local env file:
   ```bash
   cp .env.example .env.local
   ```
3. Fill all required values in `.env.local`.
4. Start dev server:
   ```bash
   npm run dev
   ```

## Required environment variables

### Public
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`
- `NEXT_PUBLIC_ENABLE_PAYMENTS` (`false` by default)

### Server-only
- `SUPABASE_SERVICE_ROLE_KEY`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `RAZORPAY_WEBHOOK_SECRET`
- `ADMIN_EMAIL` (optional bootstrap)

## Payments behavior

Payments are intentionally disabled for MVP UX staging.

To keep premium plan UX visible but checkout inactive, set:
- `NEXT_PUBLIC_ENABLE_PAYMENTS=false`

When ready to activate live/test checkout, switch to:
- `NEXT_PUBLIC_ENABLE_PAYMENTS=true`

## Deployment (Vercel)

1. Import repo in Vercel.
2. Add all environment variables for Preview + Production.
3. Connect Supabase and run SQL migrations in your project.
4. Redeploy.
