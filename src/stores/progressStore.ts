import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ContentItem } from '../data/mockContent';
import { createProgressPersistStorage, PROGRESS_STORAGE_PREFIX } from '../lib/progress/progressStorage';
import {
  createEmptyProgressSnapshot,
  emptyDay,
  initialProgressForItem,
  normalizeProgressSnapshot,
  todayKey,
  type DailyActivity,
  type ItemProgress,
  type ProgressSnapshot,
} from '../lib/progress/progressState';
import { syncProgressMutation } from '../lib/progress/progressSync';
import { applySrsSnapshot, dueAtForStage, nextSrsStage, srsStageColors, srsStages } from '../utils/srs';

export const PROGRESS_STORAGE_KEY = PROGRESS_STORAGE_PREFIX;

interface ProgressState extends ProgressSnapshot {
  recordLearning: (item: ContentItem, correctFirstTry: boolean) => void;
  recordAnswer: (item: ContentItem, correct: boolean) => void;
  completeSession: (minutes: number) => void;
  hydrateProgress: (snapshot: ProgressSnapshot) => void;
  resetProgress: () => void;
}

function resetState() {
  return createEmptyProgressSnapshot();
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      ...resetState(),
      recordLearning: (item, correctFirstTry) => {
        let syncedItem: ItemProgress | undefined;
        let syncedDay: DailyActivity | undefined;

        set((state) => {
          if (state.items[item.id] || !item.reviewable || item.type === 'Patterns') {
            return state;
          }

          const now = new Date();
          const nowIso = now.toISOString();
          const dateKey = todayKey(now);
          const day = state.dailyActivity[dateKey] ?? emptyDay(dateKey, nowIso);
          const initial = initialProgressForItem(item, now);
          const nextItem: ItemProgress = {
            ...initial,
            dueAt: dueAtForStage('Learning', now),
            correctCount: correctFirstTry ? 1 : 0,
            incorrectCount: correctFirstTry ? 0 : 1,
            streakCorrect: correctFirstTry ? 1 : 0,
            totalReviews: 1,
            updatedAt: nowIso,
          };
          const nextDay: DailyActivity = {
            ...day,
            correct: day.correct + (correctFirstTry ? 1 : 0),
            incorrect: day.incorrect + (correctFirstTry ? 0 : 1),
            updatedAt: nowIso,
          };

          syncedItem = nextItem;
          syncedDay = nextDay;

          return {
            items: {
              ...state.items,
              [item.id]: nextItem,
            },
            dailyActivity: {
              ...state.dailyActivity,
              [dateKey]: nextDay,
            },
            totalCorrect: state.totalCorrect + (correctFirstTry ? 1 : 0),
            totalAttempts: state.totalAttempts + 1,
          };
        });

        if (syncedItem || syncedDay) {
          syncProgressMutation({ item: syncedItem, day: syncedDay });
        }
      },
      recordAnswer: (item, correct) => {
        let syncedItem: ItemProgress | undefined;
        let syncedDay: DailyActivity | undefined;

        set((state) => {
          if (!state.items[item.id]) {
            return state;
          }

          const now = new Date();
          const nowIso = now.toISOString();
          const current = state.items[item.id];
          const nextStage = nextSrsStage(current.stage, correct);
          const dateKey = todayKey(now);
          const day = state.dailyActivity[dateKey] ?? emptyDay(dateKey, nowIso);
          const nextItem: ItemProgress = {
            ...current,
            stage: nextStage,
            dueAt: dueAtForStage(nextStage, now),
            lastReviewedAt: nowIso,
            updatedAt: nowIso,
            correctCount: current.correctCount + (correct ? 1 : 0),
            incorrectCount: current.incorrectCount + (correct ? 0 : 1),
            streakCorrect: correct ? current.streakCorrect + 1 : 0,
            totalReviews: current.totalReviews + 1,
          };
          const nextDay: DailyActivity = {
            ...day,
            reviews: day.reviews + 1,
            correct: day.correct + (correct ? 1 : 0),
            incorrect: day.incorrect + (correct ? 0 : 1),
            updatedAt: nowIso,
          };

          syncedItem = nextItem;
          syncedDay = nextDay;

          return {
            items: {
              ...state.items,
              [item.id]: nextItem,
            },
            dailyActivity: {
              ...state.dailyActivity,
              [dateKey]: nextDay,
            },
            totalCorrect: state.totalCorrect + (correct ? 1 : 0),
            totalAttempts: state.totalAttempts + 1,
          };
        });

        if (syncedItem || syncedDay) {
          syncProgressMutation({ item: syncedItem, day: syncedDay });
        }
      },
      completeSession: (minutes) => {
        let syncedDay: DailyActivity | undefined;

        set((state) => {
          const now = new Date();
          const nowIso = now.toISOString();
          const dateKey = todayKey(now);
          const day = state.dailyActivity[dateKey] ?? emptyDay(dateKey, nowIso);
          const nextDay: DailyActivity = {
            ...day,
            minutes: day.minutes + minutes,
            sessions: day.sessions + 1,
            updatedAt: nowIso,
          };

          syncedDay = nextDay;

          return {
            dailyActivity: {
              ...state.dailyActivity,
              [dateKey]: nextDay,
            },
            sessionsCompleted: state.sessionsCompleted + 1,
          };
        });

        if (syncedDay) {
          syncProgressMutation({ day: syncedDay });
        }
      },
      hydrateProgress: (snapshot) => set(normalizeProgressSnapshot(snapshot)),
      resetProgress: () => set(resetState()),
    }),
    {
      name: PROGRESS_STORAGE_KEY,
      version: 2,
      storage: createProgressPersistStorage(),
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...normalizeProgressSnapshot((persistedState as { state?: unknown } | undefined)?.state ?? persistedState),
      }),
    },
  ),
);

export function withProgress(items: ContentItem[], progress: Record<string, ItemProgress>) {
  return items.map((item) => {
    const itemProgress = progress[item.id];

    if (itemProgress) {
      return {
        ...applySrsSnapshot(item, itemProgress),
        started: true,
      };
    }

    return {
      ...item,
      stage: 'Learning' as const,
      accuracy: 0,
      nextReview: 'Not started',
      started: false,
    };
  });
}

export function dueReviewItems(items: ContentItem[], progress: Record<string, ItemProgress>) {
  const now = Date.now();

  return withProgress(items, progress)
    .filter((item) => item.type !== 'Patterns')
    .filter((item) => {
      const itemProgress = progress[item.id];
      return itemProgress ? new Date(itemProgress.dueAt).getTime() <= now : false;
    });
}

export function progressStats(
  items: ContentItem[],
  progress: Record<string, ItemProgress>,
  totalCorrect: number,
  totalAttempts: number,
  dailyActivity: Record<string, DailyActivity>,
) {
  const learnedWords = items.filter((item) => item.type === 'Words' && progress[item.id]).length;
  const reviewsDue = dueReviewItems(items, progress).length;
  const accuracy = totalAttempts > 0 ? `${Math.round((totalCorrect / totalAttempts) * 100)}%` : '0%';

  return {
    learnedWords,
    reviewsDue,
    streak: streakFromActivity(dailyActivity),
    accuracy,
  };
}

export function weeklyActivityFromProgress(dailyActivity: Record<string, DailyActivity>) {
  const labels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const today = new Date();

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));
    const key = todayKey(date);

    return {
      day: labels[date.getDay()],
      minutes: dailyActivity[key]?.minutes ?? 0,
    };
  });
}

export function wordStrengthFromProgress(items: ContentItem[], progress: Record<string, ItemProgress>) {
  const words = items
    .filter((item) => item.type === 'Words' && progress[item.id])
    .map((item) => applySrsSnapshot(item, progress[item.id]));
  const counts = srsStages.map((stage) => ({
    stage,
    count: words.filter((item) => item.stage === stage).length,
  }));
  const maxCount = Math.max(...counts.map((item) => item.count), 1);

  return counts.map((item) => ({
    ...item,
    width: item.count === 0 ? 0 : Math.max(18, Math.round((item.count / maxCount) * 86)),
    color: srsStageColors[item.stage],
  }));
}

function streakFromActivity(dailyActivity: Record<string, DailyActivity>) {
  let streak = 0;
  const cursor = new Date();

  for (let index = 0; index < 365; index += 1) {
    const key = todayKey(cursor);
    const active = (dailyActivity[key]?.sessions ?? 0) > 0;

    if (!active) {
      break;
    }

    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export type { DailyActivity, ItemProgress, ProgressSnapshot };
