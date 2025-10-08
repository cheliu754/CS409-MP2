import { useEffect, useState } from 'react';
import { tmdbGet, getEnv, buildImgUrl } from '../plugin/plugin';
import { TmdbMovieRaw, TmdbPaged, TmdbGenre, Item, SortKey, SortOrder } from '../types/types';


// Helper: mock switch
export const withMockIfNeeded = async <T,>(real: () => Promise<T>, mock: () => T | Promise<T>): Promise<T> => {
  if (featureFlags.useMock) return await mock();
  return await real();
};


// Search
export const searchMovies = (query: string, page = 1) =>
  withMockIfNeeded(async () => tmdbGet<TmdbPaged<TmdbMovieRaw>>('/search/movie', { query, page }), mockPagedMovies);


export const discoverMovies = (genreIds: number[] = [], page = 1) =>
  withMockIfNeeded(async () => tmdbGet<TmdbPaged<TmdbMovieRaw>>('/discover/movie', { with_genres: genreIds.join(','), sort_by: 'popularity.desc', page }), mockPagedMovies);


export const getMovieDetail = (id: number) =>
  withMockIfNeeded(async () => tmdbGet<TmdbMovieRaw>(`/movie/${id}`), () => mockDetail(id));


export const getGenres = () =>
  withMockIfNeeded(async () => tmdbGet<{ genres: TmdbGenre[] }>('/genre/movie/list'), mockGenres);


// Map API to domain Item
export const mapMovie = (raw: TmdbMovieRaw): Item => {
  const title = raw.title || raw.name || '';
  const poster = raw.poster_path ? { url: buildImgUrl('w342', raw.poster_path), alt: `${title} poster` } : undefined;
  const backdrop = raw.backdrop_path ? { url: buildImgUrl('w780', raw.backdrop_path), alt: `${title} backdrop` } : undefined;
  const genres = (
    raw.genres?.map((g: { id: number; name: string }) => ({ id: g.id, name: g.name }))
    || raw.genre_ids?.map((id: number) => ({ id, name: '' }))
    || []
  ) as { id: number; name: string }[];
  return {
    id: raw.id,
    title,
    overview: raw.overview,
    poster,
    backdrop,
    genres,
    releaseDate: raw.release_date || raw.first_air_date,
    rating: raw.vote_average,
    popularity: raw.popularity,
  };
};


// Persistence of last result ids
const IDS_KEY = 'last_ids';
export const saveIds = (ids: number[]) => { try { localStorage.setItem(IDS_KEY, JSON.stringify(ids)); } catch {} };
export const loadIds = (): number[] => { try { const s = localStorage.getItem(IDS_KEY); if (!s) return []; const arr = JSON.parse(s); return Array.isArray(arr) ? arr.filter((x: unknown) => typeof x === 'number') : []; } catch { return []; } };


// searchApplyClientFilter + searchApplyClientSort
export const filterByQuery = (items: Item[], q: string) => {
  const k = q.trim().toLowerCase();
  if (!k) return items;
  return items.filter((i: Item) => i.title.toLowerCase().includes(k) || i.overview.toLowerCase().includes(k));
};


export const filterByGenres = (items: Item[], ids: number[]) => {
  if (!ids.length) return items;
  const set = new Set(ids);
  return items.filter((i: Item) => i.genres.some((g: { id: number; name: string }) => set.has(g.id)));
};


export const applyClientSort = (items: Item[], key: SortKey = 'title', order: SortOrder = 'asc') => {
  const s = [...items].sort((a: Item, b: Item) => {
    const va = (a as any)[key] ?? '';
    const vb = (b as any)[key] ?? '';
    if (va < vb) return -1; if (va > vb) return 1; return 0;
  });
  return order === 'asc' ? s : s.reverse();
};


export const useDebouncedValue = <T,>(val: T, ms = 300) => {
  const [v, setV] = useState(val);
  useEffect(() => { const t = setTimeout(() => setV(val), ms); return () => clearTimeout(t); }, [val, ms]);
  return v;
};


export const getPrevNextIndex = (ids: number[], currentId: number) => {
  const idx = ids.indexOf(currentId);
  if (idx === -1) return { prev: undefined, next: undefined };
  const prev = idx === 0 ? ids[ids.length - 1] : ids[idx - 1];
  const next = idx === ids.length - 1 ? ids[0] : ids[idx + 1];
  return { prev, next };
};


export const normalizeError = (e: any) => ({ message: e?.message ?? 'Unknown error' });


export const SORT_FIELDS: { key: SortKey; label: string }[] = [
  { key: 'title', label: 'Title' },
  { key: 'popularity', label: 'Popularity' },
  { key: 'rating', label: 'Rating' },
];


export const featureFlags = {
    useMock: getEnv().USE_MOCK, debug: false
};


// Mock data 
function mockPagedMovies(): TmdbPaged<TmdbMovieRaw> {
  return { page: 1, total_pages: 1, total_results: 3, results: [
    { id: 1, title: 'Mock One', overview: 'Overview one', poster_path: null, backdrop_path: null, genre_ids: [28, 12], vote_average: 7.1, popularity: 123 },
    { id: 2, title: 'Mock Two', overview: 'Overview two', poster_path: null, backdrop_path: null, genre_ids: [35], vote_average: 6.4, popularity: 98 },
    { id: 3, title: 'Mock Three', overview: 'Overview three', poster_path: null, backdrop_path: null, genre_ids: [18], vote_average: 8.3, popularity: 201 },
  ] };
}
function mockDetail(id: number): TmdbMovieRaw {
  return { id, title: `Mock #${id}`, overview: 'Mock detail', poster_path: null, backdrop_path: null, genres: [{ id: 28, name: 'Action' }], vote_average: 7.0, popularity: 100 };
}
function mockGenres() { return { genres: [ { id: 28, name: 'Action' }, { id: 12, name: 'Adventure' }, { id: 35, name: 'Comedy' }, { id: 18, name: 'Drama' } ] }; }