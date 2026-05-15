# Content Packs

Put starter/test pack JSON files in this folder.

Recommended naming:

```text
pack_001_foundations_greetings.json
pack_002_daily_basics.json
pack_003_food_drinks.json
```

For the current mock frontend, add the JSON here first. Until the pack loader is generalized, wire new packs from `src/data/mockContent.ts`.

When Supabase is connected, these same files should become seed/import files for the content tables.
