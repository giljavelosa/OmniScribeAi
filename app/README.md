This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## OmniScribeAI Template System Progress

### Completed
- **Phase 1 (Backend Foundation)**: Clinician note template backend foundation with snapshot/authz safeguards.
- **Phase 2A (Visit Workflow Wiring)**: Template picker and `templateId` wiring in visit creation workflow.
- **Phase 2B (Template Management UI)**: Template management pages, template builder, and CRUD/archive/clone user flows.
- **Phase 2C (Navigation / Dashboard / Frameworks Polish)**:
  - Added **Templates** to sidebar navigation
  - Added **Templates** shortcut in header
  - Added dashboard quick actions (New Visit / Manage Templates / Browse Frameworks)
  - Added dashboard template shortcut in Quick Start
  - Added frameworks-page template CTAs (`/templates`, `/templates/new`, create-template-from-framework)

### Validation Status
- `next build` ✅
- `vitest` (129/129) ✅

## Regression Safety Gates

- Critical safety suite:
  - `npm run test` (alias of `test:critical`)
  - `npm run test:critical`
- Full DB-backed suite:
  - `npm run test:full`
- Full quality gate:
  - `npm run quality:gate`

### Keep local host up after tests

- Use these wrappers to auto-reactivate local dev after tests complete:
  - `npm run test:critical:with-dev`
  - `npm run test:full:with-dev`
- Manual recovery command:
  - `npm run dev:ensure`
- Stable local graphics/assets mode (recommended for this repo size):
  - `npm run dev:local`
- `dev:ensure` prefers PM2 (`omniscribe-dev`) and verifies readiness on:
  - `http://localhost:3000` (preferred)
  - `http://localhost:3001` (fallback if 3000 is busy)

## Local Temporary Mode (Toggle-Based)

Use `OMNISCRIBE_LOCAL_MODE` to switch runtime smoke defaults without changing code:

- Local mode ON:
  - `OMNISCRIBE_LOCAL_MODE=true`
  - Playwright/e2e default `BASE_URL` becomes `http://localhost:3000` (unless `BASE_URL` is explicitly set)
- Local mode OFF (default):
  - unset `OMNISCRIBE_LOCAL_MODE` or set `false`
  - Playwright/e2e default `BASE_URL` becomes `https://omniscribeai.net` (unless `BASE_URL` is explicitly set)

Examples:

- Local-first runtime smoke:
  - `OMNISCRIBE_LOCAL_MODE=true npm run test:runtime`
- Domain-targeted runtime smoke:
  - `BASE_URL=https://omniscribeai.net npm run test:runtime`

## Staging Deploy Preflight (Commit SHA)

Use immutable SHA deploys with mandatory preflight checks.

1. SSH to staging host.
2. Run:
   - `cd /home/omniscribe/omniscribeai/app`
   - `APP_DIR=/home/omniscribe/omniscribeai/app SERVICE_NAME=omniscribe-app SMOKE_BASE_URL=http://127.0.0.1 ./scripts/deploy-staging-preflight.sh <commit-sha>`

Preflight includes:
- checkout exact commit SHA
- dependency install + Prisma client generation
- migration status check when Prisma files changed
- `npm run build`
- `npm run test:critical`
- systemd restart + smoke checks (`/`, `/api/auth/session`, `/login`)

### Active Branch (Phase 2C)
- `feat/template-ui-phase2c-nav-dashboard`

## Stripe Billing Setup (Staging/Prod)

Required environment variables:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

Webhook endpoint:

- `https://<your-domain>/api/billing/webhook/stripe`

Subscribe Stripe webhook events:

- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_failed`
- `invoice.paid`

Customer portal setup:

- Stripe Dashboard -> Billing -> Customer portal
- Enable subscription management and payment method updates
- Set default return URL to `https://<your-domain>/account/billing`

## Billing Smoke Checks (Post Deploy)

After restart on staging/prod, verify:

1. `curl -I https://<your-domain>/pricing`
2. `curl -s https://<your-domain>/api/billing/pricing`
3. Login and open `/account/billing`, then click `Manage subscription`
4. Ensure Stripe webhook delivery is healthy in Stripe Dashboard

