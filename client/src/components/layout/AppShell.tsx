import { useState } from 'react';
import type { ReactNode } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { cn } from '@/lib/utils';
import { useUiStore } from '@/store/uiStore';

interface AppShellProps {
  children: ReactNode;
}

export const AppShell = ({ children }: AppShellProps) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { isSidebarCollapsed } = useUiStore();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f7f3ed,_#eef2f7_50%,_#e7ecf3_100%)]">
      <div className="relative flex min-h-screen">
        <div
          className={cn(
            'fixed inset-y-0 left-0 z-40 transition-transform lg:translate-x-0',
            isMobileOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <Sidebar onNavigate={() => setIsMobileOpen(false)} />
        </div>

        {isMobileOpen && (
          <button
            type="button"
            className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm lg:hidden"
            onClick={() => setIsMobileOpen(false)}
            aria-label="Close sidebar"
          />
        )}

        <div
          className={cn(
            'flex min-h-screen flex-1 flex-col transition-all',
            isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
          )}
        >
          <Topbar onOpenSidebar={() => setIsMobileOpen(true)} />
          <main className="flex-1 px-6 py-6">
            <div className="mx-auto w-full max-w-6xl">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
};
