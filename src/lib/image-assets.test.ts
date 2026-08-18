import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { services } from "@/lib/data";
import {
  requiredMarketingImages,
  serviceImageCrops,
} from "@/lib/image-assets";

const PUBLIC = join(__dirname, "..", "..", "public");

describe("marketing image assets (Pass 2)", () => {
  it("every required static asset exists under /public", () => {
    const missing = requiredMarketingImages.filter(
      (path) => !existsSync(join(PUBLIC, path.replace(/^\//, ""))),
    );
    expect(missing, `Missing assets: ${missing.join(", ")}`).toEqual([]);
  });

  it("each service declares a deliberate object-position crop", () => {
    for (const service of services) {
      expect(service.imagePosition, service.slug).toBeTruthy();
      expect(serviceImageCrops[service.slug], service.slug).toBe(service.imagePosition);
    }
  });

  it("service card images use the wide 16:9 source ratio at 4:3 display", () => {
    for (const service of services) {
      expect(service.image).toMatch(/^\/images\/service-.+\.jpg$/);
    }
  });
});
