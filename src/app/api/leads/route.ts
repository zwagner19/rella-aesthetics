import { NextRequest, NextResponse } from "next/server";
import {
  GHL_API_BASE,
  GHL_API_VERSION,
  buildGhlContactBody,
} from "@/lib/ghl";

interface LeadPayload {
  name?: string;
  email?: string;
  phone?: string;
  service?: string;
  location?: string;
  message?: string;
  website?: string;
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
] as const);

function clean(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function interestTag(service: string) {
  const slug = service
    .toLowerCase()
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-|-$/g, "");
  return slug ? `interest-${slug}` : "";
}

function clinicPreference(value: string) {
  return CLINIC_PREFERENCES.get(value.toLowerCase()) ?? "";
}

function clinicTag(location: string) {
  if (location === "Napa") return "location-napa";
  if (location === "Vacaville") return "location-vacaville";
  if (location === "No preference") return "location-flexible";
  return "";
}

export async function POST(req: NextRequest) {
  try {
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

    // Honeypot: look successful to bots without creating a CRM contact or
    // contaminating lead-conversion analytics in the browser.
    if (website) {
      return NextResponse.json({ success: true, accepted: false });
    }

    if (!name || (!email && !phone)) {
      return NextResponse.json(
        { error: "Name and either email or phone are required" },
        { status: 400 }
      );
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
    }

    if (rawLocation && !location) {
      return NextResponse.json(
        { error: "Select a valid clinic preference" },
        { status: 400 },
      );
    }

    const GHL_API_KEY = process.env.GHL_API_KEY ?? "";
    const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID ?? "";
    const GHL_CF_SERVICE = process.env.GHL_CUSTOM_FIELD_SERVICE_ID ?? "";
    const GHL_CF_LOCATION = process.env.GHL_CUSTOM_FIELD_LOCATION_ID ?? "";
    const GHL_CF_MESSAGE = process.env.GHL_CUSTOM_FIELD_MESSAGE_ID ?? "";

    // FAIL CLOSED. A prospect must never see a success state unless their
    // information was accepted by the CRM.
    if (!GHL_API_KEY || !GHL_LOCATION_ID) {
      return NextResponse.json(
        { error: "Contact form is temporarily unavailable" },
        { status: 503 }
      );
    }

    // A free-text medical inquiry must have an explicit destination. Never
    // hide it in `source`, logs, or a response body where it can be lost or
    // exposed.
    if (!GHL_CF_MESSAGE) {
      return NextResponse.json(
        { error: "Contact form is temporarily unavailable" },
        { status: 503 }
      );
    }

    const nameParts = (name ?? "").trim().split(/\s+/);
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
      source: "Rella Website — Contact Form",
      customFields: customFields.length ? customFields : undefined,
    });

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GHL_API_KEY}`,
      Version: GHL_API_VERSION,
    };

    const ghlRes = await fetch(`${GHL_API_BASE}/contacts/upsert`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8_000),
    });

    const responseText = await ghlRes.text();
    let result: { contact?: { id?: string }; id?: string; message?: string } =
      {};

    try {
      result = responseText ? JSON.parse(responseText) : {};
    } catch {
      result = {};
    }

    if (!ghlRes.ok) {
      console.error("GHL contact upsert failed", { status: ghlRes.status });
      return NextResponse.json(
        {
          error: "Contact form is temporarily unavailable",
        },
        { status: 502 }
      );
    }

    const contactId = result.contact?.id ?? result.id;
    if (!contactId) {
      console.error("GHL contact upsert returned no contact ID");
      return NextResponse.json(
        { error: "Contact form is temporarily unavailable" },
        { status: 502 }
      );
    }

    const tags = [
      "website-lead",
      interestTag(service),
      clinicTag(location),
    ].filter(Boolean);
    const tagRes = await fetch(`${GHL_API_BASE}/contacts/${contactId}/tags`, {
      method: "POST",
      headers,
      body: JSON.stringify({ tags }),
      signal: AbortSignal.timeout(8_000),
    });

    // Tagging helps routing and reporting, but the lead itself is already safe
    // in the CRM. A tag failure must not ask a prospect to resubmit and create
    // confusion or duplicates.
    if (!tagRes.ok) {
      console.error("GHL contact tagging failed", { status: tagRes.status });
    }

    return NextResponse.json({
      success: true,
      accepted: true,
    });
  } catch (error) {
    const errorName = error instanceof Error ? error.name : "UnknownError";
    console.error("Lead submission failed", { errorName });
    return NextResponse.json(
      { error: "Contact form is temporarily unavailable" },
      { status: 500 }
    );
  }
}
