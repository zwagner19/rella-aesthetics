import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { BotoxDysportServicePage } from "@/components/pages/BotoxDysportServicePage";
import { PRICING, VISIT } from "@/lib/napa-botox-facts";

const html = renderToStaticMarkup(<BotoxDysportServicePage />);

describe("BotoxDysportServicePage editorial prototype", () => {
  it("renders the eleven-section architecture without card-grid glance or trend clichés", () => {
    expect(html).toContain("Injectables");
    expect(html).toContain("Botox + Dysport");
    expect(html).toContain("Individualized neuromodulator care.");
    expect(html).toContain("What we can address");
    expect(html).toContain("We don&#x27;t treat trends. We treat you.");
    expect(html).toContain("How the experience unfolds");
    expect(html).toContain("The Transform House");
    expect(html).toContain("id=\"pricing\"");
    expect(html).toContain("Hospitality in every visit.");
    expect(html).toContain("Botox + Dysport FAQ");
    expect(html).toContain("Start with a conversation.");
    expect(html).not.toContain("AGELESS");
    expect(html).not.toContain("turn back the hands of time");
    expect(html).not.toContain("✓");
  });

  it("preserves verified pricing, timing, and booking CTAs from canon", () => {
    expect(html).toContain(`${PRICING.botoxPerUnit}/unit`);
    expect(html).toContain(`${PRICING.dysportPerUnit}/unit`);
    expect(html).toContain(`${PRICING.memberBotoxPerUnit}/unit`);
    expect(html).toContain(`${PRICING.memberDysportPerUnit}/unit`);
    expect(html).toContain(VISIT.durationCopy);
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
