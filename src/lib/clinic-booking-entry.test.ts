import { expect, it } from "vitest";
import { clinicBookingEntry, requestClinicBookingEntry } from "./clinic-booking-entry";

it.each(["experiencerella.com", "www.experiencerella.com"])("restores the existing Linktree booking anchor on %s", host => {
  const entry = clinicBookingEntry(`https://${host}/?utm_source=referral&utm_medium=referral#book-now`);
  expect(entry).toEqual({
    intent: {},
    bookingHref: "https://book.experiencerella.com/book",
    cleanHref: `https://${host}/?utm_source=referral&utm_medium=referral`,
  });
});

it.each(["napa", "vacaville"] as const)("opens only the clinic named by the %s page", location => {
  const href = `https://experiencerella.com/locations/${location}?booking=open&location=elsewhere&utm_source=google_business_profile&utm_medium=organic#visit`;
  const entry = clinicBookingEntry(href);
  expect(entry?.intent).toEqual({ location });
  expect(entry?.bookingHref).toBe(`https://book.experiencerella.com/book?location=${location}`);
  expect(entry?.cleanHref).toBe(`https://experiencerella.com/locations/${location}?location=elsewhere&utm_source=google_business_profile&utm_medium=organic#visit`);
});

it.each([
  "https://experiencerella.com/locations/napa",
  "https://experiencerella.com/locations/napa?booking=closed",
  "https://experiencerella.com/locations/napa?booking=open&booking=open",
  "https://experiencerella.com/locations/napa?booking=https://example.com",
  "https://experiencerella.com/?booking=closed#book-now",
  "https://experiencerella.com/#unrelated-anchor",
  "https://experiencerella.com/locations/napa#book-now",
  "https://preview.vercel.app/#book-now",
  "https://example.com/#book-now",
  "https://experiencerella.com/services?booking=open&location=napa",
  "https://experiencerella.com/api/locations/napa?booking=open",
  "https://experiencerella.com/locations/unknown?booking=open",
  "https://book.experiencerella.com/locations/napa?booking=open",
  "https://example.com/locations/napa?booking=open",
  "https://preview.vercel.app/locations/napa?booking=open",
  "http://experiencerella.com/locations/napa?booking=open",
  "https://user@experiencerella.com/locations/napa?booking=open",
  "https://experiencerella.com:8080/locations/napa?booking=open",
  "not a URL",
])("does not open an unsupported entry: %s", href => {
  expect(clinicBookingEntry(href)).toBeNull();
});

it("opens the legacy location chooser only once after the existing guard resumes", () => {
  let href = "https://experiencerella.com/#book-now";
  const opened: unknown[] = [];
  let resume: (() => void) | undefined;
  const runtime = {
    currentHref: () => href,
    replaceHref: (next: string) => { href = next; },
    open: (intent: unknown) => { opened.push(intent); },
  };
  const controller = { guardBookingNavigation: (_: string, action: () => void) => { resume = action; return true; } };
  requestClinicBookingEntry(controller, runtime);
  expect(opened).toEqual([]);
  expect(href).toContain("#book-now");
  resume?.();
  requestClinicBookingEntry(controller, runtime);
  expect(opened).toEqual([{}]);
  expect(href).toBe("https://experiencerella.com/");
});

it("consumes a ready entry once without navigating to a query-supplied destination", () => {
  let href = "https://www.experiencerella.com/locations/napa/?booking=open&redirect=https://example.com";
  const opened: unknown[] = [];
  const runtime = {
    currentHref: () => href,
    replaceHref: (next: string) => { href = next; },
    open: (intent: unknown) => { opened.push(intent); },
  };
  const controller = { guardBookingNavigation: () => false };
  requestClinicBookingEntry(controller, runtime);
  requestClinicBookingEntry(controller, runtime);
  expect(opened).toEqual([{ location: "napa" }]);
  expect(href).toBe("https://www.experiencerella.com/locations/napa/?redirect=https%3A%2F%2Fexample.com");
});
