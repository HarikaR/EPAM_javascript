import { useEffect, useState } from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { getFilterOptions } from '../../services/dataService';
import { CONTINUE_USE_OPTIONS } from '../../types/feedback';

interface FilterBarProps {
  filteredCount: number;
  totalHint?: string;
}

export function FilterBar({ filteredCount, totalHint }: FilterBarProps) {
  const { filters, updateFilter, clearFilters, activeFilterCount, demoMode } =
    useAppContext();
  const [breeds, setBreeds] = useState<string[]>([]);
  const [diets, setDiets] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    void getFilterOptions().then((opts) => {
      if (cancelled) return;
      setBreeds(opts.breeds);
      setDiets(opts.diets);
    });
    return () => {
      cancelled = true;
    };
  }, [demoMode]);

  return (
    <section className="card-surface p-4 sm:p-5" aria-label="Dashboard filters">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-ink-700">
          <Filter className="h-4 w-4 text-paw-600" aria-hidden />
          <h2 className="text-sm font-semibold">Filters</h2>
          {activeFilterCount > 0 ? (
            <span className="rounded-full bg-paw-100 px-2 py-0.5 text-xs font-medium text-paw-800">
              {activeFilterCount} active
            </span>
          ) : null}
        </div>
        <div className="flex items-center gap-3">
          <p className="text-sm text-ink-500">
            <span className="font-semibold text-ink-800">{filteredCount}</span>{' '}
            response{filteredCount === 1 ? '' : 's'}
            {totalHint ? ` ${totalHint}` : ''}
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex items-center gap-1.5 rounded-xl border border-ink-200 bg-white px-3 py-1.5 text-sm font-medium text-ink-600 transition hover:bg-ink-50"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden />
            Clear filters
          </button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <label className="block text-xs font-medium text-ink-500">
          Date from
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => updateFilter('dateFrom', e.target.value)}
            className="mt-1 w-full rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm text-ink-800"
          />
        </label>
        <label className="block text-xs font-medium text-ink-500">
          Date to
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => updateFilter('dateTo', e.target.value)}
            className="mt-1 w-full rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm text-ink-800"
          />
        </label>
        <label className="block text-xs font-medium text-ink-500">
          Breed
          <select
            value={filters.breed}
            onChange={(e) => updateFilter('breed', e.target.value)}
            className="mt-1 w-full rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm text-ink-800"
          >
            <option value="">All breeds</option>
            {breeds.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-xs font-medium text-ink-500">
          Previous diet
          <select
            value={filters.previousDiet}
            onChange={(e) => updateFilter('previousDiet', e.target.value)}
            className="mt-1 w-full rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm text-ink-800"
          >
            <option value="">All diets</option>
            {diets.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-xs font-medium text-ink-500">
          Continue-use intention
          <select
            value={filters.continueUsing}
            onChange={(e) => updateFilter('continueUsing', e.target.value)}
            className="mt-1 w-full rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm text-ink-800"
          >
            <option value="">All intentions</option>
            {CONTINUE_USE_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-xs font-medium text-ink-500">
          Min. overall quality
          <select
            value={filters.minRating}
            onChange={(e) => updateFilter('minRating', e.target.value)}
            className="mt-1 w-full rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm text-ink-800"
          >
            <option value="">Any rating</option>
            <option value="5">5 only</option>
            <option value="4">4+</option>
            <option value="3">3+</option>
            <option value="2">2+</option>
            <option value="1">1+</option>
          </select>
        </label>
      </div>
    </section>
  );
}
