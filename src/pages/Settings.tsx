import { Link } from 'react-router-dom';
import { PageFrame } from '../components/Layout/PageFrame';
import { useAppContext } from '../context/AppContext';
import { DEMO_DATA_LABEL } from '../data/demoResponses';

export function SettingsPage() {
  const { demoMode, setDemoMode, clearFilters } = useAppContext();

  return (
    <PageFrame
      title="Settings"
      subtitle="Data source and dashboard preferences"
    >
      <div className="mx-auto max-w-2xl space-y-6">
        <section className="card-surface p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-xl font-semibold text-ink-900">
                Demo Mode
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">
                When Demo Mode is <strong>ON</strong>, the dashboard loads{' '}
                <code className="rounded bg-ink-100 px-1.5 py-0.5 text-xs">
                  src/data/demoResponses.ts
                </code>
                . When <strong>OFF</strong>, the app uses the real response
                source (empty until Google Sheets / import is connected).
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={demoMode}
              aria-label="Toggle demo mode"
              onClick={() => {
                setDemoMode(!demoMode);
                clearFilters();
              }}
              className={`relative h-8 w-14 shrink-0 rounded-full transition ${
                demoMode ? 'bg-paw-600' : 'bg-ink-300'
              }`}
            >
              <span
                className={`absolute top-1 left-1 h-6 w-6 rounded-full bg-white shadow transition ${
                  demoMode ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div
            className={`mt-5 rounded-xl px-4 py-3 text-sm ${
              demoMode
                ? 'border border-honey-400/40 bg-honey-400/10 text-honey-600'
                : 'border border-paw-200 bg-paw-50 text-paw-800'
            }`}
            role="status"
          >
            {demoMode ? (
              <>
                <span className="font-semibold">DEMO DATA</span> — {DEMO_DATA_LABEL}
              </>
            ) : (
              <>
                Demo Mode is off. Real responses will appear here once a Google
                Form / Sheets source is connected via{' '}
                <code className="text-xs">src/services/dataService.ts</code>.
              </>
            )}
          </div>
        </section>

        <section className="card-surface p-6">
          <h2 className="font-display text-xl font-semibold text-ink-900">
            Google Sheets integration
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-500">
            The data layer is ready for a future Google Sheets API connection.
            See comments in{' '}
            <code className="rounded bg-ink-100 px-1.5 py-0.5 text-xs">
              src/services/dataService.ts
            </code>{' '}
            for the exact integration steps. No API credentials are required for
            this version.
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-ink-600">
            <li>
              Keep the <code className="text-xs">FeedbackResponse</code> shape
            </li>
            <li>
              Replace <code className="text-xs">fetchRealResponses()</code> with
              a Sheets fetch
            </li>
            <li>Map form columns to typed fields, then call normalizeResponses()</li>
          </ul>
        </section>

        <section className="card-surface p-6">
          <h2 className="font-display text-xl font-semibold text-ink-900">
            Product-safety language
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-500">
            This dashboard distinguishes <strong>customer observations</strong>{' '}
            from <strong>proven product effects</strong>. Charts and copy use
            observation wording only (e.g. “Customers reporting
            shinier/healthier-looking coats”). Do not treat survey answers as
            medical or nutritional claims.
          </p>
          <Link
            to="/"
            className="mt-4 inline-flex text-sm font-medium text-paw-700 hover:text-paw-800"
          >
            Back to Dashboard →
          </Link>
        </section>
      </div>
    </PageFrame>
  );
}
