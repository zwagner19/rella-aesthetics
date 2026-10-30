import { beforeEach, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { packageBridge } from "./package-server-bridge";
function request(op: string, body?: unknown, headers: Record<string,string> = {}) {
  return new NextRequest(`https://experiencerella.com/api/package-booking/${op}`, { method: body === undefined ? "GET" : "POST",
    headers: { origin: "https://experiencerella.com", "content-type": "application/json", ...headers }, ...(body !== undefined ? { body: JSON.stringify(body) } : {}) });
}
beforeEach(() => { vi.restoreAllMocks(); delete process.env.RELLA_BOOKING_BACKEND_ORIGIN; });
it("forwards consent choices with only the HttpOnly purchase proof", async () => {
  const network = vi.spyOn(globalThis,"fetch").mockResolvedValue(Response.json({ok:true}));
  const choice = {policyVersion:"rella-booking-consent-2026-10-19-v1",operational:true,marketing:false};
  await packageBridge(request("consent",choice,{cookie:"unrelated=secret; rella_package_purchase=session"}),"consent");
  expect(String(network.mock.calls[0][0])).toBe("https://book.experiencerella.com/api/package-booking/consent");
  expect((network.mock.calls[0][1]?.headers as Record<string,string>).Cookie).toBe("rella_package_purchase=session");
  expect(JSON.parse(String(network.mock.calls[0][1]?.body))).toEqual(choice);
});
it("rejects methods, unknown operations, hostile origins and invalid locations before network", async () => {
  const network = vi.spyOn(globalThis,"fetch");
  expect((await packageBridge(request("checkout"),"checkout")).status).toBe(405);
  expect((await packageBridge(request("unknown",{}),"unknown")).status).toBe(404);
  expect((await packageBridge(request("start",{}, {origin:"https://evil.test"}),"start")).status).toBe(403);
  expect((await packageBridge(request("owned"),"owned")).status).toBe(400);
  expect((await packageBridge(request("status",undefined,{"sec-fetch-site":"cross-site"}),"status")).status).toBe(403);
  expect(network).not.toHaveBeenCalled();
});
it("forwards only approved HttpOnly booking/identity proofs and rewrites only their cookie domains", async () => {
  const headers = new Headers(); headers.append("set-cookie","rella_package_purchase=opaque; Domain=book.experiencerella.com; HttpOnly; Secure; SameSite=Lax; Path=/"); headers.append("set-cookie","unrelated=private; Path=/");
  const network = vi.spyOn(globalThis,"fetch").mockResolvedValue(Response.json({ok:true,state:"CREATED",cardFrameOrigin:"https://evil.test"},{headers}));
  const response = await packageBridge(request("start",{location:"napa",packageKey:"public-key"},{cookie:"unrelated=private; rella_package_identity=owner; rella_menu_visitor=visitor; rella_cart_auth=cart"}),"start");
  const [url,init] = network.mock.calls[0]; expect(String(url)).toBe("https://book.experiencerella.com/api/package-booking/start");
  expect((init?.headers as Record<string,string>).Cookie).toBe("rella_package_identity=owner; rella_menu_visitor=visitor; rella_cart_auth=cart");
  expect(init?.redirect).toBe("manual"); expect(init?.cache).toBe("no-store");
  expect((await response.json()).cardFrameOrigin).toBe("https://book.experiencerella.com");
  expect(response.headers.get("set-cookie")).toContain("HttpOnly"); expect(response.headers.get("set-cookie")).toContain("Secure");
  expect(response.headers.get("set-cookie")).not.toMatch(/Domain=|unrelated/); expect(response.headers.get("cache-control")).toBe("no-store");
});
it.each(["napa","vacaville"])("reads public package catalog at %s without a purchase mutation", async location => {
  const network = vi.spyOn(globalThis,"fetch").mockResolvedValue(Response.json({ok:true,packages:[]}));
  const response = await packageBridge(new NextRequest(`https://experiencerella.com/api/package-booking/catalog?location=${location}`),"catalog");
  expect((await response.json()).packages).toEqual([]); expect(String(network.mock.calls[0][0])).toContain(`catalog?location=${location}`); expect(network.mock.calls[0][1]?.method).toBe("GET");
});
it("never turns lost network or invalid upstream data into a safely retryable financial result", async () => {
  vi.spyOn(globalThis,"fetch").mockRejectedValue(new Error("private-native-details"));
  const response = await packageBridge(request("checkout",{}),"checkout");
  expect(await response.json()).toEqual({ok:false,reason:"package_unavailable"});
});
it("rejects body arrays and oversized payloads before a mutation", async () => {
  const network = vi.spyOn(globalThis,"fetch");
  expect((await packageBridge(request("checkout",[]),"checkout")).status).toBe(400);
  expect((await packageBridge(request("payment",{token:"x".repeat(11000)}),"payment")).status).toBe(413); expect(network).not.toHaveBeenCalled();
});
