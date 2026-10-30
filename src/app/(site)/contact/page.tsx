import { withWebsiteSeo } from "@/lib/website-seo";
import type { Metadata } from "next";
import { LocationCard } from "@/components/blocks/LocationCard";
import { ContactForm } from "./ContactForm";
import { resolveContactIntent } from "@/lib/contact-intents";
import { locations } from "@/lib/data";

const defaultMetadata: Metadata = {
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
      <section className="bg-rose py-12 text-white md:py-16">
        <div className="mx-auto max-w-[1440px] px-6 md:px-8 lg:px-12">
          <p className="mb-3 text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-white/80">
            Contact
          </p>
          <h1 className="max-w-[14ch] text-[clamp(2rem,4.5vw,3.5rem)] font-medium leading-[1.08] tracking-[-0.03em] text-white">
            Let&apos;s connect
          </h1>
          <p className="mt-4 max-w-[34rem] text-base font-light leading-relaxed text-white/90 md:text-lg">
            Have a question or ready to book? We&apos;re here to help you feel confident in your
            next step.
          </p>
        </div>
      </section>

      <section className="border-b border-rule/50 bg-ivory py-8 md:py-10">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-6 sm:flex-row sm:gap-16 md:px-8 lg:px-12">
          <div>
            <p className="text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-silver">
              Call us
            </p>
            <a
              href="tel:+17073582928"
              className="mt-1 inline-flex min-h-11 items-center text-lg font-medium text-ink underline-offset-4 hover:text-rose hover:underline"
            >
              707.358.2928
            </a>
          </div>
          <div>
            <p className="text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-silver">
              Email us
            </p>
            <a
              href="mailto:info@experiencerella.com"
              className="mt-1 inline-flex min-h-11 items-center break-all text-lg font-medium text-ink underline-offset-4 hover:text-rose hover:underline"
            >
              info@experiencerella.com
            </a>
          </div>
        </div>
      </section>

      <section className="bg-ivory py-10 md:py-16">
        <div className="mx-auto max-w-[720px] px-6 md:px-8">
          <h2 className="text-[clamp(1.75rem,3.8vw,2.75rem)] font-medium leading-[1.12] tracking-[-0.02em] text-ink">
            Send us a message
          </h2>
          <div className="mt-6">
            <ContactForm
              key={initialServiceInterest || "general"}
              initialServiceInterest={initialServiceInterest}
            />
          </div>
        </div>
      </section>

      <section className="bg-rose py-12 text-white md:py-16">
        <div className="mx-auto max-w-[1440px] px-6 md:px-8 lg:px-12">
          <h2 className="mb-8 text-[clamp(1.75rem,3.8vw,2.75rem)] font-medium leading-[1.12] tracking-[-0.02em] text-white">
            Visit us
          </h2>
          <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2 md:gap-6 [&_a]:text-rose">
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

export async function generateMetadata(): Promise<Metadata> {
  return withWebsiteSeo("/contact", defaultMetadata);
}
