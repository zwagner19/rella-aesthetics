import Image from "next/image";
import Link from "next/link";
import {
  napaHouseIdentity,
  napaHouseOfferings,
  napaHousePeople,
  napaHousePractical,
  napaHouseVisuals,
} from "@/content/napa-house";
import { NapaHouseBookCta } from "./NapaHouseBookCta";

/**
 * Napa House PLACE page — hospitality × beauty editorial × Rella.
 * Additive location-page surface; does not alter homepage or treatment systems.
 */
export function NapaHousePage() {
  const { reception, teamStorefront } = napaHouseVisuals;
  const primaryPeople = napaHousePeople.filter((person) => person.presence !== "also");
  const alsoPeople = napaHousePeople.filter((person) => person.presence === "also");

  return (
    <>
      {/* 1. Hero */}
      <section className="relative -mt-[72px] flex min-h-[100svh] items-end overflow-hidden bg-charcoal text-white lg:-mt-[84px]">
        <Image
          src={reception.src}
          alt={reception.alt}
          fill
          priority
          unoptimized
          className="object-cover object-[center_28%]"
          sizes="100vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-charcoal/20"
          aria-hidden="true"
        />
        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 pb-16 pt-32 md:px-8 md:pb-24 lg:px-12 lg:pb-28">
          <p className="mb-4 text-[0.6875rem] font-medium uppercase tracking-[0.28em] text-rose">
            {napaHouseIdentity.brand}
          </p>
          <h1 className="max-w-[14ch] text-[clamp(2.4rem,6.5vw,4.75rem)] font-medium leading-[1.05] tracking-[-0.03em] text-white">
            Welcome to Napa House.
          </h1>
          <p className="mt-6 max-w-[28rem] text-base font-light leading-relaxed text-white/85 md:text-lg">
            A calm downtown house for consultation-led aesthetics and wellness —
            hospitality first, treatment second.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3 sm:gap-4">
            <NapaHouseBookCta className="rella-cta-rect rella-cta-rect--filled">
              Book Napa
            </NapaHouseBookCta>
            <a
              href="#arrival"
              className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-white/85 underline-offset-4 hover:text-white hover:underline"
            >
              Explore the House ↓
            </a>
          </div>
        </div>
      </section>

      {/* 2. Arrival — large + small, not an equal gallery */}
      <section
        id="arrival"
        className="rella-site-reveal scroll-mt-28 bg-ivory py-20 md:py-28"
        aria-labelledby="napa-arrival-heading"
      >
        <div className="mx-auto max-w-[1440px] px-6 md:px-8 lg:px-12">
          <div className="mb-12 max-w-[22rem] md:mb-16">
            <h2
              id="napa-arrival-heading"
              className="text-[clamp(1.85rem,4vw,3.1rem)] font-medium leading-[1.12] tracking-[-0.02em] text-ink"
            >
              Come in. Stay awhile.
            </h2>
            <p className="mt-5 text-base font-light leading-relaxed text-silver md:text-lg">
              Soft light, unhurried greetings, and a pace that feels more like a
              house visit than a clinic stop.
            </p>
          </div>

          <div className="grid items-end gap-5 md:grid-cols-12 md:gap-8">
            <div className="relative aspect-[4/5] overflow-hidden bg-oat md:col-span-7 md:aspect-[5/6]">
              <Image
                src={reception.src}
                alt={reception.alt}
                fill
                unoptimized
                className="object-cover object-center"
                sizes="(min-width: 768px) 58vw, 100vw"
              />
            </div>
            <div className="md:col-span-5 md:pb-16">
              <div className="relative aspect-[3/4] overflow-hidden bg-oat md:max-w-[320px]">
                <Image
                  src={teamStorefront.src}
                  alt={teamStorefront.alt}
                  fill
                  unoptimized
                  className="object-cover object-center"
                  sizes="(min-width: 768px) 22vw, 70vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Experience — relationship story, no numbering */}
      <section
        className="rella-site-reveal border-y border-rule/50 bg-ivory py-24 md:py-32"
        aria-labelledby="napa-experience-heading"
      >
        <div className="mx-auto max-w-[880px] px-6 md:px-8">
          <p className="rella-editorial-eyebrow mb-8">The experience</p>
          <h2
            id="napa-experience-heading"
            className="max-w-[20ch] text-[clamp(1.85rem,4.2vw,3.25rem)] font-medium leading-[1.15] tracking-[-0.02em] text-ink"
          >
            A visit built around how you want to feel.
          </h2>
          <div className="mt-8 max-w-[38rem] space-y-5 text-base font-light leading-relaxed text-silver md:text-lg">
            <p>
              You&apos;re met by a familiar front desk, then a real conversation
              about your face, your goals, and what would actually help — not a
              rushed menu of add-ons.
            </p>
            <p>
              The clinical work happens inside that relationship: clear options,
              honest guidance, and a plan you can return to over time.
            </p>
          </div>
        </div>
      </section>

      {/* 4. What happens here — links only, no service cards */}
      <section
        className="rella-site-reveal bg-ivory py-20 md:py-28"
        aria-labelledby="napa-offerings-heading"
      >
        <div className="mx-auto max-w-[1440px] px-6 md:px-8 lg:px-12">
          <div className="mb-12 max-w-[32rem] md:mb-14">
            <p className="rella-editorial-eyebrow mb-4">What happens here</p>
            <h2
              id="napa-offerings-heading"
              className="text-[clamp(1.85rem,4vw,3.1rem)] font-medium leading-[1.12] tracking-[-0.02em] text-ink"
            >
              Care available at Napa House.
            </h2>
            <p className="mt-5 text-base font-light leading-relaxed text-silver md:text-lg">
              Education pages for each category — availability and fit are
              confirmed in consultation.
            </p>
          </div>

          <ul className="border-t border-rule" role="list">
            {napaHouseOfferings.map((offering) => (
              <li key={offering.slug} className="border-b border-rule">
                <Link
                  href={offering.href}
                  className="group flex items-baseline justify-between gap-6 py-6 transition-colors md:py-7"
                >
                  <span className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-8">
                    <span className="text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-silver sm:w-28">
                      {offering.category}
                    </span>
                    <span className="text-xl font-medium tracking-[-0.01em] text-ink group-hover:text-rose md:text-2xl">
                      {offering.title}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-sm text-ink/35 transition-colors group-hover:text-rose"
                  >
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 5. People — concise, no bios */}
      <section
        className="rella-site-reveal bg-ivory py-20 md:py-28"
        aria-labelledby="napa-people-heading"
      >
        <div className="mx-auto max-w-[1440px] px-6 md:px-8 lg:px-12">
          <div className="mb-12 max-w-[28rem]">
            <p className="rella-editorial-eyebrow mb-4">The people</p>
            <h2
              id="napa-people-heading"
              className="text-[clamp(1.85rem,4vw,3.1rem)] font-medium leading-[1.12] tracking-[-0.02em] text-ink"
            >
              Who you&apos;ll meet here.
            </h2>
          </div>

          <ul
            className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            role="list"
          >
            {primaryPeople.map((person) => (
              <li key={person.name}>
                <div className="relative mb-4 aspect-[3/4] overflow-hidden bg-oat">
                  <Image
                    src={person.image}
                    alt=""
                    fill
                    unoptimized
                    className="object-cover object-top"
                    sizes="(min-width: 1280px) 20vw, (min-width: 640px) 40vw, 100vw"
                  />
                </div>
                <p className="text-sm font-medium text-ink">{person.name}</p>
                <p className="mt-1 text-xs font-light uppercase tracking-[0.12em] text-silver">
                  {person.role}
                </p>
              </li>
            ))}
          </ul>

          {alsoPeople.length > 0 ? (
            <ul className="mt-12 flex flex-wrap gap-x-10 gap-y-4 border-t border-rule pt-8" role="list">
              {alsoPeople.map((person) => (
                <li key={person.name}>
                  <p className="text-sm font-medium text-ink">{person.name}</p>
                  <p className="mt-1 text-xs font-light uppercase tracking-[0.12em] text-silver">
                    {person.role}
                  </p>
                </li>
              ))}
            </ul>
          ) : null}

          <div className="mt-10">
            <Link
              href="/team#team-location-napa"
              className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-ink underline-offset-4 hover:text-rose hover:underline"
            >
              Full team directory
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Editorial photo — asymmetrical */}
      <section
        className="rella-site-reveal bg-ivory py-10 md:py-16"
        aria-label="Napa House editorial photograph"
      >
        <div className="mx-auto max-w-[1440px] px-6 md:px-8 lg:px-12">
          <div className="grid md:grid-cols-12">
            <div className="relative aspect-[16/10] overflow-hidden bg-oat md:col-span-10 md:col-start-2 lg:col-span-9 lg:col-start-3">
              <Image
                src={teamStorefront.src}
                alt={teamStorefront.alt}
                fill
                unoptimized
                className="object-cover object-center"
                sizes="(min-width: 1024px) 70vw, 100vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 7. Why Napa — one restrained moment */}
      <section
        className="rella-site-reveal bg-ivory py-20 md:py-28"
        aria-labelledby="napa-why-heading"
      >
        <div className="mx-auto max-w-[720px] px-6 md:px-8">
          <p className="rella-editorial-eyebrow mb-6">Why Napa</p>
          <h2
            id="napa-why-heading"
            className="text-[clamp(1.75rem,3.8vw,2.75rem)] font-medium leading-[1.15] tracking-[-0.02em] text-ink"
          >
            Downtown Napa, same Rella standard.
          </h2>
          <p className="mt-6 max-w-[34rem] text-base font-light leading-relaxed text-silver md:text-lg">
            Napa House is our valley address — a quieter setting for the same
            consultation-led care guests know from Rella.
          </p>
        </div>
      </section>

      {/* 8. Practical — verified only; no parking */}
      <section
        className="rella-site-reveal border-t border-rule/50 bg-ivory py-20 md:py-28"
        aria-labelledby="napa-practical-heading"
      >
        <div className="mx-auto grid max-w-[1440px] gap-14 px-6 md:px-8 lg:grid-cols-2 lg:gap-20 lg:px-12">
          <div>
            <p className="rella-editorial-eyebrow mb-4">Visit</p>
            <h2
              id="napa-practical-heading"
              className="text-[clamp(1.85rem,4vw,3.1rem)] font-medium leading-[1.12] tracking-[-0.02em] text-ink"
            >
              Practical details.
            </h2>
          </div>

          <div className="grid gap-10 sm:grid-cols-2">
            <address className="not-italic">
              <p className="text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-silver">
                Address
              </p>
              <p className="mt-3 text-lg font-medium text-ink">
                {napaHousePractical.addressLine}
              </p>
              <p className="mt-1 text-base font-light text-silver">
                {napaHousePractical.cityStateZip}
              </p>
              <a
                href={`tel:${napaHousePractical.phoneTel}`}
                className="mt-5 inline-flex min-h-11 items-center text-base font-medium text-ink underline-offset-4 hover:text-rose hover:underline"
              >
                {napaHousePractical.phoneDisplay}
              </a>
            </address>

            <div>
              <p className="text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-silver">
                Hours
              </p>
              <ul className="mt-3 space-y-2">
                {napaHousePractical.hours.map((line) => (
                  <li key={line} className="text-base font-light text-ink">
                    {line}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap gap-3 sm:col-span-2">
              <NapaHouseBookCta className="rella-cta-rect rella-cta-rect--filled">
                Book Napa
              </NapaHouseBookCta>
              <a
                href={napaHousePractical.mapUrl}
                target="_blank"
                rel="noreferrer"
                className="rella-cta-rect rella-cta-rect--ghost"
              >
                Get directions
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Final CTA */}
      <section
        className="rella-site-reveal relative overflow-hidden bg-charcoal py-28 text-white md:py-36"
        aria-labelledby="napa-final-cta-heading"
      >
        <Image
          src={reception.src}
          alt=""
          fill
          unoptimized
          className="object-cover object-center opacity-30"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-charcoal/60" aria-hidden="true" />
        <div className="relative z-10 mx-auto max-w-[720px] px-6 text-center md:px-8">
          <h2
            id="napa-final-cta-heading"
            className="text-[clamp(1.95rem,4.5vw,3.35rem)] font-medium leading-[1.12] tracking-[-0.02em]"
          >
            We&apos;ll see you at the House.
          </h2>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <NapaHouseBookCta className="rella-cta-rect rella-cta-rect--filled">
              Book Napa House
            </NapaHouseBookCta>
            <Link href="/services" className="rella-cta-rect rella-cta-rect--ghost-light">
              Explore treatments
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
