# OmniScribe — Development Log

> AI-powered clinical documentation platform with evidence-based frameworks  
> Live: https://134.199.221.192 | Repo: github.com/giljavelosa/OmniScribeAi

---

## Changelog

### 2026-02-17
- **Added:** Editable Clinical Synthesis panel (`ClinicalSynthesis.tsx`) — clinicians can edit AI reasoning and regenerate notes
- **Added:** `/api/regenerate-note` endpoint — Pass 4-only regeneration (saves ~80% API cost vs full pipeline)
- **Added:** Emergency/Urgent Care note type (`med-ed`) — 63 items, 8 sections, 30 CMS compliance rules
- **Fixed:** All 19 `itemCount` values corrected to match actual items
- **Fixed:** Added CMS compliance rules for 10 frameworks that were missing them (all 19 now covered)
- **Fixed:** Orphan CMS reference — "MCID Achieved" → full item name match

### 2026-02-12 — 2026-02-16 (MVP Build)
- **Built:** Next.js 16 app with Tailwind + Radix UI
- **Built:** 6-pass note generation pipeline (fact extraction → synthesis → parsed data → clinical note → hallucination audit → summary)
- **Built:** Deepgram Nova-3 Medical transcription with speaker diarization
- **Built:** Document OCR scanning with auto-merge into notes
- **Built:** Mini-recorder for follow-up dictation (iterative refinement)
- **Built:** CMS compliance scoring engine
- **Built:** NoteEditor with section-level feedback, copy, and inline editing
- **Built:** Framework selector with domain grouping
- **Built:** Dashboard, Visit Detail, Frameworks pages
- **Deployed:** 4 DigitalOcean droplets (dev/staging/prod/data) — $96/mo
- **Tested:** End-to-end pipeline with real PT session audio (123MB WAV → 2978 words → full note)
- **Fixed:** Deepgram keywords→keyterm bug causing mock data fallback (root cause of hallucination)
- **Fixed:** Nginx client_max_body_size 200m for large audio uploads

---

## Architecture

### Tech Stack
- **Frontend:** Next.js 16, React 19, Tailwind CSS 4, Radix UI
- **Transcription:** Deepgram Nova-3 Medical (real-time, speaker diarization)
- **AI Pipeline:** Claude Sonnet 4 (6-pass anti-hallucination pipeline)
- **OCR:** Claude Sonnet 4 (document scanning + framework mapping)
- **Hosting:** DigitalOcean (4 droplets, SFO3, Ubuntu 24.04)
- **Proxy:** Nginx with SSL, streaming proxy, 200MB upload limit

### 6-Pass Pipeline
1. **Fact Extraction** — Structured JSON from transcript (only documented facts)
2. **Clinical Synthesis** — AI clinical reasoning from facts (editable by clinician)
3. **Parsed Data** — Formatted data display with blanks for undocumented items
4. **Clinical Note** — Final chart-ready note merging data + reasoning
5. **Hallucination Audit** — Flags any data not traceable to transcript
6. **Summary** — 2-3 sentence visit summary

### API Routes
| Route | Purpose |
|---|---|
| `/api/transcribe` | Audio → transcript (Deepgram Nova-3 Medical) |
| `/api/generate-note` | Full 6-pass pipeline (SSE streaming) |
| `/api/regenerate-note` | Pass 4 only — regenerate from edited synthesis |
| `/api/ocr` | Document scan → structured data → auto-merge |

---

## Frameworks (19 total)

### Medical (7)
| ID | Name | Items | CMS Rules |
|---|---|---|---|
| `med-soap-followup` | SOAP — Follow-Up Visit | 19 | ✅ |
| `med-soap-new` | SOAP — New Patient | 29 | ✅ |
| `med-hp` | H&P — Full History & Physical | 50 | ✅ |
| `med-procedure` | Procedure Note | 18 | ✅ |
| `med-awv` | Annual Wellness Visit (AWV) | 23 | ✅ |
| `med-ed` | Emergency / Urgent Care Note | 63 | ✅ |
| `med-discharge` | Medical Discharge Summary | 45 | ✅ |

### Rehabilitation (6)
| ID | Name | Items | CMS Rules |
|---|---|---|---|
| `rehab-pt-eval` | PT Initial Evaluation | 48 | ✅ |
| `rehab-pt-daily` | PT Daily/Progress Note | 19 | ✅ |
| `rehab-ot-eval` | OT Initial Evaluation | 32 | ✅ |
| `rehab-slp-eval` | SLP Initial Evaluation | 38 | ✅ |
| `rehab-progress` | Rehabilitation Progress Report | 22 | ✅ |
| `rehab-discharge` | Rehabilitation Discharge Summary | 68 | ✅ |

### Behavioral Health (6)
| ID | Name | Items | CMS Rules |
|---|---|---|---|
| `bh-intake` | Biopsychosocial Intake Assessment | 68 | ✅ |
| `bh-progress` | Therapy Progress Note | 19 | ✅ |
| `bh-psych-eval` | Psychiatric Diagnostic Evaluation | 44 | ✅ |
| `bh-group` | Group Therapy Note | 18 | ✅ |
| `bh-crisis` | Crisis Intervention Note | 36 | ✅ |
| `bh-discharge` | BH Discharge/Termination Summary | 49 | ✅ |

**Total: 708 items across 19 frameworks, all with CMS compliance scoring**

---

## Infrastructure

| Server | IP | Role |
|---|---|---|
| omniscribe-dev | 134.199.221.192 | Development / live demo |
| omniscribe-staging | 147.182.243.166 | Staging |
| omniscribe-prod | 143.198.131.243 | Production |
| omniscribe-data | 164.92.77.116 | Database + AI pipeline |

---

## TODO — Priority Order

### 🔴 Critical (Before Launch)
- [ ] **User authentication** — multi-user login (NextAuth or Clerk)
- [ ] **Database** — move from localStorage to PostgreSQL (patient records, visits, notes)
- [ ] **HIPAA compliance** — encryption at rest, audit logging, BAA with providers
- [ ] **Mobile responsive** — test and polish all pages on mobile/tablet

### 🟡 High Priority
- [ ] **Audit: Transcription pipeline** — edge cases (short audio, silence, multiple languages)
- [ ] **Audit: Note generation pipeline** — verify all 19 frameworks produce correct output
- [ ] **Audit: Frontend components** — test NoteEditor, ClinicalSynthesis, FrameworkSelector edge cases
- [ ] **Audit: Mock data** — ensure mock notes match current framework structure
- [ ] **Patient management** — patient list, visit history, search
- [ ] **Export** — PDF export, EMR-compatible formats (HL7 FHIR, CDA)
- [ ] **Billing/subscription** — Stripe integration ($29-89/mo tiers)

### 🟢 Nice to Have
- [ ] **Additional note types** — Consultation, Telehealth, Pre-Op, CCM, Referral
- [ ] **Clinical synthesis improvements** — fact-to-reasoning traceability links
- [ ] **Compliance scoring v2** — EMR-provided field detection, weighted scoring
- [ ] **Voice commands** — "add to assessment", "change diagnosis to..."
- [ ] **Multi-language** — Spanish transcript support
- [ ] **Analytics dashboard** — documentation quality trends, compliance over time
- [ ] **Template customization** — clinician-specific section preferences

### ✅ Completed
- [x] Research: Competitor analysis, UX testing, clinician workflows
- [x] Research: Strategic roadmap (12 steps, 18 months)
- [x] Research: 3 provisional patent drafts
- [x] Research: Prior art search
- [x] Build: Core app (Next.js + Deepgram + Claude pipeline)
- [x] Build: All 19 framework definitions with items
- [x] Build: CMS compliance scoring for all 19 frameworks
- [x] Build: Document OCR scanning + auto-merge
- [x] Build: Follow-up dictation (mini-recorder)
- [x] Build: Editable clinical synthesis with regeneration
- [x] Build: Emergency/Urgent Care note type
- [x] Fix: All itemCount mismatches
- [x] Fix: Missing CMS rules (10 frameworks)
- [x] Fix: Hallucination from Deepgram keyword bug
- [x] Deploy: 4 DO droplets, Nginx SSL, GitHub repo

---

## QA Audit Status

| Component | Status | Notes |
|---|---|---|
| `frameworks.ts` | ✅ Audited | All 19 frameworks, itemCounts verified |
| `cms-requirements.ts` | ✅ Audited | All 19 frameworks have rules, no orphan refs |
| `types.ts` | ✅ Clean | No issues |
| `/api/transcribe` | ✅ Audited | Keyterms expanded for all 3 domains | |
| `/api/generate-note` | ✅ Audited | clinicianType fixed for all note types | |
| `/api/regenerate-note` | ✅ Audited | Clean | |
| `/api/ocr` | ⬜ Not audited | |
| `NoteEditor.tsx` | ⬜ Not audited | |
| `ClinicalSynthesis.tsx` | ✅ Audited | Clean | |
| `AudioRecorder.tsx` | ✅ Audited | Clean, good error handling | |
| `MiniRecorder.tsx` | ⬜ Not audited | |
| `FrameworkSelector.tsx` | ✅ Audited | Clean, uses dynamic data | |
| Visit Detail page | ⬜ Not audited | |
| New Visit page | ⬜ Not audited | |
| Dashboard page | ✅ Audited | Hardcoded name removed | |
| Landing page | ✅ Audited | Stats corrected (19/708) | |
| Mock data | 🟡 Partial | Only 3/19 frameworks have mocks (low priority) | |

---

*Last updated: 2026-02-17*
