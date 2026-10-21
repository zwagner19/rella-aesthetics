"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import type { BookingIntent } from "@/lib/booking-routes";
import type { BookingLocation } from "@/lib/booking-routes";
import { createSharedPackageClient, type PackageIntent, type PackageOffering } from "@/lib/guided-booking/package-client";
import {
  bootstrapFromIntent,
  mapIntentToTreatmentKey,
  canGoBack,
  emitGuidedBookingEvent,
  goBack,
  goToStep,
  GUIDED_BOOKING_STEPS,
  progressLabel,
  providersComplete,
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
  type GuidedProviderGroup,
  type GuidedSlot,
  type GuidedTreatment,
} from "@/lib/guided-booking";
import { VisitSummary } from "./VisitSummary";
import { LocationStep } from "./steps/LocationStep";
import { TreatmentsStep } from "./steps/TreatmentsStep";
import { ReviewStep } from "./steps/ReviewStep";
import { ProviderStep } from "./steps/ProviderStep";
import { DateTimeStep } from "./steps/DateTimeStep";
import { CompleteStep } from "./steps/CompleteStep";
import { PackageExperience } from "./PackageExperience";

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
  const contentRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [packageClient] = useState(() => createSharedPackageClient());
  const [packageRequest, setPackageRequest] = useState<{ intent: PackageIntent; offeringId?: string } | null>(null);
  const [packageOfferings, setPackageOfferings] = useState<PackageOffering[]>([]);
  const [packagesLoading, setPackagesLoading] = useState(false);
  const [packageError, setPackageError] = useState<string | null>(null);
  const preparedOwnedMenu = useRef<{ location: BookingLocation; treatments: GuidedTreatment[] } | null>(null);
  const skipOwnedMenuLoad = useRef<BookingLocation | null>(null);
  const closePackages = useCallback(() => setPackageRequest(null), []);
  const [state, setState] = useState<GuidedBookingState>(() => ({
    ...bootstrapFromIntent(intent),
    ...(backend.verificationPending?.() ? { step: "complete" as const, confirmationId: "pending", confirmationPending: true } : {}),
  }));
  const submittingRef = useRef(false);
  const reservingRef = useRef(false);
  const [reservationUncertain, setReservationUncertain] = useState(false);
  const [providerGroups, setProviderGroups] = useState<GuidedProviderGroup[]>([]);
  const [availability, setAvailability] = useState<AvailabilityResult | null>(
    null,
  );
  const [times, setTimes] = useState<GuidedSlot[]>([]);
  const [loadingMeta, setLoadingMeta] = useState(false);
  const allProvidersChosen = providersComplete(state);

  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [state.step]);

  useEffect(() => {
    if (backend.verificationPending?.()) {
      setState(prev => prev.confirmationPending ? prev : ({ ...prev, step: "complete", confirmationId: "pending", confirmationPending: true }));
      return;
    }
    if (!state.locationSlug || !backend.listTreatments) return;
    const location = state.locationSlug;
    if (skipOwnedMenuLoad.current === location) { skipOwnedMenuLoad.current = null; return; }
    let cancelled = false;
    setLoadingMeta(true);
    setState(prev => ({ ...prev, treatments: [], selectedTreatmentKeys: [], providerIds: {}, schedule: undefined,
      reservationExpiresAt: undefined, quote: undefined, date: "", slot: null, availabilityUnverified: true, error: null }));
    backend.listTreatments(location).then(treatments => {
      if (cancelled) return;
      if (backend.verificationPending?.()) {
        setState(prev => ({ ...prev, step: "complete", confirmationId: "pending", confirmationPending: true }));
        return;
      }
      const key = mapIntentToTreatmentKey({ ...intent, location, treatments });
      setState(prev => prev.locationSlug !== location ? prev : ({ ...prev, treatments,
        selectedTreatmentKeys: key ? [key] : [], step: key ? "review" : "treatments" }));
    }).catch(error => {
      if (!cancelled) setState(prev => ({ ...prev, error: error instanceof Error ? error.message : "The booking menu could not load. Please call Rella." }));
    }).finally(() => { if (!cancelled) setLoadingMeta(false); });
    return () => { cancelled = true; };
  }, [backend, state.locationSlug, intent]);

  useEffect(() => {
    if (!state.locationSlug) return;
    let cancelled = false;
    setPackageOfferings([]); setPackagesLoading(true); setPackageError(null);
    packageClient.listOfferings(state.locationSlug).then(offerings => {
      if (!cancelled) setPackageOfferings(offerings);
    }).catch(() => {
      if (!cancelled) setPackageError("Packages could not load. Please call Rella for help with a package.");
    }).finally(() => { if (!cancelled) setPackagesLoading(false); });
    return () => { cancelled = true; };
  }, [packageClient, state.locationSlug]);

  useEffect(() => { if (!packageRequest) closeRef.current?.focus(); }, [packageRequest]);

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
      if (event.key === "Escape" && !packageRequest) onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, packageRequest]);

  useEffect(() => {
    if (!state.locationSlug || state.selectedTreatmentKeys.length === 0) {
      setProviderGroups([]);
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
        if (!cancelled) { setProviderGroups(list); }
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
      !allProvidersChosen
    ) {
      return;
    }
    let cancelled = false;
    setLoadingMeta(true);
    setAvailability(null);
    setTimes([]);
    setReservationUncertain(false);
    setState(prev => ({ ...prev, date: "", slot: null, quote: undefined, schedule: undefined,
      reservationExpiresAt: undefined, availabilityUnverified: true, error: null }));
    backend
      .loadAvailability({
        locationSlug: state.locationSlug,
        treatmentKeys: state.selectedTreatmentKeys,
        providerIds: state.providerIds,
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
    allProvidersChosen,
    state.step,
    state.locationSlug,
    state.selectedTreatmentKeys,
    state.providerIds,
  ]);

  useEffect(() => {
    if (state.step !== "datetime" || !state.date || !state.locationSlug) {
      setTimes([]);
      return;
    }
    let cancelled = false;
    setTimes([]);
    backend
      .loadTimesForDate({
        locationSlug: state.locationSlug,
        treatmentKeys: state.selectedTreatmentKeys,
        providerIds: state.providerIds,
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
    state.step,
    state.date,
    state.locationSlug,
    state.selectedTreatmentKeys,
    state.providerIds,
  ]);

  useEffect(() => {
    const expiresAt = state.reservationExpiresAt;
    if (!expiresAt || state.step !== "complete" || state.confirmationId) return;
    const delay = Math.max(0, Date.parse(expiresAt) - Date.now());
    const timer = setTimeout(() => setState(prev => {
      if (prev.reservationExpiresAt !== expiresAt || prev.confirmationId) return prev;
      return { ...prev, schedule: undefined, quote: undefined, slot: null,
        reservationExpiresAt: undefined, availabilityUnverified: true,
        error: "Your appointment hold has expired. Go back to choose a new time before continuing." };
    }), Math.min(delay, 2_147_483_647));
    return () => clearTimeout(timer);
  }, [state.reservationExpiresAt, state.step, state.confirmationId]);

  const patch = useCallback((next: GuidedBookingState) => {
    backend.setOwnedPackageContext?.(Boolean(next.ownedPackageServiceKey));
    setState(next);
  }, [backend]);

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
        if (!providersComplete(state)) {
          patch({ ...state, error: "Choose a provider for each treatment to continue." });
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
          try {
            const reservation = await backend.reserve(state.slot);
            patch({ ...goToStep(state, "complete"), busy: false, schedule: reservation.schedule,
              quote: reservation.quote, reservationExpiresAt: reservation.expiresAt });
            return;
          }
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
      await backend.recordConsent?.(state.client);
      if (token && backend.attachPayment) await backend.attachPayment(token);
      const result = await backend.complete({ locationSlug: state.locationSlug,
        treatmentKeys: state.selectedTreatmentKeys, providerIds: state.providerIds, slot: state.slot, client: state.client });
      if (!result.ok) { setState(prev => ({ ...prev, busy: false, error: result.reason })); return; }
      if (!result.pending) emitGuidedBookingEvent({ type: "booking_confirmed", confirmationId: result.confirmationId, at: Date.now() });
      setState(prev => ({ ...prev, busy: false, confirmationId: result.confirmationId, confirmationPending: result.pending, error: null }));
    } catch {
      setState(prev => ({ ...prev, busy: false, error: "We could not verify your booking. Please call Rella before trying again." }));
    } finally { submittingRef.current = false; }
  }

  const primaryLabel = state.step === "complete" ? null : "Continue";
  const selectedTreatments = state.selectedTreatmentKeys.flatMap(key => {
    const treatment = state.treatments?.find(item => item.key === key);
    return treatment ? [treatment] : [];
  });

  if (packageRequest) return <PackageExperience
    client={packageClient} initialIntent={packageRequest.intent} initialLocation={state.locationSlug ?? undefined}
    initialOfferingId={packageRequest.offeringId} onClose={closePackages}
    beforeIdentityChange={async () => {
      if (!backend.prepareIdentityChange && backend.mode === "live") throw new Error("The existing appointment could not be verified. Please call Rella before changing accounts.");
      await backend.prepareIdentityChange?.();
      setState(prev => ({ ...prev, selectedTreatmentKeys: [], ownedPackageServiceKey: undefined, providerIds: {},
        quote: undefined, schedule: undefined, reservationExpiresAt: undefined, date: "", slot: null, step: "treatments",
        availabilityUnverified: true, error: null }));
    }}
    beforeBookOwned={async location => {
      if (backend.verificationPending?.()) throw new Error("Please call Rella to verify your existing booking before continuing.");
      const treatments = await backend.listTreatments?.(location) ?? state.treatments ?? [];
      if (!treatments.length) throw new Error("Package treatments could not be verified at this clinic. Please call Rella.");
      preparedOwnedMenu.current = { location, treatments };
    }}
    onBookOwned={async selected => {
      const menu = preparedOwnedMenu.current;
      if (!menu || menu.location !== selected.location || !menu.treatments.some(treatment => treatment.key === selected.serviceKey)) {
        throw new Error("This package treatment is no longer available for online booking. Please call Rella.");
      }
      backend.setOwnedPackageContext?.(true);
      if (state.locationSlug !== selected.location) skipOwnedMenuLoad.current = selected.location;
      setState(prev => ({ ...prev, locationSlug: selected.location, treatments: menu.treatments,
        selectedTreatmentKeys: [selected.serviceKey], ownedPackageServiceKey: selected.serviceKey, providerIds: {},
        quote: undefined, schedule: undefined, reservationExpiresAt: undefined, date: "", slot: null,
        availabilityUnverified: true, confirmationId: null, confirmationPending: false, error: null, step: "review" }));
      setPackageRequest(null);
    }}
  />;

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

        <div ref={contentRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-5 md:px-6">
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
                  packageOfferings={packageOfferings}
                  packagesLoading={packagesLoading}
                  packageError={packageError}
                  onBuyPackage={offeringId => setPackageRequest({ intent: "buy", offeringId })}
                  onBookPackage={() => setPackageRequest({ intent: "redeem" })}
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
                  groups={providerGroups.map(group => ({ ...group,
                    displayName: state.treatments?.find(item => item.key === group.treatmentKey)?.displayName ?? "Selected treatment",
                  }))}
                  selectedIds={state.providerIds}
                  loading={loadingMeta}
                  onSelect={(key, id) => patch(selectProvider(state, key, id))}
                />
              ) : null}
              {state.step === "datetime" ? (
                <DateTimeStep
                  availability={availability}
                  times={times}
                  selectedDate={state.date}
                  selectedSlotId={state.slot?.id ?? null}
                  loading={loadingMeta || state.busy}
                  onSelectDate={(date) => patch(selectDate(state, date))}
                  onSelectSlot={(slot) => patch(selectSlot(state, slot))}
                />
              ) : null}
              {state.step === "complete" ? (
                <>
                {state.schedule?.length ? <div className="mb-5 lg:hidden"><VisitSummary state={state} editable={false} /></div> : null}
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
                </>
              ) : null}
              {state.error ? (
                <p className="mt-4 text-sm text-rose" role="alert">
                  {state.error}
                </p>
              ) : null}
            </div>
            <div className="hidden lg:block">
              {!state.confirmationPending || selectedTreatments.length > 0 ? (
              <VisitSummary
                state={state}
                editable={state.step === "treatments" || state.step === "review"}
                onRemove={(key) => patch(removeTreatment(state, key))}
              />
              ) : null}
            </div>
          </div>
        </div>

        <footer className="shrink-0 border-t border-rule/50 bg-white/95 px-4 py-3 backdrop-blur-sm md:px-6">
          <div role="status" aria-live="polite" aria-atomic="true">
            {state.step === "treatments" && selectedTreatments.length > 0 ? (
              <details className="mb-3 max-h-[max(4rem,calc(100dvh-22rem))] overflow-y-auto rounded-sm border border-rose/50 bg-ivory px-3 py-2">
                <summary className="flex cursor-pointer items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[0.625rem] font-bold uppercase tracking-[0.14em] text-ink/60">
                    <span aria-hidden="true">✓ </span>{selectedTreatments.length === 1 ? "Treatment added" : `${selectedTreatments.length} treatments added`}
                  </p>
                  <p className="mt-1 truncate text-sm font-medium text-ink">
                    {selectedTreatments.map(treatment => treatment.displayName).join(" · ")}
                  </p>
                </div>
                <span className="shrink-0 text-[0.625rem] font-bold uppercase tracking-[0.14em] text-rose">View</span>
                </summary>
                <ul className="mt-2 max-h-36 space-y-2 overflow-y-auto">
                {selectedTreatments.map(treatment => <li key={treatment.key} className="flex items-center justify-between gap-3">
                <span className="text-sm text-ink">{treatment.displayName}</span>
                <button
                  type="button"
                  className="min-h-11 shrink-0 text-[0.625rem] font-bold uppercase tracking-[0.14em] text-rose"
                  aria-label={`Remove ${treatment.displayName}`}
                  onClick={() => patch(removeTreatment(state, treatment.key))}
                >
                  Remove
                </button>
                </li>)}
                </ul>
              </details>
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
