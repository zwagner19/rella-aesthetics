import type { Metadata } from "next";
import { resolveBookingHref } from "@/lib/booking-routes";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "About Rella Aesthetics",
  description:
    "Meet the Rella Aesthetics team — luxury med spa in Vacaville and Napa, CA. Our mission, values, and approach.",
};

const values = [
  {
    title: "Expert Care",
    description:
      "Our team brings advanced aesthetic training and careful technique to every visit, with safety and precision at the center of what we do.",
  },
  {
    title: "Natural Results",
    description: "We enhance your features, not change them. Our approach delivers subtle, refreshed outcomes that look like you — just better.",
  },
  {
    title: "Personalized Plans",
    description: "No two patients are alike. We create custom treatment plans based on your anatomy, goals, and lifestyle.",
  },
  {
    title: "Elevated Experience",
    description: "From your first call to your follow-up, every touchpoint is designed to feel warm, professional, and seamless.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-24 bg-white border-y border-silver-pale">
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12">
          <p className="text-eyebrow mb-4">
            About Us
          </p>
          <h1 className="text-display text-4xl md:text-5xl mb-4 leading-[1.1]">
            Our Story
          </h1>
          <p className="text-lg font-light text-silver max-w-[560px] leading-relaxed">
            Rella Aesthetics was founded with a clear vision — deliver Northern California&apos;s
            highest standard of aesthetic care in a warm, welcoming environment.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <SectionHeader
                eyebrow="Our Mission"
                title="Confidence Through Expertise"
              />
              <p className="text-silver leading-relaxed mb-4">
                Rella Aesthetics was founded to bridge the gap between clinical
                excellence and luxury patient experience. Our team combines advanced
                aesthetic training with an artist&apos;s eye for facial anatomy, helping
                every patient feel confident and cared for.
              </p>
              <p className="text-silver leading-relaxed">
                We believe aesthetic care should be thoughtful, evidence-informed, and deeply
                personal. That&apos;s why we take the time to understand your goals before
                recommending any treatment.
              </p>
            </div>
            <div className="aspect-[4/5] bg-silver-pale" />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white border-y border-silver-pale">
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12">
          <SectionHeader eyebrow="Our Values" title="What Sets Us Apart" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {values.map((value) => (
              <div key={value.title} className="bg-white p-8 border border-silver-pale">
                <h3 className="font-medium text-lg text-silver-dark mb-2">{value.title}</h3>
                <p className="text-silver text-[0.9375rem] leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-rose text-white text-center">
        <div className="mx-auto max-w-[600px] px-6">
          <h2 className="font-bold text-2xl md:text-3xl tracking-[0.06em] uppercase mb-4">
            Meet Our Team
          </h2>
          <p className="font-light text-lg mb-6 opacity-90">
            Schedule a consultation and experience the Rella Aesthetics difference.
          </p>
          <Button
            href={resolveBookingHref({})}
            className="bg-white !text-ink hover:bg-white/90"
          >
            Book Consultation
          </Button>
        </div>
      </section>
    </>
  );
}
