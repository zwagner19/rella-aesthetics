import { NextRequest, NextResponse } from "next/server";
import {
  GHL_API_BASE,
  GHL_API_VERSION,
  buildGhlContactBody,
} from "@/lib/ghl";

const GHL_API_KEY = process.env.GHL_API_KEY ?? "";
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID ?? "";
/** Optional: GHL custom field IDs (Settings → Custom Fields → copy field ID) */
const GHL_CF_SERVICE = process.env.GHL_CUSTOM_FIELD_SERVICE_ID ?? "";
const GHL_CF_MESSAGE = process.env.GHL_CUSTOM_FIELD_MESSAGE_ID ?? "";

interface LeadPayload {
  name?: string;
  email?: string;
  phone?: string;
  service?: string;
  message?: string;
  source?: string;
  tags?: string[];
}

export async function POST(req: NextRequest) {
  try {
    const body: LeadPayload = await req.json();
    const { name, email, phone, service, message, source: leadSource, tags: extraTags } = body;

    if (!email && !phone) {
      return NextResponse.json(
        { error: "Email or phone is required" },
        { status: 400 }
      );
    }

    if (!GHL_API_KEY || !GHL_LOCATION_ID) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "[GHL] GHL_API_KEY or GHL_LOCATION_ID missing — set in .env.local"
        );
      }
      console.log("Lead received (no GHL):", {
        name,
        email,
        phone,
        service,
        message,
      });
      return NextResponse.json({
        success: true,
        mode: "local",
        hint: "Configure GHL_API_KEY and GHL_LOCATION_ID to create contacts in GoHighLevel",
      });
    }

    const nameParts = (name ?? "").trim().split(/\s+/);
    const firstName = nameParts[0] || "Website";
    const lastName = nameParts.slice(1).join(" ") || "Lead";

    const tags = [
      "website-lead",
      ...(Array.isArray(extraTags) ? extraTags : []),
      ...(service
        ? [`interest-${service.toLowerCase().replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "")}`]
        : []),
    ];

    const customFields: { id: string; value: string }[] = [];
    if (GHL_CF_SERVICE && service) {
      customFields.push({ id: GHL_CF_SERVICE, value: service });
    }
    if (GHL_CF_MESSAGE && message) {
      customFields.push({ id: GHL_CF_MESSAGE, value: message });
    }

    let source = leadSource?.trim() || "Rella Website — Contact Form";
    if (service && !GHL_CF_SERVICE) {
      source += ` | Service: ${service}`;
    }
    if (message && !GHL_CF_MESSAGE) {
      const preview = message.replace(/\s+/g, " ").trim().slice(0, 280);
      if (preview) source += ` | ${preview}`;
    }

    const payload = buildGhlContactBody({
      firstName,
      lastName,
      email: email || undefined,
      phone: phone || undefined,
      locationId: GHL_LOCATION_ID,
      tags,
      source,
      customFields: customFields.length ? customFields : undefined,
    });

    const ghlRes = await fetch(`${GHL_API_BASE}/contacts/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GHL_API_KEY}`,
        Version: GHL_API_VERSION,
      },
      body: JSON.stringify(payload),
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
      console.error("GHL API error:", ghlRes.status, responseText);
      return NextResponse.json(
        {
          error: "Failed to create contact in CRM",
          ...(process.env.NODE_ENV === "development" && {
            detail: result.message ?? responseText.slice(0, 500),
          }),
        },
        { status: 502 }
      );
    }

    const contactId = result.contact?.id ?? result.id;

    return NextResponse.json({
      success: true,
      contactId: contactId ?? undefined,
    });
  } catch (error) {
    console.error("Lead submission error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
