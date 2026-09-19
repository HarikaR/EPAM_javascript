import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { DashboardFilters } from '../types/feedback';
import { EMPTY_FILTERS } from '../types/feedback';
import { isDemoMode, setDemoMode as persistDemoMode } from '../services/dataService';

interface AppContextValue {
  filters: DashboardFilters;
  setFilters: (next: DashboardFilters) => void;
  updateFilter: <K extends keyof DashboardFilters>(
    key: K,
    value: DashboardFilters[K],
  ) => void;
  clearFilters: () => void;
  activeFilterCount: number;
  demoMode: boolean;
  setDemoMode: (enabled: boolean) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

function countActiveFilters(filters: DashboardFilters): number {
  return Object.values(filters).filter((v) => v !== '').length;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<DashboardFilters>(EMPTY_FILTERS);
  const [demoMode, setDemoModeState] = useState(() => isDemoMode());

  const updateFilter = useCallback(
    <K extends keyof DashboardFilters>(key: K, value: DashboardFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const clearFilters = useCallback(() => {
    setFilters(EMPTY_FILTERS);
  }, []);

  const setDemoMode = useCallback((enabled: boolean) => {
    persistDemoMode(enabled);
    setDemoModeState(enabled);
  }, []);

  const value = useMemo(
    () => ({
      filters,
      setFilters,
      updateFilter,
      clearFilters,
      activeFilterCount: countActiveFilters(filters),
      demoMode,
      setDemoMode,
    }),
    [filters, updateFilter, clearFilters, demoMode, setDemoMode],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return ctx;
}
