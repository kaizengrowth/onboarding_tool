---
description: Human-in-the-loop — no AI output reaches a member without facilitator confirmation
globs: ["src/app/api/**", "src/lib/matching/**", "src/lib/mattermost/**"]
alwaysApply: false
---

The confirmation sequence is:
1. `POST /api/match` → generates a `MatchProposal` stored server-side; member sees nothing
2. Facilitator reviews at `/organizer/pods`
3. `POST /api/pods/[id]/confirm` → pod instantiates, Mattermost channel created, welcome DMs sent

Do not add any flow that skips step 2. Do not send Mattermost messages from `/api/match` or `/api/intake`. The bot sends only after `/confirm` runs.

This applies equally to facilitator briefs — they go to the facilitator's Mattermost channel on confirm, not before.
