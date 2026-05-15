import { LearningPath } from '../components/progress/LearningPath';
import { WeeklyActivity } from '../components/progress/WeeklyActivity';
import { WordStrength } from '../components/progress/WordStrength';
import { PageHeader } from '../components/shell/PageHeader';
import { Card } from '../components/ui/Card';
import { StatCard } from '../components/ui/StatCard';
import { contentItems, getCurrentFocus } from '../data/mockContent';
import { useTranslation } from '../i18n/useTranslation';
import {
  progressStats,
  useProgressStore,
  weeklyActivityFromProgress,
  wordStrengthFromProgress,
} from '../stores/progressStore';

export function ProgressScreen() {
  const { language, t } = useTranslation();
  const progressItems = useProgressStore((state) => state.items);
  const totalCorrect = useProgressStore((state) => state.totalCorrect);
  const totalAttempts = useProgressStore((state) => state.totalAttempts);
  const dailyActivity = useProgressStore((state) => state.dailyActivity);
  const stats = progressStats(contentItems, progressItems, totalCorrect, totalAttempts, dailyActivity);
  const weeklyActivity = weeklyActivityFromProgress(dailyActivity);
  const wordStrength = wordStrengthFromProgress(contentItems, progressItems);
  const currentFocus = getCurrentFocus(language);
  const showWeakAreas = totalAttempts >= 8;

  return (
    <>
      <PageHeader title={t('progress.title')} subtitle={t('progress.subtitle')} />

      <div className="progress-grid">
        <StatCard value={stats.learnedWords} label={t('progress.wordsLearned')} />
        <StatCard value={stats.reviewsDue} label={t('progress.reviewsDue')} />
        <StatCard value={stats.streak} label={t('home.streak')} />
        <StatCard value={stats.accuracy} label={t('common.accuracy')} />
      </div>

      <section className="progress-layout">
        <div className="study-card">
          <WordStrength strength={wordStrength} />
          <WeeklyActivity activity={weeklyActivity} />
        </div>
        <div className="study-card">
          <LearningPath />
          {showWeakAreas ? (
            <Card>
              <div className="section-title">
                <div>
                  <h3>{t('progress.weakAreas')}</h3>
                  <p>{t('progress.weakAreasSub')}</p>
                </div>
              </div>
              <div className="focus-list">
                {currentFocus.map((focus) => (
                  <span key={focus}>{focus}</span>
                ))}
              </div>
            </Card>
          ) : null}
        </div>
      </section>
    </>
  );
}
