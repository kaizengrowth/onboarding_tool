# AGENTS.md

Cross-tool compatibility file. See CLAUDE.md for the full project context.

## Project

**The Hall — What We Will Community Platform**

Next.js · Supabase · Mattermost · Claude API

## Key constraints

- All LLM calls go through `src/lib/llm/` — never call provider SDKs directly from feature code
- Intake data (`intakes` table) is organizer-only; enforce via Supabase RLS
- No AI output reaches a member until a human facilitator confirms it
- Never give legal advice — route to Sugar Law (https://sugarlaw.org)
- Crisis-distress language in intake triggers a hardcoded handoff message and halts the flow
- Bot reads `resources` table only; never reads member messages or `intakes`
