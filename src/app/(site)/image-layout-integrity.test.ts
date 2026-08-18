import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(path, "utf8");

const homeSource = read("src/app/(site)/page.tsx");
const servicesSource = read("src/app/(site)/services/page.tsx");
const aboutSource = read("src/app/(site)/about/page.tsx");
const locationVisualSource = read("src/components/home/HomeLocationVisual.tsx");
const serviceCardSource = read("src/components/blocks/ServiceCard.tsx");
const treatmentSource = read("src/components/pages/TreatmentServicePage.tsx");
const weightLossSource = read("src/components/pages/WeightLossServicePage.tsx");
const editorialSource = read("src/components/blog/LocalEditorialPost.tsx");

const localServicePages = [
  "src/app/(site)/napa/facials/page.tsx",
  "src/app/(site)/vacaville/botox/page.tsx",
  "src/app/(site)/vacaville/chemical-peels/page.tsx",
  "src/app/(site)/vacaville/facials/page.tsx",
  "src/app/(site)/vacaville/filler/page.tsx",
  "src/app/(site)/vacaville/hydrafacial/page.tsx",
  "src/app/(site)/vacaville/laser/page.tsx",
  "src/app/(site)/vacaville/microneedling/page.tsx",
] as const;

describe("responsive image-layout integrity", () => {
  it("reserves stable, source-appropriate space for the primary homepage photos", () => {
    expect(locationVisualSource).toContain('frameAspect: "aspect-[4/5]"');
    expect(locationVisualSource).toContain('frameAspect: "aspect-[4/5]"');
    expect(locationVisualSource).toContain("md:aspect-auto");
    expect(locationVisualSource).toContain("preload");
    expect(locationVisualSource).toContain("quality={90}");
    expect(locationVisualSource).toContain('imagePosition: "object-[50%_54%]"');

    expect(homeSource).toMatch(
      /aspect-\[4\/5\][\s\S]*?rella-sidewalk-sign\.webp[\s\S]*?object-cover object-center/,
    );
    expect(homeSource).toMatch(
      /aspect-\[4\/3\][\s\S]*?medical-weight-loss\.webp[\s\S]*?object-cover object-center/,
    );
  });

  it("uses portrait frames for the approved portrait treatment photography", () => {
    expect(serviceCardSource).toContain("aspect-[4/5]");
    expect(serviceCardSource).toContain("object-cover object-center");
    expect(servicesSource).toContain("aspect-[4/5]");
    expect(servicesSource).toContain("aspect-[3/2]");
    expect(servicesSource).toContain("md:aspect-[16/7]");
    expect(treatmentSource).toContain("aspect-[4/5]");
    expect(treatmentSource).toContain("md:aspect-[4/3]");
    expect(weightLossSource).toContain("aspect-[4/3]");
    expect(aboutSource).toMatch(
      /aspect-\[3\/4\][\s\S]*?rella-consultation\.webp[\s\S]*?object-cover object-center/,
    );
  });

  it("keeps every pre-cropped local-service hero at a consistent mobile ratio", () => {
    for (const path of localServicePages) {
      const source = read(path);

      expect(source, path).toContain("aspect-square");
      expect(source, path).toContain("sm:aspect-[4/3]");
      expect(source, path).toContain("self-center overflow-hidden");
      expect(source, path).toContain("preload");
      expect(source, path).toContain("object-cover object-center");
      expect(source, path).not.toContain("min-h-[390px]");
      expect(source, path).not.toMatch(
        /alt="[^"]*(?:consultation at Rella|at Rella Aesthetics in)[^"]*"/i,
      );
    }
  });

  it("does not crop the information-bearing Napa pricing cover", () => {
    expect(editorialSource).toContain("aspect-[1731/909]");
    expect(editorialSource).toContain('className="object-contain"');
    expect(editorialSource).not.toContain("min-h-[240px]");
  });
});
