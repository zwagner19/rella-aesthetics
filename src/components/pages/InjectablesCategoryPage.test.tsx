import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { InjectablesCategoryPage } from "@/components/pages/InjectablesCategoryPage";
import {
  BOTOX_HREF,
  FILLERS_HREF,
  INJECTABLES_GOALS,
  INJECTABLES_TOOLS,
} from "@/lib/injectables-category";

describe("InjectablesCategoryPage discovery", () => {
  const html = renderToStaticMarkup(<InjectablesCategoryPage />);

  it("reads as a goal-led category page, not a treatment-detail clone", () => {
    expect(html).toContain("Injectables");
    expect(html).toContain("Start with the face. Not the syringe.");
    expect(html).toContain("Not every line needs treating.");
    expect(html).toContain("Explore by goal");
    expect(html).toContain("Different intentions. Different products.");
    expect(html).toContain("Your face isn&#x27;t a formula.");
    expect(html).toContain("You don&#x27;t need to choose the syringe.");
    expect(html).toContain("Start with what you want to keep.");
    expect(html).toContain('id="explore-by-goal"');
    expect(html).not.toContain("Investment");
    expect(html).not.toContain("$18/unit");
    expect(html).not.toContain("How the experience unfolds");
    expect(html).not.toContain("modality-specific");
    expect(html).not.toContain("not separate yet");
  });

  it("links verified goals and tools to real injectable detail routes", () => {
    for (const goal of INJECTABLES_GOALS) {
      expect(html).toContain(goal.label.replaceAll("&", "&amp;"));
      for (const treatment of goal.possibleTreatments) {
        expect([BOTOX_HREF, FILLERS_HREF]).toContain(treatment.href);
      }
    }
    for (const tool of INJECTABLES_TOOLS) {
      expect(html).toContain(tool.name.replaceAll("&", "&amp;"));
      expect([BOTOX_HREF, FILLERS_HREF]).toContain(tool.href);
    }
    expect(html).toContain(`href="${BOTOX_HREF}"`);
    expect(html).toContain(`href="${FILLERS_HREF}"`);
  });

  it("shows verified injectable Transform House assets", () => {
    expect(html).toContain("The Transform House");
    expect(html).toContain("Botox");
    expect(html).toContain("Lip");
    expect(html).not.toContain("ASSET NEEDED");
  });
});
