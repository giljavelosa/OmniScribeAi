# OmniScribe AI — Development Rules

## Project Context
- HIPAA healthcare app: Next.js 16, Prisma, PostgreSQL, Groq Whisper, TypeScript strict
- Location: `/Users/giljrjavelosa/omniscribeai/`
- App directory: `app/`

## Absolute Rules

### PHI Safety
- NEVER log PHI to console — use `appLog()` from `lib/logger.ts` with safe metadata only
- NEVER store PHI as plaintext in database — use field-level encryption for PII
- NEVER swallow errors silently — always surface failures to the caller
- MUST use `scrubError()` not `console.error` for error handling in components and routes

### Input Safety
- MUST escape all user input before rendering in HTML
- MUST validate/sanitize all data interpolated into LLM prompts (framework names, section titles, etc.)
- MUST validate file uploads (size, type, magic bytes) before processing
- MUST enforce pagination bounds on all list endpoints (max 100)

### Security
- MUST have rate limiting on all API routes
- MUST have CSRF protection on state-changing endpoints
- MUST use consistent error response shape: `{ success: boolean, error?: string, code?: string }`
- MUST set security headers (CSP, X-Frame-Options, HSTS, X-Content-Type-Options)

### Process
- NEVER modify `prisma/migrations/` or `.env` without explicit user permission
- Before ANY code change: read `CHANGES_LOG.md`, check for conflicts, list dependent files
- After ANY code change: run `npm run build` + `npm run test`, update `CHANGES_LOG.md`, git commit
- Keep fixes minimal — don't refactor unrelated code

### Compaction Recovery Rule
- If you feel like you've lost context, if you're unsure what has already been done, or if the conversation just compacted: **STOP IMMEDIATELY**
- Read `CHANGES_LOG.md` from top to bottom
- Find the last entry marked ✅ (RESOLVED). The next FIX number after that is where you resume
- Do NOT re-do any fix that is already logged as RESOLVED
- Do NOT modify any file without first checking the log for previous changes to that file
- This rule overrides everything else
- When compacting, always preserve: the current FIX number being worked on, the full list of files modified this session, and any test failures encountered
- `CHANGES_LOG.md` is the SOURCE OF TRUTH — NOT your memory. If memory disagrees with this file, **THIS FILE WINS**
