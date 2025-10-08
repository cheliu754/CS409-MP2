import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Item, SortKey, SortOrder } from '../types/types';
import {
  SearchBar,
  SortControl,
  Card,
  GalleryGrid,
  Spinner,
  EmptyState,
  ErrorState,
  DetailAttributes,
} from '../components/components';
import {
  searchMovies,
  discoverMovies,
  getGenres,
  getMovieDetail,
  mapMovie,
  filterByQuery,
  filterByGenres,
  applyClientSort,
  useDebouncedValue,
  getPrevNextIndex,
  saveIds,
  loadIds,
} from '../functions/utensil';

// List
export const ListPage = () => {
  const [q, setQ] = useState('');
  const [sort0, setSort0] = useState<SortKey>('title');
  const [order0, setOrder0] = useState<SortOrder>('asc');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<Item[]>([]);

  const debouncedQ = useDebouncedValue(q, 300);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        // Use searchMovies if available, otherwise fallback to discoverMovies
        let results: Item[] = [];
        if (debouncedQ.trim()) {
          const page1 = await searchMovies(debouncedQ, 1);
          results = page1.results.map(mapMovie);
        } else {
          const page1 = await discoverMovies([], 1);
          results = page1.results.map(mapMovie);
        }
        setItems(results);
        saveIds(results.map((i: Item) => i.id));
      } catch (e: any) {
        setError(e?.message ?? 'Error');
      } finally {
        setLoading(false);
      }
    })();
  }, [debouncedQ]);

  const filtered = useMemo(() => filterByQuery(items, debouncedQ), [items, debouncedQ]);
  const sorted = useMemo(() => applyClientSort(filtered, sort0, order0), [filtered, sort0, order0]);

  const onQChange = (v: string) => setQ(v);
  const onSortChange = (s: SortKey, o: SortOrder) => {
    setSort0(s);
    setOrder0(o);
  };

  return (
    <section className="stack">
      <h1>Movie Search</h1>
      <SearchBar value={q} onChange={onQChange} placeholder="Type to search movies…" />
      <SortControl sort={sort0} order={order0} onChange={onSortChange} />
      {loading && <Spinner />}
      {error && <ErrorState message={error} onRetry={() => onQChange(q)} />}
      {!loading && !error && sorted.length === 0 && <EmptyState hint="Try another keyword." />}
      <div className="stack">
        {sorted.map((it: Item) => (
          <Card key={it.id} item={it} />
        ))}
      </div>
    </section>
  );
};

// Gallery
export const GalleryPage = () => {
  const [sp, setSp] = useSearchParams();
  const init = (sp.get('genres') ?? '')
    .split(',')
    .filter(Boolean)
    .map(Number);

  const [selected, setSelected] = useState<number[]>(init);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [genreOptions, setGenreOptions] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [{ genres }, page1] = await Promise.all([getGenres(), discoverMovies([], 1)]);
        setGenreOptions(genres);
        const mapped = page1.results.map(mapMovie);
        setItems(mapped);
        saveIds(mapped.map((i: Item) => i.id));
      } catch (e: any) {
        setError(e?.message ?? 'Error');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => filterByGenres(items, selected), [items, selected]);

  useEffect(() => {
    saveIds(filtered.map((i: Item) => i.id));
  }, [filtered]);

  const onToggle = (id: number) => {
    const next = selected.includes(id) ? selected.filter((x: number) => x !== id) : [...selected, id];
    setSelected(next);
    const qs = next.join(',');
    if (qs) sp.set('genres', qs);
    else sp.delete('genres');
    setSp(sp, { replace: true });
  };

  return (
    <section className="stack">
      <h1>Gallery</h1>
      <div className="filters">
        {genreOptions.map((o: { id: number; name: string }) => (
          <button
            key={o.id}
            className={`chip ${selected.includes(o.id) ? 'chipActive' : ''}`}
            onClick={() => onToggle(o.id)}
          >
            {o.name}
          </button>
        ))}
      </div>
      {loading && <Spinner />}
      {error && <ErrorState message={error} />}
      {!loading && !error && filtered.length === 0 && (
        <EmptyState hint="No items for current filters." />
      )}
      <GalleryGrid items={filtered} />
    </section>
  );
};

// Detail
export const DetailPage = () => {
  const params = useParams();
  const id = Number(params.id);

  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nav = useNavigate();
  const ids = loadIds();

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const raw = await getMovieDetail(id);
        setItem(mapMovie(raw));
      } catch (e: any) {
        setError(e?.message ?? 'Error');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const { prev, next } = useMemo(() => getPrevNextIndex(ids, id), [ids, id]);

  if (loading) return <Spinner />;
  if (error) return <ErrorState message={error} onRetry={() => nav(0)} />;
  if (!item) return null;

  return (
    <section className="stack container">
      {item.backdrop && (
        <img className="backdrop" src={item.backdrop.url} alt={item.backdrop.alt} />
      )}
      <DetailAttributes item={item} />
      <div id="PN-button-2" className="detail-nav">
        {prev && (
          <button className="detail-nav-btn" onClick={() => nav(`/detail/${prev}`)}>◀ Prev</button>
        )}
        {next && (
          <button className="detail-nav-btn" onClick={() => nav(`/detail/${next}`)}>Next ▶</button>
        )}
      </div>
    </section>
  );
};