"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import type { BookingIntent } from "@/lib/booking-routes";
import {
  bootstrapFromIntent,
  mapIntentToTreatmentKey,
  canGoBack,
  emitGuidedBookingEvent,
  goBack,
  goToStep,
  GUIDED_BOOKING_STEPS,
  progressLabel,
  removeTreatment,
  selectDate,
  selectLocation,
  selectProvider,
  selectSlot,
  setSearch,
  toggleCategory,
  toggleTreatment,
  updateClient,
  type AvailabilityResult,
  type GuidedBookingBackend,
  type GuidedBookingState,
  type GuidedProvider,
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
  backend,
  onClose,
}: {
  intent: BookingIntent;
  backend: GuidedBookingBackend;
  onClose: () => void;
}) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [state, setState] = useState<GuidedBookingState>(() =>
    bootstrapFromIntent(intent),
  );
  const submittingRef = useRef(false);
  const reservingRef = useRef(false);
  const [reservationUncertain, setReservationUncertain] = useState(false);
  const [providers, setProviders] = useState<GuidedProvider[]>([]);
  const [availability, setAvailability] = useState<AvailabilityResult | null>(
    null,
  );
  const [times, setTimes] = useState<GuidedSlot[]>([]);
  const [loadingMeta, setLoadingMeta] = useState(false);

  useEffect(() => {
    if (!state.locationSlug || !backend.listTreatments) return;
    const location = state.locationSlug;
    let cancelled = false;
    setLoadingMeta(true);
    setState(prev => ({ ...prev, treatments: [], selectedTreatmentKeys: [], error: null }));
    backend.listTreatments(location).then(treatments => {
      if (cancelled) return;
      const key = mapIntentToTreatmentKey({ ...intent, location, treatments });
      setState(prev => prev.locationSlug !== location ? prev : ({ ...prev, treatments,
        selectedTreatmentKeys: key ? [key] : [], step: key ? "review" : "treatments", expandedCategories: [] }));
    }).catch(error => {
      if (!cancelled) setState(prev => ({ ...prev, error: error instanceof Error ? error.message : "The booking menu could not load. Please call Rella." }));
    }).finally(() => { if (!cancelled) setLoadingMeta(false); });
    return () => { cancelled = true; };
  }, [backend, state.locationSlug, intent]);

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
    if (!state.locationSlug || state.selectedTreatmentKeys.length === 0) {
      setProviders([]);
      return;
    }
    if (state.step !== "provider") return;
    let cancelled = false;
    setLoadingMeta(true);
    backend
      .listProviders({
        locationSlug: state.locationSlug,
        treatmentKeys: state.selectedTreatmentKeys,
      })
      .then((list) => {
        if (!cancelled) { setProviders(list); setState(prev => ({ ...prev, quote: backend.quote?.() })); }
      })
      .catch(error => { if (!cancelled) setState(prev => ({ ...prev, error: error instanceof Error ? error.message : "Booking could not load. Please call Rella." })); })
      .finally(() => {
        if (!cancelled) setLoadingMeta(false);
      });
    return () => {
      cancelled = true;
    };
  }, [backend, state.locationSlug, state.selectedTreatmentKeys, state.step]);

  useEffect(() => {
    if (
      state.step !== "datetime" ||
      !state.locationSlug ||
      state.selectedTreatmentKeys.length === 0
    ) {
      return;
    }
    let cancelled = false;
    setLoadingMeta(true);
    setAvailability(null);
    setTimes([]);
    setReservationUncertain(false);
    setState(prev => ({ ...prev, date: "", slot: null, quote: undefined, availabilityUnverified: true, error: null }));
    backend
      .loadAvailability({
        locationSlug: state.locationSlug,
        treatmentKeys: state.selectedTreatmentKeys,
        providerId: state.providerId,
      })
      .then((result) => {
        if (!cancelled) {
          setAvailability(result);
          setState((prev) => ({
            ...prev,
            availabilityUnverified: !result.live,
            quote: backend.quote?.(),
          }));
        }
      })
      .catch(error => { if (!cancelled) setState(prev => ({ ...prev, error: error instanceof Error ? error.message : "Booking could not load. Please call Rella." })); })
      .finally(() => {
        if (!cancelled) setLoadingMeta(false);
      });
    return () => {
      cancelled = true;
    };
  }, [
    backend,
    state.step,
    state.locationSlug,
    state.selectedTreatmentKeys,
    state.providerId,
  ]);

  useEffect(() => {
    if (!state.date || !state.locationSlug) {
      setTimes([]);
      return;
    }
    let cancelled = false;
    setTimes([]);
    backend
      .loadTimesForDate({
        locationSlug: state.locationSlug,
        treatmentKeys: state.selectedTreatmentKeys,
        providerId: state.providerId,
        date: state.date,
      })
      .then((slots) => {
        if (!cancelled) setTimes(slots);
      }).catch(error => { if (!cancelled) setState(prev => ({ ...prev, error: error instanceof Error ? error.message : "Times could not load. Please call Rella." })); });
    return () => {
      cancelled = true;
    };
  }, [
    backend,
    state.date,
    state.locationSlug,
    state.selectedTreatmentKeys,
    state.providerId,
  ]);

  const patch = useCallback((next: GuidedBookingState) => {
    setState(next);
  }, []);

  const stepNumber = GUIDED_BOOKING_STEPS.indexOf(state.step) + 1;

  async function primaryAction() {
    if (loadingMeta || state.busy || reservingRef.current || (state.step === "datetime" && reservationUncertain)) return;
    switch (state.step) {
      case "location":
        if (!state.locationSlug) {
          patch({ ...state, error: "Choose a location to continue." });
          return;
        }
        patch(goToStep(state, "treatments"));
        return;
      case "treatments":
        if (state.selectedTreatmentKeys.length === 0) {
          patch({ ...state, error: "Add a treatment to continue." });
          return;
        }
        patch(goToStep(state, "review"));
        return;
      case "review":
        patch(goToStep(state, "provider"));
        return;
      case "provider":
        if (!state.providerId) {
          patch({ ...state, error: "Choose a provider to continue." });
          return;
        }
        patch(goToStep(state, "datetime"));
        return;
      case "datetime":
        // A verified slot must be reserved before collecting payment.
        if (!state.slot || (backend.mode === "live" && state.availabilityUnverified)) {
          patch({ ...state, error: "Choose a time to continue." });
          return;
        }
        if (backend.reserve && state.slot) {
          reservingRef.current = true;
          patch({ ...state, busy: true });
          try { await backend.reserve(state.slot); }
          catch { setReservationUncertain(true); patch({ ...state, busy: false, error: "We could not verify that time. Please call Rella before continuing." }); return; }
          finally { reservingRef.current = false; }
        }
        patch({ ...goToStep(state, "complete"), busy: false });
        return;
      case "complete":
        return;
      default: {
        const _exhaustive: never = state.step;
        return _exhaustive;
      }
    }
  }

  async function completeBooking(token?: string) {
    if (submittingRef.current || !backend.complete || !state.locationSlug || !state.slot) return;
    if (backend.mode === "live" && state.quote?.needsCard && !token) return;
    submittingRef.current = true;
    patch({ ...state, busy: true, error: null });
    try {
      if (token && backend.attachPayment) await backend.attachPayment(token);
      const result = await backend.complete({ locationSlug: state.locationSlug,
        treatmentKeys: state.selectedTreatmentKeys, providerId: state.providerId, slot: state.slot, client: state.client });
      if (!result.ok) { patch({ ...state, busy: false, error: result.reason }); return; }
      if (!result.pending) emitGuidedBookingEvent({ type: "booking_confirmed", confirmationId: result.confirmationId, at: Date.now() });
      patch({ ...state, busy: false, confirmationId: result.confirmationId, confirmationPending: result.pending, error: null });
    } catch {
      patch({ ...state, busy: false, error: "We could not verify your booking. Please call Rella before trying again." });
    } finally { submittingRef.current = false; }
  }

  const primaryLabel = state.step === "complete" ? null : "Continue";
  const selectedTreatment = state.treatments?.find((treatment) =>
    state.selectedTreatmentKeys.includes(treatment.key),
  );

  return (
    <div className="fixed inset-0 z-[80]" role="presentation">
      <button
        type="button"
        aria-label="Close booking backdrop"
        className="absolute inset-0 bg-ink/45 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        ref={dialogRef}
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
                  locationSlug={state.locationSlug}
                  state={state}
                  loading={loadingMeta}
                  onSearch={(value) => patch(setSearch(state, value))}
                  onToggleCategory={(category) =>
                    patch(toggleCategory(state, category))
                  }
                  onToggleTreatment={(key) =>
                    patch(toggleTreatment(state, key))
                  }
                />
              ) : null}
              {state.step === "review" ? (
                <ReviewStep
                  state={state}
                  onChangeTreatments={() =>
                    patch(goToStep(state, "treatments"))
                  }
                />
              ) : null}
              {state.step === "provider" ? (
                <ProviderStep
                  providers={providers}
                  selectedId={state.providerId}
                  loading={loadingMeta}
                  onSelect={(id) => patch(selectProvider(state, id))}
                />
              ) : null}
              {state.step === "datetime" ? (
                <DateTimeStep
                  availability={availability}
                  times={times}
                  selectedDate={state.date}
                  selectedSlotId={state.slot?.id ?? null}
                  loading={loadingMeta}
                  onSelectDate={(date) => patch(selectDate(state, date))}
                  onSelectSlot={(slot) => patch(selectSlot(state, slot))}
                />
              ) : null}
              {state.step === "complete" ? (
                <CompleteStep
                  state={state}
                  mode={backend.mode}
                  submitting={state.busy}
                  onChange={(clientPatch) =>
                    patch(updateClient(state, clientPatch))
                  }
                  onMockComplete={completeBooking}
                  cardFrameOrigin={backend.cardFrameOrigin?.()}
                  onLiveComplete={completeBooking}
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
                onRemove={(key) => patch(removeTreatment(state, key))}
              />
            </div>
          </div>
        </div>

        <footer className="shrink-0 border-t border-rule/50 bg-white/95 px-4 py-3 backdrop-blur-sm md:px-6">
          <div role="status" aria-live="polite" aria-atomic="true">
            {state.step === "treatments" && selectedTreatment ? (
              <div className="mb-3 flex items-center justify-between gap-3 rounded-sm border border-rose/50 bg-ivory px-3 py-2">
                <div className="min-w-0">
                  <p className="text-[0.625rem] font-bold uppercase tracking-[0.14em] text-ink/60">
                    <span aria-hidden="true">✓ </span>Treatment added
                  </p>
                  <p className="mt-1 truncate text-sm font-medium text-ink">
                    {selectedTreatment.displayName}
                  </p>
                </div>
                <button
                  type="button"
                  className="min-h-11 shrink-0 text-[0.625rem] font-bold uppercase tracking-[0.14em] text-rose"
                  aria-label={`Remove ${selectedTreatment.displayName}`}
                  onClick={() => patch(removeTreatment(state, selectedTreatment.key))}
                >
                  Remove
                </button>
              </div>
            ) : null}
          </div>
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => patch(goBack(state))}
              disabled={state.busy || !canGoBack(state)}
              className="min-h-11 px-3 text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-ink disabled:opacity-35"
            >
              Back
            </button>
            {primaryLabel ? (
              <button
                type="button"
                onClick={primaryAction}
                disabled={loadingMeta || state.busy || (state.step === "datetime" && reservationUncertain)}
                className="rella-cta-rect rella-cta-rect--filled"
              >
                {primaryLabel}
              </button>
            ) : (
              <span className="text-xs text-silver">Finish below</span>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}
