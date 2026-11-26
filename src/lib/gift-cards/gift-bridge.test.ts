import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { giftBridge } from "./gift-server-bridge";
import { packageBridge } from "../guided-booking/package-server-bridge";
import { BLACK_FRIDAY_2026, RELLA_PACKAGE_KEYS } from "./config";

const origin = "https://experiencerella.com", token = "x".repeat(43);
function request(body: unknown = { token }, extra: Record<string, string> = {}) {
  return new NextRequest(`${origin}/api/black-friday/gift`, { method: "POST", headers: { Origin: origin, "Content-Type": "application/json", ...extra }, body: JSON.stringify(body) });
}
beforeEach(() => { vi.restoreAllMocks(); vi.unstubAllEnvs(); });
afterEach(() => { vi.useRealTimers(); vi.unstubAllEnvs(); });
describe("same-origin gifting bridge", () => {
  it("sends only the exact gifting operation to the approved backend, without browser cookies", async () => {
    const fetch = vi.spyOn(globalThis, "fetch").mockResolvedValue(Response.json({ ok: true, status: "sent", recipientFirstName: "Synthetic" }));
    const response = await giftBridge(request({ token, recipientFirstName: "Synthetic", recipientEmail: "guest@example.test", senderName: "Buyer", message: "Hello" }), "gift");
    expect(response.status).toBe(200);
    expect(String(fetch.mock.calls[0][0])).toBe("https://book.experiencerella.com/api/gift-cards/gift");
    expect(fetch.mock.calls[0][1]?.headers).not.toHaveProperty("Cookie");
    expect(response.headers.get("cache-control")).toBe("no-store");
  });
  it.each(["foreign origin", "cross-site", "extra identity", "bad token", "unknown operation"])("rejects %s before any upstream request", async reason => {
    const fetch = vi.spyOn(globalThis, "fetch");
    const req = request(reason === "extra identity" ? { token, patientId: "not-accepted" } : reason === "bad token" ? { token: "short" } : { token },
      reason === "foreign origin" ? { Origin: "https://other.example.test" } : reason === "cross-site" ? { "Sec-Fetch-Site": "cross-site" } : {});
    expect((await giftBridge(req, reason === "unknown operation" ? "checkout" : "gift")).status).toBeGreaterThanOrEqual(400);
    expect(fetch).not.toHaveBeenCalled();
  });
  it("preserves uncertain delivery rather than claiming success or retrying", async () => {
    const fetch = vi.spyOn(globalThis, "fetch").mockResolvedValue(Response.json({ ok: false, status: "send-uncertain" }, { status: 202 }));
    const response = await giftBridge(request(), "gift");
    expect(response.status).toBe(202); expect((await response.json()).status).toBe("send-uncertain"); expect(fetch).toHaveBeenCalledOnce();
  });
  it("does not turn a network timeout into proof nothing was sent", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(Error("timeout"));
    const response = await giftBridge(request(), "gift");
    expect(response.status).toBe(503); expect(await response.json()).toEqual({ ok: false, status: "unverified" });
  });
});
describe("Black Friday start guard at the marketing bridge", () => {
  it("blocks production by default and before/after the campaign without contacting the backend", async () => {
    vi.useFakeTimers({ toFake: ["Date"] }); vi.setSystemTime(BLACK_FRIDAY_2026.window.startsAt);
    const fetch = vi.spyOn(globalThis, "fetch"); vi.stubEnv("VERCEL_ENV", "production");
    function start() { return packageBridge(request({ location: "napa", packageKey: RELLA_PACKAGE_KEYS["bf26-1000"].napa }), "start"); }
    expect((await start()).status).toBe(409);
    vi.stubEnv("BF_RELLA_CHECKOUT_LIVE", "1"); vi.setSystemTime(BLACK_FRIDAY_2026.window.startsAt - 1);
    expect((await start()).status).toBe(409);
    vi.setSystemTime(BLACK_FRIDAY_2026.window.endsAt + 1); expect((await start()).status).toBe(409);
    expect(fetch).not.toHaveBeenCalled();
  });
});
