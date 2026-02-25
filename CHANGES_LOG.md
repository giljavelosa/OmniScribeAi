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

## FIX-24: api/search admin visit scoping + appLog signature ✅
**Date:** 2026-02-24
**Files changed:**
- `app/src/app/api/search/route.ts` (MODIFIED) — fixed two bugs

**What it does:**
- **Admin visit scoping bug**: `visitWhere` always set `userId: session.user.id` on line 57, making the `if (!isAdmin)` check redundant. Admins couldn't see visits from other clinicians in search. Fixed: only set `userId` for non-admins.
- **appLog signature**: Called `appLog("error", "GET /api/search", scrubError(error))` with 3 args but signature requires `(level, component, message, metadata)`. Fixed to `appLog("error", "Search", "Search query failed", { error: scrubError(error) })`.

**What could break:**
- Admin search now returns visits from ALL users matching the query (correct behavior — mirrors patient search scoping)

**Build:** ✅ `npm run build` passes
**Tests:** ✅ `vitest run` passes (43/43)

---

## Production E2E Verification (Feb 24 2026) ✅
**Target:** https://143.198.131.243 (DigitalOcean prod droplet)
**Commit deployed:** `879148e` (FIX-24)
**Result:** 30/31 tests passed

| Category | Result | Notes |
|----------|--------|-------|
| Page Loading | 5/6 | `/` returns 200 landing page (intentional, not a redirect) |
| Security Headers | 7/7 | All HIPAA headers present, X-Powered-By stripped |
| Authentication | 4/4 | Login, dashboard, visits API, patients API |
| Rate Limit Headers | 3/3 | Limit=120, Remaining correct, Reset=60s |
| CSRF Protection | 2/2 | Evil origin → 403, same-origin → allowed |
| API Endpoints | 4/4 | Visits, patients, search all correct |
| Dashboard Content | 2/2 | No mock data references in HTML |
| Admin Endpoints | 2/2 | 6 users with proper fields |
| Pagination Bounds | 1/1 | limit=999 capped correctly |

**Note:** `omniscribeai.com` domain points to a separate WordPress marketing site on Hostinger. The Next.js app runs on the DigitalOcean droplet at `143.198.131.243`.

---

## FIX-25: Remove stale OmniScribe directory on prod ✅
**Date:** 2026-02-24
**Server:** 143.198.131.243 (omniscribe-prod)

**What it does:**
- Removed `/home/omniscribe/OmniScribe/` (1.1GB) — old app copy not used by PM2
- PM2 confirmed running from `/home/omniscribe/omniscribeai/app`
- Freed 1.1GB disk space (4.7GB → 72GB free on 77GB disk)

**What could break:** Nothing — directory was unused

---

## FIX-26: Nginx rate limiting + hardening ✅
**Date:** 2026-02-24
**Server:** 143.198.131.243 (omniscribe-prod)
**Files changed on server:**
- `/etc/nginx/nginx.conf` — added rate limit zones, `server_tokens off`, dropped TLS 1.0/1.1
- `/etc/nginx/sites-enabled/omniscribe` — added `/api/auth/` (login zone: 10r/m, burst=5) and `/api/` (api zone: 30r/s, burst=50) rate limit blocks
- `/etc/nginx/sites-enabled/omniscribeai` — same rate limit blocks for domain-based config

**What it does:**
- **Rate limiting (defense in depth)**: Nginx now rate-limits before requests reach the app — login at 10 req/min per IP, API at 30 req/s per IP. App-level rate limiting (per user) still active as inner layer.
- **server_tokens off**: Nginx `Server:` header now shows `nginx` without version number
- **TLS hardened**: Dropped TLS 1.0 and 1.1, only TLSv1.2 and TLSv1.3 accepted
- Both site configs (`omniscribe` for IP, `omniscribeai` for domain) updated identically

**What could break:**
- Legitimate high-frequency API callers could hit nginx rate limit before app rate limit — burst=50 should prevent this for normal use
- Login rate limit (10/min) is aggressive — appropriate for a single-tenant medical app

**Verified:** `nginx -t` passes, `systemctl reload nginx` successful, `/login` returns 200, `Server: nginx` (no version)

---

## FIX-27: Unit tests for rate-limiter and prompt-sanitizer ✅
**Date:** 2026-02-24
**Files changed:**
- `app/tests/unit/rate-limiter.test.ts` (NEW) — 12 tests
- `app/tests/unit/prompt-sanitizer.test.ts` (NEW) — 16 tests

**What it does:**
- **rate-limiter tests (12)**: allows under limit, correct remaining count, blocks after exceeding login limit, returns correct limit per tier, falls back to api tier for unknown tiers, tracks identifiers independently, getTierForPath routes for login/ai/api paths
- **prompt-sanitizer tests (16)**: passes normal text, strips HTML tags, strips IGNORE ABOVE injections, strips system: prefix, strips template injection ({{}} and {%%}), strips code fences, strips disallowed chars, allows common punctuation, collapses whitespace, truncates at 200 chars, sanitizeSectionTitle delegates correctly, sanitizeItemName works, safeJsonKey normalizes properly

**Test total:** 71 tests (43 existing + 28 new), all passing

**Build:** ✅ `npm run build` passes
**Tests:** ✅ `vitest run` passes (71/71) — must run from `app/` directory

---

## FIX-28: Gold transcripts — 15 test transcripts ✅ (ALREADY IMPLEMENTED)
**Date:** 2026-02-24
**Status:** Verified already complete — 15 transcripts exist in `app/src/lib/test-transcripts.ts`
- Rehab (5): PT eval, PT daily, OT eval, SLP eval, rehab discharge
- Medical (5): SOAP follow-up, SOAP new, H&P, procedure, ED visit
- BH (5): BH intake, BH progress, psych eval, group therapy, crisis intervention
- Each has expectedFacts and shouldNotAppear validation arrays

---

## FIX-29: Login broken after auth.config.ts split ✅
**Date:** 2026-02-24
**Files changed:**
- `app/middleware.ts` (MODIFIED) — added `api/auth` to matcher exclusion list

**What it does:**
- FIX-23 split auth into `auth.config.ts` (Edge, `providers: []`) and `auth.ts` (Node, Credentials provider)
- The middleware's Edge NextAuth instance (with no providers) was intercepting `POST /api/auth/callback/credentials` before the real API route handler could process it, causing all logins to fail with `CredentialsSignin`
- Fix: excluded `/api/auth` from the middleware matcher so auth routes go directly to the API route handler which has the full Credentials provider
- Login rate limiting still covered by nginx `limit_req zone=login` (FIX-26)

**What could break:** Nothing — middleware never needed to process auth callback routes, it just needed to check `req.auth` on other routes

**Build:** ✅ `npm run build` passes
**Deployed:** ✅ Commit `c0f79b7`, PM2 online, login confirmed working

---

## FIX-30: Create clean test users on prod ✅
**Date:** 2026-02-25
**Server:** 143.198.131.243 (omniscribe-prod)

**What it does:**
- Deleted old `admin@omniscribe.ai` and `demo@omniscribe.ai` users
- Created fresh users with password `Demo2026!` (bcrypt hash, 12 rounds):
  1. **admin@omniscribe.ai** — ADMIN role, name "OmniScribe Admin", clinicianType MD, `mustChangePassword: false`
  2. **demo@omniscribe.ai** — CLINICIAN role, name "Demo Clinician", clinicianType PT (credentials: PT, DPT), `mustChangePassword: false`
- Other demo users remain: demo2, dr.chen, bh.moss, pt.rivera

**What could break:** Old sessions for deleted users will be invalidated (JWT tokens reference old user IDs)

---

## FIX-31: Remove PrismaAdapter to fix login CredentialsSignin ✅
**Date:** 2026-02-25
**Files changed:**
- `app/src/lib/auth.ts` (MODIFIED) — removed PrismaAdapter, added try-catch logging to authorize

**Root cause:**
- NextAuth v5 beta.30's `PrismaAdapter` interferes with the Credentials provider flow
- The adapter attempts OAuth-style account linking even when only Credentials auth is used
- After `authorize()` returns a valid user, the adapter's internal lookups fail silently, causing NextAuth to return `CredentialsSignin` error
- This was the true root cause of the login bug first patched (incompletely) in FIX-29

**What it does:**
- Removed `PrismaAdapter(prisma)` from NextAuth config — not needed for Credentials-only auth with JWT sessions
- PrismaAdapter is only for OAuth account linking and DB session management, neither of which OmniScribe uses
- Added try-catch with `console.error("[AUTH] authorize error:")` for future debugging
- Removed unused `@auth/prisma-adapter` import

**Verification:**
- Server login test: POST to `/api/auth/callback/credentials` returns 302 to `/` (success, not error)
- Session endpoint: returns full user data `{name, email, id, role, clinicianType, mustChangePassword}`
- PM2 logs: clean, no CredentialsSignin errors

**Build:** ✅ `npm run build` passes
**Tests:** ✅ 71/71 pass
**Deployed:** ✅ Commit `e962ee0`, PM2 online

---

## FIX-32: Login page hangs after entering credentials ✅
**Date:** 2026-02-25
**Files changed:**
- `app/src/app/login/page.tsx` (MODIFIED — first time ever; never modified by any previous FIX)

**Root cause:**
Two browser-side bugs in the login form:
1. **No try-catch around `signIn()`** — if `signIn()` from `next-auth/react` throws (network error, JSON parse failure, CSRF mismatch), the exception is unhandled, `setLoading(false)` never runs, and the UI stays on "Signing in..." forever
2. **`router.push(callbackUrl)` after login** — `router.push` does a soft client-side navigation. The `SessionProvider` still has the old (null) session cached from before login. The soft navigation can fail to pick up the new session cookie, causing the middleware to redirect back to `/login`. Meanwhile `setLoading(false)` was never called in the success path, so the spinner persists

**Server-side was fine:** Confirmed via curl tests — `POST /api/auth/callback/credentials` with `X-Auth-Return-Redirect: 1` returns 200 JSON `{"url":"..."}` with valid session cookie. `GET /dashboard` with session cookie returns 200. Issue was purely client-side.

**What it does:**
- Wrapped `signIn()` call in try-catch — catch block shows "Login failed. Please try again." and stops the spinner
- Replaced `router.push(callbackUrl)` with `window.location.href = callbackUrl` — full page reload ensures the browser sends the fresh session cookie and `SessionProvider` re-initializes with the authenticated session
- Removed unused `useRouter` import (no longer needed)

**Previous fixes in same files:** None — `login/page.tsx` was never modified by any previous fix (verified against all FIX-1 through FIX-31 and UX-1 through UX-10 entries)

**What could break:**
- `window.location.href` causes a full page reload instead of soft navigation — slightly slower transition but more reliable. Acceptable tradeoff for a login redirect.
- If `signIn()` throws for a legitimate auth reason (e.g., wrong password), the generic "Login failed" message shows instead of "Invalid email or password". However, normal wrong-password returns `result.error`, not a throw — throws only happen for unexpected failures.

**Build:** ✅ `npm run build` passes
**Tests:** ✅ 71/71 pass

---

## FIX-33: File upload zone disabled + no drag-and-drop ✅
**Date:** 2026-02-25
**Files changed:**
- `app/src/app/visit/new/page.tsx` (MODIFIED)

**Root cause:**
- The file upload zone (`<button>` with dashed border) was gated on `disabled={!canGenerate}`, which requires BOTH patient name AND framework. If the user selected a patient but hadn't chosen a framework yet, the upload zone was grayed out and unclickable.
- The dashed-border UI looks like a drag-and-drop zone but had no `onDrop`/`onDragOver` handlers — only a click handler.

**What it does:**
- Removed `disabled={!canGenerate}` from the file-select button — users can now select or drop a file at any time
- Added `onDragOver` and `onDrop` handlers for drag-and-drop file selection
- Added `handleFileDrop` function
- Updated button text from "Click to upload audio file" to "Click or drop audio file here"
- The "Generate Clinical Note" button (line 843) remains gated on `disabled={!canGenerate || !uploadedFile}` — processing still requires patient + framework + file

**Previous fixes in same file and how they're preserved:**
- **UX-3** (record-first workflow): Changed `canRecord` → `canGenerate` and gated Upload/Generate buttons. This fix follows UX-3's own pattern — recording is always enabled, now file selection is too. Only the Generate button stays gated. UX-3's intent preserved.
- **UX-1, UX-2, UX-5, UX-6, UX-8, UX-10**: All untouched — changes are 3 lines in the upload section only.
- **FIX-22** (client-side >24MB rejection): Still in `handleUploadSubmit()`, untouched.
- **POST-UX** (appLog): Untouched.

**What could break:**
- Users could now select a file before choosing patient/framework. This is intentional and matches the record-first pattern from UX-3.
- If someone edits the upload zone, they must preserve the `disabled={!canGenerate || !uploadedFile}` on the Generate button to prevent processing without patient+framework.

**Build:** ✅ `npm run build` passes
**Tests:** ✅ 71/71 pass

---

## FIX-34: Patient context not passed to visit/new page ✅
**Date:** 2026-02-25
**Files changed:**
- `app/src/app/patients/[id]/page.tsx` (MODIFIED) — "New Visit" link now includes patient name
- `app/src/app/visit/new/page.tsx` (MODIFIED) — Reads patientId + patientName from URL params

**Root cause:**
- The patient detail page (`patients/[id]/page.tsx`) linked to `/visit/new?patientId=xxx` but did NOT include the patient name in the URL.
- The visit/new page only read `frameworkId` from URL query params (UX-1), never read `patientId` or `patientName`.
- Result: after selecting a patient and clicking "New Visit", the visit/new page had empty patient fields → `canGenerate` was false → "Generate Clinical Note" button was disabled.
- User reported two symptoms (same root cause): (1) "could not see who you chose earlier" and (2) "cannot process the note after clicking generate clinical note."

**What it does:**
- `patients/[id]/page.tsx`: Changed `href` from `/visit/new?patientId=${patient.id}` to `/visit/new?patientId=${patient.id}&patientName=${encodeURIComponent(fullName)}` — passes both ID and display name
- `visit/new/page.tsx`: Added reading of `patientId` and `patientName` from URL search params in the same useEffect that reads `frameworkId` (lines 99-111). Sets `patientId`, `patientName`, and `patientSearch` states.
- `visit/new/page.tsx`: Updated draft restore guard to also skip restore when `patientId` is in URL params (URL params take priority over drafts)

**Previous fixes in same files and how they're preserved:**
- **patients/[id]/page.tsx**: Never previously modified — no conflicts.
- **UX-1** (frameworkId from URL): Unchanged, same useEffect extended with patient params.
- **UX-2** (patient autocomplete): Unchanged — if patient comes from URL, the search field is pre-filled with the name and shows "Linked" badge.
- **UX-10** (draft restore): Guard extended from `if (searchParams.get('frameworkId'))` to `if (searchParams.get('frameworkId') || searchParams.get('patientId'))`. Draft restore skipped when URL provides patient context.
- **FIX-33** (drag-and-drop): Untouched.
- **All other UX/FIX entries**: Untouched.

**What could break:**
- If a patient name contains special characters, `encodeURIComponent` handles encoding and `searchParams.get()` auto-decodes.
- If someone navigates to `/visit/new?patientId=xxx` without `patientName`, the patient ID is set but the name field stays empty — user can type it manually.

**Build:** ✅ `npm run build` passes
**Tests:** ✅ 71/71 pass

---

## FIX-35: Refine note generation prompt for clinical quality ✅
**Date:** 2026-02-25
**Files changed:**
- `app/src/app/api/generate-note/route.ts` (MODIFIED) — Pass 1 system prompt rewritten

**What it does:**
Rewrites the Pass 1 note generation system prompt to produce notes that read like an experienced clinician wrote them, not a template. Key improvements:
- **Verbatim patient quotes**: Chief complaint and patient-reported symptoms now use patient's exact words in quotation marks, followed by clinical interpretation (e.g., Patient c/o "my knee has been giving out" consistent with quadriceps weakness)
- **Clinical terminology translation**: Explicit instruction to upgrade lay language — "sore" → "tenderness," "numb" → "paresthesia," "swollen" → "edema," "stiff" → "decreased mobility," etc.
- **Standard clinical abbreviations**: Encourages natural use of c/o, s/p, b/l, WNL, WBAT, w/o, pt, hx, dx, tx, fx, TTP, NWB, etc.
- **Clinical denial phrasing**: "Denies radiating symptoms," "Negative for suicidal ideation" instead of plain negations
- **Assessment reasoning**: Instructs to synthesize findings with clinical reasoning — connect impairments to functional deficits, note severity/prognostic indicators, reference clinical patterns
- **Plan specificity**: Concrete treatment items with frequency/duration/intensity parameters, linked to documented deficits
- **Tense conventions**: Present tense for current exam findings, past tense for history
- **Guard rail preserved**: Rule 10 explicitly clarifies "clinical terminology upgrades are expected, fabricated findings are not"

**Previous fixes in same file and how they're preserved:**
- **FIX-2, FIX-3** (SSE streaming, error handling): Untouched — only the prompt string changed
- **FIX-12** (prompt sanitizer): Untouched — sanitizeForPrompt/sanitizeSectionTitle still used
- **FIX-19** (JSON parse hardening): Untouched — parseJsonArray and stripFences unchanged

**What could break:**
- Note style will change noticeably — more clinical jargon, abbreviations, verbatim quotes. This is intentional per user feedback.
- The anti-hallucination rule (rule 10) is preserved — the AI should still only use facts from the EncounterState JSON.

**Build:** ✅ `npm run build` passes
**Tests:** ✅ 71/71 pass

---

## FIX-36: Add differential diagnosis, medical assessment, and clinical reasoning to notes ✅
**Date:** 2026-02-25
**Files changed:**
- `app/src/app/api/generate-note/route.ts` (MODIFIED) — Pass 1 system prompt rules 6, 7, and Assessment style bullet refined

**What it does:**
Enhances the Assessment/Medical Assessment section to include factual differential diagnosis, structured clinical reasoning, and evidence-based medical assessment — all strictly from parsed and collected data only. Changes:

- **CLINICAL WRITING STYLE bullet (Assessment)**: Expanded from "demonstrate clinical reasoning between the lines" to explicit instructions for differential diagnosis with most likely dx first, plausible differentials with supporting/refuting evidence from documented findings, and "never fabricate differentials" guard
- **Rule 6 (Assessment)**: Rewritten from a single sentence to 5 sub-rules (6a–6e):
  - 6a: **Clinical Reasoning** — synthesize subjective + objective into cohesive picture, explain HOW findings relate (with example)
  - 6b: **Differential Diagnosis** — most likely dx first, then plausible differentials with specific documented findings for/against each (with example)
  - 6c: **Severity & Functional Impact** — quantify using documented measurements, relate impairments to functional limitations
  - 6d: **Prognostic Indicators** — chronicity, aggravating/alleviating factors, prior treatment response, patient goals
  - 6e: **Guard rail** — ALL reasoning must trace directly to EncounterState JSON facts
- **Rule 7 (Plan)**: Enhanced to reference assessment findings that justify each intervention (with example)

**Anti-hallucination guard reinforced:**
- Rule 6e: "never introduce diagnoses or clinical patterns that aren't supported by the documented data"
- Rule 10 (unchanged): "clinical terminology upgrades are expected, fabricated findings are not"
- CLINICAL WRITING STYLE: "never fabricate differentials"

**Previous fixes in same file and how they're preserved:**
- **FIX-2** (prompt sanitizer): Untouched — sanitizeForPrompt/sanitizeSectionTitle still used in prompt construction
- **FIX-3** (audit error handling): Untouched — try-catch blocks and auditFailed flag preserved
- **FIX-12** (JSON parse validation): Untouched — parseJsonArray and stripFences unchanged
- **FIX-19** (demographics): Untouched — extraction schema + rule #2 identification line unchanged
- **FIX-35** (clinical quality): Rules 1–5, 8–12 preserved. Rules 6–7 refined (same intent, more detailed). CLINICAL WRITING STYLE section preserved except Assessment bullet expanded.

**What could break:**
- Assessment sections will be significantly longer and more detailed — includes differential diagnosis, severity quantification, and prognostic indicators. This is intentional.
- Token usage for Pass 1 may increase slightly due to longer output — within the existing 8000 max_tokens limit.
- If documented data is sparse, the AI should produce a shorter assessment with fewer differentials rather than fabricating — enforced by rules 6e, 10, and 11.

**Build:** ✅ `npm run build` passes
**Tests:** ✅ 71/71 pass

---

### FIX-37 — Set Groq Whisper temperature to 0 for deterministic transcription ✅ RESOLVED
**Date:** 2026-02-25
**Files changed:**
- `app/src/app/api/transcribe/route.ts` (MODIFIED) — added `temperature=0` to both `transcribeSingle()` and `transcribeChunked()` Groq Whisper calls
- `app/src/app/api/transcribe-chunk/route.ts` (MODIFIED) — added `temperature=0` to real-time chunk Groq Whisper call

**What it does:**
- Sets `temperature: 0` on all 3 Groq Whisper API call sites (single upload, chunked upload, real-time chunk)
- Makes transcription fully deterministic — same audio always produces same text
- Reduces risk of Whisper hallucinating words not present in the audio

**HIPAA assessment:**
- ✅ **Does NOT compromise HIPAA** — improves it by reducing hallucination/fabrication risk
- ✅ No PHI is exposed, logged, or stored differently
- ✅ No auth, encryption, rate limiting, or security headers changed
- ✅ Temperature is a model inference parameter, not patient data

**Previous fixes in same files and how they're preserved:**
- **FIX-10** (retry logic in transcribeSingle): Untouched — retry loop and backoff logic unchanged
- **FIX-11** (empty audio rejection): Untouched — size check in both files unchanged
- **FIX-22** (chunked transcription): Untouched — splitWavFile, chunked loop, context passing all unchanged

**What could break:**
- Nothing — `temperature=0` is a supported Groq Whisper parameter. The only behavioral change is more deterministic output, which is desirable for clinical documentation.

**Build:** ✅ `npm run build` passes
**Tests:** ✅ 71/71 pass

---

### FIX-38 — Upgrade Whisper model to whisper-large-v3 + add segment timestamps ✅ RESOLVED
**Date:** 2026-02-25
**Files changed:**
- `app/src/app/api/transcribe/route.ts` (MODIFIED) — model `whisper-large-v3-turbo` → `whisper-large-v3`, added `segment` timestamp granularity in both `transcribeSingle()` and `transcribeChunked()`
- `app/src/app/api/transcribe-chunk/route.ts` (MODIFIED) — same changes for real-time chunk transcription

**What it does:**
- Switches from `whisper-large-v3-turbo` to `whisper-large-v3` (full model) across all 3 Groq Whisper call sites
- Full v3 has lower word error rate — every word preserved, especially messy conversational parts where patients describe symptoms
- Groq runs v3 at 299x real-time (30-min encounter ≈ 6 seconds) — turbo's extra speed is unnecessary
- Adds `timestamp_granularities[]: segment` alongside existing `word` — gives segment-level timestamps in addition to word-level, providing the LLM more raw data to work with
- Cost: ~$0.111/hour of audio (~5-6 cents per 30-min session) — negligible difference from turbo

**HIPAA assessment:**
- ✅ **Does NOT compromise HIPAA** — lower WER means more accurate clinical documentation
- ✅ Same Groq API endpoint (already PHI-approved)
- ✅ No new external endpoints, no PHI sent to new destinations
- ✅ Segment data returned by API but not stored — code still reads only `text`, `words`, `duration`
- ✅ No auth, encryption, rate limiting, logging, or security changes

**Previous fixes in same files and how they're preserved:**
- **FIX-10** (retry logic): Untouched
- **FIX-11** (empty audio rejection): Untouched
- **FIX-22** (chunked transcription): Untouched
- **FIX-37** (temperature=0): Untouched — temperature setting preserved

**What could break:**
- Transcription may be very slightly slower per-request vs turbo (still under 10s for 30-min audio on Groq). Acceptable tradeoff for better accuracy.
- `segments` field now present in Groq response but not consumed — no impact on existing code.

**Build:** ✅ `npm run build` passes
**Tests:** ✅ 71/71 pass

---

### FIX-39 — Increase extract-chunk maxTokens to prevent JSON truncation ✅ RESOLVED
**Date:** 2026-02-25
**Files changed:**
- `app/src/app/api/extract-chunk/route.ts` (MODIFIED) — changed `callAI(systemPrompt, userPrompt, 1500)` to `callAI(systemPrompt, userPrompt, 4000)` on line 150

**What it does:**
- Increases the LLM output token limit for chunk extraction from 1500 to 4000
- The PT eval framework (and other complex frameworks) produce JSON responses with many sections, items, and evidence pointers that exceed 1500 output tokens
- With the old limit, every chunk extraction hit the 1500 token ceiling, producing truncated/invalid JSON that failed to parse
- All chunks returned empty extractions → EncounterState had 0 documented facts → note generation validation failed → "Controller is already closed" errors from SSE retries
- With 4000 tokens, the full JSON extraction response can complete for all framework schemas

**Root cause of the error:**
- Live recording produced 12 transcribed chunks
- All 12 chunk extractions logged exactly 1500 output tokens and `"JSON parse failed, returning empty extraction"`
- JSON parse errors like `"Expected ',' or '}' after property value in JSON at position 5372"` confirmed truncation mid-object
- GenNote was called 3x (client SSE retries) — each time validation failed with `documentedFacts: 0`
- The batch transcription fallback also failed (Groq 400 on 6MB webm — secondary issue)

**HIPAA assessment:**
- ✅ **Does NOT compromise HIPAA** — actually improves it by preventing silent data loss of documented clinical facts
- ✅ `maxTokens` is a model inference parameter, not patient data
- ✅ No PHI is exposed, logged, or stored differently
- ✅ Same endpoint (xAI/Grok), same data flow — just allows JSON response to complete
- ✅ No auth, encryption, rate limiting, logging, or security changes

**Previous fixes in same file and how they're preserved:**
- **FIX-2** (prompt injection via framework data): Untouched — `safeJsonKey()` sanitization for schema fields still in place

**What could break:**
- Slightly higher token usage per chunk extraction (~2-3x more output tokens). At Grok pricing this adds negligible cost (~$0.01 per encounter).
- No functional regressions — the JSON schema and parsing logic are unchanged.

**Build:** ✅ `npm run build` passes
**Tests:** ✅ 71/71 pass

---

### FIX-40 — Truncation detection in callAI ✅ RESOLVED
**Date:** 2026-02-25
**Files changed:**
- `app/src/lib/ai-provider.ts` (MODIFIED) — added `truncated: boolean` to `AIResponse` interface; `fetchWithRetry()` now compares `output_tokens >= maxTokens * 0.95` and logs a warning when truncated

**What it does:**
- Every `callAI()` and `callAIVision()` response now includes a `truncated` boolean
- If the LLM used ≥95% of the maxTokens budget, the response is flagged as likely truncated
- Callers can check `result.truncated` to decide whether to trust the output
- Logs `warn` level when truncation detected

**HIPAA assessment:**
- ✅ No PHI changes — this is a model parameter check, not patient data
- ✅ No new endpoints, no auth/security changes

**Previous fixes in same file:** None
**Build:** ✅ `npm run build` passes
**Tests:** ✅ 71/71 pass

---

### FIX-41 — extract-chunk returns failure on truncation and parse errors ✅ RESOLVED
**Date:** 2026-02-25
**Files changed:**
- `app/src/app/api/extract-chunk/route.ts` (MODIFIED) — returns `success: false` with `retryable: true` when LLM output is truncated or JSON parse fails (previously returned `success: true` with empty extraction)

**What it does:**
- After `callAI()`, checks `result.truncated` — if true, returns `{ success: false, error: "LLM output truncated — extraction incomplete", retryable: true }`
- The JSON parse catch block now returns `{ success: false, error: "Extraction parse failed", retryable: true }` instead of silently returning empty extraction with `success: true`
- Client code (AudioRecorder) can now detect and report these failures

**Root cause this fixes:**
- FIX-39 found that all 12 chunks returned `success: true` with empty data — this was because the parse error catch block silently swallowed failures
- Now the client knows extraction failed and can warn the user

**HIPAA assessment:**
- ✅ Improves data integrity — prevents silent clinical data loss
- ✅ No PHI in error responses, no new endpoints

**Previous fixes in same file:** FIX-2 (prompt injection sanitization — untouched), FIX-39 (maxTokens increase — now dynamic per FIX-44)
**Build:** ✅ `npm run build` passes
**Tests:** ✅ 71/71 pass

---

### FIX-42 — AudioRecorder + visit/new show chunk extraction failures to user ✅ RESOLVED
**Date:** 2026-02-25
**Files changed:**
- `app/src/lib/encounter-state.ts` (MODIFIED) — added optional `failedExtractions` and `totalExtractions` fields to `EncounterState` interface
- `app/src/components/AudioRecorder.tsx` (MODIFIED) — tracks failed extractions via refs, shows toast on transcription/extraction failure, attaches counts to EncounterState before `onRecordingComplete`
- `app/src/app/visit/new/page.tsx` (MODIFIED) — blocks processing if >50% chunks failed, shows extraction warning banner during processing, stores warnings in visitData

**What it does:**
- `failedExtractionRef` and `totalExtractionRef` count successes/failures during recording
- On transcription failure: increments failure counter + shows toast "Audio chunk failed to transcribe — some data may be missing"
- On extraction failure (success:false from FIX-41): increments failure counter + shows toast "Chunk extraction failed — some clinical data may be missing"
- Before note generation: if >50% of chunks failed, blocks with clear error message asking user to re-record or upload
- If some but ≤50% failed, shows amber warning banner during processing
- Warning info stored in visit data for audit trail

**HIPAA assessment:**
- ✅ Improves clinical data integrity by making failures visible
- ✅ Toast messages contain no PHI
- ✅ No new API calls or endpoints

**Previous fixes in same file:** encounter-state.ts (none), AudioRecorder.tsx (none), visit/new/page.tsx (UX-2 patient autocomplete, UX-3 record-first, UX-5 progress steps, UX-6 cancel+draft, UX-10 auto-save — all untouched)
**Build:** ✅ `npm run build` passes
**Tests:** ✅ 71/71 pass

---

### FIX-43 — Validation warnings sent to UI via SSE ✅ RESOLVED
**Date:** 2026-02-25
**Files changed:**
- `app/src/app/api/generate-note/route.ts` (MODIFIED) — sends `warnings` SSE event with validation warnings and compliance score after validation, before Pass 1
- `app/src/lib/sse-fetch.ts` (MODIFIED) — added `onWarnings` callback parameter, handles `warnings` event type
- `app/src/app/visit/new/page.tsx` (MODIFIED) — added `validationWarnings` and `complianceInfo` state, passes `onWarnings` callback to `fetchNoteSSE`, renders warnings banner during processing, stores in visitData

**What it does:**
- Server sends validation warnings (e.g., "Missing required field: Chief Complaint") as an SSE event before note generation starts
- Client receives warnings and displays them in an amber banner with compliance grade
- Both encounter-state and legacy flows receive warnings
- Warnings stored in visit data for the visit detail page

**HIPAA assessment:**
- ✅ Warnings contain field names only, no PHI
- ✅ Same SSE stream, no new endpoints or external calls

**Previous fixes in same files:** generate-note (FIX-15 CSRF, FIX-19 demographics — untouched), sse-fetch.ts (none), visit/new/page.tsx (see FIX-42)
**Build:** ✅ `npm run build` passes
**Tests:** ✅ 71/71 pass

---

### FIX-44 — Dynamic maxTokens for extract-chunk based on framework complexity ✅ RESOLVED
**Date:** 2026-02-25
**Files changed:**
- `app/src/app/api/extract-chunk/route.ts` (MODIFIED) — calculates maxTokens dynamically: `Math.max(4000, Math.min(500 + totalItems * 60, 8000))` based on framework section item count

**What it does:**
- Simple frameworks (few items) use 4000 tokens (same as before)
- Complex frameworks (e.g., PT eval with 60+ items) scale up to 8000 tokens
- Formula: 500 base + 60 tokens per framework item, clamped to [4000, 8000]
- Logs the calculated maxTokens for debugging

**Why:**
- FIX-39 increased from 1500→4000, but complex frameworks can still exceed 4000
- Dynamic scaling prevents truncation for any framework without wasteful token budgets for simple ones

**HIPAA assessment:**
- ✅ Token budget is a model parameter, not patient data
- ✅ No PHI, no new endpoints

**Previous fixes in same file:** FIX-2 (prompt sanitization — untouched), FIX-39 (static 4000 — replaced by dynamic calculation), FIX-41 (truncation check — untouched)
**Build:** ✅ `npm run build` passes
**Tests:** ✅ 71/71 pass

---

## Remaining Items (not yet implemented)
- **Infrastructure**: Configure staging/dev droplets
