# Mandarin Learning App — UI/UX Guidelines + Wireframes

> **UX north star:** The user should always feel: "I know what to do next. The lesson is small enough. Mistakes are okay. The app remembers my progress. I can come back tomorrow." The UI should disappear behind the learning habit.

---

## 0. Purpose

This document guides the frontend design for a simple, lightweight Mandarin learning PWA. It covers design principles, navigation, layouts, wireframes, components, design tokens, and interaction patterns.

The goal is not a visually heavy app. The goal is a clear learning flow users can finish in 5–15 minutes per day.

---

## 1. Product UX Goal

The app should help the user answer one question quickly:

  What should I learn or review today?

Main daily loop:
  Open app → Today → Lesson or Review → Complete session → See progress → Close app

The UI should support this loop with as little friction as possible.

---

## 2. Design Principles

### 2.1 Simple first
Each screen has one main purpose.
- Today page = what to do now
- Lesson page = learn new items
- Review page = answer one question
- Library = browse learned content
- Progress = see learning status
- Settings = adjust preferences

### 2.2 Short sessions
Design for 5, 10, and 15-minute sessions. Users start quickly and stop easily.

### 2.3 Touch-first
Design for touch even on desktop. No tiny buttons. Large tap areas. Cards over small text links. Bottom navigation on mobile. Keyboard support on desktop.

### 2.4 Calm, not gamey
Soft colors, clear cards, small animations, simple progress indicators, light gamification.
Avoid: too many badges, too many popups, constant celebration, loud colors, distracting animations.

### 2.5 Learning content first
The Mandarin item is always the visual focus on lesson and review screens. Hanzi, pinyin, meaning, tone, and example sentence always dominate.

### 2.6 Offline-friendly
Support cached lessons, cached reviews, offline progress queue, sync status, and clear network error states.

---

## 3. Information Architecture

V1 navigation (5 items):
  Today · Review · Library · Progress · Settings

Lessons live inside Today — no separate Lessons tab in V1. A separate tab makes the app feel like a course catalog. V1 should feel like a daily habit app.

Main screens:
  Today · Lesson session · Review session · Wrong-answer panel
  Library · Item detail · Progress · Settings · Onboarding · Report issue modal

---

## 4. App Shell Layout

### 4.1 Mobile — bottom navigation

  [ Top bar: page title / streak / settings shortcut ]
  [ Main content                                      ]
  [ Bottom nav: Today | Review | Library | Progress | Settings ]

Bottom nav stays visible outside full-screen sessions.
During focused lesson/review sessions, bottom nav is hidden to reduce distraction.

### 4.2 Desktop — left sidebar

  [ Sidebar: logo/name + nav ] [ Main content ]

Max content width:
- Learning screens: 720px–960px
- Library/Progress: 960px–1200px

### 4.3 Tablet layout
Use mobile-style layout on tablets unless comfortable sidebar width is available.
Consider pointer type, screen width, available height, and content density.

---

## 5. Design Tokens

These values must be used consistently across all screens.

### 5.1 Base colors

  Background:   #F8FAFC
  Surface:      #FFFFFF
  Text primary: #111827
  Text muted:   #6B7280
  Border:       #E5E7EB

### 5.2 Primary accent

  Primary:      #3B82F6
  Primary soft: #DBEAFE
  Primary dark: #1D4ED8

### 5.3 Semantic colors

  Success:  #10B981
  Warning:  #F59E0B
  Error:    #EF4444

### 5.4 Tone colors (used everywhere pinyin appears)

  Tone 1 — Blue:    #2563EB
  Tone 2 — Green:   #16A34A
  Tone 3 — Orange:  #F97316
  Tone 4 — Red:     #DC2626
  Neutral — Gray:   #6B7280

Tone colors must always be paired with tone marks or tone numbers. Never rely on color alone.

### 5.5 SRS badge colors

  Learning:   #EC4899
  Familiar:   #8B5CF6
  Strong:     #3B82F6
  Mastered:   #10B981
  Long-term:  #111827

### 5.6 Typography

  UI font:      Inter / system font stack
  Chinese font: system CJK fallback (Noto Sans SC preferred)

  Page title:          24–32px
  Card title:          18–22px
  Body:                15–17px
  Helper text:         13–15px
  Hanzi review prompt: 48–72px mobile, 64–96px desktop
  Sentence prompt:     28–40px mobile, 36–52px desktop

### 5.7 Shape

  Cards:   12–16px radius
  Buttons: 10–14px radius
  Pills:   full radius (999px)
  Modals:  16–20px radius

### 5.8 Touch targets

  Minimum:     44×44px
  Preferred:   48×48px
  Main review choices: full-width cards

  Spacing between interactive elements:
  - 8px minimum between small buttons
  - 12–16px between choice cards
  - 16–24px between sections

---

## 6. Tone Colors — Usage Rules

Apply tone colors everywhere pinyin appears:
- Lesson cards
- Review cards
- Library cards
- Related words
- Sentence pinyin
- Search results
- Item detail pages

Display format:
  Color the pinyin text by tone
  Add optional tone badge: jiā [T1]
  Never rely on color alone — always include tone mark or number

---

## 7. SRS Badges

Use subtle pills in Library, item detail, review summary, and progress.
Do not show SRS badges on every review question.

Badge style: small pill label, soft background, clear text, optional small dot or icon.

---

## 8. Onboarding

Onboarding has 7 steps. The user must not feel blocked or overwhelmed. Each step is one screen with one decision.

### 8.1 Step 1 — Welcome

Mobile wireframe:
  ┌─────────────────────────┐
  │                         │
  │   Learn Mandarin        │
  │   in small daily steps. │
  │                         │
  │   Build words, tones,   │
  │   and sentences.        │
  │                         │
  │   [ Get started ]       │
  │                         │
  └─────────────────────────┘

### 8.2 Step 2 — App language

  ┌─────────────────────────┐
  │ Choose your app         │
  │ language.               │
  │                         │
  │ [ English            ]  │
  │ [ Bahasa Indonesia   ]  │
  │                         │
  │ You can change this     │
  │ later in Settings.      │
  └─────────────────────────┘

### 8.3 Step 3 — Script preference

  ┌─────────────────────────┐
  │ Which characters do     │
  │ you want to learn?      │
  │                         │
  │ [ Simplified         ]  │
  │ [ Traditional        ]  │
  │                         │
  │ You can switch later.   │
  └─────────────────────────┘

### 8.4 Step 4 — Mandarin experience

  ┌─────────────────────────┐
  │ Have you studied        │
  │ Mandarin before?        │
  │                         │
  │ [ I'm totally new    ]  │
  │ [ I know some words  ]  │
  └─────────────────────────┘

"I'm totally new" → skip to Step 6
"I know some words" → go to Step 5

### 8.5 Step 5 — Placement check (conditional)

Only shown for "I know some words" path.

  ┌─────────────────────────┐
  │ Quick check             │
  │ Tap what you know.      │
  │ ─────────────    3/10   │
  ├─────────────────────────┤
  │                         │
  │         回家             │
  │       huí jiā           │
  │        go home          │
  │                         │
  ├─────────────────────────┤
  │ [Know it] [Not sure]    │
  │ [Don't know]            │
  ├─────────────────────────┤
  │ No score. Just          │
  │ calibration.            │
  │            Skip step →  │
  └─────────────────────────┘

Skip step → skips directly to Step 6 (session length).
All items treated as Learning stage — full lesson content shown.
No partial placement results are saved when skipped.

Items marked "Know it" → seeded at Familiar stage (reviewed but not re-taught)
Items marked "Not sure" or "Don't know" → seeded at Learning stage (taught in lessons)
Lesson packs where all items are "Know it" are skipped.

Placement complete:
  ┌─────────────────────────┐
  │ Good.                   │
  │ We'll start from        │
  │ the right place.        │
  │                         │
  │ [ Continue ]            │
  └─────────────────────────┘

### 8.6 Step 6 — Daily session length

  ┌─────────────────────────┐
  │ How much time do you    │
  │ want to study each day? │
  │                         │
  │ [ 5 minutes          ]  │
  │ [ 10 minutes         ]  │
  │ [ 15 minutes         ]  │
  └─────────────────────────┘

### 8.7 Step 7 — Complete

  ┌─────────────────────────┐
  │ You're ready.           │
  │ Start your first        │
  │ short lesson.           │
  │                         │
  │ [ Start lesson ]        │
  └─────────────────────────┘

---

## 9. Today Page

### 9.1 Purpose
Tell the user what to do next. Not a dashboard full of statistics.

### 9.2 Lesson card display rule

  Today page lesson card:  show pack theme + learning goal
  Lesson intro screen:     show pack theme + learning goal + Start button
  Lesson item screen:      show only "Lesson · 2 of 5" — theme not repeated

### 9.3 States

  1. Lesson + reviews available
  2. Only reviews available
  3. Only lesson available
  4. Nothing due (caught up)
  5. Review backlog (due > session capacity)
  6. No new lessons (only reviews remain)
  7. Offline (cached session available)
  8. Loading / error

State 4 — nothing due:
  ┌─────────────────────────┐
  │ You're done for now.    │
  │ Come back later for     │
  │ your next review.       │
  └─────────────────────────┘

State 7 — offline:
  ┌─────────────────────────┐
  │ You're offline.         │
  │ You can keep reviewing  │
  │ cached items.           │
  │ Progress syncs when     │
  │ you reconnect.          │
  └─────────────────────────┘

State 8 — error:
  ┌─────────────────────────┐
  │ Something went wrong.   │
  │ Please try again.       │
  │ [ Try again ]           │
  └─────────────────────────┘

### 9.4 Mobile wireframe — State 1 (lesson + reviews)

  ┌─────────────────────────┐
  │ Today           🔥 3    │
  ├─────────────────────────┤
  │ Greetings               │
  │ Say hello, ask how      │
  │ someone is.             │
  │ [ Start lesson ]        │
  ├─────────────────────────┤
  │ Review today            │
  │ 6 items due             │
  │ [ Review now ]          │
  ├─────────────────────────┤
  │ 24 words learned        │
  │ Tone 2 vs Tone 3        │
  │ needs practice.         │
  └─────────────────────────┘
  [Today][Review][Library][Progress][Settings]

### 9.5 State 5 — backlog wireframe

  ┌─────────────────────────┐
  │ Review today            │
  │ 15 of 64 due            │
  │ You'll review a small   │
  │ batch now.              │
  │ [ Review now ]          │
  └─────────────────────────┘

Never show the full overdue count as the primary message.
Always show the session-capped count first.

### 9.6 Desktop wireframe

  ┌──────────────┬──────────────────────────────────────┐
  │ Sidebar      │ Today                                │
  │              │                                      │
  │ Today        │ ┌──────────────────────────────────┐ │
  │ Review       │ │ Greetings                        │ │
  │ Library      │ │ Say hello, ask how someone is.   │ │
  │ Progress     │ │ [ Start lesson ]                 │ │
  │ Settings     │ └──────────────────────────────────┘ │
  │              │                                      │
  │              │ ┌────────────┐ ┌────────────┐        │
  │              │ │Review today│ │ Progress   │        │
  │              │ │15 of 64 due│ │24 words    │        │
  │              │ │[Review now]│ │3-day streak│        │
  │              │ └────────────┘ └────────────┘        │
  └──────────────┴──────────────────────────────────────┘

---

## 10. Lesson Page

### 10.1 Lesson intro screen (before first item)

  ┌─────────────────────────┐
  │ < Back                  │
  ├─────────────────────────┤
  │ Greetings               │
  │ Say hello, ask how      │
  │ someone is, and answer  │
  │ simply.                 │
  │                         │
  │ 5 new words             │
  │ ~10 minutes             │
  │                         │
  │ [ Start lesson ]        │
  └─────────────────────────┘

### 10.2 Lesson item screen

Progress shows "Lesson · N of N" only. No pack theme repeated.

  ┌─────────────────────────┐
  │ Lesson · 2 of 5         │
  │ ━━━━━━━──────           │
  ├─────────────────────────┤
  │                         │
  │           好             │
  │          hǎo  [T3]      │
  │          good           │
  │                         │
  ├─────────────────────────┤
  │ Tone                    │
  │ 3rd tone · low dip      │
  │                         │
  │ ▾ Note: Two 3rd tones   │
  │   together? First often │
  │   sounds like 2nd.      │
  ├─────────────────────────┤
  │ Components              │
  │ 女 woman + 子 child     │
  ├─────────────────────────┤
  │ Mnemonic                │
  │ A quick way to          │
  │ remember it:            │
  │ A woman and child make  │
  │ a picture of "good."    │
  ├─────────────────────────┤
  │ Example                 │
  │ 你好。                  │
  │ Nǐ hǎo.                 │
  │ Hello.                  │
  ├─────────────────────────┤
  │ [ Continue ]            │
  └─────────────────────────┘

Tone sandhi note: collapsible (▾), shown only for common sandhi cases.

### 10.3 Desktop wireframe

  ┌──────────────┬──────────────────────────────────────┐
  │ Sidebar      │ Lesson · 2 of 5  ━━━━━━━──────       │
  │              │                                      │
  │              │ ┌──────────────────────────────────┐ │
  │              │ │              好                  │ │
  │              │ │            hǎo [T3]              │ │
  │              │ │             good                 │ │
  │              │ └──────────────────────────────────┘ │
  │              │                                      │
  │              │ ┌─────────────┐ ┌─────────────┐      │
  │              │ │ Tone        │ │ Components  │      │
  │              │ │ 3rd · low   │ │ 女 + 子     │      │
  │              │ └─────────────┘ └─────────────┘      │
  │              │                                      │
  │              │ ┌──────────────────────────────────┐ │
  │              │ │ Mnemonic + Example sentence      │ │
  │              │ └──────────────────────────────────┘ │
  │              │                    [ Continue ]      │
  └──────────────┴──────────────────────────────────────┘

---

## 11. Review Page

### 11.1 Structure

  Progress indicator
  Question prompt
  Main content (hanzi / word / sentence)
  Answer input / options
  Submit / check button
  Report issue link (small, unobtrusive)

### 11.2 Mobile — multiple choice

  ┌─────────────────────────┐
  │ Review        4 of 12   │
  │ ━━━━━───────            │
  ├─────────────────────────┤
  │ What does this mean?    │
  │                         │
  │          回家            │
  │        huí jiā          │
  │                         │
  ├─────────────────────────┤
  │ [ go home             ] │
  │ [ eat rice            ] │
  │ [ drink water         ] │
  │ [ thank you           ] │
  ├─────────────────────────┤
  │ Report issue            │
  └─────────────────────────┘

### 11.3 Mobile — self check

  ┌─────────────────────────┐
  │ Review        4 of 12   │
  ├─────────────────────────┤
  │ Do you remember this?   │
  │                         │
  │           好             │
  │                         │
  │    [ Show answer ]      │
  ├─────────────────────────┤
  │ hǎo [T3] · good         │
  │ 3rd tone · low dip      │
  ├─────────────────────────┤
  │  [ Forgot ]  [ Got it ] │
  └─────────────────────────┘

### 11.4 Item updated notice (major content change)

Shown as inline banner above the question when `needs_relearn = true`
AND `content_version_seen < item.content_version`.

Triggers only on major changes (wrong tone/pinyin/meaning corrected).
Does not trigger for minor fixes (typos, mnemonic rewording).

  ┌─────────────────────────┐
  │ ℹ This item was recently│
  │   updated. Worth a      │
  │   quick recheck.        │
  ├─────────────────────────┤
  │ What does this mean?    │
  │                         │
  │          回家            │
  │        huí jiā          │
  │                         │
  │ [ go home             ] │
  │ [ return home         ] │
  │ [ come home           ] │
  │ [ eat at home         ] │
  └─────────────────────────┘

After the user answers, `content_version_seen` updates to the current version.
If answered correctly, item stays at current SRS stage.
If answered incorrectly, item resets to Learning.

---

## 12. Wrong-Answer Panel

### 12.1 Structure

  Gentle feedback heading
  Correct answer (large, clear)
  Short explanation (tone/meaning/pinyin)
  Mnemonic or example sentence
  Continue button (primary)
  Report issue (small link below)

### 12.2 Mobile wireframe

  ┌─────────────────────────┐
  │ Not quite               │
  ├─────────────────────────┤
  │ Correct answer          │
  │ hǎo [T3] · good         │
  ├─────────────────────────┤
  │ Tone                    │
  │ 好 is 3rd tone. Let     │
  │ your voice dip low.     │
  ├─────────────────────────┤
  │ Example                 │
  │ 你好。= Hello.          │
  ├─────────────────────────┤
  │ [ Continue ]            │
  │ Report issue            │
  └─────────────────────────┘

Rules:
- Show correct answer clearly
- Explain only the missed concept
- Keep it short
- Never punishing language
- No competing actions except Continue and Report

---

## 13. Session Complete Screen

### 13.1 Content

  Items practiced
  New words learned
  Stage-up count (if any items moved up)
  Accuracy if useful
  Next review timing
  Small weak area note
  Primary action: Back to Today

### 13.2 Mobile wireframe

  ┌─────────────────────────┐
  │ Review complete         │
  │ Nice work.              │
  ├─────────────────────────┤
  │ Practiced today         │
  │ 12 items · 8 correct    │
  ├─────────────────────────┤
  │ 3 items moved up        │
  │ a stage.                │  ← shown only if ≥1 item leveled up
  ├─────────────────────────┤
  │ Focus next              │
  │ Tone 2 vs Tone 3        │  ← shown only if weak area exists
  ├─────────────────────────┤
  │ [ Back to Today ]       │
  └─────────────────────────┘

Stage-up feedback rules:
- Show "N items moved up a stage." only when at least 1 item moved up
- If no items moved up, omit this line entirely — no placeholder shown
- Maximum: one line, no animation required in V1
- Indonesian: "N item naik tahap."

Minimum session complete (no stage-ups, no weak areas):
  ┌─────────────────────────┐
  │ Review complete         │
  │ Nice work.              │
  ├─────────────────────────┤
  │ Practiced today         │
  │ 12 items · 8 correct    │
  ├─────────────────────────┤
  │ [ Back to Today ]       │
  └─────────────────────────┘

---

## 14. Library

### 14.1 Mobile wireframe

  ┌─────────────────────────┐
  │ Library                 │
  │ [Search word or pinyin] │
  ├─────────────────────────┤
  │ [All][Words][Hanzi][...] │
  ├─────────────────────────┤
  │ 你好  nǐ hǎo  hello     │
  │ Learning                │
  ├─────────────────────────┤
  │ 回家  huí jiā  go home  │
  │ Familiar                │
  ├─────────────────────────┤
  │ 好  hǎo  good           │
  │ Strong                  │
  └─────────────────────────┘

### 14.2 Desktop wireframe

  ┌──────────────┬──────────────────────────────────────┐
  │ Sidebar      │ Library                              │
  │              │ [ Search word, hanzi, or pinyin ]    │
  │              │ [All][Words][Hanzi][Sentences][...]  │
  │              │                                      │
  │              │ ┌────────────┐ ┌────────────┐        │
  │              │ │ 你好       │ │ 回家       │        │
  │              │ │ nǐ hǎo     │ │ huí jiā    │        │
  │              │ │ hello      │ │ go home    │        │
  │              │ │ Learning   │ │ Familiar   │        │
  │              │ └────────────┘ └────────────┘        │
  └──────────────┴──────────────────────────────────────┘

---

## 15. Item Detail

### 15.1 Mobile wireframe — word

  ┌─────────────────────────┐
  │ < Back          Report  │
  ├─────────────────────────┤
  │          回家            │
  │       huí [T2] jiā [T1] │
  │         go home         │
  ├─────────────────────────┤
  │ Tone pattern: 2-1       │
  ├─────────────────────────┤
  │ Example                 │
  │ 我回家。                │
  │ Wǒ huí jiā.             │
  │ I'm going home.         │
  ├─────────────────────────┤
  │ Mnemonic                │
  │ Return + home =         │
  │ go back home.           │
  ├─────────────────────────┤
  │ SRS: Familiar           │
  │ Next review: tomorrow   │
  └─────────────────────────┘

---

## 16. Progress Page

### 16.1 Mobile wireframe

  ┌─────────────────────────┐
  │ Progress                │
  ├─────────────────────────┤
  │ 24 words learned        │
  │ 86 reviews completed    │
  │ 🔥 3-day streak         │
  ├─────────────────────────┤
  │ SRS stages              │
  │ Learning      8         │
  │ Familiar      10        │
  │ Strong        6         │
  │ Mastered      2         │
  ├─────────────────────────┤
  │ Weak area               │
  │ Tone 2 vs Tone 3        │
  │ [ Practice tones ]      │
  └─────────────────────────┘

Weak areas show actionable button, not raw stats.
"Not enough data yet. Keep reviewing." when fewer than 5 reviews exist per group.

### 16.2 Desktop wireframe

  ┌──────────────┬──────────────────────────────────────┐
  │ Sidebar      │ Progress                             │
  │              │ ┌──────┐ ┌──────┐ ┌──────┐           │
  │              │ │Words │ │Rvws  │ │Streak│           │
  │              │ │  24  │ │  86  │ │3 days│           │
  │              │ └──────┘ └──────┘ └──────┘           │
  │              │ ┌──────────────────────────────────┐ │
  │              │ │ SRS distribution chart/bars      │ │
  │              │ └──────────────────────────────────┘ │
  │              │ ┌──────────────────────────────────┐ │
  │              │ │ Weak area: Tone 2 vs Tone 3      │ │
  │              │ │ [ Practice tones ]               │ │
  │              │ └──────────────────────────────────┘ │
  └──────────────┴──────────────────────────────────────┘

---

## 17. Settings

### 17.1 Mobile wireframe

  ┌─────────────────────────┐
  │ Settings                │
  ├─────────────────────────┤
  │ App language            │
  │ English                 │
  ├─────────────────────────┤
  │ Character style         │
  │ Simplified              │
  ├─────────────────────────┤
  │ Daily study time        │
  │ 10 minutes              │
  ├─────────────────────────┤
  │ Sound       On          │
  ├─────────────────────────┤
  │ Notifications  Off      │
  ├─────────────────────────┤
  │ Offline data   Ready    │
  ├─────────────────────────┤
  │ Sign out                │
  └─────────────────────────┘

### 17.2 Script switch notice

When user changes Character style from Simplified to Traditional (or vice versa),
show a one-time bottom sheet immediately after the setting is changed.

  ┌─────────────────────────┐
  │ Switched to Traditional │
  ├─────────────────────────┤
  │ ℹ Some characters look  │
  │   different in          │
  │   Traditional. Your     │
  │   progress is saved.    │
  │                         │
  │ Characters where        │
  │ simplified ≠ traditional│
  │ may feel less familiar  │
  │ at first.               │
  │              [ Got it ] │
  └─────────────────────────┘

Rules:
- Show only once per script switch — not on every app open
- Bottom sheet preferred on mobile; inline banner acceptable on desktop
- SRS progress is fully preserved — no items reset, no re-seeding
- "Got it" dismisses and saves the dismissed state to user_settings
- V2: offer to re-queue items where simplified ≠ traditional back to Learning

---

## 18. Report Issue Modal

### 18.1 Entry points

Small "Report issue" link appears on:
  Lesson item detail · Review question · Wrong-answer panel
  Library item detail · Sentence detail · Grammar note detail

Must be available but not visually loud. Use small text link, not a prominent button.

### 18.2 Mobile wireframe

  ┌─────────────────────────┐
  │ Report issue        X   │
  ├─────────────────────────┤
  │ What seems wrong?       │
  │                         │
  │ ○ Wrong pinyin          │
  │ ○ Wrong tone            │
  │ ○ Wrong meaning         │
  │ ○ Unnatural sentence    │
  │ ○ Wrong character       │
  │ ○ Audio issue           │
  │ ○ Typo                  │
  │ ○ Other                 │
  ├─────────────────────────┤
  │ Comment (optional)      │
  │ [ Write a short note ]  │
  ├─────────────────────────┤
  │ [ Submit report ]       │
  └─────────────────────────┘

Confirmation (replaces modal content):
  ┌─────────────────────────┐
  │ Thanks. We'll review    │
  │ this item.              │
  │              [ Done ]   │
  └─────────────────────────┘

---

## 19. Empty, Loading, and Error States

### 19.1 Empty state pattern

  Title
  Short explanation
  One action button

Example:
  No reviews right now.
  You're caught up for the moment.
  [ Go to Today ]

### 19.2 Loading state pattern

  Loading...
  Preparing your session...
  Loading reviews...

Use skeleton screens or simple spinners. Avoid fake progress.

### 19.3 Error state pattern

  What happened
  What to do next
  Action button

Example:
  Couldn't save your progress.
  Please try again.
  [ Try again ]

Never show raw technical errors to users.

### 19.4 Offline state

  You're offline.
  You can keep reviewing cached items.
  We'll sync progress when you reconnect.

---

## 20. Component Guidelines

### 20.1 Buttons

Types: Primary · Secondary · Ghost/text · Danger · Icon button
Primary buttons: one per screen, for the main next action only.

### 20.2 Cards

Used for: Today action blocks · Review choices · Lesson explanation blocks
         Library items · Progress metrics · Settings rows

Cards have: clear title, short body, optional action, comfortable padding.

### 20.3 Modals / bottom sheets

Used for: Report issue · Settings selections · Script preference · Daily time selection
Mobile: prefer bottom sheets over centered modals.

### 20.4 Forms

Minimal. V1 forms: login, report issue, settings choices.

### 20.5 Toasts

For small confirmations: Progress saved · Report sent · Settings updated
Do not use toasts for important errors that require action.

---

## 21. Accessibility

Minimum requirements:
- Readable text size (minimum 15px body)
- Sufficient contrast (WCAG AA minimum)
- Keyboard accessible controls
- Visible focus states
- Labels for all icon-only buttons
- Never rely on color alone
- Screen reader labels for audio buttons

Tone color must always be paired with tone marks or numbers:
  Good: hǎo · Tone 3
  Bad:  orange-colored text with no label

---

## 22. Motion and Feedback

Use subtle motion only:
- Card transition · Button press feedback · Answer reveal
- Progress bar fill · Modal open/close

Correct answer: small positive state, short text, move on quickly.
Wrong answer: show correction panel, explain briefly, continue.

Avoid heavy animations. The learning content is the focus, not the UI.

---

## 23. PWA / Native Feel

Native-like behaviors:
- Fast first load
- App shell cached
- Offline fallback
- Bottom nav on mobile
- Large touch targets
- Safe-area padding for iOS
- No horizontal scroll
- Smooth transitions

Sync status: show only when relevant. States: Online · Offline · Saving locally · Synced · Sync failed.
Keep sync indicators subtle — not always visible.

---

## 24. V1 Screen Build Priority

Build in this order (matches core learning loop):

  1.  App shell + navigation
  2.  Onboarding (all 7 steps + placement check)
  3.  Today page (all 8 states)
  4.  Lesson session (intro screen + item screen)
  5.  Review session (multiple choice + self-check)
  6.  Wrong-answer panel
  7.  Session complete (with stage-up feedback)
  8.  Library
  9.  Item detail
  10. Progress
  11. Settings (with script switch notice)
  12. Report issue modal
  13. Empty / loading / error states pass

---

## 25. V1 UX Must-Haves

Before V1 is considered usable:

  Clear Today page with all 8 states
  Start lesson flow (intro + item screens)
  Start review flow (multiple choice + self-check)
  One-question-at-a-time review UI
  Review backlog display ("15 of 64 due")
  Lesson pack intro with theme + learning goal
  Wrong-answer correction panel
  Stage-up feedback in session complete
  Session complete summary
  Progress saving
  Library item browsing
  Settings: language, script, daily time
  Script switch notice
  Item updated notice
  Report issue modal
  Mobile bottom nav
  Desktop sidebar
  Touch-friendly controls (48px minimum)
  Empty / loading / error states
  Tone colors everywhere pinyin appears
  Onboarding with placement check

---

## 26. UX North Star

> The user should always feel:
> "I know what to do next. The lesson is small enough. Mistakes are okay.
>  The app remembers my progress. I can come back tomorrow."
>
> The UI should disappear behind the learning habit.
