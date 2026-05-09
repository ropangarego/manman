# 05 — Database Setup: Supabase

## Mandarin Learning App — Database Setup + Schema

**Purpose:** make the app dev-ready for Supabase.

This document defines:

- Tables
- Fields
- Relationships
- Indexes
- Constraints
- RLS policies
- Seed content structure
- RPC functions
- SRS update logic
- Unlock logic
- Weak area logic
- Session generation logic
- Report issue flow
- Content versioning

This database supports the core app model:

```text
Components → Hanzi → Words → Sentences → Grammar Patterns
Lessons → Reviews → SRS → Unlocks → Weak areas
```

---

# 1. Database Design Principles

## 1.1 Keep Content Separate from User Progress

Content tables store learning material.

User tables store personal state.

```text
Content = shared by all users
Progress = unique per user
```

This allows you to update content without duplicating it per user.

## 1.2 Store Both Scripts

Every Mandarin content item that displays Chinese text should store:

```text
simplified
traditional
```

The user's setting decides which script is rendered.

## 1.3 Store Tone Data Explicitly

Do not calculate tone data only from pinyin strings.

Store:

```text
pinyin_diacritic
pinyin_numbered
pinyin_syllables
tone_pattern
```

Neutral tone must always be:

```text
0
```

## 1.4 Support Bilingual UI and Content

V1 app UI can be English + Indonesian.

V1 learning content is English-first.

Database should still include:

```text
*_en
*_id
```

Indonesian fields can be nullable until V2.

## 1.5 Make Review Logic Server-Side

Important learning actions should go through RPC functions:

```text
complete_lesson_pack
start_review_session
submit_review_answer
report_content_issue
```

This keeps the SRS logic consistent and harder to break from the frontend.

---

# 2. Recommended Postgres Extensions

Enable these if needed:

```sql
create extension if not exists pgcrypto;
```

Optional later:

```sql
create extension if not exists unaccent;
create extension if not exists pg_trgm;
```

Use `pg_trgm` later for better Library search.

---

# 3. Enum Types

Use enums to keep data consistent.

```sql
create type app_language as enum ('en', 'id');
create type script_preference as enum ('simplified', 'traditional');

create type item_type as enum (
  'component',
  'hanzi',
  'word',
  'sentence',
  'grammar_note'
);

create type lesson_item_role as enum ('primary', 'support');

create type review_question_type as enum (
  'meaning_recognition',
  'hanzi_recognition',
  'pinyin_recognition',
  'tone_recognition',
  'sentence_meaning',
  'fill_blank',
  'component_recall',
  'self_check'
);

create type weak_area_type as enum (
  'meaning',
  'hanzi',
  'pinyin',
  'tone',
  'sentence',
  'grammar',
  'recall'
);

create type srs_stage as enum (
  'learning',
  'familiar',
  'strong',
  'mastered',
  'long_term'
);

create type review_answer_result as enum (
  'correct',
  'incorrect',
  'forgot',
  'skipped'
);

create type content_change_type as enum ('minor', 'major');

create type issue_category as enum (
  'wrong_pinyin',
  'wrong_tone',
  'wrong_meaning',
  'unnatural_sentence',
  'wrong_script_variant',
  'audio_issue',
  'typo',
  'other'
);

create type issue_status as enum (
  'open',
  'reviewing',
  'fixed',
  'rejected',
  'duplicate'
);
```

---

# 4. User Tables

## 4.1 profiles

Stores user preferences and app settings.

```sql
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  app_language app_language not null default 'en',
  script_preference script_preference not null default 'simplified',
  daily_minutes int not null default 10 check (daily_minutes in (5, 10, 15)),
  sound_enabled boolean not null default true,
  notifications_enabled boolean not null default false,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

Indexes:

```sql
create index profiles_app_language_idx on public.profiles(app_language);
```

---

# 5. Content Tables

## 5.1 components

Visual building blocks used to explain hanzi.

```sql
create table public.components (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  character text not null,
  name_en text not null,
  name_id text,
  meaning_en text not null,
  meaning_id text,
  visual_hint_en text,
  visual_hint_id text,
  mnemonic_en text,
  mnemonic_id text,
  accepted_meanings_en text[] not null default '{}',
  accepted_meanings_id text[] not null default '{}',
  blocked_meanings_en text[] not null default '{}',
  blocked_meanings_id text[] not null default '{}',
  is_official_radical boolean not null default false,
  is_reviewable boolean not null default true,
  level int not null check (level >= 1),
  difficulty_rank int not null default 1 check (difficulty_rank between 1 and 5),
  frequency_rank int,
  content_version int not null default 1,
  change_type content_change_type,
  needs_revalidation boolean not null default false,
  last_reviewed_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

Indexes:

```sql
create index components_level_idx on public.components(level);
create index components_character_idx on public.components(character);
```

---

## 5.2 hanzi

Single Chinese character entries.

```sql
create table public.hanzi (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  simplified text not null,
  traditional text not null,
  pinyin_diacritic text not null,
  pinyin_numbered text not null,
  pinyin_syllables jsonb not null,
  tone_number int not null check (tone_number between 0 and 4),
  tone_pattern text not null,
  meaning_en text not null,
  meaning_id text,
  accepted_meanings_en text[] not null default '{}',
  accepted_meanings_id text[] not null default '{}',
  blocked_meanings_en text[] not null default '{}',
  blocked_meanings_id text[] not null default '{}',
  meaning_mnemonic_en text,
  meaning_mnemonic_id text,
  reading_mnemonic_en text,
  reading_mnemonic_id text,
  tone_mnemonic_en text,
  tone_mnemonic_id text,
  audio_url text,
  audio_key text,
  audio_speaker text,
  audio_variant text,
  hsk_level int,
  frequency_rank int,
  level int not null check (level >= 1),
  difficulty_rank int not null default 1 check (difficulty_rank between 1 and 5),
  is_reviewable boolean not null default true,
  content_version int not null default 1,
  change_type content_change_type,
  needs_revalidation boolean not null default false,
  last_reviewed_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint hanzi_unique_simplified unique (simplified),
  constraint hanzi_unique_traditional unique (traditional)
);
```

Indexes:

```sql
create index hanzi_level_idx on public.hanzi(level);
create index hanzi_hsk_level_idx on public.hanzi(hsk_level);
create index hanzi_frequency_rank_idx on public.hanzi(frequency_rank);
create index hanzi_tone_number_idx on public.hanzi(tone_number);
create index hanzi_pinyin_syllables_gin_idx on public.hanzi using gin (pinyin_syllables);
```

---

## 5.3 hanzi_components

Many-to-many relationship between hanzi and components.

```sql
create table public.hanzi_components (
  hanzi_id uuid not null references public.hanzi(id) on delete cascade,
  component_id uuid not null references public.components(id) on delete restrict,
  position text,
  sort_order int not null default 1,
  is_primary boolean not null default false,
  primary key (hanzi_id, component_id)
);
```

Indexes:

```sql
create index hanzi_components_component_idx on public.hanzi_components(component_id);
```

---

## 5.4 words

Main V1 learning unit.

```sql
create table public.words (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  simplified text not null,
  traditional text not null,
  pinyin_diacritic text not null,
  pinyin_numbered text not null,
  pinyin_syllables jsonb not null,
  tone_pattern text not null,
  meaning_en text not null,
  meaning_id text,
  accepted_meanings_en text[] not null default '{}',
  accepted_meanings_id text[] not null default '{}',
  blocked_meanings_en text[] not null default '{}',
  blocked_meanings_id text[] not null default '{}',
  part_of_speech text not null,
  mnemonic_en text,
  mnemonic_id text,
  usage_note_en text,
  usage_note_id text,
  audio_url text,
  audio_key text,
  audio_speaker text,
  audio_variant text,
  topic_tags text[] not null default '{}',
  hsk_level int,
  frequency_rank int,
  level int not null check (level >= 1),
  difficulty_rank int not null default 1 check (difficulty_rank between 1 and 5),
  is_core_word boolean not null default false,
  is_reviewable boolean not null default true,
  content_version int not null default 1,
  change_type content_change_type,
  needs_revalidation boolean not null default false,
  last_reviewed_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint words_unique_simplified unique (simplified),
  constraint words_unique_traditional unique (traditional)
);
```

Indexes:

```sql
create index words_level_idx on public.words(level);
create index words_hsk_level_idx on public.words(hsk_level);
create index words_frequency_rank_idx on public.words(frequency_rank);
create index words_topic_tags_gin_idx on public.words using gin (topic_tags);
create index words_pinyin_syllables_gin_idx on public.words using gin (pinyin_syllables);
```

---

## 5.5 word_hanzi

Many-to-many relationship between words and hanzi.

```sql
create table public.word_hanzi (
  word_id uuid not null references public.words(id) on delete cascade,
  hanzi_id uuid not null references public.hanzi(id) on delete restrict,
  sort_order int not null,
  primary key (word_id, hanzi_id)
);
```

Indexes:

```sql
create index word_hanzi_hanzi_idx on public.word_hanzi(hanzi_id);
```

---

## 5.6 grammar_notes

Short grammar explanations. Not SRS items in V1 by default.

```sql
create table public.grammar_notes (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  pattern text not null,
  title_en text not null,
  title_id text,
  formula text,
  explanation_en text not null,
  explanation_id text,
  common_mistakes_en text,
  common_mistakes_id text,
  level int not null check (level >= 1),
  difficulty_rank int not null default 1 check (difficulty_rank between 1 and 5),
  is_reviewable boolean not null default false,
  content_version int not null default 1,
  change_type content_change_type,
  needs_revalidation boolean not null default false,
  last_reviewed_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

Indexes:

```sql
create index grammar_notes_level_idx on public.grammar_notes(level);
```

---

## 5.7 sentences

Sentence examples and sentence review items.

```sql
create table public.sentences (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  simplified text not null,
  traditional text not null,
  pinyin_diacritic text not null,
  pinyin_numbered text not null,
  pinyin_syllables jsonb not null,
  translation_en text not null,
  translation_id text,
  literal_translation_en text,
  literal_translation_id text,
  usage_context_en text,
  usage_context_id text,
  accepted_meanings_en text[] not null default '{}',
  accepted_meanings_id text[] not null default '{}',
  blocked_meanings_en text[] not null default '{}',
  blocked_meanings_id text[] not null default '{}',
  audio_url text,
  audio_key text,
  audio_speaker text,
  audio_variant text,
  topic_tags text[] not null default '{}',
  grammar_note_id uuid references public.grammar_notes(id) on delete set null,
  level int not null check (level >= 1),
  difficulty_rank int not null default 1 check (difficulty_rank between 1 and 5),
  is_reviewable boolean not null default true,
  content_version int not null default 1,
  change_type content_change_type,
  needs_revalidation boolean not null default false,
  last_reviewed_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

Indexes:

```sql
create index sentences_level_idx on public.sentences(level);
create index sentences_topic_tags_gin_idx on public.sentences using gin (topic_tags);
create index sentences_grammar_note_idx on public.sentences(grammar_note_id);
create index sentences_pinyin_syllables_gin_idx on public.sentences using gin (pinyin_syllables);
```

---

## 5.8 sentence_words

Focus words used in a sentence.

```sql
create table public.sentence_words (
  sentence_id uuid not null references public.sentences(id) on delete cascade,
  word_id uuid not null references public.words(id) on delete restrict,
  sort_order int not null,
  is_focus_word boolean not null default true,
  primary key (sentence_id, word_id)
);
```

Indexes:

```sql
create index sentence_words_word_idx on public.sentence_words(word_id);
```

---

# 6. Lesson Pack Tables

## 6.1 lesson_packs

Themed groups of content used to introduce new items.

```sql
create table public.lesson_packs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title_en text not null,
  title_id text,
  theme_en text not null,
  theme_id text,
  learning_goal_en text not null,
  learning_goal_id text,
  level int not null check (level >= 1),
  sort_order int not null,
  estimated_minutes int not null default 10,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(level, sort_order)
);
```

Indexes:

```sql
create index lesson_packs_level_sort_idx on public.lesson_packs(level, sort_order);
create index lesson_packs_active_idx on public.lesson_packs(is_active);
```

---

## 6.2 lesson_pack_items

Links content items to lesson packs.

```sql
create table public.lesson_pack_items (
  id uuid primary key default gen_random_uuid(),
  lesson_pack_id uuid not null references public.lesson_packs(id) on delete cascade,
  item_type item_type not null,
  item_id uuid not null,
  item_role lesson_item_role not null default 'support',
  sort_order int not null,
  created_at timestamptz not null default now(),
  unique(lesson_pack_id, item_type, item_id)
);
```

Important note:

```text
Postgres cannot enforce a polymorphic foreign key directly.
The app/RPC must validate that item_id exists in the correct table for item_type.
```

Indexes:

```sql
create index lesson_pack_items_pack_idx on public.lesson_pack_items(lesson_pack_id, sort_order);
create index lesson_pack_items_item_idx on public.lesson_pack_items(item_type, item_id);
```

---

# 7. User Lesson Progress

## 7.1 user_lesson_packs

Tracks lesson completion per user.

```sql
create table public.user_lesson_packs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_pack_id uuid not null references public.lesson_packs(id) on delete cascade,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, lesson_pack_id)
);
```

Indexes:

```sql
create index user_lesson_packs_user_idx on public.user_lesson_packs(user_id);
create index user_lesson_packs_completed_idx on public.user_lesson_packs(user_id, completed_at);
```

---

# 8. User SRS Tables

## 8.1 user_srs_items

Stores each user's progress for reviewable items.

```sql
create table public.user_srs_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  item_type item_type not null,
  item_id uuid not null,
  srs_stage srs_stage not null default 'learning',
  interval_days int not null default 0,
  ease_factor numeric(4,2) not null default 2.50,
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
  unique(user_id, item_type, item_id)
);
```

Indexes:

```sql
create index user_srs_items_due_idx on public.user_srs_items(user_id, due_at);
create index user_srs_items_stage_idx on public.user_srs_items(user_id, srs_stage);
create index user_srs_items_item_idx on public.user_srs_items(item_type, item_id);
create index user_srs_items_revalidation_idx on public.user_srs_items(user_id, needs_revalidation);
```

---

# 9. Review Session Tables

## 9.1 review_sessions

Tracks one review session.

```sql
create table public.review_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  total_questions int not null default 0,
  correct_count int not null default 0,
  incorrect_count int not null default 0,
  created_at timestamptz not null default now()
);
```

Indexes:

```sql
create index review_sessions_user_started_idx on public.review_sessions(user_id, started_at desc);
```

---

## 9.2 review_session_questions

Stores generated questions for a session.

```sql
create table public.review_session_questions (
  id uuid primary key default gen_random_uuid(),
  review_session_id uuid not null references public.review_sessions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  user_srs_item_id uuid not null references public.user_srs_items(id) on delete cascade,
  item_type item_type not null,
  item_id uuid not null,
  question_type review_question_type not null,
  prompt jsonb not null default '{}',
  correct_answer jsonb not null default '{}',
  choices jsonb not null default '[]',
  answered_at timestamptz,
  user_answer jsonb,
  result review_answer_result,
  meaning_answered boolean,
  meaning_correct boolean,
  pinyin_answered boolean,
  pinyin_correct boolean,
  tone_answered boolean,
  tone_correct boolean,
  hanzi_answered boolean,
  hanzi_correct boolean,
  sentence_answered boolean,
  sentence_correct boolean,
  grammar_answered boolean,
  grammar_correct boolean,
  sort_order int,
  is_retry boolean not null default false,
  retry_of_question_id uuid references public.review_session_questions(id) on delete set null,
  created_at timestamptz not null default now()
);
```

Indexes:

```sql
create index review_session_questions_session_idx on public.review_session_questions(review_session_id);
create index review_session_questions_user_idx on public.review_session_questions(user_id);
create index review_session_questions_item_idx on public.review_session_questions(item_type, item_id);
create index review_session_questions_answered_idx on public.review_session_questions(user_id, answered_at);
create index review_session_questions_tone_idx on public.review_session_questions(user_id, tone_answered, tone_correct);
create index review_session_questions_retry_idx on public.review_session_questions(review_session_id, is_retry, retry_of_question_id);
create index review_session_questions_sort_idx on public.review_session_questions(review_session_id, sort_order);
```

Wrong-answer re-queue rule:

```text
Incorrect answer → show correction + mnemonic → re-queue after 3–5 other cards.
```

Each item should be re-queued only once per review session.

RPC rule:

```text
If result = incorrect
AND current question is_retry = false
AND no retry already exists for this original question in the same session
THEN insert a new review_session_questions row:
  is_retry = true
  retry_of_question_id = original question id
  sort_order = current sort_order + 3 to 5
```

If fewer than 3 cards remain, append the retry near the end of the session.

---

# 10. Weak Area Tables

## 10.1 user_weak_areas

Stores summarized weak area signals.

```sql
create table public.user_weak_areas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  weak_area weak_area_type not null,
  detail_key text,
  accuracy numeric(5,2),
  review_count int not null default 0,
  last_detected_at timestamptz not null default now(),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, weak_area, detail_key)
);
```

Examples of `detail_key`:

```text
tone_2_vs_3
tone_1_vs_4
question_type_pinyin_recognition
grammar_ma_question
```

Indexes:

```sql
create index user_weak_areas_user_active_idx on public.user_weak_areas(user_id, is_active);
```

---

# 11. User Item Notes

## 11.1 user_item_notes

Stores custom user mnemonics and personal notes for content items.

```sql
create table public.user_item_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  item_type item_type not null,
  item_id uuid not null,
  custom_meaning_mnemonic text,
  custom_reading_mnemonic text,
  custom_tone_mnemonic text,
  personal_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, item_type, item_id)
);
```

Indexes:

```sql
create index user_item_notes_user_idx on public.user_item_notes(user_id);
create index user_item_notes_item_idx on public.user_item_notes(item_type, item_id);
```

RLS:

```sql
alter table public.user_item_notes enable row level security;

create policy "user item notes own select"
on public.user_item_notes
for select using (auth.uid() = user_id);

create policy "user item notes own insert"
on public.user_item_notes
for insert with check (auth.uid() = user_id);

create policy "user item notes own update"
on public.user_item_notes
for update using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "user item notes own delete"
on public.user_item_notes
for delete using (auth.uid() = user_id);
```

UI usage:

```text
Item detail → Add your own mnemonic
Wrong-answer panel → Show app mnemonic + optional user mnemonic
Library item detail → Edit note
```

---

# 12. Report Issue Tables

## 11.1 content_issue_reports

Stores user-submitted content reports.

```sql
create table public.content_issue_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  item_type item_type not null,
  item_id uuid not null,
  lesson_pack_id uuid references public.lesson_packs(id) on delete set null,
  review_session_id uuid references public.review_sessions(id) on delete set null,
  question_id uuid references public.review_session_questions(id) on delete set null,
  issue_category issue_category not null,
  comment text,
  app_language app_language,
  script_preference script_preference,
  status issue_status not null default 'open',
  admin_notes text,
  resolved_by uuid,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

Indexes:

```sql
create index content_issue_reports_status_idx on public.content_issue_reports(status, created_at desc);
create index content_issue_reports_item_idx on public.content_issue_reports(item_type, item_id);
create index content_issue_reports_user_idx on public.content_issue_reports(user_id, created_at desc);
```

---

# 12. Daily Activity / Streak Tables

## 12.1 user_daily_activity

Stores daily activity summaries.

```sql
create table public.user_daily_activity (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  activity_date date not null,
  lessons_completed int not null default 0,
  reviews_completed int not null default 0,
  correct_count int not null default 0,
  incorrect_count int not null default 0,
  new_items_learned int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, activity_date)
);
```

Indexes:

```sql
create index user_daily_activity_user_date_idx on public.user_daily_activity(user_id, activity_date desc);
```

---

# 13. Seed Content Structure

Recommended seed order:

```text
1. components
2. hanzi
3. hanzi_components
4. words
5. word_hanzi
6. grammar_notes
7. sentences
8. sentence_words
9. lesson_packs
10. lesson_pack_items
```

Never seed a child item before its parent exists.

## 13.1 Prototype Target

```text
20 components
40 hanzi
80 words
30 sentences
10 grammar notes
10 lesson packs
```

## 13.2 V1 Launch Target

```text
50 components
100 hanzi
200 words
100 sentences
30 grammar notes
20 lesson packs
```

---

# 14. RLS Policies

Enable RLS on all tables.

```sql
alter table public.profiles enable row level security;
alter table public.components enable row level security;
alter table public.hanzi enable row level security;
alter table public.hanzi_components enable row level security;
alter table public.words enable row level security;
alter table public.word_hanzi enable row level security;
alter table public.grammar_notes enable row level security;
alter table public.sentences enable row level security;
alter table public.sentence_words enable row level security;
alter table public.lesson_packs enable row level security;
alter table public.lesson_pack_items enable row level security;
alter table public.user_lesson_packs enable row level security;
alter table public.user_srs_items enable row level security;
alter table public.review_sessions enable row level security;
alter table public.review_session_questions enable row level security;
alter table public.user_weak_areas enable row level security;
alter table public.content_issue_reports enable row level security;
alter table public.user_item_notes enable row level security;
alter table public.user_daily_activity enable row level security;
```

## 14.1 Public Read for Active Content

Content is shared read-only.

```sql
create policy "read components" on public.components
for select using (true);

create policy "read hanzi" on public.hanzi
for select using (true);

create policy "read hanzi components" on public.hanzi_components
for select using (true);

create policy "read words" on public.words
for select using (true);

create policy "read word hanzi" on public.word_hanzi
for select using (true);

create policy "read grammar notes" on public.grammar_notes
for select using (true);

create policy "read sentences" on public.sentences
for select using (true);

create policy "read sentence words" on public.sentence_words
for select using (true);

create policy "read active lesson packs" on public.lesson_packs
for select using (is_active = true);

create policy "read lesson pack items" on public.lesson_pack_items
for select using (true);
```

## 14.2 User Own Data Policies

Example pattern:

```sql
create policy "profiles select own" on public.profiles
for select using (auth.uid() = id);

create policy "profiles update own" on public.profiles
for update using (auth.uid() = id)
with check (auth.uid() = id);
```

Apply similar own-user policies:

```sql
create policy "user lesson packs own" on public.user_lesson_packs
for select using (auth.uid() = user_id);

create policy "user srs items own" on public.user_srs_items
for select using (auth.uid() = user_id);

create policy "review sessions own" on public.review_sessions
for select using (auth.uid() = user_id);

create policy "review questions own" on public.review_session_questions
for select using (auth.uid() = user_id);

create policy "weak areas own" on public.user_weak_areas
for select using (auth.uid() = user_id);

create policy "daily activity own" on public.user_daily_activity
for select using (auth.uid() = user_id);
```

For writes to SRS/reviews, prefer RPC functions with `security definer`.

User item notes can be written directly by the authenticated user because they are personal data protected by own-user RLS.

## 14.3 Report Issue Policies

Users can create reports.

```sql
create policy "users create content reports" on public.content_issue_reports
for insert with check (auth.uid() = user_id);

create policy "users read own content reports" on public.content_issue_reports
for select using (auth.uid() = user_id);
```

Admin review policies can be added later using custom claims or an admin table.

---

# 15. RPC Functions

## 15.1 get_today_summary

Purpose:

```text
Return Today page data.
```

Inputs:

```text
none, uses auth.uid()
```

Returns:

```text
reviews_due_count
next_lesson_pack
streak_count
words_learned_count
weak_area_summary
has_offline_cache_hint optional
```

---

## 15.2 get_next_lesson_pack

Purpose:

```text
Find the next active lesson pack the user has not completed.
```

Logic:

```text
1. Get completed lesson_pack_ids for user
2. Find first active lesson_pack ordered by level, sort_order
3. Exclude completed packs
4. Return pack with items
```

---

## 15.3 complete_lesson_pack

Purpose:

```text
Mark lesson pack complete and add primary reviewable items to user_srs_items.
```

Inputs:

```text
p_lesson_pack_id uuid
```

Logic:

```text
1. Verify user is authenticated
2. Upsert user_lesson_packs completed_at
3. Get lesson_pack_items where item_role = primary
4. For each primary item:
   - confirm item is_reviewable = true
   - insert into user_srs_items if not exists
   - due_at = now()
   - content_version_seen = current item content_version
5. Update user_daily_activity
6. Return summary
```

Important:

```text
Support items do not enter SRS automatically.
```

---

## 15.4 start_review_session

Purpose:

```text
Create a review session from due SRS items.
```

Inputs:

```text
p_limit int default 12
```

Logic:

```text
1. Get due user_srs_items where due_at <= now()
2. Prioritize:
   - needs_revalidation items
   - active weak area items
   - oldest due items
   - learning stage items
3. Limit by p_limit
4. Create review_sessions row
5. Generate review_session_questions
6. Return session with questions
```

Question generation should consider item type:

```text
word → meaning, hanzi, pinyin, tone
hanzi → meaning, pinyin, component recall, tone
sentence → sentence meaning, fill blank
component → meaning/component recall
```

---

## 15.5 submit_review_answer

Purpose:

```text
Submit one answer, score it, update SRS, and record weak area data.
```

Inputs:

```text
p_question_id uuid
p_user_answer jsonb
p_self_check_result text optional
```

Important tracked fields:

```text
meaning_answered
meaning_correct
pinyin_answered
pinyin_correct
tone_answered
tone_correct
hanzi_answered
hanzi_correct
sentence_answered
sentence_correct
grammar_answered
grammar_correct
```

Logic:

```text
1. Verify question belongs to auth.uid()
2. Score answer based on question_type
3. Separate pinyin correctness from tone correctness
4. Write result to review_session_questions
5. Update user_srs_items:
   - stage
   - interval_days
   - ease_factor
   - due_at
   - counts
6. Update review_sessions summary counts
7. Update user_daily_activity
8. Recalculate weak areas if needed
9. Return feedback payload
```

Return payload:

```text
result
correct_answer
short_explanation
weak_area_triggered
next_due_at
new_srs_stage
```

---

## 15.6 report_content_issue

Purpose:

```text
Create a content issue report.
```

Inputs:

```text
p_item_type item_type
p_item_id uuid
p_issue_category issue_category
p_comment text nullable
p_lesson_pack_id uuid nullable
p_review_session_id uuid nullable
p_question_id uuid nullable
```

Logic:

```text
1. Verify user is authenticated
2. Insert content_issue_reports
3. Capture user profile app_language and script_preference
4. Return confirmation
```

Return:

```text
Thanks. We’ll review this item.
```

---

## 15.7 update_content_version

Admin-only later.

Purpose:

```text
Safely update content version after fixes.
```

Logic:

```text
If change_type = minor:
  increment content_version
  do not change user progress

If change_type = major:
  increment content_version
  mark affected user_srs_items.needs_revalidation = true
```

---

# 16. SRS Logic

## 16.1 Simple V1 SRS Schedule

Use a simple schedule first.

```text
learning   → same day / 10 minutes later
familiar   → 1 day
strong     → 3 days
mastered   → 7 days
long_term  → 21 days
```

## 16.2 Correct Answer Update

```text
correct_count += 1
total_reviews += 1
streak_correct += 1
incorrect_count unchanged
move up one stage when appropriate
increase interval
due_at = now() + interval
```

## 16.3 Incorrect Answer Update

```text
incorrect_count += 1
total_reviews += 1
streak_correct = 0
move down stage or stay learning
due_at = soon
```

Recommended incorrect interval:

```text
learning/relearn: 10 minutes to 1 hour
```

For V1, if exact minute-level scheduling is too much, use:

```text
due_at = now()
```

so it can reappear in the current or next review session.

## 16.4 Stage Movement

Suggested simple rules:

```text
Correct:
learning → familiar
familiar → strong
strong → mastered
mastered → long_term
long_term → long_term

Incorrect:
long_term → mastered
mastered → strong
strong → familiar
familiar → learning
learning → learning
```

## 16.5 Self-Check Mapping

For self-check cards:

```text
Got it = correct
Forgot = incorrect
```

---

# 17. Answer Matching Logic

## 17.1 Meaning Matching

```text
1. Normalize user answer:
   - lowercase
   - trim spaces
   - remove repeated spaces
2. Compare to accepted_meanings
3. Reject if in blocked_meanings
4. Allow minor typo only in lenient mode
```

Do not accept every synonym automatically.

## 17.2 Pinyin Matching

Accept:

```text
pinyin_diacritic exact
pinyin_numbered exact
```

Level 1 beginner mode:

```text
toneless pinyin can be accepted for pinyin_correct
but tone_correct = false or not answered depending on question type
```

Level 2+:

```text
correct tone required
```

## 17.3 Tone Matching

Tone questions require exact tone pattern.

Example:

```text
Correct: 3-3-0
User:    3-3-5
Result: incorrect
```

Neutral tone must be `0`.

---

# 18. Unlock Logic

The app uses a hybrid unlock model:

```text
Lesson packs = recommended learning flow
Item prerequisites = actual unlock rules
SRS Familiar = unlock trigger
```

This keeps the app beginner-friendly while preserving the WaniKani-style feeling:

```text
I learned this → something new opened.
```

---

## 18.1 State Model

Use a separate unlock table instead of overloading `user_srs_items`.

```text
Locked    → no row in user_unlocked_items
Unlocked  → row exists in user_unlocked_items, but item is not in SRS yet
Learning  → row exists in user_srs_items
```

This keeps these concepts separate:

```text
user_unlocked_items = user can now learn this item
user_srs_items      = item has entered the review system
```

---

## 18.2 item_prerequisites

Defines which items must reach a required SRS stage before another item unlocks.

```sql
create table public.item_prerequisites (
  id uuid primary key default gen_random_uuid(),
  item_type item_type not null,
  item_id uuid not null,
  prerequisite_type item_type not null,
  prerequisite_id uuid not null,
  required_srs_stage srs_stage not null default 'familiar',
  created_at timestamptz not null default now(),
  unique(item_type, item_id, prerequisite_type, prerequisite_id)
);
```

Indexes:

```sql
create index item_prerequisites_item_idx
on public.item_prerequisites(item_type, item_id);

create index item_prerequisites_prereq_idx
on public.item_prerequisites(prerequisite_type, prerequisite_id);
```

Important note:

```text
Postgres cannot enforce polymorphic foreign keys directly.
The seed script or RPC must validate that item_id and prerequisite_id exist in the correct content tables.
```

---

## 18.3 user_unlocked_items

Tracks items a user has earned but may not have started reviewing yet.

```sql
create table public.user_unlocked_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  item_type item_type not null,
  item_id uuid not null,
  source_lesson_pack_id uuid references public.lesson_packs(id) on delete set null,
  unlocked_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique(user_id, item_type, item_id)
);
```

Indexes:

```sql
create index user_unlocked_items_user_idx
on public.user_unlocked_items(user_id, unlocked_at desc);

create index user_unlocked_items_item_idx
on public.user_unlocked_items(item_type, item_id);

create index user_unlocked_items_source_pack_idx
on public.user_unlocked_items(source_lesson_pack_id);
```

RLS:

```sql
alter table public.user_unlocked_items enable row level security;

create policy "user unlocked items own"
on public.user_unlocked_items
for select using (auth.uid() = user_id);
```

Writes should happen through RPC.

---

## 18.4 Basic V1 Prerequisite Rules

Keep V1 simple.

```text
Component → Hanzi
Hanzi → Word
Words → Sentence
Sentences → Grammar pattern/context
```

Suggested unlock rules:

```text
A hanzi unlocks when its required components are Familiar.
A word unlocks when its required hanzi are Familiar.
A sentence unlocks when its focus words are Familiar.
```

Early beginner content can skip strict prerequisites when needed.

Example:

```text
Level 1 survival words can be manually unlocked or seeded as starter content.
```

---

## 18.5 Starter Unlocks

When a new user completes onboarding, the app should unlock the first starter items.

Examples:

```text
First lesson pack
Basic components
Essential Level 1 words
```

This can happen in a setup RPC:

```text
initialize_user_learning_state
```

or inside onboarding completion.

Starter items should be minimal.

---

## 18.6 unlock_available_items RPC

Purpose:

```text
Check whether the user has met item prerequisites and insert newly unlocked items into user_unlocked_items.
```

When to call:

```text
after submit_review_answer
after completing a review session
after complete_lesson_pack
optionally when opening Today page
```

Inputs:

```text
none, uses auth.uid()
```

Logic:

```text
1. Get all candidate items that are not already in user_unlocked_items.
2. For each candidate item, get its prerequisites.
3. If item has no prerequisites:
   - only unlock if it is starter content or allowed by level/pack rules.
4. For each prerequisite:
   - find user's matching user_srs_items row
   - confirm srs_stage >= required_srs_stage
5. If all prerequisites pass:
   - insert into user_unlocked_items
6. Return newly unlocked item count and item list.
```

Return payload:

```text
newly_unlocked_count
newly_unlocked_items
```

Example UI usage:

```text
3 new items unlocked.
```

---

## 18.7 Lesson Packs + Unlock Gate

Lesson packs still define the recommended learning flow.

But primary items should only enter SRS if they are already unlocked.

Rule:

```text
lesson_pack_items.item_role = primary
AND item exists in user_unlocked_items
AND item is_reviewable = true
→ can enter user_srs_items
```

Support items can be shown for context even if they are not SRS-ready yet, as long as the lesson remains understandable.

---

## 18.8 Updated complete_lesson_pack Logic

The `complete_lesson_pack` RPC must respect the unlock gate.

Updated logic:

```text
1. Verify user is authenticated.
2. Mark lesson pack complete.
3. Get lesson_pack_items where item_role = primary.
4. For each primary item:
   - check item exists in user_unlocked_items
   - check item is_reviewable = true
   - insert into user_srs_items if not exists
   - set source_lesson_pack_id
   - set content_version_seen
5. Do not insert locked primary items into SRS.
6. Call unlock_available_items after completion.
7. Update user_daily_activity.
8. Return completed count + skipped_locked count + newly_unlocked count.
```

Return payload:

```text
lesson_pack_completed
items_added_to_srs
locked_items_skipped
newly_unlocked_items
```

---

## 18.9 Updated get_today_summary Logic

The Today summary should combine:

```text
reviews due
unlocked items not yet in SRS
next recommended lesson pack
weak area priority
session length cap
```

Important display rule:

```text
Show review cap as "15 of 64 due", not "64 overdue reviews".
```

Suggested session caps:

```text
5 minutes  → up to 6 reviews
10 minutes → up to 15 reviews
15 minutes → up to 25 reviews
```

Today priority:

```text
1. Revalidation items
2. Due reviews
3. Weak area reviews
4. New unlocked items
5. Next lesson pack
```

The Today page should not overwhelm the user with the full backlog.

---

## 18.10 Flexible Rule

Do not let the prerequisite system make V1 feel blocked.

Use prerequisites to create the unlock feeling, but keep starter content and early packs forgiving.

Good V1 behavior:

```text
The user completes reviews.
Some items reach Familiar.
New words unlock.
Today shows a small new lesson using those unlocked items.
```

Avoid:

```text
The user cannot do anything because one prerequisite component is missing.
```

---

# 19. Weak Area Logic

## 19.1 Weak Area Rule

A weak area becomes active when:

```text
accuracy below 70%
within last 20 relevant reviews
AND at least 5 completed reviews in that group
```

## 19.2 Groups

Track weak areas by:

```text
weak_area type
question_type
tone confusion pair
grammar marker
item type
```

## 19.3 Tone Confusion Pairs

Important pairs:

```text
tone_2_vs_3
tone_1_vs_4
tone_3_vs_4
```

## 19.4 Progress Display

Do not show raw technical data first.

Good UI copy:

```text
Tone 2 vs Tone 3 needs practice.
We’ll add more tone reviews.
```

---

# 20. Session Generation Logic

## 20.1 Today Session

A Today session can include:

```text
new lesson if available
reviews due
weak area practice if enough data exists
```

## 20.2 Review Prioritization

Priority order:

```text
1. needs_revalidation items
2. overdue items
3. weak area items
4. learning stage items
5. oldest due items
```

## 20.3 Daily Limit

Use `profiles.daily_minutes` to choose session size.

Suggested mapping:

```text
5 minutes  → 6 review questions or 3 new words
10 minutes → 12 review questions or 5 new words
15 minutes → 20 review questions or 5 new words + more reviews
```

---

# 21. Views for Frontend Convenience

Optional but useful.

## 21.1 v_user_due_reviews

```sql
create view public.v_user_due_reviews as
select
  usi.*
from public.user_srs_items usi
where usi.due_at <= now();
```

Use carefully with RLS.

## 21.2 v_lesson_pack_summary

Returns lesson pack with item counts.

```sql
create view public.v_lesson_pack_summary as
select
  lp.id,
  lp.slug,
  lp.title_en,
  lp.title_id,
  lp.level,
  lp.sort_order,
  lp.estimated_minutes,
  count(lpi.id) filter (where lpi.item_role = 'primary') as primary_count,
  count(lpi.id) filter (where lpi.item_role = 'support') as support_count
from public.lesson_packs lp
left join public.lesson_pack_items lpi on lpi.lesson_pack_id = lp.id
group by lp.id;
```

---

# 22. Updated At Trigger

Use a reusable trigger.

```sql
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;
```

Apply to tables with `updated_at`.

Example:

```sql
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();
```

Repeat for:

```text
components
hanzi
words
grammar_notes
sentences
lesson_packs
user_lesson_packs
user_srs_items
user_weak_areas
content_issue_reports
user_item_notes
user_daily_activity
```

---

# 23. Recommended Build Order

Build database in this order:

```text
1. Enums
2. profiles
3. content tables
4. relationship tables
5. lesson pack tables
6. user lesson progress
7. user SRS tables
8. review session tables
9. weak area tables
10. user item notes table
11. report issue table
12. daily activity table
12. RLS policies
13. seed content
14. RPC: get_next_lesson_pack
15. RPC: complete_lesson_pack
16. RPC: start_review_session
17. RPC: submit_review_answer
18. RPC: report_content_issue
19. Today summary RPC
```

For ASAP V1, build minimum first:

```text
profiles
content tables
lesson_packs
lesson_pack_items
user_srs_items
review_sessions
review_session_questions
content_issue_reports
RPC core functions
```

Weak area aggregation can start simple and become smarter later.

---

# 24. V1 Minimum Database Scope

To launch a working V1, you need:

```text
profiles
components
hanzi
hanzi_components
words
word_hanzi
sentences
sentence_words
grammar_notes
lesson_packs
lesson_pack_items
user_lesson_packs
user_srs_items
review_sessions
review_session_questions
content_issue_reports
user_daily_activity
```

Optional but useful:

```text
user_weak_areas
views
admin content versioning RPC
```

---

# 25. Final Database North Star

The database should make this easy:

```text
Add clean content.
Introduce it through lesson packs.
Move primary items into SRS.
Generate reviews.
Track wrong answers by weak area.
Let users report mistakes.
Update content safely without breaking progress.
```

The goal is not a perfect academic Mandarin database.

The goal is a practical learning system that can ship fast and improve safely.

