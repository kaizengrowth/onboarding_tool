# src/lib/matching/CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) for the `src/lib/matching/` directory.

> **Context pressure:** This is a leaf-level context. For the API endpoint that invokes matching, see `src/app/api/CLAUDE.md`.

## Algorithm

Priority order: **cohort > craft > region > layoff stage**

1. Embed the member's intake via `lib/llm/` (embedding endpoint, same provider abstraction)
2. Run pgvector similarity (`<->`) via `lib/supabase/` RPC against pods where `status = 'open'` and `pod_memberships.count < 6`
3. Apply priority boosts: same `cohort_id` → highest boost; same `craft` → second; same `region` → third; same layoff stage → fourth
4. Pass the top-3 candidates to `lib/llm/` to generate a human-readable match rationale per candidate (facilitator-facing only, never shown to members)
5. Write results as proposals: `status = 'pending_confirmation'`, one row per candidate

## Human gate

This module only writes proposals. It never writes to `pod_memberships`. The only path from proposal to confirmed pod is a facilitator calling `POST /api/pods/[id]/confirm`. Do not add any shortcut or auto-confirm path.

## What a proposal contains

- `member_id`, `pod_id`, `score` (similarity + boost), `rationale` (LLM-generated, organizer-only), `status = 'pending_confirmation'`, `created_at`
