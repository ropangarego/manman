import type { ContentItem } from '../../data/mockContent';
import { typeLabel } from '../../data/mockContent';
import { useAppStore } from '../../stores/appStore';
import { Button } from '../ui/Button';
import { ToneDots } from '../study/ToneDots';

interface LibraryDetailProps {
  item: ContentItem;
  onBack: () => void;
}

function sectionTitle(item: ContentItem) {
  if (item.type === 'Sentences' || item.type === 'Patterns') {
    return 'Breakdown';
  }

  if (item.type === 'Words') {
    return 'Built from';
  }

  return 'Components';
}

export function LibraryDetail({ item, onBack }: LibraryDetailProps) {
  const openSheet = useAppStore((state) => state.openSheet);
  const isPattern = item.type === 'Patterns';

  return (
    <aside className={`detail-panel${isPattern ? ' pattern-detail' : ''}`}>
      <Button variant="secondary" className="mobile-detail-back" type="button" onClick={onBack}>
        Back to Library
      </Button>

      <div className="detail-head">
        <div className="detail-main-char">{item.title}</div>
        <div className="detail-pinyin">{item.pinyin.join(' ')}</div>
        <ToneDots tones={item.tones} />
        <div className="detail-meaning">{item.meaning}</div>
      </div>

      <div className="meta-row">
        <div className="meta-chip">
          <b>{typeLabel(item.type)}</b>
          <small>Type</small>
        </div>
        <div className="meta-chip">
          <b>{item.stage}</b>
          <small>Stage</small>
        </div>
        <div className="meta-chip">
          <b>{item.accuracy}%</b>
          <small>Accuracy</small>
        </div>
      </div>

      <section className="detail-section">
        <h4>{sectionTitle(item)}</h4>
        <div className="component-grid">
          {item.components.map(([label, value]) => (
            <div className="mini-box" key={`${label}-${value}`}>
              <b>{label}</b>
              <small>{value}</small>
            </div>
          ))}
        </div>
      </section>

      <section className="detail-section">
        <h4>Mnemonic</h4>
        <p>{item.mnemonic}</p>
      </section>

      <section className="detail-section">
        <h4>Related</h4>
        <div className="chip-row">
          {item.related.map((related) => (
            <span className="content-chip" key={related}>
              {related}
            </span>
          ))}
        </div>
      </section>

      <section className="detail-section">
        <h4>Example</h4>
        <p>
          <b>{item.example[0]}</b>
          <br />
          {item.example[1]}
          <br />
          {item.example[2]}
        </p>
      </section>

      <section className="detail-section">
        <h4>Next review</h4>
        <p>{item.nextReview}</p>
      </section>

      <button className="report-link" type="button" onClick={() => openSheet('report')}>
        Report an issue
      </button>
    </aside>
  );
}

