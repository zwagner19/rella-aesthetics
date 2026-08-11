import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FaqAccordion, FaqSchema } from "@/components/blocks/FaqAccordion";
import { TrustStrip } from "@/components/blocks/TrustStrip";
import { Button } from "@/components/ui/Button";
import { resolveBookingHref } from "@/lib/booking-routes";
import { locations } from "@/lib/data";
import { localBusinessSchema } from "@/lib/schemas";

const CANONICAL = "https://experiencerella.com/vacaville/microneedling";
const BOOKING_HREF = resolveBookingHref({
  location: "vacaville",
  service: "microneedling",
});
const clinic = locations.vacaville;

export const metadata: Metadata = {
  title: "Microneedling in Vacaville | Consult & Options",
  description:
    "Compare Skin Stylus and RF microneedling at Rella Aesthetics in Vacaville, review candidacy and recovery, and book the live initial consult.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Microneedling in Vacaville | Rella Aesthetics",
    description:
      "Consult-first Skin Stylus and RF microneedling planning with a direct Vacaville booking path.",
    url: CANONICAL,
    type: "website",
    images: [
      {
        url: "/images/service-microneedling.jpg",
        alt: "Microneedling consultation at Rella Aesthetics in Vacaville",
      },
    ],
  },
};

const paths = [
  {
    title: "Initial Microneedling Consult",
    body: "The direct starting point from this page. A licensed professional reviews your skin, history, goals, expected response, and potential side effects before recommending a modality.",
  },
  {
    title: "Skin Stylus Microneedling",
    body: "A standard microneedling option in the current Vacaville menu. Device settings, treatment area, comfort measures, recovery, and number of procedures require an individual plan.",
  },
  {
    title: "RF Microneedling",
    body: "A separate menu option that combines microneedles with radiofrequency energy. It is not interchangeable with standard microneedling and has a different risk profile.",
  },
] as const;

const planningFactors = [
  {
    title: "Skin & goal",
    body: "The device and indication should fit your skin, treatment area, concern, and realistic expectations.",
  },
  {
    title: "Health history",
    body: "Medications, bleeding or immune concerns, active skin conditions, prior procedures, and healing history belong in the review.",
  },
  {
    title: "Sun & products",
    body: "Recent tanning, planned sun exposure, makeup, retinoids, acids, and other products can affect preparation and aftercare.",
  },
  {
    title: "Recovery window",
    body: "Redness, tightness, dryness, peeling, bruising, or other effects can occur. Timing and response vary by device, depth, area, and person.",
  },
] as const;

const faqs = [
  {
    question: "Which microneedling options are listed at Rella Vacaville?",
    answer:
      "Rella's current Vacaville menu lists Skin Stylus Microneedling, RF Microneedling, an Initial Microneedling Consult, selected packages, and a neck add-on. Suitability and the responsible treatment path are reviewed before treatment.",
  },
  {
    question: "What is the difference between Skin Stylus and RF microneedling?",
    answer:
      "Standard microneedling uses small needles to create controlled microchannels. RF microneedling also delivers radiofrequency energy through a needle array. They use different technology and have different risks, so the exact device and plan need to be discussed during the consult.",
  },
  {
    question: "Is microneedling appropriate for everyone?",
    answer:
      "No. Candidacy depends on the device and indication as well as your skin, health history, medications, active conditions, prior procedures, sun exposure, healing history, and other individual factors.",
  },
  {
    question: "How much downtime should I expect?",
    answer:
      "Recovery varies by modality, device settings, depth, treatment area, and individual response. Temporary redness, tightness, dryness, peeling, bruising, or discomfort can occur; review the expected recovery before scheduling.",
  },
  {
    question: "How many microneedling sessions will I need?",
    answer:
      "The number and spacing of procedures depend on the device, indication, area, skin response, and goals. More than one procedure may be considered, but the consult should not promise a fixed series or result.",
  },
  {
    question: "How much does microneedling cost at Rella Vacaville?",
    answer:
      "Pricing depends on the selected modality, treatment area, and whether an individual service or package is appropriate. Rella will review the current service and total before treatment; this page does not publish an unverified starting price.",
  },
] as const;

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${CANONICAL}#service`,
  name: "Microneedling in Vacaville",
  serviceType: "Microneedling consultation and treatment",
  description: metadata.description,
  url: CANONICAL,
  image: "https://experiencerella.com/images/service-microneedling.jpg",
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

export default function VacavilleMicroneedlingPage() {
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
            <p className="mb-5 text-[0.6875rem] font-bold uppercase tracking-[0.22em] text-rose-dark">
              Skin treatment · Downtown Vacaville
            </p>
            <h1 className="mb-6 text-[clamp(2.75rem,6vw,4.9rem)] font-medium leading-[0.98] tracking-[-0.06em] text-ink">
              Microneedling in Vacaville.
            </h1>
            <p className="mb-8 max-w-[650px] text-lg font-light leading-relaxed text-silver-dark md:text-xl">
              Compare Skin Stylus and RF microneedling, then start with a candidacy and recovery conversation—not a preset package.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button href={BOOKING_HREF} data-cta="service-booking" className="rounded-full">
                Book Initial Consult
              </Button>
              <Button href="tel:+17073582928" data-cta="phone" variant="ghost" className="rounded-full bg-white/75">
                Call 707.358.2928
              </Button>
            </div>
            <p className="mt-5 text-xs leading-6 text-silver">
              This button opens the live Vacaville Initial Microneedling Consult with Select a professional as the next step.
            </p>
          </div>

          <div className="relative min-h-[390px] overflow-hidden md:min-h-[520px]">
            <Image
              src="/images/service-microneedling.jpg"
              alt="Microneedling consultation at Rella Aesthetics in Vacaville"
              fill
              priority
              className="object-cover"
              sizes="(min-width: 1024px) 46vw, 92vw"
            />
            <div className="absolute inset-x-0 bottom-0 border-t border-white/30 bg-white/94 p-5 md:p-6">
              <p className="mb-2 text-[0.625rem] font-bold uppercase tracking-[0.2em] text-rose-dark">
                Rella Aesthetics — Vacaville
              </p>
              <p className="text-lg font-medium leading-snug text-ink">
                542 Main St · Wednesday–Saturday, 9am–5pm
              </p>
            </div>
          </div>
        </div>
      </section>

      <TrustStrip
        ariaLabel="Rella Vacaville microneedling visit facts"
        items={["Consult-first path", "Skin Stylus + RF", "Individual recovery plan", "Downtown Vacaville"]}
      />

      <section className="py-20 md:py-28" aria-labelledby="vacaville-microneedling-options">
        <div className="mx-auto max-w-[1120px] px-6 md:px-8">
          <div className="mb-12 max-w-[790px]">
            <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-dark">
              Current Vacaville paths
            </p>
            <h2 id="vacaville-microneedling-options" className="mb-5 text-3xl font-medium tracking-[-0.04em] text-ink md:text-5xl">
              One consult. Two different technologies.
            </h2>
            <p className="text-lg font-light leading-relaxed text-silver">
              Rella&apos;s current menu separates Skin Stylus from RF microneedling. The initial consult is the responsible place to compare them and decide whether either is appropriate.
            </p>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {paths.map((path, index) => (
              <article
                key={path.title}
                className={`border p-7 md:p-8 ${index === 0 ? "border-rose bg-rose-blush" : "border-ink/12 bg-white"}`}
              >
                <span className="mb-8 inline-flex h-9 w-9 items-center justify-center rounded-full bg-rose-cta text-xs font-bold text-white">{index + 1}</span>
                <h3 className="mb-4 text-xl font-medium tracking-[-0.02em] text-ink">{path.title}</h3>
                <p className="text-sm leading-7 text-silver">{path.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink py-20 text-white md:py-28" aria-labelledby="vacaville-microneedling-plan">
        <div className="mx-auto max-w-[1120px] px-6 md:px-8">
          <div className="mb-12 max-w-[780px]">
            <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose">Before treatment</p>
            <h2 id="vacaville-microneedling-plan" className="mb-5 text-3xl font-medium tracking-[-0.04em] md:text-5xl">
              Device, depth, area, and recovery all matter.
            </h2>
            <p className="text-lg font-light leading-relaxed text-white/70">
              Microneedling is not suitable for everyone, and a desired cosmetic result is not guaranteed. Give the provider enough context to assess the proposed plan.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {planningFactors.map((factor, index) => (
              <article key={factor.title} className="border border-white/15 bg-white/[0.04] p-6">
                <span className="mb-8 inline-flex h-9 w-9 items-center justify-center rounded-full bg-rose text-xs font-bold">{index + 1}</span>
                <h3 className="mb-3 text-xl font-medium">{factor.title}</h3>
                <p className="text-sm leading-7 text-white/70">{factor.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28" aria-labelledby="vacaville-microneedling-rf">
        <div className="mx-auto grid max-w-[1040px] gap-8 px-6 md:px-8 lg:grid-cols-[1.03fr_0.97fr] lg:items-center">
          <div>
            <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-dark">RF deserves a separate conversation</p>
            <h2 id="vacaville-microneedling-rf" className="mb-5 text-3xl font-medium tracking-[-0.04em] text-ink md:text-5xl">
              Added energy means added questions.
            </h2>
            <p className="text-lg font-light leading-relaxed text-silver">
              RF microneedling combines a needle array with radiofrequency energy. The exact device, settings, treatment area, provider training, expected benefit, alternatives, and material risks should be reviewed before you choose it.
            </p>
          </div>
          <div className="border-l-4 border-rose bg-rose-blush p-7 md:p-10">
            <p className="mb-3 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-rose-dark">Important risk context</p>
            <p className="mb-6 text-lg leading-8 text-silver-dark">
              The FDA has reported serious complications with certain uses of RF microneedling, including burns, scarring, fat loss, disfigurement, and nerve damage. Your consultation should address the risks relevant to the exact device and plan.
            </p>
            <a
              href="https://www.fda.gov/medical-devices/safety-communications/potential-risks-certain-uses-radiofrequency-rf-microneedling-fda-safety-communication"
              className="text-sm font-semibold text-rose-text underline decoration-rose-light underline-offset-4 hover:text-rose-dark"
            >
              Read the FDA safety communication →
            </a>
          </div>
        </div>
      </section>

      <section className="bg-rose-blush py-20 md:py-24" aria-labelledby="vacaville-microneedling-consult">
        <div className="mx-auto grid max-w-[1040px] gap-8 px-6 md:grid-cols-[1fr_auto] md:items-center md:px-8">
          <div>
            <p className="mb-3 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-dark">Direct consult handoff</p>
            <h2 id="vacaville-microneedling-consult" className="mb-3 text-3xl font-medium tracking-[-0.035em] text-ink">
              Start with Initial Microneedling Consult.
            </h2>
            <p className="max-w-[700px] text-silver">
              The live service describes a skin evaluation and goal discussion used to assess suitability, set expectations, and review potential side effects before treatment.
            </p>
          </div>
          <Button href={BOOKING_HREF} data-cta="service-booking" className="rounded-full">
            Book Initial Consult
          </Button>
        </div>
      </section>

      <section className="py-20 md:py-28" aria-labelledby="vacaville-microneedling-faq">
        <div className="mx-auto max-w-[900px] px-6 md:px-8">
          <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-dark">Questions, answered</p>
          <h2 id="vacaville-microneedling-faq" className="mb-8 text-3xl font-medium tracking-[-0.035em] text-ink md:text-5xl">
            Vacaville microneedling FAQ
          </h2>
          <FaqAccordion items={faqs} />
        </div>
      </section>

      <section className="bg-rose-cta py-20 text-center text-white" aria-labelledby="vacaville-microneedling-next-step">
        <div className="mx-auto max-w-[740px] px-6">
          <h2 id="vacaville-microneedling-next-step" className="mb-4 text-3xl font-medium tracking-[-0.035em] md:text-5xl">
            Choose the modality after the assessment.
          </h2>
          <p className="mb-8 text-lg font-light leading-relaxed text-white/85">
            Open the exact Vacaville consult, review the professional and booking terms, or call the team before choosing a treatment.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button href={BOOKING_HREF} data-cta="service-booking" className="rounded-full bg-white !text-rose-text hover:bg-white/90 hover:!text-rose-dark">
              Book Initial Consult
            </Button>
            <Button href="tel:+17073582928" data-cta="phone" variant="ghost" className="rounded-full border-white/70 !text-white hover:border-white hover:!text-white">
              Call Rella
            </Button>
          </div>
          <p className="mt-6 text-xs leading-6 text-white/70">
            Individual response and recovery vary. Device selection, settings, treatment area, number of procedures, and suitability require an individualized assessment.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-white/75">
            <Link href="/services/microneedling" className="underline underline-offset-4 hover:text-white">Full microneedling guide</Link>
            <Link href="/cancellation-policy" className="underline underline-offset-4 hover:text-white">Cancellation policy</Link>
            <Link href="/locations/vacaville" className="underline underline-offset-4 hover:text-white">Vacaville clinic details</Link>
          </div>
        </div>
      </section>
    </>
  );
}
