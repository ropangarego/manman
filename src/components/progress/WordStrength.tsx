import { wordStrength } from '../../data/mockContent';
import { Card } from '../ui/Card';

export function WordStrength() {
  return (
    <Card>
      <div className="section-title">
        <div>
          <h3>Word strength</h3>
          <p>Counts words only.</p>
        </div>
      </div>
      <div className="strength-list">
        {wordStrength.map((item) => (
          <div className="strength-row" key={item.stage}>
            <span>{item.stage}</span>
            <div className="strength-track" aria-hidden="true">
              <i style={{ width: `${item.width}%`, background: item.color }} />
            </div>
            <span>{item.count} words</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

