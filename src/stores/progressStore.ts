import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { ContentItem, Stage } from '../data/mockContent';
import { applySrsSnapshot, dueAtForStage, nextSrsStage, srsStageColors, srsStages } from '../utils/srs';

export const PROGRESS_STORAGE_KEY = 'mandarin-learning-progress';

export interface ItemProgress {
  itemId: string;
  itemType: ContentItem['type'];
  stage: Stage;
  dueAt: string;
  lastReviewedAt: string;
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
}

interface ProgressState {
  items: Record<string, ItemProgress>;
  dailyActivity: Record<string, DailyActivity>;
  sessionsCompleted: number;
  totalCorrect: number;
  totalAttempts: number;
  recordLearning: (item: ContentItem, correctFirstTry: boolean) => void;
  recordAnswer: (item: ContentItem, correct: boolean) => void;
  completeSession: (minutes: number) => void;
  resetProgress: () => void;
}

function todayKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function emptyDay(date = todayKey()): DailyActivity {
  return {
    date,
    minutes: 0,
    sessions: 0,
    reviews: 0,
    correct: 0,
    incorrect: 0,
  };
}

function initialProgressForItem(item: ContentItem, now: Date): ItemProgress {
  return {
    itemId: item.id,
    itemType: item.type,
    stage: 'Learning',
    dueAt: now.toISOString(),
    lastReviewedAt: now.toISOString(),
    correctCount: 0,
    incorrectCount: 0,
    streakCorrect: 0,
    totalReviews: 0,
  };
}

function resetState() {
  return {
    items: {},
    dailyActivity: {},
    sessionsCompleted: 0,
    totalCorrect: 0,
    totalAttempts: 0,
  };
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      ...resetState(),
      recordLearning: (item, correctFirstTry) =>
        set((state) => {
          if (state.items[item.id]) {
            return state;
          }

          const now = new Date();
          const dateKey = todayKey(now);
          const day = state.dailyActivity[dateKey] ?? emptyDay(dateKey);
          const initial = initialProgressForItem(item, now);

          return {
            items: {
              ...state.items,
              [item.id]: {
                ...initial,
                dueAt: dueAtForStage('Learning', now),
                correctCount: correctFirstTry ? 1 : 0,
                incorrectCount: correctFirstTry ? 0 : 1,
                streakCorrect: correctFirstTry ? 1 : 0,
                totalReviews: 1,
              },
            },
            dailyActivity: {
              ...state.dailyActivity,
              [dateKey]: {
                ...day,
                correct: day.correct + (correctFirstTry ? 1 : 0),
                incorrect: day.incorrect + (correctFirstTry ? 0 : 1),
              },
            },
            totalCorrect: state.totalCorrect + (correctFirstTry ? 1 : 0),
            totalAttempts: state.totalAttempts + 1,
          };
        }),
      recordAnswer: (item, correct) =>
        set((state) => {
          const now = new Date();
          const current = state.items[item.id] ?? initialProgressForItem(item, now);
          const nextStage = nextSrsStage(current.stage, correct);
          const dateKey = todayKey(now);
          const day = state.dailyActivity[dateKey] ?? emptyDay(dateKey);

          return {
            items: {
              ...state.items,
              [item.id]: {
                ...current,
                stage: nextStage,
                dueAt: dueAtForStage(nextStage, now),
                lastReviewedAt: now.toISOString(),
                correctCount: current.correctCount + (correct ? 1 : 0),
                incorrectCount: current.incorrectCount + (correct ? 0 : 1),
                streakCorrect: correct ? current.streakCorrect + 1 : 0,
                totalReviews: current.totalReviews + 1,
              },
            },
            dailyActivity: {
              ...state.dailyActivity,
              [dateKey]: {
                ...day,
                reviews: day.reviews + 1,
                correct: day.correct + (correct ? 1 : 0),
                incorrect: day.incorrect + (correct ? 0 : 1),
              },
            },
            totalCorrect: state.totalCorrect + (correct ? 1 : 0),
            totalAttempts: state.totalAttempts + 1,
          };
        }),
      completeSession: (minutes) =>
        set((state) => {
          const dateKey = todayKey();
          const day = state.dailyActivity[dateKey] ?? emptyDay(dateKey);

          return {
            dailyActivity: {
              ...state.dailyActivity,
              [dateKey]: {
                ...day,
                minutes: day.minutes + minutes,
                sessions: day.sessions + 1,
              },
            },
            sessionsCompleted: state.sessionsCompleted + 1,
          };
        }),
      resetProgress: () => set(resetState()),
    }),
    {
      name: PROGRESS_STORAGE_KEY,
      version: 1,
      storage: createJSONStorage(() => window.localStorage),
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
