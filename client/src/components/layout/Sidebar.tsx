import { NavLink } from 'react-router-dom';
import { PhoneCall, Shuffle, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUiStore } from '@/store/uiStore';

const navItems = [
  { label: 'Leads', to: '/leads', icon: Users },
  { label: 'Sales Caller', to: '/sales-callers', icon: PhoneCall },
  { label: 'Lead Assignment', to: '/lead-assignment', icon: Shuffle },
];

interface SidebarProps {
  onNavigate?: () => void;
}

export const Sidebar = ({ onNavigate }: SidebarProps) => {
  const { isSidebarCollapsed } = useUiStore();

  return (
    <aside
      className={cn(
        'flex h-full flex-col border-r border-slate-200/70 bg-white/80 backdrop-blur-xl',
        isSidebarCollapsed ? 'w-20' : 'w-64'
      )}
    >
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white">
          B
        </div>
        <div className={cn('leading-tight', isSidebarCollapsed && 'hidden')}>
          <p className="text-sm font-semibold text-slate-900">Bloc CRM</p>
          <p className="text-xs text-slate-500">Enterprise Workspace</p>
        </div>
      </div>

      <nav className="flex-1 px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  'group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition',
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                )
              }
            >
              <Icon className="h-5 w-5" />
              <span className={cn(isSidebarCollapsed && 'hidden')}>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className={cn('px-6 pb-6', isSidebarCollapsed && 'hidden')}>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Status</p>
          <p className="mt-2 text-sm font-medium text-slate-700">Syncing with API</p>
          <p className="text-xs text-slate-500">Last refresh just now</p>
        </div>
      </div>
    </aside>
  );
};
