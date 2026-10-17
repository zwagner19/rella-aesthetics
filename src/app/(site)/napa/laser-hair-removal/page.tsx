import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FaqAccordion, FaqSchema } from "@/components/blocks/FaqAccordion";
import { TrustStrip } from "@/components/blocks/TrustStrip";
import { Button } from "@/components/ui/Button";
import { resolveBookingHref } from "@/lib/booking-routes";
import { locations } from "@/lib/data";
import { localBusinessSchema } from "@/lib/schemas";

const CANONICAL = "https://experiencerella.com/napa/laser-hair-removal";
const BOOKING_HREF = resolveBookingHref({
  location: "napa",
  service: "laser-hair-removal",
});
const clinic = locations.napa;

export const metadata: Metadata = {
  title: "Laser Hair Removal in Napa | Consultation First",
  description:
    "Start with Rella Napa's complimentary 30-minute laser consultation to review treatment area, suitability, timing, and current pricing.",
  alternates: { canonical: CANONICAL },
  robots: { index: false, follow: false },
  openGraph: {
    title: "Laser Hair Removal in Napa | Rella Aesthetics",
    description:
      "A consultation-first path for laser hair removal at Rella Aesthetics in downtown Napa.",
    url: CANONICAL,
    type: "website",
    images: [
      {
        url: "/images/treatments/laser-treatment.webp",
        alt: "A Rella provider performing an in-clinic laser treatment",
      },
    ],
  },
};

const areaOptions = [
  {
    title: "Small area",
    body: "A focused option for smaller treatment areas. Your consultation helps match the area you have in mind with the right appointment.",
  },
  {
    title: "Medium area",
    body: "Designed for mid-sized treatment areas. The team will walk through timing and pricing with you before treatment.",
  },
  {
    title: "Large area",
    body: "Larger treatment areas receive their own plan. Use the consultation to talk through the area and choose your next step.",
  },
] as const;

const planningFactors = [
  {
    title: "Treatment area",
    body: "The area you want to treat helps determine the appointment type and timing.",
  },
  {
    title: "Skin and hair",
    body: "A provider reviews relevant skin and hair characteristics before recommending whether treatment is appropriate.",
  },
  {
    title: "Recent exposure",
    body: "Share recent tanning, sun exposure, products, medications, and procedures because they can affect timing and suitability.",
  },
  {
    title: "Your calendar",
    body: "Plan treatment around travel, work, and the dates that matter to you.",
  },
] as const;

const faqs = [
  {
    question: "What can I book online for laser hair removal in Napa?",
    answer:
      "Start with a complimentary 30-minute Initial Laser Consult at Rella Napa. You will choose your appointment time, then meet with the team to discuss your goals and the treatment area you have in mind.",
  },
  {
    question: "How much does laser hair removal cost at Rella Napa?",
    answer:
      "Pricing depends on whether your treatment area is small, medium, or large. The Rella team will confirm the category and walk you through the total before treatment.",
  },
  {
    question: "How many appointments will I need?",
    answer:
      "The right treatment course varies by area, hair and skin characteristics, response, timing, and your goals. Your consultation is the best place to build a plan for you.",
  },
  {
    question: "What should I share during the consultation?",
    answer:
      "Share the area you want to discuss, recent sun or tanning exposure, medications, active products, skin changes, prior hair-removal treatment, and important dates. Follow the provider's instructions for preparation rather than relying on general advice online.",
  },
  {
    question: "Is there downtime after laser hair removal?",
    answer:
      "Temporary skin responses and activity guidance can vary by the area, device, settings, and individual response. Ask the provider what to expect for the exact plan before treatment is scheduled.",
  },
  {
    question: "Where is Rella Aesthetics in Napa?",
    answer:
      "Rella Aesthetics is at 1541 3rd St in downtown Napa, CA 94559. Clinic hours are Wednesday through Saturday, 9am-5pm.",
  },
] as const;

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${CANONICAL}#service`,
  name: "Laser Hair Removal Consultation in Napa",
  serviceType: "Laser hair removal consultation",
  description: metadata.description,
  url: CANONICAL,
  image: "https://experiencerella.com/images/treatments/laser-treatment.webp",
  provider: {
    "@type": ["MedicalBusiness", "DaySpa"],
    "@id": "https://experiencerella.com/locations/napa#location",
    name: "Rella Aesthetics - Napa",
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

export default function NapaLaserHairRemovalPreviewPage() {
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
          __html: JSON.stringify(localBusinessSchema(clinic)).replace(
            /</g,
            "\\u003c",
          ),
        }}
      />

      <section className="overflow-hidden bg-paper py-16 md:py-24">
        <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-6 md:px-8 lg:grid-cols-[1.04fr_0.96fr] lg:px-12">
          <div>
            <p className="mb-5 text-[0.6875rem] font-bold uppercase tracking-[0.22em] text-rose-text">
              Laser hair removal - Downtown Napa
            </p>
            <h1 className="mb-6 text-[clamp(2.75rem,6vw,4.9rem)] font-medium leading-[0.98] tracking-[-0.06em] text-rose-text">
              Laser hair removal starts with the right plan.
            </h1>
            <p className="mb-8 max-w-[650px] text-lg font-light leading-relaxed text-silver-dark md:text-xl">
              Begin with Rella Napa&apos;s complimentary 30-minute laser
              consultation. Talk through the area you want to treat, your
              schedule, and the plan that fits you before moving forward.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                disableHover
                href={BOOKING_HREF}
                data-cta="service-booking"
                className="rounded-full"
              >
                Start With a Laser Consult
              </Button>
              <Button
                disableHover
                href="tel:+17073582928"
                data-cta="phone"
                variant="ghost"
                className="rounded-full bg-white/75"
              >
                Call 707.358.2928
              </Button>
            </div>
            <p className="mt-5 text-xs leading-6 text-ink/70">
              Choose a convenient time for your complimentary Initial Laser
              Consult at Rella Napa.
            </p>
          </div>

          <div className="relative aspect-[4/5] max-h-[720px] self-center overflow-hidden bg-rose-blush">
            <Image
              src="/images/treatments/laser-treatment.webp"
              alt="A Rella provider performing an in-clinic laser treatment"
              fill
              preload
              className="object-cover object-center"
              sizes="(min-width: 1024px) 46vw, 92vw"
            />
            <div className="absolute inset-x-0 bottom-0 border-t border-white/30 bg-white/94 p-5 md:p-6">
              <p className="mb-2 text-[0.625rem] font-bold uppercase tracking-[0.2em] text-rose-text">
                Rella Aesthetics - Napa
              </p>
              <p className="text-lg font-medium leading-snug text-ink">
                1541 3rd St - Wednesday-Saturday, 9am-5pm
              </p>
            </div>
          </div>
        </div>
      </section>

      <TrustStrip
        ariaLabel="Rella Napa laser hair removal visit facts"
        items={[
          "Complimentary 30-minute consult",
          "Small, medium, and large areas",
          "Pricing reviewed before treatment",
          "Downtown Napa",
        ]}
      />

      <section
        className="rella-site-reveal py-20 md:py-28"
        aria-labelledby="napa-lhr-areas"
      >
        <div className="mx-auto max-w-[1120px] px-6 md:px-8">
          <div className="mb-12 max-w-[810px]">
            <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-text">
              Area-specific planning
            </p>
            <h2
              id="napa-lhr-areas"
              className="mb-5 text-3xl font-medium tracking-[-0.04em] text-rose-text md:text-5xl"
            >
              A plan built around the area you want to treat.
            </h2>
            <p className="text-lg font-light leading-relaxed text-ink/70">
              Laser hair removal appointments are organized by treatment-area
              size. Start with a consultation and let the team help you choose
              the right path.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {areaOptions.map((option, index) => (
              <article
                key={option.title}
                className={`border p-7 md:p-8 ${
                  index === 0
                    ? "border-rose bg-rose text-white"
                    : "border-ink/12 bg-white"
                }`}
              >
                <span
                  className={`mb-8 block text-xs font-bold tracking-[0.18em] ${
                    index === 0 ? "text-white" : "text-rose-text"
                  }`}
                >
                  0{index + 1}
                </span>
                <h3 className="mb-4 text-2xl font-medium tracking-[-0.025em]">
                  {option.title}
                </h3>
                <p
                  className={`text-sm leading-7 ${
                    index === 0 ? "text-white" : "text-ink/70"
                  }`}
                >
                  {option.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="rella-site-reveal bg-rose py-20 text-white md:py-28"
        aria-labelledby="napa-lhr-plan"
      >
        <div className="mx-auto max-w-[1120px] px-6 md:px-8">
          <div className="mb-12 max-w-[780px]">
            <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-white">
              Your consultation
            </p>
            <h2
              id="napa-lhr-plan"
              className="mb-5 text-3xl font-medium tracking-[-0.04em] md:text-5xl"
            >
              Four details shape the next step.
            </h2>
            <p className="text-lg font-light leading-relaxed text-white">
              Every plan is personal. Bring the details below so your provider
              can make the consultation useful from the start.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {planningFactors.map((factor, index) => (
              <article
                key={factor.title}
                className="border border-white/15 bg-white/[0.04] p-6"
              >
                <span className="mb-8 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-xs font-bold text-rose-text">
                  {index + 1}
                </span>
                <h3 className="mb-3 text-xl font-medium">{factor.title}</h3>
                <p className="text-sm leading-7 text-white">{factor.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="rella-site-reveal py-20 md:py-28"
        aria-labelledby="napa-lhr-booking"
      >
        <div className="mx-auto max-w-[1080px] px-6 md:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-text">
                One clear next step
              </p>
              <h2
                id="napa-lhr-booking"
                className="mb-5 text-3xl font-medium tracking-[-0.04em] text-rose-text md:text-5xl"
              >
                Your first visit, made simple.
              </h2>
              <p className="mb-7 text-lg font-light leading-relaxed text-ink/70">
                Choose a time for the complimentary Initial Laser Consult. The
                Rella Napa team will take it from there.
              </p>
            </div>
            <div className="border-l-4 border-rose bg-rose-blush p-7 md:p-9">
              <p className="mb-3 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-rose-text">
                What happens next
              </p>
              <ol className="mb-7 space-y-4 text-silver-dark">
                <li>
                  <strong className="text-rose-text">1. Pick a time.</strong>{" "}
                  Book your complimentary 30-minute consultation.
                </li>
                <li>
                  <strong className="text-rose-text">2. Meet the team.</strong>{" "}
                  Discuss the area, suitability, timing, and preparation.
                </li>
                <li>
                  <strong className="text-rose-text">
                    3. Choose your plan.
                  </strong>{" "}
                  Review the recommended next step and pricing before treatment.
                </li>
              </ol>
              <Button
                disableHover
                href={BOOKING_HREF}
                data-cta="service-booking"
                className="rounded-full"
              >
                Book Your Laser Consult
              </Button>
              <Link
                href="/services/laser-treatments"
                className="mt-6 block text-sm font-semibold text-rose-text underline decoration-rose-light underline-offset-4 hover:text-rose-text"
              >
                Read the full laser-treatment guide
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section
        className="rella-site-reveal bg-rose-blush py-20 md:py-24"
        aria-labelledby="visit-rella-napa-lhr"
      >
        <div className="mx-auto grid max-w-[1040px] gap-8 px-6 md:grid-cols-[1fr_auto] md:items-center md:px-8">
          <div>
            <p className="mb-3 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-text">
              Visit Rella Napa
            </p>
            <h2
              id="visit-rella-napa-lhr"
              className="mb-3 text-3xl font-medium tracking-[-0.035em] text-rose-text"
            >
              1541 3rd St - Napa, CA 94559
            </h2>
            <p className="text-ink/70">
              Wednesday-Saturday: 9am-5pm
            </p>
          </div>
          <Button
            href={clinic.mapUrl}
            variant="ghost"
            disableHover
            className="rounded-full bg-white"
          >
            Get Directions
          </Button>
        </div>
      </section>

      <section
        className="rella-site-reveal py-20 md:py-28"
        aria-labelledby="napa-lhr-faq"
      >
        <div className="mx-auto max-w-[900px] px-6 md:px-8">
          <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-text">
            Questions, answered
          </p>
          <h2
            id="napa-lhr-faq"
            className="mb-8 text-3xl font-medium tracking-[-0.035em] text-rose-text md:text-5xl"
          >
            Napa laser hair removal FAQ
          </h2>
          <FaqAccordion items={faqs} />
        </div>
      </section>

      <section
        className="bg-rose py-20 text-center text-white"
        aria-labelledby="napa-lhr-next-step"
      >
        <div className="mx-auto max-w-[740px] px-6">
          <h2
            id="napa-lhr-next-step"
            className="mb-4 text-3xl font-medium tracking-[-0.035em] md:text-5xl"
          >
            Start with the consult, not a guess.
          </h2>
          <p className="mb-8 text-lg font-light leading-relaxed text-white">
            Choose a consultation time online or call Rella Napa to get started.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              disableHover
              href={BOOKING_HREF}
              data-cta="service-booking"
              className="rounded-full bg-white !text-rose-text"
            >
              Start With a Laser Consult
            </Button>
            <Button
              disableHover
              href="tel:+17073582928"
              data-cta="phone"
              variant="ghost"
              className="!border-white !bg-white !text-rose-text"
            >
              Call Rella
            </Button>
          </div>
          <p className="mt-6 text-xs leading-6 text-white">
            Individual response varies. Suitability, device selection, settings,
            treatment area, preparation, and timing require an individualized
            assessment.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-white">
            <Link
              href="/cancellation-policy"
              className="underline underline-offset-4 hover:text-white"
            >
              Cancellation policy
            </Link>
            <Link
              href="/locations/napa"
              className="underline underline-offset-4 hover:text-white"
            >
              Napa clinic details
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
