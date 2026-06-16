import type { PersistStorage, StorageValue } from 'zustand/middleware';
import { createEmptyProgressSnapshot, normalizeProgressSnapshot, PROGRESS_STORAGE_VERSION, type ProgressSnapshot } from './progressState';

export const LEGACY_PROGRESS_STORAGE_KEY = 'mandarin-learning-progress';
export const PROGRESS_STORAGE_PREFIX = 'manman-progress';

let activeProgressUserId: string | null = null;

function getStorage() {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage;
}

function parsePersistedValue(raw: string | null): StorageValue<ProgressSnapshot> | null {
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as StorageValue<ProgressSnapshot>;
  } catch {
    return null;
  }
}

function buildStorageValue(snapshot: ProgressSnapshot): StorageValue<ProgressSnapshot> {
  return {
    state: snapshot,
    version: PROGRESS_STORAGE_VERSION,
  };
}

export function getProgressStorageKey(userId: string | null | undefined) {
  return `${PROGRESS_STORAGE_PREFIX}-${userId?.trim() ? userId : 'anonymous'}`;
}

export function getActiveProgressStorageUser() {
  return activeProgressUserId;
}

export function setActiveProgressStorageUser(userId: string | null | undefined) {
  activeProgressUserId = userId?.trim() ? userId : null;
}

export function readStoredProgressSnapshot(userId: string | null | undefined): ProgressSnapshot | null {
  const storage = getStorage();

  if (!storage) {
    return null;
  }

  const scopedValue = parsePersistedValue(storage.getItem(getProgressStorageKey(userId)));

  if (scopedValue?.state) {
    return normalizeProgressSnapshot(scopedValue.state);
  }

  if (!userId) {
    const legacyValue = parsePersistedValue(storage.getItem(LEGACY_PROGRESS_STORAGE_KEY));

    if (legacyValue?.state) {
      return normalizeProgressSnapshot(legacyValue.state);
    }
  }

  return null;
}

export function writeStoredProgressSnapshot(userId: string | null | undefined, snapshot: ProgressSnapshot) {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  storage.setItem(getProgressStorageKey(userId), JSON.stringify(buildStorageValue(snapshot)));
}

export function clearStoredProgressSnapshot(userId: string | null | undefined) {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  storage.removeItem(getProgressStorageKey(userId));

  if (!userId) {
    storage.removeItem(LEGACY_PROGRESS_STORAGE_KEY);
  }
}

export function clearAllStoredProgressSnapshots() {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  const keysToRemove: string[] = [];

  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index);

    if (!key) {
      continue;
    }

    if (key === LEGACY_PROGRESS_STORAGE_KEY || key.startsWith(`${PROGRESS_STORAGE_PREFIX}-`)) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach((key) => storage.removeItem(key));
}

export function createProgressPersistStorage(): PersistStorage<ProgressSnapshot> | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }

  return {
    getItem: () => {
      const snapshot = readStoredProgressSnapshot(activeProgressUserId);
      return snapshot ? buildStorageValue(snapshot) : null;
    },
    setItem: (_name, value) => {
      const snapshot = normalizeProgressSnapshot(value.state);
      writeStoredProgressSnapshot(activeProgressUserId, snapshot);
    },
    removeItem: () => {
      clearStoredProgressSnapshot(activeProgressUserId);
    },
  };
}

export function currentProgressSnapshotOrEmpty(userId: string | null | undefined) {
  return readStoredProgressSnapshot(userId) ?? createEmptyProgressSnapshot();
}
