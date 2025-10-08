import { Item } from '../types/types';

export const Spinner = () => <div>Loading…</div>;
export const EmptyState = ({ title = 'No results', hint }: { title?: string; hint?: string }) => (
  <div>
    <h3>{title}</h3>
    {hint && <p>{hint}</p>}
  </div>
);
export const ErrorState = ({ message }: { message: string }) => (
  <div>
    <h3>Something went wrong</h3>
    <p>{message}</p>
  </div>
);
export const Card = ({ item, onClick }: { item: Item; onClick?: () => void }) => (
  <div className="card" onClick={onClick}>
    <img src={item.poster_path || item.image} alt={item.title || item.name} />
    <div className="card-content">
      <h4>{item.title || item.name}</h4>
      {item.release_date && <p>{item.release_date}</p>}
      {item.overview && <p className="card-overview">{item.overview}</p>}
      {item.rating !== undefined && <p>Rating: {item.rating}</p>}
      {item.popularity !== undefined && <p>Popularity: {item.popularity}</p>}
    </div>
  </div>
);
export const Gallery = ({ items, onItemClick }: { items: Item[]; onItemClick?: (item: Item) => void }) => (
  <div className="gallery">
    {items.length === 0 ? (
      <EmptyState title="No items found" />
    ) : (
      items.map((item) => (
        <Card key={item.id} item={item} onClick={onItemClick ? () => onItemClick(item) : undefined} />
      ))
    )}
  </div>
);
export const SearchBar = ({ value, onChange, placeholder = "Search..." }: { value: string; onChange: (v: string) => void; placeholder?: string }) => (
  <input
    className="search-bar"
    type="text"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    autoFocus
  />
);