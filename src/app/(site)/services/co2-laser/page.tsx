import { withWebsiteSeo } from "@/lib/website-seo";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FaqAccordion, FaqSchema } from "@/components/blocks/FaqAccordion";
import { TrustStrip } from "@/components/blocks/TrustStrip";
import { TreatmentResults } from "@/components/treatments/TreatmentResults";
import { Button } from "@/components/ui/Button";
import { approvedPatientResultImages } from "@/content/results";
import { resolveBookingHref, type BookingLocation } from "@/lib/booking-routes";
import { locations } from "@/lib/data";
import { LOCATION_ENTITY_IDS, localBusinessSchema } from "@/lib/schemas";

const PATH = "/services/co2-laser";
const CANONICAL = `https://experiencerella.com${PATH}`;
const HERO_IMAGE = "/images/treatments/laser-treatment.webp";

// Booking stays on the shared laser category, exactly like /vacaville/laser and
// /services/laser-treatments. No appointment is preselected from this page.
const bookingHrefFor = (location?: BookingLocation) =>
  resolveBookingHref({ location, service: "laser-treatments" });
const BOOKING_HREF = bookingHrefFor();

const defaultMetadata: Metadata = {
  title: "CO2 Laser & CoolPeel in Napa & Vacaville",
  description:
    "Compare CO2 CoolPeel and deeper CO2 resurfacing at Rella Aesthetics for texture, fine lines, acne scars, and sun damage, with recovery and sun planning in Napa and Vacaville.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "CO2 Laser & CoolPeel in Napa & Vacaville | Rella Aesthetics",
    description:
      "Consultation-led CO2 CoolPeel and CO2 resurfacing planning, with an honest look at recovery and sun care, at Rella's Napa and Vacaville clinics.",
    url: CANONICAL,
    type: "website",
    images: [
      {
        url: HERO_IMAGE,
        alt: "A Rella provider performing a device-based skin treatment",
      },
    ],
  },
};

const comparison = [
  {
    title: "CO2 CoolPeel",
    eyebrow: "Lighter CO2 pass",
    body: "CoolPeel uses a CO2 laser at more superficial settings. It is aimed at surface texture, tone, and fine lines, and is usually planned when you want CO2 resurfacing with a shorter, more predictable recovery window. Some plans use a short series rather than one visit.",
    points: [
      "Surface texture, tone, and fine lines",
      "Often planned as a series",
      "Redness and peeling are still expected",
    ],
  },
  {
    title: "Traditional CO2 resurfacing",
    eyebrow: "Deeper CO2 treatment",
    body: "Deeper CO2 resurfacing is discussed when texture or scarring needs more than a light-based option or a lighter CO2 pass. It generally asks for a longer, more involved recovery and more careful planning around work, travel, and events.",
    points: [
      "Deeper texture and scarring concerns",
      "Longer, more involved recovery",
      "Stricter pre- and post-care",
    ],
  },
] as const;

const concerns = [
  {
    id: "texture",
    title: "Uneven texture",
    body: "Rough or uneven-looking skin is one of the most common reasons people ask about CO2. The depth chosen depends on how much of the texture sits at the surface versus deeper in the skin.",
  },
  {
    id: "fine-lines",
    title: "Fine lines",
    body: "Fine lines from sun and time may be part of a resurfacing plan. Movement lines from muscle activity are a different concern and may be better discussed alongside injectables.",
  },
  {
    id: "sun-damage",
    title: "Sun damage",
    body: "Resurfacing can be considered for the texture and tone changes that come with sun exposure. When brown spots or redness are the main concern, a light-based option such as IPL may be discussed instead.",
  },
] as const;

const recovery = [
  {
    phase: "Treatment day",
    body: "Skin often feels warm, tight, and sunburned-like. You leave with written aftercare and the products your provider wants you to use.",
  },
  {
    phase: "The first few days",
    body: "Redness, swelling, and a rough or sandpaper-like feel are common. Keep the skin clean and moisturized as directed, skip active skin care, and stay out of the sun.",
  },
  {
    phase: "Later in the first week",
    body: "Flaking and peeling usually take over as the treated layer sheds. Let it come off on its own; picking can irritate the skin and slow healing.",
  },
  {
    phase: "The following weeks",
    body: "Pinkness can linger as the skin settles. Your provider tells you when makeup, active products, and the next session (if one is planned) fit back into your routine.",
  },
] as const;

const faqs = [
  {
    question: "What is the difference between CoolPeel and traditional CO2 resurfacing?",
    answer:
      "Both use a CO2 laser. CoolPeel works at more superficial settings for surface texture, tone, and fine lines, while deeper CO2 resurfacing is discussed for more significant texture or scarring and typically involves a longer recovery. Your provider recommends the depth after assessing your skin.",
  },
  {
    question: "Can CO2 laser treatment help acne scars?",
    answer:
      "Acne scars are one of the concerns Rella considers for CO2 resurfacing. Scar type, depth, skin type, and healing history shape the recommendation, and some scars respond better to a different or combined approach. Improvement varies and is not guaranteed.",
  },
  {
    question: "How much downtime should I expect?",
    answer:
      "Expect redness and peeling with either option. CoolPeel recovery is usually shorter than deeper CO2 resurfacing, but the exact timeline depends on the settings, the treatment area, and how your skin heals. Your provider reviews the expected recovery before you book.",
  },
  {
    question: "How much does CoolPeel cost at Rella?",
    answer:
      "CO2 CoolPeel Full Face is $1,440 under Rella's current approved public pricing. Other areas, deeper resurfacing, and series plans depend on the treatment plan, and the team reviews the total before treatment.",
  },
  {
    question: "When is the best time of year for CO2 laser?",
    answer:
      "Many people plan resurfacing for months when it is easier to avoid strong sun, but the real requirement is protecting treated skin before and after. Share upcoming travel, outdoor plans, and events so the provider can help you pick a responsible date.",
  },
  {
    question: "Do I need a consultation first?",
    answer:
      "Yes. Laser care at Rella starts with a consultation to review your skin type, history, medications, recent sun, and goals, and to confirm whether CO2 is appropriate before anything is scheduled.",
  },
  {
    question: "Is CO2 laser appropriate for every skin type?",
    answer:
      "Not always. Safety and suitability depend on your skin type, history of pigment changes or scarring, medications, and the settings being considered. A consultation is required to identify the appropriate option.",
  },
] as const;

const clinics = [
  {
    key: "vacaville" as const,
    label: "Rella Aesthetics — Vacaville",
    clinic: locations.vacaville,
    note: "Vacaville's live laser menu lists CoolPeel and resurfacing alongside the Initial Laser Consult.",
    detailHref: "/vacaville/laser",
    detailLabel: "Vacaville laser guide",
  },
  {
    key: "napa" as const,
    label: "Rella Aesthetics — Napa House",
    clinic: locations.napa,
    note: "Book a laser consultation at Napa House; the team confirms which CO2 option is scheduled there for your plan.",
    detailHref: "/locations/napa",
    detailLabel: "Napa House clinic details",
  },
] as const;

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${CANONICAL}#service`,
  name: "CO2 Laser Resurfacing and CoolPeel",
  serviceType: "CO2 laser skin resurfacing consultation and treatment",
  description: defaultMetadata.description,
  url: CANONICAL,
  image: `https://experiencerella.com${HERO_IMAGE}`,
  provider: {
    "@type": "Organization",
    "@id": "https://experiencerella.com/#organization",
    name: "Rella Aesthetics",
    telephone: "+17073582928",
    department: [
      { "@id": LOCATION_ENTITY_IDS.vacaville },
      { "@id": LOCATION_ENTITY_IDS.napa },
    ],
  },
  areaServed: [locations.napa, locations.vacaville].map((clinic) => ({
    "@type": "City",
    name: clinic.city,
    containedInPlace: { "@type": "State", name: "California" },
  })),
};

function coolPeelResults() {
  return approvedPatientResultImages("main-gallery").filter((result) =>
    /coolpeel/i.test(result.treatment),
  );
}

export default function Co2LaserPage() {
  const results = coolPeelResults();

  return (
    <>
      <FaqSchema items={faqs} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceSchema).replace(/</g, "\\u003c"),
        }}
      />
      {clinics.map(({ key, clinic }) => (
        <script
          key={key}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema(clinic)).replace(/</g, "\\u003c"),
          }}
        />
      ))}

      <section className="overflow-hidden bg-paper py-16 md:py-24">
        <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-6 md:px-8 lg:grid-cols-[1.04fr_0.96fr] lg:px-12">
          <div>
            <p className="mb-5 text-[0.6875rem] font-bold uppercase tracking-[0.22em] text-rose-text">
              Laser resurfacing · Napa &amp; Vacaville
            </p>
            <h1 className="mb-6 text-[clamp(2.75rem,6vw,4.9rem)] font-medium leading-[0.98] tracking-[-0.06em] text-rose-text">
              CO2 Laser Resurfacing and CoolPeel
            </h1>
            <p className="mb-8 max-w-[650px] text-lg font-light leading-relaxed text-silver-dark md:text-xl">
              Two depths of CO2 for texture, fine lines, acne scars, and sun damage. Start with a laser consult that matches the depth to your skin and the recovery you can plan for.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button disableHover href={BOOKING_HREF} data-cta="service-booking" className="rounded-full">
                Book a Laser Consultation
              </Button>
              <Button disableHover href="tel:+17073582928" data-cta="phone" variant="ghost" className="rounded-full bg-white/75">
                Call 707.358.2928
              </Button>
            </div>
            <p className="mt-5 text-xs leading-6 text-ink/70">
              This button opens Rella&apos;s live laser category. Choose Napa or Vacaville, then browse current services and availability.
            </p>
          </div>

          <div className="relative aspect-square self-center overflow-hidden bg-rose-blush sm:aspect-[4/3]">
            <Image
              src={HERO_IMAGE}
              alt="A Rella provider performing a device-based skin treatment"
              fill
              preload
              className="object-cover object-center"
              sizes="(min-width: 1024px) 46vw, 92vw"
            />
            <div className="absolute inset-x-0 bottom-0 border-t border-white/30 bg-white/94 p-5 md:p-6">
              <p className="mb-2 text-[0.625rem] font-bold uppercase tracking-[0.2em] text-rose-text">
                Two Rella clinics
              </p>
              <p className="text-lg font-medium leading-snug text-ink">
                {locations.vacaville.address}, {locations.vacaville.city} · {locations.napa.address}, {locations.napa.city}
              </p>
            </div>
          </div>
        </div>
      </section>

      <TrustStrip
        ariaLabel="Rella CO2 laser visit facts"
        items={["Consult first", "Depth chosen after assessment", "Written aftercare", "Napa + Vacaville"]}
      />

      <section className="py-20 md:py-28" aria-labelledby="co2-coolpeel-vs-traditional">
        <div className="mx-auto max-w-[1120px] px-6 md:px-8">
          <div className="mb-12 max-w-[790px]">
            <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-text">
              CoolPeel vs traditional CO2
            </p>
            <h2 id="co2-coolpeel-vs-traditional" className="mb-5 text-3xl font-medium tracking-[-0.04em] text-rose-text md:text-5xl">
              Same laser family. Different depth and recovery.
            </h2>
            <p className="text-lg font-light leading-relaxed text-ink/70">
              CoolPeel and deeper CO2 resurfacing are both CO2 treatments, but they are not interchangeable. The depth that makes sense depends on the concern, your skin type, and how much downtime your calendar can absorb.
            </p>
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            {comparison.map((option, index) => (
              <article
                key={option.title}
                className={`border p-7 md:p-8 ${index === 0 ? "border-rose bg-rose-blush" : "border-ink/12 bg-white"}`}
              >
                <p className="mb-3 text-[0.625rem] font-bold uppercase tracking-[0.2em] text-rose-text">{option.eyebrow}</p>
                <h3 className="mb-4 text-2xl font-medium tracking-[-0.02em] text-rose-text">{option.title}</h3>
                <p className="mb-6 text-sm leading-7 text-ink/70">{option.body}</p>
                <ul className="space-y-2 text-sm text-ink">
                  {option.points.map((point) => (
                    <li key={point} className="flex gap-3">
                      <span aria-hidden="true" className="font-bold text-rose-text">·</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-rose py-20 text-white md:py-28" aria-labelledby="co2-concerns">
        <div className="mx-auto max-w-[1120px] px-6 md:px-8">
          <div className="mb-12 max-w-[780px]">
            <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-white">What it can address</p>
            <h2 id="co2-concerns" className="mb-5 text-3xl font-medium tracking-[-0.04em] md:text-5xl">
              Concerns CO2 resurfacing is considered for.
            </h2>
            <p className="text-lg font-light leading-relaxed text-white">
              CO2 is a resurfacing tool, not a cure-all. These are the concerns it is most often discussed for; the consult decides whether it fits yours.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {concerns.map((concern) => (
              <article key={concern.id} id={concern.id} className="border border-white/15 bg-white/[0.04] p-6">
                <h3 className="mb-3 text-xl font-medium">{concern.title}</h3>
                <p className="text-sm leading-7 text-white">{concern.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="acne-scars" className="scroll-mt-28 py-20 md:py-28" aria-labelledby="co2-acne-scars">
        <div className="mx-auto grid max-w-[1040px] gap-8 px-6 md:px-8 lg:grid-cols-[1.03fr_0.97fr] lg:items-center">
          <div>
            <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-text">Acne scars</p>
            <h2 id="co2-acne-scars" className="mb-5 text-3xl font-medium tracking-[-0.04em] text-rose-text md:text-5xl">
              Scar type matters more than the laser name.
            </h2>
            <p className="mb-5 text-lg font-light leading-relaxed text-ink/70">
              Acne scarring is not one thing. Shallow, rolling texture behaves differently from narrow, deep scars, and leftover marks from recent breakouts are a different concern again. That is why the provider looks at the scars themselves before recommending CoolPeel, deeper CO2 resurfacing, or a different approach.
            </p>
            <p className="text-lg font-light leading-relaxed text-ink/70">
              Active breakouts, recent acne medication, and a history of pigment changes or slow healing all belong in the conversation.
            </p>
          </div>
          <div className="border-l-4 border-rose bg-rose-blush p-7 md:p-10">
            <p className="mb-3 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-rose-text">Set expectations early</p>
            <p className="mb-6 text-lg leading-8 text-silver-dark">
              Scar improvement varies and is not guaranteed. Deeper scarring may need more than one session or a combined plan, and your provider explains what is realistic before you commit.
            </p>
            <Link
              href="/services/microneedling"
              className="text-sm font-semibold text-rose-text underline decoration-rose-light underline-offset-4 hover:text-rose-text"
            >
              Compare microneedling for acne scars →
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-rose-blush py-20 md:py-28" aria-labelledby="co2-recovery">
        <div className="mx-auto max-w-[1120px] px-6 md:px-8">
          <div className="mb-12 max-w-[780px]">
            <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-text">Downtime, step by step</p>
            <h2 id="co2-recovery" className="mb-5 text-3xl font-medium tracking-[-0.04em] text-rose-text md:text-5xl">
              What recovery usually looks like.
            </h2>
            <p className="text-lg font-light leading-relaxed text-ink/70">
              This is a general outline. CoolPeel recovery is usually on the shorter end; deeper CO2 resurfacing takes longer. Your provider gives you the timeline for your exact settings and treatment area.
            </p>
          </div>
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {recovery.map((step, index) => (
              <li key={step.phase} className="border border-ink/12 bg-white p-6">
                <span className="mb-8 inline-flex h-9 w-9 items-center justify-center rounded-full bg-rose text-xs font-bold text-white">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mb-3 text-xl font-medium text-rose-text">{step.phase}</h3>
                <p className="text-sm leading-7 text-ink/70">{step.body}</p>
              </li>
            ))}
          </ol>
          <p className="mt-8 max-w-[780px] text-sm leading-7 text-ink/70">
            Contact Rella if you notice signs that worry you during healing, such as increasing pain, blistering, crusting that spreads, or anything that does not match your aftercare instructions.
          </p>
        </div>
      </section>

      <section className="py-20 md:py-28" aria-labelledby="co2-season-sun">
        <div className="mx-auto grid max-w-[1040px] gap-8 px-6 md:px-8 lg:grid-cols-2 lg:items-start">
          <div>
            <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-text">Season &amp; sun care</p>
            <h2 id="co2-season-sun" className="mb-5 text-3xl font-medium tracking-[-0.04em] text-rose-text md:text-5xl">
              Plan around the sun, not just the calendar.
            </h2>
            <p className="text-lg font-light leading-relaxed text-ink/70">
              Freshly resurfaced skin is especially sensitive to sun. Many people choose cooler months, when it is easier to stay out of strong sun, but the real rule is protecting treated skin before and after every session.
            </p>
          </div>
          <ul className="grid gap-px bg-rose/35">
            {[
              "Tell your provider about recent tanning, beach trips, or a recent sunburn.",
              "Plan around outdoor events, vineyard days, sports, and travel in the weeks after treatment.",
              "Use the sun protection your provider recommends and reapply when you are outside.",
              "A hat and shade help, but they do not replace sunscreen on healing skin.",
            ].map((item) => (
              <li key={item} className="flex gap-4 bg-white p-5 text-sm leading-7 text-ink">
                <span aria-hidden="true" className="font-bold text-rose-text">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <TreatmentResults
        id="co2-results-heading"
        heading="Real CoolPeel results. Shared with permission."
        body="Approved CoolPeel before-and-after photography from Rella patients. Individual results vary, and your plan is built in consult."
        results={results}
        assetNeededNote="ASSET NEEDED — approved CoolPeel before-and-after photography is required before this gallery can publish."
      />

      <section className="bg-rose py-20 text-white md:py-28" aria-labelledby="co2-clinics">
        <div className="mx-auto max-w-[1120px] px-6 md:px-8">
          <div className="mb-12 max-w-[780px]">
            <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-white">Two clinics</p>
            <h2 id="co2-clinics" className="mb-5 text-3xl font-medium tracking-[-0.04em] md:text-5xl">
              Start your laser consult in Napa or Vacaville.
            </h2>
            <p className="text-lg font-light leading-relaxed text-white">
              Each button opens that clinic&apos;s live laser category so you can see current services and availability before choosing a time.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {clinics.map(({ key, label, clinic, note, detailHref, detailLabel }) => (
              <article key={key} className="border border-white/25 bg-white p-7 text-ink md:p-8">
                <p className="mb-2 text-[0.625rem] font-bold uppercase tracking-[0.2em] text-rose-text">{label}</p>
                <h3 className="mb-3 text-2xl font-medium tracking-[-0.02em] text-rose-text">
                  {clinic.address} · {clinic.city}, {clinic.state} {clinic.zip}
                </h3>
                <ul className="mb-4 text-sm leading-7 text-ink/70">
                  {clinic.hours.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
                <p className="mb-6 text-sm leading-7 text-ink/70">{note}</p>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Button
                    disableHover
                    href={bookingHrefFor(key)}
                    data-cta="service-booking"
                    data-location={key}
                    className="rounded-full"
                  >
                    Book in {clinic.city}
                  </Button>
                  <Link href={detailHref} className="text-sm font-semibold text-rose-text underline decoration-rose-light underline-offset-4">
                    {detailLabel}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28" aria-labelledby="co2-faq">
        <div className="mx-auto max-w-[900px] px-6 md:px-8">
          <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-text">Questions, answered</p>
          <h2 id="co2-faq" className="mb-8 text-3xl font-medium tracking-[-0.035em] text-rose-text md:text-5xl">
            CO2 laser &amp; CoolPeel FAQ
          </h2>
          <FaqAccordion items={faqs} />
        </div>
      </section>

      <section className="bg-rose py-20 text-center text-white" aria-labelledby="co2-next-step">
        <div className="mx-auto max-w-[740px] px-6">
          <h2 id="co2-next-step" className="mb-4 text-3xl font-medium tracking-[-0.035em] md:text-5xl">
            Choose the depth after the assessment.
          </h2>
          <p className="mb-8 text-lg font-light leading-relaxed text-white">
            Open the live laser category, pick your clinic, and give the team the context it needs to recommend CoolPeel, deeper CO2, or a better-suited option.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button disableHover href={BOOKING_HREF} data-cta="service-booking" className="rounded-full bg-white !text-rose-text">
              Book a Laser Consultation
            </Button>
            <Button disableHover href="tel:+17073582928" data-cta="phone" variant="ghost">
              Call Rella
            </Button>
          </div>
          <p className="mt-6 text-xs leading-6 text-white">
            Individual results vary. CO2 laser eligibility, depth, settings, treatment area, number of sessions, and timing require an individualized assessment.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-white">
            <Link href="/services/laser-treatments" className="underline underline-offset-4 hover:text-white">All laser treatments</Link>
            <Link href="/services/lasers" className="underline underline-offset-4 hover:text-white">Explore lasers by concern</Link>
            <Link href="/cancellation-policy" className="underline underline-offset-4 hover:text-white">Cancellation policy</Link>
          </div>
        </div>
      </section>
    </>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  return withWebsiteSeo(PATH, defaultMetadata);
}
