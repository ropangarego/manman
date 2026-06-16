import { clearRemoteProgress, fetchRemoteProgressSnapshot, upsertRemoteDailyActivity, upsertRemoteItemProgress } from './progressRepository';
import {
  clearStoredProgressSnapshot,
  getActiveProgressStorageUser,
  readStoredProgressSnapshot,
  setActiveProgressStorageUser,
  writeStoredProgressSnapshot,
} from './progressStorage';
import { createEmptyProgressSnapshot, normalizeProgressSnapshot, recalculateProgressSnapshot, type DailyActivity, type ItemProgress, type ProgressSnapshot } from './progressState';

function newerTimestamp(left?: string, right?: string) {
  const leftTime = left ? new Date(left).getTime() : Number.NEGATIVE_INFINITY;
  const rightTime = right ? new Date(right).getTime() : Number.NEGATIVE_INFINITY;

  return leftTime >= rightTime;
}

export function mergeProgressSnapshots(...snapshots: Array<ProgressSnapshot | null | undefined>) {
  const mergedItems: Record<string, ItemProgress> = {};
  const mergedActivity: Record<string, DailyActivity> = {};

  snapshots
    .filter(Boolean)
    .map((snapshot) => normalizeProgressSnapshot(snapshot))
    .forEach((snapshot) => {
      Object.entries(snapshot.items).forEach(([itemId, item]) => {
        const current = mergedItems[itemId];
        mergedItems[itemId] = !current || newerTimestamp(item.updatedAt, current.updatedAt) ? item : current;
      });

      Object.entries(snapshot.dailyActivity).forEach(([date, day]) => {
        const current = mergedActivity[date];
        mergedActivity[date] = !current || newerTimestamp(day.updatedAt, current.updatedAt) ? day : current;
      });
    });

  return recalculateProgressSnapshot({ items: mergedItems, dailyActivity: mergedActivity });
}

export async function restoreProgressForUser(
  userId: string | null,
  currentSnapshot?: ProgressSnapshot,
) {
  const previousUserId = getActiveProgressStorageUser();
  const scopedLocal = readStoredProgressSnapshot(userId);
  const shouldMergeCurrentAnonymous = userId && previousUserId === null && currentSnapshot;
  const localBase = shouldMergeCurrentAnonymous ? mergeProgressSnapshots(scopedLocal, currentSnapshot) : scopedLocal;

  setActiveProgressStorageUser(userId);

  if (!userId) {
    const anonymousSnapshot = localBase ?? createEmptyProgressSnapshot();
    writeStoredProgressSnapshot(null, anonymousSnapshot);
    return { snapshot: anonymousSnapshot, error: null };
  }

  const localSnapshot = localBase ?? createEmptyProgressSnapshot();
  const { snapshot: remoteSnapshot, error } = await fetchRemoteProgressSnapshot(userId);

  if (error) {
    console.warn('[progress-sync] Could not restore remote progress. Falling back to local cache.', error);
    writeStoredProgressSnapshot(userId, localSnapshot);
    return { snapshot: localSnapshot, error };
  }

  const mergedSnapshot = mergeProgressSnapshots(localSnapshot, remoteSnapshot);
  writeStoredProgressSnapshot(userId, mergedSnapshot);
  return { snapshot: mergedSnapshot, error: null };
}

export function syncProgressMutation(params: { item?: ItemProgress; day?: DailyActivity }) {
  const userId = getActiveProgressStorageUser();

  if (!userId) {
    return;
  }

  if (params.item) {
    void upsertRemoteItemProgress(userId, params.item).then(({ error }) => {
      if (error) {
        console.warn(`[progress-sync] Could not sync item progress for ${params.item?.itemId}.`, error);
      }
    });
  }

  if (params.day) {
    void upsertRemoteDailyActivity(userId, params.day).then(({ error }) => {
      if (error) {
        console.warn(`[progress-sync] Could not sync daily activity for ${params.day?.date}.`, error);
      }
    });
  }
}

export async function resetProgressForCurrentUser() {
  const userId = getActiveProgressStorageUser();

  clearStoredProgressSnapshot(userId);

  if (!userId) {
    return { error: null };
  }

  const { error } = await clearRemoteProgress(userId);

  if (error) {
    console.warn('[progress-sync] Could not clear remote progress.', error);
  }

  return { error };
}
