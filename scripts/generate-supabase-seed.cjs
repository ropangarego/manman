#!/usr/bin/env node

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");
const packsDir = path.join(projectRoot, "src", "data", "packs");
const outputPath = path.join(projectRoot, "supabase", "seed_content_packs.sql");

const itemTypeByPrefix = new Map([
  ["component_", "component"],
  ["hanzi_", "hanzi"],
  ["word_", "word"],
  ["sentence_", "sentence"],
  ["pattern_", "pattern"],
  ["intro_", "intro_card"],
]);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function sql(value) {
  if (value === undefined || value === null) return "null";
  if (typeof value === "number") return Number.isFinite(value) ? String(value) : "null";
  if (typeof value === "boolean") return value ? "true" : "false";
  return `'${String(value).replaceAll("'", "''")}'`;
}

function jsonb(value) {
  if (value === undefined) return "'{}'::jsonb";
  return `${sql(JSON.stringify(value))}::jsonb`;
}

function textArray(value) {
  const items = Array.isArray(value) ? value : [];
  return `array[${items.map((item) => sql(item)).join(", ")}]::text[]`;
}

function enumValue(value, fallback) {
  return sql(value || fallback);
}

function sourceHash(raw) {
  return crypto.createHash("sha256").update(raw).digest("hex");
}

function inferItemType(itemId) {
  for (const [prefix, type] of itemTypeByPrefix.entries()) {
    if (itemId.startsWith(prefix)) return type;
  }
  throw new Error(`Cannot infer item type for "${itemId}"`);
}

function byId(items) {
  const map = new Map();
  for (const item of items || []) {
    if (item?.id) map.set(item.id, item);
  }
  return map;
}

function values(rows) {
  return rows.length > 0 ? rows.join(",\n") : "";
}

function createTempPackMap(packFiles) {
  const rows = packFiles.map(({ data }) => {
    const pack = data.pack;
    return `  (${sql(pack.id)}, (select id from public.content_packs where external_id = ${sql(pack.id)}))`;
  });

  return [
    "create temp table seed_pack_ids (external_id text primary key, id uuid not null) on commit drop;",
    `insert into seed_pack_ids (external_id, id) values\n${values(rows)};`,
  ].join("\n");
}

function buildSeed() {
  const files = fs
    .readdirSync(packsDir)
    .filter((file) => file.endsWith(".json"))
    .sort();

  if (files.length === 0) {
    throw new Error(`No pack JSON files found in ${packsDir}`);
  }

  const packFiles = files.map((file) => {
    const filePath = path.join(packsDir, file);
    const raw = fs.readFileSync(filePath, "utf8");
    return {
      file,
      data: JSON.parse(raw),
      hash: sourceHash(raw),
    };
  });

  const lines = [
    "-- Manman! content pack seed",
    "-- Generated from src/data/packs/*.json.",
    "-- Run after supabase/schema_v2_current_mvp.sql.",
    "-- Safe to rerun: content rows use upserts and relationship rows are rebuilt.",
    "",
    "begin;",
    "",
  ];

  const contentPackRows = packFiles.map(({ file, data, hash }) => {
    const pack = data.pack;
    return `  (${[
      sql(pack.id),
      sql(pack.id),
      sql(pack.title),
      sql(pack.title_id),
      sql(pack.subtitle),
      sql(pack.subtitle_id),
      sql(pack.level),
      sql(pack.phase),
      sql(pack.theme),
      enumValue(pack.script_priority, "simplified"),
      sql(pack.estimated_days),
      sql(pack.estimated_minutes_per_day),
      sql(pack.order_index),
      enumValue(pack.pack_type, "standard"),
      sql(pack.is_srs_enabled),
      sql(pack.learning_goal),
      sql(pack.learning_goal_id),
      jsonb(pack.content_summary || {}),
      jsonb(data.study_flow || {}),
      jsonb(data.review_blueprint || {}),
      sql(file),
      sql(hash),
      "true",
    ].join(", ")})`;
  });

  lines.push(
    "insert into public.content_packs (",
    "  external_id, slug, title_en, title_id, subtitle_en, subtitle_id, level, phase, theme,",
    "  script_priority, estimated_days, estimated_minutes_per_day, order_index, pack_type,",
    "  is_srs_enabled, learning_goal_en, learning_goal_id, content_summary, study_flow,",
    "  review_blueprint, source_filename, source_hash, is_active",
    ") values",
    values(contentPackRows),
    "on conflict (external_id) do update set",
    "  slug = excluded.slug,",
    "  title_en = excluded.title_en,",
    "  title_id = excluded.title_id,",
    "  subtitle_en = excluded.subtitle_en,",
    "  subtitle_id = excluded.subtitle_id,",
    "  level = excluded.level,",
    "  phase = excluded.phase,",
    "  theme = excluded.theme,",
    "  script_priority = excluded.script_priority,",
    "  estimated_days = excluded.estimated_days,",
    "  estimated_minutes_per_day = excluded.estimated_minutes_per_day,",
    "  order_index = excluded.order_index,",
    "  pack_type = excluded.pack_type,",
    "  is_srs_enabled = excluded.is_srs_enabled,",
    "  learning_goal_en = excluded.learning_goal_en,",
    "  learning_goal_id = excluded.learning_goal_id,",
    "  content_summary = excluded.content_summary,",
    "  study_flow = excluded.study_flow,",
    "  review_blueprint = excluded.review_blueprint,",
    "  source_filename = excluded.source_filename,",
    "  source_hash = excluded.source_hash,",
    "  is_active = excluded.is_active;",
    ""
  );

  lines.push(createTempPackMap(packFiles), "");

  const toneRows = [];
  for (const { data } of packFiles) {
    for (const [toneNumber, tone] of Object.entries(data.tone_system || {})) {
      toneRows.push(`  ((select id from seed_pack_ids where external_id = ${sql(data.pack.id)}), ${[
        sql(Number(toneNumber)),
        sql(tone.name),
        sql(tone.name_id),
        sql(tone.shape),
        sql(tone.description),
        sql(tone.description_id),
      ].join(", ")})`);
    }
  }

  lines.push(
    "insert into public.pack_tones (pack_id, tone_number, name_en, name_id, shape, description_en, description_id) values",
    values(toneRows),
    "on conflict (pack_id, tone_number) do update set",
    "  name_en = excluded.name_en,",
    "  name_id = excluded.name_id,",
    "  shape = excluded.shape,",
    "  description_en = excluded.description_en,",
    "  description_id = excluded.description_id;",
    ""
  );

  const componentRows = [];
  const hanziRows = [];
  const wordRows = [];
  const patternRows = [];
  const sentenceRows = [];
  const introRows = [];
  const packItemRows = [];
  const prerequisiteRows = [];
  const studyFlowRows = [];

  for (const { data } of packFiles) {
    const packId = data.pack.id;
    const components = data.components || [];
    const hanzi = data.hanzi || [];
    const words = data.words || [];
    const patterns = data.patterns || [];
    const sentences = data.sentences || [];
    const introCards = data.intro_cards || [];

    for (const item of components) {
      componentRows.push(`  (${[
        sql(item.id),
        sql(item.simplified),
        sql(item.traditional),
        sql(item.name),
        sql(item.name_id),
        sql(item.meaning),
        sql(item.meaning_id),
        sql(item.mnemonic),
        sql(item.mnemonic_id),
        textArray(item.examples),
        sql(item.order_index),
        textArray(item.tags),
        "false",
      ].join(", ")})`);
    }

    for (const item of hanzi) {
      hanziRows.push(`  (${[
        sql(item.id),
        sql(item.simplified),
        sql(item.traditional),
        sql(item.meaning),
        sql(item.meaning_id),
        textArray(item.accepted_meanings),
        textArray(item.accepted_meanings_id),
        textArray(item.blocked_meanings),
        textArray(item.blocked_meanings_id),
        sql(item.pinyin),
        sql(item.pinyin_numbered),
        jsonb(item.pinyin_syllables || []),
        sql(item.tone_number),
        sql(item.tone_pattern || String(item.tone_number ?? "")),
        sql(item.mnemonic),
        sql(item.mnemonic_id),
        sql(item.tone_mnemonic),
        sql(item.tone_mnemonic_id),
        sql(item.audio_url),
        textArray(item.examples),
        sql(item.order_index),
        textArray(item.tags),
        sql(item.is_reviewable !== false),
      ].join(", ")})`);
    }

    for (const item of words) {
      wordRows.push(`  (${[
        sql(item.id),
        sql(item.simplified),
        sql(item.traditional),
        sql(item.meaning),
        sql(item.meaning_id),
        textArray(item.accepted_meanings),
        textArray(item.accepted_meanings_id),
        textArray(item.blocked_meanings),
        textArray(item.blocked_meanings_id),
        sql(item.pinyin),
        sql(item.pinyin_numbered),
        jsonb(item.pinyin_syllables || []),
        sql(item.tone_pattern),
        sql(item.part_of_speech),
        sql(item.mnemonic),
        sql(item.mnemonic_id),
        sql(item.tone_note),
        sql(item.tone_note_id),
        sql(item.usage_note),
        sql(item.usage_note_id),
        sql(item.audio_url),
        textArray(item.examples),
        sql(item.order_index),
        textArray(item.tags),
        sql(item.is_core_word === true),
        sql(item.is_reviewable !== false),
      ].join(", ")})`);
    }

    for (const item of patterns) {
      patternRows.push(`  (${[
        sql(item.id),
        sql(item.title),
        sql(item.title_id),
        sql(item.meaning),
        sql(item.meaning_id),
        sql(item.structure),
        sql(item.explanation),
        sql(item.explanation_id),
        jsonb(item.examples || []),
        sql(item.order_index),
        textArray(item.tags),
        sql(item.is_reviewable === true),
      ].join(", ")})`);
    }

    for (const item of sentences) {
      sentenceRows.push(`  (${[
        sql(item.id),
        sql(item.simplified),
        sql(item.traditional),
        sql(item.meaning),
        sql(item.meaning_id),
        sql(item.literal_meaning),
        sql(item.literal_meaning_id),
        sql(item.pinyin),
        sql(item.pinyin_numbered),
        jsonb(item.pinyin_syllables || []),
        sql(item.tone_pattern),
        sql(item.notes),
        sql(item.notes_id),
        sql(item.audio_url),
        sql(item.order_index),
        textArray(item.tags),
        sql(item.is_reviewable !== false),
      ].join(", ")})`);
    }

    for (const item of introCards) {
      introRows.push(`  ((select id from seed_pack_ids where external_id = ${sql(packId)}), ${[
        sql(item.id),
        sql(item.title),
        sql(item.title_id),
        sql(item.body),
        sql(item.body_id),
        item.example === null ? "null" : jsonb(item.example),
        sql(item.order_index),
      ].join(", ")})`);
    }

    for (const item of [
      ...components.map((entry) => ({ ...entry, type: "component", role: "support" })),
      ...hanzi.map((entry) => ({ ...entry, type: "hanzi", role: entry.is_reviewable ? "primary" : "support" })),
      ...words.map((entry) => ({ ...entry, type: "word", role: entry.is_core_word ? "primary" : "support" })),
      ...sentences.map((entry) => ({ ...entry, type: "sentence", role: "unlock" })),
      ...patterns.map((entry) => ({ ...entry, type: "pattern", role: "support" })),
      ...introCards.map((entry) => ({ ...entry, type: "intro_card", role: "support" })),
    ]) {
      packItemRows.push(`  ((select id from seed_pack_ids where external_id = ${sql(packId)}), ${[
        sql(item.type),
        sql(item.id),
        sql(item.role),
        sql(item.order_index),
      ].join(", ")})`);
    }

    for (const item of data.item_prerequisites || []) {
      prerequisiteRows.push(`  (${[
        sql(item.item_type || inferItemType(item.item_id)),
        sql(item.item_id),
        sql(item.prerequisite_type || inferItemType(item.prerequisite_id)),
        sql(item.prerequisite_id),
        sql(item.required_stage || "familiar"),
      ].join(", ")})`);
    }

    for (const [index, itemId] of (data.study_flow?.new_items || []).entries()) {
      studyFlowRows.push(`  ((select id from seed_pack_ids where external_id = ${sql(packId)}), ${[
        sql("new_item"),
        sql(inferItemType(itemId)),
        sql(itemId),
        "null",
        sql(index + 1),
      ].join(", ")})`);
    }

    for (const [index, item] of (data.study_flow?.quick_practice || []).entries()) {
      studyFlowRows.push(`  ((select id from seed_pack_ids where external_id = ${sql(packId)}), ${[
        sql("quick_practice"),
        sql(inferItemType(item.item_id)),
        sql(item.item_id),
        sql(item.question_type),
        sql(index + 1),
      ].join(", ")})`);
    }

    for (const [index, itemId] of (data.study_flow?.unlock_items || []).entries()) {
      studyFlowRows.push(`  ((select id from seed_pack_ids where external_id = ${sql(packId)}), ${[
        sql("unlock_item"),
        sql(inferItemType(itemId)),
        sql(itemId),
        "null",
        sql(index + 1),
      ].join(", ")})`);
    }
  }

  function pushUpsert(table, columns, rows, conflict, updates) {
    if (rows.length === 0) return;
    lines.push(
      `insert into public.${table} (${columns.join(", ")}) values`,
      values(rows),
      `on conflict ${conflict} do update set`,
      updates.map((column) => `  ${column} = excluded.${column}`).join(",\n") + ";",
      ""
    );
  }

  pushUpsert(
    "components",
    ["external_id", "simplified", "traditional", "name_en", "name_id", "meaning_en", "meaning_id", "mnemonic_en", "mnemonic_id", "examples", "order_index", "tags", "is_reviewable"],
    componentRows,
    "(external_id)",
    ["simplified", "traditional", "name_en", "name_id", "meaning_en", "meaning_id", "mnemonic_en", "mnemonic_id", "examples", "order_index", "tags", "is_reviewable"]
  );

  pushUpsert(
    "hanzi",
    ["external_id", "simplified", "traditional", "meaning_en", "meaning_id", "accepted_meanings_en", "accepted_meanings_id", "blocked_meanings_en", "blocked_meanings_id", "pinyin_diacritic", "pinyin_numbered", "pinyin_syllables", "tone_number", "tone_pattern", "mnemonic_en", "mnemonic_id", "tone_mnemonic_en", "tone_mnemonic_id", "audio_url", "examples", "order_index", "tags", "is_reviewable"],
    hanziRows,
    "(external_id)",
    ["simplified", "traditional", "meaning_en", "meaning_id", "accepted_meanings_en", "accepted_meanings_id", "blocked_meanings_en", "blocked_meanings_id", "pinyin_diacritic", "pinyin_numbered", "pinyin_syllables", "tone_number", "tone_pattern", "mnemonic_en", "mnemonic_id", "tone_mnemonic_en", "tone_mnemonic_id", "audio_url", "examples", "order_index", "tags", "is_reviewable"]
  );

  pushUpsert(
    "words",
    ["external_id", "simplified", "traditional", "meaning_en", "meaning_id", "accepted_meanings_en", "accepted_meanings_id", "blocked_meanings_en", "blocked_meanings_id", "pinyin_diacritic", "pinyin_numbered", "pinyin_syllables", "tone_pattern", "part_of_speech", "mnemonic_en", "mnemonic_id", "tone_note_en", "tone_note_id", "usage_note_en", "usage_note_id", "audio_url", "examples", "order_index", "tags", "is_core_word", "is_reviewable"],
    wordRows,
    "(external_id)",
    ["simplified", "traditional", "meaning_en", "meaning_id", "accepted_meanings_en", "accepted_meanings_id", "blocked_meanings_en", "blocked_meanings_id", "pinyin_diacritic", "pinyin_numbered", "pinyin_syllables", "tone_pattern", "part_of_speech", "mnemonic_en", "mnemonic_id", "tone_note_en", "tone_note_id", "usage_note_en", "usage_note_id", "audio_url", "examples", "order_index", "tags", "is_core_word", "is_reviewable"]
  );

  pushUpsert(
    "patterns",
    ["external_id", "title_en", "title_id", "meaning_en", "meaning_id", "structure", "explanation_en", "explanation_id", "examples", "order_index", "tags", "is_reviewable"],
    patternRows,
    "(external_id)",
    ["title_en", "title_id", "meaning_en", "meaning_id", "structure", "explanation_en", "explanation_id", "examples", "order_index", "tags", "is_reviewable"]
  );

  pushUpsert(
    "sentences",
    ["external_id", "simplified", "traditional", "meaning_en", "meaning_id", "literal_meaning_en", "literal_meaning_id", "pinyin_diacritic", "pinyin_numbered", "pinyin_syllables", "tone_pattern", "notes_en", "notes_id", "audio_url", "order_index", "tags", "is_reviewable"],
    sentenceRows,
    "(external_id)",
    ["simplified", "traditional", "meaning_en", "meaning_id", "literal_meaning_en", "literal_meaning_id", "pinyin_diacritic", "pinyin_numbered", "pinyin_syllables", "tone_pattern", "notes_en", "notes_id", "audio_url", "order_index", "tags", "is_reviewable"]
  );

  pushUpsert(
    "intro_cards",
    ["pack_id", "external_id", "title_en", "title_id", "body_en", "body_id", "example", "order_index"],
    introRows,
    "(external_id)",
    ["pack_id", "title_en", "title_id", "body_en", "body_id", "example", "order_index"]
  );

  lines.push(
    "truncate table public.hanzi_components, public.word_hanzi, public.sentence_words, public.sentence_patterns, public.pack_items, public.item_prerequisites, public.study_flow_items restart identity;",
    ""
  );

  const allMaps = packFiles.map(({ data }) => ({
    components: byId(data.components),
    hanzi: byId(data.hanzi),
    words: byId(data.words),
    patterns: byId(data.patterns),
    sentences: byId(data.sentences),
    data,
  }));

  const hanziComponentRows = [];
  const wordHanziRows = [];
  const sentenceWordRows = [];
  const sentencePatternRows = [];

  for (const { data } of allMaps) {
    for (const hanziItem of data.hanzi || []) {
      for (const [index, componentId] of (hanziItem.components || []).entries()) {
        hanziComponentRows.push(`  ((select id from public.hanzi where external_id = ${sql(hanziItem.id)}), (select id from public.components where external_id = ${sql(componentId)}), ${index + 1})`);
      }
    }

    for (const word of data.words || []) {
      for (const [index, hanziId] of (word.hanzi_ids || []).entries()) {
        wordHanziRows.push(`  ((select id from public.words where external_id = ${sql(word.id)}), (select id from public.hanzi where external_id = ${sql(hanziId)}), ${index + 1})`);
      }
    }

    for (const sentence of data.sentences || []) {
      for (const [index, wordId] of (sentence.focus_word_ids || []).entries()) {
        sentenceWordRows.push(`  ((select id from public.sentences where external_id = ${sql(sentence.id)}), (select id from public.words where external_id = ${sql(wordId)}), ${index + 1}, true)`);
      }

      for (const [index, patternId] of (sentence.pattern_ids || []).entries()) {
        sentencePatternRows.push(`  ((select id from public.sentences where external_id = ${sql(sentence.id)}), (select id from public.patterns where external_id = ${sql(patternId)}), ${index + 1})`);
      }
    }
  }

  if (hanziComponentRows.length > 0) {
    lines.push("insert into public.hanzi_components (hanzi_id, component_id, sort_order) values", values(hanziComponentRows) + ";", "");
  }

  if (wordHanziRows.length > 0) {
    lines.push("insert into public.word_hanzi (word_id, hanzi_id, sort_order) values", values(wordHanziRows) + ";", "");
  }

  if (sentenceWordRows.length > 0) {
    lines.push("insert into public.sentence_words (sentence_id, word_id, sort_order, is_focus_word) values", values(sentenceWordRows) + ";", "");
  }

  if (sentencePatternRows.length > 0) {
    lines.push("insert into public.sentence_patterns (sentence_id, pattern_id, sort_order) values", values(sentencePatternRows) + ";", "");
  }

  if (packItemRows.length > 0) {
    lines.push(
      "insert into public.pack_items (pack_id, item_type, item_external_id, role, order_index) values",
      values(packItemRows) + ";",
      ""
    );
  }

  if (prerequisiteRows.length > 0) {
    lines.push(
      "insert into public.item_prerequisites (item_type, item_external_id, prerequisite_type, prerequisite_external_id, required_stage) values",
      values(prerequisiteRows) + ";",
      ""
    );
  }

  if (studyFlowRows.length > 0) {
    lines.push(
      "insert into public.study_flow_items (pack_id, section, item_type, item_external_id, question_type, order_index) values",
      values(studyFlowRows) + ";",
      ""
    );
  }

  lines.push("commit;", "");
  return lines.join("\n");
}

const seed = buildSeed();
fs.writeFileSync(outputPath, seed, "utf8");
console.log(`Generated ${path.relative(projectRoot, outputPath)}`);
