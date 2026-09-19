import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Download, Eye, Search } from 'lucide-react';
import type { FeedbackResponse } from '../../types/feedback';
import { formatRating } from '../../utils/calculations';
import { downloadResponsesCsv } from '../../utils/csvExport';

type SortKey =
  | 'timestamp'
  | 'dogName'
  | 'breed'
  | 'foodAcceptance'
  | 'overallQuality'
  | 'continueUsing';

interface ResponseTableProps {
  responses: FeedbackResponse[];
  onView: (id: string) => void;
}

const PAGE_SIZE = 8;

export function ResponseTable({ responses, onView }: ResponseTableProps) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('timestamp');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(0);
  const [continueFilter, setContinueFilter] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = responses;

    if (continueFilter) {
      list = list.filter((r) => r.continueUsing === continueFilter);
    }

    if (q) {
      list = list.filter((r) =>
        [
          r.dogName,
          r.breed,
          r.previousDiet,
          r.customerFeedback,
          r.likes,
          r.improvements,
          r.appetiteChange,
          r.coatObservation,
          r.digestionStool,
        ]
          .join(' ')
          .toLowerCase()
          .includes(q),
      );
    }

    const sorted = [...list].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av === null || av === undefined) return 1;
      if (bv === null || bv === undefined) return -1;
      if (typeof av === 'number' && typeof bv === 'number') {
        return sortDir === 'asc' ? av - bv : bv - av;
      }
      const as = String(av);
      const bs = String(bv);
      return sortDir === 'asc' ? as.localeCompare(bs) : bs.localeCompare(as);
    });

    return sorted;
  }, [responses, search, sortKey, sortDir, continueFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const pageRows = filtered.slice(
    safePage * PAGE_SIZE,
    safePage * PAGE_SIZE + PAGE_SIZE,
  );

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir(key === 'timestamp' ? 'desc' : 'asc');
    }
    setPage(0);
  }

  function SortButton({
    label,
    column,
  }: {
    label: string;
    column: SortKey;
  }) {
    const active = sortKey === column;
    return (
      <button
        type="button"
        onClick={() => toggleSort(column)}
        className={`whitespace-nowrap text-left text-xs font-semibold uppercase tracking-wide ${
          active ? 'text-paw-700' : 'text-ink-400'
        }`}
      >
        {label}
        {active ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ''}
      </button>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ink-400"
            aria-hidden
          />
          <input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            placeholder="Search dogs, breeds, comments…"
            className="w-full rounded-xl border border-ink-200 bg-white py-2.5 pr-3 pl-10 text-sm"
            aria-label="Search responses"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={continueFilter}
            onChange={(e) => {
              setContinueFilter(e.target.value);
              setPage(0);
            }}
            className="rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm"
            aria-label="Filter by continue-use"
          >
            <option value="">All continue-use</option>
            <option value="Definitely yes">Definitely yes</option>
            <option value="Probably yes">Probably yes</option>
            <option value="Not sure">Not sure</option>
            <option value="Probably not">Probably not</option>
            <option value="Definitely not">Definitely not</option>
          </select>
          <button
            type="button"
            onClick={() => downloadResponsesCsv(filtered)}
            className="inline-flex items-center gap-2 rounded-xl bg-paw-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-paw-800"
          >
            <Download className="h-4 w-4" aria-hidden />
            Export CSV
          </button>
        </div>
      </div>

      {/* Desktop table */}
      <div className="card-surface hidden overflow-hidden lg:block">
        <div className="scrollbar-thin overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-ink-100 bg-paw-50/80">
              <tr>
                <th className="px-4 py-3">
                  <SortButton label="Timestamp" column="timestamp" />
                </th>
                <th className="px-4 py-3">
                  <SortButton label="Dog" column="dogName" />
                </th>
                <th className="px-4 py-3">
                  <SortButton label="Breed" column="breed" />
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-ink-400">
                  Age
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-ink-400">
                  Weight
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-ink-400">
                  Diet
                </th>
                <th className="px-4 py-3">
                  <SortButton label="Accept." column="foodAcceptance" />
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-ink-400">
                  Taste
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-ink-400">
                  Mix
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-ink-400">
                  Feed
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-ink-400">
                  Conv.
                </th>
                <th className="px-4 py-3">
                  <SortButton label="Quality" column="overallQuality" />
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-ink-400">
                  Appetite
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-ink-400">
                  Coat
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-ink-400">
                  Digestion
                </th>
                <th className="px-4 py-3">
                  <SortButton label="Continue" column="continueUsing" />
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-ink-400">
                  Feedback
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {pageRows.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-ink-50 transition hover:bg-paw-50/50"
                >
                  <td className="px-4 py-3 whitespace-nowrap text-ink-500">
                    {r.timestamp
                      ? new Date(r.timestamp).toLocaleDateString()
                      : '—'}
                  </td>
                  <td className="px-4 py-3 font-medium text-ink-900">
                    {r.dogName}
                  </td>
                  <td className="px-4 py-3 text-ink-600">{r.breed}</td>
                  <td className="px-4 py-3 text-ink-600">{r.age}</td>
                  <td className="px-4 py-3 text-ink-600">{r.weight}</td>
                  <td className="max-w-[8rem] truncate px-4 py-3 text-ink-600">
                    {r.previousDiet}
                  </td>
                  <td className="px-4 py-3">{formatRating(r.foodAcceptance)}</td>
                  <td className="px-4 py-3">{formatRating(r.tasteSmell)}</td>
                  <td className="px-4 py-3">{formatRating(r.easeOfMixing)}</td>
                  <td className="px-4 py-3">
                    {formatRating(r.feedingExperience)}
                  </td>
                  <td className="px-4 py-3">{formatRating(r.convenience)}</td>
                  <td className="px-4 py-3 font-medium">
                    {formatRating(r.overallQuality)}
                  </td>
                  <td className="max-w-[7rem] truncate px-4 py-3 text-ink-600">
                    {r.appetiteChange}
                  </td>
                  <td className="max-w-[7rem] truncate px-4 py-3 text-ink-600">
                    {r.coatObservation}
                  </td>
                  <td className="max-w-[7rem] truncate px-4 py-3 text-ink-600">
                    {r.digestionStool}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-ink-700">
                    {r.continueUsing}
                  </td>
                  <td className="max-w-[10rem] truncate px-4 py-3 text-ink-500">
                    {r.customerFeedback || r.likes || '—'}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => onView(r.id)}
                      className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-paw-700 hover:bg-paw-50"
                      aria-label={`View response for ${r.dogName}`}
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {pageRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={18}
                    className="px-4 py-10 text-center text-ink-400"
                  >
                    No responses match your search.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 lg:hidden">
        {pageRows.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => onView(r.id)}
            className="card-surface w-full p-4 text-left transition hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-ink-900">{r.dogName}</p>
                <p className="text-xs text-ink-400">
                  {r.breed} · {r.timestamp ? new Date(r.timestamp).toLocaleDateString() : '—'}
                </p>
              </div>
              <span className="rounded-full bg-paw-50 px-2 py-1 text-xs font-medium text-paw-800">
                Q {formatRating(r.overallQuality)}
              </span>
            </div>
            <p className="mt-2 line-clamp-2 text-sm text-ink-600">
              {r.customerFeedback || r.likes || 'No comment'}
            </p>
            <p className="mt-2 text-xs text-ink-400">{r.continueUsing}</p>
          </button>
        ))}
        {pageRows.length === 0 ? (
          <p className="card-surface px-4 py-10 text-center text-ink-400">
            No responses match your search.
          </p>
        ) : null}
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-ink-500">
          Showing {filtered.length === 0 ? 0 : safePage * PAGE_SIZE + 1}–
          {Math.min((safePage + 1) * PAGE_SIZE, filtered.length)} of{' '}
          {filtered.length}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={safePage <= 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="inline-flex items-center gap-1 rounded-xl border border-ink-200 bg-white px-3 py-1.5 text-sm disabled:opacity-40"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
            Prev
          </button>
          <span className="text-sm text-ink-500">
            {safePage + 1} / {pageCount}
          </span>
          <button
            type="button"
            disabled={safePage >= pageCount - 1}
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            className="inline-flex items-center gap-1 rounded-xl border border-ink-200 bg-white px-3 py-1.5 text-sm disabled:opacity-40"
            aria-label="Next page"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
