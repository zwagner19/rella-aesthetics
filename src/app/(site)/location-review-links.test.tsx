import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import HomePage from "./page";
import ContactPage from "./contact/page";
import { LocationCard } from "@/components/blocks/LocationCard";
import { locations } from "@/lib/data";

vi.mock("next/headers", () => ({
  headers: async () => new Headers([["host", "experiencerella.com"]]),
}));

const clinicReviewLinks = [
  ["Vacaville", locations.vacaville, "https://g.page/r/CRzs_DqKMyuWEBM/review"],
  ["Napa", locations.napa, "https://g.page/r/CcUDgqqvRr8MEBM/review"],
] as const;

describe("location-specific Google review links", () => {
  it("keeps each verified one-tap URL in the shared location data", () => {
    for (const [, location, expectedUrl] of clinicReviewLinks) {
      expect(location.googleReviewUrl).toBe(expectedUrl);
    }
  });

  it("renders a named, accessible external review action without an onsite form", () => {
    for (const [clinicName, location] of clinicReviewLinks) {
      const html = renderToStaticMarkup(
        <LocationCard
          name={location.name}
          address={location.address}
          city={location.city}
          state={location.state}
          zip={location.zip}
          hours={[...location.hours]}
          href={`/locations/${clinicName.toLowerCase()}`}
          googleReviewUrl={location.googleReviewUrl}
        />,
      );

      expect(html).toContain(`href="${location.googleReviewUrl}"`);
      expect(html).toContain('target="_blank"');
      expect(html).toContain('rel="noreferrer"');
      expect(html).toContain(`Leave a Google review for Rella ${clinicName}`);
      expect(html).toContain("opens in a new tab");
      expect(html).toContain("border-rose bg-white");
      expect(html).toContain("text-rose");
      expect(html).toContain("↗");
      expect(html).not.toContain("&amp;NEARR;");
      expect(html).not.toMatch(/<form|<input|<textarea/);
    }
  });

  it("places both clinic-specific actions on Home and Contact", async () => {
    const pages = [
      renderToStaticMarkup(await HomePage()),
      renderToStaticMarkup(await ContactPage({})),
    ];

    for (const html of pages) {
      for (const [clinicName, location] of clinicReviewLinks) {
        expect(html).toContain(`href="${location.googleReviewUrl}"`);
        expect(html).toContain(`Leave a Google review for Rella ${clinicName}`);
      }
    }
  });
});
