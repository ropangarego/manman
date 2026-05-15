import type { Stage } from '../../data/mockContent';
import { optionLabel } from '../../i18n/copy';
import { useTranslation } from '../../i18n/useTranslation';
import { Card } from '../ui/Card';

interface WordStrengthProps {
  strength: { stage: Stage; count: number; width: number; color: string }[];
}

export function WordStrength({ strength }: WordStrengthProps) {
  const { language, t } = useTranslation();

  return (
    <Card>
      <div className="section-title">
        <div>
          <h3>{t('progress.wordStrength')}</h3>
          <p>{t('progress.wordStrengthSub')}</p>
        </div>
      </div>
      <div className="strength-list">
        {strength.map((item) => (
          <div className="strength-row" key={item.stage}>
            <span>{optionLabel(language, item.stage)}</span>
            <div className="strength-track" aria-hidden="true">
              <i style={{ width: `${item.width}%`, background: item.color }} />
            </div>
            <span>{item.count} {t('home.words').toLowerCase()}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
