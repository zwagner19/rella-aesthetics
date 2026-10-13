import type { Metadata } from "next";
import Image from "next/image";
import {
  PROGRAM, ASSESSMENT, INCLUSIONS, SEPARATE_COSTS, PROVIDER, MEDICAL_DIRECTOR,
  LOCATIONS, LOCATION_SCOPE, START_DATES, PHONE, BOOKING_HREF, PUBLIC_LINKS,
  FAQS, PREVIEW_MODE, pendingCount, type Fact,
} from "@/lib/warda-program-facts";
import "../../napa/botox/napa-botox.css";
import "./warda-program.css";

/**
 * Warda-led 12-week program — PREVIEW ONLY.
 *
 * Adapted from Amie's Showit "Napa Body & Skin Reset" draft (structure: the
 * reframe → one plan → how it works → who you'll see → FAQ) and rebuilt on the
 * new Next.js site's campaign shell (B01 Napa Botox components and tokens).
 *
 * Changes from Amie's draft, deliberately:
 *  - Warda, not Dr. Wagner, is the patient-facing lead. Dr. Wagner appears only
 *    as physician owner / medical director.
 *  - No CO2 / laser / body-contouring bundle: not confirmed for the $1,000 offer.
 *  - Placeholder testimonial ("client, female, age 44") removed — no real,
 *    consented testimonial exists for this program.
 *  - "Physician-led" / "your physician reachable between visits" removed: it
 *    would misdescribe a PA-led program.
 *  - Price shown, because the owner asked for clear $1,000 pricing.
 *
 * noindex; not linked from any public page; BOOKING_HREF is null until a tested
 * Warda assessment route exists.
 */

const LOGO = "/brand/rella-logo-black.svg";
const BOOK_TARGET = BOOKING_HREF ?? "#booking-status";

export const metadata: Metadata = {
  title: "12 Weeks with Warda — Weight & Wellness Program (Preview)",
  description: "Preview of Rella Aesthetics' Warda-led 12-week weight and wellness program.",
  robots: { index: false, follow: false },
};

function Flag({ fact }: { fact: Fact }) {
  if (fact.status === "confirmed" || !PREVIEW_MODE) return null;
  return (
    <span className="wp-flag" role="note">
      Needs approval: {fact.text}
      {fact.note ? ` — ${fact.note}` : ""}
    </span>
  );
}

function BookCta({ children = "Book your $100 assessment with Warda", className = "nb-btn nb-btn--primary" }: { children?: string; className?: string }) {
  return <a className={className} href={BOOK_TARGET} data-cta="book">{children}</a>;
}

export default function WardaProgramPreviewPage() {
  const pending = pendingCount();
  return (
    <div className="nb nb-pad">
      <a className="nb-skip" href="#main">Skip to content</a>

      {PREVIEW_MODE && (
        <div className="wp-preview-banner" role="status">
          Preview only — not published, not linked, not bookable. {pending} items need approval before launch.
        </div>
      )}

      <header className="nb-header">
        {/* eslint-disable-next-line @next/next/no-img-element -- fixed-size brand SVG */}
        <img className="nb-logo" src={LOGO} alt="Rella Aesthetics" width={360} height={176} decoding="async" />
        <div className="nb-headeractions">
          <a className="nb-headertel" href={PHONE.href} data-cta="call">{PHONE.display}</a>
          <BookCta className="nb-btn nb-btn--primary nb-btn--compact">Book assessment</BookCta>
        </div>
      </header>

      <main id="main">
        {/* Hero — Warda leads */}
        <section className="nb-hero" aria-labelledby="wp-h1">
          <div className="nb-wrap wp-hero">
            <div>
              <p className="nb-eyebrow"><span>Rella Aesthetics &middot; Vacaville &amp; Napa</span></p>
              <h1 id="wp-h1" className="nb-h1" style={{ marginTop: 18 }}>
                12 weeks. One plan. Warda in your corner.
              </h1>
              <p className="nb-lede" style={{ marginTop: 18 }}>
                A 12-week weight and wellness program with Warda Harchaoui, PA-C &mdash; built around your health
                history, your goals and the way you actually live.
              </p>
              <div className="nb-actions">
                <BookCta />
                <a className="nb-btn nb-btn--secondary" href={PHONE.href} data-cta="call">Call {PHONE.display}</a>
              </div>
              <div className="nb-card" style={{ marginTop: 28, maxWidth: "32rem" }}>
                <p className="nb-kicker">At a glance</p>
                <dl style={{ marginTop: 14 }}>
                  {([
                    ["Program", PROGRAM.duration.text],
                    ["Program price", PROGRAM.price.text.replace(" for 12 weeks", "")],
                    ["Start with", `${ASSESSMENT.price.text} assessment with Warda`],
                    ["Who's first", "Our first 10 participants"],
                  ] as const).map(([k, v]) => (
                    <div key={k} className="wp-row">
                      <dt className="nb-body" style={{ margin: 0 }}>{k}</dt>
                      <dd style={{ margin: 0, fontWeight: 600, color: "var(--nb-ink)" }}>{v}</dd>
                    </div>
                  ))}
                </dl>
                <hr className="nb-rule" style={{ margin: "14px 0" }} />
                <p className="nb-body" style={{ margin: 0, fontSize: 13.5 }}>
                  Enrollment happens only after Warda confirms the program is clinically appropriate for you.
                </p>
                <Flag fact={ASSESSMENT.creditTerms} />
                <Flag fact={PROGRAM.priceType} />
              </div>
            </div>
            <figure className="wp-portrait">
              <Image src={PROVIDER.photo} alt={PROVIDER.photoAlt} width={1536} height={2048} priority sizes="(min-width: 1024px) 420px, 90vw" />
              <figcaption className="nb-body">{PROVIDER.name}</figcaption>
            </figure>
          </div>
        </section>

        {/* The reframe — adapted from Amie */}
        <section className="nb-section nb-section--tint" aria-labelledby="wp-h-reframe">
          <div className="nb-wrap">
            <p className="nb-kicker">Start here</p>
            <h2 id="wp-h-reframe" className="nb-h2" style={{ marginTop: 10 }}>You don&rsquo;t need another start-over</h2>
            <p className="nb-lede" style={{ marginTop: 16, maxWidth: "62ch" }}>
              Most people have tried the plans and the apps. What&rsquo;s often missing is someone paying attention
              &mdash; to your history, your goals and your week-to-week reality. For 12 weeks, that&rsquo;s Warda&rsquo;s job.
            </p>
          </div>
        </section>

        {/* Meet Warda */}
        <section className="nb-section" aria-labelledby="wp-h-warda">
          <div className="nb-wrap" style={{ maxWidth: 860 }}>
            <p className="nb-kicker">Who you&rsquo;ll see</p>
            <h2 id="wp-h-warda" className="nb-h2" style={{ marginTop: 10 }}>Meet Warda Harchaoui, PA-C</h2>
            <p className="nb-lede" style={{ marginTop: 16 }}>{PROVIDER.approvedBio}</p>
            <p className="nb-body" style={{ marginTop: 12 }}>
              In this program, you see Warda at your assessment and at your program visits, so the person who
              builds your plan is the person who adjusts it.
            </p>
            <Flag fact={PROVIDER.pendingIntro} />
            <Flag fact={PROVIDER.veteranLine} />
            <p className="nb-body" style={{ marginTop: 16, fontSize: 13.5 }}>{MEDICAL_DIRECTOR}</p>
          </div>
        </section>

        {/* How it works */}
        <section className="nb-section nb-section--tint" aria-labelledby="wp-h-how">
          <div className="nb-wrap">
            <p className="nb-kicker">How it works</p>
            <h2 id="wp-h-how" className="nb-h2" style={{ marginTop: 10 }}>Your 12 weeks, step by step</h2>
            <ol className="nb-grid nb-grid--3 wp-steps" style={{ marginTop: 24 }}>
              <li className="nb-card">
                <p className="nb-kicker">Step 1</p>
                <h3 className="wp-h3">Assessment with Warda</h3>
                <p className="nb-body">{ASSESSMENT.price.text}. Warda reviews your health history, current medications and goals, and tells you honestly whether this program fits.</p>
                <Flag fact={ASSESSMENT.length} />
                <Flag fact={ASSESSMENT.format} />
              </li>
              <li className="nb-card">
                <p className="nb-kicker">Step 2</p>
                <h3 className="wp-h3">Your written plan</h3>
                <p className="nb-body">If the program is appropriate, Warda explains what your 12 weeks include, what&rsquo;s billed separately and what to expect before you decide.</p>
              </li>
              <li className="nb-card">
                <p className="nb-kicker">Step 3</p>
                <h3 className="wp-h3">12 weeks of support</h3>
                <p className="nb-body">Scheduled visits and check-ins with Warda, with your plan adjusted as you go.</p>
                <Flag fact={INCLUSIONS[0].fact} />
                <Flag fact={INCLUSIONS[1].fact} />
              </li>
            </ol>
            <Flag fact={START_DATES} />
          </div>
        </section>

        {/* What's included + pricing */}
        <section className="nb-section" aria-labelledby="wp-h-included">
          <div className="nb-wrap">
            <p className="nb-kicker">No surprises</p>
            <h2 id="wp-h-included" className="nb-h2" style={{ marginTop: 10 }}>What&rsquo;s included, and what it costs</h2>
            <div className="nb-grid nb-grid--2" style={{ marginTop: 24 }}>
              <div className="nb-card">
                <p className="nb-stat">{PROGRAM.price.text.split(" ")[0]}</p>
                <p className="nb-kicker" style={{ marginTop: 6 }}>12-week program</p>
                <ul className="wp-list">
                  {INCLUSIONS.map((i) => (
                    <li key={i.label} className="nb-body">
                      {i.label}
                      <Flag fact={i.fact} />
                    </li>
                  ))}
                </ul>
                <p className="nb-body" style={{ fontSize: 13.5 }}>Not included / billed separately:</p>
                <Flag fact={SEPARATE_COSTS} />
              </div>
              <div className="nb-card nb-card--rose">
                <p className="nb-stat">{ASSESSMENT.price.text}</p>
                <p className="nb-kicker" style={{ marginTop: 6 }}>assessment with Warda</p>
                <p className="nb-body" style={{ marginTop: 10, color: "var(--nb-ink-soft)" }}>
                  Your first step. You&rsquo;ll see the payment and cancellation terms before you confirm your booking.
                </p>
                <Flag fact={ASSESSMENT.creditTerms} />
                <Flag fact={ASSESSMENT.refund} />
              </div>
            </div>
            {PREVIEW_MODE && (
              <p className="wp-flag" role="note">
                Needs approval: how this $1,000 program differs from Rella Reset (on file at $2,010; owner brief says
                $2,100). Do not describe it as a discount or as the same inclusions until confirmed.
              </p>
            )}
            <div className="nb-actions" style={{ marginTop: 24 }}><BookCta /></div>
          </div>
        </section>

        {/* First 10 */}
        <section className="nb-section nb-section--tint" aria-labelledby="wp-h-first10">
          <div className="nb-wrap" style={{ maxWidth: 860 }}>
            <p className="nb-kicker">Our first 10 participants</p>
            <h2 id="wp-h-first10" className="nb-h2" style={{ marginTop: 10 }}>Small on purpose</h2>
            <p className="nb-lede" style={{ marginTop: 16 }}>
              We&rsquo;re opening this program to 10 people first, so Warda can give each person real attention.
              We&rsquo;ll ask what&rsquo;s working and what isn&rsquo;t at the start, midpoint and end &mdash; and we&rsquo;ll use it to make the program better.
            </p>
            <p className="nb-body" style={{ marginTop: 12 }}>
              Feedback is optional. We will never ask you for a positive review, and photos or testimonials are
              always a separate choice you can say no to.
            </p>
          </div>
        </section>

        {/* Who it's for */}
        <section className="nb-section" aria-labelledby="wp-h-who">
          <div className="nb-wrap" style={{ maxWidth: 860 }}>
            <p className="nb-kicker">Is it right for me?</p>
            <h2 id="wp-h-who" className="nb-h2" style={{ marginTop: 10 }}>Who this program is for</h2>
            <p className="nb-lede" style={{ marginTop: 16 }}>
              Adults who want medically supervised help with weight and overall wellness, and who want a clinician
              who knows their name. Eligibility is decided by Warda at your assessment &mdash; not everyone is a fit,
              and she&rsquo;ll tell you if something else would serve you better.
            </p>
            <p className="nb-body" style={{ marginTop: 12 }}>
              Already in a Rella weight-loss program? Please call us instead of booking, and we&rsquo;ll connect you with your provider.
            </p>
          </div>
        </section>

        {/* Locations */}
        <section className="nb-section nb-section--tint" aria-labelledby="wp-h-where">
          <div className="nb-wrap">
            <p className="nb-kicker">Where</p>
            <h2 id="wp-h-where" className="nb-h2" style={{ marginTop: 10 }}>Vacaville &amp; Napa</h2>
            <div className="nb-grid nb-grid--2" style={{ marginTop: 20 }}>
              {LOCATIONS.map((l) => (
                <p key={l.id} className="nb-card nb-body" style={{ margin: 0 }}>
                  <span style={{ fontWeight: 600, color: "var(--nb-ink)" }}>{l.name}</span><br />{l.street}<br />{l.city}
                </p>
              ))}
            </div>
            <Flag fact={LOCATION_SCOPE} />
          </div>
        </section>

        {/* FAQ */}
        <section className="nb-section" aria-labelledby="wp-h-faq">
          <div className="nb-wrap" style={{ maxWidth: 860 }}>
            <p className="nb-kicker">Questions, answered</p>
            <h2 id="wp-h-faq" className="nb-h2" style={{ marginTop: 10 }}>Before you book</h2>
            <div style={{ marginTop: 22 }}>
              {FAQS.filter((f) => PREVIEW_MODE || f.status === "confirmed").map((f) => (
                <details key={f.q} className="nb-faq">
                  <summary>{f.q}</summary>
                  <p className={`nb-body ${f.status === "pending" ? "wp-pending" : ""}`} style={{ padding: "0 32px 16px 4px", margin: 0 }}>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Booking status + closing CTA */}
        <section id="booking-status" className="nb-section nb-section--tint" aria-labelledby="wp-h-book">
          <div className="nb-wrap">
            <h2 id="wp-h-book" className="nb-h2">Start with an assessment</h2>
            <p className="nb-lede" style={{ marginTop: 14, maxWidth: "56ch" }}>
              Book your {ASSESSMENT.price.text} assessment with Warda online, or call and we&rsquo;ll find a time.
            </p>
            {!BOOKING_HREF && PREVIEW_MODE && (
              <p className="wp-flag" role="note">
                Launch blocker: online booking is not connected. No Warda assessment appointment type exists yet in
                the booking app; the current weight-loss route is a 30-minute phone consult with Dr. Wagner.
              </p>
            )}
            <div className="nb-actions" style={{ marginTop: 22 }}>
              <BookCta />
              <a className="nb-btn nb-btn--secondary" href={PHONE.href} data-cta="call">Call {PHONE.display}</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="nb-footer">
        <div className="nb-wrap">
          <p className="nb-footer-legal">
            Individual results vary; no specific outcome is promised. Program eligibility, any medication, and any lab
            work are determined by a licensed clinician after an assessment and are not guaranteed. {MEDICAL_DIRECTOR}{" "}
            This page does not collect health information; health questions are handled privately in our clinical
            system after you book. If you accept cookies, ad-click information goes only to Rella&rsquo;s first-party
            booking attribution service, never your health details.
          </p>
          <div className="nb-footer-row">
            {/* eslint-disable-next-line @next/next/no-img-element -- see header */}
            <img src={LOGO} alt="Rella Aesthetics" width={360} height={176} style={{ width: 96, height: "auto" }} decoding="async" />
            <div className="nb-footer-links">
              <a href={PUBLIC_LINKS.privacy}>Privacy Policy</a>
              <a href={PUBLIC_LINKS.terms}>Terms &amp; Conditions</a>
              <a href={PUBLIC_LINKS.cancellation}>Cancellation policy</a>
              <span style={{ color: "var(--nb-muted)" }}>&copy; 2026 Rella Aesthetics</span>
            </div>
          </div>
        </div>
      </footer>

      <div className="nb-sticky" role="group" aria-label="Book or call Rella">
        <a className="nb-sticky-book" href={BOOK_TARGET} data-cta="book">Book assessment</a>
        <a className="nb-sticky-call" href={PHONE.href} data-cta="call">Call Rella</a>
      </div>
    </div>
  );
}
