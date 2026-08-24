import { MAX_IMAGE_BYTES } from "@/lib/visualizer/treatments";

export interface ParsedImageData {
  buffer: Buffer;
  mimeType: string;
}

const MIME_BY_EXT: Record<string, string> = {
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

export function parseDataUrl(dataUrl: string): ParsedImageData {
  const match = /^data:(image\/(?:jpeg|jpg|png|webp));base64,(.+)$/i.exec(dataUrl);
  if (!match) {
    throw new Error("Invalid image data URL");
  }

  const mimeType = match[1].toLowerCase().replace("jpg", "jpeg");
  const base64 = match[2];
  const buffer = Buffer.from(base64, "base64");

  if (buffer.length > MAX_IMAGE_BYTES) {
    throw new Error("Image exceeds maximum size of 8MB");
  }

  return { buffer, mimeType };
}

export function bufferToDataUrl(buffer: Buffer, mimeType = "image/png"): string {
  return `data:${mimeType};base64,${buffer.toString("base64")}`;
}

export function extensionForMime(mimeType: string): string {
  if (mimeType.includes("png")) return "png";
  if (mimeType.includes("webp")) return "webp";
  return "jpg";
}

export async function optionalBlobUpload(
  buffer: Buffer,
  pathname: string,
  mimeType: string
): Promise<string | undefined> {
  const token = process.env.VISUALIZER_BLOB_READ_WRITE_TOKEN;
  if (!token) return undefined;

  const { put } = await import("@vercel/blob");
  const blob = await put(pathname, buffer, {
    access: "public",
    token,
    contentType: mimeType,
    addRandomSuffix: true,
  });
  return blob.url;
}
