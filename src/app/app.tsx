import React, { useState } from 'react';
import { Gallery, SearchBar } from '../components/components';
import { mockItems, applyClientSort, SORT_FIELDS } from '../functions/utensil';
import { Item, SortKey, SortOrder } from '../types/types';

export const App = () => {
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('title');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const filtered = mockItems.filter(
    (item: Item) =>
      item.title?.toLowerCase().includes(query.toLowerCase()) ||
      item.name?.toLowerCase().includes(query.toLowerCase())
  );
  const sorted = applyClientSort(filtered, sortKey, sortOrder);
  const selected = sorted.find(i => i.id === selectedId);

  return (
    <div className="app">
      <header>
        <h2>TMDB Gallery (Stage 2)</h2>
        <SearchBar value={query} onChange={setQuery} />
        <div style={{ marginTop: 16 }}>
          <select value={sortKey} onChange={e => setSortKey(e.target.value as SortKey)}>
            {SORT_FIELDS.map(f => (
              <option key={f.key} value={f.key}>{f.label}</option>
            ))}
          </select>
          <select value={sortOrder} onChange={e => setSortOrder(e.target.value as SortOrder)} style={{ marginLeft: 8 }}>
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
        </div>
      </header>
      <main>
        <Gallery items={sorted} onItemClick={item => setSelectedId(item.id)} />
        {selected && (
          <div className="detail-view">
            <button onClick={() => setSelectedId(null)} style={{ marginBottom: 16 }}>Back</button>
            <h3>{selected.title || selected.name}</h3>
            <img src={selected.poster_path || selected.image} alt={selected.title || selected.name} style={{ width: 180, height: 270, objectFit: 'cover', background: '#333' }} />
            <p>{selected.release_date}</p>
            <p>{selected.overview}</p>
            <p>Rating: {selected.rating}</p>
            <p>Popularity: {selected.popularity}</p>
          </div>
        )}
      </main>
    </div>
  );
};