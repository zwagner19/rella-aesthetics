import type { Metadata } from "next";
import { SectionHeader } from "@/components/ui/SectionHeader";

export const metadata: Metadata = {
  title: "Book an Appointment",
  description:
    "Schedule your consultation or treatment at Rella Aesthetics in Vacaville or Napa. Online booking available 24/7.",
};

export default function BookingPage() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-[800px] px-6 md:px-8 lg:px-12 text-center">
        <SectionHeader
          eyebrow="Schedule"
          title="Book Your Appointment"
          description="Select your preferred location and treatment below. The Boulevard booking widget will load here once your API credentials are configured."
        />

        {/* Boulevard Self-Booking Overlay target */}
        <div
          id="boulevard-booking"
          className="min-h-[500px] border-2 border-dashed border-silver-light rounded-lg flex items-center justify-center text-silver"
        >
          <div>
            <p className="text-lg mb-2">Boulevard Booking Widget</p>
            <p className="text-sm text-silver-light">
              Configure your Boulevard business ID in{" "}
              <code className="bg-silver-pale px-2 py-0.5 rounded text-xs">
                src/components/integrations/BoulevardBooking.tsx
              </code>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
