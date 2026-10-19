/** Prepared only: no routes, version, DNS or environment are changed by this file.
 * Same-zone WordPress passthrough requires global_fetch_private_origin.
 * Deploy a separately reviewed module Worker; do not promote the old Napa-only artifact.
 */
export const SITE_ORIGIN_MARKER = "next-controlled-launch-v1";
export const PUBLIC_ORIGIN = "https://experiencerella.com";
export const WORDPRESS_LANDINGS = Object.freeze([
  "/napa", "/napa/botox", "/napa/laser", "/napa/filler", "/napa/hydrafacial", "/napa/hyperhidrosis",
]);
const PUBLIC_HOSTS = new Set(["experiencerella.com", "www.experiencerella.com"]);
const WP_PREFIXES = ["/wp-content", "/wp-includes", "/wp-json", "/wp-admin"];
const WP_FILES = new Set(["/wp-login.php", "/xmlrpc.php", "/wp-cron.php", "/wp-comments-post.php", "/wp-trackback.php"]);
const WP_QUERIES = ["rest_route", "p", "page_id", "preview", "preview_id", "preview_nonce", "elementor-preview", "wc-ajax", "s"];
const PRIVATE_PREFIXES = ["/api", "/studio", "/booking", "/book", "/secure-card", "/_next"];
const ASSET_EXTENSIONS = /\.(?:css|js|mjs|json|map|xml|txt|ico|svg|png|jpe?g|webp|avif|gif|woff2?|ttf|otf|mp4|webm|pdf)$/i;
const ORIGIN_HOST = /^rella-aesthetics-[a-z0-9]+-zwagner19s-projects\.vercel\.app$/;
const TIMEOUT_MS = 30_000;
const MAX_HTML_BYTES = 2 * 1024 * 1024;
const CANONICAL_EXCEPTIONS = Object.freeze({
  "/services/weight-loss": "https://weightloss.experiencerella.com/",
});

function under(path, prefix) { return path === prefix || path.startsWith(`${prefix}/`); }
export function wordpressRequest(url) {
  const path = url.pathname.replace(/\/$/, "");
  return WORDPRESS_LANDINGS.includes(path) || WP_FILES.has(path)
    || WP_PREFIXES.some(prefix => under(path, prefix))
    || ((url.pathname === "/" || url.pathname === "/index.php") && WP_QUERIES.some(key => url.searchParams.has(key)));
}
export function privatePath(path) { return PRIVATE_PREFIXES.some(prefix => under(path, prefix)); }
function publicDocument(path) { return !privatePath(path) && !ASSET_EXTENSIONS.test(path); }
function failure(status = 502) {
  return new Response("The requested page could not be verified. Please try again later.", { status,
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store, private", "X-Robots-Tag": "noindex, nofollow" } });
}
function copyHeaders(source) {
  const headers = new Headers(source);
  // Preserve multiple cookies, including Expires commas; never comma-split them.
  const cookies = source.getSetCookie?.();
  if (cookies) { headers.delete("set-cookie"); for (const cookie of cookies) headers.append("set-cookie", cookie); }
  return headers;
}
function canonicalFromHtml(html) {
  const links = html.match(/<link\b[^>]*>/gi) ?? [];
  const values = [];
  for (const link of links) {
    const attrs = Object.fromEntries([...link.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)]
      .map(match => [match[1].toLowerCase(), match[2] ?? match[3]]));
    if (attrs.rel?.toLowerCase().split(/\s+/).includes("canonical")) values.push(attrs.href);
  }
  return values.length === 1 ? values[0] : null;
}
function normalizedCanonical(value) {
  if (typeof value !== "string" || !value.startsWith("https://")) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash) return null;
    return url.href;
  } catch { return null; }
}
function privateHeaders(headers) {
  headers.set("Cache-Control", "no-store, private");
  headers.set("X-Robots-Tag", "noindex, nofollow");
  headers.delete("CDN-Cache-Control"); headers.delete("Cloudflare-CDN-Cache-Control"); headers.delete("Vercel-CDN-Cache-Control");
}

export async function handleRequest(request, env = {}, fetcher = fetch) {
  if (env.EDGE_ENABLED !== "true") return fetcher(request); // Rollback to the existing zone origin, without replay.
  const publicUrl = new URL(request.url);
  if (!PUBLIC_HOSTS.has(publicUrl.hostname) || publicUrl.port
    || /%(?:2f|5c|00|2e)/i.test(publicUrl.pathname) || publicUrl.pathname.includes("\\")) return failure(400);
  const read = request.method === "GET" || request.method === "HEAD";
  if (publicUrl.protocol !== "https:") {
    if (!read) return failure(400);
    const secure = new URL(publicUrl); secure.protocol = "https:";
    return new Response(null, { status: 308, headers: { Location: secure.href, "Cache-Control": "no-store" } });
  }
  // Preserve same-host query strings on www, before WordPress's historical redirect can drop them.
  // Never redirect a POST/body to another host.
  if (publicUrl.hostname === "www.experiencerella.com" && read) {
    const canonical = new URL(publicUrl); canonical.hostname = "experiencerella.com";
    return new Response(null, { status: 308, headers: { Location: canonical.href, "Cache-Control": "no-store" } });
  }
  if (wordpressRequest(publicUrl)) return fetcher(request);
  if (publicUrl.hostname !== "experiencerella.com") return failure(403);
  if (!read && !under(publicUrl.pathname, "/api")) return failure(405);
  if (typeof env.ORIGIN_HOST !== "string" || !ORIGIN_HOST.test(env.ORIGIN_HOST)) return failure(503);

  const upstreamUrl = new URL(publicUrl); upstreamUrl.hostname = env.ORIGIN_HOST;
  const headers = new Headers(request.headers);
  for (const key of ["host", "forwarded", "x-forwarded-host", "x-forwarded-proto", "x-vercel-forwarded-for",
    "x-vercel-protection-bypass", "x-vercel-set-bypass-cookie"]) headers.delete(key);
  // Public HTML needs a complete response for this page's marker/canonical proof.
  // A conditional 304 can otherwise retain the alias's noindex without a body to verify.
  if (read && publicDocument(publicUrl.pathname)) {
    headers.delete("if-none-match"); headers.delete("if-modified-since");
  }
  // Validate the original browser Origin by exact comparison before translating
  // it to the pinned application host used by Next's same-origin API guards.
  if (headers.get("origin") === publicUrl.origin) headers.set("origin", upstreamUrl.origin);
  if (typeof env.VERCEL_AUTOMATION_BYPASS_SECRET === "string" && env.VERCEL_AUTOMATION_BYPASS_SECRET) {
    headers.set("x-vercel-protection-bypass", env.VERCEL_AUTOMATION_BYPASS_SECRET);
  }
  const isPrivate = privatePath(publicUrl.pathname);
  // HEAD must verify the same public HTML canonical as GET before changing SEO headers.
  const upstreamMethod = request.method === "HEAD" && publicDocument(publicUrl.pathname) ? "GET" : request.method;
  let upstream;
  try {
    const upstreamRequest = new Request(upstreamUrl, { method: upstreamMethod, headers,
      ...(read ? {} : { body: request.body, duplex: "half" }), redirect: "manual", cache: "no-store", signal: AbortSignal.timeout(TIMEOUT_MS) });
    upstream = await fetcher(upstreamRequest);
  } catch { return failure(); } // No fallback to WordPress and no mutation retry.

  const resultHeaders = copyHeaders(upstream.headers);
  resultHeaders.delete("x-rella-site-origin"); resultHeaders.delete("x-rella-origin");
  const location = resultHeaders.get("location");
  if (location) {
    try {
      const redirected = new URL(location, upstreamUrl);
      if (!["https:", "http:"].includes(redirected.protocol) || redirected.username || redirected.password) return failure();
      if (redirected.origin === upstreamUrl.origin) {
        redirected.protocol = "https:"; redirected.hostname = "experiencerella.com";
        resultHeaders.set("location", redirected.href); // Only replace origin; do not append incoming query.
      }
    } catch { return failure(); }
  }
  if ((isPrivate && !under(publicUrl.pathname, "/_next")) || !read || resultHeaders.has("set-cookie")) privateHeaders(resultHeaders);
  const html = (upstream.headers.get("content-type") ?? "").toLowerCase().startsWith("text/html");
  if (upstream.status === 200 && html && publicDocument(publicUrl.pathname)) {
    if (upstream.headers.get("x-rella-site-origin") !== SITE_ORIGIN_MARKER
      || Number(upstream.headers.get("content-length") ?? "0") > MAX_HTML_BYTES) return failure();
    let body;
    try { body = await upstream.text(); } catch { return failure(); }
    const expectedCanonical = CANONICAL_EXCEPTIONS[publicUrl.pathname] ?? `${PUBLIC_ORIGIN}${publicUrl.pathname}`;
    if (new TextEncoder().encode(body).byteLength > MAX_HTML_BYTES
      || normalizedCanonical(canonicalFromHtml(body)) !== normalizedCanonical(expectedCanonical)) return failure();
    // Remove only the Vercel transport noindex after proving this exact public page.
    // Any meta robots policy in the document remains unchanged.
    if (!isPrivate && !resultHeaders.has("set-cookie") && resultHeaders.get("x-robots-tag")?.trim().toLowerCase() === "noindex") resultHeaders.delete("x-robots-tag");
    resultHeaders.delete("content-length"); resultHeaders.delete("content-encoding");
    return new Response(request.method === "HEAD" ? null : body, { status: upstream.status, statusText: upstream.statusText, headers: resultHeaders });
  }
  if (upstream.status === 200 && html && (under(publicUrl.pathname, "/api") || ASSET_EXTENSIONS.test(publicUrl.pathname))) return failure();
  return new Response(request.method === "HEAD" ? null : upstream.body, { status: upstream.status, statusText: upstream.statusText, headers: resultHeaders });
}

const worker = { fetch: (request, env) => handleRequest(request, env) };
export default worker;
