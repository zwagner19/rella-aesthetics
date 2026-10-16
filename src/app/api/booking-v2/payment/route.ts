import { NextRequest } from "next/server";
import {
  callBookingApi,
  cartAuthCookie,
  jsonError,
  proxyResponse,
  requireCartId,
  siteScopeFromUrl,
} from "@/lib/guided-booking/booking-proxy";

const CARD_FIELDS = ["number", "cvv", "exp", "card", "pan"] as const;

export async function POST(request: NextRequest) {
  const siteScope = siteScopeFromUrl(request.nextUrl);
  if (!siteScope) return jsonError(400, "unknown_site_scope");

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return jsonError(400, "invalid_json");
  }
  if (!raw || typeof raw !== "object") return jsonError(400, "invalid_json");
  const record = raw as Record<string, unknown>;
  for (const field of CARD_FIELDS) {
    if (field in record) return jsonError(400, "raw_card_rejected");
  }
  const token = record.token;
  if (typeof token !== "string" || token.length < 8 || token.length > 500 || /^\d{13,19}$/.test(token)) {
    return jsonError(400, "token is required");
  }

  const cartId = requireCartId(cartAuthCookie(request));
  if (!cartId) return jsonError(409, "missing_cart_cookie");

  const result = await callBookingApi({
    siteScope,
    path: "/api/booking-v2/payment",
    method: "POST",
    cookie: `rella_cart_auth=${cartAuthCookie(request)}`,
    jsonBody: { cartId, token },
  });
  return proxyResponse(result, request);
}
