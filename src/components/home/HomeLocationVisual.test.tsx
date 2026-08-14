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
  it("uses the verified Vacaville still and does not mislabel a missing Napa exterior", () => {
    expect(HOME_LOCATION_VISUALS.map((location) => location.slug)).toEqual([
      "napa",
      "vacaville",
    ]);

    const napa = HOME_LOCATION_VISUALS.find((location) => location.slug === "napa");
    const vacaville = HOME_LOCATION_VISUALS.find(
      (location) => location.slug === "vacaville",
    );

    expect(napa?.image).toBeNull();
    expect(napa?.imageAlt).toBeNull();
    expect(vacaville?.image).toBe(
      "/images/clinic/vacaville-treatment-room.jpg",
    );
    expect(vacaville?.imageAlt).toContain("Rella Aesthetics");
    expect(existsSync(join(process.cwd(), "public", vacaville?.image ?? ""))).toBe(
      true,
    );

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
      if (location.imageAlt) {
        expect(html).toContain(location.imageAlt);
      } else {
        expect(html).toContain("Rella Aesthetics Napa");
        expect(html).toContain("Downtown Napa");
      }
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
