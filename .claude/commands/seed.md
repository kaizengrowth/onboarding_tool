Seed the local database with realistic test data for development:

- 2 cohorts (e.g. "Acme Corp" RIF 2026-05-01, "Globex" RIF 2026-04-15)
- 6 members spread across ladder rungs, with Mattermost user IDs set to placeholder strings
- 2 pods (one `support` active, one `study` pending) with memberships
- 1 intake record per member with realistic extracted fields
- A handful of resources in the knowledge layer corpus (WARN Act explainer, unemployment FAQ, COBRA basics)

Write SQL directly to `src/db/seeds/001_dev.sql` and run it via `supabase db reset` or paste into Supabase Studio. Do not use the service role key from application code to seed — use the Supabase CLI or Studio only.
