import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { LasersCategoryPage } from "@/components/pages/LasersCategoryPage";
import { TreatmentApproach } from "@/components/treatments/TreatmentApproach";
import { EditorialTreatmentPage } from "@/components/pages/EditorialTreatmentPage";
import { BotoxDysportServicePage } from "@/components/pages/BotoxDysportServicePage";
import { servicePages } from "@/lib/service-data";
import { getTreatmentEditorial } from "@/lib/treatment-editorial";
import {
  LASERS_CONCERNS,
  LASERS_DETAIL_HREF,
  LASERS_TOOLS,
} from "@/lib/lasers-category";

describe("LasersCategoryPage discovery prototype", () => {
  const html = renderToStaticMarkup(<LasersCategoryPage />);

  it("reads as a concern-led category page, not a treatment-detail clone", () => {
    expect(html).toContain("Lasers");
    expect(html).toContain("Your skin tells us where to start.");
    expect(html).toContain("The machine isn&#x27;t the treatment plan. Your skin is.");
    expect(html).toContain("Explore by concern");
    expect(html).toContain("Different tools. Different jobs.");
    expect(html).toContain("We choose the treatment after we meet the skin.");
    expect(html).toContain("You don&#x27;t need to know the device name.");
    expect(html).toContain("Start with your skin. We&#x27;ll figure out the rest.");
    expect(html).toContain("id=\"explore-by-concern\"");
    expect(html).not.toContain("Investment");
    expect(html).not.toContain("$420");
    expect(html).not.toContain("How the experience unfolds");
  });

  it("links verified concerns and tools to the real laser detail route", () => {
    for (const concern of LASERS_CONCERNS) {
      expect(html).toContain(concern.label.replaceAll("&", "&amp;"));
      for (const treatment of concern.possibleTreatments) {
        expect(treatment.href).toBe(LASERS_DETAIL_HREF);
      }
    }
    for (const tool of LASERS_TOOLS) {
      expect(html).toContain(tool.name);
      expect(tool.href).toBe(LASERS_DETAIL_HREF);
    }
    expect(html).toContain(`href="${LASERS_DETAIL_HREF}"`);
  });

  it("keeps public Lasers copy free of developer and booking-menu language", () => {
    expect(html).not.toContain("modality-specific");
    expect(html).not.toContain("not separate yet");
    expect(html).not.toContain("online laser menu");
    expect(html).not.toContain("Initial Laser Consult");
    expect(html).toContain(
      "Yes. Light- and laser-based care starts with a consultation",
    );
    expect(html).not.toContain("resurfacing is often planned as a single treatment");
  });

  it("shows only verified CoolPeel/laser Transform House assets", () => {
    expect(html).toContain("The Transform House");
    expect(html).toContain("CoolPeel");
    expect(html).not.toContain("ASSET NEEDED");
  });
});

describe("Wagner portrait cleanup on treatment detail pages", () => {
  it("keeps treatment-specific Approach copy without the founder portrait", () => {
    const approach = renderToStaticMarkup(
      <TreatmentApproach
        id="test-approach"
        headline="Settings follow assessment."
        lead="We don't treat trends. We treat you."
        body="IPL and CoolPeel are different tools."
      />,
    );
    expect(approach).toContain("Why at Rella?");
    expect(approach).toContain("Settings follow assessment.");
    expect(approach).not.toContain("dr-zachary-wagner");
    expect(approach).not.toContain("Founder");
  });

  it("removes the repeated Wagner portrait from editorial treatment pages", () => {
    const laser = servicePages.find((item) => item.slug === "laser-treatments")!;
    const editorial = getTreatmentEditorial("laser-treatments")!;
    const html = renderToStaticMarkup(
      <EditorialTreatmentPage service={laser} editorial={editorial} />,
    );
    expect(html).toContain("Why at Rella?");
    expect(html).toContain("Settings follow assessment");
    expect(html).not.toContain("dr-zachary-wagner");
    expect(html).not.toContain("Founder &amp; Owner");
  });

  it("removes the same portrait pattern from Botox without redesigning the page", () => {
    const html = renderToStaticMarkup(<BotoxDysportServicePage />);
    expect(html).toContain("Your face isn&#x27;t a formula.");
    expect(html).toContain("The Rella approach");
    expect(html).not.toContain("dr-zachary-wagner");
  });
});
