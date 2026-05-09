import { weeklyActivity } from '../../data/mockContent';
import { Card } from '../ui/Card';

export function WeeklyActivity() {
  return (
    <Card>
      <div className="section-title">
        <div>
          <h3>Weekly activity</h3>
          <p>Minutes per day.</p>
        </div>
      </div>
      <div className="bars readable-bars">
        {weeklyActivity.map((day) => (
          <div className="bar-wrap" key={`${day.day}-${day.minutes}`}>
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

