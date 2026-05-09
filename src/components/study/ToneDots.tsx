import { useAppStore } from '../../stores/appStore';

interface ToneDotsProps {
  tones: number[];
}

export function ToneDots({ tones }: ToneDotsProps) {
  const enabled = useAppStore((state) => state.settings.toneColors);

  if (!enabled) {
    return null;
  }

  return (
    <div className="tone-dots" aria-label="Tone markers">
      {tones.map((tone, index) => (
        <i className={`tone-dot tone-${tone}`} key={`${tone}-${index}`} aria-hidden="true" />
      ))}
    </div>
  );
}

