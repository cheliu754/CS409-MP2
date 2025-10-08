// API raw types
export interface TmdbMovieRaw {
  id: number;
  title: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  genre_ids?: number[];
  genres?: { id: number; name: string }[];
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  popularity: number;
}

export interface TmdbPaged<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface TmdbGenre { id: number; name: string }


// Domain types
export interface ImageAsset { url: string; alt: string }
export interface GenreTag { id: number; name: string }
export interface Item {
  id: number;
  title: string;
  overview: string;
  poster?: ImageAsset;
  backdrop?: ImageAsset;
  genres: GenreTag[];
  releaseDate?: string;
  rating: number;
  popularity: number;
}
export interface Paged<T> { page: number; totalPages: number; total: number; results: T[] }


// Routing / UI types
export type SortKey = 'title' | 'popularity' | 'releaseDate' | 'rating';
export type SortOrder = 'asc' | 'desc';