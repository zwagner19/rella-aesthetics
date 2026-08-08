import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function channel(value: number) {
  const normalized = value / 255;
  return normalized <= 0.04045
    ? normalized / 12.92
    : ((normalized + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string) {
  const channels = hex.match(/[0-9a-f]{2}/gi);
  if (!channels || channels.length !== 3) throw new Error(`Invalid color: ${hex}`);
  const [red, green, blue] = channels.map((value) => channel(Number.parseInt(value, 16)));
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrastRatio(foreground: string, background: string) {
  const foregroundLuminance = luminance(foreground);
  const backgroundLuminance = luminance(background);
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);
  return (lighter + 0.05) / (darker + 0.05);
}

function cssToken(source: string, token: string) {
  const value = new RegExp(`--color-${token}:\\s*(#[0-9a-f]{6})`, "i").exec(source)?.[1];
  if (!value) throw new Error(`Missing --color-${token}`);
  return value;
}

function componentFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return componentFiles(path);
    return entry.name.endsWith(".tsx") ? [path] : [];
  });
}

describe("conversion color contrast", () => {
  const css = readFileSync("src/app/globals.css", "utf8");
  const white = cssToken(css, "white");
  const ink = cssToken(css, "ink");
  const blush = cssToken(css, "rose-blush");

  it("keeps primary actions and readable rose text at WCAG AA contrast", () => {
    expect(contrastRatio(cssToken(css, "rose-cta"), white)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(cssToken(css, "rose-dark"), white)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(cssToken(css, "rose-text"), white)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(cssToken(css, "rose-text"), blush)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(cssToken(css, "rose"), ink)).toBeGreaterThanOrEqual(4.5);
  });

  it("never pairs the decorative rose fill with white CTA text", () => {
    const failures: string[] = [];

    for (const file of componentFiles("src")) {
      const lines = readFileSync(file, "utf8").split("\n");
      lines.forEach((line, index) => {
        const hasDecorativeRoseFill = /\\bbg-rose(?=\\s|[\"'`/])/.test(line);
        const hasWhiteText = /\\btext-white(?=\\s|[\"'`/])/.test(line);
        const hasDecorativeRoseTextOverride = /!text-rose(?=\\s|[\"'`/])/.test(line);

        if ((hasDecorativeRoseFill && hasWhiteText) || hasDecorativeRoseTextOverride) {
          failures.push(`${file}:${index + 1}`);
        }
      });
    }

    expect(failures).toEqual([]);
  });
});

describe("mobile navigation accessibility", () => {
  const header = readFileSync("src/components/layout/Header.tsx", "utf8");
  const mobileNav = readFileSync("src/components/layout/MobileNav.tsx", "utf8");

  it("connects the menu trigger to a modal dialog", () => {
    expect(header).toContain('aria-controls="mobile-navigation"');
    expect(mobileNav).toContain('id="mobile-navigation"');
    expect(mobileNav).toContain('role="dialog"');
    expect(mobileNav).toContain('aria-modal="true"');
  });

  it("contains keyboard focus and restores it when the menu closes", () => {
    expect(mobileNav).toContain('if (e.key !== "Tab") return');
    expect(mobileNav).toContain("closeButtonRef.current?.focus()");
    expect(mobileNav).toContain("previousActiveElement.focus()");
    expect(mobileNav).toContain("document.body.style.overflow = previousOverflow");
  });
});
