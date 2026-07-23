import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { locations } from "@/lib/data";
import { localBusinessSchema } from "@/lib/schemas";

const NAPA_STREET = "1541 3rd St";
const VACAVILLE_STREET = "542 Main St";

const napaPageSource = readFileSync(
  path.resolve(__dirname, "..", "src", "app", "locations", "napa", "page.tsx"),
  "utf8",
);
const vacavillePageSource = readFileSync(
  path.resolve(
    __dirname,
    "..",
    "src",
    "app",
    "locations",
    "vacaville",
    "page.tsx",
  ),
  "utf8",
);

describe("per-location schema addresses", () => {
  it("Napa schema emits Napa's address and never Vacaville's", () => {
    const json = JSON.stringify(localBusinessSchema(locations.napa));
    expect(json).toContain(NAPA_STREET);
    expect(json).toContain('"addressLocality":"Napa"');
    expect(json).not.toContain(VACAVILLE_STREET);
    expect(json).not.toContain("Vacaville");
  });

  it("Vacaville schema emits Vacaville's address and never Napa's", () => {
    const json = JSON.stringify(localBusinessSchema(locations.vacaville));
    expect(json).toContain(VACAVILLE_STREET);
    expect(json).toContain('"addressLocality":"Vacaville"');
    expect(json).not.toContain(NAPA_STREET);
    expect(json).not.toContain('"addressLocality":"Napa"');
  });

  it("the Napa page renders schema from locations.napa only", () => {
    expect(napaPageSource).toContain("locations.napa");
    expect(napaPageSource).not.toContain("locations.vacaville");
    expect(napaPageSource).not.toContain(VACAVILLE_STREET);
  });

  it("the Vacaville page renders schema from locations.vacaville only", () => {
    expect(vacavillePageSource).toContain("locations.vacaville");
    expect(vacavillePageSource).not.toContain("locations.napa");
    expect(vacavillePageSource).not.toContain(NAPA_STREET);
  });

  it("location pages keep location intent in their booking CTA", () => {
    expect(napaPageSource).toContain("BOOKING_URL_NAPA");
    expect(napaPageSource).not.toContain("BOOKING_URL_VACAVILLE");
    expect(vacavillePageSource).toContain("BOOKING_URL_VACAVILLE");
    expect(vacavillePageSource).not.toContain("BOOKING_URL_NAPA");
  });
});
