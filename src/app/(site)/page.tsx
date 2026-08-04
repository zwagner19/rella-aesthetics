import type { Metadata } from "next";
import { headers } from "next/headers";
import { Hero } from "@/components/blocks/Hero";
import { resolveBookingHref } from "@/lib/booking-routes";
import { ServiceCard } from "@/components/blocks/ServiceCard";
import { TestimonialCard } from "@/components/blocks/TestimonialCard";
import { MembershipBanner } from "@/components/blocks/MembershipBanner";
import { LocationCard } from "@/components/blocks/LocationCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { services, testimonials, locations } from "@/lib/data";
import { medicalBusinessSchema } from "@/lib/schemas";
import { WeightLossServicePage } from "@/components/pages/WeightLossServicePage";
import { getServiceMetadata } from "@/lib/service-metadata";
import { isWeightLossHost } from "@/lib/site-hosts";

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host");
  return isWeightLossHost(host) ? getServiceMetadata("weight-loss") : {};
}

function HomePageContent({ isWeightLoss }: { isWeightLoss: boolean }) {
  if (isWeightLoss) return <WeightLossServicePage />;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(medicalBusinessSchema()),
        }}
      />

      {/* Hero */}
      <Hero
        eyebrow="Northern California's Luxury Med Spa"
        title="Ageless Beauty"
        description="Physician-led aesthetic treatments designed around your goals. Natural results, elevated care — in Vacaville and Napa."
        ctaText="Book Consultation"
        ctaHref={resolveBookingHref({})}
        secondaryCta={{ text: "Explore Services", href: "/services" }}
      />

      {/* Services Grid */}
      <section className="py-24 bg-rose-blush">
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12">
          <SectionHeader
            eyebrow="Treatments"
            title="Our Services"
            description="Expert aesthetic and wellness treatments tailored to your unique needs."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard
                key={service.slug}
                href={`/services/${service.slug}`}
                title={service.title}
                description={service.description}
                image={service.image}
                imageAlt={service.title}
              />
            ))}
          </div>
        </div>
      </section>

      {/* About teaser */}
      <section className="py-24">
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12">
          <div className="max-w-[700px]">
            <SectionHeader
              eyebrow="Why Rella"
              title="Physician-Led, Patient-Centered"
              description="Rella Aesthetics combines medical expertise with an artist's eye. Every treatment is physician-supervised and designed for naturally beautiful outcomes."
            />
            <Button href="/about" variant="ghost">
              Meet Our Team
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-rose-blush">
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12">
          <SectionHeader
            eyebrow="Results"
            title="What Our Patients Say"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((item, i) => (
              <TestimonialCard
                key={i}
                quote={item.quote}
                name={item.name}
                source={item.source}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Membership Banner */}
      <MembershipBanner />

      {/* Locations */}
      <section className="py-24">
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12">
          <SectionHeader
            eyebrow="Two Locations"
            title="Visit Us"
            description="Serving Vacaville and Napa with the same level of luxury care."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LocationCard
              name={locations.vacaville.name}
              address={locations.vacaville.address}
              city={locations.vacaville.city}
              state={locations.vacaville.state}
              zip={locations.vacaville.zip}
              hours={[...locations.vacaville.hours]}
              href="/locations/vacaville"
            />
            <LocationCard
              name={locations.napa.name}
              address={locations.napa.address}
              city={locations.napa.city}
              state={locations.napa.state}
              zip={locations.napa.zip}
              hours={[...locations.napa.hours]}
              href="/locations/napa"
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-rose text-white text-center">
        <div className="mx-auto max-w-[600px] px-6">
          <h2 className="font-bold text-3xl md:text-4xl tracking-[0.06em] uppercase mb-4">
            Ready to Begin?
          </h2>
          <p className="font-light text-lg mb-8 opacity-90">
            Schedule your complimentary consultation today and discover what&apos;s possible.
          </p>
          <Button
            href={resolveBookingHref({})}
            className="bg-white !text-rose hover:bg-white/90 hover:!text-rose-dark"
          >
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
