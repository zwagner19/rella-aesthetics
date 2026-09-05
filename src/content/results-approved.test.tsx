import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PatientResultImageGallery } from "@/components/blocks/PatientResultImageGallery";
import {
  approvedPatientResultImages,
  patientResultImages,
} from "./results";

const expectedTreatments = [
  "Lip Filler",
  "CoolPeel",
  "Microneedling + CoolPeel",
  "Botox",
  "3 sessions of CoolPeel 4 weeks apart",
  "Lips",
  "Deluxe HydraFacial",
  "Botox",
  "Under Eye Filler",
] as const;

describe("approved patient result gallery", () => {
  it("keeps the owner-confirmed 3x3 reading order and does not invent timeframes", () => {
    expect(patientResultImages.map((result) => result.treatment)).toEqual(
      expectedTreatments,
    );
    expect(patientResultImages).toHaveLength(9);

    for (const result of patientResultImages) {
      expect(result.status).toBe("approved");
      expect(result.placement).toContain("main-gallery");
      expect("timeframe" in result).toBe(false);
      expect(result.caption).toBe(
        "Patient result shared with permission. Individual results vary.",
      );
    }
  });

  it("ships nine distinct approved binaries and no duplicate asset references", () => {
    const assets = patientResultImages.map((result) => result.src);
    expect(new Set(assets).size).toBe(9);

    const hashes = assets.map((asset) => {
      const path = `public${asset}`;
      expect(existsSync(path), `${path} must exist`).toBe(true);
      return createHash("sha256").update(readFileSync(path)).digest("hex");
    });

    expect(new Set(hashes).size).toBe(9);
    expect(approvedPatientResultImages("main-gallery")).toEqual(
      patientResultImages,
    );
    expect(approvedPatientResultImages("weight-loss")).toEqual([]);
  });

  it("renders the approved labels and results disclaimer", () => {
    const html = renderToStaticMarkup(
      <PatientResultImageGallery results={patientResultImages} />,
    );

    for (const treatment of expectedTreatments) {
      expect(html).toContain(treatment);
    }
    expect(html).toContain("Real examples. Shared with permission.");
    expect(html).toContain(
      "Images are not a promise or guarantee of outcome.",
    );
  });
});
