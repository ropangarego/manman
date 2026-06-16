import { useMemo } from 'react';
import { LibraryDetail } from '../components/library/LibraryDetail';
import { LibraryFilters } from '../components/library/LibraryFilters';
import { LibraryItemCard } from '../components/library/LibraryItemCard';
import { PageHeader } from '../components/shell/PageHeader';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { contentItems, localizeContentItem, type ContentItem } from '../data/mockContent';
import { useTranslation } from '../i18n/useTranslation';
import { useAppStore } from '../stores/appStore';
import { useProgressStore, withProgress } from '../stores/progressStore';

function scrollMainContainerToTopOnNarrowView() {
  if (typeof window === 'undefined' || !window.matchMedia('(max-width: 767px)').matches) {
    return;
  }

  window.requestAnimationFrame(() => {
    const scrollContainer = document.querySelector<HTMLElement>('.screen');
    const fallback = document.scrollingElement ?? document.documentElement;

    (scrollContainer ?? fallback).scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
}

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
  const scriptChoice = useAppStore((state) => state.scriptChoice);
  const progressItems = useProgressStore((state) => state.items);
  const showPinyin = pinyinDisplay !== 'Off';
  const itemsWithProgress = useMemo(
    () => withProgress(contentItems.map((item) => localizeContentItem(item, language, scriptChoice)), progressItems),
    [language, progressItems, scriptChoice],
  );

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    const matchesSearch = (item: ContentItem) => {
      if (!query) {
        return true;
      }

      const fields = [
        item.title,
        item.traditionalTitle,
        item.pinyin.join(' '),
        item.meaning,
        item.meaningId,
        item.mnemonic,
        item.mnemonicId,
        item.id,
        ...item.related,
      ]
        .filter((value): value is string => Boolean(value))
        .map((value) => value.toLowerCase());
      const isHanQuery = /[\u3400-\u9fff]/.test(query);

      return fields.some((field) => {
        if (isHanQuery || query.includes(' ')) {
          return field.includes(query);
        }

        return field
          .split(/[^\p{L}\p{N}]+/u)
          .filter(Boolean)
          .some((token) => token === query);
      });
    };

    return itemsWithProgress.filter((item) => {
      const matchesTab = tab === 'All' || item.type === tab;
      const matchesStage =
        stage === 'All' || (stage === 'Not started' ? item.started === false : item.started !== false && item.stage === stage);
      return matchesTab && matchesStage && matchesSearch(item);
    });
  }, [itemsWithProgress, search, stage, tab]);

  const shownItems = filteredItems.slice(0, limit);
  const selectedItem = filteredItems.find((item) => item.id === selectedItemId) ?? filteredItems[0];
  const isDetailOpen = Boolean(selectedItemId && selectedItem);
  const handleSelectItem = (id: string) => {
    selectItem(id);
    scrollMainContainerToTopOnNarrowView();
  };

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
                onSelect={handleSelectItem}
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
