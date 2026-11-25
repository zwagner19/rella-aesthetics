"use client";
import { useCallback, useState } from "react";
import { BLACK_FRIDAY_2026, COPY, OFFERS, OFFER_TERMS_DRAFT, formatUsd, type ClinicId, type GiftCardOffer } from "@/lib/gift-cards/config";
import { ClinicChooser, openBoulevardPackage } from "./BoulevardCheckout";
import { GiftCardArt } from "./GiftCardArt";
import { VipPass } from "./VipPass";
import { DemoExperience } from "./DemoExperience";
import s from "./gift.module.css";

/**
 * /gift-cards/black-friday. Live mode links to the ONE Boulevard checkout
 * placeholder in config; while it is null the Purchase buttons fail closed.
 * Demo mode (preview-only route) runs the full flow on fixture data.
 *
 * `boulevardWidget` (server-gated, preview only) sends Purchase through a
 * clinic chooser into Boulevard's own widget for that clinic's package.
 * There is no server-verified payment on that path, so no celebration is
 * shown; the VIP Guest Pass is staff-issued by email.
 */
export function BlackFridayLanding({ demo = false, boulevardWidget = false }: { demo?: boolean; boulevardWidget?: boolean }) {
  const [unavailable, setUnavailable] = useState<string | null>(null);
  const [demoOffer, setDemoOffer] = useState<GiftCardOffer | null>(null);
  const [choosing, setChoosing] = useState<GiftCardOffer | null>(null);
  const [opening, setOpening] = useState(false);
  const [handedOff, setHandedOff] = useState<string | null>(null);
  const closeChooser = useCallback(() => setChoosing(null), []);

  async function chooseClinic(clinic: ClinicId) {
    if (!choosing || opening) return;
    const offer = choosing;
    setOpening(true);
    try {
      await openBoulevardPackage(offer, clinic);
      setHandedOff(offer.id);
      setUnavailable(null);
    } catch {
      setHandedOff(null);
      setUnavailable(offer.id);
    } finally {
      setOpening(false);
      setChoosing(null);
    }
  }

  function purchase(offer: GiftCardOffer) {
    if (demo) return setDemoOffer(offer);
    if (boulevardWidget) {
      setUnavailable(null);
      setChoosing(offer);
      return;
    }
    const url = BLACK_FRIDAY_2026.checkoutUrl;
    if (url) {
      window.location.assign(`${url}${url.includes("?") ? "&" : "?"}offer=${encodeURIComponent(offer.id)}`);
      return;
    }
    setUnavailable(offer.id);
  }

  return (
    <div className={s.landing}>
      {demo ? <div className={s.demoBanner}>DEMO preview · fixture data · nothing is charged, issued or sent</div> : null}
      <section className={`${s.hero} ${s.container}`} aria-labelledby="bf-title">
        <p className={s.eyebrow}>{COPY.landing.eyebrow}</p>
        <h1 id="bf-title" className={`${s.heroTitle} ${s.italic}`}>
          {COPY.landing.headline}
        </h1>
        <p className={s.heroBody}>{COPY.landing.body}</p>
        <span className={s.heroRule} aria-hidden="true" />
      </section>

      <section className={s.offers} aria-label="Black Friday gift card offers">
        <div className={`${s.container} ${s.offerGrid}`}>
          {OFFERS.map((o) => (
            <article key={o.id} className={s.offer} aria-labelledby={`${o.id}-title`}>
              <GiftCardArt value={formatUsd(o.valueCents)} meta={o.priceLine} />
              <p className={s.offerLabel}>{o.label}</p>
              <h2 id={`${o.id}-title`} className={s.offerTitle}>
                {o.title}
              </h2>
              <ul className={s.offerFacts}>
                <li>
                  <span>You pay</span>
                  <strong>{o.priceLine}</strong>
                </li>
                <li>
                  <span>Bonus</span>
                  <strong className={s.offerBonus}>{o.bonusLine}</strong>
                </li>
                <li>
                  <span>Included</span>
                  <strong>Rella VIP Guest Pass</strong>
                </li>
              </ul>
              <p className={s.offerDelivery}>{COPY.delivery}</p>
              <button
                type="button"
                className={s.btn}
                onClick={() => purchase(o)}
                aria-haspopup={boulevardWidget ? "dialog" : undefined}
                aria-describedby={unavailable === o.id || handedOff === o.id ? `${o.id}-note` : undefined}
              >
                {o.cta}
              </button>
              {handedOff === o.id ? (
                <p className={s.offerNote} id={`${o.id}-note`} role="status">
                  {COPY.boulevardNote}
                </p>
              ) : null}
              {unavailable === o.id ? (
                <p className={s.offerNote} id={`${o.id}-note`} role="status">
                  Online checkout isn&apos;t open yet, and nothing has been charged. To purchase this gift card, call us at{" "}
                  <a href={BLACK_FRIDAY_2026.phoneHref}>{BLACK_FRIDAY_2026.phone}</a>.
                </p>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className={s.vip} aria-labelledby="vip-title">
        <div className={`${s.container} ${s.vipGrid}`}>
          <div>
            <p className={s.eyebrow}>Included with either gift card</p>
            <h2 id="vip-title" className={`${s.vipTitle} ${s.italic}`}>
              {COPY.vipSection.headline}
            </h2>
            <p className={s.vipBody}>{COPY.vipSection.body}</p>
            <p className={s.vipDeadlines}>
              {COPY.passDeadlines.split(" · ").map((part, i) => (
                <span key={part}>
                  {i ? " · " : null}
                  <span className={s.nowrap}>{part}</span>
                </span>
              ))}
            </p>
          </div>
          <div className={s.vipArt}>
            <VipPass passId="Yours with purchase" />
          </div>
        </div>
      </section>

      <section className={s.terms} aria-labelledby="terms-title">
        <div className={`${s.container}`}>
          <div className={s.termsBox}>
            <div className={s.termsHead}>
              <h2 id="terms-title" className={s.termsTitle}>
                Offer terms
              </h2>
              <span className={s.draftFlag}>Draft · pending owner approval</span>
            </div>
            <ul className={s.termsList}>
              {OFFER_TERMS_DRAFT.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <a className={s.termsLink} href="/promotional-terms">
              Read our full promotional terms
            </a>
          </div>
        </div>
      </section>

      {choosing ? <ClinicChooser offer={choosing} busy={opening} onChoose={chooseClinic} onClose={closeChooser} /> : null}
      {demo ? <DemoExperience offer={demoOffer} onClose={() => setDemoOffer(null)} /> : null}
    </div>
  );
}
