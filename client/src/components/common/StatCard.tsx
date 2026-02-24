import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  helper?: string;
  icon: LucideIcon;
  tone?: 'neutral' | 'positive' | 'warning';
}

const toneStyles: Record<string, string> = {
  neutral: 'bg-slate-900 text-white',
  positive: 'bg-emerald-600 text-white',
  warning: 'bg-amber-500 text-white',
};

export const StatCard = ({ label, value, helper, icon: Icon, tone = 'neutral' }: StatCardProps) => {
  return (
    <Card className="flex items-center justify-between border-slate-200/70 bg-white/80 p-5 shadow-sm">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{label}</p>
        <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
        {helper && <p className="mt-1 text-xs text-slate-500">{helper}</p>}
      </div>
      <div className={cn('flex h-12 w-12 items-center justify-center rounded-2xl', toneStyles[tone])}>
        <Icon className="h-5 w-5" />
      </div>
    </Card>
  );
};
