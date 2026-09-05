import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import ServicePage from "@/app/(site)/services/[slug]/page";
import NapaFacialsPage from "@/app/(site)/napa/facials/page";
import VacavilleChemicalPeelsPage from "@/app/(site)/vacaville/chemical-peels/page";
import VacavilleFacialsPage from "@/app/(site)/vacaville/facials/page";
import VacavilleHydrafacialPage from "@/app/(site)/vacaville/hydrafacial/page";
import VacavilleLaserPage from "@/app/(site)/vacaville/laser/page";
import VacavilleMicroneedlingPage from "@/app/(site)/vacaville/microneedling/page";

async function renderService(slug: string): Promise<string> {
  const page = await ServicePage({ params: Promise.resolve({ slug }) });
  return renderToStaticMarkup(page);
}

describe("service booking truth", () => {
  it.each([
    ["chemical-peels", "peels"],
    ["microneedling", "microneedling"],
  ] as const)("pins %s CTAs to its only bookable clinic", async (slug, category) => {
    const html = await renderService(slug);
    const pinnedHref =
      `https://book.experiencerella.com/book?location=vacaville&amp;category=${category}`;

    expect(html.split(`href="${pinnedHref}"`).length - 1).toBe(3);
    expect(html).not.toContain(
      `href="https://book.experiencerella.com/book?category=${category}"`,
    );
    expect(html).not.toContain("Book in Napa");
  });

  it("makes IV hydration call-assisted instead of presenting a false online booking path", async () => {
    const html = await renderService("iv-hydration");

    expect([...html.matchAll(/href="tel:\+17073582928"/g)]).toHaveLength(3);
    expect([...html.matchAll(/data-cta="phone"/g)]).toHaveLength(3);
    expect(html).toContain("Call-assisted booking");
    expect(html).toContain("Call About IV Hydration");
    expect(html).not.toContain("book.experiencerella.com");
    expect(html).not.toContain(">Book IV Hydration<");
  });
});

describe("local pages match the production booking catalog", () => {
  it("lists the three Napa facial options currently exposed online", () => {
    const html = renderToStaticMarkup(<NapaFacialsPage />);

    expect(html).toContain("Initial Skin Health Consult");
    expect(html).toContain("Signature HydraFacial");
    expect(html).toContain("Deluxe HydraFacial");
    expect(html).toContain("Three online options");
    expect(html).not.toMatch(
      /Microdermabrasion Deluxe Facial|Anti Aging Facial|Acne Facial|Dermaplaning Deluxe Facial/,
    );
  });

  it("lists the two Vacaville facial options currently exposed online", () => {
    const html = renderToStaticMarkup(<VacavilleFacialsPage />);

    expect(html).toContain("Initial Skin Health Consult");
    expect(html).toContain("Signature HydraFacial");
    expect(html).toContain("Two online options");
    expect(html).not.toMatch(
      /Microdermabrasion|Express Facial|Acne Facial|Dermaplaning Facial/,
    );
  });

  it("distinguishes the bookable Signature HydraFacial from phone-confirmed tiers", () => {
    const html = renderToStaticMarkup(<VacavilleHydrafacialPage />);

    expect(html).toContain("Signature listed online");
    expect(html).toContain("One currently online");
    expect(html).toContain("not currently exposed in Vacaville&#x27;s online menu");
    expect(html).toContain("call Rella to confirm");
  });

  it("presents laser and microneedling as consult-only online flows", () => {
    const laserHtml = renderToStaticMarkup(<VacavilleLaserPage />);
    const microneedlingHtml = renderToStaticMarkup(
      <VacavilleMicroneedlingPage />,
    );

    expect(laserHtml).toContain("Initial consult online");
    expect(laserHtml).toContain("Book Initial Laser Consult");
    expect(laserHtml).toContain(
      "current online option is the Initial Laser Consult",
    );
    expect(microneedlingHtml).toContain("Initial consult online");
    expect(microneedlingHtml).toContain(
      "Book Initial Microneedling Consult",
    );
    expect(microneedlingHtml).toContain(
      "currently lists the Initial Microneedling Consult",
    );
  });

  it("lists only Universal Peel as currently bookable online", () => {
    const html = renderToStaticMarkup(<VacavilleChemicalPeelsPage />);

    expect(html).toContain("Universal Peel online");
    expect(html).toContain("90-minute service");
    expect(html).toContain("Book Universal Peel");
    expect(html).not.toMatch(/MicroPeel Sensitive|MicroPeel Plus 20|TCA Peel/);
  });
});
