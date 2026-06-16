import { create } from 'zustand';
import { createJSONStorage, persist, type PersistStorage } from 'zustand/middleware';
import type {
  Familiarity,
  IntroPathStatus,
  LibraryStage,
  LibraryTab,
  PinyinDisplay,
  ReviewStyle,
  ScriptChoice,
  SessionSize,
} from '../data/mockContent';
import { packIdForSessionIndex, recommendedSessionIndexForPlacement } from '../data/mockContent';
import { optionLabel, translate, type AppLanguage } from '../i18n/copy';
import {
  languageToDb,
  pinyinDisplayToDb,
  reviewStyleToDb,
  scriptToDb,
  sessionSizeToDb,
  speechSpeedToDb,
  updateCurrentProfile,
  type AppProfileState,
  type ProfileUpdate,
} from '../lib/profileSync';
import type { SpeechSpeed } from '../utils/audio';

export type Screen = 'home' | 'study' | 'library' | 'progress' | 'settings';
export type OnboardingStep = 'welcome' | 'script' | 'familiarity' | 'session' | 'placement' | 'recommend' | 'introChoice';
export type AuthMode = 'signin' | 'signup';
export type SheetType =
  | 'stage'
  | 'sessionSize'
  | 'script'
  | 'pinyin'
  | 'reviewStyle'
  | 'speechSpeed'
  | 'language'
  | 'downloads'
  | 'installApp'
  | 'forgotPassword'
  | 'updatePassword'
  | 'editProfile'
  | 'changePassword'
  | 'resetLearningProgress'
  | 'report'
  | 'logout';

export interface ReportContext {
  page: string;
  packId?: string;
  itemType?: 'hanzi' | 'word' | 'sentence' | 'pattern';
  itemId?: string;
  metadata?: Record<string, unknown>;
}

export interface SettingsState {
  pinyinDisplay: PinyinDisplay;
  reviewStyle: ReviewStyle;
  speechSpeed: SpeechSpeed;
  toneColors: boolean;
  sound: boolean;
  hints: boolean;
  language: AppLanguage;
  dark: boolean;
  offline: boolean;
}

type ToggleSettingKey = 'toneColors' | 'sound' | 'hints' | 'dark' | 'offline';

export const PREFERENCES_STORAGE_KEY = 'mandarin-app-preferences';
const PREFERENCES_VERSION = 3;
const LEGACY_THEME_STORAGE_KEY = 'mandarin-theme';
const PROGRESS_STORAGE_KEY = 'mandarin-learning-progress';
const STUDY_STORAGE_KEY = 'mandarin-study-position';

const SESSION_SIZES = ['Light', 'Standard', 'Intense'] as const;
const SCRIPT_CHOICES = ['Simplified', 'Traditional', 'Not sure'] as const;
const PINYIN_OPTIONS = ['Always', 'Lesson only', 'Hidden in review', 'Off'] as const;
const REVIEW_STYLES = ['Simple', 'Mixed', 'Typed'] as const;
const SPEECH_SPEEDS = ['Slow', 'Normal', 'Fast'] as const;
const LANGUAGES = ['English', 'Indonesian'] as const;

const DEFAULT_SETTINGS: SettingsState = {
  pinyinDisplay: 'Always',
  reviewStyle: 'Simple',
  speechSpeed: 'Normal',
  toneColors: true,
  sound: true,
  hints: true,
  language: 'English',
  dark: false,
  offline: true,
};

interface PersistedAppState {
  signedIn: boolean;
  authName: string;
  authEmail: string;
  onboarded: boolean;
  scriptChoice: ScriptChoice;
  sessionSize: SessionSize;
  recommendedSessionIndex: number;
  currentPackId: string | null;
  introStatus: IntroPathStatus;
  settings: SettingsState;
}

function createDefaultPersistedState(): PersistedAppState {
  return {
    signedIn: false,
    authName: '',
    authEmail: '',
    onboarded: false,
    scriptChoice: 'Simplified',
    sessionSize: 'Standard',
    recommendedSessionIndex: 0,
    currentPackId: null,
    introStatus: 'not_required',
    settings: { ...DEFAULT_SETTINGS },
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function pickOption<T extends string>(value: unknown, options: readonly T[], fallback: T): T {
  return typeof value === 'string' && options.includes(value as T) ? (value as T) : fallback;
}

function pickBoolean(value: unknown, fallback: boolean) {
  return typeof value === 'boolean' ? value : fallback;
}

function pickNonNegativeNumber(value: unknown, fallback: number) {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : fallback;
}

function pickIntroStatus(value: unknown): IntroPathStatus {
  return value === 'required' || value === 'optional' || value === 'completed' || value === 'skipped'
    ? value
    : 'not_required';
}

function normalizeScriptPreference(script: ScriptChoice): ScriptChoice {
  return script === 'Traditional' ? 'Traditional' : 'Simplified';
}

function sanitizeSettings(value: unknown): SettingsState {
  const saved = isRecord(value) ? value : {};

  return {
    pinyinDisplay: pickOption(saved.pinyinDisplay, PINYIN_OPTIONS, DEFAULT_SETTINGS.pinyinDisplay),
    reviewStyle: pickOption(saved.reviewStyle, REVIEW_STYLES, DEFAULT_SETTINGS.reviewStyle),
    speechSpeed: pickOption(saved.speechSpeed, SPEECH_SPEEDS, DEFAULT_SETTINGS.speechSpeed),
    toneColors: pickBoolean(saved.toneColors, DEFAULT_SETTINGS.toneColors),
    sound: pickBoolean(saved.sound, DEFAULT_SETTINGS.sound),
    hints: pickBoolean(saved.hints, DEFAULT_SETTINGS.hints),
    language: pickOption(saved.language, LANGUAGES, DEFAULT_SETTINGS.language),
    dark: pickBoolean(saved.dark, DEFAULT_SETTINGS.dark),
    offline: pickBoolean(saved.offline, DEFAULT_SETTINGS.offline),
  };
}

function sanitizePersistedState(value: unknown): PersistedAppState | null {
  if (!isRecord(value)) {
    return null;
  }

  const scriptChoice = pickOption(value.scriptChoice, SCRIPT_CHOICES, 'Simplified');

  return {
    signedIn: value.signedIn === true,
    authName: typeof value.authName === 'string' ? value.authName : '',
    authEmail: typeof value.authEmail === 'string' ? value.authEmail : '',
    onboarded: value.onboarded === true,
    scriptChoice: normalizeScriptPreference(scriptChoice),
    sessionSize: pickOption(value.sessionSize, SESSION_SIZES, 'Standard'),
    recommendedSessionIndex: pickNonNegativeNumber(value.recommendedSessionIndex, 0),
    currentPackId: typeof value.currentPackId === 'string' ? value.currentPackId : null,
    introStatus: pickIntroStatus(value.introStatus),
    settings: sanitizeSettings(value.settings),
  };
}

function readStoredDarkMode() {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const rawPreferences = window.localStorage.getItem(PREFERENCES_STORAGE_KEY);

    if (rawPreferences) {
      const preferences = JSON.parse(rawPreferences) as unknown;

      if (isRecord(preferences)) {
        const persisted = sanitizePersistedState(preferences.state);
        return persisted?.settings.dark ?? false;
      }
    }

    return window.localStorage.getItem(LEGACY_THEME_STORAGE_KEY) === 'dark';
  } catch {
    return false;
  }
}

function clearStoredPreferences() {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.removeItem(PREFERENCES_STORAGE_KEY);
    window.localStorage.removeItem(LEGACY_THEME_STORAGE_KEY);
    window.localStorage.removeItem(PROGRESS_STORAGE_KEY);
    window.localStorage.removeItem(STUDY_STORAGE_KEY);
  } catch {
    // Storage can be unavailable in private or restricted browser contexts.
  }
}

function getInitialDarkMode() {
  return readStoredDarkMode();
}

function applyDarkMode(enabled: boolean) {
  if (typeof document === 'undefined') {
    return;
  }

  document.documentElement.classList.toggle('dark', enabled);

  if (typeof window !== 'undefined') {
    try {
      window.localStorage.removeItem(LEGACY_THEME_STORAGE_KEY);
    } catch {
      // Theme still applies even if storage cleanup is unavailable.
    }
  }
}

function createPreferencesStorage(): PersistStorage<PersistedAppState> | undefined {
  const storage = createJSONStorage<PersistedAppState>(() => window.localStorage);

  if (!storage) {
    return undefined;
  }

  return {
    getItem: storage.getItem,
    setItem: (name, value) => {
      if (!value.state.onboarded) {
        clearStoredPreferences();
        return;
      }

      return storage.setItem(name, value);
    },
    removeItem: storage.removeItem,
  };
}

function toggleToast(key: ToggleSettingKey, enabled: boolean, language: AppLanguage) {
  if (key === 'dark') {
    return translate(language, enabled ? 'toast.darkEnabled' : 'toast.lightEnabled');
  }

  const toastKeys: Record<ToggleSettingKey, [Parameters<typeof translate>[1], Parameters<typeof translate>[1]]> = {
    toneColors: ['toast.toneColorsOn', 'toast.toneColorsOff'],
    sound: ['toast.soundOn', 'toast.soundOff'],
    hints: ['toast.hintsOn', 'toast.hintsOff'],
    dark: ['toast.darkEnabled', 'toast.lightEnabled'],
    offline: ['toast.offlineOn', 'toast.offlineOff'],
  };

  return translate(language, enabled ? toastKeys[key][0] : toastKeys[key][1]);
}

interface AppState {
  signedIn: boolean;
  role: 'user' | 'admin';
  authMode: AuthMode;
  authName: string;
  authEmail: string;
  onboarded: boolean;
  onboardingStep: OnboardingStep;
  screen: Screen;
  scriptChoice: ScriptChoice;
  familiarity: Familiarity;
  sessionSize: SessionSize;
  placementAnswer: string;
  placementAnswers: Record<string, string>;
  placementScore: number;
  recommendedSessionIndex: number;
  currentPackId: string | null;
  introStatus: IntroPathStatus;
  libraryTab: LibraryTab;
  libraryStage: LibraryStage;
  librarySearch: string;
  selectedItemId: string | null;
  libraryLimit: number;
  activeSheet: SheetType | null;
  reportContext: ReportContext | null;
  toast: string;
  settings: SettingsState;
  setAuthMode: (mode: AuthMode) => void;
  completeAuth: (payload: { mode: AuthMode; name?: string; email: string }) => void;
  syncAuthenticatedUser: (payload: { name?: string; email: string }) => void;
  applyRemoteProfile: (profile: AppProfileState) => void;
  syncSignedOut: () => void;
  updateProfile: (payload: { name: string; email: string }) => void;
  setScreen: (screen: Screen) => void;
  setOnboardingStep: (step: OnboardingStep) => void;
  chooseScript: (script: ScriptChoice) => void;
  chooseFamiliarity: (familiarity: Familiarity) => void;
  chooseSessionSize: (size: SessionSize) => void;
  answerPlacement: (questionId: string, answer: string, correctAnswer: string) => void;
  finishOnboarding: (payload?: { startWithIntro?: boolean; recommendedSessionIndex?: number; introStatus?: IntroPathStatus; placementTotal?: number }) => void;
  completeIntroPack: () => void;
  syncStudyPosition: (sessionIndex: number) => void;
  openSheet: (sheet: SheetType) => void;
  openReport: (context: ReportContext) => void;
  closeSheet: () => void;
  chooseSheetValue: (sheet: SheetType, value: string) => void;
  setLibrarySearch: (search: string) => void;
  setLibraryTab: (tab: LibraryTab) => void;
  selectLibraryItem: (id: string | null) => void;
  loadMoreLibraryItems: () => void;
  toggleSetting: (key: ToggleSettingKey) => void;
  showToast: (message: string) => void;
  clearToast: () => void;
  confirmLogout: () => void;
}

function syncProfilePatch(
  patch: ProfileUpdate,
  set: (partial: Partial<AppState> | ((state: AppState) => Partial<AppState>)) => void,
) {
  void updateCurrentProfile(patch).then(({ error }) => {
    if (!error) {
      return;
    }

    set((state) => ({ toast: translate(state.settings.language, 'toast.profileSyncError') }));
  });
}

export const useAppStore = create<AppState>()(
  persist<AppState, [], [], PersistedAppState>(
    (set) => ({
  signedIn: false,
  role: 'user',
  authMode: 'signin',
  authName: '',
  authEmail: '',
  onboarded: false,
  onboardingStep: 'welcome',
  screen: 'home',
  scriptChoice: 'Simplified',
  familiarity: 'beginner',
  sessionSize: 'Standard',
  placementAnswer: '',
  placementAnswers: {},
  placementScore: 0,
  recommendedSessionIndex: 0,
  currentPackId: null,
  introStatus: 'not_required',
  libraryTab: 'All',
  libraryStage: 'All',
  librarySearch: '',
  selectedItemId: null,
  libraryLimit: 5,
  activeSheet: null,
  reportContext: null,
  toast: '',
  settings: {
    ...DEFAULT_SETTINGS,
    dark: getInitialDarkMode(),
  },
  setAuthMode: (authMode) => set({ authMode }),
  completeAuth: ({ mode, name, email }) =>
    set((state) => ({
      signedIn: true,
      role: 'user',
      authMode: mode,
      authName: name?.trim() || email.split('@')[0] || 'Learner',
      authEmail: email.trim(),
      toast: translate(state.settings.language, mode === 'signup' ? 'toast.accountCreated' : 'toast.signedIn'),
    })),
  syncAuthenticatedUser: ({ name, email }) =>
    set({
      signedIn: true,
      role: 'user',
      authMode: 'signin',
      authName: name?.trim() || email.split('@')[0] || 'Learner',
      authEmail: email.trim(),
    }),
  applyRemoteProfile: (profile) =>
    set((state) => {
      applyDarkMode(profile.settings.dark);

      return {
        signedIn: true,
        role: profile.role,
        authMode: 'signin',
        authName: profile.authName || state.authName,
        authEmail: profile.authEmail || state.authEmail,
        onboarded: profile.onboarded,
        scriptChoice: normalizeScriptPreference(profile.scriptChoice),
        sessionSize: profile.sessionSize,
        recommendedSessionIndex: profile.recommendedSessionIndex,
        currentPackId: profile.currentPackId,
        introStatus: profile.introStatus,
        settings: profile.settings,
        activeSheet: null,
      };
    }),
  syncSignedOut: () =>
    set({
      signedIn: false,
      role: 'user',
      authMode: 'signin',
      authName: '',
      authEmail: '',
      activeSheet: null,
    }),
  updateProfile: ({ name, email }) =>
    set((state) => ({
      authName: name.trim() || state.authName,
      authEmail: email.trim() || state.authEmail,
      toast: translate(state.settings.language, 'toast.profileUpdated'),
    })),
  setScreen: (screen) =>
    set({
      screen,
      activeSheet: null,
    }),
  setOnboardingStep: (onboardingStep) => set({ onboardingStep }),
  chooseScript: (scriptChoice) => {
    syncProfilePatch({ script: scriptToDb(scriptChoice) }, set);
    set({ scriptChoice });
  },
  chooseFamiliarity: (familiarity) => set({ familiarity }),
  chooseSessionSize: (sessionSize) => {
    syncProfilePatch({ session_size: sessionSizeToDb(sessionSize) }, set);
    set({ sessionSize });
  },
  answerPlacement: (questionId, placementAnswer, correctAnswer) =>
    set((state) => {
      const previousAnswer = state.placementAnswers[questionId];
      const previousScore = previousAnswer === correctAnswer ? 1 : 0;
      const nextScore = placementAnswer === correctAnswer ? 1 : 0;

      return {
        placementAnswer,
        placementAnswers: {
          ...state.placementAnswers,
          [questionId]: placementAnswer,
        },
        placementScore: Math.max(0, state.placementScore - previousScore + nextScore),
      };
    }),
  finishOnboarding: (payload) =>
    set((state) => {
      const scriptChoice = normalizeScriptPreference(state.scriptChoice);
      const placementTotal = payload?.placementTotal ?? Object.keys(state.placementAnswers).length;
      const recommendedSessionIndex =
        payload?.recommendedSessionIndex ??
        (state.familiarity === 'some'
          ? recommendedSessionIndexForPlacement(state.placementScore, placementTotal)
          : 0);
      const currentPackId = packIdForSessionIndex(recommendedSessionIndex);
      const introStatus =
        payload?.introStatus ??
        (payload?.startWithIntro ? (state.familiarity === 'beginner' ? 'required' : 'optional') : 'skipped');
      const placementResult = {
        familiarity: state.familiarity,
        score: state.placementScore,
        total: placementTotal,
        recommendedSessionIndex,
        introStatus,
      };

      syncProfilePatch(
        {
          onboarded: true,
          script: scriptToDb(scriptChoice),
          session_size: sessionSizeToDb(state.sessionSize),
          current_pack_external_id: currentPackId,
          current_session_index: recommendedSessionIndex,
          placement_result: placementResult,
        },
        set,
      );

      return {
        onboarded: true,
        screen: 'home',
        activeSheet: null,
        scriptChoice,
        recommendedSessionIndex,
        currentPackId,
        introStatus,
      };
    }),
  completeIntroPack: () =>
    set((state) => {
      const currentPackId = packIdForSessionIndex(state.recommendedSessionIndex);
      const placementResult = {
        familiarity: state.familiarity,
        score: state.placementScore,
        total: Object.keys(state.placementAnswers).length,
        recommendedSessionIndex: state.recommendedSessionIndex,
        introStatus: 'completed',
      };

      syncProfilePatch(
        {
          current_pack_external_id: currentPackId,
          current_session_index: state.recommendedSessionIndex,
          placement_result: placementResult,
        },
        set,
      );

      return {
        currentPackId,
        introStatus: 'completed',
      };
    }),
  syncStudyPosition: (sessionIndex) =>
    set(() => {
      const safeSessionIndex = Math.max(0, sessionIndex);
      const currentPackId = packIdForSessionIndex(safeSessionIndex);

      syncProfilePatch(
        {
          current_pack_external_id: currentPackId,
          current_session_index: safeSessionIndex,
        },
        set,
      );

      return { currentPackId };
    }),
  openSheet: (activeSheet) => set({ activeSheet }),
  openReport: (reportContext) => set({ activeSheet: 'report', reportContext }),
  closeSheet: () => set({ activeSheet: null }),
  chooseSheetValue: (sheet, value) =>
    set((state) => {
      if (sheet === 'stage') {
        return {
          libraryStage: value as LibraryStage,
          libraryLimit: 5,
          selectedItemId: null,
          activeSheet: null,
        };
      }

      if (sheet === 'sessionSize') {
        if (state.sessionSize === value) {
          return { activeSheet: null };
        }

        const language = state.settings.language;
        const sessionSize = value as SessionSize;

        syncProfilePatch({ session_size: sessionSizeToDb(sessionSize) }, set);

        return {
          sessionSize,
          activeSheet: null,
          toast: translate(language, 'toast.sessionSize', { value: optionLabel(language, value) }),
        };
      }

      if (sheet === 'script') {
        if ((state.scriptChoice === 'Not sure' ? 'Simplified' : state.scriptChoice) === value) {
          return { activeSheet: null };
        }

        const language = state.settings.language;
        const scriptChoice = value as ScriptChoice;

        syncProfilePatch({ script: scriptToDb(scriptChoice) }, set);

        return {
          scriptChoice,
          activeSheet: null,
          toast: translate(language, 'toast.script', { value: optionLabel(language, value) }),
        };
      }

      if (sheet === 'pinyin') {
        if (state.settings.pinyinDisplay === value) {
          return { activeSheet: null };
        }

        const language = state.settings.language;
        const pinyinDisplay = value as PinyinDisplay;

        syncProfilePatch({ pinyin_display: pinyinDisplayToDb(pinyinDisplay) }, set);

        return {
          settings: { ...state.settings, pinyinDisplay },
          activeSheet: null,
          toast: translate(language, 'toast.pinyin', { value: optionLabel(language, value) }),
        };
      }

      if (sheet === 'reviewStyle') {
        if (state.settings.reviewStyle === value) {
          return { activeSheet: null };
        }

        const language = state.settings.language;
        const reviewStyle = value as ReviewStyle;

        syncProfilePatch({ review_style: reviewStyleToDb(reviewStyle) }, set);

        return {
          settings: { ...state.settings, reviewStyle },
          activeSheet: null,
          toast: translate(language, 'toast.reviewStyle', { value: optionLabel(language, value) }),
        };
      }

      if (sheet === 'speechSpeed') {
        if (state.settings.speechSpeed === value) {
          return { activeSheet: null };
        }

        const language = state.settings.language;
        const speechSpeed = value as SpeechSpeed;

        syncProfilePatch({ speech_speed: speechSpeedToDb(speechSpeed) }, set);

        return {
          settings: { ...state.settings, speechSpeed },
          activeSheet: null,
          toast: translate(language, 'toast.speechSpeed', { value: optionLabel(language, value) }),
        };
      }

      if (sheet === 'language') {
        if (state.settings.language === value) {
          return { activeSheet: null };
        }

        const nextLanguage = value as SettingsState['language'];

        syncProfilePatch({ language: languageToDb(nextLanguage) }, set);

        return {
          settings: { ...state.settings, language: nextLanguage },
          activeSheet: null,
          toast: translate(nextLanguage, 'toast.language', { value: optionLabel(nextLanguage, value) }),
        };
      }

      if (sheet === 'downloads') {
        if (value === 'Downloaded') {
          return { activeSheet: null };
        }

        return {
          activeSheet: null,
          toast: translate(state.settings.language, 'toast.offlineRefresh'),
        };
      }

      return { activeSheet: null };
    }),
  setLibrarySearch: (librarySearch) =>
    set({
      librarySearch,
      libraryLimit: 5,
      selectedItemId: null,
    }),
  setLibraryTab: (libraryTab) =>
    set({
      libraryTab,
      libraryLimit: 5,
      selectedItemId: null,
    }),
  selectLibraryItem: (selectedItemId) => set({ selectedItemId }),
  loadMoreLibraryItems: () => set((state) => ({ libraryLimit: state.libraryLimit + 5 })),
  toggleSetting: (key) =>
    set((state) => {
      const nextValue = !state.settings[key];
      const profilePatchByKey: Record<ToggleSettingKey, ProfileUpdate> = {
        toneColors: { tone_colors_enabled: nextValue },
        sound: { sound_enabled: nextValue },
        hints: { tutorial_hints_enabled: nextValue },
        dark: { dark_mode_enabled: nextValue },
        offline: { offline_mode_enabled: nextValue },
      };

      if (key === 'dark') {
        applyDarkMode(nextValue);
      }

      syncProfilePatch(profilePatchByKey[key], set);

      return {
        settings: {
          ...state.settings,
          [key]: nextValue,
        },
        toast: toggleToast(key, nextValue, state.settings.language),
      };
    }),
  showToast: (toast) => set({ toast }),
  clearToast: () => set({ toast: '' }),
  confirmLogout: () => {
    applyDarkMode(false);

    set({
      onboarded: false,
      signedIn: false,
      role: 'user',
      authMode: 'signin',
      authName: '',
      authEmail: '',
      onboardingStep: 'welcome',
      screen: 'home',
      scriptChoice: 'Simplified',
      familiarity: 'beginner',
      sessionSize: 'Standard',
      placementAnswer: '',
      placementAnswers: {},
      placementScore: 0,
      recommendedSessionIndex: 0,
      currentPackId: null,
      introStatus: 'not_required',
      libraryTab: 'All',
      libraryStage: 'All',
      librarySearch: '',
      selectedItemId: null,
      libraryLimit: 5,
      activeSheet: null,
      reportContext: null,
      settings: { ...DEFAULT_SETTINGS },
      toast: translate('English', 'toast.logout'),
    });

    clearStoredPreferences();
  },
}),
    {
      name: PREFERENCES_STORAGE_KEY,
      version: PREFERENCES_VERSION,
      storage: createPreferencesStorage(),
      partialize: (state) => ({
        signedIn: state.signedIn,
        authName: state.authName,
        authEmail: state.authEmail,
        onboarded: state.onboarded,
        scriptChoice: normalizeScriptPreference(state.scriptChoice),
        sessionSize: state.sessionSize,
        recommendedSessionIndex: state.recommendedSessionIndex,
        currentPackId: state.currentPackId,
        introStatus: state.introStatus,
        settings: state.settings,
      }),
      migrate: (persistedState) => sanitizePersistedState(persistedState) ?? createDefaultPersistedState(),
      merge: (persistedState, currentState) => {
        const saved = sanitizePersistedState(persistedState);

        if (!saved) {
          return currentState;
        }

        return {
          ...currentState,
          signedIn: saved.signedIn,
          authName: saved.authName,
          authEmail: saved.authEmail,
          authMode: 'signin',
          onboarded: saved.onboarded,
          onboardingStep: 'welcome',
          screen: 'home',
          scriptChoice: saved.scriptChoice,
          sessionSize: saved.sessionSize,
          recommendedSessionIndex: saved.recommendedSessionIndex,
          currentPackId: saved.currentPackId,
          introStatus: saved.introStatus,
          activeSheet: null,
          toast: '',
          settings: saved.settings,
        };
      },
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          clearStoredPreferences();
          applyDarkMode(DEFAULT_SETTINGS.dark);
          return;
        }

        applyDarkMode(state?.settings.dark ?? DEFAULT_SETTINGS.dark);
      },
    },
  ),
);
