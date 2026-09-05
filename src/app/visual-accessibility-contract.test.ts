import { readFileSync, readdirSync } from "node:fs";
import { extname, join } from "node:path";
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

function productionTsxFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return productionTsxFiles(path);
    if (extname(entry.name) !== ".tsx" || entry.name.includes(".test.")) return [];
    return [path];
  });
}

describe("visual accessibility contract", () => {
  it("keeps core text and control combinations at WCAG AA contrast", () => {
    const white = hexVariable("white");
    expect(contrast(hexVariable("rose-text"), white)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(hexVariable("silver"), white)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(hexVariable("ink"), hexVariable("rose"))).toBeGreaterThanOrEqual(4.5);
    expect(contrast(white, hexVariable("rose-cta"))).toBeGreaterThanOrEqual(4.5);
    expect(contrast(hexVariable("rose-on-ink"), hexVariable("ink"))).toBeGreaterThanOrEqual(4.5);
  });

  it("never uses the light brand rose as a text utility", () => {
    for (const path of [
      ...productionTsxFiles(join(ROOT, "app")),
      ...productionTsxFiles(join(ROOT, "components")),
    ]) {
      const source = readFileSync(path, "utf8");
      expect(source, path).not.toMatch(/(?:^|[\s"`])text-rose(?:[\s"`/]|$)/);
    }
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
