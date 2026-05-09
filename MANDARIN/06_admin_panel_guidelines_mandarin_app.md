# 06 — Admin Panel Guidelines

## Mandarin Learning App — Admin Panel Guidelines

**Purpose:** define the internal admin panel used to manage Mandarin content, QA, imports, reports, and content updates.

This admin panel is not part of the learner experience. It is an internal tool for the developer/content manager.

---

# 1. Admin Panel Goal

The learner app helps users study Mandarin.

The admin panel helps you safely manage the content that powers the learner app.

Core admin goal:

```text
Create, validate, review, fix, import, and publish Mandarin learning content without breaking the app.
```

The admin panel should support:

```text
content creation
content editing
content QA
lesson pack management
content import/export
issue report review
content versioning
unlock/prerequisite management
seed data management
basic analytics for content quality
```

---

# 2. Build Timing

Do not build the admin panel before the prototype learning loop works.

Recommended order:

```text
1. Build learner app prototype
2. Build JSON/YAML content import workflow
3. Test lesson → review → SRS → unlock → report issue
4. Add minimal admin panel
5. Expand admin panel before scaling content heavily
```

## 2.1 Prototype Phase

Use:

```text
content files
validation script
seed/import script
Supabase SQL editor only when necessary
```

Do not spend too much time building admin UI before validating the learning system.

## 2.2 Post-Prototype Phase

Build admin panel when:

```text
lesson flow works
review flow works
SRS updates correctly
unlock system works
content issue reports can be submitted
content starts growing beyond manual file editing
```

---

# 3. App Architecture

## 3.1 Same Codebase, Separate Admin Section

Recommended structure:

```text
One codebase
One Supabase project
One auth system
Separate routes
Separate layout
Separate permissions
```

Routes:

```text
/                      learner app
/today                 learner app
/review                learner app
/library               learner app
/progress              learner app
/settings              learner app

/admin                 admin dashboard
/admin/content         content management
/admin/content/hanzi   hanzi management
/admin/content/words   word management
/admin/content/sentences
/admin/lesson-packs
/admin/prerequisites
/admin/reports
/admin/import
/admin/qa
/admin/versioning
/admin/settings
```

## 3.2 Do Not Mix Learner and Admin UI

Do not put admin controls into learner screens.

Bad:

```text
Learner item detail has Edit Content button for admin users.
```

Better:

```text
Learner app stays clean.
Admin users manage content inside /admin.
```

## 3.3 Layout Difference

Learner app:

```text
mobile-first
simple
focused
fast
minimal
```

Admin panel:

```text
desktop-first
data-dense but readable
tables/forms/filters
bulk actions
validation feedback
```

---

# 4. PWA Access Rule

The admin panel lives in the same codebase as the learner app, but it should not be treated as part of the learner PWA experience.

## 4.1 Learner Routes

Learner routes should be:

```text
cached/offline-capable
shown in learner navigation
optimized for mobile
installable PWA experience
fast and lightweight
```

Examples:

```text
/
/today
/review
/library
/progress
/settings
```

## 4.2 Admin Routes

Admin routes should be:

```text
accessed manually through /admin
admin-only
desktop-first
online-only
lazy-loaded
not shown to normal users
excluded from offline precache when possible
```

Examples:

```text
/admin
/admin/content
/admin/lesson-packs
/admin/reports
/admin/import
/admin/qa
```

## 4.3 Admin Access Flow

```text
1. Admin opens /admin manually.
2. If not logged in, redirect to login.
3. After login, check admin role.
4. If admin, show admin panel.
5. If normal user, redirect to learner app or show access denied.
```

## 4.4 PWA Cache Rule

Do not precache admin routes or admin-only bundles in the learner PWA shell.

Recommended setup:

```text
Learner app shell = cached/offline-capable
Admin panel = loaded only when an admin visits /admin
```

This keeps the installed learner PWA clean and lightweight.

---

# 5. Admin Permissions

## 4.1 Admin Role

Use an admin role to protect `/admin` routes.

Recommended options:

```text
Option A: profiles.role field
Option B: admin_users table
Option C: Supabase custom claims
```

For simple V1 admin:

```text
admin_users table is easiest and explicit.
```

Example:

```sql
create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'admin',
  created_at timestamptz not null default now()
);
```

Allowed roles:

```text
admin
editor
viewer
```

## 4.2 Role Permissions

| Role | Permission |
|---|---|
| viewer | read admin data only |
| editor | create/edit draft content, review reports |
| admin | publish content, major version changes, manage imports |

For solo development, one admin role is enough.

## 4.3 Route Protection

Admin route access should check:

```text
user is authenticated
user exists in admin_users
role has permission
```

If not admin:

```text
redirect to learner app or show access denied
```

---

# 6. Admin Navigation

## 5.1 Recommended Admin Sidebar

```text
Dashboard
Content
  Components
  Hanzi
  Words
  Sentences
  Grammar Notes
Lesson Packs
Prerequisites
QA Checklist
Issue Reports
Import / Export
Versioning
Settings
```

## 5.2 Admin Dashboard Cards

Admin dashboard should show:

```text
Open issue reports
Content needing review
Recently updated items
Draft content count
Failed validation count
Items missing audio
Items missing accepted meanings
Recently unlocked content test results
```

Example dashboard:

```text
Open reports: 8
Needs review: 23
Missing audio: 41
Validation errors: 3
Draft lesson packs: 2
Recently fixed: 5
```

---

# 7. Content Status Model

The learner app should only show published content.

Admin panel should support content lifecycle.

## 6.1 Recommended Content Status

Add to content tables or use a shared content metadata table:

```text
draft
needs_review
published
archived
```

For V1 simplicity, add a field to each content table:

```sql
status text not null default 'draft'
```

Constraint:

```sql
check (status in ('draft', 'needs_review', 'published', 'archived'))
```

## 6.2 Status Meaning

```text
draft         content is being written
needs_review  content is ready for QA
published     visible to learner app
archived      hidden, kept for history
```

## 6.3 Publishing Rule

Content can be published only if:

```text
required fields are complete
relationships are valid
QA checklist passes
no blocking validation errors
content version is set
```

---

# 8. Content Management Screens

## 7.1 Shared Content List Pattern

Each content type should have a list screen.

Example:

```text
/admin/content/words
```

List columns:

```text
Chinese
Pinyin
Meaning
Level
Status
Reviewable
Version
Updated
Issues
Actions
```

Filters:

```text
level
status
topic tag
tone pattern
missing fields
has open report
is reviewable
script difference
```

Search by:

```text
slug
simplified
traditional
pinyin
meaning
```

Actions:

```text
View
Edit
Duplicate
Validate
Publish
Archive
Export
```

## 7.2 Components Admin

Fields to edit:

```text
slug
character
name_en
name_id
meaning_en
meaning_id
visual_hint_en
visual_hint_id
mnemonic_en
mnemonic_id
accepted_meanings_en
accepted_meanings_id
blocked_meanings_en
blocked_meanings_id
is_official_radical
is_reviewable
level
status
```

Useful validations:

```text
component has at least one linked hanzi before publishing
name is short
meaning is short
mnemonic exists if reviewable
no duplicate character/slug
```

## 7.3 Hanzi Admin

Fields to edit:

```text
slug
simplified
traditional
pinyin_diacritic
pinyin_numbered
pinyin_syllables
tone_number
tone_pattern
meaning_en
meaning_id
accepted_meanings_en
accepted_meanings_id
blocked_meanings_en
blocked_meanings_id
meaning_mnemonic_en
meaning_mnemonic_id
reading_mnemonic_en
reading_mnemonic_id
tone_mnemonic_en
tone_mnemonic_id
audio_url
hsk_level
frequency_rank
level
teaching_notes
difficulty_tags
is_reviewable
status
content_version
```

Relationships:

```text
components used by this hanzi
words using this hanzi
prerequisites
open issue reports
```

Useful validations:

```text
pinyin_syllables has exactly one syllable
neutral tone is 0
pinyin_numbered matches tone_number
tone_pattern matches pinyin_syllables
simplified/traditional fields exist
at least one accepted meaning exists
blocked meanings do not overlap accepted meanings
component links exist where useful
```

## 7.4 Words Admin

Fields to edit:

```text
slug
simplified
traditional
pinyin_diacritic
pinyin_numbered
pinyin_syllables
tone_pattern
meaning_en
meaning_id
accepted_meanings_en
accepted_meanings_id
blocked_meanings_en
blocked_meanings_id
part_of_speech
mnemonic_en
mnemonic_id
tone_mnemonic_en
tone_mnemonic_id
usage_note_en
usage_note_id
audio_url
topic_tags
hsk_level
frequency_rank
level
teaching_notes
difficulty_tags
is_core_word
is_reviewable
status
content_version
```

Relationships:

```text
hanzi used in this word
example sentences
prerequisites
lesson packs
open reports
```

Useful validations:

```text
all hanzi exist in hanzi table
pinyin_syllables count matches word syllables
neutral tone uses 0
tone_pattern matches syllables
part_of_speech is valid
max 3 topic tags
at least one example sentence for core words
accepted meanings exist
```

## 7.5 Sentences Admin

Fields to edit:

```text
slug
simplified
traditional
pinyin_diacritic
pinyin_numbered
pinyin_syllables
translation_en
translation_id
literal_translation_en
literal_translation_id
usage_context_en
usage_context_id
accepted_meanings_en
accepted_meanings_id
blocked_meanings_en
blocked_meanings_id
audio_url
topic_tags
grammar_note_id
level
teaching_notes
difficulty_tags
is_reviewable
status
content_version
```

Relationships:

```text
focus words
grammar note
lesson packs
open reports
```

Useful validations:

```text
sentence is not too long for level
all focus words exist
pinyin_syllables covers every syllable
neutral tone uses 0
translation exists
literal translation is optional
max 1 grammar note in V1
```

## 7.6 Grammar Notes Admin

Fields to edit:

```text
slug
pattern
title_en
title_id
formula
explanation_en
explanation_id
common_mistakes_en
common_mistakes_id
level
teaching_notes
difficulty_tags
is_reviewable
status
content_version
```

Relationships:

```text
example sentences
related words
lesson packs
open reports
```

Useful validations:

```text
one grammar pattern only
explanation is short
formula exists
at least 2 example sentences before publishing
is_reviewable false for V1
```

---

# 9. Lesson Pack Admin

## 8.1 Lesson Pack List

Columns:

```text
Title
Level
Sort order
Estimated minutes
Primary items
Support items
Status
Validation
Actions
```

Filters:

```text
level
status
has validation errors
missing primary items
```

## 8.2 Lesson Pack Editor

Fields:

```text
slug
title_en
title_id
theme_en
theme_id
learning_goal_en
learning_goal_id
level
sort_order
estimated_minutes
is_active
status
```

Item builder:

```text
Add primary item
Add support item
Reorder items
Remove item
Validate pack
Preview learner lesson
```

## 8.3 Primary vs Support Rule

```text
primary = can enter SRS if unlocked and reviewable
support = shown for context only
```

Admin UI should show this clearly.

Example:

```text
Primary items: 你好, 我, 好
Support items: 你好。 你好吗？ Grammar: Statement + 吗？
```

## 8.4 Lesson Pack Validation

Before publish:

```text
3–5 primary word items recommended
2–5 support sentences recommended
0–1 grammar note recommended
all item IDs exist
all primary items are reviewable
support content is level-appropriate
estimated_minutes is realistic
sort_order is unique within level
```

---

# 10. Prerequisites Admin

## 9.1 Purpose

Prerequisites control the unlock system.

Admin should make this visible and editable.

## 9.2 Prerequisite List

Columns:

```text
Item
Unlocks when
Prerequisite
Required stage
Status
```

Example:

```text
Word: 你好
Unlocks when:
- Hanzi 你 reaches Familiar
- Hanzi 好 reaches Familiar
```

## 9.3 Prerequisite Editor

Actions:

```text
Add prerequisite
Remove prerequisite
Change required SRS stage
Preview unlock path
Validate circular dependencies
```

## 9.4 Validation Rules

```text
No circular dependencies
Prerequisite item exists
Target item exists
Required stage usually Familiar
Early starter items may have no prerequisite
No impossible unlock chain
```

## 9.5 Unlock Preview

For a selected item, admin should see:

```text
Locked by: 你, 好
Required stage: Familiar
Used in lesson packs: Pack 1 Greetings
Unlocks next: 你好吗, 你好。
```

---

# 11. QA Checklist Admin

## 10.1 Purpose

The QA screen helps catch content problems before publishing.

## 10.2 QA Dashboard

Show grouped issues:

```text
Missing required fields
Pinyin/tone mismatch
Neutral tone not 0
Broken relationships
Missing accepted meanings
Blocked/accepted meaning overlap
Missing example sentences
Lesson pack issues
Open reports linked to published content
Content needing revalidation
```

## 10.3 QA Item Detail

For each issue:

```text
item type
item slug
problem
severity
suggested fix
open item editor
```

Severity:

```text
blocking
warning
info
```

## 10.4 Blocking Issues

These should prevent publishing:

```text
missing Chinese text
missing pinyin
missing tone data
missing meaning
invalid neutral tone
broken relationship
duplicate slug
primary lesson item is not reviewable
```

## 10.5 Warning Issues

Warnings do not block publishing but should be reviewed.

```text
missing audio
missing mnemonic
long sentence for level
too many topic tags
no usage note
no blocked meanings
```

---

# 12. Content Import / Export

## 11.1 Source of Truth

Content files should remain the main source of truth during early development.

Recommended structure:

```text
/content
  /level-01
    pack-01-greetings.json
    pack-02-i-and-you.json
    pack-03-yes-no-questions.json
  /level-02
    pack-04-go-and-come.json
```

## 11.2 Admin Import Flow

Admin import screen should support:

```text
Upload JSON/YAML
Preview parsed content
Run validation
Show errors/warnings
Choose import mode
Import to draft
Publish after QA
```

## 11.3 Import Modes

```text
insert only
upsert by slug
dry run / validate only
replace draft content
```

Do not allow destructive production replacement without confirmation.

## 11.4 Import Preview

Show:

```text
new items
updated items
unchanged items
errors
warnings
relationship links
lesson packs created
```

## 11.5 Export Flow

Admin should export content to files.

Export options:

```text
all content
by level
by lesson pack
by item type
only published
only draft
```

This prevents the database from becoming the only copy of content.

---

# 13. Issue Reports Admin

## 12.1 Purpose

Users can report content issues from the learner app. Admin reviews and resolves them.

## 12.2 Reports List

Columns:

```text
Category
Item
Status
Comment
User language
Script preference
Created
Actions
```

Filters:

```text
status
category
item type
level
created date
has comment
```

Priority order:

```text
wrong_tone
wrong_pinyin
wrong_meaning
wrong_script_variant
unnatural_sentence
audio_issue
typo
other
```

## 12.3 Report Detail

Show:

```text
reported item
current content data
user comment
linked review question if available
app language
script preference
other reports for same item
content version
admin notes
```

Actions:

```text
Mark reviewing
Edit item
Mark fixed
Mark rejected
Mark duplicate
Add admin note
Trigger content version update
```

## 12.4 Resolution Rules

If report is valid and change is minor:

```text
fix item
increment content_version
change_type = minor
mark report fixed
no user revalidation needed
```

If report is valid and change is major:

```text
fix item
increment content_version
change_type = major
mark affected user_srs_items.needs_revalidation = true
mark report fixed
```

If invalid:

```text
mark rejected
add admin note
```

If duplicate:

```text
mark duplicate
link to original report if implemented
```

---

# 14. Content Versioning Admin

## 13.1 Purpose

Content versioning protects user progress when content changes.

## 13.2 Versioning Fields

Admin should show:

```text
content_version
change_type
last_updated_at
last_reviewed_by
needs_revalidation
```

## 13.3 Minor Change Flow

Examples:

```text
typo
copy clarity
mnemonic improvement
usage note cleanup
```

Admin action:

```text
Save as minor change
Increment content_version
No SRS revalidation
```

## 13.4 Major Change Flow

Examples:

```text
pinyin correction
tone correction
meaning correction
script form correction
accepted answer logic changed
sentence rewritten significantly
```

Admin action:

```text
Save as major change
Increment content_version
Flag affected user_srs_items as needs_revalidation
Show item updated notice in learner app
```

## 13.5 Confirmation Modal

For major changes, require confirmation:

```text
This change may affect users who already learned this item.
Mark affected users for re-review?

[Cancel] [Save major change]
```

---

# 15. Admin Dashboard Analytics

Keep analytics practical.

## 14.1 Content Quality Metrics

Show:

```text
open reports by category
items with most reports
validation errors by type
items missing audio
items missing examples
recent major changes
```

## 14.2 Learning Content Metrics

Optional later:

```text
items with high wrong-answer rate
items causing tone errors
items often reported
lesson packs with high drop-off
review questions with low accuracy
```

These help improve content quality.

---

# 16. Admin UI/UX Principles

## 15.1 Admin UI is Different from Learner UI

Admin panel can be more data-heavy, but should still be clean.

Use:

```text
tables
filters
sidebars
forms
validation panels
preview cards
bulk actions
```

Avoid:

```text
too much visual polish before functionality
complex dashboards without useful action
mixing admin and learner flows
```

## 15.2 Desktop-First

Admin panel should be optimized for desktop/laptop.

Mobile admin support is optional.

## 15.3 Preview the Learner Experience

Admin should have preview buttons:

```text
Preview lesson item
Preview review question
Preview wrong-answer panel
Preview item detail
Preview lesson pack
```

This helps catch bad content before publishing.

---

# 17. Admin Screen Wireframes

## 16.1 Admin Dashboard

```text
┌────────────────┬──────────────────────────────────────┐
│ Admin Sidebar  │ Dashboard                            │
│                │                                      │
│ Dashboard      │ ┌──────────┐ ┌──────────┐ ┌────────┐ │
│ Content        │ │ Reports  │ │ Needs QA │ │ Errors │ │
│ Lesson Packs   │ │ 8 open   │ │ 23 items │ │ 3      │ │
│ Prerequisites  │ └──────────┘ └──────────┘ └────────┘ │
│ QA             │                                      │
│ Reports        │ Recent reports                       │
│ Import         │ ┌──────────────────────────────────┐ │
│ Versioning     │ │ wrong tone · 好 · 2 hours ago    │ │
│ Settings       │ │ typo · 你好 · yesterday          │ │
│                │ └──────────────────────────────────┘ │
└────────────────┴──────────────────────────────────────┘
```

## 16.2 Content List

```text
┌────────────────┬──────────────────────────────────────┐
│ Admin Sidebar  │ Words                                │
│                │ [Search...] [Level] [Status] [+ New] │
│                │                                      │
│                │ Chinese | Pinyin | Meaning | Status  │
│                │ 你好    | nǐ hǎo | hello   | published
│                │ 回家    | huí jiā| go home | draft    │
│                │                                      │
│                │ [Validate selected] [Export]         │
└────────────────┴──────────────────────────────────────┘
```

## 16.3 Content Editor

```text
┌────────────────┬──────────────────────────────────────┐
│ Admin Sidebar  │ Edit word: 你好                       │
│                │                                      │
│                │ [Content] [Relations] [QA] [Preview] │
│                │                                      │
│                │ Simplified: 你好                     │
│                │ Traditional: 你好                    │
│                │ Pinyin: nǐ hǎo                       │
│                │ Tone pattern: 3-3                    │
│                │ Meaning: hello                       │
│                │ Accepted: hello                      │
│                │ Blocked: good, nice                  │
│                │                                      │
│                │ [Save draft] [Validate] [Publish]    │
└────────────────┴──────────────────────────────────────┘
```

## 16.4 Issue Report Detail

```text
┌────────────────┬──────────────────────────────────────┐
│ Admin Sidebar  │ Report: Wrong tone                   │
│                │                                      │
│                │ Item: 好                              │
│                │ Current: hǎo · tone 3                │
│                │ User comment: "tone sounds wrong"   │
│                │                                      │
│                │ Other reports for this item: 2       │
│                │                                      │
│                │ [Edit item] [Mark fixed]             │
│                │ [Reject] [Duplicate]                 │
└────────────────┴──────────────────────────────────────┘
```

## 16.5 Import Preview

```text
┌────────────────┬──────────────────────────────────────┐
│ Admin Sidebar  │ Import content                       │
│                │ [Upload JSON/YAML]                   │
│                │                                      │
│                │ Preview                              │
│                │ New: 12 items                        │
│                │ Updated: 3 items                     │
│                │ Errors: 1                            │
│                │ Warnings: 4                          │
│                │                                      │
│                │ Error: word 回家 references missing  │
│                │ hanzi 家                              │
│                │                                      │
│                │ [Dry run] [Import to draft]          │
└────────────────┴──────────────────────────────────────┘
```

---

# 18. Admin Technical Rules

## 17.1 Prefer RPC for Dangerous Actions

Use RPC functions for:

```text
publish content
major content update
import content
resolve issue report
update prerequisites
bulk validation
```

Simple draft edits can use direct Supabase updates if protected by admin RLS.

## 17.2 Audit Trail

Important admin actions should be logged.

Recommended table later:

```sql
admin_audit_logs
```

Fields:

```text
id
admin_user_id
action
entity_type
entity_id
before_data
after_data
created_at
```

Not required for prototype, but useful before multiple admins.

## 17.3 Avoid Hard Deletes

For content, prefer:

```text
status = archived
```

instead of deleting rows.

Reason:

```text
users may have progress linked to old content
review history should not break
issue reports may reference old content
```

---

# 19. Admin Build Order

## 18.1 Minimum Admin V1

Build only what helps you scale content safely.

```text
1. Admin route protection
2. Content list screens
3. Basic content editor
4. Validation screen
5. Issue report list/detail
6. Report resolution actions
7. Import JSON/YAML to draft
8. Lesson pack editor
```

## 18.2 Admin V2

```text
Prerequisite visual editor
Content versioning dashboard
Preview learner screens
Bulk edit
Export content
Audio management
Analytics for difficult items
Audit logs
```

## 18.3 What Not to Build Early

Avoid early overbuilding:

```text
complex analytics dashboard
multi-user editorial workflow
full CMS permissions
advanced visual dependency graph
mobile admin UI
AI content generation inside admin
```

---

# 20. Admin Panel MVP Scope

For the first useful admin panel, build:

```text
/admin login protection
/admin/content list
/admin/content editor for words/hanzi/sentences
/admin/lesson-packs editor
/admin/reports list/detail
/admin/import dry run
/admin/qa validation results
```

This is enough to stop relying only on direct database edits.

---

# 21. Final Admin North Star

The admin panel exists to protect content quality.

It should make it easy to answer:

```text
What content exists?
What is broken?
What needs review?
What did users report?
What can be safely published?
What changed after users learned it?
```

The learner app should stay simple.

The admin panel should make the content system safe to grow.

