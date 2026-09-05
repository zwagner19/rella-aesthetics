import type { Metadata } from "next";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { LocationCard } from "@/components/blocks/LocationCard";
import { ContactForm } from "./ContactForm";
import { resolveContactIntent } from "@/lib/contact-intents";
import { locations } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Rella Aesthetics in Vacaville or Napa. Call, email, or submit a contact form. We're here to help you begin your aesthetic journey.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams?: Promise<{ intent?: string | string[] }>;
}) {
  const initialServiceInterest = resolveContactIntent(
    (await searchParams)?.intent,
  );

  return (
    <>
      {/* Hero */}
      <section className="bg-rose py-24 text-ink">
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12">
          <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-ink">
            Contact
          </p>
          <h1 className="mb-5 text-4xl font-bold uppercase leading-[1.08] tracking-[0.08em] text-ink md:text-6xl">
            Get in Touch
          </h1>
          <p className="max-w-[560px] text-lg font-light leading-relaxed text-ink/80">
            Questions about a treatment? Ready to schedule? We&apos;re here to
            help.
          </p>
        </div>
      </section>

      {/* Form + Info */}
      <section className="py-20">
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            <div>
              <SectionHeader title="Send Us a Message" />
              <ContactForm
                key={initialServiceInterest || "general"}
                initialServiceInterest={initialServiceInterest}
              />
            </div>
            <div>
              <SectionHeader title="Other Ways to Reach Us" />
              <div className="space-y-4 mb-8">
                <p className="text-ink/70">
                  <strong className="text-rose-text">Phone: </strong>
                  <a
                    href="tel:+17073582928"
                    className="text-rose-text transition-colors hover:text-ink"
                  >
                    707.358.2928
                  </a>
                </p>
                <p className="text-ink/70">
                  <strong className="text-rose-text">Email: </strong>
                  <a
                    href="mailto:info@experiencerella.com"
                    className="text-rose-text transition-colors hover:text-ink"
                  >
                    info@experiencerella.com
                  </a>
                </p>
              </div>
              <h3 className="font-medium text-lg text-rose-text mb-4">
                Clinic Hours
              </h3>
              <div className="space-y-2 text-sm text-ink/70">
                {[locations.vacaville, locations.napa].map((location) => (
                  <p key={location.name}>
                    <strong className="text-rose-text">{location.name}: </strong>
                    {location.hours.join(" · ")}
                  </p>
                ))}
                <p className="pt-1">Online booking is available at any time.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Locations */}
      <section className="bg-rose py-20 text-ink">
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12">
          <div className="mb-12 max-w-[680px]">
            <p className="mb-4 text-sm font-medium italic tracking-[0.04em] text-ink">
              Locations
            </p>
            <h2 className="mb-5 text-3xl font-medium uppercase leading-[1.08] tracking-[0.08em] text-ink md:text-5xl">
              Visit Us
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <LocationCard
              name={locations.vacaville.name}
              address={locations.vacaville.address}
              city={locations.vacaville.city}
              state={locations.vacaville.state}
              zip={locations.vacaville.zip}
              hours={[...locations.vacaville.hours]}
              href="/locations/vacaville"
              googleReviewUrl={locations.vacaville.googleReviewUrl}
            />
            <LocationCard
              name={locations.napa.name}
              address={locations.napa.address}
              city={locations.napa.city}
              state={locations.napa.state}
              zip={locations.napa.zip}
              hours={[...locations.napa.hours]}
              href="/locations/napa"
              googleReviewUrl={locations.napa.googleReviewUrl}
            />
          </div>
        </div>
      </section>
    </>
  );
}
