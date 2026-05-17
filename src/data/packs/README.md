# Content Packs

Put starter/test pack JSON files in this folder.

Recommended naming:

```text
pack_000_introduction_to_mandarin.json
pack_001_i_you_to_be_have.json
pack_002_daily_actions.json
```

For the current mock frontend, add the JSON here and register it in `src/data/packs/index.ts`.
The app adapter in `src/data/mockContent.ts` normalizes registered packs into local UI content.

When Supabase is connected, these same files should become seed/import files for the content tables.
