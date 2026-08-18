import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(__dirname, "..", "..", "..");

describe("mobile navigation accessibility (Pass 1)", () => {
  const mobileNav = readFileSync(join(ROOT, "src/components/layout/MobileNav.tsx"), "utf8");
  const header = readFileSync(join(ROOT, "src/components/layout/Header.tsx"), "utf8");
  const globals = readFileSync(join(ROOT, "src/app/globals.css"), "utf8");

  it("locks body scroll while the menu is open", () => {
    expect(mobileNav).toContain('document.body.style.overflow = "hidden"');
  });

  it("closes on Escape and returns focus to the menu trigger", () => {
    expect(mobileNav).toContain('e.key === "Escape"');
    expect(mobileNav).toContain("menuTriggerRef.current?.focus()");
  });

  it("uses an accessible dialog with focus trap logic", () => {
    expect(mobileNav).toContain('role="dialog"');
    expect(mobileNav).toContain('aria-modal="true"');
    expect(mobileNav).toContain('e.key !== "Tab"');
  });

  it("ensures primary mobile controls meet the 44px minimum", () => {
    expect(header).toContain("min-h-11 min-w-11");
    expect(mobileNav).toContain("min-h-11");
  });

  it("guards against horizontal overflow and offsets sticky header anchors", () => {
    expect(globals).toContain("overflow-x: clip");
    expect(globals).toContain("scroll-padding-top");
  });
});
