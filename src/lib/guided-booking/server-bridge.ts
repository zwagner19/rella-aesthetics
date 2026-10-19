import { NextRequest } from "next/server";

export function bookingBackendOrigin(): string {
  const url = new URL(process.env.RELLA_BOOKING_BACKEND_ORIGIN ?? "https://book.experiencerella.com");
  const local = process.env.NODE_ENV !== "production" && ["localhost", "127.0.0.1"].includes(url.hostname);
  const approved = url.hostname === "book.experiencerella.com" || /^rella-booking-[a-z0-9-]+-zwagner19s-projects\.vercel\.app$/.test(url.hostname);
  if ((!local && (!approved || url.protocol !== "https:")) || url.username || url.password || url.pathname !== "/" || url.search || url.hash) throw new Error("backend_unavailable");
  return url.origin;
}
const COOKIES = new Set(["rella_cart_auth", "rella_attribution_id", "rella_ad_attribution_scope", "rella_ad_attribution_revoke", "rella_ad_user_data_denied", "rella_menu_visitor", "rella_package_identity", "rella_owned_booking"]);
export function bookingCookies(raw: string): string {
  return raw.split(";").map(c => c.trim()).filter(c => COOKIES.has(c.split("=")[0])).join("; ");
}
function cartId(cookie: string): string | null {
  const token = cookie.split(";").map(c => c.trim()).find(c => c.startsWith("rella_cart_auth="))?.slice(16);
  if (!token) return null;
  try {
    const value = JSON.parse(Buffer.from(token.split(".")[0], "base64url").toString()) as { c?: unknown };
    return typeof value.c === "string" && /^urn:blvd:Cart:[A-Za-z0-9_-]{1,64}$/.test(value.c) ? value.c : null;
  } catch { return null; }
}
const OPERATIONS: Record<string, string> = { menu: "cart", selection: "selection", times: "cart", reserve: "reserve", release: "release", payment: "payment", consent: "consent", checkout: "checkout", complete: "complete" };
export async function bookingBridge(req: NextRequest, operation: string): Promise<Response> {
  const catalogRead = operation === "menu" && req.method === "GET";
  const path = catalogRead ? "menu" : OPERATIONS[operation];
  if (!path) return Response.json({ ok: false }, { status: 404 });
  if ((req.method === "GET") !== (operation === "times" || catalogRead)) return Response.json({ ok: false }, { status: 405 });
  // Validate the real browser origin BEFORE setting the upstream server origin.
  if (req.method !== "GET" && req.headers.get("origin") !== req.nextUrl.origin) return Response.json({ ok: false }, { status: 403 });
  if (req.headers.get("sec-fetch-site") === "cross-site") return Response.json({ ok: false }, { status: 403 });
  try {
    const origin = bookingBackendOrigin();
    const cookie = bookingCookies(req.headers.get("cookie") ?? "");
    let payload: Record<string, unknown> = {};
    if (req.method === "POST") {
      if (!req.headers.get("content-type")?.startsWith("application/json")) return Response.json({ ok: false }, { status: 415 });
      const raw = await req.text();
      if (raw.length > 10_240) return Response.json({ ok: false }, { status: 413 });
      payload = JSON.parse(raw);
      if (!payload || typeof payload !== "object" || Array.isArray(payload)) return Response.json({ ok: false }, { status: 400 });
    }
    const url = new URL(`/api/booking-v2/${path}`, origin);
    if (catalogRead) {
      const location = req.nextUrl.searchParams.get("location");
      if (location !== "napa" && location !== "vacaville") return Response.json({ ok: false }, { status: 400 });
      url.searchParams.set("location", location);
    } else if (operation === "menu") {
      if (Object.keys(payload).some(k => !["location", "consentAdUserData", "packageOwned"].includes(k))) return Response.json({ ok: false }, { status: 400 });
      payload.menu = true;
    } else {
      const id = cartId(cookie);
      if (!id) return Response.json({ ok: false, reason: "session_expired" }, { status: 409 });
      if (req.method === "GET") {
        url.searchParams.set("cartId", id); url.searchParams.set("date", req.nextUrl.searchParams.get("date") ?? "");
      } else {
        // Cart identity always comes from the HttpOnly session, never page JS.
        delete payload.cartId; payload.cartId = id;
      }
    }
    const upstream = await fetch(url, { method: req.method, headers: {
      "Content-Type": "application/json", Origin: "https://book.experiencerella.com", Cookie: cookie,
    }, ...(req.method === "POST" ? { body: JSON.stringify(payload) } : {}), cache: "no-store", redirect: "manual", signal: AbortSignal.timeout(25_000) });
    const body = await upstream.json() as Record<string, unknown>;
    delete body.cartId;
    if (operation === "menu" && upstream.ok) body.cardFrameOrigin = origin;
    const headers = new Headers({ "Content-Type": "application/json", "Cache-Control": "no-store" });
    for (const setCookie of upstream.headers.getSetCookie()) {
      const name = setCookie.split("=")[0];
      if (!COOKIES.has(name)) continue;
      let rewritten = setCookie.replace(/;\s*Domain=[^;]*/gi, "");
      if (req.nextUrl.protocol === "http:" && process.env.NODE_ENV !== "production") rewritten = rewritten.replace(/;\s*Secure/gi, "");
      headers.append("Set-Cookie", rewritten);
    }
    return new Response(JSON.stringify(body), { status: upstream.status, headers });
  } catch {
    return Response.json({ ok: false, reason: "booking_unavailable" }, { status: 502 });
  }
}
