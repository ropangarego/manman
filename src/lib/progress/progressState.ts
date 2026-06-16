import type { ContentItem, Stage } from '../../data/mockContent';
import { dueAtForStage } from '../../utils/srs';

export interface ItemProgress {
  itemId: string;
  itemType: ContentItem['type'];
  stage: Stage;
  dueAt: string;
  firstSeenAt: string;
  lastReviewedAt: string;
  updatedAt: string;
  correctCount: number;
  incorrectCount: number;
  streakCorrect: number;
  totalReviews: number;
}

export interface DailyActivity {
  date: string;
  minutes: number;
  sessions: number;
  reviews: number;
  correct: number;
  incorrect: number;
  updatedAt: string;
}

export interface ProgressSnapshot {
  items: Record<string, ItemProgress>;
  dailyActivity: Record<string, DailyActivity>;
  sessionsCompleted: number;
  totalCorrect: number;
  totalAttempts: number;
}

export const PROGRESS_STORAGE_VERSION = 2;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isoNow() {
  return new Date().toISOString();
}

export function todayKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function emptyDay(date = todayKey(), updatedAt = isoNow()): DailyActivity {
  return {
    date,
    minutes: 0,
    sessions: 0,
    reviews: 0,
    correct: 0,
    incorrect: 0,
    updatedAt,
  };
}

export function initialProgressForItem(item: ContentItem, now: Date): ItemProgress {
  const nowIso = now.toISOString();

  return {
    itemId: item.id,
    itemType: item.type,
    stage: 'Learning',
    dueAt: nowIso,
    firstSeenAt: nowIso,
    lastReviewedAt: nowIso,
    updatedAt: nowIso,
    correctCount: 0,
    incorrectCount: 0,
    streakCorrect: 0,
    totalReviews: 0,
  };
}

export function createEmptyProgressSnapshot(): ProgressSnapshot {
  return {
    items: {},
    dailyActivity: {},
    sessionsCompleted: 0,
    totalCorrect: 0,
    totalAttempts: 0,
  };
}

function pickNumber(value: unknown, fallback = 0) {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : fallback;
}

function pickString(value: unknown, fallback = '') {
  return typeof value === 'string' ? value : fallback;
}

function normalizeStage(value: unknown): Stage {
  if (
    value === 'Learning' ||
    value === 'Familiar' ||
    value === 'Strong' ||
    value === 'Mastered' ||
    value === 'Long-term'
  ) {
    return value;
  }

  return 'Learning';
}

function normalizeItemType(value: unknown): ContentItem['type'] {
  if (value === 'Hanzi' || value === 'Words' || value === 'Sentences' || value === 'Patterns') {
    return value;
  }

  return 'Words';
}

function sanitizeItemProgress(itemId: string, value: unknown, fallbackTime: string): ItemProgress | null {
  if (!isRecord(value)) {
    return null;
  }

  const stage = normalizeStage(value.stage);
  const lastReviewedAt = pickString(value.lastReviewedAt, fallbackTime);
  const updatedAt = pickString(value.updatedAt, lastReviewedAt || fallbackTime) || fallbackTime;
  const firstSeenAt = pickString(value.firstSeenAt, lastReviewedAt || updatedAt || fallbackTime) || fallbackTime;
  const dueAt = pickString(value.dueAt, dueAtForStage(stage, new Date(updatedAt)));

  return {
    itemId,
    itemType: normalizeItemType(value.itemType),
    stage,
    dueAt,
    firstSeenAt,
    lastReviewedAt: lastReviewedAt || updatedAt,
    updatedAt,
    correctCount: pickNumber(value.correctCount),
    incorrectCount: pickNumber(value.incorrectCount),
    streakCorrect: pickNumber(value.streakCorrect),
    totalReviews: pickNumber(value.totalReviews),
  };
}

function sanitizeDailyActivity(date: string, value: unknown, fallbackTime: string): DailyActivity | null {
  if (!isRecord(value)) {
    return null;
  }

  return {
    date,
    minutes: pickNumber(value.minutes),
    sessions: pickNumber(value.sessions),
    reviews: pickNumber(value.reviews),
    correct: pickNumber(value.correct),
    incorrect: pickNumber(value.incorrect),
    updatedAt: pickString(value.updatedAt, fallbackTime) || fallbackTime,
  };
}

export function recalculateProgressSnapshot(snapshot: Pick<ProgressSnapshot, 'items' | 'dailyActivity'>): ProgressSnapshot {
  const totalCorrect = Object.values(snapshot.items).reduce((sum, item) => sum + item.correctCount, 0);
  const totalAttempts = Object.values(snapshot.items).reduce(
    (sum, item) => sum + item.correctCount + item.incorrectCount,
    0,
  );
  const sessionsCompleted = Object.values(snapshot.dailyActivity).reduce((sum, day) => sum + day.sessions, 0);

  return {
    items: snapshot.items,
    dailyActivity: snapshot.dailyActivity,
    totalCorrect,
    totalAttempts,
    sessionsCompleted,
  };
}

export function normalizeProgressSnapshot(value: unknown, fallbackTime = isoNow()): ProgressSnapshot {
  if (!isRecord(value)) {
    return createEmptyProgressSnapshot();
  }

  const rawItems = isRecord(value.items) ? value.items : {};
  const rawActivity = isRecord(value.dailyActivity) ? value.dailyActivity : {};

  const items = Object.fromEntries(
    Object.entries(rawItems)
      .map(([itemId, itemValue]) => [itemId, sanitizeItemProgress(itemId, itemValue, fallbackTime)] as const)
      .filter((entry): entry is [string, ItemProgress] => entry[1] !== null),
  );

  const dailyActivity = Object.fromEntries(
    Object.entries(rawActivity)
      .map(([date, dayValue]) => [date, sanitizeDailyActivity(date, dayValue, fallbackTime)] as const)
      .filter((entry): entry is [string, DailyActivity] => entry[1] !== null),
  );

  return recalculateProgressSnapshot({ items, dailyActivity });
}
