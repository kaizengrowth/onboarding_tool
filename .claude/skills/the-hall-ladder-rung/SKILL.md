---
name: the-hall-ladder-rung
description: Scaffold ladder rung display components for The Hall — inline badge, progress visualization, next-step CTA. Use when building or editing src/components/ladder/.
---

# the-hall-ladder-rung

Ladder visualization — current rung, suggested next step, pod memberships. Three sub-components, all server-renderable.

## The rungs (in order)

`arrived → supported → in_pod → contributing → trained → facilitating → leading`

## Three sub-components

### LadderRungBadge
Inline chip showing the member's current rung. Used in tables, cards, and the member profile header.

### LadderProgressBar
Vertical (default) or horizontal ladder with the current rung highlighted and labeled. Gray out rungs more than 2 steps ahead — don't show all 7 as equally reachable. Each rung has a visible label (not just a dot).

### NextStepCTA
One suggested action based on current rung. Exactly one CTA per member, derived from the static config map below. Never AI-generated.

## Static config — single source of truth

```ts
// src/lib/ladder-steps.ts
const NEXT_STEPS: Record<LadderRung, { label: string; href: string }> = {
  arrived:      { label: 'Tell us what happened',      href: '/intake' },
  supported:    { label: 'Join a support pod',         href: '/pods/support' },
  in_pod:       { label: 'Attend your next session',   href: '/pods/[id]' },
  contributing: { label: 'Share a resource',           href: '/resources/new' },
  trained:      { label: 'Facilitate a session',       href: '/pods/facilitate' },
  facilitating: { label: 'Train a co-facilitator',     href: '/training' },
  leading:      { label: 'Start a new cohort',         href: '/cohorts/new' },
}
```

Add new rungs here only — never branch on rung in component code.

## Conventions

- Rung transitions are Server Actions — never update `ladder_rung` client-side
- Never show a member's rung to other members (organizer dashboard only)
- `LadderRungBadge` and `LadderProgressBar` are server components with no interactivity
- AAA contrast on all rung labels, especially the highlighted current rung
- The current rung label must be visible as text (not color alone) for screen readers
