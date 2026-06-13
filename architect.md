> Personalized via deepstack architect-personalize on 2026-06-13.
> Re-run with `/personalize` to update.

# The Hall — Architect Brief

## Goals

- Build a crisis front door that absorbs post-layoff workers: engages their questions, builds peer community, and routes members into pods without requiring them to navigate alone.
- Generate trustworthy hiring evidence through structured preparation, vouching, and session records — tied to one reputation (standing) with no member-vs-member competition.
- Stay fully portable: Claude API at the workshop, llama.cpp on owned hardware with no call-site changes; Mattermost for community with no platform lock-in on member data.

## Non-goals

- Not a job board, hiring marketplace, or placement service
- Not legal advice or legal document generation (route to Sugar Law)
- Not a leaderboard, scoring system, or per-feature points
- Not a social network where members see each other's intake data
- Not opening a new wing (study, build, interview, hiring hall) in code before facilitator capacity exists

## Audience

- **Primary:** a post-layoff worker arriving in crisis or confusion, with low trust and low capacity
- **Secondary:** a trained facilitator who confirms AI proposals and runs pods; organizers who manage absorption and capacity

---

## Stack

### Frontend
- **Framework:** Next.js 15 App Router
- **React:** 19
- **Language:** TypeScript with `strict: true`
- **Styling:** Tailwind 4
- **Component library:** shadcn/ui
- **State:** Server Components default; stateful intake conversation uses `'use client'`

### Data layer
- **Database:** Supabase Postgres + pgvector
- **ORM:** None — Supabase JS client for standard queries, raw SQL via Supabase RPC for pgvector
- **API:** Route Handlers (Edge Functions for intake) + Server Actions for writes
- **Auth:** Supabase Auth — magic-link only, no passwords

### Infra
- **Deploy:** Vercel
- **CI/CD:** GitHub Actions
- **Monitoring:** undecided ❓
- **Community:** Mattermost (chat.wwwrise.org) — bot sends only, never reads
- **Video:** Jitsi — deterministic links (`meet.jit.si/<pod_id>-<session_slug>`), no external call

---

## Design system

- **Source of truth:** `app/globals.css` `@theme` block (Tailwind 4)
- **Component library:** shadcn/ui
- **WCAG target:** AAA strict
- **Motion:** `prefers-reduced-motion` honored everywhere — default to no motion

### Adopt > Extend > Compose > Build

For each new UI need:
1. **Adopt** an existing shadcn primitive as-is
2. **Extend** with Tailwind 4 `@theme` tokens (never inline hex/hsl)
3. **Compose** primitives into feature components (named by domain, not layout)
4. **Build** net-new only when nothing in shadcn fits

---

## Team conventions

From CLAUDE.md — every PR must respect:

- **Always:** Route all LLM calls through `src/lib/llm/` — never call the Anthropic or OpenAI SDK directly from feature code
- **Always:** Enforce intake data access (organizer-only) at the Supabase RLS policy level, not just UI guards
- **Always:** Keep pod template logic (ritual_cadence, starter_agenda, activity_type) in a single config object — no branching code
- **Always:** Write ladder rung transitions in Server Actions only — never client-side
- **Never:** Let any AI output reach a member before a facilitator has confirmed it
- **Never:** Read member Mattermost messages with the bot token — send only
- **Never:** Give legal advice; route to Sugar Law intake form
- **Never:** Build per-feature point systems or member-vs-member leaderboards
- **Never:** Open a new wing in code before facilitator capacity exists — stub schema only

---

## The 6-phase verification gate

Every change must pass before merge:

1. **Build** — `npm run build`
2. **TypeCheck** — `npm run type-check` (strict, no implicit any)
3. **Lint** — `npm run lint`
4. **Tests** — Vitest + Playwright
5. **Security** — security-officer skill clean
6. **Diff size** — ≤ 400 lines

CI enforces this on every PR via GitHub Actions.

---

## Performance budgets

| Metric | Budget |
|---|---|
| LCP | < 2.5s |
| INP | < 200ms |
| CLS | < 0.1 |
| Initial JS | < 150 KB compressed |
| Per-route JS | < 50 KB compressed |

---

## Repeated UI tasks → bootstrapped skills

1. Intake conversation turns → `the-hall-intake-conversation`
2. Organizer action cards → `the-hall-organizer-action-card`
3. Ladder rung display → `the-hall-ladder-rung`

---

## Review & ship

- **PR review:** GitHub + `the-hall-pr-review` skill
- **CI:** GitHub Actions
- **Slack:** ship notifications channel — URL TBD ❓

---

## Open questions

- ❓ Monitoring provider (Sentry / PostHog / none)
- ❓ Slack channel URL for PR and agent ship notifications
- ❓ When does the study wing open (facilitator capacity decision)

## Out-of-scope (parking lot)

- `evidence_records` UI — schema stubbed, no UI until facilitator capacity decision
- `vouches` UI — schema stubbed
- Study / build / interview / hiring hall wings
- Any per-feature reputation points or member leaderboards (explicitly never)
