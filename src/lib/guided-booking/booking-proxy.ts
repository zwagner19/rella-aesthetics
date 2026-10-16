import {
  BOOKING_CART_COOKIE,
  bookingOrigin,
  cartIdFromAuthCookie,
  parseSiteScope,
  readCookie,
  rewriteCartSetCookie,
  stripBookingPayload,
  type BookingSiteScope,
} from "./live-catalog";

export interface UpstreamResult {
  status: number;
  body: unknown;
  setCookies: string[];
}

export async function callBookingApi(input: {
  siteScope: BookingSiteScope;
  path: string;
  method: "GET" | "POST";
  cookie?: string | null;
  jsonBody?: unknown;
}): Promise<UpstreamResult> {
  const origin = bookingOrigin(input.siteScope);
  const headers = new Headers({
    Accept: "application/json",
    Origin: origin,
  });
  if (input.cookie) headers.set("Cookie", input.cookie);
  if (input.jsonBody !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${origin}${input.path}`, {
    method: input.method,
    headers,
    body: input.jsonBody === undefined ? undefined : JSON.stringify(input.jsonBody),
    cache: "no-store",
    redirect: "manual",
  });

  const text = await response.text();
  let body: unknown = null;
  if (text) {
    try {
      body = JSON.parse(text) as unknown;
    } catch {
      body = { ok: false, reason: "booking_response_not_json" };
    }
  }

  const setCookies =
    typeof response.headers.getSetCookie === "function"
      ? response.headers.getSetCookie()
      : [];

  return { status: response.status, body, setCookies };
}

export function siteScopeFromUrl(url: URL): BookingSiteScope | null {
  return parseSiteScope(url.searchParams.get("siteScope"));
}

export function cartAuthCookie(request: Request): string | null {
  return readCookie(request.headers.get("cookie"), BOOKING_CART_COOKIE);
}

export function requireCartId(cookieValue: string | null): string | null {
  if (!cookieValue) return null;
  return cartIdFromAuthCookie(cookieValue);
}

export function proxyResponse(
  result: UpstreamResult,
  request: Request,
): Response {
  const headers = new Headers({
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
  });
  const secure = new URL(request.url).protocol === "https:";
  for (const setCookie of result.setCookies) {
    const rewritten = rewriteCartSetCookie(setCookie, secure);
    if (rewritten) headers.append("Set-Cookie", rewritten);
  }
  return new Response(JSON.stringify(stripBookingPayload(result.body)), {
    status: result.status,
    headers,
  });
}

export function jsonError(status: number, reason: string): Response {
  return Response.json(
    { ok: false, reason },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}
