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
