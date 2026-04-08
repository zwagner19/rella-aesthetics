import type { Metadata } from "next";
import { Suspense } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { BoulevardCustomBooking } from "@/components/integrations/BoulevardCustomBooking";

export const metadata: Metadata = {
  title: "Book an Appointment",
  description:
    "Schedule your consultation or treatment at Rella Aesthetics in Vacaville or Napa. Online booking available 24/7.",
};

export default function BookingPage() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-[800px] px-6 md:px-8 lg:px-12 text-left">
        <SectionHeader
          eyebrow="Schedule"
          title="Book Your Appointment"
          description="Choose your location, service, and time. You can complete payment here when your Boulevard settings require a card on file."
        />

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
  );
}
