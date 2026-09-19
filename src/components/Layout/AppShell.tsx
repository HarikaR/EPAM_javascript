import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface AppShellProps {
  title: string;
  subtitle?: string;
  onExport?: () => void;
}

export function AppShell({ title, subtitle, onExport }: AppShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-5 sm:px-6 lg:px-8">
          <Header
            title={title}
            subtitle={subtitle}
            onMenuClick={() => setMenuOpen(true)}
            onExport={onExport}
          />
          <Outlet />
        </div>
      </div>
    </div>
  );
}

/** Layout wrapper that pages configure via route handle / nested route. */
export function RootLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <main className="flex min-w-0 flex-1 flex-col">
        <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-5 sm:px-6 lg:px-8">
          <Outlet context={{ openMenu: () => setMenuOpen(true) }} />
        </div>
      </main>
    </div>
  );
}

export interface OutletMenuContext {
  openMenu: () => void;
}
