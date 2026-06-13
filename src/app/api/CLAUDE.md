# src/app/api/CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) for the `src/app/api/` directory.

> **Context pressure:** This is a leaf-level context for API routes. Load `src/lib/llm/CLAUDE.md` for LLM work, `src/lib/matching/CLAUDE.md` for matching work, or `src/lib/mattermost/CLAUDE.md` for Mattermost work.

## Endpoints

### `POST /api/intake`

Edge Function — stateless by design. On each turn:

1. Receives full conversation state in the request body (not from session)
2. Runs crisis-distress pre-check via `lib/llm/` — if triggered, returns hardcoded handoff message and halts
3. Calls the intake prompt via `lib/llm/` and returns the next question
4. On turn 5 (final), saves full transcript + Claude-extracted structure (`{employer, role, needs, offers}`) + embedding to `intakes` table

Never persists mid-conversation. Never streams to any external store during the flow.

### `POST /api/match`

Reads `intakes` embeddings, runs pgvector similarity against open pods via `lib/matching/`, returns ranked proposals. Writes proposals with `status = 'pending_confirmation'` — not delivered to members until a facilitator confirms.

### `POST /api/pods`

Creates a pod: inserts `pods` + `pod_memberships`, then calls `lib/mattermost/` to create the channel, generate the Jitsi link, send the facilitator brief DM, and send welcome DMs to each member.

### `POST /api/pods/[id]/confirm`

**Human gate.** Facilitator-only. Transitions a pending proposal to confirmed, then triggers pod instantiation (calls `POST /api/pods` internally). No AI output reaches members before this endpoint fires.

## Auth pattern

All routes use the Supabase server client (cookie session). Organizer-only routes additionally verify the `organizer` role from JWT claims before proceeding. The intake route is unauthenticated (public).
