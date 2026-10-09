import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const SRC = join(__dirname, "..");

function source(path: string): string {
  return readFileSync(join(SRC, path), "utf8");
}

describe("PR14 visual recovery contract", () => {
  it("restores the approved site chrome without restoring legacy tracking", () => {
    const header = source("components/layout/Header.tsx");
    const footer = source("components/layout/Footer.tsx");
    const mobileNav = source("components/layout/MobileNav.tsx");
    const siteLayout = source("app/(site)/layout.tsx");
    const chatWidget = source("components/integrations/GhlChatWidget.tsx");

    for (const chrome of [header, footer, mobileNav]) {
      expect(chrome).toContain("/brand/rella-logo-rose.svg");
    }
    expect(header).toContain("resolveBookingHref");
    expect(mobileNav).toContain("resolveBookingHref");
    expect(footer).toContain("resolveBookingHref");
    expect(siteLayout).toContain("<MobileConversionBar />");
    expect(siteLayout).toContain('data-site-motion="true"');
    expect(siteLayout).not.toMatch(
      /AestheticsAttributionHandoff|CampaignGtm|ClarityAnalytics|ConversionTracker|PreviewClinicChooser/,
    );
    expect(chatWidget).toContain('(min-width: 1280px)');
    expect(chatWidget).toContain("window.matchMedia(DESKTOP_WIDGET_QUERY).matches");
  });

  it("keeps the campaign shell visually and analytically isolated", () => {
    const campaignLayout = source("app/(campaign)/layout.tsx");
    const campaignPage = source("app/(campaign)/napa/botox/page.tsx");

    expect(campaignLayout).toContain("AestheticsAttributionConsent");
    expect(campaignLayout).not.toMatch(
      /GoogleAnalytics|MetaPixel|CampaignGtm|GhlChatWidget/,
    );
    expect(campaignPage).toContain("/brand/rella-logo-black.svg");
    expect(campaignPage).toContain(
      'resolveBookingHref({ location: "napa", service: "botox" })',
    );
  });

  it("keeps Rose hierarchy, motion, and mobile action treatment for the editorial homepage", () => {
    const globals = source("app/globals.css");
    const homepage = source("app/(site)/page.tsx");
    const button = source("components/ui/Button.tsx");
    const mobileBar = source("components/layout/MobileConversionBar.tsx");
    const homeSections = [
      "components/home/HomeApproach.tsx",
      "components/home/TreatmentDiscovery.tsx",
      "components/home/TransformHouse.tsx",
      "components/home/HomeLocations.tsx",
      "components/home/RellaStandard.tsx",
      "components/home/HomeProviders.tsx",
      "components/home/HomeMembership.tsx",
      "components/home/PatientWords.tsx",
      "components/home/FinalCta.tsx",
    ].map((path) => source(path));

    expect(globals).toContain("--color-rose-text: #F7A19A");
    expect(globals).toContain("--color-rose-cta: #F7A19A");
    expect(globals).toContain("--color-ivory:");
    expect(globals).toContain("@keyframes rella-section-enter");
    expect(globals).toContain(".rella-cta-rect");
    const revealCount = homeSections.reduce(
      (count, section) => count + (section.match(/rella-site-reveal/g) ?? []).length,
      0,
    );
    expect(revealCount).toBeGreaterThanOrEqual(6);
    expect(homepage).toContain("HomeHero");
    expect(homepage).toContain("TreatmentDiscovery");
    expect(homepage).toContain("TransformHouse");
    expect(homepage).toContain("FinalCta");
    expect(homepage).not.toContain("Ageless Beauty");
    expect(homepage).not.toMatch(/Cormorant|font-serif/);
    expect(button).toContain("border-rose bg-rose text-white");
    expect(mobileBar).toContain("bg-rose");
    expect(mobileBar).toContain("text-white");
    expect(mobileBar).toContain("resolveBookingHref(bookingIntentForPath(pathname))");
    expect(mobileBar).not.toMatch(/gclid|gbraid|wbraid|sessionStorage/);
  });

  it("keeps the approved Napa reception image instead of restoring the rejected house photo", () => {
    const homeVisual = source("components/home/HomeLocationVisual.tsx");
    const homeVisualData = source("components/home/home-location-visuals.ts");
    const napaLocation = source("app/(site)/locations/napa/page.tsx");
    const homeLocations = source("components/home/HomeLocations.tsx");

    expect(homeVisualData).toContain("/images/clinic/napa-reception.webp");
    expect(napaLocation).toContain("/images/clinic/napa-reception.webp");
    expect(homeLocations).toContain("HOME_LOCATION_VISUALS");
    expect(homeVisualData).not.toContain("napa-exterior.webp");
    expect(napaLocation).not.toContain("napa-exterior.webp");
    expect(homeVisual).toContain("home-location-visuals");
  });
});
