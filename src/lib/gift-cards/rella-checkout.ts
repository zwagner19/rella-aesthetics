import { PackageRequestError, type PackageClient, type PackageConfirmation, type PackagePurchaseReview } from "@/lib/guided-booking/package-client";
import { quoteMatchesOffer, rellaPackageKey, type ClinicId, type GiftCardOffer } from "./config";

/**
 * Opening step of the Black Friday purchase through Rella's own package
 * checkout. Pure (no React) so the fail-closed rules are unit tested.
 *
 *  - "ready":       the server quoted exactly the advertised price; collect details.
 *  - "already":     this device already holds a confirmed purchase; ask before buying another.
 *  - "pending":     an earlier payment could not be verified; never start another one.
 *  - "mismatch":    the server's total is not the advertised price; stop and send to the phone.
 *  - "unavailable": Rella's checkout could not be reached; the caller may fall back.
 */
export type RellaCheckoutOpening =
  | { kind: "ready"; review: PackagePurchaseReview }
  | ({ kind: "already" } & PackageConfirmation)
  | { kind: "pending" }
  | { kind: "mismatch" }
  | { kind: "unavailable" };

export function reviewIsSellable(offer: GiftCardOffer, review: PackagePurchaseReview): boolean {
  return quoteMatchesOffer(offer, review) && review.needsCard && typeof review.cardFrameOrigin === "string";
}

/** Only this exact server-proven pre-checkout failure permits a fresh cart. */
export function isSafeCardRestart(error: unknown): boolean {
  return error instanceof PackageRequestError && error.definitive && error.reason === "package_card_not_attached";
}

export async function openRellaCheckout(
  client: PackageClient,
  offer: GiftCardOffer,
  clinic: ClinicId,
  options: { buyAnother?: boolean } = {},
): Promise<RellaCheckoutOpening> {
  let safeToStart = false;
  try {
    const status = await client.status();
    if (status.state === "PENDING" || status.state === "PAYMENT_READY") return { kind: "pending" };
    if (status.state === "CONFIRMED") {
      if (!options.buyAnother) { const { state, ...result } = status; void state; return { kind: "already", ...result }; }
      if (!client.resetConfirmed()) return { kind: "unavailable" };
    }
    safeToStart = true;
    const key = rellaPackageKey(offer.id, clinic);
    const offerings = await client.listOfferings(clinic);
    if (!offerings.some((item) => item.id === key)) return { kind: "unavailable" };
    const review = await client.reviewPurchase({ location: clinic, packageId: key });
    return reviewIsSellable(offer, review) ? { kind: "ready", review } : { kind: "mismatch" };
  } catch {
    return !safeToStart || client.verificationPending() ? { kind: "pending" } : { kind: "unavailable" };
  }
}
