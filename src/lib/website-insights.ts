import {
  hasAestheticsAnalyticsConsent,
  isApprovedAestheticsPage,
  type AestheticsConsentView,
} from "./aesthetics-attribution";
import {
  INSIGHTS_COOKIE,
  insightPage,
  type InsightSample,
  type InsightOutcome,
} from "./website-insights-contract";

function cookieValue(cookies: string, name: string) {
  const values = cookies
    .split(";")
    .map((v) => v.trim())
    .filter((v) => v.startsWith(`${name}=`));
  return values.length === 1 ? values[0].slice(name.length + 1) : null;
}
export function hasInsightsConsent(cookies: string, now: number) {
  const analytics = cookieValue(cookies, "__Host-rella_analytics_consent_v1");
  return (
    hasAestheticsAnalyticsConsent(cookies, now) &&
    Boolean(analytics) &&
    cookieValue(cookies, INSIGHTS_COOKIE) === analytics
  );
}
let active: WebsiteInsights | null = null;
export function recordBookingInsight(
  step: number,
  clinic: string | null | undefined,
  outcome: InsightOutcome = "open",
) {
  try {
    active?.booking(step, clinic, outcome);
  } catch {
    active = null;
  }
}
export function startBookingInsight() {
  try {
    active?.startBooking();
  } catch {
    active = null;
  }
}
export function endBookingInsight() {
  try {
    active?.closeBooking();
  } catch {
    active = null;
  }
}

/** Only coarse public geometry and explicit booking-state enums enter this collector. */
export class WebsiteInsights {
  private allowed = false;
  private bookingOpen = false;
  private page: InsightSample | null = null;
  private attempt: InsightSample | null = null;
  private path = "";
  private width = "";
  private dirty = false;
  private timer: ReturnType<typeof setInterval>;
  private started = Date.now();
  private qa =
    new URLSearchParams(window.location.search).get("insights_qa") === "1";
  constructor() {
    // The booking provider uses this single consent-owned collector instance.
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    active = this;
    document.addEventListener("click", this.click, { capture: true });
    window.addEventListener("scroll", this.scroll, { passive: true });
    window.addEventListener("resize", this.handleViewportChange);
    document.addEventListener("visibilitychange", this.visibility);
    window.addEventListener("pagehide", this.flush);
    this.timer = setInterval(this.flush, 15_000);
  }
  private permitted() {
    return (
      this.allowed &&
      typeof globalThis.crypto?.randomUUID === "function" &&
      Date.now() - this.started < 4 * 60 * 60 * 1000 &&
      window.location.hostname === "experiencerella.com" &&
      isApprovedAestheticsPage(
        window.location.hostname,
        window.location.pathname,
      ) &&
      hasInsightsConsent(document.cookie, Date.now())
    );
  }
  private viewport() {
    return window.innerWidth < 641
      ? "mobile"
      : window.innerWidth < 1025
        ? "tablet"
        : "desktop";
  }
  private handleViewportChange = () => {
    // Stop this page's geometry at a layout change; resizing is not a new view.
    if (this.width && this.width !== this.viewport()) {
      this.flush();
      this.page = null;
      this.width = this.viewport();
      this.dirty = false;
    }
  };
  private create(kind: InsightSample["kind"]): InsightSample {
    return {
      id: crypto.randomUUID(),
      seq: 0,
      version: 1,
      kind,
      page: insightPage(window.location.pathname) ?? "other",
      viewport: this.viewport(),
      qa: this.qa,
      scroll: 0,
      clicks: [],
      clinic: "unknown",
      steps: 0,
      lastStep: 0,
      outcome: "open",
    };
  }
  reconcile(view: AestheticsConsentView) {
    this.allowed =
      view.phase === "granted" &&
      hasInsightsConsent(document.cookie, Date.now());
    if (!this.allowed) {
      this.page = null;
      this.attempt = null;
      this.path = "";
      this.dirty = false;
      return;
    }
    if (this.path !== window.location.pathname) {
      this.flush();
      this.path = window.location.pathname;
      this.width = this.viewport();
      this.page = insightPage(this.path) ? this.create("page") : null;
      this.dirty = Boolean(this.page);
      this.scroll();
      this.flush();
    }
  }
  private click = (event: MouseEvent) => {
    if (
      !event.isTrusted ||
      !this.permitted() ||
      this.bookingOpen ||
      !this.page ||
      !insightPage(window.location.pathname)
    )
      return;
    const target = event.target;
    if (
      !(target instanceof Element) ||
      target.closest(
        'form,input,textarea,select,[contenteditable],[role="dialog"],#rella-aesthetics-cookie-panel,[aria-controls="rella-aesthetics-cookie-panel"]',
      )
    )
      return;
    const total = this.page.clicks.reduce((n, c) => n + c.n, 0);
    if (total >= 200) return;
    const x = Math.min(
      11,
      Math.max(
        0,
        Math.floor((event.clientX / Math.max(1, window.innerWidth)) * 12),
      ),
    );
    const y = Math.min(
      19,
      Math.max(
        0,
        Math.floor(
          ((event.clientY + window.scrollY) /
            Math.max(1, document.documentElement.scrollHeight)) *
            20,
        ),
      ),
    );
    const cell = this.page.clicks.find((c) => c.x === x && c.y === y);
    if (cell) cell.n += 1;
    else if (this.page.clicks.length < 120)
      this.page.clicks.push({ x, y, n: 1 });
    this.dirty = true;
  };
  private scroll = () => {
    if (!this.permitted() || this.bookingOpen || !this.page) return;
    const depth = Math.min(
      100,
      Math.floor(
        ((window.scrollY + window.innerHeight) /
          Math.max(1, document.documentElement.scrollHeight)) *
          10,
      ) * 10,
    );
    if (depth > this.page.scroll) {
      this.page.scroll = depth;
      this.dirty = true;
    }
  };
  private send(sample: InsightSample) {
    if (!this.permitted() || sample.seq >= 500) return;
    sample.seq += 1;
    // No URL/referrer, browser cookies, text or identifiers are forwarded to HQ.
    void fetch("/api/website-insights", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sample),
      referrerPolicy: "no-referrer",
      cache: "no-store",
      keepalive: true,
    }).catch(() => undefined);
  }
  private visibility = () => {
    if (document.visibilityState === "hidden") this.flush();
  };
  private flush = () => {
    if (this.dirty && this.page && this.permitted()) {
      this.send(this.page);
      this.dirty = false;
    }
  };
  startBooking() {
    this.flush();
    this.bookingOpen = true;
    if (this.permitted()) this.attempt = this.create("booking");
  }
  booking(
    step: number,
    clinic: string | null | undefined,
    outcome: InsightOutcome,
  ) {
    if (
      !this.permitted() ||
      !this.bookingOpen ||
      !this.attempt ||
      step < 1 ||
      step > 6
    )
      return;
    const location =
      clinic === "napa" || clinic === "vacaville" ? clinic : "unknown";
    if (
      this.attempt.lastStep === step &&
      this.attempt.clinic === location &&
      this.attempt.outcome === outcome
    )
      return;
    // Clinic switches start a new attempt; clinic-specific reach must not inherit the other clinic's steps.
    if (
      location !== "unknown" &&
      this.attempt.clinic !== "unknown" &&
      location !== this.attempt.clinic
    ) {
      this.attempt.outcome = "closed";
      this.send(this.attempt);
      this.attempt = this.create("booking");
    }
    this.attempt.lastStep = step;
    this.attempt.steps |= 1 << (step - 1);
    this.attempt.clinic = location;
    this.attempt.outcome = outcome;
    this.send(this.attempt);
  }
  closeBooking() {
    if (this.attempt && this.attempt.outcome === "open") {
      this.attempt.outcome = "closed";
      this.send(this.attempt);
    }
    this.attempt = null;
    this.bookingOpen = false;
  }
  destroy() {
    this.flush();
    clearInterval(this.timer);
    document.removeEventListener("click", this.click, { capture: true });
    window.removeEventListener("resize", this.handleViewportChange);
    window.removeEventListener("scroll", this.scroll);
    document.removeEventListener("visibilitychange", this.visibility);
    window.removeEventListener("pagehide", this.flush);
    if (active === this) active = null;
  }
}
