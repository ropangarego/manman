import type { ContentItem } from '../../data/mockContent';
import { typeLabel } from '../../data/mockContent';
import { useTranslation } from '../../i18n/useTranslation';

interface LibraryItemCardProps {
  item: ContentItem;
  active: boolean;
  showPinyin: boolean;
  onSelect: (id: string) => void;
}

export function LibraryItemCard({ item, active, showPinyin, onSelect }: LibraryItemCardProps) {
  const { language } = useTranslation();

  return (
    <button
      className={`item-card item-${item.type.toLowerCase()}${active ? ' active' : ''}`}
      type="button"
      onClick={() => onSelect(item.id)}
    >
      <span>
        <h4>{item.title}</h4>
        <p>
          {showPinyin ? `${item.pinyin.join(' ')} · ` : ''}{item.meaning}
        </p>
      </span>
      <em>{typeLabel(item.type, language)}</em>
    </button>
  );
}
