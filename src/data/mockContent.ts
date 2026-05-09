export type SessionSize = 'Light' | 'Standard' | 'Intense';
export type ScriptChoice = 'Simplified' | 'Traditional' | 'Not sure';
export type Familiarity = 'beginner' | 'some';
export type PinyinDisplay = 'Always' | 'Lesson only' | 'Hidden in review';
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
  pinyin: string[];
  tones: number[];
  meaning: string;
  components: [string, string][];
  mnemonic: string;
  related: string[];
  example: [string, string, string];
  nextReview: string;
}

export const sessionPlans: Record<
  SessionSize,
  { newWords: number; reviews: number; duration: string; description: string }
> = {
  Light: {
    newWords: 3,
    reviews: 8,
    duration: '~5 min',
    description: '~5 min · 3 new words · fewer reviews',
  },
  Standard: {
    newWords: 5,
    reviews: 12,
    duration: '~10 min',
    description: '~10 min · 5 new words · balanced reviews',
  },
  Intense: {
    newWords: 8,
    reviews: 18,
    duration: '~15 min',
    description: '~15 min · 8 new words · more reviews',
  },
};

export const contentItems: ContentItem[] = [
  {
    id: 'nihao',
    type: 'Words',
    stage: 'Familiar',
    accuracy: 87,
    title: '你好',
    pinyin: ['nǐ', 'hǎo'],
    tones: [3, 3],
    meaning: 'hello',
    components: [
      ['你', 'you'],
      ['好', 'good'],
    ],
    mnemonic: '“You good?” becomes a friendly hello.',
    related: ['你好吗？', '你好啊', '好'],
    example: ['你好！', 'Nǐ hǎo!', 'Hello!'],
    nextReview: 'Tomorrow',
  },
  {
    id: 'jia',
    type: 'Hanzi',
    stage: 'Familiar',
    accuracy: 82,
    title: '家',
    pinyin: ['jiā'],
    tones: [1],
    meaning: 'home / family',
    components: [
      ['宀', 'roof'],
      ['豕', 'pig'],
    ],
    mnemonic: 'A roof over a pig means a home.',
    related: ['家人', '回家', '大家'],
    example: ['我回家了。', 'Wǒ huí jiā le.', 'I went home.'],
    nextReview: 'Tomorrow',
  },
  {
    id: 'huijia',
    type: 'Words',
    stage: 'Strong',
    accuracy: 91,
    title: '回家',
    pinyin: ['huí', 'jiā'],
    tones: [2, 1],
    meaning: 'go home',
    components: [
      ['回', 'return'],
      ['家', 'home'],
    ],
    mnemonic: 'Return + home = go home.',
    related: ['家', '回去', '回来了'],
    example: ['我回家了。', 'Wǒ huí jiā le.', 'I went home.'],
    nextReview: 'In 3 days',
  },
  {
    id: 'sentence-home',
    type: 'Sentences',
    stage: 'Learning',
    accuracy: 74,
    title: '我回家了。',
    pinyin: ['Wǒ', 'huí', 'jiā', 'le'],
    tones: [3, 2, 1, 0],
    meaning: 'I went home.',
    components: [
      ['我', 'I'],
      ['回家', 'go home'],
      ['了', 'completed/change marker'],
    ],
    mnemonic: 'I + go home + 了 = the going-home action is done.',
    related: ['Subject + Verb + 了', '回家'],
    example: ['我回家了。', 'Wǒ huí jiā le.', 'I went home.'],
    nextReview: 'Later today',
  },
  {
    id: 'ma',
    type: 'Hanzi',
    stage: 'Learning',
    accuracy: 68,
    title: '吗',
    pinyin: ['ma'],
    tones: [0],
    meaning: 'question particle',
    components: [
      ['口', 'mouth'],
      ['马', 'sound hint'],
    ],
    mnemonic: 'A mouth particle turns a statement into a question.',
    related: ['好吗', '你好吗？'],
    example: ['你好吗？', 'Nǐ hǎo ma?', 'How are you?'],
    nextReview: 'Today',
  },
  {
    id: 'pattern-le',
    type: 'Patterns',
    stage: 'Learning',
    accuracy: 72,
    title: 'Subject + Verb + 了',
    pinyin: ['le'],
    tones: [0],
    meaning: 'completed action / changed situation',
    components: [
      ['Subject', 'who'],
      ['Verb', 'action'],
      ['了', 'completion'],
    ],
    mnemonic: 'Use 了 to mark that something happened or changed.',
    related: ['我回家了。', '他吃饭了。'],
    example: ['他吃饭了。', 'Tā chī fàn le.', 'He ate.'],
    nextReview: 'In 2 days',
  },
  {
    id: 'xiexie',
    type: 'Words',
    stage: 'Familiar',
    accuracy: 84,
    title: '谢谢',
    pinyin: ['xiè', 'xie'],
    tones: [4, 0],
    meaning: 'thank you',
    components: [
      ['谢', 'thank'],
      ['谢', 'repeat'],
    ],
    mnemonic: 'A repeated thanks becomes 谢谢.',
    related: ['谢谢你', '多谢'],
    example: ['谢谢你。', 'Xiè xie nǐ.', 'Thank you.'],
    nextReview: 'Tomorrow',
  },
  {
    id: 'wo',
    type: 'Hanzi',
    stage: 'Strong',
    accuracy: 93,
    title: '我',
    pinyin: ['wǒ'],
    tones: [3],
    meaning: 'I / me',
    components: [
      ['手', 'hand'],
      ['戈', 'tool'],
    ],
    mnemonic: 'A hand holding a tool points back to me.',
    related: ['我是', '我们'],
    example: ['我是学生。', 'Wǒ shì xuésheng.', 'I am a student.'],
    nextReview: 'In 4 days',
  },
  {
    id: 'shi',
    type: 'Words',
    stage: 'Learning',
    accuracy: 69,
    title: '是',
    pinyin: ['shì'],
    tones: [4],
    meaning: 'to be / is',
    components: [
      ['日', 'sun'],
      ['正', 'correct'],
    ],
    mnemonic: 'It is correct under the sun.',
    related: ['我是', '不是'],
    example: ['我是老师。', 'Wǒ shì lǎoshī.', 'I am a teacher.'],
    nextReview: 'Today',
  },
  {
    id: 'student',
    type: 'Words',
    stage: 'Familiar',
    accuracy: 81,
    title: '学生',
    pinyin: ['xué', 'sheng'],
    tones: [2, 0],
    meaning: 'student',
    components: [
      ['学', 'study'],
      ['生', 'person/life'],
    ],
    mnemonic: 'A study person is a student.',
    related: ['老师', '学校'],
    example: ['我是学生。', 'Wǒ shì xuésheng.', 'I am a student.'],
    nextReview: 'Tomorrow',
  },
  {
    id: 'teacher',
    type: 'Words',
    stage: 'Learning',
    accuracy: 66,
    title: '老师',
    pinyin: ['lǎo', 'shī'],
    tones: [3, 1],
    meaning: 'teacher',
    components: [
      ['老', 'old/experienced'],
      ['师', 'master'],
    ],
    mnemonic: 'An experienced master teaches.',
    related: ['学生', '老师好'],
    example: ['老师好！', 'Lǎoshī hǎo!', 'Hello, teacher!'],
    nextReview: 'Today',
  },
  {
    id: 'wo-shi-student',
    type: 'Sentences',
    stage: 'Learning',
    accuracy: 72,
    title: '我是学生。',
    pinyin: ['Wǒ', 'shì', 'xué', 'sheng'],
    tones: [3, 4, 2, 0],
    meaning: 'I am a student.',
    components: [
      ['我', 'I'],
      ['是', 'am'],
      ['学生', 'student'],
    ],
    mnemonic: 'I + am + student = I am a student.',
    related: ['Subject + 是 + noun', '我是'],
    example: ['我是学生。', 'Wǒ shì xuésheng.', 'I am a student.'],
    nextReview: 'Later today',
  },
];

export const weeklyActivity = [
  { day: 'M', minutes: 10 },
  { day: 'T', minutes: 15 },
  { day: 'W', minutes: 12 },
  { day: 'T', minutes: 18 },
  { day: 'F', minutes: 10 },
  { day: 'S', minutes: 20 },
  { day: 'S', minutes: 14 },
];

export const wordStrength = [
  { stage: 'Learning', count: 8, width: 32, color: 'var(--stage-learning)' },
  { stage: 'Familiar', count: 24, width: 86, color: 'var(--stage-familiar)' },
  { stage: 'Strong', count: 15, width: 60, color: 'var(--stage-strong)' },
  { stage: 'Mastered', count: 6, width: 34, color: 'var(--stage-mastered)' },
  { stage: 'Long-term', count: 2, width: 18, color: 'var(--stage-longterm)' },
] as const;

export const learningPath = [
  { status: 'done', icon: '部', title: 'Components', description: 'Core building blocks', label: 'Done' },
  { status: 'current', icon: '字', title: 'Hanzi', description: 'You are building character familiarity', label: 'Now' },
  { status: 'available', icon: '词', title: 'Words', description: 'Unlock more as Hanzi reach Familiar', label: 'Available' },
  { status: 'locked', icon: '句', title: 'Sentences', description: 'Unlock after words strengthen', label: 'Locked' },
  { status: 'locked', icon: '法', title: 'Patterns', description: 'Grammar patterns later', label: 'Locked' },
] as const;

export function typeLabel(type: ContentType) {
  return type === 'Words' ? 'Word' : type === 'Sentences' ? 'Sentence' : type === 'Patterns' ? 'Pattern' : 'Hanzi';
}

export function effectiveScript(scriptChoice: ScriptChoice) {
  return scriptChoice === 'Not sure' ? 'Simplified' : scriptChoice;
}
