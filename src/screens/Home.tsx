import { PageHeader } from '../components/shell/PageHeader';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { StatCard } from '../components/ui/StatCard';
import { contentItems, getCurrentFocus, getIntroStudySession, getStarterStudySession, sessionPlans } from '../data/mockContent';
import { useTranslation } from '../i18n/useTranslation';
import { useAppStore } from '../stores/appStore';
import { progressStats, useProgressStore } from '../stores/progressStore';
import { useStudyStore } from '../stores/studyStore';

export function HomeScreen() {
  const { language, t } = useTranslation();
  const sessionSize = useAppStore((state) => state.sessionSize);
  const scriptChoice = useAppStore((state) => state.scriptChoice);
  const introStatus = useAppStore((state) => state.introStatus);
  const setScreen = useAppStore((state) => state.setScreen);
  const startSession = useStudyStore((state) => state.startSession);
  const sessionIndex = useStudyStore((state) => state.sessionIndex);
  const progressItems = useProgressStore((state) => state.items);
  const totalCorrect = useProgressStore((state) => state.totalCorrect);
  const totalAttempts = useProgressStore((state) => state.totalAttempts);
  const dailyActivity = useProgressStore((state) => state.dailyActivity);
  const plan = sessionPlans[sessionSize];
  const introActive = introStatus === 'required' || introStatus === 'optional';
  const introPreview = getIntroStudySession(language);
  const sessionPreview = getStarterStudySession(sessionSize, sessionIndex, language, progressItems, scriptChoice);
  const stats = progressStats(contentItems, progressItems, totalCorrect, totalAttempts, dailyActivity);
  const currentFocus = getCurrentFocus(language, sessionIndex, progressItems, scriptChoice);

  return (
    <>
      <PageHeader title={t('home.title')} subtitle={t('home.subtitle')} />

      <section className="hero">
        <div className="hero-top">
          <span className="pill accent">{t('home.todaySession')}</span>
          <span className="pill">{introActive && introPreview ? introPreview.packLabel : sessionPreview.packLabel}</span>
          <h2>
            {introActive && introPreview
              ? introPreview.introTitle
              : language === 'Indonesian'
                ? `${sessionPreview.learnItems.length} kata baru · ${sessionPreview.reviewItems.length} review`
                : `${sessionPreview.learnItems.length} new words · ${sessionPreview.reviewItems.length} reviews`}
          </h2>
          <p className="duration-line">{t('home.duration')}: {introActive ? '~5 min' : plan.duration}</p>
          <p>{introActive && introPreview ? introPreview.introDescription : t('home.description')}</p>
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
