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
    <article className={`item-card item-${item.type.toLowerCase()}${active ? ' active' : ''}`}>
      <button className="item-main-button" type="button" onClick={() => onSelect(item.id)}>
        <span className="item-text">
          <h4 className="mandarin-text">{item.title}</h4>
          <p>
            {showPinyin ? `${item.pinyin.join(' ')} · ` : ''}
            {item.meaning}
          </p>
        </span>
      </button>
      <span className="item-actions">
        <em>{typeLabel(item.type, language)}</em>
      </span>
    </article>
  );
}
