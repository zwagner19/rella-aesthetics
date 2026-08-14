import { readFile } from "node:fs/promises";

const siteUrl = (process.env.SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const redirectFile = new URL("../legacy-redirects.json", import.meta.url);
const redirects = JSON.parse(await readFile(redirectFile, "utf8"));
const retiredSources = ["/events", "/upcoming-events"];

const failures = [];

for (const { source, destination } of redirects) {
  const firstResponse = await fetch(`${siteUrl}${source}`, { redirect: "manual" });
  const firstLocation = firstResponse.headers.get("location");

  if (![307, 308].includes(firstResponse.status)) {
    failures.push(`${source}: expected a permanent redirect, received ${firstResponse.status}`);
    continue;
  }

  if (firstLocation !== destination) {
    failures.push(`${source}: expected Location ${destination}, received ${firstLocation ?? "none"}`);
    continue;
  }

  const finalResponse = await fetch(`${siteUrl}${source}/`, { redirect: "follow" });
  const finalUrl = new URL(finalResponse.url);

  if (!finalResponse.ok) {
    failures.push(`${source}/: final response was ${finalResponse.status}`);
  } else if (finalUrl.pathname !== destination) {
    failures.push(`${source}/: expected final path ${destination}, reached ${finalUrl.pathname}`);
  }
}

for (const source of retiredSources) {
  for (const path of [source, `${source}/`]) {
    const response = await fetch(`${siteUrl}${path}`, { redirect: "manual" });
    if (response.status !== 410) {
      failures.push(`${path}: expected 410 Gone, received ${response.status}`);
    } else if (response.headers.has("location")) {
      failures.push(`${path}: retired URL must not redirect`);
    } else if (response.headers.get("x-robots-tag") !== "noindex, nofollow") {
      failures.push(`${path}: retired URL is missing noindex, nofollow`);
    }
  }
}

const giveawayResponse = await fetch(`${siteUrl}/giveaway-terms-and-conditions`);
const giveawayHtml = await giveawayResponse.text();
if (!giveawayResponse.ok) {
  failures.push(`/giveaway-terms-and-conditions: expected 200, received ${giveawayResponse.status}`);
} else if (!giveawayHtml.includes('content="noindex, follow"')) {
  failures.push("/giveaway-terms-and-conditions: preserved record is missing noindex, follow");
}

const kmlResponse = await fetch(`${siteUrl}/locations.kml`);
const kmlBody = await kmlResponse.text();
if (!kmlResponse.ok) {
  failures.push(`/locations.kml: expected 200, received ${kmlResponse.status}`);
} else if (!kmlResponse.headers.get("content-type")?.includes("application/vnd.google-earth.kml+xml")) {
  failures.push("/locations.kml: response is not KML");
} else if (!kmlBody.includes("542 Main St") || !kmlBody.includes("1541 3rd St")) {
  failures.push("/locations.kml: one or both approved clinic addresses are missing");
}

if (failures.length > 0) {
  console.error("Legacy redirect check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  `Legacy migration check passed: ${redirects.length} moved WordPress URLs, ${retiredSources.length} retired URLs, and 2 preserved public records.`,
);
