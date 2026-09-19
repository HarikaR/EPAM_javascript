import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FilterBar } from '../components/Dashboard/FilterBar';
import { PageFrame } from '../components/Layout/PageFrame';
import {
  DemoBanner,
  EmptyState,
  ErrorState,
  InsightCard,
  LoadingState,
} from '../components/UI/InsightCard';
import { useAppContext } from '../context/AppContext';
import { getProductInsights } from '../services/dataService';
import type { ProductInsights } from '../types/feedback';
import { formatRating } from '../utils/calculations';

function SignalBar({
  label,
  value,
  max = 5,
  suffix = ' / 5',
}: {
  label: string;
  value: number | null;
  max?: number;
  suffix?: string;
}) {
  const pct = value === null ? 0 : Math.min(100, (value / max) * 100);
  const tone =
    value === null
      ? 'bg-ink-200'
      : value >= (max === 100 ? 70 : 4)
        ? 'bg-paw-600'
        : value >= (max === 100 ? 40 : 3)
          ? 'bg-honey-400'
          : 'bg-ink-400';

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <span className="text-sm text-ink-600">{label}</span>
        <span className="text-sm font-semibold text-ink-900">
          {value === null ? '—' : max === 100 ? `${value}%` : formatRating(value)}
          {value === null || max === 100 ? '' : suffix}
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-ink-100">
        <div
          className={`h-full rounded-full transition-all ${tone}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function ProductInsightsPage() {
  const { filters, demoMode } = useAppContext();
  const [insights, setInsights] = useState<ProductInsights | null>(null);
  const [filteredCount, setFilteredCount] = useState(0);
  const [demoLabel, setDemoLabel] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    void getProductInsights(filters)
      .then((result) => {
        if (cancelled) return;
        setInsights(result.insights);
        setFilteredCount(result.filteredCount);
        setDemoLabel(result.demoLabel);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Failed to load insights');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [filters, demoMode]);

  const showEmpty = !demoMode && filteredCount === 0 && !loading;

  return (
    <PageFrame
      title="Product Insights"
      subtitle="Development signals from customer feedback — themes supported by response data only"
    >
      <div className="space-y-6">
        {demoLabel ? <DemoBanner label={demoLabel} /> : null}
        <FilterBar filteredCount={filteredCount} />

        {loading ? <LoadingState label="Analyzing feedback…" /> : null}
        {error ? <ErrorState message={error} /> : null}

        {showEmpty ? (
          <EmptyState
            title="No customer responses yet"
            description="Connect your Google Form or import response data to start analyzing PurePaw."
            action={
              <Link
                to="/settings"
                className="inline-flex rounded-xl bg-paw-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-paw-800"
              >
                Open Settings
              </Link>
            }
          />
        ) : null}

        {!loading && !error && insights && (demoMode || filteredCount > 0) ? (
          <>
            <section>
              <h2 className="font-display text-xl font-semibold text-ink-900">
                What customers like
              </h2>
              <p className="mt-1 text-sm text-ink-400">
                Positive themes detected in likes and comments from the current
                filtered set.
              </p>
              {insights.likes.length === 0 ? (
                <p className="card-surface mt-4 px-4 py-8 text-center text-sm text-ink-400">
                  No recurring positive themes detected in the current data.
                </p>
              ) : (
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {insights.likes.map((theme) => (
                    <InsightCard
                      key={theme.theme}
                      title={theme.theme}
                      count={theme.count}
                      examples={theme.examples}
                      tone="positive"
                    />
                  ))}
                </div>
              )}
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-ink-900">
                What customers want improved
              </h2>
              <p className="mt-1 text-sm text-ink-400">
                Improvement themes detected in suggestion fields — only when
                supported by responses.
              </p>
              {insights.improvements.length === 0 ? (
                <p className="card-surface mt-4 px-4 py-8 text-center text-sm text-ink-400">
                  No recurring improvement themes detected in the current data.
                </p>
              ) : (
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {insights.improvements.map((theme) => (
                    <InsightCard
                      key={theme.theme}
                      title={theme.theme}
                      count={theme.count}
                      examples={theme.examples}
                      tone="improve"
                    />
                  ))}
                </div>
              )}
            </section>

            <section className="card-surface p-5">
              <h2 className="font-display text-xl font-semibold text-ink-900">
                Product Development Signals
              </h2>
              <p className="mt-1 text-sm text-ink-400">
                Aggregated ratings and continue-use intention from filtered
                responses.
              </p>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <SignalBar
                  label="Taste acceptance"
                  value={insights.signals.tasteAcceptance}
                />
                <SignalBar
                  label="Mixing experience"
                  value={insights.signals.mixingExperience}
                />
                <SignalBar
                  label="Feeding experience"
                  value={insights.signals.feedingExperience}
                />
                <SignalBar
                  label="Convenience"
                  value={insights.signals.convenience}
                />
                <SignalBar
                  label="Overall quality"
                  value={insights.signals.overallQuality}
                />
                <SignalBar
                  label="Continue-use intention"
                  value={insights.signals.continueUseIntention}
                  max={100}
                  suffix="%"
                />
              </div>
            </section>
          </>
        ) : null}
      </div>
    </PageFrame>
  );
}
