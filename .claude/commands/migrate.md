Apply pending database migrations:

1. Run `supabase db push` to apply all migrations in `src/db/migrations/` to the local Supabase instance.
2. Run `supabase gen types typescript --local > src/types/supabase.ts` to regenerate database types.
3. Check whether any type changes in `supabase.ts` conflict with the hand-written types in `src/types/index.ts` and flag discrepancies.

If `supabase start` hasn't been run yet, run it first.
