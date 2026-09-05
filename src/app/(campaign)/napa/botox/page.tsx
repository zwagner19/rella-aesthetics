import type { Metadata } from "next";
import { resolveBookingHref } from "@/lib/booking-routes";
import {
  PRICING, VISIT, PAYMENT_DISCLOSURE, CANCELLATION_POLICY_URL,
  TRUST, MARKETING_PHONE, NAPA, RESULTS, FAQS, PUBLIC_LINKS,
} from "@/lib/napa-botox-facts";
import "./napa-botox.css";

/**
 * B01 — Napa Botox campaign landing (Revision 06 Wave 3).
 *
 * A MARKETING page on the marketing domain, not a second booking application:
 * it renders no appointment form or medical-data collection, and every booking
 * CTA hands off to the hardened booking app. Its isolated consent controller may
 * store a first-party choice and send one bounded ad-click payload only after
 * explicit acceptance.
 *
 * It supplies its OWN focused shell — logo, phone, one primary action — because
 * the general site chrome brings two competing generic Boulevard booking links
 * ("Book Consultation" in the header/MobileNav, "Book Online" in the footer) and
 * a floating chat bubble that sits on top of the mobile sticky bar. The route
 * lives in the `(campaign)` group, whose layout renders no site chrome at all;
 * that is a routing policy, not CSS hiding.
 *
 * Sources: `Napa Botox Landing.dc.html`, `boards/20-landing-production-ready.jpg`,
 * `screen-specs.js` (B01), `FACTS-AND-CONTENT-TOKENS.md`. Specification only —
 * no `.dc.html`, `support.js`, design runtime, or board image ships here. The
 * one shipped design asset is the approved black logo.
 */

const BOOKING_HREF = resolveBookingHref({ location: "napa", service: "botox" });
const CANONICAL = "https://experiencerella.com/napa/botox";
const LOGO = "/brand/rella-logo-black.svg";

/**
 * Non-booking navigation, as ABSOLUTE public URLs.
 *
 * They use the canonical Next.js paths and remain absolute so a direct Vercel
 * preview or dedicated release alias always returns visitors to the public site.
 */
export const metadata: Metadata = {
  title: "Botox in Napa — Physician-Owned Med Spa",
  description:
    "Botox® and Dysport in downtown Napa from a physician-owned med spa. Botox® $18/unit, Dysport $6/unit. 30-minute new-patient visit with a free consultation. Book online or call.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Botox in Napa — Rella Aesthetics · Physician-Owned Med Spa",
    description:
      "Natural-looking Botox® and Dysport from a physician-owned med spa on 3rd Street in downtown Napa.",
    url: CANONICAL,
    type: "website",
  },
  robots: { index: true, follow: true },
};

/**
 * FAQPage schema is built from the SAME array the page renders, so schema can
 * never describe a question a visitor cannot see. No aggregateRating, review,
 * or offer markup — none of it is verifiable here.
 */
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

function BookCta({ children = "Book an appointment", className = "nb-btn nb-btn--primary" }: { children?: string; className?: string }) {
  return <a className={className} href={BOOKING_HREF} data-cta="book">{children}</a>;
}
function CallCta({ children = `Call ${MARKETING_PHONE.display}`, className = "nb-btn nb-btn--secondary" }: { children?: string; className?: string }) {
  return <a className={className} href={MARKETING_PHONE.href} data-cta="call">{children}</a>;
}

export default function NapaBotoxLandingPage() {
  return (
    <div className="nb nb-pad">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Skip link — first focusable element, targets the single <main>. */}
      <a className="nb-skip" href="#main">Skip to content</a>

      {/* ── Campaign header: logo · phone · one primary action ─────────────── */}
      {/* Landmark note: header and footer are SIBLINGS of <main>, never inside
          it, so the document exposes a real banner / main / contentinfo set. */}
      <header className="nb-header">
        {/* eslint-disable-next-line @next/next/no-img-element -- fixed-size brand
            asset; next/image adds nothing for an inline SVG wordmark. */}
        <img className="nb-logo" src={LOGO} alt="Rella Aesthetics" width={360} height={176} decoding="async" />
        <div className="nb-headeractions">
          <a className="nb-headertel" href={MARKETING_PHONE.href} data-cta="call">{MARKETING_PHONE.display}</a>
          <BookCta className="nb-btn nb-btn--primary nb-btn--compact" />
        </div>
      </header>

      <main id="main">
      {/* ── Hero — no photography, uppercase display ───────────────────────── */}
      <section className="nb-hero" aria-labelledby="nb-h1">
        <div className="nb-wrap">
          <p className="nb-eyebrow"><span>Rella Aesthetics &middot; Downtown Napa</span></p>
          <h1 id="nb-h1" className="nb-h1" style={{ marginTop: 18 }}>
            Napa, let&rsquo;s keep it natural.
          </h1>
          <p className="nb-lede" style={{ marginTop: 18 }}>
            Botox&reg; &amp; Dysport from a physician-owned med spa on 3rd Street &mdash; subtle results that
            still look like you.
          </p>
          <div className="nb-actions">
            <BookCta />
            <CallCta />
          </div>
          <p className="nb-body" style={{ marginTop: 16 }}>{TRUST.ownerCredential}</p>

          {/* Verified-facts card. The deposit sits in its own row with its own
              language — never folded into per-unit pricing. */}
          <div className="nb-card" style={{ marginTop: 28, maxWidth: "30rem" }}>
            <p className="nb-kicker">New patient tox &middot; Napa</p>
            <dl style={{ marginTop: 14 }}>
              {([
                ["Visit length", `${VISIT.durationMinutes} min`],
                ["Botox®", `${PRICING.botoxPerUnit} / unit`],
                ["Dysport", `${PRICING.dysportPerUnit} / unit`],
                ["Booking deposit", VISIT.depositAmount],
              ] as const).map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 16, padding: "6px 0" }}>
                  <dt className="nb-body" style={{ margin: 0 }}>{k}</dt>
                  <dd style={{ margin: 0, fontWeight: 600, color: "var(--nb-ink)" }}>{v}</dd>
                </div>
              ))}
            </dl>
            <hr className="nb-rule" style={{ margin: "14px 0" }} />
            <p className="nb-body" style={{ margin: 0, fontSize: 13.5 }}>
              The {VISIT.depositAmount} deposit is charged by Boulevard when you confirm. It is separate from
              per-unit treatment pricing.
            </p>
          </div>
        </div>
      </section>

      {/* ── What to expect ─────────────────────────────────────────────────── */}
      <section className="nb-section nb-section--tint" aria-labelledby="nb-h-expect">
        <div className="nb-wrap">
          <p className="nb-kicker">The Science of Beauty</p>
          <h2 id="nb-h-expect" className="nb-h2" style={{ marginTop: 10 }}>Subtle, never frozen</h2>
          <p className="nb-lede" style={{ marginTop: 16, maxWidth: "62ch" }}>
            Botox&reg; and Dysport soften the lines your expressions leave behind &mdash; forehead, frown
            lines, crow&rsquo;s feet &mdash; while keeping every expression. Your provider builds a plan around
            your features, not a trend.
          </p>
          <div className="nb-grid nb-grid--2" style={{ marginTop: 24 }}>
            {[RESULTS.onset, RESULTS.duration, RESULTS.touchUp, RESULTS.consult].map((line) => (
              <p key={line} className="nb-card nb-body" style={{ margin: 0 }}>{line}</p>
            ))}
          </div>
        </div>
      </section>

      {/* ── Verified pricing; deposit in a separate block ──────────────────── */}
      <section className="nb-section" aria-labelledby="nb-h-pricing">
        <div className="nb-wrap">
          <p className="nb-kicker">No surprises</p>
          <h2 id="nb-h-pricing" className="nb-h2" style={{ marginTop: 10 }}>Know before you book</h2>

          <div className="nb-grid nb-grid--3" style={{ marginTop: 24 }}>
            <div className="nb-card">
              <p className="nb-stat">{VISIT.durationMinutes}</p>
              <p className="nb-kicker" style={{ marginTop: 6 }}>minutes</p>
              <p className="nb-body" style={{ marginTop: 10, marginBottom: 0 }}>
                Your new-patient visit &mdash; consultation and treatment in one easy appointment.
              </p>
            </div>

            <div className="nb-card">
              <p className="nb-stat">{PRICING.botoxPerUnit}</p>
              <p className="nb-kicker" style={{ marginTop: 6 }}>per unit</p>
              <p className="nb-body" style={{ marginTop: 10, marginBottom: 0 }}>
                Botox&reg; is {PRICING.botoxPerUnit}/unit and Dysport {PRICING.dysportPerUnit}/unit. With the
                2026 Tox Membership &mdash; {PRICING.membershipMonthly}/month, a {PRICING.membershipCommitment}{" "}
                commitment &mdash; Botox is {PRICING.memberBotoxPerUnit}/unit and Dysport{" "}
                {PRICING.memberDysportPerUnit}/unit. Treatment is priced by the unit at your visit, separately
                from the booking deposit.
              </p>
            </div>

            <div className="nb-card nb-card--rose">
              <p className="nb-stat">{VISIT.depositAmount}</p>
              {/* Filled band → ink-soft; muted would be 4.24:1 on this tint. */}
              <p className="nb-kicker" style={{ marginTop: 6 }}>deposit</p>
              <p className="nb-body" style={{ marginTop: 10, marginBottom: 0, color: "var(--nb-ink-soft)" }}>
                {PAYMENT_DISCLOSURE}
              </p>
            </div>
          </div>

          <div className="nb-actions" style={{ marginTop: 28 }}>
            <BookCta />
            <CallCta />
          </div>
        </div>
      </section>

      {/* ── Physician-owned trust ──────────────────────────────────────────── */}
      <section className="nb-section nb-section--tint" aria-labelledby="nb-h-trust">
        <div className="nb-wrap">
          <p className="nb-kicker">Get It Done Right</p>
          <h2 id="nb-h-trust" className="nb-h2" style={{ marginTop: 10 }}>Physician-owned care</h2>
          <p className="nb-lede" style={{ marginTop: 16, maxWidth: "62ch" }}>
            {TRUST.physicianOwned} &mdash; {TRUST.ownerCredential}. Your consultation is free, your plan and
            per-unit pricing are explained before anything is treated, and the visit stays warm and unhurried.
          </p>
          {/* Owner portrait and Napa photography are OPTIONAL modules and are OFF
              in the production-ready state. No stock stand-in, ever. */}
        </div>
      </section>

      {/* ── Local proof: only verified, checkable facts ────────────────────── */}
      <section className="nb-section" aria-labelledby="nb-h-local">
        <div className="nb-wrap">
          <p className="nb-kicker">Visit us</p>
          <h2 id="nb-h-local" className="nb-h2" style={{ marginTop: 10 }}>Downtown Napa</h2>
          <div className="nb-grid nb-grid--3" style={{ marginTop: 20 }}>
            <p className="nb-card nb-body" style={{ margin: 0 }}>
              <span style={{ fontWeight: 600, color: "var(--nb-ink)" }}>Rella Aesthetics &mdash; Napa</span>
              <br />{NAPA.street}<br />{NAPA.cityStateZip}
            </p>
            <p className="nb-card nb-body" style={{ margin: 0 }}>{NAPA.hoursCopy}</p>
            <p className="nb-card nb-body" style={{ margin: 0 }}>{NAPA.parkingCopy}</p>
          </div>
          <div className="nb-actions" style={{ marginTop: 20 }}>
            <CallCta className="nb-btn nb-btn--quiet nb-btn--compact">Call Rella</CallCta>
          </div>
          <p className="nb-body" style={{ marginTop: 16, fontSize: 13.5 }}>
            All&#275; (Botox&reg;) and Aspire (Dysport) rewards accepted.
          </p>
        </div>
      </section>

      {/* ── FAQ — identical to the FAQPage schema above ────────────────────── */}
      <section className="nb-section nb-section--tint" aria-labelledby="nb-h-faq">
        <div className="nb-wrap" style={{ maxWidth: 860 }}>
          <p className="nb-kicker">Questions, answered</p>
          <h2 id="nb-h-faq" className="nb-h2" style={{ marginTop: 10 }}>Before your visit</h2>
          <div style={{ marginTop: 22 }}>
            {FAQS.map((f) => (
              <details key={f.q} className="nb-faq">
                <summary>{f.q}</summary>
                <p className="nb-body" style={{ padding: "0 32px 16px 4px", margin: 0 }}>{f.a}</p>
              </details>
            ))}
          </div>
          <p style={{ marginTop: 20 }}>
            <a href={CANCELLATION_POLICY_URL} style={{ color: "var(--nb-clay)", fontWeight: 600, fontSize: 13.5 }}>
              Read our cancellation policy
            </a>
          </p>
        </div>
      </section>

      {/* ── Closing action ─────────────────────────────────────────────────── */}
      <section className="nb-section" aria-labelledby="nb-h-book">
        <div className="nb-wrap">
          <h2 id="nb-h-book" className="nb-h2">Ready when you are</h2>
          {/* The explicit {" "} after the interpolation is load-bearing: without
              it the rendered sentence reads "30 minutesnew-patient visit". */}
          <p className="nb-lede" style={{ marginTop: 14, maxWidth: "52ch" }}>
            Book your {VISIT.durationCopy}{" "}new-patient visit online, or call and we&rsquo;ll get you scheduled.
          </p>
          <div className="nb-actions" style={{ marginTop: 22 }}>
            <BookCta />
            <CallCta />
          </div>
        </div>
      </section>

      </main>

      {/* ── Compact campaign footer ────────────────────────────────────────── */}
      <footer className="nb-footer">
        <div className="nb-wrap">
          <p className="nb-footer-legal">
            Individual results vary. Botox&reg; is a registered trademark of Allergan. Treatment eligibility is
            determined at your in-person consultation with a licensed provider. Pricing shown is current
            published pricing and may change. This page loads no browser marketing trackers. If you accept
            cookies, ad-click information goes only to Rella&rsquo;s first-party booking attribution service.
          </p>
          <div className="nb-footer-row">
            {/* eslint-disable-next-line @next/next/no-img-element -- see header */}
            <img src={LOGO} alt="Rella Aesthetics" width={360} height={176} style={{ width: 96, height: "auto" }} decoding="async" />
            {/* Keep footer destinations absolute so previews and the dedicated
                release alias always return visitors to the public site. */}
            <div className="nb-footer-links">
              <a href={PUBLIC_LINKS.treatments}>Explore treatments</a>
              <a href={PUBLIC_LINKS.privacy}>Privacy Policy</a>
              <a href={PUBLIC_LINKS.terms}>Terms &amp; Conditions</a>
              <span style={{ color: "var(--nb-muted)" }}>&copy; 2026 Rella Aesthetics</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ── Mobile sticky actions — hidden at >=1024px per the B01 spec ────── */}
      <div className="nb-sticky" role="group" aria-label="Book or call Rella Napa">
        <a className="nb-sticky-book" href={BOOKING_HREF} data-cta="book">Book an appointment</a>
        <a className="nb-sticky-call" href={MARKETING_PHONE.href} data-cta="call">Call Rella</a>
      </div>
    </div>
  );
}
