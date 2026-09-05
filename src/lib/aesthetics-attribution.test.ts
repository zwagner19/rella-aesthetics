import { describe, expect, it } from "vitest";
import {
  AD_ATTRIBUTION_REVOCATION_COOKIE,
  AD_USER_DATA_DENIED_COOKIE,
  AESTHETICS_ATTRIBUTION_ENDPOINT,
  AESTHETICS_CONSENT_COOKIE,
  AestheticsAttributionController,
  cleanAestheticsBookingHref,
  hasEligibleAestheticsPaidClick,
  isApprovedAestheticsPilotPage,
  stripAestheticsAttribution,
  type AestheticsAttributionRuntime,
  type AestheticsConsentMessage,
  type AestheticsConsentView,
  type AttributionFetchResponse,
} from "./aesthetics-attribution";

const NOW = 1_800_000_000_000;
const GRANT_RESPONSE = {
  ok: true,
  attributionId: "attr_opaque_server_value",
  consentAdUserData: "granted",
  clickIdentifiersStored: true,
};
const DENY_RESPONSE = {
  ok: true,
  consentAdUserData: "denied",
  clickIdentifiersStored: false,
  revocationFinalized: true,
  revoked: true,
};

type DeferredResponse = {
  promise: Promise<Record<string, unknown>>;
  resolve(value: Record<string, unknown>): void;
};

function deferredResponse(): DeferredResponse {
  let resolve = (value: Record<string, unknown>) => {
    void value;
  };
  const promise = new Promise<Record<string, unknown>>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

class FakeRuntime implements AestheticsAttributionRuntime {
  href = "https://experiencerella.com/napa/botox/";
  host = "experiencerella.com";
  cookies = new Map<string, string>();
  cookieWrites: string[] = [];
  requests: Array<{ input: string; init: RequestInit; body: Record<string, unknown> }> = [];
  responses: Array<Record<string, unknown> | Promise<Record<string, unknown>>> = [];
  replacements: string[] = [];
  navigations: string[] = [];
  publications: AestheticsConsentMessage[] = [];
  timers = new Map<number, () => void>();
  rejectedCookies = new Set<string>();
  httpFailures = 0;
  randomSeed = 1;
  private nextTimer = 1;

  currentHref = () => this.href;
  hostname = () => this.host;
  cookieHeader = () =>
    [...this.cookies].map(([name, value]) => `${name}=${value}`).join("; ");
  writeCookie = (serialized: string) => {
    this.cookieWrites.push(serialized);
    const pair = serialized.split(";", 1)[0];
    const equals = pair.indexOf("=");
    const name = pair.slice(0, equals);
    const value = pair.slice(equals + 1);
    if (this.rejectedCookies.has(name)) return;
    if (/Max-Age=0/i.test(serialized)) this.cookies.delete(name);
    else this.cookies.set(name, value);
  };
  replaceHref = (href: string) => {
    this.href = href;
    this.replacements.push(href);
  };
  navigate = (href: string) => {
    this.navigations.push(href);
  };
  fetch = async (
    input: string,
    init: RequestInit,
  ): Promise<AttributionFetchResponse> => {
    const body = JSON.parse(String(init.body)) as Record<string, unknown>;
    this.requests.push({ input, init, body });
    if (this.httpFailures > 0) {
      this.httpFailures -= 1;
      return { ok: false, json: async () => ({}) };
    }
    const next = this.responses.shift() ?? DENY_RESPONSE;
    const value = await next;
    return { ok: true, json: async () => value };
  };
  randomBytes = (length: number) => {
    const bytes = new Uint8Array(length);
    bytes.fill(this.randomSeed);
    this.randomSeed += 1;
    return bytes;
  };
  now = () => NOW;
  setTimer = (work: () => void) => {
    const id = this.nextTimer;
    this.nextTimer += 1;
    this.timers.set(id, work);
    return id;
  };
  clearTimer = (timer: unknown) => {
    this.timers.delete(timer as number);
  };
  publish = (message: AestheticsConsentMessage) => {
    this.publications.push(message);
  };

  setChoice(choice: "granted" | "denied") {
    this.cookies.set(
      AESTHETICS_CONSENT_COOKIE,
      `v1.${choice}.${Math.floor(NOW / 1000)}`,
    );
  }
}

function observe(controller: AestheticsAttributionController) {
  let current: AestheticsConsentView | null = null;
  controller.subscribe((view) => {
    current = view;
  });
  return () => current as AestheticsConsentView | null;
}

async function settle() {
  for (let index = 0; index < 8; index += 1) await Promise.resolve();
}

describe("paid aesthetics eligibility and URL boundaries", () => {
  it("authorizes only the canonical exact-Napa pilot page", () => {
    expect(
      isApprovedAestheticsPilotPage("experiencerella.com", "/napa/botox"),
    ).toBe(true);
    expect(
      isApprovedAestheticsPilotPage("experiencerella.com", "/napa/botox/"),
    ).toBe(true);
    expect(
      isApprovedAestheticsPilotPage("experiencerella.com", "/NAPA//BOTOX/"),
    ).toBe(true);
    expect(
      isApprovedAestheticsPilotPage("www.experiencerella.com", "/napa/botox"),
    ).toBe(false);
    expect(
      isApprovedAestheticsPilotPage("experiencerella.com", "/napa/botox/extra"),
    ).toBe(false);
  });

  it("requires exactly one bounded Google click ID", () => {
    expect(hasEligibleAestheticsPaidClick("?gclid=valid.click-1")).toBe(true);
    expect(hasEligibleAestheticsPaidClick("?gbraid=valid_click~2")).toBe(true);
    expect(hasEligibleAestheticsPaidClick("?campaignid=123")).toBe(false);
    expect(hasEligibleAestheticsPaidClick("?gclid=a&wbraid=b")).toBe(false);
    expect(hasEligibleAestheticsPaidClick("?gclid=a&gclid=b")).toBe(false);
    expect(hasEligibleAestheticsPaidClick("?gclid=person@example.com")).toBe(false);
    expect(hasEligibleAestheticsPaidClick(`?gclid=${"x".repeat(201)}`)).toBe(false);
  });

  it("cleans only attribution fields and only sanitizes Rella booking links", () => {
    const landing = stripAestheticsAttribution(
      "https://experiencerella.com/napa/botox?gclid=secret&utm_term=tox&ref=hero#book",
    );
    expect(landing).toBe(
      "https://experiencerella.com/napa/botox?ref=hero#book",
    );
    expect(
      cleanAestheticsBookingHref(
        "https://book.experiencerella.com/book/napa/botox?gclid=secret&ref=hero",
      ),
    ).toBe(
      "https://book.experiencerella.com/book/napa/botox?ref=hero",
    );
    expect(
      cleanAestheticsBookingHref("https://example.com/book?gclid=secret"),
    ).toBe("https://example.com/book?gclid=secret");
  });
});

describe("consent-safe aesthetics capture", () => {
  it("is invisible and makes no request for an ordinary organic visitor", () => {
    const runtime = new FakeRuntime();
    const controller = new AestheticsAttributionController(runtime);
    const view = observe(controller);

    controller.start();

    expect(view()).toMatchObject({ mode: "hidden", phase: "hidden" });
    expect(runtime.requests).toHaveLength(0);
    expect(runtime.cookieWrites).toHaveLength(0);
  });

  it.each([
    ["experiencerella.com", "/"],
    ["experiencerella.com", "/napa/facials"],
    ["experiencerella.com", "/napa/botox/extra"],
    ["experiencerella.com", "/locations/napa"],
    ["experiencerella.com", "/vacaville/botox"],
    ["experiencerella.com", "/napa/botoxx"],
    ["www.experiencerella.com", "/napa/botox"],
    ["rella-napa-botox-release.vercel.app", "/napa/botox"],
  ])(
    "keeps a paid click inert outside the exact pilot: %s%s",
    (host, path) => {
      const runtime = new FakeRuntime();
      runtime.host = host;
      runtime.href = `https://${host}${path}?gclid=must-stay-inert&campaignid=123`;
      runtime.setChoice("granted");
      const controller = new AestheticsAttributionController(runtime);
      const view = observe(controller);

      controller.start();

      expect(view()).toMatchObject({ mode: "hidden", phase: "hidden" });
      expect(runtime.requests).toHaveLength(0);
      expect(runtime.cookieWrites).toHaveLength(0);
      expect(runtime.replacements).toHaveLength(0);
      expect(runtime.publications).toHaveLength(0);
    },
  );

  it("shows a compact choice without any pre-consent POST", () => {
    const runtime = new FakeRuntime();
    runtime.href =
      "https://experiencerella.com/napa/botox/?gclid=paid-click&campaignid=123";
    const controller = new AestheticsAttributionController(runtime);
    const view = observe(controller);

    controller.start();

    expect(view()).toMatchObject({ mode: "panel", phase: "choice" });
    expect(runtime.requests).toHaveLength(0);
    expect(runtime.cookieWrites).toHaveLength(0);
  });

  it("posts only approved bounded fields after grant and cleans after acknowledgement", async () => {
    const runtime = new FakeRuntime();
    runtime.href =
      "https://experiencerella.com/napa/botox/?gclid=paid-click.1" +
      "&campaignid=123&gad_adgroupid=456&utm_term=do-not-forward&email=person@example.com";
    runtime.responses.push(GRANT_RESPONSE);
    const controller = new AestheticsAttributionController(runtime);
    const view = observe(controller);
    controller.start();

    await controller.accept();

    expect(runtime.requests).toHaveLength(1);
    const request = runtime.requests[0];
    expect(request.input).toBe(AESTHETICS_ATTRIBUTION_ENDPOINT);
    expect(request.init).toMatchObject({
      method: "POST",
      credentials: "include",
      keepalive: true,
      headers: { "Content-Type": "application/json" },
    });
    expect(request.body).toEqual({
      location: "napa",
      consentAdUserData: "granted",
      revocationHandle: expect.stringMatching(/^rvh_[A-Za-z0-9_-]{43}$/),
      gclid: "paid-click.1",
      campaignid: "123",
      adgroupid: "456",
    });
    expect(runtime.href).toBe(
      "https://experiencerella.com/napa/botox/?email=person%40example.com",
    );
    expect(view()).toMatchObject({ mode: "reopen", phase: "granted" });
    expect(runtime.cookieWrites.join("\n")).not.toContain("paid-click.1");
  });

  it("denies without any identifiers and strips them immediately", async () => {
    const runtime = new FakeRuntime();
    runtime.href =
      "https://experiencerella.com/napa/botox/?wbraid=raw-denied-id" +
      "&campaignid=123&utm_campaign=raw-campaign&ref=ad";
    runtime.responses.push(DENY_RESPONSE);
    const controller = new AestheticsAttributionController(runtime);
    const view = observe(controller);
    controller.start();

    const denial = controller.deny();
    expect(runtime.href).toBe(
      "https://experiencerella.com/napa/botox/?ref=ad",
    );
    await denial;

    expect(runtime.requests).toHaveLength(1);
    expect(runtime.requests[0].body).toEqual({
      location: "napa",
      consentAdUserData: "denied",
    });
    const writesAndBody = `${runtime.cookieWrites.join("\n")}\n${JSON.stringify(runtime.requests[0].body)}`;
    expect(writesAndBody).not.toContain("raw-denied-id");
    expect(writesAndBody).not.toContain("raw-campaign");
    expect(runtime.cookies.get(AD_USER_DATA_DENIED_COOKIE)).toBe("1");
    expect(view()).toMatchObject({ mode: "reopen", phase: "denied" });
  });

  it("revokes a prior grant with its opaque handle and no click fields", async () => {
    const runtime = new FakeRuntime();
    const handle = `rvh_${"A".repeat(43)}`;
    runtime.setChoice("granted");
    runtime.cookies.set(AD_ATTRIBUTION_REVOCATION_COOKIE, handle);
    runtime.responses.push(DENY_RESPONSE);
    const controller = new AestheticsAttributionController(runtime);
    controller.start();

    await controller.deny();

    expect(runtime.requests[0].body).toEqual({
      location: "napa",
      consentAdUserData: "denied",
      revocationHandle: handle,
    });
    expect(Object.keys(runtime.requests[0].body)).toEqual([
      "location",
      "consentAdUserData",
      "revocationHandle",
    ]);
    expect(runtime.publications).toContainEqual({
      denialRequested: true,
      version: 1,
    });
  });

  it("captures remembered consent only after returning to the exact path and does not repost on refresh", async () => {
    const runtime = new FakeRuntime();
    runtime.setChoice("granted");
    runtime.href =
      "https://experiencerella.com/napa/botox/?gclid=first-click";
    runtime.responses.push(GRANT_RESPONSE, GRANT_RESPONSE);
    const first = new AestheticsAttributionController(runtime);
    first.start();
    await settle();
    expect(runtime.requests).toHaveLength(1);
    expect(runtime.href).not.toContain("gclid");
    const writesBeforeLeavingPilot = runtime.cookieWrites.length;

    runtime.href =
      "https://experiencerella.com/vacaville/facials/?gbraid=must-stay-inert&gad_campaignid=999";
    first.reconcileNavigation();
    await settle();
    expect(runtime.requests).toHaveLength(1);
    expect(runtime.cookieWrites).toHaveLength(writesBeforeLeavingPilot);
    expect(runtime.href).toContain("must-stay-inert");

    runtime.href =
      "https://experiencerella.com/napa/botox/?gbraid=next-click&gad_campaignid=999";
    first.reconcileNavigation();
    await settle();
    expect(runtime.requests).toHaveLength(2);
    expect(runtime.requests[1].body).toMatchObject({
      location: "napa",
      gbraid: "next-click",
      campaignid: "999",
    });
    expect(runtime.href).not.toContain("gbraid");
    first.destroy();

    const refreshed = new AestheticsAttributionController(runtime);
    refreshed.start();
    await settle();
    expect(runtime.requests).toHaveLength(2);
  });

  it("holds a booking while grant is pending, then navigates with a clean URL", async () => {
    const runtime = new FakeRuntime();
    runtime.href =
      "https://experiencerella.com/napa/botox/?gclid=pending-click";
    const pending = deferredResponse();
    runtime.responses.push(pending.promise);
    const controller = new AestheticsAttributionController(runtime);
    controller.start();

    expect(
      controller.guardBookingNavigation(
        "https://book.experiencerella.com/book/napa/botox?gclid=must-not-cross&ref=sticky",
      ),
    ).toBe(true);
    const accepting = controller.accept();
    await settle();
    expect(runtime.navigations).toHaveLength(0);

    controller.reconcileNavigation();
    await settle();
    expect(runtime.requests).toHaveLength(1);

    pending.resolve(GRANT_RESPONSE);
    await accepting;
    expect(runtime.navigations).toEqual([
      "https://book.experiencerella.com/book/napa/botox?ref=sticky",
    ]);
  });

  it("does not resume a held booking if neither denial path is confirmed", async () => {
    const runtime = new FakeRuntime();
    runtime.href =
      "https://experiencerella.com/napa/botox/?gclid=blocked-click";
    runtime.rejectedCookies.add(AD_USER_DATA_DENIED_COOKIE);
    runtime.httpFailures = 1;
    const controller = new AestheticsAttributionController(runtime);
    const view = observe(controller);
    controller.start();
    expect(
      controller.guardBookingNavigation(
        "https://book.experiencerella.com/book/napa/botox",
      ),
    ).toBe(true);

    await controller.deny();

    expect(runtime.navigations).toHaveLength(0);
    expect(view()).toMatchObject({ mode: "panel", phase: "error" });
    expect(view()?.status).toMatch(/Booking is paused/);
  });

  it("rotates a revoked handle before future paid capture", async () => {
    const runtime = new FakeRuntime();
    const revokedHandle = `rvh_${"B".repeat(43)}`;
    runtime.setChoice("denied");
    runtime.cookies.set(AD_USER_DATA_DENIED_COOKIE, "1");
    runtime.cookies.set(AD_ATTRIBUTION_REVOCATION_COOKIE, revokedHandle);
    runtime.responses.push(DENY_RESPONSE, DENY_RESPONSE, GRANT_RESPONSE);
    const controller = new AestheticsAttributionController(runtime);
    controller.start();
    await settle();

    await controller.accept();
    const replacementHandle = runtime.cookies.get(
      AD_ATTRIBUTION_REVOCATION_COOKIE,
    );
    expect(replacementHandle).toMatch(/^rvh_[A-Za-z0-9_-]{43}$/);
    expect(replacementHandle).not.toBe(revokedHandle);
    expect(runtime.cookies.has(AD_USER_DATA_DENIED_COOKIE)).toBe(false);

    runtime.href =
      "https://experiencerella.com/napa/botox/?gclid=future-click";
    controller.reconcileNavigation();
    await settle();
    const grant = runtime.requests.find(
      ({ body }) => body.consentAdUserData === "granted",
    );
    expect(grant?.body).toMatchObject({
      gclid: "future-click",
      revocationHandle: replacementHandle,
    });
    expect(grant?.body).not.toHaveProperty("revocationPredecessorHandle");
  });
});
