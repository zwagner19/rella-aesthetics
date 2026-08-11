import { existsSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { TreatmentServicePage } from "@/components/pages/TreatmentServicePage";
import { BOOKING_LOCATION_CHOOSER, resolveBookingHref } from "@/lib/booking-routes";
import { membershipTiers, services } from "@/lib/data";
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
      const availableLocations = service.availableLocations ?? ["vacaville", "napa"];
      for (const location of availableLocations) {
        expect(decoded, service.slug).toContain(
          location === "vacaville" ? "Vacaville" : "Napa",
        );
      }
      expect(html, service.slug).toContain('id="book-service"');
      expect(html.match(/data-cta="booking-flow-start"/g), service.slug).toHaveLength(2);

      const bookingAnchors = [
        ...html.matchAll(/<a[^>]*data-cta="service-booking"[^>]*>/g),
      ];
      const bookingHrefs = bookingAnchors.map(
        (match) => /href="([^"]+)"/.exec(match[0])?.[1],
      );
      const expectedHrefs = availableLocations.map((location) =>
        resolveBookingHref({ location, service: service.slug }).replaceAll("&", "&amp;"),
      );

      expect(bookingHrefs, service.slug).toHaveLength(availableLocations.length * 2);
      expect(new Set(bookingHrefs), service.slug).toEqual(new Set(expectedHrefs));
      expect(bookingHrefs, service.slug).not.toContain(BOOKING_LOCATION_CHOOSER);
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
      expect(schema.areaServed.map((area) => area.name)).toEqual(
        (service.availableLocations ?? ["vacaville", "napa"]).map((location) =>
          location === "vacaville" ? "Vacaville" : "Napa",
        ),
      );
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
    expect(botox?.pricing.note).toContain("Allē rewards for Botox");
    expect(botox?.pricing.note).toContain("Aspire rewards for Dysport");

    expect(membershipTiers).toHaveLength(3);
    expect(membershipTiers[0].price).toBe("$30");
    expect(membershipTiers[0].benefits).toContain("One-year membership commitment");
    expect(membershipTiers[1]).toEqual(
      expect.objectContaining({ name: "Filler Membership", price: "$40" }),
    );
    expect(membershipTiers[2]).toEqual(
      expect.objectContaining({ name: "Tox + Filler Membership", price: "$50" }),
    );
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

  it("hands IV visitors to the city-pinned custom chooser without adopting vendor claims", () => {
    const ivHydration = servicePages.find(
      (service) => service.slug === "iv-hydration",
    );
    const html = renderToStaticMarkup(
      <TreatmentServicePage service={ivHydration!} />,
    );

    expect(html).toContain("location=vacaville&amp;service=iv-hydration");
    expect(html).toContain("location=napa&amp;service=iv-hydration");
    expect(html).not.toContain("dashboard.boulevard.io");

    for (const unsafeVendorLabel of [
      "Hangover Cure",
      "Immunity Blend",
      "Migraine/Pain Relief",
    ]) {
      expect(html).not.toContain(unsafeVendorLabel);
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

  it("keeps the Botox acquisition copy inside the approved temporary-improvement boundary", () => {
    const botox = servicePages.find((service) => service.slug === "botox");
    const listing = services.find((service) => service.slug === "botox");
    const publicCopy = JSON.stringify({ botox, listing });

    for (const unsupported of [
      "prevent new wrinkles",
      "prevent wrinkles",
      "prevent expression lines",
      "Preventive treatment",
      "muscles adapt",
      "spread slightly more",
      "ideal for larger areas",
      "Schedule a touch-up at 3–4 months",
    ]) {
      expect(publicCopy, unsupported).not.toContain(unsupported);
    }

    expect(botox?.metaDescription).toContain("Temporarily soften the appearance");
    expect(botox?.whatItIs.body).toContain("temporarily reduce targeted muscle activity");
    expect(botox?.whatToExpect.steps).toContain(
      "Review of possible temporary effects, aftercare, and when normal activities can resume",
    );
    expect(botox?.faq.find((item) => item.question.includes("difference"))?.answer).toContain(
      "non-interchangeable units",
    );
  });

  it("scopes the current chemical-peel journey to the live Vacaville menu", () => {
    const peels = servicePages.find((service) => service.slug === "chemical-peels");
    expect(peels?.availableLocations).toEqual(["vacaville"]);
    expect(peels?.metaTitle).toBe("Chemical Peels in Vacaville, CA");

    const publicCopy = JSON.stringify(peels);
    for (const currentService of [
      "MicroPeel Sensitive",
      "MicroPeel Plus 20",
      "TCA Peel",
      "Universal Peel",
    ]) {
      expect(publicCopy).toContain(currentService);
    }
    for (const unsupported of [
      "We offer light, medium, and deep",
      "Deep peels",
      "3–7 days of visible peeling",
      "significant improvement after 3–6 treatments",
    ]) {
      expect(publicCopy, unsupported).not.toContain(unsupported);
    }

    const html = renderToStaticMarkup(<TreatmentServicePage service={peels!} />);
    expect(html).toContain("Book in Vacaville");
    expect(html).not.toContain("Book in Napa");
    expect(treatmentServiceSchema(peels!).areaServed.map((area) => area.name)).toEqual([
      "Vacaville",
    ]);
  });

  it("keeps microneedling scoped to the verified Vacaville inventory", () => {
    const microneedling = servicePages.find(
      (service) => service.slug === "microneedling",
    );
    expect(microneedling?.availableLocations).toEqual(["vacaville"]);
    expect(microneedling?.metaTitle).toBe("Microneedling in Vacaville, CA");

    const html = renderToStaticMarkup(
      <TreatmentServicePage service={microneedling!} />,
    );
    expect(html).toContain("Book in Vacaville");
    expect(html).toContain(
      "This service is currently listed in the Vacaville booking menu.",
    );
    expect(html).toContain('href="/vacaville/microneedling"');
    expect(html).not.toContain("Book in Napa");
    expect(treatmentServiceSchema(microneedling!).areaServed.map((area) => area.name)).toEqual([
      "Vacaville",
    ]);
  });

  it("connects the shared facial guide to the Vacaville acquisition page", () => {
    const facials = servicePages.find((service) => service.slug === "facials");
    const html = renderToStaticMarkup(
      <TreatmentServicePage service={facials!} />,
    );

    expect(html).toContain('href="/vacaville/facials"');
    expect(html).toContain("View Vacaville options &amp; visit guide");
    expect(html).toContain('href="/napa/facials"');
    expect(html).toContain("View Napa options &amp; visit guide");
    expect(html).toContain("Book in Vacaville");
    expect(html).toContain("Book in Napa");
  });

  it("keeps shared service copy free of universal outcomes and fixed recovery promises", () => {
    const publicCopy = JSON.stringify(servicePages);

    for (const unsupported of [
      "zero downtime",
      "No downtime",
      "suitable for all skin types",
      "All skin types including",
      "immediate results",
      "instantly visible",
      "walk out glowing",
      "optimal results",
      "Most fillers last 6–18 months",
      "Some purging is normal",
      "facials pair well",
      "providing an added safety measure",
      "Downtime: IPL 1–3 days",
      "Laser hair removal needs 6–8 sessions",
      "new collagen develops over 4–6 weeks",
      "return to their daily routine immediately",
      "No anesthesia is needed",
    ]) {
      expect(publicCopy, unsupported).not.toContain(unsupported);
    }

    expect(publicCopy).toContain("Recovery and visible response vary by person");
    expect(publicCopy).toContain("not everyone is an appropriate candidate");
    expect(publicCopy).toContain("risks, including burns, scarring, infection");
  });
});
