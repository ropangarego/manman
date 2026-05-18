import { useEffect, useState } from 'react';
import { AppShell } from '../components/shell/AppShell';
import { GlobalSheets } from '../components/ui/GlobalSheets';
import { Toast } from '../components/ui/Toast';
import { AuthScreen } from '../screens/Auth';
import { OnboardingScreen } from '../screens/Onboarding';
import { useAppStore } from '../stores/appStore';
import { useStudyStore } from '../stores/studyStore';
import { fetchOrCreateProfile } from '../lib/profileSync';
import {
  displayNameFromUser,
  initialPasswordRecoveryUrl,
  isSupabaseConfigured,
  supabase,
  type SupabaseUser,
} from '../lib/supabase';

function isPasswordRecoveryUrl() {
  if (typeof window === 'undefined') {
    return false;
  }

  const recoveryText = `${window.location.search}&${window.location.hash}`;
  return (
    initialPasswordRecoveryUrl ||
    recoveryText.includes('type=recovery') ||
    recoveryText.includes('PASSWORD_RECOVERY') ||
    recoveryText.includes('recovery=1')
  );
}

export function App() {
  const signedIn = useAppStore((state) => state.signedIn);
  const onboarded = useAppStore((state) => state.onboarded);
  const darkMode = useAppStore((state) => state.settings.dark);
  const language = useAppStore((state) => state.settings.language);
  const syncAuthenticatedUser = useAppStore((state) => state.syncAuthenticatedUser);
  const applyRemoteProfile = useAppStore((state) => state.applyRemoteProfile);
  const syncSignedOut = useAppStore((state) => state.syncSignedOut);
  const openSheet = useAppStore((state) => state.openSheet);
  const [authReady, setAuthReady] = useState(!isSupabaseConfigured || !supabase);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      return undefined;
    }

    let active = true;
    let recoveryRequested = isPasswordRecoveryUrl();

    async function restoreUser(user: SupabaseUser, options: { passwordRecovery?: boolean } = {}) {
      try {
        recoveryRequested = recoveryRequested || options.passwordRecovery === true;
        syncAuthenticatedUser({ name: displayNameFromUser(user), email: user.email ?? '' });

        const { profile } = await fetchOrCreateProfile(user);
        if (active && profile) {
          applyRemoteProfile(profile);
          useStudyStore.getState().setSessionIndex(profile.currentSessionIndex);
        }

        if (active && recoveryRequested) {
          openSheet('updatePassword');
        }
      } finally {
        if (active) {
          setAuthReady(true);
        }
      }
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      const user = session?.user;
      if (user?.email) {
        recoveryRequested = recoveryRequested || event === 'PASSWORD_RECOVERY';
        setAuthReady(false);
        void restoreUser(user, { passwordRecovery: recoveryRequested });
      } else {
        syncSignedOut();
        setAuthReady(true);
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      if (!active) {
        return;
      }

      const user = data.session?.user;
      if (user?.email) {
        setAuthReady(false);
        void restoreUser(user, { passwordRecovery: recoveryRequested });
      } else {
        syncSignedOut();
        setAuthReady(true);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [applyRemoteProfile, openSheet, syncAuthenticatedUser, syncSignedOut]);

  return (
    <main className="prototype-stage">
      <section className="app-frame" aria-live="polite">
        {!authReady ? (
          <div className="app-loading">
            <div className="brand auth-brand">
              <span className="brand-mark">汉</span>
              <strong>Manman!</strong>
            </div>
            <p>{language === 'Indonesian' ? 'Menyiapkan ruang belajarmu...' : 'Loading your learning space...'}</p>
          </div>
        ) : !signedIn ? (
          <AuthScreen />
        ) : onboarded ? (
          <AppShell />
        ) : (
          <OnboardingScreen />
        )}
      </section>
      <GlobalSheets />
      <Toast />
    </main>
  );
}
