import type { Metadata } from "next";
import Image from "next/image";
import { FaqAccordion, FaqSchema } from "@/components/blocks/FaqAccordion";
import { TrustStrip } from "@/components/blocks/TrustStrip";
import { Button } from "@/components/ui/Button";
import { ContactForm } from "@/app/(site)/contact/ContactForm";
import { CONTACT_INTENTS } from "@/lib/contact-intents";
import { withWebsiteSeo } from "@/lib/website-seo";

/**
 * Hormone & peptide wellness consult page.
 *
 * Compliance boundaries (keep them when editing copy):
 *  - The CTA is a consult request, never a product sale. No prices, doses,
 *    vial sizes, or "buy" language.
 *  - No peptide names, no claims that a compounded drug is FDA-approved or
 *    equivalent to a branded drug, and no "treats / cures / heals" claims.
 *  - Treatment is prescribed only after an evaluation, when clinically
 *    appropriate; results are not guaranteed.
 *  - The consult is with Warda Harchaoui, PA-C, under the supervision of
 *    Zachary Wagner, DO.
 */

const PATH = "/services/hormone-peptide-therapy";
const PHONE_HREF = "tel:+17073582928";
const PHONE_DISPLAY = "707.358.2928";
const FORM_ID = "consult";

const BASE_METADATA: Metadata = {
  title: "Hormone & Peptide Therapy in Vacaville & Napa, CA",
  description:
    "Hormone and peptide wellness consults with Warda Harchaoui, PA-C, under physician supervision at Rella Aesthetics in Vacaville and Napa. Baseline labs are complimentary.",
  alternates: { canonical: PATH },
  openGraph: {
    title: "Hormone & Peptide Therapy | Rella Aesthetics",
    description:
      "A wellness consult that starts with complimentary baseline labs, with Warda Harchaoui, PA-C, under physician supervision.",
    url: PATH,
    images: [{ url: "/images/team/warda-harchaoui.jpg", alt: "Warda Harchaoui, PA-C" }],
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return withWebsiteSeo(PATH, BASE_METADATA);
}

const OFFER_TERMS =
  "Complimentary baseline labs apply to new hormone and peptide wellness consults at Rella Vacaville or Napa. Your provider selects the panel. Additional tests, follow-up visits, and any treatment are priced separately and reviewed with you before you begin.";

const CONCERNS = [
  "Low energy or fatigue you want looked at",
  "Sleep, mood, or focus changes",
  "Changes in libido",
  "Perimenopause or menopause symptoms",
  "Body composition or recovery goals",
  "You want numbers, not guesses",
];

const OPTIONS = [
  {
    title: "Women's hormone therapy",
    body: "Support for perimenopause and menopause symptoms, planned around your labs, history, and goals.",
  },
  {
    title: "Testosterone therapy (TRT)",
    body: "For men whose symptoms and lab results point to low testosterone, with ongoing monitoring when treatment is started.",
  },
  {
    title: "Peptide therapy",
    body: "Prescription peptides, compounded by state-licensed pharmacies, when your provider considers them appropriate for you.",
  },
];

const STEPS = [
  {
    title: "Request your consult",
    body: "Send the short form or call us. We'll reach out to schedule at Vacaville or Napa.",
  },
  {
    title: "Get your labs drawn",
    body: "Your baseline labs are complimentary with your consult, so your plan starts from real numbers.",
  },
  {
    title: "Review your plan with Warda",
    body: "Go over your results, options, and costs together. Treatment is prescribed only if it's right for you.",
  },
];

const FAQS = [
  {
    question: "Are the labs really free?",
    answer: OFFER_TERMS,
  },
  {
    question: "Who will I see?",
    answer:
      "Your consult is with Warda Harchaoui, PA-C, who focuses on hormone optimization, testosterone replacement therapy, IV therapy, and vitamin injections. Rella's wellness care is supervised by Zachary Wagner, DO.",
  },
  {
    question: "Am I guaranteed a prescription?",
    answer:
      "No. Your provider reviews your symptoms, health history, and lab results first. If hormone or peptide therapy isn't appropriate, you'll hear that clearly, along with other next steps to consider.",
  },
  {
    question: "Are peptides FDA-approved?",
    answer:
      "Most peptides used in wellness care are not FDA-approved drugs. When a peptide is appropriate, it is prescribed for you and prepared by a state-licensed compounding pharmacy. Your provider will explain the known benefits, risks, and unknowns before you decide.",
  },
  {
    question: "How much does treatment cost?",
    answer:
      "It depends on your plan. Costs for treatment, monitoring labs, and follow-up visits are reviewed with you before you commit to anything.",
  },
  {
    question: "Which clinic can I visit?",
    answer:
      "Wellness consults are available at Rella Vacaville (542 Main St) and Rella Napa (1541 3rd St). Choose your preferred clinic on the form.",
  },
];

const headingClass =
  "break-words text-[clamp(1.75rem,8.5vw,1.875rem)] font-bold uppercase tracking-[0.035em] sm:text-3xl sm:tracking-[0.06em] md:text-5xl";

export default function HormonePeptideTherapyPage() {
  return (
    <>
      <FaqSchema items={FAQS} />

      {/* Hero: one primary action (the consult form) and one call option. */}
      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-6 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 lg:px-12">
          <div>
            <p className="mb-5 text-sm font-medium italic tracking-[0.04em] text-ink">
              Hormone &amp; Peptide Therapy &middot; Vacaville + Napa
            </p>
            <h1 className="mb-6 break-words text-[clamp(1.9rem,9vw,2.25rem)] font-bold uppercase leading-[1.04] tracking-[0.04em] text-rose-text sm:text-4xl sm:tracking-[0.08em] md:text-6xl">
              Start with your labs, not a guess.
            </h1>
            <p className="mb-6 max-w-[600px] text-lg font-light leading-relaxed text-ink/70">
              A hormone and peptide wellness consult with Warda Harchaoui, PA-C, under the supervision of
              Zachary Wagner, DO. Your baseline labs are on us.
            </p>
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-rose bg-rose-blush px-5 py-2.5 text-sm font-medium text-ink">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-rose" />
              Complimentary baseline labs with your consult
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button href={`#${FORM_ID}`} data-cta="wellness-consult-form" className="whitespace-nowrap" disableHover>
                Request my free-labs consult
              </Button>
              <Button href={PHONE_HREF} data-cta="phone" variant="ghost" className="whitespace-nowrap" disableHover>
                Call {PHONE_DISPLAY}
              </Button>
            </div>
            <p className="mt-5 max-w-[560px] text-xs font-light leading-relaxed text-silver">
              No obligation. Treatment is prescribed only if medically appropriate, at your provider&rsquo;s
              discretion. Results vary.
            </p>
          </div>
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[460px] overflow-hidden rounded-[1.5rem] bg-rose-blush">
            <Image
              src="/images/team/warda-harchaoui.jpg"
              alt="Warda Harchaoui, PA-C, Rella's hormone and wellness provider"
              fill
              loading="eager"
              className="object-cover object-top"
              sizes="(min-width: 1024px) 40vw, 100vw"
            />
            <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-white/95 px-5 py-4 shadow-[0_12px_40px_rgba(26,26,26,0.12)]">
              <p className="text-base font-medium text-ink">Warda Harchaoui, PA-C</p>
              <p className="text-sm font-light text-silver">Hormone optimization &middot; TRT &middot; Wellness</p>
            </div>
          </div>
        </div>
      </section>

      <TrustStrip
        ariaLabel="Rella wellness care principles"
        items={[
          "Physician-supervised care",
          "Complimentary baseline labs",
          "Vacaville & Napa clinics",
          "Prescribed only when appropriate",
        ]}
      />

      {/* Who it's for */}
      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-[1000px] px-6 md:px-8">
          <p className="mb-4 text-sm font-medium italic text-ink">Is this for you?</p>
          <h2 className={`${headingClass} mb-5 text-rose-text`}>Feeling off? Let&rsquo;s find out why.</h2>
          <p className="mb-9 max-w-[760px] text-lg font-light leading-relaxed text-ink/70">
            A wellness consult may be a good fit if any of these sound familiar. Your labs and history guide
            what comes next.
          </p>
          <ul className="grid gap-px bg-rose/35 sm:grid-cols-2">
            {CONCERNS.map((item) => (
              <li key={item} className="flex gap-4 bg-white p-6 text-ink">
                <span aria-hidden="true" className="font-bold text-ink">&#10003;</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-rose py-20 md:py-28">
        <div className="mx-auto max-w-[1100px] px-6 md:px-8">
          <p className="mb-4 text-sm font-medium italic text-white">How it works</p>
          <h2 className={`${headingClass} mb-10 text-white`}>Three simple steps</h2>
          <ol className="grid gap-4 md:grid-cols-3">
            {STEPS.map((step, index) => (
              <li key={step.title} className="flex flex-col gap-4 border border-white/35 bg-rose p-6 text-white">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-rose-text">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-lg font-medium">{step.title}</span>
                <span className="leading-relaxed">{step.body}</span>
              </li>
            ))}
          </ol>
          <div className="mt-10">
            <Button href={`#${FORM_ID}`} data-cta="wellness-consult-form" variant="light" disableHover>
              Request my free-labs consult
            </Button>
          </div>
        </div>
      </section>

      {/* Options */}
      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-[1100px] px-6 md:px-8">
          <p className="mb-4 text-sm font-medium italic text-ink">What we offer</p>
          <h2 className={`${headingClass} mb-10 text-rose-text`}>Care built around your results</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {OPTIONS.map((option) => (
              <article key={option.title} className="rounded-[1.25rem] border border-rose/40 bg-white p-7">
                <h3 className="mb-3 text-xl font-medium text-ink">{option.title}</h3>
                <p className="font-light leading-relaxed text-ink/70">{option.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Provider */}
      <section className="bg-rose-blush py-20 md:py-28">
        <div className="mx-auto grid max-w-[1100px] gap-10 px-6 md:px-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[300px] overflow-hidden rounded-[1.5rem] bg-white">
            <Image
              src="/images/team/warda-harchaoui.jpg"
              alt="Warda Harchaoui, PA-C"
              fill
              className="object-cover object-top"
              sizes="(min-width: 1024px) 300px, 80vw"
            />
          </div>
          <div>
            <p className="mb-4 text-sm font-medium italic text-ink">Your provider</p>
            <h2 className={`${headingClass} mb-6 text-ink`}>Meet Warda</h2>
            <p className="mb-5 text-lg font-light leading-relaxed text-ink/80">
              Warda Harchaoui, PA-C, is passionate about wellness and personalized care. She focuses on
              hormone optimization, testosterone replacement therapy, IV therapy, and vitamin injections,
              and builds each plan around the person in front of her.
            </p>
            <p className="text-base font-light leading-relaxed text-ink/70">
              Rella&rsquo;s wellness care is supervised by Zachary Wagner, DO, Rella&rsquo;s owner and
              medical director.
            </p>
          </div>
        </div>
      </section>

      {/* Consult request form */}
      <section id={FORM_ID} className="scroll-mt-24 bg-white py-20 md:py-28">
        <div className="mx-auto grid max-w-[1100px] gap-12 px-6 md:px-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="mb-4 text-sm font-medium italic text-ink">Free labs with your consult</p>
            <h2 className={`${headingClass} mb-6 text-rose-text`}>Request your consult</h2>
            <p className="mb-6 text-lg font-light leading-relaxed text-ink/70">
              Tell us a little about your goals and your preferred clinic. Our team will reach out to
              schedule your consult and lab draw.
            </p>
            <p className="mb-8 text-base font-light text-ink/70">
              Prefer to talk?{" "}
              <a className="font-medium text-ink underline" href={PHONE_HREF} data-cta="phone">
                Call {PHONE_DISPLAY}
              </a>
            </p>
            <p className="border-l-2 border-rose pl-5 text-sm leading-relaxed text-ink/70">{OFFER_TERMS}</p>
          </div>
          <div className="rounded-[1.25rem] border border-rule bg-ivory p-6 md:p-8">
            <ContactForm
              initialServiceInterest={CONTACT_INTENTS["hormone-peptide"]}
              messageLabel="What would you like help with?"
              submitLabel="Request my free-labs consult"
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-rose/25 bg-white py-20 md:py-28">
        <div className="mx-auto max-w-[1000px] px-6 md:px-8">
          <h2 className={`${headingClass} mb-10 text-rose-text`}>Hormone &amp; peptide FAQ</h2>
          <FaqAccordion items={FAQS} />
          <p className="mt-10 text-xs font-light leading-relaxed text-silver">
            Hormone and peptide therapies are prescribed only after an evaluation and when clinically
            appropriate. Compounded medications are not FDA-approved and have not been reviewed by the FDA
            for safety, effectiveness, or quality. Individual results vary and are not guaranteed.
          </p>
        </div>
      </section>

      {/* Page-owned mobile bar: the consult form replaces the generic booking bar. */}
      <nav
        aria-label="Wellness consult actions"
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-[0.38fr_0.62fr] gap-2 border-t border-rose/35 bg-white/90 p-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] text-rose backdrop-blur-sm xl:hidden"
      >
        <a
          href={PHONE_HREF}
          data-cta="phone"
          className="inline-flex min-h-12 items-center justify-center rounded-full border-[1.5px] border-rose bg-white px-3 text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-rose"
        >
          Call Rella
        </a>
        <a
          href={`#${FORM_ID}`}
          data-cta="wellness-consult-form"
          className="inline-flex min-h-12 items-center justify-center rounded-full border-[1.5px] border-rose bg-rose px-3 text-center text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-white"
        >
          Free-labs consult
        </a>
      </nav>
    </>
  );
}
