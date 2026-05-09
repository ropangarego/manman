import type { ContentItem } from '../../data/mockContent';
import { typeLabel } from '../../data/mockContent';

interface LibraryItemCardProps {
  item: ContentItem;
  active: boolean;
  onSelect: (id: string) => void;
}

export function LibraryItemCard({ item, active, onSelect }: LibraryItemCardProps) {
  return (
    <button
      className={`item-card item-${item.type.toLowerCase()}${active ? ' active' : ''}`}
      type="button"
      onClick={() => onSelect(item.id)}
    >
      <span>
        <h4>{item.title}</h4>
        <p>
          {item.pinyin.join(' ')} · {item.meaning}
        </p>
      </span>
      <em>{typeLabel(item.type)}</em>
    </button>
  );
}
