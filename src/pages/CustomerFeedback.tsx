import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { FeedbackCard } from '../components/Feedback/FeedbackCard';
import { FilterBar } from '../components/Dashboard/FilterBar';
import { PageFrame } from '../components/Layout/PageFrame';
import { ResponseDetail } from '../components/Responses/ResponseDetail';
import {
  DemoBanner,
  EmptyState,
  ErrorState,
  LoadingState,
} from '../components/UI/InsightCard';
import { useAppContext } from '../context/AppContext';
import { getResponseById, getResponses } from '../services/dataService';
import type { FeedbackResponse } from '../types/feedback';
import { CONTINUE_USE_OPTIONS } from '../types/feedback';

export function CustomerFeedbackPage() {
  const { filters, demoMode } = useAppContext();
  const [responses, setResponses] = useState<FeedbackResponse[]>([]);
  const [demoLabel, setDemoLabel] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<FeedbackResponse | null>(null);

  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [ratingFilter, setRatingFilter] = useState('');
  const [continueFilter, setContinueFilter] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    void getResponses(filters)
      .then((result) => {
        if (cancelled) return;
        setResponses(result.responses);
        setDemoLabel(result.demoLabel);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Failed to load feedback');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [filters, demoMode]);

  const cards = useMemo(() => {
    let list = responses.filter(
      (r) => r.customerFeedback || r.likes || r.improvements,
    );

    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((r) =>
        [r.dogName, r.customerFeedback, r.likes, r.improvements]
          .join(' ')
          .toLowerCase()
          .includes(q),
      );
    }

    if (ratingFilter) {
      const min = Number(ratingFilter);
      list = list.filter(
        (r) => r.overallQuality !== null && r.overallQuality >= min,
      );
    }

    if (continueFilter) {
      list = list.filter((r) => r.continueUsing === continueFilter);
    }

    list = [...list].sort((a, b) => {
      const at = Date.parse(a.timestamp) || 0;
      const bt = Date.parse(b.timestamp) || 0;
      return sortOrder === 'newest' ? bt - at : at - bt;
    });

    return list;
  }, [responses, search, sortOrder, ratingFilter, continueFilter]);

  async function handleOpen(id: string) {
    const detail = await getResponseById(id);
    if (detail) setSelected(detail);
  }

  const showEmpty = !demoMode && responses.length === 0 && !loading;

  return (
    <PageFrame
      title="Customer Feedback"
      subtitle="Written comments from PurePaw testers"
    >
      <div className="space-y-6">
        {demoLabel ? <DemoBanner label={demoLabel} /> : null}
        <FilterBar filteredCount={responses.length} />

        <div className="card-surface flex flex-col gap-3 p-4 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="relative min-w-[12rem] flex-1">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ink-400"
              aria-hidden
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search comments…"
              className="w-full rounded-xl border border-ink-200 bg-white py-2.5 pr-3 pl-10 text-sm"
              aria-label="Search customer comments"
            />
          </div>
          <select
            value={sortOrder}
            onChange={(e) =>
              setSortOrder(e.target.value as 'newest' | 'oldest')
            }
            className="rounded-xl border border-ink-200 bg-white px-3 py-2.5 text-sm"
            aria-label="Sort comments"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="rounded-xl border border-ink-200 bg-white px-3 py-2.5 text-sm"
            aria-label="Filter by rating"
          >
            <option value="">Any overall rating</option>
            <option value="5">5 stars</option>
            <option value="4">4+</option>
            <option value="3">3+</option>
          </select>
          <select
            value={continueFilter}
            onChange={(e) => setContinueFilter(e.target.value)}
            className="rounded-xl border border-ink-200 bg-white px-3 py-2.5 text-sm"
            aria-label="Filter by continue-use"
          >
            <option value="">Any continue-use</option>
            {CONTINUE_USE_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>

        {loading ? <LoadingState label="Loading feedback…" /> : null}
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

        {!loading && !error && (demoMode || responses.length > 0) ? (
          cards.length === 0 ? (
            <p className="card-surface px-4 py-10 text-center text-sm text-ink-400">
              No written comments match your filters.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {cards.map((r) => (
                <FeedbackCard
                  key={r.id}
                  response={r}
                  onOpen={(id) => void handleOpen(id)}
                />
              ))}
            </div>
          )
        ) : null}

        {selected ? (
          <ResponseDetail
            response={selected}
            onClose={() => setSelected(null)}
          />
        ) : null}
      </div>
    </PageFrame>
  );
}
