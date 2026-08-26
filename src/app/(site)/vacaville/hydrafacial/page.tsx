import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FaqAccordion, FaqSchema } from "@/components/blocks/FaqAccordion";
import { TrustStrip } from "@/components/blocks/TrustStrip";
import { Button } from "@/components/ui/Button";
import { resolveBookingHref } from "@/lib/booking-routes";
import { locations } from "@/lib/data";
import { localBusinessSchema } from "@/lib/schemas";

const CANONICAL = "https://experiencerella.com/vacaville/hydrafacial";
const BOOKING_HREF = resolveBookingHref({
  location: "vacaville",
  service: "hydrafacial",
});
const clinic = locations.vacaville;

export const metadata: Metadata = {
  title: "HydraFacial in Vacaville | Pricing & Booking",
  description:
    "Compare Signature, Deluxe, and Platinum HydraFacial pricing at Rella Aesthetics in downtown Vacaville, then book the live Signature service directly.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "HydraFacial in Vacaville | Rella Aesthetics",
    description:
      "Three current tiers, treatment-planning context, and direct Signature HydraFacial booking in downtown Vacaville.",
    url: CANONICAL,
    type: "website",
    images: [
      {
        url: "/images/service-hydrafacial.jpg",
        alt: "HydraFacial treatment at Rella Aesthetics in Vacaville",
      },
    ],
  },
};

const faqs = [
  {
    question: "How much is a HydraFacial at Rella Vacaville?",
    answer:
      "Signature HydraFacial is $240, Deluxe is $300, and Platinum is $390 under Rella's current approved public pricing canon.",
  },
  {
    question: "How long does a HydraFacial appointment take?",
    answer:
      "Signature and Deluxe are listed as 45-minute services. Platinum is listed as a 75-minute service. Live scheduling details are shown before booking confirmation.",
  },
  {
    question: "Which HydraFacial tier should I choose?",
    answer:
      "Signature is the starting tier preselected by this page. The Vacaville team can explain the current menu and help you decide whether Signature, Deluxe, or Platinum better fits your skin goals, sensitivities, recent treatments, and schedule.",
  },
  {
    question: "Is there downtime after a HydraFacial?",
    answer:
      "Many people plan HydraFacial as a lower-downtime treatment, but temporary flushing, sensitivity, or another individual skin response can occur. Discuss recent treatments and important dates before choosing timing.",
  },
  {
    question: "Can I book a HydraFacial before an event?",
    answer:
      "Tell the team the event date, current skin condition, sensitivities, and any recent procedures before booking. They can help you choose timing without promising a particular skin response.",
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
  name: "HydraFacial in Vacaville",
  serviceType: "HydraFacial skin treatment",
  description: metadata.description,
  url: CANONICAL,
  image: "https://experiencerella.com/images/service-hydrafacial.jpg",
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

const tiers = [
  {
    price: "$240",
    name: "Signature",
    timing: "45 minutes",
    body: "The current starting tier and the exact service preselected by this page's booking button.",
  },
  {
    price: "$300",
    name: "Deluxe",
    timing: "45 minutes",
    body: "The upgraded tier listed at the current approved public amount, with live details confirmed during booking.",
  },
  {
    price: "$390",
    name: "Platinum",
    timing: "75 minutes",
    body: "The longest current tier, with the exact service details reviewed before confirmation.",
  },
] as const;

const visitSteps = [
  {
    title: "Review",
    body: "Share current skin concerns, sensitivities, recent treatments, home-care products, and important dates.",
  },
  {
    title: "Choose",
    body: "Confirm the appropriate tier and any suitable customization before the device treatment begins.",
  },
  {
    title: "Treat",
    body: "The multi-step device protocol cleanses, exfoliates, extracts, and hydrates according to the selected tier.",
  },
  {
    title: "Plan",
    body: "Finish with aftercare and product guidance appropriate to your skin and treatment response.",
  },
] as const;

export default function VacavilleHydraFacialPage() {
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
            <p className="mb-5 text-[0.6875rem] font-bold uppercase tracking-[0.22em] text-rose">
              Skin health · Downtown Vacaville
            </p>
            <h1 className="mb-6 text-[clamp(2.75rem,6vw,4.9rem)] font-medium leading-[0.98] tracking-[-0.06em] text-rose">
              HydraFacial in Vacaville.
            </h1>
            <p className="mb-8 max-w-[650px] text-lg font-light leading-relaxed text-silver-dark md:text-xl">
              Cleanse, exfoliate, extract, and hydrate—with three current tiers, clear pricing, and Signature preselected when you book.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button disableHover href={BOOKING_HREF} data-cta="service-booking" className="rounded-full">
                Book Signature HydraFacial
              </Button>
              <Button disableHover href="tel:+17073582928" data-cta="phone" variant="ghost" className="rounded-full bg-white/75">
                Call 707.358.2928
              </Button>
            </div>
            <p className="mt-5 text-xs leading-6 text-ink/70">
              This button opens the live Vacaville Signature HydraFacial screen with Select a professional as the next step.
            </p>
          </div>

          <div className="relative aspect-square self-center overflow-hidden bg-rose-blush sm:aspect-[4/3]">
            <Image
              src="/images/service-hydrafacial.jpg"
              alt="A handheld facial-treatment device applied near a patient's cheek"
              fill
              preload
              className="object-cover object-center"
              sizes="(min-width: 1024px) 46vw, 92vw"
            />
            <div className="absolute inset-x-0 bottom-0 border-t border-white/30 bg-white/94 p-5 md:p-6">
              <p className="mb-2 text-[0.625rem] font-bold uppercase tracking-[0.2em] text-rose">
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
        ariaLabel="Rella Vacaville HydraFacial visit facts"
        items={["Skin goals first", "Three current tiers", "Direct Signature booking", "Downtown Vacaville"]}
      />

      <section className="py-20 md:py-28" aria-labelledby="vacaville-hydrafacial-pricing">
        <div className="mx-auto max-w-[1120px] px-6 md:px-8">
          <div className="mb-12 max-w-[780px]">
            <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose">
              Current public pricing
            </p>
            <h2 id="vacaville-hydrafacial-pricing" className="mb-5 text-3xl font-medium tracking-[-0.04em] text-rose md:text-5xl">
              Three tiers. One clear starting point.
            </h2>
            <p className="text-lg font-light leading-relaxed text-ink/70">
              Signature is preselected for direct booking. Ask the Vacaville team whether another listed tier better fits your skin goals and schedule.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {tiers.map((tier, index) => (
              <article
                key={tier.name}
                className={`border p-7 ${index === 0 ? "border-rose bg-rose-blush" : "border-ink/12 bg-white"}`}
              >
                <p className="mb-3 text-4xl font-medium tracking-[-0.045em] text-ink">{tier.price}</p>
                <h3 className="mb-2 text-xl font-medium text-rose">{tier.name}</h3>
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-rose">{tier.timing}</p>
                <p className="text-sm leading-7 text-ink/70">{tier.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-rose py-20 text-white md:py-28" aria-labelledby="vacaville-hydrafacial-visit">
        <div className="mx-auto max-w-[1120px] px-6 md:px-8">
          <div className="mb-12 max-w-[760px]">
            <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-white">Your visit</p>
            <h2 id="vacaville-hydrafacial-visit" className="mb-5 text-3xl font-medium tracking-[-0.04em] md:text-5xl">
              Review, choose, treat, then plan.
            </h2>
            <p className="text-lg font-light leading-relaxed text-white/70">
              The device sequence is only part of the visit. Current skin condition, recent procedures, sensitivities, and timing still need context.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {visitSteps.map((step, index) => (
              <article key={step.title} className="border border-white/15 bg-white/[0.04] p-6">
                <span className="mb-8 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-xs font-bold text-rose">{index + 1}</span>
                <h3 className="mb-3 text-xl font-medium">{step.title}</h3>
                <p className="text-sm leading-7 text-white/70">{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28" aria-labelledby="vacaville-hydrafacial-booking">
        <div className="mx-auto grid max-w-[1040px] gap-8 px-6 md:px-8 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose">A direct first step</p>
            <h2 id="vacaville-hydrafacial-booking" className="mb-5 text-3xl font-medium tracking-[-0.04em] text-rose md:text-5xl">
              Book Signature without searching the menu.
            </h2>
            <p className="text-lg font-light leading-relaxed text-ink/70">
              Rella&apos;s live Vacaville menu currently lists Signature, Deluxe, and Platinum HydraFacial services. This page opens Signature directly while keeping the other tiers visible for comparison.
            </p>
          </div>
          <div className="border-l-4 border-rose bg-rose-blush p-7 md:p-10">
            <p className="mb-3 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-rose">Live Rella booking handoff</p>
            <p className="mb-6 text-lg leading-8 text-silver-dark">
              The Signature screen shows the current treatment description, available add-ons, professional selection, timing, and booking terms before confirmation.
            </p>
            <Button disableHover href={BOOKING_HREF} data-cta="service-booking" className="rounded-full">
              Book Signature HydraFacial
            </Button>
            <Link href="/services/hydrafacial" className="mt-6 block text-sm font-semibold text-rose-text underline decoration-rose-light underline-offset-4 hover:text-rose">
              Read the full HydraFacial guide →
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-rose-blush py-20 md:py-24" aria-labelledby="vacaville-hydrafacial-membership">
        <div className="mx-auto grid max-w-[1000px] gap-8 px-6 md:grid-cols-[1fr_auto] md:items-center md:px-8">
          <div>
            <p className="mb-3 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose">Membership context</p>
            <h2 id="vacaville-hydrafacial-membership" className="mb-3 text-3xl font-medium tracking-[-0.035em] text-rose">
              Compare the included HydraFacial terms before enrolling.
            </h2>
            <p className="max-w-[700px] text-ink/70">
              Current injectable memberships include a specified HydraFacial tier after six months of on-time payments, or immediately when the full year is prepaid. Review the complete one-year terms first.
            </p>
          </div>
          <Button href="/membership" variant="ghost" disableHover className="rounded-full bg-white">Compare Memberships</Button>
        </div>
      </section>

      <section className="py-20 md:py-28" aria-labelledby="vacaville-hydrafacial-faq">
        <div className="mx-auto max-w-[900px] px-6 md:px-8">
          <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose">Questions, answered</p>
          <h2 id="vacaville-hydrafacial-faq" className="mb-8 text-3xl font-medium tracking-[-0.035em] text-rose md:text-5xl">
            Vacaville HydraFacial FAQ
          </h2>
          <FaqAccordion items={faqs} />
        </div>
      </section>

      <section className="bg-rose py-20 text-center text-white" aria-labelledby="vacaville-hydrafacial-next-step">
        <div className="mx-auto max-w-[720px] px-6">
          <h2 id="vacaville-hydrafacial-next-step" className="mb-4 text-3xl font-medium tracking-[-0.035em] md:text-5xl">
            Start with Signature in Vacaville.
          </h2>
          <p className="mb-8 text-lg font-light leading-relaxed text-white/90">
            Open the live Signature service, review the professional and booking terms, or call Rella if you want help comparing tiers.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button disableHover href={BOOKING_HREF} data-cta="service-booking" className="rounded-full bg-white !text-rose">
              Book Signature HydraFacial
            </Button>
            <Button disableHover href="tel:+17073582928" data-cta="phone" variant="ghost">
              Call Rella
            </Button>
          </div>
          <p className="mt-6 text-xs leading-6 text-white/80">
            Individual results and skin response vary. Service tier, customization, and suitability should be reviewed with the treating provider, particularly after recent procedures or with active skin concerns.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-white/80">
            <Link href="/cancellation-policy" className="underline underline-offset-4 hover:text-ink">Cancellation policy</Link>
            <Link href="/locations/vacaville" className="underline underline-offset-4 hover:text-ink">Vacaville clinic details</Link>
          </div>
        </div>
      </section>
    </>
  );
}
