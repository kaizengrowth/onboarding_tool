# src/components/CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) for the `src/components/` directory.

> **Context pressure:** This is a leaf-level context for components. Load `src/app/CLAUDE.md` for the pages that consume these components.

## Component families

| Directory | What lives here |
|---|---|
| `intake/` | Conversation turn UI — one question at a time, progress indicator, crisis handoff state |
| `ladder/` | Ladder rung badge, progress visualization, next-step CTA |
| `organizer/` | Member queue table, match proposal action cards, pod status board |

## Key patterns

- **Server components by default.** Only add `'use client'` when the component needs browser state or APIs. The intake conversation components require it; ladder and organizer components do not.
- **No direct Supabase calls from components.** Data flows in as props from Server Component pages or via Server Actions for mutations.
- **Domain-named, not layout-named.** `IntakeTurnCard` not `TwoColumnCard`. `LadderRungBadge` not `StatusChip`.
- **Organizer mutation components** (confirm/reject match proposals) use `<form action={serverAction}>` — not onClick handlers — so they work without JavaScript.

## Relevant skills

Use these project skills when building in this directory:

- `the-hall-intake-conversation` — intake turn component rules and signature
- `the-hall-organizer-action-card` — action card variants and human-gate rules
- `the-hall-ladder-rung` — rung badge, progress bar, next-step CTA, static config map
- `the-hall-design-system-rules` — shadcn/ui + Tailwind 4 + WCAG AAA rules
