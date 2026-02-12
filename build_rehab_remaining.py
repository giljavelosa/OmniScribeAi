#!/usr/bin/env python3
"""
Build the remaining sections of omniscribe-rehab-frameworks-v1.html
Starting from where the file was truncated (mid Geriatric/SNF IE section)
"""

import os

OUTPUT_FILE = "/home/gil/OmniScribe/omniscribe-rehab-frameworks-v1.html"

# Read existing file to find exact cutoff point
with open(OUTPUT_FILE, 'r') as f:
    existing = f.read()

# Find where to truncate - the file cuts off mid-row in the Advance Directives row
# We need to find the last complete element and truncate there
# The last complete row ends with the PLOF row
cutoff_marker = '<td>Prior Level of Function (PLOF)</td>'
idx = existing.rfind(cutoff_marker)
if idx == -1:
    print("ERROR: Could not find cutoff marker")
    exit(1)

# Find the end of the PLOF row's </tr>
plof_row_end = existing.find('</tr>', idx)
if plof_row_end == -1:
    print("ERROR: Could not find end of PLOF row")
    exit(1)
plof_row_end = existing.find('\n', plof_row_end) + 1

# Keep everything up to and including the PLOF row
base = existing[:plof_row_end]

# Now build all remaining content
sections = []

def add(text):
    sections.append(text)

def table_start():
    return """<table>
<thead>
<tr>
<th>Item</th>
<th>Format Template</th>
<th>Source</th>
</tr>
</thead>
<tbody>"""

def table_end():
    return """</tbody>
</table>"""

def row(item, template, source):
    return f"""<tr>
<td>{item}</td>
<td><code>"{template}"</code></td>
<td>{source}</td>
</tr>"""

def hr():
    return "<hr />"

# ============================================================
# Complete Geriatric/SNF IE - History section (remaining rows)
# ============================================================

add(row("Advance Directives / Code Status",
    "Code status: __ [full code / DNR / DNI / DNR-DNI / comfort measures only] | POLST: Y/N | Healthcare proxy: __ | POA: __ | Living will: Y/N | Advance directive on file: Y/N | Date reviewed: __",
    "CMS SNF requirements; MDS 3.0 Section A; Joint Commission RI.01.05.01"))

add(row("Psychosocial / Cognitive Baseline",
    "Cognitive status: __ [intact / mild impairment / moderate impairment / severe impairment] | Dementia diagnosis: __ [type: Alzheimer's / vascular / Lewy body / frontotemporal / mixed / unspecified] | BIMS (Brief Interview for Mental Status): __/15 | Depression screen (PHQ-9 or GDS): __ | Behavioral concerns: __ | Orientation: __ [person / place / time / situation]",
    "MDS 3.0 Section C (Cognitive Patterns); GDS; PHQ-9; BIMS"))

add(row("Social / Discharge Planning",
    "Anticipated discharge destination: __ [home / home with services / assisted living / long-term care / other: __] | Support system: __ | Caregiver: __ | Home setup: __ [single story / stairs: __ / bathroom accessibility: __] | DME in home: __ | Community services: __",
    "CMS SNF discharge planning; MDS 3.0 Section Q; PDPM"))

add(row("Patient / Family Goals",
    "Patient's stated goals: __ | Family goals: __ | Discharge goals: __ | Functional priorities: __ | Patient motivation: __ | Barriers to participation: __",
    "CMS person-centered care; MDS 3.0; CARF standards"))

add(table_end())

# Systems Review -- Geriatric/SNF IE
add("""
<h4>Systems Review -- Geriatric/SNF IE</h4>""")
add(table_start())

add(row("Cardiovascular/Pulmonary Screen",
    "HR: __ bpm | BP: __/__ mmHg | RR: __ breaths/min | SpO2: __% | Orthostatic vitals: supine __/__ → sit __/__ → stand __/__ | Orthostatic hypotension: Y/N | Edema: __ | Peripheral pulses: __ | Oxygen use: __ L via __",
    "APTA Guide; AGS orthostatic hypotension guidelines; CMS vital signs"))

add(row("Integumentary Screen",
    "Skin integrity: __ [intact / impaired] | Pressure injury: __ [location: __ | stage: __ (NPUAP I-IV / unstageable / deep tissue)] | Braden Scale: __/23 [sensory: __ / moisture: __ / activity: __ / mobility: __ / nutrition: __ / friction: __] | Skin tears: __ | Bruising: __ | Surgical wounds: __",
    "MDS 3.0 Section M; Braden Scale; NPUAP staging; CMS pressure injury prevention"))

add(row("Musculoskeletal Screen",
    "Posture: __ [kyphosis / scoliosis / forward head / other: __] | Gross ROM: __ | Gross strength: __ | Contractures: __ [location: __ | severity: __] | Deformities: __ | Osteoporosis risk: __ | Fracture history: __ | Height: __ | Weight: __ | BMI: __",
    "APTA Guide; AGS osteoporosis guidelines; MDS 3.0"))

add(row("Neuromuscular Screen",
    "Muscle tone: __ | Coordination: __ | Tremor: Y/N [type: __ / severity: __] | Gait pattern: __ | Balance: __ [steady / unsteady] | Fall history: __ [falls in last 90 days: __ | last 30 days: __ | injury from fall: Y/N: __] | Transfers: __ | Assistive device: __",
    "MDS 3.0 Section J (falls); CDC STEADI; APTA balance screening"))

add(row("Communication / Cognition Screen",
    "Communication: __ [appropriate / impaired: __] | Hearing: __ [adequate / impaired / hearing aid: Y/N] | Vision: __ [adequate / impaired / corrective lenses: Y/N] | Cognition: __ [alert / confused / lethargic] | BIMS: __/15 | Ability to follow commands: __ [1-step / 2-step / multi-step / unable] | Preferred language: __ | Interpreter: Y/N",
    "MDS 3.0 Section B/C; ASHA communication screening; Joint Commission"))

add(row("Nutritional / Swallowing Screen",
    "Nutritional status: __ | Weight change: __ [gained / lost __ lbs in __ days] | Albumin/pre-albumin: __ | Diet order: __ | IDDSI level: __ | Swallowing concerns: __ | Aspiration risk: __ | Dentition: __ [natural / dentures / edentulous] | Oral health: __",
    "MDS 3.0 Section K/L; IDDSI Framework; ASHA dysphagia screening; MNA"))

add(table_end())

# Tests & Measures -- Geriatric/SNF IE
add("""
<h4>Tests &amp; Measures -- Geriatric/SNF IE</h4>""")
add(table_start())

add(row("MDS 3.0 Section GG Functional Status",
    "Self-care: eating: __ | oral hygiene: __ | toileting hygiene: __ | shower/bathe: __ | UB dressing: __ | LB dressing: __ | putting on/taking off footwear: __ | Mobility: roll L/R: __ | sit to lying: __ | lying to sitting: __ | sit to stand: __ | chair/bed-to-chair transfer: __ | toilet transfer: __ | car transfer: __ | walk 10 ft: __ | walk 50 ft: __ | walk 150 ft: __ | walk 10 ft on uneven: __ | 1 step (curb): __ | 4 steps: __ | 12 steps: __ | picking up object: __ | wheelchair: __ | Each coded: 06=independent / 05=setup / 04=supervision / 03=partial-mod / 02=substantial-max / 01=dependent / 07=refused / 09=not applicable / 88=not attempted: condition / 10=not attempted: environ / 12=not attempted: other",
    "CMS MDS 3.0 Section GG (GG0130 Self-Care, GG0170 Mobility); PDPM; CMS GG coding manual"))

add(row("Balance Assessment",
    "Berg Balance Scale: __/56 | Fall risk: __ [<45 = increased risk] | Timed Up and Go: __ sec | Fall risk: __ [>13.5s = increased risk] | Tinetti POMA: __/28 [balance: __/16 | gait: __/12] | 5x Sit-to-Stand: __ sec | Single-leg stance: R __ sec / L __ sec | Functional Reach: __ in [<6in = fall risk]",
    "Berg Balance Scale; TUG; Tinetti POMA; CDC STEADI; 5xSTS"))

add(row("Gait Assessment",
    "Gait pattern: __ | Deviations: __ | Assistive device: __ | Weight-bearing: __ | Gait speed: __ m/s [<0.8 m/s = community ambulation risk | <0.6 m/s = household ambulator] | 6MWT: __ meters | Step length: __ | Cadence: __ steps/min | Gait endurance: __",
    "APTA Guide; Perry Gait Analysis; gait speed norms for elderly; 6MWT"))

add(row("Strength Assessment",
    "MMT (key muscle groups): UE: shoulder flex: __/5 | elbow flex: __/5 | grip: __/5 | LE: hip flex: __/5 | knee ext: __/5 | ankle DF: __/5 | Core: __ | Functional strength: __ [sit-to-stand independence / stair negotiation / floor transfer ability]",
    "APTA Guide; MMT; MDS 3.0 functional assessment"))

add(row("Range of Motion",
    "Joint: __ | AROM: __° | PROM: __° | Contractures: __ [joint: __ | severity: __ | functional impact: __] | Limiting factors: __ | Contralateral: __°",
    "APTA Guide; goniometry standards; contracture management"))

add(row("Pain Assessment",
    "Pain present: Y/N | NRS: __/10 | Location(s): __ | Type: __ | For non-verbal patients: __ [PAINAD: __/10 | Abbey Pain Scale: __] | Pain with movement: __ | Pain at rest: __ | Pain management current: __ | Impact on function: __",
    "NRS; PAINAD (Warden et al., 2003); Abbey Pain Scale; AGS pain guidelines; MDS 3.0 Section J"))

add(row("Cognitive Assessment",
    "BIMS: __/15 [3-7=severe / 8-12=moderate / 13-15=cognitively intact] | SLUMS: __/30 | MoCA: __/30 | MMSE: __/30 | Clock Drawing Test: __/__ | Attention: __ | Short-term memory: __ | Long-term memory: __ | Executive function: __ | Safety awareness: __ | Decision-making: __ [independent / modified / moderately impaired / severely impaired]",
    "MDS 3.0 Section C; BIMS; MoCA; SLUMS; AGS cognitive assessment"))

add(row("Depression / Mood Screen",
    "PHQ-9 (verbal patients): __/27 | PHQ-2: __/6 | GDS (Geriatric Depression Scale): __ [short form: __/15] | Cornell Scale for Depression in Dementia: __/38 | Mood observations: __ | Behavioral symptoms: __ | Sleep disturbance: Y/N",
    "MDS 3.0 Section D; PHQ-9; GDS; Cornell Scale; AGS depression screening"))

add(row("Fall Risk Assessment",
    "Morse Fall Scale: __ [<25 low / 25-45 moderate / >45 high] | Falls in past 90 days: __ | Injury from falls: __ | Fall circumstances: __ | Intrinsic risk factors: __ [gait instability / cognitive impairment / medication effects / orthostatic hypotension / vision / neuropathy / weakness] | Extrinsic risk factors: __ [footwear / environment / lighting / clutter / wet floors] | Interventions: __",
    "CDC STEADI; Morse Fall Scale; MDS 3.0 Section J; AGS/BGS fall prevention guidelines"))

add(row("Swallowing Assessment (SLP)",
    "Oral motor exam: __ | Diet texture: __ [IDDSI level: __] | Liquid consistency: __ [IDDSI level: __] | Swallowing screen: __ [passed / failed] | Clinical bedside swallow evaluation: __ | Signs of aspiration: __ | Instrumental assessment: __ [MBSS / FEES: results: __] | Aspiration precautions: __",
    "ASHA Dysphagia Guidelines; IDDSI Framework; MDS 3.0 Section K; PAS"))

add(row("Cognitive-Communication Assessment (SLP)",
    "Functional communication: __ [ASHA NOMS: level __/7] | Auditory comprehension: __ | Verbal expression: __ | Reading: __ | Writing: __ | Cognitive-linguistic skills: __ [attention / memory / problem-solving / reasoning / executive function] | AAC needs: __ | Dementia staging (if applicable): __ [FAST: __ / GDS-Reisberg: __]",
    "ASHA NOMS; FAST (Reisberg); GDS-Reisberg; ASHA cognitive-communication guidelines"))

add(row("Functional Outcome Measure",
    "Tool: __ [AM-PAC: __ | Barthel Index: __/100 | Katz ADL: __/6 | Lawton IADL: __/8 | FIM (if IRF): __/126 | OPTIMAL: __ | other: __] | Baseline score: __ | MCID: __ | Normative comparison: __",
    "Specific validated tool; CMS quality measures; MIPS"))

add(table_end())

# Functional Baselines -- Geriatric/SNF IE
add("""
<h4>Functional Baselines -- Geriatric/SNF IE</h4>""")
add(table_start())

add(row("Bed Mobility",
    "Rolling R: __ | Rolling L: __ | Supine-to-sit: __ | Scooting in bed: __ | Bridging: __ | Each rated: __ [independent / supervision / CGA / min A / mod A / max A / dependent / not attempted] | GG code: __",
    "MDS 3.0 Section GG; FIM; CMS functional reporting"))

add(row("Transfers",
    "Sit-to-stand: __ | Bed-to-chair: __ | Chair-to-toilet: __ | Tub/shower transfer: __ | Car transfer: __ | Floor-to-stand: __ | Mechanical lift: Y/N | Each rated: __ | GG code: __ | Equipment: __",
    "MDS 3.0 Section GG; CMS functional documentation"))

add(row("Ambulation / Wheelchair Mobility",
    "Ambulation: __ [distance: __ ft | device: __ | assist level: __ | gait speed: __ m/s] | Wheelchair mobility: __ [self-propel: __ ft | assist needed: __] | Endurance: __ | Limiting factor: __ | Community ambulation: __ | GG code: __",
    "MDS 3.0 Section GG; APTA gait assessment; CMS functional reporting"))

add(row("Stair Negotiation",
    "Steps: __ [1 step/curb: __ | 4 steps: __ | 12 steps (full flight): __] | Railing use: Y/N | Method: __ [step-over-step / step-to-step] | Assist level: __ | GG code: __",
    "MDS 3.0 Section GG; APTA stair assessment"))

add(row("ADL Performance",
    "Eating: __ | Oral hygiene: __ | Toileting hygiene: __ | Shower/bathe self: __ | UB dressing: __ | LB dressing: __ | Footwear: __ | Each rated: __ | GG code: __ | Adaptive equipment in use: __",
    "MDS 3.0 Section GG; Katz ADL; AOTA ADL assessment"))

add(row("IADL Performance",
    "Meal preparation: __ | Medication management: __ | Telephone use: __ | Financial management: __ | Laundry: __ | Housekeeping: __ | Transportation: __ | Shopping: __ | Each rated: __ [independent / needs help / dependent / not applicable]",
    "Lawton IADL Scale; AOTA IADL assessment; MDS 3.0 Section GG"))

add(table_end())

# Clinical Impression & Goals -- Geriatric/SNF IE
add("""
<h4>Clinical Impression &amp; Goals -- Geriatric/SNF IE</h4>""")
add(table_start())

add(row("Clinical Impression / Assessment",
    "Patient is a __-year-old __ admitted to SNF from __ for __ (diagnosis) presenting with __ [functional decline / deconditioning / post-surgical recovery / cognitive decline / falls / other]. Key findings: __ | Comorbidity impact: __ | PLOF: __ | Current function: __ | Rehabilitation potential: __ [excellent / good / fair / guarded / poor] | PDPM classification: __",
    "CMS SNF documentation; MDS 3.0; PDPM; clinical reasoning"))

add(row("Evaluation Complexity Level",
    "Complexity: __ [low / moderate / high] | Basis: __ [number of comorbidities / standardized tests / clinical decision-making] | CPT code: __",
    "AMA CPT evaluation codes; CMS complexity"))

add(row("Problem List",
    "1. __ [impairment] | 2. __ [activity limitation] | 3. __ [participation restriction] | 4. __ | 5. __ | 6. __ | ICF categories: __ | PDPM clinical category: __",
    "WHO ICF; MDS 3.0; PDPM clinical categories"))

add(row("Short-Term Goals (STG)",
    "STG 1: Patient will __ [functional activity] with __ [assist level / device / cues] by __ [date] | GG baseline: __ | GG target: __ | STG 2: __ | STG 3: __ | STG 4: __ | STG 5: __",
    "CMS goal requirements; MDS 3.0 Section GG goals; SMART framework"))

add(row("Long-Term Goals (LTG) / Discharge Goals",
    "LTG 1: Patient will __ [discharge-level function] with __ by __ [date] to safely discharge to __ [destination] | GG baseline: __ | GG discharge target: __ | LTG 2: __ | LTG 3: __ | LTG 4: __ | Discharge destination: __ | Projected LOS: __ days",
    "CMS goals; MDS 3.0 Section GG discharge goals; SNF discharge planning"))

add(table_end())

# Plan of Care -- Geriatric/SNF IE
add("""
<h4>Plan of Care -- Geriatric/SNF IE</h4>""")
add(table_start())

add(row("Treatment Plan / Interventions",
    "Planned interventions: __ [therapeutic exercise (97110) / gait training (97116) / neuromuscular re-education (97112) / therapeutic activities (97530) / manual therapy (97140) / ADL training (97535) / cognitive skills (97129/97130) / SLP treatment (92507) / swallowing therapy (92526) / group therapy (97150) / other: __]",
    "AMA CPT codes; Medicare Benefit Policy Manual Ch.15; evidence-based geriatric rehab"))

add(row("Frequency &amp; Duration",
    "Frequency: __ [PT: __ x/wk | OT: __ x/wk | SLP: __ x/wk] | Duration: __ weeks | Projected LOS: __ days | Medicare Part A days: __ | Certification period: __ to __ | Recertification due: __",
    "CMS 42 CFR 410.61; SNF Part A coverage; PDPM"))

add(row("Discharge Planning",
    "Anticipated discharge destination: __ | Home modifications needed: __ | DME needed: __ [hospital bed / wheelchair / walker / commode / shower chair / grab bars / other: __] | Caregiver training required: __ | Home health referral: Y/N | Outpatient therapy: Y/N | Community resources: __",
    "CMS SNF discharge planning; MDS 3.0 Section Q; Joint Commission"))

add(row("Patient / Caregiver Education",
    "Education topics: __ [fall prevention / HEP / adaptive equipment use / energy conservation / safe transfers / skin protection / medication awareness / disease management / nutrition] | Caregiver training: __ | Written instructions: Y/N | Understanding verified: Y/N",
    "CMS education requirements; Joint Commission; AGS patient education"))

add(row("Coordination of Care",
    "IDT members: __ [PT / OT / SLP / physician / nursing / dietary / social work / activities / case manager] | IDT meeting: __ | MDS coordinator: __ | Physician certification: __ | Family conference: __ | POC sent to physician: Y/N | Date: __",
    "CMS SNF IDT requirements; 42 CFR 410.61; MDS 3.0 coordination"))

add(table_end())

# Medical Necessity -- Geriatric/SNF IE
add("""
<h4>Medical Necessity -- Geriatric/SNF IE</h4>""")
add(table_start())

add(row("Medical Necessity Statement",
    "Skilled rehabilitation services are medically necessary because: __ | Patient demonstrates __ [functional decline / safety deficits / cognitive-communication impairment / swallowing dysfunction] requiring the skill of a licensed __ [PT / OT / SLP] | Services cannot be safely performed as a maintenance program because: __ | Without skilled intervention, patient is at risk for: __ [further decline / falls / aspiration / skin breakdown / institutionalization]",
    "Medicare Benefit Policy Manual Ch.15 §220.2; CMS skilled services; Jimmo v. Sebelius"))

add(row("SNF Coverage Justification",
    "Medicare Part A coverage criteria met: Y/N | Patient requires skilled nursing or skilled rehabilitation on a daily basis: Y/N | Services are reasonable and necessary: Y/N | Prior hospitalization: __ [3-day qualifying stay / managed care waiver] | Admit date: __ | Benefit period day: __ | Coverage level: __ [full / coinsurance / exhausted]",
    "CMS SNF coverage 42 CFR 409.30-409.36; 3-day qualifying stay; SNF benefit period"))

add(row("Skilled Services Justification",
    "Services require the skills of a __ because: __ | Complexity of medical/functional presentation: __ | Maintenance therapy justification (if applicable): __ [skilled assessment/teaching needed to maintain function and prevent decline per Jimmo v. Sebelius] | Safety: __",
    "Medicare Benefit Policy Manual Ch.15; Jimmo v. Sebelius; CMS skilled services"))

add(row("Physician Certification",
    "Plan of care certified by: __ | Date: __ | Certification period: __ to __ | Recertification due: __ (every 90 days) | Physician signature: __ | SNF medical director: __",
    "CMS 42 CFR 410.61; SNF physician certification"))

add(table_end())
add(hr())

# ============================================================
# PART 2: DAILY / PROGRESS NOTE FRAMEWORK
# ============================================================

add("""
<!-- ============================================================== -->
<!-- PART 2: DAILY / PROGRESS NOTE                                  -->
<!-- ============================================================== -->

<h2>PART 2: DAILY / PROGRESS NOTE FRAMEWORK</h2>
<p>The Daily/Progress Note documents each skilled treatment session throughout the rehabilitation episode of care. It captures the subjective patient report, objective skilled interventions performed with parameters, the therapist's assessment of patient response and progress toward goals, and the plan for continued treatment. Per CMS Medicare Benefit Policy Manual Chapter 15, each treatment session must demonstrate skilled services — interventions that require the education, training, and judgment of a licensed therapist (or assistant under supervision) and cannot be safely performed by the patient, caregiver, or unskilled personnel.</p>
<p>Progress notes must justify continued medical necessity by documenting measurable progress toward established goals, skilled clinical decision-making, or maintenance therapy requiring skilled assessment per Jimmo v. Sebelius. Billing is based on the 8-Minute Rule for timed CPT codes (97110-97542) and per-encounter for untimed codes (97530, 97535, 97140, 97150). All format templates use <code>__</code> (double underscore) to indicate AI-populated fields.</p>""")
add(hr())

# Progress Note Subtype 1: Skilled Treatment Note (Outpatient)
add("""<h3>1. Skilled Treatment Note — Outpatient</h3>
<p><strong>Purpose:</strong> Documents each skilled treatment session in outpatient rehabilitation settings (clinic-based PT, OT, SLP). Captures the patient's subjective report, skilled interventions with treatment parameters, patient response, progress toward goals, and the plan for the next session. Must justify each billed CPT code with sufficient detail and demonstrate skilled services.</p>
<p><strong>Applicable Codes:</strong> 97110-97542 (timed therapeutic procedures), 97530/97535 (therapeutic activities/self-care training), 97140 (manual therapy), 92507/92508 (SLP treatment), 92526 (swallowing treatment), plus modifiers (GP/GO/GN, 59, KX)</p>
<p><strong>Typical Disciplines:</strong> PT, PTA (under PT supervision), OT, OTA (under OT supervision), SLP, SLPA (under SLP supervision)</p>""")
add(hr())

# Subjective
add("""<h4>Subjective — Outpatient Treatment Note</h4>""")
add(table_start())
add(row("Patient Self-Report",
    "Patient reports: __ | Symptom changes since last visit: __ [better / same / worse] | Specific improvements: __ | Specific complaints: __ | Activity level since last visit: __",
    "CMS documentation; SOAP format; patient-reported outcomes"))
add(row("Pain Report",
    "Current pain: __/10 (NRS) | Pain at worst since last visit: __/10 | Pain at best: __/10 | Location: __ | Change from last visit: __ [decreased / same / increased by __] | Aggravating factors: __ | Alleviating factors: __",
    "NRS; CMS pain documentation; IASP"))
add(row("Functional Status Update",
    "Patient reports ability to: __ | New activities achieved: __ | Ongoing limitations: __ | Sleep quality: __ | Medication changes: __ | HEP compliance: __ [performed __x since last visit / daily / intermittent / not performing: reason: __]",
    "CMS functional reporting; patient self-report; HEP adherence"))
add(row("Relevant Interval Changes",
    "Changes since last visit: __ | New symptoms: __ | Physician visits: __ | Imaging/test results: __ | Medication adjustments: __ | Precaution changes: __",
    "CMS interval documentation; medical records review"))
add(table_end())

# Objective
add("""<h4>Objective — Outpatient Treatment Note</h4>""")
add(table_start())
add(row("Vital Signs (if indicated)",
    "HR: __ bpm | BP: __/__ mmHg | SpO2: __% | RPE: __/20 | Vitals monitored during: __ [pre / during / post treatment]",
    "CMS vital signs; clinical monitoring"))
add(row("Skilled Interventions — Therapeutic Exercise (97110)",
    "Therapeutic exercise: __ min | Focus: __ [ROM / strengthening / flexibility / stabilization / endurance] | Specific exercises: __ | Parameters: __ [sets: __ / reps: __ / resistance: __ / hold: __ sec] | Skilled rationale: __ [exercise progression / form correction / parameter adjustment / safety monitoring]",
    "AMA CPT 97110; Medicare Benefit Policy Manual Ch.15; skilled services"))
add(row("Skilled Interventions — Manual Therapy (97140)",
    "Manual therapy: __ min | Techniques: __ [joint mobilization grade: __ / soft tissue mobilization / myofascial release / strain-counterstrain / muscle energy / neural mobilization / manual lymphatic drainage / other: __] | Target: __ | Patient response: __ | Skilled rationale: __",
    "AMA CPT 97140; APTA manual therapy CPG; skilled services"))
add(row("Skilled Interventions — Neuromuscular Re-education (97112)",
    "Neuromuscular re-education: __ min | Focus: __ [balance training / proprioception / postural control / movement re-training / motor control / coordination / body mechanics / gait retraining] | Activities: __ | Skilled rationale: __",
    "AMA CPT 97112; Medicare Benefit Policy Manual; neuromuscular training"))
add(row("Skilled Interventions — Gait Training (97116)",
    "Gait training: __ min | Focus: __ [gait pattern / assistive device training / weight-bearing progression / stair training / community ambulation / uneven surfaces] | Distance: __ ft | Gait speed: __ m/s | Assist level: __ | Device: __ | Skilled rationale: __",
    "AMA CPT 97116; APTA gait training; skilled services"))
add(row("Skilled Interventions — Therapeutic Activities (97530)",
    "Therapeutic activities: __ min | Focus: __ [dynamic functional activities / multi-plane movements / task-specific training / functional mobility / activity simulation] | Activities performed: __ | Skilled rationale: __",
    "AMA CPT 97530; functional activity training; skilled services"))
add(row("Skilled Interventions — Self-Care/Home Management Training (97535)",
    "Self-care training: __ min | Focus: __ [ADL training / adaptive equipment instruction / home exercise program instruction / energy conservation / joint protection / body mechanics / home safety] | Activities: __ | Skilled rationale: __",
    "AMA CPT 97535; AOTA ADL training; skilled services"))
add(row("Skilled Interventions — SLP Treatment (92507/92526)",
    "SLP treatment (92507): __ min | Focus: __ [articulation / language / cognitive-communication / voice / fluency / pragmatics / AAC training] | Specific targets: __ | Cueing level: __ [independent / minimal / moderate / maximum] | Accuracy: __% | Swallowing treatment (92526): __ min | Focus: __ [oral motor exercises / swallowing strategies / diet advancement / IDDSI level: __] | Skilled rationale: __",
    "AMA CPT 92507/92526; ASHA treatment guidelines; skilled services"))
add(row("Modalities (if applicable)",
    "Modality: __ [hot pack (97010) / cold pack (97010) / electrical stimulation (97014/97032) / ultrasound (97035) / iontophoresis (97033) / mechanical traction (97012) / other: __] | Parameters: __ [time: __ min / intensity: __ / frequency: __ / duty cycle: __ / electrode placement: __] | Target: __ | Patient response: __",
    "AMA CPT modality codes; modality parameter documentation"))
add(row("Objective Measurements (if taken)",
    "ROM: __ [joint: __ | AROM: __° | change from baseline: __°] | Strength: __ [muscle: __ | grade: __/5 | change: __] | Gait speed: __ m/s | Outcome measure: __ [tool: __ | score: __ | change: __] | Other: __",
    "APTA outcome measurement; CMS functional reporting; MIPS"))
add(row("CPT Code Summary / Time",
    "Total treatment time: __ min | Timed codes: __ [97110: __ min | 97140: __ min | 97112: __ min | 97116: __ min | 97530: __ min | other: __ min] | Untimed codes: __ | Total units: __ | 8-Minute Rule calculation: __ | Modifiers: __ [GP / GO / GN / KX / 59 / other]",
    "CMS 8-Minute Rule; AMA CPT; modifier requirements; correct coding"))
add(table_end())

# Assessment
add("""<h4>Assessment — Outpatient Treatment Note</h4>""")
add(table_start())
add(row("Patient Response to Treatment",
    "Patient tolerated treatment: __ [well / fair / poorly] | Response: __ [decreased pain / improved ROM / improved function / increased tolerance / no change / adverse: __] | Objective changes noted: __ | Subjective report after treatment: __",
    "CMS treatment response documentation; skilled assessment"))
add(row("Progress Toward Goals",
    "STG 1: __ [met / progressing / not met: __] | Baseline: __ | Current: __ | Target: __ | STG 2: __ | STG 3: __ | LTG status: __ | Overall progress: __ [progressing as expected / progressing ahead of schedule / progressing slowly / plateau: justification for continued care: __]",
    "CMS goal tracking; Medicare Benefit Policy Manual Ch.15; progress documentation"))
add(row("Skilled Clinical Reasoning",
    "Clinical decision-making this session: __ [treatment modification: __ | progression rationale: __ | regression management: __ | new finding: __ | skilled assessment: __] | Why these interventions require a skilled clinician: __",
    "CMS skilled services justification; Jimmo v. Sebelius; clinical reasoning"))
add(table_end())

# Plan
add("""<h4>Plan — Outpatient Treatment Note</h4>""")
add(table_start())
add(row("Plan for Next Session",
    "Continue current POC: Y/N | Modifications planned: __ | Progression planned: __ | Areas to address next session: __ | Next visit date: __",
    "CMS plan documentation; treatment planning"))
add(row("HEP Update",
    "HEP modifications: __ [new exercises added: __ | exercises progressed: __ | exercises discontinued: __] | Updated HEP provided: Y/N | Patient/caregiver demonstration: Y/N",
    "CMS patient education; HEP documentation"))
add(row("Communication / Coordination",
    "Physician communication: __ [none indicated / called regarding: __ / faxed update: __] | Other discipline coordination: __ | Referral recommended: __ | POC change requiring physician notification: Y/N",
    "CMS coordination; 42 CFR 410.61"))
add(row("Continued Medical Necessity",
    "Continued skilled services justified because: __ | Patient continues to demonstrate: __ [progress toward goals / medical necessity for skilled intervention / need for skilled assessment / complexity requiring professional expertise]",
    "Medicare Benefit Policy Manual Ch.15; CMS continued medical necessity"))
add(table_end())
add(hr())

# Progress Note Subtype 2: Inpatient Rehab Progress Note
add("""<h3>2. Inpatient Rehabilitation Progress Note</h3>
<p><strong>Purpose:</strong> Documents daily skilled treatment sessions in inpatient rehabilitation facilities (IRF), acute care hospitals, and long-term acute care (LTAC) facilities. Must meet CMS IRF requirements including the 3-hour rule (minimum 15 hours/week of therapy across disciplines), demonstrate interdisciplinary coordination, and track progress toward discharge. Documentation aligns with IRF-PAI functional reporting and supports the intensity of services required in the inpatient setting.</p>
<p><strong>Applicable Codes:</strong> Same CPT codes as outpatient; IRF reimbursement is per-diem based on CMG (Case-Mix Group) classification from IRF-PAI</p>
<p><strong>Typical Disciplines:</strong> PT, OT, SLP (all three in IRF; minimum 2 disciplines required)</p>""")
add(hr())

add("""<h4>Subjective — Inpatient Progress Note</h4>""")
add(table_start())
add(row("Patient Report / Nursing Communication",
    "Patient reports: __ | Overnight status: __ [slept well / poor sleep: __ / pain overnight: __/10 / falls: Y/N / behavioral issues: __] | Nursing report: __ | Medical status changes: __ | New orders: __ | Vitals trend: __",
    "IRF documentation; CMS inpatient; nursing-therapy communication"))
add(row("Pain / Symptom Report",
    "Current pain: __/10 | Location: __ | Change from yesterday: __ | Symptoms: __ [fatigue / dizziness / nausea / SOB / other: __] | Medication changes: __",
    "CMS pain documentation; inpatient symptom monitoring"))
add(row("Patient Participation / Motivation",
    "Patient willingness to participate: __ [eager / cooperative / reluctant / refusing: reason: __] | Attendance: __ [attended / refused: reason: __ / medical hold: reason: __] | Alertness: __ | Tolerance for session length: __",
    "IRF participation documentation; CMS treatment attendance"))
add(table_end())

add("""<h4>Objective — Inpatient Progress Note</h4>""")
add(table_start())
add(row("Vital Signs / Medical Status",
    "Pre-treatment: HR: __ | BP: __/__ | SpO2: __% | Temperature: __ | During treatment: HR range: __-__ | BP: __/__ | SpO2 nadir: __% | Post-treatment: HR: __ | BP: __/__ | SpO2: __% | Medical precautions: __ | IV/lines: __ | Oxygen: __ L via __",
    "CMS inpatient monitoring; vital signs; medical safety"))
add(row("Skilled Interventions Performed",
    "Session duration: __ min | Interventions: __ [therapeutic exercise (97110): __ min | neuromuscular re-ed (97112): __ min | gait training (97116): __ min | therapeutic activities (97530): __ min | ADL training (97535): __ min | manual therapy (97140): __ min | cognitive skills (97129): __ min | SLP treatment (92507): __ min | swallowing tx (92526): __ min | other: __] | Specific activities: __",
    "AMA CPT codes; IRF treatment documentation; CMS 8-Minute Rule"))
add(row("Functional Performance This Session",
    "Bed mobility: __ [assist level / change from yesterday] | Transfers: __ | Ambulation/wheelchair: __ [distance: __ | device: __ | assist: __] | Stairs: __ | ADLs addressed: __ | Cognitive tasks: __ | Communication/swallowing: __ | FIM-level performance: __",
    "FIM scale; IRF-PAI; CMS functional documentation"))
add(row("3-Hour Rule Compliance",
    "Therapy time today — PT: __ min | OT: __ min | SLP: __ min | Total: __ min | Weekly total to date: __ min / 900 min required | Compliance: __ [on track / at risk: plan: __] | If &lt;3 hrs/day: justification: __",
    "CMS IRF 3-hour rule (42 CFR 412.622); IRF conditions of participation"))
add(row("CPT Code Summary",
    "Total treatment time: __ min | Codes billed: __ | Units: __ | Modifiers: __ [GP / GO / GN] | 8-Minute Rule: __",
    "CMS 8-Minute Rule; AMA CPT; correct coding"))
add(table_end())

add("""<h4>Assessment — Inpatient Progress Note</h4>""")
add(table_start())
add(row("Patient Response",
    "Tolerated treatment: __ | Response: __ | Functional changes: __ | Barriers encountered: __ | Safety concerns: __",
    "CMS treatment response; clinical assessment"))
add(row("Progress Toward Discharge Goals",
    "STG status: __ | LTG/discharge goal status: __ | Discharge readiness: __ [not ready / approaching / ready for: __ | barriers remaining: __] | Projected discharge date: __ | Progress: __ [on track / ahead / behind: plan: __]",
    "IRF-PAI; CMS discharge planning; goal tracking"))
add(row("Interdisciplinary Coordination",
    "Team communication: __ [PT-OT coordination: __ | nursing training: __ | physician update: __ | case management: __ | family education: __] | IDT conference notes: __ | Treatment schedule coordination: __",
    "CMS IRF IDT requirements; CARF team coordination"))
add(table_end())

add("""<h4>Plan — Inpatient Progress Note</h4>""")
add(table_start())
add(row("Plan for Tomorrow",
    "Treatment focus: __ | Progression: __ | New activities: __ | Equipment trials: __ | Coordination with: __",
    "CMS treatment planning; IRF daily planning"))
add(row("Discharge Planning Update",
    "Projected discharge: __ | Home environment status: __ | DME ordered: __ | Caregiver training status: __ [complete / in progress / not started] | Post-discharge therapy: __ | Follow-up appointments: __",
    "CMS discharge planning; IRF-PAI Section I; Joint Commission"))
add(row("Continued Stay Justification",
    "Continued inpatient rehabilitation is justified because: __ | Patient cannot receive equivalent services at a lower level of care because: __ | Intensity of services required: __ | Medical complexity requiring inpatient supervision: __",
    "CMS IRF coverage; 42 CFR 412.622; continued stay criteria"))
add(table_end())
add(hr())

# Progress Note Subtype 3: Home Health Treatment Note
add("""<h3>3. Home Health Treatment Note</h3>
<p><strong>Purpose:</strong> Documents skilled therapy services provided in the patient's home under a home health episode of care. Must align with OASIS (Outcome and Assessment Information Set) functional items, support PDGM (Patient-Driven Groupings Model) classification, and document homebound status. Home health therapy documentation must demonstrate that services are reasonable and necessary, that the patient is confined to home, and that a plan of care is established and periodically reviewed by the certifying physician.</p>
<p><strong>Applicable Codes:</strong> Same CPT therapy codes; home health reimbursed per 30-day period under PDGM based on OASIS scoring, clinical grouping, and functional level</p>
<p><strong>Typical Disciplines:</strong> PT, PTA, OT, OTA, SLP</p>""")
add(hr())

add("""<h4>Subjective — Home Health Treatment Note</h4>""")
add(table_start())
add(row("Patient / Caregiver Report",
    "Patient reports: __ | Symptoms since last visit: __ | Functional changes: __ | Falls/near-falls since last visit: __ | HEP compliance: __ | Caregiver report: __ | New concerns: __",
    "CMS home health documentation; OASIS; patient report"))
add(row("Pain / Symptom Report",
    "Current pain: __/10 | Location: __ | Change: __ | New symptoms: __ | Medication changes: __ | Physician contact since last visit: __",
    "CMS pain documentation; home health monitoring"))
add(row("Homebound Status Confirmation",
    "Patient remains homebound due to: __ [ambulation difficulty / assistive device required / requires assistance to leave / medical condition: __ / cognitive impairment / SOB with exertion / pain with activity / other: __] | Leaving home requires: __ [considerable effort / taxing effort / assistance of another person / special transportation] | Absences from home: __ [infrequent / short duration / for medical care / adult day / religious / other: __]",
    "CMS homebound definition 42 CFR 409.42; Medicare Benefit Policy Manual Ch.7"))
add(table_end())

add("""<h4>Objective — Home Health Treatment Note</h4>""")
add(table_start())
add(row("Vital Signs / Home Assessment",
    "HR: __ | BP: __/__ | SpO2: __% | Weight: __ (if monitored) | Home environment observations: __ [safety hazards / fall risks / equipment functioning / medication access / nutrition observations]",
    "CMS home health; vital signs; home safety assessment"))
add(row("Skilled Interventions Performed",
    "Session duration: __ min | Interventions: __ [therapeutic exercise / gait training / balance training / transfer training / ADL training / HEP progression / caregiver training / SLP treatment / swallowing therapy / cognitive training / other: __] | CPT codes: __ | Units: __",
    "AMA CPT codes; CMS home health therapy; 8-Minute Rule"))
add(row("Functional Performance in Home",
    "Functional mobility in home: __ [bed mobility: __ | transfers: __ | ambulation in home: __ ft with __ | bathroom access: __ | kitchen access: __ | stairs (if applicable): __] | ADL performance observed: __ | Safety observations: __",
    "OASIS functional items; CMS home health functional documentation"))
add(row("Home Environment / Safety Update",
    "Home modifications completed: __ | DME status: __ [functioning / needs repair / needs ordering: __] | Fall hazards addressed: __ | Caregiver availability: __ | Emergency plan: __",
    "CMS home safety; OASIS environment; fall prevention"))
add(row("CPT Code Summary",
    "Total time: __ min | Codes: __ | Units: __ | Modifiers: __ | Travel time: __ (not billed)",
    "CMS 8-Minute Rule; home health billing"))
add(table_end())

add("""<h4>Assessment — Home Health Treatment Note</h4>""")
add(table_start())
add(row("Patient Response / Progress",
    "Response to treatment: __ | Progress toward goals: __ [STG 1: __ | STG 2: __ | LTG: __] | OASIS functional changes: __ | Safety status: __",
    "CMS home health progress; OASIS; goal tracking"))
add(row("Skilled Service Justification",
    "Skilled services continue to be required because: __ | Complexity requiring professional judgment: __ | Patient/caregiver cannot safely manage independently because: __ | Changes made requiring skilled assessment: __",
    "Medicare Benefit Policy Manual Ch.7; CMS skilled services; home health coverage"))
add(table_end())

add("""<h4>Plan — Home Health Treatment Note</h4>""")
add(table_start())
add(row("Plan for Next Visit",
    "Next visit: __ | Focus: __ | Progression: __ | HEP update: __ | Caregiver training: __ | Equipment needs: __",
    "CMS home health planning; treatment progression"))
add(row("Coordination / Communication",
    "RN case manager notified: __ | Physician communication: __ | Other disciplines: __ | OASIS reassessment due: __ | 30-day recertification: __ | Changes to POC: __",
    "CMS home health coordination; 42 CFR 409.43; OASIS schedule"))
add(row("Homebound Status / Continued Need",
    "Patient continues to meet homebound criteria: Y/N | Justification: __ | Continued home health therapy is needed because: __ | Estimated remaining visits: __",
    "CMS homebound definition; home health coverage criteria"))
add(table_end())
add(hr())

# Progress Note Subtype 4: Pediatric Treatment Note
add("""<h3>4. Pediatric Treatment Note</h3>
<p><strong>Purpose:</strong> Documents skilled therapy sessions for pediatric patients across settings (outpatient, school-based, early intervention, home-based, inpatient). Incorporates age-appropriate documentation including play-based activities, developmental skill progression, family/caregiver involvement, and alignment with IFSP/IEP goals. Must demonstrate skilled services while acknowledging the developmental trajectory unique to pediatric rehabilitation.</p>
<p><strong>Applicable Codes:</strong> Same CPT codes as adult; school-based services may use different billing mechanisms per state regulations</p>
<p><strong>Typical Disciplines:</strong> PT, PTA, OT, OTA, SLP, SLPA</p>""")
add(hr())

add("""<h4>Subjective — Pediatric Treatment Note</h4>""")
add(table_start())
add(row("Parent / Caregiver Report",
    "Parent reports: __ | Changes since last session: __ | New skills observed at home: __ | Concerns: __ | HEP/home activities compliance: __ | School/daycare observations: __ | Behavioral changes: __ | Sleep: __ | Feeding: __",
    "IDEA; family-centered documentation; parent report"))
add(row("Child Presentation",
    "Mood/behavior today: __ [cooperative / playful / fussy / tired / overstimulated / anxious / other: __] | Alertness: __ | Illness/wellness: __ | Medications: __",
    "Pediatric therapy documentation; child-centered observation"))
add(table_end())

add("""<h4>Objective — Pediatric Treatment Note</h4>""")
add(table_start())
add(row("Skilled Interventions Performed",
    "Session duration: __ min | Setting: __ [clinic / school / home / daycare] | Interventions: __ [developmental activities / gross motor training / fine motor training / sensory integration / feeding therapy / articulation therapy / language intervention / cognitive-communication / AAC training / NDT / play-based therapy / adaptive equipment training / other: __] | Specific activities: __",
    "AMA CPT codes; pediatric evidence-based interventions"))
add(row("Developmental Skill Performance",
    "Skills targeted: __ | Performance: __ [emerging / achieved with assist / achieved independently] | Cueing level: __ [independent / visual / verbal / tactile / hand-over-hand] | Accuracy/consistency: __ [__ of __ trials / __% accuracy] | Developmental age performance: __ | New skills observed: __",
    "Developmental milestones; IDEA goal tracking; standardized assessment benchmarks"))
add(row("Sensory / Behavioral Observations",
    "Sensory responses: __ [seeking / avoiding / modulation difficulties] | Self-regulation: __ | Attention span: __ min | Transitions between activities: __ | Behavioral strategies used: __ | Effectiveness: __",
    "Sensory processing assessment; AOTA SI guidelines; behavioral documentation"))
add(row("Parent / Caregiver Involvement",
    "Caregiver present: Y/N | Caregiver participation: __ | Caregiver training provided: __ [techniques demonstrated: __ / strategies discussed: __ / HEP updated: Y/N] | Caregiver demonstration of techniques: __ | Understanding: __",
    "IDEA family-centered services; caregiver training documentation"))
add(row("CPT Code Summary",
    "Total time: __ min | Codes: __ | Units: __ | Modifiers: __ | Service setting: __",
    "CMS 8-Minute Rule; AMA CPT; pediatric billing"))
add(table_end())

add("""<h4>Assessment — Pediatric Treatment Note</h4>""")
add(table_start())
add(row("Child Response / Progress",
    "Response to session: __ | Engagement level: __ | Progress toward goals: __ [STG 1: __ | STG 2: __ | IFSP/IEP goal: __] | Developmental progression: __ | Skilled observations: __",
    "IDEA goal tracking; developmental monitoring; skilled assessment"))
add(row("Skilled Clinical Reasoning",
    "Clinical decisions this session: __ [activity adaptation / grading / environmental modification / technique adjustment / sensory strategy / communication support] | Skilled service justification: __",
    "CMS skilled services; pediatric clinical reasoning"))
add(table_end())

add("""<h4>Plan — Pediatric Treatment Note</h4>""")
add(table_start())
add(row("Plan for Next Session",
    "Next session: __ | Focus: __ | Progression: __ | New activities planned: __ | Equipment needs: __",
    "Treatment planning; pediatric progression"))
add(row("Home Program / Caregiver Follow-Up",
    "HEP updated: Y/N | Activities for home: __ | Strategies for school/daycare: __ | Environmental recommendations: __ | Next caregiver training focus: __",
    "IDEA family education; HEP documentation"))
add(row("Coordination",
    "Team communication: __ [teacher / pediatrician / other therapist / early interventionist / psychologist] | IFSP/IEP review: __ | Referrals: __",
    "IDEA team coordination; multidisciplinary care"))
add(table_end())
add(hr())

# Progress Note Subtype 5: Group/Concurrent Therapy Note
add("""<h3>5. Group / Concurrent Therapy Note</h3>
<p><strong>Purpose:</strong> Documents treatment sessions where the therapist provides group therapy (97150 — 2 or more patients simultaneously with one therapist) or concurrent therapy (treating 2 patients at the same time with different activities). CMS requires that group and concurrent therapy notes document the individualized skilled service each patient receives, not just the group activity. Each patient must have a separate note with individual goals, individual skilled services, and individual response documented.</p>
<p><strong>Applicable Codes:</strong> 97150 (group therapy — untimed), plus any individual timed codes provided during the same session before/after group; concurrent therapy uses standard timed codes</p>
<p><strong>Typical Disciplines:</strong> PT, PTA, OT, OTA, SLP, SLPA</p>""")
add(hr())

add("""<h4>Subjective — Group/Concurrent Note</h4>""")
add(table_start())
add(row("Patient Self-Report",
    "Patient reports: __ | Symptom changes: __ | Pain: __/10 | Functional status: __ | Relevant updates: __",
    "CMS documentation; SOAP format"))
add(table_end())

add("""<h4>Objective — Group/Concurrent Note</h4>""")
add(table_start())
add(row("Session Type / Configuration",
    "Session type: __ [group / concurrent] | Group size: __ patients | Therapist: __ | Setting: __ | Total session time: __ min | Individual treatment time (before/after group): __ min | Group time: __ min",
    "CMS group therapy requirements; 97150 documentation"))
add(row("Group Activity Description",
    "Group activity: __ [balance class / aquatic therapy / gait training group / communication group / cognitive group / exercise class / other: __] | Group goals: __ | Individual focus within group: __",
    "CMS group therapy; individual treatment within group"))
add(row("Individual Skilled Service Within Group",
    "Individual skilled service for THIS patient: __ | Skilled interventions: __ [individual cueing: __ / technique modification: __ / safety monitoring: __ / exercise adaptation: __ / progress assessment: __] | This patient's activities: __ | Parameters individualized: __",
    "CMS group therapy skilled services; Medicare Benefit Policy Manual Ch.15"))
add(row("Individual Performance",
    "This patient's performance: __ | Functional level during group: __ | Assist level: __ | Safety: __ | Interaction with group: __ | Individual measurements (if taken): __",
    "CMS individual documentation within group; functional assessment"))
add(row("Concurrent Therapy Documentation (if concurrent)",
    "Concurrent patient 1: __ [activity: __ | patient 2: __ activity: __] | Therapist alternating attention: __ | Individual skilled services for each: __ | Safety monitoring: __",
    "CMS concurrent therapy guidelines; correct coding"))
add(row("CPT Code Summary",
    "Group therapy (97150): __ | Individual timed codes (if any): __ | Total units: __ | Modifiers: __ [GP / GO / GN]",
    "CMS 97150; group billing; 8-Minute Rule for individual portion"))
add(table_end())

add("""<h4>Assessment — Group/Concurrent Note</h4>""")
add(table_start())
add(row("Individual Patient Response",
    "This patient's response: __ | Progress toward individual goals: __ [STG: __ | LTG: __] | Benefit of group format: __ [social interaction / peer motivation / functional carryover / communication practice / other: __]",
    "CMS individual assessment; group therapy justification"))
add(row("Skilled Clinical Reasoning",
    "Why group/concurrent format is appropriate for this patient: __ | Individual skilled services provided: __ | Clinical decision-making: __",
    "CMS group therapy medical necessity; skilled services"))
add(table_end())

add("""<h4>Plan — Group/Concurrent Note</h4>""")
add(table_start())
add(row("Plan",
    "Continue group/concurrent: Y/N | Next session: __ | Individual treatment also needed: Y/N | Goal updates: __ | POC modifications: __",
    "CMS treatment planning"))
add(row("Continued Medical Necessity",
    "Group/concurrent therapy continues to be appropriate because: __ | Individual skilled services within group: __ | Patient cannot be managed in group alone without individual skilled attention because: __",
    "CMS group therapy medical necessity; continued coverage"))
add(table_end())
add(hr())

# ============================================================
# PART 3: RE-EVALUATION / DISCHARGE SUMMARY FRAMEWORK
# ============================================================

add("""
<!-- ============================================================== -->
<!-- PART 3: RE-EVALUATION / DISCHARGE SUMMARY                      -->
<!-- ============================================================== -->

<h2>PART 3: RE-EVALUATION / DISCHARGE SUMMARY FRAMEWORK</h2>
<p>The Re-evaluation / Discharge Summary framework documents reassessment of functional status, measurement of outcomes against baseline, modification of goals and plan of care, and/or the conclusion of the rehabilitation episode. Per CMS 42 CFR 410.61, the plan of care must be recertified at least every 90 days (every 30 days for practical purposes to support continued medical necessity). Re-evaluations (97164 PT, 97168 OT) are performed when there is a significant change in functional status, when the current plan of care needs modification, or at mandated intervals. Discharge summaries document the final functional outcomes, goal achievement, and post-discharge recommendations.</p>
<p>Re-evaluations must be performed by the licensed therapist (PT, OT, SLP) — not by assistants. Discharge summaries may be completed by assistants under therapist supervision per state practice acts, with therapist co-signature.</p>""")
add(hr())

# RE/DC Subtype 1: Outpatient Re-evaluation
add("""<h3>1. Outpatient Re-evaluation</h3>
<p><strong>Purpose:</strong> Reassesses the outpatient rehabilitation patient's functional status at scheduled intervals (typically every 30 days, or 10 visits), after significant change in status, or when the plan of care needs modification. Compares current performance to initial evaluation baselines, updates goals, and justifies continued care or discharge. Critical for supporting the KX modifier when therapy spending approaches the annual cap threshold.</p>
<p><strong>Applicable Codes:</strong> 97164 (PT re-eval), 97168 (OT re-eval), 92521-92524 (SLP re-eval)</p>
<p><strong>Typical Disciplines:</strong> PT, OT, SLP (must be performed by licensed therapist)</p>""")
add(hr())

add("""<h4>Reason for Re-evaluation</h4>""")
add(table_start())
add(row("Re-evaluation Trigger",
    "Reason for re-evaluation: __ [scheduled interval: __ days/visits | significant change in status: __ | physician request | new diagnosis/complication: __ | KX modifier threshold approaching | prior authorization renewal | patient/family request | plateau assessment | pre-discharge assessment]",
    "CMS 42 CFR 410.61; Medicare Benefit Policy Manual Ch.15; re-evaluation triggers"))
add(row("Interval Summary",
    "Initial evaluation date: __ | Total visits to date: __ | Total units billed: __ | Spending to date: $__ | KX threshold: $__ | Targeted Medical Review threshold: $__ | Current certification period: __ to __",
    "CMS therapy cap; KX modifier; targeted medical review"))
add(table_end())

add("""<h4>Updated Tests &amp; Measures</h4>""")
add(table_start())
add(row("ROM Re-measurement",
    "Joint: __ | AROM baseline: __° | AROM current: __° | Change: __° | PROM baseline: __° | PROM current: __° | Change: __° | Clinical significance: __",
    "APTA goniometry; outcome measurement; re-evaluation standards"))
add(row("Strength Re-measurement",
    "Muscle group: __ | MMT baseline: __/5 | MMT current: __/5 | Change: __ | Functional strength: __ | Grip/pinch (if UE): baseline __ → current __ lbs",
    "MMT; APTA strength assessment; functional strength"))
add(row("Balance Re-assessment",
    "Tool: __ | Baseline score: __ | Current score: __ | Change: __ | MCID: __ | Clinically meaningful change: Y/N | Fall risk status: __ [increased / decreased / unchanged]",
    "Berg/TUG/Tinetti; CDC STEADI; balance outcome measurement"))
add(row("Gait Re-assessment",
    "Gait speed: baseline __ → current __ m/s | Change: __ | 6MWT: baseline __ → current __ m | Change: __ | Device change: __ | Assist level change: __ | Weight-bearing progression: __",
    "Gait speed norms; 6MWT MCID; gait assessment"))
add(row("Functional Outcome Measure Re-administration",
    "Tool: __ | Baseline score: __ | Current score: __ | Change: __ | MCID: __ | MDC: __ | Exceeded MCID: Y/N | Interpretation: __ | Normative comparison: __",
    "Specific validated tool; MCID/MDC values; CMS quality measures"))
add(row("Pain Re-assessment",
    "NRS baseline: __/10 | NRS current: __/10 | Change: __ | Pain pattern: __ [improving / stable / worsening] | Functional impact of pain: __",
    "NRS; CMS pain documentation"))
add(row("Functional Status Re-assessment",
    "Mobility: baseline __ → current __ | Transfers: baseline __ → current __ | ADLs: baseline __ → current __ | Work/activity: baseline __ → current __ | Overall functional improvement: __%",
    "CMS functional reporting; FIM/AM-PAC; outcome measurement"))
add(table_end())

add("""<h4>Goal Status &amp; Update</h4>""")
add(table_start())
add(row("STG Status",
    "STG 1: __ [met / progressing / not met / modified] | Baseline: __ | Target: __ | Current: __ | STG 2: __ | STG 3: __ | STG 4: __ | Goals met: __/__ | Goals progressing: __/__ | Goals not met: __/__",
    "CMS goal tracking; SMART goals; re-evaluation"))
add(row("LTG Status",
    "LTG 1: __ [met / progressing / not met / modified] | Baseline: __ | Target: __ | Current: __ | LTG 2: __ | LTG 3: __ | Discharge readiness: __",
    "CMS goal tracking; discharge planning"))
add(row("Updated Goals (if modified)",
    "New/revised STG 1: __ | Target date: __ | New/revised STG 2: __ | New/revised LTG 1: __ | Rationale for goal modification: __",
    "CMS goal modification; clinical justification"))
add(table_end())

add("""<h4>Updated Plan of Care</h4>""")
add(table_start())
add(row("Plan of Care Modifications",
    "POC changes: __ [frequency change: __ → __ | duration extension: __ | new interventions: __ | discontinued interventions: __ | intensity change: __] | Rationale: __",
    "CMS 42 CFR 410.61; POC modification; physician notification"))
add(row("Updated Frequency / Duration",
    "Updated frequency: __ x/wk | Updated duration: __ additional weeks | Total visits remaining: __ | New certification period: __ to __ | Recertification due: __",
    "CMS recertification; plan of care"))
add(row("Continued Medical Necessity Justification",
    "Continued skilled services are medically necessary because: __ | Patient has demonstrated: __ [functional gains: __ / continued impairments requiring skilled intervention: __ / rehabilitation potential: __] | Without continued services: __ | KX modifier attestation (if applicable): skilled services above the therapy cap threshold are medically necessary because: __",
    "Medicare Benefit Policy Manual Ch.15; KX modifier; continued medical necessity"))
add(row("Physician Recertification",
    "Updated POC sent to physician: Y/N | Date sent: __ | Physician recertification: __ [received / pending] | New certification period: __ to __",
    "CMS 42 CFR 410.61; physician recertification"))
add(row("Discharge Plan (if applicable)",
    "Discharge recommended: Y/N | If yes: reason: __ [goals met / patient declined / physician discharge / insurance exhausted / plateau with no skilled need / moved / other: __] | Discharge date: __ | Follow-up: __ | HEP: __ | Community resources: __",
    "CMS discharge criteria; outpatient discharge"))
add(table_end())
add(hr())

# RE/DC Subtype 2: Inpatient Discharge Summary
add("""<h3>2. Inpatient Discharge Summary</h3>
<p><strong>Purpose:</strong> Comprehensive summary of the rehabilitation episode for patients discharged from inpatient rehabilitation facilities (IRF), acute care, SNF, or LTAC. Documents admission-to-discharge functional gains using standardized outcome measures (FIM, MDS 3.0 Section GG, AM-PAC), goal achievement, total services provided, and post-discharge recommendations including follow-up care, DME, caregiver education, and community resources.</p>
<p><strong>Applicable Codes:</strong> No separate CPT code for discharge summary; included in the per-diem or per-episode reimbursement; IRF-PAI discharge assessment required</p>
<p><strong>Typical Disciplines:</strong> PT, OT, SLP</p>""")
add(hr())

add("""<h4>Discharge Summary — Inpatient</h4>""")
add(table_start())
add(row("Patient Information / Episode Summary",
    "Name: __ | DOB: __ | Admission date: __ | Discharge date: __ | LOS: __ days | Admission diagnosis: __ | ICD-10: __ | Disciplines involved: __ [PT / OT / SLP] | Total PT visits: __ | Total OT visits: __ | Total SLP visits: __ | Payer: __",
    "CMS discharge summary; IRF-PAI; administrative data"))
add(row("Admission Functional Status (Baseline)",
    "Admission FIM total: __/126 | Motor: __/91 | Cognitive: __/35 | OR GG Self-Care admission: __ | GG Mobility admission: __ | Key baseline measures: __ [ambulation: __ | transfers: __ | ADLs: __ | cognition: __ | communication: __ | swallowing: __]",
    "FIM; MDS 3.0 Section GG; IRF-PAI; AM-PAC"))
add(row("Discharge Functional Status",
    "Discharge FIM total: __/126 | Motor: __/91 | Cognitive: __/35 | OR GG Self-Care discharge: __ | GG Mobility discharge: __ | Key discharge measures: __ [ambulation: __ | transfers: __ | ADLs: __ | cognition: __ | communication: __ | swallowing: __]",
    "FIM; MDS 3.0 Section GG; IRF-PAI; discharge assessment"))
add(row("Functional Gains / Outcomes",
    "FIM change: __ points [motor: __ | cognitive: __] | FIM efficiency: __ points/day | GG change: self-care: __ | mobility: __ | Outcome measures: __ [tool: __ | admission: __ | discharge: __ | change: __ | MCID achieved: Y/N] | Percentage of goals met: __% | Functional gains summary: __",
    "FIM efficiency; IRF-PAI outcomes; CMS quality measures; MIPS"))
add(row("Goal Achievement",
    "STG: __/__ met (___%) | LTG: __/__ met (___%) | Goals met: __ | Goals partially met: __ | Goals not met: __ [reason: __] | Discharge goal met: Y/N",
    "CMS goal documentation; discharge outcomes"))
add(row("Services Provided Summary",
    "PT interventions: __ | OT interventions: __ | SLP interventions: __ | Total therapy hours: __ | Average therapy hours/day: __ | 3-hour rule compliance: __% | Key progressions: __ | Equipment provided: __",
    "IRF 3-hour rule; CMS service summary; discharge planning"))
add(row("Discharge Status / Disposition",
    "Discharge to: __ [home / home with services / SNF / assisted living / LTAC / outpatient rehab / other: __] | Ambulatory status: __ [device: __ | assist level: __ | distance: __] | ADL status: __ | Safety status: __ | Supervision needs: __",
    "CMS discharge planning; IRF-PAI discharge; functional status"))
add(row("Post-Discharge Recommendations",
    "Outpatient therapy recommended: __ [PT: Y/N __ x/wk | OT: Y/N __ x/wk | SLP: Y/N __ x/wk] | Home health: Y/N | HEP provided: Y/N [exercises: __] | DME at discharge: __ | Home modifications: __ | Follow-up appointments: __ | Caregiver instructions: __ | Emergency precautions: __",
    "CMS discharge planning; continuity of care; post-acute recommendations"))
add(row("Caregiver Education Summary",
    "Caregiver: __ | Training completed: __ [transfers: Y/N | mobility: Y/N | ADLs: Y/N | HEP: Y/N | safety: Y/N | equipment use: Y/N | emergency protocols: Y/N] | Caregiver competency: __ | Written instructions provided: Y/N",
    "CMS caregiver education; Joint Commission; discharge preparation"))
add(table_end())
add(hr())

# RE/DC Subtype 3: Home Health Recertification
add("""<h3>3. Home Health Recertification</h3>
<p><strong>Purpose:</strong> Documents the reassessment of home health patients at the end of each 30-day period (per PDGM) or 60-day recertification. Updates OASIS functional scores, reassesses homebound status, modifies goals and plan of care, and supports physician recertification. Must demonstrate continued need for skilled therapy services and homebound status.</p>
<p><strong>Applicable Codes:</strong> 97164 (PT re-eval), 97168 (OT re-eval), 92521-92524 (SLP re-eval); home health reimbursed per 30-day period under PDGM</p>
<p><strong>Typical Disciplines:</strong> PT, OT, SLP</p>""")
add(hr())

add("""<h4>Recertification Assessment</h4>""")
add(table_start())
add(row("Episode Summary",
    "Certification period: __ to __ | Visits this period — PT: __ | OT: __ | SLP: __ | RN: __ | Total: __ | OASIS assessment type: __ [recertification / transfer / resumption / discharge]",
    "CMS home health; OASIS; PDGM; recertification"))
add(row("Homebound Status Reassessment",
    "Patient remains homebound: Y/N | Criteria: __ | Changes in homebound status: __ | Absences from home: __ [frequency / duration / reason]",
    "CMS 42 CFR 409.42; homebound definition; recertification"))
add(row("Updated OASIS Functional Items",
    "OASIS functional items updated: __ | M1800 (grooming): baseline __ → current __ | M1810 (UB dressing): __ → __ | M1820 (LB dressing): __ → __ | M1830 (bathing): __ → __ | M1840 (toilet transfer): __ → __ | M1850 (transferring): __ → __ | M1860 (ambulation): __ → __ | M1033 (risk for hospitalization): __",
    "CMS OASIS-E; PDGM functional scoring; home health quality"))
add(row("Outcome Measures",
    "Tool: __ | Prior score: __ | Current score: __ | Change: __ | MCID achieved: Y/N | Additional measures: __ | Functional gains: __",
    "Validated outcome tools; CMS quality; MIPS"))
add(row("Updated Goals",
    "STG status: __ [met / progressing / modified] | New STGs: __ | LTG status: __ | New LTGs: __ | Discharge readiness: __",
    "CMS goals; home health re-evaluation"))
add(row("Updated Plan of Care",
    "POC modifications: __ | Frequency change: __ | New interventions: __ | Discontinued: __ | Projected visits next period: __ | Estimated discharge: __",
    "CMS home health POC; 42 CFR 409.43"))
add(row("Physician Recertification",
    "Updated POC sent to physician: Y/N | Date: __ | Physician face-to-face encounter: __ [date / provider / documentation on file] | Recertification: __ [received / pending]",
    "CMS home health recertification; face-to-face requirement"))
add(row("Continued Medical Necessity",
    "Continued home health therapy justified because: __ | Skilled services needed: __ | Patient cannot receive services outside home because: __ | Without continued services: __",
    "CMS home health coverage; skilled services; homebound"))
add(table_end())
add(hr())

# RE/DC Subtype 4: Functional Capacity Evaluation
add("""<h3>4. Functional Capacity Evaluation (FCE)</h3>
<p><strong>Purpose:</strong> Comprehensive, standardized assessment of a patient's ability to perform work-related functional tasks. Used for return-to-work decisions, disability determination, workers' compensation claims, and litigation. Documents the patient's safe functional abilities across physical demand categories (lifting, carrying, pushing, pulling, standing, walking, sitting, climbing, reaching, handling, fingering, feeling). Must include consistency of effort testing, symptom validity, and comparison to job-specific physical demands.</p>
<p><strong>Applicable Codes:</strong> 97750 (physical performance test/measurement with report), 97799 (unlisted physical medicine procedure); some payers use specific FCE billing codes</p>
<p><strong>Typical Disciplines:</strong> PT (most common), OT (especially for upper extremity FCE)</p>""")
add(hr())

add("""<h4>FCE Report</h4>""")
add(table_start())
add(row("Patient / Case Information",
    "Name: __ | DOB: __ | Age: __ | Sex: __ | Employer: __ | Job title: __ | Injury date: __ | Diagnosis: __ | ICD-10: __ | Referral source: __ [physician / attorney / employer / insurance] | FCE date: __ | Evaluator: __ | FCE system used: __",
    "ACOEM guidelines; DOL physical demands; FCE standards"))
add(row("Medical / Injury History Summary",
    "Mechanism of injury: __ | Treatment to date: __ | Surgeries: __ | Current symptoms: __ | Medications: __ | Activity restrictions: __ | MMI status: __ [reached / not reached]",
    "ACOEM; workers' comp; medical history"))
add(row("Job Demands Analysis",
    "Job title: __ | DOL classification: __ [sedentary / light / medium / heavy / very heavy] | Essential functions: __ | Physical demands: __ [lifting: __ lbs / carrying: __ lbs / pushing: __ lbs / pulling: __ lbs / standing: __ hrs / walking: __ hrs / sitting: __ hrs / climbing: Y/N / reaching: __ / handling: __ / fingering: __] | Job description reviewed: Y/N",
    "DOL Dictionary of Occupational Titles; job demands analysis; ACOEM"))
add(row("Musculoskeletal Assessment",
    "ROM: __ [joint-by-joint findings] | Strength: __ [MMT / dynamometry] | Grip strength: R __ / L __ lbs | Pinch: __ | Posture: __ | Gait: __ | Neurological screen: __",
    "AMA Guides 6th Ed; APTA assessment; FCE musculoskeletal evaluation"))
add(row("Functional Testing — Material Handling",
    "Floor-to-waist lift: __ lbs [occasional / frequent / constant] | Waist-to-shoulder lift: __ lbs | Shoulder-to-overhead lift: __ lbs | Carry: __ lbs x __ ft | Push: __ lbs [static / dynamic] | Pull: __ lbs [static / dynamic] | Consistency of effort: __",
    "DOL physical demands; FCE protocols; isometric/dynamic testing"))
add(row("Functional Testing — Positional Tolerances",
    "Standing tolerance: __ min | Walking tolerance: __ min / __ ft | Sitting tolerance: __ min | Kneeling: __ | Crouching: __ | Crawling: __ | Climbing stairs: __ | Climbing ladder: __ | Balancing: __ | Each rated: __ [occasional (<33%) / frequent (34-66%) / constant (67-100%)]",
    "DOL positional demands; FCE positional testing"))
add(row("Functional Testing — Hand/UE Function",
    "Grip endurance: __ | Fine motor: __ | Gross manipulation: __ | Fingering: __ | Reaching — forward: __ / overhead: __ / below waist: __ | Handling: __ | Coordination: __ | Dominant hand: __",
    "ASHT guidelines; FCE hand function testing; DOL demands"))
add(row("Effort Consistency / Validity",
    "Effort consistency: __ [consistent / inconsistent: __] | Coefficient of variation: __% [<15% = consistent] | Waddell signs: __/5 | Heart rate response to effort: __ [appropriate / inappropriate] | Self-limiting behaviors: __ | Symptom magnification indicators: __ | Overall effort validity: __ [valid / invalid: reason: __]",
    "Waddell signs; CV for effort consistency; FCE validity testing; symptom validity"))
add(row("Pain / Symptom Response",
    "Pre-test pain: __/10 | Post-test pain: __/10 | Pain behavior observations: __ | Self-reported limitations: __ | Activity modification due to symptoms: __ | Consistency with objective findings: __",
    "NRS; pain behavior assessment; symptom validity"))
add(row("Physical Demand Level Determination",
    "Demonstrated physical demand level: __ [sedentary / light / medium / heavy / very heavy] | Job demand level: __ | Match: Y/N | Gaps: __ | Restrictions recommended: __ | Accommodations recommended: __",
    "DOL physical demand classifications; ADA reasonable accommodations; ACOEM"))
add(row("Conclusions / Recommendations",
    "FCE conclusions: __ | Return-to-work recommendation: __ [full duty / modified duty: __ / unable to return to prior job: __ / unable to work: __] | Restrictions: __ | Accommodations: __ | Work conditioning/hardening recommended: Y/N | Additional treatment recommended: __ | Re-evaluation date: __",
    "ACOEM RTW guidelines; FCE conclusions; disability determination"))
add(table_end())
add(hr())

# RE/DC Subtype 5: Return-to-Work/Sport Clearance
add("""<h3>5. Return-to-Work / Sport Clearance</h3>
<p><strong>Purpose:</strong> Documents the clinical assessment and recommendation for a patient's return to work or sport activities following injury, surgery, or illness. Incorporates sport-specific or job-specific functional testing, standardized return-to-play/return-to-work criteria, and risk assessment. For sports, follows established return-to-play protocols (e.g., stepwise progression for concussion, ACL reconstruction criteria). For work, applies DOL physical demand classifications and ACOEM return-to-work guidelines.</p>
<p><strong>Applicable Codes:</strong> 97164/97168 (re-evaluation), 97750 (physical performance test), 97161-97163/97165-97167 (if new episode)</p>
<p><strong>Typical Disciplines:</strong> PT (primary), OT (upper extremity/hand, work tasks)</p>""")
add(hr())

add("""<h4>Return-to-Work/Sport Clearance Assessment</h4>""")
add(table_start())
add(row("Patient / Case Information",
    "Name: __ | DOB: __ | Diagnosis: __ | Surgery/injury date: __ | Post-op/post-injury: __ weeks | Sport: __ | Position: __ | Level: __ [recreational / high school / collegiate / professional] | OR Job: __ | Physical demand level: __ | Physician clearance: __ [obtained / pending / conditional]",
    "Return-to-play/work protocols; ACOEM; sport-specific guidelines"))
add(row("Symptom Status",
    "Current symptoms: __ | Pain: __/10 | Swelling: __ | Instability: __ | Symptom-free with activity: Y/N | Symptom provocation: __ | Medications: __ | Post-concussion: __ [symptom-free at rest: Y/N | symptom-free with exertion: Y/N | ImPACT cleared: Y/N]",
    "Return-to-play criteria; concussion management; symptom assessment"))
add(row("Physical Assessment",
    "ROM: __ [involved: __° vs. uninvolved: __° | symmetry: __%] | Strength: __ [involved: __ vs. uninvolved: __ | LSI: __%] | Limb Symmetry Index target: ≥90% | Isokinetic testing (if available): __ [quad: __% / ham: __% / H:Q ratio: __] | Flexibility: __ | Anthropometric: __",
    "Return-to-sport criteria; LSI; isokinetic norms; ACSM"))
add(row("Functional Testing",
    "Single-leg hop test: __ [single hop: R __ / L __ cm | LSI: __% | triple hop: R __ / L __ cm | LSI: __% | crossover hop: __ | timed hop: __] | Y-Balance Test: __ [composite R: __ / L: __ | asymmetry: __] | Agility testing: __ [T-test: __ sec / pro agility: __ sec] | Sport/work-specific tasks: __",
    "Hop testing (Noyes et al.); Y-Balance; sport-specific functional testing"))
add(row("Sport-Specific / Job-Specific Assessment",
    "Sport-specific drills: __ [running: __ / cutting: __ / jumping: __ / throwing: __ / sport-specific movements: __] | OR Job-specific tasks: __ [lifting: __ / carrying: __ / repetitive motions: __ / sustained postures: __] | Performance quality: __ | Confidence level: __ | Apprehension: Y/N",
    "Return-to-sport progression; job simulation; task-specific assessment"))
add(row("Psychological Readiness",
    "ACL-RSI (if applicable): __/100 | Tampa Scale of Kinesiophobia: __/68 | Fear of re-injury: __ [none / mild / moderate / severe] | Confidence in return: __ | Psychological readiness: __ [ready / not ready: __]",
    "ACL-RSI (Webster et al.); TSK; psychological readiness for return-to-sport"))
add(row("Return-to-Play / Return-to-Work Criteria",
    "Criteria met: __ | Full ROM: Y/N | Strength ≥90% LSI: Y/N | Hop test ≥90% LSI: Y/N | Sport-specific competence: Y/N | Symptom-free with full activity: Y/N | Physician clearance: Y/N | Protocol stage: __ [phase __ of __] | Concussion protocol step (if applicable): __ [step __ of 6 | asymptomatic: Y/N]",
    "Return-to-sport criteria; Berlin Concussion Consensus; ACL RTS criteria; ACOEM"))
add(row("Clearance Recommendation",
    "Recommendation: __ [cleared for full return / cleared with restrictions: __ / not cleared: reason: __ / gradual return-to-play progression: phase __ / conditional clearance pending: __] | Protective equipment: __ | Bracing: __ | Taping: __ | Activity modification: __ | Re-evaluation date: __ | Maintenance program: __",
    "Return-to-sport/work guidelines; clinical clearance; risk management"))
add(table_end())
add(hr())

# ============================================================
# PART 4: CROSS-FRAMEWORK ADD-ONS
# ============================================================

add("""
<!-- ============================================================== -->
<!-- PART 4: CROSS-FRAMEWORK ADD-ONS                                -->
<!-- ============================================================== -->

<h2>PART 4: CROSS-FRAMEWORK REHABILITATION ADD-ONS</h2>
<p>These documentation items apply across <strong>all three frameworks</strong> (Initial Evaluation, Progress Note, and Re-evaluation/Discharge Summary) and across <strong>all subtypes</strong>. They represent clinical documentation elements that are universally relevant regardless of the rehabilitation setting, patient population, or encounter type. These items are always available in the template and are activated based on clinical relevance to the specific encounter.</p>""")
add(hr())

add("""<h4>Fall Risk Screening &amp; Prevention</h4>""")
add(table_start())
add(row("Fall Risk Assessment",
    "Fall risk screening tool: __ [Morse Fall Scale: __ | Hendrich II: __ | Berg < 45: __ | TUG > 13.5s: __ | other: __] | Risk level: __ [low / moderate / high] | Fall history: __ | Intrinsic factors: __ | Extrinsic factors: __ | Interventions: __ | Patient/caregiver education: __",
    "CDC STEADI; Morse Fall Scale; Joint Commission NPSG.06.01; CMS fall prevention"))
add(table_end())

add("""<h4>Medication Reconciliation</h4>""")
add(table_start())
add(row("Medication Review",
    "Current medications: __ [total count: __] | Medications affecting rehab: __ [anticoagulants / opioids / sedatives / beta-blockers / antihypertensives / diabetic medications / psychotropics / other: __] | Fall-risk medications: __ [AGS Beers Criteria review: __] | Polypharmacy concerns: __ | Side effects impacting therapy: __ | Physician notified of concerns: Y/N",
    "AGS Beers Criteria; CMS medication reconciliation; Joint Commission NPSG.03.06.01"))
add(table_end())

add("""<h4>Social Determinants of Health (SDOH)</h4>""")
add(table_start())
add(row("SDOH Screening",
    "Housing stability: __ | Food security: __ | Transportation: __ | Social isolation: __ | Financial concerns affecting care: __ | Health literacy: __ | Caregiver burden: __ | Cultural considerations: __ | Language barriers: __ | Insurance barriers: __ | Community resources referred: __",
    "CMS SDOH screening; ICD-10 Z-codes (Z55-Z65); Healthy People 2030"))
add(table_end())

add("""<h4>Infection Control / Precautions</h4>""")
add(table_start())
add(row("Infection Control Documentation",
    "Isolation precautions: __ [none / contact / droplet / airborne / combined: __] | PPE used: __ | Hand hygiene: __ | Equipment cleaning: __ | MDRO status: __ [MRSA / VRE / C. diff / CRE / other: __] | COVID-19 status: __ | Impact on therapy delivery: __",
    "CDC infection control; CMS infection prevention; Joint Commission IC standards"))
add(table_end())

add("""<h4>Pain Management</h4>""")
add(table_start())
add(row("Comprehensive Pain Assessment",
    "Pain tool: __ [NRS: __/10 | VAS: __ mm | Wong-Baker FACES: __ | PAINAD (non-verbal): __/10 | FLACC (pediatric): __/10] | Location: __ (body diagram: Y/N) | Quality: __ | Duration: __ | Frequency: __ | Aggravating: __ | Alleviating: __ | Impact on function: __ | Pain management strategies: __ [modalities / positioning / activity modification / relaxation / education]",
    "IASP; Joint Commission PC.01.02.07; CMS pain documentation; age-appropriate tools"))
add(table_end())

add("""<h4>Telehealth Documentation</h4>""")
add(table_start())
add(row("Telehealth Session",
    "Service delivered via telehealth: Y/N | Platform: __ | Modifiers: __ [95 / GT / -FQ] | Place of service: __ [02 / 10] | Patient location: __ | Provider location: __ | Audio-visual technology: __ [functioning / technical issues: __] | Patient consent for telehealth: Y/N | Appropriateness of telehealth for this session: __ | Limitations: __ | Activities that could not be performed via telehealth: __",
    "CMS telehealth policy; AMA CPT telehealth modifiers; state telehealth practice acts"))
add(table_end())

add("""<h4>Caregiver Training &amp; Education</h4>""")
add(table_start())
add(row("Caregiver Training Documentation",
    "Caregiver: __ | Relationship: __ | Training topic: __ [transfers / mobility assist / feeding / communication strategies / HEP supervision / safety / equipment use / positioning / skin checks / fall prevention] | Method: __ [verbal / demonstration / written / video / return demonstration] | Caregiver competency: __ [independent / needs more training: __] | Time spent: __ min",
    "CMS caregiver training; Joint Commission PC.02.03.01; family education"))
add(table_end())

add("""<h4>DME Assessment &amp; Recommendation</h4>""")
add(table_start())
add(row("DME Documentation",
    "DME assessed: __ [wheelchair: __ / walker: __ / cane: __ / crutches: __ / AFO-orthotics: __ / hospital bed: __ / commode: __ / shower chair: __ / grab bars: __ / raised toilet seat: __ / reacher: __ / adaptive equipment: __ / AAC device: __ / other: __] | Medical necessity for DME: __ | Fit/adjustment: __ | Patient training: __ | HCPCS code: __ | Prescription provided: Y/N | Vendor: __",
    "CMS DMEPOS; HCPCS coding; ATP certification; medical necessity for DME"))
add(table_end())

add("""<h4>Outcome Measure Tracking</h4>""")
add(table_start())
add(row("Standardized Outcome Tracking",
    "Outcome tool: __ | Administration date: __ | Score: __ | Prior score: __ | Change: __ | MCID: __ | MDC: __ | Clinically meaningful change: Y/N | Normative comparison: __ | CMS quality measure alignment: __ | MIPS reporting: __",
    "CMS MIPS; FOTO; OPTIMAL; validated outcome tools; quality reporting"))
add(table_end())
add(hr())

# ============================================================
# PART 5: SPECIALTY-SPECIFIC ADD-ONS
# ============================================================

add("""
<!-- ============================================================== -->
<!-- PART 5: SPECIALTY-SPECIFIC ADD-ONS                             -->
<!-- ============================================================== -->

<h2>PART 5: SPECIALTY-SPECIFIC ADD-ONS</h2>
<p>These specialty-specific item sets layer additional documentation items on top of any base framework + subtype template. When a therapist practices in a specialty area, these items supplement the general rehabilitation documentation to capture the unique assessments, interventions, and outcomes relevant to that specialty. Each add-on can be applied to any of the three frameworks (IE, Progress Note, RE/DC) as clinically appropriate.</p>""")
add(hr())

# Specialty 1: Hand Therapy
add("""<h3>Hand Therapy Add-On</h3>
<p><strong>Applicable to:</strong> OT (CHT — Certified Hand Therapist), PT with hand therapy focus</p>
<p><strong>Setting:</strong> Outpatient hand therapy clinics, post-surgical upper extremity rehabilitation</p>""")
add(table_start())
add(row("Edema Measurement",
    "Circumferential measurements: __ [digit: __ cm | MCP: __ cm | PIP: __ cm | DIP: __ cm | wrist: __ cm | forearm: __ cm] | Volumeter: involved __ mL / uninvolved __ mL | Difference: __ mL | Figure-of-8: __ cm | Edema management: __ [compression / elevation / retrograde massage / Coban wrap]",
    "ASHT Clinical Assessment; edema measurement standards; CHT practice"))
add(row("Grip &amp; Pinch Strength (Detailed)",
    "Jamar dynamometer — position: __ | R: __ / __ / __ lbs (3 trials) | L: __ / __ / __ lbs | Mean R: __ | Mean L: __ | Rapid exchange grip: __ | CV: __% | Lateral pinch: R __ / L __ lbs | Tip pinch: R __ / L __ lbs | 3-jaw chuck: R __ / L __ lbs | Key pinch: R __ / L __ | Norms: __ | % normal: __",
    "ASHT; Mathiowetz norms; Jamar 5-position protocol; effort consistency"))
add(row("Individual Digit ROM",
    "Digit: __ | MCP: flex __° / ext __° / abd __° | PIP: flex __° / ext __° | DIP: flex __° / ext __° | TAM: __° | TPM: __° | Composite fist: __ [fingertip-to-palm distance: __ cm] | Composite extension lag: __° | Thumb: CMC abd __° / opp __° / IP flex __°",
    "ASHT measurement standards; TAM (total active motion); AMA Guides"))
add(row("Sensory Evaluation",
    "Semmes-Weinstein monofilament: __ [2.83=normal / 3.61=diminished light touch / 4.31=diminished protective / 4.56=loss protective / 6.65=deep pressure only / no response] per digit zone | Two-point discrimination: static __ mm / moving __ mm | Tinel's sign: __ [location: __ | progression: __cm] | Phalen's test: __ sec | Nerve conduction: __",
    "ASHT sensory assessment; Semmes-Weinstein; 2PD norms; Bell-Krotoski"))
add(row("Scar Assessment",
    "Scar location: __ | Length: __ cm | Width: __ cm | Color: __ [red / pink / white / purple / hyperpigmented] | Texture: __ [raised / flat / depressed / keloid / hypertrophic] | Pliability: __ [supple / yielding / firm / banding / contracture] | Vancouver Scar Scale: __/13 | POSAS: __ | Scar management: __ [silicone / massage / compression / desensitization]",
    "Vancouver Scar Scale; POSAS; ASHT scar management; wound care"))
add(row("Splinting / Orthosis",
    "Splint type: __ [static / static progressive / dynamic / serial static / other: __] | Purpose: __ [immobilization / mobilization / protection / positioning] | Design: __ | Material: __ | Wearing schedule: __ [hours/day / during: __] | Fit check: __ | Patient education: __ | Modifications needed: __",
    "ASHT splinting guidelines; orthotic fabrication standards; CHT practice"))
add(row("Functional Hand Assessment",
    "Jebsen-Taylor Hand Function Test: __ | 9-Hole Peg Test: R __ sec / L __ sec | Purdue Pegboard: __ | DASH: __/100 | QuickDASH: __/100 | Michigan Hand Questionnaire: __ | PRWE: __ | Functional tasks: __ [buttons / zippers / writing / typing / opening containers / tool use: __]",
    "ASHT functional assessment; DASH; Jebsen-Taylor; 9-Hole Peg norms"))
add(row("Tendon Protocol Compliance",
    "Protocol: __ [Duran / Kleinert / modified Duran / Indiana / early active motion / other: __] | Post-op week: __ | Phase: __ | AROM: __ | PROM: __ | Tendon gliding exercises: __ | Differential tendon gliding: __ | Resistance initiation: __ [week: __ / protocol criteria met: Y/N]",
    "Flexor tendon repair protocols; extensor tendon protocols; surgeon-specific protocols"))
add(table_end())
add(hr())

# Specialty 2: Vestibular Rehabilitation
add("""<h3>Vestibular Rehabilitation Add-On</h3>
<p><strong>Applicable to:</strong> PT with vestibular certification/training</p>
<p><strong>Setting:</strong> Outpatient vestibular rehabilitation clinics, neurology, ENT referrals</p>""")
add(table_start())
add(row("Vestibular History",
    "Dizziness type: __ [vertigo / lightheadedness / disequilibrium / oscillopsia / presyncope] | Onset: __ | Duration of episodes: __ [seconds / minutes / hours / days / constant] | Triggers: __ [head movement / position change / visual stimuli / stress / other: __] | Associated symptoms: __ [nausea / vomiting / tinnitus / hearing loss / aural fullness / headache] | DHI: __/100",
    "APTA vestibular guidelines; DHI (Jacobson & Newman, 1990); vestibular history"))
add(row("Oculomotor Assessment",
    "Smooth pursuit: __ [normal / saccadic / asymmetric] | Saccades: __ [accurate / dysmetric / slow] | VOR cancellation: __ | Convergence: __ [near point: __ cm] | Gaze stability: __ | Spontaneous nystagmus: __ [present: direction __ / absent] | Gaze-evoked nystagmus: __",
    "Vestibular oculomotor screening; VOMS (Mucha et al., 2014); oculomotor exam"))
add(row("Positional Testing (Dix-Hallpike / Roll Test)",
    "Dix-Hallpike R: __ [nystagmus: direction __ / latency: __ sec / duration: __ sec / fatigable: Y/N / vertigo: Y/N] | Dix-Hallpike L: __ | Supine Roll Test R: __ | Roll Test L: __ | Canal involved: __ [posterior / horizontal / anterior] | Side: __ [R / L] | BPPV variant: __ [canalithiasis / cupulolithiasis]",
    "Dix-Hallpike (Dix & Hallpike, 1952); supine roll test; BPPV clinical practice guideline"))
add(row("Balance — Vestibular Specific",
    "Romberg: __ [eyes open / eyes closed / foam] | Modified CTSIB: __ | Dynamic Gait Index (DGI): __/24 [<19 = fall risk] | Functional Gait Assessment (FGA): __/30 | ABC Scale: __/100 | Head thrust test: __ | Dynamic visual acuity: __",
    "CTSIB; DGI; FGA; ABC (Powell & Myers, 1995); vestibular balance assessment"))
add(row("Vestibular Treatment / CRM",
    "Canalith Repositioning Maneuver: __ [Epley / Semont / BBQ roll / log roll / Lempert / other: __] | Canal treated: __ | Side: __ | Response: __ [nystagmus resolved / decreased / unchanged / provoked] | Post-CRM nystagmus: __ | Post-CRM symptoms: __ | Post-CRM instructions: __",
    "Epley maneuver; BPPV CPG (Bhattacharyya et al., 2017); CRM protocols"))
add(row("Vestibular Rehabilitation Exercises",
    "Habituation exercises: __ [specific positions/movements: __] | Gaze stabilization: __ [VOR x1 / VOR x2 / frequency: __ / duration: __] | Balance training: __ [static / dynamic / dual-task / perturbation] | Substitution strategies: __ | Functional mobility training: __ | Home program: __",
    "Vestibular rehabilitation evidence; APTA vestibular CPG; Herdman & Clendaniel"))
add(row("Vestibular Outcome Measures",
    "DHI: baseline __/100 → current __/100 | ABC Scale: __ → __ | DGI: __ → __ | FGA: __ → __ | Symptom severity (VAS): __ → __ | Functional improvement: __",
    "DHI MCID=18; DGI; FGA; vestibular outcome measurement"))
add(table_end())
add(hr())

# Specialty 3: Pelvic Floor
add("""<h3>Pelvic Floor Rehabilitation Add-On</h3>
<p><strong>Applicable to:</strong> PT with pelvic floor specialization (CAPP-Pelvic certification)</p>
<p><strong>Setting:</strong> Outpatient pelvic health clinics, women's/men's health, urogynecology referrals</p>""")
add(table_start())
add(row("Pelvic Floor History",
    "Chief complaint: __ [urinary incontinence / fecal incontinence / pelvic organ prolapse / pelvic pain / dyspareunia / constipation / pre/postnatal / post-prostatectomy / other: __] | Onset: __ | Duration: __ | Obstetric history: G__ P__ | Delivery method: __ | Perineal trauma: __ | Surgical history: __ [hysterectomy / prolapse repair / prostatectomy / other: __]",
    "APTA pelvic health; ICS terminology; pelvic floor history"))
add(row("Bladder Diary / Voiding Log",
    "Frequency: __ voids/day | Nocturia: __ | Volume per void: __ mL | Fluid intake: __ mL/day | Incontinence episodes: __/day | Triggers: __ [cough / sneeze / lift / urgency / position change] | Pad use: __/day | Urgency severity: __/10 | ICIQ-SF: __/21",
    "ICS voiding diary; ICIQ-SF; bladder diary standards"))
add(row("Pelvic Floor Muscle Assessment",
    "External observation: __ [symmetry / perineal body position / scarring / skin integrity] | Internal exam: __ [tone: __ (hypertonus / normal / hypotonus) | strength: __ (Modified Oxford: __/5 OR Laycock PERFECT: P__ E__ R__ F__ E__ C__ T__) | endurance: __ sec hold | repetitions: __ | fast-twitch: __ | coordination: __ | trigger points: __ (location: __) | prolapse: __ (POP-Q: stage __)]",
    "ICS pelvic floor assessment; Modified Oxford Scale; PERFECT scheme (Laycock); POP-Q"))
add(row("Pelvic Floor EMG / Biofeedback",
    "Surface EMG: __ [resting tone: __ μV | peak contraction: __ μV | endurance: __ sec | relaxation: __ μV | coordination: __] | Biofeedback training: __ | Real-time ultrasound: __ | Perineometer: __ [peak: __ cmH2O]",
    "Biofeedback certification; surface EMG norms; RTUS; pelvic floor assessment"))
add(row("Pelvic Floor Interventions",
    "Interventions: __ [pelvic floor muscle training (Kegel) / biofeedback / manual therapy / visceral mobilization / scar mobilization / bladder retraining / urge suppression / behavioral strategies / electrical stimulation / dilator therapy / pessary management / core/hip strengthening / relaxation / other: __]",
    "APTA pelvic health CPG; ICS treatment guidelines; evidence-based pelvic rehab"))
add(row("Pelvic Floor Outcome Measures",
    "ICIQ-SF: __ → __ | Pelvic Floor Distress Inventory (PFDI-20): __ → __ | Pelvic Floor Impact Questionnaire (PFIQ-7): __ → __ | POPDI-6: __ | UDI-6: __ | CRADI-8: __ | Patient Global Impression of Improvement: __ | Pad test: __ → __ | Incontinence episodes: __ → __/day",
    "ICIQ-SF; PFDI-20; PFIQ-7; PGI-I; validated pelvic outcome tools"))
add(table_end())
add(hr())

# Specialty 4: Aquatic Therapy
add("""<h3>Aquatic Therapy Add-On</h3>
<p><strong>Applicable to:</strong> PT, OT with aquatic therapy training (ATRI certified)</p>
<p><strong>Setting:</strong> Aquatic therapy pools, rehabilitation facilities with therapeutic pools</p>""")
add(table_start())
add(row("Aquatic Therapy Screening / Precautions",
    "Aquatic therapy appropriate: Y/N | Contraindications screened: __ [open wounds / uncontrolled seizures / bowel/bladder incontinence / tracheostomy / infectious disease / cardiac instability / chlorine allergy / fear of water / other: __] | Precautions: __ | Pool access: __ [ramp / lift / stairs / zero-depth entry] | Water temperature: __°F | Depth: __ ft",
    "ATRI aquatic therapy guidelines; aquatic therapy contraindications; pool safety"))
add(row("Aquatic Interventions",
    "Interventions: __ [aquatic exercise / gait training in water / Bad Ragaz / Ai Chi / Watsu / Halliwick / resistance training / buoyancy-assisted ROM / aquatic plyometrics / balance training / relaxation / other: __] | Water depth: __ | Flotation devices: __ | Duration: __ min | Intensity: __ [RPE: __]",
    "ATRI; Aquatic Physical Therapy Section (APTA); aquatic intervention evidence"))
add(row("Aquatic-Specific Parameters",
    "Buoyancy utilization: __ [assisted / supported / resisted] | Hydrostatic pressure benefits: __ | Turbulence: __ [laminar / turbulent] | Speed of movement: __ | Viscosity resistance: __ | Thermotherapy: __ | Pool equipment: __ [noodles / kickboard / aqua gloves / ankle weights / other: __]",
    "Aquatic therapy principles; hydrodynamic properties; ATRI"))
add(row("Land-to-Water Carryover",
    "Skills addressed in water: __ | Land equivalent: __ | Carryover observed: __ | Progression plan from aquatic to land: __ | Aquatic-specific benefits: __ [pain reduction / weight-bearing reduction / increased ROM / improved balance / edema reduction]",
    "Aquatic therapy evidence; aquatic-to-land progression; functional carryover"))
add(table_end())
add(hr())

# Specialty 5: Wound Care
add("""<h3>Wound Care Add-On</h3>
<p><strong>Applicable to:</strong> PT with wound care certification (CWS, WCC, CLT), OT</p>
<p><strong>Setting:</strong> Inpatient, SNF, home health, outpatient wound care clinics</p>""")
add(table_start())
add(row("Wound Assessment",
    "Wound type: __ [pressure injury / diabetic ulcer / venous ulcer / arterial ulcer / surgical wound / traumatic wound / burn / other: __] | Location: __ | Stage/classification: __ [NPUAP stage: __ / Wagner grade: __ / CEAP: __] | Dimensions: length __ cm x width __ cm x depth __ cm | Area: __ cm² | Volume: __ cm³ | Undermining: __ [location (clock): __ / depth: __ cm] | Tunneling: __ [location: __ / depth: __ cm]",
    "NPUAP/EPUAP staging; Wagner classification; wound measurement standards"))
add(row("Wound Bed Assessment",
    "Wound bed tissue: __ [granulation: __% / epithelial: __% / slough: __% / eschar: __% / necrotic: __%] | Color: __ [red / pink / yellow / black / mixed] | Exudate: __ [type: serous / sanguineous / serosanguineous / purulent | amount: none / scant / small / moderate / large] | Odor: __ [none / faint / moderate / strong] | Periwound: __ [intact / macerated / erythematous / indurated / calloused]",
    "Wound bed assessment; TIME framework; Bates-Jensen Wound Assessment Tool"))
add(row("Wound Interventions",
    "Debridement: __ [type: sharp / enzymatic / autolytic / mechanical / biological] | Wound cleansing: __ [solution: __ | pressure: __] | Dressing: __ [primary: __ | secondary: __ | frequency: __] | Modalities: __ [electrical stimulation / ultrasound / NPWT / UV / pulsed lavage / whirlpool / laser / other: __] | Offloading: __ | Compression: __ | Positioning: __",
    "WOCN guidelines; wound care evidence; debridement indications; dressing selection"))
add(row("Wound Outcome Tracking",
    "Wound progression: __ [healing / stalled / deteriorating] | Size change: baseline __ cm² → current __ cm² | % reduction: __% | PUSH score: __ → __ | Bates-Jensen: __ → __ | Photography: Y/N | Healing trajectory: __ | Estimated time to closure: __",
    "PUSH tool; BWAT; wound healing trajectory; outcome tracking"))
add(row("Wound Prevention Education",
    "Risk factors addressed: __ | Skin inspection education: __ | Pressure relief: __ | Nutrition counseling referral: __ | Moisture management: __ | Offloading education: __ | Support surface recommendation: __ | Written instructions: Y/N",
    "NPUAP prevention guidelines; CMS pressure injury prevention; patient education"))
add(table_end())
add(hr())

# Specialty 6: Lymphedema
add("""<h3>Lymphedema Management Add-On</h3>
<p><strong>Applicable to:</strong> PT/OT with lymphedema certification (CLT — Certified Lymphedema Therapist)</p>
<p><strong>Setting:</strong> Outpatient lymphedema clinics, oncology rehabilitation, post-surgical</p>""")
add(table_start())
add(row("Lymphedema History",
    "Type: __ [primary / secondary] | Etiology: __ [post-surgical lymph node removal / radiation / infection / trauma / congenital / cancer-related / other: __] | Onset: __ | Duration: __ | Stage: __ [ISL Stage 0 (subclinical) / I (reversible) / II (spontaneously irreversible) / III (lymphostatic elephantiasis)] | Affected limb(s): __ | Prior treatment: __ | Compression history: __",
    "ISL staging; lymphedema classification; NLN guidelines"))
add(row("Circumferential Measurements",
    "Measurement method: __ [circumferential tape / perometry / bioimpedance / water displacement] | Landmarks: __ [every 4 cm from: __] | Involved limb: __ | Uninvolved limb: __ | Volume calculation: __ [truncated cone / perometer] | Involved volume: __ mL | Uninvolved volume: __ mL | Excess volume: __ mL | % difference: __%",
    "ISL measurement standards; circumferential measurement protocol; perometry"))
add(row("Skin / Tissue Assessment",
    "Skin condition: __ [intact / fragile / fibrotic / papillomatosis / lymphorrhea / cellulitis history] | Stemmer sign: __ [positive / negative] | Tissue texture: __ [soft / pitting / non-pitting / fibrotic / hardened] | Skin folds: __ | Fungal infection: Y/N | Wound/ulcer: Y/N [details: __] | Sensation: __",
    "ISL assessment; lymphedema skin assessment; CLT examination"))
add(row("Complete Decongestive Therapy (CDT)",
    "CDT phase: __ [intensive (reductive) / maintenance (self-management)] | Manual lymphatic drainage (MLD): __ [technique: Vodder / Földi / Casley-Smith / other: __] | Duration: __ min | Compression bandaging: __ [short-stretch / multi-layer / padding materials: __] | Decongestive exercises: __ | Skin care: __ | Self-management training: __",
    "ISL CDT guidelines; NLN position statements; CLT practice"))
add(row("Compression Garment",
    "Garment type: __ [sleeve / glove / gauntlet / stocking / pantyhose / custom / OTC] | Compression class: __ [I: 20-30 / II: 30-40 / III: 40-50 / IV: 50-60 mmHg] | Fit: __ [custom-measured / OTC-sized] | Measurements for fitting: __ | Wear schedule: __ | Donning/doffing ability: __ | Replacement schedule: __",
    "Compression garment standards; CLT fitting; lymphedema compression"))
add(row("Lymphedema Outcome Measures",
    "Volume change: __ [baseline: __ mL → current: __ mL | reduction: __ mL (___%)] | Circumference change at key landmarks: __ | Functional impact: __ | UE-FS (Upper Extremity Functional Scale): __ | LYMQOL: __ | Lymphedema Life Impact Scale: __ | Quality of life: __",
    "Lymphedema outcome measures; UE-FS; LYMQOL; volume tracking"))
add(table_end())
add(hr())

# Specialty 7: Sports Rehabilitation
add("""<h3>Sports Rehabilitation Add-On</h3>
<p><strong>Applicable to:</strong> PT with sports specialty (SCS — Sports Certified Specialist), OT</p>
<p><strong>Setting:</strong> Sports medicine clinics, athletic training rooms, return-to-sport programs</p>""")
add(table_start())
add(row("Sport-Specific History",
    "Sport: __ | Position: __ | Level: __ [recreational / high school / club / collegiate / professional / elite] | Season status: __ [pre-season / in-season / post-season / off-season] | Injury mechanism: __ | Playing surface: __ | Equipment involved: __ | Previous injuries to same area: __ | Prior surgeries: __ | Return-to-sport timeline expectations: __",
    "APTA Sports Section; sport-specific injury patterns; RTS guidelines"))
add(row("Sport-Specific Functional Testing",
    "Hop tests: __ [single hop: R __ / L __ cm (LSI: __%) | triple hop: R __ / L __ cm (LSI: __%) | crossover hop: R __ / L __ cm (LSI: __%) | timed hop: R __ / L __ sec (LSI: __%)] | Y-Balance: __ [anterior: R __ / L __ | posteromedial: R __ / L __ | posterolateral: R __ / L __ | composite: R __ / L __] | Vertical jump: __ in | Broad jump: __ in",
    "Hop test battery; Y-Balance (Plisky et al.); sport-specific functional testing"))
add(row("Agility / Speed Testing",
    "T-test: __ sec | Pro agility (5-10-5): __ sec | Illinois agility: __ sec | 40-yard dash: __ sec | 10-yard sprint: __ sec | Shuttle run: __ | Change of direction: __ | Sport-specific agility drills: __",
    "Agility testing norms; speed assessment; sport-specific demands"))
add(row("Strength / Power Testing",
    "Isokinetic testing: __ [quad peak torque: __ Nm at __°/sec | hamstring peak torque: __ Nm | H:Q ratio: __ | Involved/uninvolved: __%] | 1RM testing: __ [squat: __ lbs | bench: __ lbs | deadlift: __ lbs] | Power: __ [vertical jump: __ | med ball throw: __ | other: __]",
    "Isokinetic norms; 1RM testing; sport-specific strength"))
add(row("Movement Quality Assessment",
    "FMS (Functional Movement Screen): __/21 | Individual movements: __ [deep squat: __ | hurdle step: R __ L __ | inline lunge: R __ L __ | shoulder mobility: R __ L __ | active SLR: R __ L __ | trunk stability push-up: __ | rotary stability: R __ L __] | Pain with movements: __ | Asymmetries: __ | Movement compensations: __",
    "FMS (Cook et al.); movement screening; injury risk prediction"))
add(row("Return-to-Sport Progression",
    "Current RTS phase: __ [phase __ of __] | Criteria for current phase: __ [met / not met] | Activities in current phase: __ | Next phase criteria: __ | Sport-specific drills completed: __ | Full-contact clearance: __ | Practice participation: __ [non-contact / limited contact / full contact] | Game clearance: __",
    "RTS criteria; sport-specific progression; graduated return-to-play"))
add(row("Concussion Protocol (if applicable)",
    "Concussion history: __ [number: __ | most recent: __] | Current step: __ [1: symptom-limited activity | 2: light aerobic | 3: sport-specific | 4: non-contact drills | 5: full-contact practice | 6: return to competition] | Symptoms at current step: __ | SCAT5: __ | ImPACT: __ [baseline: __ / current: __] | VOMS: __ | King-Devick: __",
    "Berlin Concussion Consensus (2017); SCAT5; ImPACT; graduated return-to-play"))
add(row("Injury Prevention Program",
    "Prevention program: __ [FIFA 11+ / PEP program / ITAR / Sportsmetrics / Nordic hamstring / other: __] | Risk factors identified: __ | Neuromuscular training: __ | Landing mechanics: __ | Cutting mechanics: __ | Fatigue management: __ | Load monitoring: __ | Training volume: __",
    "FIFA 11