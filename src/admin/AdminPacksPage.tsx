import { useEffect, useMemo, useState } from 'react';
import { getQaReviews } from './adminApi';
import { getAdminPacks, qaStatusLabel, reviewMap, statusForItem, type QaReview, type QaStatus } from './adminData';
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
  return `${counts.ok} OK / ${counts.needs_fix} Fix / ${counts.rejected} Rejected / ${counts.unchecked} Unchecked`;
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
              <th>Hanzi</th>
              <th>Words</th>
              <th>Sentences</th>
              <th>Patterns</th>
              <th>Auto Issues</th>
              <th>QA Summary</th>
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
                  <td>{pack.counts.hanzi}</td>
                  <td>{pack.counts.words}</td>
                  <td>{pack.counts.sentences}</td>
                  <td>{pack.counts.patterns}</td>
                  <td>
                    <span className={pack.autoIssues.length > 0 ? 'admin-badge danger' : 'admin-badge'}>
                      {pack.autoIssues.length}
                    </span>
                  </td>
                  <td>
                    <small>{summaryLabel(counts)}</small>
                    <div className="admin-status-mini">
                      {Object.entries(counts).map(([status, count]) => (
                        <span key={status}>{qaStatusLabel(status as QaStatus)}: {count}</span>
                      ))}
                    </div>
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
