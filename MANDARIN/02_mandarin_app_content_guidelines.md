# Mandarin Learning App — Content Guidelines

> **Content north star:** The user should finish every lesson thinking: "I learned something small, useful, and memorable — and I can review it tomorrow."

---

## 0. Purpose

This document defines how to create every content item in the Mandarin learning app. It covers:

- Component entries
- Hanzi entries
- Word entries
- Sentence entries
- Grammar notes
- Lesson packs
- Mnemonics
- Tone and pinyin rules
- Level ordering
- Bilingual content strategy
- QA checklists
- Seed order
- Example item packs
- Report Issue feature
- Content versioning

Content is what makes this app work. The SRS, the unlock system, and the tone colors are all infrastructure. Content is the product.

---

## 1. Core Content Philosophy

### 1.1 Main Goal

The app teaches Mandarin through a progressive chain:

```text
Components → Hanzi → Words → Sentences → Grammar Patterns
```

Each layer unlocks the next. A beginner should never feel like they are memorizing random facts. Every item must have a clear reason to exist.

### 1.2 V1 Content Principles

Content should be:

- **Useful first** — teaches something the user can actually say or understand
- **Simple first** — one idea per item, no overloading
- **Short first** — beginner explanations in one or two sentences
- **High-frequency first** — the most common words and patterns before rare ones
- **Beginner-safe** — no advanced grammar, no rare characters
- **Tone-aware** — every item stores full tone data; tone is never an afterthought
- **Context-aware** — words appear in real sentences, not in isolation
- **Review-friendly** — every primary item can be recalled without the lesson in front of the user

Avoid content that is rare, overly formal, overly academic, or hard to use in daily life.

### 1.3 The 80/20 Rule

Prioritize the Mandarin that creates the most real-world value:

```text
Daily verbs: 吃, 喝, 去, 来, 要, 有, 是, 不, 知道, 回
Daily nouns: 人, 水, 饭, 钱, 家, 书, 手机
Pronouns: 我, 你, 他, 她, 我们, 你们
Question words: 什么, 哪里, 谁, 怎么, 多少, 几
Negation: 不, 没
Time words: 今天, 明天, 现在, 以前
Basic measure words: 个, 本, 杯
Common patterns: Subject + Verb, 是...的, 有没有
Survival phrases: 你好, 谢谢, 对不起, 没关系, 多少钱
Basic particles: 吗, 呢, 的, 了, 吧
```

Avoid teaching obscure characters early just because they are visually interesting or linguistically famous.

### 1.4 Daily Session Content Size

```text
Default session:
- 3–5 new words
- 2–5 example sentences
- 0–1 grammar note
- SRS reviews from previous sessions
```

Most sessions should complete in 5–15 minutes.

---

## 2. Bilingual Content Strategy

### 2.1 Language priority

The app is bilingual in two distinct layers. These are different things and must not be confused:

```text
App UI copy (buttons, labels, onboarding text, error messages, notifications):
  V1: English + Indonesian both supported from day one
      ui_language setting controls which is shown
      Default: English

Mandarin learning content (mnemonics, explanations, usage notes, translations):
  V1: English only — all _id fields null
      App renders _en content throughout
  V2: Indonesian content added progressively
      _id fields filled for Level 1–3 first
      Language toggle becomes active in learning content
      Indonesian accepted meanings added to answer matching
```

Summary:

```text
UI language:      bilingual from day one (English + Indonesian)
Learning content: English-first, Indonesian fields prepared but nullable in V1
```

### 2.2 Fallback rule

When `_id` content is null, the app renders `_en` silently. No broken UI, no empty cards.

```text
display_value = (ui_language === 'id' && item.field_id)
  ? item.field_id
  : item.field_en
```

### 2.3 Indonesian content rules (V2)

When writing Indonesian content:

- Use natural, friendly Indonesian — not formal or academic
- Write mnemonics fresh in Indonesian — do not just translate from English
- A mnemonic that works in English may not work in Indonesian; write it separately
- Use Bahasa Indonesia that is clear for a beginner learner, not slang-heavy
- Keep explanations short — one or two sentences maximum

**Good Indonesian explanation:**
```text
Tambahkan 吗 di akhir kalimat untuk membuat pertanyaan ya/tidak.
```

**Bad Indonesian explanation:**
```text
Partikel interogatif 吗 secara sintaksis berfungsi untuk mengubah klausa deklaratif menjadi interogatif polar.
```

---

## 3. Content Item Types

### 3.1 Components

Components are the visual building blocks used to explain hanzi. They may be official Kangxi radicals, character sub-components, visual shapes, or meaning/sound hints. The goal is memory support, not academic classification.

**Component entry fields:**

```text
slug                  unique identifier e.g. "mouth-kou"
character             口
name_en               mouth
name_id               null in V1
meaning_en            mouth / opening
meaning_id            null in V1
visual_hint_en        looks like an open mouth
visual_hint_id        null in V1
mnemonic_en           A square mouth asking or speaking.
mnemonic_id           null in V1
is_official_radical   true / false
is_reviewable         true (enters SRS when introduced)
level                 1
```

**Component entry rules:**

- One clear visual name — not multiple labels
- One simple meaning hint — not a linguistic definition
- Mnemonic should be a concrete visual image, not a description
- Must be linked to at least one hanzi in the current content batch
- Do not create orphaned components not used by any seeded hanzi

**Good component example:**
```text
口
name: mouth
meaning: mouth / opening
visual hint: looks like an open mouth
mnemonic: A square mouth asking or speaking.
```

**Bad component example:**
```text
口
name: enclosure, mouth, speech radical, box, ancient opening symbol
Why bad: too many labels; confusing for beginners
```

---

### 3.2 Hanzi

Hanzi entries teach a single Chinese character. Each entry should explain what it looks like, how it sounds, what it means, how to remember it, and where it appears in useful words.

**Hanzi entry fields:**

```text
slug                    unique identifier e.g. "home-jia"
simplified              家
traditional             家
pinyin_diacritic        jiā
pinyin_numbered         jia1
tone_number             1   (convenience filter only, not used for rendering)
pinyin_syllables        [{"hanzi":"家","pinyin":"jiā","tone":1}]
tone_pattern            "1"
meaning_en              home
meaning_id              null in V1
accepted_meanings_en    ["home", "a home"]
accepted_meanings_id    null in V1
blocked_meanings_en     ["house", "family", "room"]
blocked_meanings_id     null in V1
meaning_mnemonic_en     A home is a roof over the family.
meaning_mnemonic_id     null in V1
reading_mnemonic_en     Imagine shouting "JIA!" as you enter your home.
reading_mnemonic_id     null in V1
tone_mnemonic_en        Keep your voice high and flat — you are confidently at home.
tone_mnemonic_id        null in V1
teaching_notes          null (e.g. "beginners may confuse 家 (home) with 房 (room/house)")
difficulty_tags         []  (e.g. ["grammar_tricky", "high_frequency"])
hsk_level               1
frequency_rank          (from frequency corpus)
level                   1
is_reviewable           true
audio_url               null in V1
content_version         1
last_updated_at         timestamp
change_type             null (minor / major — set when content is edited post-launch)
```

**Meaning rule:**

Use short meanings. One or two words maximum for V1.

```text
Good:
我 = I / me
你 = you
好 = good
吃 = eat
家 = home

Bad:
好 = good, fine, nice, okay, easy to, very, quite, fond of
```

More meanings can be added in advanced notes in later versions.

**Simplified and traditional rule:**

If simplified and traditional are the same, store both the same:
```text
simplified: 我   traditional: 我
```

If different, store both:
```text
simplified: 这   traditional: 這
```

**Hanzi entry rules:**

- `pinyin_syllables` is the source of truth for tone rendering — must be correct
- `tone_number` is for filtering only (e.g. "show all Tone 3 hanzi")
- Meaning mnemonic must use component names as story elements where possible
- Reading mnemonic must anchor the syllable sound to a memorable English image (person, place, or object)
- Tone mnemonic connects the tone contour to a physical or emotional cue
- Primary meaning is one word or short phrase — never a full sentence
- Frequency rank drives ordering within a level — higher frequency unlocks first
- At least one related word must be linked where possible

---

### 3.3 Words

Words are the main learning unit for V1. A word can be one hanzi, two hanzi, or a short common expression.

**Word entry fields:**

```text
slug                  unique identifier e.g. "go-home-huijia"
simplified            回家
traditional           回家
pinyin_diacritic      huí jiā
pinyin_numbered       hui2 jia1
pinyin_syllables      [{"hanzi":"回","pinyin":"huí","tone":2},{"hanzi":"家","pinyin":"jiā","tone":1}]
tone_pattern          "2-1"
meaning_en            go home
meaning_id            null in V1
accepted_meanings_en  ["go home", "return home", "head home"]
accepted_meanings_id  null in V1
blocked_meanings_en   ["come home", "go to the house"]
blocked_meanings_id   null in V1
part_of_speech        verb phrase
mnemonic_en           Return + home = go back home.
mnemonic_id           null in V1
usage_note_en         Used when someone is heading back to their home.
usage_note_id         null in V1
teaching_notes        null (e.g. "很 is common but beginners may over-translate it as 'very'")
difficulty_tags       []  (e.g. ["grammar_tricky", "high_frequency"])
topic_tags            {home, travel, daily}
hsk_level             1
frequency_rank        (from frequency corpus)
level                 1
is_core_word          true
is_reviewable         true
audio_url             null in V1
content_version       1
last_updated_at       timestamp
change_type           null (minor / major)
```

**Meaning rule:**

Prefer one clean primary meaning. Add a literal note only when it helps understanding.

```text
Good:   回家 = go home
Note:   Literally: return home.

Bad:    回家 = return home, go back home, come home, be homebound
```

**Part of speech options:**

```text
noun · verb · adjective · adverb · pronoun · particle ·
measure word · expression · question word · negation
```

**Topic tag options:**

```text
greeting · self · family · food · drink · travel · shopping ·
time · location · question · emotion · home · work · school ·
transport · number · basic_verb · basic_adjective · survival · money
```

Maximum 3 topic tags per word.

**Word entry rules:**

- Every character in the word must exist in the hanzi table before the word is created
- `pinyin_syllables` must have one entry per syllable with correct tone — neutral tone as `"tone": 0`
- `tone_pattern` stored as a dash-separated string of tone numbers (e.g. "3-3", "2-1", "4-0")
- Neutral tone stored as `0` in both `pinyin_syllables` and `tone_pattern`
- Example sentence must use only characters available at that level or below
- Meaning matches the most common everyday usage — not a dictionary definition

**Word difficulty rule:**

A word is beginner-friendly when:
- it appears often in daily life
- it can be used immediately in a real situation
- its grammar is simple
- its pronunciation is not overly complex
- its example sentences are short

---

### 3.4 Sentences

Sentence entries teach usage in context. They must be short, natural, and immediately useful.

**Sentence entry fields:**

```text
slug                      unique identifier e.g. "lets-go-home"
simplified                我们回家吧。
traditional               我們回家吧。
pinyin_diacritic          Wǒmen huí jiā ba.
pinyin_numbered           Wo3men hui2 jia1 ba5.
pinyin_syllables          [
                            {"hanzi":"我","pinyin":"wǒ","tone":3},
                            {"hanzi":"们","pinyin":"men","tone":0},
                            {"hanzi":"回","pinyin":"huí","tone":2},
                            {"hanzi":"家","pinyin":"jiā","tone":1},
                            {"hanzi":"吧","pinyin":"ba","tone":0}
                          ]
translation_en            Let's go home.
translation_id            null in V1
literal_translation_en    We return home, okay?
literal_translation_id    null in V1
usage_context_en          Used to suggest going home to someone you are with.
usage_context_id          null in V1
topic_tags                {home, suggestion, daily}
level                     1
is_reviewable             true
```

**Sentence length rule:**

Beginner sentences (Levels 1–3) should be 3–8 Chinese characters.

**Good sentence examples:**
```text
你好吗？      Nǐ hǎo ma?      How are you?
我回家。      Wǒ huí jiā.     I'm going home.
这个多少钱？  Zhège duōshǎo qián?  How much is this?
```

**Bad sentence example for early V1:**
```text
由于天气恶劣，我们不得不取消原定的行程。
Why bad: too advanced, too long, uses vocabulary not appropriate for beginners.
```

**Sentence entry rules:**

- All hanzi in the sentence must be unlocked at or before the sentence's level
- Focus words (2–4) must already exist as word entries in the database
- One grammar pattern tag maximum per sentence in V1
- `pinyin_syllables` must cover every syllable — neutral tones stored as `"tone": 0`, never omitted
- Literal translation is optional — include only when it meaningfully helps understanding
- Sentence must sound natural — something a native speaker would actually say

**`is_reviewable` vs lesson pack `item_role` — important distinction:**

```text
is_reviewable = a capability flag on the sentence itself
                true = this sentence CAN be reviewed as an SRS item
                false = this sentence is for display/context only, never reviewed

item_role in lesson_pack_items = a delivery decision per pack
                primary = this item WILL enter the SRS queue from this pack
                support = shown for context in this lesson, does not enter SRS queue

A sentence can be is_reviewable: true in the database
but delivered as support role in a lesson pack.
In that case it does not enter the SRS queue from that pack.

V1 recommendation: most sentences start as support role.
Promote sentences to primary role only when they are the main teaching point
of a lesson pack, not just supporting examples.
```

---

### 3.5 Grammar Notes

Grammar notes explain one small pattern at a time. They are not textbook chapters. In V1, grammar notes live inside sentence entries, not as standalone SRS items.

**Grammar note fields:**

```text
slug                  unique identifier e.g. "yes-no-question-ma"
pattern               Statement + 吗？
title_en              Asking yes/no questions with 吗
title_id              null in V1
formula               Subject + verb/adjective + 吗？
explanation_en        Add 吗 at the end of a statement to turn it into a yes/no question.
explanation_id        null in V1
common_mistakes_en    Don't use 吗 with questions that already have a question word like 什么 or 哪里.
common_mistakes_id    null in V1
level                 1
is_reviewable         false  (grammar notes not SRS items in V1)
```

**Grammar note rules:**

- One pattern only — do not combine multiple grammar points in one note
- Formula in plain notation — not linguistic terminology
- Explanation is one or two sentences maximum
- Must have 2–4 example sentences already in the sentences table
- Common mistake is optional but helpful when there is an obvious one

**Good grammar note:**
```text
Title: Asking yes/no questions with 吗
Formula: Subject + verb/adjective + 吗？
Explanation: Add 吗 at the end of a statement to make a yes/no question.
Examples: 你好吗？你去吗？
```

**Bad grammar note:**
```text
Chinese interrogative particles include 吗, 呢, 吧, 啊, and several pragmatic sentence-final
particles that vary according to context, register, and discourse function...
Why bad: too academic, too long, multiple concepts at once.
```

---

## 4. Lesson Packs

### 4.1 What a lesson pack is

A lesson pack is a themed bundle of content items delivered as a new lesson. Packs are used for new lesson delivery only — reviews are handled by the SRS queue independently of packs.

```text
Lesson packs   = how content is introduced (new lessons)
SRS queue      = how content is reviewed (due reviews)
```

### 4.2 Lesson pack fields

```text
slug              unique identifier e.g. "pack-greetings"
title_en          Greetings
title_id          null in V1
theme_en          Greeting someone
theme_id          null in V1
learning_goal_en  Say hello, ask how someone is, and respond simply.
learning_goal_id  null in V1
level             1
sort_order        1  (order within level)
estimated_minutes 10
```

### 4.3 Lesson pack item roles

Each item in a pack has a role:

```text
primary   — this item enters the SRS queue after the lesson
            the user will be reviewed on it later
support   — shown inside the lesson for context only
            not added to the SRS queue
            used for sentences or grammar notes that give context
            without being the focus of the review
```

### 4.4 Standard lesson pack structure

```text
3–5 primary word items
1–3 hanzi explanations (shown inside word lessons)
2–5 support sentence items
0–1 grammar note (support role only in V1)
```

### 4.5 Recommended seed pack order

```text
Pack 1:  Greetings — 你好, 吗, 好
Pack 2:  I and You — 我, 你, 是, 不是
Pack 3:  Yes/No Questions — 吗, 呢, 对, 不对
Pack 4:  Go and Come — 去, 来, 回家, 走
Pack 5:  Eat and Drink — 吃, 喝, 水, 饭
Pack 6:  This and That — 这, 那, 什么, 哪里
Pack 7:  Numbers 1–10 — 一 through 十
Pack 8:  Money and Shopping — 钱, 多少, 买, 贵
Pack 9:  Time and Days — 今天, 明天, 现在, 几点
Pack 10: Likes and Wants — 喜欢, 要, 想, 不想
```

---

## 5. Mnemonic Guidelines

### 5.1 Purpose

Mnemonics help the user remember hanzi shape, meaning, sound, and tone. They should be memorable, concrete, and short — not literary.

### 5.2 Mnemonic types

```text
meaning_mnemonic    connects components to the character's meaning
reading_mnemonic    anchors the syllable sound to an English image
tone_mnemonic       connects the tone contour to a physical/emotional cue
component_mnemonic  explains what a component looks like visually
usage_mnemonic      helps remember when to use a word or particle
```

### 5.3 Length

Recommended: 1–3 short sentences. Avoid long stories unless the character is genuinely difficult to remember.

### 5.4 Mnemonic style

Mnemonics should be:
- Clear and concrete
- Easy to visualize
- Slightly vivid — memorable images stick
- Appropriate — not childish, not offensive, not culturally insensitive
- Written fresh in English (not translated from Chinese)

For V2 Indonesian mnemonics: write independently from the English version. Do not translate. A mnemonic that works in English may be meaningless in Indonesian.

### 5.5 Reading mnemonic caution

Reading mnemonics anchor a Mandarin syllable to an English sound. They are useful when a clear, natural association exists — but they should not be forced for every hanzi.

**Use reading mnemonics only when:**
- The association is genuinely memorable and not a stretch
- The English sound-alike is close enough to actually help pronunciation
- The mnemonic does not mislead the learner about the correct sound

**Do not force reading mnemonics when:**
- No natural English sound-alike exists
- The mnemonic would require too much explanation to work
- The syllable is common enough that repetition will teach it naturally

```text
Good reading mnemonic:
你 (nǐ) — "Knee" — point at someone's knee: nǐ.
(Clear, physical, memorable)

Forced reading mnemonic to avoid:
曲 (qū) — "Chew a curve..." 
(Too abstract, misleading pronunciation, not helpful)
```

For hanzi where no good reading mnemonic exists, leave `reading_mnemonic_en` null. The tone mnemonic and meaning mnemonic are enough.

### 5.6 Tone mnemonics

Connect each tone to a physical movement or emotion:

```text
Tone 1 — high and flat
Imagine holding your voice steady at the top.
"The tone is as flat as a calm sky."

Tone 2 — rising
Imagine asking "huh?" with your voice going up.
"Your voice rises like a question."

Tone 3 — low dipping
Imagine your voice going down into a valley, then slightly up.
"Dip low, like nodding thoughtfully."

Tone 4 — sharp falling
Imagine giving a firm command.
"Drop hard, like stamping your foot."

Neutral — light and short
Say it softly and quickly, no emphasis.
"Neutral is barely there."
```

### 5.7 Mnemonic examples

**好 (hǎo — good):**
```text
Components: 女 + 子
Meaning mnemonic: A woman and child together make a picture of "good."
Tone mnemonic: Let your voice dip low like nodding yes: hǎo.
```

**吗 (ma — question particle):**
```text
Components: 口 + 马
Mnemonic: The mouth asks a quick light question: ma?
Neutral tone — keep it soft and short.
```

**家 (jiā — home):**
```text
Components: 宀 + 豕
Meaning mnemonic: A home is a roof over the family (even the pig).
Reading mnemonic: Imagine shouting "JIA!" as you walk through your front door.
Tone mnemonic: Keep your voice high and flat — you are confidently home.
```

---

## 6. Teaching Notes and Difficulty Tags

### 6.1 Purpose

Some content items are high-frequency but grammatically tricky, or common but easily confused with another word. `teaching_notes` and `difficulty_tags` capture this so the session generator and content authors can make informed decisions about ordering and emphasis.

### 6.2 teaching_notes

A free-text field for authors to flag anything a beginner commonly misunderstands.

```text
Rules:
- One or two sentences maximum
- Written for the content author and session generator, not shown to the user
- Optional — only fill when there is a genuine teaching risk

Good examples:
很 → "Beginners often over-translate 很 as 'very'. It frequently just links subject and adjective."
了 → "了 has multiple uses that beginners confuse. In V1, only teach completion usage."
是 → "English speakers try to use 是 like 'am/is/are'. Many sentences do not need it."
```

### 6.3 difficulty_tags

An array of tags that describe why an item is harder than its frequency rank suggests.

```text
Available tags:
grammar_tricky      — usage pattern is non-obvious for English speakers
tone_sensitive      — tone confusion changes meaning significantly
high_frequency      — appears constantly, must be learned early despite difficulty
easily_confused     — often mixed up with another specific word or character
context_dependent   — meaning changes significantly based on context
sandhi_affected     — tone changes in natural speech (e.g. 不, 一)
particle            — sentence-final particle with subtle pragmatic meaning
```

Example:
```text
很
difficulty_tags: ["high_frequency", "grammar_tricky"]
teaching_notes: "Beginners over-translate as 'very'. It often just links subject and adjective."

了
difficulty_tags: ["grammar_tricky", "context_dependent"]
teaching_notes: "Multiple uses. Teach completion aspect only in V1."
```

### 6.4 sort_priority (V2)

In V1, content ordering is driven by `frequency_rank` and `level`. In V2, a `sort_priority` integer field can be added to fine-tune ordering when `frequency_rank` alone gives a suboptimal sequence.

```text
V1: order by level → frequency_rank
V2: order by level → sort_priority (if set) → frequency_rank
```

Do not add `sort_priority` to V1 — `frequency_rank` is sufficient and `sort_priority` requires careful calibration to be useful.

---

## 8. Tone and Pinyin Rules

### 6.1 Always store two pinyin formats

Every reviewable item stores both:

```text
pinyin_diacritic   nǐ hǎo     (tone marks)
pinyin_numbered    ni3 hao3   (numbered tones)
```

This makes tone checking easier in review logic and allows both formats to be displayed based on user settings.

### 6.2 Tone numbers

```text
1 = high level (flat)
2 = rising
3 = dipping / low
4 = falling
0 = neutral
```

Neutral tone is always stored as `0`. Never use `5` for neutral. Never omit neutral tone entries from `pinyin_syllables`.

> **Override note:** Any earlier draft or reference that uses `5` for neutral tone is superseded by this rule. The canonical neutral tone value for this app is `0` everywhere — `pinyin_syllables`, `tone_pattern`, `tone_number`, and `pinyin_numbered` (e.g. `ma5` in numbered format should be stored as `ma0` in `tone_pattern`).

### 6.3 Tone pattern field

For words, store tone pattern as a dash-separated string:

```text
你好   = "3-3"
谢谢   = "4-0"
中国   = "1-2"
我们   = "3-0"
回家   = "2-1"
你好吗 = "3-3-0"
```

Neutral tone in tone pattern is always `0`.

### 6.4 Tone sandhi display rule

Tone sandhi means the pronounced tone changes in natural speech. For V1, store the dictionary tone and add a note for common sandhi cases.

**Example: 你好**
```text
Dictionary tones: nǐ hǎo = 3-3
Spoken naturally: ní hǎo = 2-3

V1 display:
pinyin: nǐ hǎo
tone_pattern: 3-3
Optional note: When two 3rd tones appear together, the first often sounds like 2nd tone.
```

Do not teach sandhi heavily in early levels. Mention it only when it would genuinely confuse a beginner.

### 6.5 Pinyin formatting rules

Use lowercase pinyin unless it starts a sentence in UI copy.

```text
Good: nǐ hǎo / wǒ yào shuǐ
Bad:  Ni Hao / WO YAO SHUI
```

Syllables within one word may be written together or with a space — be consistent within the app. Sentences use spaces between words.

```text
Word:     huíjiā  or  huí jiā   (consistent)
Sentence: Wǒ huí jiā.
```

### 6.6 Tone mark placement

Use standard pinyin tone mark placement on the correct vowel:

```text
mā / má / mǎ / mà / ma
xièxie / zhōngguó / huíjiā
```

### 6.7 Punctuation rules

For Mandarin text in the app, use Chinese punctuation:
```text
你好。    你好吗？    谢谢！
```

For pinyin and English translations, use Latin punctuation:
```text
Nǐ hǎo.    How are you?
```

---

## 7. Script Variant Policy

### 7.1 Storage rule

All content stores both simplified and traditional forms, even when they are the same character.

```text
If identical:   simplified: 我   traditional: 我
If different:   simplified: 这   traditional: 這
```

### 7.2 Display rule

The user's `script_preference` setting controls which script is shown throughout the app:

```text
script_preference = simplified → show simplified everywhere
script_preference = traditional → show traditional everywhere
```

### 7.3 Review answer rule

```text
Primary rule: accept the script the user is studying (their script_preference)
Optional:     also accept the other script variant in recognition questions

Example:
User studies simplified.
Question: What does 这 mean?
Answer: "this"
Optional: also accept 這 as a correct hanzi recognition answer.
```

### 7.4 Switching script mid-learning

If a user changes `script_preference` after starting:

```text
- Display updates immediately for all new content
- Existing SRS progress is preserved — items do not reset
- Review questions adapt to the new script_preference
- No content re-seeding required
```

### 7.5 Content authoring rule

Content authors must fill both `simplified` and `traditional` fields for every entry. The app cannot function correctly for traditional script users if the `traditional` field is null or identical when it should differ.

---

## 9. Level Structure

### 7.1 Ten-level content design

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

### 7.2 Ordering rules within a level

Teach in this order of priority:

```text
1. High-frequency words first
2. Easy pronunciation (not too many tones or difficult syllables)
3. Simple sentence usefulness — can it be used right away?
4. Low grammar complexity
5. Hanzi/component utility — unlocks many other items
```

Do not order purely by HSK list or stroke count.

### 7.3 First 50 words content themes

The first 50 words should cover:

```text
Pronouns: 我, 你, 他, 她, 我们, 你们, 他们
Greetings: 你好, 谢谢, 对不起, 没关系, 再见
Core verbs: 是, 有, 去, 来, 吃, 喝, 要, 想, 知道, 回
This/that: 这, 那
Question words: 什么, 哪里, 谁, 怎么样, 多少
Negation: 不, 没
Basic nouns: 人, 水, 饭, 钱, 家, 书, 手机, 朋友
Time: 今天, 明天, 现在
Numbers: 一 through 十
Particles: 吗, 的, 了, 吧, 呢
```

### 7.4 Component introduction rule

```text
Levels 1–3: components appear only as explanations inside hanzi lessons
Level 2+:   standalone component cards begin appearing
            only after the user has enough hanzi context to find them useful
```

---

## 10. Review Question Design

### 8.1 Review question types supported in V1

```text
Meaning recognition   — hanzi shown, user recalls English meaning
Hanzi recognition     — English shown, user selects correct hanzi
Pinyin recognition    — hanzi shown, user recalls pinyin
Tone recognition      — word shown, user selects correct tone number(s)
Sentence meaning      — full sentence shown, user recalls English translation
Fill in the blank     — sentence with gap, user selects or types the missing word
Component recall      — hanzi shown, user recalls its components
```

### 8.2 Required review angles per core word

Each core word should support:

```text
Hanzi → meaning
Meaning → hanzi (multiple choice)
Hanzi → pinyin
Pinyin → tone (multiple choice)
Sentence context → meaning
```

### 8.3 Tone review requirement

Tone review is mandatory because tone weakness is tracked separately from pinyin.

**Example tone question:**
```text
Question: What is the tone pattern for 你好?

Options:
A) 3-3
B) 2-3
C) 3-4
D) 4-3

Answer: A) 3-3

Note shown on answer: Dictionary tones are 3-3.
In natural speech, the first 3rd tone often sounds like 2nd tone.
```

### 8.4 Wrong answer feedback

Wrong answer feedback should explain only what is needed. Keep it short.

**Good feedback:**
```text
Not quite. 好 is hǎo, 3rd tone. Let your voice dip low.
```

**Bad feedback:**
```text
Incorrect. The correct pronunciation is hǎo, which uses the third tone,
a contour tone that historically developed from the classical entering tone...
```

---

## 11. Answer Matching Rules

### 9.1 Meaning answers (English)

Use a whitelist of accepted answers per item stored in `accepted_meanings`.

```text
Exact match:                  always accepted
Case-insensitive:             always accepted ("Home" = "home")
Minor typo (1 character off): accepted in lenient mode
Synonym:                      accepted only if explicitly listed in accepted_meanings
```

**Examples:**

```text
家 = home
Accepted:   home, a home
Rejected:   house, family, room, place

好 = good
Accepted:   good, well, okay, fine
Rejected:   nice, great, excellent
```

Rejected alternatives should be blocked — they map to different Chinese words and teaching them as synonyms creates confusion.

> **`accepted_meanings` and `blocked_meanings`** must be filled for every reviewable hanzi and word entry. These lists are what make answer matching consistent. Without them, the review system cannot distinguish between correct synonyms and confusing wrong answers.

### 9.2 Pinyin answers (reading questions)

```text
Exact pinyin with tone mark:   always accepted    jiā ✓
Numbered tone format:          always accepted    jia1 ✓
Toneless pinyin:               Level 1 only       jia ✓ (beginner mode)
Wrong tone:                    always rejected    jiá ✗
Wrong syllable:                always rejected    jie ✗
```

**Beginner mode rule:** At Level 1, accept toneless pinyin to prevent early frustration. From Level 2 onward, require correct tone marks or numbered tones. This enforces tone accuracy progressively.

### 9.3 Tone questions (multiple choice)

```text
No partial credit — all syllables must be correct for multi-syllable items.
Wrong tone answers are always recorded in tone_answered / tone_correct.
This data powers the weak area detection system.
```

### 9.4 Component questions

```text
Accepted: correct component name (exact or case-insensitive)
Accepted: listed alternative name in accepted_meanings
Rejected: vague descriptions not in the accepted list
```

### 9.5 Self-check questions (Forgot / Got it)

No answer matching needed. The mnemonic is always visible before the user taps Got it or Forgot.

---

## 12. Weak Area Tracking

### 10.1 Weak area categories

Each review contributes to one or more weak area categories:

```text
meaning     — wrong meaning answer
hanzi       — wrong hanzi recognition answer
pinyin      — wrong syllable answer
tone        — wrong tone answer (tracked separately from pinyin)
sentence    — wrong sentence translation
grammar     — wrong grammar pattern answer
```

### 10.2 Tone-specific tracking

Tone is tracked separately from pinyin so the app can distinguish between:

```text
User typed: ni3 hao4
Correct:    ni3 hao3

Result:
pinyin_correct: true   (syllable recognized correctly)
tone_correct:   false  (wrong tone on hao)
weak_area:      tone
```

### 10.3 Tone confusion pairs

The most common confusion pairs for non-tonal speakers:

```text
Tone 2 vs Tone 3  — hardest pair; rising vs dipping
Tone 1 vs Tone 4  — high-flat vs falling
Tone 3 vs Tone 4  — dipping vs falling
```

When a user consistently confuses a specific pair (e.g. always selecting T2 when correct is T3), the Progress page surfaces this explicitly as a weak area and prioritizes those items in the next session.

### 10.4 Weak area calculation rule

```text
Weak area = accuracy below 70% in the last 20 reviews
            AND at least 5 completed reviews in that group
```

Groups are: tone pair / item type / question type / grammar marker.

If there is not enough review data yet, show:

```text
Not enough data yet. Keep reviewing.
```

---

## 13. Content QA Checklist

Run every item through this checklist before seeding.

### 11.1 Component QA

```text
□ Component is visually recognizable
□ Name is one word or a short phrase
□ Meaning hint is simple and beginner-safe
□ Example hanzi are correct and already seeded
□ Mnemonic is short (1–2 sentences) and visual
□ No unnecessary academic explanation
□ is_reviewable is set correctly
□ level is assigned correctly
```

### 11.2 Hanzi QA

```text
□ Simplified form is correct
□ Traditional form is correct (or same as simplified)
□ pinyin_diacritic is correct
□ pinyin_numbered is correct
□ tone_number matches pinyin_syllables
□ pinyin_syllables has exactly one entry per syllable
□ Neutral tone stored as "tone": 0, not omitted
□ tone_pattern matches the syllables
□ Meaning is one word or short phrase, not a sentence
□ Meaning mnemonic uses component names as story elements
□ Reading mnemonic anchors sound to a memorable English image
□ At least one related word is linked
□ frequency_rank is filled in
□ level is appropriate
□ is_reviewable is set correctly
```

### 11.3 Word QA

```text
□ Simplified form is correct
□ Traditional form is correct
□ pinyin_diacritic is correct
□ pinyin_numbered is correct
□ pinyin_syllables has one entry per syllable
□ Neutral tone stored as "tone": 0
□ tone_pattern is correct and matches pinyin_syllables
□ Meaning is short and practical (one primary meaning)
□ part_of_speech is correct
□ At least one example sentence is linked
□ Example sentence uses only level-appropriate vocabulary
□ topic_tags are useful (max 3)
□ frequency_rank is filled in
□ level is appropriate
□ is_reviewable is set correctly
□ All hanzi in this word exist in the hanzi table
```

### 11.4 Sentence QA

```text
□ Sentence is natural (a native speaker would say this)
□ Sentence is short enough for the level (3–8 characters for Levels 1–3)
□ translation_en is accurate and natural
□ literal_translation_en is helpful, not confusing (or left null)
□ pinyin_diacritic is correct
□ pinyin_numbered is correct
□ pinyin_syllables covers every syllable
□ Neutral tones stored as "tone": 0
□ All hanzi in the sentence are available at or before this level
□ Focus words (2–4) exist in the words table
□ Grammar pattern tag is attached if relevant (max 1)
□ usage_context_en is helpful (or left null)
□ level is appropriate
□ is_reviewable is set correctly
```

### 11.5 Grammar Note QA

```text
□ Explains one pattern only
□ Formula is in plain English structure notation
□ Explanation is 1–2 sentences maximum
□ At least 2 example sentences are linked from the sentences table
□ Common mistake is included if there is an obvious one
□ No linguistic jargon
□ is_reviewable is false in V1
□ level is appropriate
```

### 11.6 Mnemonic QA

```text
□ Easy to visualize
□ Short (1–3 sentences)
□ Helps with shape, sound, meaning, or tone
□ Not childish or offensive
□ Not too culturally specific unless explained
□ Uses component names where relevant (meaning mnemonic)
□ Anchors to a clear English sound image (reading mnemonic)
□ Connects tone to physical movement or emotion (tone mnemonic)
```

### 11.7 Lesson Pack QA

```text
□ Theme is clear and practical
□ Learning goal is one specific thing the user can do after this pack
□ Has 3–5 primary word items
□ Has 2–5 support sentence items
□ Has 0–1 grammar note (support role only)
□ All items are at the correct level
□ All items exist in their respective tables before the pack is seeded
□ sort_order is correct within the level
□ estimated_minutes is realistic
```

### 11.8 App readiness QA

```text
□ Item has all required fields filled
□ Item has correct relationships (words linked to hanzi, sentences linked to words)
□ Item has level assigned
□ Item has is_reviewable set correctly
□ Item has topic_tags (words and sentences)
□ Item has weak area mapping potential (question types it supports)
□ Item can appear in a lesson pack
□ Item can appear in a review session
```

---

## 14. Content Authoring Style Guide

### 12.1 English content style

Use:
- Short explanations — one idea per sentence
- Plain English — no linguistics terminology
- Natural examples — something you would actually say
- Beginner-friendly wording throughout

Avoid:
- Long grammar lectures
- Technical linguistic terms (morpheme, phoneme, contour tone, etc.)
- Too many meanings at once
- Overexplaining

### 12.2 Translation style

Translations should preserve meaning, not always word order.

Include literal translation only when it genuinely helps the user understand why the sentence works.

```text
我回家。
Natural translation:  I'm going home.
Literal translation:  I return home.
(Both useful here — show both)

你好吗？
Natural translation:  How are you?
Literal translation:  You good?
(Literal is informal but useful — include it)
```

---

## 15. Content Seed Order

Content must be created in a specific order. Orphaned entries — words that reference hanzi that don't exist yet, or sentences that use vocabulary not in the database — will break the lesson and unlock system.

### 13.1 Hard ordering rules

```text
Never create a word before all its hanzi exist in the database.
Never create a sentence before all its focus words exist in the database.
Never create a grammar note without at least 2 example sentences already seeded.
Never create a component that is not used by at least one hanzi in the current batch.
Never create a lesson pack before all its items exist.
```

### 13.2 Prototype batch order

```text
Step 1: Select 40 high-frequency hanzi
        Prioritize hanzi that unlock many useful words.
        Examples: 你, 我, 好, 家, 大, 小, 人, 水, 日, 月, 去, 来, 吃, 喝, 是

Step 2: Identify components for those 40 hanzi
        Only create components that appear in the selected hanzi.
        Do not create orphaned components.
        Examples: 亻, 口, 女, 子, 宀, 豕, 氵

Step 3: Create 80 words using only those 40 hanzi
        Every character in a word must exist in the hanzi table.
        Examples: 你好, 回家, 大家, 喝水, 今天, 去哪里

Step 4: Create 30 useful sentences using only those 80 words
        Every word in a sentence must exist in the words table.
        Sentences should sound natural and cover daily situations.
        Examples: 你好！  我回家。  我们回家吧。

Step 5: Attach grammar notes to those sentences
        Grammar notes live inside sentence entries in V1.
        Do not create standalone grammar SRS cards.
        Examples: Subject + Verb, Subject + 很 + Adjective

Step 6: Group into lesson packs
        Organize the 40 hanzi and 80 words into themed packs.
        Follow the recommended pack order from Section 5.5.

Step 7: QA pass
        Run every item through the QA checklists in Section 12 before seeding.
```

### 13.3 V1 launch batch order

```text
Step 1: Expand to 100 hanzi (add 60 more following the same rules)
Step 2: Add components for the new hanzi
Step 3: Expand to 200 words using the 100 hanzi
Step 4: Expand to 100 sentences using the 200 words
Step 5: Create grammar notes for new patterns
Step 6: Expand lesson packs to cover all new content
Step 7: Full QA pass using the checklists in Section 12
```

### 13.4 Content targets

```text
Prototype:
20 components · 40 hanzi · 80 words · 30 sentences · 10 grammar notes · 10 lesson packs

V1 launch:
50 components · 100 hanzi · 200 words · 100 sentences · 30 grammar notes · 20 lesson packs

Strong V1:
80 components · 300 hanzi · 800–1,000 words · 400–600 sentences · 50 grammar notes
```

---

## 16. Content Creation Workflow

### 14.1 Step-by-step per pack

```text
1.  Choose theme and learning goal
2.  Pick 3–5 useful words
3.  Identify hanzi for those words
4.  Identify components for those hanzi (add if not yet seeded)
5.  Write 2–5 natural sentences using those words
6.  Add one grammar note if a clear pattern exists
7.  Write mnemonics (meaning, reading, tone) for each hanzi
8.  Fill all pinyin fields (diacritic, numbered, syllables, tone_pattern)
9.  Add topic tags, level, frequency rank
10. Assign is_reviewable flag to each item
11. Run QA checklist
12. Create the lesson pack and link all items with correct roles
13. Seed and test in lesson flow and review flow
```

### 16.2 Content review roles

For solo development, do the same process in separate passes — write first, check accuracy separately, then check app readiness.

For team development:

```text
Creator:        writes content — mnemonics, sentences, explanations
Checker:        verifies Mandarin accuracy — pinyin, tone, translation
Product review: checks usefulness and beginner fit
App review:     checks fields, relationships, and SRS readiness
```

### 16.3 Mandarin accuracy QA — four-tier system

Bad tone data or unnatural sentences actively teach users the wrong thing. This is hard to fix after users have learned items. Use this tiered system — higher tiers are better, but each tier is viable depending on where you are in the build.

**Tier 1 — Automated validation (required)**

Run scripts or database checks before seeding any content batch:

```text
□ All required fields present
□ pinyin_diacritic format is valid
□ tone_number is 0–4
□ tone_pattern matches pinyin_syllables syllable count
□ Neutral tone stored as 0, not omitted
□ pinyin_syllables array is not empty
□ simplified and traditional fields both exist
□ No duplicate slugs
□ No orphaned components (not used by any hanzi)
□ No word referencing a hanzi not in the database
□ No sentence referencing a focus word not in the database
□ Sentence character count within level range
□ Lesson pack has 3–5 primary items and at least 2 support sentences
```

**Tier 2 — Source cross-check (required)**

Verify every item against at least two trusted references before seeding:

```text
Pleco dictionary
MDBG (mdgb.net)
CC-CEDICT open-source dictionary
Chinese Grammar Wiki (for grammar notes)
HSK official word lists (for vocabulary accuracy)
Forvo / YouGlish (for pronunciation reference)
Trusted Mandarin textbook or course reference
```

Rule:
```text
If two reliable sources agree → accept for V1
If sources disagree → skip the item or mark needs_review: true
```

**Tier 3 — AI review (recommended)**

Use AI to check:
```text
Sentence naturalness — "Would a native speaker say this?"
Beginner appropriateness — "Is this too advanced for the level?"
Translation quality — "Is the English natural, not just literal?"
Grammar note clarity — "Is the formula and explanation beginner-safe?"
Mnemonic usefulness — "Is this memorable and not misleading?"
```

Do not use AI as the sole authority for pinyin, tones, or character correctness. Those must pass Tier 2.

**Tier 4 — User feedback loop (required before public launch)**

Add a Report Issue feature so real users can flag content problems after launch. This turns usage into lightweight ongoing QA. See Section 20 for the full Report Issue spec.

**Priority for verification:**

```text
High priority — verify before any content enters production:
  All pinyin and tone data
  All sentence translations and naturalness
  All reading mnemonics (must not mislead pronunciation)

Lower priority — can refine post-launch via issue reports:
  Meaning mnemonics (creative, not factual)
  Usage notes (informational, lower risk)
  Grammar explanation prose (verify formula and examples, not wording)
```

---

## 17. Example Item Pack 1 — Greetings

### Components

```text
口
slug: mouth-kou
name_en: mouth
meaning_en: mouth / opening
visual_hint_en: looks like an open mouth
mnemonic_en: A square mouth, open and asking.
used in: 吗, 叫, 吃

女
slug: woman-nv
name_en: woman
meaning_en: woman / female
visual_hint_en: looks like a person with arms out
mnemonic_en: A figure gracefully crossing her arms.
used in: 好, 她, 姓

子
slug: child-zi
name_en: child
meaning_en: child
visual_hint_en: looks like a baby with arms raised
mnemonic_en: A small child with arms up wanting to be picked up.
used in: 好, 字, 学
```

### Hanzi

```text
你
slug: you-ni
simplified: 你    traditional: 你
pinyin_diacritic: nǐ    pinyin_numbered: ni3
tone_number: 3    tone_pattern: "3"
pinyin_syllables: [{"hanzi":"你","pinyin":"nǐ","tone":3}]
meaning_en: you
meaning_mnemonic_en: Picture yourself pointing to someone: "you."
reading_mnemonic_en: "Knee" — point at someone's knee and say "nǐ."
tone_mnemonic_en: Let your voice dip low, like nodding at someone: nǐ.
level: 1    frequency_rank: 2    is_reviewable: true

好
slug: good-hao
simplified: 好    traditional: 好
pinyin_diacritic: hǎo    pinyin_numbered: hao3
tone_number: 3    tone_pattern: "3"
pinyin_syllables: [{"hanzi":"好","pinyin":"hǎo","tone":3}]
meaning_en: good
meaning_mnemonic_en: A woman and child together make a picture of "good."
reading_mnemonic_en: "How?" — ask "How?" with a dip: hǎo.
tone_mnemonic_en: Dip your voice low like nodding thoughtfully: hǎo.
components: 女 woman, 子 child
level: 1    frequency_rank: 15    is_reviewable: true

吗
slug: question-particle-ma
simplified: 吗    traditional: 嗎
pinyin_diacritic: ma    pinyin_numbered: ma5
tone_number: 0    tone_pattern: "0"
pinyin_syllables: [{"hanzi":"吗","pinyin":"ma","tone":0}]
meaning_en: question particle
meaning_mnemonic_en: A mouth asks a quick, light question: ma?
reading_mnemonic_en: Neutral tone — say it softly, like a sigh at the end.
components: 口 mouth, 马 horse
level: 1    frequency_rank: 28    is_reviewable: true
```

### Words

```text
你好
slug: hello-nihao
simplified: 你好    traditional: 你好
pinyin_diacritic: nǐ hǎo    pinyin_numbered: ni3 hao3
pinyin_syllables: [{"hanzi":"你","pinyin":"nǐ","tone":3},{"hanzi":"好","pinyin":"hǎo","tone":3}]
tone_pattern: "3-3"
meaning_en: hello
part_of_speech: expression
mnemonic_en: "You good" — the simplest greeting in Mandarin.
usage_note_en: Standard greeting for any situation. Literally means "you good."
topic_tags: {greeting, survival}
level: 1    is_core_word: true    is_reviewable: true

我
slug: i-me-wo
simplified: 我    traditional: 我
pinyin_diacritic: wǒ    pinyin_numbered: wo3
pinyin_syllables: [{"hanzi":"我","pinyin":"wǒ","tone":3}]
tone_pattern: "3"
meaning_en: I / me
part_of_speech: pronoun
usage_note_en: Used for both "I" and "me" depending on context.
topic_tags: {self}
level: 1    is_core_word: true    is_reviewable: true

很
slug: very-hen
simplified: 很    traditional: 很
pinyin_diacritic: hěn    pinyin_numbered: hen3
pinyin_syllables: [{"hanzi":"很","pinyin":"hěn","tone":3}]
tone_pattern: "3"
meaning_en: very / quite
part_of_speech: adverb
usage_note_en: Often placed before adjectives. Does not always mean "very" strongly — it sometimes just links subject and adjective.
topic_tags: {basic_adjective}
level: 1    is_core_word: true    is_reviewable: true
```

### Sentences

```text
你好。
slug: hello-nihao-sentence
pinyin_diacritic: Nǐ hǎo.
pinyin_numbered: Ni3 hao3.
pinyin_syllables: [{"hanzi":"你","pinyin":"nǐ","tone":3},{"hanzi":"好","pinyin":"hǎo","tone":3}]
translation_en: Hello.
level: 1    is_reviewable: true

你好吗？
slug: how-are-you
pinyin_diacritic: Nǐ hǎo ma?
pinyin_numbered: Ni3 hao3 ma5?
pinyin_syllables: [{"hanzi":"你","pinyin":"nǐ","tone":3},{"hanzi":"好","pinyin":"hǎo","tone":3},{"hanzi":"吗","pinyin":"ma","tone":0}]
translation_en: How are you?
literal_translation_en: You good?
usage_context_en: Common greeting — equivalent to "How are you?" in English.
level: 1    is_reviewable: true

我很好。
slug: i-am-good
pinyin_diacritic: Wǒ hěn hǎo.
pinyin_numbered: Wo3 hen3 hao3.
pinyin_syllables: [{"hanzi":"我","pinyin":"wǒ","tone":3},{"hanzi":"很","pinyin":"hěn","tone":3},{"hanzi":"好","pinyin":"hǎo","tone":3}]
translation_en: I'm good.
literal_translation_en: I very good.
level: 1    is_reviewable: true
```

### Grammar Note

```text
slug: yes-no-question-ma
title_en: Asking yes/no questions with 吗
pattern: Statement + 吗？
formula: Subject + verb/adjective + 吗？
explanation_en: Add 吗 at the end of a statement to turn it into a yes/no question.
common_mistakes_en: Don't use 吗 with questions that already have a question word like 什么 or 哪里.
level: 1    is_reviewable: false
```

### Lesson Pack

```text
slug: pack-greetings
title_en: Greetings
theme_en: Greeting someone
learning_goal_en: Say hello, ask how someone is, and give a simple answer.
level: 1    sort_order: 1    estimated_minutes: 10

Items:
Primary (enters SRS): 你好, 我, 很, 好, 吗
Support (context only): 你好。  你好吗？  我很好。  Grammar: yes-no question with 吗
```

---

## 18. Example Item Pack 2 — Going Home

### Hanzi

```text
回
slug: return-hui
simplified: 回    traditional: 回
pinyin_diacritic: huí    pinyin_numbered: hui2
tone_number: 2    tone_pattern: "2"
pinyin_syllables: [{"hanzi":"回","pinyin":"huí","tone":2}]
meaning_en: return
meaning_mnemonic_en: A square inside a square — going back inside where you started.
reading_mnemonic_en: "Huey" — like Huey the character going back home.
tone_mnemonic_en: Your voice rises like you are turning back: huí.
level: 1    frequency_rank: 45    is_reviewable: true

家
slug: home-jia
simplified: 家    traditional: 家
pinyin_diacritic: jiā    pinyin_numbered: jia1
tone_number: 1    tone_pattern: "1"
pinyin_syllables: [{"hanzi":"家","pinyin":"jiā","tone":1}]
meaning_en: home
meaning_mnemonic_en: A roof over the family — even the pig. That is home.
reading_mnemonic_en: Imagine shouting "JIA!" as you walk through your front door.
tone_mnemonic_en: High and flat — you are confidently and calmly home: jiā.
components: 宀 roof, 豕 pig/animal
level: 1    frequency_rank: 52    is_reviewable: true
```

### Words

```text
回家
slug: go-home-huijia
simplified: 回家    traditional: 回家
pinyin_diacritic: huí jiā    pinyin_numbered: hui2 jia1
pinyin_syllables: [{"hanzi":"回","pinyin":"huí","tone":2},{"hanzi":"家","pinyin":"jiā","tone":1}]
tone_pattern: "2-1"
meaning_en: go home
part_of_speech: verb phrase
mnemonic_en: Return + home = go back home.
usage_note_en: Used when heading back to one's home.
topic_tags: {home, travel, daily}
level: 1    is_core_word: true    is_reviewable: true

去
slug: go-qu
simplified: 去    traditional: 去
pinyin_diacritic: qù    pinyin_numbered: qu4
pinyin_syllables: [{"hanzi":"去","pinyin":"qù","tone":4}]
tone_pattern: "4"
meaning_en: go
part_of_speech: verb
usage_note_en: A basic movement verb — going away from where you are now.
topic_tags: {basic_verb, travel}
level: 1    is_core_word: true    is_reviewable: true
```

### Sentences

```text
我回家。
slug: i-go-home
pinyin_diacritic: Wǒ huí jiā.
pinyin_numbered: Wo3 hui2 jia1.
pinyin_syllables: [{"hanzi":"我","pinyin":"wǒ","tone":3},{"hanzi":"回","pinyin":"huí","tone":2},{"hanzi":"家","pinyin":"jiā","tone":1}]
translation_en: I'm going home.
literal_translation_en: I return home.
level: 1    is_reviewable: true

我们回家吧。
slug: lets-go-home
pinyin_diacritic: Wǒmen huí jiā ba.
pinyin_numbered: Wo3men5 hui2 jia1 ba5.
pinyin_syllables: [{"hanzi":"我","pinyin":"wǒ","tone":3},{"hanzi":"们","pinyin":"men","tone":0},{"hanzi":"回","pinyin":"huí","tone":2},{"hanzi":"家","pinyin":"jiā","tone":1},{"hanzi":"吧","pinyin":"ba","tone":0}]
translation_en: Let's go home.
usage_context_en: Use this to suggest going home to someone you are with.
level: 1    is_reviewable: true

你去吗？
slug: are-you-going
pinyin_diacritic: Nǐ qù ma?
pinyin_numbered: Ni3 qu4 ma5?
pinyin_syllables: [{"hanzi":"你","pinyin":"nǐ","tone":3},{"hanzi":"去","pinyin":"qù","tone":4},{"hanzi":"吗","pinyin":"ma","tone":0}]
translation_en: Are you going?
level: 1    is_reviewable: true
```

### Grammar Note

```text
slug: simple-subject-verb
title_en: Simple subject + verb sentences
formula: 我/你 + verb
explanation_en: Mandarin can make simple sentences without "am," "is," or "are."
common_mistakes_en: English speakers often try to add 是 (shì) where it is not needed.
level: 1    is_reviewable: false
```

---

## 19. Content Versioning

### 19.1 Purpose

Once users have started learning items, changing core content (pinyin, tone, meaning) can break their memory. Content versioning tracks what changed, when, and how serious the change is.

### 19.2 Versioning fields

Added to all reviewable content tables:

```text
content_version     int default 1    — increments on every update
last_updated_at     timestamp        — when the item was last edited
change_type         text nullable    — null (original), minor, major
last_reviewed_by    text nullable    — who verified the content (name or role)
```

### 19.3 Change type rules

```text
minor change — safe to update silently
  Examples: typo fix in mnemonic, rephrasing usage note,
            adding an accepted_meaning synonym, fixing a translation wording

major change — requires user notification and re-review flag
  Examples: correcting a wrong tone number,
            correcting wrong pinyin,
            changing the primary meaning of an item,
            replacing a mnemonic entirely
```

### 19.4 Major change handling

When a pinyin, tone, or meaning changes after users have already learned the item:

```text
1. Update the content with the correct data
2. Set change_type = 'major'
3. Increment content_version
4. Flag all user_item_progress rows for this item:
   set needs_relearn = true
5. On next review, show the user:
   "This item was updated. Please recheck before continuing."
6. Reset SRS stage to Learning for affected users
```

### 19.5 content_version_seen on user_item_progress

Add `content_version_seen` to the `user_item_progress` table to track which version of the content the user learned.

```sql
content_version_seen int default 1  -- the content_version at the time the user last reviewed this item
```

This allows the app to know precisely whether a user learned an older version of the content:

```text
If user_item_progress.content_version_seen < item.content_version
AND item.change_type = 'major'
→ flag needs_relearn = true
→ show "item updated" notice on next review
```

For minor changes, `content_version_seen` still increments on next review, but no relearn is triggered.

Update `content_version_seen` every time a review is submitted:

```sql
UPDATE user_item_progress
SET content_version_seen = [current item content_version]
WHERE user_id = $user_id AND item_id = $item_id;
```

### 19.6 V1 implementation

In V1, implement the versioning fields in the schema from day one but do not build the re-review notification UI yet. Store the data; build the notification flow in V2.

```text
V1: store content_version, change_type, last_updated_at on all content tables
V2: build "item updated" notification and re-review flow for affected users
```

---

## 20. Report Issue Feature

### 20.1 Purpose

The Report Issue feature lets users flag wrong or confusing content. This is the Tier 4 QA layer — real users catching real problems at scale. It must ship before public launch.

### 20.2 Where it appears

Show a small "Report issue" link on all content-heavy screens:

```text
Lesson item detail
Review question (small link, not prominent)
Wrong-answer panel
Library item detail
Grammar note detail
Sentence detail
Item detail page
```

It should be available but not visually loud. It must never interrupt the learning flow.

### 20.3 Report categories

```text
English               Indonesian
Wrong pinyin          Pinyin salah
Wrong tone            Nada salah
Wrong meaning         Arti salah
Unnatural sentence    Kalimat tidak natural
Wrong character       Karakter simplified/traditional salah
Audio issue           Masalah audio
Typo                  Typo
Other                 Lainnya
```

Priority order for admin review:
```text
1. Wrong tone
2. Wrong pinyin
3. Wrong meaning
4. Wrong character form
5. Unnatural sentence
6. Audio issue
7. Typo
8. Other
```

Tone and pinyin issues are highest priority because they directly damage learning accuracy.

### 20.4 Report form

Required: issue category (single select)
Optional: short comment

Auto-captured (user does not fill these in):
```text
user_id
item_id
item_type
lesson_pack_id (if in a lesson)
review_session_id (if in a review)
question_id (if available)
app_language
script_preference
created_at
```

### 20.5 User confirmation copy

```text
English:   Thanks. We'll review this item.
Indonesian: Terima kasih. Item ini akan dicek.
```

### 20.6 Report status workflow

```text
open       — report received, not yet reviewed
reviewing  — admin is checking the item
fixed      — item corrected, content_version incremented
rejected   — report was invalid or duplicate
duplicate  — same issue already reported
```

### 20.7 Report Issue + content versioning link

When a report leads to a fix:

```text
Minor fix (typo, wording):
  → Update item
  → Increment content_version
  → Set change_type = 'minor'
  → Set report status = 'fixed'
  → No SRS reset for users

Major fix (wrong pinyin, tone, or meaning):
  → Update item
  → Increment content_version
  → Set change_type = 'major'
  → Set report status = 'fixed'
  → Set needs_relearn = true for all users who have learned this item
  → On next review, show: "This item was recently updated. Worth a quick recheck."
```

### 20.8 Database table: content_issue_reports

```sql
id uuid primary key
user_id uuid references users(id)
item_type text
item_id uuid
lesson_pack_id uuid nullable
review_session_id uuid nullable
question_id uuid nullable
issue_category text            -- wrong_pinyin, wrong_tone, wrong_meaning,
                               --   unnatural_sentence, wrong_script_variant,
                               --   audio_issue, typo, other
comment text nullable
app_language text
script_preference text
status text default 'open'     -- open, reviewing, fixed, rejected, duplicate
admin_notes text nullable
resolved_by text nullable
resolved_at timestamp nullable
created_at timestamp
updated_at timestamp
```

Constraints:
```sql
CHECK (issue_category IN ('wrong_pinyin','wrong_tone','wrong_meaning',
  'unnatural_sentence','wrong_script_variant','audio_issue','typo','other'))

CHECK (status IN ('open','reviewing','fixed','rejected','duplicate'))
```

---

## 21. Final Content Rules

### Must-have for every reviewable item

```text
□ Prompt content (hanzi, word, or sentence)
□ Pinyin — both diacritic and numbered formats
□ Tone data — tone_number, tone_pattern, pinyin_syllables (complete, no gaps)
□ Meaning in English
□ Level assigned
□ item_type set
□ is_reviewable flag set
□ Linked to at least one example sentence (for hanzi and words)
□ Weak area mapping (question types this item supports)
```

### Avoid these mistakes

```text
Teaching too many words per session (max 5 primary items per pack)
Adding long explanations (1–2 sentences maximum for any note)
Ignoring tones (every item must have complete tone data)
Using unnatural sentences (test against "would a native say this?")
Mixing simplified/traditional inconsistently
Adding content without a QA pass
Teaching grammar before the user has seen enough example sentences
Using translations that are too literal without natural equivalent
Using mnemonics that are too long or too abstract
Creating words before their hanzi are seeded
Creating sentences before their focus words are seeded
```

### Content north star

> The user should finish a lesson thinking: "I learned something small, useful, and memorable — and I can review it tomorrow."
