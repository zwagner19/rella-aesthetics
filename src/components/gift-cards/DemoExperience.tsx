"use client";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { formatUsd, type GiftCardOffer } from "@/lib/gift-cards/config";
import { CelebrationModal } from "./CelebrationModal";
import { GiftCardArt } from "./GiftCardArt";
import s from "./gift.module.css";

/**
 * DEMO ONLY. Fixture checkout + outcome toggles so the design can be
 * reviewed end to end. Nothing here calls Boulevard, stores a pass or sends
 * email; every surface is labeled DEMO.
 */
export const DEMO_PASS_ID = "RELLA-VIP-DEMO-2026";
const DEMO_PURCHASER = "Demo Purchaser";
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

const banner = <div className={s.demoBanner}>DEMO · fixture data · nothing is charged, issued or sent</div>;

const PHONE = "(max-width: 640px)";
function subscribePhone(cb: () => void) {
  const m = window.matchMedia(PHONE);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
}

type Stage = "review" | "processing" | "declined" | "paid";

export function DemoExperience({ offer, onClose: parentClose }: { offer: GiftCardOffer | null; onClose: () => void }) {
  const [payment, setPayment] = useState<"approve" | "decline">("approve");
  const [email, setEmail] = useState<"deliver" | "fail">("deliver");
  const [stage, setStage] = useState<Stage>("review");
  const [confettiReplay, setConfettiReplay] = useState(0);
  const dialog = useRef<HTMLDivElement>(null);
  // Expanded on desktop, collapsed on phones so it never covers the flow.
  const isPhone = useSyncExternalStore(subscribePhone, () => window.matchMedia(PHONE).matches, () => false);
  const [controlsChoice, setControlsChoice] = useState<boolean | null>(null);
  const controlsOpen = controlsChoice ?? !isPhone;
  const onClose = useCallback(() => {
    setStage("review");
    parentClose();
  }, [parentClose]);

  useEffect(() => {
    if (!offer || stage === "paid") return;
    dialog.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && stage !== "processing" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [offer, stage, onClose]);

  async function pay() {
    setStage("processing");
    await wait(1600);
    setStage(payment === "approve" ? "paid" : "declined");
  }

  const controls = (
    <details className={s.demoControls} data-demo-controls open={controlsOpen}
      onToggle={(e) => { const o = e.currentTarget.open; if (o !== controlsOpen) setControlsChoice(o); }}>
      <summary aria-label="Demo controls"><strong>{controlsOpen || !isPhone ? "Demo controls" : "Demo"}</strong></summary>
      <fieldset>
        <legend>Payment outcome</legend>
        <label><input type="radio" name="demo-pay" checked={payment === "approve"} onChange={() => setPayment("approve")} /> Approved</label>
        <label><input type="radio" name="demo-pay" checked={payment === "decline"} onChange={() => setPayment("decline")} /> Declined</label>
      </fieldset>
      <fieldset>
        <legend>Gift email outcome</legend>
        <label><input type="radio" name="demo-mail" checked={email === "deliver"} onChange={() => setEmail("deliver")} /> Delivered</label>
        <label><input type="radio" name="demo-mail" checked={email === "fail"} onChange={() => setEmail("fail")} /> Fails</label>
      </fieldset>
    </details>
  );

  if (!offer) return controls;

  if (stage === "paid") {
    return (
      <>
        <CelebrationModal
          key={offer.id}
          passId={DEMO_PASS_ID}
          purchaserName={DEMO_PURCHASER}
          banner={
            <div className={s.demoBanner}>
              DEMO · fixture data · nothing is charged, issued or sent
              <button type="button" className={s.demoReplay} onClick={() => setConfettiReplay((n) => n + 1)}>
                Replay confetti
              </button>
            </div>
          }
          demoConfetti={{ replay: confettiReplay }}
          onClose={onClose}
          onSubmit={async (v) => {
            await wait(1400);
            return email === "deliver"
              ? { status: "sent", recipientFirstName: v.recipientFirstName.trim() }
              : { status: "error", message: "We couldn't send their pass just now. Nothing was sent. Please try again. (DEMO failure)" };
          }}
          onSendLater={async () => {
            await wait(700);
            return { ok: true, message: "Your private gifting link is in your purchase confirmation email. Send your pass whenever the moment is right." };
          }}
        />
        {controls}
      </>
    );
  }

  return (
    <>
      <div className={`${s.root} ${s.overlay}`}>
        <div ref={dialog} className={`${s.modal} ${s.sheet}`} role="dialog" aria-modal="true" aria-labelledby="demo-checkout-title" tabIndex={-1}>
          {banner}
          {stage !== "processing" ? (
            <button type="button" className={s.close} onClick={onClose} aria-label="Close">
              ×
            </button>
          ) : null}
          {stage === "processing" ? (
            <div className={s.loadingBlock} role="status" aria-live="polite">
              <span className={s.spinner} aria-hidden="true" />
              <p className={s.lede}>Confirming your payment…</p>
              <p className={s.small}>Please don&apos;t close this window.</p>
            </div>
          ) : (
            <>
              <p className={s.eyebrow} style={{ marginTop: 22 }}>Secure checkout · {offer.label}</p>
              <h2 id="demo-checkout-title" className={`${s.h2} ${s.italic}`}>
                {offer.title}
              </h2>
              <div style={{ maxWidth: 320, margin: "18px 0 0" }}>
                <GiftCardArt value={formatUsd(offer.valueCents)} meta={offer.priceLine} />
              </div>
              <ul className={s.rows}>
                <li><span>Gift card value</span><strong>{formatUsd(offer.valueCents)}</strong></li>
                <li><span>Additional value</span><strong>{formatUsd(offer.bonusCents)}</strong></li>
                <li><span>Included</span><strong>Rella VIP Guest Pass</strong></li>
                <li><span>Total today</span><strong>{formatUsd(offer.priceCents)}</strong></li>
              </ul>
              {stage === "declined" ? (
                <p className={s.alert} role="alert" style={{ marginTop: 20 }}>
                  Your payment didn&apos;t go through, and you have not been charged. Please check your card details and try again. (DEMO decline)
                </p>
              ) : null}
              <div className={s.demoCard}>
                <div>
                  <span>DEMO card</span>
                  <div>•••• •••• •••• 0000</div>
                </div>
                <div className={s.small}>Card entry happens in Boulevard&apos;s secure form</div>
              </div>
              <div className={s.formActions}>
                <button type="button" className={s.btn} onClick={pay}>
                  {stage === "declined" ? "Try again" : `Pay ${formatUsd(offer.priceCents)} (DEMO)`}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      {controls}
    </>
  );
}
