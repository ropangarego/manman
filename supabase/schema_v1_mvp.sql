-- Manman! Supabase V1 MVP schema
-- Run this once in a fresh Supabase project before wiring the frontend.
-- Content is shared. User progress is per-user. SRS is intentionally simple for V1.

create extension if not exists pgcrypto;

create type app_language as enum ('en', 'id');
create type script_preference as enum ('simplified', 'traditional');
create type session_size as enum ('light', 'standard', 'intense');
create type pinyin_display as enum ('always', 'lesson_only', 'hidden_in_review', 'off');
create type review_style as enum ('simple', 'mixed', 'typed');

create type item_type as enum ('component', 'hanzi', 'word', 'sentence', 'pattern');
create type pack_item_role as enum ('primary', 'support', 'unlock');
create type srs_stage as enum ('learning', 'familiar', 'strong', 'mastered', 'long_term');
create type review_result as enum ('correct', 'incorrect', 'skipped');
create type study_phase as enum ('intro', 'learn', 'practice', 'review', 'summary', 'unlock');
create type question_type as enum (
  'meaning_choice',
  'meaning_typed',
  'pinyin_choice',
  'pinyin_typed',
  'tone_choice',
  'sentence_meaning',
  'self_check'
);
create type issue_category as enum (
  'wrong_meaning',
  'wrong_pinyin',
  'wrong_tone',
  'unnatural_example',
  'audio_problem',
  'typo',
  'other'
);
create type issue_status as enum ('open', 'reviewing', 'fixed', 'rejected', 'duplicate');
create type audio_source as enum ('browser_tts', 'generated_tts', 'native_recording');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  app_language app_language not null default 'en',
  script_preference script_preference not null default 'simplified',
  session_size session_size not null default 'standard',
  pinyin_display pinyin_display not null default 'always',
  review_style review_style not null default 'simple',
  tone_colors_enabled boolean not null default true,
  sound_enabled boolean not null default true,
  tutorial_hints_enabled boolean not null default true,
  dark_mode_enabled boolean not null default false,
  offline_mode_enabled boolean not null default false,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_placement_answers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  question_external_id text not null,
  item_type item_type not null,
  item_external_id text not null,
  prompt jsonb not null default '{}',
  choices jsonb not null default '[]',
  correct_answer jsonb not null default '{}',
  user_answer jsonb not null default '{}',
  is_correct boolean not null default false,
  placement_version int not null default 1,
  created_at timestamptz not null default now()
);

create table public.content_packs (
  id uuid primary key default gen_random_uuid(),
  external_id text not null unique,
  slug text not null unique,
  title_en text not null,
  title_id text,
  subtitle_en text,
  subtitle_id text,
  learning_goal_en text,
  learning_goal_id text,
  level int not null default 1 check (level >= 1),
  sort_order int not null,
  estimated_minutes int not null default 10,
  is_active boolean not null default true,
  source_filename text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(level, sort_order)
);

create table public.components (
  id uuid primary key default gen_random_uuid(),
  external_id text not null unique,
  simplified text not null,
  traditional text not null,
  meaning_en text not null,
  meaning_id text,
  mnemonic_en text,
  mnemonic_id text,
  examples text[] not null default '{}',
  level int not null default 1 check (level >= 1),
  sort_order int not null default 1,
  is_reviewable boolean not null default true,
  content_version int not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.hanzi (
  id uuid primary key default gen_random_uuid(),
  external_id text not null unique,
  simplified text not null,
  traditional text not null,
  pinyin_diacritic text not null,
  pinyin_numbered text,
  pinyin_syllables jsonb not null,
  tone_pattern text not null,
  meaning_en text not null,
  meaning_id text,
  mnemonic_en text,
  mnemonic_id text,
  notes_en text,
  notes_id text,
  examples text[] not null default '{}',
  level int not null default 1 check (level >= 1),
  sort_order int not null default 1,
  is_reviewable boolean not null default true,
  content_version int not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint hanzi_pinyin_syllables_not_empty check (jsonb_array_length(pinyin_syllables) > 0)
);

create table public.hanzi_components (
  hanzi_id uuid not null references public.hanzi(id) on delete cascade,
  component_id uuid not null references public.components(id) on delete restrict,
  sort_order int not null default 1,
  primary key (hanzi_id, component_id)
);

create table public.words (
  id uuid primary key default gen_random_uuid(),
  external_id text not null unique,
  simplified text not null,
  traditional text not null,
  pinyin_diacritic text not null,
  pinyin_numbered text,
  pinyin_syllables jsonb not null,
  tone_pattern text not null,
  meaning_en text not null,
  meaning_id text,
  mnemonic_en text,
  mnemonic_id text,
  notes_en text,
  notes_id text,
  examples text[] not null default '{}',
  level int not null default 1 check (level >= 1),
  sort_order int not null default 1,
  is_reviewable boolean not null default true,
  content_version int not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint words_pinyin_syllables_not_empty check (jsonb_array_length(pinyin_syllables) > 0)
);

create table public.word_hanzi (
  word_id uuid not null references public.words(id) on delete cascade,
  hanzi_id uuid not null references public.hanzi(id) on delete restrict,
  sort_order int not null default 1,
  primary key (word_id, hanzi_id)
);

create table public.patterns (
  id uuid primary key default gen_random_uuid(),
  external_id text not null unique,
  title_en text not null,
  title_id text,
  structure text not null,
  meaning_en text not null,
  meaning_id text,
  explanation_en text,
  explanation_id text,
  level int not null default 1 check (level >= 1),
  sort_order int not null default 1,
  is_reviewable boolean not null default false,
  content_version int not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.sentences (
  id uuid primary key default gen_random_uuid(),
  external_id text not null unique,
  simplified text not null,
  traditional text not null,
  pinyin_diacritic text not null,
  pinyin_numbered text,
  pinyin_syllables jsonb not null,
  meaning_en text not null,
  meaning_id text,
  pattern_id uuid references public.patterns(id) on delete set null,
  level int not null default 1 check (level >= 1),
  sort_order int not null default 1,
  is_reviewable boolean not null default true,
  content_version int not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint sentences_pinyin_syllables_not_empty check (jsonb_array_length(pinyin_syllables) > 0)
);

create table public.sentence_words (
  sentence_id uuid not null references public.sentences(id) on delete cascade,
  word_id uuid not null references public.words(id) on delete restrict,
  sort_order int not null default 1,
  is_focus_word boolean not null default true,
  primary key (sentence_id, word_id)
);

create table public.pack_items (
  id uuid primary key default gen_random_uuid(),
  pack_id uuid not null references public.content_packs(id) on delete cascade,
  item_type item_type not null,
  item_external_id text not null,
  role pack_item_role not null default 'support',
  sort_order int not null default 1,
  created_at timestamptz not null default now(),
  unique(pack_id, item_type, item_external_id)
);

create table public.item_prerequisites (
  id uuid primary key default gen_random_uuid(),
  item_type item_type not null,
  item_external_id text not null,
  prerequisite_type item_type not null,
  prerequisite_external_id text not null,
  required_stage srs_stage not null default 'familiar',
  created_at timestamptz not null default now(),
  unique(item_type, item_external_id, prerequisite_type, prerequisite_external_id)
);

create table public.user_unlocked_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  item_type item_type not null,
  item_external_id text not null,
  source_pack_id uuid references public.content_packs(id) on delete set null,
  unlocked_at timestamptz not null default now(),
  unique(user_id, item_type, item_external_id)
);

create table public.user_item_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  item_type item_type not null,
  item_external_id text not null,
  stage srs_stage not null default 'learning',
  interval_days int not null default 0,
  due_at timestamptz not null default now(),
  last_reviewed_at timestamptz,
  correct_count int not null default 0,
  incorrect_count int not null default 0,
  streak_correct int not null default 0,
  total_reviews int not null default 0,
  content_version_seen int not null default 1,
  needs_revalidation boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, item_type, item_external_id)
);

create table public.study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  session_size session_size not null,
  pack_id uuid references public.content_packs(id) on delete set null,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  total_items int not null default 0,
  correct_count int not null default 0,
  incorrect_count int not null default 0,
  created_at timestamptz not null default now()
);

create table public.study_session_items (
  id uuid primary key default gen_random_uuid(),
  study_session_id uuid not null references public.study_sessions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  phase study_phase not null,
  item_type item_type,
  item_external_id text,
  question_type question_type,
  prompt jsonb not null default '{}',
  choices jsonb not null default '[]',
  correct_answer jsonb not null default '{}',
  user_answer jsonb,
  result review_result,
  answered_at timestamptz,
  requeue_count int not null default 0 check (requeue_count <= 1),
  sort_order int not null default 1,
  created_at timestamptz not null default now()
);

create table public.review_attempts (
  id uuid primary key default gen_random_uuid(),
  study_session_item_id uuid not null references public.study_session_items(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  item_type item_type not null,
  item_external_id text not null,
  question_type question_type not null,
  user_answer jsonb,
  result review_result not null,
  meaning_correct boolean,
  pinyin_correct boolean,
  tone_correct boolean,
  created_at timestamptz not null default now()
);

create table public.user_daily_activity (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  activity_date date not null default current_date,
  minutes_studied int not null default 0,
  sessions_completed int not null default 0,
  reviews_completed int not null default 0,
  correct_count int not null default 0,
  incorrect_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, activity_date)
);

create table public.content_issue_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  item_type item_type not null,
  item_external_id text not null,
  category issue_category not null,
  description text,
  status issue_status not null default 'open',
  study_session_item_id uuid references public.study_session_items(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.audio_assets (
  id uuid primary key default gen_random_uuid(),
  item_type item_type not null,
  item_external_id text not null,
  source audio_source not null default 'browser_tts',
  voice_name text,
  lang text not null default 'zh-CN',
  storage_path text,
  public_url text,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  unique(item_type, item_external_id, source, voice_name)
);

create index content_packs_active_order_idx on public.content_packs(is_active, level, sort_order);
create index components_order_idx on public.components(level, sort_order);
create index hanzi_order_idx on public.hanzi(level, sort_order);
create index words_order_idx on public.words(level, sort_order);
create index sentences_order_idx on public.sentences(level, sort_order);
create index patterns_order_idx on public.patterns(level, sort_order);
create index pack_items_pack_order_idx on public.pack_items(pack_id, sort_order);
create index pack_items_item_idx on public.pack_items(item_type, item_external_id);
create index item_prerequisites_item_idx on public.item_prerequisites(item_type, item_external_id);
create index user_placement_answers_user_idx on public.user_placement_answers(user_id, created_at desc);
create index user_unlocked_items_user_idx on public.user_unlocked_items(user_id, unlocked_at desc);
create index user_item_progress_due_idx on public.user_item_progress(user_id, due_at);
create index user_item_progress_stage_idx on public.user_item_progress(user_id, stage);
create index study_sessions_user_started_idx on public.study_sessions(user_id, started_at desc);
create index study_session_items_session_idx on public.study_session_items(study_session_id, sort_order);
create index review_attempts_user_item_idx on public.review_attempts(user_id, item_type, item_external_id, created_at desc);
create index user_daily_activity_user_date_idx on public.user_daily_activity(user_id, activity_date desc);
create index content_issue_reports_status_idx on public.content_issue_reports(status, created_at desc);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger content_packs_set_updated_at before update on public.content_packs
for each row execute function public.set_updated_at();
create trigger components_set_updated_at before update on public.components
for each row execute function public.set_updated_at();
create trigger hanzi_set_updated_at before update on public.hanzi
for each row execute function public.set_updated_at();
create trigger words_set_updated_at before update on public.words
for each row execute function public.set_updated_at();
create trigger patterns_set_updated_at before update on public.patterns
for each row execute function public.set_updated_at();
create trigger sentences_set_updated_at before update on public.sentences
for each row execute function public.set_updated_at();
create trigger user_item_progress_set_updated_at before update on public.user_item_progress
for each row execute function public.set_updated_at();
create trigger user_daily_activity_set_updated_at before update on public.user_daily_activity
for each row execute function public.set_updated_at();
create trigger content_issue_reports_set_updated_at before update on public.content_issue_reports
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.content_packs enable row level security;
alter table public.components enable row level security;
alter table public.hanzi enable row level security;
alter table public.hanzi_components enable row level security;
alter table public.words enable row level security;
alter table public.word_hanzi enable row level security;
alter table public.patterns enable row level security;
alter table public.sentences enable row level security;
alter table public.sentence_words enable row level security;
alter table public.pack_items enable row level security;
alter table public.item_prerequisites enable row level security;
alter table public.user_placement_answers enable row level security;
alter table public.user_unlocked_items enable row level security;
alter table public.user_item_progress enable row level security;
alter table public.study_sessions enable row level security;
alter table public.study_session_items enable row level security;
alter table public.review_attempts enable row level security;
alter table public.user_daily_activity enable row level security;
alter table public.content_issue_reports enable row level security;
alter table public.audio_assets enable row level security;

create policy "read active packs" on public.content_packs
for select using (is_active = true);
create policy "read components" on public.components for select using (true);
create policy "read hanzi" on public.hanzi for select using (true);
create policy "read hanzi components" on public.hanzi_components for select using (true);
create policy "read words" on public.words for select using (true);
create policy "read word hanzi" on public.word_hanzi for select using (true);
create policy "read patterns" on public.patterns for select using (true);
create policy "read sentences" on public.sentences for select using (true);
create policy "read sentence words" on public.sentence_words for select using (true);
create policy "read pack items" on public.pack_items for select using (true);
create policy "read prerequisites" on public.item_prerequisites for select using (true);
create policy "read primary audio" on public.audio_assets
for select using (is_primary = true or source = 'browser_tts');

create policy "profiles own select" on public.profiles
for select using (auth.uid() = id);
create policy "profiles own update" on public.profiles
for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "profiles own insert" on public.profiles
for insert with check (auth.uid() = id);

create policy "placement own select" on public.user_placement_answers
for select using (auth.uid() = user_id);
create policy "placement own insert" on public.user_placement_answers
for insert with check (auth.uid() = user_id);

create policy "unlocked own select" on public.user_unlocked_items
for select using (auth.uid() = user_id);
create policy "progress own select" on public.user_item_progress
for select using (auth.uid() = user_id);
create policy "sessions own select" on public.study_sessions
for select using (auth.uid() = user_id);
create policy "session items own select" on public.study_session_items
for select using (auth.uid() = user_id);
create policy "review attempts own select" on public.review_attempts
for select using (auth.uid() = user_id);
create policy "daily activity own select" on public.user_daily_activity
for select using (auth.uid() = user_id);

create policy "users create reports" on public.content_issue_reports
for insert with check (auth.uid() = user_id);
create policy "users read own reports" on public.content_issue_reports
for select using (auth.uid() = user_id);

-- V1 scheduling recommendation:
-- correct: learning -> familiar -> strong -> mastered -> long_term
-- incorrect: move down one stage, or stay learning
-- intervals: learning 0 days, familiar 1 day, strong 3 days, mastered 7 days, long_term 21 days
-- Keep writes to user progress behind RPC functions once the API is connected.
