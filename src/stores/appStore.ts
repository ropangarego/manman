import { create } from 'zustand';
import { createJSONStorage, persist, type PersistStorage } from 'zustand/middleware';
import type {
  Familiarity,
  LibraryTab,
  PinyinDisplay,
  ReviewStyle,
  ScriptChoice,
  SessionSize,
  Stage,
} from '../data/mockContent';
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
export type OnboardingStep = 'welcome' | 'script' | 'familiarity' | 'session' | 'placement' | 'recommend';
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
  | 'editProfile'
  | 'changePassword'
  | 'resetLearningProgress'
  | 'report'
  | 'resetApp'
  | 'logout';

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
const PREFERENCES_VERSION = 2;
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

      if (isRecord(preferences) && preferences.version === PREFERENCES_VERSION) {
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
  libraryTab: LibraryTab;
  libraryStage: Stage | 'All';
  librarySearch: string;
  selectedItemId: string | null;
  libraryLimit: number;
  activeSheet: SheetType | null;
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
  finishOnboarding: () => void;
  openSheet: (sheet: SheetType) => void;
  closeSheet: () => void;
  chooseSheetValue: (sheet: SheetType, value: string) => void;
  setLibrarySearch: (search: string) => void;
  setLibraryTab: (tab: LibraryTab) => void;
  selectLibraryItem: (id: string | null) => void;
  loadMoreLibraryItems: () => void;
  toggleSetting: (key: ToggleSettingKey) => void;
  showToast: (message: string) => void;
  clearToast: () => void;
  resetAppState: () => void;
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
  libraryTab: 'All',
  libraryStage: 'All',
  librarySearch: '',
  selectedItemId: null,
  libraryLimit: 5,
  activeSheet: null,
  toast: '',
  settings: {
    ...DEFAULT_SETTINGS,
    dark: getInitialDarkMode(),
  },
  setAuthMode: (authMode) => set({ authMode }),
  completeAuth: ({ mode, name, email }) =>
    set((state) => ({
      signedIn: true,
      authMode: mode,
      authName: name?.trim() || email.split('@')[0] || 'Learner',
      authEmail: email.trim(),
      toast: translate(state.settings.language, mode === 'signup' ? 'toast.accountCreated' : 'toast.signedIn'),
    })),
  syncAuthenticatedUser: ({ name, email }) =>
    set({
      signedIn: true,
      authMode: 'signin',
      authName: name?.trim() || email.split('@')[0] || 'Learner',
      authEmail: email.trim(),
    }),
  applyRemoteProfile: (profile) =>
    set((state) => {
      applyDarkMode(profile.settings.dark);

      return {
        signedIn: true,
        authMode: 'signin',
        authName: profile.authName || state.authName,
        authEmail: profile.authEmail || state.authEmail,
        onboarded: profile.onboarded,
        scriptChoice: normalizeScriptPreference(profile.scriptChoice),
        sessionSize: profile.sessionSize,
        settings: profile.settings,
        activeSheet: null,
      };
    }),
  syncSignedOut: () =>
    set({
      signedIn: false,
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
  finishOnboarding: () =>
    set((state) => {
      const scriptChoice = normalizeScriptPreference(state.scriptChoice);

      syncProfilePatch(
        {
          onboarded: true,
          script: scriptToDb(scriptChoice),
          session_size: sessionSizeToDb(state.sessionSize),
        },
        set,
      );

      return {
        onboarded: true,
        screen: 'home',
        activeSheet: null,
        scriptChoice,
      };
    }),
  openSheet: (activeSheet) => set({ activeSheet }),
  closeSheet: () => set({ activeSheet: null }),
  chooseSheetValue: (sheet, value) =>
    set((state) => {
      if (sheet === 'stage') {
        return {
          libraryStage: value as Stage | 'All',
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
  resetAppState: () => {
    applyDarkMode(false);

    set({
      onboarded: false,
      signedIn: false,
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
      libraryTab: 'All',
      libraryStage: 'All',
      librarySearch: '',
      selectedItemId: null,
      libraryLimit: 5,
      activeSheet: null,
      settings: { ...DEFAULT_SETTINGS },
      toast: translate('English', 'toast.reset'),
    });

    clearStoredPreferences();
  },
  confirmLogout: () => {
    applyDarkMode(false);

    set({
      onboarded: false,
      signedIn: false,
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
      libraryTab: 'All',
      libraryStage: 'All',
      librarySearch: '',
      selectedItemId: null,
      libraryLimit: 5,
      activeSheet: null,
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
