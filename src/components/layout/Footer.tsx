import Image from "next/image";
import Link from "next/link";
import { resolveBookingHref } from "@/lib/booking-routes";

const linkClass =
  "inline-flex min-h-11 items-center text-sm text-ink transition-colors hover:text-ink/65";

export function Footer() {
  return (
    <footer className="border-t border-rose/25 bg-rose/10 pb-28 pt-16 text-ink xl:pb-8">
      <div className="mx-auto max-w-[1280px] px-6 md:px-8 lg:px-12">
        <div className="mb-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.35fr_0.85fr_0.85fr_0.85fr]">
          <div className="max-w-[340px]">
            <Link href="/" aria-label="Rella Aesthetics — Home" className="mb-5 inline-flex">
              <Image
                src="/brand/rella-logo-black.svg"
                alt=""
                width={360}
                height={176}
                className="h-[72px] w-auto"
              />
            </Link>
            <p className="text-sm leading-relaxed text-ink">
              Local med spa serving Vacaville and Napa with aesthetic, skin, wellness, and medical
              weight-management care.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                aria-label="Rella Aesthetics on Instagram, @experiencerella"
                className="inline-flex min-h-11 items-center rounded-full border border-rose bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-ink transition-colors hover:bg-rose/20"
                href="https://www.instagram.com/experiencerella/"
                rel="noreferrer"
                target="_blank"
              >
                Instagram · @experiencerella
              </a>
              <a
                aria-label="Rella Aesthetics on Facebook"
                className="inline-flex min-h-11 items-center rounded-full border border-rose bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-ink transition-colors hover:bg-rose/20"
                href="https://www.facebook.com/rellaaesthetics/"
                rel="noreferrer"
                target="_blank"
              >
                Facebook
              </a>
            </div>
          </div>

          <div>
            <p className="mb-5 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-ink">
              Services
            </p>
            <ul className="space-y-1">
              <li><Link href="/services/botox" className={linkClass}>Botox &amp; Dysport</Link></li>
              <li><Link href="/services/dermal-fillers" className={linkClass}>Dermal Fillers</Link></li>
              <li><Link href="/services/weight-loss" className={linkClass}>Weight Loss</Link></li>
              <li><Link href="/services/laser-treatments" className={linkClass}>Laser Treatments</Link></li>
              <li><Link href="/services/iv-hydration" className={linkClass}>IV Hydration</Link></li>
              <li><Link href="/services" className={linkClass}>All Services</Link></li>
            </ul>
          </div>

          <div>
            <p className="mb-5 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-ink">
              Company
            </p>
            <ul className="space-y-1">
              <li><Link href="/about" className={linkClass}>About</Link></li>
              <li><Link href="/team" className={linkClass}>Team</Link></li>
              <li><Link href="/gallery" className={linkClass}>Results</Link></li>
              <li><Link href="/blog" className={linkClass}>Education</Link></li>
              <li><Link href="/membership" className={linkClass}>Memberships</Link></li>
              <li><Link href="/payment-plans" className={linkClass}>Payment Plans</Link></li>
              <li><Link href="/private-parties" className={linkClass}>Private Parties</Link></li>
            </ul>
          </div>

          <div>
            <p className="mb-5 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-ink">
              Contact
            </p>
            <ul className="space-y-1">
              <li><Link href="/contact" className={linkClass}>Get in Touch</Link></li>
              <li><Link href={resolveBookingHref({})} className={linkClass}>Book Online</Link></li>
              <li><a href="tel:+17073582928" className={linkClass}>707.358.2928</a></li>
            </ul>
          </div>
        </div>

        <p className="border-t border-rose/30 py-6 text-sm leading-relaxed text-ink">
          Reviews shared on this site span both Rella locations. Individual results vary.
        </p>

        <div className="flex flex-col gap-4 border-t border-rose/30 pt-6 text-[0.75rem] uppercase tracking-[0.08em] text-ink md:flex-row md:items-center md:justify-between">
          <p>&copy; {new Date().getFullYear()} Rella Aesthetics. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <Link href="/privacy-policy" className="inline-flex min-h-11 items-center transition-colors hover:text-ink/65">Privacy Policy</Link>
            <Link href="/terms" className="inline-flex min-h-11 items-center transition-colors hover:text-ink/65">Terms &amp; Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
