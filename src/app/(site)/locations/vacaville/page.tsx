import type { Metadata } from "next";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { resolveBookingHref } from "@/lib/booking-routes";
import { locations } from "@/lib/data";
import { localBusinessSchema } from "@/lib/schemas";

export const metadata: Metadata = {
  title: "Vacaville Med Spa",
  description:
    "Visit Rella Aesthetics in downtown Vacaville — 542 Main St. Botox, fillers, laser treatments, weight loss, and more. Book your appointment today.",
};

const loc = locations.vacaville;

export default function VacavillePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema(loc)),
        }}
      />

      <section className="py-24 bg-white border-y border-silver-pale">
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12">
          <p className="text-eyebrow mb-4">
            Location
          </p>
          <h1 className="text-display text-4xl md:text-5xl mb-4 leading-[1.1]">
            Rella Aesthetics — Vacaville
          </h1>
          <p className="text-lg font-light text-silver max-w-[560px] leading-relaxed">
            Our original location in the heart of downtown Vacaville.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
            <div>
              <SectionHeader title="Visit Us" />
              <address className="not-italic text-silver leading-relaxed mb-6">
                {loc.address}<br />
                {loc.city}, {loc.state} {loc.zip}<br /><br />
                <strong className="text-silver-dark">Phone: </strong>
                <a href={`tel:+1${loc.phone.replace(/\D/g, "")}`} className="hover:text-rose-text transition-colors">
                  {loc.phone}
                </a>
              </address>
              <h3 className="font-medium text-lg text-silver-dark mb-3">Hours</h3>
              {loc.hours.map((line, i) => (
                <p key={i} className="text-silver text-sm">{line}</p>
              ))}
              <div className="mt-8">
                <Button href={resolveBookingHref({ location: "vacaville" })}>Book at Vacaville</Button>
              </div>
            </div>
            <div className="aspect-[4/3] bg-silver-pale" />
          </div>
        </div>
      </section>
    </>
  );
}
