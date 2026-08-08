import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import ContactPage from "./contact/page";
import NapaPage from "./locations/napa/page";
import VacavillePage from "./locations/vacaville/page";
import { locations } from "@/lib/data";
import { getLocalEditorialPost } from "@/lib/local-editorial-posts";
import { NAPA } from "@/lib/napa-botox-facts";
import { localBusinessSchema, medicalBusinessSchema } from "@/lib/schemas";

function visibleText(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&ndash;/g, "–")
    .replace(/&mdash;/g, "—")
    .replace(/\s+/g, " ");
}

describe("binding two-clinic hours", () => {
  it("uses the approved July 15 public schedules as the data source", () => {
    expect(locations.napa.hours).toEqual([
      "Tuesday–Saturday: 9am–5pm",
      "Sunday–Monday: Closed",
    ]);
    expect(locations.vacaville.hours).toEqual([
      "Wednesday–Saturday: 9am–5pm",
      "Sunday–Tuesday: Closed",
    ]);
    expect(NAPA.hoursCopy).toBe("Open Tuesday – Saturday · 9am – 5pm");
  });

  it("renders the correct schedule on both location pages and Contact", () => {
    const napa = visibleText(renderToStaticMarkup(<NapaPage />));
    const vacaville = visibleText(renderToStaticMarkup(<VacavillePage />));
    const contact = visibleText(renderToStaticMarkup(<ContactPage />));

    expect(napa).toContain("Tuesday–Saturday: 9am–5pm");
    expect(napa).toContain("Sunday–Monday: Closed");
    expect(vacaville).toContain("Wednesday–Saturday: 9am–5pm");
    expect(vacaville).toContain("Sunday–Tuesday: Closed");
    expect(contact).toContain("Vacaville: Wednesday–Saturday: 9am–5pm");
    expect(contact).toContain("Napa: Tuesday–Saturday: 9am–5pm");

    for (const text of [napa, vacaville, contact]) {
      expect(text).not.toContain("Monday–Friday: 9am–5pm");
      expect(text).not.toContain("Saturday: 9am–1pm");
    }
  });

  it("mirrors each visible schedule in per-location structured data", () => {
    const napa = localBusinessSchema(locations.napa);
    const vacaville = localBusinessSchema(locations.vacaville);

    expect(napa.openingHoursSpecification).toEqual([
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "09:00",
        closes: "17:00",
      },
    ]);
    expect(vacaville.openingHoursSpecification).toEqual([
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "09:00",
        closes: "17:00",
      },
    ]);

    const siteSchema = JSON.parse(JSON.stringify(medicalBusinessSchema()));
    const locationNodes = siteSchema["@graph"].filter(
      (node: { "@type": unknown }) => Array.isArray(node["@type"]),
    );
    expect(locationNodes).toHaveLength(2);
    expect(
      locationNodes.map((node: { openingHoursSpecification: unknown }) =>
        node.openingHoursSpecification,
      ),
    ).toEqual([
      vacaville.openingHoursSpecification,
      napa.openingHoursSpecification,
    ]);
  });

  it("keeps the local pricing article on the same Napa schedule", () => {
    const post = getLocalEditorialPost("botox-cost-napa");
    expect(post?.keyFacts).toContain("Clinic hours: Tuesday–Saturday, 9am–5pm");
    expect(JSON.stringify(post?.sections)).toContain(
      "Current clinic hours are Tuesday through Saturday, 9am to 5pm",
    );
    expect(JSON.stringify(post)).not.toContain("Wednesday through Saturday");
  });
});
