import { NextRequest, NextResponse } from "next/server";

const GHL_API_KEY = process.env.GHL_API_KEY ?? "";
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID ?? "";
const GHL_API_URL = "https://rest.gohighlevel.com/v1/contacts/";

interface LeadPayload {
  name?: string;
  email?: string;
  phone?: string;
  service?: string;
  message?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: LeadPayload = await req.json();
    const { name, email, phone, service, message } = body;

    if (!email && !phone) {
      return NextResponse.json(
        { error: "Email or phone is required" },
        { status: 400 }
      );
    }

    if (!GHL_API_KEY || !GHL_LOCATION_ID) {
      console.warn("GHL API key or location ID not configured — storing lead locally");
      console.log("Lead received:", { name, email, phone, service, message });
      return NextResponse.json({ success: true, mode: "local" });
    }

    const nameParts = (name ?? "").trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    const ghlPayload = {
      firstName,
      lastName,
      email: email || undefined,
      phone: phone || undefined,
      locationId: GHL_LOCATION_ID,
      tags: ["website-lead", service ? service.toLowerCase().replace(/\s+/g, "-") : "general"].filter(Boolean),
      customField: {
        service_interest: service || "General inquiry",
        message: message || "",
      },
    };

    const ghlRes = await fetch(GHL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GHL_API_KEY}`,
      },
      body: JSON.stringify(ghlPayload),
    });

    if (!ghlRes.ok) {
      const errorText = await ghlRes.text();
      console.error("GHL API error:", ghlRes.status, errorText);
      return NextResponse.json(
        { error: "Failed to create lead" },
        { status: 502 }
      );
    }

    const result = await ghlRes.json();
    return NextResponse.json({ success: true, contactId: result.contact?.id });
  } catch (error) {
    console.error("Lead submission error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
