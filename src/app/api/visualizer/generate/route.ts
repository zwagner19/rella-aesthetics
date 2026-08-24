import { Jimp } from "jimp";
import { NextRequest, NextResponse } from "next/server";
import {
  bufferToDataUrl,
  extensionForMime,
  optionalBlobUpload,
  parseDataUrl,
} from "@/lib/visualizer/image-utils";
import {
  addSimulationWatermarkJimp,
  applyDemoTreatmentEffectJimp,
  blendConservativeJimp,
  buildEditMaskJimp,
} from "@/lib/visualizer/image-pipeline-jimp";
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
  resolveZoneRegions,
  VISUALIZER_DISCLAIMER,
} from "@/lib/visualizer/treatments";
import type {
  IntensityPreset,
  MaskRegion,
  TreatmentType,
  TreatmentZoneId,
} from "@/lib/visualizer/types";
import type { WorkingImage } from "@/lib/visualizer/working-image";

export const maxDuration = 60;
export const runtime = "nodejs";

const EDIT_SIZE = 1024;

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

async function prepareSquareWorkingImage(input: Buffer): Promise<WorkingImage> {
  const image = await Jimp.read(input);
  image.cover({ w: EDIT_SIZE, h: EDIT_SIZE });
  const buffer = await image.getBuffer("image/png");
  return {
    buffer,
    mimeType: "image/png",
    width: EDIT_SIZE,
    height: EDIT_SIZE,
    size: "1024x1024",
  };
}

async function generateMasked(
  working: WorkingImage,
  treatmentType: TreatmentType,
  zones: TreatmentZoneId[],
  intensity: IntensityPreset,
  regionOverrides: Partial<Record<TreatmentZoneId, MaskRegion>> | undefined,
  prompt: string
): Promise<GenerateOutcome> {
  const regions = resolveZoneRegions(treatmentType, zones, regionOverrides);
  const maskBuffer = await buildEditMaskJimp(working.width, working.height, regions);
  const edited = await generateEditedImage(
    working.buffer,
    working.mimeType,
    maskBuffer,
    prompt,
    working.size
  );

  if (edited.buffer) {
    const blended = await blendConservativeJimp(
      working.buffer,
      edited.buffer,
      treatmentType,
      zones,
      intensity,
      regionOverrides
    );
    const watermarked = await addSimulationWatermarkJimp(blended);
    return {
      beforeBuffer: working.buffer,
      beforeMime: working.mimeType,
      resultBuffer: watermarked,
      resultMime: "image/png",
      mode: "live",
    };
  }

  const demo = await applyDemoTreatmentEffectJimp(
    working.buffer,
    treatmentType,
    zones,
    intensity,
    regionOverrides
  );
  const watermarked = await addSimulationWatermarkJimp(demo);
  return {
    beforeBuffer: working.buffer,
    beforeMime: working.mimeType,
    resultBuffer: watermarked,
    resultMime: "image/png",
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
    const working = await prepareSquareWorkingImage(buffer);
    const referenceMatch = pickReferenceMatch(treatmentType, zones);
    const prompt = buildEditPrompt(
      treatmentType,
      zones,
      intensity,
      referenceMatch?.styleNotes
    );

    const outcome = await generateMasked(
      working,
      treatmentType,
      zones,
      intensity,
      body.regions,
      prompt
    );

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
