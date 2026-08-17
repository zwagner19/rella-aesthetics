import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import GiveawayTermsPage, {
  metadata as giveawayMetadata,
} from "./(site)/giveaway-terms-and-conditions/page";
import { GET as getLocationsKml } from "./locations.kml/route";

describe("legacy public records", () => {
  it("preserves the published 2024 giveaway terms without indexing the archive", () => {
    const html = renderToStaticMarkup(<GiveawayTermsPage />);

    expect(giveawayMetadata.alternates?.canonical).toBe("/giveaway-terms-and-conditions");
    expect(giveawayMetadata.robots).toEqual({ index: false, follow: true });
    expect(html).toContain("The promotion begins on [10/5/24]");
    expect(html).toContain("12 HydraFacials (one per month for a year)");
    expect(html).toContain("B12 Shots for Life (2 Winners)");
    expect(html).toContain("valued at $[2400]");
    expect(html).toContain("valued at $8000");
    expect(html).toContain("up to 50 units every 3 months");
    expect((html.match(/<h1/g) ?? [])).toHaveLength(1);
  });

  it("preserves the approved two-location KML endpoint", async () => {
    const response = getLocationsKml();
    const body = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("application/vnd.google-earth.kml+xml");
    expect(response.headers.get("x-robots-tag")).toBe("noindex, follow");
    expect(body).toContain("542 Main St, Vacaville, CA 95688");
    expect(body).toContain("Tuesday–Friday, 9am–5pm · Saturday, 9am–1pm");
    expect(body).toContain("1541 3rd St, Napa, CA 94559");
    expect(body).toContain("Thursday–Saturday, 9am–5pm");
    expect(body).not.toContain("Wednesday–Saturday, 9am–5pm");
    expect(body).not.toContain("Tuesday–Saturday, 9am–5pm");
  });
});
