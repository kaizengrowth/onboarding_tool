---
description: LLM call discipline — all AI calls go through the abstraction layer
globs: ["src/**/*.ts", "src/**/*.tsx"]
alwaysApply: true
---

Never import `@anthropic-ai/sdk` or `openai` directly in feature code. All LLM calls must go through `src/lib/llm/index.ts` via `getLLMProvider()`.

Prompts live in `src/lib/llm/prompts/` as plain strings. Keep them provider-agnostic — no Anthropic-specific message formats in prompt files.

When adding a new LLM use case:
1. Add the prompt string to `src/lib/llm/prompts/`
2. Add a thin wrapper in the relevant `src/lib/` module (e.g. `src/lib/matching/engine.ts`)
3. Call the wrapper from the API route — never call `getLLMProvider()` directly in route handlers

This keeps the provider swap (Claude → llama.cpp) a one-line config change.
