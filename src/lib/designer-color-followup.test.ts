import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function tsxFiles(root: string): string[] {
  return readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const path = join(root, entry.name);
    if (entry.isDirectory()) return tsxFiles(path);
    return entry.isFile() && path.endsWith(".tsx") ? [path] : [];
  });
}

describe("designer color follow-up", () => {
  it("renders light/pink-surface eyebrows in Ink and preserves visible dark-surface exceptions", () => {
    const sources = [...tsxFiles("src/app"), ...tsxFiles("src/components")];
    const violations: string[] = [];
    const darkSurfaceCounts = new Map<string, number>();

    for (const path of sources) {
      const source = readFileSync(path, "utf8");
      for (const match of source.matchAll(/<p className="([^"]*)"/g)) {
        const classes = match[1];
        if (!classes.split(/\s+/).includes("italic")) continue;
        if (classes.split(/\s+/).includes("text-ink")) continue;
        if (classes.split(/\s+/).includes("text-white")) {
          darkSurfaceCounts.set(path, (darkSurfaceCounts.get(path) ?? 0) + 1);
          continue;
        }
        violations.push(`${path}: ${classes}`);
      }
    }

    expect(violations).toEqual([]);
    expect(Object.fromEntries(darkSurfaceCounts)).toEqual({
      "src/app/(site)/gallery/page.tsx": 1,
      "src/app/(site)/payment-plans/page.tsx": 1,
      "src/components/pages/LocationServicePage.tsx": 1,
      "src/components/pages/TreatmentServicePage.tsx": 3,
      "src/components/pages/WeightLossServicePage.tsx": 3,
    });
  });

  it("uses black footer copy while preserving the Rose logo", () => {
    const footer = readFileSync("src/components/layout/Footer.tsx", "utf8");

    expect(footer).toContain('/brand/rella-logo-rose.svg');
    expect(footer).toContain("pb-28 pt-16 text-ink xl:pb-8");
    expect(footer).toContain("text-sm leading-relaxed text-ink");
    expect(footer).toContain("tracking-[0.08em] text-ink");
    expect(footer).toContain("hover:text-ink/70");
    expect(footer).not.toContain("hover:text-rose");
  });

  it("uses white requested titles and Rose staff names", () => {
    const about = readFileSync("src/app/(site)/about/page.tsx", "utf8");
    const team = readFileSync("src/app/(site)/team/page.tsx", "utf8");
    const membership = readFileSync("src/app/(site)/membership/page.tsx", "utf8");

    expect(about).toContain("tracking-[0.06em] text-white md:text-6xl");
    expect(about).toContain("font-medium text-white\">Dr. Zachary Wagner, DO");
    expect(about).toContain("tracking-[0.06em] text-white md:text-4xl");
    expect(team).toContain("tracking-[0.06em] text-white md:text-6xl");
    expect(team).toContain("text-2xl font-medium text-rose");
    expect(team).toContain("py-5 text-lg font-medium text-rose");
    expect(team).toContain('className="bg-rose py-16 text-white md:py-20"');
    expect(team).toContain('variant="light"');
    expect(membership).toContain("tracking-[0.08em] text-white md:text-6xl");
    expect(membership).toContain("tracking-[0.08em] text-white md:text-5xl");
  });

  it("keeps the Napa campaign eyebrow text black", () => {
    const campaignCss = readFileSync(
      "src/app/(campaign)/napa/botox/napa-botox.css",
      "utf8",
    );

    expect(campaignCss).toMatch(
      /\.nb-eyebrow span \{[\s\S]*?font-style:\s*italic;[\s\S]*?color:\s*var\(--nb-ink\);/,
    );
  });
});
