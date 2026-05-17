import type { PinyinDisplay, ReviewStyle, ScriptChoice, SessionSize } from '../data/mockContent';
import type { AppLanguage } from '../i18n/copy';
import type { SettingsState } from '../stores/appStore';
import type { SpeechSpeed } from '../utils/audio';
import { displayNameFromUser, isSupabaseConfigured, supabase, type SupabaseUser } from './supabase';

type DbLanguage = 'en' | 'id';
type DbScript = 'simplified' | 'traditional';
type DbSessionSize = 'light' | 'standard' | 'intense';
type DbPinyinDisplay = 'always' | 'learning_only' | 'hidden_in_review' | 'off';
type DbReviewStyle = 'choice' | 'mixed' | 'typed';
type DbSpeechSpeed = 'slow' | 'normal' | 'fast';

export interface ProfileRow {
  id: string;
  email: string | null;
  display_name: string | null;
  onboarded: boolean;
  language: DbLanguage;
  script: DbScript;
  session_size: DbSessionSize;
  pinyin_display: DbPinyinDisplay;
  review_style: DbReviewStyle;
  speech_speed: DbSpeechSpeed;
  tone_colors_enabled: boolean;
  sound_enabled: boolean;
  tutorial_hints_enabled: boolean;
  dark_mode_enabled: boolean;
  offline_mode_enabled: boolean;
  current_session_index: number;
}

export type ProfileUpdate = Partial<
  Pick<
    ProfileRow,
    | 'email'
    | 'display_name'
    | 'onboarded'
    | 'language'
    | 'script'
    | 'session_size'
    | 'pinyin_display'
    | 'review_style'
    | 'speech_speed'
    | 'tone_colors_enabled'
    | 'sound_enabled'
    | 'tutorial_hints_enabled'
    | 'dark_mode_enabled'
    | 'offline_mode_enabled'
    | 'current_session_index'
  >
>;

export interface AppProfileState {
  authName: string;
  authEmail: string;
  onboarded: boolean;
  scriptChoice: ScriptChoice;
  sessionSize: SessionSize;
  settings: SettingsState;
}

const profileColumns = [
  'id',
  'email',
  'display_name',
  'onboarded',
  'language',
  'script',
  'session_size',
  'pinyin_display',
  'review_style',
  'speech_speed',
  'tone_colors_enabled',
  'sound_enabled',
  'tutorial_hints_enabled',
  'dark_mode_enabled',
  'offline_mode_enabled',
  'current_session_index',
].join(', ');

export function languageToDb(value: AppLanguage): DbLanguage {
  return value === 'Indonesian' ? 'id' : 'en';
}

function languageFromDb(value: string | null | undefined): AppLanguage {
  return value === 'id' ? 'Indonesian' : 'English';
}

export function scriptToDb(value: ScriptChoice): DbScript {
  return value === 'Traditional' ? 'traditional' : 'simplified';
}

function scriptFromDb(value: string | null | undefined): ScriptChoice {
  return value === 'traditional' ? 'Traditional' : 'Simplified';
}

export function sessionSizeToDb(value: SessionSize): DbSessionSize {
  if (value === 'Light') return 'light';
  if (value === 'Intense') return 'intense';
  return 'standard';
}

function sessionSizeFromDb(value: string | null | undefined): SessionSize {
  if (value === 'light') return 'Light';
  if (value === 'intense') return 'Intense';
  return 'Standard';
}

export function pinyinDisplayToDb(value: PinyinDisplay): DbPinyinDisplay {
  if (value === 'Lesson only') return 'learning_only';
  if (value === 'Hidden in review') return 'hidden_in_review';
  if (value === 'Off') return 'off';
  return 'always';
}

function pinyinDisplayFromDb(value: string | null | undefined): PinyinDisplay {
  if (value === 'learning_only') return 'Lesson only';
  if (value === 'hidden_in_review') return 'Hidden in review';
  if (value === 'off') return 'Off';
  return 'Always';
}

export function reviewStyleToDb(value: ReviewStyle): DbReviewStyle {
  if (value === 'Mixed') return 'mixed';
  if (value === 'Typed') return 'typed';
  return 'choice';
}

function reviewStyleFromDb(value: string | null | undefined): ReviewStyle {
  if (value === 'mixed') return 'Mixed';
  if (value === 'typed') return 'Typed';
  return 'Simple';
}

export function speechSpeedToDb(value: SpeechSpeed): DbSpeechSpeed {
  if (value === 'Slow') return 'slow';
  if (value === 'Fast') return 'fast';
  return 'normal';
}

function speechSpeedFromDb(value: string | null | undefined): SpeechSpeed {
  if (value === 'slow') return 'Slow';
  if (value === 'fast') return 'Fast';
  return 'Normal';
}

export function profileRowToAppState(row: ProfileRow, fallbackUser?: SupabaseUser): AppProfileState {
  return {
    authName: row.display_name?.trim() || (fallbackUser ? displayNameFromUser(fallbackUser) : 'Learner'),
    authEmail: row.email?.trim() || fallbackUser?.email || '',
    onboarded: row.onboarded === true,
    scriptChoice: scriptFromDb(row.script),
    sessionSize: sessionSizeFromDb(row.session_size),
    settings: {
      pinyinDisplay: pinyinDisplayFromDb(row.pinyin_display),
      reviewStyle: reviewStyleFromDb(row.review_style),
      speechSpeed: speechSpeedFromDb(row.speech_speed),
      toneColors: row.tone_colors_enabled !== false,
      sound: row.sound_enabled !== false,
      hints: row.tutorial_hints_enabled !== false,
      language: languageFromDb(row.language),
      dark: row.dark_mode_enabled === true,
      offline: row.offline_mode_enabled === true,
    },
  };
}

export async function fetchOrCreateProfile(user: SupabaseUser) {
  if (!isSupabaseConfigured || !supabase) {
    return { profile: null, error: null };
  }

  const { data, error } = await supabase.from('profiles').select(profileColumns).eq('id', user.id).maybeSingle();

  if (error) {
    return { profile: null, error };
  }

  if (data) {
    return { profile: profileRowToAppState(data as unknown as ProfileRow, user), error: null };
  }

  const displayName = displayNameFromUser(user);
  const { data: created, error: createError } = await supabase
    .from('profiles')
    .upsert(
      {
        id: user.id,
        email: user.email ?? null,
        display_name: displayName,
      },
      { onConflict: 'id' },
    )
    .select(profileColumns)
    .single();

  if (createError) {
    return { profile: null, error: createError };
  }

  return { profile: profileRowToAppState(created as unknown as ProfileRow, user), error: null };
}

export async function updateCurrentProfile(patch: ProfileUpdate) {
  if (!isSupabaseConfigured || !supabase || Object.keys(patch).length === 0) {
    return { error: null };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    return { error: userError };
  }

  if (!user) {
    return { error: null };
  }

  const { error } = await supabase.from('profiles').update(patch).eq('id', user.id);
  return { error };
}
