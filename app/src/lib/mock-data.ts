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


  'med-soap-new': `Provider: Good morning, I'm Dr. Chen. I see you're a new patient. What brings you in today?

Patient: Hi Doctor. I've been having these really bad headaches for the past month. They're getting worse and I'm worried.

Provider: Tell me about the headaches. Where exactly do you feel them?

Patient: Mostly on the right side, behind my eye. It's like a throbbing, pulsing pain. Sometimes I see these zigzag lines before the headache starts.

Provider: How severe are they, on a scale of 0 to 10?

Patient: Usually about a 7 or 8. When they're really bad, I have to lie down in a dark room. Light and noise make it worse.

Provider: How often are they occurring?

Patient: About three times a week now. They last anywhere from 4 to 12 hours.

Provider: Any nausea or vomiting with them?

Patient: Yes, I get nauseous almost every time. I've thrown up a couple of times.

Provider: Let me get some background. Any past medical history?

Patient: I have high blood pressure, been on lisinopril for two years. And I was told I have borderline high cholesterol. No surgeries. I'm allergic to sulfa drugs — I break out in hives.

Provider: Family history?

Patient: My mother had migraines too. My father has diabetes. My grandmother had a stroke at 72.

Provider: Do you smoke, drink alcohol, use any substances?

Patient: No smoking. I have a glass of wine maybe once a week. No drugs.

Provider: Let me do a full examination now. Please have a seat on the exam table.

[Physical examination performed]

Provider: Okay, your blood pressure is 142 over 88, which is a bit elevated. Heart rate 76, regular. Temperature normal. Your neurological exam is normal — cranial nerves intact, strength and sensation normal, reflexes symmetric. Fundoscopic exam shows no papilledema. I don't see any red flags, but given the frequency and the visual aura, this is consistent with migraine with aura. I'd like to start you on a preventive medication — topiramate 25mg, slowly increasing. For acute attacks, sumatriptan 50mg. Let's also check some labs and recheck your blood pressure in two weeks.`,


  'med-hp': `Provider: Good evening, Mr. Williams. I'm Dr. Patel, the hospitalist. I understand you came in through the emergency department. Tell me what happened.

Patient: I was at home watching TV and suddenly felt this crushing pressure in my chest. It felt like an elephant was sitting on me. My left arm went numb and I started sweating. My wife called 911.

Provider: When exactly did this start?

Patient: About four hours ago, around 6 PM.

Provider: Have you ever had chest pain like this before?

Patient: I've had some occasional chest tightness with exertion over the past few months, but nothing like this. This came on at rest.

Provider: Any shortness of breath, dizziness, or loss of consciousness?

Patient: I was short of breath, yes. Felt lightheaded but didn't pass out.

Provider: Let me go through your medical history. What conditions do you have?

Patient: Type 2 diabetes for about 10 years, high blood pressure, high cholesterol. I had my gallbladder removed in 2018.

Provider: Medications?

Patient: Metformin 1000 twice a day, lisinopril 20mg, atorvastatin 40mg, aspirin 81mg daily.

Provider: Allergies?

Patient: No known drug allergies.

Provider: Family history?

Patient: My father died of a heart attack at 58. I'm 62 now. Mother has diabetes. Brother had a stent placed at 55.

Provider: Social history — smoking, alcohol?

Patient: I quit smoking five years ago. Smoked a pack a day for 30 years. I drink socially, maybe a beer on weekends.

Provider: Let me do a complete physical exam.

[Comprehensive physical examination]

Provider: Blood pressure 158 over 95, heart rate 92 and regular. You're diaphoretic. Heart sounds show an S4 gallop, no murmurs. Lungs have bibasilar crackles. No peripheral edema. Your EKG shows ST elevation in leads V1 through V4 — this is concerning for an anterior STEMI. Troponin is already elevated at 2.8. We need to get cardiology here for emergent catheterization. I'm starting heparin and a nitroglycerin drip now.`,


  'med-procedure': `Provider: Good morning Mrs. Garcia. We're here to perform the joint injection on your right knee as we discussed. Can you confirm your name and date of birth for me?

Patient: Maria Garcia, March 15, 1958.

Provider: And which knee are we injecting today?

Patient: My right knee.

Provider: Perfect. I've marked the right knee. Let me review — you're having this injection for your osteoarthritis with significant effusion. You've tried physical therapy and oral anti-inflammatories without adequate relief. We discussed the risks including infection, bleeding, cartilage damage, and allergic reaction. You signed the consent form. Any questions before we begin?

Patient: No, let's go ahead.

Provider: Okay, time out performed. Patient confirmed, site confirmed right knee, procedure confirmed — arthrocentesis with corticosteroid injection. No allergies to lidocaine or triamcinolone. Let me prep the area now.

[Procedure performed]

Provider: I'm cleaning the area with chlorhexidine. Sterile drape in place. I'm using a lateral suprapatellar approach. Injecting 2cc of 1% lidocaine for local anesthesia. Now inserting an 18-gauge needle — I'm aspirating first. I'm getting about 15cc of clear, straw-colored synovial fluid. No blood, no cloudiness. Now injecting 1cc of triamcinolone 40mg mixed with 4cc of 0.25% bupivacaine. Good distribution. Removing the needle. Pressure applied. Bandage in place. No complications. Total procedure time about 8 minutes. You tolerated it well. The fluid will be sent for analysis. Keep it easy for 48 hours, ice as needed.`,


  'med-awv': `Provider: Good morning, Mr. Thompson. You're here for your Annual Wellness Visit. How have you been feeling overall?

Patient: Pretty good, actually. I turned 68 last month. Feeling my age a bit but can't complain.

Provider: Great. Let me go through our health risk assessment. How would you rate your overall health?

Patient: I'd say fair to good. My knees bother me and I get tired more easily.

Provider: Are you able to do your daily activities independently — bathing, dressing, cooking, managing medications?

Patient: Yes, all of that. My wife helps with the cooking but I can do it.

Provider: Any falls in the past year?

Patient: I tripped on the porch step about two months ago. Caught myself, didn't fall all the way. But it scared me.

Provider: Do you ever feel depressed or have little interest in things?

Patient: Not really. I stay busy with the garden and my grandkids. Sometimes I feel down in winter but it passes.

Provider: Let me do the PHQ-2 screening. Over the past two weeks, how often have you felt down, depressed, or hopeless? And how often have you had little interest or pleasure in doing things?

Patient: Maybe a couple days for each. Not much.

Provider: That's a score of 2, which is below the threshold. Good. Now let me check your cognition — I'm going to say three words and ask you to remember them. Apple, table, penny. Can you repeat those?

Patient: Apple, table, penny.

Provider: Good, I'll ask you again in a few minutes. What medications are you taking?

Patient: Lisinopril for blood pressure, atorvastatin for cholesterol, a baby aspirin, vitamin D, and a multivitamin.

[Examination performed]

Provider: Your blood pressure is 132 over 78, good. BMI is 27.4 — slightly overweight. Vision screening shows 20/30 right eye, 20/25 left — you may want to see the ophthalmologist. Hearing seems adequate but we can do a formal screening if you notice changes. And those three words?

Patient: Apple, table... penny!

Provider: Perfect. Let me review your screening schedule. You're due for a colonoscopy — last one was 2016. Flu shot is current. You need a pneumonia booster. And let's make sure your shingles vaccine series is complete.`,


  'med-ed': `Nurse: Patient is a 34-year-old male, arrived by EMS, motorcycle accident. GCS 15. Complaining of right leg pain and abdominal pain. Vitals: BP 108/72, heart rate 112, respiratory rate 22, O2 sat 97% on room air. Triage level ESI 2.

Provider: Sir, can you tell me your name?

Patient: Mike... Mike Rodriguez. My leg, Doc, my leg is killing me.

Provider: What happened?

Patient: I was on my bike going about 35 miles an hour and a car ran a red light and hit me on the right side. I went over the handlebars.

Provider: Were you wearing a helmet?

Patient: Yes, full face helmet. No head injury, I was conscious the whole time.

Provider: Any allergies?

Patient: No.

Provider: When did you last eat?

Patient: Lunch, about 3 hours ago.

Provider: Any medical problems or medications?

Patient: No, I'm healthy. No meds.

Provider: Where does it hurt?

Patient: My right leg, below the knee. And my stomach hurts on the right side.

Provider: I'm going to examine you now.

[Examination performed]

Provider: Alert and oriented, moderate distress. Head is normocephalic, no lacerations. Pupils equal and reactive. C-spine non-tender, full range of motion. Chest is clear bilaterally, no crepitus. Heart is tachycardic but regular. Abdomen — there's right upper quadrant tenderness with voluntary guarding. No rebound. Right lower leg has obvious deformity of the tibia, with swelling and ecchymosis. Pedal pulses are intact. Sensation intact in the foot. No open fracture.

Provider: Let's get a FAST exam, right leg X-ray, CBC, BMP, lipase, type and screen, and a CT abdomen pelvis with contrast. Start a liter of LR wide open. Morphine 4mg IV for pain. Splint that right leg.

[Results returning]

Provider: X-ray shows a comminuted fracture of the right tibia and fibula. CT shows a grade 2 liver laceration with a small amount of free fluid. No other injuries. FAST was positive in Morrison's pouch. His repeat vitals are BP 112/76, heart rate 102 — trending better with fluids. I'm calling trauma surgery and orthopedics for consults. We'll admit for observation of the liver lac and ortho will plan for the tib-fib fixation.`,


  'med-discharge': `Provider: Dictating discharge summary for patient James Wilson, MRN 445892. Admitted February 10th, discharged February 15th. Length of stay 5 days. Admitting and attending physician Dr. Sarah Kim.

Primary diagnosis: Community-acquired pneumonia, right lower lobe, complicated by parapneumonic effusion. Secondary diagnoses: COPD exacerbation, type 2 diabetes with hyperglycemia during admission.

Chief complaint on admission was 3 days of worsening cough, fever to 102.4, and shortness of breath. Patient is a 71-year-old male with known COPD, diabetes, and hypertension. Chest X-ray on admission showed right lower lobe consolidation. CT chest confirmed RLL pneumonia with small pleural effusion.

Hospital course: Started on ceftriaxone and azithromycin. Blood cultures were negative. Sputum grew Streptococcus pneumoniae. Narrowed to amoxicillin-clavulanate. Required 2 liters nasal cannula for first 3 days, weaned to room air by day 4. Effusion remained stable, did not require thoracentesis. Diabetes management — held metformin, used sliding scale insulin, A1C found to be 8.9 which is above goal. Pulmonology consulted for COPD — added tiotropium inhaler.

Condition at discharge: Stable, afebrile for 48 hours, O2 sat 94% on room air, ambulating independently.

Discharge medications: Augmentin 875 for 5 more days, tiotropium 18mcg daily inhaler — new, metformin resumed, glipizide — new — 5mg daily, home medications otherwise continued.

Follow up: PCP Dr. Johnson in 1 week, pulmonology in 4 weeks. Repeat chest X-ray in 6 weeks. Diabetes education referral placed. Return to ED for fever over 101, worsening shortness of breath, chest pain, or coughing up blood.`,


  'rehab-pt-daily': `Provider: Good morning, Robert. How are you feeling today? This is visit number 8.

Patient: Better than last week. My back still hurts in the morning but the exercises are helping. I'd say my pain is about a 4 today, down from a 5 last time.

Provider: Great improvement. Have you been doing your home exercises?

Patient: Yes, every morning. The cat-camel and the bridges. I'm up to 3 sets of 12 on the bridges now.

Provider: Excellent compliance. Any issues with the exercises?

Patient: The piriformis stretch still bothers me a bit on the right side. I can feel it pulling.

Provider: Okay, we'll modify that today. Let's get started.

[Treatment session]

Provider: Today we performed manual therapy — lumbar spine joint mobilizations grade 3 posteroanterior at L4-5, approximately 8 minutes. Soft tissue mobilization to right piriformis and lumbar paraspinals, 7 minutes. Then therapeutic exercise — core stabilization progression, we advanced to dead bugs with leg extension, 3 sets of 10. Bird dogs 3 sets of 10 each side. Bridge progression with marching, 3 sets of 8. And neuromuscular re-education for hip hinge pattern, 10 minutes. Total skilled treatment time 42 minutes.

Your lumbar flexion has improved to about 60% of normal, up from 40% at the initial eval. Straight leg raise on the right is now 70 degrees, up from 55. You're making steady progress. I'm going to add some light deadlift patterning next visit to start work simulation. We'll continue twice a week. Updated your home program — added the dead bug exercise.`,


  'rehab-ot-eval': `Provider: Hello Mrs. Park. I'm Jennifer, your occupational therapist. You were referred after your stroke three weeks ago. Tell me about how things have been at home.

Patient: It's been really hard. I can barely use my right hand. I'm right-handed and I can't write, can't button my shirt, can't cut my food. My daughter has been doing everything for me. I feel like a burden.

Provider: I understand how frustrating that must be. What were you doing before the stroke?

Patient: I was fully independent. I worked part-time at a bookstore, I cooked every night, I did my own gardening. Now I can't even open a jar.

Provider: What are your main goals for therapy?

Patient: I want to be able to dress myself, feed myself, and write again. If I could get back to cooking, that would be wonderful.

Provider: Let me assess your right upper extremity. Can you try to reach forward for me?

[Evaluation performed]

Provider: Right shoulder active flexion is 95 degrees, abduction 80 degrees. Elbow flexion full, extension lacking 15 degrees. Wrist extension is only about 20 degrees. Finger extension is minimal — you can open about halfway. Grip strength on the right is 8 pounds compared to 45 on the left. Pinch strength lateral is 2 pounds on the right versus 12 on the left. Sensation — light touch is diminished in the fingers, you can feel it but it's dull. Two-point discrimination is greater than 10mm in the fingertips. Coordination — you're having difficulty with rapid alternating movements. Fine motor tasks like picking up small objects are significantly impaired.

For ADLs — you need moderate assistance for upper body dressing, minimal assistance for lower body. You need setup help for eating — can use a fork with a built-up handle but can't cut food. Grooming needs minimal assist.

My assessment is moderate right upper extremity hemiparesis with impaired fine motor coordination and decreased sensation. Rehab potential is good given your age, motivation, and only 3 weeks post-stroke. I recommend OT 3 times a week for 12 weeks. We'll focus on neuromuscular re-education, fine motor training, ADL retraining, and adaptive equipment to maximize independence.`,


  'rehab-slp-eval': `Provider: Good morning, Mrs. Chen. I'm Dr. Taylor, the speech-language pathologist. Your neurologist referred you after your recent stroke. Can you tell me what's been going on?

Patient: I... words are hard. I know what I want to say but... it doesn't come out right. Sometimes wrong words come out.

Provider: I understand. When did this start?

Patient's husband: It started right after her stroke, about two weeks ago. She was fine before. She was a teacher — very articulate. Now she struggles with everything.

Provider: Mrs. Chen, can you tell me what you had for breakfast today?

Patient: I had... the... toast. And the... orange... the drink... juice! Orange juice.

Provider: Good. I'm going to show you some pictures and ask you to name them.

[Assessment performed]

Provider: On the oral mechanism exam — facial symmetry is slightly asymmetric with right-sided weakness. Lip strength is functional. Tongue range of motion is within normal limits, though lateralization to the right is slightly reduced. No evidence of dysarthria. Speech rate is slowed with word-finding pauses.

For language assessment — receptive language is mildly impaired. She follows 2-step commands accurately but has difficulty with complex multi-step instructions. Reading comprehension is mild-moderate impaired. Expressive language — moderate anomic aphasia. She produces grammatically correct but simplified sentences with frequent word-finding pauses and occasional semantic paraphasias, like saying "chair" for "table." Naming is 60% accurate on the Boston Naming Test. Repetition is relatively preserved. Writing — she can write her name and short words but has difficulty with sentences.

For swallowing — no complaints of dysphagia. Trial swallows of thin liquid and solids were unremarkable. No coughing, no wet vocal quality.

Diagnosis is moderate anomic aphasia secondary to left hemisphere CVA. Rehab potential is good. I recommend SLP therapy twice a week for 10 weeks, focusing on word retrieval strategies, naming therapy, and functional communication training.`,


  'rehab-progress': `Provider: Dictating rehabilitation progress report for patient Robert Johnson. Reporting period: Visits 1 through 12, January 15 through February 12, 2026. Diagnosis: Lumbar disc herniation L4-L5 with radiculopathy, ICD-10 M51.16. Treatment frequency: Twice weekly. Total visits this period: 12 of 12 authorized.

Interventions provided: Manual therapy including joint mobilizations and soft tissue mobilization, CPT 97140. Therapeutic exercise for core stabilization, hip strengthening, and work simulation, CPT 97110. Neuromuscular re-education for movement patterns and body mechanics, CPT 97112.

Objective progress: Lumbar flexion improved from 40% to 75% of normal. Extension improved from 50% to 80%. Right straight leg raise improved from 55 degrees to 80 degrees. Hip extensor strength improved from 3+/5 to 4+/5. Oswestry Disability Index improved from 48% severe disability to 26% moderate disability — this exceeds the MCID of 6 points. NPRS average pain decreased from 7/10 to 3/10. Patient-Specific Functional Scale for work activities improved from 2/10 to 6/10.

Goals update: Short-term goal 1 — pain below 5/10 with activity — MET. Short-term goal 2 — sit tolerance 45 minutes — MET, now tolerating 60 minutes. Long-term goal 1 — return to modified duty — IN PROGRESS, patient cleared for light duty this week. Long-term goal 2 — full return to work as electrician — IN PROGRESS, targeting 4 more weeks.

Skilled need justification: Patient continues to require skilled PT for progressive functional training and work simulation activities that require clinical expertise to grade appropriately. His lumbar instability requires supervised progression of loading to prevent re-injury. Non-skilled alternatives such as a gym program are insufficient due to the complexity of his radiculopathy management and the need for ongoing clinical assessment of neurological status.

Updated plan: Continue PT 2x/week for 4 additional weeks, 8 visits. Progress to full work simulation including overhead reaching, kneeling, and lifting up to 50 pounds. Anticipated discharge date: March 12, 2026.`,


  'rehab-discharge': `Provider: Dictating rehabilitation discharge summary for patient Robert Johnson. Date of initial evaluation: January 15, 2026. Date of discharge: March 10, 2026. Total visits attended: 20 of 24 authorized. Four visits missed due to work schedule conflicts. Diagnosis: Lumbar disc herniation L4-L5 with radiculopathy. Payer: Blue Cross Blue Shield.

Initial presentation: 45-year-old electrician with 6-week history of low back pain with right lower extremity radiculopathy following lifting injury. Initial pain 7/10, Oswestry 48% severe disability, unable to work.

Treatment provided: Manual therapy — joint mobilizations and soft tissue mobilization. Therapeutic exercise — progressive core stabilization, hip strengthening, functional training, work simulation. Neuromuscular re-education — lifting mechanics, hip hinge patterning. Home exercise program updated throughout.

Objective outcomes: Lumbar flexion improved from 40% to 95% of normal. Extension 50% to 90%. Right SLR 55 degrees to 85 degrees. Hip extensor strength 3+/5 to 5/5. Grip strength maintained. Pain decreased from 7/10 to 1/10 average.

Functional outcome measures: Oswestry 48% to 12% — minimal disability. MCID achieved. NPRS 7 to 1. PSFS work activities 2/10 to 9/10. All MCID thresholds exceeded.

Goal achievement: All short-term and long-term goals met. 100% goal achievement. Patient returned to full duty as electrician without restrictions on March 4th.

Discharge reason: Goals met. Patient is independent with home exercise program and self-management strategies. No skilled need remaining. Rehab potential at discharge is excellent.

Discharge plan: Continue independent HEP 3x/week. May use gym for continued strengthening. Follow up with orthopedist in 6 weeks. Return to PT if symptoms recur or function declines.`,


  'bh-progress': `Provider: Good to see you again, Maria. It's been two weeks since our last session. How have things been?

Patient: Better, actually. I used the grounding technique you taught me during a panic attack last Tuesday and it actually worked. I was able to get through it in about 5 minutes instead of the usual 20.

Provider: That's wonderful progress. Tell me more about that experience.

Patient: I was in the grocery store and felt the panic coming on. My heart started racing and I felt dizzy. But I remembered the 5-4-3-2-1 technique and I focused on naming things I could see, touch, hear. It was like it broke the cycle.

Provider: How many panic attacks have you had in the past two weeks?

Patient: Three. Down from almost daily when I first came in. Two of them I was able to manage on my own. One was worse — that was Sunday night when I was looking at our bills.

Provider: And your mood? How has the depression been?

Patient: A little better. I went for a walk three times this week. And I cooked dinner on Saturday for the first time in months. My husband was so happy. But I still have days where I feel pretty low and don't want to get out of bed.

Provider: Have you had any thoughts of self-harm or not wanting to be alive?

Patient: No, not in the past two weeks. I think the medication is helping with that.

Provider: Good. Let me note — Maria presents with improved affect today, more animated and engaged compared to initial sessions. She makes good eye contact, speech is normal rate and rhythm. Mood reported as "okay, not great but better." Affect is congruent, mildly anxious but not distressed.

Today we continued CBT focusing on cognitive restructuring of catastrophic thoughts related to finances and self-worth. We practiced the thought record — identifying the automatic thought "I'll never find a job and we'll lose everything," examining the evidence for and against, and developing a balanced alternative thought. Maria was able to engage well with this process. We also reviewed the behavioral activation schedule — she's meeting her goal of one pleasant activity per day most days.

Plan: Continue current medication. Next session in two weeks — will introduce exposure hierarchy for situational anxiety triggers. Homework: continue thought records, increase walking to 4 times per week, and apply for one job this week using the structured approach we discussed.`,


  'bh-psych-eval': `Provider: Good afternoon. I'm Dr. Yamamoto, the psychiatrist. I've reviewed the referral from your therapist. Tell me what brings you here.

Patient: My therapist thinks I might need medication. I've been in therapy for about 6 months for depression and anxiety, and while it's helped some, I'm still really struggling. Especially with focus — I cant concentrate on anything.

Provider: Tell me about the depression first.

Patient: It's been going on for about two years. I lost my job, then my marriage fell apart. I feel worthless a lot. I sleep too much on weekends, like 12 hours, but during the week I'm up at 3 AM and can't fall back asleep. My appetite goes back and forth — sometimes I eat everything in sight, sometimes nothing.

Provider: And the anxiety?

Patient: Constant worry. About money, my kids, whether I'll find another job. I grind my teeth at night, my muscles are always tense, especially in my neck and shoulders. I worry about things that probably don't warrant that level of worry.

Provider: You mentioned difficulty concentrating. Tell me more.

Patient: I cant read more than a page without my mind wandering. I forget what I walked into a room for. At my part-time job I make mistakes I never would have made before. I lose my keys, my phone. It's embarrassing.

Provider: Was concentration ever an issue before the depression?

Patient: Honestly, yeah. In school I always had to work harder than everyone else. I'd procrastinate everything. My report cards always said "doesnt work up to potential." But I managed. Now with the depression on top of it, I cant manage anymore.

Provider: Any history of psychiatric medication?

Patient: I tried Lexapro about a year ago from my PCP. It helped the anxiety some but I felt like a zombie. I stopped after 3 months. Never tried anything else.

Provider: Substance use?

Patient: I drink maybe 3-4 beers on weekends. More when I'm stressed. No drugs. I quit smoking 5 years ago.

Provider: Any history of mania — periods of elevated mood, decreased need for sleep, racing thoughts, impulsive spending?

Patient: No, nothing like that.

Provider: Suicidal thoughts?

Patient: I've had passive thoughts, like life would be easier if I just didn't exist. But Id never act on it. My kids need me.

[Mental status examination]

Provider: You present as a well-groomed male in casual dress, appearing stated age. Good eye contact, cooperative. Speech is normal rate but slightly tangential at times. Mood is "tired and frustrated." Affect is constricted, mildly dysphoric. Thought process is circumstantial at times. No delusions. Denies hallucinations. Cognition — I administered the MOCA, scored 26, with deficits in attention and delayed recall. Insight is good, judgment is fair.

My diagnostic impression: Major depressive disorder, recurrent, moderate. Generalized anxiety disorder. And I'd like to evaluate for possible ADHD, predominantly inattentive type — your history of childhood concentration difficulties, current executive function complaints, and the pattern you describe warrants formal assessment. I'm going to start sertraline 50mg, which tends to be less sedating than escitalopram. We'll plan ADHD testing at the next visit. Follow up in 3 weeks.`,


  'bh-group': `Provider: Group therapy session note, February 15, 2026. Anxiety and Stress Management Group, Session 8 of 12. Facilitated by Dr. Lee and co-facilitator Sarah, LCSW intern. Group type: closed CBT-based psychoeducation group.

Members present: 6 of 8. Present: Maria G., James T., Linda K., Priya M., Robert S., Chris W. Absent: David L. (called ahead, sick), Ana P. (no-show, second consecutive absence — will follow up).

Session topic: Cognitive distortions — identifying and challenging automatic negative thoughts. Psychoeducation delivered on the top 10 cognitive distortions with handout. Group exercise: members identified their most common distortions using examples from their past week.

Group dynamics: High engagement today. Group cohesion continues to build. Maria shared her success with grounding techniques, which inspired several members. James was initially quiet but opened up when Chris validated his experience with catastrophizing. Linda challenged Priya's all-or-nothing thinking in a supportive way, demonstrating good universality. Robert used humor appropriately to normalize the experience.

Individual notes:
Maria G. — Active participant. Identified catastrophizing as her primary distortion. Shared grocery store panic success. Response to group very positive. Progress toward anxiety management goals.
James T. — Initially withdrawn. Participated after gentle encouragement. Identified mind-reading as his main distortion. Connected this to social anxiety. Making slow but steady progress.
Linda K. — Served as informal peer support. High engagement. May benefit from advanced group after this one.
Priya M. — Identified should statements. Became tearful when discussing expectations from family. Group provided appropriate support.
Robert S. — Good humor, engaged. Tends to intellectualize — gently redirected to emotional experience.
Chris W. — Strong session. Identified overgeneralization related to job rejection. Group exercise was effective for him.

Plan: Next session — behavioral experiments to test cognitive distortions. Follow up with Ana P. regarding attendance.`,


  'bh-crisis': `Provider: Crisis intervention note, February 16, 2026, 10:47 PM. Patient Tyler Henderson, age 22, referred by university resident advisor who found patient in dorm room with a suicide note.

Patient: I just... I can't do this anymore. Everything is falling apart. I failed my organic chemistry exam and I'm going to lose my scholarship and my parents will disown me.

Provider: Tyler, I'm glad you're here and you're safe. Can you tell me what was going through your mind tonight?

Patient: I was thinking about taking all my Adderall. I have a whole bottle. I wrote a note to my roommate. But then my RA knocked on my door and I just... I couldnt go through with it.

Provider: So you had a specific plan to take the Adderall. Did you take any tonight?

Patient: No. I almost did. I had the bottle in my hand.

Provider: Have you had thoughts like this before?

Patient: I've thought about it before, like a month ago during finals. But tonight was the first time I actually... had a plan and was going to do it.

Provider: Any history of self-harm?

Patient: I used to cut in high school. On my arms. I stopped about two years ago.

Provider: Are you using any substances?

Patient: I smoked weed earlier tonight. And I had a few beers. I'm not drunk.

Provider: On the Columbia scale, Tyler endorses active suicidal ideation with specific plan and intent. He had access to means — the Adderall. He was interrupted by his RA. Risk factors include academic stress, perceived parental expectations, prior self-harm history, substance use tonight, and impulsivity. His C-SSRS suggests high acute risk.

However, there are protective factors. He did not act on the plan when he had the means. He opened the door for his RA. He's engaged and communicating. He expresses ambivalence — "I couldnt go through with it." He has a relationship with his roommate he's protective of.

Tyler, I'd like to work with you on a safety plan right now. First, what are your warning signs that tell you you're heading to a crisis?

Patient: When I start thinking I'm a failure. When I isolate. When I stop going to class.

Provider: Good awareness. And what can you do internally when you notice those signs?

Patient: I guess... the breathing thing my old therapist taught me. Or going for a run. Music helps sometimes.

Provider: Let's write those down. And who can you reach out to?

Patient: My roommate Jake. My friend Melissa. Not my parents... not yet.

Provider: We're going to put 988 and this crisis center's number on your plan too. Now, about the Adderall — I'd like your RA to hold your medication and dispense it daily. Can we do that?

Patient: Yeah, okay. That's probably smart.

Provider: I'm recommending a voluntary psychiatric observation overnight. In the morning, we'll connect you with outpatient counseling at the university health center. Your follow up will be within 24 hours with the campus counselor.`,


  'bh-discharge': `Provider: Behavioral health discharge summary for patient Maria Gonzalez. Intake date: October 1, 2025. Discharge date: February 14, 2026. Level of care: Outpatient individual therapy with medication management. Primary diagnosis: Panic disorder, F41.0. Major depressive disorder, single episode, moderate, F32.1. Primary therapist: Dr. Lee. Prescriber: Dr. Yamamoto.

Total sessions attended: 18 individual therapy sessions, 12 group sessions (Anxiety and Stress Management group). 2 sessions missed. Medication management visits: 4.

Presenting problems at intake: Daily panic attacks, moderate depression, unemployment-related anxiety. Initial PHQ-9 score: 16 (moderately severe). Initial GAD-7: 18 (severe). Initial functional level: significant impairment in occupational, social, and self-care domains.

Treatment provided: Individual CBT focusing on cognitive restructuring, behavioral activation, and exposure therapy. Group CBT for anxiety management. Medication: Sertraline titrated to 100mg daily. Grounding and relaxation techniques. Career counseling referral.

Treatment outcomes: Discharge PHQ-9: 6 (mild). Discharge GAD-7: 7 (mild). Panic attacks reduced from daily to approximately once per month, manageable with learned techniques. Patient secured part-time employment in marketing. Resumed cooking, hiking, and social activities. Relationship with husband significantly improved per patient report.

Symptom trajectory: Improved. Substantial reduction in both depressive and anxiety symptoms. Risk level at discharge: low. No suicidal ideation in final 10 weeks of treatment.

Discharge reason: Treatment goals substantially met. Mutual agreement between therapist and patient that she has developed sufficient coping skills for independent management.

Continuing care: Continue sertraline 100mg, managed by PCP Dr. Peters. Psychiatry follow-up in 3 months for medication review. Attend NAMI support group weekly. Return to therapy if symptoms resurge. Crisis plan updated — call 988 or present to ED. Patient verbalized understanding of discharge plan and relapse prevention strategies.`,
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


  'med-soap-new': [
    { id: 'subjective', title: 'Subjective', content: '**Chief Complaint:** Recurrent headaches x 1 month, worsening\n\n**History of Present Illness:** 38-year-old female presents with right-sided throbbing headaches occurring 3x/week for the past month. Pain is retro-orbital, rated 7-8/10, lasting 4-12 hours. Associated with visual aura (zigzag lines), photophobia, phonophobia, nausea, and occasional emesis. Triggered by stress. Ibuprofen provides partial relief.\n\n**Past Medical History:** Hypertension (2 years), borderline hyperlipidemia\n**Past Surgical History:** None\n**Medications:** Lisinopril\n**Allergies:** Sulfa drugs (hives)\n**Family History:** Mother — migraines. Father — diabetes. Grandmother — CVA age 72\n**Social History:** Denies tobacco, drugs. Rare alcohol (1 glass wine/week). Works in office setting.\n**Review of Systems:** Positive for headache, nausea, visual changes. Negative for fever, weight change, weakness, numbness, syncope.', feedback: null },
    { id: 'objective', title: 'Objective', content: '**Vital Signs:** BP 142/88, HR 76, Temp 98.6°F, RR 16\n**General:** Alert, well-nourished female in no acute distress\n**HEENT:** Normocephalic, PERRL, fundoscopic exam — no papilledema\n**Cardiovascular:** Regular rate and rhythm, no murmurs\n**Respiratory:** Clear to auscultation bilaterally\n**Neurological:** CN II-XII intact. Strength 5/5 all extremities. Sensation intact. DTR 2+ and symmetric. Gait normal. Romberg negative.\n**Psychiatric:** Alert, oriented, appropriate affect', feedback: null },
    { id: 'assessment', title: 'Assessment', content: '1. **Migraine with aura** — classic presentation with unilateral throbbing, visual aura, photophobia, phonophobia, nausea\n2. **Hypertension, suboptimally controlled** — BP 142/88 on current regimen\n3. **Borderline hyperlipidemia** — needs lipid panel', feedback: null },
    { id: 'plan', title: 'Plan', content: '1. Start **topiramate 25mg daily**, titrate to 50mg after 2 weeks for migraine prevention\n2. **Sumatriptan 50mg PRN** for acute attacks (max 2x/week)\n3. Labs: CBC, BMP, lipid panel, TSH\n4. Recheck BP in 2 weeks — may need medication adjustment\n5. Headache diary — track frequency, triggers, severity\n6. Return precautions: worst headache of life, vision loss, weakness, fever with headache\n7. Follow up 4 weeks', feedback: null },
  ],


  'med-hp': [
    { id: 'history-of-present-illness', title: 'History of Present Illness', content: '62-year-old male with PMH of HTN, T2DM, HLD, and 30-pack-year smoking history (quit 5 years) presenting with acute onset crushing substernal chest pressure at rest beginning approximately 4 hours prior to arrival. Pain is 9/10, described as pressure with radiation to the left arm. Associated with diaphoresis, dyspnea, and lightheadedness. Denies syncope. Reports several months of exertional chest tightness that would resolve with rest. Family history significant for premature CAD (father MI at 58, brother stent at 55).', feedback: null },
    { id: 'past-medical-surgical-history', title: 'Past Medical/Surgical History', content: '**Medical:** Type 2 diabetes (10 years), hypertension, hyperlipidemia\n**Surgical:** Cholecystectomy 2018\n**Medications:** Metformin 1000mg BID, lisinopril 20mg daily, atorvastatin 40mg daily, aspirin 81mg daily\n**Allergies:** NKDA\n**Immunizations:** Up to date', feedback: null },
    { id: 'family-&-social-history', title: 'Family & Social History', content: '**Family:** Father — MI at 58 (deceased), Mother — T2DM, Brother — coronary stent at 55\n**Tobacco:** 30 pack-years, quit 5 years ago\n**Alcohol:** Social, 1-2 beers/weekend\n**Substance Use:** Denies\n**Occupation:** Retired warehouse manager\n**Living Situation:** Lives with wife', feedback: null },
    { id: 'review-of-systems', title: 'Review of Systems', content: '**Constitutional:** Diaphoresis, no fever/chills\n**Cardiovascular:** Chest pain, dyspnea on exertion\n**Respiratory:** Shortness of breath, no cough\n**GI:** No nausea/vomiting\n**Neurological:** Lightheadedness, no syncope\n**All other systems reviewed and negative', feedback: null },
    { id: 'physical-examination', title: 'Physical Examination', content: '**Vitals:** BP 158/95, HR 92, RR 20, SpO2 96% RA, Temp 98.4°F\n**General:** Anxious-appearing male, diaphoretic, moderate distress\n**HEENT:** Normocephalic, PERRL\n**Neck:** JVP not elevated, no carotid bruits\n**Heart:** Tachycardic, regular rhythm, S4 gallop, no murmurs\n**Lungs:** Bibasilar crackles, no wheezes\n**Abdomen:** Soft, non-tender\n**Extremities:** No edema, pulses intact\n**Neuro:** Alert, oriented x3, no focal deficits', feedback: null },
    { id: 'assessment-&-plan', title: 'Assessment & Plan', content: '**Diagnosis:** Acute anterior ST-elevation myocardial infarction (STEMI)\n\n**Evidence:** ST elevation V1-V4, troponin 2.8 (elevated), classic presentation with risk factors\n\n**Plan:**\n1. Emergent cardiology consultation for cardiac catheterization\n2. Heparin drip initiated\n3. Nitroglycerin drip for chest pain\n4. Continue aspirin, add clopidogrel 600mg loading dose\n5. Serial troponins q6h\n6. Telemetry monitoring\n7. NPO for potential catheterization\n8. Echocardiogram in AM\n9. Diabetes: hold metformin, start insulin drip\n10. Code status: Full code, discussed with patient', feedback: null },
  ],


  'med-procedure': [
    { id: 'pre-procedure', title: 'Pre-Procedure', content: '**Indication:** Right knee osteoarthritis with effusion, refractory to conservative management\n**Informed Consent:** Obtained. Risks discussed including infection, bleeding, cartilage damage.\n**Time-Out:** Performed. Patient Maria Garcia confirmed. Right knee marked. Procedure: arthrocentesis with corticosteroid injection.\n**Allergies:** NKDA\n**Pre-Procedure Assessment:** Vitals stable. Right knee with moderate effusion, tenderness medial joint line.', feedback: null },
    { id: 'procedure-details', title: 'Procedure Details', content: '**Procedure:** Right knee arthrocentesis with intra-articular injection (CPT 20611)\n**Date/Time:** February 15, 2026, 10:15 AM\n**Performing Provider:** Dr. Chen\n**Anesthesia:** Local — 2cc 1% lidocaine\n**Technique:** Lateral suprapatellar approach. Sterile prep with chlorhexidine. 18-gauge needle inserted. Aspirated 15cc clear, straw-colored synovial fluid. Injected triamcinolone 40mg + bupivacaine 0.25% 4cc. Needle removed, pressure applied, bandage placed.\n**Specimens:** Synovial fluid sent for analysis\n**EBL:** Minimal\n**Complications:** None', feedback: null },
    { id: 'post-procedure', title: 'Post-Procedure', content: '**Patient Condition:** Stable, comfortable, good ROM immediately post-injection\n**Findings:** Aspirated fluid clear, no evidence of infection or hemarthrosis\n**Instructions:** Rest 48 hours, ice PRN, avoid strenuous activity x 1 week\n**Follow-Up:** Return in 4 weeks. Call if increased pain, redness, warmth, or fever\n**Wound Care:** Bandage may be removed in 24 hours', feedback: null },
  ],


  'med-awv': [
    { id: 'health-risk-assessment', title: 'Health Risk Assessment', content: '**Demographics:** 68-year-old male\n**Self-Assessment:** Fair to good\n**Psychosocial Risks:** Mild seasonal mood changes, not clinically significant\n**Behavioral Risks:** Sedentary lifestyle, slightly overweight\n**ADL/IADL:** Fully independent in all ADLs and IADLs\n**Fall Risk:** Low risk. One near-fall 2 months ago (tripped on step). No injuries.', feedback: null },
    { id: 'medical-family-history-update', title: 'Medical/Family History Update', content: '**Conditions:** Hypertension (stable), hyperlipidemia (stable)\n**Medications:** Lisinopril, atorvastatin, aspirin 81mg, vitamin D, multivitamin\n**Family History:** No changes', feedback: null },
    { id: 'examination-elements', title: 'Examination Elements', content: '**Height/Weight/BMI:** 5\'10", 191 lbs, BMI 27.4 (overweight)\n**Blood Pressure:** 132/78\n**Visual Acuity:** 20/30 OD, 20/25 OS — ophthalmology referral recommended\n**Cognitive Assessment:** 3-word recall 3/3. Clock drawing normal. No concerns.\n**Depression Screening (PHQ-2):** Score 2/6 — below threshold, no further screening needed\n**Hearing:** Grossly intact, formal screening not indicated at this time', feedback: null },
    { id: 'personalized-prevention-plan', title: 'Personalized Prevention Plan', content: '**Screening Schedule:**\n- Colonoscopy — due (last 2016)\n- Lung cancer screening — not indicated (quit >15 years threshold in 2031)\n- AAA screening — already completed\n\n**Immunizations:**\n- Flu — current\n- Pneumococcal booster — due, ordered PCV20\n- Shingles — verify series completion\n\n**Counseling:** Weight management, increase physical activity to 150 min/week\n**Advance Care Planning:** Discussed, patient will consider and discuss with family\n**Follow-Up:** Annual, sooner if concerns', feedback: null },
  ],


  'med-ed': [
    { id: 'triage-&-presentation', title: 'Triage & Presentation', content: '**Mode of Arrival:** EMS\n**Triage Level:** ESI 2\n**Chief Complaint:** MVC — motorcycle vs car, right leg pain and abdominal pain\n**Vital Signs at Triage:** BP 108/72, HR 112, RR 22, SpO2 97% RA, Temp 98.6°F\n**Pain Assessment:** 9/10 right leg\n**Allergies:** NKDA\n**Last Oral Intake:** 3 hours ago\n**Tetanus:** Up to date', feedback: null },
    { id: 'history-of-present-illness', title: 'History of Present Illness', content: '34-year-old male, helmeted motorcyclist struck by car running red light at approximately 35 mph. Patient went over handlebars with right-side impact. No LOC, GCS 15 throughout. Complains of severe right lower leg pain and right-sided abdominal pain.', feedback: null },
    { id: 'past-history-&-review', title: 'Past History & Review', content: '**PMH:** None\n**Medications:** None\n**Social:** Denies tobacco/drugs/alcohol', feedback: null },
    { id: 'physical-examination', title: 'Physical Examination', content: '**General:** Alert, oriented, moderate distress\n**Vital Signs:** BP 108/72, HR 112, RR 22, SpO2 97%\n**HEENT:** No lacerations, PERRL\n**Neck:** C-spine non-tender, full ROM\n**Cardiovascular:** Tachycardic, regular\n**Respiratory:** CTA bilaterally\n**Abdomen:** RUQ tenderness, voluntary guarding, no rebound\n**Musculoskeletal:** Right tibia/fibula deformity, swelling, ecchymosis. Pedal pulses intact. Sensation intact distally.\n**Neurological:** GCS 15, no focal deficits', feedback: null },
    { id: 'diagnostic-workup', title: 'Diagnostic Workup', content: '**Labs:** CBC, BMP, lipase, type & screen — pending\n**Imaging:** Right leg XR — comminuted tibial and fibular fractures\n**CT Abdomen/Pelvis:** Grade 2 liver laceration with small free fluid\n**FAST:** Positive in Morrison\'s pouch\n**EKG:** Sinus tachycardia, no ST changes', feedback: null },
    { id: 'medical-decision-making', title: 'Medical Decision Making', content: '**Complexity:** High — multiple trauma, intra-abdominal injury + orthopedic fracture\n**Data:** XR, CT, FAST, labs reviewed\n**Risk:** High — hemodynamically stable but liver laceration requires monitoring\n**MDM Level:** High (99285)\n**Differential:** Liver laceration (confirmed), splenic injury (ruled out), hollow viscus injury (ruled out)', feedback: null },
    { id: 'ed-course-&-reassessment', title: 'ED Course & Reassessment', content: '**Treatments:** LR 1L bolus, morphine 4mg IV x2, right leg splinted\n**Reassessment Vitals:** BP 112/76, HR 102 — improved with fluids\n**Response:** Pain improved from 9/10 to 5/10. Hemodynamically stable.', feedback: null },
    { id: 'disposition-&-discharge', title: 'Disposition & Discharge', content: '**Disposition:** Admit to trauma surgery\n**Discharge Diagnosis:** 1. Comminuted right tibia/fibula fracture 2. Grade 2 liver laceration\n**Consultants:** Trauma surgery, orthopedic surgery\n**Plan:** Serial abdominal exams, repeat H/H in 6 hours, ortho to plan tib-fib fixation', feedback: null },
  ],


  'med-discharge': [
    { id: 'administrative-data', title: 'Administrative Data', content: '**Patient:** James Wilson\n**Admission:** February 10, 2026\n**Discharge:** February 15, 2026\n**LOS:** 5 days\n**Attending:** Dr. Sarah Kim\n**Primary Dx:** Community-acquired pneumonia, RLL (J18.1)\n**Secondary Dx:** COPD exacerbation (J44.1), T2DM with hyperglycemia (E11.65)\n**Payer:** Medicare', feedback: null },
    { id: 'admission-summary', title: 'Admission Summary', content: '71-year-old male with COPD and T2DM presenting with 3 days worsening cough, fever 102.4°F, dyspnea. CXR: RLL consolidation. CT confirmed RLL pneumonia with small pleural effusion.', feedback: null },
    { id: 'hospital-course', title: 'Hospital Course', content: '**Pneumonia:** Started ceftriaxone + azithromycin. Blood cultures negative. Sputum: S. pneumoniae. Narrowed to augmentin. Required 2L NC x 3 days, weaned to RA day 4. Effusion stable, no thoracentesis needed.\n**COPD:** Pulmonology consult — added tiotropium.\n**Diabetes:** Held metformin, used SSI. A1C 8.9% — added glipizide. Diabetes education ordered.\n**Complications:** None', feedback: null },
    { id: 'discharge-status', title: 'Discharge Status', content: '**Condition:** Stable\n**Vitals:** Afebrile x 48hrs, SpO2 94% RA\n**Functional Status:** Ambulating independently\n**Mental Status:** Alert, oriented', feedback: null },
    { id: 'medication-reconciliation', title: 'Medication Reconciliation', content: '**Continued:** Lisinopril 20mg daily, atorvastatin 40mg daily\n**New:** Augmentin 875mg BID x 5 days, Tiotropium 18mcg daily, Glipizide 5mg daily\n**Resumed:** Metformin 1000mg BID\n**Allergies:** Penicillin (rash — tolerates augmentin per allergy testing)', feedback: null },
    { id: 'discharge-plan', title: 'Discharge Plan', content: '**Disposition:** Home\n**Follow-Up:** PCP Dr. Johnson 1 week, Pulmonology 4 weeks\n**Pending:** Repeat CXR 6 weeks\n**Instructions:** Complete antibiotics, use new inhaler daily, check blood sugars BID\n**Return to ED:** Fever >101, worsening SOB, chest pain, hemoptysis\n**Education:** Pneumonia recovery, diabetes management, inhaler technique', feedback: null },
  ],


  'rehab-pt-daily': [
    { id: 'subjective', title: 'Subjective', content: '**Pain Level:** 4/10 (down from 5/10 last visit)\n**Patient Report:** "Better than last week. Exercises are helping. Morning stiffness improving."\n**Compliance with HEP:** Good — performing cat-camel and bridges daily, 3x12 bridges\n**Sleep:** Improved, sleeping through night most nights', feedback: null },
    { id: 'objective', title: 'Objective', content: '**Interventions Performed:**\n- Manual therapy: lumbar PA mobs grade III at L4-5 (97140, 8 min)\n- STM: R piriformis, lumbar paraspinals (97140, 7 min)\n- Ther Ex: dead bugs w/leg extension 3x10, bird dogs 3x10 ea, bridge w/march 3x8 (97110, 12 min)\n- NMR: hip hinge patterning (97112, 10 min)\n- Total skilled time: 42 min\n\n**Measurements:** Lumbar flexion 60% (up from 40% initial). R SLR 70° (up from 55° initial).', feedback: null },
    { id: 'assessment', title: 'Assessment', content: '**Progress:** Good — objective improvements in ROM and SLR. Pain trending down. Functional gains in sitting tolerance.\n**Skilled Need:** Continued skilled PT required for progressive loading and work simulation.\n**Barriers:** R piriformis tightness persists — modified stretch prescribed.', feedback: null },
    { id: 'plan', title: 'Plan', content: '**Next Visit:** Add light deadlift patterning for work simulation\n**HEP Updates:** Added dead bug exercise\n**Frequency:** Continue 2x/week\n**Goals:** On track for all STG and LTG', feedback: null },
  ],


  'rehab-ot-eval': [
    { id: 'occupational-profile', title: 'Occupational Profile', content: '**Referral:** R CVA, 3 weeks post-onset\n**Prior Level of Function:** Fully independent, part-time bookstore employee, active cook and gardener\n**ADL/IADL Status:** Mod A upper body dressing, Min A lower body, Setup assist feeding, Min A grooming\n**Client Goals:** Independent dressing, feeding, writing. Return to cooking.', feedback: null },
    { id: 'occupational-analysis', title: 'Occupational Analysis', content: '**ADL:** Requires moderate assistance for upper body dressing due to R UE weakness. Uses L hand for most tasks. Cannot manage buttons or zippers.\n**IADL:** Unable to cook (safety concern with R hand impairment). Cannot manage finances (writing impaired). Light housekeeping with difficulty.', feedback: null },
    { id: 'client-factors', title: 'Client Factors', content: '**R UE AROM:** Shoulder flex 95°, abd 80°. Elbow flex full, ext -15°. Wrist ext 20°. Finger ext 50%.\n**Grip Strength:** R 8 lbs / L 45 lbs\n**Pinch (lateral):** R 2 lbs / L 12 lbs\n**Sensation:** Light touch diminished R hand. 2PD >10mm fingertips.\n**Coordination:** Impaired rapid alternating movements. Fine motor significantly impaired.\n**Pain:** Mild R shoulder pain with overhead activity, 3/10', feedback: null },
    { id: 'assessment', title: 'Assessment', content: '**OT Diagnosis:** Moderate R UE hemiparesis with impaired fine motor coordination and decreased sensation s/p L CVA\n**Functional Limitations:** Unable to perform bilateral tasks, fine motor tasks, and overhead tasks independently\n**Rehab Potential:** Good — age, motivation, early post-stroke window\n**Precautions:** Fall risk, R UE weight-bearing precaution', feedback: null },
    { id: 'plan-of-care', title: 'Plan of Care', content: '**STG (4 weeks):** Min A upper body dressing, independent feeding with adaptive equipment, write name legibly\n**LTG (12 weeks):** Independent dressing, independent meal prep for simple meals, functional writing for daily tasks\n**Frequency:** 3x/week x 12 weeks\n**Interventions:** NMR, fine motor training, ADL retraining, adaptive equipment\n**Equipment:** Built-up handle utensils, button hook, reacher\n**Discharge Plan:** Independent home program, community re-integration', feedback: null },
  ],


  'rehab-slp-eval': [
    { id: 'case-history', title: 'Case History', content: '**Referral:** L hemisphere CVA, 2 weeks post-onset\n**Onset:** Acute. Premorbid: fully functional, articulate, retired teacher.\n**Medical History:** HTN, atrial fibrillation\n**Prior SLP:** None\n**Patient/Family Concerns:** Difficulty finding words, simplified speech, reading difficulties', feedback: null },
    { id: 'oral-mechanism-exam', title: 'Oral Mechanism Exam', content: '**Facial Symmetry:** Slight R-sided weakness\n**Lip Strength/ROM:** Functional\n**Tongue Strength/ROM:** WNL, slight reduced R lateralization\n**Velopharyngeal Function:** Adequate\n**Dentition:** Full, good condition\n**Oral Sensation:** Intact\n**DDK Rates:** WNL — no dysarthria', feedback: null },
    { id: 'speech-&-language-assessment', title: 'Speech & Language Assessment', content: '**Articulation:** Intact — no dysarthria\n**Fluency:** Reduced rate with word-finding pauses\n**Receptive Language:** Mildly impaired — follows 2-step commands, difficulty with complex instructions\n**Expressive Language:** Moderate anomic aphasia — simplified but grammatical sentences, frequent WF pauses, semantic paraphasias\n**BNT:** 60% accurate\n**Repetition:** Relatively preserved\n**Reading/Writing:** Mild-moderate impaired. Writes name/short words. Difficulty with sentences.', feedback: null },
    { id: 'swallowing-assessment', title: 'Swallowing Assessment', content: '**Diet History:** Regular diet, no complaints\n**Signs/Symptoms:** None\n**Clinical Swallow:** Unremarkable — thin liquids and solids tolerated without coughing or wet vocal quality\n**IDDSI:** Level 7 (regular)', feedback: null },
    { id: 'cognitive-communication', title: 'Cognitive-Communication', content: '**Attention:** Adequate for therapy tasks\n**Memory:** Mildly impaired for new verbal information\n**Executive Function:** Not formally assessed\n**Orientation:** Fully oriented', feedback: null },
    { id: 'plan-of-care', title: 'Plan of Care', content: '**SLP Diagnosis:** Moderate anomic aphasia secondary to L hemisphere CVA\n**Goals:** Improve naming accuracy to 80%, improve functional communication in daily activities, develop compensatory WF strategies\n**Frequency:** 2x/week x 10 weeks\n**Approach:** Semantic feature analysis, naming therapy, functional communication training\n**Family Training:** Communication partner strategies\n**Discharge Criteria:** Functional communication independence with compensatory strategies', feedback: null },
  ],


  'rehab-progress': [
    { id: 'treatment-summary', title: 'Treatment Summary', content: '**Reporting Period:** Jan 15 — Feb 12, 2026 (Visits 1-12)\n**Diagnosis:** Lumbar disc herniation L4-L5 with radiculopathy (M51.16)\n**Frequency:** 2x/week\n**Total Visits:** 12/12 authorized\n**CPT Codes:** 97140, 97110, 97112', feedback: null },
    { id: 'objective-progress', title: 'Objective Progress', content: '| Measure | Initial | Current | Change |\n|---|---|---|---|\n| Lumbar Flexion | 40% | 75% | +35% |\n| Lumbar Extension | 50% | 80% | +30% |\n| R SLR | 55° | 80° | +25° |\n| Hip Ext Strength | 3+/5 | 4+/5 | +1 grade |\n| Oswestry | 48% (severe) | 26% (moderate) | -22% ✓ MCID |\n| NPRS | 7/10 | 3/10 | -4 ✓ MCID |\n| PSFS Work | 2/10 | 6/10 | +4 ✓ MCID |', feedback: null },
    { id: 'goal-update', title: 'Goal Update', content: '**Goals Met:** Pain <5/10 with activity ✅, Sit tolerance 45 min ✅ (now 60 min)\n**In Progress:** Return to modified duty (cleared light duty this week), Full return to electrician work (target 4 weeks)\n**Goals Modified:** None\n**New Goals:** Full duty work simulation including overhead/kneeling/lifting 50 lbs', feedback: null },
    { id: 'skilled-need-justification', title: 'Skilled Need Justification', content: 'Patient requires continued skilled PT for progressive functional training and work simulation. Lumbar instability requires supervised loading progression. Non-skilled alternatives insufficient due to complexity of radiculopathy management and need for ongoing neurological assessment.', feedback: null },
    { id: 'updated-plan', title: 'Updated Plan', content: '**Frequency:** Continue 2x/week x 4 weeks (8 visits)\n**Interventions:** Progress to full work simulation\n**Anticipated Discharge:** March 12, 2026\n**Discharge Plan:** Independent HEP, gym program, ortho follow-up', feedback: null },
  ],


  'rehab-discharge': [
    { id: 'episode-of-care-summary', title: 'Episode of Care Summary', content: '**Patient:** Robert Johnson\n**Referring MD:** Dr. Smith, Orthopedics\n**Dx:** Lumbar disc herniation L4-L5 with radiculopathy (M51.16)\n**Eval Date:** January 15, 2026\n**Discharge Date:** March 10, 2026\n**Visits:** 20/24 authorized (4 missed — work conflicts)\n**Payer:** BCBS', feedback: null },
    { id: 'initial-presentation', title: 'Initial Presentation', content: '45-year-old electrician, 6-week LBP with R LE radiculopathy post lifting injury. Initial pain 7/10. Oswestry 48%. Unable to work.', feedback: null },
    { id: 'treatment-summary', title: 'Treatment Summary', content: 'Manual therapy (97140), therapeutic exercise (97110), neuromuscular re-education (97112). Progressive core stabilization, hip strengthening, work simulation, lifting mechanics training. HEP updated throughout.', feedback: null },
    { id: 'objective-outcomes-—-discharge-vs-initial', title: 'Objective Outcomes — Discharge vs Initial', content: '| Measure | Initial | Discharge |\n|---|---|---|\n| Lumbar Flexion | 40% | 95% |\n| Lumbar Extension | 50% | 90% |\n| R SLR | 55° | 85° |\n| Hip Ext Strength | 3+/5 | 5/5 |\n| NPRS | 7/10 | 1/10 |', feedback: null },
    { id: 'functional-outcome-measures', title: 'Functional Outcome Measures', content: '| Measure | Initial | Discharge | MCID |\n|---|---|---|---|\n| Oswestry | 48% | 12% | ✅ Exceeded |\n| NPRS | 7/10 | 1/10 | ✅ Exceeded |\n| PSFS Work | 2/10 | 9/10 | ✅ Exceeded |', feedback: null },
    { id: 'goal-achievement', title: 'Goal Achievement', content: 'All STG and LTG met. 100% goal achievement. Patient returned to full duty as electrician without restrictions March 4, 2026.', feedback: null },
    { id: 'discharge-assessment', title: 'Discharge Assessment', content: '**Discharge Reason:** Goals met\n**Functional Level:** Independent all activities\n**Skilled Need:** None remaining\n**Rehab Potential at Discharge:** Excellent\n**Remaining Deficits:** Mild morning stiffness, self-managed', feedback: null },
    { id: 'discharge-plan', title: 'Discharge Plan', content: 'Independent HEP 3x/week. Gym for continued strengthening. Orthopedist follow-up 6 weeks. Return to PT if symptoms recur.', feedback: null },
  ],


  'bh-progress': [
    { id: 'subjective---data', title: 'Subjective / Data', content: '**Presentation:** Improved affect, more animated, good eye contact\n**Reported Symptoms/Mood:** "Okay, not great but better." Panic attacks reduced to 3 in past 2 weeks (down from daily at intake). Two managed independently using grounding techniques.\n**Events:** Successfully managed panic attack in grocery store using 5-4-3-2-1 technique. Cooked dinner Saturday. Walking 3x/week.\n**HW Review:** Thought records completed. Behavioral activation goals mostly met.\n**Risk Screen:** Denies SI/HI. No self-harm urges. Low risk.', feedback: null },
    { id: 'objective---assessment', title: 'Objective / Assessment', content: '**MSE:** Alert, oriented, cooperative. Speech normal rate/rhythm. Mood "okay." Affect congruent, mildly anxious but not distressed. Thought process logical. No psychotic features.\n**Alliance:** Strong — patient engaged and trusting', feedback: null },
    { id: 'assessment---clinical-impression', title: 'Assessment / Clinical Impression', content: '**Session Focus:** CBT cognitive restructuring — catastrophic thoughts about finances and self-worth\n**Interventions:** Thought record practice, behavioral activation review, evidence examination for/against automatic thoughts\n**Response:** Good engagement, able to generate balanced alternative thoughts\n**Progress:** Significant improvement in panic management. Depression improving but residual low days remain. On track toward goals.', feedback: null },
    { id: 'plan', title: 'Plan', content: '**Next Session:** Introduce exposure hierarchy for situational anxiety triggers\n**Homework:** Continue thought records, increase walking to 4x/week, apply for one job\n**Medications:** Continue current (sertraline 100mg) — effective\n**Follow-Up:** 2 weeks', feedback: null },
  ],


  'bh-psych-eval': [
    { id: 'chief-complaint-&-hpi', title: 'Chief Complaint & HPI', content: '**CC:** "My therapist thinks I might need medication."\n**HPI:** 38-year-old male with 2-year history of worsening depression and anxiety following job loss and divorce. Reports persistent low mood, worthlessness, sleep disturbance (hypersomnia weekends, early morning awakening weekdays), appetite fluctuations. Significant anxiety with constant worry, muscle tension, bruxism. Notable concentration/attention difficulties that predate depression — childhood history of academic underperformance despite effort.', feedback: null },
    { id: 'psychiatric-history', title: 'Psychiatric History', content: '**Past Dx:** None formally\n**Medication Trials:** Lexapro (escitalopram) ~1 year ago via PCP — partial anxiety relief but "felt like a zombie." Discontinued after 3 months.\n**Hospitalizations:** None\n**Psychotherapy:** Current — 6 months CBT, helpful but insufficient alone', feedback: null },
    { id: 'substance-use', title: 'Substance Use', content: '**Alcohol:** 3-4 beers/weekend, more when stressed\n**Tobacco:** Quit 5 years ago\n**Other:** Denies', feedback: null },
    { id: 'medical-developmental', title: 'Medical/Developmental', content: '**Medical:** None significant\n**Developmental:** School — "doesnt work up to potential" on report cards, procrastination, needed extra effort. Managed but struggled.', feedback: null },
    { id: 'psychosocial', title: 'Psychosocial', content: '**Family Psych Hx:** Mother — anxiety. Father — "probably depressed but never treated."\n**Social Supports:** Limited post-divorce. Few close friends. Has children (shared custody).\n**Employment:** Part-time, underemployed\n**Legal:** None', feedback: null },
    { id: 'mental-status-examination', title: 'Mental Status Examination', content: '**Appearance:** Well-groomed, casual dress, stated age\n**Behavior:** Cooperative, good eye contact\n**Speech:** Normal rate, slightly tangential at times\n**Mood/Affect:** "Tired and frustrated" / constricted, mildly dysphoric\n**Thought Process:** Circumstantial at times\n**Thought Content:** No delusions. Passive SI ("life would be easier if I didn\'t exist") but no plan/intent.\n**Perceptions:** No hallucinations\n**Cognition:** MoCA 26/30 — deficits in attention and delayed recall\n**Insight/Judgment:** Good/Fair', feedback: null },
    { id: 'risk-assessment', title: 'Risk Assessment', content: '**SI:** Passive ideation, no plan/intent. Protective factors: children.\n**HI:** Denies\n**Risk Level:** Low-moderate\n**Safety Plan:** Not indicated at current risk level; will reassess', feedback: null },
    { id: 'formulation-&-plan', title: 'Formulation & Plan', content: '**Diagnoses:**\n1. Major Depressive Disorder, recurrent, moderate (F33.1)\n2. Generalized Anxiety Disorder (F41.1)\n3. R/O ADHD, predominantly inattentive type (pending formal assessment)\n\n**Medication:** Start sertraline 50mg daily (less sedating than escitalopram)\n**Labs:** TSH, CBC, B12\n**Plan:** ADHD screening next visit. Continue therapy.\n**Follow-Up:** 3 weeks', feedback: null },
  ],


  'bh-group': [
    { id: 'group-information', title: 'Group Information', content: '**Group:** Anxiety and Stress Management, Session 8/12\n**Facilitators:** Dr. Lee, Sarah LCSW-intern\n**Members Present:** 6/8 — Maria G., James T., Linda K., Priya M., Robert S., Chris W.\n**Absent:** David L. (called, sick), Ana P. (no-show #2 — follow up needed)\n**Topic:** Cognitive Distortions — identification and challenging', feedback: null },
    { id: 'group-process', title: 'Group Process', content: '**Dynamics:** High engagement. Cohesion building. Members supporting each other. Linda emerging as informal peer leader.\n**Therapeutic Factors:** Universality (normalizing shared experiences), interpersonal learning, instillation of hope (Maria\'s success story)\n**Activity:** Psychoeducation on top 10 cognitive distortions + group exercise identifying personal patterns', feedback: null },
    { id: 'individual-member-notes', title: 'Individual Member Notes', content: '**Maria G.** — Active. Identified catastrophizing. Shared grounding success. ↑ progress.\n**James T.** — Initially withdrawn, opened up after peer validation. Mind-reading pattern. Slow progress.\n**Linda K.** — Peer support role. High engagement. May benefit from advanced group.\n**Priya M.** — Should statements. Tearful re: family expectations. Group supported well.\n**Robert S.** — Engaged, uses humor. Tends to intellectualize — redirected.\n**Chris W.** — Strong session. Overgeneralization re: job rejection. Exercise effective.', feedback: null },
    { id: 'plan', title: 'Plan', content: '**Next Session:** Behavioral experiments to test distortions\n**Follow-Up:** Contact Ana P. re: attendance\n**Supervision Notes:** Sarah managing co-facilitation well, improving redirecting skills', feedback: null },
  ],


  'bh-crisis': [
    { id: 'crisis-presentation', title: 'Crisis Presentation', content: '**Referral:** University RA found patient with suicide note in dorm room\n**Nature of Crisis:** Active suicidal ideation with specific plan (overdose on Adderall)\n**Precipitating Event:** Failed organic chemistry exam, perceived scholarship loss, fear of parental rejection\n**Timeline:** Ideation past month, specific plan tonight\n**Current Safety:** In crisis center, cooperative', feedback: null },
    { id: 'risk-assessment', title: 'Risk Assessment', content: '**C-SSRS:** Active ideation with specific plan (Adderall overdose) and intent. Had bottle in hand but did not take.\n**Plan/Intent/Means:** Yes/Yes/Yes (Adderall available)\n**Prior Attempts:** None\n**Self-Harm History:** Cutting in high school, stopped 2 years ago\n**Substances Tonight:** Cannabis and alcohol (several beers, not intoxicated)\n**Risk Factors:** Academic stress, perceived parental expectations, prior self-harm, substance use, impulsivity, access to means\n**Overall Risk:** HIGH acute risk', feedback: null },
    { id: 'protective-factors', title: 'Protective Factors', content: '**Reasons for Living:** Did not act when had means. Protective of roommate relationship.\n**Social Support:** Roommate Jake, friend Melissa\n**Treatment Engagement:** Cooperative, communicative, engaged in safety planning\n**Ambivalence:** "I couldn\'t go through with it"', feedback: null },
    { id: 'intervention', title: 'Intervention', content: '**De-escalation:** Calm, validating approach. Patient engaged throughout.\n**Means Restriction:** Patient agreed to RA holding/dispensing Adderall daily.\n**Therapeutic Interventions:** Safety planning, validation, crisis stabilization\n**Collateral:** RA contacted and briefed on safety plan', feedback: null },
    { id: 'safety-plan', title: 'Safety Plan', content: '**Warning Signs:** "Thinking I\'m a failure," isolation, missing classes\n**Internal Coping:** Breathing exercises, running, music\n**Social Contacts:** Roommate Jake, friend Melissa\n**Professional Contacts:** University counseling center, this crisis center\n**Emergency Contacts:** 988 Suicide & Crisis Lifeline, campus police\n**Environmental Safety:** Adderall secured with RA', feedback: null },
    { id: 'disposition', title: 'Disposition', content: '**Risk Level:** High (acute), reduced to moderate with safety plan and means restriction\n**Recommendation:** Voluntary psychiatric observation overnight\n**Follow-Up:** Campus counselor within 24 hours\n**Consent:** Patient consented to voluntary observation and information sharing with university counseling', feedback: null },
  ],


  'bh-discharge': [
    { id: 'treatment-episode-summary', title: 'Treatment Episode Summary', content: '**Patient:** Maria Gonzalez\n**Intake:** October 1, 2025\n**Discharge:** February 14, 2026\n**Level of Care:** Outpatient\n**Dx:** Panic disorder (F41.0), MDD single episode moderate (F32.1)\n**Sessions:** 18 individual + 12 group (2 missed)\n**Med Management:** 4 visits\n**Therapist:** Dr. Lee | **Prescriber:** Dr. Yamamoto', feedback: null },
    { id: 'presenting-problems-at-intake', title: 'Presenting Problems at Intake', content: '**Initial PHQ-9:** 16 (moderately severe)\n**Initial GAD-7:** 18 (severe)\n**Presenting:** Daily panic attacks, moderate depression, unemployment anxiety\n**Functional Level:** Significant impairment — occupational, social, self-care', feedback: null },
    { id: 'treatment-provided', title: 'Treatment Provided', content: '**Approach:** Individual CBT (cognitive restructuring, behavioral activation, exposure therapy) + group CBT (anxiety management)\n**Medication:** Sertraline titrated to 100mg daily\n**Skills Taught:** Grounding (5-4-3-2-1), thought records, behavioral activation, exposure hierarchy\n**Referrals:** Career counseling', feedback: null },
    { id: 'treatment-outcomes', title: 'Treatment Outcomes', content: '**Discharge PHQ-9:** 6 (mild) — ↓10 points\n**Discharge GAD-7:** 7 (mild) — ↓11 points\n**Panic Attacks:** Daily → ~1/month, manageable with skills\n**Functional Gains:** Secured part-time employment, resumed cooking/hiking/social activities, improved marital relationship\n**Symptom Trajectory:** Improved\n**Risk Level at Discharge:** Low. No SI in final 10 weeks.', feedback: null },
    { id: 'discharge-assessment', title: 'Discharge Assessment', content: '**Reason:** Treatment goals substantially met — mutual decision\n**Remaining Concerns:** Mild residual anxiety in novel situations. Ongoing medication need.\n**Relapse Risk:** Low-moderate. Identified triggers: financial stress, unemployment.', feedback: null },
    { id: 'continuing-care-plan', title: 'Continuing Care Plan', content: '**Medication:** Continue sertraline 100mg, managed by PCP Dr. Peters\n**Psychiatry:** Follow-up 3 months for med review\n**Support:** NAMI weekly support group\n**Crisis Plan:** Updated — call 988 or present to ED\n**Relapse Prevention:** Identified warning signs and coping strategies\n**Patient Verbalized Understanding:** Yes', feedback: null },
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

  {
    id: 'mock-med-soap-new',
    patientName: 'Sarah Mitchell',
    providerType: 'MD',
    frameworkId: 'med-soap-new',
    frameworkName: 'med-soap-new',
    domain: 'medical',
    date: '2026-02-15',
    duration: 1200,
    status: 'complete' as const,
    transcript: mockTranscripts['med-soap-new'] || '',
    note: mockNotes['med-soap-new'] || [],
    summary: 'New patient evaluation — migraine with aura',
  },

  {
    id: 'mock-med-ed',
    patientName: 'Mike Rodriguez',
    providerType: 'MD',
    frameworkId: 'med-ed',
    frameworkName: 'med-ed',
    domain: 'medical',
    date: '2026-02-15',
    duration: 1200,
    status: 'complete' as const,
    transcript: mockTranscripts['med-ed'] || '',
    note: mockNotes['med-ed'] || [],
    summary: 'MVC — tibia fracture and liver laceration',
  },

  {
    id: 'mock-med-hp',
    patientName: 'Thomas Williams',
    providerType: 'MD',
    frameworkId: 'med-hp',
    frameworkName: 'med-hp',
    domain: 'medical',
    date: '2026-02-15',
    duration: 1200,
    status: 'complete' as const,
    transcript: mockTranscripts['med-hp'] || '',
    note: mockNotes['med-hp'] || [],
    summary: 'Acute anterior STEMI — emergent admission',
  },

  {
    id: 'mock-rehab-ot-eval',
    patientName: 'Mrs. Park',
    providerType: 'OT',
    frameworkId: 'rehab-ot-eval',
    frameworkName: 'rehab-ot-eval',
    domain: 'rehabilitation',
    date: '2026-02-15',
    duration: 1200,
    status: 'complete' as const,
    transcript: mockTranscripts['rehab-ot-eval'] || '',
    note: mockNotes['rehab-ot-eval'] || [],
    summary: 'OT evaluation — R UE hemiparesis post CVA',
  },

  {
    id: 'mock-bh-psych-eval',
    patientName: 'David K.',
    providerType: 'PsyD',
    frameworkId: 'bh-psych-eval',
    frameworkName: 'bh-psych-eval',
    domain: 'behavioral health',
    date: '2026-02-15',
    duration: 1200,
    status: 'complete' as const,
    transcript: mockTranscripts['bh-psych-eval'] || '',
    note: mockNotes['bh-psych-eval'] || [],
    summary: 'Psychiatric evaluation — depression, anxiety, r/o ADHD',
  },
];
