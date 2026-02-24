import { fetchJson } from '@/lib/apiClient';
import type { Lead, PaginatedResponse } from '@/lib/types';

export interface LeadsQuery {
  search?: string;
  status?: string;
  source?: string;
  state?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const getLeads = (query: LeadsQuery) => {
  return fetchJson<PaginatedResponse<Lead>>('/leads', query as Record<string, string | number | boolean | undefined | null>);
};

export const deleteLead = (id: string) => {
  return fetchJson<{ message: string }>(`/leads/${id}`, undefined, { method: 'DELETE' });
};
