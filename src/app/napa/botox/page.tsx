import type { Metadata } from "next";
import { resolveBookingHref } from "@/lib/booking-routes";
import {
  PRICING, VISIT, PAYMENT_DISCLOSURE, CANCELLATION_POLICY_URL,
  TRUST, MARKETING_PHONE, NAPA, RESULTS, FAQS,
} from "@/lib/napa-botox-facts";
import "./napa-botox.css";

/**
 * B01 — Napa Botox marketing landing (Revision 06 Wave 3).
 *
 * This is a MARKETING page on the marketing domain. It is not a second booking
 * application: it collects nothing, stores nothing, and every booking CTA hands
 * off to the hardened booking app through the typed resolver. Marketing ends at
 * that click — the booking domain carries no marketing tags of any kind.
 *
 * Sources: `Napa Botox Landing.dc.html`, `Landing Responsive Sheet.dc.html`,
 * `screen-specs.js` (B01), and `FACTS-AND-CONTENT-TOKENS.md` from the accepted
 * Revision 06 package. Boards were read as specification only — no `.dc.html`,
 * `support.js`, design-runtime dependency, or board screenshot ships here.
 *
 * Production default is the accepted no-photo light state. Optional modules
 * (ratings, reviews, owner portrait, Napa photography, map embed) are designed
 * but omitted; the page is complete and coherent without every one of them.
 */

const BOOKING_HREF = resolveBookingHref({ location: "napa", service: "botox" });
const CANONICAL = "https://experiencerella.com/napa/botox/";

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
 * FAQPage schema is generated from the SAME array the page renders, so schema
 * can never describe a question a visitor cannot see. No aggregateRating, no
 * review markup, no offer/price markup — none of those are verifiable here.
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

function BookCta({ children = "Book an appointment", variant = "primary" }: { children?: string; variant?: "primary" | "secondary" }) {
  return (
    <a className={`nb-btn nb-btn--${variant}`} href={BOOKING_HREF} data-testid="book-cta">
      {children}
    </a>
  );
}

function CallCta({ children = `Call ${MARKETING_PHONE.display}`, variant = "secondary" }: { children?: string; variant?: "primary" | "secondary" }) {
  return (
    <a className={`nb-btn nb-btn--${variant}`} href={MARKETING_PHONE.href} data-testid="call-cta">
      {children}
    </a>
  );
}

export default function NapaBotoxLandingPage() {
  return (
    <div className="nb">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* 1 — No-photo light hero with the Napa message match ---------------- */}
      <section className="nb-band--rose" aria-labelledby="nb-h1">
        <div className="mx-auto max-w-[1160px] px-5 py-14 md:px-8 md:py-20">
          <p className="nb-kicker">Rella Aesthetics · Downtown Napa</p>
          <h1 id="nb-h1" className="nb-serif mt-3 text-[2rem] leading-[1.1] md:text-[3.25rem]">
            Napa, let&rsquo;s keep it natural.
          </h1>
          <p className="mt-4 max-w-[46ch] text-[1.0625rem] leading-relaxed md:text-[1.1875rem]">
            Botox&reg; &amp; Dysport from a physician-owned med spa on 3rd Street &mdash; subtle results that
            still look like you.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <BookCta />
            <CallCta />
          </div>
          {/* On the rose-50 tint the muted token falls to 4.24:1. The canon's
              rule for filled bands applies: ink-soft (8.9:1). */}
          <p className="mt-4 text-sm" style={{ color: "var(--nb-ink-soft)" }}>
            {TRUST.ownerCredential}
          </p>

          {/* Verified-facts card. Deposit is deliberately in its own row with
              its own language — never folded into per-unit pricing. */}
          <div className="nb-card mt-8 max-w-[30rem]">
            <p className="nb-kicker">New patient tox · Napa</p>
            <dl className="mt-3 space-y-2.5">
              {[
                ["Visit length", `${VISIT.durationMinutes} min`],
                ["Botox®", `${PRICING.botoxPerUnit} / unit`],
                ["Dysport", `${PRICING.dysportPerUnit} / unit`],
                ["Booking deposit", VISIT.depositAmount],
              ].map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-4">
                  <dt className="text-sm" style={{ color: "var(--nb-muted)" }}>{k}</dt>
                  <dd className="font-semibold" style={{ color: "var(--nb-ink)" }}>{v}</dd>
                </div>
              ))}
            </dl>
            <hr className="nb-rule my-3" />
            <p className="text-sm leading-relaxed" style={{ color: "var(--nb-muted)" }}>
              The {VISIT.depositAmount} deposit is charged by Boulevard when you confirm. It is separate from
              per-unit treatment pricing.
            </p>
          </div>
        </div>
      </section>

      {/* 2 — What Botox does here, and what to expect ----------------------- */}
      <section className="nb-band" aria-labelledby="nb-h-expect">
        <div className="mx-auto max-w-[1160px] px-5 py-14 md:px-8 md:py-20">
          <p className="nb-kicker">The Science of Beauty</p>
          <h2 id="nb-h-expect" className="nb-serif mt-2 text-[1.75rem] md:text-[2.25rem]">
            Subtle, never frozen
          </h2>
          <p className="mt-4 max-w-[62ch] leading-relaxed">
            Botox&reg; and Dysport soften the lines your expressions leave behind &mdash; forehead, frown
            lines, crow&rsquo;s feet &mdash; while keeping every expression. Your provider builds a plan around
            your features, not a trend.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {[RESULTS.onset, RESULTS.duration, RESULTS.touchUp, RESULTS.consult].map((line) => (
              <li key={line} className="nb-card text-[0.9375rem] leading-relaxed">{line}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3 — Verified pricing, deposit kept in a separate block -------------- */}
      <section aria-labelledby="nb-h-pricing">
        <div className="mx-auto max-w-[1160px] px-5 py-14 md:px-8 md:py-20">
          <p className="nb-kicker">No surprises</p>
          <h2 id="nb-h-pricing" className="nb-serif mt-2 text-[1.75rem] md:text-[2.25rem]">
            Know before you book
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="nb-card">
              <p className="nb-serif text-[2rem]">{VISIT.durationMinutes}</p>
              <p className="text-sm" style={{ color: "var(--nb-muted)" }}>minutes</p>
              <p className="mt-2 text-[0.9375rem] leading-relaxed">
                Your new-patient visit &mdash; consultation and treatment in one easy appointment.
              </p>
            </div>

            <div className="nb-card">
              <p className="nb-serif text-[2rem]">{PRICING.botoxPerUnit}</p>
              <p className="text-sm" style={{ color: "var(--nb-muted)" }}>per unit</p>
              <p className="mt-2 text-[0.9375rem] leading-relaxed">
                Botox&reg; is {PRICING.botoxPerUnit}/unit and Dysport {PRICING.dysportPerUnit}/unit. With the
                2026 Tox Membership &mdash; {PRICING.membershipMonthly}/month, a {PRICING.membershipCommitment}{" "}
                commitment &mdash; Botox is {PRICING.memberBotoxPerUnit}/unit and Dysport{" "}
                {PRICING.memberDysportPerUnit}/unit. Treatment is priced by the unit at your visit, separately
                from the booking deposit.
              </p>
            </div>

            {/* Deposit block: separate card, separate language, no merge. */}
            <div className="nb-card nb-band--rose">
              <p className="nb-serif text-[2rem]">{VISIT.depositAmount}</p>
              {/* Filled band → ink-soft, not muted (see the hero note). */}
              <p className="text-sm" style={{ color: "var(--nb-ink-soft)" }}>deposit</p>
              <p className="mt-2 text-[0.9375rem] leading-relaxed">{PAYMENT_DISCLOSURE}</p>
            </div>
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <BookCta />
            <CallCta />
          </div>
        </div>
      </section>

      {/* 4 — Physician-owned trust ------------------------------------------ */}
      <section className="nb-band" aria-labelledby="nb-h-trust">
        <div className="mx-auto max-w-[1160px] px-5 py-14 md:px-8 md:py-20">
          <p className="nb-kicker">Get It Done Right</p>
          <h2 id="nb-h-trust" className="nb-serif mt-2 text-[1.75rem] md:text-[2.25rem]">
            Physician-owned care
          </h2>
          <p className="mt-4 max-w-[62ch] leading-relaxed">
            {TRUST.physicianOwned} &mdash; {TRUST.ownerCredential}. Your consultation is free, your plan and
            per-unit pricing are explained before anything is treated, and the visit stays warm and unhurried.
          </p>
          {/* Owner portrait and Napa photography are OPTIONAL modules
              (SHOW_OPTIONAL_MODULES / HERO_PHOTO_ENABLED in napa-botox-facts,
              both OFF). In the production-ready state they are simply absent and
              the column goes full-width. No stock stand-in is ever substituted,
              so there is no placeholder element to render here. */}
        </div>
      </section>

      {/* 5 — Local proof: only verified, checkable facts --------------------- */}
      <section aria-labelledby="nb-h-local">
        <div className="mx-auto max-w-[1160px] px-5 py-14 md:px-8 md:py-20">
          <p className="nb-kicker">Visit us</p>
          <h2 id="nb-h-local" className="nb-serif mt-2 text-[1.75rem] md:text-[2.25rem]">
            Downtown Napa
          </h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <p className="nb-card text-[0.9375rem] leading-relaxed">
              <span className="font-semibold" style={{ color: "var(--nb-ink)" }}>Rella Aesthetics &mdash; Napa</span>
              <br />
              {NAPA.street}
              <br />
              {NAPA.cityStateZip}
            </p>
            <p className="nb-card text-[0.9375rem] leading-relaxed">{NAPA.hoursCopy}</p>
            <p className="nb-card text-[0.9375rem] leading-relaxed">{NAPA.parkingCopy}</p>
          </div>
          <p className="mt-4 text-sm" style={{ color: "var(--nb-muted)" }}>
            Allē (Botox&reg;) and Aspire (Dysport) rewards accepted.
          </p>
        </div>
      </section>

      {/* 6 — FAQ. Every entry here is also the FAQPage schema. --------------- */}
      <section className="nb-band" aria-labelledby="nb-h-faq">
        <div className="mx-auto max-w-[860px] px-5 py-14 md:px-8 md:py-20">
          <p className="nb-kicker">Questions, answered</p>
          <h2 id="nb-h-faq" className="nb-serif mt-2 text-[1.75rem] md:text-[2.25rem]">
            Before your visit
          </h2>
          <div className="mt-6">
            {FAQS.map((f) => (
              <details key={f.q} className="nb-faq">
                <summary>{f.q}</summary>
                <p className="pb-4 pl-1 pr-8 text-[0.9375rem] leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
          <p className="mt-5 text-sm">
            <a href={CANCELLATION_POLICY_URL} style={{ color: "var(--nb-clay)", fontWeight: 600 }}>
              Read our cancellation policy
            </a>
          </p>
        </div>
      </section>

      {/* 7 — Closing CTA pair ----------------------------------------------- */}
      <section aria-labelledby="nb-h-book">
        <div className="mx-auto max-w-[1160px] px-5 py-14 md:px-8 md:py-20">
          <h2 id="nb-h-book" className="nb-serif text-[1.75rem] md:text-[2.25rem]">
            Ready when you are
          </h2>
          <p className="mt-3 max-w-[52ch] leading-relaxed">
            Book your {VISIT.durationCopy} new-patient visit online, or call and we&rsquo;ll get you scheduled.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <BookCta />
            <CallCta />
          </div>
          <p className="mt-8 max-w-[74ch] text-xs leading-relaxed" style={{ color: "var(--nb-muted)" }}>
            Individual results vary. Botox&reg; is a registered trademark of Allergan. Treatment eligibility is
            determined at your in-person consultation with a licensed provider. Pricing shown is current
            published pricing and may change. This page uses approved marketing analytics; our booking
            application contains no marketing tracking of any kind.
          </p>
        </div>
      </section>

      {/* 8 — Mobile sticky bar, specified by B01; hidden at >=1024px. The
             spacer guarantees it never covers the last line of content. */}
      <div className="nb-sticky-spacer" aria-hidden="true" />
      <div className="nb-sticky" role="group" aria-label="Book or call Rella Napa">
        <BookCta>Book</BookCta>
        <CallCta variant="secondary">Call</CallCta>
      </div>
    </div>
  );
}
