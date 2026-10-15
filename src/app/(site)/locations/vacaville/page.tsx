import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BookTrigger } from "@/components/guided-booking/BookTrigger";
import { locations } from "@/lib/data";
import { localBusinessSchema } from "@/lib/schemas";

export const metadata: Metadata = {
  title: "Vacaville Med Spa | Hours, Address & Booking",
  description:
    "Visit Rella Aesthetics at 542 Main St in downtown Vacaville. Explore services, hours, directions, and city-pinned booking.",
  alternates: { canonical: "/locations/vacaville" },
};

const loc = locations.vacaville;

const categories = ["Injectables", "Skin", "Lasers", "Wellness", "Weight"] as const;

/** Primary Vacaville staff from the verified team directory. */
const vacavillePeople = [
  {
    name: "Anna Johnson",
    role: "Lead Nurse, RN",
    image: "/images/team/anna-johnson.jpg",
  },
  {
    name: "Warda Harchaoui",
    role: "PA-C",
    image: "/images/team/warda-harchaoui.jpg",
  },
  {
    name: "Michaela",
    role: "Esthetician & MA",
    image: "/images/team/michaela.jpg",
  },
  {
    name: "Sandra Maldonado",
    role: "MA",
    image: "/images/team/sandra-maldonado.jpg",
  },
  {
    name: "Pia Tiaoqui",
    role: "MA",
    image: "/images/team/pia-tiaoqui.jpg",
  },
  {
    name: "Paula",
    role: "Front Desk / Patient Services",
    image: "/images/team/paula.jpg",
  },
] as const;

const lounge = {
  src: "/images/clinic/vacaville-lounge.jpg",
  alt: "Tan leather sofa, pink pillow, and a wooden coffee table in the Rella Vacaville lounge",
  width: 1024,
  height: 683,
} as const;

const gallery = [
  {
    src: "/images/clinic/vacaville-logo-wall.jpg",
    alt: "Rella Aesthetics logo on a pink wall, with champagne glasses raised in front",
    width: 682,
    height: 1024,
  },
  {
    src: "/images/clinic/vacaville-loveseat.jpg",
    alt: "Pink loveseat beside a coffee table with flowers at Rella Vacaville",
    width: 682,
    height: 1024,
  },
] as const;

export default function VacavillePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema(loc)).replace(/</g, "\\u003c"),
        }}
      />

      <section className="relative -mt-[72px] flex min-h-[100svh] items-end overflow-hidden bg-charcoal text-white lg:-mt-[84px]">
        <Image
          src={lounge.src}
          alt={lounge.alt}
          fill
          priority
          unoptimized
          className="object-cover object-center"
          sizes="100vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-charcoal/20"
          aria-hidden="true"
        />
        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 pb-16 pt-32 md:px-8 md:pb-24 lg:px-12 lg:pb-28">
          <p className="mb-4 text-[0.6875rem] font-medium uppercase tracking-[0.28em] text-rose">
            Rella Aesthetics
          </p>
          <h1 className="max-w-[14ch] text-[clamp(2.4rem,6.5vw,4.75rem)] font-medium leading-[1.05] tracking-[-0.03em] text-white">
            Welcome to Rella Vacaville
          </h1>
          <p className="mt-6 max-w-[26rem] text-base font-light leading-relaxed text-white/85 md:text-lg">
            Personalized aesthetic and wellness care, thoughtfully designed around you — right in
            the heart of downtown Vacaville.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3 sm:gap-4">
            <BookTrigger intent={{ location: "vacaville" }} className="rella-cta-rect rella-cta-rect--filled">
              Book Vacaville
            </BookTrigger>
            <a
              href="#space"
              className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-white/85 underline-offset-4 hover:text-white hover:underline"
            >
              Explore the space ↓
            </a>
          </div>
        </div>
      </section>

      <section
        id="space"
        className="rella-site-reveal scroll-mt-28 bg-ivory py-10 md:py-16"
        aria-labelledby="vacaville-space-heading"
      >
        <div className="mx-auto max-w-[1440px] px-6 md:px-8 lg:px-12">
          <div className="mb-6 max-w-[26rem] md:mb-8">
            <h2
              id="vacaville-space-heading"
              className="text-[clamp(1.85rem,4vw,3.1rem)] font-medium leading-[1.12] tracking-[-0.02em] text-ink"
            >
              A little time for yourself
            </h2>
            <p className="mt-5 text-base font-light leading-relaxed text-silver md:text-lg">
              A welcoming space where personalized care, thoughtful treatments, and a team who
              knows your goals come together.
            </p>
          </div>

          <div className="grid max-w-[600px] grid-cols-2 items-start gap-3 sm:gap-5 md:gap-6">
            {gallery.map((photo) => (
              <figure key={photo.src} className="m-0 bg-oat">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  unoptimized
                  className="h-auto w-full"
                  sizes="(min-width: 768px) 280px, 45vw"
                />
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section
        className="rella-site-reveal bg-rose-blush py-10 md:py-16"
        aria-labelledby="vacaville-experience-heading"
      >
        <div className="mx-auto max-w-[720px] px-6 md:px-8">
          <p className="rella-editorial-eyebrow mb-4">The experience</p>
          <h2
            id="vacaville-experience-heading"
            className="max-w-[18ch] text-[clamp(1.75rem,3.8vw,2.75rem)] font-medium leading-[1.15] tracking-[-0.02em] text-ink"
          >
            Your goals. Our expertise. A plan made for you
          </h2>
          <p className="mt-5 max-w-[36rem] text-base font-light leading-relaxed text-ink/75 md:text-lg">
            At Rella Vacaville, great care begins with a conversation. We take time to understand
            what matters to you, recommend treatments that fit your goals, and create a plan that
            feels personal from start to finish.
          </p>
        </div>
      </section>

      <section
        className="rella-site-reveal bg-ivory py-10 md:py-16"
        aria-labelledby="vacaville-care-heading"
      >
        <div className="mx-auto max-w-[1440px] px-6 md:px-8 lg:px-12">
          <div className="mb-6 max-w-[28rem] md:mb-8">
            <p className="rella-editorial-eyebrow mb-4">What happens here</p>
            <h2
              id="vacaville-care-heading"
              className="text-[clamp(1.75rem,3.8vw,2.75rem)] font-medium leading-[1.12] tracking-[-0.02em] text-ink"
            >
              Your care, your way
            </h2>
          </div>
          <ul className="border-t border-rule" role="list">
            {categories.map((category) => (
              <li
                key={category}
                className="border-b border-rule py-3.5 text-xl font-medium tracking-[-0.01em] text-ink md:py-4 md:text-2xl"
              >
                {category}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        className="rella-site-reveal bg-ivory py-10 md:py-16"
        aria-labelledby="vacaville-people-heading"
      >
        <div className="mx-auto max-w-[1440px] px-6 md:px-8 lg:px-12">
          <div className="mb-8 max-w-[24rem]">
            <p className="rella-editorial-eyebrow mb-4">The people</p>
            <h2
              id="vacaville-people-heading"
              className="text-[clamp(1.75rem,3.8vw,2.75rem)] font-medium leading-[1.12] tracking-[-0.02em] text-ink"
            >
              Get to know your Rella team
            </h2>
          </div>
          <ul className="grid max-w-[960px] gap-x-8 gap-y-8 sm:grid-cols-3" role="list">
            {vacavillePeople.map((person) => (
              <li key={person.name}>
                <div className="relative mb-3 aspect-[3/4] overflow-hidden bg-oat">
                  <Image
                    src={person.image}
                    alt=""
                    fill
                    unoptimized
                    className="object-cover object-top"
                    sizes="(min-width: 640px) 28vw, 100vw"
                  />
                </div>
                <p className="text-sm font-medium text-ink">{person.name}</p>
                <p className="mt-1 text-xs font-light uppercase tracking-[0.12em] text-silver">
                  {person.role}
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <Link
              href="/team#team-location-vacaville"
              className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-ink underline-offset-4 hover:text-rose hover:underline"
            >
              Full team directory
            </Link>
          </div>
        </div>
      </section>

      <section
        className="rella-site-reveal bg-ivory py-10 md:py-16"
        aria-labelledby="vacaville-why-heading"
      >
        <div className="mx-auto max-w-[640px] px-6 md:px-8">
          <p className="rella-editorial-eyebrow mb-4">Why Vacaville</p>
          <h2
            id="vacaville-why-heading"
            className="text-[clamp(1.65rem,3.5vw,2.5rem)] font-medium leading-[1.15] tracking-[-0.02em] text-ink"
          >
            Your neighborhood med spa, with the Rella standard
          </h2>
          <p className="mt-5 max-w-[32rem] text-base font-light leading-relaxed text-silver md:text-lg">
            Located in downtown Vacaville, Rella brings together personalized aesthetic care, modern
            treatments, and a familiar team committed to helping you feel confident in your own skin.
          </p>
        </div>
      </section>

      <section
        className="rella-site-reveal border-t border-rule/50 bg-ivory py-10 md:py-16"
        aria-labelledby="vacaville-visit-heading"
      >
        <div className="mx-auto grid max-w-[1440px] gap-8 px-6 md:px-8 lg:grid-cols-2 lg:gap-16 lg:px-12">
          <div>
            <p className="rella-editorial-eyebrow mb-4">Visit</p>
            <h2
              id="vacaville-visit-heading"
              className="text-[clamp(1.75rem,3.8vw,2.75rem)] font-medium leading-[1.12] tracking-[-0.02em] text-ink"
            >
              Plan your visit
            </h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-2">
            <address className="not-italic">
              <p className="text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-silver">
                Address
              </p>
              <p className="mt-3 text-lg font-medium text-ink">{loc.address}</p>
              <p className="mt-1 text-base font-light text-silver">
                {loc.city}, {loc.state} {loc.zip}
              </p>
              <a
                href={`tel:+1${loc.phone.replace(/\D/g, "")}`}
                className="mt-5 inline-flex min-h-11 items-center text-base font-medium text-ink underline-offset-4 hover:text-rose hover:underline"
              >
                {loc.phone}
              </a>
            </address>
            <div>
              <p className="text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-silver">
                Hours
              </p>
              <ul className="mt-3 space-y-2">
                {loc.hours.map((line) => (
                  <li key={line} className="text-base font-light text-ink">
                    {line}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-wrap gap-3 sm:col-span-2">
              <BookTrigger intent={{ location: "vacaville" }} className="rella-cta-rect rella-cta-rect--filled">
                Book Vacaville
              </BookTrigger>
              <a
                href={loc.mapUrl}
                target="_blank"
                rel="noreferrer"
                className="rella-cta-rect rella-cta-rect--ghost"
              >
                Get directions
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section
        className="rella-site-reveal relative overflow-hidden bg-charcoal py-28 text-white md:py-36"
        aria-labelledby="vacaville-close-heading"
      >
        <Image
          src={lounge.src}
          alt=""
          fill
          unoptimized
          className="object-cover object-center opacity-30"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-charcoal/60" aria-hidden="true" />
        <div className="relative z-10 mx-auto max-w-[720px] px-6 text-center md:px-8">
          <h2
            id="vacaville-close-heading"
            className="text-[clamp(1.95rem,4.5vw,3.35rem)] font-medium leading-[1.12] tracking-[-0.02em]"
          >
            We&apos;ll see you in Vacaville
          </h2>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <BookTrigger intent={{ location: "vacaville" }} className="rella-cta-rect rella-cta-rect--filled">
              Book Vacaville
            </BookTrigger>
            <Link href="/services" className="rella-cta-rect rella-cta-rect--ghost-light">
              Explore treatments
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
