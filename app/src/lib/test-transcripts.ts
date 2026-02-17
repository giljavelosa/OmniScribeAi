export const testTranscripts = {
  transcriptA: {
    id: "transcript-a",
    label: "Brief PT Eval - Robert Johnson",
    frameworkId: "rehab-pt-eval",
    text: "This is a PT initial evaluation for Robert Johnson, a 45-year-old male electrician presenting with low back pain for 2 weeks. Pain is 7 out of 10, worse with bending and lifting at work. Lumbar flexion is limited to 30 degrees with pain. Straight leg raise is positive on the right at 40 degrees. Everything else in the lumbar ROM is within normal limits. Hip ROM was not assessed today. No prior imaging. He takes ibuprofen as needed.",
    expectedFacts: {
      name: "Robert Johnson",
      age: "45",
      gender: "male",
      occupation: "electrician",
      pain: "7/10",
      lumbarFlexion: "30 degrees",
      slr: "positive on the right at 40 degrees",
      otherLumbarROM: "within normal limits",
      hipROM: "not assessed",
      imaging: "no prior imaging",
      medications: "ibuprofen as needed"
    },
    shouldNotAppear: ["farmer", "construction worker", "teacher", "blood pressure", "heart rate", "temperature", "grip strength", "balance", "gait analysis", "Berg Balance"]
  },
  transcriptB: {
    id: "transcript-b",
    label: "Brief SOAP Follow-up - Maria Garcia",
    frameworkId: "med-soap-followup",
    text: "Follow-up for Maria Garcia, she's doing much better. Pain went from 7 to 4 out of 10. Lumbar flexion improved to 50 degrees. Continue current plan.",
    expectedFacts: {
      name: "Maria Garcia",
      pain: "4/10",
      previousPain: "7/10",
      lumbarFlexion: "50 degrees"
    },
    shouldNotAppear: ["blood pressure", "heart rate", "temperature", "weight", "BMI", "respiratory rate"]
  },
  transcriptC: {
    id: "transcript-c",
    label: "BH Intake - David Park",
    frameworkId: "bh-intake",
    text: "Initial intake for David Park, 32-year-old software engineer referred by his PCP for anxiety. He reports difficulty sleeping for the past 3 months and feeling overwhelmed at work. No prior mental health treatment. Denies suicidal ideation. No substance use.",
    expectedFacts: {
      name: "David Park",
      age: "32",
      occupation: "software engineer",
      referralSource: "PCP",
      chiefComplaint: "anxiety",
      sleep: "difficulty sleeping for 3 months",
      workStress: "feeling overwhelmed at work",
      priorMHTreatment: "none",
      si: "denies",
      substanceUse: "no"
    },
    shouldNotAppear: ["married", "divorced", "children", "alcohol use", "PHQ-9 score", "GAD-7 score", "Beck Depression", "trauma history"]
  }
};
