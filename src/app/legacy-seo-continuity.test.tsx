import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Footer } from "@/components/layout/Footer";
import { Header, navLinks } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { GET as getEvents } from "./(site)/events/route";
import GiveawayTermsPage, {
  metadata as giveawayMetadata,
} from "./(site)/giveaway-terms-and-conditions/page";
import NapaLocationPage from "./(site)/locations/napa/page";
import VacavilleLocationPage, {
  metadata as vacavilleMetadata,
} from "./(site)/locations/vacaville/page";
import PaymentPlansPage, {
  metadata as paymentMetadata,
} from "./(site)/payment-plans/page";
import TermsPage, { metadata as termsMetadata } from "./(site)/terms/page";
import { GET as getUpcomingEvents } from "./(site)/upcoming-events/route";
import LegacyBookingConfirmationPage, {
  metadata as legacyBookingMetadata,
} from "./(site)/wpbc-booking-received/page";
import { GET as getLocationsKml } from "./locations.kml/route";

describe("preserved public records", () => {
  it("keeps legal terms canonical and aligned with the current cancellation policy", () => {
    const html = renderToStaticMarkup(<TermsPage />);

    expect(termsMetadata.alternates?.canonical).toBe("/terms");
    expect(html).toContain("at least 48 hours");
    expect(html).toContain('href="/cancellation-policy"');
    expect(html).toContain("info@experiencerella.com");
    expect(html).not.toContain("24 hours");
  });

  it("keeps the published giveaway terms at a noindex canonical route", () => {
    const html = renderToStaticMarkup(<GiveawayTermsPage />);

    expect(giveawayMetadata.alternates?.canonical).toBe("/giveaway-terms-and-conditions");
    expect(giveawayMetadata.robots).toEqual({ index: false, follow: true });
    expect(html).toContain("The promotion begins on [10/5/24]");
    expect(html).toContain("12 HydraFacials (one per month for a year)");
    expect(html).toContain("B12 Shots for Life (2 Winners)");
    expect(html).toContain("up to 50 units every 3 months");
  });

  it("restores the primary Payment Plans destination and Cherry information", () => {
    const html = renderToStaticMarkup(<PaymentPlansPage />);

    expect(paymentMetadata.alternates?.canonical).toBe("/payment-plans");
    expect(html).toContain("Payment Plans");
    expect(html).toContain("Cherry Financing");
    expect(html).toContain('id="all"');
  });

  it("keeps the old booking-received path helpful without starting a new booking", () => {
    const html = renderToStaticMarkup(<LegacyBookingConfirmationPage />);

    expect(legacyBookingMetadata.alternates?.canonical).toBe("/wpbc-booking-received");
    expect(legacyBookingMetadata.robots).toEqual({ index: false, follow: true });
    expect(html).toContain("previous booking system");
    expect(html).toContain('href="/contact"');
    expect(html).not.toMatch(/book\.experiencerella\.com|href="\/booking"/);
  });

  it("preserves the two-location KML endpoint", async () => {
    const response = getLocationsKml();
    const body = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("application/vnd.google-earth.kml+xml");
    expect(response.headers.get("x-robots-tag")).toBe("noindex, follow");
    expect(body).toContain("542 Main St, Vacaville, CA 95688");
    expect(body).toContain("1541 3rd St, Napa, CA 94559");
  });
});

describe("retired event URLs", () => {
  it.each([
    ["/events", getEvents],
    ["/upcoming-events", getUpcomingEvents],
  ])("returns an explicit 410 for %s", (_path, handler) => {
    const response = handler();

    expect(response.status).toBe(410);
    expect(response.headers.get("x-robots-tag")).toBe("noindex, nofollow");
    expect(response.headers.get("cache-control")).toContain("s-maxage");
  });
});

describe("internal SEO navigation", () => {
  it("restores Payment Plans to desktop, mobile, and footer navigation", () => {
    const header = renderToStaticMarkup(<Header />);
    const mobile = renderToStaticMarkup(
      <MobileNav links={navLinks} isOpen onClose={() => undefined} />,
    );
    const footer = renderToStaticMarkup(<Footer />);

    expect(header).toContain('href="/payment-plans"');
    expect(mobile).toContain('href="/payment-plans"');
    expect(footer).toContain('href="/payment-plans"');
  });

  it("links Napa service cards to the available city-specific pages", () => {
    const html = renderToStaticMarkup(<NapaLocationPage />);

    expect(html).toContain('href="/napa/botox"');
    expect(html).toContain('href="/napa/facials"');
  });

  it("links every Vacaville local page from the clinic page", () => {
    const html = renderToStaticMarkup(<VacavilleLocationPage />);

    for (const slug of [
      "botox",
      "chemical-peels",
      "facials",
      "filler",
      "hydrafacial",
      "laser",
      "microneedling",
    ]) {
      expect(html).toContain(`href="/vacaville/${slug}"`);
    }
  });

  it("lets the root title template add the brand only once", () => {
    expect(vacavilleMetadata.title).toBe("Vacaville Med Spa | Hours, Address & Booking");
  });
});
