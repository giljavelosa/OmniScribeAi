# OmniScribe Competitor UX Testing Report

**Date:** February 12, 2026  
**Prepared by:** Product Intelligence Team  
**Purpose:** Hands-on competitive analysis for OmniScribe product strategy  

---

## Executive Summary

We tested three AI medical scribe competitors by browsing their live websites, documenting their UX, pricing, feature sets, and positioning. Key finding: **all three focus primarily on physician/therapist note-taking, with significant gaps in rehabilitation, deep behavioral health workflows, and multi-disciplinary team features.** OmniScribe has a clear lane to differentiate.

---

## 1. Freed (getfreed.ai)

### First Impressions (5-Second Test)
The landing page immediately communicates: **"We take documentation off your plate so you can be a better clinician."** The hero has a rotating animation cycling through "letters," "coding," and similar tasks. The emotional pitch is strong — the tagline "Let's take [X] off your to-do list" is clear and benefits-focused. Stats are prominently displayed: 25K+ clinicians, 1,300+ health organizations, 2+ hours saved daily. Trust badges (HIPAA, SOC 2, CB Insights Digital Health 50 2025) appear immediately below the CTA.

**Verdict:** Polished, emotionally resonant, clinician-first messaging. This is the market leader's homepage — it looks and feels like it.

### Navigation & Information Architecture
- **Top nav:** Features | How it Works | EHR Integration | Specialties (dropdown) | Early Access List (dropdown) | Contact Sales
- **No public pricing page.** This is a deliberate enterprise sales strategy — forces prospects to sign up for a free trial or contact sales.
- Specialties are tucked in a dropdown with only 8 listed: Family Medicine, Internal Medicine, Psychiatry, Mental Health, Pediatrics, Functional Medicine, OB/GYN, "Other Specialties"
- Footer is well-organized with Product, Specialties, Compliance, About Us, and Resources sections
- **Finding pricing requires signing up.** This is a friction point for comparison shoppers but signals confidence.

**Verdict:** Clean, professional IA. The missing pricing page is the biggest gap for a self-serve buyer. Navigation is simple but limited — no template library, no specialty deep-dives beyond landing pages.

### Pricing Page
**No public pricing page exists.** Based on market intelligence:
- **Free trial:** 7 days, no credit card
- **Individual plan:** Estimated ~$99/month
- **Group/Enterprise:** Contact sales
- The site repeatedly says "Try for Free" and "No credit card needed" but never mentions a price anywhere

**Strategic implication:** Freed has moved upmarket. They're targeting clinic groups (1,300+ organizations) and can afford to hide pricing because their brand carries enough trust. This is a vulnerability for self-serve individual clinicians comparing options.

### Specialty/Template Coverage
**Listed specialties (footer + specialty pages):**
1. Family Medicine
2. Internal Medicine
3. Psychiatry
4. Mental Health
5. Pediatrics
6. Functional/Integrative Medicine
7. OB/GYN
8. "Other Specialties" (catch-all)

**Notable absences:** No dedicated pages for Physical Therapy, Occupational Therapy, Speech Therapy, Rehabilitation, Cardiology, Orthopedics, Oncology, Dermatology, or Dentistry.

**Templates:** The features page mentions "specialty-specific templates," "custom template builder," and "learn my format" (AI learns from your edits). No public template library or count is shown. Templates are described as "made by real clinicians" and "customizable and sharable."

**Testimonial specialties observed:** Podiatry, Addictions Medicine, Primary Care, Family Medicine, Psychiatric Mental Health (NP), OB/GYN — showing broader actual usage than marketed specialties.

### Signup/Onboarding Flow
- CTA: "Try for Free" → redirects to `secure.getfreed.ai/signup`
- No credit card required
- The flow asks for specialty selection to auto-configure templates
- Chrome extension available for EHR push
- Mobile apps available for iOS and Android
- Works across desktop, laptop, tablet, mobile

### Marketing Claims
- "Enterprise-grade AI scribe and clinician assistant, purpose-built for small and mid-sized clinics"
- "25K+ clinicians, 1,300+ health organizations, 2+ hours saved daily"
- "Over 2,000,000 notes processed monthly"
- "14+ languages supported"
- "Clinical-grade accuracy" — models trained on 27,000+ medications and terms
- "Notes that learn from your edits"
- **Founder story is prominent:** Built by CEO Erez Druk for his wife Dr. Gabriella Meckler. "The only purpose of Freed is to make clinicians happier." Personal email provided (erez@getfreed.ai)

**Evidence provided:** Customer logos (Allergy Partners, American Family Care, BestMind, Deaconess, Essen, Privia, etc.), 9+ testimonials with names, credentials, and specialties, 5-star ratings, CB Insights Digital Health 50 award.

### EHR Integration Claims
- **"Any browser-based EHR"** via Chrome extension (one-click push)
- No IT required — install Chrome extension and go
- Mentions integration with "select EHRs" for groups via direct API
- Does NOT list specific EHR names on the site
- EHR push described as "free beta through end of 2025" (still listed in Feb 2026 — possibly still free)
- HIPAA-compliant, SOC 2 certified, E2E encrypted

### Mobile/Responsive
- iOS and Android native apps available
- Chrome extension for desktop
- Works on "all modern desktops, laptops, tablets, and mobile phones"

### Trust Signals
- HIPAA + HITECH compliance badges (prominent, multiple placements)
- SOC 2 Type II certification badge
- FIPS PUB 140-2 cryptographic standards
- CB Insights Digital Health 50 2025 award
- Drata Security Center link (public trust portal)
- "Doesn't store patient recordings"
- Named customer logos from recognizable health organizations
- Named testimonials with credentials

### Key UI Observations
- Modern, clean design with generous whitespace
- Blue primary color scheme — professional, medical feel
- Animated hero section (rotating text: "letters," "coding")
- Video lightbox on homepage (product demo)
- Intercom chat widget in bottom-right corner
- Cookie consent dialog (standard GDPR)
- Testimonial carousel with infinite scroll
- Before/During/After visit flow visualization with screenshots
- Heavy use of VWO (A/B testing) — they're actively optimizing conversion

---

## 2. Twofold (trytwofold.com)

### First Impressions (5-Second Test)
Top banner: **"Free for a week, then $19 for your first month"** — immediately communicates affordability and low commitment. Hero headline: **"Your clinical notes. Auto-generated. Magically."** Subhead: "The most trusted and loved tool to generate accurate and compliant medical notes." Immediately shows: in-person/telehealth, phone/desktop, HIPAA compliant, learns your style. Rating badge: 4.8/5.

**Verdict:** Clear value prop, price-forward messaging, therapist-friendly tone. This site is targeting individual clinicians, especially therapists, not enterprise buyers.

### Navigation & Information Architecture
- **Single-page layout** — everything on one scrolling page with anchor links: Testimonials | Features | How it Works | Pricing | Security | For Groups
- Login and "Try for Free" in top nav
- Footer has: Solutions (HIPAA-compliant AI Notes, AI Clinical Notes, AI Therapy Notes), Specialties (Behavioral Health, Internal Medicine, Pediatrics, Physical Therapy, Primary Care, Psychiatry), Resources (Blog, Templates, Comparisons, Medical Coding Hub, Help Center)
- **Template library is public** — a major differentiator for SEO and discovery

**Verdict:** Simple, effective single-page design. Lower information density than Freed but much easier to scan. The public template library is a smart content marketing play.

### Pricing Page
Pricing is on the homepage (anchor link):

| Tier | Monthly Price | Key Features |
|------|-------------|--------------|
| **Free** | $0 | All note types, custom templates, summaries for patients (limited sessions implied) |
| **Personal** (Most Popular) | **$69/mo** ($19 first month promo) | Unlimited notes, custom templates, AI Assistant, patient progress tracking, treatment plans, mobile & desktop app, premium support |
| **Group** | Custom | For clinics/teams, flexible plans, volume discounts, org-wide BAA |

- Annual toggle available (pricing not captured but likely ~20% discount)
- **Referral program:** "Refer 2 friends, get 1 year free!" — aggressive growth tactic
- No credit card needed for free trial
- Consent forms & BAA-HIPAA Agreement included

**Strategic note:** At $69/mo ($19 first month), Twofold significantly undercuts Freed's estimated ~$99/mo. The free tier + promo pricing is designed to capture individual therapists who are price-sensitive.

### Specialty/Template Coverage
**Listed specialties (footer):**
1. Behavioral Health
2. Internal Medicine
3. Pediatrics
4. Physical Therapy
5. Primary Care
6. Psychiatry

**Template library (public, 75+ templates counted on /templates page):**

*Behavioral Health / Therapy (strongest category):*
- DAP Note, BIRP Note, GIRP Note, SIRP Note
- Therapy Note, Therapy Session Notes
- Psychotherapy Progress Note
- Mental Health Progress Note
- Behavioral Health Progress Note
- Behavioral Health Assessment
- Mental Health Intake Assessment
- Mental Health Group Note
- Mental Health Risk Assessment
- Mental Health Referral Form
- Mental Health Doctors Note
- Psych Eval Template
- Psychiatric SOAP Note
- Case Conceptualization
- EMDR Note
- DBT Diary Card
- Biopsychosocial Assessment
- Therapy Intake Assessment
- Family Therapy Note
- Couples Therapy Note
- Safety Plan for Mental Health
- Substance Use Assessment Form
- Trauma Timeline
- Anxiety Journal
- Counseling Intake Form
- Treatment Goals for Anxiety
- Cognitive Distortions Worksheet
- Anger Iceberg Worksheet
- Daily Mood Log
- ADHD Symptom Tracker / Planner / TODO List
- Relapse Prevention Plan
- ESA Letter

*Medical/Clinical:*
- SOAP Note, Blank SOAP Note
- Clinical Note, Progress Notes
- HPI Template, ROS Template
- Urgent Care Note
- Nursing Notes, Nursing Report Sheet, Nursing Care Plan
- Discharge Summary, Discharge Planning
- Treatment Plan, Treatment Summary
- Care Plan, Care Coordination Plan
- Medical Chart, Patient Chart

*Physical/Occupational Therapy:*
- Physical Therapy Evaluation Form
- Occupational Therapy Goals Examples
- Speech Therapy Goals Examples

*Dental:*
- Dental Chart, Dental Treatment Consent Form, Dental Treatment Plan

*Administrative/Forms:*
- Consent Form, HIPAA Consent Form, Telehealth Consent Form
- Patient Registration Form, Patient Referral Form
- Insurance Verification Form, Insurance Claim Form
- Medical Release Form, Medical Certificate
- Return to Work Doctors Note, VA Doctors Note
- Appointment Letter, Appointment Reminder
- Superbill
- and more...

**This is by far the largest public template library of the three competitors.** Heavy BH weighting confirms their positioning.

### Signup/Onboarding Flow
- "Try for Free" → redirects to `app.trytwofold.com/get-started`
- No credit card required
- Three input methods: (1) Capture conversation (live), (2) Dictate a summary, (3) Upload your notes
- Learns your style over time
- Up to 1.5 hour session recording

### Marketing Claims
- "The most trusted and loved tool to generate accurate and compliant medical notes"
- "Loved by thousands of therapists, physicians and nurses"
- "4.8 out of 5" rating
- Learns your style
- Focus on burnout reduction and patient care improvement
- **No specific user count or organization count** — weaker social proof than Freed

### EHR Integration Claims
- "Easily copy and paste your notes into your preferred EHR or EMR"
- **No native EHR integration** — copy/paste only
- No Chrome extension for EHR push
- This is the weakest EHR story of the three

### Mobile/Responsive
- "Works on phone or desktop"
- Mobile & desktop app listed in Personal tier features
- Responsive web design

### Trust Signals
- HIPAA and HITECH compliance mentioned
- "Recordings are never stored"
- "Don't train models on your data"
- Microsoft Azure hosting with formal BAA
- AES encryption at rest and in transit
- Pre-employment background checks mentioned
- No SOC 2 certification badge (notable absence)
- No named customer logos
- Testimonials use first names only (no last names, no photos for most)
- Intercom chat widget

### Key UI Observations
- Clean, modern single-page design
- Purple/dark theme — distinctive from Freed's blue
- Banner announcing promo pricing at very top
- Testimonial carousel (horizontal scroll, repeating)
- Simple 3-step "How it works" (Capture → Review → Send)
- Pricing cards with toggle for Monthly/Annual
- Security section is text-heavy, no badges
- Template pages are SEO-optimized blog-style content (each template has its own article)
- Company: "Ravel Technological Solutions LTD" — Israel-based
- Less polished than Freed but more transparent on pricing and templates

---

## 3. HealOS (healos.ai) — formerly Scribe Health AI

### First Impressions (5-Second Test)
Hero headline: **"Automate Every Healthcare Workflow With AI Healthcare Agents"** — this immediately positions HealOS as more than a scribe. Subhead mentions documentation, billing, insurance, clinical workflows, patient interactions, "8+ hours every week," reduced denials, increased revenue. Trust signals: 100% HIPAA Compliant, Works for EHR and telehealth, AES256 Encryption.

**Verdict:** The most ambitious positioning of the three. Not just a scribe — a full practice automation platform. This is aspirational but may overwhelm a solo clinician looking for just note-taking.

### Navigation & Information Architecture
- **Top nav:** Industry (dropdown) | Use Cases (dropdown) | Meet Agents (dropdown) | Resources (dropdown) | Pricing | Tools (dropdown) | HealOS Academy
- Three CTAs: Login | Try For Free | Request Demo
- Footer: Use Cases, Meet Agents, Industry (specialties), Resources
- **Pricing is publicly listed** — major transparency advantage
- "HealOS Academy" — training/education content (unique among the three)

**Verdict:** Most complex navigation. Multiple product lines create cognitive load. A clinician wanting "just an AI scribe" has to navigate past receptionist, fax automation, and insurance agents to find what they need. But for a practice manager looking for a full stack, this is compelling.

### Pricing Page
**HealOS has the most transparent and detailed pricing of all three:**

#### AI Medical Scribe (annual pricing shown, 20% off):
| Tier | Price | Key Features |
|------|-------|--------------|
| **Core** | $39/mo | Unlimited sessions, unlimited custom templates, Chrome Extension |
| **Plus** (Most Popular) | $79/mo | Everything in Core + appointment sync with select EHRs + direct note transfer to select EHRs |

#### AI Receptionist (Voice AI):
| Tier | Price | Minutes |
|------|-------|---------|
| Starter | $39/mo | 100 min — basic answering, scheduling, SMS |
| Business | $159/mo | 1,000 min — intake, routing, after-hours, custom scripts |
| Pro | $319/mo | 2,500 min — multi-location, analytics |
| Agency | $799/mo | 7,000 min — white-label, reseller |
| Enterprise | Custom | Unlimited — SIP trunk, $0.08/min |

#### AI Fax Automation:
| Tier | Price | Volume |
|------|-------|--------|
| Fax Pro | $239/mo | 3,000 pages |
| Fax + Referrals | $439/mo | 3,000 pages + 200 referrals |

#### Insurance Automation:
| Tier | Price | Audience |
|------|-------|----------|
| Starter | $79/mo | Solo — 500 eligibility checks/mo |
| Pro | $199/mo | Medium clinics — + 100 prior auths/mo |
| Enterprise | Custom | Hospitals — unlimited |

**The scribe alone at $39/mo (annual) is the cheapest option of all three competitors.** This is the price leader. The full stack (scribe + receptionist + fax + insurance) could run $500-1,000+/mo, positioning HealOS as a practice management platform.

### Specialty/Template Coverage
**Listed specialties (10):**
1. Cardiology
2. Dietitians
3. Oncology
4. Orthopedics
5. Pediatrics
6. Psychiatry
7. Therapy
8. Virtual Care Providers
9. Group Practices
10. Individual Providers

**Note types mentioned:** SOAP, DAP, narrative notes, custom templates  
**No public template library** — templates are inside the product

**Notable:** Broader medical specialty coverage than Freed or Twofold (cardiology, oncology, orthopedics, dietitians are unique). But still **no rehabilitation, no PT/OT/SLP as named specialties.**

### Signup/Onboarding Flow
- "Try For Free" → `app.healos.ai/sign-up`
- "Request Demo" → `demo.healos.ai/calendar` (Calendly-style booking)
- Free trial: up to 20 sessions, no credit card
- Stripe checkout for paid plans (direct "Buy Now" links)
- Chrome Extension for EHR integration

### Marketing Claims
- "Save 8+ hours every week"
- "70% reduction in charting time"
- "$2,400/month average revenue lift through automated insurance workflows"
- "95% fewer insurance errors"
- "6 coordinated AI agents" working together
- **"402 integrations"** listed on integrations page
- Formerly Y Combinator-backed (mentioned on integrations page)
- Revenue-focused messaging (unique among the three — others focus on time/happiness)

### EHR Integration Claims
**The strongest integration story:**
- Claims 402 EHR integrations on their integrations page
- Mentions: Jane, Epic, Cerner, AllScripts by name
- Integration methods: API, Chrome Extension, HL7/FHIR standards
- Direct note transfer to select EHRs (Plus plan)
- Appointment sync with select EHRs (Plus plan)

**Reality check:** The "402 integrations" page appears to be SEO-generated pages for every EHR name, not necessarily deep native integrations. The Chrome Extension approach (like Freed) is the primary method. True API integrations likely limited to a handful.

### Mobile/Responsive
- "Works for EHR and telehealth" mentioned
- No explicit mobile app references found
- Chrome Extension is desktop-focused

### Trust Signals
- "100% HIPAA Compliant" badge
- AES256 Encryption mentioned
- Y Combinator backing (credibility signal)
- Named testimonials with credentials and specialties (4 shown)
- Fax volume counter on homepage (social proof of usage: "66 faxes yesterday", "75 faxes yesterday", etc.)
- **No SOC 2 badge visible**
- **No named customer organization logos**

### Key UI Observations
- Dark theme, modern SaaS design
- "Agent" metaphor throughout (AI Scribe Agent, Benefits Verification Agent, etc.)
- Testimonial carousel with navigation arrows
- Multiple product sections on homepage create long scroll
- FAQ accordion at bottom
- Toast notification area ("Notifications alt+T")
- Pricing page is well-structured with toggle for monthly/annual
- Links still reference "scribehealth.ai" in some demo URLs (rebrand incomplete)
- Some copy quality issues ("Se in Action" instead of "See in Action" — typo on homepage)
- Overall: ambitious but rougher polish than Freed

---

## Comparison Matrix

| Feature | Freed | Twofold | HealOS |
|---------|-------|---------|--------|
| **Scribe Price (monthly)** | ~$99/mo (est.) | $69/mo ($19 first month) | $39/mo (annual) |
| **Free Trial** | 7 days, no CC | 1 week, no CC | 20 sessions, no CC |
| **Public Pricing** | ❌ No | ✅ Yes | ✅ Yes |
| **Unlimited Notes** | ✅ (paid) | ✅ (Personal tier) | ✅ (all paid tiers) |
| **Custom Templates** | ✅ | ✅ | ✅ |
| **Public Template Library** | ❌ | ✅ (75+) | ❌ |
| **"Learns Your Style"** | ✅ | ✅ | Not explicitly stated |
| **ICD-10 Coding** | ✅ | Not mentioned on site | ✅ + CPT |
| **Patient Instructions** | ✅ | ✅ ("summaries for patients") | Not mentioned |
| **Post-Visit Letters** | ✅ (14+ types) | ❌ | ❌ |
| **EHR Push (native)** | ✅ Chrome Extension | ❌ Copy/paste only | ✅ Chrome Extension + API |
| **Named EHR Integrations** | "Any browser-based" | None | Epic, Cerner, AllScripts, Jane |
| **Mobile App** | ✅ iOS + Android | ✅ Mobile app | ❌ Not evident |
| **AI Assistant / Magic Edit** | ✅ | ✅ | Not highlighted |
| **Pre-Visit Summary** | ✅ | ❌ | ❌ |
| **Treatment Plans** | ❌ | ✅ (Personal tier) | ❌ |
| **Patient Progress Tracking** | ❌ | ✅ (Personal tier) | ❌ |
| **Insurance Automation** | ❌ | ❌ | ✅ (separate product) |
| **Prior Authorization** | ❌ | ❌ | ✅ (separate product) |
| **AI Receptionist** | ❌ | ❌ | ✅ (separate product) |
| **Fax Automation** | ❌ | ❌ | ✅ (separate product) |
| **Referral Management** | ❌ | ❌ | ✅ (separate product) |
| **A/R Automation** | ❌ | ❌ | ✅ (separate product) |
| **Multi-Language** | ✅ 14+ languages | Not mentioned | Not mentioned |
| **HIPAA Compliant** | ✅ | ✅ | ✅ |
| **SOC 2 Certified** | ✅ Type II | ❌ Not shown | ❌ Not shown |
| **Named Specialties** | 8 | 6 | 10 |
| **User Count Claimed** | 25,000+ | "thousands" | Not specified |
| **Org Count Claimed** | 1,300+ | Not stated | Not stated |
| **Upload/Dictate Mode** | ✅ | ✅ (3 input methods) | Not highlighted |
| **BH Template Depth** | Limited (Psychiatry, Mental Health) | ✅✅✅ Deep (20+ BH templates) | Basic (DAP, SOAP) |

---

## UX Quality Ranking

### 1. Freed (8.5/10)
**Strengths:** Most polished, emotionally resonant messaging, strong founder story, enterprise credibility signals. Feels premium.  
**Weaknesses:** Hidden pricing, limited specialty marketing, no public template library.

### 2. Twofold (7.5/10)  
**Strengths:** Transparent pricing, massive public template library, strongest BH content, simple single-page design, three input methods.  
**Weaknesses:** Weaker trust signals (no SOC 2, no named logos), no native EHR integration, less polished design. Israel-based company may concern some US healthcare buyers.

### 3. HealOS (6.5/10)
**Strengths:** Most ambitious feature set, cheapest scribe pricing, broadest specialty coverage, transparent pricing, Y Combinator backed.  
**Weaknesses:** Rougher polish (typos on homepage), rebrand from ScribeHealth incomplete, complex navigation overwhelms, "agent" metaphor may confuse traditional clinicians, no SOC 2, most testimonials feel templated.

---

## Gap Analysis: What NONE of Them Offer

### 🔴 Rehabilitation (PT/OT/SLP)
- **Freed:** No rehab specialty pages or templates
- **Twofold:** Has PT Evaluation Form and OT/SLP Goals templates (content marketing only — not deep workflow support)
- **HealOS:** No rehabilitation specialties listed
- **Gap:** No competitor offers rehab-specific note types (daily notes with functional outcome measures, initial evaluations with standardized tests, discharge summaries with goal attainment, group therapy notes for rehab settings)

### 🔴 Deep Behavioral Health Workflows
- **Freed:** Basic Psychiatry and Mental Health pages, no BH-specific templates visible
- **Twofold:** Best BH template library but limited to note generation — no treatment plan automation, no outcome tracking tied to sessions, no group note workflows
- **HealOS:** Basic therapy and psychiatry support
- **Gap:** None offer integrated BH treatment planning → progress note → outcome measurement workflows. None handle group therapy notes where one session generates notes for multiple patients. None integrate PHQ-9/GAD-7/PCL-5 scoring into note generation.

### 🔴 Multi-Disciplinary Team Documentation
- None support coordinated documentation across disciplines (e.g., PT + OT + SLP + physician in an inpatient rehab setting)
- No shared treatment plan features
- No inter-disciplinary progress note coordination

### 🔴 Outcome Measurement Integration
- No competitor integrates standardized outcome measures (FIM scores, DASH, Oswestry, PHQ-9 trending) into the documentation workflow
- Twofold has "patient progress tracking" but it appears to be session-over-session note comparison, not clinical outcome measurement

### 🔴 Authorization/Compliance for Rehab
- No competitor automates the documentation requirements for rehab authorizations (functional limitation reporting, medical necessity documentation, progress toward goals as required by CMS/insurance)
- HealOS has generic prior auth but not rehab-specific

### 🔴 Supervision/Training Documentation
- None offer clinical supervision note templates (important for LCSWs, LMFTs, CFYs, COTAs, PTAs working under supervision)

---

## Recommendations for OmniScribe to Differentiate

### 1. Own Rehabilitation
No one is building for PT/OT/SLP. Build rehab-specific note types with:
- Functional outcome measure integration (FIM, DASH, Berg Balance, etc.)
- Initial eval → daily note → progress note → discharge summary workflows
- G-code/modifier support for CMS compliance
- Group therapy documentation (1 session → multiple patient notes)

### 2. Go Deep on Behavioral Health (Beyond Twofold)
Twofold has templates. OmniScribe should have **workflows:**
- PHQ-9/GAD-7/PCL-5 auto-scoring integrated into session notes
- Treatment plan → progress note alignment (auto-populate objectives/interventions)
- Group therapy notes with individual patient customization
- Supervision notes for pre-licensed clinicians
- EMDR, DBT, CBT protocol-specific documentation flows

### 3. Be the Multi-Disciplinary Choice
Build for teams that include multiple provider types:
- Shared treatment plans across disciplines
- Role-based note templates (physician vs. therapist vs. nursing)
- Coordinated care documentation for rehab facilities, SNFs, community MH centers

### 4. Price Transparently at the Twofold/HealOS Level
Freed's hidden pricing creates an opening. Price at $49-79/mo with clear feature tiers. Make it easy for individual clinicians to buy. Offer group pricing prominently.

### 5. Build a Public Template Library
Twofold's template library is a massive SEO asset. OmniScribe should launch with 50+ public templates, especially in rehab and BH — categories where Twofold is thin on actual clinical depth (their templates are content marketing articles, not deep clinical tools).

### 6. Integrate Outcome Measures as a Core Feature
This is the biggest missing piece across all competitors. Clinicians need outcome data for:
- Insurance authorization
- Treatment plan justification
- Clinical decision-making
- Value-based care reporting

No competitor does this. First mover advantage is available.

### 7. Get SOC 2 Certified
Only Freed has SOC 2 Type II. This matters for enterprise sales and immediately puts OmniScribe above Twofold and HealOS in trust signals. Pursue this early.

---

## Appendix: Data Collection Methodology

All data collected February 12, 2026 via live website browsing using automated browser tool. Pages visited:
- **Freed:** Homepage, /features, /ehr-push, /specialty/clinicians, FAQ
- **Twofold:** Homepage (single-page with all sections), /templates (full library), /specialties/behavioral-health
- **HealOS:** Homepage, /pricing, /integrations

No accounts were created. All observations based on publicly visible content.
