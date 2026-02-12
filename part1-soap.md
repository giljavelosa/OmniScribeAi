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
