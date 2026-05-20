import { contentPacks } from '../data/mockContent';

export type QaStatus = 'unchecked' | 'ok' | 'needs_fix' | 'rejected';
export type AdminItemType = 'hanzi' | 'word' | 'sentence' | 'pattern';
export type AdminLanguageMode = 'en' | 'id' | 'both';
export type AutoIssueSeverity = 'warning' | 'error';

export interface QaReview {
  id: string;
  reviewer_id: string | null;
  pack_id: string;
  item_type: AdminItemType;
  item_id: string;
  status: QaStatus;
  note: string | null;
  created_at: string;
  updated_at: string;
}

export interface IssueReport {
  id: string;
  user_id: string | null;
  page: string | null;
  pack_id: string | null;
  item_type: string | null;
  item_id: string | null;
  message: string | null;
  metadata: Record<string, unknown> | null;
  status: 'open' | 'reviewing' | 'fixed' | 'rejected';
  admin_note: string | null;
  created_at: string;
  updated_at: string;
}

interface RawPack {
  pack: {
    id: string;
    title: string;
    title_id: string;
    subtitle?: string;
    subtitle_id?: string;
    order_index: number;
    is_srs_enabled?: boolean;
    pack_type?: string;
    content_summary?: {
      hanzi: number;
      words: number;
      sentences: number;
      patterns: number;
    };
  };
  hanzi: RawLearningItem[];
  words: RawLearningItem[];
  sentences: RawLearningItem[];
  patterns: RawPattern[];
  study_flow?: {
    intro_only?: boolean;
  };
}

interface RawSyllable {
  text?: string;
  tone?: number;
}

interface RawLearningItem {
  id?: string;
  type?: string;
  simplified?: string;
  traditional?: string;
  pinyin?: string;
  pinyin_syllables?: RawSyllable[];
  tone_number?: number;
  tone_pattern?: string;
  meaning?: string;
  meaning_id?: string;
  literal_meaning?: string | null;
  mnemonic?: string | null;
  mnemonic_id?: string | null;
  accepted_meanings?: string[];
  accepted_meanings_id?: string[];
  blocked_meanings?: string[];
  blocked_meanings_id?: string[];
  components?: Array<{ id?: string; character?: string; meaning?: string; meaning_id?: string | null }> | null;
  hanzi_ids?: string[] | null;
  focus_word_ids?: string[] | null;
  pattern_ids?: string[] | null;
  examples?: unknown[] | null;
  order_index?: number;
}

interface RawPattern {
  id?: string;
  type?: string;
  title?: string;
  title_id?: string;
  structure?: string;
  meaning?: string;
  meaning_id?: string;
  explanation?: string;
  explanation_id?: string;
  examples?: Array<{ simplified?: string; pinyin?: string; meaning?: string; meaning_id?: string | null }> | null;
  order_index?: number;
}

export interface AdminPackSummary {
  id: string;
  numberLabel: string;
  title: string;
  titleId: string;
  subtitle: string;
  subtitleId: string;
  orderIndex: number;
  isIntro: boolean;
  isSrsEnabled: boolean;
  counts: {
    hanzi: number;
    words: number;
    sentences: number;
    patterns: number;
  };
  items: AdminPackItem[];
  autoIssues: AutoIssue[];
}

export interface AdminPackItem {
  packId: string;
  type: AdminItemType;
  id: string;
  content: string;
  pinyin: string;
  tone: string;
  meaningEn: string;
  meaningId: string;
  literal: string;
  components: string;
  mnemonic: string;
  mnemonicId: string;
  pattern: string;
  breakdown: string;
  examples: string;
  raw: RawLearningItem | RawPattern;
  autoIssues: AutoIssue[];
}

export interface AutoIssue {
  packId: string;
  itemType: AdminItemType;
  itemId: string;
  itemLabel: string;
  issue: string;
  severity: AutoIssueSeverity;
}

export const qaStatuses: QaStatus[] = ['unchecked', 'ok', 'needs_fix', 'rejected'];

export function qaStatusLabel(status: QaStatus) {
  if (status === 'ok') return 'OK';
  if (status === 'needs_fix') return 'Needs Fix';
  if (status === 'rejected') return 'Rejected';
  return 'Unchecked';
}

function packNumberLabel(orderIndex: number) {
  return orderIndex === 0 ? '000' : String(orderIndex).padStart(3, '0');
}

function safeText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function syllableTonePattern(item: RawLearningItem) {
  return (item.pinyin_syllables ?? []).map((syllable) => syllable.tone ?? '?').join(' ');
}

function componentsText(item: RawLearningItem) {
  const direct = item.components?.map((component) => `${component.character ?? component.id ?? ''} ${component.meaning ?? ''}`.trim()) ?? [];
  const refs = [...(item.hanzi_ids ?? []), ...(item.focus_word_ids ?? []), ...(item.pattern_ids ?? [])];
  return [...direct, ...refs].filter(Boolean).join(' · ');
}

function exampleText(item: RawPattern) {
  return (item.examples ?? [])
    .map((example) => [example.simplified, example.pinyin, example.meaning].filter(Boolean).join(' / '))
    .join(' · ');
}

function readableExampleText(example: unknown) {
  if (typeof example === 'string') return example;
  if (!example || typeof example !== 'object') return '';
  const value = example as Record<string, unknown>;
  return [
    safeText(value.simplified) || safeText(value.traditional),
    safeText(value.pinyin),
    safeText(value.meaning) || safeText(value.meaning_en) || safeText(value.translation),
    safeText(value.meaning_id) || safeText(value.translation_id),
  ]
    .filter(Boolean)
    .join(' / ');
}

function readableExamplesText(examples: unknown[] | null | undefined) {
  return (examples ?? []).map(readableExampleText).filter(Boolean).join(' · ');
}

function addIssue(issues: AutoIssue[], item: AdminPackItem, issue: string, severity: AutoIssueSeverity = 'warning') {
  issues.push({
    packId: item.packId,
    itemType: item.type,
    itemId: item.id || '(missing id)',
    itemLabel: item.content || item.id || '(blank item)',
    issue,
    severity,
  });
}

function validateItem(item: AdminPackItem, packScopedIds: Set<string>) {
  const issues: AutoIssue[] = [];

  if (!item.id) addIssue(issues, item, 'Missing item_id', 'error');
  if (item.id && packScopedIds.has(`${item.type}:${item.id}`)) addIssue(issues, item, 'Duplicate item within pack', 'error');
  packScopedIds.add(`${item.type}:${item.id}`);

  if (item.type !== 'pattern') {
    const raw = item.raw as RawLearningItem;
    if (!safeText(raw.pinyin)) addIssue(issues, item, 'Missing pinyin', 'error');
    if (!Array.isArray(raw.pinyin_syllables) || raw.pinyin_syllables.length === 0) {
      addIssue(issues, item, 'Missing pinyin_syllables', 'error');
    }
    if (!item.meaningEn) addIssue(issues, item, 'Missing meaning_en', 'error');
    if (!item.meaningId) addIssue(issues, item, 'Missing meaning_id', 'error');
    if (!item.mnemonic) addIssue(issues, item, 'Missing mnemonic');
    if (item.mnemonic && !item.mnemonicId) addIssue(issues, item, 'Missing mnemonic_id');
    if (!Array.isArray(raw.accepted_meanings) || raw.accepted_meanings.length === 0) {
      addIssue(issues, item, 'Missing accepted meanings');
    }
    const syllableTone = raw.pinyin_syllables?.[0]?.tone;
    if (item.type === 'hanzi' && typeof raw.tone_number === 'number' && typeof syllableTone === 'number' && raw.tone_number !== syllableTone) {
      addIssue(issues, item, 'Tone mismatch between tone_number and pinyin_syllables', 'error');
    }
    if (item.type === 'sentence' && !item.breakdown) {
      addIssue(issues, item, 'Sentence missing breakdown');
    }
  }

  if (item.type === 'pattern') {
    const raw = item.raw as RawPattern;
    if (!item.meaningEn) addIssue(issues, item, 'Missing meaning_en', 'error');
    if (!item.meaningId) addIssue(issues, item, 'Missing meaning_id', 'error');
    if (!safeText(raw.explanation)) addIssue(issues, item, 'Missing explanation');
    if (safeText(raw.explanation) && !safeText(raw.explanation_id)) addIssue(issues, item, 'Missing explanation_id');
    if (!Array.isArray(raw.examples) || raw.examples.length === 0) {
      addIssue(issues, item, 'Pattern missing examples', 'error');
    }
  }

  return issues;
}

function learningItem(packId: string, type: AdminItemType, raw: RawLearningItem): AdminPackItem {
  return {
    packId,
    type,
    id: safeText(raw.id),
    content: safeText(raw.simplified),
    pinyin: safeText(raw.pinyin),
    tone: type === 'hanzi' ? String(raw.tone_number ?? '') : safeText(raw.tone_pattern) || syllableTonePattern(raw),
    meaningEn: safeText(raw.meaning),
    meaningId: safeText(raw.meaning_id),
    literal: safeText(raw.literal_meaning),
    components: componentsText(raw),
    mnemonic: safeText(raw.mnemonic),
    mnemonicId: safeText(raw.mnemonic_id),
    pattern: (raw.pattern_ids ?? []).join(' · '),
    breakdown: componentsText(raw),
    examples: readableExamplesText(raw.examples),
    raw,
    autoIssues: [],
  };
}

function patternItem(packId: string, raw: RawPattern): AdminPackItem {
  return {
    packId,
    type: 'pattern',
    id: safeText(raw.id),
    content: safeText(raw.title),
    pinyin: safeText(raw.structure),
    tone: '',
    meaningEn: safeText(raw.meaning),
    meaningId: safeText(raw.meaning_id),
    literal: '',
    components: '',
    mnemonic: safeText(raw.explanation),
    mnemonicId: safeText(raw.explanation_id),
    pattern: safeText(raw.structure),
    breakdown: safeText(raw.explanation),
    examples: exampleText(raw),
    raw,
    autoIssues: [],
  };
}

export function getAdminPacks(): AdminPackSummary[] {
  return (contentPacks as RawPack[]).map((pack) => {
    const packId = pack.pack.id;
    const items = [
      ...pack.hanzi.map((item) => learningItem(packId, 'hanzi', item)),
      ...pack.words.map((item) => learningItem(packId, 'word', item)),
      ...pack.sentences.map((item) => learningItem(packId, 'sentence', item)),
      ...pack.patterns.map((item) => patternItem(packId, item)),
    ];
    const seen = new Set<string>();
    const allIssues: AutoIssue[] = [];

    for (const item of items) {
      item.autoIssues = validateItem(item, seen);
      allIssues.push(...item.autoIssues);
    }

    return {
      id: packId,
      numberLabel: packNumberLabel(pack.pack.order_index),
      title: pack.pack.title,
      titleId: pack.pack.title_id,
      subtitle: pack.pack.subtitle ?? '',
      subtitleId: pack.pack.subtitle_id ?? '',
      orderIndex: pack.pack.order_index,
      isIntro: pack.study_flow?.intro_only === true || pack.pack.order_index === 0,
      isSrsEnabled: pack.pack.is_srs_enabled === true,
      counts: {
        hanzi: pack.hanzi.length,
        words: pack.words.length,
        sentences: pack.sentences.length,
        patterns: pack.patterns.length,
      },
      items,
      autoIssues: allIssues,
    };
  });
}

export function reviewKey(item: Pick<AdminPackItem, 'packId' | 'type' | 'id'>) {
  return `${item.packId}:${item.type}:${item.id}`;
}

export function reviewMap(reviews: QaReview[]) {
  return new Map(reviews.map((review) => [`${review.pack_id}:${review.item_type}:${review.item_id}`, review]));
}

export function statusForItem(item: AdminPackItem, reviews: Map<string, QaReview>): QaStatus {
  return reviews.get(reviewKey(item))?.status ?? 'unchecked';
}

export function noteForItem(item: AdminPackItem, reviews: Map<string, QaReview>) {
  return reviews.get(reviewKey(item))?.note ?? '';
}

export function csvEscape(value: unknown) {
  const text = String(value ?? '');
  return `"${text.replace(/"/g, '""')}"`;
}

export function csvDate() {
  return new Date().toISOString().slice(0, 10);
}
