import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { servicePages } from "@/lib/service-data";
import { bookingUrlForService } from "@/lib/booking-links";
import { FaqAccordion, FaqSchema } from "@/components/blocks/FaqAccordion";
import { Button } from "@/components/ui/Button";

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return servicePages.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = servicePages.find((s) => s.slug === slug);
  if (!service) return {};
  return {
    title: service.metaTitle,
    description: service.metaDescription,
    openGraph: {
      title: service.metaTitle,
      description: service.metaDescription,
    },
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = servicePages.find((s) => s.slug === slug);
  if (!service) notFound();

  return (
    <>
      <FaqSchema items={service.faq} />

      {/* Hero */}
      <section className="py-24 bg-rose-blush">
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12">
          <p className="font-bold text-[0.6875rem] tracking-[0.2em] uppercase text-silver mb-4">
            {service.heroEyebrow}
          </p>
          <h1 className="font-bold text-4xl md:text-5xl tracking-[0.08em] uppercase text-rose-text mb-4 leading-[1.1]">
            {service.heroTitle}
          </h1>
          <p className="text-lg font-light text-silver max-w-[560px] leading-relaxed mb-8">
            {service.heroDescription}
          </p>
          <Button href={bookingUrlForService(service.slug)}>
            Book {service.title}
          </Button>
        </div>
      </section>

      {/* Section 1 — What It Is */}
      <section className="py-20">
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12">
          <div className="max-w-[720px]">
            <h2 className="font-medium text-2xl md:text-3xl text-silver-dark mb-4">
              {service.whatItIs.heading}
            </h2>
            <p className="text-silver leading-relaxed">{service.whatItIs.body}</p>
          </div>
        </div>
      </section>

      {/* Section 2 — Who It's For */}
      <section className="py-20 bg-rose-blush">
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12">
          <div className="max-w-[720px]">
            <h2 className="font-medium text-2xl md:text-3xl text-silver-dark mb-4">
              {service.whoItsFor.heading}
            </h2>
            <p className="text-silver leading-relaxed mb-4">{service.whoItsFor.body}</p>
            <ul className="space-y-2">
              {service.whoItsFor.bullets.map((b, i) => (
                <li key={i} className="flex gap-3 text-silver-dark">
                  <span className="text-rose shrink-0 mt-0.5">&#10003;</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Section 3 — What to Expect */}
      <section className="py-20">
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12">
          <div className="max-w-[720px]">
            <h2 className="font-medium text-2xl md:text-3xl text-silver-dark mb-4">
              {service.whatToExpect.heading}
            </h2>
            <p className="text-silver leading-relaxed mb-6">{service.whatToExpect.body}</p>
            <ol className="space-y-3 list-decimal list-inside">
              {service.whatToExpect.steps.map((step, i) => (
                <li key={i} className="text-silver-dark pl-2">
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Section 4 — Pricing */}
      <section className="py-20 bg-rose-blush">
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12">
          <div className="max-w-[720px]">
            <h2 className="font-medium text-2xl md:text-3xl text-silver-dark mb-4">
              {service.pricing.heading}
            </h2>
            <p className="text-silver leading-relaxed">{service.pricing.body}</p>
            {service.pricing.note && (
              <p className="text-sm text-silver-light mt-2">{service.pricing.note}</p>
            )}
            <div className="mt-8">
              <Button href={bookingUrlForService(service.slug)}>
                Book {service.title}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5 — FAQ */}
      <section className="py-20">
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12">
          <h2 className="font-medium text-2xl md:text-3xl text-silver-dark mb-8">
            Frequently Asked Questions
          </h2>
          <FaqAccordion items={service.faq} />
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-rose text-white text-center">
        <div className="mx-auto max-w-[600px] px-6">
          <h2 className="font-bold text-2xl md:text-3xl tracking-[0.06em] uppercase mb-4">
            Ready to Get Started?
          </h2>
          <p className="font-light text-lg mb-6 opacity-90">
            Schedule your consultation to learn if {service.title.toLowerCase()} is right for you.
          </p>
          <Button
            href={bookingUrlForService(service.slug)}
            className="bg-white !text-rose hover:bg-white/90 hover:!text-rose-dark"
          >
            Book {service.title}
          </Button>
        </div>
      </section>
    </>
  );
}
