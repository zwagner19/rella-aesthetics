import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { SkinCategoryPage } from "@/components/pages/SkinCategoryPage";
import {
  FACIALS_HREF,
  HYDRAFACIAL_HREF,
  LASERS_CATEGORY_HREF,
  MICRONEEDLING_HREF,
  PEELS_HREF,
  SKIN_CONCERNS,
  SKIN_PATHS,
} from "@/lib/skin-category";

const DETAIL_HREFS = new Set([
  FACIALS_HREF,
  HYDRAFACIAL_HREF,
  PEELS_HREF,
  MICRONEEDLING_HREF,
  LASERS_CATEGORY_HREF,
]);

describe("SkinCategoryPage discovery", () => {
  const html = renderToStaticMarkup(<SkinCategoryPage />);

  it("reads as a concern-led category page, not a treatment-detail clone", () => {
    expect(html).toContain("Skin");
    expect(html).toContain("Good skin isn&#x27;t one treatment.");
    expect(html).toContain("Your skin doesn&#x27;t need everything.");
    expect(html).toContain("Explore by concern");
    expect(html).toContain("Maintenance visits. Deeper resets. Light when needed.");
    expect(html).toContain("Treat the skin you have today.");
    expect(html).toContain("Start with the concern");
    expect(html).toContain("Better skin starts with a plan.");
    expect(html).toContain('id="explore-by-concern"');
    expect(html).not.toContain("Investment");
    expect(html).not.toContain("$240");
    expect(html).not.toContain("How the experience unfolds");
  });

  it("links verified concerns and paths to real routes, including Lasers overlap", () => {
    for (const concern of SKIN_CONCERNS) {
      expect(html).toContain(concern.label.replaceAll("&", "&amp;"));
      for (const treatment of concern.possibleTreatments) {
        expect(DETAIL_HREFS.has(treatment.href)).toBe(true);
      }
    }
    for (const path of SKIN_PATHS) {
      expect(html).toContain(path.name.replaceAll("&", "&amp;"));
      expect(DETAIL_HREFS.has(path.href)).toBe(true);
    }
    expect(html).toContain(`href="${LASERS_CATEGORY_HREF}"`);
    expect(html).toContain(`href="${HYDRAFACIAL_HREF}"`);
  });

  it("cross-links Lasers for pigment and texture overlap", () => {
    const pigment = SKIN_CONCERNS.find((concern) => concern.id === "pigment")!;
    const texture = SKIN_CONCERNS.find((concern) => concern.id === "texture")!;
    expect(pigment.possibleTreatments.some((t) => t.href === LASERS_CATEGORY_HREF)).toBe(
      true,
    );
    expect(texture.possibleTreatments.some((t) => t.href === LASERS_CATEGORY_HREF)).toBe(
      true,
    );
  });

  it("shows verified skin Transform House assets without laser-only CoolPeel", () => {
    expect(html).toContain("The Transform House");
    expect(html).toContain("HydraFacial");
    expect(html).toContain("Microneedling");
    expect(html).not.toContain(">CoolPeel<");
    expect(html).not.toContain("ASSET NEEDED");
  });
});
