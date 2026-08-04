import Image from "next/image";
import { Hero } from "@/components/blocks/Hero";
import { TrustStrip } from "@/components/blocks/TrustStrip";
import { resolveBookingHref } from "@/lib/booking-routes";
import { ServiceCard } from "@/components/blocks/ServiceCard";
import { TestimonialCard } from "@/components/blocks/TestimonialCard";
import { MembershipBanner } from "@/components/blocks/MembershipBanner";
import { LocationCard } from "@/components/blocks/LocationCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { services, testimonials, locations } from "@/lib/data";
import { medicalBusinessSchema } from "@/lib/schemas";

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(medicalBusinessSchema()).replace(/</g, "\\u003c"),
        }}
      />

      {/* Hero */}
      <Hero
        eyebrow="Physician-owned · Vacaville & Napa"
        title="Care Built Around You"
        description="Aesthetic and wellness care grounded in medical expertise, honest guidance, and treatment plans designed around your goals."
        ctaText="Book Consultation"
        ctaHref={resolveBookingHref({})}
        secondaryCta={{ text: "Explore Services", href: "/services" }}
        backgroundImage="/images/service-botox.jpg"
      />

      <TrustStrip
        ariaLabel="Why patients choose Rella Aesthetics"
        items={["Physician-owned", "Vacaville & Napa", "Medical oversight", "Personalized treatment plans"]}
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

      {/* Medical weight-loss feature */}
      <section className="py-24">
        <div className="mx-auto grid max-w-[1200px] items-center gap-10 px-6 md:px-8 lg:grid-cols-2 lg:px-12">
          <div className="relative min-h-[380px] overflow-hidden rounded-[1.75rem] md:min-h-[520px]">
            <Image
              src="/images/service-weightloss.jpg"
              alt="A patient discussing a personalized medical weight-loss plan"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
          <div className="lg:pl-8">
            <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-dark">
              Medical weight management
            </p>
            <h2 className="mb-5 text-3xl font-medium leading-tight tracking-[-0.035em] text-ink md:text-5xl">
              Built around more than medication.
            </h2>
            <p className="mb-7 text-lg font-light leading-relaxed text-silver">
              Start with a 30-minute phone consultation with Zachary Wagner, DO, an American Board of Obesity Medicine diplomate, to understand how Rella works and review the appropriate next step and costs before deciding.
            </p>
            <ul className="mb-8 space-y-3 text-sm text-silver-dark">
              {[
                "ABOM-certified physician",
                "Napa and Vacaville clinic support",
                "No card required for the starting-point consultation",
                "Medication only when clinically appropriate",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span aria-hidden="true" className="text-rose">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <Button href="/services/weight-loss" className="rounded-full">
              Explore Medical Weight Loss
            </Button>
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
            Schedule a consultation and discover the right next step for your goals.
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
