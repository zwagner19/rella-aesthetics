import { createHash } from "node:crypto";
import { existsSync, readFileSync, statSync } from "node:fs";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { beforeAfterResults, patientResultImages } from "./results";

function chunkTypes(image: Buffer) {
  const chunks: string[] = [];
  let offset = 12;
  while (offset + 8 <= image.length) {
    const type = image.subarray(offset, offset + 4).toString("ascii");
    const size = image.readUInt32LE(offset + 4);
    chunks.push(type);
    offset += 8 + size + (size % 2);
  }
  return chunks;
}

describe("labeled before-and-after result assets", () => {
  const assets = beforeAfterResults.flatMap((result) => [result.beforeSrc, result.afterSrc]);

  it("ships one before and one after image for every labeled treatment", () => {
    expect(beforeAfterResults).toHaveLength(15);
    expect(new Set(assets).size).toBe(30);
  });

  it("keeps every published result image unique, including the top cards", () => {
    const allAssets = [...patientResultImages.map((result) => result.src), ...assets];
    expect(new Set(allAssets).size).toBe(allAssets.length);

    const hashes = allAssets.map((asset) =>
      createHash("sha256").update(readFileSync(`public${asset}`)).digest("hex"),
    );
    expect(new Set(hashes).size).toBe(hashes.length);
  });

  it.each(assets)("keeps %s web-ready and metadata-free", async (asset) => {
    const path = `public${asset}`;
    expect(existsSync(path), `${path} must exist`).toBe(true);
    if (!existsSync(path)) return;

    const image = readFileSync(path);
    expect(image.subarray(0, 4).toString("ascii"), `${path} RIFF signature`).toBe("RIFF");
    expect(image.subarray(8, 12).toString("ascii"), `${path} WebP signature`).toBe("WEBP");
    expect(statSync(path).size, `${path} must be at most 500 KB`).toBeLessThanOrEqual(500 * 1024);

    const metadata = await sharp(image).metadata();
    expect(metadata.width, `${path} width`).toBe(1200);
    expect(metadata.height, `${path} height`).toBe(1500);
    expect(metadata.exif, `${path} must not contain EXIF`).toBeUndefined();
    expect(metadata.xmp, `${path} must not contain XMP`).toBeUndefined();
    expect(metadata.icc, `${path} must not contain an ICC profile`).toBeUndefined();
    expect(chunkTypes(image), `${path} must contain image data only`).not.toEqual(
      expect.arrayContaining(["EXIF", "XMP ", "ICCP"]),
    );
  });
});
