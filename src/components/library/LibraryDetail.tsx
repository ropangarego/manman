import type { ContentItem } from '../../data/mockContent';
import { typeLabel } from '../../data/mockContent';
import { optionLabel } from '../../i18n/copy';
import { useTranslation } from '../../i18n/useTranslation';
import { useAppStore } from '../../stores/appStore';
import { speakMandarin, speechRateForSpeed } from '../../utils/audio';
import { Button } from '../ui/Button';
import { AudioButton } from '../ui/AudioButton';
import { ToneDots } from '../study/ToneDots';
import { ReportIssueButton } from '../report/ReportIssueButton';

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
  const speechSpeed = useAppStore((state) => state.settings.speechSpeed);
  const speechRate = speechRateForSpeed(speechSpeed);
  const isPattern = item.type === 'Patterns';
  const displaySizeClass =
    item.type === 'Hanzi'
      ? 'detail-main-hanzi'
      : item.type === 'Words'
        ? 'detail-main-word'
        : item.type === 'Sentences'
          ? 'detail-main-sentence'
          : 'detail-main-pattern';

  return (
    <aside className={`detail-panel${isPattern ? ' pattern-detail' : ''}`}>
      <Button variant="secondary" className="mobile-detail-back" type="button" onClick={onBack}>
        {t('library.back')}
      </Button>

      <div className="detail-head">
        <div className="pronunciation-stack detail-pronunciation">
          <div className={`detail-main-char ${displaySizeClass} mandarin-text`}>{item.title}</div>
          {showPinyin ? (
            <>
              <div className="detail-pinyin">{item.pinyin.join(' ')}</div>
              <ToneDots tones={item.tones} />
            </>
          ) : null}
          <div className="detail-meaning">{item.meaning}</div>
          <AudioButton
            audioSrc={item.audioUrl}
            variant="centeredBelow"
            label={`Play pronunciation for ${item.title}`}
            onPlay={() => speakMandarin(item.title, speechRate)}
          />
        </div>
      </div>

      <div className="meta-row">
        <div className="meta-chip">
          <b>{typeLabel(item.type, language)}</b>
          <small>{t('common.type')}</small>
        </div>
        <div className="meta-chip">
          <b>{optionLabel(language, item.started === false ? 'Not started' : item.stage)}</b>
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
        <p>{item.started === false ? optionLabel(language, 'Not started') : item.nextReview}</p>
      </section>

      <ReportIssueButton
        className="report-link"
        label={t('library.report')}
        context={{
          page: 'library',
          packId: item.packId,
          itemId: item.id,
          itemType:
            item.type === 'Hanzi'
              ? 'hanzi'
              : item.type === 'Words'
                ? 'word'
                : item.type === 'Sentences'
                  ? 'sentence'
                  : 'pattern',
          metadata: { title: item.title, meaning: item.meaning },
        }}
      />
    </aside>
  );
}
