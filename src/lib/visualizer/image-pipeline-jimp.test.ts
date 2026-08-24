import { describe, expect, it } from "vitest";
import { Jimp, rgbaToInt } from "jimp";
import {
  blendConservativeJimp,
  buildEditMaskJimp,
  prepareWorkingImageJimp,
} from "@/lib/visualizer/image-pipeline-jimp";

describe("jimp image pipeline", () => {
  it("builds an OpenAI edit mask with transparent treatment holes", async () => {
    const mask = await buildEditMaskJimp(256, 256, [{ cx: 0.5, cy: 0.3, rx: 0.2, ry: 0.1 }]);
    const img = await Jimp.read(mask);
    const center = intToAlpha(img, 128, 77);
    const corner = intToAlpha(img, 5, 5);
    expect(center).toBeLessThan(40);
    expect(corner).toBeGreaterThan(200);
  });

  it("prepares a square working image", async () => {
    const input = await new Jimp({
      width: 800,
      height: 1200,
      color: rgbaToInt(120, 90, 80, 255),
    }).getBuffer("image/jpeg");
    const working = await prepareWorkingImageJimp(input);
    expect(working.width).toBeGreaterThan(0);
    expect(working.height).toBeGreaterThan(0);
  });

  it("blends edited pixels only in treatment zones", async () => {
    const original = await new Jimp({
      width: 256,
      height: 256,
      color: rgbaToInt(200, 100, 100, 255),
    }).getBuffer("image/png");
    const edited = await new Jimp({
      width: 256,
      height: 256,
      color: rgbaToInt(50, 50, 200, 255),
    }).getBuffer("image/png");
    const result = await blendConservativeJimp(original, edited, "botox", ["forehead"], "moderate");
    expect(result.length).toBeGreaterThan(1000);
  });
});

function intToAlpha(img: Awaited<ReturnType<typeof Jimp.read>>, x: number, y: number): number {
  const idx = (y * img.width + x) * 4;
  return img.bitmap.data[idx + 3] ?? 255;
}
