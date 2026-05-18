#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

type Severity = 'error' | 'warning';
type Section =
  | 'file'
  | 'top-level'
  | 'pack'
  | 'content_summary'
  | 'ids'
  | 'components'
  | 'hanzi'
  | 'words'
  | 'sentences'
  | 'patterns'
  | 'intro_cards'
  | 'item_prerequisites'
  | 'component_refs'
  | 'pinyin'
  | 'order'
  | 'audio';

type Issue = {
  severity: Severity;
  file: string;
  section: Section;
  itemId?: string;
  message: string;
};

type LoadedPack = {
  file: string;
  data: Record<string, unknown>;
  packId: string;
  orderIndex: number | null;
};

type IdEntry = {
  id: string;
  file: string;
  type: string;
  packId: string;
  orderIndex: number | null;
};

type Stats = {
  components: number;
  hanzi: number;
  words: number;
  sentences: number;
  patterns: number;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const packsDir = path.join(projectRoot, 'src', 'data', 'packs');

const REQUIRED_TOP_LEVEL = [
  'pack',
  'tone_system',
  'components',
  'hanzi',
  'words',
  'sentences',
  'patterns',
  'item_prerequisites',
  'unlock_rules',
  'review_blueprint',
  'study_flow',
];

const ARRAY_FIELDS = [
  'components',
  'hanzi',
  'words',
  'sentences',
  'patterns',
  'item_prerequisites',
  'unlock_rules',
];

const PACK_REQUIRED_FIELDS = [
  'id',
  'title',
  'title_id',
  'level',
  'phase',
  'script_priority',
  'order_index',
  'pack_type',
  'is_srs_enabled',
  'content_summary',
];

const PHASES = new Set(['prototype', 'mvp', 'beta', 'production']);
const SCRIPT_PRIORITIES = new Set(['simplified', 'traditional', 'both']);
const PACK_TYPES = new Set(['intro', 'introduction', 'standard', 'review', 'bonus']);
const VALID_TONES = new Set([0, 1, 2, 3, 4]);

const issues: Issue[] = [];

function addIssue(severity: Severity, file: string, section: Section, message: string, itemId?: string) {
  issues.push({ severity, file, section, itemId, message });
}

function addError(file: string, section: Section, message: string, itemId?: string) {
  addIssue('error', file, section, message, itemId);
}

function addWarning(file: string, section: Section, message: string, itemId?: string) {
  addIssue('warning', file, section, message, itemId);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function asRecord(value: unknown): Record<string, unknown> {
  return isRecord(value) ? value : {};
}

function asArray(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value) ? value.filter(isRecord) : [];
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function requireField(file: string, section: Section, item: Record<string, unknown>, field: string, itemId?: string) {
  const value = item[field];
  if (value === undefined || value === null || value === '') {
    addError(file, section, `Missing required field "${field}".`, itemId);
    return false;
  }
  return true;
}

function getRequiredString(
  file: string,
  section: Section,
  item: Record<string, unknown>,
  field: string,
  itemId?: string,
) {
  requireField(file, section, item, field, itemId);
  return typeof item[field] === 'string' ? item[field] : '';
}

function validatePinyinSyllables(
  file: string,
  section: 'hanzi' | 'words' | 'sentences',
  item: Record<string, unknown>,
) {
  const itemId = typeof item.id === 'string' ? item.id : 'unknown';
  const pinyin = item.pinyin;
  const syllables = item.pinyin_syllables;

  if (!isNonEmptyString(pinyin)) {
    addError(file, 'pinyin', 'Pinyin must be a non-empty string.', itemId);
  }

  if (!Array.isArray(syllables) || syllables.length === 0) {
    addError(file, 'pinyin', 'pinyin_syllables must be a non-empty array.', itemId);
    return;
  }

  syllables.forEach((syllable, index) => {
    if (!isRecord(syllable)) {
      addError(file, 'pinyin', `Syllable ${index + 1} must be an object.`, itemId);
      return;
    }

    if (!isNonEmptyString(syllable.text)) {
      addError(file, 'pinyin', `Syllable ${index + 1} is missing text.`, itemId);
    }

    if (!VALID_TONES.has(syllable.tone as number)) {
      addError(file, 'pinyin', `Syllable ${index + 1} has invalid tone "${String(syllable.tone)}"; use 0-4.`, itemId);
    }
  });

  if (typeof pinyin === 'string') {
    const splitCount = pinyin.trim().split(/\s+/).filter(Boolean).length;
    if (splitCount > 0 && Math.abs(splitCount - syllables.length) > 2) {
      addWarning(
        file,
        'pinyin',
        `pinyin_syllables count (${syllables.length}) differs from pinyin word count (${splitCount}).`,
        itemId,
      );
    }
  }

  if (section === 'hanzi' && !VALID_TONES.has(item.tone_number as number)) {
    addError(file, 'pinyin', `tone_number must be 0-4, got "${String(item.tone_number)}".`, itemId);
  }
}

function validateOrderIndexes(file: string, section: Section, items: Record<string, unknown>[]) {
  const seen = new Map<number, string>();
  const values: number[] = [];

  items.forEach((item, index) => {
    const itemId = typeof item.id === 'string' ? item.id : `${section}[${index}]`;
    const orderIndex = item.order_index;

    if (typeof orderIndex !== 'number' || !Number.isFinite(orderIndex)) {
      addError(file, 'order', 'order_index must be a number.', itemId);
      return;
    }

    if (seen.has(orderIndex)) {
      addError(file, 'order', `Duplicate order_index ${orderIndex}; also used by ${seen.get(orderIndex)}.`, itemId);
    } else {
      seen.set(orderIndex, itemId);
    }

    values.push(orderIndex);
  });

  for (let index = 1; index < values.length; index += 1) {
    if (values[index] < values[index - 1]) {
      addWarning(file, 'order', `${section} is not sorted by order_index.`);
      break;
    }
  }

  const sorted = [...values].sort((a, b) => a - b);
  for (let index = 1; index < sorted.length; index += 1) {
    if (sorted[index] - sorted[index - 1] > 10) {
      addWarning(file, 'order', `${section} has a large order_index gap between ${sorted[index - 1]} and ${sorted[index]}.`);
      break;
    }
  }
}

function numericPrefixFromPackId(packId: string) {
  const match = /^pack_(\d+)/.exec(packId);
  return match ? Number.parseInt(match[1], 10) : null;
}

function packIdFromFileName(file: string) {
  return file.replace(/\.json$/i, '');
}

function validateAudioUrl(file: string, section: Section, item: Record<string, unknown>) {
  const itemId = typeof item.id === 'string' ? item.id : undefined;
  if (item.audio_url !== undefined && item.audio_url !== null && typeof item.audio_url !== 'string') {
    addWarning(file, 'audio', 'audio_url may be null/missing, but when present it should be a string.', itemId);
  }
}

function collectIds(pack: LoadedPack, idRegistry: Map<string, IdEntry[]>) {
  const sections: Array<[keyof Stats | 'intro_cards', string]> = [
    ['components', 'component'],
    ['hanzi', 'hanzi'],
    ['words', 'word'],
    ['sentences', 'sentence'],
    ['patterns', 'pattern'],
    ['intro_cards', 'intro_card'],
  ];

  for (const [field, type] of sections) {
    for (const item of asArray(pack.data[field])) {
      if (!isNonEmptyString(item.id)) continue;
      const entry: IdEntry = {
        id: item.id,
        file: pack.file,
        type,
        packId: pack.packId,
        orderIndex: pack.orderIndex,
      };
      const existing = idRegistry.get(item.id) ?? [];
      existing.push(entry);
      idRegistry.set(item.id, existing);
    }
  }
}

function validateTopLevel(pack: LoadedPack) {
  for (const field of REQUIRED_TOP_LEVEL) {
    if (!(field in pack.data)) {
      addError(pack.file, 'top-level', `Missing top-level field "${field}".`);
    }
  }

  for (const field of ARRAY_FIELDS) {
    if (!Array.isArray(pack.data[field])) {
      addError(pack.file, 'top-level', `"${field}" must be an array.`);
    }
  }

  if ('intro_cards' in pack.data && !Array.isArray(pack.data.intro_cards)) {
    addError(pack.file, 'top-level', '"intro_cards" must be an array when present.');
  }
}

function validatePackMetadata(pack: LoadedPack, packIds: Map<string, string>, orderIndexes: Map<number, string>) {
  const meta = asRecord(pack.data.pack);

  PACK_REQUIRED_FIELDS.forEach((field) => requireField(pack.file, 'pack', meta, field, pack.packId));

  if (pack.packId && packIdFromFileName(pack.file) !== pack.packId) {
    addError(pack.file, 'file', `File name should match pack.id "${pack.packId}".`);
  }

  if (isNonEmptyString(pack.packId)) {
    const existingFile = packIds.get(pack.packId);
    if (existingFile && existingFile !== pack.file) {
      addError(pack.file, 'pack', `Duplicate pack.id "${pack.packId}" also found in ${existingFile}.`, pack.packId);
    }
    packIds.set(pack.packId, pack.file);
  }

  if (pack.orderIndex !== null) {
    const existingFile = orderIndexes.get(pack.orderIndex);
    if (existingFile && existingFile !== pack.file) {
      addError(pack.file, 'pack', `Duplicate pack.order_index ${pack.orderIndex} also found in ${existingFile}.`, pack.packId);
    }
    orderIndexes.set(pack.orderIndex, pack.file);
  }

  const numericPrefix = numericPrefixFromPackId(pack.packId);
  if (numericPrefix !== null && pack.orderIndex !== null && numericPrefix !== pack.orderIndex) {
    addError(pack.file, 'pack', `pack.order_index ${pack.orderIndex} should match pack id prefix ${numericPrefix}.`, pack.packId);
  }

  if (!PHASES.has(String(meta.phase))) {
    addError(pack.file, 'pack', `phase must be one of ${[...PHASES].join(', ')}.`, pack.packId);
  }

  if (!SCRIPT_PRIORITIES.has(String(meta.script_priority))) {
    addError(pack.file, 'pack', `script_priority must be one of ${[...SCRIPT_PRIORITIES].join(', ')}.`, pack.packId);
  }

  if (!PACK_TYPES.has(String(meta.pack_type))) {
    addError(pack.file, 'pack', 'pack_type must be one of intro, standard, review, bonus.', pack.packId);
  }

  if (pack.orderIndex === 0) {
    if (!['intro', 'introduction'].includes(String(meta.pack_type))) {
      addError(pack.file, 'pack', 'Pack 000 should use intro pack_type.', pack.packId);
    }
    if (meta.pack_type === 'introduction') {
      addWarning(pack.file, 'pack', 'Pack 000 uses legacy pack_type "introduction"; prefer "intro" for future packs.', pack.packId);
    }
    if (meta.is_srs_enabled !== false) {
      addError(pack.file, 'pack', 'Pack 000 should be non-SRS.', pack.packId);
    }
  }

  if ((pack.orderIndex ?? 0) >= 1) {
    if (meta.pack_type !== 'standard') {
      addWarning(pack.file, 'pack', 'Packs 001+ should usually use pack_type "standard".', pack.packId);
    }
    if (meta.is_srs_enabled !== true) {
      addWarning(pack.file, 'pack', 'Packs 001+ should usually have is_srs_enabled true.', pack.packId);
    }
  }

  if (!isNonEmptyString(meta.title_id)) {
    addError(pack.file, 'pack', 'pack.title_id is required for Indonesian UI.', pack.packId);
  }
  if (meta.subtitle !== undefined && !isNonEmptyString(meta.subtitle_id)) {
    addError(pack.file, 'pack', 'pack.subtitle_id is required when subtitle exists.', pack.packId);
  }
  if (meta.learning_goal !== undefined && !isNonEmptyString(meta.learning_goal_id)) {
    addError(pack.file, 'pack', 'pack.learning_goal_id is required when learning_goal exists.', pack.packId);
  }
}

function validateContentSummary(pack: LoadedPack) {
  const meta = asRecord(pack.data.pack);
  const summary = asRecord(meta.content_summary);
  const fields: Array<keyof Stats> = ['components', 'hanzi', 'words', 'sentences', 'patterns'];

  for (const field of fields) {
    const actual = asArray(pack.data[field]).length;
    if (typeof summary[field] !== 'number') {
      addError(pack.file, 'content_summary', `content_summary.${field} must be ${actual}.`, pack.packId);
      continue;
    }
    if (summary[field] !== actual) {
      addError(pack.file, 'content_summary', `content_summary.${field} is ${summary[field]}, but actual ${field} count is ${actual}.`, pack.packId);
    }
  }
}

function validateComponent(pack: LoadedPack, item: Record<string, unknown>) {
  const id = getRequiredString(pack.file, 'components', item, 'id');
  ['type', 'simplified', 'traditional', 'name', 'meaning', 'meaning_id', 'order_index'].forEach((field) =>
    requireField(pack.file, 'components', item, field, id),
  );
  if (id && !id.startsWith('component_')) addError(pack.file, 'components', 'Component id must start with "component_".', id);
  if (item.type !== 'component') addError(pack.file, 'components', 'Component type must be "component".', id);
}

function validateHanzi(pack: LoadedPack, item: Record<string, unknown>, idRegistry: Map<string, IdEntry[]>) {
  const id = getRequiredString(pack.file, 'hanzi', item, 'id');
  ['type', 'simplified', 'traditional', 'meaning', 'meaning_id', 'pinyin', 'pinyin_syllables', 'tone_number', 'order_index'].forEach((field) =>
    requireField(pack.file, 'hanzi', item, field, id),
  );
  if (id && !id.startsWith('hanzi_')) addError(pack.file, 'hanzi', 'Hanzi id must start with "hanzi_".', id);
  if (item.type !== 'hanzi') addError(pack.file, 'hanzi', 'Hanzi type must be "hanzi".', id);
  validatePinyinSyllables(pack.file, 'hanzi', item);
  validateAudioUrl(pack.file, 'hanzi', item);
  warnMissingOptionalIndonesian(pack.file, 'hanzi', item);

  if (Array.isArray(item.components)) {
    item.components.forEach((componentId) => {
      if (typeof componentId !== 'string') {
        addError(pack.file, 'component_refs', 'components entries must be component ID strings.', id);
        return;
      }
      validateReferenceExists(pack, idRegistry, componentId, 'component_refs', id);
    });
  }
}

function validateWordOrSentence(pack: LoadedPack, section: 'words' | 'sentences', item: Record<string, unknown>) {
  const id = getRequiredString(pack.file, section, item, 'id');
  ['type', 'simplified', 'traditional', 'meaning', 'meaning_id', 'pinyin', 'pinyin_syllables', 'order_index'].forEach((field) =>
    requireField(pack.file, section, item, field, id),
  );
  const expectedType = section === 'words' ? 'word' : 'sentence';
  if (id && !id.startsWith(`${expectedType}_`)) addError(pack.file, section, `${expectedType} id must start with "${expectedType}_".`, id);
  if (item.type !== expectedType) addError(pack.file, section, `${expectedType} type must be "${expectedType}".`, id);
  validatePinyinSyllables(pack.file, section, item);
  validateAudioUrl(pack.file, section, item);
  warnMissingOptionalIndonesian(pack.file, section, item);
}

function validatePattern(pack: LoadedPack, item: Record<string, unknown>) {
  const id = getRequiredString(pack.file, 'patterns', item, 'id');
  [
    'type',
    'title',
    'title_id',
    'meaning',
    'meaning_id',
    'structure',
    'explanation',
    'explanation_id',
    'examples',
    'order_index',
  ].forEach((field) => requireField(pack.file, 'patterns', item, field, id));
  if (id && !id.startsWith('pattern_')) addError(pack.file, 'patterns', 'Pattern id must start with "pattern_".', id);
  if (item.type !== 'pattern') addError(pack.file, 'patterns', 'Pattern type must be "pattern".', id);
  if (!Array.isArray(item.examples) || item.examples.length === 0) {
    addError(pack.file, 'patterns', 'Pattern examples must be a non-empty array.', id);
  }
  warnMissingOptionalIndonesian(pack.file, 'patterns', item);
}

function validateIntroCard(pack: LoadedPack, item: Record<string, unknown>) {
  const id = getRequiredString(pack.file, 'intro_cards', item, 'id');
  requireField(pack.file, 'intro_cards', item, 'order_index', id);
  if (!isNonEmptyString(item.title) && !isNonEmptyString(item.title_id)) {
    addError(pack.file, 'intro_cards', 'Intro card should include title/title_id.', id);
  }
  if (!isNonEmptyString(item.body) && !isNonEmptyString(item.body_id) && !isNonEmptyString(item.content) && !isNonEmptyString(item.content_id)) {
    addError(pack.file, 'intro_cards', 'Intro card should include body/body_id or equivalent content fields.', id);
  }
}

function warnMissingOptionalIndonesian(file: string, section: Section, item: Record<string, unknown>) {
  const id = typeof item.id === 'string' ? item.id : undefined;
  if (item.mnemonic !== undefined && item.mnemonic !== null && !isNonEmptyString(item.mnemonic_id)) {
    addWarning(file, section, 'mnemonic exists but mnemonic_id is missing.', id);
  }
  if (item.notes !== undefined && item.notes !== null && !isNonEmptyString(item.notes_id)) {
    addWarning(file, section, 'notes exists but notes_id is missing.', id);
  }
}

function validateReferenceExists(
  pack: LoadedPack,
  idRegistry: Map<string, IdEntry[]>,
  referencedId: string,
  section: Section,
  itemId?: string,
) {
  const entries = idRegistry.get(referencedId) ?? [];
  if (entries.length === 0) {
    addError(pack.file, section, `Referenced ID "${referencedId}" does not exist in this or an earlier pack.`, itemId);
    return null;
  }

  const allowedEntry = entries.find((entry) => entry.orderIndex !== null && pack.orderIndex !== null && entry.orderIndex <= pack.orderIndex);
  if (!allowedEntry) {
    addError(pack.file, section, `Referenced ID "${referencedId}" exists only in a later pack.`, itemId);
    return null;
  }

  return allowedEntry;
}

function validatePrerequisites(pack: LoadedPack, idRegistry: Map<string, IdEntry[]>) {
  for (const prereq of asArray(pack.data.item_prerequisites)) {
    const itemId = typeof prereq.item_id === 'string' ? prereq.item_id : typeof prereq.item_external_id === 'string' ? prereq.item_external_id : '';
    const prerequisiteId =
      typeof prereq.prerequisite_item_id === 'string'
        ? prereq.prerequisite_item_id
        : typeof prereq.prerequisite_item_external_id === 'string'
          ? prereq.prerequisite_item_external_id
          : '';

    if (!itemId) addError(pack.file, 'item_prerequisites', 'Missing item_id or item_external_id.');
    if (!isNonEmptyString(prereq.item_type)) addError(pack.file, 'item_prerequisites', 'Missing item_type.', itemId || undefined);
    if (!prerequisiteId) addError(pack.file, 'item_prerequisites', 'Missing prerequisite_item_id or prerequisite_item_external_id.', itemId || undefined);
    if (!isNonEmptyString(prereq.prerequisite_item_type)) addError(pack.file, 'item_prerequisites', 'Missing prerequisite_item_type.', itemId || undefined);
    if (!itemId || !prerequisiteId) continue;

    if (itemId === prerequisiteId) {
      addError(pack.file, 'item_prerequisites', 'Item cannot depend on itself.', itemId);
    }

    const itemEntry = validateReferenceExists(pack, idRegistry, itemId, 'item_prerequisites', itemId);
    const prereqEntry = validateReferenceExists(pack, idRegistry, prerequisiteId, 'item_prerequisites', itemId);

    if (itemEntry && prereqEntry && pack.orderIndex !== null && prereqEntry.orderIndex !== null && prereqEntry.orderIndex > pack.orderIndex) {
      addError(pack.file, 'item_prerequisites', `Prerequisite "${prerequisiteId}" points to a later pack.`, itemId);
    }
  }
}

function validateItems(pack: LoadedPack, idRegistry: Map<string, IdEntry[]>) {
  const sections: Array<[keyof Stats | 'intro_cards', Section]> = [
    ['components', 'components'],
    ['hanzi', 'hanzi'],
    ['words', 'words'],
    ['sentences', 'sentences'],
    ['patterns', 'patterns'],
    ['intro_cards', 'intro_cards'],
  ];

  sections.forEach(([field, section]) => validateOrderIndexes(pack.file, section, asArray(pack.data[field])));

  asArray(pack.data.components).forEach((item) => validateComponent(pack, item));
  asArray(pack.data.hanzi).forEach((item) => validateHanzi(pack, item, idRegistry));
  asArray(pack.data.words).forEach((item) => validateWordOrSentence(pack, 'words', item));
  asArray(pack.data.sentences).forEach((item) => validateWordOrSentence(pack, 'sentences', item));
  asArray(pack.data.patterns).forEach((item) => validatePattern(pack, item));
  asArray(pack.data.intro_cards).forEach((item) => validateIntroCard(pack, item));
}

function loadPacks() {
  if (!fs.existsSync(packsDir)) {
    addError('src/data/packs', 'file', `Packs directory does not exist: ${packsDir}`);
    return [];
  }

  const files = fs
    .readdirSync(packsDir)
    .filter((file) => /^pack_.*\.json$/i.test(file))
    .sort();

  if (files.length === 0) {
    addError('src/data/packs', 'file', 'No pack_*.json files found.');
    return [];
  }

  const loaded: LoadedPack[] = [];

  for (const file of files) {
    const filePath = path.join(packsDir, file);
    try {
      const raw = fs.readFileSync(filePath, 'utf8');
      const parsed = JSON.parse(raw);
      if (!isRecord(parsed)) {
        addError(file, 'file', 'JSON root must be an object.');
        continue;
      }

      const meta = asRecord(parsed.pack);
      const packId = typeof meta.id === 'string' ? meta.id : packIdFromFileName(file);
      const orderIndex = typeof meta.order_index === 'number' && Number.isFinite(meta.order_index) ? meta.order_index : null;
      loaded.push({ file, data: parsed, packId, orderIndex });
    } catch (error) {
      addError(file, 'file', `Could not parse JSON: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  return loaded;
}

function checkDuplicateIds(idRegistry: Map<string, IdEntry[]>) {
  for (const [id, entries] of idRegistry.entries()) {
    if (entries.length <= 1) continue;
    const locations = entries.map((entry) => `${entry.file}:${entry.type}`).join(', ');
    entries.forEach((entry) => {
      addError(entry.file, 'ids', `Duplicate id "${id}" also found in ${locations}.`, id);
    });
  }
}

function printIssues(title: string, groupedIssues: Issue[]) {
  if (groupedIssues.length === 0) return;

  console.log(`\n${title}`);
  const byFile = new Map<string, Issue[]>();
  groupedIssues.forEach((issue) => {
    const fileIssues = byFile.get(issue.file) ?? [];
    fileIssues.push(issue);
    byFile.set(issue.file, fileIssues);
  });

  for (const [file, fileIssues] of [...byFile.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    console.log(`\n${file}`);
    for (const issue of fileIssues) {
      const item = issue.itemId ? ` ${issue.itemId}` : '';
      console.log(`  - [${issue.section}]${item}: ${issue.message}`);
    }
  }
}

function run() {
  const packs = loadPacks();
  const packIds = new Map<string, string>();
  const orderIndexes = new Map<number, string>();
  const idRegistry = new Map<string, IdEntry[]>();
  const stats: Stats = { components: 0, hanzi: 0, words: 0, sentences: 0, patterns: 0 };

  packs.forEach((pack) => collectIds(pack, idRegistry));
  checkDuplicateIds(idRegistry);

  for (const pack of packs) {
    validateTopLevel(pack);
    validatePackMetadata(pack, packIds, orderIndexes);
    validateContentSummary(pack);
    validateItems(pack, idRegistry);
    validatePrerequisites(pack, idRegistry);

    stats.components += asArray(pack.data.components).length;
    stats.hanzi += asArray(pack.data.hanzi).length;
    stats.words += asArray(pack.data.words).length;
    stats.sentences += asArray(pack.data.sentences).length;
    stats.patterns += asArray(pack.data.patterns).length;
  }

  const errors = issues.filter((issue) => issue.severity === 'error');
  const warnings = issues.filter((issue) => issue.severity === 'warning');

  if (errors.length > 0) {
    console.log('❌ Pack validation failed');
    printIssues('Errors', errors);
    printIssues('Warnings', warnings);
    console.log(`\nValidated ${packs.length} packs`);
    console.log(`Components: ${stats.components}`);
    console.log(`Hanzi: ${stats.hanzi}`);
    console.log(`Words: ${stats.words}`);
    console.log(`Sentences: ${stats.sentences}`);
    console.log(`Patterns: ${stats.patterns}`);
    process.exit(1);
  }

  console.log('✅ Pack validation passed');
  console.log(`Validated ${packs.length} packs`);
  console.log(`Components: ${stats.components}`);
  console.log(`Hanzi: ${stats.hanzi}`);
  console.log(`Words: ${stats.words}`);
  console.log(`Sentences: ${stats.sentences}`);
  console.log(`Patterns: ${stats.patterns}`);
  printIssues('Warnings', warnings);
}

run();
