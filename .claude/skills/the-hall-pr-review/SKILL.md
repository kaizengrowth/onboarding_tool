---
name: the-hall-pr-review
description: The Hall's PR review checklist. Run before every /ship — checks CLAUDE.md conventions, human-gate integrity, RLS enforcement, LLM abstraction boundary, AAA accessibility, and the 6-phase gate.
---

# the-hall-pr-review

Project-specific PR review checklist. Run this before `/ship`. Any hard block must be resolved before merge.

## Hard blocks — will not merge

- [ ] LLM SDK called directly from feature code (must go through `src/lib/llm/` only)
- [ ] Intake data readable without `organizer` role (RLS must enforce, not just UI)
- [ ] Any AI match output delivered to a member without facilitator confirmation
- [ ] Mattermost bot token used to read member messages
- [ ] Legal advice given in any UI string, error message, or AI prompt
- [ ] `ladder_rung` updated from client-side code
- [ ] Crisis handoff message is AI-generated (must be hardcoded)
- [ ] New wing (study, build, interview, hiring hall) opened with UI before facilitator capacity decision
- [ ] Any WCAG AAA violation — contrast, keyboard nav, ARIA, motion

## Soft checks — flag, don't block

- [ ] Pod template logic is in a single config object (not branching conditionals)
- [ ] Jitsi link constructed as `meet.jit.si/<pod_id>-<session_slug>` (no external call)
- [ ] Magic-link auth only — no password fields added
- [ ] pgvector queries use raw SQL via Supabase RPC, not ORM
- [ ] Service-role Supabase client not used in a user-input code path without justification in the PR description

## 6-phase gate

- [ ] `npm run build` passes
- [ ] `npm run type-check` passes (strict, no implicit any)
- [ ] `npm run lint` passes
- [ ] Tests pass (Vitest + Playwright)
- [ ] security-officer skill clean
- [ ] Diff ≤ 400 lines
