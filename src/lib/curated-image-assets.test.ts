import { existsSync, readFileSync, statSync } from "node:fs";
import sharp from "sharp";
import { describe, expect, it } from "vitest";

const curatedWebpAssets = [
  "public/images/clinic/rella-consultation.webp",
  "public/images/clinic/rella-sidewalk-sign.webp",
  "public/images/clinic/rella-team-storefront.webp",
  "public/images/clinic/napa-exterior.webp",
  "public/images/clinic/vacaville-exterior.webp",
  "public/images/treatments/botox-dysport.webp",
  "public/images/treatments/chemical-peel.webp",
  "public/images/treatments/dermal-fillers.webp",
  "public/images/treatments/facial.webp",
  "public/images/treatments/hydrafacial.webp",
  "public/images/treatments/iv-hydration.webp",
  "public/images/treatments/laser-treatment.webp",
  "public/images/treatments/medical-weight-loss.webp",
  "public/images/treatments/microneedling-aftercare.webp",
] as const;

const ownerSuppliedFourByThreeAssets = [
  "public/images/clinic/napa-exterior.webp",
  "public/images/treatments/iv-hydration.webp",
  "public/images/treatments/medical-weight-loss.webp",
] as const;

const ownerSuppliedFourByFiveAssets = [
  "public/images/clinic/rella-sidewalk-sign.webp",
  "public/images/clinic/vacaville-exterior.webp",
] as const;

const teamHeadshots = [
  "public/images/team/anna-johnson.jpg",
  "public/images/team/ayano.jpg",
  "public/images/team/devyn.jpg",
  "public/images/team/marisa-avalos.jpg",
  "public/images/team/michaela.jpg",
  "public/images/team/natalie.jpg",
  "public/images/team/paula.jpg",
  "public/images/team/pia-tiaoqui.jpg",
  "public/images/team/ryan.jpg",
  "public/images/team/sandra-maldonado.jpg",
  "public/images/team/warda-harchaoui.jpg",
] as const;

function readWebpChunkTypes(image: Buffer) {
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

describe("curated clinic and treatment image integrity", () => {
  it.each(curatedWebpAssets)("keeps %s web-ready and metadata-free", async (path) => {
    expect(existsSync(path), `${path} must exist`).toBe(true);
    if (!existsSync(path)) return;

    const image = readFileSync(path);
    expect(image.subarray(0, 4).toString("ascii"), `${path} RIFF signature`).toBe("RIFF");
    expect(image.subarray(8, 12).toString("ascii"), `${path} WebP signature`).toBe("WEBP");
    expect(statSync(path).size, `${path} must be at most 500 KB`).toBeLessThanOrEqual(
      500 * 1024,
    );

    const metadata = await sharp(image).metadata();
    expect(metadata.width, `${path} width`).toBeGreaterThanOrEqual(850);
    expect(metadata.height, `${path} height`).toBeGreaterThanOrEqual(900);
    expect(metadata.exif, `${path} must not contain EXIF`).toBeUndefined();
    expect(metadata.xmp, `${path} must not contain XMP`).toBeUndefined();
    expect(metadata.icc, `${path} must not contain an ICC profile`).toBeUndefined();
    expect(readWebpChunkTypes(image), `${path} must contain image data only`).not.toEqual(
      expect.arrayContaining(["EXIF", "XMP ", "ICCP"]),
    );
  });

  it.each(ownerSuppliedFourByThreeAssets)("keeps %s at the approved 4:3 crop", async (path) => {
    expect(existsSync(path), `${path} must exist`).toBe(true);
    if (!existsSync(path)) return;

    const metadata = await sharp(path).metadata();
    const width = metadata.width ?? 0;
    const height = metadata.height ?? 0;
    expect(width * 3, `${path} must be exactly 4:3`).toBe(height * 4);
  });

  it.each(ownerSuppliedFourByFiveAssets)("keeps %s at the approved 4:5 crop", async (path) => {
    expect(existsSync(path), `${path} must exist`).toBe(true);
    if (!existsSync(path)) return;

    const metadata = await sharp(path).metadata();
    const width = metadata.width ?? 0;
    const height = metadata.height ?? 0;
    expect(width * 5, `${path} must be exactly 4:5`).toBe(height * 4);
  });

  it.each(teamHeadshots)("keeps %s free of private source metadata", async (path) => {
    expect(existsSync(path), `${path} must exist`).toBe(true);
    if (!existsSync(path)) return;

    const image = readFileSync(path);
    expect([...image.subarray(0, 3)], `${path} JPEG signature`).toEqual([0xff, 0xd8, 0xff]);

    const metadata = await sharp(image).metadata();
    expect(metadata.exif, `${path} must not contain EXIF or GPS data`).toBeUndefined();
    expect(metadata.xmp, `${path} must not contain XMP`).toBeUndefined();
  });
});
