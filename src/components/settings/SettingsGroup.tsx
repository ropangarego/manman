import type { ReactNode } from 'react';

interface SettingsGroupProps {
  title: string;
  children: ReactNode;
}

export function SettingsGroup({ title, children }: SettingsGroupProps) {
  return (
    <section className="settings-group">
      <h3>{title}</h3>
      {children}
    </section>
  );
}

