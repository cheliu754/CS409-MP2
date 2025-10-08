import axios, { type InternalAxiosRequestConfig, type AxiosResponse } from 'axios';

export const getEnv = () => ({
  READ_TOKEN: process.env.REACT_APP_TMDB_READ_TOKEN ?? '',
  BASE_URL: process.env.REACT_APP_TMDB_BASE_URL ?? 'https://api.themoviedb.org/3',
  IMG_BASE: process.env.REACT_APP_IMAGE_BASE_URL ?? 'https://image.tmdb.org/t/p',
  LANG: process.env.REACT_APP_TMDB_LANG ?? 'en-US',
  REGION: process.env.REACT_APP_TMDB_REGION ?? undefined,
  USE_MOCK: (process.env.REACT_APP_USE_MOCK ?? '0') === '1',
});

export const getBaseName = () => process.env.PUBLIC_URL || '/';

const env = getEnv();
export const http = axios.create({ baseURL: env.BASE_URL, timeout: 12000 });
http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  // Use  Bearer token for authentication
  const token = env.READ_TOKEN;
  if (token) {
    config.headers = { ...(config.headers ?? {}), Authorization: `Bearer ${token}` } as any;
  }
  // add language & optional region
  config.params = { ...(config.params || {}), language: env.LANG, ...(env.REGION ? { region: env.REGION } : {}) };
  return config;
});
http.interceptors.response.use(
  (r: AxiosResponse) => r,
  (err: any) => Promise.reject({ status: err?.response?.status, message: err?.message ?? 'Network error' })
);

// Image helpers
export const buildImgUrl = (size: 'w92'|'w154'|'w185'|'w342'|'w500'|'w780'|'original', path: string | null | undefined) => {
  if (!path) return '';
  return `${env.IMG_BASE}/${size}${path}`;
};

// Simple GET cache
const cache = new Map<string, { ts: number; data: any }>();
const TTL_MS = 1000 * 60 * 5; // 5 minutes
export async function tmdbGet<T = any>(path: string, params?: Record<string, any>, useCache = true): Promise<T> {
  const key = `${path}?${JSON.stringify(params || {})}`;
  const now = Date.now();
  if (useCache) {
    const hit = cache.get(key);
    if (hit && (now - hit.ts) < TTL_MS) return hit.data as T;
  }
  const { data } = await http.get<T>(path, { params });
  if (useCache) cache.set(key, { ts: now, data });
  return data;
}