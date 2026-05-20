import type { ButtonHTMLAttributes } from 'react';
import { useAppStore, type ReportContext } from '../../stores/appStore';

interface ReportIssueButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  context: ReportContext;
  label?: string;
}

export function ReportIssueButton({ context, label = 'Report an issue', className = '', ...props }: ReportIssueButtonProps) {
  const signedIn = useAppStore((state) => state.signedIn);
  const openReport = useAppStore((state) => state.openReport);

  if (!signedIn) {
    return null;
  }

  return (
    <button className={className} type="button" onClick={() => openReport(context)} {...props}>
      {label}
    </button>
  );
}
