import { afterEach, describe, expect, it, vi } from "vitest";
import { PublicAnalyticsParent, publicAnalyticsPageGroup, setPublicAnalyticsBookingState } from "./public-analytics-parent";
import { AESTHETICS_CONSENT_COOKIE, AESTHETICS_SOURCE_CONSENT_COOKIE, AESTHETICS_ANALYTICS_CONSENT_COOKIE, AD_ATTRIBUTION_REVOCATION_COOKIE } from "./aesthetics-attribution";
import { PUBLIC_ANALYTICS_ORIGIN } from "./public-analytics-frame";
const granted = { mode: "reopen", phase: "granted", choice: "granted", status: "" } as const;
const denied = { mode: "reopen", phase: "denied", choice: "denied", status: "" } as const;
function setup() {
  const receipt = `v1.granted.${Math.floor(Date.now()/1000)}`;
  const handle = `rvh_${"A".repeat(43)}`;
  const doc = { cookie: `${AESTHETICS_CONSENT_COOKIE}=${receipt}; ${AD_ATTRIBUTION_REVOCATION_COOKIE}=${handle}; ${AESTHETICS_SOURCE_CONSENT_COOKIE}=${receipt}.${handle}; ${AESTHETICS_ANALYTICS_CONSENT_COOKIE}=${receipt}.${handle}`, referrer: "", body: { appendChild: vi.fn() }, createElement: vi.fn() };
  const frame = { contentWindow: { postMessage: vi.fn() }, hidden: false, style: { display: "" }, title: "", tabIndex: 0, setAttribute: vi.fn(), referrerPolicy: "", src: "", remove: vi.fn() };
  doc.createElement.mockImplementation(() => frame);
  const location = { hostname: "experiencerella.com", pathname: "/", search: "?utm_source=google&utm_medium=organic&utm_campaign=PRIVATE_FREE_TEXT" };
  let receive: (event: unknown)=>void = () => {};
  vi.stubGlobal("document", doc);
  vi.stubGlobal("window", { location, addEventListener: vi.fn((kind, callback) => { if(kind === "message") receive = callback; }), removeEventListener: vi.fn() });
  const fetcher = vi.fn().mockResolvedValue({ ok: true }); vi.stubGlobal("fetch", fetcher);
  const parent = new PublicAnalyticsParent();
  const ready = (origin = PUBLIC_ANALYTICS_ORIGIN, source: unknown = frame.contentWindow) => receive({ origin, source, data: { type: "rella-public-analytics-v1", action: "ready" } });
  return { parent, frame, doc, location, ready, fetcher };
}
afterEach(() => { setPublicAnalyticsBookingState(false); vi.unstubAllGlobals(); });
describe("isolated public analytics parent", () => {
  it("uses coarse pages without treatment-specific paths", () => {
    expect(publicAnalyticsPageGroup("/services/botox")).toBe("treatments");
    expect(publicAnalyticsPageGroup("/napa/botox")).toBe("napa");
    expect(publicAnalyticsPageGroup("/locations/vacaville")).toBe("vacaville");
  });
  it("requires fresh purpose, an acknowledged grant and a public host", () => {
    const s = setup();
    s.parent.reconcile({ ...granted, phase: "granting" }, false);
    expect(s.doc.createElement).not.toHaveBeenCalled();
    s.doc.cookie = s.doc.cookie.replace(AESTHETICS_ANALYTICS_CONSENT_COOKIE, "old_purpose");
    s.parent.reconcile(granted, false);
    expect(s.doc.createElement).not.toHaveBeenCalled();
    s.parent.destroy();
  });
  it("waits for its own cross-origin child and sends only bounded data once per route", () => {
    const s = setup(); s.parent.reconcile(granted, false);
    expect(s.frame.referrerPolicy).toBe("no-referrer");
    expect(s.frame.src).toBe(PUBLIC_ANALYTICS_ORIGIN + "/api/public-analytics/frame");
    s.ready("https://evil.test"); s.ready(PUBLIC_ANALYTICS_ORIGIN, {});
    expect(s.frame.contentWindow.postMessage).not.toHaveBeenCalled();
    s.ready(); s.parent.reconcile(granted, false);
    expect(s.frame.contentWindow.postMessage).toHaveBeenCalledTimes(1);
    const payload = s.frame.contentWindow.postMessage.mock.calls[0][0];
    expect(Object.keys(payload).sort()).toEqual(["type","action","navigationId","pageGroup","source","medium"].sort());
    expect(JSON.stringify(payload)).not.toContain("PRIVATE_FREE_TEXT");
    expect(payload.source).toBe("google");
    s.location.pathname = "/locations/vacaville"; s.location.search = "";
    s.parent.reconcile(granted, false);
    expect(s.frame.contentWindow.postMessage.mock.calls.at(-1)?.[0].pageGroup).toBe("vacaville");
    s.parent.destroy();
  });
  it("cancels late readiness on withdrawal and clears only the isolated origin", () => {
    const s = setup(); s.parent.reconcile(granted, false);
    s.doc.cookie = ""; s.parent.reconcile(denied, false); s.ready();
    expect(s.frame.remove).toHaveBeenCalled();
    expect(s.frame.contentWindow.postMessage.mock.calls.every(([m]) => m.action === "dispose")).toBe(true);
    expect(s.fetcher).toHaveBeenCalledWith(PUBLIC_ANALYTICS_ORIGIN + "/api/public-analytics/clear", expect.objectContaining({ body: "{}", credentials: "include", referrerPolicy: "no-referrer" }));
    s.parent.destroy();
  });
  it("removes the frame during booking without clearing session cookies or repeating views", () => {
    const s = setup(); s.parent.reconcile(granted, false); s.ready();
    s.parent.reconcile(granted, true);
    expect(s.frame.remove).toHaveBeenCalled(); expect(s.fetcher).not.toHaveBeenCalled();
    s.parent.reconcile(granted, false); s.ready();
    expect(s.frame.contentWindow.postMessage.mock.calls.filter(([m]) => m.action === "page_view")).toHaveLength(1);
    s.parent.destroy();
  });

  it("stops synchronously before late readiness even while the React booking state is stale", () => {
    const s = setup(); s.parent.reconcile(granted, false);
    setPublicAnalyticsBookingState(true);
    s.ready();
    s.parent.reconcile(granted, false);
    expect(s.frame.remove).toHaveBeenCalledTimes(1);
    expect(s.doc.createElement).toHaveBeenCalledTimes(1);
    expect(s.frame.contentWindow.postMessage.mock.calls.every(([m]) => m.action === "dispose")).toBe(true);
    setPublicAnalyticsBookingState(false);
    expect(s.doc.createElement).toHaveBeenCalledTimes(1);
    s.parent.reconcile(granted, false);
    expect(s.doc.createElement).toHaveBeenCalledTimes(2);
    s.parent.destroy();
  });

  it("does not create a frame for an acknowledged grant while booking is synchronously active", () => {
    const s = setup();
    setPublicAnalyticsBookingState(true);
    s.parent.reconcile(granted, false);
    expect(s.doc.createElement).not.toHaveBeenCalled();
    expect(s.frame.contentWindow.postMessage).not.toHaveBeenCalled();
    s.parent.destroy();
  });

  it("waits for withdrawal cleanup before a rapid re-grant and resumes only the latest navigation", async () => {
    const s = setup();
    let finish!: (value: { ok: boolean }) => void;
    s.fetcher.mockReturnValue(new Promise(resolve => { finish = resolve; }));
    s.parent.reconcile(granted, false); s.ready();
    const permission = s.doc.cookie;
    s.doc.cookie = ""; s.parent.reconcile(denied, false);
    s.doc.cookie = permission; s.parent.reconcile(granted, false);
    s.location.pathname = "/locations/vacaville";
    s.parent.reconcile(granted, false);
    expect(s.doc.createElement).toHaveBeenCalledTimes(1);
    finish({ ok: true });
    await vi.waitFor(() => expect(s.doc.createElement).toHaveBeenCalledTimes(2));
    s.ready();
    const views = s.frame.contentWindow.postMessage.mock.calls.filter(([m]) => m.action === "page_view");
    expect(views).toHaveLength(2);
    expect(views.at(-1)?.[0].pageGroup).toBe("vacaville");
    expect(s.fetcher).toHaveBeenCalledTimes(1);
    s.parent.destroy();
  });

  it("does not revive a frame if booking starts while withdrawal cleanup is pending", async () => {
    const s = setup();
    let finish!: (value: { ok: boolean }) => void;
    s.fetcher.mockReturnValue(new Promise(resolve => { finish = resolve; }));
    s.parent.reconcile(granted, false); s.ready();
    const permission = s.doc.cookie;
    s.doc.cookie = ""; s.parent.reconcile(denied, false);
    s.doc.cookie = permission; s.parent.reconcile(granted, false);
    setPublicAnalyticsBookingState(true);
    finish({ ok: true });
    await Promise.resolve(); await Promise.resolve(); await Promise.resolve();
    s.parent.reconcile(granted, false);
    expect(s.doc.createElement).toHaveBeenCalledTimes(1);
    s.parent.destroy();
  });

  it("rechecks actual cookie permission after cleanup rather than trusting the earlier granted view", async () => {
    const s = setup();
    let finish!: (value: { ok: boolean }) => void;
    s.fetcher.mockReturnValueOnce(new Promise(resolve => { finish = resolve; }));
    s.parent.reconcile(granted, false);
    const permission = s.doc.cookie;
    s.doc.cookie = ""; s.parent.reconcile(denied, false);
    s.doc.cookie = permission; s.parent.reconcile(granted, false);
    s.doc.cookie = "";
    finish({ ok: true });
    await Promise.resolve(); await Promise.resolve(); await Promise.resolve();
    expect(s.doc.createElement).toHaveBeenCalledTimes(1);
    s.parent.destroy();
  });

  it.each([false, "network-error"])("keeps analytics off if withdrawal cleanup cannot be confirmed: %s", async result => {
    const s = setup();
    if (result === "network-error") s.fetcher.mockRejectedValue(new Error("network unavailable"));
    else s.fetcher.mockResolvedValue({ ok: false });
    s.parent.reconcile(granted, false);
    const permission = s.doc.cookie;
    s.doc.cookie = ""; s.parent.reconcile(denied, false);
    s.doc.cookie = permission; s.parent.reconcile(granted, false);
    await Promise.resolve(); await Promise.resolve(); await Promise.resolve();
    s.parent.reconcile(granted, false);
    expect(s.doc.createElement).toHaveBeenCalledTimes(1);
    s.parent.destroy();
  });
});
