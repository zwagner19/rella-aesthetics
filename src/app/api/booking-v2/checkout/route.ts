import { NextRequest } from "next/server";
import {
  callBookingApi,
  cartAuthCookie,
  jsonError,
  proxyResponse,
  requireCartId,
  siteScopeFromUrl,
} from "@/lib/guided-booking/booking-proxy";
import { checkoutInfoBody } from "@/lib/guided-booking/live-catalog";

export async function POST(request: NextRequest) {
  const siteScope = siteScopeFromUrl(request.nextUrl);
  if (!siteScope) return jsonError(400, "unknown_site_scope");

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return jsonError(400, "invalid_json");
  }
  const info = checkoutInfoBody(raw);
  if (!info) return jsonError(400, "client info is required");

  const cartId = requireCartId(cartAuthCookie(request));
  if (!cartId) return jsonError(409, "missing_cart_cookie");

  const result = await callBookingApi({
    siteScope,
    path: "/api/booking-v2/checkout",
    method: "POST",
    cookie: `rella_cart_auth=${cartAuthCookie(request)}`,
    jsonBody: { cartId, info },
  });
  return proxyResponse(result, request);
}
