import { useMemo } from 'react';
import { LibraryDetail } from '../components/library/LibraryDetail';
import { LibraryFilters } from '../components/library/LibraryFilters';
import { LibraryItemCard } from '../components/library/LibraryItemCard';
import { PageHeader } from '../components/shell/PageHeader';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { contentItems, localizeContentItem } from '../data/mockContent';
import { useTranslation } from '../i18n/useTranslation';
import { useAppStore } from '../stores/appStore';
import { useProgressStore, withProgress } from '../stores/progressStore';

export function LibraryScreen() {
  const { language, t } = useTranslation();
  const search = useAppStore((state) => state.librarySearch);
  const tab = useAppStore((state) => state.libraryTab);
  const stage = useAppStore((state) => state.libraryStage);
  const limit = useAppStore((state) => state.libraryLimit);
  const selectedItemId = useAppStore((state) => state.selectedItemId);
  const setSearch = useAppStore((state) => state.setLibrarySearch);
  const setTab = useAppStore((state) => state.setLibraryTab);
  const selectItem = useAppStore((state) => state.selectLibraryItem);
  const loadMore = useAppStore((state) => state.loadMoreLibraryItems);
  const pinyinDisplay = useAppStore((state) => state.settings.pinyinDisplay);
  const progressItems = useProgressStore((state) => state.items);
  const showPinyin = pinyinDisplay !== 'Off';
  const itemsWithProgress = useMemo(
    () => withProgress(contentItems.map((item) => localizeContentItem(item, language)), progressItems),
    [language, progressItems],
  );

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    return itemsWithProgress.filter((item) => {
      const matchesTab = tab === 'All' || item.type === tab;
      const matchesStage = stage === 'All' || item.stage === stage;
      const searchable = `${item.title} ${item.pinyin.join(' ')} ${item.meaning}`.toLowerCase();
      return matchesTab && matchesStage && searchable.includes(query);
    });
  }, [itemsWithProgress, search, stage, tab]);

  const shownItems = filteredItems.slice(0, limit);
  const selectedItem = filteredItems.find((item) => item.id === selectedItemId) ?? filteredItems[0];
  const isDetailOpen = Boolean(selectedItemId && selectedItem);

  return (
    <>
      <PageHeader title={t('library.title')} subtitle={t('library.subtitle')} />

      <section className={`library-layout${isDetailOpen ? ' detail-open' : ''}`}>
        <div className="library-left">
          <LibraryFilters search={search} tab={tab} stage={stage} onSearch={setSearch} onTabChange={setTab} />

          <div className="item-list">
            {shownItems.map((item) => (
              <LibraryItemCard
                active={selectedItemId === item.id}
                item={item}
                key={item.id}
                showPinyin={showPinyin}
                onSelect={selectItem}
              />
            ))}
          </div>

          {filteredItems.length === 0 ? (
            <Card className="empty-state">
              <h3>{t('library.noItems')}</h3>
              <p>{t('library.noItemsSub')}</p>
            </Card>
          ) : null}

          {filteredItems.length > limit ? (
            <Button variant="secondary" className="load-more" type="button" onClick={loadMore}>
              {t('library.loadMore')}
            </Button>
          ) : null}
        </div>

        {selectedItem ? <LibraryDetail item={selectedItem} showPinyin={showPinyin} onBack={() => selectItem(null)} /> : null}
      </section>
    </>
  );
}
