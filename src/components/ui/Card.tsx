import type { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  as?: 'section' | 'article' | 'div';
}

export function Card({ children, as: Element = 'section', className = '', ...props }: CardProps) {
  return (
    <Element className={`card ${className}`.trim()} {...props}>
      {children}
    </Element>
  );
}

