import { NextRequest, NextResponse } from "next/server";
import {
  GHL_API_BASE,
  GHL_API_VERSION,
  buildGhlContactBody,
} from "@/lib/ghl";
import { buildLeadSource, scoreVisualizerLead } from "@/lib/visualizer/lead-scoring";
import {
  isValidBotoxZone,
  isValidIntensity,
} from "@/lib/visualizer/treatments";
import type { BotoxZone, IntensityPreset, VisualizerLeadPayload } from "@/lib/visualizer/types";

export const runtime = "nodejs";

const GHL_API_KEY = process.env.GHL_API_KEY ?? "";
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID ?? "";
const GHL_CF_SERVICE = process.env.GHL_CUSTOM_FIELD_SERVICE_ID ?? "";
const GHL_CF_MESSAGE = process.env.GHL_CUSTOM_FIELD_MESSAGE_ID ?? "";
const GHL_CF_SESSION = process.env.GHL_CUSTOM_FIELD_VISUALIZER_SESSION_ID ?? "";

function parsePayload(body: Record<string, unknown>): VisualizerLeadPayload | null {
  const zones = Array.isArray(body.zones)
    ? body.zones.filter((z): z is BotoxZone => isValidBotoxZone(String(z)))
    : [];

  const intensityRaw = String(body.intensity ?? "subtle");
  const intensity: IntensityPreset = isValidIntensity(intensityRaw) ? intensityRaw : "subtle";

  const name = String(body.name ?? "").trim();
  const email = body.email ? String(body.email).trim() : undefined;
  const phone = body.phone ? String(body.phone).trim() : undefined;
  const sessionId = String(body.sessionId ?? "").trim();
  const consent = body.consent === true;

  if (!name || !sessionId || !consent || !zones.length) return null;
  if (!email && !phone) return null;

  return {
    sessionId,
    name,
    email,
    phone,
    zones,
    intensity,
    goal: body.goal ? String(body.goal) : undefined,
    timeline: body.timeline ? String(body.timeline) : undefined,
    budget: body.budget ? String(body.budget) : undefined,
    consent,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Record<string, unknown>;
    const payload = parsePayload(body);

    if (!payload) {
      return NextResponse.json(
        { error: "Name, contact info, consent, session, and zones are required" },
        { status: 400 }
      );
    }

    const { score, tags } = scoreVisualizerLead(payload);
    const source = buildLeadSource(payload);

    if (!GHL_API_KEY || !GHL_LOCATION_ID) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[visualizer/lead] GHL not configured — logging locally");
      }
      console.log("Visualizer lead (no GHL):", { ...payload, score, tags });
      return NextResponse.json({
        success: true,
        mode: "local",
        score,
        hint: "Configure GHL_API_KEY and GHL_LOCATION_ID to create contacts",
      });
    }

    const nameParts = payload.name.split(/\s+/);
    const firstName = nameParts[0] || "Visualizer";
    const lastName = nameParts.slice(1).join(" ") || "Lead";

    const customFields: { id: string; value: string }[] = [];
    if (GHL_CF_SERVICE) {
      customFields.push({ id: GHL_CF_SERVICE, value: "Botox & Dysport" });
    }
    if (GHL_CF_MESSAGE) {
      const summary = [
        payload.goal && `Goal: ${payload.goal}`,
        payload.timeline && `Timeline: ${payload.timeline}`,
        payload.budget && `Budget: ${payload.budget}`,
        `Zones: ${payload.zones.join(", ")}`,
        `Score: ${score}/5`,
      ]
        .filter(Boolean)
        .join(" | ");
      customFields.push({ id: GHL_CF_MESSAGE, value: summary });
    }
    if (GHL_CF_SESSION) {
      customFields.push({ id: GHL_CF_SESSION, value: payload.sessionId });
    }

    const ghlBody = buildGhlContactBody({
      firstName,
      lastName,
      email: payload.email,
      phone: payload.phone,
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
      body: JSON.stringify(ghlBody),
    });

    const responseText = await ghlRes.text();
    let result: { contact?: { id?: string }; id?: string; message?: string } = {};
    try {
      result = responseText ? JSON.parse(responseText) : {};
    } catch {
      result = {};
    }

    if (!ghlRes.ok) {
      console.error("GHL visualizer lead error:", ghlRes.status, responseText);
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

    return NextResponse.json({
      success: true,
      contactId: result.contact?.id ?? result.id,
      score,
    });
  } catch (error) {
    console.error("[visualizer/lead]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
