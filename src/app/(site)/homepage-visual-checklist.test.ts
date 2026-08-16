import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { services } from "@/lib/data";

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

  it("uses approved service photography and the in-clinic consultation image", () => {
    for (const service of services) {
      expect(existsSync(`public${service.image}`), service.image).toBe(true);
      expect(service.imageAlt.length).toBeGreaterThan(0);
    }

    expect(new Set(services.map((service) => service.image)).size).toBe(8);
    expect(homepage).toContain("image={service.image}");
    expect(homepage).toContain("imageAlt={service.imageAlt}");
    expect(homepage).toContain("/images/clinic/rella-consultation.webp");
    expect(homepage).toContain("/images/clinic/vacaville-treatment-room.jpg");
    expect(homepage).not.toContain("/images/clinic/rella-front-desk-consult.jpg");
    expect(JSON.stringify(services)).not.toMatch(/\/images\/service-[a-z-]+\.jpg/);
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

  it("keeps the footer pale with Ink copy and the Rose logo", () => {
    expect(footer).toContain("bg-rose/10");
    expect(footer).toContain("pb-28 pt-16 text-ink xl:pb-8");
    expect(footer).toContain("border-white bg-white");
    expect(footer).toContain("tracking-[0.08em] text-ink");
    expect(footer).toContain("hover:text-ink/70");
    expect(footer).not.toContain("hover:text-rose");
  });
});
