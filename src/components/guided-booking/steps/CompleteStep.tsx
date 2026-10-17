"use client";

import {
  ASSESSMENT_CONTACT_CONSENT,
  MARKETING_CONSENT,
  clientLooksComplete,
  contactFieldsLookComplete,
  type GuidedBookingState,
} from "@/lib/guided-booking";

import { SecureCardFrame } from "../SecureCardFrame";

export function CompleteStep({
  state,
  mode,
  onChange,
  onMockComplete,
  submitting,
  cardFrameOrigin,
  onLiveComplete,
}: {
  state: GuidedBookingState;
  mode: "mock" | "live";
  cardFrameOrigin?: string;
  onLiveComplete: (token?: string) => Promise<void>;
  onChange: (patch: Partial<GuidedBookingState["client"]>) => void;
  onMockComplete?: () => void;
  submitting: boolean;
}) {
  const ready = clientLooksComplete(state.client);
  const contactReady = contactFieldsLookComplete(state.client);

  if (state.confirmationId) {
    return (
      <div className="space-y-4" role="status">
        <h3 className="text-xl font-medium tracking-[-0.02em] text-ink">
          {state.confirmationPending ? "Booking verification pending" : "Booking confirmed"}
        </h3>
        <p className="text-sm font-light text-silver">
          {mode === "mock" ? "This was a test confirmation; no appointment was created." : state.confirmationPending ? "Please call Rella to verify your appointment before booking again." : "Your appointment has been confirmed by Rella’s booking system."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xl font-medium tracking-[-0.02em] text-ink">
          Complete your booking
        </h3>
        <p className="mt-2 text-sm font-light text-silver">
          {mode === "live" ? "Enter your details to confirm your appointment securely with Boulevard." : "This is a test booking."}
        </p>
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
              className="min-h-11 w-full rounded-sm border border-rule/70 bg-white px-3 py-2.5 text-base text-ink outline-none focus:border-ink sm:text-sm"
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
            onChange={(event) => onChange({ marketingConsent: event.target.checked })}
          />
          <span>{MARKETING_CONSENT}</span>
        </label>
      </div>

      {mode === "live" ? (
        <div className="space-y-4">
          {state.quote ? (
            <p className="text-sm text-silver">
              Total booking deposit: {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(state.quote.depositCents / 100)}
              <span className="mt-1 block text-xs">
                {state.quote.depositCents > 0
                  ? "A deposit applies to each appointment that requires one. This total covers your selected appointments."
                  : "No deposit is due for this booking."}
              </span>
            </p>
          ) : null}
          {ready && state.quote ? (
            state.quote.needsCard ? (
              cardFrameOrigin ? <SecureCardFrame origin={cardFrameOrigin} busy={submitting} onToken={onLiveComplete} /> : <p role="alert">Secure payment is unavailable. Please call Rella.</p>
            ) : <button type="button" disabled={submitting} onClick={() => void onLiveComplete()} className="rounded-full border-[1.5px] border-rose bg-rose px-8 py-3.5 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-white disabled:opacity-50">{submitting ? "Confirming…" : "Confirm booking"}</button>
          ) : (
            <p className="text-sm text-silver">
              {contactReady
                ? "Confirm the required contact consent to continue."
                : "Complete your contact details to continue."}
            </p>
          )}
        </div>
      ) : (
        <button type="button" disabled={!ready || submitting} onClick={onMockComplete} className="rounded-full border-[1.5px] border-rose bg-rose px-8 py-3.5 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-white disabled:opacity-50">{submitting ? "Confirming…" : "Confirm mock booking"}</button>
      )}
    </div>
  );
}
