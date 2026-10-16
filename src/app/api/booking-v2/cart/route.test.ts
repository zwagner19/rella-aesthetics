import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "./route";
import { POST as pay } from "../payment/route";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("booking cart proxy", () => {
  it("calls the aesthetics host without click ids or the browser origin", async () => {
    const fetchMock = vi.fn(async () =>
      new Response(
        JSON.stringify({
          ok: true,
          cartId: "urn:blvd:Cart:hidden",
          depositCents: 10000,
          dates: ["2026-10-17"],
        }),
        {
          status: 200,
          headers: {
            "content-type": "application/json",
            "set-cookie":
              "rella_cart_auth=payload.sig; Path=/; HttpOnly; Secure; SameSite=Lax",
          },
        },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(
      new NextRequest("https://experiencerella.com/api/booking-v2/cart?siteScope=aesthetics", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          origin: "https://experiencerella.com",
        },
        body: JSON.stringify({
          location: "napa",
          service: "botox",
          gclid: "do-not-forward",
        }),
      }),
    );

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://book.experiencerella.com/api/booking-v2/cart");
    expect(init.method).toBe("POST");
    const headers = init.headers as Headers;
    expect(headers.get("origin")).toBe("https://book.experiencerella.com");
    expect(JSON.parse(String(init.body))).toEqual({
      location: "napa",
      service: "botox",
    });
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      ok: true,
      depositCents: 10000,
      dates: ["2026-10-17"],
    });
    expect(response.headers.get("set-cookie")).toContain("rella_cart_auth=");
    expect(response.headers.get("set-cookie")).not.toContain("Domain=");
  });

  it("rejects a raw card posted to payment", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const response = await pay(
      new NextRequest("https://experiencerella.com/api/booking-v2/payment", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ number: "4242424242424242", cvv: "123" }),
      }),
    );
    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
