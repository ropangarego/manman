#!/usr/bin/env node

const fs = require("fs");

const filePath = process.argv[2];

if (!filePath) {
  console.error("Usage: node scripts/validate-content.js <content-file.json>");
  process.exit(1);
}

if (!fs.existsSync(filePath)) {
  console.error(`File not found: ${filePath}`);
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

const errors = [];
const warnings = [];

const requiredArrays = [
  "lesson_packs",
  "intro_cards",
  "components",
  "hanzi",
  "words",
  "grammar_notes",
  "sentences",
  "lesson_pack_items",
  "item_prerequisites",
  "starter_unlocks",
];

function err(msg) {
  errors.push(msg);
}

function warn(msg) {
  warnings.push(msg);
}

function isText(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function getArray(name) {
  if (!Array.isArray(data[name])) {
    err(`Missing array: ${name}`);
    return [];
  }
  return data[name];
}

function makeMap(name, items) {
  const map = new Map();

  for (const item of items) {
    if (!isText(item.slug)) {
      err(`${name}: item missing slug`);
      continue;
    }

    if (map.has(item.slug)) {
      err(`${name}: duplicate slug "${item.slug}"`);
    }

    map.set(item.slug, item);
  }

  return map;
}

function requireFields(type, item, fields) {
  for (const field of fields) {
    if (
      item[field] === undefined ||
      item[field] === null ||
      item[field] === ""
    ) {
      err(`${type}/${item.slug || "unknown"}: missing "${field}"`);
    }
  }
}

function parseTonePattern(pattern) {
  if (!isText(pattern)) return null;

  const tones = pattern.split("-").map(Number);

  if (tones.some((tone) => !Number.isInteger(tone) || tone < 0 || tone > 4)) {
    return null;
  }

  return tones;
}

function checkPinyin(type, item) {
  if (!Array.isArray(item.pinyin_syllables)) {
    err(`${type}/${item.slug}: pinyin_syllables must be an array`);
    return;
  }

  for (const [index, syllable] of item.pinyin_syllables.entries()) {
    if (!isText(syllable.hanzi)) {
      err(`${type}/${item.slug}: syllable ${index} missing hanzi`);
    }

    if (!isText(syllable.pinyin)) {
      err(`${type}/${item.slug}: syllable ${index} missing pinyin`);
    }

    if (
      !Number.isInteger(syllable.tone) ||
      syllable.tone < 0 ||
      syllable.tone > 4
    ) {
      err(`${type}/${item.slug}: invalid tone "${syllable.tone}", use 0–4`);
    }

    if (syllable.tone === 5) {
      err(`${type}/${item.slug}: neutral tone must be 0, not 5`);
    }
  }

  const tonePattern = parseTonePattern(item.tone_pattern);

  if (!tonePattern) {
    err(`${type}/${item.slug}: invalid tone_pattern "${item.tone_pattern}"`);
    return;
  }

  const syllableTones = item.pinyin_syllables.map((s) => s.tone);

  if (tonePattern.join("-") !== syllableTones.join("-")) {
    err(
      `${type}/${item.slug}: tone_pattern "${item.tone_pattern}" does not match pinyin_syllables "${syllableTones.join("-")}"`
    );
  }
}

function checkAcceptedBlocked(type, item) {
  if (item.is_reviewable === false) return;

  if (!Array.isArray(item.accepted_meanings_en) || item.accepted_meanings_en.length === 0) {
    warn(`${type}/${item.slug}: no accepted_meanings_en`);
  }

  const accepted = new Set(
    (item.accepted_meanings_en || []).map((x) => String(x).toLowerCase().trim())
  );

  const blocked = new Set(
    (item.blocked_meanings_en || []).map((x) => String(x).toLowerCase().trim())
  );

  for (const value of accepted) {
    if (blocked.has(value)) {
      err(`${type}/${item.slug}: accepted and blocked overlap on "${value}"`);
    }
  }
}

for (const arrayName of requiredArrays) {
  getArray(arrayName);
}

const lessonPacks = getArray("lesson_packs");
const components = getArray("components");
const hanzi = getArray("hanzi");
const words = getArray("words");
const grammarNotes = getArray("grammar_notes");
const sentences = getArray("sentences");
const lessonPackItems = getArray("lesson_pack_items");
const prerequisites = getArray("item_prerequisites");
const starterUnlocks = getArray("starter_unlocks");

const maps = {
  lesson_packs: makeMap("lesson_packs", lessonPacks),
  components: makeMap("components", components),
  hanzi: makeMap("hanzi", hanzi),
  words: makeMap("words", words),
  grammar_notes: makeMap("grammar_notes", grammarNotes),
  sentences: makeMap("sentences", sentences),
};

function exists(type, slug) {
  if (type === "component") return maps.components.has(slug);
  if (type === "hanzi") return maps.hanzi.has(slug);
  if (type === "word") return maps.words.has(slug);
  if (type === "sentence") return maps.sentences.has(slug);
  if (type === "grammar_note") return maps.grammar_notes.has(slug);
  if (type === "intro_card") return /^intro-card-\d{2}$/.test(slug);
  return false;
}

function getItem(type, slug) {
  if (type === "component") return maps.components.get(slug);
  if (type === "hanzi") return maps.hanzi.get(slug);
  if (type === "word") return maps.words.get(slug);
  if (type === "sentence") return maps.sentences.get(slug);
  if (type === "grammar_note") return maps.grammar_notes.get(slug);
  return null;
}

for (const pack of lessonPacks) {
  requireFields("lesson_packs", pack, [
    "slug",
    "title_en",
    "theme_en",
    "learning_goal_en",
    "level",
    "sort_order",
    "estimated_minutes",
    "pack_type",
    "is_srs_enabled",
    "is_active",
  ]);

  if (!["introduction", "standard"].includes(pack.pack_type)) {
    err(`lesson_packs/${pack.slug}: invalid pack_type`);
  }

  if (pack.pack_type === "introduction" && pack.is_srs_enabled !== false) {
    err(`lesson_packs/${pack.slug}: introduction pack must have is_srs_enabled=false`);
  }
}

for (const item of components) {
  requireFields("components", item, [
    "slug",
    "character",
    "name_en",
    "meaning_en",
    "level",
    "is_reviewable",
  ]);
}

for (const item of hanzi) {
  requireFields("hanzi", item, [
    "slug",
    "simplified",
    "traditional",
    "pinyin_diacritic",
    "pinyin_numbered",
    "pinyin_syllables",
    "tone_number",
    "tone_pattern",
    "meaning_en",
    "level",
    "is_reviewable",
  ]);

  checkPinyin("hanzi", item);
  checkAcceptedBlocked("hanzi", item);

  if (Array.isArray(item.components)) {
    for (const componentSlug of item.components) {
      if (!maps.components.has(componentSlug)) {
        err(`hanzi/${item.slug}: missing component "${componentSlug}"`);
      }
    }
  }
}

for (const item of words) {
  requireFields("words", item, [
    "slug",
    "simplified",
    "traditional",
    "pinyin_diacritic",
    "pinyin_numbered",
    "pinyin_syllables",
    "tone_pattern",
    "meaning_en",
    "part_of_speech",
    "level",
    "is_reviewable",
  ]);

  checkPinyin("words", item);
  checkAcceptedBlocked("words", item);

  if (!Array.isArray(item.hanzi)) {
    err(`words/${item.slug}: missing hanzi relationship array`);
  } else {
    for (const hanziSlug of item.hanzi) {
      if (!maps.hanzi.has(hanziSlug)) {
        err(`words/${item.slug}: missing hanzi "${hanziSlug}"`);
      }
    }
  }

  if (Array.isArray(item.topic_tags) && item.topic_tags.length > 3) {
    warn(`words/${item.slug}: more than 3 topic_tags`);
  }
}

for (const item of grammarNotes) {
  requireFields("grammar_notes", item, [
    "slug",
    "title_en",
    "pattern",
    "formula",
    "explanation_en",
    "level",
    "is_reviewable",
  ]);

  if (item.is_reviewable !== false) {
    warn(`grammar_notes/${item.slug}: should usually be is_reviewable=false`);
  }
}

for (const item of sentences) {
  requireFields("sentences", item, [
    "slug",
    "simplified",
    "traditional",
    "pinyin_diacritic",
    "pinyin_numbered",
    "pinyin_syllables",
    "translation_en",
    "level",
    "is_reviewable",
  ]);

  checkPinyin("sentences", item);
  checkAcceptedBlocked("sentences", item);

  if (Array.isArray(item.focus_word_slugs)) {
    for (const wordSlug of item.focus_word_slugs) {
      if (!maps.words.has(wordSlug)) {
        err(`sentences/${item.slug}: missing focus word "${wordSlug}"`);
      }
    }
  }

  if (item.grammar_note_slug && !maps.grammar_notes.has(item.grammar_note_slug)) {
    err(`sentences/${item.slug}: missing grammar note "${item.grammar_note_slug}"`);
  }

  const hanziOnly = item.simplified.replace(/[，。！？、\s]/g, "");

  if (item.level <= 3 && hanziOnly.length > 8) {
    warn(`sentences/${item.slug}: beginner sentence has ${hanziOnly.length} characters`);
  }
}

for (const item of lessonPackItems) {
  requireFields("lesson_pack_items", item, [
    "lesson_pack_slug",
    "item_type",
    "item_slug",
    "item_role",
    "sort_order",
  ]);

  const pack = maps.lesson_packs.get(item.lesson_pack_slug);

  if (!pack) {
    err(`lesson_pack_items: missing lesson pack "${item.lesson_pack_slug}"`);
    continue;
  }

  if (!["primary", "support"].includes(item.item_role)) {
    err(`lesson_pack_items/${item.item_slug}: invalid item_role`);
  }

  if (pack.pack_type === "introduction" && item.item_role !== "support") {
    err(`lesson_pack_items/${item.item_slug}: Pack 000 must use support only`);
  }

  if (pack.is_srs_enabled === false && item.item_role === "primary") {
    err(`lesson_pack_items/${item.item_slug}: non-SRS pack cannot have primary items`);
  }

  if (!exists(item.item_type, item.item_slug)) {
    err(`lesson_pack_items: missing ${item.item_type} "${item.item_slug}"`);
  }

  if (item.item_role === "primary") {
    const target = getItem(item.item_type, item.item_slug);

    if (target && target.is_reviewable !== true) {
      err(`lesson_pack_items/${item.item_slug}: primary item must be reviewable`);
    }
  }
}

for (const item of prerequisites) {
  requireFields("item_prerequisites", item, [
    "item_type",
    "item_slug",
    "prerequisite_type",
    "prerequisite_slug",
    "required_srs_stage",
  ]);

  if (!exists(item.item_type, item.item_slug)) {
    err(`item_prerequisites: missing target "${item.item_slug}"`);
  }

  if (!exists(item.prerequisite_type, item.prerequisite_slug)) {
    err(`item_prerequisites: missing prerequisite "${item.prerequisite_slug}"`);
  }

  const allowedStages = ["learning", "familiar", "strong", "mastered", "long_term"];

  if (!allowedStages.includes(item.required_srs_stage)) {
    err(`item_prerequisites/${item.item_slug}: invalid required_srs_stage`);
  }
}

for (const item of starterUnlocks) {
  requireFields("starter_unlocks", item, [
    "item_type",
    "item_slug",
    "source_lesson_pack_slug",
  ]);

  if (!exists(item.item_type, item.item_slug)) {
    err(`starter_unlocks: missing item "${item.item_slug}"`);
  }

  if (!maps.lesson_packs.has(item.source_lesson_pack_slug)) {
    err(`starter_unlocks/${item.item_slug}: missing source pack`);
  }
}

console.log("\nMandarin content validation");
console.log("=".repeat(32));
console.log(`Packs: ${lessonPacks.length}`);
console.log(`Components: ${components.length}`);
console.log(`Hanzi: ${hanzi.length}`);
console.log(`Words: ${words.length}`);
console.log(`Sentences: ${sentences.length}`);
console.log(`Grammar notes: ${grammarNotes.length}`);
console.log(`Lesson pack items: ${lessonPackItems.length}`);
console.log(`Prerequisites: ${prerequisites.length}`);

if (warnings.length > 0) {
  console.log("\nWarnings");
  console.log("-".repeat(32));
  for (const warning of warnings) {
    console.log(`⚠ ${warning}`);
  }
}

if (errors.length > 0) {
  console.log("\nErrors");
  console.log("-".repeat(32));
  for (const error of errors) {
    console.log(`✖ ${error}`);
  }

  console.log(`\nValidation failed: ${errors.length} error(s), ${warnings.length} warning(s).`);
  process.exit(1);
}

console.log(`\nValidation passed: 0 errors, ${warnings.length} warning(s).`);