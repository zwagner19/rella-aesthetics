import { existsSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { TreatmentServicePage } from "@/components/pages/TreatmentServicePage";
import { BOULEVARD_WIDGET_GENERIC } from "@/lib/booking-routes";
import { membershipTiers } from "@/lib/data";
import { treatmentServiceSchema } from "@/lib/schemas";
import { servicePages } from "@/lib/service-data";
import { generateMetadata } from "./services/[slug]/page";

const catalog = servicePages.filter((service) => service.slug !== "weight-loss");

function decodeRenderedText(html: string) {
  return html
    .replaceAll("&amp;", "&")
    .replaceAll("&#x27;", "'")
    .replaceAll("&quot;", '"');
}

describe("polished service catalog", () => {
  it("renders every treatment as a complete visual booking journey", () => {
    expect(catalog).toHaveLength(8);

    for (const service of catalog) {
      const html = renderToStaticMarkup(<TreatmentServicePage service={service} />);
      const decoded = decodeRenderedText(html);
      expect(html, service.slug).toContain(`<h1`);
      expect(decoded, service.slug).toContain(service.heroTitle);
      expect(decoded, service.slug).toContain(service.whatItIs.heading);
      expect(decoded, service.slug).toContain(service.pricing.body);
      expect(decoded, service.slug).toContain("Vacaville");
      expect(decoded, service.slug).toContain("Napa");
      expect(html, service.slug).toContain(BOULEVARD_WIDGET_GENERIC.replace(/&/g, "&amp;"));
      expect(html.match(/data-cta="service-booking"/g), service.slug).toHaveLength(3);
      expect(existsSync(`public${service.image}`), service.image).toBe(true);
    }
  });

  it("adds canonical, share-image, and service structured data coverage", async () => {
    for (const service of catalog) {
      const metadata = await generateMetadata({
        params: Promise.resolve({ slug: service.slug }),
      });
      expect(metadata.alternates).toEqual({ canonical: `/services/${service.slug}` });
      expect(metadata.openGraph?.images).toEqual([
        { url: service.image, alt: service.title },
      ]);

      const schema = treatmentServiceSchema(service);
      expect(schema.url).toBe(`https://experiencerella.com/services/${service.slug}`);
      expect(schema.provider["@id"]).toBe("https://experiencerella.com/#organization");
      expect(schema.areaServed.map((area) => area.name)).toEqual(["Vacaville", "Napa"]);
    }
  });
});

describe("public pricing and claims integrity", () => {
  it("uses the binding 2026 Tox prices everywhere new patients see a plan", () => {
    const botox = servicePages.find((service) => service.slug === "botox");
    expect(botox?.pricing.body).toContain("Botox is $18/unit");
    expect(botox?.pricing.body).toContain("Dysport is $6/unit");
    expect(botox?.pricing.body).toContain("$30/month");
    expect(botox?.pricing.body).toContain("$13/unit");
    expect(botox?.pricing.body).toContain("$4.40/unit");

    expect(membershipTiers).toHaveLength(1);
    expect(membershipTiers[0].price).toBe("$30");
    expect(membershipTiers[0].benefits).toContain("One-year membership commitment");
  });

  it("removes superseded price and IV benefit claims from acquisition copy", () => {
    const publicCopy = JSON.stringify({ servicePages, membershipTiers });
    for (const banned of [
      "$4.33",
      '"$20"',
      "Botox at $10/unit",
      "Dysport at $3.33/unit",
      "100% absorption",
      "Hangover relief",
      "Immune support during cold and flu season",
    ]) {
      expect(publicCopy, banned).not.toContain(banned);
    }
  });

  it("uses only canon-backed exact pricing on the remaining catalog", () => {
    const expected = {
      botox: ["$18/unit", "$6/unit", "$30/month", "$13/unit", "$4.40/unit"],
      "dermal-fillers": ["$840", "$540", "$960"],
      hydrafacial: ["$240", "$300", "$390"],
      "laser-treatments": ["$420", "$1,440"],
    } as const;

    for (const service of catalog) {
      const dollarAmounts = service.pricing.body.match(/\$(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d+)?(?:\/\w+)?/g) ?? [];
      const approved = expected[service.slug as keyof typeof expected] ?? [];
      expect(dollarAmounts, service.slug).toEqual([...approved]);
    }
  });
});
