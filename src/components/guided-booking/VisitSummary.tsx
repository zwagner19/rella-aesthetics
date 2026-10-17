"use client";

import {
  formatDeposit,
  paymentRuleLabel,
  resolveGuidedTreatment,
} from "@/lib/guided-booking";
import type { GuidedBookingState } from "@/lib/guided-booking";
import { getGuidedLocation } from "@/lib/guided-booking";

export function VisitSummary({
  state,
  onRemove,
  editable = true,
}: {
  state: GuidedBookingState;
  onRemove?: (key: string) => void;
  editable?: boolean;
}) {
  const location = getGuidedLocation(state.locationSlug);
  const treatments = state.selectedTreatmentKeys
    .map((key) => {
      const [, service] = key.split("/");
      if (!state.locationSlug || !service) return null;
      return resolveGuidedTreatment(state.locationSlug, service);
    })
    .filter(Boolean);

  if (!location && treatments.length === 0) {
    return (
      <aside className="rounded-sm border border-rule/60 bg-white/70 p-4 text-sm text-silver">
        Your visit details will appear here as you choose a location and treatment.
      </aside>
    );
  }

  return (
    <aside
      aria-label="Your visit"
      className="rounded-sm border border-rule/60 bg-white/80 p-4"
    >
      <p className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-ink/60">
        Your visit
      </p>
      {location ? (
        <p className="mt-3 text-sm font-medium text-ink">
          {location.displayName}
          <span className="mt-0.5 block font-light text-silver">
            {location.streetShort}
          </span>
        </p>
      ) : null}
      <ul className="mt-4 space-y-3">
        {treatments.map((treatment) =>
          treatment ? (
            <li
              key={treatment.key}
              className="flex items-start justify-between gap-3 border-t border-rule/40 pt-3 first:border-t-0 first:pt-0"
            >
              <div>
                <p className="text-sm font-medium text-ink">{treatment.displayName}</p>
                {treatment.durationCopy ? (
                  <p className="text-xs text-silver">{treatment.durationCopy}</p>
                ) : null}
                <p className="mt-1 text-xs text-silver">
                  {paymentRuleLabel(treatment)}
                </p>
                {treatment.depositCents != null ? (
                  <p className="sr-only">
                    Deposit {formatDeposit(treatment.depositCents)}
                  </p>
                ) : null}
              </div>
              {editable && onRemove ? (
                <button
                  type="button"
                  className="shrink-0 text-[0.625rem] font-bold uppercase tracking-[0.14em] text-rose"
                  onClick={() => onRemove(treatment.key)}
                >
                  Remove
                </button>
              ) : null}
            </li>
          ) : null,
        )}
      </ul>
    </aside>
  );
}
