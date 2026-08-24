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
import { generateEditedImage, getOpenAIRuntimeStatus, normalizeTreatmentType } from "@/lib/visualizer/openai";
import { buildEditPrompt } from "@/lib/visualizer/prompts";
import { pickReferenceMatch } from "@/lib/visualizer/references";
import { getSharp } from "@/lib/visualizer/sharp-loader";
import {
  isValidIntensity,
  isValidTreatmentType,
  isValidTreatmentZone,
  VISUALIZER_DISCLAIMER,
} from "@/lib/visualizer/treatments";
import type { IntensityPreset, MaskRegion, TreatmentType, TreatmentZoneId } from "@/lib/visualizer/types";

export const maxDuration = 60;
export const runtime = "nodejs";

interface GenerateBody {
  image?: string;
  treatmentType?: string;
  zones?: string[];
  intensity?: string;
  sessionId?: string;
  regions?: Partial<Record<TreatmentZoneId, MaskRegion>>;
}

interface GenerateOutcome {
  resultBuffer: Buffer;
  resultMime: string;
  mode: "live" | "demo";
  providerError?: string;
}

async function generateWithSharp(
  buffer: Buffer,
  mimeType: string,
  treatmentType: TreatmentType,
  zones: TreatmentZoneId[],
  intensity: IntensityPreset,
  regionOverrides: Partial<Record<TreatmentZoneId, MaskRegion>> | undefined,
  prompt: string
): Promise<GenerateOutcome | null> {
  const sharp = await getSharp();
  const meta = await sharp(buffer).metadata();
  const width = meta.width ?? 1024;
  const height = meta.height ?? 1024;
  const regions = resolveZoneRegions(treatmentType, zones, regionOverrides);
  const maskBuffer = await buildEditMaskPng(width, height, regions);
  const edited = await generateEditedImage(buffer, mimeType, maskBuffer, prompt);

  if (edited.buffer) {
    const blended = await blendConservative(
      buffer,
      edited.buffer,
      treatmentType,
      zones,
      intensity,
      regionOverrides
    );
    const watermarked = await addSimulationWatermark(blended);
    return { resultBuffer: watermarked, resultMime: "image/png", mode: "live" };
  }

  const demo = await applyDemoTreatmentEffect(
    buffer,
    treatmentType,
    zones,
    intensity,
    regionOverrides
  );
  const watermarked = await addSimulationWatermark(demo);
  return {
    resultBuffer: watermarked,
    resultMime: "image/png",
    mode: "demo",
    providerError: edited.providerError,
  };
}

async function generateWithoutSharp(
  buffer: Buffer,
  mimeType: string,
  prompt: string
): Promise<GenerateOutcome> {
  const edited = await generateEditedImage(buffer, mimeType, null, prompt);
  if (edited.buffer) {
    return { resultBuffer: edited.buffer, resultMime: "image/png", mode: "live" };
  }
  return {
    resultBuffer: buffer,
    resultMime: mimeType,
    mode: "demo",
    providerError: edited.providerError,
  };
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

    const treatmentType = normalizeTreatmentType(body.treatmentType);
    const zones = body.zones.filter((z): z is TreatmentZoneId =>
      isValidTreatmentZone(treatmentType, z)
    );
    if (!zones.length) {
      return NextResponse.json({ error: "Invalid treatment zones" }, { status: 400 });
    }

    const intensity: IntensityPreset =
      body.intensity && isValidIntensity(body.intensity) ? body.intensity : "subtle";

    const sessionId = body.sessionId ?? crypto.randomUUID();
    const { buffer, mimeType } = parseDataUrl(body.image);
    const referenceMatch = pickReferenceMatch(treatmentType, zones);
    const prompt = buildEditPrompt(
      treatmentType,
      zones,
      intensity,
      referenceMatch?.styleNotes
    );

    let outcome: GenerateOutcome | null = null;
    try {
      outcome = await generateWithSharp(
        buffer,
        mimeType,
        treatmentType,
        zones,
        intensity,
        body.regions,
        prompt
      );
    } catch (sharpError) {
      console.warn("[visualizer/generate] sharp unavailable, using OpenAI-only path:", sharpError);
    }

    if (!outcome) {
      outcome = await generateWithoutSharp(buffer, mimeType, prompt);
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
      treatmentType,
      calibrated: Boolean(referenceMatch),
      referenceId: referenceMatch?.id ?? null,
      openai: getOpenAIRuntimeStatus(),
      ...(outcome.providerError ? { providerError: outcome.providerError } : {}),
      disclaimer: VISUALIZER_DISCLAIMER,
    });
  } catch (error) {
    console.error("[visualizer/generate]", error);
    const message = error instanceof Error ? error.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
