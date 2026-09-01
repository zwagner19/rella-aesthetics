import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const flattenedEditorialSurfaces = [
  "src/app/(site)/napa/facials/page.tsx",
  "src/app/(site)/vacaville/botox/page.tsx",
  "src/app/(site)/vacaville/chemical-peels/page.tsx",
  "src/app/(site)/vacaville/facials/page.tsx",
  "src/app/(site)/vacaville/filler/page.tsx",
  "src/app/(site)/vacaville/hydrafacial/page.tsx",
  "src/app/(site)/vacaville/laser/page.tsx",
  "src/app/(site)/vacaville/microneedling/page.tsx",
  "src/app/(site)/blog/page.tsx",
  "src/components/blog/BlogCard.tsx",
  "src/components/blog/LocalEditorialPost.tsx",
] as const;

function productionVisualSources(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return productionVisualSources(path);
    if (!/\.(?:css|ts|tsx)$/.test(entry.name) || entry.name.includes(".test.")) return [];
    return [path];
  });
}

describe("Aug. 9 flat editorial design contract", () => {
  it.each(flattenedEditorialSurfaces)(
    "%s stays free of retired visual treatments",
    (file) => {
      const source = readFileSync(file, "utf8");

      expect(source, file).not.toMatch(/gradient/i);
      expect(source, file).not.toMatch(/shadow/i);
      expect(source, file).not.toMatch(/rounded-\[/i);
      expect(source, file).not.toMatch(/hover:(?:-translate|scale)/i);
    },
  );

  it("keeps every production color literal inside the four-color system", () => {
    const approvedBases = new Set(["#f7a19a", "#83888d", "#1a1a1a", "#ffffff"]);

    for (const file of productionVisualSources("src")) {
      const source = readFileSync(file, "utf8");
      const literals = source.match(/#[0-9a-f]{6}(?:[0-9a-f]{2})?\b/gi) ?? [];

      for (const literal of literals) {
        expect(approvedBases.has(literal.slice(0, 7).toLowerCase()), `${file}: ${literal}`).toBe(true);
      }
    }
  });

  it("labels Rose step circles with Ink even inside white-text bands", () => {
    for (const file of productionVisualSources("src")) {
      const source = readFileSync(file, "utf8");
      for (const line of source.split("\n")) {
        if (!/rounded-full.*\bbg-rose\b.*text-xs/.test(line)) continue;
        expect(line, file).toMatch(/\btext-ink\b/);
      }
    }
  });
});
