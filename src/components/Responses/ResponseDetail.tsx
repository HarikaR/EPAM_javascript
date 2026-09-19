import { X } from 'lucide-react';
import type { FeedbackResponse } from '../../types/feedback';
import {
  calculateExperienceScore,
  formatRating,
} from '../../utils/calculations';

interface ResponseDetailProps {
  response: FeedbackResponse;
  onClose: () => void;
}

function RatingRow({ label, value }: { label: string; value: number | null }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-ink-50 py-2 last:border-0">
      <span className="text-sm text-ink-500">{label}</span>
      <span className="font-medium text-ink-900">
        {formatRating(value)}
        <span className="text-ink-400"> / 5</span>
      </span>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium tracking-wide text-ink-400 uppercase">
        {label}
      </p>
      <p className="mt-1 text-sm text-ink-700">{value || '—'}</p>
    </div>
  );
}

export function ResponseDetail({ response, onClose }: ResponseDetailProps) {
  const experience = calculateExperienceScore(response);

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-ink-900/30 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="response-detail-title"
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose();
      }}
    >
      <div
        className="scrollbar-thin flex h-full w-full max-w-lg flex-col overflow-y-auto bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-ink-100 bg-white/95 px-5 py-4 backdrop-blur">
          <div>
            <p className="text-xs font-medium tracking-widest text-paw-600 uppercase">
              Response detail
            </p>
            <h2
              id="response-detail-title"
              className="font-display text-2xl font-semibold text-ink-900"
            >
              {response.dogName}
            </h2>
            <p className="mt-1 text-sm text-ink-500">
              Experience Score{' '}
              <span className="font-semibold text-paw-700">
                {formatRating(experience)} / 5
              </span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-ink-200 p-2 text-ink-500 hover:bg-ink-50"
            aria-label="Close detail panel"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="space-y-6 p-5">
          <section>
            <h3 className="mb-3 font-display text-lg font-semibold text-ink-900">
              Dog profile
            </h3>
            <div className="card-surface grid grid-cols-2 gap-4 p-4">
              <Field label="Name" value={response.dogName} />
              <Field label="Breed" value={response.breed} />
              <Field label="Age" value={response.age} />
              <Field label="Weight" value={response.weight} />
              <div className="col-span-2">
                <Field label="Previous diet" value={response.previousDiet} />
              </div>
            </div>
          </section>

          <section>
            <h3 className="mb-3 font-display text-lg font-semibold text-ink-900">
              Product experience
            </h3>
            <div className="card-surface px-4 py-2">
              <RatingRow label="Food acceptance" value={response.foodAcceptance} />
              <RatingRow label="Taste & smell" value={response.tasteSmell} />
              <RatingRow label="Ease of mixing" value={response.easeOfMixing} />
              <RatingRow
                label="Feeding experience"
                value={response.feedingExperience}
              />
              <RatingRow label="Convenience" value={response.convenience} />
              <RatingRow label="Overall quality" value={response.overallQuality} />
            </div>
          </section>

          <section>
            <h3 className="mb-1 font-display text-lg font-semibold text-ink-900">
              Observed changes
            </h3>
            <p className="mb-3 text-xs text-ink-400">
              Customer-reported observations — not proven product effects.
            </p>
            <div className="card-surface grid gap-4 p-4">
              <Field label="Appetite" value={response.appetiteChange} />
              <Field label="Coat" value={response.coatObservation} />
              <Field label="Digestion / stool" value={response.digestionStool} />
              <Field label="Other changes" value={response.otherChanges} />
            </div>
          </section>

          <section>
            <h3 className="mb-3 font-display text-lg font-semibold text-ink-900">
              Customer
            </h3>
            <div className="card-surface grid gap-4 p-4">
              <Field
                label="Continue-use intention"
                value={response.continueUsing}
              />
              <Field label="Likes" value={response.likes} />
              <Field label="Improvements" value={response.improvements} />
              <Field
                label="Customer feedback"
                value={response.customerFeedback}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
