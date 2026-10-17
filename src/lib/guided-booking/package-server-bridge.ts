import { NextRequest } from "next/server";
import { bookingBackendOrigin } from "./server-bridge";

const GETS = new Set(["catalog", "status", "owned"]);
const POSTS = new Set(["start", "prepare", "payment", "checkout", "auth-code", "auth-verify", "auth-profile", "auth-logout", "book-owned"]);
const COOKIES = new Set(["rella_package_purchase", "rella_package_identity", "rella_owned_booking", "rella_menu_visitor", "rella_cart_auth"]);
export async function packageBridge(req: NextRequest, operation: string): Promise<Response> {
  if (!GETS.has(operation) && !POSTS.has(operation)) return Response.json({ ok: false }, { status: 404 });
  if ((req.method === "GET") !== GETS.has(operation)) return Response.json({ ok: false }, { status: 405 });
  if (req.headers.get("sec-fetch-site") === "cross-site" || (req.method === "POST" && req.headers.get("origin") !== req.nextUrl.origin)) return Response.json({ ok: false }, { status: 403 });
  try {
    const origin = bookingBackendOrigin();
    const url = new URL(`/api/package-booking/${operation}`, origin);
    if (operation === "catalog" || operation === "owned") {
      const location = req.nextUrl.searchParams.get("location");
      if (location !== "napa" && location !== "vacaville") return Response.json({ ok: false }, { status: 400 });
      url.searchParams.set("location", location);
    }
    let payload: Record<string, unknown> | undefined;
    if (req.method === "POST") {
      if (!req.headers.get("content-type")?.startsWith("application/json")) return Response.json({ ok: false }, { status: 415 });
      const raw = await req.text();
      if (raw.length > 10_240) return Response.json({ ok: false }, { status: 413 });
      payload = JSON.parse(raw);
      if (!payload || typeof payload !== "object" || Array.isArray(payload)) return Response.json({ ok: false }, { status: 400 });
    }
    const cookie = (req.headers.get("cookie") ?? "").split(";").map(value => value.trim()).filter(value => COOKIES.has(value.split("=")[0])).join("; ");
    const upstream = await fetch(url, { method: req.method,
      headers: { "Content-Type": "application/json", Origin: "https://book.experiencerella.com", Cookie: cookie },
      ...(payload ? { body: JSON.stringify(payload) } : {}), cache: "no-store", redirect: "manual", signal: AbortSignal.timeout(25_000) });
    const body = await upstream.json() as Record<string, unknown>;
    if (upstream.ok && (operation === "start" || operation === "prepare")) body.cardFrameOrigin = origin;
    const headers = new Headers({ "Content-Type": "application/json", "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" });
    for (const cookie of upstream.headers.getSetCookie()) {
      if (!COOKIES.has(cookie.split("=")[0])) continue;
      let forwarded = cookie.replace(/;\s*Domain=[^;]*/gi, "");
      if (req.nextUrl.protocol === "http:" && process.env.NODE_ENV !== "production") forwarded = forwarded.replace(/;\s*Secure/gi, "");
      headers.append("Set-Cookie", forwarded);
    }
    return new Response(JSON.stringify(body), { status: upstream.status, headers });
  } catch { return Response.json({ ok: false, reason: "package_unavailable" }, { status: 502 }); }
}
