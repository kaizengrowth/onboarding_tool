---
name: the-hall-organizer-action-card
description: Scaffold organizer action cards for The Hall — match proposal confirm/reject, member queue items, pod status. Use when building or editing src/components/organizer/.
---

# the-hall-organizer-action-card

Organizer-facing action cards. Every card that results in a member-visible action has exactly two buttons: Confirm and Reject. No partial approvals, no bulk actions.

## Three card variants

All share one base component with a `variant` prop:

### 1. Match proposal card (`variant="match"`)
Shows: member name, pod template, Claude's match rationale, cohort overlap.  
Confirm → `POST /api/pods/[id]/confirm` (triggers pod instantiation).  
Reject → archives the proposal.  
**Never show the member's raw intake transcript.**

### 2. Member queue card (`variant="queue"`)
Shows: ladder rung badge, craft, region, days since intake.  
No match action here — routes to the match flow as a separate step.

### 3. Pod status card (`variant="pod"`)
Shows: template, member count (n/6), facilitator name, next session datetime, Mattermost channel link.  
No confirm/reject — read-only status.

## Component signature

```tsx
// src/components/organizer/OrganizerActionCard.tsx
interface OrganizerActionCardProps {
  variant: 'match' | 'queue' | 'pod'
  data: MatchProposal | MemberQueueItem | PodStatus
  onConfirm?: () => Promise<void>   // match variant only
  onReject?: () => Promise<void>    // match variant only
}
```

## Human-gate rule

The Confirm button on a match proposal card is the only path that triggers pod instantiation. Never add a "skip confirmation", "auto-confirm", or "bulk confirm" shortcut — the human gate is the model, not a fallback.

## Implementation conventions

- Server component wrapper; Confirm/Reject are `<form action={serverAction}>` — not `onClick` handlers
- Optimistic UI: dim the card on submit, remove it on server response
- Confirm button: `variant="default"` (primary); Reject: `variant="outline"`
- AAA contrast; all action buttons keyboard-reachable with visible focus ring
