import { PageHeader } from '../components/shell/PageHeader';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { StatCard } from '../components/ui/StatCard';
import { sessionPlans } from '../data/mockContent';
import { useAppStore } from '../stores/appStore';
import { useStudyStore } from '../stores/studyStore';

export function HomeScreen() {
  const sessionSize = useAppStore((state) => state.sessionSize);
  const setScreen = useAppStore((state) => state.setScreen);
  const startSession = useStudyStore((state) => state.startSession);
  const plan = sessionPlans[sessionSize];

  return (
    <>
      <PageHeader title="Nǐ hǎo, Learner" subtitle="Ready for today’s Mandarin?" />

      <section className="hero">
        <div className="hero-top">
          <span className="pill accent">Today’s Session</span>
          <h2>
            {plan.newWords} new words · {plan.reviews} reviews
          </h2>
          <p className="duration-line">Duration: {plan.duration}</p>
          <p>Learn new words, practice them once, then review what is due.</p>
        </div>
        <Button
          type="button"
          onClick={() => {
            startSession();
            setScreen('study');
          }}
        >
          Start Study
        </Button>
      </section>

      <Card className="stats-card">
        <div className="section-title">
          <div>
            <h3>Quick stats</h3>
            <p>Your latest study snapshot.</p>
          </div>
        </div>
        <div className="grid-3 stats-row">
          <StatCard value={3} label="Streak" />
          <StatCard value="87%" label="Accuracy" />
          <StatCard value={24} label="Words" />
        </div>
      </Card>

      <Card>
        <div className="section-title">
          <div>
            <h3>Current focus</h3>
            <p>We’ll mix these into reviews.</p>
          </div>
        </div>
        <div className="focus-list">
          <span>3rd tone</span>
          <span>Measure words</span>
          <span>了 / 的</span>
        </div>
      </Card>
    </>
  );
}
