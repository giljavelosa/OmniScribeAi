# OmniScribe — PHI Boundary Architecture
**Version:** 1.0  
**Date:** 2026-02-19  
**Status:** Draft — pending BAA execution and code implementation  
**Owner:** Engineering / Compliance

---

## 1. Purpose

This document defines the PHI boundary for OmniScribe. It governs:
- What constitutes PHI in this system
- Which external services are permitted to process PHI (and under what conditions)
- How PHI flows through the stack and where it must not appear
- Logging, storage, and browser handling rules
- The enforcement gate that prevents accidental PHI leakage

No production traffic involving real patient data may flow until every **HARD BLOCKER** in Section 4 is resolved.

---

## 2. PHI Classification

The following data types are classified as **PHI** under HIPAA 45 CFR §164.514 and must be treated as such throughout this system:

| Data Type | Examples | Classification |
|---|---|---|
| Clinical audio | Raw recording of patient encounter | **PHI — highest sensitivity** |
| Transcripts | Deepgram output with speaker labels | **PHI** |
| Extracted facts | Pass 1 JSON with clinical data | **PHI** |
| Clinical notes | Generated SOAP/H&P/etc. notes | **PHI** |
| Patient demographics | Name, DOB, MRN, gender | **PHI** |
| Visit metadata | Date + clinician + diagnosis together | **PHI** |
| Compliance scores | If linked to a patient | **PHI** |
| Audit log entries | If they contain patient identifiers | **PHI** |

The following are **NOT PHI** and may flow freely:

| Data Type | Examples |
|---|---|
| Framework metadata | Framework ID, section titles, item names |
| System metrics | Response times, token counts (no patient context) |
| Error codes | HTTP status codes, generic error types (no PHI content) |
| User identifiers alone | User ID, email (not linked to patient data in the same record) |
| Aggregate statistics | "X notes generated today" (no individual attribution) |

---

## 3. PHI Data Flow Map

```
┌─────────────────────────────────────────────────────────────────────┐
│  PHI ZONE — All data here is PHI or potentially PHI                 │
│                                                                     │
│  [Browser]                                                          │
│    Audio buffer (in memory only, never to disk until upload)        │
│    Recording chunks (10s, in memory → upload → discard)             │
│    Transcript (in memory → localStorage with TTL)                   │
│    Clinical note (in memory → localStorage with TTL)                │
│    Patient name (in memory → localStorage with TTL)                 │
│                                                                     │
│  [App Servers — dev/staging/prod — 134.x / 147.x / 143.x]          │
│    API route memory (request lifecycle only — never persisted here) │
│    /tmp/omniscribe-recordings/ ← MUST be encrypted or eliminated    │
│    next.log ← PHI FORBIDDEN — structured only, no content           │
│                                                                     │
│  [Data Server — 164.92.77.116]                                      │
│    PostgreSQL: visits, patients, notes, audit logs                  │
│    Must have encryption at rest (DO block volume encryption)        │
│                                                                     │
└────────────────────────┬────────────────────────────────────────────┘
                         │ PHI egress only via approved channels below
                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│  APPROVED EXTERNAL PHI PROCESSORS (BAA required before use)        │
│                                                                     │
│  ✅ Deepgram       api.deepgram.com     Audio → transcript          │
│  ✅ Anthropic      api.anthropic.com    Transcript/facts → note     │
│  ✅ DigitalOcean   (infrastructure)     PHI at rest on servers      │
│                                                                     │
│  ❌ EVERYTHING ELSE IS FORBIDDEN from receiving PHI                 │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 4. External Vendor Allow-List

This is the complete list of services permitted to receive PHI. **Any service not on this list is forbidden from receiving PHI.** Adding a new service requires BAA execution before code is written.

### 4.1 Deepgram

| Item | Status |
|---|---|
| Service | Deepgram Nova-3 Medical (api.deepgram.com) |
| PHI received | Raw clinical audio |
| BAA required | Yes — Business Associate Agreement |
| BAA status | **⛔ NOT SIGNED — HARD BLOCKER** |
| Action | Contact Deepgram sales (deepgram.com/contact) — request HIPAA BAA |
| Notes | Deepgram has an established HIPAA program; BAA is standard for enterprise accounts. Their Nova-3 Medical model is explicitly designed for clinical use. |
| Fallback if BAA unavailable | None — transcription is core to the product |

### 4.2 Anthropic

| Item | Status |
|---|---|
| Service | Claude API (api.anthropic.com) |
| PHI received | Transcripts, extracted facts, clinical notes (×6 calls per note) |
| BAA required | Yes — Anthropic Healthcare Addendum |
| BAA status | **⛔ NOT SIGNED — HARD BLOCKER** |
| Current key | Max plan (personal/consumer tier) — **explicitly NOT eligible for PHI** |
| Action | 1. Switch to Console API key (pay-per-token) immediately. 2. Apply for Anthropic Healthcare Addendum at trust.anthropic.com or via email to privacy@anthropic.com. 3. Do not process real patient data until addendum is signed. |
| Notes | Anthropic's BAA/addendum requires a qualifying business relationship. Consumer-tier (Max plan) keys must never be used for PHI regardless of BAA status. |

### 4.3 DigitalOcean

| Item | Status |
|---|---|
| Service | DigitalOcean Droplets + Block Storage (SFO3) |
| PHI stored | PostgreSQL (patients, visits, notes), audio chunk backups |
| BAA required | Yes — DigitalOcean Business Associate Agreement |
| BAA status | **⛔ NOT SIGNED — HARD BLOCKER** |
| Action | Request via DigitalOcean support portal — select "HIPAA Compliance" category. DO provides a standard BAA for covered entities using their infrastructure services. |
| Notes | All four droplets are in scope. DO's BAA covers IaaS (the servers) but does not cover any managed database services unless separately agreed. |

### 4.4 Services Explicitly FORBIDDEN from Receiving PHI

The following categories of service must never receive PHI regardless of any other configuration:

| Category | Examples | Reason |
|---|---|---|
| Log aggregators (unless PHI-safe) | Datadog, Papertrail, Logtail, Sentry | App logs must never contain PHI content |
| Analytics | Google Analytics, Mixpanel, Segment, PostHog | No PHI in analytics events |
| Error monitoring | Sentry, Bugsnag, Rollbar | Error context must be scrubbed before reporting |
| Object storage (unless encrypted + BAA) | S3, R2, GCS, DO Spaces | No raw audio/transcripts in uncontrolled storage |
| Consumer AI tools | OpenAI ChatGPT (consumer), Claude.ai, Gemini | Never — no BAA possible on consumer tiers |
| Email/SMS (unless BAA) | SendGrid, Twilio (uncontracted) | No PHI in notification content |
| CDN / caching layers | Cloudflare (without BAA) | Must not cache PHI responses |

---

## 5. Logging Policy

### 5.1 Two-Channel Rule

OmniScribe maintains **two strictly separate log channels**:

| Channel | Purpose | PHI allowed | Destination |
|---|---|---|---|
| **HIPAA Audit Log** | Who did what to what PHI, when | User ID + resource ID only (no content) | PostgreSQL `AuditLog` table |
| **App Debug Log** | Server operational events | **None** | next.log / stdout |

These two channels must never be merged. App debug logs must never contain PHI.

### 5.2 What MUST NOT appear in `console.*` / next.log

- Transcript text (any portion)
- Patient names, MRNs, or any patient identifiers
- Clinical note content
- Audio file paths that include session IDs tied to patients
- Extracted facts JSON
- Full error stack traces that may include request bodies containing PHI
- Any object that could contain PHI when serialized

### 5.3 What IS allowed in `console.*` / next.log

```
✅ "[GenNote] Starting. Framework: rehab-pt-eval, TranscriptLength: 12847"
✅ "[Transcribe] Deepgram response: 2978 words, 98.6% confidence, 94s duration"
✅ "[recordings/chunk] session rec-1234 chunk 42: 16384 bytes"
✅ "[Auth] Login success: userId=abc123"
✅ "[GenNote] Complete. Time: 87.3s, Tokens: 24819"
✅ "[GenNote] Claude overloaded, retry 1/3 in 10s"

❌ "[Transcribe] Transcript: Patient reports chest pain since Monday..."
❌ "[GenNote] Pass 1 output: { chief_complaint: { value: 'chest pain', ..."
❌ "[Error] TypeError in generate-note: ...transcript.slice(0, 200)..."
❌ "Patient: John Smith, DOB: 1965-03-14"
```

### 5.4 Error Handling PHI Scrub Rule

When catching errors in PHI-processing routes, error messages returned to the client and written to logs must be scrubbed:

```typescript
// ❌ WRONG — may echo PHI from request body in error message
catch (err) {
  console.error("Error processing:", err, requestBody);
  return Response.json({ error: String(err) }); // String(err) may include PHI
}

// ✅ CORRECT — log generic, return generic
catch (err) {
  const code = generateErrorCode(); // e.g., "ERR_GN_001"
  console.error(`[GenNote] Error ${code}:`, err instanceof Error ? err.message : typeof err);
  return Response.json({ error: "Note generation failed", code }); // no PHI
}
```

---

## 6. Storage Policy

### 6.1 Server Storage

| Location | Contains | Required controls |
|---|---|---|
| PostgreSQL (164.92.77.116) | All structured PHI | Encryption at rest (DO volume encryption), access limited to app service account, regular backups encrypted |
| `/tmp/omniscribe-recordings/` | Raw audio chunks (most sensitive PHI) | **Option A:** Encrypt each file (AES-256) before writing, decrypt in-memory for assembly. **Option B:** Eliminate — rely on in-memory chunks array only. Recommended: eliminate (Option B). |
| `next.log` | App operational logs | Must never contain PHI (see §5). Rotate daily, retain 30 days max. |
| `.env` files | API keys (not PHI) | Standard secret management — never commit, never log |

### 6.2 Browser Storage

| Location | Contains | Required controls |
|---|---|---|
| `localStorage` | Visit data (transcript, note, patient name) | **Must have TTL.** Clear on logout. Max retention: 24 hours or session end, whichever is sooner. Never sync to any external service. |
| `sessionStorage` | Not currently used | If used: same PHI rules as localStorage |
| Memory (JS heap) | Audio buffer, chunks, transcript during processing | Acceptable — cleared on tab close. No explicit action needed. |
| Browser cache | Next.js static assets only | Must not cache API responses containing PHI (`Cache-Control: no-store` on all PHI-returning routes) |
| IndexedDB | Not used | If added: treat as localStorage — TTL + clear on logout |

### 6.3 Audio Chunk Backup — Recommended Elimination

The `/tmp/omniscribe-recordings/` backup was added to prevent data loss on browser crash. However:
- Raw clinical audio in `/tmp` is high-risk PHI exposure
- The local `chunks.current` array already provides crash resilience for normal cases
- The backup is not encrypted and is not deleted on a reliable schedule

**Recommended approach:** Eliminate the server-side audio chunk backup. Instead:
1. Keep chunks in-memory (current behavior)
2. Add a client-side "Download Recording" emergency button (already implemented on error screen)
3. When a visit is finalized, the assembled audio is already processed — no need to retain it

If the backup must be kept for business reasons, it requires: AES-256 encryption of each chunk before write, deletion within 24h or on session completion (whichever is sooner), access limited to the app service account only.

---

## 7. In-Code Enforcement (to be implemented)

The following controls must be implemented in code to make the PHI boundary machine-enforced rather than convention-based:

### 7.1 PHI Egress Allow-List Constant

```typescript
// lib/phi-boundaries.ts
// This is the ONLY list of external URLs that may receive PHI.
// All outbound fetch() calls in PHI-processing routes must call
// assertPhiApprovedEndpoint() before sending.

export const PHI_APPROVED_ENDPOINTS = [
  'https://api.deepgram.com',
  'https://api.anthropic.com',
] as const;

export function assertPhiApprovedEndpoint(url: string): void {
  const approved = PHI_APPROVED_ENDPOINTS.some(e => url.startsWith(e));
  if (!approved) {
    throw new Error(
      `PHI BOUNDARY VIOLATION: Attempted to send PHI to unapproved endpoint: ${url}. ` +
      `Add a BAA and update PHI_APPROVED_ENDPOINTS before proceeding.`
    );
  }
}
```

### 7.2 PHI-Safe Logger

```typescript
// lib/logger.ts
// Use this instead of console.* in all PHI-processing routes.
// Never pass objects that may contain PHI.

type LogLevel = 'info' | 'warn' | 'error';

export function appLog(level: LogLevel, component: string, message: string, meta?: Record<string, string | number | boolean>): void {
  // meta must contain only non-PHI primitives (IDs, counts, durations)
  const entry = { ts: new Date().toISOString(), level, component, message, ...meta };
  console[level](JSON.stringify(entry));
}

// ❌ appLog('info', 'GenNote', transcript);         — WRONG: PHI in message
// ✅ appLog('info', 'GenNote', 'Pass 1 complete', { transcriptLength: transcript.length });
```

### 7.3 localStorage TTL Wrapper

```typescript
// lib/phi-storage.ts
// Wraps localStorage with automatic TTL enforcement for PHI data.

const PHI_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export function setPhiItem(key: string, value: unknown): void {
  const entry = { data: value, expiresAt: Date.now() + PHI_TTL_MS };
  localStorage.setItem(key, JSON.stringify(entry));
}

export function getPhiItem<T>(key: string): T | null {
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try {
    const entry = JSON.parse(raw);
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      localStorage.removeItem(key);
      return null;
    }
    return entry.data as T;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
}

export function clearAllPhiItems(): void {
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('omniscribe-')) keysToRemove.push(key);
  }
  keysToRemove.forEach(k => localStorage.removeItem(k));
}
```

### 7.4 Cache-Control on PHI Routes

All API routes that return PHI must include:
```typescript
headers: {
  'Cache-Control': 'no-store, no-cache, must-revalidate',
  'Pragma': 'no-cache',
}
```

---

## 8. BAA Execution Checklist (Pre-Launch Gate)

**No real patient data may be processed until ALL items below are checked.**

```
[ ] Anthropic Healthcare Addendum signed
    Contact: privacy@anthropic.com or trust.anthropic.com
    Requirement: Console API key (not Max plan) used in production

[ ] Deepgram Business Associate Agreement signed
    Contact: Deepgram sales / deepgram.com/contact
    Requirement: BAA on file before audio ingestion of real patients

[ ] DigitalOcean Business Associate Agreement signed
    Contact: DO support portal → HIPAA Compliance category
    Requirement: Covers all 4 droplets in SFO3 region

[ ] Max plan Anthropic key removed from all environments
    Replace with: Console API key (pay-per-token)

[ ] /tmp/omniscribe-recordings/ eliminated or encrypted
    Recommended: eliminate (in-memory assembly is sufficient)

[ ] localStorage PHI TTL implemented
    Requirement: PHI cleared within 24h or on logout

[ ] PHI egress allow-list implemented in code
    assertPhiApprovedEndpoint() called before all external PHI-bearing requests

[ ] PHI-safe logger implemented
    console.* replaced with appLog() in all PHI-processing routes
    Verified: no transcript/note content in next.log

[ ] Cache-Control: no-store on all PHI-returning API routes

[ ] Error responses scrubbed
    No PHI in error messages returned to client or written to logs

[ ] PostgreSQL encryption at rest confirmed
    DigitalOcean block volume encryption enabled on data droplet

[ ] Privacy Policy published (patient-facing)

[ ] Internal HIPAA training completed (minimum: Security Rule + Privacy Rule basics)
```

---

## 9. Ongoing Controls (Post-Launch)

| Control | Frequency | Owner |
|---|---|---|
| Review next.log for PHI leakage | Weekly | Engineering |
| Rotate API keys | Every 90 days | Engineering |
| Review AuditLog for anomalies | Monthly | Compliance |
| Re-verify vendor BAA coverage on any new integration | Before each integration | Engineering + Compliance |
| Penetration test / security review | Annually | External party |
| HIPAA Risk Assessment update | Annually or after major architecture change | Compliance |

---

## 10. Implementation Priority Order

When we move to code, implement in this order:

1. **Switch Anthropic key** — Max plan → Console API key (30 min, must be first)
2. **PHI egress allow-list** (`lib/phi-boundaries.ts` + assert in routes)
3. **PHI-safe logger** (`lib/logger.ts` + replace `console.*` in PHI routes)
4. **Error response scrubbing** (all catch blocks in PHI-processing routes)
5. **Cache-Control headers** (all PHI-returning API routes)
6. **localStorage TTL** (`lib/phi-storage.ts` + replace direct localStorage calls)
7. **localStorage clear on logout** (signOut hook)
8. **Eliminate /tmp audio chunk backup** (remove from recordings/chunk route)
9. **BAA execution** (Anthropic, Deepgram, DigitalOcean — runs in parallel with code work)

---

*This document must be updated whenever a new external service is added to the stack, the data model changes to include new PHI types, or BAA status changes for any vendor.*
