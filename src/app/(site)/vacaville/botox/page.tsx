import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { FaqAccordion, FaqSchema } from "@/components/blocks/FaqAccordion";
import { TrustStrip } from "@/components/blocks/TrustStrip";
import { resolveBookingHref } from "@/lib/booking-routes";
import { locations } from "@/lib/data";
import { PRICING } from "@/lib/napa-botox-facts";
import { localBusinessSchema } from "@/lib/schemas";

const CANONICAL = "https://experiencerella.com/vacaville/botox";
const BOOKING_HREF = resolveBookingHref({ location: "vacaville", service: "botox" });
const clinic = locations.vacaville;

export const metadata: Metadata = {
  title: "Botox in Vacaville, CA | Pricing & Visit Guide",
  description:
    "Explore current Botox and Dysport pricing, product-specific timing, and what to expect at physician-owned Rella Aesthetics, 542 Main St in Vacaville.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Botox in Vacaville, CA | Rella Aesthetics",
    description:
      "Current Botox and Dysport pricing, clear visit details, and Vacaville-specific booking at Rella Aesthetics.",
    url: CANONICAL,
    type: "website",
    images: [
      {
        url: "/images/service-botox.jpg",
        alt: "Botox and Dysport consultation at Rella Aesthetics in Vacaville",
      },
    ],
  },
};

const faqs = [
  {
    question: "How much are Botox and Dysport at Rella Vacaville?",
    answer: `Standard Botox pricing is ${PRICING.botoxPerUnit}/unit and Dysport is ${PRICING.dysportPerUnit}/unit. The 2026 Tox Membership is ${PRICING.membershipMonthly}/month with a one-year commitment; member rates are ${PRICING.memberBotoxPerUnit}/unit for Botox and ${PRICING.memberDysportPerUnit}/unit for Dysport. Your provider reviews the proposed units and expected total before treatment.`,
  },
  {
    question: "How many units will I need?",
    answer:
      "That depends on the product, treatment area, facial movement, prior treatment, and your goals. Your provider maps the proposed units and expected total during the consultation before treatment.",
  },
  {
    question: "When do Botox and Dysport results appear?",
    answer:
      "Botox softening may begin in 4–7 days, while Dysport can show results in 2–5 days. Full effect is assessed around two weeks, and individual response varies.",
  },
  {
    question: "How long do results typically last?",
    answer:
      "Results commonly last around 3–4 months, but timing varies by person, product, treatment area, dose, and treatment plan.",
  },
  {
    question: "Where is Rella Aesthetics in Vacaville?",
    answer:
      "Rella Aesthetics is at 542 Main St in downtown Vacaville, CA 95688. Current published clinic hours are Wednesday through Saturday, 9am–5pm.",
  },
  {
    question: "What happens when I select the booking button?",
    answer:
      "The button opens Rella Vacaville's live New Patient Tox service and displays Select a professional. Review the appointment details and current booking terms before confirming.",
  },
] as const;

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${CANONICAL}#service`,
  name: "Botox and Dysport in Vacaville",
  serviceType: "Neuromodulator consultation and treatment",
  description: metadata.description,
  url: CANONICAL,
  image: "https://experiencerella.com/images/service-botox.jpg",
  provider: {
    "@type": ["MedicalBusiness", "DaySpa"],
    "@id": "https://experiencerella.com/locations/vacaville#location",
    name: "Rella Aesthetics — Vacaville",
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
    name: "Vacaville",
    containedInPlace: { "@type": "State", name: "California" },
  },
};

const pricingCards = [
  {
    value: `${PRICING.botoxPerUnit}/unit`,
    label: "Botox · standard",
    detail: "Product-specific units and total are mapped before treatment.",
  },
  {
    value: `${PRICING.dysportPerUnit}/unit`,
    label: "Dysport · standard",
    detail: "Dysport units are product-specific and not interchangeable with Botox units.",
  },
  {
    value: `${PRICING.membershipMonthly}/month`,
    label: "2026 Tox Membership",
    detail: `${PRICING.memberBotoxPerUnit}/unit Botox · ${PRICING.memberDysportPerUnit}/unit Dysport · one-year commitment.`,
  },
] as const;

export default function VacavilleBotoxPage() {
  return (
    <>
      <FaqSchema items={faqs} />
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

      <section className="overflow-hidden bg-[linear-gradient(135deg,#fff_0%,#FDF7F5_56%,#FBE7E3_100%)] py-16 md:py-24">
        <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-6 md:px-8 lg:grid-cols-[1.04fr_0.96fr] lg:px-12">
          <div>
            <p className="mb-5 text-[0.6875rem] font-bold uppercase tracking-[0.22em] text-rose-dark">
              Injectables · Downtown Vacaville
            </p>
            <h1 className="mb-6 text-[clamp(2.75rem,6vw,4.9rem)] font-medium leading-[0.98] tracking-[-0.06em] text-ink">
              Botox &amp; Dysport in Vacaville.
            </h1>
            <p className="mb-8 max-w-[650px] text-lg font-light leading-relaxed text-silver-dark md:text-xl">
              Current per-unit pricing, product-specific timing, and a consultation-led plan at physician-owned Rella Aesthetics on Main Street.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button href={BOOKING_HREF} data-cta="service-booking" className="rounded-full">
                Book New Patient Tox
              </Button>
              <Button href="tel:+17073582928" data-cta="phone" variant="ghost" className="rounded-full bg-white/75">
                Call 707.358.2928
              </Button>
            </div>
            <p className="mt-5 text-xs leading-6 text-silver">
              Opens Rella Vacaville&apos;s live New Patient Tox service with Select a professional as the next step.
            </p>
          </div>

          <div className="relative min-h-[390px] overflow-hidden rounded-[2rem] shadow-[0_24px_80px_rgba(90,94,98,0.18)] md:min-h-[520px]">
            <Image
              src="/images/service-botox.jpg"
              alt="Botox and Dysport consultation at Rella Aesthetics in Vacaville"
              fill
              priority
              className="object-cover"
              sizes="(min-width: 1024px) 46vw, 92vw"
            />
            <div className="absolute inset-x-4 bottom-4 rounded-[1.35rem] bg-white/94 p-5 shadow-lg backdrop-blur md:inset-x-6 md:bottom-6 md:p-6">
              <p className="mb-2 text-[0.625rem] font-bold uppercase tracking-[0.2em] text-rose-dark">Rella Aesthetics — Vacaville</p>
              <p className="text-lg font-medium leading-snug text-ink">542 Main St · Wednesday–Saturday, 9am–5pm</p>
            </div>
          </div>
        </div>
      </section>

      <TrustStrip
        ariaLabel="Rella Vacaville Botox visit facts"
        items={["Physician-owned", "Current public pricing", "Downtown Vacaville", "Plan before treatment"]}
      />

      <section className="py-20 md:py-28" aria-labelledby="vacaville-botox-pricing">
        <div className="mx-auto max-w-[1120px] px-6 md:px-8">
          <div className="mb-12 max-w-[760px]">
            <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-dark">Pricing first</p>
            <h2 id="vacaville-botox-pricing" className="mb-5 text-3xl font-medium tracking-[-0.04em] text-ink md:text-5xl">
              Know the rate before you choose the plan.
            </h2>
            <p className="text-lg font-light leading-relaxed text-silver">
              Botox and Dysport use different, non-interchangeable units. Your provider reviews the proposed product, units, and expected total before treatment.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {pricingCards.map((card, index) => (
              <article key={card.label} className="rounded-[1.6rem] border border-silver-pale bg-white p-7 shadow-[0_14px_45px_rgba(90,94,98,0.07)]">
                <span className="mb-8 block text-xs font-bold tracking-[0.18em] text-rose-dark">0{index + 1}</span>
                <p className="mb-2 text-3xl font-medium tracking-[-0.035em] text-ink">{card.value}</p>
                <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-silver-dark">{card.label}</h3>
                <p className="text-sm leading-7 text-silver">{card.detail}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 flex flex-col items-start justify-between gap-5 rounded-[1.5rem] bg-rose-blush p-7 md:flex-row md:items-center md:p-9">
            <p className="max-w-[700px] text-sm leading-7 text-silver-dark">
              Membership pricing has a one-year commitment. Compare every injectable plan, included benefit, and current member rate before enrolling.
            </p>
            <Link href="/membership" className="shrink-0 text-sm font-semibold text-rose-text underline decoration-rose-light underline-offset-4 hover:text-rose-dark">
              Compare memberships →
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-ink py-20 text-white md:py-28" aria-labelledby="vacaville-botox-visit">
        <div className="mx-auto grid max-w-[1120px] gap-10 px-6 md:px-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose">Your visit</p>
            <h2 id="vacaville-botox-visit" className="mb-5 text-3xl font-medium tracking-[-0.04em] md:text-5xl">
              Consultation first. Product second.
            </h2>
            <p className="text-lg font-light leading-relaxed text-white/70">
              The responsible plan starts with facial movement, goals, treatment history, and a clear explanation of product-specific dosing.
            </p>
          </div>
          <ol className="grid gap-4 sm:grid-cols-2">
            {[
              "Review your goals, health history, prior neuromodulator treatment, and facial movement.",
              "Discuss Botox and Dysport as distinct products with non-interchangeable units.",
              "Map the proposed areas, units, per-unit rate, and expected total before treatment.",
              "Review product-specific onset, the two-week assessment point, aftercare, and an appropriate follow-up plan.",
            ].map((step, index) => (
              <li key={step} className="rounded-[1.3rem] border border-white/15 bg-white/[0.04] p-6">
                <span className="mb-7 inline-flex h-9 w-9 items-center justify-center rounded-full bg-rose text-xs font-bold">{index + 1}</span>
                <p className="text-sm leading-7 text-white/75">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-20 md:py-28" aria-labelledby="vacaville-botox-timing">
        <div className="mx-auto grid max-w-[1040px] gap-8 px-6 md:px-8 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-dark">Timing &amp; expectations</p>
            <h2 id="vacaville-botox-timing" className="mb-5 text-3xl font-medium tracking-[-0.04em] text-ink md:text-5xl">
              Temporary improvement, assessed over time.
            </h2>
            <p className="text-lg font-light leading-relaxed text-silver">
              Botox softening may begin in 4–7 days, while Dysport can show results in 2–5 days. Full effect is assessed around two weeks. Results commonly last around 3–4 months, and individual response varies.
            </p>
          </div>
          <div className="rounded-[1.75rem] bg-rose-blush p-7 md:p-10">
            <p className="mb-3 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-rose-dark">Important distinction</p>
            <p className="mb-6 text-lg leading-8 text-silver-dark">
              A lower per-unit number does not make Dysport directly cheaper than Botox because the products use different dosing units.
            </p>
            <Link href="/services/botox" className="text-sm font-semibold text-rose-text underline decoration-rose-light underline-offset-4 hover:text-rose-dark">
              Read the full Botox &amp; Dysport guide →
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-rose-blush py-20 md:py-24" aria-labelledby="visit-rella-vacaville">
        <div className="mx-auto grid max-w-[1000px] gap-8 px-6 md:grid-cols-[1fr_auto] md:items-center md:px-8">
          <div>
            <p className="mb-3 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-dark">Visit Rella Vacaville</p>
            <h2 id="visit-rella-vacaville" className="mb-3 text-3xl font-medium tracking-[-0.035em] text-ink">
              542 Main St · Vacaville, CA 95688
            </h2>
            <p className="text-silver">Wednesday–Saturday: 9am–5pm · Sunday–Tuesday: Closed</p>
          </div>
          <div className="flex flex-col gap-3">
            <Button href={BOOKING_HREF} data-cta="service-booking" className="rounded-full">Book New Patient Tox</Button>
            <Button href={clinic.mapUrl} variant="ghost" className="rounded-full bg-white">Get Directions</Button>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28" aria-labelledby="vacaville-botox-faq">
        <div className="mx-auto max-w-[900px] px-6 md:px-8">
          <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-dark">Questions, answered</p>
          <h2 id="vacaville-botox-faq" className="mb-8 text-3xl font-medium tracking-[-0.035em] text-ink md:text-5xl">
            Vacaville Botox FAQ
          </h2>
          <FaqAccordion items={faqs} />
        </div>
      </section>

      <section className="bg-rose py-20 text-center text-white" aria-labelledby="vacaville-botox-next-step">
        <div className="mx-auto max-w-[720px] px-6">
          <h2 id="vacaville-botox-next-step" className="mb-4 text-3xl font-medium tracking-[-0.035em] md:text-5xl">
            Ready for a clear Vacaville next step?
          </h2>
          <p className="mb-8 text-lg font-light leading-relaxed text-white/85">
            Open the live New Patient Tox service, review the current booking terms, or call Rella if you have a question before choosing a visit.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button href={BOOKING_HREF} data-cta="service-booking" className="rounded-full bg-white !text-rose hover:bg-white/90 hover:!text-rose-dark">
              Book New Patient Tox
            </Button>
            <Button href="tel:+17073582928" data-cta="phone" variant="ghost" className="rounded-full border-white/70 !text-white hover:border-white hover:!text-white">
              Call Rella
            </Button>
          </div>
          <p className="mt-6 text-xs leading-6 text-white/70">
            Individual results vary. Treatment eligibility, product, dose, placement, and timing require an individualized assessment.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-white/75">
            <Link href="/cancellation-policy" className="underline underline-offset-4 hover:text-white">Cancellation policy</Link>
            <Link href="/locations/vacaville" className="underline underline-offset-4 hover:text-white">Vacaville clinic details</Link>
          </div>
        </div>
      </section>
    </>
  );
}
