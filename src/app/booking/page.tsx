import type { Metadata } from "next";
import { Suspense } from "react";
import { BoulevardCustomBooking } from "@/components/integrations/BoulevardCustomBooking";

export const metadata: Metadata = {
  title: "Book an Appointment",
  description:
    "Reserve your consultation or treatment at Rella Aesthetics in Vacaville or Napa. Physician-led care, luxury experience.",
};

export default function BookingPage() {
  return (
    <>
      <section className="py-16 md:py-20 bg-rose-blush">
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12 text-left">
          <p className="font-bold text-[0.6875rem] tracking-[0.2em] uppercase text-silver mb-4">
            Schedule
          </p>
          <h1 className="font-bold text-4xl md:text-5xl tracking-[0.08em] uppercase text-rose-text mb-4 leading-[1.1] max-w-[720px]">
            Book Your Appointment
          </h1>
          <p className="text-lg font-light text-silver max-w-[560px] leading-relaxed">
            Choose your studio, treatment, and time. Complete your details to
            confirm—you&apos;ll receive email confirmation right away.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12 text-left">
          <Suspense
            fallback={
              <p className="text-sm text-silver" role="status">
                Loading booking…
              </p>
            }
          >
            <BoulevardCustomBooking />
          </Suspense>
        </div>
      </section>
    </>
  );
}
