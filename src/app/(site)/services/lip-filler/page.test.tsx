import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import LipFillerPage, { generateMetadata } from "@/app/(site)/services/lip-filler/page";
import sitemapConfig from "../../../../../next-sitemap.config.js";
import catalog from "@/lib/website-seo-catalog.json";

describe("lip filler page", () => {
  const html = renderToStaticMarkup(<LipFillerPage />);

  it("books both clinics through the shared injectable category", () => {
    for (const location of ["napa", "vacaville"]) {
      expect(html).toContain(
        `href="https://book.experiencerella.com/book?location=${location}&amp;category=injectables"`,
      );
    }
    expect(html).toContain("Lip Filler in Napa and Vacaville");
    expect(html).toContain('href="/services/botox"');
  });

  it("publishes a four-question FAQ schema and no prices", () => {
    const faqJson = html.match(/<script type="application\/ld\+json">(\{"@context":"https:\/\/schema.org","@type":"FAQPage".*?)<\/script>/);
    expect(faqJson).not.toBeNull();
    expect(JSON.parse(faqJson![1]).mainEntity).toHaveLength(4);
    expect(html).not.toMatch(/\$\d/);
  });

  it("keeps the canonical, title and sitemap/SEO catalog registration", async () => {
    const metadata = await generateMetadata();
    expect(metadata.alternates?.canonical).toBe("https://experiencerella.com/services/lip-filler");
    expect(catalog.some((page) => page.path === "/services/lip-filler")).toBe(true);
    const transform = sitemapConfig.transform!;
    const entry = await transform(sitemapConfig as never, "/services/lip-filler");
    expect(entry).toMatchObject({ loc: "/services/lip-filler", priority: 0.8 });
  });
});
