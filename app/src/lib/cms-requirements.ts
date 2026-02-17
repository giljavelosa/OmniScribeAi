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
  score: number;                    // 0-100 percentage
  totalRequired: number;
  documented: number;
  missing: CMSRequirement[];
  documented_items: CMSRequirement[];
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
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
    { item: 'MCID Achieved', section: 'Functional Outcome Measures', category: 'recommended', regulation: 'CMS MIPS Quality', description: 'MCID demonstrates clinically meaningful improvement' },
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
};

// Calculate compliance score from extracted facts
export function calculateCompliance(
  frameworkId: string,
  extractedFacts: string
): ComplianceResult {
  const requirements = cmsRequirements[frameworkId];
  if (!requirements) {
    return {
      score: -1,
      totalRequired: 0,
      documented: 0,
      missing: [],
      documented_items: [],
      grade: 'A',
      riskLevel: 'low',
      summary: 'No CMS requirements defined for this framework yet.',
    };
  }

  let facts: Record<string, any>;
  try {
    facts = JSON.parse(extractedFacts);
  } catch {
    return {
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

    // Search through the facts for this item
    let found = false;
    const section = facts[sectionKey];
    if (section && typeof section === 'object') {
      const field = section[itemKey];
      if (field && field.value !== null && field.source !== 'not_documented') {
        found = true;
      }
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
