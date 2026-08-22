import { describe, expect, it } from "vitest";
import sharp from "sharp";
import {
  applyDemoTreatmentEffect,
  addSimulationWatermark,
  blendConservative,
} from "@/lib/visualizer/conservative-blend";
import { buildLeadSource, scoreVisualizerLead } from "@/lib/visualizer/lead-scoring";
import { buildEditMaskPng } from "@/lib/visualizer/mask";
import { buildEditPrompt, buildAnalysisPrompt } from "@/lib/visualizer/prompts";
import {
  INTENSITY_BLEND,
  isValidBotoxZone,
  isValidLaserPigmentationZone,
} from "@/lib/visualizer/treatments";
import type { VisualizerLeadPayload } from "@/lib/visualizer/types";

describe("visualizer prompts", () => {
  it("builds conservative botox edit prompt with identity lock language", () => {
    const prompt = buildEditPrompt("botox", ["forehead", "glabella"], "subtle");
    expect(prompt).toContain("Preserve exact facial identity");
    expect(prompt).toContain("forehead");
    expect(prompt).toContain("very subtle");
  });

  it("builds conservative laser pigmentation edit prompt", () => {
    const prompt = buildEditPrompt("laser-pigmentation", ["cheeks", "forehead-spots"], "subtle");
    expect(prompt).toContain("laser/IPL pigmentation");
    expect(prompt).toContain("do NOT lighten overall ethnicity");
    expect(prompt).toContain("sun spots");
  });

  it("requests JSON-only face analysis schema for each treatment", () => {
    const botoxPrompt = buildAnalysisPrompt("botox");
    expect(botoxPrompt).toContain("Return ONLY valid JSON");
    expect(botoxPrompt).toContain("faceDetected");
    expect(botoxPrompt).toContain("forehead");

    const laserPrompt = buildAnalysisPrompt("laser-pigmentation");
    expect(laserPrompt).toContain("laser/IPL pigmentation");
    expect(laserPrompt).toContain("cheeks");
    expect(laserPrompt).toContain("overall-tone");
  });
});

describe("visualizer treatments", () => {
  it("validates botox zones", () => {
    expect(isValidBotoxZone("forehead")).toBe(true);
    expect(isValidBotoxZone("invalid")).toBe(false);
  });

  it("validates laser pigmentation zones", () => {
    expect(isValidLaserPigmentationZone("cheeks")).toBe(true);
    expect(isValidLaserPigmentationZone("overall-tone")).toBe(true);
    expect(isValidLaserPigmentationZone("forehead")).toBe(false);
  });

  it("uses lower blend weight for subtle preset", () => {
    expect(INTENSITY_BLEND.subtle).toBeLessThan(INTENSITY_BLEND.moderate);
  });
});

describe("visualizer mask", () => {
  it("builds a PNG mask buffer", async () => {
    const mask = await buildEditMaskPng(512, 512, [{ cx: 0.5, cy: 0.3, rx: 0.2, ry: 0.1 }]);
    const meta = await sharp(mask).metadata();
    expect(meta.format).toBe("png");
    expect(meta.width).toBe(512);
    expect(meta.height).toBe(512);
  });
});

describe("conservative blend", () => {
  async function solidImage(r: number, g: number, b: number): Promise<Buffer> {
    return sharp({
      create: { width: 256, height: 256, channels: 3, background: { r, g, b } },
    })
      .png()
      .toBuffer();
  }

  it("blends edited image toward original in masked regions", async () => {
    const original = await solidImage(200, 100, 100);
    const edited = await solidImage(50, 50, 200);
    const result = await blendConservative(original, edited, "botox", ["forehead"], "subtle");
    const meta = await sharp(result).metadata();
    expect(meta.format).toBe("png");
    expect(result.length).toBeGreaterThan(1000);
  });

  it("applies demo zone blur without throwing", async () => {
    const original = await solidImage(180, 140, 120);
    const result = await applyDemoTreatmentEffect(original, "botox", ["glabella"], "subtle");
    expect(result.length).toBeGreaterThan(1000);
  });

  it("adds simulation watermark", async () => {
    const original = await solidImage(120, 120, 120);
    const result = await addSimulationWatermark(original);
    expect(result.length).toBeGreaterThan(original.length);
  });
});

describe("visualizer lead scoring", () => {
  const basePayload: VisualizerLeadPayload = {
    sessionId: "test-session",
    name: "Jane Doe",
    email: "jane@example.com",
    treatmentType: "botox",
    zones: ["forehead"],
    intensity: "subtle",
    consent: true,
  };

  it("scores warm leads higher", () => {
    const warm = scoreVisualizerLead({
      ...basePayload,
      zones: ["forehead", "glabella", "crows-feet"],
      timeline: "within-2-weeks",
      budget: "ready-to-invest",
    });
    const cool = scoreVisualizerLead({
      ...basePayload,
      timeline: "exploring",
      budget: "exploring-budget",
    });
    expect(warm.score).toBeGreaterThan(cool.score);
    expect(warm.tags).toContain("ai-visualizer");
    expect(warm.tags).toContain("interest-botox");
  });

  it("tags laser pigmentation leads separately", () => {
    const laser = scoreVisualizerLead({
      ...basePayload,
      treatmentType: "laser-pigmentation",
      zones: ["cheeks", "forehead-spots"],
    });
    expect(laser.tags).toContain("interest-laser-pigmentation");
    expect(laser.tags).not.toContain("interest-botox");
  });

  it("builds a descriptive GHL source string", () => {
    const source = buildLeadSource({
      ...basePayload,
      goal: "Refresh forehead",
      timeline: "within-1-month",
      budget: "moderate",
    });
    expect(source).toContain("Rella Aesthetics AI Visualizer");
    expect(source).toContain("experiencerella.com");
    expect(source).toContain("test-session");
    expect(source).toContain("Refresh forehead");
  });
});
