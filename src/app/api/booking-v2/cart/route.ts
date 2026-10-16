import { NextRequest } from "next/server";
import {
  callBookingApi,
  cartAuthCookie,
  jsonError,
  proxyResponse,
  requireCartId,
  siteScopeFromUrl,
} from "@/lib/guided-booking/booking-proxy";
import { cartCreateBody } from "@/lib/guided-booking/live-catalog";

export async function POST(request: NextRequest) {
  const siteScope = siteScopeFromUrl(request.nextUrl);
  if (!siteScope) return jsonError(400, "unknown_site_scope");

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return jsonError(400, "invalid_json");
  }
  const body = cartCreateBody(raw);
  if (!body) return jsonError(400, "location and service are required");

  const result = await callBookingApi({
    siteScope,
    path: "/api/booking-v2/cart",
    method: "POST",
    jsonBody: { location: body.location, service: body.service },
  });
  return proxyResponse(result, request);
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const siteScope = siteScopeFromUrl(url);
  if (!siteScope) return jsonError(400, "unknown_site_scope");
  const date = url.searchParams.get("date") ?? "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return jsonError(400, "date is required");

  const cartCookie = cartAuthCookie(request);
  const cartId = requireCartId(cartCookie);
  if (!cartId || !cartCookie) return jsonError(409, "missing_cart_cookie");

  const result = await callBookingApi({
    siteScope,
    path: `/api/booking-v2/cart?cartId=${encodeURIComponent(cartId)}&date=${date}`,
    method: "GET",
    cookie: `rella_cart_auth=${cartCookie}`,
  });
  return proxyResponse(result, request);
}
