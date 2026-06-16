import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getStarterStudySession, nextSessionIndexForProgress, type ContentItem } from '../../data/mockContent';

type TestProgress = Record<string, { dueAt: string }>;

function isoDaysFromNow(days: number) {
  return new Date(Date.now() + days * 86_400_000).toISOString();
}

function introduceAllCurrentPackItems(sessionIndex = 0, dueAt = isoDaysFromNow(1)) {
  const progress: TestProgress = {};
  const introduced: ContentItem[] = [];

  for (let pass = 0; pass < 20; pass += 1) {
    const session = getStarterStudySession('Intense', sessionIndex, 'English', progress);

    if (session.learnItems.length === 0) {
      return { progress, introduced };
    }

    session.learnItems.forEach((item) => {
      progress[item.id] = { dueAt };
      introduced.push(item);
    });
  }

  throw new Error('Could not finish introducing pack items within 20 passes.');
}

function createMemoryStorage() {
  const values = new Map<string, string>();

  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => {
      values.set(key, value);
    },
    removeItem: (key: string) => {
      values.delete(key);
    },
    clear: () => {
      values.clear();
    },
  };
}

describe('study session generation safety', () => {
  it('starts a fresh learner with new lessons and no reviews', () => {
    const session = getStarterStudySession('Standard', 0, 'English', {});

    expect(session.learnItems.length).toBeGreaterThan(0);
    expect(session.reviewItems).toHaveLength(0);
  });

  it('does not review learned items before they are due', () => {
    const firstSession = getStarterStudySession('Standard', 0, 'English', {});
    const progress = Object.fromEntries(firstSession.learnItems.slice(0, 3).map((item) => [item.id, { dueAt: isoDaysFromNow(1) }]));
    const nextSession = getStarterStudySession('Standard', 0, 'English', progress);

    expect(nextSession.reviewItems).toHaveLength(0);
  });

  it('only reviews items that are learned and due', () => {
    const firstSession = getStarterStudySession('Standard', 0, 'English', {});
    const dueLearnedItems = firstSession.learnItems.slice(0, 3);
    const progress = Object.fromEntries(dueLearnedItems.map((item) => [item.id, { dueAt: isoDaysFromNow(-1) }]));
    const nextSession = getStarterStudySession('Standard', 0, 'English', progress);

    expect(nextSession.reviewItems.length).toBeGreaterThan(0);
    expect(nextSession.reviewItems.every((item) => Boolean(progress[item.id]))).toBe(true);
  });

  it('can produce a review-only session when all current-pack lessons are introduced and due', () => {
    const { progress } = introduceAllCurrentPackItems(0, isoDaysFromNow(-1));
    const session = getStarterStudySession('Standard', 0, 'English', progress);

    expect(session.learnItems).toHaveLength(0);
    expect(session.reviewItems.length).toBeGreaterThan(0);
  });

  it('shows no study tasks when all current-pack lessons are introduced but not due', () => {
    const { progress } = introduceAllCurrentPackItems(0, isoDaysFromNow(1));
    const session = getStarterStudySession('Standard', 0, 'English', progress);

    expect(session.learnItems).toHaveLength(0);
    expect(session.reviewItems).toHaveLength(0);
  });

  it('keeps partial pack progress on the same pack', () => {
    const firstSession = getStarterStudySession('Standard', 0, 'English', {});
    const progress = Object.fromEntries(firstSession.learnItems.slice(0, 2).map((item) => [item.id, { dueAt: isoDaysFromNow(1) }]));

    expect(nextSessionIndexForProgress(0, progress)).toBe(0);
  });

  it('advances after all current-pack reviewable lessons are introduced', () => {
    const { progress, introduced } = introduceAllCurrentPackItems(0, isoDaysFromNow(1));

    expect(introduced.length).toBeGreaterThan(0);
    expect(introduced.every((item) => item.reviewable && item.type !== 'Patterns')).toBe(true);
    expect(nextSessionIndexForProgress(0, progress)).toBe(1);
  });
});

describe('quick-practice retry recording', () => {
  beforeEach(() => {
    const storage = createMemoryStorage();
    vi.stubGlobal('window', { localStorage: storage });
    vi.stubGlobal('localStorage', storage);
    vi.resetModules();
  });

  it('records wrong-then-correct as one weak learning attempt', async () => {
    const [{ useStudyStore }, { useProgressStore }] = await Promise.all([
      import('../../stores/studyStore'),
      import('../../stores/progressStore'),
    ]);
    const item = getStarterStudySession('Standard', 0, 'English', {}).learnItems[0];
    const wrongAnswer = item.meaning === 'not correct' ? 'wrong answer' : 'not correct';

    useStudyStore.getState().resetStudyProgress(0);
    useProgressStore.getState().resetProgress();
    useStudyStore.getState().choosePracticeAnswer(wrongAnswer, item.meaning, 'Correct', 'Try again');
    useStudyStore.getState().choosePracticeAnswer(item.meaning, item.meaning, 'Correct', 'Try again');

    const studyState = useStudyStore.getState();
    useProgressStore.getState().recordLearning(item, !studyState.practiceHadMistake);

    const progressState = useProgressStore.getState();
    const progressItem = progressState.items[item.id];

    expect(studyState.sessionAttempts).toBe(1);
    expect(studyState.sessionCorrect).toBe(0);
    expect(studyState.practiceHadMistake).toBe(true);
    expect(progressItem).toMatchObject({
      stage: 'Learning',
      correctCount: 0,
      incorrectCount: 1,
      totalReviews: 1,
    });
    expect(progressState.totalAttempts).toBe(1);
    expect(progressState.totalCorrect).toBe(0);
  });
});
