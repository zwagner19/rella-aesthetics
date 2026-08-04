import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { resolveBookingHref, type BookingLocation } from "@/lib/booking-routes";
import { locations } from "@/lib/data";

export const metadata: Metadata = {
  title: "Book an Appointment",
  description: "Choose Rella Aesthetics in Vacaville or Napa to view the correct live booking menu.",
  robots: { index: false, follow: true },
};

const clinicOrder = ["vacaville", "napa"] as const satisfies readonly BookingLocation[];

export default function BookPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-[linear-gradient(145deg,#fff_0%,#FDF7F5_52%,#FBE7E3_100%)] py-16 md:py-24">
        <div aria-hidden="true" className="absolute -right-28 -top-36 h-96 w-96 rounded-full border border-white/70 bg-white/25" />
        <div className="relative mx-auto max-w-[960px] px-6 text-center md:px-8">
          <p className="mb-5 text-[0.6875rem] font-bold uppercase tracking-[0.22em] text-rose-dark">
            Start your visit
          </p>
          <h1 className="mx-auto mb-6 max-w-[760px] text-[clamp(2.8rem,7vw,5.4rem)] font-medium leading-[0.96] tracking-[-0.06em] text-ink">
            Choose your Rella clinic.
          </h1>
          <p className="mx-auto max-w-[680px] text-lg font-light leading-relaxed text-silver-dark md:text-xl">
            Select Napa or Vacaville to open the correct live appointment menu for that clinic.
          </p>
        </div>
      </section>

      <section className="py-14 md:py-20" aria-labelledby="clinic-choice-heading">
        <div className="mx-auto max-w-[1040px] px-6 md:px-8">
          <h2 id="clinic-choice-heading" className="sr-only">Select a clinic</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {clinicOrder.map((slug, index) => {
              const clinic = locations[slug];
              const bookingHref = resolveBookingHref({ location: slug });

              return (
                <article
                  key={slug}
                  data-booking-location={slug}
                  className="group relative overflow-hidden rounded-[2rem] border border-silver-pale bg-white p-7 shadow-[0_18px_60px_rgba(90,94,98,0.08)] transition-transform hover:-translate-y-1 md:p-10"
                >
                  <span aria-hidden="true" className="absolute right-5 top-2 text-[6rem] font-medium leading-none tracking-[-0.08em] text-rose/[0.06]">
                    0{index + 1}
                  </span>
                  <div className="relative">
                    <p className="mb-8 text-[0.625rem] font-bold uppercase tracking-[0.22em] text-rose-dark">
                      Rella Aesthetics
                    </p>
                    <h3 className="mb-3 text-4xl font-medium tracking-[-0.045em] text-ink md:text-5xl">
                      {clinic.name}
                    </h3>
                    <address className="mb-7 not-italic text-base leading-7 text-silver-dark">
                      {clinic.address}<br />
                      {clinic.city}, {clinic.state} {clinic.zip}
                    </address>
                    <div className="mb-9 border-t border-silver-pale pt-5">
                      {clinic.hours.map((line) => (
                        <p key={line} className="text-sm leading-7 text-silver">{line}</p>
                      ))}
                    </div>
                    <Button
                      href={bookingHref}
                      data-cta="location-booking"
                      className="w-full rounded-full"
                    >
                      See {clinic.name} Times
                    </Button>
                    <div className="mt-4 text-center">
                      <a
                        href={clinic.mapUrl}
                        className="text-xs font-bold uppercase tracking-[0.15em] text-silver underline decoration-silver-light underline-offset-4 transition-colors hover:text-rose-dark"
                      >
                        View location
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-10 rounded-[1.5rem] bg-rose-blush px-6 py-7 text-center md:px-10">
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
