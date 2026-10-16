"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { BookingIntent } from "@/lib/booking-routes";
import {
  applyCatalog,
  bootstrapFromIntent,
  canGoBack,
  clearTreatment,
  clientLooksComplete,
  createCart,
  emitGuidedBookingEvent,
  finishBooking,
  goBack,
  goToStep,
  GUIDED_BOOKING_STEPS,
  loadCatalog,
  loadTimes,
  progressLabel,
  reserveTime,
  selectDate,
  selectLocation,
  selectSlot,
  selectedService,
  setCatalogError,
  setDates,
  setSearch,
  submitCheckout,
  submitPayment,
  toggleCategory,
  toggleTreatment,
  tokenizeCard,
  updateClient,
  type BookingSiteScope,
  type GuidedBookingState,
  type GuidedSlot,
} from "@/lib/guided-booking";
import { VisitSummary } from "./VisitSummary";
import { LocationStep } from "./steps/LocationStep";
import { TreatmentsStep } from "./steps/TreatmentsStep";
import { ReviewStep } from "./steps/ReviewStep";
import { ProviderStep } from "./steps/ProviderStep";
import { DateTimeStep } from "./steps/DateTimeStep";
import { CompleteStep } from "./steps/CompleteStep";

export function BookingModal({
  intent,
  siteScope = "aesthetics",
  onClose,
}: {
  intent: BookingIntent;
  siteScope?: BookingSiteScope;
  onClose: () => void;
}) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [state, setState] = useState<GuidedBookingState>(() =>
    bootstrapFromIntent(intent, siteScope),
  );
  const [times, setTimes] = useState<GuidedSlot[]>([]);
  const [loadingTimes, setLoadingTimes] = useState(false);
  const loadingCatalog = Boolean(
    state.locationSlug && !state.clinic && !state.catalogError,
  );

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    if (!state.locationSlug) return;
    const location = state.locationSlug;
    const scope = state.siteScope;
    let cancelled = false;
    loadCatalog(location, scope).then((result) => {
      if (cancelled) return;
      setState((prev) => {
        if (prev.locationSlug !== location || prev.catalogNonce !== state.catalogNonce) {
          return prev;
        }
        if (!result.ok) return setCatalogError(prev, result.message);
        return applyCatalog(prev, result.clinic);
      });
    });
    return () => {
      cancelled = true;
    };
  }, [state.locationSlug, state.siteScope, state.catalogNonce]);

  const patch = useCallback((next: GuidedBookingState) => {
    setState(next);
  }, []);

  const stepNumber = GUIDED_BOOKING_STEPS.indexOf(state.step) + 1;
  const service = selectedService(state);

  async function continueFromProvider() {
    if (!state.locationSlug || !service) {
      patch(goToStep(state, "treatments"));
      return;
    }
    const location = state.locationSlug;
    const serviceSlug = service.serviceSlug;
    const scope = state.siteScope;
    setState({
      ...goToStep(state, "datetime"),
      busy: true,
      dates: [],
      date: "",
      slot: null,
      reservedSlotId: null,
    });
    setTimes([]);
    const result = await createCart({
      location,
      service: serviceSlug,
      siteScope: scope,
    });
    setState((prev) => {
      if (!result.ok) {
        return { ...prev, busy: false, error: result.message, dates: [] };
      }
      return { ...setDates(prev, result.dates), busy: false };
    });
  }

  async function chooseDate(date: string) {
    const zone = state.clinic?.timeZone;
    if (!zone) {
      patch({ ...state, error: "The live catalog did not include a time zone." });
      return;
    }
    setState((prev) => selectDate(prev, date));
    setTimes([]);
    setLoadingTimes(true);
    const result = await loadTimes({
      date,
      timeZone: zone,
      siteScope: state.siteScope,
    });
    setLoadingTimes(false);
    if (!result.ok) {
      setState((prev) => ({ ...prev, error: result.message }));
      return;
    }
    setTimes(result.times);
  }

  function primaryAction() {
    switch (state.step) {
      case "location":
        if (!state.locationSlug) {
          patch({ ...state, error: "Choose a location to continue." });
          return;
        }
        patch(goToStep(state, "treatments"));
        return;
      case "treatments":
        if (!state.selectedServiceSlug) {
          patch({ ...state, error: "Add a treatment to continue." });
          return;
        }
        patch(goToStep(state, "review"));
        return;
      case "review":
        patch(goToStep(state, "provider"));
        return;
      case "provider":
        void continueFromProvider();
        return;
      case "datetime":
        if (!state.slot) {
          patch({ ...state, error: "Choose a time to continue." });
          return;
        }
        patch(goToStep(state, "complete"));
        return;
      case "complete":
        return;
      default: {
        const _exhaustive: never = state.step;
        return _exhaustive;
      }
    }
  }

  async function checkout() {
    if (!state.slot || !clientLooksComplete(state.client)) return;
    const slotId = state.slot.id;
    const scope = state.siteScope;
    const client = state.client;
    setState((prev) => ({ ...prev, busy: true, error: null }));
    if (state.reservedSlotId !== slotId) {
      const reserved = await reserveTime({
        bookableTimeId: slotId,
        siteScope: scope,
      });
      if (!reserved.ok) {
        setState((prev) => ({ ...prev, busy: false, error: reserved.message }));
        return;
      }
      setState((prev) => ({ ...prev, reservedSlotId: slotId }));
    }
    const result = await submitCheckout({
      firstName: client.firstName.trim(),
      lastName: client.lastName.trim(),
      email: client.email.trim(),
      phoneNumber: client.phone.trim(),
      siteScope: scope,
    });
    if (result.status === 409 && result.reason === "payment_required") {
      setState((prev) => ({ ...prev, busy: false, needsCard: true, error: null }));
      return;
    }
    if (result.status === 409 && result.reason === "payment_rule_mismatch") {
      setState((prev) => ({
        ...prev,
        busy: false,
        error:
          "The payment setup does not match this service, so booking stopped before a charge.",
      }));
      return;
    }
    if (!result.ok) {
      setState((prev) => ({
        ...prev,
        busy: false,
        error: result.reason
          ? `Checkout could not finish (${result.reason}).`
          : `Checkout could not finish (HTTP ${result.status}).`,
      }));
      return;
    }
    const finished = await finishBooking(scope);
    const confirmation =
      result.confirmation === "CONFIRMED" && finished.ok ? "confirmed" : "pending";
    emitGuidedBookingEvent({
      type: "booking_confirmed",
      confirmationId: confirmation,
      at: Date.now(),
    });
    setState((prev) => ({
      ...prev,
      busy: false,
      confirmation,
      needsCard: false,
      error: null,
    }));
  }

  async function pay(card: {
    name: string;
    number: string;
    cvv: string;
    expMonth: number;
    expYear: number;
    zip: string;
  }) {
    setState((prev) => ({ ...prev, busy: true, error: null }));
    const token = await tokenizeCard(card);
    if (!token.ok) {
      setState((prev) => ({ ...prev, busy: false, error: token.message }));
      return;
    }
    const paid = await submitPayment({
      token: token.token,
      siteScope: state.siteScope,
    });
    if (!paid.ok) {
      setState((prev) => ({ ...prev, busy: false, error: paid.message }));
      return;
    }
    setState((prev) => ({ ...prev, needsCard: false, busy: false }));
    await checkout();
  }

  const primaryLabel = state.step === "complete" ? null : "Continue";

  return (
    <div className="fixed inset-0 z-[80]" role="presentation">
      <button
        type="button"
        aria-label="Close booking backdrop"
        className="absolute inset-0 bg-ink/45 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="absolute inset-0 flex flex-col bg-ivory md:inset-x-auto md:inset-y-8 md:left-1/2 md:w-[min(920px,calc(100vw-2rem))] md:-translate-x-1/2 md:rounded-sm md:border md:border-rule/50 md:shadow-2xl"
      >
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-rule/50 bg-white/90 px-4 py-3 backdrop-blur-sm md:px-6">
          <div>
            <p id={titleId} className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-ink">
              Book with Rella
            </p>
            <p className="mt-1 text-xs text-silver">
              Step {stepNumber} of {GUIDED_BOOKING_STEPS.length} ·{" "}
              {progressLabel(state.step)}
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="min-h-11 min-w-11 rounded-sm border border-rule/60 text-sm text-ink"
            aria-label="Close booking"
          >
            ✕
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_240px]">
            <div>
              {state.step === "location" ? (
                <LocationStep
                  selected={state.locationSlug}
                  onSelect={(slug) => patch(selectLocation(state, slug))}
                />
              ) : null}
              {state.step === "treatments" && state.locationSlug ? (
                <TreatmentsStep
                  clinic={state.clinic}
                  state={state}
                  loading={loadingCatalog}
                  onSearch={(value) => patch(setSearch(state, value))}
                  onToggleCategory={(category) =>
                    patch(toggleCategory(state, category))
                  }
                  onToggleTreatment={(slug) =>
                    patch(toggleTreatment(state, slug))
                  }
                />
              ) : null}
              {state.step === "review" ? (
                <ReviewStep
                  state={state}
                  onChangeTreatments={() => patch(goToStep(state, "treatments"))}
                />
              ) : null}
              {state.step === "provider" ? (
                <ProviderStep providerDisplayName={service?.providerDisplayName} />
              ) : null}
              {state.step === "datetime" ? (
                <DateTimeStep
                  dates={state.dates}
                  times={times}
                  timeZone={state.clinic?.timeZone ?? ""}
                  selectedDate={state.date}
                  selectedSlotId={state.slot?.id ?? null}
                  loading={state.busy || loadingTimes}
                  onSelectDate={(date) => {
                    void chooseDate(date);
                  }}
                  onSelectSlot={(slot) => patch(selectSlot(state, slot))}
                />
              ) : null}
              {state.step === "complete" ? (
                <CompleteStep
                  state={state}
                  submitting={state.busy}
                  onChange={(clientPatch) => patch(updateClient(state, clientPatch))}
                  onCheckout={() => {
                    void checkout();
                  }}
                  onPay={(card) => {
                    void pay(card);
                  }}
                />
              ) : null}
              {state.error ? (
                <p className="mt-4 text-sm text-rose" role="alert">
                  {state.error}
                </p>
              ) : null}
            </div>
            <div className="hidden lg:block">
              <VisitSummary
                state={state}
                editable={state.step === "treatments" || state.step === "review"}
                onRemove={() => patch(clearTreatment(state))}
              />
            </div>
          </div>
        </div>

        <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-rule/50 bg-white/95 px-4 py-3 backdrop-blur-sm md:px-6">
          <button
            type="button"
            onClick={() => patch(goBack(state))}
            disabled={!canGoBack(state)}
            className="min-h-11 px-3 text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-ink disabled:opacity-35"
          >
            Back
          </button>
          {primaryLabel ? (
            <button
              type="button"
              onClick={primaryAction}
              disabled={state.busy}
              className="rella-cta-rect rella-cta-rect--filled disabled:opacity-50"
            >
              {state.busy ? "Working…" : primaryLabel}
            </button>
          ) : (
            <span className="text-xs text-silver">Finish below</span>
          )}
        </footer>
      </div>
    </div>
  );
}
