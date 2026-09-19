import { useEffect, useState } from 'react';
import { PageFrame } from '../components/Layout/PageFrame';
import { ResponseDetail } from '../components/Responses/ResponseDetail';
import { ResponseTable } from '../components/Responses/ResponseTable';
import { FilterBar } from '../components/Dashboard/FilterBar';
import {
  DemoBanner,
  EmptyState,
  ErrorState,
  LoadingState,
} from '../components/UI/InsightCard';
import { useAppContext } from '../context/AppContext';
import { getResponseById, getResponses } from '../services/dataService';
import type { FeedbackResponse } from '../types/feedback';
import { downloadResponsesCsv } from '../utils/csvExport';
import { Link } from 'react-router-dom';

export function ResponsesPage() {
  const { filters, demoMode } = useAppContext();
  const [responses, setResponses] = useState<FeedbackResponse[]>([]);
  const [demoLabel, setDemoLabel] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<FeedbackResponse | null>(null);

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
        setError(err instanceof Error ? err.message : 'Failed to load responses');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [filters, demoMode]);

  async function handleView(id: string) {
    const detail = await getResponseById(id);
    if (detail) setSelected(detail);
  }

  const showEmpty = !demoMode && responses.length === 0 && !loading;

  return (
    <PageFrame
      title="Responses"
      subtitle="Browse, search, and export PurePaw survey responses"
      onExport={() => downloadResponsesCsv(responses)}
    >
      <div className="space-y-6">
        {demoLabel ? <DemoBanner label={demoLabel} /> : null}
        <FilterBar filteredCount={responses.length} />

        {loading ? <LoadingState label="Loading responses…" /> : null}
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
          <ResponseTable responses={responses} onView={(id) => void handleView(id)} />
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
