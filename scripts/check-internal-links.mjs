const baseUrl = new URL(process.env.SITE_URL ?? "http://localhost:3000");

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

async function read(url) {
  const response = await fetch(url, {
    headers: { "user-agent": "RellaReleaseLinkCheck/1.0" },
    redirect: "manual",
  });
  return { response, text: await response.text() };
}

const sitemapResult = await read(new URL("/sitemap-0.xml", baseUrl));
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

const failures = [];
const checkedPages = new Set();
const discoveredLinks = new Set();

for (const pageUrl of sitemapUrls) {
  const { response, text } = await read(pageUrl);
  checkedPages.add(pageUrl);
  if (!response.ok) {
    failures.push(`${response.status} page: ${pageUrl}`);
    continue;
  }

  for (const match of text.matchAll(/href=["']([^"']+)["']/g)) {
    const href = decodeHref(match[1]);
    if (
      !href ||
      href.startsWith("#") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      href.startsWith("javascript:")
    ) {
      continue;
    }

    const target = new URL(href, pageUrl);
    if (target.origin !== baseUrl.origin) continue;
    target.hash = "";
    discoveredLinks.add(target.toString());
  }
}

for (const target of [...discoveredLinks].sort()) {
  const response = await fetch(target, {
    headers: { "user-agent": "RellaReleaseLinkCheck/1.0" },
    redirect: "manual",
  });
  if (response.status < 200 || response.status >= 400) {
    failures.push(`${response.status} link: ${target}`);
  }
}

if (failures.length > 0) {
  console.error("Internal link check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(
    `Internal link check passed: ${checkedPages.size} sitemap pages and ${discoveredLinks.size} unique internal destinations.`,
  );
}
