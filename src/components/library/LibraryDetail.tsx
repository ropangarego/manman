import type { ContentItem } from '../../data/mockContent';
import { typeLabel } from '../../data/mockContent';
import { optionLabel } from '../../i18n/copy';
import { useTranslation } from '../../i18n/useTranslation';
import { useAppStore } from '../../stores/appStore';
import { Button } from '../ui/Button';
import { ToneDots } from '../study/ToneDots';

interface LibraryDetailProps {
  item: ContentItem;
  showPinyin: boolean;
  onBack: () => void;
}

function sectionTitle(item: ContentItem, language: 'English' | 'Indonesian') {
  if (item.type === 'Sentences' || item.type === 'Patterns') {
    return language === 'Indonesian' ? 'Rincian' : 'Breakdown';
  }

  if (item.type === 'Words') {
    return language === 'Indonesian' ? 'Dibentuk dari' : 'Built from';
  }

  return language === 'Indonesian' ? 'Komponen' : 'Components';
}

export function LibraryDetail({ item, showPinyin, onBack }: LibraryDetailProps) {
  const { language, t } = useTranslation();
  const openSheet = useAppStore((state) => state.openSheet);
  const isPattern = item.type === 'Patterns';

  return (
    <aside className={`detail-panel${isPattern ? ' pattern-detail' : ''}`}>
      <Button variant="secondary" className="mobile-detail-back" type="button" onClick={onBack}>
        {t('library.back')}
      </Button>

      <div className="detail-head">
        <div className="detail-main-char">{item.title}</div>
        {showPinyin ? (
          <>
            <div className="detail-pinyin">{item.pinyin.join(' ')}</div>
            <ToneDots tones={item.tones} />
          </>
        ) : null}
        <div className="detail-meaning">{item.meaning}</div>
      </div>

      <div className="meta-row">
        <div className="meta-chip">
          <b>{typeLabel(item.type, language)}</b>
          <small>{t('common.type')}</small>
        </div>
        <div className="meta-chip">
          <b>{optionLabel(language, item.stage)}</b>
          <small>{t('common.stage')}</small>
        </div>
        <div className="meta-chip">
          <b>{item.accuracy}%</b>
          <small>{t('common.accuracy')}</small>
        </div>
      </div>

      <section className="detail-section">
        <h4>{sectionTitle(item, language)}</h4>
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
        <h4>{language === 'Indonesian' ? 'Mnemonik' : 'Mnemonic'}</h4>
        <p>{item.mnemonic}</p>
      </section>

      <section className="detail-section">
        <h4>{language === 'Indonesian' ? 'Terkait' : 'Related'}</h4>
        <div className="chip-row">
          {item.related.map((related) => (
            <span className="content-chip" key={related}>
              {related}
            </span>
          ))}
        </div>
      </section>

      <section className="detail-section">
        <h4>{language === 'Indonesian' ? 'Contoh' : 'Example'}</h4>
        <p>
          <b>{item.example[0]}</b>
          <br />
          {showPinyin ? (
            <>
              {item.example[1]}
              <br />
            </>
          ) : null}
          {item.example[2]}
        </p>
      </section>

      <section className="detail-section">
        <h4>{language === 'Indonesian' ? 'Review berikutnya' : 'Next review'}</h4>
        <p>{item.nextReview}</p>
      </section>

      <button className="report-link" type="button" onClick={() => openSheet('report')}>
        {t('library.report')}
      </button>
    </aside>
  );
}
