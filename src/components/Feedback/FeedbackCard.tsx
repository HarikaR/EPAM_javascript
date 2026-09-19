import type { FeedbackResponse } from '../../types/feedback';
import { calculateExperienceScore, formatRating } from '../../utils/calculations';

interface FeedbackCardProps {
  response: FeedbackResponse;
  onOpen?: (id: string) => void;
}

export function FeedbackCard({ response, onOpen }: FeedbackCardProps) {
  const score = calculateExperienceScore(response);
  const comment =
    response.customerFeedback ||
    response.likes ||
    response.improvements ||
    'No written comment provided.';
  const date = response.timestamp
    ? new Date(response.timestamp).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Unknown date';

  return (
    <article className="card-surface flex flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-semibold text-ink-900">
            {response.dogName}
          </h3>
          <p className="mt-0.5 text-xs text-ink-400">{date}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-ink-400">Overall rating</p>
          <p className="font-semibold text-paw-700">
            {formatRating(response.overallQuality)}
            <span className="text-ink-400"> / 5</span>
          </p>
        </div>
      </div>

      <p className="mt-4 flex-1 text-sm leading-relaxed text-ink-600">
        “{comment}”
      </p>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-ink-100 pt-4">
        <span className="rounded-full bg-paw-50 px-2.5 py-1 text-xs font-medium text-paw-800">
          {response.continueUsing}
        </span>
        <div className="flex items-center gap-3">
          <span className="text-xs text-ink-400">
            Experience {formatRating(score)} / 5
          </span>
          {onOpen ? (
            <button
              type="button"
              onClick={() => onOpen(response.id)}
              className="text-sm font-medium text-paw-700 hover:text-paw-800"
            >
              View details
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}
