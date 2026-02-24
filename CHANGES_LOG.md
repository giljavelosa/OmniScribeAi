# OmniScribe AI — Changes Log

Track every fix applied to the codebase. Read this before every change to avoid conflicts.

---

## FIX-1: Encryption at rest for PII ✅
**Date:** 2026-02-24
**Files changed:**
- `app/src/lib/phi-crypto.ts` (NEW) — AES-256-GCM encrypt/decrypt utilities
- `app/src/lib/db.ts` (MODIFIED) — Prisma client extensions for auto-encrypt/decrypt

**What it does:**
- Encrypts Patient fields on write: phone, phoneSecondary, email, addressLine1, addressLine2, emergencyContactName, emergencyContactPhone, mrn
- Encrypts Visit fields on write: transcript
- Decrypts on read transparently
- Graceful: if PHI_ENCRYPTION_KEY is not set, encryption is disabled (dev mode)
- Graceful: unencrypted values are returned as-is during migration

**Fields left unencrypted (needed for search/indexes):**
- firstName, lastName, identifier, dateOfBirth

**What could break:**
- Any code that reads raw DB values expecting plaintext (should be transparent via Prisma extension)
- Search on encrypted fields (phone, email, mrn) won't work with LIKE/contains — only identifier and name search work
- Test setup.ts imports prisma from db.ts — if PHI_ENCRYPTION_KEY is missing, encryption is just disabled

**User action required:**
- Add `PHI_ENCRYPTION_KEY` to `.env` (64-char hex): `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- For full DB-level encryption: enable PostgreSQL TDE or use `sslmode=require` in DATABASE_URL

**Build:** ✅ `tsc --noEmit` passes
**Tests:** ✅ `vitest run` passes (20/20)

## FIX-2: Prompt injection via framework data ✅
**Date:** 2026-02-24
**Files changed:**
- `app/src/lib/prompt-sanitizer.ts` (NEW) — sanitizeForPrompt, sanitizeSectionTitle, sanitizeItemName, safeJsonKey
- `app/src/app/api/generate-note/route.ts` (MODIFIED) — uses sanitizers for schema fields, section prompt, framework name/type
- `app/src/app/api/extract-chunk/route.ts` (MODIFIED) — uses safeJsonKey for schema fields

**What it does:**
- Strips injection patterns (IGNORE ABOVE, system:, HTML tags, template syntax, code fences)
- Restricts framework text to safe chars (alphanumeric, spaces, hyphens, common punctuation)
- Caps input at 200 chars, collapses whitespace
- Applied to all framework section titles, item names, framework name/type before prompt interpolation

**What could break:**
- Framework names with unusual characters (e.g., unicode) will have those chars stripped
- JSON keys are already lowercase+underscore normalized, so safeJsonKey matches existing behavior

**Build:** ✅ passes
**Tests:** ✅ passes (20/20)

## FIX-3: Hallucination audit silently fails ✅
**Date:** 2026-02-24
**Files changed:**
- `app/src/app/api/generate-note/route.ts` (MODIFIED) — audit catch blocks now log, set auditClean=false, send auditFailed flag

**What it does:**
- Outer catch (API call failure): logs error, sets auditClean=false, auditFailed=true, adds user-visible warning
- Inner catch (JSON parse failure): logs warning, sets auditClean=false, auditFailed=true, adds user-visible warning
- New `auditFailed` boolean included in SSE result so UI can show a warning banner

**What could break:**
- UI code that only checks `auditClean` may need to also check `auditFailed` for accurate messaging
- Previously, audit failures were invisible; now they surface — this is intentional

**Build:** ✅ passes
**Tests:** ✅ passes (20/20)

## FIX-4: Rate limiting on all API routes ✅
**Date:** 2026-02-24
**Files changed:**
- `app/src/lib/rate-limiter.ts` (NEW) — in-memory sliding window rate limiter with tiers
- `app/middleware.ts` (MODIFIED) — integrates rate limiting into request pipeline

**What it does:**
- 3 tiers: login (10/15min per IP), ai (30/min per user), api (120/min per user)
- Login rate limiting by IP (even for unauthenticated requests)
- AI endpoints (generate-note, transcribe, extract-chunk, ocr) get stricter limits
- Returns 429 with Retry-After header when exceeded
- Auto-cleanup of stale entries every 5 minutes

**What could break:**
- Heavy automated testing may hit rate limits (30/min on AI endpoints)
- In-memory store resets on server restart (acceptable for dev, use Redis for prod)

**Build:** ✅ passes
**Tests:** ✅ passes (20/20)

## FIX-5: Patient search ownership check + FIX-14: Pagination bounds ✅
**Date:** 2026-02-24
**Files changed:**
- `app/src/app/api/patients/route.ts` (MODIFIED) — ownership filtering + limit capped at 100
- `app/src/app/api/visits/route.ts` (MODIFIED) — limit capped at 100

**What it does:**
- GET /api/patients now scopes results by ownership:
  - Admins see all patients
  - Users with an org see only their org's patients
  - Users without an org see only patients they have visits with
- Removed `mrn` from search filter (now encrypted per FIX-1, can't use LIKE)
- POST /api/patients auto-links new patients to user's organization
- Both patients and visits list endpoints cap `limit` at 100 via `Math.min()`

**What could break:**
- Users who previously saw all patients will now only see their org's patients (intended)
- mrn search no longer works (tradeoff of FIX-1 encryption)

**Build:** ✅ passes
**Tests:** ✅ passes (20/20)

## FIX-6: Reduce session timeout ✅
**Date:** 2026-02-24
**Files changed:**
- `app/src/lib/auth.ts` (MODIFIED) — JWT maxAge reduced from 8h to 4h
- `app/src/components/SessionTimeout.tsx` (MODIFIED) — idle timeout reduced from 8h to 15min, warning from 5min to 2min

**What it does:**
- JWT absolute max session: 4 hours (down from 8)
- Client-side idle timeout: 15 minutes (HIPAA standard for workstation timeout)
- Warning shown 2 minutes before idle logout
- Recording heartbeat still keeps session alive during active recording

**What could break:**
- Users who leave the app idle for >15 min will be logged out (intended for HIPAA compliance)
- Long sessions without interaction will now require re-login more frequently

**Build:** ✅ passes
**Tests:** ✅ passes (43/43)

## FIX-7: CSRF protection ✅
**Date:** 2026-02-24
**Files changed:**
- `app/middleware.ts` (MODIFIED) — Origin/Referer validation on state-changing API requests

**What it does:**
- Validates `Origin` header on POST/PUT/PATCH/DELETE requests to `/api/` routes
- Falls back to `Referer` if no `Origin` header present
- Rejects with 403 if Origin/Referer doesn't match the Host header
- Allows requests with neither header (curl, server-to-server) as long as session is valid

**What could break:**
- Cross-origin API calls from external tools will be rejected (must match host)
- Requests with a mismatched Origin header will get 403 instead of processing

**Build:** ✅ passes
**Tests:** ✅ passes (43/43)

## FIX-8: XSS via dangerouslySetInnerHTML — VERIFIED SAFE ✅
**Date:** 2026-02-24
**Files reviewed:**
- `app/src/app/visit/new/page.tsx` — `escapeHtml()` called before regex replacements
- `app/src/app/visit/[id]/page.tsx` — `escapeHtml()` called before regex replacements
- `app/src/components/NoteEditor.tsx` — `renderMarkdown()` calls `escapeHtml()` first

**Finding:** All three dangerouslySetInnerHTML usages are already properly sanitized. escapeHtml encodes `& < > "` before any HTML is injected. Regex $1 captures from already-escaped text. No changes needed.

## FIX-9: PDF export unescaped section titles ✅
**Date:** 2026-02-24
**Files changed:**
- `app/src/app/visit/[id]/page.tsx` (MODIFIED) — escapeHtml applied to all dynamic values in PDF export

**What it does:**
- Section titles: `s.title` → `escapeHtml(s.title)`
- Section content: now passed through `escapeHtml()` before markdown-to-HTML conversion
- Patient name, date, provider type, framework name: all escaped in PDF HTML template
- Compliance grade/score: escaped via `escapeHtml(String(...))`

**What could break:**
- Section titles with intentional HTML (none expected) will render as escaped text
- No functional change for normal data

**Build:** ✅ passes
**Tests:** ✅ passes (43/43)

## FIX-10: Retry logic on single-file transcription ✅
**Date:** 2026-02-24
**Files changed:**
- `app/src/app/api/transcribe/route.ts` (MODIFIED) — `transcribeSingle()` now retries up to 2 times

**What it does:**
- Up to 2 retries (3 attempts total) on 429 (rate limit) or 5xx (server error) responses
- Also retries on network/timeout errors (AbortError)
- Exponential backoff: 1.5s first retry, 3s second retry
- Non-retryable errors (400, 401, 413) fail immediately
- Logs each retry attempt for debugging

**What could break:**
- Total request time increases slightly for failing requests (max +4.5s of retry delays)
- FormData rebuilt for each attempt (negligible memory impact for ≤24MB files)

**Build:** ✅ passes
**Tests:** ✅ passes (43/43)

## FIX-11: Empty audio rejection ✅
**Date:** 2026-02-24
**Files changed:**
- `app/src/app/api/transcribe-chunk/route.ts` (MODIFIED) — reject audio chunks < 1KB
- `app/src/app/api/transcribe/route.ts` (MODIFIED) — reject uploaded audio files < 1KB

**What it does:**
- Returns 400 with clear error message if audio is < 1KB (just a header, no actual audio data)
- Applied to both chunk transcription (real-time) and batch transcription (upload) endpoints
- Check runs before any Groq API call is made (saves money/time)

**What could break:**
- Nothing — legitimate audio is always > 1KB

**Build:** ✅ passes
**Tests:** ✅ passes (43/43)

## FIX-12: Surface JSON parsing data loss ✅
**Date:** 2026-02-24
**Files changed:**
- `app/src/app/api/generate-note/route.ts` (MODIFIED) — `parseJsonArray()` now validates section structure

**What it does:**
- Validates each parsed section has `title` (string) and `content` (string)
- Drops malformed sections and appends a visible warning section with count
- Logs dropped sections count at warn level
- Handles empty arrays and all-malformed cases with clear error messages
- Original fallback for JSON parse failures preserved

**What could break:**
- If the AI returns sections with unexpected field names (e.g., `heading` instead of `title`), they'll be dropped with a warning. This makes data loss visible rather than silent.

**Build:** ✅ passes
**Tests:** ✅ passes (43/43)

## FIX-13: Client-side PHI cleanup improvements ✅
**Date:** 2026-02-24
**Files changed:**
- `app/src/lib/phi-storage.ts` (MODIFIED) — PHI TTL reduced from 24h to 4h
- `app/src/components/Providers.tsx` (MODIFIED) — global expired PHI sweep on app startup

**What it does:**
- PHI_TTL_MS: 24h → 4h (matches JWT maxAge from FIX-6)
- Global sweep of expired PHI items on every app startup via Providers component
- Existing protections already in place: clearAllPhiItems on logout (Header), idle timeout (SessionTimeout), password change

**What could break:**
- PHI data stored > 4h ago will be auto-swept (intended)
- Users returning after 4h will need to re-fetch visit data (acceptable)

**Build:** ✅ passes
**Tests:** ✅ passes (43/43)

## FIX-15: Security headers ✅
**Date:** 2026-02-24
**Files changed:**
- `app/next.config.ts` (MODIFIED) — added security headers via `async headers()`

**What it does:**
- `X-Frame-Options: DENY` — prevents clickjacking
- `X-Content-Type-Options: nosniff` — prevents MIME sniffing
- `Referrer-Policy: strict-origin-when-cross-origin` — limits referer leakage
- `Permissions-Policy` — blocks camera/geolocation, allows microphone (self only for recording)
- `Content-Security-Policy` — restricts script/style/connect sources; allows Groq/xAI/Anthropic/DeepSeek APIs
- `Strict-Transport-Security` — enforces HTTPS for 1 year
- `frame-ancestors 'none'` — CSP equivalent of X-Frame-Options

**What could break:**
- If new external APIs are added, their domains must be added to `connect-src`
- `unsafe-inline` and `unsafe-eval` in script-src is necessary for Next.js dev mode; can be tightened in production with nonces

**Build:** ✅ passes
**Tests:** ✅ passes (43/43)

## FIX-16: API keys — VERIFIED SAFE ✅
**Date:** 2026-02-24
**Files reviewed:**
- `.gitignore` — contains `*.env` and `*.env.*`
- `git ls-files` — no .env files tracked

**Finding:** .env files are properly gitignored and no secrets are tracked in git. No code changes needed.

**User action required:**
- Rotate all API keys if they were ever exposed (GROQ_API_KEY, XAI_API_KEY, etc.)
- Ensure `.env` is present on all deployment targets with correct values

## FIX-17: AUTH_SECRET strength — USER ACTION REQUIRED ✅
**Date:** 2026-02-24
**Files reviewed:**
- No code changes needed — this is a deployment configuration issue

**Finding:** NextAuth v5 requires a strong `AUTH_SECRET` env var for JWT signing. A weak or missing secret compromises all session tokens.

**User action required:**
- Generate a strong AUTH_SECRET: `node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"`
- Add to `.env`: `AUTH_SECRET=<generated-value>`
- Ensure AUTH_SECRET is at least 64 characters
- Set on all environments (dev, staging, prod)

---

## POST-FIX: Environment keys generated and applied ✅
**Date:** 2026-02-24
**Files changed:**
- `app/.env` (MODIFIED) — NOT tracked in git

**What was done:**
- Generated strong `AUTH_SECRET` (88-char base64, from 64 random bytes) — replaces weak placeholder `"test-secret-at-least-32-chars-long-for-jwt-signing"`
- Generated `PHI_ENCRYPTION_KEY` (64-char hex, from 32 random bytes) — enables FIX-1 field-level encryption
- Both added to `app/.env`

**Side effects:**
- All existing user sessions invalidated (AUTH_SECRET changed) — users must re-login
- New data written to DB will be encrypted; existing plaintext data still reads correctly (graceful migration)

## POST-FIX: App verification ✅
**Date:** 2026-02-24

**Verified:**
- `npm run dev` starts successfully on port 3000
- Login page returns HTTP 200
- Login with credentials returns HTTP 302 (redirect to dashboard)
- All 6 security headers confirmed present in response:
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(self), geolocation=()`
  - `Content-Security-Policy` (full policy with allowed API domains)
  - `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- Browser login tested successfully

## Summary of all changes

| Fix | Category | Description | Type |
|-----|----------|-------------|------|
| FIX-1 | Security/HIPAA | AES-256-GCM encryption at rest for PII fields | Code |
| FIX-2 | Security | Prompt injection sanitization for framework data | Code |
| FIX-3 | Reliability | Hallucination audit failure surfacing | Code |
| FIX-4 | Security | Rate limiting on all API routes (3 tiers) | Code |
| FIX-5 | Security/HIPAA | Patient search ownership scoping | Code |
| FIX-6 | Security/HIPAA | Session timeout: 4h JWT + 15min idle | Code |
| FIX-7 | Security | CSRF protection via Origin/Referer validation | Code |
| FIX-8 | Security | XSS via dangerouslySetInnerHTML | Verified safe |
| FIX-9 | Security | PDF export HTML escaping | Code |
| FIX-10 | Reliability | Transcription retry logic (2 retries, backoff) | Code |
| FIX-11 | Validation | Empty audio rejection (< 1KB) | Code |
| FIX-12 | Reliability | JSON parse data loss surfacing | Code |
| FIX-13 | Security/HIPAA | PHI TTL 24h→4h + global startup sweep | Code |
| FIX-14 | Security | Pagination bounds (max 100) | Code (with FIX-5) |
| FIX-15 | Security | Security headers (CSP, HSTS, X-Frame, etc.) | Code |
| FIX-16 | Security | .env gitignored, no secrets tracked | Verified safe |
| FIX-17 | Security | AUTH_SECRET strength requirement | Config |

---

## DEPLOY-1: Production deployment of FIX-1 through FIX-17 ✅
**Date:** 2026-02-24
**Target:** omniscribe-prod (143.198.131.243)

**SSH access setup:**
- Added local SSH key (`~/.ssh/id_ed25519`) to all 4 droplets via DigitalOcean console
- Verified SSH access: prod ✅, dev ✅, staging ✅, data ✅

**DigitalOcean infrastructure:**
| Droplet | IP | Role |
|---------|-----|------|
| omniscribe-prod | 143.198.131.243 | Production (PM2 + Nginx + SSL) |
| omniscribe-staging | 147.182.243.166 | Staging (not yet deployed) |
| omniscribe-dev | 134.199.221.192 | Development (not yet deployed) |
| omniscribe-data | 164.92.77.116 | PostgreSQL database server |

**Deployment steps performed:**
1. `git pull` — fast-forward from `47b380e` to `bb68a12` (14 commits, 47 files changed)
2. `npm install` — clean, 0 vulnerabilities
3. Generated unique `PHI_ENCRYPTION_KEY` for prod (separate from local dev key)
4. Added `PHI_ENCRYPTION_KEY` to `/home/omniscribe/omniscribeai/app/.env`
5. `npm run build` — successful, all routes compiled
6. `pm2 restart omniscribe` — online, PID 186184, 182MB

**Verification:**
- Login page: HTTP 200 ✅
- All 6 security headers present ✅ (X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, CSP, HSTS)
- PM2 status: online ✅

**Side effects:**
- Existing user sessions invalidated (auth config changed) — users must re-login
- New PHI data will be encrypted at rest; existing plaintext reads correctly (graceful migration)
- Rate limiting now active on all API routes
- Idle timeout now 15 minutes (was 8 hours)

**Prod .env keys present:**
DATABASE_URL, AUTH_SECRET, NEXTAUTH_URL, AI_PROVIDER, XAI_API_KEY, DEEPGRAM_API_KEY, GROQ_API_KEY, NEXT_PUBLIC_TRANSCRIPTION_PROVIDER, NODE_ENV, AUTH_TRUST_HOST, PHI_ENCRYPTION_KEY

---

# UX IMPROVEMENT PLAN — Navigation & Workflow

**Date:** 2026-02-24
**Status:** PLANNED — not yet implemented
**Goal:** Reduce clicks-to-recording, improve daily-use ergonomics for clinicians

Each item follows the same workflow as FIX-1 through FIX-17:
1. Read CHANGES_LOG.md for conflicts
2. List files, make minimal change
3. `tsc --noEmit` + `vitest run`
4. Update CHANGES_LOG.md
5. Git commit
6. Move to next

---

## UX-1: Pinned/recent frameworks on dashboard ✅
**Date:** 2026-02-24
**Priority:** HIGH — eliminates 3-click framework selection for 90% of visits
**Files changed:**
- `app/src/app/dashboard/page.tsx` — added "Quick Start" section showing up to 5 recently-used frameworks as clickable cards linking to `/visit/new?frameworkId=xxx`. Falls back to "Start your first visit" CTA if no recent frameworks. Imports `frameworks`, `getDomainLabel`, `getDomainColor`.
- `app/src/app/visit/new/page.tsx` — accepts `frameworkId` query param via `useSearchParams()` to pre-select framework on load. Wrapped in `<Suspense>` boundary (required by Next.js for `useSearchParams`). Added `saveRecentFramework()` helper that stores last 5 used framework IDs in localStorage (`omniscribe-recent-frameworks`). Called on both encounter-state and legacy completion paths.
- `app/src/app/api/visits/route.ts` — no changes needed (recent frameworks tracked client-side in localStorage; DB query version deferred until visits are persisted to DB)

**Implementation detail:**
- localStorage key: `omniscribe-recent-frameworks` — stores `Array<{frameworkId, usedAt}>`, max 5, MRU order
- Not PHI — only framework IDs and timestamps, no patient data
- Invalid/unknown framework IDs are filtered out on dashboard load

**What could break:**
- Dashboard layout on mobile (tested: grid collapses to single column on small screens)
- Visit/new page if frameworkId param is invalid (handled: `useEffect` only sets if `frameworkId` is empty)

**Build:** ✅ `tsc --noEmit` passes
**Tests:** ✅ `vitest run` passes (43/43)

---

## UX-2: Patient autocomplete on visit/new ✅
**Date:** 2026-02-24
**Priority:** HIGH — prevents duplicates, links to history, saves typing
**Files changed:**
- `app/src/app/visit/new/page.tsx` — replaced free-text patient name input with debounced autocomplete (300ms) that searches `/api/patients?q=`. Shows dropdown with patient name, identifier, and visit count. Selecting links the patient (`patientId` state). Typing after selection clears the link. Shows "Linked" badge when patient is selected. Falls back to "no matching patients" message with hint that name will create new record.
- `app/src/app/api/patients/route.ts` — no changes (reuses existing `?q=` search with ownership scoping)

**Implementation detail:**
- New state: `patientId`, `patientSearch`, `patientResults`, `showPatientDropdown`, `searchingPatients`
- Debounce: 300ms via `setTimeout` ref, minimum 2 chars to trigger search
- Click-outside: `mousedown` listener closes dropdown
- `patientId` is tracked but not yet passed to visit creation (visits currently go to localStorage only)

**What could break:**
- Existing "type patient name" flow still works — user can type any name without selecting from dropdown
- PHI in dropdown (patient names, IDs) — client-side only, no localStorage persistence

**Build:** ✅ `tsc --noEmit` passes
**Tests:** ✅ `vitest run` passes (43/43)

---

## UX-3: Record-first workflow ✅
**Date:** 2026-02-24
**Priority:** HIGH — biggest differentiator; captures full encounter from first word
**Files changed:**
- `app/src/app/visit/new/page.tsx` — removed recording gating. Record button is now always enabled (only disabled by mic preflight errors). Renamed `canRecord` → `canGenerate` and applied it only to Upload/Generate buttons. Added `recordingReady` state: when recording completes but patient/framework aren't filled, shows a banner with "Recording complete!" and either a "Generate Clinical Note" button (if fields are filled) or a prompt to fill missing fields. Added `pendingEncounterRef` to preserve encounter state from recording while user fills in fields. Updated hint text: "You can start recording now — fill in patient name and framework before or during recording".
- `app/src/components/AudioRecorder.tsx` — no changes needed (`disabled` prop already optional, real-time mode gracefully skips when `frameworkId` is empty)
- `app/src/app/api/extract-chunk/route.ts` — no changes needed (real-time extraction only triggered when `frameworkId` is set in AudioRecorder)

**Design decision:**
- Record button: always enabled (captures audio from first word)
- Generate button: gated on patient + framework
- Real-time transcription: activates only if framework is selected BEFORE recording starts (limitation accepted — user gets legacy flow otherwise)

**What could break:**
- If user starts recording without framework, no real-time extraction happens — falls back to legacy transcribe-then-generate flow (acceptable trade-off)
- Recording ready banner shows inline on setup form — doesn't change step state

**Build:** ✅ `tsc --noEmit` passes
**Tests:** ✅ `vitest run` passes (43/43)

---

## UX-4: Universal search (Cmd+K) ✅
**Date:** 2026-02-24
**Priority:** MEDIUM — find any patient/note/visit instantly
**Files changed:**
- `app/src/app/api/search/route.ts` (NEW) — unified search endpoint. Queries patients (firstName, lastName, identifier) and visits (joined via patient). Max 5 results per type. Respects ownership scoping (admin sees all, org-scoped sees org, no-org sees own visits). Returns `{ patients, visits }`.
- `app/src/components/SearchModal.tsx` (NEW) — full-featured search modal. Opens on Cmd+K (Mac) / Ctrl+K. Debounced search (250ms, min 2 chars). Results grouped by Patients and Visits with keyboard navigation (arrow keys + Enter). Shows patient name/identifier/visit count and visit patient/framework/date/status. ESC or click-outside to close.
- `app/src/components/Header.tsx` (MODIFIED) — added search pill button ("Search... ⌘K") between logo and "New Visit" button. Hidden on small screens. Dispatches synthetic Cmd+K to open the modal.
- `app/src/components/Providers.tsx` (MODIFIED) — added `<SearchModal />` as global component so it's available on all pages.

**What could break:**
- Search on encrypted fields (phone, email, mrn) won't work — only name/identifier are searchable (by design, per FIX-1)
- Respects patient ownership scoping (same logic as /api/patients, per FIX-5)
- Visits stored only in localStorage (not DB) won't appear in search results — only DB-persisted visits are searchable

**Build:** ✅ `tsc --noEmit` passes
**Tests:** ✅ `vitest run` passes (43/43)

---

## UX-5: Processing progress steps ✅
**Date:** 2026-02-24
**Priority:** MEDIUM — shows Uploading → Transcribing → Generating instead of generic spinner
**Files changed:**
- `app/src/app/visit/new/page.tsx` — replaced generic spinner with 4-step progress indicator. Each step shows: checkmark (done), spinner (active), or gray dot (pending). Steps vary by flow:
  - Legacy (upload): Transcribing audio → Generating clinical note → Verifying accuracy → Finalizing
  - Encounter-state (recording): Validating clinical data → Generating clinical note → Verifying accuracy → Finalizing
  Steps advance based on process milestones and SSE pass numbers. Progress bar + percentage retained below the step list. Added `processingSteps` state and `advanceStep()` helper.
- `app/src/app/api/generate-note/route.ts` — no changes (already sends SSE progress with `pass` numbers; reused)

**What could break:**
- SSE `pass` values map to step indices — if generate-note changes pass numbers, step indicator could get out of sync
- Step indicator is purely cosmetic — doesn't affect processing logic

**Build:** ✅ `tsc --noEmit` passes
**Tests:** ✅ `vitest run` passes (43/43)

---

## UX-6: Cancel button during generation + draft save ✅
**Date:** 2026-02-24
**Priority:** MEDIUM — don't trap user in a spinner
**Files changed:**
- `app/src/app/visit/new/page.tsx` — Added cancel button below progress bar during processing. Uses shared `AbortController` ref (`abortRef`) across both transcription and note generation. On cancel:
  - If transcript was already obtained (legacy flow): saves draft to localStorage via `setPhiItem()` with `status: 'draft'`, then returns to setup
  - If cancelled before transcript: returns to setup with recording preserved (blob retained in `lastBlobRef`)
  - Encounter-state cancel: returns to setup with `recordingReady=true` so user can retry
  - Abort errors are handled separately from real errors — no error screen shown
  - Cancel button shows contextual hint: "Transcript will be saved as draft" or "Recording is preserved for retry"
- `app/src/app/api/visits/route.ts` — no changes needed (visits API already accepts any `status` string; draft save uses localStorage like the main flow)

**What could break:**
- Cancelling mid-SSE aborts the fetch — server-side generation continues to completion (no server-side abort, but response is discarded)
- Draft visits in localStorage use `visit-draft-` prefix — not shown in dashboard yet (future UX-10)

**Build:** ✅ `tsc --noEmit` passes
**Tests:** ✅ `vitest run` passes (43/43)

---

## POST-UX Regression Fix: Error response shape + PHI logging ✅
**Date:** 2026-02-24
**Files changed:**
- `app/src/app/api/search/route.ts` — fixed error response shape to use `{ success: boolean, error?: string }` per CLAUDE.md rule. Applied to 401, 500, and success (200) responses.
- `app/src/app/visit/new/page.tsx` — replaced 2 pre-existing `console.log()` calls with `appLog()` from `@/lib/logger.ts` per PHI safety rule. Imported `appLog`. No PHI was in the log messages (only metadata counts), but standardized for consistency.

**Audit results for UX-1 through UX-6:**
- Rate limiting: ✅ `/api/search` covered by middleware (api tier, 120 req/min)
- Error response shape: ✅ fixed (was `{ error }`, now `{ success, error }`)
- Pagination bounds: ✅ hardcoded `take: 5` on search, no user-controlled limits
- PHI logging: ✅ fixed (was `console.log`, now `appLog`)
- XSS: ✅ no `dangerouslySetInnerHTML` in SearchModal; transcript escaped in visit/new
- CSRF: ✅ `/api/search` is GET-only, not applicable

**Build:** ✅ `tsc --noEmit` passes
**Tests:** ✅ `vitest run` passes (43/43)

---

## UX-7: Mobile hamburger menu ✅
**Date:** 2026-02-24
**Files changed:**
- `app/src/components/Sidebar.tsx` (MODIFIED) — extracted NavLinks helper, added mobile drawer overlay with backdrop
- `app/src/components/Header.tsx` (MODIFIED) — added hamburger button (lg:hidden), responsive touch targets, mobile-friendly layout

**What it does:**
- Hamburger button in header visible on screens < 1024px (lg breakpoint), 44px touch target
- Mobile sidebar slides in as overlay drawer (w-72) with semi-transparent backdrop
- Closes on: backdrop click, ESC key, route change, nav link click
- Uses custom DOM event `toggle-mobile-sidebar` (same pattern as SearchModal)
- Desktop sidebar unchanged (`hidden lg:flex`)
- Header right side: "New Visit" text hidden on mobile (icon only), user name/email hidden on mobile (avatar only)
- All interactive elements have min 44px touch targets for mobile accessibility
- z-index: mobile backdrop z-40, mobile drawer z-50 (matches header), no conflict with SearchModal (z-50 portal)

**Build:** ✅ `tsc --noEmit` passes
**Tests:** ✅ `vitest run` passes (43/43)

---

## UX-8: Smart framework suggestion from provider type ✅
**Date:** 2026-02-24
**Files changed:**
- `app/src/lib/frameworks.ts` (MODIFIED) — added `getSuggestedDomain(providerType)` with provider-to-domain mapping
- `app/src/components/FrameworkSelector.tsx` (MODIFIED) — added `suggestedDomain` prop, auto-selects domain on provider change
- `app/src/app/visit/new/page.tsx` (MODIFIED) — passes `getSuggestedDomain(providerType)` to FrameworkSelector

**What it does:**
- Mapping: MD/DO/PA-C/NP → medical, PT/OT/SLP → rehabilitation, LCSW/PhD/PsyD → behavioral_health
- When user selects a provider type, FrameworkSelector auto-skips to Step 2 (framework list) for the suggested domain
- User can always click "Back to domains" to choose a different domain — suggestion, not restriction
- Uses ref tracking (`appliedSuggestionRef`) to only auto-apply once per suggestion change, preventing loops
- No effect if a framework is already selected

**Build:** ✅ `tsc --noEmit` passes
**Tests:** ✅ `vitest run` passes (43/43)

---

## UX-9: Framework search field ✅
**Date:** 2026-02-24
**Files changed:**
- `app/src/components/FrameworkSelector.tsx` (MODIFIED) — added search input and cross-domain search

**What it does:**
- Search input at top of FrameworkSelector, always visible (above domain/framework selection)
- Searches across all 19 frameworks by name, description, type, subtype, and domain label
- Min 2 chars to trigger search, shows result count
- Search results show domain badge on each card (since results cross domains)
- Extracted `FrameworkCard` helper component to avoid duplicating card markup
- When search is empty, normal domain → framework flow is shown
- Clears search query when framework is deselected

**Build:** ✅ `tsc --noEmit` passes
**Tests:** ✅ `vitest run` passes (43/43)

---

## UX-10: Auto-save drafts to localStorage ✅
**Date:** 2026-02-24
**Files changed:**
- `app/src/app/visit/new/page.tsx` (MODIFIED) — auto-save form state to localStorage, restore on mount
- `app/src/app/dashboard/page.tsx` (MODIFIED) — "Resume Draft" banner with discard/resume options

**What it does:**
- Auto-saves form state (patientName, patientId, providerType, frameworkId) to `omniscribe-visit-draft` in localStorage
- Debounced at 5 seconds — saves only during "setup" step, removes key if form is empty
- Restores draft on mount (unless URL `frameworkId` param is present, which takes priority)
- Clears draft on successful visit save (both legacy and encounter-state paths)
- Dashboard shows amber "Unsaved draft" banner with patient name and framework info
- "Discard" button clears draft from localStorage, "Resume" links to /visit/new
- Drafts auto-expire after 24 hours (checked on dashboard load)
- Uses localStorage instead of database: avoids schema migration, patientId is required in Visit model
- No PHI risk: patientName is already displayed client-side, no transcript/audio in draft

**Build:** ✅ `tsc --noEmit` passes
**Tests:** ✅ `vitest run` passes (43/43)

---

## DEPLOY: UX-1 through UX-10 to production ✅
**Date:** 2026-02-24
**What was deployed:**
- All UX improvements (UX-1 through UX-10) + post-UX-6 regression fix
- Commits `bb68a12..5193a03` (10 files changed, +1363/-135 lines)
- New files on prod: `SearchModal.tsx`, `api/search/route.ts`

**Deployment method:** `git pull && npm install && npm run build && pm2 restart omniscribe`
**Build:** ✅ Compiled successfully in 14.4s (Turbopack)
**PM2:** ✅ Process online, ready in 1021ms
**Health check:** ✅ All pages responding (landing 200, login 200, authenticated routes 307 redirect)
**Known warnings:**
- `ANTHROPIC_API_KEY is not set` — intentional, Anthropic is backup only (Grok/xAI is primary)
- Stale "Server Action" errors in PM2 error log — from cached clients hitting old deployment, clears on its own

---

## FIX-18: Rate limit response headers + hide X-Powered-By ✅
**Date:** 2026-02-24
**Files changed:**
- `app/src/lib/rate-limiter.ts` (MODIFIED) — added `limit` field to `RateLimitResult` interface
- `app/middleware.ts` (MODIFIED) — attach `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset` to all API responses (both 200 and 429), added headers to login 429 for consistency
- `app/next.config.ts` (MODIFIED) — added `poweredByHeader: false` to suppress `X-Powered-By: Next.js`

**What it does:**
- All API responses now include rate limit headers: `X-RateLimit-Limit` (max per window), `X-RateLimit-Remaining` (remaining), `X-RateLimit-Reset` (seconds until window resets)
- Login 429 responses now also include rate limit headers (previously only had `Retry-After`)
- `X-Powered-By: Next.js` header removed from all responses (reduces server fingerprinting)
- Note: `/api/transcribe` and `/api/ocr` are excluded from middleware matcher — they don't get rate limit headers

**What could break:**
- Nothing — headers are additive, no existing tests assert on response headers

**Build:** ✅ `tsc --noEmit` passes
**Tests:** ✅ `vitest run` passes (43/43)

---

## FIX-19: BH note demographics missing from note body ✅
**Date:** 2026-02-24
**Files changed:**
- `app/src/app/api/generate-note/route.ts` (MODIFIED) — extraction schema + note prompt

**What it does:**
- Added explicit `patient_demographics` block (name, age, gender, occupation) to the fact extraction JSON schema — ensures demographics are always captured regardless of framework
- Previously demographics only appeared if a framework section happened to contain them (rehab/medical had them, BH did not)
- Strengthened note generation prompt rule #2: "The FIRST section MUST begin with a patient identification line" with concrete example format
- Demographics from `patient_demographics` are stored in EncounterState sections and serialized into the note generation prompt via `serializeFactsForPrompt`

**What could break:**
- All frameworks now extract demographics into a separate `patient_demographics` section — this is additive, won't affect existing sections
- Notes may now have a slightly different opening style (identification line first) — this is the desired behavior

**Build:** ✅ `tsc --noEmit` passes
**Tests:** ✅ `vitest run` passes (43/43)

## FIX-20: Dashboard uses mock data instead of real visits ✅
**Date:** 2026-02-24
**Files changed:**
- `app/src/app/dashboard/page.tsx` (MODIFIED) — replaced mock data with real API calls

**What it does:**
- Removed `import { mockVisits } from '@/lib/mock-data'` — dashboard no longer uses mock data
- Added `ApiVisit` interface and `visits`/`visitsLoading` state
- Fetches real visits from `GET /api/visits?limit=20` on mount
- Stats (Total Notes, This Week, Avg Duration, Frameworks Used) now computed from real visit data
- Recent Notes list renders real visits with patient names from `patient.firstName + lastName`
- Framework names resolved via `frameworks.find()` lookup
- Domain colors use existing `getDomainColor()` utility instead of hardcoded `domainColors` map
- Added loading state ("Loading visits...") and empty state ("No notes yet" with CTA)
- Status badges: green for "complete", amber for other statuses

**What could break:**
- If `/api/visits` returns unexpected shape, dashboard shows empty state (fails silently)
- `mock-data.ts` still imported by `visit/[id]/page.tsx` and `api/transcribe/route.ts` — NOT deleted yet

**Build:** ✅ `npm run build` passes
**Tests:** ✅ `vitest run` passes (43/43)

## FIX-21: MEMORY.md pipeline description stale ✅
**Date:** 2026-02-24
**Files changed:**
- `.claude/projects/-Users-giljrjavelosa/memory/MEMORY.md` (MODIFIED) — corrected pipeline description

**What it does:**
- Updated "Note Generation Pipeline" section: removed stale "7-pass" description
- Now correctly documents: 2-pass encounter-state mode + 3-pass transcript mode (both share same 2-pass core)
- Updated key source files reference from "7-pass + 2-pass" to "2-pass + 3-pass transcript mode"
- Added FIX-20 to git history

**What could break:** Nothing — documentation only

## FIX-22: Audio chunking for large WAV files >25MB ✅ (ALREADY IMPLEMENTED)
**Date:** 2026-02-24
**Status:** Verified already complete — no changes needed
**Files already in place:**
- `app/src/lib/audio-chunker.ts` — WAV parser, splitter (20MB chunks), WAV header creation
- `app/src/app/api/transcribe/route.ts` — size-based routing: WAV >24MB → chunked, non-WAV >24MB → 413 reject, ≤24MB → single request
- `app/src/app/visit/new/page.tsx` — client-side early rejection of non-WAV >24MB, progress text for large files
- `app/tests/unit/audio-chunker.test.ts` — 20 unit tests all passing

## FIX-23: Turbopack build warning — phi-crypto in Edge middleware ✅
**Date:** 2026-02-24
**Files changed:**
- `app/src/lib/auth.config.ts` (NEW) — Edge-compatible NextAuth config (no DB adapter, no Node.js crypto)
- `app/src/lib/auth.ts` (MODIFIED) — now extends `authConfig` from `auth.config.ts`
- `app/middleware.ts` (MODIFIED) — imports from `auth.config` instead of `auth`
- `app/src/lib/db.ts` (UNCHANGED) — reverted lazy-import experiment, static import is fine now

**What it does:**
- Split NextAuth config into Edge-compatible (`auth.config.ts`) and full Node.js (`auth.ts`) following official NextAuth v5 pattern
- `auth.config.ts` exports session/JWT/callback config — no DB, no crypto, no bcrypt
- `auth.ts` extends the base config with `PrismaAdapter`, Credentials provider, authorize logic
- Middleware now creates its own `auth` from the Edge config, breaking the import chain: `middleware → auth → db → phi-crypto → crypto`
- Eliminates: "A Node.js module is loaded ('crypto' at line 14) which is not supported in the Edge Runtime"

**What could break:**
- Middleware auth session still works (JWT-only, same callbacks)
- Server-side `auth()` calls in API routes still use the full config with DB adapter
- If new callbacks are added, they must be added in `auth.config.ts` (shared) not just `auth.ts`

**Build:** ✅ `npm run build` — zero Turbopack warnings
**Tests:** ✅ `vitest run` passes (43/43)
