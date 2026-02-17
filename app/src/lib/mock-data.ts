import { Visit, NoteSection } from './types';

// ═══════════════════════════════════════
// MOCK TRANSCRIPTS
// ═══════════════════════════════════════

export const mockTranscripts: Record<string, string> = {
  'pt-eval': `Provider: Good morning, I'm Dr. Martinez, the physical therapist. You must be Mr. Johnson. What brings you in today?

Patient: Hi, yeah. I've been having this low back pain for about six weeks now. It started when I was helping my son move into his new apartment. I was lifting a heavy box and felt something pull in my lower back.

Provider: I'm sorry to hear that. Can you describe the pain for me? Where exactly do you feel it?

Patient: It's mostly right here in my lower back, kind of across both sides but worse on the right. Sometimes it shoots down into my right buttock and the back of my thigh, but it doesn't go past my knee.

Provider: On a scale of 0 to 10, with 10 being the worst pain imaginable, where would you rate your pain right now?

Patient: Right now sitting here, it's about a 5. But when I first get up in the morning or if I've been sitting for more than 30 minutes, it jumps up to about a 7 or 8. The worst it's been was probably a 9, that was the first few days after the injury.

Provider: And what makes it better or worse?

Patient: Walking actually helps a little bit once I get going. Heat helps too. Sitting for a long time makes it worse, bending forward to tie my shoes is terrible, and I can't even think about lifting anything heavy. I've been taking ibuprofen which takes the edge off.

Provider: Tell me about how this is affecting your daily life.

Patient: It's really impacting everything. I'm an electrician, so I'm constantly bending, kneeling, reaching overhead. I've been out of work for the last three weeks because I just can't do my job. At home, I can't play with my kids, I can't help around the house much. My wife has been doing everything. I can't even sit through a movie without having to get up and walk around.

Provider: Have you had any imaging done?

Patient: Yeah, my primary care doctor ordered an MRI. It showed a disc bulge at L4-L5 and some mild degenerative changes. She said surgery wasn't needed right now and referred me here.

Provider: Any numbness, tingling, or weakness in your legs? Any changes in bladder or bowel function?

Patient: I get some tingling in my right calf sometimes, but no real numbness. No bladder or bowel problems, thank goodness.

Provider: Good. Let me do a thorough examination now. Let's start with your posture and range of motion...

[Physical examination performed]

Provider: Okay, Mr. Johnson, let me go over my findings with you. Your lumbar flexion is limited to about 40 percent of normal, extension is about 50 percent. I'm seeing some muscle guarding on the right side. Your straight leg raise is positive on the right at 55 degrees. Your strength is generally 4 out of 5 in your lower extremities, 3+ out of 5 for your right hip extensors. Your Oswestry score came back at 48 percent, which puts you in the severe disability range. Your Patient-Specific Functional Scale for returning to work activities is 2 out of 10.

Patient: That doesn't sound great.

Provider: Well, the good news is that your presentation is very consistent with a mechanical low back pain with some radiculopathy, and this responds very well to physical therapy. I'd like to see you twice a week for the next 8 weeks. We'll focus on pain management initially, then progressive core stabilization, hip strengthening, and work-specific functional training to get you back to your job. I also want to teach you some nerve gliding exercises for that right leg.

Patient: Whatever it takes. I need to get back to work.

Provider: We'll get you there. Let me also give you a home exercise program to start with — some gentle stretches and walking guidelines.`,

  'soap-followup': `Provider: Welcome back, Sarah. It's been two weeks since your last visit. How have you been doing?

Patient: Actually, quite a bit better. The new blood pressure medication seems to be helping, and I've been walking 20 minutes every day like you suggested.

Provider: That's great to hear. Have you been monitoring your blood pressure at home?

Patient: Yes, it's been averaging around 138 over 85. Before the medication change it was in the 150s over 90s. 

Provider: Good improvement. Any side effects from the lisinopril?

Patient: I've had a bit of a dry cough, actually. It's not terrible but it's annoying, especially at night.

Provider: That's a known side effect of ACE inhibitors. Let's keep an eye on it. If it gets worse, we can switch to an ARB. How about your diabetes management?

Patient: My sugars have been a little better. Fasting is usually around 130 to 140 now. I've cut back on the sweets like we talked about.

Provider: Let me check your vitals and do a focused exam today...

[Examination performed]

Provider: Your blood pressure today is 136 over 84, which is heading in the right direction. Heart and lungs sound clear. No peripheral edema. Your A1C from last week's labs came back at 7.2, down from 7.8 three months ago. Your lipid panel looks good on the statin — LDL is 98.

Patient: Oh good, the A1C went down!

Provider: Yes, you're making real progress. I'd like to continue the current regimen for now. Let's recheck your blood pressure and that cough in four weeks. Keep up the walking — maybe try to increase to 30 minutes if you can. And I want to see another A1C in three months.`,

  'bh-intake': `Provider: Thank you for coming in today, Maria. I know it takes courage to reach out for help. Can you tell me what brings you in?

Patient: I just... I've been struggling for a while. My anxiety has gotten so bad that I'm having panic attacks almost every day now. And I feel depressed too, like nothing matters anymore. My husband finally convinced me to come in.

Provider: When did you first notice these symptoms getting worse?

Patient: The panic attacks started about four months ago, after I lost my job. I was a marketing manager at a tech company, and they did layoffs. At first I was okay, but then the job search started and every rejection just made me feel more worthless. The anxiety about money, about my future, it just built up until I started having these attacks.

Provider: Can you describe what happens during a panic attack?

Patient: My heart starts racing, I feel like I can't breathe, my chest gets tight, and I get this overwhelming feeling of dread, like something terrible is about to happen. Sometimes I get dizzy and my hands go numb. It usually lasts about 15 to 20 minutes but it feels like forever. I've gone to the ER twice thinking I was having a heart attack.

Provider: That sounds very frightening. And the depression — tell me more about that.

Patient: I've lost interest in things I used to enjoy. I used to love cooking and hiking with friends, and now I don't do either. I sleep too much — like 10, 11 hours and still feel exhausted. My appetite is off, I've lost about 12 pounds in the last three months without trying. I feel worthless a lot, like I'm a burden on my husband.

Provider: Maria, I need to ask you some important questions, and I want you to know this is a safe space. Have you had any thoughts of harming yourself or not wanting to be alive?

Patient: I've had passive thoughts, like, it would be easier if I just didn't wake up. But I haven't thought about actually doing anything. I wouldn't do that to my family.

Provider: Thank you for being honest with me. Have you ever had thoughts like these before, or any history of self-harm?

Patient: No, this is new for me. I've never been this low before.

Provider: Let's talk about your background a bit. Any history of mental health treatment?

Patient: I saw a counselor in college for about six months when my parents were getting divorced. That was helpful actually. But I've never been on medication or anything.

Provider: Family history of mental health conditions?

Patient: My mother has been on antidepressants for years, and my aunt has bipolar disorder. My father, I think he self-medicated with alcohol — he was a heavy drinker.

Provider: How about your own substance use?

Patient: I've been drinking more wine than usual — maybe two or three glasses most nights to calm my nerves and help me sleep. I know that's probably not great. No other drugs, just the wine.

Provider: Thank you for sharing all of this with me, Maria. I can see you're dealing with a lot, and I want you to know that what you're experiencing is treatable...

[Mental Status Examination performed]

Provider: Based on our conversation and my assessment today, I believe you're experiencing Generalized Anxiety Disorder with Panic Disorder, and a Major Depressive Episode of moderate severity. Your PHQ-9 score of 17 and GAD-7 score of 16 support this. I'd like to recommend weekly individual therapy using a combination of CBT and mindfulness-based approaches, and I think we should discuss a referral to our psychiatrist for a medication evaluation. We also need to address the alcohol use as a coping strategy. How does that sound?

Patient: I'm willing to try whatever will help. I just want to feel like myself again.`,
};

// ═══════════════════════════════════════
// MOCK GENERATED NOTES
// ═══════════════════════════════════════

export const mockNotes: Record<string, NoteSection[]> = {
  'pt-eval': [
    {
      id: 'history',
      title: 'Patient History',
      content: `**Referral/Diagnosis:** Referred by Dr. Sarah Kim, MD (PCP) for physical therapy evaluation and treatment. Diagnosis: Lumbar disc displacement, L4-L5 (ICD-10: M51.16); Low back pain with right-sided sciatica (M54.41).

**Mechanism of Injury/Onset:** Patient reports acute onset of low back pain approximately 6 weeks ago while lifting a heavy box during a move. Felt sudden "pulling" sensation in the lumbar region. Symptoms have persisted and progressively impacted function.

**Prior Level of Function:** Independent in all ADLs and IADLs. Employed full-time as a licensed electrician requiring repetitive bending, kneeling, overhead reaching, and lifting up to 50 lbs regularly. Active recreationally — plays with children (ages 7, 10), performs yard work and home maintenance.

**Living Situation:** Lives in a two-story home with wife and two children. Bedroom is on the second floor (14 steps, bilateral handrails).

**Occupational Demands:** Full-time electrician — physically demanding role requiring sustained lumbar flexion, kneeling, crawling in tight spaces, overhead work, carrying tools and materials (20–50 lbs). Currently on short-term disability (3 weeks).

**Prior Treatment:** OTC ibuprofen 400mg PRN (partial relief). No prior physical therapy, chiropractic, or injection therapy for this episode. Application of superficial heat at home with temporary relief.

**Imaging/Diagnostics:** MRI lumbar spine (4 weeks ago): Broad-based posterior disc bulge at L4-L5 with mild foraminal narrowing on the right. Mild degenerative disc changes L3-L4 and L4-L5. No significant central canal stenosis. No fracture or spondylolisthesis.

**Medications:** Ibuprofen 400mg PO PRN (2–3x daily), Cyclobenzaprine 10mg PO QHS PRN (prescribed by PCP, taking occasionally).

**Surgical History:** Appendectomy (2015). No spinal surgeries.

**Comorbidities:** No significant comorbidities. BMI 27.3 (overweight). Non-smoker. No diabetes, cardiovascular disease, or osteoporosis.

**Patient Goals:** (1) Return to full-duty work as an electrician without pain. (2) Be able to play with his children. (3) Sit through a movie or dinner without needing to get up. (4) Pain reduction to ≤2/10.`,
    },
    {
      id: 'systems',
      title: 'Systems Review',
      content: `**Cardiovascular/Pulmonary:** HR 74 bpm, BP 128/78 mmHg. No reports of chest pain, shortness of breath, or peripheral edema. Within normal limits for physical therapy intervention.

**Integumentary:** Skin intact. No open wounds, surgical scars (lumbar region), or skin breakdown noted. Appendectomy scar RLQ, well-healed.

**Musculoskeletal:** Primary impairments noted in the lumbar spine and right lower extremity. Antalgic posture with mild right lateral shift observed. Decreased lumbar ROM in all planes. See Tests & Measures for detailed findings.

**Neuromuscular:** Intermittent tingling reported in the right posterior calf. No reports of foot drop or progressive weakness. Gait mildly antalgic with decreased stride length on the right. Balance grossly intact in standing.

**Communication/Cognition:** Alert and oriented x4. Communicates clearly in English. Understands and follows multi-step instructions. Motivated and engaged in evaluation process. Health literacy appears adequate for home exercise program compliance.`,
    },
    {
      id: 'objective',
      title: 'Tests & Measures',
      content: `**Posture Analysis:** Standing: mild right lateral trunk shift (approximately 1 cm). Decreased lumbar lordosis. Mild forward head posture. Pelvis level. No visible leg length discrepancy. Seated: tends toward posterior pelvic tilt and lumbar flexion within 2 minutes.

**Active ROM (Goniometry):**
| Motion | Measured | Normal | % Normal |
|--------|----------|--------|----------|
| Lumbar Flexion | 24° | 60° | 40% |
| Lumbar Extension | 12° | 25° | 48% |
| R Lateral Flexion | 14° | 25° | 56% |
| L Lateral Flexion | 20° | 25° | 80% |
| R Rotation | 16° | 30° | 53% |
| L Rotation | 24° | 30° | 80% |

**Passive ROM:** Lumbar flexion 30°, extension 16° — limited by pain and muscle guarding, R > L. Hip ROM within functional limits bilaterally except R hip extension limited to 8° (normal 20°).

**Manual Muscle Testing (MMT):**
| Muscle Group | Right | Left |
|---|---|---|
| Hip Flexors | 4/5 | 4+/5 |
| Hip Extensors (Glut Max) | 3+/5 | 4/5 |
| Hip Abductors | 4-/5 | 4/5 |
| Knee Extensors | 4/5 | 4+/5 |
| Knee Flexors | 4/5 | 4+/5 |
| Ankle Dorsiflexors | 4+/5 | 5/5 |
| Ankle Plantarflexors | 4+/5 | 5/5 |
| Trunk Extensors | 3+/5 | — |
| Trunk Flexors | 3+/5 | — |

**Sensation Testing:** Light touch intact bilateral lower extremities. Diminished sensation noted right posterolateral calf (L5-S1 dermatome) compared to left.

**Deep Tendon Reflexes:** Patellar (L3-L4): 2+ bilaterally. Achilles (S1-S2): 2+ left, 1+ right (diminished).

**Special Tests:**
- Straight Leg Raise: Positive right at 55° (concordant radicular symptoms). Negative left.
- Crossed SLR: Negative.
- Slump Test: Positive right (reproduces posterior thigh symptoms).
- Prone Instability Test: Negative.
- FABER/Patrick's Test: Positive right (posterior SI region pain). Negative left.
- Centralization Testing (McKenzie): Repeated extension in standing produced centralization of symptoms (peripheral symptoms decreased after 10 repetitions). Repeated flexion peripheralized symptoms.

**Palpation:** Tenderness to palpation bilateral lumbar paraspinals L4-S1, R > L. Increased muscle tone/guarding right erector spinae and right quadratus lumborum. Right piriformis tender and hypertonic. No step-off or bony tenderness at spinous processes.

**Joint Mobility/Accessory Motion:** L4-L5 PA glide: Hypomobile with reproduction of concordant symptoms. L5-S1 PA glide: Slightly hypomobile. R SI joint mobility: Mildly restricted.

**Flexibility Assessment:** Modified Thomas Test: Bilateral hip flexor tightness (right > left). 90-90 Hamstring: Right 55° (tight), Left 65° (mildly tight). Piriformis: Right significantly tight with symptom reproduction. Gastroc/Soleus: Within normal limits bilaterally.

**Balance Assessment:** Single limb stance: Right 18 sec, Left 28 sec (normative >30 sec). Tandem stance: 24 sec (normative >30 sec). No falls or near-falls but observable trunk sway and compensatory strategies.

**Gait Analysis:** Antalgic gait pattern with decreased right step length and decreased right stance time. Decreased lumbar rotation during gait. Mild right Trendelenburg sign noted. Gait speed: 1.0 m/s (normative for age: >1.2 m/s). No assistive device used.

**Functional Mobility:** Sit-to-stand: Independent but uses bilateral UE push-off, with pain face. Floor-to-stand: Requires 12 seconds (elevated), uses furniture for support. Stair negotiation: Step-over-step ascending/descending with bilateral handrail use and reports 5/10 pain.`,
    },
    {
      id: 'outcomes',
      title: 'Functional Outcome Measures',
      content: `**Oswestry Disability Index (ODI):** 48/100 (Severe Disability)
- MCID: 6 points | MDC: 10.5 points
- Interpretation: Patient reports severe functional limitations across pain intensity, personal care, lifting, walking, sitting, standing, sleeping, social life, and traveling domains.

**Numeric Pain Rating Scale (NPRS):**
- Current: 5/10
- Best (24hr): 3/10
- Worst (24hr): 8/10
- MCID: 2 points

**Patient-Specific Functional Scale (PSFS):**
- Return to work (electrical work): 2/10
- Playing with children: 3/10
- Sitting >30 minutes: 2/10
- Average: 2.3/10 | MCID: 2 points

**Lower Extremity Functional Scale (LEFS):** 38/80 (47.5%)
- MCID: 9 points
- Interpretation: Moderate-to-severe lower extremity functional limitations.

**Fear-Avoidance Beliefs Questionnaire (FABQ):**
- Work subscale: 28/42 (elevated — predictive of prolonged disability)
- Physical activity subscale: 18/24 (elevated)
- Interpretation: Significant fear-avoidance beliefs present, particularly related to work. This should be directly addressed in the treatment plan through graded exposure and education.`,
    },
    {
      id: 'assessment',
      title: 'Clinical Assessment',
      content: `**PT Diagnosis/Clinical Impression:** Lumbar disc displacement L4-L5 with right-sided lumbar radiculopathy (ICD-10: M51.16, M54.41). Mechanical low back pain with directional preference for extension (centralizing). Presentation consistent with posterolateral disc bulge affecting the right L5 nerve root, with concordant imaging findings.

**Problem List:**
1. Pain 5-8/10 limiting all functional activities
2. Decreased lumbar ROM (40-56% of normal in all planes)
3. Right lower extremity weakness (hip extensors 3+/5, hip abductors 4-/5)
4. Core stabilizer weakness (trunk flexors and extensors 3+/5)
5. Impaired neural mobility (positive SLR 55°, positive Slump)
6. Impaired balance and gait (antalgic pattern, decreased gait speed)
7. Unable to perform work duties (electrician) — on disability x3 weeks
8. Elevated fear-avoidance beliefs (FABQ work subscale 28/42)
9. Decreased flexibility bilateral hip flexors, hamstrings, R piriformis
10. Hypomobility L4-L5 and R SI joint

**Rehabilitation Potential:** GOOD. Patient is motivated with clear functional goals. Age (38) and overall health status are favorable. Symptoms centralize with repeated extension (positive prognostic indicator). No red flags present. No prior spinal surgery. Supportive home environment.

**Precautions/Contraindications:** Avoid sustained or loaded lumbar flexion in early phase. Monitor for progression of neurological symptoms (worsening numbness, weakness, or bowel/bladder changes). No spinal manipulation at this time given acute disc pathology. Modify activities per pain response using centralization principle.

**Skilled Need Justification:** Patient presents with complex mechanical low back pain with radiculopathy requiring skilled physical therapy assessment, manual therapy techniques, neuromuscular re-education, and progressive therapeutic exercise program. The presence of elevated fear-avoidance beliefs requires skilled behavioral intervention (graded exposure, pain neuroscience education) that cannot be provided by non-skilled personnel. Work-specific functional training for return to physically demanding occupation requires ongoing skilled assessment and progression.`,
    },
    {
      id: 'plan',
      title: 'Plan of Care',
      content: `**Short-Term Goals (4 weeks):**
1. NPRS pain ≤3/10 at rest to allow progression of therapeutic exercise program
2. Lumbar flexion ROM ≥45° to improve bending tolerance for ADLs
3. SLR ≥70° bilaterally to indicate improved neural mobility
4. Sit tolerance ≥45 minutes without increase in symptoms
5. PSFS average ≥4/10 across functional activities
6. Independent with home exercise program (100% accuracy with self-correction)

**Long-Term Goals (8-12 weeks):**
1. ODI ≤20% (minimal disability) to support return to full work duties
2. NPRS ≤2/10 with work-simulation activities
3. LEFS ≥65/80 to support full functional recovery
4. Lumbar ROM ≥90% of normal in all planes
5. Core and LE strength ≥4+/5 throughout to support occupational demands
6. FABQ work subscale ≤15/42 to support confident return to work
7. Return to full-duty work as electrician without restrictions
8. Return to recreational activities (playing with children, home maintenance)

**Treatment Frequency/Duration:** 2x/week for 8 weeks (16 visits), with reassessment at visit 8 and formal progress report at 30-day mark. Expected total episode: 8-12 weeks pending progress.

**Interventions Planned:**
- *Manual Therapy (CPT 97140):* Joint mobilization L4-L5, SI joint. Soft tissue mobilization to lumbar paraspinals, piriformis, hip flexors. Neural mobilization/nerve gliding techniques for right L5 nerve root.
- *Therapeutic Exercise (CPT 97110):* Progressive core stabilization program (transversus abdominis activation → anti-extension/anti-rotation → dynamic stabilization). Hip strengthening (gluteus maximus, medius). Lumbar ROM exercises with directional preference (McKenzie extension protocol). Progressive flexibility program.
- *Neuromuscular Re-education (CPT 97112):* Motor control retraining for lumbopelvic stability. Proprioceptive training and balance exercises. Gait retraining for normalized pattern.
- *Therapeutic Activities (CPT 97530):* Work-simulation tasks (bending, lifting, kneeling, overhead reaching) with graded progression. Functional movement training for ADLs.
- *Patient Education:* Pain neuroscience education to address fear-avoidance beliefs. Ergonomic/body mechanics training for work tasks. Self-management strategies. Activity modification guidelines during recovery.

**Home Exercise Program (Initial):**
1. Prone press-ups (McKenzie): 10 reps × 3 sets, every 2-3 hours
2. Supine sciatic nerve glides: 10 reps × 2 sets, 2x daily
3. Supine pelvic tilts with TA activation: 10 reps × 10 sec hold, 2x daily
4. Sidelying clamshells: 15 reps × 2 sets each side, daily
5. Standing hip flexor stretch: 30 sec × 3 reps each side, 2x daily
6. Walking program: 15-20 minutes, 2x daily on level surfaces

**Discharge Criteria:** Achievement of long-term goals, return to full work duties, independent self-management of symptoms, and independent with maintenance exercise program.

**Coordination of Care:** Will communicate progress to referring physician Dr. Sarah Kim, MD at 30-day mark and upon discharge. Will coordinate with employer regarding work restrictions and graduated return-to-work plan when appropriate.`,
    },
  ],

  'soap-followup': [
    {
      id: 's',
      title: 'Subjective',
      content: `**Chief Complaint:** Follow-up visit for hypertension management and type 2 diabetes mellitus.

**Interval History:** Patient reports improved blood pressure readings since starting lisinopril 10mg daily 2 weeks ago. Home BP monitoring averaging 138/85 mmHg, significantly improved from pre-medication baseline of 150s/90s. Reports new onset dry cough since starting ACE inhibitor, described as intermittent, non-productive, worse at night but not significantly impacting sleep or daily function. Patient has been adherent to daily walking program (20 minutes/day) and dietary modifications (reduced simple carbohydrate intake). Fasting blood glucose readings at home ranging 130-140 mg/dL.

**Medication Review:** Lisinopril 10mg PO daily (new, started 2 weeks ago) — taking as prescribed. Metformin 1000mg PO BID — no GI side effects. Atorvastatin 20mg PO QHS — tolerating well. Aspirin 81mg PO daily.

**Review of Systems:** (+) Dry cough as noted. (-) Chest pain, dyspnea, palpitations, lower extremity edema, headache, visual changes, dizziness, polyuria, polydipsia, numbness/tingling in extremities.

**Social/Functional Update:** Continues daily walking routine. Has reduced sweets and refined carbohydrates. Work life unaffected. Sleep adequate (7 hours/night despite occasional cough). Spouse supportive of lifestyle changes.`,
    },
    {
      id: 'o',
      title: 'Objective',
      content: `**Vital Signs:** BP 136/84 mmHg (seated, left arm, after 5-min rest) | HR 72 bpm, regular | RR 16 | Temp 98.4°F | SpO2 98% RA | Weight 198 lbs (down 2 lbs from last visit) | BMI 29.1

**Physical Examination:**
- *General:* Well-appearing, comfortable, no acute distress
- *HEENT:* Oropharynx clear, no thyromegaly
- *Cardiovascular:* Regular rate and rhythm, no murmurs/gallops/rubs, no JVD. Dorsalis pedis pulses 2+ bilaterally
- *Respiratory:* Lungs clear to auscultation bilaterally, no wheezes/rhonchi/crackles. Occasional dry cough observed during visit
- *Extremities:* No peripheral edema, no cyanosis. Monofilament sensation intact bilateral feet
- *Skin:* No lesions, intact skin bilateral feet, no ulcerations

**Diagnostic Results:**
- HbA1c: 7.2% (3 months ago: 7.8%) — ↓0.6% improvement
- Lipid Panel: Total cholesterol 195, LDL 98, HDL 48, Triglycerides 156
- BMP: Na 140, K 4.2, Cr 0.9, BUN 16, Glucose 142
- eGFR: >90 mL/min (no renal impairment)
- Urine microalbumin/creatinine ratio: 18 mg/g (normal <30)`,
    },
    {
      id: 'a',
      title: 'Assessment',
      content: `**Problem List Update:**

1. **Essential Hypertension (I10)** — Improving. Blood pressure trending toward goal on lisinopril 10mg. Office BP 136/84 with home readings averaging 138/85. Target <130/80 per ACC/AHA guidelines not yet achieved. New ACE inhibitor-associated cough — mild, monitoring.

2. **Type 2 Diabetes Mellitus, without complications (E11.9)** — Improving. HbA1c decreased from 7.8% to 7.2% with lifestyle modifications and continued metformin. Approaching individualized target of <7.0%. No evidence of nephropathy (normal microalbumin), neuropathy (intact monofilament), or retinopathy (due for ophthalmology screening). Fasting glucose still mildly elevated (130-140).

3. **Hyperlipidemia (E78.5)** — At goal. LDL 98 mg/dL on atorvastatin 20mg (target <100 for moderate-risk). Triglycerides mildly elevated at 156 — correlates with glycemic status, expect improvement with continued A1c reduction.

4. **Overweight (E66.3)** — BMI 29.1, down from 29.4. Positive trend with 2 lb weight loss over 2 weeks. Continue lifestyle modifications.

**Response to Treatment:** Positive response to antihypertensive initiation and ongoing diabetes management. Patient demonstrating excellent adherence to both pharmacotherapy and lifestyle modifications.`,
    },
    {
      id: 'p',
      title: 'Plan',
      content: `**Medication Changes:** None at this time. Continue current regimen:
- Lisinopril 10mg PO daily — continue, may uptitrate to 20mg at next visit if BP remains above goal and cough is tolerable
- Metformin 1000mg PO BID — continue
- Atorvastatin 20mg PO QHS — continue
- Aspirin 81mg PO daily — continue

**Monitoring — ACE Inhibitor Cough:** If cough worsens or becomes intolerable, will switch lisinopril to losartan 50mg (ARB class, no cough side effect). Patient instructed to call if cough significantly worsens before next appointment.

**Diagnostic Orders:**
- Repeat BMP with potassium in 2 weeks (ACE inhibitor monitoring) — ordered, patient to complete at outpatient lab
- HbA1c in 3 months
- Diabetic retinopathy screening — ophthalmology referral placed (overdue)

**Patient Education:**
- Reviewed DASH diet principles for additional BP reduction (goal: sodium <2300mg/day)
- Encouraged progression of walking to 30 minutes daily as tolerated
- Reinforced carbohydrate consistency with meals for glycemic control
- Discussed ACE inhibitor cough — benign side effect, typically resolves or stabilizes; alternatives available if needed
- Provided ADA dietary guidelines handout

**Referrals:** Ophthalmology for diabetic retinopathy screening (annual)

**Follow-Up:** Return in 4 weeks for BP recheck, cough assessment, and lab review. Sooner PRN for worsening cough, BP symptoms (headache, visual changes), or hypoglycemia symptoms.

**Safety Netting:** Patient instructed to seek immediate care for chest pain, severe headache, visual changes, facial/tongue swelling (angioedema — rare with ACE inhibitors), or blood glucose <70 mg/dL.`,
    },
  ],

  'bh-intake': [
    {
      id: 'presenting',
      title: 'Presenting Problem',
      content: `**Chief Complaint (patient's words):** "My anxiety has gotten so bad that I'm having panic attacks almost every day now. And I feel depressed too, like nothing matters anymore."

**History of Present Illness:** Maria Gonzalez is a 34-year-old Latina female presenting for initial behavioral health assessment with complaints of worsening anxiety with daily panic attacks and depressive symptoms over the past 4 months. Onset coincided with job loss (layoff from marketing manager position at a technology company). Patient reports progressive deterioration in functioning following repeated job application rejections, leading to escalating anxiety about finances and self-worth, culminating in daily panic attacks and pervasive depressed mood.

**Symptom Onset/Duration/Severity:** Anxiety symptoms present for approximately 4 months with progressive worsening. Panic attacks began approximately 3 months ago, initially 1-2x/week, now occurring daily. Depressive symptoms developed approximately 2 months ago. Patient rates current distress as 8/10.

**Precipitating Factors:** Job loss (layoff) 4 months ago. Ongoing unemployment and financial stress. Repeated job application rejections. Loss of professional identity and structure. Perceived burden on spouse.

**Previous Treatment History:** Brief counseling in college (approximately 6 months, ~12 years ago) for adjustment to parents' divorce — reported as helpful. No prior psychiatric medication trials. No prior psychiatric hospitalizations.

**Current Medications:** No psychotropic medications. Daily multivitamin. Occasional melatonin 5mg for sleep (inconsistent).`,
    },
    {
      id: 'psych',
      title: 'Psychiatric History',
      content: `**Past Diagnoses:** No formal psychiatric diagnoses prior to this evaluation. Previous counseling in college was supportive in nature; no formal diagnosis documented per patient report.

**Hospitalizations:** No psychiatric hospitalizations. Two emergency department visits in past 3 months for panic attack symptoms (evaluated for cardiac etiology — negative cardiac workup including EKG, troponin, and chest X-ray at both visits).

**Medication History:** No prior psychotropic medication trials.

**ECT/TMS/Other Treatments:** None.

**Self-Harm History:** Denies any history of self-harm behaviors (cutting, burning, etc.).

**Suicide Attempt History:** Denies any prior suicide attempts.`,
    },
    {
      id: 'substance',
      title: 'Substance Use History',
      content: `**Alcohol Use:** Currently consuming 2-3 glasses of wine most evenings (estimated 14-21 standard drinks/week). Increase from pre-morbid baseline of 2-3 glasses/week (social occasions only). Using alcohol as a coping mechanism for anxiety and to facilitate sleep onset. AUDIT-C Score: 7 (positive screen, elevated risk). Denies morning drinking, blackouts, or withdrawal symptoms. No prior alcohol treatment.

**Cannabis:** Denies current or past use.

**Opioids:** Denies current or past non-prescribed use.

**Stimulants:** Denies current or past use.

**Benzodiazepines:** Denies current or past use (prescribed or non-prescribed).

**Tobacco/Nicotine:** Denies current or past use.

**Other Substances:** Denies use of any other substances.

**Treatment History:** No prior substance use treatment.

**Withdrawal History:** No history of withdrawal symptoms from any substance.

**Clinical Note:** Current alcohol use represents a clinically significant increase in frequency and quantity, functionally used as self-medication for anxiety and insomnia. Meets criteria for at-risk/hazardous drinking. Does not currently meet criteria for Alcohol Use Disorder based on DSM-5-TR criteria (fewer than 2 criteria endorsed), but warrants monitoring and intervention given trajectory and family history.`,
    },
    {
      id: 'social',
      title: 'Social History',
      content: `**Family of Origin:** Born and raised in San Jose, CA. Second of three children. Parents divorced when patient was 22 (precipitated her only prior therapy episode). Mother is a retired schoolteacher, described as supportive but "a worrier." Father is a retired construction worker, described as emotionally distant with a history of heavy drinking. Younger brother lives locally; older sister lives out of state. No history of abuse or neglect reported.

**Current Relationships:** Married to David Gonzalez (37, software engineer) for 6 years. Describes marriage as "solid" but strained by current situation — feels guilty about financial impact and being a "burden." Husband is described as patient and supportive, encouraging treatment.

**Children:** No children. Had been considering starting a family prior to job loss; this is now a source of additional anxiety.

**Housing:** Rents a two-bedroom apartment in a safe neighborhood. Stable housing. No concerns about housing security despite financial strain (husband's income covers rent).

**Employment/Education:** B.S. in Marketing, MBA (completed 2018). Previously employed as Marketing Manager for a mid-size tech company for 4 years. Laid off during company restructuring. Currently unemployed (4 months). Has submitted approximately 40 job applications with 5 interviews and no offers. Loss of professional identity is a significant theme.

**Financial Status:** Financial stress is moderate. Husband's income covers basic expenses. Savings being depleted (~3 months of reserves remaining). Loss of patient's income (~$95K/year) has eliminated discretionary spending and family planning timeline.

**Legal History:** No legal history.

**Military History:** No military service.

**Cultural/Spiritual Factors:** Mexican-American, second generation. Bilingual (English/Spanish). Raised Catholic, currently non-practicing but identifies cultural Catholicism as part of her identity. Reports some cultural stigma around mental health treatment in her family — "My family thinks you should just pray about it." Husband is more supportive of professional help.

**Trauma/Adverse Childhood Experiences:** ACE score: 2 (parental divorce, parental substance misuse). No reported physical, sexual, or emotional abuse. No community violence exposure. The parental divorce at age 22 was a significant stressor but managed with brief therapy. Father's drinking was a source of family tension but patient did not identify it as traumatic — "It was just how he was."`,
    },
    {
      id: 'medical',
      title: 'Medical History',
      content: `**Current Medical Conditions:** No active medical conditions. History of mild iron-deficiency anemia (resolved with supplementation, 2022).

**Medications:** Daily multivitamin. Melatonin 5mg PO PRN (occasional, for sleep). Ibuprofen PRN for headaches (1-2x/week, increased from prior baseline).

**Allergies:** No known drug allergies. No food allergies. Seasonal allergies (pollen) — managed with OTC antihistamines.

**Sleep Patterns:** Hypersomnia — sleeping 10-11 hours/night but reports non-restorative sleep. Sleep onset delayed (typically takes 1+ hours to fall asleep despite fatigue). Frequent awakenings (2-3x/night). Using wine and occasional melatonin as sleep aids. Denies formal insomnia diagnosis or sleep study. No snoring or apneic episodes per husband.

**Appetite/Weight Changes:** Decreased appetite with 12 lb unintentional weight loss over 3 months (156 lbs → 144 lbs). Reports food "doesn't taste good anymore" and frequently skips lunch. Husband prepares dinner, which patient eats partially.

**Pain Issues:** Tension headaches 1-2x/week (attributed to stress/muscle tension). Managed with ibuprofen. No other chronic pain.

**Recent Labs/Imaging:** Cardiac workup negative (2 ER visits): EKG normal sinus rhythm x2, troponin negative x2, CXR normal. CBC, CMP, TSH: WNL per PCP (6 weeks ago). TSH specifically 2.1 (euthyroid — rules out thyroid contribution to mood/anxiety symptoms).`,
    },
    {
      id: 'mse',
      title: 'Mental Status Examination',
      content: `**Appearance:** 34-year-old Latina female appearing stated age. Casually dressed in clean, appropriate clothing. Hair pulled back, minimal makeup. Mild psychomotor agitation noted (fidgeting with hands, shifting in seat). Overall grooming adequate but subtly less polished than expected for former marketing professional (patient acknowledged "I used to care more about how I looked").

**Behavior:** Cooperative and engaged throughout the 75-minute evaluation. Good eye contact initially, intermittent during discussion of depressive symptoms and suicidal ideation (averted gaze). Became tearful on multiple occasions, particularly when discussing job loss, feeling like a burden, and inability to plan for family. Wringing hands during anxiety-related discussion.

**Speech:** Normal rate, rhythm, and volume. Occasionally pressured when describing panic attack symptoms. No dysarthria, no word-finding difficulties. Articulate and coherent. Bilingual (English/Spanish), interview conducted in English.

**Mood (patient report):** "Anxious and sad. Mostly just overwhelmed."

**Affect (observed):** Anxious and dysphoric. Constricted range — primarily sad and worried with occasional brightening when discussing husband's support and past enjoyable activities. Affect congruent with stated mood. Tearful intermittently. No lability.

**Thought Process:** Linear, logical, and goal-directed. Mild circumstantiality at times (providing excessive detail about job search process). No loose associations, tangentiality, or thought blocking.

**Thought Content:** Preoccupied with themes of worthlessness, failure, financial worry, and being a burden. Rumination present regarding job loss and rejections. Passive suicidal ideation present ("it would be easier if I just didn't wake up") — see Risk Assessment. No active suicidal ideation, plan, or intent. No homicidal ideation. No obsessions or compulsions elicited. No paranoid or grandiose ideation.

**Perceptions:** Denies auditory or visual hallucinations. No illusions. No derealization or depersonalization reported, though describes feeling "disconnected" during panic attacks.

**Cognition:** Alert and oriented to person, place, time, and situation (x4). Attention intact — able to engage throughout lengthy evaluation. Concentration mildly impaired — patient reports difficulty reading and following complex job applications. Memory grossly intact for recent and remote events. Fund of knowledge consistent with educational background.

**Insight:** Good. Patient recognizes that her symptoms represent anxiety and depression, understands the connection to her life stressors, and acknowledges that her alcohol use is a maladaptive coping strategy. Appropriately recognizes need for professional help.

**Judgment:** Fair to good. Sought treatment at husband's encouragement. Completed cardiac workup to rule out medical etiology. Alcohol use as self-medication represents mildly impaired judgment, though patient acknowledges this. No high-risk behaviors reported beyond increased alcohol use.`,
    },
    {
      id: 'risk',
      title: 'Risk Assessment',
      content: `**Suicidal Ideation (Columbia Suicide Severity Rating Scale — C-SSRS):**
- Wish to be dead: YES — "It would be easier if I just didn't wake up" (passive, intermittent, past 2 weeks)
- Non-specific active suicidal thoughts: NO
- Active suicidal ideation with any methods: NO
- Active suicidal ideation with some intent to act: NO
- Active suicidal ideation with specific plan and intent: NO
- C-SSRS Severity Rating: 1 (Wish to Be Dead)

**Homicidal Ideation:** Denied. No expressed anger, threats, or intent to harm others.

**Self-Harm Urges:** Denied. No history of non-suicidal self-injury.

**Access to Lethal Means:** No firearms in the home. No stockpile of medications (melatonin and ibuprofen only — low lethality). No other lethal means identified.

**Risk Factors Present:**
- Current depressive episode (moderate severity)
- Passive suicidal ideation
- Increased alcohol use
- Family history of mood disorder (mother) and substance misuse (father)
- Social role loss (unemployment, professional identity)
- Financial stressor
- Insomnia/sleep disturbance
- Recent significant loss (job)
- Social withdrawal

**Protective Factors Present:**
- Strong marital relationship (husband supportive, encouraging treatment)
- No prior suicide attempts
- No access to lethal means
- Help-seeking behavior (presenting for treatment)
- Good insight into symptoms
- Reasons for living identified (husband, desire for future family)
- Cultural/religious values against suicide
- No substance use disorder
- No psychotic symptoms
- No history of self-harm

**Risk Level Determination:** LOW-TO-MODERATE. Patient presents with passive suicidal ideation without plan, intent, or means. Multiple protective factors present. No prior attempts or self-harm history. Increased alcohol use and depressive severity warrant close monitoring.

**Safety Plan (Stanley-Brown):**
1. *Warning signs:* Feeling trapped, increasing hopelessness, strong urge to isolate, having more than 3 drinks
2. *Internal coping strategies:* Deep breathing exercises, going for a walk, listening to music, journaling
3. *Social contacts for distraction:* Call younger brother (Carlos), text friend (Jennifer), go to a coffee shop
4. *People to ask for help:* Husband David (primary), mother Elena, this therapist
5. *Professional contacts:* This clinic (XXX-XXX-XXXX), 988 Suicide & Crisis Lifeline, nearest ER
6. *Making the environment safe:* Keep alcohol out of the house during treatment initiation (discussed with patient — she is willing to try this with husband's support)

Patient verbalized understanding of safety plan and agreed to all steps. Copy provided to patient. Husband to be involved in safety planning at next session (with patient consent).`,
    },
    {
      id: 'formulation',
      title: 'Diagnostic Formulation',
      content: `**DSM-5-TR Diagnoses:**

1. **Generalized Anxiety Disorder (F41.1)** — Excessive anxiety and worry about multiple domains (finances, career, self-worth, future family planning) occurring more days than not for >4 months. Associated with restlessness, concentration difficulty, sleep disturbance, and muscle tension (headaches). Symptoms cause clinically significant distress and functional impairment.

2. **Panic Disorder (F41.0)** — Recurrent unexpected panic attacks (daily) with palpitations, dyspnea, chest tightness, dizziness, paresthesias, and sense of impending doom. Duration 15-20 minutes. Two ER presentations with negative cardiac workup. Persistent worry about future attacks.

3. **Major Depressive Disorder, Single Episode, Moderate (F32.1)** — Depressed mood, anhedonia, hypersomnia, decreased appetite with significant weight loss (12 lbs/3 months), fatigue, feelings of worthlessness, passive suicidal ideation. PHQ-9 score: 17 (moderately severe). Duration: approximately 2 months. First lifetime episode.

**Differential Diagnoses Considered:**
- Adjustment Disorder with Mixed Anxiety and Depressed Mood: Considered but severity of symptoms (daily panic attacks, PHQ-9 of 17, passive SI) exceeds threshold for full syndromal diagnoses above
- Bipolar Disorder: No history of manic/hypomanic episodes; family history of bipolar (aunt) warrants monitoring
- Thyroid disorder: Ruled out (TSH 2.1)
- Cardiac arrhythmia: Ruled out (negative ER workups x2)
- Alcohol Use Disorder: Does not currently meet criteria (<2 DSM-5 criteria) but at-risk use warrants monitoring

**Case Conceptualization:** Maria presents with anxiety and depressive symptoms precipitated by a significant psychosocial stressor (job loss) in the context of predisposing factors including family history of mood disorder and substance misuse, perfectionistic/achievement-oriented personality traits, and relatively limited prior exposure to adversity. Cognitive distortions include catastrophizing (financial ruin), overgeneralization (rejection = worthlessness), and mental filtering (focusing on failures while discounting strengths). The panic attacks appear to have developed through interoceptive conditioning — initial anxiety-related physiological arousal was catastrophically misinterpreted (cardiac fears), leading to a cycle of anxiety sensitivity and avoidance. Alcohol use has developed as a maladaptive coping mechanism, likely modeling a pattern observed in her father. Perpetuating factors include unemployment, social withdrawal, avoidant coping (alcohol, isolation), and loss of daily structure and professional identity.

**Strengths/Resources:** High intelligence and educational attainment. Strong marital bond. Good insight. Motivated for treatment. Prior positive therapy experience. Cultural and family connections. No prior psychiatric history suggests good premorbid functioning. Financial safety net (husband's income, some savings).

**Barriers to Treatment:** Potential cultural stigma from family of origin. Financial constraints may limit session frequency. Alcohol use may interfere with therapeutic progress. Fear-avoidance patterns may limit engagement with exposure-based interventions initially.`,
    },
    {
      id: 'plan',
      title: 'Treatment Plan',
      content: `**Treatment Goals:**

1. *Panic Disorder:* Reduce panic attack frequency from daily to ≤1/week within 8 weeks and eliminate panic attacks within 16 weeks. Develop interoceptive exposure tolerance and eliminate catastrophic misinterpretation of somatic symptoms.

2. *Generalized Anxiety:* Reduce GAD-7 from 16 to ≤7 (mild range) within 12 weeks. Develop effective worry management strategies. Resume previously avoided activities.

3. *Major Depression:* Reduce PHQ-9 from 17 to ≤9 (mild range) within 12 weeks. Eliminate passive suicidal ideation within 4 weeks. Restore engagement in pleasurable activities, social connections, and daily structure.

4. *Alcohol Use:* Reduce alcohol consumption to ≤4 standard drinks/week (low-risk guidelines) within 4 weeks. Develop 3+ alternative coping strategies for anxiety and insomnia. Abstinence during initial treatment phase (patient-agreed goal).

5. *Functional Recovery:* Resume job search with confidence. Develop healthy daily routine and structure. Re-engage social relationships. Discuss and make progress toward family planning decisions.

**Modality:** Individual psychotherapy (primary). Couples session for safety planning and psychoeducation (1 session, with patient consent obtained).

**Frequency:** Weekly 50-minute sessions for initial 8 weeks, then reassess for potential step-down to biweekly.

**Therapeutic Approach:**
- *Cognitive Behavioral Therapy (CBT):* Primary modality. Cognitive restructuring targeting catastrophizing, worthlessness beliefs, and anxiety sensitivity. Behavioral activation for depression. Interoceptive and situational exposure for panic. Graded exposure for avoidance behaviors.
- *Mindfulness-Based Stress Reduction:* Adjunctive. Mindfulness meditation training for anxiety management and present-moment awareness. Body scan techniques for somatic symptom management.
- *Motivational Interviewing:* For alcohol use reduction. Explore ambivalence, strengthen change talk, develop alternative coping.

**Medication Management:** Referral placed to Dr. James Park, MD (psychiatry) for medication evaluation. Recommend consideration of SSRI (e.g., sertraline or escitalopram) given comorbid anxiety disorders and depression. SSRI would address GAD, panic, and depression simultaneously. Benzodiazepine use to be avoided given family history of substance misuse and current alcohol use.

**Referrals:**
- Psychiatry (Dr. James Park, MD) — medication evaluation, appointment to be scheduled this week
- Ophthalmology: N/A
- Nutritional counseling: Consider if appetite/weight loss persists

**Crisis Plan:**
- Safety plan completed and provided to patient (see Risk Assessment section)
- Patient has 988 Suicide & Crisis Lifeline number, clinic crisis line number, and nearest ER location
- Patient to call clinic or 988 if suicidal thoughts intensify or become active
- Husband aware and involved in safety planning (with consent)
- Risk to be reassessed at every session using C-SSRS brief screener

**Next Session Plan:** Begin CBT with psychoeducation about anxiety-depression cycle and panic disorder model. Introduce diaphragmatic breathing as first coping skill. Assign activity monitoring/mood tracking homework. Begin behavioral activation scheduling.`,
    },
  ],
};

// ═══════════════════════════════════════
// MOCK VISIT DATA (for dashboard)
// ═══════════════════════════════════════

export const mockVisits: Visit[] = [
  {
    id: 'visit-001',
    patientName: 'Robert Johnson',
    providerType: 'PT',
    frameworkId: 'rehab-pt-eval',
    frameworkName: 'PT Initial Evaluation',
    domain: 'Rehabilitation',
    date: '2026-02-12',
    duration: 58,
    status: 'complete',
    transcript: mockTranscripts['pt-eval'],
    note: mockNotes['pt-eval'],
    summary: 'Initial PT evaluation for 38-year-old male electrician with 6-week history of mechanical low back pain and right-sided radiculopathy following lifting injury. MRI confirms L4-L5 disc bulge. Presentation includes limited lumbar ROM (40% flexion), positive SLR at 55°, core/hip weakness, and elevated fear-avoidance beliefs. ODI 48% (severe disability). Symptoms centralize with extension — good prognostic indicator. Plan: 2x/week PT for 8 weeks targeting pain reduction, core stabilization, neural mobility, and graded return to work as electrician.',
  },
  {
    id: 'visit-002',
    patientName: 'Sarah Chen',
    providerType: 'MD',
    frameworkId: 'med-soap-followup',
    frameworkName: 'SOAP — Follow-Up Visit',
    domain: 'Medical',
    date: '2026-02-11',
    duration: 22,
    status: 'complete',
    transcript: mockTranscripts['soap-followup'],
    note: mockNotes['soap-followup'],
    summary: 'Follow-up visit for 56-year-old female with hypertension and type 2 diabetes. Blood pressure improving on lisinopril 10mg (138/85 from 150s/90s) but new ACE inhibitor cough noted — monitoring, may switch to ARB. HbA1c improved from 7.8% to 7.2% with lifestyle modifications. LDL at goal on statin. Patient adherent to walking program and dietary changes. Continue current regimen, recheck in 4 weeks.',
  },
  {
    id: 'visit-003',
    patientName: 'Maria Gonzalez',
    providerType: 'LCSW',
    frameworkId: 'bh-intake',
    frameworkName: 'Biopsychosocial Intake Assessment',
    domain: 'Behavioral Health',
    date: '2026-02-10',
    duration: 75,
    status: 'complete',
    transcript: mockTranscripts['bh-intake'],
    note: mockNotes['bh-intake'],
    summary: 'Biopsychosocial intake for 34-year-old Latina female presenting with daily panic attacks, generalized anxiety, and moderate major depression precipitated by job loss 4 months ago. PHQ-9: 17, GAD-7: 16. Passive suicidal ideation without plan/intent — safety plan completed. At-risk alcohol use (14-21 drinks/week, up from baseline). Diagnoses: GAD, Panic Disorder, MDD single episode moderate. Plan: Weekly CBT + mindfulness, psychiatry referral for SSRI evaluation, alcohol reduction via MI.',
  },
  {
    id: 'visit-004',
    patientName: 'James Mitchell',
    providerType: 'PT',
    frameworkId: 'rehab-pt-daily',
    frameworkName: 'PT Daily/Progress Note',
    domain: 'Rehabilitation',
    date: '2026-02-10',
    duration: 45,
    status: 'complete',
    transcript: '',
    note: [
      { id: 's', title: 'Subjective', content: '**Pain Level:** NPRS 4/10 (down from 6/10 last visit). Patient reports improved tolerance for sitting — able to sit through 45-minute lunch break at work without needing to stand. Morning stiffness duration decreased from 30 minutes to approximately 15 minutes. Completed HEP 5/7 days. Reports difficulty with piriformis stretching — "not sure I\'m doing it right." Sleeping better — waking only once per night vs. 3-4 times previously.' },
      { id: 'o', title: 'Objective', content: '**Interventions Performed:**\n- Manual Therapy (CPT 97140) — 15 min: L4-L5 PA mobilization (Grade III-IV), right piriformis soft tissue mobilization, right sciatic nerve glides\n- Therapeutic Exercise (CPT 97110) — 20 min: Core stabilization progression (dead bug with contralateral reach, bird-dog holds 15 sec, side plank modified 10 sec x 5), hip strengthening (sidelying hip abduction with resistance band, bridging with marching)\n- Neuromuscular Re-education (CPT 97112) — 10 min: Single limb stance training on foam surface, gait training with verbal cueing for normalized stride length\n\n**Objective Measurements:** Lumbar flexion AROM: 36° (↑ from 24° initial eval). SLR right: 65° (↑ from 55°). Single limb stance right: 24 sec (↑ from 18 sec). Gait speed: 1.15 m/s (↑ from 1.0 m/s).\n\n**Patient Response:** Tolerated all interventions well. Reported 50% reduction in buttock symptoms following nerve glides. No adverse reactions.' },
      { id: 'a', title: 'Assessment', content: '**Progress Toward Goals:**\n- STG 1 (Pain ≤3/10 at rest): Progressing — current 4/10, improving trend ✓\n- STG 2 (Flexion ≥45°): Progressing — current 36°, up from 24° ✓\n- STG 3 (SLR ≥70°): Progressing — current 65°, up from 55° ✓\n- STG 5 (PSFS ≥4/10): Progressing — sitting tolerance improved significantly\n\n**Skilled Need Justification:** Continued skilled PT required for manual therapy progression (joint and soft tissue mobilization techniques require ongoing skilled assessment of tissue response), advancement of core stabilization program (patient requires cueing for proper TA activation during higher-level exercises), and correction of HEP performance (piriformis stretch technique needs hands-on correction).\n\n**Treatment Effectiveness:** Patient demonstrating measurable objective improvement across all parameters. Centralization pattern maintained — good prognostic sign. Rate of progress is appropriate for timeline.' },
      { id: 'p', title: 'Plan', content: '**Next Visit Plan:** Progress core stabilization to anti-rotation exercises (Pallof press). Introduce standing balance perturbation training. Begin light lifting simulation (10 lbs) if pain ≤3/10 at rest. Continue manual therapy with progression to Grade IV mobilization as tolerated.\n\n**HEP Updates:** Corrected piriformis stretch technique — demonstrated and observed 3 correct repetitions with return demonstration. Added resistance band to clamshells (yellow band). Progressed walking to 25 minutes.\n\n**Frequency:** Continue 2x/week. Visit 5 of 16. Next reassessment at visit 8 with formal outcome measures.\n\n**Coordination of Care:** None needed at this time.' },
    ],
    summary: 'PT follow-up visit 5/16 for lumbar disc displacement with radiculopathy. Patient improving — pain decreased from 6/10 to 4/10, lumbar flexion improved 24° to 36°, SLR improved 55° to 65°. Tolerating core stabilization progression. Continue 2x/week, advance program next visit.',
  },
];
