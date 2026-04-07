import type { Metadata } from "next";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "About Rella Aesthetics",
  description:
    "Meet Dr. Sonia Dhillon and the Rella Aesthetics team — physician-led luxury med spa in Vacaville and Napa, CA. Our mission, values, and approach.",
};

const values = [
  {
    title: "Physician-Led Care",
    description: "Every treatment is overseen by Dr. Sonia Dhillon, ensuring medical precision and patient safety at every step.",
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
      <section className="py-24 bg-rose-blush">
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12">
          <p className="font-bold text-[0.6875rem] tracking-[0.2em] uppercase text-silver mb-4">
            About Us
          </p>
          <h1 className="font-bold text-4xl md:text-5xl tracking-[0.08em] uppercase text-rose-text mb-4 leading-[1.1]">
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
                Dr. Sonia Dhillon founded Rella Aesthetics to bridge the gap between clinical
                excellence and luxury patient experience. With years of medical training and an
                artist&apos;s eye for facial anatomy, she leads a team dedicated to helping every
                patient feel confident and cared for.
              </p>
              <p className="text-silver leading-relaxed">
                We believe aesthetic medicine should be physician-led, evidence-based, and deeply
                personal. That&apos;s why we take the time to understand your goals before
                recommending any treatment.
              </p>
            </div>
            <div className="aspect-[4/5] bg-silver-pale rounded-lg" />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-rose-blush">
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12">
          <SectionHeader eyebrow="Our Values" title="What Sets Us Apart" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {values.map((value) => (
              <div key={value.title} className="bg-white p-8 rounded-lg border border-silver-pale">
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
            href="/booking"
            className="bg-white !text-rose hover:bg-white/90 hover:!text-rose-dark"
          >
            Book Consultation
          </Button>
        </div>
      </section>
    </>
  );
}
