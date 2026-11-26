import type { NextRequest } from "next/server";
import { bookingBackendOrigin } from "../guided-booking/server-bridge";

/** Gifting uses a bearer capability, not a client ID or browser payment claim. */
export async function giftBridge(req: NextRequest, operation: string): Promise<Response> {
  const headers = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" };
  if (operation !== "gift" && operation !== "later") return Response.json({ ok: false }, { status: 404, headers });
  if (req.headers.get("origin") !== req.nextUrl.origin || req.headers.get("sec-fetch-site") === "cross-site") return Response.json({ ok: false }, { status: 403, headers });
  if (!req.headers.get("content-type")?.startsWith("application/json")) return Response.json({ ok: false }, { status: 415, headers });
  try {
    const text = await req.text();
    if (text.length > 4096) return Response.json({ ok: false }, { status: 413, headers });
    const body = JSON.parse(text);
    const keys = operation === "gift" ? ["token", "recipientFirstName", "recipientEmail", "senderName", "message"] : ["token"];
    if (!body || typeof body !== "object" || Array.isArray(body) || Object.keys(body).some(k => !keys.includes(k))
      || typeof body.token !== "string" || !/^[A-Za-z0-9_-]{43}$/.test(body.token)) return Response.json({ ok: false }, { status: 400, headers });
    const origin = bookingBackendOrigin();
    const upstream = await fetch(new URL(`/api/gift-cards/gift${operation === "later" ? "/later" : ""}`, origin), {
      method: "POST", redirect: "error", cache: "no-store", signal: AbortSignal.timeout(20000),
      headers: { "Content-Type": "application/json", Origin: "https://book.experiencerella.com" }, body: JSON.stringify(body),
    });
    return Response.json(await upstream.json(), { status: upstream.status, headers });
  } catch { return Response.json({ ok: false, status: "unverified" }, { status: 503, headers }); }
}
