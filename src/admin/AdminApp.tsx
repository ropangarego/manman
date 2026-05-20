import { lazy, Suspense, useEffect, useState } from 'react';
import { AdminLayout } from './AdminLayout';
import { replaceWith } from '../utils/navigation';

const AdminPacksPage = lazy(() => import('./AdminPacksPage'));
const AdminPackDetailPage = lazy(() => import('./AdminPackDetailPage'));
const AdminReportsPage = lazy(() => import('./AdminReportsPage'));

export default function AdminApp() {
  const [path, setPath] = useState(() => window.location.pathname);

  useEffect(() => {
    const sync = () => setPath(window.location.pathname);
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, []);

  useEffect(() => {
    if (path === '/admin') {
      replaceWith('/admin/packs');
    }
  }, [path]);

  const packMatch = path.match(/^\/admin\/packs\/([^/]+)/);
  const content = packMatch ? (
    <AdminPackDetailPage packId={decodeURIComponent(packMatch[1])} />
  ) : path.startsWith('/admin/reports') ? (
    <AdminReportsPage />
  ) : (
    <AdminPacksPage />
  );

  return (
    <AdminLayout>
      <Suspense fallback={<div className="admin-loading">Loading admin page...</div>}>{content}</Suspense>
    </AdminLayout>
  );
}
