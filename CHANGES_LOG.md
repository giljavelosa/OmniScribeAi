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
