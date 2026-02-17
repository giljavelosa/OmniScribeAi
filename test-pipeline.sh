#!/bin/bash
set -e

BASE_URL="http://localhost:3000"
RESULTS_DIR="/home/omniscribe/OmniScribe/test-results"
mkdir -p "$RESULTS_DIR"

TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Transcript A - PT Eval
echo "=== Testing Transcript A: PT Eval ==="
curl -s -X POST "$BASE_URL/api/generate-note" \
  -H "Content-Type: application/json" \
  -d '{
    "transcript": "This is a PT initial evaluation for Robert Johnson, a 45-year-old male electrician presenting with low back pain for 2 weeks. Pain is 7 out of 10, worse with bending and lifting at work. Lumbar flexion is limited to 30 degrees with pain. Straight leg raise is positive on the right at 40 degrees. Everything else in the lumbar ROM is within normal limits. Hip ROM was not assessed today. No prior imaging. He takes ibuprofen as needed.",
    "frameworkId": "rehab-pt-eval",
    "useMock": false
  }' | python3 -m json.tool > "$RESULTS_DIR/transcript_a_${TIMESTAMP}.json" 2>/dev/null || \
curl -s -X POST "$BASE_URL/api/generate-note" \
  -H "Content-Type: application/json" \
  -d '{
    "transcript": "This is a PT initial evaluation for Robert Johnson, a 45-year-old male electrician presenting with low back pain for 2 weeks. Pain is 7 out of 10, worse with bending and lifting at work. Lumbar flexion is limited to 30 degrees with pain. Straight leg raise is positive on the right at 40 degrees. Everything else in the lumbar ROM is within normal limits. Hip ROM was not assessed today. No prior imaging. He takes ibuprofen as needed.",
    "frameworkId": "rehab-pt-eval",
    "useMock": false
  }' > "$RESULTS_DIR/transcript_a_${TIMESTAMP}.json"
echo "Saved to transcript_a_${TIMESTAMP}.json"

# Transcript B - SOAP Follow-up
echo "=== Testing Transcript B: SOAP Follow-up ==="
curl -s -X POST "$BASE_URL/api/generate-note" \
  -H "Content-Type: application/json" \
  -d '{
    "transcript": "Follow-up for Maria Garcia, she is doing much better. Pain went from 7 to 4 out of 10. Lumbar flexion improved to 50 degrees. Continue current plan.",
    "frameworkId": "med-soap-followup",
    "useMock": false
  }' | python3 -m json.tool > "$RESULTS_DIR/transcript_b_${TIMESTAMP}.json" 2>/dev/null || \
curl -s -X POST "$BASE_URL/api/generate-note" \
  -H "Content-Type: application/json" \
  -d '{
    "transcript": "Follow-up for Maria Garcia, she is doing much better. Pain went from 7 to 4 out of 10. Lumbar flexion improved to 50 degrees. Continue current plan.",
    "frameworkId": "med-soap-followup",
    "useMock": false
  }' > "$RESULTS_DIR/transcript_b_${TIMESTAMP}.json"
echo "Saved to transcript_b_${TIMESTAMP}.json"

# Transcript C - BH Intake
echo "=== Testing Transcript C: BH Intake ==="
curl -s -X POST "$BASE_URL/api/generate-note" \
  -H "Content-Type: application/json" \
  -d '{
    "transcript": "Initial intake for David Park, 32-year-old software engineer referred by his PCP for anxiety. He reports difficulty sleeping for the past 3 months and feeling overwhelmed at work. No prior mental health treatment. Denies suicidal ideation. No substance use.",
    "frameworkId": "bh-intake",
    "useMock": false
  }' | python3 -m json.tool > "$RESULTS_DIR/transcript_c_${TIMESTAMP}.json" 2>/dev/null || \
curl -s -X POST "$BASE_URL/api/generate-note" \
  -H "Content-Type: application/json" \
  -d '{
    "transcript": "Initial intake for David Park, 32-year-old software engineer referred by his PCP for anxiety. He reports difficulty sleeping for the past 3 months and feeling overwhelmed at work. No prior mental health treatment. Denies suicidal ideation. No substance use.",
    "frameworkId": "bh-intake",
    "useMock": false
  }' > "$RESULTS_DIR/transcript_c_${TIMESTAMP}.json"
echo "Saved to transcript_c_${TIMESTAMP}.json"

echo ""
echo "=== All tests complete ==="
echo "Results in: $RESULTS_DIR"
echo "Timestamp: $TIMESTAMP"

# Quick hallucination check
echo ""
echo "=== Quick Hallucination Check ==="

echo "--- Transcript A: Checking for 'electrician' vs wrong occupation ---"
if grep -qi "farmer\|construction\|teacher\|plumber\|mechanic" "$RESULTS_DIR/transcript_a_${TIMESTAMP}.json" 2>/dev/null; then
  echo "❌ HALLUCINATION: Wrong occupation found in Transcript A!"
  grep -oi "farmer\|construction\|teacher\|plumber\|mechanic" "$RESULTS_DIR/transcript_a_${TIMESTAMP}.json"
else
  echo "✅ No wrong occupation hallucinated"
fi

echo "--- Transcript A: Checking for hallucinated vitals ---"
if grep -qi "blood pressure\|heart rate\|temperature\|respiratory rate\|BMI" "$RESULTS_DIR/transcript_a_${TIMESTAMP}.json" | grep -vi "___\|not_documented\|null" 2>/dev/null; then
  echo "⚠️  Vitals mentioned - checking if properly blanked..."
else
  echo "✅ No hallucinated vitals with values"
fi

echo "--- Transcript C: Checking occupation ---"
if grep -qi "software engineer" "$RESULTS_DIR/transcript_c_${TIMESTAMP}.json"; then
  echo "✅ Correct occupation (software engineer) found"
else
  echo "❌ Occupation 'software engineer' not found!"
fi

echo ""
echo "Timestamp for re-testing: $TIMESTAMP"
