import { useEffect, useMemo, useState } from 'react';
import { getQaReviews } from './adminApi';
import { getAdminPacks, reviewMap, statusForItem, type QaReview, type QaStatus } from './adminData';
import { navigateTo } from '../utils/navigation';

function summarizeStatuses(packItems: ReturnType<typeof getAdminPacks>[number]['items'], reviews: Map<string, QaReview>) {
  const counts: Record<QaStatus, number> = {
    unchecked: 0,
    ok: 0,
    needs_fix: 0,
    rejected: 0,
  };

  for (const item of packItems) {
    counts[statusForItem(item, reviews)] += 1;
  }

  return counts;
}

function summaryLabel(counts: Record<QaStatus, number>) {
  return `${counts.unchecked} unchecked · ${counts.ok} OK · ${counts.needs_fix} fix · ${counts.rejected} rejected`;
}

export default function AdminPacksPage() {
  const packs = useMemo(() => getAdminPacks(), []);
  const [reviews, setReviews] = useState<QaReview[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    void getQaReviews().then(({ data, error: loadError }) => {
      if (!active) return;
      setReviews(data);
      setError(loadError?.message ?? '');
    });
    return () => {
      active = false;
    };
  }, []);

  const reviewsByItem = reviewMap(reviews);

  return (
    <section className="admin-page">
      <div className="admin-page-head">
        <div>
          <h2>Pack QA</h2>
          <p>Preview release packs and track review status without editing original content.</p>
        </div>
      </div>

      {error ? <p className="admin-error">Failed to load QA reviews: {error}</p> : null}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Pack</th>
              <th>Title</th>
              <th>Items</th>
              <th>Validation</th>
              <th>QA</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {packs.map((pack) => {
              const counts = summarizeStatuses(pack.items, reviewsByItem);

              return (
                <tr key={pack.id}>
                  <td>
                    <strong>{pack.numberLabel}</strong>
                  </td>
                  <td>
                    <b>{pack.title}</b>
                    {pack.isIntro ? <small>Introduction / Tutorial - Not counted in SRS</small> : <small>{pack.subtitle}</small>}
                  </td>
                  <td>
                    <span className="admin-compact-metric">
                      {pack.counts.hanzi}H · {pack.counts.words}W · {pack.counts.sentences}S · {pack.counts.patterns}P
                    </span>
                  </td>
                  <td>
                    {pack.autoIssues.length > 0 ? (
                      <span className="admin-badge danger">{pack.autoIssues.length} issues</span>
                    ) : (
                      <span className="admin-muted">0 issues</span>
                    )}
                  </td>
                  <td>
                    <small>{summaryLabel(counts)}</small>
                  </td>
                  <td>
                    <button className="secondary admin-small-btn" type="button" onClick={() => navigateTo(`/admin/packs/${pack.id}`)}>
                      Preview
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
