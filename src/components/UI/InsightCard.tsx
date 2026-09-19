import type { ReactNode } from 'react';

interface InsightCardProps {
  title: string;
  count: number;
  examples: string[];
  tone?: 'positive' | 'improve';
}

export function InsightCard({
  title,
  count,
  examples,
  tone = 'positive',
}: InsightCardProps) {
  return (
    <article className="card-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-lg font-semibold text-ink-900">
          {title}
        </h3>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
            tone === 'positive'
              ? 'bg-paw-100 text-paw-800'
              : 'bg-honey-400/15 text-honey-600'
          }`}
        >
          {count} mention{count === 1 ? '' : 's'}
        </span>
      </div>
      {examples.length > 0 ? (
        <ul className="mt-3 space-y-2">
          {examples.map((ex) => (
            <li
              key={ex}
              className="rounded-xl bg-ink-50 px-3 py-2 text-sm leading-relaxed text-ink-600"
            >
              “{ex}”
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="card-surface flex flex-col items-center px-6 py-16 text-center">
      <div
        className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-paw-100 text-paw-700"
        aria-hidden
      >
        <svg viewBox="0 0 64 64" className="h-8 w-8" fill="currentColor">
          <ellipse cx="22" cy="22" rx="7" ry="9" transform="rotate(-18 22 22)" />
          <ellipse cx="42" cy="22" rx="7" ry="9" transform="rotate(18 42 22)" />
          <ellipse cx="16" cy="36" rx="6" ry="8" transform="rotate(-8 16 36)" />
          <ellipse cx="48" cy="36" rx="6" ry="8" transform="rotate(8 48 36)" />
          <ellipse cx="32" cy="42" rx="11" ry="10" />
        </svg>
      </div>
      <h2 className="font-display text-xl font-semibold text-ink-900">{title}</h2>
      <p className="mt-2 max-w-md text-sm text-ink-500">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}

export function LoadingState({ label = 'Loading…' }: { label?: string }) {
  return (
    <div
      className="card-surface flex items-center justify-center gap-3 px-6 py-16 text-ink-500"
      role="status"
      aria-live="polite"
    >
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-paw-200 border-t-paw-600" />
      <span className="text-sm">{label}</span>
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div
      className="card-surface border-red-200 bg-red-50/80 px-6 py-10 text-center"
      role="alert"
    >
      <p className="font-medium text-red-800">Something went wrong</p>
      <p className="mt-2 text-sm text-red-700">{message}</p>
    </div>
  );
}

export function DemoBanner({ label }: { label: string }) {
  return (
    <div
      className="rounded-xl border border-honey-400/40 bg-honey-400/10 px-4 py-2.5 text-sm text-honey-600"
      role="status"
    >
      <span className="font-semibold">DEMO DATA</span>
      <span className="mx-2 text-honey-400">·</span>
      <span>{label}</span>
    </div>
  );
}
