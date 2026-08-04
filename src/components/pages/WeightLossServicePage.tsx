import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { FaqAccordion, FaqSchema } from "@/components/blocks/FaqAccordion";
import { TrustStrip } from "@/components/blocks/TrustStrip";
import {
  resolveBookingHref,
  resolveWeightLossAssessmentHref,
  type BookingLocation,
} from "@/lib/booking-routes";
import { medicalWeightLossServiceSchema } from "@/lib/schemas";

const valueCards = [
  {
    number: "01",
    title: "A real clinical starting point",
    body: "Review your goals, health history, prior attempts, and questions with Dr. Wagner—not a promise of a prescription.",
  },
  {
    number: "02",
    title: "More than a medication decision",
    body: "Understand the monitoring, habits, follow-up, and maintenance that can make a plan more sustainable.",
  },
  {
    number: "03",
    title: "Local care with virtual flexibility",
    body: "Connect your phone consultation to the Rella clinic in Napa or Vacaville, with follow-up options explained clearly.",
  },
  {
    number: "04",
    title: "No-pressure clarity",
    body: "Review the program, likely next steps, and applicable costs before deciding whether Rella fits.",
  },
] as const;

const steps = [
  {
    label: "Choose",
    title: "Select your Rella clinic",
    body: "Choose Napa or Vacaville so you see the correct consultation availability and follow-up location.",
  },
  {
    label: "Talk",
    title: "Have a 30-minute phone consultation",
    body: "Discuss what you have tried, what is getting in the way, and the questions you want answered.",
  },
  {
    label: "Evaluate",
    title: "Complete the appropriate clinical review",
    body: "If you decide to continue, the medical team will explain any evaluation, labs, or in-person steps that may be appropriate.",
  },
  {
    label: "Plan",
    title: "Build the next step around you",
    body: "Treatment, monitoring, support, and maintenance are individualized. A consultation does not guarantee a prescription.",
  },
] as const;

const googleReviewUrl = "https://www.google.com/maps?cid=10820799198475906076";

const weightLossReviews = [
  {
    quote: "They genuinely care about how your treatments are going.",
    name: "Georgia Javaras",
    context: "Google review · Weight-loss patient",
  },
  {
    quote: "My concerns are always heard and addressed.",
    name: "Paige Kiehn",
    context: "Google review · Weight-loss medication care",
  },
  {
    quote: "Very easy to reach Dr. Wagner with a question.",
    name: "J N",
    context: "Google review · Weight-loss patient",
  },
] as const;

const faq = [
  {
    question: "What happens during the first phone consultation?",
    answer:
      "During your phone consultation with Zachary Wagner, DO, you will discuss your goals, relevant history, what you have already tried, how Rella's program works, likely next steps, and cost questions. It is a starting-point conversation, not a medical intake or a guarantee of treatment.",
  },
  {
    question: "Do I need a card to see consultation times?",
    answer:
      "No. The weight-loss starting-point consultation does not require a card to view availability or reserve the consultation.",
  },
  {
    question: "Does a consultation guarantee a prescription?",
    answer:
      "No. Prescription treatment is offered only when clinically appropriate after the required evaluation. The right next step may include additional history, an examination, labs, lifestyle support, medication, or another recommendation.",
  },
  {
    question: "Does Rella offer semaglutide or other GLP-1 options?",
    answer:
      "GLP-1 medications may be discussed when clinically appropriate, but the appropriate medication, source, dosing, and availability depend on your medical history and current clinical circumstances. Your clinician will explain the specific option being considered, its risks, and whether it is FDA approved or compounded.",
  },
  {
    question: "What if I am not ready to book a consultation?",
    answer:
      "Choose your nearest Rella clinic and take the short, nonmedical starting-point assessment. It is designed to help you organize your goals and decide whether a conversation is the right next step.",
  },
  {
    question: "Can I receive care virtually?",
    answer:
      "The first consultation is by phone. Virtual follow-up may be available for California patients, while some evaluation or monitoring steps may need to occur through the Napa or Vacaville clinic. The team will explain what applies to you.",
  },
] as const;

interface LocationOption {
  slug: BookingLocation;
  name: string;
  address: string;
  detail: string;
}

const locationOptions: LocationOption[] = [
  {
    slug: "vacaville",
    name: "Vacaville",
    address: "542 Main St · Vacaville, CA",
    detail: "Connect your phone consultation with Dr. Wagner to Rella's Vacaville clinic.",
  },
  {
    slug: "napa",
    name: "Napa",
    address: "1541 3rd St · Downtown Napa",
    detail: "Connect your phone consultation with Dr. Wagner to Rella's Napa clinic.",
  },
];

function LocationCard({ option }: { option: LocationOption }) {
  const consultHref = resolveBookingHref({
    location: option.slug,
    service: "weight-loss",
  });
  const assessmentHref = resolveWeightLossAssessmentHref(option.slug);

  return (
    <article className="group rounded-[1.75rem] border border-rose-light/70 bg-white p-6 shadow-[0_18px_60px_rgba(90,94,98,0.08)] md:p-8">
      <div className="mb-7 flex items-start justify-between gap-4">
        <div>
          <p className="mb-2 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-dark">
            Rella Aesthetics
          </p>
          <h3 className="text-3xl font-medium tracking-[-0.03em] text-ink">{option.name}</h3>
        </div>
        <span aria-hidden="true" className="text-3xl font-light text-rose transition-transform group-hover:translate-x-1">
          →
        </span>
      </div>
      <p className="mb-2 text-sm font-medium text-silver-dark">{option.address}</p>
      <p className="mb-7 min-h-12 text-sm leading-relaxed text-silver">{option.detail}</p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          href={consultHref}
          className="w-full rounded-full px-6 sm:w-auto"
          data-cta="weight-loss-consult"
          data-location={option.slug}
        >
          See {option.name} Times
        </Button>
        <Button
          href={assessmentHref}
          variant="ghost"
          className="w-full rounded-full px-6 sm:w-auto"
          data-cta="weight-loss-assessment"
          data-location={option.slug}
        >
          Take Assessment
        </Button>
      </div>
      <p className="mt-5 text-xs leading-relaxed text-silver">
        30-minute phone consultation · No card required · No pressure
      </p>
    </article>
  );
}

export function WeightLossServicePage() {
  return (
    <>
      <FaqSchema items={[...faq]} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(medicalWeightLossServiceSchema()).replace(/</g, "\\u003c"),
        }}
      />

      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#fff_0%,#FDF7F5_58%,#FBE7E3_100%)] py-16 md:py-24 lg:py-28">
        <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-6 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-12">
          <div className="relative z-10">
            <p className="mb-5 text-[0.6875rem] font-bold uppercase tracking-[0.22em] text-rose-dark">
              Vacaville · Napa · Virtual follow-up in California
            </p>
            <h1 className="mb-6 max-w-[760px] text-[clamp(2.65rem,6vw,4.4rem)] font-medium leading-[0.98] tracking-[-0.055em] text-ink">
              Medical weight loss built around more than medication.
            </h1>
            <p className="mb-8 max-w-[650px] text-lg font-light leading-relaxed text-silver-dark md:text-xl">
              Start with a 30-minute phone consultation with Zachary Wagner, DO, an American Board of Obesity Medicine diplomate. Understand the program, the appropriate next step, and the costs before you decide.
            </p>
            <div className="mb-6 flex flex-col gap-3 sm:flex-row">
              <Button
                href="#consultation-options"
                className="rounded-full"
                data-cta="booking-flow-start"
              >
                See Consultation Times
              </Button>
              <Button href="#how-it-works" variant="ghost" className="rounded-full bg-white/70">
                How Rella Works
              </Button>
            </div>
            <p className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-silver">
              <span>30-minute phone consultation</span>
              <span aria-hidden="true" className="hidden text-rose sm:inline">•</span>
              <span>No card required</span>
              <span aria-hidden="true" className="hidden text-rose sm:inline">•</span>
              <span>No pressure</span>
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-[560px] lg:mx-0">
            <div className="relative min-h-[390px] overflow-hidden rounded-[2rem] shadow-[0_24px_80px_rgba(90,94,98,0.18)] md:min-h-[520px]">
              <Image
                src="/images/service-weightloss.jpg"
                alt="A patient having a supportive medical weight-loss consultation"
                fill
                priority
                className="object-cover object-center"
                sizes="(min-width: 1024px) 46vw, 92vw"
              />
              <div className="absolute inset-x-4 bottom-4 rounded-[1.4rem] bg-white/94 p-5 shadow-lg backdrop-blur md:inset-x-6 md:bottom-6 md:p-6">
                <p className="mb-2 text-[0.625rem] font-bold uppercase tracking-[0.2em] text-rose-dark">Your starting point</p>
                <p className="text-lg font-medium leading-snug text-ink">A clear conversation before any commitment.</p>
              </div>
            </div>
            <div aria-hidden="true" className="absolute -right-16 -top-16 -z-10 h-56 w-56 rounded-full bg-rose-light/40 blur-3xl" />
          </div>
        </div>
      </section>

      <TrustStrip
        ariaLabel="Rella weight-loss care principles"
        items={["ABOM-certified physician", "Two local clinics", "Medication only when appropriate", "Transparent next steps"]}
      />

      <section aria-labelledby="weight-loss-reviews-heading" className="border-b border-silver-pale bg-white py-16 md:py-20">
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12">
          <div className="mb-10 grid gap-7 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-[760px]">
              <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-dark">
                Real local patient experiences
              </p>
              <h2 id="weight-loss-reviews-heading" className="mb-4 text-3xl font-medium leading-tight tracking-[-0.035em] text-ink md:text-5xl">
                Care that patients describe as personal, responsive, and supportive.
              </h2>
              <p className="text-base font-light leading-relaxed text-silver md:text-lg">
                Short excerpts from Rella&apos;s public Google reviews that specifically discuss weight-loss care.
              </p>
            </div>
            <a
              href={googleReviewUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-fit items-center gap-3 rounded-full border border-rose-light bg-rose-blush px-5 py-3 text-sm font-semibold text-ink transition-colors hover:bg-rose-light/60"
            >
              <span aria-hidden="true" className="text-rose-dark">★★★★★</span>
              <span>4.9 on Google · 219 reviews</span>
            </a>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {weightLossReviews.map((review) => (
              <figure key={review.name} className="flex min-h-[230px] flex-col justify-between rounded-[1.5rem] border border-silver-pale bg-[linear-gradient(145deg,#fff_0%,#FDF7F5_100%)] p-6 shadow-[0_14px_45px_rgba(90,94,98,0.06)] md:p-7">
                <blockquote className="text-xl font-medium leading-relaxed tracking-[-0.02em] text-ink">
                  &ldquo;{review.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-8 border-t border-rose-light/70 pt-5">
                  <p className="text-sm font-semibold text-ink">{review.name}</p>
                  <p className="mt-1 text-xs leading-relaxed text-silver">{review.context}</p>
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="mt-7 flex flex-col gap-3 text-sm text-silver md:flex-row md:items-center md:justify-between">
            <p>23 Google reviews mention weight loss. Profile checked August 4, 2026.</p>
            <p>Reviews reflect individual experiences. Results vary.</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="weight-loss-story-heading" className="border-b border-silver-pale bg-rose-blush/35 py-16 md:py-20">
        <div className="mx-auto grid max-w-[1050px] gap-10 px-6 md:px-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-center lg:px-12">
          <div className="mx-auto w-full max-w-[420px] overflow-hidden rounded-[1.75rem] border border-rose-light/80 bg-ink shadow-[0_20px_60px_rgba(40,42,44,0.14)]">
            <video
              aria-label="Rella semaglutide patient story"
              className="aspect-[9/16] w-full bg-ink object-cover"
              controls
              playsInline
              preload="metadata"
            >
              <source src="/media/semaglutide-story.mp4" type="video/mp4" />
              Your browser does not support embedded video.
            </video>
          </div>

          <div className="max-w-[520px]">
            <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-dark">A real Rella patient story</p>
            <h2 id="weight-loss-story-heading" className="mb-5 text-3xl font-medium leading-tight tracking-[-0.035em] text-ink md:text-5xl">
              Hear the experience in a patient&apos;s own words.
            </h2>
            <p className="text-base font-light leading-relaxed text-silver md:text-lg">
              This short video shares one patient&apos;s personal experience with Rella&apos;s semaglutide program. Your care plan and results will be individual to you.
            </p>
            <p className="mt-5 text-sm leading-relaxed text-silver">
              Individual results vary. Prescription treatment is offered only when clinically appropriate after evaluation.
            </p>
          </div>
        </div>
      </section>

      <section id="program" className="scroll-mt-24 py-20 md:py-28">
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12">
          <div className="mb-12 max-w-[780px] md:mb-16">
            <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-dark">The Rella difference</p>
            <h2 className="mb-5 text-3xl font-medium leading-tight tracking-[-0.035em] text-ink md:text-5xl">
              Your plan should fit your health—not a one-size-fits-all subscription.
            </h2>
            <p className="text-lg font-light leading-relaxed text-silver">
              Rella begins with a clinical conversation. Depending on your history and goals, the next step may include an evaluation, labs when appropriate, lifestyle support, medication options when clinically appropriate, and a plan for follow-up and maintenance.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {valueCards.map((card) => (
              <article key={card.number} className="rounded-[1.5rem] border border-silver-pale bg-rose-blush/50 p-6 md:p-8">
                <p className="mb-8 text-xs font-bold tracking-[0.18em] text-rose-dark">{card.number}</p>
                <h3 className="mb-3 text-xl font-medium tracking-[-0.02em] text-ink md:text-2xl">{card.title}</h3>
                <p className="leading-relaxed text-silver">{card.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-24 bg-silver-pale/60 py-20 md:py-28">
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12">
          <div className="mb-12 max-w-[700px]">
            <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-dark">How it works</p>
            <h2 className="text-3xl font-medium tracking-[-0.035em] text-ink md:text-5xl">A simpler path to the right next step.</h2>
          </div>
          <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <li key={step.label} className="relative rounded-[1.5rem] bg-white p-6 shadow-[0_12px_40px_rgba(90,94,98,0.06)]">
                <span className="mb-8 inline-flex h-10 w-10 items-center justify-center rounded-full bg-rose-blush text-sm font-bold text-rose-dark">
                  {index + 1}
                </span>
                <p className="mb-2 text-[0.625rem] font-bold uppercase tracking-[0.18em] text-silver">{step.label}</p>
                <h3 className="mb-3 text-lg font-medium leading-snug text-ink">{step.title}</h3>
                <p className="text-sm leading-relaxed text-silver">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="mx-auto grid max-w-[1200px] gap-10 px-6 md:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-12">
          <div className="grid gap-6 sm:grid-cols-[180px_1fr] lg:grid-cols-1">
            <div className="relative aspect-[4/5] w-full max-w-[240px] overflow-hidden rounded-[1.5rem] bg-rose-blush shadow-[0_16px_50px_rgba(90,94,98,0.12)]">
              <Image
                src="/images/dr-zachary-wagner.jpg"
                alt="Zachary Wagner, DO, physician and owner of Rella Aesthetics"
                fill
                className="object-cover object-top"
                sizes="(min-width: 1024px) 240px, 180px"
              />
            </div>
            <div>
              <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-dark">Your first conversation</p>
              <h2 className="mb-5 text-3xl font-medium tracking-[-0.035em] text-ink md:text-5xl">Know who you&apos;re talking with.</h2>
              <p className="mb-3 text-lg font-light leading-relaxed text-silver">
                Dr. Wagner&apos;s starting-point consultation is designed to give you useful clarity without forcing you through a long intake or asking for a card.
              </p>
              <p className="text-sm font-medium leading-relaxed text-silver-dark">
                Zachary Wagner, DO · American Board of Obesity Medicine diplomate
              </p>
            </div>
          </div>
          <div className="rounded-[1.75rem] bg-ink p-7 text-white md:p-10">
            <h3 className="mb-7 text-xl font-medium md:text-2xl">In 30 minutes with Dr. Wagner, discuss:</h3>
            <ul className="grid gap-4 sm:grid-cols-2">
              {["Your goals and prior attempts", "What may be getting in the way", "How the Rella program works", "Likely evaluation and next steps", "Monitoring and ongoing support", "Applicable cost questions"].map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-white/80">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-rose" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-8 border-t border-white/15 pt-6 text-sm leading-relaxed text-white/65">
              The consultation is not a guarantee of treatment or a prescription. Clinical recommendations require the appropriate evaluation.
            </p>
          </div>
        </div>
      </section>

      <section id="consultation-options" className="scroll-mt-24 bg-rose-blush py-20 md:py-28">
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12">
          <div className="mx-auto mb-12 max-w-[760px] text-center">
            <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-dark">Choose your clinic</p>
            <h2 className="mb-5 text-3xl font-medium tracking-[-0.035em] text-ink md:text-5xl">Ready to talk—or still deciding?</h2>
            <p className="text-lg font-light leading-relaxed text-silver">
              Ready patients can go directly to live consultation times. If you are still deciding, take the short starting-point assessment for your nearest Rella clinic.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {locationOptions.map((option) => <LocationCard key={option.slug} option={option} />)}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="mx-auto grid max-w-[1200px] gap-8 px-6 md:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:px-12">
          <div>
            <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-dark">Clear expectations</p>
            <h2 className="mb-5 text-3xl font-medium tracking-[-0.035em] text-ink md:text-5xl">Understand the investment before you commit.</h2>
          </div>
          <div className="rounded-[1.5rem] border border-rose-light/70 bg-white p-7 md:p-9">
            <p className="mb-5 text-lg leading-relaxed text-silver-dark">
              Program cost depends on the care plan, medication choice, labs, and follow-up needs. During your consultation, Rella will explain the applicable options and costs before you decide.
            </p>
            <p className="text-sm leading-relaxed text-silver">
              Individual results vary. Prescription treatment is offered only when clinically appropriate after evaluation. Compounded medications are not FDA approved, and FDA does not review them for safety, effectiveness, or quality before marketing. Availability and treatment options may change.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-silver-pale/60 py-20 md:py-28">
        <div className="mx-auto max-w-[1000px] px-6 md:px-8 lg:px-12">
          <div className="mb-10">
            <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-dark">Questions, answered</p>
            <h2 className="text-3xl font-medium tracking-[-0.035em] text-ink md:text-5xl">Medical weight-loss FAQ</h2>
          </div>
          <FaqAccordion items={[...faq]} />
        </div>
      </section>

      <section className="bg-ink py-20 text-center text-white md:py-24">
        <div className="mx-auto max-w-[760px] px-6">
          <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose">The next step is a conversation</p>
          <h2 className="mb-5 text-3xl font-medium tracking-[-0.035em] md:text-5xl">Get clarity without committing today.</h2>
          <p className="mb-8 text-lg font-light leading-relaxed text-white/70">
            Choose the Rella clinic that is most convenient for your consultation and follow-up.
          </p>
          <Button
            href="#consultation-options"
            className="rounded-full bg-rose-cta text-white hover:bg-rose-dark"
            data-cta="booking-flow-start"
          >
            Choose Napa or Vacaville
          </Button>
        </div>
      </section>

    </>
  );
}
