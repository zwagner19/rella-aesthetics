/**
 * The shared, editor-facing before-and-after manifest for both Rella websites.
 *
 * Keep patient names, consent forms, dates of birth, appointment details, and
 * other protected information out of this repository. A result is rendered
 * only after its status is changed to `approved`; that status means the signed
 * public-use authorization was verified in Rella's private records.
 */

export type ResultPlacement = "main-gallery" | "weight-loss";
export type ResultStatus = "draft" | "approved";

export interface BeforeAfterResult {
  id: string;
  status: ResultStatus;
  placement: readonly ResultPlacement[];
  treatment: string;
  timeframe: string;
  beforeSrc: `/${string}`;
  afterSrc: `/${string}`;
  beforeAlt: string;
  afterAlt: string;
  caption: string;
}

export interface PatientResultImage {
  id: string;
  status: ResultStatus;
  placement: readonly ResultPlacement[];
  src: `/${string}`;
  alt: string;
  caption: string;
}

export const patientResultImages: readonly PatientResultImage[] = [
  ...Array.from({ length: 9 }, (_, index) => ({
    id: `patient-result-${String(index + 1).padStart(2, "0")}`,
    status: "approved" as const,
    placement: ["main-gallery"] as const,
    src: `/images/results/patient-submissions/result-${String(index + 1).padStart(2, "0")}.jpg` as `/${string}`,
    alt: "Patient before-and-after result photo shared with Rella Aesthetics",
    caption: "Patient result shared with permission. Treatment details and timing are being confirmed.",
  })),
];
/**
 * Add new results here as `draft`. Do not change one to `approved` until Rella
 * has verified written permission for public marketing use.
 *
 * Example (keep commented until real, consented assets are available):
 * {
 *   id: "weight-loss-01",
 *   status: "draft",
 *   placement: ["weight-loss", "main-gallery"],
 *   treatment: "Medical weight management",
 *   timeframe: "After 6 months",
 *   beforeSrc: "/images/results/weight-loss/weight-loss-01-before.jpg",
 *   afterSrc: "/images/results/weight-loss/weight-loss-01-after.jpg",
 *   beforeAlt: "Before medical weight-management treatment",
 *   afterAlt: "Six months after beginning medical weight-management treatment",
 *   caption: "Treatment and results are individual. Individual results vary.",
 * },
 */
export const beforeAfterResults: readonly BeforeAfterResult[] = [];

export function visibleResultsFor(
  results: readonly BeforeAfterResult[],
  placement: ResultPlacement,
): readonly BeforeAfterResult[] {
  return results.filter(
    (result) => result.status === "approved" && result.placement.includes(placement),
  );
}

export function resultPublishingIssues(result: BeforeAfterResult): readonly string[] {
  if (result.status !== "approved") return [];

  const issues: string[] = [];
  if (!result.treatment.trim()) issues.push("treatment");
  if (!result.timeframe.trim()) issues.push("timeframe");
  if (!result.beforeAlt.trim()) issues.push("beforeAlt");
  if (!result.afterAlt.trim()) issues.push("afterAlt");
  if (!result.caption.trim()) issues.push("caption");
  if (!result.beforeSrc.includes("-before.")) issues.push("beforeSrc naming");
  if (!result.afterSrc.includes("-after.")) issues.push("afterSrc naming");
  return issues;
}

const invalidApprovedResults = beforeAfterResults.flatMap((result) =>
  resultPublishingIssues(result).map((issue) => `${result.id}: ${issue}`),
);

if (invalidApprovedResults.length > 0) {
  throw new Error(`Approved before-and-after content is incomplete: ${invalidApprovedResults.join(", ")}`);
}

export function approvedResultsFor(placement: ResultPlacement): readonly BeforeAfterResult[] {
  return visibleResultsFor(beforeAfterResults, placement);
}

export function approvedPatientResultImages(placement: ResultPlacement): readonly PatientResultImage[] {
  return patientResultImages.filter(
    (result) => result.status === "approved" && result.placement.includes(placement),
  );
}
