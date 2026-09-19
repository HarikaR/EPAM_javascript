import type { LucideIcon } from 'lucide-react';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  unit?: string;
  label: string;
  trend?: number | null;
  trendSuffix?: string;
  icon?: LucideIcon;
}

export function MetricCard({
  title,
  value,
  unit,
  label,
  trend,
  trendSuffix = '',
  icon: Icon,
}: MetricCardProps) {
  const trendPositive = trend !== null && trend !== undefined && trend > 0;
  const trendNegative = trend !== null && trend !== undefined && trend < 0;
  const hasTrend = trend !== null && trend !== undefined;

  return (
    <article className="card-surface p-5 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-ink-500">{title}</p>
        {Icon ? (
          <span className="rounded-xl bg-paw-100 p-2 text-paw-700" aria-hidden>
            <Icon className="h-4 w-4" />
          </span>
        ) : null}
      </div>
      <div className="mt-3 flex items-baseline gap-1.5">
        <p className="font-display text-3xl font-semibold tracking-tight text-ink-900">
          {value}
        </p>
        {unit ? (
          <span className="text-sm font-medium text-ink-400">{unit}</span>
        ) : null}
      </div>
      <div className="mt-2 flex items-center justify-between gap-2">
        <p className="text-xs text-ink-400">{label}</p>
        {hasTrend ? (
          <span
            className={`inline-flex items-center gap-1 text-xs font-medium ${
              trendPositive
                ? 'text-paw-700'
                : trendNegative
                  ? 'text-honey-600'
                  : 'text-ink-400'
            }`}
          >
            {trendPositive ? (
              <TrendingUp className="h-3.5 w-3.5" aria-hidden />
            ) : trendNegative ? (
              <TrendingDown className="h-3.5 w-3.5" aria-hidden />
            ) : (
              <Minus className="h-3.5 w-3.5" aria-hidden />
            )}
            {trendPositive ? '+' : ''}
            {trend}
            {trendSuffix}
          </span>
        ) : null}
      </div>
    </article>
  );
}
