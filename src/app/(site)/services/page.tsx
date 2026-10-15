import type { Metadata } from "next";
import { BookTrigger } from "@/components/guided-booking/BookTrigger";
import { ServicesDirectory } from "@/components/services/ServicesDirectory";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore personalized aesthetic treatments at Rella Aesthetics in Vacaville and Napa, including injectables, skin, lasers, wellness, and medical weight loss.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <div className="bg-ivory">
      <section className="mx-auto max-w-[1120px] px-6 pb-8 pt-14 md:px-8 md:pb-10 md:pt-20 lg:pt-24">
        <div className="max-w-[40rem]">
          <h1 className="text-[clamp(2.75rem,6.2vw,4.75rem)] font-medium leading-[1.02] tracking-[-0.035em] text-ink">
            Explore Our Services
          </h1>
          <p className="mt-6 max-w-[34rem] text-base font-light leading-relaxed text-silver md:text-lg">
            Personalized aesthetic treatments in Vacaville and Napa. Choose a category, then meet
            with the team to decide what is right for you.
          </p>
        </div>

        <ServicesDirectory />

        <section
          className="mt-10 border-t border-ink/10 pt-8 text-center md:mt-12 md:pt-10"
          aria-labelledby="services-consult-heading"
        >
          <h2
            id="services-consult-heading"
            className="text-[clamp(1.7rem,3vw,2.35rem)] font-medium leading-[1.15] tracking-[-0.03em] text-ink"
          >
            Not sure where to start?
          </h2>
          <BookTrigger intent={{}} className="rella-cta-rect rella-cta-rect--filled mt-7">
            Book a consultation
          </BookTrigger>
        </section>
      </section>
    </div>
  );
}
