"use client";

import { bookingAmountLabel, selectedService } from "@/lib/guided-booking";
import type { GuidedBookingState } from "@/lib/guided-booking";

export function VisitSummary({
  state,
  onRemove,
  editable = true,
}: {
  state: GuidedBookingState;
  onRemove?: () => void;
  editable?: boolean;
}) {
  const service = selectedService(state);
  const amount = service ? bookingAmountLabel(service) : null;
  const clinicName = state.clinic?.locationName;
  const street = state.clinic?.streetShort;

  if (!state.locationSlug && !service) {
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
      {clinicName ? (
        <p className="mt-3 text-sm font-medium text-ink">
          {clinicName}
          {street ? (
            <span className="mt-0.5 block font-light text-silver">{street}</span>
          ) : null}
        </p>
      ) : null}
      {service ? (
        <div className="mt-4 flex items-start justify-between gap-3 border-t border-rule/40 pt-3">
          <div>
            <p className="text-sm font-medium text-ink">{service.displayName}</p>
            {service.durationCopy ? (
              <p className="text-xs text-silver">{service.durationCopy}</p>
            ) : null}
            {amount ? (
              <p className="text-xs font-medium text-ink">{amount}</p>
            ) : null}
            {service.providerDisplayName ? (
              <p className="text-xs text-silver">{service.providerDisplayName}</p>
            ) : null}
          </div>
          {editable && onRemove ? (
            <button
              type="button"
              className="shrink-0 text-[0.625rem] font-bold uppercase tracking-[0.14em] text-rose"
              onClick={onRemove}
            >
              Remove
            </button>
          ) : null}
        </div>
      ) : null}
    </aside>
  );
}
