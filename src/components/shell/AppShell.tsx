import { useAppStore } from '../../stores/appStore';
import { HomeScreen } from '../../screens/Home';
import { LibraryScreen } from '../../screens/Library';
import { ProgressScreen } from '../../screens/Progress';
import { SettingsScreen } from '../../screens/Settings';
import { StudyScreen } from '../../screens/Study';
import { BottomNav } from './BottomNav';
import { Sidebar } from './Sidebar';

export function AppShell() {
  const screen = useAppStore((state) => state.screen);

  const currentScreen = {
    home: <HomeScreen />,
    study: <StudyScreen />,
    library: <LibraryScreen />,
    progress: <ProgressScreen />,
    settings: <SettingsScreen />,
  }[screen];

  return (
    <section className="app-shell">
      <Sidebar />
      <main className="screen">
        <div className={`screen-inner${screen === 'home' ? ' home-grid' : ''}`}>{currentScreen}</div>
      </main>
      <BottomNav />
    </section>
  );
}

