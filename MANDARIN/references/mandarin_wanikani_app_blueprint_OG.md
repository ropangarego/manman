# Mandarin WaniKani-Style App Blueprint

## 0. Product Summary

**Working name:** Mandarin Loop / HanziLoop / MandarinKani  
**Product type:** Lightweight PWA web app  
**Core idea:** A Mandarin version of WaniKani, adapted for Mandarin learners who want practical progress quickly.

The app should have two separate models:

```text
User-facing learning experience:
Useful Hanzi → Components → Mnemonic → Related Words → Sentence → Quiz/Review
```

```text
Behind-the-scenes content structure:
Components / Radicals → Hanzi → Words → Sentences → Grammar Patterns
```

The goal is not to build a full “everything Mandarin” app. The goal is to help users acquire Mandarin characters, vocabulary, sentence understanding, and basic grammar with minimum daily effort.

Important distinction: users should not feel like they must study random abstract components before learning useful Mandarin. The app should feel **character-first and practical**, while components/radicals work behind the scenes as memory tools and unlock logic.

## 1. Main Product Goal

Help users build Mandarin fluency foundations through:

- short daily sessions: 5, 10, or 15 minutes
- SRS reviews
- component/radical-based hanzi learning
- mnemonics
- tone color visuals
- useful vocabulary
- sentence examples
- grammar patterns
- optional audio via TTS
- no mandatory speaking in V1

## 2. Research-Based Principles

This app is based on three major ideas:

### 2.1 Mandarin-specific learning

Mandarin learning should focus on:

- tones early
- radicals/components
- hanzi structure
- mnemonics
- vocabulary in context
- useful sentences
- interactive review

### 2.2 Effective studying

The app should use:

- retrieval practice
- spaced repetition
- interleaving
- elaboration
- visual + verbal memory
- successive relearning

### 2.3 Good app design

The app should be:

- simple
- fast
- consistent
- touch-friendly
- usable in short interrupted sessions
- not overloaded with choices
- PWA-ready
- offline-friendly where possible

## 3. V1 Product Scope

### V1 should include

1. Onboarding
2. Daily session length setting: 5 / 10 / 15 minutes
3. Dashboard / Today page
4. Lessons
5. Reviews
6. Library
7. Progress
8. Settings
9. SRS system
10. Unlock system
11. Components/radicals
12. Hanzi cards
13. Word cards
14. Sentence cards
15. Grammar pattern cards
16. Mnemonics
17. Tone color visuals
18. TTS audio

### V1 should not include yet

1. Mandatory speaking
2. AI conversation partner
3. Speech recognition
4. Pitch curve analysis
5. Handwriting recognition
6. Complex gamification
7. Social/community features
8. Long grammar lectures
9. Full native-speaker audio library

## 4. Core Learning Model

### 4.1 The important design rule

The app should **feel character-first**, not component-first.

This means the lesson experience should start from a useful Mandarin item, usually a high-frequency hanzi, word, or sentence. Then the app explains the components behind it.

```text
User-facing lesson flow:
Useful Hanzi → Components → Mnemonic → Related Words → Sentence → Quiz
```

But the data model and unlock system can still be structured like WaniKani:

```text
Behind-the-scenes structure:
Components / Radicals → Hanzi → Words → Sentences → Grammar Patterns
```

Why this matters:

```text
Character-first = practical and motivating
Component-backed = easier to remember and scalable
```

The user should not feel blocked by abstract component lessons. Components should appear naturally as part of learning useful hanzi.

### 4.2 Learning hierarchy behind the scenes

```text
Level
 └── Components / Radicals
      └── Hanzi
           └── Words
                └── Sentences
                     └── Grammar Patterns
```

### 4.3 User-facing lesson example

```text
Today’s Hanzi:
家
jiā
home

Components:
宀 = roof
豕 = pig / animal

Mnemonic:
A home is a roof over the family.

Related Words:
家人 = family member
回家 = go home
大家 = everyone

Sentence:
我回家。
Wǒ huí jiā.
I go home.

Quiz:
What does 家 mean?
How do you read 家?
What does 回家 mean?
What does 我回家 mean?
```

### 4.4 Behind-the-scenes unlock example

```text
Component:
宀 = roof

Component:
豕 = pig / animal

Unlocked / supported Hanzi:
家 = home

Unlocked Words:
家人 = family member
回家 = go home
大家 = everyone

Unlocked Sentence:
我回家。
Wǒ huí jiā.
I go home.

Unlocked Grammar Pattern:
Subject + Verb + Object
```

The user may learn 家 first, but the system still records that 家 is made from 宀 and 豕. This gives the app structure without making the lesson feel abstract.

## 5. Daily Session Design

The user chooses session length once during onboarding:

```text
How long do you want your daily Mandarin session?

[5 min] [10 min] [15 min]
```

This is saved in:

```text
user_settings.daily_session_minutes
```

The app should not ask again every day. The user can change it later in Settings.

## 6. Session Types

### 6.1 5-minute session

Best for busy days.

```text
New items: 2–3
Reviews: 5–8
Sentence: 1
Grammar: optional / none
```

Flow:

```text
1. Quick Review
2. Learn 1–2 new items
3. Mini quiz
4. Finish
```

### 6.2 10-minute session

Recommended default.

```text
New items: 3–5
Reviews: 10–15
Sentences: 1–2
Grammar: 1 light pattern if available
```

Flow:

```text
1. Due reviews
2. New lesson
3. Quiz
4. Sentence usage
5. Finish
```

### 6.3 15-minute session

For motivated days.

```text
New items: 5–8
Reviews: 15–25
Sentences: 2–3
Grammar: 1 pattern
```

Flow:

```text
1. Due reviews
2. Components/hanzi lesson
3. Word lesson
4. Sentence lesson
5. Quiz
6. Finish
```

## 7. Core Loop

The app should always follow this loop:

```text
Lesson → Quiz → SRS Review → Unlock More Content
```

For normal users, the main lesson flow should be:

```text
Useful Hanzi → Components → Mnemonic → Related Words → Sentence → Immediate Quiz
```

### 7.1 Lesson

User learns new material in a guided card style.

Lesson cards can feel like flip cards, but they should not be passive only. A lesson should reveal information step by step:

```text
Front:
家

Reveal:
jiā
home

Then:
Components
Mnemonic
Related words
Example sentence
```

Supported lesson item types:

- hanzi
- component
- word
- sentence
- grammar pattern

Components can have their own lessons, but they should usually be introduced when they help explain a useful hanzi.

### 7.2 Quiz

User recalls the material:

- meaning
- reading
- tone
- component
- sentence usage

### 7.3 Review

System schedules the item for later review.

### 7.4 Unlock

When prerequisites are passed, the next item unlocks.

## 8. SRS System

### 8.1 Simple SRS stages

```text
Lesson
Apprentice 1
Apprentice 2
Apprentice 3
Guru
Master
Enlightened
Burned
```

### 8.2 Suggested intervals

```text
Apprentice 1 → 4 hours
Apprentice 2 → 8 hours
Apprentice 3 → 1 day
Guru → 3 days
Master → 1 week
Enlightened → 2 weeks
Burned → 1 month+
```

For V1, you can simplify:

```text
Again → same day
Hard → tomorrow
Good → 3 days
Easy → 7 days
```

### 8.3 Review result buttons

Use simple buttons:

```text
Again
Hard
Good
Easy
```

Or for a more WaniKani-like system:

```text
Correct
Incorrect
```

My recommendation for V1:

```text
Correct / Incorrect
```

Then internally adjust the SRS stage.

## 9. Tone Color System

Tone color should be visible everywhere pinyin appears.

### 9.1 Recommended tone colors

```text
Tone 1 = Blue
Tone 2 = Green
Tone 3 = Orange
Tone 4 = Red
Neutral = Gray
```

### 9.2 Example

```text
mā = blue
má = green
mǎ = orange
mà = red
ma = gray
```

### 9.3 Where to use tone colors

- lesson cards
- review cards
- library cards
- related words
- sentence pinyin
- search results
- grammar examples
- item detail pages

### 9.4 Display options

Best V1 format:

```text
jiā [T1]
```

The pinyin text is colored, and a small tone badge can appear beside it.

## 10. Audio Strategy

### 10.1 V1 audio approach

Use browser/device Text-to-Speech first.

Example:

```js
const utterance = new SpeechSynthesisUtterance("家");
utterance.lang = "zh-CN";
speechSynthesis.speak(utterance);
```

### 10.2 Why TTS first

Pros:

- no storage cost
- no large audio library
- works for characters, words, and sentences
- good enough for V1
- easier to build

Cons:

- voice quality depends on browser/device
- tones may not always sound perfect
- less natural than native speaker audio

### 10.3 Later native audio strategy

In V2/V3, store curated native audio only for:

- core characters
- high-frequency words
- common sentences
- confusing tone pairs
- important pronunciation examples

Storage structure:

```text
Supabase Storage

/audio/characters/jia1.mp3
/audio/words/huijia2.mp3
/audio/sentences/wo-hui-jia.mp3
```

Database fields:

```text
audio_url
audio_source
audio_quality
```

Compression:

```text
Format: MP3 or OGG
Bitrate: 32–64 kbps
Channel: mono
Loading: lazy-load
Offline: cache only high-frequency items
```

## 11. Page Blueprint

## 11.1 Onboarding Page

### Purpose

Set user preferences and reduce friction.

### Flow

```text
Welcome
→ Choose script
→ Choose session length
→ Choose daily goal
→ Start first lesson
```

### Step 1: Welcome

```text
Learn Mandarin in small daily sessions.

Components → Hanzi → Words → Sentences
```

CTA:

```text
Start
```

### Step 2: Script preference

```text
Which script do you want to learn?

[Simplified]
[Traditional]
[Both later]
```

V1 recommendation:

```text
Simplified first
Traditional later
```

### Step 3: Session length

```text
How long do you want your daily session?

[5 min]
[10 min]
[15 min]
```

Default:

```text
10 min
```

### Step 4: Goal

```text
What is your main goal?

[Travel]
[Daily Conversation]
[Reading]
[General Mandarin]
```

For V1, this can affect content ordering but does not need a complex algorithm yet.

## 11.2 Today Page

### Purpose

The main daily action page.

### Layout

```text
Today

Daily Session
10 minutes

[Start Session]

Due Reviews: 12
New Lessons: 4
Unlocked Items: 3

Progress
Level 1
Apprentice: 18
Guru: 6
Burned: 0
```

### Main CTA

```text
Start Session
```

### Rules

- one main button
- no clutter
- no decision fatigue
- continue session if unfinished

## 11.3 Lesson Page

### Purpose

Teach new content with a practical, character-first flow.

### Recommended default lesson flow

```text
1. Show useful hanzi
2. Show pinyin + meaning
3. Explain components
4. Give mnemonic
5. Show related words
6. Show example sentence
7. Immediate quiz
```

This is the main difference from a pure WaniKani clone: the user does not need to learn many abstract components first. The app starts from useful Mandarin, then uses components to make it memorable.

### Lesson item types

- hanzi
- component
- word
- sentence
- grammar pattern

### Component lesson layout

```text
宀

roof

Mnemonic:
This component looks like a roof over a house.

Unlocks:
家
安
字
```

### Hanzi lesson layout

```text
家
jiā
home

Components:
宀 roof
豕 pig / animal

Mnemonic:
A home is a roof over the family.

Related:
家人 family member
回家 go home
大家 everyone
```

### Word lesson layout

```text
回家
huí jiā
go home

Characters:
回 return
家 home

Mnemonic:
Return + home = go back home.

Example:
我回家。
Wǒ huí jiā.
I go home.
```

### Sentence lesson layout

```text
我们回家吧。
Wǒmen huí jiā ba.
Let’s go home.

Focus Words:
我们 = we
回家 = go home
吧 = suggestion particle

Pattern:
Subject + Verb + 吧

Usage:
Use 吧 to make a soft suggestion.
```

### Grammar pattern lesson layout

```text
Subject + 很 + Adjective

Meaning:
Used to describe someone/something.

Example:
她很好。
Tā hěn hǎo.
She is good / She is fine.

Notes:
很 often connects the subject and adjective.
It does not always mean "very" strongly in beginner sentences.
```

## 11.4 Review Page

### Purpose

Review due items using active recall.

### Layout

```text
Reviews

Due Now: 24

[Start Reviews]

Breakdown:
Components: 5
Hanzi: 8
Words: 7
Sentences: 3
Grammar: 1
```

### Review question types

#### Meaning question

```text
家

What does this mean?
```

Answer:

```text
home
```

#### Reading question

```text
家

How do you read this?
```

Answer:

```text
jiā
```

#### Component question

```text
Which components make 家?
```

Answer:

```text
宀 + 豕
```

#### Word meaning question

```text
回家

What does this mean?
```

Answer:

```text
go home
```

#### Sentence meaning question

```text
我们回家吧。

What does this mean?
```

Answer:

```text
Let’s go home.
```

#### Grammar pattern question

```text
Subject + 很 + Adjective

What is this used for?
```

Answer:

```text
Describing someone/something.
```

## 11.5 Library Page

### Purpose

Browse all learned and locked content.

### Tabs

```text
Components
Hanzi
Words
Sentences
Grammar
```

### Filters

```text
All
Unlocked
Learning
Guru+
Burned
Locked
```

### Search

Search by:

- hanzi
- pinyin
- English meaning
- component
- grammar pattern

### Card example

```text
家
jiā
home

Level 1
Guru
```

## 11.6 Item Detail Page

### Purpose

Deep view of an item.

### Hanzi detail

```text
家
jiā
home

Tone: Tone 1

Components:
宀 roof
豕 pig / animal

Mnemonic:
A home is a roof over the family.

Reading Mnemonic:
Imagine shouting “JIA!” as you enter your home.

Related Words:
家人 family member
回家 go home
大家 everyone

Example Sentences:
我回家。
Wǒ huí jiā.
I go home.

这是我的家。
Zhè shì wǒ de jiā.
This is my home.

Unlocks:
家人
回家
大家

SRS:
Guru
Next review: tomorrow
```

### Word detail

```text
回家
huí jiā
go home

Characters:
回 return
家 home

Mnemonic:
Return + home = go back home.

Examples:
我回家。
我们回家吧。
你几点回家？
```

### Sentence detail

```text
我们回家吧。
Wǒmen huí jiā ba.
Let’s go home.

Pattern:
Subject + Verb + 吧

Breakdown:
我们 = we
回家 = go home
吧 = suggestion / soft command

Usage:
Use 吧 when making a suggestion.
```

## 11.7 Progress Page

### Purpose

Show useful learning progress, not just XP.

### Metrics

```text
Level
Current streak
Daily session completion
Items learned
Items burned
Known hanzi
Known words
Known sentences
Known grammar patterns
Weak tones
Weak items
```

### Recommended layout

```text
Progress

Level 1

Known:
Components: 20
Hanzi: 35
Words: 74
Sentences: 22
Grammar Patterns: 5

SRS:
Apprentice: 22
Guru: 30
Master: 12
Burned: 4

Weak Areas:
Tone 3
Reading recall
Sentence meaning
```

## 11.8 Settings Page

### Purpose

Let the user customize their study without daily friction.

### Settings

```text
Daily session length:
[5] [10] [15]

Script:
Simplified / Traditional

Audio:
TTS on/off
Auto-play audio on/off

Tone colors:
on/off

Review mode:
Typing
Multiple choice
Mixed

Notifications:
Daily reminder on/off
Reminder time

Offline:
Download today’s session
Clear cache
```

## 12. Navigation

## 12.1 Mobile bottom nav

Use bottom navigation:

```text
Today | Review | Library | Progress | Settings
```

Optional:

```text
Today | Lessons | Review | Library | Progress
```

Settings can be inside profile/menu.

## 12.2 Desktop sidebar

Use left sidebar:

```text
Today
Lessons
Reviews
Library
Progress
Settings
```

## 13. Components

### 13.1 Core UI components

1. App Shell
2. Sidebar
3. Bottom Nav
4. Header
5. Progress Card
6. Lesson Card
7. Review Card
8. Item Card
9. Tone Badge
10. SRS Badge
11. Audio Button
12. Mnemonic Box
13. Component List
14. Related Words List
15. Example Sentence Block
16. Unlock Tree
17. Session Summary
18. Settings Toggle
19. Segmented Control
20. Modal / Sheet

## 14. Card Components

## 14.1 Hanzi Card

```text
[家]

jiā   T1
home

Components
宀 roof
豕 pig / animal

Mnemonic
A home is a roof over the family.

Related
家人 family member
回家 go home
大家 everyone
```

## 14.2 Word Card

```text
[回家]

huí jiā
go home

Characters
回 return
家 home

Mnemonic
Return + home = go back home.

Example
我回家。
I go home.
```

## 14.3 Sentence Card

```text
我们回家吧。
Wǒmen huí jiā ba.
Let’s go home.

Pattern
Subject + Verb + 吧

Usage
Soft suggestion.
```

## 14.4 Grammar Pattern Card

```text
Subject + 很 + Adjective

Used for describing someone/something.

Example
她很好。
She is fine.
```

## 15. Mnemonics System

### 15.1 Types of mnemonics

Each item can have:

```text
meaning_mnemonic
reading_mnemonic
tone_mnemonic
component_mnemonic
usage_mnemonic
```

### 15.2 Hanzi mnemonic example

```text
家 = home

Components:
宀 = roof
豕 = pig / animal

Meaning mnemonic:
A home is a roof over the family.

Reading mnemonic:
Imagine saying “jiā!” as you arrive home.
```

### 15.3 Word mnemonic example

```text
回家 = go home

回 = return
家 = home

Mnemonic:
Return + home = go home.
```

### 15.4 Sentence mnemonic example

```text
我们回家吧 = Let’s go home

Mnemonic:
吧 makes the sentence feel like “shall we?” or “let’s”.
```

### 15.5 User-custom mnemonics

Allow users to edit and save their own mnemonic.

Data:

```text
user_item_notes.custom_meaning_mnemonic
user_item_notes.custom_reading_mnemonic
```

Display priority:

```text
User mnemonic → App default mnemonic
```

## 16. Unlock System

### 16.1 Unlock philosophy

Use a WaniKani-style unlock system, but do not make the user experience feel too abstract.

Behind the scenes, components can be prerequisites. In the lesson flow, however, components can be introduced together with useful hanzi.

```text
User experience:
Learn 家 → see 宀 + 豕 → remember with mnemonic → unlock 家人/回家/大家
```

```text
System logic:
宀 + 豕 support 家
家 supports 家人 / 回家 / 大家
回家 supports 我回家 / 我们回家吧
```

### 16.2 Unlock rules

An item unlocks when prerequisites reach a certain SRS stage.

Example:

```text
If components 宀 and 豕 are introduced/known:
unlock or support 家

If 家 reaches Guru:
unlock 家人, 回家, 大家

If 回家 reaches Guru:
unlock 我回家, 我们回家吧
```

V1 can be lenient: allow useful high-frequency hanzi to appear early, even if the user has not separately mastered every component first.

Recommended V1 rule:

```text
Do not block useful hanzi too aggressively.
Use components as memory support first, strict prerequisites later.
```

### 16.3 Unlock levels

```text
Level 1:
basic components
basic hanzi
basic daily words
basic sentences

Level 2:
more components
common verbs
simple grammar

Level 3:
daily conversation
time, place, people
```

## 17. Content Structure

## 17.1 Level 1 content sample

### Components

```text
人 person
口 mouth
女 woman/female
子 child
宀 roof
大 big
小 small
日 sun/day
月 moon/month
水 water
```

### Hanzi

```text
人 person
口 mouth
女 woman
子 child
好 good
家 home
大 big
小 small
日 day
月 month
水 water
```

### Words

```text
你好 hello
家人 family member
回家 go home
大家 everyone
今天 today
明天 tomorrow
喝水 drink water
```

### Sentences

```text
你好。
Hello.

我回家。
I go home.

我们回家吧。
Let’s go home.

我喝水。
I drink water.

她很好。
She is fine.
```

### Grammar patterns

```text
Subject + Verb
Subject + Verb + Object
Subject + 很 + Adjective
我们 + Verb + 吧
```

## 18. Database Blueprint

## 18.1 users

```sql
id uuid primary key
email text
created_at timestamp
```

## 18.2 user_settings

```sql
id uuid primary key
user_id uuid references users(id)
daily_session_minutes int
script_preference text -- simplified, traditional
tone_colors_enabled boolean
audio_enabled boolean
auto_play_audio boolean
review_mode text -- typing, multiple_choice, mixed
daily_reminder_enabled boolean
daily_reminder_time time
created_at timestamp
updated_at timestamp
```

## 18.3 components

```sql
id uuid primary key
character text
name text
meaning text
mnemonic text
level int
created_at timestamp
```

## 18.4 hanzi

```sql
id uuid primary key
simplified text
traditional text
pinyin text
tone_number int
meaning text
meaning_mnemonic text
reading_mnemonic text
level int
frequency_rank int
audio_url text
created_at timestamp
```

## 18.5 hanzi_components

```sql
id uuid primary key
hanzi_id uuid references hanzi(id)
component_id uuid references components(id)
position text
```

## 18.6 words

```sql
id uuid primary key
simplified text
traditional text
pinyin text
meaning text
meaning_mnemonic text
reading_mnemonic text
level int
frequency_rank int
audio_url text
created_at timestamp
```

## 18.7 word_hanzi

```sql
id uuid primary key
word_id uuid references words(id)
hanzi_id uuid references hanzi(id)
position int
```

## 18.8 sentences

```sql
id uuid primary key
simplified text
traditional text
pinyin text
meaning text
usage_note text
mnemonic text
level int
audio_url text
created_at timestamp
```

## 18.9 sentence_words

```sql
id uuid primary key
sentence_id uuid references sentences(id)
word_id uuid references words(id)
position int
```

## 18.10 grammar_patterns

```sql
id uuid primary key
pattern text
title text
explanation text
meaning text
usage_note text
mnemonic text
level int
created_at timestamp
```

## 18.11 sentence_grammar_patterns

```sql
id uuid primary key
sentence_id uuid references sentences(id)
grammar_pattern_id uuid references grammar_patterns(id)
```

## 18.12 item_prerequisites

Generic unlock dependency table.

```sql
id uuid primary key
item_type text -- component, hanzi, word, sentence, grammar
item_id uuid
prerequisite_type text
prerequisite_id uuid
required_srs_stage text
created_at timestamp
```

## 18.13 user_item_progress

Tracks user progress for every item.

```sql
id uuid primary key
user_id uuid references users(id)
item_type text
item_id uuid
status text -- locked, unlocked, lesson, apprentice, guru, master, enlightened, burned
srs_stage text
correct_count int
incorrect_count int
last_reviewed_at timestamp
next_review_at timestamp
unlocked_at timestamp
burned_at timestamp
created_at timestamp
updated_at timestamp
```

## 18.14 reviews

```sql
id uuid primary key
user_id uuid references users(id)
item_type text
item_id uuid
question_type text -- meaning, reading, component, sentence, grammar
user_answer text
is_correct boolean
previous_srs_stage text
new_srs_stage text
reviewed_at timestamp
```

## 18.15 daily_sessions

```sql
id uuid primary key
user_id uuid references users(id)
session_date date
planned_minutes int
status text -- not_started, in_progress, completed
new_items_count int
review_items_count int
completed_items_count int
started_at timestamp
completed_at timestamp
created_at timestamp
```

## 18.16 daily_session_items

```sql
id uuid primary key
daily_session_id uuid references daily_sessions(id)
item_type text
item_id uuid
activity_type text -- lesson, review, quiz
sort_order int
completed boolean
created_at timestamp
```

## 18.17 user_item_notes

```sql
id uuid primary key
user_id uuid references users(id)
item_type text
item_id uuid
custom_meaning_mnemonic text
custom_reading_mnemonic text
personal_note text
created_at timestamp
updated_at timestamp
```

## 19. Supabase RPC Ideas

## 19.1 get_today_session

Returns today’s planned session.

```sql
get_today_session(user_id)
```

Should return:

```text
session info
due reviews
new lesson items
progress summary
```

## 19.2 start_daily_session

Creates or resumes today’s session.

```sql
start_daily_session(user_id)
```

## 19.3 submit_review_answer

Handles answer submission and SRS update.

```sql
submit_review_answer(
  user_id,
  item_type,
  item_id,
  question_type,
  user_answer,
  is_correct
)
```

## 19.4 unlock_available_items

Checks prerequisites and unlocks new items.

```sql
unlock_available_items(user_id)
```

## 19.5 update_session_settings

Updates daily session length.

```sql
update_session_settings(user_id, daily_session_minutes)
```

## 20. App Flow

## 20.1 First-time user flow

```text
Open app
→ Welcome
→ Choose script
→ Choose session length
→ Start first lesson
→ Learn useful hanzi
→ See components + mnemonic
→ Learn related word/sentence
→ Quiz
→ Complete session
→ See progress
```

## 20.2 Returning user flow

```text
Open app
→ Today page
→ Start Session
→ Do reviews
→ Learn new items if available
→ Quiz
→ Session complete
```

## 20.3 Unlock flow

Strict system version:

```text
User gets component correct several times
→ Component reaches Guru
→ Related hanzi unlocks
→ User learns hanzi
→ Hanzi reaches Guru
→ Related words unlock
→ Words reach Guru
→ Sentences unlock
```

Recommended V1 user-friendly version:

```text
User learns useful hanzi
→ App explains components and mnemonic
→ Hanzi enters SRS
→ Related words unlock after hanzi is remembered
→ Sentences unlock after words are remembered
```

For V1, prefer the user-friendly version.

## 21. Session Generation Logic

### Inputs

```text
daily_session_minutes
due_reviews_count
available_new_lessons
user_level
weak_items
```

### Output

A daily plan:

```text
reviews
new lessons
mini quiz
summary
```

### Simple allocation

#### 5 minutes

```text
70% reviews
30% new lessons
```

#### 10 minutes

```text
60% reviews
40% new lessons
```

#### 15 minutes

```text
50% reviews
50% new lessons
```

### Priority order

```text
1. Overdue reviews
2. Weak items
3. Useful high-frequency hanzi
4. Components needed to explain today’s hanzi
5. Related words
6. Useful sentences
7. Light grammar patterns
```

Avoid making new sessions feel like abstract component drills. Components should support useful hanzi and words.

## 22. Review Question Design

## 22.1 Component review

```text
Question:
What does 宀 mean?

Answer:
roof
```

## 22.2 Hanzi meaning review

```text
Question:
家

What does this mean?

Answer:
home
```

## 22.3 Hanzi reading review

```text
Question:
家

What is the pinyin?

Answer:
jiā
```

## 22.4 Word meaning review

```text
Question:
回家

What does this mean?

Answer:
go home
```

## 22.5 Sentence review

```text
Question:
我们回家吧。

What does this mean?

Answer:
Let’s go home.
```

## 22.6 Grammar review

```text
Question:
What does 吧 do in 我们回家吧?

Answer:
It makes a soft suggestion.
```

## 23. Review Modes

## 23.1 Multiple choice mode

Good for beginner and mobile use.

Pros:

- fast
- low friction
- good for public places
- no typing issues

Cons:

- easier to guess
- less strong recall

## 23.2 Typing mode

Good for stronger recall.

Pros:

- better retrieval
- harder to fake knowing

Cons:

- slower
- pinyin input friction
- harder on mobile

## 23.3 Recommended V1 default

Use mixed mode:

```text
Beginners: mostly multiple choice
Later: add typing
Settings: allow user to choose
```

## 23.4 Lesson cards vs review quizzes

The app should not be only a flip-card app.

Recommended behavior:

```text
Lesson mode = guided card / flip-card style
Review mode = active quiz / recall style
```

### Lesson mode

Good for first exposure.

```text
Front:
家

Tap / continue:
jiā
home

Then:
Components
Mnemonic
Related words
Example sentence
```

### Review mode

Should force recall.

Examples:

```text
家
What does this mean?

家
How do you read this?

回家
What does this mean?

我们回家吧。
What does this sentence mean?
```

Why: flip cards are useful for learning, but active quizzes create stronger memory.


## 24. UI Design System

## 24.1 Visual direction

```text
Clean
Lightweight
Minimal
Card-based
Mobile-first
WaniKani-inspired but not a clone
```

## 24.2 Colors

### Base

```text
Background: #F8FAFC
Surface: #FFFFFF
Text primary: #111827
Text secondary: #6B7280
Border: #E5E7EB
```

### Primary

```text
Primary: #3B82F6
Primary soft: #DBEAFE
Primary dark: #1D4ED8
```

### Tone colors

```text
Tone 1: #2563EB blue
Tone 2: #16A34A green
Tone 3: #F97316 orange
Tone 4: #DC2626 red
Neutral: #6B7280 gray
```

### SRS colors

```text
Apprentice: #EC4899
Guru: #8B5CF6
Master: #3B82F6
Enlightened: #10B981
Burned: #111827
```

## 24.3 Typography

Recommended:

```text
Font: Inter / system font
Chinese font: system CJK fallback
```

Sizes:

```text
Character display: 64–96px
Card title: 24–32px
Body: 16px
Small label: 12–14px
Button: 16px
```

## 24.4 Touch target

Minimum:

```text
48px height
```

Recommended:

```text
52–56px for main buttons
```

## 24.5 Border radius

Since you prefer small radius:

```text
Cards: 8px
Buttons: 8px
Badges: 999px
Inputs: 8px
```

## 25. Mobile Layouts

## 25.1 Today mobile

```text
Header
Daily Session Card
Start Button
Review Summary
Unlock Summary
Progress Summary
Bottom Nav
```

## 25.2 Lesson mobile

```text
Progress bar
Large item display
Pinyin + meaning
Audio button
Components
Mnemonic
Related
Next button
```

## 25.3 Review mobile

```text
Progress bar
Question
Answer input / choices
Submit
Result feedback
Next
```

## 26. Desktop Layouts

## 26.1 Desktop shell

```text
Sidebar left
Main content center
Optional right panel
```

## 26.2 Desktop lesson

```text
Left: main card
Right: related / unlocks / SRS info
```

## 27. Offline/PWA Strategy

## 27.1 V1 offline support

Cache:

```text
today’s session
due reviews
learned items
basic audio TTS does not need file cache
```

Do not cache:

```text
full database
all lessons
all future levels
large audio files
```

## 27.2 PWA features

```text
Installable
App icon
Splash screen
Service worker
Offline fallback
Local cache
```

## 28. Notifications

V1 optional.

Use gently:

```text
Daily reminder:
You have 10 minutes of Mandarin today.

Review reminder:
12 reviews are ready.
```

Rules:

```text
user controls reminder time
off by default or ask during onboarding
do not spam
```

## 29. Analytics

Track:

```text
daily session completion
review accuracy
lesson completion
average session length
drop-off screen
weak items
weak tones
retention streak
```

Avoid tracking too much in V1.

## 30. V1 MVP Build Order

### Phase 1: Foundation

```text
Auth
Database tables
App shell
Routing
Settings
Tone color utility
TTS utility
```

### Phase 2: Content model

```text
Components
Hanzi
Words
Sentences
Grammar patterns
Prerequisites
Seed Level 1 content
```

### Phase 3: Learning flow

```text
Today page
Lesson page
Quiz page
Session generator
Session completion
```

### Phase 4: Review flow

```text
Review page
Review questions
Answer checking
SRS updates
Unlock logic
```

### Phase 5: Library and progress

```text
Library
Item detail
Progress dashboard
Weak items
```

### Phase 6: Polish

```text
PWA install
Offline cache
Responsive layout
Loading states
Empty states
Error states
```

## 31. Content Targets

### 31.1 First prototype content target

Small enough to build quickly:

```text
20 components
40 hanzi
80 words
30 sentences
10 grammar patterns
```

### 31.2 V1 usable content target

Enough to feel like a real app:

```text
50 components
100 hanzi
200 words
100 sentences
30 grammar patterns
```

### 31.3 Strong V1 / early public version target

Better target for a useful Mandarin WaniKani-style app:

```text
300–500 hanzi
800–1,500 words
300–500 sentences
50–80 grammar patterns
```

### 31.4 Full app target

For strong beginner to lower-intermediate coverage:

```text
800–1,000 hanzi
2,000–3,000 words
1,000+ sentences
100–150 grammar patterns
```

### 31.5 Realistic 2–3 week user outcomes

Do not promise full fluency in 2–3 weeks. A more honest promise is:

```text
Build useful Mandarin foundations in 5–15 minutes/day.
Understand your first common hanzi, words, and sentences quickly.
```

Estimated 3-week outcomes if the user studies daily:

#### 5 minutes/day

```text
20–40 hanzi
60–100 words
15–25 sentences
```

#### 10 minutes/day

```text
40–80 hanzi
100–170 words
25–40 sentences
```

#### 15 minutes/day

```text
80–120 hanzi
170–250 words
40–60 sentences
```

The app should aim for quick practical wins, not unrealistic fluency claims.

## 32. Content Philosophy

Prioritize:

```text
High-frequency words
Daily conversation
Travel/social usefulness
Reusable grammar
Characters that unlock many words
Simple sentence patterns
```

Avoid:

```text
rare characters
academic vocabulary
too many similar words at once
long grammar notes
dictionary-style overload
```

## 33. Example Item Pack

## 33.1 Component

```text
宀
roof

Mnemonic:
A roof sitting on top of a house.

Unlocks:
家
字
安
```

## 33.2 Hanzi

```text
家
jiā
home

Components:
宀 roof
豕 pig / animal

Mnemonic:
A home is a roof over the family.

Related:
家人 family member
回家 go home
大家 everyone
```

## 33.3 Word

```text
回家
huí jiā
go home

Characters:
回 return
家 home

Mnemonic:
Return + home = go home.

Example:
我回家。
Wǒ huí jiā.
I go home.
```

## 33.4 Sentence

```text
我们回家吧。
Wǒmen huí jiā ba.
Let’s go home.

Pattern:
Subject + Verb + 吧

Usage:
吧 softens the sentence into a suggestion.
```

## 33.5 Grammar

```text
Subject + Verb + 吧

Meaning:
Let's / why don't we / suggestion

Examples:
我们走吧。
Let’s go.

我们吃饭吧。
Let’s eat.

我们回家吧。
Let’s go home.
```

## 34. Future Versions

## V1: Mandarin WaniKani Core

Focus:

```text
Components
Hanzi
Words
Sentences
Grammar
Mnemonics
Tone colors
SRS
Short sessions
TTS
```

## V2: Better Learning Intelligence

Add:

```text
Weak item detection
Personalized review order
More sentence packs
More grammar examples
Custom mnemonics
More offline support
Native audio for core content
```

## V3: Speaking and Listening

Add:

```text
Optional speaking mode
Shadowing mode
Pitch curve tone visualization
Listening comprehension
Dictation
Native audio packs
```

## V4: AI Tutor

Add:

```text
AI conversation
AI sentence correction
Personalized explanation
Dynamic lesson generation
Travel roleplay
Daily conversation mode
```

## 35. Final Product Statement

Build a lightweight Mandarin WaniKani-style PWA that helps users acquire Mandarin through a practical, character-first experience:

```text
Useful Hanzi → Components → Mnemonic → Related Words → Sentence → Review
```

Behind the scenes, the content structure can still use:

```text
Components → Hanzi → Words → Sentences → Grammar Patterns
```

The app should use:

```text
mnemonics
tone colors
SRS
short daily sessions
unlock progression
TTS audio
mobile-first UI
```

V1 should skip mandatory speaking and focus on acquisition, recognition, recall, and sentence understanding.

The ideal user experience:

```text
Open app
→ Start today’s session
→ Learn/review for 5–10 minutes
→ Finish
→ Come back tomorrow
```
