const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

type QueryValue = string | number | boolean | undefined | null;

type QueryParams = Record<string, QueryValue>;

const buildUrl = (path: string, params?: QueryParams) => {
  const url = new URL(`${API_BASE_URL}${path}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        return;
      }
      url.searchParams.set(key, String(value));
    });
  }

  return url.toString();
};

export const fetchJson = async <T>(path: string, params?: QueryParams, options?: RequestInit): Promise<T> => {
  const response = await fetch(buildUrl(path, params), {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Request failed');
  }

  return response.json() as Promise<T>;
};
