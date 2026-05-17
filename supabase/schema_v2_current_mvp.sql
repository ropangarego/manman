-- Manman! Supabase schema v2 current MVP
-- Current frontend target:
-- - React/Vite app with local packs 000-009
-- - Supabase Auth later
-- - User profile/settings persistence
-- - JSON content pack import
-- - Simple Leitner SRS with fixed intervals
-- - Study sessions, review attempts, daily activity, issue reports, audio asset support
--
-- Run in a fresh Supabase project SQL Editor.

create extension if not exists pgcrypto;

do $$ begin create type public.app_language as enum ('en', 'id'); exception when duplicate_object then null; end $$;
do $$ begin create type public.script_preference as enum ('simplified', 'traditional'); exception when duplicate_object then null; end $$;
do $$ begin create type public.session_size as enum ('light', 'standard', 'intense'); exception when duplicate_object then null; end $$;
-- Frontend mapping:
-- Pinyin: Always -> always, Lesson only -> learning_only, Hidden in review -> hidden_in_review, Off -> off.
-- Review style: Simple -> choice, Mixed -> mixed, Typed -> typed.
-- Script: Not sure is saved as simplified.
do $$ begin create type public.pinyin_display as enum ('always', 'learning_only', 'hidden_in_review', 'off'); exception when duplicate_object then null; end $$;
do $$ begin create type public.review_style as enum ('choice', 'mixed', 'typed'); exception when duplicate_object then null; end $$;
do $$ begin create type public.speech_speed as enum ('slow', 'normal', 'fast'); exception when duplicate_object then null; end $$;
do $$ begin create type public.pack_type as enum ('introduction', 'standard'); exception when duplicate_object then null; end $$;
do $$ begin create type public.script_priority as enum ('simplified', 'traditional', 'both'); exception when duplicate_object then null; end $$;
do $$ begin create type public.item_type as enum ('component', 'hanzi', 'word', 'sentence', 'pattern', 'intro_card'); exception when duplicate_object then null; end $$;
do $$ begin create type public.pack_item_role as enum ('component', 'primary', 'support', 'unlock'); exception when duplicate_object then null; end $$;
do $$ begin create type public.study_flow_section as enum ('new_item', 'quick_practice', 'unlock_item'); exception when duplicate_object then null; end $$;
do $$ begin create type public.srs_stage as enum ('learning', 'familiar', 'strong', 'mastered', 'long_term'); exception when duplicate_object then null; end $$;
do $$ begin create type public.review_result as enum ('correct', 'incorrect', 'skipped'); exception when duplicate_object then null; end $$;
do $$ begin create type public.study_phase as enum ('intro', 'learn', 'practice', 'review', 'summary', 'unlocks'); exception when duplicate_object then null; end $$;
do $$ begin create type public.question_type as enum (
  'meaning_choice',
  'meaning_typed',
  'pinyin_choice',
  'pinyin_typed',
  'tone_choice',
  'sentence_meaning',
  'self_check'
); exception when duplicate_object then null; end $$;
do $$ begin create type public.issue_category as enum (
  'wrong_meaning',
  'wrong_pinyin',
  'wrong_tone',
  'unnatural_example',
  'audio_problem',
  'typo',
  'other'
); exception when duplicate_object then null; end $$;
do $$ begin create type public.issue_status as enum ('open', 'reviewing', 'fixed', 'rejected', 'duplicate'); exception when duplicate_object then null; end $$;
do $$ begin create type public.audio_voice_type as enum ('native', 'generated', 'browser_tts_fallback'); exception when duplicate_object then null; end $$;

alter type public.pinyin_display add value if not exists 'learning_only';
alter type public.pinyin_display add value if not exists 'hidden_in_review';
alter type public.pinyin_display add value if not exists 'off';
alter type public.review_style add value if not exists 'choice';
alter type public.item_type add value if not exists 'intro_card';

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    email,
    display_name
  )
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

-- User profile, settings, onboarding, and current local-study position.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  onboarded boolean not null default false,
  language public.app_language not null default 'en',
  script public.script_preference not null default 'simplified',
  session_size public.session_size not null default 'standard',
  pinyin_display public.pinyin_display not null default 'always',
  review_style public.review_style not null default 'choice',
  speech_speed public.speech_speed not null default 'normal',
  tone_colors_enabled boolean not null default true,
  sound_enabled boolean not null default true,
  tutorial_hints_enabled boolean not null default true,
  dark_mode_enabled boolean not null default false,
  offline_mode_enabled boolean not null default false,
  current_pack_external_id text,
  current_session_index int not null default 0 check (current_session_index >= 0),
  placement_result jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Shared content pack metadata. `order_index = 0` is allowed for Pack 000 intro.
-- Seed mapper note:
-- JSON `title`, `subtitle`, `learning_goal`, `meaning`, `mnemonic`, and `pinyin`
-- map to DB `*_en`, `*_id`, and `pinyin_diacritic` columns. Keep external_id equal
-- to the JSON `id` so frontend content references and user progress stay stable.
create table if not exists public.content_packs (
  id uuid primary key default gen_random_uuid(),
  external_id text not null unique,
  slug text not null unique,
  title_en text not null,
  title_id text not null,
  subtitle_en text not null,
  subtitle_id text not null,
  level int not null default 1 check (level >= 0),
  phase text not null default 'prototype',
  theme text not null,
  script_priority public.script_priority not null default 'simplified',
  estimated_days int not null default 1 check (estimated_days >= 0),
  estimated_minutes_per_day int not null default 5 check (estimated_minutes_per_day >= 0),
  order_index int not null check (order_index >= 0),
  pack_type public.pack_type not null default 'standard',
  is_srs_enabled boolean not null default true,
  learning_goal_en text not null,
  learning_goal_id text not null,
  content_summary jsonb not null default '{}'::jsonb,
  study_flow jsonb not null default '{}'::jsonb,
  review_blueprint jsonb not null default '{}'::jsonb,
  source_filename text,
  source_hash text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(order_index)
);

drop trigger if exists content_packs_set_updated_at on public.content_packs;
create trigger content_packs_set_updated_at
before update on public.content_packs
for each row execute function public.set_updated_at();

create table if not exists public.pack_tones (
  id uuid primary key default gen_random_uuid(),
  pack_id uuid not null references public.content_packs(id) on delete cascade,
  tone_number int not null check (tone_number between 0 and 4),
  name_en text not null,
  name_id text not null,
  shape text not null,
  description_en text not null,
  description_id text not null,
  unique(pack_id, tone_number)
);

create table if not exists public.components (
  id uuid primary key default gen_random_uuid(),
  external_id text not null unique,
  simplified text not null,
  traditional text not null,
  name_en text,
  name_id text,
  meaning_en text not null,
  meaning_id text not null,
  mnemonic_en text,
  mnemonic_id text,
  examples text[] not null default '{}',
  order_index int not null default 1 check (order_index >= 0),
  tags text[] not null default '{}',
  is_reviewable boolean not null default false,
  content_version int not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists components_set_updated_at on public.components;
create trigger components_set_updated_at
before update on public.components
for each row execute function public.set_updated_at();

create table if not exists public.hanzi (
  id uuid primary key default gen_random_uuid(),
  external_id text not null unique,
  simplified text not null,
  traditional text not null,
  meaning_en text not null,
  meaning_id text not null,
  accepted_meanings_en text[] not null default '{}',
  accepted_meanings_id text[] not null default '{}',
  blocked_meanings_en text[] not null default '{}',
  blocked_meanings_id text[] not null default '{}',
  pinyin_diacritic text not null,
  pinyin_numbered text,
  pinyin_syllables jsonb not null,
  tone_number int check (tone_number between 0 and 4),
  tone_pattern text,
  mnemonic_en text,
  mnemonic_id text,
  tone_mnemonic_en text,
  tone_mnemonic_id text,
  audio_url text,
  examples text[] not null default '{}',
  order_index int not null default 1 check (order_index >= 0),
  tags text[] not null default '{}',
  is_reviewable boolean not null default true,
  content_version int not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint hanzi_pinyin_syllables_array check (jsonb_typeof(pinyin_syllables) = 'array')
);

drop trigger if exists hanzi_set_updated_at on public.hanzi;
create trigger hanzi_set_updated_at
before update on public.hanzi
for each row execute function public.set_updated_at();

create table if not exists public.words (
  id uuid primary key default gen_random_uuid(),
  external_id text not null unique,
  simplified text not null,
  traditional text not null,
  meaning_en text not null,
  meaning_id text not null,
  accepted_meanings_en text[] not null default '{}',
  accepted_meanings_id text[] not null default '{}',
  blocked_meanings_en text[] not null default '{}',
  blocked_meanings_id text[] not null default '{}',
  pinyin_diacritic text not null,
  pinyin_numbered text,
  pinyin_syllables jsonb not null,
  tone_pattern text not null,
  part_of_speech text,
  mnemonic_en text,
  mnemonic_id text,
  tone_note_en text,
  tone_note_id text,
  usage_note_en text,
  usage_note_id text,
  audio_url text,
  examples text[] not null default '{}',
  order_index int not null default 1 check (order_index >= 0),
  tags text[] not null default '{}',
  is_core_word boolean not null default false,
  is_reviewable boolean not null default true,
  content_version int not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint words_pinyin_syllables_array check (jsonb_typeof(pinyin_syllables) = 'array')
);

drop trigger if exists words_set_updated_at on public.words;
create trigger words_set_updated_at
before update on public.words
for each row execute function public.set_updated_at();

create table if not exists public.patterns (
  id uuid primary key default gen_random_uuid(),
  external_id text not null unique,
  title_en text not null,
  title_id text not null,
  meaning_en text not null,
  meaning_id text not null,
  structure text not null,
  explanation_en text not null,
  explanation_id text not null,
  examples jsonb not null default '[]'::jsonb,
  order_index int not null default 1 check (order_index >= 0),
  tags text[] not null default '{}',
  is_reviewable boolean not null default false,
  content_version int not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists patterns_set_updated_at on public.patterns;
create trigger patterns_set_updated_at
before update on public.patterns
for each row execute function public.set_updated_at();

create table if not exists public.sentences (
  id uuid primary key default gen_random_uuid(),
  external_id text not null unique,
  simplified text not null,
  traditional text not null,
  meaning_en text not null,
  meaning_id text not null,
  literal_meaning_en text,
  literal_meaning_id text,
  pinyin_diacritic text not null,
  pinyin_numbered text,
  pinyin_syllables jsonb not null,
  tone_pattern text not null,
  notes_en text,
  notes_id text,
  audio_url text,
  order_index int not null default 1 check (order_index >= 0),
  tags text[] not null default '{}',
  is_reviewable boolean not null default true,
  content_version int not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint sentences_pinyin_syllables_array check (jsonb_typeof(pinyin_syllables) = 'array')
);

drop trigger if exists sentences_set_updated_at on public.sentences;
create trigger sentences_set_updated_at
before update on public.sentences
for each row execute function public.set_updated_at();

-- Pack 000 introduction cards. `example` is nullable by design.
create table if not exists public.intro_cards (
  id uuid primary key default gen_random_uuid(),
  pack_id uuid not null references public.content_packs(id) on delete cascade,
  external_id text not null unique,
  title_en text not null,
  title_id text not null,
  body_en text not null,
  body_id text not null,
  example jsonb,
  order_index int not null default 1 check (order_index >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(pack_id, order_index)
);

drop trigger if exists intro_cards_set_updated_at on public.intro_cards;
create trigger intro_cards_set_updated_at
before update on public.intro_cards
for each row execute function public.set_updated_at();

-- Item relationships.
create table if not exists public.hanzi_components (
  hanzi_id uuid not null references public.hanzi(id) on delete cascade,
  component_id uuid not null references public.components(id) on delete restrict,
  sort_order int not null default 1,
  primary key (hanzi_id, component_id)
);

create table if not exists public.word_hanzi (
  word_id uuid not null references public.words(id) on delete cascade,
  hanzi_id uuid not null references public.hanzi(id) on delete restrict,
  sort_order int not null default 1,
  primary key (word_id, hanzi_id)
);

create table if not exists public.sentence_words (
  sentence_id uuid not null references public.sentences(id) on delete cascade,
  word_id uuid not null references public.words(id) on delete restrict,
  sort_order int not null default 1,
  is_focus_word boolean not null default true,
  primary key (sentence_id, word_id)
);

create table if not exists public.sentence_patterns (
  sentence_id uuid not null references public.sentences(id) on delete cascade,
  pattern_id uuid not null references public.patterns(id) on delete restrict,
  sort_order int not null default 1,
  primary key (sentence_id, pattern_id)
);

create table if not exists public.pack_items (
  id uuid primary key default gen_random_uuid(),
  pack_id uuid not null references public.content_packs(id) on delete cascade,
  item_type public.item_type not null,
  item_external_id text not null,
  role public.pack_item_role not null default 'support',
  order_index int not null default 1 check (order_index >= 0),
  created_at timestamptz not null default now(),
  unique(pack_id, item_type, item_external_id)
);

create table if not exists public.item_prerequisites (
  id uuid primary key default gen_random_uuid(),
  item_type public.item_type not null,
  item_external_id text not null,
  prerequisite_type public.item_type not null,
  prerequisite_external_id text not null,
  required_stage public.srs_stage not null default 'familiar',
  created_at timestamptz not null default now(),
  unique(item_type, item_external_id, prerequisite_type, prerequisite_external_id)
);

create table if not exists public.study_flow_items (
  id uuid primary key default gen_random_uuid(),
  pack_id uuid not null references public.content_packs(id) on delete cascade,
  section public.study_flow_section not null,
  item_type public.item_type not null,
  item_external_id text not null,
  question_type public.question_type,
  order_index int not null default 1 check (order_index >= 0),
  created_at timestamptz not null default now(),
  unique(pack_id, section, item_external_id)
);

-- Optional audio asset catalog. Item tables also keep `audio_url` for simple V1 reads.
create table if not exists public.audio_assets (
  id uuid primary key default gen_random_uuid(),
  item_type public.item_type not null,
  item_external_id text not null,
  audio_url text not null,
  voice_type public.audio_voice_type not null default 'generated',
  language_code text not null default 'zh-CN',
  voice_name text,
  speech_speed public.speech_speed,
  duration_ms int check (duration_ms is null or duration_ms >= 0),
  file_size_bytes bigint check (file_size_bytes is null or file_size_bytes >= 0),
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists audio_assets_set_updated_at on public.audio_assets;
create trigger audio_assets_set_updated_at
before update on public.audio_assets
for each row execute function public.set_updated_at();

-- User learning state.
create table if not exists public.user_placement_answers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  question_external_id text not null,
  item_type public.item_type not null,
  item_external_id text not null,
  prompt jsonb not null default '{}'::jsonb,
  choices jsonb not null default '[]'::jsonb,
  correct_answer jsonb not null default '{}'::jsonb,
  user_answer jsonb not null default '{}'::jsonb,
  is_correct boolean not null default false,
  placement_version int not null default 1,
  created_at timestamptz not null default now()
);

create table if not exists public.user_unlocked_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  item_type public.item_type not null,
  item_external_id text not null,
  source_pack_id uuid references public.content_packs(id) on delete set null,
  unlocked_at timestamptz not null default now(),
  unique(user_id, item_type, item_external_id)
);

create table if not exists public.user_item_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  item_type public.item_type not null,
  item_external_id text not null,
  stage public.srs_stage not null default 'learning',
  interval_days int not null default 0 check (interval_days >= 0),
  first_seen_at timestamptz not null default now(),
  next_review_at timestamptz not null default now(),
  last_reviewed_at timestamptz,
  total_attempts int not null default 0 check (total_attempts >= 0),
  correct_attempts int not null default 0 check (correct_attempts >= 0),
  incorrect_attempts int not null default 0 check (incorrect_attempts >= 0),
  correct_streak int not null default 0 check (correct_streak >= 0),
  lapse_count int not null default 0 check (lapse_count >= 0),
  is_unlocked boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, item_type, item_external_id),
  constraint user_item_progress_attempts_consistent check (total_attempts >= correct_attempts + incorrect_attempts)
);

drop trigger if exists user_item_progress_set_updated_at on public.user_item_progress;
create trigger user_item_progress_set_updated_at
before update on public.user_item_progress
for each row execute function public.set_updated_at();

create table if not exists public.study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  pack_id uuid references public.content_packs(id) on delete set null,
  session_index int not null check (session_index >= 0),
  session_size public.session_size not null,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  minutes int not null default 0 check (minutes >= 0),
  total_items int not null default 0 check (total_items >= 0),
  correct_count int not null default 0 check (correct_count >= 0),
  attempt_count int not null default 0 check (attempt_count >= 0),
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.study_session_items (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.study_sessions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  item_type public.item_type not null,
  item_external_id text not null,
  phase public.study_phase not null,
  order_index int not null default 1 check (order_index >= 0),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  unique(session_id, item_type, item_external_id, phase)
);

create table if not exists public.review_attempts (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.study_sessions(id) on delete cascade,
  session_item_id uuid references public.study_session_items(id) on delete set null,
  user_id uuid not null references auth.users(id) on delete cascade,
  item_type public.item_type not null,
  item_external_id text not null,
  phase public.study_phase not null,
  question_type public.question_type not null default 'meaning_choice',
  prompt jsonb not null default '{}'::jsonb,
  choices jsonb not null default '[]'::jsonb,
  correct_answer jsonb not null default '{}'::jsonb,
  user_answer jsonb not null default '{}'::jsonb,
  result public.review_result not null,
  tone_answered int check (tone_answered is null or tone_answered between 0 and 4),
  tone_correct int check (tone_correct is null or tone_correct between 0 and 4),
  was_tone_correct boolean,
  response_ms int check (response_ms is null or response_ms >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.daily_activity (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  activity_date date not null,
  minutes int not null default 0 check (minutes >= 0),
  sessions int not null default 0 check (sessions >= 0),
  reviews int not null default 0 check (reviews >= 0),
  correct int not null default 0 check (correct >= 0),
  incorrect int not null default 0 check (incorrect >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, activity_date)
);

drop trigger if exists daily_activity_set_updated_at on public.daily_activity;
create trigger daily_activity_set_updated_at
before update on public.daily_activity
for each row execute function public.set_updated_at();

create table if not exists public.content_issue_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  item_type public.item_type,
  item_external_id text,
  issue_type public.issue_category not null default 'other',
  message text,
  status public.issue_status not null default 'open',
  app_version text,
  device_context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists content_issue_reports_set_updated_at on public.content_issue_reports;
create trigger content_issue_reports_set_updated_at
before update on public.content_issue_reports
for each row execute function public.set_updated_at();

-- One read-friendly union for frontend content browsing.
create or replace view public.v_content_items
with (security_invoker = true) as
select
  'component'::public.item_type as item_type,
  external_id,
  simplified as title,
  traditional as traditional_title,
  null::text as pinyin_diacritic,
  null::jsonb as pinyin_syllables,
  null::text as tone_pattern,
  meaning_en,
  meaning_id,
  mnemonic_en,
  mnemonic_id,
  null::text as audio_url,
  order_index,
  is_reviewable
from public.components
union all
select
  'hanzi'::public.item_type,
  external_id,
  simplified,
  traditional,
  pinyin_diacritic,
  pinyin_syllables,
  coalesce(tone_pattern, tone_number::text),
  meaning_en,
  meaning_id,
  mnemonic_en,
  mnemonic_id,
  audio_url,
  order_index,
  is_reviewable
from public.hanzi
union all
select
  'word'::public.item_type,
  external_id,
  simplified,
  traditional,
  pinyin_diacritic,
  pinyin_syllables,
  tone_pattern,
  meaning_en,
  meaning_id,
  mnemonic_en,
  mnemonic_id,
  audio_url,
  order_index,
  is_reviewable
from public.words
union all
select
  'sentence'::public.item_type,
  external_id,
  simplified,
  traditional,
  pinyin_diacritic,
  pinyin_syllables,
  tone_pattern,
  meaning_en,
  meaning_id,
  notes_en,
  notes_id,
  audio_url,
  order_index,
  is_reviewable
from public.sentences
union all
select
  'pattern'::public.item_type,
  external_id,
  title_en,
  title_en,
  structure,
  '[]'::jsonb,
  null::text,
  meaning_en,
  meaning_id,
  explanation_en,
  explanation_id,
  null::text,
  order_index,
  is_reviewable
from public.patterns
union all
select
  'intro_card'::public.item_type,
  external_id,
  title_en,
  null::text,
  null::text,
  null::jsonb,
  null::text,
  body_en,
  body_id,
  null::text,
  null::text,
  null::text,
  order_index,
  false
from public.intro_cards;

-- Indexes for common frontend/API access paths.
create index if not exists idx_content_packs_order on public.content_packs(order_index);
create index if not exists idx_pack_items_pack_order on public.pack_items(pack_id, order_index);
create index if not exists idx_pack_items_item on public.pack_items(item_type, item_external_id);
create index if not exists idx_study_flow_pack_section on public.study_flow_items(pack_id, section, order_index);
create index if not exists idx_item_prerequisites_item on public.item_prerequisites(item_type, item_external_id);
create index if not exists idx_item_prerequisites_prereq on public.item_prerequisites(prerequisite_type, prerequisite_external_id);
create index if not exists idx_user_item_progress_due on public.user_item_progress(user_id, next_review_at);
create index if not exists idx_user_item_progress_item on public.user_item_progress(user_id, item_type, item_external_id);
create index if not exists idx_study_session_items_session_order on public.study_session_items(session_id, order_index);
create index if not exists idx_review_attempts_user_created on public.review_attempts(user_id, created_at desc);
create index if not exists idx_study_sessions_user_index on public.study_sessions(user_id, session_index desc);
create index if not exists idx_daily_activity_user_date on public.daily_activity(user_id, activity_date desc);
create index if not exists idx_issue_reports_status on public.content_issue_reports(status, created_at desc);
create unique index if not exists idx_audio_assets_unique_source_speed
on public.audio_assets(item_type, item_external_id, voice_type, speech_speed) nulls not distinct;

-- RLS.
alter table public.profiles enable row level security;
alter table public.user_placement_answers enable row level security;
alter table public.user_unlocked_items enable row level security;
alter table public.user_item_progress enable row level security;
alter table public.study_sessions enable row level security;
alter table public.study_session_items enable row level security;
alter table public.review_attempts enable row level security;
alter table public.daily_activity enable row level security;
alter table public.content_issue_reports enable row level security;

alter table public.content_packs enable row level security;
alter table public.pack_tones enable row level security;
alter table public.components enable row level security;
alter table public.hanzi enable row level security;
alter table public.words enable row level security;
alter table public.sentences enable row level security;
alter table public.patterns enable row level security;
alter table public.intro_cards enable row level security;
alter table public.hanzi_components enable row level security;
alter table public.word_hanzi enable row level security;
alter table public.sentence_words enable row level security;
alter table public.sentence_patterns enable row level security;
alter table public.pack_items enable row level security;
alter table public.item_prerequisites enable row level security;
alter table public.study_flow_items enable row level security;
alter table public.audio_assets enable row level security;

drop policy if exists "public read content packs" on public.content_packs;
drop policy if exists "public read pack tones" on public.pack_tones;
drop policy if exists "public read components" on public.components;
drop policy if exists "public read hanzi" on public.hanzi;
drop policy if exists "public read words" on public.words;
drop policy if exists "public read sentences" on public.sentences;
drop policy if exists "public read patterns" on public.patterns;
drop policy if exists "public read intro cards" on public.intro_cards;
drop policy if exists "public read hanzi components" on public.hanzi_components;
drop policy if exists "public read word hanzi" on public.word_hanzi;
drop policy if exists "public read sentence words" on public.sentence_words;
drop policy if exists "public read sentence patterns" on public.sentence_patterns;
drop policy if exists "public read pack items" on public.pack_items;
drop policy if exists "public read prerequisites" on public.item_prerequisites;
drop policy if exists "public read study flow" on public.study_flow_items;
drop policy if exists "public read audio assets" on public.audio_assets;
drop policy if exists "users read own profile" on public.profiles;
drop policy if exists "users insert own profile" on public.profiles;
drop policy if exists "users update own profile" on public.profiles;
drop policy if exists "users manage own placement" on public.user_placement_answers;
drop policy if exists "users manage own unlocks" on public.user_unlocked_items;
drop policy if exists "users manage own progress" on public.user_item_progress;
drop policy if exists "users manage own sessions" on public.study_sessions;
drop policy if exists "users manage own session items" on public.study_session_items;
drop policy if exists "users manage own review attempts" on public.review_attempts;
drop policy if exists "users manage own daily activity" on public.daily_activity;
drop policy if exists "users insert issue reports" on public.content_issue_reports;
drop policy if exists "users read own issue reports" on public.content_issue_reports;

-- Published content is read-only for authenticated learner clients.
create policy "public read content packs" on public.content_packs for select using (auth.role() = 'authenticated' and is_active = true);
create policy "public read pack tones" on public.pack_tones for select using (auth.role() = 'authenticated');
create policy "public read components" on public.components for select using (auth.role() = 'authenticated');
create policy "public read hanzi" on public.hanzi for select using (auth.role() = 'authenticated');
create policy "public read words" on public.words for select using (auth.role() = 'authenticated');
create policy "public read sentences" on public.sentences for select using (auth.role() = 'authenticated');
create policy "public read patterns" on public.patterns for select using (auth.role() = 'authenticated');
create policy "public read intro cards" on public.intro_cards for select using (auth.role() = 'authenticated');
create policy "public read hanzi components" on public.hanzi_components for select using (auth.role() = 'authenticated');
create policy "public read word hanzi" on public.word_hanzi for select using (auth.role() = 'authenticated');
create policy "public read sentence words" on public.sentence_words for select using (auth.role() = 'authenticated');
create policy "public read sentence patterns" on public.sentence_patterns for select using (auth.role() = 'authenticated');
create policy "public read pack items" on public.pack_items for select using (auth.role() = 'authenticated');
create policy "public read prerequisites" on public.item_prerequisites for select using (auth.role() = 'authenticated');
create policy "public read study flow" on public.study_flow_items for select using (auth.role() = 'authenticated');
create policy "public read audio assets" on public.audio_assets for select using (auth.role() = 'authenticated');

-- Users own their private learning data.
create policy "users read own profile" on public.profiles for select using (id = auth.uid());
create policy "users insert own profile" on public.profiles for insert with check (id = auth.uid());
create policy "users update own profile" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());

create policy "users manage own placement" on public.user_placement_answers for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "users manage own unlocks" on public.user_unlocked_items for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "users manage own progress" on public.user_item_progress for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "users manage own sessions" on public.study_sessions for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "users manage own session items" on public.study_session_items for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "users manage own review attempts" on public.review_attempts for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "users manage own daily activity" on public.daily_activity for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "users insert issue reports" on public.content_issue_reports for insert with check (user_id = auth.uid());
create policy "users read own issue reports" on public.content_issue_reports for select using (user_id = auth.uid());

grant usage on schema public to anon, authenticated;
grant select on public.content_packs, public.pack_tones, public.components, public.hanzi, public.words,
  public.sentences, public.patterns, public.intro_cards, public.hanzi_components, public.word_hanzi,
  public.sentence_words, public.sentence_patterns, public.pack_items, public.item_prerequisites,
  public.study_flow_items, public.audio_assets, public.v_content_items
to authenticated;

grant select, insert, update, delete on public.profiles, public.user_placement_answers,
  public.user_unlocked_items, public.user_item_progress, public.study_sessions, public.study_session_items,
  public.review_attempts,
  public.daily_activity, public.content_issue_reports
to authenticated;
