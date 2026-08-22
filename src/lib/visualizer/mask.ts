import { getSharp } from "./sharp-loader";
import { DEFAULT_ZONE_REGIONS } from "./treatments";
import type { BotoxZone, MaskRegion } from "./types";

function ellipseSvg(
  width: number,
  height: number,
  regions: MaskRegion[],
  fill: string
): string {
  const ellipses = regions
    .map((r) => {
      const cx = r.cx * width;
      const cy = r.cy * height;
      const rx = r.rx * width;
      const ry = r.ry * height;
      return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" />`;
    })
    .join("");

  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">${ellipses}</svg>`;
}

export function resolveZoneRegions(
  zones: BotoxZone[],
  overrides?: Partial<Record<BotoxZone, MaskRegion>>
): MaskRegion[] {
  const regions: MaskRegion[] = [];
  for (const zone of zones) {
    if (overrides?.[zone]) {
      regions.push(overrides[zone]!);
      continue;
    }
    regions.push(...DEFAULT_ZONE_REGIONS[zone]);
  }
  return regions;
}

/** OpenAI edit mask: transparent = preserve, opaque white = edit. */
export async function buildEditMaskPng(
  width: number,
  height: number,
  regions: MaskRegion[]
): Promise<Buffer> {
  const sharp = await getSharp();
  const svg = ellipseSvg(width, height, regions, "white");
  return sharp(Buffer.from(svg)).png().toBuffer();
}

/** Blend mask: white = apply edit weight, black = keep original. */
export async function buildBlendMaskPng(
  width: number,
  height: number,
  regions: MaskRegion[]
): Promise<Buffer> {
  const sharp = await getSharp();
  const svg = ellipseSvg(width, height, regions, "white");
  return sharp(Buffer.from(svg)).png().toBuffer();
}
