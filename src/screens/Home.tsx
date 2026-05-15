import { PageHeader } from '../components/shell/PageHeader';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { StatCard } from '../components/ui/StatCard';
import { contentItems, getCurrentFocus, sessionPlans } from '../data/mockContent';
import { useTranslation } from '../i18n/useTranslation';
import { useAppStore } from '../stores/appStore';
import { progressStats, useProgressStore } from '../stores/progressStore';
import { useStudyStore } from '../stores/studyStore';

export function HomeScreen() {
  const { language, t } = useTranslation();
  const sessionSize = useAppStore((state) => state.sessionSize);
  const setScreen = useAppStore((state) => state.setScreen);
  const startSession = useStudyStore((state) => state.startSession);
  const progressItems = useProgressStore((state) => state.items);
  const totalCorrect = useProgressStore((state) => state.totalCorrect);
  const totalAttempts = useProgressStore((state) => state.totalAttempts);
  const dailyActivity = useProgressStore((state) => state.dailyActivity);
  const plan = sessionPlans[sessionSize];
  const stats = progressStats(contentItems, progressItems, totalCorrect, totalAttempts, dailyActivity);
  const currentFocus = getCurrentFocus(language);

  return (
    <>
      <PageHeader title={t('home.title')} subtitle={t('home.subtitle')} />

      <section className="hero">
        <div className="hero-top">
          <span className="pill accent">{t('home.todaySession')}</span>
          <h2>
            {plan.newWords} {t('study.new').toLowerCase()} · {plan.reviews} {t('study.reviews').toLowerCase()}
          </h2>
          <p className="duration-line">{t('home.duration')}: {plan.duration}</p>
          <p>{t('home.description')}</p>
        </div>
        <Button
          type="button"
          onClick={() => {
            startSession();
            setScreen('study');
          }}
        >
          {t('home.startStudy')}
        </Button>
      </section>

      <Card className="stats-card">
        <div className="section-title">
          <div>
            <h3>{t('home.quickStats')}</h3>
            <p>{t('home.quickStatsSub')}</p>
          </div>
        </div>
        <div className="grid-3 stats-row">
          <StatCard value={stats.streak} label={t('home.streak')} />
          <StatCard value={stats.accuracy} label={t('common.accuracy')} />
          <StatCard value={stats.learnedWords} label={t('home.words')} />
        </div>
      </Card>

      <Card>
        <div className="section-title">
          <div>
            <h3>{t('home.currentFocus')}</h3>
            <p>{t('home.currentFocusSub')}</p>
          </div>
        </div>
        <div className="focus-list">
          {currentFocus.map((focus) => (
            <span key={focus}>{focus}</span>
          ))}
        </div>
      </Card>
    </>
  );
}
