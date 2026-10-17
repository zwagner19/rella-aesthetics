import Image from "next/image";
import Link from "next/link";
import { resolveBookingHref } from "@/lib/booking-routes";
import { locations } from "@/lib/data";

const linkClass =
  "inline-flex min-h-11 items-center text-sm text-white/75 transition-colors hover:text-white";

export function Footer() {
  return (
    <footer className="bg-charcoal pb-28 pt-16 text-white xl:pb-10">
      <div className="mx-auto max-w-[1280px] px-6 md:px-8 lg:px-12">
        <div className="mb-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_0.9fr_0.9fr_0.9fr]">
          <div className="max-w-[360px]">
            <Link href="/" aria-label="Rella Aesthetics — Home" className="mb-5 inline-flex">
              <Image
                src="/brand/rella-logo-rose.svg"
                alt=""
                width={360}
                height={176}
                className="h-[64px] w-auto"
              />
            </Link>
            <p className="text-sm leading-relaxed text-white/70">
              Thoughtful aesthetics and wellness care in Vacaville and Napa.
            </p>
            <div className="mt-5 flex flex-wrap gap-4">
              <a
                aria-label="Rella Aesthetics on Instagram, @experiencerella"
                className="text-xs font-medium uppercase tracking-[0.14em] text-rose transition-opacity hover:opacity-80"
                href="https://www.instagram.com/experiencerella/"
                rel="noreferrer"
                target="_blank"
              >
                Instagram
              </a>
              <a
                aria-label="Rella Aesthetics on Facebook"
                className="text-xs font-medium uppercase tracking-[0.14em] text-rose transition-opacity hover:opacity-80"
                href="https://www.facebook.com/rellaaesthetics/"
                rel="noreferrer"
                target="_blank"
              >
                Facebook
              </a>
            </div>
          </div>

          <div>
            <p className="mb-5 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-white">
              Locations
            </p>
            <ul className="space-y-5 text-sm text-white/75">
              <li>
                <Link href="/locations/vacaville" className="font-medium text-white hover:text-rose">
                  {locations.vacaville.name}
                </Link>
                <p className="mt-1 leading-relaxed">
                  {locations.vacaville.address}
                  <br />
                  {locations.vacaville.city}, {locations.vacaville.state}{" "}
                  {locations.vacaville.zip}
                </p>
              </li>
              <li>
                <Link href="/locations/napa" className="font-medium text-white hover:text-rose">
                  {locations.napa.name}
                </Link>
                <p className="mt-1 leading-relaxed">
                  {locations.napa.address}
                  <br />
                  {locations.napa.city}, {locations.napa.state} {locations.napa.zip}
                </p>
              </li>
              <li>
                <a href="tel:+17073582928" className={linkClass}>
                  707.358.2928
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-5 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-white">
              Explore
            </p>
            <ul className="space-y-1">
              <li><Link href="/services" className={linkClass}>Treatments</Link></li>
              <li><Link href="/about" className={linkClass}>About</Link></li>
              <li><Link href="/team" className={linkClass}>Team</Link></li>
              <li><Link href="/gallery" className={linkClass}>Results</Link></li>
              <li><Link href="/membership" className={linkClass}>Membership</Link></li>
              <li><Link href="/blog" className={linkClass}>Education</Link></li>
            </ul>
          </div>

          <div>
            <p className="mb-5 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-white">
              Visit
            </p>
            <ul className="space-y-1">
              <li><Link href="/contact" className={linkClass}>Contact</Link></li>
              <li><Link href={resolveBookingHref({})} className={linkClass}>Book Online</Link></li>
              <li><Link href="/payment-plans" className={linkClass}>Payment Plans</Link></li>
              <li><Link href="/private-parties" className={linkClass}>Private Parties</Link></li>
            </ul>
          </div>
        </div>

        <p className="border-t border-white/15 py-6 text-sm leading-relaxed text-white/55">
          Reviews and results shared on this site span both Rella locations. Individual results vary.
        </p>

        <div className="flex flex-col gap-4 border-t border-white/15 pt-6 text-[0.75rem] uppercase tracking-[0.08em] text-white/55 md:flex-row md:items-center md:justify-between">
          <p>&copy; {new Date().getFullYear()} Rella Aesthetics. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <Link href="/privacy-policy" className="inline-flex min-h-11 items-center transition-colors hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="inline-flex min-h-11 items-center transition-colors hover:text-white">
              Terms &amp; Conditions
            </Link>
            <Link href="/cancellation-policy" className="inline-flex min-h-11 items-center transition-colors hover:text-white">
              Cancellation Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
