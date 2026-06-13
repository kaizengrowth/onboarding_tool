# src/lib/CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) for the `src/lib/` directory.

> **Context pressure:** Drop this file. Load the specific module CLAUDE.md for your task:
> - `src/lib/llm/CLAUDE.md` — LLM abstraction, prompts, provider swap, crisis pre-check
> - `src/lib/supabase/CLAUDE.md` — Supabase clients, auth, RLS, pgvector queries
> - `src/lib/matching/CLAUDE.md` — pod matching algorithm and human gate
> - `src/lib/mattermost/CLAUDE.md` — Mattermost bot send-only integration

## Module map

| Directory | Responsibility |
|---|---|
| `llm/` | OpenAI-compatible abstraction; all feature code calls this, never the SDK directly |
| `supabase/` | Three Supabase clients (anon / server / service-role) + typed query helpers |
| `matching/` | Pod matching algorithm: embeds intakes, ranks by cohort > craft > region > stage |
| `mattermost/` | Bot API wrapper: creates channels, sends DMs; never reads messages |

## Shared rule

No `lib/` module may call another `lib/` module except through explicit, typed function signatures. Circular imports between modules are forbidden. `lib/supabase/` is the only module that may touch the database — `lib/matching/` and `lib/mattermost/` call `lib/supabase/` helpers, not the Supabase SDK directly.
