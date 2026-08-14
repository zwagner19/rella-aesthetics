import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homepage = readFileSync("src/app/(site)/page.tsx", "utf8");
const header = readFileSync("src/components/layout/Header.tsx", "utf8");
const footer = readFileSync("src/components/layout/Footer.tsx", "utf8");
const mobileNav = readFileSync("src/components/layout/MobileNav.tsx", "utf8");
const mobileBar = readFileSync("src/components/layout/MobileConversionBar.tsx", "utf8");
const serviceCard = readFileSync("src/components/blocks/ServiceCard.tsx", "utf8");

describe("designer homepage color and image checklist", () => {
  it("uses the exact Rose logo without changing the official geometry", () => {
    const blackLogo = readFileSync("public/brand/rella-logo-black.svg", "utf8");
    const roseLogo = readFileSync("public/brand/rella-logo-rose.svg", "utf8");

    expect(roseLogo).toContain('fill="#F7A19A"');
    expect(roseLogo.replace(' fill="#F7A19A"', "").trimEnd()).toBe(blackLogo.trimEnd());
    expect(header).toContain('/brand/rella-logo-rose.svg');
    expect(footer).toContain('/brand/rella-logo-rose.svg');
    expect(mobileNav).toContain('/brand/rella-logo-rose.svg');
  });

  it("packages and uses only the approved authentic homepage clinic stills", () => {
    const clinicImages = [
      "/images/clinic/vacaville-treatment-room.jpg",
      "/images/clinic/rella-front-desk-consult.jpg",
    ];

    for (const image of clinicImages) {
      expect(existsSync(`public${image}`), image).toBe(true);
      expect(homepage).toContain(image);
    }

    expect(homepage).not.toMatch(/\/images\/service-(?:hydrafacial|weightloss)\.jpg/);
  });

  it("uses Rose and white for the requested homepage hierarchy", () => {
    expect(homepage).toMatch(/<h1 className="[^"]*text-rose[^"]*">\s*Ageless Beauty/);
    expect(homepage).toContain('className="bg-rose py-24 text-white');
    expect(homepage).toContain('variant="light" className="rounded-full"');
    expect(homepage).toContain('bg-rose py-20 text-center text-white');
    expect(homepage).not.toContain("elevated care —");
    expect(homepage).not.toContain("you—not");
  });

  it("keeps mobile actions and the hamburger booking action pink and white", () => {
    expect(mobileBar).toContain("bg-white/90");
    expect(mobileBar).toContain("border-rose bg-white");
    expect(mobileBar).toContain("bg-rose");
    expect(mobileBar).toContain("text-white");
    expect(mobileNav).toContain("border-rose bg-rose");
    expect(mobileNav).toContain("text-white");
  });

  it("gives service cards equivalent pointer and keyboard Rose states", () => {
    expect(serviceCard).toContain("text-rose");
    expect(serviceCard).toContain("hover:bg-rose");
    expect(serviceCard).toContain("focus-visible:bg-rose");
    expect(serviceCard).toContain("group-hover:text-white");
    expect(serviceCard).toContain("group-focus-visible:text-white");
    expect(serviceCard).toContain('<span aria-hidden="true">&rarr;</span>');
  });

  it("keeps the footer pale with Rose copy and white-on-Rose-accent controls", () => {
    expect(footer).toContain("bg-rose/10");
    expect(footer).toContain("text-rose");
    expect(footer).toContain("border-white bg-white");
    expect(footer).not.toContain("hover:text-ink");
  });
});
