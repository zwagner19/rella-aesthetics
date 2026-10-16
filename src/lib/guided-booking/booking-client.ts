import type { BookingLocation } from "@/lib/booking-routes";
import {
  catalogFailureMessage,
  parseCartDates,
  parseCatalogClinic,
  parseTimes,
  type BookingSiteScope,
  type LiveCatalogClinic,
} from "./live-catalog";
import type { GuidedSlot } from "./types";

async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function reasonOf(body: unknown, fallback: string): string {
  if (body && typeof body === "object" && typeof (body as { reason?: unknown }).reason === "string") {
    return (body as { reason: string }).reason;
  }
  return fallback;
}

export async function loadCatalog(
  location: BookingLocation,
  siteScope: BookingSiteScope,
): Promise<{ ok: true; clinic: LiveCatalogClinic } | { ok: false; message: string }> {
  const response = await fetch(
    `/api/booking-v2/catalog?location=${location}&siteScope=${siteScope}`,
    { cache: "no-store", credentials: "same-origin" },
  );
  const body = await readJson(response);
  if (!response.ok) {
    return { ok: false, message: catalogFailureMessage(response.status, body) };
  }
  const parsed = parseCatalogClinic(body, location);
  if (!parsed.ok) return { ok: false, message: parsed.message };
  return { ok: true, clinic: parsed.clinic };
}

export async function createCart(input: {
  location: BookingLocation;
  service: string;
  siteScope: BookingSiteScope;
}): Promise<{ ok: true; dates: string[] } | { ok: false; message: string }> {
  const response = await fetch(
    `/api/booking-v2/cart?siteScope=${input.siteScope}`,
    {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ location: input.location, service: input.service }),
    },
  );
  const body = await readJson(response);
  if (!response.ok) {
    return {
      ok: false,
      message: `Times could not be opened (${reasonOf(body, `HTTP ${response.status}`)}).`,
    };
  }
  return { ok: true, dates: parseCartDates(body) };
}

export async function loadTimes(input: {
  date: string;
  timeZone: string;
  siteScope: BookingSiteScope;
}): Promise<{ ok: true; times: GuidedSlot[] } | { ok: false; message: string }> {
  const response = await fetch(
    `/api/booking-v2/cart?date=${input.date}&siteScope=${input.siteScope}`,
    { cache: "no-store", credentials: "same-origin" },
  );
  const body = await readJson(response);
  if (!response.ok) {
    return {
      ok: false,
      message: `Times could not be loaded (${reasonOf(body, `HTTP ${response.status}`)}).`,
    };
  }
  return { ok: true, times: parseTimes(body, input.timeZone) };
}

export async function reserveTime(input: {
  bookableTimeId: string;
  siteScope: BookingSiteScope;
}): Promise<{ ok: true } | { ok: false; message: string }> {
  const response = await fetch(
    `/api/booking-v2/reserve?siteScope=${input.siteScope}`,
    {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookableTimeId: input.bookableTimeId }),
    },
  );
  const body = await readJson(response);
  if (!response.ok) {
    return {
      ok: false,
      message: `That time could not be held (${reasonOf(body, `HTTP ${response.status}`)}).`,
    };
  }
  return { ok: true };
}

export interface CheckoutResult {
  ok: boolean;
  status: number;
  reason: string;
  confirmation: string | null;
  stage: string | null;
}

export async function submitCheckout(input: {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  siteScope: BookingSiteScope;
}): Promise<CheckoutResult> {
  const response = await fetch(
    `/api/booking-v2/checkout?siteScope=${input.siteScope}`,
    {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        info: {
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          phoneNumber: input.phoneNumber,
        },
      }),
    },
  );
  const body = await readJson(response);
  const record = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  return {
    ok: response.ok,
    status: response.status,
    reason: typeof record.reason === "string" ? record.reason : "",
    confirmation: typeof record.confirmation === "string" ? record.confirmation : null,
    stage: typeof record.stage === "string" ? record.stage : null,
  };
}

export async function submitPayment(input: {
  token: string;
  siteScope: BookingSiteScope;
}): Promise<{ ok: true } | { ok: false; message: string }> {
  const response = await fetch(
    `/api/booking-v2/payment?siteScope=${input.siteScope}`,
    {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: input.token }),
    },
  );
  const body = await readJson(response);
  if (!response.ok) {
    return {
      ok: false,
      message: `The card could not be attached (${reasonOf(body, `HTTP ${response.status}`)}).`,
    };
  }
  return { ok: true };
}

export async function finishBooking(
  siteScope: BookingSiteScope,
): Promise<{ ok: boolean }> {
  const response = await fetch(
    `/api/booking-v2/complete?siteScope=${siteScope}`,
    {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    },
  );
  return { ok: response.ok };
}

export const BOULEVARD_TOKENIZE_URL = "https://pci.boulevard.app/cards/tokenize";

export async function tokenizeCard(card: {
  name: string;
  number: string;
  cvv: string;
  expMonth: number;
  expYear: number;
  zip: string;
}): Promise<{ ok: true; token: string } | { ok: false; message: string }> {
  let response: Response;
  try {
    response = await fetch(BOULEVARD_TOKENIZE_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        card: {
          name: card.name.trim(),
          number: card.number,
          cvv: card.cvv,
          exp_month: card.expMonth,
          exp_year: card.expYear,
          address_postal_code: card.zip,
        },
      }),
    });
  } catch {
    return { ok: false, message: "Card verification could not reach Boulevard." };
  }
  let body: unknown = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }
  const token =
    body && typeof body === "object" && typeof (body as { token?: unknown }).token === "string"
      ? (body as { token: string }).token
      : "";
  if (!response.ok || !token) {
    return { ok: false, message: "Card could not be verified — please check the details." };
  }
  return { ok: true, token };
}
