import { request as httpRequest } from "node:http";
import { request as httpsRequest } from "node:https";

const baseUrl = new URL(process.env.SITE_URL ?? "http://localhost:3000");
const configuredWeightLossSiteUrl = process.env.BOOKING_CHECK_WEIGHT_LOSS_SITE_URL;
const weightLossSiteUrl = new URL(
  configuredWeightLossSiteUrl ?? baseUrl,
);
const weightLossMarketingHost = "weightloss.experiencerella.com";
const localCandidateHosts = new Set(["localhost", "127.0.0.1", "::1"]);
const isLocalWeightLossCandidate = localCandidateHosts.has(weightLossSiteUrl.hostname);
const checkWeightLossContext =
  isLocalWeightLossCandidate || Boolean(configuredWeightLossSiteUrl);
const requestedWeightLossHostOverride = process.env.BOOKING_CHECK_WEIGHT_LOSS_HOST;

if (requestedWeightLossHostOverride && !isLocalWeightLossCandidate) {
  throw new Error(
    "BOOKING_CHECK_WEIGHT_LOSS_HOST may only be used with a local exact-build candidate.",
  );
}

const weightLossHostOverride = isLocalWeightLossCandidate
  ? requestedWeightLossHostOverride ?? weightLossMarketingHost
  : "";

const configuredAestheticsOrigin = new URL(
  process.env.BOOKING_CHECK_AESTHETICS_ORIGIN ??
    process.env.NEXT_PUBLIC_RELLA_BOOKING_ORIGIN ??
    "https://book.experiencerella.com",
);
if (configuredAestheticsOrigin.protocol !== "https:") {
  throw new Error("The aesthetics booking check origin must use HTTPS.");
}

const bookingSourceHosts = new Set([
  configuredAestheticsOrigin.hostname,
  "book.rellaweightloss.com",
]);
const allowedFinalHosts = new Set(bookingSourceHosts);

function isForbiddenCustomerDestination(target) {
  const hostname = target.hostname.toLowerCase();
  return (
    hostname === "dashboard.boulevard.io" ||
    hostname === "joinblvd.com" ||
    hostname.endsWith(".joinblvd.com") ||
    hostname.includes("rella-hq")
  );
}

function localize(url) {
  const parsed = new URL(url, baseUrl);
  return new URL(`${parsed.pathname}${parsed.search}`, baseUrl).toString();
}

function decodeHref(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&#x27;", "'")
    .replaceAll("&quot;", '"');
}

async function readPage(url, headers = {}) {
  const response = await fetch(url, {
    headers: { "user-agent": "RellaBookingHealthCheck/1.0", ...headers },
    redirect: "follow",
    signal: AbortSignal.timeout(15_000),
  });
  return { response, text: await response.text() };
}

/**
 * Connect to a local exact-build candidate while presenting the canonical
 * weight-loss Host header. Never use this override on a hosted preview: the
 * Host header is part of deployment routing there. Hosted checks must use a
 * real candidate-specific weight-loss URL with no override.
 */
async function readHostContextPage(url, host) {
  const target = new URL(url);
  const request = target.protocol === "https:" ? httpsRequest : httpRequest;

  return new Promise((resolve, reject) => {
    const outgoing = request(
      target,
      {
        headers: {
          host,
          "user-agent": "RellaBookingHealthCheck/1.0",
        },
      },
      (incoming) => {
        const chunks = [];
        incoming.on("data", (chunk) => chunks.push(chunk));
        incoming.on("end", () => {
          const status = incoming.statusCode ?? 0;
          resolve({
            response: { ok: status >= 200 && status < 300, status },
            text: Buffer.concat(chunks).toString("utf8"),
          });
        });
      },
    );
    outgoing.setTimeout(15_000, () => {
      outgoing.destroy(new Error(`Timed out reading ${host} from ${target.origin}`));
    });
    outgoing.on("error", reject);
    outgoing.end();
  });
}

const sitemapResult = await readPage(new URL("/sitemap-0.xml", baseUrl));
if (!sitemapResult.response.ok) {
  throw new Error(
    `Could not read sitemap-0.xml (${sitemapResult.response.status}) at ${baseUrl}`,
  );
}

const sitemapUrls = [
  ...sitemapResult.text.matchAll(/<loc>([^<]+)<\/loc>/g),
].map((match) => localize(match[1]));

if (sitemapUrls.length === 0) {
  throw new Error("The sitemap contained no public page URLs.");
}

const pageContexts = [
  ...sitemapUrls.map((url) => ({ context: "aesthetics", url, headers: {} })),
  ...(checkWeightLossContext
    ? [
        {
          context: "weight-loss",
          url: new URL("/", weightLossSiteUrl).toString(),
          host: weightLossHostOverride || undefined,
        },
      ]
    : []),
];

const bookingLinks = new Set();
const bookingReferences = new Map();
const bookingLinksByContext = new Map([
  ["aesthetics", new Set()],
  ["weight-loss", new Set()],
]);
const failures = [];

for (const page of pageContexts) {
  let result;
  try {
    result = page.host
      ? await readHostContextPage(page.url, page.host)
      : await readPage(page.url, page.headers);
  } catch (error) {
    const name = error instanceof Error ? error.name : "UnknownError";
    failures.push(`${name} while reading ${page.context} page: ${page.url}`);
    continue;
  }

  if (!result.response.ok) {
    failures.push(`${result.response.status} ${page.context} page: ${page.url}`);
    continue;
  }

  for (const match of result.text.matchAll(/href=["']([^"']+)["']/g)) {
    const href = decodeHref(match[1]);
    let target;
    try {
      target = new URL(href, page.url);
    } catch {
      continue;
    }

    if (isForbiddenCustomerDestination(target)) {
      failures.push(`Forbidden customer destination on ${page.url}: ${target}`);
      continue;
    }
    if (!bookingSourceHosts.has(target.hostname)) continue;
    if (target.protocol !== "https:") {
      failures.push(`Non-HTTPS booking link on ${page.url}: ${target}`);
      continue;
    }
    target.hash = "";
    const normalized = target.toString();
    bookingLinks.add(normalized);
    bookingLinksByContext.get(page.context)?.add(normalized);
    const references = bookingReferences.get(normalized) ?? new Set();
    references.add(`${page.context}:${new URL(page.url).pathname}`);
    bookingReferences.set(normalized, references);
  }
}

if (bookingLinks.size === 0) {
  failures.push("No external booking destinations were discovered.");
}

if (![...bookingLinksByContext.get("aesthetics")].some(
  (url) => new URL(url).hostname === configuredAestheticsOrigin.hostname,
)) {
  failures.push(
    `Aesthetics host context has no booking destination on ${configuredAestheticsOrigin.hostname}`,
  );
}
if (checkWeightLossContext && ![...bookingLinksByContext.get("weight-loss")].some(
  (url) => new URL(url).hostname === "book.rellaweightloss.com",
)) {
  failures.push(
    "Weight-loss host context has no booking destination on book.rellaweightloss.com",
  );
}

const healthy = [];
for (const bookingUrl of [...bookingLinks].sort()) {
  try {
    const response = await fetch(bookingUrl, {
      headers: { "user-agent": "RellaBookingHealthCheck/1.0" },
      redirect: "follow",
      signal: AbortSignal.timeout(15_000),
    });
    const finalUrl = new URL(response.url);
    await response.body?.cancel();

    if (!response.ok) {
      failures.push(`${response.status} booking destination: ${bookingUrl}`);
      continue;
    }
    if (finalUrl.protocol !== "https:") {
      failures.push(`Booking redirect ended on non-HTTPS URL: ${finalUrl}`);
      continue;
    }
    if (!allowedFinalHosts.has(finalUrl.hostname)) {
      failures.push(
        `Booking redirect left the approved host set: ${bookingUrl} → ${finalUrl}`,
      );
      continue;
    }

    healthy.push({
      source: new URL(bookingUrl).hostname,
      final: finalUrl.hostname,
      references: bookingReferences.get(bookingUrl)?.size ?? 0,
    });
  } catch (error) {
    const name = error instanceof Error ? error.name : "UnknownError";
    failures.push(`${name} booking destination: ${bookingUrl}`);
  }
}

if (failures.length > 0) {
  console.error("Booking destination check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  const hostSummary = new Map();
  for (const route of healthy) {
    const key = `${route.source} → ${route.final}`;
    hostSummary.set(key, (hostSummary.get(key) ?? 0) + 1);
  }

  console.log(
    `Booking destination check passed: ${sitemapUrls.length} aesthetics pages${checkWeightLossContext ? " plus the weight-loss host root" : ""}, ${bookingLinks.size} unique destinations.`,
  );
  for (const [route, count] of hostSummary) {
    console.log(`- ${count} ${route}`);
  }
  console.log(
    "- HTTP reachability and Rella-owned booking-host containment passed; rendered booking-screen verification remains a separate launch gate.",
  );
}
