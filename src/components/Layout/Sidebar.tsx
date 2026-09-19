import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  MessagesSquare,
  Settings,
  Table2,
  Lightbulb,
  X,
} from 'lucide-react';

const NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/responses', label: 'Responses', icon: Table2 },
  { to: '/insights', label: 'Product Insights', icon: Lightbulb },
  { to: '/feedback', label: 'Customer Feedback', icon: MessagesSquare },
  { to: '/settings', label: 'Settings', icon: Settings },
] as const;

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-ink-900/40 lg:hidden"
          aria-label="Close navigation overlay"
          onClick={onClose}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-paw-200/60 bg-white/95 backdrop-blur transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-between px-5 py-6">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-paw-700 text-paw-50"
              aria-hidden
            >
              <svg viewBox="0 0 64 64" className="h-6 w-6" fill="currentColor">
                <ellipse cx="22" cy="22" rx="7" ry="9" transform="rotate(-18 22 22)" />
                <ellipse cx="42" cy="22" rx="7" ry="9" transform="rotate(18 42 22)" />
                <ellipse cx="16" cy="36" rx="6" ry="8" transform="rotate(-8 16 36)" />
                <ellipse cx="48" cy="36" rx="6" ry="8" transform="rotate(8 48 36)" />
                <ellipse cx="32" cy="42" rx="11" ry="10" />
              </svg>
            </div>
            <div>
              <p className="font-display text-xl font-semibold tracking-tight text-paw-800">
                PUREPAW
              </p>
              <p className="text-[11px] tracking-wide text-ink-400 uppercase">
                Feedback Studio
              </p>
            </div>
          </div>
          <button
            type="button"
            className="rounded-lg p-2 text-ink-500 lg:hidden"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 pb-6">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={'end' in item ? item.end : false}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-paw-700 text-white shadow-sm'
                    : 'text-ink-600 hover:bg-paw-50 hover:text-paw-800'
                }`
              }
            >
              <item.icon className="h-4 w-4 shrink-0" aria-hidden />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-ink-100 px-5 py-4">
          <p className="text-xs leading-relaxed text-ink-400">
            Customer observations only. Not medical or nutritional claims.
          </p>
        </div>
      </aside>
    </>
  );
}
