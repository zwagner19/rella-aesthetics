"use client";

import Image from "next/image";
import Link from "next/link";
import { resolveBookingHref } from "@/lib/booking-routes";
import { BookTrigger } from "@/components/guided-booking/BookTrigger";

export function HomeHero() {
  const bookingHref = resolveBookingHref({});

  return (
    <section className="relative -mt-[72px] flex min-h-[100svh] items-end overflow-hidden bg-charcoal text-white lg:-mt-[84px]">
      <Image
        src="/images/clinic/rella-team-storefront.webp"
        alt="The Rella Aesthetics team outside the clinic storefront"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/35 to-charcoal/25"
        aria-hidden="true"
      />
      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 pb-16 pt-32 md:px-8 md:pb-24 lg:px-12 lg:pb-28">
        <p className="mb-5 text-[0.6875rem] font-medium uppercase tracking-[0.28em] text-rose">
          Rella Aesthetics
        </p>
        <h1 className="max-w-[16ch] text-[clamp(2.35rem,6.5vw,4.75rem)] font-medium leading-[1.05] tracking-[-0.02em] text-white">
          Results that still look like you.
        </h1>
        <p className="mt-6 max-w-[34rem] text-base font-light leading-relaxed text-white/85 md:text-lg">
          Thoughtful aesthetics, personalized treatment plans, and a team that knows your face.
        </p>
        <div className="mt-10 flex flex-wrap gap-3 sm:gap-4">
          <Link href="/services" className="rella-cta-rect rella-cta-rect--ghost-light">
            Explore treatments
          </Link>
          <BookTrigger intent={{}} className="rella-cta-rect rella-cta-rect--filled">
            Book a consultation
          </BookTrigger>
        </div>
      </div>
    </section>
  );
}
