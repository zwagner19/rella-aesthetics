import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import nextConfig from "../../../next.config";

describe("unlisted Black Friday page", () => {
  it("has no navigation or footer link and remains excluded from sitemap generation", () => {
    for (const path of ["src/components/layout/Header.tsx", "src/components/layout/Footer.tsx", "src/components/layout/MobileConversionBar.tsx"]) {
      expect(readFileSync(path, "utf8")).not.toContain("/gift-cards");
    }
    expect(readFileSync("next-sitemap.config.js", "utf8")).toContain("/gift-cards/**");
  });
  it("keeps noindex and nofollow in both metadata and transport headers on all hosts", async () => {
    const page = readFileSync("src/app/(site)/gift-cards/black-friday/page.tsx", "utf8");
    expect(page).toContain("robots: { index: false, follow: false }");
    const headers = await nextConfig.headers!();
    expect(headers.find(rule => rule.source === "/gift-cards/:path*")?.headers)
      .toContainEqual({ key: "X-Robots-Tag", value: "noindex, nofollow" });
  });
  it("does not expose demo or demo email routes on production", () => {
    for (const path of ["src/app/(site)/gift-cards/black-friday/demo/page.tsx", "src/app/gift-cards/black-friday/demo/email/[kind]/route.ts"]) {
      const source = readFileSync(path, "utf8");
      expect(source).toContain('process.env.VERCEL_ENV === "production"');
      expect(source).toMatch(/notFound\(|status: 404/);
    }
  });
});
