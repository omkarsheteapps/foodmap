# CraveMap MVP

Premium multi-city dish-first discovery platform built with Next.js App Router.

## Setup
1. `npm install`
2. Copy `.env.example` to `.env.local` and fill values.
3. `npm run dev`

## Included
- Multi-city dynamic routing (`/[city]`, `/{city}/{category}`, restaurant detail pages)
- SEO metadata + sitemap + robots
- API architecture for onboarding submissions and Razorpay (disabled by feature flag)
- Supabase-ready env and SQL migration starter

## Deployment
Deploy to Vercel, set env vars, connect Supabase project and run SQL migrations.
