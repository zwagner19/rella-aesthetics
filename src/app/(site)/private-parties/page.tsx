import type { Metadata } from "next";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ContactForm } from "../contact/ContactForm";

export const metadata: Metadata = {
  title: "Private Parties",
  description:
    "Host a private aesthetics event at Rella Aesthetics in Vacaville or Napa. Botox parties, skincare evenings, and group treatments in a luxury med spa setting.",
};

export default function PrivatePartiesPage() {
  return (
    <>
      <section className="py-24 bg-white border-y border-silver-pale">
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12">
          <p className="text-eyebrow mb-4">Events</p>
          <h1 className="text-page-hero text-4xl md:text-5xl mb-4 leading-[1.1]">
            Private Parties
          </h1>
          <p className="text-lg font-light text-silver max-w-[560px] leading-relaxed">
            Celebrate with friends in a relaxed, elevated setting. We host private Botox evenings,
            skincare events, and small group treatments at our Vacaville and Napa locations.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-[720px] px-6 md:px-8 lg:px-12">
          <SectionHeader
            title="Plan Your Event"
            description="Tell us your group size, preferred location, and what you have in mind. Our team will follow up with availability and details."
          />
          <ContactForm />
        </div>
      </section>
    </>
  );
}
