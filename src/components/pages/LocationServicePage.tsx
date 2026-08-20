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
    description:
      "Vacaville-specific pricing, visit details, and the location-pinned booking path.",
  },
  {
    href: "/vacaville/filler",
    title: "Dermal Fillers",
    description:
      "Vacaville-specific pricing, treatment-plan factors, and the location-pinned booking path.",
  },
  {
    href: "/vacaville/laser",
    title: "Laser Treatments",
    description:
      "Compare verified laser options, current full-face pricing, and the initial-consult path.",
  },
  {
    href: "/vacaville/facials",
    title: "Professional Facials",
    description:
      "Compare current facial options and start with the Initial Skin Health Consult.",
  },
  {
    href: "/vacaville/hydrafacial",
    title: "HydraFacial",
    description:
      "Compare Signature, Deluxe, and Platinum pricing with direct Signature booking.",
  },
  {
    href: "/vacaville/chemical-peels",
    title: "Chemical Peels",
    description:
      "Compare the four current Vacaville options, recovery planning, and the safe clinic-menu handoff.",
  },
  {
    href: "/vacaville/microneedling",
    title: "Microneedling",
    description:
      "Compare Skin Stylus and RF options, review candidacy and recovery, and open the initial consult.",
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
    description:
      "Napa-specific pricing, visit details, and the dedicated new-patient booking path.",
  },
  {
    href: "/napa/filler",
    title: "Dermal Fillers",
    description:
      "Consultation-led filler planning with current public pricing and direct Napa booking.",
  },
  {
    href: "/napa/laser",
    title: "Laser Treatments",
    description:
      "Compare IPL and CO2 CoolPeel pricing, candidacy, timing, and recovery considerations.",
  },
  {
    href: "/napa/facials",
    title: "Professional Facials",
    description:
      "Compare current Napa facial options and start with the Initial Skin Health Consult.",
  },
  {
    href: "/napa/hydrafacial",
    title: "HydraFacial",
    description:
      "Signature, Deluxe, and Platinum tiers with the Napa Signature service preselected.",
  },
  {
    href: "/napa/hyperhidrosis",
    title: "Excessive Sweating Care",
    description:
      "A consult-first path to review sweating concerns before choosing an appropriate option.",
  },
  {
    href: "/services/weight-loss",
    title: "Medical Weight Loss",
    description:
      "Start with a phone consultation with Zachary Wagner, DO and choose the Napa pathway.",
  },
] as const;

export function LocationServicePage({
  location,
  slug,
}: LocationServicePageProps) {
  const bookingHref = resolveBookingHref({ location: slug });
  const fullAddress = `${location.address}, ${location.city}, ${location.state} ${location.zip}`;
  const displayedServices =
    slug === "napa" ? napaPopularServices : popularServices;

  return (
    <>
      <section className="bg-paper py-[clamp(4rem,8vw,7rem)]">
        <div className="mx-auto grid max-w-[1160px] items-stretch gap-12 px-5 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <div className="flex flex-col justify-center">
            <p className="mb-5 text-sm font-normal italic text-ink">
              Consultation-led care · Downtown {location.name}
            </p>
            <h1 className="mb-6 text-[clamp(2.5rem,6vw,4.5rem)] font-bold uppercase leading-[1.08] tracking-[0.08em] text-rose">
              Med spa care in {location.name}, California.
            </h1>
            <p className="mb-8 max-w-[650px] text-base font-light leading-[1.75] text-ink/70 md:text-lg">
              Consultation-led aesthetic and wellness care, honest guidance, and
              a plan built around your goals—right in downtown {location.name}.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button href={bookingHref} data-cta="location-booking">
                Book at {location.name}
              </Button>
              <Button href={location.mapUrl} variant="ghost">
                Get Directions
              </Button>
            </div>
          </div>

          <div className="relative overflow-hidden bg-rose px-7 py-12 text-white md:px-10 md:py-16">
            <p className="mb-10 text-sm font-normal italic text-white">
              Rella Aesthetics
            </p>
            <p
              aria-hidden="true"
              className="absolute -right-3 top-8 text-[6.5rem] font-bold uppercase leading-none tracking-[0.04em] text-white/[0.035] md:text-[8rem]"
            >
              {location.name.toUpperCase()}
            </p>
            <address className="relative not-italic">
              <p className="mb-3 text-2xl font-semibold tracking-[0.02em]">
                {location.address}
              </p>
              <p className="mb-8 text-white/65">
                {location.city}, {location.state} {location.zip}
              </p>
              <a
                href={`tel:+1${location.phone.replace(/\D/g, "")}`}
                className="text-lg text-white underline decoration-rose underline-offset-4"
              >
                {location.phone}
              </a>
            </address>
            <div className="relative mt-10 border-t border-white/15 pt-7">
              {location.hours.map((line) => (
                <p key={line} className="text-sm leading-7 text-white/70">
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <TrustStrip
        ariaLabel={`Why patients choose Rella Aesthetics ${location.name}`}
        items={[
          "Clear guidance",
          "Personalized plans",
          "Downtown location",
          "Two local clinics",
        ]}
      />

      <section className="py-[clamp(4rem,8vw,7rem)]">
        <div className="mx-auto max-w-[1160px] px-5 md:px-8">
          <div className="mb-12 max-w-[760px]">
            <p className="mb-4 text-sm font-normal italic text-ink">
              Explore care
            </p>
            <h2 className="mb-5 text-[clamp(2rem,4vw,3rem)] font-bold uppercase leading-[1.15] tracking-[0.06em] text-ink">
              Start with the service that matches your goal.
            </h2>
            <p className="text-lg font-light leading-[1.75] text-ink/70">
              Not sure what to choose? Book a consultation and the Rella team
              can help you identify the appropriate next step.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {displayedServices.map((service, index) => (
              <Link
                key={service.href}
                href={service.href}
                className="group border-t border-rose bg-white p-6 transition-colors hover:bg-rose md:p-8"
              >
                <div className="mb-8 flex items-start justify-between gap-4">
                  <span className="text-xs font-bold tracking-[0.18em] text-rose group-hover:text-white">
                    0{index + 1}
                  </span>
                  <span
                    aria-hidden="true"
                    className="text-2xl font-light text-rose group-hover:text-white"
                  >
                    →
                  </span>
                </div>
                <h3 className="mb-3 text-xl font-bold uppercase leading-tight tracking-[0.06em] text-rose group-hover:text-white md:text-2xl">
                  {service.title}
                </h3>
                <p className="text-sm leading-[1.75] text-ink/65 group-hover:text-white">
                  {service.description}
                </p>
              </Link>
            ))}
          </div>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            {slug === "napa" && (
              <Button href="/napa">Explore the Napa Service Hub</Button>
            )}
            <Button href="/services" variant="ghost">
              View All Services
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-rose py-[clamp(4rem,8vw,6rem)] text-white">
        <div className="mx-auto grid max-w-[1000px] gap-8 px-5 md:grid-cols-[1fr_auto] md:items-center md:px-8">
          <div>
            <p className="mb-3 text-sm font-normal italic text-white">
              Plan your visit
            </p>
            <h2 className="mb-3 text-3xl font-bold uppercase leading-tight tracking-[0.06em] text-white">
              {fullAddress}
            </h2>
            <p className="text-white">
              Choose a time online, call the team, or open directions before you
              leave.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
            <Button
              href={bookingHref}
              data-cta="location-booking"
              className="!border-white !bg-white !text-rose hover:!border-white hover:!bg-white hover:!text-rose"
            >
              See Available Times
            </Button>
            <Button
              href={location.mapUrl}
              variant="ghost"
              className="!border-white !bg-white !text-rose hover:!border-white hover:!bg-white hover:!text-rose"
            >
              Get Directions
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
