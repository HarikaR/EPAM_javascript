import type { FeedbackResponse } from '../types/feedback';

const CSV_HEADERS: { key: keyof FeedbackResponse; label: string }[] = [
  { key: 'id', label: 'ID' },
  { key: 'timestamp', label: 'Timestamp' },
  { key: 'dogName', label: 'Dog Name' },
  { key: 'breed', label: 'Breed' },
  { key: 'age', label: 'Age' },
  { key: 'weight', label: 'Weight' },
  { key: 'previousDiet', label: 'Previous Diet' },
  { key: 'foodAcceptance', label: 'Food Acceptance' },
  { key: 'tasteSmell', label: 'Taste & Smell' },
  { key: 'easeOfMixing', label: 'Ease of Mixing' },
  { key: 'feedingExperience', label: 'Feeding Experience' },
  { key: 'convenience', label: 'Convenience' },
  { key: 'overallQuality', label: 'Overall Quality' },
  { key: 'appetiteChange', label: 'Appetite Change' },
  { key: 'coatObservation', label: 'Coat Observation' },
  { key: 'digestionStool', label: 'Digestion / Stool' },
  { key: 'otherChanges', label: 'Other Changes' },
  { key: 'continueUsing', label: 'Continue Using PurePaw' },
  { key: 'likes', label: 'Likes' },
  { key: 'improvements', label: 'Improvements' },
  { key: 'customerFeedback', label: 'Customer Feedback' },
];

function escapeCsv(value: unknown): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function responsesToCsv(responses: FeedbackResponse[]): string {
  const header = CSV_HEADERS.map((h) => escapeCsv(h.label)).join(',');
  const rows = responses.map((r) =>
    CSV_HEADERS.map((h) => escapeCsv(r[h.key])).join(','),
  );
  return [header, ...rows].join('\n');
}

export function downloadResponsesCsv(
  responses: FeedbackResponse[],
  filename = 'purepaw-responses.csv',
): void {
  const csv = responsesToCsv(responses);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.setAttribute('aria-label', 'Download responses CSV');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
