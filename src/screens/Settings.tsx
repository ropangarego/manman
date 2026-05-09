import { effectiveScript, sessionPlans } from '../data/mockContent';
import { PageHeader } from '../components/shell/PageHeader';
import { SettingRow } from '../components/settings/SettingRow';
import { SettingsGroup } from '../components/settings/SettingsGroup';
import { useAppStore } from '../stores/appStore';

export function SettingsScreen() {
  const sessionSize = useAppStore((state) => state.sessionSize);
  const scriptChoice = useAppStore((state) => state.scriptChoice);
  const settings = useAppStore((state) => state.settings);
  const openSheet = useAppStore((state) => state.openSheet);
  const toggleSetting = useAppStore((state) => state.toggleSetting);

  return (
    <>
      <PageHeader title="Settings" subtitle="Keep learning preferences simple and adjustable." />

      <section className="settings-layout">
        <SettingsGroup title="Learning">
          <SettingRow
            title="Session size"
            subtitle={sessionPlans[sessionSize].description}
            value={sessionSize}
            onClick={() => openSheet('sessionSize')}
          />
          <SettingRow
            title="Script"
            subtitle="Chinese character set."
            value={effectiveScript(scriptChoice)}
            onClick={() => openSheet('script')}
          />
          <SettingRow
            title="Pinyin display"
            subtitle="Control how much help you see."
            value={settings.pinyinDisplay}
            onClick={() => openSheet('pinyin')}
          />
          <SettingRow
            title="Tone colors"
            subtitle="Show tone dots and tone hints."
            toggle={{
              checked: settings.toneColors,
              onChange: () => toggleSetting('toneColors'),
            }}
          />
        </SettingsGroup>

        <SettingsGroup title="Study">
          <SettingRow
            title="Review style"
            subtitle="Choose how reviews feel."
            value={settings.reviewStyle}
            onClick={() => openSheet('reviewStyle')}
          />
          <SettingRow
            title="Sound"
            subtitle="Play pronunciation audio."
            toggle={{
              checked: settings.sound,
              onChange: () => toggleSetting('sound'),
            }}
          />
          <SettingRow
            title="Tutorial hints"
            subtitle="Show helper tips for beginners."
            toggle={{
              checked: settings.hints,
              onChange: () => toggleSetting('hints'),
            }}
          />
        </SettingsGroup>

        <SettingsGroup title="Display">
          <SettingRow
            title="Language"
            subtitle="App interface language."
            value={settings.language}
            onClick={() => openSheet('language')}
          />
          <SettingRow
            title="Dark mode"
            subtitle="Prototype placeholder."
            toggle={{
              checked: settings.dark,
              onChange: () => toggleSetting('dark'),
            }}
          />
        </SettingsGroup>

        <SettingsGroup title="Offline">
          <SettingRow
            title="Offline mode"
            subtitle="Download lessons and reviews."
            toggle={{
              checked: settings.offline,
              onChange: () => toggleSetting('offline'),
            }}
          />
          <SettingRow
            title="Manage downloads"
            subtitle="Storage use and offline packs."
            onClick={() => openSheet('downloads')}
          />
        </SettingsGroup>

        <>
          <SettingRow
            danger
            title="Logout"
            subtitle="Sign out on this device."
            onClick={() => openSheet('logout')}
          />
        </>
      </section>
    </>
  );
}
