import { getSharp } from "./sharp-loader";

export type OpenAIImageSize = "1024x1024" | "1024x1536" | "1536x1024";

export interface WorkingImage {
  buffer: Buffer;
  mimeType: "image/png";
  width: number;
  height: number;
  size: OpenAIImageSize;
}

/** Pick the OpenAI edit size that best matches the selfie aspect ratio. */
export function pickEditSize(width: number, height: number): OpenAIImageSize {
  const ratio = width / height;
  if (ratio < 0.85) return "1024x1536"; // portrait
  if (ratio > 1.15) return "1536x1024"; // landscape
  return "1024x1024";
}

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

/**
 * Center-crop the selfie into a fixed OpenAI canvas so before/after share
 * identical framing (fixes drag-bar misalignment).
 */
export async function prepareWorkingImage(input: Buffer): Promise<WorkingImage> {
  const sharp = await getSharp();
  const meta = await sharp(input).metadata();
  const srcW = meta.width ?? 1024;
  const srcH = meta.height ?? 1024;
  const size = pickEditSize(srcW, srcH);
  const { width, height } = sizeToDims(size);

  const buffer = await sharp(input)
    .rotate() // honor EXIF orientation
    .resize(width, height, { fit: "cover", position: "centre" })
    .png()
    .toBuffer();

  return { buffer, mimeType: "image/png", width, height, size };
}
