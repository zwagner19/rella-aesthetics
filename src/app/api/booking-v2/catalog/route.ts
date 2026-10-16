import { NextRequest } from "next/server";
import {
  callBookingApi,
  jsonError,
  proxyResponse,
  siteScopeFromUrl,
} from "@/lib/guided-booking/booking-proxy";
import {
  parseBookingLocation,
  sanitizeCatalogDescriptions,
} from "@/lib/guided-booking/live-catalog";

export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const siteScope = siteScopeFromUrl(url);
  const location = parseBookingLocation(url.searchParams.get("location"));
  if (!siteScope) return jsonError(400, "unknown_site_scope");
  if (!location) return jsonError(400, "location must be napa or vacaville");

  const result = await callBookingApi({
    siteScope,
    path: `/api/booking-v2/catalog?location=${location}`,
    method: "GET",
  });
  return proxyResponse(
    { ...result, body: sanitizeCatalogDescriptions(result.body) },
    request,
  );
}
