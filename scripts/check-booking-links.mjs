const baseUrl = new URL(process.env.SITE_URL ?? "http://localhost:3000");

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

async function readPage(url) {
  const response = await fetch(url, {
    headers: { "user-agent": "RellaBookingHealthCheck/1.0" },
    redirect: "follow",
    signal: AbortSignal.timeout(15_000),
  });
  return { response, text: await response.text() };
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

const bookingLinks = new Set();
const bookingReferences = new Map();
const failures = [];

for (const pageUrl of sitemapUrls) {
  let result;
  try {
    result = await readPage(pageUrl);
  } catch (error) {
    const name = error instanceof Error ? error.name : "UnknownError";
    failures.push(`${name} while reading page: ${pageUrl}`);
    continue;
  }

  if (!result.response.ok) {
    failures.push(`${result.response.status} page: ${pageUrl}`);
    continue;
  }

  for (const match of result.text.matchAll(/href=["']([^"']+)["']/g)) {
    const href = decodeHref(match[1]);
    let target;
    try {
      target = new URL(href, pageUrl);
    } catch {
      continue;
    }

    if (!bookingSourceHosts.has(target.hostname)) continue;
    if (target.protocol !== "https:") {
      failures.push(`Non-HTTPS booking link on ${pageUrl}: ${target}`);
      continue;
    }
    target.hash = "";
    const normalized = target.toString();
    bookingLinks.add(normalized);
    const references = bookingReferences.get(normalized) ?? new Set();
    references.add(new URL(pageUrl).pathname);
    bookingReferences.set(normalized, references);
  }
}

if (bookingLinks.size === 0) {
  failures.push("No external booking destinations were discovered.");
}

for (const host of bookingSourceHosts) {
  if (![...bookingLinks].some((url) => new URL(url).hostname === host)) {
    failures.push(`No rendered booking destination uses required host: ${host}`);
  }
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
    `Booking destination check passed: ${sitemapUrls.length} pages, ${bookingLinks.size} unique destinations.`,
  );
  for (const [route, count] of hostSummary) {
    console.log(`- ${count} ${route}`);
  }
  console.log(
    "- HTTP reachability and Rella-owned booking-host containment passed; rendered booking-screen verification remains a separate launch gate.",
  );
}
