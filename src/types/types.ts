// API raw types
export interface Item { id: number; title: string; overview: string; rating: number; popularity: number }
export type SortKey = 'title'|'popularity'|'rating';
export type SortOrder = 'asc'|'desc';