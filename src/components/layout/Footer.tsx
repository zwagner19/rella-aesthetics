"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { resolveGlobalBookingAction } from "@/lib/site-experience";

export function Footer({ weightLossExperience = false }: { weightLossExperience?: boolean }) {
  const pathname = usePathname();
  const booking = resolveGlobalBookingAction(pathname, weightLossExperience, "Book Online");
  const mainSiteHref = (path: string) =>
    weightLossExperience ? `https://experiencerella.com${path}` : path;

  return (
    <footer className="border-t border-silver/25 bg-rose/20 pb-28 pt-16 text-ink xl:pb-8">
      <div className="mx-auto max-w-[1280px] px-6 md:px-8 lg:px-12">
        <div className="mb-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.35fr_0.85fr_0.85fr_0.85fr]">
          {/* Brand */}
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
            <p className="text-sm leading-relaxed text-ink/70">
              Local med spa serving Vacaville and Napa with aesthetic, skin, wellness, and medical
              weight-management care.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                aria-label="Rella Aesthetics on Instagram, @experiencerella"
                className="rounded-full border border-ink px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-ink transition-colors hover:bg-ink hover:text-white"
                href="https://www.instagram.com/experiencerella/"
                rel="noreferrer"
                target="_blank"
              >
                Instagram · @experiencerella
              </a>
              <a
                aria-label="Rella Aesthetics on Facebook"
                className="rounded-full border border-ink px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-ink transition-colors hover:bg-ink hover:text-white"
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
            <p className="mb-5 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-ink">
              Services
            </p>
            <ul className="space-y-3 text-ink/70">
              <li><Link href={mainSiteHref("/services/botox")} className="text-sm transition-colors hover:text-ink">Botox &amp; Dysport</Link></li>
              <li><Link href={mainSiteHref("/services/dermal-fillers")} className="text-sm transition-colors hover:text-ink">Dermal Fillers</Link></li>
              <li><Link href={weightLossExperience ? "/" : "/services/weight-loss"} className="text-sm transition-colors hover:text-ink">Weight Loss</Link></li>
              <li><Link href={mainSiteHref("/services/laser-treatments")} className="text-sm transition-colors hover:text-ink">Laser Treatments</Link></li>
              <li><Link href={mainSiteHref("/services/iv-hydration")} className="text-sm transition-colors hover:text-ink">IV Hydration</Link></li>
              <li><Link href={mainSiteHref("/services")} className="text-sm transition-colors hover:text-ink">All Services</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="mb-5 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-ink">
              Company
            </p>
            <ul className="space-y-3 text-ink/70">
              <li><Link href={mainSiteHref("/about")} className="text-sm transition-colors hover:text-ink">About</Link></li>
              <li><Link href={mainSiteHref("/team")} className="text-sm transition-colors hover:text-ink">Team</Link></li>
              <li><Link href={mainSiteHref("/gallery")} className="text-sm transition-colors hover:text-ink">Results</Link></li>
              <li><Link href={mainSiteHref("/blog")} className="text-sm transition-colors hover:text-ink">Education</Link></li>
              <li><Link href={mainSiteHref("/membership")} className="text-sm transition-colors hover:text-ink">Memberships</Link></li>
              <li><Link href={mainSiteHref("/private-parties")} className="text-sm transition-colors hover:text-ink">Private Parties</Link></li>
              <li><Link href={mainSiteHref("/payment-plans")} className="text-sm transition-colors hover:text-ink">Payment Plans</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="mb-5 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-ink">
              Contact
            </p>
            <ul className="space-y-3 text-ink/70">
              <li><Link href={mainSiteHref("/contact")} className="text-sm transition-colors hover:text-ink">Get in Touch</Link></li>
              <li>
                <Link
                  href={booking.href}
                  data-cta={booking.cta}
                  className="text-sm transition-colors hover:text-ink"
                >
                  {booking.label}
                </Link>
              </li>
              <li><a href="tel:+17073582928" className="text-sm transition-colors hover:text-ink">707.358.2928</a></li>
            </ul>
          </div>
        </div>

        <p className="border-t border-silver/30 py-6 text-sm leading-relaxed text-ink/70">
          Reviews shared on this site span both Rella locations. Individual results vary.
        </p>

        <div className="flex flex-col gap-4 border-t border-silver/30 pt-6 text-[0.75rem] uppercase tracking-[0.08em] text-ink/60 md:flex-row md:items-center md:justify-between">
          <p>&copy; {new Date().getFullYear()} Rella Aesthetics. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <Link href={mainSiteHref("/privacy-policy")} className="transition-colors hover:text-ink">Privacy Policy</Link>
            <Link href={mainSiteHref("/cancellation-policy")} className="transition-colors hover:text-ink">Cancellation Policy</Link>
            <Link href={mainSiteHref("/terms")} className="transition-colors hover:text-ink">Terms &amp; Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
