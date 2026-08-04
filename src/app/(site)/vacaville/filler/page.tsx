import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { FaqAccordion, FaqSchema } from "@/components/blocks/FaqAccordion";
import { TrustStrip } from "@/components/blocks/TrustStrip";
import { resolveBookingHref } from "@/lib/booking-routes";
import { locations } from "@/lib/data";
import { localBusinessSchema } from "@/lib/schemas";

const CANONICAL = "https://experiencerella.com/vacaville/filler";
const BOOKING_HREF = resolveBookingHref({
  location: "vacaville",
  service: "dermal-fillers",
});
const clinic = locations.vacaville;

export const metadata: Metadata = {
  title: "Lip & Dermal Filler in Vacaville | Pricing Guide",
  description:
    "Explore current dermal filler pricing, product and treatment-plan factors, and Vacaville-specific booking at Rella Aesthetics, 542 Main St.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Lip & Dermal Filler in Vacaville | Rella Aesthetics",
    description:
      "Current filler pricing, consultation-led planning, and Vacaville-specific booking at Rella Aesthetics.",
    url: CANONICAL,
    type: "website",
    images: [
      {
        url: "/images/service-fillers.jpg",
        alt: "Dermal filler consultation at Rella Aesthetics in Vacaville",
      },
    ],
  },
};

const faqs = [
  {
    question: "How much does filler cost at Rella Vacaville?",
    answer:
      "The current dermal-filler base service amount is $840. Active filler products range from $540 to $960. The selected product, amount, and treatment plan determine the expected total, which your provider reviews before treatment.",
  },
  {
    question: "How much filler will I need?",
    answer:
      "That depends on your anatomy, goals, treatment area, prior treatment, and the product selected. An in-person assessment is needed before a responsible amount can be recommended.",
  },
  {
    question: "Which areas can be assessed for filler?",
    answer:
      "Rella offers hyaluronic-acid filler options that may be considered for areas such as lips, cheeks, and facial folds. The appropriate area and product depend on your anatomy and plan.",
  },
  {
    question: "Is there downtime after filler?",
    answer:
      "Temporary swelling, tenderness, or bruising can occur. Tell the team about work, travel, dental plans, and important events so timing and aftercare can be reviewed before treatment.",
  },
  {
    question: "Where is Rella Aesthetics in Vacaville?",
    answer:
      "Rella Aesthetics is at 542 Main St in downtown Vacaville, CA 95688. Current published clinic hours are Wednesday through Saturday, 9am–5pm.",
  },
  {
    question: "What happens when I select the booking button?",
    answer:
      "The button opens Rella Vacaville's live Dermal Fillers service and displays Select a professional. Review the treatment areas, current total, add-ons, and booking terms before confirming.",
  },
] as const;

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${CANONICAL}#service`,
  name: "Lip and Dermal Filler in Vacaville",
  serviceType: "Dermal filler consultation and treatment",
  description: metadata.description,
  url: CANONICAL,
  image: "https://experiencerella.com/images/service-fillers.jpg",
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

const planFactors = [
  {
    title: "Area",
    body: "Lips, cheeks, and facial folds have different anatomical and product considerations.",
  },
  {
    title: "Product",
    body: "Available products span the current $540–$960 range and are not interchangeable line items.",
  },
  {
    title: "Amount",
    body: "A responsible amount follows an in-person assessment rather than a preset package promise.",
  },
  {
    title: "Timing",
    body: "Swelling, bruising, travel, dental work, and events belong in the scheduling conversation.",
  },
] as const;

export default function VacavilleFillerPage() {
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
              Injectables · Downtown Vacaville
            </p>
            <h1 className="mb-6 text-[clamp(2.75rem,6vw,4.9rem)] font-medium leading-[0.98] tracking-[-0.06em] text-ink">
              Lip &amp; dermal filler in Vacaville.
            </h1>
            <p className="mb-8 max-w-[650px] text-lg font-light leading-relaxed text-silver-dark md:text-xl">
              Consultation-led planning for proportion, product, amount, and timing—with the expected total reviewed before treatment.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button href={BOOKING_HREF} data-cta="service-booking" className="rounded-full">
                Book Dermal Fillers
              </Button>
              <Button href="tel:+17073582928" data-cta="phone" variant="ghost" className="rounded-full bg-white/75">
                Call 707.358.2928
              </Button>
            </div>
            <p className="mt-5 text-xs leading-6 text-silver">
              Opens Rella Vacaville&apos;s live Dermal Fillers service with Select a professional as the next step.
            </p>
          </div>

          <div className="relative min-h-[390px] overflow-hidden rounded-[2rem] shadow-[0_24px_80px_rgba(90,94,98,0.18)] md:min-h-[520px]">
            <Image
              src="/images/service-fillers.jpg"
              alt="Dermal filler consultation at Rella Aesthetics in Vacaville"
              fill
              priority
              className="object-cover"
              sizes="(min-width: 1024px) 46vw, 92vw"
            />
            <div className="absolute inset-x-4 bottom-4 rounded-[1.35rem] bg-white/94 p-5 shadow-lg backdrop-blur md:inset-x-6 md:bottom-6 md:p-6">
              <p className="mb-2 text-[0.625rem] font-bold uppercase tracking-[0.2em] text-rose-dark">Rella Aesthetics — Vacaville</p>
              <p className="text-lg font-medium leading-snug text-ink">542 Main St · Wednesday–Saturday, 9am–5pm</p>
            </div>
          </div>
        </div>
      </section>

      <TrustStrip
        ariaLabel="Rella Vacaville filler visit facts"
        items={["Physician-owned", "Current public pricing", "Downtown Vacaville", "Plan before treatment"]}
      />

      <section className="py-20 md:py-28" aria-labelledby="vacaville-filler-pricing">
        <div className="mx-auto max-w-[1120px] px-6 md:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-dark">Current pricing</p>
              <h2 id="vacaville-filler-pricing" className="mb-5 text-3xl font-medium tracking-[-0.04em] text-ink md:text-5xl">
                A range, then a specific plan.
              </h2>
              <p className="text-lg font-light leading-relaxed text-silver">
                The price follows the product and amount selected for your anatomy and goals—not a one-size-fits-all syringe promise.
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <article className="rounded-[1.6rem] border border-silver-pale bg-white p-7 shadow-[0_14px_45px_rgba(90,94,98,0.07)]">
                <p className="mb-3 text-4xl font-medium tracking-[-0.045em] text-ink">$840</p>
                <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-rose-dark">Base service amount</h3>
                <p className="text-sm leading-7 text-silver">The current dermal-filler base amount in Rella&apos;s approved public pricing canon.</p>
              </article>
              <article className="rounded-[1.6rem] border border-rose-light bg-rose-blush p-7">
                <p className="mb-3 text-4xl font-medium tracking-[-0.045em] text-ink">$540–$960</p>
                <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-rose-dark">Active product range</h3>
                <p className="text-sm leading-7 text-silver">The selected active product and plan determine the expected treatment total.</p>
              </article>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-start justify-between gap-5 rounded-[1.5rem] border border-silver-pale bg-white p-7 md:flex-row md:items-center md:p-9">
            <p className="max-w-[700px] text-sm leading-7 text-silver-dark">
              The 2026 Filler Membership is $40/month with a one-year commitment and product-specific member rates. Compare the full plan before enrolling.
            </p>
            <Link href="/membership" className="shrink-0 text-sm font-semibold text-rose-text underline decoration-rose-light underline-offset-4 hover:text-rose-dark">
              Compare memberships →
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-ink py-20 text-white md:py-28" aria-labelledby="vacaville-filler-plan">
        <div className="mx-auto max-w-[1120px] px-6 md:px-8">
          <div className="mb-12 max-w-[760px]">
            <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose">Plan before product</p>
            <h2 id="vacaville-filler-plan" className="mb-5 text-3xl font-medium tracking-[-0.04em] md:text-5xl">
              Four variables shape the recommendation.
            </h2>
            <p className="text-lg font-light leading-relaxed text-white/70">
              Filler planning is not just choosing a syringe. The area, product, amount, and calendar all change the responsible recommendation.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {planFactors.map((factor, index) => (
              <article key={factor.title} className="rounded-[1.3rem] border border-white/15 bg-white/[0.04] p-6">
                <span className="mb-8 inline-flex h-9 w-9 items-center justify-center rounded-full bg-rose text-xs font-bold">{index + 1}</span>
                <h3 className="mb-3 text-xl font-medium">{factor.title}</h3>
                <p className="text-sm leading-7 text-white/70">{factor.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28" aria-labelledby="vacaville-filler-visit">
        <div className="mx-auto grid max-w-[1040px] gap-8 px-6 md:px-8 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-dark">Your visit</p>
            <h2 id="vacaville-filler-visit" className="mb-5 text-3xl font-medium tracking-[-0.04em] text-ink md:text-5xl">
              Assessment, options, total, then choice.
            </h2>
            <p className="text-lg font-light leading-relaxed text-silver">
              Review your goals, relevant history, prior filler, and the areas being considered. Your provider assesses facial anatomy, explains appropriate product options, and confirms the proposed amount and expected total before treatment.
            </p>
          </div>
          <div className="rounded-[1.75rem] bg-rose-blush p-7 md:p-10">
            <p className="mb-3 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-rose-dark">Plan around recovery</p>
            <p className="mb-6 text-lg leading-8 text-silver-dark">
              Temporary swelling, tenderness, or bruising can occur. Share upcoming work, travel, dental care, and important events before choosing a date.
            </p>
            <Link href="/services/dermal-fillers" className="text-sm font-semibold text-rose-text underline decoration-rose-light underline-offset-4 hover:text-rose-dark">
              Read the full dermal filler guide →
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-rose-blush py-20 md:py-24" aria-labelledby="visit-rella-vacaville-filler">
        <div className="mx-auto grid max-w-[1000px] gap-8 px-6 md:grid-cols-[1fr_auto] md:items-center md:px-8">
          <div>
            <p className="mb-3 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-dark">Visit Rella Vacaville</p>
            <h2 id="visit-rella-vacaville-filler" className="mb-3 text-3xl font-medium tracking-[-0.035em] text-ink">
              542 Main St · Vacaville, CA 95688
            </h2>
            <p className="text-silver">Wednesday–Saturday: 9am–5pm · Sunday–Tuesday: Closed</p>
          </div>
          <div className="flex flex-col gap-3">
            <Button href={BOOKING_HREF} data-cta="service-booking" className="rounded-full">Book Dermal Fillers</Button>
            <Button href={clinic.mapUrl} variant="ghost" className="rounded-full bg-white">Get Directions</Button>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28" aria-labelledby="vacaville-filler-faq">
        <div className="mx-auto max-w-[900px] px-6 md:px-8">
          <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-dark">Questions, answered</p>
          <h2 id="vacaville-filler-faq" className="mb-8 text-3xl font-medium tracking-[-0.035em] text-ink md:text-5xl">
            Vacaville filler FAQ
          </h2>
          <FaqAccordion items={faqs} />
        </div>
      </section>

      <section className="bg-rose py-20 text-center text-white" aria-labelledby="vacaville-filler-next-step">
        <div className="mx-auto max-w-[720px] px-6">
          <h2 id="vacaville-filler-next-step" className="mb-4 text-3xl font-medium tracking-[-0.035em] md:text-5xl">
            Start with the Vacaville plan.
          </h2>
          <p className="mb-8 text-lg font-light leading-relaxed text-white/85">
            Open the live Dermal Fillers service, review the current treatment areas and booking terms, or call Rella with a question.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button href={BOOKING_HREF} data-cta="service-booking" className="rounded-full bg-white !text-rose hover:bg-white/90 hover:!text-rose-dark">
              Book Dermal Fillers
            </Button>
            <Button href="tel:+17073582928" data-cta="phone" variant="ghost" className="rounded-full border-white/70 !text-white hover:border-white hover:!text-white">
              Call Rella
            </Button>
          </div>
          <p className="mt-6 text-xs leading-6 text-white/70">
            Individual results vary. Treatment eligibility, area, product, amount, and timing require an individualized assessment.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-white/75">
            <Link href="/cancellation-policy" className="underline underline-offset-4 hover:text-white">Cancellation policy</Link>
            <Link href="/locations/vacaville" className="underline underline-offset-4 hover:text-white">Vacaville clinic details</Link>
          </div>
        </div>
      </section>
    </>
  );
}
