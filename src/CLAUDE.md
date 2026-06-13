# src/CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) for the `src/` directory of this repository.

> **Context pressure:** Drop this file. Load the specific L2 CLAUDE.md for your task:
> - `src/app/CLAUDE.md` — pages, routes, and API handlers
> - `src/lib/CLAUDE.md` — business logic and integrations
> - `src/components/CLAUDE.md` — UI components
> - `src/db/CLAUDE.md` — schema and migrations
>
> If still constrained after loading an L2 file, drop it and load the relevant L3 CLAUDE.md directly (e.g. `src/lib/llm/CLAUDE.md`).

## Source tree

```
src/
  app/           Next.js App Router — pages + Edge Function API routes
  components/    UI components grouped by domain (intake, ladder, organizer)
  db/            Supabase migration SQL files
  lib/           Business logic, integrations, LLM abstraction layer
  types/         Shared TypeScript types (Supabase-generated + hand-written)
```

## How app/ and lib/ relate

`app/api/` routes are thin handlers — they validate auth, call into `lib/`, and return responses. All business logic lives in `lib/`. A one-to-one mapping:

| `app/api/` route | `lib/` modules it calls |
|---|---|
| `intake/` | `lib/llm/` (prompts + crisis check), `lib/supabase/` |
| `match/` | `lib/matching/`, `lib/supabase/` |
| `pods/[id]/confirm/` | `lib/mattermost/`, `lib/supabase/` |

`components/` are consumed only by `app/` pages — no component imports from `lib/` directly.
