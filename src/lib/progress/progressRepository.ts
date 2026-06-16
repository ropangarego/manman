import type { ContentType, Stage } from '../../data/mockContent';
import { isSupabaseConfigured, supabase } from '../supabase';
import { createEmptyProgressSnapshot, normalizeProgressSnapshot, type DailyActivity, type ItemProgress } from './progressState';

type DbItemType = 'hanzi' | 'word' | 'sentence' | 'pattern';
type DbStage = 'learning' | 'familiar' | 'strong' | 'mastered' | 'long_term';

interface UserItemProgressRow {
  item_type: DbItemType;
  item_external_id: string;
  stage: DbStage;
  first_seen_at: string;
  next_review_at: string;
  last_reviewed_at: string | null;
  total_attempts: number;
  correct_attempts: number;
  incorrect_attempts: number;
  correct_streak: number;
  updated_at: string;
}

interface DailyActivityRow {
  activity_date: string;
  minutes: number;
  sessions: number;
  reviews: number;
  correct: number;
  incorrect: number;
  updated_at: string;
}

function itemTypeToDb(value: ContentType): DbItemType {
  if (value === 'Hanzi') return 'hanzi';
  if (value === 'Sentences') return 'sentence';
  if (value === 'Patterns') return 'pattern';
  return 'word';
}

function itemTypeFromDb(value: string): ContentType {
  if (value === 'hanzi') return 'Hanzi';
  if (value === 'sentence') return 'Sentences';
  if (value === 'pattern') return 'Patterns';
  return 'Words';
}

function stageToDb(value: Stage): DbStage {
  if (value === 'Familiar') return 'familiar';
  if (value === 'Strong') return 'strong';
  if (value === 'Mastered') return 'mastered';
  if (value === 'Long-term') return 'long_term';
  return 'learning';
}

function stageFromDb(value: string): Stage {
  if (value === 'familiar') return 'Familiar';
  if (value === 'strong') return 'Strong';
  if (value === 'mastered') return 'Mastered';
  if (value === 'long_term') return 'Long-term';
  return 'Learning';
}

function intervalDaysForProgress(item: ItemProgress) {
  const due = new Date(item.dueAt).getTime();
  const from = new Date(item.lastReviewedAt || item.firstSeenAt).getTime();

  if (Number.isNaN(due) || Number.isNaN(from) || due <= from) {
    return 0;
  }

  return Math.max(0, Math.round((due - from) / 86_400_000));
}

export async function fetchRemoteProgressSnapshot(userId: string) {
  if (!isSupabaseConfigured || !supabase) {
    return { snapshot: createEmptyProgressSnapshot(), error: null };
  }

  const [itemResult, activityResult] = await Promise.all([
    supabase
      .from('user_item_progress')
      .select(
        'item_type, item_external_id, stage, first_seen_at, next_review_at, last_reviewed_at, total_attempts, correct_attempts, incorrect_attempts, correct_streak, updated_at',
      )
      .eq('user_id', userId),
    supabase
      .from('daily_activity')
      .select('activity_date, minutes, sessions, reviews, correct, incorrect, updated_at')
      .eq('user_id', userId),
  ]);

  if (itemResult.error) {
    return { snapshot: createEmptyProgressSnapshot(), error: itemResult.error };
  }

  if (activityResult.error) {
    return { snapshot: createEmptyProgressSnapshot(), error: activityResult.error };
  }

  const items = Object.fromEntries(
    ((itemResult.data as UserItemProgressRow[] | null) ?? []).map((row) => [
      row.item_external_id,
      {
        itemId: row.item_external_id,
        itemType: itemTypeFromDb(row.item_type),
        stage: stageFromDb(row.stage),
        dueAt: row.next_review_at,
        firstSeenAt: row.first_seen_at,
        lastReviewedAt: row.last_reviewed_at ?? row.first_seen_at,
        updatedAt: row.updated_at,
        correctCount: row.correct_attempts,
        incorrectCount: row.incorrect_attempts,
        streakCorrect: row.correct_streak,
        totalReviews: row.total_attempts,
      } satisfies ItemProgress,
    ]),
  );

  const dailyActivity = Object.fromEntries(
    ((activityResult.data as DailyActivityRow[] | null) ?? []).map((row) => [
      row.activity_date,
      {
        date: row.activity_date,
        minutes: row.minutes,
        sessions: row.sessions,
        reviews: row.reviews,
        correct: row.correct,
        incorrect: row.incorrect,
        updatedAt: row.updated_at,
      } satisfies DailyActivity,
    ]),
  );

  return { snapshot: normalizeProgressSnapshot({ items, dailyActivity }), error: null };
}

export async function upsertRemoteItemProgress(userId: string, item: ItemProgress) {
  if (!isSupabaseConfigured || !supabase) {
    return { error: null };
  }

  const { error } = await supabase.from('user_item_progress').upsert(
    {
      user_id: userId,
      item_type: itemTypeToDb(item.itemType),
      item_external_id: item.itemId,
      stage: stageToDb(item.stage),
      interval_days: intervalDaysForProgress(item),
      first_seen_at: item.firstSeenAt,
      next_review_at: item.dueAt,
      last_reviewed_at: item.lastReviewedAt,
      total_attempts: item.totalReviews,
      correct_attempts: item.correctCount,
      incorrect_attempts: item.incorrectCount,
      correct_streak: item.streakCorrect,
      lapse_count: Math.max(0, item.incorrectCount),
      is_unlocked: true,
      updated_at: item.updatedAt,
    },
    {
      onConflict: 'user_id,item_type,item_external_id',
    },
  );

  return { error };
}

export async function upsertRemoteDailyActivity(userId: string, day: DailyActivity) {
  if (!isSupabaseConfigured || !supabase) {
    return { error: null };
  }

  const { error } = await supabase.from('daily_activity').upsert(
    {
      user_id: userId,
      activity_date: day.date,
      minutes: day.minutes,
      sessions: day.sessions,
      reviews: day.reviews,
      correct: day.correct,
      incorrect: day.incorrect,
      updated_at: day.updatedAt,
    },
    {
      onConflict: 'user_id,activity_date',
    },
  );

  return { error };
}

export async function clearRemoteProgress(userId: string) {
  if (!isSupabaseConfigured || !supabase) {
    return { error: null };
  }

  const [itemResult, activityResult] = await Promise.all([
    supabase.from('user_item_progress').delete().eq('user_id', userId),
    supabase.from('daily_activity').delete().eq('user_id', userId),
  ]);

  return { error: itemResult.error ?? activityResult.error ?? null };
}
