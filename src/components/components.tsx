import { Link } from 'react-router-dom';
import { Item, SortKey, SortOrder } from '../types/types';
import { SORT_FIELDS } from '../functions/utensil';


// UI
export const Spinner = () => (
  <div className="state" role="status" aria-live="polite">Loading…</div>
);

export const EmptyState = ({ title = 'No results', hint }: { title?: string; hint?: string }) => (
  <div className="state">
    <h3>{title}</h3>
    {hint && <p>{hint}</p>}
  </div>
);

export const ErrorState = ({ message, onRetry }: { message: string; onRetry?: () => void }) => (
  <div className="state">
    <h3>Something went wrong</h3>
    <p>{message}</p>
    {onRetry && <button onClick={onRetry}>Retry</button>}
  </div>
);


// Search + Sort
export const SearchBar = ({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) => (
  <div className="searchRow">
    <input  
      className="searchInput"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder ?? 'Search…'}
    />
    {value && <button onClick={() => onChange('')}>Clear</button>}
  </div>
);

export const SortControl = ({ sort, order, onChange }: { sort: SortKey; order: SortOrder; onChange: (s: SortKey, o: SortOrder) => void }) => (
  <div className="sortRow">
    <label>Sort by</label>
    <select value={sort} onChange={(e) => onChange(e.target.value as SortKey, order)}>
      {SORT_FIELDS.map((f) => (
        <option key={f.key} value={f.key}>{f.label}</option>
      ))}
    </select>
    <button onClick={() => onChange(sort, order === 'asc' ? 'desc' : 'asc')} aria-label="Toggle sort order">
      {order === 'asc' ? 'Asc' : 'Desc'}
    </button>
  </div>
);


// List Card
export const Card = ({ item }: { item: Item }) => (
  <Link to={`/detail/${item.id}`} className="card">
    <img className="poster" src={item.poster?.url ?? ''} alt={item.poster?.alt ?? item.title} />
    <div>
      <div className="title">{item.title}</div>
      <div className="meta">⭐ {item.rating.toFixed(1)} · {item.releaseDate ?? '—'}</div>
      <p>{item.overview}</p>
    </div>
  </Link>
);


// Gallery Grid
export const GalleryGrid = ({ items }: { items: Item[] }) => (
  <div className="grid">
    {items.map((m: Item) => (
      <Link key={m.id} to={`/detail/${m.id}`} className="gridCard">
        <img className="gridImg" src={m.poster?.url ?? ''} alt={m.poster?.alt ?? m.title} />
        <div className="gridTitle">{m.title}</div>
      </Link>
    ))}
  </div>
);


// Detail Attributes
export const DetailAttributes = ({ item, onPrev, onNext, prevLabel, nextLabel }: {
  item: Item;
  onPrev?: () => void;
  onNext?: () => void;
  prevLabel?: React.ReactNode;
  nextLabel?: React.ReactNode;
}) => (
  <div className="detail-attributes">
    <div id="PN-button">
      {onPrev && (
        <button id="Prev-button" onClick={onPrev}>
          {prevLabel || '◀ Prev'}
        </button>
      )}
      {onNext && (
        <button id="Next-button" onClick={onNext}>
          {nextLabel || 'Next ▶'}
        </button>
      )}
    </div>
    <h3>{item.title}</h3>
    <p>{item.releaseDate}</p>
    <p>{item.overview}</p>
    <p>Rating: {item.rating}</p>
    <p>Popularity: {item.popularity}</p>
  </div>
);