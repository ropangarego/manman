import { useEffect, useMemo, useState } from 'react';
import { getIssueReports, updateIssueReport } from './adminApi';
import type { IssueReport } from './adminData';
import { navigateTo } from '../utils/navigation';

type ReportStatusFilter = 'all' | IssueReport['status'];

const reportStatuses: IssueReport['status'][] = ['open', 'reviewing', 'fixed', 'rejected'];
const filters: Array<{ id: ReportStatusFilter; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'open', label: 'Open' },
  { id: 'reviewing', label: 'Reviewing' },
  { id: 'fixed', label: 'Fixed' },
  { id: 'rejected', label: 'Rejected' },
];

function statusLabel(status: IssueReport['status']) {
  if (status === 'reviewing') return 'Reviewing';
  if (status === 'fixed') return 'Fixed';
  if (status === 'rejected') return 'Rejected';
  return 'Open';
}

function matchesReport(report: IssueReport, search: string, filter: ReportStatusFilter) {
  if (filter !== 'all' && report.status !== filter) {
    return false;
  }

  if (!search.trim()) {
    return true;
  }

  return [
    report.page,
    report.pack_id,
    report.item_type,
    report.item_id,
    report.message,
    report.admin_note,
    report.user_id,
    JSON.stringify(report.metadata ?? {}),
  ]
    .join(' ')
    .toLowerCase()
    .includes(search.toLowerCase());
}

export default function AdminReportsPage() {
  const [reports, setReports] = useState<IssueReport[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<ReportStatusFilter>('all');
  const [search, setSearch] = useState('');
  const [draftStatus, setDraftStatus] = useState<IssueReport['status']>('open');
  const [draftNote, setDraftNote] = useState('');
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    void getIssueReports().then(({ data, error: loadError }) => {
      if (!active) return;
      setReports(data);
      setError(loadError?.message ?? '');
    });
    return () => {
      active = false;
    };
  }, []);

  const visibleReports = useMemo(
    () => reports.filter((report) => matchesReport(report, search, filter)),
    [filter, reports, search],
  );
  const selected = reports.find((report) => report.id === selectedId) ?? null;

  useEffect(() => {
    if (!selected) {
      return;
    }

    setDraftStatus(selected.status);
    setDraftNote(selected.admin_note ?? '');
    setFeedback('');
  }, [selected]);

  async function saveReport() {
    if (!selected) {
      return;
    }

    setFeedback('Saving...');
    const { data, error: saveError } = await updateIssueReport(selected.id, {
      status: draftStatus,
      admin_note: draftNote.trim() || null,
    });

    if (saveError || !data) {
      setFeedback('Failed to save');
      return;
    }

    setReports((state) => state.map((report) => (report.id === data.id ? data : report)));
    setFeedback('Saved');
  }

  return (
    <section className="admin-page">
      <div className="admin-page-head">
        <div>
          <h2>Reports</h2>
          <p>Review user-submitted issue reports and connect them back to pack QA.</p>
        </div>
      </div>

      {error ? <p className="admin-error">Failed to load reports: {error}</p> : null}

      <div className="admin-controls">
        <input value={search} placeholder="Search reports..." onChange={(event) => setSearch(event.target.value)} />
        <div className="admin-segmented">
          {filters.map((item) => (
            <button className={filter === item.id ? 'active' : ''} type="button" key={item.id} onClick={() => setFilter(item.id)}>
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="admin-reports-layout">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Page</th>
                <th>Pack</th>
                <th>Item Type</th>
                <th>Item ID</th>
                <th>Message</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {visibleReports.length === 0 ? (
                <tr>
                  <td colSpan={8}>No reports found.</td>
                </tr>
              ) : (
                visibleReports.map((report) => (
                  <tr className={selectedId === report.id ? 'admin-highlight-row' : ''} key={report.id}>
                    <td>{new Date(report.created_at).toLocaleString()}</td>
                    <td>{report.page ?? '—'}</td>
                    <td>{report.pack_id ?? '—'}</td>
                    <td>{report.item_type ?? '—'}</td>
                    <td>{report.item_id ?? '—'}</td>
                    <td>{report.message || 'No message'}</td>
                    <td>
                      <span className={`admin-badge ${report.status}`}>{statusLabel(report.status)}</span>
                    </td>
                    <td>
                      <button className="secondary admin-small-btn" type="button" onClick={() => setSelectedId(report.id)}>
                        Open
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <aside className="admin-report-detail">
          {selected ? (
            <>
              <h3>Report detail</h3>
              <dl>
                <dt>Message</dt>
                <dd>{selected.message || 'No message'}</dd>
                <dt>Page</dt>
                <dd>{selected.page ?? '—'}</dd>
                <dt>Pack ID</dt>
                <dd>{selected.pack_id ?? '—'}</dd>
                <dt>Item Type</dt>
                <dd>{selected.item_type ?? '—'}</dd>
                <dt>Item ID</dt>
                <dd>{selected.item_id ?? '—'}</dd>
                <dt>User ID</dt>
                <dd>{selected.user_id ?? '—'}</dd>
                <dt>Created At</dt>
                <dd>{new Date(selected.created_at).toLocaleString()}</dd>
                <dt>Metadata</dt>
                <dd>
                  <pre>{JSON.stringify(selected.metadata ?? {}, null, 2)}</pre>
                </dd>
              </dl>
              <label>
                <span>Status</span>
                <select value={draftStatus} onChange={(event) => setDraftStatus(event.target.value as IssueReport['status'])}>
                  {reportStatuses.map((status) => (
                    <option key={status} value={status}>
                      {statusLabel(status)}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>Admin note</span>
                <textarea value={draftNote} onChange={(event) => setDraftNote(event.target.value)} />
              </label>
              <div className="sheet-actions">
                <button className="primary" type="button" onClick={saveReport}>
                  Save
                </button>
                {selected.pack_id ? (
                  <button
                    className="secondary"
                    type="button"
                    onClick={() =>
                      navigateTo(
                        `/admin/packs/${selected.pack_id}?type=${encodeURIComponent(selected.item_type ?? '')}&item=${encodeURIComponent(
                          selected.item_id ?? '',
                        )}`,
                      )
                    }
                  >
                    Open related item
                  </button>
                ) : null}
              </div>
              {feedback ? <small>{feedback}</small> : null}
            </>
          ) : (
            <p>Select a report to review it.</p>
          )}
        </aside>
      </div>
    </section>
  );
}
