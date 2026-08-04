import Link from "next/link";
import { resolveBookingHref } from "@/lib/booking-routes";

export function Footer() {
  return (
    <footer className="bg-ink text-white/60 pt-16 pb-28 lg:pb-8">
      <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="max-w-[300px]">
            <div className="flex flex-col leading-none mb-4">
              <span className="font-light text-xl tracking-[0.12em] text-white">rella</span>
              <span className="font-bold text-[0.5rem] tracking-[0.25em] uppercase text-white/40">
                Aesthetics
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              Physician-owned med spa serving Vacaville and Napa with aesthetic, skin, wellness,
              and medical weight-management care.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                aria-label="Rella Aesthetics on Instagram, @experiencerella"
                className="rounded-full border border-white/15 px-3 py-2 text-xs font-semibold text-white/75 transition-colors hover:border-rose-light hover:text-rose-light"
                href="https://www.instagram.com/experiencerella/"
                rel="noreferrer"
                target="_blank"
              >
                Instagram · @experiencerella
              </a>
              <a
                aria-label="Rella Aesthetics on Facebook"
                className="rounded-full border border-white/15 px-3 py-2 text-xs font-semibold text-white/75 transition-colors hover:border-rose-light hover:text-rose-light"
                href="https://www.facebook.com/rellaaesthetics/"
                rel="noreferrer"
                target="_blank"
              >
                Facebook
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <p className="font-bold text-[0.625rem] tracking-[0.2em] uppercase text-white/40 mb-4">
              Services
            </p>
            <ul className="space-y-2">
              <li><Link href="/services/botox" className="text-sm hover:text-rose-light transition-colors">Botox &amp; Dysport</Link></li>
              <li><Link href="/services/dermal-fillers" className="text-sm hover:text-rose-light transition-colors">Dermal Fillers</Link></li>
              <li><Link href="/services/weight-loss" className="text-sm hover:text-rose-light transition-colors">Weight Loss</Link></li>
              <li><Link href="/services/laser-treatments" className="text-sm hover:text-rose-light transition-colors">Laser Treatments</Link></li>
              <li><Link href="/services/iv-hydration" className="text-sm hover:text-rose-light transition-colors">IV Hydration</Link></li>
              <li><Link href="/services" className="text-sm hover:text-rose-light transition-colors">All Services</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="font-bold text-[0.625rem] tracking-[0.2em] uppercase text-white/40 mb-4">
              Company
            </p>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm hover:text-rose-light transition-colors">About</Link></li>
              <li><Link href="/gallery" className="text-sm hover:text-rose-light transition-colors">Results</Link></li>
              <li><Link href="/blog" className="text-sm hover:text-rose-light transition-colors">Education</Link></li>
              <li><Link href="/membership" className="text-sm hover:text-rose-light transition-colors">Memberships</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="font-bold text-[0.625rem] tracking-[0.2em] uppercase text-white/40 mb-4">
              Contact
            </p>
            <ul className="space-y-2">
              <li><Link href="/contact" className="text-sm hover:text-rose-light transition-colors">Get in Touch</Link></li>
              <li><Link href={resolveBookingHref({})} className="text-sm hover:text-rose-light transition-colors">Book Online</Link></li>
              <li><a href="tel:+17073582928" className="text-sm hover:text-rose-light transition-colors">707.358.2928</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4 text-[0.8125rem]">
          <p>&copy; {new Date().getFullYear()} Rella Aesthetics. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <Link href="/privacy-policy" className="text-white/40 hover:text-rose-light transition-colors">Privacy Policy</Link>
            <Link href="/cancellation-policy" className="text-white/40 hover:text-rose-light transition-colors">Cancellation Policy</Link>
            <Link href="/terms" className="text-white/40 hover:text-rose-light transition-colors">Terms &amp; Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
