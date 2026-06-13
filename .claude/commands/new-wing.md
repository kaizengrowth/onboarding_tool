Scaffold the next platform wing following the sequencing in CLAUDE.md.

Before writing any code:
1. Confirm which wing is next in the roadmap (study → build → interview → hiring-hall)
2. Confirm that facilitator capacity exists — the binding constraint is facilitators, not software
3. Check whether the required schema tables already exist as stubs in `src/db/migrations/001_initial.sql`

Then:
- Add any new DB columns or tables as a new migration file (`src/db/migrations/NNN_wing_name.sql`)
- Add new pod template behavior to the pod config (ritual cadence, starter agenda, evidence activity_type)
- Add the new page under `src/app/organizer/` and the corresponding API routes
- Keep evidence emission consistent: sessions in the new wing emit `evidence_records` with the correct `activity_type`

Do not open a new wing's UI until the migration and pod config are in place.
