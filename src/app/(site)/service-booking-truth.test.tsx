import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import ServicePage from "@/app/(site)/services/[slug]/page";
import NapaFacialsPage from "@/app/(site)/napa/facials/page";
import NapaMicroneedlingPage from "@/app/(site)/napa/microneedling/page";
import VacavilleChemicalPeelsPage from "@/app/(site)/vacaville/chemical-peels/page";
import VacavilleFacialsPage from "@/app/(site)/vacaville/facials/page";
import VacavilleHydrafacialPage from "@/app/(site)/vacaville/hydrafacial/page";
import VacavilleLaserPage from "@/app/(site)/vacaville/laser/page";
import VacavilleMicroneedlingPage from "@/app/(site)/vacaville/microneedling/page";
import { mapIntentToTreatmentKey } from "@/lib/guided-booking/catalog";
import type { GuidedTreatment } from "@/lib/guided-booking/types";

async function renderService(slug: string): Promise<string> {
  const page = await ServicePage({ params: Promise.resolve({ slug }) });
  return renderToStaticMarkup(page);
}

describe("service booking truth", () => {
  it.each([
    ["chemical-peels", "peels"],
    ["microneedling", "microneedling"],
  ] as const)("offers %s at both clinics without preselecting a treatment", async (slug, category) => {
    const html = await renderService(slug);
    for (const location of ["vacaville", "napa"]) {
      expect(html).toContain(
        `href="https://book.experiencerella.com/book?location=${location}&amp;category=${category}"`,
      );
    }
    expect(html).toContain(
      `href="https://book.experiencerella.com/book?category=${category}"`,
    );
    expect(html).toContain("Book in Napa");
    expect(html).toContain("Book in Vacaville");
  });

  it("sends the Napa microneedling clinic link to the in-site booking menu", async () => {
    const html = await renderService("microneedling");
    const napa = html.match(/<a[^>]*data-location="napa"[^>]*>/g) ?? [];
    const vacaville = html.match(/<a[^>]*data-location="vacaville"[^>]*>/g) ?? [];
    expect(napa).toHaveLength(1);
    expect(napa[0]).toContain("data-guided-booking");
    expect(vacaville).toHaveLength(1);
    expect(vacaville[0]).not.toContain("data-guided-booking");
  });

  it("opens IV hydration booking while retaining clinical screening guidance", async () => {
    const html = await renderService("iv-hydration");
    expect(html).toContain('href="https://book.experiencerella.com/book"');
    expect(html).toContain('href="https://book.experiencerella.com/book?location=napa"');
    expect(html).toContain('href="https://book.experiencerella.com/book?location=vacaville"');
    expect(html).toContain("Book IV Hydration");
    expect(html).toContain("Suitability comes before the drip.");
    expect(html).toContain("Clinical screening is still required before treatment.");
    expect(html).not.toContain("Call About IV Hydration");
    expect(html).not.toContain("Call-assisted");
  });
});

describe("local pages describe the live booking catalog", () => {
  it("keeps Napa facial examples without limiting the full live menu", () => {
    const html = renderToStaticMarkup(<NapaFacialsPage />);

    expect(html).toContain("Initial Skin Health Consult");
    expect(html).toContain("Signature HydraFacial");
    expect(html).toContain("Deluxe HydraFacial");
    expect(html).toContain("Platinum");
    expect(html).toContain("Live facial menu");
    expect(html).not.toMatch(/three facial options|Three online options/);
  });

  it("opens the in-site Napa booking menu at the microneedling consult", () => {
    const html = renderToStaticMarkup(<NapaMicroneedlingPage />);
    const ctas = html.match(/<a[^>]*data-cta="service-booking"[^>]*>/g) ?? [];

    expect(ctas).toHaveLength(2);
    for (const cta of ctas) {
      // Without the site shell the trigger renders its no-JS fallback link;
      // inside the shell it opens the guided booking modal.
      expect(cta).toContain("data-guided-booking");
    }
    expect(
      mapIntentToTreatmentKey({
        location: "napa",
        service: "microneedling",
        treatments: [{ key: "napa/microneedling-consult" } as GuidedTreatment],
      }),
    ).toBe("napa/microneedling-consult");
  });

  it("routes Napa microneedling to the Napa category without naming unconfirmed devices", () => {
    const html = renderToStaticMarkup(<NapaMicroneedlingPage />);

    expect(html).toContain(
      'href="https://book.experiencerella.com/book?location=napa&amp;category=microneedling"',
    );
    expect(html).toContain("Microneedling in Downtown Napa");
    expect(html).toContain("Standard &amp; RF microneedling");
    expect(html).toContain("1541 3rd St");
    expect(html).toContain('href="/locations/napa"');
    expect(html).toContain('href="/napa/facials"');
    expect(html).toContain('"@type":"FAQPage"');
    expect(html).not.toMatch(/SkinPen|Skin Stylus|\$\d/);
  });

  it("includes Deluxe and Platinum in Vacaville facial discovery", () => {
    const html = renderToStaticMarkup(<VacavilleFacialsPage />);

    expect(html).toContain("Initial Skin Health Consult");
    expect(html).toContain("Signature HydraFacial");
    expect(html).toContain("Deluxe");
    expect(html).toContain("Platinum");
    expect(html).toContain("Live facial menu");
    expect(html).not.toMatch(/two facial options|Two online options/);
  });

  it("offers all three verified Vacaville HydraFacial tiers through the live menu", () => {
    const html = renderToStaticMarkup(<VacavilleHydrafacialPage />);

    for (const tier of ["Signature", "Deluxe", "Platinum"]) {
      expect(html).toContain(tier);
    }
    expect(html).toContain("Live HydraFacial menu");
    expect(html).not.toMatch(/Signature only|Only Signature|One currently online|not currently exposed|Other tiers by phone/);
  });

  it("keeps consultation guidance without hiding live laser and microneedling treatments", () => {
    const laserHtml = renderToStaticMarkup(<VacavilleLaserPage />);
    const microneedlingHtml = renderToStaticMarkup(
      <VacavilleMicroneedlingPage />,
    );

    expect(laserHtml).toContain("Live laser menu");
    expect(laserHtml).toContain("Book Initial Laser Consult");
    expect(laserHtml).toContain("require the Initial Laser Consult before IPL");
    expect(laserHtml).not.toContain("current online option is the Initial Laser Consult");
    expect(microneedlingHtml).toContain("Live microneedling menu");
    expect(microneedlingHtml).toContain(
      "Book Initial Microneedling Consult",
    );
    expect(microneedlingHtml).toContain("SkinPen");
    expect(microneedlingHtml).toContain("RF Microneedling");
    expect(microneedlingHtml).not.toContain("currently lists the Initial Microneedling Consult");
  });

  it("keeps the Universal Peel example alongside the other verified live peel options", () => {
    const html = renderToStaticMarkup(<VacavilleChemicalPeelsPage />);

    expect(html).toContain("Live peel menu");
    expect(html).toContain("90-minute Universal Peel");
    expect(html).toContain("Book Universal Peel");
    for (const peel of ["MicroPeel Sensitive", "MicroPeel Plus 30", "TCA Peel"]) {
      expect(html).toContain(peel);
    }
    expect(html).not.toMatch(/One peel is currently|Vacaville-only booking/);
  });
});
