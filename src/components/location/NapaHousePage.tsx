import Image from "next/image";
import Link from "next/link";
import {
  napaHouseCategories,
  napaHouseIdentity,
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
  const { lounge, receptionInterior, treatmentRoom } = napaHouseVisuals;

  return (
    <>
      {/* 1. Hero */}
      <section className="relative -mt-[72px] flex min-h-[100svh] items-end overflow-hidden bg-charcoal text-white lg:-mt-[84px]">
        <Image
          src={lounge.src}
          alt={lounge.alt}
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
          <p className="mt-6 max-w-[26rem] text-base font-light leading-relaxed text-white/85 md:text-lg">
            Downtown Napa hospitality — consultation-led care in a house that
            feels like a pause.
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

      {/* 2. Arrival — asymmetrical; native 680×1020 capped (no upscale) */}
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
              Soft light, a familiar desk, and a pace that feels more like a
              house visit than a clinic stop.
            </p>
          </div>

          {/*
            Display capped near native width so 680px sources stay sharp.
            Dominant = reception (hospitality); supporting = treatment room.
            Mobile: dominant first, supporting offset — not an equal stack.
          */}
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:gap-10 lg:gap-14">
            <figure className="w-full max-w-[420px] md:max-w-[480px]">
              <div className="relative aspect-[2/3] overflow-hidden bg-oat">
                <Image
                  src={receptionInterior.src}
                  alt={receptionInterior.alt}
                  width={receptionInterior.nativeWidth}
                  height={receptionInterior.nativeHeight}
                  unoptimized
                  className="h-full w-full object-cover object-[center_35%]"
                  sizes="(min-width: 768px) 480px, 90vw"
                />
              </div>
            </figure>
            <figure className="w-[78%] max-w-[280px] self-end md:mb-10 md:w-full md:max-w-[300px] md:self-end lg:mb-16">
              <div className="relative aspect-[2/3] overflow-hidden bg-oat">
                <Image
                  src={treatmentRoom.src}
                  alt={treatmentRoom.alt}
                  width={treatmentRoom.nativeWidth}
                  height={treatmentRoom.nativeHeight}
                  unoptimized
                  className="h-full w-full object-cover object-center"
                  sizes="(min-width: 768px) 300px, 70vw"
                />
              </div>
            </figure>
          </div>
        </div>
      </section>

      {/* 3. Experience */}
      <section
        className="rella-site-reveal border-y border-rule/50 bg-ivory py-20 md:py-28"
        aria-labelledby="napa-experience-heading"
      >
        <div className="mx-auto max-w-[720px] px-6 md:px-8">
          <p className="rella-editorial-eyebrow mb-6">The experience</p>
          <h2
            id="napa-experience-heading"
            className="max-w-[18ch] text-[clamp(1.75rem,3.8vw,2.75rem)] font-medium leading-[1.15] tracking-[-0.02em] text-ink"
          >
            Care that starts at the front desk — and stays personal.
          </h2>
          <p className="mt-6 max-w-[36rem] text-base font-light leading-relaxed text-silver md:text-lg">
            At Napa House, the visit is a conversation first: what you want,
            what fits, and what can wait. Treatment follows that clarity —
            unhurried, in rooms that still feel like a house.
          </p>
        </div>
      </section>

      {/* 4. What happens here — categories only */}
      <section
        className="rella-site-reveal bg-ivory py-20 md:py-28"
        aria-labelledby="napa-offerings-heading"
      >
        <div className="mx-auto max-w-[1440px] px-6 md:px-8 lg:px-12">
          <div className="mb-10 max-w-[28rem] md:mb-12">
            <p className="rella-editorial-eyebrow mb-4">What happens here</p>
            <h2
              id="napa-offerings-heading"
              className="text-[clamp(1.75rem,3.8vw,2.75rem)] font-medium leading-[1.12] tracking-[-0.02em] text-ink"
            >
              At the House.
            </h2>
          </div>

          <ul className="border-t border-rule" role="list">
            {napaHouseCategories.map((category) => (
              <li key={category.label} className="border-b border-rule">
                <Link
                  href={category.href}
                  className="group flex items-baseline justify-between gap-6 py-5 transition-colors md:py-6"
                >
                  <span className="text-xl font-medium tracking-[-0.01em] text-ink group-hover:text-rose md:text-2xl">
                    {category.label}
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

      {/* 5. People — Wagner, Warda, Devyn equal weight */}
      <section
        className="rella-site-reveal bg-ivory py-20 md:py-28"
        aria-labelledby="napa-people-heading"
      >
        <div className="mx-auto max-w-[1440px] px-6 md:px-8 lg:px-12">
          <div className="mb-12 max-w-[24rem]">
            <p className="rella-editorial-eyebrow mb-4">The people</p>
            <h2
              id="napa-people-heading"
              className="text-[clamp(1.75rem,3.8vw,2.75rem)] font-medium leading-[1.12] tracking-[-0.02em] text-ink"
            >
              Who you&apos;ll meet here.
            </h2>
          </div>

          <ul
            className="grid gap-x-8 gap-y-10 sm:grid-cols-3"
            role="list"
          >
            {napaHousePeople.map((person) => (
              <li key={person.name}>
                <div className="relative mb-4 aspect-[3/4] overflow-hidden bg-oat">
                  <Image
                    src={person.image}
                    alt=""
                    fill
                    unoptimized
                    className="object-cover object-top"
                    sizes="(min-width: 640px) 28vw, 100vw"
                  />
                </div>
                <p className="text-sm font-medium text-ink">{person.name}</p>
                <p className="mt-1 text-xs font-light uppercase tracking-[0.12em] text-silver">
                  {person.role}
                </p>
              </li>
            ))}
          </ul>

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

      {/* 6. Editorial — interior, no group photo; asymmetrical, capped */}
      <section
        className="rella-site-reveal bg-ivory py-12 md:py-20"
        aria-label="Napa House treatment room"
      >
        <div className="mx-auto max-w-[1440px] px-6 md:px-8 lg:px-12">
          <div className="flex justify-end md:pr-[8%]">
            <figure className="w-full max-w-[420px] md:max-w-[520px]">
              <div className="relative aspect-[2/3] overflow-hidden bg-oat">
                <Image
                  src={treatmentRoom.src}
                  alt={treatmentRoom.alt}
                  width={treatmentRoom.nativeWidth}
                  height={treatmentRoom.nativeHeight}
                  unoptimized
                  className="h-full w-full object-cover object-[center_40%]"
                  sizes="(min-width: 768px) 520px, 90vw"
                />
              </div>
            </figure>
          </div>
        </div>
      </section>

      {/* 7. Why Napa */}
      <section
        className="rella-site-reveal bg-ivory py-20 md:py-28"
        aria-labelledby="napa-why-heading"
      >
        <div className="mx-auto max-w-[640px] px-6 md:px-8">
          <p className="rella-editorial-eyebrow mb-6">Why Napa</p>
          <h2
            id="napa-why-heading"
            className="text-[clamp(1.65rem,3.5vw,2.5rem)] font-medium leading-[1.15] tracking-[-0.02em] text-ink"
          >
            Downtown Napa, same Rella standard.
          </h2>
          <p className="mt-5 max-w-[32rem] text-base font-light leading-relaxed text-silver md:text-lg">
            A quieter valley address for the consultation-led care guests already
            trust.
          </p>
        </div>
      </section>

      {/* 8. Practical */}
      <section
        className="rella-site-reveal border-t border-rule/50 bg-ivory py-20 md:py-28"
        aria-labelledby="napa-practical-heading"
      >
        <div className="mx-auto grid max-w-[1440px] gap-14 px-6 md:px-8 lg:grid-cols-2 lg:gap-20 lg:px-12">
          <div>
            <p className="rella-editorial-eyebrow mb-4">Visit</p>
            <h2
              id="napa-practical-heading"
              className="text-[clamp(1.75rem,3.8vw,2.75rem)] font-medium leading-[1.12] tracking-[-0.02em] text-ink"
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
          src={lounge.src}
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
