# src/app/CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) for the `src/app/` directory.

> **Context pressure:** Drop this file. Load `src/app/api/CLAUDE.md` for API route work. For component work, load `src/components/CLAUDE.md`.

## Pages

| Route | Auth | Description |
|---|---|---|
| `/intake` | Public | Crisis front door — resources visible without signup; starts the 5-question conversation |
| `/member/[id]` | Member (own record) | Ladder profile — current rung, suggested next step, pod memberships |
| `/organizer/pods` | Organizer role | Absorption dashboard — member queue, pending match proposals, pod management |

## Route conventions

- Public pages (`/intake`) must never expose member data — enforce at the page level, not just via UI conditionals
- Organizer pages are gated by Supabase Auth + RLS role check; do not rely on UI-only guards
- All writes go through Server Actions — no direct Supabase calls from Client Components
- API routes live under `app/api/` and are Edge Functions (stateless) — see `src/app/api/CLAUDE.md`
- `app/intake/` Client Components manage the stateful conversation UI; everything else defaults to Server Components

## Data flow

Pages fetch via Server Components → pass data as props to Client Components → mutations go through Server Actions → Server Actions call `lib/` modules, never the Supabase SDK directly.
