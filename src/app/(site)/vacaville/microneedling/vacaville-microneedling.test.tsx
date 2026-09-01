import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { resolveBookingHref } from "@/lib/booking-routes";
import VacavilleMicroneedlingPage, { metadata } from "./page";

const html = renderToStaticMarkup(<VacavilleMicroneedlingPage />);
const text = html
  .replace(/<!-- -->/g, "")
  .replace(/<[^>]+>/g, " ")
  .replace(/\s+/g, " ")
  .replace(/&amp;/g, "&")
  .replace(/&#x27;|&#39;/g, "'")
  .replace(/&ndash;/g, "–")
  .replace(/&mdash;/g, "—");

describe("Vacaville microneedling local-acquisition page", () => {
  it("uses unique, exact index metadata", () => {
    expect(metadata.title).toBe("Microneedling in Vacaville | Consult & Options");
    expect(metadata.alternates?.canonical).toBe(
      "https://experiencerella.com/vacaville/microneedling",
    );
    expect(String(metadata.description).length).toBeGreaterThanOrEqual(70);
    expect(String(metadata.description).length).toBeLessThanOrEqual(180);
  });

  it("keeps every booking action on the custom Vacaville microneedling entry", () => {
    const expected = resolveBookingHref({
      location: "vacaville",
      service: "microneedling",
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
    expect(destination.searchParams.get("service")).toBe("microneedling");
    expect(expected).not.toContain("dashboard.boulevard.io");
  });

  it("shows verified options, location facts, and a safe clinical boundary", () => {
    for (const fact of [
      "Skin Stylus Microneedling",
      "RF Microneedling",
      "Initial Microneedling Consult",
      "Select a professional",
      "542 Main St",
      "Tuesday–Friday, 9am–5pm",
      "Saturday, 9am–1pm",
      "Sunday–Monday: Closed",
      "burns, scarring, fat loss, disfigurement, and nerve damage",
    ]) {
      expect(text).toContain(fact);
    }

    for (const forbidden of [
      "Napa",
      "safe for all skin types",
      "no downtime",
      "3–6 sessions",
      "optimal results",
      "guaranteed results",
    ]) {
      expect(text.toLowerCase()).not.toContain(forbidden.toLowerCase());
    }
    expect(text).not.toMatch(/\$\d/);
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
    expect(html).toContain('href="/services/microneedling"');
    expect(html).toContain('href="/locations/vacaville"');
    expect(html).toContain('href="/cancellation-policy"');
    expect(html).toContain("https://www.fda.gov/medical-devices/");
  });
});
