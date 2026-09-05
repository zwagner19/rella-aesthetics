import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FaqAccordion, FaqSchema } from "@/components/blocks/FaqAccordion";
import { TrustStrip } from "@/components/blocks/TrustStrip";
import { Button } from "@/components/ui/Button";
import { resolveBookingHref } from "@/lib/booking-routes";
import { locations } from "@/lib/data";
import { localBusinessSchema } from "@/lib/schemas";

const CANONICAL = "https://experiencerella.com/vacaville/chemical-peels";
const BOOKING_HREF = resolveBookingHref({
  location: "vacaville",
  service: "chemical-peels",
});
const clinic = locations.vacaville;

export const metadata: Metadata = {
  title: "Chemical Peels in Vacaville | Options & Booking",
  description:
    "Review recovery planning and book the Universal Peel currently listed in Rella's Vacaville online peel category.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Chemical Peels in Vacaville | Rella Aesthetics",
    description:
      "Universal Peel online booking, consultation-led selection, and recovery planning in Vacaville.",
    url: CANONICAL,
    type: "website",
    images: [
      {
        url: "/images/service-peels.jpg",
        alt: "Chemical peel consultation at Rella Aesthetics in Vacaville",
      },
    ],
  },
};

const peelOptions = [
  {
    name: "Universal Peel",
    body: "The 90-minute peel currently listed in Vacaville's online category. Review formulation, candidacy, preparation, and expected recovery before confirming.",
  },
] as const;

const visitSteps = [
  {
    title: "Review",
    body: "Share your skin concerns, sensitivities, current products, medications, recent procedures, sun exposure, and important dates.",
  },
  {
    title: "Compare",
    body: "Review the Universal Peel's formulation, preparation, and expected recovery. Call Rella if you want to ask about another peel.",
  },
  {
    title: "Treat",
    body: "Proceed only after the selected product, treatment area, comfort expectations, and current total are clear.",
  },
  {
    title: "Protect",
    body: "Follow the product-specific guidance for sun exposure, makeup, active skin-care products, and when to contact Rella.",
  },
] as const;

const faqs = [
  {
    question: "Which chemical peels does Rella offer in Vacaville?",
    answer:
      "Rella's current Vacaville online peel category lists Universal Peel. Other peel options may be discussed by phone, but their availability should not be inferred from the online menu.",
  },
  {
    question: "How much is a chemical peel at Rella Vacaville?",
    answer:
      "The booking flow shows the current Universal Peel total before confirmation. Call Rella to confirm availability and pricing before planning around another peel.",
  },
  {
    question: "How do I choose the right peel?",
    answer:
      "Selection depends on your skin, concerns, sensitivities, current products, recent procedures, sun exposure, goals, and recovery tolerance. A provider should review those factors before recommending an option.",
  },
  {
    question: "Is there downtime after a chemical peel?",
    answer:
      "Downtime varies by product and individual response. Temporary redness, sensitivity, flaking, or peeling can occur; review the expected recovery for the exact peel before treatment.",
  },
  {
    question: "Can I wear makeup or use active skin-care products afterward?",
    answer:
      "Follow the aftercare instructions for the exact peel and your skin response. Ask your provider when makeup, retinoids, exfoliating acids, and other active products can be resumed.",
  },
  {
    question: "Where is Rella Aesthetics in Vacaville?",
    answer:
      "Rella Aesthetics is at 542 Main St in downtown Vacaville, CA 95688. The clinic is open Tuesday through Friday, 9am–5pm, and Saturday, 9am–1pm; it is closed Sunday and Monday.",
  },
] as const;

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${CANONICAL}#service`,
  name: "Chemical Peels in Vacaville",
  serviceType: "Chemical peel consultation and treatment",
  description: metadata.description,
  url: CANONICAL,
  image: "https://experiencerella.com/images/service-peels.jpg",
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

export default function VacavilleChemicalPeelsPage() {
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

      <section className="overflow-hidden bg-paper py-16 md:py-24">
        <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-6 md:px-8 lg:grid-cols-[1.04fr_0.96fr] lg:px-12">
          <div>
            <p className="mb-5 text-[0.6875rem] font-bold uppercase tracking-[0.22em] text-rose-text">
              Skin care · Downtown Vacaville
            </p>
            <h1 className="mb-6 text-[clamp(2.75rem,6vw,4.9rem)] font-medium leading-[0.98] tracking-[-0.06em] text-rose-text">
              Chemical peels in Vacaville.
            </h1>
            <p className="mb-8 max-w-[650px] text-lg font-light leading-relaxed text-silver-dark md:text-xl">
              Review the Universal Peel currently available for online booking, plan around your skin and schedule, and understand recovery before treatment.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button disableHover href={BOOKING_HREF} data-cta="service-booking" className="rounded-full">
                Book Universal Peel
              </Button>
              <Button disableHover href="tel:+17073582928" data-cta="phone" variant="ghost" className="rounded-full bg-white/75">
                Call 707.358.2928
              </Button>
            </div>
            <p className="mt-5 text-xs leading-6 text-ink/70">
              The live Vacaville peel category opens first and currently lists Universal Peel. Review its details before confirming.
            </p>
          </div>

          <div className="relative aspect-square self-center overflow-hidden bg-rose-blush sm:aspect-[4/3]">
            <Image
              src="/images/service-peels.jpg"
              alt="A provider applying a facial peel treatment with a brush"
              fill
              preload
              className="object-cover object-center"
              sizes="(min-width: 1024px) 46vw, 92vw"
            />
            <div className="absolute inset-x-0 bottom-0 border-t border-white/30 bg-white/94 p-5 md:p-6">
              <p className="mb-2 text-[0.625rem] font-bold uppercase tracking-[0.2em] text-rose-text">
                Rella Aesthetics — Vacaville
              </p>
              <p className="text-lg font-medium leading-snug text-ink">
                542 Main St · Tuesday–Friday, 9am–5pm · Saturday, 9am–1pm · Sunday–Monday: Closed
              </p>
            </div>
          </div>
        </div>
      </section>

      <TrustStrip
        ariaLabel="Rella Vacaville chemical-peel visit facts"
        items={["Vacaville-only booking", "Universal Peel online", "90-minute service", "Recovery reviewed first"]}
      />

      <section className="py-20 md:py-28" aria-labelledby="vacaville-peel-options">
        <div className="mx-auto max-w-[1120px] px-6 md:px-8">
          <div className="mb-12 max-w-[790px]">
            <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-text">
              Current Vacaville menu
            </p>
            <h2 id="vacaville-peel-options" className="mb-5 text-3xl font-medium tracking-[-0.04em] text-rose-text md:text-5xl">
              One peel is currently listed online.
            </h2>
            <p className="text-lg font-light leading-relaxed text-ink/70">
              The online category currently exposes Universal Peel. Call Rella to ask about another option rather than assuming it is available to book.
            </p>
          </div>
          <div className="grid max-w-[720px] gap-5">
            {peelOptions.map((option, index) => (
              <article key={option.name} className="border border-ink/12 bg-white p-7 md:p-8">
                <div className="mb-7 flex items-center justify-between gap-4">
                  <span className="text-xs font-bold tracking-[0.18em] text-rose-text">0{index + 1}</span>
                  <span className="h-px flex-1 bg-rose-light/70" aria-hidden="true" />
                </div>
                <h3 className="mb-3 text-2xl font-medium tracking-[-0.025em] text-rose-text">{option.name}</h3>
                <p className="text-sm leading-7 text-ink/70">{option.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-rose py-20 text-ink md:py-28" aria-labelledby="vacaville-peel-visit">
        <div className="mx-auto max-w-[1120px] px-6 md:px-8">
          <div className="mb-12 max-w-[780px]">
            <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-ink">Your visit</p>
            <h2 id="vacaville-peel-visit" className="mb-5 text-3xl font-medium tracking-[-0.04em] md:text-5xl">
              Match the peel to your skin—and your calendar.
            </h2>
            <p className="text-lg font-light leading-relaxed text-ink">
              Product choice, preparation, response, and recovery vary. Important events and recent procedures belong in the planning conversation.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {visitSteps.map((step, index) => (
              <article key={step.title} className="border border-white/15 bg-white/[0.04] p-6">
                <span className="mb-8 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-xs font-bold text-rose-text">{index + 1}</span>
                <h3 className="mb-3 text-xl font-medium">{step.title}</h3>
                <p className="text-sm leading-7 text-ink">{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28" aria-labelledby="vacaville-peel-booking">
        <div className="mx-auto grid max-w-[1040px] gap-8 px-6 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-text">A safe booking handoff</p>
            <h2 id="vacaville-peel-booking" className="mb-5 text-3xl font-medium tracking-[-0.04em] text-rose-text md:text-5xl">
              Book Universal Peel in Vacaville.
            </h2>
            <p className="text-lg font-light leading-relaxed text-ink/70">
              Rella&apos;s online menu currently lists Universal Peel. The booking button keeps the correct clinic and peel category selected without choosing a professional or appointment for you.
            </p>
          </div>
          <div className="border-l-4 border-rose bg-rose-blush p-7 md:p-10">
            <p className="mb-3 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-rose-text">Pricing before treatment</p>
            <p className="mb-6 text-lg leading-8 text-silver-dark">
              Review the Universal Peel details, preparation, expected recovery, and current price before you confirm.
            </p>
            <Button disableHover href={BOOKING_HREF} data-cta="service-booking" className="rounded-full">
              Book Universal Peel
            </Button>
            <Link href="/services/chemical-peels" className="mt-6 block text-sm font-semibold text-rose-text underline decoration-rose-light underline-offset-4 hover:text-rose-text">
              Read the full chemical-peel guide →
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-rose-blush py-20 md:py-24" aria-labelledby="vacaville-peel-alternatives">
        <div className="mx-auto grid max-w-[1040px] gap-8 px-6 md:grid-cols-[1fr_auto] md:items-center md:px-8">
          <div>
            <p className="mb-3 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-text">Still comparing?</p>
            <h2 id="vacaville-peel-alternatives" className="mb-3 text-3xl font-medium tracking-[-0.035em] text-rose-text">
              Start with the treatment plan, not the trend.
            </h2>
            <p className="max-w-[700px] text-ink/70">
              If you are also considering a facial, HydraFacial, microneedling, or laser treatment, ask the team to compare timing and recovery before combining or sequencing services.
            </p>
          </div>
          <Button href="/services" variant="ghost" disableHover className="rounded-full bg-white">Compare Services</Button>
        </div>
      </section>

      <section className="py-20 md:py-28" aria-labelledby="vacaville-peel-faq">
        <div className="mx-auto max-w-[900px] px-6 md:px-8">
          <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-text">Questions, answered</p>
          <h2 id="vacaville-peel-faq" className="mb-8 text-3xl font-medium tracking-[-0.035em] text-rose-text md:text-5xl">
            Vacaville chemical-peel FAQ
          </h2>
          <FaqAccordion items={faqs} />
        </div>
      </section>

      <section className="bg-rose py-20 text-center text-ink" aria-labelledby="vacaville-peel-next-step">
        <div className="mx-auto max-w-[740px] px-6">
          <h2 id="vacaville-peel-next-step" className="mb-4 text-3xl font-medium tracking-[-0.035em] md:text-5xl">
            Choose your Vacaville peel with context.
          </h2>
          <p className="mb-8 text-lg font-light leading-relaxed text-ink">
            Review Universal Peel in the current menu, call with a question, or read the general guide before choosing.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button disableHover href={BOOKING_HREF} data-cta="service-booking" className="rounded-full bg-white !text-rose-text">
              Book Universal Peel
            </Button>
            <Button disableHover href="tel:+17073582928" data-cta="phone" variant="ghost">
              Call Rella
            </Button>
          </div>
          <p className="mt-6 text-xs leading-6 text-ink">
            Individual response and recovery vary. Suitability, formulation, preparation, and aftercare should be reviewed for the exact peel being considered.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-ink">
            <Link href="/cancellation-policy" className="underline underline-offset-4 hover:text-ink">Cancellation policy</Link>
            <Link href="/locations/vacaville" className="underline underline-offset-4 hover:text-ink">Vacaville clinic details</Link>
          </div>
        </div>
      </section>
    </>
  );
}
