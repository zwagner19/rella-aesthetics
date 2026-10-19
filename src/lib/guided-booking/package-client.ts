import type { BookingLocation } from "@/lib/booking-routes";
import { clientLooksComplete } from "./machine";
import { treatmentDescription } from "./description";
import type { GuidedBookingState } from "./types";
import { consentPayload, verifyConsentReceipt } from "./consent";

export type PackageIntent = "buy" | "redeem";
export type PackageContact = GuidedBookingState["client"];

/** Each group grants its quantity across the alternatives, not for every one. */
export interface PackageBenefitGroup {
  quantity: number;
  alternatives: string[];
}

export interface PackageOffering {
  id: string;
  displayName: string;
  description: string;
  benefitGroups: PackageBenefitGroup[];
  reviewRequired?: boolean;
}

/** A server-calculated purchase total, separate from appointment deposits. */
export interface PackagePurchaseReview {
  offering: PackageOffering;
  totalCents: number;
  currency: "USD";
  needsCard: boolean;
  cardFrameOrigin?: string;
}

/** Only return these balances after the server has verified ownership. */
export interface OwnedPackageVoucher {
  id: string;
  title: string;
  expiresOn: string | null;
  eligibleAtLocation: boolean;
  restrictions: Array<"different_location" | "no_online_service" | "options_required">;
  services: Array<{ key: string; name: string; category: string }>;
}

export interface OwnedPackageWallet {
  location: BookingLocation;
  profile: { name: string };
  vouchers: OwnedPackageVoucher[];
  redemption: "STAFF_CHECKOUT";
}

export type PackagePurchaseResult =
  | { status: "confirmed"; confirmationId: string }
  | { status: "pending" };

export type PackageSessionStatus =
  | { state: "NONE" | "DRAFT" | "PAYMENT_READY" | "PENDING" }
  | { state: "CONFIRMED"; confirmationId: string };

/**
 * The HTTP/auth adapter supplies verified operations. There are deliberately no
 * guessed package, OTP, or voucher endpoints in this presentation client.
 */
export interface PackageOperations {
  status(): Promise<PackageSessionStatus>;
  listOfferings(location: BookingLocation): Promise<PackageOffering[]>;
  reviewPurchase(input: { location: BookingLocation; packageId: string }): Promise<PackagePurchaseReview>;
  preparePurchase(client: PackageContact): Promise<PackagePurchaseReview>;
  purchase(input: { client: PackageContact; token?: string }): Promise<PackagePurchaseResult>;
}

export interface PackageClient extends PackageOperations {
  verificationPending(): boolean;
  resetConfirmed(): boolean;
}

/** Do not repeat a purchase whose response may have been lost. */
export function createPackageClient(operations: PackageOperations, onConfirmedReset?: () => void): PackageClient {
  let purchaseResult: PackagePurchaseResult | undefined;
  let inFlight: Promise<PackagePurchaseResult> | undefined;
  function requireEditable() {
    if (purchaseResult || inFlight) throw new Error("Please verify your package purchase with Rella before starting another purchase.");
  }
  return {
    async status() {
      const status = await operations.status();
      if (status.state === "CONFIRMED") purchaseResult = { status: "confirmed", confirmationId: status.confirmationId };
      else if (status.state === "PENDING" || status.state === "PAYMENT_READY") purchaseResult = { status: "pending" };
      return purchaseResult?.status === "pending" ? { state: "PENDING" } : status;
    },
    listOfferings: location => operations.listOfferings(location),
    reviewPurchase(input) { requireEditable(); return operations.reviewPurchase(input); },
    preparePurchase(client) { requireEditable(); return operations.preparePurchase(client); },
    verificationPending: () => purchaseResult?.status === "pending",
    resetConfirmed() {
      if (purchaseResult?.status !== "confirmed" || inFlight) return false;
      purchaseResult = undefined;
      onConfirmedReset?.();
      return true;
    },
    purchase(input) {
      if (purchaseResult) return Promise.resolve(purchaseResult);
      if (inFlight) return inFlight;
      inFlight = (async () => {
        try {
          const result = await operations.purchase(input);
          purchaseResult = result.status === "confirmed" && typeof result.confirmationId === "string" && result.confirmationId.trim()
            ? { status: "confirmed", confirmationId: result.confirmationId }
            : { status: "pending" };
        } catch (error) {
          if (error instanceof PackageRequestError && error.definitive) throw error;
          purchaseResult = { status: "pending" };
        }
        return purchaseResult;
      })().finally(() => { inFlight = undefined; });
      return inFlight;
    },
  };
}

export class PackageRequestError extends Error {
  constructor(message: string, readonly definitive = false, readonly reason?: string) { super(message); }
}

function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new PackageRequestError("Package details could not be verified. Please call Rella.");
  return value as Record<string, unknown>;
}

function readOffering(value: unknown): PackageOffering {
  const offering = record(value);
  if (typeof offering.id !== "string" || !offering.id || typeof offering.name !== "string" || !offering.name.trim()
    || typeof offering.description !== "string") throw new PackageRequestError("Package details could not be verified. Please call Rella.");
  const groups = offering.benefitGroups ?? [];
  if (!Array.isArray(groups)) throw new PackageRequestError("Package benefits could not be verified. Please call Rella.");
  return {
    id: offering.id, displayName: offering.name, description: offering.description,
    ...(offering.reviewRequired === true ? { reviewRequired: true } : {}),
    benefitGroups: groups.map(value => {
      const group = record(value);
      if (!Number.isSafeInteger(group.quantity) || (group.quantity as number) <= 0 || !Array.isArray(group.alternatives) || !group.alternatives.length) {
        throw new PackageRequestError("Package benefits could not be verified. Please call Rella.");
      }
      return {
        quantity: group.quantity as number,
        alternatives: group.alternatives.map(value => {
          const alternative = record(value);
          if (typeof alternative.label !== "string" || !alternative.label.trim()) throw new PackageRequestError("Package benefits could not be verified. Please call Rella.");
          return alternative.label;
        }),
      };
    }),
  };
}

function readReview(data: Record<string, unknown>, offering: PackageOffering): PackagePurchaseReview {
  const quote = record(data.quote);
  if (quote.currency !== "USD" || typeof quote.needsCard !== "boolean" || !Number.isSafeInteger(quote.totalCents) || (quote.totalCents as number) < 0) {
    throw new PackageRequestError("The package total could not be verified. Please call Rella.");
  }
  let cardFrameOrigin: string | undefined;
  if (typeof data.cardFrameOrigin === "string") {
    try {
      const origin = new URL(data.cardFrameOrigin);
      if ((origin.protocol === "https:" || (origin.protocol === "http:" && ["localhost", "127.0.0.1"].includes(origin.hostname))) && origin.origin === data.cardFrameOrigin) {
        cardFrameOrigin = origin.origin;
      }
    } catch { /* An invalid secure origin cannot be used for card entry. */ }
  }
  return { offering, totalCents: quote.totalCents as number, currency: "USD", needsCard: quote.needsCard, cardFrameOrigin };
}

function readStatus(data: Record<string, unknown>): PackageSessionStatus {
  if (data.state === "CONFIRMED") {
    return typeof data.confirmationId === "string" && data.confirmationId.trim()
      ? { state: "CONFIRMED", confirmationId: data.confirmationId }
      : { state: "PENDING" };
  }
  if (data.state === "NONE" || data.state === "DRAFT" || data.state === "PAYMENT_READY" || data.state === "PENDING") return { state: data.state };
  throw new PackageRequestError("Package purchase status could not be verified. Please call Rella.");
}

async function packageRequest(fetcher: typeof fetch, operation: string, body?: unknown, location?: BookingLocation) {
  let response: Response;
  let data: Record<string, unknown>;
  try {
    response = await fetcher(`/api/package-booking/${operation}${location ? `?location=${location}` : ""}`, {
      method: body === undefined ? "GET" : "POST", credentials: "same-origin", cache: "no-store",
      headers: { "Content-Type": "application/json" },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
    data = record(await response.json());
  } catch {
    throw new PackageRequestError("The package request could not be verified. Please call Rella before trying again.");
  }
  if (!response.ok || data.ok !== true) {
    const message = data.reason === "review_required" ? "Please call Rella to review this package before purchasing."
      : data.reason === "code_unverified" ? "That verification code could not be confirmed. Check the code and try again."
        : data.reason === "identity_profile_unverified" ? "The date of birth could not be verified. Please check it and try again."
          : data.reason === "identity_required" ? "Verify your account before viewing package sessions."
            : "The package request could not be completed. Please call Rella if you need help.";
    throw new PackageRequestError(message, data.stage === "SAFE_TO_RETRY", typeof data.reason === "string" ? data.reason : undefined);
  }
  return data;
}

/** Same-origin adapter; native cart identifiers and authorization stay in HttpOnly cookies. */
export function createSharedPackageClient(fetcher: typeof fetch = fetch): PackageClient {
  let offerings: PackageOffering[] = [];
  let offeringLocation: BookingLocation | undefined;
  let review: PackagePurchaseReview | undefined;
  let preparedContact: string | undefined;
  let paymentAttached = false;
  let starting: { key: string; promise: Promise<PackagePurchaseReview> } | undefined;
  let mutation: Promise<unknown> = Promise.resolve();
  function serial<T>(work: () => Promise<T>): Promise<T> {
    const result = mutation.then(work, work);
    mutation = result.catch(() => undefined);
    return result;
  }
  const call = (operation: string, body?: unknown, location?: BookingLocation) => packageRequest(fetcher, operation, body, location);
  function info(client: PackageContact) {
    return { firstName: client.firstName.trim(), lastName: client.lastName.trim(), email: client.email.trim(), phoneNumber: client.phone.trim() };
  }
  function preparedSignature(client: PackageContact) {
    return JSON.stringify({ info: info(client), consent: consentPayload(client) });
  }
  return createPackageClient({
    async status() { return readStatus(await call("status")); },
    async listOfferings(location) {
      const data = await call("catalog", undefined, location);
      if (!Array.isArray(data.packages)) throw new PackageRequestError("The package menu could not be verified. Please call Rella.");
      const next = data.packages.map(readOffering);
      if (new Set(next.map(item => item.id)).size !== next.length) throw new PackageRequestError("The package menu could not be verified. Please call Rella.");
      offerings = next;
      offeringLocation = location;
      return next;
    },
    reviewPurchase({ location, packageId }) {
      const key = `${location}/${packageId}`;
      if (starting?.key === key) return starting.promise;
      const promise = serial(async () => {
        const offering = offeringLocation === location ? offerings.find(item => item.id === packageId) : undefined;
        if (!offering) throw new PackageRequestError("Choose a package available at this clinic.", true);
        if (offering.reviewRequired) throw new PackageRequestError("Please call Rella to review this package before purchasing.", true);
        const data = await call("start", { location, packageKey: packageId });
        review = readReview(data, offering);
        preparedContact = undefined;
        paymentAttached = false;
        return review;
      }).finally(() => { if (starting?.key === key) starting = undefined; });
      starting = { key, promise };
      return promise;
    },
    preparePurchase(client) {
      return serial(async () => {
        preparedContact = undefined;
        if (!review || !clientLooksComplete(client)) throw new PackageRequestError("Complete your contact details to continue.", true);
        const consent = await call("consent", consentPayload(client));
        verifyConsentReceipt(consent.consent, client);
        const data = await call("prepare", { info: info(client) });
        review = readReview(data, review.offering);
        preparedContact = preparedSignature(client);
        paymentAttached = false;
        return review;
      });
    },
    purchase({ client, token }) {
      return serial(async () => {
        if (!review || !clientLooksComplete(client) || preparedContact !== preparedSignature(client)) {
          throw new PackageRequestError("Review your contact details and package total before purchasing.", true);
        }
        if (review.needsCard && !paymentAttached) {
          if (!token || token.length > 200) throw new PackageRequestError("Enter your card securely to continue.", true);
          const payment = readStatus(await call("payment", { token }));
          if (payment.state !== "PAYMENT_READY") return { status: "pending" };
          paymentAttached = true;
        }
        const result = readStatus(await call("checkout", {}));
        return result.state === "CONFIRMED" ? { status: "confirmed", confirmationId: result.confirmationId } : { status: "pending" };
      });
    },
  }, () => { review = undefined; preparedContact = undefined; paymentAttached = false; });
}

export interface PackageIdentityProfile {
  id: string;
  name: string;
  dobRequired: boolean;
  dobOnFile: boolean;
}

export type PackageAuthentication =
  | { state: "CODE_SENT"; maskedDestination: string }
  | { state: "PROFILE_REQUIRED" | "DOB_REQUIRED"; profiles: PackageIdentityProfile[] }
  | { state: "AUTHENTICATED"; profile?: { name: string } };

export interface PackageIdentityClient {
  sendCode(input: { method: "email" | "sms"; contact: string }): Promise<PackageAuthentication>;
  verifyCode(code: string): Promise<PackageAuthentication>;
  selectProfile(input: { profileId: string; dob?: string; captureDob?: boolean }): Promise<PackageAuthentication>;
  logout(): Promise<void>;
  owned(location: BookingLocation): Promise<OwnedPackageWallet>;
  bookOwned(input: { location: BookingLocation; voucherId: string; serviceKey: string }): Promise<{ location: BookingLocation; serviceKey: string }>;
}

/** Read an existing verified session before asking the patient to request another code. */
export async function restorePackageWallet(identity: PackageIdentityClient, location: BookingLocation): Promise<OwnedPackageWallet | null> {
  try { return await identity.owned(location); }
  catch (error) {
    if (error instanceof PackageRequestError && error.reason === "identity_required") return null;
    throw error;
  }
}

function readAuthentication(data: Record<string, unknown>): PackageAuthentication {
  if (data.state === "CODE_SENT" && typeof data.maskedDestination === "string" && data.maskedDestination) {
    return { state: "CODE_SENT", maskedDestination: data.maskedDestination };
  }
  if (data.state === "AUTHENTICATED") {
    const profile = data.profile && typeof data.profile === "object" ? data.profile as Record<string, unknown> : undefined;
    return { state: "AUTHENTICATED", ...(typeof profile?.name === "string" ? { profile: { name: profile.name } } : {}) };
  }
  if ((data.state === "PROFILE_REQUIRED" || data.state === "DOB_REQUIRED") && Array.isArray(data.profiles) && data.profiles.length) {
    const profiles = data.profiles.map(value => {
      const profile = record(value);
      if (typeof profile.id !== "string" || !profile.id || typeof profile.name !== "string" || !profile.name
        || typeof profile.dobRequired !== "boolean" || typeof profile.dobOnFile !== "boolean") {
        throw new PackageRequestError("Account verification could not be completed. Please call Rella.");
      }
      return { id: profile.id, name: profile.name, dobRequired: profile.dobRequired, dobOnFile: profile.dobOnFile };
    });
    if (new Set(profiles.map(profile => profile.id)).size !== profiles.length || (data.state === "DOB_REQUIRED" && profiles.length !== 1)) {
      throw new PackageRequestError("Account verification could not be completed. Please call Rella.");
    }
    return { state: data.state, profiles };
  }
  throw new PackageRequestError("Account verification could not be completed. Please call Rella.");
}

/** Passwordless verification uses server-held native auth, never browser-stored tokens or DOB. */
export function createPackageIdentityClient(fetcher: typeof fetch = fetch): PackageIdentityClient {
  return {
    async sendCode(input) { return readAuthentication(await packageRequest(fetcher, "auth-code", input)); },
    async verifyCode(code) {
      if (!/^\d{6}$/.test(code)) throw new PackageRequestError("Enter the 6-digit verification code.", true);
      return readAuthentication(await packageRequest(fetcher, "auth-verify", { code }));
    },
    async selectProfile(input) {
      if (!input.profileId || (input.dob !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(input.dob))) {
        throw new PackageRequestError("Choose your profile and enter the requested date of birth.", true);
      }
      return readAuthentication(await packageRequest(fetcher, "auth-profile", input));
    },
    async logout() { await packageRequest(fetcher, "auth-logout", {}); },
    async owned(location) {
      const data = await packageRequest(fetcher, "owned", undefined, location);
      const profile = record(data.profile);
      if (data.state !== "AUTHENTICATED" || data.location !== location || typeof profile.name !== "string"
        || data.redemption !== "STAFF_CHECKOUT" || !Array.isArray(data.vouchers)) {
        throw new PackageRequestError("Your package sessions could not be verified. Please call Rella.");
      }
      const vouchers: OwnedPackageVoucher[] = data.vouchers.map(value => {
        const voucher = record(value);
        if (typeof voucher.id !== "string" || !voucher.id || typeof voucher.title !== "string"
          || (voucher.expiresOn !== null && (typeof voucher.expiresOn !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(voucher.expiresOn)))
          || typeof voucher.eligibleAtLocation !== "boolean" || !Array.isArray(voucher.restrictions)
          || voucher.restrictions.some(reason => !["different_location", "no_online_service", "options_required"].includes(String(reason)))
          || !Array.isArray(voucher.services)) {
          throw new PackageRequestError("Your package sessions could not be verified. Please call Rella.");
        }
        if (typeof voucher.expiresOn === "string") {
          const date = new Date(`${voucher.expiresOn}T00:00:00Z`);
          if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== voucher.expiresOn) throw new PackageRequestError("Your package sessions could not be verified. Please call Rella.");
        }
        const services = voucher.services.map(value => {
          const service = record(value);
          if (typeof service.key !== "string" || !service.key.startsWith(`${location}/`) || typeof service.name !== "string" || typeof service.category !== "string") {
            throw new PackageRequestError("Your package sessions could not be verified. Please call Rella.");
          }
          return { key: service.key, name: service.name, category: service.category };
        });
        return { id: voucher.id, title: voucher.title, expiresOn: voucher.expiresOn as string | null,
          eligibleAtLocation: voucher.eligibleAtLocation, restrictions: voucher.restrictions as OwnedPackageVoucher["restrictions"], services };
      });
      if (new Set(vouchers.map(voucher => voucher.id)).size !== vouchers.length) throw new PackageRequestError("Your package sessions could not be verified. Please call Rella.");
      return { location, profile: { name: profile.name }, vouchers, redemption: "STAFF_CHECKOUT" };
    },
    async bookOwned(input) {
      const data = await packageRequest(fetcher, "book-owned", input);
      if (data.location !== input.location || data.serviceKey !== input.serviceKey) throw new PackageRequestError("Your package appointment could not be verified. Please call Rella.");
      return { location: input.location, serviceKey: input.serviceKey };
    },
  };
}

export function formatPackageTotal(review: Pick<PackagePurchaseReview, "totalCents" | "currency">): string | null {
  if (review.currency !== "USD" || !Number.isSafeInteger(review.totalCents) || review.totalCents < 0) return null;
  return new Intl.NumberFormat("en-US", { style: "currency", currency: review.currency }).format(review.totalCents / 100);
}

/** A purchase name may contain a price; the initial package menu may not. */
export function packageMenuLabel(name: string): string {
  return name
    .replace(/\b(?:from|starting at|only)\s*(?=\$)/gi, "")
    .replace(/\$\s*\d[\d,]*(?:\.\d{1,2})?(?:\s*\/\s*(?:session|treatment|unit))?/gi, "")
    .replace(/\bUSD\s*\d[\d,]*(?:\.\d{1,2})?|\d[\d,]*(?:\.\d{1,2})?\s*(?:USD|dollars?)\b/gi, "")
    .replace(/\s*([|·–—-])\s*(?=$|[|·–—-])/g, "")
    .replace(/^\s*[|·–—-]\s*|\s*[|·–—-]\s*$/g, "")
    .replace(/\s+/g, " ")
    .trim() || "Treatment package";
}

export function packageMenuDescription(offering: PackageOffering): string {
  if (offering.reviewRequired) return "Speak with Rella to review this package’s treatment details. The team can help you understand the appropriate next steps.";
  const sentences = [...new Intl.Segmenter("en", { granularity: "sentence" }).segment(treatmentDescription(offering.description, offering.displayName))]
    .map(item => item.segment.trim()).filter(sentence => !/\$|\b(?:USD|dollars?|prices?|costs?)\b/i.test(sentence));
  if (sentences.length >= 2) return sentences.slice(0, 2).join(" ");
  return sentences.length ? `${sentences[0]} Review the package details before purchasing.`
    : "Explore this package’s treatment options with Rella. Review the package details before purchasing.";
}
