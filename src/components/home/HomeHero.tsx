"use client";

import Image from "next/image";
import Link from "next/link";
import { BookTrigger } from "@/components/guided-booking/BookTrigger";

export function HomeHero() {
  return (
    <section className="bg-ivory" aria-labelledby="home-hero-heading">
      <Image
        src="/images/clinic/rella_two_locations_with_text_4k.png"
        alt="Napa Transformation House and Rella Vacaville, joined as Rella Aesthetics"
        width={3840}
        height={2160}
        priority
        unoptimized
        className="mx-auto block h-auto w-full lg:w-[78%]"
        sizes="(min-width: 1024px) 78vw, 100vw"
      />
      <div className="mx-auto max-w-[1440px] px-6 pb-8 pt-6 text-center md:px-8 md:pb-10 md:pt-8">
        <h1
          id="home-hero-heading"
          className="mx-auto max-w-[16ch] text-[clamp(2rem,4.5vw,3.5rem)] font-medium leading-[1.08] tracking-[-0.03em] text-ink"
        >
          Results that still look like you
        </h1>
        <p className="mx-auto mt-4 max-w-[34rem] text-base font-light leading-relaxed text-silver md:text-lg">
          Thoughtful aesthetics, personalized treatment plans, and a team that knows your face.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <Link href="/services" className="rella-cta-rect rella-cta-rect--ghost">
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
