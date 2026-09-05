import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = join(__dirname, "..", "..");
const component = readFileSync(
  join(__dirname, "AestheticsAttributionConsent.tsx"),
  "utf8",
);
const controller = readFileSync(
  join(ROOT, "lib", "aesthetics-attribution.ts"),
  "utf8",
);

describe("aesthetics attribution integration boundaries", () => {
  it("is mounted only in the exact-pilot campaign route group", () => {
    const site = readFileSync(join(ROOT, "app", "(site)", "layout.tsx"), "utf8");
    const campaign = readFileSync(
      join(ROOT, "app", "(campaign)", "layout.tsx"),
      "utf8",
    );
    expect(site).not.toContain("AestheticsAttributionConsent");
    expect(campaign.match(/<AestheticsAttributionConsent \/>/g)).toHaveLength(1);
    expect(campaign).not.toMatch(
      /CampaignGtm|GoogleAnalytics|MetaPixel|GhlChatWidget|CallRail/,
    );
    expect(
      existsSync(join(__dirname, "CampaignGtm.tsx")),
    ).toBe(false);
  });

  it("contains no browser identifier sink or storage API", () => {
    const source = `${component}\n${controller}`;
    expect(source).not.toMatch(/\bdataLayer\b/);
    expect(source).not.toMatch(/\blocalStorage\b|\bsessionStorage\b/);
    expect(source).not.toMatch(/console\.(?:log|info|warn|error)/);
    expect(source).not.toMatch(/sendBeacon/);
    expect(source).not.toMatch(
      /googletagmanager|googleadservices|doubleclick|connect\.facebook|leadconnector|msgsndr|callrail|gtag\(|fbq\(/i,
    );
  });

  it("uses plain cookie language and a compact isolated stylesheet", () => {
    expect(component).toContain("Cookies");
    expect(component).toContain("Accept cookies");
    expect(component).toContain("Decline");
    expect(component).not.toContain("Allow measurement");
    expect(component).toContain("AestheticsAttributionConsent.module.css");
  });
});
