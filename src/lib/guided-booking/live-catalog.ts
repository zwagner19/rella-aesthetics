import type { BookingCategory, BookingLocation } from "@/lib/booking-routes";

export type BookingSiteScope = "aesthetics" | "weight-loss";

export const BOOKING_CART_COOKIE = "rella_cart_auth";

export interface LiveCatalogService {
  category: string;
  serviceSlug: string;
  displayName: string;
  description: string;
  durationCopy?: string;
  bookingMode: string;
  paymentRule: string;
  providerDisplayName?: string;
  /** Booking-app path. The overlay never navigates to it. */
  href: string;
}

export interface LiveCatalogClinic {
  locationSlug: BookingLocation;
  locationName: string;
  streetShort: string;
  addressLine: string;
  timeZone: string;
  services: LiveCatalogService[];
}

export interface LiveCatalogBody {
  ok: boolean;
  siteScope?: BookingSiteScope;
  clinics?: LiveCatalogClinic[];
  reason?: string;
}

export function bookingOrigin(scope: BookingSiteScope): string {
  switch (scope) {
    case "aesthetics":
      return "https://book.experiencerella.com";
    case "weight-loss":
      return "https://book.rellaweightloss.com";
    default: {
      const _exhaustive: never = scope;
      return _exhaustive;
    }
  }
}

export function parseSiteScope(value: string | null): BookingSiteScope | null {
  if (value == null || value === "" || value === "aesthetics") return "aesthetics";
  if (value === "weight-loss") return "weight-loss";
  return null;
}

export function parseBookingLocation(
  value: string | null,
): BookingLocation | null {
  if (value === "napa" || value === "vacaville") return value;
  return null;
}

export function sanitizeCatalogDescriptions(body: unknown): unknown {
  const stripped = stripBookingPayload(body);
  if (!stripped || typeof stripped !== "object") return stripped;
  const clinics = (stripped as { clinics?: unknown }).clinics;
  if (!Array.isArray(clinics)) return stripped;
  for (const clinic of clinics) {
    if (!clinic || typeof clinic !== "object") continue;
    const services = (clinic as { services?: unknown }).services;
    if (!Array.isArray(services)) continue;
    for (const service of services) {
      if (!service || typeof service !== "object") continue;
      const description = (service as { description?: unknown }).description;
      if (typeof description === "string") {
        (service as { description: string }).description =
          visibleServiceDescription(description);
      }
    }
  }
  return stripped;
}

export function visibleServiceDescription(description: string): string {
  return description
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(
      (sentence) =>
        sentence.length > 0 &&
        !/\$\s*\d/.test(sentence) &&
        !/\b\d+\s*dollars?\b/i.test(sentence),
    )
    .join(" ");
}

export function groupServices(
  services: readonly LiveCatalogService[],
  search = "",
): { category: string; services: LiveCatalogService[] }[] {
  const query = search.trim().toLowerCase();
  const groups: { category: string; services: LiveCatalogService[] }[] = [];

  for (const service of services) {
    const visible = visibleServiceDescription(service.description);
    const haystack = `${service.displayName} ${visible} ${service.category}`.toLowerCase();
    if (query && !haystack.includes(query)) continue;

    const existing = groups.find((group) => group.category === service.category);
    if (existing) {
      existing.services.push(service);
      continue;
    }
    groups.push({ category: service.category, services: [service] });
  }

  return groups;
}

function readString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.includes("urn:blvd:")) return null;
  return trimmed;
}

function parseService(value: unknown): LiveCatalogService | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  const category = readString(record.category);
  const serviceSlug = readString(record.serviceSlug);
  const displayName = readString(record.displayName);
  const description = readString(record.description);
  const bookingMode = readString(record.bookingMode);
  const paymentRule = readString(record.paymentRule);
  const href = readString(record.href);
  if (
    !category ||
    !serviceSlug ||
    !/^[a-z0-9-]{1,80}$/.test(serviceSlug) ||
    !displayName ||
    description == null ||
    !bookingMode ||
    !paymentRule ||
    !href ||
    href.startsWith("http")
  ) {
    return null;
  }

  const durationCopy = readString(record.durationCopy) ?? undefined;
  const providerDisplayName = readString(record.providerDisplayName) ?? undefined;

  return {
    category,
    serviceSlug,
    displayName,
    description,
    ...(durationCopy ? { durationCopy } : {}),
    bookingMode,
    paymentRule,
    ...(providerDisplayName ? { providerDisplayName } : {}),
    href,
  };
}

export function parseCatalogClinic(
  body: unknown,
  location: BookingLocation,
): { ok: true; clinic: LiveCatalogClinic } | { ok: false; message: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, message: "The live catalog response was not a catalog object." };
  }
  const record = body as Record<string, unknown>;
  if (record.ok !== true || !Array.isArray(record.clinics)) {
    return {
      ok: false,
      message: catalogFailureMessage(200, body),
    };
  }

  const match = record.clinics.find(
    (clinic) =>
      clinic &&
      typeof clinic === "object" &&
      (clinic as { locationSlug?: unknown }).locationSlug === location,
  );
  if (!match || typeof match !== "object") {
    return {
      ok: false,
      message: `The live catalog did not include ${location}.`,
    };
  }

  const clinic = match as Record<string, unknown>;
  const locationName = readString(clinic.locationName);
  const streetShort = readString(clinic.streetShort);
  const addressLine = readString(clinic.addressLine);
  const timeZone = readString(clinic.timeZone);
  if (!locationName || !streetShort || !addressLine || !timeZone || !Array.isArray(clinic.services)) {
    return { ok: false, message: "The live catalog clinic record was incomplete." };
  }

  const services = clinic.services.flatMap((service) => {
    const parsed = parseService(service);
    return parsed ? [parsed] : [];
  });

  return {
    ok: true,
    clinic: {
      locationSlug: location,
      locationName,
      streetShort,
      addressLine,
      timeZone,
      services,
    },
  };
}

export function catalogFailureMessage(status: number, body: unknown): string {
  const reason =
    body &&
    typeof body === "object" &&
    typeof (body as { reason?: unknown }).reason === "string"
      ? (body as { reason: string }).reason
      : "";
  if (status === 404) {
    return "The live catalog is not available yet (GET /api/booking-v2/catalog returned 404). Verification is waiting on the booking release.";
  }
  const detail = reason ? `: ${reason}` : "";
  return `The live catalog could not be read (GET /api/booking-v2/catalog returned ${status}${detail}).`;
}

export function cartCreateBody(
  input: unknown,
): { location: BookingLocation; service: string } | null {
  if (!input || typeof input !== "object") return null;
  const record = input as Record<string, unknown>;
  const location = parseBookingLocation(
    typeof record.location === "string" ? record.location : null,
  );
  const service = typeof record.service === "string" ? record.service.trim() : "";
  if (!location || !/^[a-z0-9-]{1,80}$/.test(service)) return null;
  return { location, service };
}

export function checkoutInfoBody(input: unknown): {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
} | null {
  if (!input || typeof input !== "object") return null;
  const info = (input as { info?: unknown }).info;
  if (!info || typeof info !== "object") return null;
  const record = info as Record<string, unknown>;
  const firstName = readString(record.firstName);
  const lastName = readString(record.lastName);
  const email = readString(record.email);
  const phoneNumber = readString(record.phoneNumber);
  if (!firstName || !lastName || !email || !phoneNumber) return null;
  if (firstName.length > 80 || lastName.length > 80 || email.length > 254 || phoneNumber.length > 40) {
    return null;
  }
  return { firstName, lastName, email, phoneNumber };
}

export function readCookie(header: string | null, name: string): string | null {
  if (!header) return null;
  for (const part of header.split(";")) {
    const trimmed = part.trim();
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    if (trimmed.slice(0, eq) === name) return trimmed.slice(eq + 1);
  }
  return null;
}

export function cartIdFromAuthCookie(value: string): string | null {
  const payload = value.split(".")[0];
  if (!payload) return null;
  try {
    const json = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as { c?: unknown };
    return typeof json.c === "string" && json.c.startsWith("urn:blvd:Cart:")
      ? json.c
      : null;
  } catch {
    return null;
  }
}

export function rewriteCartSetCookie(
  setCookie: string,
  secure: boolean,
): string | null {
  const [pair, ...attrs] = setCookie.split(";").map((part) => part.trim());
  if (!pair) return null;
  const eq = pair.indexOf("=");
  if (eq <= 0 || pair.slice(0, eq) !== BOOKING_CART_COOKIE) return null;
  const kept = attrs.filter((attr) => {
    const key = attr.split("=")[0]?.trim().toLowerCase();
    return key === "expires" || key === "max-age" || key === "httponly" || key === "samesite";
  });
  const parts = [pair, "Path=/", ...kept];
  if (secure) parts.push("Secure");
  return parts.join("; ");
}

const CLIENT_OMITTED_KEYS = new Set([
  "cartId",
  "depositCents",
  "c",
]);

export function stripBookingPayload(value: unknown): unknown {
  if (typeof value === "string") {
    return value.includes("urn:blvd:") ? undefined : value;
  }
  if (Array.isArray(value)) {
    return value.flatMap((item) => {
      const next = stripBookingPayload(item);
      return next === undefined ? [] : [next];
    });
  }
  if (!value || typeof value !== "object") return value;

  const out: Record<string, unknown> = {};
  for (const [key, nested] of Object.entries(value)) {
    if (CLIENT_OMITTED_KEYS.has(key)) continue;
    const next = stripBookingPayload(nested);
    if (next !== undefined) out[key] = next;
  }
  return out;
}

export function parseCartDates(body: unknown): string[] {
  if (!body || typeof body !== "object") return [];
  const dates = (body as { dates?: unknown }).dates;
  if (!Array.isArray(dates)) return [];
  return dates.filter(
    (date): date is string =>
      typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date),
  );
}

export function formatSlotLabel(startTime: string, timeZone: string): string {
  const date = new Date(startTime);
  if (Number.isNaN(date.getTime())) return startTime;
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function parseTimes(
  body: unknown,
  timeZone: string,
): { id: string; startTime: string; label: string }[] {
  if (!body || typeof body !== "object") return [];
  const times = (body as { times?: unknown }).times;
  if (!Array.isArray(times)) return [];
  return times.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const id = (item as { id?: unknown }).id;
    const startTime = (item as { startTime?: unknown }).startTime;
    if (typeof id !== "string" || typeof startTime !== "string") return [];
    if (id.includes("urn:blvd") || startTime.includes("urn:blvd")) return [];
    return [{ id, startTime, label: formatSlotLabel(startTime, timeZone) }];
  });
}

export function categoriesForIntent(
  services: readonly LiveCatalogService[],
  category: BookingCategory | null,
): string[] {
  if (!category) return [];
  return [
    ...new Set(
      services
        .filter((service) => service.category.toLowerCase().includes(category))
        .map((service) => service.category),
    ),
  ];
}
