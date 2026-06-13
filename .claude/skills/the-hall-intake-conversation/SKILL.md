---
name: the-hall-intake-conversation
description: Scaffold intake conversation turn UI for The Hall. One question + text input + progress indicator per turn. Handles crisis handoff state. Use when building or editing src/components/intake/.
---

# the-hall-intake-conversation

Generates a single intake turn component — one question, one input, progress indicator, crisis handoff variant.

## Rules

- One question displayed at a time — never show all 5 simultaneously
- Text input only (not a multi-field form)
- Progress indicator: "Question 2 of 5" as accessible text, not just a visual bar
- "Previous" link (never a back button that clears state)
- Submit triggers a server round-trip — the parent page owns conversation state, not this component
- The full conversation state is passed in as props; this component is stateless except for the current input value

## Component signature

```tsx
// src/components/intake/IntakeTurn.tsx
interface IntakeTurnProps {
  question: string
  turnIndex: number        // 1–5
  totalTurns: number       // 5
  onSubmit: (answer: string) => Promise<void>
  isLoading: boolean
  crisisDetected: boolean
}
```

## Crisis handoff state

When `crisisDetected` is `true`:
- Replace the question with the hardcoded crisis message (never AI-generated, never dynamic)
- Remove all form inputs
- Show a single CTA linking to the crisis resource
- Wrap the crisis message in `role="alert"` so screen readers announce it immediately

## Accessibility (AAA)

- `'use client'` required (stateful input)
- Enter submits; Tab moves focus to submit button
- Never disable the submit button — show a loading indicator inside it instead
- AAA contrast on all text, input borders, and focus rings
- Label the input explicitly: `<label htmlFor="answer">Your response</label>`
