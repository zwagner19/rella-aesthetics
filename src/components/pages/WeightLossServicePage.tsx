import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { FaqAccordion, FaqSchema } from "@/components/blocks/FaqAccordion";
import { BeforeAfterGallery } from "@/components/blocks/BeforeAfterGallery";
import { TrustStrip } from "@/components/blocks/TrustStrip";
import { WeightLossConversionTracker } from "@/components/integrations/WeightLossConversionTracker";
import { approvedResultsFor } from "@/content/results";
import { weightLossGoogleProof, weightLossPatientStory } from "@/content/social-proof";
import { resolveBookingHref, type BookingLocation } from "@/lib/booking-routes";
import { medicalWeightLossServiceSchema } from "@/lib/schemas";
import { servicePages } from "@/lib/service-data";

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

const weightLossResults = approvedResultsFor("weight-loss");

function getWeightLossService() {
  const service = servicePages.find((candidate) => candidate.slug === "weight-loss");
  if (!service) throw new Error("Medical weight-loss service data is missing");
  return service;
}

const weightLossService = getWeightLossService();

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
    <article className="border border-ink/15 bg-white p-6 md:p-8">
      <div className="mb-7 flex items-start justify-between gap-4">
        <div>
          <p className="mb-2 text-sm font-normal italic text-ink">
            Rella Aesthetics
          </p>
          <h3 className="text-3xl font-bold uppercase leading-tight tracking-[0.06em] text-rose">{option.name}</h3>
        </div>
        <span aria-hidden="true" className="text-3xl font-light text-ink">
          →
        </span>
      </div>
      <p className="mb-2 text-sm font-medium text-ink/80">{option.address}</p>
      <p className="mb-7 min-h-12 text-sm leading-[1.75] text-ink/65">{option.detail}</p>
      <div>
        <Button
          href={consultHref}
          disableHover
          className="w-full px-6 sm:w-auto"
          data-cta="weight-loss-consult"
          data-location={option.slug}
        >
          See {option.name} Call Times
        </Button>
      </div>
      <p className="mt-5 text-xs leading-[1.75] text-ink/60">
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

      <section className="bg-rose text-white">
        <div className="mx-auto grid max-w-[1160px] items-stretch lg:grid-cols-[1.15fr_0.85fr]">
          <div className="relative z-10 flex flex-col justify-center px-5 py-16 md:px-8 md:py-24 lg:px-10 lg:py-20 xl:px-14 xl:py-28">
            <p className="mb-4 text-sm font-normal italic text-white">
              30-minute phone consultation · Napa + Vacaville
            </p>
            <h1 className="mb-5 max-w-[720px] text-[clamp(2.2rem,4vw,3.4rem)] font-bold uppercase leading-[1.06] tracking-[0.055em] text-white">
              Find out if you medically qualify for GLP-1 care.
            </h1>
            <p className="mb-7 max-w-[650px] text-base font-light leading-[1.7] text-white/80 md:text-lg">
              Speak directly with Zachary Wagner, DO, an ABOM-certified physician. He will review your health history, goals, and safety considerations, then explain whether options such as semaglutide or tirzepatide—and what next steps—may be medically appropriate for you.
            </p>
            <div className="mb-6">
              <Button
                href="#consultation-options"
                disableHover
                data-cta="booking-flow-start"
                className="!border-white !bg-white !text-rose"
              >
                See Available Call Times
              </Button>
            </div>
            <p className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-white/70">
              <span>30-minute phone consultation</span>
              <span aria-hidden="true" className="hidden text-rose sm:inline">•</span>
              <span>No card required</span>
              <span aria-hidden="true" className="hidden text-rose sm:inline">•</span>
              <span>No pressure</span>
              <span aria-hidden="true" className="hidden text-rose sm:inline">•</span>
              <span>Medication only if medically appropriate</span>
            </p>
          </div>

          <div className="relative aspect-[4/3] w-full overflow-hidden bg-rose lg:h-full lg:min-h-[520px] lg:aspect-auto">
              <Image
                src={weightLossService.image}
                alt={weightLossService.imageAlt}
                fill
                preload
                className="object-cover object-center"
                sizes="(min-width: 1024px) 46vw, 92vw"
              />
              <div className="absolute inset-x-0 bottom-0 bg-rose/90 p-5 md:p-6">
                <p className="mb-2 text-sm font-normal italic text-white">Weight-Loss Qualification Call</p>
                <p className="text-lg font-semibold leading-snug text-white">A medical decision—not a sales pitch.</p>
              </div>
          </div>
        </div>
      </section>

      <TrustStrip
        ariaLabel="Rella weight-loss care principles"
        items={["ABOM-certified physician", "4.9★ on Google · 219 reviews", "Napa & Vacaville clinics", "Medication only when appropriate"]}
      />

      <section aria-labelledby="qualification-heading" className="border-b border-ink/10 bg-white py-[clamp(4rem,8vw,7rem)]">
        <div className="mx-auto grid max-w-[1160px] gap-12 px-5 md:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-20">
          <div className="grid gap-6 sm:grid-cols-[170px_1fr] lg:grid-cols-1">
            <div className="relative aspect-[4/5] w-full max-w-[230px] overflow-hidden bg-rose-blush">
              <Image
                src="/images/dr-zachary-wagner.jpg"
                alt="Zachary Wagner, DO, ABOM-certified physician and owner of Rella Aesthetics"
                fill
                className="object-cover object-top"
                sizes="(min-width: 1024px) 230px, 170px"
              />
            </div>
            <div>
              <p className="mb-2 text-lg font-semibold text-ink">Zachary Wagner, DO</p>
              <p className="text-sm font-medium leading-[1.75] text-ink/70">ABOM-certified physician · Owner of Rella Aesthetics</p>
            </div>
          </div>

          <div>
            <p className="mb-4 text-sm font-normal italic text-ink">A real medical qualification consultation</p>
            <h2 id="qualification-heading" className="mb-5 text-[clamp(2rem,4vw,3rem)] font-bold uppercase leading-[1.15] tracking-[0.06em] text-rose">
              Get a medically grounded answer before choosing treatment.
            </h2>
            <p className="mb-7 text-lg font-light leading-[1.75] text-ink/70">
              This call is for people who want a physician to evaluate whether they medically qualify—not a rushed clinic or a one-size-fits-all medication sale.
            </p>
            <div className="mb-8 border-l-4 border-rose bg-rose-blush p-5 md:p-6">
              <h3 className="mb-4 text-base font-semibold text-ink">This call may be right for you if:</h3>
              <ul className="grid gap-3">
                {["You have tried diets, programs, or other clinics without a sustainable path", "You want clear answers about eligibility, safety, side effects, and cost", "You want a physician's medical opinion without pressure or judgment"].map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-[1.75] text-ink/75">
                    <span aria-hidden="true" className="mt-2.5 h-px w-4 shrink-0 bg-ink" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <h3 className="mb-4 text-lg font-semibold text-ink">In 30 minutes with Dr. Wagner, you will:</h3>
            <ul className="grid gap-4 sm:grid-cols-2">
              {["Review relevant health history and prior attempts", "Discuss GLP-1 eligibility and safety considerations", "Compare medication and non-medication paths", "Understand likely labs, monitoring, and follow-up", "Review how treatment costs are structured", "Know whether you qualify and what comes next"].map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-[1.75] text-ink/75">
                  <span aria-hidden="true" className="mt-2.5 h-px w-4 shrink-0 bg-ink" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-7 text-sm leading-[1.75] text-ink/60">
              Qualification does not guarantee a prescription or a specific medication. Additional information, labs, or follow-up may be required before treatment begins.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="weight-loss-reviews-heading" className="border-b border-ink/10 bg-white py-[clamp(4rem,8vw,7rem)]">
        <div className="mx-auto max-w-[1160px] px-5 md:px-8">
          <div className="mb-10 grid gap-7 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-[760px]">
              <p className="mb-4 text-sm font-normal italic text-ink">
                Real local patient experiences
              </p>
              <h2 id="weight-loss-reviews-heading" className="mb-4 text-[clamp(2rem,4vw,3rem)] font-bold uppercase leading-[1.15] tracking-[0.06em] text-rose">
                Care that patients describe as personal, responsive, and supportive.
              </h2>
              <p className="text-base font-light leading-[1.75] text-ink/70 md:text-lg">
                Short excerpts from Rella&apos;s public Google reviews that specifically discuss weight-loss care.
              </p>
            </div>
            <a
              href={weightLossGoogleProof.profileUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 w-fit items-center gap-3 rounded-full border border-ink bg-white px-5 py-3 text-sm font-semibold text-ink"
            >
              <span aria-hidden="true" className="text-rose">★★★★★</span>
              <span>{weightLossGoogleProof.ratingLabel}</span>
            </a>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {weightLossGoogleProof.reviews.map((review) => (
              <figure key={review.name} className="flex min-h-[230px] flex-col justify-between border-l-4 border-rose bg-white p-6 md:p-7">
                <blockquote className="text-xl font-medium leading-[1.65] text-ink">
                  &ldquo;{review.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-8 border-t border-rose-light/70 pt-5">
                  <p className="text-sm font-semibold text-ink">{review.name}</p>
                  <p className="mt-1 text-xs leading-[1.75] text-ink/60">{review.context}</p>
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="mt-7 flex flex-col gap-3 text-sm text-ink/60 md:flex-row md:items-center md:justify-between">
            <p>{weightLossGoogleProof.coverageNote}</p>
            <p>Reviews reflect individual experiences. Results vary.</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="weight-loss-story-heading" className="border-b border-ink/10 bg-rose-blush py-[clamp(4rem,8vw,7rem)]">
        <div className="mx-auto grid max-w-[1050px] gap-12 px-5 md:px-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-center lg:gap-20">
          <div className="mx-auto w-full max-w-[420px] overflow-hidden border border-ink/15 bg-ink">
            <video
              aria-label={weightLossPatientStory.ariaLabel}
              className="aspect-[9/16] w-full bg-ink object-cover"
              controls
              playsInline
              preload="metadata"
            >
              <source src={weightLossPatientStory.videoSrc} type="video/mp4" />
              Your browser does not support embedded video.
            </video>
          </div>

          <div className="max-w-[520px]">
            <p className="mb-4 text-sm font-normal italic text-ink">{weightLossPatientStory.eyebrow}</p>
            <h2 id="weight-loss-story-heading" className="mb-5 text-[clamp(2rem,4vw,3rem)] font-bold uppercase leading-[1.15] tracking-[0.06em] text-rose">
              {weightLossPatientStory.heading}
            </h2>
            <p className="text-base font-light leading-[1.75] text-ink/70 md:text-lg">
              {weightLossPatientStory.description}
            </p>
            <p className="mt-5 text-sm leading-[1.75] text-ink/60">
              {weightLossPatientStory.disclaimer}
            </p>
          </div>
        </div>
      </section>

      <BeforeAfterGallery
        eyebrow="Medical weight-management results"
        title="Progress from real Rella patients."
        introduction="Published only with patient permission and clear treatment context. Every plan and outcome is individual."
        results={weightLossResults}
        tone="light"
      />

      <section id="how-it-works" className="scroll-mt-24 bg-ink/[0.03] py-[clamp(4rem,8vw,7rem)]">
        <div className="mx-auto max-w-[1160px] px-5 md:px-8">
          <div className="mb-12 max-w-[700px]">
            <p className="mb-4 text-sm font-normal italic text-ink">How it works</p>
            <h2 className="text-[clamp(2rem,4vw,3rem)] font-bold uppercase leading-[1.15] tracking-[0.06em] text-rose">A simpler path to the right next step.</h2>
          </div>
          <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <li key={step.label} className="relative border-t border-ink/15 bg-white p-6">
                <span className="mb-8 inline-flex h-10 w-10 items-center justify-center rounded-full border border-rose bg-white text-sm font-bold text-rose">
                  {index + 1}
                </span>
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-ink/70">{step.label}</p>
                <h3 className="mb-3 text-lg font-semibold leading-snug text-ink">{step.title}</h3>
                <p className="text-sm leading-[1.75] text-ink/65">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-[clamp(4rem,8vw,7rem)]">
        <div className="mx-auto grid max-w-[1160px] gap-10 px-5 md:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div>
            <p className="mb-4 text-sm font-normal italic text-ink">Clear expectations</p>
            <h2 className="mb-5 text-[clamp(2rem,4vw,3rem)] font-bold uppercase leading-[1.15] tracking-[0.06em] text-rose">Understand the investment before you commit.</h2>
          </div>
          <div className="border-t border-ink/15 bg-white py-7 md:p-9">
            <p className="mb-5 text-lg leading-[1.75] text-ink/80">
              Program cost depends on the care plan, medication choice, labs, and follow-up needs. During your medical qualification consultation, Rella will explain the applicable options and costs before you decide.
            </p>
            <p className="text-sm leading-[1.75] text-ink/60">
              Individual results vary. Prescription treatment is offered only when clinically appropriate after evaluation. Compounded medications are not FDA approved, and FDA does not review them for safety, effectiveness, or quality before marketing. Availability and treatment options may change.
            </p>
          </div>
        </div>
      </section>

      <section id="weight-loss-faq" className="scroll-mt-24 bg-ink/[0.03] py-[clamp(4rem,8vw,7rem)]">
        <div className="mx-auto max-w-[1000px] px-5 md:px-8">
          <div className="mb-10">
            <p className="mb-4 text-sm font-normal italic text-ink">Questions, answered</p>
            <h2 className="text-[clamp(2rem,4vw,3rem)] font-bold uppercase leading-[1.15] tracking-[0.06em] text-rose">Medical weight-loss FAQ</h2>
          </div>
          <FaqAccordion items={[...faq]} />
        </div>
      </section>

      <section id="consultation-options" className="scroll-mt-24 bg-rose py-[clamp(4rem,8vw,7rem)]">
        <div className="mx-auto max-w-[1160px] px-5 md:px-8">
          <div className="mx-auto mb-12 max-w-[760px] text-center">
            <p className="mb-4 text-sm font-normal italic text-white">Choose your clinic</p>
            <h2 className="mb-5 text-[clamp(2rem,4vw,3rem)] font-bold uppercase leading-[1.15] tracking-[0.06em] text-white">Choose your clinic and book your qualification call.</h2>
            <p className="text-lg font-light leading-[1.75] text-white/90">
              Select Napa or Vacaville to see live times for your 30-minute phone consultation with Dr. Wagner. There is one clear next step and no card is required.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {locationOptions.map((option) => <LocationCard key={option.slug} option={option} />)}
          </div>
          <p className="mx-auto mt-8 max-w-[760px] text-center text-sm leading-[1.75] text-white/80">
            If medication is not right for you, Dr. Wagner will tell you plainly and discuss other medically appropriate paths.
          </p>
        </div>
      </section>

      <section className="bg-rose py-[clamp(4rem,8vw,6rem)] text-center text-white">
        <div className="mx-auto max-w-[760px] px-6">
          <p className="mb-4 text-sm font-normal italic text-white">The next step is medical qualification</p>
          <h2 className="mb-5 text-[clamp(2rem,4vw,3rem)] font-bold uppercase leading-[1.15] tracking-[0.06em]">Find out if you medically qualify.</h2>
          <p className="mb-8 text-lg font-light leading-[1.75] text-white/70">
            Choose the Rella clinic that is most convenient for your consultation and follow-up.
          </p>
          <Button
            href="#consultation-options"
            disableHover
            className="!border-white !bg-white !text-rose"
            data-cta="booking-flow-start"
          >
            Choose Napa or Vacaville
          </Button>
        </div>
      </section>

    </>
  );
}
