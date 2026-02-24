import { fetchJson } from '@/lib/apiClient';
import type { SalesCaller } from '@/lib/types';

export const getSalesCallers = () => fetchJson<{ data: SalesCaller[] }>('/sales-callers');

export interface SalesCallerPayload {
  name: string;
  role: string;
  languages: string[];
  dailyLeadLimit: number;
  assignedStates?: string[];
}

export const createSalesCaller = (payload: SalesCallerPayload) =>
  fetchJson<{ data: SalesCaller }>('/sales-callers', undefined, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const updateSalesCaller = (id: string, payload: Partial<SalesCallerPayload>) =>
  fetchJson<{ data: SalesCaller }>(`/sales-callers/${id}`, undefined, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });

export const deleteSalesCaller = (id: string) =>
  fetchJson<{ message: string }>(`/sales-callers/${id}`, undefined, {
    method: 'DELETE',
  });
