"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { BookingLocation } from "@/lib/booking-routes";
import { initialGuidedBookingState } from "@/lib/guided-booking/machine";
import {
  createPackageIdentityClient,
  PackageRequestError,
  restorePackageWallet,
  type PackageAuthentication,
  type PackageClient,
  type PackageContact,
  type PackageIdentityClient,
  type PackageIntent,
  type PackageOffering,
  type PackagePurchaseReview,
} from "@/lib/guided-booking/package-client";
import { PackageIdentityForm } from "./PackageIdentityForm";
import { PackagePanel, type PackagePanelView } from "./PackagePanel";

type View = Exclude<PackagePanelView, { step: "verify-ownership" }> | { step: "verify-ownership"; location: BookingLocation };

export interface PackageExperienceProps {
  client: PackageClient;
  identityClient?: PackageIdentityClient;
  initialLocation?: BookingLocation;
  initialIntent?: PackageIntent;
  initialOfferingId?: string;
  beforeBookOwned?(location: BookingLocation): Promise<void>;
  beforeIdentityChange?(): Promise<void>;
  onClose(): void;
  onBookOwned(input: { location: BookingLocation; serviceKey: string }): Promise<void>;
}

/** Uses the booking modal's existing visual system; package purchases have their own server session. */
export function PackageExperience({ client, identityClient: providedIdentity, initialLocation, initialIntent, initialOfferingId, beforeBookOwned, beforeIdentityChange, onClose, onBookOwned }: PackageExperienceProps) {
  const [identity] = useState(() => providedIdentity ?? createPackageIdentityClient());
  const [view, setView] = useState<View>(() => initialIntent && initialLocation
    ? initialIntent === "buy" ? { step: "catalog", location: initialLocation, offerings: [], loading: true }
      : { step: "verify-ownership", location: initialLocation }
    : initialIntent ? { step: "location", intent: initialIntent } : { step: "intent" });
  const [mode, setMode] = useState<PackageIntent>(initialIntent ?? "buy");
  const [location, setLocation] = useState<BookingLocation | undefined>(initialLocation);
  const [offerings, setOfferings] = useState<PackageOffering[]>([]);
  const [review, setReview] = useState<PackagePurchaseReview>();
  const [contact, setContact] = useState<PackageContact>(() => ({ ...initialGuidedBookingState.client }));
  const [authentication, setAuthentication] = useState<PackageAuthentication | null>(null);
  const [busy, setBusy] = useState(Boolean(initialIntent && initialLocation));
  const [error, setError] = useState<string | null>(null);
  const action = useRef(false);
  const newPurchaseAuthorized = useRef(false);
  const titleId = useId();
  const dialog = useRef<HTMLDivElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const content = useRef<HTMLDivElement>(null);

  useEffect(() => {
    close.current?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") { event.preventDefault(); onClose(); }
      if (event.key !== "Tab") return;
      const controls = dialog.current?.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), iframe, a[href], [tabindex="0"]');
      if (!controls?.length) return;
      const first = controls[0]; const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => { if (content.current) content.current.scrollTop = 0; }, [view.step]);

  useEffect(() => {
    if (!initialIntent || !initialLocation) return;
    let cancelled = false;
    void (async () => {
      try {
        if (initialIntent === "redeem") {
          const wallet = await restorePackageWallet(identity, initialLocation);
          if (!cancelled) {
            setAuthentication(wallet ? { state: "AUTHENTICATED", profile: wallet.profile } : null);
            setView(wallet ? { step: "owned", location: initialLocation, wallet } : { step: "verify-ownership", location: initialLocation });
          }
          return;
        }
        const status = await client.status();
        if (cancelled) return;
        if (status.state === "PENDING" || status.state === "PAYMENT_READY") { setView({ step: "pending" }); return; }
        if (status.state === "CONFIRMED") { setView({ step: "confirmed", confirmationId: status.confirmationId }); return; }
        const packages = await client.listOfferings(initialLocation);
        if (cancelled) return;
        setOfferings(packages);
        if (initialOfferingId) {
          const selected = await client.reviewPurchase({ location: initialLocation, packageId: initialOfferingId });
          if (!cancelled) { setReview(selected); setView({ step: "review", location: initialLocation, review: selected }); }
        } else setView({ step: "catalog", location: initialLocation, offerings: packages, loading: false });
      } catch (cause) {
        if (!cancelled) setError(cause instanceof Error ? cause.message : "Packages could not load. Please call Rella.");
      } finally { if (!cancelled) setBusy(false); }
    })();
    return () => { cancelled = true; };
  }, [client, identity, initialIntent, initialLocation, initialOfferingId]);

  async function run(work: () => Promise<void>) {
    if (action.current) return;
    action.current = true;
    setBusy(true); setError(null);
    try { await work(); }
    catch (cause) {
      if (client.verificationPending()) setView({ step: "pending" });
      if (cause instanceof PackageRequestError && cause.reason === "identity_required") {
        setAuthentication(null);
        if (location) setView({ step: "verify-ownership", location });
      }
      else setError(cause instanceof Error ? cause.message : "The request could not be verified. Please call Rella.");
    } finally { action.current = false; setBusy(false); }
  }

  async function loadPurchaseCatalog(next: BookingLocation) {
    if (!newPurchaseAuthorized.current) {
      const status = await client.status();
      if (status.state === "PENDING" || status.state === "PAYMENT_READY") { setView({ step: "pending" }); return; }
      if (status.state === "CONFIRMED") { setView({ step: "confirmed", confirmationId: status.confirmationId }); return; }
    }
    const packages = await client.listOfferings(next);
    setOfferings(packages);
    setView({ step: "catalog", location: next, offerings: packages, loading: false });
  }

  async function showWallet(next: BookingLocation) {
    const wallet = await identity.owned(next);
    setView({ step: "owned", location: next, wallet });
  }

  async function restoreWallet(next: BookingLocation) {
    const wallet = await restorePackageWallet(identity, next);
    setAuthentication(wallet ? { state: "AUTHENTICATED", profile: wallet.profile } : null);
    setView(wallet ? { step: "owned", location: next, wallet } : { step: "verify-ownership", location: next });
  }

  async function acceptAuthentication(next: PackageAuthentication) {
    setAuthentication(next);
    if (next.state === "AUTHENTICATED" && location) await showWallet(location);
  }

  function back() {
    if (busy || view.step === "pending" || view.step === "confirmed") return;
    setError(null);
    if (view.step === "purchase" && review && location) setView({ step: "contact", location, review, contact });
    else if (view.step === "contact" && review && location) setView({ step: "review", location, review });
    else if (view.step === "review" && location) setView({ step: "catalog", location, offerings, loading: false });
    else if (view.step === "catalog" || view.step === "verify-ownership" || view.step === "owned") setView({ step: "location", intent: mode });
    else if (view.step === "location") setView({ step: "intent" });
    else onClose();
  }

  const authenticationKey = authentication?.state === "PROFILE_REQUIRED" || authentication?.state === "DOB_REQUIRED"
    ? `${authentication.state}/${authentication.profiles.map(profile => profile.id).join("/")}` : authentication?.state ?? "request";
  const panelView: PackagePanelView = view.step === "verify-ownership" ? { ...view, verification: <><PackageIdentityForm
    key={authenticationKey} authentication={authentication} busy={busy}
    onRequestCode={input => run(async () => { await beforeIdentityChange?.(); await acceptAuthentication(await identity.sendCode(input)); })}
    onVerifyCode={code => run(async () => acceptAuthentication(await identity.verifyCode(code)))}
    onProfile={input => run(async () => acceptAuthentication(await identity.selectProfile(input)))}
  />{authentication?.state === "AUTHENTICATED" ? <button type="button" disabled={busy} onClick={() => { if (location) void run(() => showWallet(location)); }} className="min-h-11 text-sm text-rose disabled:opacity-50">Load my packages</button> : null}</> } : view;

  return <div className="fixed inset-0 z-[80]" role="presentation">
    <button type="button" aria-label="Close package backdrop" className="absolute inset-0 bg-ink/45 backdrop-blur-[2px]" onClick={onClose} />
    <div ref={dialog} role="dialog" aria-modal="true" aria-labelledby={titleId}
      className="absolute inset-0 flex flex-col bg-ivory md:inset-x-auto md:inset-y-8 md:left-1/2 md:w-[min(920px,calc(100vw-2rem))] md:-translate-x-1/2 md:rounded-sm md:border md:border-rule/50 md:shadow-2xl">
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-rule/50 bg-white/90 px-4 py-3 backdrop-blur-sm md:px-6">
        <div><p id={titleId} className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-ink">Packages with Rella</p><p className="mt-1 text-xs text-silver">{mode === "buy" ? "Package purchase" : "Book from your package"}</p></div>
        <button ref={close} type="button" onClick={onClose} className="min-h-11 min-w-11 rounded-sm border border-rule/60 text-sm text-ink" aria-label="Close packages">✕</button>
      </header>
      <div ref={content} className="min-h-0 flex-1 overflow-y-auto px-4 py-5 md:px-6">
        <PackagePanel view={panelView} busy={busy} error={error}
          onIntent={intent => { setMode(intent); setView({ step: "location", intent }); }}
          onLocation={next => { setLocation(next); void run(async () => {
            if (mode === "buy") await loadPurchaseCatalog(next);
            else await restoreWallet(next);
          }); }}
          onOffering={packageId => { if (location) void run(async () => {
            const selected = await client.reviewPurchase({ location, packageId }); setReview(selected); setView({ step: "review", location, review: selected });
          }); }}
          onReviewContinue={() => { if (location && review) setView({ step: "contact", location, review, contact }); }}
          onContact={patch => { const next = { ...contact, ...patch }; setContact(next); if (view.step === "contact") setView({ ...view, contact: next }); }}
          onPrepare={() => run(async () => {
            const next = await client.preparePurchase(contact); setReview(next); if (location) setView({ step: "purchase", location, review: next, contact });
          })}
          onPurchase={token => run(async () => {
            const result = await client.purchase({ client: contact, token });
            setView(result.status === "confirmed" ? { step: "confirmed", confirmationId: result.confirmationId } : { step: "pending" });
          })}
          onOwnedSession={(voucherId, serviceKey) => { if (location) void run(async () => {
            await beforeBookOwned?.(location);
            const selected = await identity.bookOwned({ location, voucherId, serviceKey }); await onBookOwned(selected);
          }); }}
        />
        {view.step === "confirmed" ? <button type="button" disabled={busy} className="mt-5 min-h-11 rounded-full border border-rose bg-rose px-8 py-3.5 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-white disabled:opacity-50"
          onClick={() => void run(async () => {
            if (!client.resetConfirmed()) return;
            newPurchaseAuthorized.current = true; setMode("buy");
            if (location) await loadPurchaseCatalog(location); else setView({ step: "location", intent: "buy" });
          })}>Buy another package</button> : null}
        {view.step === "owned" ? <button type="button" disabled={busy} onClick={() => void run(async () => { await beforeIdentityChange?.(); await identity.logout(); setAuthentication(null); if (location) setView({ step: "verify-ownership", location }); })}
          className="mt-5 min-h-11 text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-rose disabled:opacity-50">Use a different account</button> : null}
      </div>
      <footer className="shrink-0 border-t border-rule/50 bg-white/95 px-4 py-3 backdrop-blur-sm md:px-6">
        <button type="button" onClick={back} disabled={busy || view.step === "pending" || view.step === "confirmed"} className="min-h-11 px-3 text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-ink disabled:opacity-35">Back</button>
      </footer>
    </div>
  </div>;
}
