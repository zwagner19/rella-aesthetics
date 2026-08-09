import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(join(__dirname, "page.tsx"), "utf8");
const frontDoor = source.slice(0, source.indexOf("Medical weight-loss feature"));

describe("main homepage positioning boundary", () => {
  it("keeps the main front door recognizably Rella instead of making it a physician-authority page", () => {
    expect(frontDoor).toMatch(/<h1[^>]*>\s*Ageless Beauty/);
    expect(frontDoor).toContain("Natural-looking results");
    expect(frontDoor).not.toMatch(/ABOM|obesity medicine|physician-owned|physician authority/i);
  });

  it("keeps Dr. Wagner credential authority inside the weight-loss feature", () => {
    const weightLossFeature = source.slice(source.indexOf("Medical weight-loss feature"));
    expect(weightLossFeature).toContain("American Board of Obesity Medicine diplomate");
    expect(source).not.toContain("Meet the physician owner");
  });
});
