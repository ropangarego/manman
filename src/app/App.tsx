import { useEffect } from 'react';
import { AppShell } from '../components/shell/AppShell';
import { GlobalSheets } from '../components/ui/GlobalSheets';
import { Toast } from '../components/ui/Toast';
import { OnboardingScreen } from '../screens/Onboarding';
import { useAppStore } from '../stores/appStore';

export function App() {
  const onboarded = useAppStore((state) => state.onboarded);
  const darkMode = useAppStore((state) => state.settings.dark);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <main className="prototype-stage">
      <section className="app-frame" aria-live="polite">
        {onboarded ? <AppShell /> : <OnboardingScreen />}
      </section>
      <GlobalSheets />
      <Toast />
    </main>
  );
}
