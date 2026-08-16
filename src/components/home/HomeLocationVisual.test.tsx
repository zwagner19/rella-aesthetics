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
  it("uses the verified Napa storefront and Vacaville treatment-room still", () => {
    expect(HOME_LOCATION_VISUALS.map((location) => location.slug)).toEqual([
      "napa",
      "vacaville",
    ]);

    const napa = HOME_LOCATION_VISUALS.find((location) => location.slug === "napa");
    const vacaville = HOME_LOCATION_VISUALS.find(
      (location) => location.slug === "vacaville",
    );

    expect(napa?.image).toBe("/images/clinic/rella-team-storefront.webp");
    expect(napa?.imageAlt).toBe("The Rella Aesthetics team outside the Napa clinic");
    expect(vacaville?.image).toBe("/images/clinic/vacaville-treatment-room.jpg");
    expect(vacaville?.imageAlt).toBe("A treatment room inside the Vacaville clinic");
    for (const location of HOME_LOCATION_VISUALS) {
      expect(existsSync(join(process.cwd(), "public", location.image))).toBe(true);
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

  it("uses the requested translucent-white Rose location controls", () => {
    expect(source).toContain("bg-white/90");
    expect(source).toContain("text-rose");
    expect(source).toContain("bg-rose text-white");
    expect(source).not.toContain("bg-ink");
  });
});
