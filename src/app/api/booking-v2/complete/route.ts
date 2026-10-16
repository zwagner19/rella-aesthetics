import { NextRequest } from "next/server";
import {
  callBookingApi,
  cartAuthCookie,
  jsonError,
  proxyResponse,
  requireCartId,
  siteScopeFromUrl,
} from "@/lib/guided-booking/booking-proxy";

export async function POST(request: NextRequest) {
  const siteScope = siteScopeFromUrl(request.nextUrl);
  if (!siteScope) return jsonError(400, "unknown_site_scope");

  const cartId = requireCartId(cartAuthCookie(request));
  if (!cartId) return jsonError(409, "missing_cart_cookie");

  const result = await callBookingApi({
    siteScope,
    path: "/api/booking-v2/complete",
    method: "POST",
    cookie: `rella_cart_auth=${cartAuthCookie(request)}`,
    jsonBody: { cartId },
  });
  return proxyResponse(result, request);
}
