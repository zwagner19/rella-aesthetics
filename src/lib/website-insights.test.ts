import { afterEach, describe, expect, it, vi } from "vitest";
import { WebsiteInsights, hasInsightsConsent } from "./website-insights";
import {
  validInsightSample,
  INSIGHTS_COOKIE,
  type InsightSample,
} from "./website-insights-contract";
const now = Date.now();
const receipt = `v1.granted.${Math.floor(now / 1000)}`;
const handle = `rvh_${"A".repeat(43)}`;
const consent = `__Host-rella_napa_aesthetics_consent_v1=${receipt}; __Host-rella_source_consent_v1=${receipt}.${handle}; __Host-rella_analytics_consent_v1=${receipt}.${handle}; rella_ad_attribution_revoke=${handle}; ${INSIGHTS_COOKIE}=${receipt}.${handle}`;
const sample: InsightSample = {
  id: "c567b210-44b3-4b15-9150-47ff811a04d4",
  seq: 1,
  version: 1,
  kind: "page",
  page: "napa",
  viewport: "mobile",
  qa: true,
  scroll: 20,
  clicks: [{ x: 1, y: 2, n: 1 }],
  clinic: "unknown",
  steps: 0,
  lastStep: 0,
  outcome: "open",
};
afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});
describe("bounded UX contract", () => {
  it("allows only fixed coarse fields", () => {
    expect(validInsightSample(sample)).toBe(true);
    expect(validInsightSample({ ...sample, url: "/patient" })).toBe(false);
    expect(
      validInsightSample({
        ...sample,
        clicks: [{ x: 1, y: 2, n: 1, text: "patient" }],
      }),
    ).toBe(false);
    expect(
      validInsightSample({ ...sample, clicks: [{ x: 1, y: 2, n: 201 }] }),
    ).toBe(false);
  });
  it("requires checkout for pending or confirmed, and excludes page geometry from booking", () => {
    const booking = {
      ...sample,
      kind: "booking",
      page: "other",
      scroll: 0,
      clicks: [],
      clinic: "vacaville",
      steps: 63,
      lastStep: 6,
      outcome: "confirmed",
    };
    expect(validInsightSample(booking)).toBe(true);
    expect(validInsightSample({ ...booking, lastStep: 5 })).toBe(false);
    expect(validInsightSample({ ...booking, scroll: 20 })).toBe(false);
  });
  it("rejects unknown or duplicated cells and malformed enums", () => {
    expect(validInsightSample({ ...sample, page: "/napa/botox" })).toBe(false);
    expect(
      validInsightSample({
        ...sample,
        clicks: [sample.clicks[0], sample.clicks[0]],
      }),
    ).toBe(false);
  });
});
describe("consent boundary", () => {
  it("requires fresh purpose permission, exact receipt and handle", () => {
    expect(hasInsightsConsent(consent, now)).toBe(true);
    expect(
      hasInsightsConsent(consent.replace(`${INSIGHTS_COOKIE}=`, "old="), now),
    ).toBe(false);
    expect(
      hasInsightsConsent(consent + `; ${INSIGHTS_COOKIE}=other`, now),
    ).toBe(false);
    expect(
      hasInsightsConsent(consent + "; rella_ad_user_data_denied=1", now),
    ).toBe(false);
  });
});
describe("collector", () => {
  it("sends only coarse snapshots, isolates booking, deduplicates progress and stops on revocation", () => {
    vi.useFakeTimers();
    const listeners = new Map<string, EventListener>();
    const doc = {
      cookie: consent,
      documentElement: { scrollHeight: 3000 },
      visibilityState: "visible",
      addEventListener: (name: string, fn: EventListener) =>
        listeners.set(name, fn),
      removeEventListener: vi.fn(),
    };
    const win = {
      location: {
        hostname: "experiencerella.com",
        pathname: "/locations/napa",
        search: "?insights_qa=1&secret=private",
      },
      innerWidth: 390,
      innerHeight: 800,
      scrollY: 0,
      addEventListener: (name: string, fn: EventListener) =>
        listeners.set(name, fn),
      removeEventListener: vi.fn(),
    };
    class Target {
      constructor(private protectedTarget = false) {}
      closest() {
        return this.protectedTarget ? {} : null;
      }
    }
    const send = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
    vi.stubGlobal("document", doc);
    vi.stubGlobal("window", win);
    vi.stubGlobal("Element", Target);
    vi.stubGlobal("fetch", send);
    const tracker = new WebsiteInsights();
    tracker.reconcile({
      phase: "granted",
      choice: "granted",
      mode: "reopen",
      status: "",
    });
    const click = (protectedTarget = false) =>
      listeners.get("click")!({
        isTrusted: true,
        target: new Target(protectedTarget),
        clientX: 120,
        clientY: 450,
      } as unknown as Event);
    click(true);
    click();
    vi.advanceTimersByTime(15000);
    expect(JSON.parse(send.mock.calls.at(-1)![1].body).clicks).toEqual([
      { x: 3, y: 3, n: 1 },
    ]);
    tracker.startBooking();
    tracker.booking(2, "napa", "open");
    const count = send.mock.calls.length;
    tracker.booking(2, "napa", "open");
    expect(send).toHaveBeenCalledTimes(count);
    click();
    tracker.booking(6, "napa", "pending");
    tracker.booking(6, "napa", "confirmed");
    tracker.closeBooking();
    const final = JSON.parse(send.mock.calls.at(-1)![1].body);
    expect(final).toMatchObject({
      kind: "booking",
      clinic: "napa",
      outcome: "confirmed",
      steps: 34,
      clicks: [],
      scroll: 0,
    });
    expect(
      send.mock.calls.every((call) =>
        validInsightSample(JSON.parse(call[1].body)),
      ),
    ).toBe(true);
    expect(JSON.stringify(send.mock.calls)).not.toContain("private");
    const beforeResize = send.mock.calls.length;
    win.innerWidth = 1200;
    listeners.get("resize")!(new Event("resize"));
    click();
    vi.advanceTimersByTime(15000);
    expect(send).toHaveBeenCalledTimes(beforeResize);
    doc.cookie = "";
    click();
    tracker.startBooking();
    tracker.booking(1, null, "open");
    vi.advanceTimersByTime(15000);
    expect(send).toHaveBeenCalledTimes(count + 2);
    tracker.destroy();
  });
});
