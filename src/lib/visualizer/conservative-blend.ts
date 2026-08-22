import { getSharp } from "./sharp-loader";
import { WATERMARK_LABEL } from "./brand";
import type { IntensityPreset } from "./types";
import { INTENSITY_BLEND } from "./treatments";
import { buildBlendMaskPng, resolveZoneRegions } from "./mask";
import type { BotoxZone, MaskRegion } from "./types";

export async function blendConservative(
  originalBuffer: Buffer,
  editedBuffer: Buffer,
  zones: BotoxZone[],
  intensity: IntensityPreset,
  regionOverrides?: Partial<Record<BotoxZone, MaskRegion>>
): Promise<Buffer> {
  const sharp = await getSharp();
  const meta = await sharp(originalBuffer).metadata();
  const width = meta.width ?? 1024;
  const height = meta.height ?? 1024;

  const regions = resolveZoneRegions(zones, regionOverrides);
  const editWeight = INTENSITY_BLEND[intensity];

  const [original, edited, maskPng] = await Promise.all([
    sharp(originalBuffer).resize(width, height, { fit: "cover" }).ensureAlpha().raw().toBuffer(),
    sharp(editedBuffer).resize(width, height, { fit: "cover" }).ensureAlpha().raw().toBuffer(),
    buildBlendMaskPng(width, height, regions),
  ]);

  const maskRaw = await sharp(maskPng).resize(width, height).greyscale().raw().toBuffer();
  const channels = 4;
  const blended = Buffer.alloc(original.length);

  for (let i = 0; i < original.length; i += channels) {
    const maskValue = maskRaw[i] ?? 0;
    const localWeight = (maskValue / 255) * editWeight;
    for (let c = 0; c < 3; c++) {
      const orig = original[i + c] ?? 0;
      const edit = edited[i + c] ?? 0;
      blended[i + c] = Math.round(orig * (1 - localWeight) + edit * localWeight);
    }
    blended[i + 3] = original[i + 3] ?? 255;
  }

  return sharp(blended, { raw: { width, height, channels } }).png().toBuffer();
}

/** Demo fallback when OpenAI is unavailable: subtle blur in treatment zones only. */
export async function applyDemoTreatmentEffect(
  originalBuffer: Buffer,
  zones: BotoxZone[],
  intensity: IntensityPreset,
  regionOverrides?: Partial<Record<BotoxZone, MaskRegion>>
): Promise<Buffer> {
  const sharp = await getSharp();
  const meta = await sharp(originalBuffer).metadata();
  const width = meta.width ?? 1024;
  const height = meta.height ?? 1024;

  const blurSigma = intensity === "subtle" ? 1.2 : 2;
  const regions = resolveZoneRegions(zones, regionOverrides);

  const [base, blurred, maskPng] = await Promise.all([
    sharp(originalBuffer).resize(width, height, { fit: "cover" }).ensureAlpha().raw().toBuffer(),
    sharp(originalBuffer)
      .resize(width, height, { fit: "cover" })
      .blur(blurSigma)
      .ensureAlpha()
      .raw()
      .toBuffer(),
    buildBlendMaskPng(width, height, regions),
  ]);

  const maskRaw = await sharp(maskPng).resize(width, height).greyscale().raw().toBuffer();
  const editWeight = INTENSITY_BLEND[intensity] * 0.5;
  const channels = 4;
  const blended = Buffer.alloc(base.length);

  for (let i = 0; i < base.length; i += channels) {
    const maskValue = maskRaw[i] ?? 0;
    const localWeight = (maskValue / 255) * editWeight;
    for (let c = 0; c < 3; c++) {
      const orig = base[i + c] ?? 0;
      const blur = blurred[i + c] ?? 0;
      blended[i + c] = Math.round(orig * (1 - localWeight) + blur * localWeight);
    }
    blended[i + 3] = base[i + 3] ?? 255;
  }

  return sharp(blended, { raw: { width, height, channels } }).png().toBuffer();
}

export async function addSimulationWatermark(imageBuffer: Buffer): Promise<Buffer> {
  const sharp = await getSharp();
  const meta = await sharp(imageBuffer).metadata();
  const width = meta.width ?? 1024;
  const height = meta.height ?? 1024;
  const fontSize = Math.max(14, Math.round(width * 0.028));

  const labelWidth = Math.max(width * 0.48, fontSize * WATERMARK_LABEL.length * 0.55);
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect x="${width * 0.04}" y="${height * 0.88}" width="${labelWidth}" height="${fontSize + 16}" fill="rgba(0,0,0,0.45)" rx="4"/>
    <text x="${width * 0.06}" y="${height * 0.88 + fontSize + 2}" fill="white" font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="700" letter-spacing="1">${WATERMARK_LABEL}</text>
  </svg>`;

  return sharp(imageBuffer)
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .png()
    .toBuffer();
}
