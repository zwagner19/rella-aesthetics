import assert from "node:assert/strict";
import { test } from "node:test";
import { handleRequest, SITE_ORIGIN_MARKER, WORDPRESS_LANDINGS } from "./controlled-launch-worker.mjs";

const ORIGIN = "rella-aesthetics-fixed123-zwagner19s-projects.vercel.app";
const env = { EDGE_ENABLED: "true", ORIGIN_HOST: ORIGIN };
function page(path = "/", headers = {}, body) {
  return new Response(body ?? `<html><head><link rel="canonical" href="https://experiencerella.com${path}" /></head><body>Approved page</body></html>`, {
    headers: { "Content-Type": "text/html; charset=utf-8", "X-Rella-Site-Origin": SITE_ORIGIN_MARKER,
      "X-Robots-Tag": "noindex", "Cache-Control": "public, max-age=0, must-revalidate", ...headers },
  });
}
function fixture(response = page()) {
  const calls = [];
  return { calls, fetcher: async request => { calls.push(request); if (response instanceof Error) throw response; return response; } };
}

test("disabled rollback performs one unchanged WordPress request, including POST/body/cookies", async () => {
  const input = new Request("https://experiencerella.com/api/leads", { method: "POST", body: "synthetic", headers: { Cookie: "proof=opaque" } });
  const io = fixture(new Response("WordPress"));
  assert.equal(await (await handleRequest(input, {}, io.fetcher)).text(), "WordPress");
  assert.equal(io.calls.length, 1); assert.equal(io.calls[0], input); assert.equal(await io.calls[0].text(), "synthetic");
});
for (const scheme of ["https", "http"]) for (const host of ["experiencerella.com", "www.experiencerella.com"])
  for (const path of ["/napa", "/napa/"]) for (const method of ["GET", "HEAD"]) {
    test(`retired Napa home ${scheme}://${host}${path} ${method} redirects once with original source query`, async () => {
      const query = "?utm_source=email&utm_medium=email&gclid=TEST-local-only&booking=open&x=a%2Bb&x=second";
      const io = fixture();
      const result = await handleRequest(new Request(`${scheme}://${host}${path}${query}`, { method }), env, io.fetcher);
      assert.equal(result.status, 308);
      assert.equal(result.headers.get("Location"), `https://experiencerella.com/locations/napa${query}`);
      assert.equal(result.headers.get("Cache-Control"), "no-store");
      assert.equal(await result.text(), "");
      assert.equal(io.calls.length, 0);
    });
  }
test("retired Napa homepage does not replay submitted bodies or match treatment paths", async () => {
  for (const path of ["/napa", "/napa/"]) {
    const io = fixture();
    const result = await handleRequest(new Request(`https://experiencerella.com${path}`, { method: "POST", body: "synthetic" }), env, io.fetcher);
    assert.equal(result.status, 405); assert.equal(result.headers.get("Location"), null); assert.equal(io.calls.length, 0);
  }
  const input = new Request("https://experiencerella.com/napa/botox/?utm_source=email");
  const io = fixture(new Response("WordPress"));
  assert.equal(await (await handleRequest(input, env, io.fetcher)).text(), "WordPress");
  assert.equal(io.calls[0], input);
});
for (const path of WORDPRESS_LANDINGS) for (const slash of ["", "/"]) {
  test(`preserves WordPress landing ${path}${slash} and its query without following or rewriting`, async () => {
    const input = new Request(`https://experiencerella.com${path}${slash}?gclid=TEST-readonly&utm_source=fixture`);
    const io = fixture(new Response("WordPress", { headers: { "Cache-Control": "private", "Set-Cookie": "wp=opaque; HttpOnly" } }));
    const result = await handleRequest(input, env, io.fetcher);
    assert.equal(io.calls[0], input); assert.equal(io.calls.length, 1); assert.equal(await result.text(), "WordPress");
    assert.equal(result.headers.get("Cache-Control"), "private"); assert.match(result.headers.get("Set-Cookie"), /HttpOnly/);
  });
}
for (const path of ["/wp-content/uploads/photo.webp", "/wp-includes/js/jquery.js", "/wp-json/contact-form/v1", "/wp-admin/admin-ajax.php", "/wp-login.php", "/xmlrpc.php", "/wp-cron.php", "/?rest_route=%2Fcontact", "/?p=42", "/index.php?page_id=42"]) {
  test(`keeps legacy WordPress namespace/query ${path}`, async () => {
    const input = new Request(`https://experiencerella.com${path}`, { method: "POST", body: "synthetic-body" });
    const io = fixture(new Response("WP")); await handleRequest(input, env, io.fetcher);
    assert.equal(io.calls[0], input); assert.equal(await io.calls[0].text(), "synthetic-body"); assert.equal(io.calls.length, 1);
  });
}
test("www redirects preserve same-site paid query while never redirecting/replaying a POST", async () => {
  const io = fixture();
  const result = await handleRequest(new Request("https://www.experiencerella.com/napa/laser/?gclid=TEST-keep"), env, io.fetcher);
  assert.equal(result.status, 308); assert.equal(result.headers.get("Location"), "https://experiencerella.com/napa/laser/?gclid=TEST-keep"); assert.equal(io.calls.length, 0);
  const post = await handleRequest(new Request("https://www.experiencerella.com/api/leads", { method: "POST", body: "{}" }), env, io.fetcher);
  assert.equal(post.status, 403); assert.equal(io.calls.length, 0);
});
test("verified exact public HTML becomes indexable and origin markers are not exposed", async () => {
  const io = fixture(page("/services/botox"));
  const result = await handleRequest(new Request("https://experiencerella.com/services/botox?gclid=TEST-private-query"), env, io.fetcher);
  assert.equal(result.status, 200); assert.equal(result.headers.get("X-Robots-Tag"), null); assert.equal(result.headers.get("X-Rella-Site-Origin"), null);
  assert.equal(result.headers.get("Cache-Control"), "public, max-age=0, must-revalidate");
  assert.equal(io.calls[0].url, `https://${ORIGIN}/services/botox?gclid=TEST-private-query`); assert.equal(io.calls[0].redirect, "manual");
});
test("homepage accepts an absolute HTTPS canonical without the equivalent trailing slash", async () => {
  const io = fixture(page("/", {}, '<link rel="canonical" href="https://experiencerella.com">'));
  const result = await handleRequest(new Request("https://experiencerella.com/"), env, io.fetcher);
  assert.equal(result.status, 200); assert.equal(result.headers.get("X-Robots-Tag"), null);
});
test("only the existing weight-loss service page permits its fixed external canonical", async () => {
  const html = '<link rel="canonical" href="https://weightloss.experiencerella.com">';
  const io = fixture(page("/services/weight-loss", {}, html));
  const result = await handleRequest(new Request("https://experiencerella.com/services/weight-loss?gclid=TEST-retain"), env, io.fetcher);
  assert.equal(result.status, 200); assert.equal(result.headers.get("X-Robots-Tag"), null); assert.equal(await result.text(), html);
  assert.equal(io.calls[0].url, `https://${ORIGIN}/services/weight-loss?gclid=TEST-retain`);
  const wrongPage = fixture(page("/services/botox", {}, html));
  assert.equal((await handleRequest(new Request("https://experiencerella.com/services/botox"), env, wrongPage.fetcher)).status, 502);
});
for (const canonical of ["https://foreign.test/services/botox", "http://experiencerella.com/services/botox", "/services/botox",
  "https://experiencerella.com/services/botox?source=unexpected", "https://experiencerella.com/services/botox#unexpected", "https://user:password@experiencerella.com/services/botox"]) {
  test(`rejects an unapproved or unsafe canonical ${canonical}`, async () => {
    const io = fixture(page("/services/botox", {}, `<link rel="canonical" href="${canonical}">`));
    assert.equal((await handleRequest(new Request("https://experiencerella.com/services/botox"), env, io.fetcher)).status, 502);
  });
}
for (const mismatch of ["missing marker", "wrong marker", "wrong canonical", "duplicate canonical", "missing canonical"]) {
  test(`fails closed on ${mismatch}, with no WordPress fallback`, async () => {
    const response = mismatch === "missing marker" ? page("/services/botox", { "X-Rella-Site-Origin": "" })
      : mismatch === "wrong marker" ? page("/services/botox", { "X-Rella-Site-Origin": "old-campaign-marker" })
        : mismatch === "wrong canonical" ? page("/another-page")
          : page("/services/botox", {}, mismatch === "missing canonical" ? "<html>Unknown</html>"
            : '<link rel="canonical" href="https://experiencerella.com/services/botox"><link rel="canonical" href="https://experiencerella.com/services/botox">');
    const io = fixture(response), result = await handleRequest(new Request("https://experiencerella.com/services/botox"), env, io.fetcher);
    assert.equal(result.status, 502); assert.match(result.headers.get("Cache-Control"), /no-store/); assert.match(result.headers.get("X-Robots-Tag"), /noindex/); assert.equal(io.calls.length, 1);
  });
}
test("HEAD verifies the GET canonical but returns no body", async () => {
  const io = fixture(page("/locations/napa"));
  const result = await handleRequest(new Request("https://experiencerella.com/locations/napa", { method: "HEAD" }), env, io.fetcher);
  assert.equal(io.calls[0].method, "GET"); assert.equal(result.headers.get("X-Robots-Tag"), null); assert.equal(await result.text(), "");
});
for (const method of ["GET", "HEAD"]) test(`public ${method} removes conditional validators before verifying canonical HTML`, async () => {
  const calls = [];
  const fetcher = async request => {
    calls.push(request);
    if (request.headers.has("if-none-match") || request.headers.has("if-modified-since")) {
      return new Response(null, { status: 304, headers: { "X-Robots-Tag": "noindex" } });
    }
    return page("/services/botox");
  };
  const result = await handleRequest(new Request("https://experiencerella.com/services/botox", { method,
    headers: { "If-None-Match": '"old-alias-page"', "If-Modified-Since": "Sun, 18 Oct 2026 12:00:00 GMT" } }), env, fetcher);
  assert.equal(calls.length, 1); assert.equal(calls[0].headers.get("if-none-match"), null); assert.equal(calls[0].headers.get("if-modified-since"), null);
  assert.equal(result.status, 200); assert.equal(result.headers.get("X-Robots-Tag"), null);
  assert.equal((await result.text()).length > 0, method === "GET");
});
test("asset conditional validators and its 304 transport policy remain unchanged", async () => {
  const io = fixture(new Response(null, { status: 304, headers: { "X-Robots-Tag": "noindex", "Cache-Control": "public, max-age=31536000, immutable" } }));
  const result = await handleRequest(new Request("https://experiencerella.com/_next/static/chunk.js", { headers: {
    "If-None-Match": '"asset-version"', "If-Modified-Since": "Sun, 18 Oct 2026 12:00:00 GMT",
  } }), env, io.fetcher);
  assert.equal(io.calls.length, 1); assert.equal(io.calls[0].headers.get("If-None-Match"), '"asset-version"');
  assert.equal(io.calls[0].headers.get("If-Modified-Since"), "Sun, 18 Oct 2026 12:00:00 GMT");
  assert.equal(result.status, 304); assert.equal(result.headers.get("X-Robots-Tag"), "noindex");
  assert.equal(result.headers.get("Cache-Control"), "public, max-age=31536000, immutable");
});
test("preserves explicit document noindex policies and only strips the alias's exact noindex header", async () => {
  const io = fixture(page("/contact", { "X-Robots-Tag": "noindex, nofollow" }, '<link rel="canonical" href="https://experiencerella.com/contact"><meta name="robots" content="noindex">'));
  const response = await handleRequest(new Request("https://experiencerella.com/contact"), env, io.fetcher);
  assert.equal(response.headers.get("X-Robots-Tag"), "noindex, nofollow"); assert.match(await response.text(), /content="noindex"/);
});
test("POST forwards the original body/cookies once and translates only proven same-origin browser Origin", async () => {
  const io = fixture(Response.json({ ok: true }, { headers: { "Cache-Control": "no-store", "Set-Cookie": "proof=opaque; HttpOnly; Secure; SameSite=Lax" } }));
  const request = new Request("https://experiencerella.com/api/booking-v2/bridge/checkout", { method: "POST", body: '{"fixture":true}', headers: {
    Origin: "https://experiencerella.com", Cookie: "rella_cart_auth=opaque", "Content-Type": "application/json", "X-Forwarded-Host": "attacker.test", "X-Vercel-Protection-Bypass": "browser-injected",
  } });
  const result = await handleRequest(request, env, io.fetcher), forwarded = io.calls[0];
  assert.equal(io.calls.length, 1); assert.equal(await forwarded.text(), '{"fixture":true}'); assert.equal(forwarded.headers.get("Cookie"), "rella_cart_auth=opaque");
  assert.equal(forwarded.headers.get("Origin"), `https://${ORIGIN}`); assert.equal(forwarded.headers.get("X-Forwarded-Host"), null); assert.equal(forwarded.headers.get("X-Vercel-Protection-Bypass"), null);
  assert.equal(result.headers.get("Cache-Control"), "no-store, private"); assert.equal(result.headers.get("X-Robots-Tag"), "noindex, nofollow"); assert.match(result.headers.get("Set-Cookie"), /HttpOnly; Secure/);
});
for (const origin of ["https://foreign.test", null]) test(`does not legitimize foreign/missing Origin ${origin}`, async () => {
  const io = fixture(Response.json({ ok: false }, { status: 403 }));
  const request = new Request("https://experiencerella.com/api/leads", { method: "POST", body: "{}", headers: origin ? { Origin: origin } : {} });
  await handleRequest(request, env, io.fetcher); assert.equal(io.calls[0].headers.get("Origin"), origin);
});
test("preserves separate HttpOnly cookies with Expires commas without combining or parsing them", async () => {
  const headers = new Headers({ "Content-Type": "application/json" });
  headers.append("Set-Cookie", "first=opaque; Expires=Wed, 21 Oct 2026 07:28:00 GMT; HttpOnly; Secure");
  headers.append("Set-Cookie", "second=opaque; Path=/; HttpOnly; Secure");
  const io = fixture(new Response("{}", { headers }));
  const result = await handleRequest(new Request("https://experiencerella.com/api/package-booking/status"), env, io.fetcher);
  assert.deepEqual(result.headers.getSetCookie(), headers.getSetCookie());
});
test("never routes an API body to WordPress because of a root-only legacy query key", async () => {
  const io = fixture(Response.json({ ok: true }));
  await handleRequest(new Request("https://experiencerella.com/api/leads?p=42", { method: "POST", body: "{}" }), env, io.fetcher);
  assert.equal(new URL(io.calls[0].url).hostname, ORIGIN);
});
test("API failure/timeout is not retried or replayed to WordPress", async () => {
  const io = fixture(new Error("Unknown downstream result"));
  const result = await handleRequest(new Request("https://experiencerella.com/api/package-booking/checkout", { method: "POST", body: "{}" }), env, io.fetcher);
  assert.equal(result.status, 502); assert.equal(io.calls.length, 1); assert.match(result.headers.get("Cache-Control"), /no-store/);
});
test("same-origin redirect replaces origin only; neither it nor external redirects acquire the incoming query", async () => {
  for (const [location, expected] of [[`https://${ORIGIN}/locations/napa`, "https://experiencerella.com/locations/napa"], ["https://book.experiencerella.com/book", "https://book.experiencerella.com/book"]]) {
    const io = fixture(new Response(null, { status: 308, headers: { Location: location, "X-Robots-Tag": "noindex" } }));
    const result = await handleRequest(new Request("https://experiencerella.com/old-route?gclid=TEST-never-append"), env, io.fetcher);
    assert.equal(result.headers.get("Location"), expected); assert.equal(result.headers.get("X-Robots-Tag"), "noindex");
  }
});
test("assets keep immutable cache policy and transport robots; API/private documents never lose noindex", async () => {
  const asset = fixture(new Response("asset", { headers: { "Content-Type": "text/javascript", "Cache-Control": "public, max-age=31536000, immutable", "X-Robots-Tag": "noindex" } }));
  const result = await handleRequest(new Request("https://experiencerella.com/_next/static/chunk.js"), env, asset.fetcher);
  assert.equal(result.headers.get("Cache-Control"), "public, max-age=31536000, immutable"); assert.equal(result.headers.get("X-Robots-Tag"), "noindex");
  const studio = fixture(page("/studio"));
  assert.equal((await handleRequest(new Request("https://experiencerella.com/studio"), env, studio.fetcher)).headers.get("X-Robots-Tag"), "noindex, nofollow");
});
test("unexpected HTML at an API or asset is blocked, not mistaken for a successful JSON/card response", async () => {
  for (const path of ["/api/package-booking/payment", "/_next/static/chunk.js"]) {
    const io = fixture(page(path));
    assert.equal((await handleRequest(new Request(`https://experiencerella.com${path}`), env, io.fetcher)).status, 502); assert.equal(io.calls.length, 1);
  }
});
test("invalid origin configuration/host and oversized HTML fail closed without unexpected requests", async () => {
  for (const host of ["attacker.test", "rella-aesthetics.vercel.app", "rella-aesthetics-git-main-zwagner19s-projects.vercel.app", `${ORIGIN}.attacker.test`]) {
    const io = fixture(); assert.equal((await handleRequest(new Request("https://experiencerella.com/"), { ...env, ORIGIN_HOST: host }, io.fetcher)).status, 503); assert.equal(io.calls.length, 0);
  }
  const io = fixture(); assert.equal((await handleRequest(new Request("https://foreign.test/"), env, io.fetcher)).status, 400); assert.equal(io.calls.length, 0);
  const large = fixture(page("/", { "Content-Length": String(3 * 1024 * 1024) }));
  assert.equal((await handleRequest(new Request("https://experiencerella.com/"), env, large.fetcher)).status, 502);
});
