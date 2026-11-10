import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  CALL_TAP_ENDPOINT,
  callTapAllowed,
  callTapBody,
  isClinicLine,
  landingFromLocation,
  readLanding,
} from "./call-tap";

describe("call-tap landing summary", () => {
  it("keeps the ad click type but never the click ID", () => {
    const landing = landingFromLocation(
      "https://experiencerella.com/napa?gclid=SECRET123&utm_source=google&utm_medium=cpc&utm_campaign=napa_tox",
      "https://www.google.com/",
    );
    expect(landing).toEqual({ utmSource: "google", utmMedium: "cpc", utmCampaign: "napa_tox",
      clickIdType: "google", referrerHost: "www.google.com", landingPath: "/napa" });
    expect(JSON.stringify(landing)).not.toContain("SECRET123");
    expect(landingFromLocation("https://experiencerella.com/?msclkid=x", "").clickIdType).toBe("microsoft");
    expect(landingFromLocation("https://experiencerella.com/?fbclid=x", "").clickIdType).toBe("meta");
  });

  it("keeps only the referring host, never its path or query", () => {
    const landing = landingFromLocation("https://experiencerella.com/", "https://www.yelp.com/biz/rella?q=secret");
    expect(landing.referrerHost).toBe("www.yelp.com");
    expect(landingFromLocation("https://experiencerella.com/", "android-app://com.google.android.googlequicksearchbox/").referrerHost)
      .toBe("com.google.android.googlequicksearchbox");
    expect(landingFromLocation("https://experiencerella.com/", "").referrerHost).toBeNull();
  });

  it("drops free-text tags and round-trips stored summaries safely", () => {
    const landing = landingFromLocation("https://experiencerella.com/?utm_source=%3Cscript%3E", "");
    expect(landing.utmSource).toBeNull();
    expect(readLanding(JSON.stringify({ utmSource: "<x>", clickIdType: "tiktok", landingPath: "/ok" })))
      .toMatchObject({ utmSource: null, clickIdType: null, landingPath: "/ok" });
    expect(readLanding("not json")).toBeNull();
  });
});

describe("call-tap gating", () => {
  it("only reports the shared clinic line", () => {
    expect(isClinicLine("tel:+17073582928")).toBe(true);
    expect(isClinicLine("tel:707.358.2928")).toBe(true);
    expect(isClinicLine("tel:+14155550100")).toBe(false);
    expect(isClinicLine("/contact")).toBe(false);
  });

  it("respects Global Privacy Control, the ad-data opt-out, and non-production hosts", () => {
    const base = { hostname: "experiencerella.com", globalPrivacyControl: false, cookie: "" };
    expect(callTapAllowed(base)).toBe(true);
    expect(callTapAllowed({ ...base, globalPrivacyControl: true })).toBe(false);
    expect(callTapAllowed({ ...base, cookie: "a=1; rella_ad_user_data_denied=v1" })).toBe(false);
    expect(callTapAllowed({ ...base, hostname: "rella-aesthetics.vercel.app" })).toBe(false);
    expect(callTapAllowed({ ...base, hostname: "weightloss.experiencerella.com" })).toBe(false);
  });

  it("sends a fixed-shape body to Rella's booking host", () => {
    expect(CALL_TAP_ENDPOINT).toBe("https://book.experiencerella.com/api/booking-v2/call-tap");
    expect(Object.keys(callTapBody(null, "/about")).sort()).toEqual([
      "clickIdType", "landingPath", "pagePath", "referrerHost", "utmCampaign", "utmMedium", "utmSource", "v",
    ]);
    expect(callTapBody(null, "/about?x=1").pagePath).toBeNull();
  });
});

describe("call-tap placement", () => {
  const app = join(__dirname, "..", "app");
  it("is mounted on ordinary site routes only, never the campaign pilot or root", () => {
    expect(readFileSync(join(app, "(site)/layout.tsx"), "utf8")).toMatch(/<CallTapRecorder\s*\/>/);
    expect(readFileSync(join(app, "(campaign)/layout.tsx"), "utf8")).not.toContain("CallTapRecorder");
    expect(readFileSync(join(app, "layout.tsx"), "utf8")).not.toContain("CallTapRecorder");
  });
});
