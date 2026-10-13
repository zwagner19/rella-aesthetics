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
      {/* 1. Hero — full-bleed place */}
      <section className="relative -mt-[72px] flex min-h-[100svh] items-end overflow-hidden bg-charcoal text-white lg:-mt-[84px]">
        <Image
          src={reception.src}
          alt={reception.alt}
          fill
          priority
          unoptimized
          className="object-cover object-[center_30%]"
          sizes="100vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/45 to-charcoal/25"
          aria-hidden="true"
        />
        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 pb-16 pt-32 md:px-8 md:pb-24 lg:px-12 lg:pb-28">
          <p className="mb-4 text-[0.6875rem] font-medium uppercase tracking-[0.28em] text-rose">
            {napaHouseIdentity.brand}
          </p>
          <h1 className="max-w-[12ch] text-[clamp(2.6rem,7vw,5.25rem)] font-medium leading-[1.02] tracking-[-0.03em] text-white">
            {napaHouseIdentity.placeName}
          </h1>
          <p className="mt-6 max-w-[28rem] text-base font-light leading-relaxed text-white/85 md:text-lg">
            A calm downtown house for consultation-led aesthetics and wellness —
            hospitality first, treatment second.
          </p>
          <div className="mt-10 flex flex-wrap gap-3 sm:gap-4">
            <NapaHouseBookCta className="rella-cta-rect rella-cta-rect--filled">
              Book at Napa House
            </NapaHouseBookCta>
            <a
              href={napaHousePractical.mapUrl}
              target="_blank"
              rel="noreferrer"
              className="rella-cta-rect rella-cta-rect--ghost-light"
            >
              Get directions
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. Arrival */}
      <section
        className="rella-site-reveal bg-ivory py-20 md:py-28"
        aria-labelledby="napa-arrival-heading"
      >
        <div className="mx-auto grid max-w-[1440px] items-center gap-12 px-6 md:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20 lg:px-12">
          <div>
            <p className="rella-editorial-eyebrow mb-4">Arrival</p>
            <h2
              id="napa-arrival-heading"
              className="max-w-[14ch] text-[clamp(1.85rem,4vw,3.1rem)] font-medium leading-[1.12] tracking-[-0.02em] text-ink"
            >
              Step off Third Street into a quieter pace.
            </h2>
            <p className="mt-6 max-w-[34rem] text-base font-light leading-relaxed text-silver md:text-lg">
              Napa House sits in downtown Napa — close enough to walk from the
              neighborhood, intentional enough to feel like a pause. You&apos;re
              greeted by the same Rella standard: clear guidance, no rush, and a
              plan built around you.
            </p>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden bg-oat">
            <Image
              src={reception.src}
              alt={reception.alt}
              fill
              unoptimized
              className="object-cover object-center"
              sizes="(min-width: 1024px) 45vw, 100vw"
            />
          </div>
        </div>
      </section>

      {/* 3. Experience */}
      <section
        className="rella-site-reveal border-y border-rule/50 bg-ivory py-24 md:py-32"
        aria-labelledby="napa-experience-heading"
      >
        <div className="mx-auto max-w-[880px] px-6 text-center md:px-8">
          <p className="rella-editorial-eyebrow mb-8">The experience</p>
          <h2
            id="napa-experience-heading"
            className="text-[clamp(1.85rem,4.2vw,3.25rem)] font-medium leading-[1.15] tracking-[-0.02em] text-ink"
          >
            Hospitality that makes the clinical work feel human.
          </h2>
          <p className="mx-auto mt-8 max-w-[38rem] text-base font-light leading-relaxed text-silver md:text-lg">
            Care here starts with a conversation — not a menu push. The team
            listens first, explains options plainly, and only recommends what
            fits your face, your goals, and how you want to feel when you leave.
          </p>
        </div>
      </section>

      {/* 4. What happens here */}
      <section
        className="rella-site-reveal bg-ivory py-20 md:py-28"
        aria-labelledby="napa-offerings-heading"
      >
        <div className="mx-auto max-w-[1440px] px-6 md:px-8 lg:px-12">
          <div className="mb-12 max-w-[36rem] md:mb-16">
            <p className="rella-editorial-eyebrow mb-4">What happens here</p>
            <h2
              id="napa-offerings-heading"
              className="text-[clamp(1.85rem,4vw,3.1rem)] font-medium leading-[1.12] tracking-[-0.02em] text-ink"
            >
              Care offered at Napa House.
            </h2>
            <p className="mt-5 text-base font-light leading-relaxed text-silver md:text-lg">
              Explore education pages for each category. Availability and the
              right next step are confirmed in consultation.
            </p>
          </div>

          <ul className="border-t border-rule" role="list">
            {napaHouseOfferings.map((offering) => (
              <li key={offering.slug} className="border-b border-rule">
                <Link
                  href={offering.href}
                  className="group grid gap-3 py-7 transition-colors md:grid-cols-[8rem_1fr_auto] md:items-baseline md:gap-8 md:py-8"
                >
                  <span className="text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-silver">
                    {offering.category}
                  </span>
                  <span>
                    <span className="block text-xl font-medium tracking-[-0.01em] text-ink group-hover:text-rose md:text-2xl">
                      {offering.title}
                    </span>
                    <span className="mt-2 block max-w-[36rem] text-sm font-light leading-relaxed text-silver">
                      {offering.note}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="text-sm font-medium tracking-[0.08em] text-ink/40 transition-colors group-hover:text-rose"
                  >
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 5. People */}
      <section
        className="rella-site-reveal bg-ivory py-20 md:py-28"
        aria-labelledby="napa-people-heading"
      >
        <div className="mx-auto max-w-[1440px] px-6 md:px-8 lg:px-12">
          <div className="mb-12 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:gap-16">
            <div>
              <p className="rella-editorial-eyebrow mb-4">The people</p>
              <h2
                id="napa-people-heading"
                className="max-w-[16ch] text-[clamp(1.85rem,4vw,3.1rem)] font-medium leading-[1.12] tracking-[-0.02em] text-ink"
              >
                Familiar faces at Napa House.
              </h2>
            </div>
            <p className="max-w-[32rem] text-base font-light leading-relaxed text-silver md:text-lg">
              Injectors, esthetics, medical assisting, and patient services who
              actually work here — plus physician leadership for medical weight
              loss.
            </p>
          </div>

          <ul
            className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
            role="list"
          >
            {primaryPeople.map((person) => (
              <li key={person.name}>
                <div className="relative mb-5 aspect-[3/4] overflow-hidden bg-oat">
                  <Image
                    src={person.image}
                    alt=""
                    fill
                    className="object-cover object-top"
                    sizes="(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 100vw"
                  />
                </div>
                <p className="text-base font-medium text-ink">{person.name}</p>
                <p className="mt-1 text-xs font-light uppercase tracking-[0.12em] text-silver">
                  {person.role}
                </p>
              </li>
            ))}
          </ul>

          {alsoPeople.length > 0 ? (
            <div className="mt-16 border-t border-rule pt-10">
              <p className="mb-8 text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-silver">
                Also serves Napa House
              </p>
              <ul className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3" role="list">
                {alsoPeople.map((person) => (
                  <li key={person.name} className="flex gap-5">
                    <div className="relative h-28 w-20 shrink-0 overflow-hidden bg-oat sm:h-32 sm:w-24">
                      <Image
                        src={person.image}
                        alt=""
                        fill
                        className="object-cover object-top"
                        sizes="96px"
                      />
                    </div>
                    <div className="pt-1">
                      <p className="text-base font-medium text-ink">{person.name}</p>
                      <p className="mt-1 text-xs font-light uppercase tracking-[0.12em] text-silver">
                        {person.role}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="mt-12">
            <Link
              href="/team#team-location-napa"
              className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-ink underline-offset-4 hover:text-rose hover:underline"
            >
              Full team directory
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Editorial photo */}
      <section
        className="rella-site-reveal bg-charcoal"
        aria-label="Napa House team photograph"
      >
        <div className="relative mx-auto aspect-[16/9] max-w-[1600px] overflow-hidden bg-oat">
          <Image
            src={teamStorefront.src}
            alt={teamStorefront.alt}
            fill
            unoptimized
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>
      </section>

      {/* 7. Why Napa */}
      <section
        className="rella-site-reveal bg-ivory py-24 md:py-32"
        aria-labelledby="napa-why-heading"
      >
        <div className="mx-auto max-w-[880px] px-6 md:px-8">
          <p className="rella-editorial-eyebrow mb-8">Why Napa</p>
          <h2
            id="napa-why-heading"
            className="text-[clamp(1.85rem,4.2vw,3.25rem)] font-medium leading-[1.15] tracking-[-0.02em] text-ink"
          >
            A second Rella house — same standard, local rhythm.
          </h2>
          <p className="mt-8 max-w-[38rem] text-base font-light leading-relaxed text-silver md:text-lg">
            Vacaville and Napa House share one brand and one clinical philosophy.
            Napa House is the downtown address for guests who want that Rella
            care closer to the valley — physician-owned, consultation-led, and
            built around relationships that last longer than a single appointment.
          </p>
        </div>
      </section>

      {/* 8. Practical info */}
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
            <p className="mt-5 max-w-[32rem] text-base font-light leading-relaxed text-silver md:text-lg">
              Confirm your appointment time when you book. If anything looks
              different online elsewhere, call the studio — we&apos;ll help you
              get the right plan for your visit.
            </p>
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

            <div className="sm:col-span-2 flex flex-wrap gap-3 pt-2">
              <a
                href={napaHousePractical.mapUrl}
                target="_blank"
                rel="noreferrer"
                className="rella-cta-rect rella-cta-rect--ghost"
              >
                Open in Maps
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
              <a
                href={napaHousePractical.googleReviewUrl}
                target="_blank"
                rel="noreferrer"
                className="rella-cta-rect rella-cta-rect--ghost"
              >
                Leave a Google review
                <span className="sr-only"> for Napa House (opens in a new tab)</span>
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
          className="object-cover object-center opacity-35"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-charcoal/55" aria-hidden="true" />
        <div className="relative z-10 mx-auto max-w-[720px] px-6 text-center md:px-8">
          <h2
            id="napa-final-cta-heading"
            className="text-[clamp(1.95rem,4.5vw,3.35rem)] font-medium leading-[1.12] tracking-[-0.02em]"
          >
            Begin at Napa House.
          </h2>
          <p className="mx-auto mt-6 max-w-[32rem] text-base font-light leading-relaxed text-white/80 md:text-lg">
            Book a consultation at our downtown Napa location. We&apos;ll help
            you find a clear, comfortable next step.
          </p>
          <NapaHouseBookCta className="rella-cta-rect rella-cta-rect--filled mt-10">
            Book a consultation
          </NapaHouseBookCta>
        </div>
      </section>
    </>
  );
}
