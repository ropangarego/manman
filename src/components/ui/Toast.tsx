import { useEffect } from 'react';
import { useAppStore } from '../../stores/appStore';

export function Toast() {
  const toast = useAppStore((state) => state.toast);
  const clearToast = useAppStore((state) => state.clearToast);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timeout = window.setTimeout(clearToast, 1800);
    return () => window.clearTimeout(timeout);
  }, [clearToast, toast]);

  if (!toast) {
    return null;
  }

  return (
    <div className="toast" role="status" aria-live="polite">
      <span className="toast-check" aria-hidden="true">
        ✓
      </span>
      <span>{toast}</span>
    </div>
  );
}
