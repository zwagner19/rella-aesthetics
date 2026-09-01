import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

function cssToken(source: string, token: string) {
  const value = new RegExp(
    `--color-${token}:\\s*(#[0-9a-f]{6}|rgba\\([^;]+\\))`,
    "i",
  ).exec(source)?.[1];
  if (!value) throw new Error(`Missing --color-${token}`);
  return value;
}

describe("designer-approved color hierarchy", () => {
  const css = readFileSync("src/app/globals.css", "utf8");
  const rose = cssToken(css, "rose");
  const blush = cssToken(css, "rose-blush");

  it("uses Rella Rose for headings and actions with the approved tint", () => {
    expect(cssToken(css, "rose-cta").toLowerCase()).toBe(rose.toLowerCase());
    expect(cssToken(css, "rose-text").toLowerCase()).toBe(rose.toLowerCase());
    expect(blush).toBe("rgba(247, 161, 154, 0.28)");
  });

  it("uses a dual-contrast focus treatment that remains visible on Rose bands", () => {
    expect(css).toContain("outline: 2px solid var(--color-white)");
    expect(css).toContain("outline-offset: 2px");
    expect(css).toContain("box-shadow: 0 0 0 4px var(--color-ink)");
  });

  it("keeps shared headings, buttons, and Rose bands on the approved pink-and-white hierarchy", () => {
    const button = readFileSync("src/components/ui/Button.tsx", "utf8");
    const sectionHeader = readFileSync("src/components/ui/SectionHeader.tsx", "utf8");
    const trustStrip = readFileSync("src/components/blocks/TrustStrip.tsx", "utf8");
    const membership = readFileSync("src/components/blocks/MembershipBanner.tsx", "utf8");

    expect(button).toContain("border-rose bg-rose text-white");
    expect(button).toContain("border-rose bg-white text-rose");
    expect(sectionHeader).toContain(
      'eyebrowTone = tone === "light" ? "light" : "default"',
    );
    expect(sectionHeader).toContain('eyebrowTone === "rose"');
    expect(sectionHeader).toContain(
      'tone === "light" ? "text-white" : "text-rose"',
    );
    expect(trustStrip).toContain("bg-rose px-5 text-center");
    expect(trustStrip).toContain("text-white");
    expect(membership).toContain("bg-rose");
    expect(membership).toContain("italic text-white");
    expect(membership).toContain("text-white");
  });
});

describe("mobile navigation accessibility", () => {
  const header = readFileSync("src/components/layout/Header.tsx", "utf8");
  const mobileNav = readFileSync("src/components/layout/MobileNav.tsx", "utf8");
  const mobileBar = readFileSync("src/components/layout/MobileConversionBar.tsx", "utf8");
  const chat = readFileSync("src/components/integrations/GhlChatWidget.tsx", "utf8");
  const css = readFileSync("src/app/globals.css", "utf8");
  const siteLayout = readFileSync("src/app/(site)/layout.tsx", "utf8");
  const footer = readFileSync("src/components/layout/Footer.tsx", "utf8");

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

  it("keeps every mobile-shell control on the same responsive boundary", () => {
    expect(header).toContain("xl:hidden");
    expect(mobileBar).toContain("xl:hidden");
    expect(chat).toContain('(min-width: 1280px)');
    expect(css).toContain("@media (max-width: 1279px)");
    expect(siteLayout).toContain("pb-20 xl:pb-0");
    expect(footer).toContain("pb-28 pt-16 text-ink xl:pb-8");
  });

  it("keeps the expanded menu and its booking action reachable on short screens", () => {
    expect(mobileNav).toContain("min-h-0");
    expect(mobileNav).toContain("overflow-y-auto");
    expect(mobileNav).toContain("shrink-0");
  });
});
