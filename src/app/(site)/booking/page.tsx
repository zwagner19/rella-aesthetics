import { redirect } from "next/navigation";
import { BOOKING_LOCATION_CHOOSER } from "@/lib/booking-routes";

/**
 * `/booking` is QUARANTINED (Sprint 07 lead review). The retired embedded
 * Boulevard SDK wizard is no longer served from any public route. This page is
 * a server redirect to Rella's branded clinic/category chooser. No second
 * booking implementation is maintained, no public navigation or CTA points
 * here (see routing-safety.test.ts), and the route is excluded from the sitemap.
 */
export const metadata = { robots: { index: false } };

export default function BookingPage() {
  redirect(BOOKING_LOCATION_CHOOSER);
}
