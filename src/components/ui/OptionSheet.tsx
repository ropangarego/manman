import { useEffect, useRef, type ReactNode } from 'react';

export interface SheetOption {
  label: string;
  value: string;
  sub?: string;
  disabled?: boolean;
}

interface OptionSheetProps {
  open: boolean;
  title: string;
  sub?: string;
  options?: SheetOption[];
  current?: string;
  children?: ReactNode;
  footer?: ReactNode;
  className?: string;
  onClose: () => void;
  onSelect?: (value: string) => void;
}

export function OptionSheet({
  open,
  title,
  sub,
  options = [],
  current,
  children,
  footer,
  className = '',
  onClose,
  onSelect,
}: OptionSheetProps) {
  const dialogRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const dialog = dialogRef.current;
    const focusableSelector =
      'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])';
    const focusable = dialog ? Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector)) : [];
    focusable[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab' || focusable.length === 0) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previousFocus?.focus();
    };
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="modal-layer"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        ref={dialogRef}
        className={`option-sheet ${className}`.trim()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="sheet-head">
          <div>
            <h3>{title}</h3>
            {sub ? <p>{sub}</p> : null}
          </div>
          <button className="sheet-close" type="button" aria-label="Close" onClick={onClose}>
            ×
          </button>
        </div>

        {options.length > 0 ? (
          <div className="option-list">
            {options.map((option) => {
              const selected = option.value === current;
              return (
                <button
                  className={`sheet-option${selected ? ' selected' : ''}`}
                  disabled={option.disabled}
                  key={option.value}
                  type="button"
                  onClick={() => onSelect?.(option.value)}
                >
                  <span>
                    <strong>{option.label}</strong>
                    {option.sub ? <small>{option.sub}</small> : null}
                  </span>
                  <em>{selected ? '✓' : option.disabled ? 'Soon' : ''}</em>
                </button>
              );
            })}
          </div>
        ) : null}

        {children}
        {footer}
      </section>
    </div>
  );
}
