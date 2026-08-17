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
  it("uses the approved Google Business Profile schedules as the data source", () => {
    expect(locations.napa.hours).toEqual([
      "Thursday–Saturday: 9am–5pm",
      "Sunday–Wednesday: Closed",
    ]);
    expect(locations.vacaville.hours).toEqual([
      "Tuesday–Friday: 9am–5pm",
      "Saturday: 9am–1pm",
      "Sunday–Monday: Closed",
    ]);
    expect(NAPA.hoursCopy).toBe("Open Thursday – Saturday · 9am – 5pm");
    expect(NAPA.hoursCopy).not.toContain("Tuesday – Saturday");
  });

  it("renders the correct schedule on both location pages and Contact", async () => {
    const napa = visibleText(renderToStaticMarkup(<NapaPage />));
    const vacaville = visibleText(renderToStaticMarkup(<VacavillePage />));
    const contact = visibleText(renderToStaticMarkup(await ContactPage({})));

    expect(napa).toContain("Thursday–Saturday: 9am–5pm");
    expect(napa).toContain("Sunday–Wednesday: Closed");
    expect(vacaville).toContain("Tuesday–Friday: 9am–5pm");
    expect(vacaville).toContain("Saturday: 9am–1pm");
    expect(vacaville).toContain("Sunday–Monday: Closed");
    expect(contact).toContain(
      "Vacaville: Tuesday–Friday: 9am–5pm · Saturday: 9am–1pm · Sunday–Monday: Closed",
    );
    expect(contact).toContain(
      "Napa: Thursday–Saturday: 9am–5pm · Sunday–Wednesday: Closed",
    );

    for (const text of [napa, vacaville, contact]) {
      expect(text).not.toContain("Monday–Friday: 9am–5pm");
      expect(text).not.toContain("Tuesday–Saturday: 9am–5pm");
      expect(text).not.toContain("Wednesday–Saturday: 9am–5pm");
    }
  });

  it("mirrors each visible schedule in per-location structured data", () => {
    const napa = localBusinessSchema(locations.napa);
    const vacaville = localBusinessSchema(locations.vacaville);

    expect(napa.openingHoursSpecification).toEqual([
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Thursday", "Friday", "Saturday"],
        opens: "09:00",
        closes: "17:00",
      },
    ]);
    expect(vacaville.openingHoursSpecification).toEqual([
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "17:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday"],
        opens: "09:00",
        closes: "13:00",
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
    expect(post?.keyFacts).toContain("Clinic hours: Thursday–Saturday, 9am–5pm");
    expect(JSON.stringify(post?.sections)).toContain(
      "Current clinic hours are Thursday through Saturday, 9am to 5pm",
    );
    expect(JSON.stringify(post)).not.toContain("Tuesday through Saturday");
    expect(JSON.stringify(post)).not.toContain("Tuesday–Saturday");
    expect(JSON.stringify(post)).not.toContain("Wednesday through Saturday");
  });
});
