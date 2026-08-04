import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { resolveBookingHref } from "@/lib/booking-routes";
import { physicianOwnerSchema } from "@/lib/schemas";

export const metadata: Metadata = {
  title: "About Dr. Zachary Wagner & Rella Aesthetics",
  description:
    "Meet Zachary Wagner, DO, physician owner of Rella Aesthetics and an American Board of Obesity Medicine diplomate serving Vacaville and Napa.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Dr. Zachary Wagner | Rella Aesthetics",
    description:
      "Physician-owned aesthetic and medical weight-management care in Vacaville and Napa, California.",
    url: "/about",
    images: [
      {
        url: "/images/dr-zachary-wagner.jpg",
        alt: "Zachary Wagner, DO, physician owner of Rella Aesthetics",
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

      <section className="overflow-hidden bg-rose-blush">
        <div className="mx-auto grid max-w-[1200px] gap-12 px-6 py-16 md:px-8 md:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-20 lg:px-12">
          <div>
            <p className="mb-5 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-dark">
              Physician-owned · Vacaville + Napa
            </p>
            <h1 className="mb-6 max-w-[720px] text-4xl font-medium leading-[1.04] tracking-[-0.045em] text-ink md:text-6xl">
              Care built on judgment, honesty, and the right next step.
            </h1>
            <p className="mb-7 max-w-[650px] text-lg font-light leading-relaxed text-silver md:text-xl">
              Rella Aesthetics brings aesthetic care and medical weight management together in a warm, local practice led by physician owner Dr. Zachary Wagner.
            </p>
            <div className="mb-8 border-l-2 border-rose pl-5">
              <p className="font-medium text-silver-dark">Zachary Wagner, DO</p>
              <p className="mt-1 text-sm leading-relaxed text-silver">
                Physician Owner · American Board of Obesity Medicine diplomate
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button href={resolveBookingHref({})}>Book a Consultation</Button>
              <Button href="tel:+17073582928" variant="ghost">
                Call 707.358.2928
              </Button>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[500px] lg:mx-0">
            <div className="absolute -inset-5 translate-x-5 translate-y-5 rounded-[2rem] border border-rose-light/80" aria-hidden="true" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-white shadow-[0_24px_70px_rgba(90,94,98,0.14)]">
              <Image
                src="/images/dr-zachary-wagner.jpg"
                alt="Zachary Wagner, DO, physician owner of Rella Aesthetics"
                fill
                priority
                className="object-cover object-top"
                sizes="(min-width: 1024px) 500px, 90vw"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 via-ink/35 to-transparent px-6 pb-6 pt-20 text-white md:px-8 md:pb-8">
                <p className="text-lg font-medium">Dr. Zachary Wagner</p>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-white/75">Physician Owner</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="mx-auto grid max-w-[1200px] gap-10 px-6 md:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-12">
          <div>
            <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-dark">The Rella standard</p>
            <h2 className="text-3xl font-medium leading-tight tracking-[-0.035em] text-ink md:text-5xl">
              The best plan starts with a real conversation.
            </h2>
          </div>
          <div>
            <p className="mb-5 text-lg font-light leading-relaxed text-silver">
              Rella is built around a simple idea: people should feel heard before they are asked to make a decision. That means beginning with the goal, explaining the options plainly, and recommending only the next step that makes sense for the individual.
            </p>
            <p className="leading-relaxed text-silver">
              From aesthetic treatments to physician-led weight management, the practice combines medical judgment with an experience designed to feel clear, respectful, and personal.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {careAreas.map((area) => (
                <span key={area} className="rounded-full border border-silver-pale bg-silver-pale/60 px-4 py-2 text-xs font-medium text-silver-dark">
                  {area}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-silver-pale/60 py-20 md:py-28">
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12">
          <div className="mb-12 max-w-[720px]">
            <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-dark">How Rella approaches care</p>
            <h2 className="text-3xl font-medium tracking-[-0.035em] text-ink md:text-5xl">Four principles behind every patient experience.</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {values.map((value) => (
              <article key={value.number} className="rounded-[1.5rem] border border-white bg-white p-7 shadow-[0_12px_40px_rgba(90,94,98,0.05)] md:p-8">
                <p className="mb-8 text-xs font-bold tracking-[0.18em] text-rose-dark">{value.number}</p>
                <h3 className="mb-3 text-xl font-medium tracking-[-0.02em] text-ink">{value.title}</h3>
                <p className="leading-relaxed text-silver">{value.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="mx-auto grid max-w-[1200px] gap-6 px-6 md:grid-cols-2 md:px-8 lg:px-12">
          <Link href="/locations/vacaville" className="group rounded-[1.5rem] border border-silver-pale p-7 transition-colors hover:border-rose-light hover:bg-rose-blush/40 md:p-9">
            <p className="mb-3 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-dark">Vacaville</p>
            <h2 className="mb-3 text-2xl font-medium text-ink">542 Main Street</h2>
            <p className="text-sm text-silver">Explore the clinic, hours, services, and directions <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span></p>
          </Link>
          <Link href="/locations/napa" className="group rounded-[1.5rem] border border-silver-pale p-7 transition-colors hover:border-rose-light hover:bg-rose-blush/40 md:p-9">
            <p className="mb-3 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-dark">Napa</p>
            <h2 className="mb-3 text-2xl font-medium text-ink">1541 3rd Street</h2>
            <p className="text-sm text-silver">Explore the clinic, hours, services, and directions <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span></p>
          </Link>
        </div>
      </section>

      <section className="bg-ink py-16 text-white md:py-20">
        <div className="mx-auto flex max-w-[900px] flex-col items-center px-6 text-center">
          <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-light">Start with clarity</p>
          <h2 className="mb-5 text-3xl font-medium tracking-[-0.035em] md:text-5xl">Tell us what you want to work on.</h2>
          <p className="mb-8 max-w-[650px] font-light leading-relaxed text-white/70 md:text-lg">
            Choose a live booking time or contact the team with a question. We&apos;ll help you find the most appropriate next step.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href={resolveBookingHref({})}>Book a Consultation</Button>
            <Button href="/contact" className="border border-white/30 bg-transparent hover:bg-white/10">
              Ask a Question
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
