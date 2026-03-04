# OmniScribe AI — Anti-Regression Strategy

This document consolidates all regression prevention measures in the OmniScribe AI codebase. It serves as a single reference for understanding how regressions are detected, prevented, and enforced at every stage of development and deployment.

---

## 1. Principles

1. **Never silently swallow errors.** If something fails, the caller must know. Never return `success: true` with empty or default data.
2. **Contract tests lock behavior.** API response shapes, error envelopes, and status codes are tested explicitly so changes break tests, not users.
3. **Fail fast, fail loud.** Every gate exits on the first failure with full diagnostic output. No partial passes.
4. **Changes log is source of truth.** `CHANGES_LOG.md` tracks every fix with files changed, behavioral intent, and "what could break" notes. It overrides memory.
5. **Minimal fixes only.** Don't refactor unrelated code during a fix. Smaller diffs mean smaller regression surface.

---

## 2. Enforcement Layers

Regressions are caught at four layers, from fastest to most thorough:

### Layer 1 — Pre-Commit Hook (every commit)

**Trigger:** `git commit` (via `.githooks/pre-commit`)
**Runs:** `npm run verify:fast`
**Checks:**
- TypeScript type checking (`tsc --noEmit`)
- ESLint (strict rules on modified/flagged files)
- Critical test suite — 63 tests across 12 files (no DB required)

**Time:** ~5 seconds

### Layer 2 — Pre-Push Hook (every push)

**Trigger:** `git push` (via `.githooks/pre-push`)
**Runs:** `npm run verify:gate` → `app/scripts/verify-gate.sh`
**Checks (sequential, fail-fast):**

| Step | What it catches |
|------|----------------|
| Typecheck + lint | Type errors, style regressions |
| Unit/integration fast | Core logic regressions (63 tests) |
| Core API contracts | Response envelope shape changes |
| Security middleware regressions | CSRF, rate-limit behavior changes |
| Billing gate + boundary tests | Subscription enforcement regressions |
| Visit immutability + amendment safety | Finalized visit edit protection |
| Start test app server | Build/runtime boot failures |
| Runtime auth/login smoke | Authentication flow regressions |
| Playwright E2E core flows | Full browser journey regressions |
| Stop test app server | Cleanup |

**Time:** ~60 seconds

### Layer 3 — CI/CD (every PR and push to main)

**Trigger:** GitHub Actions (`.github/workflows/verify-gate.yml`)
**Runs:** Same `verify:gate` on Ubuntu with Node 22 + Playwright Firefox
**Branches:** `main`, `master`, `ci/no-regression-gate`, all PRs

### Layer 4 — Staging Deploy Preflight (every deployment)

**Trigger:** Manual via `deploy-staging-preflight.sh <commit-sha>`
**Checks:**
- Checkout exact commit SHA (immutable deploy)
- `npm ci` + Prisma client generation
- Migration status check (if Prisma files changed)
- `npm run build` (production build)
- `npm run test:critical` (safety suite)
- Systemd restart + smoke checks (`/`, `/api/auth/session`, `/login`)

---

## 3. Test Suites by Risk Domain

### Contracts (API shape stability)

| File | Purpose |
|------|---------|
| `tests/contracts/api-contract.test.ts` | Error envelope shape, no-swallow guarantees |
| `tests/contracts/core-route-contracts.test.ts` | Route-level response contracts |

### Security

| File | Purpose |
|------|---------|
| `tests/unit/middleware-security.test.ts` | CSRF rejection, rate-limit tiers, security headers |
| `tests/unit/admin-auth-guards.test.ts` | SUPER_ADMIN MFA gate enforcement |
| `tests/unit/prompt-sanitizer.test.ts` | LLM prompt injection prevention |
| `tests/unit/rate-limiter.test.ts` | Rate limiter logic |

### Billing

| File | Purpose |
|------|---------|
| `tests/unit/billing-entitlements.test.ts` | Subscription tier feature gates |
| `tests/unit/billing-route-enforcement.test.ts` | API endpoint billing enforcement |
| `tests/unit/billing-trial.test.ts` | Trial subscription logic |
| `tests/unit/billing-pricing.test.ts` | Pricing tier calculations |
| `tests/unit/billing-client.test.ts` | Client-side billing hooks |

### Data Integrity

| File | Purpose |
|------|---------|
| `tests/unit/visit-finalization-guards.test.ts` | Finalized visits cannot be edited |
| `tests/unit/visit-access.test.ts` | Visit access control |
| `tests/unit/patient-access.test.ts` | Patient data access control |

### Integration

| File | Purpose |
|------|---------|
| `tests/integration/api-error-envelope.test.ts` | Error response shape with real routes |
| `tests/integration/auth.test.ts` | Login, password change, case-insensitive email |
| `tests/integration/admin.test.ts` | Admin operations |
| `tests/integration/patients.test.ts` | Patient CRUD |
| `tests/integration/visits.test.ts` | Visit CRUD |
| `tests/integration/templates.test.ts` | Template operations |
| `tests/integration/visit-sharing.test.ts` | Visit sharing |

### E2E (Browser)

| File | Purpose |
|------|---------|
| `tests/e2e/gate-critical-flows.spec.ts` | Login + password change, patient → visit → note, admin MFA gate |
| `tests/e2e/auth.spec.ts` | Full auth journey |
| `tests/e2e/smoke.spec.ts` | Page-level smoke tests |

---

## 4. Critical Test Config

The critical test suite (`vitest.critical.config.ts`) includes 12 files that run without a database and cover the highest-risk areas:

```
tests/contracts/api-contract.test.ts
tests/contracts/core-route-contracts.test.ts
tests/integration/api-error-envelope.test.ts
tests/unit/middleware-security.test.ts
tests/unit/billing-entitlements.test.ts
tests/unit/billing-route-enforcement.test.ts
tests/unit/visit-finalization-guards.test.ts
tests/unit/style-learning-lib.test.ts
tests/unit/style-learning-routes.test.ts
tests/unit/billing-trial.test.ts
tests/unit/billing-pricing.test.ts
tests/unit/billing-client.test.ts
```

---

## 5. Commands Reference

| Command | What it does |
|---------|-------------|
| `npm run test` | Critical safety suite (alias of `test:critical`) |
| `npm run test:critical` | 63 tests, no DB required, ~2s |
| `npm run test:full` | Full DB-backed suite (all test files) |
| `npm run test:contracts` | API contract tests only |
| `npm run quality:gate` | `build` + `test:critical` + `test:full` |
| `npm run verify:gate` | Full 10-step gate (typecheck → E2E) |
| `npm run smoke:auth` | Runtime auth smoke test |
| `npm run test:e2e` | Playwright browser tests |

---

## 6. Runtime Hardening Rules (FIX-40 through FIX-44)

These rules were established after discovering that code passed build + 71 tests but failed at runtime because error handlers returned empty/default data with `success: true`.

### When writing or modifying error handling:

1. **Never return `success: true` with empty/default data.** If something fails, the caller must know.
2. **Every `catch` block gets scrutiny.** Ask: "Does this hide the failure from the caller?" If it returns default/empty data with success status, that's a bug.
3. **Check `result.truncated` after every `callAI()` call.** If truncated, fail loudly — don't try to parse garbage.
4. **Parse failures from LLM responses = failures.** Never swallow JSON parse errors. Return `success: false` with a reason.
5. **Client-visible errors for client-affecting problems.** If a chunk fails during recording, user sees a toast. If too many fail, block processing with a clear message.
6. **Size token budget to the task.** Estimate expected response size based on schema/framework complexity instead of hardcoded numbers.

### When adding/changing pipeline features:

- Trace the error path for every external call (LLM, Whisper, fetch).
- Ensure failures propagate to the UI, not get absorbed.
- Test with: "If the LLM returns truncated JSON here, does the user find out?"

---

## 7. Process Rules (from CLAUDE.md)

1. **Before ANY code change:** Read `CHANGES_LOG.md`, check for conflicts, list dependent files.
2. **After ANY code change:** Run `npm run build` + `npm run test`, update `CHANGES_LOG.md`, git commit.
3. **Keep fixes minimal.** Don't refactor unrelated code during a fix.
4. **Compaction Recovery Rule:** If context is lost, read `CHANGES_LOG.md` from top to bottom. Find the last `RESOLVED` entry. Resume from there. Do NOT re-do resolved fixes. Do NOT modify files without checking the log. `CHANGES_LOG.md` is source of truth — not memory.

---

## 8. Adding a New Regression Test

When you fix a bug or add a feature that could regress:

1. Write a test in the appropriate directory:
   - `tests/unit/` for isolated logic
   - `tests/contracts/` for API response shapes
   - `tests/integration/` for DB-backed flows
   - `tests/e2e/` for browser journeys
2. If the test is critical (security, billing, data integrity, contracts), add it to `vitest.critical.config.ts`.
3. If it's an E2E gate test, tag it with `@gate` in the test name so `verify-gate.sh` picks it up.
4. Run `npm run verify:gate` locally to confirm the full pipeline passes.
5. Log the fix and new test in `CHANGES_LOG.md`.
