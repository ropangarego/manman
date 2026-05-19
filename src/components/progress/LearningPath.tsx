import { getLearningPath } from '../../data/mockContent';
import { textFor } from '../../i18n/copy';
import { useTranslation } from '../../i18n/useTranslation';
import { useAppStore } from '../../stores/appStore';
import { useStudyStore } from '../../stores/studyStore';
import { Card } from '../ui/Card';

const MAX_VISIBLE_PATH_ITEMS = 5;

function visibleLearningPath<T extends { status: string }>(items: T[]) {
  if (items.length <= MAX_VISIBLE_PATH_ITEMS) {
    return {
      items,
      hasHiddenItems: false,
    };
  }

  const currentIndex = Math.max(
    0,
    items.findIndex((item) => item.status === 'current'),
  );
  const maxStart = Math.max(0, items.length - MAX_VISIBLE_PATH_ITEMS);
  const start =
    currentIndex <= 2
      ? 0
      : currentIndex >= items.length - 3
        ? maxStart
        : Math.min(Math.max(currentIndex - 2, 0), maxStart);

  return {
    items: items.slice(start, start + MAX_VISIBLE_PATH_ITEMS),
    hasHiddenItems: start > 0 || start + MAX_VISIBLE_PATH_ITEMS < items.length,
  };
}

export function LearningPath() {
  const { language, t } = useTranslation();
  const sessionIndex = useStudyStore((state) => state.sessionIndex);
  const introStatus = useAppStore((state) => state.introStatus);
  const learningPath = getLearningPath(sessionIndex, introStatus);
  const pathWindow = visibleLearningPath(learningPath);
  const statusLabel = (label: string) => {
    if (language !== 'Indonesian') {
      return label;
    }

    const labels: Record<string, string> = {
      Done: 'Selesai',
      Now: 'Sekarang',
      Available: 'Tersedia',
      Locked: 'Terkunci',
      Skipped: 'Dilewati',
      Intro: 'Intro',
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
        {pathWindow.items.map((item) => (
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
      {pathWindow.hasHiddenItems ? <p className="path-more-note">{t('progress.morePacksInLibrary')}</p> : null}
    </Card>
  );
}
