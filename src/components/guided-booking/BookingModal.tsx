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
  const [providers, setProviders] = useState<GuidedProvider[]>([]);
  const [availability, setAvailability] = useState<AvailabilityResult | null>(
    null,
  );
  const [times, setTimes] = useState<GuidedSlot[]>([]);
  const [loadingMeta, setLoadingMeta] = useState(false);

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
    if (state.step !== "provider" && state.step !== "datetime") return;
    let cancelled = false;
    setLoadingMeta(true);
    backend
      .listProviders({
        locationSlug: state.locationSlug,
        treatmentKeys: state.selectedTreatmentKeys,
      })
      .then((list) => {
        if (!cancelled) setProviders(list);
      })
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
          }));
        }
      })
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
    backend
      .loadTimesForDate({
        locationSlug: state.locationSlug,
        treatmentKeys: state.selectedTreatmentKeys,
        providerId: state.providerId,
        date: state.date,
      })
      .then((slots) => {
        if (!cancelled) setTimes(slots);
      });
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
        // Handoff mode: allow continue without a live slot.
        if (backend.mode === "mock" && !state.slot) {
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

  async function mockComplete() {
    if (!backend.complete || !state.locationSlug || !state.slot) return;
    patch({ ...state, busy: true, error: null });
    const result = await backend.complete({
      locationSlug: state.locationSlug,
      treatmentKeys: state.selectedTreatmentKeys,
      providerId: state.providerId,
      slot: state.slot,
      client: state.client,
    });
    if (!result.ok) {
      patch({ ...state, busy: false, error: result.reason });
      return;
    }
    emitGuidedBookingEvent({
      type: "booking_confirmed",
      confirmationId: result.confirmationId,
      at: Date.now(),
    });
    patch({
      ...state,
      busy: false,
      confirmationId: result.confirmationId,
      error: null,
    });
  }

  function handleHandoff(url: string) {
    const serviceSlug = state.selectedTreatmentKeys[0]?.split("/")[1];
    if (!state.locationSlug || !serviceSlug) return;
    emitGuidedBookingEvent({
      type: "booking_handoff",
      locationSlug: state.locationSlug,
      serviceSlug,
      at: Date.now(),
    });
    void url;
  }

  const primaryLabel =
    state.step === "complete"
      ? null
      : state.step === "datetime" && backend.mode === "handoff"
        ? "Continue"
        : "Continue";

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
                  onMockComplete={mockComplete}
                  onHandoff={handleHandoff}
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
              className="rella-cta-rect rella-cta-rect--filled"
            >
              {primaryLabel}
            </button>
          ) : (
            <span className="text-xs text-silver">Finish below</span>
          )}
        </footer>
      </div>
    </div>
  );
}
