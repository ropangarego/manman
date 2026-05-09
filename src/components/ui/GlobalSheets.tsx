import { sessionPlans } from '../../data/mockContent';
import { useAppStore, type SheetType } from '../../stores/appStore';
import { Button } from './Button';
import { OptionSheet, type SheetOption } from './OptionSheet';
import { ReportIssueSheet } from '../study/ReportIssueSheet';

const sheetConfigs: Partial<
  Record<SheetType, { title: string; sub?: string; current: string; options: SheetOption[] }>
> = {
  stage: {
    title: 'Choose stage',
    sub: 'Filter Library by memory strength.',
    current: 'All',
    options: ['All', 'Learning', 'Familiar', 'Strong', 'Mastered', 'Long-term'].map((value) => ({
      label: value,
      value,
    })),
  },
  sessionSize: {
    title: 'Session size',
    sub: 'Choose duration and daily load together.',
    current: 'Standard',
    options: [
      { label: 'Light', value: 'Light', sub: sessionPlans.Light.description },
      { label: 'Standard', value: 'Standard', sub: sessionPlans.Standard.description },
      { label: 'Intense', value: 'Intense', sub: sessionPlans.Intense.description },
    ],
  },
  script: {
    title: 'Script',
    current: 'Simplified',
    options: [
      { label: 'Simplified', value: 'Simplified', sub: 'Mainland China, Singapore, Malaysia.' },
      { label: 'Traditional', value: 'Traditional', sub: 'Taiwan, Hong Kong, Macau.' },
    ],
  },
  pinyin: {
    title: 'Pinyin display',
    current: 'Always',
    options: [
      { label: 'Always', value: 'Always', sub: 'Show pinyin in lessons and reviews.' },
      { label: 'Lesson only', value: 'Lesson only', sub: 'Show pinyin while learning, hide in reviews.' },
      { label: 'Hidden in review', value: 'Hidden in review', sub: 'Hide pinyin during review questions.' },
    ],
  },
  reviewStyle: {
    title: 'Review style',
    current: 'Simple',
    options: [
      { label: 'Simple', value: 'Simple', sub: 'Multiple choice with automatic feedback.' },
      { label: 'Mixed', value: 'Mixed', sub: 'Meaning, pinyin, tone, and sentence checks.' },
      { label: 'Typed', value: 'Typed', sub: 'Coming later.' },
    ],
  },
  language: {
    title: 'Language',
    current: 'English',
    options: [
      { label: 'English', value: 'English' },
      { label: 'Indonesian', value: 'Indonesian' },
    ],
  },
  downloads: {
    title: 'Manage downloads',
    sub: 'Offline pack storage.',
    current: 'Downloaded',
    options: [
      { label: 'Downloaded', value: 'Downloaded', sub: 'Foundations pack is ready offline.' },
      { label: 'Refresh offline content', value: 'Refresh', sub: 'Update the saved practice pack.' },
    ],
  },
};

export function GlobalSheets() {
  const activeSheet = useAppStore((state) => state.activeSheet);
  const closeSheet = useAppStore((state) => state.closeSheet);
  const chooseSheetValue = useAppStore((state) => state.chooseSheetValue);
  const libraryStage = useAppStore((state) => state.libraryStage);
  const sessionSize = useAppStore((state) => state.sessionSize);
  const scriptChoice = useAppStore((state) => state.scriptChoice);
  const settings = useAppStore((state) => state.settings);
  const confirmLogout = useAppStore((state) => state.confirmLogout);

  if (activeSheet === 'report') {
    return <ReportIssueSheet open onClose={closeSheet} />;
  }

  if (activeSheet === 'logout') {
    return (
      <OptionSheet
        open
        title="Logout?"
        sub="You can sign back in later. This will return to onboarding."
        className="logout-sheet"
        onClose={closeSheet}
        footer={
          <div className="sheet-actions">
            <Button variant="secondary" type="button" onClick={closeSheet}>
              Cancel
            </Button>
            <Button variant="danger" type="button" onClick={confirmLogout}>
              Logout
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
