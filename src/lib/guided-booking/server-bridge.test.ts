import { beforeEach, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { bookingBridge, bookingCookies } from "./server-bridge";
function request(operation: string, body: object, origin = "https://experiencerella.com", cookie = "") {
  return new NextRequest(`https://experiencerella.com/api/booking-v2/bridge/${operation}`, { method: "POST", headers: { origin, "content-type": "application/json", cookie }, body: JSON.stringify(body) });
}
beforeEach(() => { vi.restoreAllMocks(); delete process.env.RELLA_BOOKING_BACKEND_ORIGIN; });
it("rejects hostile origins and unknown operations before contacting the backend", async () => {
  const network = vi.spyOn(globalThis, "fetch");
  expect((await bookingBridge(request("menu", { location: "napa" }, "https://evil.test"), "menu")).status).toBe(403);
  expect((await bookingBridge(request("unknown", {}), "unknown")).status).toBe(404);
  expect(network).not.toHaveBeenCalled();
});
it("forwards only booking cookies and hides raw cart identity while preserving HttpOnly auth", async () => {
  const network = vi.spyOn(globalThis, "fetch").mockResolvedValue(Response.json({ ok: true, cartId: "secret", services: [] }, { headers: { "set-cookie": "rella_cart_auth=signed; Domain=book.experiencerella.com; HttpOnly; Secure; Path=/; SameSite=Lax" } }));
  const response = await bookingBridge(request("menu", { location: "napa" }, undefined, "unrelated=secret; rella_attribution_id=opaque"), "menu");
  const result = await response.json(); expect(result.cartId).toBeUndefined(); expect(result.cardFrameOrigin).toBe("https://book.experiencerella.com");
  expect(response.headers.get("set-cookie")).toContain("HttpOnly"); expect(response.headers.get("set-cookie")).not.toContain("Domain=");
  const init = network.mock.calls[0][1]!; expect(JSON.parse(String(init.body))).toEqual({ location: "napa", menu: true });
  expect((init.headers as Record<string, string>).Cookie).toBe("rella_attribution_id=opaque");
  expect(bookingCookies("other=private; rella_cart_auth=x")).toBe("rella_cart_auth=x");
});
it("derives cart identity from the session and leaves signature verification to the booking backend", async () => {
  const token = Buffer.from(JSON.stringify({ c: "urn:blvd:Cart:fixture" })).toString("base64url") + ".signature";
  const network = vi.spyOn(globalThis, "fetch").mockResolvedValue(Response.json({ ok: true }));
  await bookingBridge(request("reserve", { cartId: "caller-cart", bookableTimeId: "time" }, undefined, `rella_cart_auth=${token}`), "reserve");
  expect(JSON.parse(String(network.mock.calls[0][1]?.body))).toEqual({ cartId: "urn:blvd:Cart:fixture", bookableTimeId: "time" });
});
it("fails closed on missing session, arbitrary backend and network uncertainty", async () => {
  expect((await bookingBridge(request("payment", { token: "opaque" }), "payment")).status).toBe(409);
  process.env.RELLA_BOOKING_BACKEND_ORIGIN = "https://evil.test";
  expect((await bookingBridge(request("menu", { location: "napa" }), "menu")).status).toBe(502);
  delete process.env.RELLA_BOOKING_BACKEND_ORIGIN;
  vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("private upstream error"));
  const response = await bookingBridge(request("menu", { location: "napa" }), "menu");
  expect(await response.json()).toEqual({ ok: false, reason: "booking_unavailable" });
});
