import type { ContentItem, Stage } from '../data/mockContent';

export const srsStages: Stage[] = ['Learning', 'Familiar', 'Strong', 'Mastered', 'Long-term'];

export const srsIntervalsDays: Record<Stage, number> = {
  Learning: 1,
  Familiar: 1,
  Strong: 3,
  Mastered: 7,
  'Long-term': 21,
};

export const srsStageColors: Record<Stage, string> = {
  Learning: 'var(--stage-learning)',
  Familiar: 'var(--stage-familiar)',
  Strong: 'var(--stage-strong)',
  Mastered: 'var(--stage-mastered)',
  'Long-term': 'var(--stage-longterm)',
};

export interface SrsSnapshot {
  stage: Stage;
  dueAt: string;
  correctCount: number;
  incorrectCount: number;
  totalReviews: number;
}

export function nextSrsStage(currentStage: Stage, correct: boolean) {
  const currentIndex = srsStages.indexOf(currentStage);
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;
  const nextIndex = correct ? Math.min(safeIndex + 1, srsStages.length - 1) : Math.max(safeIndex - 1, 0);

  return srsStages[nextIndex];
}

export function dueAtForStage(stage: Stage, from = new Date()) {
  const dueAt = new Date(from);
  dueAt.setDate(dueAt.getDate() + srsIntervalsDays[stage]);

  return dueAt.toISOString();
}

function startOfLocalDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

export function formatDueLabel(dueAt: string, now = new Date()) {
  const due = new Date(dueAt);

  if (Number.isNaN(due.getTime())) {
    return 'Today';
  }

  const dayDistance = Math.round((startOfLocalDay(due) - startOfLocalDay(now)) / 86_400_000);

  if (dayDistance <= 0) {
    return 'Today';
  }

  if (dayDistance === 1) {
    return 'Tomorrow';
  }

  if (dayDistance === 7) {
    return 'Next week';
  }

  return `In ${dayDistance} days`;
}

export function accuracyForSnapshot(snapshot: SrsSnapshot, fallback: number) {
  if (snapshot.totalReviews === 0) {
    return fallback;
  }

  return Math.round((snapshot.correctCount / snapshot.totalReviews) * 100);
}

export function applySrsSnapshot(item: ContentItem, snapshot?: SrsSnapshot): ContentItem {
  if (!snapshot) {
    return item;
  }

  return {
    ...item,
    stage: snapshot.stage,
    accuracy: accuracyForSnapshot(snapshot, item.accuracy),
    nextReview: formatDueLabel(snapshot.dueAt),
  };
}
