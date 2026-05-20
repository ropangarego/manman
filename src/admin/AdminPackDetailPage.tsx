import { useEffect, useMemo, useState } from 'react';
import { getQaReviews, upsertQaReview } from './adminApi';
import {
  csvDate,
  csvEscape,
  getAdminPacks,
  noteForItem,
  qaStatuses,
  qaStatusLabel,
  reviewKey,
  reviewMap,
  statusForItem,
  type AdminItemType,
  type AdminLanguageMode,
  type AdminPackItem,
  type AutoIssue,
  type QaReview,
  type QaStatus,
} from './adminData';
import { navigateTo } from '../utils/navigation';

type DetailTab = 'overview' | AdminItemType | 'issues';
type StatusFilter = 'all' | QaStatus | 'only_issues' | 'only_not_ok';

const tabs: Array<{ id: DetailTab; label: string }> = [
  { id: 'overview', label: 'Overview' },
  { id: 'hanzi', label: 'Hanzi' },
  { id: 'word', label: 'Words' },
  { id: 'sentence', label: 'Sentences' },
  { id: 'pattern', label: 'Patterns' },
  { id: 'issues', label: 'Issues' },
];

const statusFilters: Array<{ id: StatusFilter; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'unchecked', label: 'Unchecked' },
  { id: 'ok', label: 'OK' },
  { id: 'needs_fix', label: 'Needs Fix' },
  { id: 'rejected', label: 'Rejected' },
  { id: 'only_issues', label: 'Only Issues' },
  { id: 'only_not_ok', label: 'Only Not OK' },
];

function itemTypeLabel(type: AdminItemType) {
  if (type === 'word') return 'Words';
  if (type === 'sentence') return 'Sentences';
  if (type === 'pattern') return 'Patterns';
  return 'Hanzi';
}

function issueCount(items: AdminPackItem[]) {
  return items.reduce((total, item) => total + item.autoIssues.length, 0);
}

function matchesSearch(item: AdminPackItem, note: string, search: string) {
  if (!search.trim()) return true;
  const query = search.toLowerCase();
  return [
    item.id,
    item.content,
    item.pinyin,
    item.meaningEn,
    item.meaningId,
    item.mnemonic,
    item.literal,
    item.components,
    item.pattern,
    item.breakdown,
    note,
  ]
    .join(' ')
    .toLowerCase()
    .includes(query);
}

function matchesFilter(item: AdminPackItem, status: QaStatus, filter: StatusFilter) {
  if (filter === 'all') return true;
  if (filter === 'only_issues') return item.autoIssues.length > 0;
  if (filter === 'only_not_ok') return status !== 'ok' || item.autoIssues.length > 0;
  return status === filter;
}

function languageText(en: string, id: string, mode: AdminLanguageMode) {
  if (mode === 'en') return en;
  if (mode === 'id') return id;
  return `${en}${id ? ` / ${id}` : ''}`;
}

function exportCsv(packTitle: string, packId: string, items: AdminPackItem[], reviews: Map<string, QaReview>) {
  const rows = [
    [
      'pack_id',
      'pack_title',
      'item_type',
      'item_id',
      'content',
      'pinyin',
      'meaning_en',
      'meaning_id',
      'qa_status',
      'qa_note',
      'auto_issues',
      'updated_at',
    ],
    ...items.map((item) => {
      const review = reviews.get(reviewKey(item));
      return [
        packId,
        packTitle,
        item.type,
        item.id,
        item.content,
        item.pinyin,
        item.meaningEn,
        item.meaningId,
        review?.status ?? 'unchecked',
        review?.note ?? '',
        item.autoIssues.map((issue) => `${issue.severity}: ${issue.issue}`).join(' | '),
        review?.updated_at ?? '',
      ];
    }),
  ];
  const csv = rows.map((row) => row.map(csvEscape).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `qa-pack-${packId}-${csvDate()}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function ItemTable({
  items,
  reviews,
  languageMode,
  saving,
  saveFeedback,
  onSave,
  highlightedItemId,
}: {
  items: AdminPackItem[];
  reviews: Map<string, QaReview>;
  languageMode: AdminLanguageMode;
  saving: Record<string, string>;
  saveFeedback: Record<string, string>;
  onSave: (item: AdminPackItem, status: QaStatus, note: string) => void;
  highlightedItemId: string;
}) {
  return (
    <div className="admin-table-wrap">
      <table className="admin-table admin-item-table">
        <thead>
          <tr>
            <th>Content</th>
            <th>Pinyin</th>
            <th>Tone</th>
            <th>Meaning</th>
            <th>Literal / Pattern</th>
            <th>Components / Breakdown</th>
            <th>Mnemonic / Examples</th>
            <th>QA Status</th>
            <th>Notes</th>
            <th>Issues</th>
            <th>Meta</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const key = reviewKey(item);
            const review = reviews.get(key);
            const status = review?.status ?? 'unchecked';
            const note = review?.note ?? '';

            return (
              <tr className={highlightedItemId === item.id ? 'admin-highlight-row' : ''} id={`qa-${item.type}-${item.id}`} key={key}>
                <td>
                  <strong>{item.content}</strong>
                  <small>{itemTypeLabel(item.type)}</small>
                </td>
                <td>{item.pinyin}</td>
                <td>{item.tone}</td>
                <td>{languageText(item.meaningEn, item.meaningId, languageMode)}</td>
                <td>{item.literal || item.pattern}</td>
                <td>{item.components || item.breakdown}</td>
                <td>{item.type === 'pattern' ? item.examples : item.mnemonic}</td>
                <td>
                  <select
                    value={status}
                    onChange={(event) => onSave(item, event.target.value as QaStatus, note)}
                    aria-label={`QA status for ${item.id}`}
                  >
                    {qaStatuses.map((option) => (
                      <option key={option} value={option}>
                        {qaStatusLabel(option)}
                      </option>
                    ))}
                  </select>
                  <small>{saving[key] || saveFeedback[key]}</small>
                </td>
                <td>
                  <textarea
                    defaultValue={note}
                    aria-label={`QA note for ${item.id}`}
                    onBlur={(event) => {
                      if (event.target.value !== note) {
                        onSave(item, status, event.target.value);
                      }
                    }}
                  />
                </td>
                <td>
                  {item.autoIssues.length === 0 ? (
                    <span className="admin-badge">0</span>
                  ) : (
                    item.autoIssues.map((issue) => (
                      <span className={`admin-badge ${issue.severity === 'error' ? 'danger' : 'warn'}`} key={issue.issue}>
                        {issue.issue}
                      </span>
                    ))
                  )}
                </td>
                <td>
                  <small>pack_id: {item.packId}</small>
                  <small>item_id: {item.id}</small>
                  <small>reviewer: {review?.reviewer_id ?? '—'}</small>
                  <small>updated: {review?.updated_at ? new Date(review.updated_at).toLocaleString() : '—'}</small>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function IssueList({ issues }: { issues: AutoIssue[] }) {
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Item Type</th>
            <th>Item</th>
            <th>Issue</th>
            <th>Severity</th>
          </tr>
        </thead>
        <tbody>
          {issues.length === 0 ? (
            <tr>
              <td colSpan={4}>No automatic issues found.</td>
            </tr>
          ) : (
            issues.map((issue) => (
              <tr key={`${issue.itemType}-${issue.itemId}-${issue.issue}`}>
                <td>{itemTypeLabel(issue.itemType)}</td>
                <td>
                  <strong>{issue.itemLabel}</strong>
                  <small>{issue.itemId}</small>
                </td>
                <td>{issue.issue}</td>
                <td>
                  <span className={`admin-badge ${issue.severity === 'error' ? 'danger' : 'warn'}`}>{issue.severity}</span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function AdminPackDetailPage({ packId }: { packId: string }) {
  const packs = useMemo(() => getAdminPacks(), []);
  const pack = packs.find((item) => item.id === packId);
  const query = new URLSearchParams(window.location.search);
  const queryType = query.get('type') as DetailTab | null;
  const queryItem = query.get('item') ?? '';
  const [reviews, setReviews] = useState<QaReview[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [languageMode, setLanguageMode] = useState<AdminLanguageMode>('both');
  const [activeTab, setActiveTab] = useState<DetailTab>(queryType && tabs.some((tab) => tab.id === queryType) ? queryType : 'overview');
  const [saving, setSaving] = useState<Record<string, string>>({});
  const [saveFeedback, setSaveFeedback] = useState<Record<string, string>>({});
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    void getQaReviews(packId).then(({ data, error: loadError }) => {
      if (!active) return;
      setReviews(data);
      setError(loadError?.message ?? '');
    });
    return () => {
      active = false;
    };
  }, [packId]);

  useEffect(() => {
    if (!queryItem) {
      return;
    }

    window.setTimeout(() => document.getElementById(`qa-${queryType}-${queryItem}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 250);
  }, [queryItem, queryType]);

  if (!pack) {
    return (
      <section className="admin-page">
        <button className="admin-back" type="button" onClick={() => navigateTo('/admin/packs')}>
          ← Back to packs
        </button>
        <h2>Pack not found</h2>
      </section>
    );
  }

  const reviewsByItem = reviewMap(reviews);
  const statusCounts: Record<QaStatus, number> = { unchecked: 0, ok: 0, needs_fix: 0, rejected: 0 };
  for (const item of pack.items) {
    statusCounts[statusForItem(item, reviewsByItem)] += 1;
  }

  const visibleBase = activeTab === 'overview' || activeTab === 'issues' ? pack.items : pack.items.filter((item) => item.type === activeTab);
  const filteredItems = visibleBase.filter((item) => {
    const status = statusForItem(item, reviewsByItem);
    return matchesFilter(item, status, statusFilter) && matchesSearch(item, noteForItem(item, reviewsByItem), search);
  });

  async function saveReview(item: AdminPackItem, status: QaStatus, note: string) {
    const key = reviewKey(item);
    setSaving((state) => ({ ...state, [key]: 'Saving...' }));
    setSaveFeedback((state) => ({ ...state, [key]: '' }));

    const { data, error: saveError } = await upsertQaReview({
      packId: item.packId,
      itemType: item.type,
      itemId: item.id,
      status,
      note,
    });

    setSaving((state) => ({ ...state, [key]: '' }));

    if (saveError || !data) {
      setSaveFeedback((state) => ({ ...state, [key]: 'Failed to save' }));
      return;
    }

    setReviews((state) => [...state.filter((review) => reviewKey({ packId: review.pack_id, type: review.item_type, id: review.item_id }) !== key), data]);
    setSaveFeedback((state) => ({ ...state, [key]: 'Saved' }));
  }

  return (
    <section className="admin-page">
      <button className="admin-back" type="button" onClick={() => navigateTo('/admin/packs')}>
        ← Back to packs
      </button>
      <div className="admin-page-head">
        <div>
          <h2>
            {pack.numberLabel} · {pack.title}
          </h2>
          <p>{pack.isIntro ? 'Introduction / Tutorial - Not counted in SRS' : pack.subtitle}</p>
        </div>
        <button className="primary admin-export-btn" type="button" onClick={() => exportCsv(pack.title, pack.id, pack.items, reviewsByItem)}>
          Export QA Notes CSV
        </button>
      </div>

      {error ? <p className="admin-error">Failed to load QA reviews: {error}</p> : null}

      <div className="admin-summary-grid">
        <span>Hanzi: {pack.counts.hanzi}</span>
        <span>Words: {pack.counts.words}</span>
        <span>Sentences: {pack.counts.sentences}</span>
        <span>Patterns: {pack.counts.patterns}</span>
        <span>Unchecked: {statusCounts.unchecked}</span>
        <span>OK: {statusCounts.ok}</span>
        <span>Needs Fix: {statusCounts.needs_fix}</span>
        <span>Rejected: {statusCounts.rejected}</span>
        <span>Auto Issues: {issueCount(pack.items)}</span>
      </div>

      <div className="admin-tabs compact" role="tablist" aria-label="Pack detail tabs">
        {tabs.map((tab) => (
          <button className={activeTab === tab.id ? 'active' : ''} type="button" key={tab.id} onClick={() => setActiveTab(tab.id)}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="admin-controls">
        <input value={search} placeholder="Search content, pinyin, meaning, note, item_id..." onChange={(event) => setSearch(event.target.value)} />
        <div className="admin-segmented">
          {statusFilters.map((filter) => (
            <button className={statusFilter === filter.id ? 'active' : ''} type="button" key={filter.id} onClick={() => setStatusFilter(filter.id)}>
              {filter.label}
            </button>
          ))}
        </div>
        <div className="admin-segmented">
          {(['en', 'id', 'both'] as AdminLanguageMode[]).map((mode) => (
            <button className={languageMode === mode ? 'active' : ''} type="button" key={mode} onClick={() => setLanguageMode(mode)}>
              {mode.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'issues' ? (
        <IssueList issues={pack.autoIssues} />
      ) : activeTab === 'overview' ? (
        <div className="admin-overview-grid">
          {(['hanzi', 'word', 'sentence', 'pattern'] as AdminItemType[]).map((type) => (
            <article className="admin-card" key={type}>
              <h3>{itemTypeLabel(type)}</h3>
              <p>{pack.items.filter((item) => item.type === type).length} items</p>
              <button type="button" className="secondary admin-small-btn" onClick={() => setActiveTab(type)}>
                Open table
              </button>
            </article>
          ))}
        </div>
      ) : (
        <ItemTable
          items={filteredItems}
          reviews={reviewsByItem}
          languageMode={languageMode}
          saving={saving}
          saveFeedback={saveFeedback}
          onSave={saveReview}
          highlightedItemId={queryItem}
        />
      )}
    </section>
  );
}
