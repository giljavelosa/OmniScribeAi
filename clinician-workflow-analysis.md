# AI Medical Scribe Clinical Workflow Analysis
## From the Trenches: What Actually Happens When Exhausted Clinicians Use These Tools

**Analysis Date:** February 12, 2026  
**Perspective:** Practicing clinicians across specialties  
**Platforms Evaluated:** Freed · Twofold · HealOS · OmniScribe  

---

> *"I don't need a tech demo. I need to go home."*  
> — Every clinician at 7PM with unfinished charts

---

## Table of Contents

1. [Scenario 1: The 7PM Documentation Marathon](#scenario-1-the-7pm-documentation-marathon)
2. [Scenario 2: The New Grad PT Drowning in Documentation](#scenario-2-the-new-grad-pt-drowning-in-documentation)
3. [Scenario 3: The LCSW Between Sessions](#scenario-3-the-lcsw-between-sessions)
4. [Scenario 4: The ER Doc at 3AM](#scenario-4-the-er-doc-at-3am)
5. [Scenario 5: The Rural Clinic with One PA-C](#scenario-5-the-rural-clinic-with-one-pa-c)
6. [Scenario 6: The Psychiatrist Doing Medication Management](#scenario-6-the-psychiatrist-doing-medication-management)
7. [Scenario 7: The Multi-Disciplinary Rehab Team](#scenario-7-the-multi-disciplinary-rehab-team)
8. [The 3-Click Test](#the-3-click-test)
9. [The Exhaustion Test](#the-exhaustion-test)
10. [The Compliance Test](#the-compliance-test)

---

## Scenario 1: The 7PM Documentation Marathon

### Dr. Sarah Chen, MD — Family Medicine, 28 patients, 12 unfinished notes

It's 7:14 PM. Dr. Chen is sitting in her darkened office. The cleaning crew is vacuuming the waiting room. Her phone shows three missed texts from her husband and a photo of her kids eating dinner without her. She has twelve charts open in Epic — twelve patients she saw between 1 PM and 5:30 PM, all with nothing but a chief complaint and vitals entered by her MA. Her brain is oatmeal. She can't remember if Mrs. Rodriguez's knee was the left or the right.

This is pajama time. This is the documentation debt that burns out doctors.

**With Freed ($79–119/mo):**

If Sarah remembered to hit "Capture Conversation" before each visit — and that's the critical *if* — she's in decent shape. Freed was listening. It captured every visit in real time. Now, at 7 PM, she opens the Freed app and sees 16 completed notes waiting (the 16 afternoon patients she remembered to record). Each has a Visit Summary at the top — one paragraph she can scan in 10 seconds to remind herself: *right, Mrs. Rodriguez, bilateral knee pain, worse on stairs, discussed cortisone vs. PT referral.* The SOAP sections are pre-populated. She reads each note in 60–90 seconds, makes 2–3 edits per note (tweaks the Assessment wording, adds a detail she knows the AI missed because the patient whispered it), and clicks the copy button. If she's on the Premier tier ($119/mo), she pushes directly to Epic with EHR Push — that's maybe 3 clicks per note: review → edit → push. At the Core tier ($79/mo), she copies to clipboard and pastes into Epic, adding a step.

Sixteen notes done in about 30–40 minutes. Not great, but survivable.

But here's the gut punch: **she forgot to start recording on three patients.** Patient #19 (URI, straightforward), Patient #22 (diabetes follow-up, complex), and Patient #25 (new patient with anxiety and abdominal pain). For these three, Freed gives her nothing. Zero. She's back to manual documentation, reconstructing visits from memory at 7 PM with a brain that can barely spell "metformin." The diabetes follow-up alone — HbA1c trending, medication adjustments, foot exam findings, eye exam referral, dietary counseling — takes her 15 minutes to write from scratch. The new patient with two chief complaints takes 20 minutes. She doesn't get home until 8:15 PM.

Freed's "Resume" button could help if she catches the missed recording within the visit, but at 7 PM? That ship has sailed.

**With Twofold (~$50–100/mo, pricing opaque):**

Twofold's workflow is functionally identical to Freed during the recording phase — she'd need to click "Capture Conversation" before each visit. The same 3-patient miss happens. The difference is the output: Twofold generates notes into textarea boxes (clunkier editing than Freed's inline contenteditable fields), there's no Visit Summary for quick scanning, and there's no EHR integration. Every single note is copy → switch to Epic → paste → navigate to correct chart section → save. For 16 notes, that's 16 copy-paste cycles. If each takes 3 minutes instead of 1 minute (Freed's push), that's an extra 32 minutes.

No patient instructions are generated. No AI chat to ask "what did Mrs. Rodriguez say about her previous cortisone injection?" No post-visit letters. The notes themselves are usually good — Twofold's "learns your style" feature works — but the surrounding workflow is manual.

For the 3 missed recordings: same problem as Freed. Nothing.

**With HealOS ($39–79/mo):**

HealOS requires selecting or adding a patient before recording starts — slightly more structured, slightly more friction. The Chrome Extension is helpful if Sarah documents from a browser, but the workflow still depends on her remembering to initiate recording. For completed recordings, HealOS generates notes and can sync to select EHRs (Elation, Athena, eClinicalWorks, Charm Health) on the Pro tier. If Sarah happens to use one of those EHRs, this is a real advantage. If she uses Epic (which 40%+ of US clinicians do)? Copy-paste, same as Twofold.

The Dot Phrases feature is interesting for a power user, but at 7 PM, Sarah isn't configuring shorthand macros. She's surviving.

For the 3 missed recordings: nothing. But HealOS's patient management feature stores background history, so if she's seen Mrs. Rodriguez before in HealOS, she at least has prior context to reference. Small consolation.

**With OmniScribe (Framework stage — not yet a live recording app):**

Honest answer: OmniScribe can't help Sarah tonight. It doesn't record encounters yet. It doesn't generate notes from audio. What it has are evidence-based documentation frameworks — SOAP with 5 subtypes, 32–51 regulatory-sourced items each — that define *what should be in the note.* That's valuable for template design and compliance, but it doesn't solve the 7 PM problem.

Where OmniScribe *would* change the game, once it has a live scribe: its Established Patient Follow-Up subtype automatically structures the note to capture interval changes, medication reconciliation, chronic disease metrics, care gap analysis, and medical necessity documentation. When Sarah reviews that AI-generated note, the MDM complexity is already documented — supporting her E/M code selection — and the medical necessity section is pre-built. She doesn't have to remember to justify why she ordered the HbA1c. It's there because the framework requires it.

**Bottom line for 7 PM:** Freed wins this scenario today — fastest review, best edit UX, EHR push eliminates copy-paste cycles. The 3-patient recording gap is the universal failure mode that no platform has solved. Sarah still goes home late.

---

## Scenario 2: The New Grad PT Drowning in Documentation

### Jake, DPT — Outpatient Orthopedic Clinic, 14–16 patients/day

Jake graduated eight months ago. He's $180,000 in student loan debt, making $72,000/year, and spending 10–12 hours a week on documentation outside of patient care. His CI during clinicals said it would get faster. It hasn't.

Here's what Jake documents every day:

- **Initial Evaluations (2–3/day):** History, systems review, prior functional level, objective measures (ROM via goniometry, MMT grading 0–5, special tests like Lachman's/McMurray's/Empty Can), functional outcome measures (LEFS, NDI, ODI, DASH), assessment with short-term and long-term goals, treatment plan with frequency/duration, and — this is the part that kills him — the **medical necessity narrative** that insurance requires. He has to explain *why* skilled PT is needed, *what* the functional limitations are, and *why* the patient can't do this at home. If he doesn't nail this language, the claim gets denied and his clinic director gives him that look.

- **Daily Treatment Notes (10–12/day):** What he did (interventions with time in minutes), how the patient responded (objective and subjective), progress toward goals, skilled rationale for each intervention, and **8-minute rule documentation** (8 minutes of direct skilled contact per CPT code — if he bills 97110 × 3 units, he needs 23+ minutes of documented therapeutic exercise time, and Medicare will audit this).

- **Re-evaluations (1–2/week):** Updated outcome measures compared to initial eval, goal progression analysis, justification for continued care, updated plan with new goals.

**Can Freed handle this?**

No. Freed has 17 specialty templates. Not one is for Physical Therapy. There's no PT Initial Evaluation template, no Daily Note template, no Re-Eval template. If Jake uses Freed's generic SOAP template for a PT visit, the output will be structured around a physician's workflow — HPI, ROS, physical exam by organ system, medical decision-making. That's not wrong, but it's not *PT documentation.* There's no place for:

- ROM measurements in degrees (Knee flexion: 95°/130° — that fraction format matters)
- MMT grades (Quadriceps: 3+/5 — the plus/minus grading scale)
- Functional Outcome Measure scores (LEFS: 32/80 — and the MCID is 9 points, so Jake needs to show a 9-point change to justify continued care)
- 8-Minute Rule compliance (Total treatment time: 53 minutes | Direct skilled time: 38 minutes | Billable units: 4 — mapped to CPT 97110 × 2, 97140 × 1, 97530 × 1)
- FIM scores (if Jake works with post-surgical patients)
- Skilled vs. unskilled intervention distinction (insurance auditors live for this)

Freed will transcribe Jake saying "I did manual therapy to the lumbar spine for 12 minutes followed by therapeutic exercise focusing on core stabilization for 20 minutes" — but it won't organize that into 8-minute rule buckets, it won't calculate billable units, and it won't flag that Jake needs to document *why* core stabilization requires a licensed PT rather than a home exercise program.

**Can Twofold handle this?**

Twofold claims templates for physical therapy in their template library description. In their settings, "Physical Therapy" appears as a specialty option. But their actual template library — 60+ templates — is overwhelmingly mental health and medical. There's no specific PT Initial Evaluation, no PT Daily Note, no PT Re-Evaluation template. If Twofold generates a PT note from their generic medical template, Jake gets the same physician-oriented SOAP structure that doesn't capture rehab-specific data elements.

**Can HealOS handle this?**

No. HealOS's 26 predefined templates include nothing for rehabilitation. The "Generate Template" AI feature is interesting — Jake could theoretically describe what he needs and have AI create a template — but the AI doesn't know APTA documentation standards, CMS 8-minute rule requirements, or how to structure FIM scores. It would generate a reasonable-looking template that would fail an insurance audit.

**What Jake actually does right now:**

He uses WebPT or a similar rehab-specific EMR with built-in PT templates, and he types every single data element manually. ROM: type. MMT: type. Special tests: type. Goals: type. Interventions with times: type. Medical necessity narrative: type it from scratch every time, trying to remember the magic words that make United Healthcare happy ("Patient requires skilled PT intervention to address impaired knee flexion ROM limiting ability to descend stairs independently, which is required for safe community ambulation and return to prior level of function as a warehouse worker"). He copies and pastes from previous notes when he can, which means his documentation slowly drifts toward templated language that auditors flag as "cloned notes."

He gets home at 7:30 PM. He eats dinner. He opens his laptop at 8:30 PM and finishes notes until 10 PM. His girlfriend asks when this will get better. He doesn't know.

**How OmniScribe's rehab frameworks would change Jake's life:**

OmniScribe is building PT, OT, and SLP documentation frameworks grounded in APTA guidelines, CMS requirements, and validated outcome measures. Here's what that means for Jake:

- **PT Initial Evaluation subtype** with items specifically structured for: ROM by joint/movement/degrees, MMT by muscle group/grade, special test results by name/finding/interpretation, standardized outcome measures by instrument/score/interpretation, functional limitation inventory, prior level of function, rehab potential assessment, and a medical necessity narrative builder that knows the language insurance wants to see.

- **PT Daily Note subtype** with: CPT code–mapped intervention tracking (97110, 97140, 97530, 97535, 97542, etc.), time-per-intervention fields that auto-calculate against the 8-minute rule, skilled vs. unskilled distinction per intervention, patient response measures, and goal progress tracking tied to the initial eval's baseline.

- **PT Re-Evaluation subtype** with: side-by-side comparison of initial vs. current outcome measures, goal attainment scaling, updated medical necessity justification, continued-care rationale framework, and discharge planning criteria.

- **FIM scoring integration** for inpatient rehab, **FOTO outcomes** for outpatient, **CARE tool** for post-acute care — the actual instruments CMS and commercial payers expect.

- **8-minute rule calculator built into the framework** — Jake enters intervention times, the framework calculates billable units and flags if documentation doesn't support the billed codes.

No competitor has *any* of this. Not one. This is the gap where a new grad PT is spending 10+ hours a week typing, where insurance denials eat clinic revenue, and where documentation quality directly determines whether the clinic stays open.

**Bottom line for Jake:** Today, no AI scribe on the market can meaningfully help him. The entire rehab profession — 300,000+ PTs, OTs, and SLPs in the US — is underserved by every platform in this analysis. OmniScribe's rehab frameworks, once integrated into a live scribe, would be the first product to actually speak Jake's language.

---

## Scenario 3: The LCSW Between Sessions

### Maria, LCSW — Private Practice, 7 clients/day, back-to-back 50-minute sessions

Maria has 10 minutes between clients. Ten minutes to write a progress note, pee, check her phone, and take a breath before the next person walks in and tells her about their trauma. If she doesn't write the note now, she'll write it tonight, and by then she'll be mixing up which client said what about which coping skill.

Her documentation needs:
- **DAP notes** (Data, Assessment, Plan) for most sessions — what the client presented, her clinical assessment of their functioning and progress, and the plan going forward
- **BIRP notes** (Behavior, Intervention, Response, Plan) for some insurance panels — what she observed, what therapeutic interventions she used (CBT, DBT skills, motivational interviewing, EMDR processing), how the client responded, and next steps
- **Treatment plan updates** — when goals are met or modified
- **Risk assessments** — if a client endorses SI/HI, she needs to document the C-SSRS or equivalent screening, safety plan, and clinical rationale for disposition (continue outpatient vs. higher level of care)
- **42 CFR Part 2 compliance** — for her two SUD clients, federal law requires additional privacy protections beyond HIPAA. Notes cannot be shared without specific written consent, and documentation must track consent status

**Twofold — the mental health leader (20+ BH templates):**

Twofold is the strongest option for Maria right now. She can choose from DAP, BIRP, GIRP, PIRP, SIRP, DBT-specific, EMDR-specific, Couples Therapy, Biopsychosocial Assessment, and platform-specific templates (Simple Practice SOAP, Headway SOAP/Intake, Rula Intake/Therapy). If Maria uses Simple Practice as her EHR — and many private practice therapists do — the Twofold template is designed to match Simple Practice's note structure, reducing reformatting friction.

The DAP template captures the data section from the session recording, generates an assessment that reads like clinical language (not tech-speak), and outlines a plan. It's usually 70–80% accurate. Maria edits for 3–5 minutes. The problem: Twofold generates the note in textarea boxes. She can't collapse sections, can't use AI chat to ask clarifying questions, and must copy-paste to Simple Practice. Seven clients × copy-paste = 7 context-switches between apps per day.

For EMDR sessions specifically, Twofold's EMDR template captures the target memory, SUDS ratings, VOC scale, desensitization sets, and reprocessing content. This is genuinely useful — Maria doesn't have to reconstruct which set of bilateral stimulation triggered which cognitive shift. However, the template doesn't know the Adaptive Information Processing model deeply enough to structure the note around EMDR's 8-phase protocol. It captures *content* but not *clinical process.*

For DBT sessions, the DBT template captures skills discussed and homework review, but doesn't structure documentation around the four DBT modules (Mindfulness, Distress Tolerance, Emotion Regulation, Interpersonal Effectiveness) or track diary card data. Maria still has to manually note which specific skill was taught (e.g., TIPP, Opposite Action, GIVE/FAST) and whether it was didactic, behavioral rehearsal, or in-vivo practice.

**Freed — basic BH coverage:**

Freed has two behavioral health templates: "Mental and Behavioral Health" and "Psychotherapy." These are broad, catch-all templates. For Maria's DAP or BIRP notes, she'd need to edit the output to match the format her insurance panels expect. The "Learn my format" feature helps here — after editing 2–3 notes into DAP structure, Freed learns and applies it going forward. This is actually Freed's advantage: even though it starts with less BH depth than Twofold, it adapts to Maria's specific style faster.

The AI chat feature (Premier, $119/mo) is useful when Maria can't remember a detail: "What did the client say about their sleep this session?" and Freed can pull it from the transcript. That's worth real money during a 10-minute break.

Freed also generates patient instructions — which in a therapy context could be adapted to provide session summary handouts ("Today we worked on grounding techniques. Practice the 5-4-3-2-1 exercise daily."). No other platform does this for therapy.

**HealOS — minimal BH coverage:**

HealOS has an Intake Template and Utilization Review template for behavioral health, plus two Addiction Medicine templates. For Maria's daily progress notes? Nothing specific. She'd be using a generic SOAP template or building a custom one. The "Generate Template" AI could create a DAP template on demand, but it won't know that Maria's Medicaid panel requires specific therapeutic intervention language, or that her BCBS contract expects progress toward treatment plan goals referenced by goal number.

The Utilization Review template is actually relevant — Maria regularly has to submit treatment summaries to insurance for continued authorization. But it's just a template; it doesn't pull from her prior notes to auto-populate the review.

**42 CFR Part 2 — the elephant in the room:**

Maria has two clients in her SUD IOP who see her for individual therapy. Under 42 CFR Part 2, their substance use disorder records carry federal protections beyond HIPAA. Maria needs to:
1. Track consent-to-disclose forms separately
2. Ensure SUD-related information isn't shared without specific consent
3. Include the required federal restriction notice on any disclosed records
4. Potentially segment SUD documentation from general mental health notes

**Does any platform flag this?** No. Not Freed, not Twofold, not HealOS. None of them have 42 CFR Part 2 awareness. None prompt Maria to check consent status for SUD clients. None add the federal restriction notice to notes. None segment SUD documentation. Maria has to manage this entirely on her own, and if she makes a mistake, it's a federal violation.

Twofold's Substance Abuse ASAM templates (v3 and v4) come closest to acknowledging SUD-specific documentation, but they're clinical assessment templates, not privacy compliance tools.

**How OmniScribe's BH frameworks would be different:**

OmniScribe is building behavioral health frameworks with:
- **DAP, BIRP, and additional progress note formats** as subtypes — not just section headers, but item-level fields grounded in documentation standards (e.g., therapeutic intervention must include: modality used, specific technique, client engagement level, clinical rationale, and response)
- **DSM-5-TR integration** — diagnosis codes with specifiers, severity levels, and course modifiers structured into the assessment
- **Validated instrument tracking** — PHQ-9, GAD-7, PCL-5, C-SSRS, AUDIT, DAST-10, Columbia Suicide Severity Rating Scale — with scores, interpretation, and comparison to prior administration built into the framework
- **42 CFR Part 2 compliance flags** — the framework identifies SUD-related content and prompts for consent verification, adds required federal notices, and supports documentation segmentation
- **Treatment plan goal linkage** — progress notes reference specific treatment plan goals by number, tracking progress toward measurable objectives with timeline
- **EMDR 8-phase protocol structure** — not just content capture, but documentation organized around Target Selection, Desensitization, Installation, Body Scan, Closure, and Reevaluation phases with SUDS/VOC tracking
- **Risk assessment workflow** — C-SSRS screening triggered by endorsed ideation, structured safety planning documentation, disposition rationale with clinical justification, follow-up plan

This is regulatory-grade behavioral health documentation. It doesn't just record what Maria said — it structures the record to survive an insurance audit, a licensing board complaint, and a malpractice review.

**Bottom line for Maria:** Twofold is her best option today for template variety. Freed is best for workflow speed and the "learn my format" adaptation. Neither gives her compliance-grade documentation, and neither protects her SUD clients under federal law. OmniScribe's BH frameworks would be the first platform to treat behavioral health documentation as a regulatory discipline, not an afterthought.

---

## Scenario 4: The ER Doc at 3AM

### Dr. Raj Patel, MD — Emergency Medicine, 12-hour overnight, 22 patients

It's 3:17 AM. Dr. Patel has been awake for 21 hours. In the last 12 hours, he's managed a STEMI activation, intubated a COPD exacerbation, reduced a dislocated shoulder, repaired two lacerations (one forehead, one hand), placed three patients on psychiatric holds (5150s), admitted four patients to the hospitalist, treated a pediatric febrile seizure, and cleared nine patients with low-acuity complaints. His scrubs have betadine stains. He smells like hand sanitizer and stale coffee.

He needs documentation for all 22 patients. Here's the problem: *not all of them need the same kind of note.*

- **Admissions (4 patients):** Full H&P — chief complaint, HPI, ROS, past medical/surgical/family/social history, physical examination, ED workup results, assessment with differential diagnosis, disposition with admission rationale, handoff to hospitalist
- **Laceration repairs (2 patients):** Procedure Note — indication, consent, time-out, anesthesia used, wound description (length, depth, location, contamination), technique (simple vs. layered, suture type/size, number of sutures), complications, post-procedure status, wound care instructions, return precautions
- **Psychiatric holds (3 patients):** Risk assessment documentation — presenting danger, mental status exam, involuntary hold criteria, disposition to psychiatric emergency services, safety measures
- **Low-acuity discharges (9 patients):** SOAP notes — focused history, focused exam, medical decision-making, disposition with discharge instructions
- **Critical care (STEMI, intubation, seizure, shoulder reduction — 4 patients):** Detailed encounter notes with procedures, time-critical documentation, code team composition, medication administration times

That's at least three different documentation frameworks needed from a single shift.

**Freed — Emergency Medicine template:**

Freed has a dedicated Emergency Medicine template. For the 9 low-acuity discharges and the 4 admissions, this works reasonably well — the template is designed for the ED's rapid-fire, multi-system assessment style. If Dr. Patel remembered to start recording for each patient (a heroic assumption at 3 AM in a Level 1 trauma center), the notes generate quickly.

But here's where it falls apart:

- **The laceration repairs have no procedure note framework.** Freed's EM template generates a SOAP-style note that mentions "laceration repaired" in the Plan section. It doesn't generate a formal Procedure Note with pre-procedure assessment, informed consent documentation, wound description by length/depth/contamination class, anesthetic type/volume/route, suture material/size/technique, layer-by-layer closure description, intra-procedure findings, and post-procedure neurovascular status. Freed transcribes what Dr. Patel says — "I repaired a 4-cm laceration on the right forehead with 5-0 Prolene in simple interrupted fashion" — but it doesn't structure it as a Procedure Note with the required elements that Surgical CPT coding demands (12001–13160). If the billing coder can't find the wound length, location, and repair complexity, the claim gets downcoded or denied.

- **The psychiatric holds need risk assessment structure.** Freed captures the mental status exam elements mentioned during the encounter, but it doesn't organize them into a formal MSE (Appearance, Behavior, Speech, Mood, Affect, Thought Process, Thought Content, Perception, Cognition, Insight, Judgment) or structured danger assessment. It doesn't prompt for 5150/WIC 5150 hold criteria documentation. Dr. Patel has to manually restructure these notes.

- **No critical care time documentation.** For the STEMI and intubation, Dr. Patel may bill critical care codes (99291/99292), which require total critical care time documentation. Freed doesn't track this.

**Twofold — Emergency Dept Visit template:**

Twofold's "Emergency Dept Visit" template is a single template. One. For the entire range of ED encounters — from a sore throat to a cardiac arrest. It generates a reasonable ED note for straightforward visits, but it has the same gaps as Freed: no procedure note framework, no risk assessment structure for psych holds, and no way to differentiate a 3-minute low-acuity encounter from a 45-minute critical care resuscitation.

Twofold also has a 1.5-hour recording limit. In the ED, Dr. Patel may be managing overlapping patients — he starts the laceration repair, gets called to the trauma bay, comes back 20 minutes later to finish suturing. Twofold doesn't pause and resume across interruptions.

**HealOS — Focused Emergency Dept Visit template:**

HealOS has a "Focused Emergency Dept Visit" template — note the word "focused." This is designed for lower-acuity ED encounters. For the 9 straightforward discharges, it's fine. For complex admissions, multi-procedure encounters, or psych holds? Same limitations as the others. No procedure note. No risk assessment framework.

The Chrome Extension might help Dr. Patel document directly from the ED workstation browser, avoiding a separate app. But at 3 AM, he's not installing Chrome extensions.

**What OmniScribe brings to the ER:**

OmniScribe is the only platform with all three documentation frameworks Dr. Patel needs:

1. **SOAP** (Acute/Same-Day Visit subtype) for the 9 low-acuity discharges — focused, efficient, supports ED E/M coding (99281–99285)
2. **H&P** (Emergency Department H&P subtype) for the 4 admissions — comprehensive history, workup, assessment with differential, disposition with admission rationale, EMTALA compliance documentation
3. **Procedure Note** (Minor Office Procedure subtype) for the laceration repairs — indication, consent, timeout, anesthesia, wound description, technique, materials, complications, post-procedure status — all structured for surgical CPT coding

Additionally, OmniScribe's H&P framework includes a Consultation H&P subtype for when Dr. Patel calls the hand surgeon for the complex hand laceration — documenting what he asked, what the consultant said, and the agreed-upon plan.

No competitor covers all three encounter types from a single platform. Dr. Patel currently has to use one system for his notes and then free-text the procedure notes and psych documentation. OmniScribe's framework approach means the AI would know which template to apply based on the encounter type and generate documentation that meets the specific regulatory requirements for each.

**Bottom line for the ER at 3 AM:** Every platform fails Dr. Patel on procedure documentation. Freed's EM template is the least bad option for general ED notes, but it still produces SOAP-variant notes for encounters that need different structures. OmniScribe's multi-framework approach is built for exactly this scenario — once it has a live scribe engine to power it.

---

## Scenario 5: The Rural Clinic with One PA-C

### Alex, PA-C — Sole Provider, Rural Health Clinic, Population 3,400

Alex does everything. Monday she's managing hypertension and diabetes. Tuesday she's excising a skin lesion and doing well-child checks. Wednesday she sees a patient with anxiety and a patient with a workers' comp shoulder injury. Thursday she's interpreting a faxed radiology report and writing a referral to the orthopedist 90 miles away. Friday she's catching up on prior authorizations and returning patient calls.

She has one front desk person (part-time), no billing staff (she submits claims through her EHR's built-in biller), no IT support, and no admin. She bought her own laptop. Her internet is DSL, 15 Mbps on a good day.

**Setup and learning curve — who gets her charting faster?**

- **Freed:** Sign up, download app (or use browser), select specialty ("Family Medicine" is closest), start recording. Freed's onboarding is the simplest — 7-day free trial, no credit card. The "Learn my format" feature means Alex can do her first note, edit it to look the way she wants, and Freed learns from that single edit. By note #3, the output matches her style. **Time to first useful note: ~15 minutes.** The downside: Freed is only a scribe. It doesn't help with her prior auths, her fax management, her appointment scheduling, or her billing workflow.

- **Twofold:** Similar simplicity — free trial, enter patient name, select template, start recording. Twofold's template library gives Alex more options for different visit types (well-child, primary care, urgent care), but the learning curve is slightly steeper because she needs to browse templates and pick the right one for each encounter type. No EHR integration means copy-paste into whatever EHR she's using (likely Athena or eClinicalWorks for an RHC). **Time to first useful note: ~20 minutes.** Same limitation: scribe only.

- **HealOS:** Here's where it gets interesting for Alex. HealOS isn't just a scribe — it's an AI Receptionist (answers her phone when she's with patients), fax automation (processes incoming referrals and lab reports), insurance verification (checks eligibility before the visit), and scribe. For a solo provider who has no staff to answer phones, process faxes, or verify insurance, this is genuinely valuable. The scribe is the cheapest tier ($39/mo), but the platform pricing adds up: Scribe ($39) + Receptionist ($39) + Insurance ($79) = $157/mo. That's significant for a rural PA-C, but if it replaces 10+ hours/week of admin work, it's a bargain compared to hiring a part-time admin at $18/hour.

  Setup is harder though — HealOS requires patient selection before recording, which is more structured. The Chrome Extension needs configuration. The AI Receptionist requires scripting and phone number routing. Alex needs a Saturday afternoon to set this up, and there's no IT person to call when the EHR integration throws errors. **Time to first useful note: ~45 minutes.** But the platform payoff is broader.

- **OmniScribe:** Not yet available as a live tool. Alex can't use it today.

**Breadth of visit types — who handles the range?**

Alex sees: primary care, pediatric well visits, minor procedures, behavioral health screenings (PHQ-9, GAD-7), workers' comp evaluations, pre-employment physicals, and chronic disease management.

| Visit Type | Freed | Twofold | HealOS |
|---|---|---|---|
| Primary care follow-up | ✅ | ✅ | ✅ |
| Pediatric well-child | ✅ (Peds template) | ✅ (Well-Child template) | Generic |
| Skin lesion excision | ❌ No procedure note | ❌ No procedure note | ❌ No procedure note |
| Behavioral health screening | ✅ (MH template, basic) | ✅ (20+ BH templates) | ✅ (Intake template) |
| Workers' comp eval | ❌ | ❌ | ❌ |
| Pre-employment physical | ❌ | ❌ | ❌ |
| Chronic care management | ✅ (generic) | ✅ (generic) | ✅ (generic) |

None of them cover workers' comp evaluations (which require specific impairment rating, work restriction, and causation language) or pre-employment physicals (DOT physical forms, for instance). None have procedure note frameworks for the skin lesion excision.

**Cost sensitivity — best value for a solo rural provider:**

- **HealOS Basic Scribe: $39/mo** — cheapest, unlimited sessions, but bare-bones (no EHR sync)
- **Freed Starter: $39/mo** — only 40 notes/month (Alex sees 60–80 patients/month, so she'd blow through this in two weeks)
- **Freed Core: $79/mo** — unlimited notes but no EHR push, no ICD-10 coding
- **Twofold: ~$50–100/mo** — pricing isn't transparent, which is already a negative for a cost-conscious solo provider
- **HealOS Pro Scribe: $79/mo** — unlimited notes + EHR sync (if Alex uses Athena/Elation/eCW)

For scribe-only: **HealOS at $39/mo** with unlimited sessions is the best value. For full practice support, **HealOS's combined platform** (even at $157/mo) may be the best investment for a solo provider drowning in admin.

**Bottom line for rural Alex:** HealOS's broader platform solves more of her problems than any competitor's scribe-only approach. But every platform leaves gaps in procedure documentation, workers' comp, and pre-employment physicals. The scribe market is built for the 15-minute primary care visit. Rural medicine doesn't fit in that box.

---

## Scenario 6: The Psychiatrist Doing Medication Management

### Dr. Aisha Williams, MD — Psychiatry, 20+ patients/day, 15-minute med checks

Dr. Williams runs a med management factory. Every 15 minutes, a patient sits down, she reviews their medications, asks about side effects, does a brief MSE, adjusts doses, refills prescriptions, and moves on. She needs a note for each — but not a therapy note. A med management note is its own animal:

- **Brief interval history** — "Since last visit 4 weeks ago, patient reports improved sleep with trazodone 50mg, continued anxiety despite sertraline 150mg, no return of suicidal ideation"
- **Medication review** — Every active psych med with dose, frequency, duration, adherence, and side effects. Plus any non-psych meds that interact (she's watching that her patient on lithium isn't also taking an NSAID from their PCP)
- **Mental Status Exam** — At minimum: appearance, behavior, speech, mood (patient's words), affect (her observation), thought process, thought content (SI/HI/delusions), cognition, insight, judgment
- **Updated diagnosis** — DSM-5-TR code with specifiers (F33.1 Major Depressive Disorder, recurrent, moderate — not just "depression")
- **Medication changes with rationale** — "Increasing sertraline from 150mg to 200mg daily for residual generalized anxiety symptoms; augmenting with buspirone 5mg BID for partial SSRI response per APA guidelines"
- **Lab monitoring** — Lithium level, CBC/CMP for valproate, metabolic panel for antipsychotics, QTc for certain medications

She does 20+ of these daily. Each note needs to be accurate, specific, and fast.

**Freed's Psychiatry template:**

Freed has a dedicated Psychiatry template. It captures the visit conversation and structures it into psychiatric format. The "Learn my format" feature is critical here — Dr. Williams can edit her first note to include her preferred MSE format, her medication table layout, and her rationale documentation style, and Freed learns it.

For 15-minute visits, Freed is fast. Start recording, have the conversation, stop recording, review the note in ~60 seconds, edit 1–2 things, push to EHR. The ICD-10 coding feature (Premier tier) is especially valuable — it suggests F33.1 instead of making Dr. Williams look it up.

Limitations: Freed doesn't generate a structured MSE — it extracts mental status observations from the conversation, which depends on Dr. Williams mentioning each element aloud. If she doesn't verbally note the patient's appearance and speech (because it's obviously normal), Freed omits it. But many insurance payers require all MSE domains documented, even if normal. Dr. Williams has to either narrate "appearance is well-groomed, behavior is cooperative, speech is normal rate and rhythm" during every visit — which feels ridiculous — or manually add it to every note.

Freed also doesn't track medication changes over time. Each note is generated independently. If Dr. Williams wants to reference "we increased sertraline from 100 to 150 at the last visit" — Freed's AI chat (Premier) can search prior notes, but it doesn't auto-populate a medication timeline.

**Twofold's Psychiatric Medication Management template:**

This is the most specific template any competitor offers for med management. Twofold built a dedicated "Psychiatric Medication Management" template separate from their general Psychiatry, Psychiatric Evaluation, and Psychotherapy templates. It's designed for exactly Dr. Williams's workflow: brief history, medication review, MSE, diagnosis update, medication changes.

The template structures the note around medication-focused sections rather than therapy-focused ones. This is meaningfully better than forcing a therapy SOAP note into med management format. Twofold's 20+ mental health templates mean Dr. Williams can also switch to a Psychiatric Evaluation template for new patients or a Biopsychosocial template for complex diagnostic workups.

Limitations: No EHR integration (copy-paste for every note), no ICD-10 coding, no AI chat for cross-session context. For 20+ notes/day, the copy-paste tax adds up: 20 notes × 1 extra minute = 20 minutes of wasted time daily.

**HealOS — no specific psych med management template:**

HealOS doesn't have a dedicated psychiatric medication management template. Their template library skews toward general medical use. Dr. Williams would need to build a custom template using HealOS's template tools or the "Generate Template" AI. The result would work, but it requires effort to create and might miss nuances that Twofold's purpose-built template captures.

HealOS's Dot Phrases could be useful for Dr. Williams — she could create shortcuts like `.msenl` to expand "MSE: Appearance: well-groomed, appropriate dress. Behavior: cooperative, good eye contact. Speech: normal rate, rhythm, and volume. Mood: [patient report]. Affect: [observation]. Thought Process: linear, goal-directed. Thought Content: denies SI/HI, no delusions or obsessions. Perception: denies AH/VH. Cognition: alert, oriented ×3. Insight: fair. Judgment: fair." That's a power user workflow that saves time once configured.

**OmniScribe BH framework — Medication Management subtype:**

OmniScribe's behavioral health framework includes a Medication Management subtype with items specifically structured for:

- **Medication reconciliation table** — every active medication with dose, frequency, start date, prescriber, adherence rating, and documented side effects
- **MSE with all domains** — pre-structured so no domain is accidentally omitted (Appearance, Behavior, Psychomotor, Speech, Mood, Affect, Thought Process, Thought Content, Perceptual Disturbances, Cognition, Insight, Judgment — all with standardized descriptors)
- **DSM-5-TR diagnostic formulation** — primary diagnosis with code and specifiers, comorbid conditions, severity rating, and change from prior assessment
- **Medication change rationale** — linked to evidence-based guidelines (APA Practice Guidelines, CANMAT, TMAP) with documentation of why this medication, why this dose, why now
- **Metabolic monitoring** — tracking weight, BMI, fasting glucose, lipid panel, A1c for patients on antipsychotics (per APA/ADA consensus guidelines)
- **Treatment response rating** — standardized measurement of improvement (PHQ-9 change, GAD-7 change, AIMS for tardive dyskinesia screening, BARS for akathisia)
- **Risk assessment** — C-SSRS or equivalent, with structured documentation of risk factors, protective factors, and risk level determination

The framework doesn't just record what happened — it ensures every element that a licensing board, insurance auditor, or malpractice attorney would look for is present, structured, and sourced.

**Bottom line for Dr. Williams:** Twofold's dedicated Psychiatric Medication Management template is the best option today for the specific encounter type. Freed wins on workflow speed and EHR integration. OmniScribe's framework would provide the deepest, most compliance-ready documentation — but it needs a live engine to deliver it.

---

## Scenario 7: The Multi-Disciplinary Rehab Team

### Riverside Rehabilitation Center — PTs, OTs, SLPs, and a PM&R Physician, Same Patient

Mr. James Henderson, 64, is 10 days post-left total knee arthroplasty with a complicated recovery — wound healing issues, pre-existing diabetes affecting tissue repair, and deconditioned from 3 months of limited mobility pre-surgery. He's seen by four disciplines daily:

- **PT (Dr. Amanda Torres, DPT):** Working on knee ROM (currently 65° flexion, goal 120°), quad strength (MMT 3/5, goal 4+/5), gait training (currently FWW for 50 feet, goal independent ambulation >300 feet), stair negotiation, and transfer training.
- **OT (Rachel Kim, OTR/L):** Working on ADL independence — lower body dressing (currently requires moderate assist for sock/shoe donning), bathing (tub transfer with grab bar, currently min assist), kitchen tasks (standing tolerance 5 minutes, goal 20 minutes), and adaptive equipment training.
- **SLP (David Okafor, MS, CCC-SLP):** Addressing post-intubation dysphagia from his brief ICU stay — currently on IDDSI Level 5 (minced & moist) diet with thin liquids, MBS showed mild pharyngeal residue with delayed swallow initiation. Also cognitive-linguistic screening due to reported "brain fog" post-anesthesia.
- **PM&R Physician (Dr. Lisa Park, MD):** Overseeing the rehabilitation program, managing pain (transitioning from opioids to multimodal regimen), monitoring wound healing, coordinating with the orthopedic surgeon, determining discharge disposition (home with home health vs. skilled nursing facility), and justifying continued inpatient rehab stay to insurance.

**The documentation nightmare:**

Every discipline documents independently. PT writes a PT eval and daily notes. OT writes OT eval and daily notes. SLP writes SLP eval and daily notes. PM&R writes the H&P, daily progress notes, and team conference documentation. They all use FIM scores — but each discipline tracks different FIM domains (PT tracks locomotion and transfers, OT tracks self-care, SLP tracks communication and swallowing). The IRF-PAI (Inpatient Rehabilitation Facility Patient Assessment Instrument) — required by CMS for all inpatient rehab facilities — demands coordinated FIM scoring across all disciplines at admission, interim, and discharge.

Here's what happens in practice: PT documents "Bed mobility: FIM 4 (minimal assistance)." OT documents "Bed mobility: FIM 5 (supervision)." They assessed the same patient on the same day. The discrepancy creates a compliance problem — which FIM score goes on the IRF-PAI? They have to talk to each other, reconcile, and agree. This happens for every FIM domain, and it happens at admission, at each team conference, and at discharge.

No one has time for this. The documentation burden for a multi-disciplinary rehab team is staggering. Each therapist spends 30–45 minutes per patient per day on documentation. For a 16-patient caseload, that's 8–12 hours of documentation per therapist per day. In an 8-hour workday that also includes 5–6 hours of direct patient care. The math doesn't work. Everyone stays late. Burnout in rehab is epidemic.

**Can any competitor handle this?**

No. Let's be precise about why:

- **Freed:** No rehab templates of any kind. No FIM scoring. No understanding of PT/OT/SLP scopes of practice. No multi-provider coordination features (Shared Patients is in alpha, and it's designed for physician-to-physician handoffs, not multi-disciplinary team documentation). Would generate generic medical SOAP notes that don't include ROM measurements, MMT grades, functional mobility levels, or ADL performance ratings.

- **Twofold:** Lists "Physical Therapy" and "Occupational Therapy" as specialties in settings, but has no actual rehab-specific templates. No SLP templates at all. No FIM scoring. No multi-provider features. Would generate the same generic SOAP note for all four disciplines.

- **HealOS:** No rehab templates. No FIM scoring. No multi-provider coordination. The broader platform (receptionist, insurance, fax) is designed for outpatient clinics, not inpatient rehab facilities. Irrelevant to this scenario.

The current market solution: rehab-specific EMRs like Net Health (formerly ReDoc/Optima), Casamba, or Meditech's rehab module. These have PT/OT/SLP templates with FIM scoring, but they're expensive ($200–500+/provider/month), clunky, and — critically — they don't have AI scribing. Therapists still type everything manually.

**How OmniScribe's framework approach would enable this:**

OmniScribe is building separate PT, OT, and SLP documentation frameworks, each with discipline-specific data elements:

- **PT Framework:** ROM by joint (goniometric measurements), MMT by muscle group (0–5 with ± modifiers), functional mobility levels (bed mobility, transfers, gait with device/distance/assist level), balance assessments (Berg, Tinetti, DGI), outcome measures (LEFS, TUG, 6MWT, 10MWT), 8-minute rule compliance, and medical necessity for skilled PT.

- **OT Framework:** ADL performance ratings (FIM or other standardized), IADL assessments, UE functional assessments (grip/pinch strength, 9-Hole Peg Test, Box and Block), cognitive-perceptual screening, adaptive equipment recommendations, home safety evaluation, and medical necessity for skilled OT.

- **SLP Framework:** Dysphagia severity (IDDSI diet level, aspiration risk), MBS/FEES findings, cognitive-linguistic assessments (CLQT, RIPA, SCATBI), aphasia classification (WAB-R), voice parameters, AAC recommendations, and medical necessity for skilled SLP.

The breakthrough is the **shared outcome measures.** OmniScribe's frameworks use FIM as a common language across disciplines:

- FIM Self-Care (OT-primary): Eating, Grooming, Bathing, Dressing Upper, Dressing Lower, Toileting
- FIM Sphincter Control (nursing/OT): Bladder Management, Bowel Management
- FIM Transfers (PT/OT): Bed/Chair/Wheelchair, Toilet, Tub/Shower
- FIM Locomotion (PT): Walk/Wheelchair, Stairs
- FIM Communication (SLP): Comprehension, Expression
- FIM Social Cognition (SLP/OT): Social Interaction, Problem Solving, Memory

When PT documents "Transfers: Bed/Chair — FIM 4" in the PT framework, that score is structured data that the PM&R physician's team conference note can reference directly. When OT documents "Self-Care: Dressing Lower — FIM 3," that's structured data that feeds the IRF-PAI. There's no score discrepancy because the framework defines the scale, the scoring criteria, and the responsible discipline for each domain.

The PM&R physician's framework pulls from all three discipline frameworks to create:
- **Team Conference Documentation** — integrated progress summary across PT, OT, SLP with shared FIM trending
- **Continued Stay Justification** — using multi-disciplinary progress data to demonstrate medical necessity for ongoing inpatient rehab (the "3-hour rule" — patient must tolerate 3 hours of therapy daily, documented across disciplines)
- **Discharge Planning** — integrated functional status across all domains to determine appropriate discharge disposition

This is *coordination infrastructure*, not just a template. No competitor is even attempting it.

**Bottom line for the rehab team:** The multi-disciplinary rehab documentation problem is completely unsolved by every AI scribe on the market. OmniScribe's framework approach — with discipline-specific data elements sharing a common outcome measurement language — is architecturally designed for this exact challenge. It's the use case that would make rehab facilities say "we've been waiting for this."

---

## The 3-Click Test

*Minimum actions to complete each task, measured by distinct user inputs (click, keystroke, or selection).*

| Task | Freed | Twofold | HealOS | OmniScribe |
|------|-------|---------|--------|------------|
| **1. Start recording a new visit** | 3 (select patient → select template → click Capture) | 4 (enter patient name → select template → select modality → click Capture) | 2 (search patient → select patient [auto-starts]) | N/A |
| **2. Review a completed note** | 2 (click note from list → read) | 2 (click note from list → read) | 2 (click session → read) | N/A |
| **3. Copy note to clipboard** | 1 (click "Copy all" button) | 1 (click "Copy All" button) | 1–2 (click Copy or manual select) | N/A |
| **4. Switch templates** | 1 (dropdown change in note view) | 2 (navigate to Templates → select new template) | 2 (navigate to Templates → select new template) | N/A |
| **5. Edit a section** | 1 (click inline, type) | 2 (click textarea → type → Save Changes) | 2 (click section → type → save) | N/A |
| **6. Generate patient instructions** | 0 (auto-generated with note, Premier tier) | ❌ Not available | ❌ Not available | N/A |
| **7. Access the transcript** | 1 (click Transcript tab) | 1 (click "Tx" button) | 1–2 (scroll/click transcript section) | N/A |
| **8. Start 2nd visit immediately** | 2 (click + New Visit → Capture) | 3 (close note → enter new patient → Capture) | 2 (click + New Visit → select patient) | N/A |

### Analysis:

**Freed has the lowest total friction.** The inline editing (click-and-type, no separate Save button), auto-generated patient instructions, and tab-based navigation minimize the action count. The template dropdown *within the note view* means you don't have to navigate away to switch templates. For a clinician doing 20+ notes/day, saving 1 click per task × 8 tasks × 20 notes = 160 fewer clicks per day. That's real.

**Twofold's textarea editing adds one extra step per section edit** (you have to click Save Changes after editing). For 5 sections per note × 20 notes = 100 extra Save clicks per day. Minor in isolation, maddening in aggregate.

**HealOS's patient-first workflow** means you can't quick-start a recording without selecting/adding a patient. This adds friction for clinicians who want to hit Record immediately and enter patient info later. But if patient context is already in the system, it's actually faster (2 clicks to start).

**The verdict:** At 7 PM with 12 notes to finish, Freed's UI requires the least cognitive overhead per interaction. Each task is 1–3 actions. There's no "did I save?" anxiety (auto-save). There's no "where's the copy button?" hunting (it's always top-right). The UI respects the fact that you're barely functional.

---

## The Exhaustion Test

*When you can barely keep your eyes open, which platform is least likely to make your life worse?*

### Most Forgiving of Mistakes

**Winner: Freed**

- **Resume recording:** If you accidentally stop recording mid-visit, Freed has a Resume button. No other platform offers this. At 3 AM in the ER, accidentally tapping Stop instead of muting your phone is a real scenario.
- **Magic Edit + AI Chat:** Made a mistake in the note? Don't retype — tell Freed in natural language: "Remove the part about chest pain, I mixed up this patient with the last one." Freed edits it. This is enormously forgiving for exhausted clinicians making errors.
- **Auto-save:** Notes save continuously. There's no Save button to forget. Freed shows "Saved seconds ago" as a constant reassurance.

**Runner-up: Twofold** — Autosave exists, but no Resume recording and no AI-assisted editing (only Magic Edit for note reformatting, not conversational correction).

**Worst: HealOS** — More structured workflow means more opportunities to make a wrong selection. The patient-first recording model means if you record under the wrong patient, you may need to start over.

### Least Cognitive Load

**Winner: Freed**

- The Visit Summary at the top of each note is a one-paragraph jog of memory. When you can't remember what happened during a visit 4 hours ago, this is a lifeline.
- Template switching is a dropdown, not a navigation event.
- Pronouns are set once and apply to all notes for that patient.
- The color scheme is muted — no bright alerts or badges competing for attention at midnight.

**Runner-up: Twofold** — Clean UI, calm blue/white design, simple layout. But the absence of a Visit Summary means the clinician has to read the full Subjective section to reconstruct the encounter.

**Worst: HealOS** — More features = more cognitive load. The sidebar includes Scribe, Receptionist, Configure, Chrome Extension, Trash, and Account Settings. At 3 AM, I don't want to think about which icon takes me where.

### Best "Undo" or "Resume" Capabilities

**Winner: Freed**

- Resume recording after accidental stop
- Magic Edit for note changes (can undo entire sections conversationally)
- AI Chat for questioning/correcting note content
- Auto-save prevents data loss from browser crashes or accidental closes

**Runner-up: Twofold** — Magic Edit exists but is less conversational. Notes auto-save. No recording resume.

**Worst: HealOS** — No Resume recording visible. Template-driven workflow means changes require re-generating. Limited undo capabilities documented.

### Hardest to Accidentally Lose Work

**Winner: Tie — Freed and Twofold**

Both auto-save notes and both permanently store generated notes (never auto-delete). Freed stores transcripts. Twofold claims recordings are never stored (deleted immediately after note generation), which means if the note generation fails, the recording is gone.

**Concern with all platforms:** If you close the browser tab during recording, what happens? Freed and Twofold both use web-based recording — a closed tab likely kills the recording. Neither has a strong "recording in progress — are you sure you want to close?" warning documented. HealOS's Chrome Extension may be slightly more resilient since it runs as an extension, not a tab.

### Overall Exhaustion Test Ranking:

| Rank | Platform | Exhaustion Score | Why |
|------|----------|-----------------|-----|
| 1 | **Freed** | 9/10 | Resume recording, AI editing, auto-save, Visit Summary, low cognitive load |
| 2 | **Twofold** | 7/10 | Clean UI, auto-save, good BH templates, but no resume and no AI chat |
| 3 | **HealOS** | 5/10 | More complex UI, more features competing for attention, patient-first friction |
| 4 | **OmniScribe** | N/A | Not yet a live platform — can't be tested for exhaustion tolerance |

---

## The Compliance Test

*Will the note generated by each platform survive an insurance audit, a coding review, and a malpractice claim?*

### Does the note output meet E/M documentation requirements?

| Requirement | Freed | Twofold | HealOS | OmniScribe Frameworks |
|---|---|---|---|---|
| HPI elements (location, quality, severity, duration, timing, context, modifying factors, associated signs) | Captured from conversation (variable completeness) | Captured from conversation (variable completeness) | Captured from conversation (variable completeness) | All 8 HPI elements explicitly defined as framework items with format templates |
| ROS (14 systems) | Partial — captures what's discussed, omits systems not mentioned | Partial — same limitation | Partial — same limitation | All 14 systems enumerated per CMS 1997 guidelines with positive/negative documentation structure |
| Physical Exam documentation | Captures mentioned exam findings | Captures mentioned exam findings | Captures mentioned exam findings | Multi-system exam items structured by CMS 1995/1997 guidelines with organ system–specific elements |
| MDM complexity (Number of Problems, Data, Risk) | Not explicitly scored — note content implies MDM level | Not scored | Not scored | MDM documented per AMA CPT 2021 table with number/complexity of problems, data reviewed/ordered, and risk level explicitly stated |
| Time-based billing support | No time tracking | No time tracking | No time tracking | Total time and counseling/coordination time documented as framework items with CPT 99417 prolonged services flagging |

**Verdict:** Every current AI scribe generates notes from conversation transcripts. If the clinician doesn't *say it*, it doesn't appear in the note. This means E/M compliance is dependent on the clinician's verbal completeness during the visit — not the platform's documentation intelligence. If Dr. Chen doesn't mention the respiratory, GI, and GU review of systems aloud, no platform documents them. The note may support a 99213 when the encounter really warranted a 99214, leaving revenue on the table.

OmniScribe's framework approach is structurally different: the framework *defines* what must be documented. If the AI engine hears enough information to support a 99214, it populates the required elements and flags gaps. If the clinician didn't mention ROS for 10+ systems, the framework flags it: "ROS incomplete for 99214 billing — 10+ systems required."

### Is medical necessity documented?

| Platform | Medical Necessity Documentation |
|---|---|
| **Freed** | Not explicitly structured. Assessment and Plan may implicitly document necessity, but there's no dedicated medical necessity section or language. |
| **Twofold** | Not structured. Notes are organized by SOAP/DAP/BIRP sections — medical necessity is buried in the Assessment if present at all. |
| **HealOS** | Not structured. Generic templates don't include medical necessity prompts. |
| **OmniScribe** | **Every framework includes a dedicated Medical Necessity section** with items for: clinical indication with supporting data, functional impact documentation, why this intervention/this patient/this time, prior conservative treatment and response, and expected outcome with timeline. Sourced from CMS LCD/NCD requirements. |

Medical necessity is the #1 reason claims get denied. The clinician has to document *why* the service was medically necessary — not just *what* they did. "Patient has knee pain" is not medical necessity. "Patient presents with progressive left knee osteoarthritis (ICD-10 M17.11) with functional limitation to <1 block ambulation distance, failure of 6 weeks conservative management (NSAIDs, physical therapy per discharge summary dated 12/1/25), now limiting ability to perform essential job functions as a warehouse worker, meeting criteria for intra-articular corticosteroid injection per ACR guidelines" — *that* is medical necessity.

No current AI scribe generates this language. They transcribe what the doctor says and organize it. OmniScribe's framework would prompt for each element and flag when the documentation is insufficient for the billed service.

### Are CPT/ICD-10 codes suggested?

| Platform | Coding Support |
|---|---|
| **Freed** | ✅ ICD-10 coding (Premier tier, $119/mo) — suggests codes from encounter context. CPT not explicitly mentioned. |
| **Twofold** | ❌ No coding support |
| **HealOS** | Mentioned in marketing ("ICD-10 diagnoses and CPT codes") but specifics unclear in the scribe product |
| **OmniScribe** | Frameworks include CPT code ranges per subtype (e.g., SOAP subtypes map to 99202–99215, Procedure Note subtypes map to specific surgical CPT ranges) and MDM-to-E/M level crosswalk — not yet live coding |

### Would the note survive an insurance audit?

An insurance audit examines:
1. Does the documentation support the billed code?
2. Is medical necessity documented?
3. Are time-based services (CCM, TCM, prolonged services) documented with sufficient specificity?
4. For procedures: indication, consent, technique, findings, complications?

| Audit Element | Freed | Twofold | HealOS | OmniScribe |
|---|---|---|---|---|
| Code-level documentation support | Medium — depends on conversation completeness | Medium — same dependency | Medium — same dependency | **High** — framework items map to specific billing requirements |
| Medical necessity | Low — not structured | Low — not structured | Low — not structured | **High** — dedicated section per framework |
| Time documentation | Not supported | Not supported | Not supported | **Supported** — total time, face-to-face time, counseling time as framework items |
| Procedure documentation | ❌ No procedure notes | ❌ No procedure notes | ❌ No procedure notes | **✅** Full procedure note framework (indication through complications) |

### Are regulatory sources cited?

| Platform | Source Citations |
|---|---|
| **Freed** | ❌ No citations. Notes are generated text. |
| **Twofold** | ❌ No citations. |
| **HealOS** | ❌ No citations. |
| **OmniScribe** | **✅ Every item cites its regulatory source** — AMA CPT 2021, CMS 1995/1997 Documentation Guidelines, CMS LCD/NCD, Joint Commission standards, APTA/AOTA/ASHA guidelines, DSM-5-TR, APA Practice Guidelines, CMS Conditions of Participation. The framework is a compliance reference document, not just a template. |

### Overall Compliance Ranking:

| Rank | Platform | Compliance Grade | Notes |
|------|----------|-----------------|-------|
| 1 | **OmniScribe** | A (framework design) | Every item evidence-sourced, medical necessity built-in, coding crosswalks, procedure documentation. Needs live implementation. |
| 2 | **Freed** | B- | ICD-10 coding helps. "Learn my format" can be trained toward compliant documentation. But no structural compliance enforcement. |
| 3 | **HealOS** | C+ | Claims ICD-10/CPT support. Broader platform helps with insurance workflow. But scribe compliance is template-dependent. |
| 4 | **Twofold** | C | Most templates but least compliance infrastructure. No coding, no medical necessity structure, no procedure notes. Great for content capture, weak for audit defense. |

---

## Summary: The Honest Truth

Here's what no one in this market wants to say:

**Every AI scribe on the market today is a transcription tool with a template on top.** They listen to conversations and organize what was said into clinical note format. They're good at this — remarkably good, actually. For a primary care physician doing straightforward follow-ups, any of these tools saves 1–2 hours per day. That's life-changing.

But transcription-with-templates has a ceiling:

1. **If the clinician doesn't say it, it's not in the note.** No platform adds clinical content that wasn't in the conversation. This means documentation completeness depends entirely on the clinician's verbal habits — and at 7 PM, those habits deteriorate.

2. **If the template doesn't have a field for it, it disappears.** A physician who performs a laceration repair and uses a SOAP template gets a note that mentions the laceration repair in passing. The wound length, suture type, layer-by-layer technique, and post-procedure neurovascular status — none of it is structured because the template doesn't ask for it.

3. **If the specialty isn't represented, the tool is useless.** 300,000+ rehabilitation professionals. 250,000+ behavioral health clinicians. Workers' comp evaluators. Pre-employment physical providers. They're all invisible to the current market.

4. **No one is doing compliance-grade documentation.** The notes look good. They read well. They save time. But ask a coding compliance officer to audit an AI-generated note against CMS 1997 documentation guidelines, and the gaps appear: missing ROS documentation, implicit (not explicit) MDM, absent medical necessity justification, no procedure note structure.

**OmniScribe's framework approach is architecturally different.** It doesn't start with "what did the clinician say?" It starts with "what does the regulation require?" and works backward to populate from the encounter. That's a fundamentally different value proposition — one that serves the clinician's documentation needs *and* the compliance requirements that determine whether they get paid.

The catch: OmniScribe needs a live recording engine to deliver on this promise. The frameworks exist. The regulatory sourcing is done. The specialty coverage is broader than any competitor. But until a clinician can walk into a room, tap Record, have a conversation, and get a framework-structured, compliance-graded, audit-ready note — it's an exceptional blueprint in a market that needs buildings.

The clinicians in these scenarios aren't waiting. They're charting tonight. They're burning out this month. They need help now.

The question for OmniScribe isn't *whether* the framework approach is better. It is. The question is whether it can get to market before the transcription-with-templates competitors build their own compliance layers — or before Jake the PT, Maria the LCSW, and Dr. Patel the ER doc give up and accept that documentation will always be the worst part of medicine.

---

*This analysis was written from clinical workflow experience, not product marketing. Platform capabilities were evaluated based on publicly available features, direct UI analysis, and published documentation as of February 2026. Pricing reflects published rates at time of analysis.*
