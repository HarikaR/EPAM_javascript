import { Menu, Download } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onMenuClick: () => void;
  onExport?: () => void;
}

export function Header({ title, subtitle, onMenuClick, onExport }: HeaderProps) {
  const { demoMode } = useAppContext();

  return (
    <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="mt-1 rounded-xl border border-ink-200 bg-white p-2 text-ink-600 lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <p className="font-display text-sm font-semibold tracking-[0.18em] text-paw-700 uppercase">
              PUREPAW
            </p>
            {demoMode ? (
              <span className="rounded-full bg-honey-400/15 px-2 py-0.5 text-[10px] font-bold tracking-wide text-honey-600 uppercase">
                Demo Data
              </span>
            ) : null}
          </div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-1 text-sm text-ink-500 sm:text-base">{subtitle}</p>
          ) : null}
        </div>
      </div>

      {onExport ? (
        <button
          type="button"
          onClick={onExport}
          className="inline-flex items-center gap-2 rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm font-medium text-ink-700 shadow-sm transition hover:bg-ink-50"
        >
          <Download className="h-4 w-4" aria-hidden />
          Export Responses CSV
        </button>
      ) : null}
    </header>
  );
}
