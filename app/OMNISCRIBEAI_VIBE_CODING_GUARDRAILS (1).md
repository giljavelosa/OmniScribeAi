# OmniScribeAI Vibe Coding Guardrails Prompt

Use this file as the master prompt and project-rules document for any coding assistant working on OmniScribeAI.

## Mission
You are working on OmniScribeAI, a medical scribe application. Reliability, safety, auditability, and maintainability are more important than speed.

You must optimize for:
- no silent failures
- no silent data corruption
- no PHI leakage
- no accidental architecture drift
- no uncontrolled dependencies
- no broad refactors unless explicitly requested
- copy-paste-ready full file outputs for every changed file

## Product context
OmniScribeAI is a medical-scribe workflow. Dangerous failure modes include:
- partial transcript or missing chunk being treated as complete
- malformed or truncated LLM JSON being treated as valid
- notes generated from incomplete or invalid upstream data
- PHI leaking into logs, telemetry, analytics, client storage, or error traces
- expensive retry loops causing cost blowups
- broad AI-generated edits that change unrelated behavior

## Absolute non-negotiables
1. No silent success.
   - If any required stage fails, the run is not a success.
   - Never return success when required data is missing, invalid, partial, or unverified.

2. No note generation from incomplete input.
   - If transcript completeness, validation, or required stage checks fail, block downstream note generation.

3. All structured LLM output is untrusted until schema-validated.
   - Parsing JSON is not enough.
   - Validate every structured output against a schema before use.

4. PHI-safe logging only.
   - Do not log raw transcript text, note text, patient identifiers, or other PHI in standard logs.
   - If raw payload retention is necessary for debugging, store it only in a restricted debug vault with limited access and retention.

5. Full-file output is mandatory.
   - When changing a file, output the complete final contents of that file.
   - Do not ask the user to find line numbers or patch snippets manually.
   - Do not say "change line X" or "update this block". Provide the full replacement file.

6. Stay tightly scoped.
   - Make the smallest safe change that solves the task.
   - Do not refactor unrelated code.
   - Do not rename files, move modules, or change architecture unless requested or required for correctness.

7. UI must never call vendors directly.
   - No direct LLM, transcription, or external vendor calls from `src/app/` or `src/components/`.
   - Vendor access goes through approved server-side wrappers.

8. Every LLM stage must have a matching schema.
   - If a stage produces structured output, that stage must have a corresponding schema file.

9. Clinician review is final.
   - Generated notes are drafts until clinician review is complete.
   - Preserve traceability and auditability.

10. Do not hide uncertainty.
   - Explicitly list assumptions, risks, and validation gaps.
   - If something is missing, say exactly what is missing.

## Required repository boundaries
Use or preserve a structure equivalent to this:

```text
src/
  app/                       # Next.js routes and server components
  components/                # shared UI only, no business logic
  features/
    encounters/
    templates/
    users/
  pipeline/
    contracts/               # PipelineRun, StageResult, typed errors
    stages/                  # transcribe, diarize, chunk, extract, note-gen
    orchestrators/           # runEncounterPipeline and similar flows
    storage/                 # artifact persistence and references
  schemas/
    llm/                     # Zod or equivalent schemas for LLM outputs
    api/                     # API request and response validation
  server/
    db/                      # database access
    auth/                    # authentication and authorization helpers
    audit/                   # audit logging
    vendors/                 # provider wrappers for OpenAI, Groq, etc.
  lib/
    logging/                 # PHI-safe logger only
    config/
    utils/                   # only truly generic utilities
tests/
  pipeline/
  api/
docs/
  ARCHITECTURE.md
  RUNBOOK.md
  DECISIONS.md
```

## Architecture rules
- `src/app/` and `src/components/` must not contain pipeline orchestration or vendor calls.
- `src/pipeline/contracts/` contains the canonical pipeline result and error types.
- `src/pipeline/stages/` contains stage-specific execution logic only.
- `src/pipeline/orchestrators/` coordinates stage order, retry policy, gating, and final status.
- `src/schemas/llm/` contains every schema for structured AI output.
- `src/server/vendors/` contains all external provider wrappers.
- `src/lib/logging/` must enforce PHI-safe logging.
- Avoid dumping logic into `utils.ts`, `helpers.ts`, or generic `services/` files.
- Do not duplicate result types, schema shapes, or error enums across the codebase.

## Canonical pipeline contract
Every pipeline run must produce one canonical contract. Use names that fit the codebase, but preserve the behavior below.

### Required status model
- `SUCCESS` = every required stage passed and all required validations passed
- `PARTIAL` = some recoverable or non-terminal stage issue exists, but not enough to call the run complete
- `FAILED` = one or more required stages failed, validation failed, or downstream generation must be blocked

### Required pipeline fields
At minimum, track:
- `runId`
- `status`
- `startedAt`
- `completedAt`
- `stages[]` with per-stage status, timing, retry count, and retryability
- `errors[]` with typed error codes, stage, safe metadata, and human-readable message
- `artifacts` containing only validated artifact references
- `completeness` or equivalent gating signal for transcript and note readiness

### Required stage behavior
Every stage must:
- return a typed success or typed failure
- expose retryability
- record duration and attempt count
- never swallow exceptions into empty defaults
- never mutate downstream state if its own output is invalid

## Error handling rules
Never use this pattern for meaningful failures:
- catch error and return empty object
- catch error and return empty list
- catch error and set `success: true`
- catch error and continue as if the stage passed

Instead:
- return a typed failure object or throw an error that is captured into the pipeline contract
- include a stable error code
- include stage name
- include safe metadata only
- propagate failure so the UI can show an actionable state

## LLM and structured-output rules
For every LLM call that returns structure:
1. request structured output if the provider supports it
2. parse the response
3. schema-validate the response
4. reject invalid output
5. mark the stage failed with a schema-related error code
6. store raw output only in a protected debug store if needed
7. never silently auto-repair without traceability

If you implement repair logic:
- it must be explicit
- it must be logged safely
- it must mark provenance clearly
- it must not pretend the original output was valid

## PHI and compliance rules
- Do not place PHI in standard logs, analytics events, telemetry payloads, browser storage, console logs, or third-party monitoring by default.
- Do not send PHI to any vendor wrapper unless that vendor is approved for the product's compliance posture.
- Do not include PHI in thrown error messages that may surface in logs.
- Prefer internal IDs, correlation IDs, counters, status codes, token counts, timings, and artifact references.
- Audit trails should track who generated, reviewed, modified, and finalized clinical drafts.

## Cost and retry guardrails
Every pipeline path should support limits such as:
- max tokens per stage
- max retries per stage
- max audio minutes per run
- max total stages per run
- timeout thresholds per vendor or stage

On budget or retry exhaustion:
- fail loudly with a specific code
- stop repeated loops
- show the user a clear message
- do not keep retrying indefinitely

## Required development workflow for every task
Follow this order unless the user explicitly asks for something different:

1. Restate the task in one sentence.
2. List assumptions.
3. List the exact files to create or modify.
4. Explain the smallest safe plan.
5. Implement the minimal change.
6. Output the complete contents of every changed file.
7. Add or update tests.
8. Provide verification steps and commands.
9. List any risks, migration notes, or follow-up items.

## Output format rules
Your response must be organized exactly like this unless the user asks for another format:

### 1. Task summary
- one short paragraph

### 2. Assumptions
- bullet list

### 3. Files changed
- full file paths only

### 4. Full file contents
- for each file, output the entire file contents
- no partial diffs unless explicitly requested

### 5. Tests
- what was added or updated
- include full test files if changed

### 6. Verification
- exact commands to run
- exact UI path or click path when relevant

### 7. Risks and follow-up
- only meaningful items

## User-experience and instruction rules
- Do not make the user hunt for where to click.
- If a UI step is needed, specify the exact screen, section, button, and expected result.
- If a file must be created, give the exact file path and complete file contents.
- If imports change, provide the final import block in the full file.
- If environment variables are required, list them explicitly with exact names and purpose.
- If a migration is required, provide the exact command and where to run it.

## Definition of done
A task is not done unless all applicable items below are satisfied:
- spec or acceptance criteria updated when behavior changes
- schema validation exists for structured AI output
- no silent fallback introduced
- tests cover malformed JSON or invalid structured output when relevant
- tests cover missing chunk, partial transcript, or incomplete upstream data when relevant
- PHI-safe logging preserved
- note generation is blocked on invalid upstream data
- dependencies remain controlled
- verification steps are provided
- changed files are returned in full

## Dependency rules
- Do not add a new dependency unless it is clearly justified.
- Prefer existing platform or framework features first.
- If adding a dependency, explain:
  - why it is needed
  - why current code cannot handle it safely
  - maintenance and security impact
- Never trust hallucinated packages.
- Verify package existence and suitability before using it.

## Documentation rules
When architectural or operational behavior changes, update the relevant docs:
- `docs/ARCHITECTURE.md` for system design and boundaries
- `docs/DECISIONS.md` for important design choices
- `docs/RUNBOOK.md` for debugging, operations, and recovery steps

## Required tests by default
Unless clearly irrelevant, new pipeline work should include tests for:
- malformed or truncated LLM JSON
- schema validation failure
- partial transcript or missing chunk
- retry exhaustion
- budget cap behavior
- blocked note generation after upstream failure
- PHI-safe logging behavior where testable

## Review checklist
Before approving any change, verify all of the following:
- Is any failure being hidden behind an empty default?
- Can invalid structured output reach business logic?
- Can the UI generate a note after partial or failed upstream stages?
- Is any PHI entering logs or analytics?
- Did the change add an unnecessary dependency?
- Did the change modify unrelated files?
- Did the assistant provide full-file outputs?
- Are the tests meaningful and aligned with the failure modes?

## Master implementation prompt
Paste the section below into a coding agent when you want the assistant to perform work under these rules.

```text
You are coding inside OmniScribeAI, a medical scribe application. Reliability, PHI safety, auditability, and maintainability matter more than speed.

Follow these mandatory rules:
1. No silent failures.
2. No note generation from incomplete or invalid upstream data.
3. All structured LLM outputs must be schema-validated before use.
4. No PHI in standard logs, analytics, console logs, or client storage.
5. Use minimal diffs only. Do not refactor unrelated code.
6. UI must never call vendors directly.
7. Every changed file must be returned in full. Do not ask me to find line numbers or patch snippets.
8. List assumptions, exact file paths, tests, verification steps, and risks.
9. Preserve or improve repository boundaries around `src/pipeline`, `src/schemas`, `src/server/vendors`, and `src/lib/logging`.
10. If a required stage fails, the pipeline must fail loudly through a canonical run contract with stage-level status and typed errors.

Required response format:
1. Task summary
2. Assumptions
3. Files changed
4. Full file contents
5. Tests
6. Verification
7. Risks and follow-up

Task:
[PASTE TASK HERE]
```

## Architect prompt template
Use this when you want the assistant to design before coding.

```text
Design a change for OmniScribeAI.

Output:
1. Mini-spec
2. Assumptions
3. Files likely to change
4. Pipeline contract impact
5. Failure modes
6. PHI and logging considerations
7. Tests to add
8. Minimal implementation plan

Constraints:
- no silent failures
- no PHI in standard logs
- all structured outputs validated by schema
- minimal diff only
- preserve repository boundaries

Change request:
[PASTE CHANGE REQUEST HERE]
```

## Coder prompt template
Use this when you want implementation-ready output.

```text
Implement this change in OmniScribeAI.

Hard requirements:
- return the complete contents of every changed file
- do not output line-based patches
- do not swallow errors
- use schema validation for all structured AI output involved in this task
- keep the change tightly scoped
- add or update meaningful tests
- preserve PHI-safe logging
- do not add new dependencies unless explicitly justified

Required response format:
1. Task summary
2. Assumptions
3. Files changed
4. Full file contents
5. Tests
6. Verification
7. Risks and follow-up

Task:
[PASTE TASK HERE]
```

## Reviewer prompt template
Use this when you want a review pass.

```text
Review this OmniScribeAI change.

Check for:
- silent failures
- invalid structured outputs reaching business logic
- missing schema validation
- PHI leakage in logs or analytics
- uncontrolled retries or cost blowups
- note generation allowed after upstream failure
- unnecessary dependencies
- unrelated file churn
- weak or missing tests

Output:
1. Must-fix issues
2. Should-fix issues
3. Passed checks
4. Approval decision: approve or reject

Change to review:
[PASTE CHANGE HERE]
```

## Final instruction to the coding assistant
When in doubt, choose the safer path, the smaller change, and the more explicit failure mode.
