export type Item = {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string;
  image?: string;
  release_date?: string;
  overview?: string;
  rating?: number;
  popularity?: number;
};

export type SortKey = 'title'|'popularity'|'rating';
export type SortOrder = 'asc'|'desc';