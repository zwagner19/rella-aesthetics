"use client";

import Image from "next/image";
import Link from "next/link";
import { resolveBookingHref } from "@/lib/booking-routes";
import { BookTrigger } from "@/components/guided-booking/BookTrigger";
import { locations } from "@/lib/data";

const textLinkClass =
  "inline-flex min-h-11 items-center text-sm text-ink transition-opacity hover:opacity-70";

const locationEntries = [locations.vacaville, locations.napa] as const;

export function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-ivory pb-28 pt-12 text-ink xl:pb-10">
      <div className="mx-auto max-w-[1120px] px-6 md:px-8">
        <div className="grid gap-10 md:grid-cols-2 md:items-start lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] lg:gap-14">
          <div className="max-w-[22rem]">
            <Link href="/" aria-label="Rella Aesthetics — Home" className="inline-flex">
              <Image
                src="/brand/rella-logo-rose.svg"
                alt=""
                width={360}
                height={176}
                className="h-14 w-auto"
              />
            </Link>
            <p className="mt-4 text-sm font-light leading-relaxed text-ink/70">
              Thoughtful aesthetics and wellness care in Vacaville and Napa.
            </p>
            <div className="mt-4 flex flex-wrap gap-4">
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
            <p className="text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-silver">
              Locations
            </p>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-5">
              {locationEntries.map((location) => (
                <li key={location.name} className="min-w-0">
                  <Link href={`/locations/${location.name.toLowerCase()}`} className="text-sm font-medium text-ink hover:opacity-70">
                    {location.name}
                  </Link>
                  <p className="mt-1 text-sm font-light leading-relaxed text-ink/70">
                    {location.address}
                    <br />
                    {location.city}, {location.state} {location.zip}
                  </p>
                  <a href={`tel:+1${location.phone.replace(/\D/g, "")}`} className="mt-1 inline-flex text-sm text-ink/70 hover:opacity-70">
                    {location.phone}
                  </a>
                </li>
              ))}
            </ul>
            <nav aria-label="Footer" className="mt-3">
              <ul className="flex flex-col md:flex-row md:items-center md:gap-4">
                <li>
                  <Link href="/contact" className={textLinkClass}>
                    Contact
                  </Link>
                </li>
                <li aria-hidden="true" className="hidden h-3.5 w-px shrink-0 bg-ink/20 md:block" />
                <li>
                  <BookTrigger intent={{}} className={textLinkClass}>
                    Book Online
                  </BookTrigger>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <p className="mt-8 max-w-xl text-sm font-light leading-relaxed text-ink/70">
          Flexible payment plans available for qualifying clients.
        </p>

        <p className="mt-6 border-t border-ink/10 pt-5 text-sm font-light leading-relaxed text-ink/55">
          Reviews and results shared on this site span both Rella locations. Individual results vary.
        </p>

        <div className="mt-4 flex flex-col gap-3 text-[0.75rem] uppercase tracking-[0.08em] text-ink/55 md:flex-row md:items-center md:justify-between">
          <p>&copy; {new Date().getFullYear()} Rella Aesthetics. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <Link href="/privacy-policy" className="inline-flex min-h-11 items-center transition-opacity hover:opacity-70">
              Privacy Policy
            </Link>
            <Link href="/terms" className="inline-flex min-h-11 items-center transition-opacity hover:opacity-70">
              Terms &amp; Conditions
            </Link>
            <Link href="/cancellation-policy" className="inline-flex min-h-11 items-center transition-opacity hover:opacity-70">
              Cancellation Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
