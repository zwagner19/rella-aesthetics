import { isApprovedAestheticsPage } from "./aesthetics-attribution";
import { resolveBookingHref, type BookingIntent } from "./booking-routes";

export function clinicBookingEntry(href: string): {
  intent: BookingIntent;
  bookingHref: string;
  cleanHref: string;
} | null {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return null;
  }
  const location = /^\/locations\/(napa|vacaville)\/?$/.exec(url.pathname)?.[1];
  const legacyChooser = url.pathname === "/" && url.hash === "#book-now" && !url.searchParams.has("booking");
  const clinicEntry = !!location && url.searchParams.getAll("booking").length === 1 && url.searchParams.get("booking") === "open";
  if (
    url.protocol !== "https:" || url.username || url.password || url.port ||
    !isApprovedAestheticsPage(url.hostname, url.pathname) ||
    (!legacyChooser && !clinicEntry)
  ) return null;

  const intent: BookingIntent = location ? { location: location as "napa" | "vacaville" } : {};
  url.searchParams.delete("booking");
  if (legacyChooser) url.hash = "";
  return { intent, bookingHref: resolveBookingHref(intent), cleanHref: url.href };
}

export function requestClinicBookingEntry(
  controller: { guardBookingNavigation(href: string, continueInSite: () => void): boolean },
  runtime: {
    currentHref(): string;
    replaceHref(href: string): void;
    open(intent: BookingIntent): void;
  },
): void {
  const entry = clinicBookingEntry(runtime.currentHref());
  if (!entry) return;
  const open = () => {
    const current = clinicBookingEntry(runtime.currentHref());
    if (!current || current.intent.location !== entry.intent.location) return;
    // Consume only after the consent boundary resumes booking. A pending choice
    // must survive effect replay, and navigation away must cancel the opener.
    runtime.replaceHref(current.cleanHref);
    runtime.open(entry.intent);
  };
  if (!controller.guardBookingNavigation(entry.bookingHref, open)) open();
}
