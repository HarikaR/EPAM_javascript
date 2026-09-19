import { useEffect, useState } from 'react';
import {
  Bone,
  Heart,
  PawPrint,
  Sparkles,
  Star,
  Utensils,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { FilterBar } from '../components/Dashboard/FilterBar';
import {
  ObservationChart,
  RatingChart,
} from '../components/Dashboard/RatingChart';
import { PageFrame } from '../components/Layout/PageFrame';
import { MetricCard } from '../components/UI/MetricCard';
import {
  DemoBanner,
  EmptyState,
  ErrorState,
  LoadingState,
} from '../components/UI/InsightCard';
import { useAppContext } from '../context/AppContext';
import { getDashboardMetrics } from '../services/dataService';
import type { DashboardMetrics } from '../types/feedback';
import { formatRating } from '../utils/calculations';
import { downloadResponsesCsv } from '../utils/csvExport';
import { getResponses } from '../services/dataService';

export function DashboardPage() {
  const { filters, demoMode } = useAppContext();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [filteredCount, setFilteredCount] = useState(0);
  const [demoLabel, setDemoLabel] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    void getDashboardMetrics(filters)
      .then((result) => {
        if (cancelled) return;
        setMetrics(result.metrics);
        setFilteredCount(result.filteredCount);
        setDemoLabel(result.demoLabel);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Failed to load metrics');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [filters, demoMode]);

  async function handleExport() {
    const { responses } = await getResponses(filters);
    downloadResponsesCsv(responses);
  }

  const showEmpty = !demoMode && filteredCount === 0 && !loading;

  return (
    <PageFrame
      title="PurePaw Product Feedback"
      subtitle="2-Week Dog Testing & Customer Acceptance"
      onExport={() => {
        void handleExport();
      }}
    >
      <div className="space-y-6">
        {demoLabel ? <DemoBanner label={demoLabel} /> : null}

        <FilterBar filteredCount={filteredCount} />

        {loading ? <LoadingState label="Loading dashboard…" /> : null}
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

        {!loading && !error && metrics && (demoMode || filteredCount > 0) ? (
          <>
            <section
              className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
              aria-label="Key metrics"
            >
              <MetricCard
                title="Dogs Tested"
                value={String(metrics.dogsTested)}
                label="Filtered survey responses"
                icon={PawPrint}
              />
              <MetricCard
                title="Overall Acceptance"
                value={formatRating(metrics.overallAcceptance)}
                unit="/ 5"
                label={`${metrics.acceptanceLabel} · internal feedback metric`}
                trend={metrics.trends.overallAcceptance}
                icon={Heart}
              />
              <MetricCard
                title="Average Product Quality"
                value={formatRating(metrics.averageProductQuality)}
                unit="/ 5"
                label="Mean overall quality rating"
                trend={metrics.trends.averageProductQuality}
                icon={Star}
              />
              <MetricCard
                title="Continue Using"
                value={
                  metrics.continueUsingRate === null
                    ? '—'
                    : String(metrics.continueUsingRate)
                }
                unit={metrics.continueUsingRate === null ? undefined : '%'}
                label="Definitely / probably yes"
                trend={metrics.trends.continueUsingRate}
                trendSuffix=" pp"
                icon={Sparkles}
              />
              <MetricCard
                title="Average Taste & Smell"
                value={formatRating(metrics.averageTasteSmell)}
                unit="/ 5"
                label="Customer-rated taste & smell"
                trend={metrics.trends.averageTasteSmell}
                icon={Bone}
              />
              <MetricCard
                title="Average Feeding Experience"
                value={formatRating(metrics.averageFeedingExperience)}
                unit="/ 5"
                label="Overall mealtime experience"
                trend={metrics.trends.averageFeedingExperience}
                icon={Utensils}
              />
            </section>

            <section className="card-surface flex flex-wrap items-center justify-between gap-3 p-5">
              <div>
                <h2 className="font-display text-lg font-semibold text-ink-900">
                  Acceptance Score
                </h2>
                <p className="mt-1 text-sm text-ink-400">
                  Average of Food Acceptance, Taste & Smell, Feeding Experience,
                  Convenience, and Overall Quality. Internal product-feedback
                  metric — not a health or efficacy score.
                </p>
              </div>
              <div className="text-right">
                <p className="font-display text-4xl font-semibold text-paw-800">
                  {formatRating(metrics.overallAcceptance)}
                  <span className="text-xl text-ink-400"> / 5</span>
                </p>
                <p className="mt-1 text-sm font-medium text-paw-600">
                  {metrics.acceptanceLabel}
                </p>
              </div>
            </section>

            <section className="grid gap-4 xl:grid-cols-2">
              <RatingChart averages={metrics.productExperience} />
              <ObservationChart
                title="Appetite Observations"
                subtitle="Customer-reported appetite changes during testing"
                observationNote="Customer-reported observations — not proven product effects."
                data={metrics.appetiteDistribution}
                variant="donut"
              />
              <ObservationChart
                title="Coat Observations"
                subtitle="Customers reporting coat appearance during testing"
                observationNote="Customer-reported observations — not proven product effects."
                data={metrics.coatDistribution}
                variant="horizontal"
              />
              <ObservationChart
                title="Digestion / Stool"
                subtitle="Customers reporting digestion or stool observations"
                observationNote="Customer-reported observations — not proven product effects."
                data={metrics.digestionDistribution}
                variant="vertical"
              />
              <div className="xl:col-span-2">
                <ObservationChart
                  title="Continue Using PurePaw"
                  subtitle="Intention to continue after the test period"
                  data={metrics.continueUsingDistribution}
                  variant="vertical"
                />
              </div>
            </section>
          </>
        ) : null}
      </div>
    </PageFrame>
  );
}
