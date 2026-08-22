import { NextRequest, NextResponse } from "next/server";
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
import { getSharp } from "@/lib/visualizer/sharp-loader";
import {
  isValidBotoxZone,
  isValidIntensity,
  VISUALIZER_DISCLAIMER,
} from "@/lib/visualizer/treatments";
import type { BotoxZone, IntensityPreset, MaskRegion } from "@/lib/visualizer/types";

export const maxDuration = 60;
export const runtime = "nodejs";

interface GenerateBody {
  image?: string;
  zones?: string[];
  intensity?: string;
  sessionId?: string;
  regions?: Partial<Record<BotoxZone, MaskRegion>>;
}

interface GenerateOutcome {
  resultBuffer: Buffer;
  resultMime: string;
  mode: "live" | "demo";
}

/** Sharp-enhanced path for local/dev environments where native bindings load. */
async function generateWithSharp(
  buffer: Buffer,
  mimeType: string,
  zones: BotoxZone[],
  intensity: IntensityPreset,
  regionOverrides: Partial<Record<BotoxZone, MaskRegion>> | undefined,
  prompt: string
): Promise<GenerateOutcome | null> {
  const sharp = await getSharp();
  const meta = await sharp(buffer).metadata();
  const width = meta.width ?? 1024;
  const height = meta.height ?? 1024;
  const regions = resolveZoneRegions(zones, regionOverrides);
  const maskBuffer = await buildEditMaskPng(width, height, regions);
  const editedRaw = await generateEditedImage(buffer, mimeType, maskBuffer, prompt);

  if (editedRaw) {
    const blended = await blendConservative(buffer, editedRaw, zones, intensity, regionOverrides);
    const watermarked = await addSimulationWatermark(blended);
    return { resultBuffer: watermarked, resultMime: "image/png", mode: "live" };
  }

  const demo = await applyDemoTreatmentEffect(buffer, zones, intensity, regionOverrides);
  const watermarked = await addSimulationWatermark(demo);
  return { resultBuffer: watermarked, resultMime: "image/png", mode: "demo" };
}

/** Vercel-safe path: OpenAI edit only, no sharp native modules. */
async function generateWithoutSharp(
  buffer: Buffer,
  mimeType: string,
  zones: BotoxZone[],
  intensity: IntensityPreset,
  prompt: string
): Promise<GenerateOutcome> {
  const editedRaw = await generateEditedImage(buffer, mimeType, null, prompt);
  if (editedRaw) {
    return { resultBuffer: editedRaw, resultMime: "image/png", mode: "live" };
  }
  // Demo fallback: return original; UI applies subtle CSS treatment + watermark
  return { resultBuffer: buffer, resultMime: mimeType, mode: "demo" };
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
    const prompt = buildEditPrompt(zones, intensity);

    let outcome: GenerateOutcome | null = null;
    try {
      outcome = await generateWithSharp(buffer, mimeType, zones, intensity, body.regions, prompt);
    } catch (sharpError) {
      console.warn("[visualizer/generate] sharp unavailable, using OpenAI-only path:", sharpError);
    }

    if (!outcome) {
      outcome = await generateWithoutSharp(buffer, mimeType, zones, intensity, prompt);
    }

    const ext = extensionForMime(mimeType);
    await optionalBlobUpload(buffer, `visualizer/${sessionId}/before.${ext}`, mimeType);
    await optionalBlobUpload(
      outcome.resultBuffer,
      `visualizer/${sessionId}/after.${extensionForMime(outcome.resultMime)}`,
      outcome.resultMime
    );

    return NextResponse.json({
      beforeDataUrl: bufferToDataUrl(buffer, mimeType),
      afterDataUrl: bufferToDataUrl(outcome.resultBuffer, outcome.resultMime),
      sessionId,
      mode: outcome.mode,
      disclaimer: VISUALIZER_DISCLAIMER,
    });
  } catch (error) {
    console.error("[visualizer/generate]", error);
    const message = error instanceof Error ? error.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
