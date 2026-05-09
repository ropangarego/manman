import { useAppStore, type Screen } from '../../stores/appStore';
import { useStudyStore } from '../../stores/studyStore';

const navItems: { id: Screen; label: string; path: string }[] = [
  { id: 'home', label: 'Home', path: 'M4 11.5 12 5l8 6.5V20h-5v-5H9v5H4z' },
  {
    id: 'study',
    label: 'Study',
    path: 'M5 5.5h6a3 3 0 0 1 3 3V20a3 3 0 0 0-3-3H5z M14 8.5a3 3 0 0 1 3-3h2v11.5h-2a3 3 0 0 0-3 3',
  },
  { id: 'library', label: 'Library', path: 'M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 0-3-3z M8 8h7 M8 12h6' },
  { id: 'progress', label: 'Progress', path: 'M5 19V5 M5 19h14 M8 16v-4 M12 16V8 M16 16v-7' },
  { id: 'settings', label: 'Settings', path: 'M5 8h14 M5 16h14 M9 8a2 2 0 1 0 0.1 0 M15 16a2 2 0 1 0 .1 0' },
];

export function Sidebar() {
  const screen = useAppStore((state) => state.screen);
  const setScreen = useAppStore((state) => state.setScreen);
  const resetStudy = useStudyStore((state) => state.resetInteractions);

  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark">汉</span>
        <strong>Mandarin!</strong>
      </div>
      <nav className="sidebar-nav" aria-label="Main navigation">
        {navItems.map(({ id, label, path }) => (
          <button
            className={`side-btn${screen === id ? ' active' : ''}`}
            key={id}
            type="button"
            aria-current={screen === id ? 'page' : undefined}
            onClick={() => {
              resetStudy();
              setScreen(id);
            }}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d={path} />
            </svg>
            <span>{label}</span>
          </button>
        ))}
      </nav>
      
    </aside>
  );
}
