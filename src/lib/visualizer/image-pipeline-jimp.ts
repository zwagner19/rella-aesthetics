import { Jimp, rgbaToInt } from "jimp";
import type { IntensityPreset, MaskRegion, TreatmentType, TreatmentZoneId } from "./types";
import { INTENSITY_BLEND, resolveZoneRegions } from "./treatments";
import { WATERMARK_LABEL } from "./brand";
import type { OpenAIImageSize, WorkingImage } from "./working-image";
import { pickEditSize } from "./working-image";

function sizeToDims(size: OpenAIImageSize): { width: number; height: number } {
  switch (size) {
    case "1024x1024":
      return { width: 1024, height: 1024 };
    case "1024x1536":
      return { width: 1024, height: 1536 };
    case "1536x1024":
      return { width: 1536, height: 1024 };
    default: {
      const _exhaustive: never = size;
      return _exhaustive;
    }
  }
}

export async function prepareWorkingImageJimp(input: Buffer): Promise<WorkingImage> {
  const image = await Jimp.read(input);
  const size = pickEditSize(image.width, image.height);
  const { width, height } = sizeToDims(size);
  image.cover({ w: width, h: height });
  const buffer = await image.getBuffer("image/png");
  return { buffer, mimeType: "image/png", width, height, size };
}

/** OpenAI mask: alpha 0 = edit, opaque = preserve. */
export async function buildEditMaskJimp(
  width: number,
  height: number,
  regions: MaskRegion[]
): Promise<Buffer> {
  const mask = new Jimp({ width, height, color: rgbaToInt(0, 0, 0, 255) });

  for (const region of regions) {
    const cx = region.cx * width;
    const cy = region.cy * height;
    const rx = region.rx * width;
    const ry = region.ry * height;
    mask.scan(0, 0, width, height, function (x, y, idx) {
      const dx = (x - cx) / rx;
      const dy = (y - cy) / ry;
      if (dx * dx + dy * dy <= 1) {
        // Transparent = editable for OpenAI
        this.bitmap.data[idx + 3] = 0;
      }
    });
  }

  return mask.getBuffer("image/png");
}

async function ellipseWeightMap(
  width: number,
  height: number,
  regions: MaskRegion[]
): Promise<Float32Array> {
  const weights = new Float32Array(width * height);
  for (const region of regions) {
    const cx = region.cx * width;
    const cy = region.cy * height;
    const rx = Math.max(region.rx * width, 1);
    const ry = Math.max(region.ry * height, 1);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const dx = (x - cx) / rx;
        const dy = (y - cy) / ry;
        const d = dx * dx + dy * dy;
        if (d <= 1) {
          // Soft edge: 1 at center → 0 at rim
          const edge = Math.max(0, 1 - Math.sqrt(d));
          const soft = edge * edge * (3 - 2 * edge);
          const i = y * width + x;
          weights[i] = Math.max(weights[i] ?? 0, soft);
        }
      }
    }
  }
  return weights;
}

export async function blendConservativeJimp(
  originalBuffer: Buffer,
  editedBuffer: Buffer,
  treatmentType: TreatmentType,
  zones: TreatmentZoneId[],
  intensity: IntensityPreset,
  regionOverrides?: Partial<Record<TreatmentZoneId, MaskRegion>>
): Promise<Buffer> {
  const original = await Jimp.read(originalBuffer);
  const edited = await Jimp.read(editedBuffer);
  const width = original.width;
  const height = original.height;
  edited.resize({ w: width, h: height });

  const regions = resolveZoneRegions(treatmentType, zones, regionOverrides);
  const weights = await ellipseWeightMap(width, height, regions);
  const editWeight = INTENSITY_BLEND[intensity];

  original.scan(0, 0, width, height, function (x, y, idx) {
    const w = (weights[y * width + x] ?? 0) * editWeight;
    if (w <= 0) return;
    for (let c = 0; c < 3; c++) {
      const o = this.bitmap.data[idx + c] ?? 0;
      const e = edited.bitmap.data[idx + c] ?? o;
      this.bitmap.data[idx + c] = Math.round(o * (1 - w) + e * w);
    }
  });

  return original.getBuffer("image/png");
}

export async function addSimulationWatermarkJimp(imageBuffer: Buffer): Promise<Buffer> {
  // Keep a light corner mark via opacity tint — text rendering in jimp is limited.
  // The UI slider also shows a SIMULATION badge; this keeps the file marked.
  const image = await Jimp.read(imageBuffer);
  const badge = new Jimp({
    width: Math.max(160, Math.round(image.width * 0.28)),
    height: Math.max(28, Math.round(image.height * 0.035)),
    color: rgbaToInt(0, 0, 0, 140),
  });
  image.composite(badge, Math.round(image.width * 0.04), Math.round(image.height * 0.9));
  void WATERMARK_LABEL;
  return image.getBuffer("image/png");
}

export async function applyDemoTreatmentEffectJimp(
  originalBuffer: Buffer,
  treatmentType: TreatmentType,
  zones: TreatmentZoneId[],
  intensity: IntensityPreset,
  regionOverrides?: Partial<Record<TreatmentZoneId, MaskRegion>>
): Promise<Buffer> {
  const original = await Jimp.read(originalBuffer);
  const blurred = original.clone().gaussian(intensity === "subtle" ? 1 : 2);
  return blendConservativeJimp(
    await original.getBuffer("image/png"),
    await blurred.getBuffer("image/png"),
    treatmentType,
    zones,
    intensity,
    regionOverrides
  );
}
