"use client";

import { useState } from "react";
import {
  ASSESSMENT_CONTACT_CONSENT,
  GUIDED_CANCELLATION_SUMMARY,
  GUIDED_DEPOSIT_SUMMARY,
  MARKETING_CONSENT,
  clientLooksComplete,
  type GuidedBookingState,
} from "@/lib/guided-booking";

export function CompleteStep({
  state,
  submitting,
  onChange,
  onCheckout,
  onPay,
}: {
  state: GuidedBookingState;
  submitting: boolean;
  onChange: (patch: Partial<GuidedBookingState["client"]>) => void;
  onCheckout: () => void;
  onPay: (card: {
    name: string;
    number: string;
    cvv: string;
    expMonth: number;
    expYear: number;
    zip: string;
  }) => void;
}) {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [exp, setExp] = useState("");
  const [zip, setZip] = useState("");
  const [cardError, setCardError] = useState<string | null>(null);
  const ready = clientLooksComplete(state.client);

  if (state.confirmation) {
    return (
      <div className="space-y-4" role="status">
        <h3 className="text-xl font-medium tracking-[-0.02em] text-ink">
          {state.confirmation === "confirmed" ? "You’re booked" : "Booking received"}
        </h3>
        <p className="text-sm font-light text-silver">
          {state.confirmation === "confirmed"
            ? "Your appointment is confirmed. Rella will use the contact details you provided."
            : "The booking service accepted the visit, and confirmation is still finishing. If you don’t hear back, call 707.358.2928."}
        </p>
      </div>
    );
  }

  function submitCard() {
    const digits = number.replace(/[\s-]/g, "");
    const [monthRaw, yearRaw] = exp.split("/").map((part) => parseInt(part.trim(), 10));
    const errors: string[] = [];
    if (!name.trim()) errors.push("Name on card is required.");
    if (!/^\d{13,19}$/.test(digits)) errors.push("Card number looks invalid.");
    if (!/^\d{3,4}$/.test(cvv)) errors.push("Security code looks invalid.");
    if (!monthRaw || monthRaw < 1 || monthRaw > 12 || !yearRaw) {
      errors.push("Expiration must be MM/YY.");
    }
    if (!/^\d{5}$/.test(zip)) errors.push("Billing ZIP must be 5 digits.");
    if (errors.length > 0) {
      setCardError(errors[0] ?? "Check the card details.");
      return;
    }
    setCardError(null);
    onPay({
      name: name.trim(),
      number: digits,
      cvv,
      expMonth: monthRaw,
      expYear: 2000 + yearRaw,
      zip,
    });
  }

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xl font-medium tracking-[-0.02em] text-ink">
          Complete your visit
        </h3>
        <p className="mt-2 text-sm font-light text-silver">
          Your details stay in this overlay. Card numbers, when needed, go only
          to Boulevard’s card service.
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
              onChange={(event) => onChange({ [key]: event.target.value })}
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

      {state.needsCard ? (
        <fieldset className="space-y-3 rounded-sm border border-rule/60 bg-white p-4">
          <legend className="px-1 text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-ink/55">
            Card for Boulevard
          </legend>
          <p className="text-sm font-light text-silver">
            A card is required to hold this appointment. These fields are sent
            only to Boulevard’s card service. This website does not store the
            card number.
          </p>
          <label className="block text-sm">
            <span className="mb-1.5 block text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-ink/55">
              Name on card
            </span>
            <input
              value={name}
              autoComplete="cc-name"
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-sm border border-rule/70 bg-white px-3 py-2.5 text-ink outline-none focus:border-ink"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-ink/55">
              Card number
            </span>
            <input
              value={number}
              inputMode="numeric"
              autoComplete="cc-number"
              onChange={(event) => setNumber(event.target.value)}
              className="w-full rounded-sm border border-rule/70 bg-white px-3 py-2.5 text-ink outline-none focus:border-ink"
            />
          </label>
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="block text-sm">
              <span className="mb-1.5 block text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-ink/55">
                Expiration
              </span>
              <input
                value={exp}
                placeholder="MM/YY"
                autoComplete="cc-exp"
                onChange={(event) => setExp(event.target.value)}
                className="w-full rounded-sm border border-rule/70 bg-white px-3 py-2.5 text-ink outline-none focus:border-ink"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-ink/55">
                Security code
              </span>
              <input
                value={cvv}
                inputMode="numeric"
                autoComplete="cc-csc"
                onChange={(event) => setCvv(event.target.value)}
                className="w-full rounded-sm border border-rule/70 bg-white px-3 py-2.5 text-ink outline-none focus:border-ink"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-ink/55">
                Billing ZIP
              </span>
              <input
                value={zip}
                inputMode="numeric"
                autoComplete="postal-code"
                onChange={(event) => setZip(event.target.value)}
                className="w-full rounded-sm border border-rule/70 bg-white px-3 py-2.5 text-ink outline-none focus:border-ink"
              />
            </label>
          </div>
          {cardError ? (
            <p className="text-sm text-rose" role="alert">
              {cardError}
            </p>
          ) : null}
          <button
            type="button"
            disabled={!ready || submitting}
            onClick={submitCard}
            className="rounded-full border-[1.5px] border-rose bg-rose px-8 py-3.5 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-white disabled:opacity-50"
          >
            {submitting ? "Verifying…" : "Verify card and book"}
          </button>
        </fieldset>
      ) : (
        <button
          type="button"
          disabled={!ready || submitting}
          onClick={onCheckout}
          className="rounded-full border-[1.5px] border-rose bg-rose px-8 py-3.5 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-white disabled:opacity-50"
        >
          {submitting ? "Booking…" : "Book appointment"}
        </button>
      )}
    </div>
  );
}
