import { resolveBookingHref } from "@/lib/booking-routes";
import { isWeightLossLandingPath } from "@/lib/site-hosts";

export interface GlobalBookingAction {
  href: string;
  label: string;
  cta?: "booking-flow-start";
}
export function resolveGlobalBookingAction(
  pathname: string | null,
  weightLossExperience: boolean,
  ordinaryLabel: "Book Consultation" | "Book Online",
): GlobalBookingAction {
  const isWeightLossLanding =
    pathname === "/services/weight-loss" ||
    (weightLossExperience && isWeightLossLandingPath(pathname));

  if (isWeightLossLanding) {
    return { href: "#consultation-options", label: "See Call Times", cta: "booking-flow-start" };
  }

  if (weightLossExperience) {
    return { href: "/#consultation-options", label: "See Call Times", cta: "booking-flow-start" };
  }

  return { href: resolveBookingHref({}), label: ordinaryLabel };
}
