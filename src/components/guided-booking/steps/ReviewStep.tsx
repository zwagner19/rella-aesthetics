"use client";

import {
  GUIDED_CANCELLATION_SUMMARY,
  GUIDED_DEPOSIT_SUMMARY,
  paymentRuleLabel,
  resolveGuidedTreatment,
} from "@/lib/guided-booking";
import type { GuidedBookingState } from "@/lib/guided-booking";
import { getGuidedLocation } from "@/lib/guided-booking";

export function ReviewStep({
  state,
  onChangeTreatments,
}: {
  state: GuidedBookingState;
  onChangeTreatments: () => void;
}) {
  const location = getGuidedLocation(state.locationSlug);
  const treatments = state.selectedTreatmentKeys
    .map((key) => {
      const service = key.split("/")[1];
      if (!state.locationSlug || !service) return null;
      return resolveGuidedTreatment(state.locationSlug, service);
    })
    .filter(Boolean);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-medium tracking-[-0.02em] text-ink">
          Review your visit
        </h3>
        <p className="mt-2 text-sm font-light text-silver">
          Prep notes and policies below are Rella’s. Live pricing and deposits
          are confirmed in Boulevard when you reserve.
        </p>
      </div>

      {location ? (
        <div className="rounded-sm border border-rule/60 bg-white p-4">
          <p className="text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-ink/55">
            Location
          </p>
          <p className="mt-2 font-medium text-ink">{location.displayName}</p>
          <p className="text-sm text-silver">{location.addressLine}</p>
        </div>
      ) : null}

      <div className="space-y-3">
        {treatments.map((treatment) =>
          treatment ? (
            <article
              key={treatment.key}
              className="rounded-sm border border-rule/60 bg-white p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="font-medium text-ink">{treatment.displayName}</h4>
                  <p className="mt-1 text-sm font-light text-silver">
                    {treatment.shortDescription}
                  </p>
                </div>
                {treatment.durationCopy ? (
                  <p className="shrink-0 text-xs text-silver">
                    {treatment.durationCopy}
                  </p>
                ) : null}
              </div>
              <p className="mt-3 text-xs text-silver">
                {paymentRuleLabel(treatment)}
              </p>
              {treatment.prepCopy ? (
                <p className="mt-3 text-sm text-ink/80">
                  <span className="font-medium">Prep: </span>
                  {treatment.prepCopy}
                </p>
              ) : null}
              {treatment.downtimeCopy ? (
                <p className="mt-2 text-sm text-ink/80">
                  <span className="font-medium">Downtime: </span>
                  {treatment.downtimeCopy}
                </p>
              ) : null}
            </article>
          ) : null,
        )}
      </div>

      <div className="space-y-2 rounded-sm border border-rule/60 bg-ivory/80 p-4 text-sm text-ink/80">
        <p>{GUIDED_DEPOSIT_SUMMARY}</p>
        <p>{GUIDED_CANCELLATION_SUMMARY}</p>
      </div>

      <button
        type="button"
        onClick={onChangeTreatments}
        className="text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-rose"
      >
        Add or change treatments
      </button>
    </div>
  );
}
