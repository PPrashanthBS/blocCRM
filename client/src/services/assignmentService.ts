import { fetchJson } from '@/lib/apiClient';

export interface CallerStat {
  _id: string;
  name: string;
  role: string;
  dailyLeadLimit: number;
  assignedToday: number;
  remainingCapacity: number;
  assignedStates: string[];
}

export interface AssignmentStats {
  totalAssignments: number;
  assignedToday: number;
  totalCapacity: number;
  remainingCapacity: number;
  callers: CallerStat[];
}

export interface AssignmentResultItem {
  leadId: string;
  leadName: string;
  callerId: string;
  callerName: string;
  state: string;
  matchType: 'state' | 'global' | 'skipped';
  reason?: string;
}

export interface RunAssignmentResponse {
  message: string;
  assigned: number;
  skipped: number;
  results: AssignmentResultItem[];
}

export interface AssignmentRecord {
  _id: string;
  leadId: {
    _id: string;
    Name?: string;
    fullName?: string;
    Phone?: number;
    State?: string;
  };
  callerId: {
    _id: string;
    name: string;
    role: string;
    assignedStates?: string[];
  };
  assignedAt: string;
}

export interface AssignmentHistoryResponse {
  data: AssignmentRecord[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const getAssignmentStats = () =>
  fetchJson<AssignmentStats>('/assignments/stats');

export const runAssignment = () =>
  fetchJson<RunAssignmentResponse>('/assignments/run', undefined, {
    method: 'POST',
  });

export const getAssignmentHistory = (page = 1, limit = 20) =>
  fetchJson<AssignmentHistoryResponse>('/assignments/history', { page, limit });

export const resetAssignments = () =>
  fetchJson<{ message: string }>('/assignments/reset', undefined, {
    method: 'POST',
  });
