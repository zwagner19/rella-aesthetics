const baseUrl = new URL(process.env.SITE_URL ?? "http://localhost:3000");
const publicOrigin = new URL(process.env.PUBLIC_SITE_URL ?? "https://experiencerella.com");

function decodeHtml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#x27;", "'")
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replace(/&#(\d+);/g, (_match, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_match, code) => String.fromCodePoint(Number.parseInt(code, 16)));
}

function attribute(tag, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const quoted = new RegExp(`\\s${escaped}\\s*=\\s*(["'])(.*?)\\1`, "i").exec(tag);
  if (quoted) return decodeHtml(quoted[2]);
  return new RegExp(`\\s${escaped}\\s*=\\s*([^\\s>]+)`, "i").exec(tag)?.[1] ?? null;
}

function metaContent(html, key, value) {
  for (const match of html.matchAll(/<meta\b[^>]*>/gi)) {
    if (attribute(match[0], key)?.toLowerCase() === value.toLowerCase()) {
      return attribute(match[0], "content");
    }
  }
  return null;
}

function canonicalHref(html) {
  for (const match of html.matchAll(/<link\b[^>]*>/gi)) {
    const rel = attribute(match[0], "rel")?.toLowerCase().split(/\s+/) ?? [];
    if (rel.includes("canonical")) return attribute(match[0], "href");
  }
  return null;
}

async function read(url) {
  const response = await fetch(url, {
    headers: { "user-agent": "RellaSeoIntegrityCheck/1.0" },
    redirect: "follow",
    signal: AbortSignal.timeout(15_000),
  });
  return { response, text: await response.text() };
}

function localize(publicUrl) {
  const parsed = new URL(publicUrl, publicOrigin);
  return new URL(`${parsed.pathname}${parsed.search}`, baseUrl);
}

const failures = [];
const sitemapResult = await read(new URL("/sitemap-0.xml", baseUrl));
if (!sitemapResult.response.ok) {
  throw new Error(`Could not read sitemap-0.xml (${sitemapResult.response.status}) at ${baseUrl}`);
}

const sitemapUrls = [...sitemapResult.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  (match) => new URL(decodeHtml(match[1])),
);
if (sitemapUrls.length === 0) throw new Error("The sitemap contained no public page URLs.");

const seenTitles = new Map();
const seenCanonicals = new Map();
const imageReferences = new Map();
let structuredDataBlocks = 0;

for (const sitemapUrl of sitemapUrls) {
  const path = sitemapUrl.pathname;
  let result;
  try {
    result = await read(localize(sitemapUrl));
  } catch (error) {
    failures.push(`${path}: ${error instanceof Error ? error.name : "UnknownError"} while reading page`);
    continue;
  }

  if (!result.response.ok) {
    failures.push(`${path}: page returned ${result.response.status}`);
    continue;
  }

  const html = result.text;
  const title = decodeHtml(/<title>([\s\S]*?)<\/title>/i.exec(html)?.[1]?.trim() ?? "");
  const description = metaContent(html, "name", "description")?.trim() ?? "";
  const canonical = canonicalHref(html);
  const robots = metaContent(html, "name", "robots")?.toLowerCase() ?? "";
  const ogTitle = metaContent(html, "property", "og:title");
  const ogDescription = metaContent(html, "property", "og:description");
  const ogImage = metaContent(html, "property", "og:image");
  const twitterCard = metaContent(html, "name", "twitter:card");
  const h1Count = html.match(/<h1(?:\s|>)/gi)?.length ?? 0;

  if (title.length < 20 || title.length > 70) {
    failures.push(`${path}: title length ${title.length} is outside the 20–70 release range`);
  }
  if (description.length < 70 || description.length > 180) {
    failures.push(`${path}: description length ${description.length} is outside the 70–180 release range`);
  }
  if (h1Count !== 1) failures.push(`${path}: expected exactly one H1, found ${h1Count}`);
  if (robots.includes("noindex")) failures.push(`${path}: sitemap page is marked noindex`);
  if (!ogTitle) failures.push(`${path}: missing og:title`);
  if (!ogDescription) failures.push(`${path}: missing og:description`);
  if (!ogImage) failures.push(`${path}: missing og:image`);
  if (twitterCard !== "summary_large_image") {
    failures.push(`${path}: twitter:card must be summary_large_image`);
  }

  if (!canonical) {
    failures.push(`${path}: missing canonical URL`);
  } else {
    let parsedCanonical;
    try {
      parsedCanonical = new URL(canonical);
    } catch {
      failures.push(`${path}: invalid canonical URL ${canonical}`);
    }
    if (parsedCanonical) {
      if (parsedCanonical.protocol !== "https:" || parsedCanonical.host !== publicOrigin.host) {
        failures.push(`${path}: canonical leaves the approved HTTPS origin (${canonical})`);
      }
      if (parsedCanonical.pathname !== path || parsedCanonical.search || parsedCanonical.hash) {
        failures.push(`${path}: canonical does not exactly match sitemap path (${canonical})`);
      }
      const references = seenCanonicals.get(parsedCanonical.toString()) ?? [];
      references.push(path);
      seenCanonicals.set(parsedCanonical.toString(), references);
    }
  }

  if (title) {
    const references = seenTitles.get(title) ?? [];
    references.push(path);
    seenTitles.set(title, references);
  }
  if (ogImage) {
    const references = imageReferences.get(ogImage) ?? [];
    references.push(path);
    imageReferences.set(ogImage, references);
  }

  for (const match of html.matchAll(
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  )) {
    structuredDataBlocks += 1;
    try {
      JSON.parse(match[1]);
    } catch {
      failures.push(`${path}: malformed application/ld+json block`);
    }
  }
}

for (const [title, paths] of seenTitles) {
  if (paths.length > 1) failures.push(`Duplicate title "${title}" on ${paths.join(", ")}`);
}
for (const [canonical, paths] of seenCanonicals) {
  if (paths.length > 1) failures.push(`Duplicate canonical ${canonical} on ${paths.join(", ")}`);
}

for (const [imageUrl, paths] of imageReferences) {
  try {
    const parsed = new URL(imageUrl, publicOrigin);
    const target = parsed.host === publicOrigin.host ? localize(parsed) : parsed;
    const response = await fetch(target, {
      headers: { "user-agent": "RellaSeoIntegrityCheck/1.0" },
      redirect: "follow",
      signal: AbortSignal.timeout(15_000),
    });
    await response.body?.cancel();
    if (!response.ok) {
      failures.push(`Social image ${imageUrl} returned ${response.status} (used by ${paths.join(", ")})`);
    } else if (!response.headers.get("content-type")?.startsWith("image/")) {
      failures.push(`Social image ${imageUrl} is not an image response (used by ${paths.join(", ")})`);
    }
  } catch (error) {
    failures.push(
      `Social image ${imageUrl} failed: ${error instanceof Error ? error.name : "UnknownError"} (used by ${paths.join(", ")})`,
    );
  }
}

if (failures.length > 0) {
  console.error("SEO integrity check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(
    `SEO integrity check passed: ${sitemapUrls.length} pages, ${imageReferences.size} social images, ${structuredDataBlocks} structured-data blocks.`,
  );
}
