import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  BOOKING_URL_DEFAULT,
  BOOKING_URL_NAPA,
  BOOKING_URL_VACAVILLE,
  VERIFIED_SERVICE_BOOKING_URLS,
  bookingUrlForService,
} from "@/lib/booking-links";

const BUSINESS_ID = "a12f397a-6db3-4b18-bc34-01f02dfb7216";
const NAPA_LOCATION_ID = "91eba843-57fb-49e9-8505-431d501ffec7";
const VACAVILLE_LOCATION_ID = "0f146f87-364e-4dfd-b938-61ba49528820";
const NEW_PATIENT_TOX_SERVICE_ID = "2fee10b1-1831-4c00-83e9-9c05a7071b15";
const HYDRAFACIAL_SERVICE_ID = "68b27f62-4a04-4f9f-953e-ec4b2918ad3d";

const ALLOWED_UUIDS = new Set([
  BUSINESS_ID,
  NAPA_LOCATION_ID,
  VACAVILLE_LOCATION_ID,
  NEW_PATIENT_TOX_SERVICE_ID,
  HYDRAFACIAL_SERVICE_ID,
]);

const ALL_URLS = [
  BOOKING_URL_DEFAULT,
  BOOKING_URL_NAPA,
  BOOKING_URL_VACAVILLE,
  ...Object.values(VERIFIED_SERVICE_BOOKING_URLS),
];

describe("booking link destinations", () => {
  it("every booking URL is well-formed and points at the Boulevard widget", () => {
    for (const raw of ALL_URLS) {
      const url = new URL(raw);
      expect(url.protocol).toBe("https:");
      expect(url.host).toBe("dashboard.boulevard.io");
      expect(url.pathname).toBe(`/booking/businesses/${BUSINESS_ID}/widget`);
    }
  });

  it("uses only verified Boulevard ids (no invented uuids)", () => {
    const uuidPattern =
      /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi;
    const source = readFileSync(
      path.resolve(__dirname, "..", "src", "lib", "booking-links.ts"),
      "utf8",
    );
    const found = [...source.matchAll(uuidPattern)].map((m) =>
      m[0].toLowerCase(),
    );
    expect(found.length).toBeGreaterThan(0);
    for (const uuid of found) {
      expect(ALLOWED_UUIDS.has(uuid)).toBe(true);
    }
  });

  it("location URLs preserve location intent", () => {
    expect(new URL(BOOKING_URL_NAPA).searchParams.get("locationId")).toBe(
      NAPA_LOCATION_ID,
    );
    expect(new URL(BOOKING_URL_VACAVILLE).searchParams.get("locationId")).toBe(
      VACAVILLE_LOCATION_ID,
    );
  });

  it("exposes exactly the two verified service deep links", () => {
    expect(Object.keys(VERIFIED_SERVICE_BOOKING_URLS).sort()).toEqual([
      "botox",
      "hydrafacial",
    ]);
    const botox = new URL(VERIFIED_SERVICE_BOOKING_URLS.botox);
    expect(botox.searchParams.get("path")).toBe(
      `/cart/menu/Injectables/s_${NEW_PATIENT_TOX_SERVICE_ID}`,
    );
    const hydrafacial = new URL(VERIFIED_SERVICE_BOOKING_URLS.hydrafacial);
    expect(hydrafacial.searchParams.get("path")).toBe(
      `/cart/menu/Facials/s_${HYDRAFACIAL_SERVICE_ID}`,
    );
  });

  it("falls back to the generic widget for every unverified slug", () => {
    for (const slug of [
      "dermal-fillers",
      "chemical-peels",
      "facials",
      "microneedling",
      "iv-hydration",
      "laser-treatments",
      "weight-loss",
      "not-a-real-service",
    ]) {
      expect(bookingUrlForService(slug)).toBe(BOOKING_URL_DEFAULT);
    }
    expect(bookingUrlForService("botox")).toBe(
      VERIFIED_SERVICE_BOOKING_URLS.botox,
    );
    expect(bookingUrlForService("hydrafacial")).toBe(
      VERIFIED_SERVICE_BOOKING_URLS.hydrafacial,
    );
  });
});
