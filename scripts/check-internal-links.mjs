const baseUrl = new URL(process.env.SITE_URL ?? "http://localhost:3000");

function localize(url) {
  const parsed = new URL(url, baseUrl);
  return new URL(`${parsed.pathname}${parsed.search}`, baseUrl).toString();
}

function indexedPageKey(url) {
  const parsed = new URL(url, baseUrl);
  const pathname =
    parsed.pathname === "/" ? "/" : parsed.pathname.replace(/\/+$/, "");
  return new URL(pathname, baseUrl).toString();
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
const indexedPages = new Set(sitemapUrls.map(indexedPageKey));
const indexedLinkGraph = new Map(
  [...indexedPages].map((pageUrl) => [pageUrl, new Set()]),
);
const indexedInlinks = new Map(
  [...indexedPages].map((pageUrl) => [pageUrl, new Set()]),
);

for (const pageUrl of sitemapUrls) {
  const { response, text } = await read(pageUrl);
  checkedPages.add(pageUrl);
  if (!response.ok) {
    failures.push(`${response.status} page: ${pageUrl}`);
    continue;
  }

  const sourcePage = indexedPageKey(pageUrl);
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

    const targetPage = indexedPageKey(target);
    if (indexedPages.has(targetPage) && targetPage !== sourcePage) {
      indexedLinkGraph.get(sourcePage)?.add(targetPage);
      indexedInlinks.get(targetPage)?.add(sourcePage);
    }
  }
}

const homePage = indexedPageKey(new URL("/", baseUrl));
if (!indexedPages.has(homePage)) {
  failures.push(`homepage missing from sitemap: ${homePage}`);
}

for (const pageUrl of [...indexedPages].sort()) {
  if (pageUrl === homePage) continue;
  if ((indexedInlinks.get(pageUrl)?.size ?? 0) === 0) {
    failures.push(`orphaned indexed page: ${pageUrl}`);
  }
}

const crawlDepth = new Map();
if (indexedPages.has(homePage)) {
  crawlDepth.set(homePage, 0);
  const queue = [homePage];

  for (let index = 0; index < queue.length; index += 1) {
    const sourcePage = queue[index];
    const nextDepth = (crawlDepth.get(sourcePage) ?? 0) + 1;
    for (const targetPage of indexedLinkGraph.get(sourcePage) ?? []) {
      if (crawlDepth.has(targetPage)) continue;
      crawlDepth.set(targetPage, nextDepth);
      queue.push(targetPage);
    }
  }
}

for (const pageUrl of [...indexedPages].sort()) {
  if (!crawlDepth.has(pageUrl)) {
    failures.push(`indexed page is unreachable from homepage links: ${pageUrl}`);
  }
}

const MAX_INDEXED_CRAWL_DEPTH = 3;
const overlyDeepPages = [...crawlDepth.entries()]
  .filter(([, depth]) => depth > MAX_INDEXED_CRAWL_DEPTH)
  .sort((a, b) => a[1] - b[1] || a[0].localeCompare(b[0]));
for (const [pageUrl, depth] of overlyDeepPages) {
  failures.push(
    `indexed page exceeds homepage crawl depth ${MAX_INDEXED_CRAWL_DEPTH} (depth ${depth}): ${pageUrl}`,
  );
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
  const maximumCrawlDepth = Math.max(...crawlDepth.values());
  console.log(
    `Internal link check passed: ${checkedPages.size} sitemap pages, ${discoveredLinks.size} unique internal destinations, no orphaned indexed pages, and maximum homepage crawl depth ${maximumCrawlDepth}.`,
  );
}
