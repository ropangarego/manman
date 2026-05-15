import starterPackJson from './packs/pack_001_foundations_greetings_prototype_id.json';
import { textFor, type AppLanguage } from '../i18n/copy';

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
  type: ContentType;
  stage: Stage;
  accuracy: number;
  title: string;
  titleId?: string;
  pinyin: string[];
  tones: number[];
  meaning: string;
  meaningId?: string;
  components: [string, string][];
  componentsId?: [string, string][];
  mnemonic: string;
  mnemonicId?: string;
  related: string[];
  example: [string, string, string];
  exampleId?: [string, string, string];
  nextReview: string;
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
  packLabel: string;
  introTitle: string;
  introDescription: string;
  dayGoal: string;
  learnItems: ContentItem[];
  reviewItems: ContentItem[];
  unlocks: ContentItem[];
}

export interface PlacementQuestion {
  id: string;
  title: string;
  pinyin: string[];
  prompt: string;
  answers: string[];
  correctAnswer: string;
}

interface RawPackInfo {
  id: string;
  title: string;
  title_id: string;
  subtitle: string;
  subtitle_id: string;
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
  meaning: string;
  meaning_id: string;
  mnemonic_id: string;
  examples: string[];
  order_index: number;
}

interface RawComponentReference {
  id: string;
  character: string;
  meaning: string;
  meaning_id: string;
}

interface RawLearningItem {
  id: string;
  simplified: string;
  traditional: string;
  meaning: string;
  meaning_id?: string;
  pinyin: string;
  pinyin_syllables: RawSyllable[];
  components?: RawComponentReference[];
  mnemonic_id?: string;
  examples?: string[];
  notes_id?: string;
  order_index: number;
}

interface RawPatternExample {
  simplified: string;
  traditional: string;
  pinyin: string;
  meaning: string;
  meaning_id: string;
}

interface RawPattern {
  id: string;
  title: string;
  title_id: string;
  meaning: string;
  meaning_id: string;
  structure: string;
  explanation: string;
  explanation_id: string;
  examples: RawPatternExample[];
  order_index: number;
}

interface RawPrerequisite {
  item_id: string;
  prerequisite_item_id: string;
}

interface StarterPackData {
  pack: RawPackInfo;
  components: RawComponent[];
  hanzi: RawLearningItem[];
  words: RawLearningItem[];
  sentences: RawLearningItem[];
  patterns: RawPattern[];
  item_prerequisites: RawPrerequisite[];
  study_flow: Record<string, { focus: string[]; goal_id: string }>;
}

const starterPackData = starterPackJson as StarterPackData;

export const starterPack = starterPackData.pack;

export const sessionPlans: Record<
  SessionSize,
  { newWords: number; reviews: number; minutes: number; duration: string; description: string }
> = {
  Light: {
    newWords: 3,
    reviews: 8,
    minutes: 5,
    duration: '~5 min',
    description: '~5 min Â· 3 new words Â· fewer reviews',
  },
  Standard: {
    newWords: 5,
    reviews: 12,
    minutes: 10,
    duration: '~10 min',
    description: '~10 min Â· 5 new words Â· balanced reviews',
  },
  Intense: {
    newWords: 8,
    reviews: 18,
    minutes: 15,
    duration: '~15 min',
    description: '~15 min Â· 8 new words Â· more reviews',
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

const hanziByCharacter = new Map(starterPackData.hanzi.map((item) => [item.simplified, item]));
const sentencesByCharacter = new Map(starterPackData.sentences.map((item) => [item.simplified, item]));

const titleById = new Map<string, string>([
  ...starterPackData.components.map((item) => [item.id, item.simplified] as const),
  ...starterPackData.hanzi.map((item) => [item.id, item.simplified] as const),
  ...starterPackData.words.map((item) => [item.id, item.simplified] as const),
  ...starterPackData.sentences.map((item) => [item.id, item.simplified] as const),
  ...starterPackData.patterns.map((item) => [item.id, item.title] as const),
]);

const meaningById = new Map<string, string>([
  ...starterPackData.components.map((item) => [item.id, item.meaning] as const),
  ...starterPackData.hanzi.map((item) => [item.id, item.meaning] as const),
  ...starterPackData.words.map((item) => [item.id, item.meaning] as const),
  ...starterPackData.sentences.map((item) => [item.id, item.meaning] as const),
  ...starterPackData.patterns.map((item) => [item.id, item.meaning] as const),
]);

const meaningIdById = new Map<string, string>([
  ...starterPackData.components.map((item) => [item.id, item.meaning_id] as const),
  ...starterPackData.hanzi.map((item) => [item.id, item.meaning_id ?? item.meaning] as const),
  ...starterPackData.words.map((item) => [item.id, item.meaning_id ?? item.meaning] as const),
  ...starterPackData.sentences.map((item) => [item.id, item.meaning_id ?? item.meaning] as const),
  ...starterPackData.patterns.map((item) => [item.id, item.meaning_id] as const),
]);

function stageForOrder(type: ContentType, orderIndex: number): Stage {
  if (type === 'Patterns') {
    return orderIndex <= 2 ? 'Learning' : 'Familiar';
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

function pinyinParts(pinyin: string) {
  return pinyin
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function tonesFromSyllables(syllables: RawSyllable[] = []) {
  return syllables.map((syllable) => syllable.tone);
}

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function prerequisiteRows(itemId: string): [string, string][] {
  return starterPackData.item_prerequisites
    .filter((item) => item.item_id === itemId)
    .map((item) => [
      titleById.get(item.prerequisite_item_id) ?? item.prerequisite_item_id,
      meaningById.get(item.prerequisite_item_id) ?? 'Prerequisite',
    ] as [string, string]);
}

function prerequisiteRowsId(itemId: string): [string, string][] {
  return starterPackData.item_prerequisites
    .filter((item) => item.item_id === itemId)
    .map((item) => [
      titleById.get(item.prerequisite_item_id) ?? item.prerequisite_item_id,
      meaningIdById.get(item.prerequisite_item_id) ??
        meaningById.get(item.prerequisite_item_id) ??
        'Prasyarat',
    ] as [string, string]);
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
      return hanzi ? ([character, hanzi.meaning_id ?? hanzi.meaning] as [string, string]) : null;
    })
    .filter((row): row is [string, string] => Boolean(row));
}

function componentsForItem(item: RawLearningItem): [string, string][] {
  const directComponents =
    item.components?.map((component) => [component.character, component.meaning] as [string, string]) ?? [];
  const prerequisites = prerequisiteRows(item.id);
  const characters = characterRows(item.simplified);

  return uniqueRows([...directComponents, ...prerequisites, ...characters]).slice(0, 4);
}

function componentsForItemId(item: RawLearningItem): [string, string][] {
  const directComponents =
    item.components?.map((component) => [
      component.character,
      component.meaning_id ?? component.meaning,
    ] as [string, string]) ?? [];
  const prerequisites = prerequisiteRowsId(item.id);
  const characters = characterRowsId(item.simplified);

  return uniqueRows([...directComponents, ...prerequisites, ...characters]).slice(0, 4);
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

function exampleForLearningItem(item: RawLearningItem): [string, string, string] {
  const exampleText = item.examples?.[0] ?? item.simplified;
  const matchingSentence = sentencesByCharacter.get(exampleText);

  return [
    exampleText,
    matchingSentence?.pinyin ?? item.pinyin,
    matchingSentence?.meaning ?? item.meaning,
  ];
}

function exampleForLearningItemId(item: RawLearningItem): [string, string, string] {
  const exampleText = item.examples?.[0] ?? item.simplified;
  const matchingSentence = sentencesByCharacter.get(exampleText);

  return [
    exampleText,
    matchingSentence?.pinyin ?? item.pinyin,
    matchingSentence?.meaning_id ?? item.meaning_id ?? item.meaning,
  ];
}

function relatedForLearningItem(item: RawLearningItem) {
  const prerequisites = prerequisiteRows(item.id).map(([label]) => label);
  return unique([...(item.examples ?? []), ...prerequisites]).slice(0, 5);
}

function toLearningContentItem(item: RawLearningItem, type: ContentType): ContentItem {
  const stage = stageForOrder(type, item.order_index);

  return {
    id: item.id,
    type,
    stage,
    accuracy: accuracyByStage[stage],
    title: item.simplified,
    pinyin: pinyinParts(item.pinyin),
    tones: tonesFromSyllables(item.pinyin_syllables),
    meaning: item.meaning,
    meaningId: item.meaning_id,
    components: componentsForItem(item),
    componentsId: componentsForItemId(item),
    mnemonic: `${item.simplified} means ${item.meaning}.`,
    mnemonicId: item.mnemonic_id ?? item.notes_id,
    related: relatedForLearningItem(item),
    example: exampleForLearningItem(item),
    exampleId: exampleForLearningItemId(item),
    nextReview: nextReviewByStage[stage],
  };
}

function toPatternContentItem(item: RawPattern): ContentItem {
  const stage = stageForOrder('Patterns', item.order_index);
  const example = item.examples[0];

  return {
    id: item.id,
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
    related: item.examples.map((patternExample) => patternExample.simplified),
    example: example
      ? [example.simplified, example.pinyin, example.meaning]
      : [item.structure, item.structure, item.meaning],
    exampleId: example
      ? [example.simplified, example.pinyin, example.meaning_id]
      : [item.structure, item.structure, item.meaning_id],
    nextReview: nextReviewByStage[stage],
  };
}

export const contentItems: ContentItem[] = [
  ...starterPackData.words.map((item) => toLearningContentItem(item, 'Words')),
  ...starterPackData.hanzi.map((item) => toLearningContentItem(item, 'Hanzi')),
  ...starterPackData.sentences.map((item) => toLearningContentItem(item, 'Sentences')),
  ...starterPackData.patterns.map(toPatternContentItem),
];

const wordItems = contentItems.filter((item) => item.type === 'Words');
const reviewSourceItems = contentItems.filter((item) => item.type !== 'Patterns');
const defaultAnswers: Record<AppLanguage, string[]> = {
  English: ['hello', 'thank you', 'goodbye', 'sorry'],
  Indonesian: ['halo', 'terima kasih', 'sampai jumpa', 'maaf'],
};

function takeCycled<T>(items: T[], count: number, startIndex = 0) {
  if (items.length === 0 || count <= 0) {
    return [];
  }

  return Array.from({ length: count }, (_, index) => items[(startIndex + index) % items.length]);
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
  const offset = item.id.length % fallbackAnswers.length;

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

export function getStarterStudySession(
  sessionSize: SessionSize,
  sessionIndex: number,
  language: AppLanguage = 'English',
): StarterStudySession {
  const plan = sessionPlans[sessionSize];
  const learnPool = wordItems.length > 0 ? wordItems : contentItems;
  const newWordCount = Math.min(plan.newWords, learnPool.length);
  const learnStart = sessionIndex * newWordCount;
  const learnItems = takeCycled(learnPool, newWordCount, learnStart);
  const learnIds = new Set(learnItems.map((item) => item.id));
  const reviewPool = reviewSourceItems.filter((item) => !learnIds.has(item.id));
  const reviewItems = takeCycled(
    reviewPool.length > 0 ? reviewPool : reviewSourceItems,
    plan.reviews,
    sessionIndex * plan.reviews,
  );
  const reviewIds = new Set(reviewItems.map((item) => item.id));
  const unlockPool = contentItems.filter((item) => !learnIds.has(item.id) && !reviewIds.has(item.id));
  const unlocks = takeCycled(unlockPool.length > 0 ? unlockPool : contentItems, 2, learnStart + newWordCount);

  return {
    sessionNumber: sessionIndex + 1,
    packLabel: textFor(language, `Pack 1 - ${starterPack.title}`, `Pack 1 - ${starterPack.title_id}`),
    introTitle: textFor(
      language,
      `Session ${sessionIndex + 1}: learn, practice, then review.`,
      `Sesi ${sessionIndex + 1}: belajar, latihan, lalu review.`,
    ),
    introDescription: textFor(language, starterPack.subtitle, starterPack.subtitle_id),
    dayGoal: starterPackData.study_flow.day_1.goal_id,
    learnItems: learnItems.map((item) => localizeContentItem(item, language)),
    reviewItems: reviewItems.map((item) => localizeContentItem(item, language)),
    unlocks: unlocks.map((item) => localizeContentItem(item, language)),
  };
}

export const starterStudySession = getStarterStudySession('Standard', 0);

const placementSourceIds = ['word_nihao', 'word_xiexie', 'word_zaijian', 'word_duibuqi', 'word_hao_ma'];

export function getPlacementQuestions(language: AppLanguage = 'English'): PlacementQuestion[] {
  return placementSourceIds
    .map((id) => contentItems.find((item) => item.id === id))
    .filter((item): item is ContentItem => Boolean(item))
    .map((item) => {
      const localizedItem = localizeContentItem(item, language);

      return {
        id: item.id,
        title: localizedItem.title,
        pinyin: localizedItem.pinyin,
        prompt: textFor(language, 'What does this mean?', 'Apa artinya?'),
        answers: answerChoicesForItem(item, language),
        correctAnswer: localizedItem.meaning,
      };
    });
}

export const starterStats = {
  streak: 3,
  accuracy: '87%',
  learnedWords: starterPack.content_summary.words,
  reviewsDone: 42,
} as const;

export function getCurrentFocus(language: AppLanguage = 'English') {
  return [
    textFor(language, '3rd tone', 'Nada ke-3'),
    textFor(language, 'Greetings', 'Sapaan'),
    textFor(language, 'ma questions', 'Pertanyaan ma'),
  ];
}

export const weeklyActivity = [
  { day: 'M', minutes: 10 },
  { day: 'T', minutes: 15 },
  { day: 'W', minutes: 12 },
  { day: 'T', minutes: 18 },
  { day: 'F', minutes: 10 },
  { day: 'S', minutes: 20 },
  { day: 'S', minutes: 14 },
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

export const learningPath = [
  {
    status: 'done',
    icon: '部',
    title: 'Components',
    titleId: 'Komponen',
    description: `${starterPack.content_summary.components} greeting building blocks`,
    descriptionId: `${starterPack.content_summary.components} blok pembentuk sapaan`,
    label: 'Done',
  },
  {
    status: 'current',
    icon: '字',
    title: 'Hanzi',
    titleId: 'Hanzi',
    description: `${starterPack.content_summary.hanzi} characters for starter greetings`,
    descriptionId: `${starterPack.content_summary.hanzi} karakter untuk sapaan awal`,
    label: 'Now',
  },
  {
    status: 'available',
    icon: '词',
    title: 'Words',
    titleId: 'Kata',
    description: `${starterPack.content_summary.words} practical greetings and replies`,
    descriptionId: `${starterPack.content_summary.words} sapaan dan balasan praktis`,
    label: 'Available',
  },
  {
    status: 'locked',
    icon: '句',
    title: 'Sentences',
    titleId: 'Kalimat',
    description: `${starterPack.content_summary.sentences} examples unlock after words strengthen`,
    descriptionId: `${starterPack.content_summary.sentences} contoh terbuka setelah kata menguat`,
    label: 'Locked',
  },
  {
    status: 'locked',
    icon: '法',
    title: 'Patterns',
    titleId: 'Pola',
    description: `${starterPack.content_summary.patterns} greeting patterns later`,
    descriptionId: `${starterPack.content_summary.patterns} pola sapaan nanti`,
    label: 'Locked',
  },
] as const;

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
