"use client";

import {
  GUIDED_CANCELLATION_SUMMARY,
  GUIDED_DEPOSIT_SUMMARY,
  selectedService,
  visibleServiceDescription,
} from "@/lib/guided-booking";
import type { GuidedBookingState } from "@/lib/guided-booking";

export function ReviewStep({
  state,
  onChangeTreatments,
}: {
  state: GuidedBookingState;
  onChangeTreatments: () => void;
}) {
  const service = selectedService(state);
  const description = service
    ? visibleServiceDescription(service.description)
    : "";

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-medium tracking-[-0.02em] text-ink">
          Review your visit
        </h3>
        <p className="mt-2 text-sm font-light text-silver">
          The cancellation notice below is Rella’s. The appointment is created
          from this overlay.
        </p>
      </div>

      {state.clinic ? (
        <div className="rounded-sm border border-rule/60 bg-white p-4">
          <p className="text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-ink/55">
            Location
          </p>
          <p className="mt-2 font-medium text-ink">{state.clinic.locationName}</p>
          <p className="text-sm text-silver">{state.clinic.addressLine}</p>
        </div>
      ) : null}

      {service ? (
        <article className="rounded-sm border border-rule/60 bg-white p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h4 className="font-medium text-ink">{service.displayName}</h4>
              {description ? (
                <p className="mt-1 text-sm font-light text-silver">{description}</p>
              ) : null}
            </div>
            {service.durationCopy ? (
              <p className="shrink-0 text-xs text-silver">{service.durationCopy}</p>
            ) : null}
          </div>
        </article>
      ) : null}

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
