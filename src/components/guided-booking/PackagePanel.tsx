"use client";

import type { ReactNode } from "react";
import type { BookingLocation } from "@/lib/booking-routes";
import { GUIDED_LOCATIONS } from "@/lib/guided-booking/catalog";
import { clientLooksComplete } from "@/lib/guided-booking/machine";
import {
  formatPackageTotal,
  packageMenuLabel,
  type OwnedPackageWallet,
  type PackageContact,
  type PackageIntent,
  type PackageOffering,
  type PackagePurchaseReview,
} from "@/lib/guided-booking/package-client";
import { SecureCardFrame } from "./SecureCardFrame";

export type PackagePanelView =
  | { step: "intent" }
  | { step: "location"; intent: PackageIntent }
  | { step: "catalog"; location: BookingLocation; offerings: PackageOffering[]; loading: boolean }
  | { step: "review"; location: BookingLocation; review: PackagePurchaseReview }
  | { step: "contact"; location: BookingLocation; review: PackagePurchaseReview; contact: PackageContact }
  | { step: "purchase"; location: BookingLocation; review: PackagePurchaseReview; contact: PackageContact }
  | { step: "verify-ownership"; location: BookingLocation; verification: ReactNode }
  | { step: "owned"; location: BookingLocation; wallet: OwnedPackageWallet }
  | { step: "pending" }
  | { step: "confirmed"; confirmationId: string };

export interface PackagePanelProps {
  view: PackagePanelView;
  busy?: boolean;
  error?: string | null;
  onIntent(intent: PackageIntent): void;
  onLocation(location: BookingLocation): void;
  onOffering(packageId: string): void;
  onReviewContinue(): void;
  onContact(patch: Partial<PackageContact>): void;
  onPrepare(): Promise<void>;
  onPurchase(token?: string): Promise<void>;
  onOwnedSession(packageId: string, sessionId: string): void;
}

const actionClass = "min-h-11 rounded-full border-[1.5px] border-rose bg-rose px-8 py-3.5 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-white disabled:opacity-50";
const inputClass = "min-h-11 w-full rounded-sm border border-rule/70 bg-white px-3 py-2.5 text-base text-ink outline-none focus:border-ink sm:text-sm";

function PackageBenefits({ offering }: { offering: PackageOffering }) {
  return offering.benefitGroups.length ? (
    <ul className="space-y-3 text-sm font-light text-silver">
      {offering.benefitGroups.map((group, index) => (
        <li key={index}>
          <span className="font-medium text-ink">{group.quantity} {group.quantity === 1 ? "session" : "sessions"}</span>
          {" of "}
          {group.alternatives.map((label, alternative) => (
            <span key={alternative}>{alternative > 0 ? <span className="font-medium text-ink"> or </span> : null}{label}</span>
          ))}
        </li>
      ))}
    </ul>
  ) : null;
}

function PackageReview({ review }: { review: PackagePurchaseReview }) {
  const total = formatPackageTotal(review);
  return (
    <div className="space-y-4 rounded-sm border border-rule/60 bg-ivory px-4 py-4">
      <h4 className="font-medium text-ink">{review.offering.displayName}</h4>
      {review.offering.description ? <p className="text-sm font-light text-silver">{review.offering.description}</p> : null}
      <PackageBenefits offering={review.offering} />
      {total ? <p className="text-sm font-medium text-ink">Package purchase total: {total}</p>
        : <p role="alert" className="text-sm text-rose">The package total could not be verified. Please call Rella.</p>}
    </div>
  );
}

/** Controlled by the verified package adapter; does not create carts or infer ownership. */
export function PackagePanel({ view, busy = false, error, onIntent, onLocation, onOffering, onReviewContinue, onContact, onPrepare, onPurchase, onOwnedSession }: PackagePanelProps) {
  if (view.step === "pending" || view.step === "confirmed") {
    return <div className="space-y-4" role="status">
      <h3 className="text-xl font-medium tracking-[-0.02em] text-ink">{view.step === "pending" ? "Package verification pending" : "Package purchase confirmed"}</h3>
      <p className="text-sm font-light text-silver">{view.step === "pending"
        ? "Please call Rella to verify your package purchase before trying again."
        : "Your package purchase has been confirmed by Rella’s booking system."}</p>
    </div>;
  }

  const heading = view.step === "intent" ? "Packages"
    : view.step === "location" ? "Choose your clinic"
      : view.step === "catalog" ? "Choose a package"
        : view.step === "review" ? "Review your package"
          : view.step === "contact" ? "Your contact details"
            : view.step === "purchase" ? "Complete your package purchase"
            : view.step === "verify-ownership" ? "Find your package"
              : "Book from your package";

  return <div className="space-y-5" aria-busy={busy}>
    <h3 className="text-xl font-medium tracking-[-0.02em] text-ink">{heading}</h3>
    {view.step === "intent" ? <div className="grid gap-3 sm:grid-cols-2">
      <button type="button" disabled={busy} onClick={() => onIntent("buy")} className={actionClass}>Buy a package</button>
      <button type="button" disabled={busy} onClick={() => onIntent("redeem")} className={actionClass}>Book from my package</button>
    </div> : null}
    {view.step === "location" ? <div className="grid gap-3 sm:grid-cols-2">
      {GUIDED_LOCATIONS.map(location => <button key={location.slug} type="button" disabled={busy} onClick={() => onLocation(location.slug)}
        className="min-h-11 rounded-sm border border-rule/70 bg-white px-5 py-5 text-left text-ink transition-colors hover:border-ink/40 disabled:opacity-50">
        <span className="block text-[0.6875rem] font-bold uppercase tracking-[0.16em] opacity-70">{location.slug === "napa" ? "Napa" : "Vacaville"}</span>
        <span className="mt-2 block text-base font-medium">{location.displayName}</span>
        <span className="mt-1 block text-sm font-light text-silver">{location.addressLine}</span>
      </button>)}
    </div> : null}
    {view.step === "catalog" ? (
      view.loading ? <p className="text-sm text-silver" role="status">Loading packages…</p>
        : view.offerings.length ? <ul className="divide-y divide-rule/40 overflow-hidden rounded-sm border border-rule/60 bg-white">
          {view.offerings.map(offering => <li key={offering.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
            <p className="min-w-0 flex-1 font-medium text-ink">{packageMenuLabel(offering.displayName)}</p>
            <button type="button" disabled={busy || offering.reviewRequired} onClick={() => onOffering(offering.id)} aria-label={`Review ${packageMenuLabel(offering.displayName)}`} className={actionClass}>{offering.reviewRequired ? "Call to purchase" : "View package"}</button>
          </li>)}
        </ul> : <p className="text-sm text-silver" role="status">No packages are available for online purchase at this clinic.</p>
    ) : null}
    {view.step === "review" ? <>
      <PackageReview review={view.review} />
      <button type="button" disabled={busy || !formatPackageTotal(view.review)} onClick={onReviewContinue} className={actionClass}>Continue to purchase</button>
    </> : null}
    {view.step === "contact" ? <>
      <PackageReview review={view.review} />
      <fieldset disabled={busy} className="grid gap-3 sm:grid-cols-2">
        <legend className="sr-only">Contact details for your package purchase</legend>
        {([ ["firstName", "First name", "given-name"], ["lastName", "Last name", "family-name"], ["email", "Email", "email"], ["phone", "Phone", "tel"] ] as const).map(([key, label, autoComplete]) =>
          <label key={key} className="block text-sm">
            <span className="mb-1.5 block text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-ink/55">{label}</span>
            <input type={key === "email" ? "email" : key === "phone" ? "tel" : "text"} autoComplete={autoComplete} value={view.contact[key]} onChange={event => onContact({ [key]: event.target.value })} className={inputClass} required />
          </label>)}
      </fieldset>
      <button type="button" disabled={busy || !clientLooksComplete(view.contact) || !formatPackageTotal(view.review)} onClick={() => void onPrepare()} className={actionClass}>{busy ? "Preparing…" : "Review total and payment"}</button>
    </> : null}
    {view.step === "purchase" ? <>
      <PackageReview review={view.review} />
      <div className="text-sm font-light text-silver"><p>{view.contact.firstName} {view.contact.lastName}</p><p>{view.contact.email}</p><p>{view.contact.phone}</p></div>
      {clientLooksComplete(view.contact) && formatPackageTotal(view.review) ? (
        view.review.needsCard ? (
          view.review.cardFrameOrigin ? <SecureCardFrame origin={view.review.cardFrameOrigin} busy={busy} onToken={onPurchase} purpose="package" />
            : <p role="alert" className="text-sm text-rose">Secure payment is unavailable. Please call Rella.</p>
        ) : <button type="button" disabled={busy} onClick={() => void onPurchase()} className={actionClass}>{busy ? "Confirming…" : "Confirm package purchase"}</button>
      ) : <p className="text-sm text-silver">Complete your contact details to continue.</p>}
    </> : null}
    {view.step === "verify-ownership" ? <div className="space-y-4">
      <p className="text-sm font-light text-silver">Verify your account before viewing your package sessions.</p>
      {view.verification}
    </div> : null}
    {view.step === "owned" ? (
      view.wallet.vouchers.length ? <div className="space-y-3">
        <p className="text-sm font-light text-silver">Choose a treatment covered by your package. The team applies your package at your appointment. Any required booking deposit is shown before confirmation.</p>
        {view.wallet.vouchers.map(voucher => <section key={voucher.id} className="space-y-3 rounded-sm border border-rule/60 bg-white p-4">
          <h4 className="font-medium text-ink">{packageMenuLabel(voucher.title)}</h4>
          {voucher.expiresOn ? <p className="text-xs text-silver">Expires {new Intl.DateTimeFormat("en-US", { timeZone: "UTC", month: "short", day: "numeric", year: "numeric" }).format(new Date(`${voucher.expiresOn}T12:00:00Z`))}</p> : null}
          {voucher.restrictions.includes("different_location") ? <p className="text-sm text-silver">This package session is available at another clinic.</p>
            : voucher.restrictions.length ? <p className="text-sm text-silver">Please call Rella to arrange this package session.</p>
              : voucher.services.length ? <p className="text-xs text-silver">Choose one of the covered treatments below.</p>
              : <p className="text-sm text-silver">Please call Rella to arrange this package session.</p>}
          <ul className="space-y-3">{voucher.services.map(service => <li key={service.key} className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <p className="min-w-0 flex-1 text-sm font-medium text-ink">{packageMenuLabel(service.name)}</p>
            <button type="button" disabled={busy || !voucher.eligibleAtLocation || voucher.restrictions.length > 0} onClick={() => onOwnedSession(voucher.id, service.key)} aria-label={`Book ${packageMenuLabel(service.name)} from ${packageMenuLabel(voucher.title)}`} className={actionClass}>Book a session</button>
          </li>)}</ul>
        </section>)}
      </div> : <p className="text-sm text-silver" role="status">No available package sessions were found for your verified account.</p>
    ) : null}
    {error ? <p className="text-sm text-rose" role="alert">{error}</p> : null}
  </div>;
}
