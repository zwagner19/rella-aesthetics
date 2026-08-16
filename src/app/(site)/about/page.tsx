import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { resolveBookingHref } from "@/lib/booking-routes";
import { physicianOwnerSchema } from "@/lib/schemas";

export const metadata: Metadata = {
  title: "About Rella Aesthetics & Dr. Zachary Wagner",
  description:
    "Meet Dr. Zachary Wagner, founder and owner of Rella Aesthetics and Rella's medical weight-loss physician, serving Vacaville and Napa.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Dr. Zachary Wagner | Rella Aesthetics",
    description:
      "Meet Rella Aesthetics founder and owner Dr. Zachary Wagner and the practice serving Vacaville and Napa, California.",
    url: "/about",
    images: [
      {
        url: "/images/dr-zachary-wagner.jpg",
        alt: "Zachary Wagner, DO, founder and owner of Rella Aesthetics",
      },
    ],
  },
};

const values = [
  {
    number: "01",
    title: "Listen before recommending",
    description:
      "Your goals, history, comfort level, and questions should shape the conversation before a treatment plan takes shape.",
  },
  {
    number: "02",
    title: "Make the next step clear",
    description:
      "You deserve to understand the options, tradeoffs, and applicable costs before deciding what is right for you.",
  },
  {
    number: "03",
    title: "Keep care personal",
    description:
      "Rella serves two local communities while keeping the experience warm, thoughtful, and centered on the individual.",
  },
  {
    number: "04",
    title: "Aim for results that fit you",
    description:
      "The goal is not a one-size-fits-all transformation. It is a considered plan aligned with your priorities and appropriate care.",
  },
];

const careAreas = [
  "Injectable treatments",
  "Skin and laser services",
  "Medical weight management",
  "Wellness consultations",
];

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(physicianOwnerSchema()).replace(/</g, "\\u003c"),
        }}
      />

      <section className="overflow-hidden bg-rose">
        <div className="mx-auto grid max-w-[1200px] gap-14 px-6 py-20 md:px-8 md:py-28 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-24 lg:px-12">
          <div>
            <p className="mb-5 text-[0.75rem] font-medium capitalize italic tracking-[0.08em] text-ink">
              Locally owned · Vacaville + Napa
            </p>
            <h1 className="mb-7 max-w-[720px] text-4xl font-bold uppercase leading-[1.04] tracking-[0.06em] text-white md:text-6xl">
              Care built on judgment, honesty, and the right next step.
            </h1>
            <p className="mb-7 max-w-[650px] text-lg font-light leading-relaxed text-ink/70 md:text-xl">
              Rella Aesthetics brings aesthetic care and medical weight management together under
              founder and owner Dr. Zachary Wagner. Dr. Wagner is Rella&apos;s medical weight-loss
              physician; Rella&apos;s aesthetics services are delivered by the aesthetics team.
            </p>
            <div className="mb-8 border-l-2 border-rose pl-5">
              <p className="font-medium text-white">Dr. Zachary Wagner, DO</p>
              <p className="mt-1 text-sm leading-relaxed text-ink/70">
                Founder &amp; Owner · Medical Weight-Loss Physician
              </p>
              <p className="mt-3 text-sm leading-relaxed text-ink/70">
                Dr. Wagner does not perform aesthetic treatments or injections.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                href={resolveBookingHref({})}
                className="!border-white !bg-rose !text-white hover:!border-white hover:!bg-rose hover:!text-white"
              >
                Book a Consultation
              </Button>
              <Button
                href="tel:+17073582928"
                variant="ghost"
                className="!border-rose !bg-white !text-rose hover:!bg-rose hover:!text-white"
              >
                Call 707.358.2928
              </Button>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[500px] lg:mx-0">
            <div className="absolute -inset-5 border border-rose/70" aria-hidden="true" />
            <div className="relative aspect-[4/5] overflow-hidden bg-white">
              <Image
                src="/images/dr-zachary-wagner.jpg"
                alt="Zachary Wagner, DO, founder and owner of Rella Aesthetics"
                fill
                priority
                className="object-cover object-top"
                sizes="(min-width: 1024px) 500px, 90vw"
              />
              <div className="absolute inset-x-0 bottom-0 bg-ink/90 px-6 py-5 text-white md:px-8 md:py-6">
                <p className="text-lg font-medium">Dr. Zachary Wagner</p>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-white/75">
                  Founder &amp; Owner · Medical Weight-Loss Physician
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="mx-auto grid max-w-[1200px] gap-10 px-6 md:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-12">
          <div>
            <p className="mb-4 text-[0.75rem] font-medium capitalize italic tracking-[0.08em] text-ink">The Rella standard</p>
            <h2 className="text-3xl font-bold uppercase leading-tight tracking-[0.06em] text-rose md:text-5xl">
              The best plan starts with a real conversation.
            </h2>
            <div className="relative mt-8 aspect-[4/3] overflow-hidden bg-rose-blush">
              <Image
                src="/images/clinic/rella-consultation.webp"
                alt="A Rella Aesthetics provider speaking with a patient during a consultation"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 440px, 90vw"
              />
            </div>
          </div>
          <div>
            <p className="mb-5 text-lg font-light leading-relaxed text-ink/70">
              Rella is built around a simple idea: people should feel heard before they are asked to make a decision. That means beginning with the goal, explaining the options plainly, and recommending only the next step that makes sense for the individual.
            </p>
            <p className="leading-relaxed text-ink/70">
              Rella&apos;s aesthetics team provides aesthetic treatments, while Dr. Wagner leads
              medical weight-loss care. Across both areas, the practice is designed to feel clear,
              respectful, and personal.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {careAreas.map((area) => (
                <span
                  key={area}
                  className="border-[1.5px] border-rose bg-white px-4 py-3 text-xs font-bold uppercase tracking-[0.08em] text-rose"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-silver/20 bg-rose py-16 md:py-20">
        <div className="mx-auto flex max-w-[1120px] flex-col gap-8 px-6 md:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-12">
          <div className="max-w-[700px]">
            <p className="mb-3 text-[0.75rem] font-medium capitalize italic tracking-[0.08em] text-ink">
              The people behind Rella
            </p>
            <h2 className="text-3xl font-bold uppercase tracking-[0.06em] text-white md:text-4xl">
              Meet the people behind Rella.
            </h2>
            <p className="mt-4 leading-relaxed text-ink/70">
              Get to know Rella&apos;s leadership and care team serving Vacaville and Napa.
            </p>
          </div>
          <Button
            href="/team"
            variant="ghost"
            className="shrink-0 !border-rose !bg-white !text-rose hover:!bg-rose hover:!text-white"
          >
            Meet the Team
          </Button>
        </div>
      </section>

      <section className="bg-rose py-20 text-white md:py-28">
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12">
          <div className="mb-12 max-w-[720px]">
            <p className="mb-4 text-[0.75rem] font-medium capitalize italic tracking-[0.08em] text-ink">How Rella approaches care</p>
            <h2 className="text-3xl font-bold uppercase tracking-[0.06em] text-white md:text-5xl">Four principles behind every patient experience.</h2>
          </div>
          <div className="grid gap-px bg-white/45 md:grid-cols-2">
            {values.map((value) => (
              <article key={value.number} className="border-l-2 border-l-white/45 bg-rose p-7 md:p-9">
                <p className="mb-8 text-xs font-bold tracking-[0.18em] text-white">{value.number}</p>
                <h3 className="mb-3 text-xl font-bold uppercase tracking-[0.06em] text-white">{value.title}</h3>
                <p className="leading-relaxed text-white">{value.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="mx-auto grid max-w-[1200px] gap-6 px-6 md:grid-cols-2 md:px-8 lg:px-12">
          <Link href="/locations/vacaville" className="group border-y border-silver-pale p-7 transition-colors hover:border-rose md:p-9">
            <p className="mb-3 text-[0.75rem] font-medium capitalize italic tracking-[0.08em] text-ink">Vacaville</p>
            <h2 className="mb-3 text-2xl font-bold uppercase tracking-[0.06em] text-rose">542 Main Street</h2>
            <p className="text-sm text-ink/70">Explore the clinic, hours, services, and directions <span aria-hidden="true">→</span></p>
          </Link>
          <Link href="/locations/napa" className="group border-y border-silver-pale p-7 transition-colors hover:border-rose md:p-9">
            <p className="mb-3 text-[0.75rem] font-medium capitalize italic tracking-[0.08em] text-ink">Napa</p>
            <h2 className="mb-3 text-2xl font-bold uppercase tracking-[0.06em] text-rose">1541 3rd Street</h2>
            <p className="text-sm text-ink/70">Explore the clinic, hours, services, and directions <span aria-hidden="true">→</span></p>
          </Link>
        </div>
      </section>

      <section className="bg-rose py-16 text-white md:py-20">
        <div className="mx-auto flex max-w-[900px] flex-col items-center px-6 text-center">
          <p className="mb-4 text-[0.75rem] font-medium capitalize italic tracking-[0.08em] text-ink">Start with clarity</p>
          <h2 className="mb-5 text-3xl font-bold uppercase tracking-[0.06em] md:text-5xl">Tell us what you want to work on.</h2>
          <p className="mb-8 max-w-[650px] font-light leading-relaxed text-white md:text-lg">
            Choose a live booking time or contact the team with a question. We&apos;ll help you find the most appropriate next step.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              href={resolveBookingHref({})}
              className="!border-white !bg-transparent !text-white hover:!border-white hover:!bg-transparent hover:!text-white"
            >
              Book a Consultation
            </Button>
            <Button
              href="tel:+17073582928"
              className="!border-white !bg-white !text-rose hover:!border-white hover:!bg-white hover:!text-rose"
            >
              Call Rella
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
