/** Client-side image compression before API upload (avoids 413 on Vercel). */

const WORKING_SIZE = 1024;
const JPEG_QUALITY = 0.85;
/** Target max base64 payload ~1.5MB to stay under Vercel's ~4.5MB function limit. */
const TARGET_MAX_BYTES = 1_200_000;

export interface CompressOptions {
  quality?: number;
  targetMaxBytes?: number;
}

/**
 * Center-cover-crop to a 1024×1024 canvas so before/after share identical
 * framing with OpenAI gpt-image-1 edit output.
 */
export async function compressImageForUpload(
  dataUrl: string,
  options: CompressOptions = {}
): Promise<string> {
  const quality = options.quality ?? JPEG_QUALITY;
  const targetMaxBytes = options.targetMaxBytes ?? TARGET_MAX_BYTES;

  const img = await loadImage(dataUrl);
  const canvas = document.createElement("canvas");
  canvas.width = WORKING_SIZE;
  canvas.height = WORKING_SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not prepare image for upload");

  const scale = Math.max(WORKING_SIZE / img.width, WORKING_SIZE / img.height);
  const drawW = img.width * scale;
  const drawH = img.height * scale;
  const dx = (WORKING_SIZE - drawW) / 2;
  const dy = (WORKING_SIZE - drawH) / 2;
  ctx.drawImage(img, dx, dy, drawW, drawH);

  let currentQuality = quality;
  let result = canvas.toDataURL("image/jpeg", currentQuality);

  while (estimateBase64Bytes(result) > targetMaxBytes && currentQuality > 0.45) {
    currentQuality -= 0.08;
    result = canvas.toDataURL("image/jpeg", currentQuality);
  }

  return result;
}

function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not load image"));
    img.src = dataUrl;
  });
}

/** Approximate decoded byte size from a data URL. */
export function estimateBase64Bytes(dataUrl: string): number {
  const base64 = dataUrl.split(",")[1] ?? "";
  return Math.ceil((base64.length * 3) / 4);
}
