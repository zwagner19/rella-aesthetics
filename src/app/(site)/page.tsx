import type { Metadata } from "next";
import { headers } from "next/headers";
import Image from "next/image";
import { TrustStrip } from "@/components/blocks/TrustStrip";
import { resolveBookingHref } from "@/lib/booking-routes";
import { ServiceCard } from "@/components/blocks/ServiceCard";
import { TestimonialCard } from "@/components/blocks/TestimonialCard";
import { MembershipBanner } from "@/components/blocks/MembershipBanner";
import { LocationCard } from "@/components/blocks/LocationCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { HomeLocationVisual } from "@/components/home/HomeLocationVisual";
import { services, testimonials, locations } from "@/lib/data";
import { medicalBusinessSchema } from "@/lib/schemas";
import { WeightLossServicePage } from "@/components/pages/WeightLossServicePage";
import { getServiceMetadata } from "@/lib/service-metadata";
import { isWeightLossHost } from "@/lib/site-hosts";
import { DEFAULT_SOCIAL_IMAGE } from "@/lib/social-card";

const mainSiteMetadata: Metadata = {
  title: { absolute: "Rella Aesthetics Med Spa | Vacaville & Napa CA" },
  description:
    "Personalized aesthetic and wellness care in Vacaville and Napa, California. Explore Rella's services or book a consultation.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Rella Aesthetics Med Spa | Vacaville & Napa CA",
    description:
      "Personalized aesthetic and wellness care in Vacaville and Napa, California.",
    url: "/",
    images: [DEFAULT_SOCIAL_IMAGE],
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host");
  return isWeightLossHost(host)
    ? getServiceMetadata("weight-loss")
    : mainSiteMetadata;
}

function HomePageContent({ isWeightLoss }: { isWeightLoss: boolean }) {
  if (isWeightLoss) return <WeightLossServicePage />;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(medicalBusinessSchema()).replace(
            /</g,
            "\\u003c",
          ),
        }}
      />

      {/* Hero */}
      <section className="grid min-h-[70vh] bg-white md:min-h-[80vh] md:grid-cols-2">
        <div className="flex items-center px-6 py-20 md:px-8 md:py-24 lg:pl-[max(3rem,calc((100vw-1200px)/2))] lg:pr-16">
          <div className="max-w-[620px]">
            <p className="mb-6 text-sm font-medium italic tracking-[0.04em] text-ink">
              Northern California&apos;s Luxury Med Spa
            </p>
            <h1 className="mb-5 text-4xl font-bold uppercase leading-[1.04] tracking-[0.08em] text-rose md:text-5xl lg:text-6xl">
              Ageless Beauty
            </h1>
            <p className="mb-9 max-w-[520px] text-lg font-light leading-relaxed text-ink/70">
              Personalized aesthetic and wellness treatments designed around
              your goals. Natural-looking results, elevated care in Vacaville
              and Napa.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button href={resolveBookingHref({})}>Book Consultation</Button>
              <Button href="/services" variant="ghost">
                Explore Services
              </Button>
            </div>
          </div>
        </div>
        <div className="min-h-[420px] md:min-h-full">
          <HomeLocationVisual />
        </div>
      </section>

      <TrustStrip
        ariaLabel="Why patients choose Rella Aesthetics"
        items={[
          "Natural-looking results",
          "Two local clinics",
          "Thoughtful guidance",
          "Personalized plans",
        ]}
      />

      {/* Services Grid */}
      <section className="rella-preview-reveal border-y border-rose-light/60 bg-white py-24 md:py-32">
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12">
          <SectionHeader
            eyebrow="Treatments"
            title="Our Services"
            description="Explore aesthetic, skin, wellness, and medical weight-management options available through Rella."
          />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard
                key={service.slug}
                href={`/services/${service.slug}`}
                title={service.title}
                description={service.description}
                image={service.image}
                imageAlt={service.imageAlt}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Feel Comfortable */}
      <section className="rella-preview-reveal bg-white py-24 md:py-32">
        <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-6 md:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20 lg:px-12">
          <div className="relative aspect-[4/5] overflow-hidden bg-rose-blush">
            <Image
              src="/images/clinic/rella-sidewalk-sign.webp"
              alt="A Rella Aesthetics sidewalk sign welcoming patients outside the clinic"
              fill
              className="object-cover object-center"
              sizes="(min-width: 1024px) 46vw, 100vw"
            />
          </div>
          <div className="lg:pl-6">
            <p className="mb-5 text-[0.75rem] font-medium capitalize italic tracking-[0.08em] text-ink">
              Feel Comfortable
            </p>
            <h2 className="mb-6 text-3xl font-bold uppercase leading-[1.08] tracking-[0.06em] text-rose md:text-5xl">
              Your questions belong in the room.
            </h2>
            <p className="mb-5 text-lg font-light leading-relaxed text-ink/70">
              Aesthetic care can come with a lot of choices. Rella starts with
              what you want to work on, what you want explained, and how you
              want the experience to feel.
            </p>
            <p className="mb-8 leading-relaxed text-ink/65">
              From skin care and injectables to wellness services, the goal is a
              clear conversation and a next step shaped around you, not a
              one-size-fits-all plan.
            </p>
            <div className="mb-9 grid gap-px bg-ink/10 sm:grid-cols-3">
              {[
                "Two local clinics",
                "Consultation first",
                "Clear next steps",
              ].map((item) => (
                <p
                  key={item}
                  className="bg-white px-4 py-5 text-xs font-bold uppercase tracking-[0.12em] text-rose"
                >
                  {item}
                </p>
              ))}
            </div>
            <Button href="/about">How Rella Cares</Button>
          </div>
        </div>
      </section>

      {/* Medical weight-loss feature */}
      <section className="rella-preview-reveal bg-rose py-24 text-white md:py-32">
        <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-6 md:px-8 lg:grid-cols-2 lg:gap-20 lg:px-12">
          <div className="relative aspect-[4/5] overflow-hidden bg-white/20">
            <Image
              src="/images/treatments/medical-weight-loss.webp"
              alt="A gloved Rella team member holding three prepared syringes in the clinic"
              fill
              className="object-cover object-center"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
          <div className="lg:pl-8">
            <p className="mb-5 text-[0.75rem] font-medium capitalize italic tracking-[0.08em] text-ink">
              Medical weight management
            </p>
            <h2 className="mb-6 text-3xl font-bold uppercase leading-[1.08] tracking-[0.06em] text-white md:text-5xl">
              Built around more than medication.
            </h2>
            <p className="mb-7 text-lg font-light leading-relaxed text-white">
              Start with a 30-minute phone consultation with Zachary Wagner, DO,
              an American Board of Obesity Medicine diplomate, to understand how
              Rella works and review the appropriate next step and costs before
              deciding.
            </p>
            <ul className="mb-8 space-y-3 text-sm text-white">
              {[
                "ABOM-certified physician",
                "Napa and Vacaville clinic support",
                "No card required for the starting-point consultation",
                "Medication only when clinically appropriate",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span aria-hidden="true" className="text-white">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <Button
              href="/services/weight-loss"
              variant="light"
              className="rounded-full hover:!border-white hover:!bg-white hover:!text-rose"
            >
              Explore Medical Weight Loss
            </Button>
          </div>
        </div>
      </section>

      {/* We Get It */}
      <section className="rella-preview-reveal bg-rose py-24 md:py-32">
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12">
          <div className="mb-12 grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-end lg:gap-20">
            <div>
              <p className="mb-4 text-[0.75rem] font-medium capitalize italic tracking-[0.08em] text-ink">
                Care should feel clear
              </p>
              <h2 className="text-4xl font-bold uppercase leading-[1.02] tracking-[0.08em] text-white md:text-6xl">
                We Get It
              </h2>
            </div>
            <p className="max-w-[700px] text-lg font-light leading-relaxed text-white md:text-xl">
              It can be hard to sort through treatment options, timing, and
              expectations. Rella makes room for the questions, explains the
              choices plainly, and helps you decide what feels right for you.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {testimonials.map((item, i) => (
              <article
                key={i}
                className="border border-white bg-white p-7 [&>div>div:first-child]:text-rose"
              >
                <TestimonialCard
                  quote={item.quote}
                  name={item.name}
                  source={item.source}
                />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Membership Banner */}
      <div className="border-y border-rose-light/60">
        <MembershipBanner />
      </div>

      {/* Locations */}
      <section className="rella-preview-reveal py-24 md:py-32">
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12">
          <SectionHeader
            eyebrow="Two Locations"
            title="Visit Us"
            description="Explore clinic details, directions, and booking paths for Vacaville and Napa."
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 [&_a]:text-rose">
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

      {/* Final CTA */}
      <section className="rella-preview-reveal bg-rose py-20 text-center text-white md:py-24">
        <div className="mx-auto max-w-[600px] px-6">
          <h2 className="mb-4 text-3xl font-bold uppercase tracking-[0.08em] md:text-4xl">
            Ready to Begin?
          </h2>
          <p className="mb-8 text-lg font-light">
            Schedule a consultation and discover the right next step for your
            goals.
          </p>
          <Button href={resolveBookingHref({})} variant="light">
            Book Consultation
          </Button>
        </div>
      </section>
    </>
  );
}

export default async function HomePage() {
  const host = (await headers()).get("host");
  return <HomePageContent isWeightLoss={isWeightLossHost(host)} />;
}
