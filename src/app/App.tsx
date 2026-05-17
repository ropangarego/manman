import { useEffect } from 'react';
import { AppShell } from '../components/shell/AppShell';
import { GlobalSheets } from '../components/ui/GlobalSheets';
import { Toast } from '../components/ui/Toast';
import { AuthScreen } from '../screens/Auth';
import { OnboardingScreen } from '../screens/Onboarding';
import { useAppStore } from '../stores/appStore';
import { fetchOrCreateProfile } from '../lib/profileSync';
import { displayNameFromUser, isSupabaseConfigured, supabase, type SupabaseUser } from '../lib/supabase';

export function App() {
  const signedIn = useAppStore((state) => state.signedIn);
  const onboarded = useAppStore((state) => state.onboarded);
  const darkMode = useAppStore((state) => state.settings.dark);
  const syncAuthenticatedUser = useAppStore((state) => state.syncAuthenticatedUser);
  const applyRemoteProfile = useAppStore((state) => state.applyRemoteProfile);
  const syncSignedOut = useAppStore((state) => state.syncSignedOut);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      return undefined;
    }

    let active = true;

    async function restoreUser(user: SupabaseUser) {
      syncAuthenticatedUser({ name: displayNameFromUser(user), email: user.email ?? '' });

      const { profile } = await fetchOrCreateProfile(user);
      if (active && profile) {
        applyRemoteProfile(profile);
      }
    }

    supabase.auth.getSession().then(({ data }) => {
      if (!active) {
        return;
      }

      const user = data.session?.user;
      if (user?.email) {
        void restoreUser(user);
      } else {
        syncSignedOut();
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user;
      if (user?.email) {
        void restoreUser(user);
      } else {
        syncSignedOut();
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [applyRemoteProfile, syncAuthenticatedUser, syncSignedOut]);

  return (
    <main className="prototype-stage">
      <section className="app-frame" aria-live="polite">
        {!signedIn ? <AuthScreen /> : onboarded ? <AppShell /> : <OnboardingScreen />}
      </section>
      <GlobalSheets />
      <Toast />
    </main>
  );
}
