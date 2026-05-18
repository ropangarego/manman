import { useEffect, useState } from 'react';
import { sessionPlanDescription } from '../../data/mockContent';
import { useInstallPrompt } from '../../hooks/useInstallPrompt';
import { optionLabel } from '../../i18n/copy';
import { useTranslation } from '../../i18n/useTranslation';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';
import { useAppStore, type SheetType } from '../../stores/appStore';
import { useProgressStore } from '../../stores/progressStore';
import { useStudyStore } from '../../stores/studyStore';
import {
  SPEECH_SPEED_SAMPLE,
  speakMandarin,
  speechRateForSpeed,
  type SpeechSpeed,
} from '../../utils/audio';
import { AudioButton } from './AudioButton';
import { Button } from './Button';
import { OptionSheet, type SheetOption } from './OptionSheet';
import { PasswordField } from './PasswordField';
import { ReportIssueSheet } from '../study/ReportIssueSheet';

export function GlobalSheets() {
  const { language, t } = useTranslation();
  const activeSheet = useAppStore((state) => state.activeSheet);
  const closeSheet = useAppStore((state) => state.closeSheet);
  const chooseSheetValue = useAppStore((state) => state.chooseSheetValue);
  const libraryStage = useAppStore((state) => state.libraryStage);
  const sessionSize = useAppStore((state) => state.sessionSize);
  const scriptChoice = useAppStore((state) => state.scriptChoice);
  const settings = useAppStore((state) => state.settings);
  const authName = useAppStore((state) => state.authName);
  const authEmail = useAppStore((state) => state.authEmail);
  const recommendedSessionIndex = useAppStore((state) => state.recommendedSessionIndex);
  const updateProfile = useAppStore((state) => state.updateProfile);
  const confirmLogout = useAppStore((state) => state.confirmLogout);
  const showToast = useAppStore((state) => state.showToast);
  const resetProgress = useProgressStore((state) => state.resetProgress);
  const resetStudyProgress = useStudyStore((state) => state.resetStudyProgress);
  const { canInstall, promptInstall } = useInstallPrompt();
  const speedOptions: Array<{ value: SpeechSpeed; sub: string }> = [
    { value: 'Slow', sub: t('sheets.speedSlowSub') },
    { value: 'Normal', sub: t('sheets.speedNormalSub') },
    { value: 'Fast', sub: t('sheets.speedFastSub') },
  ];
  const [profileName, setProfileName] = useState(authName);
  const [profileEmail, setProfileEmail] = useState(authEmail);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetEmail, setResetEmail] = useState(authEmail);
  const [sheetBusy, setSheetBusy] = useState(false);
  const [sheetError, setSheetError] = useState('');
  const canSaveProfile = profileName.trim().length > 0 && profileEmail.trim().includes('@');
  const canUpdatePassword = newPassword.trim().length >= 6 && newPassword === confirmPassword;
  const canSendReset = resetEmail.trim().includes('@');

  useEffect(() => {
    if (activeSheet === 'editProfile') {
      setProfileName(authName);
      setProfileEmail(authEmail);
    }

    if (activeSheet === 'changePassword' || activeSheet === 'updatePassword') {
      setNewPassword('');
      setConfirmPassword('');
    }

    if (activeSheet === 'forgotPassword') {
      setResetEmail(authEmail);
    }

    setSheetBusy(false);
    setSheetError('');
  }, [activeSheet, authEmail, authName]);

  const sheetConfigs: Partial<
    Record<SheetType, { title: string; sub?: string; current: string; options: SheetOption[] }>
  > = {
    stage: {
      title: t('sheets.stageTitle'),
      sub: t('sheets.stageSub'),
      current: 'All',
      options: ['All', 'Learning', 'Familiar', 'Strong', 'Mastered', 'Long-term'].map((value) => ({
        label: optionLabel(language, value),
        value,
      })),
    },
    sessionSize: {
      title: language === 'Indonesian' ? 'Ukuran sesi' : 'Session size',
      sub: t('sheets.sessionSizeSub'),
      current: 'Standard',
      options: ['Light', 'Standard', 'Intense'].map((value) => ({
        label: optionLabel(language, value),
        value,
        sub: sessionPlanDescription(value as 'Light' | 'Standard' | 'Intense', language),
      })),
    },
    script: {
      title: t('sheets.scriptTitle'),
      current: 'Simplified',
      options: [
        { label: optionLabel(language, 'Simplified'), value: 'Simplified', sub: t('onboarding.simplifiedSub') },
        { label: optionLabel(language, 'Traditional'), value: 'Traditional', sub: t('onboarding.traditionalSub') },
      ],
    },
    pinyin: {
      title: language === 'Indonesian' ? 'Tampilan pinyin' : 'Pinyin display',
      current: 'Always',
      options: [
        { label: t('sheets.pinyinAlways'), value: 'Always', sub: t('sheets.pinyinAlwaysSub') },
        { label: t('sheets.pinyinLessonOnly'), value: 'Lesson only', sub: t('sheets.pinyinLessonOnlySub') },
        { label: t('sheets.pinyinHidden'), value: 'Hidden in review', sub: t('sheets.pinyinHiddenSub') },
        { label: t('sheets.pinyinOff'), value: 'Off', sub: t('sheets.pinyinOffSub') },
      ],
    },
    reviewStyle: {
      title: language === 'Indonesian' ? 'Gaya review' : 'Review style',
      current: 'Simple',
      options: [
        { label: t('sheets.reviewSimple'), value: 'Simple', sub: t('sheets.reviewSimpleSub') },
        { label: t('sheets.reviewMixed'), value: 'Mixed', sub: t('sheets.reviewMixedSub') },
      ],
    },
    language: {
      title: language === 'Indonesian' ? 'Bahasa' : 'Language',
      current: 'English',
      options: [
        { label: optionLabel(language, 'English'), value: 'English' },
        { label: optionLabel(language, 'Indonesian'), value: 'Indonesian' },
      ],
    },
    downloads: {
      title: t('sheets.downloadTitle'),
      sub: t('sheets.downloadSub'),
      current: 'Downloaded',
      options: [
        { label: t('sheets.downloaded'), value: 'Downloaded', sub: t('sheets.downloadedSub') },
        { label: t('sheets.refreshOffline'), value: 'Refresh', sub: t('sheets.refreshOfflineSub') },
      ],
    },
  };

  if (activeSheet === 'report') {
    return <ReportIssueSheet open onClose={closeSheet} />;
  }

  if (activeSheet === 'logout') {
    return (
      <OptionSheet
        open
        title={t('sheets.logoutTitle')}
        sub={t('sheets.logoutSub')}
        className="logout-sheet"
        onClose={closeSheet}
        footer={
          <div className="sheet-actions">
            <Button variant="secondary" type="button" onClick={closeSheet}>
              {t('common.cancel')}
            </Button>
            <Button
              variant="danger"
              type="button"
              onClick={async () => {
                if (isSupabaseConfigured && supabase) {
                  await supabase.auth.signOut();
                }

                resetProgress();
                resetStudyProgress(recommendedSessionIndex);
                confirmLogout();
              }}
            >
              {t('common.logout')}
            </Button>
          </div>
        }
      />
    );
  }

  if (activeSheet === 'resetLearningProgress') {
    return (
      <OptionSheet
        open
        title={t('sheets.resetLearningTitle')}
        sub={t('sheets.resetLearningSub')}
        className="logout-sheet"
        onClose={closeSheet}
        footer={
          <div className="sheet-actions">
            <Button variant="secondary" type="button" onClick={closeSheet}>
              {t('common.cancel')}
            </Button>
            <Button
              variant="danger"
              type="button"
              onClick={() => {
                resetProgress();
                resetStudyProgress(recommendedSessionIndex);
                showToast(t('toast.learningProgressReset'));
                closeSheet();
              }}
            >
              {t('common.reset')}
            </Button>
          </div>
        }
      />
    );
  }

  if (activeSheet === 'editProfile') {
    return (
      <OptionSheet
        open
        title={t('sheets.profileTitle')}
        sub={t('sheets.profileSub')}
        className="profile-sheet"
        onClose={closeSheet}
      >
        <form
          className="sheet-form"
          onSubmit={async (event) => {
            event.preventDefault();

            if (!canSaveProfile || sheetBusy) {
              return;
            }

            setSheetBusy(true);
            setSheetError('');

            try {
              if (isSupabaseConfigured && supabase) {
                const { error: authError } = await supabase.auth.updateUser({
                  email: profileEmail.trim(),
                  data: { display_name: profileName.trim() },
                });

                if (authError) {
                  setSheetError(authError.message);
                  return;
                }

                const { error: profileError } = await supabase
                  .from('profiles')
                  .update({ display_name: profileName.trim(), email: profileEmail.trim() })
                  .eq('id', (await supabase.auth.getUser()).data.user?.id ?? '');

                if (profileError) {
                  setSheetError(profileError.message);
                  return;
                }
              }

              updateProfile({ name: profileName, email: profileEmail });
              closeSheet();
            } finally {
              setSheetBusy(false);
            }
          }}
        >
          <label>
            <span>{t('sheets.profileName')}</span>
            <input value={profileName} autoComplete="name" onChange={(event) => setProfileName(event.target.value)} />
          </label>
          <label>
            <span>{t('sheets.profileEmail')}</span>
            <input
              value={profileEmail}
              type="email"
              autoComplete="email"
              inputMode="email"
              onChange={(event) => setProfileEmail(event.target.value)}
            />
          </label>
          <div className="sheet-actions">
            <Button variant="secondary" type="button" onClick={closeSheet}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={!canSaveProfile || sheetBusy}>
              {sheetBusy ? t('common.saving') : t('sheets.saveProfile')}
            </Button>
          </div>
          {sheetError ? (
            <p className="auth-note auth-error" role="alert">
              {sheetError}
            </p>
          ) : null}
        </form>
      </OptionSheet>
    );
  }

  if (activeSheet === 'changePassword' || activeSheet === 'updatePassword') {
    const isRecoveryUpdate = activeSheet === 'updatePassword';

    return (
      <OptionSheet
        open
        title={isRecoveryUpdate ? t('sheets.updatePasswordTitle') : t('sheets.changePasswordTitle')}
        sub={isRecoveryUpdate ? t('sheets.updatePasswordSub') : t('sheets.changePasswordSub')}
        className="password-change-sheet"
        onClose={closeSheet}
      >
        <form
          className="sheet-form"
          onSubmit={async (event) => {
            event.preventDefault();

            if (!canUpdatePassword || sheetBusy) {
              return;
            }

            setSheetBusy(true);
            setSheetError('');

            try {
              if (isSupabaseConfigured && supabase) {
                const { error } = await supabase.auth.updateUser({ password: newPassword });

                if (error) {
                  setSheetError(error.message);
                  return;
                }
              }

              if (isRecoveryUpdate) {
                window.history.replaceState(null, '', window.location.pathname || '/');
              }

              showToast(t('toast.passwordUpdated'));
              closeSheet();
            } finally {
              setSheetBusy(false);
            }
          }}
        >
          <label>
            <span>{t('sheets.newPassword')}</span>
            <PasswordField value={newPassword} autoComplete="new-password" onChange={setNewPassword} />
          </label>
          <label>
            <span>{t('sheets.confirmPassword')}</span>
            <PasswordField value={confirmPassword} autoComplete="new-password" onChange={setConfirmPassword} />
          </label>
          <div className="sheet-actions">
            <Button variant="secondary" type="button" onClick={closeSheet}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={!canUpdatePassword || sheetBusy}>
              {sheetBusy ? t('common.updating') : t('sheets.updatePassword')}
            </Button>
          </div>
          {sheetError ? (
            <p className="auth-note auth-error" role="alert">
              {sheetError}
            </p>
          ) : null}
        </form>
      </OptionSheet>
    );
  }

  if (activeSheet === 'installApp') {
    return (
      <OptionSheet
        open
        title={t('sheets.installTitle')}
        sub={t('sheets.installSub')}
        className="install-sheet"
        onClose={closeSheet}
      >
        <div className="install-sheet-body">
          <div className="install-hint">
            <strong>{canInstall ? t('sheets.installReady') : t('sheets.installUnavailable')}</strong>
            <small>{canInstall ? t('sheets.installReadySub') : t('sheets.installUnavailableSub')}</small>
          </div>
          <div className="sheet-actions">
            <Button variant="secondary" type="button" onClick={closeSheet}>
              {t('common.cancel')}
            </Button>
            <Button
              type="button"
              onClick={async () => {
                const outcome = await promptInstall();
                showToast(t(outcome === 'unavailable' ? 'toast.installUnavailable' : 'toast.installOpened'));
                closeSheet();
              }}
            >
              {t('sheets.installButton')}
            </Button>
          </div>
        </div>
      </OptionSheet>
    );
  }

  if (activeSheet === 'forgotPassword') {
    return (
      <OptionSheet
        open
        title={t('sheets.passwordResetTitle')}
        sub={t('sheets.passwordResetSub')}
        className="password-reset-sheet"
        onClose={closeSheet}
      >
        <form
          className="sheet-form"
          onSubmit={async (event) => {
            event.preventDefault();

            if (!canSendReset || sheetBusy) {
              return;
            }

            setSheetBusy(true);
            setSheetError('');

            try {
              if (isSupabaseConfigured && supabase) {
                const { error } = await supabase.auth.resetPasswordForEmail(resetEmail.trim(), {
                  redirectTo: `${window.location.origin}?recovery=1`,
                });

                if (error) {
                  setSheetError(error.message);
                  return;
                }
              }

              showToast(t('toast.passwordResetPlaceholder'));
              closeSheet();
            } finally {
              setSheetBusy(false);
            }
          }}
        >
          <label>
            <span>{t('auth.email')}</span>
            <input
              value={resetEmail}
              type="email"
              autoComplete="email"
              inputMode="email"
              onChange={(event) => setResetEmail(event.target.value)}
            />
          </label>
          <div className="sheet-actions">
            <Button variant="secondary" type="button" onClick={closeSheet}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={!canSendReset || sheetBusy}>
              {sheetBusy ? t('common.sending') : t('sheets.passwordResetButton')}
            </Button>
          </div>
          {sheetError ? (
            <p className="auth-note auth-error" role="alert">
              {sheetError}
            </p>
          ) : null}
        </form>
      </OptionSheet>
    );
  }

  if (activeSheet === 'speechSpeed') {
    return (
      <OptionSheet
        open
        title={t('sheets.speechSpeedTitle')}
        sub={t('sheets.speechSpeedSub')}
        className="speech-speed-sheet"
        onClose={closeSheet}
      >
        <div className="option-list speech-speed-options">
          {speedOptions.map((option) => {
            const selected = option.value === settings.speechSpeed;

            return (
              <div className={`sheet-option speed-option${selected ? ' selected' : ''}`} key={option.value}>
                <button
                  className="speed-choice"
                  type="button"
                  aria-current={selected}
                  onClick={() => chooseSheetValue('speechSpeed', option.value)}
                >
                  <span>
                    <strong>{optionLabel(language, option.value)}</strong>
                    <small>{option.sub}</small>
                  </span>
                  <em>{selected ? '✓' : ''}</em>
                </button>
                <AudioButton
                  className="speed-preview-button"
                  label={`Preview ${optionLabel(language, option.value)} pronunciation speed`}
                  onPlay={() => speakMandarin(SPEECH_SPEED_SAMPLE, speechRateForSpeed(option.value))}
                />
              </div>
            );
          })}
        </div>
      </OptionSheet>
    );
  }

  if (!activeSheet) {
    return null;
  }

  const config = sheetConfigs[activeSheet];
  if (!config) {
    return null;
  }

  const currentBySheet: Record<string, string> = {
    stage: libraryStage,
    sessionSize,
    script: scriptChoice === 'Not sure' ? 'Simplified' : scriptChoice,
    pinyin: settings.pinyinDisplay,
    reviewStyle: settings.reviewStyle,
    speechSpeed: settings.speechSpeed,
    language: settings.language,
    downloads: 'Downloaded',
  };

  return (
    <OptionSheet
      open
      title={config.title}
      sub={config.sub}
      options={config.options}
      current={currentBySheet[activeSheet] ?? config.current}
      onClose={closeSheet}
      onSelect={(value) => chooseSheetValue(activeSheet, value)}
    />
  );
}
