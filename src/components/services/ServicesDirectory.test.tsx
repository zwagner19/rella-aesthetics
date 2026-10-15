import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { ServicesDirectory } from "@/components/services/ServicesDirectory";

describe("ServicesDirectory", () => {
  const html = renderToStaticMarkup(<ServicesDirectory />);

  it("keeps category exploration on the Services page", () => {
    expect(html).toContain("Explore Injectables");
    expect(html).toContain("Explore Skin");
    expect(html).toContain("Explore Lasers");
    expect(html).toContain("Explore Wellness");
    expect(html).toContain("Explore Medical Weight Loss");
    expect(html).not.toContain('href="/services/injectables"');
    expect(html).not.toContain('href="/services/skin"');
    expect(html).not.toContain('href="/services/lasers"');
    expect(html).not.toContain('href="/services/botox"');
    expect(html).not.toContain('href="/services/dermal-fillers"');
    expect(html).not.toContain('href="/services/facials"');
    expect(html).not.toContain('href="/services/hydrafacial"');
    expect(html).not.toContain('href="/services/chemical-peels"');
    expect(html).not.toContain('href="/services/microneedling"');
    expect(html).not.toContain('href="/services/laser-treatments"');
    expect(html).not.toContain('href="/services/iv-hydration"');
    expect(html).not.toContain('href="/services/weight-loss"');
  });

  it("lists the treatment summaries and working booking actions", () => {
    expect(html).toContain("Botox &amp; Dysport");
    expect(html).toContain("Dermal fillers");
    expect(html).toContain("HydraFacial");
    expect(html).toContain("Chemical peels");
    expect(html).toContain("Microneedling");
    expect(html).toContain("CO2 CoolPeel");
    expect(html).toContain("IV Hydration");
    expect(html).toContain("Book a Consultation");
    expect(html).toContain("tel:+17073582928");
    expect(html).toContain("https://book.rellaweightloss.com/book/vacaville/weight-loss-consult");
    expect(html).toContain("https://book.rellaweightloss.com/book/napa/weight-loss-consult");
    expect(html).toContain("category=injectables");
    expect(html).toContain("category=laser");
  });
});
