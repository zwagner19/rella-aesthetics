import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { FaqAccordion, FaqSchema } from "@/components/blocks/FaqAccordion";
import { TrustStrip } from "@/components/blocks/TrustStrip";
import { WeightLossConversionTracker } from "@/components/integrations/WeightLossConversionTracker";
import { resolveBookingHref, type BookingLocation } from "@/lib/booking-routes";
import { medicalWeightLossServiceSchema } from "@/lib/schemas";

const steps = [
  {
    label: "Choose",
    title: "Select your Rella clinic",
    body: "Choose Napa or Vacaville so you see the correct consultation availability and follow-up location.",
  },
  {
    label: "Talk",
    title: "Complete your 30-minute qualification consultation",
    body: "Dr. Wagner reviews the relevant history, goals, previous attempts, and safety considerations to determine whether you medically qualify.",
  },
  {
    label: "Options",
    title: "Review the appropriate options",
    body: "If you qualify, discuss the treatment paths that may fit—including medication only when medically appropriate—and the costs involved.",
  },
  {
    label: "Plan",
    title: "Begin an individualized care plan",
    body: "Complete any required labs or follow-up steps, then begin treatment, monitoring, support, and maintenance built around you.",
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
    question: "Can I be medically qualified during the first phone consultation?",
    answer:
      "Yes. The 30-minute phone consultation with Zachary Wagner, DO, is a medical qualification consultation. He reviews your relevant health history, goals, prior attempts, and safety considerations to determine whether you medically qualify to proceed. Additional information, labs, or follow-up may still be required before a medication is prescribed or treatment begins.",
  },
  {
    question: "How much does medical weight-loss care cost?",
    answer:
      "There is no single price that applies to every patient. Total cost can include visits, medication, labs, and follow-up, and it can vary with medication source, availability, and insurance coverage. Rella explains the applicable components and costs before you decide whether to proceed.",
  },
  {
    question: "Does a consultation guarantee a prescription?",
    answer:
      "No. Prescription treatment is offered only when clinically appropriate after the required evaluation. The right next step may include additional history, an examination, labs, lifestyle support, medication, or another recommendation.",
  },
  {
    question: "Does Rella offer semaglutide, tirzepatide, or other GLP-1 options?",
    answer:
      "GLP-1 medications may be discussed when clinically appropriate, but the appropriate medication, source, dosing, and availability depend on your medical history and current clinical circumstances. Your clinician will explain the specific option being considered, its risks, and whether it is FDA approved or compounded.",
  },
  {
    question: "Does Rella use brand-name or compounded GLP-1 medications?",
    answer:
      "The appropriate option depends on your medical needs, medication availability, and the current clinical and regulatory circumstances. Your clinician will identify the source of any medication being considered. FDA-approved brand medications and compounded medications are not interchangeable; compounded medications are not FDA approved, and FDA does not review them for safety, effectiveness, or quality before marketing.",
  },
  {
    question: "What side effects and monitoring should I expect?",
    answer:
      "Side effects and risks vary by medication and by patient. Gastrointestinal symptoms are among the concerns often discussed with GLP-1 treatment, but your clinician will review risks, contraindications, and warning signs that apply to the option being considered. Any monitoring plan is individualized to your history and treatment.",
  },
  {
    question: "Will I be pushed into injections if they are not right for me?",
    answer:
      "No. Rella's goal is to determine what is medically appropriate, not to sell every patient the same treatment. If an injectable medication is not appropriate or not preferred, Dr. Wagner can discuss whether another medication, lifestyle-focused care, additional evaluation, or a different next step makes sense.",
  },
  {
    question: "Can I receive care virtually?",
    answer:
      "The medical qualification consultation is by phone. Virtual follow-up may be available for California patients, while some labs, evaluation, or monitoring steps may need to occur through the Napa or Vacaville clinic. The team will explain what applies to you.",
  },
  {
    question: "What happens if I stop medication or worry about regaining weight?",
    answer:
      "Weight maintenance is part of the care conversation, not an afterthought. Individual responses vary, and no result can be guaranteed. Dr. Wagner can discuss follow-up, habits, monitoring, and the long-term plan appropriate to your treatment rather than treating medication as a stand-alone quick fix.",
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
      <div>
        <Button
          href={consultHref}
          className="w-full rounded-full !bg-[#A34F49] px-6 text-white hover:!bg-[#8F403B] sm:w-auto"
          data-cta="weight-loss-consult"
          data-location={option.slug}
        >
          See {option.name} Call Times
        </Button>
      </div>
      <p className="mt-5 text-xs leading-relaxed text-silver">
        30-minute medical qualification consultation · No card required · No pressure
      </p>
    </article>
  );
}

export function WeightLossServicePage() {
  return (
    <>
      <WeightLossConversionTracker />
      <FaqSchema items={[...faq]} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(medicalWeightLossServiceSchema()).replace(/</g, "\\u003c"),
        }}
      />

      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#fff_0%,#FDF7F5_58%,#FBE7E3_100%)] py-12 md:py-16">
        <div className="mx-auto grid max-w-[1200px] items-center gap-10 px-6 md:px-8 lg:px-12 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="relative z-10">
            <p className="mb-5 text-[0.6875rem] font-bold uppercase tracking-[0.22em] text-rose-dark">
              Vacaville · Napa · Physician-led care in California
            </p>
            <h1 className="mb-6 max-w-[800px] text-[clamp(2.4rem,4.4vw,3.35rem)] font-medium leading-[0.98] tracking-[-0.055em] text-ink">
              Talk with an obesity-medicine physician about GLP-1 options in Vacaville &amp; Napa.
            </h1>
            <p className="mb-8 max-w-[650px] text-lg font-light leading-relaxed text-silver-dark md:text-xl">
              In one 30-minute phone call, Zachary Wagner, DO, an ABOM-certified physician, will review your health history, goals, and treatment considerations; determine whether you medically qualify for options such as semaglutide or tirzepatide; and explain costs and next steps before you commit.
            </p>
            <div className="mb-6">
              <Button
                href="#consultation-options"
                className="rounded-full !bg-[#A34F49] text-white hover:!bg-[#8F403B]"
                data-cta="booking-flow-start"
              >
                See Available Call Times
              </Button>
            </div>
            <p className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-silver">
              <span>30-minute phone consultation</span>
              <span aria-hidden="true" className="hidden text-rose sm:inline">•</span>
              <span>No card required</span>
              <span aria-hidden="true" className="hidden text-rose sm:inline">•</span>
              <span>No pressure</span>
              <span aria-hidden="true" className="hidden text-rose sm:inline">•</span>
              <span>Medication only if medically appropriate</span>
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-[560px] xl:mx-0">
            <div className="relative min-h-[390px] overflow-hidden rounded-[2rem] shadow-[0_24px_80px_rgba(90,94,98,0.18)] md:min-h-[460px]">
              <Image
                src="/images/service-weightloss.jpg"
                alt="A patient having a supportive medical weight-loss consultation"
                fill
                priority
                className="object-cover object-center"
                sizes="(min-width: 1024px) 46vw, 92vw"
              />
              <div className="absolute inset-x-4 bottom-4 rounded-[1.4rem] bg-white/94 p-5 shadow-lg backdrop-blur md:inset-x-6 md:bottom-6 md:p-6">
                <p className="mb-2 text-[0.625rem] font-bold uppercase tracking-[0.2em] text-rose-dark">Weight-Loss Qualification Call</p>
                <p className="text-lg font-medium leading-snug text-ink">A medical decision—not a sales pitch.</p>
              </div>
            </div>
            <div aria-hidden="true" className="absolute -right-16 -top-16 -z-10 h-56 w-56 rounded-full bg-rose-light/40 blur-3xl" />
          </div>
        </div>
      </section>

      <TrustStrip
        ariaLabel="Rella weight-loss care principles"
        items={["ABOM-certified physician", "4.9★ on Google · 219 reviews", "Napa & Vacaville clinics", "Medication only when appropriate"]}
      />

      <section aria-labelledby="qualification-heading" className="border-b border-silver-pale bg-white py-16 md:py-20">
        <div className="mx-auto grid max-w-[1200px] gap-10 px-6 md:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:px-12">
          <div className="grid gap-6 sm:grid-cols-[170px_1fr] lg:grid-cols-1">
            <div className="relative aspect-[4/5] w-full max-w-[230px] overflow-hidden rounded-[1.5rem] bg-rose-blush shadow-[0_16px_50px_rgba(90,94,98,0.12)]">
              <Image
                src="/images/dr-zachary-wagner.jpg"
                alt="Zachary Wagner, DO, ABOM-certified physician and owner of Rella Aesthetics"
                fill
                className="object-cover object-top"
                sizes="(min-width: 1024px) 230px, 170px"
              />
            </div>
            <div>
              <p className="mb-2 text-lg font-medium text-ink">Zachary Wagner, DO</p>
              <p className="text-sm font-medium leading-relaxed text-silver-dark">ABOM-certified physician · Owner of Rella Aesthetics</p>
            </div>
          </div>

          <div>
            <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-dark">A real medical qualification consultation</p>
            <h2 id="qualification-heading" className="mb-5 text-3xl font-medium leading-tight tracking-[-0.035em] text-ink md:text-5xl">
              Get a medically grounded answer before choosing treatment.
            </h2>
            <p className="mb-7 text-lg font-light leading-relaxed text-silver">
              This call is for people who want a physician to evaluate whether they medically qualify—not a rushed clinic or a one-size-fits-all medication sale.
            </p>
            <div className="mb-8 rounded-[1.25rem] bg-rose-blush p-5 md:p-6">
              <h3 className="mb-4 text-base font-medium text-ink">This call may be right for you if:</h3>
              <ul className="grid gap-3">
                {["You have tried diets, programs, or other clinics without a sustainable path", "You want clear answers about eligibility, safety, side effects, and cost", "You want a physician's medical opinion without pressure or judgment"].map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-silver-dark">
                    <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-dark" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <h3 className="mb-4 text-lg font-medium text-ink">In 30 minutes with Dr. Wagner, you will:</h3>
            <ul className="grid gap-4 sm:grid-cols-2">
              {["Review relevant health history and prior attempts", "Discuss GLP-1 eligibility and safety considerations", "Compare medication and non-medication paths", "Understand likely labs, monitoring, and follow-up", "Review how treatment costs are structured", "Know whether you qualify and what comes next"].map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-silver-dark">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-dark" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-7 text-sm leading-relaxed text-silver">
              Qualification does not guarantee a prescription or a specific medication. Additional information, labs, or follow-up may be required before treatment begins.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="weight-loss-reviews-heading" className="border-b border-silver-pale bg-white py-16 md:py-20">
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12">
          <div className="mb-10 grid gap-7 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-[760px]">
              <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-dark">
                Real local patient experiences
              </p>
              <h2 id="weight-loss-reviews-heading" className="mb-4 text-3xl font-medium leading-tight tracking-[-0.035em] text-rose md:text-5xl">
                What patients say about the experience
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
        <div className="mx-auto grid max-w-[1200px] gap-8 px-6 md:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:px-12">
          <div>
            <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-dark">Clear expectations</p>
            <h2 className="mb-5 text-3xl font-medium tracking-[-0.035em] text-ink md:text-5xl">Understand the investment before you commit.</h2>
          </div>
          <div className="rounded-[1.5rem] border border-rose-light/70 bg-white p-7 md:p-9">
            <p className="mb-5 text-lg leading-relaxed text-silver-dark">
              Program cost depends on the care plan, medication choice, labs, and follow-up needs. During your medical qualification consultation, Rella will explain the applicable options and costs before you decide.
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

      <section id="consultation-options" className="scroll-mt-24 bg-rose-blush py-20 md:py-28">
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12">
          <div className="mx-auto mb-12 max-w-[760px] text-center">
            <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-dark">Choose your clinic</p>
            <h2 className="mb-5 text-3xl font-medium tracking-[-0.035em] text-ink md:text-5xl">Choose your clinic and book your qualification call.</h2>
            <p className="text-lg font-light leading-relaxed text-silver">
              Select Napa or Vacaville to see live times for your 30-minute phone consultation with Dr. Wagner. There is one clear next step and no card is required.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {locationOptions.map((option) => <LocationCard key={option.slug} option={option} />)}
          </div>
          <p className="mx-auto mt-8 max-w-[760px] text-center text-sm leading-relaxed text-silver-dark">
            If medication is not right for you, Dr. Wagner will tell you plainly and discuss other medically appropriate paths.
          </p>
        </div>
      </section>

      <section className="bg-ink py-20 text-center text-white md:py-24">
        <div className="mx-auto max-w-[760px] px-6">
          <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose">The next step is medical qualification</p>
          <h2 className="mb-5 text-3xl font-medium tracking-[-0.035em] md:text-5xl">Find out if you medically qualify.</h2>
          <p className="mb-8 text-lg font-light leading-relaxed text-white/70">
            Choose the Rella clinic that is most convenient for your consultation and follow-up.
          </p>
          <Button
            href="#consultation-options"
            className="rounded-full !bg-[#A34F49] text-white hover:!bg-[#8F403B]"
            data-cta="booking-flow-start"
          >
            Choose Napa or Vacaville
          </Button>
        </div>
      </section>

      <a
        href="#consultation-options"
        data-cta="booking-flow-start"
        className="fixed inset-x-4 bottom-4 z-40 flex min-h-12 items-center justify-center rounded-full bg-[#A34F49] px-6 text-center text-xs font-bold uppercase tracking-[0.16em] text-white shadow-[0_12px_35px_rgba(40,42,44,0.28)] hover:bg-[#8F403B] lg:hidden"
      >
        See Call Times
      </a>

    </>
  );
}
