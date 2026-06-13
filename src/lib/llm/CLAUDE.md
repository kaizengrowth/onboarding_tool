# src/lib/llm/CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) for the `src/lib/llm/` directory.

> **Context pressure:** This is a leaf-level context. No child CLAUDE.md files below this level.

## Structure

```
lib/llm/
  index.ts          Exported llm(prompt, opts) function — the only entry point for feature code
  providers/        Provider implementations (Claude API, llama.cpp-compatible local)
  prompts/          Prompt templates keyed by task
```

## Provider abstraction

The abstraction is OpenAI-compatible: `{ model, messages, temperature }` in, `{ content }` out. The active provider is selected by the `LLM_PROVIDER` env var (`claude` | `local`). Swapping providers requires only an env var change — no call-site changes in feature code.

## Adding a prompt

1. Add a file to `lib/llm/prompts/` (e.g. `match-rationale.ts`)
2. Export a function that returns `{ system: string; user: string }`
3. Call it via the `llm()` wrapper in `lib/llm/index.ts`
4. Never construct prompts inline in feature code or API routes

## Crisis pre-check

`prompts/crisis.ts` exports a boolean classifier that runs before every intake turn. Callers must check this result first:

```ts
const isDistressed = await detectCrisis(turn)
if (isDistressed) return HARDCODED_CRISIS_HANDOFF  // halt — do not call the intake prompt
```

The crisis handoff message is a hardcoded constant, never AI-generated. Do not pass it through the LLM.

## Env vars

- `LLM_PROVIDER` — `claude` (default) or `local`
- `ANTHROPIC_API_KEY` — required when `LLM_PROVIDER=claude`
- `LOCAL_LLM_BASE_URL` — required when `LLM_PROVIDER=local`
