import OpenAI from "openai";
import sharp from "sharp";
import { buildAnalysisPrompt } from "@/lib/visualizer/prompts";
import { DEFAULT_ZONE_REGIONS } from "@/lib/visualizer/treatments";
import type { BotoxZone, FaceAnalysis, MaskRegion } from "@/lib/visualizer/types";
import { isValidBotoxZone } from "@/lib/visualizer/treatments";

function getOpenAIClient(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({ apiKey });
}

function defaultAnalysis(): FaceAnalysis {
  return {
    quality: "good",
    faceDetected: true,
    zones: ["forehead", "glabella", "crows-feet"],
    notes: "Face detected. For best results, use even lighting and a front-facing photo.",
  };
}

function parseAnalysisJson(raw: string): FaceAnalysis {
  const fallback = defaultAnalysis();
  try {
    const parsed = JSON.parse(raw) as Partial<FaceAnalysis> & {
      regions?: Record<string, MaskRegion>;
    };

    const zones = Array.isArray(parsed.zones)
      ? parsed.zones.filter((z): z is BotoxZone => isValidBotoxZone(String(z)))
      : fallback.zones;

    const quality =
      parsed.quality === "good" || parsed.quality === "fair" || parsed.quality === "poor"
        ? parsed.quality
        : fallback.quality;

    const regions: Partial<Record<BotoxZone, MaskRegion>> = {};
    if (parsed.regions) {
      for (const [key, value] of Object.entries(parsed.regions)) {
        if (isValidBotoxZone(key) && value && typeof value === "object") {
          regions[key] = value;
        }
      }
    }

    return {
      quality,
      faceDetected: parsed.faceDetected !== false,
      zones: zones.length ? zones : fallback.zones,
      notes: typeof parsed.notes === "string" ? parsed.notes : fallback.notes,
      regions: Object.keys(regions).length ? regions : undefined,
    };
  } catch {
    return fallback;
  }
}

export async function analyzeSelfie(
  imageBuffer: Buffer,
  mimeType: string
): Promise<FaceAnalysis> {
  const client = getOpenAIClient();
  if (!client) return defaultAnalysis();

  const pngBuffer = await sharp(imageBuffer).rotate().png().toBuffer();
  const dataUrl = `data:image/png;base64,${pngBuffer.toString("base64")}`;

  const response = await client.chat.completions.create({
    model: "gpt-4o",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: buildAnalysisPrompt() },
          { type: "image_url", image_url: { url: dataUrl } },
        ],
      },
    ],
    max_tokens: 500,
  });

  const content = response.choices[0]?.message?.content ?? "{}";
  return parseAnalysisJson(content);
}

export async function generateEditedImage(
  imageBuffer: Buffer,
  mimeType: string,
  maskBuffer: Buffer,
  prompt: string
): Promise<Buffer | null> {
  const client = getOpenAIClient();
  if (!client) return null;

  const pngImage = await sharp(imageBuffer).rotate().png().toBuffer();
  const pngMask = await sharp(maskBuffer).png().toBuffer();

  const imageFile = new File([pngImage], "selfie.png", { type: "image/png" });
  const maskFile = new File([pngMask], "mask.png", { type: "image/png" });

  try {
    const result = await client.images.edit({
      model: "gpt-image-1",
      image: imageFile,
      mask: maskFile,
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

export function regionsForZones(
  zones: BotoxZone[],
  analysisRegions?: Partial<Record<BotoxZone, MaskRegion>>
): MaskRegion[] {
  const regions: MaskRegion[] = [];
  for (const zone of zones) {
    if (analysisRegions?.[zone]) {
      regions.push(analysisRegions[zone]!);
    } else {
      regions.push(...DEFAULT_ZONE_REGIONS[zone]);
    }
  }
  return regions;
}
