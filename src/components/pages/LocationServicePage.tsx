import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { TrustStrip } from "@/components/blocks/TrustStrip";
import { resolveBookingHref, type BookingLocation } from "@/lib/booking-routes";
import { locations } from "@/lib/data";

type LocationDetails = (typeof locations)[keyof typeof locations];

interface LocationServicePageProps {
  location: LocationDetails;
  slug: BookingLocation;
}

const popularServices = [
  {
    href: "/vacaville/botox",
    title: "Botox & Dysport",
    description: "Vacaville-specific pricing, visit details, and the location-pinned booking path.",
  },
  {
    href: "/vacaville/filler",
    title: "Dermal Fillers",
    description: "Vacaville-specific pricing, treatment-plan factors, and the location-pinned booking path.",
  },
  {
    href: "/vacaville/laser",
    title: "Laser Treatments",
    description: "Compare verified laser options, current full-face pricing, and the initial-consult path.",
  },
  {
    href: "/vacaville/hydrafacial",
    title: "HydraFacial",
    description: "Compare Signature, Deluxe, and Platinum pricing with direct Signature booking.",
  },
  {
    href: "/services/weight-loss",
    title: "Medical Weight Loss",
    description: "Start with a phone consultation with Zachary Wagner, DO.",
  },
] as const;

const napaPopularServices = [
  {
    href: "/napa/botox",
    title: "Botox & Dysport",
    description: "Napa-specific pricing, visit details, and the dedicated new-patient booking path.",
  },
  {
    href: "/napa/filler",
    title: "Dermal Fillers",
    description: "Consultation-led filler planning with current public pricing and direct Napa booking.",
  },
  {
    href: "/napa/laser",
    title: "Laser Treatments",
    description: "Compare IPL and CO2 CoolPeel pricing, candidacy, timing, and recovery considerations.",
  },
  {
    href: "/napa/hydrafacial",
    title: "HydraFacial",
    description: "Signature, Deluxe, and Platinum tiers with the Napa Signature service preselected.",
  },
  {
    href: "/services/weight-loss",
    title: "Medical Weight Loss",
    description: "Start with a phone consultation with Zachary Wagner, DO and choose the Napa pathway.",
  },
] as const;

export function LocationServicePage({ location, slug }: LocationServicePageProps) {
  const bookingHref = resolveBookingHref({ location: slug });
  const fullAddress = `${location.address}, ${location.city}, ${location.state} ${location.zip}`;
  const displayedServices = slug === "napa" ? napaPopularServices : popularServices;

  return (
    <>
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#fff_0%,#FDF7F5_55%,#FBE7E3_100%)] py-16 md:py-24">
        <div className="mx-auto grid max-w-[1200px] items-center gap-10 px-6 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-12">
          <div>
            <p className="mb-5 text-[0.6875rem] font-bold uppercase tracking-[0.22em] text-rose-dark">
              Physician-owned · Downtown {location.name}
            </p>
            <h1 className="mb-6 text-[clamp(2.75rem,6vw,4.75rem)] font-medium leading-[0.98] tracking-[-0.055em] text-ink">
              Med spa care in {location.name}, California.
            </h1>
            <p className="mb-8 max-w-[650px] text-lg font-light leading-relaxed text-silver-dark md:text-xl">
              Consultation-led aesthetic and wellness care, honest guidance, and a plan built around your goals—right in downtown {location.name}.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button href={bookingHref} data-cta="location-booking" className="rounded-full">
                Book at {location.name}
              </Button>
              <Button href={location.mapUrl} variant="ghost" className="rounded-full bg-white/70">
                Get Directions
              </Button>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] bg-ink px-7 py-10 text-white shadow-[0_24px_80px_rgba(90,94,98,0.18)] md:px-10 md:py-12">
            <p className="mb-10 text-[0.625rem] font-bold uppercase tracking-[0.24em] text-rose">
              Rella Aesthetics
            </p>
            <p aria-hidden="true" className="absolute -right-3 top-8 text-[6.5rem] font-medium leading-none tracking-[-0.08em] text-white/[0.035] md:text-[8rem]">
              {location.name.toUpperCase()}
            </p>
            <address className="relative not-italic">
              <p className="mb-3 text-2xl font-medium tracking-[-0.025em]">{location.address}</p>
              <p className="mb-8 text-white/65">{location.city}, {location.state} {location.zip}</p>
              <a href={`tel:+1${location.phone.replace(/\D/g, "")}`} className="text-lg text-white underline decoration-rose underline-offset-4">
                {location.phone}
              </a>
            </address>
            <div className="relative mt-10 border-t border-white/15 pt-7">
              {location.hours.map((line) => (
                <p key={line} className="text-sm leading-7 text-white/70">{line}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <TrustStrip
        ariaLabel={`Why patients choose Rella Aesthetics ${location.name}`}
        items={["Physician-owned", "Clear guidance", "Personalized plans", "Downtown location"]}
      />

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12">
          <div className="mb-12 max-w-[760px]">
            <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-dark">Explore care</p>
            <h2 className="mb-5 text-3xl font-medium tracking-[-0.035em] text-ink md:text-5xl">
              Start with the service that matches your goal.
            </h2>
            <p className="text-lg font-light leading-relaxed text-silver">
              Not sure what to choose? Book a consultation and the Rella team can help you identify the appropriate next step.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {displayedServices.map((service, index) => (
              <Link
                key={service.href}
                href={service.href}
                className="group rounded-[1.5rem] border border-silver-pale bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-rose-light hover:shadow-[0_14px_45px_rgba(90,94,98,0.09)] md:p-8"
              >
                <div className="mb-8 flex items-start justify-between gap-4">
                  <span className="text-xs font-bold tracking-[0.18em] text-rose-dark">0{index + 1}</span>
                  <span aria-hidden="true" className="text-2xl font-light text-rose transition-transform group-hover:translate-x-1">→</span>
                </div>
                <h3 className="mb-3 text-xl font-medium tracking-[-0.02em] text-ink md:text-2xl">{service.title}</h3>
                <p className="text-sm leading-relaxed text-silver">{service.description}</p>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button href="/services" variant="ghost" className="rounded-full">View All Services</Button>
          </div>
        </div>
      </section>

      <section className="bg-rose-blush py-20 md:py-24">
        <div className="mx-auto grid max-w-[1000px] gap-8 px-6 md:grid-cols-[1fr_auto] md:items-center md:px-8">
          <div>
            <p className="mb-3 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-dark">Plan your visit</p>
            <h2 className="mb-3 text-3xl font-medium tracking-[-0.035em] text-ink">{fullAddress}</h2>
            <p className="text-silver">Choose a time online, call the team, or open directions before you leave.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
            <Button href={bookingHref} data-cta="location-booking" className="rounded-full">See Available Times</Button>
            <Button href={location.mapUrl} variant="ghost" className="rounded-full bg-white">Get Directions</Button>
          </div>
        </div>
      </section>
    </>
  );
}
