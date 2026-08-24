import { describe, expect, it } from "vitest";
import sharp from "sharp";
import { pickEditSize, prepareWorkingImage } from "@/lib/visualizer/working-image";

describe("working image", () => {
  it("picks portrait OpenAI size for tall selfies", () => {
    expect(pickEditSize(900, 1600)).toBe("1024x1536");
    expect(pickEditSize(1600, 900)).toBe("1536x1024");
    expect(pickEditSize(1000, 1000)).toBe("1024x1024");
  });

  it("center-crops to a fixed OpenAI canvas", async () => {
    const input = await sharp({
      create: { width: 800, height: 1200, channels: 3, background: { r: 120, g: 90, b: 80 } },
    })
      .jpeg()
      .toBuffer();

    const working = await prepareWorkingImage(input);
    expect(working.size).toBe("1024x1536");
    expect(working.width).toBe(1024);
    expect(working.height).toBe(1536);
    const meta = await sharp(working.buffer).metadata();
    expect(meta.width).toBe(1024);
    expect(meta.height).toBe(1536);
  });
});
