import { randomBytes } from "node:crypto";
import {
  isPublicAnalyticsRequest,
  publicAnalyticsBaseHeaders,
  publicAnalyticsFrameHeaders,
  renderPublicAnalyticsFrame,
} from "@/lib/public-analytics-frame";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET(request: Request): Response {
  if (!isPublicAnalyticsRequest(request)) {
    return new Response(null, { status: 404, headers: publicAnalyticsBaseHeaders() });
  }
  const nonce = randomBytes(24).toString("base64");
  return new Response(renderPublicAnalyticsFrame(nonce), { headers: publicAnalyticsFrameHeaders(nonce) });
}
