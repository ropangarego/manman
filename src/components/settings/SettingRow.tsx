import type { ReactNode } from 'react';
import { Toggle } from '../ui/Toggle';

interface SettingRowProps {
  title: string;
  subtitle: string;
  value?: string;
  onClick?: () => void;
  toggle?: {
    checked: boolean;
    onChange: () => void;
  };
  danger?: boolean;
  children?: ReactNode;
}

export function SettingRow({ title, subtitle, value, onClick, toggle, danger = false, children }: SettingRowProps) {
  if (toggle) {
    return (
      <div className="setting-row">
        <div>
          <b>{title}</b>
          <small>{subtitle}</small>
        </div>
        <Toggle checked={toggle.checked} label={`Toggle ${title}`} onChange={toggle.onChange} />
      </div>
    );
  }

  return (
    <button
      className={`setting-row clickable${danger ? ' logout-row' : ''}`}
      type="button"
      onClick={onClick}
    >
      <div>
        <b>{title}</b>
        <small>{subtitle}</small>
      </div>
      {children ?? (
        <span className="value setting-value">
          {value ? <span>{value}</span> : null}
          <span className="setting-arrow" aria-hidden="true">
            &rsaquo;
          </span>
        </span>
      )}
    </button>
  );
}
