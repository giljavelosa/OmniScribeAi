// CMS/Payer Minimum Data Set Requirements per Framework
// These define which items are REQUIRED for reimbursement/compliance

export interface CMSRequirement {
  item: string;           // Must match framework section item name
  section: string;        // Framework section title
  category: 'critical' | 'required' | 'recommended';
  regulation: string;     // Source regulation
  description: string;    // Why it's required
  emrProvided?: boolean;   // true = typically pre-populated from EMR (demographics, ICD, referral)
}

export interface ComplianceResult {
  cmsStatus: 'scored' | 'not_applicable';
  score: number | null;             // 0-100 percentage, null when not_applicable
  totalRequired: number;
  documented: number;
  missing: CMSRequirement[];
  documented_items: CMSRequirement[];
  grade: 'A' | 'B' | 'C' | 'D' | 'F' | null;  // null when not_applicable
  riskLevel: 'low' | 'moderate' | 'high' | 'critical' | null;  // null when not_applicable
  summary: string;
}

// CMS requirements indexed by framework ID
export const cmsRequirements: Record<string, CMSRequirement[]> = {
  'rehab-pt-eval': [
    // Critical — claim will be denied without these
    { item: 'Referral Source/Diagnosis', section: 'Patient History', category: 'critical', regulation: 'Medicare Benefit Policy Manual Ch.15 §220.3', description: 'Medical diagnosis and referral required for PT services', emrProvided: true },
    { item: 'Mechanism of Injury/Onset', section: 'Patient History', category: 'critical', regulation: 'LCD L33966', description: 'Date of onset/mechanism establishes medical necessity timeline' },
    { item: 'Prior Level of Function', section: 'Patient History', category: 'critical', regulation: 'Medicare Benefit Policy Manual Ch.15 §220.3', description: 'Baseline function required to measure improvement and set goals' },
    { item: 'Active ROM (Goniometry)', section: 'Tests & Measures', category: 'critical', regulation: 'CMS-1500 Documentation Standards', description: 'Objective measurements required to establish impairment' },
    { item: 'Manual Muscle Testing', section: 'Tests & Measures', category: 'critical', regulation: 'CMS-1500 Documentation Standards', description: 'Strength assessment required for functional limitation documentation' },
    { item: 'PT Diagnosis/Clinical Impression', section: 'Clinical Assessment', category: 'critical', regulation: 'APTA Guide to PT Practice', description: 'Clinical impression required for treatment justification' },
    { item: 'Skilled Need Justification', section: 'Clinical Assessment', category: 'critical', regulation: 'Medicare Benefit Policy Manual Ch.15 §220.2', description: 'Must demonstrate why skilled PT services are necessary' },
    { item: 'Short-Term Goals (2-4 weeks)', section: 'Plan of Care', category: 'critical', regulation: 'Medicare Benefit Policy Manual Ch.15 §220.3', description: 'Measurable goals required with timeframes' },
    { item: 'Long-Term Goals (8-12 weeks)', section: 'Plan of Care', category: 'critical', regulation: 'Medicare Benefit Policy Manual Ch.15 §220.3', description: 'Discharge-oriented goals required' },
    { item: 'Treatment Frequency/Duration', section: 'Plan of Care', category: 'critical', regulation: 'Medicare Benefit Policy Manual Ch.15 §220.3', description: 'Frequency and duration of treatment plan required' },
    // Required — strengthens claim significantly
    { item: 'Living Situation', section: 'Patient History', category: 'required', regulation: 'LCD L33966', description: 'Environmental context supports functional goal setting' },
    { item: 'Occupational Demands', section: 'Patient History', category: 'required', regulation: 'LCD L33966', description: 'Work/activity demands justify treatment intensity' },
    { item: 'Patient Goals', section: 'Patient History', category: 'required', regulation: 'Patient-Centered Care Standards', description: 'Patient-stated goals required for person-centered care' },
    { item: 'Functional Mobility', section: 'Tests & Measures', category: 'required', regulation: 'CMS Functional Reporting', description: 'Functional limitation reporting required (G-codes/severity modifiers)' },
    { item: 'Balance Assessment', section: 'Tests & Measures', category: 'required', regulation: 'CMS Fall Prevention', description: 'Balance assessment for fall risk documentation' },
    { item: 'Gait Analysis', section: 'Tests & Measures', category: 'required', regulation: 'CMS Functional Reporting', description: 'Gait assessment supports mobility goal documentation' },
    { item: 'Problem List', section: 'Clinical Assessment', category: 'required', regulation: 'APTA Guide to PT Practice', description: 'Structured problem list links findings to interventions' },
    { item: 'Rehab Potential', section: 'Clinical Assessment', category: 'required', regulation: 'Medicare Benefit Policy Manual Ch.15 §220.2', description: 'Rehabilitation potential assessment supports medical necessity' },
    { item: 'Interventions Planned', section: 'Plan of Care', category: 'required', regulation: 'CPT Coding Standards', description: 'Planned interventions with CPT codes for billing' },
    { item: 'Discharge Criteria', section: 'Plan of Care', category: 'required', regulation: 'Medicare Benefit Policy Manual Ch.15 §220.3', description: 'Discharge criteria define expected endpoints' },
    // Recommended — best practice, reduces audit risk
    { item: 'Prior Treatment', section: 'Patient History', category: 'recommended', regulation: 'Best Practice', description: 'Prior treatment history demonstrates progression of care', emrProvided: true },
    { item: 'Imaging/Diagnostics', section: 'Patient History', category: 'recommended', regulation: 'Best Practice', description: 'Imaging results support clinical decision-making', emrProvided: true },
    { item: 'Comorbidities', section: 'Patient History', category: 'recommended', regulation: 'LCD L33966', description: 'Comorbidities affect prognosis and treatment planning', emrProvided: true },
    { item: 'Medications', section: 'Patient History', category: 'recommended', regulation: 'Patient Safety', description: 'Medication review for contraindications and precautions', emrProvided: true },
    { item: 'Special Tests', section: 'Tests & Measures', category: 'recommended', regulation: 'Evidence-Based Practice', description: 'Special tests support differential diagnosis' },
    { item: 'Palpation', section: 'Tests & Measures', category: 'recommended', regulation: 'APTA Standards', description: 'Palpation findings support assessment' },
    { item: 'Precautions/Contraindications', section: 'Clinical Assessment', category: 'recommended', regulation: 'Patient Safety Standards', description: 'Safety precautions document risk management' },
    { item: 'Patient/Family Education', section: 'Plan of Care', category: 'recommended', regulation: 'Medicare Benefit Policy Manual', description: 'Education documentation supports skilled care' },
    { item: 'Coordination of Care', section: 'Plan of Care', category: 'recommended', regulation: 'CMS Care Coordination', description: 'Coordination with other providers demonstrates comprehensive care' },
    { item: 'Oswestry Disability Index (ODI)', section: 'Functional Outcome Measures', category: 'recommended', regulation: 'CMS MIPS Quality Measures', description: 'Standardized outcome measure strengthens documentation' },
    { item: 'Numeric Pain Rating Scale (NPRS)', section: 'Functional Outcome Measures', category: 'recommended', regulation: 'CMS MIPS Quality Measures', description: 'Pain outcome measure for treatment effectiveness tracking' },
  ],

  'rehab-pt-daily': [
    { item: 'Pain Level (NPRS)', section: 'Subjective', category: 'critical', regulation: 'CMS Daily Note Standards', description: 'Pain level documents patient status each visit' },
    { item: 'Patient Report of Function', section: 'Subjective', category: 'critical', regulation: 'CMS Functional Reporting', description: 'Patient-reported function tracks progress' },
    { item: 'Interventions Performed (with CPT/time)', section: 'Objective', category: 'critical', regulation: 'CPT Billing Requirements', description: 'Interventions with CPT codes and time required for billing' },
    { item: 'Patient Response to Treatment', section: 'Objective', category: 'critical', regulation: 'Medicare Benefit Policy Manual Ch.15', description: 'Treatment response demonstrates skilled care' },
    { item: 'Progress Toward Goals', section: 'Assessment', category: 'critical', regulation: 'Medicare Benefit Policy Manual Ch.15 §220.3', description: 'Goal progress required to justify continued treatment' },
    { item: 'Skilled Need Justification', section: 'Assessment', category: 'critical', regulation: 'Medicare Benefit Policy Manual Ch.15 §220.2', description: 'Must justify why skilled services remain necessary' },
    { item: 'Next Visit Plan', section: 'Plan', category: 'required', regulation: 'Continuity of Care', description: 'Next visit plan shows ongoing treatment rationale' },
    { item: 'Objective Measurements', section: 'Objective', category: 'required', regulation: 'CMS Documentation Standards', description: 'Periodic objective remeasurement validates progress' },
  ],

  'med-soap-followup': [
    { item: 'Chief Complaint', section: 'Subjective', category: 'critical', regulation: 'CMS E/M Documentation Guidelines', description: 'Chief complaint required for all E/M visits', emrProvided: true },
    { item: 'Interval History', section: 'Subjective', category: 'critical', regulation: 'CMS E/M Guidelines 2025', description: 'History since last visit required' },
    { item: 'Physical Examination', section: 'Objective', category: 'critical', regulation: 'CMS E/M Guidelines', description: 'Exam findings support medical decision making' },
    { item: 'Problem List Update', section: 'Assessment', category: 'critical', regulation: 'CMS E/M Guidelines', description: 'Updated problem list required for MDM complexity' },
    { item: 'Medication Changes', section: 'Plan', category: 'required', regulation: 'CMS Prescribing Standards', description: 'Medication management documents treatment decisions' },
    { item: 'Follow-Up Interval', section: 'Plan', category: 'required', regulation: 'Continuity of Care', description: 'Follow-up plan required' },
    { item: 'Review of Systems', section: 'Subjective', category: 'required', regulation: 'CMS E/M Guidelines', description: 'ROS contributes to E/M level' },
    { item: 'Vital Signs', section: 'Objective', category: 'required', regulation: 'Standard of Care', description: 'Vital signs expected at most visits' },
    { item: 'Severity/Progression', section: 'Assessment', category: 'required', regulation: 'MDM Complexity', description: 'Severity assessment supports MDM level' },
    { item: 'Patient Education', section: 'Plan', category: 'recommended', regulation: 'Best Practice', description: 'Education documentation supports care quality' },
  ],

  'med-soap-new': [
    { item: 'Chief Complaint', section: 'Subjective', category: 'critical', regulation: 'CMS E/M Documentation Guidelines', description: 'Chief complaint required for all E/M visits', emrProvided: true },
    { item: 'History of Present Illness', section: 'Subjective', category: 'critical', regulation: 'CMS E/M Guidelines', description: 'HPI required — location, quality, severity, duration, timing, context, modifying factors' },
    { item: 'Past Medical History', section: 'Subjective', category: 'critical', regulation: 'CMS E/M Guidelines', description: 'PMH required for new patient comprehensive visit', emrProvided: true },
    { item: 'Medications', section: 'Subjective', category: 'critical', regulation: 'Patient Safety', description: 'Current medication list required', emrProvided: true },
    { item: 'Allergies', section: 'Subjective', category: 'critical', regulation: 'Patient Safety Standards', description: 'Allergy documentation required for safety', emrProvided: true },
    { item: 'Review of Systems (14-system)', section: 'Subjective', category: 'critical', regulation: 'CMS E/M Guidelines', description: 'Complete ROS required for comprehensive new patient visit' },
    { item: 'General Appearance', section: 'Objective', category: 'critical', regulation: 'CMS E/M Guidelines', description: 'Physical exam required' },
    { item: 'Problem List', section: 'Assessment', category: 'critical', regulation: 'CMS E/M Guidelines', description: 'Problem list required' },
    { item: 'Medications Prescribed', section: 'Plan', category: 'required', regulation: 'CMS Prescribing', description: 'Treatment plan required', emrProvided: true },
    { item: 'Follow-Up Plan', section: 'Plan', category: 'required', regulation: 'Continuity of Care', description: 'Follow-up required' },
    { item: 'Social History', section: 'Subjective', category: 'required', regulation: 'CMS E/M Guidelines', description: 'Social history contributes to comprehensive history', emrProvided: true },
    { item: 'Family History', section: 'Subjective', category: 'required', regulation: 'CMS E/M Guidelines', description: 'Family history for comprehensive visit', emrProvided: true },
  ],

  'med-hp': [
    { item: 'Location', section: 'History of Present Illness', category: 'critical', regulation: 'CMS E/M HPI Elements', description: 'HPI element required' },
    { item: 'Quality', section: 'History of Present Illness', category: 'critical', regulation: 'CMS E/M HPI Elements', description: 'HPI element required' },
    { item: 'Severity', section: 'History of Present Illness', category: 'critical', regulation: 'CMS E/M HPI Elements', description: 'HPI element required' },
    { item: 'Duration', section: 'History of Present Illness', category: 'critical', regulation: 'CMS E/M HPI Elements', description: 'HPI element required' },
    { item: 'Medical Conditions', section: 'Past Medical/Surgical History', category: 'critical', regulation: 'CMS H&P Standards', description: 'PMH required for H&P', emrProvided: true },
    { item: 'Medications', section: 'Past Medical/Surgical History', category: 'critical', regulation: 'Patient Safety', description: 'Medication reconciliation required', emrProvided: true },
    { item: 'Allergies', section: 'Past Medical/Surgical History', category: 'critical', regulation: 'Patient Safety', description: 'Allergy list required', emrProvided: true },
    { item: 'Constitutional', section: 'Review of Systems', category: 'critical', regulation: 'CMS Complete ROS', description: 'Complete ROS required for comprehensive H&P' },
    { item: 'Vitals', section: 'Physical Examination', category: 'critical', regulation: 'Standard of Care', description: 'Vital signs required' },
    { item: 'Diagnosis/Impression', section: 'Assessment & Plan', category: 'critical', regulation: 'CMS MDM Requirements', description: 'Diagnosis required for medical decision making' },
    { item: 'Treatment Plan', section: 'Assessment & Plan', category: 'critical', regulation: 'CMS MDM Requirements', description: 'Treatment plan required' },
  ],
  'rehab-discharge': [
    // Critical — claim denial without these
    { item: 'Primary Diagnosis/ICD-10', section: 'Episode of Care Summary', category: 'critical', regulation: 'CMS Claims Processing', description: 'Diagnosis required for claim submission', emrProvided: true },
    { item: 'Date of Initial Evaluation', section: 'Episode of Care Summary', category: 'critical', regulation: 'Medicare Benefit Policy Manual Ch.15', description: 'Episode start date required' },
    { item: 'Date of Discharge', section: 'Episode of Care Summary', category: 'critical', regulation: 'Medicare Benefit Policy Manual Ch.15', description: 'Episode end date required' },
    { item: 'Total Visits Attended', section: 'Episode of Care Summary', category: 'critical', regulation: 'CMS Utilization Review', description: 'Visit count validates billing' },
    { item: 'Initial Functional Limitations', section: 'Initial Presentation', category: 'critical', regulation: 'CMS Functional Reporting', description: 'Baseline function required to measure outcomes' },
    { item: 'Discharge ROM vs Initial ROM', section: 'Objective Outcomes — Discharge vs Initial', category: 'critical', regulation: 'CMS Documentation Standards', description: 'Objective change measurement required' },
    { item: 'Discharge MMT vs Initial MMT', section: 'Objective Outcomes — Discharge vs Initial', category: 'critical', regulation: 'CMS Documentation Standards', description: 'Strength outcome measurement required' },
    { item: 'Discharge Pain Level vs Initial', section: 'Objective Outcomes — Discharge vs Initial', category: 'critical', regulation: 'CMS Quality Measures', description: 'Pain outcome tracking required' },
    { item: 'Discharge Functional Level', section: 'Discharge Assessment', category: 'critical', regulation: 'CMS Functional Reporting', description: 'Final function level demonstrates outcome' },
    { item: 'Discharge Reason (goals met / plateau / non-compliance / insurance / patient request / physician order)', section: 'Discharge Assessment', category: 'critical', regulation: 'Medicare Benefit Policy Manual Ch.15 §220.3', description: 'Discharge rationale required to close episode' },
    { item: 'Overall Goal Achievement Percentage', section: 'Goal Achievement', category: 'critical', regulation: 'CMS Outcome Measures', description: 'Goal attainment summary validates treatment' },
    // Required — strengthens claim
    { item: 'Interventions Provided', section: 'Treatment Summary', category: 'required', regulation: 'CPT Billing Standards', description: 'Treatment summary supports skilled care' },
    { item: 'Home Exercise Program (Final)', section: 'Discharge Plan', category: 'required', regulation: 'Medicare Benefit Policy Manual', description: 'HEP at discharge demonstrates patient independence' },
    { item: 'Follow-Up Recommendations', section: 'Discharge Plan', category: 'required', regulation: 'Continuity of Care', description: 'Follow-up plan ensures care continuity' },
    { item: 'Remaining Deficits', section: 'Discharge Assessment', category: 'required', regulation: 'CMS Documentation Standards', description: 'Remaining deficits justify discharge timing' },
    { item: 'Return to Therapy Criteria', section: 'Discharge Plan', category: 'required', regulation: 'Best Practice', description: 'Return criteria document ongoing medical necessity awareness' },
    { item: 'Patient Verbalized Understanding', section: 'Discharge Plan', category: 'required', regulation: 'Patient Safety', description: 'Patient education confirmation required' },
    // Recommended
    { item: 'Minimal Clinically Important Difference (MCID) Achieved', section: 'Functional Outcome Measures', category: 'recommended', regulation: 'CMS MIPS Quality', description: 'MCID demonstrates clinically meaningful improvement' },
    { item: 'Community Resources', section: 'Discharge Plan', category: 'recommended', regulation: 'Best Practice', description: 'Community resources support continued recovery' },
  ],

  'med-discharge': [
    { item: 'Admission Date', section: 'Administrative Data', category: 'critical', regulation: 'CMS CoP §482.24(c)(2)', description: 'Required for discharge summary', emrProvided: true },
    { item: 'Discharge Date', section: 'Administrative Data', category: 'critical', regulation: 'CMS CoP §482.24(c)(2)', description: 'Required for discharge summary', emrProvided: true },
    { item: 'Primary Diagnosis/ICD-10', section: 'Administrative Data', category: 'critical', regulation: 'CMS Claims Processing', description: 'Principal diagnosis required', emrProvided: true },
    { item: 'Clinical Course by Problem', section: 'Hospital Course', category: 'critical', regulation: 'CMS CoP §482.24(c)(2)', description: 'Hospital course required in discharge summary' },
    { item: 'Condition at Discharge', section: 'Discharge Status', category: 'critical', regulation: 'CMS CoP §482.24(c)(2)', description: 'Discharge condition required' },
    { item: 'Discharge Medications (name/dose/route/frequency)', section: 'Medication Reconciliation', category: 'critical', regulation: 'Joint Commission NPSG 03.06.01', description: 'Medication reconciliation required at discharge' },
    { item: 'Disposition (home / SNF / rehab / LTAC / hospice)', section: 'Discharge Plan', category: 'critical', regulation: 'CMS CoP §482.24(c)(2)', description: 'Discharge disposition required' },
    { item: 'Follow-Up Appointments', section: 'Discharge Plan', category: 'critical', regulation: 'CMS Quality Measures', description: 'Follow-up within 7 days reduces readmission' },
    { item: 'Return to ED Criteria', section: 'Discharge Plan', category: 'required', regulation: 'Patient Safety', description: 'Warning signs for emergency return' },
    { item: 'Patient Education Provided', section: 'Discharge Plan', category: 'required', regulation: 'Joint Commission PC.04.01.05', description: 'Discharge education documented' },
    { item: 'Pending Labs/Studies', section: 'Discharge Plan', category: 'required', regulation: 'Patient Safety', description: 'Pending results must be communicated' },
  ],

  'bh-discharge': [
    { item: 'Primary Diagnosis (DSM-5/ICD-10)', section: 'Treatment Episode Summary', category: 'critical', regulation: 'CMS Claims Processing', description: 'Diagnosis required for billing', emrProvided: true },
    { item: 'Total Sessions Attended', section: 'Treatment Episode Summary', category: 'critical', regulation: 'CMS Utilization Review', description: 'Session count validates billing' },
    { item: 'Discharge PHQ-9 Score', section: 'Treatment Outcomes', category: 'critical', regulation: 'HEDIS Follow-Up Measures', description: 'Standardized outcome required' },
    { item: 'Symptom Trajectory (improved/stable/worsened)', section: 'Treatment Outcomes', category: 'critical', regulation: 'SAMHSA TIP Standards', description: 'Treatment response documentation required' },
    { item: 'Discharge Reason (treatment complete / plateau / non-compliance / patient request / insurance / relocation / transfer)', section: 'Discharge Assessment', category: 'critical', regulation: 'Payer Requirements', description: 'Termination rationale required' },
    { item: 'Safety Assessment at Discharge', section: 'Discharge Assessment', category: 'critical', regulation: 'Joint Commission NPSG 15.01.01', description: 'Safety assessment at discharge required' },
    { item: 'Ongoing Medication Plan', section: 'Continuing Care Plan', category: 'critical', regulation: 'Prescribing Standards', description: 'Medication continuity plan required' },
    { item: 'Goal Achievement Summary', section: 'Treatment Outcomes', category: 'required', regulation: 'Treatment Plan Standards', description: 'Goal attainment documents treatment effectiveness' },
    { item: 'Relapse Prevention Strategies', section: 'Continuing Care Plan', category: 'required', regulation: 'SAMHSA Best Practice', description: 'Relapse prevention supports sustained recovery' },
    { item: 'Crisis Plan (updated)', section: 'Continuing Care Plan', category: 'required', regulation: 'Joint Commission BHC', description: 'Updated crisis plan for post-discharge safety' },
    { item: 'PCP Notification', section: 'Continuing Care Plan', category: 'required', regulation: 'Care Coordination Standards', description: 'PCP communication supports integrated care' },
  ],
  'med-ed': [
    // Critical
    { item: 'Chief Complaint', section: 'Triage & Presentation', category: 'critical', regulation: 'CMS E/M Guidelines 2024', description: 'Chief complaint required for all E/M encounters' },
    { item: 'Triage Level (ESI 1-5)', section: 'Triage & Presentation', category: 'critical', regulation: 'ACEP Triage Guidelines', description: 'ESI level determines resource allocation and billing support' },
    { item: 'Vital Signs at Triage', section: 'Triage & Presentation', category: 'critical', regulation: 'CMS E/M Documentation', description: 'Initial vital signs required for acuity assessment' },
    { item: 'Location', section: 'History of Present Illness', category: 'critical', regulation: 'CMS E/M Guidelines 2024', description: 'HPI elements required for E/M documentation' },
    { item: 'MDM Level (Straightforward/Low/Moderate/High)', section: 'Medical Decision Making', category: 'critical', regulation: 'AMA CPT E/M MDM Table 2024', description: 'MDM complexity drives ED E/M code level (99281-99285)' },
    { item: 'Number/Complexity of Problems', section: 'Medical Decision Making', category: 'critical', regulation: 'AMA CPT E/M MDM Table', description: 'Problem complexity is MDM element 1 of 3' },
    { item: 'Risk of Complications/Morbidity', section: 'Medical Decision Making', category: 'critical', regulation: 'AMA CPT E/M MDM Table', description: 'Risk assessment is MDM element 3 of 3' },
    { item: 'Disposition (Discharge/Admit/Transfer)', section: 'Disposition & Discharge', category: 'critical', regulation: 'EMTALA 42 CFR 489.24', description: 'Disposition required for all ED encounters' },
    { item: 'Discharge Diagnosis', section: 'Disposition & Discharge', category: 'critical', regulation: 'CMS ICD-10 Coding Guidelines', description: 'Final diagnosis required for claim submission' },
    { item: 'Return Precautions/Red Flags', section: 'Disposition & Discharge', category: 'critical', regulation: 'ACEP Risk Management Guidelines', description: 'Return precautions reduce malpractice risk and ensure patient safety' },
    // Required
    { item: 'Mode of Arrival', section: 'Triage & Presentation', category: 'required', regulation: 'ED Documentation Standards', description: 'Arrival mode supports acuity documentation' },
    { item: 'Allergies', section: 'Triage & Presentation', category: 'required', regulation: 'Joint Commission NPSG.03.06.01', description: 'Allergy documentation required before medication administration' },
    { item: 'Past Medical History', section: 'Past History & Review', category: 'required', regulation: 'CMS E/M Guidelines', description: 'PMH context supports MDM complexity assessment' },
    { item: 'Medications', section: 'Past History & Review', category: 'required', regulation: 'Joint Commission MM Standards', description: 'Medication reconciliation required for safe prescribing' },
    { item: 'General Appearance/Distress Level', section: 'Physical Examination', category: 'required', regulation: 'CMS E/M Exam Elements', description: 'General appearance establishes clinical context' },
    { item: 'Vital Signs (full set)', section: 'Physical Examination', category: 'required', regulation: 'CMS E/M Documentation', description: 'Full vital signs required for comprehensive exam' },
    { item: 'Data Reviewed/Ordered', section: 'Medical Decision Making', category: 'required', regulation: 'AMA CPT E/M MDM Table', description: 'Data element is MDM element 2 of 3' },
    { item: 'Differential Diagnosis', section: 'Medical Decision Making', category: 'required', regulation: 'ACEP Clinical Policy', description: 'Differential supports MDM complexity and risk documentation' },
    { item: 'Treatments Administered', section: 'ED Course & Reassessment', category: 'required', regulation: 'ED Documentation Standards', description: 'Treatment documentation required for billing and continuity' },
    { item: 'Medications Given (with time)', section: 'ED Course & Reassessment', category: 'required', regulation: 'Joint Commission MM Standards', description: 'Medication times required for MAR accuracy' },
    { item: 'Response to Treatment', section: 'ED Course & Reassessment', category: 'required', regulation: 'ED Documentation Standards', description: 'Response documentation supports disposition decision' },
    { item: 'Reassessment Vital Signs', section: 'ED Course & Reassessment', category: 'required', regulation: 'ACEP Clinical Policy', description: 'Repeat vitals document clinical trajectory' },
    { item: 'Follow-Up Instructions', section: 'Disposition & Discharge', category: 'required', regulation: 'CMS Discharge Planning', description: 'Follow-up plan required for continuity of care' },
    { item: 'Discharge Condition', section: 'Disposition & Discharge', category: 'required', regulation: 'CMS Conditions of Participation', description: 'Condition at discharge documents stability for safe release' },
    // Recommended
    { item: 'Last Oral Intake', section: 'Triage & Presentation', category: 'recommended', regulation: 'ASA Pre-Procedure Guidelines', description: 'NPO status important if procedural sedation needed' },
    { item: 'Tetanus Status', section: 'Triage & Presentation', category: 'recommended', regulation: 'CDC Immunization Guidelines', description: 'Tetanus status for wound management encounters' },
    { item: 'EKG Interpretation', section: 'Diagnostic Workup', category: 'recommended', regulation: 'ACEP Chest Pain Clinical Policy', description: 'EKG interpretation for cardiac-related complaints' },
    { item: 'Time-Based Documentation', section: 'ED Course & Reassessment', category: 'recommended', regulation: 'CMS Critical Care Guidelines', description: 'Time documentation supports critical care billing (99291-99292)' },
    { item: 'EMTALA Compliance (if transfer)', section: 'Disposition & Discharge', category: 'recommended', regulation: 'EMTALA 42 CFR 489.24', description: 'Transfer documentation required if patient moved to another facility' },
    { item: 'Patient Education Given', section: 'Disposition & Discharge', category: 'recommended', regulation: 'Joint Commission PC Standards', description: 'Education documentation supports quality metrics' },
  ],
    'med-procedure': [
    { item: 'Indication', section: 'Pre-Procedure', category: 'critical', regulation: 'CMS Procedure Documentation Guidelines', description: 'Medical indication required for procedure justification' },
    { item: 'Informed Consent', section: 'Pre-Procedure', category: 'critical', regulation: 'Joint Commission RI.01.03.01', description: 'Documented informed consent required before procedure' },
    { item: 'Time-Out Verification', section: 'Pre-Procedure', category: 'critical', regulation: 'Joint Commission UP.01.01.01', description: 'Universal protocol time-out required' },
    { item: 'Procedure Name/CPT', section: 'Procedure Details', category: 'critical', regulation: 'AMA CPT Surgical Package Rules', description: 'Procedure name and CPT code required for billing' },
    { item: 'Performing Provider', section: 'Procedure Details', category: 'critical', regulation: 'CMS CoP', description: 'Provider identification required' },
    { item: 'Technique Description', section: 'Procedure Details', category: 'critical', regulation: 'CMS Procedure Documentation', description: 'Step-by-step technique required for medical necessity' },
    { item: 'Complications', section: 'Procedure Details', category: 'critical', regulation: 'CMS Quality Reporting', description: 'Complication documentation required' },
    { item: 'Findings', section: 'Post-Procedure', category: 'required', regulation: 'CMS Procedure Documentation', description: 'Procedure findings support diagnosis and follow-up' },
    { item: 'Patient Condition', section: 'Post-Procedure', category: 'required', regulation: 'CMS CoP', description: 'Post-procedure patient status documentation' },
    { item: 'Follow-Up Plan', section: 'Post-Procedure', category: 'required', regulation: 'Best Practice', description: 'Post-procedure follow-up ensures continuity' },
    { item: 'Anesthesia Type', section: 'Procedure Details', category: 'required', regulation: 'CMS Anesthesia Documentation', description: 'Anesthesia type required for coding and safety' },
    { item: 'Pre-Procedure Assessment', section: 'Pre-Procedure', category: 'recommended', regulation: 'Best Practice', description: 'Baseline assessment supports complication identification' },
    { item: 'Wound Care', section: 'Post-Procedure', category: 'recommended', regulation: 'Best Practice', description: 'Wound care instructions prevent complications' },
  ],
  'med-awv': [
    { item: 'Demographics', section: 'Health Risk Assessment', category: 'critical', regulation: 'CMS MLN ICN 905706', description: 'Patient demographics required for AWV billing', emrProvided: true },
    { item: 'Self-Assessment of Health', section: 'Health Risk Assessment', category: 'critical', regulation: 'CMS MLN ICN 905706', description: 'Health risk assessment questionnaire required' },
    { item: 'ADL/IADL Assessment', section: 'Health Risk Assessment', category: 'critical', regulation: 'CMS MLN ICN 905706', description: 'Functional status assessment required for AWV' },
    { item: 'Depression Screening (PHQ-9)', section: 'Examination Elements', category: 'critical', regulation: 'CMS MLN ICN 905706', description: 'Depression screening required per AWV guidelines' },
    { item: 'Cognitive Assessment', section: 'Examination Elements', category: 'critical', regulation: 'CMS MLN ICN 905706', description: 'Cognitive assessment required for AWV' },
    { item: 'Height/Weight/BMI', section: 'Examination Elements', category: 'critical', regulation: 'CMS MLN ICN 905706', description: 'BMI measurement required' },
    { item: 'Blood Pressure', section: 'Examination Elements', category: 'critical', regulation: 'CMS MLN ICN 905706', description: 'Blood pressure screening required' },
    { item: 'Screening Schedule', section: 'Personalized Prevention Plan', category: 'critical', regulation: 'CMS MLN ICN 905706 / USPSTF', description: 'Personalized screening schedule required for AWV' },
    { item: 'Medications/Supplements', section: 'Medical/Family History Update', category: 'required', regulation: 'CMS MLN ICN 905706', description: 'Medication list review required' },
    { item: 'Fall Risk Screening', section: 'Health Risk Assessment', category: 'required', regulation: 'CMS MLN ICN 905706', description: 'Fall risk assessment recommended for elderly' },
    { item: 'Advance Care Planning', section: 'Personalized Prevention Plan', category: 'recommended', regulation: 'CMS ACP Add-On 99497', description: 'ACP discussion billable as add-on' },
    { item: 'Immunization Schedule', section: 'Personalized Prevention Plan', category: 'recommended', regulation: 'USPSTF/ACIP', description: 'Immunization review strengthens preventive care documentation' },
  ],
  'rehab-ot-eval': [
    { item: 'Referral Reason', section: 'Occupational Profile', category: 'critical', regulation: 'Medicare Benefit Policy Manual Ch.15', description: 'Referral and diagnosis required for OT services', emrProvided: true },
    { item: 'Prior Level of Function', section: 'Occupational Profile', category: 'critical', regulation: 'Medicare Benefit Policy Manual Ch.15 §220.3', description: 'Baseline function required for goal setting' },
    { item: 'ADL/IADL Status', section: 'Occupational Profile', category: 'critical', regulation: 'AOTA OTPF-4', description: 'ADL performance assessment core to OT eval' },
    { item: 'OT Diagnosis', section: 'Assessment', category: 'critical', regulation: 'AOTA Documentation Guidelines', description: 'OT clinical impression required' },
    { item: 'Functional Limitations', section: 'Assessment', category: 'critical', regulation: 'CMS Functional Reporting', description: 'Functional limitations must be documented' },
    { item: 'Short-Term Goals', section: 'Plan of Care', category: 'critical', regulation: 'Medicare Benefit Policy Manual Ch.15 §220.3', description: 'Measurable goals with timeframes required' },
    { item: 'Long-Term Goals', section: 'Plan of Care', category: 'critical', regulation: 'Medicare Benefit Policy Manual Ch.15 §220.3', description: 'Discharge-oriented goals required' },
    { item: 'Frequency/Duration', section: 'Plan of Care', category: 'critical', regulation: 'Medicare Benefit Policy Manual Ch.15', description: 'Treatment frequency and duration required' },
    { item: 'UE Active ROM', section: 'Client Factors', category: 'required', regulation: 'CMS Documentation Standards', description: 'Objective UE measurements support impairment documentation' },
    { item: 'Grip/Pinch Strength', section: 'Client Factors', category: 'required', regulation: 'CMS Documentation Standards', description: 'Strength assessment for functional correlation' },
    { item: 'Rehab Potential', section: 'Assessment', category: 'required', regulation: 'Medicare Benefit Policy Manual Ch.15 §220.2', description: 'Rehab potential assessment supports medical necessity' },
    { item: 'Client Goals/Priorities', section: 'Occupational Profile', category: 'recommended', regulation: 'Patient-Centered Care', description: 'Patient goals support person-centered documentation' },
  ],
  'rehab-slp-eval': [
    { item: 'Referral Source/Diagnosis', section: 'Case History', category: 'critical', regulation: 'Medicare Benefit Policy Manual Ch.15 §220.3', description: 'Referral and diagnosis required for SLP services', emrProvided: true },
    { item: 'Onset/Course', section: 'Case History', category: 'critical', regulation: 'ASHA Practice Guidelines', description: 'Onset and course establish medical necessity timeline' },
    { item: 'Articulation/Phonology', section: 'Speech & Language Assessment', category: 'critical', regulation: 'ASHA Assessment Standards', description: 'Core speech assessment required' },
    { item: 'Receptive Language', section: 'Speech & Language Assessment', category: 'critical', regulation: 'ASHA Assessment Standards', description: 'Language comprehension assessment required' },
    { item: 'Expressive Language', section: 'Speech & Language Assessment', category: 'critical', regulation: 'ASHA Assessment Standards', description: 'Language expression assessment required' },
    { item: 'SLP Diagnosis', section: 'Plan of Care', category: 'critical', regulation: 'ASHA Documentation Guidelines', description: 'SLP diagnosis required for treatment plan' },
    { item: 'Goals', section: 'Plan of Care', category: 'critical', regulation: 'Medicare Benefit Policy Manual Ch.15 §220.3', description: 'Measurable treatment goals required' },
    { item: 'Frequency/Duration', section: 'Plan of Care', category: 'critical', regulation: 'Medicare Benefit Policy Manual Ch.15', description: 'Treatment frequency and duration required' },
    { item: 'Clinical Swallow Evaluation', section: 'Swallowing Assessment', category: 'required', regulation: 'ASHA Dysphagia Guidelines', description: 'Swallow assessment when dysphagia is indicated' },
    { item: 'Oral Sensation', section: 'Oral Mechanism Exam', category: 'required', regulation: 'ASHA OME Standards', description: 'Oral mechanism exam supports diagnosis' },
    { item: 'Patient/Family Concerns', section: 'Case History', category: 'recommended', regulation: 'Patient-Centered Care', description: 'Patient concerns support person-centered care' },
  ],
  'rehab-progress': [
    { item: 'Diagnosis/ICD-10', section: 'Treatment Summary', category: 'critical', regulation: 'Medicare Benefit Policy Manual Ch.15 §220.3', description: 'Diagnosis required on progress report', emrProvided: true },
    { item: 'Treatment Frequency', section: 'Treatment Summary', category: 'critical', regulation: 'CMS Progress Report Requirements', description: 'Treatment frequency documentation required' },
    { item: 'Initial vs. Current Measurements', section: 'Objective Progress', category: 'critical', regulation: 'CMS Progress Report Requirements', description: 'Objective comparison demonstrates progress' },
    { item: 'Goal Achievement Status', section: 'Objective Progress', category: 'critical', regulation: 'CMS Progress Report Requirements', description: 'Goal status required to justify continued care' },
    { item: 'Complexity Requiring Skilled Care', section: 'Skilled Need Justification', category: 'critical', regulation: 'Medicare Benefit Policy Manual Ch.15 §220.2', description: 'Skilled need justification required for continued authorization' },
    { item: 'Why Non-Skilled Alternatives Insufficient', section: 'Skilled Need Justification', category: 'critical', regulation: 'Medicare Benefit Policy Manual Ch.15 §220.2', description: 'Must explain why skilled care is needed over alternatives' },
    { item: 'Revised Frequency/Duration', section: 'Updated Plan', category: 'critical', regulation: 'CMS Progress Report Requirements', description: 'Updated plan required' },
    { item: 'Outcome Measure Comparison', section: 'Objective Progress', category: 'required', regulation: 'CMS Functional Reporting', description: 'Standardized outcome measures strengthen progress documentation' },
    { item: 'Goals Modified', section: 'Goal Update', category: 'required', regulation: 'CMS Progress Report Requirements', description: 'Goal modifications must be documented' },
    { item: 'Anticipated Discharge Date', section: 'Updated Plan', category: 'recommended', regulation: 'Best Practice', description: 'Projected discharge supports care planning' },
  ],
  'bh-intake': [
    { item: 'Chief Complaint (patient words)', section: 'Presenting Problem', category: 'critical', regulation: 'APA Practice Guidelines', description: 'Chief complaint in patient words required' },
    { item: 'History of Present Illness', section: 'Presenting Problem', category: 'critical', regulation: 'APA Practice Guidelines', description: 'HPI required for diagnostic formulation' },
    { item: 'Suicidal Ideation (Columbia Protocol)', section: 'Risk Assessment', category: 'critical', regulation: 'Joint Commission NPSG 15.01.01', description: 'Suicide risk screening required at intake' },
    { item: 'Homicidal Ideation', section: 'Risk Assessment', category: 'critical', regulation: 'Duty to Warn / Tarasoff', description: 'Homicidal ideation screening required' },
    { item: 'Risk Level Determination', section: 'Risk Assessment', category: 'critical', regulation: 'Joint Commission NPSG 15.01.01', description: 'Overall risk level must be determined' },
    { item: 'DSM-5-TR Diagnoses', section: 'Diagnostic Formulation', category: 'critical', regulation: 'DSM-5-TR / ICD-10', description: 'Diagnostic formulation required for treatment planning and billing' },
    { item: 'Treatment Goals', section: 'Treatment Plan', category: 'critical', regulation: 'Joint Commission BHC Standards', description: 'Treatment goals required' },
    { item: 'Appearance', section: 'Mental Status Examination', category: 'critical', regulation: 'APA MSE Standards', description: 'MSE required at intake' },
    { item: 'Mood (patient report)', section: 'Mental Status Examination', category: 'critical', regulation: 'APA MSE Standards', description: 'Mood assessment required' },
    { item: 'Affect (observed)', section: 'Mental Status Examination', category: 'critical', regulation: 'APA MSE Standards', description: 'Affect observation required' },
    { item: 'Thought Content', section: 'Mental Status Examination', category: 'critical', regulation: 'APA MSE Standards', description: 'Thought content assessment required for safety' },
    { item: 'Alcohol Use (AUDIT-C)', section: 'Substance Use History', category: 'required', regulation: 'SAMHSA TIP Series / SBIRT', description: 'Substance use screening required' },
    { item: 'Safety Plan', section: 'Risk Assessment', category: 'required', regulation: 'Joint Commission NPSG 15.01.01', description: 'Safety plan required when risk identified' },
    { item: 'Therapeutic Approach', section: 'Treatment Plan', category: 'required', regulation: 'APA Practice Guidelines', description: 'Treatment modality should be documented' },
    { item: 'Trauma/Adverse Childhood Experiences', section: 'Social History', category: 'recommended', regulation: 'SAMHSA Trauma-Informed Care', description: 'Trauma screening best practice' },
  ],
  'bh-progress': [
    { item: 'Patient Presentation', section: 'Subjective / Data', category: 'critical', regulation: 'APA Record Keeping Guidelines', description: 'Patient presentation required each session' },
    { item: 'Risk Screen Update', section: 'Subjective / Data', category: 'critical', regulation: 'Joint Commission NPSG 15.01.01', description: 'Ongoing risk screening required' },
    { item: 'Interventions Used', section: 'Assessment / Clinical Impression', category: 'critical', regulation: 'APA Practice Guidelines', description: 'Therapeutic interventions must be documented' },
    { item: 'Progress Toward Goals', section: 'Assessment / Clinical Impression', category: 'critical', regulation: 'Joint Commission BHC Standards', description: 'Progress tracking required' },
    { item: 'Next Session Focus', section: 'Plan', category: 'required', regulation: 'APA Record Keeping', description: 'Treatment continuity planning' },
    { item: 'Session Theme/Focus', section: 'Assessment / Clinical Impression', category: 'required', regulation: 'APA Record Keeping', description: 'Session content documentation' },
    { item: 'Medication Considerations', section: 'Plan', category: 'recommended', regulation: 'Best Practice', description: 'Medication coordination when applicable' },
  ],
  'bh-psych-eval': [
    { item: 'Chief Complaint', section: 'Chief Complaint & HPI', category: 'critical', regulation: 'APA Practice Guidelines', description: 'Chief complaint required' },
    { item: 'History of Present Illness', section: 'Chief Complaint & HPI', category: 'critical', regulation: 'APA Practice Guidelines', description: 'Psychiatric HPI required for diagnosis' },
    { item: 'SI/HI Screen', section: 'Risk Assessment', category: 'critical', regulation: 'Joint Commission NPSG 15.01.01', description: 'Suicide/homicide screening required' },
    { item: 'Risk Level', section: 'Risk Assessment', category: 'critical', regulation: 'Joint Commission NPSG 15.01.01', description: 'Risk level determination required' },
    { item: 'DSM-5-TR Diagnoses', section: 'Formulation & Plan', category: 'critical', regulation: 'DSM-5-TR / APA', description: 'Diagnostic formulation required' },
    { item: 'Medication Plan', section: 'Formulation & Plan', category: 'critical', regulation: 'APA Practice Guidelines', description: 'Medication plan required for psych eval' },
    { item: 'Appearance', section: 'Mental Status Examination', category: 'critical', regulation: 'APA MSE Standards', description: 'MSE required' },
    { item: 'Mood/Affect', section: 'Mental Status Examination', category: 'critical', regulation: 'APA MSE Standards', description: 'Mood and affect assessment required' },
    { item: 'Thought Process/Content', section: 'Mental Status Examination', category: 'critical', regulation: 'APA MSE Standards', description: 'Thought assessment required' },
    { item: 'Medication Trials (with response)', section: 'Psychiatric History', category: 'required', regulation: 'APA Practice Guidelines', description: 'Med history informs prescribing decisions' },
    { item: 'Current Use', section: 'Substance Use', category: 'required', regulation: 'SAMHSA/SBIRT', description: 'Substance use assessment required' },
    { item: 'Follow-Up Schedule', section: 'Formulation & Plan', category: 'recommended', regulation: 'Best Practice', description: 'Follow-up planning for continuity' },
  ],
  'bh-group': [
    { item: 'Group Name/Type', section: 'Group Information', category: 'critical', regulation: 'AGPA Practice Standards', description: 'Group identification required for billing' },
    { item: 'Members Present/Absent', section: 'Group Information', category: 'critical', regulation: 'CMS Group Therapy Billing', description: 'Attendance documentation required for billing' },
    { item: 'Participation Level', section: 'Individual Member Notes', category: 'critical', regulation: 'CMS Group Therapy Guidelines', description: 'Individual participation must be documented for each member' },
    { item: 'Interventions Directed', section: 'Individual Member Notes', category: 'critical', regulation: 'CMS Group Therapy Guidelines', description: 'Interventions per member required for medical necessity' },
    { item: 'Curriculum/Activity Delivered', section: 'Group Process', category: 'required', regulation: 'AGPA Practice Standards', description: 'Session content documentation' },
    { item: 'Individual Progress', section: 'Individual Member Notes', category: 'required', regulation: 'Joint Commission BHC', description: 'Progress tracking per member' },
    { item: 'Group Dynamics Observed', section: 'Group Process', category: 'recommended', regulation: 'Best Practice', description: 'Group process observations enhance documentation' },
  ],
  'bh-crisis': [
    { item: 'Nature of Crisis', section: 'Crisis Presentation', category: 'critical', regulation: 'SAMHSA Crisis Guidelines', description: 'Nature of crisis must be documented' },
    { item: 'Suicidal Ideation (C-SSRS)', section: 'Risk Assessment', category: 'critical', regulation: 'Columbia Protocol / Joint Commission', description: 'Standardized suicide assessment required in crisis' },
    { item: 'Plan/Intent/Means', section: 'Risk Assessment', category: 'critical', regulation: 'Joint Commission NPSG 15.01.01', description: 'Plan, intent, and means assessment critical for risk level' },
    { item: 'Risk Level Determination', section: 'Disposition', category: 'critical', regulation: 'Joint Commission NPSG 15.01.01', description: 'Risk level drives disposition decision' },
    { item: 'Level of Care Recommendation', section: 'Disposition', category: 'critical', regulation: 'SAMHSA / ASAM Criteria', description: 'Level of care recommendation required' },
    { item: 'Warning Signs', section: 'Safety Plan', category: 'critical', regulation: 'Stanley-Brown Safety Plan', description: 'Safety plan warning signs required' },
    { item: 'Emergency Contacts', section: 'Safety Plan', category: 'critical', regulation: 'Stanley-Brown Safety Plan', description: 'Emergency contacts on safety plan' },
    { item: 'De-escalation Techniques', section: 'Intervention', category: 'required', regulation: 'SAMHSA Crisis Guidelines', description: 'Intervention documentation required' },
    { item: 'Means Restriction Counseling', section: 'Intervention', category: 'required', regulation: 'Joint Commission NPSG 15.01.01', description: 'Means restriction counseling when applicable' },
    { item: 'Follow-Up Within 24-48hrs', section: 'Disposition', category: 'required', regulation: 'SAMHSA / Joint Commission', description: 'Post-crisis follow-up required' },
    { item: 'Precipitating Event', section: 'Crisis Presentation', category: 'recommended', regulation: 'Best Practice', description: 'Precipitating event helps inform treatment' },
  ],

};

// Calculate compliance score from extracted facts
// Deep recursive search through any JSON structure for a key with a documented value
function findDocumentedValue(obj: unknown, targetKey: string): boolean {
  if (!obj || typeof obj !== 'object') return false;
  
  for (const [key, val] of Object.entries(obj)) {
    const normalizedKey = key.toLowerCase().replace(/[^a-z0-9]/g, '_');
    
    // Direct key match with a documented value
    if (normalizedKey === targetKey || normalizedKey.includes(targetKey) || targetKey.includes(normalizedKey)) {
      if (val && typeof val === 'object' && 'value' in (val as Record<string, unknown>)) {
        const v = val as Record<string, unknown>;
        if (v.value !== null && v.source !== 'not_documented') return true;
      }
      if (typeof val === 'string' && val.trim() !== '' && val !== '___' && val.toLowerCase() !== 'null') return true;
    }
    
    // Recurse into nested objects/arrays
    if (typeof val === 'object' && val !== null) {
      if (findDocumentedValue(val, targetKey)) return true;
    }
  }
  return false;
}

// Search the entire facts JSON as a flattened string for keyword presence
function factsContainKeyword(facts: unknown, keyword: string): boolean {
  const flatText = JSON.stringify(facts).toLowerCase();
  const kw = keyword.toLowerCase();
  // Check for the keyword with a non-null value nearby
  const kwIndex = flatText.indexOf(kw);
  if (kwIndex === -1) return false;
  // Look for "value" nearby that isn't null
  const nearby = flatText.substring(Math.max(0, kwIndex - 100), Math.min(flatText.length, kwIndex + 200));
  if (nearby.includes('"value":null') || nearby.includes('"source":"not_documented"')) return false;
  if (nearby.includes('"value"') || nearby.includes('"transcript"')) return true;
  // If keyword appears in content at all (not as a key with null value)
  return true;
}

export function calculateCompliance(
  frameworkId: string,
  extractedFacts: string
): ComplianceResult {
  const requirements = cmsRequirements[frameworkId];
  if (!requirements) {
    return {
      cmsStatus: 'not_applicable',
      score: null,
      totalRequired: 0,
      documented: 0,
      missing: [],
      documented_items: [],
      grade: null,
      riskLevel: null,
      summary: 'CMS compliance scoring is not available for this template.',
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let facts: Record<string, any>;
  try {
    facts = JSON.parse(extractedFacts);
  } catch {
    return {
      cmsStatus: 'scored',
      score: 0, totalRequired: requirements.length, documented: 0,
      missing: requirements, documented_items: [], grade: 'F', riskLevel: 'critical',
      summary: 'Unable to parse extracted facts.',
    };
  }

  const documented: CMSRequirement[] = [];
  const missing: CMSRequirement[] = [];

  for (const req of requirements) {
    const sectionKey = req.section.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const itemKey = req.item.toLowerCase().replace(/[^a-z0-9]/g, '_');

    // Search through the facts for this item — flexible matching
    let found = false;
    
    // Try direct section.item lookup first
    const section = facts[sectionKey];
    if (section && typeof section === 'object') {
      const field = section[itemKey];
      if (field && typeof field === 'object' && field.value !== null && field.source !== 'not_documented') {
        found = true;
      }
      // Also try string values in section
      if (!found) {
        for (const [k, v] of Object.entries(section)) {
          const nk = k.toLowerCase().replace(/[^a-z0-9]/g, '_');
          if ((nk === itemKey || nk.includes(itemKey) || itemKey.includes(nk)) && v) {
            if (typeof v === 'object' && (v as Record<string, unknown>).value !== null && (v as Record<string, unknown>).source !== 'not_documented') { found = true; break; }
            if (typeof v === 'string' && v.trim() !== '' && v !== '___') { found = true; break; }
          }
        }
      }
    }
    
    // Deep recursive search through entire facts structure
    if (!found) {
      found = findDocumentedValue(facts, itemKey);
    }
    
    // Broad keyword search as last resort
    if (!found) {
      found = factsContainKeyword(facts, req.item);
    }

    // Also check additional_facts
    if (!found && facts.additional_facts) {
      for (const af of facts.additional_facts) {
        if (af.fact && af.fact.toLowerCase().includes(req.item.toLowerCase())) {
          found = true;
          break;
        }
      }
    }

    // Check patient_demographics for common fields
    if (!found && facts.patient_demographics) {
      const demoKey = req.item.toLowerCase().replace(/[^a-z0-9]/g, '_');
      const demoField = facts.patient_demographics[demoKey];
      if (demoField && demoField.value !== null && demoField.source !== 'not_documented') {
        found = true;
      }
    }

    if (found) {
      documented.push(req);
    } else {
      missing.push(req);
    }
  }

  const totalRequired = requirements.length;
  const score = Math.round((documented.length / totalRequired) * 100);

  // Calculate grade based on critical items
  const criticalMissing = missing.filter(r => r.category === 'critical');
  const requiredMissing = missing.filter(r => r.category === 'required');

  let grade: 'A' | 'B' | 'C' | 'D' | 'F';
  let riskLevel: 'low' | 'moderate' | 'high' | 'critical';

  if (criticalMissing.length === 0 && requiredMissing.length === 0) {
    grade = 'A'; riskLevel = 'low';
  } else if (criticalMissing.length === 0 && requiredMissing.length <= 2) {
    grade = 'B'; riskLevel = 'low';
  } else if (criticalMissing.length <= 2) {
    grade = 'C'; riskLevel = 'moderate';
  } else if (criticalMissing.length <= 4) {
    grade = 'D'; riskLevel = 'high';
  } else {
    grade = 'F'; riskLevel = 'critical';
  }

  const summaryParts: string[] = [];
  if (criticalMissing.length > 0) {
    summaryParts.push(`${criticalMissing.length} critical item${criticalMissing.length > 1 ? 's' : ''} missing — high denial risk`);
  }
  if (requiredMissing.length > 0) {
    summaryParts.push(`${requiredMissing.length} required item${requiredMissing.length > 1 ? 's' : ''} missing`);
  }
  const recommendedMissing = missing.filter(r => r.category === 'recommended');
  if (recommendedMissing.length > 0) {
    summaryParts.push(`${recommendedMissing.length} recommended item${recommendedMissing.length > 1 ? 's' : ''} would strengthen documentation`);
  }
  if (summaryParts.length === 0) {
    summaryParts.push('All CMS requirements documented — excellent compliance');
  }

  return {
    cmsStatus: 'scored',
    score,
    totalRequired,
    documented: documented.length,
    missing,
    documented_items: documented,
    grade,
    riskLevel,
    summary: summaryParts.join('. ') + '.',
  };
}
