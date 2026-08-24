import type { OpenAIImageSize } from "@/lib/visualizer/working-image";
import OpenAI from "openai";
import {
  buildAnalysisPrompt,
  parseAnalysisZones,
} from "@/lib/visualizer/prompts";
import {
  getDefaultZonesForTreatment,
  isValidTreatmentType,
} from "@/lib/visualizer/treatments";
import type {
  FaceAnalysis,
  MaskRegion,
  TreatmentType,
  TreatmentZoneId,
} from "@/lib/visualizer/types";

export interface OpenAIRuntimeStatus {
  configured: boolean;
  keyLength: number;
  /** Safe prefix only, e.g. "sk-proj" — never the secret. */
  keyPrefix: string | null;
}

export function getOpenAIRuntimeStatus(): OpenAIRuntimeStatus {
  const apiKey = process.env.OPENAI_API_KEY?.trim() ?? "";
  const configured = apiKey.length > 0;
  let keyPrefix: string | null = null;
  if (configured) {
    const parts = apiKey.split("-");
    keyPrefix = parts.length >= 2 ? `${parts[0]}-${parts[1]}` : apiKey.slice(0, 6);
  }
  return { configured, keyLength: apiKey.length, keyPrefix };
}

function getOpenAIClient(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) return null;
  return new OpenAI({ apiKey });
}

function summarizeOpenAIError(error: unknown): string {
  if (!error || typeof error !== "object") {
    return error instanceof Error ? error.message : "Unknown OpenAI error";
  }
  const err = error as {
    message?: string;
    status?: number;
    code?: string;
    type?: string;
    error?: { message?: string; code?: string; type?: string };
  };
  const message = err.error?.message ?? err.message ?? "OpenAI request failed";
  const code = err.error?.code ?? err.code;
  const status = err.status;
  const parts = [message];
  if (status) parts.push(`status=${status}`);
  if (code) parts.push(`code=${code}`);
  return parts.join(" | ");
}

function defaultAnalysis(treatmentType: TreatmentType): FaceAnalysis {
  return {
    quality: "good",
    faceDetected: true,
    treatmentType,
    zones: getDefaultZonesForTreatment(treatmentType),
    notes: "Face detected. For best results, use even lighting and a front-facing photo.",
  };
}

function parseAnalysisJson(
  treatmentType: TreatmentType,
  raw: string
): FaceAnalysis {
  const fallback = defaultAnalysis(treatmentType);
  try {
    const parsed = JSON.parse(raw) as Partial<FaceAnalysis> & {
      regions?: Record<string, MaskRegion>;
    };

    const zones = parseAnalysisZones(treatmentType, parsed.zones);
    const quality =
      parsed.quality === "good" || parsed.quality === "fair" || parsed.quality === "poor"
        ? parsed.quality
        : fallback.quality;

    const regions: Partial<Record<TreatmentZoneId, MaskRegion>> = {};
    if (parsed.regions) {
      for (const [key, value] of Object.entries(parsed.regions)) {
        if (value && typeof value === "object") {
          regions[key as TreatmentZoneId] = value;
        }
      }
    }

    return {
      quality,
      faceDetected: parsed.faceDetected !== false,
      treatmentType,
      zones: zones.length ? zones : fallback.zones,
      notes: typeof parsed.notes === "string" ? parsed.notes : fallback.notes,
      regions: Object.keys(regions).length ? regions : undefined,
    };
  } catch {
    return fallback;
  }
}

function bufferToDataUrl(buffer: Buffer, mimeType: string): string {
  return `data:${mimeType};base64,${buffer.toString("base64")}`;
}

function mimeToExtension(mimeType: string): string {
  if (mimeType.includes("png")) return "png";
  if (mimeType.includes("webp")) return "webp";
  return "jpg";
}

export interface AnalyzeSelfieResult {
  analysis: FaceAnalysis;
  providerError?: string;
}

export async function analyzeSelfie(
  imageBuffer: Buffer,
  mimeType: string,
  treatmentType: TreatmentType
): Promise<AnalyzeSelfieResult> {
  const client = getOpenAIClient();
  if (!client) {
    return {
      analysis: defaultAnalysis(treatmentType),
      providerError: "OPENAI_API_KEY is not set in this runtime",
    };
  }

  try {
    const dataUrl = bufferToDataUrl(imageBuffer, mimeType);

    const response = await client.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: buildAnalysisPrompt(treatmentType) },
            { type: "image_url", image_url: { url: dataUrl } },
          ],
        },
      ],
      max_tokens: 500,
    });

    const content = response.choices[0]?.message?.content ?? "{}";
    return { analysis: parseAnalysisJson(treatmentType, content) };
  } catch (error) {
    console.error("[visualizer] OpenAI analysis failed:", error);
    return {
      analysis: defaultAnalysis(treatmentType),
      providerError: summarizeOpenAIError(error),
    };
  }
}

export interface GenerateEditedImageResult {
  buffer: Buffer | null;
  providerError?: string;
}

export async function generateEditedImage(
  imageBuffer: Buffer,
  mimeType: string,
  maskBuffer: Buffer | null,
  prompt: string,
  size: OpenAIImageSize = "1024x1024"
): Promise<GenerateEditedImageResult> {
  const client = getOpenAIClient();
  if (!client) {
    return { buffer: null, providerError: "OPENAI_API_KEY is not set in this runtime" };
  }

  try {
    const ext = mimeToExtension(mimeType);
    const imageFile = new File([new Uint8Array(imageBuffer)], `selfie.${ext}`, {
      type: mimeType,
    });

    const result = await client.images.edit({
      model: "gpt-image-1",
      image: imageFile,
      ...(maskBuffer
        ? { mask: new File([new Uint8Array(maskBuffer)], "mask.png", { type: "image/png" }) }
        : {}),
      prompt,
      size,
    });

    const b64 = result.data?.[0]?.b64_json;
    if (!b64) {
      return { buffer: null, providerError: "OpenAI edit returned no image data" };
    }
    return { buffer: Buffer.from(b64, "base64") };
  } catch (error) {
    console.error("[visualizer] OpenAI edit failed:", error);
    return { buffer: null, providerError: summarizeOpenAIError(error) };
  }
}

export function normalizeTreatmentType(value: string | undefined): TreatmentType {
  if (value && isValidTreatmentType(value)) return value;
  return "botox";
}
