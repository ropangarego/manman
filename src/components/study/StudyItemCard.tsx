import { useAppStore } from '../../stores/appStore';
import { ToneDots } from './ToneDots';

interface StudyItemCardProps {
  type: string;
  title: string;
  pinyin: string[];
  tones: number[];
  meaning: string;
  prompt?: string;
  showPinyin?: boolean;
}

export function StudyItemCard({ type, title, pinyin, tones, meaning, prompt, showPinyin = true }: StudyItemCardProps) {
  const openSheet = useAppStore((state) => state.openSheet);

  return (
    <div className="hanzi-focus">
      <button className="report-menu" type="button" aria-label="Report issue" onClick={() => openSheet('report')}>
        ⋯
      </button>
      <span className="pill">{type}</span>
      {prompt ? <p className="muted">{prompt}</p> : null}
      <div className="hanzi-large">{title}</div>
      {showPinyin ? (
        <>
          <div className="pinyin-line">
            {pinyin.map((syllable) => (
              <span key={syllable}>{syllable}</span>
            ))}
          </div>
          <ToneDots tones={tones} />
        </>
      ) : null}
      <p className="muted">{meaning}</p>
    </div>
  );
}
