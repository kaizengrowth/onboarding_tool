# src/db/CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) for the `src/db/` directory.

> **Context pressure:** This is a leaf-level context for schema and migrations. For Supabase client setup and RLS policy implementation, load `src/lib/supabase/CLAUDE.md`.

## Migrations

SQL files in `src/db/migrations/` named `001_init.sql`, `002_*.sql`, etc. Apply with:

```bash
supabase db push
supabase gen types typescript --local > types/supabase.ts  # run after every schema change
```

## Schema

```
members          id, name, contact, region, craft, cohort_id, ladder_rung (enum), created_at
cohorts          id, employer, rif_date, source (WARN filing ref)
intakes          id, member_id, raw_conversation (jsonb), extracted (jsonb), embedding (vector)
pods             id, template (enum), facilitator_id, mattermost_channel_id, ritual_cadence, status (enum)
pod_memberships  pod_id, member_id, role, joined_at
sessions         id, pod_id, datetime, jitsi_link, summary, attendance (jsonb)
evidence_records id, member_id, session_id?, activity_type, artifact_url, rubric_json, reviewer_ids, created_at
vouches          id, voucher_id, vouchee_id, claim_text, cohort_verified (bool), status, created_at
resources        id, title, body, category, embedding (vector)
events           id, title, datetime, jitsi_link, training_path?, rsvps (jsonb)
```

## Enum values

- `ladder_rung`: `arrived | supported | in_pod | contributing | trained | facilitating | leading`
- `pod.template`: `support | study | build | interview | action`
- `pod.status`: `forming | open | active | closed`
- `vouches.status`: `pending | confirmed | retracted`

## Day 1 stubs

`evidence_records`, `vouches`, and the derived `standing` view have schema defined but no UI. Do not add UI for these tables until a facilitator capacity decision is made. Schema stubs keep the migration history clean; UI comes later.
