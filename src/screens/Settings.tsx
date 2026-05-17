import { effectiveScript, sessionPlanDescription } from '../data/mockContent';
import { optionLabel } from '../i18n/copy';
import { useTranslation } from '../i18n/useTranslation';
import { PageHeader } from '../components/shell/PageHeader';
import { SettingRow } from '../components/settings/SettingRow';
import { SettingsGroup } from '../components/settings/SettingsGroup';
import { useAppStore } from '../stores/appStore';

export function SettingsScreen() {
  const { language, t } = useTranslation();
  const sessionSize = useAppStore((state) => state.sessionSize);
  const scriptChoice = useAppStore((state) => state.scriptChoice);
  const authName = useAppStore((state) => state.authName);
  const authEmail = useAppStore((state) => state.authEmail);
  const settings = useAppStore((state) => state.settings);
  const openSheet = useAppStore((state) => state.openSheet);
  const toggleSetting = useAppStore((state) => state.toggleSetting);

  return (
    <>
      <PageHeader title={t('nav.settings')} subtitle={t('settings.subtitle')} />

      <section className="settings-layout settings-layout-organized">
        <div className="settings-column">
          <SettingsGroup title={t('settings.profile')}>
            <SettingRow
              title={t('settings.profileDetails')}
              subtitle={authEmail || t('settings.profileDetailsSub')}
              value={authName || 'Learner'}
              onClick={() => openSheet('editProfile')}
            />
            <SettingRow
              title={t('settings.changePassword')}
              subtitle={t('settings.changePasswordSub')}
              onClick={() => openSheet('changePassword')}
            />
          </SettingsGroup>

          <SettingsGroup title={t('settings.learning')}>
            <SettingRow
              title={t('settings.sessionSize')}
              subtitle={sessionPlanDescription(sessionSize, language)}
              value={optionLabel(language, sessionSize)}
              onClick={() => openSheet('sessionSize')}
            />
            <SettingRow
              title={t('settings.script')}
              subtitle={t('settings.scriptSub')}
              value={optionLabel(language, effectiveScript(scriptChoice))}
              onClick={() => openSheet('script')}
            />
            <SettingRow
              title={t('settings.pinyinDisplay')}
              subtitle={t('settings.pinyinSub')}
              value={optionLabel(language, settings.pinyinDisplay)}
              onClick={() => openSheet('pinyin')}
            />
            <SettingRow
              title={t('settings.toneColors')}
              subtitle={t('settings.toneColorsSub')}
              toggle={{
                checked: settings.toneColors,
                onChange: () => toggleSetting('toneColors'),
              }}
            />
          </SettingsGroup>

          <SettingsGroup title={t('settings.study')}>
            <SettingRow
              title={t('settings.reviewStyle')}
              subtitle={t('settings.reviewStyleSub')}
              value={optionLabel(language, settings.reviewStyle)}
              onClick={() => openSheet('reviewStyle')}
            />
            <SettingRow
              title={t('settings.sound')}
              subtitle={t('settings.soundSub')}
              toggle={{
                checked: settings.sound,
                onChange: () => toggleSetting('sound'),
              }}
            />
            <SettingRow
              title={t('settings.speechSpeed')}
              subtitle={t('settings.speechSpeedSub')}
              value={optionLabel(language, settings.speechSpeed)}
              onClick={() => openSheet('speechSpeed')}
            />
            <SettingRow
              title={t('settings.hints')}
              subtitle={t('settings.hintsSub')}
              toggle={{
                checked: settings.hints,
                onChange: () => toggleSetting('hints'),
              }}
            />
          </SettingsGroup>
        </div>

        <div className="settings-column">
          <SettingsGroup title={t('settings.display')}>
            <SettingRow
              title={t('settings.language')}
              subtitle={t('settings.languageSub')}
              value={optionLabel(language, settings.language)}
              onClick={() => openSheet('language')}
            />
            <SettingRow
              title={t('settings.darkMode')}
              subtitle={t('settings.darkModeSub')}
              toggle={{
                checked: settings.dark,
                onChange: () => toggleSetting('dark'),
              }}
            />
          </SettingsGroup>

          <SettingsGroup title={t('settings.offline')}>
            <SettingRow
              title={t('settings.offlineMode')}
              subtitle={t('settings.offlineModeSub')}
              toggle={{
                checked: settings.offline,
                onChange: () => toggleSetting('offline'),
              }}
            />
            <SettingRow
              title={t('settings.downloads')}
              subtitle={t('settings.downloadsSub')}
              onClick={() => openSheet('downloads')}
            />
            <SettingRow
              title={t('settings.installApp')}
              subtitle={t('settings.installAppSub')}
              onClick={() => openSheet('installApp')}
            />
          </SettingsGroup>

          <SettingsGroup title={t('settings.account')}>
            <SettingRow
              danger
              title={t('settings.resetLearningProgress')}
              subtitle={t('settings.resetLearningProgressSub')}
              onClick={() => openSheet('resetLearningProgress')}
            />
            <SettingRow
              danger
              title={t('settings.resetApp')}
              subtitle={t('settings.resetAppSub')}
              onClick={() => openSheet('resetApp')}
            />
            <SettingRow
              danger
              title={t('common.logout')}
              subtitle={t('settings.logoutSub')}
              onClick={() => openSheet('logout')}
            />
          </SettingsGroup>
        </div>
      </section>
    </>
  );
}
