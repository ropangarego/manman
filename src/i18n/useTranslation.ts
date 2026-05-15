import { useAppStore } from '../stores/appStore';
import { translate, type AppLanguage } from './copy';

export function useTranslation() {
  const language = useAppStore((state) => state.settings.language);

  return {
    language: language as AppLanguage,
    t: (key: Parameters<typeof translate>[1], values?: Parameters<typeof translate>[2]) =>
      translate(language as AppLanguage, key, values),
  };
}
