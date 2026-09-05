import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FaqAccordion, FaqSchema } from "@/components/blocks/FaqAccordion";
import { TrustStrip } from "@/components/blocks/TrustStrip";
import { Button } from "@/components/ui/Button";
import { resolveBookingHref } from "@/lib/booking-routes";
import { locations } from "@/lib/data";
import { localBusinessSchema } from "@/lib/schemas";

const CANONICAL = "https://experiencerella.com/vacaville/facials";
const BOOKING_HREF = resolveBookingHref({
  location: "vacaville",
  service: "facials",
});
const clinic = locations.vacaville;

export const metadata: Metadata = {
  title: "Facials in Vacaville | Skin Consult & Options",
  description:
    "Compare the two facial options currently available for online booking at Rella Aesthetics in downtown Vacaville.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Professional Facials in Vacaville | Rella Aesthetics",
    description:
      "A skin consult or Signature HydraFacial booking path in downtown Vacaville.",
    url: CANONICAL,
    type: "website",
    images: [
      {
        url: "/images/service-facials.jpg",
        alt: "Professional facial consultation at Rella Aesthetics in Vacaville",
      },
    ],
  },
};

const facialOptions = [
  {
    name: "Initial Skin Health Consult",
    body: "A 30-minute starting point to review your skin, current concerns, products, sensitivities, recent procedures, and goals before a plan is selected.",
  },
  {
    name: "Signature HydraFacial",
    body: "A 45-minute HydraFacial currently available in Vacaville's online facial category. Review the included steps and any relevant preparation or aftercare before treatment.",
  },
] as const;

const visitSteps = [
  {
    title: "Assess",
    body: "Share your goals, sensitivities, current products, recent procedures, active irritation, medications, and important dates.",
  },
  {
    title: "Select",
    body: "Compare the two current online options and confirm the exact steps, products, enhancements, and total for the chosen service.",
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
    question: "Which facial options are listed at Rella Vacaville?",
    answer:
      "Rella's current Vacaville online facial category lists an Initial Skin Health Consult and Signature HydraFacial. Inventory can change, so confirm the selected service in the booking flow.",
  },
  {
    question: "How do I choose the right facial?",
    answer:
      "Choice depends on your skin, sensitivities, current concerns, home-care products, recent procedures, goals, and schedule. The Initial Skin Health Consult gives the team a responsible place to compare those factors before selecting a service.",
  },
  {
    question: "How much is a facial at Rella Vacaville?",
    answer:
      "Pricing depends on the selected facial and any appropriate enhancements. Review the current service and total before booking or treatment; this page does not publish an unverified starting price.",
  },
  {
    question: "How is a professional facial different from HydraFacial?",
    answer:
      "HydraFacial is a branded multi-step service. Vacaville's online facial category currently lists Signature HydraFacial alongside the Initial Skin Health Consult. The team can explain the included steps or discuss other facial services by phone.",
  },
  {
    question: "Can a facial replace medical care for acne or another skin condition?",
    answer:
      "No. A cosmetic facial is not a substitute for medical diagnosis or treatment. Seek appropriate medical care for a severe, persistent, painful, changing, infected, or otherwise concerning skin problem.",
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
  name: "Professional Facials in Vacaville",
  serviceType: "Professional facial consultation and cosmetic skin-care services",
  description: metadata.description,
  url: CANONICAL,
  image: "https://experiencerella.com/images/service-facials.jpg",
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

export default function VacavilleFacialsPage() {
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
              Professional skin care · Downtown Vacaville
            </p>
            <h1 className="mb-6 text-[clamp(2.75rem,6vw,4.9rem)] font-medium leading-[0.98] tracking-[-0.06em] text-rose-text">
              Facials in Vacaville, with a plan first.
            </h1>
            <p className="mb-8 max-w-[650px] text-lg font-light leading-relaxed text-silver-dark md:text-xl">
              Compare the two facial options currently available online around your skin, recent treatments, goals, and schedule—then choose in Rella&apos;s booking flow.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button disableHover href={BOOKING_HREF} data-cta="service-booking" className="rounded-full">
                Browse Vacaville Facial Booking
              </Button>
              <Button disableHover href="tel:+17073582928" data-cta="phone" variant="ghost" className="rounded-full bg-white/75">
                Call 707.358.2928
              </Button>
            </div>
            <p className="mt-5 text-xs leading-6 text-ink/70">
              Opens Rella Vacaville&apos;s live facial category. No treatment, professional, or appointment is selected for you.
            </p>
          </div>

          <div className="relative aspect-square self-center overflow-hidden bg-rose-blush sm:aspect-[4/3]">
            <Image
              src="/images/service-facials.jpg"
              alt="A provider performing a facial treatment for a reclining patient"
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
        ariaLabel="Rella Vacaville professional facial visit facts"
        items={["Two online options", "30-minute skin consult", "45-minute Signature HydraFacial", "Current total confirmed"]}
      />

      <section className="py-20 md:py-28" aria-labelledby="vacaville-facial-options">
        <div className="mx-auto max-w-[1120px] px-6 md:px-8">
          <div className="mb-12 max-w-[810px]">
            <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-text">
              Current Vacaville menu
            </p>
            <h2 id="vacaville-facial-options" className="mb-5 text-3xl font-medium tracking-[-0.04em] text-rose-text md:text-5xl">
              Start with your skin. Then choose the service.
            </h2>
            <p className="text-lg font-light leading-relaxed text-ink/70">
              The online category currently lists a skin consult and Signature HydraFacial. Call Rella before booking if you need another facial option.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {facialOptions.map((option, index) => (
              <article
                key={option.name}
                className={`border border-ink/12 p-7 md:p-8 ${index === 0 ? "bg-rose text-ink" : "bg-white"}`}
              >
                <div className="mb-7 flex items-center justify-between gap-4">
                  <span className={`text-xs font-bold tracking-[0.18em] ${index === 0 ? "text-ink" : "text-rose-text"}`}>
                    0{index + 1}
                  </span>
                  <span className={`h-px flex-1 ${index === 0 ? "bg-white/20" : "bg-rose-light/70"}`} aria-hidden="true" />
                </div>
                <h3 className="mb-3 text-2xl font-medium tracking-[-0.025em]">{option.name}</h3>
                <p className={`text-sm leading-7 ${index === 0 ? "text-ink" : "text-ink/70"}`}>{option.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-rose py-20 text-ink md:py-28" aria-labelledby="vacaville-facial-visit">
        <div className="mx-auto max-w-[1120px] px-6 md:px-8">
          <div className="mb-12 max-w-[780px]">
            <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-ink">Your visit</p>
            <h2 id="vacaville-facial-visit" className="mb-5 text-3xl font-medium tracking-[-0.04em] md:text-5xl">
              A polished experience built on specifics.
            </h2>
            <p className="text-lg font-light leading-relaxed text-ink">
              Facial protocols vary. A useful plan accounts for what is happening with your skin today and what else has been used or scheduled around it.
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

      <section className="py-20 md:py-28" aria-labelledby="vacaville-facial-booking">
        <div className="mx-auto grid max-w-[1040px] gap-8 px-6 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-text">A clear booking chooser</p>
            <h2 id="vacaville-facial-booking" className="mb-5 text-3xl font-medium tracking-[-0.04em] text-rose-text md:text-5xl">
              Choose a skin consult or Signature HydraFacial.
            </h2>
            <p className="text-lg font-light leading-relaxed text-ink/70">
              The verified booking path opens Vacaville&apos;s facial category with the clinic selected. You choose the service, professional, and appointment in the secure booking flow.
            </p>
          </div>
          <div className="border-l-4 border-rose bg-rose-blush p-7 md:p-10">
            <p className="mb-3 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-rose-text">Clear before treatment</p>
            <p className="mb-6 text-lg leading-8 text-silver-dark">
              Review the recommended service, included steps, relevant preparation and aftercare, and current total before proceeding.
            </p>
            <Button disableHover href={BOOKING_HREF} data-cta="service-booking" className="rounded-full">
              Browse Facial Options
            </Button>
            <Link href="/services/facials" className="mt-6 block text-sm font-semibold text-rose-text underline decoration-rose-light underline-offset-4 hover:text-rose-text">
              Read the full facial guide →
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-rose-blush py-20 md:py-24" aria-labelledby="vacaville-facial-compare">
        <div className="mx-auto grid max-w-[1040px] gap-8 px-6 md:grid-cols-[1fr_auto] md:items-center md:px-8">
          <div>
            <p className="mb-3 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-text">Comparing skin-care paths?</p>
            <h2 id="vacaville-facial-compare" className="mb-3 text-3xl font-medium tracking-[-0.035em] text-rose-text">
              A facial, HydraFacial, peel, and microneedling are not interchangeable.
            </h2>
            <p className="max-w-[760px] text-ink/70">
              Products, devices, intensity, candidacy, and recovery differ. Use the focused guides below, then ask the team to compare timing before combining or sequencing services.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Button href="/vacaville/hydrafacial" variant="ghost" disableHover className="rounded-full bg-white">Explore HydraFacial</Button>
            <Link href="/vacaville/chemical-peels" className="text-center text-sm font-semibold text-rose-text underline underline-offset-4">Compare chemical peels</Link>
            <Link href="/vacaville/microneedling" className="text-center text-sm font-semibold text-rose-text underline underline-offset-4">Compare microneedling</Link>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28" aria-labelledby="vacaville-facial-faq">
        <div className="mx-auto max-w-[900px] px-6 md:px-8">
          <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-text">Questions, answered</p>
          <h2 id="vacaville-facial-faq" className="mb-8 text-3xl font-medium tracking-[-0.035em] text-rose-text md:text-5xl">
            Vacaville facial FAQ
          </h2>
          <FaqAccordion items={faqs} />
        </div>
      </section>

      <section className="bg-rose py-20 text-center text-ink" aria-labelledby="vacaville-facial-next-step">
        <div className="mx-auto max-w-[740px] px-6">
          <h2 id="vacaville-facial-next-step" className="mb-4 text-3xl font-medium tracking-[-0.035em] md:text-5xl">
            Put your skin—not a trend—at the center.
          </h2>
          <p className="mb-8 text-lg font-light leading-relaxed text-ink">
            Start with the verified Vacaville consult or call Rella with a question before choosing a service.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button disableHover href={BOOKING_HREF} data-cta="service-booking" className="rounded-full bg-white !text-rose-text">
              Browse Vacaville Facial Booking
            </Button>
            <Button disableHover href="tel:+17073582928" data-cta="phone" variant="ghost">
              Call Rella
            </Button>
          </div>
          <p className="mt-6 text-xs leading-6 text-ink">
            Individual response varies. Suitability, products, treatment steps, possible temporary effects, preparation, and aftercare depend on the exact service and your skin.
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
