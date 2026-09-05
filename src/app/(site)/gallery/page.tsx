import type { Metadata } from "next";
import { resolveBookingHref } from "@/lib/booking-routes";
import { Button } from "@/components/ui/Button";
import { TrustStrip } from "@/components/blocks/TrustStrip";
import { TestimonialCard } from "@/components/blocks/TestimonialCard";
import { PatientResultImageGallery } from "@/components/blocks/PatientResultImageGallery";
import { approvedPatientResultImages } from "@/content/results";
import { testimonials } from "@/lib/data";

export const metadata: Metadata = {
  title: "Natural Results & Before and After Photos",
  description:
    "Learn how Rella Aesthetics approaches natural looking results and responsible before and after photography in Vacaville and Napa.",
  alternates: { canonical: "/gallery" },
};

const resultPrinciples = [
  {
    number: "01",
    title: "Your features stay yours",
    body: "The goal is a refreshed, balanced result that does not copy someone else's face or follow a treatment trend.",
  },
  {
    number: "02",
    title: "The plan comes first",
    body: "Consultation, anatomy, health history, and realistic expectations determine the appropriate next step.",
  },
  {
    number: "03",
    title: "Photography needs consent",
    body: "Rella publishes patient imagery only when the patient has provided the appropriate permission for public use.",
  },
] as const;

const patientResultImages = approvedPatientResultImages("main-gallery");

export default function GalleryPage() {
  return (
    <>
      <section className="bg-rose py-20 text-ink md:py-28">
        <div className="mx-auto max-w-[1000px] px-6 text-center md:px-8">
          <p className="mb-5 text-[0.75rem] font-medium capitalize italic tracking-[0.08em] text-ink">Our approach to results</p>
          <h1 className="mb-6 text-[clamp(2.75rem,7vw,5rem)] font-bold uppercase leading-[0.98] tracking-[0.06em] text-ink">
            Results that still look like you.
          </h1>
          <p className="mx-auto mb-8 max-w-[700px] text-lg font-light leading-relaxed text-ink md:text-xl">
            Rella&apos;s work begins with honest guidance, thoughtful consultation, and a treatment plan designed around your features and goals.
          </p>
          <Button href={resolveBookingHref({})} disableHover className="rounded-full !border-white !text-ink">Book a Consultation</Button>
        </div>
      </section>

      <TrustStrip
        ariaLabel="Rella Aesthetics results principles"
        items={["Natural looking goals", "Consultation first", "Individualized plans", "Patient consent first"]}
      />

      <PatientResultImageGallery results={patientResultImages} />

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12">
          <div className="mb-12 max-w-[760px]">
            <p className="mb-4 text-[0.75rem] font-medium capitalize italic tracking-[0.08em] text-rose-text">What guides the work</p>
            <h2 className="text-3xl font-bold uppercase tracking-[0.06em] text-rose-text md:text-5xl">Natural does not mean one size fits all.</h2>
          </div>
          <div className="grid gap-px bg-silver-pale md:grid-cols-3">
            {resultPrinciples.map((item) => (
              <article key={item.number} className="border-t-2 border-t-rose bg-white p-7 md:p-8">
                <p className="mb-10 text-xs font-bold tracking-[0.18em] text-rose-text">{item.number}</p>
                <h3 className="mb-3 text-xl font-bold uppercase tracking-[0.06em] text-rose-text">{item.title}</h3>
                <p className="text-sm leading-relaxed text-ink/70">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-rose py-20 text-ink md:py-24">
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12">
          <div className="mb-10 max-w-[720px]">
            <p className="mb-4 text-[0.75rem] font-medium capitalize italic tracking-[0.08em] text-ink">Patient perspective</p>
            <h2 className="text-3xl font-bold uppercase tracking-[0.06em] text-ink md:text-5xl">What patients say about the experience.</h2>
          </div>
          <div className="grid gap-10 md:grid-cols-3">
            {testimonials.map((item) => (
              <div key={item.name} className="bg-white p-6">
                <TestimonialCard quote={item.quote} name={item.name} source={item.source} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-rose py-16 text-center text-ink md:py-20">
        <div className="mx-auto max-w-[640px] px-6">
          <h2 className="mb-4 text-3xl font-bold uppercase tracking-[0.06em] text-ink md:text-4xl">Start with the right conversation.</h2>
          <p className="mx-auto mb-7 w-fit bg-white px-5 py-2 text-base font-light text-rose-text md:text-lg">
            Share your goal, ask questions, and understand the appropriate next step before you decide.
          </p>
          <Button
            href={resolveBookingHref({})}
            data-cta="gallery-booking"
            variant="ghost"
            disableHover
            className="!border-white !bg-transparent !text-ink"
          >
            Book Consultation
          </Button>
        </div>
      </section>
    </>
  );
}
