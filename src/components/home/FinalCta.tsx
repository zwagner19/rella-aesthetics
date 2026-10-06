"use client";

import Image from "next/image";
import { resolveBookingHref } from "@/lib/booking-routes";
import { BookTrigger } from "@/components/guided-booking/BookTrigger";

export function FinalCta() {
  const bookingHref = resolveBookingHref({});

  return (
    <section
      className="rella-site-reveal relative overflow-hidden bg-charcoal py-28 text-white md:py-36"
      aria-labelledby="final-cta-heading"
    >
      <Image
        src="/images/clinic/napa-reception.webp"
        alt=""
        fill
        className="object-cover object-center opacity-35"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-charcoal/55" aria-hidden="true" />
      <div className="relative z-10 mx-auto max-w-[720px] px-6 text-center md:px-8">
        <h2
          id="final-cta-heading"
          className="text-[clamp(1.95rem,4.5vw,3.35rem)] font-medium leading-[1.12] tracking-[-0.02em]"
        >
          Start with a conversation.
        </h2>
        <p className="mx-auto mt-6 max-w-[32rem] text-base font-light leading-relaxed text-white/80 md:text-lg">
          Not sure what treatment is right for you? Book a consultation and we&apos;ll help you
          find a clear next step.
        </p>
        <BookTrigger intent={{}} className="rella-cta-rect rella-cta-rect--filled mt-10">
          Book a consultation
        </BookTrigger>
      </div>
    </section>
  );
}
