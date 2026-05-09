# Mandarin WaniKani-Style App — Master Blueprint

> **Guiding principle:** Useful Mandarin first. Components as memory support. Tone data structured properly. Weak areas calculated honestly. Mistakes repaired immediately without annoying the user.

---

## 0. Product Summary

**Working name:** Mandarin Loop / HanziLoop / MandarinKani
**Product type:** Lightweight PWA web app
**Primary users:** Indonesian learners of Mandarin
**Language strategy:** English-first. Bilingual schema (English + Indonesian) from day one. Indonesian content added in V2.
**Core idea:** A Mandarin version of WaniKani that feels practical and useful immediately.

**User-facing lesson flow:**

```text
Useful Hanzi → Components as explanation → Mnemonic → Related Words → Sentence → Quiz
```

**Backend/content structure:**

```text
Components / Radicals → Hanzi → Words → Sentences → Grammar Patterns
```

The difference is important:

```text
User experience  = useful hanzi first, components explained inside the lesson
System structure = components support memory and unlock logic behind the scenes
```

The goal is not to build a full "everything Mandarin" app. The goal is to help users acquire Mandarin characters, vocabulary, sentence understanding, and basic grammar with minimum daily effort.

---

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

---

## 2. Research-Based Principles

### 2.1 Mandarin-specific learning

- tones early and consistently
- radicals/components as memory tools
- hanzi structure and visual logic
- mnemonics for meaning and reading
- vocabulary in context
- useful sentences from day one
- interactive review over passive re-reading

### 2.2 Effective studying

- retrieval practice (testing effect)
- spaced repetition
- interleaving
- elaboration and self-explanation
- visual + verbal dual coding
- successive relearning (repair mistakes immediately)

### 2.3 Good app design

- simple and fast
- consistent
- touch-friendly
- usable in short interrupted sessions
- not overloaded with choices
- PWA-ready
- offline-friendly where possible

---

## 3. V1 Product Scope

### V1 includes

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
15. Light grammar notes inside sentence cards
16. Mnemonics
17. Tone color visuals
18. TTS audio

### V1 does not include yet

1. Mandatory speaking
2. AI conversation partner
3. Speech recognition
4. Pitch curve analysis
5. Handwriting recognition
6. Complex gamification
7. Social/community features
8. Long grammar lectures
9. Full native-speaker audio library
10. Standalone grammar card SRS queue (grammar appears as notes inside sentences only)

---

## 4. Core Learning Model

### 4.1 User-facing learning flow

The user should not feel forced to memorize abstract components before learning useful Mandarin. Every lesson starts from a useful hanzi.

```text
Useful Hanzi → Components (as explanation) → Mnemonic → Related Words → Sentence → Quiz
```

**Example first lesson:**

```text
你
nǐ
you

Component:
亻= person

Mnemonic:
You are the person I am talking to.

Related Word:
你好 = hello

Sentence:
你好！
Hello!
```

### 4.2 Backend/content hierarchy

Behind the scenes, content is structured like WaniKani:

```text
Level
 └── Components / Radicals
      └── Hanzi
           └── Words
                └── Sentences
                     └── Grammar Notes
```

### 4.3 Component usage rule

```text
Early lessons (Level 1):
- introduce max 1–2 new components per hanzi lesson
- show components as explanation inside the hanzi card
- do not show standalone component-only lessons first
- do not make users memorize abstract components before seeing a useful hanzi

Later levels:
- standalone component cards appear after the user has enough context
- component cards become reviewable items in the SRS queue
```

High-frequency beginner hanzi (你, 我, 好, 大, 小) are available from Level 1 without strict component prerequisites. Components are memory support, not gatekeepers.

### 4.4 Example unlock flow

```text
Hanzi lesson:
家 = home

Explained by components:
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

Grammar note:
Subject + Verb
```

Unlock logic still depends on components and prior items reaching Familiar stage, but the user experiences it as learning useful Mandarin first.

---

## 5. Daily Session Design

The user chooses session length once during onboarding:

```text
How long do you want your daily Mandarin session?

[5 min]  [10 min]  [15 min]
```

Saved in: `user_settings.daily_session_minutes`

Default: 10 min. The app does not ask again every day. The user can change it in Settings.

---

## 6. Session Types

### 6.1 5-minute session

```text
New items: 2–3
Reviews: 5–8
Sentence: 1
Grammar: none
```

Flow:
```text
1. Quick reviews
2. Learn 1–2 new items
3. Mini quiz
4. Finish
```

### 6.2 10-minute session (recommended default)

```text
New items: 3–5
Reviews: 10–15
Sentences: 1–2
Grammar: 1 light note if available
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

```text
New items: 5–8
Reviews: 15–25
Sentences: 2–3
Grammar: 1 light note
```

Flow:
```text
1. Due reviews
2. Useful hanzi lesson with component explanation
3. Word lesson
4. Sentence lesson
5. Quiz
6. Finish
```

### 6.4 Edge case: no new lessons available

When there are due reviews but no new lessons:

```text
Fill session entirely with due reviews.
After session, show: "You're caught up on lessons. New content unlocks as your reviews progress."
Do not show empty lesson slots.
```

---

## 7. Core Loop

```text
Lesson → Quiz → SRS Review → Unlock More Content → repeat
```

### 7.1 Lesson

User learns new material:

- useful hanzi (with component explanation)
- word
- sentence
- light grammar note
- standalone component only after enough context exists

### 7.2 Quiz

User recalls material:

- meaning
- reading
- tone
- component
- sentence usage

### 7.3 Review

System schedules the item for later review using SRS intervals.

### 7.4 Unlock

When prerequisites reach Familiar, the next content tier unlocks.

---

## 8. SRS System

### 8.1 5-stage model (final V1 decision)

```text
Learning → Familiar → Strong → Mastered → Long-term
```

What each stage means to the user:

```text
Learning  = I am still learning it
Familiar  = I kind of know it
Strong    = I know it well
Mastered  = I can recall it reliably
Long-term = I only need a rare refresh
```

### 8.2 Suggested intervals

```text
Learning  → same day / next day
Familiar  → 2–3 days
Strong    → 7 days
Mastered  → 21–30 days
Long-term → 90–120 days
```

These can be tuned later based on real review data. Keep them predictable and easy to debug in V1.

### 8.3 Hybrid review model

For objective questions, the app auto-marks correct or incorrect:

```text
Multiple choice        → auto-marked
Typed answer           → auto-marked with lenient matching
Sentence ordering      → auto-marked
```

For self-check / flip-card questions, the user decides:

```text
Forgot  /  Got it
```

All question types map to the same simple outcome:

```text
Correct   → Got it
Incorrect → Forgot
```

### 8.4 Stage movement rules

```text
Got it          → move up 1 stage
Forgot          → move down 1 stage
Repeated forgot → reset to Learning
Long-term       → stays reviewable, appears rarely
```

### 8.5 Wrong-answer UX (successive relearning)

When a user taps Forgot or answers incorrectly, the app repairs the mistake immediately.

**Feedback flow:**

```text
Wrong / Forgot
→ show correct answer with tone-colored pinyin
→ show mnemonic again
→ show component breakdown (if hanzi)
→ play TTS / audio if enabled
→ show "Continue" button
→ re-queue item after 3–5 other review cards
```

**Re-queue rules:**

```text
Each item can be re-queued only once per session.

If the user gets it wrong again after re-queue:
→ do not re-queue again
→ move to tomorrow's priority review queue

If session is almost over when Forgot occurs:
→ skip re-queue
→ move directly to tomorrow's priority review
```

This avoids infinite loops while still applying successive relearning in the session.

### 8.6 Why not 4 buttons in V1?

The Again / Hard / Good / Easy model is useful for advanced users but creates decision fatigue for beginners. V1 keeps it simple. The 4-button system can be added as an optional advanced mode in V2.

### 8.7 Final SRS statement

```text
V1 uses:
- 5 visible SRS stages
- hybrid review question types
- simple Forgot / Got it review outcome
- automatic correct/incorrect marking where possible
- no Again/Hard/Good/Easy buttons in V1
- wrong-answer flow with mnemonic replay and controlled re-queue
- Familiar stage as the unlock trigger
```

---

## 9. Tone Color System

### 9.1 Tone colors

```text
Tone 1 = Blue    #2563EB
Tone 2 = Green   #16A34A
Tone 3 = Orange  #F97316
Tone 4 = Red     #DC2626
Neutral = Gray   #6B7280
```

### 9.2 Where tone colors appear

Everywhere pinyin is shown:

- lesson cards
- review cards
- library cards
- related words
- sentence pinyin
- search results
- item detail pages

### 9.3 Display format

```text
jiā [T1]
```

Pinyin text is colored. Small tone badge can appear beside it.

### 9.4 Tone data model

Tone colors are always rendered from `pinyin_syllables`, never from `tone_number`.

`tone_number` on hanzi is a convenience field for quick filtering only (e.g. "show all Tone 3 hanzi"). It is never used for rendering.

`pinyin_syllables` structure used consistently across hanzi, words, and sentences:

```json
[
  { "hanzi": "回", "pinyin": "huí", "tone": 2 },
  { "hanzi": "家", "pinyin": "jiā", "tone": 1 }
]
```

Single hanzi:

```json
[
  { "hanzi": "你", "pinyin": "nǐ", "tone": 3 }
]
```

Neutral tone is always stored as `"tone": 0`, never omitted:

```json
[
  { "hanzi": "吧", "pinyin": "ba", "tone": 0 }
]
```

This allows one tone color rendering function to work across all item types.

---

## 10. Audio Strategy

### 10.1 V1: TTS first

```js
const utterance = new SpeechSynthesisUtterance("家");
utterance.lang = "zh-CN";
speechSynthesis.speak(utterance);
```

**Pros:** no storage cost, no large library, works for all item types, fast to build.
**Cons:** voice quality varies by browser/device, tones may not always sound perfect.

### 10.2 V2/V3: native audio

Store curated native audio only for core characters, high-frequency words, common sentences, and confusing tone pairs.

```text
Supabase Storage:
/audio/characters/jia1.mp3
/audio/words/huijia.mp3
/audio/sentences/wo-hui-jia.mp3

Fields: audio_url, audio_source, audio_quality
Format: MP3 or OGG, 32–64 kbps, mono, lazy-loaded
```

---

## 11. Page Blueprint

### 11.1 Onboarding

**Purpose:** get the user set up quickly and into their first lesson with as little friction as possible.

**V1 onboarding flow:**

```text
Step 1: Welcome
Step 2: App language
Step 3: Script preference
Step 4: Mandarin experience level
Step 5: Placement check (only if user knows some Mandarin)
Step 6: Daily session length
Step 7: First lesson begins
```

---

**Step 1: Welcome**

```text
Learn Mandarin in small daily steps.
Build words, tones, and sentences with short lessons and reviews.

[Get started]
```

---

**Step 2: App language**

```text
Choose your app language.
You can change this later in Settings.

[English]  [Bahasa Indonesia]
```

Default: English. Saved to `user_settings.ui_language`.

---

**Step 3: Script preference**

```text
Which characters do you want to learn?

[Simplified]  [Traditional]

You can switch this later.
```

Default: Simplified. Saved to `user_settings.script_preference`.

---

**Step 4: Mandarin experience**

```text
Have you studied Mandarin before?

[I'm totally new]
[I know some words]
```

This determines whether the placement check runs.

- "I'm totally new" → skip to Step 6 (session length), start from Level 1 Pack 1
- "I know some words" → go to Step 5 (placement check)

---

**Step 5: Placement check (only for "I know some words" path)**

Show 10–15 words and hanzi in increasing difficulty. For each item the user sees the hanzi and meaning, then taps one of three responses:

```text
Know it     — seed at Familiar stage, skip lesson pack
Not sure    — seed at Learning stage, include in first lessons
Don't know  — seed at Learning stage, include in first lessons
```

Rules:
- Items the user marks "Know it" enter the SRS at Familiar — they will be reviewed but not re-taught in lessons
- Items marked "Not sure" or "Don't know" enter at Learning — taught in lessons as normal
- The app skips lesson packs that consist entirely of "Know it" items
- No score or grade is shown — this is calibration, not a test
- User can tap "Skip this step" to proceed from Level 1 as normal

```text
Quick check — tap what you know.

[回家]  huí jiā  go home

[Know it]  [Not sure]  [Don't know]

3 of 10
```

V2: full adaptive placement algorithm with scoring and level estimation.

---

**Step 6: Daily session length**

```text
How much time do you want to study each day?

[5 minutes]  [10 minutes]  [15 minutes]
```

Default: 10 minutes. Saved to `user_settings.daily_session_minutes`.

---

**Step 7: First lesson begins**

```text
You're ready.
Start your first short lesson.

[Start lesson]
```

First lesson rules:
- Start with a useful high-frequency hanzi — not a standalone component
- Introduce max 1–2 components as explanation inside the hanzi lesson
- Component-only cards appear later when the user has enough context

---

**Script switching after onboarding**

When a user changes script preference in Settings after they have started learning:

```text
V1 — Soft switch (Option A):
- Display changes to new script immediately across the whole app
- SRS progress is fully preserved — no resets
- A one-time notice appears:
  "Some characters look different in Traditional. Your progress is saved."
- No items are automatically re-queued

V2 — Partial re-review (Option B):
- Items where simplified ≠ traditional are flagged
- Those specific items reset to Learning stage
- Items where forms are identical keep their SRS stage
```

---

### 11.2 Today Page

**Purpose:** main daily action page. One clear question: what should I do now?

**Lesson card display rule:**
- Today page lesson card shows pack theme + learning goal
- Lesson intro screen shows pack theme + learning goal + Start button
- Lesson item screen shows only "Lesson · 2 of 5" — theme not repeated

**Today page states:**

```text
State 1: lesson + reviews available
State 2: only reviews available
State 3: only lesson available
State 4: nothing due
State 5: review backlog (more due than session capacity)
State 6: no new lessons available
State 7: offline
State 8: loading / error
```

**State 1 layout (lesson + reviews):**

```text
Today

[ Greetings                              ]
[ Say hello, ask how someone is.         ]
[ Start lesson                           ]

[ Review today          15 of 64 due     ]
[ You'll review a small batch now.       ]
[ Review now                             ]

24 words learned  ·  3-day streak
Tone 2 vs Tone 3 needs practice.
```

**State 5 — review backlog display:**

```text
Review today
15 of 64 due
You'll review a small batch now.

[Review now]
```

Never show the full overdue count as the primary message. Always show the session-capped count first.

Rules: one main CTA per card, no clutter, no decision fatigue, resume session if unfinished.

---

### 11.3 Lesson Page

**Purpose:** teach new content, always starting from useful Mandarin.

**Lesson flow:**

```text
Lesson intro screen (shown once per pack):
  Pack theme + learning goal
  Estimated time
  [Start lesson]

Lesson item screens (one per new item):
  Header: "Lesson · 2 of 5"  (no theme on item screens)
  1. Show useful hanzi (large character + tone-colored pinyin + audio)
  2. Show components as explanation
  3. Give mnemonic
  4. Show related words
  5. Show example sentence
  6. Immediate quiz
```

**Lesson intro screen layout:**
```text
Today's lesson
Say hello, ask how someone is, and answer simply.
About 10 minutes

[Start lesson]
```

**Lesson item screen header:**
```text
Lesson · 2 of 5
━━━━━──────
```

The theme and learning goal appear only on the intro screen and on the Today page lesson card — not on every item screen.

**Hanzi lesson layout:**

```text
家
jiā  [T1]
home

Components:
宀 roof
豕 pig / animal

Mnemonic:
A home is a roof over the family.

Reading mnemonic:
Imagine saying "jiā!" as you arrive home.

Related:
家人  family member
回家  go home
大家  everyone
```

**Word lesson layout:**

```text
回家
huí [T2]  jiā [T1]
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

**Sentence lesson layout:**

```text
我们回家吧。
Wǒmen huí jiā ba.
Let's go home.

Focus Words:
我们 = we
回家 = go home
吧   = suggestion particle

Pattern:
Subject + Verb + 吧

Usage:
Use 吧 to make a soft suggestion.
```

**Standalone component lesson layout (later levels only):**

```text
宀
roof

Mnemonic:
This looks like a roof over a house.

Appears in:
家  安  字
```

---

### 11.4 Review Page

**Purpose:** active recall of due items.

**Standard state:**
```text
Reviews

Due now: 12

[Start reviews]

Breakdown:
Components: 2   Hanzi: 4   Words: 4   Sentences: 2
```

**Backlog state (due reviews exceed session cap):**
```text
Review today
15 of 64 due

You'll review a small batch now.
The rest will carry over to tomorrow.

[Start reviews]
```

Backlog cap per session:
```text
5 min session:  max 8 reviews shown
10 min session: max 15 reviews shown
15 min session: max 25 reviews shown
```

Never show the full overdue count as the primary number. Show only what the user will do today.

**Review question types:**

Meaning:
```text
家 → What does this mean? → home
```

Reading:
```text
家 → What is the pinyin? → jiā
```

Tone:
```text
回家 → Which tones are correct?

A) Tone 1 + Tone 2
B) Tone 2 + Tone 1
C) Tone 3 + Tone 1
D) Tone 2 + Tone 3

Answer: B) Tone 2 + Tone 1 — huí (T2) jiā (T1)
```

Tone questions use multiple choice only in V1. Answers are recorded for weak area detection.

Component:
```text
Which components make 家? → 宀 + 豕
```

Word meaning:
```text
回家 → What does this mean? → go home
```

Sentence meaning:
```text
我们回家吧。→ What does this mean? → Let's go home.
```

Grammar:
```text
What does 吧 do in 我们回家吧? → It makes a soft suggestion.
```

**Wrong-answer feedback screen:**

```text
Not quite.

家
jiā  [T1]
home

Components:
宀 roof   豕 pig / animal

Mnemonic:
A home is a roof over the family.

[Play Audio]   [Continue]
```

Then re-queue after 3–5 cards (once per session max).

---

### 11.5 Library Page

**Tabs:** Components | Hanzi | Words | Sentences | Grammar

**Filters:** All | Unlocked | Learning | Familiar+ | Long-term | Locked

**Search by:** hanzi, pinyin, English meaning, component, grammar pattern

**Card example:**
```text
家  jiā  home
Level 1  ·  Familiar
```

---

### 11.6 Item Detail Page

**Hanzi detail:**

```text
家
jiā  [T1]
home

Components:
宀 roof
豕 pig / animal

Meaning mnemonic:
A home is a roof over the family.

Reading mnemonic:
Imagine shouting "JIA!" as you enter your home.

Related Words:
家人  family member
回家  go home
大家  everyone

Example Sentences:
我回家。      I go home.
这是我的家。  This is my home.

Unlocks: 家人 / 回家 / 大家

SRS: Familiar  ·  Next review: tomorrow
```

**Word detail:**

```text
回家
huí [T2]  jiā [T1]
go home

Characters: 回 return  ·  家 home
Mnemonic: Return + home = go back home.

Examples:
我回家。
我们回家吧。
你几点回家？
```

**Sentence detail:**

```text
我们回家吧。
Wǒmen huí jiā ba.
Let's go home.

Pattern: Subject + Verb + 吧

Breakdown:
我们 = we   回家 = go home   吧 = suggestion

Usage: Use 吧 when making a suggestion.
```

---

### 11.7 Progress Page

**Purpose:** show honest, useful progress — not just SRS bucket counts.

**Layout:**

```text
Progress

Level 1  ·  Streak: 7 days

Known:
Components: 20   Hanzi: 35   Words: 74   Sentences: 22

SRS:
Learning: 22   Familiar: 30   Strong: 12   Long-term: 4

Weak Areas:
Tone 2 vs Tone 3
Hanzi reading recall
Sentence meaning
```

**Weak Areas calculation rule:**

```text
Weak area = accuracy below 70% in the last 20 reviews
            AND at least 5 completed reviews in that group
```

Tracked by:

```text
tone pair (e.g. Tone 2 vs Tone 3)
item type (hanzi / word / sentence)
question type (meaning / reading / tone)
particle/grammar marker (吧, 的, 了, 吗)
```

If there is not enough data yet:

```text
Weak Areas:
Not enough data yet. Keep reviewing.
```

Weak areas feed into session priority — they are reviewed before new content.

---

### 11.8 Settings Page

```text
Daily session length: [5]  [10]  [15]
Script: Simplified / Traditional
Language: English / Indonesian  (Indonesian toggle shown in V2 only)
Audio: TTS on/off  ·  Auto-play on/off
Tone colors: on/off
Review mode: Typing / Multiple choice / Mixed
Notifications: on/off  ·  Reminder time
Offline: Download today's session  ·  Clear cache
```

---

## 12. Navigation

**Mobile (bottom nav):**

```text
Today  |  Review  |  Library  |  Progress  |  Settings
```

**Desktop (left sidebar):**

```text
Today / Lessons / Reviews / Library / Progress / Settings
```

---

## 13. Core UI Components

1. App Shell
2. Sidebar / Bottom Nav
3. Header
4. Progress Card
5. Lesson Card
6. Review Card
7. Wrong Answer Feedback Panel
8. Item Card (Library)
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
21. Empty State Block
22. Loading State

---

## 14. Card Layouts

### Hanzi Card

```text
[家]
jiā  T1
home

Components:  宀 roof  ·  豕 pig / animal
Mnemonic:    A home is a roof over the family.
Related:     家人  回家  大家
```

### Word Card

```text
[回家]
huí T2  jiā T1
go home

Characters:  回 return  ·  家 home
Mnemonic:    Return + home = go back home.
Example:     我回家。  I go home.
```

### Sentence Card

```text
我们回家吧。
Wǒmen huí jiā ba.
Let's go home.

Pattern: Subject + Verb + 吧
Usage: Soft suggestion.
```

### Grammar Note Card

```text
Subject + 很 + Adjective
Used for describing someone/something.

Example: 她很好。  She is fine.
```

---

## 15. Mnemonics System

### Types per item

```text
meaning_mnemonic
reading_mnemonic
tone_mnemonic
component_mnemonic
usage_mnemonic
```

### User custom mnemonics

Users can write and save their own mnemonic per item.

```text
user_item_notes.custom_meaning_mnemonic
user_item_notes.custom_reading_mnemonic
```

Display priority: user mnemonic → app default mnemonic.

---

## 16. Unlock System

### Rules

An item unlocks when prerequisites reach **Familiar** stage.

```text
宀 + 豕 reach Familiar → unlock 家
家 reaches Familiar    → unlock 家人, 回家, 大家
回家 reaches Familiar  → unlock sentence 我们回家吧
Components become standalone reviewable cards after enough context exists
```

High-frequency Level 1 hanzi (你, 我, 好) bypass strict prerequisites. Components explain them; they do not block them.

### Levels

```text
Level 1:  Survival greetings and pronouns
Level 2:  Basic actions and yes/no questions
Level 3:  Food, drink, and daily needs
Level 4:  Numbers, money, and shopping
Level 5:  Time, days, and simple plans
Level 6:  Places and movement
Level 7:  Likes, wants, and preferences
Level 8:  Family and people
Level 9:  Work/school basics
Level 10: Travel/social mini conversations
```

Components appear as explanation inside hanzi lessons in Levels 1–3. Standalone component cards begin appearing from Level 2 onward as the user builds enough context.

---

## 17. Content Structure — Level 1 Sample

**Components (introduced inside hanzi lessons):**
亻 person · 口 mouth · 女 woman · 子 child · 宀 roof · 大 big · 小 small · 日 sun · 月 moon · 水 water

**Hanzi:**
你 · 我 · 好 · 人 · 家 · 大 · 小 · 日 · 月 · 水

**Words:**
你好 · 我们 · 家人 · 回家 · 大家 · 今天 · 明天 · 喝水

**Sentences:**
```text
你好！Hello.
我回家。I go home.
我们回家吧。Let's go home.
我喝水。I drink water.
她很好。She is fine.
```

**Grammar notes (inside sentences):**
Subject + Verb · Subject + Verb + Object · Subject + 很 + Adjective · Subject + Verb + 吧

---

## 18. Database Schema

## 18. Database Schema

> **Bilingual strategy:** All user-facing text fields exist in both `_en` (English) and `_id` (Indonesian) variants from day one. `_id` fields are `null` in V1 and filled in V2. The app always renders `_en` content in V1 and falls back to `_en` if `_id` is null in V2.
>
> **Fallback rule:** `display_value = (ui_language === 'id' && item.field_id) ? item.field_id : item.field_en`

---

### 18.1 users

```sql
id uuid primary key
email text
created_at timestamp
```

### 18.2 user_settings

```sql
id uuid primary key
user_id uuid references users(id)
daily_session_minutes int
script_preference text          -- simplified, traditional
ui_language text default 'en'   -- en, id (Indonesian toggle added in V2)
tone_colors_enabled boolean
audio_enabled boolean
auto_play_audio boolean
review_mode text                -- typing, multiple_choice, mixed
daily_reminder_enabled boolean
daily_reminder_time time
created_at timestamp
updated_at timestamp
```

### 18.3 components

```sql
id uuid primary key
slug text unique
character text
name_en text
name_id text                    -- null in V1
meaning_en text
meaning_id text                 -- null in V1
visual_hint_en text
visual_hint_id text             -- null in V1
mnemonic_en text
mnemonic_id text                -- null in V1
is_official_radical boolean default false
is_reviewable boolean default true
level int
notes text
created_at timestamp
```

### 18.4 hanzi

```sql
id uuid primary key
slug text unique
simplified text
traditional text
pinyin_diacritic text           -- e.g. "jiā"
pinyin_numbered text            -- e.g. "jia1"
tone_number int                 -- convenience filter only, NOT used for rendering
pinyin_syllables jsonb          -- [{"hanzi":"家","pinyin":"jiā","tone":1}]
tone_pattern text               -- e.g. "1" for single hanzi, "3-3" for 你好
meaning_en text
meaning_id text                 -- null in V1
meaning_mnemonic_en text
meaning_mnemonic_id text        -- null in V1
reading_mnemonic_en text
reading_mnemonic_id text        -- null in V1
tone_mnemonic_en text           -- optional
tone_mnemonic_id text           -- null in V1
hsk_level int
frequency_rank int
level int
is_reviewable boolean default true
audio_url text
notes text
created_at timestamp
```

### 18.5 hanzi_components

```sql
id uuid primary key
hanzi_id uuid references hanzi(id)
component_id uuid references components(id)
position int
```

### 18.6 words

```sql
id uuid primary key
slug text unique
simplified text
traditional text
pinyin_diacritic text           -- e.g. "huí jiā"
pinyin_numbered text            -- e.g. "hui2 jia1"
pinyin_syllables jsonb          -- [{"hanzi":"回","pinyin":"huí","tone":2},{"hanzi":"家","pinyin":"jiā","tone":1}]
tone_pattern text               -- e.g. "2-1"
meaning_en text
meaning_id text                 -- null in V1
part_of_speech text             -- noun, verb, adjective, particle, expression
mnemonic_en text
mnemonic_id text                -- null in V1
usage_note_en text
usage_note_id text              -- null in V1
accepted_meanings_en text[]     -- whitelist of correct answers
accepted_meanings_id text[]     -- null in V1
blocked_meanings_en text[]      -- explicitly rejected wrong answers
blocked_meanings_id text[]      -- null in V1
teaching_notes text             -- internal author note, not shown to user
difficulty_tags text[]          -- e.g. {grammar_tricky,context_dependent}
topic_tags text[]               -- e.g. {greeting, daily, travel}
hsk_level int
frequency_rank int
level int
is_core_word boolean default false
is_reviewable boolean default true
audio_url text
notes text
content_version int default 1
last_updated_at timestamp
change_type text                -- null, minor, major
needs_relearn boolean default false
created_at timestamp
```

### 18.7 word_hanzi

```sql
id uuid primary key
word_id uuid references words(id)
hanzi_id uuid references hanzi(id)
position int
```

### 18.8 sentences

```sql
id uuid primary key
slug text unique
simplified text
traditional text
pinyin_diacritic text
pinyin_numbered text            -- e.g. "wo3 hui2 jia1"
pinyin_syllables jsonb          -- one entry per syllable, neutral tone as "tone": 0
translation_en text
translation_id text             -- null in V1
literal_translation_en text     -- optional, shown when helpful
literal_translation_id text     -- null in V1
usage_context_en text
usage_context_id text           -- null in V1
topic_tags text[]
level int
is_reviewable boolean default true
audio_url text
notes text
created_at timestamp
```

### 18.9 sentence_words

```sql
id uuid primary key
sentence_id uuid references sentences(id)
word_id uuid references words(id)
position int
```

### 18.10 grammar_patterns

```sql
id uuid primary key
slug text unique
pattern text
title_en text
title_id text                   -- null in V1
formula text                    -- e.g. "Subject + 很 + Adjective"
explanation_en text
explanation_id text             -- null in V1
common_mistakes_en text
common_mistakes_id text         -- null in V1
level int
is_reviewable boolean default false  -- grammar notes not SRS items in V1
notes text
created_at timestamp
```

### 18.11 sentence_grammar_patterns

```sql
id uuid primary key
sentence_id uuid references sentences(id)
grammar_pattern_id uuid references grammar_patterns(id)
```

### 18.12 lesson_packs

Groups content into themed lesson bundles. Used for new lesson delivery, not reviews.

```sql
id uuid primary key
slug text unique
title_en text
title_id text                   -- null in V1
theme_en text                   -- e.g. "Greetings"
theme_id text                   -- null in V1
learning_goal_en text           -- e.g. "Say hello and ask how someone is"
learning_goal_id text           -- null in V1
level int
sort_order int                  -- order within a level
estimated_minutes int           -- 5, 10, or 15
created_at timestamp
```

### 18.13 lesson_pack_items

Links content items to a lesson pack.

```sql
id uuid primary key
lesson_pack_id uuid references lesson_packs(id)
item_type text                  -- component, hanzi, word, sentence, grammar
item_id uuid
item_role text                  -- primary (SRS item), support (shown for context, not reviewed)
sort_order int
```

`item_role` values:
- `primary` — this item enters the SRS queue after the lesson
- `support` — shown inside the lesson for context only, not reviewed

### 18.14 item_prerequisites

```sql
id uuid primary key
item_type text                  -- component, hanzi, word, sentence, grammar
item_id uuid
prerequisite_type text
prerequisite_id uuid
required_srs_stage text         -- e.g. "familiar"
created_at timestamp
```

### 18.15 user_item_progress

```sql
id uuid primary key
user_id uuid references users(id)
item_type text
item_id uuid
status text                     -- locked, unlocked, learning, familiar, strong, mastered, long_term
srs_stage text
correct_count int
incorrect_count int
review_count int                -- total reviews; used for weak area minimum threshold
needs_relearn boolean default false  -- true when item content had a major change
content_version_seen int default 1  -- version of item content the user last reviewed
content_version_seen int default 1   -- tracks which content version the user last reviewed
last_reviewed_at timestamp
next_review_at timestamp
unlocked_at timestamp
long_term_at timestamp
created_at timestamp
updated_at timestamp
```

### 18.16 reviews

```sql
id uuid primary key
user_id uuid references users(id)
item_type text
item_id uuid
question_type text              -- meaning, reading, tone, component, sentence, grammar
user_answer text
is_correct boolean
tone_answered int               -- nullable; tone question: which tone the user selected
tone_correct int                -- nullable; tone question: correct tone
previous_srs_stage text
new_srs_stage text
reviewed_at timestamp
```

`tone_answered` and `tone_correct` power weak area detection for specific tone confusion pairs (e.g. user selecting T2 when correct is T3).

### 18.17 daily_sessions

```sql
id uuid primary key
user_id uuid references users(id)
session_date date
planned_minutes int
status text                     -- not_started, in_progress, completed
new_items_count int
review_items_count int
completed_items_count int
started_at timestamp
completed_at timestamp
created_at timestamp
```

### 18.18 daily_session_items

```sql
id uuid primary key
daily_session_id uuid references daily_sessions(id)
item_type text
item_id uuid
activity_type text              -- lesson, review, quiz
sort_order int
completed boolean
requeue_count int default 0     -- capped at 1 per session in V1
is_priority_review boolean default false
created_at timestamp
```

### 18.19 user_item_notes

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


---

## 19. Supabase RPC Functions

### 19.1 get_today_session

```sql
get_today_session(user_id)
```

Returns: session info, due reviews (overdue first, weak items second), new lesson items, progress summary.

### 19.2 start_daily_session

```sql
start_daily_session(user_id)
```

Creates or resumes today's session.

### 19.3 submit_review_answer

```sql
submit_review_answer(
  user_id,
  item_type,
  item_id,
  question_type,
  user_answer,
  is_correct,
  tone_answered,   -- nullable, only for tone questions
  tone_correct     -- nullable, only for tone questions
)
```

Handles: answer recording, SRS stage update, re-queue logic, unlock trigger.

### 19.4 unlock_available_items

```sql
unlock_available_items(user_id)
```

Checks prerequisites and unlocks items where all prerequisites have reached Familiar.

### 19.5 get_weak_areas

```sql
get_weak_areas(user_id)
```

Logic:

```text
For each group (tone pair / item_type / question_type / grammar marker):
  - Filter reviews for this user and this group
  - If review_count >= 5 AND accuracy < 70% in last 20 reviews:
    → flag as weak area
Return ranked list, worst accuracy first
```

### 19.6 update_session_settings

```sql
update_session_settings(user_id, daily_session_minutes)
```

### 19.7 get_lesson_pack

Returns the next available lesson pack for a user, with its items in order.

```sql
get_lesson_pack(user_id)
```

Returns: pack metadata, new primary items (to enter SRS), support items (context only), estimated minutes.

### 19.8 complete_lesson_pack

Marks a lesson pack as completed and triggers `unlock_available_items`.

```sql
complete_lesson_pack(user_id, lesson_pack_id)
```

---

## 20. App Flow

### 20.1 First-time user

```text
Open app
→ Welcome screen
→ Choose app language
→ Choose script preference
→ Answer: "Have you studied Mandarin before?"
  → If new: skip to session length
  → If knows some words: placement check (10–15 items, Know it / Not sure / Don't know)
→ Choose session length
→ First lesson intro screen (theme + learning goal shown here)
→ First lesson begins (useful hanzi immediately, Lesson · 1 of N format)
→ Learn hanzi + see components as explanation
→ Mnemonic
→ Related word
→ Example sentence
→ Quiz
→ Session complete
→ Progress screen
```

### 20.2 Returning user

```text
Open app
→ Today page
→ Start Session
→ Due reviews (overdue first, weak items second)
→ New lessons if available
→ Quiz
→ Session complete
```

### 20.3 Unlock flow

```text
User learns useful hanzi
→ App explains components inside the lesson
→ Hanzi enters SRS as Learning
→ Hanzi reaches Familiar
→ Related words unlock
→ Words reach Familiar
→ Sentences unlock
→ Components become standalone reviewable cards after enough context exists
```

---

## 21. Session Generation Logic

### Inputs

```text
daily_session_minutes
due_reviews_count
available_new_lessons
user_level
weak_items (from get_weak_areas)
```

### Allocation

```text
5 min:  70% reviews / 30% new lessons
10 min: 60% reviews / 40% new lessons
15 min: 50% reviews / 50% new lessons
```

### Priority order

```text
1. Overdue reviews
2. Weak items (accuracy < 70%, min 5 reviews)
3. Newly unlocked prerequisites
4. New hanzi (with component explanation)
5. New words
6. New sentences
7. Light grammar notes
```

### Edge case: no new lessons

```text
Fill session with reviews only.
Show after session: "You're caught up on lessons. New content unlocks as your reviews progress."
```

---

## 22. Review Modes

**Multiple choice** — fast, low friction, good for mobile and public use. Easier to guess. Default for beginners.

**Typing** — stronger recall, harder to fake. Slower, pinyin input friction on mobile.

**V1 default:** mixed mode — mostly multiple choice early on, with typing added later. User can set preference in Settings.

---

## 23. UI Design System

### Colors

**Base:**
```text
Background: #F8FAFC
Surface:    #FFFFFF
Text:       #111827
Muted:      #6B7280
Border:     #E5E7EB
```

**Primary:**
```text
Primary:      #3B82F6
Primary soft: #DBEAFE
Primary dark: #1D4ED8
```

**Tone colors:**
```text
Tone 1: #2563EB  (blue)
Tone 2: #16A34A  (green)
Tone 3: #F97316  (orange)
Tone 4: #DC2626  (red)
Neutral: #6B7280 (gray)
```

**SRS stage colors:**
```text
Learning:  #EC4899
Familiar:  #8B5CF6
Strong:    #3B82F6
Mastered:  #10B981
Long-term: #111827
```

### Typography

```text
Font: Inter / system font
Chinese: system CJK fallback

Character display: 64–96px
Card title: 24–32px
Body: 16px
Label: 12–14px
Button: 16px
```

### Touch targets

```text
Minimum: 48px height
Main buttons: 52–56px
```

### Border radius

```text
Cards: 8px  ·  Buttons: 8px  ·  Badges: 999px  ·  Inputs: 8px
```

---

## 24. Mobile Layouts

**Today:** Header → Session Card → Start Button → Review Summary → Unlock Summary → Progress Summary → Bottom Nav

**Lesson:** Progress bar → Large character → Tone-colored pinyin + meaning → Audio → Components → Mnemonic → Related → Next

**Review:** Progress bar → Question → Answer input/choices → Submit → Feedback panel → Next

---

## 25. Desktop Layout

Left sidebar → Main content → Optional right panel (related items / unlock tree / SRS info)

---

## 26. Offline / PWA Strategy

**Cache in V1:** today's session, due reviews, learned items. TTS needs no file cache.

**Do not cache:** full database, all future levels, large audio files.

**PWA features:** installable, app icon, splash screen, service worker, offline fallback, local cache.

---

## 27. Notifications

V1 optional, off by default. Use gently.

```text
Daily reminder: "You have 10 minutes of Mandarin today."
Review reminder: "12 reviews are ready."
```

User controls reminder time. No spam.

---

## 28. Analytics

Track: daily session completion, review accuracy, lesson completion, average session length, drop-off screen, weak items, weak tones, retention streak.

Avoid tracking too much in V1.

---

## 29. V1 MVP Build Order

### Phase 1: Foundation

```text
Auth
Database tables (including pinyin_syllables on hanzi, words, sentences)
App shell + routing
Settings
Tone color utility (renders from pinyin_syllables only)
TTS utility
```

### Phase 2: Content model

```text
Components (with _en fields, _id null)
Hanzi (with pinyin_diacritic, pinyin_numbered, pinyin_syllables, _en fields)
Words (with tone_pattern, pinyin_syllables, topic_tags, _en fields)
Sentences (with pinyin_syllables, literal_translation_en, _en fields)
Grammar patterns (is_reviewable false in V1)
Lesson packs (themed bundles with sort_order)
Lesson pack items (primary vs support roles)
Prerequisites
Seed prototype batch content
```

### Phase 3: Learning flow

```text
Today page
Lesson page (character-first flow)
Quiz page
Session generator (with edge case handling)
Session completion screen
```

### Phase 4: Review flow

```text
Review page
All review question types (including tone questions)
Answer checking
Wrong-answer feedback panel (mnemonic replay + re-queue logic)
SRS updates
Unlock logic
```

### Phase 5: Library and progress

```text
Library (tabs + filters + search)
Item detail pages
Progress dashboard
Weak areas (get_weak_areas RPC)
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

---

## 30. Content Targets

**Prototype batch:**
```text
20 components · 40 hanzi · 80 words · 30 sentences · 10 grammar notes
```

**V1 launch batch:**
```text
50 components · 100 hanzi · 200 words · 100 sentences · 30 grammar notes
```

**Strong V1:**
```text
80 components · 300 hanzi · 800–1,000 words · 400–600 sentences · 50 grammar notes
```

---

## 31. Content Philosophy

**Prioritize:**
- high-frequency words
- daily conversation
- travel/social usefulness
- characters that unlock many words
- simple, reusable grammar patterns

**Avoid:**
- rare characters
- academic vocabulary
- too many similar words at once
- long grammar explanations
- dictionary-style overload

---

## 32. Content Authoring Guidelines

Every content entry must pass these rules before being seeded.

### 32.1 Component entry

**Required:** character, name, meaning, mnemonic, level
**Optional:** visual description, stroke note

Rules:
- Mnemonic must be a visual or physical image, not a definition
- Name should be one word where possible (roof, mouth, person)
- Must list which hanzi it unlocks

### 32.2 Hanzi entry

**Required:** simplified, pinyin, tone_number, pinyin_syllables, meaning (primary), meaning_mnemonic, reading_mnemonic, components used, level, frequency_rank
**Optional:** traditional, secondary meanings, usage note

Rules:
- `pinyin_syllables` must be correct — it drives all tone color rendering
- `tone_number` is for filtering only, never rendering
- Meaning mnemonic must use component names as story elements
- Reading mnemonic must anchor the sound to a memorable English image (person, place, or object)
- Primary meaning must be one word or short phrase, not a sentence
- Frequency rank drives ordering within a level — higher frequency unlocks first

### 32.3 Word entry

**Required:** simplified, pinyin, pinyin_syllables, meaning, characters used, example sentence, level, frequency_rank
**Optional:** traditional, mnemonic, usage note, collocations

Rules:
- `pinyin_syllables` must have one entry per syllable with correct tone number
- Neutral tones stored as `"tone": 0`, never omitted
- Example sentence must only use characters already available at that level or below
- Meaning must match the most common everyday usage

### 32.4 Sentence entry

**Required:** simplified, pinyin, pinyin_syllables, English meaning, focus words (2–4), grammar pattern tag, level
**Optional:** traditional, usage note, cultural note

Rules:
- All hanzi in the sentence must be unlocked at or before the sentence's level
- Focus words must already exist as word entries in the database
- One grammar pattern tag maximum per sentence in V1
- `pinyin_syllables` must cover every syllable including neutral tones as `"tone": 0`

### 32.5 Grammar note entry

**Required:** pattern formula, title, explanation, 3 example sentences, level
**Optional:** mnemonic, common mistakes note

Rules:
- Pattern formula in plain English structure notation (Subject + 很 + Adjective)
- Explanation must be one or two sentences maximum
- All example sentences must already exist in the sentences table

---

## 33. Example Item Pack

### Component

```text
宀  ·  roof

Mnemonic: A roof sitting on top of a house.
Unlocks: 家  字  安
```

### Hanzi

```text
家
jiā  [T1]
home

pinyin_syllables: [{"hanzi":"家","pinyin":"jiā","tone":1}]

Components: 宀 roof  ·  豕 pig / animal
Mnemonic: A home is a roof over the family.
Reading mnemonic: Imagine shouting "JIA!" as you enter your home.
Related: 家人  回家  大家
```

### Word

```text
回家
huí jiā
go home

pinyin_syllables:
[
  {"hanzi":"回","pinyin":"huí","tone":2},
  {"hanzi":"家","pinyin":"jiā","tone":1}
]

Characters: 回 return  ·  家 home
Mnemonic: Return + home = go home.
Example: 我回家。  I go home.
```

### Sentence

```text
我们回家吧。
Wǒmen huí jiā ba.
Let's go home.

pinyin_syllables:
[
  {"hanzi":"我","pinyin":"wǒ","tone":3},
  {"hanzi":"们","pinyin":"men","tone":0},
  {"hanzi":"回","pinyin":"huí","tone":2},
  {"hanzi":"家","pinyin":"jiā","tone":1},
  {"hanzi":"吧","pinyin":"ba","tone":0}
]

Pattern: Subject + Verb + 吧
Usage: 吧 softens the sentence into a suggestion.
Focus: 我们 = we  ·  回家 = go home  ·  吧 = suggestion particle
```

### Grammar note

```text
Subject + Verb + 吧
Meaning: Let's / suggestion / why don't we

Examples:
我们走吧。    Let's go.
我们吃饭吧。  Let's eat.
我们回家吧。  Let's go home.
```

---

## 34. Future Versions

**V1 — Mandarin WaniKani Core**
Components · Hanzi · Words · Sentences · Light grammar notes · Mnemonics · Tone colors · 5-stage SRS · Short sessions · TTS · Wrong-answer repair · Weak area detection

**V2 — Better Learning Intelligence + Indonesian**
Indonesian content (_id fields filled for Level 1–3) · Language toggle in settings · Indonesian accepted meanings in answer matching · Refined weak item detection · Personalized review order · More sentence and grammar packs · Custom mnemonics · More offline support · Native audio for core content · Optional 4-button review mode

**V3 — Speaking and Listening**
Optional speaking mode · Shadowing · Pitch curve visualization · Listening comprehension · Dictation · Native audio packs

**V4 — AI Tutor**
AI conversation partner · AI sentence correction · Dynamic lesson generation · Travel roleplay · Daily conversation mode

---

## 35. Content QA Checklist

Before any content entry is seeded into the database, it must pass this checklist. Apply to every hanzi, word, sentence, and grammar note.

**Pinyin and tone:**
```text
□ Pinyin is correct and matches the character
□ Tone number is correct (1–4, or 0 for neutral)
□ Neutral tone is stored as "tone": 0, not omitted
□ pinyin_syllables has one entry per syllable, no gaps
□ tone_number on hanzi matches the single syllable in pinyin_syllables
```

**Mnemonic:**
```text
□ Meaning mnemonic is a visual or physical image, not a definition
□ Reading mnemonic anchors the sound to a memorable English word or image
□ Mnemonic uses component names where relevant
□ Mnemonic is short — one or two sentences maximum
□ Mnemonic is not confusing or misleading
```

**Sentence:**
```text
□ All hanzi in the sentence are available at or before the sentence's level
□ Focus words (2–4) already exist as word entries in the database
□ Grammar note is one or two sentences maximum
□ Sentence sounds natural — something a native speaker would actually say
□ One grammar pattern tag maximum
```

**General:**
```text
□ Primary meaning is one word or a short phrase, not a full sentence
□ Frequency rank is filled in for hanzi and words
□ Level is assigned correctly
□ No duplicate entries (same simplified character, same level)
```

---

## 36. Answer Matching Rules

Defines what counts as correct for typed and self-check answers. Without clear rules, reviews become inconsistent and frustrating.

### 36.1 Meaning answers (English)

Use a whitelist of accepted answers per item. Store in a `accepted_meanings` array field or a separate `item_meanings` table in V2.

**Rules:**

```text
Exact match: always accepted
Case-insensitive: always accepted ("Home" = "home")
Minor typo (1 character off): accepted in lenient mode
Synonym: accepted only if explicitly listed in accepted_meanings
```

**Example:**

```text
家 = home

Accepted:   home, a home
Rejected:   house, family, room, place
```

```text
好 = good

Accepted:   good, well, okay, fine
Rejected:   nice, great, excellent
```

Rejected alternatives should be blocked because they map to different Chinese words and teaching them as synonyms creates confusion.

### 36.2 Pinyin answers (reading questions)

```text
Exact pinyin with tone mark: always accepted   jiā ✓
Numbered tone format: accepted                 jia1 ✓
No tone mark: accepted in beginner mode only   jia ✓ (Level 1 only)
Wrong tone: rejected                           jiá ✗ (Tone 2 instead of Tone 1)
Wrong syllable: rejected                       jie ✗
```

**Beginner mode rule:**
In V1, accept toneless pinyin (jia) as correct for reading questions at Level 1 only. At Level 2 and above, require correct tone marks or numbered tones. This prevents early frustration while still enforcing tones as the learner progresses.

### 36.3 Tone questions (multiple choice)

```text
User must select the correct tone number(s).
No partial credit — all syllables must be correct for multi-syllable items.
Wrong tone selection is always recorded in tone_answered / tone_correct for weak area tracking.
```

### 36.4 Component questions

```text
Accepted: correct component name (exact or case-insensitive)
Accepted: common alternative name if listed in accepted_meanings
Rejected: vague descriptions not in the accepted list
```

### 36.5 Self-check questions (Forgot / Got it)

No answer matching needed. User decides. The mnemonic is always visible before the user taps Got it or Forgot.

---

## 37. MVP Content Seed Order

Content must be created in a specific order to avoid orphaned entries — words that reference hanzi that don't exist yet, or sentences that use vocabulary not yet in the database.

### 37.1 Prototype batch order

```text
Step 1: Select 40 high-frequency hanzi
        - Prioritise hanzi that unlock many useful words
        - Examples: 你, 我, 好, 家, 大, 小, 人, 水, 日, 月

Step 2: Identify components for those 40 hanzi
        - Only create components that appear in the selected hanzi
        - Do not create orphaned components not yet used by any hanzi
        - Examples: 亻, 口, 女, 子, 宀, 豕

Step 3: Create 80 words using only those 40 hanzi
        - Every character in a word must exist in the hanzi table
        - Examples: 你好, 回家, 大家, 喝水, 今天

Step 4: Create 30 useful sentences using only those 80 words
        - Every word in a sentence must exist in the words table
        - Sentences should sound natural and cover daily situations
        - Examples: 你好！  我回家。  我们回家吧。

Step 5: Attach grammar notes to those sentences
        - Do not create standalone grammar cards yet
        - Grammar notes live inside sentence entries in V1
        - Examples: Subject + Verb, Subject + 很 + Adjective
```

### 37.2 V1 launch batch order

```text
Step 1: Expand to 100 hanzi (add 60 more following the same rules)
Step 2: Add components for the new hanzi
Step 3: Expand to 200 words using the 100 hanzi
Step 4: Expand to 100 sentences using the 200 words
Step 5: Review and tag all grammar notes
Step 6: QA pass using the Content QA Checklist (Section 35)
```

### 37.3 Ordering rule

```text
Never create a word before its hanzi exist.
Never create a sentence before its focus words exist.
Never create a grammar note without at least 3 example sentences already in the database.
Never create a component that is not used by at least one hanzi in the current batch.
```

---

## 38. Database Constraints and Index Notes

Not required for the first prototype, but must be in place before the V1 launch build. These prevent data corruption and keep queries fast as content and user data grows.

### 38.1 Constraints

```sql
-- Prevent duplicate hanzi entries at the same level
UNIQUE (simplified, level) ON hanzi

-- Prevent duplicate word entries at the same level
UNIQUE (simplified, level) ON words

-- Prevent duplicate sentence entries
UNIQUE (simplified) ON sentences

-- Ensure pinyin_syllables is never empty
CHECK (jsonb_array_length(pinyin_syllables) > 0) ON hanzi, words, sentences

-- Ensure SRS stage is always a valid value
CHECK (srs_stage IN ('learning','familiar','strong','mastered','long_term')) ON user_item_progress

-- Ensure requeue_count never exceeds 1 in V1
CHECK (requeue_count <= 1) ON daily_session_items
```

### 38.2 Indexes

```sql
-- Speed up due review queries (most frequent query in the app)
CREATE INDEX idx_progress_next_review ON user_item_progress (user_id, next_review_at);

-- Speed up item lookup by type
CREATE INDEX idx_progress_item ON user_item_progress (item_type, item_id);

-- Speed up content ordering by frequency
CREATE INDEX idx_hanzi_frequency ON hanzi (frequency_rank);
CREATE INDEX idx_words_frequency ON words (frequency_rank);

-- Speed up review history queries (used by get_weak_areas)
CREATE INDEX idx_reviews_user_type ON reviews (user_id, item_type, question_type, reviewed_at);

-- Speed up session item ordering
CREATE INDEX idx_session_items_order ON daily_session_items (daily_session_id, sort_order);
```

---

## 39. Review Backlog Rule

SRS systems naturally accumulate review backlogs — especially after a user misses a few days. The app must handle this gracefully without punishing the user or making them feel overwhelmed.

### 39.1 The problem

If a user misses 3 days, they may return to 80+ due reviews. Forcing them to clear everything before learning anything new creates frustration and churn.

### 39.2 The rule

```text
If due reviews > session capacity:
→ Show only the highest priority reviews for today's session
→ Do not force the user to clear everything at once
→ Remaining reviews carry over to tomorrow automatically
→ The app never shows a number that feels impossible
```

### 39.3 Priority order within the backlog

```text
1. Most overdue (largest gap between next_review_at and now)
2. Weak items (accuracy < 70%, min 5 reviews)
3. Items closest to moving up a stage (one Got it away from Familiar/Strong)
4. Everything else, oldest first
```

### 39.3b Stage-up feedback in session complete

When a session ends and items have moved up a SRS stage, the session complete screen shows:

```text
English:    3 items moved up a stage.
Indonesian: 3 item naik tahap.
```

Rules:
- Show only when at least one item actually moved up
- Do not show if no stage changes occurred in the session
- Keep it brief — one line in the summary, not a full celebration screen

---

### 39.4 Backlog cap per session

```text
5 min session:  max 8 reviews shown
10 min session: max 15 reviews shown
15 min session: max 25 reviews shown
```

Reviews beyond the cap are silently deferred to the next session. The user sees:

```text
Today's Reviews: 15 of 64 due
```

Not:

```text
You have 64 overdue reviews.
```

### 39.5 Streak protection

If a user misses one day but completes their session the next day, their streak is not broken. A one-day grace period prevents discouraging returning users.

```text
Streak breaks only after 2+ consecutive missed days.
```

---

## 40. Final Product Statement

Build a lightweight Mandarin WaniKani-style PWA that helps users acquire Mandarin through a practical, character-first flow:

```text
Useful Hanzi → Components as explanation → Mnemonics → Words → Sentences → Light Grammar Notes
```

Behind the scenes, the app uses component-backed unlock logic and SRS progression. The user never feels blocked by abstract components — they feel like they are learning useful Mandarin from the very first session.

The app uses:

```text
mnemonics
tone colors (rendered from pinyin_syllables)
5-stage SRS (Forgot / Got it)
short daily sessions (5 / 10 / 15 min)
unlock progression (Familiar threshold)
TTS audio
mobile-first PWA
wrong-answer repair (mnemonic replay + controlled re-queue)
honest weak area detection (70% accuracy, min 5 reviews)
```

V1 skips mandatory speaking and focuses on acquisition, recognition, recall, and sentence understanding.

The ideal user experience:

```text
Open app
→ Start today's session
→ Learn and review for 5–10 minutes
→ Finish
→ Come back tomorrow
```

> **Useful Mandarin first. Components as memory support. Tone data structured properly. Weak areas calculated honestly. Mistakes repaired immediately without annoying the user.**
