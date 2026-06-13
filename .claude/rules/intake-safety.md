---
description: Intake conversation safety rules — crisis detection and legal guardrails
globs: ["src/app/api/intake/**", "src/components/intake/**", "src/lib/llm/prompts/intake.ts"]
alwaysApply: false
---

## Crisis detection

Crisis/distress language must be caught **before** any LLM turn is processed. The API route checks the LLM response for `{"action":"crisis_handoff"}` and returns that immediately — the conversation stops. Do not add retry logic, do not log the distress content, do not pass it downstream.

The `ConversationalIntake` component must render the hardcoded crisis resource block (988, Crisis Text Line) when it receives `action: crisis_handoff`. This block must never be LLM-generated.

## Legal advice

Never add code that generates legal interpretations, severance assessments, or WARN Act eligibility determinations. Route to Sugar Law (https://sugarlaw.org). If expanding the intake prompt, add the no-legal-advice rule explicitly.

## Data visibility

Intake responses are organizer-only. The `intakes` table has RLS enforced at the database level. Do not add any client-side fetch of intake data, even in organizer views — always use the server client.
