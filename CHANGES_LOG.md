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

## UX-7: Mobile hamburger menu
**Priority:** MEDIUM — clinicians use tablets in exam rooms
**Files to change:**
- `app/src/components/Sidebar.tsx` — add mobile toggle (hamburger icon)
- `app/src/components/Header.tsx` — add hamburger button on small screens

**What could break:**
- Sidebar z-index conflicts with modals/overlays
- Touch targets must be 44px+ for mobile accessibility

---

## UX-8: Smart framework suggestion from provider type
**Priority:** LOW — show rehab frameworks first for PT, medical for MD, etc.
**Files to change:**
- `app/src/app/visit/new/page.tsx` — auto-filter domain based on selected provider type
- `app/src/lib/frameworks.ts` — add provider-type-to-domain mapping

**What could break:**
- Clinicians who work across domains (e.g., NP doing both medical and BH)
- Must be a suggestion, not a restriction

---

## UX-9: Framework search field
**Priority:** LOW — search all 19 frameworks by keyword
**Files to change:**
- `app/src/app/visit/new/page.tsx` — add search input above framework list

**What could break:**
- Minor — purely additive UI change

---

## UX-10: Auto-save drafts to database
**Priority:** LOW — prevents data loss on session expiry
**Files to change:**
- `app/src/app/visit/new/page.tsx` — periodic auto-save to API
- `app/src/app/api/visits/route.ts` — support upsert for draft visits
- `app/src/app/dashboard/page.tsx` — show "Resume Draft" section

**What could break:**
- PHI in draft visits — must be encrypted (already handled by FIX-1)
- Multiple drafts per user — need cleanup/expiry logic
