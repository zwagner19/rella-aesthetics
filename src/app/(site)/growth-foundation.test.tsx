import { existsSync, readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import NapaPage, { metadata as napaMetadata } from "./locations/napa/page";
import VacavillePage, {
  metadata as vacavilleMetadata,
} from "./locations/vacaville/page";
import { locations } from "@/lib/data";
import { localBusinessSchema } from "@/lib/schemas";
import GalleryPage, { metadata as galleryMetadata } from "./gallery/page";

describe("local-search location pages", () => {
  it("renders a complete Napa visit and booking journey", () => {
    const html = renderToStaticMarkup(<NapaPage />);
    expect(html).toContain("Med spa care in Napa, California");
    expect(html).toContain("1541 3rd St");
    expect(html).toContain("Book at Napa");
    expect(html).toContain("Get Directions");
    expect(html).toContain("Medical Weight Loss");
    expect(html).not.toContain('class="aspect-[4/3] bg-silver-pale rounded-lg"');
    expect(napaMetadata.alternates).toEqual({ canonical: "/locations/napa" });
  });

  it("renders a complete Vacaville visit and booking journey", () => {
    const html = renderToStaticMarkup(<VacavillePage />);
    expect(html).toContain("Med spa care in Vacaville, California");
    expect(html).toContain("542 Main St");
    expect(html).toContain("Book at Vacaville");
    expect(html).toContain("Get Directions");
    expect(vacavilleMetadata.alternates).toEqual({ canonical: "/locations/vacaville" });
  });

  it("publishes a location-specific medical-business entity", () => {
    const napaSchema = localBusinessSchema(locations.napa);
    expect(napaSchema["@type"]).toEqual(["MedicalBusiness", "DaySpa"]);
    expect(napaSchema.url).toBe("https://experiencerella.com/locations/napa");
    expect(napaSchema.hasMap).toBe(locations.napa.mapUrl);
    expect(napaSchema.address.streetAddress).toBe("1541 3rd St");
  });
});

describe("sitewide conversion foundation", () => {
  it("mounts one conversion observer and a mobile quick-booking bar", () => {
    const source = readFileSync("src/app/(site)/layout.tsx", "utf8");
    expect(source.match(/<ConversionTracker\s*\/\>/g)).toHaveLength(1);
    expect(source.match(/<MobileConversionBar\s*\/\>/g)).toHaveLength(1);
  });

  it("records a lead only after the contact API succeeds", () => {
    const source = readFileSync("src/app/(site)/contact/ContactForm.tsx", "utf8");
    const successCheck = source.indexOf("if (!res.ok)");
    const leadEvent = source.indexOf('dispatchConversion("contact_form_success")');
    expect(successCheck).toBeGreaterThan(-1);
    expect(leadEvent).toBeGreaterThan(successCheck);
  });
});

describe("trust and indexation foundation", () => {
  it("replaces the placeholder gallery with an honest results experience", () => {
    const html = renderToStaticMarkup(<GalleryPage />);
    expect(html).toContain("Results that still look like you");
    expect(html).toContain("Proper permission");
    expect(html).toContain("Individual results vary");
    expect(html).not.toContain("gallery-1.jpg");
    expect(html).not.toContain("Real patients, real results");
    expect(galleryMetadata.alternates).toEqual({ canonical: "/gallery" });
  });

  it("ships the authentic Dr. Wagner portrait used by the weight-loss page", () => {
    expect(existsSync("public/images/dr-zachary-wagner.jpg")).toBe(true);
    const source = readFileSync(
      "src/components/pages/WeightLossServicePage.tsx",
      "utf8",
    );
    expect(source).toContain("/images/dr-zachary-wagner.jpg");
    expect(source).toContain("American Board of Obesity Medicine diplomate");
  });

  it("declares canonical URLs on every ordinary index landing page", () => {
    const indexPages = [
      "src/app/(site)/page.tsx",
      "src/app/(site)/about/page.tsx",
      "src/app/(site)/blog/page.tsx",
      "src/app/(site)/contact/page.tsx",
      "src/app/(site)/gallery/page.tsx",
      "src/app/(site)/membership/page.tsx",
      "src/app/(site)/services/page.tsx",
      "src/app/(site)/locations/napa/page.tsx",
      "src/app/(site)/locations/vacaville/page.tsx",
    ];

    for (const page of indexPages) {
      expect(readFileSync(page, "utf8"), page).toContain("alternates:");
      expect(readFileSync(page, "utf8"), page).toContain("canonical:");
    }
  });
});
