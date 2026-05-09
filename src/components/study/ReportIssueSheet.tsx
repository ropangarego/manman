import { useState } from 'react';
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
  const [issueType, setIssueType] = useState('');
  const [note, setNote] = useState('');
  const showToast = useAppStore((state) => state.showToast);

  return (
    <OptionSheet
      open={open}
      title="Report issue"
      sub="What seems wrong with this item?"
      className="report-sheet"
      onClose={onClose}
    >
      <div className="option-list report-options">
        {issueTypes.map((type) => (
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
          Describe the issue <small>(optional)</small>
        </span>
        <textarea
          value={note}
          placeholder="Example: tone should be 3rd tone here..."
          onChange={(event) => setNote(event.target.value)}
        />
      </label>

      <div className="sheet-actions">
        <Button variant="secondary" type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="button"
          disabled={!issueType}
          onClick={() => {
            showToast('Thanks — your report was sent.');
            setIssueType('');
            setNote('');
            onClose();
          }}
        >
          Submit report
        </Button>
      </div>
    </OptionSheet>
  );
}

