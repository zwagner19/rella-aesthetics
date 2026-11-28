import { withWebsiteSeo } from "@/lib/website-seo";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FaqAccordion, FaqSchema } from "@/components/blocks/FaqAccordion";
import { TrustStrip } from "@/components/blocks/TrustStrip";
import { Button } from "@/components/ui/Button";
import { resolveBookingHref, type BookingLocation } from "@/lib/booking-routes";
import { locations } from "@/lib/data";
import { LOCATION_ENTITY_IDS } from "@/lib/schemas";

const CANONICAL = "https://experiencerella.com/services/lip-filler";
const PHONE_HREF = "tel:+17073582928";
const BOOKING_HREF: Record<BookingLocation, string> = {
  napa: resolveBookingHref({ location: "napa", service: "dermal-fillers" }),
  vacaville: resolveBookingHref({ location: "vacaville", service: "dermal-fillers" }),
};

const defaultMetadata: Metadata = {
  title: {
    absolute: "Lip Filler in Napa & Vacaville | Natural-Looking Lips | Rella Aesthetics",
  },
  description:
    "Consultation-led lip filler at Rella Aesthetics in Napa and Vacaville: how the lip consult works, starting small, swelling and aftercare, and lip flip vs filler.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Lip Filler in Napa & Vacaville | Rella Aesthetics",
    description:
      "How a lip filler consult works at Rella Aesthetics, what to expect while swelling settles, and how to book in Napa or Vacaville.",
    url: CANONICAL,
    type: "website",
    images: [
      {
        url: "/images/service-fillers.jpg",
        alt: "Lip filler consultation at Rella Aesthetics",
      },
    ],
  },
};

const consultSteps = [
  {
    title: "Goals and history",
    body: "Tell your provider what you want to change and what you want to keep. Prior lip filler, cold sores, allergies, medications, supplements, dental plans, and upcoming events all belong in this conversation.",
  },
  {
    title: "Lip and facial assessment",
    body: "Your provider looks at lip shape, proportion between the upper and lower lip, the border, symmetry at rest and in motion, and how your lips sit with the rest of your face.",
  },
  {
    title: "Options and risks",
    body: "You hear which approach, if any, fits your lips, how the product and amount would be chosen, the material risks, and what recovery usually involves, before anything is injected.",
  },
  {
    title: "Your decision",
    body: "The proposed product, amount, and expected total are reviewed with you first. You can treat the same day if appropriate, schedule later, or decide filler is not the right step.",
  },
] as const;

const aftercareTimeline = [
  {
    when: "Right after",
    body: "Lips often look fuller than they will once settled, and can feel tender or firm. Small injection marks or early bruising are possible.",
  },
  {
    when: "First few days",
    body: "Swelling is usually most noticeable in this window, and it can look uneven while it settles. Follow the written aftercare your provider gives you.",
  },
  {
    when: "Settling period",
    body: "As swelling resolves over the following days to weeks, the shape becomes easier to judge. Your provider will tell you when a follow-up makes sense for your product.",
  },
  {
    when: "Call Rella",
    body: "Contact the clinic promptly about increasing pain, skin color changes such as blanching or dusky patches, or anything that worries you. Do not wait for a scheduled follow-up.",
  },
] as const;

const faqs = [
  {
    question: "How much lip filler will I need?",
    answer:
      "That depends on your lip anatomy, goals, prior treatment, and the product selected. Many people start with a conservative amount and reassess once swelling has settled, rather than committing to a set number of syringes up front. Your provider recommends an amount only after an in-person assessment.",
  },
  {
    question: "How long does lip swelling last after filler?",
    answer:
      "Swelling, tenderness, and bruising vary by person, product, and technique. Swelling is usually most noticeable in the first few days and settles over the following days to weeks. Plan important events with that window in mind and follow your provider's aftercare instructions.",
  },
  {
    question: "Can lip filler be dissolved?",
    answer:
      "Some hyaluronic acid filler may be reduced or dissolved with hyaluronidase when clinically indicated. Removal is not risk-free and may be difficult or impossible for some filler materials, so it requires an individual evaluation.",
  },
  {
    question: "What is the difference between a lip flip and lip filler?",
    answer:
      "A lip flip uses a small amount of a neuromodulator, such as Botox, to relax the muscle around the mouth so the upper lip may show slightly more at rest. It does not add volume. Lip filler uses an injectable gel to add volume or shape. They work differently, so your provider can explain which, if either, fits your goal.",
  },
] as const;

const clinicCards = [
  {
    key: "napa" as const,
    label: "Rella Aesthetics — Napa House",
    clinic: locations.napa,
    detailsHref: "/locations/napa",
  },
  {
    key: "vacaville" as const,
    label: "Rella Aesthetics — Vacaville",
    clinic: locations.vacaville,
    detailsHref: "/locations/vacaville",
  },
];

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${CANONICAL}#service`,
  name: "Lip Filler in Napa and Vacaville",
  serviceType: "Lip filler consultation and treatment",
  description: defaultMetadata.description,
  url: CANONICAL,
  image: "https://experiencerella.com/images/service-fillers.jpg",
  provider: clinicCards.map(({ key, label, clinic }) => ({
    "@type": ["MedicalBusiness", "DaySpa"],
    "@id": LOCATION_ENTITY_IDS[key],
    name: label,
    telephone: "+17073582928",
    address: {
      "@type": "PostalAddress",
      streetAddress: clinic.address,
      addressLocality: clinic.city,
      addressRegion: clinic.state,
      postalCode: clinic.zip,
      addressCountry: "US",
    },
  })),
  areaServed: clinicCards.map(({ clinic }) => ({
    "@type": "City",
    name: clinic.city,
    containedInPlace: { "@type": "State", name: "California" },
  })),
};

export default function LipFillerPage() {
  return (
    <>
      <FaqSchema items={faqs} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceSchema).replace(/</g, "\\u003c"),
        }}
      />

      <section className="overflow-hidden bg-paper py-16 md:py-24">
        <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-6 md:px-8 lg:grid-cols-[1.04fr_0.96fr] lg:px-12">
          <div>
            <p className="mb-5 text-[0.6875rem] font-bold uppercase tracking-[0.22em] text-rose-text">
              Injectables · Napa House &amp; Downtown Vacaville
            </p>
            <h1 className="mb-6 text-[clamp(2.75rem,6vw,4.9rem)] font-medium leading-[0.98] tracking-[-0.06em] text-rose-text">
              Lip Filler in Napa and Vacaville
            </h1>
            <p className="mb-8 max-w-[650px] text-lg font-light leading-relaxed text-silver-dark md:text-xl">
              Lips planned around the shape you already have. Start with a consult, begin conservatively, and judge the result once swelling has settled.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button disableHover href={BOOKING_HREF.napa} data-cta="service-booking" data-location="napa" className="rounded-full">
                Book in Napa
              </Button>
              <Button disableHover href={BOOKING_HREF.vacaville} data-cta="service-booking" data-location="vacaville" className="rounded-full">
                Book in Vacaville
              </Button>
            </div>
            <p className="mt-5 text-xs leading-6 text-ink/70">
              Each button opens that clinic&apos;s live injectable category. No service, professional, or appointment is selected for you. Questions first? Call{" "}
              <a href={PHONE_HREF} data-cta="phone" className="underline underline-offset-4">707.358.2928</a>.
            </p>
          </div>

          <div className="relative aspect-square self-center overflow-hidden bg-rose-blush sm:aspect-[4/3]">
            <Image
              src="/images/service-fillers.jpg"
              alt="A provider administering a lip injectable treatment to a reclining patient"
              fill
              preload
              className="object-cover object-center"
              sizes="(min-width: 1024px) 46vw, 92vw"
            />
          </div>
        </div>
      </section>

      <TrustStrip
        ariaLabel="Rella lip filler visit facts"
        items={["Consult before product", "Start conservatively", "Hyaluronic acid options", "Napa + Vacaville"]}
      />

      <section className="py-20 md:py-28" aria-labelledby="lip-filler-consult">
        <div className="mx-auto max-w-[1120px] px-6 md:px-8">
          <div className="mb-12 max-w-[790px]">
            <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-text">
              How a lip consult works
            </p>
            <h2 id="lip-filler-consult" className="mb-5 text-3xl font-medium tracking-[-0.04em] text-rose-text md:text-5xl">
              Assessment first. Syringe later, if at all.
            </h2>
            <p className="text-lg font-light leading-relaxed text-ink/70">
              A lip consult is a conversation about proportion and goals, not a request for a set amount. Bring photos of looks you like and dislike; they help your provider understand what &ldquo;natural&rdquo; means to you.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {consultSteps.map((step, index) => (
              <article
                key={step.title}
                className={`border p-7 ${index === 0 ? "border-rose bg-rose-blush" : "border-ink/12 bg-white"}`}
              >
                <span className="mb-8 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-xs font-bold text-rose-text">{index + 1}</span>
                <h3 className="mb-4 text-xl font-medium tracking-[-0.02em] text-rose-text">{step.title}</h3>
                <p className="text-sm leading-7 text-ink/70">{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-rose py-20 text-white md:py-28" aria-labelledby="lip-filler-options">
        <div className="mx-auto grid max-w-[1120px] gap-10 px-6 md:px-8 lg:grid-cols-2 lg:items-start">
          <div>
            <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-white">Filler options</p>
            <h2 id="lip-filler-options" className="mb-5 text-3xl font-medium tracking-[-0.04em] md:text-5xl">
              Different gels for different goals.
            </h2>
            <p className="text-lg font-light leading-relaxed text-white">
              Lip fillers are hyaluronic acid gels. Products differ in how firm or soft they are and how much they lift or spread, so a product suited to adding volume may not be the one chosen for subtle hydration or border definition.
            </p>
          </div>
          <div className="border border-white/25 bg-white/[0.04] p-7 md:p-9">
            <p className="mb-4 text-lg leading-8 text-white">
              Rella uses several hyaluronic acid lip fillers from the Restylane and Juvéderm families. Your provider explains which product, if any, is appropriate for your lips, why, and what its labeling says about the area and expected duration.
            </p>
            <p className="text-sm leading-7 text-white">
              The product follows the plan. You should not need to arrive knowing a brand name.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28" aria-labelledby="lip-filler-start-small">
        <div className="mx-auto grid max-w-[1040px] gap-8 px-6 md:px-8 lg:grid-cols-[1.03fr_0.97fr] lg:items-center">
          <div>
            <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-text">Starting small</p>
            <h2 id="lip-filler-start-small" className="mb-5 text-3xl font-medium tracking-[-0.04em] text-rose-text md:text-5xl">
              You can add later. Taking away is harder.
            </h2>
            <p className="text-lg font-light leading-relaxed text-ink/70">
              For a first treatment, a conservative amount lets you see how your lips respond and how the change feels on your face. Once swelling has settled, you and your provider can decide together whether more is worth it.
            </p>
          </div>
          <div className="border-l-4 border-rose bg-rose-blush p-7 md:p-10">
            <p className="mb-3 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-rose-text">A good first plan</p>
            <ul className="space-y-3 text-base leading-7 text-silver-dark">
              <li>Keeps your natural lip shape and proportion</li>
              <li>Leaves room to reassess after the settling period</li>
              <li>Is timed away from weddings, photos, and travel</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-rose-blush py-20 md:py-28" aria-labelledby="lip-filler-aftercare">
        <div className="mx-auto max-w-[1120px] px-6 md:px-8">
          <div className="mb-12 max-w-[780px]">
            <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-text">Swelling and aftercare</p>
            <h2 id="lip-filler-aftercare" className="mb-5 text-3xl font-medium tracking-[-0.04em] text-rose-text md:text-5xl">
              What the first days usually look like.
            </h2>
            <p className="text-lg font-light leading-relaxed text-ink/70">
              Lips tend to swell more than other treatment areas. Response varies by person, product, and technique, so treat this as a general guide and follow the aftercare you are given.
            </p>
          </div>
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {aftercareTimeline.map((item, index) => (
              <li key={item.when} className="border border-ink/12 bg-white p-6">
                <span className="mb-8 inline-flex h-9 w-9 items-center justify-center rounded-full bg-rose-blush text-xs font-bold text-rose-text">{index + 1}</span>
                <h3 className="mb-3 text-xl font-medium text-rose-text">{item.when}</h3>
                <p className="text-sm leading-7 text-ink/70">{item.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-20 md:py-28" aria-labelledby="lip-filler-dissolve">
        <div className="mx-auto grid max-w-[1040px] gap-10 px-6 md:px-8 lg:grid-cols-2">
          <div>
            <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-text">Can filler be dissolved?</p>
            <h2 id="lip-filler-dissolve" className="mb-5 text-3xl font-medium tracking-[-0.04em] text-rose-text md:text-4xl">
              Often, with hyaluronic acid filler.
            </h2>
            <p className="text-base font-light leading-relaxed text-ink/70">
              Some hyaluronic acid filler may be reduced or dissolved with hyaluronidase when clinically indicated. Removal is not risk-free and may be difficult or impossible for some filler materials, so it requires an individual evaluation. If you have had lip filler elsewhere, bring what you know about the product and date.
            </p>
          </div>
          <div>
            <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-text">Lip flip vs filler</p>
            <h2 className="mb-5 text-3xl font-medium tracking-[-0.04em] text-rose-text md:text-4xl">
              Relaxing a muscle is not adding volume.
            </h2>
            <p className="mb-6 text-base font-light leading-relaxed text-ink/70">
              A lip flip uses a small amount of a neuromodulator to relax the muscle around the mouth, so the upper lip may show slightly more at rest. Filler adds volume or shape. Some people are better suited to one, some to neither; your provider can explain the difference for your lips.
            </p>
            <Link href="/services/botox" className="text-sm font-semibold text-rose-text underline decoration-rose-light underline-offset-4 hover:text-rose-text">
              Learn about Botox &amp; Dysport at Rella →
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-rose py-20 text-white md:py-28" aria-labelledby="lip-filler-clinics">
        <div className="mx-auto max-w-[1120px] px-6 md:px-8">
          <div className="mb-12 max-w-[760px]">
            <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-white">Two clinics</p>
            <h2 id="lip-filler-clinics" className="mb-5 text-3xl font-medium tracking-[-0.04em] md:text-5xl">
              Book your lip consult in Napa or Vacaville.
            </h2>
            <p className="text-lg font-light leading-relaxed text-white">
              Choose the clinic that is easier to reach. Each booking button opens that clinic&apos;s live injectable menu, where you pick the filler service and appointment.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {clinicCards.map(({ key, label, clinic, detailsHref }) => (
              <article key={key} className="flex flex-col border border-white/25 bg-white/[0.04] p-7 md:p-9">
                <p className="mb-3 text-[0.625rem] font-bold uppercase tracking-[0.2em] text-white">{label}</p>
                <h3 className="mb-3 text-2xl font-medium tracking-[-0.02em]">
                  {clinic.address} · {clinic.city}, {clinic.state} {clinic.zip}
                </h3>
                <ul className="mb-7 space-y-1 text-sm leading-7 text-white">
                  {clinic.hours.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
                <div className="mt-auto flex flex-col gap-3 sm:flex-row">
                  <Button disableHover href={BOOKING_HREF[key]} data-cta="service-booking" data-location={key} className="rounded-full bg-white !text-rose-text">
                    Book in {clinic.city}
                  </Button>
                  <Button disableHover href={clinic.mapUrl} variant="ghost" className="rounded-full">
                    Get Directions
                  </Button>
                </div>
                <Link href={detailsHref} className="mt-5 text-xs text-white underline underline-offset-4 hover:text-white">
                  {clinic.city} clinic details
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28" aria-labelledby="lip-filler-faq">
        <div className="mx-auto max-w-[900px] px-6 md:px-8">
          <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-text">Questions, answered</p>
          <h2 id="lip-filler-faq" className="mb-8 text-3xl font-medium tracking-[-0.035em] text-rose-text md:text-5xl">
            Lip filler FAQ
          </h2>
          <FaqAccordion items={faqs} />
        </div>
      </section>

      <section className="bg-rose-blush py-20 text-center" aria-labelledby="lip-filler-next-step">
        <div className="mx-auto max-w-[740px] px-6">
          <h2 id="lip-filler-next-step" className="mb-4 text-3xl font-medium tracking-[-0.035em] text-rose-text md:text-5xl">
            Start with the conversation.
          </h2>
          <p className="mb-8 text-lg font-light leading-relaxed text-ink/70">
            Book at the clinic nearest you, or call Rella with a question before choosing a service.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button disableHover href={BOOKING_HREF.napa} data-cta="service-booking" data-location="napa" className="rounded-full">
              Book in Napa
            </Button>
            <Button disableHover href={BOOKING_HREF.vacaville} data-cta="service-booking" data-location="vacaville" className="rounded-full">
              Book in Vacaville
            </Button>
            <Button disableHover href={PHONE_HREF} data-cta="phone" variant="ghost" className="rounded-full bg-white">
              Call 707.358.2928
            </Button>
          </div>
          <p className="mt-6 text-xs leading-6 text-ink/70">
            Individual results vary. Candidacy, product, amount, and timing require an individualized assessment.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-ink/70">
            <Link href="/services/dermal-fillers" className="underline underline-offset-4">Full dermal filler guide</Link>
            <Link href="/vacaville/filler" className="underline underline-offset-4">Vacaville filler</Link>
            <a href="/napa/filler/" className="underline underline-offset-4">Napa filler</a>
            <Link href="/cancellation-policy" className="underline underline-offset-4">Cancellation policy</Link>
          </div>
        </div>
      </section>
    </>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  return withWebsiteSeo("/services/lip-filler", defaultMetadata);
}
