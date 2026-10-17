"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  treatmentCategories,
  type TreatmentCategoryId,
} from "./treatment-categories";

export function TreatmentDiscovery() {
  const [activeId, setActiveId] = useState<TreatmentCategoryId>(treatmentCategories[0].id);
  const active =
    treatmentCategories.find((category) => category.id === activeId) ?? treatmentCategories[0];

  return (
    <section
      className="rella-site-reveal border-y border-rule/50 bg-ivory py-20 md:py-28"
      aria-labelledby="treatments-heading"
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-8 lg:px-12">
        <p className="rella-editorial-eyebrow mb-4">Explore by treatment</p>
        <h2
          id="treatments-heading"
          className="mb-12 max-w-[18ch] text-[clamp(1.75rem,3.8vw,2.75rem)] font-medium leading-[1.12] tracking-[-0.02em] text-ink md:mb-16"
        >
          Find the care that fits.
        </h2>

        {/* Desktop: 40/60 list + image swap */}
        <div className="hidden gap-10 lg:grid lg:grid-cols-[0.4fr_0.6fr] lg:items-stretch lg:gap-14">
          <ul className="flex flex-col border-t border-rule" role="list">
            {treatmentCategories.map((category) => {
              const isActive = category.id === active.id;
              return (
                <li key={category.id} className="border-b border-rule">
                  <button
                    type="button"
                    onMouseEnter={() => setActiveId(category.id)}
                    onFocus={() => setActiveId(category.id)}
                    onClick={() => setActiveId(category.id)}
                    aria-pressed={isActive}
                    className="group flex w-full flex-col items-start gap-2 py-6 text-left transition-colors"
                  >
                    <span className="flex w-full items-baseline justify-between gap-4">
                      <span className="text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-silver">
                        {category.number}
                      </span>
                      <span
                        className={`text-xl font-medium tracking-[-0.01em] md:text-2xl ${
                          isActive ? "text-ink" : "text-ink/45 group-hover:text-ink"
                        }`}
                      >
                        {category.label}
                      </span>
                    </span>
                    {isActive ? (
                      <span className="pl-10 text-sm font-light leading-relaxed text-silver">
                        {category.services.join(" · ")}
                      </span>
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="relative min-h-[520px] overflow-hidden bg-oat">
            {treatmentCategories.map((category) => (
              <Image
                key={category.id}
                src={category.image}
                alt={category.imageAlt}
                fill
                className={`rella-treatment-image object-cover object-center ${
                  category.id === active.id ? "opacity-100" : "opacity-0"
                }`}
                sizes="(min-width: 1024px) 55vw, 100vw"
                priority={category.id === treatmentCategories[0].id}
              />
            ))}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal/70 to-transparent p-8">
              <Link
                href={active.href}
                className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-white underline-offset-4 hover:underline"
              >
                Explore {active.label}
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile: vertical editorial nav — not stacked cards */}
        <nav className="lg:hidden" aria-label="Treatment categories">
          <ul className="border-t border-rule" role="list">
            {treatmentCategories.map((category) => (
              <li key={category.id} className="border-b border-rule">
                <Link
                  href={category.href}
                  className="flex items-baseline justify-between gap-4 py-6"
                >
                  <span className="text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-silver">
                    {category.number}
                  </span>
                  <span className="flex-1 text-right text-lg font-medium tracking-[-0.01em] text-ink">
                    {category.label}
                  </span>
                </Link>
                <p className="-mt-3 mb-5 text-right text-sm font-light text-silver">
                  {category.services.join(" · ")}
                </p>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
