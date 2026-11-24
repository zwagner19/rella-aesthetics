import { withWebsiteSeo } from "@/lib/website-seo";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FaqAccordion, FaqSchema } from "@/components/blocks/FaqAccordion";
import { TrustStrip } from "@/components/blocks/TrustStrip";
import { Button } from "@/components/ui/Button";
import { napaHouseIdentity, napaHouseVisuals } from "@/content/napa-house";
import { resolveBookingHref } from "@/lib/booking-routes";
import { locations } from "@/lib/data";
import { NAPA } from "@/lib/napa-botox-facts";
import { localBusinessSchema } from "@/lib/schemas";

const CANONICAL = "https://experiencerella.com/napa/microneedling";
const BOOKING_HREF = resolveBookingHref({
  location: "napa",
  service: "microneedling",
});
const clinic = locations.napa;
const { treatmentRoom } = napaHouseVisuals;

const defaultMetadata: Metadata = {
  title: "Microneedling in Napa, CA | Napa House Med Spa",
  description:
    "Microneedling consults at Rella's Napa House in downtown Napa. Licensed professionals plan standard or RF microneedling around your skin and goals.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Microneedling in Downtown Napa | Rella Aesthetics Napa House",
    description:
      "Standard and RF microneedling at Napa House, planned after a consult that covers your skin, history, goals and recovery window.",
    url: CANONICAL,
    type: "website",
    images: [
      {
        url: "/images/service-microneedling.jpg",
        alt: "Microneedling consultation at Rella Aesthetics Napa House",
      },
    ],
  },
};

const comparison = [
  {
    label: "How it works",
    standard:
      "Fine needles create controlled microchannels in the skin. No added energy is delivered.",
    rf: "A needle array delivers radiofrequency energy into the skin in addition to the microchannels.",
  },
  {
    label: "What the consult weighs",
    standard:
      "Treatment area, depth, your skin's sensitivity, and how you have healed after past procedures.",
    rf: "Everything for standard microneedling, plus the exact device, energy settings, and the added risk profile of RF.",
  },
  {
    label: "Recovery to plan for",
    standard:
      "Temporary redness, tightness, dryness or flaking can occur. How long it lasts varies by depth, area and person.",
    rf: "Similar temporary effects can occur, and the provider should explain any device-specific risks before you choose it.",
  },
] as const;

const consultTopics = [
  {
    title: "Your skin and your goal",
    body: "What you want to change, where, and whether microneedling is a reasonable fit for that concern at all, or whether another service makes more sense.",
  },
  {
    title: "Health history and medications",
    body: "Active skin conditions, bleeding or immune concerns, prior procedures, prescriptions, and how your skin has healed before.",
  },
  {
    title: "Products and recent sun",
    body: "Retinoids, acids, recent tanning, and planned time outdoors can change preparation and aftercare, so bring your current routine.",
  },
  {
    title: "Standard or RF",
    body: "The provider explains why one modality fits your plan better, what the settings mean, and whether more than one procedure may be considered.",
  },
] as const;

const recoveryBasics = [
  "Expect possible redness, tightness, dryness, flaking, mild swelling or bruising. These are usually temporary, but timing varies by person.",
  "Follow the aftercare you are given for cleansing, makeup, and when to restart active products such as retinoids or acids.",
  "Protect treated skin from the sun. If you have outdoor plans, a vineyard event, or a trip coming up, mention the date during your consult.",
  "Call the clinic if something feels unexpected, worsens, or does not match the aftercare you were given.",
] as const;

const faqs = [
  {
    question: "Does Rella's Napa House offer RF microneedling?",
    answer:
      "Yes. Napa House offers both standard microneedling and RF microneedling. A licensed professional reviews your skin, history and goals during the consult before recommending either option.",
  },
  {
    question: "What is the difference between standard and RF microneedling?",
    answer:
      "Standard microneedling uses fine needles to create controlled microchannels. RF microneedling adds radiofrequency energy delivered through the needles. They use different technology and carry different considerations, so the exact device and plan are discussed during the consult.",
  },
  {
    question: "How much downtime should I plan for?",
    answer:
      "Recovery depends on the modality, depth, treatment area and your skin. Temporary redness, tightness, dryness, flaking or bruising can occur. Ask about the expected recovery for your plan before scheduling around events or travel.",
  },
  {
    question: "Where is Rella's Napa microneedling clinic?",
    answer:
      "Rella Aesthetics Napa House is at 1541 3rd St in downtown Napa, CA 94559. The clinic is open Wednesday through Saturday, 9am–5pm, and closed Sunday through Tuesday. Street and garage parking are within one block.",
  },
] as const;

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${CANONICAL}#service`,
  name: "Microneedling in Napa",
  serviceType: "Standard and RF microneedling consultation and treatment",
  description: defaultMetadata.description,
  url: CANONICAL,
  image: "https://experiencerella.com/images/service-microneedling.jpg",
  provider: {
    "@type": ["MedicalBusiness", "DaySpa"],
    "@id": "https://experiencerella.com/locations/napa#location",
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

export default function NapaMicroneedlingPage() {
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
              Skin treatment · {napaHouseIdentity.placeName}
            </p>
            <h1 className="mb-6 text-[clamp(2.75rem,6vw,4.9rem)] font-medium leading-[0.98] tracking-[-0.06em] text-rose-text">
              Microneedling in Downtown Napa
            </h1>
            <p className="mb-8 max-w-[650px] text-lg font-light leading-relaxed text-silver-dark md:text-xl">
              Napa House offers standard and RF microneedling. Your visit starts with a consult, so the modality, settings and recovery are planned around your skin rather than picked from a menu.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button disableHover href={BOOKING_HREF} data-cta="service-booking" className="whitespace-nowrap rounded-full">
                Book a Napa Consult
              </Button>
              <Button disableHover href="tel:+17073582928" data-cta="phone" variant="ghost" className="whitespace-nowrap rounded-full bg-white/75">
                Call 707.358.2928
              </Button>
            </div>
            <p className="mt-5 text-xs leading-6 text-ink/70">
              Opens Rella Napa&apos;s live microneedling booking category. You choose the service, professional and appointment.
            </p>
          </div>

          <div className="relative aspect-square self-center overflow-hidden bg-rose-blush sm:aspect-[4/3]">
            <Image
              src="/images/service-microneedling.jpg"
              alt="A provider performing a microneedling facial treatment for a reclining patient"
              fill
              preload
              className="object-cover object-center"
              sizes="(min-width: 1024px) 46vw, 92vw"
            />
            <div className="absolute inset-x-0 bottom-0 border-t border-white/30 bg-white/94 p-5 md:p-6">
              <p className="mb-2 text-[0.625rem] font-bold uppercase tracking-[0.2em] text-rose-text">
                Rella Aesthetics — {napaHouseIdentity.placeName}
              </p>
              <p className="text-lg font-medium leading-snug text-ink">
                {clinic.address} · {clinic.hours.join(" · ")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <TrustStrip
        ariaLabel="Rella Napa microneedling visit facts"
        items={["Standard & RF microneedling", "Consult before treatment", "Licensed professionals", "Downtown Napa"]}
      />

      <section className="py-20 md:py-28" aria-labelledby="napa-microneedling-compare">
        <div className="mx-auto max-w-[1120px] px-6 md:px-8">
          <div className="mb-12 max-w-[790px]">
            <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-text">
              Standard vs RF
            </p>
            <h2 id="napa-microneedling-compare" className="mb-5 text-3xl font-medium tracking-[-0.04em] text-rose-text md:text-5xl">
              Same idea, different tools.
            </h2>
            <p className="text-lg font-light leading-relaxed text-ink/70">
              Both options are available at Napa House. They are not interchangeable, and neither is right for everyone. Here is what separates them before you sit down with a provider.
            </p>
          </div>
          <div className="overflow-hidden border border-ink/12 bg-white">
            <div className="hidden grid-cols-[0.8fr_1fr_1fr] bg-rose-blush md:grid">
              <p className="p-6 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-rose-text" aria-hidden="true">&nbsp;</p>
              <p className="p-6 text-xl font-medium tracking-[-0.02em] text-rose-text">Standard microneedling</p>
              <p className="p-6 text-xl font-medium tracking-[-0.02em] text-rose-text">RF microneedling</p>
            </div>
            {comparison.map((row) => (
              <div key={row.label} className="grid border-t border-ink/12 md:grid-cols-[0.8fr_1fr_1fr]">
                <h3 className="px-6 pb-2 pt-6 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-rose-text md:pb-6">
                  {row.label}
                </h3>
                <p className="px-6 pb-3 text-sm leading-7 text-ink/70 md:py-6">
                  <span className="font-semibold text-ink md:hidden">Standard: </span>
                  {row.standard}
                </p>
                <p className="px-6 pb-6 text-sm leading-7 text-ink/70 md:py-6">
                  <span className="font-semibold text-ink md:hidden">RF: </span>
                  {row.rf}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-rose py-20 text-white md:py-28" aria-labelledby="napa-microneedling-consult-topics">
        <div className="mx-auto grid max-w-[1120px] gap-12 px-6 md:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div className="relative mx-auto aspect-[2/3] w-full max-w-[340px] overflow-hidden bg-white/10">
            <Image
              src={treatmentRoom.src}
              alt={treatmentRoom.alt}
              fill
              className="object-cover object-center"
              sizes="(min-width: 1024px) 340px, 80vw"
            />
          </div>
          <div>
            <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-white">Your Napa consult</p>
            <h2 id="napa-microneedling-consult-topics" className="mb-5 text-3xl font-medium tracking-[-0.04em] md:text-5xl">
              What gets planned before any needles.
            </h2>
            <p className="mb-10 text-lg font-light leading-relaxed text-white">
              Microneedling is not suitable for everyone, and no cosmetic result is guaranteed. These are the questions a licensed professional works through with you first.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {consultTopics.map((topic, index) => (
                <article key={topic.title} className="border border-white/15 bg-white/[0.04] p-6">
                  <span className="mb-6 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-xs font-bold text-rose-text">{index + 1}</span>
                  <h3 className="mb-3 text-xl font-medium">{topic.title}</h3>
                  <p className="text-sm leading-7 text-white">{topic.body}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28" aria-labelledby="napa-microneedling-recovery">
        <div className="mx-auto grid max-w-[1040px] gap-10 px-6 md:px-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-text">Recovery basics</p>
            <h2 id="napa-microneedling-recovery" className="mb-5 text-3xl font-medium tracking-[-0.04em] text-rose-text md:text-5xl">
              Plan the days after, too.
            </h2>
            <p className="text-lg font-light leading-relaxed text-ink/70">
              How your skin looks and feels afterward depends on the modality, depth and area treated. Your provider gives you aftercare for your specific plan; these are the basics to expect.
            </p>
          </div>
          <ul className="divide-y divide-ink/12 border-y border-ink/12">
            {recoveryBasics.map((item) => (
              <li key={item} className="py-5 text-base leading-7 text-ink/80">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-rose-blush py-20 md:py-24" aria-labelledby="napa-microneedling-rf-risk">
        <div className="mx-auto max-w-[900px] px-6 md:px-8">
          <p className="mb-3 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-rose-text">Considering RF?</p>
          <h2 id="napa-microneedling-rf-risk" className="mb-4 text-3xl font-medium tracking-[-0.035em] text-rose-text">
            Added energy means added questions.
          </h2>
          <p className="mb-6 text-lg leading-8 text-silver-dark">
            The FDA has reported serious complications with certain uses of RF microneedling, including burns, scarring, fat loss, disfigurement, and nerve damage. Ask your provider about the exact device, settings, alternatives, and the risks that apply to your plan.
          </p>
          <a
            href="https://www.fda.gov/medical-devices/safety-communications/potential-risks-certain-uses-radiofrequency-rf-microneedling-fda-safety-communication"
            className="text-sm font-semibold text-rose-text underline decoration-rose-light underline-offset-4 hover:text-rose-text"
          >
            Read the FDA safety communication →
          </a>
        </div>
      </section>

      <section className="py-20 md:py-28" aria-labelledby="napa-microneedling-visit">
        <div className="mx-auto max-w-[1040px] px-6 md:px-8">
          <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-text">Visiting {napaHouseIdentity.placeName}</p>
          <h2 id="napa-microneedling-visit" className="mb-10 text-3xl font-medium tracking-[-0.04em] text-rose-text md:text-5xl">
            On 3rd Street in downtown Napa.
          </h2>
          <dl className="grid gap-px border border-ink/12 bg-ink/12 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white p-6">
              <dt className="mb-3 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-rose-text">Address</dt>
              <dd className="text-base leading-7 text-ink">
                {clinic.address}
                <br />
                {clinic.city}, {clinic.state} {clinic.zip}
              </dd>
            </div>
            <div className="bg-white p-6">
              <dt className="mb-3 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-rose-text">Hours</dt>
              <dd className="text-base leading-7 text-ink">
                {clinic.hours.map((line) => (
                  <span key={line} className="block">{line}</span>
                ))}
              </dd>
            </div>
            <div className="bg-white p-6">
              <dt className="mb-3 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-rose-text">Parking</dt>
              <dd className="text-base leading-7 text-ink">{NAPA.parkingCopy}</dd>
            </div>
            <div className="bg-white p-6">
              <dt className="mb-3 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-rose-text">Phone</dt>
              <dd className="text-base leading-7 text-ink">
                <a href="tel:+17073582928" data-cta="phone" className="underline decoration-rose-light underline-offset-4">
                  {clinic.phone}
                </a>
              </dd>
            </div>
          </dl>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-rose-text">
            <a href={clinic.mapUrl} className="underline decoration-rose-light underline-offset-4">Get directions →</a>
            <Link href="/locations/napa" className="underline decoration-rose-light underline-offset-4">Napa House clinic details →</Link>
            <Link href="/napa/facials" className="underline decoration-rose-light underline-offset-4">Facials in Napa →</Link>
          </div>
        </div>
      </section>

      <section className="bg-paper py-20 md:py-28" aria-labelledby="napa-microneedling-faq">
        <div className="mx-auto max-w-[900px] px-6 md:px-8">
          <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-text">Questions, answered</p>
          <h2 id="napa-microneedling-faq" className="mb-8 text-3xl font-medium tracking-[-0.035em] text-rose-text md:text-5xl">
            Napa microneedling FAQ
          </h2>
          <FaqAccordion items={faqs} />
        </div>
      </section>

      <section className="bg-rose py-20 text-center text-white" aria-labelledby="napa-microneedling-next-step">
        <div className="mx-auto max-w-[740px] px-6">
          <h2 id="napa-microneedling-next-step" className="mb-4 text-3xl font-medium tracking-[-0.035em] md:text-5xl">
            Start at Napa House.
          </h2>
          <p className="mb-8 text-lg font-light leading-relaxed text-white">
            Open the live Napa microneedling category to review current services and availability, or call the team with a question first.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button disableHover href={BOOKING_HREF} data-cta="service-booking" className="rounded-full bg-white !text-rose-text">
              Book a Napa Microneedling Consult
            </Button>
            <Button disableHover href="tel:+17073582928" data-cta="phone" variant="ghost" className="!border-white !bg-white !text-rose-text">
              Call Rella
            </Button>
          </div>
          <p className="mt-6 text-xs leading-6 text-white">
            Individual response and recovery vary. Modality, settings, treatment area, number of procedures, and suitability require an individualized assessment.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-white">
            <Link href="/services/microneedling" className="underline underline-offset-4 hover:text-white">Full microneedling guide</Link>
            <Link href="/cancellation-policy" className="underline underline-offset-4 hover:text-white">Cancellation policy</Link>
            <Link href="/locations/napa" className="underline underline-offset-4 hover:text-white">Napa clinic details</Link>
          </div>
        </div>
      </section>
    </>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  return withWebsiteSeo("/napa/microneedling", defaultMetadata);
}
