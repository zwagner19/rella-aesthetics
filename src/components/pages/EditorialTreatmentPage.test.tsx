import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { EditorialTreatmentPage } from "@/components/pages/EditorialTreatmentPage";
import { servicePages } from "@/lib/service-data";
import {
  EDITORIAL_TREATMENT_SLUGS,
  getTreatmentEditorial,
} from "@/lib/treatment-editorial";

function renderSlug(slug: string) {
  const service = servicePages.find((item) => item.slug === slug)!;
  const editorial = getTreatmentEditorial(slug)!;
  return renderToStaticMarkup(
    <EditorialTreatmentPage service={service} editorial={editorial} />,
  );
}

describe("EditorialTreatmentPage propagation", () => {
  it("links the existing clinic names to matching local treatment details while retaining booking", () => {
    const localPages = [
      ["chemical-peels", "/vacaville/chemical-peels", "Vacaville"],
      ["facials", "/vacaville/facials", "Vacaville"],
      ["facials", "/napa/facials", "Napa House"],
      ["hydrafacial", "/vacaville/hydrafacial", "Vacaville"],
      ["hydrafacial", "/napa/hydrafacial/", "Napa House"],
      ["laser-treatments", "/vacaville/laser", "Vacaville"],
      ["laser-treatments", "/napa/laser/", "Napa House"],
      ["microneedling", "/vacaville/microneedling", "Vacaville"],
    ];
    for (const [slug, href, name] of localPages) {
      const html = renderSlug(slug);
      expect(html).toContain(`<a href="${href}">${name}</a>`);
      expect(html).toMatch(/<a(?=[^>]*href="https:\/\/book\.experiencerella\.com\/)(?=[^>]*data-cta="service-booking")[^>]*>Book in Vacaville<\/a>/);
      expect(html).toMatch(/<a(?=[^>]*href="https:\/\/book\.experiencerella\.com\/)(?=[^>]*data-cta="service-booking")[^>]*>Book in Napa<\/a>/);
    }
  });

  it("covers every non-locked individual treatment slug", () => {
    expect([...EDITORIAL_TREATMENT_SLUGS].sort()).toEqual(
      [
        "chemical-peels",
        "facials",
        "hydrafacial",
        "iv-hydration",
        "laser-treatments",
        "microneedling",
      ].sort(),
    );
  });

  it("adapts laser pages around modalities and verified device pricing", () => {
    const html = renderSlug("laser-treatments");
    expect(html).toContain("The device is only half the decision.");
    expect(html).toContain("What we can plan");
    expect(html).toContain("IPL Full Face");
    expect(html).toContain("$420");
    expect(html).toContain("CO2 CoolPeel Full Face");
    expect(html).toContain("$1,440");
    expect(html).toContain("CoolPeel");
  });

  it("offers IV hydration booking and keeps clinical screening guidance", () => {
    const html = renderSlug("iv-hydration");
    expect(html).toContain("Hydration with clinical judgment.");
    expect(html).toContain("Book IV Hydration");
    expect(html).toContain("Clinical screening is still required before treatment.");
    expect(html).toContain("data-cta=\"service-booking\"");
    expect(html).toContain("Suitability comes before the drip.");
    expect(html).not.toContain("The Transform House");
  });

  it("offers peels and microneedling at both clinics", () => {
    const peels = renderSlug("chemical-peels");
    expect(peels).toContain("Vacaville");
    expect(peels).toContain("Vacaville · Napa House");
    expect(peels).toContain("Browse the live menu");

    const micro = renderSlug("microneedling");
    expect(micro).toContain("Vacaville");
    expect(micro).toContain("Vacaville · Napa House");
    expect(micro).toContain("Texture takes intention.");
  });

  it("renders HydraFacial tier pricing typographically", () => {
    const html = renderSlug("hydrafacial");
    expect(html).toContain("Signature");
    expect(html).toContain("$240");
    expect(html).toContain("Deluxe");
    expect(html).toContain("$300");
    expect(html).toContain("Platinum");
    expect(html).toContain("$390");
    expect(html).toContain("Deluxe HydraFacial");
  });
});
