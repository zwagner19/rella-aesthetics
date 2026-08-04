import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FaqAccordion, FaqSchema } from "@/components/blocks/FaqAccordion";
import { TrustStrip } from "@/components/blocks/TrustStrip";
import { Button } from "@/components/ui/Button";
import { resolveBookingHref } from "@/lib/booking-routes";
import { locations } from "@/lib/data";
import { localBusinessSchema } from "@/lib/schemas";

const CANONICAL = "https://experiencerella.com/napa/facials";
const BOOKING_HREF = resolveBookingHref({
  location: "napa",
  service: "facials",
});
const clinic = locations.napa;

export const metadata: Metadata = {
  title: "Facials in Napa | Skin Consult & Options",
  description:
    "Compare current professional facial options at Rella Aesthetics in downtown Napa and book the verified Initial Skin Health Consult.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Professional Facials in Napa | Rella Aesthetics",
    description:
      "A consult-first path to current facial options, individualized product planning, and clear next steps in downtown Napa.",
    url: CANONICAL,
    type: "website",
    images: [
      {
        url: "/images/service-facials.jpg",
        alt: "Professional facial consultation at Rella Aesthetics in Napa",
      },
    ],
  },
};

const facialOptions = [
  {
    name: "Initial Skin Health Consult",
    body: "The verified starting point for a comprehensive look at your skin, current concerns, products, sensitivities, recent procedures, and goals before a plan is selected.",
  },
  {
    name: "Microdermabrasion Deluxe Facial",
    body: "A current Napa menu option. Ask how the exfoliation method, included steps, preparation, expected response, and aftercare fit your skin and recent treatments.",
  },
  {
    name: "Anti Aging Facial",
    body: "A current cosmetic menu option. Confirm the products and steps included, the appearance-focused goals being discussed, and the response that can reasonably be expected.",
  },
  {
    name: "Acne Facial",
    body: "This is the name of a cosmetic facial in the current menu. The consult should separate skin-care goals from concerns that need medical diagnosis or treatment.",
  },
  {
    name: "Dermaplaning Deluxe Facial",
    body: "A current menu option that includes dermaplaning. Review sensitivities, active irritation, recent procedures, products, and aftercare before proceeding.",
  },
] as const;

const visitSteps = [
  {
    title: "Assess",
    body: "Share your goals, sensitivities, current products, recent procedures, active irritation, medications, and important dates.",
  },
  {
    title: "Select",
    body: "Compare the current services and confirm the exact steps, products, enhancements, and current total for the chosen option.",
  },
  {
    title: "Experience",
    body: "Your provider follows the selected protocol and adjusts only within the service and plan discussed with you.",
  },
  {
    title: "Continue",
    body: "Leave with service-specific aftercare and guidance on home products, sun protection, and timing around other procedures.",
  },
] as const;

const faqs = [
  {
    question: "Which facial options are listed at Rella Napa?",
    answer:
      "Rella's current Napa menu includes an Initial Skin Health Consult, Microdermabrasion Deluxe Facial, Anti Aging Facial, Acne Facial, and Dermaplaning Deluxe Facial. HydraFacial tiers are also available through their own booking path. Inventory can change, so confirm the selected service before treatment.",
  },
  {
    question: "How do I choose the right facial?",
    answer:
      "Choice depends on your skin, sensitivities, current concerns, home-care products, recent procedures, goals, and schedule. The Initial Skin Health Consult gives the team a responsible place to compare those factors before selecting a service.",
  },
  {
    question: "How much is a facial at Rella Napa?",
    answer:
      "Pricing depends on the selected facial and any appropriate enhancements. Review the current service and total before booking or treatment; this page does not publish an unverified starting price.",
  },
  {
    question: "How is a professional facial different from HydraFacial?",
    answer:
      "HydraFacial is a branded multi-step service with Signature, Deluxe, and Platinum tiers. Rella's other facials can use different products, techniques, and included steps. The team can compare the exact current options with you.",
  },
  {
    question: "Can a facial replace medical care for acne or another skin condition?",
    answer:
      "No. A cosmetic facial is not a substitute for medical diagnosis or treatment. Seek appropriate medical care for a severe, persistent, painful, changing, infected, or otherwise concerning skin problem.",
  },
  {
    question: "Where is Rella Aesthetics in Napa?",
    answer:
      "Rella Aesthetics is at 1541 3rd St in downtown Napa, CA 94559. Current published clinic hours are Tuesday through Saturday, 9am–5pm.",
  },
] as const;

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${CANONICAL}#service`,
  name: "Professional Facials in Napa",
  serviceType: "Professional facial consultation and cosmetic skin-care services",
  description: metadata.description,
  url: CANONICAL,
  image: "https://experiencerella.com/images/service-facials.jpg",
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

export default function NapaFacialsPage() {
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
              Professional skin care · Downtown Napa
            </p>
            <h1 className="mb-6 text-[clamp(2.75rem,6vw,4.9rem)] font-medium leading-[0.98] tracking-[-0.06em] text-ink">
              Professional facials in Napa, with a plan first.
            </h1>
            <p className="mb-8 max-w-[650px] text-lg font-light leading-relaxed text-silver-dark md:text-xl">
              Compare current facial options around your skin, products, recent treatments, goals, and schedule—then start with the verified Initial Skin Health Consult.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button href={BOOKING_HREF} data-cta="service-booking" className="rounded-full">
                Book Skin Health Consult
              </Button>
              <Button href="tel:+17073582928" data-cta="phone" variant="ghost" className="rounded-full bg-white/75">
                Call 707.358.2928
              </Button>
            </div>
            <p className="mt-5 text-xs leading-6 text-silver">
              Opens Rella Napa&apos;s live Initial Skin Health Consult. A professional and appointment time are selected in the secure booking flow.
            </p>
          </div>

          <div className="relative min-h-[390px] overflow-hidden rounded-[2rem] shadow-[0_24px_80px_rgba(90,94,98,0.18)] md:min-h-[520px]">
            <Image
              src="/images/service-facials.jpg"
              alt="Professional facial consultation at Rella Aesthetics in Napa"
              fill
              priority
              className="object-cover"
              sizes="(min-width: 1024px) 46vw, 92vw"
            />
            <div className="absolute inset-x-4 bottom-4 rounded-[1.35rem] bg-white/94 p-5 shadow-lg backdrop-blur md:inset-x-6 md:bottom-6 md:p-6">
              <p className="mb-2 text-[0.625rem] font-bold uppercase tracking-[0.2em] text-rose-dark">
                Rella Aesthetics — Napa
              </p>
              <p className="text-lg font-medium leading-snug text-ink">
                1541 3rd St · Tuesday–Saturday, 9am–5pm
              </p>
            </div>
          </div>
        </div>
      </section>

      <TrustStrip
        ariaLabel="Rella Napa professional facial visit facts"
        items={["Verified skin consult", "Five current menu paths", "Products reviewed first", "Current total confirmed"]}
      />

      <section className="py-20 md:py-28" aria-labelledby="napa-facial-options">
        <div className="mx-auto max-w-[1120px] px-6 md:px-8">
          <div className="mb-12 max-w-[810px]">
            <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-dark">
              Current Napa menu
            </p>
            <h2 id="napa-facial-options" className="mb-5 text-3xl font-medium tracking-[-0.04em] text-ink md:text-5xl">
              Start with your skin. Then choose the service.
            </h2>
            <p className="text-lg font-light leading-relaxed text-silver">
              These paths are currently visible in Rella&apos;s Napa facial menu. The consult helps connect a service name to the products, steps, and aftercare that make sense for you.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-6">
            {facialOptions.map((option, index) => (
              <article
                key={option.name}
                className={`rounded-[1.6rem] border border-silver-pale p-7 shadow-[0_14px_45px_rgba(90,94,98,0.07)] md:p-8 ${
                  index === 0
                    ? "bg-ink text-white md:col-span-2 lg:col-span-2"
                    : `bg-white md:col-span-1 ${index >= 3 ? "lg:col-span-3" : "lg:col-span-2"}`
                }`}
              >
                <div className="mb-7 flex items-center justify-between gap-4">
                  <span className={`text-xs font-bold tracking-[0.18em] ${index === 0 ? "text-rose" : "text-rose-dark"}`}>
                    0{index + 1}
                  </span>
                  <span className={`h-px flex-1 ${index === 0 ? "bg-white/20" : "bg-rose-light/70"}`} aria-hidden="true" />
                </div>
                <h3 className="mb-3 text-2xl font-medium tracking-[-0.025em]">{option.name}</h3>
                <p className={`text-sm leading-7 ${index === 0 ? "text-white/70" : "text-silver"}`}>{option.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink py-20 text-white md:py-28" aria-labelledby="napa-facial-visit">
        <div className="mx-auto max-w-[1120px] px-6 md:px-8">
          <div className="mb-12 max-w-[780px]">
            <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose">Your visit</p>
            <h2 id="napa-facial-visit" className="mb-5 text-3xl font-medium tracking-[-0.04em] md:text-5xl">
              A polished experience built on specifics.
            </h2>
            <p className="text-lg font-light leading-relaxed text-white/70">
              Facial protocols vary. A useful plan accounts for what is happening with your skin today and what else has been used or scheduled around it.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {visitSteps.map((step, index) => (
              <article key={step.title} className="rounded-[1.3rem] border border-white/15 bg-white/[0.04] p-6">
                <span className="mb-8 inline-flex h-9 w-9 items-center justify-center rounded-full bg-rose text-xs font-bold">{index + 1}</span>
                <h3 className="mb-3 text-xl font-medium">{step.title}</h3>
                <p className="text-sm leading-7 text-white/70">{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28" aria-labelledby="napa-facial-booking">
        <div className="mx-auto grid max-w-[1040px] gap-8 px-6 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-dark">A direct booking handoff</p>
            <h2 id="napa-facial-booking" className="mb-5 text-3xl font-medium tracking-[-0.04em] text-ink md:text-5xl">
              Begin at the Initial Skin Health Consult.
            </h2>
            <p className="text-lg font-light leading-relaxed text-silver">
              The verified booking path opens that exact Napa service and displays <strong className="font-medium text-ink">Select a professional</strong>. It does not choose a treatment or appointment for you.
            </p>
          </div>
          <div className="rounded-[1.75rem] bg-rose-blush p-7 md:p-10">
            <p className="mb-3 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-rose-dark">Clear before treatment</p>
            <p className="mb-6 text-lg leading-8 text-silver-dark">
              Review the recommended service, included steps, relevant preparation and aftercare, and current total before proceeding.
            </p>
            <Button href={BOOKING_HREF} data-cta="service-booking" className="rounded-full">
              Book Initial Consult
            </Button>
            <Link href="/services/facials" className="mt-6 block text-sm font-semibold text-rose-text underline decoration-rose-light underline-offset-4 hover:text-rose-dark">
              Read the full facial guide →
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-rose-blush py-20 md:py-24" aria-labelledby="napa-facial-compare">
        <div className="mx-auto grid max-w-[1040px] gap-8 px-6 md:grid-cols-[1fr_auto] md:items-center md:px-8">
          <div>
            <p className="mb-3 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-dark">Comparing skin-care paths?</p>
            <h2 id="napa-facial-compare" className="mb-3 text-3xl font-medium tracking-[-0.035em] text-ink">
              A facial, HydraFacial, and laser procedure are not interchangeable.
            </h2>
            <p className="max-w-[760px] text-silver">
              Products, devices, intensity, candidacy, and recovery differ. Use the focused guides below, then ask the team to compare timing before combining or sequencing services.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Button href="/napa/hydrafacial" variant="ghost" className="rounded-full bg-white">Explore HydraFacial</Button>
            <Link href="/napa/laser" className="text-center text-sm font-semibold text-rose-text underline underline-offset-4">Compare laser options</Link>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28" aria-labelledby="napa-facial-faq">
        <div className="mx-auto max-w-[900px] px-6 md:px-8">
          <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-dark">Questions, answered</p>
          <h2 id="napa-facial-faq" className="mb-8 text-3xl font-medium tracking-[-0.035em] text-ink md:text-5xl">
            Napa facial FAQ
          </h2>
          <FaqAccordion items={faqs} />
        </div>
      </section>

      <section className="bg-rose py-20 text-center text-white" aria-labelledby="napa-facial-next-step">
        <div className="mx-auto max-w-[740px] px-6">
          <h2 id="napa-facial-next-step" className="mb-4 text-3xl font-medium tracking-[-0.035em] md:text-5xl">
            Put your skin—not a trend—at the center.
          </h2>
          <p className="mb-8 text-lg font-light leading-relaxed text-white/85">
            Start with the verified Napa consult or call Rella with a question before choosing a service.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button href={BOOKING_HREF} data-cta="service-booking" className="rounded-full bg-white !text-rose hover:bg-white/90 hover:!text-rose-dark">
              Book Skin Health Consult
            </Button>
            <Button href="tel:+17073582928" data-cta="phone" variant="ghost" className="rounded-full border-white/70 !text-white hover:border-white hover:!text-white">
              Call Rella
            </Button>
          </div>
          <p className="mt-6 text-xs leading-6 text-white/70">
            Individual response varies. Suitability, products, treatment steps, possible temporary effects, preparation, and aftercare depend on the exact service and your skin.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-white/75">
            <Link href="/cancellation-policy" className="underline underline-offset-4 hover:text-white">Cancellation policy</Link>
            <Link href="/locations/napa" className="underline underline-offset-4 hover:text-white">Napa clinic details</Link>
          </div>
        </div>
      </section>
    </>
  );
}
