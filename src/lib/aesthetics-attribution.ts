export const AESTHETICS_ATTRIBUTION_ENDPOINT =
  "https://book.experiencerella.com/api/booking-v2/attribution";
export const AESTHETICS_BOOKING_ORIGIN = "https://book.experiencerella.com";
export const AESTHETICS_PILOT_PATH = "/napa/botox";

export const AESTHETICS_CONSENT_COOKIE =
  "__Host-rella_napa_aesthetics_consent_v1";
export const AD_ATTRIBUTION_REVOCATION_COOKIE =
  "rella_ad_attribution_revoke";
export const AD_USER_DATA_DENIED_COOKIE = "rella_ad_user_data_denied";
export const AESTHETICS_CONSENT_CHANNEL =
  "rella_napa_aesthetics_consent_v1";

const CONSENT_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;
const REQUEST_TIMEOUT_MS = 8_000;
const CLICK_FIELDS = ["gclid", "gbraid", "wbraid"] as const;
const GOOGLE_ID_FIELDS = ["campaignid", "adgroupid"] as const;
const GOOGLE_ID_ALIASES = {
  gad_campaignid: "campaignid",
  gad_adgroupid: "adgroupid",
} as const;
const LEGACY_ATTRIBUTION_FIELDS = [
  "gclsrc",
  "matchtype",
  "device",
  "network",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "keyword",
  "gad_keyword",
  "gad_matchtype",
  "gad_device",
  "gad_network",
] as const;

export const STRIPPABLE_AESTHETICS_ATTRIBUTION_FIELDS = [
  ...CLICK_FIELDS,
  ...GOOGLE_ID_FIELDS,
  ...Object.keys(GOOGLE_ID_ALIASES),
  ...LEGACY_ATTRIBUTION_FIELDS,
] as const;

const CLICK_ID_RE = /^[\w.~-]{1,200}$/;
const GOOGLE_ADS_ID_RE = /^\d{1,30}$/;
const REVOCATION_HANDLE_RE = /^rvh_[A-Za-z0-9_-]{43}$/;
const RECEIPT_RE = /^v1\.(granted|denied)\.(\d{10})$/;

type ClickField = (typeof CLICK_FIELDS)[number];
type GoogleIdField = (typeof GOOGLE_ID_FIELDS)[number];
export type AestheticsConsentChoice = "unknown" | "granted" | "denied";
export type AestheticsConsentPhase =
  | "hidden"
  | "choice"
  | "granting"
  | "granted"
  | "denying"
  | "denied"
  | "error";

export interface AestheticsConsentView {
  mode: "hidden" | "panel" | "reopen";
  phase: AestheticsConsentPhase;
  choice: AestheticsConsentChoice;
  status: string;
}

export interface AttributionFetchResponse {
  ok: boolean;
  json(): Promise<unknown>;
}

export interface AestheticsAttributionRuntime {
  currentHref(): string;
  hostname(): string;
  cookieHeader(): string;
  writeCookie(value: string): void;
  replaceHref(href: string): void;
  navigate(href: string): void;
  fetch(
    input: string,
    init: RequestInit,
  ): Promise<AttributionFetchResponse>;
  randomBytes(length: number): Uint8Array;
  now(): number;
  setTimer(work: () => void, delayMs: number): unknown;
  clearTimer(timer: unknown): void;
  publish(message: AestheticsConsentMessage): void;
}

export interface AestheticsConsentMessage {
  denialRequested?: boolean;
  grantAcknowledged?: boolean;
  version: 1;
}

type ApprovedPaidClick = Partial<Record<ClickField | GoogleIdField, string>>;

interface GrantedPayload extends ApprovedPaidClick {
  location: string;
  consentAdUserData: "granted";
  revocationHandle: string;
  revocationPredecessorHandle?: string;
}

interface DeniedPayload {
  location: string;
  consentAdUserData: "denied";
  revocationHandle?: string;
}

const HIDDEN_VIEW: AestheticsConsentView = {
  mode: "hidden",
  phase: "hidden",
  choice: "unknown",
  status: "",
};

function safeUrl(href: string): URL | null {
  try {
    return new URL(href);
  } catch {
    return null;
  }
}

function normalizedPath(pathname: string): string {
  let path = pathname;
  try {
    path = decodeURIComponent(path);
  } catch {
    return "";
  }
  path = path.toLowerCase().replace(/\/{2,}/g, "/");
  return path.length > 1 ? path.replace(/\/+$/, "") : path;
}

export function isApprovedAestheticsPilotPage(
  hostname: string,
  pathname: string,
): boolean {
  return (
    hostname === "experiencerella.com" &&
    normalizedPath(pathname) === AESTHETICS_PILOT_PATH
  );
}

function approvedPaidClick(search: string): ApprovedPaidClick | null {
  const params = new URLSearchParams(search);
  const approved: ApprovedPaidClick = {};
  let clickCount = 0;

  for (const field of CLICK_FIELDS) {
    const values = params.getAll(field);
    if (values.length > 1) return null;
    if (values.length === 0) continue;
    const value = values[0].trim();
    if (!CLICK_ID_RE.test(value)) return null;
    approved[field] = value;
    clickCount += 1;
  }
  if (clickCount !== 1) return null;

  for (const field of GOOGLE_ID_FIELDS) {
    const values = params.getAll(field);
    if (values.length !== 1) continue;
    const value = values[0].trim();
    if (GOOGLE_ADS_ID_RE.test(value)) approved[field] = value;
  }
  for (const [alias, field] of Object.entries(GOOGLE_ID_ALIASES)) {
    if (approved[field]) continue;
    const values = params.getAll(alias);
    if (values.length !== 1) continue;
    const value = values[0].trim();
    if (GOOGLE_ADS_ID_RE.test(value)) approved[field] = value;
  }

  return approved;
}

export function hasEligibleAestheticsPaidClick(search: string): boolean {
  return approvedPaidClick(search) !== null;
}

export function stripAestheticsAttribution(href: string): string {
  const url = safeUrl(href);
  if (!url) return href;
  for (const field of STRIPPABLE_AESTHETICS_ATTRIBUTION_FIELDS) {
    url.searchParams.delete(field);
  }
  return url.toString();
}

export function cleanAestheticsBookingHref(href: string): string {
  const url = safeUrl(href);
  if (!url || url.origin !== AESTHETICS_BOOKING_ORIGIN) return href;
  return stripAestheticsAttribution(url.toString());
}

export function isAestheticsBookingHref(href: string): boolean {
  const url = safeUrl(href);
  return url?.origin === AESTHETICS_BOOKING_ORIGIN;
}

function readCookie(header: string, name: string): string | null {
  const prefix = `${name}=`;
  for (const part of header.split(";")) {
    const value = part.trim();
    if (value.startsWith(prefix)) return value.slice(prefix.length);
  }
  return null;
}

export function readAestheticsConsentChoice(
  header: string,
  nowMs: number,
): AestheticsConsentChoice {
  const value = readCookie(header, AESTHETICS_CONSENT_COOKIE);
  const match = RECEIPT_RE.exec(value ?? "");
  if (!match || (value?.length ?? 0) > 64) return "unknown";
  const decidedAt = Number(match[2]);
  const now = Math.floor(nowMs / 1000);
  if (!Number.isSafeInteger(decidedAt)) return "unknown";
  if (decidedAt > now + 300 || now - decidedAt > CONSENT_MAX_AGE_SECONDS) {
    return "unknown";
  }
  return match[1] as Exclude<AestheticsConsentChoice, "unknown">;
}

function readRevocationHandle(header: string): string | null {
  const value = readCookie(header, AD_ATTRIBUTION_REVOCATION_COOKIE);
  return value && REVOCATION_HANDLE_RE.test(value) ? value : null;
}

function hasDeniedSentinel(header: string): boolean {
  return readCookie(header, AD_USER_DATA_DENIED_COOKIE) === "1";
}

function bytesToBase64Url(bytes: Uint8Array): string {
  const alphabet =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
  let result = "";
  for (let index = 0; index < bytes.length; index += 3) {
    const first = bytes[index];
    const second = bytes[index + 1];
    const third = bytes[index + 2];
    const value =
      (first << 16) |
      ((second ?? 0) << 8) |
      (third ?? 0);
    result += alphabet[(value >>> 18) & 63];
    result += alphabet[(value >>> 12) & 63];
    if (second !== undefined) result += alphabet[(value >>> 6) & 63];
    if (third !== undefined) result += alphabet[value & 63];
  }
  return result;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isGrantedAcknowledgement(value: unknown): boolean {
  return (
    isRecord(value) &&
    value.ok === true &&
    typeof value.attributionId === "string" &&
    value.attributionId.length > 0 &&
    value.consentAdUserData === "granted" &&
    value.clickIdentifiersStored === true
  );
}

function isDeniedAcknowledgement(value: unknown): boolean {
  return (
    isRecord(value) &&
    value.ok === true &&
    value.consentAdUserData === "denied" &&
    value.clickIdentifiersStored === false &&
    value.revocationFinalized === true &&
    typeof value.revoked === "boolean"
  );
}

/**
 * Consent state machine for the exact Napa campaign pilot. Raw click IDs exist
 * only in a short-lived grant payload and are never written to browser storage,
 * analytics globals, logs, or booking URLs.
 */
export class AestheticsAttributionController {
  private view: AestheticsConsentView = HIDDEN_VIEW;
  private listeners = new Set<(view: AestheticsConsentView) => void>();
  private choice: AestheticsConsentChoice = "unknown";
  private phase: AestheticsConsentPhase = "hidden";
  private active = false;
  private destroyed = false;
  private lastHref = "";
  private navigationVersion = 0;
  private pendingBookingHref: string | null = null;
  private requestQueue: Promise<void> = Promise.resolve();
  private denialPromise: Promise<boolean> | null = null;
  private denialRetryTimer: unknown | null = null;
  private denialRetryAttempt = 0;
  private grantController: AbortController | null = null;
  private activeCaptureVersion: number | null = null;

  constructor(private readonly runtime: AestheticsAttributionRuntime) {}

  subscribe(listener: (view: AestheticsConsentView) => void): () => void {
    this.listeners.add(listener);
    listener(this.view);
    return () => this.listeners.delete(listener);
  }

  start(): void {
    this.reconcileNavigation();
  }

  destroy(): void {
    this.destroyed = true;
    this.grantController?.abort();
    if (this.denialRetryTimer !== null) {
      this.runtime.clearTimer(this.denialRetryTimer);
      this.denialRetryTimer = null;
    }
    this.listeners.clear();
  }

  reconcileNavigation(): void {
    if (this.destroyed) return;
    const href = this.runtime.currentHref();
    const url = safeUrl(href);
    if (
      !url ||
      !isApprovedAestheticsPilotPage(this.runtime.hostname(), url.pathname)
    ) {
      this.active = false;
      this.choice = "unknown";
      this.phase = "hidden";
      this.grantController?.abort();
      if (this.denialRetryTimer !== null) {
        this.runtime.clearTimer(this.denialRetryTimer);
        this.denialRetryTimer = null;
      }
      this.setView("hidden", "hidden", "unknown", "");
      return;
    }

    if (href !== this.lastHref) {
      this.lastHref = href;
      this.navigationVersion += 1;
      this.grantController?.abort();
    }

    const eligibleClick = hasEligibleAestheticsPaidClick(url.search);
    const cookieHeader = this.runtime.cookieHeader();
    const receipt = readAestheticsConsentChoice(cookieHeader, this.runtime.now());
    const sentinelPresent = hasDeniedSentinel(cookieHeader);
    const handlePresent = readRevocationHandle(cookieHeader) !== null;
    this.active =
      eligibleClick || receipt !== "unknown" || sentinelPresent || handlePresent;

    if (!this.active) {
      this.choice = "unknown";
      this.phase = "hidden";
      this.setView("hidden", "hidden", "unknown", "");
      return;
    }

    if (
      receipt === "denied" ||
      sentinelPresent ||
      (receipt === "unknown" && handlePresent)
    ) {
      this.choice = "denied";
      this.phase = "denied";
      this.persistChoice("denied");
      this.setDeniedSentinel();
      if (eligibleClick) this.cleanLandingUrl();
      this.setView("reopen", "denied", "denied", "");
      void this.requestDenial();
      return;
    }

    if (receipt === "granted") {
      this.choice = "granted";
      if (eligibleClick) {
        this.phase = "granting";
        this.setView(
          "panel",
          "granting",
          "granted",
          "Saving your cookie choice before booking...",
        );
        void this.captureCurrentClick(this.navigationVersion);
      } else {
        this.phase = "granted";
        this.setView("reopen", "granted", "granted", "");
      }
      return;
    }

    this.choice = "unknown";
    this.phase = "choice";
    this.setView("panel", "choice", "unknown", "");
  }

  openSettings(): void {
    if (!this.active || this.destroyed) return;
    this.setView("panel", this.phase, this.choice, this.view.status);
  }

  closeSettings(): void {
    if (this.choice === "unknown" || this.destroyed) return;
    this.setView("reopen", this.phase, this.choice, "");
  }

  async accept(): Promise<void> {
    if (!this.active || this.destroyed || this.phase === "granting") return;
    const wasDenied =
      this.choice === "denied" ||
      hasDeniedSentinel(this.runtime.cookieHeader());

    if (!this.persistChoice("granted")) {
      await this.failClosed(
        "Measurement remains off because this browser did not save your choice.",
      );
      return;
    }

    this.choice = "granted";
    this.phase = "granting";
    this.setView(
      "panel",
      "granting",
      "granted",
      wasDenied
        ? "Turning cookies back on safely..."
        : "Saving your cookie choice before booking...",
    );

    let predecessor: string | null = null;
    if (wasDenied) {
      const finalized = await this.requestDenial();
      if (!finalized || this.destroyed) {
        await this.failClosed(
          "Cookies remain off. Please try again before booking.",
        );
        return;
      }
      predecessor = readRevocationHandle(this.runtime.cookieHeader());
    }

    const handle = wasDenied
      ? this.rotateRevocationHandle(predecessor)
      : this.ensureRevocationHandle();
    if (!handle || !this.clearDeniedSentinel()) {
      await this.failClosed(
        "Cookies remain off because this browser could not save the setting.",
      );
      return;
    }

    const url = safeUrl(this.runtime.currentHref());
    const click = url ? approvedPaidClick(url.search) : null;
    if (!click) {
      this.phase = "granted";
      this.setView("reopen", "granted", "granted", "");
      this.runtime.publish({ grantAcknowledged: true, version: 1 });
      this.flushPendingBooking();
      return;
    }

    await this.captureCurrentClick(
      this.navigationVersion,
      handle,
      predecessor,
      click,
    );
  }

  async deny(publish = true): Promise<void> {
    if (!this.active || this.destroyed) return;
    this.persistChoice("denied");
    this.choice = "denied";
    this.phase = "denying";
    const sentinelPersisted = this.setDeniedSentinel();
    this.grantController?.abort();
    this.cleanLandingUrl();
    this.setView(
      "panel",
      "denying",
      "denied",
      "Turning off ad measurement...",
    );
    if (publish) {
      this.runtime.publish({ denialRequested: true, version: 1 });
    }

    const finalized = await this.requestDenial();
    if (this.destroyed) return;
    const safeToContinue =
      finalized ||
      sentinelPersisted ||
      hasDeniedSentinel(this.runtime.cookieHeader());
    this.phase = safeToContinue ? "denied" : "error";
    this.setView(
      safeToContinue ? "reopen" : "panel",
      this.phase,
      "denied",
      finalized
        ? ""
        : safeToContinue
          ? "Cookies are off. We will retry the server update."
          : "Booking is paused until we can safely turn off measurement. Please try again.",
    );
    if (safeToContinue) this.flushPendingBooking();
  }

  handleRemoteDenial(): void {
    void this.deny(false);
  }

  handleRemoteGrantAcknowledged(): void {
    this.reconcileNavigation();
  }

  guardBookingNavigation(href: string): boolean {
    if (!isAestheticsBookingHref(href) || !this.active) return false;
    if (
      this.phase !== "choice" &&
      this.phase !== "granting" &&
      this.phase !== "denying" &&
      this.phase !== "error"
    ) {
      return false;
    }
    this.pendingBookingHref = cleanAestheticsBookingHref(href);
    const status =
      this.phase === "choice"
        ? "Choose whether to accept cookies, then booking will continue."
        : this.phase === "error"
          ? "Decline cookies to continue booking without ad measurement."
          : "Finishing your cookie choice before booking...";
    this.setView("panel", this.phase, this.choice, status);
    return true;
  }

  private setView(
    mode: AestheticsConsentView["mode"],
    phase: AestheticsConsentPhase,
    choice: AestheticsConsentChoice,
    status: string,
  ): void {
    this.view = { mode, phase, choice, status };
    for (const listener of this.listeners) listener(this.view);
  }

  private persistChoice(choice: Exclude<AestheticsConsentChoice, "unknown">): boolean {
    const decidedAt = Math.floor(this.runtime.now() / 1000);
    this.runtime.writeCookie(
      `${AESTHETICS_CONSENT_COOKIE}=v1.${choice}.${decidedAt}; Max-Age=${CONSENT_MAX_AGE_SECONDS}; Path=/; SameSite=Lax; Secure`,
    );
    return (
      readAestheticsConsentChoice(
        this.runtime.cookieHeader(),
        this.runtime.now(),
      ) === choice
    );
  }

  private setDeniedSentinel(): boolean {
    this.runtime.writeCookie(
      `${AD_USER_DATA_DENIED_COOKIE}=1; Max-Age=${CONSENT_MAX_AGE_SECONDS}; Domain=.experiencerella.com; Path=/; SameSite=Lax; Secure`,
    );
    return hasDeniedSentinel(this.runtime.cookieHeader());
  }

  private clearDeniedSentinel(): boolean {
    this.runtime.writeCookie(
      `${AD_USER_DATA_DENIED_COOKIE}=; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Domain=.experiencerella.com; Path=/; SameSite=Lax; Secure`,
    );
    return !hasDeniedSentinel(this.runtime.cookieHeader());
  }

  private createRevocationHandle(): string {
    return `rvh_${bytesToBase64Url(this.runtime.randomBytes(32))}`;
  }

  private writeRevocationHandle(handle: string): string | null {
    this.runtime.writeCookie(
      `${AD_ATTRIBUTION_REVOCATION_COOKIE}=${handle}; Max-Age=${CONSENT_MAX_AGE_SECONDS}; Domain=.experiencerella.com; Path=/; SameSite=Lax; Secure`,
    );
    const persisted = readRevocationHandle(this.runtime.cookieHeader());
    return persisted === handle ? handle : null;
  }

  private ensureRevocationHandle(): string | null {
    const existing = readRevocationHandle(this.runtime.cookieHeader());
    return existing ?? this.writeRevocationHandle(this.createRevocationHandle());
  }

  private rotateRevocationHandle(predecessor: string | null): string | null {
    let candidate = this.createRevocationHandle();
    if (candidate === predecessor) candidate = this.createRevocationHandle();
    if (candidate === predecessor) return null;
    return this.writeRevocationHandle(candidate);
  }

  private cleanLandingUrl(): void {
    const current = this.runtime.currentHref();
    const clean = stripAestheticsAttribution(current);
    if (clean === current) return;
    this.runtime.replaceHref(clean);
    this.lastHref = clean;
  }

  private enqueue<T>(work: () => Promise<T>): Promise<T> {
    const result = this.requestQueue.then(work, work);
    this.requestQueue = result.then(
      () => undefined,
      () => undefined,
    );
    return result;
  }

  private async postPayload(
    payload: GrantedPayload | DeniedPayload,
    controller?: AbortController,
  ): Promise<unknown> {
    const requestController = controller ?? new AbortController();
    const timer = this.runtime.setTimer(
      () => requestController.abort(),
      REQUEST_TIMEOUT_MS,
    );
    try {
      const response = await this.runtime.fetch(AESTHETICS_ATTRIBUTION_ENDPOINT, {
        method: "POST",
        credentials: "include",
        keepalive: true,
        signal: requestController.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) return null;
      return await response.json();
    } catch {
      return null;
    } finally {
      this.runtime.clearTimer(timer);
    }
  }

  private requestDenial(): Promise<boolean> {
    if (this.denialPromise) return this.denialPromise;
    const attemptedHandle = readRevocationHandle(this.runtime.cookieHeader());
    const payload: DeniedPayload = {
      location: "napa",
      consentAdUserData: "denied",
      ...(attemptedHandle ? { revocationHandle: attemptedHandle } : {}),
    };

    const request = this.enqueue(async () => {
      const result = await this.postPayload(payload);
      const finalized = isDeniedAcknowledgement(result);
      if (finalized) this.denialRetryAttempt = 0;
      return finalized;
    });
    this.denialPromise = request.finally(() => {
      this.denialPromise = null;
    });
    void this.denialPromise.then((finalized) => {
      if (!finalized && this.choice === "denied") this.scheduleDenialRetry();
    });
    return this.denialPromise;
  }

  private scheduleDenialRetry(): void {
    if (this.denialRetryTimer !== null || this.destroyed || !this.active) return;
    const delay = Math.min(30_000, 1_000 * 2 ** this.denialRetryAttempt);
    this.denialRetryAttempt += 1;
    this.denialRetryTimer = this.runtime.setTimer(() => {
      this.denialRetryTimer = null;
      void this.requestDenial();
    }, delay);
  }

  private async captureCurrentClick(
    navigationVersion: number,
    preparedHandle?: string,
    predecessor: string | null = null,
    preparedClick?: ApprovedPaidClick,
  ): Promise<void> {
    if (this.destroyed || this.choice !== "granted") return;
    if (this.activeCaptureVersion === navigationVersion) return;
    this.activeCaptureVersion = navigationVersion;
    try {
      const url = safeUrl(this.runtime.currentHref());
      const click = preparedClick ?? (url ? approvedPaidClick(url.search) : null);
      if (!url || !click) {
        this.phase = "granted";
        this.setView("reopen", "granted", "granted", "");
        return;
      }
      const handle = preparedHandle ?? this.ensureRevocationHandle();
      if (!handle) {
        await this.failClosed(
          "Cookies remain off because this browser could not save the setting.",
        );
        return;
      }

      const payload: GrantedPayload = {
        location: "napa",
        consentAdUserData: "granted",
        revocationHandle: handle,
        ...(predecessor ? { revocationPredecessorHandle: predecessor } : {}),
        ...click,
      };
      const controller = new AbortController();
      this.grantController = controller;
      const acknowledged = await this.enqueue(async () => {
        if (
          this.destroyed ||
          this.choice !== "granted" ||
          readAestheticsConsentChoice(
            this.runtime.cookieHeader(),
            this.runtime.now(),
          ) !== "granted" ||
          readRevocationHandle(this.runtime.cookieHeader()) !== handle
        ) {
          return false;
        }
        return isGrantedAcknowledgement(
          await this.postPayload(payload, controller),
        );
      });
      if (this.grantController === controller) this.grantController = null;
      if (this.destroyed || this.choice !== "granted") return;

      if (
        !acknowledged ||
        navigationVersion !== this.navigationVersion ||
        hasDeniedSentinel(this.runtime.cookieHeader())
      ) {
        this.phase = "error";
        this.setView(
          "panel",
          "error",
          "granted",
          "We could not save ad measurement. Try again or decline cookies to continue booking.",
        );
        return;
      }

      this.cleanLandingUrl();
      this.phase = "granted";
      this.setView("reopen", "granted", "granted", "");
      this.runtime.publish({ grantAcknowledged: true, version: 1 });
      this.flushPendingBooking();
    } finally {
      if (this.activeCaptureVersion === navigationVersion) {
        this.activeCaptureVersion = null;
      }
    }
  }

  private async failClosed(status: string): Promise<void> {
    this.persistChoice("denied");
    this.choice = "denied";
    this.phase = "error";
    this.setDeniedSentinel();
    this.grantController?.abort();
    this.cleanLandingUrl();
    this.setView("panel", "error", "denied", status);
    this.runtime.publish({ denialRequested: true, version: 1 });
    await this.requestDenial();
  }

  private flushPendingBooking(): void {
    const href = this.pendingBookingHref;
    this.pendingBookingHref = null;
    if (href) this.runtime.navigate(cleanAestheticsBookingHref(href));
  }
}

export function createBrowserAestheticsAttributionRuntime(
  publish: (message: AestheticsConsentMessage) => void,
): AestheticsAttributionRuntime {
  return {
    currentHref: () => window.location.href,
    hostname: () => window.location.hostname,
    cookieHeader: () => document.cookie,
    writeCookie: (value) => {
      document.cookie = value;
    },
    replaceHref: (href) => {
      window.history.replaceState(window.history.state, "", href);
    },
    navigate: (href) => {
      window.location.assign(href);
    },
    fetch: (input, init) => fetch(input, init),
    randomBytes: (length) => crypto.getRandomValues(new Uint8Array(length)),
    now: () => Date.now(),
    setTimer: (work, delayMs) => window.setTimeout(work, delayMs),
    clearTimer: (timer) => window.clearTimeout(timer as number),
    publish,
  };
}
