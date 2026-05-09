import { learningPath } from '../../data/mockContent';
import { Card } from '../ui/Card';

export function LearningPath() {
  return (
    <Card>
      <div className="section-title">
        <div>
          <h3>Learning path</h3>
          <p>Your content unlock path.</p>
        </div>
      </div>
      <div className="path-list">
        {learningPath.map((item) => (
          <article className={`path-item ${item.status}`} key={item.title}>
            <span className="path-icon">{item.icon}</span>
            <div>
              <b>{item.title}</b>
              <small>{item.description}</small>
            </div>
            <em>{item.label}</em>
          </article>
        ))}
      </div>
    </Card>
  );
}

