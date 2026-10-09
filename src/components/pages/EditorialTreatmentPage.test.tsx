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

  it("keeps IV hydration call-assisted and screening-led", () => {
    const html = renderSlug("iv-hydration");
    expect(html).toContain("Hydration with clinical judgment.");
    expect(html).toContain("Call About IV Hydration");
    expect(html).toContain("tel:+17073582928");
    expect(html).toContain("data-cta=\"phone\"");
    expect(html).toContain("Suitability comes before the drip.");
    expect(html).not.toContain("The Transform House");
  });

  it("keeps Vacaville-only peels and microneedling single-house", () => {
    const peels = renderSlug("chemical-peels");
    expect(peels).toContain("Vacaville");
    expect(peels).not.toContain("Vacaville · Napa House");
    expect(peels).toContain("Universal Peel");

    const micro = renderSlug("microneedling");
    expect(micro).toContain("Vacaville");
    expect(micro).not.toContain("Vacaville · Napa House");
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
