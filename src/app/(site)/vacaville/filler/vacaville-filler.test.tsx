import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import VacavilleFillerPage, { metadata } from "./page";
import { resolveBookingHref } from "@/lib/booking-routes";

const html = renderToStaticMarkup(<VacavilleFillerPage />);
const text = html
  .replace(/<!-- -->/g, "")
  .replace(/<[^>]+>/g, " ")
  .replace(/\s+/g, " ")
  .replace(/&amp;/g, "&")
  .replace(/&#x27;|&#39;/g, "'")
  .replace(/&ndash;/g, "–")
  .replace(/&mdash;/g, "—");

describe("Vacaville filler local-acquisition page", () => {
  it("uses unique, exact index metadata", () => {
    expect(metadata.title).toBe(
      "Lip & Dermal Filler in Vacaville | Pricing Guide",
    );
    expect(metadata.alternates?.canonical).toBe(
      "https://experiencerella.com/vacaville/filler",
    );
    expect(String(metadata.description).length).toBeGreaterThanOrEqual(70);
    expect(String(metadata.description).length).toBeLessThanOrEqual(180);
  });

  it("keeps every booking action on the custom Vacaville filler entry", () => {
    const expected = resolveBookingHref({
      location: "vacaville",
      service: "dermal-fillers",
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
    const destination = new URL(expected);
    expect(destination.hostname).toBe("book.experiencerella.com");
    expect(destination.searchParams.get("location")).toBe("vacaville");
    expect(destination.searchParams.get("service")).toBe("dermal-fillers");
    expect(expected).not.toContain("dashboard.boulevard.io");
  });

  it("shows approved pricing, location, hours, and conservative boundaries", () => {
    for (const fact of [
      "$840",
      "$540–$960",
      "$40/month",
      "one-year commitment",
      "Dermal Fillers",
      "Select a professional",
      "542 Main St",
      "Vacaville, CA 95688",
      "Tuesday–Friday: 9am–5pm",
      "Saturday: 9am–1pm",
      "Sunday–Monday: Closed",
    ]) {
      expect(text).toContain(fact);
    }
    expect(text).not.toContain("$700/syringe");
    expect(text).not.toContain("half syringe");
    expect(text).not.toContain("guaranteed");
    expect(text).not.toContain("permanent");
    expect(html).not.toMatch(/aggregateRating|ratingValue|reviewCount/);
  });

  it("keeps visible FAQ and FAQ schema in exact sync", () => {
    const jsonBlocks = [
      ...html.matchAll(
        /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g,
      ),
    ].map((match) => JSON.parse(match[1].replaceAll("&quot;", '"')));
    const faq = jsonBlocks.find((block) => block["@type"] === "FAQPage");

    expect(faq).toBeTruthy();
    expect(faq.mainEntity).toHaveLength(6);
    for (const item of faq.mainEntity) {
      expect(text).toContain(item.name);
      expect(text).toContain(item.acceptedAnswer.text);
    }
  });

  it("has one H1, supporting internal links, and no patient-data form", () => {
    expect(html.match(/<h1\b/g)).toHaveLength(1);
    expect(html).not.toMatch(/<form|<input|<textarea|<select/);
    expect(html).toContain('href="/membership"');
    expect(html).toContain('href="/services/dermal-fillers"');
    expect(html).toContain('href="/locations/vacaville"');
  });
});
