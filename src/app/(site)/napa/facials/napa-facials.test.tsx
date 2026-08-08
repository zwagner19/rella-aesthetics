import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { resolveBookingHref } from "@/lib/booking-routes";
import NapaFacialsPage, { metadata } from "./page";

const html = renderToStaticMarkup(<NapaFacialsPage />);
const text = html
  .replace(/<!-- -->/g, "")
  .replace(/<[^>]+>/g, " ")
  .replace(/\s+/g, " ")
  .replace(/&amp;/g, "&")
  .replace(/&#x27;|&#39;/g, "'")
  .replace(/&ndash;/g, "–")
  .replace(/&mdash;/g, "—");

describe("Napa facials local-acquisition page", () => {
  it("uses unique, exact index metadata", () => {
    expect(metadata.title).toBe("Facials in Napa | Skin Consult & Options");
    expect(metadata.alternates?.canonical).toBe(
      "https://experiencerella.com/napa/facials",
    );
    expect(String(metadata.description).length).toBeGreaterThanOrEqual(70);
    expect(String(metadata.description).length).toBeLessThanOrEqual(180);
  });

  it("keeps every booking action on the rendered Napa skin consult", () => {
    const expected = resolveBookingHref({
      location: "napa",
      service: "facials",
    });
    const bookingHrefs = [
      ...html.matchAll(/<a\b([^>]*)data-cta="service-booking"([^>]*)>/g),
    ].map((match) =>
      (/href="([^"]+)"/.exec(`${match[1]}${match[2]}`)?.[1] ?? "").replaceAll(
        "&amp;",
        "&",
      ),
    );

    expect(bookingHrefs).toHaveLength(3);
    expect(new Set(bookingHrefs)).toEqual(new Set([expected]));
    expect(expected).toContain("Facials%2Fs_3ae8bab0-f23c-45d2-b265-3836289df3a1");
    expect(expected).toContain("locationId=91eba843-57fb-49e9-8505-431d501ffec7");
    expect(expected).not.toContain("0f146f87-364e-4dfd-b938-61ba49528820");
  });

  it("shows the verified menu, consult next step, location, and pricing boundary", () => {
    for (const fact of [
      "Initial Skin Health Consult",
      "Microdermabrasion Deluxe Facial",
      "Anti Aging Facial",
      "Acne Facial",
      "Dermaplaning Deluxe Facial",
      "Select a professional",
      "current total before proceeding",
      "1541 3rd St",
      "Tuesday–Saturday, 9am–5pm",
    ]) {
      expect(text).toContain(fact);
    }

    for (const forbidden of [
      "Vacaville",
      "safe for all skin types",
      "no downtime",
      "instant glow",
      "immediate results",
      "guaranteed",
      "cures acne",
      "treats acne",
      "same-week",
    ]) {
      expect(text.toLowerCase()).not.toContain(forbidden.toLowerCase());
    }
    expect(text).not.toMatch(/\$\d/);
    expect(html).not.toMatch(/aggregateRating|ratingValue|reviewCount|Offer/);
  });

  it("keeps visible FAQ and FAQ schema in exact sync", () => {
    const jsonBlocks = [
      ...html.matchAll(
        /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g,
      ),
    ].map((match) => JSON.parse(match[1].replaceAll("&quot;", '"')));
    const faq = jsonBlocks.find((block) => block["@type"] === "FAQPage");
    const service = jsonBlocks.find((block) => block["@type"] === "Service");

    expect(faq).toBeTruthy();
    expect(faq.mainEntity).toHaveLength(6);
    for (const item of faq.mainEntity) {
      expect(text).toContain(item.name);
      expect(text).toContain(item.acceptedAnswer.text);
    }
    expect(service.areaServed.name).toBe("Napa");
  });

  it("has one H1, supporting internal links, and no patient-data form", () => {
    expect(html.match(/<h1\b/g)).toHaveLength(1);
    expect(html).not.toMatch(/<form|<input|<textarea|<select/);
    for (const href of [
      "/services/facials",
      "/napa/hydrafacial",
      "/napa/laser",
      "/locations/napa",
      "/cancellation-policy",
    ]) {
      expect(html).toContain(`href="${href}"`);
    }
  });
});
