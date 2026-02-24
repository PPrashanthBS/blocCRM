import { Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useUiStore } from '@/store/uiStore';

const titles: Record<string, string> = {
  '/leads': 'Leads Overview',
  '/sales-callers': 'Sales Caller Management',
  '/lead-assignment': 'Smart Lead Assignment',
};

interface TopbarProps {
  onOpenSidebar: () => void;
}

export const Topbar = ({ onOpenSidebar }: TopbarProps) => {
  const location = useLocation();
  const { toggleSidebar } = useUiStore();
  const title = titles[location.pathname] || 'CRM Dashboard';

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200/70 bg-white/80 px-6 py-4 backdrop-blur">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 lg:hidden"
          onClick={onOpenSidebar}
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Enterprise CRM</p>
          <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="outline" className="hidden lg:inline-flex" onClick={toggleSidebar}>
          Collapse
        </Button>
      </div>
    </header>
  );
};
