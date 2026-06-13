---
name: the-hall-design-system-rules
description: The Hall's design system rules — shadcn/ui + Tailwind 4, WCAG AAA strict, crisis-context tone. Auto-loads on any *.tsx edit or when building new components.
---

# the-hall-design-system-rules

Crisis-context first: every UI decision should reduce cognitive load for a person who just lost their job.

## Stack

- **Components:** shadcn/ui primitives
- **Tokens:** Tailwind 4 `@theme` block in `app/globals.css`
- **WCAG:** AAA strict — every component, no exceptions

## Hierarchy: Adopt > Extend > Compose > Build

1. **Adopt** — use a shadcn primitive as-is. If it fits, stop here.
2. **Extend** — add project tokens via Tailwind 4 `@theme` vars. Never hardcode hex/hsl inline.
3. **Compose** — combine primitives into a feature component. Name by domain (`IntakeTurnCard`), not layout (`TwoColumnBox`).
4. **Build** — only when no combination of primitives covers the need. Justify it before building.

## AAA requirements (non-negotiable)

- Contrast: 7:1 for normal text, 4.5:1 for large text
- All interactive elements keyboard-reachable with a visible focus ring — never `outline-none` without a replacement
- All form inputs have explicit `<label>` associations — no placeholder-as-label
- Icons that convey meaning: `aria-label`. Decorative icons: `aria-hidden`
- Motion: wrap all transitions in `@media (prefers-reduced-motion: no-preference)` — default to no motion
- Error messages: `role="alert"` so screen readers announce immediately

## Crisis-context design principles

- Never require a decision before the user has context — show resources before signup
- One action per screen for intake turns — no multi-step forms in a single view
- Crisis handoff message (distress detected) is hardcoded, not AI-generated — never restyle it without review
- Loading states always include text, never spinner-only

## Token usage

Use `@theme` CSS variables from `app/globals.css` exclusively. Never use raw Tailwind color classes (`bg-blue-500`) — use semantic tokens (`bg-primary`, `bg-destructive`).

## Component naming

- Domain-prefixed: `IntakeTurnCard`, `LadderRungBadge`, `OrganizerActionCard`
- Never layout-named: ❌ `TwoColumn`, ❌ `SidebarWrapper`
- Server component by default — add `'use client'` only when state or browser APIs are required
