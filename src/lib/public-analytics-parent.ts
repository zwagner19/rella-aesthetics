import {
  aestheticsSourceEvidence, hasAestheticsAnalyticsConsent, isApprovedAestheticsPage,
  type AestheticsConsentView,
} from "./aesthetics-attribution";
import {
  PUBLIC_ANALYTICS_ORIGIN, PUBLIC_ANALYTICS_FRAME_PATH, PUBLIC_ANALYTICS_CLEAR_PATH,
  PUBLIC_ANALYTICS_MESSAGE_TYPE, type PublicAnalyticsPageGroup,
  type PublicAnalyticsPageViewMessage,
} from "./public-analytics-frame";

let bookingActive = false;
const bookingStops = new Set<() => void>();

/** Stop the isolated document before React mounts any booking controls. */
export function setPublicAnalyticsBookingState(open: boolean): void {
  bookingActive = open;
  if (open) bookingStops.forEach(stop => stop());
}

export function publicAnalyticsPageGroup(path: string): PublicAnalyticsPageGroup {
  const normalized = path.toLowerCase().replace(/\/$/, "") || "/";
  if (normalized === "/") return "homepage";
  if (normalized.startsWith("/napa/") || normalized === "/napa" || normalized === "/locations/napa") return "napa";
  if (normalized.startsWith("/vacaville/") || normalized === "/locations/vacaville") return "vacaville";
  if (normalized === "/services" || normalized.startsWith("/services/")) return "treatments";
  if (["about", "team", "contact", "membership"].includes(normalized.slice(1))) {
    return normalized.slice(1) as PublicAnalyticsPageGroup;
  }
  return "other_public";
}

/** Parent owns only a bounded bridge; the isolated document owns the tag. */
export class PublicAnalyticsParent {
  private frame: HTMLIFrameElement | null = null;
  private ready = false;
  private pending: PublicAnalyticsPageViewMessage | null = null;
  private lastPath = "";
  private source = aestheticsSourceEvidence(window.location.search, document.referrer);
  private disposed = false;
  private hadPermission = false;
  private reconciliationVersion = 0;
  private clearing: Promise<boolean> | null = null;
  private clearFailed = false;

  constructor() {
    window.addEventListener("message", this.onMessage);
    bookingStops.add(this.stopForBooking);
  }

  private stopForBooking = () => {
    this.reconciliationVersion += 1;
    this.removeFrame();
  };

  private onMessage = (event: MessageEvent<unknown>) => {
    const message = event.data;
    const candidate = message as Record<string, unknown> | null;
    if (event.origin !== PUBLIC_ANALYTICS_ORIGIN || event.source !== this.frame?.contentWindow
      || !message || typeof message !== "object" || Array.isArray(message)
      || Object.keys(message).length !== 2
      || candidate?.type !== PUBLIC_ANALYTICS_MESSAGE_TYPE || candidate.action !== "ready") return;
    this.ready = true;
    this.flush();
  };

  private flush() {
    if (this.disposed || bookingActive || this.clearing || this.clearFailed
      || !this.ready || !this.frame || !this.pending
      || !isApprovedAestheticsPage(window.location.hostname, window.location.pathname)
      || !hasAestheticsAnalyticsConsent(document.cookie, Date.now())) return;
    this.frame.contentWindow?.postMessage(this.pending, PUBLIC_ANALYTICS_ORIGIN);
    this.pending = null;
  }

  reconcile(view: AestheticsConsentView, bookingOpen: boolean) {
    if (this.disposed) return;
    const version = ++this.reconciliationVersion;
    // Classify before the consent controller strips landing parameters.
    if (window.location.search) {
      const evidence = aestheticsSourceEvidence(window.location.search, document.referrer);
      if (evidence.sourceEvidence !== "direct_or_unknown") this.source = evidence;
    }
    const permitted = view.phase === "granted"
      && hasAestheticsAnalyticsConsent(document.cookie, Date.now());
    if (!permitted || bookingOpen || bookingActive
      || !isApprovedAestheticsPage(window.location.hostname, window.location.pathname)) {
      this.removeFrame();
      if (!permitted && this.hadPermission) this.clearCookies();
      if (!permitted) this.lastPath = "";
      this.hadPermission = permitted;
      return;
    }
    this.hadPermission = true;
    if (this.clearing) {
      void this.clearing.then(cleared => {
        if (cleared && !this.disposed && version === this.reconciliationVersion) {
          // A late cleanup must not revive a withdrawn grant or booking frame.
          this.reconcile(view, bookingOpen);
        }
      });
      return;
    }
    if (this.clearFailed) return;
    const path = window.location.pathname;
    if (path !== this.lastPath) {
      this.lastPath = path;
      this.pending = {
        type: PUBLIC_ANALYTICS_MESSAGE_TYPE, action: "page_view",
        navigationId: crypto.randomUUID(), pageGroup: publicAnalyticsPageGroup(path),
        source: this.source.utm_source, medium: this.source.utm_medium,
      };
    }
    if (!this.frame) {
      const frame = document.createElement("iframe");
      frame.hidden = true;
      frame.style.display = "none";
      frame.title = "Visitor analytics";
      frame.tabIndex = -1;
      frame.setAttribute("aria-hidden", "true");
      frame.setAttribute("sandbox", "allow-scripts allow-same-origin");
      frame.referrerPolicy = "no-referrer";
      frame.src = PUBLIC_ANALYTICS_ORIGIN + PUBLIC_ANALYTICS_FRAME_PATH;
      this.frame = frame;
      document.body.appendChild(frame);
    }
    this.flush();
  }

  private removeFrame() {
    this.frame?.contentWindow?.postMessage(
      { type: PUBLIC_ANALYTICS_MESSAGE_TYPE, action: "dispose" }, PUBLIC_ANALYTICS_ORIGIN,
    );
    this.frame?.remove();
    this.frame = null;
    this.ready = false;
    this.pending = null;
  }

  private clearCookies() {
    if (this.clearing) return;
    this.clearFailed = false;
    const clearing = fetch(PUBLIC_ANALYTICS_ORIGIN + PUBLIC_ANALYTICS_CLEAR_PATH, {
      method: "POST", mode: "cors", credentials: "include", cache: "no-store",
      referrerPolicy: "no-referrer", headers: { "Content-Type": "application/json" },
      body: "{}", keepalive: true,
    }).then(response => response.ok).catch(() => false);
    this.clearing = clearing;
    void clearing.then(cleared => {
      if (this.clearing === clearing) {
        this.clearing = null;
        // Keep analytics off if this document cannot confirm cookie cleanup.
        this.clearFailed = !cleared;
      }
    });
  }

  destroy() {
    this.disposed = true;
    this.reconciliationVersion += 1;
    this.removeFrame();
    bookingStops.delete(this.stopForBooking);
    window.removeEventListener("message", this.onMessage);
  }
}
