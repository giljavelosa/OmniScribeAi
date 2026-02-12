# OmniScribe AI — Provisional Patent Applications

**Prepared:** February 12, 2026
**Applicant:** [Applicant Name / Entity — To Be Completed]
**Attorney Docket No.:** [To Be Assigned]

---

# PATENT APPLICATION I

## FRAMEWORK-DRIVEN CLINICAL NOTE GENERATION SYSTEM AND METHOD

---

### 1. TITLE OF THE INVENTION

Framework-Driven Clinical Note Generation System and Method Using Regulatory-Sourced Documentation Requirements as Structured Artificial Intelligence Prompts

---

### 2. CROSS-REFERENCE TO RELATED APPLICATIONS

This application is related to co-pending U.S. Provisional Patent Application No. [TBD], entitled "Integrated Clinical Outcome Measurement and Documentation System," and co-pending U.S. Provisional Patent Application No. [TBD], entitled "Multi-Patient Individualized Documentation from Group Clinical Sessions," both filed concurrently herewith and incorporated herein by reference in their entirety. The present invention provides the foundational framework-driven note generation architecture upon which the outcome measurement system and group therapy documentation system are built.

---

### 3. FIELD OF THE INVENTION

The present invention relates generally to clinical documentation systems and, more particularly, to computer-implemented methods and systems for generating clinical documentation from audio recordings of clinical encounters using evidence-based, regulatory-sourced documentation frameworks that constrain and guide artificial intelligence output to ensure clinical completeness, billing compliance, and regulatory adherence.

---

### 4. BACKGROUND OF THE INVENTION

#### 4.1 The Clinical Documentation Crisis

Clinical documentation represents one of the most significant administrative burdens in modern healthcare. Physicians spend an estimated 1-2 hours on documentation for every hour of direct patient care. Rehabilitation therapists (physical therapists, occupational therapists, speech-language pathologists) and behavioral health clinicians (licensed clinical social workers, psychologists, counselors) face similar documentation burdens, with rehabilitation therapists reporting that documentation consumes 25-45% of their workday.

#### 4.2 Existing AI Scribe Technology and Its Limitations

The emergence of artificial intelligence-powered clinical documentation tools ("AI scribes") has attempted to address this burden. Existing systems in the market, including products marketed under trade names such as Freed, Twofold, and HealOS, utilize a common architectural approach: they record clinical encounters, transcribe the audio using automatic speech recognition (ASR), and then pass the transcript to a large language model (LLM) along with a template consisting of section headers.

For example, a typical prior art system for a SOAP (Subjective, Objective, Assessment, Plan) note provides the AI with a template consisting of four section headers — "Subjective," "Objective," "Assessment," and "Plan" — and instructs the AI to "fill in" each section from the transcript. This approach suffers from several critical deficiencies:

**(a) Lack of Granular Guidance.** Section-header templates provide no item-level guidance to the AI. The AI is free to include or exclude any clinical element within each section, leading to inconsistent documentation quality. A "Subjective" section may or may not include all required elements of the History of Present Illness (HPI) — onset, location, duration, character, aggravating/alleviating factors, timing, severity, and associated symptoms — as defined by the AMA CPT Evaluation and Management (E/M) Guidelines and CMS 1995/1997 Documentation Guidelines.

**(b) No Regulatory Grounding.** Existing systems do not tie documentation requirements to specific regulatory sources. Clinicians using these tools have no assurance that the generated note meets the documentation standards of CMS (Centers for Medicare & Medicaid Services), the Joint Commission, the AMA (American Medical Association), APTA (American Physical Therapy Association), AOTA (American Occupational Therapy Association), ASHA (American Speech-Language-Hearing Association), APA (American Psychiatric Association), SAMHSA (Substance Abuse and Mental Health Services Administration), ASAM (American Society of Addiction Medicine), or other governing bodies.

**(c) No Medical Necessity Integration.** Prior art systems treat medical necessity documentation as an afterthought or omit it entirely. Medical necessity — the justification that services rendered were clinically required — is a fundamental requirement for reimbursement under CMS guidelines (42 CFR 410.60 for physical therapy, 42 CFR 410.62 for speech-language pathology, Medicare Benefit Policy Manual Chapter 15 §§220-230 for rehabilitation, AMA CPT E/M Guidelines for medical services). Existing AI scribes generate notes that may be clinically descriptive but fail to establish the medical necessity chain required for proper reimbursement.

**(d) No Provider-Type Awareness.** Existing systems do not adapt documentation requirements based on provider credential type. A physical therapist (PT), an occupational therapist (OT), a speech-language pathologist (SLP), a licensed clinical social worker (LCSW), and a physician (MD/DO) each operate under different regulatory frameworks, scope-of-practice constraints, billing codes, and documentation standards. Prior art systems apply the same generic template regardless of provider type.

**(e) No Specialty Depth.** Existing systems provide at most a library of pre-built templates organized by specialty name, but these templates remain at the section-header level. They do not incorporate specialty-specific documentation requirements sourced from specialty professional organizations and regulatory bodies.

**(f) Absence of Rehabilitation and Behavioral Health Support.** The prior art is overwhelmingly focused on physician documentation (E/M coding). No commercially available AI scribe system provides documentation frameworks for physical therapy initial evaluations (CPT 97161-97163), occupational therapy evaluations (CPT 97165-97167), speech-language pathology evaluations (CPT 92521-92524), comprehensive psychiatric evaluations (CPT 90792), group therapy progress notes (CPT 90853), or substance use disorder evaluations — despite these provider types collectively representing over 500,000 licensed clinicians in the United States.

#### 4.3 The Need for the Present Invention

What is needed is a clinical documentation system that goes beyond section-header templates to provide granular, item-level documentation requirements sourced from specific regulatory bodies, professional organizations, and evidence-based clinical guidelines — requirements that function as structured AI prompts to constrain and guide the AI's output, ensuring that every generated note meets the documentation standards necessary for clinical completeness, billing compliance, regulatory adherence, and medical necessity justification.

---

### 5. SUMMARY OF THE INVENTION

The present invention provides a computer-implemented method and system for generating clinical documentation from audio recordings of clinical encounters. The system employs a plurality of documentation frameworks, each comprising a structured collection of item-level documentation requirements sourced from identified regulatory bodies, professional organizations, and evidence-based clinical guidelines. Each documentation item includes: (a) an item label identifying the clinical element; (b) a format template defining the structure and discrete data elements to be populated; and (c) a regulatory source citation identifying the authoritative basis for the documentation requirement.

In a preferred embodiment, the system comprises three clinical domains — Medical, Rehabilitation, and Behavioral Health — each containing three framework types with five subtypes per framework type, yielding forty-five (45) distinct structured documentation paths. The system further comprises cross-framework add-on modules and specialty-specific add-on modules that layer additional documentation items onto any base framework.

The method comprises: (a) receiving an audio recording of a clinical encounter; (b) transcribing the audio recording using automatic speech recognition with speaker diarization to distinguish clinician speech from patient speech; (c) selecting a documentation framework based on provider type, clinical domain, encounter type, and clinical setting; (d) compiling the selected framework's item-level documentation requirements into a structured prompt for an artificial intelligence generation engine; (e) generating a structured clinical note by processing the transcript against the compiled framework prompt; and (f) verifying the generated note against a compliance verification layer that checks for completeness of required documentation items, medical necessity language, and billing code alignment.

---

### 6. BRIEF DESCRIPTION OF THE DRAWINGS

**FIG. 1** is a system architecture diagram illustrating the overall data flow of the framework-driven clinical note generation system, showing the path from Audio Input through Transcription Engine, Speaker Diarization, Framework Selection Engine, Framework-to-Prompt Compiler, AI Generation Engine, Structured Note Output, and Compliance Verification Layer.

**FIG. 2** is a block diagram illustrating the framework hierarchy, showing three clinical domains (Medical, Rehabilitation, Behavioral Health), each containing three framework types, each containing five subtypes, with cross-framework and specialty add-on modules.

**FIG. 3** is a detailed flow diagram illustrating the Framework Selection Engine logic, showing how provider type, clinical domain, encounter type, and clinical setting are evaluated to select the appropriate framework and subtype.

**FIG. 4** is a detailed diagram illustrating the structure of an individual documentation item, showing the item label, format template with AI-populated fields (denoted by double underscore markers) and discrete data element separators (denoted by pipe characters), and regulatory source citation.

**FIG. 5** is a flow diagram illustrating the Framework-to-Prompt Compiler, showing how individual documentation items are assembled into a structured system prompt with section organization, item ordering, and contextual instructions.

**FIG. 6** is a flow diagram illustrating the Compliance Verification Layer, showing the item completeness check, medical necessity language verification, billing code alignment check, and provider scope-of-practice validation.

---

### 7. DETAILED DESCRIPTION OF PREFERRED EMBODIMENTS

#### 7.1 System Architecture Overview (FIG. 1)

Referring now to FIG. 1, the framework-driven clinical note generation system 100 comprises the following components connected in data flow sequence:

An **Audio Input Module 110** receives audio data from a clinical encounter. The Audio Input Module 110 supports multiple input modalities including: real-time microphone capture via WebRTC/MediaRecorder API for in-person encounters; system audio capture for telehealth encounters conducted via video conferencing platforms; and upload of pre-recorded audio files. The Audio Input Module 110 supports session pause and resume capability, enabling clinicians to pause recording during non-clinical portions of an encounter and resume when clinical discussion continues.

A **Transcription Engine 120** processes the audio data from Audio Input Module 110 using automatic speech recognition (ASR). In a preferred embodiment, the Transcription Engine 120 employs a deep learning-based ASR model (such as Deepgram Nova-2 or AssemblyAI Universal-2) optimized for medical terminology, supporting real-time streaming transcription with latency under 300 milliseconds. The Transcription Engine 120 outputs a time-stamped transcript with word-level confidence scores.

A **Speaker Diarization Module 130** processes the transcript from Transcription Engine 120 to distinguish between speakers in the clinical encounter. In a preferred embodiment, the Speaker Diarization Module 130 identifies at minimum the clinician and the patient as distinct speakers, and may additionally identify family members, interpreters, students, or other participants. Speaker diarization is critical because documentation frameworks require different handling of clinician-reported observations versus patient-reported symptoms. For example, the "Chief Complaint" item in a SOAP New Patient Visit framework requires documentation in the patient's own words (sourced from DSM-5-TR Clinical Assessment for behavioral health and AMA CPT E/M Guidelines for medical), while the "General Appearance" item requires the clinician's objective observation (sourced from CMS 1997 Documentation Guidelines).

A **Framework Selection Engine 140** determines the appropriate documentation framework based on multiple input parameters. Referring additionally to FIG. 3, the Framework Selection Engine 140 evaluates:

**(a) Provider Type.** The system maintains a provider profile database storing the clinician's credential type. Supported provider types include: Doctor of Medicine (MD), Doctor of Osteopathic Medicine (DO), Physician Assistant-Certified (PA-C), Nurse Practitioner (NP), Doctor of Nursing Practice (DNP), Physical Therapist (PT), Physical Therapist Assistant (PTA), Occupational Therapist (OT), Occupational Therapy Assistant (OTA), Speech-Language Pathologist (SLP), Licensed Clinical Social Worker (LCSW), Licensed Professional Counselor (LPC), Psychologist (PsyD/PhD), and Psychiatrist (MD/DO with psychiatric specialization). Provider type determines the clinical domain: MD/DO/PA-C/NP/DNP map to the Medical domain; PT/PTA map to the Rehabilitation domain (PT frameworks); OT/OTA map to the Rehabilitation domain (OT frameworks); SLP maps to the Rehabilitation domain (SLP frameworks); and LCSW/LPC/PsyD/PhD/Psychiatrist map to the Behavioral Health domain. Notably, PTA providers alias to PT data sets and OTA providers alias to OT data sets, as the clinical documentation requirements are identical — the supervising therapist's plan of care drives the template, not the assistant's credential. This aliasing approach is consistent with CMS billing rules and state practice acts.

**(b) Framework Type.** Within each clinical domain, the clinician selects a framework type. In the Medical domain, framework types are: SOAP (Progress Notes), H&P (History & Physical), and Procedure Note. In the Rehabilitation domain, framework types are: Initial Evaluation, Progress Note (Daily Treatment), and Re-evaluation/Discharge Summary. In the Behavioral Health domain, framework types are: Psychiatric & Psychological Evaluation, Therapy & Progress Notes, and Treatment Review & Discharge Planning.

**(c) Subtype.** Within each framework type, the clinician selects one of five subtypes. For example, within the Medical SOAP framework type, the five subtypes are: New Patient Visit (CPT 99202-99205), Established Patient Follow-Up (CPT 99211-99215), Annual Wellness Visit (G0438/G0439), Acute/Same-Day Visit, and Chronic Care Management (CPT 99490/99491). Within the Rehabilitation Initial Evaluation framework type, the five subtypes are: PT Initial Evaluation (CPT 97161-97163), PTA (alias to PT), OT Initial Evaluation (CPT 97165-97167), OTA (alias to OT), and SLP Initial Evaluation (CPT 92521-92524). Within the Behavioral Health Psychiatric Evaluation framework type, the five subtypes are: Comprehensive Psychiatric Evaluation, Psychological/Neuropsychological Testing Report, Substance Use Disorder Evaluation, Child and Adolescent Evaluation, and Crisis and Emergency Evaluation.

**(d) Specialty Add-Ons.** The Framework Selection Engine 140 additionally supports specialty add-on modules that layer domain-specific documentation items onto the selected base framework. In the Rehabilitation domain, seven specialty add-ons are provided: Hand Therapy, Vestibular Rehabilitation, Pelvic Floor, Aquatic Therapy, Wound Care, Lymphedema, and Sports Rehabilitation. In the Medical domain, specialty add-ons include but are not limited to: Cardiology (NYHA classification, echocardiographic findings, anticoagulation management per ACC/AHA guidelines), Neurology (per AAN standards), Orthopedics, Pediatrics (per AAP standards), and Endocrinology (per ADA Standards of Medical Care in Diabetes).

**(e) Cross-Framework Add-Ons.** Certain documentation items apply across all frameworks and subtypes regardless of domain, including: Red Flag Screening, Medication Reconciliation, Social Determinants of Health (SDOH) Screening, Fall Risk Assessment (per CDC STEADI), Advance Care Planning, Infection Control, Pain Assessment, Cultural Competency documentation (including tribal/IHS considerations per Indian Health Manual and 42 CFR 136), and Telehealth Documentation requirements.

A **Framework-to-Prompt Compiler 150** (FIG. 5) receives the selected framework and subtype from Framework Selection Engine 140 and compiles the item-level documentation requirements into a structured prompt for the AI Generation Engine 160. The compilation process comprises:

(i) Retrieving all documentation items for the selected framework/subtype combination from a framework database. Each item comprises an item label, a format template, and a regulatory source citation. For example, in the Medical SOAP New Patient Visit subtype, the "Chief Complaint (CC)" item has format template: `"Patient presents with __ | Duration: __ | Severity: __/10 | Context: __"` and source citation: "AMA CPT E/M Guidelines 2021; CMS 1995/1997 Documentation Guidelines." The "History of Present Illness — Onset" item has format template: `"Onset: __ | Date/time of onset: __ | Gradual vs. sudden: __ | Precipitating event: __"` and source citation: "CMS 1997 Documentation Guidelines (8 HPI elements); AMA CPT 2021."

(ii) Organizing items into sections corresponding to the framework structure. For SOAP frameworks, sections are Subjective (S), Objective (O), Assessment (A), Plan (P), and Medical Necessity (MN). For H&P frameworks, sections are Chief Complaint, HPI, Review of Systems, Past Medical/Surgical/Family History, Physical Examination, Assessment & Plan, and Medical Necessity. For Rehabilitation Initial Evaluation frameworks, sections include Demographics, Referral, History, Systems Review, Objective Tests & Measures, Evaluation/Clinical Impression, Diagnosis, Goals (STG/LTG), Plan of Care, Medical Necessity, and Certification.

(iii) Appending any selected specialty add-on items and cross-framework add-on items to the appropriate sections.

(iv) Generating a system prompt that instructs the AI Generation Engine to: populate each item's format template from the encounter transcript; use the double underscore (`__`) markers as fields to be filled; respect the pipe (`|`) delimiters as separators between discrete data elements; flag items for which insufficient information exists in the transcript rather than fabricating data; and include medical necessity language in the designated Medical Necessity section.

An **AI Generation Engine 160** receives the compiled structured prompt from Framework-to-Prompt Compiler 150 and the diarized transcript from Speaker Diarization Module 130. The AI Generation Engine 160 employs a large language model (LLM) to generate a structured clinical note by extracting clinical information from the transcript and populating the framework's documentation items. In a preferred embodiment, the AI Generation Engine 160 uses streaming response generation, building the note section-by-section in real time as the clinician observes.

A **Structured Note Output Module 170** receives the generated note from AI Generation Engine 160 and presents it to the clinician in an editable interface. The Structured Note Output Module 170 supports inline editing (content-editable rendering), section-level copy, full-note copy, and export to electronic health record (EHR) systems.

A **Compliance Verification Layer 180** (FIG. 6) performs automated quality assurance on the generated note. The Compliance Verification Layer 180 checks:

(i) **Item Completeness:** Whether each documentation item in the selected framework has been populated. Items that could not be populated from the transcript are flagged with a visual indicator and a prompt suggesting the clinician provide the missing information.

(ii) **Medical Necessity Language:** Whether the Medical Necessity section contains sufficient justification language. The system evaluates for the presence of: diagnosis linkage, functional limitation description, service justification, risk-of-harm-without-intervention language, and treatment goal alignment. For rehabilitation notes, the system verifies compliance with the Jimmo v. Sebelius (2013) standard establishing that Medicare coverage is based on need for skilled services, not expectation of improvement.

(iii) **Billing Code Alignment:** Whether the documented services support the anticipated billing codes. For E/M services, the system evaluates medical decision-making (MDM) complexity against AMA CPT 2021 E/M guidelines to suggest the appropriate E/M level (e.g., 99213 vs. 99214). For rehabilitation services, the system verifies that documented interventions match billed CPT codes (97110 Therapeutic Exercise, 97140 Manual Therapy, 97530 Therapeutic Activities, etc.) and that time documentation supports the CMS 8-Minute Rule for unit calculation.

(iv) **Provider Scope-of-Practice Validation:** Whether the documentation is appropriate for the provider's credential type. For example, if a PTA is the documenting provider, the system verifies that the note does not contain evaluation or re-evaluation conclusions that are outside the PTA's scope of practice under state practice acts and APTA standards.

#### 7.2 Framework Hierarchy and Structure (FIG. 2)

The framework hierarchy of the present invention is organized as follows:

**Medical Domain (9 framework types × subtypes):**
- SOAP Progress Notes: New Patient Visit (51 items), Established Patient Follow-Up (32-40 items), Annual Wellness Visit (per CMS 42 CFR 410.15 and G0438/G0439), Acute/Same-Day Visit, Chronic Care Management (per CMS 42 CFR 414.510 and CPT 99490/99491)
- H&P (History & Physical): Comprehensive H&P for Hospital Admission (40-50 items per Joint Commission RC.02.01.01 and CMS Conditions of Participation), Focused H&P, Consultation H&P, Pre-Operative H&P (including ASA classification per American Society of Anesthesiologists), Emergency Department H&P (per ACEP documentation standards and EMTALA 42 USC 1395dd)
- Procedure Note: Minor Office Procedure (28-30 items), Major/Surgical Procedure (up to 47 items per AMA CPT Surgical Guidelines and Joint Commission Universal Protocol), Injection/Aspiration, Diagnostic Procedure, Biopsy/Excision

**Rehabilitation Domain (9 framework types × subtypes):**
- Initial Evaluation: PT (42-44 items per APTA Guide to PT Practice 3.0 and CMS 42 CFR 410.60), PTA alias, OT (per AOTA OTPF-4 and CMS 42 CFR 410.59), OTA alias, SLP (per ASHA Practice Portal and CMS 42 CFR 410.62)
- Progress Note (Daily Treatment): PT (30-34 items per CMS 8-Minute Rule and Medicare Ch.15), PTA alias, OT, OTA alias, SLP
- Re-evaluation/Discharge Summary: PT (28-30 items per CMS Certification Period Requirements), PTA alias, OT, OTA alias, SLP

**Behavioral Health Domain (9 framework types × subtypes):**
- Psychiatric & Psychological Evaluation: Comprehensive Psychiatric Evaluation (56 items per APA Practice Guidelines and DSM-5-TR), Psychological/Neuropsychological Testing Report (30 items), Substance Use Disorder Evaluation (30 items per ASAM Criteria 4th Edition), Child & Adolescent Evaluation (30 items per AACAP), Crisis & Emergency Evaluation (27 items)
- Therapy & Progress Notes: Individual Therapy (26 items), Group Therapy (23 items per AGPA Standards and CPT 90853), Family & Couples Therapy (24 items per AAMFT), SUD Treatment (25 items per 42 CFR Part 2), Psychiatric Medication Management (25 items)
- Treatment Review & Discharge Planning: Treatment Plan Review (23 items), Utilization Review (18 items per MHPAEA), Discharge Summary (23 items), Aftercare & Continuing Care Plan (16 items), Outcomes & Quality Reporting (14 items per HEDIS)

#### 7.3 Documentation Item Structure (FIG. 4)

Each documentation item in the framework database comprises three elements:

**(a) Item Label.** A descriptive identifier for the clinical documentation element. Examples include: "Chief Complaint (CC)," "History of Present Illness — Onset," "Manual Muscle Testing (MMT)," "CMS Section GG — Self-Care," "PHQ-9 Depression Screen," "Suicide Risk Assessment — Ideation," "Medical Necessity Justification."

**(b) Format Template.** A structured string defining the data elements to be populated. Double underscore markers (`__`) indicate fields to be populated by the AI from the encounter transcript. Pipe characters (`|`) separate discrete data elements within a single item. For example:

- PT Initial Evaluation, "Manual Muscle Testing (MMT)" item: `"Muscle/group: __ | Side: L/R | Grade: __/5 | Pain with test: Y/N | Substitution noted: Y/N"` — sourced from Daniels & Worthingham Manual Muscle Testing 10th Edition and Kendall et al.

- Medical SOAP New Patient Visit, "PHQ-2 Depression Screen" item: `"PHQ-2 Score: __/6 | Positive >= 3: Y/N | Full PHQ-9 triggered: Y/N"` — sourced from Kroenke 2001 and USPSTF Grade A/B Recommendations.

- Behavioral Health Comprehensive Psychiatric Evaluation, "Suicide Risk Assessment — Ideation" item: `"Current suicidal ideation: Y/N | Frequency: __ | Intensity (0-10): __ | Duration: __ | Plan: Y/N | Plan details: __ | Intent: Y/N | Means access: Y/N | Means type: __"` — sourced from the Columbia Suicide Severity Rating Scale (C-SSRS) and Joint Commission NPSG 15.01.01.

- OT Initial Evaluation, "COPM Assessment" item: `"COPM Performance score: __/10 | COPM Satisfaction score: __/10 | Occupation 1: __ | Occupation 2: __ | Occupation 3: __"` — sourced from the Canadian Occupational Performance Measure (Law et al. 2014), with MCID = 2.0 points.

- Rehabilitation, "CMS Section GG — Mobility (Walking)" item: `"Walk 10 feet: __/06 | Walk 50 feet w/2 turns: __/06 | Walk 150 feet: __/06 | Walk 10 feet uneven: __/06 | 1 step curb: __/06 | 4 steps: __/06 | 12 steps: __/06 | Picking up object: __/06 | Wheel 50 feet: __/06 | Wheel 150 feet: __/06"` — sourced from CMS Section GG (IMPACT Act 2014) and 42 CFR 485.645.

**(c) Regulatory Source Citation.** An identifier linking the documentation item to its authoritative basis. Source citations reference specific regulatory bodies, clinical practice guidelines, validated assessment instruments, and evidence-based standards. The source citation serves a dual purpose: it provides an audit trail demonstrating that documentation requirements are grounded in recognized standards, and it enables the system to update documentation items when regulatory requirements change.

#### 7.4 Framework-to-Prompt Compilation Process (FIG. 5)

The Framework-to-Prompt Compiler 150 transforms the collection of individual documentation items into a structured system prompt suitable for the AI Generation Engine 160. The compilation process is now described in detail.

First, the compiler retrieves the base item set for the selected framework/subtype. For example, a PT Initial Evaluation (CPT 97161-97163) loads 42-44 items organized into sections: Patient Demographics, Referral/Prescription, Medical History, Prior Level of Function (PLOF), Chief Complaint, Patient Goals, Pain Assessment, Systems Review (Cardiovascular/Pulmonary, Musculoskeletal, Neuromuscular, Integumentary, Communication & Cognition), Active Range of Motion (AROM), Passive Range of Motion (PROM), Manual Muscle Testing (MMT), Grip & Pinch Strength, Functional Strength Assessment, Balance Assessment (Static and Dynamic), Gait Analysis, Gait Speed/Timed Walk (10-Meter Walk Test, 6-Minute Walk Test), Timed Up and Go (TUG), Functional Mobility Assessment, CMS Section GG (Self-Care and Mobility), Special Tests (Orthopedic and Neurological), Posture Assessment, Palpation Findings, Functional Outcome Measure (Condition-Specific and General — including DASH, LEFS, NDI, ODI, FOTO, PROMIS), Fall Risk Screening, Evaluation/Clinical Impression, Physical Therapy Diagnosis, Plan of Care Goals (STG and LTG), Plan of Care Interventions, Plan of Care Frequency/Duration, Medical Necessity Justification, Physician Certification, Patient/Caregiver Education, and Consent.

Second, the compiler appends any specialty add-on items. If the clinician's profile indicates a vestibular rehabilitation specialty, the Vestibular Rehab add-on items are appended, adding items such as Dix-Hallpike test results, BPPV variant identification, habituation exercise protocols, and Vestibular Disorders Activities of Daily Living Scale (VADL) scoring.

Third, the compiler appends any cross-framework add-on items applicable to the encounter, such as Medication Reconciliation (per Joint Commission National Patient Safety Goals), SDOH Screening, and Telehealth Documentation (if the encounter is conducted remotely).

Fourth, the compiler generates the system prompt. The system prompt includes: (i) a role instruction identifying the AI as a clinical documentation assistant for the specific provider type; (ii) the complete list of documentation items organized by section, with each item's format template and a notation of its regulatory source; (iii) instructions to populate each item from the encounter transcript, using the format template structure; (iv) instructions to flag items for which insufficient data exists in the transcript rather than generating fabricated clinical data (a critical patient safety feature); and (v) instructions to generate medical necessity language in the designated section that links diagnosis to functional limitation to service justification.

#### 7.5 Adaptive Style Learning

The system further comprises an adaptive style learning module that tracks clinician edits to generated notes and incorporates those edits into future note generation. When a clinician modifies a generated note — for example, by changing phrasing in the Assessment section, adjusting the level of detail in the HPI, or preferring certain abbreviations — the system stores the edit differential (original generated text versus final saved text) in a per-clinician style profile database. In subsequent note generation sessions, the Framework-to-Prompt Compiler 150 includes the most recent edited examples (e.g., the last 3-5 edited notes from the same framework/subtype) as few-shot context examples appended to the system prompt. This enables the AI Generation Engine 160 to adapt its output style to match the clinician's documented preferences while maintaining compliance with the underlying framework requirements. Importantly, style adaptation operates within the framework constraints — the system does not permit style learning to remove required documentation items, only to modify the phrasing, detail level, and organizational preferences within those items.

#### 7.6 Multi-Framework Output from Single Encounter

The system supports generating multiple documentation types from a single clinical encounter recording. For example, when a primary care physician performs a follow-up visit (SOAP — Established Patient Follow-Up) and also administers a joint injection (Procedure Note — Injection/Aspiration), both notes are generated from the same audio capture. The system splits the transcript into relevant segments for each framework and generates both notes simultaneously. Similarly, in rehabilitation settings where a patient receives both PT and OT services concurrently, the system can generate separate discipline-specific notes from a single encounter recording.

#### 7.7 Provider-Type Aliasing

The system implements credential-based aliasing for assistant-level providers. PTA (Physical Therapist Assistant) providers are aliased to PT data sets, and OTA (Occupational Therapy Assistant) providers are aliased to OT data sets. PA-C, NP, and DNP providers are aliased to MD/DO data sets. The clinical documentation requirements, coding rules, and medical necessity standards are identical across aliased provider types. The system adds appropriate supervision and co-signature documentation elements when an assistant-level provider is selected, consistent with state practice acts and CMS conditions of participation.

---

### 8. CLAIMS

**Independent Claims:**

**Claim 1.** A computer-implemented method for generating clinical documentation, comprising:
(a) receiving, by a processor, an audio recording of a clinical encounter between a clinician and a patient;
(b) transcribing, by the processor using an automatic speech recognition engine, the audio recording to produce a text transcript;
(c) performing speaker diarization on the text transcript to identify at least a clinician speaker and a patient speaker;
(d) selecting, by the processor, a documentation framework from a framework database, the documentation framework comprising a plurality of documentation items, each documentation item comprising: (i) an item label identifying a clinical documentation element, (ii) a format template defining a structured data layout with designated AI-populated fields and discrete data element separators, and (iii) a regulatory source citation identifying an authoritative basis for the documentation requirement;
(e) compiling, by the processor, the plurality of documentation items from the selected documentation framework into a structured prompt for an artificial intelligence generation engine;
(f) generating, by the artificial intelligence generation engine, a structured clinical note by extracting clinical information from the text transcript and populating the format templates of the plurality of documentation items; and
(g) outputting the structured clinical note for review by the clinician.

**Claim 2.** The method of Claim 1, wherein the documentation framework is selected based on at least one of: a provider credential type of the clinician, a clinical domain, an encounter type, and a clinical setting.

**Claim 3.** The method of Claim 1, wherein the framework database comprises at least three clinical domains, each clinical domain comprising at least three framework types, each framework type comprising at least five subtypes, yielding at least forty-five distinct documentation paths.

**Claim 4.** The method of Claim 3, wherein the three clinical domains comprise a Medical domain, a Rehabilitation domain, and a Behavioral Health domain.

**Claim 5.** The method of Claim 1, wherein each documentation item format template comprises double underscore markers (`__`) designating fields to be populated by the artificial intelligence generation engine and pipe characters (`|`) separating discrete data elements within the format template.

**Claim 6.** The method of Claim 1, further comprising:
(h) verifying, by a compliance verification layer, the generated structured clinical note against the selected documentation framework to identify documentation items that were not populated from the text transcript; and
(i) generating a completeness report indicating unpopulated documentation items.

**Claim 7.** The method of Claim 1, wherein the structured prompt includes an instruction to flag documentation items for which insufficient data exists in the text transcript rather than generating fabricated clinical data.

**Claim 8.** The method of Claim 1, further comprising appending specialty add-on documentation items from a specialty add-on module to the selected documentation framework based on a specialty designation associated with the clinician.

**Claim 9.** The method of Claim 1, further comprising appending cross-framework documentation items to the selected documentation framework, the cross-framework documentation items comprising at least one of: medication reconciliation items, social determinants of health screening items, fall risk assessment items, and telehealth documentation items.

**Claim 10.** The method of Claim 1, wherein the documentation framework comprises a medical necessity section, and the generating step comprises generating medical necessity language linking at least a diagnosis, a functional limitation, and a service justification.

**Claim 11.** The method of Claim 1, further comprising:
(h) storing an edit differential between the generated structured clinical note and a clinician-edited version of the note in a per-clinician style profile database; and
(i) incorporating stored edit differentials as context examples in subsequent structured prompts for the same clinician.

**Claim 12.** The method of Claim 1, wherein the selecting step comprises aliasing a provider credential type of a first type to a documentation framework of a second type, wherein physical therapist assistant is aliased to physical therapist, occupational therapy assistant is aliased to occupational therapist, and physician assistant and nurse practitioner are aliased to physician.

**Claim 13.** The method of Claim 1, further comprising generating a billing code suggestion based on analysis of the generated structured clinical note against billing code requirements, the billing code suggestion comprising at least one of: an evaluation and management level code, a rehabilitation procedure code, and a behavioral health service code.

**Claim 14.** The method of Claim 13, wherein for rehabilitation encounters, the billing code suggestion further comprises a time-based unit calculation in accordance with the CMS 8-Minute Rule.

**Claim 15.** The method of Claim 1, further comprising generating a plurality of structured clinical notes from a single audio recording of a clinical encounter when the encounter involves a plurality of documentation framework types.

**System Claims:**

**Claim 16.** A system for generating clinical documentation, comprising:
(a) a memory storing a framework database comprising a plurality of documentation frameworks, each documentation framework comprising a plurality of documentation items, each documentation item comprising an item label, a format template with designated AI-populated fields, and a regulatory source citation;
(b) a processor configured to:
  (i) receive an audio recording of a clinical encounter;
  (ii) transcribe the audio recording with speaker diarization;
  (iii) select a documentation framework from the framework database based on at least a provider credential type and an encounter type;
  (iv) compile the documentation items of the selected framework into a structured prompt;
  (v) generate, using an artificial intelligence engine, a structured clinical note by populating the format templates from the transcript; and
  (vi) output the structured clinical note; and
(c) a compliance verification module configured to verify the generated note against the selected framework for item completeness, medical necessity language, and billing code alignment.

**Claim 17.** The system of Claim 16, wherein the framework database stores at least 400 distinct documentation items across at least three clinical domains.

**Claim 18.** The system of Claim 16, further comprising a style learning module configured to store clinician edit differentials and incorporate the edit differentials as context examples in subsequent structured prompts.

**Claim 19.** The system of Claim 16, wherein the framework database further comprises specialty add-on modules and cross-framework add-on modules that augment a base documentation framework with additional documentation items.

**Claim 20.** The system of Claim 16, wherein the compliance verification module is further configured to validate that the generated note is within the scope of practice for the provider credential type associated with the clinician.

---

### 9. ABSTRACT

A computer-implemented method and system for generating clinical documentation from audio recordings of clinical encounters. The system employs a framework database comprising a plurality of documentation frameworks organized by clinical domain (Medical, Rehabilitation, Behavioral Health), framework type, and subtype. Each documentation framework contains item-level documentation requirements, each comprising an item label, a format template with AI-populated fields, and a regulatory source citation linking the item to an authoritative regulatory body or clinical guideline. The system transcribes the encounter audio with speaker diarization, selects the appropriate framework based on provider type and encounter type, compiles the framework items into a structured AI prompt, and generates a clinical note that is verified for completeness, medical necessity, and billing code alignment. The system supports provider-type aliasing, specialty add-on modules, cross-framework add-on modules, and adaptive style learning.

---
---

# PATENT APPLICATION II

## INTEGRATED CLINICAL OUTCOME MEASUREMENT AND DOCUMENTATION SYSTEM

---

### 1. TITLE OF THE INVENTION

Integrated Clinical Outcome Measurement and Documentation System with Automated Scoring, Longitudinal Trending, and Authorization Justification Generation

---

### 2. CROSS-REFERENCE TO RELATED APPLICATIONS

This application is related to co-pending U.S. Provisional Patent Application No. [TBD], entitled "Framework-Driven Clinical Note Generation System and Method," and co-pending U.S. Provisional Patent Application No. [TBD], entitled "Multi-Patient Individualized Documentation from Group Clinical Sessions," both filed concurrently herewith and incorporated herein by reference in their entirety. The present invention integrates with the framework-driven note generation system of the first related application, receiving outcome measurement data as structured input to the AI Generation Engine described therein.

---

### 3. FIELD OF THE INVENTION

The present invention relates generally to clinical outcome measurement systems and, more particularly, to computer-implemented methods and systems for embedding standardized clinical outcome measures into the clinical documentation workflow, with automated scoring algorithms, longitudinal outcome trending across episodes of care, statistical significance analysis including Minimal Detectable Change (MDC) and Minimal Clinically Important Difference (MCID) calculations, and automated generation of payer-specific authorization requests populated with outcome data and medical necessity justification.

---

### 4. BACKGROUND OF THE INVENTION

#### 4.1 The Outcome Measurement Gap in Clinical Documentation

Clinical outcome measurement is a cornerstone of evidence-based practice across all healthcare disciplines. Standardized outcome instruments — such as the Patient Health Questionnaire-9 (PHQ-9) for depression severity, the Disabilities of the Arm, Shoulder and Hand (DASH) questionnaire for upper extremity function, the Oswestry Disability Index (ODI) for low back function, the Berg Balance Scale (BBS) for fall risk, the Functional Independence Measure (FIM) for rehabilitation outcomes, the Generalized Anxiety Disorder-7 (GAD-7) for anxiety severity, and the Columbia Suicide Severity Rating Scale (C-SSRS) for suicide risk — provide validated, reliable measurements of patient status that are essential for treatment planning, progress monitoring, and payer justification.

Despite their clinical importance, outcome measures are currently collected in systems that are separate from the clinical documentation workflow. Clinicians administer outcome instruments on paper or in standalone survey tools, manually calculate scores, manually transfer scores into their clinical notes, and manually compare current scores to prior scores to assess progress. This workflow creates several problems:

**(a) Double Documentation.** Clinicians document the outcome measure in one system and then re-document the results in their clinical note, creating redundant work and opportunities for transcription error.

**(b) Scoring Errors.** Manual calculation of outcome measure scores is error-prone. The FIM, for example, requires scoring 18 items across motor and cognitive domains on a 7-point scale (1-7), summing subscale and total scores — a process susceptible to arithmetic error. The MCID and MDC values for outcome measures vary by instrument, diagnosis, and patient population, making manual comparison impractical.

**(c) No Longitudinal Trending.** Existing clinical documentation systems store outcome scores as static text entries in individual notes. There is no mechanism to automatically trend scores over time, calculate rates of change, detect improvement plateaus, or visualize longitudinal progress.

**(d) Disconnection from Authorization.** Insurance authorization requests for continued treatment require demonstration of medical necessity, typically documented through functional limitation descriptions, outcome measure scores, improvement trends, and prognosis statements. Currently, clinicians manually extract this information from multiple clinical notes and manually compose authorization requests — a time-consuming process that often results in denials due to incomplete or poorly organized clinical justification.

**(e) No Population Health Analytics.** Clinicians and healthcare organizations have no mechanism to aggregate de-identified outcome data across patient caseloads for quality reporting (MIPS — Merit-based Incentive Payment System, HEDIS — Healthcare Effectiveness Data and Information Set), program evaluation, or clinical research.

#### 4.2 Limitations of Prior Art

Existing AI clinical documentation tools do not incorporate outcome measurement into the documentation workflow. Prior art systems may include a field for "outcome measures" in their templates, but they do not: maintain a library of standardized instruments with scoring algorithms; automatically calculate scores from collected data; track scores longitudinally; perform MDC/MCID analysis; or generate authorization documents. Separately, outcome measurement platforms exist (such as FOTO — Focus On Therapeutic Outcomes, and ASHA NOMS — National Outcomes Measurement System), but these are standalone systems that do not integrate with clinical documentation workflows.

#### 4.3 The Need for the Present Invention

What is needed is a system that embeds outcome measurement directly into the clinical documentation encounter, automatically scores administered instruments, stores scores in a longitudinal database, performs statistical analysis to determine whether changes are clinically and statistically significant, integrates outcome data as structured input to AI-driven note generation, and automatically generates payer-specific authorization requests populated with clinical justification derived from outcome data.

---

### 5. SUMMARY OF THE INVENTION

The present invention provides a computer-implemented method and system for integrated clinical outcome measurement and documentation. The system comprises: (a) an outcome measure library containing a plurality of standardized clinical outcome instruments with built-in scoring algorithms, normative data, MDC values, and MCID values; (b) an encounter-integrated collection interface that presents outcome instruments to the clinician during the documentation encounter; (c) an automated scoring engine that calculates instrument scores, subscale scores, severity classifications, and percentile rankings; (d) a longitudinal score database that stores all outcome scores across the patient's episodes of care with time-stamped entries; (e) a trend analysis engine that calculates score changes over time, rates of improvement, and compares changes to MDC and MCID thresholds; (f) an authorization generation engine that automatically produces payer-specific authorization requests populated with outcome data, functional limitation descriptions, and medical necessity justification; and (g) a note integration module that feeds outcome data as structured input to a framework-driven clinical note generation system as described in the first related application.

---

### 6. BRIEF DESCRIPTION OF THE DRAWINGS

**FIG. 7** is a system architecture diagram illustrating the integrated clinical outcome measurement and documentation system, showing the data flow from Patient Encounter through Outcome Measure Selection, Automated Scoring, Score Database, Trend Analysis Engine, and three output paths: Authorization Generator, Note Integration, and Population Health Dashboard.

**FIG. 8** is a block diagram illustrating the outcome measure library structure, showing instrument categories (Physical Function, Mental Health, Substance Use, Cognitive, Quality of Life, Pediatric), individual instruments, and associated metadata (scoring algorithm, normative data, MDC, MCID, applicable diagnoses, applicable provider types).

**FIG. 9** is a flow diagram illustrating the Trend Analysis Engine, showing the process of retrieving baseline scores, calculating change scores, comparing to MDC thresholds, comparing to MCID thresholds, and generating trend classifications (Significant Improvement, Clinically Meaningful Improvement, No Meaningful Change, Plateau, Decline).

**FIG. 10** is a flow diagram illustrating the Authorization Generation Engine, showing the selection of payer-specific authorization templates, population of fields from outcome data and clinical documentation, medical necessity narrative generation, and output of formatted authorization requests.

**FIG. 11** is a diagram illustrating the Population Health Dashboard, showing aggregate outcome trends across a clinician's caseload with de-identified data, quality measure calculations, and benchmarking against normative data.

---

### 7. DETAILED DESCRIPTION OF PREFERRED EMBODIMENTS

#### 7.1 System Architecture Overview (FIG. 7)

Referring now to FIG. 7, the integrated clinical outcome measurement and documentation system 200 comprises the following components:

An **Outcome Measure Library 210** stores a plurality of standardized clinical outcome instruments. In a preferred embodiment, the library contains at least fifty (50) instruments organized into the following categories:

**Physical Function / Rehabilitation Instruments:**
- Functional Independence Measure (FIM) — 18 items, 7-point scale (1-7), motor subscale (13 items, range 13-91), cognitive subscale (5 items, range 5-35), total score range 18-126 (sourced from Uniform Data System for Medical Rehabilitation, 1997)
- Disabilities of the Arm, Shoulder and Hand (DASH) — 30 items, score range 0-100, MCID = 10.2 points, MDC = 12.8 points (Hudak 1996)
- Oswestry Disability Index (ODI) — 10 items, 0-100% scale, MCID = 12.8 points (Fairbank 1980)
- Neck Disability Index (NDI) — 10 items, 0-100% scale, MCID = 7.5 points (Vernon 1991)
- Lower Extremity Functional Scale (LEFS) — 20 items, score range 0-80, MCID = 9 points (Binkley 1999)
- Berg Balance Scale (BBS) — 14 items, 0-4 scale per item, total 0-56, cut-off scores for fall risk at <45 (Berg 1992)
- Timed Up and Go (TUG) — single-task time in seconds, fall risk >12 seconds, MCID = 3.4 seconds (Podsiadlo & Richardson 1991)
- 10-Meter Walk Test (10MWT) — gait speed in m/s, MCID varies by diagnosis (e.g., 0.16 m/s for stroke per Tilson 2010)
- 6-Minute Walk Test (6MWT) — distance in meters, MCID = 54 meters for COPD (ATS 2002)
- 30-Second Chair Stand Test — repetitions, age-normative data (Jones 1999; CDC STEADI)
- Mini-BESTest — 14 items, 0-28 score, balance assessment (Franchignoni 2010)
- Dynamic Gait Index (DGI) — 8 items, 0-24 score, fall risk <19 (Shumway-Cook 1997)
- Canadian Occupational Performance Measure (COPM) — performance and satisfaction scores 1-10, MCID = 2.0 points (Law et al. 2014)
- Nine-Hole Peg Test (9HPT) — time in seconds, normative data by age/gender (Mathiowetz 1985)
- Box & Block Test — blocks per minute, normative data by age/gender (Mathiowetz 1985)
- CMS Section GG Self-Care and Mobility items — 6-point scale (IMPACT Act 2014, 42 CFR 485.645)

**Mental Health / Behavioral Health Instruments:**
- Patient Health Questionnaire-9 (PHQ-9) — 9 items, score range 0-27, severity cut-offs: 5 (mild), 10 (moderate), 15 (moderately severe), 20 (severe), MCID = 5 points (Kroenke 2001)
- Generalized Anxiety Disorder-7 (GAD-7) — 7 items, score range 0-21, severity cut-offs: 5 (mild), 10 (moderate), 15 (severe) (Spitzer 2006)
- Columbia Suicide Severity Rating Scale (C-SSRS) — structured interview, ideation severity levels 1-5, behavior lethality ratings (Posner et al.)
- PTSD Checklist-5 (PCL-5) — 20 items, score range 0-80, provisional PTSD diagnosis at ≥33, MCID = 10 points (Weathers et al.)
- AUDIT (Alcohol Use Disorders Identification Test) — 10 items, score range 0-40, hazardous drinking ≥8 (Babor et al.)
- DAST-10 (Drug Abuse Screening Test) — 10 items, score range 0-10 (Skinner 1982)
- PHQ-2 — 2-item depression prescreen, positive ≥3 triggers full PHQ-9
- AUDIT-C — 3-item alcohol prescreen, positive ≥4 men / ≥3 women
- Beck Depression Inventory-II (BDI-II) — 21 items, 0-63 score (Beck 1996)
- Beck Anxiety Inventory (BAI) — 21 items, 0-63 score (Beck 1988)
- Young Mania Rating Scale (YMRS) — 11 items, mania severity
- Mood Disorder Questionnaire (MDQ) — 13-item bipolar screen (Hirschfeld 2000)
- WHO Disability Assessment Schedule 2.0 (WHODAS 2.0) — 36 items, functional impairment
- Sheehan Disability Scale — 3-item, 0-30 total (work/social/family)
- GAF (Global Assessment of Functioning) — 0-100 clinician-rated scale

**Substance Use Instruments:**
- ASAM Criteria Dimensional Assessment — 6 dimensions per ASAM 4th Edition
- CIWA-Ar (Clinical Institute Withdrawal Assessment for Alcohol) — 10 items, withdrawal severity
- COWS (Clinical Opiate Withdrawal Scale) — 11 items, opioid withdrawal severity

**Pediatric Instruments:**
- Pediatric Evaluation of Disability Inventory (PEDI), Ages and Stages Questionnaire (ASQ), Bayley Scales

Each instrument in the library is stored with the following metadata: item content and response options, scoring algorithm (computational procedure for calculating total scores, subscale scores, and severity classifications), normative data tables (age-, gender-, and diagnosis-specific norms where applicable), MDC values (the minimum change in score that exceeds measurement error, establishing that a real change has occurred), MCID values (the minimum change in score that represents a clinically meaningful difference to the patient, sourced from published validation studies), applicable diagnostic categories (ICD-10 codes for which the instrument is validated), and applicable provider types (which clinician types typically administer the instrument).

#### 7.2 Encounter-Integrated Collection Interface

The Outcome Measure Collection Interface 220 presents outcome instruments to the clinician within the clinical documentation encounter workflow — not as a separate system or workflow. In a preferred embodiment, the interface operates in two modes:

**(a) Pre-encounter Collection.** Outcome instruments may be sent to the patient electronically (via SMS, email, or patient portal) prior to the appointment. Completed instruments are automatically scored and available to the clinician at the start of the encounter. The scored results feed into the Framework-to-Prompt Compiler 150 (described in the first related application) as structured data, enabling the AI Generation Engine to incorporate outcome scores directly into the generated clinical note.

**(b) In-encounter Collection.** During the clinical encounter, the clinician administers outcome instruments as part of their assessment. For rehabilitation encounters, this includes functional tests such as the Berg Balance Scale, Timed Up and Go, gait speed testing, manual muscle testing grades, and CMS Section GG scores. For behavioral health encounters, this includes administering the PHQ-9, GAD-7, C-SSRS, PCL-5, or other instruments. The clinician enters scores directly into the documentation interface, and the Automated Scoring Engine 230 computes results in real time.

#### 7.3 Automated Scoring Engine 230

The Automated Scoring Engine 230 receives raw item responses or clinician-entered data and computes: total instrument scores, subscale scores, severity classifications based on published cut-off values, and percentile rankings based on normative data. For example:

- For a PHQ-9 with raw item scores of [2, 3, 2, 1, 2, 3, 2, 1, 0], the engine computes: total score = 16, severity = "moderately severe" (range 15-19), and comparison to prior score (if available).

- For a Berg Balance Scale with 14 item scores, the engine computes: total score (0-56), fall risk classification (score <45 = high fall risk), and change from prior assessment.

- For the FIM, the engine computes: motor subscale score (13-91), cognitive subscale score (5-35), total FIM score (18-126), and individual item changes.

#### 7.4 Longitudinal Score Database 240

All scored outcome measures are stored in a time-series database 240 with the following record structure: patient identifier, instrument identifier, date of administration, individual item scores, total score, subscale scores, severity classification, administering clinician, encounter identifier (linking to the clinical note in which the score was documented), and episode of care identifier (linking to the patient's treatment episode). This structure enables longitudinal queries that retrieve all scores for a given patient on a given instrument across the full treatment episode.

#### 7.5 Trend Analysis Engine 250 (FIG. 9)

The Trend Analysis Engine 250 performs the following analytical operations:

**(a) Change Score Calculation.** For any two time points (e.g., initial evaluation and most recent re-evaluation), the engine calculates the raw change score (current score minus baseline score) and the percentage change ((change / baseline) × 100).

**(b) MDC Comparison.** The engine compares the change score to the instrument's published MDC value. If the change exceeds the MDC, the system classifies the change as "statistically real" — exceeding measurement error. For example, if a patient's DASH score improves from 62 to 48 (change = 14 points) and the DASH MDC is 12.8 points, the change exceeds MDC and is classified as real improvement.

**(c) MCID Comparison.** The engine compares the change score to the instrument's published MCID value. If the change exceeds the MCID, the system classifies the change as "clinically meaningful" — representing a change the patient would perceive as beneficial. Continuing the DASH example, if the MCID is 10.2 points, the 14-point change also exceeds MCID and is classified as clinically meaningful.

**(d) Trend Classification.** Based on the MDC and MCID analysis, the engine classifies the patient's trajectory into one of five categories:
- **Significant Improvement:** Change exceeds both MDC and MCID — the patient has improved in a way that is both statistically real and clinically meaningful.
- **Clinically Meaningful Improvement:** Change exceeds MCID but not MDC — the patient perceives improvement, but the change is within the measurement error range. Further data collection recommended.
- **No Meaningful Change:** Change does not exceed MCID — no clinically meaningful improvement detected.
- **Plateau:** Two or more consecutive assessments showing no meaningful change — the patient's progress has stalled. This classification triggers a clinical decision support alert recommending the clinician consider: modifying the treatment plan, adjusting goals, consulting with specialists, or initiating discharge planning.
- **Decline:** Score has worsened beyond the MDC — the patient's condition is deteriorating. This triggers an urgent clinical alert.

**(e) Rate of Change Analysis.** The engine calculates the rate of improvement per week or per session, enabling projection of expected timeframes for goal achievement.

#### 7.6 Authorization Generation Engine 260 (FIG. 10)

The Authorization Generation Engine 260 automatically generates payer-specific authorization requests for continued treatment. The engine operates as follows:

(i) **Payer Template Selection.** The system maintains a library of authorization request templates organized by payer (Medicare, Medicaid by state, UnitedHealthcare, Cigna, Aetna, Blue Cross Blue Shield by region, Tricare, etc.) and by service type (physical therapy, occupational therapy, speech-language pathology, behavioral health — individual therapy, group therapy, IOP, PHP, etc.). Each template defines the specific information fields required by that payer.

(ii) **Auto-Population from Outcome Data.** The engine populates the authorization template fields with data extracted from the outcome measurement database and clinical documentation, including: patient diagnosis (ICD-10), date of onset, initial outcome measure scores, current outcome measure scores, change scores with MDC/MCID analysis, functional limitation descriptions (extracted from the most recent clinical note), treatment goals (from the plan of care), current goal achievement percentage, interventions provided, frequency and duration requested, and medical necessity justification.

(iii) **Medical Necessity Narrative Generation.** The engine generates a medical necessity narrative that follows the logic chain: (1) diagnosis → (2) functional limitations → (3) outcome data demonstrating continued need → (4) treatment goals not yet achieved → (5) skilled services required because [specific reasons] → (6) without continued treatment, risk of [specific adverse outcomes]. For rehabilitation, this narrative incorporates the Jimmo v. Sebelius standard, including maintenance therapy justification when applicable.

(iv) **Plateau Detection and Response.** When the Trend Analysis Engine detects a plateau, the Authorization Generation Engine adapts its narrative strategy. Rather than documenting improvement (which is absent), the engine generates justification based on: maintenance of functional gains (per Jimmo v. Sebelius), prevention of decline, complexity of the condition requiring skilled services to maintain current level, and revised treatment approach addressing the plateau.

#### 7.7 Note Integration Module 270

The Note Integration Module 270 feeds outcome measurement data as structured input to the framework-driven clinical note generation system described in the first related application. Specifically:

- Scored outcome measures are injected into the corresponding documentation items in the selected framework. For example, in a PT Initial Evaluation framework, the "Functional Outcome Measure — General" item template `"DASH: __/100 | LEFS: __/80 | NDI: __% | ODI: __% | FOTO: __ | PROMIS: __ | Other: __"` is populated with the automatically scored values from the Outcome Measure Library.

- In a PT Re-evaluation framework, outcome measures appear with both current and baseline values, along with change scores and MDC/MCID classification, enabling the AI Generation Engine to generate comparison narratives (e.g., "DASH improved from 62/100 to 48/100, a change of 14 points exceeding both MDC (12.8) and MCID (10.2), indicating statistically and clinically significant improvement in upper extremity function").

- In behavioral health notes, PHQ-9 and GAD-7 scores are integrated into the Standardized Screening sections of the comprehensive psychiatric evaluation or therapy progress note frameworks. The AI Generation Engine references the severity classification and change from prior score in the clinical assessment.

#### 7.8 Population Health Dashboard 280 (FIG. 11)

The Population Health Dashboard 280 provides aggregate, de-identified outcome analytics across a clinician's caseload or across an organization. The dashboard supports:

- **Caseload Outcome Summary:** Color-coded display of all patients with their most recent outcome trajectory (Significant Improvement, Clinically Meaningful Improvement, No Meaningful Change, Plateau, Decline).
- **Quality Measure Calculation:** Automated calculation of quality measures for MIPS (Merit-based Incentive Payment System) reporting and HEDIS (Healthcare Effectiveness Data and Information Set) compliance. For example, the HEDIS measure "Follow-Up After Hospitalization for Mental Illness" (FUH) can be tracked by monitoring post-discharge PHQ-9 and GAD-7 scores.
- **Benchmarking:** Comparison of aggregate outcomes to published normative data, enabling clinicians and organizations to evaluate their performance relative to peers.
- **Research Export:** De-identified data export in standard formats (CSV, FHIR resources) for clinical research, with appropriate consent and IRB documentation tracking.

---

### 8. CLAIMS

**Independent Claims:**

**Claim 1.** A computer-implemented method for integrated clinical outcome measurement and documentation, comprising:
(a) maintaining, by a processor, an outcome measure library comprising a plurality of standardized clinical outcome instruments, each instrument stored with a scoring algorithm, normative data, a Minimal Detectable Change (MDC) value, and a Minimal Clinically Important Difference (MCID) value;
(b) collecting, during a clinical documentation encounter, response data for at least one outcome instrument from the outcome measure library;
(c) automatically scoring, by the processor using the stored scoring algorithm, the collected response data to produce at least a total score and a severity classification;
(d) storing the scored outcome data in a longitudinal score database with a time-stamped entry linked to a patient identifier and an episode of care identifier;
(e) performing, by a trend analysis engine, a comparison of a current score to at least one prior score for the same patient and instrument, the comparison comprising calculating a change score and comparing the change score to at least the MDC value and the MCID value for the instrument;
(f) generating a trend classification based on the comparison, the trend classification comprising at least one of: significant improvement, clinically meaningful improvement, no meaningful change, plateau, and decline; and
(g) integrating the scored outcome data and the trend classification into a clinical documentation note as structured data.

**Claim 2.** The method of Claim 1, wherein the outcome measure library comprises at least fifty standardized clinical outcome instruments spanning physical function, mental health, substance use, cognitive, and quality of life categories.

**Claim 3.** The method of Claim 1, further comprising:
(h) generating, by an authorization generation engine, a payer-specific authorization request populated with: the patient's diagnosis, initial and current outcome scores, change scores with MDC/MCID analysis, functional limitation descriptions, treatment goals, and a medical necessity narrative.

**Claim 4.** The method of Claim 3, wherein the medical necessity narrative follows a logic chain comprising: diagnosis linkage, functional limitation description, outcome data demonstrating continued need, unachieved treatment goals, skilled service justification, and risk of adverse outcome without continued treatment.

**Claim 5.** The method of Claim 3, wherein the authorization generation engine selects a payer-specific authorization template from a library of templates organized by payer and service type.

**Claim 6.** The method of Claim 1, wherein the trend classification of plateau triggers a clinical decision support alert recommending at least one of: treatment plan modification, goal adjustment, specialist consultation, and discharge planning initiation.

**Claim 7.** The method of Claim 1, wherein integrating the scored outcome data into a clinical documentation note comprises injecting scored values into format template fields of a documentation framework, the documentation framework comprising item-level documentation requirements with regulatory source citations.

**Claim 8.** The method of Claim 1, further comprising generating a population health dashboard displaying aggregate, de-identified outcome trends across a clinician's caseload, including quality measure calculations for at least one of MIPS and HEDIS reporting.

**Claim 9.** The method of Claim 1, wherein the trend analysis engine further calculates a rate of improvement per unit time and projects an expected timeframe for treatment goal achievement.

**Claim 10.** The method of Claim 1, wherein collecting response data comprises at least one of: receiving pre-encounter patient-completed instrument responses via electronic transmission, and receiving clinician-entered scores during the encounter via a documentation interface.

**Claim 11.** The method of Claim 1, wherein the plateau trend classification further triggers the authorization generation engine to generate maintenance therapy justification based on the Jimmo v. Sebelius standard.

**Claim 12.** The method of Claim 1, wherein for rehabilitation encounters, the outcome measure library includes CMS Section GG Self-Care and Mobility items scored on a 6-point scale in accordance with the IMPACT Act of 2014 and 42 CFR 485.645.

**System Claims:**

**Claim 13.** A system for integrated clinical outcome measurement and documentation, comprising:
(a) a memory storing an outcome measure library comprising a plurality of standardized clinical outcome instruments, each instrument stored with a scoring algorithm, normative data, an MDC value, and an MCID value;
(b) a longitudinal score database configured to store time-stamped outcome scores linked to patient identifiers and episodes of care;
(c) a processor configured to:
  (i) automatically score outcome instrument response data using the stored scoring algorithm;
  (ii) compare current scores to prior scores using the MDC and MCID values to generate trend classifications;
  (iii) integrate scored outcome data into clinical documentation notes; and
  (iv) generate payer-specific authorization requests populated with outcome data and medical necessity justification; and
(d) a population health dashboard configured to display aggregate de-identified outcome trends.

**Claim 14.** The system of Claim 13, further comprising a note integration module configured to inject scored outcome values and trend classifications into item-level format templates of a framework-driven clinical documentation system.

**Claim 15.** The system of Claim 13, wherein the processor is further configured to detect a decline trend classification and generate an urgent clinical alert.

**Claim 16.** The system of Claim 13, wherein the outcome measure library stores at least fifty instruments including at least the PHQ-9, GAD-7, C-SSRS, PCL-5, AUDIT, DASH, Oswestry Disability Index, Berg Balance Scale, Functional Independence Measure, and CMS Section GG items.

**Claim 17.** The system of Claim 13, wherein the authorization request comprises a medical necessity narrative generated by an artificial intelligence engine from outcome data, functional limitation descriptions, and treatment goals extracted from the longitudinal score database and linked clinical documentation.

---

### 9. ABSTRACT

A computer-implemented method and system for integrating standardized clinical outcome measurement into the clinical documentation workflow. The system maintains an outcome measure library of at least fifty validated instruments (including PHQ-9, GAD-7, DASH, Oswestry, Berg Balance Scale, FIM, C-SSRS, PCL-5, AUDIT, and CMS Section GG items), each stored with scoring algorithms, normative data, Minimal Detectable Change (MDC) values, and Minimal Clinically Important Difference (MCID) values. During clinical encounters, outcome instruments are administered and automatically scored. Scores are stored in a longitudinal database and analyzed by a trend analysis engine that compares changes to MDC and MCID thresholds, classifying patient trajectories as significant improvement, clinically meaningful improvement, no meaningful change, plateau, or decline. Scored outcome data integrates into framework-driven clinical notes as structured data. An authorization generation engine automatically produces payer-specific authorization requests populated with outcome data and medical necessity justification. A population health dashboard provides aggregate de-identified outcome analytics for quality reporting.

---
---

# PATENT APPLICATION III

## MULTI-PATIENT INDIVIDUALIZED DOCUMENTATION FROM GROUP CLINICAL SESSIONS

---

### 1. TITLE OF THE INVENTION

System and Method for Generating Individualized Clinical Documentation for Multiple Patients from a Single Group Therapy or Group Treatment Session Recording

---

### 2. CROSS-REFERENCE TO RELATED APPLICATIONS

This application is related to co-pending U.S. Provisional Patent Application No. [TBD], entitled "Framework-Driven Clinical Note Generation System and Method," and co-pending U.S. Provisional Patent Application No. [TBD], entitled "Integrated Clinical Outcome Measurement and Documentation System," both filed concurrently herewith and incorporated herein by reference in their entirety. The present invention employs the framework-driven note generation architecture of the first related application to generate individualized notes for each group participant, and integrates with the outcome measurement system of the second related application to incorporate per-patient outcome data into individual notes.

---

### 3. FIELD OF THE INVENTION

The present invention relates generally to clinical documentation systems and, more particularly, to computer-implemented methods and systems for recording a single group therapy or group treatment session involving multiple patients, performing multi-speaker diarization to identify individual participants, mapping speakers to patient records with individualized treatment goals, generating individualized clinical documentation for each participating patient based on their specific participation and treatment goals, and ensuring privacy segmentation such that each patient's documentation contains no protected health information (PHI) of other group participants.

---

### 4. BACKGROUND OF THE INVENTION

#### 4.1 The Group Therapy Documentation Problem

Group therapy and group treatment sessions are widely used across clinical disciplines. In behavioral health, group therapy modalities include Cognitive Behavioral Therapy (CBT) groups, Dialectical Behavior Therapy (DBT) skills groups, process therapy groups, substance use disorder (SUD) treatment groups, Intensive Outpatient Program (IOP) groups, and Partial Hospitalization Program (PHP) groups, typically billed under CPT 90853 (group psychotherapy). In rehabilitation, group treatment modalities include PT/OT group therapeutic activities, functional mobility groups, balance and falls prevention groups, and community reintegration groups, typically billed under CPT 97150 (group therapeutic procedures).

Despite the clinical prevalence of group sessions, documentation for group treatment presents a unique and unresolved challenge: **each patient in the group requires an individualized clinical note** that references only that patient's treatment goals, documents that patient's specific participation, assesses progress toward that patient's individual objectives, and contains no information about other patients in the group (per HIPAA Privacy Rule, 45 CFR 164). A single one-hour group session with eight patients therefore requires eight separate clinical notes — each individualized, each HIPAA-compliant, and each demonstrating medical necessity for that individual patient's participation.

Currently, clinicians address this documentation burden through one of several inadequate approaches:

**(a) Copy-Paste with Minimal Modification.** Clinicians write a generic group note and copy it across all patient charts, changing only the patient name. This practice fails to demonstrate individualized treatment, violates payer requirements for person-centered documentation, and constitutes a billing compliance risk — payers may deny reimbursement for notes that appear duplicative across patients.

**(b) Abbreviated Notes.** Clinicians write minimal notes for group sessions due to time constraints, documenting "patient attended group therapy" with limited individualized content. These notes fail to demonstrate medical necessity and are vulnerable to audit denials.

**(c) Post-Session Reconstruction.** Clinicians attempt to write individualized notes from memory after the group session has ended, a process that is time-consuming, inaccurate (memory for individual patient participation degrades rapidly with increasing group size), and clinically risky.

#### 4.2 Limitations of Prior Art

No commercially available AI clinical documentation system addresses group therapy documentation. Existing AI scribes are designed for one-on-one clinical encounters (one clinician, one patient). They do not support: multi-speaker diarization beyond two speakers; mapping of multiple speakers to multiple patient records; retrieval of individualized treatment goals for each participant; generation of multiple distinct clinical notes from a single recording; or privacy segmentation to ensure cross-patient information isolation.

The behavioral health documentation frameworks described in the first related application include a Group Therapy Progress Note (subtype 2.2 within Framework 2: Therapy & Progress Notes), which provides 23 documentation items including individual patient note templates for up to 8 patients. However, this framework defines the documentation requirements — it does not address the computational challenge of automatically generating individualized notes from a single group session recording.

#### 4.3 The Need for the Present Invention

What is needed is a system capable of: recording a single group session; identifying individual speakers within the group; mapping each speaker to their patient record and treatment goals; analyzing each patient's participation, responses, behaviors, and progress indicators; generating a complete, individualized clinical note for each patient; ensuring that each note contains no PHI of other group participants; and supporting both rehabilitation and behavioral health group documentation requirements.

---

### 5. SUMMARY OF THE INVENTION

The present invention provides a computer-implemented method and system for generating individualized clinical documentation for each of a plurality of patients who participate in a single group therapy or group treatment session. The method comprises: (a) recording audio of a group clinical session involving a clinician facilitator and a plurality of patients; (b) transcribing the audio with multi-speaker diarization to identify individual speakers; (c) mapping identified speakers to patient records in a patient database, each patient record comprising individualized treatment goals, target behaviors, and baseline outcome measures; (d) extracting, for each patient, the portions of the transcript in which that patient speaks, is addressed by the clinician, or is discussed by the clinician in observational notes; (e) analyzing each patient's transcript segments against their individualized treatment goals to assess participation level, behavioral observations, and progress indicators; (f) generating, for each patient, an individualized clinical note using a framework-driven note generation system, the note referencing only that patient's goals and participation; (g) performing privacy verification to confirm that each patient's note contains no PHI of other group participants; and (h) outputting individualized notes for each patient.

---

### 6. BRIEF DESCRIPTION OF THE DRAWINGS

**FIG. 12** is a system architecture diagram illustrating the multi-patient individualized documentation system, showing the data flow from Group Session Recording through Multi-Speaker Diarization, Speaker-to-Patient Mapping, Individual Goal Retrieval, Per-Patient Transcript Extraction, Framework-Driven Individual Note Generation, Privacy Verification, and Individual Notes Output.

**FIG. 13** is a detailed diagram illustrating the Speaker-to-Patient Mapping process, showing voice enrollment, speaker identification, manual assignment interface, and patient record linkage.

**FIG. 14** is a flow diagram illustrating the Per-Patient Transcript Extraction process, showing how the full group transcript is segmented into per-patient transcript subsets, including direct speech, clinician-directed interactions, and observational segments.

**FIG. 15** is a flow diagram illustrating the Privacy Verification process, showing cross-reference checking of each patient's note against all other patients' PHI (names, identifiers, unique clinical details) to ensure no cross-contamination.

**FIG. 16** is a diagram illustrating the Supervision Documentation Layer, showing how supervision notes are generated alongside treatment notes when the group is led by a supervised clinician.

---

### 7. DETAILED DESCRIPTION OF PREFERRED EMBODIMENTS

#### 7.1 System Architecture Overview (FIG. 12)

Referring now to FIG. 12, the multi-patient individualized documentation system 300 comprises the following components:

A **Group Session Recording Module 310** captures audio from a group clinical session. The module is configured to capture multi-channel audio when available (e.g., multiple microphones positioned to capture individual speakers), or single-channel audio from a central microphone. The module supports group sizes of 2 to 12 participants (plus the clinician facilitator and optional co-facilitator), consistent with typical group therapy sizes in both behavioral health (6-12 per AGPA Standards) and rehabilitation (2-6 for functional groups per CMS guidelines for CPT 97150). The recording module supports session durations from 30 minutes to 120 minutes, corresponding to typical group session lengths.

A **Multi-Speaker Diarization Module 320** processes the group audio recording to identify and distinguish individual speakers. Unlike the two-speaker diarization of the first related application (which distinguishes only clinician from patient), the Multi-Speaker Diarization Module 320 must identify and label each distinct speaker in a multi-party conversation. In a preferred embodiment, the module employs:

(i) **Voice Enrollment.** Prior to the first group session, each patient provides a voice sample (10-30 seconds of speech). The system extracts a voice embedding (a mathematical representation of the speaker's vocal characteristics) and stores it in the patient database linked to the patient record. The clinician facilitator and any co-facilitators also provide voice samples.

(ii) **Speaker Identification.** During or after the group session recording, the system compares speech segments to enrolled voice embeddings to identify each speaker. Modern speaker identification models achieve >95% accuracy with enrolled speakers in controlled environments.

(iii) **Manual Assignment Interface.** For speech segments that cannot be confidently assigned to an enrolled speaker (e.g., due to crosstalk, low confidence, or non-enrolled speakers such as guests), the system presents the unassigned segments to the clinician for manual speaker assignment.

(iv) **Clinician Labeling.** The clinician facilitator is always identified as a distinct speaker class. Clinician speech directed at specific patients is tagged with the target patient identifier based on contextual analysis (e.g., "John, tell us about your homework this week" → clinician speech directed at patient "John").

A **Speaker-to-Patient Mapping Module 330** (FIG. 13) links identified speakers to patient records in the patient database. Each patient record comprises:

- Patient demographic information (name, MRN, DOB, diagnoses)
- Individualized treatment goals: short-term goals (STG) and long-term goals (LTG) from the patient's current treatment plan. For behavioral health, these are treatment plan objectives (e.g., "Patient will demonstrate use of 3 DBT distress tolerance skills when experiencing urges, as documented in group sessions, 4 out of 5 sessions"). For rehabilitation, these are functional goals (e.g., "Patient will demonstrate independent sit-to-stand transfer from standard chair height without upper extremity support in 3 out of 5 attempts")
- Target behaviors: specific behaviors the clinician is monitoring for each patient
- Baseline outcome measures: most recent scored outcome instruments (PHQ-9, GAD-7, FIM, Berg Balance Scale, etc., as described in the second related application)
- Current treatment plan: interventions, frequency, duration, and medical necessity justification
- Billing information: applicable CPT codes (90853 for behavioral health group therapy, 97150 for rehabilitation group treatment)

An **Individual Goal Retrieval Module 340** retrieves the treatment goals, target behaviors, and current outcome data for each mapped patient from the patient database. This data is passed to the note generation module to enable goal-specific documentation.

A **Per-Patient Transcript Extraction Module 350** (FIG. 14) creates individualized transcript subsets for each patient. For each patient P_i in the group, the extraction module compiles:

(i) **Direct Speech Segments:** All transcript segments identified as spoken by P_i (via diarization and speaker mapping).

(ii) **Clinician-to-Patient Segments:** All clinician speech segments directed at P_i, identified by: explicit name/pronoun reference in the clinician's speech, sequential turn-taking patterns (clinician speaks, P_i responds), and contextual topic analysis (clinician discusses P_i's treatment goals).

(iii) **Observational Segments:** Clinician speech that contains observational notes about P_i's behavior, affect, or participation (e.g., "I notice that Sarah has been quiet today" or "Excellent demonstration of the coping technique, Michael").

(iv) **Group Content Segments:** General group content (psychoeducation, skill instruction, facilitator-led discussion) that was presented to all participants. This content is not attributed to any individual patient but is included in each patient's note as the group session content.

Critically, the extraction module **excludes** from P_i's transcript subset any speech by or specific clinical observations about other patients P_j (where j ≠ i). Patient P_i's transcript contains only: P_i's own speech, clinician speech directed at P_i, clinician observations of P_i, and general group content shared with all participants.

A **Framework-Driven Individual Note Generation Module 360** generates an individualized clinical note for each patient using the framework-driven note generation architecture described in the first related application. For each patient P_i, the module:

(i) Selects the appropriate documentation framework based on the group type. For behavioral health groups, the system selects the Group Therapy Progress Note subtype (Framework 2, Subtype 2.2) from the Behavioral Health domain, which includes 23 items per the behavioral health frameworks. For rehabilitation groups, the system selects the appropriate Progress Note subtype (PT, OT, or SLP) from the Rehabilitation domain.

(ii) Compiles the framework items into a patient-specific prompt that includes: the patient's treatment goals from the Individual Goal Retrieval Module 340; the patient's per-patient transcript subset from the Per-Patient Transcript Extraction Module 350; the patient's current outcome data from the integrated outcome measurement system (second related application); and instructions to generate a note documenting this specific patient's participation, progress, and clinical status.

(iii) Generates the individualized clinical note. For behavioral health groups, the note includes: group session identification (group name, date, session number, duration, CPT code), patient-specific content including participation level (active/moderate/minimal), content shared by the patient, affect observed, interventions directed at the patient, progress on the patient's specific treatment goals, and risk assessment. For rehabilitation groups, the note includes: skilled interventions provided (with CPT codes and time), the patient's response to treatment, objective measurements, goal progress, and medical necessity for continued treatment.

(iv) Integrates outcome data from the second related application. If the patient had outcome measures administered during or before the group session, the scored results and trend analysis are incorporated into the individual note.

A **Privacy Verification Module 370** (FIG. 15) performs automated cross-patient data checking on each generated note. For each patient P_i's generated note, the module:

(i) Compiles a PHI reference list for all other patients P_j (j ≠ i) in the group, including: names, initials, MRNs, dates of birth, unique diagnoses, unique medications, distinctive clinical details, and any other identifying information.

(ii) Scans P_i's note for any occurrence of P_j's PHI. The scan includes: exact string matching, fuzzy string matching (to catch misspellings or partial matches), semantic analysis (to detect paraphrased references to other patients), and pronoun resolution (to detect references like "another group member reported suicidal ideation" that could identify another patient in small groups).

(iii) If any cross-patient PHI is detected, the module: flags the specific text, redacts or removes the flagged content, and generates an alert for clinician review before the note is finalized.

(iv) Generates a privacy verification certificate for each note, documenting that the cross-patient PHI check was performed and passed (or noting any flagged items that required clinician review).

A **Supervision Documentation Module 380** (FIG. 16) generates supervision documentation when the group session is led by a supervised clinician (e.g., a pre-licensed therapist, a clinical intern, or a PTA/OTA working under a supervising PT/OT). The module:

(i) Identifies the supervision relationship from the clinician profile (supervisee → supervisor linkage).

(ii) Generates a supervision note documenting: date of supervision, type (direct observation of group session), supervisee's clinical performance, feedback provided, clinical issues discussed, cases reviewed, and supervisee's progress toward independent practice competencies.

(iii) Links the supervision note to the individual patient notes generated from the same session, creating a complete documentation chain for regulatory compliance.

(iv) Tracks supervised hours for licensure board reporting, maintaining a running total per supervision period.

#### 7.2 Behavioral Health Group Therapy Application

In a behavioral health group therapy setting, the system operates as follows:

**Example — DBT Skills Group.** A licensed clinical social worker (LCSW) facilitates a weekly DBT skills group with 8 patients in an IOP setting. Each patient has individualized treatment goals related to DBT skill acquisition (e.g., "Patient will demonstrate use of TIPP skills during distress" or "Patient will identify 3 interpersonal effectiveness strategies and practice DEAR MAN in role-play"). The clinician records the 90-minute group session. After the session:

1. Multi-Speaker Diarization identifies 9 speakers (1 facilitator + 8 patients).
2. Speaker-to-Patient Mapping links each speaker to their patient record.
3. For Patient A, the system retrieves goals: "Demonstrate use of 3 distress tolerance skills" and "Reduce PHQ-9 from 18 (moderately severe) to 10 (moderate) within 8 weeks."
4. Per-Patient Transcript Extraction compiles: Patient A's verbal contributions (e.g., reporting on homework, participating in role-play, asking questions), clinician feedback directed at Patient A, and general group psychoeducation content (TIPP skills instruction).
5. The system generates Patient A's individual group therapy note: documents Patient A's active participation in the TIPP skills psychoeducation module, notes Patient A's report of using ice diving technique during a crisis this week (linking to goal #1 — distress tolerance skill use), documents the clinician's feedback that Patient A demonstrated understanding, notes Patient A's current affect and risk level, and records progress toward goals.
6. Privacy Verification confirms that Patient A's note contains no information about Patients B through H.
7. The note suggests CPT 90853 (group psychotherapy) with appropriate time documentation.

This process repeats simultaneously for all 8 patients, generating 8 individualized notes from a single recording.

#### 7.3 Rehabilitation Group Treatment Application

In a rehabilitation group treatment setting, the system operates as follows:

**Example — PT Balance Group.** A physical therapist conducts a 45-minute balance and falls prevention group with 4 patients. Each patient has individualized balance goals and baseline Berg Balance Scale scores (from the integrated outcome measurement system). The session includes: group warm-up exercises, individualized balance challenges (tandem stance, single-leg stance, reactive balance activities), gait training on varied surfaces, and cool-down.

1. Multi-Speaker Diarization identifies 5 speakers (1 PT + 4 patients).
2. For Patient C, the system retrieves goals: "Improve BBS from 38/56 to 45/56 within 6 weeks" and "Independent ambulation on uneven surfaces with single-point cane."
3. Per-Patient Transcript Extraction compiles: clinician instructions directed at Patient C (e.g., "Now try tandem stance with eyes closed, Patient C"), Patient C's verbal responses (e.g., "I feel more stable today"), and clinician observations (e.g., "Patient C maintained tandem stance for 15 seconds, improved from 8 seconds last week").
4. The system generates Patient C's individual progress note: documents skilled interventions (therapeutic exercise 97110, neuromuscular re-education 97112, gait training 97116) with time per intervention, documents Patient C's performance and response, notes improvement in tandem stance duration, assesses progress toward BBS goal, documents medical necessity for continued skilled PT services, and calculates 8-minute rule units.
5. Privacy Verification confirms isolation from other patients' data.
6. The note suggests CPT 97150 (group therapeutic procedures) with time documentation.

#### 7.4 Billing Code Alignment

The system includes a billing code alignment module that suggests appropriate group therapy billing codes for each individual patient note:

- **Behavioral Health:** CPT 90853 (Group Psychotherapy — all types of group therapy except family), CPT 90849 (Multiple Family Group Psychotherapy), with documentation supporting medical necessity for each individual patient's participation in the group.
- **Rehabilitation:** CPT 97150 (Group Therapeutic Procedures — services provided to 2 or more patients simultaneously), with individual time documentation supporting the 8-Minute Rule for unit calculation.
- **Modifier application:** The system applies appropriate modifiers (e.g., GP for physical therapy, GO for occupational therapy, GN for speech-language pathology under Medicare Part B).

---

### 8. CLAIMS

**Independent Claims:**

**Claim 1.** A computer-implemented method for generating individualized clinical documentation for a plurality of patients from a single group clinical session, comprising:
(a) recording, by an audio capture device, an audio recording of a group clinical session involving a clinician facilitator and a plurality of patients;
(b) transcribing, by a processor using an automatic speech recognition engine, the audio recording to produce a text transcript;
(c) performing multi-speaker diarization on the text transcript to identify individual speakers, including the clinician facilitator and each of the plurality of patients;
(d) mapping, by the processor, each identified patient speaker to a corresponding patient record in a patient database, each patient record comprising individualized treatment goals;
(e) extracting, for each patient, a per-patient transcript subset comprising: speech segments of that patient, clinician speech segments directed at that patient, and general group content segments shared with all participants, while excluding speech segments and clinical observations specific to other patients;
(f) generating, by an artificial intelligence generation engine, an individualized clinical note for each patient using the patient's per-patient transcript subset and the patient's individualized treatment goals from the patient record;
(g) performing, by a privacy verification module, a cross-patient data check on each generated individualized clinical note to verify that no protected health information of other patients is present in the note; and
(h) outputting the individualized clinical notes.

**Claim 2.** The method of Claim 1, wherein mapping each identified patient speaker to a patient record comprises comparing a voice embedding extracted from the speaker's speech to voice embeddings stored in the patient database from prior voice enrollment.

**Claim 3.** The method of Claim 1, wherein the individualized treatment goals comprise at least one of: short-term treatment goals, long-term treatment goals, target behaviors, and baseline outcome measure scores.

**Claim 4.** The method of Claim 1, wherein generating the individualized clinical note comprises selecting a documentation framework from a framework database based on the type of group session and generating the note using item-level documentation requirements from the selected framework.

**Claim 5.** The method of Claim 4, wherein for behavioral health group sessions, the documentation framework comprises a group therapy progress note subtype including documentation items for: group session identification, group topic, group process observations, and individual patient participation, affect, and goal progress.

**Claim 6.** The method of Claim 4, wherein for rehabilitation group sessions, the documentation framework comprises a rehabilitation progress note subtype including documentation items for: skilled interventions with CPT codes, time per intervention, patient response, objective measurements, and medical necessity justification.

**Claim 7.** The method of Claim 1, wherein the privacy verification module performs at least: exact string matching against other patients' names and identifiers, fuzzy string matching, semantic analysis for paraphrased references to other patients, and pronoun resolution to detect indirect references.

**Claim 8.** The method of Claim 1, further comprising generating a billing code suggestion for each patient, the billing code suggestion comprising at least one of: CPT 90853 for behavioral health group psychotherapy and CPT 97150 for rehabilitation group therapeutic procedures.

**Claim 9.** The method of Claim 1, further comprising generating supervision documentation when the clinician facilitator is identified as a supervised clinician, the supervision documentation comprising: date of supervision, supervisee clinical performance, feedback provided, and cases reviewed.

**Claim 10.** The method of Claim 9, further comprising tracking supervised clinical hours for licensure board reporting.

**Claim 11.** The method of Claim 1, wherein extracting a per-patient transcript subset further comprises identifying clinician speech directed at a specific patient based on at least one of: explicit name reference in the clinician's speech, sequential turn-taking patterns, and contextual topic analysis matching clinician speech to the patient's treatment goals.

**Claim 12.** The method of Claim 1, further comprising integrating scored outcome measurement data for each patient into the patient's individualized clinical note, the outcome measurement data comprising at least a current score, a baseline score, a change score, and a trend classification.

**Claim 13.** The method of Claim 1, wherein the group clinical session comprises between 2 and 12 patients.

**Claim 14.** The method of Claim 1, wherein the privacy verification module generates a privacy verification certificate for each individualized clinical note documenting that the cross-patient data check was performed and passed.

**System Claims:**

**Claim 15.** A system for generating individualized clinical documentation for a plurality of patients from a single group clinical session, comprising:
(a) an audio capture module configured to record a group clinical session involving a clinician facilitator and a plurality of patients;
(b) a memory storing a patient database comprising patient records, each patient record including individualized treatment goals;
(c) a processor configured to:
  (i) transcribe the group session recording with multi-speaker diarization to identify individual speakers;
  (ii) map identified speakers to patient records in the patient database;
  (iii) extract per-patient transcript subsets excluding other patients' clinical information;
  (iv) generate individualized clinical notes for each patient using the patient's transcript subset and treatment goals; and
  (v) verify that each note contains no protected health information of other patients; and
(d) an output module configured to present the individualized clinical notes.

**Claim 16.** The system of Claim 15, further comprising a voice enrollment module configured to store voice embeddings for each patient, the voice embeddings used by the processor for speaker identification during multi-speaker diarization.

**Claim 17.** The system of Claim 15, further comprising a supervision documentation module configured to generate supervision notes and track supervised clinical hours when the clinician facilitator is a supervised clinician.

**Claim 18.** The system of Claim 15, wherein the processor is further configured to generate a billing code suggestion for each patient, the billing code suggestion selected based on the type of group session and the clinical domain.

**Claim 19.** The system of Claim 15, wherein the privacy verification is performed prior to storing or transmitting any individualized clinical note, and no note is released without a passed privacy verification.

**Claim 20.** The system of Claim 15, further comprising integration with an outcome measurement system configured to inject scored outcome data and trend classifications into each patient's individualized clinical note.

---

### 9. ABSTRACT

A computer-implemented method and system for generating individualized clinical documentation for each of a plurality of patients who participate in a single group therapy or group treatment session. The system records the group session audio, transcribes with multi-speaker diarization to identify individual participants, maps speakers to patient records containing individualized treatment goals, and extracts per-patient transcript subsets that include each patient's speech and clinician interactions while excluding other patients' information. For each patient, the system generates an individualized clinical note using a framework-driven note generation architecture, referencing only that patient's goals and participation. A privacy verification module performs cross-patient data checks to ensure no protected health information of other patients appears in any individual note. The system supports both behavioral health group therapy (CPT 90853) and rehabilitation group treatment (CPT 97150), includes billing code alignment, and optionally generates supervision documentation when the group is led by a supervised clinician.

---
---

# APPENDIX: REGULATORY SOURCE MASTER LIST

The following regulatory sources are referenced throughout the three patent applications above:

| Source | Full Name | Scope |
|--------|-----------|-------|
| AMA CPT E/M 2021 | American Medical Association Current Procedural Terminology, Evaluation and Management Guidelines (2021 revision) | E/M leveling, MDM complexity, time-based billing |
| CMS 1995 DG | CMS 1995 Documentation Guidelines for Evaluation and Management Services | History, exam, MDM requirements |
| CMS 1997 DG | CMS 1997 Documentation Guidelines for Evaluation and Management Services | Detailed exam requirements, 14-system ROS, HPI elements |
| CMS 42 CFR 410.60 | Code of Federal Regulations, Title 42, §410.60 | Physical therapy coverage and payment |
| CMS 42 CFR 410.62 | Code of Federal Regulations, Title 42, §410.62 | Speech-language pathology coverage and payment |
| CMS 42 CFR 410.59 | Code of Federal Regulations, Title 42, §410.59 | Occupational therapy coverage and payment |
| CMS 42 CFR 410.15 | Code of Federal Regulations, Title 42, §410.15 | Annual Wellness Visit requirements |
| CMS 42 CFR 414.510 | Code of Federal Regulations, Title 42, §414.510 | Chronic Care Management requirements |
| CMS 42 CFR 482-485 | Code of Federal Regulations, Title 42, §§482-485 | Conditions of Participation for hospitals and facilities |
| Medicare Ch.15 §220-230 | Medicare Benefit Policy Manual, Chapter 15, §§220-230 | Rehabilitation services coverage criteria |
| CMS 8-Minute Rule | CMS Time-Based Billing for Rehabilitation Services | Unit calculation for timed CPT codes |
| CMS Section GG | CMS Standardized Patient Assessment Data (IMPACT Act 2014) | Functional assessment across post-acute settings |
| 42 CFR 485.645 | Code of Federal Regulations, Title 42, §485.645 | Section GG implementation |
| Jimmo v. Sebelius | Settlement Agreement, Jimmo v. Sebelius (2013) | Maintenance therapy coverage standard |
| Joint Commission | The Joint Commission Standards | National Patient Safety Goals, Universal Protocol, RC.02.01.01 |
| EMTALA | Emergency Medical Treatment and Labor Act (42 USC §1395dd) | Emergency screening and stabilization |
| APTA Guide 3.0 | APTA Guide to Physical Therapist Practice 3.0 | PT practice standards, documentation |
| AOTA OTPF-4 | AOTA Occupational Therapy Practice Framework 4th Edition | OT practice standards |
| ASHA | American Speech-Language-Hearing Association Practice Portal | SLP practice standards |
| APA | American Psychiatric Association Practice Guidelines | Psychiatric evaluation and treatment standards |
| DSM-5-TR | Diagnostic and Statistical Manual of Mental Disorders, 5th Ed., Text Revision | Diagnostic classification |
| SAMHSA | Substance Abuse and Mental Health Services Administration | SUD treatment guidelines, Recovery Model |
| ASAM 4th Ed. | American Society of Addiction Medicine Criteria, 4th Edition | SUD level of care determination |
| 42 CFR Part 2 | Federal Confidentiality of SUD Patient Records | SUD privacy protections |
| HIPAA | Health Insurance Portability and Accountability Act (45 CFR 164) | Privacy and security of PHI |
| MHPAEA | Mental Health Parity and Addiction Equity Act | Parity in MH/SUD coverage |
| HEDIS | Healthcare Effectiveness Data and Information Set | Quality measures |
| MIPS | Merit-based Incentive Payment System | Quality reporting |
| AGPA | American Group Psychotherapy Association Standards | Group therapy practice standards |
| C-SSRS | Columbia Suicide Severity Rating Scale | Suicide risk assessment |
| CARF | Commission on Accreditation of Rehabilitation Facilities | Rehabilitation accreditation |
| ICF | International Classification of Functioning, Disability and Health (WHO) | Functional classification framework |
| CDC STEADI | Stopping Elderly Accidents, Deaths & Injuries | Fall risk screening |
| USPSTF | U.S. Preventive Services Task Force | Preventive screening recommendations |
| ACC/AHA | American College of Cardiology / American Heart Association | Cardiovascular guidelines |
| FDA | U.S. Food and Drug Administration | Drug labeling, interactions |

---

**END OF PROVISIONAL PATENT APPLICATIONS**

*Note: These are draft provisional patent applications prepared for initial filing to establish priority dates. Prior to filing, these documents should be reviewed by a registered patent attorney for compliance with 35 U.S.C. §111(b) and to ensure adequate disclosure under 35 U.S.C. §112. Formal (non-provisional) patent applications with professional patent drawings should be filed within 12 months of the provisional filing date.*
