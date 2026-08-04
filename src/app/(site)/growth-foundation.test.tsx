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
import AboutPage, { metadata as aboutMetadata } from "./about/page";
import { physicianOwnerSchema } from "@/lib/schemas";

describe("local-search location pages", () => {
  it("renders a complete Napa visit and booking journey", () => {
    const html = renderToStaticMarkup(<NapaPage />);
    expect(html).toContain("Med spa care in Napa, California");
    expect(html).toContain("1541 3rd St");
    expect(html).toContain("Book at Napa");
    expect(html).toContain("Get Directions");
    expect(html).toContain("Medical Weight Loss");
    expect(html).toContain('href="/napa"');
    expect(html).toContain("Explore the Napa Service Hub");
    expect(html).toContain('href="/napa/hyperhidrosis"');
    expect(html).toContain("Excessive Sweating Care");
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
    expect(source).toContain("result.accepted === true");
    expect(source).toContain('href="tel:+17073582928"');
    expect(source).toContain('href="mailto:info@experiencerella.com"');
    expect(source).toContain('name="location"');
    expect(source).toContain("Preferred Clinic");
    expect(source).toContain("No preference — help me choose");
    expect(source).toContain('value="Membership Questions"');
    expect(source).toContain("Please do not include sensitive medical information");
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

  it("makes Dr. Wagner and his verified ABOM credential visible on About", () => {
    const html = renderToStaticMarkup(<AboutPage />);
    expect(html).toContain("Zachary Wagner, DO");
    expect(html).toContain("American Board of Obesity Medicine diplomate");
    expect(html).toContain("/images/dr-zachary-wagner.jpg");
    expect(html).toContain("Physician Owner");
    expect(html).not.toContain("she leads");
    expect(html).not.toContain('class="aspect-[4/5] bg-silver-pale rounded-lg"');
    expect(aboutMetadata.alternates).toEqual({ canonical: "/about" });
  });

  it("publishes Dr. Wagner as the physician owner with an ABOM credential", () => {
    const schema = physicianOwnerSchema();
    expect(schema.jobTitle).toBe("Physician Owner");
    expect(schema.hasCredential.name).toBe(
      "American Board of Obesity Medicine diplomate",
    );
    expect(schema.worksFor["@id"]).toBe(
      "https://experiencerella.com/#organization",
    );
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
