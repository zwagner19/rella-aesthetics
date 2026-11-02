import {
  isPublicAnalyticsOrigin,
  isPublicAnalyticsRequest,
  PUBLIC_ANALYTICS_COOKIE_NAMES,
  publicAnalyticsBaseHeaders,
} from "@/lib/public-analytics-frame";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function responseHeaders(origin: string | null): Headers {
  const headers = publicAnalyticsBaseHeaders();
  headers.set("Vary", "Origin");
  if (isPublicAnalyticsOrigin(origin)) {
    headers.set("Access-Control-Allow-Origin", origin!);
    headers.set("Access-Control-Allow-Credentials", "true");
    headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type");
  }
  return headers;
}

export function OPTIONS(request: Request): Response {
  const origin = request.headers.get("origin");
  const headers = responseHeaders(origin);
  if (!isPublicAnalyticsRequest(request)) return new Response(null, { status: 404, headers });
  const requestedHeaders = (request.headers.get("access-control-request-headers") ?? "")
    .split(",").map(value => value.trim().toLowerCase()).filter(Boolean);
  if (!isPublicAnalyticsOrigin(origin)
    || request.headers.get("access-control-request-method") !== "POST"
    || requestedHeaders.some(value => value !== "content-type")) {
    return new Response(null, { status: 403, headers });
  }
  return new Response(null, { status: 204, headers });
}

export async function POST(request: Request): Promise<Response> {
  const origin = request.headers.get("origin");
  const headers = responseHeaders(origin);
  if (!isPublicAnalyticsRequest(request)) return new Response(null, { status: 404, headers });
  if (!isPublicAnalyticsOrigin(origin)) return new Response(null, { status: 403, headers });
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") {
    return new Response(null, { status: 415, headers });
  }
  const text = await request.text();
  if (text.length > 64) return new Response(null, { status: 400, headers });
  let body: unknown;
  try { body = JSON.parse(text); } catch { return new Response(null, { status: 400, headers }); }
  if (!body || typeof body !== "object" || Array.isArray(body) || Object.keys(body).length !== 0) {
    return new Response(null, { status: 400, headers });
  }
  for (const name of PUBLIC_ANALYTICS_COOKIE_NAMES) {
    headers.append("Set-Cookie", `${name}=; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/; Secure; SameSite=Lax`);
  }
  return Response.json({ ok: true }, { headers });
}
