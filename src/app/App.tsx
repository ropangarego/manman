import { lazy, Suspense, useEffect, useState } from 'react';
import { AppShell } from '../components/shell/AppShell';
import { GlobalSheets } from '../components/ui/GlobalSheets';
import { Toast } from '../components/ui/Toast';
import { AuthScreen } from '../screens/Auth';
import { OnboardingScreen } from '../screens/Onboarding';
import { useAppStore } from '../stores/appStore';
import { useStudyStore } from '../stores/studyStore';
import { fetchOrCreateProfile } from '../lib/profileSync';
import { replaceWith } from '../utils/navigation';
import {
  displayNameFromUser,
  isSupabaseConfigured,
  supabase,
  type SupabaseUser,
} from '../lib/supabase';

const AdminApp = lazy(() => import('../admin/AdminApp'));

function isPasswordRecoveryUrl() {
  if (typeof window === 'undefined') {
    return false;
  }

  const recoveryText = `${window.location.search}&${window.location.hash}`;
  return (
    recoveryText.includes('type=recovery') ||
    recoveryText.includes('PASSWORD_RECOVERY') ||
    recoveryText.includes('recovery=1')
  );
}

function clearPasswordRecoveryUrl() {
  if (typeof window === 'undefined') {
    return;
  }

  window.history.replaceState(null, '', window.location.pathname || '/');
}

export function App() {
  const signedIn = useAppStore((state) => state.signedIn);
  const role = useAppStore((state) => state.role);
  const onboarded = useAppStore((state) => state.onboarded);
  const darkMode = useAppStore((state) => state.settings.dark);
  const language = useAppStore((state) => state.settings.language);
  const syncAuthenticatedUser = useAppStore((state) => state.syncAuthenticatedUser);
  const applyRemoteProfile = useAppStore((state) => state.applyRemoteProfile);
  const syncSignedOut = useAppStore((state) => state.syncSignedOut);
  const openSheet = useAppStore((state) => state.openSheet);
  const setScreen = useAppStore((state) => state.setScreen);
  const [authReady, setAuthReady] = useState(!isSupabaseConfigured || !supabase);
  const [path, setPath] = useState(() => (typeof window === 'undefined' ? '/' : window.location.pathname));
  const isAdminPath = path.startsWith('/admin');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    const syncPath = () => setPath(window.location.pathname);
    window.addEventListener('popstate', syncPath);
    return () => window.removeEventListener('popstate', syncPath);
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      return undefined;
    }

    let active = true;
    let recoveryRequested = isPasswordRecoveryUrl();
    let recoveryHandled = false;

    async function restoreUser(user: SupabaseUser, options: { passwordRecovery?: boolean } = {}) {
      const shouldOpenPasswordRecovery =
        !recoveryHandled && (recoveryRequested || options.passwordRecovery === true);

      if (shouldOpenPasswordRecovery) {
        recoveryHandled = true;
        recoveryRequested = false;
      }

      try {
        syncAuthenticatedUser({ name: displayNameFromUser(user), email: user.email ?? '' });

        const { profile } = await fetchOrCreateProfile(user);
        if (active && profile) {
          applyRemoteProfile(profile);
          useStudyStore.getState().setSessionIndex(profile.currentSessionIndex);
        }

        if (active && shouldOpenPasswordRecovery) {
          clearPasswordRecoveryUrl();
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
        setAuthReady(false);
        void restoreUser(user, { passwordRecovery: event === 'PASSWORD_RECOVERY' });
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

  useEffect(() => {
    if (!authReady || !isAdminPath) {
      return;
    }

    if (!signedIn || role !== 'admin') {
      setScreen('home');
      replaceWith('/');
    }
  }, [authReady, isAdminPath, role, setScreen, signedIn]);

  const loadingState = (
    <div className="app-loading">
      <div className="brand auth-brand">
        <span className="brand-mark">&#x6C49;</span>
        <strong>Manman!</strong>
      </div>
      <p>{language === 'Indonesian' ? 'Menyiapkan ruang belajarmu...' : 'Loading your learning space...'}</p>
    </div>
  );

  const content = !authReady ? (
    loadingState
  ) : isAdminPath && signedIn && role === 'admin' ? (
    <Suspense
      fallback={
        <div className="app-loading">
          <strong>Admin Panel</strong>
          <p>Loading QA workspace...</p>
        </div>
      }
    >
      <AdminApp />
    </Suspense>
  ) : !signedIn ? (
    <AuthScreen />
  ) : onboarded ? (
    <AppShell />
  ) : (
    <OnboardingScreen />
  );

  return (
    <div className="prototype-stage">
      <section className="app-frame" aria-live="polite">
        {content}
      </section>
      <GlobalSheets />
      <Toast />
    </div>
  );
}
