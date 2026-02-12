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
