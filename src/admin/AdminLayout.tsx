import type { ReactNode } from 'react';
import { navigateTo } from '../utils/navigation';

export function AdminLayout({ children }: { children: ReactNode }) {
  const path = typeof window === 'undefined' ? '/admin/packs' : window.location.pathname;

  return (
    <section className="admin-shell">
      <header className="admin-header">
        <div>
          <button className="admin-back" type="button" onClick={() => navigateTo('/')}>
            ← Learner app
          </button>
          <h1>Admin Panel</h1>
          <p>Internal Mandarin pack QA and user reports.</p>
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
