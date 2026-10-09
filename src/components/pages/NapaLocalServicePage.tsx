import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { FaqAccordion, FaqSchema } from "@/components/blocks/FaqAccordion";
import { TrustStrip } from "@/components/blocks/TrustStrip";
import { resolveBookingHref } from "@/lib/booking-routes";
import { locations } from "@/lib/data";
import { LOCATION_ENTITY_IDS, localBusinessSchema } from "@/lib/schemas";

const clinic = locations.napa;
const PHONE_HREF = "tel:+17073582928";
const PHONE_LABEL = "707.358.2928";

export interface NapaLocalServiceContent {
  slug: string;
  service: string;
  eyebrow: string;
  heading: string;
  lede: string;
  image: { src: string; alt: string };
  schemaName: string;
  schemaServiceType: string;
  description: string;
  cards: readonly { title: string; body: string }[];
  price: { headline: string; detail: string };
  faqs: readonly { question: string; answer: string }[];
  closing: { heading: string; body: string };
  guide: { href: string; label: string };
}

export function napaCanonical(slug: string): string {
  return `https://experiencerella.com/napa/${slug}`;
}

/**
 * Shared shell for the Napa clinic-specific treatment pages that the live
 * WordPress site ranks for. Each page keeps its own published facts, prices,
 * and questions; the clinic address, phone, and hours come from `locations`.
 */
export function NapaLocalServicePage({ content }: { content: NapaLocalServiceContent }) {
  const canonical = napaCanonical(content.slug);
  const bookingHref = resolveBookingHref({ location: "napa", service: content.service });
  const fullAddress = `${clinic.address}, ${clinic.city}, ${clinic.state} ${clinic.zip}`;
  const hours = clinic.hours.join(" · ");
  const headingId = `napa-${content.slug}`;

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${canonical}#service`,
    name: content.schemaName,
    serviceType: content.schemaServiceType,
    description: content.description,
    url: canonical,
    image: `https://experiencerella.com${content.image.src}`,
    provider: {
      "@type": ["MedicalBusiness", "DaySpa"],
      "@id": LOCATION_ENTITY_IDS.napa,
      name: "Rella Aesthetics — Napa",
      telephone: "+17073582928",
      address: {
        "@type": "PostalAddress",
        streetAddress: clinic.address,
        addressLocality: clinic.city,
        addressRegion: clinic.state,
        postalCode: clinic.zip,
        addressCountry: "US",
      },
    },
    areaServed: {
      "@type": "City",
      name: "Napa",
      containedInPlace: { "@type": "State", name: "California" },
    },
  };

  return (
    <>
      <FaqSchema items={content.faqs} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceSchema).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema(clinic)).replace(/</g, "\\u003c"),
        }}
      />

      <section className="overflow-hidden bg-paper py-16 md:py-24">
        <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-6 md:px-8 lg:grid-cols-[1.04fr_0.96fr] lg:px-12">
          <div>
            <p className="mb-5 text-[0.6875rem] font-bold uppercase tracking-[0.22em] text-rose-text">
              {content.eyebrow}
            </p>
            <h1 className="mb-6 text-[clamp(2.75rem,6vw,4.9rem)] font-medium leading-[0.98] tracking-[-0.06em] text-rose-text">
              {content.heading}
            </h1>
            <p className="mb-8 max-w-[650px] text-lg font-light leading-relaxed text-silver-dark md:text-xl">
              {content.lede}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button disableHover href={bookingHref} data-cta="service-booking" className="rounded-full">
                Book My Napa Appointment
              </Button>
              <Button disableHover href={PHONE_HREF} data-cta="phone" variant="ghost" className="rounded-full bg-white/75">
                Call {PHONE_LABEL}
              </Button>
            </div>
          </div>

          <div className="relative aspect-square self-center overflow-hidden bg-rose-blush sm:aspect-[4/3]">
            <Image
              src={content.image.src}
              alt={content.image.alt}
              fill
              preload
              className="object-cover object-center"
              sizes="(min-width: 1024px) 46vw, 92vw"
            />
            <div className="absolute inset-x-0 bottom-0 border-t border-white/30 bg-white/94 p-5 md:p-6">
              <p className="mb-2 text-[0.625rem] font-bold uppercase tracking-[0.2em] text-rose-text">Rella Aesthetics — Napa</p>
              <p className="text-lg font-medium leading-snug text-ink">{clinic.address} · {hours}</p>
            </div>
          </div>
        </div>
      </section>

      <TrustStrip
        ariaLabel={`Rella Napa ${content.slug} visit facts`}
        items={["Physician-owned", "Downtown Napa", "Free consultations", "Online booking"]}
      />

      <section className="py-20 md:py-28" aria-labelledby={`${headingId}-details`}>
        <div className="mx-auto max-w-[1120px] px-6 md:px-8">
          <h2 id={`${headingId}-details`} className="sr-only">
            About {content.schemaName}
          </h2>
          <div className="grid gap-5 md:grid-cols-3">
            {content.cards.map((card) => (
              <article key={card.title} className="border border-ink/12 bg-white p-7">
                <h3 className="mb-4 text-xl font-medium text-rose-text">{card.title}</h3>
                <p className="text-sm leading-7 text-ink/70">{card.body}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 flex flex-col items-start justify-between gap-5 border border-rose bg-rose-blush p-7 md:flex-row md:items-center md:p-9">
            <div>
              <p className="mb-2 text-3xl font-medium tracking-[-0.04em] text-ink">{content.price.headline}</p>
              <p className="text-sm leading-7 text-silver-dark">{content.price.detail}</p>
            </div>
            <Link href={content.guide.href} className="shrink-0 text-sm font-semibold text-rose-text underline decoration-rose-light underline-offset-4 hover:text-rose-text">
              {content.guide.label} →
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-rose-blush py-20 md:py-24" aria-labelledby={`${headingId}-visit`}>
        <div className="mx-auto grid max-w-[1000px] gap-8 px-6 md:grid-cols-[1fr_auto] md:items-center md:px-8">
          <div>
            <p className="mb-3 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-text">Visit Rella Napa</p>
            <h2 id={`${headingId}-visit`} className="mb-3 text-3xl font-medium tracking-[-0.035em] text-rose-text">
              {fullAddress}
            </h2>
            <p className="text-ink/70">{hours}</p>
            <p className="mt-2 text-ink/70">Street and garage parking within one block.</p>
          </div>
          <div className="flex flex-col gap-3">
            <Button href={bookingHref} data-cta="service-booking" disableHover className="rounded-full">Book Napa Now</Button>
            <Button href={clinic.mapUrl} variant="ghost" disableHover className="rounded-full bg-white">Get Directions</Button>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28" aria-labelledby={`${headingId}-faq`}>
        <div className="mx-auto max-w-[900px] px-6 md:px-8">
          <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-text">Questions, answered</p>
          <h2 id={`${headingId}-faq`} className="mb-8 text-3xl font-medium tracking-[-0.035em] text-rose-text md:text-5xl">
            {content.schemaName} FAQ
          </h2>
          <FaqAccordion items={content.faqs} />
        </div>
      </section>

      <section className="bg-rose py-20 text-center text-white" aria-labelledby={`${headingId}-next-step`}>
        <div className="mx-auto max-w-[720px] px-6">
          <h2 id={`${headingId}-next-step`} className="mb-4 text-3xl font-medium tracking-[-0.035em] md:text-5xl">
            {content.closing.heading}
          </h2>
          <p className="mb-8 text-lg font-light leading-relaxed text-white">{content.closing.body}</p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button disableHover href={bookingHref} data-cta="service-booking" className="rounded-full bg-white !text-rose-text">
              Book Napa Now
            </Button>
            <Button disableHover href={PHONE_HREF} data-cta="phone" variant="ghost">
              Call Rella Napa
            </Button>
          </div>
          <p className="mt-6 text-xs leading-6 text-white">
            Individual results vary; treatment plans are personalized at your consultation.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-white">
            <Link href="/payment-plans" className="underline underline-offset-4 hover:text-white">Payment plans</Link>
            <Link href="/cancellation-policy" className="underline underline-offset-4 hover:text-white">Cancellation policy</Link>
            <Link href="/locations/napa" className="underline underline-offset-4 hover:text-white">Napa clinic details</Link>
          </div>
        </div>
      </section>
    </>
  );
}
