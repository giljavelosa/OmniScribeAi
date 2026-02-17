# Hallucination Analysis — Pre-Fix Baseline
**Date:** 2026-02-12
**Test Run:** 20260212_185724

## Overall Assessment
The current pipeline performs **very well** — no major hallucinations detected across all 3 transcripts. Temperature is already set to 0, and the two-pass approach (fact extraction → note rendering) is effective.

## Transcript A — PT Eval (Robert Johnson)

### Facts in Note vs Transcript
| Fact in Note | In Transcript? | Status |
|---|---|---|
| Robert Johnson | ✅ Yes | ACCURATE |
| 45-year-old male | ✅ Yes | ACCURATE |
| electrician | ✅ Yes | ACCURATE |
| low back pain for 2 weeks | ✅ Yes | ACCURATE |
| worse with bending and lifting at work | ✅ Yes | ACCURATE |
| Lumbar flexion limited to 30 degrees with pain | ✅ Yes | ACCURATE |
| SLR positive on the right at 40 degrees | ✅ Yes | ACCURATE |
| Everything else in lumbar ROM WNL | ✅ Yes | ACCURATE |
| Hip ROM not assessed today | ✅ Yes | ACCURATE |
| No prior imaging | ✅ Yes | ACCURATE |
| Ibuprofen as needed | ✅ Yes | ACCURATE |
| All ___ blanks for undocumented items | ✅ Correct | ACCURATE |

**Accuracy: 100%** (12/12 facts correct, 0 hallucinations)

### Minor Issues
- "Hip ROM was not assessed today" appears in Active ROM section but not as a separate note — acceptable

## Transcript B — SOAP Follow-up (Maria Garcia)

### Facts in Note vs Transcript
| Fact in Note | In Transcript? | Status |
|---|---|---|
| Maria Garcia | ✅ Yes (in extractedFacts) | ACCURATE |
| Pain went from 7 to 4 out of 10 | ✅ Yes | ACCURATE |
| Lumbar flexion improved to 50 degrees | ✅ Yes | ACCURATE |
| Doing much better | ✅ Yes | ACCURATE |
| Continue current plan | ✅ Yes | ACCURATE |
| All ___ blanks for undocumented items | ✅ Correct | ACCURATE |

**Accuracy: 100%** (6/6 facts correct, 0 hallucinations)

### Minor Issues
- Patient name not prominently shown in note sections (only in extractedFacts)
- No hallucinated vitals, medications, or diagnoses

## Transcript C — BH Intake (David Park)

### Facts in Note vs Transcript
| Fact in Note | In Transcript? | Status |
|---|---|---|
| David Park | ✅ Yes | ACCURATE |
| 32-year-old | ✅ Yes | ACCURATE |
| software engineer | ✅ Yes | ACCURATE |
| referred by PCP | ✅ Yes | ACCURATE |
| anxiety | ✅ Yes | ACCURATE |
| difficulty sleeping for past 3 months | ✅ Yes | ACCURATE |
| feeling overwhelmed at work | ✅ Yes | ACCURATE |
| No prior mental health treatment | ✅ Yes | ACCURATE |
| Denies suicidal ideation | ✅ Yes | ACCURATE |
| No substance use | ✅ Yes | ACCURATE |
| All ___ blanks for undocumented items | ✅ Correct | ACCURATE |

**Accuracy: 100%** (11/11 facts correct, 0 hallucinations)

### Minor Issues
- "No substance use" mapped only to "other_substances" — ideally should apply to all substance categories
- Employment/Education in Social History shows ___ despite occupation being captured in demographics
- No hallucinated PHQ-9, GAD-7, marital status, or other invented data

## Summary

| Transcript | Facts | Correct | Hallucinated | Accuracy |
|---|---|---|---|---|
| A (PT Eval) | 12 | 12 | 0 | 100% |
| B (SOAP Follow-up) | 6 | 6 | 0 | 100% |
| C (BH Intake) | 11 | 11 | 0 | 100% |
| **Total** | **29** | **29** | **0** | **100%** |

## Hallucination Patterns
**None detected.** The current pipeline correctly:
1. Extracts only stated facts with "transcript" source
2. Marks undocumented items as null/"not_documented"
3. Renders null values as "___" in the final note
4. Does NOT invent vitals, ROM values, test scores, or demographics

## Recommended Improvements (Minor)
1. Add "no substance use" to all substance subcategories when globally denied
2. Ensure patient name appears in note body (not just extractedFacts)
3. Cross-reference demographics between sections (occupation in social history)
4. Consider adding Pass 3 hallucination audit as a safety net for edge cases
