export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'lost';

export interface Lead {
  _id: string;
  fullName: string;
  phone: string;
  status: LeadStatus;
  source: string;
  city?: string;
  state?: string;
  notes?: string;
  assignedTo?: {
    _id: string;
    name: string;
    role?: string;
  } | null;
  createdAt: string;
}

export interface SalesCaller {
  _id: string;
  name: string;
  role: string;
  languages: string[];
  dailyLeadLimit: number;
  assignedStates?: string[];
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
