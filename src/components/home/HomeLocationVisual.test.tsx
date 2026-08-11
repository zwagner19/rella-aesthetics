import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  HOME_LOCATION_VISUALS,
  HomeLocationVisual,
} from "./HomeLocationVisual";

const source = readFileSync(join(__dirname, "HomeLocationVisual.tsx"), "utf8");

describe("homepage location visual", () => {
  it("uses only the two approved existing still-image fallbacks", () => {
    expect(HOME_LOCATION_VISUALS.map((location) => location.slug)).toEqual([
      "napa",
      "vacaville",
    ]);

    for (const location of HOME_LOCATION_VISUALS) {
      expect(existsSync(join(process.cwd(), "public", location.image))).toBe(true);
      expect(location.image).toMatch(/^\/images\/service-(botox|facials)\.jpg$/);
    }

    expect(source).not.toMatch(/<video|\.mp4|autoplay/i);
  });

  it("renders an accessible pressed-state control for either clinic", () => {
    for (const location of HOME_LOCATION_VISUALS) {
      const html = renderToStaticMarkup(
        <HomeLocationVisual initialLocation={location.slug} />,
      );

      expect(html).toContain('role="group"');
      expect(html).toContain('aria-label="Choose a Rella clinic view"');
      expect(html.match(/aria-pressed=/g)).toHaveLength(2);
      expect(html).toContain(location.address);
      expect(html).toContain(location.imageAlt);
    }
  });

  it("keeps the homepage visual flat and free of booking-system ownership", () => {
    expect(source).not.toMatch(/gradient|shadow-/i);
    expect(source).not.toMatch(
      /dashboard\.boulevard\.io|joinblvd\.com|book\.experiencerella\.com|rella-hq/i,
    );
  });
});
