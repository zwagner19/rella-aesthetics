import { redirect } from "next/navigation";
import { BOULEVARD_WIDGET_GENERIC } from "@/lib/booking-routes";

/**
 * `/booking` is QUARANTINED (Sprint 07 lead review). The retired embedded
 * Boulevard SDK wizard is no longer served from any public route — this page is
 * a server redirect to the generic Boulevard widget, where the visitor selects a
 * location/service. No second booking implementation is maintained, no public
 * navigation or CTA points here (see routing-safety.test.ts), and the route is
 * excluded from the sitemap because it only redirects. The prior immediate-email
 * confirmation copy is removed.
 */
export const metadata = { robots: { index: false } };

export default function BookingPage() {
  redirect(BOULEVARD_WIDGET_GENERIC);
}
