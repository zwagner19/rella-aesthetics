import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { resolveBookingHref, type BookingLocation } from "@/lib/booking-routes";
import { locations } from "@/lib/data";

export const metadata: Metadata = {
  title: "Book an Appointment",
  description: "Choose Rella Aesthetics in Vacaville or Napa to continue in Rella's custom booking experience.",
  robots: { index: false, follow: true },
};

const clinicOrder = ["vacaville", "napa"] as const satisfies readonly BookingLocation[];

export default function BookPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-rose py-16 text-white md:py-20">
        <div className="relative mx-auto max-w-[960px] px-6 text-center md:px-8">
          <p className="mb-4 text-[0.75rem] font-medium capitalize italic tracking-[0.08em] text-white">
            Start your visit
          </p>
          <h1 className="mx-auto mb-5 max-w-[760px] text-[clamp(2.7rem,6.5vw,4.8rem)] font-bold uppercase leading-[0.98] tracking-[0.06em] text-white">
            Choose your Rella clinic.
          </h1>
          <p className="mx-auto max-w-[680px] text-base font-light leading-relaxed text-white md:text-lg">
            Select Napa or Vacaville to continue in Rella&rsquo;s custom booking experience for that clinic.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16" aria-labelledby="clinic-choice-heading">
        <div className="mx-auto max-w-[1040px] px-6 md:px-8">
          <h2 id="clinic-choice-heading" className="sr-only">Select a clinic</h2>
          <div className="grid gap-px bg-silver-pale md:grid-cols-2">
            {clinicOrder.map((slug, index) => {
              const clinic = locations[slug];
              const bookingHref = resolveBookingHref({ location: slug });

              return (
                <article
                  key={slug}
                  data-booking-location={slug}
                  className="group relative overflow-hidden border-t-2 border-t-rose bg-white p-7 md:p-9"
                >
                  <span aria-hidden="true" className="absolute right-5 top-2 text-[6rem] font-medium leading-none tracking-[-0.08em] text-rose/[0.06]">
                    0{index + 1}
                  </span>
                  <div className="relative">
                    <p className="mb-8 text-[0.75rem] font-medium capitalize italic tracking-[0.08em] text-ink">
                      Rella Aesthetics
                    </p>
                    <h3 className="mb-3 text-4xl font-bold uppercase tracking-[0.06em] text-ink md:text-5xl">
                      {clinic.name}
                    </h3>
                    <address className="mb-6 not-italic text-base leading-7 text-silver-dark">
                      {clinic.address}<br />
                      {clinic.city}, {clinic.state} {clinic.zip}
                    </address>
                    <Button
                      href={bookingHref}
                      data-cta="location-booking"
                      disableHover
                      className="w-full rounded-full"
                    >
                      See {clinic.name} Times
                    </Button>
                    <div className="mt-7 border-t border-silver-pale pt-5">
                      {clinic.hours.map((line) => (
                        <p key={line} className="text-sm leading-7 text-ink/70">{line}</p>
                      ))}
                    </div>
                    <div className="mt-4 text-center">
                      <a
                        href={clinic.mapUrl}
                        className="text-xs font-bold uppercase tracking-[0.15em] text-ink/70 underline decoration-ink/30 underline-offset-4 transition-colors hover:text-ink"
                      >
                        View location
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-10 border-y border-rose bg-rose-blush px-6 py-7 text-center md:px-10">
            <p className="text-sm leading-7 text-silver-dark md:text-base">
              Not sure which clinic to choose? Call Rella at{" "}
              <a
                href="tel:+17073582928"
                data-cta="phone"
                className="font-semibold text-ink underline decoration-rose underline-offset-4"
              >
                707.358.2928
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
