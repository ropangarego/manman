# Manman! Ultimate App Guidelines

Last updated: 2026-05-16  
Current app package version: `0.1.0`  
Current product stage: Frontend MVP prototype with local multi-pack content loader, mock/local state, Supabase-ready but not connected

## 1. Purpose

Manman! is a mobile-first PWA for learning practical Mandarin through short daily sessions. It is built for learners who want usable Mandarin quickly, especially Indonesian and English speakers, without feeling buried under grammar theory.

The app should feel calm, focused, useful, and native-app-like. The learner should always know what to do next: start a session, answer a question, browse learned content, review progress, or adjust settings.

## 2. Product Goals

### Primary Goals

- Teach practical Mandarin in short daily sessions.
- Make Mandarin feel approachable for absolute beginners.
- Support bilingual UI and learning support in English and Indonesian.
- Use Hanzi, pinyin, meaning, tone dots, examples, and pronunciation audio together.
- Keep learning flow continuous: intro, learn, quick practice, review, summary, unlocks.
- Support local/mock learning first, then Supabase persistence later.
- Build a production-ready frontend foundation before backend integration.

### Non-Goals For Current Frontend MVP

- No real Supabase connection yet.
- No real authentication yet.
- No real password reset yet.
- No real server SRS yet.
- No paid subscription logic.
- No admin panel in the learner app.
- No complex AI tutor/chat features yet.
- No heavy gamification that distracts from study.

## 3. Product Principles

### Learning Principles

- Practical first: greetings, basic phrases, useful words, simple sentences.
- Small sessions beat long sessions.
- Show enough support, but let learners reduce support over time.
- Tone help should be clear but not visually chaotic.
- Pinyin should be configurable.
- Reviews should be lightweight and frequent.
- Unlocks should make progress feel natural, not gamey.

### UX Principles

- The next action should be obvious.
- Mobile should feel like the primary experience.
- Desktop should be a wider, more comfortable version, not a different product.
- Use bottom nav on mobile, sidebar on tablet/desktop.
- Avoid native dropdowns; use option sheets/modals.
- Avoid long explanatory text inside the app.
- Avoid blank or dead-end states.
- Keep spacing even and touch targets large.

### Technical Principles

- Keep React components small and purposeful.
- Keep durable state in Zustand.
- Persist only durable preferences and progress.
- Do not persist temporary UI state.
- Use CSS variables for theme tokens.
- Use Tailwind where useful, but preserve the V15 visual style.
- Do not use daisyUI.
- Do not connect Supabase until the frontend behavior is stable.

## 4. Current Tech Stack

- React
- Vite
- TypeScript
- Tailwind CSS
- CSS variables
- Zustand
- TanStack Query installed for future API work
- Lucide React icons
- Browser TTS for prototype pronunciation
- LocalStorage persistence
- Mock/local content data

## 5. Current Project Structure

```text
src/
  app/
    App.tsx
  components/
    shell/
      AppShell.tsx
      BottomNav.tsx
      Sidebar.tsx
      PageHeader.tsx
    ui/
      AudioButton.tsx
      Button.tsx
      Card.tsx
      GlobalSheets.tsx
      OptionSheet.tsx
      StatCard.tsx
      Toast.tsx
      Toggle.tsx
    study/
      AnswerGrid.tsx
      ReportIssueSheet.tsx
      StudyItemCard.tsx
      StudyProgress.tsx
      ToneDots.tsx
    library/
      LibraryDetail.tsx
      LibraryFilters.tsx
      LibraryItemCard.tsx
    progress/
      LearningPath.tsx
      WeeklyActivity.tsx
      WordStrength.tsx
    settings/
      SettingRow.tsx
      SettingsGroup.tsx
  data/
    mockContent.ts
    packs/
      index.ts
      pack_000_introduction_to_mandarin.json
      pack_001_i_you_to_be_have.json
      pack_002_daily_actions.json
      ...
      pack_009_basic_opinions.json
      README.md
  hooks/
    useInstallPrompt.ts
  i18n/
    copy.ts
    useTranslation.ts
  screens/
    Auth.tsx
    Home.tsx
    Library.tsx
    Onboarding.tsx
    Progress.tsx
    Settings.tsx
    Study.tsx
  stores/
    appStore.ts
    progressStore.ts
    studyStore.ts
  styles/
    globals.css
    prototype.css
    prototype-react-overrides.css
  utils/
    audio.ts
    srs.ts
supabase/
  schema_v1_mvp.sql
public/
  manifest.webmanifest
```

## 6. Source Of Truth Order

When guidelines conflict, use this order:

1. Current product goal in this document.
2. Mandarin content guidelines in `MANDARIN/`.
3. V15 UI/UX guidelines in `MANDARIN/`.
4. Final V15 prototype visual behavior.
5. Current React implementation details.

The prototype is a visual reference. The markdown guidelines are product/design source of truth. If a prototype detail is clearly a final visual decision, preserve it.

## 7. Current Version Snapshot

### Implemented

- Auth screen with local mock sign in/sign up.
- Forgot password placeholder sheet and toast.
- Learner profile settings:
  - local name/email editing
  - change password placeholder
  - reset learning progress only
- Onboarding flow:
  - Welcome
  - Script preference
  - Familiarity
  - Session size
  - Placement check for "I know some basics", shown one question at a time
  - Recommended start
- Home screen with:
  - Greeting
  - Today's Session driven by current pack/session
  - Quick stats
  - Current focus
- Study flow:
  - Intro
  - Learn
  - Quick practice
  - Review
  - Summary
  - Unlocks
  - "Study another session" advances through registered packs
- Local content pack loader:
  - `src/data/packs/index.ts` registers packs 000-009
  - `src/data/mockContent.ts` normalizes packs into UI content
  - study sessions progress from Pack 001 onward
  - nullable optional pack fields are handled safely
  - `audio_url` is carried as `audioUrl`
- Library:
  - Search
  - Type tabs
  - Stage filter sheet
  - Load more
  - Mobile detail view
  - Desktop split view
  - Browses registered local pack content
- Progress:
  - Summary stats
  - Word strength
  - Learning path based on registered packs/current study position
  - Weekly activity
  - Weak areas hidden until enough review data
- Settings:
  - Grouped cards
  - Option sheets
  - Toggles
  - Reset app state
  - Logout confirmation
  - Add app shortcut placeholder/installer support
- Dark mode:
  - Global CSS-variable theme
  - LocalStorage persistence
- Toast system:
  - Settings confirmations
  - Auth placeholder actions
  - Report issue confirmation
- Pronunciation:
  - Reusable `AudioButton`
  - Browser TTS prototype
  - Uses pack `audio_url` when provided
  - Falls back to browser TTS when audio is missing/null
  - Speech speed setting
  - Speed preview sample: `你好吗`
- Local persistence:
  - Auth mock signed-in state
  - Onboarding completed
  - Script
  - Session size
  - Pinyin display
  - Review style
  - Speech speed
  - Tone colors
  - Sound
  - Tutorial hints
  - Language
  - Dark mode
  - Offline mode
  - Local progress/SRS state
  - Current study pack/session position

### Known Limitations

- Auth is mock/local only.
- Password reset is placeholder only.
- Supabase schema exists but frontend is not connected.
- Pack loader is static/local; new pack files must be registered in `src/data/packs/index.ts`.
- Pack 000 intro cards are registered but do not yet have a dedicated intro-card study screen.
- Real offline support/service worker is not complete.
- Browser TTS quality varies by device/browser.
- No generated or native audio assets yet.
- Typed review is marked coming later.
- Report issue is not persisted to backend yet.
- Admin panel is not implemented in this repo.

## 8. App Blueprint

### Top-Level App Routing

The app currently uses local state instead of a router.

```text
App
  if signedIn is false:
    AuthScreen
  else if onboarded is false:
    OnboardingScreen
  else:
    AppShell
```

### Main Shell

```text
AppShell
  Sidebar on tablet/desktop
  Screen container
    active screen
  BottomNav on mobile
```

Main screens:

```text
Home | Study | Library | Progress | Settings
```

Nav order must stay:

```text
Home | Study | Library | Progress | Settings
```

### State Stores

#### `appStore`

Owns durable app/UI preferences and current navigation:

- signed in mock state
- onboarding state
- current screen
- script choice
- session size
- settings
- active option sheet
- toast
- library filters
- selected library item

Persisted with key:

```text
mandarin-app-preferences
```

#### `studyStore`

Owns study-session flow and the durable current pack/session position:

- current step
- session index
- learn index
- review index
- selected practice answer
- selected review answer
- current feedback
- session attempts/correct

Only `sessionIndex` is persisted long-term so "Study another session" can continue across packs after refresh. Current step, selected answers, feedback, learn index, and review index remain transient.

Persisted with key:

```text
mandarin-study-position
```

#### `progressStore`

Owns local SRS/progress:

- item progress
- daily activity
- sessions completed
- total correct/attempts

Persisted with key:

```text
mandarin-learning-progress
```

## 9. Design System

### Visual Identity

- Brand: Manman!
- Personality: calm, practical, warm, focused.
- Primary identity: ink/charcoal.
- Accent: Mandarin orange.
- Background: white/off-white.
- Cards: clean, low shadow, small/medium radius.
- Tone colors: only as learning signals.

### Core Colors

Light mode:

```css
--bg: off-white;
--surface: white;
--surface-soft: very light warm gray;
--text-main: ink/charcoal;
--text-muted: soft gray;
--border: light gray;
--accent: Mandarin orange;
--accent-soft: soft orange;
```

Dark mode:

```css
--bg: #0F1115;
--surface: #171A21;
--surface-soft: #20242D;
--text-main: #F8FAFC;
--text-muted: #A1A1AA;
--border: #2A2F3A;
--accent: #F97316;
--accent-soft: rgba(249, 115, 22, 0.16);
--success-soft: rgba(16, 185, 129, 0.14);
--danger-soft: rgba(239, 68, 68, 0.14);
```

### Tone Dot Colors

Tone dots are the preferred tone display. Do not rainbow-color full pinyin sentences.

```text
Tone 1: red
Tone 2: orange
Tone 3: green
Tone 4: blue
Neutral: gray
```

Tone dots appear in:

- Study lesson cards
- Study review/practice prompts
- Library detail

Tone dots do not appear in:

- Library preview cards
- Overly compact list rows

### Typography

- Use clear sans-serif for UI.
- Use Chinese serif/display style for large Hanzi where current design does.
- Page titles and important section titles should be bold.
- Avoid giant marketing hero typography inside app screens.
- Avoid negative letter spacing for compact controls.

### Components

Use these component patterns:

- `Button`: primary, secondary, danger.
- `Card`: repeated blocks and focused surfaces.
- `OptionSheet`: all non-toggle choices.
- `Toggle`: binary settings.
- `Toast`: non-blocking confirmations.
- `AudioButton`: pronunciation only.
- `ToneDots`: tone hints only.
- `SettingRow`: settings rows.

Do not use native `<select>` dropdowns.

### Audio Button Placement

Single Hanzi and short words:

```text
好
hǎo
good

[audio]
```

Rules:

- Do not place audio beside a large single Hanzi.
- Keep Mandarin text visually centered.
- Put audio below the Hanzi/pinyin/meaning block.
- Button must remain 40px minimum touch target.
- Use `aria-label`.

Long sentences:

- Mobile: prefer centered below.
- Desktop: inline is allowed only if it does not make the layout feel lopsided.

Do not place audio near:

- English/Indonesian meaning outside the main pronunciation block
- mnemonic
- grammar notes
- bottom action buttons
- answer choices

### Responsive Layout

Mobile:

- Single column.
- Sticky bottom nav.
- Large tap targets.
- Safe area padding.
- Library item opens detail view.
- Study remains focused.

Tablet/desktop:

- Sidebar navigation.
- Wider content.
- Library split view.
- Progress columns.
- Study max width stays focused.

## 10. Core User Flows

### Auth Flow

Current:

```text
Sign in / Sign up
  uses local mock form
  no backend call
  stores signedIn locally after submit
```

Forgot password current:

```text
Tap Forgot password?
  opens Reset password sheet
Tap Send reset link
  closes sheet
  shows placeholder toast
```

Future:

```text
Supabase Auth
  signUp
  signInWithPassword
  resetPasswordForEmail
  signOut
```

### Onboarding Flow

```text
Welcome
  -> Script preference
  -> Mandarin familiarity
  -> Session size
  -> Placement check if familiarity = some
  -> Recommended start
  -> Home
```

Script:

- Simplified
- Traditional
- Not sure defaults to Simplified

Familiarity:

- Absolute beginner
- I know some basics

Session size:

- Light: about 5 min, 3 new words, fewer reviews
- Standard: about 10 min, 5 new words, balanced reviews
- Intense: about 15 min, 8 new words, more reviews

Placement:

- Must be more than one question.
- Must show one question at a time so the learner can focus.
- Show progress like `Question 1 of 5`.
- Next is disabled until the current question is answered.
- Back returns to the previous placement question before leaving placement.
- Should test basics across meanings, pinyin, tones, and short sentences.
- Current placement is mock/local.

### Home Flow

Purpose: daily launch page.

Home shows:

- Greeting
- Today's Session card
- Start Study button
- Quick stats
- Current focus

Home should not become a dashboard-heavy screen.

### Study Flow

Continuous session:

```text
Intro
  -> Learn
  -> Quick Practice
  -> Learn next item
  -> Quick Practice next item
  -> Review due items
  -> Summary
  -> Unlocks
```

Study progress top area:

```text
x / total completed
progress bar
current mode label
```

Learning screen includes:

- item type pill
- Hanzi/word/sentence
- pinyin if enabled
- tone dots if pinyin/tone help enabled
- meaning
- audio button
- components
- mnemonic/context
- example
- report issue menu

Quick practice:

- Multiple choice.
- If wrong, allow try again.
- Show feedback.
- Next appears only after correct answer.

Review:

- One attempt only.
- After answer, show feedback and Next.
- Do not show "Forgot/Got it" after multiple choice.

Summary:

- Shows studied count.
- Accuracy.
- Unlock count.
- New count.

Unlocks:

- Shows newly available content.
- Allows "Study another session".

### Library Flow

Library is for browsing learned/available content.

Features:

- Search.
- Content tabs.
- Stage filter option sheet.
- Load more.
- Detail view.
- Report issue.

Mobile:

- List opens detail as detail view.
- After selecting an item from a scrolled list, scroll container to top.

Desktop:

- List on left.
- Detail panel on right.
- Selecting item should not scroll the whole page unexpectedly.

Preview cards should include:

- title
- pinyin if enabled
- meaning
- item type pill

Preview cards should not include:

- tone dots
- audio button
- long explanations

Detail should include:

- Hanzi/word/sentence/pattern
- pinyin
- tone dots
- meaning
- audio button
- type/stage/accuracy
- components/breakdown
- mnemonic
- related
- example
- next review
- report issue

### Progress Flow

Progress should show useful learning state, not analytics overload.

Include:

- Summary stats
- Word strength
- Learning path
- Weekly activity
- Weak areas only when enough review data exists

Do not include:

- Pie chart
- Overly complex graphs
- Unexplained score systems

Word strength counts words only.

Word strength color scale:

```text
Learning: visible light gray
Familiar: warm beige
Strong: Mandarin orange
Mastered: dark warm brown
Long-term: ink/black or high-contrast value in dark mode
```

### Settings Flow

Settings uses grouped cards:

1. Profile
2. Learning
3. Study
4. Display
5. Offline
6. Development/account actions

Profile includes:

- Name and email
- Change password placeholder
- Reset learning progress
- Logout

Use option sheets for:

- Session size
- Script
- Pinyin display
- Review style
- Speech speed
- Language
- Stage filter
- Report issue
- Logout confirmation
- Reset app state confirmation
- Reset learning progress confirmation
- Edit profile
- Change password placeholder
- Forgot password placeholder

Use toggles for:

- Tone colors
- Sound
- Tutorial hints
- Dark mode
- Offline mode

## 11. Persistence Rules

Persist durable preferences:

- signed in mock state
- auth display name/email
- onboarding completed
- script preference
- session size
- pinyin display
- review style
- speech speed
- tone colors
- sound
- tutorial hints
- language
- dark mode
- offline mode

Persist progress:

- item SRS state
- daily activity
- sessions completed
- total attempts/correct

Do not persist temporary UI:

- open sheet
- toast
- current report issue form
- selected answer
- feedback message
- current study step
- current selected Library detail long-term, unless product later asks for it

Logout/reset app state should clear local app preferences and progress.

Reset learning progress should clear only progress/SRS/activity data and keep:

- profile name/email
- auth state
- onboarding state
- settings/preferences

## 12. SRS Model

Current frontend uses simple Leitner-style fixed intervals per stage.

Stages:

```text
Learning -> Familiar -> Strong -> Mastered -> Long-term
```

Current fixed intervals:

```text
Learning: 0 days
Familiar: 1 day
Strong: 3 days
Mastered: 7 days
Long-term: 21 days
```

Correct answer:

- move up one stage
- set next due date by new stage interval

Incorrect answer:

- move down one stage
- reset correct streak
- set next due date by new stage interval

Future improvements:

- item difficulty modifiers
- lapse count
- ease factor
- separate new/learning/review queues
- daily review cap
- timezone-safe due dates
- Supabase-backed progress
- offline sync conflict resolution

## 13. Content Pack JSON Format

Content packs live in:

```text
src/data/packs/
```

Current registered local packs:

```text
src/data/packs/pack_000_introduction_to_mandarin.json
src/data/packs/pack_001_i_you_to_be_have.json
src/data/packs/pack_002_daily_actions.json
src/data/packs/pack_003_question_building.json
src/data/packs/pack_004_time_routine.json
src/data/packs/pack_005_location_movement.json
src/data/packs/pack_006_eating_buying.json
src/data/packs/pack_007_people_family.json
src/data/packs/pack_008_describing_things.json
src/data/packs/pack_009_basic_opinions.json
```

For now, add new pack JSON files there and register them through:

```text
src/data/packs/index.ts
```

The local pack adapter lives in:

```text
src/data/mockContent.ts
```

Current behavior:

- Pack files are statically registered in `src/data/packs/index.ts`.
- `mockContent.ts` sorts by `pack.order_index`.
- Pack 000 is intro-only and is registered for onboarding/future intro-card UX.
- Standard SRS packs begin at Pack 001.
- Study sessions advance through standard packs using `studyStore.sessionIndex`.
- Library and Progress use the normalized registered pack content.
- Nullable optional fields are allowed and normalized safely.
- `audio_url` is optional; if missing/null, pronunciation falls back to browser TTS.

### File Naming

Use:

```text
pack_000_introduction_to_mandarin.json
pack_001_i_you_to_be_have.json
pack_002_daily_actions.json
```

Rules:

- Lowercase.
- Snake case.
- Prefix with pack number.
- Stable filename once used.
- Store as UTF-8.

### Top-Level Pack Shape

```json
{
  "pack": {},
  "tone_system": {},
  "components": [],
  "hanzi": [],
  "words": [],
  "sentences": [],
  "patterns": [],
  "item_prerequisites": [],
  "unlock_rules": [],
  "review_blueprint": {},
  "study_flow": {},
  "intro_cards": []
}
```

### `pack`

Required fields:

```json
{
  "id": "pack_001_i_you_to_be_have",
  "title": "I / You / To Be / Have",
  "title_id": "Aku / Kamu / Adalah / Punya",
  "subtitle": "Say who you are and talk about having something.",
  "subtitle_id": "Mengatakan siapa kamu dan bicara tentang punya sesuatu.",
  "level": 1,
  "phase": "prototype",
  "theme": "identity",
  "script_priority": "simplified",
  "estimated_days": 2,
  "estimated_minutes_per_day": 5,
  "order_index": 1,
  "pack_type": "standard",
  "is_srs_enabled": true,
  "learning_goal": "Say who you are and talk about having something.",
  "learning_goal_id": "Mengatakan siapa kamu dan bicara tentang punya sesuatu.",
  "content_summary": {
    "components": 4,
    "hanzi": 6,
    "words": 7,
    "sentences": 2,
    "patterns": 1
  }
}
```

Rules:

- `id` must be unique and stable.
- `title` and `title_id` are required.
- `level` should increase gradually.
- `phase` can be `prototype`, `mvp`, `beta`, or `production`.
- `script_priority` should be `simplified`, `traditional`, or `both`.
- `content_summary` counts must match arrays.

### `tone_system`

Example:

```json
{
  "0": {
    "name_id": "nada ringan",
    "shape": ".",
    "description_id": "ringan/netral"
  },
  "1": {
    "name_id": "nada datar",
    "shape": "-",
    "description_id": "flat tinggi"
  }
}
```

Rules:

- Include tones `0`, `1`, `2`, `3`, `4`.
- This is educational metadata, not the UI color source.
- UI tone colors remain controlled by app design tokens.

### `components`

Use for radicals/components/building blocks.

```json
{
  "id": "component_person_side",
  "type": "component",
  "simplified": "亻",
  "traditional": "亻",
  "name": "person component",
  "meaning": "person",
  "meaning_id": "orang",
  "mnemonic_id": "亻 looks like a person standing from the side...",
  "examples": ["你"],
  "order_index": 1
}
```

Required:

- `id`
- `type`
- `simplified`
- `traditional`
- `name`
- `meaning`
- `meaning_id`
- `order_index`

Recommended:

- `mnemonic_id`
- `examples`

Rules:

- Component IDs start with `component_`.
- Components should be reusable across Hanzi.
- Mnemonics should be memorable but respectful.

### `hanzi`

Use for individual characters.

```json
{
  "id": "hanzi_hao",
  "type": "hanzi",
  "simplified": "好",
  "traditional": "好",
  "meaning": "good / okay",
  "meaning_id": "baik / oke",
  "pinyin": "hǎo",
  "pinyin_syllables": [
    {
      "text": "hǎo",
      "tone": 3
    }
  ],
  "tone_number": 3,
  "components": ["component_woman", "component_child"],
  "mnemonic_id": "女 plus 子 helps remember 好 as good...",
  "examples": ["你好", "很好"],
  "order_index": 1,
  "tags": ["greeting", "basic"]
}
```

Required:

- `id`
- `type`
- `simplified`
- `traditional`
- `meaning`
- `meaning_id`
- `pinyin`
- `pinyin_syllables`
- `tone_number`
- `order_index`

Recommended:

- `components`
- `mnemonic_id`
- `examples`
- `tags`

Rules:

- Hanzi IDs start with `hanzi_`.
- `pinyin_syllables` must align with displayed pinyin.
- `tone_number` must be 0-4.
- For single Hanzi, audio button displays below main block.

### `words`

Use for vocabulary items.

```json
{
  "id": "word_nihao",
  "type": "word",
  "simplified": "你好",
  "traditional": "你好",
  "meaning": "hello",
  "meaning_id": "halo",
  "pinyin": "nǐ hǎo",
  "pinyin_syllables": [
    {
      "text": "nǐ",
      "tone": 3
    },
    {
      "text": "hǎo",
      "tone": 3
    }
  ],
  "mnemonic_id": "你 plus 好 creates a friendly greeting.",
  "examples": ["你好。", "你好，王明。"],
  "order_index": 1,
  "tags": ["greeting"]
}
```

Required:

- `id`
- `type`
- `simplified`
- `traditional`
- `meaning`
- `meaning_id`
- `pinyin`
- `pinyin_syllables`
- `order_index`

Rules:

- Word IDs start with `word_`.
- Short words should use centered-below audio layout.
- Words should include example sentences whenever possible.

### `sentences`

Use for complete practical sentences.

```json
{
  "id": "sentence_nihao_ma",
  "type": "sentence",
  "simplified": "你好吗？",
  "traditional": "你好嗎？",
  "meaning": "How are you?",
  "meaning_id": "Apa kabar?",
  "pinyin": "nǐ hǎo ma?",
  "pinyin_syllables": [
    {
      "text": "nǐ",
      "tone": 3
    },
    {
      "text": "hǎo",
      "tone": 3
    },
    {
      "text": "ma",
      "tone": 0
    }
  ],
  "notes_id": "吗 turns a statement into a yes/no question.",
  "order_index": 1
}
```

Required:

- `id`
- `type`
- `simplified`
- `traditional`
- `meaning`
- `meaning_id`
- `pinyin`
- `pinyin_syllables`
- `order_index`

Recommended:

- `notes_id`
- tags when useful

Rules:

- Sentence IDs start with `sentence_`.
- Use punctuation consistently.
- Keep sentences short in early packs.
- Mobile audio should usually be centered below.

### `patterns`

Use for grammar/phrase structures.

```json
{
  "id": "pattern_yes_no_ma",
  "type": "pattern",
  "title": "A + 吗?",
  "title_id": "A + 吗?",
  "meaning": "yes/no question pattern",
  "meaning_id": "pola pertanyaan ya/tidak",
  "structure": "Statement + 吗?",
  "explanation": "Add 吗 to make a yes/no question.",
  "explanation_id": "Tambahkan 吗 untuk membuat pertanyaan ya/tidak.",
  "examples": [
    {
      "simplified": "你好吗？",
      "pinyin": "nǐ hǎo ma?",
      "meaning": "How are you?"
    }
  ],
  "order_index": 1
}
```

Required:

- `id`
- `type`
- `title`
- `title_id`
- `meaning`
- `meaning_id`
- `structure`
- `explanation`
- `explanation_id`
- `examples`
- `order_index`

Rules:

- Pattern IDs start with `pattern_`.
- Pattern mobile preview title should remain compact, around 16px.
- Patterns unlock later than core words/hanzi.

### `item_prerequisites`

Use to define dependency graph.

```json
{
  "item_id": "word_nihao",
  "item_type": "word",
  "prerequisite_item_id": "hanzi_ni",
  "prerequisite_item_type": "hanzi"
}
```

Rules:

- Prerequisite IDs must exist in the same pack or earlier packs.
- Avoid circular dependencies.
- Use prerequisites for unlocks and learning path.

### `unlock_rules`

Example:

```json
{
  "rule": "unlock_sentences_after_words_familiar",
  "description": "Unlock related sentences when required words reach Familiar.",
  "description_id": "Buka kalimat terkait saat kata wajib mencapai Familiar."
}
```

Rules:

- Keep rules human-readable.
- Actual runtime logic may initially be simpler than full rule metadata.

### `review_blueprint`

Example:

```json
{
  "question_types": [
    "meaning_choice",
    "pinyin_choice",
    "tone_choice",
    "sentence_meaning"
  ],
  "examples": [
    {
      "question_type": "meaning_choice",
      "prompt": "What does this mean?",
      "item_id": "word_nihao",
      "correct_answer": "hello"
    }
  ]
}
```

Rules:

- Use as content authoring guidance.
- Runtime can choose subset based on review style.
- Keep distractors plausible but not unfair.

### `study_flow`

Example:

```json
{
  "day_1": {
    "new_items": ["word_nihao", "word_xiexie"],
    "review_items": [],
    "unlock_items": ["sentence_nihao"]
  }
}
```

Rules:

- Use as a suggested flow, not an absolute runtime lock.
- Runtime session size can slice the flow.
- Keep new items and reviews balanced.

### Content Quality Checklist

Every pack should pass:

- IDs are unique.
- Counts match `content_summary`.
- English and Indonesian fields are present.
- Simplified/traditional fields are present.
- Pinyin is tone-marked.
- `pinyin_syllables` tones are correct.
- Examples use known or teachable vocabulary.
- Dependencies point to existing items.
- No mojibake or broken UTF-8.
- No overly long mobile preview titles.
- Meanings are practical, not dictionary-overloaded.
- Mnemonics help memory without being confusing.

## 14. Supabase Blueprint

Current schema file:

```text
supabase/schema_v1_mvp.sql
```

Current schema includes:

- profiles
- user placement answers
- content packs
- components
- hanzi
- words
- sentences
- patterns
- pack items
- prerequisites
- unlocked items
- user item progress
- study sessions
- study session items
- review attempts
- daily activity
- content issue reports
- audio assets
- RLS policies
- indexes

Important next schema update:

- Add `speech_speed` to `profiles`.

Recommended enum:

```sql
create type speech_speed as enum ('slow', 'normal', 'fast');
```

Recommended profile column:

```sql
speech_speed speech_speed not null default 'normal'
```

Frontend setting mapping:

```text
Slow -> slow
Normal -> normal
Fast -> fast
```

### Backend Integration Order

1. Create Supabase project.
2. Run `supabase/schema_v1_mvp.sql`.
3. Add missing `speech_speed`.
4. Seed registered local packs 000-009.
5. Add Supabase client.
6. Replace mock auth with Supabase Auth.
7. Load profile into Zustand.
8. Sync settings to profile.
9. Load content from Supabase or bundled seed fallback.
10. Sync progress/reviews.
11. Persist report issue.
12. Add offline queue for writes.

## 15. Audio Strategy

### Current

- Browser `speechSynthesis`.
- Language: `zh-CN`.
- Speed:
  - Slow: 0.72
  - Normal: 0.9
  - Fast: 1.08
- Preview sample: `你好吗`
- Audio source preference:
  - use item `audio_url` when present
  - otherwise fall back to browser TTS

### Production Direction

Preferred V1:

- Continue browser TTS as fallback.
- Add generated TTS audio assets for core pack content.
- Store audio metadata in Supabase `audio_assets`.
- Cache audio for offline.

Best future:

- Native speaker recordings for high-frequency content.
- Generated TTS for long-tail items.
- Browser TTS fallback if asset missing.

Rules:

- Audio belongs to Mandarin pronunciation only.
- Do not play audio from meaning/grammar/mnemonic sections.
- Prevent rapid click stacking.
- Handle audio errors gracefully.

## 16. Bilingual Copy Guidelines

Supported UI languages:

- English
- Indonesian

Rules:

- Keep English concise.
- Keep Indonesian natural, not overly formal.
- Avoid long in-app explanations.
- Avoid mixing Indonesian and English unless the product intentionally uses learner-friendly terms like "pack" or "review".
- Put translatable UI strings in `src/i18n/copy.ts`.
- Content pack fields should include English and Indonesian where relevant.

Tone:

- Warm.
- Practical.
- Not childish.
- Not academic-heavy.
- Encouraging but not exaggerated.

## 17. Accessibility Guidelines

Required:

- Buttons must be real `<button>` elements.
- Icon buttons need `aria-label`.
- Modal/sheet should use dialog semantics.
- Close/cancel/outside click should work.
- Focus states must remain visible.
- Color cannot be the only learning signal.
- Text must not overlap at mobile widths.
- Touch targets should be about 40px minimum.

Audio:

- `AudioButton` must have a useful label.
- Do not auto-play audio.

Study:

- Do not move focus unexpectedly after answer selection.
- Feedback should be visible as text, not only color.

## 18. QA Checklist

Before shipping any frontend update:

```bash
npm run build
```

Manual QA:

- Auth sign in works.
- Auth sign up works.
- Forgot password placeholder opens/closes.
- Onboarding completes.
- Refresh after onboarding opens Home.
- Home Start Study works.
- Study intro to learn works.
- Quick practice wrong answer allows retry.
- Quick practice correct answer shows Next.
- Review allows one attempt only.
- Summary and unlocks work.
- Study another session works.
- Library search works.
- Library tabs work.
- Stage filter sheet works.
- Library load more works.
- Mobile Library item opens detail and scrolls top.
- Desktop Library stays split view.
- Progress renders with no blank states.
- Weak areas hidden if not enough data.
- Settings option sheets work.
- Settings toggles show toast.
- Dark mode persists.
- Reset app state clears local state.
- Logout clears local state.
- Report issue sheet opens and shows success toast.
- Audio button plays or fails gracefully.
- Speech speed preview works.
- No native select dropdowns.
- No daisyUI.
- No console errors.

Responsive QA:

- Mobile narrow.
- Tablet.
- Desktop.
- Dark mode.
- Long text / Indonesian language.

## 19. Current Improvement Backlog

### Highest Priority

1. Connect Supabase Auth:
   - sign up
   - sign in
   - logout
   - password reset
   - profile creation

2. Add `speech_speed` to Supabase profile schema.

3. Harden content pack loader:
   - add runtime validation for registered JSON packs
   - report missing IDs/prerequisites clearly during development
   - support pack 000 intro cards in the learner flow
   - reduce manual registry friction when adding future packs

4. Seed Supabase from JSON packs:
   - convert pack JSON to SQL/insert script
   - preserve external IDs
   - validate prerequisites

5. Real report issue persistence:
   - write to `content_issue_reports`
   - attach item type/id
   - attach user id

6. Offline foundation:
   - service worker
   - app shell cache
   - content cache
   - audio cache later

### Near-Term UX Improvements

- Add "resume session" if the user leaves mid-session.
- Add session empty state when no reviews due.
- Add "practice again" from summary.
- Improve placement scoring and recommendation.
- Add better typed-review disabled/coming-later behavior.
- Add language-specific date labels in SRS due text.
- Add keyboard shortcuts only if they stay invisible and unobtrusive.
- Add better loading/skeleton states before Supabase data.

### Content Improvements

- Expand beyond packs 000-009 once current starter path is QA-stable.
- Add pack-level review blueprint usage in runtime session generation.
- Add more placement questions.
- Add item difficulty.
- Add item frequency/usefulness score.

### Audio Improvements

- Add generated TTS assets.
- Add native speaker assets for starter packs.
- Store audio URL per item.
- Add audio cache.
- Add fallback chain:
  - native recording
  - generated TTS
  - browser TTS

### Progress Improvements

- Add due review queue count by type.
- Add weak areas based on actual wrong-answer categories.
- Add streak freeze only if product asks for it later.
- Add calendar activity if it stays simple.
- Add sync conflict handling after backend.

### Admin Future

- Content pack import.
- Content validation.
- Issue report review.
- Audio asset management.
- Pack publishing workflow.
- User progress support tools.

## 20. Version Plan

### v0.1.0 - Frontend MVP Foundation

Status: completed/current base.

Includes:

- React/Vite/TypeScript frontend.
- V15-inspired UI.
- Mock auth.
- Onboarding.
- Home.
- Study flow.
- Library.
- Progress.
- Settings.
- Dark mode.
- Local persistence.
- Simple SRS.
- Initial single-pack local content.
- Browser TTS.
- Forgot password placeholder.

### v0.2.0 - Local Multi-Pack Loader

Status: current implementation milestone.

Includes:

- Static local pack registry in `src/data/packs/index.ts`.
- Registered packs 000-009.
- Normalized multi-pack content adapter in `src/data/mockContent.ts`.
- Study sessions progress across registered standard packs.
- Home session preview uses current pack/session data.
- Library browses registered local pack content.
- Progress learning path reflects registered packs/current study position.
- Study position persists with `mandarin-study-position`.
- Nullable optional pack fields are handled safely.
- `audio_url` is supported when present, with browser TTS fallback.

Known gaps:

- Pack 000 intro cards are not rendered as a dedicated intro-card study flow yet.
- Pack validation is not a full runtime schema validator yet.
- Adding a pack still requires registering it in `src/data/packs/index.ts`.

### v0.3.0 - Content Loader Hardening And Intro Pack UX

Goals:

- Runtime pack validation.
- Dedicated Pack 000 intro-card flow.
- Better use of `study_flow.quick_practice` and `review_blueprint`.
- Better unlock logic based on prerequisites.
- Cleaner developer workflow for adding packs.

Acceptance:

- New pack JSON can be dropped into `src/data/packs/`.
- App can show content from multiple packs.
- Study sessions progress beyond pack 001.
- Pack 000 intro cards can be completed without fake SRS content.

### v0.4.0 - Supabase Auth And Profiles

Goals:

- Real sign up/sign in/logout.
- Real password reset.
- Profile persistence.
- Settings sync.

Acceptance:

- Refresh and another browser session can restore profile.
- Logout uses Supabase signOut.
- Password reset sends email through Supabase.

### v0.5.0 - Supabase Content And Progress

Goals:

- Load content from Supabase.
- Seed pack 001+.
- Persist item progress.
- Persist study attempts.
- Persist daily activity.
- Persist reports.

Acceptance:

- User progress survives across devices.
- Library and Study use Supabase content.
- Local mock fallback still works in development if configured.

### v0.6.0 - Offline MVP

Goals:

- Service worker.
- App shell cache.
- Starter pack cache.
- Offline read access.
- Queue progress writes while offline.

Acceptance:

- Installed PWA opens offline.
- Starter content is browsable offline.
- Completed local reviews sync when online.

### v0.7.0 - Audio V1

Goals:

- Add audio assets.
- Store audio metadata in Supabase.
- Use browser TTS fallback.
- Add audio cache for offline.

Acceptance:

- Starter pack has reliable pronunciation audio.
- Missing audio does not break UI.

### v0.8.0 - Review Expansion

Goals:

- Mixed review mode.
- Typed review mode.
- Tone recognition questions.
- Sentence meaning questions.

Acceptance:

- Review style setting changes actual question types.
- Typed review has mobile-friendly input and feedback.

### v1.0.0 - Public MVP

Goals:

- Production auth.
- Production content.
- Stable progress sync.
- Offline starter experience.
- Audio for starter packs.
- Admin-ready content workflow.
- Polished QA across mobile/desktop.

Acceptance:

- Learner can sign up, onboard, study, review, browse, track progress, and return tomorrow with reliable saved state.

## 21. Implementation Rules For Future Codex Work

Before changing code:

- Inspect current files first.
- Keep edits scoped.
- Preserve V15 style.
- Do not redesign unless asked.
- Do not add backend connections unless the task is explicitly backend/Supabase.
- Use existing stores/components before creating new abstractions.

When adding UI:

- Make it mobile-first.
- Add dark-mode coverage.
- Add bilingual copy.
- Avoid native dropdowns.
- Use option sheets for choices.
- Add toast only for actual state changes.

When adding content:

- Put pack JSON in `src/data/packs/`.
- Validate IDs and prerequisites.
- Add English and Indonesian fields.
- Keep examples practical.

When adding persistence:

- Persist durable state only.
- Do not persist open modals/sheets/toasts.
- Handle malformed localStorage gracefully.

When adding Supabase:

- Keep schema changes explicit.
- Keep RLS policies strict.
- Use external IDs to map content.
- Avoid losing local development fallback too early.

## 22. Definition Of Done

A feature is done when:

- It works on mobile and desktop.
- It supports dark mode.
- It supports English and Indonesian if text is visible.
- It has no TypeScript errors.
- `npm run build` passes.
- It has no console errors in browser QA.
- It follows V15 visual style.
- It avoids backend calls unless explicitly part of the task.
- It does not break local persistence/reset/logout.
- It is documented if it affects content, schema, or product behavior.
