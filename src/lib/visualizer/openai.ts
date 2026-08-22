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

function getOpenAIClient(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({ apiKey });
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

export async function analyzeSelfie(
  imageBuffer: Buffer,
  mimeType: string,
  treatmentType: TreatmentType
): Promise<FaceAnalysis> {
  const client = getOpenAIClient();
  if (!client) return defaultAnalysis(treatmentType);

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
    return parseAnalysisJson(treatmentType, content);
  } catch (error) {
    console.error("[visualizer] OpenAI analysis failed:", error);
    return defaultAnalysis(treatmentType);
  }
}

export async function generateEditedImage(
  imageBuffer: Buffer,
  mimeType: string,
  maskBuffer: Buffer | null,
  prompt: string
): Promise<Buffer | null> {
  const client = getOpenAIClient();
  if (!client) return null;

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
      size: "1024x1024",
    });

    const b64 = result.data?.[0]?.b64_json;
    if (!b64) return null;
    return Buffer.from(b64, "base64");
  } catch (error) {
    console.error("[visualizer] OpenAI edit failed:", error);
    return null;
  }
}

export function normalizeTreatmentType(value: string | undefined): TreatmentType {
  if (value && isValidTreatmentType(value)) return value;
  return "botox";
}
