import { createHmac } from "node:crypto";
import { hasInsightsConsent } from "@/lib/website-insights";
import { validInsightSample } from "@/lib/website-insights-contract";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = {
  "Cache-Control": "private, no-store",
  "X-Robots-Tag": "noindex, nofollow",
};
// Ephemeral abuse protection only: never persisted or forwarded to reporting.
const limits = new Map<string, { at: number; n: number }>();
export async function POST(request: Request) {
  const url = new URL(request.url);
  if (
    request.headers.get("origin") !== url.origin ||
    url.search ||
    request.headers.get("content-type") !== "application/json"
  )
    return new Response(null, { status: 403, headers });
  if (!hasInsightsConsent(request.headers.get("cookie") ?? "", Date.now()))
    return new Response(null, { status: 204, headers });
  const secret = process.env.LEAD_INBOX_WEBSITE_WEBHOOK_SECRET;
  if (!secret || secret.length < 32)
    return new Response(null, { status: 503, headers });
  if (Number(request.headers.get("content-length") ?? 0) > 6000)
    return new Response(null, { status: 413, headers });
  const raw = await request.text();
  if (Buffer.byteLength(raw) > 6000)
    return new Response(null, { status: 413, headers });
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return new Response(null, { status: 400, headers });
  }
  if (!validInsightSample(value))
    return new Response(null, { status: 400, headers });
  const key = createHmac("sha256", secret)
    .update(request.headers.get("x-forwarded-for") ?? "unknown")
    .digest("hex");
  const now = Date.now();
  const prior = limits.get(key);
  if (prior && now - prior.at < 60_000 && prior.n >= 80)
    return new Response(null, { status: 429, headers });
  if (limits.size > 4000) limits.clear();
  limits.set(
    key,
    prior && now - prior.at < 60_000
      ? { at: prior.at, n: prior.n + 1 }
      : { at: now, n: 1 },
  );
  const body = JSON.stringify(value);
  const timestamp = Math.floor(now / 1000).toString();
  const signature = createHmac("sha256", secret)
    .update(`website-insights-v1.${timestamp}.${body}`)
    .digest("hex");
  try {
    const result = await fetch(
      "https://rella-hq.vercel.app/api/integrations/website-insights",
      {
        method: "POST",
        body,
        headers: {
          "Content-Type": "application/json",
          "x-rella-insights-timestamp": timestamp,
          "x-rella-insights-signature": signature,
        },
        cache: "no-store",
        redirect: "manual",
        signal: AbortSignal.timeout(4000),
      },
    );
    return new Response(null, { status: result.ok ? 204 : 503, headers });
  } catch {
    return new Response(null, { status: 503, headers });
  }
}
