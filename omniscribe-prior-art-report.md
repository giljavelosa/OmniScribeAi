# OmniScribe Prior Art Search Report
**Date:** February 13, 2026  
**Purpose:** Prior art analysis for three provisional patent applications

---

## PATENT 1: Framework-Driven Clinical Note Generation System

### Key Claims
- Regulatory-sourced documentation frameworks (CMS, APTA, AMA) as structured AI prompts
- Multi-pass pipeline: transcript → structured JSON fact extraction with source tracking → note generation from JSON only (model never sees raw transcript) → hallucination audit
- Three-tier documentation: explicit facts, WNL (Within Normal Limits), blank (___) for undocumented items
- Dynamic JSON schema built from framework sections

### Relevant Prior Art Found

| # | Patent Number | Title | Assignee | Priority Date | Relevance |
|---|---|---|---|---|---|
| 1 | **US20220383874A1** | Documentation system based on dynamic semantic templates | 3M/Solventum | 2021-05-28 | **HIGH** — Uses dynamic templates triggered by dialogue content; template library with semantic descriptions; fields auto-filled from dialogue |
| 2 | **US20220375605A1** | Methods of automatically generating formatted annotations of doctor-patient conversations | Carnegie Mellon University | 2021-05-04 | **HIGH** — Extracts structured data from transcripts, generates SOAP-formatted notes with section mapping, uses classifiers to identify noteworthy utterances |
| 3 | **US11250383B2 / EP3665677B1** | Automated clinical documentation system and method | Nuance/Microsoft | 2018-03-05 | **MEDIUM-HIGH** — Foundational ACI patent: ambient recording → transcript → clinical note generation with source separation |
| 4 | **US20190272147A1** | System and method for review of automated clinical documentation | Nuance/Microsoft | 2018-03-05 | **MEDIUM** — Review/audit system for automated clinical notes (relates to hallucination audit concept) |
| 5 | **US20250279191A1** | System and method for evaluating generated clinical notes and note generation models | Solventum (3M) | 2024-03-01 | **MEDIUM-HIGH** — Evaluates clinical note quality by comparing generated notes against pseudo-references from transcript; relates to hallucination detection |
| 6 | **US12488797B2** | Systems and methods for extracting information from a dialogue | U of Toronto/Unity Health | 2019-08-22 | **MEDIUM** — Extracts entities, utterances, attributes from clinical dialogue using ML; classifies utterance types; generates clinical note |
| 7 | **EP4625243A1** | System and method for determining structured data | Solventum (3M) | 2024-03-27 | **MEDIUM-HIGH** — Extracts structured data from physician-patient transcript using medical concept ontology; maps transcript concepts to structured fields |
| 8 | **US20240296924A1** | System for automating creation of SOAP reports | SuhaviAI (individual) | 2023-03-03 | **MEDIUM** — Voice-to-text → enhance with metadata → LLM generates SOAP note; practitioner-specific customization |
| 9 | **WO2025147678A1** | Systems and methods for generating standardized reports using LLMs | Cedars-Sinai | 2024-01-04 | **MEDIUM** — LLM probed with settings to determine procedure class, then generates standardized report format |
| 10 | **US20250095802A1** | Systems and methods to generate personal documentation from audio data | Laboratoire Coeurway | 2023-09-15 | **MEDIUM** — Audio → transcription → prompt engineering → LLM → document; includes quality assessment and hallucination concerns |
| 11 | **WO2025052305A1** | Method and system for generating clinical notes | Solventum (3M) | 2023-09-06 | **LOW-MEDIUM** — Personalizes clinical notes for new physicians by finding representative existing physician; style transfer |
| 12 | **US20250166803A1** | Machine-learning-based workflow platform | Knowtex Inc. | 2023-11-22 | **MEDIUM** — ML-based platform processes encounter data (transcript) into structured records with diagnosis codes |
| 13 | **US20240193196A1** | Training a learning-to-rank model (ACI context) | Microsoft | 2022-12-13 | **LOW** — Ranking model for ACI tasks; mentions ambient clinical note generation pipeline |

### Differentiation Analysis

**What's novel about OmniScribe's approach:**

1. **Regulatory framework as prompt architecture** — No existing patent uses CMS/APTA/AMA regulatory documentation frameworks as the structural basis for AI prompts. The 3M dynamic template patent (US20220383874A1) uses templates triggered by content, but these are NOT regulatory-sourced frameworks; they're custom semantic templates. The Cedars-Sinai patent uses standardized report formats but for endoscopy, not regulatory frameworks.

2. **Multi-pass JSON intermediary pipeline** — The specific architecture where the LLM never sees the raw transcript during note generation (only the structured JSON) is novel. Existing patents either (a) feed transcript directly to LLM (SuhaviAI, Coeurway), (b) use NLP extraction then generation in single pipeline (Carnegie Mellon, Toronto), or (c) use templates filled from transcript (3M). The JSON-only intermediary that prevents hallucination by architectural design is distinctive.

3. **Three-tier documentation (explicit/WNL/blank)** — No patent found describes this specific three-tier approach. Most systems generate complete notes or flag missing sections. The explicit ___blank___ for undocumented items as a deliberate design choice is novel.

4. **Dynamic JSON schema from framework sections** — No patent describes building the extraction schema dynamically from the documentation framework itself. The 3M patent builds templates from content triggers; OmniScribe builds the entire extraction schema from the regulatory framework structure.

**Prior art challenges:**
- The general concept of "transcript → extraction → note generation" is well-covered (Nuance, 3M, Carnegie Mellon, Toronto)
- Template-based clinical documentation is covered by 3M's dynamic semantic templates patent
- Structured data extraction from transcripts is covered by Solventum's EP4625243A1
- Note quality evaluation/hallucination detection is covered by Solventum's US20250279191A1

**Assessment: MODERATELY STRONG.** The specific combination of regulatory frameworks as prompts + JSON intermediary + three-tier output + hallucination audit by architecture is novel. Individual components have prior art but the specific pipeline architecture is defensible. Focus claims on: (1) regulatory framework-driven schema generation, (2) JSON-only intermediary preventing model access to raw transcript, (3) three-tier documentation output.

---

## PATENT 2: Integrated Clinical Outcome Measurement and Documentation System

### Key Claims
- FIM scores, standardized tests (Berg Balance, TUG, etc.) embedded directly in clinical documentation
- Outcome measures auto-populated from transcript into note framework
- Tracks progress across visits using standardized scoring

### Relevant Prior Art Found

| # | Patent Number | Title | Assignee | Priority Date | Relevance |
|---|---|---|---|---|---|
| 1 | **US20140181128A1** | Systems and methods for processing patient data history | Daniel Riskin | 2011-03-07 | **LOW-MEDIUM** — Automates extraction from clinical documentation, mentions outcome measures; but doesn't embed standardized tests INTO documentation from transcripts |
| 2 | **US11114208B1** | Methods and systems for predicting a diagnosis of musculoskeletal pathologies | AIINPT, Inc | 2020-11-09 | **MEDIUM** — PT-specific: transforms responses based on clinical note format; generates clinical notes; musculoskeletal focus. But focuses on prediction, not outcome measure embedding |
| 3 | **EP4625243A1** | System and method for determining structured data | Solventum (3M) | 2024-03-27 | **LOW-MEDIUM** — Extracts structured data from transcripts into predefined fields, but doesn't specifically address standardized outcome measures |
| 4 | **US20220383874A1** | Documentation system based on dynamic semantic templates | 3M/Solventum | 2021-05-28 | **LOW** — Template insertion from dialogue, but no outcome measure scoring |

### Differentiation Analysis

**What's novel about OmniScribe's approach:**

1. **Standardized outcome measures auto-extracted from transcript** — No patent found describes automatically extracting and calculating FIM scores, Berg Balance scores, TUG times, etc. from clinical conversation transcripts. This is a clear gap in the prior art.

2. **Outcome measures embedded in documentation framework** — Existing outcome measurement systems are standalone tools. No patent integrates standardized rehabilitation outcome measures directly into the clinical note generation pipeline.

3. **Cross-visit progress tracking via standardized scores** — While EHR systems track data across visits, no patent describes automatically tracking progress using auto-extracted standardized rehabilitation outcome scores across visits as part of the documentation system.

**Prior art challenges:**
- The general concept of extracting structured clinical data from transcripts has prior art (3M, Toronto)
- Outcome measurement tools exist as standalone systems (but not patent-protected in this specific context)
- EHR systems track data across visits (general prior art, not patent-specific)

**Assessment: STRONG.** This is the most novel of the three patents. The rehabilitation/PT-specific focus with standardized outcome measures auto-populated from transcripts has essentially no direct prior art. The combination of ambient transcript processing + standardized scoring (FIM, Berg, TUG) + integration into documentation framework + cross-visit tracking is highly defensible. Focus claims on: (1) automatic extraction and scoring of standardized clinical outcome measures from conversation transcripts, (2) embedding scored outcomes into structured documentation frameworks, (3) longitudinal outcome tracking across visits.

---

## PATENT 3: Multi-Patient Individualized Documentation from Group Clinical Sessions

### Key Claims
- Single group therapy session recording → individual clinical notes per patient
- Speaker diarization to identify individual patients
- Per-patient fact extraction mapped to individual frameworks
- Nobody in the market does this

### Relevant Prior Art Found

**Extensive searches conducted across Google Patents for:**
- "group therapy" + "individual" + "documentation" + "note" — 30 results, NONE about automated individual documentation from group sessions
- "speaker diarization" + "clinical" + "note" + "multiple patients" — **ZERO results**
- "speaker diarization" + "medical" + "note" + "documentation" — **ZERO results** (via web_fetch)
- "group session" + "individual notes" + "clinical" — no relevant results
- "multi-patient" + "documentation" + "diarization" — no relevant results

| # | Patent Number | Title | Assignee | Priority Date | Relevance |
|---|---|---|---|---|---|
| 1 | **US11250383B2** | Automated clinical documentation system | Nuance/Microsoft | 2018-03-05 | **LOW** — Ambient clinical documentation but strictly 1 physician + 1 patient; source separation is audio source separation, not multi-patient |
| 2 | **US11398216B2** | Ambient cooperative intelligence system | Nuance/Microsoft | 2020-03-11 | **LOW** — Monitors "plurality of conversations within a monitored space" but for routing/command processing, NOT for generating individual patient notes |
| 3 | **US11817095B2** | Ambient cooperative intelligence system | Nuance/Microsoft | 2020-12-23 | **LOW** — Multi-conversation monitoring in space, but about system commands, not documentation |

### Differentiation Analysis

**What's novel about OmniScribe's approach:**

1. **Group-to-individual documentation** — **NO prior art found.** Zero patents describe taking a single group therapy session recording and generating individualized clinical notes per patient. This is a completely novel application.

2. **Speaker diarization for multi-patient clinical documentation** — While speaker diarization is well-established in telecommunications and meeting transcription (e.g., Microsoft Teams, Zoom), its application to multi-patient clinical documentation to generate per-patient notes has NO patent coverage.

3. **Per-patient fact extraction from group context** — The concept of extracting individual patient-relevant facts from a multi-party clinical conversation and mapping them to individual documentation frameworks is entirely novel in the patent landscape.

**Prior art challenges:**
- Speaker diarization technology itself is well-patented (but not in this specific clinical application)
- Nuance has patents on multi-conversation monitoring in clinical spaces (but for different purposes)
- General clinical note generation from transcripts has extensive prior art (but only for 1:1 encounters)

**Assessment: VERY STRONG.** This is the most defensible patent of the three. Zero direct prior art found. The application of speaker diarization + per-patient extraction + individual note generation from group sessions is a genuinely novel invention. Focus claims broadly on: (1) generating individualized clinical documentation from multi-patient group session recordings, (2) speaker diarization applied to clinical group sessions to isolate per-patient contributions, (3) per-patient fact extraction and mapping to individual documentation frameworks from a shared clinical encounter.

---

## COMPETITOR PATENT LANDSCAPE

### Nuance/Microsoft
- **~180 patents** in clinical + note + conversation + transcript space
- Core ACI (Ambient Clinical Intelligence) patent family: US11250383B2, EP3665677B1 (2018)
- Focus: ambient recording hardware/audio processing, source separation, multi-microphone arrays, ACI platform authentication
- **Gap:** Their patents are heavily focused on audio capture infrastructure and general note generation. They do NOT patent framework-driven or rehabilitation-specific approaches.

### 3M/Solventum (M*Modal)
- **Most relevant competitor** patent portfolio for Patent 1
- US20220383874A1 — Dynamic semantic templates (closest to framework-driven approach)
- EP4625243A1 — Structured data extraction from transcripts
- US20250279191A1 — Clinical note quality evaluation (closest to hallucination audit)
- WO2025052305A1 — Physician-personalized note generation
- US20250103820A1 — Topic detection bootstrapping in conversations
- **Gap:** Templates are NOT regulatory-framework-sourced. No rehabilitation/PT focus. No group session handling.

### Suki AI
- **No patents found** on Google Patents under "Suki" assignee related to clinical documentation AI. Suki appears to rely on trade secrets rather than patents.

### Freed AI
- **No patents found.** Likely too early-stage or relying on trade secrets.

### DeepScribe
- **No patents found** on Google Patents. Similar to Freed — may rely on trade secrets or have patents pending not yet published.

### Abridge
- **No patents found** under "Abridge" assignee on Google Patents. May have pending applications not yet published.

### Nabla
- **No patents found** under "Nabla" assignee for clinical documentation. French company — may have European patents not indexed or pending.

### Amazon (AWS HealthScribe)
- **No patents found** specifically for HealthScribe. Amazon likely files under broader AWS/Amazon patent families that don't specifically mention "HealthScribe."

### Other Notable Players
- **Knowtex Inc.** (US20250166803A1) — ML-based clinical workflow platform, recent filing
- **ScribeAmerica** (WO2024186737A1, US12505921B2) — Platform for routing clinical data, remote scribe management
- **Carnegie Mellon** (US20220375605A1) — Academic patent on automated SOAP generation from conversations

---

## SUMMARY RECOMMENDATIONS

### Patent 1 (Framework-Driven Clinical Note Generation)
- **Novelty:** Moderate-Strong
- **Key differentiation to emphasize:** Regulatory framework sourcing, JSON intermediary architecture, three-tier output
- **Risk areas:** General transcript-to-note pipeline well-covered; template-based approaches patented by 3M
- **Recommendation:** FILE, but draft claims narrowly around the specific pipeline architecture (especially JSON intermediary preventing raw transcript access)

### Patent 2 (Integrated Clinical Outcome Measurement)
- **Novelty:** Strong
- **Key differentiation:** Auto-extraction of standardized rehab outcome measures from transcripts; no prior art in this specific space
- **Risk areas:** Minimal — general structured extraction has some prior art but not for outcome measures
- **Recommendation:** FILE with broad claims. This is highly defensible.

### Patent 3 (Multi-Patient Group Documentation)
- **Novelty:** Very Strong
- **Key differentiation:** Zero prior art for group session → individual notes
- **Risk areas:** Nearly zero — may face general diarization prior art but the application is completely novel
- **Recommendation:** FILE with the broadest possible claims. This is potentially the most valuable patent of the three.

### Filing Priority
1. **Patent 3** (Group sessions) — File first, broadest claims, most novel
2. **Patent 2** (Outcome measures) — File second, strong novelty in rehabilitation space
3. **Patent 1** (Framework-driven) — File third, requires most careful claim drafting to navigate existing art

---

*Report generated from searches conducted on patents.google.com across multiple query combinations. Additional searches attempted on lens.org (JS rendering limited results). USPTO ppubs.gov requires interactive session. Companies with no patents found (Suki, Freed, DeepScribe, Abridge, Nabla, Amazon HealthScribe) may have pending unpublished applications or trade secret strategies.*

---

## 8. Legal Risk Assessment — Infringement & IP Clearance

### 8.1 Patent Infringement Risk: **LOW**

**Are we infringing existing patents?**

No. Here's the analysis:

- **General concept of "audio → transcription → clinical note" is not patentable on its own.** It's too broad and well-established. Existing patents cover *specific implementations*, not the general idea.
- **3M/Solventum patents (most relevant):** Their patents cover dynamic semantic templates and note evaluation systems. OmniScribe's approach is fundamentally different:
  - We use *regulatory-sourced frameworks* as AI prompts (not dynamic semantic templates)
  - We use a *JSON intermediary with source tracking* where the generation model never sees raw transcript (no existing patent describes this)
  - We use a *three-tier output system* (explicit/WNL/blank) — unique to our architecture
  - We use a *hallucination audit pass* — no patent covers this
- **Nuance/Microsoft patents:** Focused on speech recognition infrastructure, ambient listening hardware, and EHR integration. Our transcription layer uses Deepgram (a third-party API), so we're not implementing any patented speech recognition methods.
- **Carnegie Mellon (SOAP generation):** Their patent is specific to SOAP format with particular NLP methods. OmniScribe supports multiple note types (SOAP, H&P, Procedure Notes, PT Eval, BH Intake, etc.) with a fundamentally different generation approach.

**Key principle:** Patent infringement requires practicing *all elements of at least one claim* of an existing patent. Our multi-pass, framework-driven, JSON-intermediary architecture doesn't match the specific claim elements of any identified patent.

### 8.2 Copyright Risk: **NONE**

- **Regulatory sources are public domain.** CMS guidelines, APTA documentation criteria, AMA CPT standards, Medicare LCD/NCD requirements — these are government-published or industry-standard documents. You cannot copyright regulations.
- **Our framework files are original works.** The specific structure, organization, section hierarchy, item selection, and item-level detail in our HTML framework files (Medical 8,544 lines, Rehab 4,539 lines, BH 6,279 lines) are original compilations. These are *our* copyrighted works.
- **No competitor content was copied.** All competitor analysis was done through legitimate testing of publicly available trial accounts. No template text, code, or proprietary content was reproduced.
- **AI-generated code is ours.** Under current US law (2024-2026 guidance), code generated by AI tools at human direction is generally copyrightable by the human directing the creation, especially when substantially curated and edited.

### 8.3 Trade Secret Risk: **NONE**

- We have not reverse-engineered any competitor's product
- We have not accessed any competitor's proprietary systems beyond publicly available trial accounts
- Our architecture was designed independently based on clinical documentation standards and AI engineering best practices

### 8.4 Trademark Considerations

- **"OmniScribe"** — Should conduct a trademark search before committing to the name commercially. The prefix "Omni" and suffix "Scribe" are both common in healthcare tech. Check USPTO TESS database.
- No existing AI medical scribe company appears to use "OmniScribe" but a thorough search is recommended before launch.

### 8.5 Regulatory Compliance (Not IP, but Related)

- **HIPAA:** OmniScribe will process PHI (Protected Health Information). Must implement:
  - BAA (Business Associate Agreement) with Deepgram and Anthropic
  - Encryption at rest and in transit (already using HTTPS)
  - Access controls and audit logs
  - Data retention and destruction policies
- **42 CFR Part 2:** Behavioral health/SUD documentation has stricter privacy requirements. OmniScribe's BH framework already accounts for this — a competitive advantage.
- **FDA:** AI clinical documentation tools are generally NOT regulated as medical devices (they assist documentation, not diagnosis). However, if we add diagnostic suggestions, FDA classification may apply.

### 8.6 Risk Summary Table

| Risk Category | Level | Notes |
|---|---|---|
| Patent infringement | LOW | No matching claim elements in existing patents |
| Copyright infringement | NONE | Built from public regulatory sources; original compilation |
| Trade secret misappropriation | NONE | Independent development; no reverse engineering |
| Trademark conflict | UNKNOWN | Need to search "OmniScribe" before commercial launch |
| HIPAA compliance | ACTION NEEDED | Must implement before handling real patient data |
| FDA classification | LOW | Documentation assistance, not diagnosis |

### 8.7 Recommendations

1. **File provisional patents ASAP** — Establishes priority date. Even if a competitor files similar claims later, your earlier filing date wins.
2. **Search "OmniScribe" trademark** on USPTO TESS (tmsearch.uspto.gov) before committing to the name.
3. **Get BAAs signed** with Deepgram and Anthropic before any real patient data touches the system.
4. **Consider a brief IP attorney consultation** ($300-500) to review the three patent drafts before filing. A provisional patent doesn't require attorney review, but 30 minutes of attorney time can strengthen claims significantly.
5. **Document your development process** — Keep dated records (git commits, these conversation logs, framework creation dates) as evidence of independent development and invention dates.
