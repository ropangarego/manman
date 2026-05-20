import type { ReactNode } from 'react';
import { navigateTo } from '../utils/navigation';

export function AdminLayout({ children }: { children: ReactNode }) {
  const path = typeof window === 'undefined' ? '/admin/packs' : window.location.pathname;

  return (
    <section className="admin-shell">
      <header className="admin-header">
        <div className="admin-header-main">
          <button className="admin-back" type="button" onClick={() => navigateTo('/')}>
            &larr; App
          </button>
          <h1>Admin</h1>
        </div>
        <nav className="admin-tabs" aria-label="Admin navigation">
          <button
            className={path.startsWith('/admin/packs') ? 'active' : ''}
            type="button"
            onClick={() => navigateTo('/admin/packs')}
          >
            Pack QA
          </button>
          <button
            className={path.startsWith('/admin/reports') ? 'active' : ''}
            type="button"
            onClick={() => navigateTo('/admin/reports')}
          >
            Reports
          </button>
        </nav>
      </header>
      {children}
    </section>
  );
}
