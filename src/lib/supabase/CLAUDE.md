# src/lib/supabase/CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) for the `src/lib/supabase/` directory.

> **Context pressure:** This is a leaf-level context. For schema and migration details, load `src/db/CLAUDE.md`.

## Three clients

| Client | When to use |
|---|---|
| `createBrowserClient()` | Client Components that need real-time subscriptions or optimistic UI |
| `createServerClient()` | Server Components, Server Actions, Route Handlers (uses cookie-based session) |
| `createServiceClient()` | Internal server-only operations that must bypass RLS (e.g. pod instantiation writing on behalf of a member) |

Never use the service client in code paths reachable from user input without an explicit comment justifying the bypass.

## RLS philosophy

RLS is the enforcement layer — UI guards are convenience only. Critical policies:

- `intakes`: `SELECT` restricted to `organizer` role; members cannot read any intake row
- `members`: members `SELECT` own row only; organizer `SELECT` all
- `pods` / `pod_memberships`: members see only their own pods; organizer sees all
- `vouches`: rows with `status != 'confirmed'` are invisible to all non-organizer roles

New tables must have RLS enabled and explicit policies before any data is written to them.

## pgvector queries

Run similarity searches via Supabase RPC (raw SQL functions in `src/db/migrations/`), not via any ORM layer:

```ts
const { data } = await supabase.rpc('match_pods', {
  query_embedding: embedding,
  match_threshold: 0.75,
  match_count: 5,
})
```

The RPC function name matches the migration that created it.
