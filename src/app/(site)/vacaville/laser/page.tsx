import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FaqAccordion, FaqSchema } from "@/components/blocks/FaqAccordion";
import { TrustStrip } from "@/components/blocks/TrustStrip";
import { Button } from "@/components/ui/Button";
import { resolveBookingHref } from "@/lib/booking-routes";
import { locations } from "@/lib/data";
import { localBusinessSchema } from "@/lib/schemas";

const CANONICAL = "https://experiencerella.com/vacaville/laser";
const BOOKING_HREF = resolveBookingHref({
  location: "vacaville",
  service: "laser-treatments",
});
const clinic = locations.vacaville;

export const metadata: Metadata = {
  title: "Vacaville Laser Treatments | IPL & Resurfacing",
  description:
    "Compare laser treatment pathways at Rella Vacaville, then use the online booking category to schedule the required Initial Laser Consult.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Laser Treatments in Vacaville | Rella Aesthetics",
    description:
      "Current full-face pricing, consultation-led device selection, and online booking for the Vacaville Initial Laser Consult.",
    url: CANONICAL,
    type: "website",
    images: [
      {
        url: "/images/service-laser.jpg",
        alt: "Laser skin-treatment consultation at Rella Aesthetics in Vacaville",
      },
    ],
  },
};

const faqs = [
  {
    question: "Do I need a consultation before IPL at Rella Vacaville?",
    answer:
      "Yes. Rella's current Vacaville booking menu instructs patients to book the Initial Laser Consult before IPL. The consult is used to assess suitability, review concerns, and explain the available laser options before a treatment is selected.",
  },
  {
    question: "How much are full-face IPL and CO2 CoolPeel?",
    answer:
      "IPL Full Face is $420 and CO2 CoolPeel Full Face is $1,440 under Rella's current approved public pricing canon. Other areas, devices, packages, and services depend on the selected plan, and the team reviews the current total before treatment.",
  },
  {
    question: "Which laser services are listed at Rella Vacaville?",
    answer:
      "The current Vacaville online laser category lists the Initial Laser Consult. Laser hair removal, IPL, resurfacing, tattoo removal, spider-vein treatment, CoolPeel, and packages may be discussed with the team, but their availability should not be inferred from the online menu.",
  },
  {
    question: "How much downtime should I expect?",
    answer:
      "Downtime varies by device, treatment area, settings, and individual response. The team reviews the expected recovery for the exact option being considered before treatment is scheduled.",
  },
  {
    question: "Can I schedule laser treatment after sun exposure?",
    answer:
      "Recent tanning or significant sun exposure can affect treatment timing and suitability. Share sun exposure, travel, medications, skin-care products, and upcoming events during the consult so the provider can advise you appropriately.",
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
  name: "Laser Skin Treatments in Vacaville",
  serviceType: "Laser and light-based aesthetic consultation and treatment",
  description: metadata.description,
  url: CANONICAL,
  image: "https://experiencerella.com/images/service-laser.jpg",
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

const treatmentPaths = [
  {
    title: "IPL photofacial",
    body: "An option the team may consider for visible pigment, sun damage, redness, or uneven tone after assessing your skin and recent exposure.",
  },
  {
    title: "Erbium resurfacing",
    body: "A resurfacing pathway listed for texture-focused planning, with the treatment area, settings, recovery, and schedule reviewed first.",
  },
  {
    title: "CO2 CoolPeel",
    body: "A resurfacing pathway that may be discussed after assessment. Suitability, availability, and recovery expectations require an individualized consult.",
  },
  {
    title: "Hair & targeted concerns",
    body: "Hair removal, tattoo removal, and spider-vein treatment are distinct pathways to ask about. The consult determines availability and the responsible next step.",
  },
] as const;

const planningFactors = [
  {
    title: "Concern",
    body: "Pigment, redness, texture, unwanted hair, tattoos, and visible vessels do not belong to one interchangeable treatment path.",
  },
  {
    title: "Skin & history",
    body: "Skin type, treatment history, medications, products, and current skin condition all belong in the assessment.",
  },
  {
    title: "Sun exposure",
    body: "Recent tanning, outdoor plans, and the ability to protect treated skin can affect timing and suitability.",
  },
  {
    title: "Recovery window",
    body: "The device, area, settings, travel, work, and important events shape the schedule you can responsibly choose.",
  },
] as const;

export default function VacavilleLaserPage() {
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
              Laser &amp; light-based care · Downtown Vacaville
            </p>
            <h1 className="mb-6 text-[clamp(2.75rem,6vw,4.9rem)] font-medium leading-[0.98] tracking-[-0.06em] text-rose-text">
              Laser skin planning in Vacaville.
            </h1>
            <p className="mb-8 max-w-[650px] text-lg font-light leading-relaxed text-silver-dark md:text-xl">
              Start with the required laser consult, then match the concern to the device, treatment area, recovery window, and current price.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button disableHover href={BOOKING_HREF} data-cta="service-booking" className="rounded-full">
                Book Initial Laser Consult
              </Button>
              <Button disableHover href="tel:+17073582928" data-cta="phone" variant="ghost" className="rounded-full bg-white/75">
                Call 707.358.2928
              </Button>
            </div>
            <p className="mt-5 text-xs leading-6 text-ink/70">
              This button opens Rella&apos;s live Vacaville laser category, which currently lists the Initial Laser Consult.
            </p>
          </div>

          <div className="relative aspect-square self-center overflow-hidden bg-rose-blush sm:aspect-[4/3]">
            <Image
              src="/images/service-laser.jpg"
              alt="A provider performing a device-based facial treatment for a reclining patient"
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
        ariaLabel="Rella Vacaville laser visit facts"
        items={["Initial consult online", "Device selected later", "Current public pricing", "Downtown Vacaville"]}
      />

      <section className="py-20 md:py-28" aria-labelledby="vacaville-laser-options">
        <div className="mx-auto max-w-[1120px] px-6 md:px-8">
          <div className="mb-12 max-w-[780px]">
            <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-text">
              Device before hype
            </p>
            <h2 id="vacaville-laser-options" className="mb-5 text-3xl font-medium tracking-[-0.04em] text-rose-text md:text-5xl">
              Different concerns need different paths.
            </h2>
            <p className="text-lg font-light leading-relaxed text-ink/70">
              Rella may discuss light-based treatment, resurfacing, hair removal, and targeted concerns. The current online category starts with the Initial Laser Consult so availability and fit are reviewed first.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {treatmentPaths.map((path) => (
              <article key={path.title} className="border border-ink/12 bg-white p-7 md:p-8">
                <h3 className="mb-4 text-xl font-medium text-rose-text">{path.title}</h3>
                <p className="text-sm leading-7 text-ink/70">{path.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-rose-blush py-20 md:py-28" aria-labelledby="vacaville-laser-pricing">
        <div className="mx-auto grid max-w-[1120px] gap-9 px-6 md:px-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
          <div>
            <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-text">
              Current full-face pricing
            </p>
            <h2 id="vacaville-laser-pricing" className="mb-5 text-3xl font-medium tracking-[-0.04em] text-rose-text md:text-5xl">
              Two verified amounts. No invented starting price.
            </h2>
            <p className="text-lg font-light leading-relaxed text-ink/70">
              Other areas, devices, and packages depend on the selected plan. Rella reviews the current total before treatment.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <article className="border border-ink/12 bg-white p-7">
              <p className="mb-3 text-4xl font-medium tracking-[-0.045em] text-ink">$420</p>
              <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-rose-text">IPL full face</h3>
              <p className="text-sm leading-7 text-ink/70">Current approved public amount for the full-face IPL service.</p>
            </article>
            <article className="border border-rose bg-white p-7">
              <p className="mb-3 text-4xl font-medium tracking-[-0.045em] text-ink">$1,440</p>
              <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-rose-text">CO2 CoolPeel full face</h3>
              <p className="text-sm leading-7 text-ink/70">Current approved public amount for the full-face CoolPeel service.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-rose py-20 text-ink md:py-28" aria-labelledby="vacaville-laser-plan">
        <div className="mx-auto max-w-[1120px] px-6 md:px-8">
          <div className="mb-12 max-w-[760px]">
            <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-ink">Plan the treatment and the calendar</p>
            <h2 id="vacaville-laser-plan" className="mb-5 text-3xl font-medium tracking-[-0.04em] md:text-5xl">
              Four factors shape the recommendation.
            </h2>
            <p className="text-lg font-light leading-relaxed text-ink">
              The responsible option depends on more than the concern alone. Skin, history, exposure, and recovery time all belong in the decision.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {planningFactors.map((factor, index) => (
              <article key={factor.title} className="border border-white/15 bg-white/[0.04] p-6">
                <span className="mb-8 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-xs font-bold text-rose-text">
                  {index + 1}
                </span>
                <h3 className="mb-3 text-xl font-medium">{factor.title}</h3>
                <p className="text-sm leading-7 text-ink">{factor.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28" aria-labelledby="vacaville-laser-consult">
        <div className="mx-auto grid max-w-[1040px] gap-8 px-6 md:px-8 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-text">Your first step</p>
            <h2 id="vacaville-laser-consult" className="mb-5 text-3xl font-medium tracking-[-0.04em] text-rose-text md:text-5xl">
              Start on the consult—not the wrong device.
            </h2>
            <p className="text-lg font-light leading-relaxed text-ink/70">
              Rella&apos;s live Vacaville booking instructions require the Initial Laser Consult before IPL. The consult assesses suitability, reviews concerns and relevant history, and explains the available treatment path before you choose.
            </p>
          </div>
          <div className="border-l-4 border-rose bg-rose-blush p-7 md:p-10">
            <p className="mb-3 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-rose-text">Live booking chooser</p>
            <p className="mb-6 text-lg leading-8 text-silver-dark">
              The button below opens Vacaville&apos;s laser category. Its current online option is the Initial Laser Consult; review the professional, timing, and booking terms before confirming.
            </p>
            <Button disableHover href={BOOKING_HREF} data-cta="service-booking" className="rounded-full">
              Book Initial Laser Consult
            </Button>
            <Link href="/services/laser-treatments" className="mt-6 block text-sm font-semibold text-rose-text underline decoration-rose-light underline-offset-4 hover:text-rose-text">
              Read the full laser-treatment guide →
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-rose-blush py-20 md:py-24" aria-labelledby="visit-rella-vacaville-laser">
        <div className="mx-auto grid max-w-[1000px] gap-8 px-6 md:grid-cols-[1fr_auto] md:items-center md:px-8">
          <div>
            <p className="mb-3 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-text">Visit Rella Vacaville</p>
            <h2 id="visit-rella-vacaville-laser" className="mb-3 text-3xl font-medium tracking-[-0.035em] text-rose-text">
              542 Main St · Vacaville, CA 95688
            </h2>
            <p className="text-ink/70">Tuesday–Friday: 9am–5pm · Saturday: 9am–1pm · Sunday–Monday: Closed</p>
          </div>
          <Button href={clinic.mapUrl} variant="ghost" disableHover className="rounded-full bg-white">Get Directions</Button>
        </div>
      </section>

      <section className="py-20 md:py-28" aria-labelledby="vacaville-laser-faq">
        <div className="mx-auto max-w-[900px] px-6 md:px-8">
          <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-text">Questions, answered</p>
          <h2 id="vacaville-laser-faq" className="mb-8 text-3xl font-medium tracking-[-0.035em] text-rose-text md:text-5xl">
            Vacaville laser FAQ
          </h2>
          <FaqAccordion items={faqs} />
        </div>
      </section>

      <section className="bg-rose py-20 text-center text-ink" aria-labelledby="vacaville-laser-next-step">
        <div className="mx-auto max-w-[720px] px-6">
          <h2 id="vacaville-laser-next-step" className="mb-4 text-3xl font-medium tracking-[-0.035em] md:text-5xl">
            Choose the device after the assessment.
          </h2>
          <p className="mb-8 text-lg font-light leading-relaxed text-ink">
            Open the live Vacaville laser category, review the Initial Laser Consult, and give the team the context needed to recommend a responsible path.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button disableHover href={BOOKING_HREF} data-cta="service-booking" className="rounded-full bg-white !text-rose-text">
              Book Initial Laser Consult
            </Button>
            <Button disableHover href="tel:+17073582928" data-cta="phone" variant="ghost">
              Call Rella
            </Button>
          </div>
          <p className="mt-6 text-xs leading-6 text-ink">
            Individual results vary. Laser and light-based treatment eligibility, device selection, settings, treatment area, and timing require an individualized assessment.
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
