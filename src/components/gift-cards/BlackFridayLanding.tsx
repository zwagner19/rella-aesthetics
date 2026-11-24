"use client";
import { useState } from "react";
import { BLACK_FRIDAY_2026, COPY, OFFERS, OFFER_TERMS_DRAFT, formatUsd, type GiftCardOffer } from "@/lib/gift-cards/config";
import { GiftCardArt } from "./GiftCardArt";
import { VipPass } from "./VipPass";
import { DemoExperience } from "./DemoExperience";
import s from "./gift.module.css";

/**
 * /gift-cards/black-friday. Live mode links to the ONE Boulevard checkout
 * placeholder in config; while it is null the Purchase buttons fail closed.
 * Demo mode (preview-only route) runs the full flow on fixture data.
 */
export function BlackFridayLanding({ demo = false }: { demo?: boolean }) {
  const [unavailable, setUnavailable] = useState<string | null>(null);
  const [demoOffer, setDemoOffer] = useState<GiftCardOffer | null>(null);

  function purchase(offer: GiftCardOffer) {
    if (demo) return setDemoOffer(offer);
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
              <button type="button" className={s.btn} onClick={() => purchase(o)} aria-describedby={unavailable === o.id ? `${o.id}-note` : undefined}>
                {o.cta}
              </button>
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
          </div>
          <div className={s.vipArt}>
            <VipPass passId="Yours with purchase" teaser />
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

      {demo ? <DemoExperience offer={demoOffer} onClose={() => setDemoOffer(null)} /> : null}
    </div>
  );
}
