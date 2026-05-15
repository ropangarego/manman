import { sessionPlanDescription } from '../../data/mockContent';
import { optionLabel } from '../../i18n/copy';
import { useTranslation } from '../../i18n/useTranslation';
import { useAppStore, type SheetType } from '../../stores/appStore';
import { useProgressStore } from '../../stores/progressStore';
import { Button } from './Button';
import { OptionSheet, type SheetOption } from './OptionSheet';
import { ReportIssueSheet } from '../study/ReportIssueSheet';

export function GlobalSheets() {
  const { language, t } = useTranslation();
  const activeSheet = useAppStore((state) => state.activeSheet);
  const closeSheet = useAppStore((state) => state.closeSheet);
  const chooseSheetValue = useAppStore((state) => state.chooseSheetValue);
  const libraryStage = useAppStore((state) => state.libraryStage);
  const sessionSize = useAppStore((state) => state.sessionSize);
  const scriptChoice = useAppStore((state) => state.scriptChoice);
  const settings = useAppStore((state) => state.settings);
  const resetAppState = useAppStore((state) => state.resetAppState);
  const confirmLogout = useAppStore((state) => state.confirmLogout);
  const resetProgress = useProgressStore((state) => state.resetProgress);

  const sheetConfigs: Partial<
    Record<SheetType, { title: string; sub?: string; current: string; options: SheetOption[] }>
  > = {
    stage: {
      title: t('sheets.stageTitle'),
      sub: t('sheets.stageSub'),
      current: 'All',
      options: ['All', 'Learning', 'Familiar', 'Strong', 'Mastered', 'Long-term'].map((value) => ({
        label: optionLabel(language, value),
        value,
      })),
    },
    sessionSize: {
      title: language === 'Indonesian' ? 'Ukuran sesi' : 'Session size',
      sub: t('sheets.sessionSizeSub'),
      current: 'Standard',
      options: ['Light', 'Standard', 'Intense'].map((value) => ({
        label: optionLabel(language, value),
        value,
        sub: sessionPlanDescription(value as 'Light' | 'Standard' | 'Intense', language),
      })),
    },
    script: {
      title: t('sheets.scriptTitle'),
      current: 'Simplified',
      options: [
        { label: optionLabel(language, 'Simplified'), value: 'Simplified', sub: t('onboarding.simplifiedSub') },
        { label: optionLabel(language, 'Traditional'), value: 'Traditional', sub: t('onboarding.traditionalSub') },
      ],
    },
    pinyin: {
      title: language === 'Indonesian' ? 'Tampilan pinyin' : 'Pinyin display',
      current: 'Always',
      options: [
        { label: t('sheets.pinyinAlways'), value: 'Always', sub: t('sheets.pinyinAlwaysSub') },
        { label: t('sheets.pinyinLessonOnly'), value: 'Lesson only', sub: t('sheets.pinyinLessonOnlySub') },
        { label: t('sheets.pinyinHidden'), value: 'Hidden in review', sub: t('sheets.pinyinHiddenSub') },
        { label: t('sheets.pinyinOff'), value: 'Off', sub: t('sheets.pinyinOffSub') },
      ],
    },
    reviewStyle: {
      title: language === 'Indonesian' ? 'Gaya review' : 'Review style',
      current: 'Simple',
      options: [
        { label: t('sheets.reviewSimple'), value: 'Simple', sub: t('sheets.reviewSimpleSub') },
        { label: t('sheets.reviewMixed'), value: 'Mixed', sub: t('sheets.reviewMixedSub') },
        { label: optionLabel(language, 'Typed'), value: 'Typed', sub: t('sheets.reviewTypedSub') },
      ],
    },
    language: {
      title: language === 'Indonesian' ? 'Bahasa' : 'Language',
      current: 'English',
      options: [
        { label: optionLabel(language, 'English'), value: 'English' },
        { label: optionLabel(language, 'Indonesian'), value: 'Indonesian' },
      ],
    },
    downloads: {
      title: t('sheets.downloadTitle'),
      sub: t('sheets.downloadSub'),
      current: 'Downloaded',
      options: [
        { label: t('sheets.downloaded'), value: 'Downloaded', sub: t('sheets.downloadedSub') },
        { label: t('sheets.refreshOffline'), value: 'Refresh', sub: t('sheets.refreshOfflineSub') },
      ],
    },
  };

  if (activeSheet === 'report') {
    return <ReportIssueSheet open onClose={closeSheet} />;
  }

  if (activeSheet === 'logout') {
    return (
      <OptionSheet
        open
        title={t('sheets.logoutTitle')}
        sub={t('sheets.logoutSub')}
        className="logout-sheet"
        onClose={closeSheet}
        footer={
          <div className="sheet-actions">
            <Button variant="secondary" type="button" onClick={closeSheet}>
              {t('common.cancel')}
            </Button>
            <Button
              variant="danger"
              type="button"
              onClick={() => {
                resetProgress();
                confirmLogout();
              }}
            >
              {t('common.logout')}
            </Button>
          </div>
        }
      />
    );
  }

  if (activeSheet === 'resetApp') {
    return (
      <OptionSheet
        open
        title={t('sheets.resetTitle')}
        sub={t('sheets.resetSub')}
        className="logout-sheet"
        onClose={closeSheet}
        footer={
          <div className="sheet-actions">
            <Button variant="secondary" type="button" onClick={closeSheet}>
              {t('common.cancel')}
            </Button>
            <Button
              variant="danger"
              type="button"
              onClick={() => {
                resetProgress();
                resetAppState();
              }}
            >
              {t('common.reset')}
            </Button>
          </div>
        }
      />
    );
  }

  if (!activeSheet) {
    return null;
  }

  const config = sheetConfigs[activeSheet];
  if (!config) {
    return null;
  }

  const currentBySheet: Record<string, string> = {
    stage: libraryStage,
    sessionSize,
    script: scriptChoice === 'Not sure' ? 'Simplified' : scriptChoice,
    pinyin: settings.pinyinDisplay,
    reviewStyle: settings.reviewStyle,
    language: settings.language,
    downloads: 'Downloaded',
  };

  return (
    <OptionSheet
      open
      title={config.title}
      sub={config.sub}
      options={config.options}
      current={currentBySheet[activeSheet] ?? config.current}
      onClose={closeSheet}
      onSelect={(value) => chooseSheetValue(activeSheet, value)}
    />
  );
}
