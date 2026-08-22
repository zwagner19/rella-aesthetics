/** Client-side image compression before API upload (avoids 413 on Vercel). */

const MAX_EDGE_PX = 1024;
const JPEG_QUALITY = 0.82;
/** Target max base64 payload ~1.5MB to stay under Vercel's ~4.5MB function limit. */
const TARGET_MAX_BYTES = 1_200_000;

export interface CompressOptions {
  maxEdgePx?: number;
  quality?: number;
  targetMaxBytes?: number;
}

export async function compressImageForUpload(
  dataUrl: string,
  options: CompressOptions = {}
): Promise<string> {
  const maxEdgePx = options.maxEdgePx ?? MAX_EDGE_PX;
  const quality = options.quality ?? JPEG_QUALITY;
  const targetMaxBytes = options.targetMaxBytes ?? TARGET_MAX_BYTES;

  const img = await loadImage(dataUrl);
  const { width, height } = fitWithin(img.width, img.height, maxEdgePx);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not prepare image for upload");

  ctx.drawImage(img, 0, 0, width, height);

  let currentQuality = quality;
  let result = canvas.toDataURL("image/jpeg", currentQuality);

  while (estimateBase64Bytes(result) > targetMaxBytes && currentQuality > 0.45) {
    currentQuality -= 0.08;
    result = canvas.toDataURL("image/jpeg", currentQuality);
  }

  if (estimateBase64Bytes(result) > targetMaxBytes) {
    const smaller = fitWithin(width, height, Math.round(maxEdgePx * 0.75));
    canvas.width = smaller.width;
    canvas.height = smaller.height;
    ctx.drawImage(img, 0, 0, smaller.width, smaller.height);
    result = canvas.toDataURL("image/jpeg", 0.75);
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

function fitWithin(
  width: number,
  height: number,
  maxEdge: number
): { width: number; height: number } {
  if (width <= maxEdge && height <= maxEdge) return { width, height };
  const scale = maxEdge / Math.max(width, height);
  return {
    width: Math.round(width * scale),
    height: Math.round(height * scale),
  };
}

/** Approximate decoded byte size from a data URL. */
export function estimateBase64Bytes(dataUrl: string): number {
  const base64 = dataUrl.split(",")[1] ?? "";
  return Math.ceil((base64.length * 3) / 4);
}
