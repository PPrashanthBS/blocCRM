import type { LeadStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

const statusStyles: Record<LeadStatus, string> = {
  new: 'bg-slate-900 text-white',
  contacted: 'bg-blue-600 text-white',
  qualified: 'bg-emerald-600 text-white',
  lost: 'bg-rose-500 text-white',
};

interface StatusBadgeProps {
  status: LeadStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  return (
    <span className={cn('rounded-full px-2.5 py-1 text-xs font-medium capitalize', statusStyles[status])}>
      {status}
    </span>
  );
};
