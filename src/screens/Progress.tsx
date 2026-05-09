import { LearningPath } from '../components/progress/LearningPath';
import { WeeklyActivity } from '../components/progress/WeeklyActivity';
import { WordStrength } from '../components/progress/WordStrength';
import { PageHeader } from '../components/shell/PageHeader';
import { Card } from '../components/ui/Card';
import { StatCard } from '../components/ui/StatCard';

export function ProgressScreen() {
  return (
    <>
      <PageHeader title="Progress" subtitle="Useful progress only — no heavy dashboard." />

      <div className="progress-grid">
        <StatCard value={24} label="Words learned" />
        <StatCard value={86} label="Reviews done" />
        <StatCard value={3} label="Streak" />
        <StatCard value="87%" label="Accuracy" />
      </div>

      <section className="progress-layout">
        <div className="study-card">
          <WordStrength />
          <WeeklyActivity />
        </div>
        <div className="study-card">
          <LearningPath />
          <Card>
            <div className="section-title">
              <div>
                <h3>Weak areas</h3>
                <p>Shown after enough reviews.</p>
              </div>
            </div>
            <div className="focus-list">
              <span>3rd tone</span>
              <span>Measure words</span>
              <span>了 / 的</span>
            </div>
          </Card>
        </div>
      </section>
    </>
  );
}

