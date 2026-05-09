import { create } from 'zustand';
import type {
  Familiarity,
  LibraryTab,
  PinyinDisplay,
  ReviewStyle,
  ScriptChoice,
  SessionSize,
  Stage,
} from '../data/mockContent';

export type Screen = 'home' | 'study' | 'library' | 'progress' | 'settings';
export type OnboardingStep = 'welcome' | 'script' | 'familiarity' | 'session' | 'placement' | 'recommend';
export type SheetType =
  | 'stage'
  | 'sessionSize'
  | 'script'
  | 'pinyin'
  | 'reviewStyle'
  | 'language'
  | 'downloads'
  | 'report'
  | 'logout';

interface SettingsState {
  pinyinDisplay: PinyinDisplay;
  reviewStyle: ReviewStyle;
  toneColors: boolean;
  sound: boolean;
  hints: boolean;
  language: 'English' | 'Indonesian';
  dark: boolean;
  offline: boolean;
}

type ToggleSettingKey = 'toneColors' | 'sound' | 'hints' | 'dark' | 'offline';

const THEME_STORAGE_KEY = 'mandarin-theme';

function getInitialDarkMode() {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.localStorage.getItem(THEME_STORAGE_KEY) === 'dark';
}

function syncDarkMode(enabled: boolean) {
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    return;
  }

  document.documentElement.classList.toggle('dark', enabled);
  window.localStorage.setItem(THEME_STORAGE_KEY, enabled ? 'dark' : 'light');
}

function toggleToast(key: ToggleSettingKey, enabled: boolean) {
  const labels: Record<ToggleSettingKey, string> = {
    toneColors: 'Tone colors',
    sound: 'Sound',
    hints: 'Tutorial hints',
    dark: enabled ? 'Dark mode' : 'Light mode',
    offline: 'Offline mode',
  };

  if (key === 'dark') {
    return `${labels.dark} enabled`;
  }

  return `${labels[key]} turned ${enabled ? 'on' : 'off'}`;
}

interface AppState {
  onboarded: boolean;
  onboardingStep: OnboardingStep;
  screen: Screen;
  scriptChoice: ScriptChoice;
  familiarity: Familiarity;
  sessionSize: SessionSize;
  placementAnswer: string;
  placementScore: number;
  libraryTab: LibraryTab;
  libraryStage: Stage | 'All';
  librarySearch: string;
  selectedItemId: string | null;
  libraryLimit: number;
  activeSheet: SheetType | null;
  toast: string;
  settings: SettingsState;
  setScreen: (screen: Screen) => void;
  setOnboardingStep: (step: OnboardingStep) => void;
  chooseScript: (script: ScriptChoice) => void;
  chooseFamiliarity: (familiarity: Familiarity) => void;
  chooseSessionSize: (size: SessionSize) => void;
  answerPlacement: (answer: string) => void;
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
  confirmLogout: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  onboarded: false,
  onboardingStep: 'welcome',
  screen: 'home',
  scriptChoice: 'Simplified',
  familiarity: 'beginner',
  sessionSize: 'Standard',
  placementAnswer: '',
  placementScore: 0,
  libraryTab: 'All',
  libraryStage: 'All',
  librarySearch: '',
  selectedItemId: null,
  libraryLimit: 5,
  activeSheet: null,
  toast: '',
  settings: {
    pinyinDisplay: 'Always',
    reviewStyle: 'Simple',
    toneColors: true,
    sound: true,
    hints: true,
    language: 'English',
    dark: getInitialDarkMode(),
    offline: true,
  },
  setScreen: (screen) =>
    set({
      screen,
      activeSheet: null,
    }),
  setOnboardingStep: (onboardingStep) => set({ onboardingStep }),
  chooseScript: (scriptChoice) => set({ scriptChoice }),
  chooseFamiliarity: (familiarity) => set({ familiarity }),
  chooseSessionSize: (sessionSize) => set({ sessionSize }),
  answerPlacement: (placementAnswer) =>
    set({
      placementAnswer,
      placementScore: placementAnswer === 'hello' ? 2 : 0,
    }),
  finishOnboarding: () =>
    set({
      onboarded: true,
      screen: 'home',
      activeSheet: null,
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

        return {
          sessionSize: value as SessionSize,
          activeSheet: null,
          toast: `Session size updated to ${value}`,
        };
      }

      if (sheet === 'script') {
        if ((state.scriptChoice === 'Not sure' ? 'Simplified' : state.scriptChoice) === value) {
          return { activeSheet: null };
        }

        return {
          scriptChoice: value as ScriptChoice,
          activeSheet: null,
          toast: `Script changed to ${value}`,
        };
      }

      if (sheet === 'pinyin') {
        if (state.settings.pinyinDisplay === value) {
          return { activeSheet: null };
        }

        return {
          settings: { ...state.settings, pinyinDisplay: value as PinyinDisplay },
          activeSheet: null,
          toast: `Pinyin display updated to ${value}`,
        };
      }

      if (sheet === 'reviewStyle') {
        if (state.settings.reviewStyle === value) {
          return { activeSheet: null };
        }

        return {
          settings: { ...state.settings, reviewStyle: value as ReviewStyle },
          activeSheet: null,
          toast: `Review style updated to ${value}`,
        };
      }

      if (sheet === 'language') {
        if (state.settings.language === value) {
          return { activeSheet: null };
        }

        return {
          settings: { ...state.settings, language: value as SettingsState['language'] },
          activeSheet: null,
          toast: `Language changed to ${value}`,
        };
      }

      if (sheet === 'downloads') {
        if (value === 'Downloaded') {
          return { activeSheet: null };
        }

        return {
          activeSheet: null,
          toast: 'Offline content refreshed.',
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

      if (key === 'dark') {
        syncDarkMode(nextValue);
      }

      return {
        settings: {
          ...state.settings,
          [key]: nextValue,
        },
        toast: toggleToast(key, nextValue),
      };
    }),
  showToast: (toast) => set({ toast }),
  clearToast: () => set({ toast: '' }),
  confirmLogout: () =>
    set({
      onboarded: false,
      onboardingStep: 'welcome',
      screen: 'home',
      activeSheet: null,
      toast: 'Logged out.',
    }),
}));
