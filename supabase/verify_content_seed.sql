-- Manman! content seed verification
-- Run after supabase/seed_content_packs.sql.

select 'content_packs' as table_name, count(*) as row_count from public.content_packs
union all select 'pack_tones', count(*) from public.pack_tones
union all select 'components', count(*) from public.components
union all select 'hanzi', count(*) from public.hanzi
union all select 'words', count(*) from public.words
union all select 'patterns', count(*) from public.patterns
union all select 'sentences', count(*) from public.sentences
union all select 'intro_cards', count(*) from public.intro_cards
union all select 'pack_items', count(*) from public.pack_items
union all select 'study_flow_items', count(*) from public.study_flow_items
order by table_name;

-- These should return 0 rows.
select 'pack_items missing source item' as issue, item_type, item_external_id
from public.pack_items pi
where not exists (
  select 1
  from public.v_content_items ci
  where ci.item_type = pi.item_type
    and ci.external_id = pi.item_external_id
);

select 'study_flow_items missing source item' as issue, item_type, item_external_id
from public.study_flow_items sfi
where not exists (
  select 1
  from public.v_content_items ci
  where ci.item_type = sfi.item_type
    and ci.external_id = sfi.item_external_id
);
