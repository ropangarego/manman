import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ProgressSnapshot } from './progressState';

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
    key: (index: number) => Array.from(values.keys())[index] ?? null,
    get length() {
      return values.size;
    },
  };
}

function buildSnapshot(overrides: Partial<ProgressSnapshot> = {}): ProgressSnapshot {
  return {
    items: {},
    dailyActivity: {},
    sessionsCompleted: 0,
    totalCorrect: 0,
    totalAttempts: 0,
    ...overrides,
  };
}

describe('progress sync', () => {
  beforeEach(() => {
    const storage = createMemoryStorage();
    vi.stubGlobal('window', { localStorage: storage });
    vi.stubGlobal('localStorage', storage);
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('merges local and remote progress by latest updated_at', async () => {
    const { mergeProgressSnapshots } = await import('./progressSync');

    const local = buildSnapshot({
      items: {
        'word-nihao': {
          itemId: 'word-nihao',
          itemType: 'Words',
          stage: 'Learning',
          dueAt: '2026-06-10T00:00:00.000Z',
          firstSeenAt: '2026-06-09T00:00:00.000Z',
          lastReviewedAt: '2026-06-09T00:00:00.000Z',
          updatedAt: '2026-06-09T00:00:00.000Z',
          correctCount: 1,
          incorrectCount: 0,
          streakCorrect: 1,
          totalReviews: 1,
        },
      },
      dailyActivity: {
        '2026-06-09': {
          date: '2026-06-09',
          minutes: 5,
          sessions: 1,
          reviews: 0,
          correct: 1,
          incorrect: 0,
          updatedAt: '2026-06-09T00:00:00.000Z',
        },
      },
    });

    const remote = buildSnapshot({
      items: {
        'word-nihao': {
          itemId: 'word-nihao',
          itemType: 'Words',
          stage: 'Familiar',
          dueAt: '2026-06-12T00:00:00.000Z',
          firstSeenAt: '2026-06-09T00:00:00.000Z',
          lastReviewedAt: '2026-06-11T00:00:00.000Z',
          updatedAt: '2026-06-11T00:00:00.000Z',
          correctCount: 2,
          incorrectCount: 0,
          streakCorrect: 2,
          totalReviews: 2,
        },
      },
      dailyActivity: {
        '2026-06-09': {
          date: '2026-06-09',
          minutes: 12,
          sessions: 2,
          reviews: 1,
          correct: 2,
          incorrect: 0,
          updatedAt: '2026-06-11T00:00:00.000Z',
        },
      },
    });

    const merged = mergeProgressSnapshots(local, remote);

    expect(merged.items['word-nihao']).toMatchObject({
      stage: 'Familiar',
      correctCount: 2,
      totalReviews: 2,
      updatedAt: '2026-06-11T00:00:00.000Z',
    });
    expect(merged.dailyActivity['2026-06-09']).toMatchObject({
      minutes: 12,
      sessions: 2,
      updatedAt: '2026-06-11T00:00:00.000Z',
    });
    expect(merged.totalCorrect).toBe(2);
    expect(merged.totalAttempts).toBe(2);
    expect(merged.sessionsCompleted).toBe(2);
  });

  it('keeps local progress scoped by user key', async () => {
    const { readStoredProgressSnapshot, writeStoredProgressSnapshot } = await import('./progressStorage');

    writeStoredProgressSnapshot(
      'user-a',
      buildSnapshot({
        items: {
          'word-a': {
            itemId: 'word-a',
            itemType: 'Words',
            stage: 'Learning',
            dueAt: '2026-06-10T00:00:00.000Z',
            firstSeenAt: '2026-06-10T00:00:00.000Z',
            lastReviewedAt: '2026-06-10T00:00:00.000Z',
            updatedAt: '2026-06-10T00:00:00.000Z',
            correctCount: 2,
            incorrectCount: 1,
            streakCorrect: 0,
            totalReviews: 3,
          },
        },
      }),
    );
    writeStoredProgressSnapshot(
      'user-b',
      buildSnapshot({
        items: {
          'word-b': {
            itemId: 'word-b',
            itemType: 'Words',
            stage: 'Familiar',
            dueAt: '2026-06-10T00:00:00.000Z',
            firstSeenAt: '2026-06-10T00:00:00.000Z',
            lastReviewedAt: '2026-06-10T00:00:00.000Z',
            updatedAt: '2026-06-10T00:00:00.000Z',
            correctCount: 7,
            incorrectCount: 0,
            streakCorrect: 7,
            totalReviews: 7,
          },
        },
      }),
    );
    writeStoredProgressSnapshot(
      null,
      buildSnapshot({
        items: {
          'word-anon': {
            itemId: 'word-anon',
            itemType: 'Words',
            stage: 'Learning',
            dueAt: '2026-06-10T00:00:00.000Z',
            firstSeenAt: '2026-06-10T00:00:00.000Z',
            lastReviewedAt: '2026-06-10T00:00:00.000Z',
            updatedAt: '2026-06-10T00:00:00.000Z',
            correctCount: 1,
            incorrectCount: 0,
            streakCorrect: 1,
            totalReviews: 1,
          },
        },
      }),
    );

    expect(readStoredProgressSnapshot('user-a')?.totalAttempts).toBe(3);
    expect(readStoredProgressSnapshot('user-b')?.totalAttempts).toBe(7);
    expect(readStoredProgressSnapshot(null)?.totalAttempts).toBe(1);
  });

  it('falls back to local cached progress when remote restore fails', async () => {
    vi.doMock('./progressRepository', () => ({
      fetchRemoteProgressSnapshot: vi.fn(async () => ({
        snapshot: buildSnapshot(),
        error: new Error('network failed'),
      })),
      upsertRemoteItemProgress: vi.fn(),
      upsertRemoteDailyActivity: vi.fn(),
      clearRemoteProgress: vi.fn(),
    }));

    const { writeStoredProgressSnapshot } = await import('./progressStorage');
    const localSnapshot = buildSnapshot({
      items: {
        'word-xiexie': {
          itemId: 'word-xiexie',
          itemType: 'Words',
          stage: 'Learning',
          dueAt: '2026-06-10T00:00:00.000Z',
          firstSeenAt: '2026-06-10T00:00:00.000Z',
          lastReviewedAt: '2026-06-10T00:00:00.000Z',
          updatedAt: '2026-06-10T00:00:00.000Z',
          correctCount: 0,
          incorrectCount: 1,
          streakCorrect: 0,
          totalReviews: 1,
        },
      },
      totalAttempts: 1,
    });
    writeStoredProgressSnapshot('user-a', localSnapshot);

    const { restoreProgressForUser } = await import('./progressSync');
    const { snapshot, error } = await restoreProgressForUser('user-a');

    expect(error).toBeTruthy();
    expect(snapshot.items['word-xiexie']).toBeTruthy();
    expect(snapshot.totalAttempts).toBe(1);
  });
});
