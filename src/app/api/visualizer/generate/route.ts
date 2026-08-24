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
import {
  generateEditedImage,
  getOpenAIRuntimeStatus,
  normalizeTreatmentType,
} from "@/lib/visualizer/openai";
import { buildEditPrompt } from "@/lib/visualizer/prompts";
import { pickReferenceMatch } from "@/lib/visualizer/references";
import {
  isValidIntensity,
  isValidTreatmentZone,
  VISUALIZER_DISCLAIMER,
} from "@/lib/visualizer/treatments";
import type {
  IntensityPreset,
  MaskRegion,
  TreatmentType,
  TreatmentZoneId,
} from "@/lib/visualizer/types";
import {
  prepareWorkingImage,
  type OpenAIImageSize,
  type WorkingImage,
} from "@/lib/visualizer/working-image";

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
  beforeBuffer: Buffer;
  beforeMime: string;
  resultBuffer: Buffer;
  resultMime: string;
  mode: "live" | "demo";
  providerError?: string;
}

async function generateAligned(
  working: WorkingImage,
  treatmentType: TreatmentType,
  zones: TreatmentZoneId[],
  intensity: IntensityPreset,
  regionOverrides: Partial<Record<TreatmentZoneId, MaskRegion>> | undefined,
  prompt: string
): Promise<GenerateOutcome> {
  const regions = resolveZoneRegions(treatmentType, zones, regionOverrides);
  const maskBuffer = await buildEditMaskPng(working.width, working.height, regions);
  const edited = await generateEditedImage(
    working.buffer,
    working.mimeType,
    maskBuffer,
    prompt,
    working.size
  );

  if (edited.buffer) {
    const blended = await blendConservative(
      working.buffer,
      edited.buffer,
      treatmentType,
      zones,
      intensity,
      regionOverrides
    );
    const watermarked = await addSimulationWatermark(blended);
    return {
      beforeBuffer: working.buffer,
      beforeMime: working.mimeType,
      resultBuffer: watermarked,
      resultMime: "image/png",
      mode: "live",
    };
  }

  const demo = await applyDemoTreatmentEffect(
    working.buffer,
    treatmentType,
    zones,
    intensity,
    regionOverrides
  );
  const watermarked = await addSimulationWatermark(demo);
  return {
    beforeBuffer: working.buffer,
    beforeMime: working.mimeType,
    resultBuffer: watermarked,
    resultMime: "image/png",
    mode: "demo",
    providerError: edited.providerError,
  };
}

async function generateWithoutMask(
  working: WorkingImage,
  prompt: string,
  size: OpenAIImageSize
): Promise<GenerateOutcome> {
  const edited = await generateEditedImage(
    working.buffer,
    working.mimeType,
    null,
    prompt,
    size
  );
  if (edited.buffer) {
    return {
      beforeBuffer: working.buffer,
      beforeMime: working.mimeType,
      resultBuffer: edited.buffer,
      resultMime: "image/png",
      mode: "live",
    };
  }
  return {
    beforeBuffer: working.buffer,
    beforeMime: working.mimeType,
    resultBuffer: working.buffer,
    resultMime: working.mimeType,
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
    const { buffer } = parseDataUrl(body.image);
    const working = await prepareWorkingImage(buffer);
    const referenceMatch = pickReferenceMatch(treatmentType, zones);
    const prompt = buildEditPrompt(
      treatmentType,
      zones,
      intensity,
      referenceMatch?.styleNotes
    );

    let outcome: GenerateOutcome;
    try {
      outcome = await generateAligned(
        working,
        treatmentType,
        zones,
        intensity,
        body.regions,
        prompt
      );
    } catch (sharpError) {
      console.warn("[visualizer/generate] sharp path failed, OpenAI-only:", sharpError);
      outcome = await generateWithoutMask(working, prompt, working.size);
    }

    await optionalBlobUpload(
      outcome.beforeBuffer,
      `visualizer/${sessionId}/before.${extensionForMime(outcome.beforeMime)}`,
      outcome.beforeMime
    );
    await optionalBlobUpload(
      outcome.resultBuffer,
      `visualizer/${sessionId}/after.${extensionForMime(outcome.resultMime)}`,
      outcome.resultMime
    );

    return NextResponse.json({
      beforeDataUrl: bufferToDataUrl(outcome.beforeBuffer, outcome.beforeMime),
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
