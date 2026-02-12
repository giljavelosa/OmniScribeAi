# OmniScribe AI -- Medical Documentation Frameworks
## SOAP, H&P, & Procedure Note Template Data Sets

---

### What This Document Is

This document contains evidence-based documentation items for three primary medical documentation frameworks used across clinical medicine:

1. **SOAP (Subjective, Objective, Assessment, Plan)** -- Progress notes for outpatient and primary care encounters
2. **H&P (History & Physical)** -- Comprehensive evaluations for admissions, consultations, pre-operative clearance, and emergency care
3. **Procedure Note** -- Intervention-focused documentation for office procedures through full operative reports

Each framework captures clinical encounters but organizes information differently based on encounter type, clinical setting, documentation purpose, and regulatory requirements. A SOAP note tracks a patient's ongoing care trajectory. An H&P establishes a complete clinical picture at a single point in time. A Procedure Note documents a specific intervention from indication through outcome.

**The key design principle:** OmniScribe's AI engine captures everything during the clinical encounter -- the full conversation, examination findings, clinical reasoning, and decision-making -- then formats the captured data into the appropriate framework and subtype selected by the provider. The provider does not need to think about structure during the encounter. They speak naturally, examine the patient, and make clinical decisions. OmniScribe organizes.

Each item in every framework uses the same format:

| Item Label | `"format template with __ blanks and | pipes separating discrete data elements"` | Source |

Double underscores (`__`) mark fields the AI populates from encounter data. Pipes (`|`) separate discrete data elements within a single item. Sources reference real clinical guidelines, coding standards, validated instruments, and regulatory frameworks.

---

### Framework Comparison

| Dimension | SOAP (Progress Notes) | H&P (History & Physical) | Procedure Note |
|-----------|----------------------|--------------------------|----------------|
| **Primary Purpose** | Document ongoing clinical encounters, track patient progress, and support E/M billing | Establish a comprehensive clinical baseline at a single point in time | Document a specific intervention -- what was done, how, what was found, and outcome |
| **When Used** | Every outpatient visit -- new patient, follow-up, annual wellness, acute/same-day, chronic care management | Hospital admission, new patient evaluation, formal consultation, pre-operative clearance, ED encounters | Any procedure -- office (laceration repair, injection), surgical (OR cases), diagnostic (endoscopy, biopsy), or interventional |
| **Who Uses It** | Primary care (MD, DO, PA-C, NP, DNP), family medicine, internal medicine, pediatrics, all outpatient specialties | Hospitalists, surgeons, emergency physicians, consultants, all admitting providers | Any provider performing a procedure -- surgeons, primary care, specialists, ED physicians |
| **Documentation Depth** | Scaled to encounter complexity (straightforward to high MDM); focused on interval changes for established patients | Deepest and broadest -- full history, 14-system ROS, multi-system exam, complete PMSFH | Laser-focused on the procedure itself; pre-procedure justification, step-by-step technique, intra-procedure findings, post-procedure status |
| **Section Structure** | Subjective (S), Objective (O), Assessment (A), Plan (P), Medical Necessity (MN) | Chief Complaint (CC), HPI, ROS, PMSFH, Physical Examination (PE), Assessment & Plan (A&P), Medical Necessity | Pre-Procedure, Procedure Details, Intra-Procedure Findings, Post-Procedure, Medical Necessity |
| **Subtypes (5 each)** | New Patient Visit, Established Patient Follow-Up, Annual Wellness Visit, Acute/Same-Day Visit, Chronic Care Management | Comprehensive H&P (Hospital Admission), Focused H&P (Problem-Specific), Consultation H&P, Pre-Operative H&P, Emergency Department H&P | Minor Office Procedure, Major/Surgical Procedure, Injection/Aspiration, Diagnostic Procedure, Biopsy/Excision |
| **Typical Item Count** | 32-51 items per subtype | 30-50 items per subtype | 28-47 items per subtype |
| **Regulatory Basis** | AMA CPT E/M Guidelines 2021, CMS 1995/1997 Documentation Guidelines, CMS AWV (42 CFR 410.15), CMS CCM (42 CFR 414.510) | CMS 1995/1997 Documentation Guidelines, AMA CPT E/M 2021, Joint Commission RC.02.01.01, CMS Conditions of Participation, EMTALA | AMA CPT Surgical Guidelines, Joint Commission Universal Protocol, CMS Operative Report Requirements, CMS LCD/NCD, SCIP/Core Measures |
| **Billing Codes** | 99202-99215 (Office E/M), G0438/G0439 (AWV), 99490/99491 (CCM), 99281-99285 (ED-based acute) | 99221-99223 (Initial Hospital), 99202-99215 (Outpatient), 99242-99255 (Consultation), 99281-99285 (ED) | CPT procedure codes by type (12001-13160 wound repair, 20600-20611 injections, 10000-69990 surgical, etc.) |
| **MDM Relevance** | Central -- E/M level selection driven by MDM complexity or total time | Central for admission leveling and consultation complexity | Not used for procedure coding; procedure complexity drives code selection; medical necessity drives indication |

---

### How the Three Frameworks Relate

The three frameworks are not competing alternatives -- they serve different documentation purposes within the same patient's care:

- A patient admitted to the hospital gets an **H&P** (Comprehensive H&P subtype) on admission, then daily **SOAP** progress notes during their stay. If they undergo surgery, a **Procedure Note** documents the operation.
- An outpatient visits their primary care provider for a follow-up (**SOAP** -- Established Patient Follow-Up subtype). During the visit, the provider performs a joint injection (**Procedure Note** -- Injection/Aspiration subtype). Both notes are generated from the same encounter.
- A patient presents to the Emergency Department and receives an **H&P** (ED H&P subtype). The ED physician performs a laceration repair (**Procedure Note** -- Minor Office Procedure subtype). A specialist is called for consultation (**H&P** -- Consultation H&P subtype).

OmniScribe's engine captures the encounter once and can output documentation in any of the three frameworks simultaneously when multiple documentation types are generated from a single encounter.

---

### Applicable Provider Types

These medical documentation frameworks are designed for the following provider types:

| Provider Type | Abbreviation | Notes |
|---------------|-------------|-------|
| Doctor of Medicine | MD | Full framework access; all subtypes |
| Doctor of Osteopathic Medicine | DO | Full framework access; all subtypes; same data sets as MD |
| Physician Assistant - Certified | PA-C | Aliases to MD/DO data sets; same items, same templates |
| Nurse Practitioner | NP | Aliases to MD/DO data sets; same items, same templates |
| Doctor of Nursing Practice | DNP | Aliases to MD/DO data sets; same items, same templates |

**Note on aliasing:** PA-C, NP, and DNP providers use the same documentation data sets as MD/DO providers. The clinical documentation requirements, E/M coding rules, and medical necessity standards are identical across these provider types. This mirrors the approach used on the rehabilitation side, where PTA aliases to PT data sets. The AI engine does not reduce or modify documentation requirements based on provider type -- the framework and subtype selection drives the template, not the credential.

---

### Regulatory Sources Governing These Frameworks

The documentation items across all three frameworks are grounded in the following regulatory and standards bodies:

| Source | Scope |
|--------|-------|
| **AMA CPT/E&M Guidelines (2021)** | E/M leveling, MDM complexity, time-based billing, surgical coding |
| **CMS 1995 Documentation Guidelines** | History, exam, and MDM requirements for E/M services |
| **CMS 1997 Documentation Guidelines** | Detailed single-organ and multi-system exam requirements; 14-system ROS; HPI elements |
| **CMS Conditions of Participation (42 CFR 482-485)** | Hospital and facility documentation requirements |
| **CMS LCD/NCD Coverage Determinations** | Medical necessity criteria for procedures and services |
| **USPSTF (U.S. Preventive Services Task Force)** | Grade A/B preventive screening and counseling recommendations |
| **ACC/AHA (American College of Cardiology / American Heart Association)** | Cardiovascular evaluation, perioperative risk, treatment guidelines |
| **AAN (American Academy of Neurology)** | Neurological assessment and documentation standards |
| **ACEP (American College of Emergency Physicians)** | ED documentation, triage, disposition, clinical policies |
| **AAP (American Academy of Pediatrics)** | Pediatric screening, developmental assessment, immunization |
| **ADA (American Diabetes Association)** | Standards of medical care in diabetes |
| **CDC (Centers for Disease Control and Prevention)** | Immunization schedules, infection control, STEADI fall prevention, opioid prescribing |
| **Joint Commission** | National Patient Safety Goals (NPSGs), universal protocol, medication reconciliation, cultural competency |
| **IHS (Indian Health Service)** | Indian Health Manual, clinical standards, PRC/CHS referral guidelines, community health programs |
| **42 CFR 136** | Eligibility and services for Indian Health Service |
| **EMTALA (42 USC 1395dd)** | Emergency screening and stabilization requirements |
| **ASA (American Society of Anesthesiologists)** | Pre-anesthesia evaluation, sedation monitoring, airway management |
| **AORN (Association of periOperative Registered Nurses)** | Perioperative practice guidelines, surgical safety |
| **WHO (World Health Organization)** | Surgical Safety Checklist, ICF Framework |

---

### How Subtypes Work

Each of the three frameworks contains **5 subtypes** representing different encounter types within that framework's scope.

**The selection flow:**

1. **Framework Selection** -- The provider (or OmniScribe's AI based on encounter context) selects one of the three frameworks: SOAP, H&P, or Procedure Note.
2. **Subtype Selection** -- Within the selected framework, the provider selects one of 5 subtypes that matches the encounter type.
3. **Default Template Loads** -- The selected framework + subtype combination loads a default set of documentation items with format templates and source citations.
4. **Provider Customization** -- Providers can add or remove items from the default template to match the specific encounter's needs. Not every item is required for every encounter -- the template represents the comprehensive set from which the provider selects.
5. **Specialty Add-Ons** -- Specialty-specific item sets layer additional documentation items on top of the base template. A cardiologist using the SOAP framework's Established Patient Follow-Up subtype would see general medicine items plus cardiology-specific items (e.g., NYHA classification, echo findings, anticoagulation management).
6. **Cross-Framework Add-Ons** -- Part 4 of this document defines items that apply across ALL frameworks and subtypes -- red flag screening, medication reconciliation, SDOH, fall risk, advance care planning, infection control, pain assessment, tribal/IHS cultural competency, and telehealth documentation. These are always available regardless of framework or subtype selection.

**Subtype inventory:**

| Framework | Subtype 1 | Subtype 2 | Subtype 3 | Subtype 4 | Subtype 5 |
|-----------|-----------|-----------|-----------|-----------|-----------|
| **SOAP** | New Patient Visit (99202-99205) | Established Patient Follow-Up (99211-99215) | Annual Wellness Visit (G0438/G0439) | Acute/Same-Day Visit (99202-99215 / 99281-99285) | Chronic Care Management (99490/99491) |
| **H&P** | Comprehensive H&P (Hospital Admission) | Focused H&P (Problem-Specific) | Consultation H&P | Pre-Operative H&P | Emergency Department H&P |
| **Procedure Note** | Minor Office Procedure | Major/Surgical Procedure | Injection/Aspiration | Diagnostic Procedure | Biopsy/Excision |

Each subtype's item count is calibrated to the documentation burden and complexity of that encounter type. A Comprehensive H&P (Hospital Admission) carries 40-50 items because inpatient admission documentation requires the broadest clinical picture. A Minor Office Procedure carries 28-30 items because the documentation is focused on a specific intervention. The AI engine captures all available data and populates whichever items are active in the selected template.

---

### Document Structure

| Part | Content | File |
|------|---------|------|
| **Part 1** | SOAP Framework (Progress Notes) -- 5 subtypes | `part1-soap.md` |
| **Part 2** | H&P Framework (History & Physical) -- 5 subtypes | `part2-hp.md` |
| **Part 3** | Procedure Note Framework -- 5 subtypes | `part3-procedure.md` |
| **Part 4** | Cross-Framework Medical Add-Ons (applies to all 3 frameworks) | `part4-crossframework.md` |
| **Sources** | Evidence Sources Master List | `sources.md` |

---

## PART 1: MEDICAL SOAP FRAMEWORK (PROGRESS NOTES)

SOAP in medical documentation follows the classic Subjective/Objective/Assessment/Plan structure originally developed by Dr. Lawrence Weed in the 1960s as part of the Problem-Oriented Medical Record (POMR). In primary care, family medicine, and general medical practice, SOAP notes remain the dominant documentation paradigm, required by CMS for evaluation and management (E/M) billing and accepted universally by payers. Each SOAP subtype below is tailored to a specific visit category, with item counts and detail levels calibrated to the documentation burden and medical decision-making (MDM) complexity required for that encounter type. A Medical Necessity section is appended to every subtype to ensure compliance with CMS and payer requirements for reimbursement justification.

All format templates use `__` (double underscore) to indicate AI-populated fields. Pipes (`|`) within templates separate discrete data elements. Sources reference real clinical guidelines, coding standards, and regulatory frameworks.

---

### 1. New Patient Visit (CPT 99202-99205)

**Purpose:** First encounter with a new patient. Requires comprehensive history, complete review of systems, full physical examination, and thorough baseline documentation. Supports MDM complexity levels from straightforward to high. This is the most detailed SOAP subtype, establishing the clinical foundation for all future care.

**Applicable Codes:** 99202 (straightforward), 99203 (low MDM), 99204 (moderate MDM), 99205 (high MDM)

---

#### Subjective (S) -- New Patient Visit

| Item | Format Template | Source |
|------|----------------|--------|
| Chief Complaint (CC) | `"Patient presents with __ | Duration: __ | Stated in patient's own words: '__'"` | AMA CPT E/M Guidelines 2021; CMS 1995 Documentation Guidelines |
| History of Present Illness -- Onset | `"Onset: __ | Date/time of onset: __ | Sudden vs. gradual: __"` | CMS 1997 Documentation Guidelines (OLDCARTS mnemonic) |
| History of Present Illness -- Location | `"Location: __ | Radiation: __ | Laterality: __"` | CMS 1997 Documentation Guidelines |
| History of Present Illness -- Duration & Character | `"Duration: __ | Character/quality: __ | Constant vs. intermittent: __"` | CMS 1997 Documentation Guidelines |
| History of Present Illness -- Aggravating/Alleviating & Severity | `"Aggravating factors: __ | Alleviating factors: __ | Severity: __/10 | Functional impact: __"` | CMS 1997 Documentation Guidelines |
| History of Present Illness -- Timing & Associated Symptoms | `"Timing/frequency: __ | Associated symptoms: __ | Pertinent negatives: __"` | CMS 1997 Documentation Guidelines |
| Past Medical History (PMH) | `"Active diagnoses: __ | Resolved conditions: __ | Hospitalizations: __ | Chronic disease history: __ | Childhood illnesses: __"` | AMA CPT E/M Guidelines 2021; CMS 1995 Documentation Guidelines |
| Past Surgical History | `"Procedures: __ | Dates: __ | Complications: __ | Anesthesia history: __"` | CMS 1995 Documentation Guidelines |
| Family History | `"First-degree relatives: __ | Conditions: __ | Age of onset: __ | Deceased relatives cause of death: __ | Hereditary/genetic conditions: __ | Intergenerational health patterns: __"` | CMS 1995 Documentation Guidelines; USPSTF Family History Recommendations |
| Social History | `"Tobacco: __ | Alcohol: __ | Substance use: __ | Occupation: __ | Exercise: __ | Diet: __ | Sexual history: __ | Marital/partner status: __ | Living situation: __ | Cultural/traditional healing practices: __ | Tribal community affiliation: __ | Interpreter/language needs: __ | Preferred language: __"` | CMS 1995 Documentation Guidelines; IHS Clinical Reporting System |
| Medications & Allergies | `"Current medications: __ | Doses/frequencies: __ | OTC/supplements: __ | Traditional/herbal remedies: __ | Allergies: __ | Reaction type: __ | Severity: __"` | AMA CPT E/M Guidelines 2021; Joint Commission NPSG.03.06.01 |
| Review of Systems (ROS) -- Constitutional & HEENT | `"Constitutional: __ | Eyes: __ | Ears: __ | Nose: __ | Throat: __ | (10+ systems required for comprehensive ROS)"` | CMS 1997 Documentation Guidelines (10+ systems for comprehensive) |
| Review of Systems (ROS) -- Cardiovascular through Integumentary | `"Cardiovascular: __ | Respiratory: __ | GI: __ | GU: __ | Musculoskeletal: __ | Integumentary: __"` | CMS 1997 Documentation Guidelines |
| Review of Systems (ROS) -- Neurological through Psychiatric | `"Neurological: __ | Psychiatric: __ | Endocrine: __ | Hematologic/lymphatic: __ | Immunologic/allergic: __"` | CMS 1997 Documentation Guidelines |
| SDOH Screening | `"Housing stability: __ | Food security: __ | Transportation: __ | Financial strain: __ | Social isolation: __ | Interpersonal safety: __ | Historical/intergenerational trauma acknowledgment: __ | Access to traditional cultural resources: __"` | CMS SDOH Z-Code Guidelines; AHC-HRSN Screening Tool; IHS SDOH Framework |
| Health Literacy Assessment | `"Health literacy level: __ | Preferred communication method: __ | Teach-back comprehension: Y/N | Interpreter used: Y/N | Language: __"` | AHRQ Health Literacy Universal Precautions Toolkit, 3rd Ed. |

#### Objective (O) -- New Patient Visit

| Item | Format Template | Source |
|------|----------------|--------|
| Vital Signs | `"BP: __/__ mmHg | HR: __ bpm | RR: __ breaths/min | Temp: __ F/C | SpO2: __% | Weight: __ | Height: __ | BMI: __ kg/m2"` | AMA CPT E/M Guidelines 2021; ACC/AHA 2017 BP Guidelines |
| General Appearance | `"Appearance: __ | Distress level: __ | Nutritional status: __ | Hygiene/grooming: __ | Affect/demeanor: __ | Age-appearance concordance: __"` | CMS 1997 Documentation Guidelines -- General Multi-System Exam |
| HEENT Examination | `"Head: __ | Eyes (pupils, EOM, fundoscopic): __ | Ears (TM, canal, hearing): __ | Nose (turbinates, septum): __ | Throat (oropharynx, dentition): __ | Neck (thyroid, lymphadenopathy, JVD): __"` | CMS 1997 Documentation Guidelines -- Multi-System Exam |
| Cardiovascular Examination | `"Heart rate/rhythm: __ | S1/S2: __ | Murmurs/gallops/rubs: __ | Peripheral pulses: __ | Edema: __ | Capillary refill: __"` | CMS 1997 Documentation Guidelines; ACC/AHA Cardiovascular Exam Standards |
| Respiratory Examination | `"Respiratory effort: __ | Lung sounds bilateral: __ | Adventitious sounds: __ | Percussion: __ | Chest wall symmetry: __"` | CMS 1997 Documentation Guidelines -- Multi-System Exam |
| Abdominal Examination | `"Inspection: __ | Bowel sounds: __ | Tenderness: __ | Guarding/rebound: __ | Organomegaly: __ | Masses: __"` | CMS 1997 Documentation Guidelines -- Multi-System Exam |
| Musculoskeletal Examination | `"Gait: __ | Posture: __ | ROM: __ | Joint swelling/deformity: __ | Muscle strength: __/5 bilateral | Tenderness: __"` | CMS 1997 Documentation Guidelines -- Musculoskeletal Exam |
| Neurological Examination | `"Mental status: __ | Cranial nerves II-XII: __ | Sensation: __ | Motor: __ | Reflexes: __ | Coordination/cerebellar: __ | Gait assessment: __"` | CMS 1997 Documentation Guidelines -- Neurological Exam |
| Skin/Integumentary | `"Color: __ | Turgor: __ | Lesions: __ | Rashes: __ | Wound assessment: __ | Hair/nail changes: __"` | CMS 1997 Documentation Guidelines -- Skin Exam |
| Psychiatric/Behavioral Screening | `"Mood: __ | Affect: __ | Thought process: __ | Thought content: __ | Insight/judgment: __ | Safety assessment (SI/HI): __"` | DSM-5-TR General Psychiatric Examination; CMS 1997 Documentation Guidelines |
| PHQ-2 Depression Screen | `"PHQ-2 Score: __/6 | Positive >= 3: Y/N | Little interest/pleasure: __ | Feeling down/depressed: __ | If positive, PHQ-9 administered: Y/N"` | USPSTF Depression Screening Recommendation (Grade B); Kroenke et al., 2003 |
| AUDIT-C Alcohol Screen | `"AUDIT-C Score: __/12 | Positive (Men >= 4, Women >= 3): Y/N | Frequency: __ | Quantity: __ | Binge frequency: __"` | USPSTF Unhealthy Alcohol Use Screening (Grade B); Bush et al., 1998 |
| Fall Risk Assessment | `"Timed Up and Go: __ seconds | Falls in past 12 months: __ | Gait/balance abnormality: Y/N | Fall risk level: Low/Moderate/High | Morse Fall Scale: __/125"` | USPSTF Falls Prevention (Grade B for >= 65); CDC STEADI Initiative |
| Baseline Labs/Diagnostics Reviewed | `"CBC: __ | CMP: __ | Lipid panel: __ | HbA1c: __ | TSH: __ | Urinalysis: __ | Other: __ | Results within normal limits: Y/N | Abnormal values: __"` | AMA CPT E/M Guidelines 2021 -- Data Review for MDM |

#### Assessment (A) -- New Patient Visit

| Item | Format Template | Source |
|------|----------------|--------|
| Primary Diagnosis | `"Diagnosis: __ | ICD-10: __ | Clinical basis: __ | Date of onset: __ | Status: acute/chronic/recurrent"` | AMA CPT E/M Guidelines 2021; ICD-10-CM Official Guidelines |
| Secondary/Additional Diagnoses | `"Diagnosis: __ | ICD-10: __ | Relationship to primary: __ | Active/historical: __"` | ICD-10-CM Official Coding Guidelines for Secondary Diagnoses |
| Differential Diagnosis | `"Differential 1: __ | Supporting/refuting evidence: __ | Differential 2: __ | Supporting/refuting evidence: __ | Differential 3: __ | Supporting/refuting evidence: __"` | AMA CPT E/M Guidelines 2021 -- MDM Complexity |
| Problem List Established | `"Problem 1: __ | Status: __ | Problem 2: __ | Status: __ | Problem 3: __ | Status: __ | Total active problems: __"` | CMS E/M MDM Guidelines 2021 -- Number/Complexity of Problems |
| MDM Complexity Level | `"Number/complexity of problems: __ | Data reviewed/ordered: __ | Risk of complications/morbidity/mortality: __ | Overall MDM level: Straightforward/Low/Moderate/High"` | AMA CPT E/M Guidelines 2021 -- MDM Table |
| Clinical Reasoning Narrative | `"Key findings supporting assessment: __ | Findings considered and ruled out: __ | Rationale for diagnosis: __ | Uncertainty acknowledged: __"` | AMA CPT E/M Guidelines 2021; CMS MDM Documentation Requirements |
| Risk Stratification | `"Acute risk: __ | Chronic disease risk: __ | Cardiovascular risk (ASCVD 10-yr): __% | Diabetes risk: __ | Cancer screening risk factors: __ | Social/cultural risk factors: __"` | ACC/AHA 2019 ASCVD Risk Calculator; USPSTF A/B Recommendations; ADA Standards of Care 2024 |
| Cultural Health Considerations | `"Traditional healing practices in use: __ | Cultural factors affecting care: __ | Spiritual/ceremonial needs: __ | Community health context: __"` | IHS Clinical Standards; CMS Cultural Competency Requirements |

#### Plan (P) -- New Patient Visit

| Item | Format Template | Source |
|------|----------------|--------|
| Treatment Plan | `"Treatment for __: __ | Goals: __ | Timeline: __ | Patient agreement: Y/N | Shared decision-making documented: Y/N"` | AMA CPT E/M Guidelines 2021; CMS Plan of Care Requirements |
| Medications Prescribed | `"Medication: __ | Dose: __ | Route: __ | Frequency: __ | Duration: __ | Indication: __ | PDMP checked: Y/N | Traditional remedy interactions reviewed: Y/N"` | AMA CPT E/M Guidelines 2021; CDC Prescribing Guidelines; State PDMP Requirements |
| Referrals Ordered | `"Referral to: __ | Reason: __ | Urgency: routine/urgent/emergent | Referred for: __ | Traditional healer coordination: __ | PRC/CHS eligibility noted: Y/N"` | CMS Referral Documentation Requirements; IHS Purchased/Referred Care (PRC) Guidelines |
| Labs/Imaging Ordered | `"Test: __ | Indication: __ | ICD-10 for order: __ | Fasting required: Y/N | Results to be reviewed: __"` | AMA CPT E/M Guidelines 2021 -- Data Ordered for MDM |
| Patient Education Provided | `"Topics discussed: __ | Materials provided: __ | Teach-back confirmed: Y/N | Culturally adapted materials: Y/N | Language-appropriate: Y/N | Health literacy level accommodated: Y/N"` | AHRQ Health Literacy Guidelines; CMS Patient Education Documentation |
| Follow-Up Plan | `"Follow-up in: __ | Reason for interval: __ | Conditions for earlier return: __ | Contact instructions: __"` | AMA CPT E/M Guidelines 2021 |
| Preventive Care Plan | `"Screenings due: __ | Immunizations due: __ | Counseling topics: __ | Wellness goals: __ | Age/sex-specific USPSTF recommendations addressed: __"` | USPSTF A/B Recommendations; CDC Immunization Schedules; ACS Cancer Screening Guidelines |
| Care Coordination | `"PCP notification: __ | Specialist coordination: __ | Community health resources: __ | CHR/community health representative referral: Y/N | Traditional healer coordination: Y/N | Tribal health program referrals: __"` | IHS Care Coordination Standards; CMS Care Management Requirements |

#### Medical Necessity (MN) -- New Patient Visit

| Item | Format Template | Source |
|------|----------------|--------|
| Medical Necessity Statement | `"Services provided were medically necessary to: __ | Without intervention, risk of: __ | Clinical indicators supporting necessity: __"` | CMS LCD/NCD Medical Necessity Criteria; 42 CFR 410.32 |
| E/M Level Justification | `"E/M code selected: __ | Based on: MDM complexity / Total time | MDM level: __ | If time-based: total time __ minutes (counseling/coordination: __ minutes) | Code meets requirements per: __"` | AMA CPT E/M Guidelines 2021; CMS E/M Scoring Table |
| MDM Elements Documentation | `"Problems addressed: __ (number/complexity) | Data reviewed: __ | Data ordered: __ | Independent interpretation: Y/N | Discussion with external physician: Y/N | Risk level: Minimal/Low/Moderate/High"` | AMA CPT E/M Guidelines 2021 -- MDM Three-Element Table |
| IHS/Tribal Billing Considerations | `"Encounter type: __ | IHS facility vs. tribal 638 vs. urban Indian: __ | All-inclusive rate eligible: Y/N | Third-party payer identified: Y/N | Medicare/Medicaid/IHS appropriately sequenced: __"` | IHS Billing and Coding Guidelines; 42 CFR 136; IHCIA Section 206 |
| ABN/Waiver Documentation | `"ABN required: Y/N | ABN provided and signed: Y/N | Reason for potential non-coverage: __ | Patient elected: Option 1 (wants service, may bill) / Option 2 (wants service, won't bill) / Option 3 (declines service)"` | CMS ABN Requirements (CMS-R-131); 42 CFR 411.408 |

---

### 2. Established Patient Follow-Up (CPT 99211-99215)

**Purpose:** Routine follow-up visit for a patient with established care relationship and known conditions. Documents interval changes, treatment response, and plan modifications. Supports MDM complexity levels from minimal to high for ongoing care management.

**Applicable Codes:** 99211 (may not require physician presence), 99212 (straightforward), 99213 (low MDM), 99214 (moderate MDM), 99215 (high MDM)

---

#### Subjective (S) -- Established Patient Follow-Up

| Item | Format Template | Source |
|------|----------------|--------|
| Interval History | `"Since last visit on __: __ | Interval events: __ | ER visits/hospitalizations: Y/N | Details: __ | Outside provider visits: __"` | AMA CPT E/M Guidelines 2021; CMS 1997 Documentation Guidelines |
| Symptom Update | `"Primary condition (__ ): current status: __ | Severity change: improved/stable/worsened | New symptoms: __ | Resolved symptoms: __"` | CMS 1997 Documentation Guidelines -- HPI Update |
| Medication Compliance | `"Medication adherence: __ | Missed doses frequency: __ | Side effects reported: __ | Barriers to compliance: __ | Traditional/herbal remedy use: __ | Pharmacy refill history reviewed: Y/N"` | AMA CPT E/M Guidelines 2021; CMS Medication Reconciliation Standards |
| Functional Status Change | `"ADL status: __ | IADL status: __ | Work/school capacity: __ | Mobility change: __ | Pain interference: __/10 | Functional goal progress: __"` | CMS Functional Status Reporting; WHO ICF Framework |
| New Concerns/Complaints | `"New concern: __ | Duration: __ | Severity: __ | Impact on daily life: __ | Patient priorities for today's visit: __"` | AMA CPT E/M Guidelines 2021 |
| Self-Management Activities | `"Diet adherence: __ | Exercise: __ | Home monitoring (BP/glucose/weight): __ | Self-care activities: __ | Cultural/traditional wellness practices: __"` | ADA Standards of Care 2024; ACC/AHA Lifestyle Guidelines |
| Psychosocial Update | `"Stress level: __ | Social support changes: __ | Housing/food security changes: __ | Caregiver status: __ | Cultural/community engagement: __ | Historical trauma impacts: __"` | CMS SDOH Z-Code Guidelines; IHS Behavioral Health Integration |
| Pertinent ROS | `"Focused ROS for __: __ | Systems reviewed: __ | Pertinent positives: __ | Pertinent negatives: __"` | CMS 1997 Documentation Guidelines (2-9 systems for extended ROS) |

#### Objective (O) -- Established Patient Follow-Up

| Item | Format Template | Source |
|------|----------------|--------|
| Vital Signs | `"BP: __/__ mmHg | HR: __ bpm | RR: __ breaths/min | Temp: __ F/C | SpO2: __% | Weight: __ | BMI: __ kg/m2 | Weight change since last visit: __"` | AMA CPT E/M Guidelines 2021; ACC/AHA 2017 BP Guidelines |
| Focused Physical Examination | `"Systems examined: __ | Pertinent findings for __ (condition): __ | Change from prior exam: __ | Abnormalities noted: __"` | CMS 1997 Documentation Guidelines -- Problem-Focused to Detailed Exam |
| Cardiovascular Focused Exam | `"Heart rate/rhythm: __ | BP trend: __ | Edema: __ | JVD: __ | Pulses: __ | Relevant changes from last exam: __"` | CMS 1997 Documentation Guidelines; ACC/AHA Exam Standards |
| Respiratory Focused Exam | `"Lung sounds: __ | Respiratory effort: __ | Peak flow/spirometry: __ | Oxygen requirement: __ | Change from baseline: __"` | CMS 1997 Documentation Guidelines; GINA Asthma Guidelines 2023 |
| Problem-Specific Examination | `"Examination focused on __ (condition): __ | Findings: __ | Severity indicators: __ | Comparison to prior: __"` | CMS 1997 Documentation Guidelines -- Single Organ System Exam |
| Pertinent Lab/Imaging Results | `"Test: __ | Date: __ | Result: __ | Reference range: __ | Trend from prior: __ | Clinical significance: __"` | AMA CPT E/M Guidelines 2021 -- Data Reviewed for MDM |
| Validated Outcome Measures | `"Tool: __ | Score: __/__ | Interpretation: __ | Change from prior score: __ | Trend: improving/stable/declining"` | Relevant validated instrument guidelines (PHQ-9, GAD-7, PROMIS, etc.) |
| Medication Reconciliation | `"Current medication list reviewed: Y/N | Changes since last visit: __ | Discrepancies identified: __ | High-risk medications: __ | Traditional remedies documented: __ | Drug interactions checked: Y/N"` | Joint Commission NPSG.03.06.01; CMS Medication Reconciliation |
| Point-of-Care Testing | `"Test performed: __ | Result: __ | Clinical action based on result: __ | CLIA-waived: Y/N"` | CMS CLIA Regulations (42 CFR 493); AMA CPT POC Coding |
| Disease-Specific Metrics | `"Condition: __ | Target metric: __ | Current value: __ | At goal: Y/N | Trend over __ months: __ | Intervention effectiveness: __"` | ADA Standards of Care 2024; ACC/AHA Quality Metrics; HEDIS Measures |

#### Assessment (A) -- Established Patient Follow-Up

| Item | Format Template | Source |
|------|----------------|--------|
| Problem-Specific Assessment | `"Problem 1 (__ ICD-10: __): Status: __ | Controlled/uncontrolled: __ | Problem 2 (__ ICD-10: __): Status: __ | Controlled/uncontrolled: __"` | AMA CPT E/M Guidelines 2021; ICD-10-CM Official Guidelines |
| Progress Toward Treatment Goals | `"Goal 1: __ | Progress: __ | On track: Y/N | Goal 2: __ | Progress: __ | On track: Y/N | Barriers to progress: __"` | CMS Care Plan Documentation Requirements |
| Medication Effectiveness | `"Medication: __ | Therapeutic response: __ | Side effects: __ | Dose optimization needed: Y/N | Alternative considered: __"` | AMA CPT E/M Guidelines 2021; FDA Prescribing Information Standards |
| Risk Reassessment | `"Overall risk level: __ | Changed from prior: Y/N | Factors increasing risk: __ | Factors decreasing risk: __ | Complication screening: __"` | AMA CPT E/M Guidelines 2021 -- MDM Risk Table |
| MDM Complexity Level | `"Number/complexity of problems: __ | Data reviewed/ordered: __ | Risk of complications/morbidity/mortality: __ | Overall MDM level: Straightforward/Low/Moderate/High"` | AMA CPT E/M Guidelines 2021 -- MDM Table |
| Clinical Impression Update | `"Overall trajectory: __ | Prognosis update: __ | Comorbidity interactions: __ | Need for escalation/de-escalation: __"` | AMA CPT E/M Guidelines 2021; CMS Clinical Documentation Improvement |

#### Plan (P) -- Established Patient Follow-Up

| Item | Format Template | Source |
|------|----------------|--------|
| Plan Modifications | `"Current plan: __ | Modification: __ | Rationale for change: __ | Shared decision-making: Y/N | Patient agreement: Y/N"` | AMA CPT E/M Guidelines 2021; CMS Shared Decision-Making |
| Medication Adjustments | `"Medication changed: __ | From: __ | To: __ | Reason: __ | New medication: __ | Dose: __ | PDMP checked: Y/N | Traditional remedy interactions reviewed: Y/N"` | AMA CPT E/M Guidelines 2021; CDC Prescribing Guidelines |
| Referral Updates | `"Referral status: __ | Specialist recommendations integrated: Y/N | New referrals: __ | PRC/CHS authorization status: __ | Traditional healer coordination: __"` | CMS Referral Documentation; IHS PRC Guidelines |
| Follow-Up Plan | `"Next visit in: __ | Reason for interval: __ | Conditions for earlier return: __ | Monitoring between visits: __ | Telehealth appropriate for next visit: Y/N"` | AMA CPT E/M Guidelines 2021; CMS Telehealth Guidelines |
| Patient Education Reinforced | `"Topics reinforced: __ | New education provided: __ | Self-management instructions: __ | Culturally adapted: Y/N | Teach-back confirmed: Y/N"` | AHRQ Health Literacy Guidelines; CMS Patient Education Standards |
| Care Coordination Activities | `"Care team communication: __ | Specialist coordination: __ | Community resource referrals: __ | CHR follow-up requested: Y/N | Tribal health program coordination: __"` | CMS Care Coordination Requirements; IHS Care Coordination Standards |

#### Medical Necessity (MN) -- Established Patient Follow-Up

| Item | Format Template | Source |
|------|----------------|--------|
| Medical Necessity Statement | `"Continued management of __ is medically necessary due to: __ | Current status requires: __ | Risk if not managed: __"` | CMS LCD/NCD Medical Necessity Criteria; 42 CFR 410.32 |
| E/M Level Justification | `"E/M code selected: __ | Based on: MDM complexity / Total time | MDM level: __ | If time-based: total time __ minutes | Code requirements met per AMA CPT 2021: Y/N"` | AMA CPT E/M Guidelines 2021; CMS E/M Scoring Table |
| MDM Elements Documentation | `"Problems addressed: __ | Data reviewed/ordered: __ | Risk level: __ | Overall MDM: __ | Meets __ of 3 MDM element threshold"` | AMA CPT E/M Guidelines 2021 -- MDM Three-Element Table |
| IHS/Tribal Billing Considerations | `"Encounter type: __ | Facility type: IHS/Tribal 638/Urban Indian | Third-party billing: __ | All-inclusive rate eligible: Y/N | Payer sequencing: __"` | IHS Billing and Coding Guidelines; 42 CFR 136 |

---

### 3. Annual Wellness Visit (CPT G0438/G0439)

**Purpose:** Medicare Annual Wellness Visit focused on preventive health, risk assessment, and personalized prevention plan development. Initial AWV (G0438 -- "Welcome to Medicare") or Subsequent AWV (G0439). This is NOT a comprehensive physical exam -- it is a wellness and prevention planning encounter. Includes health risk assessment, screening administration, and creation of a written personalized prevention plan.

**Applicable Codes:** G0438 (Initial AWV), G0439 (Subsequent AWV), G0402 (Initial Preventive Physical Exam/"Welcome to Medicare")

**Note:** AWV does not cover diagnosis or treatment of new conditions. If acute/chronic issues are addressed, a separate E/M code (with modifier -25) may be billed.

---

#### Subjective (S) -- Annual Wellness Visit

| Item | Format Template | Source |
|------|----------------|--------|
| Health Risk Assessment (HRA) | `"HRA completed: Y/N | Method: written/electronic | Self-rated health: __ | Demographic data confirmed: __ | Risk factors identified: __ | HRA tool used: __"` | CMS Medicare AWV Requirements (42 CFR 410.15); ACA Section 4103 |
| Medical/Surgical History Update | `"New diagnoses since last AWV: __ | Surgeries/hospitalizations since last AWV: __ | Current problem list reviewed: Y/N | Changes: __"` | CMS AWV Documentation Requirements |
| Family History Update | `"Changes to family history: __ | New diagnoses in first-degree relatives: __ | Hereditary risk factors updated: __ | Intergenerational health patterns: __"` | CMS AWV Requirements; USPSTF Family History Recommendations |
| Functional Status & Safety | `"ADL independence: __ | IADL independence: __ | Hearing difficulty: Y/N | Vision difficulty: Y/N | Home safety concerns: __ | Driving safety: __ | Community mobility: __"` | CMS AWV Functional Assessment Requirements; Katz ADL Index; Lawton IADL Scale |
| Fall Risk Questionnaire | `"Falls in past 12 months: __ | Fear of falling: Y/N | Unsteadiness standing/walking: Y/N | Fall risk level: Low/Moderate/High | Home hazards identified: __ | Assistive device use: __"` | CDC STEADI Algorithm; USPSTF Falls Prevention (Grade B for >= 65) |
| Depression Screening (PHQ-2/PHQ-9) | `"PHQ-2 Score: __/6 | Positive >= 3: Y/N | If positive, PHQ-9 Score: __/27 | Severity: None (0-4)/Mild (5-9)/Moderate (10-14)/Mod-Severe (15-19)/Severe (20-27) | Suicidal ideation (Q9): Y/N | Historical trauma screening: __"` | USPSTF Depression Screening (Grade B); Kroenke et al., 2001; PHQ Validation Studies |
| Cognitive Screening | `"Cognitive screen performed: Y/N | Tool used: __ | Score: __/__ | Normal threshold: __ | Result: normal/abnormal | Informant concern: Y/N | Further evaluation needed: Y/N"` | CMS AWV Cognitive Assessment Requirement; Mini-Cog (Borson et al., 2000); MMSE; MoCA |
| Substance Use Screening | `"AUDIT-C Score: __/12 | Positive (Men >= 4, Women >= 3): Y/N | Tobacco use: current/former/never | Pack-years: __ | Other substance use: __ | DAST-10 Score: __/10 | Traditional tobacco use (ceremonial) distinguished from commercial: Y/N"` | USPSTF Unhealthy Alcohol Use (Grade B); USPSTF Tobacco Cessation (Grade A); CDC Screening Guidelines |
| Advance Directives Status | `"Advance directive on file: Y/N | Type: Living will/DPOA/POLST/Other | Last updated: __ | Patient wishes discussed: Y/N | Surrogate decision-maker identified: __ | Cultural/spiritual preferences documented: __"` | CMS AWV Requirements (42 CFR 410.15); ACA Section 4103 |
| Social Determinants of Health | `"Housing: __ | Food security: __ | Transportation: __ | Social isolation: __ | Financial concerns: __ | Caregiver burden: __ | Community/tribal resource access: __ | Cultural connectedness: __ | Interpreter/language needs: __"` | CMS SDOH Z-Code Guidelines; AHC-HRSN Screening Tool; IHS SDOH Framework |

#### Objective (O) -- Annual Wellness Visit

| Item | Format Template | Source |
|------|----------------|--------|
| Vital Signs with BMI | `"BP: __/__ mmHg | HR: __ bpm | Weight: __ | Height: __ | BMI: __ kg/m2 | BMI category: Underweight/Normal/Overweight/Obese I/II/III | Weight change from last AWV: __"` | CMS AWV Requirements; WHO BMI Classification; USPSTF Obesity Screening (Grade B) |
| Vision Screening | `"Visual acuity (Snellen): OD __/__ OS __/__ | Corrective lenses: Y/N | Last eye exam: __ | Glaucoma risk: __ | Diabetic eye exam current: Y/N | Referral needed: Y/N"` | CMS AWV Requirements; USPSTF Vision Screening; AAO Guidelines |
| Hearing Screening | `"Hearing screen performed: Y/N | Method: __ | Result: normal/abnormal | Hearing aid use: Y/N | Referral for audiology: Y/N | Impact on communication: __"` | CMS AWV Requirements; USPSTF Hearing Loss Screening |
| Fall Risk Assessment (Objective) | `"Timed Up and Go: __ seconds (>= 12 sec = elevated risk) | 30-Second Chair Stand: __ | 4-Stage Balance Test: __ | Orthostatic BP: Supine __/__ | Standing __/__ | Positive orthostasis: Y/N"` | CDC STEADI Initiative; USPSTF Falls Prevention (Grade B); AGS Beers Criteria |
| Cognitive Assessment (Objective) | `"Mini-Cog: __ | 3-word recall: __/3 | Clock draw: normal/abnormal | Score: __/5 | If abnormal, full cognitive evaluation recommended: Y/N | AD8 Informant score: __/8"` | Borson et al., Mini-Cog Validation; Alzheimer's Association Cognitive Assessment Rec. |
| Cancer Screening Status | `"Breast (mammogram): Due __ | Last: __ | Result: __ | Cervical (Pap/HPV): Due __ | Last: __ | Result: __ | Colorectal: Due __ | Last: __ | Method: __ | Result: __ | Lung (LDCT): Eligible Y/N | Last: __ | Prostate (shared decision): Discussed Y/N"` | USPSTF Cancer Screening Recommendations (A/B Grade); ACS Cancer Screening Guidelines 2024 |
| Immunization Review | `"Influenza: __ | COVID-19: __ | Pneumococcal (PCV20 or PCV15+PPSV23): __ | Tdap/Td: __ | Shingrix: __ | Hepatitis B: __ | Other: __ | Immunizations given today: __ | Declined: __"` | CDC ACIP Immunization Schedules 2024; CMS AWV Immunization Review |
| Preventive Care Checklist | `"Abdominal aortic aneurysm screening (if applicable): __ | Osteoporosis (DEXA): __ | Diabetes screening (A1c/FPG): __ | Lipid panel: __ | Hepatitis C: __ | HIV: __ | STI screening: __ | USPSTF grade A/B services due: __"` | USPSTF A/B Recommendations; CMS Preventive Services Coverage |
| Functional Assessment (Objective) | `"Grip strength: __ | Gait speed: __ m/s | Balance observation: __ | Ability to perform ADLs observed: __ | Frailty indicators: __"` | CMS AWV Functional Assessment; Fried Frailty Criteria; SPPB |

#### Assessment (A) -- Annual Wellness Visit

| Item | Format Template | Source |
|------|----------------|--------|
| Risk Stratification Summary | `"Overall health risk: Low/Moderate/High | Cardiovascular risk (ASCVD 10-yr): __% | Diabetes risk: __ | Cancer risk factors: __ | Fall risk: Low/Moderate/High | Cognitive risk: __ | Depression risk: __ | Substance use risk: __"` | ACC/AHA 2019 ASCVD Calculator; ADA Risk Assessment; USPSTF Risk Recommendations |
| Wellness Assessment | `"Overall wellness: __ | Strengths: __ | Areas for improvement: __ | Patient-identified priorities: __ | Cultural wellness practices: __ | Community engagement level: __"` | CMS AWV Personalized Prevention Plan Requirements |
| Chronic Disease Status Summary | `"Condition 1 (__ ICD-10: __): Controlled/Uncontrolled | Condition 2 (__ ICD-10: __): Controlled/Uncontrolled | Disease-specific measures: __ | Complications: __"` | CMS Chronic Care Documentation; HEDIS Quality Measures |
| Preventive Care Gaps Identified | `"Overdue screening: __ | Due date: __ | Overdue immunization: __ | Unmet counseling needs: __ | USPSTF A/B services not current: __ | Barriers to completion: __"` | USPSTF A/B Recommendations; CMS Quality Measures; HEDIS Gap Closure |
| Health Disparity Considerations | `"Identified disparities: __ | Social risk factors affecting health: __ | Access barriers: __ | Cultural considerations: __ | IHS/tribal health resource gaps: __ | Urban vs. rural access: __"` | CMS Health Equity Framework; IHS Health Disparities Data; HHS OMH Standards |

#### Plan (P) -- Annual Wellness Visit

| Item | Format Template | Source |
|------|----------------|--------|
| Personalized Prevention Plan | `"Written prevention plan provided: Y/N | Risk factors addressed: __ | Preventive services scheduled: __ | Health goals established: __ | Timeline: __ | Plan shared with care team: Y/N"` | CMS AWV Requirements (42 CFR 410.15); ACA Section 4103 |
| Screening Schedule | `"Mammogram: __ | Colorectal: __ | Cervical: __ | Lung CT: __ | DEXA: __ | AAA: __ | Labs (lipid/A1c/TSH): __ | Other: __ | Orders placed today: __"` | USPSTF Screening Recommendations; ACS Guidelines; CMS Coverage Determinations |
| Immunization Plan | `"Immunizations administered today: __ | Immunizations scheduled: __ | Series to complete: __ | Declined immunizations: __ | Contraindications noted: __ | VIS provided: Y/N"` | CDC ACIP Recommendations 2024; CMS Immunization Coverage |
| Counseling Provided | `"Topics: __ | Duration: __ minutes | Method: verbal/written/video | Nutrition counseling: __ | Physical activity: __ | Tobacco cessation: __ | Fall prevention: __ | Culturally adapted counseling: Y/N | Interpreter used: Y/N"` | USPSTF Counseling Recommendations; CMS Wellness Visit Counseling |
| Community Resources & Referrals | `"Community resources provided: __ | Support groups: __ | Senior services: __ | Tribal health programs: __ | CHR/community health representative: __ | Elder services: __ | Cultural/traditional healing resources: __ | Transportation assistance: __"` | CMS Community-Based Care Requirements; IHS Community Health Programs |
| Advance Care Planning | `"ACP discussion: Y/N | Time spent: __ minutes | ACP code billed (99497/99498): Y/N | Directive completed/updated: Y/N | Surrogate identified: __ | Cultural/spiritual wishes documented: __ | Patient values discussed: __"` | CMS ACP Billing Guidelines (CPT 99497/99498); ACA Section 4103 |
| Follow-Up & Next AWV | `"Next AWV due: __ | Interim visits scheduled for: __ | Chronic care follow-up: __ | Screening result follow-up plan: __ | Telehealth check-in planned: Y/N"` | CMS AWV Annual Requirements; CMS Telehealth Guidelines |

#### Medical Necessity (MN) -- Annual Wellness Visit

| Item | Format Template | Source |
|------|----------------|--------|
| AWV Eligibility Verification | `"Medicare Part B enrollment: > 12 months: Y/N | Prior AWV/IPPE date: __ | Eligible for G0438 (Initial) / G0439 (Subsequent): __ | Beneficiary eligibility confirmed: Y/N"` | CMS AWV Eligibility Requirements (42 CFR 410.15) |
| Service Justification | `"AWV performed to: develop/update personalized prevention plan | Health risk assessment completed: Y/N | Screening services provided under AWV: __ | Separate E/M warranted (modifier -25): Y/N | If yes, reason: __"` | CMS MLN Booklet on AWV; 42 CFR 410.15 |
| Quality Measure Alignment | `"HEDIS/MIPS measures addressed: __ | Quality reporting codes: __ | Screening quality metrics met: __ | CQM documentation: __"` | CMS MIPS Quality Measures; NCQA HEDIS Measures |
| IHS/Tribal Billing Considerations | `"Facility type: IHS/Tribal 638/Urban Indian | Medicare AWV coverage confirmed: Y/N | Third-party billing: __ | All-inclusive rate applicable: Y/N | Dual-eligible (Medicare/Medicaid) status: __"` | IHS Billing Guidelines; CMS Dual-Eligible Requirements; 42 CFR 136 |

---

### 4. Acute/Same-Day Visit (CPT 99201-99215 / 99281-99285)

**Purpose:** Evaluation and management of an acute or urgent presentation requiring same-day assessment. Focus is on the acute complaint, rapid differential diagnosis, identification of red flags, and disposition decision-making. Documentation emphasizes acuity, clinical reasoning for ruling out emergent conditions, and clear return/escalation criteria.

**Applicable Codes:** 99202-99215 (Office-based), 99281-99285 (ED-based if applicable), S9088 (Urgent care facility fee, some payers)

---

#### Subjective (S) -- Acute/Same-Day Visit

| Item | Format Template | Source |
|------|----------------|--------|
| Acute Chief Complaint | `"Patient presents with acute __ | Onset: __ | Duration: __ | Stated in patient's words: '__' | Acuity level: __"` | AMA CPT E/M Guidelines 2021; CMS 1995 Documentation Guidelines |
| HPI -- OLDCARTS for Acute Presentation | `"Onset: __ | Location: __ | Duration: __ | Character: __ | Aggravating factors: __ | Relieving factors: __ | Timing: __ | Severity: __/10 | Functional impact: __"` | CMS 1997 Documentation Guidelines (OLDCARTS) |
| Associated Symptoms | `"Associated symptoms: __ | System-specific review for __: __ | Pertinent positives: __ | Pertinent negatives: __"` | CMS 1997 Documentation Guidelines -- Associated Signs/Symptoms |
| Red Flag Screening | `"Red flags assessed: __ | Chest pain: Y/N | Dyspnea: Y/N | Neurological deficits: Y/N | Hemodynamic instability signs: Y/N | Severe pain unresponsive to treatment: Y/N | Other alarm symptoms: __"` | ACEP Clinical Policies; AHA/ACC Chest Pain Guidelines; NICE Red Flag Guidelines |
| Pertinent Past Medical History | `"Relevant PMH for current complaint: __ | Similar prior episodes: Y/N | Details: __ | Relevant surgeries: __ | Relevant chronic conditions: __"` | AMA CPT E/M Guidelines 2021; CMS 1995 Documentation Guidelines |
| Recent Exposures & Travel | `"Sick contacts: Y/N | Travel (domestic/international): __ | Environmental exposures: __ | Occupational exposures: __ | Animal/insect exposure: __ | Community outbreak awareness: __ | Reservation/tribal community exposures: __"` | CDC Travel Health Guidelines; OSHA Exposure Standards |
| Current Medications & Allergies | `"Current medications: __ | Recent changes: __ | OTC/supplements: __ | Traditional remedies: __ | Allergies: __ | Reaction type: __ | Last dose of relevant medication: __"` | Joint Commission NPSG.03.06.01; AMA CPT E/M Guidelines 2021 |
| Pre-Visit Treatment Attempted | `"Self-treatment attempted: __ | OTC medications used: __ | Home remedies/traditional treatments: __ | Response to self-treatment: __ | Prior provider visit for this episode: Y/N"` | CMS 1997 Documentation Guidelines -- Context |

#### Objective (O) -- Acute/Same-Day Visit

| Item | Format Template | Source |
|------|----------------|--------|
| Vital Signs | `"BP: __/__ mmHg | HR: __ bpm | RR: __ breaths/min | Temp: __ F/C | SpO2: __% | Weight: __ | Pain: __/10 | Orthostatics if indicated: Supine __/__ Standing __/__"` | AMA CPT E/M Guidelines 2021; ACEP Vital Sign Standards |
| General Appearance & Acuity | `"Appearance: __ | Distress level: none/mild/moderate/severe | Toxicity: __ | Hydration status: __ | Mental status: alert/oriented x__ | Ambulatory status: __"` | CMS 1997 Documentation Guidelines; ESI Triage Algorithm |
| Focused Exam -- Primary System | `"Primary system examined (__ ): __ | Key findings: __ | Abnormalities: __ | Laterality: __ | Severity of findings: __"` | CMS 1997 Documentation Guidelines -- Single Organ System Exam |
| Focused Exam -- Secondary System(s) | `"Additional systems examined: __ | Findings: __ | Pertinent negatives on exam: __ | Correlation with chief complaint: __"` | CMS 1997 Documentation Guidelines -- Problem-Focused to Detailed Exam |
| Red Flag Examination Findings | `"Meningeal signs: __ | Peritoneal signs: __ | Neurovascular compromise: __ | Hemodynamic instability: __ | Acute abdomen signs: __ | Compartment syndrome signs: __ | Other emergent findings: __"` | ACEP Clinical Policies; ACS Emergency Surgery Guidelines |
| Point-of-Care Testing | `"Rapid strep: __ | Rapid flu/COVID: __ | Urinalysis: __ | Urine pregnancy: __ | Glucose: __ | Troponin: __ | CBC: __ | BMP: __ | Other POC: __ | CLIA-waived: Y/N"` | CMS CLIA Regulations (42 CFR 493); ACEP POC Testing Guidelines |
| Imaging Results (if obtained) | `"Imaging ordered: __ | Type: __ | Body area: __ | Preliminary read: __ | Key findings: __ | Comparison to prior: __ | Clinical correlation: __"` | ACR Appropriateness Criteria; AMA CPT E/M Data Review |
| Wound/Injury Assessment (if applicable) | `"Location: __ | Size: __ cm | Depth: __ | Wound type: __ | Neurovascular status distal: intact/compromised | Contamination: __ | Tetanus status: __"` | ACEP Wound Management Guidelines; CDC Tetanus Prophylaxis |

#### Assessment (A) -- Acute/Same-Day Visit

| Item | Format Template | Source |
|------|----------------|--------|
| Acute Assessment | `"Primary acute diagnosis: __ | ICD-10: __ | Clinical basis: __ | Acuity: mild/moderate/severe | Onset classification: acute/subacute/acute-on-chronic"` | AMA CPT E/M Guidelines 2021; ICD-10-CM Acute Coding Guidelines |
| Differential Diagnosis | `"Most likely: __ | Differential 2: __ | Differential 3: __ | Emergent conditions ruled out: __ | Evidence supporting primary diagnosis: __ | Evidence against alternatives: __"` | AMA CPT E/M Guidelines 2021 -- MDM Complexity |
| Acuity & Severity Classification | `"Severity: mild/moderate/severe | Systemic involvement: Y/N | Hemodynamic stability: stable/unstable | Complication risk: low/moderate/high | Sepsis screening: qSOFA __/3"` | ACEP ESI Triage; qSOFA Criteria (Singer et al., 2016); CMS Sepsis Bundle |
| Disposition Decision | `"Disposition: discharge home/observation/admission/transfer/ED referral | Clinical rationale: __ | Safe discharge criteria met: Y/N | Decision shared with patient: Y/N"` | ACEP Disposition Decision Guidelines; CMS Observation vs. Inpatient Criteria |
| MDM Complexity Level | `"Number/complexity of problems: __ | Data reviewed/ordered: __ | Risk of complications/morbidity/mortality: __ | Overall MDM level: Straightforward/Low/Moderate/High"` | AMA CPT E/M Guidelines 2021 -- MDM Table |
| Comorbidity Impact | `"Relevant comorbidities affecting acute presentation: __ | Impact on treatment plan: __ | Increased risk due to: __"` | AMA CPT E/M Guidelines 2021; CMS HCC Risk Adjustment |

#### Plan (P) -- Acute/Same-Day Visit

| Item | Format Template | Source |
|------|----------------|--------|
| Acute Treatment | `"Treatment provided: __ | Medications administered in office: __ | Procedures performed: __ | Response to treatment: __ | Duration of observation: __"` | AMA CPT E/M Guidelines 2021; ACEP Treatment Guidelines |
| Prescriptions | `"Medication: __ | Dose: __ | Route: __ | Frequency: __ | Duration: __ | Quantity: __ | Refills: __ | PDMP checked: Y/N | Controlled substance: Y/N | Traditional remedy interactions reviewed: Y/N"` | CDC Opioid Prescribing Guidelines 2022; State PDMP Requirements; AMA Prescribing Standards |
| Return Precautions | `"Return to clinic/ED if: __ | Warning signs: __ | Time frame for concern: __ | Emergency instructions: __ | After-hours contact: __ | Patient verbalized understanding: Y/N"` | ACEP Discharge Instructions Best Practices; CMS Discharge Planning |
| ED/Urgent Referral Criteria | `"Refer to ED if: __ | Transfer criteria: __ | Conditions warranting immediate escalation: __ | EMS activation criteria: __ | ED notification: Y/N"` | EMTALA Requirements (42 USC 1395dd); ACEP Transfer Guidelines |
| Activity/Work Restrictions | `"Activity restrictions: __ | Duration: __ | Work/school note provided: Y/N | Return to activity criteria: __ | Restrictions specific to: __"` | AMA Guides to Evaluation of Permanent Impairment; ACOEM Guidelines |
| Follow-Up Timeline | `"Follow-up in: __ | With: PCP/Specialist/__ | Purpose: __ | If not improving by __: __ | Results pending to be reviewed: __ | Telephone/telehealth follow-up: Y/N"` | AMA CPT E/M Guidelines 2021; CMS Follow-Up Documentation |

#### Medical Necessity (MN) -- Acute/Same-Day Visit

| Item | Format Template | Source |
|------|----------------|--------|
| Medical Necessity Statement | `"Same-day evaluation medically necessary due to: __ | Delayed evaluation would risk: __ | Acute presentation requires: __ | Clinical urgency: __"` | CMS LCD/NCD Medical Necessity Criteria; 42 CFR 410.32 |
| E/M Level Justification | `"E/M code selected: __ | Based on: MDM complexity / Total time | MDM level: __ | If time-based: total time __ minutes | Acute visit justification: __"` | AMA CPT E/M Guidelines 2021; CMS E/M Scoring Table |
| Separate Service Documentation (if applicable) | `"Procedure(s) billed separately: __ | CPT: __ | Modifier -25 applied: Y/N | Procedure was distinct from E/M: Y/N | Documentation supports separate service: Y/N"` | AMA CPT Modifier -25 Guidelines; CMS NCCI Edits |
| IHS/Tribal Billing Considerations | `"Encounter type: acute/urgent/same-day | Facility type: IHS/Tribal 638/Urban Indian | Third-party billing: __ | All-inclusive rate eligible: Y/N | PRC/CHS referral required: Y/N"` | IHS Billing and Coding Guidelines; 42 CFR 136 |

---

### 5. Chronic Care Management Visit (CPT 99490/99491)

**Purpose:** Documentation for chronic care management services for patients with two or more chronic conditions expected to last at least 12 months and that place the patient at significant risk of death, acute exacerbation, or functional decline. Includes care coordination, medication management, and care plan development with documented time tracking for billing purposes.

**Applicable Codes:** 99490 (first 20 min clinical staff), 99491 (first 30 min physician/QHP), 99439 (each additional 20 min clinical staff), 99437 (each additional 30 min physician/QHP), G2058 (each additional 20 min clinical staff)

**Requirements:** Written patient consent, documented care plan, minimum qualifying time per billing period, two or more qualifying chronic conditions.

---

#### Subjective (S) -- Chronic Care Management Visit

| Item | Format Template | Source |
|------|----------------|--------|
| Chronic Disease Symptom Review | `"Condition 1 (__): Current symptoms: __ | Severity: __ | Frequency: __ | Functional impact: __ | Condition 2 (__): Current symptoms: __ | Severity: __ | Frequency: __ | Functional impact: __"` | CMS CCM Requirements (42 CFR 414.510); AMA CPT CCM Guidelines |
| Medication Adherence Assessment | `"Overall adherence: __% | Adherence method: self-report/pill count/pharmacy data/MMAS-8: __/8 | Barriers to adherence: __ | Cost concerns: Y/N | Side effects affecting adherence: __ | Polypharmacy review: __ medications total"` | CMS Medication Management Standards; Morisky MMAS-8 Scale; APhA MTM Guidelines |
| Self-Management Activities | `"Home monitoring (type/frequency): __ | Diet adherence: __ | Exercise routine: __ | Weight management: __ | Smoking cessation efforts: __ | Blood glucose logs: __ | BP logs: __ | Traditional/cultural wellness practices: __"` | ADA Standards of Care 2024; ACC/AHA Lifestyle Guidelines; AADE Self-Care Behaviors |
| Barriers to Care | `"Transportation: __ | Financial: __ | Health literacy: __ | Language: __ | Cultural: __ | Geographic (rural/reservation access): __ | Caregiver availability: __ | Technology access for remote monitoring: __ | Pharmacy access: __"` | CMS SDOH Z-Code Guidelines; IHS Access to Care Framework; AAFP Social Needs |
| Caregiver Status & Support | `"Primary caregiver: __ | Relationship: __ | Caregiver burden: __ | Caregiver health concerns: __ | Respite care needs: Y/N | Family/community support network: __ | Tribal elder/family support system: __"` | CMS Caregiver Documentation; NAC/AARP Caregiver Assessment; IHS Family Support |
| Interval Changes & Events | `"ER visits since last contact: __ | Hospitalizations: __ | Specialist visits: __ | New diagnoses: __ | Medication changes by other providers: __ | Life changes affecting health: __"` | CMS CCM Care Coordination Requirements; CMS Transitional Care Management |
| Patient Goals & Priorities | `"Patient-stated goals: __ | Progress toward prior goals: __ | Barriers encountered: __ | Goal revision needed: Y/N | Cultural/spiritual health goals: __ | Quality of life priorities: __"` | CMS CCM Person-Centered Care Plan; IHI Patient-Centered Goals |
| Psychosocial & Behavioral Status | `"Mood/affect: __ | Anxiety level: __ | Sleep quality: __ | Social engagement: __ | Depression screen (if due): PHQ-2: __/6 | Substance use: __ | Historical/intergenerational trauma impact on chronic disease management: __"` | USPSTF Depression Screening; CMS Behavioral Health Integration; IHS BH Framework |

#### Objective (O) -- Chronic Care Management Visit

| Item | Format Template | Source |
|------|----------------|--------|
| Vital Signs & Trends | `"BP: __/__ mmHg (trend: __) | HR: __ bpm | Weight: __ (trend: __) | BMI: __ kg/m2 | SpO2: __% | Temp: __ F/C | Comparison to __ prior readings: __"` | AMA CPT E/M Guidelines 2021; ACC/AHA 2017 BP Guidelines |
| Disease-Specific Measures -- Diabetes | `"HbA1c: __ (date: __) | Goal: __ | Fasting glucose: __ | Post-prandial glucose range: __ | Hypoglycemic episodes: __ | Foot exam: __ | Monofilament: __ | Eye exam current: Y/N | Urine albumin/creatinine: __"` | ADA Standards of Care 2024; HEDIS Diabetes Measures |
| Disease-Specific Measures -- Cardiovascular | `"BP average (last 3 readings): __ | Lipid panel: TC __ / LDL __ / HDL __ / TG __ | ASCVD risk: __% | Statin therapy: Y/N | Antiplatelet: Y/N | Heart failure class: __ | BNP/NT-proBNP: __ | Echocardiogram: __"` | ACC/AHA 2019 CVD Prevention; JNC 8 (James et al., 2014); ACC/AHA Heart Failure Guidelines |
| Disease-Specific Measures -- Respiratory | `"Peak flow/FEV1: __ | Asthma control: ACT __/25 (well-controlled >= 20) | COPD assessment: CAT __/40 | mMRC dyspnea: __/4 | Exacerbation frequency: __ | Inhaler technique assessed: Y/N | Oxygen use: __"` | GINA 2023 Asthma Guidelines; GOLD 2024 COPD Guidelines |
| Disease-Specific Measures -- Other Chronic Conditions | `"Condition: __ | Measure: __ | Current value: __ | Target: __ | At goal: Y/N | Trend: __ | Disease-specific validated tool: __ | Score: __/__"` | Condition-specific clinical practice guidelines (AGA, ACR, AAN, etc.) |
| Medication List Review | `"Total medications: __ | Changes since last review: __ | High-risk medications (Beers Criteria): __ | Drug interactions identified: __ | Deprescribing opportunities: __ | Traditional remedy interactions: __ | Medication list reconciled with pharmacy: Y/N"` | AGS Beers Criteria 2023; CMS Medication Reconciliation; APhA MTM Standards |
| Care Coordination Notes | `"Specialist reports reviewed: __ | Hospital discharge summaries: __ | Home health reports: __ | Lab/imaging results: __ | Communication with other providers: __ | CHR/community health representative contact: __ | Tribal health program coordination: __"` | CMS CCM Care Coordination Requirements; IHS Care Coordination |
| Remote Monitoring Data (if applicable) | `"Remote monitoring device: __ | Data reviewed for period: __ | Trends: __ | Alerts/out-of-range values: __ | Patient compliance with monitoring: __ | Actionable findings: __"` | CMS RPM Guidelines (CPT 99453/99454/99457/99458); AMA Digital Health |
| Functional Status Assessment | `"ADL independence: __ | IADL independence: __ | Mobility status: __ | Fall risk: __ | Cognitive function: __ | Change from last assessment: __ | Assistive devices: __"` | CMS Functional Status Reporting; Katz ADL Index; Lawton IADL Scale |

#### Assessment (A) -- Chronic Care Management Visit

| Item | Format Template | Source |
|------|----------------|--------|
| Chronic Disease Status per Condition | `"Condition 1 (__ ICD-10: __): Status: controlled/uncontrolled/stable/worsening | Condition 2 (__ ICD-10: __): Status: controlled/uncontrolled/stable/worsening | Condition 3 (__ ICD-10: __): Status: controlled/uncontrolled/stable/worsening"` | CMS CCM Documentation Requirements; ICD-10-CM Chronic Condition Guidelines |
| Disease Control Metrics | `"Condition: __ | Primary metric: __ | Target: __ | Current: __ | At goal: Y/N | Time at goal: __ months | Trend: improving/stable/declining | Action threshold reached: Y/N"` | ADA Standards of Care 2024; ACC/AHA Quality Metrics; HEDIS Measures |
| Complication Screening | `"Condition: __ | Complications screened: __ | Findings: __ | New complications identified: __ | Specialist evaluation needed: Y/N | Preventive measures in place: __"` | ADA Standards of Care 2024 (Complications); ACC/AHA HF Staging; CKD-EPI Staging |
| Care Plan Effectiveness | `"Overall care plan status: effective/partially effective/needs revision | Goals met: __ | Goals not met: __ | Reasons for unmet goals: __ | Patient engagement level: __ | Care plan revisions needed: __"` | CMS CCM Care Plan Requirements; CMS Meaningful Measures Framework |
| Risk Level Assessment | `"Overall risk: Low/Moderate/High/Very High | Risk of exacerbation: __ | Risk of hospitalization: __ | Risk of functional decline: __ | Mortality risk: __ | Risk mitigation strategies: __"` | CMS HCC Risk Adjustment; AMA CPT E/M MDM Risk Table |
| Comorbidity Interaction Assessment | `"Interacting conditions: __ + __ | Impact of interaction: __ | Treatment conflicts: __ | Polypharmacy concerns: __ | Prioritization of competing demands: __"` | AGS Guiding Principles for Multimorbidity; ACP Comorbidity Management |

#### Plan (P) -- Chronic Care Management Visit

| Item | Format Template | Source |
|------|----------------|--------|
| Care Plan Updates | `"Care plan reviewed: Y/N | Revisions made: __ | New goals: __ | Discontinued goals: __ | Care plan shared with patient: Y/N | Copy provided: Y/N | Culturally adapted: Y/N | Patient/caregiver agreement: Y/N"` | CMS CCM Care Plan Requirements (42 CFR 414.510) |
| Medication Management | `"Medications adjusted: __ | New medications: __ | Discontinued: __ | Dose changes: __ | Rationale: __ | PDMP checked: Y/N | Formulary/cost considerations: __ | Prior authorization needed: Y/N | Traditional remedy safety reviewed: Y/N"` | CMS CCM Medication Management; FDA Drug Safety; APhA MTM |
| Care Coordination Activities | `"Providers contacted: __ | Purpose: __ | Outcome: __ | Referrals made: __ | Referrals pending: __ | Transitions of care managed: __ | PRC/CHS coordination: __ | CHR/community health representative: __ | Tribal health program: __"` | CMS CCM Care Coordination; IHS Referral Management |
| Self-Management Goals | `"Goal 1: __ | Action steps: __ | Timeline: __ | Support needed: __ | Goal 2: __ | Action steps: __ | Timeline: __ | Support needed: __ | Motivational interviewing used: Y/N | Cultural values integrated: Y/N"` | ADA Self-Management Education; AADE 7 Self-Care Behaviors; CMS CCM |
| Preventive Care within CCM | `"Preventive services due: __ | Screenings ordered: __ | Immunizations given/planned: __ | Counseling provided: __ | Tobacco cessation: __ | Annual wellness visit scheduled: Y/N"` | USPSTF A/B Recommendations; CDC ACIP; CMS Preventive Services |
| Community & Social Support | `"Community resources provided: __ | Meal programs: __ | Transportation arranged: __ | Home health services: __ | Durable medical equipment: __ | Tribal elder services: __ | Cultural/traditional support resources: __ | Support group referrals: __"` | CMS Community-Based Services; IHS Community Health Programs; AOA Services |
| Next Contact & Follow-Up | `"Next CCM contact: __ | Method: phone/telehealth/in-person | Purpose: __ | Pending results to review: __ | Between-visit monitoring plan: __ | Emergency plan reviewed: Y/N"` | CMS CCM Monthly Contact Requirements |
| Time Tracking for CCM Billing | `"Date of service: __ | Time spent today: __ minutes | Cumulative time this calendar month: __ minutes | Activities performed: __ | Staff type: clinical staff/physician/QHP | 20-minute threshold met (99490): Y/N | 30-minute threshold met (99491): Y/N | Additional 20-min increments (99439): __ | Consent on file: Y/N"` | CMS CCM Billing Requirements (CPT 99490/99491/99439/99437); AMA CPT Guidelines |

#### Medical Necessity (MN) -- Chronic Care Management Visit

| Item | Format Template | Source |
|------|----------------|--------|
| CCM Eligibility Confirmation | `"Qualifying chronic conditions (>= 2 required): 1. __ (ICD-10: __) 2. __ (ICD-10: __) 3. __ (ICD-10: __) | Duration expected >= 12 months: Y/N | Significant risk of death/exacerbation/functional decline: Y/N | Consent obtained: Y/N | Consent date: __"` | CMS CCM Requirements (42 CFR 414.510); CMS MLN CCM Fact Sheet |
| Medical Necessity Statement | `"Chronic care management services are medically necessary for __ due to: __ | Complexity of conditions requiring ongoing coordination: __ | Without CCM, risk of: __ | Patient would benefit from: __"` | CMS LCD/NCD Medical Necessity; 42 CFR 410.32; CMS CCM Final Rule |
| Service Documentation | `"CCM code billed: __ | Time requirement met: Y/N | Electronic care plan established: Y/N | 24/7 access provided: Y/N | Care management ensured during transitions: Y/N | Systematic assessment of medical/functional/psychosocial needs: Y/N"` | CMS CCM Service Requirements; CPT 99490/99491 Descriptors |
| IHS/Tribal Billing Considerations | `"Facility type: IHS/Tribal 638/Urban Indian | CCM eligible for third-party billing: Y/N | Medicare/Medicaid enrollment confirmed: Y/N | Only one provider may bill CCM per patient per month: confirmed Y/N | Care plan in EHR: Y/N"` | IHS Billing Guidelines; CMS CCM Single-Provider Rule; 42 CFR 136 |

---

### Appendix: SOAP Framework Quick Reference

| Subtype | CPT Codes | Target Items | MDM Range | Key Differentiator |
|---------|-----------|-------------|-----------|---------------------|
| New Patient Visit | 99202-99205 | 35-45 | Straightforward-High | Comprehensive baseline, full ROS, complete exam |
| Established Patient Follow-Up | 99211-99215 | 25-35 | Minimal-High | Interval changes, treatment response, focused exam |
| Annual Wellness Visit | G0438/G0439 | 35-45 | N/A (Prevention) | Health risk assessment, personalized prevention plan |
| Acute/Same-Day Visit | 99202-99215 | 25-30 | Straightforward-High | Acute complaint, red flags, disposition, return precautions |
| Chronic Care Management | 99490/99491 | 25-30 | N/A (Care Management) | Multi-condition management, time tracking, care coordination |

**Item Count Summary:**

| Subtype | S | O | A | P | MN | Total |
|---------|---|---|---|---|----|-------|
| New Patient Visit | 16 | 14 | 8 | 8 | 5 | 51 |
| Established Patient Follow-Up | 8 | 10 | 6 | 6 | 4 | 34 |
| Annual Wellness Visit | 10 | 9 | 5 | 7 | 4 | 35 |
| Acute/Same-Day Visit | 8 | 8 | 6 | 6 | 4 | 32 |
| Chronic Care Management | 8 | 9 | 6 | 8 | 4 | 35 |

**Sources Referenced:** AMA CPT E/M Guidelines 2021, CMS 1995/1997 Documentation Guidelines, CMS AWV/CCM Regulations (42 CFR), USPSTF A/B Recommendations, ACC/AHA Clinical Practice Guidelines, ADA Standards of Care 2024, CDC ACIP/STEADI/Prescribing Guidelines, DSM-5-TR, IHS Clinical and Billing Standards, Joint Commission NPSGs, AGS Beers Criteria, GINA/GOLD Respiratory Guidelines, AHRQ Health Literacy Toolkit, WHO ICF Framework, ACEP Clinical Policies, ICD-10-CM Official Guidelines.

---

## PART 2: HISTORY & PHYSICAL (H&P) FRAMEWORK

The History & Physical is the most comprehensive medical documentation type used in clinical medicine. Unlike SOAP notes, which track ongoing encounters and progress, the H&P captures a complete clinical picture at a single point in time. It is the foundational document for new patient evaluations, hospital admissions, surgical clearances, formal consultations, and emergency department encounters. The H&P framework organizes clinical reasoning from the patient's presenting complaint through a systematic review, examination, and culmination in a diagnostic assessment with management plan.

Each H&P subtype below is calibrated to a specific clinical context. The **Comprehensive H&P** is the gold standard for inpatient admissions, requiring the broadest scope. The **Focused H&P** narrows the lens to a single problem. The **Consultation H&P** adds the formal communication loop between requesting and consulting providers. The **Pre-Operative H&P** centers on surgical risk stratification and anesthetic safety. The **Emergency Department H&P** emphasizes acuity, time-critical decision-making, and disposition.

All format templates use `__` (double underscore) to denote blanks the AI fills. Pipes (`|`) within templates separate discrete data fields. Sources reference real clinical documentation standards.

---

### 1. Comprehensive H&P (Hospital Admission)

**Use Case:** Inpatient admission, new patient evaluation requiring the highest level of medical decision-making. Required by CMS for initial hospital care (CPT 99221-99223). Captures a complete 14-system ROS and multi-system physical examination per CMS 1997 Documentation Guidelines.

**Target Item Count:** 40-50 items

---

#### Chief Complaint (CC)

| Item Label | Format Template | Source |
|---|---|---|
| Chief Complaint | `"__ [patient's own words in quotes when possible]"` | AMA CPT/E&M 2021 Guidelines |
| Reason for Admission | `"Admitted for __ | Referred by __ | From __ [ED / clinic / outside hospital / direct admit]"` | CMS 1997 Documentation Guidelines |
| Referring / Presenting Provider | `"Referring provider: __ , __ [specialty] | Contact: __ | Referral reason: __"` | Joint Commission RC.02.01.01 |

#### History of Present Illness (HPI)

| Item Label | Format Template | Source |
|---|---|---|
| Onset & Location | `"Symptom onset: __ [date/time] | Duration: __ | Onset type: __ [sudden / gradual / insidious] | Location: __ | Laterality: __ [left / right / bilateral / midline] | Radiation: __ [Y/N], if Y: __"` | CMS 1997 Documentation Guidelines (8 HPI Elements) |
| Character & Severity | `"Quality: __ [sharp / dull / burning / pressure / cramping / aching / tearing / colicky / other: __] | Severity: __/10 at onset | __/10 current | __/10 at worst | Pain scale: __ [NRS / VAS / Wong-Baker]"` | CMS 1997 Documentation Guidelines (8 HPI Elements) |
| Timing & Pattern | `"Pattern: __ [constant / intermittent / episodic] | Frequency: __ | Duration of each episode: __ | Worsening trend: __ [Y/N]"` | CMS 1997 Documentation Guidelines (8 HPI Elements) |
| Modifying Factors | `"Aggravating factors: __ | Alleviating factors: __ | Treatments tried: __ | Response to treatment: __"` | CMS 1997 Documentation Guidelines (8 HPI Elements) |
| Associated Signs, Symptoms & Context | `"Associated symptoms: __ | Pertinent positives: __ | Pertinent negatives: __ | Clinical context: __ | Events leading to presentation: __"` | CMS 1997 Documentation Guidelines (8 HPI Elements) |
| Chronological Narrative | `"Chronological sequence: __ | Symptom evolution: __ | Functional impact trajectory: __"` | CMS 1997 Documentation Guidelines (8 HPI Elements) |
| Prior Workup & ED Findings | `"Prior evaluation: __ [labs / imaging / procedures] | Results: __ | Date(s): __ | ED evaluation: __ | ED interventions: __ | Response: __"` | AMA CPT/E&M 2021 Guidelines; ACEP Clinical Policy Guidelines |

#### Review of Systems (ROS)

| Item Label | Format Template | Source |
|---|---|---|
| Constitutional | `"Fever: __ [Y/N] | Chills: __ [Y/N] | Night sweats: __ [Y/N] | Weight change: __ [Y/N], __ lbs over __ | Fatigue: __ [Y/N] | Malaise: __ [Y/N]"` | CMS 1997 Documentation Guidelines (14-System ROS) |
| Eyes / ENMT | `"Vision changes: __ [Y/N] | Eye pain: __ [Y/N] | Diplopia: __ [Y/N] | Hearing loss: __ [Y/N] | Tinnitus: __ [Y/N] | Epistaxis: __ [Y/N] | Sore throat: __ [Y/N] | Dysphagia: __ [Y/N] | Dental problems: __ [Y/N]"` | CMS 1997 Documentation Guidelines (14-System ROS — Eyes, Ears/Nose/Mouth/Throat) |
| Cardiovascular | `"Chest pain: __ [Y/N] | Palpitations: __ [Y/N] | Dyspnea on exertion: __ [Y/N] | Orthopnea: __ [Y/N] | PND: __ [Y/N] | Edema: __ [Y/N] | Claudication: __ [Y/N]"` | CMS 1997 Documentation Guidelines (14-System ROS) |
| Respiratory | `"Cough: __ [Y/N] | Sputum: __ [Y/N], color: __ | Hemoptysis: __ [Y/N] | Wheezing: __ [Y/N] | Dyspnea at rest: __ [Y/N] | Pleuritic pain: __ [Y/N]"` | CMS 1997 Documentation Guidelines (14-System ROS) |
| Gastrointestinal | `"Nausea: __ [Y/N] | Vomiting: __ [Y/N] | Diarrhea: __ [Y/N] | Constipation: __ [Y/N] | Abdominal pain: __ [Y/N] | Melena: __ [Y/N] | Hematochezia: __ [Y/N] | Jaundice: __ [Y/N]"` | CMS 1997 Documentation Guidelines (14-System ROS) |
| Genitourinary | `"Dysuria: __ [Y/N] | Frequency: __ [Y/N] | Urgency: __ [Y/N] | Hematuria: __ [Y/N] | Incontinence: __ [Y/N] | Discharge: __ [Y/N] | LMP: __ [if applicable]"` | CMS 1997 Documentation Guidelines (14-System ROS) |
| Musculoskeletal / Integumentary | `"Joint pain: __ [Y/N] | Swelling: __ [Y/N] | Stiffness: __ [Y/N] | Back pain: __ [Y/N] | Myalgias: __ [Y/N] | Rash: __ [Y/N] | Skin lesions: __ [Y/N] | Pruritus: __ [Y/N] | Bruising: __ [Y/N]"` | CMS 1997 Documentation Guidelines (14-System ROS — Musculoskeletal, Integumentary) |
| Neurological | `"Headache: __ [Y/N] | Dizziness: __ [Y/N] | Syncope: __ [Y/N] | Seizures: __ [Y/N] | Numbness/tingling: __ [Y/N] | Focal weakness: __ [Y/N] | Gait disturbance: __ [Y/N]"` | CMS 1997 Documentation Guidelines (14-System ROS) |
| Psychiatric | `"Depression: __ [Y/N] | Anxiety: __ [Y/N] | Sleep disturbance: __ [Y/N] | Suicidal ideation: __ [Y/N] | Hallucinations: __ [Y/N] | Substance use: __ [Y/N]"` | CMS 1997 Documentation Guidelines (14-System ROS) |
| Endocrine | `"Polydipsia: __ [Y/N] | Polyuria: __ [Y/N] | Heat/cold intolerance: __ [Y/N] | Hair changes: __ [Y/N] | Skin changes: __ [Y/N]"` | CMS 1997 Documentation Guidelines (14-System ROS) |
| Hematologic / Lymphatic / Immunologic | `"Easy bleeding: __ [Y/N] | Easy bruising: __ [Y/N] | Lymphadenopathy: __ [Y/N] | History of blood clots: __ [Y/N] | Transfusion history: __ [Y/N] | Recurrent infections: __ [Y/N] | Autoimmune symptoms: __ [Y/N]"` | CMS 1997 Documentation Guidelines (14-System ROS — Hematologic/Lymphatic, Allergic/Immunologic) |

#### Past Medical, Surgical, Family & Social History (PMSFH)

| Item Label | Format Template | Source |
|---|---|---|
| Past Medical History | `"Active diagnoses: __ | Chronic conditions: __ | Hospitalizations: __ [date, reason] | Relevant past diagnoses: __"` | CMS 1997 Documentation Guidelines |
| Past Surgical History | `"Prior surgeries: __ [procedure, date, complications] | Anesthesia type: __ | Anesthesia complications: __ [Y/N], if Y: __"` | CMS 1997 Documentation Guidelines |
| Current Medications | `"Medication: __ | Dose: __ | Route: __ | Frequency: __ | Prescriber: __ | Adherence: __ [Y/N] | Last dose: __"` | Joint Commission NPSG.03.06.01 (Medication Reconciliation) |
| Allergies & Reactions | `"Allergen: __ | Type: __ [drug / food / environmental / latex] | Reaction: __ [anaphylaxis / rash / GI / angioedema / other: __] | Severity: __ [mild / moderate / severe] | Date identified: __"` | Joint Commission NPSG.03.06.01 |
| Family History | `"First-degree relative: __ | Condition: __ | Age of onset: __ | Deceased: __ [Y/N] | Cause of death: __ | Age at death: __ | Pertinent negatives: __"` | CMS 1997 Documentation Guidelines |
| Social History & Immunizations | `"Tobacco: __ [never / former / current] | Pack-years: __ | Alcohol: __ [none / social / moderate / heavy] | Drinks/week: __ | Illicit drugs: __ [none / history of / current] | Substances: __ | Occupation: __ | Living situation: __ | Marital status: __ | Immunizations: Influenza __ [date / declined] | Pneumococcal __ | COVID-19 __ [date, doses] | Tdap __ [date]"` | USPSTF Behavioral Counseling Recommendations; CDC ACIP |
| Advance Directives & Cultural Considerations | `"Advance directive on file: __ [Y/N] | Type: __ [living will / DPOA-HC / POLST / tribal elder designation] | Code status: __ [Full code / DNR / DNI / DNR-DNI / comfort care] | Cultural/spiritual care preferences: __ | Traditional healing practices: __ [Y/N], if Y: __ | Interpreter needed: __ [Y/N] | Language: __ | Tribal affiliation: __ [if applicable] | IHS eligibility: __ [Y/N]"` | Joint Commission RI.01.05.01; IHS Patient Rights Policy; CMS Conditions of Participation 42 CFR 489.102 |

#### Physical Examination (PE)

| Item Label | Format Template | Source |
|---|---|---|
| General Appearance | `"Appearance: __ [well / ill / acutely ill / toxic / distressed] | Development: __ [well-developed / cachectic / obese] | Nourishment: __ [well-nourished / malnourished] | Alertness: __ [alert / drowsy / lethargic / obtunded] | Cooperation: __ | Distress level: __"` | CMS 1997 Documentation Guidelines (Multi-System Exam) |
| Vital Signs | `"Temp: __ F/C | HR: __ bpm | BP: __/__ mmHg | RR: __ /min | SpO2: __ % on __ [RA / __ L NC / __ % VM / NRB / BiPAP / ventilator] | Weight: __ kg | Height: __ cm | BMI: __ | Pain: __/10 | Orthostatic vitals: __ [if indicated]"` | AMA CPT/E&M 2021 Guidelines |
| Head, Eyes, Ears, Nose, Throat (HEENT) | `"Head: __ [normocephalic / atraumatic / other: __] | Eyes: PERRL __ [Y/N] | EOM intact: __ [Y/N] | Sclera: __ [anicteric / icteric] | Conjunctiva: __ [pink / pale / injected] | Fundoscopic: __ | Ears: TMs __ [clear / bulging / erythematous] | Hearing: __ | Nose: __ [patent / congested / septal deviation] | Oropharynx: __ [clear / erythematous / exudate] | Dentition: __ | Mucous membranes: __ [moist / dry]"` | CMS 1997 Documentation Guidelines (Multi-System Exam) |
| Neck | `"Supple: __ [Y/N] | Lymphadenopathy: __ [Y/N], if Y: __ [location, size] | Thyromegaly: __ [Y/N] | JVD: __ [Y/N], estimated JVP: __ cm | Carotid bruits: __ [Y/N] | Trachea: __ [midline / deviated] | Meningismus: __ [Y/N]"` | CMS 1997 Documentation Guidelines (Multi-System Exam) |
| Cardiovascular | `"Rate: __ [regular / irregular] | Rhythm: __ [regular / irregularly irregular / regularly irregular] | S1/S2: __ [normal / distant / loud] | Murmur: __ [Y/N], if Y: grade __/VI, __ [systolic / diastolic], location: __, radiation: __ | Gallop: __ [Y/N] | Rub: __ [Y/N] | PMI: __ | Peripheral pulses: __ [2+ / diminished / absent] | Edema: __ [Y/N], grade: __/4+, location: __"` | CMS 1997 Documentation Guidelines (Multi-System Exam) |
| Respiratory / Pulmonary | `"Effort: __ [unlabored / labored / accessory muscle use] | Breath sounds: __ [clear / diminished / absent] bilateral | Adventitious sounds: __ [none / wheezes / crackles / rhonchi / stridor], location: __ | Percussion: __ [resonant / dull / hyperresonant] | Chest wall: __ [symmetric / asymmetric] | Tactile fremitus: __"` | CMS 1997 Documentation Guidelines (Multi-System Exam) |
| Abdomen | `"Inspection: __ [flat / distended / scaphoid / obese / surgical scars: __] | Bowel sounds: __ [normoactive / hypoactive / hyperactive / absent] | Tenderness: __ [Y/N], location: __ | Guarding: __ [Y/N] | Rebound: __ [Y/N] | Rigidity: __ [Y/N] | Hepatomegaly: __ [Y/N] | Splenomegaly: __ [Y/N] | Masses: __ [Y/N] | CVA tenderness: __ [Y/N]"` | CMS 1997 Documentation Guidelines (Multi-System Exam) |
| Extremities | `"Edema: __ [Y/N], __ /4+ | Cyanosis: __ [Y/N] | Clubbing: __ [Y/N] | Joint swelling: __ [Y/N], joints: __ | Deformity: __ [Y/N] | Range of motion: __ | Capillary refill: __ sec | Calf tenderness: __ [Y/N] | Pedal pulses: __"` | CMS 1997 Documentation Guidelines (Multi-System Exam) |
| Neurological | `"Mental status: __ [alert and oriented x __ ] | Cranial nerves: __ [II-XII intact / deficits: __] | Motor: __ [__/5 strength UE / __/5 LE, bilateral] | Sensation: __ [intact / diminished: __] | Reflexes: __ [__/4+ bilateral, symmetric / asymmetric: __] | Coordination: __ [finger-to-nose / heel-to-shin: __] | Gait: __ [normal / antalgic / ataxic / unable to assess] | Romberg: __ [negative / positive]"` | CMS 1997 Documentation Guidelines (Multi-System Exam) |
| Integumentary (Skin) | `"Color: __ [normal / pale / jaundiced / cyanotic / mottled / erythematous] | Turgor: __ [normal / poor / tenting] | Lesions: __ [Y/N], description: __ | Wounds: __ [Y/N], location: __, stage: __, size: __ cm | Pressure injury screening: __ [Braden score: __/23]"` | CMS 1997 Documentation Guidelines; NPUAP Pressure Injury Staging |
| Psychiatric & Rectal/GU (if indicated) | `"Affect: __ [appropriate / flat / blunted / labile] | Mood: __ [euthymic / depressed / anxious / irritable] | Thought process: __ [logical / tangential / disorganized] | Thought content: __ [no SI/HI / delusions / paranoia] | Judgment/Insight: __ [intact / impaired] | Rectal/GU exam: __ [not indicated / indicated: findings: __ | Chaperone: __ Y/N]"` | CMS 1997 Documentation Guidelines (Multi-System Exam) |

#### Assessment & Plan (A&P)

| Item Label | Format Template | Source |
|---|---|---|
| Admission Diagnoses | `"Primary diagnosis: __ [ICD-10: __] | Secondary diagnoses: __ [ICD-10: __] | Present on admission: __ [Y/N] for each"` | CMS ICD-10-CM Official Guidelines; Joint Commission RC.02.01.01 |
| Problem List & Differential | `"Problem #__: __ | Status: __ [active / chronic / acute-on-chronic] | Plan: __ | Differential: 1. __ [most likely] | 2. __ | 3. __ | Must-not-miss: __ | Rationale for working diagnosis: __"` | AMA CPT/E&M 2021 Guidelines |
| Acuity & Severity Level | `"Acuity: __ [critical / acute / subacute / chronic] | E&M level: __ [99221 / 99222 / 99223] | MDM complexity: __ [moderate / high] | Estimated LOS: __ days"` | AMA CPT/E&M 2021 Guidelines; CMS 1997 Documentation Guidelines |
| Initial Orders & VTE Prophylaxis | `"Diagnostics: __ [labs / imaging / studies ordered] | Therapeutics: __ [medications / IV fluids / O2] | Monitoring: __ [telemetry / q__ vitals / I&O / neuro checks] | Nursing: __ [fall precautions / isolation / wound care] | VTE risk: __ [Padua: __/20 | Caprini: __] | VTE prophylaxis: __ [pharmacologic: __ / mechanical: SCDs / both / contraindicated: __]"` | Joint Commission PC.02.01.01; CHEST Guidelines 2012 (Kahn et al.); Joint Commission VTE Core Measures |
| Consultant Requests | `"Consult requested: __ [specialty] | Reason: __ | Urgency: __ [emergent / urgent / routine] | Contacted: __ [Y/N]"` | AMA CPT Consultation Guidelines |
| Code Status & Goals of Care | `"Code status confirmed: __ [full code / DNR / DNI / DNR-DNI / comfort measures] | Discussed with: __ [patient / family / healthcare proxy: __] | Goals of care discussion: __ | Cultural/spiritual considerations: __ | Traditional healing preferences discussed: __ [Y/N]"` | Joint Commission RI.01.05.01; IHS Patient Rights Policy |
| Diet, Activity & Disposition | `"Diet: __ [regular / cardiac / diabetic / renal / NPO / clear liquids / other: __] | Activity: __ [ad lib / bedrest / ambulate with assist] | Fall risk: __ [Morse score: __] | PT/OT consult: __ [Y/N] | Anticipated disposition: __ [home / SNF / rehab / LTACH / transfer] | Barriers to discharge: __ | Case management: __ [Y/N] | IHS/tribal transportation needs: __ [Y/N]"` | CMS Conditions of Participation 42 CFR 482.43; Morse Fall Scale |

#### Medical Necessity

| Item Label | Format Template | Source |
|---|---|---|
| Admission Criteria Met | `"Admission criteria: __ [InterQual / Milliman / MCG] | Criteria version: __ | Clinical indicators met: __ | Subset: __"` | InterQual Level of Care Criteria; Milliman Care Guidelines |
| Severity of Illness & Intensity of Service | `"SI indicators: __ | Vital sign instability: __ [Y/N] | Lab abnormalities: __ [Y/N] | Acute organ dysfunction: __ [Y/N] | IS indicators: __ | IV medications: __ [Y/N] | Continuous monitoring: __ [Y/N] | Procedures required: __ [Y/N] | Cannot be provided in outpatient setting because: __"` | CMS Inpatient Admission Order Requirements (CMS-R-193) |
| Attending Attestation | `"Patient evaluated and examined by attending: __ [Y/N] | I have personally seen and examined the patient, reviewed the history, and agree with the documented findings and plan | Attending signature: __ | Date/Time: __"` | CMS Teaching Physician Rules 42 CFR 415.172 |
| Payer-Specific Requirements | `"Payer: __ | Prior authorization: __ [Y/N] | Auth #: __ | Certified days: __ | IHS/Tribal referral: __ [PRC authorization: __ / CHS referral #: __] | Continued stay review due: __"` | CMS Conditions of Participation; IHS Purchased/Referred Care (PRC) Policy |

---

### 2. Focused H&P (Problem-Specific)

**Use Case:** Targeted evaluation for a specific clinical problem. Used for outpatient consultations, focused workups, urgent care visits, and problem-specific follow-ups requiring a new H&P rather than a progress note. Supports E&M levels 99202-99205 (new patient) or 99212-99215 (established patient).

**Target Item Count:** 25-35 items

---

#### Chief Complaint (CC)

| Item Label | Format Template | Source |
|---|---|---|
| Chief Complaint | `"__ [patient's stated reason for visit in their own words]"` | AMA CPT/E&M 2021 Guidelines |
| Visit Purpose | `"Visit type: __ [new problem / follow-up / second opinion / referral from __] | Urgency: __ [routine / urgent / same-day]"` | AMA CPT/E&M 2021 Guidelines |

#### History of Present Illness (HPI)

| Item Label | Format Template | Source |
|---|---|---|
| Onset & Duration | `"Onset: __ | Duration: __ | Onset type: __ [sudden / gradual] | Precipitating event: __"` | CMS 1997 Documentation Guidelines (HPI Elements) |
| Character & Severity | `"Quality: __ | Severity: __/10 | Impact on function: __ [none / mild / moderate / severe]"` | CMS 1997 Documentation Guidelines (HPI Elements) |
| Timing & Modifying Factors | `"Pattern: __ [constant / intermittent] | Worse with: __ | Better with: __ | Treatments tried: __ | Response: __"` | CMS 1997 Documentation Guidelines (HPI Elements) |
| Associated Symptoms | `"Pertinent positives: __ | Pertinent negatives: __"` | CMS 1997 Documentation Guidelines (HPI Elements) |
| Prior Evaluation | `"Previous workup: __ | Results: __ | Prior treatment: __ | Response: __"` | AMA CPT/E&M 2021 Guidelines |
| Current Status | `"Current symptom status: __ [improving / stable / worsening] | Functional impact: __ | Patient concern: __"` | AMA CPT/E&M 2021 Guidelines |

#### Review of Systems (ROS)

| Item Label | Format Template | Source |
|---|---|---|
| Constitutional | `"Fever: __ [Y/N] | Weight change: __ [Y/N] | Fatigue: __ [Y/N] | Night sweats: __ [Y/N]"` | CMS 1997 Documentation Guidelines (2-9 System ROS) |
| Primary Affected System | `"System: __ | Symptoms reviewed: __ | Positives: __ | Negatives: __"` | CMS 1997 Documentation Guidelines (2-9 System ROS) |
| Secondary Affected System | `"System: __ | Symptoms reviewed: __ | Positives: __ | Negatives: __"` | CMS 1997 Documentation Guidelines (2-9 System ROS) |
| Additional Pertinent Systems | `"System: __ | Key symptoms: __ [Y/N for each] | All other systems reviewed and negative: __ [Y/N]"` | CMS 1997 Documentation Guidelines (2-9 System ROS) |

#### Past Medical, Surgical, Family & Social History (PMSFH)

| Item Label | Format Template | Source |
|---|---|---|
| Pertinent Past Medical History | `"Relevant diagnoses: __ | Year diagnosed: __ | Current management: __ | Control status: __"` | CMS 1997 Documentation Guidelines |
| Pertinent Surgical History | `"Relevant prior surgeries: __ | Date: __ | Outcome: __ | Complications: __"` | CMS 1997 Documentation Guidelines |
| Current Medications | `"Relevant medications: __ | Dose: __ | Duration: __ | Adherence: __ [Y/N] | OTC/supplements: __"` | Joint Commission NPSG.03.06.01 |
| Allergies | `"Allergies: __ | Reaction type: __ | NKDA: __ [Y/N]"` | Joint Commission NPSG.03.06.01 |
| Pertinent Family & Social History | `"Relevant family hx: __ | Social hx: __ [tobacco / alcohol / occupation / exposures relevant to complaint] | Interpreter needed: __ [Y/N] | Language: __"` | CMS 1997 Documentation Guidelines; IHS Patient Rights Policy |

#### Physical Examination (PE)

| Item Label | Format Template | Source |
|---|---|---|
| General Appearance | `"Appearance: __ [well / ill / no acute distress] | Alertness: __"` | CMS 1997 Documentation Guidelines |
| Vital Signs | `"Temp: __ | HR: __ | BP: __/__ | RR: __ | SpO2: __% | Weight: __ | BMI: __"` | AMA CPT/E&M 2021 Guidelines |
| Primary System Exam | `"System examined: __ | Inspection: __ | Palpation: __ | Percussion: __ [if applicable] | Auscultation: __ [if applicable] | Findings: __"` | CMS 1997 Documentation Guidelines (Single Organ System Exam) |
| Secondary System Exam | `"System examined: __ | Key findings: __ | Normal: __ [Y/N] | Abnormalities: __"` | CMS 1997 Documentation Guidelines |
| Related System Exam | `"System examined: __ | Key findings: __ | Relevance to chief complaint: __"` | CMS 1997 Documentation Guidelines |
| Functional Assessment | `"Gait: __ | Mobility: __ | ADL status: __ | Functional limitation: __"` | AMA CPT/E&M 2021 Guidelines |

#### Assessment & Plan (A&P)

| Item Label | Format Template | Source |
|---|---|---|
| Primary Assessment | `"Diagnosis: __ [ICD-10: __] | Clinical reasoning: __ | Confidence: __ [confirmed / probable / possible]"` | AMA CPT/E&M 2021 Guidelines |
| Differential Diagnosis | `"Differential: 1. __ | 2. __ | 3. __ | Rationale for working diagnosis: __"` | AMA CPT/E&M 2021 — Medical Decision-Making |
| Diagnostic Plan | `"Labs ordered: __ | Imaging ordered: __ | Procedures: __ | Rationale: __"` | AMA CPT/E&M 2021 Guidelines |
| Treatment Plan | `"Medications: __ [new / changed / continued] | Non-pharmacologic: __ | Referrals: __ | Patient education: __"` | AMA CPT/E&M 2021 Guidelines |
| Follow-Up | `"Return visit: __ [timeframe] | Indications for earlier return: __ | Monitoring plan: __"` | AMA CPT/E&M 2021 Guidelines |
| E&M Level Justification | `"E&M code: __ [99202-99205 / 99212-99215] | MDM complexity: __ [straightforward / low / moderate / high] | Basis: __ [number of problems / data reviewed / risk of management]"` | AMA CPT/E&M 2021 Guidelines |

#### Medical Necessity

| Item Label | Format Template | Source |
|---|---|---|
| Visit Medical Necessity | `"Clinical indication for visit: __ | Symptom severity: __ | Impact on daily function: __"` | CMS LCD/NCD Coverage Determinations |
| Diagnostic Necessity | `"Tests ordered: __ | Clinical indication: __ [ICD-10: __] | Expected impact on management: __"` | CMS LCD/NCD Coverage Determinations |
| Treatment Necessity | `"Treatment selected: __ | Evidence basis: __ | Alternative treatments considered: __ | Reason for selected approach: __"` | AMA CPT/E&M 2021 Guidelines |

---

### 3. Consultation H&P

**Use Case:** Formal consultation requested by another provider. Requires documentation of the request, the clinical question posed, a comprehensive or detailed specialty-focused evaluation, and clear communication of findings and recommendations back to the requesting provider. Supports CPT 99242-99245 (office) or 99252-99255 (inpatient).

**Target Item Count:** 35-45 items

---

#### Chief Complaint (CC)

| Item Label | Format Template | Source |
|---|---|---|
| Reason for Consultation | `"Consultation requested for: __ | Clinical question: __"` | AMA CPT Consultation Guidelines; CMS 1997 Documentation Guidelines |
| Requesting Provider | `"Requesting provider: __ , __ [specialty] | Practice/facility: __ | Contact: __ | Request received: __ [date/time]"` | AMA CPT Consultation Guidelines |
| Urgency & Setting | `"Urgency: __ [emergent / urgent / routine] | Setting: __ [inpatient / outpatient / ED] | Patient location: __"` | AMA CPT Consultation Guidelines |

#### History of Present Illness (HPI)

| Item Label | Format Template | Source |
|---|---|---|
| Problem-Focused Narrative | `"Presenting problem: __ | Duration: __ | Progression: __ [stable / improving / worsening] | Functional impact: __"` | CMS 1997 Documentation Guidelines (HPI Elements) |
| Chronological Development | `"Timeline: __ | Key events: __ | Hospitalizations related: __ | Interventions to date: __"` | CMS 1997 Documentation Guidelines (HPI Elements) |
| Symptom Detail (OLDCARTS) | `"Onset: __ | Location: __ | Duration: __ | Character: __ | Aggravating: __ | Relieving: __ | Timing: __ | Severity: __/10"` | CMS 1997 Documentation Guidelines (8 HPI Elements) |
| Prior Workup Reviewed | `"Records reviewed: __ [labs / imaging / pathology / prior consult notes] | Key findings: __ | Dates: __ | Source: __"` | AMA CPT/E&M 2021 — Data Reviewed |
| Outside Records | `"Outside records obtained: __ [Y/N] | Source: __ | Records reviewed: __ | Relevant findings: __ | Gaps in information: __"` | AMA CPT/E&M 2021 — Data Reviewed |
| Pertinent Positives & Negatives | `"For the consultation question, pertinent positives: __ | Pertinent negatives: __ | Red flag symptoms: __ [Y/N], if Y: __"` | CMS 1997 Documentation Guidelines |
| Response to Prior Treatment | `"Prior treatments for this condition: __ | Response: __ [improved / no change / worsened] | Adverse effects: __ | Reason for consultation: __"` | AMA CPT/E&M 2021 Guidelines |

#### Review of Systems (ROS)

| Item Label | Format Template | Source |
|---|---|---|
| Constitutional | `"Fever: __ [Y/N] | Weight change: __ [Y/N] | Fatigue: __ [Y/N] | Night sweats: __ [Y/N] | Appetite: __"` | CMS 1997 Documentation Guidelines |
| Primary Specialty System #1 | `"System: __ | Symptoms: __ [detailed Y/N for each pertinent symptom]"` | CMS 1997 Documentation Guidelines |
| Primary Specialty System #2 | `"System: __ | Symptoms: __ [detailed Y/N for each pertinent symptom]"` | CMS 1997 Documentation Guidelines |
| Related System #1 | `"System: __ | Key symptoms: __ [Y/N for each]"` | CMS 1997 Documentation Guidelines |
| Related System #2 | `"System: __ | Key symptoms: __ [Y/N for each]"` | CMS 1997 Documentation Guidelines |
| Additional Systems | `"Systems reviewed: __ | Pertinent findings: __ | All other systems negative: __ [Y/N]"` | CMS 1997 Documentation Guidelines |
| Psychiatric Screen & Functional Status | `"Mood: __ | Anxiety: __ [Y/N] | Sleep: __ | Cognitive changes: __ [Y/N] | Substance use: __ [Y/N] | ADL independence: __ [Y/N] | Mobility: __ | Exercise tolerance: __ [METs: __]"` | CMS 1997 Documentation Guidelines; AMA CPT/E&M 2021 Guidelines |

#### Past Medical, Surgical, Family & Social History (PMSFH)

| Item Label | Format Template | Source |
|---|---|---|
| Past Medical History | `"Medical conditions: __ | Pertinent to consultation: __ | Management: __ | Control: __"` | CMS 1997 Documentation Guidelines |
| Past Surgical History | `"Surgeries: __ [procedure, date] | Relevant complications: __ | Anesthesia issues: __"` | CMS 1997 Documentation Guidelines |
| Medications with Review | `"Current medications: __ | Pertinent to consult question: __ [drug, dose, duration, response] | Potential interactions: __ | Medication reconciliation completed: __ [Y/N]"` | Joint Commission NPSG.03.06.01 |
| Allergies | `"Allergies: __ | Reaction: __ | Cross-reactivity relevant to consult recommendations: __"` | Joint Commission NPSG.03.06.01 |
| Family History (Pertinent) | `"Pertinent family history: __ | Genetic considerations: __ | Hereditary risk factors for consultation question: __"` | CMS 1997 Documentation Guidelines |
| Social & Cultural History | `"Occupation: __ | Exposures: __ | Tobacco: __ | Alcohol: __ | Substance use: __ | Living situation: __ | Support system: __ | Interpreter needed: __ [Y/N] | Language: __ | Tribal affiliation: __ [if applicable] | Cultural factors relevant to treatment plan: __"` | CMS 1997 Documentation Guidelines; IHS Patient Rights Policy |

#### Physical Examination (PE)

| Item Label | Format Template | Source |
|---|---|---|
| General Appearance & Vitals | `"Appearance: __ | Body habitus: __ | Apparent age vs stated age: __ | Level of comfort: __ | Temp: __ | HR: __ | BP: __/__ | RR: __ | SpO2: __% on __ | Weight: __ kg | BMI: __"` | CMS 1997 Documentation Guidelines; AMA CPT/E&M 2021 Guidelines |
| HEENT & Neck (if relevant) | `"Head: __ | Eyes: __ | Ears: __ | Nose: __ | Throat: __ | Lymphadenopathy: __ [Y/N] | Thyroid: __ | JVD: __ [Y/N] | Carotid exam: __"` | CMS 1997 Documentation Guidelines |
| Cardiovascular | `"Rate/rhythm: __ | Heart sounds: __ | Murmurs: __ [Y/N] | Peripheral pulses: __ | Edema: __ [Y/N]"` | CMS 1997 Documentation Guidelines |
| Respiratory | `"Effort: __ | Breath sounds: __ | Adventitious sounds: __ [Y/N] | Percussion: __"` | CMS 1997 Documentation Guidelines |
| Abdomen | `"Soft: __ [Y/N] | Tenderness: __ [Y/N] | Organomegaly: __ [Y/N] | Bowel sounds: __"` | CMS 1997 Documentation Guidelines |
| Specialty-Specific Exam #1 | `"Examination area: __ | Technique: __ | Findings: __ | Normal: __ [Y/N] | Abnormalities: __ | Measurements: __ | Comparison to prior: __"` | CMS 1997 Documentation Guidelines (Single Organ System Exam) |
| Specialty-Specific Exam #2 | `"Examination area: __ | Special tests: __ | Results: __ | Interpretation: __"` | CMS 1997 Documentation Guidelines (Single Organ System Exam) |
| Neurological / MSK / Skin (if relevant) | `"Mental status: __ | Motor: __ | Sensory: __ | Reflexes: __ | Skin inspection: __ | Palpation: __ | ROM: __ | Special tests: __"` | CMS 1997 Documentation Guidelines |

#### Assessment & Plan (A&P)

| Item Label | Format Template | Source |
|---|---|---|
| Consultation Impression | `"Primary impression: __ [ICD-10: __] | Clinical reasoning: __ | Confidence level: __ [definite / probable / possible / rule out]"` | AMA CPT Consultation Guidelines |
| Response to Clinical Question | `"Requesting provider asked: __ | My assessment: __ | Supporting evidence: __ | Answer to clinical question: __"` | AMA CPT Consultation Guidelines |
| Differential Diagnosis | `"Differential: 1. __ [most likely, probability: __] | 2. __ | 3. __ | Key distinguishing factors: __"` | AMA CPT/E&M 2021 — Medical Decision-Making |
| Recommendations — Diagnostics | `"Recommended tests: __ | Rationale: __ | Expected timeline: __ | Anticipated findings: __"` | AMA CPT/E&M 2021 Guidelines |
| Recommendations — Treatment | `"Recommended treatment: __ | Medication: __ [drug, dose, route, frequency, duration] | Procedures recommended: __ | Non-pharmacologic: __"` | AMA CPT/E&M 2021 Guidelines |
| Follow-Up Plan | `"Follow-up with consulting service: __ [timeframe] | Triggers for re-consultation: __ | Anticipated duration of involvement: __ | Will see patient: __ [one-time / serial follow-up]"` | AMA CPT Consultation Guidelines |
| Communication to Requesting Provider | `"Findings and recommendations communicated to: __ | Method: __ [verbal / written / EHR / fax] | Date/time: __ | Acknowledged by: __ | Key points communicated: __"` | AMA CPT Consultation Guidelines; Joint Commission PC.02.02.01 |
| Patient Communication | `"Findings discussed with patient: __ [Y/N] | Family/support present: __ | Understanding confirmed: __ [Y/N] | Questions addressed: __ | Cultural considerations in communication: __ | Interpreter used: __ [Y/N]"` | Joint Commission RI.01.01.01; IHS Patient Rights Policy |

#### Medical Necessity

| Item Label | Format Template | Source |
|---|---|---|
| Consultation Necessity | `"Consultation medically necessary because: __ | Specialty expertise required: __ | Beyond scope of requesting provider: __ [Y/N] | Complexity: __"` | AMA CPT Consultation Guidelines |
| Clinical Complexity | `"Number of diagnoses/management options: __ | Data to review: __ [amount / complexity] | Risk: __ [minimal / low / moderate / high] | MDM level: __"` | AMA CPT/E&M 2021 — Table of Medical Decision-Making |
| Consultation vs. Transfer of Care | `"This encounter represents: __ [consultation / transfer of care / co-management] | Requesting provider retains primary management: __ [Y/N] | Ongoing involvement planned: __ [Y/N]"` | AMA CPT Consultation Guidelines |
| IHS/Tribal Referral Authorization | `"IHS/Tribal facility referral: __ [Y/N] | PRC authorization: __ [Y/N] | Auth #: __ | Referral within service unit: __ [Y/N] | Contract health eligibility verified: __ [Y/N]"` | IHS Purchased/Referred Care (PRC) Policy |

---

### 4. Pre-Operative H&P

**Use Case:** Pre-surgical clearance and risk stratification evaluation. Required within 30 days of surgery (within 24 hours for inpatient procedures per Joint Commission). Focuses on anesthetic risk, cardiac risk, bleeding risk, and optimization of medical conditions prior to surgery. Documents surgical fitness and medical clearance.

**Target Item Count:** 30-40 items

---

#### Chief Complaint (CC)

| Item Label | Format Template | Source |
|---|---|---|
| Planned Procedure | `"Planned procedure: __ | CPT code: __ | Surgical approach: __ [open / laparoscopic / robotic / endoscopic] | Estimated duration: __"` | Joint Commission PC.03.01.01 (Pre-Operative Assessment) |
| Surgeon & Scheduling | `"Surgeon: __ | Specialty: __ | Scheduled date: __ | Facility: __ | Anesthesia type anticipated: __ [general / regional / MAC / local]"` | Joint Commission PC.03.01.01 |
| Surgical Indication | `"Indication for surgery: __ | Urgency: __ [elective / urgent / emergent] | Conservative treatments tried: __ | Reason surgery needed now: __"` | AMA CPT/E&M 2021 Guidelines |

#### History of Present Illness (HPI)

| Item Label | Format Template | Source |
|---|---|---|
| Surgical Condition | `"Diagnosis requiring surgery: __ [ICD-10: __] | Duration: __ | Symptom progression: __ | Functional impact: __"` | CMS 1997 Documentation Guidelines |
| Current Symptom Status | `"Current symptoms: __ | Severity: __/10 | Activity limitation: __ | Treatment to date: __"` | CMS 1997 Documentation Guidelines |
| Anesthesia History | `"Prior anesthesia: __ [Y/N] | Type: __ | Complications: __ [Y/N], if Y: __ [difficult airway / prolonged paralysis / malignant hyperthermia / PONV / awareness / other: __] | Family hx anesthesia complications: __ [Y/N]"` | ASA Practice Advisory for Preanesthesia Evaluation (2012) |
| Prior Surgical Complications | `"Prior surgeries: __ | Surgical complications: __ [Y/N], if Y: __ [infection / bleeding / DVT/PE / wound dehiscence / other: __] | Transfusion history: __ [Y/N], reactions: __"` | ASA Practice Advisory for Preanesthesia Evaluation |
| Bleeding / Thrombosis History | `"Abnormal bleeding: __ [Y/N] | Easy bruising: __ [Y/N] | Prior DVT/PE: __ [Y/N] | Anticoagulant use: __ [Y/N], agent: __ | Last dose: __ | Thrombophilia: __ [Y/N]"` | ASA Practice Advisory; CHEST Antithrombotic Guidelines |

#### Review of Systems (ROS)

| Item Label | Format Template | Source |
|---|---|---|
| Constitutional | `"Fever: __ [Y/N] | Recent illness: __ [Y/N] | Weight change: __ [Y/N] | Fatigue: __ [Y/N] | Exercise tolerance: __ [METs: __]"` | CMS 1997 Documentation Guidelines |
| Cardiovascular | `"Chest pain: __ [Y/N] | Dyspnea on exertion: __ [Y/N] | Orthopnea: __ [Y/N] | PND: __ [Y/N] | Palpitations: __ [Y/N] | Syncope: __ [Y/N] | Edema: __ [Y/N] | Claudication: __ [Y/N] | Functional capacity: __ [>4 METs / <4 METs] | Activities: __ [climb stairs / walk 2 blocks / heavy housework]"` | ACC/AHA 2014 Perioperative Cardiovascular Evaluation Guidelines |
| Respiratory | `"Cough: __ [Y/N] | Sputum: __ [Y/N] | Wheezing: __ [Y/N] | Dyspnea at rest: __ [Y/N] | Sleep apnea: __ [Y/N] | CPAP use: __ [Y/N] | Smoking status: __ [current / former / never] | Pack-years: __ | Recent URI: __ [Y/N]"` | ASA Practice Advisory; STOP-Bang Questionnaire |
| Gastrointestinal | `"GERD: __ [Y/N] | Nausea/vomiting: __ [Y/N] | Hepatic disease: __ [Y/N] | NPO status: __ [last solid: __ | last clear liquid: __]"` | ASA Fasting Guidelines (2017) |
| Endocrine / Metabolic | `"Diabetes: __ [Y/N], type: __, last A1c: __ | Thyroid disease: __ [Y/N] | Adrenal insufficiency: __ [Y/N] | Steroid use: __ [Y/N], dose: __, duration: __"` | ADA Perioperative Diabetes Management Guidelines |
| Hematologic | `"Bleeding disorder: __ [Y/N] | Anticoagulant/antiplatelet: __ [agent: __, last dose: __] | Sickle cell: __ [Y/N] | Anemia: __ [Y/N] | Last CBC: __"` | ASA Practice Advisory; CHEST Antithrombotic Guidelines |
| Neurological / Allergic / Immunologic | `"Seizures: __ [Y/N] | Stroke/TIA: __ [Y/N] | Neuromuscular disease: __ [Y/N] | Spinal disease: __ [Y/N, relevant for regional anesthesia] | Latex allergy: __ [Y/N] | Egg allergy: __ [Y/N, relevant for propofol] | Antibiotic allergies: __ [Y/N, relevant for prophylaxis] | Immunosuppressed: __ [Y/N]"` | ASA Practice Advisory for Preanesthesia Evaluation; SCIP Infection Prevention Guidelines |

#### Past Medical, Surgical, Family & Social History (PMSFH)

| Item Label | Format Template | Source |
|---|---|---|
| Past Medical History | `"Active conditions: __ | Cardiac history: __ [CAD / CHF / valvular / arrhythmia] | Pulmonary history: __ [COPD / asthma / OSA] | Renal function: __ [Cr: __ / GFR: __] | Hepatic function: __ | Diabetes: __ [type / A1c / management]"` | ACC/AHA 2014 Perioperative Guidelines |
| Complete Surgical History | `"Prior surgeries: __ [procedure, date, anesthesia type, complications] | Difficult intubation: __ [Y/N] | Prolonged recovery: __ [Y/N] | ICU stay required: __ [Y/N]"` | ASA Practice Advisory for Preanesthesia Evaluation |
| Current Medications (Complete) | `"Medication: __ | Dose: __ | Route: __ | Frequency: __ | Anticoagulants: __ [agent, last dose, bridging plan] | Antihypertensives: __ [hold/continue] | Diabetic meds: __ [hold/adjust] | Herbals/supplements: __ [discontinue: __ days prior] | MAOIs: __ [Y/N]"` | ASA Practice Advisory; ACC/AHA Perioperative Guidelines |
| Allergies (Detailed) | `"Drug allergies: __ [agent, reaction, severity] | Latex: __ [Y/N] | Iodine/contrast: __ [Y/N] | Adhesive: __ [Y/N] | Food: __ | Environmental: __ | NKDA: __ [Y/N]"` | Joint Commission NPSG.03.06.01 |
| Family History (Anesthesia-Focused) | `"Family hx malignant hyperthermia: __ [Y/N] | Family hx pseudocholinesterase deficiency: __ [Y/N] | Family hx anesthesia complications: __ [Y/N], details: __ | Family hx bleeding disorder: __ [Y/N] | Family hx cardiac death: __ [Y/N]"` | ASA Practice Advisory for Preanesthesia Evaluation |
| Social History & Functional Capacity | `"Tobacco: __ [status, pack-years, cessation date] | Alcohol: __ [drinks/week, last drink] | Illicit drugs: __ [Y/N, substances] | Functional capacity: __ METs | Independent ADLs: __ [Y/N] | Ambulatory status: __ | Occupation: __ | Home support for recovery: __ [Y/N] | Tribal affiliation: __ [if applicable] | Transportation for post-op follow-up: __ [Y/N]"` | ACC/AHA 2014 Perioperative Guidelines; IHS Patient Rights Policy |
| Advance Directives & Fasting Status | `"Advance directive: __ [Y/N] | Type: __ [living will / DPOA-HC / POLST] | Code status: __ | Discussed peri-operative code status: __ [Y/N] | Cultural/spiritual considerations: __ | Traditional healing practices: __ [Y/N] | Last solid food: __ [date/time] | Last clear liquid: __ [date/time] | NPO compliant: __ [Y/N]"` | ASA Ethics Committee Guidelines; Joint Commission RI.01.05.01; ASA Practice Guidelines for Preoperative Fasting (2017) |

#### Physical Examination (PE)

| Item Label | Format Template | Source |
|---|---|---|
| General Appearance & Vitals | `"Appearance: __ | Body habitus: __ | Apparent age: __ | Anxiety level: __ | Functional status observed: __ | Temp: __ | HR: __ | BP: __/__ [bilateral if indicated] | RR: __ | SpO2: __% on RA | Weight: __ kg | Height: __ cm | BMI: __"` | CMS 1997 Documentation Guidelines; ASA Practice Advisory for Preanesthesia Evaluation |
| Airway Assessment | `"Mallampati class: __/IV | Mouth opening: __ [>3 cm / limited: __ cm] | Thyromental distance: __ [>6 cm / <6 cm] | Neck mobility: __ [full / limited: __] | Dentition: __ [intact / loose teeth / dentures / dental work at risk: __] | Beard: __ [Y/N] | Neck circumference: __ cm | Anticipated difficult airway: __ [Y/N] | Reason: __"` | ASA Practice Guidelines for Difficult Airway Management (2022) |
| Cardiovascular | `"Rate: __ | Rhythm: __ | Heart sounds: __ | Murmurs: __ [Y/N], description: __ | JVD: __ [Y/N] | Peripheral pulses: __ | Edema: __ [Y/N] | Carotid bruits: __ [Y/N] | IV access assessment: __"` | ACC/AHA 2014 Perioperative Guidelines |
| Respiratory | `"Breath sounds: __ | Adventitious sounds: __ [Y/N] | Chest wall movement: __ | Effort: __ | Baseline O2 requirement: __ | STOP-Bang score: __/8 [OSA risk: __ low 0-2 / intermediate 3-4 / high 5-8]"` | ASA Practice Advisory; STOP-Bang Questionnaire (Chung et al.) |
| Abdomen | `"Inspection: __ | Tenderness: __ [Y/N] | Organomegaly: __ [Y/N] | Ascites: __ [Y/N] | Prior surgical scars: __ | Relevant to planned procedure: __"` | CMS 1997 Documentation Guidelines |
| Extremities & Vascular Access | `"Edema: __ [Y/N] | DVT signs: __ [Y/N] | Peripheral pulses: __ | IV access: __ [adequate / difficult, reason: __] | Allen test: __ [if arterial line planned: positive / negative] | Potential regional anesthesia site: __ [assessment: __]"` | ASA Practice Advisory for Preanesthesia Evaluation |
| Neurological & Spine (if regional planned) | `"Mental status: __ | Motor strength: __ | Sensation: __ | Baseline deficits: __ [Y/N], if Y: __ | Spinal exam: __ | Scoliosis: __ [Y/N] | Prior spine surgery: __ [Y/N] | Landmarks palpable: __ [Y/N] | Contraindications to neuraxial: __ [Y/N]"` | ASA Practice Advisory for Preanesthesia Evaluation; ASA Practice Guidelines for Regional Anesthesia (2010) |
| Skin & Surgical Site | `"Skin integrity at surgical site: __ | Infection near site: __ [Y/N] | Rashes/lesions: __ [Y/N] | Prior incisions: __ | Relevant anatomy: __"` | Joint Commission UP.01.01.01 (Universal Protocol) |

#### Assessment & Plan (A&P)

| Item Label | Format Template | Source |
|---|---|---|
| Surgical Risk & ASA Classification | `"Procedure risk: __ [low / elevated] | ACS NSQIP score: __ | ASA class: __/VI | I: Healthy | II: Mild systemic disease | III: Severe systemic disease | IV: Life-threatening | V: Moribund | Justification: __"` | ACC/AHA 2014 Perioperative Cardiovascular Evaluation Guidelines; ASA Physical Status Classification System (2020 Update) |
| Cardiac Risk Assessment (RCRI) | `"RCRI score: __/6 | High-risk surgery: __ [Y/N] | Ischemic heart disease: __ [Y/N] | CHF history: __ [Y/N] | Cerebrovascular disease: __ [Y/N] | Insulin-dependent DM: __ [Y/N] | Creatinine >2.0: __ [Y/N] | Risk category: __ [Low 0 (3.9%) / Elevated 1 (6.0%) / 2 (10.1%) / >=3 (15%)] | Additional testing needed: __ [Y/N]"` | Revised Cardiac Risk Index (Lee et al., Circulation 1999); ACC/AHA 2014 Guidelines |
| Pulmonary Risk Assessment | `"ARISCAT score: __ | Pulmonary risk: __ [low <26 / intermediate 26-44 / high >=45] | OSA risk (STOP-Bang): __/8 | PFTs needed: __ [Y/N] | Optimization: __"` | ARISCAT Score (Canet et al.); ASA OSA Guidelines |
| Additional Pre-Op Testing | `"Labs: __ [CBC, BMP, coags, type & screen, other: __] | ECG: __ [indicated / not indicated] | CXR: __ [indicated / not indicated] | Echo: __ [indicated / not indicated] | Stress test: __ [indicated / not indicated] | PFTs: __ [indicated / not indicated] | Rationale: __"` | ACC/AHA 2014 Guidelines; ASA Practice Advisory; Choosing Wisely |
| Clearance Statement | `"Medical clearance: __ [cleared for surgery / cleared with optimization / not cleared pending: __] | Risk-benefit discussed with: __ [patient / surgeon] | Conditions to optimize: __ | Timeline for optimization: __"` | ACC/AHA 2014 Perioperative Guidelines |
| Peri-Operative Medication Management | `"Continue peri-op: __ [beta-blockers / statins / other: __] | Hold pre-op: __ [agent, hold __ days prior, resume __] | Bridging anticoagulation: __ [Y/N], plan: __ | Diabetic med adjustment: __ | Steroid stress dose: __ [Y/N], protocol: __ | Perioperative beta-blocker initiation: __ [Y/N, per ACC/AHA]"` | ACC/AHA 2014 Guidelines; ADA Perioperative Diabetes Management; CHEST Bridging Guidelines |

#### Medical Necessity

| Item Label | Format Template | Source |
|---|---|---|
| Pre-Op Evaluation Necessity | `"Pre-operative evaluation necessary because: __ | Active medical conditions requiring optimization: __ | Risk stratification required for: __ | Requested by: __"` | ACC/AHA 2014 Perioperative Guidelines; Joint Commission PC.03.01.01 |
| Testing Justification | `"Each test justified: __ [test: __, indication: __] | Will change management: __ [Y/N] | Consistent with guidelines: __ [ACC/AHA / ASA / Choosing Wisely]"` | Choosing Wisely Preoperative Testing Recommendations; ACC/AHA 2014 Guidelines |
| Surgical Fitness Determination | `"Patient fitness for surgery: __ | Modifiable risk factors addressed: __ | Informed consent discussion regarding risk: __ [Y/N] | Surgeon notified of findings: __ [Y/N], method: __"` | ACC/AHA 2014 Guidelines; Joint Commission RI.01.03.01 |
| IHS/Tribal Surgical Authorization | `"IHS/Tribal facility surgery: __ [Y/N] | If referred out: PRC/CHS authorization: __ [Y/N] | Auth #: __ | Pre-authorization for facility/surgeon: __ [Y/N] | Transportation arranged: __ [Y/N] | Escort available: __ [Y/N]"` | IHS Purchased/Referred Care (PRC) Policy |

---

### 5. Emergency Department H&P

**Use Case:** Emergency Department evaluation and management. Time-critical documentation emphasizing acuity, differential diagnosis, critical actions, and disposition planning. Supports ED E&M levels 99281-99285. Documentation must reflect real-time clinical decision-making, reassessment after interventions, and medical screening examination requirements under EMTALA.

**Target Item Count:** 35-45 items

---

#### Chief Complaint (CC)

| Item Label | Format Template | Source |
|---|---|---|
| Chief Complaint | `"__ [patient's stated complaint in their own words, or EMS/triage chief complaint if patient unable to provide]"` | AMA CPT/E&M 2021 Guidelines; ACEP Documentation Guidelines |
| Mode of Arrival | `"Arrival by: __ [ambulatory / wheelchair / EMS-BLS / EMS-ALS / helicopter / police / other: __] | EMS report: __ | Pre-hospital interventions: __ | Response to pre-hospital care: __"` | ACEP Clinical Policy Guidelines |
| Triage Acuity | `"ESI level: __/5 | 1: Resuscitation | 2: Emergent | 3: Urgent | 4: Less urgent | 5: Non-urgent | Triage RN: __ | Triage time: __ | Triage vitals: __"` | ESI Triage Algorithm v4.0 (AHRQ); ACEP/ENA Joint Policy |

#### History of Present Illness (HPI)

| Item Label | Format Template | Source |
|---|---|---|
| Acute Presentation | `"Presenting complaint: __ | Onset: __ [date/time] | Setting/activity at onset: __ | Acute vs chronic: __"` | CMS 1997 Documentation Guidelines; ACEP Documentation |
| Timeline & Progression | `"Symptom onset to arrival: __ | Progression: __ [sudden / gradual / stepwise / waxing-waning] | Worst symptom time: __ | Current trajectory: __ [improving / stable / worsening]"` | CMS 1997 Documentation Guidelines (HPI Elements) |
| Character & Severity | `"Quality: __ | Severity: __/10 | Impact: __ | Worst pain experienced: __ [Y/N]"` | CMS 1997 Documentation Guidelines (HPI Elements) |
| Associated Symptoms | `"Associated symptoms: __ | Pertinent positives: __ | Pertinent negatives (for differential): __"` | CMS 1997 Documentation Guidelines (HPI Elements) |
| Pre-Hospital Care | `"Self-treatment: __ | Medications taken: __ | EMS interventions: __ [IV / medications / splint / O2 / intubation / CPR / defibrillation] | Response to interventions: __"` | ACEP Clinical Policy Guidelines |
| Pertinent Negatives for Critical Diagnoses | `"For __ [primary differential], pertinent negatives: __ | For __ [must-not-miss diagnosis], pertinent negatives: __ | Red flag symptoms absent: __"` | ACEP Clinical Policy Guidelines |
| Contextual Factors | `"Mechanism of injury: __ [if trauma] | Exposures: __ | Recent travel: __ | Sick contacts: __ | Ingestion/overdose: __ [agent, amount, time, intent: __ accidental / intentional] | Last menstrual period: __ [if applicable] | Pregnancy: __ [Y/N]"` | ACEP Clinical Policy Guidelines; ATLS 10th Ed |

#### Review of Systems (ROS)

| Item Label | Format Template | Source |
|---|---|---|
| Constitutional | `"Fever: __ [Y/N] | Chills: __ [Y/N] | Weakness: __ [Y/N] | Diaphoresis: __ [Y/N] | Recent weight change: __ [Y/N]"` | CMS 1997 Documentation Guidelines |
| Primary Differential System #1 | `"System: __ | Symptoms pertinent to differential: __ [detailed Y/N for each]"` | CMS 1997 Documentation Guidelines |
| Primary Differential System #2 | `"System: __ | Symptoms pertinent to differential: __ [detailed Y/N for each]"` | CMS 1997 Documentation Guidelines |
| Secondary Systems | `"Systems reviewed: __ | Key findings: __ | All other systems negative: __ [Y/N, if complete ROS obtained]"` | CMS 1997 Documentation Guidelines |
| Psychiatric / Safety Screen | `"Suicidal ideation: __ [Y/N] | Homicidal ideation: __ [Y/N] | Self-harm: __ [Y/N] | Safety screen completed: __ [Y/N] | PHQ-2: __ [if applicable] | Columbia Suicide Severity Rating Scale: __ [if indicated]"` | Joint Commission NPSG.15.01.01; Columbia-Suicide Severity Rating Scale (C-SSRS) |
| Pain Assessment | `"Pain location: __ | Severity: __/10 | Quality: __ | Timing: __ | Radiation: __ | Functional impact: __ | Prior pain management: __ | Pain reassessment post-treatment: __/10"` | ACEP Clinical Policy on Pain Management |

#### Past Medical, Surgical, Family & Social History (PMSFH)

| Item Label | Format Template | Source |
|---|---|---|
| Past Medical History | `"Active conditions: __ | Pertinent to presentation: __ | PCP: __ | Last visit: __ | Source of history: __ [patient / family / EHR / EMS / nursing home records]"` | CMS 1997 Documentation Guidelines; ACEP Documentation |
| Past Surgical History | `"Prior surgeries: __ | Pertinent to current presentation: __ | Implants/hardware: __"` | CMS 1997 Documentation Guidelines |
| Current Medications | `"Home medications: __ | Adherence: __ | Last doses of critical meds: __ [anticoagulant: __ / insulin: __ / antiepileptic: __ / cardiac: __] | Recent changes: __ | OTC/herbal: __"` | Joint Commission NPSG.03.06.01 |
| Allergies | `"Allergies: __ | Reactions: __ | Contrast allergy: __ [Y/N] | NKDA: __ [Y/N]"` | Joint Commission NPSG.03.06.01 |
| Social History (ED-Focused) | `"Tobacco: __ | Alcohol: __ [last drink: __] | Drugs: __ [substances, route, last use] | Living situation: __ | Homeless: __ [Y/N] | Domestic violence screen: __ [completed / declined] | Occupation: __ [relevant to exposure/injury] | Interpreter needed: __ [Y/N] | Language: __ | Tribal affiliation: __ [if applicable] | IHS eligibility: __ [Y/N]"` | ACEP Clinical Policy; USPSTF Screening Recommendations; IHS Patient Rights Policy |
| Last Meal / Tetanus / Immunization | `"Last oral intake: __ [time, type] | NPO since: __ | Tetanus: __ [date / unknown / >5 years / >10 years] | Tetanus prophylaxis needed: __ [Y/N]"` | CDC Tetanus Prophylaxis Guidelines; ASA Fasting Guidelines |

#### Physical Examination (PE)

| Item Label | Format Template | Source |
|---|---|---|
| General Appearance | `"Appearance: __ [well / ill / acutely ill / toxic / diaphoretic / distressed / combative / GCS: __/15 (E__V__M__)] | Position of comfort: __ | Immediate life threats: __ [Y/N]"` | CMS 1997 Documentation Guidelines; ACEP Documentation; ATLS 10th Ed |
| Vital Signs (with Reassessment) | `"Initial: Temp __ | HR __ | BP __/__ | RR __ | SpO2 __% on __ | Weight __ kg | Pain __/10 | Reassessment [time: __]: Temp __ | HR __ | BP __/__ | RR __ | SpO2 __% on __ | Pain __/10 | Trend: __ [improving / stable / worsening]"` | AMA CPT/E&M 2021; ACEP Vital Sign Reassessment Policy |
| Primary Survey (if trauma/critical) | `"Airway: __ [patent / compromised / intubated] | Breathing: __ [spontaneous / assisted / mechanical] | Circulation: __ [pulses present / shock signs: __] | Disability: __ [GCS: __/15 / AVPU: __] | Exposure: __ [fully exposed / findings: __]"` | ATLS 10th Edition; ACEP Trauma Guidelines |
| HEENT & Neck | `"Head: __ [atraumatic / laceration / hematoma / other: __] | Eyes: PERRL __ [Y/N] | EOM: __ | Visual acuity: __ [if relevant] | Ears: __ | Nose: __ | Throat: __ | Facial symmetry: __ | C-spine: __ [midline tenderness: Y/N] | NEXUS criteria met: __ [Y/N] | JVD: __ [Y/N] | Tracheal deviation: __ [Y/N] | Meningismus: __ [Y/N]"` | CMS 1997 Documentation Guidelines; NEXUS Low-Risk Criteria (Hoffman et al.); Canadian C-Spine Rule |
| Cardiovascular | `"Rate: __ | Rhythm: __ | Heart sounds: __ | Murmur: __ [Y/N] | Peripheral pulses: __ [symmetric / asymmetric] | Cap refill: __ sec | Edema: __ [Y/N] | Signs of shock: __ [Y/N]"` | CMS 1997 Documentation Guidelines; ACEP |
| Respiratory | `"Effort: __ | Breath sounds: __ bilateral | Adventitious: __ [Y/N] | Tracheal position: __ | Chest wall: __ [symmetric / crepitus / flail / subcutaneous emphysema] | Percussion: __"` | CMS 1997 Documentation Guidelines; ATLS 10th Ed |
| Abdomen | `"Soft: __ [Y/N] | Tenderness: __ [Y/N], location: __ | Guarding: __ [Y/N] | Rebound: __ [Y/N] | Distension: __ [Y/N] | Bowel sounds: __ | Pulsatile mass: __ [Y/N] | FAST exam: __ [positive / negative / not performed]"` | CMS 1997 Documentation Guidelines; ACEP Ultrasound Guidelines |
| Extremities / Musculoskeletal | `"Deformity: __ [Y/N] | Swelling: __ [Y/N] | TTP: __ [Y/N], location: __ | ROM: __ | Neurovascular status distal to injury: __ [intact / compromised: __] | Compartment assessment: __ [if indicated]"` | CMS 1997 Documentation Guidelines; ATLS 10th Ed |
| Neurological | `"GCS: __/15 (E__V__M__) | Orientation: __ x __ | Cranial nerves: __ | Motor: __ [symmetric / asymmetric: __] | Sensation: __ | Speech: __ [normal / dysarthric / aphasic] | NIHSS: __/42 [if stroke suspected] | Cerebellar: __ | Gait: __"` | CMS 1997 Documentation Guidelines; NIH Stroke Scale; ACEP Stroke Clinical Policy |
| Skin / Wounds | `"Color: __ | Temperature: __ | Turgor: __ | Wounds: __ [Y/N], description: __ [type / location / size / depth / contamination] | Rash: __ [Y/N], description: __ | Petechiae/purpura: __ [Y/N]"` | CMS 1997 Documentation Guidelines |
| Reassessment After Treatment | `"Reassessment time: __ | Interval: __ min after __ [intervention] | Vital signs: __ | Symptom response: __ [improved / unchanged / worsened] | Exam changes: __ | Clinical trajectory: __"` | ACEP Clinical Policy; Joint Commission PC.02.01.01 |

#### Assessment & Plan (A&P)

| Item Label | Format Template | Source |
|---|---|---|
| ED Diagnoses | `"Primary diagnosis: __ [ICD-10: __] | Secondary diagnoses: __ [ICD-10: __] | Diagnosis type: __ [confirmed / clinical / working / rule-out]"` | AMA CPT/E&M 2021; CMS ICD-10-CM Guidelines |
| Differential Diagnoses Considered | `"Differential: 1. __ [most likely] | 2. __ | 3. __ | Must-not-miss diagnoses considered and excluded: __ | Exclusion basis: __"` | AMA CPT/E&M 2021 — Medical Decision-Making |
| Critical Actions & Interventions | `"Critical actions: __ [IV access / labs drawn / imaging / medications / procedures / consultations] | Time-sensitive interventions: __ [tPA / antibiotics / OR notification / cardiac cath] | Time to critical intervention: __ min | Procedures performed: __ [procedure, time, findings, complications: __]"` | ACEP Clinical Policy Guidelines; Joint Commission Core Measures |
| Diagnostic Results Reviewed | `"Labs: __ [key results and interpretation] | Imaging: __ [findings and interpretation] | ECG: __ [rhythm, findings, comparison to prior] | POC testing: __ [results] | Reviewed with: __ [radiologist / specialist / independently]"` | AMA CPT/E&M 2021 — Data Reviewed |
| Disposition Decision | `"Disposition: __ [discharge / admit to __ / observation / transfer to __ / AMA / LWBS / deceased] | Disposition time: __ | Decision rationale: __"` | ACEP Clinical Policy; CMS Conditions of Participation; EMTALA |
| Disposition Details | `"If admitted: service: __ | Level of care: __ [floor / telemetry / step-down / ICU] | Admitting diagnosis: __ | Admission criteria met: __ | Accepting physician: __ | If discharged: clinically stable: __ [Y/N] | Tolerating PO: __ [Y/N] | Pain controlled: __ [Y/N] | Safety screen: __ [passed / concerns: __] | Prescriptions: __ | Follow-up: __ [provider, timeframe]"` | CMS Inpatient Admission Order Requirements; InterQual Criteria; ACEP Clinical Policy |
| Return Precautions & Safety Net | `"Return to ED if: __ [specific symptoms/signs] | Call 911 if: __ | Follow-up with __ in __ days | Precautions given: __ [verbal / written / both] | Language-appropriate materials: __ [Y/N] | Understanding confirmed: __ [Y/N] | Teach-back completed: __ [Y/N]"` | ACEP Clinical Policy; Joint Commission PC.04.01.05 |

#### Medical Necessity

| Item Label | Format Template | Source |
|---|---|---|
| ED Level Justification | `"E&M level: __ [99281-99285] | 99281: Self-limited | 99282: Low-moderate severity | 99283: Moderate severity | 99284: High severity | 99285: High severity with threat to life/function | MDM complexity: __ | Basis: __"` | AMA CPT/E&M 2021 Guidelines; ACEP E&M Coding Guide |
| Acuity & Complexity Justification | `"Clinical acuity: __ | Number of diagnoses addressed: __ | Data reviewed: __ [labs / imaging / records / independent interpretation] | Risk of presenting problem: __ | Risk of management: __ [prescription drugs / IV meds / procedures / decision for surgery]"` | AMA CPT/E&M 2021 — Table of Medical Decision-Making |
| EMTALA Compliance | `"Medical screening examination performed: __ [Y/N] | Emergency medical condition identified: __ [Y/N] | Stabilizing treatment provided: __ [Y/N] | Patient stabilized: __ [Y/N] | If transfer: receiving facility: __ | Acceptance by: __ | Risks/benefits of transfer discussed: __ [Y/N] | Certification of transfer: __ [Y/N]"` | EMTALA 42 USC 1395dd; CMS State Operations Manual Appendix V |
| Critical Care Time (if applicable) | `"Critical care provided: __ [Y/N] | Total critical care time: __ min | Activities: __ [interpretation of labs / ventilator management / hemodynamic monitoring / procedures not separately billable] | Acutely life- or organ-threatening condition: __ | CPT: __ [99291 first 30-74 min / +99292 each additional 30 min]"` | AMA CPT Critical Care Guidelines (99291-99292) |
| Observation vs. Inpatient Determination | `"If observation: reason observation (not inpatient): __ | Expected observation duration: __ hrs | Observation criteria: __ | Two-midnight rule assessment: __ [expected to span 2 midnights: Y/N] | If Y, inpatient admission appropriate | IHS/Tribal billing considerations: __"` | CMS Two-Midnight Rule (CMS-1599-F); CMS Observation Status Guidelines |

---

### Cross-Subtype Reference: H&P Section Requirements by CMS E&M Level

The following reference table summarizes the minimum documentation elements required per section based on CMS 1997 Documentation Guidelines and AMA CPT/E&M 2021 updates.

| Section | Level 2 (Low) | Level 3 (Moderate) | Level 4 (Moderate-High) | Level 5 (High) |
|---|---|---|---|---|
| **HPI** | 1-3 elements (Brief) | 4+ elements (Extended) | 4+ elements (Extended) | 4+ elements (Extended) |
| **ROS** | 1 system (Problem-pertinent) | 2-9 systems (Extended) | 10+ systems (Complete) | 10+ systems (Complete) |
| **PMSFH** | None required | 1 area | 2 areas | 3 areas (Complete) |
| **PE** | 1-5 elements (Problem-focused) | 6-11 elements (Expanded) | 12+ elements / 2+ organ systems (Detailed) | 8+ organ systems (Comprehensive) |
| **MDM** | Straightforward | Low complexity | Moderate complexity | High complexity |

> **Note (2021 E&M Update):** For outpatient E&M (99202-99215), CMS now allows leveling based on **either** total time **or** MDM complexity. History and exam are no longer separately scored but must still be "medically appropriate." The above table remains relevant for inpatient and ED E&M, and for documentation completeness under 1997 guidelines still used by many payers.

---

### Tribal Healthcare Addendum: Cultural Competency in H&P Documentation

The following items should be integrated into every H&P subtype when providing care in Indian Health Service (IHS), tribal, or urban Indian health facilities.

| Item Label | Format Template | Source |
|---|---|---|
| Tribal Enrollment & IHS Eligibility | `"Tribal affiliation: __ | Enrollment #: __ | IHS eligibility verified: __ [Y/N] | Service unit: __ | Beneficiary type: __ [direct / contract / urban Indian]"` | IHS Eligibility Policy; 42 CFR 136 |
| Language & Communication | `"Primary language: __ | English proficiency: __ [fluent / limited / none] | Interpreter needed: __ [Y/N] | Interpreter type: __ [in-person / phone / video] | Interpreter language: __ | Informed consent obtained in preferred language: __ [Y/N]"` | Title VI Civil Rights Act; Joint Commission PC.02.01.21; IHS Patient Rights Policy |
| Cultural & Spiritual Preferences | `"Traditional healing practices: __ [Y/N] | If Y, describe: __ | Concurrent traditional healer involvement: __ [Y/N] | Spiritual/ceremonial needs during hospitalization: __ | Dietary cultural requirements: __ | Family decision-making preferences: __ [individual / family / elder-guided / clan-based] | Smudging/ceremony space requested: __ [Y/N]"` | IHS Indian Health Manual Part 3 Chapter 5; Joint Commission RI.01.01.01 |
| Community Health Representative (CHR) | `"CHR involvement: __ [Y/N] | CHR name: __ | CHR contact: __ | Home visit needed: __ [Y/N] | Community resources coordinated: __"` | IHS Community Health Representative Program |
| PRC/CHS Referral Documentation | `"Purchased/Referred Care needed: __ [Y/N] | Service not available at this facility: __ | PRC priority level: __ [I: emergent / II: preventive / III: primary / IV: chronic / V: excluded] | PRC authorization obtained: __ [Y/N] | Auth #: __ | Referred to: __ | Transportation assistance: __ [Y/N]"` | IHS Purchased/Referred Care (PRC) Policy; 42 CFR 136.23 |
| Social Determinants (Tribal Context) | `"Geographic isolation: __ [Y/N] | Distance to facility: __ miles | Transportation barriers: __ [Y/N] | Food insecurity: __ [Y/N] | Housing adequacy: __ | Water/sanitation access: __ | Internet/phone for telehealth: __ [Y/N] | Historical trauma considerations: __ | Intergenerational factors: __"` | IHS Strategic Plan; SDOH Screening (AHC-HRSN); CMS Z-codes (Z55-Z65) |

---

## PART 3: PROCEDURE NOTE FRAMEWORK

The Procedure Note documents what was performed on the patient -- the specific procedure, technique, materials, anatomical findings, and outcome. Unlike the SOAP note (which captures a clinical encounter broadly) or the H&P (which establishes a comprehensive baseline), the Procedure Note is laser-focused on a specific intervention: what was done, how it was done, what was found, and how the patient tolerated it. It serves as the medicolegal record of the procedure, supports CPT/ICD-10 coding and medical necessity, and communicates critical follow-up information to other providers.

Every Procedure Note must answer five questions:
1. **Why** was this procedure performed? (Pre-Procedure / Medical Necessity)
2. **What** was done and how? (Procedure Details)
3. **What** was found? (Intra-Procedure Findings)
4. **How** did the patient do? (Post-Procedure)
5. **Was** this medically necessary and how is it coded? (Medical Necessity / Billing)

The framework below provides five subtypes scaled to procedural complexity -- from minor office procedures through full operative reports.

---

### 3.1 Minor Office Procedure

**Subtype:** Standard (28 items)
**Use When:** Laceration repair, incision & drainage (I&D), skin tag removal, wound care/debridement, cerumen removal, nail removal (partial/total), cryotherapy, electrocautery, foreign body removal, simple excision of superficial lesion.
**Best For:** Primary care, urgent care, emergency department, dermatology clinic, tribal health clinic.

#### Pre-Procedure (7 items)

| Item | Format Template | Source |
|------|----------------|--------|
| Procedure Indication | `"__ procedure indicated for __ | duration __ | severity __ | prior treatment __"` | AMA CPT Guidelines; CMS Documentation Guidelines |
| Informed Consent | `"informed consent obtained: Y/N | risks discussed: __ | benefits discussed: __ | alternatives discussed: __ | patient verbalized understanding: Y/N | signed consent on file: Y/N"` | Joint Commission RI.01.03.01; AMA Code of Ethics 2.1.1 |
| Patient Identification | `"patient identified by __ | DOB verified: Y/N | two-identifier match: Y/N"` | Joint Commission NPSG.01.01.01 |
| Site Verification | `"procedure site: __ | laterality: __ | site marked: Y/N | confirmed with patient: Y/N"` | Joint Commission Universal Protocol UP.01.01.01 |
| Local Anesthesia | `"anesthetic agent: __ | concentration: __ | volume: __ mL | with epinephrine: Y/N | aspiration before injection: Y/N | patient tolerance: __"` | ASA Practice Guidelines for Local Anesthesia; AMA CPT |
| Skin Prep and Draping | `"prep solution: __ | prep method: __ | sterile drape applied: Y/N | sterile field maintained: Y/N"` | AORN Guidelines for Perioperative Practice; CDC SSI Prevention Guidelines |
| Time-Out Performed | `"time-out performed: Y/N | correct patient: Y/N | correct site: Y/N | correct procedure: Y/N | participants: __ | time: __"` | Joint Commission Universal Protocol UP.01.03.01 |

#### Procedure Details (8 items)

| Item | Format Template | Source |
|------|----------------|--------|
| Procedure Performed | `"procedure: __ | CPT: __ | start time: __ | end time: __ | total procedure time: __ min"` | AMA CPT Professional Edition; CMS 1995/1997 E/M Guidelines |
| Technique Description | `"technique: __ | approach: __ | method: __ | step-by-step: __"` | AMA CPT Surgical Guidelines; specialty-specific standards |
| Instruments and Materials | `"instruments: __ | suture type: __ | suture size: __ | needle type: __ | additional materials: __"` | AMA CPT; AORN Guidelines |
| Wound / Lesion Dimensions | `"length: __ cm | width: __ cm | depth: __ cm | total area: __ sq cm | layer involvement: __ | wound classification: __"` | AMA CPT Wound Repair Guidelines (12001-13160); CMS NCCI |
| Closure Method | `"closure: __ | number of sutures: __ | suture technique: __ | adhesive used: Y/N | steri-strips: Y/N | staples: __ | layered closure: Y/N"` | AMA CPT Repair Codes; Wound Closure Manual (Ethicon) |
| Hemostasis | `"hemostasis achieved by: __ | electrocautery: Y/N | pressure: Y/N | chemical agent: __ | estimated blood loss: __ mL"` | ACS Principles of Surgery; AMA CPT |
| Dressing Applied | `"dressing type: __ | layers: __ | splint applied: Y/N | immobilization: Y/N"` | Wound Care Guidelines (WCS); CMS |
| Interpreter / Communication | `"interpreter used: Y/N | language: __ | interpreter type: in-person / phone / video | communication confirmed: Y/N"` | Joint Commission PC.02.01.21; CMS Conditions of Participation; IHS Language Access Policy |

#### Intra-Procedure Findings (5 items)

| Item | Format Template | Source |
|------|----------------|--------|
| Wound Characteristics | `"wound type: __ | contamination level: clean / clean-contaminated / contaminated / dirty | foreign body: Y/N | devitalized tissue: Y/N | undermining: Y/N"` | ACS Wound Classification System; CDC SSI Guidelines |
| Tissue Quality | `"tissue quality: __ | vascularity: __ | viability: __ | surrounding skin condition: __ | signs of infection: Y/N"` | Wound Healing Society Guidelines; WCS |
| Specimen Obtained | `"specimen obtained: Y/N | specimen type: __ | number of specimens: __ | specimen labeled: Y/N | orientation marked: Y/N"` | CAP Laboratory Accreditation Standards; ADASP |
| Pathology Sent | `"sent to pathology: Y/N | pathology requisition completed: Y/N | clinical history provided: __ | diagnosis suspected: __"` | CAP Protocol for Specimen Handling; ADASP Guidelines |
| Unexpected Findings | `"unexpected findings: Y/N | description: __ | action taken: __ | additional procedure required: Y/N"` | AMA CPT; ACS Informed Consent Principles |

#### Post-Procedure (6 items)

| Item | Format Template | Source |
|------|----------------|--------|
| Patient Tolerance | `"patient tolerated procedure: well / fair / poorly | pain level during: __/10 | pain level after: __/10 | vasovagal response: Y/N | adverse reaction: Y/N"` | ASA Monitoring Standards; CMS |
| Immediate Complications | `"immediate complications: none / __ | bleeding controlled: Y/N | nerve/tendon/vessel injury: Y/N | allergic reaction: Y/N"` | ACS Principles of Surgery; Joint Commission SE Reporting |
| Wound Care Instructions | `"wound care instructions provided: Y/N | keep dry for __ hours | dressing change: __ | signs of infection reviewed: Y/N | written instructions given: Y/N"` | Wound Care Society Guidelines; CMS Patient Education |
| Return Precautions | `"return to ED/clinic if: __ | fever > __F | increased redness/swelling: Y/N | purulent drainage: Y/N | uncontrolled bleeding: Y/N | patient verbalized understanding: Y/N"` | ACEP Discharge Instructions; CMS |
| Follow-Up Plan | `"follow-up in __ days | with: __ | suture/staple removal in __ days | wound check in __ days | pathology follow-up: Y/N | expected call-back for results: Y/N"` | AMA CPT; CMS Continuity of Care |
| Activity Restrictions | `"activity restrictions: __ | weight-bearing: __ | lifting limit: __ lbs | return to work/school: __ | sports/exercise: __"` | AAFP Post-Procedure Guidelines; ACS |

#### Medical Necessity (4 items)

| Item | Format Template | Source |
|------|----------------|--------|
| Procedure Indication | `"indication: __ | ICD-10: __ | clinical presentation supporting procedure: __ | duration of symptoms: __"` | CMS LCD/NCD; AMA CPT Medical Necessity |
| Medical Necessity Statement | `"this procedure was medically necessary because: __ | failure to treat would result in: __ | conservative measures attempted: Y/N | conservative measures: __"` | CMS Medical Necessity Definition (SSA 1862(a)(1)(A)); AMA CPT |
| CPT Code Justification | `"CPT code(s): __ | modifier(s): __ | documentation supports code: Y/N | complexity factors: __ | repair length: __ cm | anatomic site: __"` | AMA CPT Professional Edition; CMS NCCI Edits |
| Cultural / Patient-Centered Considerations | `"cultural considerations discussed: Y/N | traditional healing preferences acknowledged: Y/N | procedure timing accommodated cultural/ceremonial needs: Y/N | tribal health program referral: Y/N | patient preference documented: __"` | IHS Standards of Care; CMS Person-Centered Care; APA Multicultural Guidelines |

---

### 3.2 Major / Surgical Procedure

**Subtype:** Full Detail (47 items)
**Use When:** Excision of mass/tumor, open reduction internal fixation (ORIF), appendectomy, cholecystectomy, hernia repair, lumpectomy, bowel resection, arthroscopy with repair, cesarean section, craniotomy, or any procedure requiring general/regional anesthesia and operating room setting.
**Best For:** Surgery, operating room, ambulatory surgery center (ASC), hospital inpatient. Full operative report format per CMS and Joint Commission standards.

#### Pre-Procedure (10 items)

| Item | Format Template | Source |
|------|----------------|--------|
| Pre-Operative Diagnosis | `"pre-op diagnosis: __ | ICD-10: __ | laterality: __ | acuity: elective / urgent / emergent"` | CMS Operative Report Requirements; Joint Commission RC.02.01.01 |
| Informed Consent | `"informed consent obtained: Y/N | risks discussed: __ | benefits discussed: __ | alternatives discussed: __ | specific risks: bleeding / infection / nerve injury / __ | patient questions answered: Y/N | signed consent on file: Y/N | witness: __"` | Joint Commission RI.01.03.01; AMA Code of Ethics 2.1.1; ACS Statement on Informed Consent |
| Patient Identification and Site Marking | `"patient identified by: __ | two-identifier match: Y/N | surgical site marked by: __ | marking visible after prep: Y/N | laterality confirmed: Y/N | patient confirmed site: Y/N"` | Joint Commission Universal Protocol UP.01.01.01; WHO Surgical Safety Checklist |
| Anesthesia Type | `"anesthesia: general / regional / MAC / local with sedation | ASA class: __ | anesthesiologist: __ | airway: __ | lines placed: __"` | ASA Physical Status Classification; ASA Standards for Basic Anesthetic Monitoring |
| Prophylactic Antibiotics | `"prophylactic antibiotics: Y/N | agent: __ | dose: __ | time administered: __ | within 60 min of incision: Y/N | redosing criteria met: Y/N"` | SCIP/CMS Core Measures; ACS/ASHP Surgical Prophylaxis Guidelines |
| DVT Prophylaxis | `"DVT prophylaxis: Y/N | method: SCD / heparin / enoxaparin / __ | dose: __ | timing: __ | risk assessment tool: Caprini score __ | contraindications: __"` | ACS DVT Prevention Guidelines; ACCP VTE Guidelines; CMS Core Measures |
| Patient Positioning | `"position: supine / prone / lateral / lithotomy / Trendelenburg / __ | positioning aids: __ | pressure points padded: Y/N | safety strap: Y/N | positioned by: __"` | AORN Guideline for Positioning the Patient; ASA |
| Surgical Prep and Draping | `"prep solution: __ | prep area: __ | draping: standard / __ | sterile field confirmed: Y/N | skin prep dry time observed: Y/N"` | AORN Guidelines; CDC SSI Prevention 2017 |
| Surgical Time-Out | `"time-out performed: Y/N | correct patient: Y/N | correct site/side: Y/N | correct procedure: Y/N | consent reviewed: Y/N | antibiotics confirmed: Y/N | imaging available: Y/N | special equipment confirmed: Y/N | blood products available: Y/N | participants: __ | time: __"` | Joint Commission Universal Protocol UP.01.03.01; WHO Surgical Safety Checklist |
| Surgical Team | `"surgeon: __ | assistant(s): __ | anesthesiologist/CRNA: __ | scrub tech/nurse: __ | circulating nurse: __ | other personnel: __"` | CMS Operative Report Requirements; Joint Commission RC.02.01.01 |

#### Procedure Details (14 items)

| Item | Format Template | Source |
|------|----------------|--------|
| Post-Operative Diagnosis | `"post-op diagnosis: __ | ICD-10: __ | same as pre-op: Y/N | if different: __"` | CMS Operative Report Requirements; Joint Commission RC.02.01.01 |
| Procedure Performed | `"procedure(s): __ | CPT: __ | laterality: __ | start time (incision): __ | end time (closure): __ | total operative time: __ min"` | AMA CPT Professional Edition; CMS Operative Report |
| Incision Type and Location | `"incision: __ | location: __ | length: __ cm | orientation: __ | prior scar utilized: Y/N"` | ACS Operative Technique Standards; AMA CPT |
| Surgical Approach | `"approach: open / laparoscopic / robotic / endoscopic / percutaneous / __ | ports placed: __ | port locations: __ | conversion to open: Y/N"` | ACS; SAGES Guidelines (laparoscopic); AMA CPT |
| Step-by-Step Technique | `"step 1: __ | step 2: __ | step 3: __ | [continued as dictated] | critical steps: __ | technique modifications: __"` | ACS Operative Standards; specialty-specific surgical atlases |
| Anatomical Structures Encountered | `"structures identified: __ | structures preserved: __ | structures ligated: __ | critical anatomy: __ | anatomic variations noted: __"` | ACS; Netter Surgical Anatomy; AMA CPT |
| Dissection Method | `"dissection: sharp / blunt / electrocautery / harmonic / LigaSure / __ | tissue plane: __ | adhesions: Y/N | adhesiolysis performed: Y/N"` | ACS Principles of Surgery; SAGES |
| Hemostasis Method | `"hemostasis: electrocautery / clips / ties / suture ligation / topical hemostatic agent / __ | estimated blood loss: __ mL | transfusion required: Y/N | units transfused: __"` | ACS; ASA Blood Management Guidelines |
| Hardware / Implants / Prosthetics | `"implant used: Y/N | type: __ | manufacturer: __ | lot number: __ | size: __ | location placed: __ | implant card given to patient: Y/N"` | FDA UDI Requirements; Joint Commission NPSG.01.03.01; CMS |
| Closure by Layers | `"fascia closure: __ | subcutaneous closure: __ | skin closure: __ | suture types/sizes: __ | drain placed: Y/N | drain type: __ | drain location: __"` | ACS Wound Closure Principles; AMA CPT |
| Drain Placement | `"drain: Y/N | drain type: JP / Blake / Penrose / __ | drain size: __ Fr | location: __ | secured with: __ | output at placement: __ mL"` | ACS; specialty-specific guidelines |
| Fluid Replacement and I/O | `"IV fluids: __ | total volume in: __ mL | EBL: __ mL | urine output: __ mL | blood products: __ | crystalloid: __ mL | colloid: __ mL"` | ASA Fluid Management Guidelines; ACS |
| Specimens Sent | `"specimens: __ | number: __ | labeled: Y/N | orientation marked: Y/N | sent to pathology: Y/N | frozen section: Y/N | frozen section result: __ | cultures sent: Y/N"` | CAP Surgical Pathology Standards; ADASP |
| Counts | `"sponge count correct: Y/N | instrument count correct: Y/N | needle count correct: Y/N | count discrepancy: Y/N | action taken if discrepancy: __"` | AORN Guideline for Prevention of Retained Surgical Items; Joint Commission |

#### Intra-Procedure Findings (7 items)

| Item | Format Template | Source |
|------|----------------|--------|
| Intra-Operative Findings | `"findings: __ | consistent with pre-op diagnosis: Y/N | pathology confirmed: __ | extent of disease: __"` | CMS Operative Report; ACS |
| Pathology (Gross) | `"gross description: __ | size: __ x __ x __ cm | color: __ | consistency: __ | capsulated: Y/N | margins grossly: __"` | CAP Synoptic Reporting; ADASP |
| Unexpected Findings | `"unexpected findings: Y/N | description: __ | clinical significance: __ | intra-op decision made: __ | attending notified: Y/N | additional consent obtained: Y/N"` | ACS Informed Consent; AMA Code of Ethics 2.1.1 |
| Tissue Quality | `"tissue quality: __ | inflammation: none / mild / moderate / severe | fibrosis: Y/N | necrosis: Y/N | perfusion: __"` | ACS; Wound Healing Society |
| Complications Encountered | `"intra-op complications: none / __ | injury to: __ | repair performed: __ | blood loss from complication: __ mL | additional procedure required: Y/N | anesthesia notified: Y/N"` | ACS NSQIP; Joint Commission SE Reporting |
| Frozen Section Results | `"frozen section performed: Y/N | specimen: __ | result: __ | margins: positive / negative / close (__ mm) | additional resection: Y/N"` | CAP Frozen Section Guidelines; ADASP |
| Imaging Correlation | `"intra-op imaging: Y/N | modality: fluoroscopy / ultrasound / CT / __ | findings: __ | hardware position confirmed: Y/N | correlation with pre-op imaging: __"` | ACR Appropriateness Criteria; ACS |

#### Post-Procedure (8 items)

| Item | Format Template | Source |
|------|----------------|--------|
| Post-Operative Condition | `"patient condition: stable / critical / __ | extubated: Y/N | transferred to: PACU / ICU / floor / __ | vital signs stable: Y/N | awake and alert: Y/N"` | ASA Post-Anesthesia Care Standards; CMS |
| Immediate Post-Op Orders | `"diet: NPO / clear liquids / advance as tolerated / __ | activity: bedrest / ambulate / __ | IV fluids: __ | medications: __ | labs: __ | imaging: __"` | ACS Enhanced Recovery After Surgery (ERAS); CMS |
| Pain Management Plan | `"pain management: __ | PCA: Y/N | regional block: Y/N | oral analgesics: __ | multimodal analgesia: Y/N | pain score target: < __/10"` | ASA Acute Pain Guidelines; ACS ERAS; Joint Commission Pain Standards |
| DVT Prophylaxis (Post-Op) | `"DVT prophylaxis continued: Y/N | SCD applied: Y/N | chemical prophylaxis: __ | dose: __ | start time: __ | early ambulation plan: Y/N"` | ACCP VTE Prevention; ACS; CMS Core Measures |
| Wound and Drain Management | `"wound status: __ | dressing: __ | drain output: __ mL | drain care instructions: __ | drain removal criteria: < __ mL/24hr"` | ACS Wound Care; AORN |
| Diet and Activity Progression | `"diet progression: __ | activity progression: __ | weight-bearing status: __ | PT/OT consult: Y/N | ambulation goal: __"` | ACS ERAS Protocols; AAOS (orthopedic) |
| Follow-Up Plan | `"follow-up appointment: __ days post-op | with: __ | wound check: __ | staple/suture removal: __ days | pathology results expected: __ days | imaging follow-up: __"` | ACS Post-Op Care Standards; CMS Transitions of Care |
| Cultural and Communication Considerations | `"interpreter used: Y/N | language: __ | family/community support present: Y/N | cultural preferences for recovery accommodated: Y/N | traditional healing coordination: Y/N | tribal health liaison notified: Y/N | discharge instructions in preferred language: Y/N"` | IHS Standards of Care; Joint Commission PC.02.01.21; CMS Language Access |

#### Medical Necessity (5 items)

| Item | Format Template | Source |
|------|----------------|--------|
| Surgical Indication | `"indication: __ | ICD-10: __ | clinical presentation: __ | duration of symptoms: __ | functional impact: __"` | CMS LCD/NCD; AMA CPT |
| Medical Necessity Statement | `"this procedure was medically necessary because: __ | condition severity: __ | risk of not treating: __ | expected benefit: __"` | CMS SSA 1862(a)(1)(A); AMA CPT Medical Necessity Guidelines |
| Severity and Complexity | `"severity: mild / moderate / severe | complexity: low / moderate / high | comorbidities affecting decision: __ | ASA class: __"` | AMA CPT; ASA Classification; CMS |
| Prior Conservative Treatment | `"conservative treatment attempted: Y/N | treatments tried: __ | duration of conservative management: __ | reason conservative treatment failed: __ | documentation of failure: __"` | CMS LCD Requirements; AAOS; ACS |
| CPT / Coding Justification | `"primary CPT: __ | additional CPT: __ | modifier(s): __ | co-surgery: Y/N | assistant surgeon: Y/N | operative time for time-based codes: __ min | medical decision-making complexity: __"` | AMA CPT Professional Edition; CMS NCCI Edits; CMS OPPS/MPFS |

---

### 3.3 Injection / Aspiration Procedure

**Subtype:** Standard (28 items)
**Use When:** Joint injection (corticosteroid, hyaluronic acid, PRP), trigger point injection, epidural steroid injection (ESI), aspiration of joint effusion/bursa, bursa injection, tendon sheath injection, carpal tunnel injection, ganglion cyst aspiration, soft tissue injection, knee viscosupplementation.
**Best For:** Primary care, rheumatology, orthopedics, sports medicine, pain management, tribal health clinic.

#### Pre-Procedure (7 items)

| Item | Format Template | Source |
|------|----------------|--------|
| Procedure Indication | `"indication: __ | joint/site: __ | diagnosis: __ | ICD-10: __ | symptom duration: __ | severity: __ | functional limitation: __"` | AAOS Clinical Practice Guidelines; ACR Injection Guidelines; CMS |
| Joint / Site Identification | `"target: __ | laterality: left / right / bilateral | specific site: __ | palpable landmarks: __ | joint effusion present: Y/N"` | AAOS; ACR; AMA CPT Musculoskeletal Guidelines |
| Prior Injections at This Site | `"prior injections to this site: Y/N | number of prior injections: __ | last injection date: __ | last injection agent: __ | response to prior injection: __ | interval since last injection: __"` | ACR Injection Guidelines; AAOS; AMA CPT |
| Informed Consent | `"informed consent obtained: Y/N | risks discussed: infection / bleeding / tendon rupture / nerve injury / skin depigmentation / fat atrophy / flare reaction / __ | benefits discussed: __ | alternatives discussed: __ | signed: Y/N"` | Joint Commission RI.01.03.01; AMA Code of Ethics 2.1.1; ACR |
| Medication Prepared | `"medication: __ | concentration: __ | dose: __ mg | volume: __ mL | mixed with: __ | anesthetic: __ | total injectate volume: __ mL | lot number: __ | expiration verified: Y/N"` | ACR; USP 797 Sterile Compounding; FDA Drug Labeling |
| Imaging Guidance | `"imaging guidance: Y/N | modality: ultrasound / fluoroscopy / CT / none | reason for guidance: __ | equipment: __"` | ACR Appropriateness Criteria; AIUM Practice Guidelines; AMA CPT Imaging Guidance Codes |
| Time-Out and Identification | `"time-out performed: Y/N | correct patient: Y/N | correct site/laterality: Y/N | correct procedure: Y/N | correct medication verified: Y/N | allergies confirmed: __ | anticoagulation status: __"` | Joint Commission Universal Protocol; ISMP Safe Injection Practices |

#### Procedure Details (8 items)

| Item | Format Template | Source |
|------|----------------|--------|
| Approach and Technique | `"approach: anterior / posterior / lateral / medial / __ | technique: landmark-guided / ultrasound-guided / fluoroscopy-guided | patient position: __ | anatomic landmarks used: __"` | AAOS Injection Techniques; ACR; AIUM |
| Needle Gauge and Length | `"needle gauge: __ G | needle length: __ inches | needle type: standard / spinal / __ | single use: Y/N"` | AAOS; ASA; WHO Safe Injection Practices |
| Ultrasound / Fluoroscopy Guidance Details | `"transducer: __ MHz | orientation: __ | target visualized: Y/N | needle visualized: Y/N | in-plane / out-of-plane | fluoroscopy time: __ sec | contrast used: Y/N"` | AIUM Practice Parameters; ACR Fluoroscopy Guidelines |
| Needle Depth and Placement | `"depth of insertion: __ cm | needle tip location confirmed: __ | loss of resistance: Y/N | joint space entered: Y/N | bone contact: Y/N | repositioned: Y/N"` | AAOS; ACR; AIUM Musculoskeletal Ultrasound |
| Aspiration Results | `"aspiration performed: Y/N | fluid obtained: Y/N | volume aspirated: __ mL | fluid appearance: clear / cloudy / bloody / purulent / straw-colored / __ | ease of aspiration: __"` | ACR Synovial Fluid Analysis Guidelines; AAOS |
| Medication Injected | `"medication injected: __ | dose: __ mg | volume: __ mL | anesthetic: __ | anesthetic volume: __ mL | total volume injected: __ mL | injection pressure: normal / increased / __ | no resistance: Y/N"` | ACR; AAOS; AMA CPT |
| Imaging Confirmation | `"post-injection imaging: Y/N | medication distribution confirmed: Y/N | no extravasation: Y/N | joint distension: Y/N | ultrasound image saved: Y/N"` | AIUM; ACR; AMA CPT |
| Sterile Technique | `"skin prep: __ | sterile gloves: Y/N | no-touch technique: Y/N | single-dose vial: Y/N | sharps disposed: Y/N"` | CDC Injection Safety Guidelines; OSHA; WHO |

#### Intra-Procedure Findings (5 items)

| Item | Format Template | Source |
|------|----------------|--------|
| Aspirate Characteristics | `"aspirate color: __ | clarity: transparent / translucent / opaque | viscosity: normal / decreased / increased | volume: __ mL | blood-tinged: Y/N | purulent: Y/N"` | ACR Synovial Fluid Analysis; Shmerling Synovial Fluid Review |
| Ease of Entry | `"ease of joint/tissue entry: easy / moderate / difficult | repositioning required: Y/N | number of attempts: __ | reason for difficulty: __"` | AAOS; ACR Procedural Standards |
| Crepitus and Joint Assessment | `"crepitus: Y/N | location: __ | joint stability: __ | range of motion pre-procedure: __ | effusion grade: trace / small / moderate / large"` | AAOS Physical Examination Guidelines; ACR |
| Fluid Sent for Analysis | `"fluid sent for analysis: Y/N | tests ordered: cell count / crystal analysis / culture / Gram stain / glucose / protein / __ | tubes sent: __ | clinical suspicion: __"` | ACR Synovial Fluid Analysis Guidelines; ARUP Laboratory |
| Peri-Procedural Findings | `"surrounding tissue: normal / __ | bursal thickening: Y/N | synovial hypertrophy: Y/N | osteophytes palpated: Y/N | tendon integrity: __ | Baker cyst: Y/N"` | AAOS; ACR; AIUM Musculoskeletal Ultrasound |

#### Post-Procedure (6 items)

| Item | Format Template | Source |
|------|----------------|--------|
| Patient Tolerance | `"patient tolerated procedure: well / fair / poorly | pain during procedure: __/10 | pain after procedure: __/10 | vasovagal response: Y/N | adverse reaction: Y/N | observed for __ minutes"` | ASA Monitoring Standards; AAOS |
| Post-Injection Instructions | `"post-injection instructions provided: Y/N | rest joint __ hours | ice: __ min every __ hours for __ days | avoid strenuous activity __ days | expected flare: Y/N | flare duration: __ days | written instructions given: Y/N"` | AAOS Patient Education; ACR |
| Weight-Bearing Status | `"weight-bearing status: full / partial / non-weight-bearing / as tolerated | assistive device: Y/N | duration of restriction: __"` | AAOS Post-Procedure Guidelines; ACR |
| Medication Restrictions | `"NSAID restriction: Y/N | duration: __ days | blood sugar monitoring (diabetic patients): Y/N | frequency: __ | anticoagulation hold: Y/N | resume: __"` | ACR; ADA Diabetes and Steroid Injection Guidance; ACCP |
| Return Precautions | `"return if: increased pain after __ days / fever > __F / joint redness / warmth / swelling worsening / signs of infection / __ | patient verbalized understanding: Y/N"` | AAOS; ACR; ACEP Discharge Instructions |
| Follow-Up Plan | `"follow-up: __ weeks | with: __ | reassess response in: __ | repeat injection if needed in: __ weeks minimum | lab results follow-up: Y/N | next injection earliest: __"` | ACR Injection Interval Guidelines; AAOS; CMS |

#### Medical Necessity (4 items)

| Item | Format Template | Source |
|------|----------------|--------|
| Injection Indication | `"indication: __ | ICD-10: __ | joint/site: __ | symptom duration: __ | prior treatment: __ | functional limitation: __"` | CMS LCD for Joint Injections; ACR; AAOS |
| Medical Necessity Statement | `"this injection was medically necessary because: __ | failed conservative therapy: Y/N | therapies attempted: physical therapy / NSAIDs / bracing / rest / __ | duration of conservative treatment: __"` | CMS SSA 1862(a)(1)(A); ACR; CMS LCD |
| CPT Code Justification | `"CPT: __ | modifier: __ | imaging guidance CPT: __ | aspiration CPT: __ | joint size: major / intermediate / small | number of injections this encounter: __ | bilateral: Y/N"` | AMA CPT (20600-20611); CMS NCCI Edits; AMA CPT Imaging Codes |
| Cultural and Patient-Centered Considerations | `"cultural considerations: Y/N | patient concerns about injection addressed: __ | traditional healing preferences: Y/N | interpreter used: Y/N | language: __ | tribal health program coordination: Y/N"` | IHS Standards of Care; CMS Person-Centered Care; APA Multicultural Guidelines |

---

### 3.4 Diagnostic Procedure

**Subtype:** Standard (33 items)
**Use When:** EKG interpretation, spirometry/PFTs, endoscopy (EGD), colonoscopy, cystoscopy, bronchoscopy, EMG/NCV, skin biopsy, bone marrow biopsy, lumbar puncture, cardiac catheterization, stress testing, ambulatory monitoring, audiometry, tympanometry.
**Best For:** Gastroenterology, pulmonology, cardiology, urology, neurology, primary care, tribal health clinic.

#### Pre-Procedure (7 items)

| Item | Format Template | Source |
|------|----------------|--------|
| Diagnostic Indication | `"indication: __ | ICD-10: __ | clinical question to be answered: __ | symptom duration: __ | prior workup: __"` | CMS LCD/NCD; AMA CPT; specialty-specific guidelines |
| Patient Preparation | `"preparation: __ | NPO status: __ hours | bowel prep: Y/N | prep type: __ | prep quality: excellent / good / fair / poor | medications held: __ | pre-procedure labs: __ | results: __"` | ASGE Quality Indicators (endoscopy); ATS/ERS (spirometry); ACC (cardiac); CMS |
| Sedation Plan | `"sedation: none / minimal / moderate (conscious) / deep / general anesthesia | agent(s): __ | dose(s): __ | route: __ | monitoring: __ | sedation provider: __ | ASA class: __"` | ASA Sedation Continuum Guidelines; ASGE Sedation Guidelines; CMS |
| Informed Consent | `"informed consent obtained: Y/N | procedure explained: Y/N | risks: __ | benefits: __ | alternatives: __ | specific risks per procedure type: perforation / bleeding / sedation complications / __ | signed: Y/N"` | Joint Commission RI.01.03.01; ASGE; AMA Code of Ethics 2.1.1 |
| Contraindications Screened | `"contraindications screened: Y/N | absolute contraindications: none / __ | relative contraindications: none / __ | pregnancy test: Y/N / NA | allergy review: __ | anticoagulation status: __ | last dose: __"` | ASGE; ATS/ERS; ACC; specialty-specific screening protocols |
| Equipment Check | `"equipment: __ | calibrated: Y/N | scope type: __ | scope serial number: __ | image quality verified: Y/N | recording system: Y/N | biopsy forceps available: Y/N | emergency equipment: __"` | ASGE Endoscope Reprocessing; ATS/ERS Spirometry Standardization; FDA Equipment Standards |
| Time-Out and Identification | `"time-out performed: Y/N | correct patient: Y/N | correct procedure: Y/N | laterality (if applicable): __ | allergies verified: __ | consent verified: Y/N | sedation plan confirmed: Y/N | specimen containers labeled: Y/N"` | Joint Commission Universal Protocol; WHO Surgical Safety Checklist |

#### Procedure Details (10 items)

| Item | Format Template | Source |
|------|----------------|--------|
| Procedure Performed | `"procedure: __ | CPT: __ | start time: __ | end time: __ | total procedure time: __ min | sedation time: __ min"` | AMA CPT; CMS; ASGE Quality Indicators |
| Equipment / Technique | `"technique: __ | equipment: __ | scope diameter: __ mm | channel: __ | video: Y/N | recording: Y/N | patient position: __"` | ASGE Technology Standards; ATS/ERS Standardization; ACC |
| Scope Insertion / Advancement (Endoscopy) | `"insertion: __ | advanced to: __ cm / __ anatomic landmark | intubation of: __ | cecal landmarks: Y/N | ileal intubation: Y/N | withdrawal time: __ min | retroflexion performed: Y/N"` | ASGE Quality Indicators for Colonoscopy/EGD; ACG Guidelines |
| Areas Examined | `"areas examined: __ | systematic examination: Y/N | all segments visualized: Y/N | limited by: __ | adequacy of examination: complete / incomplete / __"` | ASGE; ATS/ERS; ACC; specialty-specific standards |
| Biopsies / Samples Taken | `"biopsies taken: Y/N | number: __ | locations: __ | biopsy technique: forceps / cold snare / hot snare / FNA / __ | specimen jars: __ | labeled: Y/N | fixative: __ | clinical indication on requisition: Y/N"` | ASGE; CAP Specimen Handling; ADASP |
| Measurements / Readings | `"measurements: __ | values: __ | reference range: __ | percent predicted: __ | pre/post bronchodilator: __ | calibration factor: __ | quality grade: __"` | ATS/ERS Spirometry Standardization; ACC Stress Testing; AANEM EMG Standards |
| Therapeutic Interventions (if applicable) | `"therapeutic intervention: Y/N | type: polypectomy / dilation / hemostasis / stent placement / ablation / __ | technique: __ | size: __ | location: __ | successful: Y/N | complications: __"` | ASGE Therapeutic Endoscopy Guidelines; AMA CPT |
| Recording Quality | `"recording quality: adequate / inadequate / __ | reproducibility: Y/N | artifact: none / minimal / significant | patient cooperation: excellent / good / fair / poor | test validity: valid / invalid / borderline"` | ATS/ERS Quality Standards; ACC; AANEM; ASGE |
| Sedation Monitoring | `"sedation level: __ | vitals during procedure: BP __ | HR __ | SpO2 __ | supplemental O2: __ L/min | respiratory rate monitored: Y/N | lowest SpO2: __ | interventions: __"` | ASA Sedation Monitoring Standards; ASGE; CMS |
| Interpreter / Communication | `"interpreter used: Y/N | language: __ | interpreter type: in-person / phone / video | pre-procedure explanation confirmed through interpreter: Y/N | cultural considerations for procedure: __"` | Joint Commission PC.02.01.21; CMS Language Access; IHS |

#### Intra-Procedure Findings (8 items)

| Item | Format Template | Source |
|------|----------------|--------|
| Diagnostic Findings (by Area) | `"area 1: __ | findings: normal / __ | area 2: __ | findings: normal / __ | area 3: __ | findings: normal / __ | [continued per anatomic region]"` | ASGE Minimum Standards; ATS/ERS; ACC; specialty-specific |
| Normal Findings Documented | `"normal findings: __ | mucosa: normal / __ | vascularity: normal / __ | lumen: patent / __ | tissue: normal / __ | function: normal / __"` | ASGE Reporting Standards; ATS/ERS; ACC |
| Abnormal Findings | `"abnormal findings: __ | location: __ | size: __ cm | number: __ | morphology: __ | Paris classification (polyps): __ | severity: mild / moderate / severe | extent: __"` | ASGE Quality Indicators; Paris Classification; ACC; ATS/ERS |
| Measurements with Reference Ranges | `"parameter: __ | measured value: __ | reference range: __ | percent predicted: __ | interpretation: normal / borderline / abnormal / __ | severity: mild / moderate / severe / very severe"` | ATS/ERS Spirometry Interpretation; ACC Stress Testing Standards; AANEM |
| Images Obtained | `"images obtained: Y/N | number of images: __ | key images documenting: __ | landmarks photographed: Y/N | pathology photographed: Y/N | image quality: adequate / __"` | ASGE Documentation Standards; ACR Image Documentation |
| Specimens Collected | `"specimens collected: Y/N | number: __ | type: biopsy / brushing / washing / aspirate / __ | locations: __ | labeled: Y/N | sent to: pathology / lab / cytology / __ | requisition completed: Y/N"` | CAP Specimen Handling; ASGE; ADASP |
| Preliminary Interpretation | `"preliminary interpretation: __ | consistent with: __ | differential: __ | further evaluation needed: Y/N | final report pending: pathology / lab results / over-read / __"` | ACR Preliminary Report Standards; ASGE; ATS/ERS |
| Complications During Procedure | `"complications during procedure: none / __ | bleeding: Y/N | perforation: Y/N | desaturation: Y/N | vasovagal: Y/N | adverse medication reaction: Y/N | action taken: __"` | ASGE Adverse Events; ATS/ERS; ACC; Joint Commission SE Reporting |

#### Post-Procedure (6 items)

| Item | Format Template | Source |
|------|----------------|--------|
| Patient Recovery | `"recovery status: __ | alert and oriented: Y/N | vitals stable: Y/N | pain level: __/10 | nausea: Y/N | observed for __ min | discharge criteria met: Y/N | Aldrete score: __/10"` | ASA Post-Anesthesia Discharge Criteria; Aldrete Score; ASGE Recovery Standards |
| Sedation Reversal | `"reversal agent: none / naloxone / flumazenil / __ | dose: __ | response: __ | additional monitoring: __ min | re-sedation: Y/N"` | ASA Sedation Guidelines; ASGE |
| Immediate Complications | `"immediate post-procedure complications: none / __ | bleeding: Y/N | pain: Y/N | nausea/vomiting: Y/N | respiratory: Y/N | hemodynamic: Y/N | action taken: __"` | ASGE Adverse Event Reporting; CMS; Joint Commission |
| Results Communicated | `"results communicated to: patient / family / __ | findings explained: Y/N | preliminary results: __ | pending results: pathology / lab / __ | understanding confirmed: Y/N | interpreter used: Y/N"` | CMS Discharge Requirements; Joint Commission; ASGE |
| Follow-Up for Pathology / Results | `"pathology results expected: __ days | results notification plan: phone / portal / letter / __ | follow-up appointment: __ | additional testing recommended: Y/N | surveillance interval: __ | return precautions: __"` | ASGE Post-Polypectomy Surveillance (USMSTF); CMS Continuity of Care |
| Return Precautions and Instructions | `"return to ED/clinic if: __ | post-procedure diet: __ | activity restrictions: __ duration | driving restriction: __ hours | no sedated consent for __ hours | written instructions provided: Y/N | responsible adult for transport: Y/N"` | ASA Discharge Criteria; ASGE Post-Procedure Instructions; ACEP |

#### Medical Necessity (4 items)

| Item | Format Template | Source |
|------|----------------|--------|
| Diagnostic Indication | `"indication: __ | ICD-10: __ | symptoms: __ | duration: __ | clinical question: __ | prior non-invasive workup: __"` | CMS LCD/NCD; AMA CPT; ASGE; ATS/ERS; ACC |
| Prior Workup Supporting Need | `"prior workup: __ | results: __ | abnormalities supporting this procedure: __ | non-invasive testing insufficient because: __ | screening criteria met: Y/N | guidelines: __"` | CMS LCD; ASGE Screening Guidelines; USPSTF; ACG |
| Clinical Decision Impact | `"this procedure will impact clinical decision-making by: __ | expected change in management: __ | treatment plan depends on results: Y/N | differential diagnosis narrowed: Y/N"` | CMS Medical Necessity; AMA CPT; AHRQ |
| Cultural and Patient-Centered Considerations | `"cultural considerations discussed: Y/N | procedure concerns addressed: __ | fasting accommodated cultural/religious practices: Y/N | family presence requested: Y/N | traditional healing coordination: Y/N | interpreter used: Y/N | tribal health liaison: Y/N"` | IHS Standards of Care; CMS Person-Centered Care; APA Multicultural Guidelines; Joint Commission |

---

### 3.5 Biopsy / Excision Procedure

**Subtype:** Standard (31 items)
**Use When:** Skin biopsy (punch, shave, excisional), breast biopsy (core needle, excisional), lymph node biopsy, soft tissue mass excision, lesion removal, Mohs referral assessment, mole removal, lipoma excision, cyst excision, skin cancer excision.
**Best For:** Dermatology, primary care, general surgery, surgical oncology, breast surgery, tribal health clinic.

#### Pre-Procedure (7 items)

| Item | Format Template | Source |
|------|----------------|--------|
| Biopsy / Excision Indication | `"indication: __ | ICD-10: __ | clinical suspicion: __ | lesion history: new / changing / __ | duration: __ | symptoms: pain / bleeding / growth / pruritus / __"` | AAD Skin Biopsy Guidelines; ACS; CMS |
| Lesion Description (ABCDE + Clinical) | `"location: __ | size: __ x __ mm | asymmetry: Y/N | border irregularity: Y/N | color: __ | color variation: Y/N | diameter: __ mm | evolution/change: Y/N | elevation: Y/N | shape: __ | texture: __ | associated findings: __"` | AAD ABCDE Criteria; ACS Skin Cancer Guidelines; NCCN |
| Site Marking and Photography | `"site marked: Y/N | marked by: __ | marking method: __ | clinical photograph taken: Y/N | photograph in chart: Y/N | dermoscopy performed: Y/N | dermoscopy findings: __ | multiple lesions mapped: Y/N"` | AAD Documentation Standards; Joint Commission UP.01.01.01; ACS |
| Informed Consent | `"informed consent obtained: Y/N | risks discussed: scarring / infection / bleeding / nerve damage / recurrence / incomplete excision / __ | alternatives discussed: observation / Mohs / __ | cosmetic outcomes discussed: Y/N | signed: Y/N"` | Joint Commission RI.01.03.01; AAD; ACS; AMA Code of Ethics 2.1.1 |
| Local Anesthesia | `"anesthetic: __ | concentration: __ | with epinephrine: Y/N | volume: __ mL | field block: Y/N | digital block: Y/N | aspiration before injection: Y/N | adequate anesthesia confirmed: Y/N"` | ASA Local Anesthesia Guidelines; AAD; AMA CPT |
| Skin Prep and Draping | `"prep solution: __ | sterile drape: Y/N | sterile field: Y/N | hair removal: Y/N / NA | prep area extends __ cm beyond planned incision"` | AORN Guidelines; CDC SSI Prevention; AAD |
| Time-Out Performed | `"time-out performed: Y/N | correct patient: Y/N | correct site/laterality: Y/N | correct procedure: Y/N | biopsy type confirmed: __ | specimen containers ready and labeled: Y/N | pathology requisition prepared: Y/N | allergies: __"` | Joint Commission Universal Protocol; AAD; CAP |

#### Procedure Details (8 items)

| Item | Format Template | Source |
|------|----------------|--------|
| Biopsy / Excision Type | `"type: punch / shave / saucerization / excisional / incisional / core needle / FNA / __ | CPT: __ | rationale for biopsy type: __"` | AAD Biopsy Technique Guidelines; AMA CPT (11102-11107); ACS |
| Instrument Used | `"instrument: __ mm punch / #__ blade / curette / DermaBlade / core needle gauge __ / __ | single use: Y/N"` | AAD; AMA CPT; specialty-specific standards |
| Incision / Biopsy Size | `"incision/biopsy diameter: __ mm | planned excision dimensions: __ x __ mm | planned margins: __ mm | orientation along skin tension lines: Y/N | ellipse ratio: __:1"` | AAD Excision Guidelines; ACS Surgical Margins; NCCN |
| Depth of Biopsy / Excision | `"depth: epidermis / dermis / subcutaneous fat / fascia / muscle / __ | full-thickness skin: Y/N | deep margin: __ | adequate depth for diagnosis: Y/N"` | AAD; ACS; CAP Specimen Adequacy |
| Orientation / Marking Sutures | `"orientation sutures placed: Y/N | marking method: __ | 12 o'clock suture: __ | 3 o'clock suture: __ | ink marking: Y/N | colors: __ | diagram drawn: Y/N"` | CAP Specimen Orientation Standards; AAD; ACS Surgical Pathology |
| Specimen Handling | `"specimen placed in: formalin / saline / fresh / __ | container labeled: Y/N | patient name on container: Y/N | site on container: Y/N | laterality on container: Y/N | time to fixative: __ | requisition matches container: Y/N"` | CAP Laboratory Accreditation Standards; ADASP; AAD |
| Hemostasis | `"hemostasis achieved by: pressure / electrocautery / chemical cautery (silver nitrate / aluminum chloride / Monsel solution) / suture ligation / __ | EBL: __ mL | hemostasis adequate: Y/N"` | AAD; ACS; AMA CPT |
| Closure Method and Dressing | `"closure: primary / secondary intent / suture / steri-strips / adhesive / none (punch left open) / __ | suture type: __ | suture size: __ | number of sutures: __ | layered closure: Y/N | deep sutures: __ | dressing: __ | pressure dressing: Y/N"` | AAD Wound Closure; ACS; Ethicon Wound Closure Manual; AMA CPT |

#### Intra-Procedure Findings (6 items)

| Item | Format Template | Source |
|------|----------------|--------|
| Gross Specimen Description | `"gross appearance: __ | color: __ | shape: __ | consistency: firm / soft / cystic / friable / __ | surface: smooth / irregular / ulcerated / __ | pigmentation: __"` | CAP Synoptic Reporting Standards; ADASP; AAD |
| Specimen Size | `"specimen dimensions: __ x __ x __ mm | ellipse dimensions: __ x __ mm | depth: __ mm | weight (if applicable): __ g"` | CAP Specimen Measurement Standards; ADASP |
| Margin Assessment (Gross) | `"gross margins: __ | closest margin: __ mm at __ o'clock | deep margin: __ mm | peripheral margins: __ | margin adequacy (gross): adequate / close / involved / cannot assess | additional margin taken: Y/N | from: __ location"` | AAD Margin Guidelines; ACS Surgical Margins; NCCN |
| Depth of Invasion (Gross) | `"depth of invasion: __ mm (gross estimate) | involvement of: dermis / subcutaneous / fascia / __ | base of lesion: __ | ulceration: Y/N"` | AAD; AJCC Staging (melanoma Breslow depth); NCCN |
| Specimen Labeled and Oriented | `"specimen labeled: Y/N | orientation: __ | sutures: __ | ink colors: __ | matches requisition: Y/N | diagram: Y/N | laterality confirmed: Y/N"` | CAP Specimen Handling; ADASP; Joint Commission |
| Pathology Requisition | `"pathology requisition completed: Y/N | clinical history: __ | clinical diagnosis/suspicion: __ | prior pathology at this site: __ | special stains requested: Y/N | immunohistochemistry requested: Y/N | rush processing: Y/N | reason: __"` | CAP Requisition Standards; ADASP; AAD |

#### Post-Procedure (6 items)

| Item | Format Template | Source |
|------|----------------|--------|
| Patient Tolerance | `"patient tolerated procedure: well / fair / poorly | pain during: __/10 | pain after: __/10 | vasovagal: Y/N | adverse reaction: Y/N | complications: none / __"` | ASA Monitoring Standards; AAD; CMS |
| Wound Care Instructions | `"wound care: __ | keep dry for __ hours | dressing changes: __ frequency | clean with: __ | apply: __ | activity restrictions over wound: __ | sun protection of scar: Y/N | written instructions provided: Y/N"` | AAD Post-Procedure Wound Care; Wound Care Society; CMS |
| Suture Removal Timeline | `"suture removal: __ days | location-specific timeline: face __ days / trunk __ days / extremity __ days | removal by: __ | appointment scheduled: Y/N"` | AAD Suture Removal Guidelines; ACS |
| Pathology Follow-Up Plan | `"pathology results expected: __ days | results notification: phone / portal / letter / in-person / __ | who will contact patient: __ | action if malignant: __ | action if benign: __ | additional surgery if needed: __ | oncology referral criteria: __"` | AAD; ACS; NCCN; CMS Continuity of Care |
| Signs of Infection | `"signs of infection reviewed: Y/N | return if: increasing redness / warmth / swelling / purulent drainage / red streaking / fever > __F / __ | patient verbalized understanding: Y/N | emergency contact: __"` | CDC SSI Definitions; AAD; ACEP |
| Activity Restrictions | `"activity restrictions: __ | avoid: heavy lifting / strenuous exercise / swimming / __ | duration: __ days | special site restrictions: __ | return to work: __ | return to sports: __"` | AAD Post-Biopsy Guidelines; ACS; AAFP |

#### Medical Necessity (4 items)

| Item | Format Template | Source |
|------|----------------|--------|
| Biopsy / Excision Indication | `"indication: __ | ICD-10: __ | clinical suspicion: __ | lesion characteristics warranting biopsy: __ | change history: __ | patient risk factors: __"` | AAD Skin Biopsy Appropriateness; ACS; CMS LCD; NCCN |
| Clinical Suspicion and Risk Factors | `"clinical suspicion: __ | differential diagnosis: __ | risk factors: fair skin / sun exposure / family history / prior skin cancer / immunosuppression / __ | ABCDE criteria met: __ | dermoscopy pattern: __ | ugly duckling sign: Y/N"` | AAD; NCCN Skin Cancer Screening; USPSTF; ACS |
| Prior Imaging / Examination Findings | `"prior imaging: Y/N | imaging type: ultrasound / mammogram / MRI / dermoscopy / __ | imaging findings: __ | BIRADS (breast): __ | imaging-guided biopsy: Y/N | prior biopsy at this site: Y/N | prior pathology: __"` | ACR BIRADS; AAD Dermoscopy Guidelines; NCCN |
| Cultural and Patient-Centered Considerations | `"cultural considerations: Y/N | scarring concerns in cultural context: __ | body site cultural significance: Y/N | interpreter used: Y/N | language: __ | family involvement in decision: Y/N | traditional healing coordination: Y/N | tribal health program notification: Y/N"` | IHS Standards of Care; CMS Person-Centered Care; APA Multicultural Guidelines; AAD |

---

### Cross-Subtype Reference: Section Comparison

| Section | Minor Office (3.1) | Major/Surgical (3.2) | Injection/Aspiration (3.3) | Diagnostic (3.4) | Biopsy/Excision (3.5) |
|---------|-------------------|----------------------|---------------------------|-------------------|----------------------|
| Pre-Procedure | 7 items | 10 items | 7 items | 7 items | 7 items |
| Procedure Details | 8 items | 14 items | 8 items | 10 items | 8 items |
| Intra-Procedure Findings | 5 items | 7 items | 5 items | 8 items | 6 items |
| Post-Procedure | 6 items | 8 items | 6 items | 6 items | 6 items |
| Medical Necessity | 4 items | 5 items | 4 items | 4 items | 4 items |
| **Total** | **30 items** | **44 items** | **30 items** | **35 items** | **31 items** |

### Tribal Healthcare Integration Notes

The following items appear across all five subtypes and reflect the unique documentation needs of Indian Health Service (IHS) facilities, tribal health programs, and urban Indian health organizations:

1. **Interpreter / Language Access** -- Documented in Pre-Procedure or Procedure Details. Federal law (Title VI, CMS Conditions of Participation) and IHS policy require documentation of language services for patients with limited English proficiency. Many tribal communities have members who prefer their indigenous language for medical discussions.

2. **Cultural and Patient-Centered Considerations** -- Documented in Medical Necessity. This item captures whether traditional healing preferences were acknowledged, whether procedure timing accommodated ceremonial obligations, and whether the tribal health liaison or community health representative (CHR) was involved in care coordination.

3. **Family and Community Involvement** -- In many tribal communities, medical decisions are made with family and elder involvement. The consent process may include extended family discussion, and recovery planning may involve community support systems not captured in standard discharge templates.

4. **Historical Trauma Awareness** -- Procedures involving body exposure, sedation, or loss of control may carry additional weight for patients from communities with historical trauma. Clinicians should document sensitivity to these factors and any accommodations made.

5. **Traditional Healing Coordination** -- When patients are concurrently receiving traditional healing (ceremonies, sweat lodge, traditional medicine), the procedure note should document awareness and coordination to avoid conflicts (e.g., timing of procedures around ceremonies, wound care compatible with traditional practices).

### Source Abbreviations

| Abbreviation | Full Name |
|-------------|-----------|
| AAD | American Academy of Dermatology |
| AAOS | American Academy of Orthopaedic Surgeons |
| AANEM | American Association of Neuromuscular and Electrodiagnostic Medicine |
| AAFP | American Academy of Family Physicians |
| AAMFT | American Association for Marriage and Family Therapy |
| ACCP | American College of Chest Physicians |
| ACEP | American College of Emergency Physicians |
| ACC | American College of Cardiology |
| ACG | American College of Gastroenterology |
| ACR | American College of Radiology |
| ACS | American College of Surgeons |
| ADASP | Association of Directors of Anatomic and Surgical Pathology |
| ADA | American Diabetes Association |
| AHRQ | Agency for Healthcare Research and Quality |
| AIUM | American Institute of Ultrasound in Medicine |
| AJCC | American Joint Committee on Cancer |
| AMA | American Medical Association |
| APA | American Psychological Association / American Psychiatric Association |
| AORN | Association of periOperative Registered Nurses |
| ASA | American Society of Anesthesiologists |
| ASGE | American Society for Gastrointestinal Endoscopy |
| ASHP | American Society of Health-System Pharmacists |
| ATS/ERS | American Thoracic Society / European Respiratory Society |
| CAP | College of American Pathologists |
| CARF | Commission on Accreditation of Rehabilitation Facilities |
| CDC | Centers for Disease Control and Prevention |
| CMS | Centers for Medicare and Medicaid Services |
| CPT | Current Procedural Terminology |
| FDA | U.S. Food and Drug Administration |
| IHS | Indian Health Service |
| ISMP | Institute for Safe Medication Practices |
| NCCN | National Comprehensive Cancer Network |
| NCCI | National Correct Coding Initiative |
| OSHA | Occupational Safety and Health Administration |
| SAGES | Society of American Gastrointestinal and Endoscopic Surgeons |
| SCIP | Surgical Care Improvement Project |
| SSA | Social Security Act |
| USMSTF | U.S. Multi-Society Task Force on Colorectal Cancer |
| USP | United States Pharmacopeia |
| USPSTF | U.S. Preventive Services Task Force |
| WCS | Wound Care Society |
| WHO | World Health Organization |

---

## PART 4: CROSS-FRAMEWORK MEDICAL ADD-ONS

The items in this section apply across ALL three medical documentation frameworks (SOAP, H&P, and Procedure Note) and should be available as add-ons regardless of which framework or subtype is selected. These are universal clinical documentation elements that may be relevant to any encounter type -- from a routine follow-up visit to an emergency department evaluation to a surgical procedure.

When a provider activates a cross-framework add-on, its items layer on top of the currently loaded framework + subtype template. The AI engine captures the relevant data during the encounter and populates these items alongside the framework-specific items. Some of these items overlap with items already present in certain subtypes (e.g., fall risk assessment appears in the SOAP Annual Wellness Visit subtype); when overlap exists, the cross-framework version supplements rather than duplicates, and the AI engine merges the data into the most complete representation.

All format templates use `__` (double underscore) to indicate AI-populated fields. Pipes (`|`) within templates separate discrete data elements. Sources reference real clinical guidelines, regulatory standards, and validated instruments.

---

### 1. Red Flag Screening

Critical warning signs by organ system that should trigger clinical escalation, emergent workup, or change in disposition. These items ensure that high-acuity presentations are systematically screened regardless of the encounter's primary purpose.

| Item Label | Format Template | Source |
|---|---|---|
| Chest Pain Red Flags | `"Chest pain present: __ [Y/N] | If Y: substernal/pressure: __ [Y/N] | Radiation to jaw/arm/back: __ [Y/N] | Diaphoresis: __ [Y/N] | Dyspnea: __ [Y/N] | Exertional: __ [Y/N] | New onset: __ [Y/N] | Known CAD: __ [Y/N] | Troponin/ECG ordered: __ [Y/N] | HEART score: __/10 | Risk: low (0-3) / moderate (4-6) / high (7-10) | Escalation: __ [none / cardiology consult / ED transfer / activate cath lab]"` | ACEP Clinical Policy on Acute Coronary Syndromes (2018); ACC/AHA Chest Pain Guidelines 2021; HEART Score (Six et al., 2008) |
| Headache Red Flags | `"Headache present: __ [Y/N] | If Y: thunderclap onset: __ [Y/N] | Worst headache of life: __ [Y/N] | Fever with neck stiffness: __ [Y/N] | Focal neurological deficit: __ [Y/N] | Papilledema: __ [Y/N] | Altered mental status: __ [Y/N] | Age > 50 new onset: __ [Y/N] | Anticoagulant use: __ [Y/N] | History of malignancy: __ [Y/N] | Escalation: __ [none / imaging / LP / ED transfer / neurosurgery consult]"` | ACEP Clinical Policy on Headache (2019); AAN Practice Guideline on Headache; SNOOP mnemonic (Dodick, 2003) |
| Abdominal Red Flags | `"Abdominal pain present: __ [Y/N] | If Y: rigid abdomen: __ [Y/N] | Rebound/guarding: __ [Y/N] | Hematemesis: __ [Y/N] | Melena/hematochezia: __ [Y/N] | Hemodynamic instability: __ [Y/N] | Pulsatile mass: __ [Y/N] | Fever with peritoneal signs: __ [Y/N] | Post-surgical (< 30 days): __ [Y/N] | Escalation: __ [none / surgical consult / ED transfer / CT abdomen/pelvis / blood bank notification]"` | ACEP Clinical Policy on Abdominal Pain (2020); ACS Emergency General Surgery Guidelines |
| Neurological Red Flags | `"Neurological concern: __ [Y/N] | If Y: acute focal weakness: __ [Y/N] | Speech disturbance: __ [Y/N] | Vision loss: __ [Y/N] | Seizure (new onset): __ [Y/N] | Gait instability (acute): __ [Y/N] | Cauda equina symptoms (saddle anesthesia / urinary retention / bilateral leg weakness): __ [Y/N] | Last known normal: __ [time] | NIHSS: __/42 | Stroke alert activated: __ [Y/N] | Escalation: __ [none / stroke team / neurology consult / ED transfer / emergent MRI/CT]"` | ACEP Clinical Policy on Stroke (2019); AHA/ASA Stroke Guidelines 2019; NIH Stroke Scale |
| Pediatric Red Flags | `"Pediatric patient (< 18): __ [Y/N] | If Y: toxic appearance: __ [Y/N] | Inconsolable crying: __ [Y/N] | Bulging fontanelle (infant): __ [Y/N] | Petechial/purpuric rash: __ [Y/N] | Respiratory distress (nasal flaring / retractions / grunting): __ [Y/N] | Dehydration (poor turgor / dry mucous membranes / reduced urine): __ [Y/N] | Non-accidental trauma concern: __ [Y/N] | Mandatory reporting triggered: __ [Y/N] | Escalation: __ [none / pediatric consult / PICU / ED transfer / CPS report]"` | AAP Clinical Practice Guidelines; ACEP Pediatric Emergency Policies; Joint Commission NPSG; CDC Child Maltreatment Reporting |
| Sepsis Screening | `"Sepsis screening performed: __ [Y/N] | Suspected infection source: __ | qSOFA score: __/3 (RR >= 22: __ [Y/N] | Altered mentation: __ [Y/N] | SBP <= 100: __ [Y/N]) | SIRS criteria met (>= 2): __ [Y/N] (Temp > 38 or < 36: __ [Y/N] | HR > 90: __ [Y/N] | RR > 20: __ [Y/N] | WBC > 12K or < 4K: __ [Y/N]) | Lactate ordered: __ [Y/N] | Lactate result: __ mmol/L | Blood cultures drawn before antibiotics: __ [Y/N] | Sepsis bundle initiated: __ [Y/N] | Time to antibiotics: __ min | IV fluid resuscitation: __ mL | Escalation: __ [none / ICU consult / rapid response / code sepsis]"` | CMS SEP-1 Sepsis Bundle Requirements; Surviving Sepsis Campaign 2021 (Evans et al.); qSOFA (Singer et al., JAMA 2016); Joint Commission Sepsis Core Measure |
| Obstetric / Pregnancy Red Flags | `"Pregnancy: __ [Y/N / unknown] | If Y or unknown: gestational age: __ weeks | Vaginal bleeding: __ [Y/N] | Severe abdominal pain: __ [Y/N] | Headache with hypertension (BP > 140/90): __ [Y/N] | Visual changes: __ [Y/N] | Decreased fetal movement: __ [Y/N] | Rupture of membranes: __ [Y/N] | Urine pregnancy test result: __ | Escalation: __ [none / OB consult / L&D transfer / ED transfer]"` | ACOG Practice Bulletins; ACEP Clinical Policy on Pregnancy Emergencies; CMS EMTALA (pregnant patients) |

---

### 2. Medication Reconciliation

Universal medication documentation items ensuring accurate, complete medication records across every encounter type. These items support Joint Commission National Patient Safety Goals and CMS medication reconciliation requirements.

| Item Label | Format Template | Source |
|---|---|---|
| Current Medication List | `"Medication list reviewed with patient: __ [Y/N] | Source: __ [patient / pharmacy / EHR / caregiver / medication bottles] | Total medications: __ | Prescription: __ | OTC: __ | Supplements/vitamins: __ | Herbal/traditional remedies: __ | Discrepancies identified: __ [Y/N] | Discrepancies resolved: __ [Y/N] | Updated list provided to patient: __ [Y/N]"` | Joint Commission NPSG.03.06.01 (Medication Reconciliation); CMS Medication Reconciliation Standards; WHO High 5s Medication Reconciliation |
| Medication Allergies with Reactions | `"Allergies reviewed and updated: __ [Y/N] | NKDA: __ [Y/N] | Allergy 1: __ | Allergen type: __ [drug / food / environmental / latex / contrast] | Reaction: __ [anaphylaxis / angioedema / rash / urticaria / GI / bronchospasm / other: __] | Severity: __ [mild / moderate / severe / life-threatening] | Date identified: __ | Cross-reactivity noted: __ [Y/N] | Allergy 2: __ | Reaction: __ | Alert in EHR: __ [Y/N]"` | Joint Commission NPSG.03.06.01; ISMP Allergy Documentation Standards; FDA MedWatch |
| High-Risk Medication Identification | `"High-risk medications present: __ [Y/N] | Anticoagulants: __ [agent / dose / INR or anti-Xa level: __ / monitoring plan: __] | Insulin: __ [type / dose / last A1c: __ / hypoglycemia protocol: __] | Opioids: __ [agent / dose / MME/day: __ / naloxone prescribed: Y/N] | Chemotherapy/immunosuppressants: __ | Digoxin: __ [level: __] | Antiepileptics: __ [level: __] | Beers Criteria medications (age >= 65): __ | Total high-alert count: __"` | ISMP High-Alert Medications List; AGS Beers Criteria 2023; CMS High-Risk Medication Measures; Joint Commission NPSG.03.05.01 |
| Drug Interactions Screened | `"Drug-drug interaction screening performed: __ [Y/N] | Screening method: __ [EHR alert / pharmacist review / manual] | Clinically significant interactions identified: __ [Y/N] | Interaction 1: __ + __ | Severity: __ [major / moderate / minor] | Action: __ [dose adjust / monitor / discontinue / accept risk] | Drug-herb/traditional remedy interactions screened: __ [Y/N] | Interactions: __ | Pharmacist consulted: __ [Y/N]"` | ISMP Medication Safety Guidelines; FDA Drug Interaction Labeling; Joint Commission NPSG.03.06.01; IHS Pharmacy Standards |
| Controlled Substance Documentation | `"Controlled substance prescribed: __ [Y/N] | If Y: agent: __ | Schedule: __ [II / III / IV / V] | Dose: __ | Quantity: __ | Days supply: __ | Indication: __ | Treatment agreement on file: __ [Y/N] | Urine drug screen: __ [date / result / pending] | Risk assessment tool: __ [ORT / DIRE / SOAPP-R] | Score: __ | Risk level: __ [low / moderate / high] | Naloxone co-prescribed: __ [Y/N] | Refill policy discussed: __ [Y/N]"` | CDC Clinical Practice Guideline for Prescribing Opioids 2022; DEA Controlled Substance Regulations (21 CFR 1306); State PDMP Requirements; FDA REMS |
| PDMP Check | `"PDMP checked: __ [Y/N] | State(s) queried: __ | Date checked: __ | Findings: __ [no concerns / active prescriptions from __ providers / total active controlled prescriptions: __ / overlap prescriptions: Y/N / early refill pattern: Y/N] | Discussed with patient: __ [Y/N] | Clinical action based on PDMP: __ [none / dose adjustment / referral to treatment / prescription modified / declined to prescribe]"` | State PDMP Mandates; CDC Opioid Prescribing Guideline 2022; CMS Opioid Safety Measures; SAMHSA |

---

### 3. Social Determinants of Health (SDOH) Screening

Universal SDOH documentation items capturing non-medical factors that influence health outcomes. These items support CMS Z-code reporting (Z55-Z65), value-based care quality measures, and population health management.

| Item Label | Format Template | Source |
|---|---|---|
| Housing Stability | `"Housing status: __ [stable / unstable / temporary / homeless / shelter / transitional / doubled up / institutional] | Adequate heating/cooling: __ [Y/N] | Safe neighborhood: __ [Y/N] | Mold/pest concerns: __ [Y/N] | Housing insecurity in past 12 months: __ [Y/N] | ICD-10 Z-code: __ [Z59.0 Homelessness / Z59.1 Inadequate housing / Z59.8 Other housing problems]"` | CMS SDOH Z-Codes (Z55-Z65); AHC-HRSN Screening Tool; HUD Definitions; AAFP Social Needs Screening |
| Food Security | `"Food security screen: __ [secure / insecure / very low] | Within past 12 months, worried food would run out: __ [often / sometimes / never] | Within past 12 months, food bought did not last: __ [often / sometimes / never] | Access to nutritious food: __ [Y/N] | Food assistance programs: __ [SNAP / WIC / food bank / tribal food distribution / none / __] | ICD-10 Z-code: __ [Z59.41 Food insecurity / Z59.48 Other food insufficiency]"` | CMS SDOH Z-Codes; AHC-HRSN Screening Tool (Hunger Vital Sign); USDA Food Security Module; AAFP Social Needs |
| Transportation Access | `"Reliable transportation to medical appointments: __ [Y/N] | Transportation barriers in past 12 months: __ [Y/N] | Missed appointments due to transportation: __ [Y/N] | Distance to nearest facility: __ miles | Transportation mode: __ [personal vehicle / public transit / tribal transit / medical transport / rideshare / none] | Transportation assistance needed: __ [Y/N] | ICD-10 Z-code: __ [Z59.82 Transportation insecurity]"` | CMS SDOH Z-Codes; AHC-HRSN Screening Tool; AAFP Social Needs; IHS Access to Care Framework |
| Financial Strain | `"Financial stress affecting health: __ [Y/N] | Difficulty paying for: medications __ [Y/N] / medical bills __ [Y/N] / utilities __ [Y/N] / basic needs __ [Y/N] | Insurance status: __ [insured / uninsured / underinsured] | Insurance type: __ [Medicare / Medicaid / private / IHS / tribal / CHIP / none] | Medication cost barriers: __ [Y/N] | Patient assistance programs: __ [Y/N] | ICD-10 Z-code: __ [Z59.86 Financial insecurity / Z59.7 Insufficient social insurance]"` | CMS SDOH Z-Codes; AHC-HRSN Screening Tool; AAFP Social Needs; CMS Health Equity Framework |
| Education and Health Literacy | `"Highest education level: __ | Health literacy screen: __ [adequate / limited / unable to assess] | Screening tool: __ [single-item literacy screener / REALM / NVS / __] | Preferred learning method: __ [verbal / written / visual / demonstration] | Teach-back used: __ [Y/N] | Teach-back successful: __ [Y/N] | Interpreter needed: __ [Y/N] | ICD-10 Z-code: __ [Z55.0 Illiteracy / Z55.8 Other education problems]"` | CMS SDOH Z-Codes; AHRQ Health Literacy Universal Precautions Toolkit (3rd Ed.); AMA Health Literacy Framework; IOM Health Literacy Report |
| Social Isolation and Support | `"Social isolation screen: __ [not isolated / at risk / isolated] | Living alone: __ [Y/N] | Frequency of social contact: __ [daily / weekly / monthly / rarely / never] | Emotional support available: __ [Y/N] | Community engagement: __ [active / limited / none] | Loneliness scale (UCLA-3): __/9 | Caregiver available: __ [Y/N] | ICD-10 Z-code: __ [Z60.2 Living alone / Z60.4 Social exclusion]"` | CMS SDOH Z-Codes; AHC-HRSN Screening Tool; NAS Social Isolation and Loneliness (2020); UCLA Loneliness Scale (Hughes et al., 2004) |
| Intimate Partner Violence (IPV) Screening | `"IPV screen performed: __ [Y/N / declined] | Screening tool: __ [HITS / STaT / HARK / PVS / WAST / direct inquiry] | Screen result: __ [negative / positive / declined to answer] | Safety concern identified: __ [Y/N] | Safety plan discussed: __ [Y/N] | Resources provided: __ [hotline / shelter / legal aid / __] | Mandatory reporting obligation: __ [Y/N, per state law] | Documented in restricted section of chart: __ [Y/N] | ICD-10 Z-code: __ [Z63.0 Problems in relationship with spouse/partner]"` | USPSTF IPV Screening Recommendation (Grade B); AMA Guidelines on Domestic Violence; Joint Commission PC.01.02.09; CMS SDOH Z-Codes |
| Immigration, Legal, and Refugee Concerns | `"Immigration/refugee status concerns affecting care: __ [Y/N] | Fear of accessing healthcare: __ [Y/N] | Legal concerns affecting health decisions: __ [Y/N] | Uninsured due to status: __ [Y/N] | Children's insurance status: __ | Need for culturally specific services: __ [Y/N] | Referral to community resources: __ [Y/N] | ICD-10 Z-code: __ [Z60.0 Phase of life adjustment / Z65.3 Legal circumstances]"` | CMS SDOH Z-Codes; AHC-HRSN Screening Tool; AAFP Social Needs; HHS Office of Refugee Resettlement |

---

### 4. Fall Risk Assessment

Universal fall screening and prevention documentation applicable across all encounter types. Fall risk assessment is a Joint Commission National Patient Safety Goal and a USPSTF Grade B recommendation for adults age 65 and older.

| Item Label | Format Template | Source |
|---|---|---|
| Fall Risk Screen | `"Fall risk screening performed: __ [Y/N] | Tool used: __ [Morse Fall Scale / STEADI / Hendrich II / Timed Up and Go / Tinetti / __] | Score: __ | Risk level: __ [low / moderate / high] | Threshold for elevated risk: __ | Screening positive: __ [Y/N] | Age >= 65: __ [Y/N] | Inpatient vs. outpatient context: __"` | CDC STEADI Initiative; Joint Commission NPSG.09.02.01; Morse Fall Scale (Morse et al., 1989); USPSTF Falls Prevention (Grade B for >= 65) |
| Fall History | `"Falls in past 12 months: __ [number] | Most recent fall: __ [date] | Mechanism: __ | Injury sustained: __ [none / bruise / laceration / fracture / head injury / __] | Location of fall: __ [home / outdoors / facility / __] | Circumstances: __ | Near-falls/stumbles: __ [Y/N] | Fear of falling limiting activity: __ [Y/N] | Prior fall evaluation: __ [Y/N]"` | CDC STEADI Algorithm; AGS/BGS Clinical Practice Guideline for Prevention of Falls (2011 / 2024 Update); USPSTF Falls Prevention |
| Gait and Balance Assessment | `"Gait assessment: __ [normal / antalgic / ataxic / shuffling / wide-based / festinating / __] | Assistive device used: __ [none / cane / walker / wheelchair / __] | Timed Up and Go: __ sec (>= 12 sec elevated risk) | 30-Second Chair Stand: __ | 4-Stage Balance Test: passed / failed at stage __ | Tandem gait: __ [normal / abnormal] | Romberg: __ [negative / positive] | Orthostatic hypotension: __ [Y/N] (Supine BP: __/__ | Standing BP: __/__)"` | CDC STEADI Assessment Tools; Tinetti Balance Assessment; AGS/BGS Fall Prevention Guidelines; ACC/AHA Orthostatic Hypotension |
| Environmental and Modifiable Risk Factors | `"Home hazards identified: __ [loose rugs / poor lighting / clutter / stairs without rails / bathroom without grab bars / __] | Medication-related risk: __ [polypharmacy / sedatives / antihypertensives / anticholinergics / __] | Sensory deficits: vision __ [Y/N] / hearing __ [Y/N] | Footwear assessment: __ [appropriate / inappropriate] | Cognitive impairment: __ [Y/N] | Alcohol use contributing: __ [Y/N] | Vitamin D level: __ ng/mL | Vitamin D supplementation: __ [Y/N]"` | CDC STEADI Risk Factor Checklist; AGS/BGS Fall Prevention; AGS Beers Criteria 2023; USPSTF Vitamin D for Fall Prevention |
| Fall Prevention Plan | `"Fall prevention plan initiated: __ [Y/N] | Interventions: exercise/PT referral __ [Y/N] | Home safety assessment __ [Y/N] | Medication review __ [Y/N] | Vision correction __ [Y/N] | Vitamin D supplementation __ [Y/N] | Assistive device prescribed __ [Y/N] | Hip protectors discussed __ [Y/N] | Fall risk wristband (inpatient) __ [Y/N] | Patient/caregiver education __ [Y/N] | Follow-up plan: __ | Referrals: PT / OT / CHR home visit / __"` | CDC STEADI Intervention Algorithm; Joint Commission NPSG.09.02.01; AGS/BGS Fall Prevention Guidelines; CMS Quality Measures |

---

### 5. Advance Care Planning

Universal advance directive and goals-of-care documentation items. Advance care planning is a CMS-billable service (CPT 99497/99498) and a Joint Commission requirement.

| Item Label | Format Template | Source |
|---|---|---|
| Advance Directive Status | `"Advance directive on file: __ [Y/N / unknown] | Type(s): __ [living will / durable power of attorney for healthcare / POLST-MOLST / tribal elder designation / other: __] | Date executed: __ | Reviewed at this visit: __ [Y/N] | Changes made: __ [Y/N] | Copy in chart: __ [Y/N] | State-specific form used: __ [Y/N] | Patient wishes consistent with current directive: __ [Y/N]"` | CMS Advance Care Planning (CPT 99497/99498); Joint Commission RI.01.05.01; CMS Conditions of Participation 42 CFR 489.102; Patient Self-Determination Act (1990) |
| Healthcare Proxy / Power of Attorney | `"Healthcare proxy designated: __ [Y/N] | Name: __ | Relationship: __ | Contact: __ | Alternate proxy: __ | Proxy aware of role: __ [Y/N] | Proxy aware of patient wishes: __ [Y/N] | Documentation on file: __ [Y/N] | Family decision-making structure: __ [individual / family / elder-guided / community / __]"` | CMS Conditions of Participation 42 CFR 489.102; Joint Commission RI.01.05.01; State Healthcare Proxy Laws; IHS Patient Rights Policy |
| Code Status | `"Code status: __ [Full code / DNR / DNI / DNR-DNI / Comfort measures only / Limited intervention] | Code status verified: __ [Y/N] | Discussed with: __ [patient / proxy / family / __] | Peri-operative code status discussed (if surgical): __ [Y/N] | Code status order in chart: __ [Y/N] | Date of last review: __ | Circumstances for revisiting: __"` | AMA Code of Ethics Opinion 5.3; Joint Commission RI.01.05.01; ASA Ethics Committee (peri-operative DNR); CMS Conditions of Participation |
| POLST / MOLST | `"POLST/MOLST form completed: __ [Y/N / NA] | State form: __ | Cardiopulmonary resuscitation: __ [attempt CPR / DNAR] | Medical interventions: __ [full treatment / selective treatment / comfort-focused] | Artificially administered nutrition: __ [long-term / trial period / no artificial nutrition] | Signed by: patient __ / proxy __ / physician __ | Date: __ | Form on file: __ [Y/N] | EMS-accessible: __ [Y/N]"` | National POLST Paradigm; CMS Conditions of Participation; State POLST/MOLST Legislation |
| Goals of Care Discussion | `"Goals of care discussion held: __ [Y/N] | Time spent: __ min | Participants: __ [patient / proxy / family / interpreter / chaplain / __] | Patient values discussed: __ | What matters most to patient: __ | Acceptable outcomes: __ | Unacceptable outcomes: __ | Prognosis discussed: __ [Y/N] | Cultural/spiritual values incorporated: __ [Y/N] | Traditional healing preferences: __ | ACP billing code: __ [99497 first 30 min / 99498 each additional 30 min / not billed]"` | CMS ACP Billing Guidelines (CPT 99497/99498); Serious Illness Conversation Guide (Ariadne Labs); AMA Code of Ethics; IHS Patient Rights Policy; Joint Commission RI.01.05.01 |

---

### 6. Infection Control and Isolation

Universal infection screening and control documentation items. These support CMS Conditions of Participation, Joint Commission Infection Control (IC) standards, and CDC infection prevention guidelines.

| Item Label | Format Template | Source |
|---|---|---|
| Infection Precautions Status | `"Infection precautions required: __ [Y/N] | Type: __ [standard / contact / droplet / airborne / enhanced / protective/reverse isolation] | Reason: __ [diagnosis / suspected diagnosis / colonization / exposure] | Organism: __ | Precautions initiated: __ [date] | PPE required: __ [gown / gloves / N95 / PAPR / face shield / __] | Signage posted: __ [Y/N] | Patient/family educated: __ [Y/N]"` | CDC Guideline for Isolation Precautions (2007/Updated 2023); CMS Conditions of Participation 42 CFR 482.42; Joint Commission IC.01.05.01; OSHA Bloodborne Pathogen Standard |
| Respiratory / COVID Screening | `"Respiratory screening performed: __ [Y/N] | Fever >= 100.4F: __ [Y/N] | Cough: __ [Y/N] | Shortness of breath: __ [Y/N] | Sore throat: __ [Y/N] | Loss of taste/smell: __ [Y/N] | Known COVID exposure (past 10 days): __ [Y/N] | COVID test: __ [positive / negative / not tested / date: __] | Influenza test: __ [positive / negative / not tested] | RSV test: __ [positive / negative / not tested / NA] | Mask provided: __ [Y/N] | Isolation room: __ [Y/N]"` | CDC COVID-19 Infection Prevention Guidelines; CMS COVID-19 Survey Requirements; Joint Commission IC Standards; CDC Influenza Prevention |
| MDRO Status | `"Multi-drug resistant organism (MDRO) history: __ [Y/N / unknown] | Organism: __ [MRSA / VRE / ESBL / CRE / C. difficile / Candida auris / __] | Active infection: __ [Y/N] | Colonization: __ [Y/N] | Date of last positive culture: __ | Decolonization protocol: __ [Y/N] | Contact precautions initiated: __ [Y/N] | Antibiogram reviewed: __ [Y/N] | Infection control notified: __ [Y/N]"` | CDC MDRO Management Guidelines (2006); CMS HAI Reporting Requirements; Joint Commission IC.02.01.01; SHEA/IDSA MDRO Compendium |
| Immunization Documentation | `"Immunization status reviewed: __ [Y/N] | Source: __ [patient / state registry / EHR / immunization card] | Influenza (current season): __ [received date / declined / contraindicated] | COVID-19: __ [series complete / booster date / declined / contraindicated] | Pneumococcal: __ [PCV20 date / PCV15+PPSV23 dates / not due / due] | Tdap/Td: __ [date / due] | Hepatitis B: __ [series complete / incomplete / not started] | Shingrix (age >= 50): __ [series complete / dose 1 only / not started / declined] | Other: __ | Immunizations given today: __ | VIS provided: __ [Y/N] | Declined immunizations: __ | Reason for decline: __"` | CDC ACIP Immunization Schedules (Adult and Pediatric); CMS Immunization Quality Measures; Joint Commission IC.02.04.01; IHS Immunization Guidelines |
| Exposure History | `"Recent exposure of concern: __ [Y/N] | Exposure type: __ [infectious disease / blood/body fluid / TB / meningitis / measles / varicella / foodborne / environmental / occupational / __] | Date of exposure: __ | Setting: __ [healthcare / community / household / travel / tribal gathering / __] | Post-exposure prophylaxis needed: __ [Y/N] | PEP given: __ [Y/N] | Agent: __ | Employee health / infection control notified: __ [Y/N] | Monitoring plan: __ | Public health reporting: __ [Y/N] | Reportable disease: __ [Y/N]"` | CDC Exposure Management Guidelines; OSHA Bloodborne Pathogen Standard; State/Tribal Reportable Disease Laws; CMS Conditions of Participation |

---

### 7. Pain Assessment (Universal)

Universal pain documentation applicable across all encounter types -- from routine primary care visits to post-procedural assessments. Pain assessment items are separate from condition-specific pain items that may already exist in framework subtypes; these cross-framework items ensure systematic pain screening regardless of the encounter's primary purpose.

| Item Label | Format Template | Source |
|---|---|---|
| Pain Screening | `"Pain screen performed: __ [Y/N] | Pain present: __ [Y/N] | Scale used: __ [NRS (0-10) / VAS (0-100mm) / Wong-Baker FACES (0-10) / FLACC (0-10, pre-verbal/non-verbal) / PAINAD (0-10, dementia) / CPOT (0-8, ICU) / __] | Selection rationale: __ [age / cognitive status / communication ability / patient preference] | Score: __ | Interpretation: __ [none / mild / moderate / severe]"` | Joint Commission PC.01.02.07 (Pain Assessment Standards); APS Clinical Practice Guidelines; NRS (McCaffery & Beebe); Wong-Baker FACES (Wong & Baker, 1988); FLACC (Merkel et al., 1997) |
| Pain Location and Character | `"Pain location(s): __ | Laterality: __ | Radiation: __ [Y/N], to: __ | Quality: __ [sharp / dull / burning / aching / stabbing / throbbing / cramping / pressure / shooting / tingling / __] | Onset: __ | Duration: __ | Pattern: __ [constant / intermittent / breakthrough / incident / __] | Timing: __ [morning / evening / nocturnal / positional / activity-related / __]"` | CMS 1997 Documentation Guidelines; APS Pain Assessment Framework; IASP Pain Classification |
| Functional Impact of Pain | `"Functional impact: __ [none / mild / moderate / severe] | Activities limited by pain: __ [sleep / ambulation / ADLs / work / exercise / social / __] | Pain interference score (PROMIS or BPI): __ | Mood impact: __ | Pain affecting recovery/rehabilitation: __ [Y/N] | Pain affecting adherence to treatment plan: __ [Y/N]"` | BPI (Brief Pain Inventory, Cleeland); PROMIS Pain Interference Scale; WHO Analgesic Ladder; Joint Commission Pain Standards |
| Current Pain Management | `"Current pain management: __ | Pharmacologic: __ [medication / dose / frequency / duration / route] | Non-pharmacologic: __ [ice / heat / TENS / PT / acupuncture / massage / meditation / traditional healing / __] | Effectiveness of current management: __ [effective / partially effective / ineffective] | Side effects: __ | Barriers to pain management: __ | Opioid risk assessment (if applicable): __ [tool used / score / risk level] | MME per day (if opioid): __"` | CDC Opioid Prescribing Guideline 2022; APS Clinical Practice Guidelines; ISMP Opioid Safety; ASA Acute Pain Guidelines; WHO Analgesic Ladder |
| Pain Reassessment After Intervention | `"Reassessment performed: __ [Y/N] | Time after intervention: __ min | Intervention provided: __ | Pre-intervention score: __/10 | Post-intervention score: __/10 | Clinically meaningful reduction (>= 2 points or >= 30%): __ [Y/N] | Patient satisfaction with pain management: __ | Additional intervention needed: __ [Y/N] | Plan: __"` | Joint Commission PC.01.02.07; ASA Acute Pain Guidelines; CMS Pain Management Quality Measures; APS Reassessment Standards |

---

### 8. Tribal / IHS / Cultural Competency

Items specific to tribal healthcare settings, Indian Health Service (IHS) facilities, tribal health programs, and urban Indian health organizations. These items reflect the unique regulatory environment (42 CFR 136, Indian Health Care Improvement Act), cultural context, and community health infrastructure of tribal healthcare. They should be available across all frameworks when the encounter occurs within a tribal health setting or involves a patient receiving services through IHS, tribal, or urban Indian programs.

| Item Label | Format Template | Source |
|---|---|---|
| Tribal Enrollment and IHS Eligibility | `"Tribal affiliation: __ | Enrolled member: __ [Y/N] | Enrollment number: __ | IHS eligibility verified: __ [Y/N] | Beneficiary type: __ [direct service / contract health / urban Indian / descendant] | Service unit: __ | IHS facility: __ [IHS-operated / tribal 638 / urban Indian / __] | Eligibility source verified: __ [tribal enrollment office / IHS registration / self-report]"` | IHS Eligibility Policy (Indian Health Manual Part 2 Chapter 3); 42 CFR 136; Indian Health Care Improvement Act (IHCIA) Section 206 |
| Interpreter and Language Needs | `"Primary language: __ | English proficiency: __ [fluent / conversational / limited / none] | Indigenous language speaker: __ [Y/N] | Language: __ | Interpreter needed: __ [Y/N] | Interpreter type: __ [in-person / telephone / video / family member (note limitations)] | Interpreter language: __ | Certified/qualified interpreter: __ [Y/N] | Informed consent obtained in preferred language: __ [Y/N] | Written materials in preferred language: __ [Y/N / not available] | Health literacy accommodated: __ [Y/N]"` | Title VI Civil Rights Act; CMS Language Access Requirements; Joint Commission PC.02.01.21; IHS Language Access Policy; Executive Order 13166 |
| Traditional Healing Practices | `"Traditional healing practices in use: __ [Y/N] | Type: __ [ceremony / sweat lodge / traditional medicine / smudging / prayer / talking circle / __ ] | Traditional healer involved: __ [Y/N] | Name/role: __ | Concurrent with Western treatment: __ [Y/N] | Potential interactions with Western treatment: __ [none identified / __ ] | Coordination with traditional healer: __ [Y/N] | Method: __ | Accommodations made: __ [ceremony space / fasting schedule / treatment timing / visitation / __] | Patient preference to integrate traditional healing: __ [Y/N]"` | IHS Indian Health Manual Part 3 Chapter 5; Joint Commission RI.01.01.01 (Cultural Competency); CMS Person-Centered Care Requirements; AMA Code of Ethics 1.1.4 |
| Historical and Intergenerational Trauma Acknowledgment | `"Historical trauma considerations documented: __ [Y/N] | Relevant factors: __ [boarding school history / family separation / loss of language-culture / community violence / environmental injustice / distrust of healthcare systems / __] | Impact on current care: __ [engagement / adherence / mental health / pain experience / trust / __] | Trauma-informed approach used: __ [Y/N] | Cultural safety measures: __ | Additional support offered: __ [behavioral health / elder / cultural liaison / CHR / __]"` | SAMHSA TIP 57 (Trauma-Informed Care in Behavioral Health Services); IHS Behavioral Health Standards; Joint Commission Cultural Competency; HHS Action Plan to Reduce Racial and Ethnic Health Disparities |
| Community Health Representative (CHR) Involvement | `"CHR involvement: __ [Y/N] | CHR name: __ | CHR contact: __ | CHR role in care: __ [home visit / care coordination / transportation / health education / medication pickup / appointment reminders / wellness check / __] | Home visit needed: __ [Y/N] | Home visit purpose: __ | Community resources coordinated through CHR: __ | CHR follow-up plan: __ | CHR report from last contact: __"` | IHS Community Health Representative Program; IHS Indian Health Manual Part 3; 25 USC 1616 (CHR Authorization) |
| PRC / CHS Referral Documentation | `"Purchased/Referred Care needed: __ [Y/N] | Reason: service not available at this facility: __ | Service requested: __ | PRC priority level: __ [I: life-threatening/emergent / II: preventive / III: primary and secondary care / IV: chronic tertiary / V: excluded services] | PRC authorization obtained: __ [Y/N] | Authorization number: __ | Referred to: __ [facility / provider] | Estimated cost: __ | Alternate resource check completed: __ [Y/N] | Medicare/Medicaid/private insurance billed first: __ [Y/N] | Transportation assistance arranged: __ [Y/N] | Escort arranged: __ [Y/N] | Follow-up responsibility: __ [referring provider / receiving provider / CHR]"` | IHS Purchased/Referred Care (PRC) Policy; 42 CFR 136.23; IHS Indian Health Manual Part 2 Chapter 5; IHCIA Section 206 |
| Cultural Dietary and Spiritual Needs | `"Cultural dietary needs: __ [Y/N] | Requirements: __ [traditional foods / ceremonial fasting / avoiding specific foods during ceremony / __] | Dietary accommodation made: __ [Y/N] | Spiritual needs: __ [Y/N] | Requirements: __ [ceremony space / smudging / prayer / elder visit / family gathering / quiet time / __ ] | Spiritual care accommodated: __ [Y/N] | End-of-life cultural practices: __ | Family/community involvement in care decisions: __ [individual / family-centered / elder-guided / clan-based / community-based] | Decision-making process documented: __ [Y/N]"` | Joint Commission RI.01.01.01 (Spiritual Assessment); IHS Indian Health Manual; CMS Conditions of Participation (Patient Rights); AMA Code of Ethics 1.1.4 (Patient Rights) |
| SDOH in Tribal Context | `"Geographic isolation: __ [Y/N] | Distance to nearest IHS/tribal facility: __ miles | Distance to nearest hospital: __ miles | Distance to nearest pharmacy: __ miles | Road conditions/seasonal access: __ | Water access: __ [municipal / well / hauled / unsafe / __] | Sanitation: __ [municipal sewer / septic / outhouse / none / __] | Electricity: __ [reliable / unreliable / none] | Internet/phone for telehealth: __ [broadband / cellular only / none] | Food desert: __ [Y/N] | Nearest grocery: __ miles | Tribal food sovereignty programs: __ | Unemployment rate context: __ | Reservation/off-reservation: __ | Urban Indian: __ [Y/N]"` | IHS Strategic Plan; IHS Sanitation Facilities Construction Program; CMS SDOH Z-Codes (Z55-Z65); AHC-HRSN Screening Tool; GAO Reports on IHS Infrastructure |

---

### 9. Telehealth Documentation

Documentation items for telehealth encounters conducted across any framework. These items capture the unique requirements of virtual care delivery including technology, location, consent, and limitations of the remote examination.

| Item Label | Format Template | Source |
|---|---|---|
| Telehealth Modality | `"Telehealth encounter: __ [Y/N] | Modality: __ [synchronous video / synchronous audio-only / asynchronous (store-and-forward) / remote patient monitoring / e-consult] | Platform: __ [HIPAA-compliant platform name] | Encounter start time: __ | Encounter end time: __ | Total telehealth time: __ min | Connection quality: __ [good / fair / poor / interrupted]"` | CMS Telehealth Guidelines (42 CFR 410.78); AMA Telehealth Implementation Guide; CMS PFS Final Rule (telehealth provisions); Joint Commission Telehealth Standards |
| Patient and Provider Location | `"Patient location (originating site): __ [home / clinic / tribal health center / nursing facility / school / workplace / other: __] | Patient state: __ | Provider location (distant site): __ | Provider state: __ | Originating site qualifies per CMS: __ [Y/N] | Interstate licensure: __ [compact / state-specific / federal (IHS/VA)] | Patient in rural/underserved area: __ [Y/N] | HPSA designation: __ [Y/N]"` | CMS Originating Site Requirements; Interstate Medical Licensure Compact; IHS Telehealth Policy; State Telehealth Parity Laws; HRSA HPSA Designation |
| Telehealth Consent and Technology | `"Patient consent for telehealth: __ [verbal / written / electronic / standing consent on file] | Consent date: __ | Risks/limitations of telehealth discussed: __ [Y/N] | Emergency plan if technology fails: __ | Emergency contact/location for patient: __ | Technology used by patient: __ [computer / tablet / smartphone / clinic-provided equipment] | Patient comfort with technology: __ [independent / assisted / requires support] | Technical assistance provided: __ [Y/N]"` | CMS Telehealth Consent Requirements; AMA Code of Ethics 1.2.12; State Informed Consent Laws; ONC Health IT Standards; Joint Commission |
| Virtual Examination Limitations | `"Physical examination performed: __ [Y/N] | Examination method: __ [patient self-guided / caregiver-assisted / peripheral devices used / visual inspection only] | Systems examined virtually: __ | Examination limitations: __ [unable to palpate / unable to auscultate / unable to perform __  / limited by camera angle / limited by lighting / patient mobility / __] | Peripheral devices used: __ [digital stethoscope / otoscope / dermatoscope / BP cuff / pulse oximeter / scale / glucometer / __] | In-person follow-up needed: __ [Y/N] | Reason: __"` | AMA Telehealth Implementation Guide; CMS 1997 Documentation Guidelines (adapted for telehealth); ACEP Telehealth Guidelines; State Telehealth Physical Exam Requirements |
| Connectivity and Technical Issues | `"Connection interruptions: __ [none / number: __] | Duration of interruptions: __ | Impact on encounter: __ [none / minimal / required reconnection / encounter converted to phone / encounter rescheduled] | Audio quality: __ [clear / intermittent / poor] | Video quality: __ [clear / pixelated / frozen / audio-only fallback] | Interpreter connectivity: __ [good / poor / NA] | Encounter completed as planned: __ [Y/N] | Modifier applied: __ [95 (synchronous) / GT / GQ (store-and-forward) / FR (supervising practitioner present via telehealth) / __] | Place of service code: __ [02 (telehealth) / 10 (home) / __]"` | CMS Telehealth Billing and Coding Guidelines; AMA CPT Telehealth Modifiers; CMS Place of Service Codes; CMS Claims Processing Manual |

---

### Cross-Framework Add-On Summary

| Add-On Category | Item Count | Key Sources | Applicable Encounter Types |
|---|---|---|---|
| Red Flag Screening | 7 | ACEP Clinical Policies, Joint Commission NPSGs, AHA/ASA, AAP, CMS SEP-1 | All encounters -- especially acute, ED, urgent |
| Medication Reconciliation | 6 | Joint Commission NPSG.03.06.01, CMS, CDC, ISMP, AGS Beers, DEA | All encounters |
| Social Determinants of Health (SDOH) | 8 | CMS SDOH Z-Codes (Z55-Z65), AHC-HRSN, USPSTF, AAFP | All encounters -- especially new patient, AWV, CCM |
| Fall Risk Assessment | 5 | CDC STEADI, Joint Commission NPSG.09.02.01, AGS/BGS, USPSTF | All encounters -- especially age >= 65, inpatient, post-procedure |
| Advance Care Planning | 5 | CMS CPT 99497/99498, Joint Commission RI.01.05.01, AMA Ethics | All encounters -- especially admission, pre-op, CCM, AWV |
| Infection Control and Isolation | 5 | CDC Infection Control, CMS Conditions of Participation, Joint Commission IC, OSHA | All encounters -- especially inpatient, procedural, ED |
| Pain Assessment (Universal) | 5 | Joint Commission PC.01.02.07, APS, CDC Opioid Guideline, IASP | All encounters |
| Tribal / IHS / Cultural Competency | 8 | IHS Indian Health Manual, 42 CFR 136, Joint Commission Cultural Competency, SAMHSA TIP 57 | All encounters in IHS/tribal/urban Indian settings |
| Telehealth Documentation | 5 | CMS Telehealth Guidelines (42 CFR 410.78), AMA Telehealth Guide, State Parity Laws | All telehealth encounters |
| **Total Cross-Framework Items** | **54** | | |

---

## PART 5: SPECIALTY-SPECIFIC ADD-ON DATA SETS

These add-on items layer on top of the base SOAP, H&P, or Procedure Note frameworks when a specific medical specialty is selected. They capture specialty-specific data elements not covered in the generic medical templates. When a clinician selects a specialty, the corresponding add-on items below are APPENDED to whichever base framework (Part 1, Part 2, or Part 3) is being used. Items are organized by section (Subjective, Objective, Assessment, Plan) and insert into the matching section of the base template. All format templates use `__` (double underscore) to indicate AI-populated fields. Pipes (`|`) within templates separate discrete data elements. Sources reference real clinical guidelines, validated instruments, and regulatory frameworks.

---

### 1. Primary Care / Family Medicine

**Scope:** The highest-volume medical specialty in the United States (~250 million office visits/year). Primary care documentation extends beyond acute complaint management to encompass the full continuum of preventive care, chronic disease management, wellness screening, immunization tracking, and health maintenance. These add-on items capture the preventive and population-health dimensions that distinguish primary care from single-system specialties. Includes tribal healthcare considerations for IHS and tribal 638 facilities including historical trauma awareness, traditional healing integration, and community-level social determinants.

**Add-On Count:** 20 items

| Item Label | Format Template | Source |
|---|---|---|
| Subjective: Health Maintenance Review | `"Last annual wellness visit: __ | Outstanding preventive services: __ | Patient-reported barriers to preventive care: __ | Traditional/cultural health maintenance practices: __"` | USPSTF A/B Recommendations; CMS Annual Wellness Visit (AWV) Requirements; IHS Health Maintenance Protocol |
| Subjective: Preventive Screening History | `"Last colonoscopy: __ | Last mammogram: __ | Last Pap/HPV: __ | Last lung cancer screen (LDCT): __ | Last AAA screen: __ | Last bone density: __ | Last diabetic eye exam: __ | Hepatitis C screening: __ | HIV screening: __"` | USPSTF A/B Recommendations (2024); ACS Cancer Screening Guidelines; CDC Screening Recommendations |
| Subjective: Family Planning & Reproductive Health | `"Reproductive goals: __ | Current contraception: __ | Satisfaction with method: __ | Preconception counseling indicated: Y/N | LMP: __ | Menstrual regularity: __ | Menopausal status: __"` | USPSTF Contraception Recommendation (Grade A); ACOG Practice Guidelines; CDC US MEC for Contraceptive Use |
| Subjective: Lifestyle & Behavioral Counseling Needs | `"Diet quality assessment: __ | Physical activity (min/week): __ | Sleep quality: __ | Stress level: __ | Tobacco cessation readiness (stage of change): __ | Substance use screening: __ | Weight management goals: __ | Community/cultural supports utilized: __"` | USPSTF Behavioral Counseling Recommendations; 5 A's Framework (Ask, Advise, Assess, Assist, Arrange); Prochaska Stages of Change Model |
| Subjective: IHS/Tribal-Specific Screening | `"Indian Health Diabetes screening status: __ | Government Performance and Results Act (GPRA) measures reviewed: Y/N | Historical/intergenerational trauma acknowledgment: __ | Connection to tribal community/cultural identity: __ | Access to traditional foods: __ | Water/sanitation access: __"` | IHS GPRA Clinical Measures; IHS Diabetes Standards of Care; Brave Heart Historical Trauma Framework |
| Objective: Comprehensive Vitals Trending | `"Current BP: __/__ mmHg | BP trend (last 3 visits): __ | Weight trend (12 months): __ | BMI trajectory: __ | Waist circumference: __ cm | BP at goal (<130/80 or <140/90 per risk): Y/N | Weight change since last visit: __ lbs"` | ACC/AHA 2017 Hypertension Guidelines; CDC Adult BMI Interpretation; NHLBI Obesity Guidelines |
| Objective: Cancer Screening Status Dashboard | `"Colorectal: __ [up to date / due / overdue / declined] | Breast: __ [up to date / due / overdue / declined / not applicable] | Cervical: __ [up to date / due / overdue / declined / not applicable] | Lung: __ [eligible Y/N, status: __] | Prostate (shared decision): __ | Skin: __ | Hepatitis C (1945-1965 cohort): __"` | USPSTF A/B Recommendations; ACS 2024 Cancer Screening Guidelines; HEDIS Cancer Screening Measures |
| Objective: Immunization Status | `"Influenza: __ [date / due / declined] | COVID-19: __ [series complete / booster due / declined] | Tdap/Td: __ [date / due] | Pneumococcal (PCV20 or PCV15+PPSV23): __ | Shingrix (age >= 50): __ | Hepatitis B: __ | HPV (if applicable): __ | Catch-up immunizations needed: __"` | CDC ACIP Immunization Schedule (Adult, 2024); IHS Immunization Guidelines |
| Objective: Developmental Milestones (Pediatric Overlap) | `"Age-appropriate milestones met: Y/N | Gross motor: __ | Fine motor: __ | Language/speech: __ | Social/emotional: __ | Cognitive: __ | Screening tool used: __ [ASQ-3 / PEDS / Ages & Stages] | Concerns identified: __"` | AAP Bright Futures; ASQ-3 (Squires & Bricker); CDC Developmental Milestones |
| Objective: Chronic Disease Panel Metrics | `"HbA1c: __ (goal: <7% or individualized: __) | LDL: __ mg/dL (goal: __) | eGFR: __ mL/min | UACR: __ mg/g | TSH: __ | BP average (last 3): __/__ | PHQ-9: __/27 | FIB-4 (liver fibrosis): __ | Statin benefit group: __"` | ADA Standards of Care 2024; ACC/AHA 2018 Cholesterol Guidelines; KDIGO CKD Guidelines; USPSTF Depression Screening |
| Assessment: Preventive Care Gap Analysis | `"Total care gaps identified: __ | Screenings overdue: __ | Immunizations overdue: __ | Counseling topics unaddressed: __ | Patient barriers documented: __ | Tribal/IHS GPRA gaps: __"` | HEDIS 2024 Quality Measures; CMS Medicare Stars Program; IHS GPRA Clinical Indicators |
| Assessment: Chronic Disease Registry Metrics (HEDIS/Stars) | `"Diabetes controlled (HbA1c <8): Y/N | Hypertension controlled (BP <140/90): Y/N | Statin therapy adherence (>=80% PDC): Y/N | Depression remission (PHQ-9 <5): Y/N | Kidney health monitoring: Y/N | Composite quality score: __% | HEDIS measures met: __/__"` | NCQA HEDIS 2024 Measures; CMS Medicare Stars Quality Ratings; ADA/ACC/AHA Quality Metrics |
| Assessment: Health Risk Assessment Summary | `"ASCVD 10-year risk: __% | Diabetes risk (ADA screen): __ | Framingham risk: __ | Falls risk (age >= 65): __ | Depression screen: __ | Alcohol misuse risk: __ | Cancer risk factors: __ | Social/environmental risk factors: __ | Historical trauma impact assessment: __"` | ACC/AHA 2019 ASCVD Risk Calculator; ADA Risk Test; USPSTF A/B Risk Assessments; Brave Heart Historical Trauma Model |
| Assessment: Traditional Healing Integration Assessment | `"Patient utilizes traditional healing: Y/N | Types: __ [ceremony / herbalism / sweat lodge / smudging / talking circles / other: __] | Coordination with traditional healer: Y/N | Potential interactions with Western treatment: __ | Patient preferences documented: __"` | IHS Traditional Medicine Policy; NIHB Tribal Health Integration Guidelines; AMA Cultural Competency Standards |
| Plan: Personalized Prevention Plan | `"Screenings to schedule: __ | Immunizations to administer: __ | Behavioral counseling plan: __ | Risk reduction strategies: __ | Patient-agreed goals: __ | Timeline for completion: __"` | USPSTF A/B Recommendations; Healthy People 2030 Objectives; AAFP Clinical Preventive Services |
| Plan: Health Maintenance Schedule | `"Next wellness visit: __ | Screening schedule: __ | Lab monitoring schedule: __ | Immunization schedule: __ | Age/sex-specific milestones: __ | Medicare AWV or IPPE eligibility: Y/N"` | CMS AWV/IPPE Requirements; USPSTF Periodicity Schedule; CDC ACIP Schedule |
| Plan: Chronic Care Coordination | `"Active chronic conditions managed: __ | Specialist co-management: __ | Care team roles: __ | Self-management goals: __ | CHR/community health representative involvement: Y/N | Tribal health program resources: __ | Chronic Care Management (CCM) time: __ min | CCM billing eligible: Y/N"` | CMS Chronic Care Management (CPT 99490/99491); AAFP Chronic Care Model; IHS Community Health Representative Program |
| Plan: SDOH Intervention Plan (Tribal Context) | `"SDOH needs identified: __ | Referrals to tribal programs: __ | Food sovereignty/traditional food access: __ | Housing assistance: __ | Transportation (IHS/tribal): __ | Behavioral health referral: __ | Community resource navigation: __ | ICD-10 Z-codes documented: __"` | CMS SDOH Z-Code Guidelines; IHS Community Health Programs; NIHB SDOH Framework; AHC-HRSN Model |
| Plan: Tobacco/Substance Cessation Plan | `"Tobacco use status: __ | Cessation readiness: __ | Pharmacotherapy offered: __ [NRT / varenicline / bupropion] | Counseling modality: __ [5 A's / motivational interviewing / tribal cessation program] | Quitline referral: Y/N | Commercial tobacco vs. traditional/ceremonial tobacco distinguished: Y/N"` | USPSTF Tobacco Cessation (Grade A); PHS Clinical Practice Guideline for Treating Tobacco Use; CDC Tips From Former Smokers; IHS Tobacco Cessation Guidelines (distinguishing commercial from ceremonial use) |
| Plan: Annual Wellness Visit Documentation | `"AWV type: Initial IPPE / Subsequent AWV | Health Risk Assessment completed: Y/N | Personalized Prevention Plan updated: Y/N | Advance directive discussed: Y/N | Cognitive assessment: __ | Depression screening: __ | Functional ability/safety: __ | Eligible for next AWV: __"` | CMS Medicare AWV Requirements (42 CFR 410.15); CMS IPPE (42 CFR 410.16); AAFP AWV Toolkit |

---

### 2. Internal Medicine

**Scope:** Internal medicine manages complex, multi-system disease in adults, with emphasis on polypharmacy management, multimorbidity, geriatric syndromes, and risk stratification. These add-on items capture the diagnostic and therapeutic complexity that defines the internist's scope -- competing treatment priorities, deprescribing decisions, functional decline assessment, and multi-organ monitoring panels. Internal medicine documentation must justify the high-level medical decision-making (MDM) inherent in managing patients with 5+ active conditions.

**Add-On Count:** 15 items

| Item Label | Format Template | Source |
|---|---|---|
| Subjective: Symptom Complexity & Multisystem Review | `"Number of active conditions addressed today: __ | New symptoms since last visit: __ | Symptom interactions (e.g., medication side effects mimicking disease): __ | Functional status change: __ | Patient-prioritized concerns: __"` | ACP Clinical Practice Guidelines; CMS MDM Complexity (Number/Complexity of Problems Addressed) |
| Subjective: Polypharmacy Burden Assessment | `"Total active medications: __ | Medications started since last visit: __ | Medications causing side effects: __ | Patient-reported adherence barriers: __ | Pill burden concern: Y/N | Cost barriers: Y/N | Supplement/OTC use: __"` | AGS Beers Criteria 2023; Polypharmacy defined as >= 5 medications (Masnoon et al., 2017); ACP High-Value Care Initiative |
| Subjective: Functional Decline & Geriatric Syndromes | `"ADL status: __ [independent / needs assistance: __] | IADL status: __ [independent / needs assistance: __] | Falls in past 6 months: __ | Unintentional weight loss: __ lbs over __ months | Fatigue/exhaustion: Y/N | Cognitive concerns: Y/N | Incontinence: Y/N | Sensory decline (vision/hearing): __"` | AGS Geriatric Assessment Guidelines; Katz ADL Scale; Lawton IADL Scale; Fried Frailty Criteria |
| Objective: Multi-Organ Lab Panel Review | `"eGFR: __ (CKD stage: __) | HbA1c: __ | Fasting glucose: __ | Lipid panel -- TC: __ | LDL: __ | HDL: __ | TG: __ | TSH: __ | Free T4: __ | LFTs -- AST: __ | ALT: __ | Alk Phos: __ | Albumin: __ | CBC -- WBC: __ | Hgb: __ | Plt: __ | BMP -- Na: __ | K: __ | Cr: __ | BUN: __ | Ferritin: __ | B12: __ | Vitamin D: __"` | ADA Standards of Care 2024; KDIGO CKD Guidelines; ACC/AHA Cholesterol Guidelines; ATA Thyroid Guidelines |
| Objective: Disease-Specific Metric Dashboard | `"HbA1c (goal <7% or __): current __ | trend: __ | LDL (goal < __): current __ | trend: __ | eGFR (trend): __ | UACR: __ | BP average (home/office): __ | INR (if on warfarin): __ | BNP/NT-proBNP: __ | Disease-specific scores: __"` | ADA 2024; ACC/AHA 2018 Cholesterol; KDIGO 2024; ACC/AHA Heart Failure Guidelines |
| Objective: Beers Criteria / High-Risk Medication Screening | `"Beers list medications identified: __ | Potentially inappropriate medications (PIMs): __ | Anticholinergic burden score: __ | Sedative-hypnotic use: Y/N | NSAID use with CKD/GI risk: Y/N | Duplicate therapy: Y/N | Drug-drug interactions flagged: __"` | AGS Beers Criteria 2023 (Updated); STOPP/START Criteria v3; Anticholinergic Cognitive Burden Scale |
| Objective: Frailty & Sarcopenia Assessment | `"Grip strength: __ kg | Gait speed: __ m/s | Chair stand test: __ seconds | FRAIL Scale score: __/5 | Unintentional weight loss > 5% in 12 months: Y/N | Exhaustion (CES-D items): Y/N | Frailty classification: robust / pre-frail / frail"` | Fried Frailty Phenotype (Fried et al., 2001); FRAIL Scale (Morley et al.); EWGSOP2 Sarcopenia Criteria |
| Assessment: Multimorbidity Management Complexity | `"Total active diagnoses: __ | CMS-HCC risk score: __ | Conditions with competing treatment priorities: __ | Treatment synergies identified: __ | Treatment conflicts identified: __ | Overall disease burden: low / moderate / high / very high"` | CMS HCC Risk Adjustment Model v28; ACP Multimorbidity Guidelines; Charlson Comorbidity Index; Elixhauser Comorbidity Measure |
| Assessment: Competing Treatment Priority Analysis | `"Priority conflict 1: __ vs. __ | Clinical rationale for chosen approach: __ | Priority conflict 2: __ vs. __ | Rationale: __ | Patient preference factored: Y/N | Shared decision-making documented: Y/N | Trade-offs explicitly discussed: Y/N"` | ACP High-Value Care Principles; CMS MDM High-Complexity Criteria (management of illness with threat to life or bodily function) |
| Assessment: Geriatric Syndrome Evaluation | `"Delirium risk: __ [CAM score: __] | Dementia screening: __ [MoCA: __/30 or MMSE: __/30] | Falls risk: __ [Timed Up and Go: __ sec] | Polypharmacy risk: __ | Malnutrition risk: __ [MNA-SF: __] | Pressure injury risk: __ [Braden: __/23] | Urinary incontinence: __ | Functional trajectory: improving / stable / declining"` | AGS Geriatric Assessment; CAM (Inouye); MoCA (Nasreddine); MNA-SF (Nestle Nutrition Institute); Braden Scale |
| Assessment: CKD Staging & Cardiovascular Risk Integration | `"CKD stage: __ (eGFR: __ | UACR: __) | KDIGO risk category: __ [low / moderate / high / very high] | Cardiovascular risk overlay (ASCVD 10-yr): __% | Anemia of CKD: Y/N | Mineral bone disease: Y/N | Medication dose adjustments for renal function: __"` | KDIGO CKD Guidelines 2024; ACC/AHA 2019 ASCVD Risk; NKF KDOQI |
| Plan: Deprescribing Plan | `"Medications targeted for deprescribing: __ | Rationale: __ [Beers / lack of indication / duplicate / patient preference / adverse effects] | Taper schedule: __ | Monitoring after discontinuation: __ | Patient education on deprescribing: Y/N | Deprescribing algorithm used: __"` | AGS Beers Criteria 2023; deprescribing.org Algorithms; STOPP/START Criteria v3; Choosing Wisely (ABIM Foundation) |
| Plan: Care Complexity Documentation | `"MDM level justified by: __ | Number of conditions managed: __ | Data reviewed/ordered: __ | Independent interpretation performed: Y/N | Risk of morbidity/mortality: __ | Time spent (if time-based): __ min | Care coordination time: __ min | Prolonged services applicable: Y/N"` | AMA CPT E/M Guidelines 2021; CMS MDM Table; CPT 99417 (Prolonged Services) |
| Plan: Transitions of Care Coordination | `"Discharge/transfer summary reviewed: Y/N | Medication reconciliation post-transition: Y/N | Follow-up appointments scheduled: __ | Pending results tracked: __ | Communication to PCP/specialists: __ | TCM code applicable (99495/99496): Y/N | Post-discharge call completed: Y/N"` | CMS Transitional Care Management (TCM); Joint Commission NPSG.02.03.01; ACP Care Transitions |
| Plan: Advance Care Planning & Goals of Care | `"Advance directive status: __ [on file / not on file / updated today] | Goals of care discussion: Y/N | Prognosis discussed: Y/N | Patient priorities: __ | Surrogate decision-maker: __ | POLST completed: Y/N | Hospice/palliative care discussed: Y/N | ACP billing (CPT 99497/99498): Y/N | Time spent: __ min"` | CMS ACP Billing (CPT 99497/99498); ACP Advance Care Planning Guidelines; POLST Paradigm |

---

### 3. Cardiology

**Scope:** Cardiology documentation requires precise characterization of cardiac anatomy, function, rhythm, and hemodynamics. These add-on items capture cardiac-specific history (NYHA functional class, anginal equivalents), diagnostic test interpretation (ECG, echocardiogram, stress testing, catheterization), validated risk scores (ASCVD, CHA2DS2-VASc, HAS-BLED), heart failure staging, arrhythmia classification, and medication optimization protocols unique to cardiovascular care.

**Add-On Count:** 20 items

| Item Label | Format Template | Source |
|---|---|---|
| Subjective: NYHA Functional Class Assessment | `"Current NYHA class: __ [I: no limitation / II: slight limitation / III: marked limitation / IV: symptoms at rest] | Change from prior: __ [improved / stable / worsened] | Specific limitations: __ | Orthopnea (pillows): __ | PND episodes: __ | Exercise tolerance (blocks/flights): __"` | NYHA Functional Classification (Criteria Committee, 1994); ACC/AHA 2022 Heart Failure Guidelines |
| Subjective: Chest Pain Characterization | `"Character: __ [pressure / squeezing / sharp / burning / tearing] | Location: __ | Radiation: __ [jaw / left arm / back / epigastric] | Duration: __ | Provocation: __ [exertion / rest / emotional / postprandial] | Relief: __ [rest / nitroglycerin / position change] | Associated symptoms: __ [diaphoresis / nausea / dyspnea] | Typicality: __ [typical / atypical / non-cardiac]"` | ACC/AHA 2021 Chest Pain Guidelines; Diamond-Forrester Classification; HEART Score Criteria |
| Subjective: Palpitation & Arrhythmia History | `"Palpitation character: __ [regular / irregular / rapid / skipped beats / pounding] | Onset type: __ [sudden / gradual] | Duration of episodes: __ | Frequency: __ per __ | Triggers: __ [caffeine / alcohol / exertion / stress / position] | Associated symptoms: __ [presyncope / syncope / dyspnea / chest pain] | Prior arrhythmia diagnosis: __ | Prior ablation/cardioversion: __"` | ACC/AHA/HRS 2023 SVT Guidelines; ACC/AHA 2014 Atrial Fibrillation Guidelines |
| Subjective: Syncope & Presyncope Workup | `"Number of episodes: __ | Prodrome: __ [Y/N, describe: __] | Activity at onset: __ | Duration of LOC: __ | Postictal state: Y/N | Injury from fall: Y/N | Witnesses: Y/N | Situational triggers: __ | Family history of sudden cardiac death: Y/N | Prior syncope evaluation: __"` | ESC 2018 Syncope Guidelines; ACC/AHA Syncope Evaluation |
| Objective: ECG Interpretation | `"Rate: __ bpm | Rhythm: __ [NSR / AFib / AFlutter / SVT / VT / paced / other: __] | Axis: __ [normal / LAD / RAD] | Intervals -- PR: __ ms | QRS: __ ms | QTc: __ ms | ST changes: __ [none / elevation in __ / depression in __] | T-wave changes: __ | Q waves: __ | Bundle branch block: __ [none / RBBB / LBBB / bifascicular] | LVH criteria: __ | Comparison to prior: __"` | AHA/ACC/HRS 2009 ECG Standardization; ACC/AHA STEMI/NSTEMI Guidelines |
| Objective: Echocardiogram Summary | `"LVEF: __% (method: __ [Simpson / visual / Teichholz]) | LV dimensions -- LVIDd: __ cm | LVIDs: __ cm | Wall motion: __ [normal / hypokinesis: __ | akinesis: __ | dyskinesis: __] | Diastolic function: __ [Grade I / II / III / indeterminate] | E/e' ratio: __ | LA volume index: __ mL/m2 | RV function: __ [TAPSE: __ mm] | Valvular findings: __ | Pericardial effusion: __ [none / trivial / small / moderate / large] | Estimated RVSP: __ mmHg"` | ASE 2015 Chamber Quantification Guidelines; ASE 2016 Diastolic Function Guidelines |
| Objective: Stress Test Results | `"Modality: __ [treadmill / pharmacologic: __] | Protocol: __ [Bruce / Modified Bruce / other: __] | Duration: __ min | METs achieved: __ | Peak HR: __ bpm (__% MPHR) | BP response: __ | Symptoms during test: __ | ECG changes: __ [none / ST depression __ mm in __ leads / ST elevation] | Duke Treadmill Score: __ | Nuclear/echo findings: __ | Reversible defects: __ | Fixed defects: __ | Interpretation: __ [negative / positive / equivocal / non-diagnostic]"` | ACC/AHA 2002 Exercise Testing Guidelines; ASNC Nuclear Cardiology Guidelines |
| Objective: Cardiac Catheterization Results | `"Access: __ [radial / femoral] | Coronary findings -- LM: __ | LAD: __ | LCx: __ | RCA: __ | Dominance: __ [right / left / co-dominant] | SYNTAX score: __ | Hemodynamics -- LVEDP: __ mmHg | PA pressures: __/__ (mean: __) | PCWP: __ mmHg | CO: __ L/min | CI: __ L/min/m2 | Intervention performed: __ [none / PCI to __ / CABG referral] | Complications: __"` | ACC/AHA/SCAI PCI Guidelines 2021; SYNTAX Score (Sianos et al.) |
| Objective: Cardiac Biomarker Trending | `"Troponin (type: __ [I / T / hs-cTnI / hs-cTnT]): __ | Trend: __ (time 0) -> __ (3h) -> __ (6h) | Delta: __ | BNP: __ pg/mL or NT-proBNP: __ pg/mL | Trend from prior: __ | CRP/hs-CRP: __ | Lipid panel -- TC: __ | LDL: __ | HDL: __ | TG: __ | Lp(a): __"` | ACC/AHA 2021 Chest Pain; ESC 2020 NSTE-ACS; ACC/AHA 2022 Heart Failure |
| Assessment: ASCVD Risk Calculation | `"10-year ASCVD risk: __% | Risk category: __ [low <5% / borderline 5-7.5% / intermediate 7.5-20% / high >=20%] | Risk enhancers present: __ [family hx / hs-CRP / Lp(a) / CAC / ABI / ethnicity-specific risk / metabolic syndrome] | CAC score (if obtained): __ Agatston units | Lifetime risk: __ | Statin benefit group: Y/N"` | ACC/AHA 2019 Primary Prevention Guidelines; Pooled Cohort Equations; MESA CAC Calculator |
| Assessment: Heart Failure Staging & Classification | `"ACC/AHA Stage: __ [A: at risk / B: pre-HF / C: symptomatic HF / D: advanced HF] | NYHA Class: __ [I / II / III / IV] | HF type: __ [HFrEF (EF <=40%) / HFmrEF (EF 41-49%) / HFpEF (EF >=50%)] | LVEF: __% | Volume status: __ [euvolemic / hypervolemic / hypovolemic] | Congestion score: __ | Perfusion status: __ [warm / cold] | Hemodynamic profile: __ [warm-dry / warm-wet / cold-dry / cold-wet]"` | ACC/AHA 2022 Heart Failure Guidelines; NYHA Classification; Stevenson Hemodynamic Profiles |
| Assessment: Arrhythmia Classification | `"Arrhythmia type: __ | Classification: __ [paroxysmal / persistent / long-standing persistent / permanent (for AF)] | Mechanism: __ [reentrant / focal / triggered] | Symptom severity: __ [EHRA class: I / IIa / IIb / III / IV] | Underlying substrate: __ | SCD risk assessment: Y/N | ICD indication: __"` | ACC/AHA/HRS 2014 AF Guidelines; HRS/EHRA/APHRS/LAHRS 2020 EP Consensus; ACC/AHA/HRS 2017 VA/SCD Guidelines |
| Assessment: Valvular Heart Disease Severity | `"Valve affected: __ | Pathology: __ [stenosis / regurgitation / mixed] | Severity: __ [mild / moderate / severe] | Hemodynamic parameters -- mean gradient: __ mmHg | valve area: __ cm2 | regurgitant volume: __ mL | EROA: __ cm2 | Symptoms attributable: Y/N | Intervention threshold met: Y/N | Surgical risk score (STS): __% | Valve intervention type indicated: __ [medical / surgical / TAVR / TMVR]"` | ACC/AHA 2020 Valvular Heart Disease Guidelines; ASE Valve Quantification; STS Risk Calculator |
| Plan: Cardiac Medication Optimization | `"GDMT for HF -- ACEi/ARB/ARNI: __ [drug, dose, target dose] | Beta-blocker: __ [drug, dose, target dose] | MRA: __ [drug, dose] | SGLT2i: __ [drug, dose] | Diuretic: __ [drug, dose] | Hydralazine/isosorbide (if indicated): __ | At GDMT targets: Y/N | Barriers to up-titration: __ | Up-titration plan: __ | Lipid therapy: __ [statin intensity / ezetimibe / PCSK9i / inclisiran] | Antiplatelet: __"` | ACC/AHA 2022 HF Guidelines (GDMT Algorithm); ACC/AHA 2018 Cholesterol Management; AHA/ACC Secondary Prevention |
| Plan: Anticoagulation Management | `"Indication: __ [AF / VTE / mechanical valve / LV thrombus / other: __] | CHA2DS2-VASc score: __ | HAS-BLED score: __ | Anticoagulant: __ [warfarin: INR goal __ | DOAC: __ dose __] | Renal dosing adjustment: Y/N | Drug interactions reviewed: Y/N | Bleeding history: __ | Fall risk assessment: __ | Bridging plan (if applicable): __ | Duration of therapy: __"` | CHA2DS2-VASc (Lip et al., 2010); HAS-BLED (Pisters et al., 2010); ACC/AHA 2014 AF; CHEST VTE Guidelines |
| Plan: Device Management (Pacemaker/ICD/CRT) | `"Device type: __ [PPM / ICD / CRT-D / CRT-P / LINQ / Watchman] | Manufacturer: __ | Implant date: __ | Last interrogation: __ | Battery status: __ [BOL / MOL / ERI / EOL] | Lead integrity: __ | Pacing percentage: A __% / V __% | Therapies delivered (ICD): __ [shocks: __ / ATP: __] | Programming changes: __ | Remote monitoring active: Y/N | Next follow-up: __"` | HRS 2023 Device Management Guidelines; ACC/AHA/HRS 2018 Bradycardia/CRT Guidelines |
| Plan: Cardiac Rehabilitation Referral | `"Cardiac rehab indicated: Y/N | Indication: __ [MI / CABG / PCI / stable angina / HF / valve surgery] | Phase: __ [I: inpatient / II: outpatient supervised / III: maintenance] | Sessions prescribed: __ | Exercise prescription: __ [target HR / METs / RPE] | Barriers to participation: __ | Referral placed: Y/N"` | AHA/ACC Cardiac Rehabilitation Performance Measures; CMS Cardiac Rehab Coverage (NCD 20.10) |
| Plan: Electrophysiology Referral & Workup | `"EP referral indication: __ [symptomatic arrhythmia / syncope / SCD risk / ablation candidacy / device evaluation] | Monitoring ordered: __ [Holter / event monitor / Zio patch / LINQ / telemetry] | Duration: __ | Prior EP study: Y/N | Ablation candidacy: __ | Antiarrhythmic drug: __ | Rate vs. rhythm control strategy: __"` | ACC/AHA/HRS AF Guidelines; HRS Consensus on Ablation; ACC Appropriate Use Criteria for EP |
| Plan: Cardiovascular Risk Factor Modification | `"BP target: <__/__ mmHg | Current: __/__ | Lipid target: LDL <__ mg/dL | Current: __ | HbA1c target: <__% | Current: __ | Smoking cessation: __ | Weight management: BMI __ -> goal __ | Exercise prescription: __ min/week | Dietary counseling: __ [DASH / Mediterranean / low sodium <__ mg/day] | Cardiac-specific goals: __"` | ACC/AHA 2019 CVD Prevention; AHA Life's Essential 8; DASH Diet (Appel et al.); Mediterranean Diet (Estruch et al.) |
| Plan: Pre-Procedural Cardiac Clearance | `"Procedure planned: __ | Surgical risk category: __ [low <1% / elevated >=1%] | RCRI (Lee) score: __/6 | Functional capacity: __ METs | Stress testing indicated: Y/N | Medication management -- Beta-blocker: __ [continue / initiate / hold] | Anticoagulant: __ [continue / hold __ days / bridge] | Antiplatelet: __ [continue / hold __ days / dual antiplatelet required until __] | Clearance: __ [cleared / conditional / not cleared]"` | ACC/AHA 2014 Perioperative Guidelines; Revised Cardiac Risk Index (Lee et al., 1999); ACC Appropriate Use Criteria |

---

### 4. Orthopedic Surgery

**Scope:** Orthopedic documentation demands precise characterization of musculoskeletal anatomy, injury mechanism, imaging interpretation, joint-specific physical examination findings, functional outcome measurement, and surgical planning details. These add-on items capture the elements that distinguish orthopedic encounters from general musculoskeletal assessments: fracture classification systems, joint instability testing, surgical approach planning, weight-bearing status, and return-to-activity criteria.

**Add-On Count:** 15 items

| Item Label | Format Template | Source |
|---|---|---|
| Subjective: Mechanism of Injury | `"Mechanism: __ [fall from __ height / MVA at __ mph / sports injury: __ / twisting / direct blow / overuse / atraumatic] | Date/time of injury: __ | Energy level: __ [low / high] | Position at time of injury: __ | Immediate symptoms: __ | Weight-bearing since injury: Y/N | Prior injury to same area: Y/N"` | ATLS 10th Edition; AO Foundation Trauma Classification; AAOS Clinical Practice Guidelines |
| Subjective: Functional Limitations & Activity Level | `"Pre-injury activity level: __ [sedentary / recreational / competitive athlete / manual labor] | Current functional limitations: __ | ADL impact: __ | Unable to perform: __ | Sport/activity: __ | Level of competition: __ | Dominant hand/side: __ | Occupational demands: __ [sedentary / light / medium / heavy / very heavy]"` | AAOS Functional Outcome Guidelines; DASH (Disabilities of Arm, Shoulder and Hand); LEFS (Lower Extremity Functional Scale) |
| Subjective: Prior Orthopedic Interventions | `"Previous surgeries on affected area: __ [procedure / date / surgeon] | Hardware in situ: Y/N | Type: __ | Prior injections: __ [corticosteroid / viscosupplementation / PRP / date / response] | Physical therapy history: __ [duration / response] | Bracing/orthotics tried: __ | Current weight-bearing status: __"` | AAOS Surgical History Documentation; AMA Guides (Prior Treatment Documentation) |
| Objective: Joint-Specific Examination | `"Joint examined: __ | Inspection: __ [swelling / ecchymosis / deformity / atrophy / erythema / surgical scars] | Palpation: __ [point tenderness at __ / effusion / warmth / crepitus] | ROM -- Active: flexion __deg / extension __deg / abduction __deg / rotation IR __deg ER __deg | Passive: flexion __deg / extension __deg | Compared to contralateral: __% of normal"` | AAOS Clinical Examination Standards; AMA Guides to Evaluation of Permanent Impairment, 6th Edition |
| Objective: Stability & Special Testing | `"Stability testing -- Ligament tested: __ | Test performed: __ | Grade: __ [I: mild / II: moderate / III: severe] | Endpoint: __ [firm / soft / absent] | Special tests performed: __ | Result: __ [positive / negative / equivocal] | Specific tests: __ [Lachman / anterior drawer / pivot shift / McMurray / varus-valgus / Thompson / Tinel / Phalen / impingement / apprehension / O'Brien / empty can / drop arm / other: __]"` | AAOS Physical Examination of the Musculoskeletal System; Magee Orthopedic Physical Assessment, 7th Edition |
| Objective: Imaging Interpretation | `"Modality: __ [X-ray / MRI / CT / ultrasound] | Views: __ | Findings: __ | Fracture: Y/N -- Location: __ | Pattern: __ [transverse / oblique / spiral / comminuted / segmental] | Displacement: __ mm | Angulation: __deg | Articular involvement: Y/N | Joint space: __ mm | Osteophytes: Y/N | Alignment: __ | Hardware position (if applicable): __ | MRI specific: __ [ligament / meniscus / tendon / cartilage / bone marrow edema]"` | AO Foundation Classification; ACR Appropriateness Criteria; AAOS Imaging Guidelines |
| Objective: Gait & Functional Mobility Assessment | `"Gait pattern: __ [normal / antalgic / Trendelenburg / steppage / circumduction / short-limbed / vaulting] | Assistive device: __ [none / cane / crutches / walker / wheelchair] | Weight-bearing status: __ [WBAT / TTWB / PWB __% / NWB] | Limb length discrepancy: __ cm | Functional mobility: __ [independent / supervision / contact guard / max assist]"` | AAOS Gait Analysis Standards; AMA Guides; Functional Independence Measure (FIM) |
| Assessment: Fracture Classification | `"Bone: __ | Fracture classification system: __ | AO/OTA classification: __ | Gustilo-Anderson (if open): __ [I / II / IIIA / IIIB / IIIC] | Salter-Harris (if pediatric): __ [I-V] | Neer (if proximal humerus): __ | Garden (if femoral neck): __ [I / II / III / IV] | Weber (if ankle): __ [A / B / C] | Stability: __ [stable / unstable] | Displacement: __ | Surgical indication: Y/N"` | AO/OTA Fracture and Dislocation Classification; Gustilo-Anderson Open Fracture Classification; AAOS Treatment Guidelines |
| Assessment: Joint Pathology Grading | `"Joint: __ | Pathology: __ [osteoarthritis / ligament tear / meniscal tear / labral tear / cartilage defect / tendinopathy / instability] | Grading -- OA: Kellgren-Lawrence __ [0-4] | Cartilage: Outerbridge __ [I-IV] or ICRS __ [0-4] | Ligament: __ [intact / partial / complete] | Meniscus: __ [type / zone: red-red / red-white / white-white] | Functional impact: __ | Chronicity: __ [acute / subacute / chronic]"` | Kellgren-Lawrence OA Grading; Outerbridge Cartilage Classification; ICRS Cartilage Injury Classification |
| Assessment: Surgical vs. Conservative Decision | `"Treatment decision: __ [operative / non-operative] | Clinical rationale: __ | Indications for surgery: __ | Relative contraindications: __ | Patient factors: __ [age / activity level / comorbidities / occupation / compliance likelihood] | Failed conservative treatment: Y/N | Duration of conservative trial: __ | Shared decision-making documented: Y/N | Patient preference: __"` | AAOS Clinical Practice Guidelines; AAOS Appropriate Use Criteria; AMA Informed Consent Standards |
| Assessment: Validated Outcome Score | `"Instrument used: __ [DASH / QuickDASH / LEFS / KOOS / HOOS / VAS / ODI / NDI / SF-36 / PROMIS / other: __] | Score: __ | Normative comparison: __ | Change from baseline: __ | MCID (minimal clinically important difference) met: Y/N | Patient-acceptable symptom state (PASS) met: Y/N"` | DASH (Hudak et al.); LEFS (Binkley); KOOS (Roos); HOOS (Nilsdotter); AAOS Outcome Measurement Standards |
| Plan: Surgical Planning | `"Procedure planned: __ | CPT: __ | Surgical approach: __ | Implant/hardware: __ [type / manufacturer / size] | Bone graft: Y/N | Patient positioning: __ | Anesthesia type: __ [general / regional / MAC / local] | Tourniquet: Y/N | Anticipated blood loss: __ | VTE prophylaxis plan: __ | Antibiotic prophylaxis: __ | Estimated OR time: __ min | Pre-op clearance status: __"` | AAOS Surgical Planning Standards; SCIP Measures; ACS NSQIP; AAOS VTE Prophylaxis CPG |
| Plan: Weight-Bearing & Activity Restrictions | `"Weight-bearing status: __ [NWB / TDWB / PWB __% / WBAT / FWB] | Duration: __ weeks | Immobilization: __ [cast / splint / brace / boot / sling / none] | Type: __ | Duration: __ | ROM restrictions: __ | Lifting restriction: __ lbs | Activity restrictions: __ | Driving restriction: __ | Work restriction: __ | Progression criteria: __"` | AAOS Post-Operative Protocols; AMA Guides Return to Work; ACSM Activity Restriction Guidelines |
| Plan: Rehabilitation Protocol | `"Rehab protocol: __ | Phase: __ [I: protection / II: controlled motion / III: strengthening / IV: return to activity] | PT/OT referral: Y/N | Frequency: __ x/week for __ weeks | Goals: __ [ROM / strength / function / sport-specific] | Home exercise program: Y/N | Expected milestones: __ | Expected duration to full recovery: __"` | AAOS Rehabilitation Protocols; APTA Clinical Practice Guidelines; Surgeon-Specific Protocols |
| Plan: Return to Activity / Sport Criteria | `"Return criteria -- ROM: __% of contralateral | Strength: __% of contralateral | Functional testing: __ [hop test / Y-balance / sport-specific drill] | Pain level: <__/10 | Physician clearance required: Y/N | Phased return plan: __ | Protective equipment: __ | Re-injury prevention program: Y/N | Expected return date: __"` | AAOS Return to Play Guidelines; Consensus Statement on Return to Sport (Ardern et al., 2016); ACL-RSI Score |

---

### 5. Neurology

**Scope:** Neurology documentation requires precise neuroanatomical localization, standardized neurological examination scales, and classification systems for stroke, seizure, headache, dementia, and movement disorders. These add-on items capture the detailed neurological history (seizure semiology, headache phenotyping, cognitive trajectory), structured neurological examination (NIHSS, cranial nerve mapping, motor/sensory distribution), disease-specific staging, and the unique management considerations of neurological disease including driving restrictions, seizure precautions, and neuroimaging protocols.

**Add-On Count:** 18 items

| Item Label | Format Template | Source |
|---|---|---|
| Subjective: Seizure History & Semiology | `"Seizure type: __ [focal aware / focal impaired awareness / focal to bilateral tonic-clonic / generalized onset: tonic-clonic / absence / myoclonic / atonic] | Aura: __ [Y/N, type: __] | Duration: __ | Frequency: __ per __ | Last seizure: __ | Triggers: __ [sleep deprivation / stress / alcohol / photic / catamenial] | Post-ictal state: __ [confusion __ min / Todd paralysis / amnesia] | Witnessed: Y/N | Tongue bite: Y/N | Incontinence: Y/N | Prior AED trials: __"` | ILAE 2017 Seizure Classification; AAN Practice Parameters for Epilepsy |
| Subjective: Headache Characterization (ICHD-3) | `"Headache type: __ [migraine without aura / migraine with aura / tension-type / cluster / other: __] | Location: __ | Character: __ [throbbing / pressing / stabbing / burning] | Intensity: __/10 | Duration: __ | Frequency: __ days/month | Aura features: __ [visual / sensory / speech / motor / duration: __] | Associated: __ [nausea / vomiting / photophobia / phonophobia / osmophobia / cranial autonomic features] | Triggers: __ | Medication overuse: Y/N (__days/month) | Disability: __ [MIDAS score: __ / HIT-6: __]"` | ICHD-3 (International Classification of Headache Disorders, 3rd Ed.); AAN Migraine Practice Guidelines; MIDAS (Stewart); HIT-6 |
| Subjective: Cognitive Complaint Characterization | `"Cognitive domains affected: __ [memory / language / executive / visuospatial / attention / praxis] | Onset: __ [gradual / stepwise / sudden] | Duration: __ | Progression rate: __ | Functional impact -- ADLs: __ | IADLs: __ | Driving: __ | Finances: __ | Informant corroboration: Y/N | Behavioral changes: __ | Sleep disturbance: __ | Hallucinations: Y/N | Wandering: Y/N | Family history of dementia: __"` | NIA-AA 2018 Alzheimer Framework; AAN Practice Parameter for Dementia; DSM-5-TR Neurocognitive Disorder Criteria |
| Subjective: Numbness/Weakness Pattern | `"Distribution: __ [dermatomal / peripheral nerve / polyneuropathy / hemibody / monoparesis / paraparesis / quadriparesis] | Onset: __ [acute / subacute / chronic] | Progression: __ [ascending / descending / stable / fluctuating] | Proximal vs. distal: __ | Symmetric vs. asymmetric: __ | Associated symptoms: __ [pain / paresthesias / bowel-bladder / respiratory] | Temporal pattern: __ | Preceding illness/event: __"` | AAN Neuromuscular Practice Guidelines; Preston & Shapiro Electromyography, 3rd Ed. |
| Subjective: Gait & Movement Disturbance | `"Gait change: __ [unsteady / shuffling / festinating / wide-based / spastic / magnetic / antalgic] | Onset: __ | Falls: __ per __ | Tremor: __ [rest / action / intention / postural] | Distribution: __ | Bradykinesia: Y/N | Rigidity: Y/N | Dystonia: Y/N | Chorea: Y/N | Balance difficulty: Y/N | Assistive device: __"` | MDS-UPDRS (Movement Disorder Society); Hoehn & Yahr Scale; AAN Movement Disorder Practice Parameters |
| Objective: Detailed Cranial Nerve Examination | `"CN I: olfaction __ | CN II: visual acuity __ | visual fields __ | fundoscopic __ [papilledema Y/N] | CN III/IV/VI: pupils __ [size, reactivity, RAPD] | EOM __ [full / limitation: __] | nystagmus __ [direction / type] | ptosis Y/N | CN V: facial sensation V1/V2/V3 __ | masseter strength __ | corneal reflex __ | CN VII: facial symmetry __ | forehead wrinkling __ | CN VIII: hearing __ | Weber __ | Rinne __ | CN IX/X: palate elevation __ | gag reflex __ | voice quality __ | CN XI: SCM/trapezius __ | CN XII: tongue __ [midline / deviation: __] | fasciculations Y/N"` | Campbell Neurological Examination (DeJong); AAN Neurological Examination Standards |
| Objective: Motor & Sensory Mapping | `"Motor -- MRC grading: __ [0-5 per muscle group] | Upper extremity: deltoid __/5 | biceps __/5 | triceps __/5 | wrist ext __/5 | grip __/5 | intrinsics __/5 | Lower extremity: iliopsoas __/5 | quads __/5 | hamstrings __/5 | tibialis anterior __/5 | gastrocnemius __/5 | EHL __/5 | Tone: __ [normal / increased / decreased / spastic / rigid] | Pronator drift: Y/N | Sensory -- Light touch: __ | Pinprick: __ | Vibration: __ | Proprioception: __ | Temperature: __ | Pattern: __ [dermatomal / stocking-glove / hemisensory / dissociated / level at __]"` | MRC Muscle Grading Scale; AAN Clinical Examination; CMS 1997 Neurological Exam |
| Objective: NIHSS (Stroke Assessment) | `"NIHSS total: __/42 | 1a-LOC: __ | 1b-LOC questions: __ | 1c-LOC commands: __ | 2-Best gaze: __ | 3-Visual fields: __ | 4-Facial palsy: __ | 5a-Motor arm L: __ | 5b-Motor arm R: __ | 6a-Motor leg L: __ | 6b-Motor leg R: __ | 7-Limb ataxia: __ | 8-Sensory: __ | 9-Best language: __ | 10-Dysarthria: __ | 11-Extinction/inattention: __ | Trend from prior: __ | Last known normal: __ [date/time]"` | NIHSS (Brott et al., 1989); AHA/ASA 2019 Acute Ischemic Stroke Guidelines |
| Objective: Cognitive Assessment Scores | `"MoCA score: __/30 (education adjustment: Y/N) | Domains impaired: __ [visuospatial-executive / naming / attention / language / abstraction / delayed recall / orientation] | MMSE score: __/30 (if used) | Clock draw: __ [normal / abnormal, score: __] | Category fluency (animals/1 min): __ | Trail Making A: __ sec | Trail Making B: __ sec | Cognitive trajectory: __ [stable / declining / improved]"` | MoCA (Nasreddine et al., 2005); MMSE (Folstein); AAN Dementia Practice Parameter |
| Objective: Deep Tendon Reflexes & Cerebellar Testing | `"DTRs -- Biceps: L __/4+ R __/4+ | Triceps: L __ R __ | Brachioradialis: L __ R __ | Patellar: L __ R __ | Achilles: L __ R __ | Plantar response: L __ [flexor / extensor (Babinski)] R __ | Hoffman sign: L __ R __ | Clonus: __ [beats] | Cerebellar -- Finger-to-nose: __ | Heel-to-shin: __ | Rapid alternating movements: __ | Rebound: __ | Romberg: __ [negative / positive] | Tandem gait: __"` | Campbell Neurological Examination; AAN Standards; MRC Reflex Grading (0-4+) |
| Assessment: Neurological Localization | `"Localization: __ [cortical / subcortical / brainstem / cerebellar / spinal cord (level: __) / nerve root (level: __) / plexus / peripheral nerve (__) / NMJ / muscle] | Laterality: __ [left / right / bilateral] | Vascular territory (if applicable): __ [ACA / MCA / PCA / basilar / watershed] | Supporting evidence: __ | Contradicting features: __"` | Brazis Localization in Clinical Neurology, 8th Ed.; Adams & Victor's Principles of Neurology |
| Assessment: Stroke Classification (TOAST) | `"Stroke type: __ [ischemic / hemorrhagic / TIA] | TOAST classification: __ [large artery atherosclerosis / cardioembolism / small vessel occlusion / other determined etiology: __ / undetermined] | Vascular territory: __ | Infarct size: __ [small / medium / large] | Hemorrhagic transformation: Y/N | Modified Rankin Scale: __/6 | ABCD2 score (if TIA): __/7"` | TOAST Classification (Adams et al., 1993); AHA/ASA Stroke Guidelines; Modified Rankin Scale; ABCD2 Score |
| Assessment: Seizure & Epilepsy Classification | `"ILAE seizure type: __ | Epilepsy type: __ [focal / generalized / combined / unknown] | Epilepsy syndrome (if identifiable): __ | Etiology: __ [structural / genetic / infectious / metabolic / immune / unknown] | EEG findings: __ | Drug-resistant epilepsy (failed >= 2 appropriate AEDs): Y/N | Surgical candidacy: __ | Seizure freedom duration: __"` | ILAE 2017 Classification of Seizures and Epilepsies; AAN/AES Practice Guidelines |
| Assessment: Neurodegenerative Disease Staging | `"Disease: __ | Staging system: __ | Stage: __ | Parkinson -- Hoehn & Yahr: __ [1-5] | MDS-UPDRS total: __ | Motor subscale: __ | Alzheimer -- CDR: __ [0 / 0.5 / 1 / 2 / 3] | GDS/FAST: __ | MS -- EDSS: __ [0-10] | Relapse rate: __ per year | ALS -- ALSFRS-R: __/48 | Vital capacity: __% predicted | Progression rate: __"` | Hoehn & Yahr Scale; CDR (Hughes et al.); EDSS (Kurtzke); ALSFRS-R (Cedarbaum); AAN Disease-Specific Guidelines |
| Plan: Neuroimaging Plan | `"Imaging ordered: __ [MRI brain / MRI spine / CT head / CTA head-neck / MRA / MRV / PET / SPECT] | Sequences: __ [DWI / FLAIR / SWI / T1 with contrast / MRS / perfusion / DTI] | Indication: __ | Contrast: Y/N | Sedation: Y/N | Prior imaging for comparison: __ | Urgency: __ [STAT / urgent / routine] | Follow-up imaging interval: __"` | ACR Appropriateness Criteria (Neuroimaging); AAN Neuroimaging Practice Parameters |
| Plan: EEG/EMG/NCS Ordering | `"Study ordered: __ [routine EEG / prolonged EEG / video-EEG / ambulatory EEG / EMG-NCS / SSEP / VEP / BAEP] | Indication: __ | Duration (if EEG): __ | Sleep deprived: Y/N | Medication hold: Y/N | Specific questions to answer: __ | Prior study results: __"` | AAN Practice Parameters for EEG/EMG; ACNS EEG Guidelines; AANEM Electrodiagnostic Guidelines |
| Plan: Neurological Medication Management | `"Current neurological medications: __ | Efficacy assessment: __ | Side effects: __ | Level (if applicable): __ [therapeutic range: __] | Dose adjustment: __ | New medication started: __ | Titration schedule: __ | Drug interaction check: __ | Pregnancy/teratogenicity counseling (if applicable): __ | Generic substitution restrictions: __"` | AAN Therapeutic Guidelines; Epilepsy prescribing per AAN/AES; AAN Headache Treatment Guidelines |
| Plan: Driving Restrictions & Safety Precautions | `"Driving restriction: Y/N | Reason: __ [seizure / syncope / cognitive impairment / visual field deficit / excessive somnolence] | State law seizure-free interval: __ months | Current seizure-free interval: __ | Cleared to drive: Y/N | Firearm safety counseling: __ | Fall precautions: __ | Seizure precautions: __ [water safety / height safety / supervision needs] | Medical alert bracelet recommended: Y/N | Work/activity restrictions: __"` | State-Specific Driving Laws for Epilepsy; AAN Driving and Epilepsy Practice Parameter; AAN Driving and Dementia Guideline |

---

### 6. Emergency Medicine

**Scope:** Emergency medicine documentation must capture the unique elements of ED encounters: pre-hospital information, triage acuity, time-critical decision-making, trauma activation criteria, validated risk stratification scores, critical care time documentation, and regulatory requirements (EMTALA). These add-on items layer onto the base H&P or SOAP framework to capture ED-specific data elements including toxicology screening, resuscitation documentation, and disposition decision-making that distinguish emergency encounters from scheduled clinical visits.

**Add-On Count:** 15 items

| Item Label | Format Template | Source |
|---|---|---|
| Subjective: Pre-Hospital / EMS Report | `"EMS agency: __ | Transport mode: __ [ground / air / private vehicle / walk-in] | Scene findings: __ | Field vitals: __ | Interventions in field: __ [IV access / intubation / medications / splinting / tourniquet / CPR / defibrillation] | Response to field treatment: __ | Transport time: __ min | Paramedic report: __"` | NEMSIS Data Standard v3.5; NAEMSP Prehospital Documentation Standards; ACEP Clinical Policy |
| Subjective: Mechanism of Injury (Trauma) | `"Mechanism: __ [MVC / fall / assault / GSW / stabbing / pedestrian struck / bicycle / crush / blast / burn / other: __] | Speed/height/distance: __ | Protective equipment: __ [seatbelt / helmet / airbag deployment / none] | Ejection: Y/N | Entrapment: Y/N | Fatalities at scene: Y/N | Loss of consciousness: Y/N | Duration: __ | GCS at scene: __/15 | Anticoagulant use: __"` | ATLS 10th Edition (ACS); CDC Field Triage Decision Scheme; ACEP Trauma Clinical Policy |
| Subjective: Last Known Normal / Symptom Onset (Stroke/Time-Critical) | `"Last known normal: __ [date/time] | Symptom onset: __ [date/time] | Time to ED arrival: __ min | Within thrombolytic window: Y/N | Within thrombectomy window (24h): Y/N | Witnessed onset: Y/N | Wake-up stroke: Y/N | Symptoms: __ | Baseline functional status (mRS): __"` | AHA/ASA 2019 Acute Ischemic Stroke Guidelines; AHA/ASA 2022 Stroke Time Windows |
| Subjective: Ingestion / Exposure Details (Toxicology) | `"Substance: __ | Amount: __ | Route: __ [oral / inhaled / dermal / IV / ocular] | Time of exposure: __ | Intentional vs. accidental: __ | Coingestants: __ | Suicide attempt: Y/N | Empty containers at scene: __ | Patient reliability of history: __ | Poison control contacted: Y/N | Case #: __"` | ACMT/AACT Position Statements; AAPCC Annual Report; Goldfrank's Toxicologic Emergencies |
| Objective: ESI Triage Level | `"ESI level: __ [1: immediate life-saving / 2: high risk or confused-lethargic-disoriented / 3: 2+ resources / 4: 1 resource / 5: 0 resources] | Triage vitals: __ | Triage chief complaint: __ | Triage nurse: __ | Triage time: __ | Time to physician: __ min | Acuity reassessment: __"` | Emergency Severity Index (ESI) v4 (Gilboy et al.); ACEP/ENA Triage Guidelines |
| Objective: Trauma Activation & FAST Exam | `"Trauma activation level: __ [Level I / Level II / trauma consult / not activated] | Activation criteria met: __ | Primary survey (ABCDE): A __ | B __ | C __ | D __ | E __ | FAST exam: __ [positive / negative / indeterminate] | RUQ: __ | LUQ: __ | Pelvis: __ | Pericardial: __ | E-FAST (thoracic): L __ R __ | GCS: E__V__M__ = __/15 | C-spine: __"` | ATLS 10th Edition; FAST Exam (Rozycki et al.); ACS Trauma Activation Criteria |
| Objective: Glasgow Coma Scale Trending | `"GCS at arrival: E__V__M__ = __/15 | GCS at reassessment (__ min): E__V__M__ = __/15 | GCS trend: __ [stable / improving / declining] | Best motor response: __ | Pupil reactivity: L __ mm (__) R __ mm (__) | GCS-Pupil score: __ | Intubated (verbal component): Y/N -- use GCS-T: __"` | GCS (Teasdale & Jennett, 1974); GCS-Pupils Score (Brennan et al., 2018); ATLS 10th Edition |
| Objective: Toxidrome Recognition | `"Toxidrome pattern: __ [sympathomimetic / anticholinergic / cholinergic / opioid / sedative-hypnotic / serotonin syndrome / NMS / none identified] | Pupils: __ | HR: __ | BP: __ | Temp: __ | Skin: __ [diaphoretic / dry / flushed] | Mental status: __ | Bowel sounds: __ | Reflexes: __ | Specific findings: __ | Antidote indicated: Y/N | Antidote given: __"` | Goldfrank's Toxicologic Emergencies; ACMT Clinical Guidelines; Toxidrome Classification (Olson) |
| Assessment: Sepsis Screening (qSOFA/SIRS) | `"SIRS criteria met (>=2): Y/N -- Temp >38C or <36C: Y/N | HR >90: Y/N | RR >20 or PaCO2 <32: Y/N | WBC >12K or <4K or >10% bands: Y/N | qSOFA (>=2): Y/N -- RR >=22: Y/N | Altered mentation: Y/N | SBP <=100: Y/N | Lactate: __ mmol/L | Suspected source: __ | Sepsis-3 criteria met: Y/N | Septic shock: Y/N | CMS SEP-1 bundle initiated: Y/N | Time zero: __"` | Sepsis-3 (Singer et al., 2016); qSOFA (Seymour et al.); CMS SEP-1 Core Measure; Surviving Sepsis Campaign 2021 |
| Assessment: Validated Risk Scores | `"HEART score (chest pain): __/10 [history __ | ECG __ | age __ | risk factors __ | troponin __] | Risk: __ [low 0-3 / moderate 4-6 / high 7-10] | Wells criteria (PE): __ | Clinical probability: __ [low / moderate / high] | CURB-65 (pneumonia): __/5 | Disposition: __ | PERC (PE rule-out): __ [all negative / not all negative] | Canadian C-spine rule: __ | Ottawa ankle/knee rules: __ | Other: __"` | HEART Score (Six et al., 2008); Wells Criteria (Wells et al., 2000); CURB-65 (Lim et al., 2003); PERC Rule (Kline et al.); Canadian C-Spine (Stiell) |
| Assessment: Trauma Classification & Injury Severity | `"Injury Severity Score (ISS): __ | Abbreviated Injury Scale (AIS) by region: Head __ | Face __ | Chest __ | Abdomen __ | Extremity __ | External __ | Trauma type: __ [blunt / penetrating / blast / burn] | Hemodynamic stability: __ | Blood products given: __ | Massive transfusion protocol: Y/N | Damage control surgery needed: Y/N"` | Injury Severity Score (Baker et al.); AIS (AAAM); ATLS 10th Edition; ACS TQIP |
| Assessment: Poisoning Severity Score | `"Poisoning Severity Score (PSS): __ [0: none / 1: minor / 2: moderate / 3: severe / 4: fatal] | Organ systems affected: __ | GI decontamination: __ [activated charcoal / whole bowel irrigation / gastric lavage / none / contraindicated] | Enhanced elimination: __ [hemodialysis / alkalinization / MDAC / none] | Antidote: __ | Observation period: __ hours | Psychiatric evaluation needed: Y/N"` | PSS (Persson et al., IPCS/EAPCCT); AACT/ACMT Decontamination Guidelines; Goldfrank's |
| Plan: Critical Care Time Documentation | `"Critical care time: __ min | Start time: __ | End time: __ | Activities: __ [hemodynamic monitoring / ventilator management / vasoactive titration / emergent procedure / active resuscitation] | Non-billable time excluded: __ [procedures with separate CPT / teaching / documentation] | Total qualifying time: __ min | CPT: __ [99291 first 30-74 min / 99292 each additional 30 min] | Attending physically present: Y/N"` | AMA CPT Critical Care (99291-99292); CMS Critical Care Documentation Requirements; ACEP Critical Care Billing Guidelines |
| Plan: Resuscitation Endpoints & Disposition | `"Resuscitation goals: __ | MAP target: >__ mmHg | Lactate clearance: __% per __ hours | UOP target: >__ mL/kg/hr | Fluid resuscitation total: __ mL | Vasopressors: __ [drug, dose, trend] | Blood products: __ | Disposition: __ [admit: ICU / step-down / telemetry / floor / observation | discharge | transfer | AMA | deceased] | Bed request time: __ | Admission time: __"` | Surviving Sepsis Campaign 2021; ATLS Resuscitation Endpoints; ACEP Boarding and Crowding Policy |
| Plan: EMTALA Compliance & Transfer Documentation | `"EMTALA medical screening exam completed: Y/N | Emergency medical condition identified: Y/N | Patient stabilized: Y/N | If transfer: __ | Reason for transfer: __ [higher level of care / specialty not available / patient request] | Risks of transfer discussed: Y/N | Benefits of transfer: __ | Accepting facility: __ | Accepting physician: __ | Transfer mode: __ | Patient consent for transfer: Y/N | EMTALA transfer certification signed: Y/N"` | EMTALA (42 USC 1395dd); CMS EMTALA Interpretive Guidelines; ACEP EMTALA Fact Sheet |

---

### 7. Pain Management

**Scope:** Pain management documentation requires meticulous characterization of pain (location, quality, temporal pattern, functional impact), opioid risk assessment, multimodal treatment planning, PDMP compliance, and interventional procedure documentation. These add-on items capture the specialized data elements required by CDC opioid prescribing guidelines, state regulatory requirements, and payer documentation standards. Pain management notes must demonstrate ongoing medical necessity, functional improvement, and appropriate risk mitigation for controlled substance prescribing.

**Add-On Count:** 15 items

| Item Label | Format Template | Source |
|---|---|---|
| Subjective: Comprehensive Pain Assessment | `"Pain location(s): __ | Quality: __ [aching / burning / stabbing / throbbing / shooting / electric / cramping / pressure / dull / sharp] | Intensity: current __/10 | average __/10 | worst __/10 | best __/10 | Onset: __ | Duration: __ | Pattern: __ [constant / intermittent / breakthrough] | Radiation: __ | Aggravating factors: __ | Alleviating factors: __ | Sleep impact: __ | PEG score: Pain __/10 | Enjoyment __/10 | General activity __/10"` | CDC Opioid Prescribing Guidelines 2022; PEG Scale (Krebs et al., 2009); IASP Pain Taxonomy |
| Subjective: Medication History & Opioid Use | `"Current pain medications: __ | Morphine milligram equivalent (MME) daily: __ | Duration of opioid therapy: __ | Prior opioid trials: __ | Non-opioid medications tried: __ | Adjuvant medications: __ | Medication effectiveness: __ | Side effects: __ | Adherence: __ | Early refill requests: Y/N | Lost/stolen prescriptions: Y/N | Obtaining from multiple providers: Y/N"` | CDC Opioid Prescribing Guidelines 2022; CMS Opioid Safety Measures; State Prescription Drug Monitoring Program Requirements |
| Subjective: Prior Interventional Procedures | `"Prior injections: __ [type / location / date / provider / response: __% relief / duration of relief: __] | Prior surgical interventions: __ | Spinal cord stimulator trial: Y/N | Intrathecal pump: Y/N | Radiofrequency ablation: Y/N | Physical therapy: __ [duration / response] | Chiropractic: __ | Acupuncture: __ | Other modalities tried: __"` | ASIPP Interventional Pain Management Guidelines 2023; APS/AAPM Opioid Guidelines |
| Subjective: Functional Impact Assessment | `"ADL limitations: __ | Work status: __ [full duty / modified duty / off work / disabled / retired] | Disability status: __ [none / short-term / long-term / SSDI / workers comp] | Social activities affected: __ | Relationship impact: __ | Psychological impact: __ [depression / anxiety / catastrophizing / fear avoidance] | Oswestry Disability Index: __% | Neck Disability Index: __% | Brief Pain Inventory interference score: __/70"` | Oswestry Disability Index (Fairbank); Neck Disability Index (Vernon); Brief Pain Inventory (Cleeland); IASP Functional Assessment |
| Subjective: Opioid Risk Factor Assessment | `"Personal history of substance use disorder: Y/N | Family history of SUD: Y/N | History of mental health disorder: Y/N | PTSD: Y/N | Age 16-45: Y/N | History of preadolescent sexual abuse: Y/N | ORT score: __ [low 0-3 / moderate 4-7 / high >=8] | SOAPP-R score: __ | Current aberrant behaviors: __ | Social stressors: __"` | Opioid Risk Tool (ORT, Webster & Webster, 2005); SOAPP-R (Butler et al.); CDC 2022 Guidelines Risk Assessment |
| Objective: Pain Diagram & Distribution | `"Pain diagram completed: Y/N | Primary pain region: __ | Secondary pain region(s): __ | Distribution pattern: __ [focal / regional / diffuse / dermatomal: __ / peripheral nerve: __ / referred] | Allodynia present: Y/N | Hyperalgesia present: Y/N | Myofascial trigger points: __ [location(s)] | Tender points (if fibromyalgia evaluation): __/18"` | IASP Pain Taxonomy; McGill Pain Diagram; ACR 2010 Fibromyalgia Diagnostic Criteria |
| Objective: PDMP Review & Urine Drug Screen | `"PDMP reviewed: Y/N | Date of review: __ | State: __ | Last fill date: __ | Prescribers in past 12 months: __ | Pharmacies used: __ | Controlled substances: __ | Concerning findings: __ [Y/N, specify: __] | Urine drug screen: __ [date: __] | Expected substances present: Y/N | Unexpected substances detected: __ | Prescribed substances absent: __ [explained: Y/N] | Confirmation testing ordered: Y/N"` | State PDMP Laws; CDC 2022 Opioid Guidelines (Recommendation 10); ASAM Drug Testing Guidelines |
| Objective: Functional Capacity Observation | `"Observed gait: __ | Sit-to-stand ability: __ | Bending/reaching: __ | Grip strength: __ | Consistency of exam with reported limitations: __ [consistent / inconsistent: __] | Waddell signs (non-organic): __/5 | Behavioral pain indicators: __ [guarding / bracing / rubbing / grimacing / sighing] | Observed functional capacity vs. reported: __"` | Waddell Non-Organic Signs (Waddell et al.); FCE Standards (Matheson); ACOEM Occupational Medicine Practice Guidelines |
| Objective: Trigger Point & Tender Point Mapping | `"Trigger points identified: Y/N | Locations: __ | Taut band palpable: Y/N | Referred pain pattern: __ [consistent with known patterns: Y/N] | Jump sign: Y/N | Tender points (fibromyalgia): __ sites of 18 | Widespread Pain Index (WPI): __/19 | Symptom Severity Scale (SSS): __/12 | Fibromyalgia criteria met: Y/N"` | Travell & Simons Myofascial Pain and Dysfunction; ACR 2010/2016 Fibromyalgia Criteria |
| Assessment: Pain Diagnosis Classification | `"Pain type: __ [nociceptive / neuropathic / nociplastic / mixed] | Nociceptive subtype: __ [somatic / visceral] | Neuropathic subtype: __ [central / peripheral] | Mechanism: __ | Chronicity: __ [acute <3 months / subacute 3-6 months / chronic >6 months] | ICD-10: __ | Pain generator identified: Y/N | Source: __ | Diagnostic certainty: __ [definite / probable / possible]"` | IASP Chronic Pain Classification (ICD-11); Treede et al. 2015 Neuropathic Pain Grading; AAPM Pain Taxonomy |
| Assessment: Opioid Risk Stratification & Monitoring Plan | `"Risk category: __ [low / moderate / high] | Basis: __ [ORT / SOAPP-R / clinical assessment] | Current aberrant behaviors: __ [none / specify: __] | Monitoring frequency: __ | UDS frequency: __ | PDMP check frequency: __ | Pill count required: Y/N | Provider visit frequency: __ | Naloxone prescribed: Y/N | Referral to addiction medicine: Y/N"` | CDC 2022 Opioid Guidelines; ASAM Appropriate Use of Drug Testing; HHS Opioid Prescribing Best Practices |
| Assessment: Treatment Response Assessment | `"Pain reduction: __% from baseline | Functional improvement: __ [specific activities restored] | Goal attainment: __ [met / partially met / not met] | 4 A's assessment -- Analgesia (pain relief): __ | Activities (function): __ | Adverse effects: __ | Aberrant behaviors: __ | Overall treatment response: __ [good / partial / poor / worsening] | Treatment modification needed: Y/N"` | 4 A's of Pain Management (Passik et al.); IMMPACT Outcome Measures; AAPM Treatment Response Criteria |
| Plan: Multimodal Pain Plan | `"Pharmacologic: __ [non-opioid analgesics / adjuvant medications / topical agents / opioid (if indicated): __] | Interventional: __ [injection type / procedure planned / frequency] | Rehabilitation: __ [PT / OT / aquatic therapy / functional restoration] | Behavioral: __ [CBT / mindfulness / biofeedback / pain psychology] | Complementary: __ [acupuncture / massage / yoga / TENS] | Self-management: __ [exercise program / pacing / sleep hygiene] | Treatment goals: __ | Timeline: __"` | CDC 2022 Opioid Guidelines; ASIPP 2023 Interventional Pain Guidelines; APS Multimodal Pain Management; VA/DoD Chronic Pain CPG |
| Plan: Opioid Agreement & PDMP Documentation | `"Opioid treatment agreement: __ [on file / updated / new / not applicable] | Patient understands risks: Y/N | Single prescriber agreement: Y/N | Single pharmacy: __ | UDS consent: Y/N | PDMP reviewed today: Y/N | State PDMP reporting compliant: Y/N | Naloxone co-prescribed (if MME >=50): Y/N | MME calculated today: __ | Dose change: __ [increased / decreased / stable / taper] | Justification for current dose: __"` | CDC 2022 Opioid Guidelines (Recommendations 2, 4, 5, 7, 8, 10); State Opioid Prescribing Laws; DEA Prescribing Requirements |
| Plan: Opioid Tapering Plan (If Applicable) | `"Taper indication: __ [patient request / lack of efficacy / adverse effects / aberrant behavior / risk outweighs benefit] | Current MME: __ | Taper rate: __ [5-10% per month / faster per clinical need: __] | Target MME: __ | Taper schedule: __ | Withdrawal monitoring: __ | Supportive medications: __ [clonidine / gabapentin / hydroxyzine / loperamide] | Behavioral support: __ | MAT referral: Y/N | Expected taper duration: __ | Follow-up interval during taper: __"` | HHS 2019 Guide for Clinicians on Appropriate Opioid Tapering; CDC 2022 Guidelines (Recommendation 5); VA/DoD Opioid Taper Guidelines |

---

### 8. PM&R / Physical Medicine & Rehabilitation

**Scope:** Physical Medicine and Rehabilitation (PM&R) documentation centers on functional status assessment, disability quantification, rehabilitation potential, and impairment rating. These add-on items capture the unique elements of rehabilitation medicine: functional independence measurement, spasticity grading, assistive device prescription, disability documentation for legal and insurance purposes, vocational assessment, and goal-oriented rehabilitation program design. PM&R documentation must satisfy requirements from multiple stakeholders including insurance carriers, disability systems, workers' compensation, and vocational rehabilitation.

**Add-On Count:** 15 items

| Item Label | Format Template | Source |
|---|---|---|
| Subjective: Functional History & Baseline | `"Pre-morbid functional status: __ [independent / modified independent / supervision / assist needed: __] | Current functional status: __ | Functional decline onset: __ | Mobility: __ [ambulation distance / stairs / transfers] | Self-care: __ [bathing / dressing / grooming / feeding / toileting] | Communication: __ | Cognition: __ | Community participation: __"` | WHO ICF Framework; FIM (Uniform Data System for Medical Rehabilitation); AMA Guides 6th Edition |
| Subjective: Disability Impact Assessment | `"Disability type: __ [physical / cognitive / communication / sensory / psychological] | Onset: __ [congenital / acquired: date __] | Cause: __ [injury / illness / surgical / progressive disease] | Body systems affected: __ | Activity limitations: __ | Participation restrictions: __ | Environmental barriers: __ | Personal factors: __ | Patient/family goals: __"` | WHO ICF Framework (Activity Limitations & Participation Restrictions); AMA Guides 6th Edition; ACRM Outcome Measurement |
| Subjective: Assistive Device & Equipment Needs | `"Current assistive devices: __ [wheelchair / walker / cane / AFO / prosthesis / communication device / other: __] | Device condition: __ | Device fitting: __ [adequate / needs adjustment] | New equipment needs: __ | Home modifications needed: __ [ramp / grab bars / stair lift / widened doorways] | Vehicle modifications: __ | Technology needs: __ [environmental controls / computer access]"` | CMS DME Coverage (HCPCS); ATP (Assistive Technology Professional) Standards; RESNA; Medicare LCD for DME |
| Subjective: Vocational Status & Work Assessment | `"Employment status: __ [employed / unemployed / modified duty / off work / disabled / student / retired] | Occupation: __ | Physical demands: __ [sedentary / light / medium / heavy / very heavy] | Job-specific tasks: __ | Work restrictions: __ | Lost work time: __ | Workers' compensation: Y/N | Vocational rehab referral: Y/N | Return to work goal: __ | Transferable skills: __"` | AMA Guides 6th Edition; DOL Dictionary of Occupational Titles; ACOEM Return to Work Guidelines |
| Objective: FIM / Functional Independence Scores | `"FIM total: __/126 | Motor subscale: __/91 | Cognitive subscale: __/35 | Self-care: __ [eating __ | grooming __ | bathing __ | dressing upper __ | dressing lower __ | toileting __] | Sphincter control: __ [bladder __ | bowel __] | Transfers: __ [bed/chair __ | toilet __ | tub/shower __] | Locomotion: __ [walk/wheelchair __ | stairs __] | Communication: __ [comprehension __ | expression __] | Social cognition: __ [social interaction __ | problem solving __ | memory __] | Admission FIM: __ | Current FIM: __ | Change: __"` | FIM (Uniform Data System for Medical Rehabilitation); CMS IRF-PAI Requirements; ACRM |
| Objective: Muscle Strength Grading (MRC Scale) | `"Grading system: MRC (Medical Research Council) 0-5 | Upper extremity -- Shoulder: flex __/5 | ext __/5 | abd __/5 | Elbow: flex __/5 | ext __/5 | Wrist: flex __/5 | ext __/5 | Grip: __/5 | Pinch: __/5 | Lower extremity -- Hip: flex __/5 | ext __/5 | abd __/5 | add __/5 | Knee: flex __/5 | ext __/5 | Ankle: DF __/5 | PF __/5 | Bilateral comparison: __ | Pattern: __ [proximal / distal / unilateral / bilateral]"` | MRC Muscle Grading Scale (Medical Research Council, 1943); AMA Guides 6th Edition Motor Assessment |
| Objective: Spasticity Assessment (Modified Ashworth) | `"Modified Ashworth Scale scores -- Muscle group: __ | Score: __ [0: no increase / 1: slight increase, catch-release / 1+: slight increase, minimal resistance / 2: more marked increase / 3: considerable increase / 4: rigid] | Distribution: __ [focal / regional / generalized] | Pattern: __ [flexor / extensor / mixed] | Functional impact: __ | Current spasticity treatment: __ [oral medications / botulinum toxin / baclofen pump / none] | Treatment response: __"` | Modified Ashworth Scale (Bohannon & Smith, 1987); AAN Spasticity Practice Parameter; ACRM Spasticity Management |
| Objective: Functional Mobility Assessment | `"Bed mobility: __ [independent / supervision / min assist / mod assist / max assist / dependent] | Transfers: __ [sit-to-stand / stand pivot / sliding board / mechanical lift] | Ambulation: __ [distance: __ ft | device: __ | assist level: __ | gait deviations: __] | Wheelchair mobility: __ [propulsion: independent / assist | distance: __] | Stairs: __ [up __ / down __ | with rail: Y/N] | Community mobility: __ | Balance: __ [Berg Balance Scale: __/56 | Timed Up and Go: __ sec | 6-Minute Walk Test: __ m]"` | Berg Balance Scale (Berg et al.); TUG (Podsiadlo & Richardson); 6MWT (ATS Standards); FIM Mobility Items |
| Assessment: WHO ICF Impairment Classification | `"ICF categories -- Body function impairments: __ [b-codes] | Body structure impairments: __ [s-codes] | Activity limitations: __ [d-codes] | Participation restrictions: __ [d-codes] | Environmental factors: __ [e-codes: barriers / facilitators] | Impairment severity: __ [mild / moderate / severe / complete] | Qualifier: __ [0-4]"` | WHO International Classification of Functioning, Disability and Health (ICF, 2001); AMA Guides 6th Edition (ICF Integration) |
| Assessment: Rehabilitation Potential | `"Rehab potential: __ [excellent / good / fair / guarded / poor] | Basis for assessment: __ | Prognostic factors -- Favorable: __ | Unfavorable: __ | Expected functional gains: __ | Expected timeline: __ | Prior functional trajectory: __ | Cognitive capacity for learning: __ | Motivation/engagement: __ | Social support: __ | Medical stability: __"` | ACRM Rehabilitation Outcome Guidelines; CMS IRF Coverage Criteria (60% Rule); APMR Prognosis Assessment |
| Assessment: Disability Duration Estimate | `"Diagnosis: __ | Expected disability duration: __ | Basis: __ [ODG / MDGuidelines / ACOEM / clinical judgment] | Factors affecting duration: __ | Aggravating comorbidities: __ | Maximum medical improvement (MMI) anticipated: __ | Permanent restrictions anticipated: Y/N | If Y: __ | Return to work prognosis: __ [full duty / modified duty / unable]"` | Official Disability Guidelines (ODG/MDGuidelines); ACOEM Duration Guidelines; AMA Guides 6th Edition |
| Assessment: Return-to-Work Readiness | `"Current work capacity: __ | Physical demands met: __ [sedentary / light / medium / heavy / very heavy] | Job-specific functional requirements: __ | Gaps between capacity and demand: __ | Accommodations recommended: __ | Transitional work plan: Y/N | Work simulation testing: Y/N | Work hardening/conditioning recommended: Y/N | Cleared for return: Y/N | Restrictions: __"` | ACOEM Return to Work Guidelines; ADA Reasonable Accommodation; AMA Guides 6th Edition Work Capacity |
| Plan: Rehabilitation Program Prescription | `"Rehab setting: __ [inpatient (IRF) / outpatient / home health / skilled nursing / LTAC / day program] | Therapy orders -- PT: __ x/week for __ weeks | OT: __ x/week for __ weeks | SLP: __ x/week for __ weeks | Recreation therapy: Y/N | Psychology: Y/N | Rehab goals (SMART): __ | Short-term goals (2 weeks): __ | Long-term goals (discharge): __ | Estimated length of stay: __ | Discharge disposition: __ | Supervision/assist level at discharge: __"` | CMS IRF Coverage Requirements; ACRM Rehabilitation Program Standards; CARF Accreditation Standards |
| Plan: DME Ordering & Justification | `"Equipment ordered: __ | HCPCS code: __ | Medical necessity: __ | Diagnosis supporting need: __ [ICD-10: __] | Functional limitation requiring device: __ | Expected functional benefit: __ | Trial period results (if applicable): __ | Patient training provided: Y/N | Certificate of Medical Necessity (CMN) completed: Y/N | Prior authorization: __ [required Y/N / obtained Y/N / PA #: __] | Supplier: __"` | CMS DME Coverage (42 CFR 414.202); HCPCS Level II; Medicare LCD for Wheelchairs/DME; RESNA Standards |
| Plan: Disability Documentation & Work Restrictions | `"Document type: __ [work status report / disability certificate / FCE referral / impairment rating / IME / return to work release] | Restrictions -- Lifting: __ lbs | Carrying: __ lbs | Sitting: __ hours | Standing: __ hours | Walking: __ hours/distance | Pushing/pulling: __ lbs | Climbing: Y/N | Bending: __ [frequency] | Overhead reaching: Y/N | Duration of restrictions: __ | Review date: __ | AMA Impairment rating (if applicable): __% WPI"` | AMA Guides to Evaluation of Permanent Impairment, 6th Edition; ACOEM; State Workers' Compensation Laws; SSDI/SSI Blue Book |

---

### 9. Pediatrics

**Scope:** Pediatric documentation requires age-specific elements absent from adult frameworks: growth charting, developmental milestone tracking, immunization scheduling, age-appropriate screening tools, birth history, feeding/nutrition assessment, anticipatory guidance, and family dynamics. These add-on items capture the dynamic, development-centered nature of pediatric encounters where the patient's normative state changes continuously with age. Includes considerations for tribal healthcare settings including access to tribal early intervention programs and culturally appropriate developmental assessment.

**Add-On Count:** 18 items

| Item Label | Format Template | Source |
|---|---|---|
| Subjective: Birth & Perinatal History | `"Gestational age at birth: __ weeks | Birth weight: __ g (__ lbs __ oz) | Delivery method: __ [SVD / C-section: indication __] | APGAR scores: 1 min __ / 5 min __ | NICU stay: Y/N [__ days, reason: __] | Prenatal complications: __ | Maternal substance exposure: __ | Newborn screening results: __ | Hearing screen: __ [pass / refer] | Congenital anomalies: __"` | AAP Neonatal Documentation Standards; AAP Bright Futures; CDC Newborn Screening |
| Subjective: Developmental Milestone Review | `"Age: __ | Gross motor: __ [milestone expected: __ | achieved: Y/N | age achieved: __] | Fine motor: __ [milestone expected: __ | achieved: Y/N] | Language/communication: __ [receptive: __ | expressive: __] | Social-emotional: __ | Cognitive/problem-solving: __ | Adaptive/self-help: __ | Developmental concerns: __ | Regression noted: Y/N | Screening tool administered: __ [ASQ-3 / PEDS / other] | Score: __"` | AAP Bright Futures; CDC Developmental Milestones (Learn the Signs. Act Early.); ASQ-3 (Squires & Bricker, 2009) |
| Subjective: Feeding & Nutrition Assessment | `"Feeding type: __ [breast / formula / combination / solid foods / table foods / tube fed] | If breastfeeding: frequency __ | latch quality: __ | supplementation: __ | If formula: type __ | volume __ oz per feeding | frequency __ | Solid food introduction: __ [age started / foods introduced] | Food allergies/intolerances: __ | Dietary restrictions: __ | Appetite: __ | Picky eating: Y/N | Vitamin D supplementation: Y/N | Iron supplementation: Y/N | WIC enrollment: Y/N | Access to traditional/cultural foods: __"` | AAP Bright Futures Nutrition; AAP Breastfeeding Policy; AAP Vitamin D Supplementation; WIC Guidelines |
| Subjective: School Performance & Learning | `"School/daycare: __ [name / grade / type] | Academic performance: __ | Learning concerns: __ | IEP/504 plan: Y/N [for: __] | Behavioral concerns at school: __ | Attendance issues: Y/N | Bullying: Y/N [victim / perpetrator] | Social relationships: __ | Screen time: __ hours/day | Homework habits: __ | Extracurricular activities: __ | Head Start/tribal early education enrollment: __"` | AAP Bright Futures; AAP PALSI School Readiness; IDEA (Individuals with Disabilities Education Act) |
| Subjective: Behavioral & Mental Health Concerns | `"Sleep -- Bedtime routine: __ | Sleep duration: __ hours | Night waking: __ | Co-sleeping: Y/N | Behavioral concerns: __ [tantrums / aggression / defiance / anxiety / depression / ADHD symptoms / ASD concerns] | Screen time: __ | Discipline methods: __ | ACE score (if screened): __/10 | Trauma exposure: __ | Parental mental health: __ | Family stressors: __ | Historical/intergenerational trauma acknowledged: __"` | AAP Bright Futures Mental Health; ACE Study (Felitti et al.); PSC (Pediatric Symptom Checklist); AAP ADHD Guidelines |
| Subjective: Family Dynamics & Social Environment | `"Household composition: __ | Primary caregiver(s): __ | Custody arrangement: __ | Family stability: __ | Sibling adjustment: __ | Childcare arrangement: __ | Financial security: __ | Food security: __ | Housing stability: __ | Community support: __ | Tribal community involvement: __ | Elder/extended family involvement: __ | Cultural identity development: __ | Safety -- Car seat/booster: Y/N | Helmet: Y/N | Firearm access: Y/N | Water safety: Y/N | Smoke detectors: Y/N"` | AAP Bright Futures (Anticipatory Guidance); AAP Safe Sleep; AAP Injury Prevention; AHC-HRSN Screening |
| Objective: Growth Chart Percentiles | `"Weight: __ kg (__ percentile, __ [WHO / CDC] chart) | Length/height: __ cm (__ percentile) | Weight-for-length/BMI: __ (__ percentile) | Head circumference (if <3 yr): __ cm (__ percentile) | Growth velocity: __ | Crossing percentile lines: Y/N [direction: __] | Growth chart: __ [WHO (0-2 yr) / CDC (2-20 yr)] | Mid-parental height: __ cm | Bone age (if obtained): __ | Growth trajectory: __ [tracking / falling off / accelerating]"` | WHO Growth Standards (0-2 yr); CDC Growth Charts (2-20 yr); AAP Bright Futures Growth Monitoring |
| Objective: Developmental Screening Results | `"Screening tool: __ | Age at screening: __ | ASQ-3 domains -- Communication: __ | Gross motor: __ | Fine motor: __ | Problem solving: __ | Personal-social: __ | Scores: __ [above cutoff / monitoring zone / below cutoff: referral needed] | M-CHAT-R/F (16-30 months): __ [low risk / medium risk / high risk] | Score: __/20 | Follow-up interview completed (if medium risk): Y/N | PHQ-A (if adolescent): __ | CRAFFT (if adolescent): __"` | ASQ-3 (Squires); M-CHAT-R/F (Robins et al., 2014); PHQ-A (Johnson); CRAFFT (Knight); AAP Screening Periodicity |
| Objective: Immunization Status & Schedule | `"Immunizations up to date: Y/N | Vaccines given today: __ | Vaccines due: __ | Vaccines overdue: __ | Catch-up schedule needed: Y/N | Contraindications: __ | Precautions: __ | VIS provided: Y/N | Consent obtained: Y/N | Lot #: __ | Site: __ | Route: __ | Administered by: __ | VFC eligible: Y/N | Vaccine refusal: Y/N [reason: __ | risks discussed: Y/N | signed declination: Y/N]"` | CDC ACIP Immunization Schedule (Child/Adolescent); VFC Program; AAP Immunization Policy; State Immunization Requirements |
| Objective: Tanner Staging (Pubertal Assessment) | `"Tanner stage -- Breast (female): __ [I-V] | Pubic hair: __ [I-V] | Genital (male): __ [I-V] | Testicular volume (if male): __ mL | Menarche: Y/N [age: __] | Age-appropriate: Y/N | Precocious puberty concern: Y/N [female <8 yr / male <9 yr] | Delayed puberty concern: Y/N [female no breast development by 13 / male no testicular enlargement by 14] | Growth spurt assessment: __"` | Tanner Staging (Marshall & Tanner, 1969-1970); AAP Puberty Assessment; Pediatric Endocrine Society |
| Objective: Age-Appropriate Screening Results | `"Vision screening: __ [method: __ | result: pass / refer | age: __] | Hearing screening: __ [method: __ | result: pass / refer] | Lead screening: __ [level: __ mcg/dL | elevated: Y/N] | Anemia screening (Hgb): __ | Lipid screening: __ | TB screening (if indicated): __ | STI screening (if adolescent): __ | Dental assessment: __ | Fluoride varnish applied: Y/N | Scoliosis screening: __"` | AAP Bright Futures Periodicity Schedule; USPSTF Pediatric Screening Recommendations; CDC Lead Screening Guidelines; AAP Lipid Screening |
| Assessment: Growth Trajectory Assessment | `"Growth assessment: __ [normal / failure to thrive / obesity / short stature / tall stature / macrocephaly / microcephaly] | Weight-for-age trend: __ | Length/height-for-age trend: __ | BMI trend: __ | Head circumference trend (if <3 yr): __ | Percentile crossing: Y/N [description: __] | Nutritional status: __ | Etiology if abnormal: __ [constitutional / familial / pathologic: __] | Workup indicated: Y/N"` | CDC/WHO Growth Chart Interpretation; AAP Failure to Thrive Guidelines; AAP Obesity Prevention/Treatment; Pediatric Endocrine Society |
| Assessment: Developmental Assessment & Diagnosis | `"Developmental status: __ [age-appropriate / delay: __ domain(s) / advanced: __ domain(s)] | Severity of delay: __ [mild / moderate / severe] | Global vs. isolated delay: __ | Autism spectrum screening: __ [negative / positive / indeterminate] | ADHD evaluation: __ [criteria met Y/N | type: inattentive / hyperactive / combined] | Learning disability suspected: Y/N | Intellectual disability evaluation: Y/N | Diagnostic certainty: __ | Etiology identified: Y/N"` | DSM-5-TR Neurodevelopmental Disorders; AAP ASD Screening/Diagnosis; AAP ADHD Guidelines; IDEA Disability Categories |
| Assessment: Behavioral & Psychosocial Diagnosis | `"Behavioral diagnosis: __ | ICD-10: __ | Contributing factors: __ [biological / psychological / social / cultural] | ACE score impact: __ | Protective factors: __ [family support / cultural connection / resilience / community] | Safety assessment: __ | Mandatory reporting consideration: __ [abuse/neglect concern: Y/N | reported: Y/N | to: __] | Behavioral health integration: Y/N"` | DSM-5-TR; AAP Mental Health Competencies; ACE Study Framework; State Mandatory Reporting Laws |
| Plan: Immunization Catch-Up Plan | `"Vaccines needed for catch-up: __ | Minimum intervals: __ | Accelerated schedule: Y/N | Doses remaining: __ | Next visit vaccine plan: __ | Barriers to immunization: __ | Parent education provided: __ | VFC enrollment: Y/N | School entry requirements: __ | Travel vaccines needed: Y/N | Tribal/IHS immunization program coordination: __"` | CDC ACIP Catch-Up Immunization Schedule; CDC Immunization Scheduling Tool; VFC Program Guidelines |
| Plan: Developmental Referrals | `"Early intervention (0-3 yr) referral: Y/N | IDEA Part C: Y/N | IDEA Part B (3-21 yr): Y/N | Developmental pediatrician referral: Y/N | Speech-language pathology: Y/N | Occupational therapy: Y/N | Physical therapy: Y/N | ABA therapy (ASD): Y/N | Psychology/neuropsychology: Y/N | Audiology: Y/N | Genetics: Y/N | Tribal early intervention program: Y/N | IEP/504 recommendation: Y/N | Timeline: __"` | IDEA Parts B & C; AAP Early Intervention Policy; AAP ASD Management; State Early Intervention Programs |
| Plan: Anticipatory Guidance (Bright Futures) | `"Age-appropriate guidance provided -- Safety: __ | Nutrition: __ | Physical activity: __ | Screen time: __ [AAP: <18 mo none / 18-24 mo limited / 2-5 yr <1 hr / 6+ consistent limits] | Sleep: __ [recommended hours: __] | Oral health: __ | Social-emotional: __ | Sexuality/puberty (if age-appropriate): __ | Substance use prevention (if adolescent): __ | Mental health: __ | Cultural identity and resilience: __ | Handout provided: Y/N"` | AAP Bright Futures Anticipatory Guidance (4th Edition); AAP Screen Time Guidelines; AAP Sleep Recommendations |
| Plan: Well-Child Visit Schedule & Tracking | `"Next well-child visit: __ | Age at next visit: __ | Screenings due at next visit: __ | Immunizations due at next visit: __ | Pending referral follow-up: __ | Outstanding lab results: __ | Growth monitoring interval: __ | Developmental surveillance plan: __ | AAP periodicity schedule adherence: Y/N | Missed visits: __ | Outreach plan for missed visits: __"` | AAP Bright Futures Periodicity Schedule; AAP Well-Child Visit Standards; CMS EPSDT (Medicaid) |

---

### 10. Psychiatry

**Scope:** Psychiatric documentation within a medical setting focuses on psychopharmacology management, structured diagnostic assessment using DSM-5-TR criteria, validated screening instruments (PHQ-9, GAD-7, C-SSRS, AIMS), suicide risk stratification, capacity evaluation, and safety planning. These add-on items capture the psychiatric-specific data elements that layer onto a standard medical note when psychiatric care is delivered: formal mental status examination, medication response tracking, metabolic monitoring for antipsychotics, and involuntary treatment criteria. Includes considerations for historical trauma in tribal populations and integration with traditional healing practices.

**Add-On Count:** 15 items

| Item Label | Format Template | Source |
|---|---|---|
| Subjective: Psychiatric History | `"Psychiatric diagnoses (current): __ | Psychiatric diagnoses (past): __ | Age of onset: __ | Hospitalizations: __ [number / most recent: date / reason / duration / voluntary vs. involuntary] | Suicide attempts: __ [number / most recent: date / method / lethality / medical treatment] | Self-harm history: Y/N | Psychiatric medication history: __ [medication / dose / duration / response / reason for discontinuation / side effects] | ECT/TMS/ketamine/esketamine history: Y/N | Prior therapy: __ [type / duration / response]"` | APA Practice Guidelines; DSM-5-TR Diagnostic Assessment; Joint Commission Behavioral Health Standards |
| Subjective: Medication Response & Side Effects | `"Current psychiatric medications: __ | Each medication -- Name: __ | Dose: __ | Duration: __ | Adherence: __ | Efficacy: __ [significant improvement / some improvement / no change / worsening] | Side effects: __ [weight gain / sedation / sexual dysfunction / EPS / akathisia / metabolic / GI / other: __] | Patient satisfaction with medication: __ | Barriers to adherence: __ [cost / side effects / stigma / forgetfulness / lack of perceived benefit]"` | APA Psychopharmacology Guidelines; FDA Drug Safety Communications; AIMS; UKU Side Effect Rating Scale |
| Subjective: Substance Use Assessment | `"Alcohol: __ | AUDIT score: __/40 | CAGE-AID: __/4 | Tobacco: __ | Cannabis: __ | Opioids: __ | Stimulants: __ | Sedatives: __ | Other substances: __ | IV drug use: Y/N | Age of first use: __ | Longest period of sobriety: __ | Current sobriety: __ | Treatment history: __ [detox / inpatient / outpatient / MAT / 12-step / other: __] | Withdrawal risk: __ | CIWA/COWS score (if applicable): __"` | AUDIT (Saunders et al.); CAGE-AID; ASAM Criteria for Addiction Treatment; DSM-5-TR Substance Use Disorders |
| Subjective: Trauma & Stressor History | `"Trauma history: __ [childhood / adult / both] | Types: __ [physical / sexual / emotional abuse / neglect / DV / combat / accident / natural disaster / community violence / historical/intergenerational trauma] | PTSD symptoms: __ [re-experiencing / avoidance / negative cognitions / hyperarousal] | PCL-5 score (if administered): __/80 | Trauma treatment history: __ | ACE score: __/10 | Cultural trauma context (tribal): __ [boarding school legacy / forced relocation / cultural disruption / loss of language] | Resilience factors: __"` | PCL-5 (Weathers et al.); ACE Study (Felitti); DSM-5-TR PTSD Criteria; Brave Heart Historical Trauma Model; SAMHSA Trauma-Informed Care |
| Subjective: Suicidal & Homicidal Ideation Screen | `"Suicidal ideation: __ [none / passive / active without plan / active with plan / active with plan and intent] | Frequency: __ | Duration: __ | Last episode: __ | Means access: __ [firearms: Y/N | medications: Y/N | other: __] | Protective factors: __ [reasons for living / social support / children / religious beliefs / cultural values / fear of death] | Homicidal ideation: __ [none / passive / active / specific target: __] | Recent losses/stressors: __ | Hopelessness: __"` | Columbia C-SSRS (Posner et al.); APA Suicide Risk Assessment; Joint Commission NPSG.15.01.01; Zero Suicide Framework |
| Objective: Formal Mental Status Examination | `"Appearance: __ [grooming / hygiene / dress / age-appearance / distinguishing features] | Behavior: __ [psychomotor: normal / agitated / retarded / catatonic | eye contact: __ | cooperation: __] | Speech: __ [rate / rhythm / volume / tone / latency / spontaneity] | Mood (patient's words): __ | Affect: __ [quality: __ / range: full / constricted / flat / labile / incongruent | congruence with mood: __] | Thought process: __ [linear / circumstantial / tangential / loose / flight of ideas / perseverative / thought blocking] | Thought content: __ [SI/HI: __ / delusions: __ / obsessions: __ / phobias: __] | Perceptions: __ [hallucinations: AH / VH / tactile / olfactory / none | illusions: __] | Cognition: __ [orientation: __ / attention: __ / memory: __] | Insight: __ [good / fair / poor / absent] | Judgment: __ [good / fair / poor / impaired]"` | DSM-5-TR Mental Status Examination; APA Practice Guidelines; Kaplan & Sadock's Clinical Psychiatry |
| Objective: PHQ-9 & GAD-7 Scores | `"PHQ-9 total: __/27 | Severity: __ [0-4 minimal / 5-9 mild / 10-14 moderate / 15-19 moderately severe / 20-27 severe] | Item 9 (SI): __ [0 / 1 / 2 / 3] | Trend: __ [improving / stable / worsening] | Prior scores: __ | GAD-7 total: __/21 | Severity: __ [0-4 minimal / 5-9 mild / 10-14 moderate / 15-21 severe] | Trend: __ | Treatment response: __ [>=50% reduction = response / <5 = remission]"` | PHQ-9 (Kroenke, Spitzer & Williams, 2001); GAD-7 (Spitzer, Kroenke, Williams & Lowe, 2006); APA Measurement-Based Care |
| Objective: Columbia Suicide Severity Rating Scale (C-SSRS) | `"C-SSRS -- Wish to be dead: Y/N | Non-specific active SI: Y/N | Active SI with any methods: Y/N | Active SI with some intent: Y/N | Active SI with specific plan and intent: Y/N | Severity rating: __/5 | Intensity of ideation: __ [frequency / duration / controllability / deterrents / reasons] | Suicidal behavior: __ [actual attempt / interrupted / aborted / preparatory] | Self-injurious behavior without suicidal intent: Y/N | Risk level: __ [low / moderate / high / imminent]"` | C-SSRS (Posner et al., 2011); FDA Guidance on Suicidality Assessment; Joint Commission NPSG.15.01.01 |
| Objective: AIMS (Abnormal Involuntary Movement Scale) | `"AIMS administered: Y/N | Indication: __ [antipsychotic use >__ months] | Facial/oral -- Muscles of expression: __ [0-4] | Lips/perioral: __ [0-4] | Jaw: __ [0-4] | Tongue: __ [0-4] | Extremity -- Upper: __ [0-4] | Lower: __ [0-4] | Trunk movements: __ [0-4] | Global judgments -- Severity: __ [0-4] | Incapacitation: __ [0-4] | Patient awareness: __ [0-4] | Dental status: __ | Total score: __ | Trend from prior: __ | Tardive dyskinesia diagnosis: Y/N"` | AIMS (Guy, 1976); APA Tardive Dyskinesia Guidelines; AAN Tardive Syndrome Practice Parameter |
| Objective: Cognitive Screening (Psychiatric Context) | `"Screening tool: __ [MoCA / MMSE / SLUMS / Mini-Cog] | Score: __ | Impaired: Y/N | Domains affected: __ | Baseline comparison: __ | Contributing factors: __ [medication effects / substance use / depression pseudodementia / primary cognitive disorder / delirium] | Formal neuropsych testing indicated: Y/N | Capacity concerns: Y/N"` | MoCA (Nasreddine); SLUMS (Tariq et al.); APA Neurocognitive Assessment Guidelines |
| Assessment: DSM-5-TR Diagnostic Formulation | `"Primary diagnosis: __ | DSM-5-TR criteria met: __ [list key criteria] | ICD-10: __ | Specifiers: __ [severity / course / features] | Comorbid diagnoses: __ | Rule-out diagnoses: __ | Differential considerations: __ | Biopsychosocial formulation -- Biological: __ | Psychological: __ | Social: __ | Cultural: __ [cultural formulation interview completed: Y/N] | Developmental factors: __"` | DSM-5-TR Diagnostic Criteria; APA Practice Guidelines; DSM-5-TR Cultural Formulation Interview |
| Assessment: Suicide Risk Stratification | `"Risk level: __ [low / moderate / high / imminent] | Static risk factors: __ [prior attempts / family history / demographic / access to means] | Dynamic risk factors: __ [current SI / hopelessness / substance use / recent losses / insomnia / agitation / psychic pain] | Protective factors: __ [reasons for living / social support / cultural/spiritual beliefs / treatment engagement / coping skills / children] | Risk-benefit analysis of current treatment plan: __ | Documentation of clinical reasoning: __"` | APA Suicide Risk Assessment (2024); Columbia Protocol; Joiner Interpersonal Theory of Suicide; Zero Suicide Model |
| Assessment: Capacity Assessment (If Indicated) | `"Capacity evaluation performed: Y/N | Decision in question: __ | Four elements -- Understanding: __ [can explain condition and treatment] | Appreciation: __ [can apply information to self] | Reasoning: __ [can weigh risks and benefits] | Expressing a choice: __ [can communicate consistent decision] | Capacity determination: __ [has capacity / lacks capacity for this specific decision] | Contributing factors to incapacity (if applicable): __ | Surrogate decision-maker identified: Y/N"` | Appelbaum & Grisso Four Abilities Model; APA Resource Document on Capacity; State Consent Laws |
| Plan: Psychopharmacology Plan | `"Medication changes -- New: __ [drug / dose / titration schedule / target dose] | Dose adjustment: __ [drug / old dose / new dose / reason] | Discontinued: __ [drug / reason / taper schedule] | Continued unchanged: __ | Monitoring -- Labs ordered: __ [metabolic panel / lipids / HbA1c / prolactin / lithium level / valproic acid level / CBC / TSH / renal function] | ECG indicated: Y/N | Weight monitoring: __ | Metabolic monitoring (antipsychotics): __ [ADA/APA consensus frequency] | Clozapine monitoring (if applicable): __ [ANC: __] | Pregnancy test: Y/N | Black box warnings discussed: Y/N"` | APA Practice Guidelines; ADA/APA Metabolic Monitoring Consensus 2004; FDA Black Box Warnings; Clozapine REMS |
| Plan: Safety Plan & Crisis Resources | `"Stanley-Brown Safety Plan completed: Y/N | Updated: Y/N | Elements -- 1. Warning signs: __ | 2. Internal coping strategies: __ | 3. Social contacts for distraction: __ | 4. Professional/agency contacts: __ | 5. Means restriction: __ [firearms secured/removed: __ | medications secured: __ | other lethal means addressed: __] | 6. Reasons for living: __ | 988 Suicide and Crisis Lifeline discussed: Y/N | Tribal crisis resources: __ | Indian Health Service behavioral health contact: __ | Traditional healer/cultural support: __ | Follow-up within __ hours/days | Involuntary hold criteria reviewed: Y/N | State hold criteria: __"` | Stanley & Brown Safety Planning Intervention (2012); 988 Lifeline; Joint Commission NPSG.15.01.01; State Involuntary Commitment Laws; IHS Behavioral Health Services |

---

### Appendix: Add-On Integration Guide

**How Specialty Add-Ons Merge with Base Frameworks:**

1. **Subjective add-ons** insert after the base Subjective section items (after ROS/Social History in H&P, after HPI/SDOH in SOAP).
2. **Objective add-ons** insert after the base physical examination/vitals items.
3. **Assessment add-ons** insert after base diagnosis/differential items but before Medical Necessity.
4. **Plan add-ons** insert after base treatment/referral items but before Medical Necessity/Billing.
5. **Multiple specialties may be selected** -- add-ons are cumulative and non-duplicative. If an item appears in both the base template and a specialty add-on, the specialty-specific version (with greater detail) takes precedence.
6. **Item count range per encounter**: Base framework (25-50 items) + Specialty add-on (12-20 items) = Total 37-70 items per specialty encounter.

---

## EVIDENCE SOURCES MASTER LIST

This master list contains all evidence sources referenced across the OmniScribe Medical Documentation Frameworks document (Parts 1-4). Sources are organized by category and listed alphabetically within each category. Where applicable, specific document titles, publication years, regulatory citations, and validation references are included.

---

### 1. Regulatory and Legal Sources

| Source | Full Citation / Description | Referenced In |
|---|---|---|
| 21 CFR 1306 | DEA Regulations for Prescribing Controlled Substances | Part 4 (Medication Reconciliation) |
| 25 USC 1616 | Community Health Representative Authorization (Indian Health Care Improvement Act) | Part 4 (Tribal/IHS) |
| 42 CFR 136 | Eligibility for Services Through Indian Health Service Programs | Parts 1, 2, 3, 4 |
| 42 CFR 136.23 | Purchased/Referred Care (PRC) Eligibility and Priorities | Parts 2, 4 |
| 42 CFR 410.15 | Medicare Annual Wellness Visit Requirements | Part 1 (AWV subtype) |
| 42 CFR 410.32 | Medical Necessity Requirements for Diagnostic Tests and Services | Parts 1, 2 |
| 42 CFR 410.78 | CMS Telehealth Services Conditions for Payment | Part 4 (Telehealth) |
| 42 CFR 411.408 | Advance Beneficiary Notice (ABN) Requirements | Part 1 |
| 42 CFR 414.510 | CMS Chronic Care Management (CCM) Service Requirements | Part 1 (CCM subtype) |
| 42 CFR 482-485 | CMS Conditions of Participation for Hospitals and Facilities | Parts 2, 4 |
| 42 CFR 482.42 | CMS Infection Control Conditions of Participation | Part 4 (Infection Control) |
| 42 CFR 482.43 | CMS Discharge Planning Conditions of Participation | Part 2 |
| 42 CFR 489.102 | CMS Advance Directive Requirements (Conditions of Participation) | Parts 2, 4 |
| 42 CFR 493 | CMS CLIA Regulations for Laboratory Testing | Part 1 (POC testing) |
| 42 USC 1395dd | EMTALA -- Emergency Medical Treatment and Labor Act | Parts 1, 2 |
| ACA Section 4103 | Affordable Care Act -- Annual Wellness Visit and Personalized Prevention Plan | Part 1 (AWV subtype) |
| CMS-R-131 | CMS Advance Beneficiary Notice Form | Part 1 |
| CMS-R-193 | CMS Inpatient Admission Order Requirements | Part 2 |
| CMS 1995 Documentation Guidelines | CMS Documentation Guidelines for Evaluation and Management Services (1995) | Parts 1, 2, 3 |
| CMS 1997 Documentation Guidelines | CMS Documentation Guidelines for Evaluation and Management Services (1997) -- HPI elements, ROS systems, single-organ and multi-system exam requirements | Parts 1, 2, 3, 4 |
| CMS AWV Requirements | Medicare Annual Wellness Visit Documentation and Billing Requirements | Part 1 |
| CMS Care Plan Documentation | CMS Requirements for Care Plan Documentation in CCM and Transitional Care | Part 1 |
| CMS CCM Final Rule | CMS Final Rule on Chronic Care Management Services Billing and Documentation | Part 1 |
| CMS Claims Processing Manual | CMS Manual for Claims Processing Including Telehealth Billing Codes | Part 4 (Telehealth) |
| CMS COVID-19 Survey Requirements | CMS Infection Control Requirements During COVID-19 | Part 4 (Infection Control) |
| CMS E/M Scoring Table | CMS Evaluation and Management Scoring and Leveling Reference | Parts 1, 2 |
| CMS HAI Reporting Requirements | CMS Healthcare-Associated Infection Reporting | Part 4 (Infection Control) |
| CMS HCC Risk Adjustment | CMS Hierarchical Condition Category Risk Adjustment Model | Parts 1, 2 |
| CMS Health Equity Framework | CMS Framework for Health Equity | Parts 1, 4 |
| CMS Immunization Coverage | CMS Coverage Determination for Immunization Services | Parts 1, 4 |
| CMS Inpatient Admission Criteria | CMS Criteria for Inpatient vs. Observation Admission | Part 2 |
| CMS Language Access Requirements | CMS Requirements for Language Access Services | Parts 3, 4 |
| CMS LCD/NCD Coverage Determinations | CMS Local/National Coverage Determinations for Medical Necessity | Parts 1, 2, 3 |
| CMS Meaningful Measures Framework | CMS Framework for Quality Measures and Outcomes | Part 1 |
| CMS Medication Reconciliation Standards | CMS Requirements for Medication Reconciliation at Transitions of Care | Parts 1, 4 |
| CMS MIPS Quality Measures | CMS Merit-Based Incentive Payment System Quality Reporting | Parts 1, Sources |
| CMS MLN Booklet on AWV | CMS Medicare Learning Network Booklet on Annual Wellness Visits | Part 1 |
| CMS MLN CCM Fact Sheet | CMS Medicare Learning Network Chronic Care Management Fact Sheet | Part 1 |
| CMS NCCI Edits | CMS National Correct Coding Initiative Edits | Parts 1, 3 |
| CMS Observation Status Guidelines | CMS Guidelines for Observation vs. Inpatient Status | Part 2 |
| CMS Operative Report Requirements | CMS Requirements for Operative Report Documentation | Parts 2, 3 |
| CMS OPPS/MPFS | CMS Outpatient Prospective Payment System / Medicare Physician Fee Schedule | Part 3 |
| CMS Patient Education Standards | CMS Requirements for Patient Education Documentation | Parts 1, 3 |
| CMS Person-Centered Care Requirements | CMS Standards for Person-Centered Care Documentation | Parts 3, 4 |
| CMS PFS Final Rule (Telehealth) | CMS Physician Fee Schedule Final Rule -- Telehealth Provisions | Part 4 (Telehealth) |
| CMS Place of Service Codes | CMS Place of Service Code Set for Professional Claims | Part 4 (Telehealth) |
| CMS Preventive Services Coverage | CMS Covered Preventive Services and USPSTF Alignment | Part 1 |
| CMS SDOH Z-Code Guidelines | CMS Guidance on Reporting Social Determinants of Health Using ICD-10-CM Z55-Z65 | Parts 1, 2, 4 |
| CMS SEP-1 Sepsis Bundle | CMS Early Management Bundle, Severe Sepsis/Septic Shock Core Measure | Part 4 (Red Flag Screening) |
| CMS Shared Decision-Making | CMS Requirements for Shared Decision-Making Documentation | Part 1 |
| CMS SSA 1862(a)(1)(A) | Social Security Act -- Medical Necessity Definition | Parts 3, 4 |
| CMS Teaching Physician Rules | CMS Requirements for Teaching Physician Documentation (42 CFR 415.172) | Part 2 |
| CMS Telehealth Consent Requirements | CMS Requirements for Telehealth Informed Consent | Part 4 (Telehealth) |
| CMS Telehealth Guidelines | CMS Telehealth Services Coverage and Documentation Guidelines | Parts 1, 4 |
| CMS Transitional Care Management | CMS Requirements for Transitional Care Management Documentation | Part 1 |
| CMS Two-Midnight Rule | CMS Two-Midnight Rule for Inpatient Admission (CMS-1599-F) | Part 2 |
| DEA Controlled Substance Regulations | Drug Enforcement Administration -- Prescribing and Documentation Requirements | Part 4 (Medication Reconciliation) |
| EMTALA (42 USC 1395dd) | Emergency Medical Treatment and Active Labor Act | Parts 1, 2 |
| Executive Order 13166 | Improving Access to Services for Persons with Limited English Proficiency | Part 4 (Tribal/IHS) |
| FDA Drug Interaction Labeling | FDA Requirements for Drug Interaction Information in Labeling | Part 4 (Medication Reconciliation) |
| FDA Drug Labeling | FDA Drug Labeling and Safety Information Standards | Part 3 |
| FDA Equipment Standards | FDA Standards for Medical Device Safety and Effectiveness | Part 3 |
| FDA MedWatch | FDA Safety Reporting and Surveillance Program | Part 4 (Medication Reconciliation) |
| FDA REMS | FDA Risk Evaluation and Mitigation Strategies | Part 4 (Medication Reconciliation) |
| FDA UDI Requirements | FDA Unique Device Identification Requirements for Implants | Part 3 |
| HIPAA | Health Insurance Portability and Accountability Act (Privacy and Security Rules) | Parts 1, 4 |
| ICD-10-CM Official Guidelines | ICD-10-CM Official Guidelines for Coding and Reporting | Parts 1, 2 |
| IHCIA Section 206 | Indian Health Care Improvement Act -- Contract and Referral Authority | Parts 1, 2, 4 |
| IHS Billing and Coding Guidelines | IHS Guidelines for Billing and Coding Medical Encounters | Parts 1, 2 |
| IHS Clinical Reporting System | IHS Clinical Reporting System for Quality and Population Health | Part 1 |
| IHS Clinical Standards | IHS Standards for Clinical Care Delivery | Parts 1, 2 |
| IHS Community Health Programs | IHS Community Health Programs Including CHR, Health Education, Public Health Nursing | Parts 1, 2, 4 |
| IHS Community Health Representative Program | IHS CHR Program Authorization and Implementation | Parts 2, 4 |
| IHS Eligibility Policy | IHS Indian Health Manual Part 2 Chapter 3 -- Eligibility | Parts 2, 4 |
| IHS Indian Health Manual | IHS Indian Health Manual -- Administrative and Clinical Operations | Parts 2, 3, 4 |
| IHS Language Access Policy | IHS Policy on Language Access for Limited English Proficiency Patients | Parts 3, 4 |
| IHS Patient Rights Policy | IHS Patient Rights and Responsibilities Policy | Parts 2, 3, 4 |
| IHS Pharmacy Standards | IHS Pharmacy Practice Standards | Part 4 (Medication Reconciliation) |
| IHS Purchased/Referred Care (PRC) Policy | IHS PRC Program Requirements and Priority System | Parts 1, 2, 3, 4 |
| IHS Sanitation Facilities Construction Program | IHS Program for Water and Sanitation Infrastructure in Tribal Communities | Part 4 (Tribal/IHS) |
| IHS Standards of Care | IHS Clinical Standards of Care for Direct and Contract Services | Parts 3, 4 |
| IHS Strategic Plan | IHS Strategic Plan for Quality and Access | Parts 2, 4 |
| IHS Telehealth Policy | IHS Policy on Telehealth Service Delivery | Part 4 (Telehealth) |
| Interstate Medical Licensure Compact | Interstate Compact for Expedited Physician Licensure Across States | Part 4 (Telehealth) |
| OSHA Bloodborne Pathogen Standard | OSHA Standard 29 CFR 1910.1030 | Parts 3, 4 |
| OSHA Exposure Standards | OSHA Standards for Occupational Exposure Limits | Part 1 |
| Patient Self-Determination Act (1990) | Federal Law Requiring Notice of Advance Directive Rights | Part 4 (Advance Care Planning) |
| State Healthcare Proxy Laws | State-Specific Laws Governing Healthcare Proxy/DPOA Designation | Part 4 (Advance Care Planning) |
| State PDMP Requirements | State Prescription Drug Monitoring Program Mandates | Parts 1, 4 |
| State/Tribal Reportable Disease Laws | State and Tribal Requirements for Reportable Disease Notification | Part 4 (Infection Control) |
| State Telehealth Parity Laws | State Laws Requiring Coverage Parity for Telehealth Services | Parts 4, Header |
| Title VI Civil Rights Act | Title VI -- Prohibition of Discrimination on Basis of Race/Color/National Origin (Language Access) | Parts 2, 4 |

---

### 2. Professional Organization Guidelines

| Source | Full Citation / Description | Referenced In |
|---|---|---|
| AAD (American Academy of Dermatology) | Skin Biopsy Guidelines, ABCDE Criteria, Dermoscopy Guidelines, Excision Guidelines, Suture Removal Guidelines, Post-Biopsy Guidelines, Documentation Standards | Part 3 |
| AADE / ADCES (Association of Diabetes Care & Education Specialists) | 7 Self-Care Behaviors Framework; Self-Management Education Standards | Part 1 |
| AAFP (American Academy of Family Physicians) | Social Needs Screening, Post-Procedure Guidelines, Primary Care Practice Standards | Parts 1, 4 |
| AAO (American Academy of Ophthalmology) | Vision Screening and Eye Examination Guidelines | Part 1 |
| AAOS (American Academy of Orthopaedic Surgeons) | Clinical Practice Guidelines, Injection Techniques, Post-Procedure Guidelines, Physical Examination Guidelines | Part 3 |
| AAP (American Academy of Pediatrics) | Clinical Practice Guidelines, Pediatric Screening, Developmental Assessment, Immunization Guidelines | Parts 1, 4 |
| AAN (American Academy of Neurology) | Practice Guidelines for Headache, Neurological Assessment, Cognitive Screening | Parts 1, 4 |
| AANEM (American Association of Neuromuscular and Electrodiagnostic Medicine) | EMG/NCV Standards and Quality Criteria | Part 3 |
| ACCP / CHEST (American College of Chest Physicians) | VTE Prevention Guidelines, Antithrombotic Guidelines, Bridging Anticoagulation | Parts 2, 3 |
| ACEP (American College of Emergency Physicians) | Clinical Policies (Chest Pain, Headache, Abdominal Pain, Stroke, Pregnancy), ESI Triage, Disposition Guidelines, Documentation Guidelines, POC Testing Guidelines, Discharge Instructions, Pain Management Clinical Policy, Wound Management Guidelines, E/M Coding Guide, Vital Sign Standards, Transfer Guidelines, Telehealth Guidelines | Parts 1, 2, 3, 4 |
| ACG (American College of Gastroenterology) | Colonoscopy Quality Standards, GI Clinical Guidelines | Part 3 |
| ACP (American College of Physicians) | Comorbidity Management Guidelines, Clinical Practice Standards | Part 1 |
| ACC/AHA (American College of Cardiology / American Heart Association) | 2014 Perioperative Cardiovascular Evaluation Guidelines, 2017 BP Guidelines, 2019 ASCVD Risk Calculator, 2019 CVD Primary Prevention, 2021 Chest Pain Guidelines, Heart Failure Guidelines, Cardiovascular Exam Standards, Lifestyle Guidelines, Orthostatic Hypotension Guidelines, Quality Metrics | Parts 1, 2, 3, 4 |
| ACR (American College of Radiology) | Appropriateness Criteria, Injection Guidelines, Synovial Fluid Analysis Guidelines, Fluoroscopy Guidelines, BIRADS Classification, Preliminary Report Standards, Image Documentation Standards | Part 3 |
| ACS (American College of Surgeons) | Principles of Surgery, Operative Technique Standards, Wound Closure Principles, DVT Prevention Guidelines, Emergency Surgery Guidelines, Enhanced Recovery After Surgery (ERAS), Informed Consent Statement, Post-Op Care Standards, NSQIP, Skin Cancer Guidelines, Surgical Margins | Parts 2, 3 |
| ADASP (Association of Directors of Anatomic and Surgical Pathology) | Specimen Handling Guidelines, Synoptic Reporting, Requisition Standards | Part 3 |
| ADA (American Diabetes Association) | Standards of Medical Care in Diabetes (2024), Perioperative Diabetes Management, Diabetes Risk Assessment, Steroid Injection Guidance for Diabetic Patients | Parts 1, 2, 3 |
| AGA (American Gastroenterological Association) | GI Clinical Practice Guidelines | Part 1 |
| AGS (American Geriatrics Society) | Beers Criteria (2023), Guiding Principles for Care of Older Adults with Multimorbidity | Parts 1, 4 |
| AGS/BGS (American/British Geriatrics Society) | Clinical Practice Guideline for Prevention of Falls in Older Persons (2011 / 2024 Update) | Part 4 (Fall Risk) |
| AHRQ (Agency for Healthcare Research and Quality) | Health Literacy Universal Precautions Toolkit (3rd Edition), ESI Triage Algorithm v4.0 | Parts 1, 2, 3, 4 |
| AIUM (American Institute of Ultrasound in Medicine) | Practice Parameters for Musculoskeletal Ultrasound, Practice Guidelines for Needle Guidance | Part 3 |
| AJCC (American Joint Committee on Cancer) | Cancer Staging Manual (Breslow Depth for Melanoma, TNM Staging) | Part 3 |
| AMA (American Medical Association) | CPT/E&M Guidelines (2021), CPT Professional Edition, Code of Ethics (Opinions 1.1.4, 2.1.1, 5.3), Health Literacy Framework, Prescribing Standards, Consultation Guidelines, Digital Health/Telehealth Implementation Guide, CPT Telehealth Modifiers, Guides to Evaluation of Permanent Impairment | Parts 1, 2, 3, 4 |
| AOA (Administration for Community Living / formerly Administration on Aging) | Older Americans Act Services | Part 1 |
| AORN (Association of periOperative Registered Nurses) | Guidelines for Perioperative Practice, Positioning Guidelines, Prevention of Retained Surgical Items | Parts 2, 3 |
| APA (American Psychological / Psychiatric Association) | Multicultural Guidelines, Practice Guidelines | Parts 3, 4 |
| APhA (American Pharmacists Association) | Medication Therapy Management (MTM) Standards and Guidelines | Part 1 |
| APS (American Pain Society) | Clinical Practice Guidelines for Pain Assessment and Management | Part 4 (Pain Assessment) |
| ARUP Laboratory | Synovial Fluid Analysis Reference | Part 3 |
| ASA (American Society of Anesthesiologists) | Physical Status Classification System (2020 Update), Practice Advisory for Preanesthesia Evaluation (2012), Practice Guidelines for Difficult Airway Management (2022), Practice Guidelines for Local Anesthesia, Sedation Continuum Guidelines, Post-Anesthesia Care Standards, Post-Anesthesia Discharge Criteria, Fasting Guidelines (2017), Fluid Management Guidelines, Blood Management Guidelines, Acute Pain Guidelines, Monitoring Standards, Ethics Committee Guidelines (Peri-operative DNR), Practice Guidelines for Regional Anesthesia (2010), OSA Guidelines, Sedation Monitoring Standards | Parts 2, 3, 4 |
| ASGE (American Society for Gastrointestinal Endoscopy) | Quality Indicators for Colonoscopy/EGD, Sedation Guidelines, Therapeutic Endoscopy Guidelines, Adverse Event Reporting, Documentation Standards, Technology Standards, Endoscope Reprocessing Standards, Minimum Standards for Reporting, Recovery Standards, Post-Procedure Instructions, Post-Polypectomy Surveillance | Part 3 |
| ASHP (American Society of Health-System Pharmacists) | Surgical Prophylaxis Guidelines (with ACS) | Part 3 |
| ATS/ERS (American Thoracic Society / European Respiratory Society) | Spirometry Standardization and Interpretation Guidelines, Quality Standards | Part 3 |
| CAP (College of American Pathologists) | Laboratory Accreditation Standards, Surgical Pathology Standards, Specimen Handling, Synoptic Reporting, Frozen Section Guidelines, Requisition Standards, Specimen Measurement Standards, Specimen Orientation Standards | Part 3 |
| GINA (Global Initiative for Asthma) | Global Strategy for Asthma Management and Prevention (2023) | Part 1 |
| GOLD (Global Initiative for Chronic Obstructive Lung Disease) | Global Strategy for COPD Diagnosis, Management, and Prevention (2024) | Part 1 |
| IASP (International Association for the Study of Pain) | Pain Classification and Taxonomy | Part 4 (Pain Assessment) |
| IHI (Institute for Healthcare Improvement) | Patient-Centered Goals of Care Framework | Part 1 |
| IOM (Institute of Medicine) | Health Literacy Report | Part 4 (SDOH) |
| ISMP (Institute for Safe Medication Practices) | High-Alert Medications List, Safe Injection Practices, Medication Safety Guidelines, Allergy Documentation Standards, Opioid Safety | Parts 1, 3, 4 |
| NAS (National Academies of Sciences) | Social Isolation and Loneliness in Older Adults (2020) | Part 4 (SDOH) |
| NAC/AARP | National Alliance for Caregiving/AARP Caregiver Assessment | Part 1 |
| NCQA (National Committee for Quality Assurance) | HEDIS Measures Development and Reporting Standards | Part 1 |
| NCCN (National Comprehensive Cancer Network) | Clinical Practice Guidelines in Oncology -- Skin Cancer, Melanoma, Breast Cancer, Surgical Margins | Part 3 |
| NPUAP (National Pressure Ulcer Advisory Panel) | Pressure Injury Staging System | Part 2 |
| SAGES (Society of American Gastrointestinal and Endoscopic Surgeons) | Guidelines for Laparoscopic Surgery | Part 3 |
| SAMHSA (Substance Abuse and Mental Health Services Administration) | TIP 57 (Trauma-Informed Care in Behavioral Health Services); TIP Series; National Guidelines for Behavioral Health Crisis Care | Part 4 (Tribal/IHS) |
| SHEA/IDSA (Society for Healthcare Epidemiology of America / Infectious Diseases Society of America) | MDRO Compendium of Strategies | Part 4 (Infection Control) |
| WHO (World Health Organization) | Surgical Safety Checklist, ICF (International Classification of Functioning) Framework, BMI Classification, Safe Injection Practices, High 5s Medication Reconciliation, Analgesic Ladder | Parts 1, 2, 3, 4 |

---

### 3. Clinical Practice Guidelines

| Source | Full Citation / Description | Referenced In |
|---|---|---|
| ACC/AHA 2014 Perioperative Cardiovascular Evaluation | Fleisher LA, et al. 2014 ACC/AHA Guideline on Perioperative Cardiovascular Evaluation and Management. Circulation. 2014;130(24):e278-e333 | Part 2 (Pre-Op H&P) |
| ACC/AHA 2017 Blood Pressure Guidelines | Whelton PK, et al. 2017 ACC/AHA Guideline for Prevention, Detection, Evaluation, and Management of High Blood Pressure in Adults. Hypertension. 2018;71(6):e13-e115 | Parts 1, 2 |
| ACC/AHA 2019 Primary Prevention of CVD | Arnett DK, et al. 2019 ACC/AHA Guideline on Primary Prevention of Cardiovascular Disease. Circulation. 2019;140(11):e596-e646 | Parts 1, 2 |
| ACC/AHA 2021 Chest Pain Guidelines | Gulati M, et al. 2021 AHA/ACC/ASE/CHEST/SAEM/SCCT/SCMR Guideline for Evaluation and Diagnosis of Chest Pain. Circulation. 2021;144(22):e368-e454 | Part 4 (Red Flag Screening) |
| ACC/AHA Heart Failure Guidelines | Heidenreich PA, et al. 2022 AHA/ACC/HFSA Guideline for Management of Heart Failure. Circulation. 2022;145(18):e895-e1032 | Part 1 |
| ACS/ASHP Surgical Prophylaxis | Bratzler DW, et al. Clinical Practice Guidelines for Antimicrobial Prophylaxis in Surgery. Am J Health-Syst Pharm. 2013;70:195-283 | Part 3 |
| ADA Standards of Medical Care (2024) | American Diabetes Association Professional Practice Committee. Standards of Care in Diabetes -- 2024. Diabetes Care. 2024;47(Supplement_1) | Parts 1, 2 |
| AHA/ASA Stroke Guidelines (2019) | Powers WJ, et al. Guidelines for the Early Management of Patients with Acute Ischemic Stroke. Stroke. 2019;50(12):e344-e418 | Part 4 (Red Flag Screening) |
| ATLS 10th Edition | American College of Surgeons. Advanced Trauma Life Support (ATLS) Student Course Manual, 10th Edition. 2018 | Part 2 (ED H&P) |
| CDC COVID-19 Infection Prevention | CDC Interim Infection Prevention and Control Recommendations for Healthcare Personnel | Part 4 (Infection Control) |
| CDC Guideline for Isolation Precautions (2007/2023) | Siegel JD, et al. 2007 Guideline for Isolation Precautions. Updated 2023 | Part 4 (Infection Control) |
| CDC Immunization Schedules | CDC Advisory Committee on Immunization Practices (ACIP) -- Recommended Immunization Schedules for Adults and Children (Updated Annually) | Parts 1, 4 |
| CDC Injection Safety Guidelines | CDC Safe Injection Practices | Part 3 |
| CDC MDRO Management Guidelines (2006) | Siegel JD, et al. Management of Multidrug-Resistant Organisms in Healthcare Settings. 2006 | Part 4 (Infection Control) |
| CDC Opioid Prescribing Guideline (2022) | Dowell D, et al. CDC Clinical Practice Guideline for Prescribing Opioids for Pain -- United States, 2022. MMWR. 2022;71(3):1-95 | Parts 1, 4 |
| CDC SSI Prevention Guidelines (2017) | Berrios-Torres SI, et al. CDC Guideline for Prevention of Surgical Site Infection, 2017. JAMA Surg. 2017;152(8):784-791 | Part 3 |
| CDC STEADI Initiative | Stopping Elderly Accidents, Deaths & Injuries -- Algorithm, Risk Factor Checklist, Assessment Tools, Intervention Algorithm | Parts 1, 4 |
| CDC Tetanus Prophylaxis Guidelines | CDC Recommendations for Tetanus Prophylaxis in Wound Management | Parts 1, 2 |
| CDC Travel Health Guidelines | CDC Yellow Book -- Health Information for International Travel | Part 1 |
| CHEST VTE Prevention (2012) | Kahn SR, et al. Prevention of VTE in Nonsurgical Patients. Chest. 2012;141(2 Suppl):e195S-e226S | Part 2 |
| GINA 2023 Asthma Guidelines | Global Initiative for Asthma. Global Strategy for Asthma Management and Prevention (2023 Update) | Part 1 |
| GOLD 2024 COPD Guidelines | Global Initiative for Chronic Obstructive Lung Disease. 2024 GOLD Report | Part 1 |
| JNC 8 | James PA, et al. 2014 Evidence-Based Guideline for Management of High Blood Pressure in Adults. JAMA. 2014;311(5):507-520 | Part 1 |
| National POLST Paradigm | National POLST Paradigm -- Portable Orders for Life-Sustaining Treatment | Part 4 (Advance Care Planning) |
| SCIP/CMS Core Measures | Surgical Care Improvement Project / CMS Quality Core Measures for Surgical Patients | Parts 2, 3 |
| Surviving Sepsis Campaign (2021) | Evans L, et al. Surviving Sepsis Campaign: International Guidelines for Management of Sepsis and Septic Shock 2021. Critical Care Medicine. 2021;49(11):e1063-e1143 | Part 4 (Red Flag Screening) |
| USPSTF A/B Recommendations | U.S. Preventive Services Task Force -- All Grade A and B Screening, Counseling, and Preventive Service Recommendations | Parts 1, 2, 4 |
| USPSTF Cancer Screening | USPSTF Recommendations for Breast, Cervical, Colorectal, Lung, and Prostate Cancer Screening | Part 1 |
| USPSTF Depression Screening (Grade B) | USPSTF Recommendation on Screening for Depression in Adults (Grade B) | Parts 1, 2 |
| USPSTF Falls Prevention (Grade B) | USPSTF Recommendation on Interventions to Prevent Falls in Community-Dwelling Older Adults (Grade B for >= 65) | Parts 1, 4 |
| USPSTF Family History Recommendations | USPSTF Guidance on Family History Risk Assessment | Parts 1, 2 |
| USPSTF IPV Screening (Grade B) | USPSTF Recommendation on Screening for Intimate Partner Violence (Grade B) | Part 4 (SDOH) |
| USPSTF Obesity Screening (Grade B) | USPSTF Recommendation on Screening for Obesity in Adults | Part 1 |
| USPSTF Tobacco Cessation (Grade A) | USPSTF Recommendation on Tobacco Smoking Cessation Interventions (Grade A) | Part 1 |
| USPSTF Unhealthy Alcohol Use (Grade B) | USPSTF Recommendation on Screening and Behavioral Counseling for Unhealthy Alcohol Use (Grade B) | Part 1 |
| USPSTF Vision Screening | USPSTF Recommendation on Vision Screening | Part 1 |

---

### 4. Validated Instruments and Screening Tools

| Instrument | Validation Reference | Used For | Referenced In |
|---|---|---|---|
| AD8 Informant Interview | Galvin JE, et al. The AD8: A brief informant interview to detect dementia. Neurology. 2005;65(4):559-564 | Cognitive screening (informant) | Part 1 |
| Aldrete Score | Aldrete JA. The post-anesthesia recovery score revisited. J Clin Anesth. 1995;7(1):89-91 | Post-sedation discharge readiness | Part 3 |
| ARISCAT Score | Canet J, et al. Prediction of postoperative pulmonary complications. Anesthesiology. 2010;113(6):1338-1350 | Pulmonary risk stratification (pre-op) | Part 2 |
| AUDIT-C | Bush K, et al. The AUDIT alcohol consumption questions. Arch Intern Med. 1998;158(16):1789-1795 | Alcohol use screening | Part 1 |
| BPI (Brief Pain Inventory) | Cleeland CS, Ryan KM. Pain assessment: global use of the BPI. Ann Acad Med Singapore. 1994;23(2):129-138 | Pain functional impact | Part 4 (Pain Assessment) |
| Caprini Score | Caprini JA, et al. Thrombosis risk assessment. Dis-a-Month. 2005;51(2-3):70-78 | VTE risk in surgical patients | Parts 2, 3 |
| CHA2DS2-VASc | Lip GYH, et al. Refining clinical risk stratification for predicting stroke and thromboembolism in atrial fibrillation. Chest. 2010;137(2):263-272 | Stroke risk in atrial fibrillation | Sources |
| Columbia-Suicide Severity Rating Scale (C-SSRS) | Posner K, et al. The Columbia-Suicide Severity Rating Scale. Am J Psychiatry. 2011;168(12):1266-1277 | Suicide risk assessment | Part 2 |
| COPD Assessment Test (CAT) | Jones PW, et al. Development and first validation of the COPD Assessment Test. Eur Respir J. 2009;34(3):648-654 | COPD symptom burden | Part 1 |
| CPOT (Critical-Care Pain Observation Tool) | Gelinas C, et al. Validation of the CPOT. Am J Crit Care. 2006;15(4):420-427 | Pain assessment in ICU/non-verbal patients | Part 4 (Pain Assessment) |
| DAST-10 | Skinner HA. The Drug Abuse Screening Test. Addict Behav. 1982;7(4):363-371 | Drug use screening | Part 1 |
| DIRE Score | Belgrade MJ, et al. The DIRE score: predicting outcomes of opioid prescribing. J Pain. 2006;7(9):671-681 | Opioid risk assessment | Part 4 (Medication Reconciliation) |
| ESI (Emergency Severity Index) v4.0 | Gilboy N, et al. Emergency Severity Index (ESI): A Triage Tool for Emergency Department Care, Version 4. AHRQ. 2012 | Emergency department triage | Part 2 |
| FLACC Scale | Merkel SI, et al. The FLACC: a behavioral scale for scoring postoperative pain in young children. Pediatr Nurs. 1997;23(3):293-297 | Pain assessment in pre-verbal/non-verbal children | Part 4 (Pain Assessment) |
| Fried Frailty Criteria | Fried LP, et al. Frailty in older adults: evidence for a phenotype. J Gerontol A Biol Sci Med Sci. 2001;56(3):M146-M156 | Frailty screening | Part 1 |
| GAD-7 | Spitzer RL, et al. A brief measure for assessing generalized anxiety disorder. Arch Intern Med. 2006;166(10):1092-1097 | Anxiety screening | Parts 1, Sources |
| HEART Score | Six AJ, et al. Chest pain in the emergency room: value of the HEART score. Neth Heart J. 2008;16(6):191-196 | Chest pain risk stratification | Part 4 (Red Flag Screening) |
| Hendrich II Fall Risk Model | Hendrich AL, et al. Validation of the Hendrich II Fall Risk Model. Appl Nurs Res. 2003;16(1):8-21 | Inpatient fall risk screening | Part 4 (Fall Risk) |
| HITS (IPV Screening) | Sherin KM, et al. HITS: a short domestic violence screening tool. Fam Med. 1998;30(7):508-512 | Intimate partner violence screening | Part 4 (SDOH) |
| Hunger Vital Sign | Hager ER, et al. Development and validity of a 2-item screen to identify families at risk for food insecurity. Pediatrics. 2010;126(1):e26-e32 | Food insecurity screening | Part 4 (SDOH) |
| Katz ADL Index | Katz S, et al. Studies of illness in the aged: the index of ADL. JAMA. 1963;185(12):914-919 | Activities of daily living assessment | Parts 1, 2 |
| Lawton IADL Scale | Lawton MP, Brody EM. Assessment of older people: self-maintaining and instrumental activities of daily living. Gerontologist. 1969;9(3_Part_1):179-186 | Instrumental activities of daily living | Parts 1, 2 |
| Mini-Cog | Borson S, et al. The Mini-Cog: a cognitive "vital signs" measure for dementia screening. Int J Geriatr Psychiatry. 2000;15(11):1021-1027 | Rapid cognitive screening | Part 1 |
| MMAS-8 (Morisky Medication Adherence Scale) | Morisky DE, et al. Predictive validity of a medication adherence measure in an outpatient setting. J Clin Hypertens. 2008;10(5):348-354 | Medication adherence assessment | Part 1 |
| MMSE (Mini-Mental State Examination) | Folstein MF, et al. "Mini-mental state": a practical method for grading cognitive state. J Psychiatr Res. 1975;12(3):189-198 | Cognitive screening | Part 1 |
| MoCA (Montreal Cognitive Assessment) | Nasreddine ZS, et al. The MoCA: a brief screening tool for mild cognitive impairment. J Am Geriatr Soc. 2005;53(4):695-699 | Cognitive screening | Parts 1, Sources |
| Morse Fall Scale | Morse JM, et al. Development of a scale to identify the fall-prone patient. Can J Aging. 1989;8(4):366-377 | Inpatient/outpatient fall risk screening | Parts 1, 2, 4 |
| NEXUS Low-Risk Criteria | Hoffman JR, et al. Validity of a set of clinical criteria to rule out injury to the cervical spine. NEJM. 2000;343(2):94-99 | C-spine injury clearance | Part 2 |
| NIHSS (NIH Stroke Scale) | Brott T, et al. Measurements of acute cerebral infarction: a clinical examination scale. Stroke. 1989;20(7):864-870 | Stroke severity assessment | Parts 2, 4 |
| NRS (Numeric Rating Scale) | McCaffery M, Beebe A. Pain: Clinical Manual for Nursing Practice. Mosby. 1989 | Pain intensity rating | Parts 1, 4 |
| ORT (Opioid Risk Tool) | Webster LR, Webster RM. Predicting aberrant behaviors in opioid-treated patients. Pain Med. 2005;6(6):432-442 | Opioid misuse risk assessment | Part 4 (Medication Reconciliation) |
| PAINAD (Pain Assessment in Advanced Dementia) | Warden V, et al. Development and psychometric evaluation of the PAINAD scale. J Am Med Dir Assoc. 2003;4(1):9-15 | Pain assessment in dementia patients | Part 4 (Pain Assessment) |
| Padua Score | Barbar S, et al. A risk assessment model for the identification of hospitalized medical patients at risk for VTE. J Thromb Haemost. 2010;8(11):2450-2457 | VTE risk in medical inpatients | Part 2 |
| Paris Classification | The Paris endoscopic classification of superficial neoplastic lesions. Gastrointest Endosc. 2003;58(6 Suppl):S3-S43 | Polyp and neoplasm classification (endoscopy) | Part 3 |
| PHQ-2 | Kroenke K, et al. The Patient Health Questionnaire-2: validity of a two-item depression screener. Med Care. 2003;41(11):1284-1292 | Depression screening (brief) | Parts 1, 2 |
| PHQ-9 | Kroenke K, et al. The PHQ-9: validity of a brief depression severity measure. J Gen Intern Med. 2001;16(9):606-613 | Depression severity screening | Parts 1, 2, Sources |
| PROMIS Pain Interference | Amtmann D, et al. Development of a PROMIS item bank to measure pain interference. Pain. 2010;150(1):173-182 | Pain functional impact (patient-reported) | Part 4 (Pain Assessment) |
| qSOFA | Singer M, et al. The Third International Consensus Definitions for Sepsis and Septic Shock (Sepsis-3). JAMA. 2016;315(8):801-810 | Sepsis screening | Parts 1, 4 |
| RCRI (Revised Cardiac Risk Index) | Lee TH, et al. Derivation and prospective validation of a simple index for prediction of cardiac risk of major noncardiac surgery. Circulation. 1999;100(10):1043-1049 | Pre-operative cardiac risk | Part 2 |
| SOAPP-R (Screener and Opioid Assessment for Patients with Pain - Revised) | Butler SF, et al. Development and validation of the SOAPP-R. J Pain. 2008;9(4):360-372 | Opioid risk assessment | Part 4 (Medication Reconciliation) |
| SPPB (Short Physical Performance Battery) | Guralnik JM, et al. A short physical performance battery assessing lower extremity function. J Gerontol. 1994;49(2):M85-M94 | Physical function and fall risk | Part 1 |
| STOP-Bang Questionnaire | Chung F, et al. STOP questionnaire: a tool to screen patients for obstructive sleep apnea. Anesthesiology. 2008;108(5):812-821 | Obstructive sleep apnea screening (pre-op) | Part 2 |
| Tinetti Balance Assessment | Tinetti ME. Performance-oriented assessment of mobility problems in elderly patients. J Am Geriatr Soc. 1986;34(2):119-126 | Gait and balance assessment | Part 4 (Fall Risk) |
| UCLA Loneliness Scale (UCLA-3) | Hughes ME, et al. A short scale for measuring loneliness in large surveys. Res Aging. 2004;26(6):655-672 | Social isolation screening | Part 4 (SDOH) |
| VAS (Visual Analog Scale) | Huskisson EC. Measurement of pain. Lancet. 1974;2(7889):1127-1131 | Pain intensity rating | Parts 1, 4 |
| Wells Score (DVT/PE) | Wells PS, et al. Derivation of a simple clinical model to categorize patients' probability of pulmonary embolism. Thromb Haemost. 2000;83(3):416-420 | DVT/PE probability assessment | Sources |
| Wong-Baker FACES Pain Scale | Wong DL, Baker CM. Pain in children: comparison of assessment scales. Pediatr Nurs. 1988;14(1):9-17 | Pain assessment in children and patients with communication barriers | Parts 1, 4 |

---

### 5. Scoring Systems and Classification Systems

| System | Description | Referenced In |
|---|---|---|
| ABCDE Criteria (Melanoma) | Asymmetry, Border, Color, Diameter, Evolution -- Clinical criteria for melanoma screening | Part 3 |
| Aldrete Score | Post-anesthesia recovery scoring system (0-10 scale) | Part 3 |
| ARISCAT Score | Pulmonary complication risk score for surgical patients (Canet et al.) | Part 2 |
| ASA Physical Status Classification | ASA I-VI classification for anesthetic risk (2020 Update) | Parts 2, 3 |
| ASCVD 10-Year Risk Calculator | ACC/AHA Pooled Cohort Equations for atherosclerotic cardiovascular disease risk | Part 1 |
| Braden Scale | Pressure injury risk assessment (score range 6-23) | Part 2 |
| Caprini Score | Venous thromboembolism risk assessment for surgical patients | Parts 2, 3 |
| CHA2DS2-VASc | Stroke risk stratification in atrial fibrillation | Sources |
| CKD-EPI Staging | Chronic kidney disease staging using GFR estimation | Part 1 |
| ESI (Emergency Severity Index) | 5-level ED triage algorithm (Level 1 = most urgent) | Part 2 |
| Glasgow Coma Scale (GCS) | Neurological assessment scale (Eye + Verbal + Motor, 3-15) | Part 2 |
| HEART Score | Chest pain risk stratification (History, ECG, Age, Risk factors, Troponin; 0-10) | Part 4 |
| Hoehn & Yahr Stage | Parkinson disease staging system | Sources |
| InterQual / Milliman / MCG | Proprietary admission criteria and level-of-care determination tools | Part 2 |
| Kellgren-Lawrence Classification | Osteoarthritis radiographic severity grading (0-4) | Sources |
| Mallampati Classification | Airway assessment based on oropharyngeal visualization (Class I-IV) | Part 2 |
| MDM Table (AMA 2021) | Medical Decision-Making complexity table for E/M leveling -- 3 elements: problems, data, risk | Parts 1, 2 |
| Morse Fall Scale | Fall risk assessment (6 variables, 0-125 score; >= 45 high risk) | Parts 1, 2, 4 |
| NIHSS | Stroke severity scale (0-42) | Parts 2, 4 |
| NYHA Functional Classification | Heart failure classification (Class I-IV by symptom severity) | Sources |
| Padua Score | VTE risk assessment for medical inpatients (0-20) | Part 2 |
| Paris Classification | Endoscopic classification of superficial GI neoplastic lesions | Part 3 |
| PRC Priority Levels (IHS) | IHS Purchased/Referred Care priority classification (I-V) | Parts 2, 4 |
| qSOFA | Quick Sequential Organ Failure Assessment for sepsis screening (0-3) | Parts 1, 4 |
| RCRI (Revised Cardiac Risk Index) | Lee Index -- 6-factor cardiac risk prediction for noncardiac surgery (0-6) | Part 2 |
| STOP-Bang Score | OSA screening score (0-8; Low 0-2 / Intermediate 3-4 / High 5-8) | Part 2 |
| Wound Classification (ACS) | Clean / Clean-contaminated / Contaminated / Dirty-infected | Part 3 |

---

### 6. Quality Measures and Programs

| Program / Measure Set | Description | Referenced In |
|---|---|---|
| ACS NSQIP | American College of Surgeons National Surgical Quality Improvement Program | Parts 2, 3 |
| CAHPS (Consumer Assessment of Healthcare Providers and Systems) | CMS patient experience surveys | Sources |
| Choosing Wisely | ABIM Foundation initiative for evidence-based test/treatment utilization | Part 2 |
| CMS Core Measures | CMS Hospital Quality Measures (VTE, sepsis, surgical care, immunization, etc.) | Parts 2, 3 |
| CMS HCC (Hierarchical Condition Categories) | CMS risk adjustment model for Medicare Advantage | Parts 1, 2 |
| CMS MIPS (Merit-Based Incentive Payment System) | CMS quality payment program with quality, cost, improvement, and promoting interoperability categories | Parts 1, Sources |
| CMS Quality Measures | CMS quality reporting measures across care settings | Parts 1, 4 |
| CMS Stars | CMS Star Rating System for Medicare Advantage and Part D plans | Sources |
| CQM (Clinical Quality Measures) | Electronic clinical quality measures for quality reporting | Part 1 |
| HEDIS (Healthcare Effectiveness Data and Information Set) | NCQA quality measures for health plans -- Diabetes, CVD, Cancer Screening, Immunization, Behavioral Health, etc. | Parts 1, Sources |
| Joint Commission Core Measures | Joint Commission standardized performance measures for accredited organizations | Parts 2, 3 |
| Joint Commission NPSGs | National Patient Safety Goals -- medication reconciliation (03.06.01), patient identification (01.01.01), fall prevention (09.02.01), suicide prevention (15.01.01), high-alert medications (03.05.01), anticoagulation (03.05.01) | Parts 1, 2, 3, 4 |
| SCIP (Surgical Care Improvement Project) | Joint CMS/Joint Commission measures for surgical quality | Parts 2, 3 |

---

### 7. Tribal / IHS-Specific Sources

| Source | Full Citation / Description | Referenced In |
|---|---|---|
| 25 USC 1616 | Authorization for Community Health Representative Program | Part 4 |
| 42 CFR 136 | Eligibility for Services, Indian Health Service | Parts 1, 2, 3, 4 |
| 42 CFR 136.23 | Purchased/Referred Care (PRC) Priority Classification and Requirements | Parts 2, 4 |
| AHC-HRSN Screening Tool | Accountable Health Communities Health-Related Social Needs Screening Tool | Parts 1, 2, 4 |
| GAO Reports on IHS Infrastructure | U.S. Government Accountability Office Reports on IHS Facility and Sanitation Infrastructure | Part 4 |
| HHS Action Plan to Reduce Racial and Ethnic Health Disparities | Department of Health and Human Services Action Plan (2011) | Part 4 |
| HHS OMH Standards | HHS Office of Minority Health National Standards for CLAS (Culturally and Linguistically Appropriate Services) | Part 1 |
| IHCIA (Indian Health Care Improvement Act) | Public Law 94-437, as amended -- Authority for IHS Programs and Services | Parts 1, 2, 4 |
| IHS Behavioral Health Standards | IHS Standards for Behavioral Health Service Delivery | Parts 1, 4 |
| IHS Billing and Coding Guidelines | IHS Coding and Billing Manual for Medical Encounters | Parts 1, 2 |
| IHS Care Coordination Standards | IHS Standards for Care Coordination Across Service Units | Parts 1, 2 |
| IHS Clinical Reporting System (CRS) | IHS Quality Reporting and Population Health Management System | Part 1 |
| IHS Community Health Programs | IHS Programs for Community Health Including CHR, PHN, Health Education | Parts 1, 2, 4 |
| IHS Community Health Representative Program | IHS CHR Program -- Community-Based Health Support and Care Coordination | Parts 2, 4 |
| IHS Eligibility Policy (IHM Part 2, Chapter 3) | Indian Health Manual Part 2 Chapter 3 -- Patient Eligibility | Parts 2, 4 |
| IHS Health Disparities Data | IHS Data on Health Disparities in American Indian/Alaska Native Populations | Part 1 |
| IHS Immunization Guidelines | IHS-Specific Immunization Recommendations and Programs | Part 4 |
| IHS Indian Health Manual | IHS Administrative and Clinical Operations Manual (Multiple Parts and Chapters) | Parts 2, 3, 4 |
| IHS Language Access Policy | IHS Policy on Language Services for LEP Patients | Parts 3, 4 |
| IHS Patient Rights Policy | IHS Policy on Patient Rights, Responsibilities, and Cultural Respect | Parts 2, 3, 4 |
| IHS Pharmacy Standards | IHS Standards for Pharmacy Practice and Medication Safety | Part 4 |
| IHS Purchased/Referred Care (PRC) Policy | IHS PRC Program Policy -- Referral Authorization, Priority System, Alternate Resources | Parts 1, 2, 3, 4 |
| IHS Sanitation Facilities Construction Program | IHS Program for Water Supply and Waste Disposal in Indian Communities | Part 4 |
| IHS SDOH Framework | IHS Framework for Addressing Social Determinants in Tribal Communities | Parts 1, 2 |
| IHS Standards of Care | IHS Clinical Standards for Direct Service and Contract Health Delivery | Parts 3, 4 |
| IHS Strategic Plan | IHS Multi-Year Strategic Plan for Quality, Access, and Infrastructure | Parts 2, 4 |
| IHS Telehealth Policy | IHS Policy on Telehealth Service Delivery in Indian Country | Part 4 |
| SAMHSA TIP 57 | Treatment Improvement Protocol 57: Trauma-Informed Care in Behavioral Health Services | Part 4 |
| SAMHSA TIP Series | Substance Abuse and Mental Health Services Treatment Improvement Protocols | Sources |
| Traditional Healing Frameworks | Documentation practices for integration of traditional healing with Western medicine in tribal settings (per IHS Indian Health Manual Part 3 Chapter 5; Joint Commission RI.01.01.01) | Parts 2, 3, 4 |

---

### Source Abbreviation Reference

| Abbreviation | Full Name |
|---|---|
| AAD | American Academy of Dermatology |
| AADE / ADCES | Association of Diabetes Care and Education Specialists |
| AAFP | American Academy of Family Physicians |
| AANEM | American Association of Neuromuscular and Electrodiagnostic Medicine |
| AAO | American Academy of Ophthalmology |
| AAOS | American Academy of Orthopaedic Surgeons |
| AAP | American Academy of Pediatrics |
| AAN | American Academy of Neurology |
| ACA | Affordable Care Act |
| ACCP / CHEST | American College of Chest Physicians |
| ACEP | American College of Emergency Physicians |
| ACC | American College of Cardiology |
| ACG | American College of Gastroenterology |
| ACIP | Advisory Committee on Immunization Practices (CDC) |
| ACOEM | American College of Occupational and Environmental Medicine |
| ACOG | American College of Obstetricians and Gynecologists |
| ACP | American College of Physicians |
| ACR | American College of Radiology |
| ACS | American College of Surgeons |
| ADASP | Association of Directors of Anatomic and Surgical Pathology |
| ADA | American Diabetes Association |
| AGA | American Gastroenterological Association |
| AGS | American Geriatrics Society |
| AHA | American Heart Association |
| AHRQ | Agency for Healthcare Research and Quality |
| AIUM | American Institute of Ultrasound in Medicine |
| AJCC | American Joint Committee on Cancer |
| AMA | American Medical Association |
| AOA | Administration for Community Living (formerly Administration on Aging) |
| AORN | Association of periOperative Registered Nurses |
| APA | American Psychological Association / American Psychiatric Association |
| APhA | American Pharmacists Association |
| APS | American Pain Society |
| ARUP | Associated Regional and University Pathologists |
| ASA | American Society of Anesthesiologists |
| ASGE | American Society for Gastrointestinal Endoscopy |
| ASHP | American Society of Health-System Pharmacists |
| ATLS | Advanced Trauma Life Support |
| ATS/ERS | American Thoracic Society / European Respiratory Society |
| BGS | British Geriatrics Society |
| BIRADS | Breast Imaging Reporting and Data System |
| BPI | Brief Pain Inventory |
| CAP | College of American Pathologists |
| CAHPS | Consumer Assessment of Healthcare Providers and Systems |
| CARF | Commission on Accreditation of Rehabilitation Facilities |
| CDC | Centers for Disease Control and Prevention |
| CKD-EPI | Chronic Kidney Disease Epidemiology Collaboration |
| CLIA | Clinical Laboratory Improvement Amendments |
| CMS | Centers for Medicare and Medicaid Services |
| CPT | Current Procedural Terminology |
| CQM | Clinical Quality Measure |
| C-SSRS | Columbia-Suicide Severity Rating Scale |
| DEA | Drug Enforcement Administration |
| DPOA-HC | Durable Power of Attorney for Healthcare |
| DSM-5-TR | Diagnostic and Statistical Manual of Mental Disorders, 5th Edition, Text Revision |
| EHR | Electronic Health Record |
| EMTALA | Emergency Medical Treatment and Active Labor Act |
| ERAS | Enhanced Recovery After Surgery |
| ESI | Emergency Severity Index |
| FDA | U.S. Food and Drug Administration |
| GAO | U.S. Government Accountability Office |
| GCS | Glasgow Coma Scale |
| GINA | Global Initiative for Asthma |
| GOLD | Global Initiative for Chronic Obstructive Lung Disease |
| HCC | Hierarchical Condition Category |
| HEDIS | Healthcare Effectiveness Data and Information Set |
| HHS | U.S. Department of Health and Human Services |
| HIPAA | Health Insurance Portability and Accountability Act |
| HPSA | Health Professional Shortage Area |
| HRSA | Health Resources and Services Administration |
| HUD | U.S. Department of Housing and Urban Development |
| IASP | International Association for the Study of Pain |
| ICD-10-CM | International Classification of Diseases, 10th Revision, Clinical Modification |
| ICF | International Classification of Functioning, Disability and Health |
| IDSA | Infectious Diseases Society of America |
| IHCIA | Indian Health Care Improvement Act |
| IHI | Institute for Healthcare Improvement |
| IHM | Indian Health Manual |
| IHS | Indian Health Service |
| IOM | Institute of Medicine |
| ISMP | Institute for Safe Medication Practices |
| JNC | Joint National Committee (Hypertension Guidelines) |
| LCD | Local Coverage Determination |
| MCG | Milliman Care Guidelines |
| MIPS | Merit-Based Incentive Payment System |
| MOLST | Medical Orders for Life-Sustaining Treatment |
| MPFS | Medicare Physician Fee Schedule |
| NAS | National Academies of Sciences, Engineering, and Medicine |
| NAC | National Alliance for Caregiving |
| NCCI | National Correct Coding Initiative |
| NCCN | National Comprehensive Cancer Network |
| NCQA | National Committee for Quality Assurance |
| NCD | National Coverage Determination |
| NEXUS | National Emergency X-Radiography Utilization Study |
| NIHSS | National Institutes of Health Stroke Scale |
| NPSG | National Patient Safety Goal (Joint Commission) |
| NPUAP | National Pressure Ulcer Advisory Panel |
| NRS | Numeric Rating Scale |
| NSQIP | National Surgical Quality Improvement Program |
| ONC | Office of the National Coordinator for Health Information Technology |
| OPPS | Outpatient Prospective Payment System |
| ORT | Opioid Risk Tool |
| OSHA | Occupational Safety and Health Administration |
| PAINAD | Pain Assessment in Advanced Dementia |
| PHQ | Patient Health Questionnaire |
| POLST | Portable Orders for Life-Sustaining Treatment |
| PRC | Purchased/Referred Care (IHS) |
| PROMIS | Patient-Reported Outcomes Measurement Information System |
| REMS | Risk Evaluation and Mitigation Strategy (FDA) |
| SAGES | Society of American Gastrointestinal and Endoscopic Surgeons |
| SAMHSA | Substance Abuse and Mental Health Services Administration |
| SCIP | Surgical Care Improvement Project |
| SDOH | Social Determinants of Health |
| SHEA | Society for Healthcare Epidemiology of America |
| SNOOP | Mnemonic for headache red flags (Systemic, Neurologic, Onset, Older, Previous/Progressive) |
| SOAPP-R | Screener and Opioid Assessment for Patients with Pain - Revised |
| SPPB | Short Physical Performance Battery |
| SSA | Social Security Act |
| STEADI | Stopping Elderly Accidents, Deaths & Injuries (CDC) |
| TIP | Treatment Improvement Protocol (SAMHSA) |
| UCLA-3 | UCLA Loneliness Scale, 3-Item Version |
| USDA | U.S. Department of Agriculture |
| USMSTF | U.S. Multi-Society Task Force on Colorectal Cancer |
| USP | United States Pharmacopeia |
| USPSTF | U.S. Preventive Services Task Force |
| VAS | Visual Analog Scale |
| VIS | Vaccine Information Statement |
| VTE | Venous Thromboembolism |
| WCS | Wound Care Society |
| WHO | World Health Organization |
