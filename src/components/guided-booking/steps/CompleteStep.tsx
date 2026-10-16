"use client";

import {
  ASSESSMENT_CONTACT_CONSENT,
  GUIDED_CANCELLATION_SUMMARY,
  GUIDED_DEPOSIT_SUMMARY,
  MARKETING_CONSENT,
  buildHandoffUrl,
  clientLooksComplete,
  type GuidedBookingState,
} from "@/lib/guided-booking";

export function CompleteStep({
  state,
  mode,
  onChange,
  onMockComplete,
  onHandoff,
  submitting,
}: {
  state: GuidedBookingState;
  mode: "mock" | "handoff";
  onChange: (patch: Partial<GuidedBookingState["client"]>) => void;
  onMockComplete?: () => void;
  onHandoff: (url: string) => void;
  submitting: boolean;
}) {
  const treatmentKey = state.selectedTreatmentKeys[0];
  const serviceSlug = treatmentKey?.split("/")[1];
  const handoffUrl =
    state.locationSlug && serviceSlug
      ? buildHandoffUrl(state.locationSlug, serviceSlug)
      : null;
  const ready = clientLooksComplete(state.client);

  if (state.confirmationId) {
    return (
      <div className="space-y-4" role="status">
        <h3 className="text-xl font-medium tracking-[-0.02em] text-ink">
          Booking confirmed
        </h3>
        <p className="text-sm font-light text-silver">
          Confirmation reference {state.confirmationId}. This was a mock
          confirmation for tests — no Boulevard appointment was created.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xl font-medium tracking-[-0.02em] text-ink">
          Continue to booking
        </h3>
        <p className="mt-2 text-sm font-light text-silver">
          {mode === "handoff"
            ? "Times, providers, and payment stay on Rella’s booking page. Continue there after your details."
            : "Mock mode can confirm without Boulevard. Production never creates carts from this marketing site session."}
        </p>
      </div>

      <div className="space-y-2 rounded-sm border border-rule/60 bg-ivory/80 p-4 text-sm text-ink/80">
        <p>{GUIDED_CANCELLATION_SUMMARY}</p>
        <p>{GUIDED_DEPOSIT_SUMMARY}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {(
          [
            ["firstName", "First name"],
            ["lastName", "Last name"],
            ["email", "Email"],
            ["phone", "Phone"],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="block text-sm">
            <span className="mb-1.5 block text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-ink/55">
              {label}
            </span>
            <input
              type={key === "email" ? "email" : key === "phone" ? "tel" : "text"}
              autoComplete={
                key === "email"
                  ? "email"
                  : key === "phone"
                    ? "tel"
                    : key === "firstName"
                      ? "given-name"
                      : "family-name"
              }
              value={state.client[key]}
              onChange={(e) => onChange({ [key]: e.target.value })}
              className="w-full rounded-sm border border-rule/70 bg-white px-3 py-2.5 text-ink outline-none focus:border-ink"
              required
            />
          </label>
        ))}
      </div>

      <div className="space-y-3">
        <label className="flex items-start gap-3 text-sm font-light leading-relaxed text-ink/80">
          <input
            type="checkbox"
            className="mt-1 size-4 shrink-0 accent-rose"
            checked={state.client.assessmentContactConsent}
            onChange={(event) =>
              onChange({ assessmentContactConsent: event.target.checked })
            }
            required
          />
          <span>{ASSESSMENT_CONTACT_CONSENT}</span>
        </label>
        <label className="flex items-start gap-3 text-sm font-light leading-relaxed text-ink/80">
          <input
            type="checkbox"
            className="mt-1 size-4 shrink-0 accent-rose"
            checked={state.client.marketingConsent}
            onChange={(event) =>
              onChange({ marketingConsent: event.target.checked })
            }
          />
          <span>{MARKETING_CONSENT}</span>
        </label>
      </div>

      {mode === "handoff" ? (
        handoffUrl ? (
          <a
            href={handoffUrl}
            data-guided-booking-handoff="true"
            onClick={() => onHandoff(handoffUrl)}
            className={`inline-flex items-center justify-center rounded-full border-[1.5px] border-rose bg-rose px-8 py-3.5 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-white ${
              ready ? "" : "pointer-events-none opacity-50"
            }`}
            aria-disabled={!ready}
          >
            Continue on booking app
          </a>
        ) : (
          <p className="text-sm text-rose" role="alert">
            This treatment mapping is unknown — booking refused (fail closed).
          </p>
        )
      ) : (
        <button
          type="button"
          disabled={!ready || submitting}
          onClick={onMockComplete}
          className="rounded-full border-[1.5px] border-rose bg-rose px-8 py-3.5 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-white disabled:opacity-50"
        >
          {submitting ? "Confirming…" : "Confirm mock booking"}
        </button>
      )}
    </div>
  );
}
