import type { LibraryTab, Stage } from '../../data/mockContent';
import { useAppStore } from '../../stores/appStore';

const tabs: LibraryTab[] = ['All', 'Hanzi', 'Words', 'Sentences'];

interface LibraryFiltersProps {
  search: string;
  tab: LibraryTab;
  stage: Stage | 'All';
  onSearch: (value: string) => void;
  onTabChange: (tab: LibraryTab) => void;
}

export function LibraryFilters({ search, tab, stage, onSearch, onTabChange }: LibraryFiltersProps) {
  const openSheet = useAppStore((state) => state.openSheet);

  return (
    <>
      <input
        className="search-input"
        value={search}
        placeholder="Search hanzi, pinyin, meaning..."
        onChange={(event) => onSearch(event.target.value)}
      />

      <div className="tabs" role="tablist" aria-label="Content type">
        {tabs.map((item) => (
          <button
            className={`tab-pill${tab === item ? ' active' : ''}`}
            key={item}
            type="button"
            role="tab"
            aria-selected={tab === item}
            onClick={() => onTabChange(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <button className="picker-row" type="button" onClick={() => openSheet('stage')}>
        <b>Stage</b>
        <span>{stage} ›</span>
      </button>
    </>
  );
}
