import { learningPath } from '../../data/mockContent';
import { textFor } from '../../i18n/copy';
import { useTranslation } from '../../i18n/useTranslation';
import { Card } from '../ui/Card';

export function LearningPath() {
  const { language, t } = useTranslation();
  const statusLabel = (label: string) => {
    if (language !== 'Indonesian') {
      return label;
    }

    const labels: Record<string, string> = {
      Done: 'Selesai',
      Now: 'Sekarang',
      Available: 'Tersedia',
      Locked: 'Terkunci',
    };

    return labels[label] ?? label;
  };

  return (
    <Card>
      <div className="section-title">
        <div>
          <h3>{t('progress.learningPath')}</h3>
          <p>{t('progress.learningPathSub')}</p>
        </div>
      </div>
      <div className="path-list">
        {learningPath.map((item) => (
          <article className={`path-item ${item.status}`} key={item.title}>
            <span className="path-icon">{item.icon}</span>
            <div>
              <b>{textFor(language, item.title, item.titleId)}</b>
              <small>{textFor(language, item.description, item.descriptionId)}</small>
            </div>
            <em>{statusLabel(item.label)}</em>
          </article>
        ))}
      </div>
    </Card>
  );
}
