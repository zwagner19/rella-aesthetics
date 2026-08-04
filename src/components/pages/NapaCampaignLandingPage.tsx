import { resolveBookingHref } from "@/lib/booking-routes";
import {
  MARKETING_PHONE,
  NAPA,
  TRUST,
} from "@/lib/napa-botox-facts";
import {
  NAPA_CAMPAIGN_SERVICE_ORDER,
  NAPA_CAMPAIGN_SERVICES,
  type NapaCampaignService,
} from "@/lib/napa-campaign-services";

const LOGO = "/brand/rella-logo-black.svg";
const DIRECTIONS_HREF =
  "https://maps.google.com/?q=1541+3rd+St+Napa+CA+94559";

const PUBLIC_LINKS = {
  napa: "https://experiencerella.com/napa",
  privacy: "https://experiencerella.com/privacy-policy/",
  terms: "https://experiencerella.com/terms-and-conditions/",
} as const;

type BookCtaProps = {
  href: string;
  service: string;
  children: string;
  className?: string;
};

function BookCta({
  href,
  service,
  children,
  className = "nb-btn nb-btn--primary",
}: BookCtaProps) {
  return (
    <a
      className={className}
      href={href}
      data-cta="book"
      data-gtm="booking_start"
      data-service={service}
    >
      {children}
    </a>
  );
}

function CallCta({
  children = `Call ${MARKETING_PHONE.display}`,
  className = "nb-btn nb-btn--secondary",
}: {
  children?: string;
  className?: string;
}) {
  return (
    <a className={className} href={MARKETING_PHONE.href} data-cta="call">
      {children}
    </a>
  );
}

function CampaignHeader({
  bookingHref,
  trackingService,
  primaryCta,
}: {
  bookingHref: string;
  trackingService: string;
  primaryCta: string;
}) {
  return (
    <header className="nb-header">
      {/* eslint-disable-next-line @next/next/no-img-element -- fixed-size SVG wordmark */}
      <img
        className="nb-logo"
        src={LOGO}
        alt="Rella Aesthetics"
        width={360}
        height={176}
        decoding="async"
      />
      <div className="nb-headeractions">
        <a
          className="nb-headertel"
          href={MARKETING_PHONE.href}
          data-cta="call"
        >
          {MARKETING_PHONE.display}
        </a>
        <BookCta
          href={bookingHref}
          service={trackingService}
          className="nb-btn nb-btn--primary nb-btn--compact"
        >
          {primaryCta}
        </BookCta>
      </div>
    </header>
  );
}

function LocalVisit() {
  return (
    <section className="nb-section" aria-labelledby="nb-h-local">
      <div className="nb-wrap">
        <p className="nb-kicker">Visit Rella Napa</p>
        <h2 id="nb-h-local" className="nb-h2" style={{ marginTop: 10 }}>
          Downtown on 3rd Street
        </h2>
        <div className="nb-grid nb-grid--3" style={{ marginTop: 20 }}>
          <p className="nb-card nb-body" style={{ margin: 0 }}>
            <span style={{ fontWeight: 600, color: "var(--nb-ink)" }}>
              Rella Aesthetics — Napa
            </span>
            <br />
            {NAPA.street}
            <br />
            {NAPA.cityStateZip}
          </p>
          <p className="nb-card nb-body" style={{ margin: 0 }}>
            {NAPA.hoursCopy}
          </p>
          <p className="nb-card nb-body" style={{ margin: 0 }}>
            {NAPA.parkingCopy}
          </p>
        </div>
        <div className="nb-actions" style={{ marginTop: 20 }}>
          <a
            className="nb-btn nb-btn--quiet nb-btn--compact"
            href={DIRECTIONS_HREF}
          >
            Get directions
          </a>
          <CallCta className="nb-btn nb-btn--quiet nb-btn--compact">
            Call Rella Napa
          </CallCta>
        </div>
      </div>
    </section>
  );
}

function CampaignFooter({ legal }: { legal: string }) {
  return (
    <footer className="nb-footer">
      <div className="nb-wrap">
        <p className="nb-footer-legal">
          {legal} Pricing shown is the approved public pricing verified July
          24, 2026 and may change. Booking is completed through Boulevard; do
          not place sensitive medical information in advertising or analytics
          fields.
        </p>
        <div className="nb-footer-row">
          {/* eslint-disable-next-line @next/next/no-img-element -- fixed-size SVG wordmark */}
          <img
            src={LOGO}
            alt="Rella Aesthetics"
            width={360}
            height={176}
            style={{ width: 96, height: "auto" }}
            decoding="async"
          />
          <div className="nb-footer-links">
            <a href={PUBLIC_LINKS.napa}>Explore Napa services</a>
            <a href={PUBLIC_LINKS.privacy}>Privacy Policy</a>
            <a href={PUBLIC_LINKS.terms}>Terms &amp; Conditions</a>
            <span style={{ color: "var(--nb-muted)" }}>
              &copy; 2026 Rella Aesthetics
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function campaignSchema(service: NapaCampaignService) {
  const canonical = `https://experiencerella.com/napa/${service.slug}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${canonical}#service`,
        name: `${service.title} in Napa`,
        serviceType: service.title,
        description: service.metaDescription,
        url: canonical,
        provider: {
          "@type": "MedicalBusiness",
          "@id": "https://experiencerella.com/napa#location",
          name: "Rella Aesthetics — Napa",
          telephone: "+17073582928",
          address: {
            "@type": "PostalAddress",
            streetAddress: NAPA.street,
            addressLocality: "Napa",
            addressRegion: "CA",
            postalCode: "94559",
            addressCountry: "US",
          },
        },
        areaServed: {
          "@type": "City",
          name: "Napa",
          containedInPlace: { "@type": "State", name: "California" },
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: service.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      },
    ],
  };
}

export function NapaCampaignLandingPage({
  service,
}: {
  service: NapaCampaignService;
}) {
  const bookingHref = resolveBookingHref({
    location: "napa",
    service: service.bookingService,
  });
  const schema = campaignSchema(service);

  return (
    <div className="nb nb-pad">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />
      <a className="nb-skip" href="#main">
        Skip to content
      </a>

      <CampaignHeader
        bookingHref={bookingHref}
        trackingService={service.trackingService}
        primaryCta={service.primaryCta}
      />

      <main id="main">
        <section className="nb-hero" aria-labelledby="nb-h1">
          <div className="nb-wrap">
            <p className="nb-eyebrow">
              <span>Rella Aesthetics · Downtown Napa</span>
            </p>
            <h1 id="nb-h1" className="nb-h1" style={{ marginTop: 18 }}>
              {service.heroTitle}
            </h1>
            <p className="nb-lede" style={{ marginTop: 18 }}>
              {service.heroDescription}
            </p>
            <div className="nb-actions">
              <BookCta
                href={bookingHref}
                service={service.trackingService}
              >
                {service.primaryCta}
              </BookCta>
              <CallCta />
            </div>
            <p className="nb-body" style={{ marginTop: 16 }}>
              {TRUST.physicianOwned} · {TRUST.ownerCredential}
            </p>

            <div
              className="nb-card"
              style={{ marginTop: 28, maxWidth: "34rem" }}
            >
              <p className="nb-kicker">Napa appointment</p>
              <p className="nb-body" style={{ marginBottom: 0 }}>
                {NAPA.street}, {NAPA.cityStateZip}
                <br />
                {NAPA.hoursCopy} · {NAPA.parkingCopy}
              </p>
            </div>
          </div>
        </section>

        <section
          className="nb-section nb-section--tint"
          aria-labelledby="nb-h-intro"
        >
          <div className="nb-wrap">
            <p className="nb-kicker">{service.introKicker}</p>
            <h2 id="nb-h-intro" className="nb-h2" style={{ marginTop: 10 }}>
              {service.introHeading}
            </h2>
            <p
              className="nb-lede"
              style={{ marginTop: 16, maxWidth: "66ch" }}
            >
              {service.introBody}
            </p>
            <div className="nb-grid nb-grid--2" style={{ marginTop: 24 }}>
              {service.highlights.map((item) => (
                <div key={item.title} className="nb-card">
                  <h3
                    style={{
                      margin: 0,
                      fontSize: 18,
                      color: "var(--nb-ink)",
                    }}
                  >
                    {item.title}
                  </h3>
                  <p className="nb-body" style={{ marginBottom: 0 }}>
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="nb-section" aria-labelledby="nb-h-pricing">
          <div className="nb-wrap">
            <p className="nb-kicker">Transparent pricing</p>
            <h2
              id="nb-h-pricing"
              className="nb-h2"
              style={{ marginTop: 10 }}
            >
              {service.pricingHeading}
            </h2>
            <p
              className="nb-lede"
              style={{ marginTop: 16, maxWidth: "66ch" }}
            >
              {service.pricingBody}
            </p>
            <div className="nb-grid nb-grid--3" style={{ marginTop: 24 }}>
              {service.priceCards.map((card) => (
                <div
                  key={card.label}
                  className={`nb-card${card.accent ? " nb-card--rose" : ""}`}
                >
                  <p className="nb-stat">{card.value}</p>
                  <p className="nb-kicker" style={{ marginTop: 8 }}>
                    {card.label}
                  </p>
                  <p className="nb-body" style={{ marginBottom: 0 }}>
                    {card.body}
                  </p>
                </div>
              ))}
            </div>
            <div className="nb-actions" style={{ marginTop: 28 }}>
              <BookCta
                href={bookingHref}
                service={service.trackingService}
              >
                {service.primaryCta}
              </BookCta>
              <CallCta />
            </div>
          </div>
        </section>

        <section
          className="nb-section nb-section--tint"
          aria-labelledby="nb-h-visit"
        >
          <div className="nb-wrap">
            <p className="nb-kicker">Your visit</p>
            <h2 id="nb-h-visit" className="nb-h2" style={{ marginTop: 10 }}>
              {service.visitHeading}
            </h2>
            <p
              className="nb-lede"
              style={{ marginTop: 16, maxWidth: "66ch" }}
            >
              {service.visitBody}
            </p>
            <ol className="nb-grid nb-grid--2 nb-step-list" style={{ marginTop: 24 }}>
              {service.visitSteps.map((step, index) => (
                <li key={step} className="nb-card nb-body">
                  <span className="nb-step-number" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="nb-section" aria-labelledby="nb-h-trust">
          <div className="nb-wrap">
            <p className="nb-kicker">Physician-owned</p>
            <h2 id="nb-h-trust" className="nb-h2" style={{ marginTop: 10 }}>
              Clear recommendations. No pressure.
            </h2>
            <p
              className="nb-lede"
              style={{ marginTop: 16, maxWidth: "66ch" }}
            >
              Rella Aesthetics is owned by Zachary Wagner, DO. The treating
              provider reviews candidacy, the proposed plan, expected cost, and
              relevant aftercare before you decide whether to proceed.
            </p>
          </div>
        </section>

        <LocalVisit />

        <section
          className="nb-section nb-section--tint"
          aria-labelledby="nb-h-faq"
        >
          <div className="nb-wrap" style={{ maxWidth: 860 }}>
            <p className="nb-kicker">Questions, answered</p>
            <h2 id="nb-h-faq" className="nb-h2" style={{ marginTop: 10 }}>
              Before you book
            </h2>
            <div style={{ marginTop: 22 }}>
              {service.faqs.map((faq) => (
                <details key={faq.q} className="nb-faq">
                  <summary>{faq.q}</summary>
                  <p
                    className="nb-body"
                    style={{ padding: "0 32px 16px 4px", margin: 0 }}
                  >
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="nb-section" aria-labelledby="nb-h-book">
          <div className="nb-wrap">
            <h2 id="nb-h-book" className="nb-h2">
              Ready for a clear next step?
            </h2>
            <p
              className="nb-lede"
              style={{ marginTop: 14, maxWidth: "54ch" }}
            >
              Book the Napa path shown on this page, or call the team if you
              want help choosing the right visit.
            </p>
            <div className="nb-actions" style={{ marginTop: 22 }}>
              <BookCta
                href={bookingHref}
                service={service.trackingService}
              >
                {service.primaryCta}
              </BookCta>
              <CallCta />
            </div>
          </div>
        </section>
      </main>

      <CampaignFooter legal={service.legal} />

      <div
        className="nb-sticky"
        role="group"
        aria-label={`Book ${service.title} or call Rella Napa`}
      >
        <BookCta
          href={bookingHref}
          service={service.trackingService}
          className="nb-sticky-book"
        >
          {service.primaryCta}
        </BookCta>
        <a
          className="nb-sticky-call"
          href={MARKETING_PHONE.href}
          data-cta="call"
        >
          Call Rella
        </a>
      </div>
    </div>
  );
}

function hubSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["MedicalBusiness", "DaySpa"],
    "@id": "https://experiencerella.com/napa#location",
    name: "Rella Aesthetics — Napa",
    url: "https://experiencerella.com/napa",
    telephone: "+17073582928",
    address: {
      "@type": "PostalAddress",
      streetAddress: NAPA.street,
      addressLocality: "Napa",
      addressRegion: "CA",
      postalCode: "94559",
      addressCountry: "US",
    },
    hasMap: DIRECTIONS_HREF,
    parentOrganization: {
      "@type": "Organization",
      "@id": "https://experiencerella.com/#organization",
      name: "Rella Aesthetics",
    },
  };
}

export function NapaCampaignHub() {
  const bookingHref = resolveBookingHref({ location: "napa" });
  const trackingService = "napa-med-spa";

  return (
    <div className="nb nb-pad">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(hubSchema()).replace(/</g, "\\u003c"),
        }}
      />
      <a className="nb-skip" href="#main">
        Skip to content
      </a>
      <CampaignHeader
        bookingHref={bookingHref}
        trackingService={trackingService}
        primaryCta="Book Rella Napa"
      />

      <main id="main">
        <section className="nb-hero" aria-labelledby="nb-h1">
          <div className="nb-wrap">
            <p className="nb-eyebrow">
              <span>1541 3rd St · Downtown Napa</span>
            </p>
            <h1 id="nb-h1" className="nb-h1" style={{ marginTop: 18 }}>
              Rella Aesthetics — Napa
            </h1>
            <p className="nb-lede" style={{ marginTop: 18 }}>
              Physician-owned aesthetic and wellness care with direct booking
              paths, current public pricing, and a downtown Napa location.
            </p>
            <div className="nb-actions">
              <BookCta href={bookingHref} service={trackingService}>
                Book Rella Napa
              </BookCta>
              <CallCta />
            </div>
            <p className="nb-body" style={{ marginTop: 16 }}>
              Zachary Wagner, DO — Physician Owner · American Board of Obesity
              Medicine diplomate
            </p>
          </div>
        </section>

        <section className="nb-section" aria-labelledby="nb-h-services">
          <div className="nb-wrap">
            <p className="nb-kicker">Choose the right starting point</p>
            <h2
              id="nb-h-services"
              className="nb-h2"
              style={{ marginTop: 10 }}
            >
              Napa services with a direct path
            </h2>
            <p
              className="nb-lede"
              style={{ marginTop: 16, maxWidth: "66ch" }}
            >
              Each page below keeps the Napa location, service intent, current
              pricing, and booking destination aligned.
            </p>
            <div className="nb-grid nb-grid--2" style={{ marginTop: 24 }}>
              <a className="nb-card nb-service-card" href="/napa/botox">
                <span className="nb-kicker">Injectables</span>
                <strong>Botox &amp; Dysport</strong>
                <span className="nb-body">
                  Botox $18/unit · Dysport $6/unit · 30-minute new-patient visit
                </span>
                <span className="nb-service-arrow" aria-hidden="true">
                  Explore →
                </span>
              </a>
              {NAPA_CAMPAIGN_SERVICE_ORDER.map((slug) => {
                const service = NAPA_CAMPAIGN_SERVICES[slug];
                const price = service.priceCards[0];
                return (
                  <a
                    key={service.slug}
                    className="nb-card nb-service-card"
                    href={`/napa/${service.slug}`}
                  >
                    <span className="nb-kicker">Napa service</span>
                    <strong>{service.title}</strong>
                    <span className="nb-body">
                      {price.value} · {price.label}
                    </span>
                    <span className="nb-service-arrow" aria-hidden="true">
                      Explore →
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        <section
          className="nb-section nb-section--tint"
          aria-labelledby="nb-h-owner"
        >
          <div className="nb-wrap">
            <p className="nb-kicker">Physician-owned</p>
            <h2 id="nb-h-owner" className="nb-h2" style={{ marginTop: 10 }}>
              A practice with an accountable owner
            </h2>
            <p
              className="nb-lede"
              style={{ marginTop: 16, maxWidth: "66ch" }}
            >
              Rella Aesthetics is owned by Zachary Wagner, DO. Dr. Wagner is an
              American Board of Obesity Medicine diplomate. That credential
              relates to Rella&apos;s medical weight-management program; aesthetic
              treatment decisions remain with the appropriately licensed
              treating provider.
            </p>
            <div className="nb-actions" style={{ marginTop: 22 }}>
              <a
                className="nb-btn nb-btn--quiet"
                href="https://experiencerella.com/about/"
              >
                Meet Dr. Wagner
              </a>
            </div>
          </div>
        </section>

        <LocalVisit />

        <section className="nb-section" aria-labelledby="nb-h-book">
          <div className="nb-wrap">
            <h2 id="nb-h-book" className="nb-h2">
              Not sure which service to choose?
            </h2>
            <p
              className="nb-lede"
              style={{ marginTop: 14, maxWidth: "54ch" }}
            >
              Use the general Napa booking menu or call the team for help
              choosing the appropriate starting visit.
            </p>
            <div className="nb-actions" style={{ marginTop: 22 }}>
              <BookCta href={bookingHref} service={trackingService}>
                Open Napa booking
              </BookCta>
              <CallCta />
            </div>
          </div>
        </section>
      </main>

      <CampaignFooter legal="Individual results vary. Service eligibility and treatment planning are determined with the appropriate licensed provider." />

      <div
        className="nb-sticky"
        role="group"
        aria-label="Book or call Rella Napa"
      >
        <BookCta
          href={bookingHref}
          service={trackingService}
          className="nb-sticky-book"
        >
          Book Rella Napa
        </BookCta>
        <a
          className="nb-sticky-call"
          href={MARKETING_PHONE.href}
          data-cta="call"
        >
          Call Rella
        </a>
      </div>
    </div>
  );
}
