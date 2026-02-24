import { Domain, Framework, ProviderType } from './types';

export const frameworks: Framework[] = [
  // ═══════════════════════════════════════
  // MEDICAL DOMAIN
  // ═══════════════════════════════════════
  {
    id: 'med-soap-followup',
    domain: 'medical',
    type: 'SOAP',
    subtype: 'Follow-Up Visit',
    name: 'SOAP — Follow-Up Visit',
    description: 'Standard SOAP format for return visits. Tracks interval history, medication changes, and progress toward treatment goals.',
    regulatorySources: ['CMS E/M Guidelines 2024', 'AMA CPT Documentation Standards'],
    itemCount: 19,
    sections: [
      { id: 's', title: 'Subjective', items: ['Chief Complaint', 'Interval History', 'Medication Review', 'Review of Systems', 'Social/Functional Update'], required: true },
      { id: 'o', title: 'Objective', items: ['Vital Signs', 'Physical Examination', 'Diagnostic Results', 'Functional Assessment'], required: true },
      { id: 'a', title: 'Assessment', items: ['Problem List Update', 'Differential Refinement', 'Severity/Progression', 'Response to Treatment'], required: true },
      { id: 'p', title: 'Plan', items: ['Medication Changes', 'Diagnostic Orders', 'Referrals', 'Patient Education', 'Follow-Up Interval', 'Safety Netting'], required: true },
    ],
  },
  {
    id: 'med-soap-new',
    domain: 'medical',
    type: 'SOAP',
    subtype: 'New Patient',
    name: 'SOAP — New Patient',
    description: 'Comprehensive SOAP note for initial patient encounters. Captures full medical, surgical, family, and social history.',
    regulatorySources: ['CMS E/M Guidelines 2024', 'AMA CPT Documentation Standards', 'Joint Commission Standards'],
    itemCount: 29,
    sections: [
      { id: 's', title: 'Subjective', items: ['Chief Complaint', 'History of Present Illness', 'Past Medical History', 'Past Surgical History', 'Medications', 'Allergies', 'Family History', 'Social History', 'Review of Systems (14-system)'], required: true },
      { id: 'o', title: 'Objective', items: ['Vital Signs', 'General Appearance', 'HEENT', 'Cardiovascular', 'Respiratory', 'Abdominal', 'Musculoskeletal', 'Neurological', 'Psychiatric', 'Skin', 'Diagnostic Results'], required: true },
      { id: 'a', title: 'Assessment', items: ['Problem List', 'Differential Diagnosis', 'Clinical Decision-Making Complexity'], required: true },
      { id: 'p', title: 'Plan', items: ['Medications Prescribed', 'Diagnostic Orders', 'Referrals', 'Patient Education', 'Preventive Care', 'Follow-Up Plan'], required: true },
    ],
  },
  {
    id: 'med-hp',
    domain: 'medical',
    type: 'H&P',
    subtype: 'History & Physical',
    name: 'H&P — Full History & Physical',
    description: 'Complete history and physical examination format for admissions and comprehensive evaluations.',
    regulatorySources: ['CMS E/M Guidelines 2024', 'Joint Commission RC.02.01.01', 'AMA CPT Appendix C'],
    itemCount: 50,
    sections: [
      { id: 'hpi', title: 'History of Present Illness', items: ['Location', 'Quality', 'Severity', 'Duration', 'Timing', 'Context', 'Modifying Factors', 'Associated Signs/Symptoms'], required: true },
      { id: 'pmh', title: 'Past Medical/Surgical History', items: ['Medical Conditions', 'Surgical History', 'Hospitalizations', 'Medications', 'Allergies', 'Immunizations'], required: true },
      { id: 'fsh', title: 'Family & Social History', items: ['Family Medical History', 'Tobacco Use', 'Alcohol Use', 'Substance Use', 'Occupation', 'Living Situation', 'Exercise/Diet'], required: true },
      { id: 'ros', title: 'Review of Systems', items: ['Constitutional', 'Eyes', 'ENT', 'Cardiovascular', 'Respiratory', 'GI', 'GU', 'Musculoskeletal', 'Integumentary', 'Neurological', 'Psychiatric', 'Endocrine', 'Heme/Lymph', 'Immunologic'], required: true },
      { id: 'pe', title: 'Physical Examination', items: ['Vitals', 'General', 'HEENT', 'Neck', 'Chest/Lungs', 'Heart', 'Abdomen', 'Extremities', 'Neuro', 'Skin', 'Psych'], required: true },
      { id: 'ap', title: 'Assessment & Plan', items: ['Diagnosis/Impression', 'Medical Decision Making', 'Treatment Plan', 'Disposition'], required: true },
    ],
  },
  {
    id: 'med-procedure',
    domain: 'medical',
    type: 'Procedure Note',
    subtype: 'Procedure Note',
    name: 'Procedure Note',
    description: 'Standardized documentation for in-office and bedside procedures including consent, technique, and outcomes.',
    regulatorySources: ['CMS Procedure Documentation Guidelines', 'AMA CPT Surgical Package Rules', 'Joint Commission UP.01.01.01'],
    itemCount: 18,
    sections: [
      { id: 'pre', title: 'Pre-Procedure', items: ['Indication', 'Informed Consent', 'Time-Out Verification', 'Pre-Procedure Assessment', 'Allergies/Medications'], required: true },
      { id: 'proc', title: 'Procedure Details', items: ['Procedure Name/CPT', 'Date/Time/Location', 'Performing Provider', 'Anesthesia Type', 'Technique Description', 'Specimens Obtained', 'Estimated Blood Loss', 'Complications'], required: true },
      { id: 'post', title: 'Post-Procedure', items: ['Patient Condition', 'Findings', 'Instructions Given', 'Follow-Up Plan', 'Wound Care'], required: true },
    ],
  },
  {
    id: 'med-awv',
    domain: 'medical',
    type: 'SOAP',
    subtype: 'Annual Wellness Visit',
    name: 'Annual Wellness Visit (AWV)',
    description: 'Medicare Annual Wellness Visit template with health risk assessment, screening schedules, and personalized prevention plan.',
    regulatorySources: ['CMS MLN Booklet ICN 905706', 'USPSTF Screening Recommendations', 'Medicare Preventive Services'],
    itemCount: 23,
    sections: [
      { id: 'hra', title: 'Health Risk Assessment', items: ['Demographics', 'Self-Assessment of Health', 'Psychosocial Risks', 'Behavioral Risks', 'ADL/IADL Assessment', 'Fall Risk Screening'], required: true },
      { id: 'hx', title: 'Medical/Family History Update', items: ['Conditions Update', 'Surgical History', 'Family History', 'Current Providers', 'Medications/Supplements'], required: true },
      { id: 'exam', title: 'Examination Elements', items: ['Height/Weight/BMI', 'Blood Pressure', 'Visual Acuity', 'Cognitive Assessment', 'Depression Screening (PHQ-9)', 'Hearing Assessment'], required: true },
      { id: 'ppps', title: 'Personalized Prevention Plan', items: ['Screening Schedule', 'Immunization Schedule', 'Community Resources', 'Advance Care Planning', 'Referrals', 'Risk Factor Counseling'], required: true },
    ],
  },

    {
    id: 'med-ed',
    domain: 'medical',
    type: 'ED Note',
    subtype: 'Emergency/Urgent Care',
    name: 'Emergency / Urgent Care Note',
    description: 'Emergency department and urgent care visit documentation with triage, medical decision-making complexity, and disposition.',
    regulatorySources: ['CMS E/M Guidelines 2024', 'ACEP Clinical Policy Guidelines', 'AMA CPT ED Codes 99281-99285', 'EMTALA Requirements'],
    itemCount: 63,
    sections: [
      { id: 'triage', title: 'Triage & Presentation', items: ['Mode of Arrival', 'Triage Level (ESI 1-5)', 'Chief Complaint', 'Onset/Duration', 'Vital Signs at Triage', 'Pain Assessment (NPRS)', 'Allergies', 'Last Oral Intake', 'Tetanus Status'], required: true },
      { id: 'hpi', title: 'History of Present Illness', items: ['Location', 'Quality', 'Severity', 'Duration', 'Timing', 'Context/Mechanism of Injury', 'Modifying Factors', 'Associated Symptoms', 'Prior Episodes', 'Treatment Prior to Arrival'], required: true },
      { id: 'pmh', title: 'Past History & Review', items: ['Past Medical History', 'Past Surgical History', 'Medications', 'Social History', 'Family History (pertinent)', 'Review of Systems'], required: true },
      { id: 'exam', title: 'Physical Examination', items: ['General Appearance/Distress Level', 'Vital Signs (full set)', 'HEENT', 'Neck', 'Cardiovascular', 'Respiratory', 'Abdomen', 'Musculoskeletal', 'Neurological', 'Skin/Wounds', 'Psychiatric'], required: true },
      { id: 'workup', title: 'Diagnostic Workup', items: ['Labs Ordered/Results', 'Imaging Ordered/Results', 'EKG Interpretation', 'Point-of-Care Testing', 'Procedures Performed', 'Consultant Recommendations'], required: true },
      { id: 'mdm', title: 'Medical Decision Making', items: ['Number/Complexity of Problems', 'Data Reviewed/Ordered', 'Risk of Complications/Morbidity', 'MDM Level (Straightforward/Low/Moderate/High)', 'Differential Diagnosis'], required: true },
      { id: 'course', title: 'ED Course & Reassessment', items: ['Treatments Administered', 'Medications Given (with time)', 'IV Fluids', 'Response to Treatment', 'Reassessment Vital Signs', 'Reassessment Exam Findings', 'Time-Based Documentation'], required: true },
      { id: 'disposition', title: 'Disposition & Discharge', items: ['Disposition (Discharge/Admit/Transfer)', 'Discharge Diagnosis', 'Discharge Condition', 'Prescriptions', 'Activity Restrictions', 'Return Precautions/Red Flags', 'Follow-Up Instructions', 'Patient Education Given', 'EMTALA Compliance (if transfer)'], required: true },
    ],
  },

  // ═══════════════════════════════════════
  // REHABILITATION DOMAIN
  // ═══════════════════════════════════════
  {
    id: 'rehab-pt-eval',
    domain: 'rehabilitation',
    type: 'Initial Evaluation',
    subtype: 'PT Initial Evaluation',
    name: 'PT Initial Evaluation',
    description: 'Comprehensive physical therapy evaluation including objective measurements, functional outcome measures, and evidence-based plan of care.',
    regulatorySources: ['APTA Guide to PT Practice', 'CMS MPPR/8-Minute Rule', 'Medicare Benefit Policy Manual Ch.15 §220', 'FOTO Outcomes Registry'],
    itemCount: 48,
    sections: [
      { id: 'history', title: 'Patient History', items: ['Referral Source/Diagnosis', 'Mechanism of Injury/Onset', 'Prior Level of Function', 'Living Situation', 'Occupational Demands', 'Prior Treatment', 'Imaging/Diagnostics', 'Medications', 'Surgical History', 'Comorbidities', 'Patient Goals'], required: true },
      { id: 'systems', title: 'Systems Review', items: ['Cardiovascular/Pulmonary', 'Integumentary', 'Musculoskeletal', 'Neuromuscular', 'Communication/Cognition'], required: true },
      { id: 'objective', title: 'Tests & Measures', items: ['Posture Analysis', 'Active ROM (Goniometry)', 'Passive ROM (Goniometry)', 'Manual Muscle Testing', 'Grip/Pinch Strength', 'Sensation Testing', 'Deep Tendon Reflexes', 'Special Tests', 'Palpation', 'Joint Mobility/Accessory Motion', 'Flexibility Assessment', 'Balance Assessment', 'Gait Analysis', 'Functional Mobility'], required: true },
      { id: 'outcomes', title: 'Functional Outcome Measures', items: ['Oswestry Disability Index (ODI)', 'Numeric Pain Rating Scale (NPRS)', 'Lower Extremity Functional Scale (LEFS)', 'Patient-Specific Functional Scale (PSFS)', 'Timed Up and Go (TUG)', 'Berg Balance Scale'], required: false },
      { id: 'assessment', title: 'Clinical Assessment', items: ['PT Diagnosis/Clinical Impression', 'Problem List', 'Rehab Potential', 'Precautions/Contraindications', 'Skilled Need Justification'], required: true },
      { id: 'plan', title: 'Plan of Care', items: ['Short-Term Goals (2-4 weeks)', 'Long-Term Goals (8-12 weeks)', 'Treatment Frequency/Duration', 'Interventions Planned', 'Patient/Family Education', 'Discharge Criteria', 'Coordination of Care'], required: true },
    ],
  },
  {
    id: 'rehab-pt-daily',
    domain: 'rehabilitation',
    type: 'SOAP',
    subtype: 'PT Daily/Progress Note',
    name: 'PT Daily/Progress Note',
    description: 'Daily treatment note documenting skilled interventions, patient response, and progress toward functional goals.',
    regulatorySources: ['CMS 8-Minute Rule', 'Medicare Benefit Policy Manual Ch.15', 'APTA Defensible Documentation'],
    itemCount: 19,
    sections: [
      { id: 's', title: 'Subjective', items: ['Pain Level (NPRS)', 'Patient Report of Function', 'Symptom Changes', 'Compliance with HEP', 'Sleep/Activity Level'], required: true },
      { id: 'o', title: 'Objective', items: ['Interventions Performed (with CPT/time)', 'Vital Signs (if applicable)', 'Objective Measurements', 'Functional Performance', 'Patient Response to Treatment'], required: true },
      { id: 'a', title: 'Assessment', items: ['Progress Toward Goals', 'Skilled Need Justification', 'Treatment Effectiveness', 'Barriers to Progress'], required: true },
      { id: 'p', title: 'Plan', items: ['Next Visit Plan', 'Goal Modifications', 'HEP Updates', 'Frequency/Duration Adjustment', 'Coordination of Care'], required: true },
    ],
  },
  {
    id: 'rehab-ot-eval',
    domain: 'rehabilitation',
    type: 'Initial Evaluation',
    subtype: 'OT Initial Evaluation',
    name: 'OT Initial Evaluation',
    description: 'Occupational therapy evaluation focusing on ADL performance, upper extremity function, and occupational participation.',
    regulatorySources: ['AOTA Occupational Profile Template', 'CMS MPPR/8-Minute Rule', 'Medicare Benefit Policy Manual Ch.15', 'OTPF-4'],
    itemCount: 32,
    sections: [
      { id: 'profile', title: 'Occupational Profile', items: ['Referral Reason', 'Occupational History', 'Prior Level of Function', 'ADL/IADL Status', 'Roles/Routines', 'Living Environment', 'Client Goals/Priorities', 'Psychosocial Factors'], required: true },
      { id: 'analysis', title: 'Occupational Analysis', items: ['ADL Performance Assessment', 'IADL Performance Assessment', 'Work/Productivity', 'Leisure/Social Participation', 'Activity Demands Analysis'], required: true },
      { id: 'client', title: 'Client Factors', items: ['UE Active ROM', 'UE Manual Muscle Testing', 'Grip/Pinch Strength', 'Sensation (Monofilament/2PD)', 'Coordination/Dexterity', 'Visual-Perceptual Skills', 'Cognition Screening', 'Pain Assessment'], required: true },
      { id: 'assessment', title: 'Assessment', items: ['OT Diagnosis', 'Functional Limitations', 'Rehab Potential', 'Precautions'], required: true },
      { id: 'plan', title: 'Plan of Care', items: ['Short-Term Goals', 'Long-Term Goals', 'Frequency/Duration', 'Interventions Planned', 'Adaptive Equipment Recommendations', 'Home Modifications', 'Discharge Plan'], required: true },
    ],
  },
  {
    id: 'rehab-slp-eval',
    domain: 'rehabilitation',
    type: 'Initial Evaluation',
    subtype: 'SLP Initial Evaluation',
    name: 'SLP Initial Evaluation',
    description: 'Speech-language pathology evaluation covering speech, language, voice, swallowing, and cognitive-communication domains.',
    regulatorySources: ['ASHA Practice Portal Guidelines', 'Medicare Benefit Policy Manual Ch.15 §220.3', 'CMS MPPR/8-Minute Rule'],
    itemCount: 38,
    sections: [
      { id: 'history', title: 'Case History', items: ['Referral Source/Diagnosis', 'Onset/Course', 'Medical History', 'Prior SLP Services', 'Developmental History (if applicable)', 'Communication Partners/Environment', 'Patient/Family Concerns'], required: true },
      { id: 'oral', title: 'Oral Mechanism Exam', items: ['Facial Symmetry', 'Lip Strength/ROM', 'Tongue Strength/ROM', 'Velopharyngeal Function', 'Dentition', 'Oral Sensation', 'Diadochokinetic Rates'], required: true },
      { id: 'speech', title: 'Speech & Language Assessment', items: ['Articulation/Phonology', 'Fluency', 'Voice Quality/Resonance', 'Receptive Language', 'Expressive Language', 'Pragmatics', 'Reading/Writing'], required: true },
      { id: 'swallow', title: 'Swallowing Assessment', items: ['Diet History', 'Signs/Symptoms of Dysphagia', 'Clinical Swallow Evaluation', 'Trial Swallows', 'Aspiration Risk', 'IDDSI Level Recommendation'], required: false },
      { id: 'cognitive', title: 'Cognitive-Communication', items: ['Attention', 'Memory', 'Executive Function', 'Problem-Solving', 'Orientation'], required: false },
      { id: 'plan', title: 'Plan of Care', items: ['SLP Diagnosis', 'Goals', 'Frequency/Duration', 'Intervention Approach', 'Family Training', 'Discharge Criteria'], required: true },
    ],
  },
  {
    id: 'rehab-progress',
    domain: 'rehabilitation',
    type: 'Progress Report',
    subtype: 'Rehab Progress Report',
    name: 'Rehabilitation Progress Report',
    description: 'Required progress report for Medicare and insurance documenting objective progress, goal updates, and continued skilled need.',
    regulatorySources: ['Medicare Benefit Policy Manual Ch.15 §220.3', 'CMS Progress Report Requirements', 'APTA/AOTA/ASHA Documentation Guidelines'],
    itemCount: 22,
    sections: [
      { id: 'summary', title: 'Treatment Summary', items: ['Reporting Period', 'Diagnosis/ICD-10', 'Treatment Frequency', 'Total Visits This Period', 'Interventions Provided', 'CPT Codes Utilized'], required: true },
      { id: 'progress', title: 'Objective Progress', items: ['Initial vs. Current Measurements', 'Outcome Measure Comparison', 'Functional Status Change', 'Goal Achievement Status'], required: true },
      { id: 'goals', title: 'Goal Update', items: ['Goals Met', 'Goals in Progress', 'Goals Modified', 'New Goals Established'], required: true },
      { id: 'justification', title: 'Skilled Need Justification', items: ['Complexity Requiring Skilled Care', 'Expected Improvement Timeline', 'Barriers Addressed', 'Why Non-Skilled Alternatives Insufficient'], required: true },
      { id: 'plan', title: 'Updated Plan', items: ['Revised Frequency/Duration', 'Updated Interventions', 'Anticipated Discharge Date', 'Discharge Plan'], required: true },
    ],
  },

  // ═══════════════════════════════════════
  // BEHAVIORAL HEALTH DOMAIN
  // ═══════════════════════════════════════
  {
    id: 'bh-intake',
    domain: 'behavioral_health',
    type: 'Intake Assessment',
    subtype: 'Biopsychosocial Intake',
    name: 'Biopsychosocial Intake Assessment',
    description: 'Comprehensive behavioral health intake covering biological, psychological, and social domains with risk assessment and diagnostic formulation.',
    regulatorySources: ['DSM-5-TR Diagnostic Criteria', 'APA Practice Guidelines', 'SAMHSA TIP Series', 'Joint Commission BHC Standards'],
    itemCount: 68,
    sections: [
      { id: 'presenting', title: 'Presenting Problem', items: ['Chief Complaint (patient words)', 'History of Present Illness', 'Symptom Onset/Duration/Severity', 'Precipitating Factors', 'Previous Treatment History', 'Current Medications'], required: true },
      { id: 'psych', title: 'Psychiatric History', items: ['Past Diagnoses', 'Hospitalizations', 'Medication History', 'ECT/TMS/Other Treatments', 'Self-Harm History', 'Suicide Attempt History'], required: true },
      { id: 'substance', title: 'Substance Use History', items: ['Alcohol Use (AUDIT-C)', 'Cannabis', 'Opioids', 'Stimulants', 'Benzodiazepines', 'Tobacco/Nicotine', 'Other Substances', 'Treatment History', 'Withdrawal History'], required: true },
      { id: 'social', title: 'Social History', items: ['Family of Origin', 'Current Relationships', 'Children', 'Housing', 'Employment/Education', 'Financial Status', 'Legal History', 'Military History', 'Cultural/Spiritual Factors', 'Trauma/Adverse Childhood Experiences'], required: true },
      { id: 'medical', title: 'Medical History', items: ['Current Medical Conditions', 'Medications', 'Allergies', 'Sleep Patterns', 'Appetite/Weight Changes', 'Pain Issues', 'Recent Labs/Imaging'], required: true },
      { id: 'mse', title: 'Mental Status Examination', items: ['Appearance', 'Behavior', 'Speech', 'Mood (patient report)', 'Affect (observed)', 'Thought Process', 'Thought Content', 'Perceptions', 'Cognition', 'Insight', 'Judgment'], required: true },
      { id: 'risk', title: 'Risk Assessment', items: ['Suicidal Ideation (Columbia Protocol)', 'Homicidal Ideation', 'Self-Harm Urges', 'Access to Lethal Means', 'Protective Factors', 'Risk Level Determination', 'Safety Plan'], required: true },
      { id: 'formulation', title: 'Diagnostic Formulation', items: ['DSM-5-TR Diagnoses', 'Differential Diagnoses', 'Case Conceptualization', 'Strengths/Resources', 'Barriers to Treatment'], required: true },
      { id: 'plan', title: 'Treatment Plan', items: ['Treatment Goals', 'Modality (Individual/Group/Family)', 'Frequency', 'Therapeutic Approach', 'Medication Management', 'Referrals', 'Crisis Plan'], required: true },
    ],
  },
  {
    id: 'bh-progress',
    domain: 'behavioral_health',
    type: 'SOAP',
    subtype: 'Therapy Progress Note',
    name: 'Therapy Progress Note',
    description: 'Session-by-session therapy documentation with DAP/SOAP format, intervention tracking, and progress toward treatment goals.',
    regulatorySources: ['APA Record Keeping Guidelines', 'State Licensing Board Requirements', 'HIPAA Psychotherapy Notes Distinction'],
    itemCount: 19,
    sections: [
      { id: 's', title: 'Subjective / Data', items: ['Patient Presentation', 'Reported Symptoms/Mood', 'Events Since Last Session', 'Homework/Assignment Review', 'Risk Screen Update'], required: true },
      { id: 'o', title: 'Objective / Assessment', items: ['Mental Status Observations', 'Affect/Behavior in Session', 'PHQ-9 or GAD-7 Score (if administered)', 'Therapeutic Alliance Quality'], required: true },
      { id: 'a', title: 'Assessment / Clinical Impression', items: ['Session Theme/Focus', 'Interventions Used', 'Patient Response to Interventions', 'Progress Toward Goals', 'Clinical Insights'], required: true },
      { id: 'p', title: 'Plan', items: ['Next Session Focus', 'Homework/Between-Session Tasks', 'Medication Considerations', 'Coordination of Care', 'Risk Management Updates'], required: true },
    ],
  },
  {
    id: 'bh-psych-eval',
    domain: 'behavioral_health',
    type: 'Psychiatric Evaluation',
    subtype: 'Psychiatric Evaluation',
    name: 'Psychiatric Diagnostic Evaluation',
    description: 'Comprehensive psychiatric evaluation for initial medication management visits or diagnostic clarification.',
    regulatorySources: ['APA Practice Guidelines', 'DSM-5-TR', 'CMS E/M + Psych Add-On Guidelines', 'ASAM Criteria (if SUD)'],
    itemCount: 44,
    sections: [
      { id: 'cc', title: 'Chief Complaint & HPI', items: ['Chief Complaint', 'History of Present Illness', 'Symptom Review by Domain', 'Functional Impact', 'Treatment History Response'], required: true },
      { id: 'psych_hx', title: 'Psychiatric History', items: ['Past Diagnoses', 'Medication Trials (with response)', 'Hospitalizations', 'ECT/TMS/Ketamine History', 'Psychotherapy History'], required: true },
      { id: 'substance', title: 'Substance Use', items: ['Current Use', 'History of Use', 'Treatment Episodes', 'Withdrawal History', 'Recovery Supports'], required: true },
      { id: 'medical', title: 'Medical/Developmental', items: ['Medical Conditions', 'Medications', 'Allergies', 'Developmental Milestones', 'Head Injury/Seizure History'], required: true },
      { id: 'social', title: 'Psychosocial', items: ['Family Psychiatric History', 'Social Supports', 'Living Situation', 'Employment', 'Legal', 'Trauma History'], required: true },
      { id: 'mse', title: 'Mental Status Examination', items: ['Appearance', 'Behavior', 'Speech', 'Mood/Affect', 'Thought Process/Content', 'Perceptions', 'Cognition', 'Insight/Judgment'], required: true },
      { id: 'risk', title: 'Risk Assessment', items: ['SI/HI Screen', 'Risk Factors', 'Protective Factors', 'Risk Level', 'Safety Plan'], required: true },
      { id: 'formulation', title: 'Formulation & Plan', items: ['DSM-5-TR Diagnoses', 'Medication Plan', 'Lab Orders', 'Therapy Recommendations', 'Follow-Up Schedule'], required: true },
    ],
  },
  {
    id: 'bh-group',
    domain: 'behavioral_health',
    type: 'Group Note',
    subtype: 'Group Therapy Note',
    name: 'Group Therapy Note',
    description: 'Documentation for group therapy sessions covering group dynamics, individual participation, and therapeutic factors.',
    regulatorySources: ['APA Group Therapy Guidelines', 'AGPA Practice Standards', 'State Licensing Requirements'],
    itemCount: 18,
    sections: [
      { id: 'group', title: 'Group Information', items: ['Group Name/Type', 'Session Number', 'Members Present/Absent', 'Group Theme/Topic', 'Facilitator(s)'], required: true },
      { id: 'process', title: 'Group Process', items: ['Group Dynamics Observed', 'Therapeutic Factors Present', 'Curriculum/Activity Delivered', 'Group Cohesion Level'], required: true },
      { id: 'individual', title: 'Individual Member Notes', items: ['Participation Level', 'Presenting Issues', 'Interventions Directed', 'Response to Group', 'Individual Progress'], required: true },
      { id: 'plan', title: 'Plan', items: ['Next Session Topic', 'Individual Follow-Up Needed', 'Group Composition Changes', 'Supervision Notes'], required: true },
    ],
  },
  {
    id: 'bh-crisis',
    domain: 'behavioral_health',
    type: 'Crisis Assessment',
    subtype: 'Crisis Intervention Note',
    name: 'Crisis Intervention Note',
    description: 'Acute crisis assessment and intervention documentation with detailed risk stratification and safety planning.',
    regulatorySources: ['Columbia Suicide Severity Rating Scale', 'SAMHSA Crisis Counseling Guidelines', 'Joint Commission NPSG 15.01.01', '988 Suicide & Crisis Lifeline Protocols'],
    itemCount: 36,
    sections: [
      { id: 'presentation', title: 'Crisis Presentation', items: ['Referral Source', 'Nature of Crisis', 'Precipitating Event', 'Timeline', 'Current Location/Safety'], required: true },
      { id: 'risk', title: 'Risk Assessment', items: ['Suicidal Ideation (C-SSRS)', 'Plan/Intent/Means', 'Homicidal Ideation', 'Self-Harm', 'Psychosis', 'Intoxication', 'Prior Attempts', 'Recent Losses', 'Social Isolation'], required: true },
      { id: 'protective', title: 'Protective Factors', items: ['Reasons for Living', 'Social Support', 'Treatment Engagement', 'Coping Skills', 'Religious/Spiritual', 'Dependent Children/Pets'], required: true },
      { id: 'intervention', title: 'Intervention', items: ['De-escalation Techniques', 'Therapeutic Interventions', 'Means Restriction Counseling', 'Collateral Contacts', 'Consultation Obtained'], required: true },
      { id: 'safety', title: 'Safety Plan', items: ['Warning Signs', 'Internal Coping Strategies', 'Social Contacts for Distraction', 'Professional Contacts', 'Emergency Contacts', 'Environmental Safety Steps'], required: true },
      { id: 'disposition', title: 'Disposition', items: ['Risk Level Determination', 'Level of Care Recommendation', 'Discharge/Transfer Plan', 'Follow-Up Within 24-48hrs', 'Documentation of Informed Consent'], required: true },
    ],
  },
  {
    id: 'rehab-discharge',
    domain: 'rehabilitation',
    type: 'Discharge Summary',
    subtype: 'PT/OT/SLP Discharge',
    name: 'Rehabilitation Discharge Summary',
    description: 'Comprehensive discharge documentation for PT, OT, and SLP episodes of care. Demonstrates medical necessity met, functional outcomes achieved, and discharge rationale per CMS requirements.',
    regulatorySources: ['Medicare Benefit Policy Manual Ch.15 §220.3', 'CMS Functional Reporting Requirements', 'APTA Guide to PT Practice', 'LCD L33966 Outpatient Therapy'],
    itemCount: 68,
    sections: [
      { id: 'episode', title: 'Episode of Care Summary', items: ['Patient Demographics', 'Referring Physician', 'Primary Diagnosis/ICD-10', 'Secondary Diagnoses', 'Date of Initial Evaluation', 'Date of Discharge', 'Total Visits Attended', 'Total Visits Authorized', 'Missed/Cancelled Visits', 'Treatment Setting', 'Payer Source'], required: true },
      { id: 'initial', title: 'Initial Presentation', items: ['Reason for Referral', 'Mechanism of Injury/Onset', 'Initial Pain Level (NPRS)', 'Initial Functional Limitations', 'Prior Level of Function', 'Patient Goals at Intake'], required: true },
      { id: 'treatment', title: 'Treatment Summary', items: ['Interventions Provided', 'CPT Codes Utilized', 'Modalities Used', 'Therapeutic Exercise Program', 'Manual Therapy Techniques', 'Neuromuscular Re-education', 'Gait/Balance Training', 'Home Exercise Program', 'Patient/Family Education Provided', 'Adaptive Equipment Issued'], required: true },
      { id: 'outcomes_obj', title: 'Objective Outcomes — Discharge vs Initial', items: ['Discharge ROM vs Initial ROM', 'Discharge MMT vs Initial MMT', 'Discharge Pain Level vs Initial', 'Discharge Balance Score vs Initial', 'Discharge Gait Assessment vs Initial', 'Discharge Functional Mobility vs Initial', 'Grip/Pinch Strength Change', 'Endurance/Tolerance Change'], required: true },
      { id: 'outcomes_func', title: 'Functional Outcome Measures', items: ['Oswestry Disability Index (Initial → Discharge)', 'LEFS (Initial → Discharge)', 'DASH (Initial → Discharge)', 'Patient-Specific Functional Scale (Initial → Discharge)', 'Timed Up and Go (Initial → Discharge)', 'Berg Balance Scale (Initial → Discharge)', 'NPRS (Initial → Discharge)', '6-Minute Walk Test (Initial → Discharge)', 'Minimal Clinically Important Difference (MCID) Achieved'], required: false },
      { id: 'goals', title: 'Goal Achievement', items: ['Short-Term Goal 1 — Status', 'Short-Term Goal 2 — Status', 'Short-Term Goal 3 — Status', 'Long-Term Goal 1 — Status', 'Long-Term Goal 2 — Status', 'Long-Term Goal 3 — Status', 'Overall Goal Achievement Percentage'], required: true },
      { id: 'discharge_assessment', title: 'Discharge Assessment', items: ['Discharge Functional Level', 'Discharge Reason (goals met / plateau / non-compliance / insurance / patient request / physician order)', 'Skilled Need at Discharge', 'Remaining Deficits', 'Rehab Potential at Discharge', 'Fall Risk at Discharge', 'Current Pain Level'], required: true },
      { id: 'discharge_plan', title: 'Discharge Plan', items: ['Home Exercise Program (Final)', 'Activity Modifications', 'Precautions/Restrictions', 'Follow-Up Recommendations', 'Physician Follow-Up', 'Referrals Made', 'Return to Therapy Criteria', 'Community Resources', 'Patient/Family Education at Discharge', 'Patient Verbalized Understanding'], required: true },
    ],
  },
  {
    id: 'med-discharge',
    domain: 'medical',
    type: 'Discharge Summary',
    subtype: 'Hospital Discharge',
    name: 'Medical Discharge Summary',
    description: 'Hospital or facility discharge documentation covering admission course, treatment provided, and post-discharge plan. Required within 30 days per CMS Conditions of Participation.',
    regulatorySources: ['CMS Conditions of Participation §482.24(c)(2)', 'Joint Commission RC.01.03.01', 'CMS Hospital Quality Measures', 'Medicare Claims Processing Manual Ch.12'],
    itemCount: 45,
    sections: [
      { id: 'admin', title: 'Administrative Data', items: ['Patient Demographics', 'Admission Date', 'Discharge Date', 'Length of Stay', 'Admitting Physician', 'Attending Physician', 'Primary Diagnosis/ICD-10', 'Secondary Diagnoses', 'Procedures Performed (CPT/ICD-PCS)', 'DRG Assignment', 'Payer'], required: true },
      { id: 'admission', title: 'Admission Summary', items: ['Chief Complaint', 'History of Present Illness', 'Pertinent PMH', 'Admission Physical Exam', 'Admission Vital Signs', 'Initial Labs/Imaging'], required: true },
      { id: 'course', title: 'Hospital Course', items: ['Clinical Course by Problem', 'Consultations Obtained', 'Procedures/Surgeries', 'Complications', 'Significant Events', 'Code Status Changes'], required: true },
      { id: 'discharge_status', title: 'Discharge Status', items: ['Condition at Discharge', 'Discharge Vital Signs', 'Final Labs/Imaging', 'Functional Status at Discharge', 'Mental Status at Discharge', 'Weight-Bearing Status'], required: true },
      { id: 'medications', title: 'Medication Reconciliation', items: ['Discharge Medications (name/dose/route/frequency)', 'New Medications Started', 'Medications Discontinued', 'Medications Changed', 'Medication Allergies'], required: true },
      { id: 'discharge_plan', title: 'Discharge Plan', items: ['Disposition (home / SNF / rehab / LTAC / hospice)', 'Follow-Up Appointments', 'Pending Labs/Studies', 'Home Health Orders', 'DME Orders', 'Diet Instructions', 'Activity Restrictions', 'Wound Care Instructions', 'Return to ED Criteria', 'Patient Education Provided', 'Advance Directives Status'], required: true },
    ],
  },
  {
    id: 'bh-discharge',
    domain: 'behavioral_health',
    type: 'Discharge/Termination',
    subtype: 'BH Discharge Summary',
    name: 'Behavioral Health Discharge/Termination Summary',
    description: 'Treatment episode closure documentation for behavioral health services. Covers treatment response, symptom trajectory, and continuing care recommendations per SAMHSA and payer guidelines.',
    regulatorySources: ['SAMHSA Treatment Improvement Protocols', '42 CFR Part 2 (Substance Use)', 'Joint Commission BHC Standards', 'NCQA HEDIS Measures — Follow-Up After MH/SUD'],
    itemCount: 49,
    sections: [
      { id: 'episode', title: 'Treatment Episode Summary', items: ['Patient Demographics', 'Admission/Intake Date', 'Discharge Date', 'Level of Care', 'Primary Diagnosis (DSM-5/ICD-10)', 'Secondary Diagnoses', 'Total Sessions Attended', 'Sessions Missed/No-Show', 'Treatment Modalities Used', 'Primary Therapist', 'Psychiatrist/Prescriber'], required: true },
      { id: 'presenting', title: 'Presenting Problems at Intake', items: ['Chief Complaint at Intake', 'Initial PHQ-9 Score', 'Initial GAD-7 Score', 'Initial AUDIT-C / DAST Score', 'Baseline Functional Level (GAF/WHODAS)', 'Initial Risk Level', 'Initial Symptoms Summary'], required: true },
      { id: 'treatment', title: 'Treatment Provided', items: ['Therapeutic Approaches Used (CBT/DBT/MI/EMDR/etc.)', 'Medication Management Summary', 'Medication Changes During Treatment', 'Group Therapy Participation', 'Family/Couples Sessions', 'Case Management Services', 'Peer Support Services', 'Crisis Interventions During Treatment'], required: true },
      { id: 'outcomes', title: 'Treatment Outcomes', items: ['Discharge PHQ-9 Score', 'Discharge GAD-7 Score', 'Discharge AUDIT-C / DAST Score', 'Discharge Functional Level (GAF/WHODAS)', 'Symptom Trajectory (improved/stable/worsened)', 'Goal Achievement Summary', 'Risk Level at Discharge', 'Protective Factors at Discharge'], required: true },
      { id: 'discharge', title: 'Discharge Assessment', items: ['Discharge Reason (treatment complete / plateau / non-compliance / patient request / insurance / relocation / transfer)', 'Clinical Formulation at Discharge', 'Remaining Symptoms/Concerns', 'Relapse Risk Assessment', 'Safety Assessment at Discharge'], required: true },
      { id: 'continuing_care', title: 'Continuing Care Plan', items: ['Ongoing Medication Plan', 'Step-Down Level of Care', 'Outpatient Referrals', 'Psychiatry Follow-Up', 'PCP Notification', 'Support Group Recommendations (AA/NA/NAMI/DBSA)', 'Crisis Plan (updated)', 'Community Resources', 'Relapse Prevention Strategies', 'Patient Verbalized Understanding'], required: true },
    ],
  },
];

export function getFrameworksByDomain(domain: string): Framework[] {
  return frameworks.filter(f => f.domain === domain);
}

export function getFrameworkById(id: string): Framework | undefined {
  return frameworks.find(f => f.id === id);
}

export function getDomainLabel(domain: string): string {
  const labels: Record<string, string> = {
    medical: 'Medical',
    rehabilitation: 'Rehabilitation',
    behavioral_health: 'Behavioral Health',
  };
  return labels[domain] || domain;
}

export function getDomainColor(domain: string): string {
  const colors: Record<string, string> = {
    medical: '#1e3a5f',
    rehabilitation: '#0d9488',
    behavioral_health: '#7c3aed',
  };
  return colors[domain] || '#1e3a5f';
}

const providerDomainMap: Record<ProviderType, Domain> = {
  MD: 'medical',
  DO: 'medical',
  'PA-C': 'medical',
  NP: 'medical',
  PT: 'rehabilitation',
  OT: 'rehabilitation',
  SLP: 'rehabilitation',
  LCSW: 'behavioral_health',
  PhD: 'behavioral_health',
  PsyD: 'behavioral_health',
};

export function getSuggestedDomain(providerType: ProviderType): Domain {
  return providerDomainMap[providerType];
}
