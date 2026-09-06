import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = join(__dirname, "..");
const globals = readFileSync(join(ROOT, "app", "globals.css"), "utf8");

function hexVariable(name: string): string {
  const match = globals.match(
    new RegExp(`--color-${name}:\\s*(#[0-9a-f]{6})`, "i"),
  );
  if (!match) throw new Error(`Missing --color-${name}`);
  return match[1];
}

function luminance(hex: string): number {
  const channels = [1, 3, 5].map((offset) =>
    Number.parseInt(hex.slice(offset, offset + 2), 16) / 255,
  );
  const [red, green, blue] = channels.map((value) =>
    value <= 0.04045
      ? value / 12.92
      : ((value + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrast(first: string, second: string): number {
  const lighter = Math.max(luminance(first), luminance(second));
  const darker = Math.min(luminance(first), luminance(second));
  return (lighter + 0.05) / (darker + 0.05);
}

describe("owner-approved visual and accessibility contract", () => {
  it("keeps the approved four-color brand values exact", () => {
    expect(hexVariable("rose")).toBe("#F7A19A");
    expect(hexVariable("rose-text")).toBe("#F7A19A");
    expect(hexVariable("rose-cta")).toBe("#F7A19A");
    expect(hexVariable("silver")).toBe("#64696E");
    expect(hexVariable("ink")).toBe("#1a1a1a");
    expect(hexVariable("white")).toBe("#ffffff");
  });

  it("keeps body-copy and keyboard-focus combinations at WCAG AA contrast", () => {
    const white = hexVariable("white");
    expect(contrast(hexVariable("ink"), hexVariable("rose"))).toBeGreaterThanOrEqual(4.5);
    expect(contrast(hexVariable("ink"), white)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(hexVariable("silver"), white)).toBeGreaterThanOrEqual(4.5);
  });

  it("keeps the rose site logo separate from the black campaign logo", () => {
    const header = readFileSync(join(ROOT, "components", "layout", "Header.tsx"), "utf8");
    const campaign = readFileSync(join(ROOT, "app", "(campaign)", "napa", "botox", "page.tsx"), "utf8");
    expect(header).toContain('/brand/rella-logo-rose.svg');
    expect(campaign).toContain('/brand/rella-logo-black.svg');
  });

  it("keeps the longest generic service heading inside a 320px viewport", () => {
    const page = readFileSync(
      join(ROOT, "app", "(site)", "services", "[slug]", "page.tsx"),
      "utf8",
    );
    expect(page).toContain("break-words");
    expect(page).toContain("text-[clamp(1.9rem,9vw,2.25rem)]");
  });
});
