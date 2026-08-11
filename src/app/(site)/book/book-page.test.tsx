import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import BookPage, { metadata } from "./page";
import {
  BOOKING_LOCATION_CHOOSER,
  CUSTOM_BOOKING_ORIGIN,
  resolveBookingHref,
} from "@/lib/booking-routes";

const html = renderToStaticMarkup(<BookPage />);

describe("first-party clinic booking chooser", () => {
  it("offers exactly one location-pinned handoff per clinic", () => {
    expect(html.match(/data-booking-location=/g)).toHaveLength(2);
    expect(html.match(/data-cta="location-booking"/g)).toHaveLength(2);
    expect(html).toContain(`href="${resolveBookingHref({ location: "vacaville" }).replaceAll("&", "&amp;")}"`);
    expect(html).toContain(`href="${resolveBookingHref({ location: "napa" }).replaceAll("&", "&amp;")}"`);
  });

  it("does not expose any Boulevard widget destination", () => {
    expect(html).not.toContain('href="https://dashboard.boulevard.io/booking/businesses/a12f397a-6db3-4b18-bc34-01f02dfb7216/widget"');
    expect(html).not.toContain("%2Fcart%2Fmenu%2FPeels");
    expect(html).not.toContain("dashboard.boulevard.io");
    expect(html).not.toContain(`href="${BOOKING_LOCATION_CHOOSER}"`);
  });

  it("sends both clinic choices to the configured aesthetics custom app", () => {
    const bookingHrefs = [
      ...html.matchAll(/<a\b([^>]*)data-cta="location-booking"([^>]*)>/g),
    ].map((match) => {
      const attributes = `${match[1]} ${match[2]}`;
      return /href="([^"]+)"/.exec(attributes)?.[1]?.replaceAll("&amp;", "&");
    });

    expect(bookingHrefs).toHaveLength(2);
    const destinations = bookingHrefs.map((href) => new URL(href ?? ""));
    expect(
      destinations.every(
        (destination) => destination.origin === CUSTOM_BOOKING_ORIGIN,
      ),
    ).toBe(true);
    expect(
      destinations.every((destination) => destination.pathname === "/book"),
    ).toBe(true);
    expect(
      new Set(
        destinations.map((destination) =>
          destination.searchParams.get("location"),
        ),
      ),
    ).toEqual(
      new Set(["napa", "vacaville"]),
    );
  });

  it("is a focused, noindex handoff with no form or health-data collection", () => {
    expect(metadata.robots).toEqual({ index: false, follow: true });
    expect(html).not.toMatch(/<form|<input|<textarea|<select/);
    expect(html).toContain("707.358.2928");
  });

  it("puts each live-times action before the lower-priority clinic hours", () => {
    const vacavilleCard = /data-booking-location="vacaville"([\s\S]*?)<\/article>/.exec(html)?.[1] ?? "";
    const napaCard = /data-booking-location="napa"([\s\S]*?)<\/article>/.exec(html)?.[1] ?? "";

    expect(vacavilleCard.indexOf('data-cta="location-booking"')).toBeGreaterThanOrEqual(0);
    expect(vacavilleCard.indexOf('data-cta="location-booking"')).toBeLessThan(
      vacavilleCard.indexOf("Wednesday–Saturday"),
    );
    expect(napaCard.indexOf('data-cta="location-booking"')).toBeGreaterThanOrEqual(0);
    expect(napaCard.indexOf('data-cta="location-booking"')).toBeLessThan(
      napaCard.indexOf("Tuesday–Saturday"),
    );
  });
});
