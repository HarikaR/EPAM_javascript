import { DEMO_DATA_LABEL, demoResponses } from '../data/demoResponses';
import type {
  DashboardFilters,
  DashboardMetrics,
  FeedbackResponse,
  ProductInsights,
} from '../types/feedback';
import { EMPTY_FILTERS } from '../types/feedback';
import {
  applyFilters,
  calculateDashboardMetrics,
  calculateProductInsights,
  normalizeResponses,
} from '../utils/calculations';

const DEMO_MODE_KEY = 'purepaw-demo-mode';
const REAL_RESPONSES_KEY = 'purepaw-real-responses';

/**
 * Data service for PurePaw feedback.
 *
 * Google Sheets / Forms integration (future):
 * ------------------------------------------------
 * 1. Create a Google Cloud project and enable the Google Sheets API.
 * 2. Store the spreadsheet ID and API key / OAuth token in env vars
 *    (e.g. VITE_GOOGLE_SHEETS_ID, VITE_GOOGLE_SHEETS_API_KEY).
 * 3. Replace `fetchRealResponses()` below with a Sheets fetch:
 *
 *    async function fetchRealResponses(): Promise<FeedbackResponse[]> {
 *      const sheetId = import.meta.env.VITE_GOOGLE_SHEETS_ID;
 *      const apiKey = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY;
 *      const range = 'Form Responses 1!A2:U';
 *      const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;
 *      const res = await fetch(url);
 *      if (!res.ok) throw new Error('Failed to load Google Sheets data');
 *      const json = await res.json();
 *      return mapSheetRowsToResponses(json.values ?? []);
 *    }
 *
 * 4. Implement `mapSheetRowsToResponses` to map column indexes to
 *    FeedbackResponse fields (same shape as demoResponses).
 * 5. Keep `normalizeResponses()` so incomplete survey rows stay safe.
 *
 * No Google credentials are required for the current demo version.
 */

export function isDemoMode(): boolean {
  const stored = localStorage.getItem(DEMO_MODE_KEY);
  // Default ON for development until a real source is connected
  if (stored === null) return true;
  return stored === 'true';
}

export function setDemoMode(enabled: boolean): void {
  localStorage.setItem(DEMO_MODE_KEY, String(enabled));
}

function loadStoredRealResponses(): FeedbackResponse[] {
  try {
    const raw = localStorage.getItem(REAL_RESPONSES_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return normalizeResponses(parsed as FeedbackResponse[]);
  } catch {
    return [];
  }
}

/**
 * Optional helper for future imports — stores real responses locally
 * until Google Sheets is wired up.
 */
export function saveRealResponses(responses: FeedbackResponse[]): void {
  localStorage.setItem(REAL_RESPONSES_KEY, JSON.stringify(responses));
}

async function fetchRealResponses(): Promise<FeedbackResponse[]> {
  // PLACEHOLDER: swap this body for Google Sheets API fetch (see file header).
  await delay(120);
  return loadStoredRealResponses();
}

async function fetchDemoResponses(): Promise<FeedbackResponse[]> {
  await delay(180);
  return normalizeResponses(demoResponses);
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function getResponses(
  filters: DashboardFilters = EMPTY_FILTERS,
): Promise<{
  responses: FeedbackResponse[];
  demoMode: boolean;
  demoLabel: string | null;
}> {
  const demoMode = isDemoMode();
  const source = demoMode
    ? await fetchDemoResponses()
    : await fetchRealResponses();
  const responses = applyFilters(source, filters);
  return {
    responses,
    demoMode,
    demoLabel: demoMode ? DEMO_DATA_LABEL : null,
  };
}

export async function getResponseById(
  id: string,
): Promise<FeedbackResponse | null> {
  await delay(80);
  const demoMode = isDemoMode();
  const all = demoMode
    ? normalizeResponses(demoResponses)
    : loadStoredRealResponses();
  return all.find((r) => r.id === id) ?? null;
}

export async function getDashboardMetrics(
  filters: DashboardFilters = EMPTY_FILTERS,
): Promise<{
  metrics: DashboardMetrics;
  filteredCount: number;
  demoMode: boolean;
  demoLabel: string | null;
}> {
  const { responses, demoMode, demoLabel } = await getResponses(filters);
  return {
    metrics: calculateDashboardMetrics(responses),
    filteredCount: responses.length,
    demoMode,
    demoLabel,
  };
}

export async function getProductInsights(
  filters: DashboardFilters = EMPTY_FILTERS,
): Promise<{
  insights: ProductInsights;
  filteredCount: number;
  demoMode: boolean;
  demoLabel: string | null;
}> {
  const { responses, demoMode, demoLabel } = await getResponses(filters);
  return {
    insights: calculateProductInsights(responses),
    filteredCount: responses.length,
    demoMode,
    demoLabel,
  };
}

export async function getFilterOptions(): Promise<{
  breeds: string[];
  diets: string[];
  continueOptions: string[];
}> {
  const demoMode = isDemoMode();
  const all = demoMode
    ? normalizeResponses(demoResponses)
    : loadStoredRealResponses();

  const breeds = Array.from(new Set(all.map((r) => r.breed))).sort();
  const diets = Array.from(new Set(all.map((r) => r.previousDiet))).sort();
  const continueOptions = Array.from(
    new Set(all.map((r) => r.continueUsing)),
  ).sort();

  return { breeds, diets, continueOptions };
}
