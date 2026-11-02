import { runInNewContext } from "node:vm";
import { describe, expect, it } from "vitest";
import { GET } from "../app/api/public-analytics/frame/route";
import { OPTIONS, POST } from "../app/api/public-analytics/clear/route";
import {
  PUBLIC_ANALYTICS_CLEAR_PATH,
  PUBLIC_ANALYTICS_FRAME_PATH,
  PUBLIC_ANALYTICS_MAX_NAVIGATIONS,
  PUBLIC_ANALYTICS_MAX_PENDING,
  PUBLIC_ANALYTICS_MEASUREMENT_ID,
  PUBLIC_ANALYTICS_MESSAGE_TYPE,
  PUBLIC_ANALYTICS_ORIGIN,
  PUBLIC_ANALYTICS_PARENT_ORIGINS,
  renderPublicAnalyticsFrame,
  type PublicAnalyticsPageViewMessage,
} from "./public-analytics-frame";

const NONCE = "abcdefghijklmnopqrstuvwx";
const PARENT_ORIGIN = PUBLIC_ANALYTICS_PARENT_ORIGINS[0];

function message(index = 1, overrides: Partial<PublicAnalyticsPageViewMessage> = {}): PublicAnalyticsPageViewMessage {
  return {
    type: PUBLIC_ANALYTICS_MESSAGE_TYPE,
    action: "page_view",
    navigationId: index.toString(16).padStart(32, "0"),
    pageGroup: "napa",
    source: "google",
    medium: "cpc",
    ...overrides,
  };
}

type FakeScript = {
  async?: boolean;
  src?: string;
  referrerPolicy?: string;
  onload?: () => void;
  onerror?: () => void;
  remove: () => void;
};

function frame(options: { origin?: string; topLevel?: boolean } = {}) {
  const handlers = new Map<string, (event: { data: unknown; source: unknown; origin: string }) => void>();
  const ready: Array<{ data: unknown; origin: string }> = [];
  const scripts: FakeScript[] = [];
  const writes: string[] = [];
  let removedScripts = 0;
  let commandsBeforeGoogle: unknown[][] = [];
  const parent = { postMessage: (data: unknown, origin: string) => ready.push({ data, origin }) };
  const window: Record<string, unknown> = {
    location: { origin: options.origin ?? PUBLIC_ANALYTICS_ORIGIN },
    parent,
    addEventListener: (name: string, handler: typeof handlers extends Map<string, infer V> ? V : never) => handlers.set(name, handler),
    removeEventListener: (name: string) => handlers.delete(name),
  };
  if (options.topLevel) window.parent = window;
  const document = {
    head: { appendChild: (script: FakeScript) => {
      commandsBeforeGoogle = commands();
      scripts.push(script);
    } },
    createElement: (tag: string): FakeScript => {
      expect(tag).toBe("script");
      return { remove: () => { removedScripts += 1; } };
    },
    set cookie(value: string) { writes.push(value); },
  };
  function commands(): unknown[][] {
    return ((window.dataLayer ?? []) as ArrayLike<unknown>[]).map(row => Array.from(row));
  }
  const source = renderPublicAnalyticsFrame(NONCE).match(/<script nonce="[^"]+">([\s\S]*)<\/script>/)?.[1];
  if (!source) throw new Error("Frame script missing");
  runInNewContext(source, { window, document });
  return {
    window, scripts, writes, ready, commands,
    beforeGoogle: () => commandsBeforeGoogle,
    removedScripts: () => removedScripts,
    receive: (data: unknown, origin: string = PARENT_ORIGIN, source: unknown = parent) => {
      handlers.get("message")?.({ data, origin, source });
    },
  };
}

describe("isolated public analytics document", () => {
  it("announces readiness only to the exact public parents without loading Google", () => {
    const runtime = frame();
    expect(runtime.ready).toEqual(PUBLIC_ANALYTICS_PARENT_ORIGINS.map(origin => ({
      data: { type: PUBLIC_ANALYTICS_MESSAGE_TYPE, action: "ready" }, origin,
    })));
    expect(runtime.scripts).toEqual([]);
    expect(runtime.commands()).toEqual([]);
    expect(runtime.writes).toEqual([]);
  });

  it.each([
    { topLevel: true },
    { origin: "https://experiencerella.com" },
    { origin: "https://preview.vercel.app" },
    { origin: "http://analytics.experiencerella.com" },
  ])("stays inert in an unsupported document: %j", options => {
    const runtime = frame(options);
    runtime.receive(message());
    expect(runtime.ready).toEqual([]);
    expect(runtime.scripts).toEqual([]);
  });

  it.each([
    ["https://example.com", undefined],
    ["http://experiencerella.com", undefined],
    ["https://book.experiencerella.com", undefined],
    ["https://experiencerella.com:444", undefined],
    ["null", undefined],
    [PARENT_ORIGIN, {}],
  ])("rejects messages from a different origin or window: %s", (origin, source) => {
    const runtime = frame();
    if (source === undefined) runtime.receive(message(), origin);
    else runtime.receive(message(), origin, source);
    expect(runtime.scripts).toHaveLength(0);
  });

  it.each([
    null, [], {},
    { ...message(), page_location: "https://experiencerella.com/private?patient=test" },
    { ...message(), source: "google?gclid=anything" },
    { ...message(), medium: "medical-service" },
    { ...message(), pageGroup: "private" },
    { ...message(), pageGroup: "__proto__" },
    { ...message(), pageGroup: {} },
    { ...message(), navigationId: "patient-name-or-email@example.com" },
    { ...message(), navigationId: "0".repeat(1000) },
    { ...message(), type: "another-namespace" },
    { ...message(), action: "purchase" },
  ])("rejects malformed, arbitrary or extra event fields", value => {
    const runtime = frame();
    runtime.receive(value);
    expect(runtime.scripts).toHaveLength(0);
    expect(runtime.commands()).toHaveLength(0);
  });

  it("configures only bounded metadata and analytics consent before loading Google", () => {
    const runtime = frame();
    runtime.receive(message());
    expect(runtime.scripts).toHaveLength(1);
    expect(runtime.scripts[0].src).toBe(`https://www.googletagmanager.com/gtag/js?id=${PUBLIC_ANALYTICS_MEASUREMENT_ID}`);
    expect(runtime.scripts[0].referrerPolicy).toBe("no-referrer");
    const commands = runtime.beforeGoogle();
    expect(commands[0]).toEqual(["consent", "default", {
      analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied",
    }]);
    expect(commands[1]).toEqual(["set", {
      allow_google_signals: false, allow_ad_personalization_signals: false,
      ads_data_redaction: true, url_passthrough: false,
      page_location: "https://experiencerella.com/locations/napa",
      page_referrer: "", page_title: "Rella Aesthetics Napa", campaign_source: "google", campaign_medium: "cpc",
    }]);
    expect(commands[3]).toEqual(["consent", "update", {
      analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied",
    }]);
    expect(commands[4]).toEqual(["config", PUBLIC_ANALYTICS_MEASUREMENT_ID, {
      send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false,
      cookie_domain: "none", cookie_flags: "SameSite=Lax;Secure", cookie_expires: 2592000, cookie_update: false,
    }]);
    expect(commands.filter(row => row[0] === "event")).toHaveLength(0);
    runtime.scripts[0].onload?.();
    expect(runtime.commands().filter(row => row[0] === "event")).toEqual([["event", "page_view", {
      send_to: PUBLIC_ANALYTICS_MEASUREMENT_ID,
      page_location: "https://experiencerella.com/locations/napa", page_title: "Rella Aesthetics Napa",
      page_referrer: "", campaign_source: "google", campaign_medium: "cpc",
    }]]);
  });

  it("accepts a standard random UUID and updates global metadata before every manual pageview", () => {
    const runtime = frame();
    runtime.receive(message(1, { navigationId: "249fc9e6-3751-4a54-a752-21e3c809174c" }));
    runtime.scripts[0].onload?.();
    runtime.receive(message(2, { pageGroup: "contact", source: "other", medium: "referral" }));
    expect(runtime.commands().slice(-2)).toEqual([
      ["set", { page_location: "https://experiencerella.com/contact", page_title: "Contact Rella Aesthetics", page_referrer: "", campaign_source: "other", campaign_medium: "referral" }],
      ["event", "page_view", { send_to: PUBLIC_ANALYTICS_MEASUREMENT_ID, page_location: "https://experiencerella.com/contact", page_title: "Contact Rella Aesthetics", page_referrer: "", campaign_source: "other", campaign_medium: "referral" }],
    ]);
  });

  it("does not force campaign attribution for a direct or unknown revisit", () => {
    const runtime = frame();
    runtime.receive(message(1, { source: "direct_or_unknown", medium: "none" }));
    runtime.scripts[0].onload?.();
    const metadata = runtime.commands().filter(row => row[0] === "set" || row[0] === "config" || row[0] === "event");
    for (const row of metadata) {
      const fields = row.at(-1) as Record<string, unknown>;
      expect(fields).not.toHaveProperty("campaign_source");
      expect(fields).not.toHaveProperty("campaign_medium");
    }
  });

  it("coalesces replayed navigations before and after load", () => {
    const runtime = frame();
    runtime.receive(message());
    runtime.receive(message());
    runtime.scripts[0].onload?.();
    runtime.receive(message());
    expect(runtime.scripts).toHaveLength(1);
    expect(runtime.commands().filter(row => row[0] === "event")).toHaveLength(1);
  });

  it("bounds both the pending queue and lifetime navigation set without evicting replay protection", () => {
    const runtime = frame();
    for (let index = 1; index <= PUBLIC_ANALYTICS_MAX_PENDING + 3; index++) runtime.receive(message(index));
    runtime.scripts[0].onload?.();
    expect(runtime.commands().filter(row => row[0] === "event")).toHaveLength(PUBLIC_ANALYTICS_MAX_PENDING);
    for (let index = PUBLIC_ANALYTICS_MAX_PENDING + 1; index <= PUBLIC_ANALYTICS_MAX_NAVIGATIONS + 3; index++) runtime.receive(message(index));
    runtime.receive(message(1));
    expect(runtime.commands().filter(row => row[0] === "event")).toHaveLength(PUBLIC_ANALYTICS_MAX_NAVIGATIONS);
  });

  it.each([false, true])("revokes before or after script load and ignores all later events (loaded=%s)", loaded => {
    const runtime = frame();
    runtime.receive(message());
    if (loaded) runtime.scripts[0].onload?.();
    const before = runtime.commands().filter(row => row[0] === "event").length;
    runtime.receive({ type: PUBLIC_ANALYTICS_MESSAGE_TYPE, action: "dispose" });
    runtime.scripts[0].onload?.();
    runtime.receive(message(2));
    expect(runtime.window[`ga-disable-${PUBLIC_ANALYTICS_MEASUREMENT_ID}`]).toBe(true);
    expect(runtime.commands().filter(row => row[0] === "event")).toHaveLength(before);
    expect(runtime.removedScripts()).toBe(1);
    expect(runtime.writes).toEqual([
      "_ga=; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/; Secure; SameSite=Lax",
      "_ga_WKDS1158Y1=; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/; Secure; SameSite=Lax",
    ]);
    expect(runtime.commands().at(-1)).toEqual(["consent", "update", {
      analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied",
    }]);
  });

  it("does not allow a forged dispose to clear an active consented document", () => {
    const runtime = frame();
    runtime.receive(message());
    runtime.scripts[0].onload?.();
    runtime.receive({ type: PUBLIC_ANALYTICS_MESSAGE_TYPE, action: "dispose" }, "https://untrusted.example");
    runtime.receive({ type: PUBLIC_ANALYTICS_MESSAGE_TYPE, action: "dispose", source: "extra" });
    runtime.receive(message(2));
    expect(runtime.writes).toHaveLength(0);
    expect(runtime.commands().filter(row => row[0] === "event")).toHaveLength(2);
  });
});

function request(path: string, init: RequestInit = {}, origin = PUBLIC_ANALYTICS_ORIGIN): Request {
  return new Request(origin + path, init);
}

describe("public analytics routes", () => {
  it("serves an uncacheable, nonindexable frame with a fresh nonce and exact ancestor policy", async () => {
    const first = GET(request(PUBLIC_ANALYTICS_FRAME_PATH));
    const second = GET(request(PUBLIC_ANALYTICS_FRAME_PATH));
    const html = await first.text();
    expect(first.status).toBe(200);
    const nonce = html.match(/<script nonce="([^"]+)"/)?.[1];
    expect(nonce).toBeTruthy();
    expect(first.headers.get("content-security-policy")).toContain(`script-src 'nonce-${nonce}' https://www.googletagmanager.com`);
    expect(first.headers.get("content-security-policy")).toContain(`frame-ancestors ${PUBLIC_ANALYTICS_PARENT_ORIGINS.join(" ")}`);
    expect(first.headers.get("content-security-policy")).toContain("form-action 'none'");
    expect(first.headers.get("content-security-policy")).not.toMatch(/unsafe-inline|unsafe-eval|\*|doubleclick|googleadservices/);
    expect(first.headers.get("referrer-policy")).toBe("no-referrer");
    expect(first.headers.get("cache-control")).toContain("no-store");
    expect(first.headers.get("x-robots-tag")).toContain("noindex");
    expect(await second.text()).not.toBe(html);
  });

  it.each([
    "https://experiencerella.com", "https://www.experiencerella.com", "https://preview.vercel.app",
    "http://analytics.experiencerella.com", "https://analytics.experiencerella.com:444",
  ])("does not expose either route on another origin: %s", async origin => {
    expect(GET(request(PUBLIC_ANALYTICS_FRAME_PATH, {}, origin)).status).toBe(404);
    expect((await POST(request(PUBLIC_ANALYTICS_CLEAR_PATH, { method: "POST" }, origin))).status).toBe(404);
    expect(OPTIONS(request(PUBLIC_ANALYTICS_CLEAR_PATH, { method: "OPTIONS" }, origin)).status).toBe(404);
  });

  it("rejects a mismatched Host header and URL parameters", () => {
    expect(GET(request(PUBLIC_ANALYTICS_FRAME_PATH, { headers: { host: "experiencerella.com" } })).status).toBe(404);
    expect(GET(request(PUBLIC_ANALYTICS_FRAME_PATH + "?client_id=untrusted")).status).toBe(404);
  });

  it.each(PUBLIC_ANALYTICS_PARENT_ORIGINS)("clears only the two owned host-only cookies for %s", async origin => {
    const response = await POST(request(PUBLIC_ANALYTICS_CLEAR_PATH, {
      method: "POST", headers: { origin, "content-type": "application/json" }, body: "{}",
    }));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(response.headers.get("access-control-allow-origin")).toBe(origin);
    expect(response.headers.get("access-control-allow-credentials")).toBe("true");
    expect(response.headers.getSetCookie()).toEqual([
      "_ga=; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/; Secure; SameSite=Lax",
      "_ga_WKDS1158Y1=; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/; Secure; SameSite=Lax",
    ]);
    expect(response.headers.get("set-cookie")).not.toMatch(/Domain=|rella_|sb-|HttpOnly/i);
  });

  it.each([null, "https://book.experiencerella.com", "https://untrusted.example", "null"])("rejects clear from an unapproved origin: %s", async origin => {
    const response = await POST(request(PUBLIC_ANALYTICS_CLEAR_PATH, {
      method: "POST", headers: { ...(origin ? { origin } : {}), "content-type": "application/json" }, body: "{}",
    }));
    expect(response.status).toBe(403);
    expect(response.headers.get("access-control-allow-origin")).toBeNull();
    expect(response.headers.getSetCookie()).toEqual([]);
  });

  it.each([
    ["text/plain", "{}", 415],
    ["application/json", "[]", 400],
    ["application/json", '{"patient":"unwanted"}', 400],
    ["application/json", "invalid", 400],
    ["application/json", " ".repeat(65) + "{}", 400],
  ] as const)("rejects nonempty or malformed clear bodies", async (contentType, body, status) => {
    const response = await POST(request(PUBLIC_ANALYTICS_CLEAR_PATH, {
      method: "POST", headers: { origin: PARENT_ORIGIN, "content-type": contentType }, body,
    }));
    expect(response.status).toBe(status);
    expect(response.headers.getSetCookie()).toEqual([]);
  });

  it("grants a credentialed JSON-only preflight with no cookie mutation", () => {
    const response = OPTIONS(request(PUBLIC_ANALYTICS_CLEAR_PATH, {
      method: "OPTIONS", headers: { origin: PARENT_ORIGIN, "access-control-request-method": "POST", "access-control-request-headers": "content-type" },
    }));
    expect(response.status).toBe(204);
    expect(response.headers.get("access-control-allow-origin")).toBe(PARENT_ORIGIN);
    expect(response.headers.get("access-control-allow-headers")).toBe("Content-Type");
    expect(response.headers.getSetCookie()).toEqual([]);
    expect(OPTIONS(request(PUBLIC_ANALYTICS_CLEAR_PATH, {
      method: "OPTIONS", headers: { origin: PARENT_ORIGIN, "access-control-request-method": "DELETE" },
    })).status).toBe(403);
    expect(OPTIONS(request(PUBLIC_ANALYTICS_CLEAR_PATH, {
      method: "OPTIONS", headers: { origin: PARENT_ORIGIN, "access-control-request-method": "POST", "access-control-request-headers": "authorization" },
    })).status).toBe(403);
  });
});
