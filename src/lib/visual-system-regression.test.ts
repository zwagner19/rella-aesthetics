import { readFileSync } from "node:fs";
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
});
