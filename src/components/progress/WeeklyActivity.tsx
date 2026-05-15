import { Card } from '../ui/Card';
import { useTranslation } from '../../i18n/useTranslation';

interface WeeklyActivityProps {
  activity: { day: string; minutes: number }[];
}

export function WeeklyActivity({ activity }: WeeklyActivityProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <div className="section-title">
        <div>
          <h3>{t('progress.weeklyActivity')}</h3>
          <p>{t('progress.weeklyActivitySub')}</p>
        </div>
      </div>
      <div className="bars readable-bars">
        {activity.map((day, index) => (
          <div className="bar-wrap" key={`${day.day}-${index}`}>
            <span className="bar-value">{day.minutes}m</span>
            <div className="bar" aria-hidden="true">
              <i style={{ height: `${day.minutes * 3.2}px` }} />
            </div>
            <small>{day.day}</small>
          </div>
        ))}
      </div>
    </Card>
  );
}
