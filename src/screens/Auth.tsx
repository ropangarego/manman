import { useState } from 'react';
import { useTranslation } from '../i18n/useTranslation';
import { useAppStore } from '../stores/appStore';
import { Button } from '../components/ui/Button';
import { PasswordField } from '../components/ui/PasswordField';
import { displayNameFromUser, isSupabaseConfigured, supabase } from '../lib/supabase';

export function AuthScreen() {
  const { t } = useTranslation();
  const authMode = useAppStore((state) => state.authMode);
  const setAuthMode = useAppStore((state) => state.setAuthMode);
  const completeAuth = useAppStore((state) => state.completeAuth);
  const showToast = useAppStore((state) => state.showToast);
  const openSheet = useAppStore((state) => state.openSheet);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const isSignUp = authMode === 'signup';
  const canSubmit = email.trim().includes('@') && password.trim().length >= 6 && (!isSignUp || name.trim());

  async function handleSubmit() {
    if (!canSubmit || submitting) {
      return;
    }

    setAuthError('');
    setSubmitting(true);

    try {
      if (!isSupabaseConfigured || !supabase) {
        completeAuth({ mode: authMode, name, email });
        return;
      }

      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              display_name: name.trim(),
            },
          },
        });

        if (error) {
          setAuthError(error.message);
          return;
        }

        if (data.user && data.session) {
          if (!isSupabaseConfigured || !supabase) {
            completeAuth({ mode: 'signup', name: displayNameFromUser(data.user), email: data.user.email ?? email });
          }
          return;
        }

        showToast(t('toast.checkEmail'));
        setAuthMode('signin');
        setPassword('');
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setAuthError(error.message);
        return;
      }

      if (data.user && (!isSupabaseConfigured || !supabase)) {
        completeAuth({ mode: 'signin', name: displayNameFromUser(data.user), email: data.user.email ?? email });
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="auth-screen">
      <div className="auth-card">
        <div className="brand auth-brand">
          <span className="brand-mark">汉</span>
          <strong>Manman!</strong>
        </div>

        <div className="page-title">
          <h1>{isSignUp ? t('auth.signUpTitle') : t('auth.signInTitle')}</h1>
          <p>{isSignUp ? t('auth.signUpSub') : t('auth.signInSub')}</p>
        </div>

        <form
          className="auth-form"
          onSubmit={(event) => {
            event.preventDefault();
            void handleSubmit();
          }}
        >
          {isSignUp ? (
            <label>
              <span>{t('auth.name')}</span>
              <input value={name} autoComplete="name" onChange={(event) => setName(event.target.value)} />
            </label>
          ) : null}

          <label>
            <span>{t('auth.email')}</span>
            <input
              value={email}
              type="text"
              autoComplete="email"
              inputMode="email"
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>

          <label>
            <span>{t('auth.password')}</span>
            <PasswordField
              value={password}
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
              onChange={setPassword}
            />
          </label>

          <p className="auth-note">{t('auth.passwordHint')}</p>
          {authError ? (
            <p className="auth-note auth-error" role="alert">
              {authError}
            </p>
          ) : null}

          <Button type="submit" disabled={!canSubmit || submitting}>
            {submitting ? t('auth.working') : isSignUp ? t('auth.signUp') : t('auth.signIn')}
          </Button>
        </form>

        <div className="auth-secondary-actions">
          <div className="auth-switch">
            <span>{isSignUp ? t('auth.hasAccount') : t('auth.noAccount')}</span>
            <button type="button" onClick={() => setAuthMode(isSignUp ? 'signin' : 'signup')}>
              {isSignUp ? t('auth.useExisting') : t('auth.createAccount')}
            </button>
          </div>
          {!isSignUp ? (
            <button className="auth-inline-action" type="button" onClick={() => openSheet('forgotPassword')}>
              {t('auth.forgotPassword')}
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
