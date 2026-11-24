import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import Co2LaserPage, { generateMetadata } from "@/app/(site)/services/co2-laser/page";

describe("CO2 laser and CoolPeel service page", () => {
  const html = renderToStaticMarkup(<Co2LaserPage />);

  it("renders the requested heading, sections, and acne-scar anchor", () => {
    expect(html).toContain("CO2 Laser Resurfacing and CoolPeel</h1>");
    expect(html).toContain("CoolPeel vs traditional CO2");
    expect(html).toContain('id="acne-scars"');
    expect(html).toContain("Downtime, step by step");
    expect(html).toContain("Season &amp; sun care");
  });

  it("books only through the shared laser chooser for each clinic", () => {
    expect(html).toContain('href="https://book.experiencerella.com/book?category=laser"');
    for (const location of ["napa", "vacaville"]) {
      expect(html).toContain(
        `href="https://book.experiencerella.com/book?location=${location}&amp;category=laser"`,
      );
    }
  });

  it("uses clinic facts from repo data and publishes FAQ and Service schema", () => {
    expect(html).toContain("542 Main St");
    expect(html).toContain("1541 3rd St");
    expect(html).toContain("Wednesday–Saturday: 9am–5pm");
    expect(html).toContain('"@type":"FAQPage"');
    expect(html).toContain('"@id":"https://experiencerella.com/services/co2-laser#service"');
  });

  it("keeps the canonical on the services route", async () => {
    const metadata = await generateMetadata();
    expect(metadata.alternates?.canonical).toBe("https://experiencerella.com/services/co2-laser");
  });
});
