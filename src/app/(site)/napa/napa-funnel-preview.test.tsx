import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import NapaLaserHairRemovalPreviewPage, {
  metadata as laserMetadata,
} from "./laser-hair-removal/page";
import NapaMedicalFacialsPreviewPage, {
  metadata as facialMetadata,
} from "./medical-facials/page";
import {
  AESTHETICS_PILOT_PATH,
  isApprovedAestheticsPilotPage,
} from "@/lib/aesthetics-attribution";

const NAPA_LASER_CHOOSER =
  "https://book.experiencerella.com/book?location=napa&amp;category=laser";
const NAPA_FACIAL_CHOOSER =
  "https://book.experiencerella.com/book?location=napa&amp;category=facials";

function bookingLinks(html: string): string[] {
  return [
    ...html.matchAll(/href="([^"]*book\.experiencerella\.com[^"]*)"/g),
  ].map(([, href]) => href);
}

describe("preview-only Napa service funnels", () => {
  it("keeps both mock landing pages out of search until launch gates pass", () => {
    expect(laserMetadata.robots).toEqual({ index: false, follow: false });
    expect(facialMetadata.robots).toEqual({ index: false, follow: false });
  });

  it("does not widen the approved paid-attribution pilot", () => {
    expect(AESTHETICS_PILOT_PATH).toBe("/napa/botox");
    expect(
      isApprovedAestheticsPilotPage("experiencerella.com", "/napa/botox"),
    ).toBe(true);
    expect(
      isApprovedAestheticsPilotPage(
        "experiencerella.com",
        "/napa/laser-hair-removal",
      ),
    ).toBe(false);
    expect(
      isApprovedAestheticsPilotPage(
        "experiencerella.com",
        "/napa/medical-facials",
      ),
    ).toBe(false);
  });

  it("routes every laser CTA through the safe Napa category chooser", () => {
    const html = renderToStaticMarkup(<NapaLaserHairRemovalPreviewPage />);
    const links = bookingLinks(html);

    expect(links).toHaveLength(3);
    expect(new Set(links)).toEqual(new Set([NAPA_LASER_CHOOSER]));
    expect(html).toContain("Initial Laser Consult");
    expect(html).toContain("Small, medium, and large areas");
    expect(html).toContain("%2Fimages%2Ftreatments%2Flaser-treatment.webp");
    expect(html).not.toContain("%2Fimages%2Fclinic%2Fnapa-reception.webp");
    expect(html).not.toContain("napa-exterior.webp");
    expect(html).not.toContain("%2Fimages%2Fservice-laser.jpg");
    expect(html).not.toMatch(/\$180|\$600|\$900/);
    expect(html).not.toMatch(/joinblvd|dashboard\.boulevard|rella-hq/i);
    expect(html).not.toMatch(/gclid|gbraid|wbraid/i);
    expect(html).not.toMatch(
      /approved booking site|verified booking path|this preview|currently exposed|does not preselect|without an invented offer/i,
    );
  });

  it("routes every facial CTA through the safe Napa category chooser", () => {
    const html = renderToStaticMarkup(<NapaMedicalFacialsPreviewPage />);
    const links = bookingLinks(html);

    expect(links).toHaveLength(3);
    expect(new Set(links)).toEqual(new Set([NAPA_FACIAL_CHOOSER]));
    expect(html).toContain("Initial Skin Health Consult");
    expect(html).toContain("Signature HydraFacial");
    expect(html).toContain("Deluxe HydraFacial");
    expect(html).toContain("%2Fimages%2Ftreatments%2Fhydrafacial.webp");
    expect(html).toContain("%2Fimages%2Ftreatments%2Ffacial.webp");
    expect(html).not.toContain("napa-exterior.webp");
    expect(html).not.toContain("%2Fimages%2Fservice-hydrafacial.jpg");
    expect(html).not.toMatch(
      /\$50 off|same-week appointments available|instant-glow|zero-downtime/i,
    );
    expect(html).not.toMatch(/joinblvd|dashboard\.boulevard|rella-hq/i);
    expect(html).not.toMatch(/gclid|gbraid|wbraid/i);
    expect(html).not.toMatch(
      /approved booking site|verified booking path|this preview|currently exposed|does not preselect|without an invented offer/i,
    );
  });
});
