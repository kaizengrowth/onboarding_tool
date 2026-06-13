---
description: Correct Supabase client usage — server vs browser
globs: ["src/**/*.ts", "src/**/*.tsx"]
alwaysApply: false
---

Use `src/lib/supabase/server.ts` (`createClient`) in:
- Server components (RSCs)
- API route handlers (`route.ts`)
- Server actions

Use `src/lib/supabase/client.ts` (`createClient`) only in:
- `"use client"` components that need real-time subscriptions or auth state

Never use the server client in a `"use client"` file — it imports `next/headers` which is server-only and will throw at runtime.

The service role key (`SUPABASE_SERVICE_ROLE_KEY`) bypasses RLS. Only use it for admin operations like seeding — never in request handlers that could be reached by a regular user session.
