# CLAUDE.md

## Project

**The Hall — What We Will Community Platform.** A worker-led platform that absorbs people in the aftermath of layoffs: engages their questions, builds peer community, supports exploration of next steps, generates hiring evidence through preparation, grounds vouching, and routes members into building next systems together.

**Stack:** Next.js · Supabase (Postgres + pgvector + magic-link auth) · Vercel · Mattermost (chat.wwwrise.org) · Jitsi · Claude API (OpenAI-compatible abstraction so the model can swap to llama.cpp on owned hardware)

**Three primitives — everything is built from these:**

1. **The Ladder** — every member has one visible journey position and exactly one suggested next step: `Arrived → Supported → In a pod → Contributing → Trained → Facilitating → Leading`
2. **The Pod** — 3–6 members + template (`support | study | build | interview | action`) + facilitator + Jitsi ritual + auto-created Mattermost channel
3. **Evidence & Standing** — one reputation across all wings: `evidence_record` (emitted by sessions), `vouch` (scarce, staked, falsifiable), `standing` (participation + ethics; no per-feature points, no member-vs-member leaderboards)

**Day 1 scope:**
- Public crisis front door (resources visible before signup: WARN rights, unemployment, COBRA, AI Dividend, emotional support)
- Claude-powered 5-question conversational intake → organizer-only data store
- Pod matching engine (cohort > craft > region > layoff stage); Claude proposes, facilitator confirms, member never sees unconfirmed match
- Pod instantiation: Mattermost channel + Jitsi link + facilitator brief + welcome DM with ladder position
- Member ladder profile + organizer absorption dashboard
- Schema stubs only (no UI): `evidence_records`, `vouches`, `standing`

## Commands

```bash
npm run dev        # start Next.js dev server
npm run build      # production build
npm run lint       # ESLint
npm run type-check  # tsc --noEmit
```

Supabase local dev:
```bash
supabase start     # spin up local Postgres + Studio
supabase db push   # apply migrations
supabase gen types typescript --local > types/supabase.ts
```

## Architecture

**Data model (Supabase/Postgres + pgvector):**
```
members          id, name, contact, region, craft, cohort_id, ladder_rung, created_at
cohorts          employer, rif_date, source (WARN filing ref)
intakes          member_id, raw_conversation, extracted {employer,role,needs,offers}, embedding
pods             id, template, facilitator_id, mattermost_channel_id, ritual_cadence, status
pod_memberships  pod_id, member_id, role, joined_at
sessions         pod_id, datetime, jitsi_link, summary, attendance
evidence_records member_id, session_id?, activity_type, artifact_url, rubric_json, reviewer_ids, created_at
vouches          voucher_id, vouchee_id, claim_text, cohort_verified, status, created_at
resources        title, body, category, embedding
events           title, datetime, jitsi_link, training_path?, rsvps
```

**LLM calls** go through a single OpenAI-compatible abstraction layer (`src/lib/llm/`). Claude API at the workshop; swap target to llama.cpp on owned hardware without touching call sites. Data sovereignty is a day-one decision.

**Mattermost** is the community destination — this platform is the spine that routes into it. Pod instantiation creates channels and sends DMs via the bot API; the bot never reads member messages.

**Human-in-the-loop is the model, not a fallback.** Every AI output that touches a member (match proposals, facilitator briefs) must be confirmed by a human before delivery.

**Intake conversation** runs in a stateless edge function; the full transcript and Claude-extracted structure are written to `intakes` at the end of the flow, not streamed to any external store mid-conversation.

## Conventions

- All LLM calls through `src/lib/llm/` — never call the Anthropic or OpenAI SDK directly from feature code
- Intake data is organizer-only; enforce at the row-level security policy in Supabase, not just in UI guards
- Pod templates differ only in `ritual_cadence`, `starter_agenda`, and the `activity_type` value stamped on emitted evidence records — keep template logic in a single config object, not branching code
- Ladder rung is an enum stored on `members`; rung transitions are written by server actions, never client-side
- Jitsi links are generated as `https://meet.jit.si/<pod_id>-<session_slug>` — deterministic, no external call needed
- Magic-link auth only — no passwords
- Use pgvector similarity search (`<->`) for resource Q&A and intake-to-pod matching; raw SQL via Supabase RPC, not an ORM abstraction
- Crisis-distress detection runs as a pre-check before each intake turn; if triggered, the turn returns a hardcoded handoff message and halts the conversation flow

## Never do

- Give legal advice in intake or anywhere in the UI — route to Sugar Law intake form
- Let AI match output reach a member before a facilitator has confirmed it
- Read member Mattermost messages with the bot token — the bot sends only
- Store or log Oracle-sourced data anywhere in this system
- Build per-feature point systems or member-vs-member leaderboards — standing is contribution recognition only
- Open a new wing (study, build, interview, hiring hall) in code before facilitator capacity exists for it — stub schema only until then
- Call the LLM SDK directly from feature code — always go through `src/lib/llm/`
