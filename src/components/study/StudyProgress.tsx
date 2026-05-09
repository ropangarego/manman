import type { StudyStep } from '../../stores/studyStore';

const studyInfo: Record<StudyStep, { completed: number; total: number; mode: string }> = {
  intro: { completed: 0, total: 15, mode: 'Session plan' },
  learn: { completed: 1, total: 15, mode: 'Learning new word' },
  practice: { completed: 2, total: 15, mode: 'Quick practice' },
  review: { completed: 6, total: 15, mode: 'Review due item' },
  summary: { completed: 15, total: 15, mode: 'Session summary' },
  unlocks: { completed: 15, total: 15, mode: 'Unlocked content' },
};

interface StudyProgressProps {
  step: StudyStep;
}

export function StudyProgress({ step }: StudyProgressProps) {
  const info = studyInfo[step];
  const percent = Math.round((info.completed / info.total) * 100);

  return (
    <section className="study-top" aria-label="Study progress">
      <div className="study-top-row">
        <b>
          {info.completed} / {info.total} completed
        </b>
        <span>Study session</span>
      </div>
      <div className="progressbar" aria-hidden="true">
        <i style={{ width: `${percent}%` }} />
      </div>
      <span className="mode-label">{info.mode}</span>
    </section>
  );
}

