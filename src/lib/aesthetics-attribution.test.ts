import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it, vi } from "vitest";
import {
  AESTHETICS_ATTRIBUTION_ENDPOINT,
  inferAestheticsLocation,
  isGeneralAestheticsHost,
  parseAestheticsAttribution,
  postAestheticsAttribution,
  resolveAestheticsAttribution,
  stripAestheticsAttributionFromBookingHref,
  stripAestheticsClickIds,
  withAestheticsAttribution,
  type AttributionFetch,
  type AttributionSessionStorage,
} from "./aesthetics-attribution";

class MemorySessionStorage implements AttributionSessionStorage {
  private values = new Map<string, string>();
  getItem(key: string) { return this.values.get(key) ?? null; }
  setItem(key: string, value: string) { this.values.set(key, value); }
  removeItem(key: string) { this.values.delete(key); }
}

const PAID_SEARCH =
  "?gclid=Cj0K.real-1&gbraid=GBRAID_2&wbraid=WBRAID-3&gclsrc=aw.ds" +
  "&utm_source=google&utm_medium=cpc&utm_campaign=napa_botox" +
  "&utm_content=responsive_ad&utm_term=botox%2Bnapa" +
  "&gad_campaignid=123&gad_adgroupid=456&gad_keyword=botox" +
  "&gad_matchtype=e&gad_device=m&gad_network=g";

describe("general-aesthetics attribution allowlist", () => {
  it("keeps only approved click, campaign, and ValueTrack fields", () => {
    expect(parseAestheticsAttribution(
      `${PAID_SEARCH}&email=patient@example.com&diagnosis=private`,
    )).toEqual({
      gclid: "Cj0K.real-1", gbraid: "GBRAID_2", wbraid: "WBRAID-3",
      gclsrc: "aw.ds", utm_source: "google", utm_medium: "cpc",
      utm_campaign: "napa_botox", utm_content: "responsive_ad",
      utm_term: "botox+napa", campaignid: "123", adgroupid: "456",
      keyword: "botox", matchtype: "e", device: "m", network: "g",
    });
  });

  it("rejects contact-like, malformed, oversized, and arbitrary values", () => {
    expect(parseAestheticsAttribution(
      `?gclid=patient@example.com&utm_campaign=707-555-1212&utm_content=${"x".repeat(201)}&answer=yes`,
    )).toEqual({});
  });
});

describe("session fallback and exact destinations", () => {
  it("survives internal browsing and a new valid touch replaces the fallback", () => {
    const storage = new MemorySessionStorage();
    resolveAestheticsAttribution("?gclid=old&utm_campaign=old", storage);
    expect(resolveAestheticsAttribution("", storage)).toEqual({
      gclid: "old", utm_campaign: "old",
    });
    expect(resolveAestheticsAttribution("?wbraid=new&utm_source=google", storage)).toEqual({
      wbraid: "new", utm_source: "google",
    });
  });

  it("decorates internal /book and the exact configured aesthetics booking host", () => {
    const attribution = { gclid: "paid-click", utm_source: "google" };
    const local = new URL(withAestheticsAttribution(
      "/book?location=napa", attribution, "https://experiencerella.com",
    ));
    const booking = new URL(withAestheticsAttribution(
      "https://book.experiencerella.com/book/napa/botox",
      attribution,
      "https://experiencerella.com",
    ));
    expect(local.searchParams.get("location")).toBe("napa");
    expect(local.searchParams.get("gclid")).toBe("paid-click");
    expect(booking.searchParams.get("gclid")).toBe("paid-click");
  });

  it("never decorates weight-loss, Boulevard, lookalike, or ordinary links", () => {
    const attribution = { gclid: "paid-click" };
    for (const href of [
      "https://book.rellaweightloss.com/book/napa/weight-loss-consult",
      "https://dashboard.boulevard.io/booking/businesses/example/widget",
      "https://book.experiencerella.com.evil.example/book/napa/botox",
      "/contact",
    ]) {
      expect(withAestheticsAttribution(
        href, attribution, "https://experiencerella.com",
      )).toBe(href);
    }
  });

  it("cleans decorated booking links and raw click IDs only after ack", () => {
    const cleanLink = new URL(stripAestheticsAttributionFromBookingHref(
      "https://book.experiencerella.com/book/napa/botox?gclid=click&utm_source=google&service=botox",
      "https://experiencerella.com",
    ));
    const cleanPage = new URL(stripAestheticsClickIds(
      "https://experiencerella.com/napa/botox?gclid=click&gclsrc=aw.ds&utm_source=google",
    ));
    expect(cleanLink.searchParams.get("service")).toBe("botox");
    expect(cleanLink.searchParams.get("gclid")).toBeNull();
    expect(cleanLink.searchParams.get("utm_source")).toBeNull();
    expect(cleanPage.searchParams.get("gclid")).toBeNull();
    expect(cleanPage.searchParams.get("gclsrc")).toBeNull();
    expect(cleanPage.searchParams.get("utm_source")).toBe("google");
  });
});

describe("first-party capture", () => {
  it("infers only known location-owned paths", () => {
    expect(inferAestheticsLocation("/napa/botox")).toBe("napa");
    expect(inferAestheticsLocation("/locations/vacaville/")).toBe("vacaville");
    expect(inferAestheticsLocation("/services/botox")).toBe("unknown");
  });

  it("posts with credentials only from the exact production marketing origin", async () => {
    const fetchImpl = vi.fn<AttributionFetch>(async () => ({
      ok: true,
      json: async () => ({ ok: true, attributionId: "ratt_ack" }),
    }));
    expect(await postAestheticsAttribution({
      attribution: { gclid: "paid-click", utm_source: "google" },
      marketingOrigin: "https://experiencerella.com",
      pathname: "/napa/botox",
      fetchImpl,
    })).toBe(true);
    expect(fetchImpl).toHaveBeenCalledOnce();
    const [requestUrl, requestInit] = fetchImpl.mock.calls[0];
    expect(requestUrl).toBe(AESTHETICS_ATTRIBUTION_ENDPOINT);
    expect(requestInit).toMatchObject({
      method: "POST", credentials: "include", keepalive: true,
    });
    expect(JSON.parse(String(requestInit.body))).toEqual({
      location: "napa", gclid: "paid-click", utm_source: "google",
    });

    const previewFetch = vi.fn<AttributionFetch>();
    expect(await postAestheticsAttribution({
      attribution: { gclid: "preview-click" },
      marketingOrigin: "https://rella-preview.vercel.app",
      pathname: "/napa/botox",
      fetchImpl: previewFetch,
    })).toBe(false);
    expect(previewFetch).not.toHaveBeenCalled();
  });

  it("keeps the weight-loss host completely excluded", () => {
    expect(isGeneralAestheticsHost("weightloss.experiencerella.com")).toBe(false);
    expect(isGeneralAestheticsHost("experiencerella.com")).toBe(true);
  });
});

describe("application wiring", () => {
  it("mounts once and clears the fallback only after acknowledgement", () => {
    const root = readFileSync(join(__dirname, "..", "app", "layout.tsx"), "utf8");
    const component = readFileSync(join(
      __dirname, "..", "components", "integrations",
      "AestheticsAttributionHandoff.tsx",
    ), "utf8");
    expect(root.match(/<AestheticsAttributionHandoff \/>/g)).toHaveLength(1);
    expect(component).toContain("window.sessionStorage");
    expect(component).not.toContain("window.localStorage");
    expect(component).toContain("serverAcknowledged");
    expect(component).toContain("removeItem(AESTHETICS_ATTRIBUTION_STORAGE_KEY)");
    expect(component).toContain('document.addEventListener("click"');
    expect(component).toContain("window.location.assign(link.href)");
  });
});
