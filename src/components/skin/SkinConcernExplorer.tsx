"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { SKIN_CONCERNS, type SkinConcern } from "@/lib/skin-category";

export function SkinConcernExplorer() {
  const [activeId, setActiveId] = useState(SKIN_CONCERNS[0].id);
  const active =
    SKIN_CONCERNS.find((concern) => concern.id === activeId) ??
    SKIN_CONCERNS[0];

  return (
    <section
      id="explore-by-concern"
      className="rella-site-reveal scroll-mt-28 bg-ivory py-24 md:py-32"
      aria-labelledby="skin-concerns-heading"
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-8 lg:px-12">
        <p className="rella-editorial-eyebrow mb-6">Explore by concern</p>
        <h2
          id="skin-concerns-heading"
          className="max-w-[18ch] text-[clamp(1.85rem,4.2vw,3.25rem)] font-medium leading-[1.12] tracking-[-0.02em] text-ink"
        >
          Name the concern. We&apos;ll name the options.
        </h2>
        <p className="mt-6 max-w-[36rem] text-base font-light leading-relaxed text-silver md:text-lg">
          Possible treatments below are drawn from Rella&apos;s published skin-care menu — and
          from Lasers where pigment or texture overlap is verified. Not every option fits every
          skin.
        </p>

        <div className="mt-16 grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:gap-20">
          <ul className="space-y-0 border-t border-rule" role="list">
            {SKIN_CONCERNS.map((concern) => (
              <ConcernRow
                key={concern.id}
                concern={concern}
                active={concern.id === active.id}
                onSelect={() => setActiveId(concern.id)}
              />
            ))}
          </ul>

          <div className="lg:sticky lg:top-28">
            <div className="relative aspect-[4/5] overflow-hidden bg-oat md:aspect-[5/6]">
              <Image
                key={active.id}
                src={active.image}
                alt={active.imageAlt}
                fill
                className={`object-cover transition-opacity duration-500 ${active.imagePosition ?? "object-center"}`}
                sizes="(min-width: 1024px) 42vw, 100vw"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-charcoal/75 via-charcoal/15 to-transparent"
                aria-hidden="true"
              />
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                <p className="text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-rose">
                  Possible next step
                </p>
                <p className="mt-3 text-xl font-medium tracking-[-0.02em] text-white md:text-2xl">
                  {active.label}
                </p>
                <p className="mt-3 max-w-[28rem] text-sm font-light leading-relaxed text-white/80 md:text-base">
                  {active.summary}
                </p>
                <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                  {active.possibleTreatments.map((treatment) => (
                    <Link
                      key={treatment.name}
                      href={treatment.href}
                      className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-white underline decoration-white/40 underline-offset-4 transition-colors hover:decoration-white"
                    >
                      {treatment.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ConcernRow({
  concern,
  active,
  onSelect,
}: {
  concern: SkinConcern;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <li className="border-b border-rule">
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={active}
        className="group flex w-full items-baseline justify-between gap-6 py-7 text-left transition-colors md:py-8"
      >
        <span
          className={`text-[1.15rem] font-medium leading-snug tracking-[-0.015em] md:text-xl ${
            active ? "text-ink" : "text-silver group-hover:text-ink"
          }`}
        >
          {concern.label}
        </span>
        <span
          className={`shrink-0 text-[0.6875rem] font-medium uppercase tracking-[0.22em] transition-opacity ${
            active ? "text-rose opacity-100" : "text-silver opacity-0 group-hover:opacity-60"
          }`}
          aria-hidden="true"
        >
          View
        </span>
      </button>
      {active ? (
        <div className="pb-8 lg:hidden">
          <p className="max-w-[34rem] text-base font-light leading-relaxed text-silver">
            {concern.summary}
          </p>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
            {concern.possibleTreatments.map((treatment) => (
              <Link
                key={treatment.name}
                href={treatment.href}
                className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-ink underline decoration-rule underline-offset-4"
              >
                {treatment.name}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </li>
  );
}
