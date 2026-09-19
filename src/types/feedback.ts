/**
 * PurePaw customer feedback types.
 * Designed to map cleanly to Google Form / Sheets columns.
 */

/** 1–5 star rating; null when unanswered or invalid. */
export type RatingValue = number | null;

export type ContinueUseIntention =
  | 'Definitely yes'
  | 'Probably yes'
  | 'Not sure'
  | 'Probably not'
  | 'Definitely not'
  | string;

export type AppetiteObservation =
  | 'Appetite improved'
  | 'Appetite stayed the same'
  | 'Appetite decreased'
  | 'Appetite varied'
  | 'Not sure'
  | string;

export type CoatObservation =
  | 'Looks shinier or healthier'
  | 'No noticeable change'
  | 'Looks duller'
  | 'Experienced unusual shedding'
  | 'Not sure'
  | string;

export type DigestionObservation =
  | 'Digestion appeared better'
  | 'No noticeable change'
  | 'Stool became softer or looser'
  | 'Stool became harder or constipation occurred'
  | 'Other'
  | string;

export type AcceptanceLabel =
  | 'Excellent'
  | 'Strong'
  | 'Moderate'
  | 'Needs Attention'
  | 'Insufficient Data';

/**
 * Single survey response row.
 * Field names mirror Google Form questions for easy Sheets mapping.
 */
export interface FeedbackResponse {
  id: string;
  timestamp: string;
  dogName: string;
  breed: string;
  age: string;
  weight: string;
  previousDiet: string;
  /** Q4 — How willingly did your dog eat PurePaw? */
  foodAcceptance: RatingValue;
  /** Q5 — Taste and smell response */
  tasteSmell: RatingValue;
  /** Q6 — Ease of mixing */
  easeOfMixing: RatingValue;
  /** Q7 — Overall feeding experience */
  feedingExperience: RatingValue;
  /** Q8 — Convenience satisfaction */
  convenience: RatingValue;
  /** Q9 — Overall product quality */
  overallQuality: RatingValue;
  appetiteChange: AppetiteObservation;
  coatObservation: CoatObservation;
  digestionStool: DigestionObservation;
  otherChanges: string;
  continueUsing: ContinueUseIntention;
  likes: string;
  improvements: string;
  customerFeedback: string;
}

export interface DashboardFilters {
  dateFrom: string;
  dateTo: string;
  breed: string;
  previousDiet: string;
  continueUsing: string;
  /** Minimum overall quality rating (1–5), empty = any */
  minRating: string;
}

export interface DistributionItem {
  label: string;
  count: number;
  percentage: number;
}

export interface ProductExperienceAverages {
  foodAcceptance: number | null;
  tasteSmell: number | null;
  easeOfMixing: number | null;
  feedingExperience: number | null;
  convenience: number | null;
  overallQuality: number | null;
}

export interface DashboardMetrics {
  dogsTested: number;
  overallAcceptance: number | null;
  acceptanceLabel: AcceptanceLabel;
  averageProductQuality: number | null;
  continueUsingRate: number | null;
  averageTasteSmell: number | null;
  averageFeedingExperience: number | null;
  productExperience: ProductExperienceAverages;
  appetiteDistribution: DistributionItem[];
  coatDistribution: DistributionItem[];
  digestionDistribution: DistributionItem[];
  continueUsingDistribution: DistributionItem[];
  /** Optional trend deltas vs previous half of filtered set (null if not enough data). */
  trends: {
    dogsTested: number | null;
    overallAcceptance: number | null;
    averageProductQuality: number | null;
    continueUsingRate: number | null;
    averageTasteSmell: number | null;
    averageFeedingExperience: number | null;
  };
}

export interface InsightTheme {
  theme: string;
  count: number;
  examples: string[];
}

export interface ProductInsights {
  likes: InsightTheme[];
  improvements: InsightTheme[];
  signals: {
    tasteAcceptance: number | null;
    mixingExperience: number | null;
    feedingExperience: number | null;
    convenience: number | null;
    overallQuality: number | null;
    continueUseIntention: number | null;
  };
}

export const EMPTY_FILTERS: DashboardFilters = {
  dateFrom: '',
  dateTo: '',
  breed: '',
  previousDiet: '',
  continueUsing: '',
  minRating: '',
};

export const CONTINUE_USE_OPTIONS = [
  'Definitely yes',
  'Probably yes',
  'Not sure',
  'Probably not',
  'Definitely not',
] as const;

export const APPETITE_OPTIONS = [
  'Appetite improved',
  'Appetite stayed the same',
  'Appetite decreased',
  'Appetite varied',
  'Not sure',
] as const;

export const COAT_OPTIONS = [
  'Looks shinier or healthier',
  'No noticeable change',
  'Looks duller',
  'Experienced unusual shedding',
  'Not sure',
] as const;

export const DIGESTION_OPTIONS = [
  'Digestion appeared better',
  'No noticeable change',
  'Stool became softer or looser',
  'Stool became harder or constipation occurred',
  'Other',
] as const;
