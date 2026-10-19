import { NextRequest, NextResponse } from "next/server";
import {
  GHL_API_BASE,
  GHL_API_VERSION,
  buildGhlContactBody,
} from "@/lib/ghl";
import { EXTRA_CONTACT_INTERESTS } from "@/lib/contact-intents";
import { services } from "@/lib/data";
import { leadConsentTags, persistLeadConsent, readLeadConsent } from "@/lib/lead-consent";

interface LeadPayload {
  name?: string;
  email?: string;
  phone?: string;
  service?: string;
  location?: string;
  message?: string;
  website?: string;
  consent?: unknown;
  submissionId?: string;
}

const limits = {
  name: 120,
  email: 254,
  phone: 40,
  service: 120,
  location: 40,
  message: 2_000,
} as const;

const CLINIC_PREFERENCES: ReadonlyMap<string, string> = new Map([
  ["napa", "Napa"],
  ["vacaville", "Vacaville"],
  ["no preference", "No preference"],
]);
const SERVICE_INTERESTS = new Set<string>([
  ...services.map((service) => service.title),
  ...EXTRA_CONTACT_INTERESTS,
]);

function clean(value: unknown, maxLength: number): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function interestTag(service: string): string {
  const slug = service
    .toLowerCase()
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-|-$/g, "");
  return slug ? `interest-${slug}` : "";
}

function clinicPreference(value: string): string {
  return CLINIC_PREFERENCES.get(value.toLowerCase()) ?? "";
}

function clinicTag(location: string): string {
  if (location === "Napa") return "location-napa";
  if (location === "Vacaville") return "location-vacaville";
  if (location === "No preference") return "location-flexible";
  return "";
}

export async function POST(req: NextRequest) {
  let deliveryStarted = false;
  try {
    if (req.headers.get("sec-fetch-site") === "cross-site"
      || (req.headers.get("origin") && req.headers.get("origin") !== new URL(req.url).origin)) {
      return NextResponse.json({ error: "Request not allowed" }, { status: 403 });
    }
    if (!req.headers.get("content-type")?.startsWith("application/json")) {
      return NextResponse.json({ error: "JSON required" }, { status: 415 });
    }
    const rawBody: unknown = await req.json();
    const body: LeadPayload =
      rawBody && typeof rawBody === "object" ? rawBody : {};
    const name = clean(body.name, limits.name);
    const email = clean(body.email, limits.email).toLowerCase();
    const phone = clean(body.phone, limits.phone);
    const service = clean(body.service, limits.service);
    const rawLocation = clean(body.location, limits.location);
    const location = clinicPreference(rawLocation);
    const message = clean(body.message, limits.message);
    const website = clean(body.website, 200);

    // Honeypot submissions look successful but never reach the CRM.
    if (website) {
      return NextResponse.json({ success: true, accepted: false });
    }

    if (!name || (!email && !phone)) {
      return NextResponse.json(
        { error: "Name and either email or phone are required" },
        { status: 400 },
      );
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Enter a valid email address" },
        { status: 400 },
      );
    }

    if (rawLocation && !location) {
      return NextResponse.json(
        { error: "Select a valid clinic preference" },
        { status: 400 },
      );
    }

    if (service && !SERVICE_INTERESTS.has(service)) {
      return NextResponse.json(
        { error: "Select a valid service interest" },
        { status: 400 },
      );
    }

    const consent = readLeadConsent(body.consent, Boolean(phone));
    const submissionId = clean(body.submissionId, 36);
    if (!consent || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(submissionId)) {
      return NextResponse.json({ error: "Please review your contact consent before sending." }, { status: 400 });
    }

    const GHL_API_KEY = process.env.GHL_API_KEY ?? "";
    const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID ?? "";
    const GHL_CF_SERVICE = process.env.GHL_CUSTOM_FIELD_SERVICE_ID ?? "";
    const GHL_CF_LOCATION = process.env.GHL_CUSTOM_FIELD_LOCATION_ID ?? "";
    const GHL_CF_MESSAGE = process.env.GHL_CUSTOM_FIELD_MESSAGE_ID ?? "";

    // A prospect must never see success unless the CRM accepted the contact.
    if (!GHL_API_KEY || !GHL_LOCATION_ID) {
      return NextResponse.json(
        { error: "Contact form is temporarily unavailable" },
        { status: 503 },
      );
    }

    // Never hide free-text medical inquiries in source strings or logs.
    if (message && !GHL_CF_MESSAGE) {
      return NextResponse.json(
        { error: "Contact form is temporarily unavailable" },
        { status: 503 },
      );
    }

    const nameParts = name.split(/\s+/);
    const firstName = nameParts[0] || "Website";
    const lastName = nameParts.slice(1).join(" ") || "Lead";

    const customFields: { id: string; fieldValue: string }[] = [];
    if (GHL_CF_SERVICE && service) {
      customFields.push({ id: GHL_CF_SERVICE, fieldValue: service });
    }
    if (GHL_CF_LOCATION && location) {
      customFields.push({ id: GHL_CF_LOCATION, fieldValue: location });
    }
    if (GHL_CF_MESSAGE && message) {
      customFields.push({ id: GHL_CF_MESSAGE, fieldValue: message });
    }

    const payload = buildGhlContactBody({
      firstName,
      lastName,
      email: email || undefined,
      phone: phone || undefined,
      locationId: GHL_LOCATION_ID,
      source: "Rella Website - Contact Form",
      customFields: customFields.length ? customFields : undefined,
    });

    const requestHeaders = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GHL_API_KEY}`,
      Version: GHL_API_VERSION,
    };
    deliveryStarted = true;
    const ghlRes = await fetch(`${GHL_API_BASE}/contacts/upsert`, {
      method: "POST",
      headers: requestHeaders,
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8_000),
    });

    const responseText = await ghlRes.text();
    let result: { contact?: { id?: string }; id?: string } = {};
    try {
      result = responseText ? JSON.parse(responseText) : {};
    } catch {
      result = {};
    }

    if (!ghlRes.ok) {
      console.error("GHL contact upsert failed", { status: ghlRes.status });
      return NextResponse.json(
        { error: "Contact form is temporarily unavailable" },
        { status: 502 },
      );
    }

    const contactId = result.contact?.id ?? result.id;
    if (typeof contactId !== "string" || !contactId || contactId.length > 256) {
      console.error("GHL contact upsert returned no contact ID");
      return NextResponse.json(
        { accepted: false, pending: true },
        { status: 202 },
      );
    }

    await persistLeadConsent({ contactId, submissionId, choice: consent, phoneProvided: Boolean(phone), headers: requestHeaders });

    const tags = [
      ...leadConsentTags(consent),
      interestTag(service),
      clinicTag(location),
    ].filter(Boolean);
    const tagRes = await fetch(`${GHL_API_BASE}/contacts/${contactId}/tags`, {
      method: "POST",
      headers: requestHeaders,
      body: JSON.stringify({ tags }),
      signal: AbortSignal.timeout(8_000),
    });

    // The contact/receipt are already saved. A routing failure needs verification,
    // never another lead submission or an unverified follow-up promise.
    if (!tagRes.ok) {
      console.error("GHL contact tagging failed", { status: tagRes.status });
      return NextResponse.json({ accepted: false, pending: true }, { status: 202 });
    }

    return NextResponse.json({ success: true, accepted: true });
  } catch (error) {
    const errorName = error instanceof Error ? error.name : "UnknownError";
    console.error("Lead submission failed", { errorName });
    if (deliveryStarted) return NextResponse.json({ accepted: false, pending: true }, { status: 202 });
    return NextResponse.json(
      { error: "Contact form is temporarily unavailable" },
      { status: 500 },
    );
  }
}
