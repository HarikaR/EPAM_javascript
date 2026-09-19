import type {
  AcceptanceLabel,
  DashboardFilters,
  DashboardMetrics,
  DistributionItem,
  FeedbackResponse,
  InsightTheme,
  ProductInsights,
  RatingValue,
} from '../types/feedback';
import {
  APPETITE_OPTIONS,
  COAT_OPTIONS,
  CONTINUE_USE_OPTIONS,
  DIGESTION_OPTIONS,
} from '../types/feedback';

/** Normalize a raw rating to 1–5 or null. */
export function sanitizeRating(value: unknown): RatingValue {
  if (value === null || value === undefined || value === '') return null;
  const num = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(num)) return null;
  if (num < 1 || num > 5) return null;
  return Math.round(num);
}

export function calculateAverageRating(values: RatingValue[]): number | null {
  const valid = values.filter((v): v is number => typeof v === 'number');
  if (valid.length === 0) return null;
  const sum = valid.reduce((acc, n) => acc + n, 0);
  return Math.round((sum / valid.length) * 10) / 10;
}

/**
 * Acceptance Score = average of:
 * Food Acceptance, Taste & Smell, Feeding Experience, Convenience, Overall Quality.
 * Internal product-feedback metric — not a health or efficacy score.
 */
export function calculateAcceptanceScore(
  responses: FeedbackResponse[],
): number | null {
  if (responses.length === 0) return null;

  const perResponse = responses
    .map((r) =>
      calculateAverageRating([
        r.foodAcceptance,
        r.tasteSmell,
        r.feedingExperience,
        r.convenience,
        r.overallQuality,
      ]),
    )
    .filter((v): v is number => v !== null);

  return calculateAverageRating(perResponse);
}

/** Individual dog experience score from the six rating questions. */
export function calculateExperienceScore(
  response: FeedbackResponse,
): number | null {
  return calculateAverageRating([
    response.foodAcceptance,
    response.tasteSmell,
    response.easeOfMixing,
    response.feedingExperience,
    response.convenience,
    response.overallQuality,
  ]);
}

export function getAcceptanceLabel(score: number | null): AcceptanceLabel {
  if (score === null) return 'Insufficient Data';
  if (score >= 4.5) return 'Excellent';
  if (score >= 3.8) return 'Strong';
  if (score >= 3.0) return 'Moderate';
  return 'Needs Attention';
}

export function calculatePercentage(part: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((part / total) * 1000) / 10;
}

export function calculateContinueUseRate(
  responses: FeedbackResponse[],
): number | null {
  if (responses.length === 0) return null;
  const positive = responses.filter(
    (r) =>
      r.continueUsing === 'Definitely yes' ||
      r.continueUsing === 'Probably yes',
  ).length;
  return Math.round((positive / responses.length) * 1000) / 10;
}

export function calculateDistribution(
  values: string[],
  orderedLabels?: readonly string[],
): DistributionItem[] {
  const total = values.length;
  const counts = new Map<string, number>();

  for (const value of values) {
    const key = value.trim() || 'Not provided';
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  if (orderedLabels) {
    const items: DistributionItem[] = orderedLabels.map((label) => {
      const count = counts.get(label) ?? 0;
      counts.delete(label);
      return {
        label,
        count,
        percentage: calculatePercentage(count, total),
      };
    });

    // Include unexpected / "Other" free-text buckets
    for (const [label, count] of counts) {
      items.push({
        label,
        count,
        percentage: calculatePercentage(count, total),
      });
    }
    return items;
  }

  return Array.from(counts.entries())
    .map(([label, count]) => ({
      label,
      count,
      percentage: calculatePercentage(count, total),
    }))
    .sort((a, b) => b.count - a.count);
}

function parseTimestamp(value: string): number | null {
  if (!value) return null;
  const t = Date.parse(value);
  return Number.isFinite(t) ? t : null;
}

export function applyFilters(
  responses: FeedbackResponse[],
  filters: DashboardFilters,
): FeedbackResponse[] {
  return responses.filter((r) => {
    const ts = parseTimestamp(r.timestamp);

    if (filters.dateFrom) {
      const from = Date.parse(filters.dateFrom);
      if (Number.isFinite(from) && (ts === null || ts < from)) return false;
    }

    if (filters.dateTo) {
      const to = Date.parse(filters.dateTo);
      // Inclusive end-of-day
      if (Number.isFinite(to)) {
        const end = to + 24 * 60 * 60 * 1000 - 1;
        if (ts === null || ts > end) return false;
      }
    }

    if (filters.breed && r.breed !== filters.breed) return false;
    if (filters.previousDiet && r.previousDiet !== filters.previousDiet) {
      return false;
    }
    if (filters.continueUsing && r.continueUsing !== filters.continueUsing) {
      return false;
    }

    if (filters.minRating) {
      const min = Number(filters.minRating);
      if (Number.isFinite(min)) {
        const quality = r.overallQuality;
        if (quality === null || quality < min) return false;
      }
    }

    return true;
  });
}

function halfTrend(
  all: FeedbackResponse[],
  metric: (subset: FeedbackResponse[]) => number | null,
): number | null {
  if (all.length < 4) return null;
  const sorted = [...all].sort(
    (a, b) =>
      (parseTimestamp(a.timestamp) ?? 0) - (parseTimestamp(b.timestamp) ?? 0),
  );
  const mid = Math.floor(sorted.length / 2);
  const earlier = sorted.slice(0, mid);
  const later = sorted.slice(mid);
  const a = metric(earlier);
  const b = metric(later);
  if (a === null || b === null) return null;
  return Math.round((b - a) * 10) / 10;
}

export function calculateDashboardMetrics(
  responses: FeedbackResponse[],
): DashboardMetrics {
  const overallAcceptance = calculateAcceptanceScore(responses);

  const productExperience = {
    foodAcceptance: calculateAverageRating(
      responses.map((r) => r.foodAcceptance),
    ),
    tasteSmell: calculateAverageRating(responses.map((r) => r.tasteSmell)),
    easeOfMixing: calculateAverageRating(
      responses.map((r) => r.easeOfMixing),
    ),
    feedingExperience: calculateAverageRating(
      responses.map((r) => r.feedingExperience),
    ),
    convenience: calculateAverageRating(responses.map((r) => r.convenience)),
    overallQuality: calculateAverageRating(
      responses.map((r) => r.overallQuality),
    ),
  };

  return {
    dogsTested: responses.length,
    overallAcceptance,
    acceptanceLabel: getAcceptanceLabel(overallAcceptance),
    averageProductQuality: productExperience.overallQuality,
    continueUsingRate: calculateContinueUseRate(responses),
    averageTasteSmell: productExperience.tasteSmell,
    averageFeedingExperience: productExperience.feedingExperience,
    productExperience,
    appetiteDistribution: calculateDistribution(
      responses.map((r) => r.appetiteChange || 'Not provided'),
      APPETITE_OPTIONS,
    ),
    coatDistribution: calculateDistribution(
      responses.map((r) => r.coatObservation || 'Not provided'),
      COAT_OPTIONS,
    ),
    digestionDistribution: calculateDistribution(
      responses.map((r) => r.digestionStool || 'Not provided'),
      DIGESTION_OPTIONS,
    ),
    continueUsingDistribution: calculateDistribution(
      responses.map((r) => r.continueUsing || 'Not provided'),
      CONTINUE_USE_OPTIONS,
    ),
    trends: {
      dogsTested: null,
      overallAcceptance: halfTrend(responses, calculateAcceptanceScore),
      averageProductQuality: halfTrend(responses, (s) =>
        calculateAverageRating(s.map((r) => r.overallQuality)),
      ),
      continueUsingRate: halfTrend(responses, calculateContinueUseRate),
      averageTasteSmell: halfTrend(responses, (s) =>
        calculateAverageRating(s.map((r) => r.tasteSmell)),
      ),
      averageFeedingExperience: halfTrend(responses, (s) =>
        calculateAverageRating(s.map((r) => r.feedingExperience)),
      ),
    },
  };
}

/** Keyword theme extraction — only themes with matching response text are returned. */
const LIKE_THEMES: { theme: string; patterns: RegExp[] }[] = [
  {
    theme: 'Dogs ate it willingly',
    patterns: [
      /ate (it )?willing/i,
      /eager/i,
      /loved (the )?food/i,
      /finishes? (the )?bowl/i,
      /no hesitation/i,
      /ate right away/i,
      /licked (the )?bowl/i,
    ],
  },
  {
    theme: 'Easy to mix',
    patterns: [/easy to mix/i, /mixes? well/i, /dissolv/i, /blends? easily/i],
  },
  {
    theme: 'Good smell',
    patterns: [/smell(s|ed)? (good|great|nice|pleasant)/i, /aroma/i, /scent/i],
  },
  {
    theme: 'Convenient',
    patterns: [/convenien/i, /easy to use/i, /simple/i, /no mess/i],
  },
  {
    theme: 'Coat appearance',
    patterns: [/coat/i, /shin(y|ier)/i, /fur/i, /healthier.?looking/i],
  },
  {
    theme: 'Taste acceptance',
    patterns: [/taste/i, /flavor/i, /palatab/i],
  },
];

const IMPROVEMENT_THEMES: { theme: string; patterns: RegExp[] }[] = [
  {
    theme: 'Price',
    patterns: [/price/i, /cost/i, /expensive/i, /cheaper/i, /afford/i],
  },
  {
    theme: 'Packaging',
    patterns: [/packag/i, /bag/i, /scoop/i, /container/i, /seal/i],
  },
  {
    theme: 'Smell',
    patterns: [/smell/i, /odor/i, /scent/i, /aroma/i],
  },
  {
    theme: 'Texture',
    patterns: [/texture/i, /gritty/i, /clump/i, /powdery/i, /grainy/i],
  },
  {
    theme: 'Mixing',
    patterns: [/mix/i, /dissolv/i, /stir/i, /blend/i],
  },
  {
    theme: 'Instructions',
    patterns: [/instruction/i, /direction/i, /dosage/i, /serving/i, /how much/i],
  },
  {
    theme: 'Portion size',
    patterns: [/portion/i, /serving size/i, /quantity/i, /more product/i],
  },
];

function extractThemes(
  responses: FeedbackResponse[],
  field: 'likes' | 'improvements' | 'customerFeedback',
  themeDefs: { theme: string; patterns: RegExp[] }[],
): InsightTheme[] {
  const results: InsightTheme[] = [];

  for (const def of themeDefs) {
    const examples: string[] = [];
    for (const r of responses) {
      const text = r[field] ?? '';
      if (!text.trim()) continue;
      if (def.patterns.some((p) => p.test(text))) {
        examples.push(text.trim());
      }
    }
    if (examples.length > 0) {
      results.push({
        theme: def.theme,
        count: examples.length,
        examples: examples.slice(0, 3),
      });
    }
  }

  return results.sort((a, b) => b.count - a.count);
}

export function calculateProductInsights(
  responses: FeedbackResponse[],
): ProductInsights {
  const continuePositive = calculateContinueUseRate(responses);

  return {
    likes: extractThemes(responses, 'likes', LIKE_THEMES),
    improvements: extractThemes(responses, 'improvements', IMPROVEMENT_THEMES),
    signals: {
      tasteAcceptance: calculateAverageRating(
        responses.map((r) => r.tasteSmell),
      ),
      mixingExperience: calculateAverageRating(
        responses.map((r) => r.easeOfMixing),
      ),
      feedingExperience: calculateAverageRating(
        responses.map((r) => r.feedingExperience),
      ),
      convenience: calculateAverageRating(
        responses.map((r) => r.convenience),
      ),
      overallQuality: calculateAverageRating(
        responses.map((r) => r.overallQuality),
      ),
      continueUseIntention: continuePositive,
    },
  };
}

/** Deduplicate by id (keep first), sanitize ratings, fill missing strings. */
export function normalizeResponses(
  raw: FeedbackResponse[],
): FeedbackResponse[] {
  const seen = new Set<string>();
  const result: FeedbackResponse[] = [];

  for (const item of raw) {
    const id = String(item.id ?? '').trim();
    if (!id || seen.has(id)) continue;
    seen.add(id);

    result.push({
      ...item,
      id,
      timestamp: item.timestamp ?? '',
      dogName: item.dogName?.trim() || 'Unknown',
      breed: item.breed?.trim() || 'Not provided',
      age: item.age?.trim() || 'Not provided',
      weight: item.weight?.trim() || 'Not provided',
      previousDiet: item.previousDiet?.trim() || 'Not provided',
      foodAcceptance: sanitizeRating(item.foodAcceptance),
      tasteSmell: sanitizeRating(item.tasteSmell),
      easeOfMixing: sanitizeRating(item.easeOfMixing),
      feedingExperience: sanitizeRating(item.feedingExperience),
      convenience: sanitizeRating(item.convenience),
      overallQuality: sanitizeRating(item.overallQuality),
      appetiteChange: item.appetiteChange?.trim() || 'Not sure',
      coatObservation: item.coatObservation?.trim() || 'Not sure',
      digestionStool: item.digestionStool?.trim() || 'Not provided',
      otherChanges: item.otherChanges?.trim() || '',
      continueUsing: item.continueUsing?.trim() || 'Not sure',
      likes: item.likes?.trim() || '',
      improvements: item.improvements?.trim() || '',
      customerFeedback: item.customerFeedback?.trim() || '',
    });
  }

  return result;
}

export function formatRating(value: number | null): string {
  if (value === null) return '—';
  return value.toFixed(1);
}

export function uniqueValues(
  responses: FeedbackResponse[],
  key: keyof FeedbackResponse,
): string[] {
  const set = new Set<string>();
  for (const r of responses) {
    const v = r[key];
    if (typeof v === 'string' && v.trim()) set.add(v);
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}
