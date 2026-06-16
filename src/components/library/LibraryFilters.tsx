import type { LibraryStage, LibraryTab } from '../../data/mockContent';
import { optionLabel } from '../../i18n/copy';
import { useTranslation } from '../../i18n/useTranslation';
import { useAppStore } from '../../stores/appStore';

const tabs: LibraryTab[] = ['All', 'Hanzi', 'Words', 'Sentences'];

interface LibraryFiltersProps {
  search: string;
  tab: LibraryTab;
  stage: LibraryStage;
  onSearch: (value: string) => void;
  onTabChange: (tab: LibraryTab) => void;
}

export function LibraryFilters({ search, tab, stage, onSearch, onTabChange }: LibraryFiltersProps) {
  const { language, t } = useTranslation();
  const openSheet = useAppStore((state) => state.openSheet);

  return (
    <>
      <input
        className="search-input"
        value={search}
        placeholder={t('library.search')}
        onChange={(event) => onSearch(event.target.value)}
      />

      <div className="tabs" role="tablist" aria-label={t('library.contentType')}>
        {tabs.map((item) => (
          <button
            className={`tab-pill${tab === item ? ' active' : ''}`}
            key={item}
            type="button"
            role="tab"
            aria-selected={tab === item}
            onClick={() => onTabChange(item)}
          >
            {optionLabel(language, item)}
          </button>
        ))}
      </div>

      <button className="picker-row" type="button" onClick={() => openSheet('stage')}>
        <b>{t('common.stage')}</b>
        <span>{optionLabel(language, stage)} &rsaquo;</span>
      </button>
    </>
  );
}
