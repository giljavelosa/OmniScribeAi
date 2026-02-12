# OmniScribe Strategic Roadmap: Competing at 110%

**Date:** February 12, 2026  
**For:** Gil (Founder/Owner)  
**Purpose:** Complete battle plan to not just compete with Freed, Twofold, and HealOS — but to surpass them in quality, meaningful use, and affordability.

---

## The Honest Assessment

Right now, OmniScribe has something none of the three competitors have: **deep, evidence-based, regulatory-sourced documentation frameworks**. That's real. But it's also just HTML files. You don't have a product yet. Freed has 25,000+ users. Twofold has 75+ templates. HealOS has 6 AI agents. You have frameworks that are better than all of theirs — but no one can use them yet.

That's not a problem. That's a starting position. Here's how to go from frameworks to market leader.

---

## THE 12 STEPS

### STEP 1: Audio Capture + Real-Time Transcription
**Why it's first:** This is table stakes. Every competitor has it. Without it, you don't have a product — you have a documentation reference.

**What to build:**
- Browser-based audio recording (WebRTC/MediaRecorder API)
- Real-time speech-to-text via Whisper API, Deepgram, or AssemblyAI
- Speaker diarization (clinician vs. patient)
- Support for in-person (device mic) and telehealth (system audio capture)
- Mobile-responsive recording UI
- Session resume capability (Freed has this, others don't)

**Implementation:**
- Frontend: React/Next.js web app with MediaRecorder API for audio capture
- Transcription: Start with Deepgram Nova-2 ($0.0043/min, best accuracy/cost ratio) or AssemblyAI Universal-2. Both offer real-time streaming + speaker diarization
- Backend: Node.js or Python FastAPI. WebSocket for real-time transcript streaming to the browser
- Storage: Audio temporarily held in memory during transcription, then deleted (match Freed's privacy stance — "recordings never stored")
- Fallback: Upload pre-recorded audio or dictate a summary (Twofold offers 3 input methods — match this)

**Cost:** Deepgram at $0.0043/min × 15 min avg encounter = ~$0.065/encounter. At 30 encounters/day = ~$2/clinician/day = ~$40/mo in transcription costs per user

**Timeline:** 4-6 weeks for MVP  
**Competes with:** All three (table stakes)  
**Surpasses them by:** Speaker diarization quality + multi-language from day one

---

### STEP 2: Web Application with Framework-Driven Note Generation
**Why it's second:** You need a product interface, not just HTML documentation files.

**What to build:**
- Clean, modern web app (steal Freed's whitespace + Twofold's simplicity)
- Provider profile setup: credential type (MD/DO/PA-C/NP/PT/OT/SLP/LCSW/etc.), specialty, preferred frameworks
- Framework selector (not just "template" — language matters): Medical → SOAP/H&P/Procedure Note → Subtype
- AI note generation: Transcript + selected framework → structured clinical note
- Inline editing (contenteditable like Freed, NOT textareas like Twofold)
- Section-level copy + copy-all
- Visit summary auto-generated at top of every note
- AI chat sidebar for conversational editing ("make the assessment more detailed")

**Implementation:**
- Frontend: Next.js 14+ (App Router), Tailwind CSS, Radix UI components
- Auth: Clerk or Auth0 (HIPAA-ready, handles BAA)
- Database: PostgreSQL (Supabase or Neon) for user data, notes, patient records
- AI Engine: Claude API or GPT-4o for note generation from transcript + framework
- The framework HTML files you already built become the **structured prompts** — each framework's items, sections, and regulatory sources feed into the AI's system prompt, ensuring the generated note covers every required element
- Architecture: Framework → System Prompt Template → Transcript Input → Structured Note Output
- Real-time: Use streaming responses so the note builds section-by-section as the clinician watches

**Key UX decisions:**
- Pronouns selector (Freed has this — it's progressive and practical)
- "New Patient" vs "Returning Patient" toggle that changes which framework subtype auto-selects
- Provider-type awareness: When a PT logs in, rehab frameworks are default. When an LCSW logs in, BH frameworks are default. This is something NO competitor does.

**Timeline:** 6-8 weeks for MVP  
**Competes with:** Freed (UX), Twofold (simplicity)  
**Surpasses them by:** Framework depth driving AI note quality — not just filling sections, but ensuring every clinically required element is documented

---

### STEP 3: "Learn My Style" Adaptive AI
**Why it matters:** This is Freed's killer feature. Clinicians edit a note once, and Freed learns their style forever. You need this or clinicians will leave for Freed.

**What to build:**
- Track every edit a clinician makes to a generated note
- Build a per-clinician style profile: preferred phrasing, section ordering, level of detail, abbreviation preferences
- Use edit history as few-shot examples in subsequent generations
- One-click "save as my template" from any edited note
- Style transfer across framework types (if they prefer terse assessments in SOAP, apply that to H&P too)

**Implementation:**
- Store edit diffs: original generated text → final saved text, per section
- Build a "style vector" from accumulated edits (prompt engineering approach: include 3-5 recent edited examples as few-shot context)
- More advanced: Fine-tune a LoRA adapter per clinician on their edit history (expensive, do later)
- MVP approach: Last 5 edited notes stored as context → included in system prompt → AI mimics their style
- This is essentially RAG over the clinician's own edit history

**Timeline:** 3-4 weeks (after Step 2)  
**Competes with:** Freed (their #1 feature), Twofold (claims style learning)  
**Surpasses them by:** Style learning that works ACROSS framework types, not just within one template

---

### STEP 4: ICD-10/CPT Coding Suggestions
**Why it matters:** Freed has ICD-10. No one else does well. This directly affects revenue for clinics. Missed codes = missed revenue.

**What to build:**
- Auto-suggest ICD-10 codes from encounter transcript + generated note
- CPT code suggestions based on documentation depth (E/M levels, rehab codes, psych codes)
- Confidence scoring: "High confidence" vs "Review needed"
- 8-minute rule calculator for rehab (PT/OT — this is HUGE and NO ONE has it)
- Modifier suggestions (59, 25, GP/GO/GN for rehab)

**Implementation:**
- ICD-10 database: CMS publishes the full code set annually (free, public domain). Load into a searchable vector database
- Mapping engine: NLP extraction of diagnoses from transcript → vector similarity search against ICD-10 descriptions → ranked suggestions
- CPT logic: Rules-based for E/M (count HPI elements, ROS systems, exam elements per CMS 2021+ guidelines). AI-assisted for specialty codes
- 8-minute rule: Simple calculator — total treatment minutes → code units with rounding rules per CMS guidelines. Built into rehab framework UI
- Display: Sidebar panel showing suggested codes with confidence, click to add to note

**Timeline:** 4-6 weeks  
**Competes with:** Freed (ICD-10 only)  
**Surpasses them by:** CPT coding + 8-minute rule for rehab (no competitor touches this) + modifier logic

---

### STEP 5: Rehab-Specific Workflows (First-Mover Advantage)
**Why it's the strategic priority:** ZERO competitors serve PT/OT/SLP. 300,000+ rehab professionals in the US with no AI scribe option. This is your beachhead.

**What to build:**
- Initial Evaluation → Daily Note → Progress Note → Discharge Summary workflow (linked, carrying forward goals/outcomes)
- Standardized outcome measure integration: FIM, DASH, Oswestry, Berg Balance, TUG, 6MWT, manual muscle testing, goniometry
- Outcome measure trending: Show improvement over time in charts (insurers want this for continued authorization)
- Group therapy documentation: Record one group session → generate individual notes for each patient with personalized goals/progress
- Authorization documentation: Auto-generate the specific language insurers need for continued treatment authorization
- G-code/modifier support (CMS functional limitation reporting)
- Multi-disciplinary team views: PT + OT + SLP working on the same patient, shared goals, coordinated documentation

**Implementation:**
- Your existing rehab frameworks (4,539 lines) become the structured prompt backbone
- Patient longitudinal record: Each visit links to previous visits. Goals carry forward. Outcome measures track over time
- Outcome measure library: Build a database of 50+ standardized tests with scoring algorithms, normative data, and minimal detectable change values
- Group therapy engine: One transcript → AI identifies each patient's participation → generates individualized notes referencing their specific goals
- Authorization letter generator: Template-based with auto-populated clinical data (diagnosis, functional limitations, progress, goals, medical necessity justification)
- Data model: Patient → Episodes of Care → Visits → Notes + Outcome Measures + Goals

**Timeline:** 8-12 weeks (complex, but this IS your moat)  
**Competes with:** Nobody. You're alone here.  
**Surpasses them by:** Existence. No competitor even attempts this.

---

### STEP 6: Deep Behavioral Health Workflows (Beyond Twofold)
**Why it matters:** Twofold has 20+ BH templates but they're shallow — section headers with AI fill. OmniScribe can go deeper with evidence-based, protocol-specific documentation.

**What to build:**
- PHQ-9, GAD-7, PCL-5, C-SSRS, AUDIT, DAST auto-scoring integrated into session notes
- Treatment plan → progress note alignment: Goals/objectives from the plan auto-populate into progress notes, clinician documents progress against each
- Protocol-specific documentation: DBT diary card integration, EMDR phase documentation, CBT thought record generation from session content
- 42 CFR Part 2 compliance flags for SUD documentation (NO competitor does this)
- Supervision note generation: Supervisee presents case → AI generates supervision note with regulatory requirements
- Group therapy → individual notes (same as rehab, adapted for group therapy/IOP/PHP settings)
- Crisis documentation: Structured safety planning with C-SSRS integration, means restriction documentation, disposition recording

**Implementation:**
- Your existing BH frameworks (6,279 lines) provide the clinical backbone
- Instrument scoring: Build calculators for top 20 validated instruments. Store scores longitudinally. Show trends
- Treatment plan engine: Structured goals (with target dates, baseline measures, current measures) that carry into every progress note
- 42 CFR Part 2: Consent tracking system — flag when SUD information is present, require documented consent before any information sharing, segment SUD data in exports
- Supervision: Track supervised hours, link supervision notes to clinical notes, generate supervision logs for licensure boards

**Timeline:** 6-8 weeks (parallel with rehab)  
**Competes with:** Twofold (their strongest area)  
**Surpasses them by:** Evidence-based depth, outcome integration, compliance automation, supervision support

---

### STEP 7: EHR Integration
**Why it matters:** Clinicians live in their EHR. If they have to copy-paste, they will — but they'll resent it. Freed's Chrome Extension push is their stickiest feature.

**What to build:**
- Chrome Extension: Detect when clinician is in their EHR → one-click push note into the note field (match Freed)
- Direct API integrations: Start with the big 4 (Epic, Cerner/Oracle Health, athenahealth, eClinicalWorks) — these cover ~60% of the market
- FHIR R4 support: Modern standard, enables integration with any FHIR-compliant EHR
- EHR-specific templates: Pre-format notes to match the EHR's section structure (HealOS does this for Elation, Charm, ECW, Athena — match and expand)
- Platform-specific templates: Simple Practice, TherapyNotes, Headway, Rula, Jane (for rehab) — Twofold does this for therapy platforms

**Implementation:**
- Chrome Extension (Phase 1): Content script that identifies note fields in popular EHRs → injects OmniScribe note content. This is how Freed does it — no deep integration needed
- SMART on FHIR App (Phase 2): Register as a SMART app → launch within Epic, Cerner → read patient context, write notes back. Requires certification but enables the deepest integration
- HL7 v2 / FHIR R4 (Phase 3): Server-to-server integration for enterprise customers
- Start with Chrome Extension — it covers 80% of use cases with 20% of the effort

**Timeline:** 4-6 weeks for Chrome Extension, 3-6 months for FHIR/API integrations  
**Competes with:** Freed (Chrome push), HealOS (Chrome + API)  
**Surpasses them by:** Rehab platform integrations (Jane, WebPT, Net Health — no competitor integrates with rehab EHRs)

---

### STEP 8: Patient-Facing Outputs
**Why it matters:** Freed's patient instructions and post-visit letters are a differentiator. Clinicians love not having to write these separately.

**What to build:**
- Patient instructions: Plain-language summary of the visit + what to do next, auto-generated from the clinical note
- After-visit summary (AVS): Structured patient handout (diagnoses, medications, follow-up, red flags)
- Home exercise programs (HEP): For rehab — auto-generate exercise instructions with descriptions from the treatment note (MASSIVE value for PT/OT)
- Post-visit letters: Referral letters, return-to-work notes, absence notes, school accommodation letters, disability documentation
- Multi-language patient materials: Generate in the patient's preferred language
- Patient portal: Optional patient-facing portal where they can access their instructions/HEP

**Implementation:**
- Secondary AI pass: Take the clinical note → rewrite in plain language at 6th-grade reading level
- HEP library: Build/license a library of exercise descriptions with images. Map common PT interventions to exercise prescriptions
- Letter templates: 15-20 common letter types with auto-populated clinical data
- Translation: Use Claude/GPT for medical translation (with disclaimers about professional translation for critical content)

**Timeline:** 3-4 weeks  
**Competes with:** Freed (patient instructions, letters)  
**Surpasses them by:** HEP generation for rehab (unique), multi-language, broader letter types

---

### STEP 9: Outcome Measurement & Analytics Platform
**Why it matters:** This is the biggest gap across ALL competitors. None of them track clinical outcomes. This is where healthcare is going — value-based care requires outcome data.

**What to build:**
- Outcome measure dashboard: Per-patient trending of standardized measures over time
- Population health view: Aggregate outcomes across the clinician's caseload
- Authorization support: Auto-generate authorization requests with outcome data showing medical necessity
- Benchmarking: Compare patient outcomes to published norms (de-identified, aggregate)
- Payer reporting: Format outcome data for insurance reporting (MIPS, HEDIS measures)
- Research export: De-identified data export for clinical research (with proper consent/IRB documentation)

**Implementation:**
- Data pipeline: Every scored outcome measure feeds into a time-series database
- Visualization: Chart.js or D3 for outcome trend graphs embedded in patient records
- Authorization engine: Rules-based system — if outcome measures show functional limitation AND improvement trend, auto-generate medical necessity justification. If plateau detected, flag for clinical decision (continue, modify, discharge?)
- Dashboard: Clinician sees their caseload with color-coded outcome trends (green = improving, yellow = plateau, red = declining)

**Timeline:** 6-8 weeks  
**Competes with:** Nobody does this  
**Surpasses them by:** Existence. This is genuinely new for AI scribes.

---

### STEP 10: AI Receptionist + Practice Management (Match HealOS Breadth)
**Why it matters:** HealOS is building a full practice suite. If OmniScribe only does scribe, you lose customers who want a one-stop shop.

**What to build:**
- AI phone answering: Schedule appointments, capture intake information, verify insurance, route urgent calls
- Appointment reminders: SMS/email with pre-visit questionnaires (outcome measures can be collected pre-visit!)
- Insurance eligibility verification: Real-time eligibility checks before appointments
- Billing assistance: CPT code suggestions (from Step 4) → superbill generation → claim submission support
- Referral management: Generate and track referral letters with clinical data

**Implementation:**
- Voice AI: Twilio + ElevenLabs or Play.ht for natural voice, with structured conversation flows for scheduling/intake
- Insurance APIs: Availity, Change Healthcare, or Eligible for eligibility verification
- Billing: Integration with clearing houses (Waystar, Availity) or partner with an existing billing platform
- Build vs Buy decision: Consider partnering with existing practice management platforms rather than building from scratch. OmniScribe's differentiation is in clinical documentation — practice management is a commodity

**Timeline:** 3-6 months (or partner)  
**Competes with:** HealOS  
**Build vs Buy:** Seriously consider partnerships here. Your moat is clinical quality, not phone answering.

---

### STEP 11: Template Marketplace & Community
**Why it matters:** Twofold's 75+ public template library is their biggest content marketing asset and a major SEO play. OmniScribe needs this.

**What to build:**
- Public framework/template library: Every framework type browsable on the marketing site (like Twofold)
- Community-contributed templates: Clinicians share their customized frameworks
- Specialty packs: Curated framework sets for specific specialties (Orthopedic PT pack, Pediatric SLP pack, Community MH Center pack)
- Template/framework preview: See exactly what the generated note will look like before selecting
- Ratings and reviews: Clinicians rate template quality
- Revenue share: Top contributors earn a percentage when their templates are used by others

**Implementation:**
- Public-facing: Static site generated from your framework database, SEO-optimized per template/specialty
- Marketplace: User accounts, upload workflow, review/approval process, star ratings
- Revenue share: Track template usage, pay contributors monthly (similar to Shopify theme marketplace model)

**Timeline:** 4-6 weeks for public library, 2-3 months for full marketplace  
**Competes with:** Twofold (public templates)  
**Surpasses them by:** Evidence-based frameworks (not just section headers), specialty depth, revenue sharing

---

### STEP 12: SOC 2 Type II Certification + Enterprise Readiness
**Why it matters:** Only Freed has SOC 2. Enterprise health systems require it. Getting certified early puts you ahead of Twofold and HealOS.

**What to build:**
- SOC 2 Type II audit: Trust Service Criteria (security, availability, confidentiality, privacy)
- HITRUST certification: Gold standard for healthcare (optional but powerful)
- SSO/SAML: Enterprise login requirements
- Audit logging: Every access to patient data logged
- Role-based access control: Admin, clinician, supervisor, billing staff
- Multi-tenant architecture: Clinic groups with shared settings but isolated data
- BAA management: Automated BAA generation and tracking
- Data residency: US-only data storage options for enterprise customers
- Penetration testing: Annual third-party security assessment

**Implementation:**
- Use Vanta or Drata for automated SOC 2 compliance monitoring (both Freed and many health tech companies use these)
- Timeline to SOC 2 Type II: ~6 months from starting the process (3 months to implement controls, 3 months observation period)
- Cost: $15,000-50,000 for the audit itself, $5,000-15,000/year for compliance monitoring tools
- Worth it: Enterprise contracts are 10-100x individual subscriptions

**Timeline:** 6-9 months  
**Competes with:** Freed (only SOC 2 certified competitor)  
**Surpasses them by:** Getting HITRUST (Freed doesn't appear to have this)

---

## ARE THESE 12 STEPS ENOUGH?

**Yes — and then some.** Here's why:

| Capability | Freed | Twofold | HealOS | OmniScribe (after all 12 steps) |
|---|---|---|---|---|
| Audio capture + transcription | ✅ | ✅ | ✅ | ✅ |
| Note generation | ✅ | ✅ | ✅ | ✅ (deeper) |
| Learn my style | ✅ | ✅ | ❌ | ✅ (cross-framework) |
| ICD-10 coding | ✅ | ❌ | ✅ | ✅ |
| CPT coding | ❌ | ❌ | ❌ | ✅ |
| EHR integration | ✅ | ❌ | ✅ | ✅ |
| Patient instructions | ✅ | ✅ | ❌ | ✅ |
| Post-visit letters | ✅ | ❌ | ❌ | ✅ |
| Home exercise programs | ❌ | ❌ | ❌ | ✅ |
| Rehab workflows | ❌ | ❌ | ❌ | ✅ |
| Deep BH workflows | ❌ | Partial | ❌ | ✅ |
| Outcome measures | ❌ | ❌ | ❌ | ✅ |
| Multi-disciplinary teams | ❌ | ❌ | ❌ | ✅ |
| Authorization automation | ❌ | ❌ | ❌ | ✅ |
| 42 CFR Part 2 compliance | ❌ | ❌ | ❌ | ✅ |
| Supervision documentation | ❌ | ❌ | ❌ | ✅ |
| 8-minute rule calculator | ❌ | ❌ | ❌ | ✅ |
| Group therapy → individual notes | ❌ | ❌ | ❌ | ✅ |
| AI Receptionist | ❌ | ❌ | ✅ | ✅ |
| Template marketplace | ❌ | ✅ (free) | ❌ | ✅ (with revenue share) |
| SOC 2 Type II | ✅ | ❌ | ❌ | ✅ |
| Public template library | ❌ | ✅ | ❌ | ✅ |
| Evidence-based frameworks | ❌ | ❌ | ❌ | ✅ |
| Regulatory source citations | ❌ | ❌ | ❌ | ✅ |

**OmniScribe after these 12 steps has 25 capabilities. Freed has 10. Twofold has 7. HealOS has 8.**

The 7 capabilities that NO competitor has — and that OmniScribe would uniquely offer — are the strategic moat:
1. Rehab-specific workflows with outcome measures
2. Deep BH workflows with instrument integration
3. Multi-disciplinary team documentation
4. Authorization automation with clinical data
5. 42 CFR Part 2 compliance engine
6. Group therapy → individual note generation
7. Evidence-based, regulatory-sourced frameworks (your foundation)

---

## PRICING STRATEGY

### The Affordability Play

OmniScribe should undercut Freed and match HealOS on entry, while offering more value at every tier:

| Tier | Price | Target | What's Included |
|---|---|---|---|
| **Starter** | **$29/mo** | Students, part-time | 50 notes/mo, all frameworks, basic coding suggestions |
| **Professional** | **$59/mo** | Individual clinicians | Unlimited notes, learn my style, ICD-10/CPT, patient instructions, outcome measures |
| **Clinical** | **$89/mo** | Specialists (PT/OT/SLP/BH) | Everything + rehab/BH workflows, authorization automation, group therapy notes, HEP generation |
| **Enterprise** | **Custom** | Clinics, hospitals, SNFs | Everything + SSO, multi-tenant, EHR API integration, analytics dashboard, dedicated support |

**Why this works:**
- $29 Starter undercuts everyone (Freed $39, HealOS $39, Twofold $69)
- $59 Professional beats Freed Core ($79) with MORE features
- $89 Clinical is unique — no competitor even has a tier for rehab/BH specialists
- Students at $29 (vs Freed's 50% discount = ~$40) — build loyalty early

**Additional revenue streams:**
- Template marketplace revenue share (10-20% of paid templates)
- API access for EHR vendors who want to embed OmniScribe
- White-label for large health systems
- Outcome data analytics (de-identified, aggregate — for research institutions)

---

## GIL'S ROLE: What the Founder Must Do

This section is the most important one in this document. The 12 steps above are the *what*. Your role is the *how* and *why* it succeeds.

### 1. Clinical Credibility Officer
**You are the bridge between engineering and clinical reality.**

No AI scribe founder I've seen in the competitor analysis has deep clinical documentation expertise. Freed's founder built it for his wife. HealOS is a Y Combinator tech play. Twofold is an Israeli tech company. None of them have someone who understands *why* a PT eval needs to document manual muscle testing grades, or *why* 42 CFR Part 2 matters for SUD documentation.

**Your job:**
- Review every framework for clinical accuracy before release
- Write the regulatory source citations (this is your moat — don't outsource it)
- Test every generated note as if you were the clinician submitting it for billing
- Be the person who says "this note would get denied by Medicare" before a user does
- Record yourself using the product and narrate what a clinician would think at each step

### 2. Specialty Community Builder
**Rehab and BH clinicians are underserved and vocal. They will be your evangelists — if you earn it.**

**Your job:**
- Join PT, OT, SLP, and BH clinician communities (Reddit r/physicaltherapy, r/OccupationalTherapy, r/slp, r/psychotherapy, Facebook groups, APTA/AOTA/ASHA forums)
- Don't sell. Listen first. Understand their documentation pain. Post genuinely helpful content about documentation requirements
- Recruit 10-20 beta testers from these communities — give them free access, get weekly feedback
- Build relationships with clinical educators at PT/OT/SLP programs — students who learn on OmniScribe become lifetime users
- Attend APTA Combined Sections Meeting, AOTA Annual Conference, ASHA Convention — these are where your first 1,000 users are

### 3. Quality Gatekeeper
**OmniScribe's entire value proposition is "better documentation than anyone else." If quality slips, everything falls apart.**

**Your job:**
- Personally review the first 100 AI-generated notes across each framework type
- Create a clinical accuracy scorecard: Does the note include all required elements? Is the medical necessity language sufficient? Would this survive an audit?
- Hire (or contract) 2-3 practicing clinicians as clinical advisors: one PT, one LCSW/psychologist, one physician. Pay them to review notes monthly
- Establish a quality review cadence: weekly in the first 6 months, monthly after that
- Build a "note quality" metric into the product analytics — track how many sections users edit (more edits = lower initial quality)

### 4. Regulatory Intelligence
**Your frameworks are sourced from CMS, Joint Commission, APTA, APA, and other regulatory bodies. These change. You need to stay current.**

**Your job:**
- Subscribe to CMS updates (Federal Register, MLN Matters articles)
- Monitor APTA, AOTA, ASHA, APA guideline updates
- Track payer-specific documentation requirements (UnitedHealthcare, Cigna, Aetna, BCBS vary in what they require)
- When regulations change, update frameworks within 30 days
- Publish changelog: "Updated PT eval framework to reflect 2026 CMS documentation requirements" — this builds trust that no competitor can match

### 5. Business Development & Partnerships
**You can't build everything. Partner strategically.**

**Your job:**
- EHR partnerships: Approach WebPT (rehab), TherapyNotes (BH), Jane (multi-disciplinary) for integration partnerships. They need AI scribe partners. You need distribution
- Billing company partnerships: Rehab billing companies (Raintree, WebPT Billing) would love to offer an AI scribe to their clients
- Professional association partnerships: Offer discounted OmniScribe to APTA/AOTA/ASHA members in exchange for endorsement/promotion
- Continuing education: Create a CE course on "AI-Assisted Documentation Best Practices" — gets your product in front of clinicians who are actively learning
- Academic partnerships: Offer free accounts to PT/OT/SLP/counseling programs

### 6. Fundraising & Financial Sustainability
**You need capital to execute this roadmap. Here's the honest math.**

**Your job:**
- **Bootstrap to MVP (Steps 1-3):** Can be done for $20,000-50,000 if you contract developers and use your own clinical expertise. 3-4 months
- **Seed round ($500K-1.5M):** After MVP with 50+ beta users and clinical validation data. Target healthcare-focused angels and micro-VCs (Rock Health, Springboard Health, 7wireVentures)
- **Revenue projections:** 100 paying users × $59/mo = $70,800 ARR. 1,000 users = $708,000 ARR. Freed hit $15M+ ARR with 25K users — the market is real
- **Cost structure:** Transcription API (~$40/user/mo), AI generation (~$10/user/mo), infrastructure (~$5/user/mo) = ~$55/user/mo COGS at Professional tier. At $59/mo, that's thin margins. At $89/mo Clinical tier, margins improve to ~40%
- **Key metric:** Get to 500 paying users within 12 months of launch. This proves product-market fit and makes you fundable

### 7. Hiring (When the Time Comes)
**Don't hire too early. But know who you need.**

- **First hire:** Full-stack engineer who has healthcare experience (HIPAA awareness, EHR familiarity). This person builds Steps 1-3 with you
- **Second hire:** Clinical content specialist (PT, OT, or SLP background + writing skills). This person maintains and expands frameworks
- **Third hire:** Growth marketer who understands healthcare SaaS (content marketing, SEO, community building)
- **Don't hire:** A sales team (until you have 500+ organic users), a customer success team (until you have 200+ users), a CTO (until you're doing $500K+ ARR)

### 8. Protect What Matters
**Your frameworks are your IP. Protect them.**

**Your job:**
- Document your framework development methodology (regulatory source → clinical requirement → documentation item → AI prompt). This is trade secret material
- Consider provisional patents on: (a) the framework-driven note generation system, (b) the outcome measure integration approach, (c) the group therapy → individual note generation method
- Terms of service: Users can't export your frameworks and resell them
- Keep regulatory source citations as a competitive advantage — competitors can copy your sections, but they can't easily replicate the depth of regulatory grounding

---

## TIMELINE: 18-Month Roadmap

| Month | Steps | Milestone |
|---|---|---|
| 1-2 | Steps 1-2 (Audio + Web App MVP) | Working prototype: record → transcribe → generate note |
| 3-4 | Step 3 (Learn My Style) + Step 5 begins (Rehab) | Beta launch with 20 clinicians |
| 4-5 | Steps 4-5 (Coding + Rehab workflows) | Rehab-specific beta with 10 PTs/OTs |
| 5-7 | Step 6 (BH workflows) + Step 7 begins (EHR) | BH beta with 10 therapists, Chrome Extension released |
| 7-9 | Steps 7-8 (EHR + Patient outputs) | Public launch, first paying customers |
| 9-12 | Steps 9-11 (Outcomes + Marketplace) | Outcome measures live, public template library |
| 12-15 | Step 12 (SOC 2) + Step 10 (Practice mgmt) | Enterprise-ready, first clinic contracts |
| 15-18 | Scale + optimize | 500+ paying users target |

---

## THE BOTTOM LINE

OmniScribe doesn't need to out-Freed Freed. It doesn't need to out-template Twofold. It doesn't need to out-platform HealOS.

**OmniScribe needs to be the product that a burned-out PT, a drowning LCSW, and an overwhelmed rural PA-C open and think: "Finally. Someone actually built this for me."**

The frameworks you've already built are the foundation no competitor has. The 12 steps above turn that foundation into a product. And your role as founder — the clinical credibility, the community building, the quality obsession — is what makes it a company, not just software.

You're not behind. You're building something they can't easily copy. Now execute.

---

*This document should be reviewed and updated quarterly as market conditions change and steps are completed.*
