import { textFor, type AppLanguage } from '../i18n/copy';
import { rawContentPacks } from './packs';

export type SessionSize = 'Light' | 'Standard' | 'Intense';
export type ScriptChoice = 'Simplified' | 'Traditional' | 'Not sure';
export type Familiarity = 'beginner' | 'some';
export type PinyinDisplay = 'Always' | 'Lesson only' | 'Hidden in review' | 'Off';
export type ReviewStyle = 'Simple' | 'Mixed' | 'Typed';
export type Stage = 'Learning' | 'Familiar' | 'Strong' | 'Mastered' | 'Long-term';
export type ContentType = 'Hanzi' | 'Words' | 'Sentences' | 'Patterns';
export type LibraryTab = 'All' | 'Hanzi' | 'Words' | 'Sentences';

export interface ContentItem {
  id: string;
  packId: string;
  type: ContentType;
  stage: Stage;
  accuracy: number;
  title: string;
  titleId?: string;
  traditionalTitle?: string;
  pinyin: string[];
  tones: number[];
  meaning: string;
  meaningId?: string;
  audioUrl?: string;
  components: [string, string][];
  componentsId?: [string, string][];
  mnemonic: string;
  mnemonicId?: string;
  related: string[];
  example: [string, string, string];
  exampleId?: [string, string, string];
  nextReview: string;
  orderIndex: number;
  reviewable: boolean;
}

export interface StudyQuestion {
  modeLabel: string;
  prompt: string;
  answers: string[];
  correctAnswer: string;
  correctFeedback: string;
  wrongFeedback: string;
}

export interface StarterStudySession {
  sessionNumber: number;
  sessionIndex: number;
  packId: string;
  packLabel: string;
  introTitle: string;
  introDescription: string;
  dayGoal: string;
  learnItems: ContentItem[];
  reviewItems: ContentItem[];
  unlocks: ContentItem[];
}

export interface IntroStudyCard {
  id: string;
  title: string;
  titleId: string;
  body: string;
  bodyId: string;
  example: Record<string, unknown> | null;
  orderIndex: number;
}

export interface IntroStudySession {
  packId: string;
  packLabel: string;
  introTitle: string;
  introDescription: string;
  cards: IntroStudyCard[];
}

export interface PlacementQuestion {
  id: string;
  title: string;
  pinyin: string[];
  prompt: string;
  answers: string[];
  correctAnswer: string;
  skill: string;
}

interface RawPackInfo {
  id: string;
  title: string;
  title_id: string;
  subtitle: string;
  subtitle_id: string;
  level: number;
  theme: string;
  order_index: number;
  pack_type?: string;
  is_srs_enabled?: boolean;
  learning_goal: string;
  learning_goal_id: string;
  content_summary: {
    components: number;
    hanzi: number;
    words: number;
    sentences: number;
    patterns: number;
  };
}

interface RawSyllable {
  text: string;
  tone: number;
}

interface RawComponent {
  id: string;
  simplified: string;
  traditional: string;
  name?: string;
  name_id?: string;
  meaning: string;
  meaning_id: string;
  mnemonic?: string | null;
  mnemonic_id?: string | null;
  examples?: string[] | null;
  order_index: number;
}

interface RawLearningExample {
  simplified?: string;
  traditional?: string;
  pinyin?: string;
  meaning?: string;
  meaning_id?: string | null;
}

interface RawLearningItem {
  id: string;
  type: 'hanzi' | 'word' | 'sentence';
  simplified: string;
  traditional: string;
  meaning: string;
  meaning_id: string;
  pinyin: string;
  pinyin_syllables: RawSyllable[];
  tone_number?: number;
  tone_pattern?: string;
  components?: { id: string; character: string; meaning: string; meaning_id?: string | null }[] | null;
  hanzi_ids?: string[] | null;
  focus_word_ids?: string[] | null;
  pattern_ids?: string[] | null;
  mnemonic?: string | null;
  mnemonic_id?: string | null;
  tone_mnemonic?: string | null;
  tone_mnemonic_id?: string | null;
  tone_note?: string | null;
  tone_note_id?: string | null;
  usage_note?: string | null;
  usage_note_id?: string | null;
  literal_meaning?: string | null;
  literal_meaning_id?: string | null;
  notes?: string | null;
  notes_id?: string | null;
  audio_url?: string | null;
  examples?: Array<string | RawLearningExample> | null;
  order_index: number;
  is_reviewable: boolean;
  is_core_word?: boolean;
}

interface RawPatternExample {
  simplified: string;
  traditional: string;
  pinyin: string;
  meaning: string;
  meaning_id?: string | null;
}

interface RawPattern {
  id: string;
  type: 'pattern';
  title: string;
  title_id: string;
  meaning: string;
  meaning_id: string;
  structure: string;
  explanation: string;
  explanation_id: string;
  examples?: RawPatternExample[] | null;
  order_index: number;
  is_reviewable?: boolean;
}

interface RawPrerequisite {
  item_id: string;
  prerequisite_item_id: string;
}

interface RawStudyFlow {
  intro_only?: boolean;
  creates_srs_items?: boolean;
  new_items?: string[];
  quick_practice?: { item_id: string; question_type: string }[];
  unlock_items?: string[];
}

interface RawIntroCard {
  id: string;
  title: string;
  title_id: string;
  body: string;
  body_id: string;
  example: RawPatternExample | null;
  order_index: number;
}

interface RawContentPack {
  pack: RawPackInfo;
  components: RawComponent[];
  hanzi: RawLearningItem[];
  words: RawLearningItem[];
  sentences: RawLearningItem[];
  patterns: RawPattern[];
  item_prerequisites: RawPrerequisite[];
  study_flow: RawStudyFlow;
  intro_cards?: RawIntroCard[];
}

interface PackEntry {
  raw: RawContentPack;
  items: ContentItem[];
}

export const contentPacks = (rawContentPacks as RawContentPack[])
  .slice()
  .sort((a, b) => a.pack.order_index - b.pack.order_index);

export const introPack = contentPacks.find((pack) => pack.study_flow.intro_only);
export const standardPacks = contentPacks.filter((pack) => !pack.study_flow.intro_only && pack.pack.is_srs_enabled);
export const starterPack = standardPacks[0]?.pack ?? contentPacks[0].pack;

export const sessionPlans: Record<
  SessionSize,
  { newWords: number; reviews: number; minutes: number; duration: string; description: string }
> = {
  Light: {
    newWords: 3,
    reviews: 8,
    minutes: 5,
    duration: '~5 min',
    description: '~5 min - 3 new words - fewer reviews',
  },
  Standard: {
    newWords: 5,
    reviews: 12,
    minutes: 10,
    duration: '~10 min',
    description: '~10 min - 5 new words - balanced reviews',
  },
  Intense: {
    newWords: 8,
    reviews: 18,
    minutes: 15,
    duration: '~15 min',
    description: '~15 min - 8 new words - more reviews',
  },
};

export function sessionPlanDescription(size: SessionSize, language: AppLanguage = 'English') {
  const descriptions: Record<SessionSize, string> = {
    Light: textFor(language, '~5 min - 3 new words - fewer reviews', '~5 menit - 3 kata baru - review lebih sedikit'),
    Standard: textFor(
      language,
      '~10 min - 5 new words - balanced reviews',
      '~10 menit - 5 kata baru - review seimbang',
    ),
    Intense: textFor(language, '~15 min - 8 new words - more reviews', '~15 menit - 8 kata baru - review lebih banyak'),
  };

  return descriptions[size];
}

const stageOrder: Stage[] = ['Learning', 'Familiar', 'Strong', 'Mastered', 'Long-term'];
const stageColors: Record<Stage, string> = {
  Learning: 'var(--stage-learning)',
  Familiar: 'var(--stage-familiar)',
  Strong: 'var(--stage-strong)',
  Mastered: 'var(--stage-mastered)',
  'Long-term': 'var(--stage-longterm)',
};

const accuracyByStage: Record<Stage, number> = {
  Learning: 68,
  Familiar: 84,
  Strong: 92,
  Mastered: 97,
  'Long-term': 99,
};

const nextReviewByStage: Record<Stage, string> = {
  Learning: 'Today',
  Familiar: 'Tomorrow',
  Strong: 'In 3 days',
  Mastered: 'Next week',
  'Long-term': 'In 1 month',
};

function optionalText(value?: string | null) {
  return value ?? undefined;
}

function pinyinParts(pinyin?: string | null) {
  return (pinyin ?? '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function tonesFromSyllables(syllables: RawSyllable[] | null | undefined = []) {
  return (syllables ?? []).map((syllable) => syllable.tone);
}

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function uniqueRows(rows: [string, string][]) {
  const seen = new Set<string>();

  return rows.filter(([label, value]) => {
    const key = `${label}:${value}`;

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function stageForOrder(type: ContentType, orderIndex: number): Stage {
  if (type === 'Patterns') {
    return orderIndex <= 1 ? 'Learning' : 'Familiar';
  }

  if (orderIndex <= 2) {
    return 'Familiar';
  }

  if (orderIndex <= 4) {
    return 'Learning';
  }

  if (orderIndex <= 6) {
    return 'Strong';
  }

  return 'Learning';
}

const allComponents = contentPacks.flatMap((pack) => pack.components);
const allLearningRows = contentPacks.flatMap((pack) => [...pack.hanzi, ...pack.words, ...pack.sentences]);
const allPatterns = contentPacks.flatMap((pack) => pack.patterns);

const componentById = new Map(allComponents.map((item) => [item.id, item]));
const learningById = new Map(allLearningRows.map((item) => [item.id, item]));
const patternById = new Map(allPatterns.map((item) => [item.id, item]));
const hanziByCharacter = new Map(contentPacks.flatMap((pack) => pack.hanzi.map((item) => [item.simplified, item] as const)));
const sentenceByText = new Map(contentPacks.flatMap((pack) => pack.sentences.map((item) => [item.simplified, item] as const)));

function titleForId(id: string) {
  return componentById.get(id)?.simplified ?? learningById.get(id)?.simplified ?? patternById.get(id)?.title ?? id;
}

function meaningForId(id: string) {
  return componentById.get(id)?.meaning ?? learningById.get(id)?.meaning ?? patternById.get(id)?.meaning ?? 'Related';
}

function meaningIdForId(id: string) {
  return (
    componentById.get(id)?.meaning_id ??
    learningById.get(id)?.meaning_id ??
    patternById.get(id)?.meaning_id ??
    meaningForId(id)
  );
}

function prerequisiteRows(pack: RawContentPack, itemId: string): [string, string][] {
  return pack.item_prerequisites
    .filter((item) => item.item_id === itemId)
    .map((item) => [titleForId(item.prerequisite_item_id), meaningForId(item.prerequisite_item_id)] as [string, string]);
}

function prerequisiteRowsId(pack: RawContentPack, itemId: string): [string, string][] {
  return pack.item_prerequisites
    .filter((item) => item.item_id === itemId)
    .map((item) => [titleForId(item.prerequisite_item_id), meaningIdForId(item.prerequisite_item_id)] as [string, string]);
}

function characterRows(text: string): [string, string][] {
  return Array.from(text)
    .map((character) => {
      const hanzi = hanziByCharacter.get(character);
      return hanzi ? ([character, hanzi.meaning] as [string, string]) : null;
    })
    .filter((row): row is [string, string] => Boolean(row));
}

function characterRowsId(text: string): [string, string][] {
  return Array.from(text)
    .map((character) => {
      const hanzi = hanziByCharacter.get(character);
      return hanzi ? ([character, hanzi.meaning_id] as [string, string]) : null;
    })
    .filter((row): row is [string, string] => Boolean(row));
}

function componentRows(item: RawLearningItem): [string, string][] {
  const directRows = item.components?.map((component) => [component.character, component.meaning] as [string, string]) ?? [];
  const hanziRows =
    item.hanzi_ids
      ?.map((id) => {
        const row = learningById.get(id);
        return row ? ([row.simplified, row.meaning] as [string, string]) : null;
      })
      .filter((row): row is [string, string] => Boolean(row)) ?? [];
  const focusRows =
    item.focus_word_ids
      ?.map((id) => {
        const row = learningById.get(id);
        return row ? ([row.simplified, row.meaning] as [string, string]) : null;
      })
      .filter((row): row is [string, string] => Boolean(row)) ?? [];
  const patternRows =
    item.pattern_ids
      ?.map((id) => {
        const row = patternById.get(id);
        return row ? ([row.title, row.meaning] as [string, string]) : null;
      })
      .filter((row): row is [string, string] => Boolean(row)) ?? [];

  return uniqueRows([...directRows, ...hanziRows, ...focusRows, ...patternRows, ...characterRows(item.simplified)]).slice(0, 4);
}

function componentRowsId(item: RawLearningItem): [string, string][] {
  const directRows =
    item.components?.map((component) => [
      component.character,
      component.meaning_id ?? component.meaning,
    ] as [string, string]) ?? [];
  const hanziRows =
    item.hanzi_ids
      ?.map((id) => {
        const row = learningById.get(id);
        return row ? ([row.simplified, row.meaning_id] as [string, string]) : null;
      })
      .filter((row): row is [string, string] => Boolean(row)) ?? [];
  const focusRows =
    item.focus_word_ids
      ?.map((id) => {
        const row = learningById.get(id);
        return row ? ([row.simplified, row.meaning_id] as [string, string]) : null;
      })
      .filter((row): row is [string, string] => Boolean(row)) ?? [];
  const patternRows =
    item.pattern_ids
      ?.map((id) => {
        const row = patternById.get(id);
        return row ? ([row.title, row.meaning_id] as [string, string]) : null;
      })
      .filter((row): row is [string, string] => Boolean(row)) ?? [];

  return uniqueRows([...directRows, ...hanziRows, ...focusRows, ...patternRows, ...characterRowsId(item.simplified)]).slice(0, 4);
}

function firstExampleParts(item: RawLearningItem) {
  const firstExample = item.examples?.[0];

  if (typeof firstExample === 'string') {
    const matchingSentence = sentenceByText.get(firstExample);
    return {
      text: firstExample,
      pinyin: matchingSentence?.pinyin,
      meaning: matchingSentence?.meaning,
      meaningId: matchingSentence?.meaning_id,
    };
  }

  if (firstExample && typeof firstExample === 'object') {
    return {
      text: firstExample.simplified ?? item.simplified,
      pinyin: firstExample.pinyin,
      meaning: firstExample.meaning,
      meaningId: firstExample.meaning_id ?? undefined,
    };
  }

  return {
    text: item.simplified,
    pinyin: undefined,
    meaning: undefined,
    meaningId: undefined,
  };
}

function exampleForLearningItem(item: RawLearningItem): [string, string, string] {
  const example = firstExampleParts(item);

  return [
    example.text,
    example.pinyin ?? item.pinyin,
    example.meaning ?? item.meaning,
  ];
}

function exampleForLearningItemId(item: RawLearningItem): [string, string, string] {
  const example = firstExampleParts(item);

  return [
    example.text,
    example.pinyin ?? item.pinyin,
    example.meaningId ?? item.meaning_id,
  ];
}

function relatedForLearningItem(pack: RawContentPack, item: RawLearningItem) {
  const prerequisites = prerequisiteRows(pack, item.id).map(([label]) => label);
  const structuralIds = [...(item.hanzi_ids ?? []), ...(item.focus_word_ids ?? []), ...(item.pattern_ids ?? [])].map(titleForId);
  const exampleLabels =
    item.examples?.map((example) => (typeof example === 'string' ? example : example.simplified ?? example.meaning ?? '')).filter(Boolean) ?? [];

  return unique([...exampleLabels, ...structuralIds, ...prerequisites]).slice(0, 5);
}

function toLearningContentItem(pack: RawContentPack, item: RawLearningItem, type: ContentType): ContentItem {
  const stage = stageForOrder(type, item.order_index);
  const note = item.usage_note ?? item.tone_note ?? item.literal_meaning ?? item.notes;
  const noteId = item.usage_note_id ?? item.tone_note_id ?? item.literal_meaning_id ?? item.notes_id;

  return {
    id: item.id,
    packId: pack.pack.id,
    type,
    stage,
    accuracy: accuracyByStage[stage],
    title: item.simplified,
    traditionalTitle: item.traditional,
    pinyin: pinyinParts(item.pinyin),
    tones: tonesFromSyllables(item.pinyin_syllables),
    meaning: item.meaning,
    meaningId: optionalText(item.meaning_id),
    audioUrl: optionalText(item.audio_url),
    components: componentRows(item).length > 0 ? componentRows(item) : prerequisiteRows(pack, item.id),
    componentsId: componentRowsId(item).length > 0 ? componentRowsId(item) : prerequisiteRowsId(pack, item.id),
    mnemonic: item.mnemonic ?? note ?? `${item.simplified} means ${item.meaning}.`,
    mnemonicId: optionalText(item.mnemonic_id ?? noteId),
    related: relatedForLearningItem(pack, item),
    example: exampleForLearningItem(item),
    exampleId: exampleForLearningItemId(item),
    nextReview: nextReviewByStage[stage],
    orderIndex: item.order_index,
    reviewable: item.is_reviewable,
  };
}

function toPatternContentItem(pack: RawContentPack, item: RawPattern): ContentItem {
  const stage = stageForOrder('Patterns', item.order_index);
  const examples = item.examples ?? [];
  const example = examples[0];

  return {
    id: item.id,
    packId: pack.pack.id,
    type: 'Patterns',
    stage,
    accuracy: accuracyByStage[stage],
    title: item.title,
    titleId: item.title_id,
    pinyin: [item.structure],
    tones: [],
    meaning: item.meaning,
    meaningId: item.meaning_id,
    components: [[item.structure, item.explanation]],
    componentsId: [[item.structure, item.explanation_id]],
    mnemonic: item.explanation,
    mnemonicId: item.explanation_id,
    related: examples.map((patternExample) => patternExample.simplified),
    example: example
      ? [example.simplified, example.pinyin, example.meaning]
      : [item.structure, item.structure, item.meaning],
    exampleId: example
      ? [example.simplified, example.pinyin, example.meaning_id ?? example.meaning]
      : [item.structure, item.structure, item.meaning_id],
    nextReview: nextReviewByStage[stage],
    orderIndex: item.order_index,
    reviewable: item.is_reviewable ?? false,
  };
}

const packEntries: PackEntry[] = contentPacks.map((pack) => ({
  raw: pack,
  items: [
    ...pack.words.map((item) => toLearningContentItem(pack, item, 'Words')),
    ...pack.hanzi.map((item) => toLearningContentItem(pack, item, 'Hanzi')),
    ...pack.sentences.map((item) => toLearningContentItem(pack, item, 'Sentences')),
    ...pack.patterns.map((item) => toPatternContentItem(pack, item)),
  ],
}));

const standardPackEntries = packEntries.filter((entry) => standardPacks.some((pack) => pack.pack.id === entry.raw.pack.id));

export const contentItems: ContentItem[] = packEntries.flatMap((entry) => entry.items);

const contentItemById = new Map(contentItems.map((item) => [item.id, item]));
const wordItems = contentItems.filter((item) => item.type === 'Words');
const defaultAnswers: Record<AppLanguage, string[]> = {
  English: ['I / me', 'you', 'to be', 'to have', 'go', 'eat', 'big', 'like'],
  Indonesian: ['aku / saya', 'kamu', 'adalah', 'punya', 'pergi', 'makan', 'besar', 'suka'],
};

function takeCycled<T>(items: T[], count: number, startIndex = 0) {
  if (items.length === 0 || count <= 0) {
    return [];
  }

  return Array.from({ length: count }, (_, index) => items[(startIndex + index) % items.length]);
}

function takeUniqueCycled<T>(items: T[], count: number, startIndex = 0) {
  return takeCycled(items, Math.min(count, items.length), startIndex);
}

export function localizeContentItem(item: ContentItem, language: AppLanguage): ContentItem {
  return {
    ...item,
    title: textFor(language, item.title, item.titleId),
    meaning: textFor(language, item.meaning, item.meaningId),
    components: (item.componentsId ?? item.components).map(([label, value], index) => [
      label,
      textFor(language, item.components[index]?.[1] ?? value, value),
    ]),
    mnemonic: textFor(language, item.mnemonic, item.mnemonicId),
    example: item.exampleId
      ? [
          item.example[0],
          item.example[1],
          textFor(language, item.example[2], item.exampleId[2]),
        ]
      : item.example,
  };
}

function answerChoicesForItem(item: ContentItem, language: AppLanguage) {
  const localizedWords = wordItems.map((word) => localizeContentItem(word, language).meaning);
  const localizedItem = localizeContentItem(item, language);
  const fallbackOptions = defaultAnswers[language];
  const answerPool = unique([...localizedWords, ...fallbackOptions]);
  const wrongAnswers = answerPool.filter((answer) => answer !== localizedItem.meaning);
  const orderedAnswers = unique([localizedItem.meaning, ...wrongAnswers]).slice(0, 4);
  const fallbackAnswers = unique([...orderedAnswers, ...fallbackOptions]).slice(0, 4);
  const offset = fallbackAnswers.length > 0 ? item.id.length % fallbackAnswers.length : 0;

  return [...fallbackAnswers.slice(offset), ...fallbackAnswers.slice(0, offset)];
}

export function studyQuestionForItem(
  item: ContentItem,
  modeLabel: string,
  allowRetry: boolean,
  language: AppLanguage = 'English',
): StudyQuestion {
  const localizedItem = localizeContentItem(item, language);

  return {
    modeLabel,
    prompt: textFor(language, 'What does this mean?', 'Apa artinya?'),
    answers: answerChoicesForItem(item, language),
    correctAnswer: localizedItem.meaning,
    correctFeedback: textFor(
      language,
      `Correct. ${localizedItem.title} means ${localizedItem.meaning}.`,
      `Benar. ${localizedItem.title} berarti ${localizedItem.meaning}.`,
    ),
    wrongFeedback: allowRetry
      ? textFor(
          language,
          `Almost. Try again - ${localizedItem.title} means ${localizedItem.meaning}.`,
          `Hampir. Coba lagi - ${localizedItem.title} berarti ${localizedItem.meaning}.`,
        )
      : textFor(
          language,
          `Almost. ${localizedItem.title} means ${localizedItem.meaning}. We'll show it again sooner.`,
          `Hampir. ${localizedItem.title} berarti ${localizedItem.meaning}. Akan muncul lagi lebih cepat.`,
        ),
  };
}

function packForSession(sessionIndex: number) {
  if (standardPackEntries.length === 0) {
    return packEntries[0];
  }

  return standardPackEntries[sessionIndex % standardPackEntries.length];
}

export function sessionIndexForPackId(packId?: string | null) {
  if (!packId) {
    return 0;
  }

  const index = standardPackEntries.findIndex((entry) => entry.raw.pack.id === packId);
  return index >= 0 ? index : 0;
}

export function packIdForSessionIndex(sessionIndex = 0) {
  return packForSession(sessionIndex).raw.pack.id;
}

export function packLabelForSessionIndex(sessionIndex = 0, language: AppLanguage = 'English') {
  const packEntry = packForSession(sessionIndex);
  const activePackIndex = Math.max(0, standardPackEntries.findIndex((entry) => entry.raw.pack.id === packEntry.raw.pack.id));

  return textFor(
    language,
    `Pack ${activePackIndex + 1} - ${packEntry.raw.pack.title}`,
    `Paket ${activePackIndex + 1} - ${packEntry.raw.pack.title_id}`,
  );
}

function nearestExistingSessionIndex(targetPackNumber: number) {
  if (standardPackEntries.length === 0) {
    return 0;
  }

  const desiredIndex = Math.max(0, targetPackNumber - 1);
  return Math.min(desiredIndex, standardPackEntries.length - 1);
}

export function recommendedSessionIndexForPlacement(score: number, totalQuestions: number) {
  if (totalQuestions <= 0) {
    return 0;
  }

  const scaledScore = (score / totalQuestions) * 10;

  if (scaledScore <= 3) {
    return nearestExistingSessionIndex(1);
  }

  if (scaledScore <= 6) {
    return nearestExistingSessionIndex(3);
  }

  if (scaledScore <= 8) {
    return nearestExistingSessionIndex(5);
  }

  return nearestExistingSessionIndex(7);
}

function sessionCycle(sessionIndex: number) {
  return standardPackEntries.length === 0 ? 0 : Math.floor(sessionIndex / standardPackEntries.length);
}

export function getStarterStudySession(
  sessionSize: SessionSize,
  sessionIndex: number,
  language: AppLanguage = 'English',
): StarterStudySession {
  const plan = sessionPlans[sessionSize];
  const packEntry = packForSession(sessionIndex);
  const activePackIndex = Math.max(0, standardPackEntries.findIndex((entry) => entry.raw.pack.id === packEntry.raw.pack.id));
  const cycle = sessionCycle(sessionIndex);
  const plannedNewItems =
    packEntry.raw.study_flow.new_items
      ?.map((id) => contentItemById.get(id))
      .filter((item): item is ContentItem => Boolean(item)) ?? [];
  const packWords = packEntry.items.filter((item) => item.type === 'Words');
  const newPool = plannedNewItems.length > 0 ? plannedNewItems : packWords;
  const newWordCount = Math.min(plan.newWords, newPool.length);
  const learnItems = takeUniqueCycled(newPool, newWordCount, cycle * Math.max(newWordCount, 1));
  const learnIds = new Set(learnItems.map((item) => item.id));
  const availablePackIds = new Set(standardPackEntries.slice(0, activePackIndex + 1).map((entry) => entry.raw.pack.id));
  const reviewPool = contentItems.filter(
    (item) => availablePackIds.has(item.packId) && item.reviewable && item.type !== 'Patterns' && !learnIds.has(item.id),
  );
  const reviewItems = takeUniqueCycled(reviewPool, plan.reviews, sessionIndex * plan.reviews);
  const unlocks =
    packEntry.raw.study_flow.unlock_items
      ?.map((id) => contentItemById.get(id))
      .filter((item): item is ContentItem => Boolean(item))
      .slice(0, 3) ?? [];
  const fallbackUnlocks = packEntry.items.filter((item) => item.type === 'Sentences' || item.type === 'Patterns').slice(0, 3);
  const packNumber = activePackIndex + 1;

  return {
    sessionNumber: sessionIndex + 1,
    sessionIndex,
    packId: packEntry.raw.pack.id,
    packLabel: textFor(
      language,
      `Pack ${packNumber} - ${packEntry.raw.pack.title}`,
      `Paket ${packNumber} - ${packEntry.raw.pack.title_id}`,
    ),
    introTitle: textFor(
      language,
      `Session ${sessionIndex + 1}: ${packEntry.raw.pack.title}`,
      `Sesi ${sessionIndex + 1}: ${packEntry.raw.pack.title_id}`,
    ),
    introDescription: textFor(language, packEntry.raw.pack.subtitle, packEntry.raw.pack.subtitle_id),
    dayGoal: textFor(language, packEntry.raw.pack.learning_goal, packEntry.raw.pack.learning_goal_id),
    learnItems: learnItems.map((item) => localizeContentItem(item, language)),
    reviewItems: reviewItems.map((item) => localizeContentItem(item, language)),
    unlocks: (unlocks.length > 0 ? unlocks : fallbackUnlocks).map((item) => localizeContentItem(item, language)),
  };
}

export const starterStudySession = getStarterStudySession('Standard', 0);

export function getPlacementQuestions(language: AppLanguage = 'English'): PlacementQuestion[] {
  const localized = (id: string) => {
    const item = contentItemById.get(id);
    return item ? localizeContentItem(item, language) : null;
  };

  const wordNi = localized('word_ni');
  const wordWo = localized('word_wo');
  const wordYou = localized('word_you_have');
  const wordShi = localized('word_shi');
  const wordQu = localized('word_qu');
  const wordZai = localized('word_zai_location');
  const wordMa = localized('word_ma');
  const sentenceStatement = localized('sentence_wo_shi_wo');
  const sentenceQuestion = localized('sentence_ni_qu_ma');
  const questionParticle = localized('pattern_yes_no_ma');

  const questions: Array<PlacementQuestion | null> = [
    wordNi && {
      id: 'placement_basic_ni',
      title: wordNi.title,
      pinyin: wordNi.pinyin,
      prompt: textFor(language, 'What does this mean?', 'Apa artinya?'),
      answers: unique([wordNi.meaning, wordWo?.meaning, wordYou?.meaning, wordShi?.meaning].filter(Boolean) as string[]),
      correctAnswer: wordNi.meaning,
      skill: textFor(language, 'Basic meaning', 'Arti dasar'),
    },
    wordWo && {
      id: 'placement_pinyin_wo',
      title: wordWo.pinyin.join(' '),
      pinyin: [],
      prompt: textFor(language, 'Which Mandarin word matches this pinyin?', 'Kata Mandarin mana yang cocok dengan pinyin ini?'),
      answers: unique([wordWo.title, wordNi?.title, wordYou?.title, wordMa?.title].filter(Boolean) as string[]),
      correctAnswer: wordWo.title,
      skill: textFor(language, 'Pinyin recognition', 'Mengenali pinyin'),
    },
    wordYou && {
      id: 'placement_tone_you',
      title: wordYou.title,
      pinyin: wordYou.pinyin,
      prompt: textFor(language, 'Which tone pattern do you hear/read?', 'Pola nada mana yang kamu baca/dengar?'),
      answers: ['2', '3', '4', 'neutral'],
      correctAnswer: '3',
      skill: textFor(language, 'Tone recognition', 'Mengenali nada'),
    },
    sentenceStatement && {
      id: 'placement_sentence_hello',
      title: sentenceStatement.title,
      pinyin: sentenceStatement.pinyin,
      prompt: textFor(language, 'What does this short phrase mean?', 'Apa arti frasa singkat ini?'),
      answers: unique([
        sentenceStatement.meaning,
        textFor(language, 'thank you', 'terima kasih'),
        textFor(language, 'goodbye', 'selamat tinggal'),
        textFor(language, 'I am here', 'saya di sini'),
      ]),
      correctAnswer: sentenceStatement.meaning,
      skill: textFor(language, 'Phrase comprehension', 'Memahami frasa'),
    },
    wordShi && {
      id: 'placement_grammar_shi',
      title: textFor(language, 'I ___ a student.', 'Saya ___ murid.'),
      pinyin: [],
      prompt: textFor(language, 'Which Mandarin word works like “to be”?', 'Kata Mandarin mana yang berarti “adalah”?'),
      answers: unique([wordShi.meaning, wordQu?.meaning, wordZai?.meaning, wordMa?.meaning].filter(Boolean) as string[]),
      correctAnswer: wordShi.meaning,
      skill: textFor(language, 'Simple grammar', 'Grammar sederhana'),
    },
    wordMa && {
      id: 'placement_particle_ma',
      title: questionParticle?.title ?? '吗',
      pinyin: wordMa.pinyin,
      prompt: textFor(language, 'What does 吗 usually do at the end of a sentence?', 'Biasanya apa fungsi 吗 di akhir kalimat?'),
      answers: unique([
        textFor(language, 'turns it into a yes/no question', 'mengubahnya menjadi pertanyaan ya/tidak'),
        textFor(language, 'marks past tense', 'menandai bentuk lampau'),
        textFor(language, 'means very', 'berarti sangat'),
        textFor(language, 'shows possession', 'menunjukkan kepemilikan'),
      ]),
      correctAnswer: textFor(language, 'turns it into a yes/no question', 'mengubahnya menjadi pertanyaan ya/tidak'),
      skill: textFor(language, 'Particle usage', 'Penggunaan partikel'),
    },
    sentenceQuestion && {
      id: 'placement_sentence_question',
      title: sentenceQuestion.title,
      pinyin: sentenceQuestion.pinyin,
      prompt: textFor(language, 'What is the practical meaning?', 'Apa arti praktisnya?'),
      answers: unique([
        sentenceQuestion.meaning,
        textFor(language, 'Where are you going?', 'Kamu mau pergi ke mana?'),
        textFor(language, 'I have a question.', 'Saya punya pertanyaan.'),
        textFor(language, 'This is mine.', 'Ini punya saya.'),
      ]),
      correctAnswer: sentenceQuestion.meaning,
      skill: textFor(language, 'Practical phrase', 'Frasa praktis'),
    },
    wordQu && {
      id: 'placement_verb_qu',
      title: textFor(language, '我要___学校。', 'Saya mau ___ sekolah.'),
      pinyin: [],
      prompt: textFor(language, 'Which meaning best completes the sentence?', 'Arti mana yang paling cocok melengkapi kalimat?'),
      answers: unique([wordQu.meaning, wordShi?.meaning, wordYou?.meaning, wordMa?.meaning].filter(Boolean) as string[]),
      correctAnswer: wordQu.meaning,
      skill: textFor(language, 'Everyday action', 'Aksi sehari-hari'),
    },
  ];

  return questions.filter((question): question is PlacementQuestion => Boolean(question));
}

export function getIntroStudySession(language: AppLanguage = 'English'): IntroStudySession | null {
  if (!introPack) {
    return null;
  }

  return {
    packId: introPack.pack.id,
    packLabel: textFor(language, 'Pack 000 - Introduction', 'Paket 000 - Pengenalan'),
    introTitle: textFor(language, introPack.pack.title, introPack.pack.title_id),
    introDescription: textFor(language, introPack.pack.subtitle, introPack.pack.subtitle_id),
    cards: (introPack.intro_cards ?? [])
      .slice()
      .sort((a, b) => a.order_index - b.order_index)
      .map((card) => ({
        id: card.id,
        title: card.title,
        titleId: card.title_id,
        body: card.body,
        bodyId: card.body_id,
        example: card.example as Record<string, unknown> | null,
        orderIndex: card.order_index,
      })),
  };
}

export const starterStats = {
  streak: 0,
  accuracy: '0%',
  learnedWords: contentItems.filter((item) => item.type === 'Words').length,
  reviewsDone: 0,
} as const;

export function getCurrentFocus(language: AppLanguage = 'English', sessionIndex = 0) {
  const session = getStarterStudySession('Standard', sessionIndex, language);
  const focusItems = session.learnItems.length > 0 ? session.learnItems : contentItems.slice(0, 3);

  return focusItems.slice(0, 3).map((item) => item.meaning);
}

export const weeklyActivity = [
  { day: 'M', minutes: 0 },
  { day: 'T', minutes: 0 },
  { day: 'W', minutes: 0 },
  { day: 'T', minutes: 0 },
  { day: 'F', minutes: 0 },
  { day: 'S', minutes: 0 },
  { day: 'S', minutes: 0 },
];

const wordStageCounts = stageOrder.map((stage) => ({
  stage,
  count: contentItems.filter((item) => item.type === 'Words' && item.stage === stage).length,
}));

const maxWordCount = Math.max(...wordStageCounts.map((item) => item.count), 1);

export const wordStrength = wordStageCounts.map((item) => ({
  ...item,
  width: item.count === 0 ? 0 : Math.max(18, Math.round((item.count / maxWordCount) * 86)),
  color: stageColors[item.stage],
}));

export type IntroPathStatus = 'required' | 'optional' | 'completed' | 'skipped' | 'not_required';

export function getLearningPath(sessionIndex = 0, introStatus: IntroPathStatus = 'completed') {
  const currentPack = packForSession(sessionIndex).raw.pack;
  const introActive = introStatus === 'required' || introStatus === 'optional';

  return contentPacks.map((pack) => {
    const isIntro = pack.study_flow.intro_only;
    const isCurrent = !introActive && pack.pack.id === currentPack.id;
    const status = isIntro
      ? introStatus === 'skipped'
        ? 'skipped'
        : introActive
          ? 'current'
          : 'done'
      : isCurrent
        ? 'current'
        : pack.pack.order_index < currentPack.order_index
          ? 'done'
          : pack.pack.order_index === currentPack.order_index + 1
            ? 'available'
            : 'locked';
    const label =
      status === 'skipped'
        ? 'Skipped'
        : isIntro && status === 'current'
          ? 'Intro'
          : status === 'done'
            ? 'Done'
            : status === 'current'
              ? 'Now'
              : status === 'available'
                ? 'Available'
                : 'Locked';
    const icon = isIntro ? '入' : String(pack.pack.order_index);

    return {
      status,
      icon,
      title: pack.pack.title,
      titleId: pack.pack.title_id,
      description: pack.pack.subtitle,
      descriptionId: pack.pack.subtitle_id,
      label,
    };
  });
}

export const learningPath = getLearningPath(0);

export function typeLabel(type: ContentType, language: AppLanguage = 'English') {
  if (type === 'Words') {
    return textFor(language, 'Word', 'Kata');
  }

  if (type === 'Sentences') {
    return textFor(language, 'Sentence', 'Kalimat');
  }

  if (type === 'Patterns') {
    return textFor(language, 'Pattern', 'Pola');
  }

  return 'Hanzi';
}

export function effectiveScript(scriptChoice: ScriptChoice) {
  return scriptChoice === 'Not sure' ? 'Simplified' : scriptChoice;
}
