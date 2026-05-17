import { useAppStore } from '../../stores/appStore';
import { speakMandarin, speechRateForSpeed } from '../../utils/audio';
import { AudioButton } from '../ui/AudioButton';
import { ToneDots } from './ToneDots';

interface StudyItemCardProps {
  type: string;
  title: string;
  pinyin: string[];
  tones: number[];
  meaning: string;
  audioUrl?: string;
  prompt?: string;
  showPinyin?: boolean;
}

export function StudyItemCard({
  type,
  title,
  pinyin,
  tones,
  meaning,
  audioUrl,
  prompt,
  showPinyin = true,
}: StudyItemCardProps) {
  const openSheet = useAppStore((state) => state.openSheet);
  const speechSpeed = useAppStore((state) => state.settings.speechSpeed);
  const speechRate = speechRateForSpeed(speechSpeed);

  return (
    <div className="hanzi-focus">
      <button className="report-menu" type="button" aria-label="Report issue" onClick={() => openSheet('report')}>
        ⋯
      </button>
      <span className="pill">{type}</span>
      {prompt ? <p className="muted">{prompt}</p> : null}
      <div className="pronunciation-stack lesson-pronunciation">
        <div className="hanzi-large mandarin-text">{title}</div>
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
        <AudioButton
          audioSrc={audioUrl}
          variant="centeredBelow"
          label={`Play pronunciation for ${title}`}
          onPlay={() => speakMandarin(title, speechRate)}
        />
      </div>
    </div>
  );
}
