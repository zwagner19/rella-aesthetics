import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { BotoxDysportServicePage } from "@/components/pages/BotoxDysportServicePage";
import { PRICING, VISIT } from "@/lib/napa-botox-facts";

const html = renderToStaticMarkup(<BotoxDysportServicePage />);

describe("BotoxDysportServicePage editorial refinement", () => {
  it("answers Rella feel with required editorial moments, not cards or clichés", () => {
    expect(html).toContain("Injectables");
    expect(html).toContain("Botox + Dysport");
    expect(html).toContain("Thoughtful placement. Natural movement. A plan built around your face.");
    expect(html).toContain("Movement is good. Looking rested is, too.");
    expect(html).toContain("Your face isn&#x27;t a formula.");
    expect(html).toContain("We don&#x27;t treat trends. We treat you.");
    expect(html).toContain("What we can address");
    expect(html).toContain("How the experience unfolds");
    expect(html).toContain(">Consult<");
    expect(html).toContain(">Treat<");
    expect(html).toContain(">Settle<");
    expect(html).toContain(">Maintain<");
    expect(html).toContain("The Transform House");
    expect(html).toContain("id=\"pricing\"");
    expect(html).toContain("Vacaville · Napa House");
    expect(html).toContain("Botox + Dysport FAQ");
    expect(html).toContain("Start with a conversation.");
    expect(html).not.toContain("AGELESS");
    expect(html).not.toContain("turn back the hands of time");
    expect(html).not.toContain("✓");
    expect(html).not.toContain("View pricing");
  });

  it("preserves verified pricing, timing, FAQ, and booking CTAs", () => {
    expect(html).toContain(`${PRICING.botoxPerUnit}`);
    expect(html).toContain(`${PRICING.dysportPerUnit}`);
    expect(html).toContain(`${PRICING.memberBotoxPerUnit}/unit`);
    expect(html).toContain(`${PRICING.memberDysportPerUnit}/unit`);
    expect(html).toContain(VISIT.durationCopy);
    expect(html).toContain("Assessed around two weeks");
    expect(html).toContain("Allē");
    expect(html).toContain("Aspire");
    expect(html).toContain("book.experiencerella.com");
    expect(html).toContain("data-cta=\"service-booking\"");
    expect(html).toContain("Does Botox hurt?");
  });

  it("shows only approved Botox/Dysport result assets when present", () => {
    expect(html).toContain("Before-and-after Botox result");
    expect(html).not.toContain("Lip Filler");
    expect(html).not.toContain("CoolPeel");
  });
});
