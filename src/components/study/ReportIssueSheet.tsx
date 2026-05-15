import { useState } from 'react';
import { translate } from '../../i18n/copy';
import { useTranslation } from '../../i18n/useTranslation';
import { useAppStore } from '../../stores/appStore';
import { Button } from '../ui/Button';
import { OptionSheet } from '../ui/OptionSheet';

const issueTypes = [
  'Meaning is wrong',
  'Pinyin is wrong',
  'Tone is wrong',
  'Example is unnatural',
  'Audio problem',
  'Typo',
  'Other',
];

interface ReportIssueSheetProps {
  open: boolean;
  onClose: () => void;
}

export function ReportIssueSheet({ open, onClose }: ReportIssueSheetProps) {
  const { language, t } = useTranslation();
  const [issueType, setIssueType] = useState('');
  const [note, setNote] = useState('');
  const showToast = useAppStore((state) => state.showToast);
  const localizedIssueTypes =
    language === 'Indonesian'
      ? ['Arti salah', 'Pinyin salah', 'Nada salah', 'Contoh kurang alami', 'Masalah audio', 'Typo', 'Lainnya']
      : issueTypes;

  return (
    <OptionSheet
      open={open}
      title={t('report.title')}
      sub={t('report.sub')}
      className="report-sheet"
      onClose={onClose}
    >
      <div className="option-list report-options">
        {localizedIssueTypes.map((type) => (
          <button
            className={`sheet-option${issueType === type ? ' selected' : ''}`}
            key={type}
            type="button"
            onClick={() => setIssueType(type)}
          >
            <span>
              <strong>{type}</strong>
            </span>
            <em>{issueType === type ? '✓' : ''}</em>
          </button>
        ))}
      </div>

      <label className="report-note">
        <span>
          {t('report.describe')} <small>({t('report.optional')})</small>
        </span>
        <textarea
          value={note}
          placeholder={t('report.placeholder')}
          onChange={(event) => setNote(event.target.value)}
        />
      </label>

      <div className="sheet-actions">
        <Button variant="secondary" type="button" onClick={onClose}>
          {t('common.cancel')}
        </Button>
        <Button
          type="button"
          disabled={!issueType}
          onClick={() => {
            showToast(translate(language, 'toast.reportSent'));
            setIssueType('');
            setNote('');
            onClose();
          }}
        >
          {t('report.submit')}
        </Button>
      </div>
    </OptionSheet>
  );
}
