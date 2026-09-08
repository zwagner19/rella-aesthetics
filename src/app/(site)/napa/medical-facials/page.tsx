import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FaqAccordion, FaqSchema } from "@/components/blocks/FaqAccordion";
import { TrustStrip } from "@/components/blocks/TrustStrip";
import { Button } from "@/components/ui/Button";
import { resolveBookingHref } from "@/lib/booking-routes";
import { locations } from "@/lib/data";
import { localBusinessSchema } from "@/lib/schemas";

const CANONICAL = "https://experiencerella.com/napa/medical-facials";
const BOOKING_HREF = resolveBookingHref({
  location: "napa",
  service: "medical-facials",
});
const clinic = locations.napa;

export const metadata: Metadata = {
  title: "Medical Facials & HydraFacial in Napa | Rella",
  description:
    "Compare Rella Napa's complimentary skin consultation, Signature HydraFacial, and Deluxe HydraFacial before choosing an appointment.",
  alternates: { canonical: CANONICAL },
  robots: { index: false, follow: false },
  openGraph: {
    title: "Facials & HydraFacial in Napa | Rella Aesthetics",
    description:
      "Three current Napa skin-care booking choices, explained before you select an appointment.",
    url: CANONICAL,
    type: "website",
    images: [
      {
        url: "/images/treatments/hydrafacial.webp",
        alt: "A Rella provider performing an in-clinic facial treatment",
      },
    ],
  },
};

const facialOptions = [
  {
    name: "Initial Skin Health Consult",
    duration: "15 min.",
    body: "A complimentary starting point to review your skin, sensitivities, recent procedures, current products, and goals before choosing a facial or skin-health treatment.",
  },
  {
    name: "Signature HydraFacial",
    duration: "45 min.",
    body: "The current Signature appointment is described as a deep-cleanse, exfoliate, and hydrate treatment. Review the exact steps and preparation before booking.",
  },
  {
    name: "Deluxe HydraFacial",
    duration: "45 min.",
    body: "A separate Deluxe HydraFacial visit with Rella's esthetics team. Compare its current details with Signature before selecting a date.",
  },
] as const;

const visitSteps = [
  {
    title: "Share",
    body: "Tell the team about current concerns, sensitivities, products, medications, recent procedures, and important dates.",
  },
  {
    title: "Compare",
    body: "Choose between the skin-health consult and the two HydraFacial appointments currently listed online for Napa.",
  },
  {
    title: "Confirm",
    body: "Review the exact service steps, any relevant preparation or temporary response, and the current total before proceeding.",
  },
  {
    title: "Continue",
    body: "Leave with service-specific aftercare and guidance on products, sun protection, and timing around other procedures.",
  },
] as const;

const faqs = [
  {
    question: "Which facial appointments can I book online at Rella Napa?",
    answer:
      "Rella's approved Napa booking site currently lists the complimentary Initial Skin Health Consult, Signature HydraFacial, and Deluxe HydraFacial. You choose the service and date in the secure booking flow.",
  },
  {
    question: "Should I choose a skin consult or a HydraFacial?",
    answer:
      "The Initial Skin Health Consult is the clearest starting point when you need help comparing services. Signature and Deluxe are separate 45-minute HydraFacial appointments. The right choice depends on your skin, sensitivities, products, recent procedures, goals, and schedule.",
  },
  {
    question: "How much is a HydraFacial at Rella Napa?",
    answer:
      "Review the current service total in Rella's booking or consultation flow before you commit. This preview does not repeat legacy promotions or publish a price that has not been re-confirmed for the exact service.",
  },
  {
    question: "How is HydraFacial different from another facial?",
    answer:
      "HydraFacial is a branded multi-step service. Other facials can use different products, devices, and manual techniques. The Napa booking site currently exposes Signature and Deluxe HydraFacial plus the Initial Skin Health Consult; ask the team to compare the exact options.",
  },
  {
    question: "Can I book a facial before an event?",
    answer:
      "Discuss your date, recent procedures, active products, and individual skin response before choosing timing. This page does not promise same-week availability or zero downtime.",
  },
  {
    question: "Can a cosmetic facial replace medical care for a skin problem?",
    answer:
      "No. A cosmetic facial is not a substitute for medical diagnosis or treatment. Seek appropriate medical care for a severe, persistent, painful, changing, infected, or otherwise concerning skin problem.",
  },
] as const;

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${CANONICAL}#service`,
  name: "Facials and HydraFacial in Napa",
  serviceType: "Cosmetic facial consultation and HydraFacial services",
  description: metadata.description,
  url: CANONICAL,
  image: "https://experiencerella.com/images/treatments/hydrafacial.webp",
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

export default function NapaMedicalFacialsPreviewPage() {
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
              Facials &amp; HydraFacial - Downtown Napa
            </p>
            <h1 className="mb-6 text-[clamp(2.75rem,6vw,4.9rem)] font-medium leading-[0.98] tracking-[-0.06em] text-rose-text">
              Start with your skin. Then choose the facial.
            </h1>
            <p className="mb-8 max-w-[650px] text-lg font-light leading-relaxed text-silver-dark md:text-xl">
              Compare Rella Napa&apos;s complimentary skin consultation,
              Signature HydraFacial, and Deluxe HydraFacial before choosing an
              appointment.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                disableHover
                href={BOOKING_HREF}
                data-cta="service-booking"
                className="rounded-full"
              >
                Browse Napa Facial Booking
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
              Opens Rella Napa&apos;s live facial category. You choose the exact
              service and date in the secure booking flow.
            </p>
          </div>

          <div className="relative aspect-[4/5] max-h-[720px] self-center overflow-hidden bg-rose-blush">
            <Image
              src="/images/treatments/hydrafacial.webp"
              alt="A Rella provider performing an in-clinic facial treatment"
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
                1541 3rd St - Monday-Friday, 9am-5pm - Saturday, 9am-1pm
              </p>
            </div>
          </div>
        </div>
      </section>

      <TrustStrip
        ariaLabel="Rella Napa facial visit facts"
        items={[
          "Three current online choices",
          "15-minute skin consult",
          "Two 45-minute HydraFacials",
          "Downtown Napa",
        ]}
      />

      <section
        className="rella-site-reveal py-20 md:py-28"
        aria-labelledby="napa-medical-facial-options"
      >
        <div className="mx-auto max-w-[1120px] px-6 md:px-8">
          <div className="mb-12 max-w-[810px]">
            <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-text">
              Current Napa booking menu
            </p>
            <h2
              id="napa-medical-facial-options"
              className="mb-5 text-3xl font-medium tracking-[-0.04em] text-rose-text md:text-5xl"
            >
              Three choices, without an invented offer.
            </h2>
            <p className="text-lg font-light leading-relaxed text-ink/70">
              These are the three facial appointments currently exposed on
              Rella&apos;s approved Napa booking site. Review the live details and
              current total before confirming.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {facialOptions.map((option, index) => (
              <article
                key={option.name}
                className={`border p-7 md:p-8 ${
                  index === 0
                    ? "border-rose bg-rose text-white"
                    : "border-ink/12 bg-white"
                }`}
              >
                <div className="mb-8 flex items-center justify-between gap-4">
                  <span
                    className={`text-xs font-bold tracking-[0.18em] ${
                      index === 0 ? "text-white" : "text-rose-text"
                    }`}
                  >
                    0{index + 1}
                  </span>
                  <span
                    className={`text-xs font-bold uppercase tracking-[0.14em] ${
                      index === 0 ? "text-white" : "text-ink/55"
                    }`}
                  >
                    {option.duration}
                  </span>
                </div>
                <h3 className="mb-4 text-2xl font-medium tracking-[-0.025em]">
                  {option.name}
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
        aria-labelledby="napa-medical-facial-visit"
      >
        <div className="mx-auto max-w-[1120px] px-6 md:px-8">
          <div className="mb-12 max-w-[780px]">
            <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-white">
              Your visit
            </p>
            <h2
              id="napa-medical-facial-visit"
              className="mb-5 text-3xl font-medium tracking-[-0.04em] md:text-5xl"
            >
              A polished experience built on specifics.
            </h2>
            <p className="text-lg font-light leading-relaxed text-white">
              Facial protocols vary. A useful plan accounts for what is
              happening with your skin today and what else has been used or
              scheduled around it.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {visitSteps.map((step, index) => (
              <article
                key={step.title}
                className="border border-white/15 bg-white/[0.04] p-6"
              >
                <span className="mb-8 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-xs font-bold text-rose-text">
                  {index + 1}
                </span>
                <h3 className="mb-3 text-xl font-medium">{step.title}</h3>
                <p className="text-sm leading-7 text-white">{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="rella-site-reveal py-20 md:py-28"
        aria-labelledby="napa-medical-facial-booking"
      >
        <div className="mx-auto grid max-w-[1080px] gap-10 px-6 md:px-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
          <div className="relative aspect-[4/5] overflow-hidden bg-rose-blush">
            <Image
              src="/images/treatments/facial.webp"
              alt="A patient receiving in-clinic facial light therapy at Rella"
              fill
              className="object-cover object-center"
              sizes="(min-width: 1024px) 38vw, 92vw"
            />
          </div>
          <div>
            <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-text">
              A clear booking chooser
            </p>
            <h2
              id="napa-medical-facial-booking"
              className="mb-5 text-3xl font-medium tracking-[-0.04em] text-rose-text md:text-5xl"
            >
              Choose the service in Rella&apos;s booking flow.
            </h2>
            <p className="mb-7 text-lg font-light leading-relaxed text-ink/70">
              The verified booking path opens Napa&apos;s facial category with the
              clinic selected. You choose the service and date; this page does
              not preselect an appointment for you.
            </p>
            <div className="border-l-4 border-rose bg-rose-blush p-7 md:p-9">
              <p className="mb-3 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-rose-text">
                Clear before treatment
              </p>
              <p className="mb-6 leading-7 text-silver-dark">
                Review the exact service, included steps, relevant preparation
                or aftercare, and current total before proceeding.
              </p>
              <Button
                disableHover
                href={BOOKING_HREF}
                data-cta="service-booking"
                className="rounded-full"
              >
                Browse Napa Facial Booking
              </Button>
              <Link
                href="/services/hydrafacial"
                className="mt-6 block text-sm font-semibold text-rose-text underline decoration-rose-light underline-offset-4 hover:text-rose-text"
              >
                Read the full HydraFacial guide
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section
        className="rella-site-reveal bg-rose-blush py-20 md:py-24"
        aria-labelledby="napa-medical-facial-compare"
      >
        <div className="mx-auto grid max-w-[1040px] gap-8 px-6 md:grid-cols-[1fr_auto] md:items-center md:px-8">
          <div>
            <p className="mb-3 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-text">
              Comparing skin-care paths?
            </p>
            <h2
              id="napa-medical-facial-compare"
              className="mb-3 text-3xl font-medium tracking-[-0.035em] text-rose-text"
            >
              A facial, HydraFacial, and laser procedure are not interchangeable.
            </h2>
            <p className="max-w-[760px] text-ink/70">
              Products, devices, intensity, candidacy, and recovery differ. Ask
              the team to compare timing before combining or sequencing
              services.
            </p>
          </div>
          <Button
            href="/services/facials"
            variant="ghost"
            disableHover
            className="rounded-full bg-white"
          >
            Explore Facial Care
          </Button>
        </div>
      </section>

      <section
        className="rella-site-reveal py-20 md:py-28"
        aria-labelledby="napa-medical-facial-faq"
      >
        <div className="mx-auto max-w-[900px] px-6 md:px-8">
          <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-text">
            Questions, answered
          </p>
          <h2
            id="napa-medical-facial-faq"
            className="mb-8 text-3xl font-medium tracking-[-0.035em] text-rose-text md:text-5xl"
          >
            Napa facial FAQ
          </h2>
          <FaqAccordion items={faqs} />
        </div>
      </section>

      <section
        className="bg-rose py-20 text-center text-white"
        aria-labelledby="napa-medical-facial-next-step"
      >
        <div className="mx-auto max-w-[740px] px-6">
          <h2
            id="napa-medical-facial-next-step"
            className="mb-4 text-3xl font-medium tracking-[-0.035em] md:text-5xl"
          >
            Put your skin, not a trend, at the center.
          </h2>
          <p className="mb-8 text-lg font-light leading-relaxed text-white">
            Browse the verified Napa choices or call Rella before selecting a
            service.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              disableHover
              href={BOOKING_HREF}
              data-cta="service-booking"
              className="rounded-full bg-white !text-rose-text"
            >
              Browse Napa Facial Booking
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
            Individual response varies. Suitability, products, treatment steps,
            temporary effects, preparation, and aftercare depend on the exact
            service and your skin.
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
