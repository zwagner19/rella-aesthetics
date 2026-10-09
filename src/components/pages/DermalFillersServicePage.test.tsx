import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { DermalFillersServicePage } from "@/components/pages/DermalFillersServicePage";

const html = renderToStaticMarkup(<DermalFillersServicePage />);

describe("DermalFillersServicePage refinement", () => {
  it("delivers editorial hero, philosophy, areas, and plan framing", () => {
    expect(html).toContain("Injectables");
    expect(html).toContain("A little volume. A lot of intention.");
    expect(html).toContain("Volume and contour planned around the features you want to keep.");
    expect(html).toContain("Explore areas");
    expect(html).toContain("More isn&#x27;t the goal. Better balance is.");
    expect(html).toContain("Lips. Cheeks. Balance.");
    expect(html).toContain("Cheeks &amp; midface");
    expect(html).toContain("Facial balancing");
    expect(html).toContain("Nasolabial folds");
    expect(html).toContain("Marionette lines");
    expect(html).toContain("We treat the whole face.");
    expect(html).toContain("Why at Rella?");
    expect(html).toContain("The Transform House");
    expect(html).toContain("Honest proportions. Real patients.");
    expect(html).toContain("Consult. Plan. Treat. Settle.");
    expect(html).toContain("Your plan comes first.");
    expect(html).toContain("id=\"plan\"");
    expect(html).toContain("Dermal Fillers FAQ");
    expect(html).toContain("Start with the plan — not the syringe.");
    expect(html).toContain("service-fillers.jpg");
    expect(html).toContain("object-[38%_42%]");
    expect(html).toContain("md:object-[32%_38%]");
    expect(html).not.toContain("✓");
    expect(html).not.toContain("Botox + Dysport");
    expect(html).not.toContain("Thoughtful placement. Natural movement.");
  });

  it("removes all public filler price figures", () => {
    expect(html).not.toContain("$840");
    expect(html).not.toContain("$540");
    expect(html).not.toContain("$960");
    expect(html).not.toContain("540–$960");
    expect(html).not.toContain("contact for pricing");
    expect(html).toContain("not from a public menu");
    expect(html).toContain("book.experiencerella.com");
    expect(html).toContain("data-cta=\"service-booking\"");
  });

  it("elevates attributed filler Transform House results only", () => {
    expect(html).toContain("Lip Filler");
    expect(html).toContain("Under Eye Filler");
    expect(html).not.toContain("Before-and-after Botox result");
    expect(html).not.toContain("CoolPeel");
    expect(html).not.toContain("Deluxe HydraFacial");
  });

  it("keeps FAQ free of price ranges", () => {
    expect(html).toContain("How long do fillers last?");
    expect(html).toContain("How much filler will I need?");
    expect(html).not.toMatch(/\$\d/);
  });
});
