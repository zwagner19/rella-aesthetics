import { getSharp } from "./sharp-loader";
import type { MaskRegion, TreatmentType, TreatmentZoneId } from "./types";
import { resolveZoneRegions } from "./treatments";

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

export { resolveZoneRegions } from "./treatments";

/**
 * OpenAI images.edit mask:
 * - Fully transparent (alpha 0) = areas to EDIT
 * - Opaque = areas to PRESERVE
 *
 * Treatment zones are punched out as transparent holes.
 */
export async function buildEditMaskPng(
  width: number,
  height: number,
  regions: MaskRegion[]
): Promise<Buffer> {
  const sharp = await getSharp();

  // Opaque black canvas = preserve everywhere by default.
  const preserveAll = await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 1 },
    },
  })
    .png()
    .toBuffer();

  // White ellipses mark treatment zones; dest-out clears alpha there → edit.
  const holesSvg = ellipseSvg(width, height, regions, "white");
  const holes = await sharp(Buffer.from(holesSvg)).ensureAlpha().png().toBuffer();

  return sharp(preserveAll)
    .composite([{ input: holes, blend: "dest-out" }])
    .png()
    .toBuffer();
}

/** Blend mask: white = apply edit weight, black = keep original. */
export async function buildBlendMaskPng(
  width: number,
  height: number,
  regions: MaskRegion[]
): Promise<Buffer> {
  const sharp = await getSharp();
  // Soften edges slightly so blends aren't hard ovals.
  const svg = ellipseSvg(width, height, regions, "white");
  return sharp(Buffer.from(svg))
    .blur(8)
    .png()
    .toBuffer();
}

export function regionsFromAnalysis(
  treatmentType: TreatmentType,
  zones: TreatmentZoneId[],
  overrides?: Partial<Record<TreatmentZoneId, MaskRegion>>
): MaskRegion[] {
  return resolveZoneRegions(treatmentType, zones, overrides);
}
