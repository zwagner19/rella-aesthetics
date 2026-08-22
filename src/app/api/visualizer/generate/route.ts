import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import {
  applyDemoTreatmentEffect,
  addSimulationWatermark,
  blendConservative,
} from "@/lib/visualizer/conservative-blend";
import {
  bufferToDataUrl,
  extensionForMime,
  optionalBlobUpload,
  parseDataUrl,
} from "@/lib/visualizer/image-utils";
import { buildEditMaskPng, resolveZoneRegions } from "@/lib/visualizer/mask";
import { generateEditedImage } from "@/lib/visualizer/openai";
import { buildEditPrompt } from "@/lib/visualizer/prompts";
import {
  isValidBotoxZone,
  isValidIntensity,
  VISUALIZER_DISCLAIMER,
} from "@/lib/visualizer/treatments";
import type { BotoxZone, IntensityPreset, MaskRegion } from "@/lib/visualizer/types";

export const maxDuration = 60;

interface GenerateBody {
  image?: string;
  zones?: string[];
  intensity?: string;
  sessionId?: string;
  regions?: Partial<Record<BotoxZone, MaskRegion>>;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as GenerateBody;

    if (!body.image || !body.zones?.length) {
      return NextResponse.json(
        { error: "Image and at least one treatment zone are required" },
        { status: 400 }
      );
    }

    const zones = body.zones.filter((z): z is BotoxZone => isValidBotoxZone(z));
    if (!zones.length) {
      return NextResponse.json({ error: "Invalid treatment zones" }, { status: 400 });
    }

    const intensity: IntensityPreset =
      body.intensity && isValidIntensity(body.intensity) ? body.intensity : "subtle";

    const sessionId = body.sessionId ?? crypto.randomUUID();
    const { buffer, mimeType } = parseDataUrl(body.image);

    const meta = await sharp(buffer).metadata();
    const width = meta.width ?? 1024;
    const height = meta.height ?? 1024;
    const regions = resolveZoneRegions(zones, body.regions);
    const maskBuffer = await buildEditMaskPng(width, height, regions);

    const prompt = buildEditPrompt(zones, intensity);
    const editedRaw = await generateEditedImage(buffer, mimeType, maskBuffer, prompt);

    let resultBuffer: Buffer;
    let mode: "live" | "demo";

    if (editedRaw) {
      resultBuffer = await blendConservative(buffer, editedRaw, zones, intensity, body.regions);
      mode = "live";
    } else {
      resultBuffer = await applyDemoTreatmentEffect(buffer, zones, intensity, body.regions);
      mode = "demo";
    }

    resultBuffer = await addSimulationWatermark(resultBuffer);

    const ext = extensionForMime(mimeType);
    await optionalBlobUpload(buffer, `visualizer/${sessionId}/before.${ext}`, mimeType);
    await optionalBlobUpload(resultBuffer, `visualizer/${sessionId}/after.png`, "image/png");

    return NextResponse.json({
      beforeDataUrl: bufferToDataUrl(buffer, mimeType),
      afterDataUrl: bufferToDataUrl(resultBuffer, "image/png"),
      sessionId,
      mode,
      disclaimer: VISUALIZER_DISCLAIMER,
    });
  } catch (error) {
    console.error("[visualizer/generate]", error);
    const message = error instanceof Error ? error.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
