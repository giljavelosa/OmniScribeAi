# OmniScribe — Launch Readiness Audit & Sign-Off Checklist

**Audit Date:** 2026-02-22
**Auditor:** Engineering (Claude Code Automated Audit)
**Phase:** Beta Testing (no real patient data)
**BAA Timeline:** All three BAAs expected signed within 1 week
**Document Version:** 1.0

---

## Status Summary

| Category | Status | Blocking Production? |
|---|---|---|
| BAA Execution (Anthropic, Deepgram, DO) | Pending (~1 week) | YES — until signed |
| Credentials in Git | **IMMEDIATE ACTION** | YES |
| Authentication & Secrets | Needs fix | YES |
| PHI Boundary Enforcement | 1 gap | YES |
| Authorization (access control) | Needs fix | YES |
| Input Validation & XSS | Needs fix | YES |
| API Hardening (rate limit, headers) | Needs fix | YES |
| Session & Timeout Policy | Clinician-approved | NO — see §A1 |
| Audit Logging | Partial | NO (acceptable for beta) |
| Clinical Pipeline | Strong | NO |
| Frontend & UX | Minor issues | NO |

---

## PART 1: ITEMS REQUIRING SIGN-OFF

Each item below must be completed before OmniScribe processes real patient data. Check the box and initial/date when resolved.

---

### SEC-01: Credentials Exposed in Git History [IMMEDIATE]

**Severity:** CRITICAL
**File:** `infrastructure.md` (committed to repo)
**Finding:** The following production secrets are in plain text in git history:
- PostgreSQL password: `t9UBsexrNMtfffV5EVul77j5QPhmb4`
- Redis password: `omniscribe_redis_2024`
- Full database connection strings
- SSH access patterns and all server IPs
- `omniscribe` user has passwordless sudo

**Risk:** Anyone with repo access (current or future collaborators, compromised GitHub account) has full database and server access.

**Required Actions:**
```
[ ] Rotate PostgreSQL password on data server (164.92.77.116)
[ ] Rotate Redis password on data server
[ ] Remove infrastructure.md from repo: git rm infrastructure.md
[ ] Purge from git history: git filter-repo or BFG Repo-Cleaner
[ ] Store infrastructure details in a private, non-git location (e.g., 1Password, DO vault)
[ ] Update connection strings in all server .env files after rotation
[ ] Consider restricting omniscribe sudo to specific commands only
```

**Sign-off:** _______________________ Date: ___________

---

### SEC-02: AUTH_SECRET Not Configured

**Severity:** CRITICAL
**File:** No reference found anywhere in codebase
**Finding:** NextAuth v5 requires an `AUTH_SECRET` environment variable to sign JWT tokens. Without it:
- Tokens use an auto-generated key that changes on every server restart
- All user sessions invalidate on every deploy
- Token signing may be predictable

**Required Actions:**
```
[ ] Generate a strong random secret: openssl rand -base64 32
[ ] Add AUTH_SECRET=<value> to .env on all servers (dev, staging, prod)
[ ] Verify sessions persist across server restarts
```

**Sign-off:** _______________________ Date: ___________

---

### SEC-03: Anthropic API Key Tier

**Severity:** CRITICAL (for production with real PHI)
**File:** `HIPAA-PHI-BOUNDARY.md` §4.2
**Finding:** Current Anthropic key is Max plan (consumer tier), which is explicitly ineligible for PHI processing per Anthropic's terms.

**Required Actions:**
```
[ ] Create Anthropic Console account (pay-per-token)
[ ] Generate Console API key
[ ] Replace ANTHROPIC_API_KEY in .env on all servers
[ ] Set ANTHROPIC_CONSOLE_KEY=true in .env (activates the check in phi-boundaries.ts)
[ ] Verify assertProductionApiKey() passes without warning on startup
```

**Sign-off:** _______________________ Date: ___________

---

### BAA-01: Business Associate Agreements

**Severity:** CRITICAL (hard blocker for real patient data)
**Timeline:** Expected ~1 week
**Finding:** All three vendor BAAs are unsigned per HIPAA-PHI-BOUNDARY.md §4.

**Required Actions:**
```
[ ] Anthropic Healthcare Addendum — signed and on file
[ ] Deepgram Business Associate Agreement — signed and on file
[ ] DigitalOcean Business Associate Agreement — signed and on file
[ ] Update HIPAA-PHI-BOUNDARY.md §4 status from "NOT SIGNED" to signed with dates
[ ] Update PHI_APPROVED_ENDPOINTS comments from "PENDING" to confirmed
```

**Sign-off:** _______________________ Date: ___________

---

### PHI-01: PHI Boundary Gap in OCR Scan Route

**Severity:** HIGH
**File:** `app/src/app/api/ocr/scan/route.ts`
**Finding:** This route sends scanned driver's licenses, insurance cards, and intake forms (containing heavy PII/PHI) to the Anthropic API **without calling `assertPhiApprovedEndpoint()`**. All other PHI-processing routes (`/api/transcribe`, `/api/generate-note`, `/api/regenerate-note`, `/api/ocr`) correctly call the guard.

Additionally, the error handler at line 157 returns raw `err.message` to the client without scrubbing — unlike all other routes which use `scrubError()` and `errorCode()`.

**Required Actions:**
```
[ ] Add assertPhiApprovedEndpoint() call before the Anthropic fetch in callClaudeVision()
[ ] Replace catch block with scrubError()/errorCode() pattern (matching other routes)
[ ] Add Cache-Control: no-store header to the success response
[ ] Import appLog, scrubError, errorCode from logger.ts
```

**Sign-off:** _______________________ Date: ___________

---

### AUTH-01: Broken Authorization — No Ownership Checks

**Severity:** HIGH
**Files:**
- `app/src/app/api/visits/[id]/route.ts` (GET and PATCH)
- `app/src/app/api/patients/[id]/route.ts` (GET and PATCH)
- `app/src/app/api/patients/[id]/medical/route.ts` (DELETE)

**Finding:** Any authenticated user can view, edit, or delete any record by guessing/enumerating IDs. Specific issues:

1. **Visit detail** (GET/PATCH): No check that the visit belongs to the requesting user. The list endpoint correctly filters by `userId`, but the detail endpoint does not.
2. **Patient detail** (GET/PATCH): No user or organization scoping. Any authenticated user can view/edit any patient.
3. **Medical record DELETE**: Deletes by `itemId` without verifying the item belongs to the patient specified in the URL path. An attacker could delete any allergy/medication/condition across any patient.

**Required Actions:**
```
[ ] Visit GET/PATCH: verify visit.userId matches session user (or user is ADMIN/SUPERVISOR)
[ ] Patient GET/PATCH: add organization scoping or user-level access control
[ ] Medical DELETE: verify the item's patientId matches the :id param before deleting
[ ] Add audit log entries for access denied attempts
```

**Sign-off:** _______________________ Date: ___________

---

### AUTH-02: Mass Assignment on PATCH Routes

**Severity:** HIGH
**Files:**
- `app/src/app/api/visits/[id]/route.ts:51`
- `app/src/app/api/patients/[id]/route.ts:50`

**Finding:** Both routes pass the raw request body (minus a few stripped fields) directly to `prisma.update()`. An attacker could set any field the schema accepts. The admin user update route (`admin/users/[id]/route.ts`) correctly uses an explicit allowlist — the pattern exists but isn't applied everywhere.

**Required Actions:**
```
[ ] Visit PATCH: use explicit allowlist of updatable fields (status, transcript, noteData, etc.)
[ ] Patient PATCH: use explicit allowlist of updatable fields (name, phone, address, etc.)
```

**Sign-off:** _______________________ Date: ___________

---

### XSS-01: Unsanitized HTML Rendering

**Severity:** HIGH
**Files:**
- `app/src/components/NoteEditor.tsx:303`
- `app/src/app/visit/[id]/page.tsx:717`

**Finding:** Both locations use `dangerouslySetInnerHTML` to render content that originates from AI-generated text and transcripts. The `renderMarkdown()` function performs simple string replacements without HTML sanitization. If a patient speaks markup-like content during an encounter (or an adversary crafts input), it could execute as HTML/JS in the clinician's browser.

**Required Actions:**
```
[ ] Install DOMPurify: npm install dompurify @types/dompurify
[ ] Sanitize all dangerouslySetInnerHTML output through DOMPurify.sanitize()
[ ] Alternatively: replace custom renderMarkdown with a proper markdown renderer (react-markdown)
```

**Sign-off:** _______________________ Date: ___________

---

### API-01: No Rate Limiting

**Severity:** HIGH
**Finding:** No rate limiting exists on any endpoint:
- Login: unlimited brute-force attempts possible
- Note generation: each call costs ~$0.30+ in Claude API fees — abuse could cause large bills
- Patient/visit CRUD: unlimited enumeration possible

**Required Actions:**
```
[ ] Add rate limiting middleware (options: next-rate-limit, upstash/ratelimit, or Nginx-level)
[ ] Login: max 5 attempts per email per 15 minutes
[ ] Note generation: max 20 per user per hour
[ ] General API: max 100 requests per user per minute
```

**Sign-off:** _______________________ Date: ___________

---

### API-02: Missing Cache-Control Headers on PHI Routes

**Severity:** HIGH
**Finding:** The following routes return PHI but lack `Cache-Control: no-store` headers. Browsers or intermediate proxies could cache patient data.

| Route | Returns | Cache-Control |
|---|---|---|
| `GET /api/visits` | Visit list with patient names | MISSING |
| `GET /api/visits/[id]` | Full visit with transcript, notes, patient data | MISSING |
| `GET /api/patients` | Patient list with demographics | MISSING |
| `GET /api/patients/[id]` | Full patient record | MISSING |
| `POST /api/patients/[id]/medical` | Medical data confirmation | MISSING |
| `GET /api/admin/users` | User list | MISSING |
| `POST /api/ocr/scan` | Extracted ID/insurance data | MISSING |

**Required Actions:**
```
[ ] Add headers to all routes above:
    Cache-Control: no-store, no-cache, must-revalidate
    Pragma: no-cache
```

**Sign-off:** _______________________ Date: ___________

---

### API-03: Security Headers Not Set

**Severity:** MEDIUM
**Finding:** No security headers configured in Next.js. Current reliance is entirely on Nginx, which may not cover all of these.

**Required Actions:**
```
[ ] Add security headers in next.config.ts or middleware.ts:
    Strict-Transport-Security: max-age=31536000; includeSubDomains
    X-Content-Type-Options: nosniff
    X-Frame-Options: DENY
    Referrer-Policy: strict-origin-when-cross-origin
    Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'
```

**Sign-off:** _______________________ Date: ___________

---

### AUTH-03: Password Policy & Account Security

**Severity:** MEDIUM
**Files:**
- `app/src/app/api/auth/change-password/route.ts`
- `app/src/app/api/admin/users/route.ts`

**Finding:**
- Password change only checks `length < 12` — no complexity requirements
- Admin user creation has **zero** password validation
- No account lockout after failed attempts
- No failed login audit logging

**Required Actions:**
```
[ ] Add password complexity validation (uppercase, lowercase, digit, special char)
[ ] Apply same validation to admin user creation
[ ] Add failed login attempt logging in auth.ts authorize()
[ ] Add account lockout after 10 consecutive failures (unlock after 30 min or admin reset)
```

**Sign-off:** _______________________ Date: ___________

---

### AUTH-04: JWT mustChangePassword Stale After Password Change

**Severity:** MEDIUM
**File:** `app/src/lib/auth.ts`
**Finding:** When a user changes their password and `mustChangePassword` becomes `false` in the database, the JWT still carries the old `true` value until the user signs out and back in. The `jwt` callback only reads user data on initial sign-in.

**Required Actions:**
```
[ ] After password change, force a new sign-in (redirect to /login with success message)
    OR
[ ] Refresh the JWT by re-reading mustChangePassword from DB in the jwt callback on each request
```

**Sign-off:** _______________________ Date: ___________

---

### CODE-01: callClaude Error May Contain PHI

**Severity:** MEDIUM
**File:** `app/src/app/api/generate-note/route.ts:64`
**Finding:** `throw new Error("Claude API error: " + errorText)` — the `errorText` from Anthropic may echo parts of the request body containing transcript/clinical data. This error bubbles up to the SSE error handler which uses `scrubError()`, but the truncated 200 chars may still contain PHI fragments.

**Required Actions:**
```
[ ] Change to: throw new Error(`Claude API error: status ${response.status}`)
[ ] Log errorText length only, not content
```

**Sign-off:** _______________________ Date: ___________

---

### SEC-04: Seed File Passwords in Git

**Severity:** MEDIUM
**File:** `app/prisma/seed.ts`
**Finding:** Contains hardcoded passwords (`OmniScribe2026!`, `Demo2026!`) in version control. While `mustChangePassword: true` forces a change on first login, anyone with repo access knows initial credentials.

**Required Actions:**
```
[ ] Move seed passwords to environment variables: SEED_ADMIN_PASSWORD, SEED_DEMO_PASSWORD
[ ] Or generate random passwords at seed time and print them once
[ ] Purge current passwords from git history (along with infrastructure.md cleanup)
```

**Sign-off:** _______________________ Date: ___________

---

### BETA-01: Mock Mode Should Be Disabled in Production

**Severity:** LOW
**File:** `app/src/app/api/generate-note/route.ts:105`
**Finding:** Falls back to mock data if no API key is configured. In production, this should fail explicitly rather than silently returning fake clinical data.

**Required Actions:**
```
[ ] Add explicit check: if (process.env.NODE_ENV === 'production' && !apiKey) return 500 error
[ ] Or set DISABLE_MOCK=true in production .env and check it
```

**Sign-off:** _______________________ Date: ___________

---

### UX-01: Audio Recorder Status Text Inaccuracy

**Severity:** LOW
**File:** `app/src/components/AudioRecorder.tsx:352`
**Finding:** UI says "Audio saved to server every 10 s" but the chunk route intentionally does NOT save audio to disk (correct PHI boundary decision). The server acknowledges receipt but discards the data.

**Required Actions:**
```
[ ] Change text to: "Audio backed up in browser every 10 s" or "Audio kept in browser memory"
[ ] Update chunk counter text from "saved to server" to "chunks recorded"
```

**Sign-off:** _______________________ Date: ___________

---

### LOG-01: Audit Log Gaps

**Severity:** LOW (acceptable for beta, needed for production)
**Finding:**
- No audit logging for failed login attempts
- No API endpoint to search or export audit logs
- No `console.log` in AudioRecorder.tsx (lines 169, 271) — minor but inconsistent with PHI-safe logging policy

**Required Actions:**
```
[ ] Add failed login logging in auth.ts
[ ] Create GET /api/admin/audit-logs endpoint (admin only, with date/user/action filters)
[ ] Replace console.log in AudioRecorder.tsx with structured logging or remove
```

**Sign-off:** _______________________ Date: ___________

---

### INFRA-01: next-auth v5 Beta

**Severity:** LOW (informational)
**File:** `app/package.json` — `next-auth: ^5.0.0-beta.30`
**Finding:** Authentication layer runs on beta software. This is acceptable during beta testing but should be evaluated for GA launch. Monitor the next-auth changelog for breaking changes and security patches.

**Required Actions:**
```
[ ] Pin to a specific beta version (remove ^ caret) to prevent surprise updates
[ ] Track next-auth v5 stable release — upgrade when available
[ ] Run npm audit periodically for new advisories
```

**Sign-off:** _______________________ Date: ___________

---

## PART 2: ITEMS NOT REQUIRING FIXES

### A1: Session Timeout — 8 Hours (Clinician-Approved)

**Status:** NO ACTION REQUIRED
**Current Setting:** 8-hour JWT max age + 8-hour inactivity timeout with 5-minute warning
**Previous Setting:** 15 minutes (changed based on clinician feedback)

**Clinical Justification:**
The 15-minute auto-logout was evaluated and rejected by multiple clinician groups during beta testing:

- **Surgeons** cannot interact with a device mid-procedure to extend a session — scrubbing out to tap a screen is a patient safety and sterility concern
- **A physician group discontinued a competing AI scribe service** specifically because of aggressive session timeouts interrupting clinical workflow
- **Behavioral health therapists** reported that timeout warnings during therapy sessions disrupted therapeutic rapport and patient trust
- **Rehabilitation therapists** (PT/OT/SLP) perform hands-on patient care that prevents device interaction for extended periods

**Mitigating Controls Already in Place:**
1. Recording heartbeat (`recording-heartbeat` custom event) dispatched every 60 seconds during active recording — prevents timeout during hands-free sessions
2. PHI cleared from localStorage on logout and on session expiry (`clearAllPhiItems()`)
3. PHI items have independent 24-hour TTL regardless of session state
4. All PHI-returning API routes require valid JWT — expired token = no data access
5. JWT `maxAge: 8h` ensures absolute session limit even without activity-based logout

**HIPAA Note:** HIPAA does not mandate a specific timeout duration — it requires "procedures for terminating an electronic session after a predetermined time of inactivity" (§164.312(a)(2)(iii)). The 8-hour window with automatic PHI purge satisfies this requirement while respecting clinical workflow realities. This decision should be documented in the organization's HIPAA policies.

---

### A2: Clinical Pipeline Quality

**Status:** STRONG — no action required

The 6-pass anti-hallucination pipeline is well-designed:
- Pass 1 (fact extraction) enforces strict sourcing rules
- Pass 2 (synthesis) is editable by the clinician before note generation
- Pass 5 (hallucination audit) cross-references the note against source facts
- CMS compliance scoring covers all 19 frameworks
- Temperature is set to 0 for deterministic output
- Per-call 2-minute timeout prevents indefinite hangs
- Retry logic handles Claude overload (429/529) gracefully

---

### A3: PHI-Safe Logging Infrastructure

**Status:** STRONG — no action required

- `appLog()` enforces structured, non-PHI logging
- `scrubError()` truncates error messages to 200 chars
- `errorCode()` generates correlation codes for client-side error references
- Used consistently across `/api/transcribe`, `/api/generate-note`, `/api/regenerate-note`, `/api/ocr`
- (Exception: `/api/ocr/scan` — covered in PHI-01 above)

---

### A4: PHI Storage Architecture

**Status:** STRONG — no action required

- `phi-storage.ts`: localStorage wrapper with automatic 24-hour TTL
- `clearAllPhiItems()` called on logout and session expiry
- `sweepExpiredPhiItems()` available for startup cleanup
- Server-side audio chunk storage intentionally disabled (per HIPAA-PHI-BOUNDARY.md §6.3)
- `assertPhiApprovedEndpoint()` enforced on all PHI-egress routes (except the one gap in PHI-01)

---

### A5: Existing Security Measures

**Status:** ADEQUATE — no action required

- bcrypt with 12 rounds for password hashing
- Open redirect prevention in login callback validation
- Admin routes correctly check `role === "ADMIN"`
- `.env` files excluded from git (`.gitignore` covers `.env*`)
- No .env files found in git history
- `mustChangePassword: true` on all seeded and admin-created accounts
- HIPAA audit logging on all CRUD operations (create, view, update, delete)

---

## PART 3: RECOMMENDED FIX ORDER

Priority-ordered implementation sequence. Items grouped by dependency.

### Phase 0: Immediate (today)
1. **SEC-01** — Remove `infrastructure.md` from git, rotate all passwords
2. **SEC-02** — Generate and set `AUTH_SECRET` on all servers

### Phase 1: Before expanding beta (this week)
3. **PHI-01** — Fix OCR scan route (assertPhiApprovedEndpoint + scrubError)
4. **AUTH-01** — Add ownership checks to visit/patient routes
5. **AUTH-02** — Add field allowlists to PATCH routes
6. **XSS-01** — Sanitize dangerouslySetInnerHTML
7. **API-02** — Add Cache-Control headers to remaining PHI routes
8. **CODE-01** — Scrub callClaude error messages

### Phase 2: Before production launch (with BAA signing)
9. **SEC-03** — Switch to Anthropic Console API key
10. **BAA-01** — All BAAs signed and on file
11. **API-01** — Rate limiting on login + note generation + general API
12. **API-03** — Security headers
13. **AUTH-03** — Password policy + account lockout
14. **AUTH-04** — Fix JWT mustChangePassword staleness
15. **SEC-04** — Remove seed passwords from git history

### Phase 3: Production polish
16. **BETA-01** — Disable mock mode in production
17. **UX-01** — Fix audio recorder status text
18. **LOG-01** — Failed login logging + audit log API
19. **INFRA-01** — Pin next-auth version

---

## FINAL SIGN-OFF

All items in Part 1 have been resolved:

**Engineering Lead:** _______________________ Date: ___________

**Compliance / Privacy Officer:** _______________________ Date: ___________

**Clinical Lead:** _______________________ Date: ___________

---

*This document should be stored alongside HIPAA-PHI-BOUNDARY.md and updated as items are resolved. Each sign-off should include the git commit hash of the fix.*
