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
  it("uses the canonical Napa reception and approved Vacaville storefront", () => {
    expect(HOME_LOCATION_VISUALS.map((location) => location.slug)).toEqual([
      "napa",
      "vacaville",
    ]);

    const napa = HOME_LOCATION_VISUALS.find((location) => location.slug === "napa");
    const vacaville = HOME_LOCATION_VISUALS.find(
      (location) => location.slug === "vacaville",
    );

    expect(napa?.image).toBe("/images/clinic/napa-reception.webp");
    expect(napa?.imageAlt).toBe(
      "The welcoming reception area inside the Rella Aesthetics Napa clinic",
    );
    expect(napa?.imagePosition).toBe("object-center");
    expect(napa?.frameAspect).toBe("aspect-[4/5]");
    expect(vacaville?.image).toBe("/images/clinic/vacaville-exterior.webp");
    expect(vacaville?.imageAlt).toBe(
      "The Rella Aesthetics storefront and pink entrance at the Vacaville clinic",
    );
    expect(vacaville?.imagePosition).toBe("object-center");
    expect(vacaville?.frameAspect).toBe("aspect-[4/5]");
    for (const location of HOME_LOCATION_VISUALS) {
      expect(existsSync(join(process.cwd(), "public", location.image))).toBe(true);
    }

    expect(source).not.toContain("napa-exterior");
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

  it("keeps the visual flat and booking-system neutral", () => {
    expect(source).toContain('frameAspect: "aspect-[4/5]"');
    expect(source).toContain("priority");
    expect(source).not.toContain("quality={90}");
    expect(source).not.toMatch(/gradient|shadow-/i);
    expect(source).not.toMatch(
      /dashboard\.boulevard\.io|joinblvd\.com|book\.experiencerella\.com|rella-hq/i,
    );
  });

  it("uses Ink labels on Rose controls", () => {
    expect(source).toContain("bg-white/90");
    expect(source).toContain("border-rose bg-rose");
    expect(source).toContain("text-ink");
    expect(source).not.toContain("bg-rose text-white");
  });
});
