interface StudyProgressProps {
  completed: number;
  total: number;
  mode: string;
  completedLabel?: string;
  sessionLabel?: string;
}

export function StudyProgress({
  completed,
  total,
  mode,
  completedLabel = 'completed',
  sessionLabel = 'Study session',
}: StudyProgressProps) {
  const safeTotal = Math.max(total, 0);
  const safeCompleted = Math.min(Math.max(completed, 0), safeTotal);
  const percent = safeTotal > 0 ? Math.round((safeCompleted / safeTotal) * 100) : 0;

  return (
    <section className="study-top" aria-label="Study progress">
      <div className="study-top-row">
        <b>
          {safeCompleted} / {safeTotal} {completedLabel}
        </b>
        <span>{sessionLabel}</span>
      </div>
      <div className="progressbar" aria-hidden="true">
        <i style={{ width: `${percent}%` }} />
      </div>
      <span className="mode-label">{mode}</span>
    </section>
  );
}
