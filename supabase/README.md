# Manman! Supabase Setup

Current backend status:

1. Run `schema_v2_current_mvp.sql` in a fresh Supabase project.
2. Run `seed_content_packs.sql` after the schema succeeds.
3. Run `verify_content_seed.sql` to confirm row counts and relationship integrity.

## Regenerate Content Seed

When files change in `src/data/packs`, regenerate the seed SQL:

```bash
npm run seed:sql
```

This reads all `src/data/packs/*.json` files and writes:

```text
supabase/seed_content_packs.sql
```

The seed is safe to rerun for current development content:

- Core content tables use upsert by `external_id`.
- Relationship tables are rebuilt from the current JSON packs.
- User learning data is not touched by the seed.

## Expected Current Pack Counts

Current local pack files produce:

- 10 content packs
- 4 components
- 53 Hanzi
- 54 words
- 9 patterns
- 18 sentences
- 6 intro cards
- 99 study flow items

## Frontend Integration Later

After content is verified in Supabase, the next integration layer should be:

1. Supabase client setup with environment variables.
2. Auth sign in/sign up wired to Supabase Auth.
3. Profile/settings sync.
4. Content reads from Supabase behind a feature flag or data provider.
5. Study progress writes for sessions, review attempts, SRS state, and daily activity.
