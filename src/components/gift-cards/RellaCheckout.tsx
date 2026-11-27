"use client";
import { useEffect, useRef, useState } from "react";
import { BLACK_FRIDAY_2026, BOULEVARD_CHECKOUT, COPY, formatUsd, type ClinicId, type GiftCardOffer } from "@/lib/gift-cards/config";
import { isSafeCardRestart, openRellaCheckout, reviewIsSellable } from "@/lib/gift-cards/rella-checkout";
import { clientLooksComplete, initialGuidedBookingState } from "@/lib/guided-booking/machine";
import {
  createSharedPackageClient,
  PackageRequestError,
  type PackageClient,
  type PackageConfirmation,
  type PackageContact,
  type PackagePurchaseReview,
} from "@/lib/guided-booking/package-client";
import { ASSESSMENT_CONTACT_CONSENT, MARKETING_CONSENT } from "@/lib/guided-booking/policies";
import { SecureCardFrame } from "@/components/guided-booking/SecureCardFrame";
import { Confetti } from "./Confetti";
import { VipPass } from "./VipPass";
import { CelebrationModal } from "./CelebrationModal";
import { giftSubmitFor, sendLaterFor } from "@/lib/gift-cards/gift-client";
import type { GiftSubmit } from "./GiftingForm";
import s from "./gift.module.css";

type Step =
  | { name: "loading" }
  | { name: "already"; result: PackageConfirmation }
  | { name: "details"; review: PackagePurchaseReview }
  | { name: "payment"; review: PackagePurchaseReview }
  | { name: "card-restart" }
  | { name: "pending" }
  | { name: "mismatch" }
  | { name: "confirmed"; result: PackageConfirmation };

type Props = {
  offer: GiftCardOffer;
  clinic: ClinicId;
  /** Rella's checkout could not start. Nothing was charged; the page may fall back. */
  onUnavailable: () => void;
  onClose: () => void;
  /** Tests and the local mock only. */
  client?: PackageClient;
  /** Isolated preview harness only; never supplied by the production route. */
  previewPayment?: boolean;
  previewGift?: GiftSubmit;
  previewLater?: () => Promise<{ ok: boolean; message: string }>;
};

const CARD_HOSTS = new Set(["experiencerella.com", "www.experiencerella.com", "localhost", "127.0.0.1"]);

function CallRella() {
  return <a href={BLACK_FRIDAY_2026.phoneHref}>{BLACK_FRIDAY_2026.phone}</a>;
}

/**
 * Black Friday purchase through Rella's own package checkout (the same
 * server-verified flow as the site's Packages menu), in the gift-card design.
 * The celebration is shown ONLY for a purchase the server reports CONFIRMED.
 * An unverified payment is never retried: the buyer is told to call.
 */
export function RellaCheckout({ offer, clinic, onUnavailable, onClose, client: provided, previewPayment, previewGift, previewLater }: Props) {
  const [client] = useState(() => provided ?? createSharedPackageClient());
  const [step, setStep] = useState<Step>({ name: "loading" });
  const [contact, setContact] = useState<PackageContact>(() => ({ ...initialGuidedBookingState.client }));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cardHostOk, setCardHostOk] = useState(true);
  const dialog = useRef<HTMLDivElement>(null);
  const working = useRef(false);
  const unavailable = useRef(onUnavailable);
  unavailable.current = onUnavailable;
  const closing = useRef(onClose);
  closing.current = onClose;
  const clinicName = BOULEVARD_CHECKOUT.clinics.find((c) => c.id === clinic)?.name ?? "";
  const locked = busy && step.name === "payment";
  const tall = step.name === "details" || step.name === "payment" || step.name === "confirmed";

  async function open(buyAnother: boolean) {
    setStep({ name: "loading" });
    setError(null);
    const result = await openRellaCheckout(client, offer, clinic, { buyAnother });
    if (result.kind === "ready") setStep({ name: "details", review: result.review });
    else if (result.kind === "unavailable") unavailable.current();
    else if (result.kind === "already") setStep({ name: "already", result });
    else if (result.kind === "pending") setStep({ name: "pending" });
    else setStep({ name: "mismatch" });
  }

  useEffect(() => {
    setCardHostOk(CARD_HOSTS.has(window.location.hostname));
    void open(false);
    // One checkout session per mount; the offer and clinic are fixed for its lifetime.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    dialog.current?.focus({ preventScroll: true });
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
      prev?.focus?.();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !locked) closing.current();
      if (e.key !== "Tab" || !dialog.current) return;
      const f = dialog.current.querySelectorAll<HTMLElement>("button:not([disabled]), input:not([disabled]), a[href], iframe");
      if (!f.length) return;
      const a = f[0];
      const z = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === a || document.activeElement === dialog.current)) {
        e.preventDefault();
        z.focus();
      } else if (!e.shiftKey && document.activeElement === z) {
        e.preventDefault();
        a.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [locked]);

  useEffect(() => {
    dialog.current?.parentElement?.scrollTo({ top: 0 });
  }, [step.name]);

  async function run(work: () => Promise<void>) {
    if (working.current) return;
    working.current = true;
    setBusy(true);
    setError(null);
    try {
      await work();
    } catch (cause) {
      if (client.verificationPending()) setStep({ name: "pending" });
      else if (isSafeCardRestart(cause)) setStep({ name: "card-restart" });
      else setError(cause instanceof PackageRequestError || cause instanceof Error ? cause.message : "That could not be completed. Please call Rella.");
    } finally {
      working.current = false;
      setBusy(false);
    }
  }

  const prepare = () =>
    run(async () => {
      const review = await client.preparePurchase(contact);
      setStep(reviewIsSellable(offer, review) ? { name: "payment", review } : { name: "mismatch" });
    });

  const pay = (token: string) =>
    run(async () => {
      const result = await client.purchase({ client: contact, token });
      setStep(result.status === "confirmed" ? { name: "confirmed", result } : { name: "pending" });
    });

  const field = (key: "firstName" | "lastName" | "email" | "phone", label: string, type: string, autoComplete: string) => (
    <label className={s.field}>
      <span className={s.label}>{label}</span>
      <input
        className={s.input}
        type={type}
        name={key}
        autoComplete={autoComplete}
        inputMode={type === "tel" ? "tel" : undefined}
        value={contact[key]}
        disabled={busy}
        onChange={(e) => setContact((c) => ({ ...c, [key]: e.target.value }))}
        required
      />
    </label>
  );

  const summary = (review: PackagePurchaseReview) => (
    <ul className={s.rows}>
      <li>
        <span>Gift card</span>
        <strong>{offer.title}</strong>
      </li>
      <li>
        <span>Clinic</span>
        <strong>{clinicName}</strong>
      </li>
      <li>
        <span>Included</span>
        <strong>Rella VIP Guest Pass</strong>
      </li>
      <li>
        <span>Total today</span>
        <strong>{formatUsd(review.totalCents)}</strong>
      </li>
    </ul>
  );

  if (step.name === "confirmed" && step.result.passId && step.result.giftToken) {
    return <CelebrationModal passId={step.result.passId} purchaserName={`${contact.firstName} ${contact.lastName}`.trim()}
      onSubmit={previewGift ?? giftSubmitFor(step.result.giftToken)} onSendLater={previewLater ?? sendLaterFor(step.result.giftToken)} onClose={onClose}
      banner={previewPayment ? <p className={s.demoBanner}>SIMULATED PAYMENT · no charge, pass issuance or email</p> : undefined} />;
  }

  return (
    <div
      className={`${s.root} ${s.overlay} ${tall ? "" : s.chooserOverlay}`}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !locked && step.name !== "payment" && step.name !== "details") onClose();
      }}
    >
      {step.name === "confirmed" ? <Confetti /> : null}
      <div ref={dialog} className={`${s.modal} ${step.name === "confirmed" ? "" : s.checkout} ${tall ? "" : s.chooser}`} role="dialog" aria-modal="true" aria-labelledby="rella-checkout-title" tabIndex={-1}>
        <button type="button" className={s.close} onClick={onClose} disabled={locked} aria-label="Close">
          ×
        </button>

        {step.name === "loading" ? (
          <div className={s.loadingBlock} role="status">
            <span className={s.spinner} aria-hidden="true" />
            <h2 id="rella-checkout-title" className={`${s.h2} ${s.italic}`}>
              Opening secure checkout
            </h2>
            <p className={s.small}>Confirming today&apos;s price with {clinicName}.</p>
          </div>
        ) : null}

        {step.name === "already" ? (
          <div role="status">
            <p className={s.chooserEyebrow}>{offer.title}</p>
            <h2 id="rella-checkout-title" className={`${s.h2} ${s.italic}`}>
              You&apos;ve already purchased
            </h2>
            <p className={s.lede}>A Rella purchase was already completed on this device. Would you like to buy another?</p>
            <div className={s.formActions}>
              {step.result.passId ? <button type="button" className={s.btn} onClick={() => setStep({ name: "confirmed", result: step.result })}>View my VIP Guest Pass</button> : null}
              <button type="button" className={s.btn} onClick={() => void open(true)}>
                Buy another
              </button>
              <button type="button" className={s.linkBtn} onClick={onClose}>
                No, I&apos;m all set
              </button>
            </div>
          </div>
        ) : null}

        {step.name === "details" ? (
          <form
            className={s.sheet}
            onSubmit={(e) => {
              e.preventDefault();
              if (clientLooksComplete(contact)) void prepare();
            }}
          >
            <p className={s.chooserEyebrow}>Step 1 of 2 · Your details</p>
            <h2 id="rella-checkout-title" className={`${s.h2} ${s.italic}`}>
              Who is purchasing?
            </h2>
            <p className={s.small}>{COPY.delivery} It is added to this person&apos;s Rella profile.</p>
            {summary(step.review)}
            <div className={s.checkoutFields}>
              <div className={s.grid2}>
                {field("firstName", "First name", "text", "given-name")}
                {field("lastName", "Last name", "text", "family-name")}
              </div>
              {field("email", "Email", "email", "email")}
              {field("phone", "Mobile phone", "tel", "tel")}
              <label className={s.consent}>
                <input
                  type="checkbox"
                  checked={contact.assessmentContactConsent}
                  disabled={busy}
                  onChange={(e) => setContact((c) => ({ ...c, assessmentContactConsent: e.target.checked }))}
                  required
                />
                <span>{ASSESSMENT_CONTACT_CONSENT}</span>
              </label>
              <label className={s.consent}>
                <input
                  type="checkbox"
                  checked={contact.marketingConsent}
                  disabled={busy}
                  onChange={(e) => setContact((c) => ({ ...c, marketingConsent: e.target.checked }))}
                />
                <span>{MARKETING_CONSENT}</span>
              </label>
            </div>
            {error ? (
              <p className={s.alert} role="alert">
                {error}
              </p>
            ) : null}
            <div className={s.formActions}>
              <button type="submit" className={s.btn} disabled={busy || !clientLooksComplete(contact)}>
                {busy ? <span className={s.spinner} aria-hidden="true" /> : null}
                {busy ? "Confirming…" : "Continue to payment"}
              </button>
              <p className={s.small}>Nothing is charged on this step.</p>
            </div>
          </form>
        ) : null}

        {step.name === "payment" ? (
          <div className={s.sheet}>
            <p className={s.chooserEyebrow}>Step 2 of 2 · Payment</p>
            <h2 id="rella-checkout-title" className={`${s.h2} ${s.italic}`}>
              Secure payment
            </h2>
            <p className={s.small}>
              {contact.firstName.trim()} {contact.lastName.trim()} · {contact.email.trim()}
            </p>
            {summary(step.review)}
            {cardHostOk || previewPayment ? null : (
              <p className={s.alert}>Preview note: secure card entry only loads on experiencerella.com, so this step cannot be completed on a preview link. Nothing is charged here.</p>
            )}
            <div className={s.cardFrame}>
              {previewPayment ? <div className={s.sheet}><p className={s.demoBanner}>TEST PAYMENT · no card data collected</p>
                <button className={s.btn} type="button" disabled={busy} onClick={() => void pay("synthetic-card-token")}>Simulate payment of {formatUsd(offer.priceCents)}</button></div>
                : <SecureCardFrame origin={step.review.cardFrameOrigin as string} purpose="package" busy={busy} onToken={pay} />}
            </div>
            {busy ? (
              <p className={s.small} role="status">
                Confirming your payment. Please keep this window open.
              </p>
            ) : null}
            {error ? (
              <p className={s.alert} role="alert">
                {error}
              </p>
            ) : null}
            <p className={s.small}>
              Your card goes directly to Boulevard, our secure payment system. You will be charged {formatUsd(step.review.totalCents)} once.{" "}
              <a href="/promotional-terms">Promotional terms</a> apply.
            </p>
            <div className={s.formActions}>
              <button type="button" className={s.linkBtn} disabled={busy} onClick={() => setStep({ name: "details", review: step.review })}>
                Edit my details
              </button>
            </div>
          </div>
        ) : null}

        {step.name === "card-restart" ? (
          <div role="alert">
            <h2 id="rella-checkout-title" className={`${s.h2} ${s.italic}`}>
              Let&apos;s try your card in a fresh checkout
            </h2>
            <p className={s.lede}>
              Your card could not be added, so no payment was submitted for this attempt. Start again securely, then enter your card again or use a different card.
            </p>
            <p className={s.small}>We&apos;ll keep your contact details and recheck your purchase status and price before continuing.</p>
            <div className={s.formActions}>
              <button type="button" className={s.btn} disabled={busy} onClick={() => void run(() => open(false))}>
                Start again securely
              </button>
              <button type="button" className={s.linkBtn} disabled={busy} onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        ) : null}

        {step.name === "pending" ? (
          <div role="alert">
            <h2 id="rella-checkout-title" className={`${s.h2} ${s.italic}`}>
              We&apos;re confirming your payment
            </h2>
            <p className={s.lede}>
              We couldn&apos;t confirm this purchase automatically. Please don&apos;t pay again. Call us at <CallRella /> and we&apos;ll check it and send your VIP Guest Pass.
            </p>
            <div className={s.formActions}>
              <button type="button" className={s.btn} onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        ) : null}

        {step.name === "mismatch" ? (
          <div role="alert">
            <h2 id="rella-checkout-title" className={`${s.h2} ${s.italic}`}>
              Let&apos;s finish this by phone
            </h2>
            <p className={s.lede}>
              We couldn&apos;t confirm the Black Friday price online, so nothing has been charged. Call us at <CallRella /> to purchase this gift card.
            </p>
            <div className={s.formActions}>
              <button type="button" className={s.btn} onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        ) : null}

        {step.name === "confirmed" ? (
          <div role="status">
            <h1 id="rella-checkout-title" className={`${s.h1} ${s.italic}`}>
              {COPY.purchased.headline}
            </h1>
            <p className={s.lede}>{COPY.purchased.body}</p>
            <p className={`${s.secondary} ${s.italic}`}>{COPY.purchased.secondary}</p>
            <div className={s.reveal}>
              <VipPass passId={step.result.passId ?? "Arriving by email"} />
            </div>
            <ul className={`${s.rows} ${s.receipt}`}>
              <li>
                <span>Purchased</span>
                <strong>
                  {offer.title} · {formatUsd(offer.priceCents)}
                </strong>
              </li>
              <li>
                <span>Delivered as</span>
                <strong>Rella account credit · {clinicName}</strong>
              </li>
              <li>
                <span>Guest pass</span>
                <strong>{COPY.passDeadlines}</strong>
              </li>
            </ul>
            {step.result.emailSent === false ? <p className={s.small} role="status">Payment is confirmed. VIP pass email delivery has not been confirmed; please call Rella for help. Do not pay again.</p> : null}
            <div className={s.formActions}>
              <button type="button" className={s.btn} onClick={onClose}>
                Done
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
