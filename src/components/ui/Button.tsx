import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

export function Button({ children, variant = 'primary', fullWidth = false, className = '', ...props }: ButtonProps) {
  const variantClass = variant === 'danger' ? 'danger-btn' : variant;
  return (
    <button className={`${variantClass}${fullWidth ? ' full-width' : ''} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}

