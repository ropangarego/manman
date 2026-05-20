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
import { OptionSheet } from '../components/ui/OptionSheet';
import { navigateTo } from '../utils/navigation';

type DetailTab = AdminItemType | 'issues';
type StatusFilter = 'all' | QaStatus;

const tabs: Array<{ id: DetailTab; label: string }> = [
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

function matchesFilter(item: AdminPackItem, status: QaStatus, filter: StatusFilter, onlyIssues: boolean, onlyNotOk: boolean) {
  if (filter !== 'all' && status !== filter) return false;
  if (onlyIssues && item.autoIssues.length === 0) return false;
  if (onlyNotOk && status === 'ok' && item.autoIssues.length === 0) return false;
  return true;
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

function notePreview(note: string) {
  if (!note.trim()) return '';
  return note.length > 72 ? `${note.slice(0, 72)}...` : note;
}

function ItemTable({
  items,
  reviews,
  languageMode,
  saving,
  saveFeedback,
  onSave,
  onOpen,
  highlightedItemId,
}: {
  items: AdminPackItem[];
  reviews: Map<string, QaReview>;
  languageMode: AdminLanguageMode;
  saving: Record<string, string>;
  saveFeedback: Record<string, string>;
  onSave: (item: AdminPackItem, status: QaStatus, note: string) => void;
  onOpen: (item: AdminPackItem) => void;
  highlightedItemId: string;
}) {
  return (
    <div className="admin-table-wrap">
      <table className="admin-table admin-item-table compact">
        <thead>
          <tr>
            <th>Content</th>
            <th>Pinyin</th>
            <th>Meaning</th>
            <th>QA</th>
            <th>Note</th>
            <th>Issues</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={7}>No items match the current filters.</td>
            </tr>
          ) : (
            items.map((item) => {
              const key = reviewKey(item);
              const review = reviews.get(key);
              const status = review?.status ?? 'unchecked';
              const note = review?.note ?? '';
              const preview = notePreview(note);

              return (
                <tr
                  className={`${highlightedItemId === item.id ? 'admin-highlight-row ' : ''}admin-click-row`}
                  id={`qa-${item.type}-${item.id}`}
                  key={key}
                  onClick={() => onOpen(item)}
                >
                  <td>
                    <strong>{item.content}</strong>
                    <small>{item.id}</small>
                  </td>
                  <td>{item.pinyin}</td>
                  <td>{languageText(item.meaningEn, item.meaningId, languageMode)}</td>
                  <td onClick={(event) => event.stopPropagation()}>
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
                    {preview ? <small className="admin-note-preview">{preview}</small> : <small className="admin-muted">No note</small>}
                    <button
                      className="admin-link-btn"
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onOpen(item);
                      }}
                    >
                      {preview ? 'Edit' : 'Add note'}
                    </button>
                  </td>
                  <td>
                    {item.autoIssues.length === 0 ? (
                      <span className="admin-muted">0</span>
                    ) : (
                      <span className="admin-badge warn">{item.autoIssues.length} issue{item.autoIssues.length === 1 ? '' : 's'}</span>
                    )}
                  </td>
                  <td>
                    <button
                      className="secondary admin-small-btn"
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onOpen(item);
                      }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              );
            })
          )}
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
            <th>Validation Issue</th>
            <th>Severity</th>
          </tr>
        </thead>
        <tbody>
          {issues.length === 0 ? (
            <tr>
              <td colSpan={4}>No validation issues found.</td>
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

function DetailRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function ItemDetailModal({
  item,
  review,
  saving,
  saveFeedback,
  onClose,
  onSave,
}: {
  item: AdminPackItem | null;
  review: QaReview | undefined;
  saving: string;
  saveFeedback: string;
  onClose: () => void;
  onSave: (item: AdminPackItem, status: QaStatus, note: string) => void;
}) {
  const [draftStatus, setDraftStatus] = useState<QaStatus>('unchecked');
  const [draftNote, setDraftNote] = useState('');

  useEffect(() => {
    setDraftStatus(review?.status ?? 'unchecked');
    setDraftNote(review?.note ?? '');
  }, [item?.id, review?.note, review?.status]);

  if (!item) return null;

  const hasIssues = item.autoIssues.length > 0;

  return (
    <OptionSheet open={Boolean(item)} title={`${item.content || item.id} QA`} sub={`${itemTypeLabel(item.type)} - ${item.id}`} className="admin-item-sheet" onClose={onClose}>
      <div className="admin-detail-body">
        <dl className="admin-detail-grid">
          <DetailRow label="Content" value={item.content} />
          <DetailRow label="Pinyin / Structure" value={item.pinyin} />
          <DetailRow label="Tone" value={item.tone} />
          <DetailRow label="Meaning EN" value={item.meaningEn} />
          <DetailRow label="Meaning ID" value={item.meaningId} />
          <DetailRow label="Literal / Pattern" value={item.literal || item.pattern} />
          <DetailRow label="Components / Breakdown" value={item.components || item.breakdown} />
          <DetailRow label="Mnemonic / Explanation" value={item.mnemonic} />
          <DetailRow label="Examples" value={item.examples} />
        </dl>

        <section className="admin-detail-section">
          <h4>Validation</h4>
          {hasIssues ? (
            <ul className="admin-detail-issues">
              {item.autoIssues.map((issue) => (
                <li key={issue.issue}>
                  <span className={`admin-badge ${issue.severity === 'error' ? 'danger' : 'warn'}`}>{issue.severity}</span>
                  {issue.issue}
                </li>
              ))}
            </ul>
          ) : (
            <p className="admin-muted">No validation issues.</p>
          )}
        </section>

        <section className="admin-detail-section">
          <h4>QA Review</h4>
          <label className="admin-field">
            <span>Status</span>
            <select value={draftStatus} onChange={(event) => setDraftStatus(event.target.value as QaStatus)}>
              {qaStatuses.map((status) => (
                <option key={status} value={status}>
                  {qaStatusLabel(status)}
                </option>
              ))}
            </select>
          </label>
          <label className="admin-field">
            <span>Notes</span>
            <textarea value={draftNote} onChange={(event) => setDraftNote(event.target.value)} placeholder="Add QA notes..." />
          </label>
          <div className="admin-detail-actions">
            <button className="primary admin-small-btn" type="button" onClick={() => onSave(item, draftStatus, draftNote)}>
              Save QA
            </button>
            <small>{saving || saveFeedback}</small>
          </div>
        </section>

        <section className="admin-detail-section">
          <h4>Metadata</h4>
          <dl className="admin-detail-meta">
            <DetailRow label="pack_id" value={item.packId} />
            <DetailRow label="item_type" value={item.type} />
            <DetailRow label="item_id" value={item.id} />
            <DetailRow label="reviewer_id" value={review?.reviewer_id ?? ''} />
            <DetailRow label="updated_at" value={review?.updated_at ? new Date(review.updated_at).toLocaleString() : ''} />
          </dl>
        </section>
      </div>
    </OptionSheet>
  );
}

export default function AdminPackDetailPage({ packId }: { packId: string }) {
  const packs = useMemo(() => getAdminPacks(), []);
  const pack = packs.find((item) => item.id === packId);
  const query = new URLSearchParams(window.location.search);
  const queryType = query.get('type') as DetailTab | null;
  const queryItem = query.get('item') ?? '';
  const initialTab = queryType && tabs.some((tab) => tab.id === queryType) ? queryType : 'hanzi';
  const [reviews, setReviews] = useState<QaReview[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [onlyIssues, setOnlyIssues] = useState(false);
  const [onlyNotOk, setOnlyNotOk] = useState(false);
  const [languageMode, setLanguageMode] = useState<AdminLanguageMode>('both');
  const [activeTab, setActiveTab] = useState<DetailTab>(initialTab);
  const [selectedItem, setSelectedItem] = useState<AdminPackItem | null>(null);
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
          &larr; Back to packs
        </button>
        <h2>Pack not found</h2>
      </section>
    );
  }

  const reviewsByItem = reviewMap(reviews);
  const selectedReview = selectedItem ? reviewsByItem.get(reviewKey(selectedItem)) : undefined;
  const selectedKey = selectedItem ? reviewKey(selectedItem) : '';
  const statusCounts: Record<QaStatus, number> = { unchecked: 0, ok: 0, needs_fix: 0, rejected: 0 };
  for (const item of pack.items) {
    statusCounts[statusForItem(item, reviewsByItem)] += 1;
  }

  const visibleBase = activeTab === 'issues' ? pack.items : pack.items.filter((item) => item.type === activeTab);
  const filteredItems = visibleBase.filter((item) => {
    const status = statusForItem(item, reviewsByItem);
    return matchesFilter(item, status, statusFilter, onlyIssues, onlyNotOk) && matchesSearch(item, noteForItem(item, reviewsByItem), search);
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
        &larr; Back to packs
      </button>
      <div className="admin-page-head">
        <div>
          <h2>
            {pack.numberLabel} - {pack.title}
          </h2>
          <p>{pack.isIntro ? 'Introduction / Tutorial - Not counted in SRS' : pack.subtitle}</p>
        </div>
        <button className="primary admin-export-btn" type="button" onClick={() => exportCsv(pack.title, pack.id, pack.items, reviewsByItem)}>
          Export QA Notes CSV
        </button>
      </div>

      {error ? <p className="admin-error">Failed to load QA reviews: {error}</p> : null}

      <div className="admin-summary-panels" aria-label="Pack QA summary">
        <article>
          <h3>Content</h3>
          <p>
            {pack.counts.hanzi} Hanzi · {pack.counts.words} Words · {pack.counts.sentences} Sentences · {pack.counts.patterns} Patterns
          </p>
        </article>
        <article>
          <h3>QA</h3>
          <p>
            {statusCounts.unchecked} Unchecked · {statusCounts.ok} OK · {statusCounts.needs_fix} Needs Fix · {statusCounts.rejected} Rejected
          </p>
        </article>
        <article>
          <h3>Validation</h3>
          <p>{issueCount(pack.items)} Issues</p>
        </article>
      </div>

      <div className="admin-tabs compact" role="tablist" aria-label="Pack detail tabs">
        {tabs.map((tab) => (
          <button className={activeTab === tab.id ? 'active' : ''} type="button" key={tab.id} onClick={() => setActiveTab(tab.id)}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="admin-controls compact">
        <input value={search} placeholder="Search content, pinyin, meaning, note, item_id..." onChange={(event) => setSearch(event.target.value)} />
        <select className="admin-control-select" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}>
          {statusFilters.map((filter) => (
            <option key={filter.id} value={filter.id}>
              {filter.label}
            </option>
          ))}
        </select>
        <select className="admin-control-select" value={languageMode} onChange={(event) => setLanguageMode(event.target.value as AdminLanguageMode)}>
          <option value="en">EN</option>
          <option value="id">ID</option>
          <option value="both">Both</option>
        </select>
        <button className={`admin-toggle${onlyIssues ? ' active' : ''}`} type="button" onClick={() => setOnlyIssues((value) => !value)}>
          Only Issues
        </button>
        <button className={`admin-toggle${onlyNotOk ? ' active' : ''}`} type="button" onClick={() => setOnlyNotOk((value) => !value)}>
          Only Not OK
        </button>
      </div>

      {activeTab === 'issues' ? (
        <IssueList issues={pack.autoIssues} />
      ) : (
        <ItemTable
          items={filteredItems}
          reviews={reviewsByItem}
          languageMode={languageMode}
          saving={saving}
          saveFeedback={saveFeedback}
          onSave={saveReview}
          onOpen={setSelectedItem}
          highlightedItemId={queryItem}
        />
      )}

      <ItemDetailModal
        item={selectedItem}
        review={selectedReview}
        saving={saving[selectedKey] ?? ''}
        saveFeedback={saveFeedback[selectedKey] ?? ''}
        onClose={() => setSelectedItem(null)}
        onSave={saveReview}
      />
    </section>
  );
}
